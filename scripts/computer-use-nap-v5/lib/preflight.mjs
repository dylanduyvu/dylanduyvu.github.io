import { execFile as execFileCallback, spawn as spawnProcess } from 'node:child_process';
import { constants } from 'node:fs';
import {
  access,
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readdir,
  rm,
  statfs,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import {
  CANONICAL_COMMIT,
  CANONICAL_SHA256,
  METHOD,
  RUNTIME_ROOT,
} from '../config.mjs';
import {
  buildCodexArgs,
  createFreshAttemptRuntime,
} from './codex-adapter.mjs';
import { compileCorpusSnapshot } from './corpus.mjs';
import {
  assertV5HasNoV4Imports,
  validateDonorInventory,
  V4_AGGREGATE_SHA256,
  V4_DONOR_ROOT,
  V4_FILE_COUNT,
  V4_METHOD_LOCK_SHA256,
} from './donor-guard.mjs';
import {
  canonicalJson,
  sha256,
  writeImmutable,
} from './immutable.mjs';
import { auditPredictorSafeTree } from './leakage-audit.mjs';
import { verifyFrozenRun } from './locks.mjs';
import { verifyPrepared } from './prepare.mjs';
import { artifactSha256 } from './task4-validation.mjs';
import {
  inventoryVideoChain,
  reviveVideoInventory,
  serializeVideoInventory,
} from './video-index.mjs';

const execFile = promisify(execFileCallback);
const IMPLEMENTATION_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const TEST_RECEIPT_PATH = 'evaluator/receipts/complete-tests.json';
const BEFORE_RECEIPT_PATH = 'evaluator/receipts/preflight-before-lock.json';
const AFTER_RECEIPT_PATH = 'evaluator/receipts/preflight-after-lock.json';
const V4_DONOR_INVENTORY_PATH = 'evaluator/v4-donor-inventory.json';
const PREPARED_INVENTORY_PATH = 'evaluator/prepared-inventory.json';
const VIDEO_INVENTORY_PATH = 'evaluator/video-inventory.json';
const SCHEDULE_PATH = 'evaluator/schedule.json';
const MINIMUM_FREE_BYTES = 1_073_741_824;
const SHA256 = /^[0-9a-f]{64}$/u;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const EXPECTED_VIDEO = Object.freeze({
  startRecordingId: '1785164400568',
  endpointRecordingId: '1785173529401',
  fileCount: 31,
  totalByteLength: 103_005_033,
  totalFrameCount: 1_092,
  timeBaseCount: 13,
  noEventRecordingIds: Object.freeze([
    '1785165009266',
    '1785165310520',
    '1785172925051',
  ]),
});
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
const CONFIG_COUNT = FEATURE_DISABLES.length + 4;
const TEST_RECEIPT_KEYS = Object.freeze([
  'version',
  'complete',
  'v5_passed',
  'v4_passed',
  'failures',
  'skips',
  'warnings',
  'model_calls',
  'created_at_utc',
  'receipt_sha256',
]);
const SUITE_PROBE_KEYS = Object.freeze([
  'passed',
  'failures',
  'skips',
  'warnings',
  'model_calls',
  'exit_code',
  'output_sha256',
]);
const PREFLIGHT_RECEIPT_KEYS = Object.freeze([
  'version',
  'passed',
  'phase',
  'complete_test_receipt_sha256',
  'checks',
  'created_at_utc',
  'receipt_sha256',
]);
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
const AFTER_CHECKS = Object.freeze([...BEFORE_CHECKS, 'frozen_run']);
const RESULT_KEYS = Object.freeze({
  canonical_lineage: Object.freeze([
    'canonical_dataset_sha256',
    'canonical_dataset_commit',
    'retained_count',
    'accepted_count',
    'accepted_history_count',
    'accepted_nontrivial_count',
  ]),
  v4_donor_integrity: Object.freeze([
    'file_count',
    'aggregate_sha256',
    'method_lock_sha256',
  ]),
  prepared_inventory: Object.freeze([
    'prepared_inventory_sha256',
    'recording_sequence_sha256',
    'target_count',
    'slot_count',
    'context_count',
    'packet_count',
  ]),
  video_lineage: Object.freeze([
    'recording_sequence_sha256',
    'file_count',
    'total_byte_length',
    'total_frame_count',
    'time_base_count',
  ]),
  runtime_versions: Object.freeze([
    'ffmpeg_version',
    'ffprobe_version',
    'node_version',
    'codex_cli_version',
  ]),
  cli_capability_hashes: Object.freeze([
    'codex_exec_help_sha256',
    'bundled_model_catalog_sha256',
    'bundled_model_instructions_sha256',
    'debug_prompt_input_help_sha256',
  ]),
  adapter_argv_config: Object.freeze([
    'argv_sha256',
    'config_count',
    'hard_no_tools_switch',
    'structural_tool_events_terminal_invalid',
    'timeout_ms',
    'termination_grace_ms',
  ]),
  strict_config_local_rejection: Object.freeze([
    'strict_config_accepted',
    'local_schema_rejection',
    'provider_requests',
    'model_calls',
    'exit_code',
    'error_sha256',
  ]),
  auth_isolation: Object.freeze([
    'source_readable',
    'home_mode',
    'auth_copy_mode',
    'copied_file_count',
    'cleanup_verified',
    'credential_log_count',
    'credential_hash_count',
  ]),
  predictor_packet_safety: Object.freeze([
    'target_count',
    'slot_count',
    'packet_count',
    'pair_count',
    'leakage_audit_count',
    'pair_identical_current_count',
  ]),
  runtime_storage_permissions: Object.freeze([
    'runtime_readable',
    'runtime_writable',
    'minimum_free_bytes',
  ]),
  zero_run_state: Object.freeze([
    'attempt_count',
    'environment_stop_count',
    'completion_count',
    'adjudication_count',
    'revealed_count',
  ]),
  v5_complete_tests: Object.freeze([
    'test_count',
    'failures',
    'skips',
    'warnings',
    'model_calls',
    'exit_code',
    'output_sha256',
  ]),
  v4_complete_tests: Object.freeze([
    'test_count',
    'failures',
    'skips',
    'warnings',
    'model_calls',
    'exit_code',
    'output_sha256',
  ]),
  frozen_run: Object.freeze([
    'verified',
    'receipts_verified',
    'method_lock_sha256',
    'run_lock_sha256',
  ]),
});

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, expected, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length
    || actual.some((key, index) => key !== required[index])) {
    throw new Error(`${label} must have exact keys`);
  }
}

