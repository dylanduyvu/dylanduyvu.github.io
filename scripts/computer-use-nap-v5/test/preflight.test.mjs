import assert from 'node:assert/strict';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  CANONICAL_COMMIT,
  CANONICAL_SHA256,
  METHOD,
} from '../config.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import * as preflight from '../lib/preflight.mjs';

const BEFORE_CHECKS = Object.freeze([
  'canonical_lineage',
  'v4_donor_integrity',
  'prepared_inventory',
  'video_lineage',
  'runtime_versions',
  'cli_capability_hashes',
  'adapter_argv_config',
  'strict_config_local_rejection',
  'auth_isolation',
  'predictor_packet_safety',
  'runtime_storage_permissions',
  'zero_run_state',
  'v5_complete_tests',
  'v4_complete_tests',
]);
const FIXED_NOW = '2026-07-30T15:00:00.000Z';
const TEST_RECEIPT_PATH = 'evaluator/receipts/complete-tests.json';
const BEFORE_RECEIPT_PATH = 'evaluator/receipts/preflight-before-lock.json';
const AFTER_RECEIPT_PATH = 'evaluator/receipts/preflight-after-lock.json';

const validResults = Object.freeze({
  canonical: Object.freeze({
    canonical_dataset_sha256: CANONICAL_SHA256,
    canonical_dataset_commit: CANONICAL_COMMIT,
    retained_count: 220,
    accepted_count: 196,
    accepted_history_count: 196,
    accepted_nontrivial_count: 139,
  }),
  donor: Object.freeze({
    file_count: 21,
    aggregate_sha256: '307f06ad992e20aa51d464a4b04e2145eab6f950f26fcb2edbe289319871d0bc',
    method_lock_sha256: '55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa',
  }),
  prepared: Object.freeze({
    prepared_inventory_sha256: '1'.repeat(64),
    recording_sequence_sha256: '2'.repeat(64),
    target_count: METHOD.targetCount,
    slot_count: METHOD.scheduledSlotCount,
    context_count: METHOD.scheduledSlotCount,
    packet_count: METHOD.scheduledSlotCount,
  }),
  video: Object.freeze({
    recording_sequence_sha256: '2'.repeat(64),
    file_count: 31,
    total_byte_length: 103_005_033,
    total_frame_count: 1_092,
    time_base_count: 13,
  }),
  versions: Object.freeze({
    ffmpeg_version: 'ffmpeg version 8.0 Copyright synthetic',
    ffprobe_version: 'ffprobe version 8.0 Copyright synthetic',
    node_version: 'v24.11.1',
    codex_cli_version: '0.144.6',
  }),
  capabilities: Object.freeze({
    codex_exec_help_sha256: '3'.repeat(64),
    bundled_model_catalog_sha256: '4'.repeat(64),
    bundled_model_instructions_sha256: '5'.repeat(64),
    debug_prompt_input_help_sha256: '6'.repeat(64),
  }),
  adapter: Object.freeze({
    argv_sha256: '7'.repeat(64),
    config_count: 26,
    hard_no_tools_switch: false,
    structural_tool_events_terminal_invalid: true,
    timeout_ms: 1_200_000,
    termination_grace_ms: 5_000,
  }),
  strictConfig: Object.freeze({
    strict_config_accepted: true,
    local_schema_rejection: true,
    provider_requests: 0,
    model_calls: 0,
    exit_code: 1,
    error_sha256: '8'.repeat(64),
  }),
  auth: Object.freeze({
    source_readable: true,
    home_mode: '0700',
    auth_copy_mode: '0600',
    copied_file_count: 1,
    cleanup_verified: true,
    credential_log_count: 0,
    credential_hash_count: 0,
  }),
  packets: Object.freeze({
    target_count: METHOD.targetCount,
    slot_count: METHOD.scheduledSlotCount,
    packet_count: METHOD.scheduledSlotCount,
    pair_count: METHOD.targetCount,
    leakage_audit_count: METHOD.scheduledSlotCount,
    pair_identical_current_count: METHOD.targetCount,
  }),
  storage: Object.freeze({
    runtime_readable: true,
    runtime_writable: true,
    minimum_free_bytes: 1_073_741_824,
  }),
  zeroState: Object.freeze({
    attempt_count: 0,
    environment_stop_count: 0,
    completion_count: 0,
    adjudication_count: 0,
    revealed_count: 0,
  }),
  v5: Object.freeze({
    passed: 398,
    failures: 0,
    skips: 0,
    warnings: 0,
    model_calls: 0,
    exit_code: 0,
    output_sha256: '9'.repeat(64),
  }),
  v4: Object.freeze({
    passed: 119,
    failures: 0,
    skips: 0,
    warnings: 0,
    model_calls: 0,
    exit_code: 0,
    output_sha256: 'a'.repeat(64),
  }),
  frozen: Object.freeze({
    verified: true,
    receipts_verified: true,
    method_lock_sha256: 'b'.repeat(64),
    run_lock_sha256: 'c'.repeat(64),
  }),
});

