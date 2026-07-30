import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import {
  lstat,
  mkdtemp,
  mkdir,
  open,
  readdir,
  realpath,
  rm,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  CANONICAL_CORPUS_SNAPSHOT_SHA256,
  CONDITIONS,
  METHOD,
} from '../config.mjs';
import { publishAtomicBundle } from './bundle-publisher.mjs';
import { buildEvaluatorManifest, buildTargetCatalog } from './catalog.mjs';
import { buildSanitizedContext, writeContextBundle } from './contexts.mjs';
import { compileCorpusSnapshot } from './corpus.mjs';
import {
  assertV5HasNoV4Imports,
  V4_AGGREGATE_SHA256,
  V4_DONOR_ROOT,
  V4_FILE_COUNT,
  V4_METHOD_LOCK_SHA256,
  validateDonorInventory,
} from './donor-guard.mjs';
import {
  buildEligibilityLedger,
  selectQuantileTargets,
  validateEvidenceDecisions,
} from './eligibility.mjs';
import { buildEvidenceInventory, renderEvidenceReview } from './evidence-review.mjs';
import { choosePriorFrame } from './frame-recovery.mjs';
import { targetGranularity } from './identity.mjs';
import { canonicalJson, sha256, writeImmutable } from './immutable.mjs';
import { auditPredictorSafeTree } from './leakage-audit.mjs';
import { renderFrozenPacket } from './packet-renderer.mjs';
import { extractMetadataFreePng } from './png-evidence.mjs';
import { buildSchedule } from './schedule.mjs';
import {
  artifactSha256,
  validateCanonicalCorpusSnapshot,
  validateEvidenceArtifact,
  validateVideoInventory,
} from './task4-validation.mjs';
import {
  inventoryVideoChain,
  reviveVideoInventory,
  serializeVideoInventory,
} from './video-index.mjs';

export const PREPARATION_COMMANDS = Object.freeze([
  'compile-corpus',
  'prepare-evidence',
  'freeze-evidence',
  'select-targets',
  'approve-catalog',
  'prepare-packets',
  'verify-prepared',
]);

const APPROVAL_BASIS = 'blanket_execution_authorization_2026-07-29';
const DEFAULT_VIDEO_ROOT = '/Users/dylanvu/.screenpipe/data/data/2026-07-27';
const DEFAULT_START_RECORDING_ID = '1785164400568';
const DEFAULT_ENDPOINT_RECORDING_ID = '1785173529401';
const PREPARED_INVENTORY_PATH = 'evaluator/prepared-inventory.json';
const FINAL_DISPOSITIONS = new Set([
  'usable',
  'missing',
  'stale_over_5s',
  'post_action_risk',
  'timing_unresolvable',
  'wrong_monitor',
  'corrupt_or_unreadable',
  'same_time_interval_unrecoverable',
]);
const FORBIDDEN_RUN_PATHS = [
  'locks',
  'evaluator-sealed',
  ['sealed', 'attempts'].join('-'),
  'blind',
  'revealed',
  'method-lock.json',
  'run-lock.json',
  'adjudication-key.bin',
  'all-slots-terminal.json',
];
const FORBIDDEN_JSON_KEYS = Object.freeze([
  'aliases',
  'approval_provenance',
  'accepted_variants',
  'chronology_index',
  'current_label',
  'evidence_decision',
  'evidence_disposition',
  'evidence_provenance',
  'event_id',
  'final_disposition',
  'future_label',
  'ground_truth_action_type',
  'ground_truth_input_method',
  'ground_truth_target',
  'outcome',
  'post_action_hash',
  'prediction',
  'recording_id',
  'review_provenance',
  'reviewer_note',
  'role',
  'slot_id',
  'source_filename',
  'source_path',
  'store_relative_path',
  'target_id',
]);
const PREPARED_ROOT_ZONES = new Set(['evaluator', 'contexts', 'packets']);
const AUTHENTICATED_EVALUATOR_DOWNSTREAM = new Set(['receipts', 'sealed-join']);

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function jsonSafe(value) {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, jsonSafe(child)]));
  }
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  throw new TypeError(`Artifact contains a non-JSON value: ${typeof value}`);
}

function jsonBytes(value) {
  return Buffer.from(canonicalJson(jsonSafe(value)));
}

function relativeTarget(root, relativePath) {
  return path.join(root, ...relativePath.split('/'));
}

