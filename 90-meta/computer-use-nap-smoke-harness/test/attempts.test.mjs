import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import {
  copyFile,
  lstat,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PassThrough, Writable } from 'node:stream';
import test, { after } from 'node:test';

import {
  ATTEMPT_STATUS,
  CODEX_TIMEOUT_MS,
  TERMINATION_GRACE_MS,
  buildCodexArgs,
  executeAttempt,
  observedToolUse,
} from '../lib/attempts.mjs';

const experimentDir = path.resolve(import.meta.dirname, '..');
const frozenSchemaPath = path.join(experimentDir, 'prediction.schema.json');
const temporaryDirectories = new Set();

const instruction = 'developer says "JSON only"\nsecond line';
const prompt = 'predict from these images\n';
const validFinal = JSON.stringify({
  predictions: [
    {
      rank: 1,
      app: 'Codex',
      object: 'Patch NAP blog prep in vault',
      subtarget: 'composer',
      reason: 'The composer is active.',
    },
    {
      rank: 2,
      app: 'Arc',
      object: 'Twitter webpage',
      subtarget: null,
      reason: 'The page is visible.',
    },
  ],
});
const schedule = Object.freeze({
  call_sequence_index: 1,
  paired_target_ordinal: 1,
  event_id: 'BLOG-CAND-004',
  event_row_version: 2,
  condition: 'state_only',
  history_event_ids_ordered: [],
});

after(async () => {
  await Promise.all([...temporaryDirectories].map((directory) => rm(directory, { recursive: true, force: true })));
});

async function makeCallFixture({ precreateArtifacts = false } = {}) {
  const cleanCallDirectory = await mkdtemp(path.join(tmpdir(), 'blog-attempt-'));
  temporaryDirectories.add(cleanCallDirectory);
  const schemaPath = path.join(cleanCallDirectory, 'prediction.schema.json');
  const stagingFinalPath = path.join(cleanCallDirectory, 'final.json');
  const auditDirectory = await mkdtemp(path.join(tmpdir(), 'blog-attempt-audit-'));
  temporaryDirectories.add(auditDirectory);
  const eventsPath = path.join(auditDirectory, 'events.jsonl');
  const finalPath = path.join(auditDirectory, 'final.json');
  const attemptPath = path.join(auditDirectory, 'attempt.json');
  await copyFile(frozenSchemaPath, schemaPath);
  if (precreateArtifacts) {
    await writeFile(stagingFinalPath, '');
    await writeFile(eventsPath, '');
    await writeFile(finalPath, '');
  }
  const sourceImageDirectory = await mkdtemp(path.join(tmpdir(), `${schedule.event_id}-source-images-`));
  const modelImageDirectory = await mkdtemp(path.join(tmpdir(), 'blog-neutral-model-images-'));
  const codexHomePath = await mkdtemp(path.join(tmpdir(), 'blog-neutral-codex-home-'));
  temporaryDirectories.add(sourceImageDirectory);
  temporaryDirectories.add(modelImageDirectory);
  temporaryDirectories.add(codexHomePath);
  const imagePaths = [];
  const modelImagePathsOrdered = [];
  const imageBytesOrdered = [];
  for (const [index, name] of ['monitor-1-before.png', 'monitor-3-before.png'].entries()) {
    const imagePath = path.join(sourceImageDirectory, name);
    const imageBytes = Buffer.from(`distinct-fake-image-${index + 1}`);
    await writeFile(imagePath, imageBytes);
    imagePaths.push(imagePath);
    imageBytesOrdered.push(imageBytes);
    const modelImagePath = path.join(modelImageDirectory, `image-${String(index + 1).padStart(3, '0')}.png`);
    await writeFile(modelImagePath, imageBytes);
    modelImagePathsOrdered.push(modelImagePath);
  }
  const packet = {
    event_id: schedule.event_id,
    row_version: schedule.event_row_version,
    condition: schedule.condition,
    prompt_text: prompt,
    images: imagePaths.map((imagePath, index) => ({
      attachment_ordinal: index + 1,
      path: imagePath,
      sha256: createHash('sha256').update(imageBytesOrdered[index]).digest('hex'),
    })),
  };
  const renderedPacketPath = path.join(auditDirectory, 'packet.json');
  const renderedPromptPath = path.join(auditDirectory, 'prompt.txt');
  const renderedPacketBytes = Buffer.from(JSON.stringify(packet));
  await writeFile(renderedPacketPath, renderedPacketBytes);
  await writeFile(renderedPromptPath, prompt);
  return {
    cleanCallDirectory,
    auditDirectory,
    schemaPath,
    stagingFinalPath,
    eventsPath,
    finalPath,
    attemptPath,
    imagePaths,
    imageBytesOrdered,
    modelImageDirectory,
    modelImagePathsOrdered,
    codexHomePath,
    packet,
    renderedPacketPath,
    renderedPromptPath,
    renderedPacketSha256: createHash('sha256').update(renderedPacketBytes).digest('hex'),
  };
}

class FakeChild extends EventEmitter {
  constructor({ onInput, onKill } = {}) {
    super();
    this.stdout = new PassThrough();
    this.stderr = new PassThrough();
    this.kills = [];
    const chunks = [];
    this.stdin = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
      final(callback) {
        onInput?.(Buffer.concat(chunks).toString('utf8'));
        callback();
      },
    });
    this.onKill = onKill;
  }

  kill(signal) {
    this.kills.push(signal);
    this.onKill?.(signal, this);
    return true;
  }

  finish({ exitCode = 0, signal = null, stdout = '', stderr = '' } = {}) {
    if (stdout) this.stdout.write(stdout);
    if (stderr) this.stderr.write(stderr);
    this.stdout.end();
    this.stderr.end();
    queueMicrotask(() => this.emit('close', exitCode, signal));
  }
}