function clone(value) {
  return structuredClone(value);
}

function makeProbes(overrides = {}, calls = []) {
  const result = (name) => {
    calls.push(name);
    const value = Object.hasOwn(overrides, name) ? overrides[name] : validResults[name];
    if (value instanceof Error) throw value;
    return clone(value);
  };
  return {
    canonical: async () => result('canonical'),
    donor: async () => result('donor'),
    prepared: async () => result('prepared'),
    video: async () => result('video'),
    versions: async () => result('versions'),
    capabilities: async () => result('capabilities'),
    adapter: async () => result('adapter'),
    strictConfig: async () => result('strictConfig'),
    auth: async () => result('auth'),
    packets: async () => result('packets'),
    storage: async () => result('storage'),
    zeroState: async () => result('zeroState'),
    suite: async ({ suite }) => result(suite),
    frozen: async () => result('frozen'),
  };
}

async function makeRoot(t) {
  const root = await mkdtemp('/private/tmp/nap-v5-preflight-test-');
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

async function readJson(root, relativePath) {
  return JSON.parse(await readFile(path.join(root, ...relativePath.split('/')), 'utf8'));
}

async function runBefore(t, options = {}) {
  const root = options.root ?? await makeRoot(t);
  const calls = options.calls ?? [];
  const probes = options.probes ?? makeProbes(options.overrides, calls);
  const receipt = await preflight.runPreflight({
    phase: 'before-lock',
    root,
    probes,
    now: () => new Date(FIXED_NOW),
  });
  return { root, calls, probes, receipt };
}

function selfHashedReceipt(phase = 'before-lock') {
  const payload = {
    version: 1,
    passed: true,
    phase,
    complete_test_receipt_sha256: 'd'.repeat(64),
    checks: BEFORE_CHECKS.map((name) => ({ name, passed: true })),
    created_at_utc: FIXED_NOW,
  };
  if (phase === 'after-lock') {
    payload.checks.push({ name: 'frozen_run', passed: true });
  }
  return {
    ...payload,
    receipt_sha256: sha256(canonicalJson(payload)),
  };
}

test('exports exactly the two preflight APIs and rejects an invalid phase before probing', async () => {
  assert.deepEqual(Object.keys(preflight).sort(), [
    'runPreflight',
    'validatePreflightReceipt',
  ]);
  let called = false;
  await assert.rejects(
    preflight.runPreflight({
      phase: 'during-lock',
      root: '/private/tmp/unused-preflight-root',
      probes: { canonical: async () => { called = true; } },
    }),
    /phase.*before-lock.*after-lock/i,
  );
  assert.equal(called, false);
});

test('before-lock runs every no-model check in order and writes canonical self-hashed mode-0600 receipts', async (t) => {
  const { root, calls, receipt } = await runBefore(t);
  assert.deepEqual(calls, [
    'canonical',
    'donor',
    'prepared',
    'video',
    'versions',
    'capabilities',
    'adapter',
    'strictConfig',
    'auth',
    'packets',
    'storage',
    'zeroState',
    'v5',
    'v4',
  ]);
  assert.deepEqual(receipt.checks.map((check) => check.name), BEFORE_CHECKS);
  assert.equal(preflight.validatePreflightReceipt(receipt), receipt);

  const testBytes = await readFile(path.join(root, ...TEST_RECEIPT_PATH.split('/')));
  const preflightBytes = await readFile(path.join(root, ...BEFORE_RECEIPT_PATH.split('/')));
  assert.equal(testBytes.toString('utf8'), canonicalJson(JSON.parse(testBytes)));
  assert.equal(preflightBytes.toString('utf8'), canonicalJson(receipt));
  assert.equal((await lstat(path.join(root, TEST_RECEIPT_PATH))).mode & 0o777, 0o600);
  assert.equal((await lstat(path.join(root, BEFORE_RECEIPT_PATH))).mode & 0o777, 0o600);
  assert.equal(receipt.complete_test_receipt_sha256, sha256(testBytes));
  const { receipt_sha256: receiptSha256, ...receiptPayload } = receipt;
  assert.equal(receiptSha256, sha256(canonicalJson(receiptPayload)));

  const realDonorRoot = await makeRoot(t);
  await mkdir(path.join(realDonorRoot, 'evaluator'), { mode: 0o700 });
  await writeFile(
    path.join(realDonorRoot, 'evaluator/v4-donor-inventory.json'),
    await readFile(
      '/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history/evaluator/v4-donor-inventory.json',
    ),
    { mode: 0o600 },
  );
  const realDonorProbes = makeProbes();
  delete realDonorProbes.donor;
  const realDonorReceipt = await preflight.runPreflight({
    phase: 'before-lock',
    root: realDonorRoot,
    probes: realDonorProbes,
    now: () => new Date(FIXED_NOW),
  });
  assert.equal(
    realDonorReceipt.checks.find((check) => check.name === 'v4_donor_integrity')
      ?.passed,
    true,
  );
});

test('canonical, donor, prepared, and video lineage mismatches fail under their named checks without receipts', async (t) => {
  const cases = [
    ['canonical', { ...validResults.canonical, retained_count: 219 }, 'canonical_lineage'],
    ['donor', { ...validResults.donor, file_count: 20 }, 'v4_donor_integrity'],
    ['prepared', { ...validResults.prepared, packet_count: 29 }, 'prepared_inventory'],
    ['video', { ...validResults.video, total_frame_count: 1_091 }, 'video_lineage'],
  ];
  for (const [probe, value, check] of cases) {
    const root = await makeRoot(t);
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root,
        probes: makeProbes({ [probe]: value }),
        now: () => new Date(FIXED_NOW),
      }),
      new RegExp(`Preflight check ${check} failed`),
    );
    await assert.rejects(lstat(path.join(root, TEST_RECEIPT_PATH)), { code: 'ENOENT' });
    await assert.rejects(lstat(path.join(root, BEFORE_RECEIPT_PATH)), { code: 'ENOENT' });
  }
});