async function optionalLstat(filename) {
  try {
    return await lstat(filename);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function sameStat(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

function sameNodeStat(left, right) {
  return sameStat(left, right)
    && left.mode === right.mode
    && left.nlink === right.nlink;
}

function sameNodeIdentity(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.mode === right.mode
    && left.nlink === right.nlink;
}

function sameFilesystemObject(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

async function readRegular(filename, label, { requireMode = true } = {}) {
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isFile()) {
    throw new Error(`${label} must be a secure regular non-symlink file`);
  }
  if (pathStat.nlink !== 1n) throw new Error(`${label} must have exclusive link count 1`);
  if (requireMode && (pathStat.mode & 0o777n) !== 0o600n) {
    throw new Error(`${label} mode must be 0600`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || !sameStat(before, pathStat)) throw new Error(`${label} changed before read`);
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(filename, { bigint: true });
    if (!sameStat(before, after)
      || pathAfter.isSymbolicLink()
      || pathAfter.nlink !== 1n
      || !sameStat(after, pathAfter)
      || (requireMode && (pathAfter.mode & 0o777n) !== 0o600n)) {
      throw new Error(`${label} changed during read`);
    }
    return { bytes, stat: after };
  } finally {
    await handle.close();
  }
}

function parseJson(bytes, label, { requireCanonical = true } = {}) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${label} must be valid UTF-8 JSON`);
  }
  if (text.includes('\r') || !text.endsWith('\n') || text.endsWith('\n\n')) {
    throw new Error(`${label} must use LF and exactly one trailing newline`);
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }
  if (requireCanonical && !Buffer.from(canonicalJson(value)).equals(Buffer.from(text))) {
    throw new Error(`${label} bytes differ from canonical JSON serialization`);
  }
  return value;
}

async function readJson(root, relativePath, label = relativePath) {
  const { bytes } = await readRegular(relativeTarget(root, relativePath), label);
  return parseJson(bytes, label);
}

async function writeJson(root, relativePath, value) {
  await writeImmutable(relativeTarget(root, relativePath), jsonBytes(value));
}

async function requireArtifact(root, relativePath, label = relativePath) {
  const stat = await optionalLstat(relativeTarget(root, relativePath));
  if (stat === null || stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`Missing authenticated prerequisite ${label}: ${relativePath}`);
  }
}

function normalizeIo(io = {}) {
  if (!isPlainObject(io)) throw new TypeError('Preparation I/O configuration must be a plain object');
  const allowed = new Set([
    'videoRoot',
    'startRecordingId',
    'endpointRecordingId',
    'ffprobeSpawn',
    'ffmpegSpawn',
  ]);
  for (const key of Object.keys(io)) {
    if (!allowed.has(key)) throw new Error(`Unknown preparation I/O option: ${key}`);
  }
  const output = {
    videoRoot: io.videoRoot ?? DEFAULT_VIDEO_ROOT,
    startRecordingId: io.startRecordingId ?? DEFAULT_START_RECORDING_ID,
    endpointRecordingId: io.endpointRecordingId ?? DEFAULT_ENDPOINT_RECORDING_ID,
  };
  if (typeof output.videoRoot !== 'string' || !path.isAbsolute(output.videoRoot)) {
    throw new Error('videoRoot must be an absolute path');
  }
  if (!/^\d+$/.test(output.startRecordingId) || !/^\d+$/.test(output.endpointRecordingId)) {
    throw new Error('Video recording endpoints must be digit strings');
  }
  if (io.ffprobeSpawn !== undefined) {
    if (typeof io.ffprobeSpawn !== 'function') throw new TypeError('ffprobeSpawn must be a process adapter');
    output.ffprobeSpawn = io.ffprobeSpawn;
  }
  if (io.ffmpegSpawn !== undefined) {
    if (typeof io.ffmpegSpawn !== 'function') throw new TypeError('ffmpegSpawn must be a process adapter');
    output.ffmpegSpawn = io.ffmpegSpawn;
  }
  return output;
}

function assertRoot(root) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new Error('Preparation root must be an absolute path');
  }
}

function isForbiddenPath(relativePath) {
  const components = relativePath.split('/');
  return FORBIDDEN_RUN_PATHS.some((forbidden) => {
    const forbiddenComponents = forbidden.split('/');
    return components.some((_, start) => (
      forbiddenComponents.every((component, index) => components[start + index] === component)
    ));
  });
}

async function assertNoForbiddenRunArtifacts(root) {
  const rootStat = await optionalLstat(root);
  if (rootStat === null) return;
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error('Preparation root must be a secure non-symlink directory');
  }
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      const relativePath = path.relative(root, target).split(path.sep).join('/');
      if (isForbiddenPath(relativePath)) {
        throw new Error(`Preparation refuses nested run/adjudication artifact: ${relativePath}`);
      }
      const stat = await lstat(target);
      if (stat.isSymbolicLink()) {
        throw new Error(`Preparation root contains a symlink: ${relativePath}`);
      }
      if (stat.isDirectory()) {
        await walk(target);
      } else if (!stat.isFile()) {
        throw new Error(`Preparation root contains a special entry: ${relativePath}`);
      }
    }
  }
  await walk(root);
}

function sortedEntryNames(entries) {
  return entries.map((entry) => entry.name).sort();
}

function preparedRelativePath(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

async function openPinnedPreparedDirectory(absolutePath, relativePath) {
  const pathStat = await lstat(absolutePath, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isDirectory()) {
    throw new Error(`Prepared tree directory is unsafe: ${relativePath || '.'}`);
  }
  const handle = await open(
    absolutePath,
    constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW,
  );
  try {
    const opened = await handle.stat({ bigint: true });
    const pathAfter = await lstat(absolutePath, { bigint: true });
    if (!opened.isDirectory()
      || pathAfter.isSymbolicLink()
      || !pathAfter.isDirectory()
      || !sameNodeStat(pathStat, opened)
      || !sameNodeStat(opened, pathAfter)) {
      throw new Error(`Prepared tree directory identity changed: ${relativePath || '.'}`);
    }
    return { handle, stat: opened };
  } catch (error) {
    await handle.close();
    throw error;
  }
}

async function ensurePrivateSnapshotDirectory(snapshotRoot, relativePath) {
  const directory = relativePath === ''
    ? snapshotRoot
    : relativeTarget(snapshotRoot, relativePath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const stat = await lstat(directory, { bigint: true });
  if (stat.isSymbolicLink()
    || !stat.isDirectory()
    || (stat.mode & 0o777n) !== 0o700n) {
    throw new Error(`Private prepared audit snapshot directory is unsafe: ${relativePath || '.'}`);
  }
  return directory;
}

async function writePrivateSnapshotFile(snapshotRoot, relativePath, bytes) {
  const target = relativeTarget(snapshotRoot, relativePath);
  await ensurePrivateSnapshotDirectory(
    snapshotRoot,
    path.posix.dirname(relativePath) === '.' ? '' : path.posix.dirname(relativePath),
  );
  const handle = await open(
    target,
    constants.O_WRONLY
      | constants.O_CREAT
      | constants.O_EXCL
      | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    await handle.writeFile(bytes);
    await handle.sync();
    const stat = await handle.stat({ bigint: true });
    const pathStat = await lstat(target, { bigint: true });
    if (!stat.isFile()
      || stat.nlink !== 1n
      || (stat.mode & 0o777n) !== 0o600n
      || pathStat.isSymbolicLink()
      || !sameNodeStat(stat, pathStat)
      || stat.size !== BigInt(bytes.length)) {
      throw new Error(`Private prepared audit snapshot file is unsafe: ${relativePath}`);
    }
  } finally {
    await handle.close();
  }
}

function preparedZoneEntries(entries, relativePath, downstreamAuthenticated) {
  if (!downstreamAuthenticated) return entries;
  if (relativePath === '') {
    return entries.filter((entry) => PREPARED_ROOT_ZONES.has(entry.name));
  }
  if (relativePath === 'evaluator') {
    return entries.filter(
      (entry) => !AUTHENTICATED_EVALUATOR_DOWNSTREAM.has(entry.name),
    );
  }
  return entries;
}

async function capturePreparedTree(root, { downstreamAuthenticated = false } = {}) {
  const directories = new Map();
  const files = new Map();
  const handles = [];
  const snapshotRoot = await mkdtemp(path.join(os.tmpdir(), 'nap-v5-prepared-audit-'));

  async function walk(absolutePath, relativePath, pinned) {
    handles.push(pinned.handle);
    const before = await pinned.handle.stat({ bigint: true });
    if (!before.isDirectory() || !sameNodeStat(before, pinned.stat)) {
      throw new Error(`Prepared tree directory changed before enumeration: ${relativePath || '.'}`);
    }
    const entries = preparedZoneEntries(
      await readdir(absolutePath, { withFileTypes: true }),
      relativePath,
      downstreamAuthenticated,
    );
    const names = sortedEntryNames(entries);
    await ensurePrivateSnapshotDirectory(snapshotRoot, relativePath);
    directories.set(relativePath, {
      absolutePath,
      relativePath,
      handle: pinned.handle,
      stat: pinned.stat,
      names,
    });
    for (const entry of [...entries].sort((left, right) => left.name.localeCompare(right.name))) {
      const target = path.join(absolutePath, entry.name);
      const childRelativePath = preparedRelativePath(root, target);
      if (entry.name === '.nap-v5-immutable-staging') {
        throw new Error('Prepared tree contains unfinished immutable staging state');
      }
      if (isForbiddenPath(childRelativePath)) {
        throw new Error(`Forbidden prepared artifact: ${childRelativePath}`);
      }
      const pathStat = await lstat(target, { bigint: true });
      if (pathStat.isSymbolicLink()) {
        throw new Error(`Prepared tree contains symlink: ${childRelativePath}`);
      }
      if (pathStat.isDirectory()) {
        const child = await openPinnedPreparedDirectory(target, childRelativePath);
        await walk(target, childRelativePath, child);
        continue;
      }
      if (!pathStat.isFile()) {
        throw new Error(`Prepared tree contains a special file: ${childRelativePath}`);
      }
      const { bytes, stat } = await readRegular(
        target,
        `Prepared artifact ${childRelativePath}`,
      );
      if (!sameNodeStat(pathStat, stat)) {
        throw new Error(`Prepared artifact identity changed: ${childRelativePath}`);
      }
      await writePrivateSnapshotFile(snapshotRoot, childRelativePath, bytes);
      files.set(childRelativePath, {
        absolutePath: target,
        relativePath: childRelativePath,
        stat,
        byteLength: bytes.length,
        sha256: sha256(bytes),
      });
    }

    const after = await pinned.handle.stat({ bigint: true });
    const pathAfter = await lstat(absolutePath, { bigint: true });
    const finalNames = sortedEntryNames(preparedZoneEntries(
      await readdir(absolutePath, { withFileTypes: true }),
      relativePath,
      downstreamAuthenticated,
    ));
    if (!sameNodeStat(pinned.stat, after)
      || pathAfter.isSymbolicLink()
      || !pathAfter.isDirectory()
      || !sameNodeStat(after, pathAfter)
      || canonicalJson(names) !== canonicalJson(finalNames)) {
      throw new Error(`Prepared tree directory changed during enumeration: ${relativePath || '.'}`);
    }
  }

  try {
    const rootPinned = await openPinnedPreparedDirectory(root, '');
    await walk(root, '', rootPinned);
    return {
      root,
      snapshotRoot,
      directories,
      files,
      handles,
      downstreamAuthenticated,
    };
  } catch (error) {
    await Promise.allSettled(handles.map((handle) => handle.close()));
    await rm(snapshotRoot, { recursive: true, force: true });
    throw error;
  }
}

async function closePreparedTree(tree) {
  await Promise.allSettled(tree.handles.map((handle) => handle.close()));
  await rm(tree.snapshotRoot, { recursive: true, force: true });
}

async function revalidatePreparedTree(tree) {
  for (const directory of tree.directories.values()) {
    const handleStat = await directory.handle.stat({ bigint: true });
    const pathStat = await lstat(directory.absolutePath, { bigint: true });
    const names = sortedEntryNames(preparedZoneEntries(
      await readdir(directory.absolutePath, { withFileTypes: true }),
      directory.relativePath,
      tree.downstreamAuthenticated,
    ));
    if (!sameNodeStat(directory.stat, handleStat)
      || pathStat.isSymbolicLink()
      || !pathStat.isDirectory()
      || !sameNodeStat(handleStat, pathStat)
      || canonicalJson(directory.names) !== canonicalJson(names)) {
      throw new Error(`Prepared tree directory identity changed: ${directory.relativePath || '.'}`);
    }
  }
  for (const file of tree.files.values()) {
    const { bytes, stat } = await readRegular(
      file.absolutePath,
      `Prepared artifact ${file.relativePath}`,
    );
    if (!sameNodeStat(file.stat, stat)
      || bytes.length !== file.byteLength
      || sha256(bytes) !== file.sha256) {
      throw new Error(`Prepared tree file changed after snapshot: ${file.relativePath}`);
    }
  }
}

async function revalidatePrivateAuditSnapshot(tree) {
  for (const directory of tree.directories.values()) {
    const snapshotDirectory = directory.relativePath === ''
      ? tree.snapshotRoot
      : relativeTarget(tree.snapshotRoot, directory.relativePath);
    const stat = await lstat(snapshotDirectory);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(
        `Private prepared audit snapshot directory changed: ${directory.relativePath || '.'}`,
      );
    }
    const names = sortedEntryNames(
      await readdir(snapshotDirectory, { withFileTypes: true }),
    );
    if (canonicalJson(names) !== canonicalJson(directory.names)) {
      throw new Error(
        `Private prepared audit snapshot directory entries changed: ${directory.relativePath || '.'}`,
      );
    }
  }
  for (const file of tree.files.values()) {
    const snapshotPath = relativeTarget(tree.snapshotRoot, file.relativePath);
    const { bytes } = await readRegular(
      snapshotPath,
      `Private prepared audit snapshot ${file.relativePath}`,
    );
    if (bytes.length !== file.byteLength || sha256(bytes) !== file.sha256) {
      throw new Error(
        `Private prepared audit snapshot bytes changed: ${file.relativePath}`,
      );
    }
  }
}

async function revalidatePublishedPreparedTree(tree, inventory) {
  for (const directory of tree.directories.values()) {
    const handleStat = await directory.handle.stat({ bigint: true });
    const pathStat = await lstat(directory.absolutePath, { bigint: true });
    const names = sortedEntryNames(preparedZoneEntries(
      await readdir(directory.absolutePath, { withFileTypes: true }),
      directory.relativePath,
      tree.downstreamAuthenticated,
    ));
    if (directory.relativePath === 'evaluator') {
      const expectedNames = [...new Set([
        ...directory.names,
        path.posix.basename(PREPARED_INVENTORY_PATH),
      ])].sort();
      if (!handleStat.isDirectory()
        || pathStat.isSymbolicLink()
        || !pathStat.isDirectory()
        || !sameFilesystemObject(directory.stat, handleStat)
        || !sameNodeIdentity(handleStat, pathStat)
        || canonicalJson(expectedNames) !== canonicalJson(names)) {
        const expectedSet = new Set(expectedNames);
        const actualSet = new Set(names);
        const unexpected = names.find((name) => !expectedSet.has(name));
        const missing = expectedNames.find((name) => !actualSet.has(name));
        throw new Error(
          'Prepared evaluator directory changed during inventory publication'
          + `; initial_identity=${sameFilesystemObject(directory.stat, handleStat)}`
          + `; path_identity=${sameNodeIdentity(handleStat, pathStat)}`
          + `${unexpected === undefined ? '' : `; unexpected=${unexpected}`}`
          + `${missing === undefined ? '' : `; missing=${missing}`}`,
        );
      }
      continue;
    }
    if (!sameNodeStat(directory.stat, handleStat)
      || pathStat.isSymbolicLink()
      || !pathStat.isDirectory()
      || !sameNodeStat(handleStat, pathStat)
      || canonicalJson(directory.names) !== canonicalJson(names)) {
      throw new Error(`Prepared tree directory changed during inventory publication: ${directory.relativePath || '.'}`);
    }
  }
  for (const file of tree.files.values()) {
    const { bytes, stat } = await readRegular(
      file.absolutePath,
      `Prepared artifact ${file.relativePath}`,
    );
    if (!sameNodeStat(file.stat, stat)
      || bytes.length !== file.byteLength
      || sha256(bytes) !== file.sha256) {
      throw new Error(`Prepared tree file changed during inventory publication: ${file.relativePath}`);
    }
  }
  const expectedBytes = jsonBytes(inventory);
  const { bytes: publishedBytes } = await readRegular(
    relativeTarget(tree.root, PREPARED_INVENTORY_PATH),
    'Published prepared inventory',
  );
  if (!publishedBytes.equals(expectedBytes)) {
    throw new Error('Published prepared inventory bytes differ from the final tree snapshot');
  }
}

async function pinPreparationRoot(root) {
  return openPinnedPreparedDirectory(root, '');
}

async function revalidatePreparationRoot(root, pinned) {
  const handleStat = await pinned.handle.stat({ bigint: true });
  const pathStat = await lstat(root, { bigint: true });
  if (!sameNodeStat(pinned.stat, handleStat)
    || pathStat.isSymbolicLink()
    || !pathStat.isDirectory()
    || !sameNodeStat(handleStat, pathStat)) {
    throw new Error('Preparation root directory identity changed or was replaced');
  }
}

async function loadCorpus(root) {
  await requireArtifact(root, 'evaluator/corpus-snapshot.json', 'canonical corpus');
  const stored = await readJson(root, 'evaluator/corpus-snapshot.json', 'Canonical corpus snapshot');
  validateCanonicalCorpusSnapshot(stored);
  const rebuilt = await compileCorpusSnapshot();
  validateCanonicalCorpusSnapshot(rebuilt);
  if (canonicalJson(stored) !== canonicalJson(rebuilt)) {
    throw new Error('Canonical corpus snapshot differs from a fresh compilation');
  }
  return rebuilt;
}

async function loadRequiredDonorInventory(root) {
  const relativePath = 'evaluator/v4-donor-inventory.json';
  if (await optionalLstat(relativeTarget(root, relativePath)) === null) {
    throw new Error(`Missing authenticated prerequisite V4 donor inventory: ${relativePath}`);
  }
  const { bytes } = await readRegular(
    relativeTarget(root, relativePath),
    'Frozen V4 donor inventory',
  );
  const inventory = parseJson(
    bytes,
    'Frozen V4 donor inventory',
    { requireCanonical: false },
  );
  const methodLock = inventory.files?.find((file) => file.path === 'method-lock.json');
  if (inventory.root !== V4_DONOR_ROOT
    || inventory.files?.length !== V4_FILE_COUNT
    || inventory.aggregate_sha256 !== V4_AGGREGATE_SHA256
    || methodLock?.sha256 !== V4_METHOD_LOCK_SHA256) {
    throw new Error('Frozen V4 donor inventory does not match the configured donor authority');
  }
  await assertV5HasNoV4Imports();
  const rebuilt = await validateDonorInventory(V4_DONOR_ROOT, inventory);
  if (!bytes.equals(Buffer.from(`${JSON.stringify(rebuilt, null, 2)}\n`))) {
    throw new Error('Frozen V4 donor inventory bytes differ from its authenticated reconstruction');
  }
  return inventory;
}

async function hashSourceFile(filename, label) {
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isFile() || pathStat.nlink !== 1n) {
    throw new Error(`${label} must be a regular non-symlink source file`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  const digest = createHash('sha256');
  let position = 0;
  try {
    const before = await handle.stat({ bigint: true });
    if (!sameStat(before, pathStat)) throw new Error(`${label} changed before hashing`);
    const chunk = Buffer.allocUnsafe(1024 * 1024);
    while (true) {
      const { bytesRead } = await handle.read(chunk, 0, chunk.length, position);
      if (bytesRead === 0) break;
      digest.update(chunk.subarray(0, bytesRead));
      position += bytesRead;
    }
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(filename, { bigint: true });
    if (!sameStat(before, after) || pathAfter.isSymbolicLink() || !sameStat(after, pathAfter)) {
      throw new Error(`${label} changed during hashing`);
    }
    if (after.size > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label} is too large`);
    return { byteLength: Number(after.size), sha256: digest.digest('hex') };
  } finally {
    await handle.close();
  }
}

