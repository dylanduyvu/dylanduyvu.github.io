import { execFile } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { link, lstat, mkdir, mkdtemp, open, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const SPAWN_OPTIONS = Object.freeze({ encoding: 'buffer', maxBuffer: 64 * 1024 * 1024, shell: false });
const CRITICAL_TYPES = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND']);

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function isAncillary(typeBytes) {
  return (typeBytes[0] & 0x20) !== 0;
}

function parseAndSanitizePng(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < PNG_SIGNATURE.length || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('Invalid PNG signature');
  }
  const kept = [PNG_SIGNATURE];
  let offset = 8;
  let state = 'before_ihdr';
  let width = null;
  let height = null;
  let idatCount = 0;
  let sawPlte = false;
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw new Error('Truncated PNG chunk');
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new Error('Truncated PNG chunk data');
    const typeBytes = bytes.subarray(offset + 4, offset + 8);
    const type = typeBytes.toString('ascii');
    if (!/^[A-Za-z]{4}$/.test(type)) throw new Error('Invalid PNG chunk type');
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    const expectedCrc = bytes.readUInt32BE(offset + 8 + length);
    if (crc32(Buffer.concat([typeBytes, data])) !== expectedCrc) throw new Error(`PNG CRC mismatch in ${type}`);
    const encoded = bytes.subarray(offset, end);

    if (state === 'before_ihdr') {
      if (type !== 'IHDR' || length !== 13) throw new Error('PNG IHDR must be first and length 13');
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (width === 0 || height === 0) throw new Error('PNG dimensions must be nonzero');
      kept.push(encoded);
      state = 'before_idat';
    } else if (type === 'IHDR') {
      throw new Error('PNG may contain only one IHDR');
    } else if (type === 'PLTE') {
      if (state !== 'before_idat' || sawPlte) throw new Error('PNG PLTE has invalid order');
      sawPlte = true;
      kept.push(encoded);
    } else if (type === 'IDAT') {
      if (state === 'after_idat') throw new Error('PNG IDAT chunks must be consecutive');
      state = 'in_idat';
      idatCount += 1;
      kept.push(encoded);
    } else if (type === 'IEND') {
      if (length !== 0 || idatCount === 0 || state === 'before_idat') throw new Error('PNG IEND has invalid order');
      kept.push(encoded);
      offset = end;
      if (offset !== bytes.length) throw new Error('PNG has trailing bytes after IEND');
      state = 'ended';
      break;
    } else if (!isAncillary(typeBytes)) {
      throw new Error(`Unknown critical PNG chunk: ${type}`);
    } else if (state === 'in_idat') {
      state = 'after_idat';
    }
    offset = end;
  }
  if (state !== 'ended') throw new Error('PNG is missing IEND');
  return { bytes: Buffer.concat(kept), width, height };
}

async function verifySource(sourcePath, expectedSha256) {
  const before = await lstat(sourcePath, { bigint: true });
  if (before.isSymbolicLink() || !before.isFile()) throw new Error('PNG source must be a regular non-symlink file');
  const bytes = await readFile(sourcePath);
  const after = await lstat(sourcePath, { bigint: true });
  if (after.isSymbolicLink() || !after.isFile() || before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeNs !== after.mtimeNs) {
    throw new Error('PNG source changed during verification');
  }
  if (createHash('sha256').update(bytes).digest('hex') !== expectedSha256) throw new Error('PNG source SHA-256 differs from locked source');
}

async function fsyncDirectory(directory) {
  const handle = await open(directory, 'r');
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function storeContent(runtimeRoot, sha256, bytes, { beforePublish } = {}) {
  const relativePath = `evaluator/evidence-store/sha256/${sha256.slice(0, 2)}/${sha256}.png`;
  const target = path.join(runtimeRoot, ...relativePath.split('/'));
  const directory = path.dirname(target);
  await mkdir(directory, { recursive: true });
  const temporary = path.join(directory, `.${sha256}.${process.pid}.${randomUUID()}.tmp`);
  let handle = null;
  let published = false;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = null;
    if (beforePublish !== undefined) {
      if (typeof beforePublish !== 'function') throw new TypeError('beforeStorePublish must be a function');
      await beforePublish({ temporary, target });
    }
    try {
      await link(temporary, target);
      published = true;
      await fsyncDirectory(directory);
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      const stat = await lstat(target);
      if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('Evidence-store target is not a regular file');
      const existing = await readFile(target);
      if (!existing.equals(bytes)) throw new Error('Evidence-store hash path contains different bytes');
    }
  } catch (error) {
    throw error;
  } finally {
    await handle?.close();
    try {
      await unlink(temporary);
      await fsyncDirectory(directory);
    } catch (error) {
      if (error?.code !== 'ENOENT' && !published) throw error;
    }
  }
  return relativePath;
}

