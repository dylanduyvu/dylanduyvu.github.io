import { constants } from 'node:fs';
import {
  lstat,
  open,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';

import { METHOD } from '../config.mjs';
import { verifyAdjudicationGate } from './adjudication-lock.mjs';
import { verifyAttemptRecord } from './attempt-store.mjs';
import { canonicalJson, sha256, writeImmutable } from './immutable.mjs';
import { verifyFrozenRun } from './locks.mjs';
import { verifyPrepared } from './prepare.mjs';
import {
  buildScorePackage,
  renderFinalReport,
  renderPreliminaryReport,
  validateInterpretationRecord,
} from './report.mjs';
import { runRunnerCommand } from './runner.mjs';
import { scoreSlot } from './scoring.mjs';

const SHA256 = /^[0-9a-f]{64}$/u;
const SLOT_ID = /^NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])$/u;
const TARGET_ID = /^NAP-V5-TARGET-(?:0[1-9]|1[01])-R1$/u;
const CONDITIONS = new Set(['state_only', 'state_plus_hybrid_history']);
const TERMINAL_STATES = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_failure',
]);
const ATTEMPT_CLASSIFICATIONS = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_retry',
]);
const TERMINAL_KEYS = [
  'version',
  'slot_ordinal',
  'terminal_state',
  'classification',
  'code',
  'authoritative_attempt_ordinal',
  'latency_ms',
];
const ATTEMPT_METADATA_KEYS = [
  'version',
  'slot_ordinal',
  'attempt_ordinal',
  'attempt_record_sha256',
  'classification',
  'code',
  'latency_ms',
];
const COMPLETION_KEYS = [
  'version',
  'scheduled_slot_count',
  'terminal_slot_count',
  'terminal_records',
];
const COMPLETION_ENTRY_KEYS = [
  'slot_ordinal',
  'terminal_record_sha256',
];
const REVEALED_BASE = Object.freeze([
  'PRELIMINARY-REPORT.md',
  'score-package.json',
  'slot-results.json',
]);
const REVEALED_FINAL = Object.freeze([
  ...REVEALED_BASE,
  'FINAL-REPORT.md',
  'interpretation.json',
].sort());

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, expected, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length
    || actual.some((key, index) => key !== wanted[index])) {
    throw new Error(`${label} must contain the exact keys`);
  }
}

function sameSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.mode === right.mode
    && left.nlink === right.nlink
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

async function assertDirectoryChain(root, filename, label) {
  const relative = path.relative(root, path.dirname(filename));
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes the runtime root`);
  }
  let current = root;
  for (const component of relative === '' ? [] : relative.split(path.sep)) {
    current = path.join(current, component);
    const stat = await lstat(current, { bigint: true });
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(`${label} has a symlinked or non-directory ancestor`);
    }
  }
}

async function readPrivate(root, relativePath, label) {
  const filename = path.join(root, ...relativePath.split('/'));
  await assertDirectoryChain(root, filename, label);
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink()
    || !pathStat.isFile()
    || pathStat.nlink !== 1n
    || (pathStat.mode & 0o777n) !== 0o600n) {
    throw new Error(`${label} must be one private mode-0600 regular file`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!sameSnapshot(pathStat, before)) throw new Error(`${label} changed before read`);
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(filename, { bigint: true });
    if (!sameSnapshot(before, after) || !sameSnapshot(after, pathAfter)) {
      throw new Error(`${label} changed while read`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

async function optionalPrivate(root, relativePath, label) {
  try {
    return await readPrivate(root, relativePath, label);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function parseCanonical(bytes, label) {
  let value;
  try {
    value = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON`, { cause: error });
  }
  if (canonicalJson(value) !== bytes.toString('utf8')) {
    throw new Error(`${label} is not canonical JSON`);
  }
  return value;
}

async function readJson(root, relativePath, label) {
  return parseCanonical(await readPrivate(root, relativePath, label), label);
}