function successfulSpawn(options = {}) {
  const finalText = Object.hasOwn(options, 'finalText') ? options.finalText : validFinal;
  const events = Object.hasOwn(options, 'events')
    ? options.events
    : [{ type: 'thread.started' }, { type: 'turn.started' }, { type: 'turn.completed' }];
  const exitCode = options.exitCode ?? 0;
  const stderr = options.stderr ?? '';
  const calls = [];
  const spawnImpl = (command, args, options) => {
    const child = new FakeChild();
    calls.push({ command, args, options, child });
    queueMicrotask(async () => {
      const finalIndex = args.indexOf('--output-last-message');
      if (finalText !== undefined) await writeFile(args[finalIndex + 1], finalText);
      child.finish({
        exitCode,
        stderr,
        stdout: events.map((event) => typeof event === 'string' ? event : JSON.stringify(event)).join('\n') + (events.length ? '\n' : ''),
      });
    });
    return child;
  };
  return { calls, spawnImpl };
}

async function runFixture(fixture, spawnImpl, overrides = {}) {
  return executeAttempt({
    runId: 'BLOG-SMOKE-20260728-V2',
    datasetSnapshotId: 'BLOG-MINI-20-V2',
    manifestId: 'MINI-20-20260728-V2',
    schedule,
    packet: fixture.packet,
    renderedPacketPath: fixture.renderedPacketPath,
    renderedPacketSha256: fixture.renderedPacketSha256,
    instruction,
    schemaPath: fixture.schemaPath,
    cleanCallDirectory: fixture.cleanCallDirectory,
    stagingFinalPath: fixture.stagingFinalPath,
    modelImagePathsOrdered: fixture.modelImagePathsOrdered,
    codexHomePath: fixture.codexHomePath,
    eventsPath: fixture.eventsPath,
    finalPath: fixture.finalPath,
    attemptPath: fixture.attemptPath,
    codexCommand: '/opt/homebrew/bin/codex',
    spawnImpl,
    ...overrides,
  });
}

async function waitFor(predicate) {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  assert.fail('timed out waiting for fake executor state');
}

test('exports the exact frozen statuses and timeout constants', () => {
  assert.deepEqual(ATTEMPT_STATUS, {
    VALID_PREDICTION: 'valid_prediction',
    INVALID_TOOL_USE: 'invalid_tool_use',
    INFRASTRUCTURE_FAILURE: 'infrastructure_failure',
    INVALID_SCHEMA: 'invalid_schema',
  });
  assert.equal(CODEX_TIMEOUT_MS, 1_200_000);
  assert.equal(TERMINATION_GRACE_MS, 5_000);
});

test('builds exact shell-free Codex argv with quoted developer instructions and ordered images', async () => {
  const fixture = await makeCallFixture();
  assert.deepEqual(buildCodexArgs({
    instruction,
    schemaPath: fixture.schemaPath,
    finalPath: fixture.stagingFinalPath,
    cleanCallDirectory: fixture.cleanCallDirectory,
    modelImagePathsOrdered: fixture.modelImagePathsOrdered,
  }), [
    'exec',
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox', 'read-only',
    '--model', 'gpt-5.6-sol',
    '-c', 'model_reasoning_effort="max"',
    '-c', 'service_tier="priority"',
    '-c', `developer_instructions=${JSON.stringify(instruction)}`,
    '--output-schema', fixture.schemaPath,
    '--json',
    '--output-last-message', fixture.stagingFinalPath,
    '--cd', fixture.cleanCallDirectory,
    '--image', fixture.modelImagePathsOrdered[0],
    '--image', fixture.modelImagePathsOrdered[1],
    '--',
    '-',
  ]);
});

