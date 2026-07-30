import assert from 'node:assert/strict';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import { main as cliMain } from '../cli.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { RUNNER_COMMANDS, runRunnerCommand } from '../lib/runner.mjs';
import { buildSchedule } from '../lib/schedule.mjs';
import { claimAttemptJournal } from '../lib/attempt-store.mjs';
import {
  jsonl,
  structuralError,
  validPredictionResponse,
} from './attempt-fixtures.mjs';

const roots = new Set();
const SAFE_OUTPUT_KEYS = [
  'attempt_ordinal',
  'classification',
  'code',
  'completed_slots',
  'latency_ms',
  'scheduled_slots',
  'slot_ordinal',
  'terminal_state',
].sort();
const SLOT_STATE_ROOT = 'sealed-attempts/slot-state';

test.after(async () => {
  await Promise.all([...roots].map((root) => rm(root, { recursive: true, force: true })));
});

async function temporaryRoot() {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-runner-')));
  roots.add(root);
  return root;
}

function targetPlan() {
  return {
    version: 1,
    targets: Array.from({ length: METHOD.targetCount }, (_, index) => ({
      target_ordinal: index + 1,
      target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
      chronology_index: 100 + index,
    })),
  };
}

async function writePrivate(filename, bytes) {
  await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  await writeFile(filename, bytes, { mode: 0o600 });
}

async function runnerFixture() {
  const root = await temporaryRoot();
  const schedule = buildSchedule(targetPlan());
  const inventory = [];
  const requests = new Map();
  const addInventory = async (relativePath, bytes) => {
    await writePrivate(path.join(root, ...relativePath.split('/')), bytes);
    inventory.push({
      path: relativePath,
      byte_length: bytes.length,
      sha256: sha256(bytes),
      trust_zone: relativePath.startsWith('evaluator/')
        ? 'evaluator_only'
        : 'predictor_safe',
    });
  };
  const scheduleBytes = Buffer.from(canonicalJson(schedule));
  await addInventory('evaluator/schedule.json', scheduleBytes);
  for (const slot of schedule.slots) {
    const packetRoot = `packets/${slot.slot_id}`;
    const imageCount = slot.condition === 'state_only' ? 1 : 11;
    const imageBytes = Array.from(
      { length: imageCount },
      (_, index) => Buffer.from(`png:${slot.slot_ordinal}:${index + 1}`),
    );
    const packet = {
      version: 1,
      condition: slot.condition,
      prompt_text: `private prompt ${slot.slot_ordinal}\n`,
      context_sha256: 'd'.repeat(64),
      images: imageBytes.map((bytes, index) => ({
        attachment_ordinal: index + 1,
        sha256: sha256(bytes),
      })),
    };
    const packetBytes = Buffer.from(`${JSON.stringify(packet, null, 2)}\n`);
    const promptBytes = Buffer.from(packet.prompt_text);
    await addInventory(`${packetRoot}/packet.json`, packetBytes);
    await addInventory(`${packetRoot}/prompt.txt`, promptBytes);
    for (const [index, bytes] of imageBytes.entries()) {
      await addInventory(
        `${packetRoot}/image-${String(index + 1).padStart(3, '0')}.png`,
        bytes,
      );
    }
    requests.set(slot.slot_ordinal, {
      version: 1,
      slot_ordinal: slot.slot_ordinal,
      packet_sha256: sha256(packetBytes),
      prompt_sha256: sha256(promptBytes),
      image_sha256s: imageBytes.map(sha256),
    });
  }
  await writePrivate(
    path.join(root, 'evaluator/prepared-inventory.json'),
    Buffer.from(canonicalJson({
      version: 1,
      packet_count: METHOD.scheduledSlotCount,
      files: inventory.sort((left, right) => left.path.localeCompare(right.path)),
    })),
  );
  return { root, schedule, requests };
}

function responseWithSecret(secret) {
  const response = validPredictionResponse();
  return {
    predictions: response.predictions.map((prediction, index) => ({
      ...prediction,
      reason: index === 0 ? secret : prediction.reason,
    })),
  };
}