function validateTarget(value, label) {
  assertExactKeys(value, ['app', 'object', 'subtarget'], label);
  if (typeof value.app !== 'string' || value.app.length === 0
    || (value.object !== null && (typeof value.object !== 'string' || value.object.length === 0))
    || (value.subtarget !== null && (typeof value.subtarget !== 'string' || value.subtarget.length === 0))
    || (value.object === null && value.subtarget !== null)) {
    throw new Error(`${label} has an invalid target shape`);
  }
  return structuredClone(value);
}

function validateSchedule(schedule) {
  assertExactKeys(schedule, [
    'version',
    'target_count',
    'scheduled_slot_count',
    'conditions',
    'first_condition_balance',
    'slots',
  ], 'Frozen schedule');
  if (schedule.version !== 1
    || schedule.target_count !== METHOD.targetCount
    || schedule.scheduled_slot_count !== METHOD.scheduledSlotCount
    || !Array.isArray(schedule.slots)
    || schedule.slots.length !== METHOD.scheduledSlotCount) {
    throw new Error(
      `Frozen schedule must contain exactly ${METHOD.targetCount} targets and ${METHOD.scheduledSlotCount} slots`,
    );
  }
  schedule.slots.forEach((slot, index) => {
    assertExactKeys(slot, [
      'slot_ordinal',
      'slot_id',
      'target_ordinal',
      'target_id',
      'target_chronology_index',
      'pair_position',
      'condition',
    ], `Schedule slot ${index + 1}`);
    const ordinal = index + 1;
    if (slot.slot_ordinal !== ordinal
      || slot.slot_id !== `NAP-V5-SLOT-${String(ordinal).padStart(2, '0')}`
      || !SLOT_ID.test(slot.slot_id)
      || !TARGET_ID.test(slot.target_id)
      || !Number.isSafeInteger(slot.target_ordinal)
      || slot.target_ordinal !== Math.floor(index / 2) + 1
      || !CONDITIONS.has(slot.condition)) {
      throw new Error(`Schedule slot ${index + 1} identity is invalid`);
    }
  });
  return schedule;
}

function validateTerminal(value, slotOrdinal) {
  assertExactKeys(value, TERMINAL_KEYS, `Terminal slot ${slotOrdinal}`);
  if (value.version !== 1
    || value.slot_ordinal !== slotOrdinal
    || !TERMINAL_STATES.has(value.terminal_state)
    || !ATTEMPT_CLASSIFICATIONS.has(value.classification)
    || !Number.isSafeInteger(value.authoritative_attempt_ordinal)
    || value.authoritative_attempt_ordinal < 1
    || value.authoritative_attempt_ordinal > 3
    || (value.latency_ms !== null
      && (!Number.isSafeInteger(value.latency_ms) || value.latency_ms < 0))) {
    throw new Error(`Terminal slot ${slotOrdinal} is invalid`);
  }
  return value;
}

function validateAttemptMetadata(value, slotOrdinal, attemptOrdinal) {
  assertExactKeys(
    value,
    ATTEMPT_METADATA_KEYS,
    `Attempt metadata ${slotOrdinal}.${attemptOrdinal}`,
  );
  if (value.version !== 1
    || value.slot_ordinal !== slotOrdinal
    || value.attempt_ordinal !== attemptOrdinal
    || !SHA256.test(value.attempt_record_sha256)
    || !ATTEMPT_CLASSIFICATIONS.has(value.classification)
    || (value.latency_ms !== null
      && (!Number.isSafeInteger(value.latency_ms) || value.latency_ms < 0))) {
    throw new Error(`Attempt metadata ${slotOrdinal}.${attemptOrdinal} is invalid`);
  }
  return value;
}

