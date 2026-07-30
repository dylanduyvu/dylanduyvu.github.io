import { createHash, randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import { link, lstat, mkdir, open, readdir, realpath, rmdir, unlink } from 'node:fs/promises';
import path from 'node:path';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const IMMUTABLE_STAGING_DIRECTORY = '.nap-v5-immutable-staging';

const IMMUTABLE_STAGING_FILE = /^immutable-[1-9]\d*-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.tmp$/;

function canonicalValue(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('Unsupported non-finite number');
    return value;
  }
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError(`Unsupported canonical JSON value: ${typeof value}`);
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalValue(value[key])]));
}

export function canonicalJson(value) {
  return `${JSON.stringify(canonicalValue(value), null, 2)}\n`;
}

async function fsyncDirectory(directory) {
  const handle = await open(directory, 'r');
  try { await handle.sync(); } finally { await handle.close(); }
}

async function rejectSymlinkedParents(target) {
  const directory = path.resolve(path.dirname(target));
  const { root } = path.parse(directory);
  let current = root;
  for (const component of directory.slice(root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    let stat;
    try {
      stat = await lstat(current);
    } catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error(`Immutable parent path contains symlink: ${current}`);
    if (!stat.isDirectory()) throw new Error(`Immutable parent component is not a directory: ${current}`);
  }
}

async function readExistingImmutable(target, bytes) {
  const pathStat = await lstat(target);
  if (pathStat.isSymbolicLink()) throw new Error(`Immutable target is a symlink: ${target}`);
  if (!pathStat.isFile()) throw new Error(`Immutable target is not a regular file: ${target}`);
  if ((pathStat.mode & 0o777) !== 0o600) throw new Error(`Immutable target mode is not 0600: ${target}`);

  const handle = await open(target, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const handleStat = await handle.stat();
    if (!handleStat.isFile()) throw new Error(`Immutable target is not a regular file: ${target}`);
    if ((handleStat.mode & 0o777) !== 0o600) throw new Error(`Immutable target mode is not 0600: ${target}`);
    const existing = await handle.readFile();
    if (!existing.equals(bytes)) throw new Error(`Immutable file differs: ${target}`);
  } finally {
    await handle.close();
  }
}

async function validateStagingDirectory(parent) {
  const staging = path.join(parent, IMMUTABLE_STAGING_DIRECTORY);
  let pathStat;
  try {
    pathStat = await lstat(staging);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
  if (pathStat.isSymbolicLink()) throw new Error(`Immutable staging directory is a symlink: ${staging}`);
  if (!pathStat.isDirectory()) throw new Error(`Immutable staging path is not a directory: ${staging}`);
  if ((pathStat.mode & 0o777) !== 0o700) throw new Error(`Immutable staging directory mode is not 0700: ${staging}`);

  const handle = await open(staging, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
  try {
    const handleStat = await handle.stat();
    if (!handleStat.isDirectory() || handleStat.dev !== pathStat.dev || handleStat.ino !== pathStat.ino) {
      throw new Error(`Immutable staging directory changed during validation: ${staging}`);
    }
  } catch (error) {
    await handle.close();
    throw error;
  }
  return { handle, staging };
}

export async function recoverImmutableStaging(parent) {
  const resolvedParent = path.resolve(parent);
  await rejectSymlinkedParents(path.join(resolvedParent, '.immutable-parent-check'));
  const parentStat = await lstat(resolvedParent);
  if (parentStat.isSymbolicLink() || !parentStat.isDirectory()) throw new Error(`Immutable staging parent must be a non-symlink directory: ${resolvedParent}`);

  const validated = await validateStagingDirectory(resolvedParent);
  if (validated === null) return false;
  const { handle, staging } = validated;
  let failure = null;
  try {
    const owned = [];
    for (const name of await readdir(staging)) {
      if (!IMMUTABLE_STAGING_FILE.test(name)) throw new Error(`Unrecognized immutable staging filename: ${name}`);
      const target = path.join(staging, name);
      const stat = await lstat(target);
      if (stat.isSymbolicLink()) throw new Error(`Immutable staging entry is a symlink: ${name}`);
      if (!stat.isFile()) throw new Error(`Immutable staging entry is not a regular file: ${name}`);
      if ((stat.mode & 0o777) !== 0o600) throw new Error(`Immutable staging entry mode is not 0600: ${name}`);
      owned.push(target);
    }
    for (const target of owned) await unlink(target);
    await handle.sync();
  } catch (error) {
    failure = error;
  } finally {
    try { await handle.close(); } catch (error) { failure ??= error; }
  }
  if (failure !== null) throw failure;
  await rmdir(staging);
  await fsyncDirectory(resolvedParent);
  return true;
}

async function createStagingDirectory(parent) {
  const staging = path.join(parent, IMMUTABLE_STAGING_DIRECTORY);
  let created = false;
  try {
    await mkdir(staging, { mode: 0o700 });
    created = true;
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
  }
  const validated = await validateStagingDirectory(parent);
  if (validated === null) throw new Error(`Immutable staging directory disappeared: ${staging}`);
  await validated.handle.close();
  if (created) await fsyncDirectory(parent);
  return staging;
}

// `beforePublish` is a narrow failure-injection hook for atomicity tests. It runs
// after the staged file is durable and before its no-replace hard link.
export async function writeImmutable(target, contents, { beforePublish } = {}) {
  const bytes = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
  const resolvedTarget = path.resolve(target);
  const directory = path.dirname(resolvedTarget);
  await rejectSymlinkedParents(resolvedTarget);
  await mkdir(directory, { recursive: true });
  await rejectSymlinkedParents(resolvedTarget);
  await recoverImmutableStaging(directory);

  const staging = await createStagingDirectory(directory);
  const temporary = path.join(staging, `immutable-${process.pid}-${randomUUID()}.tmp`);
  let handle = null;
  let failure = null;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = null;
    await fsyncDirectory(staging);

    if (beforePublish !== undefined) {
      if (typeof beforePublish !== 'function') throw new TypeError('beforePublish must be a function');
      await beforePublish({ temporary, target: resolvedTarget });
    }

    try {
      await link(temporary, resolvedTarget);
      await fsyncDirectory(directory);
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      await readExistingImmutable(resolvedTarget, bytes);
    }
  } catch (error) {
    failure = error;
  } finally {
    if (handle !== null) {
      try { await handle.close(); } catch (error) { failure ??= error; }
    }
    try { await recoverImmutableStaging(directory); } catch (error) { failure ??= error; }
  }
  if (failure !== null) throw failure;
}

function assertContained(root, candidate) {
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Inventory path escapes root: ${candidate}`);
  }
}

async function regularFiles(root, rootReal, directory = root, output = []) {
  assertContained(rootReal, await realpath(directory));
  await recoverImmutableStaging(directory);
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === IMMUTABLE_STAGING_DIRECTORY) {
      await recoverImmutableStaging(directory);
      continue;
    }
    const target = path.join(directory, entry.name);
    const stat = await lstat(target);
    if (stat.isSymbolicLink()) throw new Error(`Inventory contains symlink: ${target}`);
    if (stat.isDirectory()) await regularFiles(root, rootReal, target, output);
    else if (stat.isFile()) output.push(path.relative(root, target).split(path.sep).join('/'));
    else throw new Error(`Inventory contains non-regular entry: ${target}`);
  }
  return output.sort();
}

function validateInventory(inventory) {
  const entries = Array.isArray(inventory) ? inventory : inventory?.files;
  if (!Array.isArray(entries)) throw new TypeError('Inventory files must be an array');
  const paths = new Set();
  for (const entry of entries) {
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) throw new TypeError('Inventory entry must be an object');
    if (typeof entry.path !== 'string' || entry.path.length === 0 || entry.path.includes('\\') || entry.path.includes('\0') || path.posix.isAbsolute(entry.path) || entry.path === '.' || path.posix.normalize(entry.path) !== entry.path || entry.path.split('/').includes('..')) {
      throw new Error(`Unsafe inventory relative POSIX path: ${String(entry.path)}`);
    }
    if (!Number.isSafeInteger(entry.byte_length) || entry.byte_length < 0) throw new TypeError(`Inventory byte_length must be a nonnegative integer: ${entry.path}`);
    if (typeof entry.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(entry.sha256)) throw new TypeError(`Inventory SHA-256 must be 64 lowercase hex characters: ${entry.path}`);
    if (paths.has(entry.path)) throw new Error(`Duplicate inventory path: ${entry.path}`);
    paths.add(entry.path);
  }
  return entries;
}

function sameFileSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

async function verifiedBytes(root, rootReal, relativePath) {
  const target = path.resolve(root, ...relativePath.split('/'));
  assertContained(path.resolve(root), target);
  assertContained(rootReal, await realpath(path.dirname(target)));

  const handle = await open(target, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    assertContained(rootReal, await realpath(target));
    const before = await handle.stat({ bigint: true });
    if (!before.isFile()) throw new Error(`Inventory leaf is not a regular file: ${relativePath}`);
    const pathBefore = await lstat(target, { bigint: true });
    if (pathBefore.isSymbolicLink() || pathBefore.dev !== before.dev || pathBefore.ino !== before.ino) throw new Error(`Inventory leaf changed before read: ${relativePath}`);
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(target, { bigint: true });
    if (!sameFileSnapshot(before, after) || pathAfter.isSymbolicLink() || pathAfter.dev !== after.dev || pathAfter.ino !== after.ino) {
      throw new Error(`Inventory leaf changed during read: ${relativePath}`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

export async function verifyInventory(root, inventory) {
  const rootStat = await lstat(root);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) throw new Error(`Inventory root must be a non-symlink directory: ${root}`);
  const expected = validateInventory(inventory);
  const expectedByPath = new Map(expected.map((entry) => [entry.path, entry]));
  const rootReal = await realpath(root);
  const actualPaths = await regularFiles(root, rootReal);
  for (const actualPath of actualPaths) if (!expectedByPath.has(actualPath)) throw new Error(`Unexpected inventory path: ${actualPath}`);
  for (const expectedPath of expectedByPath.keys()) if (!actualPaths.includes(expectedPath)) throw new Error(`Missing inventory path: ${expectedPath}`);
  for (const relativePath of actualPaths) {
    const bytes = await verifiedBytes(root, rootReal, relativePath);
    const expectedFile = expectedByPath.get(relativePath);
    if (bytes.length !== expectedFile.byte_length) throw new Error(`Inventory byte length drift: ${relativePath}`);
    if (sha256(bytes) !== expectedFile.sha256) throw new Error(`Inventory SHA-256 drift: ${relativePath}`);
  }
  return true;
}
