import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { PassThrough } from 'node:stream';

import {
  FROZEN_RUN_ID,
  buildDebugPromptInputArgs,
  freezeRun,
  runDebugPromptInput,
  stageNeutralDebugImages,
  resolveRunPaths,
  validateCandidateArtifacts,
  validateDebugPromptInput,
  validateInstalledCapabilities,
  validateRuntimeCodexHome,
  verifyRunLock,
  withIsolatedCodexHome,
} from '../lib/runlock.mjs';

const EXPERIMENT_ROOT = '/tmp/blog-runlock-fixture/experiment';

function maximumPacket() {
  return {
    event_id: 'BLOG-CAND-027',
    row_version: 2,
    condition: 'state_plus_all_prior',
    prompt_text: 'exact maximum-depth prompt\n',
    images: Array.from({ length: 40 }, (_, index) => ({
      attachment_ordinal: index + 1,
      path: `/tmp/neutral-debug/image-${String(index + 1).padStart(3, '0')}.png`,
      sha256: String(index).padStart(64, '0'),
    })),
  };
}

async function temporaryDirectory(t, prefix) {
  const directory = await mkdtemp(path.join(tmpdir(), prefix));
  t.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(directory, { recursive: true, force: true });
  });
  return directory;
}

function debugAuditFixture() {
  const imageBytes = Array.from(
    { length: 40 },
    (_, index) => Buffer.from(`debug-image-bytes-${index + 1}`),
  );
  const packet = maximumPacket();
  packet.images = packet.images.map((image, index) => ({
    ...image,
    path: `/audit/evidence/BLOG-CAND-${String(index + 1).padStart(3, '0')}/monitor-before.png`,
    sha256: createHash('sha256').update(imageBytes[index]).digest('hex'),
  }));
  const stagedImagePaths = packet.images.map(
    (_, index) => `/tmp/neutral-render/image-${String(index + 1).padStart(3, '0')}.png`,
  );
  const instruction = 'FROZEN NAP DEVELOPER INSTRUCTION';
  const manifest = {
    rows: [
      {
        event_id: 'BLOG-CAND-003',
        source_recording_ref: '/private/source-recording.mp4',
        before_player_time: '00:12',
        action_player_time: '00:13',
        canonical_label: 'Arc -> Coda source seed',
      },
      {
        event_id: 'BLOG-CAND-027',
        source_recording_ref: '/private/source-recording.mp4',
        before_player_time: '04:12',
        action_player_time: '04:16',
        canonical_label: 'Codex -> Patch NAP blog prep in vault -> composer',
      },
    ],
  };
  const userContent = [];
  for (const [index, bytes] of imageBytes.entries()) {
    userContent.push({
      type: 'input_text',
      text: `<image name=[Image #${index + 1}] path="${stagedImagePaths[index]}">`,
    });
    userContent.push({
      type: 'input_image',
      image_url: `data:image/png;base64,${bytes.toString('base64')}`,
    });
    userContent.push({ type: 'input_text', text: '</image>' });
  }
  userContent.push({ type: 'input_text', text: packet.prompt_text });
  const debugJson = [
    {
      type: 'message',
      role: 'developer',
      content: [
        { type: 'input_text', text: '<permissions instructions>built in</permissions instructions>' },
        { type: 'input_text', text: instruction },
        { type: 'input_text', text: '<skills_instructions>built in</skills_instructions>' },
      ],
    },
    {
      type: 'message',
      role: 'user',
      content: [{ type: 'input_text', text: '<environment_context>neutral</environment_context>' }],
    },
    {
      type: 'message',
      role: 'user',
      content: userContent,
    },
  ];
  return {
    debugJson,
    imageBytes,
    instruction,
    manifest,
    packet,
    stagedImagePaths,
  };
}

function fakeSpawnReturning(stdoutText, observedCalls) {
  return (command, args, options) => {
    observedCalls.push({ command, args: [...args], options: { ...options } });
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    queueMicrotask(() => {
      child.stdout.end(stdoutText);
      child.stderr.end();
      child.emit('close', 0, null);
    });
    return child;
  };
}

const FROZEN_EVENT_IDS = [
  'BLOG-CAND-003', 'BLOG-CAND-004', 'BLOG-CAND-006', 'BLOG-CAND-007',
  'BLOG-CAND-008', 'BLOG-CAND-009', 'BLOG-CAND-010', 'BLOG-CAND-011',
  'BLOG-CAND-013', 'BLOG-CAND-014', 'BLOG-CAND-016', 'BLOG-CAND-018',
  'BLOG-CAND-019', 'BLOG-CAND-020', 'BLOG-CAND-021', 'BLOG-CAND-022',
  'BLOG-CAND-023', 'BLOG-CAND-024', 'BLOG-CAND-026', 'BLOG-CAND-027',
];

function fakeSchedule(manifest) {
  const schedule = [];
  for (let index = 1; index < manifest.rows.length; index += 1) {
    const conditions = index % 2 === 1
      ? ['state_only', 'state_plus_all_prior']
      : ['state_plus_all_prior', 'state_only'];
    for (const condition of conditions) {
      schedule.push({
        call_sequence_index: schedule.length + 1,
        paired_target_ordinal: index,
        event_id: manifest.rows[index].event_id,
        event_row_version: 2,
        condition,
        history_event_ids_ordered: condition === 'state_only'
          ? []
          : manifest.rows.slice(0, index).map((row) => row.event_id),
      });
    }
  }
  return schedule;
}