async function verifyOneAttempt(root, slot, attemptOrdinal) {
  const attemptName = `attempt-${String(attemptOrdinal).padStart(3, '0')}`;
  const attemptRelative = `sealed-attempts/${slot.slot_id}/${attemptName}`;
  const attemptPath = path.join(root, ...attemptRelative.split('/'));
  const metadata = validateAttemptMetadata(
    await readJson(
      root,
      `sealed-attempts/slot-state/${slot.slot_id}/${attemptName}.json`,
      `Attempt metadata ${slot.slot_id}/${attemptName}`,
    ),
    slot.slot_ordinal,
    attemptOrdinal,
  );
  const recordBytes = await readPrivate(
    root,
    `${attemptRelative}/record.json`,
    `Attempt record ${slot.slot_id}/${attemptName}`,
  );
  if (sha256(recordBytes) !== metadata.attempt_record_sha256) {
    throw new Error(`Attempt record hash differs for ${slot.slot_id}/${attemptName}`);
  }
  const verified = await verifyAttemptRecord(attemptPath);
  if (verified.classification.classification !== metadata.classification
    || verified.classification.code !== metadata.code) {
    throw new Error(`Attempt classification differs for ${slot.slot_id}/${attemptName}`);
  }
  return {
    attempt_ordinal: attemptOrdinal,
    attempt_path: attemptPath,
    classification: verified.classification,
    latency_ms: metadata.latency_ms,
  };
}

async function verifiedRunnerReceipt(root, preparedIo) {
  let receipt;
  await runRunnerCommand({
    root,
    command: 'verify-attempts',
    io: {
      verifyFrozenRun: (options) => verifyFrozenRun(options),
      verifyPrepared: (options) => verifyPrepared({
        ...options,
        io: preparedIo,
      }),
      writeOutput: (text) => {
        receipt = JSON.parse(text);
      },
    },
  });
  if (receipt?.completed_slots !== METHOD.scheduledSlotCount
    || receipt.scheduled_slots !== METHOD.scheduledSlotCount) {
    throw new Error(
      `Terminal verification does not cover all ${METHOD.scheduledSlotCount} slots`,
    );
  }
}

export async function verifyTerminalRun({
  root,
  preparedIo = {},
} = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Terminal verification root must be absolute');
  }
  const resolvedRoot = path.resolve(root);
  await verifiedRunnerReceipt(resolvedRoot, preparedIo);
  const schedule = validateSchedule(await readJson(
    resolvedRoot,
    'evaluator/schedule.json',
    'Frozen schedule',
  ));
  const completionBytes = await readPrivate(
    resolvedRoot,
    'locks/all-slots-terminal.json',
    'All-slots terminal seal',
  );
  const completion = parseCanonical(completionBytes, 'All-slots terminal seal');
  assertExactKeys(completion, COMPLETION_KEYS, 'All-slots terminal seal');
  if (completion.version !== 1
    || completion.scheduled_slot_count !== METHOD.scheduledSlotCount
    || completion.terminal_slot_count !== METHOD.scheduledSlotCount
    || !Array.isArray(completion.terminal_records)
    || completion.terminal_records.length !== METHOD.scheduledSlotCount) {
    throw new Error('All-slots terminal seal is incomplete');
  }

  const slots = [];
  for (const [index, slot] of schedule.slots.entries()) {
    const sealEntry = completion.terminal_records[index];
    assertExactKeys(sealEntry, COMPLETION_ENTRY_KEYS, `Completion entry ${index + 1}`);
    const terminalBytes = await readPrivate(
      resolvedRoot,
      `sealed-attempts/slot-state/${slot.slot_id}/terminal.json`,
      `Terminal record ${slot.slot_id}`,
    );
    if (sealEntry.slot_ordinal !== slot.slot_ordinal
      || !SHA256.test(sealEntry.terminal_record_sha256)
      || sealEntry.terminal_record_sha256 !== sha256(terminalBytes)) {
      throw new Error(`Completion seal differs for ${slot.slot_id}`);
    }
    const terminal = validateTerminal(
      parseCanonical(terminalBytes, `Terminal record ${slot.slot_id}`),
      slot.slot_ordinal,
    );
    const attempts = [];
    for (
      let attemptOrdinal = 1;
      attemptOrdinal <= terminal.authoritative_attempt_ordinal;
      attemptOrdinal += 1
    ) {
      attempts.push(await verifyOneAttempt(
        resolvedRoot,
        slot,
        attemptOrdinal,
      ));
    }
    if (terminal.terminal_state === 'valid_final'
      && attempts.at(-1).classification.classification !== 'valid_final') {
      throw new Error(`Valid-final terminal does not join to a valid final at ${slot.slot_id}`);
    }
    slots.push({
      slot: structuredClone(slot),
      terminal: structuredClone(terminal),
      attempts,
      attempt_path: terminal.terminal_state === 'valid_final'
        ? attempts.at(-1).attempt_path
        : null,
    });
  }
  return Object.freeze({
    version: 1,
    completion_marker_sha256: sha256(completionBytes),
    terminal_slot_count: METHOD.scheduledSlotCount,
    slots,
  });
}

