import { execFile } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import {
  lstat,
  mkdir,
  open,
  readdir,
  rmdir,
  unlink,
} from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { classifyAttemptArtifacts } from './event-classifier.mjs';
import { canonicalJson } from './immutable.mjs';

const REQUEST_KEYS = ['version', 'slot_ordinal', 'packet_sha256', 'prompt_sha256', 'image_sha256s'];
const RECORD_KEYS = [
  'version',
  'invocation_id',
  'request_sha256',
  'events_sha256',
  'stderr_sha256',
  'final_sha256',
  'process',
  'classification',
];
const PROCESS_KEYS = [
  'exit_code',
  'timed_out',
  'spawn_failed',
  'local_io_before_final',
  'final_sha256',
  'metadata_present',
];
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const ATTEMPT_NAME = /^attempt-(00[1-3])$/;
const SHA256 = /^[0-9a-f]{64}$/;
const OPEN_NAMES = Object.freeze(['events.jsonl', 'request.json', 'stderr.bin']);
const FINAL_NAMES = Object.freeze([...OPEN_NAMES, 'final.raw.json'].sort());
const SEALED_NAMES = Object.freeze([...OPEN_NAMES, 'record.json'].sort());
const SEALED_FINAL_NAMES = Object.freeze([...FINAL_NAMES, 'record.json'].sort());
const execFileAsync = promisify(execFile);
const ATOMIC_RENAME_SCRIPT = String.raw`
import ctypes
import errno
import os
import sys

libc = ctypes.CDLL(None, use_errno=True)
source = os.fsencode(sys.argv[1])
target = os.fsencode(sys.argv[2])

if sys.platform == "darwin":
    rename_no_replace = libc.renamex_np
    rename_no_replace.argtypes = [
        ctypes.c_char_p,
        ctypes.c_char_p,
        ctypes.c_uint,
    ]
    rename_no_replace.restype = ctypes.c_int
    result = rename_no_replace(source, target, 0x00000004)
elif sys.platform.startswith("linux"):
    rename_no_replace = libc.renameat2
    rename_no_replace.argtypes = [
        ctypes.c_int,
        ctypes.c_char_p,
        ctypes.c_int,
        ctypes.c_char_p,
        ctypes.c_uint,
    ]
    rename_no_replace.restype = ctypes.c_int
    result = rename_no_replace(-100, source, -100, target, 0x00000001)
else:
    sys.exit(78)

if result != 0:
    error_number = ctypes.get_errno()
    if error_number == errno.EEXIST:
        sys.exit(errno.EEXIST)
    os.write(2, ("atomic rename failed with errno=%d\n" % error_number).encode())
    sys.exit(1)
`;

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