test('spawns once without a shell, writes the exact prompt to stdin, and preserves image ordering', async () => {
  const fixture = await makeCallFixture({ precreateArtifacts: true });
  let stdinText;
  const calls = [];
  const spawnImpl = (command, args, options) => {
    const child = new FakeChild({ onInput: (value) => { stdinText = value; } });
    calls.push({ command, args, options, child });
    queueMicrotask(async () => {
      const finalIndex = args.indexOf('--output-last-message');
      await writeFile(args[finalIndex + 1], validFinal);
      child.finish({ stdout: '{"type":"thread.started","thread_id":"fake"}\n' });
    });
    return child;
  };

  const originalGlobalCodexHome = process.env.CODEX_HOME;
  const originalSecret = process.env.ATTEMPT_TEST_SECRET_TOKEN;
  const originalUnrelated = process.env.ATTEMPT_TEST_UNRELATED;
  process.env.CODEX_HOME = '/global/real/codex-home-sentinel';
  process.env.ATTEMPT_TEST_SECRET_TOKEN = 'secret-sentinel-value';
  process.env.ATTEMPT_TEST_UNRELATED = 'unrelated-sentinel-value';
  let record;
  try {
    record = await runFixture(fixture, spawnImpl, {
      env: {
        CODEX_HOME: '/caller-controlled-home-must-be-ignored',
        OPENAI_API_KEY: 'caller-controlled-secret-must-be-ignored',
      },
    });
  } finally {
    if (originalGlobalCodexHome === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = originalGlobalCodexHome;
    if (originalSecret === undefined) delete process.env.ATTEMPT_TEST_SECRET_TOKEN;
    else process.env.ATTEMPT_TEST_SECRET_TOKEN = originalSecret;
    if (originalUnrelated === undefined) delete process.env.ATTEMPT_TEST_UNRELATED;
    else process.env.ATTEMPT_TEST_UNRELATED = originalUnrelated;
  }

  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, '/opt/homebrew/bin/codex');
  assert.equal(calls[0].options.shell, false);
  assert.equal(calls[0].options.cwd, fixture.cleanCallDirectory);
  assert.deepEqual(calls[0].options.stdio, ['pipe', 'pipe', 'pipe']);
  assert.equal(calls[0].options.env.CODEX_HOME, fixture.codexHomePath);
  assert.ok(!Object.hasOwn(calls[0].options.env, 'ATTEMPT_TEST_SECRET_TOKEN'));
  assert.ok(!Object.hasOwn(calls[0].options.env, 'ATTEMPT_TEST_UNRELATED'));
  assert.ok(!Object.hasOwn(calls[0].options.env, 'OPENAI_API_KEY'));
  assert.ok(!JSON.stringify(calls[0].options.env).includes('/global/real/codex-home-sentinel'));
  assert.deepEqual(
    Object.keys(calls[0].options.env).sort(),
    Object.keys(process.env)
      .filter((name) => ['PATH', 'HOME', 'TMPDIR', 'SHELL', 'LANG'].includes(name) || /^LC_/.test(name))
      .filter((name) => !/(TOKEN|KEY|SECRET|PASSWORD|CREDENTIAL)/i.test(name))
      .concat('CODEX_HOME')
      .sort(),
  );
  assert.equal(stdinText, prompt);
  assert.deepEqual(
    calls[0].args.flatMap((arg, index) => arg === '--image' ? [calls[0].args[index + 1]] : []),
    fixture.modelImagePathsOrdered,
  );
  assert.ok(!calls[0].args.join('\n').includes(schedule.event_id));
  for (const originalPath of fixture.imagePaths) assert.ok(!calls[0].args.includes(originalPath));
  assert.equal(calls[0].args[calls[0].args.indexOf('--output-last-message') + 1], fixture.stagingFinalPath);
  assert.ok(!calls[0].args.includes(fixture.finalPath));
  assert.ok(!calls[0].args.includes(fixture.eventsPath));
  assert.ok(!calls[0].args.includes(fixture.attemptPath));
  assert.ok(!calls[0].args.includes(fixture.renderedPacketPath));
  assert.ok(!calls[0].args.includes(fixture.renderedPromptPath));
  assert.equal(record.attempt_status, 'valid_prediction');
  assert.deepEqual(record.ranked_predictions, [
    {
      ...JSON.parse(validFinal).predictions[0],
      canonical_label: 'Codex -> Patch NAP blog prep in vault -> composer',
    },
    {
      ...JSON.parse(validFinal).predictions[1],
      canonical_label: 'Arc -> Twitter webpage',
    },
  ]);
  assert.equal(await readFile(fixture.eventsPath, 'utf8'), '{"type":"thread.started","thread_id":"fake"}\n');
  assert.equal(await readFile(fixture.finalPath, 'utf8'), validFinal);
});

test('valid attempt persists frozen schedule, audit template, hashes, process result, and save timestamp', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({
    events: [
      { type: 'thread.started', thread_id: 'fake' },
      { type: 'item.completed', item: { type: 'reasoning', text: 'look at the supplied images' } },
    ],
  });

  const returned = await runFixture(fixture, spawnImpl);
  const saved = JSON.parse(await readFile(fixture.attemptPath, 'utf8'));

  assert.deepEqual(saved, returned);
  assert.equal(saved.record_version, 1);
  assert.equal(saved.run_id, 'BLOG-SMOKE-20260728-V2');
  assert.equal(saved.dataset_snapshot_id, 'BLOG-MINI-20-V2');
  assert.equal(saved.manifest_id, 'MINI-20-20260728-V2');
  assert.equal(saved.event_id, schedule.event_id);
  assert.equal(saved.event_row_version, schedule.event_row_version);
  assert.equal(saved.condition, schedule.condition);
  assert.equal(saved.paired_target_ordinal, schedule.paired_target_ordinal);
  assert.equal(saved.call_sequence_index, schedule.call_sequence_index);
  assert.deepEqual(saved.history_event_ids_ordered, schedule.history_event_ids_ordered);
  assert.equal(saved.attempt_status, 'valid_prediction');
  assert.equal(saved.invalid_reason, null);
  assert.equal(saved.model_provider, 'OpenAI');
  assert.equal(saved.model_name, 'gpt-5.6-sol');
  assert.equal(saved.prompt_id, 'NAP-ACTION-TARGET-V1');
  assert.equal(saved.rendered_packet_path, fixture.renderedPacketPath);
  assert.equal(saved.rendered_packet_sha256, fixture.renderedPacketSha256);
  assert.equal(saved.raw_response_path, fixture.finalPath);
  assert.equal(saved.raw_response_sha256, createHash('sha256').update(validFinal).digest('hex'));
  assert.deepEqual(saved.inference_parameters, {
    temperature: null,
    top_p: null,
    max_output_tokens: null,
    seed: null,
    provider_defaults: ['temperature', 'top_p', 'max_output_tokens', 'seed'],
    model_reasoning_effort: 'max',
    service_tier: 'priority',
  });
  assert.equal(saved.execution.executable, '/opt/homebrew/bin/codex');
  assert.equal(saved.execution.shell, false);
  assert.equal(saved.execution.model, 'gpt-5.6-sol');
  assert.equal(saved.execution.model_reasoning_effort, 'max');
  assert.equal(saved.execution.service_tier, 'priority');
  assert.equal(saved.execution.timeout_ms, 1_200_000);
  assert.equal(saved.execution.termination_grace_ms, 5_000);
  assert.equal(saved.execution.staging_final_path, fixture.stagingFinalPath);
  assert.equal(saved.execution.prompt_isolation_strategy_id, 'CODEX-HOME-NEUTRAL-V1');
  assert.equal(saved.execution.codex_home_path, fixture.codexHomePath);
  assert.ok(!Object.hasOwn(saved.execution, 'env'));
  assert.ok(!Object.hasOwn(saved.execution, 'environment'));
  assert.ok(!JSON.stringify(saved.execution).includes('auth'));
  assert.ok(!JSON.stringify(saved.execution).includes('secret-sentinel-value'));
  assert.deepEqual(saved.execution.image_paths_ordered, fixture.modelImagePathsOrdered);
  for (const originalPath of fixture.imagePaths) assert.ok(!saved.execution.argv.includes(originalPath));
  assert.equal(saved.process.timed_out, false);
  assert.equal(saved.process.exit_code, 0);
  assert.equal(saved.process.signal, null);
  assert.match(saved.requested_at_utc, /^\d{4}-\d\d-\d\dT/);
  assert.match(saved.completed_at_utc, /^\d{4}-\d\d-\d\dT/);
  assert.match(saved.attempt_saved_at_utc, /^\d{4}-\d\d-\d\dT/);
  assert.match(saved.prediction_saved_at_utc, /^\d{4}-\d\d-\d\dT/);
  assert.equal(saved.label_revealed_at_utc, null);
  assert.deepEqual(saved.scored_after_prediction, {
    exact_top_1: null,
    exact_top_3: null,
    useful_shortcut: null,
    scoring_notes: null,
  });
  assert.equal(saved.scored_at_utc, null);
  assert.equal(saved.scorer, null);
  assert.ok(saved.duration_ms >= 0);
  assert.equal(saved.event_log.path, fixture.eventsPath);
  assert.match(saved.event_log.sha256, /^[a-f0-9]{64}$/);
  assert.match(saved.prompt_sha256, /^[a-f0-9]{64}$/);
  assert.match(saved.instruction_sha256, /^[a-f0-9]{64}$/);
  assert.match(saved.schema_sha256, /^[a-f0-9]{64}$/);
  assert.ok(Object.isFrozen(returned));
  assert.ok(Object.isFrozen(returned.ranked_predictions));
  assert.deepEqual(
    (await readdir(fixture.cleanCallDirectory)).sort(),
    ['final.json', 'prediction.schema.json'],
  );
  assert.deepEqual(
    (await readdir(fixture.auditDirectory)).sort(),
    ['attempt.json', 'events.jsonl', 'final.json', 'packet.json', 'prompt.txt'],
  );
});