function validateAuthorities(manifest, catalog) {
  assertExactKeys(
    manifest,
    ['version', 'source_hashes', 'provenance', 'targets'],
    'Evaluator manifest',
  );
  assertExactKeys(
    catalog,
    ['version', 'source_hashes', 'approval_provenance', 'targets'],
    'Target catalog',
  );
  if (manifest.version !== 1
    || catalog.version !== 1
    || !Array.isArray(manifest.targets)
    || !Array.isArray(catalog.targets)
    || manifest.targets.length !== METHOD.targetCount
    || catalog.targets.length !== METHOD.targetCount) {
    throw new Error(
      `Evaluator manifest and target catalog must contain ${METHOD.targetCount} targets`,
    );
  }
  const targets = manifest.targets.map((entry, index) => {
    const catalogEntry = catalog.targets[index];
    const targetOrdinal = index + 1;
    const targetId = `NAP-V5-TARGET-${String(targetOrdinal).padStart(2, '0')}-R1`;
    if (entry.target_ordinal !== targetOrdinal
      || entry.target_id !== targetId
      || catalogEntry.target_ordinal !== targetOrdinal
      || catalogEntry.target_id !== targetId
      || catalogEntry.revision !== 1
      || !['focus', 'activate'].includes(entry.ground_truth_action_type)
      || !SHA256.test(entry.current_evidence_sha256)
      || !Array.isArray(catalogEntry.accepted_variants)
      || catalogEntry.accepted_variants.length < 1) {
      throw new Error(`Evaluator target authority is invalid at ${targetId}`);
    }
    return {
      target_ordinal: targetOrdinal,
      target_id: targetId,
      revision: targetId,
      observed_target: validateTarget(
        entry.ground_truth_target,
        `Observed target ${targetId}`,
      ),
      observed_action_type: entry.ground_truth_action_type,
      current_image_sha256: entry.current_evidence_sha256,
      accepted_variants: catalogEntry.accepted_variants.map(
        (variant, variantIndex) => validateTarget(
          variant,
          `Accepted variant ${targetId}.${variantIndex + 1}`,
        ),
      ),
    };
  });
  return targets;
}

async function loadAuthorities(root) {
  const [manifest, catalog] = await Promise.all([
    readJson(root, 'evaluator/evaluator-manifest.json', 'Evaluator manifest'),
    readJson(root, 'evaluator/target-catalog.json', 'Target catalog'),
  ]);
  return validateAuthorities(manifest, catalog);
}

async function currentImage(root, slot, authority) {
  const relativePath = [
    'contexts',
    String(slot.target_ordinal).padStart(3, '0'),
    slot.condition,
    'current.png',
  ].join('/');
  const bytes = await readPrivate(root, relativePath, `Current image ${slot.slot_id}`);
  if (sha256(bytes) !== authority.current_image_sha256) {
    throw new Error(`Current image hash differs for ${slot.slot_id}`);
  }
  return {
    path: path.join(root, ...relativePath.split('/')),
    sha256: authority.current_image_sha256,
  };
}