function exactKeys(value, keys) {
  if (value === null
    || typeof value !== 'object'
    || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype) {
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function validateRequest(value) {
  if (!exactKeys(value, REQUEST_KEYS)) throw new Error('Sanitized request must contain exact request keys');
  if (value.version !== 1 || !Number.isSafeInteger(value.slot_ordinal) || value.slot_ordinal <= 0) {
    throw new Error('Sanitized request version or slot ordinal is invalid');
  }
  if (!SHA256.test(value.packet_sha256) || !SHA256.test(value.prompt_sha256)) {
    throw new Error('Sanitized request hashes are invalid');
  }
  if (!Array.isArray(value.image_sha256s)
    || value.image_sha256s.some((entry) => !SHA256.test(entry))) {
    throw new Error('Sanitized request image hashes are invalid');
  }
  return {
    version: value.version,
    slot_ordinal: value.slot_ordinal,
    packet_sha256: value.packet_sha256,
    prompt_sha256: value.prompt_sha256,
    image_sha256s: [...value.image_sha256s],
  };
}

function requireIds(slotId, opaqueId) {
  if (!SAFE_ID.test(slotId) || !SAFE_ID.test(opaqueId)) {
    throw new Error('Attempt slot and opaque IDs must be safe');
  }
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function sameFileSnapshot(left, right) {
  return sameIdentity(left, right)
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs
    && left.nlink === right.nlink
    && left.mode === right.mode;
}

async function assertNonSymlinkDirectoryChain(directory, label) {
  const resolved = path.resolve(directory);
  const { root } = path.parse(resolved);
  let current = root;
  for (const component of resolved.slice(root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    const stat = await lstat(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(`${label} contains a symlink or non-directory parent`);
    }
  }
}

async function openPinnedDirectory(directory, label) {
  await assertNonSymlinkDirectoryChain(directory, label);
  const pathStat = await lstat(directory, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isDirectory()) {
    throw new Error(`${label} must be a non-symlink directory`);
  }
  const handle = await open(
    directory,
    constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW,
  );
  const handleStat = await handle.stat({ bigint: true });
  if (!handleStat.isDirectory() || !sameIdentity(pathStat, handleStat)) {
    await handle.close();
    throw new Error(`${label} changed while being pinned`);
  }
  return { handle, identity: handleStat };
}

async function revalidatePinnedDirectory(directory, pinned, label) {
  const handleStat = await pinned.handle.stat({ bigint: true });
  const pathStat = await lstat(directory, { bigint: true });
  if (!handleStat.isDirectory()
    || pathStat.isSymbolicLink()
    || !pathStat.isDirectory()
    || !sameIdentity(pinned.identity, handleStat)
    || !sameIdentity(handleStat, pathStat)) {
    throw new Error(`${label} changed after it was pinned`);
  }
}

async function ensureChildDirectory(parentPath, parentPin, name, label) {
  if (!SAFE_ID.test(name)) throw new Error(`${label} has an unsafe directory name`);
  await revalidatePinnedDirectory(parentPath, parentPin, `${label} parent`);
  const child = path.join(parentPath, name);
  try {
    await mkdir(child, { mode: 0o700 });
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
  }
  await revalidatePinnedDirectory(parentPath, parentPin, `${label} parent`);
  return { path: child, pin: await openPinnedDirectory(child, label) };
}

async function openHierarchy(sealedRoot, components, { create = false } = {}) {
  if (typeof sealedRoot !== 'string' || !path.isAbsolute(sealedRoot)) {
    throw new TypeError('sealedRoot must be absolute');
  }
  const paths = [path.resolve(sealedRoot)];
  const pins = [await openPinnedDirectory(paths[0], 'Sealed attempt root')];
  try {
    for (const [index, component] of components.entries()) {
      const parentPath = paths.at(-1);
      const parentPin = pins.at(-1);
      let child;
      if (create) {
        child = await ensureChildDirectory(
          parentPath,
          parentPin,
          component,
          `Sealed attempt directory ${index + 1}`,
        );
      } else {
        await revalidatePinnedDirectory(parentPath, parentPin, 'Sealed attempt parent');
        const childPath = path.join(parentPath, component);
        child = { path: childPath, pin: await openPinnedDirectory(childPath, 'Sealed attempt directory') };
      }
      paths.push(child.path);
      pins.push(child.pin);
    }
    return {
      path: paths.at(-1),
      pin: pins.at(-1),
      close: async () => {
        for (const pin of [...pins].reverse()) await pin.handle.close();
      },
    };
  } catch (error) {
    for (const pin of [...pins].reverse()) {
      try { await pin.handle.close(); } catch {}
    }
    throw error;
  }
}

function namesEqual(actual, expected) {
  return actual.length === expected.length
    && actual.every((name, index) => name === expected[index]);
}

function expectedNamesForPhase(actual, phase, label) {
  if (phase === 'open' && namesEqual(actual, OPEN_NAMES)) return OPEN_NAMES;
  if (phase === 'journal') {
    if (namesEqual(actual, OPEN_NAMES)) return OPEN_NAMES;
    if (namesEqual(actual, FINAL_NAMES)) return FINAL_NAMES;
  }
  if (phase === 'recoverable') {
    if (namesEqual(actual, OPEN_NAMES)) return OPEN_NAMES;
    if (namesEqual(actual, FINAL_NAMES)) return FINAL_NAMES;
    if (namesEqual(actual, SEALED_NAMES)) return SEALED_NAMES;
    if (namesEqual(actual, SEALED_FINAL_NAMES)) return SEALED_FINAL_NAMES;
  }
  if (phase === 'sealed') {
    if (namesEqual(actual, SEALED_NAMES)) return SEALED_NAMES;
    if (namesEqual(actual, SEALED_FINAL_NAMES)) return SEALED_FINAL_NAMES;
  }
  throw new Error(`${label} has an extra, missing, or unexpected artifact inventory`);
}

async function readRegularArtifact(filename, label, seenInodes) {
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isFile()) {
    throw new Error(`${label} must be a regular non-symlink file`);
  }
  if (pathStat.nlink !== 1n) throw new Error(`${label} has forbidden hardlink count`);
  if ((pathStat.mode & 0o777n) !== 0o600n) throw new Error(`${label} must have mode 0600`);
  const inodeKey = `${pathStat.dev}:${pathStat.ino}`;
  if (seenInodes.has(inodeKey)) throw new Error(`${label} aliases another artifact inode`);

  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile()
      || before.nlink !== 1n
      || !sameIdentity(pathStat, before)
      || (before.mode & 0o777n) !== 0o600n) {
      throw new Error(`${label} changed before read`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(filename, { bigint: true });
    if (!sameFileSnapshot(before, after)
      || pathAfter.isSymbolicLink()
      || pathAfter.nlink !== 1n
      || !sameFileSnapshot(after, pathAfter)) {
      throw new Error(`${label} changed while reading`);
    }
    seenInodes.add(inodeKey);
    return { bytes, identity: after };
  } finally {
    await handle.close();
  }
}

async function readInventory(directory, pin, phase, label) {
  await revalidatePinnedDirectory(directory, pin, label);
  const names = (await readdir(directory)).sort();
  const expected = expectedNamesForPhase(names, phase, label);
  const seenInodes = new Set();
  const files = new Map();
  for (const name of expected) {
    files.set(
      name,
      await readRegularArtifact(path.join(directory, name), `${label}/${name}`, seenInodes),
    );
  }
  const namesAfter = (await readdir(directory)).sort();
  if (!namesEqual(namesAfter, expected)) {
    throw new Error(`${label} artifact inventory changed while reading`);
  }
  await revalidatePinnedDirectory(directory, pin, label);
  return { files, names: expected };
}

function decodeJson(bytes, label) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${label} is not valid UTF-8`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} is not valid JSON`);
  }
}