function buildFrameIndex(videoInventory) {
  return {
    version: 1,
    video_inventory_sha256: artifactSha256(jsonSafe(videoInventory)),
    files: videoInventory.files.map((file) => ({
      recording_id: file.recording_id,
      predecessor_recording_id: file.predecessor_recording_id,
      frame_count: file.frames.length,
      time_base: jsonSafe(file.time_base),
      first_global_pts: file.frames.length === 0 ? null : jsonSafe(file.frames[0].global_seconds),
      last_global_pts: file.frames.length === 0 ? null : jsonSafe(file.frames.at(-1).global_seconds),
    })),
  };
}

async function authenticateVideoSources(videoInventory) {
  validateVideoInventory(videoInventory);
  for (const file of videoInventory.files) {
    const locked = await hashSourceFile(file.absolute_path, `Locked video source ${file.recording_id}`);
    if (locked.byteLength !== file.byte_length || locked.sha256 !== file.sha256) {
      throw new Error(`Locked source video hash or byte-length drift: ${file.recording_id}`);
    }
  }
}

async function loadVideo(root, io, { repairFrameIndex = false } = {}) {
  await requireArtifact(root, 'evaluator/video-inventory.json', 'video inventory');
  const raw = await readJson(root, 'evaluator/video-inventory.json', 'Video inventory');
  const video = reviveVideoInventory(raw);
  if (canonicalJson(raw) !== canonicalJson(serializeVideoInventory(video))) {
    throw new Error('Serialized video inventory differs after exact schema revival');
  }
  await authenticateVideoSources(video);
  const rebuilt = await inventoryVideoChain({
    root: io.videoRoot,
    startRecordingId: io.startRecordingId,
    endpointRecordingId: io.endpointRecordingId,
    ...(io.ffprobeSpawn === undefined ? {} : { spawn: io.ffprobeSpawn }),
  });
  validateVideoInventory(rebuilt);
  if (canonicalJson(serializeVideoInventory(video)) !== canonicalJson(serializeVideoInventory(rebuilt))) {
    throw new Error('Video inventory differs from a fresh source-chain reconstruction');
  }
  const expectedFrameIndex = buildFrameIndex(video);
  const frameIndexStat = await optionalLstat(relativeTarget(root, 'evaluator/frame-index.json'));
  if (frameIndexStat === null) {
    if (!repairFrameIndex) throw new Error('Missing authenticated prerequisite frame index');
    await writeJson(root, 'evaluator/frame-index.json', expectedFrameIndex);
  } else {
    const frameIndex = await readJson(root, 'evaluator/frame-index.json', 'Frame index');
    if (canonicalJson(frameIndex) !== canonicalJson(expectedFrameIndex)) {
      throw new Error('Frame index differs from the authenticated video inventory');
    }
  }
  return video;
}