function assertHash(value, label) {
  if (typeof value !== 'string' || !SHA256.test(value)) {
    throw new TypeError(`${label} must be a lowercase SHA-256`);
  }
}

function assertNonnegativeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a nonnegative safe integer`);
  }
}

function assertCanonicalUtc(value, label) {
  if (typeof value !== 'string'
    || !ISO_UTC.test(value)
    || new Date(value).toISOString() !== value) {
    throw new Error(`${label} must be canonical UTC`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function relativeTarget(root, relativePath) {
  return path.join(root, ...relativePath.split('/'));
}

async function optionalLstat(filename, options) {
  try {
    return await lstat(filename, options);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function sameSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mode === right.mode
    && left.nlink === right.nlink
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

async function readRegular(filename, label, { mode } = {}) {
  const pathStat = await lstat(filename, { bigint: true });
  if (pathStat.isSymbolicLink() || !pathStat.isFile() || pathStat.nlink !== 1n) {
    throw new Error(`${label} must be a single-link regular file`);
  }
  if (mode !== undefined && Number(pathStat.mode & 0o777n) !== mode) {
    throw new Error(`${label} has the wrong mode`);
  }
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || !sameSnapshot(before, pathStat)) {
      throw new Error(`${label} changed before read`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const finalPath = await lstat(filename, { bigint: true });
    if (!sameSnapshot(before, after)
      || !sameSnapshot(after, finalPath)
      || finalPath.isSymbolicLink()) {
      throw new Error(`${label} changed during read`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

function parseCanonicalJson(bytes, label) {
  let value;
  try {
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new Error(`${label} is not valid UTF-8 JSON`);
  }
  if (canonicalJson(value) !== bytes.toString('utf8')) {
    throw new Error(`${label} is not canonical JSON`);
  }
  return value;
}

async function readRuntimeJson(root, relativePath, label, { mode } = {}) {
  return parseCanonicalJson(
    await readRegular(relativeTarget(root, relativePath), label, { mode }),
    label,
  );
}

function withSelfHash(payload) {
  return deepFreeze({
    ...payload,
    receipt_sha256: sha256(canonicalJson(payload)),
  });
}

function receiptPayload(receipt) {
  const { receipt_sha256: ignored, ...payload } = receipt;
  return payload;
}

function validateCanonicalResult(value) {
  assertExactKeys(value, RESULT_KEYS.canonical_lineage, 'Canonical lineage result');
  if (value.canonical_dataset_sha256 !== CANONICAL_SHA256
    || value.canonical_dataset_commit !== CANONICAL_COMMIT
    || value.retained_count !== 220
    || value.accepted_count !== 196
    || value.accepted_history_count !== 196
    || value.accepted_nontrivial_count !== 139) {
    throw new Error('Canonical lineage differs from the frozen corpus');
  }
}

function validateDonorResult(value) {
  assertExactKeys(value, RESULT_KEYS.v4_donor_integrity, 'V4 donor result');
  if (value.file_count !== V4_FILE_COUNT
    || value.aggregate_sha256 !== V4_AGGREGATE_SHA256
    || value.method_lock_sha256 !== V4_METHOD_LOCK_SHA256) {
    throw new Error('V4 donor result differs from the frozen baseline');
  }
}

function validatePreparedResult(value) {
  assertExactKeys(value, RESULT_KEYS.prepared_inventory, 'Prepared result');
  assertHash(value.prepared_inventory_sha256, 'Prepared inventory SHA-256');
  assertHash(value.recording_sequence_sha256, 'Prepared recording sequence SHA-256');
  if (value.target_count !== METHOD.targetCount
    || value.slot_count !== METHOD.scheduledSlotCount
    || value.context_count !== METHOD.scheduledSlotCount
    || value.packet_count !== METHOD.scheduledSlotCount) {
    throw new Error('Prepared counts differ from the frozen method');
  }
}

function validateVideoResult(value) {
  assertExactKeys(value, RESULT_KEYS.video_lineage, 'Video lineage result');
  assertHash(value.recording_sequence_sha256, 'Video recording sequence SHA-256');
  if (value.file_count !== EXPECTED_VIDEO.fileCount
    || value.total_byte_length !== EXPECTED_VIDEO.totalByteLength
    || value.total_frame_count !== EXPECTED_VIDEO.totalFrameCount
    || value.time_base_count !== EXPECTED_VIDEO.timeBaseCount) {
    throw new Error('Video lineage counts differ from the frozen source chain');
  }
}

function validateVersionsResult(value) {
  assertExactKeys(value, RESULT_KEYS.runtime_versions, 'Runtime versions result');
  if (typeof value.ffmpeg_version !== 'string'
    || !/^ffmpeg version 8\.0(?:\s|$)/u.test(value.ffmpeg_version)
    || typeof value.ffprobe_version !== 'string'
    || !/^ffprobe version 8\.0(?:\s|$)/u.test(value.ffprobe_version)
    || typeof value.node_version !== 'string'
    || !/^v24\.\d+\.\d+$/u.test(value.node_version)
    || value.codex_cli_version !== '0.144.6') {
    throw new Error('Runtime versions differ from FFmpeg 8.0, Node 24, or Codex 0.144.6');
  }
}

function validateCapabilitiesResult(value) {
  assertExactKeys(value, RESULT_KEYS.cli_capability_hashes, 'CLI capability result');
  for (const key of RESULT_KEYS.cli_capability_hashes) {
    assertHash(value[key], `CLI capability ${key}`);
  }
}

function validateAdapterResult(value) {
  assertExactKeys(value, RESULT_KEYS.adapter_argv_config, 'Adapter result');
  assertHash(value.argv_sha256, 'Adapter argv SHA-256');
  if (value.config_count !== CONFIG_COUNT
    || value.hard_no_tools_switch !== false
    || value.structural_tool_events_terminal_invalid !== true
    || value.timeout_ms !== 1_200_000
    || value.termination_grace_ms !== 5_000) {
    throw new Error('Adapter argv or capability contract differs');
  }
}

function validateStrictConfigResult(value) {
  assertExactKeys(
    value,
    RESULT_KEYS.strict_config_local_rejection,
    'Strict-config result',
  );
  assertHash(value.error_sha256, 'Strict-config error SHA-256');
  if (value.strict_config_accepted !== true
    || value.local_schema_rejection !== true
    || value.provider_requests !== 0
    || value.model_calls !== 0
    || !Number.isSafeInteger(value.exit_code)
    || value.exit_code === 0) {
    throw new Error('Strict config did not stop locally before a provider request');
  }
}

function validateAuthResult(value) {
  assertExactKeys(value, RESULT_KEYS.auth_isolation, 'Auth isolation result');
  if (value.source_readable !== true
    || value.home_mode !== '0700'
    || value.auth_copy_mode !== '0600'
    || value.copied_file_count !== 1
    || value.cleanup_verified !== true
    || value.credential_log_count !== 0
    || value.credential_hash_count !== 0) {
    throw new Error('Auth isolation did not meet the fresh-home contract');
  }
}

function validatePacketsResult(value) {
  assertExactKeys(value, RESULT_KEYS.predictor_packet_safety, 'Packet result');
  if (value.target_count !== METHOD.targetCount
    || value.slot_count !== METHOD.scheduledSlotCount
    || value.packet_count !== METHOD.scheduledSlotCount
    || value.pair_count !== METHOD.targetCount
    || value.leakage_audit_count !== METHOD.scheduledSlotCount
    || value.pair_identical_current_count !== METHOD.targetCount) {
    throw new Error('Packet, pair, or leakage counts differ');
  }
}

function validateStorageResult(value) {
  assertExactKeys(
    value,
    RESULT_KEYS.runtime_storage_permissions,
    'Storage permissions result',
  );
  if (value.runtime_readable !== true
    || value.runtime_writable !== true
    || value.minimum_free_bytes !== MINIMUM_FREE_BYTES) {
    throw new Error('Runtime permissions or disk capacity differ');
  }
}

function validateZeroStateResult(value) {
  assertExactKeys(value, RESULT_KEYS.zero_run_state, 'Zero-state result');
  for (const key of RESULT_KEYS.zero_run_state) {
    if (value[key] !== 0) throw new Error('Run state is not empty before inference');
  }
}

function validateSuiteResult(value, expected) {
  assertExactKeys(
    value,
    SUITE_PROBE_KEYS,
    'Complete suite result',
  );
  assertHash(value.output_sha256, 'Complete suite output SHA-256');
  if (value.passed !== expected
    || value.failures !== 0
    || value.skips !== 0
    || value.warnings !== 0
    || value.model_calls !== 0
    || value.exit_code !== 0) {
    throw new Error('Complete suite did not pass at the exact no-model count');
  }
}

function validateFrozenResult(value) {
  assertExactKeys(value, RESULT_KEYS.frozen_run, 'Frozen-run result');
  assertHash(value.method_lock_sha256, 'Method lock SHA-256');
  assertHash(value.run_lock_sha256, 'Run lock SHA-256');
  if (value.verified !== true || value.receipts_verified !== true) {
    throw new Error('Frozen run or its durable receipts did not verify');
  }
}

const RESULT_VALIDATORS = Object.freeze({
  canonical_lineage: validateCanonicalResult,
  v4_donor_integrity: validateDonorResult,
  prepared_inventory: validatePreparedResult,
  video_lineage: validateVideoResult,
  runtime_versions: validateVersionsResult,
  cli_capability_hashes: validateCapabilitiesResult,
  adapter_argv_config: validateAdapterResult,
  strict_config_local_rejection: validateStrictConfigResult,
  auth_isolation: validateAuthResult,
  predictor_packet_safety: validatePacketsResult,
  runtime_storage_permissions: validateStorageResult,
  zero_run_state: validateZeroStateResult,
  v5_complete_tests: (value) => {
    const { test_count: passed, ...rest } = value;
    validateSuiteResult({ passed, ...rest }, 398);
  },
  v4_complete_tests: (value) => {
    const { test_count: passed, ...rest } = value;
    validateSuiteResult({ passed, ...rest }, 119);
  },
  frozen_run: validateFrozenResult,
});

function validateReceiptCheck(check, expectedName) {
  if (!isPlainObject(check)
    || check.name !== expectedName
    || check.passed !== true) {
    throw new Error(`Preflight receipt check ${expectedName} is invalid`);
  }
  const keys = Object.keys(check).sort();
  const minimal = ['name', 'passed'];
  if (keys.length === minimal.length) {
    assertExactKeys(check, minimal, `Preflight receipt check ${expectedName}`);
    return;
  }
  assertExactKeys(
    check,
    [...minimal, ...RESULT_KEYS[expectedName]],
    `Preflight receipt check ${expectedName}`,
  );
  const { name: ignoredName, passed: ignoredPassed, ...result } = check;
  RESULT_VALIDATORS[expectedName](result);
}

export function validatePreflightReceipt(receipt) {
  assertExactKeys(receipt, PREFLIGHT_RECEIPT_KEYS, 'Preflight receipt');
  if (receipt.version !== 1
    || receipt.passed !== true
    || !['before-lock', 'after-lock'].includes(receipt.phase)) {
    throw new Error('Preflight receipt phase or status is invalid');
  }
  assertHash(
    receipt.complete_test_receipt_sha256,
    'Preflight complete test receipt SHA-256',
  );
  const expectedChecks = receipt.phase === 'before-lock' ? BEFORE_CHECKS : AFTER_CHECKS;
  if (!Array.isArray(receipt.checks)
    || receipt.checks.length !== expectedChecks.length) {
    throw new Error('Preflight receipt check count is invalid');
  }
  receipt.checks.forEach((check, index) => (
    validateReceiptCheck(check, expectedChecks[index])
  ));
  assertCanonicalUtc(receipt.created_at_utc, 'Preflight receipt created_at_utc');
  assertHash(receipt.receipt_sha256, 'Preflight receipt SHA-256');
  if (receipt.receipt_sha256 !== sha256(canonicalJson(receiptPayload(receipt)))) {
    throw new Error('Preflight receipt self SHA-256 differs');
  }
  return receipt;
}

function validateTestReceipt(receipt) {
  assertExactKeys(receipt, TEST_RECEIPT_KEYS, 'Complete test receipt');
  if (receipt.version !== 1
    || receipt.complete !== true
    || receipt.v5_passed !== 398
    || receipt.v4_passed !== 119
    || receipt.failures !== 0
    || receipt.skips !== 0
    || receipt.warnings !== 0
    || receipt.model_calls !== 0) {
    throw new Error('Complete test receipt is not exact and passing');
  }
  assertCanonicalUtc(receipt.created_at_utc, 'Complete test receipt created_at_utc');
  assertHash(receipt.receipt_sha256, 'Complete test receipt SHA-256');
  if (receipt.receipt_sha256 !== sha256(canonicalJson(receiptPayload(receipt)))) {
    throw new Error('Complete test receipt self SHA-256 differs');
  }
  return receipt;
}

async function defaultCanonicalProbe() {
  const snapshot = await compileCorpusSnapshot();
  return {
    canonical_dataset_sha256: snapshot.source.sha256,
    canonical_dataset_commit: snapshot.source.dataset_commit,
    retained_count: snapshot.retained_count,
    accepted_count: snapshot.accepted_count,
    accepted_history_count: snapshot.accepted_history_count,
    accepted_nontrivial_count: snapshot.accepted_nontrivial_count,
  };
}

async function defaultDonorProbe({ root, implementationRoot }) {
  const bytes = await readRegular(
    relativeTarget(root, V4_DONOR_INVENTORY_PATH),
    'V4 donor inventory',
    { mode: 0o600 },
  );
  let inventory;
  try {
    inventory = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    );
  } catch {
    throw new Error('V4 donor inventory is not valid UTF-8 JSON');
  }
  const rebuilt = await validateDonorInventory(V4_DONOR_ROOT, inventory);
  if (!bytes.equals(Buffer.from(`${JSON.stringify(rebuilt, null, 2)}\n`))) {
    throw new Error('V4 donor inventory bytes differ from its authenticated format');
  }
  await assertV5HasNoV4Imports(implementationRoot);
  const methodLock = inventory.files.find((file) => file.path === 'method-lock.json');
  return {
    file_count: inventory.files.length,
    aggregate_sha256: inventory.aggregate_sha256,
    method_lock_sha256: methodLock?.sha256 ?? '',
  };
}

async function defaultPreparedProbe({ root, phase }) {
  await verifyPrepared({
    root,
    downstreamAuthenticated: phase === 'after-lock',
  });
  const bytes = await readRegular(
    relativeTarget(root, PREPARED_INVENTORY_PATH),
    'Prepared inventory',
    { mode: 0o600 },
  );
  const inventory = parseCanonicalJson(bytes, 'Prepared inventory');
  return {
    prepared_inventory_sha256: sha256(bytes),
    recording_sequence_sha256: inventory.source_video_lineage?.inventory_sha256,
    target_count: inventory.target_count,
    slot_count: inventory.scheduled_slot_count,
    context_count: inventory.context_bundle_count,
    packet_count: inventory.packet_count,
  };
}

async function defaultVideoProbe({ root }) {
  const stored = await readRuntimeJson(
    root,
    VIDEO_INVENTORY_PATH,
    'Video inventory',
    { mode: 0o600 },
  );
  const storedVideo = reviveVideoInventory(stored);
  const rebuiltVideo = await inventoryVideoChain({
    root: storedVideo.root,
    startRecordingId: EXPECTED_VIDEO.startRecordingId,
    endpointRecordingId: EXPECTED_VIDEO.endpointRecordingId,
  });
  const rebuilt = serializeVideoInventory(rebuiltVideo);
  if (canonicalJson(stored) !== canonicalJson(rebuilt)) {
    throw new Error('Stored video inventory differs from the real source probe');
  }
  if (canonicalJson(storedVideo.no_event_recording_ids)
    !== canonicalJson(EXPECTED_VIDEO.noEventRecordingIds)) {
    throw new Error('Video inventory no-event recordings differ');
  }
  if (storedVideo.files.some((file, index) => (
    file.predecessor_recording_id
      !== (index === 0 ? null : storedVideo.files[index - 1].recording_id)
    || Object.hasOwn(file.stream, 'duration')
    || file.probe_argv.some((argument) => /duration/iu.test(argument))
  ))) {
    throw new Error('Video inventory predecessor or no-duration contract differs');
  }
  const timeBases = new Set(
    storedVideo.files.map((file) => (
      `${file.time_base.numerator}/${file.time_base.denominator}`
    )),
  );
  return {
    recording_sequence_sha256: artifactSha256(stored),
    file_count: storedVideo.files.length,
    total_byte_length: storedVideo.total_byte_length,
    total_frame_count: storedVideo.total_frame_count,
    time_base_count: timeBases.size,
  };
}

async function runCommand(executable, args, options = {}) {
  try {
    const result = await execFile(executable, args, {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      ...options,
    });
    return {
      exitCode: 0,
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
    };
  } catch (error) {
    return {
      exitCode: Number.isInteger(error?.code) ? error.code : 1,
      stdout: typeof error?.stdout === 'string' ? error.stdout : '',
      stderr: typeof error?.stderr === 'string' ? error.stderr : '',
    };
  }
}

function firstLine(value) {
  return value.split(/\r?\n/u)[0]?.trim() ?? '';
}

async function defaultVersionsProbe() {
  const [ffmpeg, ffprobe, codex] = await Promise.all([
    runCommand('ffmpeg', ['-version']),
    runCommand('ffprobe', ['-version']),
    runCommand('codex', ['--version']),
  ]);
  if (ffmpeg.exitCode !== 0 || ffprobe.exitCode !== 0 || codex.exitCode !== 0) {
    throw new Error('Required runtime version command failed');
  }
  const codexVersion = firstLine(codex.stdout);
  if (codexVersion !== 'codex-cli 0.144.6') {
    throw new Error('Codex version banner differs from the pinned CLI');
  }
  return {
    ffmpeg_version: firstLine(ffmpeg.stdout),
    ffprobe_version: firstLine(ffprobe.stdout),
    node_version: process.version,
    codex_cli_version: '0.144.6',
  };
}

async function defaultCapabilitiesProbe() {
  const [execHelp, modelCatalog, promptInputHelp] = await Promise.all([
    runCommand('codex', ['exec', '--help']),
    runCommand('codex', ['debug', 'models', '--bundled']),
    runCommand('codex', ['debug', 'prompt-input', '--help']),
  ]);
  if (execHelp.exitCode !== 0
    || modelCatalog.exitCode !== 0
    || promptInputHelp.exitCode !== 0) {
    throw new Error('Codex capability command failed');
  }
  let catalog;
  try {
    catalog = JSON.parse(modelCatalog.stdout);
  } catch {
    throw new Error('Bundled model catalog is not JSON');
  }
  const model = catalog?.models?.find((entry) => entry?.slug === METHOD.model);
  if (typeof model?.base_instructions !== 'string'
    || !model.supported_reasoning_levels?.some((entry) => entry?.effort === METHOD.reasoningEffort)
    || !model.service_tiers?.some((entry) => entry?.id === METHOD.serviceTier)) {
    throw new Error('Bundled model catalog lacks the frozen model capability');
  }
  return {
    codex_exec_help_sha256: sha256(Buffer.from(execHelp.stdout)),
    bundled_model_catalog_sha256: sha256(Buffer.from(modelCatalog.stdout)),
    bundled_model_instructions_sha256: sha256(Buffer.from(model.base_instructions)),
    debug_prompt_input_help_sha256: sha256(Buffer.from(promptInputHelp.stdout)),
  };
}

async function defaultAdapterProbe({ implementationRoot }) {
  const instruction = new TextDecoder('utf-8', { fatal: true }).decode(
    await readRegular(
      path.join(implementationRoot, 'predictor-instruction.txt'),
      'Predictor instruction',
    ),
  );
  const built = buildCodexArgs({
    schemaPath: '/private/tmp/nap-v5-adapter-contract/output-schema.json',
    finalPath: '/private/tmp/nap-v5-adapter-contract/final.raw.json',
    cwd: '/private/tmp/nap-v5-adapter-contract/clean-cwd',
    imagePaths: [
      '/private/tmp/nap-v5-adapter-contract/clean-cwd/image-001.png',
      '/private/tmp/nap-v5-adapter-contract/clean-cwd/image-002.png',
    ],
  });
  const expectedArgs = [
    '-a', 'never',
    'exec',
    '--strict-config',
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox', 'read-only',
    '--model', METHOD.model,
    '-c', 'model_reasoning_effort="max"',
    '-c', 'service_tier="priority"',
    '-c', `developer_instructions=${JSON.stringify(instruction)}`,
  ];
  for (const feature of FEATURE_DISABLES) {
    expectedArgs.push('-c', `features.${feature}=false`);
  }
  expectedArgs.push(
    '-c', 'web_search="disabled"',
    '--output-schema', '/private/tmp/nap-v5-adapter-contract/output-schema.json',
    '--json',
    '--output-last-message', '/private/tmp/nap-v5-adapter-contract/final.raw.json',
    '--cd', '/private/tmp/nap-v5-adapter-contract/clean-cwd',
    '--image', '/private/tmp/nap-v5-adapter-contract/clean-cwd/image-001.png',
    '--image', '/private/tmp/nap-v5-adapter-contract/clean-cwd/image-002.png',
    '--', '-',
  );
  if (built.executable !== 'codex'
    || canonicalJson(built.args) !== canonicalJson(expectedArgs)
    || built.args.includes('tools.view_image=false')) {
    throw new Error('Adapter argv differs from the frozen ordered contract');
  }
  const configs = built.args.filter((argument, index) => (
    index > 0 && built.args[index - 1] === '-c'
  ));
  return {
    argv_sha256: sha256(canonicalJson(built)),
    config_count: configs.length,
    hard_no_tools_switch: false,
    structural_tool_events_terminal_invalid: true,
    timeout_ms: 1_200_000,
    termination_grace_ms: 5_000,
  };
}

function childEnvironment(overrides) {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if ((key === 'PATH'
      || key === 'SHELL'
      || key === 'LANG'
      || key.startsWith('LC_'))
      && typeof value === 'string') {
      env[key] = value;
    }
  }
  return { ...env, ...overrides };
}

function spawnCaptured(executable, args, options, input, timeoutMs = 15_000) {
  return new Promise((resolve, reject) => {
    const child = spawnProcess(executable, args, {
      ...options,
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const stdout = [];
    const stderr = [];
    let size = 0;
    let settled = false;
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error('Local strict-config check exceeded its fixed timeout'));
    }, timeoutMs);
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error === null) resolve(result);
      else reject(error);
    };
    const capture = (target) => (chunk) => {
      size += chunk.length;
      if (size > 8 * 1024 * 1024) {
        child.kill('SIGKILL');
        finish(new Error('Local strict-config output exceeded the fixed bound'));
        return;
      }
      target.push(Buffer.from(chunk));
    };
    child.stdout.on('data', capture(stdout));
    child.stderr.on('data', capture(stderr));
    child.once('error', (error) => finish(error));
    child.once('close', (exitCode, signal) => finish(null, {
      exitCode,
      signal,
      stdout: Buffer.concat(stdout),
      stderr: Buffer.concat(stderr),
    }));
    child.stdin.end(input);
  });
}

async function defaultStrictConfigProbe() {
  const root = await mkdtemp('/private/tmp/nap-v5-strict-config-');
  try {
    const cwd = path.join(root, 'clean-cwd');
    const home = path.join(root, 'home');
    const codexHome = path.join(root, 'codex-home');
    const tmpdir = path.join(root, 'tmp');
    for (const directory of [cwd, home, codexHome, tmpdir]) {
      await mkdir(directory, { mode: 0o700 });
      await chmod(directory, 0o700);
    }
    await chmod(cwd, 0o555);
    const built = buildCodexArgs({
      schemaPath: '/dev/null',
      finalPath: path.join(root, 'final.raw.json'),
      cwd,
      imagePaths: [],
    });
    const completion = await spawnCaptured(
      built.executable,
      built.args,
      {
        cwd,
        env: childEnvironment({
          HOME: home,
          CODEX_HOME: codexHome,
          TMPDIR: tmpdir,
        }),
      },
      'preflight\n',
    );
    const stderr = completion.stderr.toString('utf8');
    const stdout = completion.stdout.toString('utf8');
    const schemaError = /(?:failed to (?:read|parse) output schema|output schema file|EOF while parsing|expected value)/iu;
    const unknownConfig = /(?:unknown (?:config|field|feature)|unrecognized configuration)/iu;
    if (completion.exitCode === 0
      || completion.signal !== null
      || stdout.trim().length !== 0
      || !schemaError.test(stderr)
      || unknownConfig.test(stderr)) {
      throw new Error('Strict config did not reach the pinned local schema parse rejection');
    }
    return {
      strict_config_accepted: true,
      local_schema_rejection: true,
      provider_requests: 0,
      model_calls: 0,
      exit_code: completion.exitCode,
      error_sha256: sha256(completion.stderr),
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function defaultAuthProbe({ authSourcePath, implementationRoot }) {
  await access(authSourcePath, constants.R_OK);
  const schemaBytes = await readRegular(
    path.join(implementationRoot, 'prediction.schema.json'),
    'Prediction schema',
  );
  let runtime = null;
  let root = null;
  let result = null;
  try {
    runtime = await createFreshAttemptRuntime({
      authSourcePath,
      schemaBytes,
      imageBytes: [],
    });
    root = runtime.root;
    const homeStat = await lstat(runtime.codexHome);
    const authStat = await lstat(path.join(runtime.codexHome, 'auth.json'));
    const names = (await readdir(runtime.codexHome)).sort();
    if (homeStat.isSymbolicLink()
      || !homeStat.isDirectory()
      || (homeStat.mode & 0o777) !== 0o700
      || authStat.isSymbolicLink()
      || !authStat.isFile()
      || (authStat.mode & 0o777) !== 0o600
      || names.length !== 1
      || names[0] !== 'auth.json') {
      throw new Error('Fresh auth staging differs from the private single-copy contract');
    }
    result = {
      source_readable: true,
      home_mode: '0700',
      auth_copy_mode: '0600',
      copied_file_count: 1,
      cleanup_verified: false,
      credential_log_count: 0,
      credential_hash_count: 0,
    };
  } finally {
    if (runtime !== null) await runtime.cleanup();
  }
  if (root === null || await optionalLstat(root) !== null) {
    throw new Error('Fresh auth staging was not removed');
  }
  result.cleanup_verified = true;
  return result;
}

async function defaultPacketsProbe({ root }) {
  const [prepared, schedule, selection, catalog, manifest] = await Promise.all([
    readRuntimeJson(root, PREPARED_INVENTORY_PATH, 'Prepared inventory', { mode: 0o600 }),
    readRuntimeJson(root, SCHEDULE_PATH, 'Schedule', { mode: 0o600 }),
    readRuntimeJson(root, 'evaluator/target-selection.json', 'Target selection', { mode: 0o600 }),
    readRuntimeJson(root, 'evaluator/target-catalog.json', 'Target catalog', { mode: 0o600 }),
    readRuntimeJson(root, 'evaluator/evaluator-manifest.json', 'Evaluator manifest', { mode: 0o600 }),
  ]);
  if (schedule.target_count !== METHOD.targetCount
    || schedule.scheduled_slot_count !== METHOD.scheduledSlotCount
    || !Array.isArray(schedule.slots)
    || schedule.slots.length !== METHOD.scheduledSlotCount
    || !Array.isArray(selection.selected_event_ids)
    || selection.selected_event_ids.length !== METHOD.targetCount
    || !Array.isArray(catalog.targets)
    || catalog.targets.length !== METHOD.targetCount
    || !Array.isArray(manifest.targets)
    || manifest.targets.length !== METHOD.targetCount
    || prepared.packet_count !== METHOD.scheduledSlotCount
    || !Array.isArray(prepared.packet_audit_expectations)
    || prepared.packet_audit_expectations.length !== METHOD.scheduledSlotCount) {
    throw new Error('Target, schedule, or packet counts differ');
  }
  const expectations = new Map(
    prepared.packet_audit_expectations.map((entry) => [entry.slot_id, entry]),
  );
  let leakageAudits = 0;
  let pairIdentical = 0;
  for (let pairIndex = 0; pairIndex < METHOD.targetCount; pairIndex += 1) {
    const pair = schedule.slots.slice(pairIndex * 2, pairIndex * 2 + 2);
    const targetOrdinal = pairIndex + 1;
    const expectedConditions = targetOrdinal % 2 === 1
      ? ['state_only', 'state_plus_hybrid_history']
      : ['state_plus_hybrid_history', 'state_only'];
    if (pair.length !== 2
      || pair.some((slot) => slot.target_ordinal !== targetOrdinal)
      || canonicalJson(pair.map((slot) => slot.condition))
        !== canonicalJson(expectedConditions)) {
      throw new Error('Schedule pair order differs');
    }
    for (const slot of pair) {
      const expectation = expectations.get(slot.slot_id);
      if (expectation?.condition !== slot.condition
        || !isPlainObject(expectation.expected_inventory)) {
        throw new Error('Packet audit expectation differs from schedule');
      }
      const target = String(slot.target_ordinal).padStart(3, '0');
      await auditPredictorSafeTree({
        condition: slot.condition,
        contextDirectory: path.join(root, 'contexts', target, slot.condition),
        packetDirectory: path.join(root, 'packets', slot.slot_id),
        expectedInventory: expectation.expected_inventory,
      });
      leakageAudits += 1;
    }
    const state = pair.find((slot) => slot.condition === 'state_only');
    const history = pair.find((slot) => slot.condition === 'state_plus_hybrid_history');
    const stateBytes = await readRegular(
      path.join(root, 'packets', state.slot_id, 'image-001.png'),
      'State-only current packet image',
      { mode: 0o600 },
    );
    const historyBytes = await readRegular(
      path.join(root, 'packets', history.slot_id, 'image-011.png'),
      'History current packet image',
      { mode: 0o600 },
    );
    if (!stateBytes.equals(historyBytes)) {
      throw new Error('Paired current packet images differ');
    }
    pairIdentical += 1;
  }
  return {
    target_count: schedule.target_count,
    slot_count: schedule.slots.length,
    packet_count: prepared.packet_count,
    pair_count: schedule.slots.length / 2,
    leakage_audit_count: leakageAudits,
    pair_identical_current_count: pairIdentical,
  };
}

async function defaultStorageProbe({ root }) {
  await access(root, constants.R_OK | constants.W_OK | constants.X_OK);
  const filesystem = await statfs(root, { bigint: true });
  const available = filesystem.bavail * filesystem.bsize;
  if (available < BigInt(MINIMUM_FREE_BYTES)) {
    throw new Error('Runtime filesystem lacks the frozen minimum free space');
  }
  return {
    runtime_readable: true,
    runtime_writable: true,
    minimum_free_bytes: MINIMUM_FREE_BYTES,
  };
}

async function countTreeFiles(filename) {
  const stat = await optionalLstat(filename);
  if (stat === null) return 0;
  if (stat.isSymbolicLink()) throw new Error('Zero-state path is a symlink');
  if (stat.isFile()) return 1;
  if (!stat.isDirectory()) throw new Error('Zero-state path is special');
  let count = 0;
  for (const entry of await readdir(filename)) {
    count += await countTreeFiles(path.join(filename, entry));
  }
  return count;
}

async function defaultZeroStateProbe({ root }) {
  const completionCount = (
    await countTreeFiles(relativeTarget(root, 'locks/all-slots-terminal.json'))
  );
  const adjudicationCount = (
    await countTreeFiles(relativeTarget(root, 'locks/adjudication-lock.json'))
    + await countTreeFiles(relativeTarget(root, 'blind'))
    + await countTreeFiles(relativeTarget(
      root,
      'evaluator/sealed-join/completed-semantic-worksheet.json',
    ))
    + await countTreeFiles(relativeTarget(
      root,
      'evaluator/sealed-join/completed-usefulness-worksheet.json',
    ))
    + await countTreeFiles(relativeTarget(root, 'evaluator/sealed-join/join-map.json'))
  );
  return {
    attempt_count: await countTreeFiles(relativeTarget(root, 'sealed-attempts')),
    environment_stop_count: await countTreeFiles(relativeTarget(root, 'environment-stops')),
    completion_count: completionCount,
    adjudication_count: adjudicationCount,
    revealed_count: await countTreeFiles(relativeTarget(root, 'revealed')),
  };
}

function tapCount(output, label) {
  const pattern = new RegExp(
    `(?:^|\\n)(?:# )?(?:ℹ )?${label}\\s+(\\d+)(?:\\n|$)`,
    'gu',
  );
  const matches = [...output.matchAll(pattern)];
  if (matches.length === 0) throw new Error(`Complete suite omitted ${label} count`);
  return Number(matches.at(-1)[1]);
}