function validateRequestArtifact(bytes) {
  const request = validateRequest(decodeJson(bytes, 'Attempt request'));
  if (!Buffer.from(canonicalJson(request)).equals(bytes)) {
    throw new Error('Attempt request does not use canonical serialization');
  }
  return request;
}

async function loadJournal(journalPath, {
  phase = 'journal',
  expectedIdentity = null,
} = {}) {
  const pin = await openPinnedDirectory(journalPath, 'Attempt journal');
  try {
    if (expectedIdentity !== null && !sameIdentity(pin.identity, expectedIdentity)) {
      throw new Error('Attempt journal directory identity changed');
    }
    const inventory = await readInventory(journalPath, pin, phase, 'Attempt journal');
    const requestBytes = inventory.files.get('request.json').bytes;
    return {
      pinIdentity: pin.identity,
      names: inventory.names,
      files: inventory.files,
      requestBytes,
      eventsBytes: inventory.files.get('events.jsonl').bytes,
      stderrBytes: inventory.files.get('stderr.bin').bytes,
      finalBytes: inventory.files.get('final.raw.json')?.bytes ?? null,
      recordBytes: inventory.files.get('record.json')?.bytes ?? null,
      request: validateRequestArtifact(requestBytes),
    };
  } finally {
    await pin.handle.close();
  }
}

async function writeExclusiveInPinnedDirectory(directory, pin, name, bytes) {
  await revalidatePinnedDirectory(directory, pin, 'Attempt artifact parent');
  const target = path.join(directory, name);
  const handle = await open(
    target,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    await handle.writeFile(bytes);
    await handle.sync();
    const handleStat = await handle.stat({ bigint: true });
    const pathStat = await lstat(target, { bigint: true });
    if (!handleStat.isFile()
      || handleStat.nlink !== 1n
      || pathStat.isSymbolicLink()
      || pathStat.nlink !== 1n
      || !sameIdentity(handleStat, pathStat)
      || (handleStat.mode & 0o777n) !== 0o600n) {
      throw new Error(`Attempt artifact ${name} was not published as one private regular file`);
    }
  } finally {
    await handle.close();
  }
  await revalidatePinnedDirectory(directory, pin, 'Attempt artifact parent');
}

async function appendDurable(journalPath, expectedIdentity, artifactName, bytes) {
  if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) {
    throw new TypeError('Attempt stream append requires bytes');
  }
  const pin = await openPinnedDirectory(journalPath, 'Attempt journal');
  try {
    if (!sameIdentity(pin.identity, expectedIdentity)) {
      throw new Error('Attempt journal directory identity changed before append');
    }
    await readInventory(journalPath, pin, 'open', 'Attempt journal');
    const target = path.join(journalPath, artifactName);
    const pathStat = await lstat(target, { bigint: true });
    if (pathStat.isSymbolicLink() || !pathStat.isFile() || pathStat.nlink !== 1n) {
      throw new Error('Attempt stream must be one regular non-symlink file');
    }
    const handle = await open(
      target,
      constants.O_APPEND | constants.O_WRONLY | constants.O_NOFOLLOW,
    );
    try {
      const before = await handle.stat({ bigint: true });
      if (!before.isFile() || before.nlink !== 1n || !sameIdentity(before, pathStat)) {
        throw new Error('Attempt stream changed before append');
      }
      await handle.writeFile(bytes);
      await handle.sync();
      const after = await handle.stat({ bigint: true });
      const pathAfter = await lstat(target, { bigint: true });
      if (!after.isFile()
        || after.nlink !== 1n
        || pathAfter.isSymbolicLink()
        || pathAfter.nlink !== 1n
        || !sameIdentity(after, pathAfter)) {
        throw new Error('Attempt stream changed during append');
      }
    } finally {
      await handle.close();
    }
    await readInventory(journalPath, pin, 'open', 'Attempt journal');
    await pin.handle.sync();
  } finally {
    await pin.handle.close();
  }
}