async function materializeBehavior(journal, behavior) {
  const kind = behavior?.kind ?? behavior ?? 'fatal';
  if (kind === 'valid') {
    await journal.writeFinal(Buffer.from(JSON.stringify(
      behavior?.response ?? validPredictionResponse(),
    )));
    return { exit_code: 0 };
  }
  if (kind === 'terminal_invalid') {
    await journal.appendEvents(jsonl({ type: 'tool.requested', tool_name: 'shell' }));
    await journal.writeFinal(Buffer.from(JSON.stringify(validPredictionResponse())));
    return { exit_code: 0 };
  }
  if (kind === 'retry') {
    await journal.appendEvents(jsonl(structuralError(behavior?.code ?? 'rate_limit')));
    return { exit_code: 1 };
  }
  if (kind === 'fatal') {
    await journal.appendEvents(jsonl(structuralError(
      behavior?.code ?? 'authentication_error',
    )));
    return { exit_code: 1 };
  }
  if (kind === 'crash') throw new Error('synthetic crash before durable classification');
  throw new Error(`Unknown fake behavior: ${kind}`);
}

function fakeIo({
  behaviors = [],
  frozenError = null,
  preparedError = null,
  afterFrozen,
  afterPrepared,
} = {}) {
  const queue = [...behaviors];
  const calls = [];
  const output = [];
  const preparedCalls = [];
  let clock = 1_000;
  return {
    calls,
    output,
    preparedCalls,
    verifyFrozenRun: async () => {
      calls.push('verify-frozen');
      if (frozenError !== null) throw frozenError;
      await afterFrozen?.();
    },
    verifyPrepared: async (options) => {
      calls.push('verify-prepared');
      preparedCalls.push(options);
      if (preparedError !== null) throw preparedError;
      await afterPrepared?.();
    },
    authSourcePath: '/private/tmp/nap-v5-test-auth.json',
    nowMs: () => {
      clock += 10;
      return clock;
    },
    createFreshAttemptRuntime: async ({ imageBytes }) => {
      calls.push(`runtime:${imageBytes.length}`);
      return Object.freeze({
        cleanup: async () => {},
      });
    },
    executeAttempt: async ({ journal, durableClassification, runtime }) => {
      const slotId = path.basename(path.dirname(journal.path));
      calls.push(`execute:${slotId}`);
      const behavior = queue.shift() ?? { kind: 'fatal' };
      const process = await materializeBehavior(journal, behavior);
      await durableClassification({
        journal_path: journal.path,
        process: {
          exit_code: process.exit_code,
          timed_out: false,
          spawn_failed: false,
          local_io_before_final: false,
          final_sha256: null,
        },
      });
      await runtime.cleanup();
    },
    writeOutput: (text) => {
      output.push(text);
    },
  };
}

function decodedOutput(io) {
  return io.output
    .join('')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function seedOpenAttempt(fixture, slotOrdinal, behavior = { kind: 'valid' }) {
  const slot = fixture.schedule.slots[slotOrdinal - 1];
  const sealedRoot = path.join(fixture.root, 'sealed-attempts');
  await mkdir(sealedRoot, { recursive: true, mode: 0o700 });
  const journal = await claimAttemptJournal({
    sealedRoot,
    slotId: slot.slot_id,
    opaqueId: `a${String(slotOrdinal).padStart(3, '0')}-e001`,
    request: fixture.requests.get(slotOrdinal),
  });
  await materializeBehavior(journal, behavior);
  return journal;
}

async function runWith(fixture, io) {
  return runRunnerCommand({ root: fixture.root, command: 'run', io });
}

async function fileManifest(root) {
  const output = [];
  async function walk(directory) {
    for (const name of (await readdir(directory)).sort()) {
      const filename = path.join(directory, name);
      const info = await stat(filename, { bigint: true });
      if (info.isDirectory()) await walk(filename);
      else output.push({
        path: path.relative(root, filename),
        sha256: sha256(await readFile(filename)),
        mtime_ns: info.mtimeNs.toString(),
      });
    }
  }
  await walk(root);
  return output;
}

test('exports only the exact sealed runner command contract', () => {
  assert.deepEqual(RUNNER_COMMANDS, ['run', 'status', 'verify-attempts']);
  assert.equal(typeof runRunnerCommand, 'function');
});

test('run verifies frozen and prepared state before creating a runtime or inflight journal', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({ behaviors: [{ kind: 'fatal' }] });
  await runWith(fixture, io);
  assert.deepEqual(io.calls.slice(0, 4), [
    'verify-frozen',
    'verify-prepared',
    'runtime:1',
    'execute:NAP-V5-SLOT-01',
  ]);
  assert.deepEqual(io.preparedCalls, [{
    root: fixture.root,
    downstreamAuthenticated: true,
  }]);
});

