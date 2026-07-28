import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import {
  lstat,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
} from 'node:fs/promises';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

export const CODEX_TIMEOUT_MS = 1_200_000;
export const TERMINATION_GRACE_MS = 5_000;
export const ATTEMPT_STATUS = Object.freeze({
  VALID_PREDICTION: 'valid_prediction',
  INVALID_TOOL_USE: 'invalid_tool_use',
  INFRASTRUCTURE_FAILURE: 'infrastructure_failure',
  INVALID_SCHEMA: 'invalid_schema',
});

const MODEL = 'gpt-5.6-sol';
const MODEL_REASONING_EFFORT = 'max';
const SERVICE_TIER = 'priority';
const PROMPT_ID = 'NAP-ACTION-TARGET-V1';
const CONDITIONS = new Set(['state_only', 'state_plus_all_prior']);
const PASSIVE_EVENT_TYPES = new Set([
  'thread.started',
  'turn.started',
  'turn.completed',
  'item.started',
  'item.updated',
  'item.completed',
  'agent_message',
  'reasoning',
]);
const ITEM_EVENT_TYPES = new Set(['item.started', 'item.updated', 'item.completed']);
const PASSIVE_ITEM_TYPES = new Set(['agent_message', 'reasoning']);
const ALLOWED_HOST_ENV_NAMES = new Set(['PATH', 'HOME', 'TMPDIR', 'SHELL', 'LANG']);
const SENSITIVE_ENV_NAME = /(TOKEN|KEY|SECRET|PASSWORD|CREDENTIAL)/i;
const ARTIFACT_BASENAMES = Object.freeze({
  schema: 'prediction.schema.json',
  events: 'events.jsonl',
  final: 'final.json',
  attempt: 'attempt.json',
});
const FROZEN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['predictions'],
  properties: {
    predictions: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['rank', 'app', 'object', 'subtarget', 'reason'],
        properties: {
          rank: { type: 'integer', minimum: 1, maximum: 3 },
          app: { type: 'string', minLength: 1 },
          object: { type: 'string', minLength: 1 },
          subtarget: { type: ['string', 'null'] },
          reason: { type: 'string', minLength: 1 },
        },
      },
    },
  },
};

function fail(message, cause) {
  throw new Error(`Cannot execute attempt: ${message}`, cause === undefined ? undefined : { cause });
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function nonemptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') fail(`${name} must be a nonempty string`);
  return value;
}

function exactObjectKeys(value, expected) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...expected].sort();
  return isDeepStrictEqual(actualKeys, expectedKeys);
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function serializeError(error) {
  if (!error) return null;
  return {
    name: typeof error.name === 'string' ? error.name : 'Error',
    message: typeof error.message === 'string' ? error.message : String(error),
    code: error.code ?? null,
  };
}

function isoNow(nowImpl) {
  const value = nowImpl();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) fail('clock returned an invalid date');
  return date.toISOString();
}

function validateAbsolutePath(inputPath, name) {
  nonemptyString(inputPath, name);
  if (!path.isAbsolute(inputPath) || path.normalize(inputPath) !== inputPath) {
    fail(`${name} must be a normalized absolute path`);
  }
}

async function statRegularFile(inputPath, name, { rejectSymlink = true } = {}) {
  let stat;
  try {
    stat = await lstat(inputPath);
  } catch (error) {
    fail(`${name} does not exist`, error);
  }
  if (rejectSymlink && stat.isSymbolicLink()) fail(`${name} must not be a symlink`);
  if (!stat.isFile()) fail(`${name} must be a regular file`);
  return stat;
}