export async function claimAttemptJournal({ sealedRoot, slotId, opaqueId, request } = {}) {
  if (typeof sealedRoot !== 'string' || !path.isAbsolute(sealedRoot)) {
    throw new TypeError('sealedRoot must be absolute');
  }
  requireIds(slotId, opaqueId);
  const sanitized = validateRequest(request);
  const hierarchy = await openHierarchy(sealedRoot, ['inflight', slotId], { create: true });
  const slotInflight = hierarchy.path;
  const journalPath = path.join(slotInflight, opaqueId);
  let journalPin = null;
  try {
    await revalidatePinnedDirectory(slotInflight, hierarchy.pin, 'Inflight slot');
    try {
      await mkdir(journalPath, { mode: 0o700 });
    } catch (error) {
      if (error?.code === 'EEXIST') {
        throw new Error('Attempt journal claim already exists', { cause: error });
      }
      throw error;
    }
    journalPin = await openPinnedDirectory(journalPath, 'Attempt journal');
    await revalidatePinnedDirectory(slotInflight, hierarchy.pin, 'Inflight slot');
    await writeExclusiveInPinnedDirectory(
      journalPath,
      journalPin,
      'request.json',
      Buffer.from(canonicalJson(sanitized)),
    );
    await writeExclusiveInPinnedDirectory(journalPath, journalPin, 'events.jsonl', Buffer.alloc(0));
    await writeExclusiveInPinnedDirectory(journalPath, journalPin, 'stderr.bin', Buffer.alloc(0));
    await journalPin.handle.sync();
    await hierarchy.pin.handle.sync();
    await readInventory(journalPath, journalPin, 'open', 'Attempt journal');
    const journalIdentity = journalPin.identity;
    return Object.freeze({
      path: journalPath,
      appendEvents: (bytes) => appendDurable(
        journalPath,
        journalIdentity,
        'events.jsonl',
        bytes,
      ),
      appendStderr: (bytes) => appendDurable(
        journalPath,
        journalIdentity,
        'stderr.bin',
        bytes,
      ),
      writeFinal: async (bytes) => {
        if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) {
          throw new TypeError('Final artifact requires bytes');
        }
        const pin = await openPinnedDirectory(journalPath, 'Attempt journal');
        try {
          if (!sameIdentity(pin.identity, journalIdentity)) {
            throw new Error('Attempt journal directory identity changed before final write');
          }
          const beforeFinal = await readInventory(journalPath, pin, 'journal', 'Attempt journal');
          if (beforeFinal.files.has('final.raw.json')) {
            throw new Error('Final artifact already exists');
          }
          try {
            await writeExclusiveInPinnedDirectory(
              journalPath,
              pin,
              'final.raw.json',
              Buffer.from(bytes),
            );
          } catch (error) {
            if (error?.code === 'EEXIST') {
              throw new Error('Final artifact already exists', { cause: error });
            }
            throw error;
          }
          await pin.handle.sync();
          await readInventory(journalPath, pin, 'journal', 'Attempt journal');
        } finally {
          await pin.handle.close();
        }
      },
    });
  } finally {
    if (journalPin !== null) await journalPin.handle.close();
    await hierarchy.close();
  }
}

function normalizeProcess(process, incomplete) {
  const source = process ?? {};
  return {
    exit_code: Number.isInteger(source.exit_code) ? source.exit_code : null,
    timed_out: source.timed_out === true,
    spawn_failed: source.spawn_failed === true,
    local_io_before_final: incomplete || source.local_io_before_final === true,
    final_sha256: typeof source.final_sha256 === 'string' ? source.final_sha256 : null,
    metadata_present: process !== null && process !== undefined,
  };
}

async function scanAttemptSlot(slotPath, slotPin) {
  await revalidatePinnedDirectory(slotPath, slotPin, 'Attempt slot');
  const names = (await readdir(slotPath)).sort();
  for (const name of names) {
    if (!ATTEMPT_NAME.test(name)) {
      throw new Error(`Attempt slot contains an unexpected untrusted entry: ${name}`);
    }
  }
  const expected = Array.from(
    { length: names.length },
    (_, index) => `attempt-${String(index + 1).padStart(3, '0')}`,
  );
  if (names.length > 3 || !namesEqual(names, expected)) {
    throw new Error('Attempt ordinals must be exact contiguous directories without gaps');
  }
  for (const name of names) {
    const attemptPath = path.join(slotPath, name);
    const attemptPin = await openPinnedDirectory(attemptPath, `Sealed attempt ${name}`);
    await attemptPin.handle.close();
    await loadJournal(attemptPath, { phase: 'sealed' });
  }
  await revalidatePinnedDirectory(slotPath, slotPin, 'Attempt slot');
  return names.length;
}