function warningCount(output) {
  return output.split(/\r?\n/u).filter((line) => (
    /\bwarning\b/iu.test(line)
  )).length;
}

async function testFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || (!entry.isFile() && !entry.isDirectory())) {
      throw new Error('Complete suite test tree contains a symlink or special entry');
    }
    if (entry.isDirectory()) continue;
    if (entry.name.endsWith('.test.mjs')) files.push(path.join(directory, entry.name));
  }
  return files.sort();
}

async function defaultSuiteProbe({ suite, implementationRoot }) {
  const expected = suite === 'v5' ? 398 : suite === 'v4' ? 119 : null;
  if (expected === null) throw new Error('Unknown complete suite');
  const directory = suite === 'v5'
    ? path.join(implementationRoot, 'test')
    : path.join(V4_DONOR_ROOT, 'test');
  const files = await testFiles(directory);
  if (files.length === 0) throw new Error('Complete suite has no test files');
  const guardRoot = await mkdtemp('/private/tmp/nap-v5-no-model-suite-');
  try {
    const sentinel = path.join(guardRoot, 'codex-invocations');
    const guard = path.join(guardRoot, 'codex');
    const guardSource = [
      `#!${process.execPath}`,
      "import { appendFileSync } from 'node:fs';",
      `appendFileSync(${JSON.stringify(sentinel)}, 'blocked\\n', { mode: 0o600 });`,
      'process.exit(97);',
      '',
    ].join('\n');
    await writeFile(guard, guardSource, { mode: 0o700, flag: 'wx' });
    await chmod(guard, 0o700);
    const result = await runCommand(
      process.execPath,
      ['--test', ...files],
      {
        cwd: suite === 'v5' ? implementationRoot : V4_DONOR_ROOT,
        env: {
          ...process.env,
          PATH: `${guardRoot}${path.delimiter}${process.env.PATH ?? ''}`,
          NAP_V5_MODEL_CALLS_FORBIDDEN: '1',
        },
        timeout: 900_000,
        maxBuffer: 128 * 1024 * 1024,
      },
    );
    const output = `${result.stdout}\n${result.stderr}`;
    const sentinelBytes = await optionalLstat(sentinel) === null
      ? Buffer.alloc(0)
      : await readRegular(sentinel, 'No-model suite sentinel', { mode: 0o600 });
    const modelCalls = sentinelBytes.length === 0
      ? 0
      : sentinelBytes.toString('utf8').trim().split('\n').length;
    return {
      passed: tapCount(output, 'pass'),
      failures: tapCount(output, 'fail'),
      skips: tapCount(output, 'skipped'),
      warnings: warningCount(output),
      model_calls: modelCalls,
      exit_code: result.exitCode,
      output_sha256: sha256(Buffer.from(output)),
    };
  } finally {
    await rm(guardRoot, { recursive: true, force: true });
  }
}