test('recognizes broad structural tool-use events without flagging ordinary text or reasoning', () => {
  const toolEvents = [
    { type: 'item.started', item: { type: 'command_execution', command: 'pwd' } },
    { type: 'shell_command', command: 'ls' },
    { type: 'item.completed', item: { type: 'mcp_tool_call', server: 'x', tool: 'read' } },
    { type: 'response.output_item.added', item: { type: 'web_search_call' } },
    { type: 'computer_use', action: { type: 'click' } },
    { type: 'browser_action', action: 'open' },
    { type: 'tool_call', name: 'arbitrary_tool' },
    { type: 'custom_tool_call', name: 'arbitrary_tool' },
    { type: 'dynamic_tool_use', name: 'arbitrary_tool' },
    { type: 'response.output_item.added', item: { type: 'function_call', name: 'anything' } },
    { method: 'tools/call', params: { name: 'anything' } },
    { role: 'tool', content: 'result' },
  ];
  for (const event of toolEvents) assert.equal(observedToolUse(event), true, JSON.stringify(event));

  const ordinaryEvents = [
    { type: 'thread.started', thread_id: 'fake' },
    { type: 'item.completed', item: { type: 'reasoning', text: 'A web search or tool call is forbidden.' } },
    { type: 'message', role: 'assistant', content: 'I will answer from the images without tools.' },
    { type: 'response.output_text.delta', delta: 'browser_action is merely quoted text' },
  ];
  for (const event of ordinaryEvents) assert.equal(observedToolUse(event), false, JSON.stringify(event));
});

test('documented lifecycle, agent-message, and reasoning events remain eligible for a valid prediction', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({
    events: [
      { type: 'thread.started', thread_id: 'fake' },
      { type: 'turn.started' },
      { type: 'item.started', item: { type: 'reasoning', text: 'Inspecting supplied images.' } },
      { type: 'item.completed', item: { type: 'agent_message', text: validFinal } },
      { type: 'turn.completed' },
    ],
  });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'valid_prediction');
  assert.deepEqual(record.event_log.category_counts, {
    passive: 5,
    tool_use: 0,
    malformed_jsonl: 0,
    error_event: 0,
    failed_lifecycle: 0,
    unclassified: 0,
  });
  assert.deepEqual(record.event_log.observability_failure_categories, []);
});

test('malformed JSONL is an explicit infrastructure observability failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({
    events: [
      { type: 'thread.started', thread_id: 'fake' },
      '{"type":',
      { type: 'turn.completed' },
    ],
  });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.equal(record.invalid_reason, 'event_stream_observability_failure:malformed_jsonl');
  assert.deepEqual(record.ranked_predictions, []);
  assert.equal(record.event_log.category_counts.malformed_jsonl, 1);
  assert.deepEqual(record.event_log.observability_failure_categories, ['malformed_jsonl']);
});

test('an empty JSONL stream cannot become a valid prediction', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({ events: [] });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.equal(record.invalid_reason, 'event_stream_observability_failure:empty_event_stream');
  assert.deepEqual(record.event_log.observability_failure_categories, ['empty_event_stream']);
});

test('unknown top-level lifecycle is an explicit infrastructure observability failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({
    events: [{ type: 'thread.started' }, { type: 'future.lifecycle' }],
  });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.equal(record.invalid_reason, 'event_stream_observability_failure:unclassified_event_type');
  assert.equal(record.event_log.category_counts.unclassified, 1);
});

