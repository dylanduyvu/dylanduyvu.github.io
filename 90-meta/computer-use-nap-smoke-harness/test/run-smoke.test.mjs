import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  chmod,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after } from 'node:test';

import { buildSchedule } from '../lib/schedule.mjs';
import {
  getRunPaths,
  getSlotPaths,
  main,
  parseCliArguments,
  serializeJson,
  verifyAttemptIdentity,
} from '../run-smoke.mjs';

const sourceExperimentRoot = path.resolve(import.meta.dirname, '..');
const frozenManifest = JSON.parse(
  await readFile(path.join(sourceExperimentRoot, 'manifest.json'), 'utf8'),
);
const temporaryDirectories = new Set();
const RUN_ID = 'BLOG-SMOKE-TEST-V2';
const STATUSES = new Set([
  'valid_prediction',
  'invalid_tool_use',
  'invalid_schema',
  'infrastructure_failure',
]);

after(async () => {
  await Promise.all(
    [...temporaryDirectories].map((directory) => (
      rm(directory, { recursive: true, force: true })
    )),
  );
});

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function sha256File(filePath) {
  return sha256(await readFile(filePath));
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function makeExperimentRoot() {
  const root = await mkdtemp(path.join(tmpdir(), 'run-smoke-test-'));
  temporaryDirectories.add(root);
  for (const name of [
    'manifest.json',
    'predictor-instruction.txt',
    'prediction.schema.json',
  ]) {
    await copyFile(
      path.join(sourceExperimentRoot, name),
      path.join(root, name),
    );
  }
  const runtimeCodexHome = path.join(root, 'runtime-codex-home');
  await mkdir(runtimeCodexHome, { mode: 0o700 });
  await chmod(runtimeCodexHome, 0o700);
  return { root, runtimeCodexHome };
}

async function walkFiles(root) {
  if (!await pathExists(root)) return [];
  const result = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(entryPath);
      else if (entry.isFile()) result.push(entryPath);
    }
  }
  await visit(root);
  return result.sort();
}

async function writeCompleteSyntheticRunLock({
  experimentRoot,
  runId,
  runPath,
  manifest,
}) {
  const runPaths = getRunPaths(experimentRoot, runId);
  const inventoryPaths = [
    path.join(experimentRoot, 'manifest.json'),
    path.join(experimentRoot, 'predictor-instruction.txt'),
    path.join(experimentRoot, 'prediction.schema.json'),
    runPaths.schedulePath,
    ...(await walkFiles(runPaths.targetsDirectory)).filter((filePath) => (
      ['packet.json', 'prompt.txt'].includes(path.basename(filePath))
    )),
  ].sort();
  const inventory = await Promise.all(inventoryPaths.map(async (filePath) => ({
    path: filePath,
    sha256: await sha256File(filePath),
  })));
  const lock = {
    record_version: 1,
    completeness: 'complete',
    run_id: runId,
    dataset_snapshot_id: manifest.dataset_snapshot_id,
    manifest_id: manifest.manifest_id,
    protocol_id: manifest.protocol_id,
    inventory,
  };
  await writeFile(runPath, serializeJson(lock), { flag: 'wx', mode: 0o600 });
  return lock;
}

async function verifySyntheticRunLock({
  experimentRoot,
  runId,
  runPath = getRunPaths(experimentRoot, runId).runPath,
}) {
  const lock = JSON.parse(await readFile(runPath, 'utf8'));
  assert.equal(lock.completeness, 'complete');
  assert.equal(lock.run_id, runId);
  assert.deepEqual(
    lock.inventory.map((entry) => entry.path),
    [...lock.inventory.map((entry) => entry.path)].sort(),
  );
  assert.equal(
    new Set(lock.inventory.map((entry) => entry.path)).size,
    lock.inventory.length,
  );
  for (const entry of lock.inventory) {
    assert.equal(await sha256File(entry.path), entry.sha256);
  }
  return lock;
}