async function attemptDestination(sealedRoot, slotId) {
  const hierarchy = await openHierarchy(sealedRoot, [slotId], { create: true });
  try {
    const count = await scanAttemptSlot(hierarchy.path, hierarchy.pin);
    if (count >= 3) throw new Error('Attempt limit reached; immutable attempts cannot be overwritten');
    return {
      hierarchy,
      target: path.join(
        hierarchy.path,
        `attempt-${String(count + 1).padStart(3, '0')}`,
      ),
    };
  } catch (error) {
    await hierarchy.close();
    throw error;
  }
}

async function environmentStopDestination(sealedRoot, slotId, opaqueId) {
  const hierarchy = await openHierarchy(
    sealedRoot,
    ['environment-stops', slotId],
    { create: true },
  );
  return { hierarchy, target: path.join(hierarchy.path, opaqueId) };
}

async function writeRecord(journalPath, expectedIdentity, recordBytes) {
  const pin = await openPinnedDirectory(journalPath, 'Attempt journal');
  try {
    if (!sameIdentity(pin.identity, expectedIdentity)) {
      throw new Error('Attempt journal directory identity changed before record write');
    }
    await readInventory(journalPath, pin, 'journal', 'Attempt journal');
    await writeExclusiveInPinnedDirectory(
      journalPath,
      pin,
      'record.json',
      recordBytes,
    );
    await pin.handle.sync();
    return await readInventory(journalPath, pin, 'sealed', 'Attempt journal');
  } finally {
    await pin.handle.close();
  }
}

async function removeOwnedRecord(journalPath, expectedIdentity) {
  let pin;
  try {
    pin = await openPinnedDirectory(journalPath, 'Attempt journal');
  } catch {
    return;
  }
  try {
    if (!sameIdentity(pin.identity, expectedIdentity)) return;
    const inventory = await readInventory(journalPath, pin, 'sealed', 'Attempt journal');
    const record = inventory.files.get('record.json');
    const pathStat = await lstat(path.join(journalPath, 'record.json'), { bigint: true });
    if (!sameIdentity(record.identity, pathStat) || pathStat.nlink !== 1n) return;
    await unlink(path.join(journalPath, 'record.json'));
    await pin.handle.sync();
    await readInventory(journalPath, pin, 'journal', 'Attempt journal');
  } finally {
    await pin.handle.close();
  }
}

async function removeSourceJournal(journalPath, expectedIdentity, expectedFiles) {
  const parentPath = path.dirname(journalPath);
  let parentPin = null;
  let journalPin = null;
  try {
    parentPin = await openPinnedDirectory(parentPath, 'Inflight slot');
    journalPin = await openPinnedDirectory(journalPath, 'Attempt journal');
    if (!sameIdentity(journalPin.identity, expectedIdentity)) {
      throw new Error('Attempt journal directory changed before source removal');
    }
    const inventory = await readInventory(journalPath, journalPin, 'sealed', 'Attempt journal');
    for (const name of inventory.names) {
      const expected = expectedFiles.get(name);
      const actual = inventory.files.get(name);
      if (expected === undefined || !actual.bytes.equals(expected.bytes)) {
        throw new Error(`Attempt journal ${name} changed before source removal`);
      }
    }
    for (const name of inventory.names) {
      const artifactPath = path.join(journalPath, name);
      const pathStat = await lstat(artifactPath, { bigint: true });
      if (!sameIdentity(pathStat, inventory.files.get(name).identity) || pathStat.nlink !== 1n) {
        throw new Error(`Attempt journal ${name} changed before unlink`);
      }
      await unlink(artifactPath);
    }
    await journalPin.handle.sync();
    await revalidatePinnedDirectory(journalPath, journalPin, 'Attempt journal');
    await journalPin.handle.close();
    journalPin = null;
    await rmdir(journalPath);
    await parentPin.handle.sync();
    await revalidatePinnedDirectory(parentPath, parentPin, 'Inflight slot');
  } finally {
    if (journalPin !== null) await journalPin.handle.close();
    if (parentPin !== null) await parentPin.handle.close();
  }
}

async function atomicRenameNoReplace(source, target) {
  try {
    await execFileAsync(
      '/usr/bin/python3',
      ['-I', '-c', ATOMIC_RENAME_SCRIPT, source, target],
      {
        cwd: '/private/tmp',
        env: { LANG: 'C', PATH: '/usr/bin:/bin' },
        maxBuffer: 4096,
      },
    );
  } catch (error) {
    if (error?.code === 17) {
      const conflict = new Error('No-replace promotion target already exists', { cause: error });
      conflict.code = 'EEXIST';
      throw conflict;
    }
    throw new Error('Atomic no-replace promotion failed', { cause: error });
  }
}

function inventoriesMatch(left, right) {
  if (!namesEqual(left.names, right.names)) return false;
  return left.names.every((name) => (
    left.files.get(name)?.bytes.equals(right.files.get(name)?.bytes) === true
  ));
}