async function defaultFrozenProbe({ root, implementationRoot }) {
  await verifyFrozenRun({ root, implementationRoot });
  const [methodBytes, runBytes] = await Promise.all([
    readRegular(relativeTarget(root, 'locks/method-lock.json'), 'Method lock', { mode: 0o600 }),
    readRegular(relativeTarget(root, 'locks/run-lock.json'), 'Run lock', { mode: 0o600 }),
  ]);
  return {
    verified: true,
    receipts_verified: true,
    method_lock_sha256: sha256(methodBytes),
    run_lock_sha256: sha256(runBytes),
  };
}

const DEFAULT_PROBES = Object.freeze({
  canonical: defaultCanonicalProbe,
  donor: defaultDonorProbe,
  prepared: defaultPreparedProbe,
  video: defaultVideoProbe,
  versions: defaultVersionsProbe,
  capabilities: defaultCapabilitiesProbe,
  adapter: defaultAdapterProbe,
  strictConfig: defaultStrictConfigProbe,
  auth: defaultAuthProbe,
  packets: defaultPacketsProbe,
  storage: defaultStorageProbe,
  zeroState: defaultZeroStateProbe,
  suite: defaultSuiteProbe,
  frozen: defaultFrozenProbe,
});

function normalizeProbes(probes = {}) {
  if (!isPlainObject(probes)) throw new TypeError('Preflight probes must be a plain object');
  const allowed = new Set(Object.keys(DEFAULT_PROBES));
  for (const key of Object.keys(probes)) {
    if (!allowed.has(key)) throw new Error('Unknown preflight probe');
    if (typeof probes[key] !== 'function') {
      throw new TypeError('Every preflight probe override must be a function');
    }
  }
  return Object.freeze({ ...DEFAULT_PROBES, ...probes });
}

