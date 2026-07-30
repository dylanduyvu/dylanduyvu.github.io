import { constants } from 'node:fs';
import {
  lstat,
  mkdir,
  open,
  readdir,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { METHOD } from '../config.mjs';
import {
  claimAttemptJournal,
  finalizeAttemptJournal,
  recoverAttemptJournals,
  verifyAttemptRecord,
} from './attempt-store.mjs';
import {
  createFreshAttemptRuntime,
  executeAttempt,
} from './codex-adapter.mjs';
import {
  canonicalJson,
  sha256,
  writeImmutable,
} from './immutable.mjs';
import { verifyPrepared } from './prepare.mjs';
import { buildSchedule } from './schedule.mjs';
import { decideSlotState } from './slot-state.mjs';

export const RUNNER_COMMANDS = Object.freeze([
  'run',
  'status',
  'verify-attempts',
]);

const SHA256 = /^[0-9a-f]{64}$/;
const SLOT_ID = /^NAP-V5-SLOT-(0[1-9]|1[0-9]|2[0-2])$/;
const ATTEMPT_NAME = /^attempt-(00[1-3])$/;
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const ATTEMPT_METADATA_KEYS = [
  'version',
  'slot_ordinal',
  'attempt_ordinal',
  'attempt_record_sha256',
  'classification',
  'code',
  'latency_ms',
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
const PACKET_KEYS = [
  'version',
  'condition',
  'prompt_text',
  'context_sha256',
  'images',
];
const PACKET_IMAGE_KEYS = ['attachment_ordinal', 'sha256'];
const SAFE_OUTPUT_KEYS = [
  'slot_ordinal',
  'attempt_ordinal',
  'terminal_state',
  'classification',
  'code',
  'latency_ms',
  'completed_slots',
  'scheduled_slots',
];
const SEALED_ALLOWED_ROOTS = new Set([
  'inflight',
  'environment-stops',
  'reconciled-sources',
  'slot-state',
]);

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
    throw new Error(`${label} must contain the exact artifact keys`);
  }
}

function sameFileSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs
    && left.nlink === right.nlink
    && left.mode === right.mode;
}

