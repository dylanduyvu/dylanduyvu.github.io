import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import {
  chmod, link, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, stat,
  symlink, writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import test from 'node:test';

import { buildCodexArgs, createFreshAttemptRuntime, executeAttempt } from '../lib/codex-adapter.mjs';
import { claimAttemptJournal, finalizeAttemptJournal } from '../lib/attempt-store.mjs';
import { completedUsage, jsonl, validPredictionResponse } from './attempt-fixtures.mjs';

const roots = new Set();
const frozenInstruction = await readFile(new URL('../predictor-instruction.txt', import.meta.url), 'utf8');
const frozenInstructionSha256 = 'a5a4eab6d2fd808c9da75a65acbee8820b5d74caddc19d123b8a07508e98a10a';
test.after(async () => Promise.all([...roots].map((root) => rm(root, { recursive: true, force: true }))));
const tempRoot = async (prefix) => {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), prefix)));
  roots.add(root);
  return root;
};
const absoluteArgs = (root) => ({
  instruction: frozenInstruction,
  schemaPath: path.join(root, 'output-schema.json'),
  finalPath: path.join(root, 'final.raw.json'),
  cwd: path.join(root, 'clean-cwd'),
  imagePaths: [path.join(root, 'image-001.png'), path.join(root, 'image-002.png')],
});
const configValues = (args) => args.flatMap((value, index) => value === '-c' ? [args[index + 1]] : []);

function fakeChild({
  stdout = '',
  stderr = '',
  exitCode = 0,
  close = true,
  beforeClose = async () => {},
} = {}) {
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  child.stdin = new PassThrough();
  child.pid = 424_242;
  child.stdinBytes = Buffer.alloc(0);
  child.stdin.on('data', (chunk) => { child.stdinBytes = Buffer.concat([child.stdinBytes, chunk]); });
  child.kills = [];
  child.kill = (signal) => { child.kills.push(signal); return true; };
  child.stdin.once('finish', () => setImmediate(async () => {
    try {
      await beforeClose();
      child.stdout.end(stdout);
      child.stderr.end(stderr);
      if (close) child.emit('close', exitCode, null);
    } catch (error) {
      child.stdout.end();
      child.stderr.end();
      child.emit('error', error);
    }
  }));
  return child;
}

async function runtimeFixture() {
  const source = await tempRoot('nap-v5-auth-source-');
  const authSourcePath = path.join(source, 'auth.json');
  await writeFile(authSourcePath, '{"token":"secret"}', { mode: 0o600 });
  const runtime = await createFreshAttemptRuntime({
    authSourcePath,
    schemaBytes: Buffer.from('{"type":"object"}'),
    imageBytes: [Buffer.from('png-a'), Buffer.from('png-b')],
  });
  return { source, authSourcePath, runtime };
}

const attemptRequest = () => ({
  version: 1,
  slot_ordinal: 1,
  packet_sha256: 'a'.repeat(64),
  prompt_sha256: 'b'.repeat(64),
  image_sha256s: ['c'.repeat(64)],
});

async function journalFixture(label = 'journal') {
  const sealedRoot = await tempRoot(`nap-v5-${label}-`);
  const slotId = 'slot-001';
  const journal = await claimAttemptJournal({
    sealedRoot,
    slotId,
    opaqueId: 'opaque-a',
    request: attemptRequest(),
  });
  return { sealedRoot, slotId, journal };
}

test('builds the exact ordered codex argv prefix', async () => {
  const root = await tempRoot('nap-v5-args-');
  const { executable, args } = buildCodexArgs(absoluteArgs(root));
  assert.equal(executable, 'codex');
  assert.deepEqual(args.slice(0, 15), ['-a', 'never', 'exec', '--strict-config', '--ephemeral', '--ignore-user-config', '--ignore-rules', '--skip-git-repo-check', '--sandbox', 'read-only', '--model', 'gpt-5.6-sol', '-c', 'model_reasoning_effort="max"', '-c']);
});

test('uses every frozen disable config in exact order followed by disabled web search', async () => {
  const root = await tempRoot('nap-v5-configs-');
  const values = configValues(buildCodexArgs(absoluteArgs(root)).args);
  const featureNames = ['shell_tool', 'unified_exec', 'code_mode', 'code_mode_host', 'code_mode_only', 'multi_agent', 'apps', 'browser_use', 'browser_use_external', 'browser_use_full_cdp_access', 'computer_use', 'in_app_browser', 'image_generation', 'goals', 'hooks', 'skill_mcp_dependency_install', 'tool_suggest', 'tool_call_mcp_elicitation', 'deferred_executor', 'request_permissions_tool', 'standalone_web_search', 'enable_mcp_apps'];
  assert.deepEqual(values.slice(3), [...featureNames.map((name) => `features.${name}=false`), 'web_search="disabled"']);
});