test('item lifecycle without a classifiable item type is an infrastructure observability failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({
    events: [{ type: 'thread.started' }, { type: 'item.completed', item: {} }],
  });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.equal(record.invalid_reason, 'event_stream_observability_failure:unclassified_item_type');
  assert.equal(record.event_log.category_counts.unclassified, 1);
  assert.deepEqual(record.event_log.unclassified_descriptors, [{
    line: 2,
    event_type: 'item.completed',
    item_type: null,
  }]);
});

for (const [name, event, expectedReason, expectedCategory] of [
  ['top-level error', { type: 'error', message: 'transport broke' }, 'event_stream_observability_failure:error_event', 'error_event'],
  ['turn.failed', { type: 'turn.failed', error: { message: 'provider broke' } }, 'event_stream_observability_failure:failed_lifecycle', 'failed_lifecycle'],
  ['thread.failed', { type: 'thread.failed', error: { message: 'thread broke' } }, 'event_stream_observability_failure:failed_lifecycle', 'failed_lifecycle'],
]) {
  test(`${name} event is an explicit infrastructure observability failure`, async () => {
    const fixture = await makeCallFixture();
    const { spawnImpl } = successfulSpawn({ events: [{ type: 'thread.started' }, event] });
    const record = await runFixture(fixture, spawnImpl);
    assert.equal(record.attempt_status, 'infrastructure_failure');
    assert.equal(record.invalid_reason, expectedReason);
    assert.equal(record.event_log.category_counts[expectedCategory], 1);
    assert.deepEqual(record.ranked_predictions, []);
  });
}

for (const itemType of [
  'file_change',
  'image_generation',
  'image_view',
  'mcp_tool_call_end',
  'mcp_call_completed',
  'local_shell',
  'computer_action',
  'browser_navigation',
  'future_generic_capability',
]) {
  test(`item lifecycle type ${itemType} fails closed as tool use`, async () => {
    const fixture = await makeCallFixture();
    const { spawnImpl } = successfulSpawn({
      events: [
        { type: 'thread.started' },
        { type: 'item.completed', item: { type: itemType } },
      ],
    });
    const record = await runFixture(fixture, spawnImpl);
    assert.equal(record.attempt_status, 'invalid_tool_use');
    assert.equal(record.invalid_reason, 'observed_tool_use');
    assert.equal(record.event_log.category_counts.tool_use, 1);
    assert.deepEqual(record.ranked_predictions, []);
  });
}

test('recognized item tool use outranks malformed event-stream observability failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({
    events: [
      '{"type":',
      { type: 'item.completed', item: { type: 'file_change' } },
    ],
  });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'invalid_tool_use');
  assert.equal(record.invalid_reason, 'observed_tool_use');
  assert.equal(record.event_log.category_counts.malformed_jsonl, 1);
  assert.equal(record.event_log.category_counts.tool_use, 1);
});

for (const [name, toolEvent] of [
  ['command', { type: 'item.started', item: { type: 'command_execution', command: 'pwd' } }],
  ['shell', { type: 'shell_command', command: 'ls' }],
  ['MCP', { type: 'mcp_tool_call', server: 'fake', tool: 'read' }],
  ['web', { type: 'web_search_call', query: 'x' }],
  ['computer-use', { type: 'computer_use', action: { type: 'click' } }],
  ['browser', { type: 'browser_action', action: 'open' }],
  ['generic', { type: 'tool_call', name: 'unknown' }],
  ['custom generic', { type: 'custom_tool_call', name: 'unknown' }],
]) {
  test(`${name} tool event outranks a valid-looking final response`, async () => {
    const fixture = await makeCallFixture();
    const { spawnImpl } = successfulSpawn({ events: [toolEvent] });
    const record = await runFixture(fixture, spawnImpl);
    assert.equal(record.attempt_status, 'invalid_tool_use');
    assert.deepEqual(record.ranked_predictions, []);
    assert.equal(record.prediction_saved_at_utc, null);
  });
}

test('tool use has precedence over timeout and invalid final JSON', async () => {
  const fixture = await makeCallFixture();
  const timerCallbacks = [];
  const child = new FakeChild({
    onKill(signal, target) {
      if (signal === 'SIGTERM') target.finish({
        exitCode: null,
        signal: 'SIGTERM',
        stdout: `${JSON.stringify({ type: 'tool_call', name: 'x' })}\n`,
      });
    },
  });
  const promise = runFixture(fixture, () => child, {
    setTimeoutImpl(callback, milliseconds) {
      const timer = { callback, milliseconds, cleared: false };
      timerCallbacks.push(timer);
      return timer;
    },
    clearTimeoutImpl(timer) {
      timer.cleared = true;
    },
  });
  await waitFor(() => timerCallbacks.length === 1);
  assert.equal(timerCallbacks[0].milliseconds, 1_200_000);
  timerCallbacks[0].callback();
  const record = await promise;
  assert.equal(record.attempt_status, 'invalid_tool_use');
  assert.deepEqual(record.ranked_predictions, []);
});

