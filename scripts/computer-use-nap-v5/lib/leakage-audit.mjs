import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { lstat, open, readdir } from 'node:fs/promises';
import path from 'node:path';
import { inflateSync } from 'node:zlib';

import { CONDITIONS } from '../config.mjs';

const OPTION_KEYS = ['condition', 'contextDirectory', 'packetDirectory', 'expectedInventory'];
const [STATE_CONDITION, HISTORY_CONDITION] = CONDITIONS;
const CONTEXT_KEYS = ['version', 'current', 'history', 'visual_history'];
const HISTORY_KEYS = [
  'history_ordinal', 'action_type', 'input_method', 'granularity',
  'app', 'object', 'subtarget',
];
const VISUAL_KEYS = ['image_ordinal', 'history_ordinal', 'image_sha256'];
const PACKET_KEYS = ['version', 'condition', 'prompt_text', 'context_sha256', 'images'];
const IMAGE_KEYS = ['attachment_ordinal', 'sha256'];
const EXPECTED_INVENTORY_KEYS = [
  'context_sha256',
  'ordered_image_sha256',
  'forbidden_canaries',
  'forbidden_json_keys',
];
const ACTION_TYPES = new Set(['focus', 'activate']);
const INPUT_METHODS = new Set(['pointer', 'keyboard_enter', 'keyboard_command_w']);
const GRANULARITIES = new Set(['application', 'object', 'subtarget']);
const CANARY_PREFIX = 'b64u:';
const MAX_COMPONENT_CODE_POINTS = 256;
const MAX_CANARY_CODE_POINTS = 2_000;
const MAX_CANARY_UTF8_BYTES = MAX_CANARY_CODE_POINTS * 4;
const MAX_CANARY_TOKEN_CODE_POINTS = (
  CANARY_PREFIX.length + Math.ceil((MAX_CANARY_UTF8_BYTES * 4) / 3)
);
const MAX_FORBIDDEN_KEY_CODE_POINTS = 128;
const SHA256 = /^[0-9a-f]{64}$/;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

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
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${label} contains forbidden keys; expected exactly: ${keys.join(', ')}`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function checkCanaries(bytes, label, canaries) {
  for (const canary of canaries) {
    if (bytes.includes(Buffer.from(canary, 'utf8'))) {
      throw new Error(`Forbidden evaluator canary found in ${label}`);
    }
  }
}

function validateCanaries(value) {
  if (!Array.isArray(value)
    || value.length === 0
    || value.some((canary) => (
      typeof canary !== 'string'
      || Array.from(canary).length > MAX_CANARY_TOKEN_CODE_POINTS
      || !/^b64u:[A-Za-z0-9_-]+$/u.test(canary)
    ))
    || new Set(value).size !== value.length) {
    throw new Error('Complete forbidden canary set must contain unique canonical base64url tokens');
  }
  const decoded = value.map((canary) => {
    const payload = canary.slice(CANARY_PREFIX.length);
    const bytes = Buffer.from(payload, 'base64url');
    if (bytes.toString('base64url') !== payload) {
      throw new Error('Forbidden canary must use canonical base64url encoding');
    }
    let raw;
    try {
      raw = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      throw new Error('Forbidden canary must encode valid UTF-8');
    }
    if (raw.length === 0
      || raw !== raw.trim()
      || raw.normalize('NFKC') !== raw
      || Array.from(raw).length > MAX_CANARY_CODE_POINTS
      || /[\u0000-\u001f\u007f]/u.test(raw)) {
      throw new Error('Decoded forbidden canary must be normalized trimmed nonempty bounded text');
    }
    return raw;
  });
  if (new Set(decoded).size !== decoded.length) {
    throw new Error('Decoded forbidden canaries must be unique');
  }
  return Object.freeze([...value]);
}

function validateForbiddenJsonKeys(value) {
  if (!Array.isArray(value)
    || value.length === 0
    || value.some((key) => (
      typeof key !== 'string'
      || key.length === 0
      || key !== key.trim()
      || key.normalize('NFKC') !== key
      || Array.from(key).length > MAX_FORBIDDEN_KEY_CODE_POINTS
      || !/^[a-z][a-z0-9_]*$/u.test(key)
    ))
    || new Set(value).size !== value.length) {
    throw new Error('Complete forbidden JSON key set must contain unique normalized field names');
  }
  return Object.freeze([...value]);
}

function validateExpectedInventory(value, condition) {
  assertExactKeys(value, EXPECTED_INVENTORY_KEYS, 'Trusted expected inventory');
  const attachmentCount = condition === STATE_CONDITION ? 1 : 11;
  if (!SHA256.test(value.context_sha256)
    || !Array.isArray(value.ordered_image_sha256)
    || value.ordered_image_sha256.length !== attachmentCount
    || value.ordered_image_sha256.some((digest) => !SHA256.test(digest))) {
    throw new Error('Trusted expected inventory context SHA or ordered image SHAs are invalid');
  }
  return Object.freeze({
    contextSha256: value.context_sha256,
    orderedImageSha256: Object.freeze([...value.ordered_image_sha256]),
    canaries: validateCanaries(value.forbidden_canaries),
    forbiddenJsonKeys: validateForbiddenJsonKeys(value.forbidden_json_keys),
  });
}

function statSnapshot(stat) {
  return Object.freeze({
    dev: stat.dev,
    ino: stat.ino,
    mode: stat.mode,
    nlink: stat.nlink,
    size: stat.size,
    mtimeNs: stat.mtimeNs,
    ctimeNs: stat.ctimeNs,
  });
}

function sameSnapshot(stat, snapshot) {
  return stat.dev === snapshot.dev
    && stat.ino === snapshot.ino
    && stat.mode === snapshot.mode
    && stat.nlink === snapshot.nlink
    && stat.size === snapshot.size
    && stat.mtimeNs === snapshot.mtimeNs
    && stat.ctimeNs === snapshot.ctimeNs;
}

function assertRegularSnapshot(stat, label) {
  if (stat.isSymbolicLink()) throw new Error(`${label} is a symlink`);
  if (!stat.isFile()) throw new Error(`${label} is a special or non-regular file`);
  if (stat.nlink !== 1n) throw new Error(`${label} has forbidden hardlink count`);
  if ((stat.mode & 0o777n) !== 0o600n) throw new Error(`${label} mode must be 0600`);
}

async function readRegular(filename, label, seenInodes) {
  const stat = await lstat(filename, { bigint: true });
  assertRegularSnapshot(stat, label);
  const inodeKey = `${stat.dev}:${stat.ino}`;
  if (seenInodes.has(inodeKey)) throw new Error(`${label} aliases another audited inode`);
  seenInodes.add(inodeKey);
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || !sameSnapshot(before, statSnapshot(stat))) {
      throw new Error(`${label} changed during audit`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const finalPathStat = await lstat(filename, { bigint: true });
    if (!sameSnapshot(after, statSnapshot(before))
      || !sameSnapshot(finalPathStat, statSnapshot(after))) {
      throw new Error(`${label} changed during audit`);
    }
    return {
      bytes,
      snapshot: Object.freeze({
        ...statSnapshot(after),
        sha256: sha256(bytes),
      }),
    };
  } finally {
    await handle.close();
  }
}

async function readExactTree(directory, expectedNames, label, canaries, seenInodes) {
  const stat = await lstat(directory, { bigint: true });
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`${label} must be a non-symlink directory`);
  }
  const names = (await readdir(directory)).sort();
  for (const name of names) checkCanaries(Buffer.from(name, 'utf8'), `${label} filename`, canaries);
  const expected = [...expectedNames].sort();
  if (names.length !== expected.length || names.some((name, index) => name !== expected[index])) {
    throw new Error(`${label} has extra, missing, or unexpected entries`);
  }
  const files = new Map();
  const fileSnapshots = new Map();
  for (const name of names) {
    const read = await readRegular(path.join(directory, name), `${label}/${name}`, seenInodes);
    checkCanaries(read.bytes, `${label}/${name}`, canaries);
    files.set(name, read.bytes);
    fileSnapshots.set(name, read.snapshot);
  }
  return {
    files,
    snapshot: Object.freeze({
      directory: statSnapshot(stat),
      names: Object.freeze([...names]),
      files: fileSnapshots,
    }),
    directory,
    label,
  };
}

async function revalidateFile(filename, label, snapshot) {
  const pathStat = await lstat(filename, { bigint: true });
  assertRegularSnapshot(pathStat, label);
  if (!sameSnapshot(pathStat, snapshot)) {
    throw new Error(`${label} changed since the audited snapshot`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || !sameSnapshot(before, snapshot)) {
      throw new Error(`${label} changed during snapshot revalidation`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const finalPathStat = await lstat(filename, { bigint: true });
    if (!sameSnapshot(after, snapshot)
      || !sameSnapshot(finalPathStat, snapshot)
      || sha256(bytes) !== snapshot.sha256) {
      throw new Error(`${label} changed during snapshot revalidation`);
    }
  } finally {
    await handle.close();
  }
}

async function revalidateTree(tree) {
  const initialDirectoryStat = await lstat(tree.directory, { bigint: true });
  if (initialDirectoryStat.isSymbolicLink()
    || !initialDirectoryStat.isDirectory()
    || !sameSnapshot(initialDirectoryStat, tree.snapshot.directory)) {
    throw new Error(`${tree.label} changed since the audited snapshot`);
  }
  const names = (await readdir(tree.directory)).sort();
  if (names.length !== tree.snapshot.names.length
    || names.some((name, index) => name !== tree.snapshot.names[index])) {
    throw new Error(`${tree.label} pathnames changed during snapshot revalidation`);
  }
  for (const name of names) {
    await revalidateFile(
      path.join(tree.directory, name),
      `${tree.label}/${name}`,
      tree.snapshot.files.get(name),
    );
  }
  const finalDirectoryStat = await lstat(tree.directory, { bigint: true });
  if (!sameSnapshot(finalDirectoryStat, tree.snapshot.directory)) {
    throw new Error(`${tree.label} changed during snapshot revalidation`);
  }
}

function checkForbiddenJsonKeys(value, label, forbiddenKeys) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => (
      checkForbiddenJsonKeys(entry, `${label}[${index}]`, forbiddenKeys)
    ));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    if (forbiddenKeys.includes(key)) {
      throw new Error(`Forbidden evaluator JSON key found in ${label}: ${key}`);
    }
    checkForbiddenJsonKeys(entry, `${label}.${key}`, forbiddenKeys);
  }
}

function validateComponent(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || Array.from(value).length > MAX_COMPONENT_CODE_POINTS
    || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error(`${label} must be a trimmed nonempty bounded string${nullable ? ' or null' : ''}`);
  }
}

function derivedGranularity(entry, label) {
  validateComponent(entry.app, `${label} app`);
  validateComponent(entry.object, `${label} object`, { nullable: true });
  validateComponent(entry.subtarget, `${label} subtarget`, { nullable: true });
  if (entry.object === null && entry.subtarget === null) return 'application';
  if (entry.object !== null && entry.subtarget === null) return 'object';
  if (entry.object !== null && entry.subtarget !== null) return 'subtarget';
  throw new Error(`${label} target null shape is invalid`);
}

function parseFrozenJson(bytes, label) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${label} is not valid UTF-8`);
  }
  if (text.includes('\r') || !text.endsWith('\n') || text.endsWith('\n\n')) {
    throw new Error(`${label} must use LF and exactly one trailing newline`);
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(`${label} is not valid JSON`);
  }
  if (text !== `${JSON.stringify(value, null, 2)}\n`) {
    throw new Error(`${label} does not use frozen JSON serialization`);
  }
  return value;
}