test('method or run-lock verification failure stops before creating sealed artifacts', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({ frozenError: new Error('CANARY-TARGET-ID') });
  await assert.rejects(runWith(fixture, io), /runner|frozen|verification/i);
  await assert.rejects(lstat(path.join(fixture.root, 'sealed-attempts')), { code: 'ENOENT' });
  assert.equal(io.output.join('').includes('CANARY-TARGET-ID'), false);
});

test('prepared-tree verification failure stops before creating sealed artifacts', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({ preparedError: new Error('CANARY-PRIVATE-REASON') });
  await assert.rejects(runWith(fixture, io), /runner|prepared|verification/i);
  await assert.rejects(lstat(path.join(fixture.root, 'sealed-attempts')), { code: 'ENOENT' });
  assert.equal(io.output.join('').includes('CANARY-PRIVATE-REASON'), false);
});

test('a malformed frozen schedule fails closed before claiming an attempt', async () => {
  const fixture = await runnerFixture();
  const schedulePath = path.join(fixture.root, 'evaluator/schedule.json');
  const schedule = JSON.parse(await readFile(schedulePath, 'utf8'));
  schedule.slots[0].slot_ordinal = 2;
  await writeFile(schedulePath, canonicalJson(schedule));
  const io = fakeIo();
  await assert.rejects(runWith(fixture, io), /runner|schedule|verification/i);
  await assert.rejects(lstat(path.join(fixture.root, 'sealed-attempts')), { code: 'ENOENT' });
});

test('packet drift after full verification is caught before an inflight journal exists', async () => {
  const fixture = await runnerFixture();
  const prompt = path.join(fixture.root, 'packets/NAP-V5-SLOT-01/prompt.txt');
  const io = fakeIo({
    afterPrepared: () => writeFile(prompt, 'mutated private prompt\n'),
  });
  await assert.rejects(runWith(fixture, io), /runner|packet|verification/i);
  await assert.rejects(lstat(path.join(fixture.root, 'sealed-attempts')), { code: 'ENOENT' });
});

test('missing or extra packet files fail before attempt execution', async () => {
  const fixture = await runnerFixture();
  await writePrivate(
    path.join(fixture.root, 'packets/NAP-V5-SLOT-01/extra.bin'),
    Buffer.from('extra'),
  );
  const io = fakeIo();
  await assert.rejects(runWith(fixture, io), /runner|packet|inventory|verification/i);
  assert.equal(io.calls.some((entry) => entry.startsWith('execute:')), false);
});

test('a valid first attempt writes one immutable terminal slot record', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] });
  await runWith(fixture, io);
  assert.deepEqual(
    await readdir(path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-01')),
    ['attempt-001'],
  );
  const terminal = JSON.parse(await readFile(path.join(
    fixture.root,
    SLOT_STATE_ROOT,
    'NAP-V5-SLOT-01/terminal.json',
  )));
  assert.equal(terminal.terminal_state, 'valid_final');
  assert.equal(terminal.authoritative_attempt_ordinal, 1);
});

test('retryable infrastructure immediately retries the same slot before the paired slot', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({
    behaviors: [{ kind: 'retry' }, { kind: 'valid' }, { kind: 'fatal' }],
  });
  await runWith(fixture, io);
  assert.deepEqual(
    io.calls.filter((entry) => entry.startsWith('execute:')),
    [
      'execute:NAP-V5-SLOT-01',
      'execute:NAP-V5-SLOT-01',
      'execute:NAP-V5-SLOT-02',
    ],
  );
  assert.deepEqual(
    await readdir(path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-01')),
    ['attempt-001', 'attempt-002'],
  );
});

test('terminal invalid receives no retry', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({
    behaviors: [{ kind: 'terminal_invalid' }, { kind: 'fatal' }],
  });
  await runWith(fixture, io);
  assert.deepEqual(
    io.calls.filter((entry) => entry.startsWith('execute:')),
    ['execute:NAP-V5-SLOT-01', 'execute:NAP-V5-SLOT-02'],
  );
  const terminal = JSON.parse(await readFile(path.join(
    fixture.root,
    SLOT_STATE_ROOT,
    'NAP-V5-SLOT-01/terminal.json',
  )));
  assert.equal(terminal.terminal_state, 'terminal_invalid');
});