for (const [name, finalText] of [
  ['invalid JSON', '{"predictions":'],
  ['wrong top-level key', '{"prediction":[]}'],
  ['extra top-level key', '{"predictions":[{"rank":1,"app":"A","object":"B","subtarget":null,"reason":"R"}],"extra":true}'],
  ['missing prediction field', '{"predictions":[{"rank":1,"app":"A","object":"B","subtarget":null}]}'],
  ['extra prediction field', '{"predictions":[{"rank":1,"app":"A","object":"B","subtarget":null,"reason":"R","extra":true}]}'],
  ['empty predictions', '{"predictions":[]}'],
  ['too many predictions', '{"predictions":[{"rank":1,"app":"A","object":"B","subtarget":null,"reason":"R"},{"rank":2,"app":"A","object":"B","subtarget":null,"reason":"R"},{"rank":3,"app":"A","object":"B","subtarget":null,"reason":"R"},{"rank":4,"app":"A","object":"B","subtarget":null,"reason":"R"}]}'],
  ['wrong field type', '{"predictions":[{"rank":1,"app":7,"object":"B","subtarget":null,"reason":"R"}]}'],
  ['nonconsecutive ranks', '{"predictions":[{"rank":1,"app":"A","object":"B","subtarget":null,"reason":"R"},{"rank":3,"app":"C","object":"D","subtarget":null,"reason":"R"}]}'],
  ['duplicate ranks', '{"predictions":[{"rank":1,"app":"A","object":"B","subtarget":null,"reason":"R"},{"rank":1,"app":"C","object":"D","subtarget":null,"reason":"R"}]}'],
]) {
  test(`${name} is invalid_schema with no ranked predictions`, async () => {
    const fixture = await makeCallFixture();
    const { spawnImpl } = successfulSpawn({ finalText });
    const record = await runFixture(fixture, spawnImpl);
    assert.equal(record.attempt_status, 'invalid_schema');
    assert.deepEqual(record.ranked_predictions, []);
    assert.equal(record.prediction_saved_at_utc, null);
  });
}

test('nonzero exit outranks a schema-valid final and is infrastructure_failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({ finalText: validFinal, exitCode: 23, stderr: 'provider failed' });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.deepEqual(record.ranked_predictions, []);
  assert.equal(record.prediction_saved_at_utc, null);
  assert.equal(record.process.exit_code, 23);
  assert.equal(record.process.stderr_sha256, createHash('sha256').update('provider failed').digest('hex'));
  assert.equal(record.raw_response_sha256, createHash('sha256').update(validFinal).digest('hex'));
});

test('zero exit with no final response is infrastructure_failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({ finalText: undefined, exitCode: 0 });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.deepEqual(record.ranked_predictions, []);
  assert.equal(record.raw_response_sha256, null);
});

test('nonzero exit with no final response is infrastructure_failure', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn({ finalText: undefined, exitCode: 1 });
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.deepEqual(record.ranked_predictions, []);
});

test('timeout sends SIGTERM at exactly 1,200,000ms then SIGKILL after exactly 5,000ms', async () => {
  const fixture = await makeCallFixture();
  const timers = [];
  const child = new FakeChild({
    onKill(signal, target) {
      if (signal === 'SIGKILL') target.finish({ exitCode: null, signal: 'SIGKILL' });
    },
  });
  const promise = runFixture(fixture, () => child, {
    setTimeoutImpl(callback, milliseconds) {
      const timer = { callback, milliseconds, cleared: false };
      timers.push(timer);
      return timer;
    },
    clearTimeoutImpl(timer) {
      timer.cleared = true;
    },
  });
  await waitFor(() => timers.length === 1);
  assert.equal(timers.length, 1);
  assert.equal(timers[0].milliseconds, 1_200_000);
  timers[0].callback();
  assert.deepEqual(child.kills, ['SIGTERM']);
  assert.equal(timers.length, 2);
  assert.equal(timers[1].milliseconds, 5_000);
  timers[1].callback();
  const record = await promise;
  assert.deepEqual(child.kills, ['SIGTERM', 'SIGKILL']);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.equal(record.process.timed_out, true);
  assert.deepEqual(record.ranked_predictions, []);
});

test('timeout does not send SIGKILL when the process exits after SIGTERM', async () => {
  const fixture = await makeCallFixture();
  const timers = [];
  const child = new FakeChild({
    onKill(signal, target) {
      if (signal === 'SIGTERM') target.finish({ exitCode: null, signal: 'SIGTERM' });
    },
  });
  const promise = runFixture(fixture, () => child, {
    setTimeoutImpl(callback, milliseconds) {
      const timer = { callback, milliseconds, cleared: false };
      timers.push(timer);
      return timer;
    },
    clearTimeoutImpl(timer) {
      timer.cleared = true;
    },
  });
  await waitFor(() => timers.length === 1);
  timers[0].callback();
  const record = await promise;
  assert.deepEqual(child.kills, ['SIGTERM']);
  assert.equal(timers[1].milliseconds, 5_000);
  assert.equal(timers[1].cleared, true);
  assert.equal(record.attempt_status, 'infrastructure_failure');
});

test('spawn error persists a single infrastructure_failure attempt', async () => {
  const fixture = await makeCallFixture();
  let calls = 0;
  const spawnImpl = () => {
    calls += 1;
    const child = new FakeChild();
    queueMicrotask(() => child.emit('error', Object.assign(new Error('not found'), { code: 'ENOENT' })));
    return child;
  };
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(calls, 1);
  assert.equal(record.attempt_status, 'infrastructure_failure');
  assert.equal(record.process.spawn_error.code, 'ENOENT');
  assert.deepEqual(record.ranked_predictions, []);
});

test('refuses an existing attempt before spawning and never overwrites it', async () => {
  const fixture = await makeCallFixture();
  const sentinel = '{"immutable":true}\n';
  await writeFile(fixture.attemptPath, sentinel);
  let calls = 0;
  await assert.rejects(
    runFixture(fixture, () => { calls += 1; throw new Error('must not spawn'); }),
    /attempt.*already exists/i,
  );
  assert.equal(calls, 0);
  assert.equal(await readFile(fixture.attemptPath, 'utf8'), sentinel);
});