async function reconcilePublishedSource({
  sealedRoot,
  slotId,
  target,
  journalPath,
  journalIdentity,
  sourceInventory,
}) {
  let sourcePin = null;
  let targetPin = null;
  let sourceParentPin = null;
  let quarantine = null;
  try {
    sourcePin = await openPinnedDirectory(journalPath, 'Duplicate inflight journal');
    if (!sameIdentity(sourcePin.identity, journalIdentity)) {
      throw new Error('Duplicate inflight journal identity changed');
    }
    const source = await readInventory(
      journalPath,
      sourcePin,
      'sealed',
      'Duplicate inflight journal',
    );
    if (!inventoriesMatch(source, sourceInventory)) {
      throw new Error('Duplicate inflight journal differs from its sealed record');
    }

    targetPin = await openPinnedDirectory(target, 'Already-published attempt target');
    const published = await readInventory(
      target,
      targetPin,
      'sealed',
      'Already-published attempt target',
    );
    if (!inventoriesMatch(source, published)) {
      throw new Error('Already-published target differs from sealed inflight journal');
    }

    sourceParentPin = await openPinnedDirectory(
      path.dirname(journalPath),
      'Inflight slot before reconciliation',
    );
    quarantine = await openHierarchy(
      sealedRoot,
      ['reconciled-sources', slotId],
      { create: true },
    );
    const quarantined = path.join(quarantine.path, `source-${randomUUID()}`);
    await revalidatePinnedDirectory(journalPath, sourcePin, 'Duplicate inflight journal');
    await revalidatePinnedDirectory(target, targetPin, 'Already-published attempt target');
    await atomicRenameNoReplace(journalPath, quarantined);

    const movedStat = await lstat(quarantined, { bigint: true });
    const handleStat = await sourcePin.handle.stat({ bigint: true });
    if (movedStat.isSymbolicLink()
      || !movedStat.isDirectory()
      || !sameIdentity(journalIdentity, handleStat)
      || !sameIdentity(handleStat, movedStat)) {
      throw new Error('Duplicate inflight journal changed during reconciliation');
    }
    await sourcePin.handle.sync();
    await sourceParentPin.handle.sync();
    await quarantine.pin.handle.sync();
    await targetPin.handle.sync();
    await revalidatePinnedDirectory(target, targetPin, 'Already-published attempt target');

    await sourcePin.handle.close();
    sourcePin = null;
    try {
      await removeSourceJournal(quarantined, journalIdentity, sourceInventory.files);
    } catch {
      // The atomic move already removed the duplicate from inflight. A
      // quarantined cleanup remnant is non-authoritative and can be audited.
    }
    return target;
  } finally {
    if (sourcePin !== null) await sourcePin.handle.close();
    if (targetPin !== null) await targetPin.handle.close();
    if (sourceParentPin !== null) await sourceParentPin.handle.close();
    if (quarantine !== null) await quarantine.close();
  }
}

async function publishNoReplace({
  sealedRoot,
  slotId,
  destination,
  journalPath,
  journalIdentity,
  sourceInventory,
}) {
  const { hierarchy, target } = destination;
  const targetParent = hierarchy.path;
  const sourceParent = path.dirname(journalPath);
  let sourcePin = null;
  let sourceParentPin = null;
  let conflict = null;
  try {
    sourcePin = await openPinnedDirectory(journalPath, 'Sealed inflight journal');
    if (!sameIdentity(sourcePin.identity, journalIdentity)) {
      throw new Error('Sealed inflight journal identity changed before publication');
    }
    const source = await readInventory(
      journalPath,
      sourcePin,
      'sealed',
      'Sealed inflight journal',
    );
    if (!inventoriesMatch(source, sourceInventory)) {
      throw new Error('Sealed inflight journal differs before publication');
    }
    sourceParentPin = await openPinnedDirectory(sourceParent, 'Inflight slot');
    await revalidatePinnedDirectory(targetParent, hierarchy.pin, 'Promotion target parent');
    try {
      await atomicRenameNoReplace(journalPath, target);
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      conflict = error;
    }
    if (conflict === null) {
      const targetStat = await lstat(target, { bigint: true });
      const handleStat = await sourcePin.handle.stat({ bigint: true });
      if (targetStat.isSymbolicLink()
        || !targetStat.isDirectory()
        || !sameIdentity(journalIdentity, handleStat)
        || !sameIdentity(handleStat, targetStat)) {
        throw new Error('Promotion target changed during atomic publication');
      }
      await sourcePin.handle.sync();
      await sourceParentPin.handle.sync();
      await hierarchy.pin.handle.sync();
      return target;
    }
  } finally {
    if (sourcePin !== null) await sourcePin.handle.close();
    if (sourceParentPin !== null) await sourceParentPin.handle.close();
  }
  return reconcilePublishedSource({
    sealedRoot,
    slotId,
    target,
    journalPath,
    journalIdentity,
    sourceInventory,
  });
}

