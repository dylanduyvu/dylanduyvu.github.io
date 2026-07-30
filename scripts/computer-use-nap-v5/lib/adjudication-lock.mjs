import { constants } from 'node:fs';
import {
  lstat,
  open,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';

import { validateSealedJoin } from './blind-worksheets.mjs';
import {
  canonicalJson,
  sha256,
  writeImmutable,
} from './immutable.mjs';
import { targetGranularity } from './identity.mjs';

const FREEZE_REQUIRED_KEYS = [
  'root',
  'adjudicator',
  'semanticDecisionsPath',
  'usefulnessDecisionsPath',
];
const FREEZE_ALLOWED_KEYS = [
  ...FREEZE_REQUIRED_KEYS,
  'completedAtUtc',
];
const GATE_KEYS = ['root'];
const DEPENDENCY_KEYS = ['verifyFrozenRun'];
const WORKSHEET_KEYS = [
  'version',
  'kind',
  'candidates',
  'instructions',
];
const SEMANTIC_CANDIDATE_KEYS = [
  'candidate_id',
  'current_image',
  'observed_target',
  'predicted_target',
  'decision',
];
const USEFULNESS_CANDIDATE_KEYS = [
  'candidate_id',
  'current_image',
  'predicted_action',
  'decision',
];
const LOCK_KEYS = [
  'version',
  'adjudicator',
  'semantic_worksheet_sha256',
  'usefulness_worksheet_sha256',
  'sealed_join_sha256',
  'semantic_decision_counts',
  'usefulness_decision_counts',
  'completed_at_utc',
  'proxy_only',
];
const SEMANTIC_COUNT_KEYS = [
  'same_destination',
  'different_destination',
  'uncertain',
];
const USEFULNESS_COUNT_KEYS = [
  'useful',
  'not_useful',
  'uncertain',
];
const SEMANTIC_DECISIONS = new Set(SEMANTIC_COUNT_KEYS);
const USEFULNESS_DECISIONS = new Set(USEFULNESS_COUNT_KEYS);
const SHA256 = /^[0-9a-f]{64}$/;
const DISPLAY_ID = /^[0-9a-f]{32}$/;
const SEMANTIC_INSTRUCTIONS = 'Using only the screenshot, compare observed_target with predicted_target. Set decision to same_destination, different_destination, or uncertain. Ignore action type.';
const USEFULNESS_INSTRUCTIONS = 'Using only the screenshot, decide whether you would choose predicted_action as an offered shortcut regardless of what happened next. Set decision to useful, not_useful, or uncertain.';

const RELATIVE_PATHS = Object.freeze({
  semanticWorksheet: 'blind/semantic/worksheet.json',
  usefulnessWorksheet: 'blind/usefulness/worksheet.json',
  completedSemantic:
    'evaluator/sealed-join/completed-semantic-worksheet.json',
  completedUsefulness:
    'evaluator/sealed-join/completed-usefulness-worksheet.json',
  join: 'evaluator/sealed-join/join-map.json',
  lock: 'locks/adjudication-lock.json',
});

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

function assertFreezeKeys(value) {
  if (!isPlainObject(value)) {
    throw new TypeError('Adjudication freeze options must be a plain object');
  }
  const actual = Object.keys(value);
  if (actual.some((key) => !FREEZE_ALLOWED_KEYS.includes(key))
    || FREEZE_REQUIRED_KEYS.some((key) => !actual.includes(key))) {
    throw new Error('Adjudication freeze options must contain the exact allowed keys');
  }
}

async function defaultVerifyFrozenRun(options) {
  const locks = await import('./locks.mjs');
  if (typeof locks.verifyFrozenRun !== 'function') {
    throw new Error('Frozen run verifier is unavailable');
  }
  return locks.verifyFrozenRun(options);
}

function normalizeDependencies(dependencies) {
  if (!isPlainObject(dependencies)) {
    throw new TypeError('Adjudication dependencies must be a plain object');
  }
  if (Object.keys(dependencies).length === 0) {
    return { verifyFrozenRun: defaultVerifyFrozenRun };
  }
  assertExactKeys(
    dependencies,
    DEPENDENCY_KEYS,
    'Adjudication dependencies',
  );
  if (typeof dependencies.verifyFrozenRun !== 'function') {
    throw new TypeError('Adjudication frozen-run verifier must be a function');
  }
  return dependencies;
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

async function readPrivateRegular(filename, label) {
  let pathStat;
  try {
    pathStat = await lstat(filename, { bigint: true });
  } catch (error) {
    throw new Error(`${label} is missing or unreadable`, { cause: error });
  }
  if (pathStat.isSymbolicLink()
    || !pathStat.isFile()
    || pathStat.nlink !== 1n
    || (pathStat.mode & 0o777n) !== 0o600n) {
    throw new Error(`${label} must be one private mode-0600 regular non-symlink file`);
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

function parseJson(bytes, label) {
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${label} must contain valid JSON`, { cause: error });
  }
}

function resolved(root, relativePath) {
  return path.join(root, ...relativePath.split('/'));
}

function validateUtc(value, label) {
  if (typeof value !== 'string'
    || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)
    || Number.isNaN(Date.parse(value))
    || new Date(value).toISOString() !== value) {
    throw new Error(`${label} must be one canonical UTC timestamp`);
  }
  return value;
}

function candidateKeys(kind) {
  return kind === 'semantic'
    ? SEMANTIC_CANDIDATE_KEYS
    : USEFULNESS_CANDIDATE_KEYS;
}

function decisionSet(kind) {
  return kind === 'semantic' ? SEMANTIC_DECISIONS : USEFULNESS_DECISIONS;
}

function validateTargetShape(target, label) {
  assertExactKeys(target, ['app', 'object', 'subtarget'], label);
  try {
    targetGranularity(target);
  } catch (error) {
    throw new Error(`${label} has invalid target granularity`, { cause: error });
  }
}

function validateWorksheetShape(source, kind, { decisionsRequired }) {
  assertExactKeys(source, WORKSHEET_KEYS, `Completed ${kind} worksheet`);
  const instructions = kind === 'semantic'
    ? SEMANTIC_INSTRUCTIONS
    : USEFULNESS_INSTRUCTIONS;
  if (source.version !== 1
    || source.kind !== kind
    || source.instructions !== instructions
    || !Array.isArray(source.candidates)) {
    throw new Error(`Completed ${kind} worksheet header or candidates are invalid`);
  }
  const ids = new Set();
  const allowed = decisionSet(kind);
  const candidates = source.candidates.map((candidate, index) => {
    assertExactKeys(
      candidate,
      candidateKeys(kind),
      `Completed ${kind} candidate ${index + 1}`,
    );
    if (!DISPLAY_ID.test(candidate.candidate_id)
      || candidate.current_image !== `images/${candidate.candidate_id}.png`
      || ids.has(candidate.candidate_id)) {
      throw new Error(`Completed ${kind} worksheet has an invalid or duplicate opaque candidate ID`);
    }
    ids.add(candidate.candidate_id);
    if (kind === 'semantic') {
      validateTargetShape(candidate.observed_target, 'Observed semantic target');
      validateTargetShape(candidate.predicted_target, 'Predicted semantic target');
    } else {
      assertExactKeys(
        candidate.predicted_action,
        ['action_type', 'app', 'object', 'subtarget'],
        'Predicted usefulness action',
      );
      if (!['focus', 'activate'].includes(candidate.predicted_action.action_type)) {
        throw new Error('Predicted usefulness action type is invalid');
      }
      validateTargetShape({
        app: candidate.predicted_action.app,
        object: candidate.predicted_action.object,
        subtarget: candidate.predicted_action.subtarget,
      }, 'Predicted usefulness target');
    }
    if (decisionsRequired) {
      if (!allowed.has(candidate.decision)) {
        throw new Error(`Completed ${kind} candidate has a missing or invalid decision`);
      }
    } else if (candidate.decision !== null) {
      throw new Error(`Blind ${kind} worksheet decision must still be null`);
    }
    return structuredClone(candidate);
  });
  return {
    version: 1,
    kind,
    candidates,
    instructions,
  };
}

function withoutDecision(candidate) {
  const copy = structuredClone(candidate);
  delete copy.decision;
  return copy;
}

function validateDecisionArray(source, kind) {
  if (!Array.isArray(source)) {
    throw new TypeError(`${kind} decision input must be an exact ID/decision array`);
  }
  const allowed = decisionSet(kind);
  const ids = new Set();
  return source.map((entry, index) => {
    assertExactKeys(
      entry,
      ['candidate_id', 'decision'],
      `${kind} decision ${index + 1}`,
    );
    if (!DISPLAY_ID.test(entry.candidate_id)
      || !allowed.has(entry.decision)
      || ids.has(entry.candidate_id)) {
      throw new Error(`${kind} decision array contains an invalid or duplicate opaque candidate`);
    }
    ids.add(entry.candidate_id);
    return {
      candidate_id: entry.candidate_id,
      decision: entry.decision,
    };
  });
}

function completeWorksheet(kind, blindSource, decisionSource) {
  const blind = validateWorksheetShape(blindSource, kind, {
    decisionsRequired: false,
  });
  const decisionEntries = validateDecisionArray(decisionSource, kind);
  if (blind.candidates.length !== decisionEntries.length) {
    throw new Error(`Completed ${kind} worksheet must decide every opaque candidate exactly once`);
  }
  const byId = new Map(
    decisionEntries.map((candidate) => [candidate.candidate_id, candidate]),
  );
  const completedCandidates = blind.candidates.map((candidate) => {
    const decided = byId.get(candidate.candidate_id);
    if (decided === undefined) {
      throw new Error(`Completed ${kind} worksheet is missing an opaque candidate decision`);
    }
    return {
      ...structuredClone(candidate),
      decision: decided.decision,
    };
  });
  if (byId.size !== completedCandidates.length) {
    throw new Error(`Completed ${kind} worksheet contains an extra opaque candidate`);
  }
  return {
    ...blind,
    candidates: completedCandidates,
  };
}

function validateCompletedWorksheet(kind, blindSource, completedSource) {
  const blind = validateWorksheetShape(blindSource, kind, {
    decisionsRequired: false,
  });
  const completed = validateWorksheetShape(completedSource, kind, {
    decisionsRequired: true,
  });
  if (completed.candidates.length !== blind.candidates.length) {
    throw new Error(`Completed ${kind} worksheet must decide every opaque candidate exactly once`);
  }
  for (const candidate of completed.candidates) {
    const original = blind.candidates.find(
      (entry) => entry.candidate_id === candidate.candidate_id,
    );
    if (original === undefined
      || canonicalJson(withoutDecision(candidate))
        !== canonicalJson(withoutDecision(original))) {
      throw new Error(`Completed ${kind} worksheet candidate fields drift from the blind worksheet`);
    }
  }
  return completed;
}

function validateBlindJoin(kind, worksheet, joinCandidates) {
  const expected = kind === 'semantic'
    ? joinCandidates.filter((candidate) => !candidate.auto_exact)
    : joinCandidates;
  if (worksheet.candidates.length !== expected.length) {
    throw new Error(`Blind ${kind} worksheet candidate count differs from the sealed join`);
  }
  worksheet.candidates.forEach((candidate, index) => {
    const joined = expected[index];
    if (candidate.candidate_id !== joined.display_id
      || (kind === 'semantic'
        && (canonicalJson(candidate.observed_target)
          !== canonicalJson(joined.observed_target)
          || canonicalJson(candidate.predicted_target)
          !== canonicalJson(joined.normalized_identity.predicted_target)))
      || (kind === 'usefulness'
        && canonicalJson(candidate.predicted_action)
          !== canonicalJson(joined.normalized_identity.predicted_action))) {
      throw new Error(`Blind ${kind} worksheet candidate identity differs from the sealed join`);
    }
  });
}

async function verifyBlindImages(root, kind, worksheet, joinCandidates) {
  const imageRoot = path.join(root, 'blind', kind, 'images');
  const rootStat = await lstat(imageRoot, { bigint: true });
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error(`Blind ${kind} image root must be a non-symlink directory`);
  }
  const expectedJoin = kind === 'semantic'
    ? joinCandidates.filter((candidate) => !candidate.auto_exact)
    : joinCandidates;
  const expectedNames = worksheet.candidates
    .map((candidate) => `${candidate.candidate_id}.png`)
    .sort();
  const actualNames = (await readdir(imageRoot)).sort();
  if (canonicalJson(actualNames) !== canonicalJson(expectedNames)) {
    throw new Error(`Blind ${kind} image inventory differs from its worksheet`);
  }
  for (const [index, candidate] of worksheet.candidates.entries()) {
    const bytes = await readPrivateRegular(
      path.join(imageRoot, `${candidate.candidate_id}.png`),
      `Blind ${kind} image ${candidate.candidate_id}`,
    );
    if (sha256(bytes)
      !== expectedJoin[index].normalized_identity.current_state_sha256) {
      throw new Error(`Blind ${kind} image hash differs from its authenticated current state`);
    }
  }
}

async function verifyCompletionMarker(root, join) {
  const bytes = await readPrivateRegular(
    path.join(root, 'locks/all-slots-terminal.json'),
    'All-slots terminal completion',
  );
  const value = parseJson(bytes, 'All-slots terminal completion');
  if (!Buffer.from(canonicalJson(value)).equals(bytes)
    || sha256(bytes) !== join.completion_marker_sha256) {
    throw new Error('All-slots terminal completion marker hash drifted after blind preparation');
  }
}

function decisionCounts(kind, worksheet) {
  const keys = kind === 'semantic' ? SEMANTIC_COUNT_KEYS : USEFULNESS_COUNT_KEYS;
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const candidate of worksheet.candidates) counts[candidate.decision] += 1;
  return counts;
}

function validateCounts(source, keys, label) {
  assertExactKeys(source, keys, label);
  const output = {};
  for (const key of keys) {
    if (!Number.isSafeInteger(source[key]) || source[key] < 0) {
      throw new Error(`${label} contains an invalid decision count`);
    }
    output[key] = source[key];
  }
  return output;
}

function validateLock(source) {
  assertExactKeys(source, LOCK_KEYS, 'Adjudication lock');
  if (source.version !== 1
    || source.adjudicator !== 'codex_proxy'
    || !SHA256.test(source.semantic_worksheet_sha256)
    || !SHA256.test(source.usefulness_worksheet_sha256)
    || !SHA256.test(source.sealed_join_sha256)
    || source.proxy_only !== true) {
    throw new Error('Adjudication lock identity, hashes, or proxy relation are invalid');
  }
  return {
    version: 1,
    adjudicator: source.adjudicator,
    semantic_worksheet_sha256: source.semantic_worksheet_sha256,
    usefulness_worksheet_sha256: source.usefulness_worksheet_sha256,
    sealed_join_sha256: source.sealed_join_sha256,
    semantic_decision_counts: validateCounts(
      source.semantic_decision_counts,
      SEMANTIC_COUNT_KEYS,
      'Semantic decision counts',
    ),
    usefulness_decision_counts: validateCounts(
      source.usefulness_decision_counts,
      USEFULNESS_COUNT_KEYS,
      'Usefulness decision counts',
    ),
    completed_at_utc: validateUtc(source.completed_at_utc, 'Adjudication completion'),
    proxy_only: source.proxy_only,
  };
}

function assertSameCounts(actual, expected, label) {
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new Error(`${label} differ from the completed worksheet`);
  }
}

async function loadFreezeInputs(root, options) {
  const [
    blindSemanticBytes,
    blindUsefulnessBytes,
    semanticDecisionBytes,
    usefulnessDecisionBytes,
    joinBytes,
    key,
  ] = await Promise.all([
    readPrivateRegular(
      resolved(root, RELATIVE_PATHS.semanticWorksheet),
      'Blind semantic worksheet',
    ),
    readPrivateRegular(
      resolved(root, RELATIVE_PATHS.usefulnessWorksheet),
      'Blind usefulness worksheet',
    ),
    readPrivateRegular(options.semanticDecisionsPath, 'Semantic decision input'),
    readPrivateRegular(options.usefulnessDecisionsPath, 'Usefulness decision input'),
    readPrivateRegular(resolved(root, RELATIVE_PATHS.join), 'Sealed join'),
    readPrivateRegular(
      path.join(root, 'evaluator/sealed-join/adjudication-key.bin'),
      'Adjudication key',
    ),
  ]);
  if (key.length !== 32) throw new Error('Adjudication key must be exactly 32 bytes');
  const join = validateSealedJoin(parseJson(joinBytes, 'Sealed join'), key);
  await verifyCompletionMarker(root, join);
  const blindSemantic = validateWorksheetShape(
    parseJson(blindSemanticBytes, 'Blind semantic worksheet'),
    'semantic',
    { decisionsRequired: false },
  );
  const blindUsefulness = validateWorksheetShape(
    parseJson(blindUsefulnessBytes, 'Blind usefulness worksheet'),
    'usefulness',
    { decisionsRequired: false },
  );
  validateBlindJoin('semantic', blindSemantic, join.semantic);
  validateBlindJoin('usefulness', blindUsefulness, join.usefulness);
  await verifyBlindImages(root, 'semantic', blindSemantic, join.semantic);
  await verifyBlindImages(root, 'usefulness', blindUsefulness, join.usefulness);
  const semantic = completeWorksheet(
    'semantic',
    blindSemantic,
    parseJson(semanticDecisionBytes, 'Semantic decision input'),
  );
  const usefulness = completeWorksheet(
    'usefulness',
    blindUsefulness,
    parseJson(usefulnessDecisionBytes, 'Usefulness decision input'),
  );
  return {
    join,
    joinBytes,
    semantic,
    semanticBytes: Buffer.from(canonicalJson(semantic)),
    usefulness,
    usefulnessBytes: Buffer.from(canonicalJson(usefulness)),
  };
}

async function optionalPrivateRegular(filename, label) {
  try {
    return await readPrivateRegular(filename, label);
  } catch (error) {
    if (error.cause?.code === 'ENOENT') return null;
    throw error;
  }
}

export async function freezeAdjudication(options, dependencies = {}) {
  assertFreezeKeys(options);
  if (typeof options.root !== 'string'
    || !path.isAbsolute(options.root)
    || typeof options.semanticDecisionsPath !== 'string'
    || !path.isAbsolute(options.semanticDecisionsPath)
    || typeof options.usefulnessDecisionsPath !== 'string'
    || !path.isAbsolute(options.usefulnessDecisionsPath)) {
    throw new Error('Adjudication root and decision input paths must be absolute');
  }
  if (options.adjudicator !== 'codex_proxy') {
    throw new Error('Autonomous adjudication supports only codex_proxy; Dylan provenance is unsupported');
  }
  if (options.completedAtUtc !== undefined) {
    validateUtc(options.completedAtUtc, 'Adjudication completion');
  }
  const root = path.resolve(options.root);
  const io = normalizeDependencies(dependencies);
  if (await io.verifyFrozenRun({ root }) !== true) {
    throw new Error('Frozen run verification failed before adjudication freeze');
  }
  const inputs = await loadFreezeInputs(root, options);
  const lockPath = resolved(root, RELATIVE_PATHS.lock);
  const existingLockBytes = await optionalPrivateRegular(
    lockPath,
    'Adjudication lock',
  );
  if (existingLockBytes !== null) {
    const existing = validateLock(parseJson(existingLockBytes, 'Adjudication lock'));
    if (existing.adjudicator !== options.adjudicator) {
      throw new Error('Existing adjudication lock has different adjudicator provenance');
    }
    if (options.completedAtUtc !== undefined
      && existing.completed_at_utc !== options.completedAtUtc) {
      throw new Error('Existing adjudication lock has a different completion timestamp');
    }
    if (existing.semantic_worksheet_sha256 !== sha256(inputs.semanticBytes)
      || existing.usefulness_worksheet_sha256 !== sha256(inputs.usefulnessBytes)
      || existing.sealed_join_sha256 !== sha256(inputs.joinBytes)) {
      throw new Error('Existing adjudication lock differs from supplied decisions or sealed join');
    }
    return verifyAdjudicationGate({ root }, io);
  }
  const lock = validateLock({
    version: 1,
    adjudicator: options.adjudicator,
    semantic_worksheet_sha256: sha256(inputs.semanticBytes),
    usefulness_worksheet_sha256: sha256(inputs.usefulnessBytes),
    sealed_join_sha256: sha256(inputs.joinBytes),
    semantic_decision_counts: decisionCounts('semantic', inputs.semantic),
    usefulness_decision_counts: decisionCounts('usefulness', inputs.usefulness),
    completed_at_utc: options.completedAtUtc ?? new Date().toISOString(),
    proxy_only: true,
  });
  await writeImmutable(
    resolved(root, RELATIVE_PATHS.completedSemantic),
    inputs.semanticBytes,
  );
  await writeImmutable(
    resolved(root, RELATIVE_PATHS.completedUsefulness),
    inputs.usefulnessBytes,
  );
  await writeImmutable(lockPath, Buffer.from(canonicalJson(lock)));
  return verifyAdjudicationGate({ root }, io);
}

function resolvedCandidate(candidate, decision) {
  return {
    full_id: candidate.full_id,
    display_id: candidate.display_id,
    normalized_identity: structuredClone(candidate.normalized_identity),
    auto_exact: candidate.auto_exact,
    decision,
    refs: structuredClone(candidate.refs),
  };
}

export async function verifyAdjudicationGate(options, dependencies = {}) {
  assertExactKeys(options, GATE_KEYS, 'Adjudication gate options');
  if (typeof options.root !== 'string' || !path.isAbsolute(options.root)) {
    throw new Error('Adjudication gate root must be absolute');
  }
  const root = path.resolve(options.root);
  const io = normalizeDependencies(dependencies);
  if (await io.verifyFrozenRun({ root }) !== true) {
    throw new Error('Frozen run verification failed before adjudication reveal');
  }
  const lockBytes = await readPrivateRegular(
    resolved(root, RELATIVE_PATHS.lock),
    'Adjudication lock',
  );
  const lock = validateLock(parseJson(lockBytes, 'Adjudication lock'));
  const [
    semanticBytes,
    usefulnessBytes,
    joinBytes,
    blindSemanticBytes,
    blindUsefulnessBytes,
    key,
  ] = await Promise.all([
    readPrivateRegular(
      resolved(root, RELATIVE_PATHS.completedSemantic),
      'Completed semantic worksheet',
    ),
    readPrivateRegular(
      resolved(root, RELATIVE_PATHS.completedUsefulness),
      'Completed usefulness worksheet',
    ),
    readPrivateRegular(resolved(root, RELATIVE_PATHS.join), 'Sealed join'),
    readPrivateRegular(
      resolved(root, RELATIVE_PATHS.semanticWorksheet),
      'Blind semantic worksheet',
    ),
    readPrivateRegular(
      resolved(root, RELATIVE_PATHS.usefulnessWorksheet),
      'Blind usefulness worksheet',
    ),
    readPrivateRegular(
      path.join(root, 'evaluator/sealed-join/adjudication-key.bin'),
      'Adjudication key',
    ),
  ]);
  if (lock.semantic_worksheet_sha256 !== sha256(semanticBytes)
    || lock.usefulness_worksheet_sha256 !== sha256(usefulnessBytes)
    || lock.sealed_join_sha256 !== sha256(joinBytes)) {
    throw new Error('Adjudication lock hash differs from a completed worksheet or sealed join');
  }
  if (key.length !== 32) throw new Error('Adjudication key must be exactly 32 bytes');
  const join = validateSealedJoin(parseJson(joinBytes, 'Sealed join'), key);
  await verifyCompletionMarker(root, join);
  const blindSemantic = validateWorksheetShape(
    parseJson(blindSemanticBytes, 'Blind semantic worksheet'),
    'semantic',
    { decisionsRequired: false },
  );
  const blindUsefulness = validateWorksheetShape(
    parseJson(blindUsefulnessBytes, 'Blind usefulness worksheet'),
    'usefulness',
    { decisionsRequired: false },
  );
  validateBlindJoin('semantic', blindSemantic, join.semantic);
  validateBlindJoin('usefulness', blindUsefulness, join.usefulness);
  await verifyBlindImages(root, 'semantic', blindSemantic, join.semantic);
  await verifyBlindImages(root, 'usefulness', blindUsefulness, join.usefulness);
  const semantic = validateCompletedWorksheet(
    'semantic',
    blindSemantic,
    parseJson(semanticBytes, 'Completed semantic worksheet'),
  );
  const usefulness = validateCompletedWorksheet(
    'usefulness',
    blindUsefulness,
    parseJson(usefulnessBytes, 'Completed usefulness worksheet'),
  );
  assertSameCounts(
    lock.semantic_decision_counts,
    decisionCounts('semantic', semantic),
    'Semantic adjudication-lock decision counts',
  );
  assertSameCounts(
    lock.usefulness_decision_counts,
    decisionCounts('usefulness', usefulness),
    'Usefulness adjudication-lock decision counts',
  );
  const semanticDecisions = new Map(
    semantic.candidates.map((candidate) => [candidate.candidate_id, candidate.decision]),
  );
  const usefulnessDecisions = new Map(
    usefulness.candidates.map((candidate) => [candidate.candidate_id, candidate.decision]),
  );
  return deepFreeze({
    version: 1,
    adjudicator: lock.adjudicator,
    proxy_only: lock.proxy_only,
    adjudication_lock_sha256: sha256(lockBytes),
    completion_marker_sha256: join.completion_marker_sha256,
    semantic: join.semantic.map((candidate) => resolvedCandidate(
      candidate,
      candidate.auto_exact
        ? 'same_destination'
        : semanticDecisions.get(candidate.display_id),
    )),
    usefulness: join.usefulness.map((candidate) => resolvedCandidate(
      candidate,
      usefulnessDecisions.get(candidate.display_id),
    )),
  });
}