function namedFailure(name) {
  return new Error(`Preflight check ${name} failed`);
}

async function executeCheck(name, operation, validator) {
  try {
    const result = await operation();
    validator(result);
    if (name === 'v5_complete_tests' || name === 'v4_complete_tests') {
      const { passed: testCount, ...rest } = result;
      return deepFreeze({
        name,
        passed: true,
        test_count: testCount,
        ...rest,
      });
    }
    return deepFreeze({ name, passed: true, ...result });
  } catch {
    throw namedFailure(name);
  }
}

async function readStoredReceipts(root) {
  const [testBytes, beforeBytes] = await Promise.all([
    readRegular(relativeTarget(root, TEST_RECEIPT_PATH), 'Complete test receipt', {
      mode: 0o600,
    }),
    readRegular(relativeTarget(root, BEFORE_RECEIPT_PATH), 'Before-lock receipt', {
      mode: 0o600,
    }),
  ]);
  const tests = validateTestReceipt(parseCanonicalJson(
    testBytes,
    'Complete test receipt',
  ));
  const before = validatePreflightReceipt(parseCanonicalJson(
    beforeBytes,
    'Before-lock receipt',
  ));
  if (before.phase !== 'before-lock'
    || before.complete_test_receipt_sha256 !== sha256(testBytes)) {
    throw new Error('Stored before-lock receipts do not bind');
  }
  return { tests, before, testBytes, beforeBytes };
}