function validateContext(condition, context) {
  assertExactKeys(context, CONTEXT_KEYS, 'Context JSON');
  assertExactKeys(context.current, ['image_sha256'], 'Context current image');
  if (context.version !== 1
    || !SHA256.test(context.current.image_sha256)
    || !Array.isArray(context.history)
    || !Array.isArray(context.visual_history)) {
    throw new Error('Context version, current hash, or arrays are invalid');
  }
  let priorHistoryOrdinal = 0;
  const historyOrdinals = new Set();
  for (const [index, entry] of context.history.entries()) {
    assertExactKeys(entry, HISTORY_KEYS, `Context history ${index + 1}`);
    if (!Number.isSafeInteger(entry.history_ordinal)
      || entry.history_ordinal <= priorHistoryOrdinal
      || entry.history_ordinal > 196) {
      throw new Error(`Context history ${index + 1} ordinal must be strictly increasing within 1..196`);
    }
    if (!ACTION_TYPES.has(entry.action_type)) {
      throw new Error(`Context history ${index + 1} action_type must be focus or activate`);
    }
    if (!INPUT_METHODS.has(entry.input_method)) {
      throw new Error(`Context history ${index + 1} input_method is outside the frozen corpus enum`);
    }
    if (!GRANULARITIES.has(entry.granularity)
      || derivedGranularity(entry, `Context history ${index + 1}`) !== entry.granularity) {
      throw new Error(`Context history ${index + 1} granularity does not match target null shape`);
    }
    historyOrdinals.add(entry.history_ordinal);
    priorHistoryOrdinal = entry.history_ordinal;
  }
  let priorVisualHistoryOrdinal = 0;
  for (const [index, entry] of context.visual_history.entries()) {
    assertExactKeys(entry, VISUAL_KEYS, `Context visual history ${index + 1}`);
    if (entry.image_ordinal !== index + 1
      || !Number.isSafeInteger(entry.history_ordinal)
      || !historyOrdinals.has(entry.history_ordinal)
      || entry.history_ordinal <= priorVisualHistoryOrdinal
      || !SHA256.test(entry.image_sha256)) {
      throw new Error(`Context visual history ${index + 1} must have unique strictly increasing ordinals tied to history`);
    }
    priorVisualHistoryOrdinal = entry.history_ordinal;
  }
  if (condition === STATE_CONDITION
    && (context.history.length !== 0 || context.visual_history.length !== 0)) {
    throw new Error('State-only context must not expose history');
  }
  if (condition === HISTORY_CONDITION
    && (context.history.length === 0 || context.visual_history.length !== 10)) {
    throw new Error('History context must have structured history and ten visual rows');
  }
}