function canonicalUtcForCall(callSequenceIndex, offsetSeconds = 0) {
  return new Date(
    Date.parse('2026-07-28T21:00:00.000Z')
      + ((callSequenceIndex * 10) + offsetSeconds) * 1_000,
  ).toISOString();
}

function makeAttemptRecord({
  runId,
  manifest,
  scheduleEntry,
  packet,
  packetPath,
  packetSha256,
  promptPath,
  promptSha256,
  eventsPath,
  finalPath,
  status,
}) {
  assert.ok(STATUSES.has(status));
  const row = manifest.rows.find(({ event_id }) => (
    event_id === scheduleEntry.event_id
  ));
  const valid = status === 'valid_prediction';
  const savedAt = canonicalUtcForCall(scheduleEntry.call_sequence_index, 3);
  return {
    record_version: 1,
    run_id: runId,
    dataset_snapshot_id: manifest.dataset_snapshot_id,
    manifest_id: manifest.manifest_id,
    event_id: scheduleEntry.event_id,
    event_row_version: scheduleEntry.event_row_version,
    condition: scheduleEntry.condition,
    paired_target_ordinal: scheduleEntry.paired_target_ordinal,
    call_sequence_index: scheduleEntry.call_sequence_index,
    history_event_ids_ordered: [...scheduleEntry.history_event_ids_ordered],
    rendered_packet_path: packetPath,
    rendered_packet_sha256: packetSha256,
    prompt_sha256: promptSha256,
    requested_at_utc: canonicalUtcForCall(
      scheduleEntry.call_sequence_index,
      0,
    ),
    completed_at_utc: canonicalUtcForCall(
      scheduleEntry.call_sequence_index,
      2,
    ),
    attempt_saved_at_utc: savedAt,
    prediction_saved_at_utc: valid ? savedAt : null,
    attempt_status: status,
    invalid_reason: valid ? null : status,
    ranked_predictions: valid
      ? [{
        rank: 1,
        app: row.target.app,
        object: row.target.object,
        subtarget: row.target.subtarget,
        canonical_label: row.canonical_label,
        reason: 'synthetic test prediction',
      }]
      : [],
    raw_response_path: finalPath,
    raw_response_sha256: valid ? sha256('{}\n') : null,
    event_log: {
      path: eventsPath,
      sha256: sha256(''),
      parsed_event_count: 0,
      malformed_line_count: 0,
      observed_tool_use: status === 'invalid_tool_use',
    },
    label_revealed_at_utc: null,
    scored_after_prediction: {
      exact_top_1: null,
      exact_top_3: null,
      useful_shortcut: null,
      scoring_notes: null,
    },
    scored_at_utc: null,
    scorer: null,
    packet_prompt_path: promptPath,
    packet_image_count: packet.images.length,
  };
}