function requiredStrictlyPriorRows(corpusRows) {
  const priorIntervals = new Set();
  const rows = [];
  for (const row of corpusRows) {
    let firstInInterval = false;
    if (row.parsed_time?.kind === 'exact') {
      const key = `${row.recording_id}\0${row.parsed_time.seconds}`;
      firstInInterval = !priorIntervals.has(key);
      priorIntervals.add(key);
    }
    if (row.canonical_status === 'accepted'
      && row.history_value === 'yes'
      && row.parsed_time?.kind === 'exact'
      && firstInInterval) {
      rows.push(row);
    }
  }
  return rows;
}

function multiplyRational(value, multiplier) {
  return {
    numerator: BigInt(value.numerator) * BigInt(multiplier),
    denominator: BigInt(value.denominator),
  };
}

async function prepareEvidenceFromVideo(root, corpus, video, io) {
  const dedup = new Map();
  const prepared = [];
  for (const row of requiredStrictlyPriorRows(corpus.rows)) {
    const recovery = choosePriorFrame(row, video, { corpusRows: corpus.rows });
    if (recovery.mode !== 'ordinary') {
      throw new Error(`Unexpected recovery mode for strictly-prior row ${row.event_id}`);
    }
    if (recovery.selected_frame === null) {
      prepared.push({
        event_id: row.event_id,
        searched_recording_ids: [...recovery.searched_recording_ids],
        selected_frame: null,
      });
      continue;
    }
    const frame = recovery.selected_frame;
    const extraction = await extractMetadataFreePng({
      sourcePath: frame.source_path,
      decodeIndex: frame.decode_index,
      sourceSha256: frame.locked_source_sha256,
      width: frame.width,
      height: frame.height,
      runtimeRoot: root,
      ...(io.ffmpegSpawn === undefined ? {} : { spawn: io.ffmpegSpawn }),
      dedup,
    });
    const png = await readRegular(
      relativeTarget(root, extraction.store_relative_path),
      `Extracted evidence PNG ${row.event_id}`,
    );
    const ageMilliseconds = multiplyRational(frame.age_seconds, 1000n);
    prepared.push({
      event_id: row.event_id,
      searched_recording_ids: [...recovery.searched_recording_ids],
      selected_frame: {
        recording_id: frame.recording_id,
        locked_source_sha256: frame.locked_source_sha256,
        decode_index: frame.decode_index,
        local_pts: frame.local_seconds,
        global_pts: frame.global_seconds,
        age_milliseconds: ageMilliseconds,
        png_sha256: extraction.png_sha256,
        store_relative_path: extraction.store_relative_path,
        width: extraction.width,
        height: extraction.height,
      },
      selected_png_bytes: png.bytes,
      tool_provenance: extraction.tool_provenance,
      automated_checks: {
        decodes_successfully: true,
        monitor_is_3: true,
        timestamp_at_or_before_anchor: true,
        age_at_most_5s: ageMilliseconds.numerator <= 5_000n * ageMilliseconds.denominator,
        dimensions_match: true,
        sha256_matches: true,
      },
    });
  }
  return prepared;
}

async function preparedEvidenceFromDraft(root, corpus, draft) {
  const ffmpeg = new Map(
    draft.provenance.inputs.ffmpeg.map(({ event_id: eventId, ...tool }) => [eventId, tool]),
  );
  const prepared = [];
  for (const corpusRow of requiredStrictlyPriorRows(corpus.rows)) {
    const row = draft.rows[corpusRow.chronology_index - 1];
    if (row?.event_id !== corpusRow.event_id || row.mode !== 'strictly_prior') {
      throw new Error(`Evidence review inventory strictly-prior join differs at ${corpusRow.event_id}`);
    }
    if (row.selected_frame === null) {
      prepared.push({
        event_id: row.event_id,
        searched_recording_ids: [...row.searched_recording_ids],
        selected_frame: null,
      });
      continue;
    }
    const tool = ffmpeg.get(row.event_id);
    if (tool === undefined) throw new Error(`Evidence review inventory lacks extraction provenance for ${row.event_id}`);
    const png = await readRegular(
      relativeTarget(root, row.selected_frame.store_relative_path),
      `Evidence-store PNG ${row.event_id}`,
    );
    if (sha256(png.bytes) !== row.selected_frame.png_sha256) {
      throw new Error(`Evidence-store PNG hash drift for ${row.event_id}`);
    }
    prepared.push({
      event_id: row.event_id,
      searched_recording_ids: [...row.searched_recording_ids],
      selected_frame: structuredClone(row.selected_frame),
      selected_png_bytes: png.bytes,
      tool_provenance: tool,
      automated_checks: structuredClone(row.automated_checks),
    });
  }
  return prepared;
}

async function exactEvidenceStore(root, evidenceInventory) {
  const expected = new Set(
    evidenceInventory.rows
      .filter((row) => row.selected_frame !== null)
      .map((row) => row.selected_frame.store_relative_path),
  );
  const storeRoot = relativeTarget(root, 'evaluator/evidence-store');
  const actual = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      const stat = await lstat(target);
      if (stat.isSymbolicLink()) throw new Error(`Evidence store contains symlink: ${target}`);
      if (stat.isDirectory()) await walk(target);
      else if (stat.isFile()) actual.push(path.relative(root, target).split(path.sep).join('/'));
      else throw new Error(`Evidence store contains a special file: ${target}`);
    }
  }
  if (expected.size === 0) {
    if (await optionalLstat(storeRoot) !== null) await walk(storeRoot);
  } else {
    await walk(storeRoot);
  }
  actual.sort();
  const expectedPaths = [...expected].sort();
  if (canonicalJson(actual) !== canonicalJson(expectedPaths)) {
    throw new Error('Evidence store file set differs from the authenticated evidence inventory');
  }
}

async function loadEvidenceDraft(root, corpus, video, { repairReviewDocument = false } = {}) {
  await requireArtifact(root, 'evaluator/evidence-review-inventory.json', 'evidence review inventory');
  const draft = await readJson(root, 'evaluator/evidence-review-inventory.json', 'Evidence review inventory');
  const prepared = await preparedEvidenceFromDraft(root, corpus, draft);
  const rebuilt = buildEvidenceInventory({
    corpusRows: corpus.rows,
    preparedEvidence: prepared,
    videoInventory: video,
  });
  if (canonicalJson(draft) !== canonicalJson(rebuilt)) {
    throw new Error('Evidence review inventory differs from source-bound reconstruction');
  }
  const expectedReview = Buffer.from(renderEvidenceReview(rebuilt));
  const reviewPath = relativeTarget(root, 'evaluator/evidence-review.md');
  const reviewStat = await optionalLstat(reviewPath);
  if (reviewStat === null) {
    if (!repairReviewDocument) {
      throw new Error('Missing authenticated prerequisite evidence review document');
    }
    await writeImmutable(reviewPath, expectedReview);
  } else {
    const review = await readRegular(reviewPath, 'Evidence review document');
    if (!review.bytes.equals(expectedReview)) {
      throw new Error('Evidence review document differs from its authenticated inventory');
    }
  }
  await exactEvidenceStore(root, draft);
  return { draft, prepared };
}