test('requires FFmpeg and ffprobe 8.0, Node 24, Codex 0.144.6, and four capability hashes', async (t) => {
  const source = await readFile(new URL('../lib/preflight.mjs', import.meta.url), 'utf8');
  assert.match(
    source,
    /runCommand\('codex', \['debug', 'models', '--bundled'\]\)/u,
  );
  for (const [probe, value, check] of [
    ['versions', { ...validResults.versions, node_version: 'v23.9.0' }, 'runtime_versions'],
    ['versions', { ...validResults.versions, codex_cli_version: '0.145.0' }, 'runtime_versions'],
    ['capabilities', { ...validResults.capabilities, codex_exec_help_sha256: 'bad' }, 'cli_capability_hashes'],
  ]) {
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root: await makeRoot(t),
        probes: makeProbes({ [probe]: value }),
        now: () => new Date(FIXED_NOW),
      }),
      new RegExp(`Preflight check ${check} failed`),
    );
  }
});

test('requires the exact adapter argv/config contract and local strict-config schema rejection before a provider request', async (t) => {
  for (const [probe, value, check] of [
    ['adapter', { ...validResults.adapter, config_count: 25 }, 'adapter_argv_config'],
    ['adapter', { ...validResults.adapter, hard_no_tools_switch: true }, 'adapter_argv_config'],
    ['strictConfig', { ...validResults.strictConfig, provider_requests: 1 }, 'strict_config_local_rejection'],
    ['strictConfig', { ...validResults.strictConfig, local_schema_rejection: false }, 'strict_config_local_rejection'],
  ]) {
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root: await makeRoot(t),
        probes: makeProbes({ [probe]: value }),
        now: () => new Date(FIXED_NOW),
      }),
      new RegExp(`Preflight check ${check} failed`),
    );
  }
  const preflightSource = await readFile(
    new URL('../lib/preflight.mjs', import.meta.url),
    'utf8',
  );
  assert.match(preflightSource, /'preflight\\n'/u);
  if (process.env.NAP_V5_MODEL_CALLS_FORBIDDEN !== '1') {
    const realStrictProbes = makeProbes();
    delete realStrictProbes.strictConfig;
    const realStrict = await preflight.runPreflight({
      phase: 'before-lock',
      root: await makeRoot(t),
      probes: realStrictProbes,
      now: () => new Date(FIXED_NOW),
    });
    const strictCheck = realStrict.checks.find(
      (check) => check.name === 'strict_config_local_rejection',
    );
    assert.equal(strictCheck?.passed, true);
    assert.equal(strictCheck?.provider_requests, 0);
    assert.equal(strictCheck?.model_calls, 0);
  }
});

