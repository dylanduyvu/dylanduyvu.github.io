import { createHash, randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import {
  lstat,
  mkdir,
  open,
  readdir,
  rename,
  rmdir,
  unlink,
} from 'node:fs/promises';
import path from 'node:path';

const FILE_MODE = 0o600;
const DIRECTORY_MODE = 0o700;
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function sameInode(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

async function fsyncDirectory(directory) {
  const handle = await open(
    directory,
    constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW,
  );
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
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
    if (stat.isSymbolicLink()) {
      throw new Error(`Bundle parent path contains a symlink: ${current}`);
    }
    if (!stat.isDirectory()) {
      throw new Error(`Bundle parent component is not a directory: ${current}`);
    }
  }
}

function normalizeFiles(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new TypeError('Atomic bundle files must be a nonempty array');
  }
  const normalized = new Map();
  for (const entry of files) {
    if (!isPlainObject(entry)
      || Object.keys(entry).sort().join(',') !== 'contents,name'
      || typeof entry.name !== 'string'
      || entry.name.length === 0
      || entry.name === '.'
      || entry.name === '..'
      || path.basename(entry.name) !== entry.name
      || entry.name.includes('\\')
      || entry.name.includes('\0')) {
      throw new Error('Atomic bundle entries must contain only a safe basename and contents');
    }
    if (normalized.has(entry.name)) {
      throw new Error(`Atomic bundle contains a duplicate filename: ${entry.name}`);
    }
    normalized.set(
      entry.name,
      Buffer.isBuffer(entry.contents) ? Buffer.from(entry.contents) : Buffer.from(entry.contents),
    );
  }
  return new Map([...normalized.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

async function readVerifiedFile(filename, expectedBytes, label) {
  const pathStat = await lstat(filename);
  if (pathStat.isSymbolicLink() || !pathStat.isFile()) {
    throw new Error(`${label} must be a regular non-symlink file`);
  }
  if (pathStat.nlink !== 1) throw new Error(`${label} has forbidden hardlink count`);
  if ((pathStat.mode & 0o777) !== FILE_MODE) throw new Error(`${label} mode must be 0600`);

  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat();
    if (!before.isFile()
      || !sameInode(pathStat, before)
      || before.nlink !== 1
      || (before.mode & 0o777) !== FILE_MODE) {
      throw new Error(`${label} changed during verification`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat();
    const finalPathStat = await lstat(filename);
    if (!sameInode(before, after)
      || !sameInode(after, finalPathStat)
      || after.size !== before.size
      || after.mtimeMs !== before.mtimeMs
      || after.ctimeMs !== before.ctimeMs
      || finalPathStat.nlink !== 1
      || (finalPathStat.mode & 0o777) !== FILE_MODE) {
      throw new Error(`${label} changed during verification`);
    }
    if (!bytes.equals(expectedBytes)) throw new Error(`${label} differs from the expected immutable bytes`);
  } finally {
    await handle.close();
  }
}

async function inspectBundle(directory, expected, label, { allowPartial = false } = {}) {
  let directoryStat;
  try {
    directoryStat = await lstat(directory);
  } catch (error) {
    if (error?.code === 'ENOENT') return { state: 'missing', stat: null, names: [] };
    throw error;
  }
  if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) {
    throw new Error(`${label} must be a non-symlink directory`);
  }
  const names = (await readdir(directory)).sort();
  for (const name of names) {
    if (!expected.has(name)) throw new Error(`${label} contains an extra or unexpected entry: ${name}`);
    await readVerifiedFile(path.join(directory, name), expected.get(name), `${label}/${name}`);
  }
  if (names.length === expected.size) {
    return { state: 'complete', stat: directoryStat, names };
  }
  if (!allowPartial) throw new Error(`${label} is missing required entries`);
  return { state: 'partial', stat: directoryStat, names };
}

async function removeVerifiedPartialBundle(directory, expected, inspection, label, parent) {
  const currentDirectoryStat = await lstat(directory);
  if (!currentDirectoryStat.isDirectory()
    || currentDirectoryStat.isSymbolicLink()
    || !sameInode(currentDirectoryStat, inspection.stat)) {
    throw new Error(`${label} changed before partial-bundle recovery`);
  }
  const currentNames = (await readdir(directory)).sort();
  if (currentNames.length !== inspection.names.length
    || currentNames.some((name, index) => name !== inspection.names[index])) {
    throw new Error(`${label} changed before partial-bundle recovery`);
  }
  for (const name of currentNames) {
    await readVerifiedFile(path.join(directory, name), expected.get(name), `${label}/${name}`);
    await unlink(path.join(directory, name));
  }
  await rmdir(directory);
  await fsyncDirectory(parent);
}

function processIsAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error?.code === 'ESRCH') return false;
    return true;
  }
}