test('never passes the invalid tools.view_image strict-config field', async () => {
  const root = await tempRoot('nap-v5-no-view-');
  assert.equal(buildCodexArgs(absoluteArgs(root)).args.some((value) => value.includes('tools.view_image')), false);
});

test('JSON-escapes the frozen developer instruction in one config value', async () => {
  const root = await tempRoot('nap-v5-instruction-');
  const values = configValues(buildCodexArgs(absoluteArgs(root)).args);
  assert.equal(createHash('sha256').update(frozenInstruction).digest('hex'), frozenInstructionSha256);
  assert.equal(values[2], `developer_instructions=${JSON.stringify(frozenInstruction)}`);
  assert.throws(
    () => buildCodexArgs({ ...absoluteArgs(root), instruction: 'caller-controlled instruction' }),
    /frozen|instruction|hash|artifact/i,
  );
});

test('ends argv with absolute schema, final, cwd, ordered images, and stdin marker', async () => {
  const root = await tempRoot('nap-v5-tail-');
  const options = absoluteArgs(root);
  const args = buildCodexArgs(options).args;
  assert.deepEqual(args.slice(-13), ['--output-schema', options.schemaPath, '--json', '--output-last-message', options.finalPath, '--cd', options.cwd, '--image', options.imagePaths[0], '--image', options.imagePaths[1], '--', '-']);
  assert.ok([options.schemaPath, options.finalPath, options.cwd, ...options.imagePaths].every(path.isAbsolute));
});

test('creates each attempt beneath the exact fresh private temporary prefix', async () => {
  const { runtime } = await runtimeFixture();
  assert.match(runtime.root, /^\/private\/tmp\/nap-v5-call-/);
  assert.equal((await stat(runtime.root)).mode & 0o777, 0o700);
  await runtime.cleanup();
});

test('stages only fixed-name regular schema and image copies in a read-only cwd', async () => {
  const { runtime } = await runtimeFixture();
  assert.deepEqual((await readdir(runtime.cwd)).sort(), ['image-001.png', 'image-002.png', 'output-schema.json']);
  assert.equal((await stat(runtime.cwd)).mode & 0o777, 0o555);
  for (const name of await readdir(runtime.cwd)) {
    const info = await stat(path.join(runtime.cwd, name));
    assert.ok(info.isFile());
    assert.equal(info.mode & 0o777, 0o444);
  }
  await runtime.cleanup();
});

test('creates neutral HOME TMPDIR and CODEX_HOME directories as 0700', async () => {
  const { runtime } = await runtimeFixture();
  for (const directory of [runtime.home, runtime.tmpdir, runtime.codexHome]) assert.equal((await stat(directory)).mode & 0o777, 0o700);
  await runtime.cleanup();
});

test('copies only auth.json into CODEX_HOME as mode 0600', async () => {
  const { runtime } = await runtimeFixture();
  assert.deepEqual(await readdir(runtime.codexHome), ['auth.json']);
  assert.equal((await stat(path.join(runtime.codexHome, 'auth.json'))).mode & 0o777, 0o600);
  assert.equal((await readFile(path.join(runtime.codexHome, 'auth.json'), 'utf8')), '{"token":"secret"}');
  await runtime.cleanup();

  const unsafeRoot = await tempRoot('nap-v5-auth-unsafe-');
  const realParent = path.join(unsafeRoot, 'real-parent');
  const linkedParent = path.join(unsafeRoot, 'linked-parent');
  await mkdir(realParent);
  await writeFile(path.join(realParent, 'auth.json'), '{"token":"secret"}', { mode: 0o600 });
  await symlink(realParent, linkedParent);
  await assert.rejects(
    createFreshAttemptRuntime({
      authSourcePath: path.join(linkedParent, 'auth.json'),
      schemaBytes: Buffer.from('{}'),
    }).then(async (accepted) => {
      await accepted.cleanup();
      return accepted;
    }),
    /auth|symlink|source/i,
  );

  const hardlinkSource = path.join(unsafeRoot, 'hardlink-auth.json');
  await link(path.join(realParent, 'auth.json'), hardlinkSource);
  await assert.rejects(
    createFreshAttemptRuntime({
      authSourcePath: hardlinkSource,
      schemaBytes: Buffer.from('{}'),
    }).then(async (accepted) => {
      await accepted.cleanup();
      return accepted;
    }),
    /auth|hardlink|link count|source/i,
  );

  const missingSource = path.join(unsafeRoot, 'sensitive-parent-name', 'auth.json');
  let missingError;
  try {
    await createFreshAttemptRuntime({ authSourcePath: missingSource, schemaBytes: Buffer.from('{}') });
  } catch (error) {
    missingError = error;
  }
  assert.ok(missingError instanceof Error);
  assert.equal(missingError.message.includes(missingSource), false);
});