function validateSimpleDecisions(decisions, corpus, draft) {
  if (!isPlainObject(decisions)
    || Object.keys(decisions).sort().join(',')
      !== 'decisions,inventory_sha256,review_provenance,version'
    || decisions.version !== 1
    || decisions.inventory_sha256 !== draft.inventory_sha256
    || !Array.isArray(decisions.decisions)) {
    throw new Error('Evidence decisions do not bind the review inventory');
  }
  const provenance = decisions.review_provenance;
  const reviewedAt = provenance?.reviewed_at;
  if (!isPlainObject(provenance)
    || Object.keys(provenance).sort().join(',') !== 'method,reviewed_at,reviewer'
    || provenance.reviewer !== 'codex_visual_review'
    || typeof reviewedAt !== 'string'
    || Number.isNaN(Date.parse(reviewedAt))
    || new Date(reviewedAt).toISOString() !== reviewedAt
    || typeof provenance.method !== 'string'
    || provenance.method.length === 0
    || provenance.method !== provenance.method.trim()) {
    throw new Error('Evidence decisions require explicit authenticated review provenance');
  }
  const required = corpus.rows.filter(
    (row) => row.canonical_status === 'accepted' && row.history_value === 'yes',
  );
  if (decisions.decisions.length !== required.length) {
    throw new Error('Evidence decisions must contain exactly 196 final decisions');
  }
  decisions.decisions.forEach((decision, index) => {
    const keys = Object.hasOwn(decision ?? {}, 'reviewer_note')
      ? ['chronology_index', 'disposition', 'event_id', 'reviewer_note']
      : ['chronology_index', 'disposition', 'event_id'];
    if (!isPlainObject(decision)
      || canonicalJson(Object.keys(decision).sort()) !== canonicalJson(keys.sort())
      || decision.chronology_index !== required[index].chronology_index
      || decision.event_id !== required[index].event_id
      || !FINAL_DISPOSITIONS.has(decision.disposition)) {
      throw new Error(`Invalid, pending, or out-of-order evidence decision ${index + 1}`);
    }
    if (Object.hasOwn(decision, 'reviewer_note')
      && (typeof decision.reviewer_note !== 'string'
        || decision.reviewer_note.length === 0
        || decision.reviewer_note !== decision.reviewer_note.trim()
        || /[\u0000-\u001f\u007f]/u.test(decision.reviewer_note)
        || [...decision.reviewer_note].length > 2_000)) {
      throw new Error(`Invalid reviewer note at evidence decision ${index + 1}`);
    }
  });
}

function detailedDecisions(simple, draft) {
  return simple.decisions.map((decision) => ({
    event_id: decision.event_id,
    inventory_sha256: draft.inventory_sha256,
    disposition: decision.disposition,
    review_provenance: structuredClone(simple.review_provenance),
  }));
}

async function loadFrozenEvidence(root, corpus, video) {
  const { draft, prepared } = await loadEvidenceDraft(root, corpus, video);
  const decisions = await readJson(
    root,
    'evaluator/evidence-review-decisions.json',
    'Frozen evidence review decisions',
  );
  validateSimpleDecisions(decisions, corpus, draft);
  const final = await readJson(root, 'evaluator/evidence-inventory.json', 'Final evidence inventory');
  const rebuilt = buildEvidenceInventory({
    corpusRows: corpus.rows,
    preparedEvidence: prepared,
    videoInventory: video,
    decisions: detailedDecisions(decisions, draft),
  });
  if (canonicalJson(final) !== canonicalJson(rebuilt)) {
    throw new Error('Final evidence inventory differs from frozen decisions and source-bound evidence');
  }
  validateEvidenceArtifact({ corpusSnapshot: corpus, evidenceInventory: final, videoInventory: video });
  validateEvidenceDecisions(decisions, {
    corpusSnapshot: corpus,
    evidenceInventory: final,
    videoInventory: video,
  });
  return { draft, prepared, decisions, evidence: final };
}

function approvalProvenance(corpus, selection) {
  const rows = new Map(corpus.rows.map((row) => [row.event_id, row]));
  const targets = selection.selected_event_ids.map((eventId, index) => {
    const row = rows.get(eventId);
    const canonical = {
      app: row.target.app,
      object: row.target.object,
      subtarget: row.target.subtarget,
    };
    return {
      target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
      target_ordinal: index + 1,
      revision: 1,
      event_id: eventId,
      chronology_index: row.chronology_index,
      granularity: targetGranularity(canonical),
      canonical_target: canonical,
      accepted_variants: [canonical],
    };
  });
  const payload = {
    version: 1,
    source_hashes: {
      corpus_sha256: CANONICAL_CORPUS_SNAPSHOT_SHA256,
      target_selection_sha256: artifactSha256(selection),
    },
    targets,
  };
  return {
    approved_by: 'dylan',
    basis: APPROVAL_BASIS,
    catalog_payload_sha256: artifactSha256(payload),
  };
}

function stripCatalogApproval(catalog) {
  return {
    version: catalog.version,
    source_hashes: structuredClone(catalog.source_hashes),
    targets: structuredClone(catalog.targets),
  };
}

function stripManifestApproval(manifest) {
  return {
    version: manifest.version,
    source_hashes: structuredClone(manifest.source_hashes),
    provenance: { visibility: manifest.provenance.visibility },
    targets: structuredClone(manifest.targets),
  };
}

function rebuildSelectionSources(corpus, video, evidence, decisions) {
  const canonicalSources = {
    corpusSnapshot: corpus,
    videoInventory: video,
    evidenceInventory: evidence,
    evidenceDecisions: decisions,
  };
  const eligibility = buildEligibilityLedger(canonicalSources);
  const selection = selectQuantileTargets(eligibility, canonicalSources);
  const catalog = buildTargetCatalog({
    ...canonicalSources,
    eligibilityLedger: eligibility,
    targetSelection: selection,
    approvalProvenance: approvalProvenance(corpus, selection),
  });
  const manifest = buildEvaluatorManifest({
    ...canonicalSources,
    eligibilityLedger: eligibility,
    targetSelection: selection,
    targetCatalog: catalog,
  });
  return { canonicalSources, eligibility, selection, catalog, manifest };
}

async function loadSelection(root, corpus, video, evidence, decisions) {
  const rebuilt = rebuildSelectionSources(corpus, video, evidence, decisions);
  const eligibility = await readJson(root, 'evaluator/eligibility-ledger.json', 'Eligibility ledger');
  const selection = await readJson(root, 'evaluator/target-selection.json', 'Target selection');
  if (canonicalJson(eligibility) !== canonicalJson(rebuilt.eligibility)) {
    throw new Error('Eligibility ledger differs from canonical evidence reconstruction');
  }
  if (canonicalJson(selection) !== canonicalJson(rebuilt.selection)) {
    throw new Error('Target selection differs from canonical eligibility reconstruction');
  }
  return { ...rebuilt, eligibility, selection };
}

async function loadApproved(root, corpus, video, evidence, decisions) {
  const selected = await loadSelection(root, corpus, video, evidence, decisions);
  const catalog = await readJson(root, 'evaluator/target-catalog.json', 'Approved target catalog');
  const manifest = await readJson(root, 'evaluator/evaluator-manifest.json', 'Evaluator manifest');
  if (canonicalJson(catalog) !== canonicalJson(selected.catalog)) {
    throw new Error('Approved target catalog differs from canonical rebuild or approval payload');
  }
  if (canonicalJson(manifest) !== canonicalJson(selected.manifest)) {
    throw new Error('Evaluator manifest differs from canonical approved sources');
  }
  return { ...selected, catalog, manifest };
}

function buildTargetPlan(manifest) {
  return {
    version: 1,
    targets: manifest.targets.map((target) => ({
      target_ordinal: target.target_ordinal,
      target_id: target.target_id,
      chronology_index: target.chronology_index,
    })),
  };
}

function compactHistory(row) {
  return JSON.stringify({
    history_ordinal: row.history_ordinal,
    action_type: row.action_type,
    input_method: row.input_method,
    granularity: row.granularity,
    app: row.app,
    object: row.object,
    subtarget: row.subtarget,
  });
}

function addCanary(set, value, label) {
  if (typeof value !== 'string' || value.length === 0) return;
  if (value !== value.trim()
    || value.normalize('NFKC') !== value
    || [...value].length > 2_000
    || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error(`Derived forbidden canary is unsafe (${label})`);
  }
  set.add(`b64u:${Buffer.from(value, 'utf8').toString('base64url')}`);
}