test('an infrastructure failure is saved once and cannot be retried', async () => {
  const fixture = await makeCallFixture();
  const fake = successfulSpawn({ exitCode: 1, finalText: undefined });
  const first = await runFixture(fixture, fake.spawnImpl);
  assert.equal(first.attempt_status, 'infrastructure_failure');
  await assert.rejects(runFixture(fixture, fake.spawnImpl), /attempt.*already exists/i);
  assert.equal(fake.calls.length, 1);
});

test('claims the immutable attempt slot before spawn so concurrent callers cannot duplicate it', async () => {
  const fixture = await makeCallFixture();
  const calls = [];
  const firstChild = new FakeChild();
  const spawnImpl = () => {
    calls.push(firstChild);
    return firstChild;
  };
  const firstPromise = runFixture(fixture, spawnImpl);
  await waitFor(() => calls.length === 1);

  await assert.rejects(runFixture(fixture, spawnImpl), /attempt.*(?:in progress|being saved)/i);
  assert.equal(calls.length, 1);

  await writeFile(fixture.stagingFinalPath, validFinal);
  firstChild.finish({ stdout: '{"type":"thread.started","thread_id":"fake"}\n' });
  const record = await firstPromise;
  assert.equal(record.attempt_status, 'valid_prediction');
});

test('persists attempt by sibling temporary file and leaves no temporary or lock artifacts', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn();
  await runFixture(fixture, spawnImpl);
  const cleanEntries = await readdir(fixture.cleanCallDirectory);
  assert.deepEqual(cleanEntries.sort(), ['final.json', 'prediction.schema.json']);
  const auditEntries = await readdir(fixture.auditDirectory);
  assert.deepEqual(auditEntries.sort(), ['attempt.json', 'events.jsonl', 'final.json', 'packet.json', 'prompt.txt']);
  const attemptStat = await lstat(fixture.attemptPath);
  assert.equal(attemptStat.isFile(), true);
});

test('clean call directory rejects packet, prompt, audit artifacts, manifest, labels, prior results, and runner source', async () => {
  for (const forbiddenName of ['packet.json', 'prompt.txt', 'attempt.json', 'events.jsonl', 'manifest.json', 'label.json', 'prior-attempt.json', 'run-smoke.mjs']) {
    const fixture = await makeCallFixture();
    await writeFile(path.join(fixture.cleanCallDirectory, forbiddenName), '{}');
    let calls = 0;
    await assert.rejects(
      runFixture(fixture, () => { calls += 1; throw new Error('must not spawn'); }),
      /clean call directory.*unexpected/i,
    );
    assert.equal(calls, 0);
  }

  const fixture = await makeCallFixture();
  const nested = path.join(fixture.auditDirectory, 'nested', 'attempt.json');
  await assert.rejects(
    runFixture(fixture, () => { throw new Error('must not spawn'); }, { attemptPath: nested }),
    /durable audit artifacts.*same directory/i,
  );
});

test('durable event, final, and attempt artifacts must share one separate audit directory', async () => {
  const fixture = await makeCallFixture();
  const otherAuditDirectory = await mkdtemp(path.join(tmpdir(), 'blog-attempt-other-audit-'));
  temporaryDirectories.add(otherAuditDirectory);
  await assert.rejects(
    runFixture(fixture, () => { throw new Error('must not spawn'); }, {
      eventsPath: path.join(otherAuditDirectory, 'events.jsonl'),
    }),
    /durable audit artifacts.*same directory/i,
  );
});

test('audit packet and prompt are allowed beside durable outputs but are never allowed in staging', async () => {
  const fixture = await makeCallFixture();
  const { spawnImpl } = successfulSpawn();
  const record = await runFixture(fixture, spawnImpl);
  assert.equal(record.rendered_packet_path, fixture.renderedPacketPath);
  assert.equal(await readFile(fixture.renderedPromptPath, 'utf8'), prompt);
  assert.deepEqual((await readdir(fixture.cleanCallDirectory)).sort(), ['final.json', 'prediction.schema.json']);
  assert.deepEqual(
    (await readdir(fixture.auditDirectory)).sort(),
    ['attempt.json', 'events.jsonl', 'final.json', 'packet.json', 'prompt.txt'],
  );
});

test('audit and staging directories and their artifacts reject symlinks and unexpected files', async () => {
  {
    const fixture = await makeCallFixture();
    await writeFile(path.join(fixture.auditDirectory, 'manifest.json'), '{}');
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }),
      /audit directory.*unexpected/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const alias = `${fixture.auditDirectory}-alias`;
    await symlink(fixture.auditDirectory, alias);
    temporaryDirectories.add(alias);
    fixture.auditDirectory = alias;
    fixture.eventsPath = path.join(alias, 'events.jsonl');
    fixture.finalPath = path.join(alias, 'final.json');
    fixture.attemptPath = path.join(alias, 'attempt.json');
    fixture.renderedPacketPath = path.join(alias, 'packet.json');
    fixture.renderedPromptPath = path.join(alias, 'prompt.txt');
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }),
      /audit directory.*symlink/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const external = path.join(await mkdtemp(path.join(tmpdir(), 'blog-attempt-external-')), 'final.json');
    temporaryDirectories.add(path.dirname(external));
    await writeFile(external, '');
    await symlink(external, fixture.stagingFinalPath);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }),
      /staging final.*symlink/i,
    );
  }
});

test('neutral model image paths are required explicitly and never default to packet provenance paths', async () => {
  const fixture = await makeCallFixture();
  let calls = 0;
  await assert.rejects(
    runFixture(fixture, () => { calls += 1; throw new Error('must not spawn'); }, {
      modelImagePathsOrdered: undefined,
    }),
    /modelImagePathsOrdered.*explicitly provided/i,
  );
  assert.equal(calls, 0);
});