function normalizeNow(now) {
  if (typeof now !== 'function') throw new TypeError('Preflight now must be a function');
  return async () => {
    const value = await now();
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error('Preflight clock is invalid');
    const createdAt = date.toISOString();
    assertCanonicalUtc(createdAt, 'Preflight clock');
    return createdAt;
  };
}

function defaultAuthSourcePath() {
  const codexHome = process.env.CODEX_HOME;
  return path.join(
    typeof codexHome === 'string' && path.isAbsolute(codexHome)
      ? codexHome
      : path.join(os.homedir(), '.codex'),
    'auth.json',
  );
}

function validateOptions(options) {
  if (!isPlainObject(options)) throw new TypeError('Preflight options must be an object');
  const allowed = new Set([
    'phase',
    'root',
    'implementationRoot',
    'authSourcePath',
    'probes',
    'now',
  ]);
  for (const key of Object.keys(options)) {
    if (!allowed.has(key)) throw new Error('Unknown preflight option');
  }
  if (!['before-lock', 'after-lock'].includes(options.phase)) {
    throw new Error('Preflight phase must be before-lock or after-lock');
  }
  const root = options.root ?? RUNTIME_ROOT;
  const implementationRoot = options.implementationRoot ?? IMPLEMENTATION_ROOT;
  const authSourcePath = options.authSourcePath ?? defaultAuthSourcePath();
  for (const [value, label] of [
    [root, 'Preflight root'],
    [implementationRoot, 'Preflight implementation root'],
    [authSourcePath, 'Preflight auth source'],
  ]) {
    if (typeof value !== 'string' || !path.isAbsolute(value)) {
      throw new TypeError(`${label} must be absolute`);
    }
  }
  return {
    phase: options.phase,
    root,
    implementationRoot,
    authSourcePath,
    probes: normalizeProbes(options.probes),
    now: normalizeNow(options.now ?? (() => new Date())),
  };
}

