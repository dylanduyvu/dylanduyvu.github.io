import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import {
  lstat,
  mkdtemp,
  open,
  readdir,
  rm,
} from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { validateVideoInventory } from './task4-validation.mjs';

const execFileAsync = promisify(execFile);
const VIDEO_NAME = /^compact_monitor_3_(\d+)\.mp4$/;
const PROBE_OPTIONS = Object.freeze({ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const NO_EVENT_RECORDINGS = new Set(['1785165009266', '1785165310520', '1785172925051']);
const CANONICAL_INTEGER = /^(?:0|-?[1-9]\d*)$/;

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function rational(numerator, denominator = 1n) {
  if (denominator === 0n) throw new Error('Rational denominator cannot be zero');
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}

function add(left, right) {
  return rational(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

function multiply(left, right) {
  return rational(left.numerator * right.numerator, left.denominator * right.denominator);
}

function compare(left, right) {
  const delta = left.numerator * right.denominator - right.numerator * left.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

function parseTimeBase(value) {
  const match = /^(-?\d+)\/(-?\d+)$/.exec(value);
  if (match === null) throw new Error(`Invalid stream time base: ${String(value)}`);
  return rational(BigInt(match[1]), BigInt(match[2]));
}

function isZeroStart(value) {
  return typeof value === 'string' && /^[-+]?0(?:\.0+)?$/.test(value);
}

function freezeDeep(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) freezeDeep(nested);
    Object.freeze(value);
  }
  return value;
}

function integerString(value, label) {
  if (typeof value !== 'string'
    || value.length > 33
    || !CANONICAL_INTEGER.test(value)) {
    throw new Error(`${label} must be a canonical integer string`);
  }
  return BigInt(value);
}

export function serializeVideoInventory(videoInventory) {
  if (videoInventory === null || typeof videoInventory !== 'object' || !Array.isArray(videoInventory.files)) {
    throw new TypeError('Video inventory must contain files');
  }
  validateVideoInventory(videoInventory);
  const output = structuredClone(videoInventory);
  for (const [fileIndex, file] of output.files.entries()) {
    for (const [key, value] of Object.entries(file.time_base ?? {})) {
      if (!['numerator', 'denominator'].includes(key) || typeof value !== 'bigint') {
        throw new Error(`Video time base is invalid at file ${fileIndex + 1}`);
      }
      file.time_base[key] = value.toString();
    }
    for (const [frameIndex, frame] of (file.frames ?? []).entries()) {
      for (const key of ['pts', 'best_effort_timestamp']) {
        if (typeof frame[key] !== 'bigint') {
          throw new Error(`Video frame integer is invalid at ${fileIndex + 1}/${frameIndex}`);
        }
        frame[key] = frame[key].toString();
      }
      for (const rationalKey of ['local_seconds', 'global_seconds']) {
        for (const [key, value] of Object.entries(frame[rationalKey] ?? {})) {
          if (!['numerator', 'denominator'].includes(key) || typeof value !== 'bigint') {
            throw new Error(`Video frame rational is invalid at ${fileIndex + 1}/${frameIndex}`);
          }
          frame[rationalKey][key] = value.toString();
        }
      }
    }
  }
  return freezeDeep(output);
}

export function reviveVideoInventory(serialized) {
  if (serialized === null || typeof serialized !== 'object' || !Array.isArray(serialized.files)) {
    throw new TypeError('Serialized video inventory must contain files');
  }
  const original = structuredClone(serialized);
  const output = structuredClone(serialized);
  for (const [fileIndex, file] of output.files.entries()) {
    for (const key of ['numerator', 'denominator']) {
      file.time_base[key] = integerString(
        file.time_base?.[key],
        `Serialized video time base ${fileIndex + 1}/${key}`,
      );
    }
    for (const [frameIndex, frame] of (file.frames ?? []).entries()) {
      for (const key of ['pts', 'best_effort_timestamp']) {
        frame[key] = integerString(
          frame[key],
          `Serialized video frame ${fileIndex + 1}/${frameIndex}/${key}`,
        );
      }
      for (const rationalKey of ['local_seconds', 'global_seconds']) {
        for (const key of ['numerator', 'denominator']) {
          frame[rationalKey][key] = integerString(
            frame[rationalKey]?.[key],
            `Serialized video frame ${fileIndex + 1}/${frameIndex}/${rationalKey}/${key}`,
          );
        }
      }
    }
  }
  if (JSON.stringify(serializeVideoInventory(output)) !== JSON.stringify(original)) {
    throw new Error('Serialized video inventory does not round-trip exactly');
  }
  validateVideoInventory(output);
  return freezeDeep(output);
}

async function snapshotRegularFile(absolutePath, snapshotPath) {
  const before = await lstat(absolutePath, { bigint: true });
  if (before.isSymbolicLink()) throw new Error(`Video chain contains symlink: ${absolutePath}`);
  if (!before.isFile()) throw new Error(`Video chain entry is not a regular file: ${absolutePath}`);
  if (before.nlink !== 1n) throw new Error(`Video chain entry has forbidden hardlink count: ${absolutePath}`);
  const handle = await open(absolutePath, constants.O_RDONLY | constants.O_NOFOLLOW);
  let snapshotHandle = null;
  try {
    const opened = await handle.stat({ bigint: true });
    if (!opened.isFile()
      || opened.nlink !== 1n
      || opened.dev !== before.dev
      || opened.ino !== before.ino) {
      throw new Error(`Video changed before source-lock snapshot: ${absolutePath}`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(absolutePath, { bigint: true });
    if (before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
      || after.nlink !== 1n
      || pathAfter.isSymbolicLink()
      || pathAfter.dev !== after.dev
      || pathAfter.ino !== after.ino
      || pathAfter.size !== after.size
      || pathAfter.mtimeNs !== after.mtimeNs
      || pathAfter.ctimeNs !== after.ctimeNs) {
      throw new Error(`Video changed while inventorying: ${absolutePath}`);
    }
    snapshotHandle = await open(
      snapshotPath,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    );
    await snapshotHandle.writeFile(bytes);
    await snapshotHandle.sync();
    const snapshotStat = await snapshotHandle.stat({ bigint: true });
    const snapshotPathStat = await lstat(snapshotPath, { bigint: true });
    if (!snapshotStat.isFile()
      || snapshotStat.nlink !== 1n
      || (snapshotStat.mode & 0o777n) !== 0o600n
      || snapshotPathStat.isSymbolicLink()
      || snapshotPathStat.dev !== snapshotStat.dev
      || snapshotPathStat.ino !== snapshotStat.ino) {
      throw new Error(`Private video probe snapshot is unsafe: ${absolutePath}`);
    }
    return {
      byte_length: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      sourceSnapshot: {
        dev: after.dev,
        ino: after.ino,
        size: after.size,
        mtimeNs: after.mtimeNs,
        ctimeNs: after.ctimeNs,
      },
      probeSnapshot: {
        dev: snapshotStat.dev,
        ino: snapshotStat.ino,
        size: snapshotStat.size,
        mtimeNs: snapshotStat.mtimeNs,
        ctimeNs: snapshotStat.ctimeNs,
      },
    };
  } finally {
    if (snapshotHandle !== null) await snapshotHandle.close();
    await handle.close();
  }
}

async function assertVideoUnchanged(absolutePath, snapshot) {
  const current = await lstat(absolutePath, { bigint: true });
  if (current.isSymbolicLink()
    || !current.isFile()
    || current.dev !== snapshot.dev
    || current.ino !== snapshot.ino
    || current.size !== snapshot.size
    || current.mtimeNs !== snapshot.mtimeNs
    || current.ctimeNs !== snapshot.ctimeNs) {
    throw new Error(`Video changed after source-lock hashing: ${absolutePath}`);
  }
}

async function assertProbeSnapshotUnchanged(snapshotPath, expected) {
  const snapshot = expected.probeSnapshot;
  const pathStat = await lstat(snapshotPath, { bigint: true });
  if (pathStat.isSymbolicLink()
    || !pathStat.isFile()
    || pathStat.nlink !== 1n
    || pathStat.dev !== snapshot.dev
    || pathStat.ino !== snapshot.ino
    || pathStat.size !== snapshot.size
    || pathStat.mtimeNs !== snapshot.mtimeNs
    || pathStat.ctimeNs !== snapshot.ctimeNs) {
    throw new Error(`Private video probe snapshot changed: ${snapshotPath}`);
  }
  const handle = await open(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    if (after.dev !== pathStat.dev
      || after.ino !== pathStat.ino
      || after.size !== pathStat.size
      || after.mtimeNs !== pathStat.mtimeNs
      || after.ctimeNs !== pathStat.ctimeNs
      || createHash('sha256').update(bytes).digest('hex') !== expected.sha256) {
      throw new Error(`Private video probe snapshot hash drift: ${snapshotPath}`);
    }
  } finally {
    await handle.close();
  }
}

async function probeVideo(probePath, recordingId, spawn, provenancePath = probePath) {
  const argv = [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,width,height,time_base,start_time',
    '-show_entries', 'frame=pts,best_effort_timestamp',
    '-show_frames',
    '-of', 'json',
    probePath,
  ];
  let result;
  try {
    result = await spawn('ffprobe', argv, PROBE_OPTIONS);
  } catch (error) {
    throw new Error(`ffprobe failed for ${provenancePath}`, { cause: error });
  }
  const stdout = typeof result?.stdout === 'string' ? result.stdout : Buffer.isBuffer(result?.stdout) ? result.stdout.toString('utf8') : null;
  if (stdout === null) throw new Error(`ffprobe returned invalid output for ${provenancePath}`);
  let probe;
  try {
    probe = JSON.parse(stdout);
  } catch (error) {
    throw new Error(`ffprobe returned invalid JSON for ${provenancePath}`, { cause: error });
  }
  if (!Array.isArray(probe.streams) || probe.streams.length !== 1) throw new Error(`Video must contain exactly one selected stream: ${provenancePath}`);
  const source = probe.streams[0];
  if (source.codec_name !== 'hevc' || source.width !== 1920 || source.height !== 1080 || !isZeroStart(source.start_time)) {
    throw new Error(`Video stream must be HEVC 1920x1080 starting at zero: ${provenancePath}`);
  }
  const timeBase = parseTimeBase(source.time_base);
  if (timeBase.numerator <= 0n) throw new Error(`Video stream time base must be positive: ${provenancePath}`);
  if (!Array.isArray(probe.frames)) throw new Error(`ffprobe frames are missing: ${provenancePath}`);

  let previous = null;
  const epoch = rational(BigInt(recordingId), 1000n);
  const frames = probe.frames.map((sourceFrame, decodeIndex) => {
    if (sourceFrame.pts === null || sourceFrame.pts === undefined || sourceFrame.best_effort_timestamp === null || sourceFrame.best_effort_timestamp === undefined) {
      throw new Error(`Frame PTS cannot be null: ${provenancePath}`);
    }
    let pts;
    let bestEffort;
    try {
      pts = BigInt(sourceFrame.pts);
      bestEffort = BigInt(sourceFrame.best_effort_timestamp);
    } catch (error) {
      throw new Error(`Frame PTS must be an integer: ${provenancePath}`, { cause: error });
    }
    if (pts !== bestEffort) throw new Error(`Frame PTS must equal best-effort timestamp: ${provenancePath}`);
    if (previous !== null && pts <= previous) throw new Error(`Frame PTS must be strictly monotonic: ${provenancePath}`);
    previous = pts;
    const local = multiply(rational(pts), timeBase);
    return {
      decode_index: decodeIndex,
      pts,
      best_effort_timestamp: bestEffort,
      local_seconds: local,
      global_seconds: add(epoch, local),
    };
  });
  for (let index = 1; index < frames.length; index += 1) {
    if (compare(frames[index - 1].global_seconds, frames[index].global_seconds) >= 0) {
      throw new Error(`Frame global PTS must be strictly monotonic: ${provenancePath}`);
    }
  }
  return {
    stream: {
      codec_name: source.codec_name,
      width: source.width,
      height: source.height,
      time_base: source.time_base,
      start_time: source.start_time,
    },
    time_base: timeBase,
    frames,
    probe_argv: [...argv.slice(0, -1), provenancePath],
  };
}

export async function inventoryVideoChain({
  root = '/Users/dylanvu/.screenpipe/data/data/2026-07-27',
  startRecordingId = '1785164400568',
  endpointRecordingId = '1785173529401',
  spawn = execFileAsync,
} = {}) {
  const absoluteRoot = path.resolve(root);
  if (!/^\d+$/.test(startRecordingId) || !/^\d+$/.test(endpointRecordingId) || BigInt(startRecordingId) > BigInt(endpointRecordingId)) {
    throw new Error('Invalid video-chain endpoints');
  }
  const entries = [];
  for (const dirent of await readdir(absoluteRoot, { withFileTypes: true })) {
    const match = VIDEO_NAME.exec(dirent.name);
    if (match === null) continue;
    const recordingId = match[1];
    if (BigInt(recordingId) < BigInt(startRecordingId) || BigInt(recordingId) > BigInt(endpointRecordingId)) continue;
    const absolutePath = path.join(absoluteRoot, dirent.name);
    const stat = await lstat(absolutePath);
    if (stat.isSymbolicLink() || dirent.isSymbolicLink()) throw new Error(`Video chain contains symlink: ${absolutePath}`);
    if (!stat.isFile() || !dirent.isFile()) throw new Error(`Video chain entry is not a regular file: ${absolutePath}`);
    entries.push({ recordingId, relativePath: dirent.name, absolutePath });
  }
  entries.sort((left, right) => left.relativePath < right.relativePath ? -1 : left.relativePath > right.relativePath ? 1 : 0);
  if (entries[0]?.recordingId !== startRecordingId || entries.at(-1)?.recordingId !== endpointRecordingId) {
    throw new Error('Video-chain endpoint is missing');
  }

  let versionResult;
  try {
    versionResult = await spawn('ffprobe', ['-version'], PROBE_OPTIONS);
  } catch (error) {
    throw new Error('Cannot capture ffprobe executable version', { cause: error });
  }
  const versionOutput = typeof versionResult?.stdout === 'string'
    ? versionResult.stdout
    : Buffer.isBuffer(versionResult?.stdout)
      ? versionResult.stdout.toString('utf8')
      : '';
  const ffprobeVersion = versionOutput.split(/\r?\n/u)[0]?.trim();
  if (typeof ffprobeVersion !== 'string' || !/^ffprobe version \S+/u.test(ffprobeVersion)) {
    throw new Error('ffprobe returned an invalid version string');
  }

  const snapshotRoot = await mkdtemp('/private/tmp/nap-v5-video-probe-');
  const files = [];
  try {
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const snapshotPath = path.join(snapshotRoot, entry.relativePath);
      const locked = await snapshotRegularFile(entry.absolutePath, snapshotPath);
      const probed = await probeVideo(
        snapshotPath,
        entry.recordingId,
        spawn,
        entry.absolutePath,
      );
      await assertProbeSnapshotUnchanged(snapshotPath, locked);
      await assertVideoUnchanged(entry.absolutePath, locked.sourceSnapshot);
      files.push({
        recording_id: entry.recordingId,
        relative_path: entry.relativePath,
        absolute_path: entry.absolutePath,
        byte_length: locked.byte_length,
        sha256: locked.sha256,
        predecessor_recording_id: index === 0 ? null : entries[index - 1].recordingId,
        stream: probed.stream,
        time_base: probed.time_base,
        frames: probed.frames,
        probe_argv: probed.probe_argv,
      });
    }
  } finally {
    await rm(snapshotRoot, { recursive: true, force: true });
  }

  return freezeDeep({
    root: absoluteRoot,
    start_recording_id: startRecordingId,
    endpoint_recording_id: endpointRecordingId,
    files,
    total_byte_length: files.reduce((sum, entry) => sum + entry.byte_length, 0),
    total_frame_count: files.reduce((sum, entry) => sum + entry.frames.length, 0),
    no_event_recording_ids: files.map((entry) => entry.recording_id).filter((id) => NO_EVENT_RECORDINGS.has(id)),
    tool_provenance: {
      executable: 'ffprobe',
      version: ffprobeVersion,
      version_argv: ['-version'],
      probe_argv: files.map((entry) => [...entry.probe_argv]),
    },
  });
}