function makeFakeAttemptExecutor({
  manifest,
  statusesByCall = new Map(),
  calls,
  stagingRoots,
  runtimeCodexHome,
}) {
  return async (input) => {
    calls.push(input.schedule.call_sequence_index);
    assert.equal(input.codexHomePath, runtimeCodexHome);
    assert.ok(path.isAbsolute(input.cleanCallDirectory));
    assert.ok(!input.cleanCallDirectory.includes(input.schedule.event_id));
    assert.equal(
      path.basename(input.stagingFinalPath),
      'final.json',
    );
    assert.equal(
      path.dirname(input.stagingFinalPath),
      input.cleanCallDirectory,
    );
    assert.equal(path.basename(input.schemaPath), 'prediction.schema.json');
    assert.equal(path.dirname(input.schemaPath), input.cleanCallDirectory);
    assert.equal(
      path.dirname(input.eventsPath),
      path.dirname(input.attemptPath),
    );
    assert.equal(
      path.dirname(input.finalPath),
      path.dirname(input.attemptPath),
    );
    assert.notEqual(
      path.dirname(input.attemptPath),
      input.cleanCallDirectory,
    );
    assert.deepEqual(
      input.modelImagePathsOrdered.map((imagePath) => path.basename(imagePath)),
      input.packet.images.map((_, index) => (
        `image-${String(index + 1).padStart(3, '0')}.png`
      )),
    );
    for (const [index, modelPath] of input.modelImagePathsOrdered.entries()) {
      assert.ok(!modelPath.includes('BLOG-CAND-'));
      assert.notEqual(modelPath, input.packet.images[index].path);
      assert.equal(
        await sha256File(modelPath),
        input.packet.images[index].sha256,
      );
    }
    assert.ok(!input.packet.prompt_text.includes(input.schedule.event_id));
    stagingRoots.push(path.dirname(input.cleanCallDirectory));

    const status = statusesByCall.get(
      input.schedule.call_sequence_index,
    ) ?? 'valid_prediction';
    const record = makeAttemptRecord({
      runId: input.runId,
      manifest,
      scheduleEntry: input.schedule,
      packet: input.packet,
      packetPath: input.renderedPacketPath,
      packetSha256: input.renderedPacketSha256,
      promptPath: path.join(path.dirname(input.attemptPath), 'prompt.txt'),
      promptSha256: sha256(input.packet.prompt_text),
      eventsPath: input.eventsPath,
      finalPath: input.finalPath,
      status,
    });
    await writeFile(input.eventsPath, '', { flag: 'wx', mode: 0o600 });
    await writeFile(
      input.finalPath,
      status === 'valid_prediction' ? '{}\n' : '',
      { flag: 'wx', mode: 0o600 },
    );
    await writeFile(
      input.attemptPath,
      serializeJson(record),
      { flag: 'wx', mode: 0o600 },
    );
    return record;
  };
}

async function makeHarness(options = {}) {
  const { root, runtimeCodexHome } = await makeExperimentRoot();
  const output = [];
  const calls = [];
  const stagingRoots = [];
  let isolatedHomeCalls = 0;
  let isolatedHomeCleanups = 0;
  const statusesByCall = options.statusesByCall ?? new Map();
  const deps = {
    experimentRoot: root,
    runtimeCodexHome,
    loadAndValidateManifest: async (manifestPath) => {
      assert.equal(manifestPath, path.join(root, 'manifest.json'));
      return structuredClone(frozenManifest);
    },
    freezeRun: writeCompleteSyntheticRunLock,
    verifyRunLock: verifySyntheticRunLock,
    withIsolatedCodexHome: async ({
      runtimeCodexHome: suppliedHome,
      operation,
    }) => {
      isolatedHomeCalls += 1;
      assert.equal(suppliedHome, runtimeCodexHome);
      try {
        return await operation({
          isolation: {
            strategy_id: 'CODEX-HOME-NEUTRAL-V1',
            codex_home_path: runtimeCodexHome,
          },
        });
      } finally {
        isolatedHomeCleanups += 1;
      }
    },
    executeAttempt: makeFakeAttemptExecutor({
      manifest: frozenManifest,
      statusesByCall,
      calls,
      stagingRoots,
      runtimeCodexHome,
    }),
    reportRun: async ({ runId, runLock }) => ({
      delegated: true,
      run_id: runId,
      lock_id: runLock.run_id,
    }),
    now: () => new Date('2026-07-28T23:00:00.000Z'),
    writeOutput: (text) => output.push(text),
    ...options.deps,
  };
  return {
    root,
    runtimeCodexHome,
    output,
    calls,
    stagingRoots,
    deps,
    get isolatedHomeCalls() {
      return isolatedHomeCalls;
    },
    get isolatedHomeCleanups() {
      return isolatedHomeCleanups;
    },
  };
}

test('parses exactly one known command and one safe required --run-id', () => {
  for (const command of [
    'validate',
    'render',
    'freeze',
    'execute',
    'score',
    'report',
    'status',
  ]) {
    assert.deepEqual(
      parseCliArguments([command, '--run-id', RUN_ID]),
      { command, runId: RUN_ID },
    );
  }
  for (const argv of [
    [],
    ['render'],
    ['unknown', '--run-id', RUN_ID],
    ['render', '--run', RUN_ID],
    ['render', '--run-id', RUN_ID, '--extra'],
    ['render', '--run-id', RUN_ID, '--run-id', 'other'],
    ['render', '--run-id', '../escape'],
    ['render', '--run-id', '..'],
    ['render', '--run-id', 'nested/run'],
    ['render', '--run-id', 'nested\\run'],
    ['render', '--run-id', '-option'],
  ]) {
    assert.throws(() => parseCliArguments(argv), /usage|command|run-id/i);
  }
});