test('three retryable results terminate as infrastructure_failure', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({
    behaviors: [
      { kind: 'retry', code: 'rate_limit' },
      { kind: 'retry', code: 'service_unavailable' },
      { kind: 'retry', code: 'transport_disconnect' },
      { kind: 'fatal' },
    ],
  });
  await runWith(fixture, io);
  const terminal = JSON.parse(await readFile(path.join(
    fixture.root,
    SLOT_STATE_ROOT,
    'NAP-V5-SLOT-01/terminal.json',
  )));
  assert.equal(terminal.terminal_state, 'infrastructure_failure');
  assert.equal(terminal.authoritative_attempt_ordinal, 3);
});

test('fatal environment stop consumes no attempt ordinal', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({ behaviors: [{ kind: 'fatal' }] });
  const receipt = await runWith(fixture, io);
  assert.equal(receipt.classification, 'fatal_environment');
  assert.equal(receipt.attempt_ordinal, 1);
  await assert.rejects(
    lstat(path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-01')),
    { code: 'ENOENT' },
  );
});

test('repair resumes the unchanged ordinal while preserving the fatal stop evidence', async () => {
  const fixture = await runnerFixture();
  await runWith(fixture, fakeIo({ behaviors: [{ kind: 'fatal' }] }));
  const stopRoot = path.join(
    fixture.root,
    'sealed-attempts/environment-stops/NAP-V5-SLOT-01',
  );
  const before = await readdir(stopRoot);
  const io = fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] });
  await runWith(fixture, io);
  assert.deepEqual(await readdir(stopRoot), before);
  assert.deepEqual(
    await readdir(path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-01')),
    ['attempt-001'],
  );
});

test('resume recovers a complete inflight journal without duplicating its attempt', async () => {
  const fixture = await runnerFixture();
  await seedOpenAttempt(fixture, 1, { kind: 'valid' });
  const io = fakeIo({ behaviors: [{ kind: 'fatal' }] });
  await runWith(fixture, io);
  assert.deepEqual(
    io.calls.filter((entry) => entry.startsWith('execute:')),
    ['execute:NAP-V5-SLOT-02'],
  );
  assert.deepEqual(
    await readdir(path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-01')),
    ['attempt-001'],
  );
});

test('completed slots are verified and never executed or overwritten on resume', async () => {
  const fixture = await runnerFixture();
  await runWith(
    fixture,
    fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] }),
  );
  const terminalPath = path.join(
    fixture.root,
    SLOT_STATE_ROOT,
    'NAP-V5-SLOT-01/terminal.json',
  );
  const before = await readFile(terminalPath);
  const io = fakeIo({ behaviors: [{ kind: 'fatal' }] });
  await runWith(fixture, io);
  assert.equal(
    io.calls.filter((entry) => entry === 'execute:NAP-V5-SLOT-01').length,
    0,
  );
  assert.deepEqual(await readFile(terminalPath), before);
});

test('corrupt prior attempt bytes stop resume before inflight recovery or new execution', async () => {
  const fixture = await runnerFixture();
  await runWith(
    fixture,
    fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] }),
  );
  const inflight = await seedOpenAttempt(fixture, 2, { kind: 'valid' });
  await writeFile(
    path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-01/attempt-001/stderr.bin'),
    'tampered',
  );
  const io = fakeIo();
  await assert.rejects(runWith(fixture, io), /runner|attempt|sealed|verification/i);
  assert.equal(io.calls.some((entry) => entry.startsWith('execute:')), false);
  assert.equal((await lstat(inflight.path)).isDirectory(), true);
  await assert.rejects(
    lstat(path.join(fixture.root, 'sealed-attempts/NAP-V5-SLOT-02/attempt-001')),
    { code: 'ENOENT' },
  );
});

test('terminal record drift stops resume before any new execution', async () => {
  const fixture = await runnerFixture();
  await runWith(
    fixture,
    fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] }),
  );
  const terminalPath = path.join(
    fixture.root,
    SLOT_STATE_ROOT,
    'NAP-V5-SLOT-01/terminal.json',
  );
  const terminal = JSON.parse(await readFile(terminalPath, 'utf8'));
  terminal.code = 'forged';
  await writeFile(terminalPath, canonicalJson(terminal));
  const io = fakeIo();
  await assert.rejects(runWith(fixture, io), /runner|terminal|sealed|verification/i);
  assert.equal(io.calls.some((entry) => entry.startsWith('execute:')), false);
});

test('status emits only the frozen progress fields', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo();
  await runRunnerCommand({ root: fixture.root, command: 'status', io });
  const rows = decodedOutput(io);
  assert.equal(rows.length, 1);
  assert.deepEqual(Object.keys(rows[0]).sort(), SAFE_OUTPUT_KEYS);
  assert.deepEqual(
    [rows[0].slot_ordinal, rows[0].attempt_ordinal, rows[0].completed_slots],
    [1, 1, 0],
  );
});

