import { randomBytes as generateRandomBytes } from 'node:crypto';
import { constants } from 'node:fs';
import {
  lstat,
  open,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CANONICAL_COMMIT,
  CANONICAL_SHA256,
  METHOD,
  V5_SPEC_SHA256,
} from '../config.mjs';
import {
  assertV5HasNoV4Imports,
  buildDonorInventory,
  validateDonorInventory,
  V4_AGGREGATE_SHA256,
  V4_DONOR_ROOT,
  V4_FILE_COUNT,
  V4_METHOD_LOCK_SHA256,
} from './donor-guard.mjs';
import {
  canonicalJson,
  sha256,
  verifyInventory,
  writeImmutable,
} from './immutable.mjs';

const SHA256 = /^[0-9a-f]{64}$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const DEFAULT_IMPLEMENTATION_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const APPROVAL_BASIS = 'blanket_execution_authorization_2026-07-29';
const ADJUDICATION_KEY_PATH = 'evaluator/sealed-join/adjudication-key.bin';
const IMPLEMENTATION_INVENTORY_PATH = 'locks/implementation-inventory.json';
const METHOD_LOCK_PATH = 'locks/method-lock.json';
const RUN_INVENTORY_PATH = 'locks/run-inventory.json';
const RUN_LOCK_PATH = 'locks/run-lock.json';
const PREPARED_INVENTORY_PATH = 'evaluator/prepared-inventory.json';
const V4_DONOR_INVENTORY_PATH = 'evaluator/v4-donor-inventory.json';
const TEST_RECEIPT_PATH = 'evaluator/receipts/complete-tests.json';
const PREFLIGHT_RECEIPT_PATH = 'evaluator/receipts/preflight-before-lock.json';

const BASE_LOCK_PATHS = new Set([
  IMPLEMENTATION_INVENTORY_PATH,
  METHOD_LOCK_PATH,
  RUN_INVENTORY_PATH,
  RUN_LOCK_PATH,
]);

const REQUIRED_IMPLEMENTATION_PATHS = Object.freeze([
  'cli.mjs',
  'config.mjs',
  'prediction.schema.json',
  'predictor-instruction.txt',
]);

const INVENTORY_KEYS = Object.freeze(['version', 'files']);
const INVENTORY_FILE_KEYS = Object.freeze(['path', 'byte_length', 'sha256']);
const PREPARED_KEYS = Object.freeze([
  'version',
  'source_video_lineage',
  'schedule_sha256',
  'target_count',
  'scheduled_slot_count',
  'context_bundle_count',
  'packet_count',
  'packet_audit_expectations',
  'files',
]);
const PREPARED_FILE_KEYS = Object.freeze([
  'path',
  'byte_length',
  'sha256',
  'trust_zone',
]);
const METHOD_INPUT_KEYS = Object.freeze([
  'codex_cli_version',
  'codex_exec_help_sha256',
  'bundled_model_catalog_sha256',
  'bundled_model_instructions_sha256',
  'debug_prompt_input_help_sha256',
  'adapter_capability',
  'timeout_ms',
  'termination_grace_ms',
]);
const METHOD_LOCK_KEYS = Object.freeze([
  'version',
  'spec_sha256',
  'implementation_inventory_sha256',
  'v4_donor_inventory_sha256',
  'predictor_instruction_sha256',
  'prediction_schema_sha256',
  'model',
  'reasoning_effort',
  'service_tier',
  'codex_cli_version',
  'codex_exec_help_sha256',
  'bundled_model_catalog_sha256',
  'bundled_model_instructions_sha256',
  'debug_prompt_input_help_sha256',
  'adapter_capability',
  'timeout_ms',
  'termination_grace_ms',
  'preflight_receipt_sha256',
  'created_at_utc',
]);
const RUN_LOCK_KEYS = Object.freeze([
  'version',
  'method_lock_sha256',
  'run_inventory_sha256',
  'canonical_dataset_sha256',
  'canonical_dataset_commit',
  'recording_sequence_sha256',
  'evidence_inventory_sha256',
  'eligibility_ledger_sha256',
  'target_selection_sha256',
  'target_catalog_sha256',
  'evaluator_manifest_sha256',
  'prepared_inventory_sha256',
  'schedule_sha256',
  'packet_inventory_sha256',
  'adjudication_key_sha256',
  'target_count',
  'slot_count',
  'created_at_utc',
]);
const RECEIPT_KEYS = Object.freeze(['catalog', 'packets', 'tests', 'preflight']);
const CATALOG_RECEIPT_KEYS = Object.freeze(['approved', 'target_catalog_sha256']);
const PACKET_RECEIPT_KEYS = Object.freeze([
  'verified',
  'prepared_inventory_sha256',
  'packet_count',
  'slot_count',
]);
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
const PREFLIGHT_RECEIPT_KEYS = Object.freeze([
  'version',
  'passed',
  'phase',
  'complete_test_receipt_sha256',
  'checks',
  'created_at_utc',
  'receipt_sha256',
]);
const CATALOG_KEYS = Object.freeze([
  'version',
  'source_hashes',
  'approval_provenance',
  'targets',
]);
const APPROVAL_KEYS = Object.freeze([
  'approved_by',
  'basis',
  'catalog_payload_sha256',
]);

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
    throw new TypeError(`${label} must be a 64-character lowercase SHA-256`);
  }
}

