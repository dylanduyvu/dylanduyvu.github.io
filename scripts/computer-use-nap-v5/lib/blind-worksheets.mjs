import { createHmac } from 'node:crypto';
import { constants } from 'node:fs';
import {
  lstat,
  mkdir,
  open,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';

import { METHOD } from '../config.mjs';
import { buildBlindCandidateSets } from './blind-ids.mjs';
import { publishAtomicBundle } from './bundle-publisher.mjs';
import {
  normalizeComponent,
  targetGranularity,
} from './identity.mjs';
import {
  canonicalJson,
  sha256,
  writeImmutable,
} from './immutable.mjs';
import { validatePredictions } from './response-validation.mjs';

const OPTION_KEYS = ['root'];
const DEPENDENCY_KEYS = [
  'verifyFrozenRun',
  'verifyPrepared',
  'verifyAttemptRecord',
  'loadAdjudicationInputs',
];
const COMPLETION_KEYS = [
  'version',
  'scheduled_slot_count',
  'terminal_slot_count',
  'terminal_records',
];
const COMPLETION_RECORD_KEYS = [
  'slot_ordinal',
  'terminal_record_sha256',
];
const TERMINAL_RECORD_KEYS = [
  'version',
  'slot_ordinal',
  'terminal_state',
  'classification',
  'code',
  'authoritative_attempt_ordinal',
  'latency_ms',
];
const ATTEMPT_KEYS = ['classification', 'hashes'];
const ATTEMPT_CLASSIFICATION_KEYS = [
  'classification',
  'code',
  'response',
  'usage',
];
const ATTEMPT_HASH_KEYS = [
  'request_sha256',
  'events_sha256',
  'stderr_sha256',
  'final_sha256',
];
const INPUT_KEYS = [
  'slot_id',
  'slot_ordinal',
  'condition',
  'target_id',
  'target_ordinal',
  'current_image_sha256',
  'current_image_path',
  'target_revision',
  'observed_target',
  'accepted_variants',
];
const JOIN_KEYS = [
  'version',
  'key_sha256',
  'completion_marker_sha256',
  'binding_hmac_sha256',
  'semantic',
  'usefulness',
];
const JOIN_ENTRY_KEYS = [
  'full_id',
  'display_id',
  'order_key',
  'normalized_identity',
  'auto_exact',
  'refs',
];
const SEMANTIC_JOIN_ENTRY_KEYS = [
  ...JOIN_ENTRY_KEYS,
  'observed_target',
];
const REF_KEYS = [
  'slot_id',
  'slot_ordinal',
  'condition',
  'target_id',
  'target_ordinal',
  'rank',
];
const SHA256 = /^[0-9a-f]{64}$/;
const DISPLAY_ID = /^[0-9a-f]{32}$/;
const SLOT_ID = /^NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])$/;
const TARGET_ID = /^NAP-V5-TARGET-(?:0[1-9]|1[01])-R1$/;
const CONDITIONS = new Set(['state_only', 'state_plus_hybrid_history']);
const TERMINAL_STATES = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_failure',
]);
const SEMANTIC_INSTRUCTIONS = 'Using only the screenshot, compare observed_target with predicted_target. Set decision to same_destination, different_destination, or uncertain. Ignore action type.';
const USEFULNESS_INSTRUCTIONS = 'Using only the screenshot, decide whether you would choose predicted_action as an offered shortcut regardless of what happened next. Set decision to useful, not_useful, or uncertain.';
const JOIN_BINDING_DOMAIN = 'nap-v5/sealed-join/v1';

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, keys, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length
    || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${label} must contain exact keys`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function sameFileSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.mode === right.mode
    && left.nlink === right.nlink
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

async function readRegular(filename, label) {
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink()
    || !pathStat.isFile()
    || pathStat.nlink !== 1n
    || (pathStat.mode & 0o777n) !== 0o600n) {
    throw new Error(`${label} must be one mode-0600 regular non-symlink file`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!sameFileSnapshot(pathStat, before)) throw new Error(`${label} changed before read`);
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(filename, { bigint: true });
    if (!sameFileSnapshot(before, after) || !sameFileSnapshot(after, pathAfter)) {
      throw new Error(`${label} changed while read`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

async function readCanonicalRegular(filename, label) {
  const bytes = await readRegular(filename, label);
  let value;
  try {
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch (error) {
    throw new Error(`${label} must be canonical UTF-8 JSON`, { cause: error });
  }
  if (!Buffer.from(canonicalJson(value)).equals(bytes)) {
    throw new Error(`${label} differs from canonical JSON bytes`);
  }
  return { bytes, value };
}

async function optionalLstat(filename) {
  try {
    return await lstat(filename, { bigint: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function validateTarget(target, label, { requireNormalized = true } = {}) {
  assertExactKeys(target, ['app', 'object', 'subtarget'], `${label} target`);
  const targetOnly = {
    app: target.app,
    object: target.object,
    subtarget: target.subtarget,
  };
  try {
    targetGranularity(targetOnly);
  } catch (error) {
    throw new Error(`${label} target shape is invalid`, { cause: error });
  }
  const normalized = {
    app: normalizeComponent(targetOnly.app),
    object: normalizeComponent(targetOnly.object),
    subtarget: normalizeComponent(targetOnly.subtarget),
  };
  if (requireNormalized
    && canonicalJson(normalized) !== canonicalJson(targetOnly)) {
    throw new Error(`${label} target must already be normalized`);
  }
  return requireNormalized ? normalized : targetOnly;
}

function validateRef(source, label) {
  assertExactKeys(source, REF_KEYS, label);
  if (!SLOT_ID.test(source.slot_id)
    || !Number.isSafeInteger(source.slot_ordinal)
    || source.slot_ordinal < 1
    || source.slot_ordinal > METHOD.scheduledSlotCount
    || !CONDITIONS.has(source.condition)
    || !TARGET_ID.test(source.target_id)
    || !Number.isSafeInteger(source.target_ordinal)
    || source.target_ordinal < 1
    || source.target_ordinal > METHOD.targetCount
    || !Number.isSafeInteger(source.rank)
    || source.rank < 1
    || source.rank > 3) {
    throw new Error(`${label} is invalid`);
  }
  return Object.fromEntries(REF_KEYS.map((key) => [key, source[key]]));
}

function validateIdentity(kind, identity) {
  if (kind === 'semantic') {
    assertExactKeys(
      identity,
      ['current_state_sha256', 'predicted_target', 'target_revision'],
      'Semantic normalized identity',
    );
    if (!SHA256.test(identity.current_state_sha256)
      || !TARGET_ID.test(identity.target_revision)) {
      throw new Error('Semantic normalized identity hashes or revision are invalid');
    }
    return {
      current_state_sha256: identity.current_state_sha256,
      predicted_target: validateTarget(identity.predicted_target, 'Predicted'),
      target_revision: identity.target_revision,
    };
  }
  assertExactKeys(
    identity,
    ['current_state_sha256', 'predicted_action'],
    'Usefulness normalized identity',
  );
  const action = identity.predicted_action;
  assertExactKeys(
    action,
    ['action_type', 'app', 'object', 'subtarget'],
    'Predicted action',
  );
  if (!SHA256.test(identity.current_state_sha256)
    || !['focus', 'activate'].includes(action.action_type)) {
    throw new Error('Usefulness normalized identity hash or action type is invalid');
  }
  return {
    current_state_sha256: identity.current_state_sha256,
    predicted_action: {
      action_type: action.action_type,
      ...validateTarget({
        app: action.app,
        object: action.object,
        subtarget: action.subtarget,
      }, 'Predicted action'),
    },
  };
}

function validateJoinCandidates(kind, source, globalIds) {
  if (!Array.isArray(source)) throw new TypeError(`Sealed ${kind} join must be an array`);
  const refs = new Set();
  let prior = null;
  return source.map((entry, index) => {
    assertExactKeys(
      entry,
      kind === 'semantic' ? SEMANTIC_JOIN_ENTRY_KEYS : JOIN_ENTRY_KEYS,
      `Sealed ${kind} candidate ${index + 1}`,
    );
    if (!SHA256.test(entry.full_id)
      || !DISPLAY_ID.test(entry.display_id)
      || entry.display_id !== entry.full_id.slice(0, 32)
      || !SHA256.test(entry.order_key)
      || typeof entry.auto_exact !== 'boolean'
      || (kind === 'usefulness' && entry.auto_exact)
      || !Array.isArray(entry.refs)
      || entry.refs.length === 0) {
      throw new Error(`Sealed ${kind} candidate IDs, order, automatic-exact flag, or refs are invalid`);
    }
    if (globalIds.full.has(entry.full_id) || globalIds.display.has(entry.display_id)) {
      throw new Error('Sealed join contains a full/display candidate ID collision');
    }
    globalIds.full.add(entry.full_id);
    globalIds.display.add(entry.display_id);
    const orderTuple = `${entry.order_key}:${entry.full_id}`;
    if (prior !== null && orderTuple <= prior) {
      throw new Error(`Sealed ${kind} candidates are not in frozen order-key order`);
    }
    prior = orderTuple;
    const validatedRefs = entry.refs.map((ref, refIndex) => (
      validateRef(ref, `Sealed ${kind} ref ${index + 1}.${refIndex + 1}`)
    ));
    for (const ref of validatedRefs) {
      const key = `${ref.slot_id}:${ref.rank}`;
      if (refs.has(key)) throw new Error(`Sealed ${kind} join contains duplicate slot/rank refs`);
      refs.add(key);
    }
    const validated = {
      full_id: entry.full_id,
      display_id: entry.display_id,
      order_key: entry.order_key,
      normalized_identity: validateIdentity(kind, entry.normalized_identity),
      auto_exact: entry.auto_exact,
      refs: validatedRefs,
    };
    if (kind === 'semantic') {
      validated.observed_target = validateTarget(
        entry.observed_target,
        'Observed',
        { requireNormalized: false },
      );
    }
    return validated;
  });
}

function joinBinding(key, payload) {
  return createHmac('sha256', key)
    .update(Buffer.from(canonicalJson({
      domain: JOIN_BINDING_DOMAIN,
      payload,
    })))
    .digest('hex');
}

export function validateSealedJoin(source, key) {
  assertExactKeys(source, JOIN_KEYS, 'Sealed join');
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Sealed join authentication key must be exactly 32 bytes');
  }
  if (source.version !== 1
    || !SHA256.test(source.key_sha256)
    || source.key_sha256 !== sha256(key)
    || !SHA256.test(source.completion_marker_sha256)
    || !SHA256.test(source.binding_hmac_sha256)) {
    throw new Error('Sealed join version, key hash, completion hash, or binding is invalid');
  }
  const globalIds = { full: new Set(), display: new Set() };
  const payload = {
    version: 1,
    key_sha256: source.key_sha256,
    completion_marker_sha256: source.completion_marker_sha256,
    semantic: validateJoinCandidates('semantic', source.semantic, globalIds),
    usefulness: validateJoinCandidates('usefulness', source.usefulness, globalIds),
  };
  const expectedBinding = joinBinding(key, payload);
  if (source.binding_hmac_sha256 !== expectedBinding) {
    throw new Error('Sealed join keyed HMAC binding is invalid');
  }
  return deepFreeze({
    ...payload,
    binding_hmac_sha256: expectedBinding,
  });
}

function validateCompletion(source) {
  assertExactKeys(source, COMPLETION_KEYS, 'Terminal completion verification');
  if (source.version !== 1
    || source.scheduled_slot_count !== METHOD.scheduledSlotCount
    || source.terminal_slot_count !== METHOD.scheduledSlotCount
    || !Array.isArray(source.terminal_records)
    || source.terminal_records.length !== METHOD.scheduledSlotCount) {
    throw new Error(
      `Completion marker is missing or does not cover exactly ${METHOD.scheduledSlotCount} terminal slots`,
    );
  }
  const terminalRecords = source.terminal_records.map((record, index) => {
    assertExactKeys(
      record,
      COMPLETION_RECORD_KEYS,
      `Completion terminal record ${index + 1}`,
    );
    const expectedOrdinal = index + 1;
    if (record.slot_ordinal !== expectedOrdinal
      || !SHA256.test(record.terminal_record_sha256)) {
      throw new Error(`Completion terminal record ${index + 1} is invalid`);
    }
    return { ...record };
  });
  return {
    version: 1,
    scheduled_slot_count: METHOD.scheduledSlotCount,
    terminal_slot_count: METHOD.scheduledSlotCount,
    terminal_records: terminalRecords,
  };
}

function validateTerminalRecord(source, slotOrdinal) {
  assertExactKeys(source, TERMINAL_RECORD_KEYS, `Terminal slot ${slotOrdinal}`);
  const expectedClassification = source.terminal_state === 'valid_final'
    ? 'valid_final'
    : source.terminal_state === 'terminal_invalid'
      ? 'terminal_invalid'
      : source.terminal_state === 'infrastructure_failure'
        ? 'infrastructure_retry'
        : null;
  if (source.version !== 1
    || source.slot_ordinal !== slotOrdinal
    || !TERMINAL_STATES.has(source.terminal_state)
    || source.classification !== expectedClassification
    || typeof source.code !== 'string'
    || source.code.length === 0
    || !Number.isSafeInteger(source.authoritative_attempt_ordinal)
    || source.authoritative_attempt_ordinal < 1
    || source.authoritative_attempt_ordinal > 3
    || (source.latency_ms !== null
      && (!Number.isSafeInteger(source.latency_ms) || source.latency_ms < 0))) {
    throw new Error(`Terminal slot ${slotOrdinal} is nonterminal or invalid`);
  }
  return Object.fromEntries(
    TERMINAL_RECORD_KEYS.map((key) => [key, source[key]]),
  );
}

function validateAttempt(source, terminal) {
  assertExactKeys(source, ATTEMPT_KEYS, `Verified attempt ${terminal.slot_id}`);
  assertExactKeys(
    source.classification,
    ATTEMPT_CLASSIFICATION_KEYS,
    `Verified attempt classification ${terminal.slot_id}`,
  );
  assertExactKeys(
    source.hashes,
    ATTEMPT_HASH_KEYS,
    `Verified attempt hashes ${terminal.slot_id}`,
  );
  const hashesValid = ATTEMPT_HASH_KEYS
    .filter((key) => key !== 'final_sha256')
    .every((key) => SHA256.test(source.hashes[key]))
    && (source.hashes.final_sha256 === null
      || SHA256.test(source.hashes.final_sha256));
  if (!hashesValid
    || source.classification.classification !== terminal.classification
    || source.classification.code !== terminal.code) {
    throw new Error(`Verified attempt classification or hashes differ for ${terminal.slot_id}`);
  }
  if (terminal.terminal_state !== 'valid_final') {
    if (source.classification.response !== null) {
      throw new Error(`Non-valid attempt exposes predictions for ${terminal.slot_id}`);
    }
    return null;
  }
  if (!SHA256.test(source.hashes.final_sha256)
    || source.classification.response === null) {
    throw new Error(`Valid-final attempt is missing an authenticated response for ${terminal.slot_id}`);
  }
  return structuredClone(
    validatePredictions(source.classification.response).predictions,
  );
}

async function loadTerminalSlots(root, completion, verifyAttemptRecord) {
  const terminals = [];
  for (const completionRecord of completion.terminal_records) {
    const slotOrdinal = completionRecord.slot_ordinal;
    const slotId = `NAP-V5-SLOT-${String(slotOrdinal).padStart(2, '0')}`;
    const terminalArtifact = await readCanonicalRegular(
      path.join(
        root,
        'sealed-attempts',
        'slot-state',
        slotId,
        'terminal.json',
      ),
      `Terminal slot record ${slotId}`,
    );
    if (sha256(terminalArtifact.bytes) !== completionRecord.terminal_record_sha256) {
      throw new Error(`Terminal slot record hash drift for ${slotId}`);
    }
    const record = validateTerminalRecord(terminalArtifact.value, slotOrdinal);
    const attemptPath = path.join(
      root,
      'sealed-attempts',
      slotId,
      `attempt-${String(record.authoritative_attempt_ordinal).padStart(3, '0')}`,
    );
    const predictions = validateAttempt(
      await verifyAttemptRecord(attemptPath),
      { ...record, slot_id: slotId },
    );
    terminals.push({
      slot_id: slotId,
      slot_ordinal: slotOrdinal,
      terminal_state: record.terminal_state,
      attempt_path: attemptPath,
      predictions,
    });
  }
  return terminals;
}

function validateAdjudicationInputs(source, terminals) {
  if (!Array.isArray(source) || source.length !== terminals.length) {
    throw new Error('Adjudication inputs must match every valid-final slot exactly');
  }
  return source.map((entry, index) => {
    assertExactKeys(entry, INPUT_KEYS, `Adjudication input ${index + 1}`);
    const terminal = terminals[index];
    if (entry.slot_id !== terminal.slot_id
      || entry.slot_ordinal !== terminal.slot_ordinal
      || !CONDITIONS.has(entry.condition)
      || !TARGET_ID.test(entry.target_id)
      || !Number.isSafeInteger(entry.target_ordinal)
      || entry.target_ordinal < 1
      || entry.target_ordinal > METHOD.targetCount
      || entry.target_revision !== entry.target_id
      || !SHA256.test(entry.current_image_sha256)
      || typeof entry.current_image_path !== 'string'
      || !path.isAbsolute(entry.current_image_path)
      || !Array.isArray(entry.accepted_variants)
      || entry.accepted_variants.length === 0) {
      throw new Error('Adjudication input slot join or current image path is invalid');
    }
    return {
      ...structuredClone(entry),
      observed_target: validateTarget(
        entry.observed_target,
        'Observed',
        { requireNormalized: false },
      ),
      accepted_variants: entry.accepted_variants.map((variant) => (
        validateTarget(
          variant,
          'Accepted variant',
          { requireNormalized: false },
        )
      )),
    };
  });
}

async function assertBlindTreePrepublication(root) {
  const blindRoot = path.join(root, 'blind');
  const rootStat = await optionalLstat(blindRoot);
  if (rootStat === null) return;
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error('Blind root must be a non-symlink directory');
  }
  for (const name of await readdir(blindRoot)) {
    if (!['semantic', 'usefulness'].includes(name)) {
      throw new Error(`Blind root contains an extra or unexpected entry: ${name}`);
    }
    const kindRoot = path.join(blindRoot, name);
    const stat = await lstat(kindRoot, { bigint: true });
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(`Blind ${name} root must be a non-symlink directory`);
    }
    for (const child of await readdir(kindRoot)) {
      if (!['images', 'worksheet.json'].includes(child)) {
        throw new Error(`Blind ${name} root contains an extra or unexpected entry: ${child}`);
      }
    }
  }
}

async function assertNoCompletedWorksheets(root) {
  for (const name of [
    'completed-semantic-worksheet.json',
    'completed-usefulness-worksheet.json',
  ]) {
    if (await optionalLstat(path.join(root, 'evaluator/sealed-join', name)) !== null) {
      throw new Error('Blind adjudication is already frozen and cannot be prepared again');
    }
  }
}

function worksheetCandidate(kind, candidate, metadataBySlot) {
  const firstRef = candidate.refs[0];
  const metadata = metadataBySlot.get(firstRef.slot_id);
  if (metadata === undefined
    || metadata.current_image_sha256 !== candidate.normalized_identity.current_state_sha256) {
    throw new Error(`Sealed ${kind} candidate cannot resolve its authenticated current image`);
  }
  const base = {
    candidate_id: candidate.display_id,
    current_image: `images/${candidate.display_id}.png`,
  };
  if (kind === 'semantic') {
    return {
      ...base,
      observed_target: structuredClone(candidate.observed_target),
      predicted_target: structuredClone(candidate.normalized_identity.predicted_target),
      decision: null,
    };
  }
  return {
    ...base,
    predicted_action: structuredClone(candidate.normalized_identity.predicted_action),
    decision: null,
  };
}

async function publishImages(root, kind, candidates, imageBytesBySlot) {
  const files = candidates.map((candidate) => {
    const slotId = candidate.refs[0].slot_id;
    const contents = imageBytesBySlot.get(slotId);
    if (contents === undefined) throw new Error(`Blind ${kind} candidate has no image bytes`);
    return {
      name: `${candidate.display_id}.png`,
      contents,
    };
  });
  const targetDirectory = path.join(root, 'blind', kind, 'images');
  if (files.length === 0) {
    await mkdir(targetDirectory, { recursive: true, mode: 0o700 });
    const names = await readdir(targetDirectory);
    if (names.length !== 0) throw new Error(`Blind ${kind} images contain extra entries`);
    return;
  }
  await publishAtomicBundle({
    targetDirectory,
    files,
    label: `Blind ${kind} image bundle`,
  });
}

async function exactBlindTree(root, kind, worksheet) {
  const kindRoot = path.join(root, 'blind', kind);
  const names = (await readdir(kindRoot)).sort();
  if (canonicalJson(names) !== canonicalJson(['images', 'worksheet.json'])) {
    throw new Error(`Blind ${kind} tree has an extra or missing path`);
  }
  const imageNames = (await readdir(path.join(kindRoot, 'images'))).sort();
  const expected = worksheet.candidates
    .map((candidate) => `${candidate.candidate_id}.png`)
    .sort();
  if (canonicalJson(imageNames) !== canonicalJson(expected)) {
    throw new Error(`Blind ${kind} image tree differs from worksheet candidates`);
  }
}

export async function prepareBlindAdjudication(options, dependencies) {
  assertExactKeys(options, OPTION_KEYS, 'Blind worksheet options');
  assertExactKeys(dependencies, DEPENDENCY_KEYS, 'Blind worksheet dependencies');
  if (typeof options.root !== 'string' || !path.isAbsolute(options.root)) {
    throw new Error('Blind worksheet root must be absolute');
  }
  for (const key of DEPENDENCY_KEYS) {
    if (typeof dependencies[key] !== 'function') {
      throw new TypeError(`Blind worksheet dependency ${key} must be a function`);
    }
  }
  const root = path.resolve(options.root);
  await assertBlindTreePrepublication(root);
  await assertNoCompletedWorksheets(root);
  if (await dependencies.verifyFrozenRun({ root }) !== true) {
    throw new Error('Frozen method/run lock verification failed');
  }
  if (await dependencies.verifyPrepared({ root, downstreamAuthenticated: true }) !== true) {
    throw new Error('Prepared-tree verification failed');
  }
  const completionArtifact = await readCanonicalRegular(
    path.join(root, 'locks/all-slots-terminal.json'),
    'All-slots terminal completion',
  );
  const completion = validateCompletion(completionArtifact.value);
  const terminals = await loadTerminalSlots(
    root,
    completion,
    dependencies.verifyAttemptRecord,
  );
  const validTerminals = terminals.filter(
    (slot) => slot.terminal_state === 'valid_final',
  );
  const predictions = new Map(
    validTerminals.map((terminal) => [terminal.slot_id, terminal.predictions]),
  );
  const inputs = validateAdjudicationInputs(
    await dependencies.loadAdjudicationInputs({
      root,
      slotIds: validTerminals.map((slot) => slot.slot_id),
    }),
    validTerminals,
  );
  const metadataBySlot = new Map(inputs.map((entry) => [entry.slot_id, entry]));
  const imageBytesBySlot = new Map();
  for (const entry of inputs) {
    const bytes = await readRegular(
      entry.current_image_path,
      `Current before-state image ${entry.slot_id}`,
    );
    if (sha256(bytes) !== entry.current_image_sha256) {
      throw new Error(`Current before-state image hash drift for ${entry.slot_id}`);
    }
    imageBytesBySlot.set(entry.slot_id, bytes);
  }
  const key = await readRegular(
    path.join(root, 'evaluator/sealed-join/adjudication-key.bin'),
    'Adjudication key',
  );
  if (key.length !== 32) throw new Error('Adjudication key must be exactly 32 bytes');
  const candidates = buildBlindCandidateSets({
    key,
    slots: inputs.map((entry) => ({
      slot_id: entry.slot_id,
      slot_ordinal: entry.slot_ordinal,
      condition: entry.condition,
      target_id: entry.target_id,
      target_ordinal: entry.target_ordinal,
      current_image_sha256: entry.current_image_sha256,
      target_revision: entry.target_revision,
      observed_target: entry.observed_target,
      accepted_variants: entry.accepted_variants,
      predictions: predictions.get(entry.slot_id),
    })),
  });
  const joinPayload = {
    version: 1,
    key_sha256: sha256(key),
    completion_marker_sha256: sha256(completionArtifact.bytes),
    semantic: candidates.semantic.map((candidate) => {
      const metadata = metadataBySlot.get(candidate.refs[0].slot_id);
      if (metadata === undefined
        || metadata.target_revision !== candidate.normalized_identity.target_revision) {
        throw new Error('Semantic candidate cannot resolve its observed target authority');
      }
      return {
        ...candidate,
        observed_target: structuredClone(metadata.observed_target),
      };
    }),
    usefulness: candidates.usefulness,
  };
  const join = validateSealedJoin({
    ...joinPayload,
    binding_hmac_sha256: joinBinding(key, joinPayload),
  }, key);
  const semanticCandidates = join.semantic.filter((candidate) => !candidate.auto_exact);
  const semanticWorksheet = {
    version: 1,
    kind: 'semantic',
    candidates: semanticCandidates.map((candidate) => (
      worksheetCandidate('semantic', candidate, metadataBySlot)
    )),
    instructions: SEMANTIC_INSTRUCTIONS,
  };
  const usefulnessWorksheet = {
    version: 1,
    kind: 'usefulness',
    candidates: join.usefulness.map((candidate) => (
      worksheetCandidate('usefulness', candidate, metadataBySlot)
    )),
    instructions: USEFULNESS_INSTRUCTIONS,
  };
  await writeImmutable(
    path.join(root, 'evaluator/sealed-join/join-map.json'),
    Buffer.from(canonicalJson(join)),
  );
  await publishImages(root, 'semantic', semanticCandidates, imageBytesBySlot);
  await publishImages(root, 'usefulness', join.usefulness, imageBytesBySlot);
  await writeImmutable(
    path.join(root, 'blind/semantic/worksheet.json'),
    Buffer.from(canonicalJson(semanticWorksheet)),
  );
  await writeImmutable(
    path.join(root, 'blind/usefulness/worksheet.json'),
    Buffer.from(canonicalJson(usefulnessWorksheet)),
  );
  await exactBlindTree(root, 'semantic', semanticWorksheet);
  await exactBlindTree(root, 'usefulness', usefulnessWorksheet);
  return deepFreeze({
    ok: true,
    version: 1,
    semantic_candidate_count: semanticWorksheet.candidates.length,
    usefulness_candidate_count: usefulnessWorksheet.candidates.length,
  });
}