export async function loadAdjudicationInputs({
  root,
  slotIds,
  preparedIo = {},
} = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root) || !Array.isArray(slotIds)) {
    throw new TypeError('Adjudication input root and slot IDs are required');
  }
  const terminal = await verifyTerminalRun({ root, preparedIo });
  const requested = new Set(slotIds);
  if (requested.size !== slotIds.length
    || slotIds.some((slotId) => !SLOT_ID.test(slotId))) {
    throw new Error('Adjudication input slot IDs are invalid or duplicated');
  }
  const authorities = await loadAuthorities(root);
  const values = [];
  for (const detail of terminal.slots) {
    if (!requested.has(detail.slot.slot_id)) continue;
    if (detail.terminal.terminal_state !== 'valid_final') {
      throw new Error('Adjudication inputs may include only valid-final slots');
    }
    const authority = authorities[detail.slot.target_ordinal - 1];
    const image = await currentImage(root, detail.slot, authority);
    values.push({
      slot_id: detail.slot.slot_id,
      slot_ordinal: detail.slot.slot_ordinal,
      condition: detail.slot.condition,
      target_id: detail.slot.target_id,
      target_ordinal: detail.slot.target_ordinal,
      current_image_sha256: image.sha256,
      current_image_path: image.path,
      target_revision: authority.revision,
      observed_target: structuredClone(authority.observed_target),
      accepted_variants: structuredClone(authority.accepted_variants),
    });
  }
  if (values.length !== slotIds.length
    || values.some((entry, index) => entry.slot_id !== slotIds[index])) {
    throw new Error('Adjudication input slots do not match the requested terminal order');
  }
  return values;
}

export function blindRuntimeDependencies({
  preparedIo = {},
} = {}) {
  return Object.freeze({
    verifyFrozenRun: async (options) => {
      await verifyFrozenRun(options);
      return true;
    },
    verifyPrepared: (options) => verifyPrepared({
      ...options,
      io: preparedIo,
    }),
    verifyAttemptRecord,
    loadAdjudicationInputs: ({ root, slotIds }) => loadAdjudicationInputs({
      root,
      slotIds,
      preparedIo,
    }),
  });
}

function addDecision(map, ref, decision, label) {
  const key = `${ref.slot_id}:${ref.rank}`;
  if (map.has(key) && map.get(key) !== decision) {
    throw new Error(`${label} has conflicting decisions for ${key}`);
  }
  map.set(key, decision);
}

function decisionMaps(gate) {
  const semantic = new Map();
  const usefulness = new Map();
  for (const candidate of gate.semantic) {
    for (const ref of candidate.refs) {
      addDecision(semantic, ref, candidate.decision, 'Semantic adjudication');
    }
  }
  for (const candidate of gate.usefulness) {
    for (const ref of candidate.refs) {
      addDecision(usefulness, ref, candidate.decision, 'Usefulness adjudication');
    }
  }
  return { semantic, usefulness };
}

function operationAttempt(detail) {
  const usage = detail.classification.usage;
  return {
    attempt_ordinal: detail.attempt_ordinal,
    classification: detail.classification.classification,
    input_tokens: usage?.input_tokens ?? null,
    output_tokens: usage?.output_tokens ?? null,
    total_tokens: usage === null
      ? null
      : usage.input_tokens + usage.output_tokens,
    latency_ms: detail.latency_ms,
  };
}