test('validate loads through the approved loader and reports only local counts', async () => {
  const harness = await makeHarness({
    deps: {
      freezeRun: async () => assert.fail('validate must not freeze'),
      verifyRunLock: async () => assert.fail('validate must not inspect lock'),
      executeAttempt: async () => assert.fail('validate must not execute'),
    },
  });
  const result = await main(
    ['validate', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(result, {
    manifest_rows: 20,
    target_pairs: 19,
    condition_slots: 38,
    images: 40,
    missing_images: 0,
    hash_mismatches: 0,
  });
  assert.equal(await pathExists(path.join(harness.root, 'runs')), false);
  assert.equal(
    harness.output.join(''),
    'manifest_rows=20\n'
      + 'target_pairs=19\n'
      + 'condition_slots=38\n'
      + 'images=40\n'
      + 'missing_images=0\n'
      + 'hash_mismatches=0\n',
  );
});

test('render writes and then byte-verifies the exact schedule plus 38 packet/prompt slots without labels', async () => {
  const harness = await makeHarness();
  const first = await main(
    ['render', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(first, { condition_slots: 38, created: 38, verified: 0 });

  const schedule = buildSchedule(frozenManifest);
  const runPaths = getRunPaths(harness.root, RUN_ID);
  assert.deepEqual(
    await readFile(runPaths.schedulePath),
    serializeJson(schedule),
  );
  for (const entry of schedule) {
    const slotPaths = getSlotPaths(harness.root, RUN_ID, entry);
    const packet = JSON.parse(await readFile(slotPaths.packetPath, 'utf8'));
    const prompt = await readFile(slotPaths.promptPath, 'utf8');
    assert.equal(packet.event_id, entry.event_id);
    assert.equal(packet.row_version, entry.event_row_version);
    assert.equal(packet.condition, entry.condition);
    assert.deepEqual(
      packet.history_event_ids_ordered,
      entry.history_event_ids_ordered,
    );
    assert.equal(prompt, packet.prompt_text);
    assert.equal(await pathExists(slotPaths.labelPath), false);
    assert.equal(await pathExists(slotPaths.attemptPath), false);
  }
  const packetPaths = (await walkFiles(runPaths.targetsDirectory)).filter(
    (filePath) => path.basename(filePath) === 'packet.json',
  );
  assert.equal(packetPaths.length, 38);

  const packetStatBefore = await stat(
    getSlotPaths(harness.root, RUN_ID, schedule[0]).packetPath,
  );
  const second = await main(
    ['render', '--run-id', RUN_ID],
    harness.deps,
  );
  const packetStatAfter = await stat(
    getSlotPaths(harness.root, RUN_ID, schedule[0]).packetPath,
  );
  assert.deepEqual(second, { condition_slots: 38, created: 0, verified: 38 });
  assert.equal(packetStatAfter.mtimeMs, packetStatBefore.mtimeMs);

  const driftedPromptPath = getSlotPaths(
    harness.root,
    RUN_ID,
    schedule[0],
  ).promptPath;
  await writeFile(driftedPromptPath, 'drifted\n');
  await assert.rejects(
    main(['render', '--run-id', RUN_ID], harness.deps),
    /immutable|differs|drift/i,
  );
  assert.equal(await readFile(driftedPromptPath, 'utf8'), 'drifted\n');
});

test('freeze delegates a complete synthetic lock and default freeze fails closed without writing run.json', async () => {
  const harness = await makeHarness();
  await main(['render', '--run-id', RUN_ID], harness.deps);
  const lock = await main(['freeze', '--run-id', RUN_ID], harness.deps);
  assert.equal(lock.completeness, 'complete');
  assert.equal(lock.inventory.length, 80);
  assert.equal(
    await pathExists(getRunPaths(harness.root, RUN_ID).runPath),
    true,
  );

  const failClosed = await makeHarness({
    deps: {
      freezeRun: undefined,
      verifyRunLock: undefined,
    },
  });
  await main(['render', '--run-id', RUN_ID], failClosed.deps);
  await assert.rejects(
    main(['freeze', '--run-id', RUN_ID], failClosed.deps),
    /Task 8|freezeRun|run lock/i,
  );
  assert.equal(
    await pathExists(getRunPaths(failClosed.root, RUN_ID).runPath),
    false,
  );
});

test('freeze supplies Task 8 a temporary clean debug directory and fixed isolated Codex home', async () => {
  let observedDebugDirectory;
  const harness = await makeHarness({
    deps: {
      async freezeRun(input) {
        observedDebugDirectory = input.debugOptions?.cleanDirectory;
        assert.ok(path.isAbsolute(observedDebugDirectory));
        assert.deepEqual(await readdir(observedDebugDirectory), []);
        assert.equal(
          input.debugOptions.runtimeCodexHome,
          input.runtimeCodexHome,
        );
        return writeCompleteSyntheticRunLock(input);
      },
    },
  });
  await main(['render', '--run-id', RUN_ID], harness.deps);
  await main(['freeze', '--run-id', RUN_ID], harness.deps);
  assert.equal(await pathExists(observedDebugDirectory), false);
});

test('execute is immutable and resumable, pauses only on a newly persisted infrastructure failure, and never reveals labels', async () => {
  const harness = await makeHarness({
    statusesByCall: new Map([
      [2, 'invalid_tool_use'],
      [3, 'infrastructure_failure'],
      [4, 'invalid_schema'],
    ]),
  });
  await main(['render', '--run-id', RUN_ID], harness.deps);
  await main(['freeze', '--run-id', RUN_ID], harness.deps);

  const first = await main(
    ['execute', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(harness.calls, [1, 2, 3]);
  assert.equal(first.paused_on_infrastructure_failure, true);
  assert.equal(first.newly_completed, 3);
  assert.equal(first.remaining, 35);

  const schedule = buildSchedule(frozenManifest);
  for (const entry of schedule) {
    assert.equal(
      await pathExists(
        getSlotPaths(harness.root, RUN_ID, entry).labelPath,
      ),
      false,
    );
  }
  const firstAttemptBytes = await readFile(
    getSlotPaths(harness.root, RUN_ID, schedule[0]).attemptPath,
  );

  const second = await main(
    ['execute', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(
    harness.calls,
    Array.from({ length: 38 }, (_, index) => index + 1),
  );
  assert.equal(second.paused_on_infrastructure_failure, false);
  assert.equal(second.newly_completed, 35);
  assert.equal(second.skipped, 3);
  assert.equal(second.remaining, 0);
  assert.deepEqual(
    await readFile(
      getSlotPaths(harness.root, RUN_ID, schedule[0]).attemptPath,
    ),
    firstAttemptBytes,
  );

  const third = await main(
    ['execute', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.equal(third.newly_completed, 0);
  assert.equal(third.skipped, 38);
  assert.equal(harness.calls.length, 38);
  assert.equal(harness.isolatedHomeCalls, 38);
  assert.equal(harness.isolatedHomeCleanups, 38);
  for (const stagingRoot of harness.stagingRoots) {
    assert.equal(await pathExists(stagingRoot), false);
  }
  for (const entry of schedule) {
    assert.equal(
      await pathExists(
        getSlotPaths(harness.root, RUN_ID, entry).labelPath,
      ),
      false,
    );
  }
});

test('score calls the frozen pair/scoring helpers, reveals only complete pairs, never mutates attempts, and verifies labels on rerun', async () => {
  const helperCalls = {
    pairGate: 0,
    scoreAttempt: 0,
    comparePair: 0,
  };
  const scoring = await import('../lib/scoring.mjs');
  const harness = await makeHarness({
    statusesByCall: new Map([[3, 'infrastructure_failure']]),
    deps: {
      assertPairReadyForLabel(...args) {
        helperCalls.pairGate += 1;
        return scoring.assertPairReadyForLabel(...args);
      },
      scoreAttempt(...args) {
        helperCalls.scoreAttempt += 1;
        return scoring.scoreAttempt(...args);
      },
      comparePair(...args) {
        helperCalls.comparePair += 1;
        return scoring.comparePair(...args);
      },
    },
  });
  await main(['render', '--run-id', RUN_ID], harness.deps);
  await main(['freeze', '--run-id', RUN_ID], harness.deps);
  await main(['execute', '--run-id', RUN_ID], harness.deps);

  const schedule = buildSchedule(frozenManifest);
  const firstPair = schedule.slice(0, 2);
  const secondPair = schedule.slice(2, 4);
  const firstPairAttemptBytes = await Promise.all(
    firstPair.map((entry) => (
      readFile(getSlotPaths(harness.root, RUN_ID, entry).attemptPath)
    )),
  );
  const partial = await main(
    ['score', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(partial, { created: 1, verified: 0, pending: 18 });
  assert.equal(
    await pathExists(
      getSlotPaths(harness.root, RUN_ID, firstPair[0]).labelPath,
    ),
    true,
  );
  assert.equal(
    await pathExists(
      getSlotPaths(harness.root, RUN_ID, secondPair[0]).labelPath,
    ),
    false,
  );
  assert.deepEqual(
    await Promise.all(
      firstPair.map((entry) => (
        readFile(getSlotPaths(harness.root, RUN_ID, entry).attemptPath)
      )),
    ),
    firstPairAttemptBytes,
  );

  const firstLabelPath = getSlotPaths(
    harness.root,
    RUN_ID,
    firstPair[0],
  ).labelPath;
  const firstLabelBytes = await readFile(firstLabelPath);
  const firstLabelStat = await stat(firstLabelPath);
  const firstLabel = JSON.parse(firstLabelBytes);
  assert.deepEqual(
    firstLabel.target,
    frozenManifest.rows[1].target,
  );
  assert.deepEqual(
    firstLabel.accepted_aliases,
    frozenManifest.rows[1].accepted_aliases,
  );
  assert.match(
    firstLabel.label_revealed_at_utc,
    /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/,
  );
  assert.deepEqual(
    Object.keys(firstLabel.attempts),
    ['state_only', 'state_plus_all_prior'],
  );
  for (const value of Object.values(firstLabel.attempts)) {
    assert.match(value.sha256, /^[a-f0-9]{64}$/);
    assert.ok(path.isAbsolute(value.path));
  }
  assert.deepEqual(
    Object.keys(firstLabel.scores),
    ['state_only', 'state_plus_all_prior'],
  );
  assert.equal(firstLabel.pair_comparison.event_id, firstPair[0].event_id);

  await main(['execute', '--run-id', RUN_ID], harness.deps);
  const complete = await main(
    ['score', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(complete, { created: 18, verified: 1, pending: 0 });
  assert.deepEqual(await readFile(firstLabelPath), firstLabelBytes);
  assert.equal((await stat(firstLabelPath)).mtimeMs, firstLabelStat.mtimeMs);
  assert.equal(helperCalls.pairGate, 20);
  assert.equal(helperCalls.scoreAttempt, 40);
  assert.equal(helperCalls.comparePair, 20);

  const rerun = await main(
    ['score', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(rerun, { created: 0, verified: 19, pending: 0 });
  assert.equal(helperCalls.pairGate, 39);
  assert.equal(helperCalls.scoreAttempt, 78);
  assert.equal(helperCalls.comparePair, 39);
  assert.deepEqual(await readFile(firstLabelPath), firstLabelBytes);
});

test('status verifies attempts and reports exact status arithmetic plus unexpected and duplicate artifacts', async () => {
  const harness = await makeHarness({
    statusesByCall: new Map([
      [2, 'invalid_tool_use'],
      [3, 'infrastructure_failure'],
      [4, 'invalid_schema'],
    ]),
  });
  await main(['render', '--run-id', RUN_ID], harness.deps);
  await main(['freeze', '--run-id', RUN_ID], harness.deps);
  await main(['execute', '--run-id', RUN_ID], harness.deps);
  await main(['execute', '--run-id', RUN_ID], harness.deps);
  const statusResult = await main(
    ['status', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.deepEqual(statusResult.statuses, {
    valid_prediction: 35,
    invalid_tool_use: 1,
    invalid_schema: 1,
    infrastructure_failure: 1,
  });
  assert.equal(statusResult.completed, 38);
  assert.equal(statusResult.invalid_total, 2);
  assert.equal(statusResult.remaining, 0);
  assert.deepEqual(statusResult.unexpected_artifacts, []);
  assert.deepEqual(statusResult.duplicate_artifacts, []);
  assert.equal(statusResult.duplicate_attempts, 0);

  const schedule = buildSchedule(frozenManifest);
  const originalAttemptPath = getSlotPaths(
    harness.root,
    RUN_ID,
    schedule[0],
  ).attemptPath;
  const duplicatePath = path.join(
    getRunPaths(harness.root, RUN_ID).targetsDirectory,
    'unexpected-copy',
    'attempt.json',
  );
  await mkdir(path.dirname(duplicatePath), { recursive: true });
  await copyFile(originalAttemptPath, duplicatePath);
  await writeFile(
    path.join(
      getRunPaths(harness.root, RUN_ID).targetsDirectory,
      'unexpected.txt',
    ),
    'unexpected',
  );

  const withUnexpected = await main(
    ['status', '--run-id', RUN_ID],
    harness.deps,
  );
  assert.equal(withUnexpected.completed, 38);
  assert.equal(withUnexpected.duplicate_attempts, 1);
  assert.ok(withUnexpected.duplicate_artifacts.includes(duplicatePath));
  assert.ok(
    withUnexpected.unexpected_artifacts.some((entry) => (
      entry.endsWith('unexpected.txt')
    )),
  );
  assert.ok(withUnexpected.unexpected_artifacts.includes(duplicatePath));
});

test('full saved-attempt identity rejects every frozen identity or timestamp drift before skip', async (t) => {
  const harness = await makeHarness();
  await main(['render', '--run-id', RUN_ID], harness.deps);
  await main(['freeze', '--run-id', RUN_ID], harness.deps);
  await main(['execute', '--run-id', RUN_ID], {
    ...harness.deps,
    executeAttempt: makeFakeAttemptExecutor({
      manifest: frozenManifest,
      statusesByCall: new Map([[1, 'infrastructure_failure']]),
      calls: harness.calls,
      stagingRoots: harness.stagingRoots,
      runtimeCodexHome: harness.runtimeCodexHome,
    }),
  });
  const scheduleEntry = buildSchedule(frozenManifest)[0];
  const slotPaths = getSlotPaths(harness.root, RUN_ID, scheduleEntry);
  const attempt = JSON.parse(await readFile(slotPaths.attemptPath, 'utf8'));
  const context = {
    runId: RUN_ID,
    datasetSnapshotId: frozenManifest.dataset_snapshot_id,
    manifestId: frozenManifest.manifest_id,
    schedule: scheduleEntry,
    attemptPath: slotPaths.attemptPath,
    eventsPath: slotPaths.eventsPath,
    finalPath: slotPaths.finalPath,
    packetPath: slotPaths.packetPath,
    packetSha256: await sha256File(slotPaths.packetPath),
    promptSha256: await sha256File(slotPaths.promptPath),
  };
  assert.equal(
    verifyAttemptIdentity(structuredClone(attempt), context),
    attempt.attempt_status,
  );

  const cases = [
    ['run_id', (value) => { value.run_id = 'other'; }],
    ['dataset_snapshot_id', (value) => { value.dataset_snapshot_id = 'other'; }],
    ['manifest_id', (value) => { value.manifest_id = 'other'; }],
    ['event_id', (value) => { value.event_id = 'BLOG-CAND-999'; }],
    ['event_row_version', (value) => { value.event_row_version = 999; }],
    ['paired_target_ordinal', (value) => { value.paired_target_ordinal = 2; }],
    ['call_sequence_index', (value) => { value.call_sequence_index = 2; }],
    ['condition', (value) => { value.condition = 'state_plus_all_prior'; }],
    ['history_event_ids_ordered', (value) => { value.history_event_ids_ordered = ['other']; }],
    ['rendered_packet_path', (value) => { value.rendered_packet_path = '/tmp/other'; }],
    ['rendered_packet_sha256', (value) => { value.rendered_packet_sha256 = '0'.repeat(64); }],
    ['attempt_status', (value) => { value.attempt_status = 'unknown'; }],
    ['requested_at_utc', (value) => { value.requested_at_utc = 'not-a-time'; }],
    ['completed_at_utc', (value) => { value.completed_at_utc = 'not-a-time'; }],
    ['attempt_saved_at_utc', (value) => { value.attempt_saved_at_utc = 'not-a-time'; }],
    ['timestamp ordering', (value) => {
      value.attempt_saved_at_utc = '2026-07-28T20:00:00.000Z';
    }],
  ];
  for (const [name, mutate] of cases) {
    await t.test(name, () => {
      const drifted = structuredClone(attempt);
      mutate(drifted);
      assert.throws(
        () => verifyAttemptIdentity(drifted, context),
        /attempt|identity|timestamp|status|packet|condition|history/i,
      );
    });
  }
});

test('execute, score, and report refuse absent or drifted locks before any attempt or report operation', async () => {
  const harness = await makeHarness();
  await main(['render', '--run-id', RUN_ID], harness.deps);
  let attemptCalls = 0;
  let reportCalls = 0;
  const guardedDeps = {
    ...harness.deps,
    executeAttempt: async () => {
      attemptCalls += 1;
      assert.fail('must not execute without a verified lock');
    },
    reportRun: async () => {
      reportCalls += 1;
      assert.fail('must not report without a verified lock');
    },
  };
  await assert.rejects(
    main(['execute', '--run-id', RUN_ID], guardedDeps),
    /run\.json|run lock|ENOENT/i,
  );
  await assert.rejects(
    main(['score', '--run-id', RUN_ID], guardedDeps),
    /run\.json|run lock|ENOENT/i,
  );
  await assert.rejects(
    main(['report', '--run-id', RUN_ID], guardedDeps),
    /run\.json|run lock|ENOENT/i,
  );
  assert.equal(attemptCalls, 0);
  assert.equal(reportCalls, 0);

  await main(['freeze', '--run-id', RUN_ID], harness.deps);
  const firstPacketPath = getSlotPaths(
    harness.root,
    RUN_ID,
    buildSchedule(frozenManifest)[0],
  ).packetPath;
  await writeFile(firstPacketPath, '{}\n');
  await assert.rejects(
    main(['execute', '--run-id', RUN_ID], guardedDeps),
    /hash|lock|drift|packet/i,
  );
  await assert.rejects(
    main(['score', '--run-id', RUN_ID], guardedDeps),
    /hash|lock|drift|packet/i,
  );
  await assert.rejects(
    main(['report', '--run-id', RUN_ID], guardedDeps),
    /hash|lock|drift|packet/i,
  );
  assert.equal(attemptCalls, 0);
  assert.equal(reportCalls, 0);
});

test('report delegates only after lock verification and production dependencies fail closed', async () => {
  const harness = await makeHarness();
  await main(['render', '--run-id', RUN_ID], harness.deps);
  await main(['freeze', '--run-id', RUN_ID], harness.deps);
  assert.deepEqual(
    await main(['report', '--run-id', RUN_ID], harness.deps),
    {
      delegated: true,
      run_id: RUN_ID,
      lock_id: RUN_ID,
    },
  );
  await assert.rejects(
    main(['report', '--run-id', RUN_ID], {
      ...harness.deps,
      reportRun: undefined,
    }),
    /Task 10|reportRun|report/i,
  );
});