function deriveCanaries(slot, sources, context) {
  const {
    corpus,
    video,
    evidence,
    decisions,
    catalog,
    manifest,
    schedule,
  } = sources;
  const canaries = new Set();
  [
    'evaluator/corpus-snapshot.json',
    'evaluator/video-inventory.json',
    'evaluator/frame-index.json',
    'evaluator/evidence-review-inventory.json',
    'evaluator/evidence-review-decisions.json',
    'evaluator/evidence-inventory.json',
    'evaluator/eligibility-ledger.json',
    'evaluator/target-selection.json',
    'evaluator/target-catalog.json',
    'evaluator/evaluator-manifest.json',
    'evaluator/schedule.json',
    'evaluator/prepared-inventory.json',
  ].forEach((value) => addCanary(canaries, value, 'evaluator artifact path'));
  addCanary(canaries, corpus.source.dataset_commit, 'canonical dataset commit');
  addCanary(canaries, corpus.source.dataset_path, 'canonical dataset path');
  addCanary(canaries, corpus.source.sha256, 'canonical dataset SHA-256');
  addCanary(canaries, JSON.stringify(corpus.source), 'canonical corpus provenance');
  corpus.rows.forEach((row) => addCanary(canaries, row.event_id, 'event ID'));
  catalog.targets.forEach((target) => {
    addCanary(canaries, target.target_id, 'target ID');
    addCanary(canaries, JSON.stringify(target.canonical_target), 'canonical target');
    addCanary(canaries, JSON.stringify(target.accepted_variants), 'accepted variants');
  });
  schedule.slots.forEach((entry) => addCanary(canaries, entry.slot_id, 'slot ID'));
  video.files.forEach((file) => {
    addCanary(canaries, file.recording_id, 'recording ID');
    addCanary(canaries, file.relative_path, 'video relative path');
    addCanary(canaries, file.absolute_path, 'video absolute path');
    addCanary(canaries, file.sha256, 'locked source SHA-256');
  });
  const allowedPngHashes = new Set([
    context.current.image_sha256,
    ...context.visual_history.map((entry) => entry.image_sha256),
  ]);
  evidence.rows.forEach((row) => {
    addCanary(canaries, row.selected_frame?.store_relative_path, 'evidence store path');
    if (row.selected_frame !== null && !allowedPngHashes.has(row.selected_frame.png_sha256)) {
      addCanary(canaries, row.selected_frame.png_sha256, 'forbidden evidence PNG SHA-256');
    }
  });
  addCanary(canaries, evidence.inventory_sha256, 'evidence inventory ID');
  addCanary(canaries, catalog.approval_provenance.catalog_payload_sha256, 'catalog payload SHA-256');
  addCanary(canaries, catalog.approval_provenance.basis, 'catalog approval basis');
  addCanary(
    canaries,
    JSON.stringify({ approved_by: catalog.approval_provenance.approved_by }),
    'catalog approver',
  );
  addCanary(canaries, JSON.stringify(catalog.approval_provenance), 'catalog approval provenance');
  for (const sourceHashes of [
    sources.eligibility.source_hashes,
    sources.selection.source_hashes,
    catalog.source_hashes,
    manifest.source_hashes,
  ]) {
    Object.values(sourceHashes).forEach((digest) => (
      addCanary(canaries, digest, 'evaluator source hash')
    ));
  }
  addCanary(canaries, sources.donor.root, 'V4 donor root');
  addCanary(canaries, sources.donor.aggregate_sha256, 'V4 donor aggregate');
  sources.donor.files.forEach((file) => {
    addCanary(canaries, file.path, 'V4 donor path');
    addCanary(canaries, file.sha256, 'V4 donor source hash');
  });
  decisions.decisions.forEach((decision) => {
    addCanary(canaries, decision.reviewer_note, 'review outcome note');
  });
  manifest.targets.forEach((target) => {
    addCanary(canaries, JSON.stringify(target.ground_truth_target), 'ground truth');
    addCanary(canaries, JSON.stringify(target.evidence_provenance), 'evaluator evidence provenance');
  });
  const selected = manifest.targets[slot.target_ordinal - 1];
  for (const ledgerRow of sources.eligibility.rows.filter((row) => row.history_eligible)) {
    const history = corpus.history[ledgerRow.history_ordinal - 1];
    const forbidden = slot.condition === CONDITIONS[0]
      || ledgerRow.chronology_index >= selected.chronology_index;
    if (forbidden) addCanary(canaries, compactHistory(history), 'forbidden action');
  }
  return [...canaries];
}

function contextBytes(context) {
  return Buffer.from(`${JSON.stringify(context, null, 2)}\n`);
}

function expectedInventory(context, canaries) {
  return {
    context_sha256: sha256(contextBytes(context)),
    ordered_image_sha256: context.visual_history.length === 0
      ? [context.current.image_sha256]
      : [
          ...context.visual_history.map((entry) => entry.image_sha256),
          context.current.image_sha256,
        ],
    forbidden_canaries: canaries,
    forbidden_json_keys: [...FORBIDDEN_JSON_KEYS],
  };
}

function contextOptions(condition, targetOrdinal, sources) {
  return {
    condition,
    targetOrdinal,
    corpusSnapshot: sources.corpus,
    videoInventory: sources.video,
    evidenceInventory: sources.evidence,
    evidenceDecisions: sources.decisions,
    eligibilityLedger: sources.eligibility,
    targetSelection: sources.selection,
    targetCatalog: sources.catalog,
    evaluatorManifest: sources.manifest,
  };
}

async function readBundleFiles(directory) {
  const files = [];
  for (const name of (await readdir(directory)).sort()) {
    const { bytes } = await readRegular(path.join(directory, name), `Audited bundle file ${name}`);
    files.push({ name, contents: bytes });
  }
  return files;
}