async function pathExists(inputPath) {
  try {
    await lstat(inputPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function fsyncDirectory(directory) {
  const handle = await open(directory, 'r');
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function atomicReplaceFile(destination, bytes) {
  const temporary = `${destination}.tmp-${process.pid}-${randomUUID()}`;
  const handle = await open(temporary, 'wx', 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } catch (error) {
    await handle.close().catch(() => {});
    await rm(temporary, { force: true }).catch(() => {});
    throw error;
  }
  await handle.close();
  try {
    await rename(temporary, destination);
    await fsyncDirectory(path.dirname(destination));
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => {});
    throw error;
  }
}

async function claimAttemptSlot(attemptPath) {
  const lockPath = `${attemptPath}.lock`;
  let lock;
  try {
    lock = await open(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') fail('attempt is already in progress');
    throw error;
  }
  if (await pathExists(attemptPath)) {
    await lock.close();
    await rm(lockPath, { force: true });
    fail('attempt already exists');
  }
  return { lock, lockPath };
}

async function releaseAttemptSlot({ lock, lockPath }) {
  await lock.close().catch(() => {});
  await rm(lockPath, { force: true });
  await fsyncDirectory(path.dirname(lockPath));
}

async function persistAttemptRecord(attemptPath, record) {
  try {
    if (await pathExists(attemptPath)) fail('attempt already exists');
    const bytes = Buffer.from(`${JSON.stringify(record, null, 2)}\n`);
    await atomicReplaceFile(attemptPath, bytes);
  } catch (error) {
    throw error;
  }
}

function validateSchedule(schedule) {
  if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) fail('schedule must be an object');
  for (const name of ['call_sequence_index', 'paired_target_ordinal', 'event_row_version']) {
    if (!Number.isInteger(schedule[name]) || schedule[name] < 1) fail(`schedule.${name} must be a positive integer`);
  }
  nonemptyString(schedule.event_id, 'schedule.event_id');
  if (!CONDITIONS.has(schedule.condition)) fail('schedule.condition is not frozen');
  if (!Array.isArray(schedule.history_event_ids_ordered) || schedule.history_event_ids_ordered.some((id) => typeof id !== 'string' || id === '')) {
    fail('schedule.history_event_ids_ordered must be an array of event IDs');
  }
}

function validatePacket(schedule, packet) {
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) fail('packet must be an object');
  if (packet.event_id !== schedule.event_id) fail('packet event does not match schedule');
  if (packet.row_version !== schedule.event_row_version) fail('packet row version does not match schedule');
  if (packet.condition !== schedule.condition) fail('packet condition does not match schedule');
  nonemptyString(packet.prompt_text, 'packet.prompt_text');
  if (!Array.isArray(packet.images) || packet.images.length === 0) fail('packet.images must be nonempty');
  for (const [index, image] of packet.images.entries()) {
    if (!image || typeof image !== 'object' || image.attachment_ordinal !== index + 1) {
      fail('packet image attachment ordinals must be consecutive from 1');
    }
    validateAbsolutePath(image.path, `image ${index + 1} path`);
    if (!/^[a-f0-9]{64}$/.test(image.sha256 ?? '')) fail(`packet image ${index + 1} SHA-256 must be lowercase`);
  }
}

async function validateFrozenSchema(schemaPath) {
  await statRegularFile(schemaPath, 'schema', { rejectSymlink: true });
  let schema;
  try {
    schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  } catch (error) {
    fail('schema is not valid JSON', error);
  }
  if (!isDeepStrictEqual(schema, FROZEN_SCHEMA)) fail('schema does not match the frozen prediction contract');
}

async function validateDirectory(directory, name) {
  validateAbsolutePath(directory, name);
  let directoryStat;
  try {
    directoryStat = await lstat(directory);
  } catch (error) {
    fail(`${name} does not exist`, error);
  }
  if (directoryStat.isSymbolicLink()) fail(`${name} must not be a symlink`);
  if (!directoryStat.isDirectory()) fail(`${name} must be a directory`);
}

function pathContains(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function buildSanitizedChildEnv(codexHomePath) {
  const childEnv = {};
  for (const name of Object.keys(process.env).sort()) {
    if (SENSITIVE_ENV_NAME.test(name)) continue;
    if (!ALLOWED_HOST_ENV_NAMES.has(name) && !/^LC_[A-Za-z0-9_]+$/.test(name)) continue;
    if (typeof process.env[name] === 'string') childEnv[name] = process.env[name];
  }
  childEnv.CODEX_HOME = codexHomePath;
  return childEnv;
}

async function validateCallPaths({
  cleanCallDirectory,
  schemaPath,
  stagingFinalPath,
  codexHomePath,
  eventsPath,
  finalPath,
  attemptPath,
  renderedPacketPath,
  promptText,
  packetImages,
  modelImagePathsOrdered,
}) {
  await validateDirectory(cleanCallDirectory, 'clean call directory');
  const stagingArtifacts = [
    ['schema', schemaPath, ARTIFACT_BASENAMES.schema],
    ['staging final', stagingFinalPath, ARTIFACT_BASENAMES.final],
  ];
  for (const [name, artifactPath, basename] of stagingArtifacts) {
    validateAbsolutePath(artifactPath, name);
    if (path.dirname(artifactPath) !== cleanCallDirectory) fail(`${name} path must be a direct child of the clean call directory`);
    if (path.basename(artifactPath) !== basename) fail(`${name} path must be named ${basename}`);
  }
  await validateFrozenSchema(schemaPath);
  if (await pathExists(stagingFinalPath)) {
    const stat = await statRegularFile(stagingFinalPath, 'staging final', { rejectSymlink: true });
    if (stat.size !== 0) fail('staging final already contains data');
  }

  for (const artifactPath of [eventsPath, finalPath, attemptPath]) validateAbsolutePath(artifactPath, 'durable audit artifact');
  const auditParents = new Set([eventsPath, finalPath, attemptPath].map((artifactPath) => path.dirname(artifactPath)));
  if (auditParents.size !== 1) fail('durable audit artifacts must share the same directory');
  const [auditDirectory] = auditParents;
  await validateDirectory(auditDirectory, 'audit directory');
  const durableArtifacts = [
    ['event log', eventsPath, ARTIFACT_BASENAMES.events],
    ['durable final response', finalPath, ARTIFACT_BASENAMES.final],
    ['attempt', attemptPath, ARTIFACT_BASENAMES.attempt],
  ];
  for (const [name, artifactPath, basename] of durableArtifacts) {
    if (path.basename(artifactPath) !== basename) fail(`${name} path must be named ${basename}`);
  }
  if (new Set(durableArtifacts.map(([, artifactPath]) => artifactPath)).size !== durableArtifacts.length) {
    fail('durable audit artifact paths must be distinct');
  }

  const cleanRealPath = await realpath(cleanCallDirectory);
  const auditRealPath = await realpath(auditDirectory);
  if (pathContains(cleanRealPath, auditRealPath) || pathContains(auditRealPath, cleanRealPath)) {
    fail('clean call directory and audit directory must be disjoint');
  }

  if (codexHomePath === undefined) fail('codexHomePath must be explicitly provided');
  validateAbsolutePath(codexHomePath, 'codexHomePath');
  if (codexHomePath.includes('BLOG-CAND-')) fail('codexHomePath must not contain an event ID');
  await validateDirectory(codexHomePath, 'Codex home');
  const codexHomeRealPath = await realpath(codexHomePath);
  if (pathContains(cleanRealPath, codexHomeRealPath)
    || pathContains(codexHomeRealPath, cleanRealPath)
    || pathContains(auditRealPath, codexHomeRealPath)
    || pathContains(codexHomeRealPath, auditRealPath)) {
    fail('Codex home must be disjoint from clean, audit, and model-image directories');
  }

  validateAbsolutePath(renderedPacketPath, 'renderedPacketPath');
  if (path.dirname(renderedPacketPath) !== auditDirectory || path.basename(renderedPacketPath) !== 'packet.json') {
    fail('rendered packet must be audit-directory packet.json');
  }
  await statRegularFile(renderedPacketPath, 'rendered packet', { rejectSymlink: true });
  const renderedPromptPath = path.join(auditDirectory, 'prompt.txt');
  if (await pathExists(renderedPromptPath)) {
    await statRegularFile(renderedPromptPath, 'rendered prompt', { rejectSymlink: true });
    if (await readFile(renderedPromptPath, 'utf8') !== promptText) fail('rendered prompt does not match packet prompt');
  }

  if (await pathExists(attemptPath)) fail('attempt already exists');
  for (const [name, artifactPath] of [['event log', eventsPath], ['durable final response', finalPath]]) {
    if (await pathExists(artifactPath)) {
      const stat = await statRegularFile(artifactPath, name, { rejectSymlink: true });
      if (stat.size !== 0) fail(`${name} already contains data`);
    }
  }

  if (!Array.isArray(modelImagePathsOrdered)) {
    fail('modelImagePathsOrdered must be explicitly provided');
  }
  if (modelImagePathsOrdered.length !== packetImages.length) {
    fail('model image list must have the same length as packet images');
  }
  if (new Set(modelImagePathsOrdered).size !== modelImagePathsOrdered.length) {
    fail('model image paths must be unique and ordered');
  }

  for (const [index, packetImage] of packetImages.entries()) {
    const packetImagePath = packetImage.path;
    validateAbsolutePath(packetImagePath, `packet image ${index + 1} path`);
    if (pathContains(cleanCallDirectory, packetImagePath) || pathContains(auditDirectory, packetImagePath)) {
      fail(`packet image ${index + 1} must be outside staging and audit directories`);
    }
    await statRegularFile(packetImagePath, `packet image ${index + 1}`, { rejectSymlink: true });

    const modelImagePath = modelImagePathsOrdered[index];
    validateAbsolutePath(modelImagePath, `model image ${index + 1} path`);
    const expectedBasename = `image-${String(index + 1).padStart(3, '0')}.png`;
    if (path.basename(modelImagePath) !== expectedBasename) {
      fail(`model image ${index + 1} must be named ${expectedBasename}`);
    }
    if (modelImagePath.includes('BLOG-CAND-')) fail(`model image ${index + 1} path must not contain an event ID`);
    if (pathContains(cleanCallDirectory, modelImagePath) || pathContains(auditDirectory, modelImagePath)) {
      fail(`model image ${index + 1} must be outside staging and audit directories`);
    }
    await statRegularFile(modelImagePath, `model image ${index + 1}`, { rejectSymlink: true });
    const modelImageRealPath = await realpath(modelImagePath);
    if (pathContains(cleanRealPath, modelImageRealPath) || pathContains(auditRealPath, modelImageRealPath)) {
      fail(`model image ${index + 1} must be outside staging and audit directories`);
    }
    const modelImageDirectoryRealPath = await realpath(path.dirname(modelImagePath));
    if (pathContains(codexHomeRealPath, modelImageDirectoryRealPath)
      || pathContains(modelImageDirectoryRealPath, codexHomeRealPath)) {
      fail('Codex home must be disjoint from clean, audit, and model-image directories');
    }
    if (modelImagePath === packetImagePath) fail(`model image ${index + 1} must be separate from packet provenance`);
    if (sha256(await readFile(modelImagePath)) !== packetImage.sha256) {
      fail(`model image ${index + 1} SHA-256 mismatch`);
    }
  }

  const allowedStagingNames = new Set(stagingArtifacts.map(([, artifactPath]) => path.basename(artifactPath)));
  const unexpectedStaging = (await readdir(cleanCallDirectory)).filter((entry) => !allowedStagingNames.has(entry));
  if (unexpectedStaging.length > 0) {
    fail(`clean call directory contains unexpected entries: ${unexpectedStaging.sort().join(', ')}`);
  }

  const allowedAuditNames = new Set([
    'packet.json',
    'prompt.txt',
    ...durableArtifacts.map(([, artifactPath]) => path.basename(artifactPath)),
    `${path.basename(attemptPath)}.lock`,
  ]);
  const unexpectedAudit = (await readdir(auditDirectory)).filter((entry) => !allowedAuditNames.has(entry));
  if (unexpectedAudit.length > 0) fail(`audit directory contains unexpected entries: ${unexpectedAudit.sort().join(', ')}`);
}

function validateAuditIdentity({
  runId,
  datasetSnapshotId,
  manifestId,
  renderedPacketPath,
  renderedPacketSha256,
}) {
  nonemptyString(runId, 'runId');
  nonemptyString(datasetSnapshotId, 'datasetSnapshotId');
  nonemptyString(manifestId, 'manifestId');
  validateAbsolutePath(renderedPacketPath, 'renderedPacketPath');
  if (!/^[a-f0-9]{64}$/.test(renderedPacketSha256 ?? '')) fail('renderedPacketSha256 must be lowercase SHA-256');
}

async function validateRenderedPacket(renderedPacketPath, expectedSha256) {
  await statRegularFile(renderedPacketPath, 'rendered packet', { rejectSymlink: true });
  const actual = sha256(await readFile(renderedPacketPath));
  if (actual !== expectedSha256) fail('rendered packet SHA-256 mismatch');
}

export function buildCodexArgs({
  instruction,
  schemaPath,
  finalPath,
  cleanCallDirectory,
  modelImagePathsOrdered,
}) {
  nonemptyString(instruction, 'instruction');
  validateAbsolutePath(schemaPath, 'schemaPath');
  validateAbsolutePath(finalPath, 'finalPath');
  validateAbsolutePath(cleanCallDirectory, 'cleanCallDirectory');
  if (!Array.isArray(modelImagePathsOrdered) || modelImagePathsOrdered.length === 0) {
    fail('modelImagePathsOrdered must be explicitly provided and nonempty');
  }
  for (const [index, imagePath] of modelImagePathsOrdered.entries()) {
    validateAbsolutePath(imagePath, `model image ${index + 1} path`);
  }
  return [
    'exec',
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox', 'read-only',
    '--model', MODEL,
    '-c', `model_reasoning_effort=${JSON.stringify(MODEL_REASONING_EFFORT)}`,
    '-c', `service_tier=${JSON.stringify(SERVICE_TIER)}`,
    '-c', `developer_instructions=${JSON.stringify(instruction)}`,
    '--output-schema', schemaPath,
    '--json',
    '--output-last-message', finalPath,
    '--cd', cleanCallDirectory,
    ...modelImagePathsOrdered.flatMap((imagePath) => ['--image', imagePath]),
    '--',
    '-',
  ];
}

function toolDiscriminator(value) {
  if (typeof value !== 'string') return false;
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return /^(?:tool|tool_call|tool_use|function_call|command|command_execution|shell|shell_command|mcp|mcp_call|mcp_tool_call|web|web_search|web_search_call|computer|computer_use|browser|browser_action)$/.test(normalized)
    || /^tools?_call$/.test(normalized)
    || /^(?:[a-z0-9]+_)*tool_(?:call|use)$/.test(normalized);
}

export function observedToolUse(event) {
  if (!event || typeof event !== 'object') return false;
  if (Array.isArray(event)) return event.some(observedToolUse);
  if (event.role === 'tool') return true;
  for (const [key, value] of Object.entries(event)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (['tool', 'tool_call', 'tool_calls', 'tool_use', 'function_call', 'command_execution', 'shell_command', 'mcp_call'].includes(normalizedKey)) {
      if (value !== null && value !== undefined && value !== false) return true;
    }
    if (['type', 'kind', 'event', 'event_type', 'method', 'name'].includes(normalizedKey) && toolDiscriminator(value)) return true;
    if (value && typeof value === 'object' && observedToolUse(value)) return true;
  }
  return false;
}

function inspectEvents(eventBytes) {
  const observedEvents = [];
  const categoryCounts = {
    passive: 0,
    tool_use: 0,
    malformed_jsonl: 0,
    error_event: 0,
    failed_lifecycle: 0,
    unclassified: 0,
  };
  const observabilityFailureCategories = [];
  const unclassifiedDescriptors = [];
  const addObservabilityFailure = (category) => {
    if (!observabilityFailureCategories.includes(category)) observabilityFailureCategories.push(category);
  };
  const lines = eventBytes.toString('utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length === 0) addObservabilityFailure('empty_event_stream');
  for (const [lineIndex, rawLine] of lines.entries()) {
    let event;
    if (rawLine.trim() === '') continue;
    try {
      event = JSON.parse(rawLine);
    } catch {
      categoryCounts.malformed_jsonl += 1;
      addObservabilityFailure('malformed_jsonl');
      continue;
    }
    observedEvents.push(event);
    if (observedToolUse(event)) {
      categoryCounts.tool_use += 1;
      continue;
    }
    if (!event || typeof event !== 'object' || Array.isArray(event) || typeof event.type !== 'string') {
      categoryCounts.unclassified += 1;
      addObservabilityFailure('unclassified_event_type');
      unclassifiedDescriptors.push({ line: lineIndex + 1, event_type: event?.type ?? null, item_type: null });
      continue;
    }
    if (event.type === 'error') {
      categoryCounts.error_event += 1;
      addObservabilityFailure('error_event');
      continue;
    }
    if (event.type.endsWith('.failed')) {
      categoryCounts.failed_lifecycle += 1;
      addObservabilityFailure('failed_lifecycle');
      continue;
    }
    if (ITEM_EVENT_TYPES.has(event.type)) {
      if (!event.item || typeof event.item !== 'object' || Array.isArray(event.item) || typeof event.item.type !== 'string') {
        categoryCounts.unclassified += 1;
        addObservabilityFailure('unclassified_item_type');
        unclassifiedDescriptors.push({ line: lineIndex + 1, event_type: event.type, item_type: event.item?.type ?? null });
      } else if (PASSIVE_ITEM_TYPES.has(event.item.type)) {
        categoryCounts.passive += 1;
      } else {
        categoryCounts.tool_use += 1;
      }
      continue;
    }
    if (PASSIVE_EVENT_TYPES.has(event.type)) {
      categoryCounts.passive += 1;
      continue;
    }
    categoryCounts.unclassified += 1;
    addObservabilityFailure('unclassified_event_type');
    unclassifiedDescriptors.push({ line: lineIndex + 1, event_type: event.type, item_type: null });
  }
  return {
    observedEvents,
    categoryCounts,
    observabilityFailureCategories,
    unclassifiedDescriptors,
    toolUse: categoryCounts.tool_use > 0,
  };
}

function validateFinalResponse(rawText) {
  let value;
  try {
    value = JSON.parse(rawText);
  } catch {
    return { valid: false, reason: 'final response is not valid JSON', predictions: [] };
  }
  if (!exactObjectKeys(value, ['predictions'])) {
    return { valid: false, reason: 'final response top-level schema mismatch', predictions: [] };
  }
  if (!Array.isArray(value.predictions) || value.predictions.length < 1 || value.predictions.length > 3) {
    return { valid: false, reason: 'predictions must contain one to three items', predictions: [] };
  }
  const required = ['rank', 'app', 'object', 'subtarget', 'reason'];
  for (const [index, prediction] of value.predictions.entries()) {
    if (!exactObjectKeys(prediction, required)) {
      return { valid: false, reason: `prediction ${index + 1} schema mismatch`, predictions: [] };
    }
    if (!Number.isInteger(prediction.rank) || prediction.rank < 1 || prediction.rank > 3) {
      return { valid: false, reason: `prediction ${index + 1} rank is invalid`, predictions: [] };
    }
    if (typeof prediction.app !== 'string' || prediction.app.length < 1
      || typeof prediction.object !== 'string' || prediction.object.length < 1
      || typeof prediction.reason !== 'string' || prediction.reason.length < 1
      || (prediction.subtarget !== null && typeof prediction.subtarget !== 'string')) {
      return { valid: false, reason: `prediction ${index + 1} field type is invalid`, predictions: [] };
    }
    if (prediction.rank !== index + 1) {
      return { valid: false, reason: 'prediction ranks must be unique and consecutive from 1', predictions: [] };
    }
  }
  const predictions = value.predictions.map((prediction) => ({
    rank: prediction.rank,
    app: prediction.app,
    object: prediction.object,
    subtarget: prediction.subtarget,
    canonical_label: prediction.subtarget === null
      ? `${prediction.app} -> ${prediction.object}`
      : `${prediction.app} -> ${prediction.object} -> ${prediction.subtarget}`,
    reason: prediction.reason,
  }));
  return { valid: true, reason: null, predictions };
}

function classify({
  toolUse,
  observabilityFailureCategories,
  timedOut,
  exitCode,
  spawnError,
  finalPresent,
  finalValidation,
}) {
  if (toolUse) {
    return { attemptStatus: ATTEMPT_STATUS.INVALID_TOOL_USE, invalidReason: 'observed_tool_use', predictions: [] };
  }
  const nonemptyStreamFailures = observabilityFailureCategories.filter((category) => category !== 'empty_event_stream');
  if (nonemptyStreamFailures.length > 0) {
    return {
      attemptStatus: ATTEMPT_STATUS.INFRASTRUCTURE_FAILURE,
      invalidReason: `event_stream_observability_failure:${nonemptyStreamFailures.join('+')}`,
      predictions: [],
    };
  }
  if (timedOut) {
    return { attemptStatus: ATTEMPT_STATUS.INFRASTRUCTURE_FAILURE, invalidReason: 'timeout', predictions: [] };
  }
  if (spawnError) {
    return { attemptStatus: ATTEMPT_STATUS.INFRASTRUCTURE_FAILURE, invalidReason: 'spawn_error', predictions: [] };
  }
  if (exitCode !== 0) {
    return { attemptStatus: ATTEMPT_STATUS.INFRASTRUCTURE_FAILURE, invalidReason: 'nonzero_exit', predictions: [] };
  }
  if (!finalPresent) {
    return { attemptStatus: ATTEMPT_STATUS.INFRASTRUCTURE_FAILURE, invalidReason: 'absent_final_response', predictions: [] };
  }
  if (observabilityFailureCategories.includes('empty_event_stream')) {
    return {
      attemptStatus: ATTEMPT_STATUS.INFRASTRUCTURE_FAILURE,
      invalidReason: 'event_stream_observability_failure:empty_event_stream',
      predictions: [],
    };
  }
  if (!finalValidation.valid) {
    return { attemptStatus: ATTEMPT_STATUS.INVALID_SCHEMA, invalidReason: finalValidation.reason, predictions: [] };
  }
  return {
    attemptStatus: ATTEMPT_STATUS.VALID_PREDICTION,
    invalidReason: null,
    predictions: finalValidation.predictions,
  };
}

async function collectProcess({
  codexCommand,
  args,
  promptText,
  cleanCallDirectory,
  childEnv,
  spawnImpl,
  setTimeoutImpl,
  clearTimeoutImpl,
}) {
  let child;
  let spawnError = null;
  try {
    child = spawnImpl(codexCommand, args, {
      cwd: cleanCallDirectory,
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: childEnv,
    });
  } catch (error) {
    return {
      stdout: Buffer.alloc(0),
      stderr: Buffer.alloc(0),
      exitCode: null,
      signal: null,
      timedOut: false,
      spawnError: serializeError(error),
    };
  }

  const stdoutChunks = [];
  const stderrChunks = [];
  child.stdout?.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
  child.stderr?.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));

  let timedOut = false;
  let finished = false;
  let timeoutHandle;
  let killHandle;
  const resultPromise = new Promise((resolve) => {
    const finish = (exitCode, signal, error = null) => {
      if (finished) return;
      finished = true;
      spawnError = error ? serializeError(error) : spawnError;
      resolve({ exitCode, signal });
    };
    child.once('error', (error) => finish(null, null, error));
    child.once('close', (exitCode, signal) => finish(exitCode, signal));
    timeoutHandle = setTimeoutImpl(() => {
      if (finished) return;
      timedOut = true;
      try {
        child.kill('SIGTERM');
      } catch {
        // The close/error result remains authoritative.
      }
      killHandle = setTimeoutImpl(() => {
        if (finished) return;
        try {
          child.kill('SIGKILL');
        } catch {
          // The close/error result remains authoritative.
        }
      }, TERMINATION_GRACE_MS);
    }, CODEX_TIMEOUT_MS);
  });

  try {
    child.stdin.end(promptText);
  } catch (error) {
    spawnError = serializeError(error);
    try {
      child.kill('SIGTERM');
    } catch {
      // The persisted spawn error is sufficient.
    }
  }

  const { exitCode, signal } = await resultPromise;
  if (timeoutHandle !== undefined) clearTimeoutImpl(timeoutHandle);
  if (killHandle !== undefined) clearTimeoutImpl(killHandle);
  return {
    stdout: Buffer.concat(stdoutChunks),
    stderr: Buffer.concat(stderrChunks),
    exitCode,
    signal,
    timedOut,
    spawnError,
  };
}

export async function executeAttempt({
  runId,
  datasetSnapshotId,
  manifestId,
  schedule,
  packet,
  renderedPacketPath,
  renderedPacketSha256,
  instruction,
  schemaPath,
  cleanCallDirectory,
  stagingFinalPath = path.join(cleanCallDirectory, ARTIFACT_BASENAMES.final),
  modelImagePathsOrdered,
  codexHomePath,
  eventsPath,
  finalPath,
  attemptPath,
  codexCommand = 'codex',
  modelVersion = null,
  spawnImpl = spawn,
  setTimeoutImpl = setTimeout,
  clearTimeoutImpl = clearTimeout,
  nowImpl = () => new Date(),
  monotonicNowImpl = () => performance.now(),
}) {
  validateAuditIdentity({ runId, datasetSnapshotId, manifestId, renderedPacketPath, renderedPacketSha256 });
  validateSchedule(schedule);
  validatePacket(schedule, packet);
  nonemptyString(instruction, 'instruction');
  nonemptyString(codexCommand, 'codexCommand');
  await validateCallPaths({
    cleanCallDirectory,
    schemaPath,
    stagingFinalPath,
    codexHomePath,
    eventsPath,
    finalPath,
    attemptPath,
    renderedPacketPath,
    promptText: packet.prompt_text,
    packetImages: packet.images,
    modelImagePathsOrdered,
  });
  await validateRenderedPacket(renderedPacketPath, renderedPacketSha256);
  const attemptSlot = await claimAttemptSlot(attemptPath);
  try {
    const schemaBytes = await readFile(schemaPath);
    const requestedAtUtc = isoNow(nowImpl);
    const monotonicStarted = monotonicNowImpl();
    const childEnv = buildSanitizedChildEnv(codexHomePath);
    const args = buildCodexArgs({
      instruction,
      schemaPath,
      finalPath: stagingFinalPath,
      cleanCallDirectory,
      modelImagePathsOrdered,
    });

    await rm(stagingFinalPath, { force: true });
    const processResult = await collectProcess({
      codexCommand,
      args,
      promptText: packet.prompt_text,
      cleanCallDirectory,
      childEnv,
      spawnImpl,
      setTimeoutImpl,
      clearTimeoutImpl,
    });
    const completedAtUtc = isoNow(nowImpl);
    const durationMs = Math.max(0, monotonicNowImpl() - monotonicStarted);
    const eventBytes = processResult.stdout;
    const eventInspection = inspectEvents(eventBytes);
    let finalBytes = Buffer.alloc(0);
    let finalPresent = false;
    try {
      finalBytes = await readFile(stagingFinalPath);
      finalPresent = finalBytes.toString('utf8').trim().length > 0;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const finalValidation = finalPresent
      ? validateFinalResponse(finalBytes.toString('utf8'))
      : { valid: false, reason: 'absent final response', predictions: [] };
    const classification = classify({
      toolUse: eventInspection.toolUse,
      observabilityFailureCategories: eventInspection.observabilityFailureCategories,
      timedOut: processResult.timedOut,
      exitCode: processResult.exitCode,
      spawnError: processResult.spawnError,
      finalPresent,
      finalValidation,
    });

    await atomicReplaceFile(eventsPath, eventBytes);
    await atomicReplaceFile(finalPath, finalBytes);
    const savedAtUtc = isoNow(nowImpl);
    const record = {
    record_version: 1,
    run_id: runId,
    dataset_snapshot_id: datasetSnapshotId,
    manifest_id: manifestId,
    event_id: schedule.event_id,
    event_row_version: schedule.event_row_version,
    condition: schedule.condition,
    paired_target_ordinal: schedule.paired_target_ordinal,
    call_sequence_index: schedule.call_sequence_index,
    model_provider: 'OpenAI',
    model_name: MODEL,
    model_version: modelVersion,
    inference_parameters: {
      temperature: null,
      top_p: null,
      max_output_tokens: null,
      seed: null,
      provider_defaults: ['temperature', 'top_p', 'max_output_tokens', 'seed'],
      model_reasoning_effort: MODEL_REASONING_EFFORT,
      service_tier: SERVICE_TIER,
    },
    prompt_id: PROMPT_ID,
    history_event_ids_ordered: [...schedule.history_event_ids_ordered],
    rendered_packet_path: renderedPacketPath,
    rendered_packet_sha256: renderedPacketSha256,
    requested_at_utc: requestedAtUtc,
    raw_response_path: finalPath,
    raw_response_sha256: finalPresent ? sha256(finalBytes) : null,
    attempt_status: classification.attemptStatus,
    invalid_reason: classification.invalidReason,
    attempt_saved_at_utc: savedAtUtc,
    prediction_saved_at_utc: classification.attemptStatus === ATTEMPT_STATUS.VALID_PREDICTION ? savedAtUtc : null,
    ranked_predictions: classification.predictions,
    label_revealed_at_utc: null,
    scored_after_prediction: {
      exact_top_1: null,
      exact_top_3: null,
      useful_shortcut: null,
      scoring_notes: null,
    },
    scored_at_utc: null,
    scorer: null,
    completed_at_utc: completedAtUtc,
    duration_ms: durationMs,
    execution: {
      adapter_template_id: 'CODEX-EXEC-NAP-V2',
      executable: codexCommand,
      argv: args,
      shell: false,
      model: MODEL,
      model_reasoning_effort: MODEL_REASONING_EFFORT,
      service_tier: SERVICE_TIER,
      timeout_ms: CODEX_TIMEOUT_MS,
      termination_grace_ms: TERMINATION_GRACE_MS,
      clean_call_directory: cleanCallDirectory,
      staging_final_path: stagingFinalPath,
      prompt_isolation_strategy_id: 'CODEX-HOME-NEUTRAL-V1',
      codex_home_path: codexHomePath,
      image_paths_ordered: modelImagePathsOrdered,
    },
    prompt_sha256: sha256(packet.prompt_text),
    instruction_sha256: sha256(instruction),
    schema_sha256: sha256(schemaBytes),
    event_log: {
      path: eventsPath,
      sha256: sha256(eventBytes),
      parsed_event_count: eventInspection.observedEvents.length,
      malformed_line_count: eventInspection.categoryCounts.malformed_jsonl,
      observed_tool_use: eventInspection.toolUse,
      category_counts: eventInspection.categoryCounts,
      observability_failure_categories: eventInspection.observabilityFailureCategories,
      unclassified_descriptors: eventInspection.unclassifiedDescriptors,
    },
    process: {
      timed_out: processResult.timedOut,
      exit_code: processResult.exitCode,
      signal: processResult.signal,
      spawn_error: processResult.spawnError,
      stderr_sha256: sha256(processResult.stderr),
      stderr_bytes: processResult.stderr.length,
    },
    };
    await persistAttemptRecord(attemptPath, record);
    return deepFreeze(record);
  } finally {
    await releaseAttemptSlot(attemptSlot);
  }
}