export async function runPreflight(options) {
  const normalized = validateOptions(options);
  const {
    phase,
    root,
    implementationRoot,
    authSourcePath,
    probes,
    now,
  } = normalized;
  let stored = null;
  if (phase === 'after-lock') {
    try {
      stored = await readStoredReceipts(root);
    } catch {
      throw namedFailure('stored_receipts');
    }
  }
  const probeOptions = Object.freeze({
    phase,
    root,
    implementationRoot,
    authSourcePath,
  });
  const checks = [];
  const append = async (name, probe, validator, extra = {}) => {
    checks.push(await executeCheck(
      name,
      () => probe({ ...probeOptions, ...extra }),
      validator,
    ));
  };
  await append('canonical_lineage', probes.canonical, validateCanonicalResult);
  await append('v4_donor_integrity', probes.donor, validateDonorResult);
  await append('prepared_inventory', probes.prepared, validatePreparedResult);
  await append('video_lineage', probes.video, (value) => {
    validateVideoResult(value);
    if (value.recording_sequence_sha256
      !== checks.find((check) => check.name === 'prepared_inventory')
        ?.recording_sequence_sha256) {
      throw new Error('Prepared and video recording lineage differ');
    }
  });
  await append('runtime_versions', probes.versions, validateVersionsResult);
  await append(
    'cli_capability_hashes',
    probes.capabilities,
    validateCapabilitiesResult,
  );
  await append('adapter_argv_config', probes.adapter, validateAdapterResult);
  await append(
    'strict_config_local_rejection',
    probes.strictConfig,
    validateStrictConfigResult,
  );
  await append('auth_isolation', probes.auth, validateAuthResult);
  await append(
    'predictor_packet_safety',
    probes.packets,
    validatePacketsResult,
  );
  await append(
    'runtime_storage_permissions',
    probes.storage,
    validateStorageResult,
  );
  await append('zero_run_state', probes.zeroState, validateZeroStateResult);
  await append(
    'v5_complete_tests',
    probes.suite,
    (value) => validateSuiteResult(value, 398),
    { suite: 'v5' },
  );
  await append(
    'v4_complete_tests',
    probes.suite,
    (value) => validateSuiteResult(value, 119),
    { suite: 'v4' },
  );
  let createdAtUtc;
  let generatedTestBytes;
  try {
    createdAtUtc = await now();
    const v5 = checks.find((check) => check.name === 'v5_complete_tests');
    const v4 = checks.find((check) => check.name === 'v4_complete_tests');
    const testPayload = {
      version: 1,
      complete: true,
      v5_passed: v5.test_count,
      v4_passed: v4.test_count,
      failures: v5.failures + v4.failures,
      skips: v5.skips + v4.skips,
      warnings: v5.warnings + v4.warnings,
      model_calls: v5.model_calls + v4.model_calls,
      created_at_utc: createdAtUtc,
    };
    generatedTestBytes = Buffer.from(canonicalJson(withSelfHash(testPayload)));
  } catch {
    throw namedFailure('receipt_construction');
  }

  if (phase === 'after-lock') {
    await append('frozen_run', probes.frozen, validateFrozenResult);
  }
  let receipt;
  try {
    const completeTestReceiptSha256 = phase === 'before-lock'
      ? sha256(generatedTestBytes)
      : sha256(stored.testBytes);
    const preflightPayload = {
      version: 1,
      passed: true,
      phase,
      complete_test_receipt_sha256: completeTestReceiptSha256,
      checks,
      created_at_utc: createdAtUtc,
    };
    receipt = withSelfHash(preflightPayload);
    validatePreflightReceipt(receipt);
  } catch {
    throw namedFailure('receipt_construction');
  }

  try {
    if (phase === 'before-lock') {
      await writeImmutable(
        relativeTarget(root, TEST_RECEIPT_PATH),
        generatedTestBytes,
      );
      await writeImmutable(
        relativeTarget(root, BEFORE_RECEIPT_PATH),
        Buffer.from(canonicalJson(receipt)),
      );
    } else {
      const currentStored = await readStoredReceipts(root);
      if (!currentStored.testBytes.equals(stored.testBytes)
        || !currentStored.beforeBytes.equals(stored.beforeBytes)) {
        throw new Error('Stored before-lock receipts changed during after-lock checks');
      }
      await writeImmutable(
        relativeTarget(root, AFTER_RECEIPT_PATH),
        Buffer.from(canonicalJson(receipt)),
      );
    }
  } catch {
    throw namedFailure('receipt_publication');
  }
  return receipt;
}