async function renderAndPublishPackets(root, sources, schedule) {
  const temporaryParent = await realpath(os.tmpdir());
  const temporaryRoot = await mkdtemp(path.join(temporaryParent, 'nap-v5-prepare-packets-'));
  const expectations = [];
  try {
    for (const slot of schedule.slots) {
      const target = String(slot.target_ordinal).padStart(3, '0');
      const contextDirectory = path.join(temporaryRoot, 'contexts', target, slot.condition);
      const packetDirectory = path.join(temporaryRoot, 'packets', slot.slot_id);
      const options = contextOptions(slot.condition, slot.target_ordinal, sources);
      const context = await writeContextBundle({
        ...options,
        outputDirectory: contextDirectory,
        evidenceRoot: root,
      });
      await renderFrozenPacket({
        condition: slot.condition,
        contextDirectory,
        outputDirectory: packetDirectory,
      });
      const expectation = {
        slot_id: slot.slot_id,
        condition: slot.condition,
        expected_inventory: expectedInventory(
          context,
          deriveCanaries(slot, { ...sources, schedule }, context),
        ),
      };
      await auditPredictorSafeTree({
        condition: slot.condition,
        contextDirectory,
        packetDirectory,
        expectedInventory: expectation.expected_inventory,
      });
      expectations.push(expectation);
    }

    for (const [index, slot] of schedule.slots.entries()) {
      const target = String(slot.target_ordinal).padStart(3, '0');
      const temporaryContext = path.join(temporaryRoot, 'contexts', target, slot.condition);
      const temporaryPacket = path.join(temporaryRoot, 'packets', slot.slot_id);
      const finalContext = path.join(root, 'contexts', target, slot.condition);
      const finalPacket = path.join(root, 'packets', slot.slot_id);
      await publishAtomicBundle({
        targetDirectory: finalContext,
        files: await readBundleFiles(temporaryContext),
        label: `Predictor-safe context ${slot.slot_id}`,
      });
      await publishAtomicBundle({
        targetDirectory: finalPacket,
        files: await readBundleFiles(temporaryPacket),
        label: `Predictor packet ${slot.slot_id}`,
      });
      await auditPredictorSafeTree({
        condition: slot.condition,
        contextDirectory: finalContext,
        packetDirectory: finalPacket,
        expectedInventory: expectations[index].expected_inventory,
      });
    }
    return expectations;
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

function sourceVideoLineage(video) {
  const safe = jsonSafe(video);
  return {
    version: 1,
    inventory_sha256: artifactSha256(safe),
    root: video.root,
    start_recording_id: video.start_recording_id,
    endpoint_recording_id: video.endpoint_recording_id,
    file_count: video.files.length,
    total_byte_length: video.total_byte_length,
    total_frame_count: video.total_frame_count,
    files: video.files.map((file, index) => ({
      sequence_ordinal: index + 1,
      recording_id: file.recording_id,
      absolute_path: file.absolute_path,
      relative_path: file.relative_path,
      byte_length: file.byte_length,
      sha256: file.sha256,
      predecessor_recording_id: file.predecessor_recording_id,
      frame_count: file.frames.length,
      time_base: jsonSafe(file.time_base),
    })),
  };
}

function expectedPreparedPaths(sources, schedule) {
  const paths = new Set([
    'evaluator/corpus-snapshot.json',
    'evaluator/video-inventory.json',
    'evaluator/frame-index.json',
    'evaluator/evidence-review-inventory.json',
    'evaluator/evidence-review.md',
    'evaluator/evidence-review-decisions.json',
    'evaluator/evidence-inventory.json',
    'evaluator/eligibility-ledger.json',
    'evaluator/target-selection.json',
    'evaluator/target-catalog-draft.json',
    'evaluator/evaluator-manifest-draft.json',
    'evaluator/target-catalog.json',
    'evaluator/evaluator-manifest.json',
    'evaluator/schedule.json',
  ]);
  paths.add('evaluator/v4-donor-inventory.json');
  for (const row of sources.evidence.rows) {
    if (row.selected_frame !== null) paths.add(row.selected_frame.store_relative_path);
  }
  for (const slot of schedule.slots) {
    const target = String(slot.target_ordinal).padStart(3, '0');
    const contextRoot = `contexts/${target}/${slot.condition}`;
    const packetRoot = `packets/${slot.slot_id}`;
    paths.add(`${contextRoot}/context.json`);
    paths.add(`${contextRoot}/current.png`);
    paths.add(`${packetRoot}/packet.json`);
    paths.add(`${packetRoot}/prompt.txt`);
    if (slot.condition === CONDITIONS[0]) {
      paths.add(`${packetRoot}/image-001.png`);
      continue;
    }
    for (let index = 1; index <= 10; index += 1) {
      paths.add(`${contextRoot}/visual-${String(index).padStart(3, '0')}.png`);
    }
    for (let index = 1; index <= 11; index += 1) {
      paths.add(`${packetRoot}/image-${String(index).padStart(3, '0')}.png`);
    }
  }
  return [...paths].sort();
}

async function authenticatedPreparedSources(root, io) {
  const corpus = await loadCorpus(root);
  const donor = await loadRequiredDonorInventory(root);
  const video = await loadVideo(root, io);
  const frozen = await loadFrozenEvidence(root, corpus, video);
  const approved = await loadApproved(root, corpus, video, frozen.evidence, frozen.decisions);
  return {
    corpus,
    donor,
    video,
    evidence: frozen.evidence,
    decisions: frozen.decisions,
    eligibility: approved.eligibility,
    selection: approved.selection,
    catalog: approved.catalog,
    manifest: approved.manifest,
    io,
  };
}

async function expectedPacketAudits(root, sources, schedule, { audit = false } = {}) {
  const expectations = [];
  for (const slot of schedule.slots) {
    const context = buildSanitizedContext(contextOptions(slot.condition, slot.target_ordinal, sources));
    const expectation = {
      slot_id: slot.slot_id,
      condition: slot.condition,
      expected_inventory: expectedInventory(
        context,
        deriveCanaries(slot, { ...sources, schedule }, context),
      ),
    };
    if (audit) {
      const target = String(slot.target_ordinal).padStart(3, '0');
      await auditPredictorSafeTree({
        condition: slot.condition,
        contextDirectory: path.join(root, 'contexts', target, slot.condition),
        packetDirectory: path.join(root, 'packets', slot.slot_id),
        expectedInventory: expectation.expected_inventory,
      });
    }
    expectations.push(expectation);
  }
  return expectations;
}

async function derivePreparedInventory({
  root,
  io = {},
  downstreamAuthenticated = false,
}) {
  assertRoot(root);
  if (typeof downstreamAuthenticated !== 'boolean') {
    throw new TypeError('downstreamAuthenticated must be a boolean');
  }
  const normalizedIo = normalizeIo(io);
  if (!downstreamAuthenticated) await assertNoForbiddenRunArtifacts(root);
  const tree = await capturePreparedTree(root, { downstreamAuthenticated });
  try {
    const auditRoot = tree.snapshotRoot;
    const sources = await authenticatedPreparedSources(auditRoot, normalizedIo);
    const schedule = buildSchedule(buildTargetPlan(sources.manifest));
    const storedSchedule = await readJson(
      auditRoot,
      'evaluator/schedule.json',
      'Prepared schedule',
    );
    if (canonicalJson(storedSchedule) !== canonicalJson(schedule)) {
      throw new Error('Prepared schedule differs from the approved evaluator manifest');
    }
    const expectations = await expectedPacketAudits(
      auditRoot,
      sources,
      schedule,
      { audit: true },
    );
    const paths = [...tree.files.keys()]
      .filter((relativePath) => relativePath !== PREPARED_INVENTORY_PATH)
      .sort();
    const expectedPaths = expectedPreparedPaths(sources, schedule);
    if (canonicalJson(paths) !== canonicalJson(expectedPaths)) {
      const actual = new Set(paths);
      const expected = new Set(expectedPaths);
      const extra = paths.find((entry) => !expected.has(entry));
      const missing = expectedPaths.find((entry) => !actual.has(entry));
      throw new Error(
        `Prepared tree exact path set differs${extra === undefined ? '' : `; unexpected ${extra}`}`
        + `${missing === undefined ? '' : `; missing ${missing}`}`,
      );
    }
    const files = paths.map((relativePath) => {
      if (!relativePath.startsWith('evaluator/')
        && !relativePath.startsWith('contexts/')
        && !relativePath.startsWith('packets/')) {
        throw new Error(`Unexpected prepared artifact outside trust zones: ${relativePath}`);
      }
      if (isForbiddenPath(relativePath)) throw new Error(`Forbidden prepared artifact: ${relativePath}`);
      const captured = tree.files.get(relativePath);
      return {
        path: relativePath,
        byte_length: captured.byteLength,
        sha256: captured.sha256,
        trust_zone: relativePath.startsWith('contexts/') || relativePath.startsWith('packets/')
          ? 'predictor_safe'
          : 'evaluator_only',
      };
    });
    const packetCount = files.filter((file) => /^packets\/NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])\/packet\.json$/.test(file.path)).length;
    const contextCount = files.filter((file) => /^contexts\/\d{3}\/(?:state_only|state_plus_hybrid_history)\/context\.json$/.test(file.path)).length;
    if (packetCount !== METHOD.scheduledSlotCount
      || contextCount !== METHOD.scheduledSlotCount) {
      throw new Error(
        `Prepared tree must contain exactly ${METHOD.scheduledSlotCount} packets and context bundles`,
      );
    }
    const inventory = deepFreeze({
      version: 1,
      source_video_lineage: sourceVideoLineage(sources.video),
      schedule_sha256: artifactSha256(schedule),
      target_count: schedule.target_count,
      scheduled_slot_count: schedule.scheduled_slot_count,
      context_bundle_count: contextCount,
      packet_count: packetCount,
      packet_audit_expectations: expectations,
      files,
    });
    await revalidatePrivateAuditSnapshot(tree);
    await revalidatePreparedTree(tree);
    return { inventory, tree };
  } catch (error) {
    await closePreparedTree(tree);
    throw error;
  }
}

export async function buildPreparedInventory({ root, io = {} }) {
  const derived = await derivePreparedInventory({ root, io });
  try {
    return derived.inventory;
  } finally {
    await closePreparedTree(derived.tree);
  }
}

export async function verifyPrepared({
  root,
  io = {},
  downstreamAuthenticated = false,
}) {
  assertRoot(root);
  if (typeof downstreamAuthenticated !== 'boolean') {
    throw new TypeError('downstreamAuthenticated must be a boolean');
  }
  if (!downstreamAuthenticated) await assertNoForbiddenRunArtifacts(root);
  const rootPin = await pinPreparationRoot(root);
  try {
    const frozen = await readJson(root, PREPARED_INVENTORY_PATH, 'Prepared inventory');
    const derived = await derivePreparedInventory({
      root,
      io,
      downstreamAuthenticated,
    });
    let rebuilt;
    try {
      rebuilt = derived.inventory;
    } finally {
      await closePreparedTree(derived.tree);
    }
    await revalidatePreparationRoot(root, rootPin);
    if (canonicalJson(frozen) !== canonicalJson(rebuilt)) {
      throw new Error('Prepared inventory differs from rederived hashes, files, or evaluator sources');
    }
    return true;
  } finally {
    await rootPin.handle.close();
  }
}

async function commandCompileCorpus(root) {
  const corpus = await compileCorpusSnapshot();
  validateCanonicalCorpusSnapshot(corpus);
  await writeJson(root, 'evaluator/corpus-snapshot.json', corpus);
  return 1;
}

async function commandPrepareEvidence(root, io) {
  const corpus = await loadCorpus(root);
  let video;
  if (await optionalLstat(relativeTarget(root, 'evaluator/video-inventory.json')) === null) {
    video = await inventoryVideoChain({
      root: io.videoRoot,
      startRecordingId: io.startRecordingId,
      endpointRecordingId: io.endpointRecordingId,
      ...(io.ffprobeSpawn === undefined ? {} : { spawn: io.ffprobeSpawn }),
    });
    await authenticateVideoSources(video);
    await writeJson(root, 'evaluator/video-inventory.json', video);
    await writeJson(root, 'evaluator/frame-index.json', buildFrameIndex(video));
  } else {
    video = await loadVideo(root, io, { repairFrameIndex: true });
  }

  let draft;
  if (await optionalLstat(relativeTarget(root, 'evaluator/evidence-review-inventory.json')) === null) {
    const prepared = await prepareEvidenceFromVideo(root, corpus, video, io);
    draft = buildEvidenceInventory({
      corpusRows: corpus.rows,
      preparedEvidence: prepared,
      videoInventory: video,
    });
    await writeJson(root, 'evaluator/evidence-review-inventory.json', draft);
    await writeImmutable(
      relativeTarget(root, 'evaluator/evidence-review.md'),
      Buffer.from(renderEvidenceReview(draft)),
    );
  } else {
    ({ draft } = await loadEvidenceDraft(
      root,
      corpus,
      video,
      { repairReviewDocument: true },
    ));
  }
  await exactEvidenceStore(root, draft);
  return 4;
}