test('builds the child environment from only PATH SHELL LANG LC_* and neutral homes', async () => {
  const { runtime } = await runtimeFixture();
  const env = runtime.buildEnv({ PATH: '/bin', SHELL: '/bin/zsh', LANG: 'en_US.UTF-8', LC_ALL: 'C', SECRET: 'nope', HOME: '/real' });
  assert.deepEqual(Object.keys(env).sort(), ['CODEX_HOME', 'HOME', 'LANG', 'LC_ALL', 'PATH', 'SHELL', 'TMPDIR']);
  assert.equal(env.HOME, runtime.home);
  assert.equal(env.CODEX_HOME, runtime.codexHome);
  assert.equal(env.TMPDIR, runtime.tmpdir);
  await runtime.cleanup();
});

test('never exposes credential bytes or source paths in argv or environment values', async () => {
  const { authSourcePath, runtime } = await runtimeFixture();
  const built = buildCodexArgs({ instruction: frozenInstruction, schemaPath: runtime.schemaPath, finalPath: '/tmp/final', cwd: runtime.cwd, imagePaths: runtime.imagePaths });
  const visible = JSON.stringify({ args: built.args, env: runtime.buildEnv(process.env) });
  assert.doesNotMatch(visible, /secret/);
  assert.equal(visible.includes(authSourcePath), false);
  assert.equal(visible.includes('/dev/fd/3'), false);
  await runtime.cleanup();
});

test('spawns shell-free and writes prompt text only to stdin', async () => {
  const fixture = await runtimeFixture();
  const attempt = await journalFixture('spawn-journal');
  const attackerParent = await tempRoot('nap-v5-output-attacker-');
  const outputDirectory = path.join(attackerParent, 'caller-output');
  const movedOutput = path.join(attackerParent, 'caller-output-moved');
  const victimOutput = path.join(attackerParent, 'victim-output');
  await mkdir(outputDirectory);
  await mkdir(victimOutput);
  let call;
  let spawnedChild;
  await executeAttempt({
    runtime: fixture.runtime,
    promptText: 'private prompt\n',
    journal: attempt.journal,
    outputDirectory,
    spawn: (executable, args, options) => {
      call = { executable, args, options };
      const finalPath = args[args.indexOf('--output-last-message') + 1];
      spawnedChild = fakeChild({
        beforeClose: async () => {
          await rename(outputDirectory, movedOutput);
          await symlink(victimOutput, outputDirectory);
          await writeFile(finalPath, JSON.stringify(validPredictionResponse()));
        },
      });
      return spawnedChild;
    },
    durableClassification: async () => {},
  });
  assert.equal(call.executable, 'codex');
  assert.equal(call.options.shell, false);
  assert.equal(call.options.detached, process.platform !== 'win32');
  assert.equal(call.args.includes('private prompt\n'), false);
  assert.equal(spawnedChild.stdinBytes.toString(), 'private prompt\n');
  assert.equal(call.args.at(-1), '-');
  const finalPath = call.args[call.args.indexOf('--output-last-message') + 1];
  assert.match(finalPath, /^\/private\/tmp\/nap-v5-output-[^/]+\/final\.raw\.json$/);
  assert.equal(finalPath.startsWith(`${fixture.runtime.root}${path.sep}`), false);
  assert.equal(finalPath.startsWith(`${outputDirectory}${path.sep}`), false);
  await assert.rejects(stat(path.join(victimOutput, 'final.raw.json')), /ENOENT/);
  await assert.rejects(stat(path.dirname(finalPath)), /ENOENT/);
});