function expectedPrompt(condition, context) {
  if (condition === STATE_CONDITION) {
    return 'CURRENT BEFORE-STATE\nimage-001.png\n\nPredict the immediate next eligible action.\n';
  }
  const history = context.history.map((entry) => JSON.stringify({
    history_ordinal: entry.history_ordinal,
    action_type: entry.action_type,
    input_method: entry.input_method,
    granularity: entry.granularity,
    app: entry.app,
    object: entry.object,
    subtarget: entry.subtarget,
  }));
  const mappings = context.visual_history.map((entry, index) => (
    `image-${String(index + 1).padStart(3, '0')}.png -> history_ordinal=${entry.history_ordinal}`
  ));
  return [
    'EARLIER COMPLETED ACTIONS (oldest to newest)',
    ...history,
    '',
    'RECENT VISUAL HISTORY (oldest to newest)',
    ...mappings,
    '',
    'CURRENT BEFORE-STATE',
    'image-011.png',
    '',
    'Predict the immediate next eligible action.',
    '',
  ].join('\n');
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) === 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function validatePng(bytes, label) {
  if (bytes.length < PNG_SIGNATURE.length + 12 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${label} has an invalid PNG signature`);
  }
  let offset = 8;
  let width = null;
  let height = null;
  let bitDepth = null;
  let colorType = null;
  let sawPlte = false;
  let paletteEntries = null;
  let sawIdat = false;
  let sawIend = false;
  const compressed = [];
  while (offset < bytes.length) {
    if (bytes.length - offset < 12) throw new Error(`${label} has a truncated PNG chunk`);
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new Error(`${label} has a PNG chunk beyond EOF`);
    const typeBytes = bytes.subarray(offset + 4, offset + 8);
    const type = typeBytes.toString('ascii');
    if (!/^[A-Za-z]{4}$/.test(type)) throw new Error(`${label} has an invalid PNG chunk type`);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    const expectedCrc = bytes.readUInt32BE(offset + 8 + length);
    if (crc32(Buffer.concat([typeBytes, data])) !== expectedCrc) {
      throw new Error(`${label} has a PNG CRC mismatch`);
    }
    if (!['IHDR', 'PLTE', 'IDAT', 'IEND'].includes(type)) {
      const kind = type[0] === type[0].toLowerCase() ? 'ancillary metadata' : 'unknown critical';
      throw new Error(`${label} contains forbidden PNG ${kind} chunk ${type}`);
    }
    if (type === 'IHDR') {
      if (offset !== 8 || length !== 13 || width !== null) throw new Error(`${label} has invalid PNG IHDR placement`);
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (width === 0 || height === 0
        || data[10] !== 0
        || data[11] !== 0
        || data[12] !== 0) {
        throw new Error(`${label} has unsupported PNG IHDR fields`);
      }
    } else if (type === 'PLTE') {
      if (width === null
        || sawPlte
        || sawIdat
        || sawIend
        || length === 0
        || length > 768
        || length % 3 !== 0) {
        throw new Error(`${label} has invalid PNG PLTE placement or length`);
      }
      if (colorType === 0 || colorType === 4) {
        throw new Error(`${label} has forbidden PNG PLTE for grayscale color type`);
      }
      sawPlte = true;
      paletteEntries = length / 3;
    } else if (type === 'IDAT') {
      if (width === null || sawIend) throw new Error(`${label} has invalid PNG IDAT placement`);
      sawIdat = true;
      compressed.push(data);
    } else {
      if (width === null || !sawIdat || length !== 0 || sawIend) {
        throw new Error(`${label} has invalid PNG IEND placement`);
      }
      sawIend = true;
    }
    offset = end;
    if (sawIend) break;
  }
  if (!sawIend || offset !== bytes.length) throw new Error(`${label} has missing IEND or trailing PNG bytes`);
  if (width !== 1920 || height !== 1080) throw new Error(`${label} dimensions must be exactly 1920x1080`);
  const channels = new Map([[0, 1], [2, 3], [3, 1], [4, 2], [6, 4]]).get(colorType);
  const allowedDepths = {
    0: [1, 2, 4, 8, 16],
    2: [8, 16],
    3: [1, 2, 4, 8],
    4: [8, 16],
    6: [8, 16],
  };
  if (channels === undefined || !allowedDepths[colorType].includes(bitDepth)) {
    throw new Error(`${label} has unsupported PNG color type or bit depth`);
  }
  if (colorType === 3 && !sawPlte) throw new Error(`${label} indexed PNG requires PLTE`);
  if (colorType === 3 && (paletteEntries === null || paletteEntries > 2 ** bitDepth)) {
    throw new Error(`${label} PNG PLTE has too many entries for indexed bit depth`);
  }
  const rowBits = width * channels * bitDepth;
  const rowBytes = Math.ceil(rowBits / 8);
  const expectedInflatedLength = height * (rowBytes + 1);
  if (!Number.isSafeInteger(rowBits)
    || !Number.isSafeInteger(rowBytes)
    || !Number.isSafeInteger(expectedInflatedLength)
    || expectedInflatedLength <= 0) {
    throw new Error(`${label} PNG dimensions overflow safe scanline arithmetic`);
  }
  let inflatedResult;
  const compressedBytes = Buffer.concat(compressed);
  try {
    inflatedResult = inflateSync(compressedBytes, {
      info: true,
      maxOutputLength: expectedInflatedLength,
    });
  } catch {
    throw new Error(`${label} has invalid or bomb-like PNG compressed image data`);
  }
  if (inflatedResult.engine.bytesWritten !== compressedBytes.length) {
    throw new Error(`${label} has residual compressed data after the first zlib stream`);
  }
  const inflated = inflatedResult.buffer;
  if (inflated.length !== expectedInflatedLength) throw new Error(`${label} has invalid PNG scanline length`);
  const bytesPerPixel = Math.max(1, Math.ceil((channels * bitDepth) / 8));
  let previous = Buffer.alloc(rowBytes);
  let reconstructed = Buffer.allocUnsafe(rowBytes);
  for (let row = 0; row < height; row += 1) {
    const scanlineOffset = row * (rowBytes + 1);
    const filter = inflated[scanlineOffset];
    if (filter > 4) throw new Error(`${label} has invalid PNG filter type`);
    if (colorType !== 3) continue;
    const raw = inflated.subarray(scanlineOffset + 1, scanlineOffset + 1 + rowBytes);
    for (let index = 0; index < rowBytes; index += 1) {
      const left = index >= bytesPerPixel ? reconstructed[index - bytesPerPixel] : 0;
      const above = previous[index];
      const upperLeft = index >= bytesPerPixel ? previous[index - bytesPerPixel] : 0;
      let predictor = 0;
      if (filter === 1) {
        predictor = left;
      } else if (filter === 2) {
        predictor = above;
      } else if (filter === 3) {
        predictor = Math.floor((left + above) / 2);
      } else if (filter === 4) {
        const estimate = left + above - upperLeft;
        const leftDistance = Math.abs(estimate - left);
        const aboveDistance = Math.abs(estimate - above);
        const upperLeftDistance = Math.abs(estimate - upperLeft);
        predictor = leftDistance <= aboveDistance && leftDistance <= upperLeftDistance
          ? left
          : aboveDistance <= upperLeftDistance ? above : upperLeft;
      }
      reconstructed[index] = (raw[index] + predictor) & 0xff;
    }
    const mask = (1 << bitDepth) - 1;
    for (let pixel = 0; pixel < width; pixel += 1) {
      const bitOffset = pixel * bitDepth;
      const byteOffset = Math.floor(bitOffset / 8);
      const shift = 8 - bitDepth - (bitOffset % 8);
      const paletteIndex = (reconstructed[byteOffset] >>> shift) & mask;
      if (paletteIndex >= paletteEntries) {
        throw new Error(`${label} PNG pixel index exceeds the PLTE palette`);
      }
    }
    [previous, reconstructed] = [reconstructed, previous];
  }
}

function validatePacket(condition, packet, context, contextBytes, promptBytes, expectedInventory) {
  assertExactKeys(packet, PACKET_KEYS, 'Packet JSON');
  if (packet.version !== 1
    || packet.condition !== condition
    || typeof packet.prompt_text !== 'string'
    || packet.context_sha256 !== sha256(contextBytes)
    || packet.context_sha256 !== expectedInventory.contextSha256
    || !Array.isArray(packet.images)) {
    throw new Error('Packet condition, context hash, prompt, or image inventory is invalid');
  }
  const expected = expectedPrompt(condition, context);
  if (packet.prompt_text !== expected
    || !promptBytes.equals(Buffer.from(expected, 'utf8'))) {
    throw new Error('Packet prompt serialization does not match frozen context rendering');
  }
  const expectedHashes = condition === STATE_CONDITION
    ? [context.current.image_sha256]
    : [...context.visual_history.map((entry) => entry.image_sha256), context.current.image_sha256];
  if (packet.images.length !== expectedHashes.length
    || expectedHashes.some((digest, index) => digest !== expectedInventory.orderedImageSha256[index])) {
    throw new Error('Packet image inventory differs from trusted expected inventory');
  }
  packet.images.forEach((entry, index) => {
    assertExactKeys(entry, IMAGE_KEYS, `Packet image ${index + 1}`);
    if (entry.attachment_ordinal !== index + 1 || entry.sha256 !== expectedHashes[index]) {
      throw new Error(`Packet image hash or attachment order mismatch at ${index + 1}`);
    }
  });
}

export async function auditPredictorSafeTree(options) {
  assertExactKeys(options, OPTION_KEYS, 'Leakage audit options');
  if (!CONDITIONS.includes(options.condition)) {
    throw new Error(`Leakage audit condition must be one frozen token: ${CONDITIONS.join(', ')}`);
  }
  if (typeof options.contextDirectory !== 'string'
    || !path.isAbsolute(options.contextDirectory)
    || typeof options.packetDirectory !== 'string'
    || !path.isAbsolute(options.packetDirectory)) {
    throw new Error('Leakage audit directories must be absolute paths');
  }
  const expectedInventory = validateExpectedInventory(options.expectedInventory, options.condition);
  const canaries = expectedInventory.canaries;
  const contextNames = options.condition === STATE_CONDITION
    ? ['context.json', 'current.png']
    : [
        'context.json', 'current.png',
        ...Array.from({ length: 10 }, (_, index) => `visual-${String(index + 1).padStart(3, '0')}.png`),
      ];
  const attachmentCount = options.condition === STATE_CONDITION ? 1 : 11;
  const packetNames = [
    'packet.json',
    'prompt.txt',
    ...Array.from({ length: attachmentCount }, (_, index) => `image-${String(index + 1).padStart(3, '0')}.png`),
  ];
  const seenInodes = new Set();
  const contextTree = await readExactTree(
    options.contextDirectory,
    contextNames,
    'Predictor-safe context tree',
    canaries,
    seenInodes,
  );
  const packetTree = await readExactTree(
    options.packetDirectory,
    packetNames,
    'Predictor-safe packet tree',
    canaries,
    seenInodes,
  );
  const contextFiles = contextTree.files;
  const packetFiles = packetTree.files;
  const contextBytes = contextFiles.get('context.json');
  const context = parseFrozenJson(contextBytes, 'Context JSON');
  checkForbiddenJsonKeys(
    context,
    'Context JSON',
    expectedInventory.forbiddenJsonKeys,
  );
  validateContext(options.condition, context);
  if (sha256(contextBytes) !== expectedInventory.contextSha256) {
    throw new Error('Context SHA-256 differs from trusted expected inventory');
  }
  const packet = parseFrozenJson(packetFiles.get('packet.json'), 'Packet JSON');
  checkForbiddenJsonKeys(
    packet,
    'Packet JSON',
    expectedInventory.forbiddenJsonKeys,
  );
  validatePacket(
    options.condition,
    packet,
    context,
    contextBytes,
    packetFiles.get('prompt.txt'),
    expectedInventory,
  );

  const contextImageNames = options.condition === STATE_CONDITION
    ? ['current.png']
    : [
        ...Array.from({ length: 10 }, (_, index) => `visual-${String(index + 1).padStart(3, '0')}.png`),
        'current.png',
      ];
  const expectedHashes = options.condition === STATE_CONDITION
    ? [context.current.image_sha256]
    : [...context.visual_history.map((entry) => entry.image_sha256), context.current.image_sha256];
  for (let index = 0; index < attachmentCount; index += 1) {
    const contextImage = contextFiles.get(contextImageNames[index]);
    const packetImage = packetFiles.get(`image-${String(index + 1).padStart(3, '0')}.png`);
    validatePng(contextImage, `Context image ${index + 1}`);
    validatePng(packetImage, `Packet image ${index + 1}`);
    if (sha256(contextImage) !== expectedHashes[index]
      || sha256(packetImage) !== expectedHashes[index]
      || expectedHashes[index] !== expectedInventory.orderedImageSha256[index]
      || !packetImage.equals(contextImage)) {
      throw new Error(`Packet/context image hash, order, or byte-copy mismatch at attachment ${index + 1}`);
    }
  }
  await revalidateTree(contextTree);
  await revalidateTree(packetTree);
  const finalContextDirectoryStat = await lstat(contextTree.directory, { bigint: true });
  const finalPacketDirectoryStat = await lstat(packetTree.directory, { bigint: true });
  if (!sameSnapshot(finalContextDirectoryStat, contextTree.snapshot.directory)
    || !sameSnapshot(finalPacketDirectoryStat, packetTree.snapshot.directory)) {
    throw new Error('Audited predictor-safe tree changed after snapshot revalidation');
  }
  return deepFreeze({
    ok: true,
    version: 1,
    condition: options.condition,
    files_checked: contextFiles.size + packetFiles.size,
  });
}
