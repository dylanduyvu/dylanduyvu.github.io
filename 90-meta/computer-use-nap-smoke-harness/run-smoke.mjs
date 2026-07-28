#!/usr/bin/env node

import { createHash, randomUUID } from 'node:crypto';
import {
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readdir,
  rename,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

import { executeAttempt as executeAttemptDefault } from './lib/attempts.mjs';
import { loadAndValidateManifest as loadManifestDefault } from './lib/manifest.mjs';
import { renderPacket as renderPacketDefault } from './lib/packets.mjs';
import { buildSchedule as buildScheduleDefault } from './lib/schedule.mjs';
import {
  assertPairReadyForLabel as assertPairReadyForLabelDefault,
  comparePair as comparePairDefault,
  scoreAttempt as scoreAttemptDefault,
} from './lib/scoring.mjs';
import {
  freezeRun as freezeRunDefault,
  verifyRunLock as verifyRunLockDefault,
  withIsolatedCodexHome as withIsolatedCodexHomeDefault,
} from './lib/runlock.mjs';

const COMMANDS = new Set([
  'validate',
  'render',
  'freeze',
  'execute',
  'score',
  'report',
  'status',
]);
const CONDITIONS = Object.freeze([
  'state_only',
  'state_plus_all_prior',
]);
const ATTEMPT_STATUSES = Object.freeze([
  'valid_prediction',
  'invalid_tool_use',
  'invalid_schema',
  'infrastructure_failure',
]);
const ATTEMPT_STATUS_SET = new Set(ATTEMPT_STATUSES);
const MODULE_ROOT = path.dirname(fileURLToPath(import.meta.url));

function fail(message, cause) {
  throw new Error(
    `Smoke orchestration: ${message}`,
    cause === undefined ? undefined : { cause },
  );
}

function requireNonemptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${name} must be a nonempty string`);
  }
  return value;
}

function requireNormalizedAbsolutePath(value, name) {
  requireNonemptyString(value, name);
  if (!path.isAbsolute(value) || path.normalize(value) !== value) {
    fail(`${name} must be a normalized absolute path`);
  }
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalUtc(value, name) {
  requireNonemptyString(value, name);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)) {
    fail(`${name} must be a canonical UTC timestamp`);
  }
  const milliseconds = Date.parse(value);
  if (
    !Number.isFinite(milliseconds)
    || new Date(milliseconds).toISOString() !== value
  ) {
    fail(`${name} must be a real canonical UTC timestamp`);
  }
  return milliseconds;
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

async function requireRegularFile(inputPath, name) {
  let fileStat;
  try {
    fileStat = await lstat(inputPath);
  } catch (error) {
    fail(`${name} does not exist: ${inputPath}`, error);
  }
  if (fileStat.isSymbolicLink()) fail(`${name} must not be a symlink`);
  if (!fileStat.isFile()) fail(`${name} must be a regular file`);
  return fileStat;
}

async function fsyncDirectory(directory) {
  const handle = await open(directory, 'r');
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function atomicCreateBytes(destination, bytes) {
  requireNormalizedAbsolutePath(destination, 'atomic destination');
  const parent = path.dirname(destination);
  await mkdir(parent, { recursive: true, mode: 0o700 });
  const claimPath = `${destination}.lock`;
  const temporary = `${destination}.tmp-${process.pid}-${randomUUID()}`;
  let claim;
  let temporaryHandle;
  try {
    claim = await open(claimPath, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') {
      fail(`immutable destination is currently being created: ${destination}`);
    }
    throw error;
  }
  try {
    if (await pathExists(destination)) {
      fail(`immutable destination already exists: ${destination}`);
    }
    temporaryHandle = await open(temporary, 'wx', 0o600);
    await temporaryHandle.writeFile(bytes);
    await temporaryHandle.sync();
    await temporaryHandle.close();
    temporaryHandle = undefined;
    if (await pathExists(destination)) {
      fail(`immutable destination already exists: ${destination}`);
    }
    await rename(temporary, destination);
    await fsyncDirectory(parent);
  } finally {
    await temporaryHandle?.close().catch(() => {});
    await rm(temporary, { force: true }).catch(() => {});
    await claim.close().catch(() => {});
    await rm(claimPath, { force: true }).catch(() => {});
    await fsyncDirectory(parent).catch(() => {});
  }
}

async function ensureImmutableBytes(destination, expectedBytes) {
  if (await pathExists(destination)) {
    await requireRegularFile(destination, 'immutable artifact');
    const actualBytes = await readFile(destination);
    if (!actualBytes.equals(expectedBytes)) {
      fail(`immutable artifact differs from deterministic content: ${destination}`);
    }
    return false;
  }
  try {
    await atomicCreateBytes(destination, expectedBytes);
    return true;
  } catch (error) {
    if (
      error.message?.includes('already exists')
      || error.message?.includes('currently being created')
    ) {
      await requireRegularFile(destination, 'immutable artifact');
      const actualBytes = await readFile(destination);
      if (actualBytes.equals(expectedBytes)) return false;
    }
    throw error;
  }
}

export function serializeJson(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function validateRunId(runId) {
  requireNonemptyString(runId, 'run-id');
  if (
    runId.length > 128
    || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(runId)
    || runId.includes('..')
    || path.basename(runId) !== runId
  ) {
    fail('run-id must be a safe single path component');
  }
  return runId;
}

export function parseCliArguments(argv) {
  if (!Array.isArray(argv) || argv.length !== 3) {
    fail(
      'usage: run-smoke.mjs <validate|render|freeze|execute|score|report|status> --run-id <safe-id>',
    );
  }
  const [command, flag, runId] = argv;
  if (!COMMANDS.has(command)) fail(`unknown command: ${String(command)}`);
  if (flag !== '--run-id') fail('usage requires exactly one --run-id flag');
  return { command, runId: validateRunId(runId) };
}

export function getRunPaths(experimentRoot, runId) {
  requireNormalizedAbsolutePath(experimentRoot, 'experimentRoot');
  validateRunId(runId);
  const runsDirectory = path.join(experimentRoot, 'runs');
  const runDirectory = path.join(runsDirectory, runId);
  if (
    path.dirname(runDirectory) !== runsDirectory
    || path.basename(runDirectory) !== runId
  ) {
    fail('run path escaped the runs directory');
  }
  return Object.freeze({
    experimentRoot,
    runsDirectory,
    runDirectory,
    runPath: path.join(runDirectory, 'run.json'),
    schedulePath: path.join(runDirectory, 'schedule.json'),
    targetsDirectory: path.join(runDirectory, 'targets'),
  });
}

export function getSlotPaths(experimentRoot, runId, scheduleEntry) {
  const runPaths = getRunPaths(experimentRoot, runId);
  if (
    !scheduleEntry
    || !Number.isInteger(scheduleEntry.paired_target_ordinal)
    || scheduleEntry.paired_target_ordinal < 1
    || scheduleEntry.paired_target_ordinal > 19
    || !/^BLOG-CAND-\d{3}$/.test(scheduleEntry.event_id ?? '')
    || !CONDITIONS.includes(scheduleEntry.condition)
  ) {
    fail('cannot resolve paths for an invalid schedule entry');
  }
  const targetDirectory = path.join(
    runPaths.targetsDirectory,
    `${String(scheduleEntry.paired_target_ordinal).padStart(2, '0')}-${scheduleEntry.event_id}`,
  );
  const conditionDirectory = path.join(
    targetDirectory,
    scheduleEntry.condition,
  );
  return Object.freeze({
    ...runPaths,
    targetDirectory,
    conditionDirectory,
    packetPath: path.join(conditionDirectory, 'packet.json'),
    promptPath: path.join(conditionDirectory, 'prompt.txt'),
    eventsPath: path.join(conditionDirectory, 'events.jsonl'),
    finalPath: path.join(conditionDirectory, 'final.json'),
    attemptPath: path.join(conditionDirectory, 'attempt.json'),
    labelPath: path.join(targetDirectory, 'label.json'),
  });
}

function assertExactSchedule(schedule, manifest) {
  if (!Array.isArray(schedule) || schedule.length !== 38) {
    fail('schedule must contain exactly 38 condition slots');
  }
  const uniqueSlots = new Set();
  const targetIds = manifest.rows.slice(1).map((row) => row.event_id);
  for (const [index, entry] of schedule.entries()) {
    if (
      !entry
      || entry.call_sequence_index !== index + 1
      || !Number.isInteger(entry.paired_target_ordinal)
      || entry.paired_target_ordinal < 1
      || entry.paired_target_ordinal > 19
      || !CONDITIONS.includes(entry.condition)
      || !Array.isArray(entry.history_event_ids_ordered)
    ) {
      fail(`schedule slot ${index + 1} violates the frozen contract`);
    }
    const expectedRow = manifest.rows[entry.paired_target_ordinal];
    if (
      !expectedRow
      || entry.event_id !== expectedRow.event_id
      || entry.event_row_version !== expectedRow.row_version
    ) {
      fail(`schedule slot ${index + 1} target identity differs`);
    }
    const expectedHistory = entry.condition === 'state_only'
      ? []
      : manifest.rows
        .slice(0, entry.paired_target_ordinal)
        .map((row) => row.event_id);
    if (!isDeepStrictEqual(entry.history_event_ids_ordered, expectedHistory)) {
      fail(`schedule slot ${index + 1} history differs`);
    }
    const key = `${entry.event_id}:${entry.condition}`;
    if (uniqueSlots.has(key)) fail(`duplicate schedule slot: ${key}`);
    uniqueSlots.add(key);
  }
  if (
    uniqueSlots.size !== 38
    || !isDeepStrictEqual(
      [...new Set(schedule.map((entry) => entry.event_id))],
      targetIds,
    )
  ) {
    fail('schedule target topology differs from the frozen 19-pair contract');
  }
  return schedule;
}

function assertPacketIdentity(packet, scheduleEntry) {
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) {
    fail('packet must be an object');
  }
  if (
    packet.event_id !== scheduleEntry.event_id
    || packet.row_version !== scheduleEntry.event_row_version
    || packet.condition !== scheduleEntry.condition
    || !isDeepStrictEqual(
      packet.history_event_ids_ordered,
      scheduleEntry.history_event_ids_ordered,
    )
  ) {
    fail(
      `packet identity differs from schedule slot ${scheduleEntry.call_sequence_index}`,
    );
  }
  requireNonemptyString(packet.prompt_text, 'packet.prompt_text');
  if (!Array.isArray(packet.images) || packet.images.length < 2) {
    fail('packet must contain ordered images');
  }
  for (const [index, image] of packet.images.entries()) {
    if (
      !image
      || image.attachment_ordinal !== index + 1
      || !Number.isInteger(image.monitor)
      || ![1, 3].includes(image.monitor)
      || !/^[a-f0-9]{64}$/.test(image.sha256 ?? '')
    ) {
      fail(`packet image ${index + 1} violates the frozen identity`);
    }
    requireNormalizedAbsolutePath(image.path, `packet image ${index + 1} path`);
  }
  const expectedImageCount = scheduleEntry.condition === 'state_only'
    ? 2
    : 2 * (scheduleEntry.paired_target_ordinal + 1);
  if (packet.images.length !== expectedImageCount) {
    fail(`packet image count differs for schedule slot ${scheduleEntry.call_sequence_index}`);
  }
  return packet;
}

function resolveDependencies(overrides = {}) {
  const dependencies = {
    experimentRoot: MODULE_ROOT,
    loadAndValidateManifest: loadManifestDefault,
    buildSchedule: buildScheduleDefault,
    renderPacket: renderPacketDefault,
    executeAttempt: executeAttemptDefault,
    scoreAttempt: scoreAttemptDefault,
    comparePair: comparePairDefault,
    assertPairReadyForLabel: assertPairReadyForLabelDefault,
    withIsolatedCodexHome: withIsolatedCodexHomeDefault,
    freezeRun: freezeRunDefault,
    verifyRunLock: verifyRunLockDefault,
    reportRun: undefined,
    now: () => new Date(),
    writeOutput: (text) => process.stdout.write(text),
    ...overrides,
  };
  dependencies.experimentRoot = path.resolve(dependencies.experimentRoot);
  dependencies.manifestPath = dependencies.manifestPath
    ?? path.join(dependencies.experimentRoot, 'manifest.json');
  dependencies.instructionPath = dependencies.instructionPath
    ?? path.join(dependencies.experimentRoot, 'predictor-instruction.txt');
  dependencies.schemaPath = dependencies.schemaPath
    ?? path.join(dependencies.experimentRoot, 'prediction.schema.json');
  dependencies.runtimeCodexHome = dependencies.runtimeCodexHome
    ?? path.join(dependencies.experimentRoot, 'runtime-codex-home');
  return dependencies;
}

async function loadContext(runId, dependencies, { requireSchedule = false } = {}) {
  const manifest = await dependencies.loadAndValidateManifest(
    dependencies.manifestPath,
  );
  const schedule = assertExactSchedule(
    dependencies.buildSchedule(manifest),
    manifest,
  );
  const paths = getRunPaths(dependencies.experimentRoot, runId);
  if (requireSchedule) {
    await requireRegularFile(paths.schedulePath, 'schedule.json');
    const actual = await readFile(paths.schedulePath);
    const expected = serializeJson(schedule);
    if (!actual.equals(expected)) {
      fail('schedule.json differs from the deterministic 38-slot schedule');
    }
  }
  return { runId, dependencies, manifest, schedule, paths };
}

function inventoryMap(runLock) {
  if (!runLock || typeof runLock !== 'object' || Array.isArray(runLock)) {
    fail('verifyRunLock did not return a complete run lock');
  }
  if (!Array.isArray(runLock.inventory) || runLock.inventory.length === 0) {
    fail('verified run lock has no artifact inventory');
  }
  const entries = new Map();
  let previousPath = null;
  for (const entry of runLock.inventory) {
    if (!entry || Object.keys(entry).sort().join(',') !== 'path,sha256') {
      fail('run-lock inventory entries must contain exactly path and sha256');
    }
    requireNormalizedAbsolutePath(entry.path, 'run-lock inventory path');
    if (!/^[a-f0-9]{64}$/.test(entry.sha256 ?? '')) {
      fail(`run-lock inventory hash is invalid: ${entry.path}`);
    }
    if (previousPath !== null && entry.path <= previousPath) {
      fail('run-lock inventory must be sorted and duplicate-free');
    }
    previousPath = entry.path;
    entries.set(entry.path, entry.sha256);
  }
  return entries;
}

async function requireVerifiedRunLock(context) {
  const { dependencies, paths, runId, manifest } = context;
  await requireRegularFile(paths.runPath, 'run.json');
  if (typeof dependencies.verifyRunLock !== 'function') {
    fail('Task 8 verifyRunLock dependency is required');
  }
  let runLock;
  try {
    runLock = await dependencies.verifyRunLock({
      experimentRoot: dependencies.experimentRoot,
      runId,
      runPath: paths.runPath,
      runtimeCodexHome: dependencies.runtimeCodexHome,
    });
  } catch (error) {
    fail(`run-lock verification failed: ${error.message}`, error);
  }
  const lockedIdentities = runLock?.identities ?? runLock;
  if (
    runLock?.run_id !== runId
    || lockedIdentities?.dataset_snapshot_id !== manifest.dataset_snapshot_id
    || lockedIdentities?.manifest_id !== manifest.manifest_id
    || lockedIdentities?.protocol_id !== manifest.protocol_id
  ) {
    fail('verified run lock identity differs from the current run');
  }
  inventoryMap(runLock);
  return runLock;
}

function requireLockedHash(runLock, artifactPath) {
  const expected = inventoryMap(runLock).get(artifactPath);
  if (!expected) {
    fail(`artifact is absent from the complete run lock: ${artifactPath}`);
  }
  return expected;
}

async function readFrozenSlot(context, scheduleEntry, runLock = null) {
  const slotPaths = getSlotPaths(
    context.dependencies.experimentRoot,
    context.runId,
    scheduleEntry,
  );
  await requireRegularFile(slotPaths.packetPath, 'packet.json');
  await requireRegularFile(slotPaths.promptPath, 'prompt.txt');
  const packetBytes = await readFile(slotPaths.packetPath);
  const promptBytes = await readFile(slotPaths.promptPath);
  const packetSha256 = sha256(packetBytes);
  const promptSha256 = sha256(promptBytes);
  if (runLock) {
    if (packetSha256 !== requireLockedHash(runLock, slotPaths.packetPath)) {
      fail(`packet hash drift after run freeze: ${slotPaths.packetPath}`);
    }
    if (promptSha256 !== requireLockedHash(runLock, slotPaths.promptPath)) {
      fail(`prompt hash drift after run freeze: ${slotPaths.promptPath}`);
    }
  }
  let packet;
  try {
    packet = JSON.parse(packetBytes.toString('utf8'));
  } catch (error) {
    fail(`packet is not valid JSON: ${slotPaths.packetPath}`, error);
  }
  assertPacketIdentity(packet, scheduleEntry);
  if (!promptBytes.equals(Buffer.from(packet.prompt_text, 'utf8'))) {
    fail(`prompt.txt differs from packet.prompt_text: ${slotPaths.promptPath}`);
  }
  return {
    slotPaths,
    packet,
    packetBytes,
    promptBytes,
    packetSha256,
    promptSha256,
  };
}

async function validateCommand(context) {
  const images = context.manifest.rows.flatMap(
    (row) => row.before_state_inputs,
  );
  if (images.length !== 40) fail('manifest must contain exactly 40 images');
  const result = {
    manifest_rows: context.manifest.rows.length,
    target_pairs: context.manifest.rows.length - 1,
    condition_slots: context.schedule.length,
    images: images.length,
    missing_images: 0,
    hash_mismatches: 0,
  };
  context.dependencies.writeOutput(
    `${Object.entries(result).map(([key, value]) => `${key}=${value}`).join('\n')}\n`,
  );
  return result;
}

async function renderCommand(context) {
  await mkdir(context.paths.runDirectory, { recursive: true, mode: 0o700 });
  await mkdir(context.paths.targetsDirectory, { recursive: true, mode: 0o700 });
  await ensureImmutableBytes(
    context.paths.schedulePath,
    serializeJson(context.schedule),
  );
  let created = 0;
  let verified = 0;
  for (const scheduleEntry of context.schedule) {
    const packet = context.dependencies.renderPacket(context.manifest, {
      eventId: scheduleEntry.event_id,
      condition: scheduleEntry.condition,
    });
    assertPacketIdentity(packet, scheduleEntry);
    const slotPaths = getSlotPaths(
      context.dependencies.experimentRoot,
      context.runId,
      scheduleEntry,
    );
    await mkdir(slotPaths.conditionDirectory, {
      recursive: true,
      mode: 0o700,
    });
    const packetCreated = await ensureImmutableBytes(
      slotPaths.packetPath,
      serializeJson(packet),
    );
    const promptCreated = await ensureImmutableBytes(
      slotPaths.promptPath,
      Buffer.from(packet.prompt_text, 'utf8'),
    );
    if (packetCreated || promptCreated) created += 1;
    else verified += 1;
  }
  return { condition_slots: context.schedule.length, created, verified };
}

async function verifyAllRenderedSlots(context) {
  for (const scheduleEntry of context.schedule) {
    await readFrozenSlot(context, scheduleEntry);
  }
}

async function freezeCommand(context) {
  if (await pathExists(context.paths.runPath)) {
    fail('immutable run.json already exists');
  }
  if (typeof context.dependencies.freezeRun !== 'function') {
    fail('Task 8 freezeRun dependency is required; refusing a partial run lock');
  }
  await verifyAllRenderedSlots(context);
  await mkdir(context.dependencies.runtimeCodexHome, {
    recursive: true,
    mode: 0o700,
  });
  const debugCleanDirectory = await mkdtemp(
    path.join(tmpdir(), 'nap-debug-'),
  );
  try {
    await context.dependencies.freezeRun({
      experimentRoot: context.dependencies.experimentRoot,
      runId: context.runId,
      runPath: context.paths.runPath,
      runDirectory: context.paths.runDirectory,
      manifest: context.manifest,
      schedule: context.schedule,
      runtimeCodexHome: context.dependencies.runtimeCodexHome,
      debugOptions: {
        cleanDirectory: debugCleanDirectory,
        runtimeCodexHome: context.dependencies.runtimeCodexHome,
      },
    });
  } finally {
    await rm(debugCleanDirectory, { recursive: true, force: true });
  }
  return requireVerifiedRunLock(context);
}

async function writeStagedFile(destination, bytes) {
  const handle = await open(destination, 'wx', 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function createAttemptStaging(context, frozenSlot) {
  const stagingRoot = await mkdtemp(path.join(tmpdir(), 'nap-call-'));
  const cleanCallDirectory = path.join(stagingRoot, 'cwd');
  const imageDirectory = path.join(stagingRoot, 'images');
  await mkdir(cleanCallDirectory, { mode: 0o700 });
  await mkdir(imageDirectory, { mode: 0o700 });
  try {
    const schemaPath = path.join(
      cleanCallDirectory,
      'prediction.schema.json',
    );
    await requireRegularFile(
      context.dependencies.schemaPath,
      'prediction schema',
    );
    await writeStagedFile(
      schemaPath,
      await readFile(context.dependencies.schemaPath),
    );
    const modelImagePathsOrdered = [];
    for (const [index, image] of frozenSlot.packet.images.entries()) {
      await requireRegularFile(image.path, `source image ${index + 1}`);
      const bytes = await readFile(image.path);
      if (sha256(bytes) !== image.sha256) {
        fail(`source image ${index + 1} hash differs from frozen packet`);
      }
      const stagedPath = path.join(
        imageDirectory,
        `image-${String(index + 1).padStart(3, '0')}.png`,
      );
      await writeStagedFile(stagedPath, bytes);
      if (sha256(await readFile(stagedPath)) !== image.sha256) {
        fail(`neutral staged image ${index + 1} failed byte verification`);
      }
      modelImagePathsOrdered.push(stagedPath);
    }
    return {
      stagingRoot,
      cleanCallDirectory,
      schemaPath,
      stagingFinalPath: path.join(cleanCallDirectory, 'final.json'),
      modelImagePathsOrdered,
    };
  } catch (error) {
    await rm(stagingRoot, { recursive: true, force: true });
    throw error;
  }
}

function timestampsForAttempt(attempt) {
  const requested = canonicalUtc(
    attempt.requested_at_utc,
    'attempt.requested_at_utc',
  );
  const completed = canonicalUtc(
    attempt.completed_at_utc,
    'attempt.completed_at_utc',
  );
  const saved = canonicalUtc(
    attempt.attempt_saved_at_utc,
    'attempt.attempt_saved_at_utc',
  );
  if (requested > completed || completed > saved) {
    fail('attempt timestamp ordering is invalid');
  }
  if (attempt.attempt_status === 'valid_prediction') {
    const predictionSaved = canonicalUtc(
      attempt.prediction_saved_at_utc,
      'attempt.prediction_saved_at_utc',
    );
    if (predictionSaved < requested || predictionSaved > saved) {
      fail('attempt prediction timestamp ordering is invalid');
    }
  } else if (attempt.prediction_saved_at_utc !== null) {
    fail('non-valid attempt prediction timestamp must be null');
  }
  return { requested, completed, saved };
}

export function verifyAttemptIdentity(attempt, expected) {
  if (!attempt || typeof attempt !== 'object' || Array.isArray(attempt)) {
    fail('attempt identity must be an object');
  }
  const schedule = expected.schedule;
  const exactValues = [
    ['run_id', expected.runId],
    ['dataset_snapshot_id', expected.datasetSnapshotId],
    ['manifest_id', expected.manifestId],
    ['event_id', schedule.event_id],
    ['event_row_version', schedule.event_row_version],
    ['paired_target_ordinal', schedule.paired_target_ordinal],
    ['call_sequence_index', schedule.call_sequence_index],
    ['condition', schedule.condition],
    ['rendered_packet_path', expected.packetPath],
    ['rendered_packet_sha256', expected.packetSha256],
    ['prompt_sha256', expected.promptSha256],
    ['raw_response_path', expected.finalPath],
  ];
  for (const [name, value] of exactValues) {
    if (attempt[name] !== value) fail(`attempt identity mismatch: ${name}`);
  }
  if (!isDeepStrictEqual(
    attempt.history_event_ids_ordered,
    schedule.history_event_ids_ordered,
  )) {
    fail('attempt identity mismatch: history_event_ids_ordered');
  }
  if (
    !attempt.event_log
    || attempt.event_log.path !== expected.eventsPath
  ) {
    fail('attempt identity mismatch: event_log.path');
  }
  if (!ATTEMPT_STATUS_SET.has(attempt.attempt_status)) {
    fail('attempt status is not frozen');
  }
  timestampsForAttempt(attempt);
  if (!Array.isArray(attempt.ranked_predictions)) {
    fail('attempt ranked_predictions must be an array');
  }
  if (attempt.attempt_status === 'valid_prediction') {
    if (
      attempt.ranked_predictions.length < 1
      || attempt.ranked_predictions.length > 3
    ) {
      fail('valid attempt must contain one to three predictions');
    }
  } else if (attempt.ranked_predictions.length !== 0) {
    fail('non-valid attempt predictions must be empty');
  }
  if (
    attempt.label_revealed_at_utc !== null
    || attempt.scored_at_utc !== null
    || attempt.scorer !== null
  ) {
    fail('immutable attempt must not be mutated after label reveal');
  }
  return attempt.attempt_status;
}

function attemptIdentityContext(context, scheduleEntry, frozenSlot) {
  return {
    runId: context.runId,
    datasetSnapshotId: context.manifest.dataset_snapshot_id,
    manifestId: context.manifest.manifest_id,
    schedule: scheduleEntry,
    attemptPath: frozenSlot.slotPaths.attemptPath,
    eventsPath: frozenSlot.slotPaths.eventsPath,
    finalPath: frozenSlot.slotPaths.finalPath,
    packetPath: frozenSlot.slotPaths.packetPath,
    packetSha256: frozenSlot.packetSha256,
    promptSha256: frozenSlot.promptSha256,
  };
}

async function readAndVerifyAttempt(context, scheduleEntry, frozenSlot) {
  await requireRegularFile(frozenSlot.slotPaths.attemptPath, 'attempt.json');
  const bytes = await readFile(frozenSlot.slotPaths.attemptPath);
  let attempt;
  try {
    attempt = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    fail(`attempt.json is not valid JSON: ${frozenSlot.slotPaths.attemptPath}`, error);
  }
  verifyAttemptIdentity(
    attempt,
    attemptIdentityContext(context, scheduleEntry, frozenSlot),
  );
  return { attempt, bytes, sha256: sha256(bytes) };
}

export function buildAttemptInvocation({
  context,
  scheduleEntry,
  frozenSlot,
  staging,
  instruction,
}) {
  return {
    runId: context.runId,
    datasetSnapshotId: context.manifest.dataset_snapshot_id,
    manifestId: context.manifest.manifest_id,
    schedule: scheduleEntry,
    packet: frozenSlot.packet,
    renderedPacketPath: frozenSlot.slotPaths.packetPath,
    renderedPacketSha256: frozenSlot.packetSha256,
    instruction,
    schemaPath: staging.schemaPath,
    cleanCallDirectory: staging.cleanCallDirectory,
    stagingFinalPath: staging.stagingFinalPath,
    modelImagePathsOrdered: staging.modelImagePathsOrdered,
    codexHomePath: context.dependencies.runtimeCodexHome,
    eventsPath: frozenSlot.slotPaths.eventsPath,
    finalPath: frozenSlot.slotPaths.finalPath,
    attemptPath: frozenSlot.slotPaths.attemptPath,
  };
}

async function executeCommand(context) {
  const runLock = await requireVerifiedRunLock(context);
  await requireRegularFile(context.dependencies.instructionPath, 'instruction');
  const instruction = await readFile(
    context.dependencies.instructionPath,
    'utf8',
  );
  if (typeof context.dependencies.executeAttempt !== 'function') {
    fail('executeAttempt dependency is required');
  }
  if (typeof context.dependencies.withIsolatedCodexHome !== 'function') {
    fail('Task 8 isolated Codex-home dependency is required');
  }
  let newlyCompleted = 0;
  let skipped = 0;
  let paused = false;
  for (const scheduleEntry of context.schedule) {
    const frozenSlot = await readFrozenSlot(
      context,
      scheduleEntry,
      runLock,
    );
    if (await pathExists(frozenSlot.slotPaths.attemptPath)) {
      await readAndVerifyAttempt(context, scheduleEntry, frozenSlot);
      skipped += 1;
      continue;
    }
    const staging = await createAttemptStaging(context, frozenSlot);
    try {
      const invocation = buildAttemptInvocation({
        context,
        scheduleEntry,
        frozenSlot,
        staging,
        instruction,
      });
      await context.dependencies.withIsolatedCodexHome({
        runtimeCodexHome: context.dependencies.runtimeCodexHome,
        operation: () => context.dependencies.executeAttempt(invocation),
      });
    } finally {
      await rm(staging.stagingRoot, { recursive: true, force: true });
    }
    const persisted = await readAndVerifyAttempt(
      context,
      scheduleEntry,
      frozenSlot,
    );
    newlyCompleted += 1;
    if (persisted.attempt.attempt_status === 'infrastructure_failure') {
      paused = true;
      break;
    }
  }
  const completed = skipped + newlyCompleted;
  return {
    newly_completed: newlyCompleted,
    skipped,
    completed,
    remaining: context.schedule.length - completed,
    paused_on_infrastructure_failure: paused,
  };
}

function scoringAttemptView(attempt) {
  return {
    run_id: attempt.run_id,
    dataset_snapshot_id: attempt.dataset_snapshot_id,
    manifest_id: attempt.manifest_id,
    event_id: attempt.event_id,
    event_row_version: attempt.event_row_version,
    paired_target_ordinal: attempt.paired_target_ordinal,
    condition: attempt.condition,
    attempt_status: attempt.attempt_status,
    ranked_predictions: attempt.ranked_predictions.map((prediction) => ({
      rank: prediction.rank,
      app: prediction.app,
      object: prediction.object,
      subtarget: prediction.subtarget,
      canonical_label: prediction.canonical_label,
      reason: prediction.reason,
    })),
    prediction_saved_at_utc: attempt.prediction_saved_at_utc,
    attempt_saved_at_utc: attempt.attempt_saved_at_utc,
  };
}

function isoNow(now) {
  const value = now();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) fail('clock returned an invalid date');
  return date.toISOString();
}

function buildLabelRecord({
  context,
  row,
  pairOrdinal,
  attemptsByCondition,
  attemptFilesByCondition,
  revealedAt,
}) {
  const scoringAttempts = Object.fromEntries(
    CONDITIONS.map((condition) => [
      condition,
      scoringAttemptView(attemptsByCondition[condition]),
    ]),
  );
  context.dependencies.assertPairReadyForLabel(
    CONDITIONS.map((condition) => scoringAttempts[condition]),
  );
  const scores = Object.fromEntries(
    CONDITIONS.map((condition) => [
      condition,
      context.dependencies.scoreAttempt(
        scoringAttempts[condition],
        {
          event_id: row.event_id,
          event_row_version: row.row_version,
          target: row.target,
          accepted_aliases: row.accepted_aliases,
        },
      ),
    ]),
  );
  const pairComparison = context.dependencies.comparePair({
    state_only: scores.state_only,
    state_plus_all_prior: scores.state_plus_all_prior,
  });
  const latestAttemptSaved = Math.max(
    ...CONDITIONS.map((condition) => canonicalUtc(
      attemptsByCondition[condition].attempt_saved_at_utc,
      `${condition} attempt_saved_at_utc`,
    )),
  );
  if (canonicalUtc(revealedAt, 'label_revealed_at_utc') < latestAttemptSaved) {
    fail('label reveal timestamp precedes a paired attempt save');
  }
  return {
    record_version: 1,
    run_id: context.runId,
    dataset_snapshot_id: context.manifest.dataset_snapshot_id,
    manifest_id: context.manifest.manifest_id,
    event_id: row.event_id,
    event_row_version: row.row_version,
    paired_target_ordinal: pairOrdinal,
    canonical_label: row.canonical_label,
    target: structuredClone(row.target),
    accepted_aliases: structuredClone(row.accepted_aliases),
    label_revealed_at_utc: revealedAt,
    attempts: Object.fromEntries(
      CONDITIONS.map((condition) => [
        condition,
        {
          path: attemptFilesByCondition[condition].path,
          sha256: attemptFilesByCondition[condition].sha256,
        },
      ]),
    ),
    scores,
    pair_comparison: pairComparison,
    scored_at_utc: revealedAt,
    scorer: 'NAP-ACTION-TARGET-EXACT-V1',
  };
}

async function scoreCommand(context) {
  const runLock = await requireVerifiedRunLock(context);
  let created = 0;
  let verified = 0;
  let pending = 0;
  for (let pairOrdinal = 1; pairOrdinal <= 19; pairOrdinal += 1) {
    const pairEntries = context.schedule.filter(
      (entry) => entry.paired_target_ordinal === pairOrdinal,
    );
    const loadedByCondition = {};
    let complete = true;
    for (const entry of pairEntries) {
      const frozenSlot = await readFrozenSlot(context, entry, runLock);
      if (!await pathExists(frozenSlot.slotPaths.attemptPath)) {
        complete = false;
        continue;
      }
      loadedByCondition[entry.condition] = {
        entry,
        frozenSlot,
        ...(await readAndVerifyAttempt(context, entry, frozenSlot)),
      };
    }
    const labelPath = getSlotPaths(
      context.dependencies.experimentRoot,
      context.runId,
      pairEntries[0],
    ).labelPath;
    if (!complete || CONDITIONS.some((condition) => !loadedByCondition[condition])) {
      if (await pathExists(labelPath)) {
        fail(`label exists before both attempts: ${labelPath}`);
      }
      pending += 1;
      continue;
    }
    const attemptsByCondition = Object.fromEntries(
      CONDITIONS.map((condition) => [
        condition,
        loadedByCondition[condition].attempt,
      ]),
    );
    const attemptFilesByCondition = Object.fromEntries(
      CONDITIONS.map((condition) => [
        condition,
        {
          path: loadedByCondition[condition].frozenSlot.slotPaths.attemptPath,
          sha256: loadedByCondition[condition].sha256,
        },
      ]),
    );
    const row = context.manifest.rows[pairOrdinal];
    if (await pathExists(labelPath)) {
      await requireRegularFile(labelPath, 'label.json');
      let existing;
      try {
        existing = JSON.parse(await readFile(labelPath, 'utf8'));
      } catch (error) {
        fail(`label.json is not valid JSON: ${labelPath}`, error);
      }
      const expected = buildLabelRecord({
        context,
        row,
        pairOrdinal,
        attemptsByCondition,
        attemptFilesByCondition,
        revealedAt: existing.label_revealed_at_utc,
      });
      if (!isDeepStrictEqual(existing, expected)) {
        fail(`immutable label differs from frozen scoring: ${labelPath}`);
      }
      verified += 1;
      continue;
    }
    const label = buildLabelRecord({
      context,
      row,
      pairOrdinal,
      attemptsByCondition,
      attemptFilesByCondition,
      revealedAt: isoNow(context.dependencies.now),
    });
    await atomicCreateBytes(labelPath, serializeJson(label));
    created += 1;
  }
  return { created, verified, pending };
}

async function collectFiles(root) {
  if (!await pathExists(root)) return [];
  const files = [];
  async function visit(directory) {
    const directoryStat = await lstat(directory);
    if (directoryStat.isSymbolicLink()) {
      files.push(directory);
      return;
    }
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(entryPath);
      else files.push(entryPath);
    }
  }
  await visit(root);
  return files.sort();
}

async function statusCommand(context) {
  const statuses = Object.fromEntries(
    ATTEMPT_STATUSES.map((status) => [status, 0]),
  );
  const expectedArtifacts = new Set();
  const expectedAttemptPaths = new Set();
  const knownAttempts = [];
  for (const entry of context.schedule) {
    const frozenSlot = await readFrozenSlot(context, entry);
    for (const filePath of [
      frozenSlot.slotPaths.packetPath,
      frozenSlot.slotPaths.promptPath,
      frozenSlot.slotPaths.eventsPath,
      frozenSlot.slotPaths.finalPath,
      frozenSlot.slotPaths.attemptPath,
      frozenSlot.slotPaths.labelPath,
    ]) {
      expectedArtifacts.add(filePath);
    }
    expectedAttemptPaths.add(frozenSlot.slotPaths.attemptPath);
    if (!await pathExists(frozenSlot.slotPaths.attemptPath)) continue;
    const verified = await readAndVerifyAttempt(
      context,
      entry,
      frozenSlot,
    );
    statuses[verified.attempt.attempt_status] += 1;
    knownAttempts.push({
      path: frozenSlot.slotPaths.attemptPath,
      attempt: verified.attempt,
    });
  }
  const allArtifacts = await collectFiles(context.paths.targetsDirectory);
  const unexpectedArtifacts = allArtifacts.filter(
    (filePath) => !expectedArtifacts.has(filePath),
  );
  const attemptArtifacts = allArtifacts.filter(
    (filePath) => path.basename(filePath) === 'attempt.json',
  );
  const identityGroups = new Map();
  for (const attemptPath of attemptArtifacts) {
    let attempt;
    try {
      attempt = JSON.parse(await readFile(attemptPath, 'utf8'));
    } catch {
      continue;
    }
    if (
      typeof attempt.event_id !== 'string'
      || typeof attempt.condition !== 'string'
    ) {
      continue;
    }
    const key = `${attempt.event_id}:${attempt.condition}`;
    const paths = identityGroups.get(key) ?? [];
    paths.push(attemptPath);
    identityGroups.set(key, paths);
  }
  const duplicateArtifacts = [];
  for (const paths of identityGroups.values()) {
    if (paths.length < 2) continue;
    const canonicalIndex = paths.findIndex((filePath) => (
      expectedAttemptPaths.has(filePath)
    ));
    const keepIndex = canonicalIndex >= 0 ? canonicalIndex : 0;
    paths.forEach((filePath, index) => {
      if (index !== keepIndex) duplicateArtifacts.push(filePath);
    });
  }
  duplicateArtifacts.sort();
  const completed = knownAttempts.length;
  const result = {
    completed,
    statuses,
    invalid_total: statuses.invalid_tool_use + statuses.invalid_schema,
    remaining: context.schedule.length - completed,
    unexpected_artifacts: unexpectedArtifacts,
    duplicate_artifacts: duplicateArtifacts,
    duplicate_attempts: duplicateArtifacts.length,
  };
  context.dependencies.writeOutput(
    [
      `completed=${result.completed}`,
      ...ATTEMPT_STATUSES.map((status) => `${status}=${statuses[status]}`),
      `invalid_total=${result.invalid_total}`,
      `remaining=${result.remaining}`,
      `unexpected_artifacts=${unexpectedArtifacts.length}`,
      `duplicate_attempts=${result.duplicate_attempts}`,
      '',
    ].join('\n'),
  );
  return result;
}

async function reportCommand(context) {
  const runLock = await requireVerifiedRunLock(context);
  if (typeof context.dependencies.reportRun !== 'function') {
    fail('Task 10 reportRun dependency is required');
  }
  return context.dependencies.reportRun({
    experimentRoot: context.dependencies.experimentRoot,
    runId: context.runId,
    runPath: context.paths.runPath,
    runLock,
    manifest: context.manifest,
    schedule: context.schedule,
  });
}

export async function main(argv, overrides = {}) {
  const { command, runId } = parseCliArguments(argv);
  const dependencies = resolveDependencies(overrides);
  const context = await loadContext(runId, dependencies, {
    requireSchedule: !['validate', 'render'].includes(command),
  });
  switch (command) {
    case 'validate':
      return validateCommand(context);
    case 'render':
      return renderCommand(context);
    case 'freeze':
      return freezeCommand(context);
    case 'execute':
      return executeCommand(context);
    case 'score':
      return scoreCommand(context);
    case 'report':
      return reportCommand(context);
    case 'status':
      return statusCommand(context);
    default:
      fail(`unknown command: ${command}`);
  }
}

const isDirectInvocation = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectInvocation) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