async function recomputeReveal(root, preparedIo) {
  const gate = await verifyAdjudicationGate(
    { root },
    {
      verifyFrozenRun: async (options) => {
        await verifyFrozenRun(options);
        return true;
      },
    },
  );
  const terminal = await verifyTerminalRun({ root, preparedIo });
  if (gate.completion_marker_sha256 !== terminal.completion_marker_sha256) {
    throw new Error('Adjudication gate does not bind the verified terminal completion');
  }
  const authorities = await loadAuthorities(root);
  const decisions = decisionMaps(gate);
  const slotScores = [];
  const slotOperations = [];
  const slotResults = [];
  for (const detail of terminal.slots) {
    const authority = authorities[detail.slot.target_ordinal - 1];
    let predictions = null;
    let semanticDecisions = null;
    let usefulnessDecisions = null;
    if (detail.terminal.terminal_state === 'valid_final') {
      predictions = structuredClone(
        detail.attempts.at(-1).classification.response.predictions,
      );
      semanticDecisions = predictions.map((prediction) => {
        const value = decisions.semantic.get(
          `${detail.slot.slot_id}:${prediction.rank}`,
        );
        if (value === undefined) {
          throw new Error(`Semantic adjudication is missing ${detail.slot.slot_id}:${prediction.rank}`);
        }
        return value;
      });
      usefulnessDecisions = predictions.map((prediction) => {
        const value = decisions.usefulness.get(
          `${detail.slot.slot_id}:${prediction.rank}`,
        );
        if (value === undefined) {
          throw new Error(`Usefulness adjudication is missing ${detail.slot.slot_id}:${prediction.rank}`);
        }
        return value;
      });
    }
    const scoringInput = {
      slot_id: detail.slot.slot_id,
      slot_ordinal: detail.slot.slot_ordinal,
      target_id: detail.slot.target_id,
      target_ordinal: detail.slot.target_ordinal,
      condition: detail.slot.condition,
      terminal_state: detail.terminal.terminal_state,
      observed_action: {
        action_type: authority.observed_action_type,
        ...structuredClone(authority.observed_target),
      },
      accepted_variants: structuredClone(authority.accepted_variants),
      predictions,
      semantic_decisions: semanticDecisions,
      usefulness_decisions: usefulnessDecisions,
    };
    const operation = {
      slot_id: detail.slot.slot_id,
      slot_ordinal: detail.slot.slot_ordinal,
      attempts: detail.attempts.map(operationAttempt),
    };
    slotScores.push(scoreSlot(scoringInput));
    slotOperations.push(operation);
    slotResults.push({
      slot_id: detail.slot.slot_id,
      scoring_input: scoringInput,
      operation,
    });
  }
  const scorePackage = buildScorePackage({
    adjudication: {
      adjudicator: gate.adjudicator,
      proxy_only: gate.proxy_only,
      adjudication_lock_sha256: gate.adjudication_lock_sha256,
    },
    slot_scores: slotScores,
    slot_operations: slotOperations,
  });
  return {
    slotResults: {
      version: 1,
      completion_marker_sha256: terminal.completion_marker_sha256,
      adjudication_lock_sha256: gate.adjudication_lock_sha256,
      adjudicator: gate.adjudicator,
      proxy_only: gate.proxy_only,
      slots: slotResults,
    },
    scorePackage,
    preliminaryReport: renderPreliminaryReport(scorePackage),
  };
}

async function exactRevealedNames(root, allowed) {
  const revealed = path.join(root, 'revealed');
  let names;
  try {
    const stat = await lstat(revealed);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error('Revealed output root must be a non-symlink directory');
    }
    names = (await readdir(revealed)).sort();
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  if (names.some((name) => !allowed.includes(name))) {
    throw new Error('Revealed output root contains an unexpected artifact');
  }
  return names;
}

export async function revealResults({
  root,
  preparedIo = {},
} = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Reveal root must be absolute');
  }
  const resolvedRoot = path.resolve(root);
  const names = await exactRevealedNames(resolvedRoot, REVEALED_BASE);
  if (names.length !== 0
    && canonicalJson(names) !== canonicalJson([...REVEALED_BASE].sort())) {
    throw new Error('Revealed output is partial or missing before reveal');
  }
  const computed = await recomputeReveal(resolvedRoot, preparedIo);
  await writeImmutable(
    path.join(resolvedRoot, 'revealed/slot-results.json'),
    Buffer.from(canonicalJson(computed.slotResults)),
  );
  await writeImmutable(
    path.join(resolvedRoot, 'revealed/score-package.json'),
    Buffer.from(canonicalJson(computed.scorePackage)),
  );
  await writeImmutable(
    path.join(resolvedRoot, 'revealed/PRELIMINARY-REPORT.md'),
    Buffer.from(computed.preliminaryReport),
  );
  return Object.freeze({
    revealed: true,
    finalized: false,
    adjudicator: computed.scorePackage.adjudication.adjudicator,
    proxy_only: computed.scorePackage.adjudication.proxy_only,
    score_package_sha256: sha256(canonicalJson(computed.scorePackage)),
  });
}