function assertSafeRelativePath(value, label) {
  if (typeof value !== 'string'
    || value.length === 0
    || value.includes('\\')
    || value.includes('\0')
    || path.posix.isAbsolute(value)
    || path.posix.normalize(value) !== value
    || value === '.'
    || value.split('/').includes('..')) {
    throw new Error(`${label} is not a safe relative POSIX path`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function cloneCanonical(value, label) {
  try {
    return JSON.parse(canonicalJson(value));
  } catch (error) {
    throw new TypeError(`${label} must be canonical JSON data`, { cause: error });
  }
}

function sameSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

function contained(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

async function assertDirectoryChain(root, directory, label) {
  const resolvedRoot = path.resolve(root);
  const resolvedDirectory = path.resolve(directory);
  if (!contained(resolvedRoot, resolvedDirectory)) {
    throw new Error(`${label} escapes its root`);
  }
  const rootStat = await lstat(resolvedRoot);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error(`${label} root must be a non-symlink directory`);
  }
  let current = resolvedRoot;
  const relative = path.relative(resolvedRoot, resolvedDirectory);
  for (const component of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    const stat = await lstat(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(`${label} parent contains a symlink or non-directory`);
    }
  }
}

async function secureRead(root, relativePath, label, { mode } = {}) {
  assertSafeRelativePath(relativePath, `${label} path`);
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, ...relativePath.split('/'));
  if (!contained(resolvedRoot, target)) throw new Error(`${label} path escapes root`);
  await assertDirectoryChain(resolvedRoot, path.dirname(target), label);
  const pathBefore = await lstat(target, { bigint: true });
  if (pathBefore.isSymbolicLink() || !pathBefore.isFile()) {
    throw new Error(`${label} must be a non-symlink regular file`);
  }
  if (mode !== undefined && Number(pathBefore.mode & 0o777n) !== mode) {
    throw new Error(`${label} mode must be ${mode.toString(8).padStart(4, '0')}`);
  }
  const handle = await open(target, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile()
      || before.dev !== pathBefore.dev
      || before.ino !== pathBefore.ino) {
      throw new Error(`${label} identity changed before read`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(target, { bigint: true });
    if (!sameSnapshot(before, after)
      || !sameSnapshot(pathBefore, pathAfter)
      || pathAfter.isSymbolicLink()
      || after.dev !== pathAfter.dev
      || after.ino !== pathAfter.ino) {
      throw new Error(`${label} changed during read`);
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

async function optionalLstat(filename) {
  try {
    return await lstat(filename);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function parseJson(bytes, label, { canonical = false } = {}) {
  let value;
  try {
    value = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${label} contains invalid JSON`, { cause: error });
  }
  if (canonical && canonicalJson(value) !== bytes.toString('utf8')) {
    throw new Error(`${label} is not canonical JSON`);
  }
  return value;
}

function validateInventory(inventory, label) {
  assertExactKeys(inventory, INVENTORY_KEYS, label);
  if (inventory.version !== 1) throw new Error(`${label} version must be 1`);
  if (!Array.isArray(inventory.files)) throw new TypeError(`${label} files must be an array`);
  let previous = null;
  const seen = new Set();
  for (const file of inventory.files) {
    assertExactKeys(file, INVENTORY_FILE_KEYS, `${label} file`);
    assertSafeRelativePath(file.path, `${label} file path`);
    if (seen.has(file.path)) throw new Error(`${label} contains duplicate path ${file.path}`);
    if (previous !== null && file.path < previous) throw new Error(`${label} files must be sorted`);
    if (!Number.isSafeInteger(file.byte_length) || file.byte_length < 0) {
      throw new TypeError(`${label} byte_length must be a nonnegative safe integer`);
    }
    assertHash(file.sha256, `${label} file SHA-256`);
    seen.add(file.path);
    previous = file.path;
  }
  return inventory;
}

function implementationPathAllowed(relativePath) {
  if (REQUIRED_IMPLEMENTATION_PATHS.includes(relativePath)) return true;
  return /^(?:lib|test)\/[^/]+\.mjs$/.test(relativePath);
}

function validateImplementationInventory(inventory) {
  validateInventory(inventory, 'Implementation inventory');
  const paths = new Set(inventory.files.map((entry) => entry.path));
  for (const required of REQUIRED_IMPLEMENTATION_PATHS) {
    if (!paths.has(required)) throw new Error(`Implementation inventory is missing ${required}`);
  }
  for (const relativePath of paths) {
    if (!implementationPathAllowed(relativePath)) {
      throw new Error(`Unexpected implementation path: ${relativePath}`);
    }
  }
  return inventory;
}

function validatePreparedInventory(inventory) {
  assertExactKeys(inventory, PREPARED_KEYS, 'Prepared inventory');
  if (inventory.version !== 1) throw new Error('Prepared inventory version must be 1');
  if (!isPlainObject(inventory.source_video_lineage)) {
    throw new TypeError('Prepared source video lineage must be an object');
  }
  assertHash(
    inventory.source_video_lineage.inventory_sha256,
    'Prepared recording sequence SHA-256',
  );
  assertHash(inventory.schedule_sha256, 'Prepared schedule SHA-256');
  if (inventory.target_count !== METHOD.targetCount
    || inventory.scheduled_slot_count !== METHOD.scheduledSlotCount
    || inventory.context_bundle_count !== METHOD.scheduledSlotCount
    || inventory.packet_count !== METHOD.scheduledSlotCount) {
    throw new Error('Prepared inventory target, context, packet, or slot count is not frozen');
  }
  if (!Array.isArray(inventory.packet_audit_expectations)
    || !Array.isArray(inventory.files)) {
    throw new TypeError('Prepared inventory arrays are invalid');
  }
  const seen = new Set();
  let previous = null;
  for (const file of inventory.files) {
    assertExactKeys(file, PREPARED_FILE_KEYS, 'Prepared inventory file');
    assertSafeRelativePath(file.path, 'Prepared inventory file path');
    if (seen.has(file.path)) throw new Error(`Prepared inventory duplicates ${file.path}`);
    if (previous !== null && file.path < previous) throw new Error('Prepared inventory files must be sorted');
    if (!Number.isSafeInteger(file.byte_length) || file.byte_length < 0) {
      throw new TypeError(`Prepared byte length is invalid: ${file.path}`);
    }
    assertHash(file.sha256, `Prepared file SHA-256 ${file.path}`);
    const expectedZone = file.path.startsWith('contexts/') || file.path.startsWith('packets/')
      ? 'predictor_safe'
      : 'evaluator_only';
    if (file.trust_zone !== expectedZone) {
      throw new Error(`Prepared trust zone differs for ${file.path}`);
    }
    seen.add(file.path);
    previous = file.path;
  }
  for (const required of [
    V4_DONOR_INVENTORY_PATH,
    'evaluator/evidence-inventory.json',
    'evaluator/eligibility-ledger.json',
    'evaluator/target-selection.json',
    'evaluator/target-catalog.json',
    'evaluator/evaluator-manifest.json',
    'evaluator/schedule.json',
  ]) {
    if (!seen.has(required)) throw new Error(`Prepared inventory is missing ${required}`);
  }
  if (seen.has(PREPARED_INVENTORY_PATH) || seen.has(ADJUDICATION_KEY_PATH)) {
    throw new Error('Prepared inventory contains a post-preparation artifact');
  }
  const schedule = inventory.files.find((file) => file.path === 'evaluator/schedule.json');
  if (schedule.sha256 !== inventory.schedule_sha256) {
    throw new Error('Prepared schedule SHA-256 differs from its file inventory');
  }
  return inventory;
}

function projectFiles(files) {
  return files.map((file) => ({
    path: file.path,
    byte_length: file.byte_length,
    sha256: file.sha256,
  }));
}

function allowedPostFreezePath(relativePath) {
  return relativePath.startsWith('sealed-attempts/')
    || relativePath.startsWith('environment-stops/')
    || relativePath.startsWith('blind/')
    || relativePath.startsWith('revealed/')
    || relativePath.startsWith('evaluator/sealed-join/')
    || relativePath === 'evaluator/receipts/preflight-after-lock.json'
    || relativePath === 'locks/all-slots-terminal.json'
    || relativePath === 'locks/adjudication-lock.json'
    || relativePath === 'locks/result-lock.json';
}

async function buildRunInventoryInternal(root, { allowPostFreezeArtifacts = false } = {}) {
  const preparedBytes = await secureRead(
    root,
    PREPARED_INVENTORY_PATH,
    'Prepared inventory',
  );
  const prepared = validatePreparedInventory(parseJson(preparedBytes, 'Prepared inventory'));
  const snapshot = await buildDonorInventory(root);
  const actual = new Map(snapshot.files.map((file) => [file.path, file]));
  const expectedPaths = new Set([
    ...prepared.files.map((file) => file.path),
    PREPARED_INVENTORY_PATH,
    TEST_RECEIPT_PATH,
    PREFLIGHT_RECEIPT_PATH,
    ADJUDICATION_KEY_PATH,
  ]);

  for (const relativePath of actual.keys()) {
    if (expectedPaths.has(relativePath) || BASE_LOCK_PATHS.has(relativePath)) continue;
    if (allowPostFreezeArtifacts && allowedPostFreezePath(relativePath)) continue;
    throw new Error(`Unexpected run inventory path: ${relativePath}`);
  }
  for (const relativePath of expectedPaths) {
    if (!actual.has(relativePath)) throw new Error(`Missing run inventory path: ${relativePath}`);
  }
  for (const expected of prepared.files) {
    const observed = actual.get(expected.path);
    if (observed.byte_length !== expected.byte_length) {
      throw new Error(`Prepared byte length drift: ${expected.path}`);
    }
    if (observed.sha256 !== expected.sha256) {
      throw new Error(`Prepared SHA-256 drift: ${expected.path}`);
    }
  }

  const preparedObserved = actual.get(PREPARED_INVENTORY_PATH);
  if (preparedObserved.byte_length !== preparedBytes.length
    || preparedObserved.sha256 !== sha256(preparedBytes)) {
    throw new Error('Prepared inventory changed during run inventory construction');
  }
  const storedReceipts = await readStoredReceipts(root);
  for (const [relativePath, bytes] of [
    [TEST_RECEIPT_PATH, storedReceipts.testBytes],
    [PREFLIGHT_RECEIPT_PATH, storedReceipts.preflightBytes],
  ]) {
    const observed = actual.get(relativePath);
    if (observed.byte_length !== bytes.length || observed.sha256 !== sha256(bytes)) {
      throw new Error(`Durable receipt changed during run inventory construction: ${relativePath}`);
    }
  }
  const keyBytes = await secureRead(
    root,
    ADJUDICATION_KEY_PATH,
    'Adjudication key',
    { mode: 0o600 },
  );
  if (keyBytes.length !== 32) throw new Error('Adjudication key must be exactly 32 bytes');
  const keyObserved = actual.get(ADJUDICATION_KEY_PATH);
  if (keyObserved.byte_length !== 32 || keyObserved.sha256 !== sha256(keyBytes)) {
    throw new Error('Adjudication key changed during run inventory construction');
  }

  const files = [...expectedPaths]
    .sort()
    .map((relativePath) => {
      const file = actual.get(relativePath);
      return {
        path: file.path,
        byte_length: file.byte_length,
        sha256: file.sha256,
      };
    });
  return deepFreeze({ version: 1, files });
}

export async function buildImplementationInventory({ root } = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Implementation inventory root must be an absolute path');
  }
  const snapshot = await buildDonorInventory(root);
  const inventory = {
    version: 1,
    files: projectFiles(snapshot.files),
  };
  validateImplementationInventory(inventory);
  return deepFreeze(inventory);
}

export async function buildRunInventory({ root } = {}) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Run inventory root must be an absolute path');
  }
  return buildRunInventoryInternal(root);
}

async function verifyPreparedFilesBeforeKey({
  root,
  prepared,
  preparedBytes,
  storedReceipts,
}) {
  const snapshot = await buildDonorInventory(root);
  const actual = new Map(snapshot.files.map((file) => [file.path, file]));
  const expectedPaths = new Set([
    ...prepared.files.map((file) => file.path),
    PREPARED_INVENTORY_PATH,
    TEST_RECEIPT_PATH,
    PREFLIGHT_RECEIPT_PATH,
  ]);
  const allowedExistingFreezePaths = new Set([
    ADJUDICATION_KEY_PATH,
    ...BASE_LOCK_PATHS,
  ]);

  for (const relativePath of actual.keys()) {
    if (expectedPaths.has(relativePath)
      || allowedExistingFreezePaths.has(relativePath)) continue;
    throw new Error(`Unexpected prepared runtime path before key creation: ${relativePath}`);
  }
  for (const relativePath of expectedPaths) {
    if (!actual.has(relativePath)) {
      throw new Error(`Missing prepared runtime path before key creation: ${relativePath}`);
    }
  }
  for (const expected of prepared.files) {
    const observed = actual.get(expected.path);
    if (observed.byte_length !== expected.byte_length) {
      throw new Error(`Prepared byte length drift before key creation: ${expected.path}`);
    }
    if (observed.sha256 !== expected.sha256) {
      throw new Error(`Prepared SHA-256 drift before key creation: ${expected.path}`);
    }
  }

  const preparedObserved = actual.get(PREPARED_INVENTORY_PATH);
  if (preparedObserved.byte_length !== preparedBytes.length
    || preparedObserved.sha256 !== sha256(preparedBytes)) {
    throw new Error('Prepared inventory drift before key creation');
  }
  for (const [relativePath, bytes] of [
    [TEST_RECEIPT_PATH, storedReceipts.testBytes],
    [PREFLIGHT_RECEIPT_PATH, storedReceipts.preflightBytes],
  ]) {
    const observed = actual.get(relativePath);
    if (observed.byte_length !== bytes.length || observed.sha256 !== sha256(bytes)) {
      throw new Error(`Durable receipt drift before key creation: ${relativePath}`);
    }
  }
}

function validateReceipts(receipts) {
  assertExactKeys(receipts, RECEIPT_KEYS, 'Verified receipts');
  assertExactKeys(receipts.catalog, CATALOG_RECEIPT_KEYS, 'Catalog receipt');
  assertExactKeys(receipts.packets, PACKET_RECEIPT_KEYS, 'Packet receipt');
  assertExactKeys(receipts.tests, TEST_RECEIPT_KEYS, 'Test receipt');
  assertExactKeys(receipts.preflight, PREFLIGHT_RECEIPT_KEYS, 'Preflight receipt');
  if (receipts.catalog.approved !== true) throw new Error('Catalog receipt is not approved');
  assertHash(receipts.catalog.target_catalog_sha256, 'Catalog receipt SHA-256');
  if (receipts.packets.verified !== true) throw new Error('Packet receipt is not verified');
  assertHash(receipts.packets.prepared_inventory_sha256, 'Packet receipt prepared SHA-256');
  if (receipts.packets.packet_count !== METHOD.scheduledSlotCount
    || receipts.packets.slot_count !== METHOD.scheduledSlotCount) {
    throw new Error('Packet receipt count is not complete');
  }
  validateTestReceipt(receipts.tests);
  validatePreflightReceipt(receipts.preflight);
  if (receipts.tests.complete !== true
    || receipts.tests.v5_passed !== 398
    || receipts.tests.v4_passed !== 119
    || receipts.tests.failures !== 0
    || receipts.tests.skips !== 0
    || receipts.tests.warnings !== 0
    || receipts.tests.model_calls !== 0) {
    throw new Error('Test receipt is not complete and passing without model calls');
  }
  const testBytes = Buffer.from(canonicalJson(receipts.tests));
  if (receipts.preflight.complete_test_receipt_sha256 !== sha256(testBytes)) {
    throw new Error('Preflight receipt does not bind the complete test receipt bytes');
  }
}

function receiptPayload(receipt) {
  const { receipt_sha256: ignored, ...payload } = receipt;
  return payload;
}

function validateReceiptSelfHash(receipt, label) {
  assertHash(receipt.receipt_sha256, `${label} SHA-256`);
  if (receipt.receipt_sha256 !== sha256(canonicalJson(receiptPayload(receipt)))) {
    throw new Error(`${label} self SHA-256 differs`);
  }
}

function validateTestReceipt(receipt) {
  assertExactKeys(receipt, TEST_RECEIPT_KEYS, 'Test receipt');
  if (receipt.version !== 1) throw new Error('Test receipt version must be 1');
  validateCreatedAt(receipt.created_at_utc, 'Test receipt created_at_utc');
  validateReceiptSelfHash(receipt, 'Test receipt');
  return receipt;
}

function validatePreflightReceipt(receipt) {
  assertExactKeys(receipt, PREFLIGHT_RECEIPT_KEYS, 'Preflight receipt');
  if (receipt.version !== 1
    || receipt.passed !== true
    || receipt.phase !== 'before-lock') {
    throw new Error('Preflight receipt is not a passing before-lock receipt');
  }
  assertHash(
    receipt.complete_test_receipt_sha256,
    'Preflight complete test receipt SHA-256',
  );
  if (!Array.isArray(receipt.checks) || receipt.checks.length === 0) {
    throw new Error('Preflight receipt must contain completed checks');
  }
  for (const check of receipt.checks) {
    if (!isPlainObject(check)
      || typeof check.name !== 'string'
      || check.name.length === 0
      || check.passed !== true) {
      throw new Error('Preflight receipt contains an incomplete check');
    }
    cloneCanonical(check, 'Preflight check');
  }
  validateCreatedAt(receipt.created_at_utc, 'Preflight receipt created_at_utc');
  validateReceiptSelfHash(receipt, 'Preflight receipt');
  return receipt;
}

async function readStoredReceipts(root) {
  const [testBytes, preflightBytes] = await Promise.all([
    secureRead(root, TEST_RECEIPT_PATH, 'Complete test receipt', { mode: 0o600 }),
    secureRead(root, PREFLIGHT_RECEIPT_PATH, 'Before-lock preflight receipt', { mode: 0o600 }),
  ]);
  const tests = validateTestReceipt(parseJson(
    testBytes,
    'Complete test receipt',
    { canonical: true },
  ));
  const preflight = validatePreflightReceipt(parseJson(
    preflightBytes,
    'Before-lock preflight receipt',
    { canonical: true },
  ));
  if (preflight.complete_test_receipt_sha256 !== sha256(testBytes)) {
    throw new Error('Stored preflight receipt does not bind stored complete test receipt bytes');
  }
  return { tests, preflight, testBytes, preflightBytes };
}

function validateMethodInput(method) {
  assertExactKeys(method, METHOD_INPUT_KEYS, 'Method metadata');
  if (method.codex_cli_version !== '0.144.6') {
    throw new Error('Codex CLI version must be 0.144.6');
  }
  for (const key of [
    'codex_exec_help_sha256',
    'bundled_model_catalog_sha256',
    'bundled_model_instructions_sha256',
    'debug_prompt_input_help_sha256',
  ]) {
    assertHash(method[key], `Method ${key}`);
  }
  if (!isPlainObject(method.adapter_capability)
    || method.adapter_capability.hard_no_tools_switch !== false
    || method.adapter_capability.structural_tool_events_terminal_invalid !== true) {
    throw new Error('Adapter capability must record the honest residual tool boundary');
  }
  cloneCanonical(method.adapter_capability, 'Adapter capability');
  if (method.timeout_ms !== 1_200_000 || method.termination_grace_ms !== 5_000) {
    throw new Error('Method timeout or termination grace is not frozen');
  }
  return method;
}

async function validateFreezeGates(root, receipts) {
  validateReceipts(receipts);
  const storedReceipts = await readStoredReceipts(root);
  if (canonicalJson(storedReceipts.tests) !== canonicalJson(receipts.tests)) {
    throw new Error('Passed complete test receipt differs from durable receipt bytes');
  }
  if (canonicalJson(storedReceipts.preflight) !== canonicalJson(receipts.preflight)) {
    throw new Error('Passed preflight receipt differs from durable receipt bytes');
  }
  const catalogBytes = await secureRead(
    root,
    'evaluator/target-catalog.json',
    'Approved target catalog',
  );
  const catalog = parseJson(catalogBytes, 'Approved target catalog');
  assertExactKeys(catalog, CATALOG_KEYS, 'Approved target catalog');
  assertExactKeys(catalog.approval_provenance, APPROVAL_KEYS, 'Catalog approval');
  if (catalog.version !== 1
    || catalog.approval_provenance.approved_by !== 'dylan'
    || catalog.approval_provenance.basis !== APPROVAL_BASIS
    || !Array.isArray(catalog.targets)
    || catalog.targets.length !== METHOD.targetCount) {
    throw new Error(
      `Target catalog lacks the required Dylan approval or ${METHOD.targetCount} targets`,
    );
  }
  assertHash(
    catalog.approval_provenance.catalog_payload_sha256,
    'Catalog approval payload SHA-256',
  );
  if (sha256(catalogBytes) !== receipts.catalog.target_catalog_sha256) {
    throw new Error('Catalog approval receipt does not bind target catalog bytes');
  }

  const preparedBytes = await secureRead(
    root,
    PREPARED_INVENTORY_PATH,
    'Prepared inventory',
  );
  const prepared = validatePreparedInventory(parseJson(preparedBytes, 'Prepared inventory'));
  if (sha256(preparedBytes) !== receipts.packets.prepared_inventory_sha256) {
    throw new Error('Packet verification receipt does not bind prepared inventory bytes');
  }
  const catalogEntry = prepared.files.find(
    (file) => file.path === 'evaluator/target-catalog.json',
  );
  if (catalogEntry.sha256 !== sha256(catalogBytes)) {
    throw new Error('Approved catalog differs from the verified prepared inventory');
  }
  const packetCount = prepared.files.filter(
    (file) => /^packets\/NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])\/packet\.json$/.test(file.path),
  ).length;
  if (packetCount !== METHOD.scheduledSlotCount) {
    throw new Error(
      `Verified prepared inventory does not contain ${METHOD.scheduledSlotCount} packets`,
    );
  }
  return { prepared, preparedBytes, storedReceipts };
}

async function defaultRecheckDonor({ root, implementationRoot }) {
  const bytes = await secureRead(
    root,
    V4_DONOR_INVENTORY_PATH,
    'V4 donor inventory',
  );
  const inventory = parseJson(bytes, 'V4 donor inventory');
  if (!Array.isArray(inventory.files)
    || inventory.files.length !== V4_FILE_COUNT
    || inventory.aggregate_sha256 !== V4_AGGREGATE_SHA256) {
    throw new Error('V4 donor inventory no longer matches the frozen baseline');
  }
  const methodLock = inventory.files.find((file) => file.path === 'method-lock.json');
  if (methodLock?.sha256 !== V4_METHOD_LOCK_SHA256) {
    throw new Error('V4 donor method-lock SHA-256 drift');
  }
  await validateDonorInventory(V4_DONOR_ROOT, inventory);
  await assertV5HasNoV4Imports(implementationRoot);
  return true;
}

function normalizeIo(io = {}) {
  if (!isPlainObject(io)) throw new TypeError('Lock IO dependencies must be an object');
  const allowed = new Set(['randomBytes', 'now', 'recheckDonor']);
  for (const key of Object.keys(io)) {
    if (!allowed.has(key)) throw new Error(`Unknown lock IO dependency: ${key}`);
  }
  const normalized = {
    randomBytes: io.randomBytes ?? generateRandomBytes,
    now: io.now ?? (() => new Date()),
    recheckDonor: io.recheckDonor ?? defaultRecheckDonor,
  };
  for (const [key, value] of Object.entries(normalized)) {
    if (typeof value !== 'function') throw new TypeError(`Lock IO ${key} must be a function`);
  }
  return normalized;
}

function validateCreatedAt(value, label = 'Lock created_at_utc') {
  if (typeof value !== 'string'
    || !ISO_UTC.test(value)
    || new Date(value).toISOString() !== value) {
    throw new Error(`${label} must be canonical UTC`);
  }
  return value;
}

function validateMethodLock(lock) {
  assertExactKeys(lock, METHOD_LOCK_KEYS, 'Method lock');
  if (lock.version !== 1
    || lock.spec_sha256 !== V5_SPEC_SHA256
    || lock.model !== METHOD.model
    || lock.reasoning_effort !== METHOD.reasoningEffort
    || lock.service_tier !== METHOD.serviceTier) {
    throw new Error('Method lock frozen method fields differ');
  }
  for (const key of [
    'implementation_inventory_sha256',
    'v4_donor_inventory_sha256',
    'predictor_instruction_sha256',
    'prediction_schema_sha256',
    'codex_exec_help_sha256',
    'bundled_model_catalog_sha256',
    'bundled_model_instructions_sha256',
    'debug_prompt_input_help_sha256',
    'preflight_receipt_sha256',
  ]) {
    assertHash(lock[key], `Method lock ${key}`);
  }
  validateMethodInput({
    codex_cli_version: lock.codex_cli_version,
    codex_exec_help_sha256: lock.codex_exec_help_sha256,
    bundled_model_catalog_sha256: lock.bundled_model_catalog_sha256,
    bundled_model_instructions_sha256: lock.bundled_model_instructions_sha256,
    debug_prompt_input_help_sha256: lock.debug_prompt_input_help_sha256,
    adapter_capability: lock.adapter_capability,
    timeout_ms: lock.timeout_ms,
    termination_grace_ms: lock.termination_grace_ms,
  });
  validateCreatedAt(lock.created_at_utc);
  return lock;
}

function validateRunLock(lock) {
  assertExactKeys(lock, RUN_LOCK_KEYS, 'Run lock');
  if (lock.version !== 1
    || lock.canonical_dataset_sha256 !== CANONICAL_SHA256
    || lock.canonical_dataset_commit !== CANONICAL_COMMIT
    || lock.target_count !== METHOD.targetCount
    || lock.slot_count !== METHOD.scheduledSlotCount) {
    throw new Error('Run lock frozen source or count fields differ');
  }
  for (const key of [
    'method_lock_sha256',
    'run_inventory_sha256',
    'recording_sequence_sha256',
    'evidence_inventory_sha256',
    'eligibility_ledger_sha256',
    'target_selection_sha256',
    'target_catalog_sha256',
    'evaluator_manifest_sha256',
    'prepared_inventory_sha256',
    'schedule_sha256',
    'packet_inventory_sha256',
    'adjudication_key_sha256',
  ]) {
    assertHash(lock[key], `Run lock ${key}`);
  }
  validateCreatedAt(lock.created_at_utc);
  return lock;
}

async function existingMethodCreatedAt(root, now) {
  const methodFilename = path.join(root, ...METHOD_LOCK_PATH.split('/'));
  const methodStat = await optionalLstat(methodFilename);
  if (methodStat !== null) {
    const bytes = await secureRead(root, METHOD_LOCK_PATH, 'Method lock', { mode: 0o600 });
    const lock = validateMethodLock(parseJson(bytes, 'Method lock', { canonical: true }));
    return lock.created_at_utc;
  }
  if (await optionalLstat(path.join(root, ...RUN_LOCK_PATH.split('/'))) !== null) {
    throw new Error('Run lock exists without a method lock');
  }
  const value = await now();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Lock clock returned an invalid date');
  return validateCreatedAt(date.toISOString());
}

async function readAdjudicationKey(root) {
  const bytes = await secureRead(
    root,
    ADJUDICATION_KEY_PATH,
    'Adjudication key',
    { mode: 0o600 },
  );
  if (bytes.length !== 32) throw new Error('Adjudication key must be exactly 32 bytes');
  return bytes;
}

async function ensureAdjudicationKey(root, randomBytes) {
  const filename = path.join(root, ...ADJUDICATION_KEY_PATH.split('/'));
  if (await optionalLstat(filename) !== null) return readAdjudicationKey(root);
  const generated = await randomBytes(32);
  if (!(Buffer.isBuffer(generated) || generated instanceof Uint8Array)
    || generated.byteLength !== 32) {
    throw new Error('Adjudication key generator must return exactly 32 bytes');
  }
  const candidate = Buffer.from(generated);
  try {
    await writeImmutable(filename, candidate);
  } catch (error) {
    if (!/Immutable file differs/.test(error?.message ?? '')) throw error;
  }
  return readAdjudicationKey(root);
}

async function buildMethodLock({
  root,
  implementationRoot,
  implementationInventory,
  method,
  preflightReceiptSha256,
  createdAtUtc,
}) {
  const implementationBytes = Buffer.from(canonicalJson(implementationInventory));
  const donorBytes = await secureRead(
    root,
    V4_DONOR_INVENTORY_PATH,
    'V4 donor inventory',
  );
  const instructionBytes = await secureRead(
    implementationRoot,
    'predictor-instruction.txt',
    'Predictor instruction',
  );
  const schemaBytes = await secureRead(
    implementationRoot,
    'prediction.schema.json',
    'Prediction schema',
  );
  const normalizedMethod = validateMethodInput(method);
  return deepFreeze({
    version: 1,
    spec_sha256: V5_SPEC_SHA256,
    implementation_inventory_sha256: sha256(implementationBytes),
    v4_donor_inventory_sha256: sha256(donorBytes),
    predictor_instruction_sha256: sha256(instructionBytes),
    prediction_schema_sha256: sha256(schemaBytes),
    model: METHOD.model,
    reasoning_effort: METHOD.reasoningEffort,
    service_tier: METHOD.serviceTier,
    codex_cli_version: normalizedMethod.codex_cli_version,
    codex_exec_help_sha256: normalizedMethod.codex_exec_help_sha256,
    bundled_model_catalog_sha256: normalizedMethod.bundled_model_catalog_sha256,
    bundled_model_instructions_sha256: normalizedMethod.bundled_model_instructions_sha256,
    debug_prompt_input_help_sha256: normalizedMethod.debug_prompt_input_help_sha256,
    adapter_capability: cloneCanonical(
      normalizedMethod.adapter_capability,
      'Adapter capability',
    ),
    timeout_ms: normalizedMethod.timeout_ms,
    termination_grace_ms: normalizedMethod.termination_grace_ms,
    preflight_receipt_sha256: preflightReceiptSha256,
    created_at_utc: createdAtUtc,
  });
}

function requireRunEntry(byPath, relativePath) {
  const entry = byPath.get(relativePath);
  if (entry === undefined) throw new Error(`Run inventory lacks ${relativePath}`);
  return entry;
}

function buildRunLock({
  methodLockBytes,
  runInventory,
  preparedInventory,
  adjudicationKey,
  createdAtUtc,
}) {
  const runInventoryBytes = Buffer.from(canonicalJson(runInventory));
  const byPath = new Map(runInventory.files.map((entry) => [entry.path, entry]));
  const packetFiles = runInventory.files.filter((entry) => entry.path.startsWith('packets/'));
  return deepFreeze({
    version: 1,
    method_lock_sha256: sha256(methodLockBytes),
    run_inventory_sha256: sha256(runInventoryBytes),
    canonical_dataset_sha256: CANONICAL_SHA256,
    canonical_dataset_commit: CANONICAL_COMMIT,
    recording_sequence_sha256: preparedInventory.source_video_lineage.inventory_sha256,
    evidence_inventory_sha256: requireRunEntry(
      byPath,
      'evaluator/evidence-inventory.json',
    ).sha256,
    eligibility_ledger_sha256: requireRunEntry(
      byPath,
      'evaluator/eligibility-ledger.json',
    ).sha256,
    target_selection_sha256: requireRunEntry(
      byPath,
      'evaluator/target-selection.json',
    ).sha256,
    target_catalog_sha256: requireRunEntry(
      byPath,
      'evaluator/target-catalog.json',
    ).sha256,
    evaluator_manifest_sha256: requireRunEntry(
      byPath,
      'evaluator/evaluator-manifest.json',
    ).sha256,
    prepared_inventory_sha256: requireRunEntry(
      byPath,
      PREPARED_INVENTORY_PATH,
    ).sha256,
    schedule_sha256: requireRunEntry(byPath, 'evaluator/schedule.json').sha256,
    packet_inventory_sha256: sha256(canonicalJson(packetFiles)),
    adjudication_key_sha256: sha256(adjudicationKey),
    target_count: preparedInventory.target_count,
    slot_count: preparedInventory.scheduled_slot_count,
    created_at_utc: createdAtUtc,
  });
}

function assertNoSecretBytes(key, publicArtifacts) {
  const joined = Buffer.concat(publicArtifacts);
  if (joined.includes(key)) throw new Error('Adjudication key bytes leaked into a lock');
  const text = joined.toString('utf8');
  if (text.includes(key.toString('hex')) || text.includes(key.toString('base64'))) {
    throw new Error('Encoded adjudication key bytes leaked into a lock');
  }
}

function validateFreezeOptions(options) {
  const expected = ['root', 'verifiedReceipts', 'method'];
  if (Object.hasOwn(options, 'implementationRoot')) expected.push('implementationRoot');
  if (Object.hasOwn(options, 'io')) expected.push('io');
  assertExactKeys(
    options,
    expected,
    'Freeze options',
  );
  if (typeof options.root !== 'string' || !path.isAbsolute(options.root)) {
    throw new TypeError('Freeze root must be an absolute path');
  }
  const implementationRoot = options.implementationRoot ?? DEFAULT_IMPLEMENTATION_ROOT;
  if (typeof implementationRoot !== 'string'
    || !path.isAbsolute(implementationRoot)) {
    throw new TypeError('Implementation root must be an absolute path');
  }
}

export async function freezeRun(options) {
  if (!isPlainObject(options)) throw new TypeError('Freeze options must be an object');
  validateFreezeOptions(options);
  const {
    root,
    implementationRoot = DEFAULT_IMPLEMENTATION_ROOT,
    verifiedReceipts,
    method,
  } = options;
  const io = normalizeIo(options.io);
  const gates = await validateFreezeGates(root, verifiedReceipts);
  validateMethodInput(method);
  await io.recheckDonor({ root, implementationRoot });
  const implementationInventory = await buildImplementationInventory({
    root: implementationRoot,
  });
  await verifyPreparedFilesBeforeKey({
    root,
    prepared: gates.prepared,
    preparedBytes: gates.preparedBytes,
    storedReceipts: gates.storedReceipts,
  });
  const createdAtUtc = await existingMethodCreatedAt(root, io.now);
  const adjudicationKey = await ensureAdjudicationKey(root, io.randomBytes);
  const runInventory = await buildRunInventory({ root });
  const methodLock = await buildMethodLock({
    root,
    implementationRoot,
    implementationInventory,
    method,
    preflightReceiptSha256: verifiedReceipts.preflight.receipt_sha256,
    createdAtUtc,
  });
  const methodLockBytes = Buffer.from(canonicalJson(methodLock));
  const runLock = buildRunLock({
    methodLockBytes,
    runInventory,
    preparedInventory: gates.prepared,
    adjudicationKey,
    createdAtUtc,
  });
  const implementationBytes = Buffer.from(canonicalJson(implementationInventory));
  const runInventoryBytes = Buffer.from(canonicalJson(runInventory));
  const runLockBytes = Buffer.from(canonicalJson(runLock));
  assertNoSecretBytes(adjudicationKey, [
    implementationBytes,
    methodLockBytes,
    runInventoryBytes,
    runLockBytes,
  ]);

  await writeImmutable(
    path.join(root, ...IMPLEMENTATION_INVENTORY_PATH.split('/')),
    implementationBytes,
  );
  await writeImmutable(
    path.join(root, ...METHOD_LOCK_PATH.split('/')),
    methodLockBytes,
  );
  await writeImmutable(
    path.join(root, ...RUN_INVENTORY_PATH.split('/')),
    runInventoryBytes,
  );
  await writeImmutable(
    path.join(root, ...RUN_LOCK_PATH.split('/')),
    runLockBytes,
  );
  return deepFreeze({
    implementation_inventory_sha256: sha256(implementationBytes),
    method_lock_sha256: sha256(methodLockBytes),
    run_inventory_sha256: sha256(runInventoryBytes),
    run_lock_sha256: sha256(runLockBytes),
    adjudication_key_sha256: sha256(adjudicationKey),
  });
}

function validateVerifyOptions(options) {
  const expected = ['root'];
  if (Object.hasOwn(options, 'implementationRoot')) expected.push('implementationRoot');
  if (Object.hasOwn(options, 'io')) expected.push('io');
  assertExactKeys(
    options,
    expected,
    'Verify options',
  );
  if (typeof options.root !== 'string' || !path.isAbsolute(options.root)) {
    throw new TypeError('Verify root must be an absolute path');
  }
  const implementationRoot = options.implementationRoot ?? DEFAULT_IMPLEMENTATION_ROOT;
  if (typeof implementationRoot !== 'string'
    || !path.isAbsolute(implementationRoot)) {
    throw new TypeError('Verify implementation root must be an absolute path');
  }
}

export async function verifyFrozenRun(options) {
  if (!isPlainObject(options)) throw new TypeError('Verify options must be an object');
  validateVerifyOptions(options);
  const {
    root,
    implementationRoot = DEFAULT_IMPLEMENTATION_ROOT,
  } = options;
  const io = normalizeIo(options.io);
  await io.recheckDonor({ root, implementationRoot });

  const [
    implementationBytes,
    methodBytes,
    runInventoryBytes,
    runLockBytes,
    adjudicationKey,
  ] = await Promise.all([
    secureRead(
      root,
      IMPLEMENTATION_INVENTORY_PATH,
      'Implementation inventory',
      { mode: 0o600 },
    ),
    secureRead(root, METHOD_LOCK_PATH, 'Method lock', { mode: 0o600 }),
    secureRead(root, RUN_INVENTORY_PATH, 'Run inventory', { mode: 0o600 }),
    secureRead(root, RUN_LOCK_PATH, 'Run lock', { mode: 0o600 }),
    readAdjudicationKey(root),
  ]);
  const implementationInventory = validateImplementationInventory(parseJson(
    implementationBytes,
    'Implementation inventory',
    { canonical: true },
  ));
  const methodLock = validateMethodLock(parseJson(
    methodBytes,
    'Method lock',
    { canonical: true },
  ));
  const runInventory = validateInventory(parseJson(
    runInventoryBytes,
    'Run inventory',
    { canonical: true },
  ), 'Run inventory');
  const runLock = validateRunLock(parseJson(
    runLockBytes,
    'Run lock',
    { canonical: true },
  ));

  await verifyInventory(implementationRoot, implementationInventory);
  const rebuiltImplementation = await buildImplementationInventory({
    root: implementationRoot,
  });
  if (canonicalJson(rebuiltImplementation) !== canonicalJson(implementationInventory)) {
    throw new Error('Implementation inventory differs from its exact source tree');
  }
  const rebuiltRun = await buildRunInventoryInternal(root, {
    allowPostFreezeArtifacts: true,
  });
  if (canonicalJson(rebuiltRun) !== canonicalJson(runInventory)) {
    throw new Error('Run inventory differs from its exact frozen artifact tree');
  }

  const preparedBytes = await secureRead(
    root,
    PREPARED_INVENTORY_PATH,
    'Prepared inventory',
  );
  const prepared = validatePreparedInventory(parseJson(preparedBytes, 'Prepared inventory'));
  const storedReceipts = await readStoredReceipts(root);
  if (methodLock.preflight_receipt_sha256 !== storedReceipts.preflight.receipt_sha256) {
    throw new Error('Method lock does not bind the durable before-lock preflight receipt');
  }
  const expectedMethod = await buildMethodLock({
    root,
    implementationRoot,
    implementationInventory,
    method: {
      codex_cli_version: methodLock.codex_cli_version,
      codex_exec_help_sha256: methodLock.codex_exec_help_sha256,
      bundled_model_catalog_sha256: methodLock.bundled_model_catalog_sha256,
      bundled_model_instructions_sha256: methodLock.bundled_model_instructions_sha256,
      debug_prompt_input_help_sha256: methodLock.debug_prompt_input_help_sha256,
      adapter_capability: methodLock.adapter_capability,
      timeout_ms: methodLock.timeout_ms,
      termination_grace_ms: methodLock.termination_grace_ms,
    },
    preflightReceiptSha256: methodLock.preflight_receipt_sha256,
    createdAtUtc: methodLock.created_at_utc,
  });
  if (canonicalJson(expectedMethod) !== canonicalJson(methodLock)) {
    throw new Error('Method lock differs from independently derived frozen inputs');
  }
  const expectedRun = buildRunLock({
    methodLockBytes: methodBytes,
    runInventory,
    preparedInventory: prepared,
    adjudicationKey,
    createdAtUtc: methodLock.created_at_utc,
  });
  if (canonicalJson(expectedRun) !== canonicalJson(runLock)) {
    throw new Error('Run lock differs from independently derived frozen inputs');
  }
  if (runLock.created_at_utc !== methodLock.created_at_utc) {
    throw new Error('Method and run lock timestamps differ');
  }
  assertNoSecretBytes(adjudicationKey, [
    implementationBytes,
    methodBytes,
    runInventoryBytes,
    runLockBytes,
  ]);
  return true;
}
