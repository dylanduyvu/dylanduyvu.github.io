import { spawn as spawnProcess } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants, readFileSync } from 'node:fs';
import {
  chmod, lstat, mkdir, mkdtemp, open, rename, rm, rmdir, writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const FEATURE_DISABLES = Object.freeze([
  'shell_tool',
  'unified_exec',
  'code_mode',
  'code_mode_host',
  'code_mode_only',
  'multi_agent',
  'apps',
  'browser_use',
  'browser_use_external',
  'browser_use_full_cdp_access',
  'computer_use',
  'in_app_browser',
  'image_generation',
  'goals',
  'hooks',
  'skill_mcp_dependency_install',
  'tool_suggest',
  'tool_call_mcp_elicitation',
  'deferred_executor',
  'request_permissions_tool',
  'standalone_web_search',
  'enable_mcp_apps',
]);
const TIMEOUT_MS = 1_200_000;
const TERMINATION_GRACE_MS = 5_000;
const PREDICTOR_INSTRUCTION_SHA256 = 'a5a4eab6d2fd808c9da75a65acbee8820b5d74caddc19d123b8a07508e98a10a';
const PREDICTOR_INSTRUCTION_BYTES = readFileSync(new URL('../predictor-instruction.txt', import.meta.url));
if (createHash('sha256').update(PREDICTOR_INSTRUCTION_BYTES).digest('hex') !== PREDICTOR_INSTRUCTION_SHA256) {
  throw new Error('Frozen predictor instruction artifact hash mismatch');
}
const PREDICTOR_INSTRUCTION = new TextDecoder('utf-8', { fatal: true }).decode(PREDICTOR_INSTRUCTION_BYTES);

function requireAbsolute(value, label) {
  if (typeof value !== 'string' || !path.isAbsolute(value)) throw new TypeError(`${label} must be an absolute path`);
}

export function buildCodexArgs({ instruction, schemaPath, finalPath, cwd, imagePaths = [] } = {}) {
  if (instruction === undefined) instruction = PREDICTOR_INSTRUCTION;
  if (instruction !== PREDICTOR_INSTRUCTION) {
    throw new Error('Developer instruction must match the frozen authenticated artifact');
  }
  requireAbsolute(schemaPath, 'schemaPath');
  requireAbsolute(finalPath, 'finalPath');
  requireAbsolute(cwd, 'cwd');
  if (!Array.isArray(imagePaths)) throw new TypeError('imagePaths must be an array');
  for (const imagePath of imagePaths) requireAbsolute(imagePath, 'image path');
  const args = [
    '-a', 'never',
    'exec',
    '--strict-config',
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox', 'read-only',
    '--model', 'gpt-5.6-sol',
    '-c', 'model_reasoning_effort="max"',
    '-c', 'service_tier="priority"',
    '-c', `developer_instructions=${JSON.stringify(instruction)}`,
  ];
  for (const name of FEATURE_DISABLES) args.push('-c', `features.${name}=false`);
  args.push('-c', 'web_search="disabled"');
  args.push(
    '--output-schema', schemaPath,
    '--json',
    '--output-last-message', finalPath,
    '--cd', cwd,
  );
  for (const imagePath of imagePaths) args.push('--image', imagePath);
  args.push('--', '-');
  return Object.freeze({ executable: 'codex', args: Object.freeze(args) });
}

async function assertNonSymlinkDirectoryChain(directory, label) {
  const resolved = path.resolve(directory);
  const { root } = path.parse(resolved);
  let current = root;
  for (const component of resolved.slice(root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    const componentStat = await lstat(current);
    if (componentStat.isSymbolicLink() || !componentStat.isDirectory()) {
      throw new Error(`${label} contains a symlink or non-directory component`);
    }
  }
}

async function secureAuthCopy(source, target) {
  let sourceHandle = null;
  try {
    const parent = path.dirname(path.resolve(source));
    await assertNonSymlinkDirectoryChain(parent, 'Authenticated auth.json parent');
    const sourceStat = await lstat(source, { bigint: true });
    if (sourceStat.isSymbolicLink() || !sourceStat.isFile() || sourceStat.nlink !== 1n) {
      throw new Error('unsafe auth leaf');
    }
    sourceHandle = await open(source, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = await sourceHandle.stat({ bigint: true });
    if (!before.isFile()
      || before.dev !== sourceStat.dev
      || before.ino !== sourceStat.ino
      || before.nlink !== 1n) {
      throw new Error('auth identity changed before read');
    }
    const bytes = await sourceHandle.readFile();
    const after = await sourceHandle.stat({ bigint: true });
    const pathAfter = await lstat(source, { bigint: true });
    if (before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
      || after.nlink !== 1n
      || pathAfter.isSymbolicLink()
      || pathAfter.dev !== after.dev
      || pathAfter.ino !== after.ino
      || pathAfter.nlink !== 1n) {
      throw new Error('auth identity changed during read');
    }
    await writeFile(target, bytes, { flag: 'wx', mode: 0o600 });
    await chmod(target, 0o600);
  } catch {
    throw new Error('Authenticated auth.json source could not be copied safely');
  } finally {
    if (sourceHandle !== null) await sourceHandle.close();
  }
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

async function openPinnedDirectory(directory, label) {
  await assertNonSymlinkDirectoryChain(directory, label);
  const pathStat = await lstat(directory, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isDirectory()) {
    throw new Error(`${label} must be a non-symlink directory`);
  }
  const handle = await open(directory, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
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

function sameFileSnapshot(left, right) {
  return sameIdentity(left, right)
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs
    && left.nlink === right.nlink
    && left.mode === right.mode;
}

async function closeHandle(handle) {
  if (handle === null || handle === undefined) return;
  try { await handle.close(); } catch {}
}

async function quarantineAndRemoveOwnedTree({
  root,
  rootPin,
  label,
  mutableDirectories = [],
}) {
  let pathStat;
  try {
    pathStat = await lstat(root, { bigint: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }
  const handleStat = await rootPin.handle.stat({ bigint: true });
  if (pathStat.isSymbolicLink()
    || !pathStat.isDirectory()
    || !handleStat.isDirectory()
    || !sameIdentity(rootPin.identity, handleStat)
    || !sameIdentity(handleStat, pathStat)) {
    throw new Error(`${label} changed before cleanup`);
  }

  const parentPath = path.dirname(root);
  const parentPin = await openPinnedDirectory(parentPath, `${label} parent`);
  let quarantineRoot = null;
  let quarantinePin = null;
  try {
    await revalidatePinnedDirectory(parentPath, parentPin, `${label} parent`);
    await revalidatePinnedDirectory(root, rootPin, label);
    quarantineRoot = await mkdtemp(path.join(parentPath, 'nap-v5-delete-'));
    quarantinePin = await openPinnedDirectory(quarantineRoot, `${label} quarantine`);
    const quarantinedRoot = path.join(quarantineRoot, 'captured');

    await revalidatePinnedDirectory(parentPath, parentPin, `${label} parent`);
    await revalidatePinnedDirectory(root, rootPin, label);
    await rootPin.handle.chmod(0o700);
    await rootPin.handle.sync();
    await rename(root, quarantinedRoot);
    await parentPin.handle.sync();
    await quarantinePin.handle.sync();

    const movedPathStat = await lstat(quarantinedRoot, { bigint: true });
    const movedHandleStat = await rootPin.handle.stat({ bigint: true });
    if (movedPathStat.isSymbolicLink()
      || !movedPathStat.isDirectory()
      || !sameIdentity(rootPin.identity, movedHandleStat)
      || !sameIdentity(movedHandleStat, movedPathStat)) {
      throw new Error(`${label} identity changed while entering quarantine`);
    }

    for (const { relativePath, pin } of mutableDirectories) {
      const movedDirectory = path.join(quarantinedRoot, relativePath);
      const movedDirectoryStat = await lstat(movedDirectory, { bigint: true });
      const movedDirectoryHandleStat = await pin.handle.stat({ bigint: true });
      if (movedDirectoryStat.isSymbolicLink()
        || !movedDirectoryStat.isDirectory()
        || !sameIdentity(pin.identity, movedDirectoryHandleStat)
        || !sameIdentity(movedDirectoryHandleStat, movedDirectoryStat)) {
        throw new Error(`${label} child changed before cleanup`);
      }
    }

    for (const { pin } of mutableDirectories) await pin.handle.chmod(0o700);
    await rootPin.handle.sync();

    await revalidatePinnedDirectory(quarantinedRoot, rootPin, `${label} quarantine target`);
    await rm(quarantinedRoot, { recursive: true, force: true });
    await quarantinePin.handle.sync();
    await parentPin.handle.sync();
  } finally {
    if (quarantinePin !== null) await quarantinePin.handle.close();
    if (quarantineRoot !== null) {
      try { await rmdir(quarantineRoot); } catch {}
    }
    await parentPin.handle.close();
  }
}

function journalSink(append) {
  return new Writable({
    write(chunk, _encoding, callback) {
      Promise.resolve()
        .then(() => append(Buffer.from(chunk)))
        .then(() => callback(), (error) => callback(error));
    },
  });
}

async function createFinalQuarantine() {
  let root = null;
  let rootPin = null;
  let finalHandle = null;
  try {
    root = await mkdtemp('/private/tmp/nap-v5-output-');
    rootPin = await openPinnedDirectory(root, 'Final output quarantine');
    await rootPin.handle.chmod(0o700);
    const finalPath = path.join(root, 'final.raw.json');
    finalHandle = await open(
      finalPath,
      constants.O_RDWR | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    );
    await finalHandle.chmod(0o600);
    const initial = await finalHandle.stat({ bigint: true });
    if (!initial.isFile() || initial.nlink !== 1n || (initial.mode & 0o777n) !== 0o600n) {
      throw new Error('Final output quarantine file is unsafe');
    }
    await finalHandle.sync();
    await rootPin.handle.sync();
    await rootPin.handle.chmod(0o500);

    let cleaned = false;
    return Object.freeze({
      root,
      finalPath,
      async readIfTouched() {
        await revalidatePinnedDirectory(root, rootPin, 'Final output quarantine');
        await finalHandle.sync();
        const before = await finalHandle.stat({ bigint: true });
        const pathBefore = await lstat(finalPath, { bigint: true });
        if (!before.isFile()
          || before.nlink !== 1n
          || pathBefore.isSymbolicLink()
          || pathBefore.nlink !== 1n
          || !sameIdentity(initial, before)
          || !sameIdentity(before, pathBefore)
          || (before.mode & 0o777n) !== 0o600n) {
          throw new Error('Final output file changed identity');
        }
        if (sameFileSnapshot(initial, before)) return null;
        const bytes = await finalHandle.readFile();
        const after = await finalHandle.stat({ bigint: true });
        const pathAfter = await lstat(finalPath, { bigint: true });
        if (!sameFileSnapshot(before, after)
          || pathAfter.isSymbolicLink()
          || pathAfter.nlink !== 1n
          || !sameFileSnapshot(after, pathAfter)) {
          throw new Error('Final output file changed while reading');
        }
        return bytes;
      },
      async cleanup() {
        if (cleaned) return;
        cleaned = true;
        try {
          await quarantineAndRemoveOwnedTree({
            root,
            rootPin,
            label: 'Final output quarantine',
          });
        } finally {
          await closeHandle(finalHandle);
          await closeHandle(rootPin.handle);
        }
      },
    });
  } catch (error) {
    await closeHandle(finalHandle);
    if (rootPin !== null) {
      try {
        await quarantineAndRemoveOwnedTree({
          root,
          rootPin,
          label: 'Final output quarantine',
        });
      } catch {}
      await closeHandle(rootPin.handle);
    }
    throw error;
  }
}

export async function createFreshAttemptRuntime({
  authSourcePath,
  schemaBytes,
  imageBytes = [],
  temporaryPrefix = '/private/tmp/nap-v5-call-',
} = {}) {
  requireAbsolute(authSourcePath, 'authSourcePath');
  if (!Buffer.isBuffer(schemaBytes) && !(schemaBytes instanceof Uint8Array)) throw new TypeError('schemaBytes must be bytes');
  if (!Array.isArray(imageBytes) || imageBytes.some((bytes) => !Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array))) throw new TypeError('imageBytes must be byte arrays');
  if (temporaryPrefix !== '/private/tmp/nap-v5-call-') throw new Error('Attempt runtime prefix is frozen');

  let root = null;
  let cwd = null;
  let rootPin = null;
  let cwdPin = null;
  try {
    root = await mkdtemp(temporaryPrefix);
    rootPin = await openPinnedDirectory(root, 'Fresh attempt runtime root');
    await rootPin.handle.chmod(0o700);
    const home = path.join(root, 'home');
    const tmpdir = path.join(root, 'tmp');
    const codexHome = path.join(root, 'codex-home');
    cwd = path.join(root, 'clean-cwd');
    for (const directory of [home, tmpdir, codexHome, cwd]) {
      await mkdir(directory, { mode: 0o700 });
      await chmod(directory, 0o700);
    }
    cwdPin = await openPinnedDirectory(cwd, 'Fresh attempt working directory');
    await secureAuthCopy(authSourcePath, path.join(codexHome, 'auth.json'));
    const schemaPath = path.join(cwd, 'output-schema.json');
    await writeFile(schemaPath, schemaBytes, { flag: 'wx', mode: 0o444 });
    await chmod(schemaPath, 0o444);
    const imagePaths = [];
    for (const [index, bytes] of imageBytes.entries()) {
      const imagePath = path.join(cwd, `image-${String(index + 1).padStart(3, '0')}.png`);
      await writeFile(imagePath, bytes, { flag: 'wx', mode: 0o444 });
      await chmod(imagePath, 0o444);
      imagePaths.push(imagePath);
    }
    await cwdPin.handle.chmod(0o555);
    let cleaned = false;
    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      try {
        await quarantineAndRemoveOwnedTree({
          root,
          rootPin,
          label: 'Attempt runtime root',
          mutableDirectories: [{ relativePath: 'clean-cwd', pin: cwdPin }],
        });
      } finally {
        await closeHandle(cwdPin.handle);
        await closeHandle(rootPin.handle);
      }
    };
    const buildEnv = (hostEnv) => {
      const env = {};
      for (const [key, value] of Object.entries(hostEnv ?? {})) {
        if ((key === 'PATH' || key === 'SHELL' || key === 'LANG' || key.startsWith('LC_')) && typeof value === 'string') env[key] = value;
      }
      env.HOME = home;
      env.TMPDIR = tmpdir;
      env.CODEX_HOME = codexHome;
      return env;
    };
    return Object.freeze({
      root,
      home,
      tmpdir,
      codexHome,
      cwd,
      schemaPath,
      imagePaths: Object.freeze(imagePaths),
      cleanup,
      buildEnv,
    });
  } catch (error) {
    if (rootPin !== null) {
      try {
        await quarantineAndRemoveOwnedTree({
          root,
          rootPin,
          label: 'Attempt runtime root',
          mutableDirectories: cwdPin === null
            ? []
            : [{ relativePath: 'clean-cwd', pin: cwdPin }],
        });
      } catch {}
    }
    if (cwdPin !== null) await closeHandle(cwdPin.handle);
    if (rootPin !== null) await closeHandle(rootPin.handle);
    throw error;
  }
}

function waitForChild(child) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    child.once('close', (exitCode, signal) => finish({ exitCode, signal, spawnFailed: false }));
    child.once('error', (error) => finish({ exitCode: null, signal: null, spawnFailed: true, spawnError: error }));
  });
}

function signalSpawnedProcessGroup(child, signal) {
  if (process.platform === 'win32') return child.kill(signal);
  if (!Number.isSafeInteger(child?.pid) || child.pid <= 0) {
    throw new Error('Spawned child has no valid process-group leader PID');
  }
  try {
    process.kill(-child.pid, signal);
    return true;
  } catch (error) {
    if (error?.code === 'ESRCH') return false;
    throw error;
  }
}

export async function executeAttempt({
  runtime,
  promptText,
  journal,
  instruction = PREDICTOR_INSTRUCTION,
  spawn = spawnProcess,
  hostEnv = process.env,
  durableClassification,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  signalProcessGroup = signalSpawnedProcessGroup,
} = {}) {
  if (runtime === null || typeof runtime !== 'object' || typeof runtime.cleanup !== 'function') throw new TypeError('runtime is required');
  let finalOutput = null;
  let child = null;
  let timeoutHandle = null;
  let graceHandle = null;
  let alive = false;
  let timedOut = false;
  let signalError = null;
  try {
    if (typeof promptText !== 'string') throw new TypeError('promptText must be a string');
    if (journal === null
      || typeof journal !== 'object'
      || typeof journal.path !== 'string'
      || !path.isAbsolute(journal.path)
      || typeof journal.appendEvents !== 'function'
      || typeof journal.appendStderr !== 'function'
      || typeof journal.writeFinal !== 'function') {
      throw new TypeError('A claimed attempt journal is required');
    }
    if (typeof spawn !== 'function'
      || typeof durableClassification !== 'function'
      || typeof signalProcessGroup !== 'function') {
      throw new TypeError('spawn, signalProcessGroup, and durableClassification are required');
    }
    if (instruction !== PREDICTOR_INSTRUCTION) {
      throw new Error('Developer instruction must match the frozen authenticated artifact');
    }
    finalOutput = await createFinalQuarantine();
    const built = buildCodexArgs({
      instruction,
      schemaPath: runtime.schemaPath,
      finalPath: finalOutput.finalPath,
      cwd: runtime.cwd,
      imagePaths: runtime.imagePaths,
    });
    let completion;
    let eventPump = null;
    let stderrPump = null;
    try {
      child = spawn(built.executable, built.args, {
        cwd: runtime.cwd,
        env: runtime.buildEnv(hostEnv),
        detached: process.platform !== 'win32',
        shell: false,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      alive = true;
      const childCompletion = waitForChild(child);
      eventPump = pipeline(child.stdout, journalSink(journal.appendEvents));
      stderrPump = pipeline(child.stderr, journalSink(journal.appendStderr));
      child.stdin.end(promptText);
      const signalWithoutThrowingFromTimer = (signal) => {
        try {
          return signalProcessGroup(child, signal);
        } catch (error) {
          signalError ??= error;
          try {
            return typeof child?.kill === 'function' ? child.kill(signal) : false;
          } catch (fallbackError) {
            signalError ??= fallbackError;
            return false;
          }
        }
      };
      timeoutHandle = setTimer(() => {
        if (!alive) return;
        timedOut = true;
        signalWithoutThrowingFromTimer('SIGTERM');
        graceHandle = setTimer(() => {
          if (alive) signalWithoutThrowingFromTimer('SIGKILL');
        }, TERMINATION_GRACE_MS);
      }, TIMEOUT_MS);
      completion = await childCompletion;
      alive = false;
    } catch (error) {
      completion = { exitCode: null, signal: null, spawnFailed: true, spawnError: error };
    }

    let timerError = null;
    if (timeoutHandle !== null) {
      try { clearTimer(timeoutHandle); } catch (error) { timerError ??= error; }
      timeoutHandle = null;
    }
    if (graceHandle !== null) {
      try { clearTimer(graceHandle); } catch (error) { timerError ??= error; }
      graceHandle = null;
    }

    let localIoError = signalError;
    const pumps = [eventPump, stderrPump].filter((pump) => pump !== null);
    const pumpResults = await Promise.allSettled(pumps);
    const failedPump = pumpResults.find((result) => result.status === 'rejected');
    if (failedPump !== undefined) localIoError = failedPump.reason;

    let finalSha256 = null;
    if (localIoError === null) {
      try {
        const finalBytes = await finalOutput.readIfTouched();
        if (finalBytes !== null) {
          await journal.writeFinal(finalBytes);
          finalSha256 = createHash('sha256').update(finalBytes).digest('hex');
        }
      } catch (error) {
        localIoError = error;
      }
    }

    const processMetadata = Object.freeze({
      exit_code: completion.exitCode,
      timed_out: timedOut,
      spawn_failed: completion.spawnFailed,
      local_io_before_final: localIoError !== null,
      final_sha256: finalSha256,
    });
    const receipt = Object.freeze({
      journal_path: journal.path,
      process: processMetadata,
    });
    await durableClassification(receipt);
    if (localIoError !== null) throw localIoError;
    if (timerError !== null) throw timerError;
    return receipt;
  } finally {
    alive = false;
    let teardownError = null;
    const teardown = async (operation) => {
      try {
        await operation();
      } catch (error) {
        teardownError ??= error;
      }
    };
    if (timeoutHandle !== null) await teardown(() => clearTimer(timeoutHandle));
    if (graceHandle !== null) await teardown(() => clearTimer(graceHandle));
    if (finalOutput !== null) await teardown(() => finalOutput.cleanup());
    await teardown(() => runtime.cleanup());
    if (teardownError !== null) throw teardownError;
  }
}