async function comparePrivate(root, relativePath, expected, label) {
  const actual = await readPrivate(root, relativePath, label);
  if (!actual.equals(expected)) throw new Error(`${label} differs from independent recomputation`);
}

export async function verifyResults({
  root,
  preparedIo = {},
} = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Result verification root must be absolute');
  }
  const resolvedRoot = path.resolve(root);
  const names = await exactRevealedNames(resolvedRoot, REVEALED_FINAL);
  const preliminaryOnly = canonicalJson(names) === canonicalJson([...REVEALED_BASE].sort());
  const final = canonicalJson(names) === canonicalJson(REVEALED_FINAL);
  if (!preliminaryOnly && !final) {
    throw new Error('Revealed result tree is incomplete or contains unexpected artifacts');
  }
  const computed = await recomputeReveal(resolvedRoot, preparedIo);
  await comparePrivate(
    resolvedRoot,
    'revealed/slot-results.json',
    Buffer.from(canonicalJson(computed.slotResults)),
    'Revealed slot results',
  );
  await comparePrivate(
    resolvedRoot,
    'revealed/score-package.json',
    Buffer.from(canonicalJson(computed.scorePackage)),
    'Revealed score package',
  );
  await comparePrivate(
    resolvedRoot,
    'revealed/PRELIMINARY-REPORT.md',
    Buffer.from(computed.preliminaryReport),
    'Preliminary report',
  );
  if (final) {
    const interpretationBytes = await readPrivate(
      resolvedRoot,
      'revealed/interpretation.json',
      'Frozen interpretation',
    );
    const interpretation = validateInterpretationRecord(
      parseCanonical(interpretationBytes, 'Frozen interpretation'),
      computed.scorePackage,
    );
    await comparePrivate(
      resolvedRoot,
      'revealed/FINAL-REPORT.md',
      Buffer.from(renderFinalReport(computed.scorePackage, interpretation)),
      'Final report',
    );
  }
  return Object.freeze({
    verified: true,
    finalized: final,
    adjudicator: computed.scorePackage.adjudication.adjudicator,
    proxy_only: computed.scorePackage.adjudication.proxy_only,
    scheduled_slots: computed.scorePackage.operational_summary.scheduled_slots,
    model_scorable_slots:
      computed.scorePackage.operational_summary.model_scorable_slots,
    score_package_sha256: sha256(canonicalJson(computed.scorePackage)),
  });
}

export async function finalizeReport({
  root,
  interpretationPath,
  preparedIo = {},
} = {}) {
  if (typeof root !== 'string'
    || !path.isAbsolute(root)
    || typeof interpretationPath !== 'string'
    || !path.isAbsolute(interpretationPath)) {
    throw new TypeError('Finalization root and interpretation path must be absolute');
  }
  const resolvedRoot = path.resolve(root);
  await verifyResults({ root: resolvedRoot, preparedIo });
  const scorePackage = parseCanonical(
    await readPrivate(
      resolvedRoot,
      'revealed/score-package.json',
      'Revealed score package',
    ),
    'Revealed score package',
  );
  const externalRoot = path.dirname(path.resolve(interpretationPath));
  const externalName = path.basename(path.resolve(interpretationPath));
  const interpretation = validateInterpretationRecord(
    parseCanonical(
      await readPrivate(externalRoot, externalName, 'Interpretation input'),
      'Interpretation input',
    ),
    scorePackage,
  );
  await writeImmutable(
    path.join(resolvedRoot, 'revealed/interpretation.json'),
    Buffer.from(canonicalJson(interpretation)),
  );
  await writeImmutable(
    path.join(resolvedRoot, 'revealed/FINAL-REPORT.md'),
    Buffer.from(renderFinalReport(scorePackage, interpretation)),
  );
  return Object.freeze({
    revealed: true,
    finalized: true,
    adjudicator: scorePackage.adjudication.adjudicator,
    proxy_only: scorePackage.adjudication.proxy_only,
    score_package_sha256: sha256(canonicalJson(scorePackage)),
  });
}