test('streams stdout stderr and final through one claimed journal before direct promotion', async () => {
  const fixture = await runtimeFixture();
  const attempt = await journalFixture('direct-integration');
  const eventsBytes = jsonl(completedUsage());
  const stderrBytes = Buffer.from([0, 1, 2]);
  const finalBytes = Buffer.from(JSON.stringify(validPredictionResponse()));
  let spawned = false;
  let promoted;
  const receipt = await executeAttempt({
    runtime: fixture.runtime,
    promptText: 'p',
    journal: attempt.journal,
    outputDirectory: attempt.journal.path,
    spawn: (_executable, args) => {
      spawned = true;
      const finalPath = args[args.indexOf('--output-last-message') + 1];
      return fakeChild({
        stdout: eventsBytes,
        stderr: stderrBytes,
        beforeClose: () => writeFile(finalPath, finalBytes),
      });
    },
    durableClassification: async (actual) => {
      assert.deepEqual(Object.keys(actual).sort(), ['journal_path', 'process']);
      assert.equal(actual.journal_path, attempt.journal.path);
      assert.deepEqual(
        Object.keys(actual.process).sort(),
        ['exit_code', 'final_sha256', 'local_io_before_final', 'spawn_failed', 'timed_out'],
      );
      assert.deepEqual(actual.process, {
        exit_code: 0,
        timed_out: false,
        spawn_failed: false,
        local_io_before_final: false,
        final_sha256: createHash('sha256').update(finalBytes).digest('hex'),
      });
      promoted = await finalizeAttemptJournal({
        sealedRoot: attempt.sealedRoot,
        slotId: attempt.slotId,
        journalPath: actual.journal_path,
        process: actual.process,
      });
    },
  });
  assert.equal(spawned, true);
  assert.equal(receipt.journal_path, attempt.journal.path);
  assert.equal(promoted.classification.classification, 'valid_final');
  assert.deepEqual(await readFile(path.join(promoted.path, 'events.jsonl')), eventsBytes);
  assert.deepEqual(await readFile(path.join(promoted.path, 'stderr.bin')), stderrBytes);
  assert.deepEqual(await readFile(path.join(promoted.path, 'final.raw.json')), finalBytes);
});

test('sends SIGTERM at exactly 1200000ms and schedules exact 5000ms grace', async () => {
  const fixture = await runtimeFixture();
  const attempt = await journalFixture('timeout-journal');
  const timers = [];
  const child = fakeChild({ close: false });
  const signals = [];
  const execution = executeAttempt({ runtime: fixture.runtime, promptText: 'p', journal: attempt.journal, spawn: () => child, durableClassification: async () => {}, signalProcessGroup: (actual, signal) => { assert.equal(actual, child); signals.push(signal); return true; }, setTimer: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimer: () => {} });
  while (timers.length === 0) await new Promise(setImmediate);
  assert.equal(timers[0].ms, 1_200_000);
  timers[0].fn();
  assert.deepEqual(signals, ['SIGTERM']);
  assert.equal(timers[1].ms, 5_000);
  child.emit('close', 1, 'SIGTERM');
  await execution;

  const failedSignalFixture = await runtimeFixture();
  const failedSignalAttempt = await journalFixture('timeout-signal-error-journal');
  const failedSignalTimers = [];
  const failedSignalChild = fakeChild({ close: false });
  let failedSignalReceipt;
  const failedSignalExecution = executeAttempt({
    runtime: failedSignalFixture.runtime,
    promptText: 'p',
    journal: failedSignalAttempt.journal,
    spawn: () => failedSignalChild,
    durableClassification: async (receipt) => { failedSignalReceipt = receipt; },
    signalProcessGroup: () => {
      const error = new Error('signal blocked');
      error.code = 'EPERM';
      throw error;
    },
    setTimer: (fn, ms) => {
      failedSignalTimers.push({ fn, ms });
      return failedSignalTimers.length;
    },
    clearTimer: () => {},
  });
  while (failedSignalTimers.length === 0) await new Promise(setImmediate);
  assert.doesNotThrow(() => failedSignalTimers[0].fn());
  assert.deepEqual(failedSignalChild.kills, ['SIGTERM']);
  failedSignalChild.emit('close', 1, 'SIGTERM');
  await assert.rejects(failedSignalExecution, /signal blocked/);
  assert.equal(failedSignalReceipt.process.local_io_before_final, true);
  await assert.rejects(stat(failedSignalFixture.runtime.root), /ENOENT/);
});