test('requires readable auth, one fresh 0700 home, one 0600 copy, zero credential logs or hashes, and cleanup', async (t) => {
  for (const mutation of [
    { source_readable: false },
    { auth_copy_mode: '0644' },
    { copied_file_count: 2 },
    { cleanup_verified: false },
    { credential_log_count: 1 },
    { credential_hash_count: 1 },
  ]) {
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root: await makeRoot(t),
        probes: makeProbes({ auth: { ...validResults.auth, ...mutation } }),
        now: () => new Date(FIXED_NOW),
      }),
      /Preflight check auth_isolation failed/,
    );
  }
});

test('requires the frozen packet pairs, packets, leakage audits, and pair-identical current images', async (t) => {
  for (const mutation of [
    { target_count: 14 },
    { slot_count: 29 },
    { packet_count: 29 },
    { pair_count: 14 },
    { leakage_audit_count: 29 },
    { pair_identical_current_count: 14 },
  ]) {
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root: await makeRoot(t),
        probes: makeProbes({ packets: { ...validResults.packets, ...mutation } }),
        now: () => new Date(FIXED_NOW),
      }),
      /Preflight check predictor_packet_safety failed/,
    );
  }
});

test('requires disk/runtime permissions and zero attempt, completion, adjudication, and revealed state', async (t) => {
  for (const [probe, value, check] of [
    ['storage', { ...validResults.storage, runtime_writable: false }, 'runtime_storage_permissions'],
    ['storage', { ...validResults.storage, minimum_free_bytes: 0 }, 'runtime_storage_permissions'],
    ['zeroState', { ...validResults.zeroState, attempt_count: 1 }, 'zero_run_state'],
    ['zeroState', { ...validResults.zeroState, revealed_count: 1 }, 'zero_run_state'],
  ]) {
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root: await makeRoot(t),
        probes: makeProbes({ [probe]: value }),
        now: () => new Date(FIXED_NOW),
      }),
      new RegExp(`Preflight check ${check} failed`),
    );
  }
});

test('requires fresh V5 398 and V4 119 suite receipts with output hashes and zero model calls', async (t) => {
  for (const [suite, value, check] of [
    ['v5', { ...validResults.v5, passed: 397 }, 'v5_complete_tests'],
    ['v4', { ...validResults.v4, warnings: 1 }, 'v4_complete_tests'],
    ['v5', { ...validResults.v5, model_calls: 1 }, 'v5_complete_tests'],
    ['v4', { ...validResults.v4, output_sha256: 'not-a-hash' }, 'v4_complete_tests'],
  ]) {
    await assert.rejects(
      preflight.runPreflight({
        phase: 'before-lock',
        root: await makeRoot(t),
        probes: makeProbes({ [suite]: value }),
        now: () => new Date(FIXED_NOW),
      }),
      new RegExp(`Preflight check ${check} failed`),
    );
  }
});

test('names fatal probe failures while redacting auth paths, credential bytes, and prediction data', async (t) => {
  const secrets = [
    '/private/secret/auth.json',
    'oauth-token-value',
    'predicted app and reason',
  ];
  let failure;
  try {
    await preflight.runPreflight({
      phase: 'before-lock',
      root: await makeRoot(t),
      probes: makeProbes({
        auth: new Error(`failed ${secrets.join(' :: ')}`),
      }),
      now: () => new Date(FIXED_NOW),
    });
  } catch (error) {
    failure = error;
  }
  assert.match(failure?.message ?? '', /^Preflight check auth_isolation failed$/);
  for (const secret of secrets) assert.doesNotMatch(failure?.message ?? '', new RegExp(secret));

  let clockFailure;
  try {
    await preflight.runPreflight({
      phase: 'before-lock',
      root: await makeRoot(t),
      probes: makeProbes(),
      now: () => {
        throw new Error(`clock exposed ${secrets.join(' :: ')}`);
      },
    });
  } catch (error) {
    clockFailure = error;
  }
  assert.match(
    clockFailure?.message ?? '',
    /^Preflight check receipt_construction failed$/,
  );
  for (const secret of secrets) {
    assert.doesNotMatch(clockFailure?.message ?? '', new RegExp(secret));
  }
});