function verifyLoadedRecord(loaded) {
  if (loaded.recordBytes === null) throw new Error('Sealed attempt record is missing');
  const stored = decodeJson(loaded.recordBytes, 'Attempt record');
  validateStoredRecord(stored);
  if (!Buffer.from(canonicalJson(stored)).equals(loaded.recordBytes)) {
    throw new Error('Attempt record does not use canonical serialization');
  }
  const hashes = {
    request_sha256: hash(loaded.requestBytes),
    events_sha256: hash(loaded.eventsBytes),
    stderr_sha256: hash(loaded.stderrBytes),
    final_sha256: loaded.finalBytes === null ? null : hash(loaded.finalBytes),
  };
  for (const [key, value] of Object.entries(hashes)) {
    if (stored[key] !== value) throw new Error(`Attempt record hash drift: ${key}`);
  }
  const process = stored.process;
  const classification = classifyAttemptArtifacts({
    eventsBytes: loaded.eventsBytes,
    stderrBytes: loaded.stderrBytes,
    finalBytes: loaded.finalBytes,
    finalSha256: process.final_sha256 ?? hashes.final_sha256,
    processExitCode: process.exit_code,
    timedOut: process.timed_out,
    spawnFailed: process.spawn_failed,
    localIoBeforeFinal: process.local_io_before_final,
  });
  if (canonicalJson(classification) !== canonicalJson(stored.classification)) {
    throw new Error('Attempt classification drift');
  }
  return { stored, classification, hashes };
}