async function commandFreezeEvidence(root, io, decisionsPath) {
  if (typeof decisionsPath !== 'string' || !path.isAbsolute(decisionsPath)) {
    throw new Error('freeze-evidence requires an absolute --decisions path');
  }
  const corpus = await loadCorpus(root);
  const video = await loadVideo(root, io);
  const { draft, prepared } = await loadEvidenceDraft(root, corpus, video);
  const decisionRead = await readRegular(decisionsPath, 'External evidence decisions');
  const simple = parseJson(decisionRead.bytes, 'External evidence decisions');
  validateSimpleDecisions(simple, corpus, draft);
  const frozenDecisionStat = await optionalLstat(
    relativeTarget(root, 'evaluator/evidence-review-decisions.json'),
  );
  const frozenEvidenceStat = await optionalLstat(
    relativeTarget(root, 'evaluator/evidence-inventory.json'),
  );
  if (frozenDecisionStat !== null && frozenEvidenceStat !== null) {
    const frozen = await loadFrozenEvidence(root, corpus, video);
    if (canonicalJson(simple) !== canonicalJson(frozen.decisions)) {
      throw new Error('External evidence decisions differ from the immutable frozen decisions');
    }
    return 2;
  }
  if (frozenDecisionStat === null && frozenEvidenceStat !== null) {
    const existingFinal = await readJson(root, 'evaluator/evidence-inventory.json', 'Partial final evidence inventory');
    const rebuiltFinal = buildEvidenceInventory({
      corpusRows: corpus.rows,
      preparedEvidence: prepared,
      videoInventory: video,
      decisions: detailedDecisions(simple, draft),
    });
    if (canonicalJson(existingFinal) !== canonicalJson(rebuiltFinal)) {
      throw new Error('Partial final evidence inventory differs from the supplied frozen decisions');
    }
    validateEvidenceDecisions(simple, {
      corpusSnapshot: corpus,
      evidenceInventory: existingFinal,
      videoInventory: video,
    });
    await writeJson(root, 'evaluator/evidence-review-decisions.json', simple);
    return 2;
  }
  if (frozenDecisionStat !== null && frozenEvidenceStat === null) {
    const existingDecisions = await readJson(
      root,
      'evaluator/evidence-review-decisions.json',
      'Partial frozen evidence decisions',
    );
    if (canonicalJson(existingDecisions) !== canonicalJson(simple)) {
      throw new Error('Partial frozen decisions differ from the supplied evidence decisions');
    }
  }
  const final = buildEvidenceInventory({
    corpusRows: corpus.rows,
    preparedEvidence: prepared,
    videoInventory: video,
    decisions: detailedDecisions(simple, draft),
  });
  validateEvidenceArtifact({ corpusSnapshot: corpus, evidenceInventory: final, videoInventory: video });
  validateEvidenceDecisions(simple, {
    corpusSnapshot: corpus,
    evidenceInventory: final,
    videoInventory: video,
  });
  await writeJson(root, 'evaluator/evidence-inventory.json', final);
  await writeJson(root, 'evaluator/evidence-review-decisions.json', simple);
  return 2;
}

async function commandSelectTargets(root, io) {
  const corpus = await loadCorpus(root);
  const video = await loadVideo(root, io);
  const frozen = await loadFrozenEvidence(root, corpus, video);
  const rebuilt = rebuildSelectionSources(corpus, video, frozen.evidence, frozen.decisions);
  await writeJson(root, 'evaluator/eligibility-ledger.json', rebuilt.eligibility);
  await writeJson(root, 'evaluator/target-selection.json', rebuilt.selection);
  await writeJson(root, 'evaluator/target-catalog-draft.json', stripCatalogApproval(rebuilt.catalog));
  await writeJson(root, 'evaluator/evaluator-manifest-draft.json', stripManifestApproval(rebuilt.manifest));
  return 4;
}

async function commandApproveCatalog(root, io, approvalBasis) {
  if (approvalBasis !== APPROVAL_BASIS) {
    throw new Error(`approve-catalog requires basis ${APPROVAL_BASIS}`);
  }
  const corpus = await loadCorpus(root);
  const video = await loadVideo(root, io);
  const frozen = await loadFrozenEvidence(root, corpus, video);
  const selected = await loadSelection(root, corpus, video, frozen.evidence, frozen.decisions);
  const draftCatalog = await readJson(root, 'evaluator/target-catalog-draft.json', 'Target catalog draft');
  const draftManifest = await readJson(root, 'evaluator/evaluator-manifest-draft.json', 'Evaluator manifest draft');
  if (canonicalJson(draftCatalog) !== canonicalJson(stripCatalogApproval(selected.catalog))) {
    throw new Error('Target catalog draft differs from canonical source reconstruction');
  }
  if (canonicalJson(draftManifest) !== canonicalJson(stripManifestApproval(selected.manifest))) {
    throw new Error('Evaluator manifest draft differs from canonical source reconstruction');
  }
  await writeJson(root, 'evaluator/target-catalog.json', selected.catalog);
  await writeJson(root, 'evaluator/evaluator-manifest.json', selected.manifest);
  return 2;
}

async function commandPreparePackets(root, io) {
  const sources = await authenticatedPreparedSources(root, io);
  const schedule = buildSchedule(buildTargetPlan(sources.manifest));
  const expectations = await renderAndPublishPackets(root, sources, schedule);
  await writeJson(root, 'evaluator/schedule.json', schedule);
  const derived = await derivePreparedInventory({ root, io });
  try {
    const prepared = derived.inventory;
    if (canonicalJson(prepared.packet_audit_expectations) !== canonicalJson(expectations)) {
      throw new Error('Published packet expectations differ from their private audited renders');
    }
    await revalidatePreparedTree(derived.tree);
    await writeJson(root, PREPARED_INVENTORY_PATH, prepared);
    await revalidatePublishedPreparedTree(derived.tree, prepared);
  } finally {
    await closePreparedTree(derived.tree);
  }
  return 62;
}

export async function runPreparationCommand(options) {
  if (!isPlainObject(options)) throw new TypeError('Preparation command options must be a plain object');
  const allowed = new Set(['root', 'command', 'decisionsPath', 'approvalBasis', 'io']);
  for (const key of Object.keys(options)) {
    if (!allowed.has(key)) throw new Error(`Unknown preparation command option: ${key}`);
  }
  const {
    root,
    command,
    decisionsPath,
    approvalBasis,
  } = options;
  assertRoot(root);
  if (!PREPARATION_COMMANDS.includes(command)) {
    throw new Error(`Unknown preparation command: ${String(command)}`);
  }
  if (decisionsPath !== undefined && command !== 'freeze-evidence') {
    throw new Error(`decisionsPath is not valid for ${command}`);
  }
  if (approvalBasis !== undefined && command !== 'approve-catalog') {
    throw new Error(`approvalBasis is not valid for ${command}`);
  }
  const io = normalizeIo(options.io);
  await assertNoForbiddenRunArtifacts(root);
  if (command !== 'compile-corpus') await loadRequiredDonorInventory(root);
  let artifactCount;
  if (command === 'compile-corpus') artifactCount = await commandCompileCorpus(root);
  else if (command === 'prepare-evidence') artifactCount = await commandPrepareEvidence(root, io);
  else if (command === 'freeze-evidence') {
    if (decisionsPath === undefined) throw new Error('freeze-evidence requires --decisions');
    artifactCount = await commandFreezeEvidence(root, io, decisionsPath);
  } else if (command === 'select-targets') artifactCount = await commandSelectTargets(root, io);
  else if (command === 'approve-catalog') {
    if (approvalBasis === undefined) throw new Error('approve-catalog requires --basis');
    artifactCount = await commandApproveCatalog(root, io, approvalBasis);
  } else if (command === 'prepare-packets') artifactCount = await commandPreparePackets(root, io);
  else {
    await verifyPrepared({ root, io });
    artifactCount = 0;
  }
  await assertNoForbiddenRunArtifacts(root);
  return deepFreeze({ ok: true, command, artifact_count: artifactCount });
}