test('validatePreflightReceipt enforces exact keys, ordered named checks, UTC, and the self hash', () => {
  const receipt = selfHashedReceipt();
  assert.equal(preflight.validatePreflightReceipt(receipt), receipt);
  for (const mutate of [
    (value) => { value.extra = true; },
    (value) => { value.phase = 'during-lock'; },
    (value) => { value.checks[0].name = 'renamed'; },
    (value) => { value.checks[0].prediction = 'secret'; },
    (value) => { value.created_at_utc = 'not-utc'; },
    (value) => { value.receipt_sha256 = '0'.repeat(64); },
  ]) {
    const invalid = clone(receipt);
    mutate(invalid);
    assert.throws(() => preflight.validatePreflightReceipt(invalid), /receipt|check|phase|UTC|SHA-256/i);
  }
});

test('before-lock publication is byte-idempotent and refuses receipt drift without overwrite', async (t) => {
  const first = await runBefore(t);
  const originalTest = await readFile(path.join(first.root, TEST_RECEIPT_PATH));
  const originalPreflight = await readFile(path.join(first.root, BEFORE_RECEIPT_PATH));
  await runBefore(t, { root: first.root });
  assert.deepEqual(await readFile(path.join(first.root, TEST_RECEIPT_PATH)), originalTest);
  assert.deepEqual(await readFile(path.join(first.root, BEFORE_RECEIPT_PATH)), originalPreflight);

  await assert.rejects(
    preflight.runPreflight({
      phase: 'before-lock',
      root: first.root,
      probes: makeProbes({ v5: { ...validResults.v5, output_sha256: 'f'.repeat(64) } }),
      now: () => new Date(FIXED_NOW),
    }),
    /Preflight check receipt_publication failed/,
  );
  assert.deepEqual(await readFile(path.join(first.root, TEST_RECEIPT_PATH)), originalTest);
  assert.deepEqual(await readFile(path.join(first.root, BEFORE_RECEIPT_PATH)), originalPreflight);
});

test('after-lock verifies the frozen run and stored receipts without rewriting them, then writes its own receipt', async (t) => {
  const before = await runBefore(t);
  const originalTest = await readFile(path.join(before.root, TEST_RECEIPT_PATH));
  const originalBefore = await readFile(path.join(before.root, BEFORE_RECEIPT_PATH));
  const calls = [];
  const receipt = await preflight.runPreflight({
    phase: 'after-lock',
    root: before.root,
    probes: makeProbes({}, calls),
    now: () => new Date('2026-07-30T16:00:00.000Z'),
  });
  assert.deepEqual(calls, [
    'canonical',
    'donor',
    'prepared',
    'video',
    'versions',
    'capabilities',
    'adapter',
    'strictConfig',
    'auth',
    'packets',
    'storage',
    'zeroState',
    'v5',
    'v4',
    'frozen',
  ]);
  assert.equal(receipt.phase, 'after-lock');
  assert.equal(receipt.checks.at(-1).name, 'frozen_run');
  assert.deepEqual(await readFile(path.join(before.root, TEST_RECEIPT_PATH)), originalTest);
  assert.deepEqual(await readFile(path.join(before.root, BEFORE_RECEIPT_PATH)), originalBefore);
  assert.equal(
    (await lstat(path.join(before.root, AFTER_RECEIPT_PATH))).mode & 0o777,
    0o600,
  );
  assert.deepEqual(await readJson(before.root, AFTER_RECEIPT_PATH), receipt);
});

test('after-lock fails named on missing or drifted receipts and never publishes an after-lock receipt', async (t) => {
  const missing = await makeRoot(t);
  await assert.rejects(
    preflight.runPreflight({
      phase: 'after-lock',
      root: missing,
      probes: makeProbes(),
      now: () => new Date(FIXED_NOW),
    }),
    /Preflight check stored_receipts failed/,
  );
  await assert.rejects(lstat(path.join(missing, AFTER_RECEIPT_PATH)), { code: 'ENOENT' });

  const drifted = await runBefore(t);
  const beforePath = path.join(drifted.root, BEFORE_RECEIPT_PATH);
  const before = JSON.parse(await readFile(beforePath, 'utf8'));
  before.receipt_sha256 = '0'.repeat(64);
  await writeFile(beforePath, canonicalJson(before), { mode: 0o600 });
  await assert.rejects(
    preflight.runPreflight({
      phase: 'after-lock',
      root: drifted.root,
      probes: makeProbes(),
      now: () => new Date(FIXED_NOW),
    }),
    /Preflight check stored_receipts failed/,
  );
  await assert.rejects(lstat(path.join(drifted.root, AFTER_RECEIPT_PATH)), { code: 'ENOENT' });
  await unlink(beforePath);
});