async function findPublishedAttemptMatch(sealedRoot, slotId, sourceInventory) {
  let hierarchy;
  try {
    hierarchy = await openHierarchy(sealedRoot, [slotId]);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
  try {
    await scanAttemptSlot(hierarchy.path, hierarchy.pin);
    const names = (await readdir(hierarchy.path)).sort();
    const matches = [];
    for (const name of names) {
      const candidatePath = path.join(hierarchy.path, name);
      const candidate = await loadJournal(candidatePath, { phase: 'sealed' });
      if (inventoriesMatch(sourceInventory, candidate)) matches.push(candidatePath);
    }
    if (matches.length > 1) {
      throw new Error('Multiple immutable attempts duplicate one sealed inflight journal');
    }
    return matches[0] ?? null;
  } finally {
    await hierarchy.close();
  }
}

async function promote({ sealedRoot, slotId, journalPath, process, incomplete = false }) {
  if (typeof sealedRoot !== 'string' || !path.isAbsolute(sealedRoot) || !SAFE_ID.test(slotId)) {
    throw new TypeError('Attempt promotion root or slot is invalid');
  }
  const resolvedRoot = path.resolve(sealedRoot);
  const expectedParent = path.join(resolvedRoot, 'inflight', slotId);
  const resolvedJournal = path.resolve(journalPath);
  if (path.dirname(resolvedJournal) !== expectedParent || !SAFE_ID.test(path.basename(resolvedJournal))) {
    throw new Error('Journal path is outside the claimed inflight slot');
  }
  const loaded = await loadJournal(resolvedJournal, { phase: 'recoverable' });
  const hasStoredRecord = loaded.recordBytes !== null;
  let normalizedProcess;
  let classification;
  let record = null;
  let sourceInventory = loaded;
  if (hasStoredRecord) {
    const verified = verifyLoadedRecord(loaded);
    if (verified.stored.invocation_id !== path.basename(resolvedJournal)) {
      throw new Error('Inflight attempt record invocation identity does not match its journal');
    }
    normalizedProcess = verified.stored.process;
    classification = verified.classification;
    if (classification.classification !== 'fatal_environment') {
      const publishedMatch = await findPublishedAttemptMatch(
        resolvedRoot,
        slotId,
        sourceInventory,
      );
      if (publishedMatch !== null) {
        const target = await reconcilePublishedSource({
          sealedRoot: resolvedRoot,
          slotId,
          target: publishedMatch,
          journalPath: resolvedJournal,
          journalIdentity: loaded.pinIdentity,
          sourceInventory,
        });
        return Object.freeze({
          path: target,
          classification,
          process_metadata_present: normalizedProcess.metadata_present,
        });
      }
    }
  } else {
    normalizedProcess = normalizeProcess(process, incomplete);
    const computedFinalSha = loaded.finalBytes === null ? null : hash(loaded.finalBytes);
    const expectedFinalSha = normalizedProcess.final_sha256 ?? computedFinalSha;
    classification = classifyAttemptArtifacts({
      eventsBytes: loaded.eventsBytes,
      stderrBytes: loaded.stderrBytes,
      finalBytes: loaded.finalBytes,
      finalSha256: expectedFinalSha,
      processExitCode: normalizedProcess.exit_code,
      timedOut: normalizedProcess.timed_out,
      spawnFailed: normalizedProcess.spawn_failed,
      localIoBeforeFinal: normalizedProcess.local_io_before_final,
    });
    record = {
      version: 1,
      invocation_id: path.basename(resolvedJournal),
      request_sha256: hash(loaded.requestBytes),
      events_sha256: hash(loaded.eventsBytes),
      stderr_sha256: hash(loaded.stderrBytes),
      final_sha256: computedFinalSha,
      process: normalizedProcess,
      classification,
    };
  }
  const destination = classification.classification === 'fatal_environment'
    ? await environmentStopDestination(
        resolvedRoot,
        slotId,
        path.basename(resolvedJournal),
      )
    : await attemptDestination(resolvedRoot, slotId);
  let recordCreatedThisCall = false;
  let promoted = false;
  try {
    if (!hasStoredRecord) {
      sourceInventory = await writeRecord(
        resolvedJournal,
        loaded.pinIdentity,
        Buffer.from(canonicalJson(record)),
      );
      recordCreatedThisCall = true;
    }
    const target = await publishNoReplace({
      sealedRoot: resolvedRoot,
      slotId,
      destination,
      journalPath: resolvedJournal,
      journalIdentity: loaded.pinIdentity,
      sourceInventory,
    });
    promoted = true;
    return Object.freeze({
      path: target,
      classification,
      process_metadata_present: normalizedProcess.metadata_present,
    });
  } finally {
    if (!promoted && recordCreatedThisCall) {
      await removeOwnedRecord(resolvedJournal, loaded.pinIdentity);
    }
    await destination.hierarchy.close();
  }
}

export async function finalizeAttemptJournal({
  sealedRoot,
  slotId,
  journalPath,
  process,
} = {}) {
  return promote({
    sealedRoot,
    slotId,
    journalPath,
    process,
    incomplete: false,
  });
}

export async function recoverAttemptJournals({ sealedRoot, slotId } = {}) {
  if (typeof sealedRoot !== 'string' || !path.isAbsolute(sealedRoot) || !SAFE_ID.test(slotId)) {
    throw new TypeError('Recovery root or slot is invalid');
  }
  let hierarchy;
  try {
    hierarchy = await openHierarchy(sealedRoot, ['inflight', slotId]);
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  let names;
  try {
    names = (await readdir(hierarchy.path)).sort();
    for (const name of names) {
      if (!SAFE_ID.test(name)) throw new Error('Inflight journal entry name is unsafe');
      const journalPath = path.join(hierarchy.path, name);
      const pin = await openPinnedDirectory(journalPath, 'Inflight journal entry');
      await pin.handle.close();
    }
    await revalidatePinnedDirectory(hierarchy.path, hierarchy.pin, 'Inflight slot');
  } finally {
    await hierarchy.close();
  }
  const results = [];
  for (const name of names) {
    results.push(await promote({
      sealedRoot,
      slotId,
      journalPath: path.join(sealedRoot, 'inflight', slotId, name),
      process: null,
      incomplete: true,
    }));
  }
  return results;
}

function validateStoredRecord(stored) {
  if (!exactKeys(stored, RECORD_KEYS) || stored.version !== 1) {
    throw new Error('Attempt record must contain the exact sealed record schema');
  }
  if (!SHA256.test(stored.request_sha256)
    || !SHA256.test(stored.events_sha256)
    || !SHA256.test(stored.stderr_sha256)
    || (stored.final_sha256 !== null && !SHA256.test(stored.final_sha256))) {
    throw new Error('Attempt record contains an invalid artifact hash');
  }
  if (!SAFE_ID.test(stored.invocation_id)) {
    throw new Error('Attempt record contains an invalid invocation identity');
  }
  if (!exactKeys(stored.process, PROCESS_KEYS)
    || (stored.process.exit_code !== null && !Number.isInteger(stored.process.exit_code))
    || typeof stored.process.timed_out !== 'boolean'
    || typeof stored.process.spawn_failed !== 'boolean'
    || typeof stored.process.local_io_before_final !== 'boolean'
    || (stored.process.final_sha256 !== null && !SHA256.test(stored.process.final_sha256))
    || typeof stored.process.metadata_present !== 'boolean') {
    throw new Error('Attempt record process metadata is invalid');
  }
}

export async function verifyAttemptRecord(recordPath) {
  if (typeof recordPath !== 'string' || !path.isAbsolute(recordPath)) {
    throw new TypeError('recordPath must be absolute');
  }
  const loaded = await loadJournal(path.resolve(recordPath), { phase: 'sealed' });
  const { classification, hashes } = verifyLoadedRecord(loaded);
  return Object.freeze({ classification, hashes: Object.freeze(hashes) });
}