async function removeOwnedStage(stage, expected, label, parent) {
  const stageStat = await lstat(stage);
  if (stageStat.isSymbolicLink()
    || !stageStat.isDirectory()
    || (stageStat.mode & 0o777) !== DIRECTORY_MODE) {
    throw new Error(`${label} staging path is not an owned mode-0700 directory`);
  }
  const names = (await readdir(stage)).sort();
  for (const name of names) {
    if (!expected.has(name)) throw new Error(`${label} staging directory contains an unexpected entry`);
    const entry = await lstat(path.join(stage, name));
    if (entry.isSymbolicLink()
      || !entry.isFile()
      || entry.nlink !== 1
      || (entry.mode & 0o777) !== FILE_MODE) {
      throw new Error(`${label} staging entry is not an owned mode-0600 regular file`);
    }
  }
  for (const name of names) await unlink(path.join(stage, name));
  await rmdir(stage);
  await fsyncDirectory(parent);
}

async function recoverDeadStages(parent, targetDirectory, expected, label) {
  const targetKey = createHash('sha256').update(targetDirectory).digest('hex').slice(0, 16);
  const prefix = `.nap-v5-bundle-${targetKey}-`;
  const pattern = new RegExp(`^\\.nap-v5-bundle-${targetKey}-([1-9]\\d*)-${UUID}\\.stage$`);
  for (const name of await readdir(parent)) {
    if (!name.startsWith(prefix)) continue;
    const match = pattern.exec(name);
    if (match === null) throw new Error(`${label} has an unrecognized target-owned staging path`);
    const pid = Number(match[1]);
    if (!Number.isSafeInteger(pid) || processIsAlive(pid)) continue;
    await removeOwnedStage(path.join(parent, name), expected, label, parent);
  }
  return { prefix, pattern };
}

async function writeStagedFile(filename, bytes) {
  const handle = await open(filename, 'wx', FILE_MODE);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } finally {
    await handle.close();
  }
}

export async function publishAtomicBundle({
  targetDirectory,
  files,
  label,
  beforePublish,
}) {
  if (typeof targetDirectory !== 'string' || !path.isAbsolute(targetDirectory)) {
    throw new Error('Atomic bundle target directory must be an absolute path');
  }
  if (typeof label !== 'string' || label.length === 0) {
    throw new TypeError('Atomic bundle label must be a nonempty string');
  }
  if (beforePublish !== undefined && typeof beforePublish !== 'function') {
    throw new TypeError('Atomic bundle beforePublish hook must be a function');
  }
  const expected = normalizeFiles(files);
  const resolvedTarget = path.resolve(targetDirectory);
  const parent = path.dirname(resolvedTarget);
  await rejectSymlinkedParents(resolvedTarget);
  await mkdir(parent, { recursive: true, mode: DIRECTORY_MODE });
  await rejectSymlinkedParents(resolvedTarget);

  const parentStat = await lstat(parent);
  if (parentStat.isSymbolicLink() || !parentStat.isDirectory()) {
    throw new Error(`${label} parent must be a non-symlink directory`);
  }
  const { prefix } = await recoverDeadStages(parent, resolvedTarget, expected, label);
  const existing = await inspectBundle(resolvedTarget, expected, label, { allowPartial: true });
  if (existing.state === 'complete') return;
  if (existing.state === 'partial') {
    await removeVerifiedPartialBundle(resolvedTarget, expected, existing, label, parent);
  }

  const stage = path.join(parent, `${prefix}${process.pid}-${randomUUID()}.stage`);
  await mkdir(stage, { mode: DIRECTORY_MODE });
  let stageExists = true;
  let failure = null;
  try {
    for (const [name, bytes] of expected) {
      await writeStagedFile(path.join(stage, name), bytes);
    }
    await fsyncDirectory(stage);
    if (beforePublish !== undefined) await beforePublish({ stage, target: resolvedTarget });
    try {
      await rename(stage, resolvedTarget);
      stageExists = false;
      await fsyncDirectory(parent);
    } catch (error) {
      if (!['EEXIST', 'ENOTEMPTY'].includes(error?.code)) throw error;
      const raced = await inspectBundle(resolvedTarget, expected, label);
      if (raced.state !== 'complete') throw new Error(`${label} publication raced with an incomplete bundle`);
    }
    const published = await inspectBundle(resolvedTarget, expected, label);
    if (published.state !== 'complete') throw new Error(`${label} publication is incomplete`);
  } catch (error) {
    failure = error;
  } finally {
    if (stageExists) {
      try {
        await removeOwnedStage(stage, expected, label, parent);
      } catch (error) {
        failure ??= error;
      }
    }
  }
  if (failure !== null) throw failure;
}