test('run output never exposes responses reasons target IDs conditions joins or scores', async () => {
  const fixture = await runnerFixture();
  const secret = 'CANARY-PRIVATE-PREDICTION-REASON';
  const io = fakeIo({
    behaviors: [
      { kind: 'valid', response: responseWithSecret(secret) },
      { kind: 'fatal' },
    ],
  });
  await runWith(fixture, io);
  const visible = io.output.join('');
  assert.equal(visible.includes(secret), false);
  assert.doesNotMatch(
    visible,
    /NAP-V5-TARGET|state_only|state_plus_hybrid_history|predictions|reason|exact_score/i,
  );
  assert.ok(decodedOutput(io).every(
    (row) => Object.keys(row).sort().join(',') === SAFE_OUTPUT_KEYS.join(','),
  ));
});

test('verify-attempts rehashes prior attempts without writing', async () => {
  const fixture = await runnerFixture();
  await runWith(
    fixture,
    fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] }),
  );
  const before = await fileManifest(fixture.root);
  const io = fakeIo();
  await runRunnerCommand({
    root: fixture.root,
    command: 'verify-attempts',
    io,
  });
  assert.deepEqual(await fileManifest(fixture.root), before);
  assert.equal(decodedOutput(io).length, 1);
});

test('execution never creates scoring adjudication blind or revealed artifacts', async () => {
  const fixture = await runnerFixture();
  await runWith(
    fixture,
    fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] }),
  );
  for (const relativePath of ['blind', 'revealed', 'evaluator-sealed', 'scores']) {
    await assert.rejects(lstat(path.join(fixture.root, relativePath)), { code: 'ENOENT' });
  }
});

test('the completion seal remains absent while any scheduled slot is unfinished', async () => {
  const fixture = await runnerFixture();
  await runWith(
    fixture,
    fakeIo({ behaviors: [{ kind: 'valid' }, { kind: 'fatal' }] }),
  );
  await assert.rejects(
    lstat(path.join(fixture.root, 'locks/all-slots-terminal.json')),
    { code: 'ENOENT' },
  );
});

test('all frozen terminal records atomically produce one authenticated completion seal', async () => {
  const fixture = await runnerFixture();
  const io = fakeIo({
    behaviors: Array.from({ length: METHOD.scheduledSlotCount }, () => ({ kind: 'valid' })),
  });
  const receipt = await runWith(fixture, io);
  assert.equal(receipt.completed_slots, METHOD.scheduledSlotCount);
  assert.equal(receipt.slot_ordinal, null);
  const sealPath = path.join(fixture.root, 'locks/all-slots-terminal.json');
  const seal = JSON.parse(await readFile(sealPath, 'utf8'));
  assert.equal(seal.scheduled_slot_count, METHOD.scheduledSlotCount);
  assert.equal(seal.terminal_slot_count, METHOD.scheduledSlotCount);
  assert.equal(seal.terminal_records.length, METHOD.scheduledSlotCount);
  const before = await readFile(sealPath);
  const resumed = fakeIo();
  await runWith(fixture, resumed);
  assert.deepEqual(await readFile(sealPath), before);
  assert.equal(resumed.calls.some((entry) => entry.startsWith('execute:')), false);
});

test('CLI routes run status and verify-attempts with strict runner arguments', async () => {
  const fixture = await runnerFixture();
  const runIo = fakeIo({ behaviors: [{ kind: 'fatal' }] });
  assert.equal(await cliMain(['run'], { root: fixture.root, io: runIo }), 0);
  const statusIo = fakeIo();
  assert.equal(await cliMain(['status', '--json'], { root: fixture.root, io: statusIo }), 0);
  const verifyIo = fakeIo();
  assert.equal(
    await cliMain(['verify-attempts'], { root: fixture.root, io: verifyIo }),
    0,
  );
  await assert.rejects(
    cliMain(['run', '--json'], { root: fixture.root, io: fakeIo() }),
    /argument|option|run/i,
  );
  await assert.rejects(
    cliMain(['status', '--surprise'], { root: fixture.root, io: fakeIo() }),
    /argument|option|status/i,
  );
  await assert.rejects(
    cliMain(['status'], { root: fixture.root, io: fakeIo(), extra: true }),
    /dependency|unknown|extra/i,
  );
});