async function performExtraction({
  sourcePath,
  decodeIndex,
  sourceSha256,
  width,
  height,
  runtimeRoot,
  spawn,
  beforeStorePublish,
}) {
  await verifySource(sourcePath, sourceSha256);
  let versionResult;
  try {
    versionResult = await spawn('ffmpeg', ['-version'], SPAWN_OPTIONS);
  } catch (error) {
    throw new Error('Cannot capture ffmpeg executable version', { cause: error });
  }
  const versionOutput = typeof versionResult?.stdout === 'string'
    ? versionResult.stdout
    : Buffer.isBuffer(versionResult?.stdout)
      ? versionResult.stdout.toString('utf8')
      : '';
  const ffmpegVersion = versionOutput.split(/\r?\n/u)[0]?.trim();
  if (typeof ffmpegVersion !== 'string' || !/^ffmpeg version \S+/u.test(ffmpegVersion)) {
    throw new Error('ffmpeg returned an invalid version string');
  }
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'nap-v5-png-evidence-'));
  try {
    const extractedPath = path.join(temporaryDirectory, 'extracted.png');
    const extractionArgv = [
      '-v', 'error',
      '-i', sourcePath,
      '-vf', `select=eq(n\\,${decodeIndex})`,
      '-fps_mode', 'passthrough',
      '-frames:v', '1',
      '-map_metadata', '-1',
      '-map_chapters', '-1',
      '-c:v', 'png',
      extractedPath,
    ];
    try {
      await spawn('ffmpeg', extractionArgv, SPAWN_OPTIONS);
    } catch (error) {
      throw new Error('ffmpeg indexed PNG extraction failed', { cause: error });
    }
    let extracted;
    try {
      extracted = await readFile(extractedPath);
    } catch (error) {
      throw new Error('ffmpeg did not produce a readable PNG', { cause: error });
    }
    const sanitized = parseAndSanitizePng(extracted);
    if (sanitized.width !== width || sanitized.height !== height) throw new Error('Extracted PNG dimensions do not equal source dimensions');

    const sanitizedPath = path.join(temporaryDirectory, 'sanitized.png');
    await writeFile(sanitizedPath, sanitized.bytes, { flag: 'wx', mode: 0o600 });
    const validationArgv = ['-v', 'error', '-i', sanitizedPath, '-f', 'null', '-'];
    try {
      await spawn('ffmpeg', validationArgv, SPAWN_OPTIONS);
    } catch (error) {
      throw new Error('Sanitized PNG failed ffmpeg decode verification', { cause: error });
    }
    await verifySource(sourcePath, sourceSha256);

    const pngSha256 = createHash('sha256').update(sanitized.bytes).digest('hex');
    const storeRelativePath = await storeContent(runtimeRoot, pngSha256, sanitized.bytes, { beforePublish: beforeStorePublish });
    return Object.freeze({
      source_path: sourcePath,
      locked_source_sha256: sourceSha256,
      decode_index: decodeIndex,
      png_sha256: pngSha256,
      store_relative_path: storeRelativePath,
      width,
      height,
      extraction_argv: Object.freeze([...extractionArgv]),
      validation_argv: Object.freeze([...validationArgv]),
      tool_provenance: Object.freeze({
        executable: 'ffmpeg',
        version: ffmpegVersion,
        version_argv: Object.freeze(['-version']),
        extraction_argv: Object.freeze([...extractionArgv]),
        validation_argv: Object.freeze([...validationArgv]),
      }),
    });
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

export async function extractMetadataFreePng({
  sourcePath,
  decodeIndex,
  sourceSha256,
  width,
  height,
  runtimeRoot,
  spawn = execFileAsync,
  dedup = new Map(),
  beforeStorePublish,
} = {}) {
  if (typeof sourcePath !== 'string' || !path.isAbsolute(sourcePath)) throw new TypeError('sourcePath must be absolute');
  if (!Number.isSafeInteger(decodeIndex) || decodeIndex < 0) throw new TypeError('decodeIndex must be a nonnegative safe integer');
  if (typeof sourceSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(sourceSha256)) throw new TypeError('sourceSha256 must be lowercase SHA-256');
  if (!Number.isSafeInteger(width) || width <= 0 || !Number.isSafeInteger(height) || height <= 0) throw new TypeError('Source dimensions must be positive integers');
  if (typeof runtimeRoot !== 'string' || !path.isAbsolute(runtimeRoot)) throw new TypeError('runtimeRoot must be absolute');
  if (typeof spawn !== 'function' || !(dedup instanceof Map)) throw new TypeError('spawn and dedup are invalid');
  const key = `${sourcePath}\0${decodeIndex}`;
  const existing = dedup.get(key);
  if (existing !== undefined) return existing;
  const pending = performExtraction({ sourcePath, decodeIndex, sourceSha256, width, height, runtimeRoot, spawn, beforeStorePublish });
  dedup.set(key, pending);
  try {
    return await pending;
  } catch (error) {
    dedup.delete(key);
    throw error;
  }
}