test('neutral model image list must have the exact packet length', async () => {
  const fixture = await makeCallFixture();
  await assert.rejects(
    runFixture(fixture, () => { throw new Error('must not spawn'); }, {
      modelImagePathsOrdered: fixture.modelImagePathsOrdered.slice(0, 1),
    }),
    /model image.*same length/i,
  );
});

test('neutral model image paths require exact zero-padded ordered basenames', async () => {
  const fixture = await makeCallFixture();
  const wrongName = path.join(fixture.modelImageDirectory, 'monitor-1-before.png');
  await writeFile(wrongName, fixture.imageBytesOrdered[0]);
  await assert.rejects(
    runFixture(fixture, () => { throw new Error('must not spawn'); }, {
      modelImagePathsOrdered: [wrongName, fixture.modelImagePathsOrdered[1]],
    }),
    /model image 1.*image-001\.png/i,
  );

  const nonnormalized = `${fixture.modelImageDirectory}/../${path.basename(fixture.modelImageDirectory)}/image-001.png`;
  await assert.rejects(
    runFixture(fixture, () => { throw new Error('must not spawn'); }, {
      modelImagePathsOrdered: [nonnormalized, fixture.modelImagePathsOrdered[1]],
    }),
    /model image 1 path.*normalized absolute/i,
  );
});

test('neutral model image bytes must match each corresponding packet hash in exact order', async () => {
  {
    const fixture = await makeCallFixture();
    await writeFile(fixture.modelImagePathsOrdered[0], 'mismatched bytes');
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }),
      /model image 1.*SHA-256 mismatch/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    await writeFile(fixture.modelImagePathsOrdered[0], fixture.imageBytesOrdered[1]);
    await writeFile(fixture.modelImagePathsOrdered[1], fixture.imageBytesOrdered[0]);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }),
      /model image 1.*SHA-256 mismatch/i,
    );
  }
});

test('neutral model images reject symlinks and staging or audit directory placement', async () => {
  {
    const fixture = await makeCallFixture();
    await rm(fixture.modelImagePathsOrdered[0]);
    await symlink(fixture.imagePaths[0], fixture.modelImagePathsOrdered[0]);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }),
      /model image 1.*symlink/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const stagedModelImage = path.join(fixture.cleanCallDirectory, 'image-001.png');
    await writeFile(stagedModelImage, fixture.imageBytesOrdered[0]);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, {
        modelImagePathsOrdered: [stagedModelImage, fixture.modelImagePathsOrdered[1]],
      }),
      /model image 1.*outside staging and audit/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const auditedModelImage = path.join(fixture.auditDirectory, 'image-001.png');
    await writeFile(auditedModelImage, fixture.imageBytesOrdered[0]);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, {
        modelImagePathsOrdered: [auditedModelImage, fixture.modelImagePathsOrdered[1]],
      }),
      /model image 1.*outside staging and audit/i,
    );
  }
});

test('neutral Codex home is mandatory and cannot default to the inherited global home', async () => {
  const fixture = await makeCallFixture();
  let calls = 0;
  await assert.rejects(
    runFixture(fixture, () => { calls += 1; throw new Error('must not spawn'); }, {
      codexHomePath: undefined,
    }),
    /codexHomePath.*explicitly provided/i,
  );
  assert.equal(calls, 0);
});

test('neutral Codex home must be a normalized absolute non-symlink directory without event IDs', async () => {
  {
    const fixture = await makeCallFixture();
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, { codexHomePath: 'relative/codex-home' }),
      /codexHomePath.*normalized absolute/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const nonnormalized = `${fixture.codexHomePath}/../${path.basename(fixture.codexHomePath)}`;
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, { codexHomePath: nonnormalized }),
      /codexHomePath.*normalized absolute/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const eventHome = await mkdtemp(path.join(tmpdir(), `${schedule.event_id}-codex-home-`));
    temporaryDirectories.add(eventHome);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, { codexHomePath: eventHome }),
      /codexHomePath.*event ID/i,
    );
  }
  {
    const fixture = await makeCallFixture();
    const alias = `${fixture.codexHomePath}-alias`;
    await symlink(fixture.codexHomePath, alias);
    temporaryDirectories.add(alias);
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, { codexHomePath: alias }),
      /Codex home.*symlink/i,
    );
  }
});

test('neutral Codex home must be disjoint from clean, audit, and model-image directories', async () => {
  for (const location of ['cleanCallDirectory', 'auditDirectory', 'modelImageDirectory']) {
    const fixture = await makeCallFixture();
    await assert.rejects(
      runFixture(fixture, () => { throw new Error('must not spawn'); }, {
        codexHomePath: fixture[location],
      }),
      /Codex home.*disjoint.*(?:clean|audit|model-image)/i,
    );
  }
});

test('paths fail closed for relative images, images inside the clean directory, and symlinked schema', async () => {
  {
    const fixture = await makeCallFixture();
    fixture.packet.images[0].path = 'relative.png';
    await assert.rejects(runFixture(fixture, () => { throw new Error('must not spawn'); }), /image.*absolute/i);
  }
  {
    const fixture = await makeCallFixture();
    const insideImage = path.join(fixture.cleanCallDirectory, 'inside.png');
    await writeFile(insideImage, 'x');
    fixture.packet.images[0].path = insideImage;
    await assert.rejects(runFixture(fixture, () => { throw new Error('must not spawn'); }), /image.*outside/i);
  }
  {
    const fixture = await makeCallFixture();
    const realSchema = path.join(fixture.cleanCallDirectory, 'real-schema.json');
    await rm(fixture.schemaPath);
    await copyFile(frozenSchemaPath, realSchema);
    await symlink(realSchema, fixture.schemaPath);
    await assert.rejects(runFixture(fixture, () => { throw new Error('must not spawn'); }), /schema.*symlink/i);
  }
});