async function readRegular(filename, label, { mode = 0o600 } = {}) {
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isFile() || pathStat.nlink !== 1n) {
    throw new Error(`${label} must be one regular non-symlink file`);
  }
  if (mode !== null && (pathStat.mode & 0o777n) !== BigInt(mode)) {
    throw new Error(`${label} must have mode ${mode.toString(8)}`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!sameFileSnapshot(pathStat, before)) {
      throw new Error(`${label} changed before read`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(filename, { bigint: true });
    if (!sameFileSnapshot(before, after)
      || pathAfter.isSymbolicLink()
      || !sameFileSnapshot(after, pathAfter)) {
      throw new Error(`${label} changed while read`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

async function optionalLstat(filename) {
  try {
    return await lstat(filename, { bigint: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function readCanonicalJson(filename, label) {
  const bytes = await readRegular(filename, label);
  let value;
  try {
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new Error(`${label} must be canonical UTF-8 JSON`);
  }
  if (!Buffer.from(canonicalJson(value)).equals(bytes)) {
    throw new Error(`${label} differs from canonical JSON bytes`);
  }
  return { bytes, value };
}

async function assertDirectory(directory, label) {
  const info = await lstat(directory, { bigint: true });
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throw new Error(`${label} must be a non-symlink directory`);
  }
  return info;
}

async function exactDirectoryEntries(directory, expected, label) {
  await assertDirectory(directory, label);
  const names = (await readdir(directory)).sort();
  const sortedExpected = [...expected].sort();
  if (names.length !== sortedExpected.length
    || names.some((name, index) => name !== sortedExpected[index])) {
    throw new Error(`${label} has an extra, missing, or unexpected inventory`);
  }
  return names;
}

function validateSchedule(schedule) {
  if (!isPlainObject(schedule)
    || !Array.isArray(schedule.slots)
    || schedule.slots.length !== METHOD.scheduledSlotCount) {
    throw new Error(
      `Frozen schedule does not contain exactly ${METHOD.scheduledSlotCount} slots`,
    );
  }
  const targets = [];
  for (let index = 0; index < METHOD.targetCount; index += 1) {
    const first = schedule.slots[index * 2];
    const second = schedule.slots[(index * 2) + 1];
    if (!isPlainObject(first)
      || !isPlainObject(second)
      || first.target_ordinal !== second.target_ordinal
      || first.target_id !== second.target_id
      || first.target_chronology_index !== second.target_chronology_index) {
      throw new Error('Frozen schedule pair identity differs');
    }
    targets.push({
      target_ordinal: first.target_ordinal,
      target_id: first.target_id,
      chronology_index: first.target_chronology_index,
    });
  }
  const rebuilt = buildSchedule({ version: 1, targets });
  if (canonicalJson(rebuilt) !== canonicalJson(schedule)) {
    throw new Error('Frozen schedule differs from deterministic reconstruction');
  }
  return rebuilt;
}

function inventoryMap(prepared) {
  if (!isPlainObject(prepared)
    || !Array.isArray(prepared.files)
    || prepared.packet_count !== METHOD.scheduledSlotCount) {
    throw new Error('Prepared inventory is incomplete');
  }
  const map = new Map();
  for (const entry of prepared.files) {
    assertExactKeys(
      entry,
      ['path', 'byte_length', 'sha256', 'trust_zone'],
      'Prepared inventory entry',
    );
    if (typeof entry.path !== 'string'
      || entry.path.length === 0
      || path.posix.isAbsolute(entry.path)
      || path.posix.normalize(entry.path) !== entry.path
      || entry.path.split('/').includes('..')
      || !Number.isSafeInteger(entry.byte_length)
      || entry.byte_length < 0
      || !SHA256.test(entry.sha256)
      || !['evaluator_only', 'predictor_safe'].includes(entry.trust_zone)
      || (entry.path.startsWith('evaluator/')
        ? entry.trust_zone !== 'evaluator_only'
        : entry.trust_zone !== 'predictor_safe')
      || map.has(entry.path)) {
      throw new Error('Prepared inventory entry is unsafe or duplicated');
    }
    map.set(entry.path, entry);
  }
  return map;
}

async function readInventoriedFile(root, relativePath, inventory, label) {
  const expected = inventory.get(relativePath);
  if (expected === undefined) throw new Error(`${label} is absent from prepared inventory`);
  const bytes = await readRegular(path.join(root, ...relativePath.split('/')), label);
  if (bytes.length !== expected.byte_length || sha256(bytes) !== expected.sha256) {
    throw new Error(`${label} differs from prepared inventory`);
  }
  return bytes;
}

function parsePacket(bytes, condition) {
  let source;
  try {
    source = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new Error('Predictor packet is not frozen UTF-8 JSON');
  }
  assertExactKeys(source, PACKET_KEYS, 'Predictor packet');
  if (source.version !== 1
    || source.condition !== condition
    || typeof source.prompt_text !== 'string'
    || !source.prompt_text.endsWith('\n')
    || !SHA256.test(source.context_sha256)
    || !Array.isArray(source.images)) {
    throw new Error('Predictor packet metadata is invalid');
  }
  const expectedImageCount = condition === 'state_only' ? 1 : 11;
  if (source.images.length !== expectedImageCount) {
    throw new Error('Predictor packet attachment count differs from its condition');
  }
  const images = source.images.map((image, index) => {
    assertExactKeys(image, PACKET_IMAGE_KEYS, `Predictor packet image ${index + 1}`);
    if (image.attachment_ordinal !== index + 1 || !SHA256.test(image.sha256)) {
      throw new Error('Predictor packet attachment order or hash is invalid');
    }
    return {
      attachment_ordinal: image.attachment_ordinal,
      sha256: image.sha256,
    };
  });
  const normalized = {
    version: source.version,
    condition: source.condition,
    prompt_text: source.prompt_text,
    context_sha256: source.context_sha256,
    images,
  };
  if (!Buffer.from(`${JSON.stringify(normalized, null, 2)}\n`).equals(bytes)) {
    throw new Error('Predictor packet bytes differ from frozen serialization');
  }
  return normalized;
}

async function loadPacket(root, slot, inventory) {
  const packetRoot = `packets/${slot.slot_id}`;
  const packetRelative = `${packetRoot}/packet.json`;
  const packetBytes = await readInventoriedFile(
    root,
    packetRelative,
    inventory,
    'Predictor packet',
  );
  const packet = parsePacket(packetBytes, slot.condition);
  const expectedNames = [
    'packet.json',
    'prompt.txt',
    ...packet.images.map((_, index) => (
      `image-${String(index + 1).padStart(3, '0')}.png`
    )),
  ];
  await exactDirectoryEntries(
    path.join(root, 'packets', slot.slot_id),
    expectedNames,
    'Predictor packet directory',
  );
  const promptBytes = await readInventoriedFile(
    root,
    `${packetRoot}/prompt.txt`,
    inventory,
    'Predictor prompt',
  );
  if (!promptBytes.equals(Buffer.from(packet.prompt_text))) {
    throw new Error('Predictor prompt differs from authenticated packet');
  }
  const imageBytes = [];
  for (const [index, image] of packet.images.entries()) {
    const relativePath = `${packetRoot}/image-${String(index + 1).padStart(3, '0')}.png`;
    const bytes = await readInventoriedFile(
      root,
      relativePath,
      inventory,
      `Predictor attachment ${index + 1}`,
    );
    if (sha256(bytes) !== image.sha256) {
      throw new Error(`Predictor attachment ${index + 1} differs from packet hash`);
    }
    imageBytes.push(bytes);
  }
  return Object.freeze({
    slot,
    promptText: packet.prompt_text,
    imageBytes: Object.freeze(imageBytes),
    request: Object.freeze({
      version: 1,
      slot_ordinal: slot.slot_ordinal,
      packet_sha256: sha256(packetBytes),
      prompt_sha256: sha256(promptBytes),
      image_sha256s: Object.freeze(imageBytes.map(sha256)),
    }),
  });
}

async function loadPreparedInputs(root) {
  const scheduleArtifact = await readCanonicalJson(
    path.join(root, 'evaluator/schedule.json'),
    'Frozen schedule',
  );
  const schedule = validateSchedule(scheduleArtifact.value);
  const preparedArtifact = await readCanonicalJson(
    path.join(root, 'evaluator/prepared-inventory.json'),
    'Prepared inventory',
  );
  const inventory = inventoryMap(preparedArtifact.value);
  const expectedSchedule = inventory.get('evaluator/schedule.json');
  if (expectedSchedule === undefined
    || expectedSchedule.byte_length !== scheduleArtifact.bytes.length
    || expectedSchedule.sha256 !== sha256(scheduleArtifact.bytes)) {
    throw new Error('Frozen schedule differs from prepared inventory');
  }
  const packets = new Map();
  for (const slot of schedule.slots) {
    packets.set(slot.slot_ordinal, await loadPacket(root, slot, inventory));
  }
  return { schedule, packets };
}

function validateAttemptMetadata(source, expected) {
  assertExactKeys(source, ATTEMPT_METADATA_KEYS, 'Attempt metadata');
  if (source.version !== 1
    || source.slot_ordinal !== expected.slotOrdinal
    || source.attempt_ordinal !== expected.attemptOrdinal
    || source.attempt_record_sha256 !== expected.recordSha256
    || source.classification !== expected.classification
    || source.code !== expected.code
    || (source.latency_ms !== null
      && (!Number.isSafeInteger(source.latency_ms) || source.latency_ms < 0))) {
    throw new Error('Attempt metadata differs from the verified attempt record');
  }
  return source.latency_ms;
}

async function optionalCanonicalJson(filename, label) {
  const info = await optionalLstat(filename);
  if (info === null) return null;
  return readCanonicalJson(filename, label);
}

async function verifyAttemptRequest(attemptPath, expectedRequest) {
  const artifact = await readCanonicalJson(
    path.join(attemptPath, 'request.json'),
    'Sealed attempt request',
  );
  if (canonicalJson(artifact.value) !== canonicalJson(expectedRequest)) {
    throw new Error('Sealed attempt request differs from its frozen packet');
  }
}

async function readSlotState({
  sealedRoot,
  slot,
  packet,
  verifyRecord,
}) {
  const attemptRoot = path.join(sealedRoot, slot.slot_id);
  const attemptRootStat = await optionalLstat(attemptRoot);
  let attemptNames = [];
  if (attemptRootStat !== null) {
    if (attemptRootStat.isSymbolicLink() || !attemptRootStat.isDirectory()) {
      throw new Error('Sealed attempt slot must be a non-symlink directory');
    }
    attemptNames = (await readdir(attemptRoot)).sort();
    for (const name of attemptNames) {
      if (!ATTEMPT_NAME.test(name)) {
        throw new Error('Sealed attempt slot contains an unexpected entry');
      }
    }
    const expected = Array.from(
      { length: attemptNames.length },
      (_, index) => `attempt-${String(index + 1).padStart(3, '0')}`,
    );
    if (attemptNames.length > 3
      || attemptNames.some((name, index) => name !== expected[index])) {
      throw new Error('Sealed attempts must be exact contiguous ordinals');
    }
  }

  const stateDirectory = path.join(sealedRoot, 'slot-state', slot.slot_id);
  const stateStat = await optionalLstat(stateDirectory);
  let stateNames = [];
  if (stateStat !== null) {
    if (stateStat.isSymbolicLink() || !stateStat.isDirectory()) {
      throw new Error('Sealed slot-state directory must be a non-symlink directory');
    }
    stateNames = (await readdir(stateDirectory)).sort();
    for (const name of stateNames) {
      if (name !== 'terminal.json' && !/^attempt-00[1-3]\.json$/.test(name)) {
        throw new Error('Sealed slot-state directory contains an unexpected entry');
      }
    }
  }

  const attempts = [];
  const details = [];
  for (const [index, name] of attemptNames.entries()) {
    const attemptOrdinal = index + 1;
    const attemptPath = path.join(attemptRoot, name);
    const verified = await verifyRecord(attemptPath);
    const classification = verified?.classification;
    if (!isPlainObject(classification)
      || !['valid_final', 'terminal_invalid', 'infrastructure_retry'].includes(
        classification.classification,
      )
      || typeof classification.code !== 'string'
      || classification.code.length === 0) {
      throw new Error('Verified attempt returned an invalid classification');
    }
    await verifyAttemptRequest(attemptPath, packet.request);
    const recordBytes = await readRegular(
      path.join(attemptPath, 'record.json'),
      'Sealed attempt record',
    );
    const recordSha256 = sha256(recordBytes);
    const metadataPath = path.join(stateDirectory, `${name}.json`);
    const metadata = await optionalCanonicalJson(
      metadataPath,
      `Attempt metadata ${attemptOrdinal}`,
    );
    const latency = metadata === null
      ? null
      : validateAttemptMetadata(metadata.value, {
          slotOrdinal: slot.slot_ordinal,
          attemptOrdinal,
          recordSha256,
          classification: classification.classification,
          code: classification.code,
        });
    attempts.push({
      attempt_ordinal: attemptOrdinal,
      classification: classification.classification,
      code: classification.code,
      verified: true,
      latency_ms: latency,
    });
    details.push({
      attemptPath,
      attemptOrdinal,
      recordSha256,
      metadataPresent: metadata !== null,
      classification: classification.classification,
      code: classification.code,
      latency,
    });
  }

  for (const name of stateNames.filter((name) => name.startsWith('attempt-'))) {
    if (!attemptNames.includes(name.slice(0, -'.json'.length))) {
      throw new Error('Attempt metadata exists without an immutable attempt');
    }
  }
  const terminalArtifact = await optionalCanonicalJson(
    path.join(stateDirectory, 'terminal.json'),
    'Terminal slot record',
  );
  const terminalRecord = terminalArtifact?.value ?? null;
  if (terminalRecord !== null) {
    assertExactKeys(terminalRecord, TERMINAL_RECORD_KEYS, 'Terminal slot record');
  }
  const state = decideSlotState({
    slotOrdinal: slot.slot_ordinal,
    attempts,
    terminalRecord,
    fatalEnvironment: null,
  });
  return {
    slot,
    attempts,
    details,
    state,
    terminalBytes: terminalArtifact?.bytes ?? null,
  };
}

async function verifyFatalStops(sealedRoot, packets, verifyRecord) {
  const fatalRoot = path.join(sealedRoot, 'environment-stops');
  const rootStat = await optionalLstat(fatalRoot);
  const counts = new Map();
  if (rootStat === null) return counts;
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error('Fatal environment store must be a non-symlink directory');
  }
  for (const slotId of (await readdir(fatalRoot)).sort()) {
    if (!SLOT_ID.test(slotId)) {
      throw new Error('Fatal environment store contains an unexpected slot');
    }
    const packet = [...packets.values()].find((entry) => entry.slot.slot_id === slotId);
    if (packet === undefined) throw new Error('Fatal environment stop has no scheduled slot');
    const slotRoot = path.join(fatalRoot, slotId);
    await assertDirectory(slotRoot, 'Fatal environment slot');
    const names = (await readdir(slotRoot)).sort();
    for (const name of names) {
      if (!SAFE_ID.test(name)) throw new Error('Fatal environment stop ID is unsafe');
      const stopPath = path.join(slotRoot, name);
      const verified = await verifyRecord(stopPath);
      if (verified?.classification?.classification !== 'fatal_environment') {
        throw new Error('Fatal environment stop classification drifted');
      }
      await verifyAttemptRequest(stopPath, packet.request);
    }
    counts.set(slotId, names.length);
  }
  return counts;
}

async function inspectSealedState({
  root,
  inputs,
  verifyRecord,
}) {
  const sealedRoot = path.join(root, 'sealed-attempts');
  const rootStat = await optionalLstat(sealedRoot);
  if (rootStat === null) {
    const slots = [];
    for (const slot of inputs.schedule.slots) {
      slots.push({
        slot,
        attempts: [],
        details: [],
        state: decideSlotState({
          slotOrdinal: slot.slot_ordinal,
          attempts: [],
          terminalRecord: null,
          fatalEnvironment: null,
        }),
        terminalBytes: null,
      });
    }
    return { sealedRoot, slots, fatalCounts: new Map() };
  }
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error('Sealed attempt root must be a non-symlink directory');
  }
  const scheduledIds = new Set(inputs.schedule.slots.map((slot) => slot.slot_id));
  for (const name of await readdir(sealedRoot)) {
    if (!SEALED_ALLOWED_ROOTS.has(name) && !scheduledIds.has(name)) {
      throw new Error('Sealed attempt root contains an unexpected entry');
    }
  }
  const slots = [];
  for (const slot of inputs.schedule.slots) {
    slots.push(await readSlotState({
      sealedRoot,
      slot,
      packet: inputs.packets.get(slot.slot_ordinal),
      verifyRecord,
    }));
  }
  const fatalCounts = await verifyFatalStops(sealedRoot, inputs.packets, verifyRecord);
  let incompleteSeen = false;
  for (const slot of slots) {
    if (slot.state.kind === 'complete') {
      if (incompleteSeen) {
        throw new Error('A later slot completed before the first unfinished slot');
      }
      continue;
    }
    if (!incompleteSeen) {
      incompleteSeen = true;
      continue;
    }
    if (slot.attempts.length !== 0
      || slot.state.kind === 'terminal'
      || slot.terminalBytes !== null) {
      throw new Error('A later slot changed before the first unfinished slot');
    }
  }
  return { sealedRoot, slots, fatalCounts };
}

function attemptMetadata(slot, detail, latency) {
  return {
    version: 1,
    slot_ordinal: slot.slot_ordinal,
    attempt_ordinal: detail.attemptOrdinal,
    attempt_record_sha256: detail.recordSha256,
    classification: detail.classification,
    code: detail.code,
    latency_ms: latency,
  };
}

async function writeMissingMetadata(bundle, writer) {
  for (const slot of bundle.slots) {
    for (const detail of slot.details) {
      if (detail.metadataPresent) continue;
      await writer(
        path.join(
          bundle.sealedRoot,
          'slot-state',
          slot.slot.slot_id,
          `attempt-${String(detail.attemptOrdinal).padStart(3, '0')}.json`,
        ),
        Buffer.from(canonicalJson(attemptMetadata(slot.slot, detail, null))),
      );
    }
  }
}

async function writeDerivedTerminals(bundle, writer) {
  for (const slot of bundle.slots) {
    if (slot.state.kind !== 'terminal') continue;
    await writer(
      path.join(
        bundle.sealedRoot,
        'slot-state',
        slot.slot.slot_id,
        'terminal.json',
      ),
      Buffer.from(canonicalJson(slot.state.terminal_record)),
    );
  }
}

function completionArtifact(bundle) {
  if (bundle.slots.some((slot) => slot.state.kind !== 'complete')) return null;
  return {
    version: 1,
    scheduled_slot_count: METHOD.scheduledSlotCount,
    terminal_slot_count: bundle.slots.length,
    terminal_records: bundle.slots.map((slot) => ({
      slot_ordinal: slot.slot.slot_ordinal,
      terminal_record_sha256: sha256(slot.terminalBytes),
    })),
  };
}

async function verifyCompletionSeal(root, bundle) {
  const filename = path.join(root, 'locks/all-slots-terminal.json');
  const stored = await optionalCanonicalJson(filename, 'All-slots terminal seal');
  const expected = completionArtifact(bundle);
  if (stored !== null && expected === null) {
    throw new Error('All-slots terminal seal exists before every slot is terminal');
  }
  if (stored !== null && canonicalJson(stored.value) !== canonicalJson(expected)) {
    throw new Error('All-slots terminal seal differs from terminal records');
  }
  return { filename, stored, expected };
}

function progressReceipt(bundle, overrides = {}) {
  const completedSlots = bundle.slots.filter((slot) => slot.state.kind === 'complete').length;
  const active = bundle.slots.find((slot) => slot.state.kind !== 'complete');
  let values;
  if (active === undefined) {
    values = {
      slot_ordinal: null,
      attempt_ordinal: null,
      terminal_state: null,
      classification: null,
      code: null,
      latency_ms: null,
    };
  } else if (active.state.kind === 'terminal') {
    const record = active.state.terminal_record;
    values = {
      slot_ordinal: active.slot.slot_ordinal,
      attempt_ordinal: record.authoritative_attempt_ordinal,
      terminal_state: record.terminal_state,
      classification: record.classification,
      code: record.code,
      latency_ms: record.latency_ms,
    };
  } else {
    const prior = active.attempts.at(-1);
    values = {
      slot_ordinal: active.slot.slot_ordinal,
      attempt_ordinal: active.state.attempt_ordinal,
      terminal_state: null,
      classification: prior?.classification ?? null,
      code: prior?.code ?? null,
      latency_ms: prior?.latency_ms ?? null,
    };
  }
  const receipt = {
    ...values,
    completed_slots: completedSlots,
    scheduled_slots: METHOD.scheduledSlotCount,
    ...overrides,
  };
  assertExactKeys(receipt, SAFE_OUTPUT_KEYS, 'Runner progress receipt');
  return Object.freeze(receipt);
}

function emit(io, receipt) {
  io.writeOutput(`${JSON.stringify(receipt)}\n`);
}

async function defaultVerifyFrozenRun(options) {
  let locks;
  try {
    locks = await import('./locks.mjs');
  } catch {
    throw new Error('Frozen run verifier is unavailable');
  }
  if (typeof locks.verifyFrozenRun !== 'function') {
    throw new Error('Frozen run verifier is unavailable');
  }
  return locks.verifyFrozenRun(options);
}

function normalizeIo(io) {
  if (io === null || typeof io !== 'object' || Array.isArray(io)) {
    throw new TypeError('Runner I/O dependencies must be an object');
  }
  const normalized = {
    verifyFrozenRun: io.verifyFrozenRun ?? defaultVerifyFrozenRun,
    verifyPrepared: io.verifyPrepared ?? verifyPrepared,
    claimAttemptJournal: io.claimAttemptJournal ?? claimAttemptJournal,
    finalizeAttemptJournal: io.finalizeAttemptJournal ?? finalizeAttemptJournal,
    recoverAttemptJournals: io.recoverAttemptJournals ?? recoverAttemptJournals,
    verifyAttemptRecord: io.verifyAttemptRecord ?? verifyAttemptRecord,
    createFreshAttemptRuntime: io.createFreshAttemptRuntime ?? createFreshAttemptRuntime,
    executeAttempt: io.executeAttempt ?? executeAttempt,
    writeImmutable: io.writeImmutable ?? writeImmutable,
    nowMs: io.nowMs ?? Date.now,
    writeOutput: io.writeOutput ?? ((text) => process.stdout.write(text)),
    authSourcePath: io.authSourcePath
      ?? path.join(process.env.CODEX_HOME ?? path.join(os.homedir(), '.codex'), 'auth.json'),
  };
  for (const key of [
    'verifyFrozenRun',
    'verifyPrepared',
    'claimAttemptJournal',
    'finalizeAttemptJournal',
    'recoverAttemptJournals',
    'verifyAttemptRecord',
    'createFreshAttemptRuntime',
    'executeAttempt',
    'writeImmutable',
    'nowMs',
    'writeOutput',
  ]) {
    if (typeof normalized[key] !== 'function') {
      throw new TypeError(`Runner dependency ${key} must be a function`);
    }
  }
  if (typeof normalized.authSourcePath !== 'string'
    || !path.isAbsolute(normalized.authSourcePath)) {
    throw new TypeError('Runner authSourcePath must be absolute');
  }
  return normalized;
}

function safeFailure(message, cause) {
  return new Error(message, { cause });
}

async function verifyInputs(root, io) {
  try {
    await io.verifyFrozenRun({ root });
    await io.verifyPrepared({ root, downstreamAuthenticated: true });
  } catch (error) {
    throw safeFailure('Runner frozen and prepared verification failed', error);
  }
  try {
    return await loadPreparedInputs(root);
  } catch (error) {
    const label = /schedule/i.test(error?.message ?? '') ? 'schedule' : 'packet';
    throw safeFailure(`Runner ${label} verification failed`, error);
  }
}

async function inspect(root, inputs, io) {
  try {
    const bundle = await inspectSealedState({
      root,
      inputs,
      verifyRecord: io.verifyAttemptRecord,
    });
    await verifyCompletionSeal(root, bundle);
    return bundle;
  } catch (error) {
    throw safeFailure('Runner sealed attempt and terminal verification failed', error);
  }
}

async function recoverInflight(root, inputs, io) {
  const sealedRoot = path.join(root, 'sealed-attempts');
  if (await optionalLstat(sealedRoot) === null) return null;
  let fatal = null;
  try {
    for (const slot of inputs.schedule.slots) {
      const recovered = await io.recoverAttemptJournals({
        sealedRoot,
        slotId: slot.slot_id,
      });
      for (const receipt of recovered) {
        if (receipt.classification.classification === 'fatal_environment') {
          if (fatal !== null) {
            throw new Error('Multiple fatal environment journals recovered');
          }
          fatal = { slot, receipt };
        }
      }
    }
    return fatal;
  } catch (error) {
    throw safeFailure('Runner inflight journal recovery failed', error);
  }
}

async function settleRecoveredState(root, inputs, io) {
  let bundle = await inspect(root, inputs, io);
  try {
    await writeMissingMetadata(bundle, io.writeImmutable);
    await writeDerivedTerminals(bundle, io.writeImmutable);
  } catch (error) {
    throw safeFailure('Runner recovered state publication failed', error);
  }
  bundle = await inspect(root, inputs, io);
  return bundle;
}

async function sealIfComplete(root, bundle, io) {
  const completion = await verifyCompletionSeal(root, bundle);
  if (completion.expected === null) return false;
  if (completion.stored === null) {
    try {
      await io.writeImmutable(
        completion.filename,
        Buffer.from(canonicalJson(completion.expected)),
      );
    } catch (error) {
      throw safeFailure('Runner completion seal publication failed', error);
    }
    const verified = await optionalCanonicalJson(
      completion.filename,
      'All-slots terminal seal',
    );
    if (verified === null
      || canonicalJson(verified.value) !== canonicalJson(completion.expected)) {
      throw new Error('Runner completion seal verification failed');
    }
  }
  return true;
}

async function countCurrentFatalStops(bundle, slotId) {
  return bundle.fatalCounts.get(slotId) ?? 0;
}

function opaqueAttemptId(attemptOrdinal, fatalCount) {
  return `a${String(attemptOrdinal).padStart(3, '0')}-e${String(fatalCount + 1).padStart(3, '0')}`;
}

async function executeOne({
  root,
  inputs,
  bundle,
  active,
  io,
  schemaBytes,
}) {
  const packet = inputs.packets.get(active.slot.slot_ordinal);
  let runtime;
  try {
    runtime = await io.createFreshAttemptRuntime({
      authSourcePath: io.authSourcePath,
      schemaBytes,
      imageBytes: packet.imageBytes,
    });
  } catch (error) {
    throw safeFailure('Runner isolated attempt setup failed', error);
  }
  const opaqueId = opaqueAttemptId(
    active.state.attempt_ordinal,
    await countCurrentFatalStops(bundle, active.slot.slot_id),
  );
  let journal;
  try {
    journal = await io.claimAttemptJournal({
      sealedRoot: bundle.sealedRoot,
      slotId: active.slot.slot_id,
      opaqueId,
      request: packet.request,
    });
  } catch (error) {
    try { await runtime.cleanup(); } catch {}
    throw safeFailure('Runner exclusive attempt claim failed', error);
  }

  const started = io.nowMs();
  let promotion = null;
  let executionError = null;
  try {
    await io.executeAttempt({
      runtime,
      promptText: packet.promptText,
      journal,
      durableClassification: async ({ journal_path: journalPath, process }) => {
        promotion = await io.finalizeAttemptJournal({
          sealedRoot: bundle.sealedRoot,
          slotId: active.slot.slot_id,
          journalPath,
          process,
        });
      },
    });
  } catch (error) {
    executionError = error;
  } finally {
    try {
      await runtime.cleanup();
    } catch (error) {
      executionError ??= error;
    }
  }
  const latency = Math.max(0, Math.round(io.nowMs() - started));

  if (promotion === null) {
    try {
      const recovered = await io.recoverAttemptJournals({
        sealedRoot: bundle.sealedRoot,
        slotId: active.slot.slot_id,
      });
      if (recovered.length !== 1) {
        throw new Error('Attempt failure did not leave exactly one recoverable journal');
      }
      [promotion] = recovered;
    } catch (error) {
      throw safeFailure('Runner attempt execution and recovery failed', error);
    }
  }
  if (promotion.classification.classification === 'fatal_environment') {
    return {
      kind: 'fatal',
      receipt: progressReceipt(bundle, {
        slot_ordinal: active.slot.slot_ordinal,
        attempt_ordinal: active.state.attempt_ordinal,
        terminal_state: null,
        classification: 'fatal_environment',
        code: promotion.classification.code,
        latency_ms: latency,
      }),
    };
  }

  const expectedName = `attempt-${String(active.state.attempt_ordinal).padStart(3, '0')}`;
  if (path.basename(promotion.path) !== expectedName) {
    throw safeFailure(
      'Runner promoted attempt ordinal verification failed',
      executionError,
    );
  }
  let verified;
  try {
    verified = await io.verifyAttemptRecord(promotion.path);
    if (verified.classification.classification !== promotion.classification.classification
      || verified.classification.code !== promotion.classification.code) {
      throw new Error('Promoted attempt classification differs after verification');
    }
    await verifyAttemptRequest(promotion.path, packet.request);
    const recordBytes = await readRegular(
      path.join(promotion.path, 'record.json'),
      'Promoted attempt record',
    );
    await io.writeImmutable(
      path.join(
        bundle.sealedRoot,
        'slot-state',
        active.slot.slot_id,
        `${expectedName}.json`,
      ),
      Buffer.from(canonicalJson({
        version: 1,
        slot_ordinal: active.slot.slot_ordinal,
        attempt_ordinal: active.state.attempt_ordinal,
        attempt_record_sha256: sha256(recordBytes),
        classification: verified.classification.classification,
        code: verified.classification.code,
        latency_ms: latency,
      })),
    );
  } catch (error) {
    throw safeFailure('Runner promoted attempt verification failed', error);
  }
  return {
    kind: 'attempt',
    classification: verified.classification.classification,
    code: verified.classification.code,
    latency,
  };
}

async function run(root, inputs, io) {
  const sealedRoot = path.join(root, 'sealed-attempts');
  await inspect(root, inputs, io);
  if (await optionalLstat(sealedRoot) === null) {
    try {
      await mkdir(sealedRoot, { mode: 0o700 });
    } catch (error) {
      throw safeFailure('Runner sealed attempt root creation failed', error);
    }
  }
  const recoveredFatal = await recoverInflight(root, inputs, io);
  let bundle = await settleRecoveredState(root, inputs, io);
  if (recoveredFatal !== null) {
    const active = bundle.slots.find(
      (entry) => entry.slot.slot_ordinal === recoveredFatal.slot.slot_ordinal,
    );
    const receipt = progressReceipt(bundle, {
      slot_ordinal: recoveredFatal.slot.slot_ordinal,
      attempt_ordinal: active?.state.attempt_ordinal ?? null,
      terminal_state: null,
      classification: 'fatal_environment',
      code: recoveredFatal.receipt.classification.code,
      latency_ms: null,
    });
    emit(io, receipt);
    return receipt;
  }

  const schemaBytes = await readRegular(
    new URL('../prediction.schema.json', import.meta.url),
    'Frozen prediction schema',
    { mode: null },
  );
  while (true) {
    bundle = await settleRecoveredState(root, inputs, io);
    if (await sealIfComplete(root, bundle, io)) {
      bundle = await inspect(root, inputs, io);
      const receipt = progressReceipt(bundle);
      emit(io, receipt);
      return receipt;
    }
    const active = bundle.slots.find((slot) => slot.state.kind !== 'complete');
    if (active === undefined || active.state.kind !== 'attempt') {
      throw new Error('Runner could not resolve the first unfinished slot');
    }
    const outcome = await executeOne({
      root,
      inputs,
      bundle,
      active,
      io,
      schemaBytes,
    });
    if (outcome.kind === 'fatal') {
      emit(io, outcome.receipt);
      return outcome.receipt;
    }
    bundle = await settleRecoveredState(root, inputs, io);
    const updated = bundle.slots.find(
      (slot) => slot.slot.slot_ordinal === active.slot.slot_ordinal,
    );
    const completedSlots = bundle.slots.filter(
      (slot) => slot.state.kind === 'complete',
    ).length;
    const terminal = updated.state.kind === 'complete'
      ? updated.state.terminal_record
      : null;
    const receipt = Object.freeze({
      slot_ordinal: active.slot.slot_ordinal,
      attempt_ordinal: active.state.attempt_ordinal,
      terminal_state: terminal?.terminal_state ?? null,
      classification: outcome.classification,
      code: outcome.code,
      latency_ms: outcome.latency,
      completed_slots: completedSlots,
      scheduled_slots: METHOD.scheduledSlotCount,
    });
    emit(io, receipt);
  }
}

export async function runRunnerCommand({
  root,
  command,
  io = {},
} = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Runner root must be absolute');
  }
  if (!RUNNER_COMMANDS.includes(command)) {
    throw new Error(`Unknown runner command: ${String(command)}`);
  }
  const dependencies = normalizeIo(io);
  const inputs = await verifyInputs(path.resolve(root), dependencies);
  if (command === 'run') {
    return run(path.resolve(root), inputs, dependencies);
  }
  const bundle = await inspect(path.resolve(root), inputs, dependencies);
  const receipt = progressReceipt(bundle);
  emit(dependencies, receipt);
  return receipt;
}