test('does not send SIGKILL when the child exits during termination grace', async () => {
  const fixture = await runtimeFixture();
  const attempt = await journalFixture('grace-exit-journal');
  const timers = [];
  const child = fakeChild({ close: false });
  const signals = [];
  const execution = executeAttempt({ runtime: fixture.runtime, promptText: 'p', journal: attempt.journal, spawn: () => child, durableClassification: async () => {}, signalProcessGroup: (_actual, signal) => { signals.push(signal); return true; }, setTimer: (fn, ms) => { timers.push(fn); return timers.length; }, clearTimer: () => {} });
  while (timers.length === 0) await new Promise(setImmediate);
  timers[0]();
  child.emit('close', 1, 'SIGTERM');
  await Promise.resolve();
  timers[1]();
  await execution;
  assert.deepEqual(signals, ['SIGTERM']);
});

test('sends SIGKILL only when the child remains alive for the full grace', async () => {
  const fixture = await runtimeFixture();
  const attempt = await journalFixture('grace-kill-journal');
  const timers = [];
  const child = fakeChild({ close: false });
  const signals = [];
  const execution = executeAttempt({ runtime: fixture.runtime, promptText: 'p', journal: attempt.journal, spawn: () => child, durableClassification: async () => {}, signalProcessGroup: (_actual, signal) => { signals.push(signal); return true; }, setTimer: (fn, ms) => { timers.push(fn); return timers.length; }, clearTimer: () => {} });
  while (timers.length === 0) await new Promise(setImmediate);
  timers[0]();
  timers[1]();
  assert.deepEqual(signals, ['SIGTERM', 'SIGKILL']);
  child.emit('close', 1, 'SIGKILL');
  await execution;
});

test('cleans the entire ephemeral runtime after success, spawn error, signal, or setup/teardown failure', async () => {
  const swapped = await runtimeFixture();
  const ownedRoot = swapped.runtime.root;
  const movedRoot = `${ownedRoot}-owned-moved`;
  const victimRoot = await tempRoot('nap-v5-cleanup-victim-');
  const victimCwd = path.join(victimRoot, 'clean-cwd');
  await mkdir(victimCwd);
  await chmod(victimCwd, 0o755);
  await rename(ownedRoot, movedRoot);
  await symlink(victimRoot, ownedRoot);
  try {
    await assert.rejects(swapped.runtime.cleanup(), /changed|identity|cleanup|symlink/i);
    assert.equal((await stat(victimCwd)).mode & 0o777, 0o755);
  } finally {
    await rm(ownedRoot, { force: true });
    await chmod(path.join(movedRoot, 'clean-cwd'), 0o700);
    await rm(movedRoot, { recursive: true, force: true });
  }

  for (const mode of ['success', 'error', 'signal', 'setup', 'teardown']) {
    const fixture = await runtimeFixture();
    const root = fixture.runtime.root;
    const attempt = await journalFixture(`clean-${mode}-journal`);
    const child = mode === 'signal' ? fakeChild({ exitCode: 1 }) : fakeChild();
    const spawn = mode === 'error' ? () => { throw new Error('spawn failed'); } : () => child;
    if (mode === 'setup') {
      await assert.rejects(
        executeAttempt({ runtime: fixture.runtime, promptText: 'p', journal: null, spawn, durableClassification: async () => {} }),
        /journal|required/i,
      );
    } else {
      const execution = executeAttempt({
        runtime: fixture.runtime,
        promptText: 'p',
        journal: attempt.journal,
        spawn,
        durableClassification: async () => {},
        clearTimer: mode === 'teardown'
          ? (handle) => {
              clearTimeout(handle);
              throw new Error('teardown failed');
            }
          : clearTimeout,
      });
      if (mode === 'teardown') await assert.rejects(execution, /teardown failed/);
      else await execution;
    }
    await assert.rejects(stat(root), /ENOENT/);
  }
});

test('durably classifies before cleanup and still cleans when durability fails', async () => {
  const fixture = await runtimeFixture();
  const root = fixture.runtime.root;
  const attempt = await journalFixture('durable-journal');
  await assert.rejects(executeAttempt({
    runtime: fixture.runtime,
    promptText: 'p',
    journal: attempt.journal,
    spawn: () => fakeChild(),
    durableClassification: async () => {
      assert.ok((await stat(root)).isDirectory());
      throw new Error('durability failed');
    },
  }), /durability failed/);
  await assert.rejects(stat(root), /ENOENT/);
});