function fakeRenderPacket(manifest, { eventId, condition }) {
  const currentIndex = manifest.rows.findIndex((row) => row.event_id === eventId);
  const history = condition === 'state_plus_all_prior'
    ? manifest.rows.slice(0, currentIndex)
    : [];
  const sourceRows = [...history, manifest.rows[currentIndex]];
  const images = sourceRows.flatMap((row, rowIndex) => row.before_state_inputs.map((image) => ({
    attachment_ordinal: 0,
    provenance_role: rowIndex < history.length ? 'history' : 'current',
    monitor: image.monitor,
    path: image.path,
    sha256: image.sha256,
  }))).map((image, index) => ({ ...image, attachment_ordinal: index + 1 }));
  const prompt = [
    ...history.map((row, index) => (
      `HISTORY EXAMPLE ${index + 1}\nknown_action_target: ${JSON.stringify(row.target)}`
    )),
    'Predict from current before state.',
    '',
  ].join('\n');
  return {
    event_id: eventId,
    row_version: 2,
    condition,
    history_event_ids_ordered: history.map((row) => row.event_id),
    prompt_text: prompt,
    images,
  };
}

async function candidateFixture(t) {
  const experimentRoot = await temporaryDirectory(t, 'blog-freeze-fixture-');
  const runRoot = path.join(experimentRoot, 'runs', FROZEN_RUN_ID);
  await mkdir(runRoot, { recursive: true });
  const evidenceRoot = path.join(experimentRoot, 'evidence');
  await mkdir(evidenceRoot);
  const rows = [];
  for (const [rowIndex, eventId] of FROZEN_EVENT_IDS.entries()) {
    const beforeStateInputs = [];
    for (const monitor of [1, 3]) {
      const imagePath = path.join(evidenceRoot, `evidence-${rowIndex + 1}-${monitor}.png`);
      const bytes = Buffer.from(`evidence-${rowIndex + 1}-${monitor}`);
      await writeFile(imagePath, bytes);
      beforeStateInputs.push({
        monitor,
        path: imagePath,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    }
    rows.push({
      event_id: eventId,
      row_version: 2,
      target: { app: `App ${rowIndex + 1}`, object: `Object ${rowIndex + 1}`, subtarget: null },
      canonical_label: `App ${rowIndex + 1} -> Object ${rowIndex + 1}`,
      accepted_aliases: { app: [], object: [], subtarget: [] },
      before_state_inputs: beforeStateInputs,
    });
  }
  const manifest = {
    dataset_snapshot_id: 'BLOG-MINI-20-V2',
    manifest_id: 'MINI-20-20260728-V2',
    protocol_id: 'BLOG-EXPANDING-HISTORY-SMOKE-V2',
    logical_session_id: 'BLOG-WORK-20260727',
    rows,
  };
  const manifestPath = path.join(experimentRoot, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(path.join(experimentRoot, 'predictor-instruction.txt'), 'instruction\n');
  await writeFile(path.join(experimentRoot, 'prediction.schema.json'), '{}\n');
  await writeFile(path.join(experimentRoot, 'run-smoke.mjs'), '// fake orchestrator\n');
  await mkdir(path.join(experimentRoot, 'lib'));
  for (const name of [
    'manifest.mjs', 'packets.mjs', 'schedule.mjs', 'attempts.mjs',
    'scoring.mjs', 'runlock.mjs',
  ]) {
    await writeFile(path.join(experimentRoot, 'lib', name), `// ${name}\n`);
  }
  await mkdir(path.join(experimentRoot, 'test'));
  await writeFile(path.join(experimentRoot, 'test', 'harness.test.mjs'), '// test\n');

  const schedule = fakeSchedule(manifest);
  await writeFile(path.join(runRoot, 'schedule.json'), `${JSON.stringify(schedule, null, 2)}\n`);
  for (const entry of schedule) {
    const conditionDirectory = path.join(
      runRoot,
      'targets',
      `${String(entry.paired_target_ordinal).padStart(2, '0')}-${entry.event_id}`,
      entry.condition,
    );
    await mkdir(conditionDirectory, { recursive: true });
    const packet = fakeRenderPacket(manifest, {
      eventId: entry.event_id,
      condition: entry.condition,
    });
    await writeFile(
      path.join(conditionDirectory, 'packet.json'),
      `${JSON.stringify(packet, null, 2)}\n`,
    );
    await writeFile(path.join(conditionDirectory, 'prompt.txt'), packet.prompt_text);
  }
  const capabilities = {
    capability_record_version: 1,
    versions: {
      codex_cli: 'codex-cli 0.144.6',
      node: 'v24.2.0',
      image_decoder: 'sips-316',
    },
    cli: {
      exec_help_sha256: 'a'.repeat(64),
      debug_prompt_input_help_sha256: 'b'.repeat(64),
      debug_models_help_sha256: 'c'.repeat(64),
      exec_image_option_variadic: true,
      debug_image_option_variadic: true,
      debug_prompt_uses_positional_after_separator: true,
      debug_supports_ignore_user_config: false,
    },
    model: {
      slug: 'gpt-5.6-sol',
      input_modalities: ['text', 'image'],
      supported_reasoning_efforts: ['max'],
      service_tiers: ['priority'],
      context_window: 272000,
      max_context_window: 272000,
    },
    base_instructions: {
      source: 'codex debug models --bundled:gpt-5.6-sol',
      byte_length: 4,
      sha256: 'd'.repeat(64),
    },
  };
  const debugArtifactPath = path.join(runRoot, 'debug', 'prompt-input.json');
  const dependencies = {
    loadManifestImpl: async () => manifest,
    buildScheduleImpl: fakeSchedule,
    renderPacketImpl: fakeRenderPacket,
    validateCapabilitiesImpl: async () => capabilities,
    testRunner: async () => ({ exitCode: 0, stdout: 'all green', stderr: '' }),
    runDebugImpl: async ({ packet, instruction }) => {
      await mkdir(path.dirname(debugArtifactPath), { recursive: true });
      const bytes = Buffer.from('[]\n');
      await writeFile(debugArtifactPath, bytes);
      return {
        path: debugArtifactPath,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        executable: 'codex',
        argv: buildDebugPromptInputArgs({
          instruction,
          packet,
          imagePaths: packet.images.map(
            (_, index) => `/tmp/neutral/image-${String(index + 1).padStart(3, '0')}.png`,
          ),
        }),
        shell: false,
        isolation_strategy_id: 'NEUTRAL-CODEX-HOME-TRANSIENT-AUTH-SYMLINK-V1',
        validation: {
          debug_validation_version: 1,
          message_count: 3,
          developer_instruction_occurrences: 1,
          user_prompt_occurrences: 1,
          input_image_count: 40,
          image_sha256_ordered: packet.images.map((image) => image.sha256),
          built_in_context: [],
        },
      };
    },
  };
  return {
    capabilities,
    dependencies,
    experimentRoot,
    manifest,
    runRoot,
    schedule,
  };
}

const EXEC_HELP = `
Usage: codex exec [OPTIONS] [PROMPT]
  --ephemeral
  --ignore-user-config
  --ignore-rules
  --skip-git-repo-check
  --sandbox <SANDBOX_MODE>
  --model <MODEL>
  --image <FILE>...
  --output-schema <FILE>
  --json
  --output-last-message <FILE>
`;

const DEBUG_PROMPT_HELP = `
Usage: codex debug prompt-input [OPTIONS] [PROMPT]
  --image <FILE>...
`;

const DEBUG_MODELS_HELP = `
Usage: codex debug models [OPTIONS]
  --bundled
`;

function bundledCatalog(overrides = {}) {
  const model = {
    slug: 'gpt-5.6-sol',
    input_modalities: ['text', 'image'],
    supported_reasoning_levels: [{ effort: 'low' }, { effort: 'max' }],
    service_tiers: [{ id: 'priority', name: 'Fast' }],
    context_window: 272000,
    max_context_window: 272000,
    base_instructions: 'immutable bundled base instructions',
    ...overrides,
  };
  return JSON.stringify({ models: [model] });
}

function capabilityExecutor({
  execHelp = EXEC_HELP,
  debugPromptHelp = DEBUG_PROMPT_HELP,
  debugModelsHelp = DEBUG_MODELS_HELP,
  catalog = bundledCatalog(),
} = {}) {
  const calls = [];
  const execFileImpl = async (file, args, options) => {
    calls.push({ file, args: [...args], options: { ...options } });
    const key = `${file}\0${args.join('\0')}`;
    const outputs = new Map([
      ['codex\0--version', 'codex-cli 0.144.6\n'],
      ['/fake/node\0--version', 'v24.2.0\n'],
      ['/usr/bin/sips\0--version', 'sips-316\n'],
      ['codex\0exec\0--help', execHelp],
      ['codex\0debug\0prompt-input\0--help', debugPromptHelp],
      ['codex\0debug\0models\0--help', debugModelsHelp],
      ['codex\0debug\0models\0--bundled', catalog],
    ]);
    if (!outputs.has(key)) throw new Error(`unexpected fake command: ${key}`);
    return { stdout: outputs.get(key), stderr: '' };
  };
  return { calls, execFileImpl };
}

test('run paths accept only the fixed V2 run ID as a direct child of runs', () => {
  assert.equal(FROZEN_RUN_ID, 'BLOG-SMOKE-20260728-V2');
  assert.deepEqual(
    resolveRunPaths({ experimentRoot: EXPERIMENT_ROOT, runId: FROZEN_RUN_ID }),
    {
      experiment_root: EXPERIMENT_ROOT,
      runs_root: path.join(EXPERIMENT_ROOT, 'runs'),
      run_root: path.join(EXPERIMENT_ROOT, 'runs', FROZEN_RUN_ID),
      run_path: path.join(EXPERIMENT_ROOT, 'runs', FROZEN_RUN_ID, 'run.json'),
    },
  );

  for (const runId of [
    '',
    '.',
    '..',
    '../BLOG-SMOKE-20260728-V2',
    'BLOG-SMOKE-20260728-V2/..',
    '/tmp/BLOG-SMOKE-20260728-V2',
    'BLOG-SMOKE-20260728-v2',
    'BLOG-SMOKE-20260728-V3',
  ]) {
    assert.throws(
      () => resolveRunPaths({ experimentRoot: EXPERIMENT_ROOT, runId }),
      /Invalid run lock: runId must be exactly BLOG-SMOKE-20260728-V2/,
    );
  }

  assert.throws(
    () => resolveRunPaths({ experimentRoot: 'relative/experiment', runId: FROZEN_RUN_ID }),
    /Invalid run lock: experimentRoot must be a normalized absolute path/,
  );
});

test('debug argv uses the frozen model stack, repeated images, and a prompt separator', () => {
  const instruction = 'frozen developer instruction';
  const packet = maximumPacket();
  const args = buildDebugPromptInputArgs({ instruction, packet });

  assert.deepEqual(args.slice(0, 10), [
    'debug',
    'prompt-input',
    '-c',
    'model="gpt-5.6-sol"',
    '-c',
    'model_reasoning_effort="max"',
    '-c',
    'service_tier="priority"',
    '-c',
    `developer_instructions=${JSON.stringify(instruction)}`,
  ]);
  assert.deepEqual(
    args.slice(10, -2),
    packet.images.flatMap((image) => ['--image', image.path]),
  );
  assert.deepEqual(args.slice(-2), ['--', packet.prompt_text]);
  assert.equal(args.filter((argument) => argument === '--image').length, 40);
});

test('debug argv rejects packets that are not the frozen maximum-depth audit', () => {
  const packet = maximumPacket();
  assert.throws(
    () => buildDebugPromptInputArgs({
      instruction: 'instruction',
      packet: { ...packet, event_id: 'BLOG-CAND-026' },
    }),
    /maximum-depth packet must target BLOG-CAND-027/,
  );
  assert.throws(
    () => buildDebugPromptInputArgs({
      instruction: 'instruction',
      packet: { ...packet, images: packet.images.slice(0, 39) },
    }),
    /maximum-depth packet must contain exactly 40 images/,
  );
});

test('installed capability validation records exact versions and frozen model facts', async () => {
  const fake = capabilityExecutor();
  const capabilities = await validateInstalledCapabilities({
    cwd: '/tmp/neutral-preflight',
    nodeCommand: '/fake/node',
    execFileImpl: fake.execFileImpl,
  });

  assert.deepEqual(capabilities.versions, {
    codex_cli: 'codex-cli 0.144.6',
    node: 'v24.2.0',
    image_decoder: 'sips-316',
  });
  assert.deepEqual(capabilities.model, {
    slug: 'gpt-5.6-sol',
    input_modalities: ['text', 'image'],
    supported_reasoning_efforts: ['low', 'max'],
    service_tiers: ['priority'],
    context_window: 272000,
    max_context_window: 272000,
  });
  assert.deepEqual(capabilities.base_instructions, {
    source: 'codex debug models --bundled:gpt-5.6-sol',
    byte_length: Buffer.byteLength('immutable bundled base instructions'),
    sha256: createHash('sha256')
      .update('immutable bundled base instructions')
      .digest('hex'),
  });
  assert.equal(capabilities.cli.exec_image_option_variadic, true);
  assert.equal(capabilities.cli.debug_image_option_variadic, true);
  assert.equal(capabilities.cli.debug_prompt_uses_positional_after_separator, true);
  assert.equal(capabilities.cli.debug_supports_ignore_user_config, false);

  assert.deepEqual(
    fake.calls.map(({ file, args }) => [file, args]),
    [
      ['codex', ['--version']],
      ['/fake/node', ['--version']],
      ['/usr/bin/sips', ['--version']],
      ['codex', ['exec', '--help']],
      ['codex', ['debug', 'prompt-input', '--help']],
      ['codex', ['debug', 'models', '--help']],
      ['codex', ['debug', 'models', '--bundled']],
    ],
  );
  for (const call of fake.calls) {
    assert.equal(call.options.cwd, '/tmp/neutral-preflight');
    assert.equal(call.options.shell, false);
  }
});

test('installed capability validation fails closed on every required exec option', async (t) => {
  for (const option of [
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox',
    '--model',
    '--image',
    '--output-schema',
    '--json',
    '--output-last-message',
  ]) {
    await t.test(option, async () => {
      const fake = capabilityExecutor({
        execHelp: EXEC_HELP.replace(
          new RegExp(`^.*${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*\\n`, 'm'),
          '',
        ),
      });
      await assert.rejects(
        validateInstalledCapabilities({
          cwd: '/tmp/neutral-preflight',
          nodeCommand: '/fake/node',
          execFileImpl: fake.execFileImpl,
        }),
        new RegExp(`Codex exec help is missing ${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
      );
    });
  }
});

test('installed capability validation rejects non-variadic images and model misses', async (t) => {
  const cases = [
    {
      name: 'exec image is not variadic',
      options: { execHelp: EXEC_HELP.replace('--image <FILE>...', '--image <FILE>') },
      error: /Codex exec --image must be variadic/,
    },
    {
      name: 'debug image is not variadic',
      options: { debugPromptHelp: DEBUG_PROMPT_HELP.replace('--image <FILE>...', '--image <FILE>') },
      error: /Codex debug prompt-input --image must be variadic/,
    },
    {
      name: 'model is absent',
      options: { catalog: JSON.stringify({ models: [] }) },
      error: /bundled model catalog is missing gpt-5.6-sol/,
    },
    {
      name: 'image modality is absent',
      options: { catalog: bundledCatalog({ input_modalities: ['text'] }) },
      error: /gpt-5.6-sol does not support image input/,
    },
    {
      name: 'max reasoning is absent',
      options: { catalog: bundledCatalog({ supported_reasoning_levels: [{ effort: 'high' }] }) },
      error: /gpt-5.6-sol does not support max reasoning/,
    },
    {
      name: 'priority service is absent',
      options: { catalog: bundledCatalog({ service_tiers: [] }) },
      error: /gpt-5.6-sol does not support priority service/,
    },
    {
      name: 'context is insufficient',
      options: { catalog: bundledCatalog({ context_window: 271999 }) },
      error: /gpt-5.6-sol context window is insufficient for 40 images/,
    },
    {
      name: 'base instructions are absent',
      options: { catalog: bundledCatalog({ base_instructions: '' }) },
      error: /gpt-5.6-sol bundled base instructions are missing/,
    },
  ];

  for (const { name, options, error } of cases) {
    await t.test(name, async () => {
      const fake = capabilityExecutor(options);
      await assert.rejects(
        validateInstalledCapabilities({
          cwd: '/tmp/neutral-preflight',
          nodeCommand: '/fake/node',
          execFileImpl: fake.execFileImpl,
        }),
        error,
      );
    });
  }
});

test('runtime Codex home must be private and contain no config or custom instructions', async (t) => {
  const runtimeCodexHome = await temporaryDirectory(t, 'blog-runtime-codex-home-');
  await chmod(runtimeCodexHome, 0o700);
  const isolation = await validateRuntimeCodexHome({ runtimeCodexHome });
  assert.deepEqual(isolation, {
    strategy_id: 'NEUTRAL-CODEX-HOME-TRANSIENT-AUTH-SYMLINK-V1',
    private_directory_mode: '0700',
    allowed_entries: [],
    auth_material_strategy: 'transient-symlink-only',
    credential_bytes_read_copied_hashed_or_logged: false,
    debug_and_exec_share_codex_home: true,
    exec_uses_ignore_user_config: true,
  });

  await chmod(runtimeCodexHome, 0o755);
  await assert.rejects(
    validateRuntimeCodexHome({ runtimeCodexHome }),
    /runtimeCodexHome mode must be 0700/,
  );
  await chmod(runtimeCodexHome, 0o700);
  await writeFile(path.join(runtimeCodexHome, 'config.toml'), 'model = "other"\n');
  await assert.rejects(
    validateRuntimeCodexHome({ runtimeCodexHome }),
    /runtimeCodexHome contains forbidden entries: config.toml/,
  );
});

test('isolated Codex home exposes only a transient auth symlink and always removes it', async (t) => {
  const fixtureRoot = await temporaryDirectory(t, 'blog-runtime-auth-fixture-');
  const runtimeCodexHome = path.join(fixtureRoot, 'runtime-home');
  const authSourcePath = path.join(fixtureRoot, 'source-auth.json');
  await mkdir(runtimeCodexHome, { mode: 0o700 });
  await chmod(runtimeCodexHome, 0o700);
  await writeFile(authSourcePath, '{"secret":"never inspect"}\n', { mode: 0o600 });

  let operationCalled = false;
  const result = await withIsolatedCodexHome({
    runtimeCodexHome,
    authSourcePath,
    baseEnv: {
      PATH: '/usr/bin',
      CODEX_THREAD_ID: 'must-be-removed',
      CODEX_INTERNAL_ORIGINATOR_OVERRIDE: 'must-be-removed',
    },
    operation: async ({ env, isolation }) => {
      operationCalled = true;
      assert.equal(env.CODEX_HOME, runtimeCodexHome);
      assert.equal(env.CODEX_THREAD_ID, undefined);
      assert.equal(env.CODEX_INTERNAL_ORIGINATOR_OVERRIDE, undefined);
      assert.equal((await lstat(path.join(runtimeCodexHome, 'auth.json'))).isSymbolicLink(), true);
      assert.equal(isolation.strategy_id, 'NEUTRAL-CODEX-HOME-TRANSIENT-AUTH-SYMLINK-V1');
      assert.equal(JSON.stringify(isolation).includes(authSourcePath), false);
      return 42;
    },
  });
  assert.equal(operationCalled, true);
  assert.equal(result, 42);
  assert.deepEqual(await readdir(runtimeCodexHome), []);

  await assert.rejects(
    withIsolatedCodexHome({
      runtimeCodexHome,
      authSourcePath,
      operation: async () => {
        throw new Error('synthetic operation failure');
      },
    }),
    /synthetic operation failure/,
  );
  assert.deepEqual(await readdir(runtimeCodexHome), []);
});

test('neutral image staging preserves packet byte order and rejects hash drift', async (t) => {
  const fixtureRoot = await temporaryDirectory(t, 'blog-neutral-image-fixture-');
  const sourceDirectory = path.join(fixtureRoot, 'source-with-audit-ids');
  const cleanDirectory = path.join(fixtureRoot, 'neutral');
  await mkdir(sourceDirectory);
  await mkdir(cleanDirectory, { mode: 0o700 });
  const packet = maximumPacket();
  const expectedBytes = [];
  for (let index = 0; index < 40; index += 1) {
    const bytes = Buffer.from(`fake-png-bytes-${index + 1}`);
    const sourcePath = path.join(
      sourceDirectory,
      `BLOG-CAND-${String(index + 1).padStart(3, '0')}-monitor-before.png`,
    );
    await writeFile(sourcePath, bytes);
    expectedBytes.push(bytes);
    packet.images[index] = {
      ...packet.images[index],
      path: sourcePath,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    };
  }

  const staged = await stageNeutralDebugImages({ packet, cleanDirectory });
  assert.deepEqual(
    staged.image_paths_ordered.map((imagePath) => path.basename(imagePath)),
    Array.from(
      { length: 40 },
      (_, index) => `image-${String(index + 1).padStart(3, '0')}.png`,
    ),
  );
  assert.equal(
    staged.image_paths_ordered.some((imagePath) => imagePath.includes('BLOG-CAND')),
    false,
  );
  for (const [index, imagePath] of staged.image_paths_ordered.entries()) {
    const { readFile } = await import('node:fs/promises');
    assert.deepEqual(await readFile(imagePath), expectedBytes[index]);
  }

  const otherCleanDirectory = path.join(fixtureRoot, 'neutral-drift');
  await mkdir(otherCleanDirectory, { mode: 0o700 });
  const driftedPacket = maximumPacket();
  driftedPacket.images = packet.images.map((image) => ({ ...image }));
  driftedPacket.images[9].sha256 = 'f'.repeat(64);
  await assert.rejects(
    stageNeutralDebugImages({
      packet: driftedPacket,
      cleanDirectory: otherCleanDirectory,
    }),
    /packet image 10 SHA-256 mismatch/,
  );
  assert.deepEqual(await readdir(otherCleanDirectory), []);
});

test('debug JSON validates roles, exact prompt, 40 decoded images, and built-in context hashes', () => {
  const fixture = debugAuditFixture();
  const audit = validateDebugPromptInput({
    debugJson: fixture.debugJson,
    packet: fixture.packet,
    manifest: fixture.manifest,
    instruction: fixture.instruction,
    stagedImagePaths: fixture.stagedImagePaths,
    forbiddenTextFragments: ['THIS VAULT CUSTOM RULE MUST NOT APPEAR'],
  });

  assert.equal(audit.message_count, 3);
  assert.equal(audit.developer_instruction_occurrences, 1);
  assert.equal(audit.user_prompt_occurrences, 1);
  assert.equal(audit.input_image_count, 40);
  assert.deepEqual(
    audit.image_sha256_ordered,
    fixture.packet.images.map((image) => image.sha256),
  );
  assert.ok(audit.built_in_context.length >= 3);
  assert.equal(
    audit.built_in_context.every((entry) => /^[a-f0-9]{64}$/.test(entry.sha256)),
    true,
  );
});

test('debug JSON rejects role, prompt, image-order, and leakage failures', async (t) => {
  const cases = [
    {
      name: 'instruction is not in developer content',
      mutate: (fixture) => {
        fixture.debugJson[0].role = 'user';
      },
      error: /frozen instruction must occur exactly once in developer content/,
    },
    {
      name: 'instruction is duplicated',
      mutate: (fixture) => {
        fixture.debugJson[0].content.push({
          type: 'input_text',
          text: fixture.instruction,
        });
      },
      error: /frozen instruction must occur exactly once in developer content/,
    },
    {
      name: 'prompt text is changed',
      mutate: (fixture) => {
        fixture.debugJson.at(-1).content.at(-1).text = 'different prompt';
      },
      error: /exact prompt must occur once in one user packet/,
    },
    {
      name: 'image bytes are out of order',
      mutate: (fixture) => {
        const first = fixture.debugJson.at(-1).content[1].image_url;
        fixture.debugJson.at(-1).content[1].image_url =
          fixture.debugJson.at(-1).content[4].image_url;
        fixture.debugJson.at(-1).content[4].image_url = first;
      },
      error: /input image 1 SHA-256 does not match packet order/,
    },
    {
      name: 'current event ID leaks',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text += ' BLOG-CAND-027';
      },
      error: /textual debug content leaks audit value: BLOG-CAND-027/,
    },
    {
      name: 'audit time leaks',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text += ' 04:16';
      },
      error: /textual debug content leaks audit value: 04:16/,
    },
    {
      name: 'source path leaks',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text += ' /private/source-recording.mp4';
      },
      error: /textual debug content leaks audit value: \/private\/source-recording\.mp4/,
    },
    {
      name: 'original evidence path leaks',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text += ` ${fixture.packet.images[0].path}`;
      },
      error: /textual debug content leaks audit value: \/audit\/evidence/,
    },
    {
      name: 'current canonical target leaks',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text +=
          ' Codex -> Patch NAP blog prep in vault -> composer';
      },
      error: /textual debug content leaks current canonical target/,
    },
    {
      name: 'global AGENTS memory instructions leak',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text += ' # Memory Behavior';
      },
      error: /textual debug content contains forbidden custom instructions: # Memory Behavior/,
    },
    {
      name: 'vault AGENTS instructions leak',
      mutate: (fixture) => {
        fixture.debugJson[1].content[0].text +=
          " This vault is Dylan's local-first, Git-backed, high-fidelity insight store";
      },
      error: /textual debug content contains forbidden custom instructions: This vault is Dylan/,
    },
  ];

  for (const { name, mutate, error } of cases) {
    await t.test(name, () => {
      const fixture = debugAuditFixture();
      mutate(fixture);
      assert.throws(
        () => validateDebugPromptInput({
          debugJson: fixture.debugJson,
          packet: fixture.packet,
          manifest: fixture.manifest,
          instruction: fixture.instruction,
          stagedImagePaths: fixture.stagedImagePaths,
        }),
        error,
      );
    });
  }
});

test('debug renderer uses a fake shell-free spawn, neutral cwd, and atomic no-overwrite output', async (t) => {
  const fixtureRoot = await temporaryDirectory(t, 'blog-debug-render-fixture-');
  const cleanDirectory = path.join(fixtureRoot, 'neutral-call');
  const modelImageDirectory = path.join(fixtureRoot, 'neutral-images');
  const runtimeCodexHome = path.join(fixtureRoot, 'runtime-home');
  const artifactDirectory = path.join(fixtureRoot, 'audit');
  const authSourcePath = path.join(fixtureRoot, 'source-auth.json');
  await mkdir(cleanDirectory, { mode: 0o700 });
  await mkdir(modelImageDirectory, { mode: 0o700 });
  await mkdir(runtimeCodexHome, { mode: 0o700 });
  await chmod(runtimeCodexHome, 0o700);
  await mkdir(artifactDirectory);
  await writeFile(authSourcePath, '{"secret":"not model visible"}\n', { mode: 0o600 });

  const fixture = debugAuditFixture();
  for (const [index, image] of fixture.packet.images.entries()) {
    const sourcePath = path.join(fixtureRoot, `source-${index + 1}.png`);
    await writeFile(sourcePath, fixture.imageBytes[index]);
    image.path = sourcePath;
    fixture.debugJson.at(-1).content[index * 3].text =
      `<image name=[Image #${index + 1}] path="${path.join(
        modelImageDirectory,
        `image-${String(index + 1).padStart(3, '0')}.png`,
      )}">`;
  }
  const debugArtifactPath = path.join(artifactDirectory, 'prompt-input.json');
  const observedCalls = [];
  const result = await runDebugPromptInput({
    packet: fixture.packet,
    manifest: fixture.manifest,
    instruction: fixture.instruction,
    cleanDirectory,
    modelImageDirectory,
    runtimeCodexHome,
    authSourcePath,
    debugArtifactPath,
    spawnImpl: fakeSpawnReturning(JSON.stringify(fixture.debugJson), observedCalls),
  });

  assert.equal(observedCalls.length, 1);
  assert.equal(observedCalls[0].command, 'codex');
  assert.deepEqual(observedCalls[0].args.slice(0, 2), ['debug', 'prompt-input']);
  assert.equal(observedCalls[0].args.includes('exec'), false);
  assert.equal(observedCalls[0].options.cwd, cleanDirectory);
  assert.deepEqual(await readdir(cleanDirectory), []);
  assert.equal((await readdir(modelImageDirectory)).length, 40);
  assert.equal(observedCalls[0].options.shell, false);
  assert.equal(observedCalls[0].options.env.CODEX_HOME, runtimeCodexHome);
  assert.equal(observedCalls[0].options.env.CODEX_THREAD_ID, undefined);
  assert.equal(
    observedCalls[0].args.some((argument) => argument.includes('BLOG-CAND')),
    false,
  );
  assert.deepEqual(await readdir(runtimeCodexHome), []);
  assert.deepEqual(JSON.parse(await readFile(debugArtifactPath, 'utf8')), fixture.debugJson);
  assert.equal(result.path, debugArtifactPath);
  assert.equal(result.sha256, createHash('sha256').update(await readFile(debugArtifactPath)).digest('hex'));

  const secondCleanDirectory = path.join(fixtureRoot, 'neutral-call-2');
  await mkdir(secondCleanDirectory, { mode: 0o700 });
  await assert.rejects(
    runDebugPromptInput({
      packet: fixture.packet,
      manifest: fixture.manifest,
      instruction: fixture.instruction,
      cleanDirectory: secondCleanDirectory,
      runtimeCodexHome,
      authSourcePath,
      debugArtifactPath,
      spawnImpl: () => {
        throw new Error('must not spawn when audit exists');
      },
    }),
    /prompt-input\.json already exists/,
  );
});

test('candidate validation requires all 38 exact rendered packets and the 40-image maximum', async (t) => {
  const fixture = await candidateFixture(t);
  const candidate = await validateCandidateArtifacts({
    experimentRoot: fixture.experimentRoot,
    runId: FROZEN_RUN_ID,
    ...fixture.dependencies,
  });
  assert.equal(candidate.manifest_rows, 20);
  assert.equal(candidate.target_pairs, 19);
  assert.equal(candidate.condition_slots, 38);
  assert.equal(candidate.distinct_evidence_images, 40);
  assert.equal(candidate.maximum_packet.images.length, 40);
  assert.equal(candidate.maximum_packet.history_event_ids_ordered.length, 19);
  assert.equal(candidate.packet_paths.length, 38);
  assert.equal(candidate.prompt_paths.length, 38);

  const missingPrompt = candidate.prompt_paths[7];
  await unlink(missingPrompt);
  await assert.rejects(
    validateCandidateArtifacts({
      experimentRoot: fixture.experimentRoot,
      runId: FROZEN_RUN_ID,
      ...fixture.dependencies,
    }),
    /rendered prompt does not exist/,
  );
});

test('freeze creates one complete sorted lock and verify rejects hash drift', async (t) => {
  const fixture = await candidateFixture(t);
  const lock = await freezeRun({
    experimentRoot: fixture.experimentRoot,
    runId: FROZEN_RUN_ID,
    nowImpl: () => new Date('2026-07-28T20:00:00.000Z'),
    ...fixture.dependencies,
  });
  const runPath = path.join(fixture.runRoot, 'run.json');
  assert.equal(JSON.parse(await readFile(runPath, 'utf8')).run_id, FROZEN_RUN_ID);
  assert.equal(lock.counts.condition_slots, 38);
  assert.equal(lock.counts.distinct_evidence_images, 40);
  assert.deepEqual(
    lock.inventory.map((entry) => entry.path),
    [...lock.inventory.map((entry) => entry.path)].sort(),
  );
  assert.equal(new Set(lock.inventory.map((entry) => entry.path)).size, lock.inventory.length);
  assert.ok(lock.inventory.some((entry) => entry.path.endsWith('/lib/runlock.mjs')));
  assert.ok(lock.inventory.some((entry) => entry.path.endsWith('/run-smoke.mjs')));
  assert.equal(lock.debug_audit.base_instructions.sha256, 'd'.repeat(64));

  const verified = await verifyRunLock({
    experimentRoot: fixture.experimentRoot,
    runId: FROZEN_RUN_ID,
    loadManifestImpl: fixture.dependencies.loadManifestImpl,
    validateCapabilitiesImpl: fixture.dependencies.validateCapabilitiesImpl,
  });
  assert.equal(verified.run_id, FROZEN_RUN_ID);

  await writeFile(path.join(fixture.experimentRoot, 'lib', 'scoring.mjs'), '// drift\n');
  await assert.rejects(
    verifyRunLock({
      experimentRoot: fixture.experimentRoot,
      runId: FROZEN_RUN_ID,
      loadManifestImpl: fixture.dependencies.loadManifestImpl,
      validateCapabilitiesImpl: fixture.dependencies.validateCapabilitiesImpl,
    }),
    /inventory hash drift/,
  );
});

test('freeze production debug path uses runner Codex home and fake debug spawn without a model call', async (t) => {
  const fixture = await candidateFixture(t);
  const runtimeCodexHome = path.join(fixture.experimentRoot, 'runtime-codex-home');
  const authSourcePath = path.join(fixture.experimentRoot, 'source-auth.json');
  await mkdir(runtimeCodexHome, { mode: 0o700 });
  await chmod(runtimeCodexHome, 0o700);
  await writeFile(authSourcePath, '{"secret":"unread"}\n', { mode: 0o600 });
  const maximumPacket = fakeRenderPacket(fixture.manifest, {
    eventId: 'BLOG-CAND-027',
    condition: 'state_plus_all_prior',
  });
  const observed = [];
  const spawnImpl = (command, args, options) => {
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    void (async () => {
      const imagePaths = [];
      for (let index = 0; index < args.length; index += 1) {
        if (args[index] === '--image') imagePaths.push(args[index + 1]);
      }
      observed.push({
        command,
        args: [...args],
        cwd: options.cwd,
        shell: options.shell,
        codexHome: options.env.CODEX_HOME,
        cleanEntries: await readdir(options.cwd),
      });
      const content = [];
      for (const [index, imagePath] of imagePaths.entries()) {
        content.push({
          type: 'input_text',
          text: `<image name=[Image #${index + 1}] path="${imagePath}">`,
        });
        content.push({
          type: 'input_image',
          image_url: `data:image/png;base64,${(
            await readFile(maximumPacket.images[index].path)
          ).toString('base64')}`,
        });
        content.push({ type: 'input_text', text: '</image>' });
      }
      content.push({ type: 'input_text', text: maximumPacket.prompt_text });
      child.stdout.end(JSON.stringify([
        {
          type: 'message',
          role: 'developer',
          content: [
            { type: 'input_text', text: '<permissions instructions>built in</permissions instructions>' },
            { type: 'input_text', text: 'instruction\n' },
          ],
        },
        { type: 'message', role: 'user', content },
      ]));
      child.stderr.end();
      child.emit('close', 0, null);
    })();
    return child;
  };

  const lock = await freezeRun({
    experimentRoot: fixture.experimentRoot,
    runId: FROZEN_RUN_ID,
    runtimeCodexHome,
    authSourcePath,
    loadManifestImpl: fixture.dependencies.loadManifestImpl,
    buildScheduleImpl: fixture.dependencies.buildScheduleImpl,
    renderPacketImpl: fixture.dependencies.renderPacketImpl,
    validateCapabilitiesImpl: fixture.dependencies.validateCapabilitiesImpl,
    testRunner: fixture.dependencies.testRunner,
    debugOptions: { spawnImpl, baseEnv: { PATH: '/usr/bin' } },
  });
  assert.equal(observed.length, 1);
  assert.equal(observed[0].command, 'codex');
  assert.equal(observed[0].args.includes('exec'), false);
  assert.equal(observed[0].shell, false);
  assert.equal(observed[0].codexHome, runtimeCodexHome);
  assert.deepEqual(observed[0].cleanEntries, []);
  assert.deepEqual(await readdir(runtimeCodexHome), []);
  assert.equal(JSON.stringify(lock).includes(authSourcePath), false);
  assert.equal(
    await readFile(path.join(fixture.runRoot, 'debug', 'prompt-input.json'), 'utf8')
      .then((text) => JSON.parse(text).length),
    2,
  );
});

test('freeze refuses test failures and existing locks without leaving a partial run.json', async (t) => {
  const failedFixture = await candidateFixture(t);
  await assert.rejects(
    freezeRun({
      experimentRoot: failedFixture.experimentRoot,
      runId: FROZEN_RUN_ID,
      ...failedFixture.dependencies,
      testRunner: async () => ({ exitCode: 1, stdout: '', stderr: 'synthetic failure' }),
    }),
    /harness tests failed/,
  );
  await assert.rejects(
    readFile(path.join(failedFixture.runRoot, 'run.json')),
    { code: 'ENOENT' },
  );

  const fixture = await candidateFixture(t);
  await freezeRun({
    experimentRoot: fixture.experimentRoot,
    runId: FROZEN_RUN_ID,
    ...fixture.dependencies,
  });
  await assert.rejects(
    freezeRun({
      experimentRoot: fixture.experimentRoot,
      runId: FROZEN_RUN_ID,
      ...fixture.dependencies,
      runDebugImpl: async () => {
        throw new Error('must not reach debug');
      },
    }),
    /run\.json already exists/,
  );
});

test('verify refuses an absent lock', async (t) => {
  const experimentRoot = await temporaryDirectory(t, 'blog-absent-lock-');
  await assert.rejects(
    verifyRunLock({
      experimentRoot,
      runId: FROZEN_RUN_ID,
      validateCapabilitiesImpl: async () => {
        throw new Error('must not check capabilities without a lock');
      },
    }),
    /run\.json does not exist/,
  );
});
