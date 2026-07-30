import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

import {
  CANONICAL_COMMIT,
  CANONICAL_SHA256,
  METHOD,
  V5_SPEC_SHA256,
} from '../config.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import * as locks from '../lib/locks.mjs';

const METHOD_KEYS = [
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
].sort();

const RUN_KEYS = [
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
].sort();

const FROZEN_PATHS = [
  'evaluator/sealed-join/adjudication-key.bin',
  'locks/implementation-inventory.json',
  'locks/method-lock.json',
  'locks/run-inventory.json',
  'locks/run-lock.json',
];
const TEST_RECEIPT_PATH = 'evaluator/receipts/complete-tests.json';
const PREFLIGHT_RECEIPT_PATH = 'evaluator/receipts/preflight-before-lock.json';
const execFile = promisify(execFileCallback);

async function writePrivate(root, relativePath, contents) {
  const filename = path.join(root, ...relativePath.split('/'));
  await mkdir(path.dirname(filename), { recursive: true });
  const bytes = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
  await writeFile(filename, bytes, { mode: 0o600 });
  return { path: relativePath, byte_length: bytes.length, sha256: sha256(bytes) };
}

async function writeJson(root, relativePath, value) {
  return writePrivate(root, relativePath, canonicalJson(value));
}

async function readJson(root, relativePath) {
  return JSON.parse(await readFile(path.join(root, ...relativePath.split('/')), 'utf8'));
}

async function fileHash(root, relativePath) {
  return sha256(await readFile(path.join(root, ...relativePath.split('/'))));
}

async function listFiles(root, directory = root, output = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await listFiles(root, filename, output);
    else output.push(path.relative(root, filename).split(path.sep).join('/'));
  }
  return output.sort();
}

function targets() {
  return Array.from({ length: METHOD.targetCount }, (_, index) => ({
    target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
    target_ordinal: index + 1,
  }));
}

function scheduleSlots() {
  return Array.from({ length: METHOD.scheduledSlotCount }, (_, index) => ({
    slot_id: `NAP-V5-SLOT-${String(index + 1).padStart(2, '0')}`,
    slot_ordinal: index + 1,
    target_ordinal: Math.floor(index / 2) + 1,
    condition: index % 2 === 0 ? 'state_only' : 'state_plus_hybrid_history',
  }));
}

async function createImplementationRoot(parent) {
  const root = path.join(parent, 'implementation');
  await writePrivate(root, 'config.mjs', 'export const synthetic = true;\n');
  await writePrivate(root, 'cli.mjs', 'export async function main() { return 0; }\n');
  await writePrivate(root, 'predictor-instruction.txt', 'synthetic frozen instruction\n');
  await writePrivate(root, 'prediction.schema.json', '{"type":"object"}\n');
  await writePrivate(root, 'lib/a.mjs', 'export const a = 1;\n');
  await writePrivate(root, 'test/a.test.mjs', 'void 0;\n');
  return root;
}

async function createPreparedRoot(parent) {
  const root = path.join(parent, 'runtime');
  await mkdir(root, { recursive: true });
  const preparedFiles = [];
  const addJson = async (relativePath, value) => {
    preparedFiles.push({
      ...await writeJson(root, relativePath, value),
      trust_zone: relativePath.startsWith('contexts/') || relativePath.startsWith('packets/')
        ? 'predictor_safe'
        : 'evaluator_only',
    });
  };
  const addBytes = async (relativePath, value) => {
    preparedFiles.push({
      ...await writePrivate(root, relativePath, value),
      trust_zone: relativePath.startsWith('contexts/') || relativePath.startsWith('packets/')
        ? 'predictor_safe'
        : 'evaluator_only',
    });
  };

  await addJson('evaluator/corpus-snapshot.json', { version: 1, rows: [] });
  await addJson('evaluator/video-inventory.json', {
    version: 1,
    recording_sequence_sha256: '1'.repeat(64),
  });
  await addJson('evaluator/evidence-inventory.json', {
    version: 1,
    inventory_sha256: '2'.repeat(64),
  });
  await addJson('evaluator/eligibility-ledger.json', { version: 1, rows: [] });
  await addJson('evaluator/target-selection.json', {
    version: 1,
    N: 84,
    selected_event_ids: targets().map((entry) => entry.target_id),
  });
  await addJson('evaluator/target-catalog.json', {
    version: 1,
    source_hashes: {
      corpus_sha256: '3'.repeat(64),
      target_selection_sha256: '4'.repeat(64),
    },
    approval_provenance: {
      approved_by: 'dylan',
      basis: 'blanket_execution_authorization_2026-07-29',
      catalog_payload_sha256: '5'.repeat(64),
    },
    targets: targets(),
  });
  await addJson('evaluator/evaluator-manifest.json', {
    version: 1,
    targets: targets(),
  });
  await addJson('evaluator/schedule.json', {
    version: 1,
    target_count: METHOD.targetCount,
    scheduled_slot_count: METHOD.scheduledSlotCount,
    slots: scheduleSlots(),
  });
  await addJson('evaluator/v4-donor-inventory.json', {
    version: 1,
    root: '/synthetic/experiment-v4',
    files: [],
    aggregate_sha256: '6'.repeat(64),
  });

  for (const slot of scheduleSlots()) {
    const target = String(slot.target_ordinal).padStart(3, '0');
    const contextRoot = `contexts/${target}/${slot.condition}`;
    const packetRoot = `packets/${slot.slot_id}`;
    await addJson(`${contextRoot}/context.json`, {
      version: 1,
      condition: slot.condition,
      current_image: 'current.png',
    });
    await addBytes(`${contextRoot}/current.png`, Buffer.from(`png-context-${slot.slot_id}`));
    await addJson(`${packetRoot}/packet.json`, {
      version: 1,
      condition: slot.condition,
      images: ['image-001.png'],
    });
    await addBytes(`${packetRoot}/prompt.txt`, `prompt ${slot.slot_id}\n`);
    await addBytes(`${packetRoot}/image-001.png`, Buffer.from(`png-packet-${slot.slot_id}`));
  }

  preparedFiles.sort((left, right) => left.path.localeCompare(right.path));
  const scheduleSha256 = preparedFiles.find((entry) => entry.path === 'evaluator/schedule.json').sha256;
  const preparedInventory = {
    version: 1,
    source_video_lineage: {
      inventory_sha256: '7'.repeat(64),
    },
    schedule_sha256: scheduleSha256,
    target_count: METHOD.targetCount,
    scheduled_slot_count: METHOD.scheduledSlotCount,
    context_bundle_count: METHOD.scheduledSlotCount,
    packet_count: METHOD.scheduledSlotCount,
    packet_audit_expectations: [],
    files: preparedFiles,
  };
  await writeJson(root, 'evaluator/prepared-inventory.json', preparedInventory);
  return { root, preparedInventory };
}

function methodMetadata() {
  return {
    codex_cli_version: '0.144.6',
    codex_exec_help_sha256: '8'.repeat(64),
    bundled_model_catalog_sha256: '9'.repeat(64),
    bundled_model_instructions_sha256: 'a'.repeat(64),
    debug_prompt_input_help_sha256: 'b'.repeat(64),
    adapter_capability: {
      hard_no_tools_switch: false,
      structural_tool_events_terminal_invalid: true,
    },
    timeout_ms: 1_200_000,
    termination_grace_ms: 5_000,
  };
}

async function verifiedReceipts(root) {
  const testPayload = {
    version: 1,
    complete: true,
    v5_passed: 398,
    v4_passed: 119,
    failures: 0,
    skips: 0,
    warnings: 0,
    model_calls: 0,
    created_at_utc: '2026-07-30T12:30:00.000Z',
  };
  const tests = {
    ...testPayload,
    receipt_sha256: sha256(canonicalJson(testPayload)),
  };
  await writeJson(root, TEST_RECEIPT_PATH, tests);
  const preflightPayload = {
    version: 1,
    passed: true,
    phase: 'before-lock',
    complete_test_receipt_sha256: await fileHash(root, TEST_RECEIPT_PATH),
    checks: [{ name: 'synthetic_no_model_preflight', passed: true }],
    created_at_utc: '2026-07-30T12:31:00.000Z',
  };
  const preflight = {
    ...preflightPayload,
    receipt_sha256: sha256(canonicalJson(preflightPayload)),
  };
  await writeJson(root, PREFLIGHT_RECEIPT_PATH, preflight);
  return {
    catalog: {
      approved: true,
      target_catalog_sha256: await fileHash(root, 'evaluator/target-catalog.json'),
    },
    packets: {
      verified: true,
      prepared_inventory_sha256: await fileHash(root, 'evaluator/prepared-inventory.json'),
      packet_count: METHOD.scheduledSlotCount,
      slot_count: METHOD.scheduledSlotCount,
    },
    tests,
    preflight,
  };
}

async function makeFixture(t, {
  keyBytes = Buffer.from('0123456789abcdef0123456789abcdef'),
  now = () => new Date('2026-07-30T12:34:56.000Z'),
  recheckDonor = async () => true,
  randomBytes,
} = {}) {
  const parent = await mkdtemp(path.join(await realpath('/tmp'), 'nap-v5-locks-'));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const implementationRoot = await createImplementationRoot(parent);
  const { root, preparedInventory } = await createPreparedRoot(parent);
  const receipts = await verifiedReceipts(root);
  const random = randomBytes ?? ((size) => {
    assert.equal(size, 32);
    return Buffer.from(keyBytes);
  });
  return {
    parent,
    root,
    implementationRoot,
    preparedInventory,
    receipts,
    method: methodMetadata(),
    keyBytes,
    io: { randomBytes: random, now, recheckDonor },
  };
}

function freezeOptions(fixture, overrides = {}) {
  return {
    root: fixture.root,
    implementationRoot: fixture.implementationRoot,
    verifiedReceipts: structuredClone(fixture.receipts),
    method: structuredClone(fixture.method),
    io: fixture.io,
    ...overrides,
  };
}

async function freeze(fixture, overrides = {}) {
  return locks.freezeRun(freezeOptions(fixture, overrides));
}

test('exports exactly four APIs and builds a sorted exact-key implementation inventory', async (t) => {
  assert.deepEqual(Object.keys(locks).sort(), [
    'buildImplementationInventory',
    'buildRunInventory',
    'freezeRun',
    'verifyFrozenRun',
  ]);
  const fixture = await makeFixture(t);
  const inventory = await locks.buildImplementationInventory({ root: fixture.implementationRoot });
  assert.deepEqual(Object.keys(inventory), ['version', 'files']);
  assert.equal(inventory.version, 1);
  assert.deepEqual(
    inventory.files.map((entry) => entry.path),
    [
      'cli.mjs',
      'config.mjs',
      'lib/a.mjs',
      'prediction.schema.json',
      'predictor-instruction.txt',
      'test/a.test.mjs',
    ],
  );
  assert.ok(inventory.files.every((entry) => (
    Object.keys(entry).join(',') === 'path,byte_length,sha256'
    && Number.isSafeInteger(entry.byte_length)
    && /^[0-9a-f]{64}$/.test(entry.sha256)
  )));
});

test('implementation inventory rejects symlinks and special files anywhere in the tree', async (t) => {
  const fixture = await makeFixture(t);
  const linkPath = path.join(fixture.implementationRoot, 'lib/link.mjs');
  await symlink('../config.mjs', linkPath);
  await assert.rejects(
    locks.buildImplementationInventory({ root: fixture.implementationRoot }),
    /symlink/i,
  );
  await unlink(linkPath);

  const fifoPath = path.join(fixture.implementationRoot, 'test/special.fifo');
  await execFile('/usr/bin/mkfifo', [fifoPath]);
  await assert.rejects(
    locks.buildImplementationInventory({ root: fixture.implementationRoot }),
    /special|non-regular/i,
  );
});

test('run inventory covers the exact prepared tree plus prepared inventory and key', async (t) => {
  const fixture = await makeFixture(t);
  await writePrivate(
    fixture.root,
    'evaluator/sealed-join/adjudication-key.bin',
    fixture.keyBytes,
  );
  const inventory = await locks.buildRunInventory({ root: fixture.root });
  assert.deepEqual(Object.keys(inventory), ['version', 'files']);
  assert.ok(inventory.files.every((entry) => Object.keys(entry).join(',') === 'path,byte_length,sha256'));
  assert.deepEqual(
    inventory.files.map((entry) => entry.path),
    [
      ...fixture.preparedInventory.files.map((entry) => entry.path),
      'evaluator/prepared-inventory.json',
      PREFLIGHT_RECEIPT_PATH,
      TEST_RECEIPT_PATH,
      'evaluator/sealed-join/adjudication-key.bin',
    ].sort(),
  );

  await writeJson(fixture.root, 'evaluator/unexpected.json', { extra: true });
  await assert.rejects(locks.buildRunInventory({ root: fixture.root }), /unexpected|extra|exact/i);
  await unlink(path.join(fixture.root, 'evaluator/unexpected.json'));
  await unlink(path.join(fixture.root, fixture.preparedInventory.files[0].path));
  await assert.rejects(locks.buildRunInventory({ root: fixture.root }), /missing|exact/i);
});

test('freeze refuses every approval, packet, complete-test, and preflight gate before writing', async (t) => {
  const fixture = await makeFixture(t);
  const cases = [
    ['catalog', (options) => { options.verifiedReceipts.catalog.approved = false; }, /catalog|approv/i],
    ['packets', (options) => { options.verifiedReceipts.packets.verified = false; }, /packet|verif/i],
    ['tests', (options) => { options.verifiedReceipts.tests.complete = false; }, /test|complete/i],
    ['preflight', (options) => { options.verifiedReceipts.preflight.passed = false; }, /preflight|pass/i],
  ];
  for (const [label, mutate, pattern] of cases) {
    const options = freezeOptions(fixture);
    mutate(options);
    await assert.rejects(locks.freezeRun(options), pattern, label);
    await assert.rejects(
      lstat(path.join(fixture.root, 'evaluator/sealed-join/adjudication-key.bin')),
      { code: 'ENOENT' },
    );
  }

  const catalog = await readJson(fixture.root, 'evaluator/target-catalog.json');
  catalog.approval_provenance.approved_by = 'codex';
  await writeFile(
    path.join(fixture.root, 'evaluator/target-catalog.json'),
    canonicalJson(catalog),
  );
  const options = freezeOptions(fixture);
  options.verifiedReceipts.catalog.target_catalog_sha256 = await fileHash(
    fixture.root,
    'evaluator/target-catalog.json',
  );
  await assert.rejects(locks.freezeRun(options), /catalog|dylan|approv/i);

  const receiptFixture = await makeFixture(t);
  await writeFile(
    path.join(receiptFixture.root, PREFLIGHT_RECEIPT_PATH),
    canonicalJson({ ...receiptFixture.receipts.preflight, checks: [] }),
  );
  await assert.rejects(
    freeze(receiptFixture),
    /preflight|receipt|bytes|hash|differ/i,
  );
  await assert.rejects(
    lstat(path.join(receiptFixture.root, 'evaluator/sealed-join/adjudication-key.bin')),
    { code: 'ENOENT' },
  );

  const packetFixture = await makeFixture(t);
  const packetEntry = packetFixture.preparedInventory.files.find(
    (file) => file.path.startsWith('packets/'),
  );
  assert.ok(packetEntry, 'fixture must contain a prepared predictor packet');
  const packetPath = path.join(
    packetFixture.root,
    ...packetEntry.path.split('/'),
  );
  await writeFile(
    packetPath,
    Buffer.concat([await readFile(packetPath), Buffer.from('\n')]),
  );
  await assert.rejects(
    freeze(packetFixture),
    /prepared|packet|hash|drift|byte length/i,
  );
  await assert.rejects(
    lstat(path.join(packetFixture.root, 'evaluator/sealed-join/adjudication-key.bin')),
    { code: 'ENOENT' },
  );
});

test('freeze exclusively creates only the five specified mode-0600 artifacts', async (t) => {
  const fixture = await makeFixture(t);
  await freeze(fixture);
  const actual = (await listFiles(fixture.root)).filter((entry) => (
    entry.startsWith('locks/') || entry === 'evaluator/sealed-join/adjudication-key.bin'
  ));
  assert.deepEqual(actual, FROZEN_PATHS);
  for (const relativePath of FROZEN_PATHS) {
    const stat = await lstat(path.join(fixture.root, ...relativePath.split('/')));
    assert.equal(stat.isFile(), true);
    assert.equal(stat.isSymbolicLink(), false);
    assert.equal(stat.mode & 0o777, 0o600);
  }
  assert.deepEqual(
    await readFile(path.join(fixture.root, 'evaluator/sealed-join/adjudication-key.bin')),
    fixture.keyBytes,
  );
});

test('freeze reruns byte-identically and reuses the immutable key without new randomness', async (t) => {
  let randomCalls = 0;
  let nowCalls = 0;
  let donorChecks = 0;
  const fixture = await makeFixture(t, {
    randomBytes: (size) => {
      randomCalls += 1;
      return Buffer.alloc(size, 0x30 + randomCalls);
    },
    now: () => {
      nowCalls += 1;
      return new Date(Date.UTC(2026, 6, 30, 12, 0, nowCalls));
    },
    recheckDonor: async () => { donorChecks += 1; },
  });
  await freeze(fixture);
  const first = new Map();
  for (const relativePath of FROZEN_PATHS) {
    first.set(relativePath, await readFile(path.join(fixture.root, ...relativePath.split('/'))));
  }
  await freeze(fixture);
  for (const relativePath of FROZEN_PATHS) {
    assert.deepEqual(
      await readFile(path.join(fixture.root, ...relativePath.split('/'))),
      first.get(relativePath),
    );
  }
  assert.equal(randomCalls, 1);
  assert.equal(nowCalls, 1);
  assert.equal(donorChecks, 2);
});

test('method lock has only the frozen keys and binds implementation, donor, method, and preflight bytes', async (t) => {
  const fixture = await makeFixture(t);
  await freeze(fixture);
  const methodLock = await readJson(fixture.root, 'locks/method-lock.json');
  assert.deepEqual(Object.keys(methodLock).sort(), METHOD_KEYS);
  assert.deepEqual(methodLock, {
    version: 1,
    spec_sha256: V5_SPEC_SHA256,
    implementation_inventory_sha256: await fileHash(
      fixture.root,
      'locks/implementation-inventory.json',
    ),
    v4_donor_inventory_sha256: await fileHash(
      fixture.root,
      'evaluator/v4-donor-inventory.json',
    ),
    predictor_instruction_sha256: await fileHash(
      fixture.implementationRoot,
      'predictor-instruction.txt',
    ),
    prediction_schema_sha256: await fileHash(
      fixture.implementationRoot,
      'prediction.schema.json',
    ),
    model: METHOD.model,
    reasoning_effort: METHOD.reasoningEffort,
    service_tier: METHOD.serviceTier,
    ...fixture.method,
    preflight_receipt_sha256: fixture.receipts.preflight.receipt_sha256,
    created_at_utc: '2026-07-30T12:34:56.000Z',
  });
});

test('run lock has only the frozen keys, binds every authority, and contains no key bytes', async (t) => {
  const fixture = await makeFixture(t);
  await freeze(fixture);
  const runLock = await readJson(fixture.root, 'locks/run-lock.json');
  const runInventory = await readJson(fixture.root, 'locks/run-inventory.json');
  const byPath = new Map(runInventory.files.map((entry) => [entry.path, entry]));
  const packetFiles = runInventory.files.filter((entry) => entry.path.startsWith('packets/'));
  assert.deepEqual(Object.keys(runLock).sort(), RUN_KEYS);
  assert.deepEqual(runLock, {
    version: 1,
    method_lock_sha256: await fileHash(fixture.root, 'locks/method-lock.json'),
    run_inventory_sha256: await fileHash(fixture.root, 'locks/run-inventory.json'),
    canonical_dataset_sha256: CANONICAL_SHA256,
    canonical_dataset_commit: CANONICAL_COMMIT,
    recording_sequence_sha256: fixture.preparedInventory.source_video_lineage.inventory_sha256,
    evidence_inventory_sha256: byPath.get('evaluator/evidence-inventory.json').sha256,
    eligibility_ledger_sha256: byPath.get('evaluator/eligibility-ledger.json').sha256,
    target_selection_sha256: byPath.get('evaluator/target-selection.json').sha256,
    target_catalog_sha256: byPath.get('evaluator/target-catalog.json').sha256,
    evaluator_manifest_sha256: byPath.get('evaluator/evaluator-manifest.json').sha256,
    prepared_inventory_sha256: byPath.get('evaluator/prepared-inventory.json').sha256,
    schedule_sha256: byPath.get('evaluator/schedule.json').sha256,
    packet_inventory_sha256: sha256(canonicalJson(packetFiles)),
    adjudication_key_sha256: sha256(fixture.keyBytes),
    target_count: METHOD.targetCount,
    slot_count: METHOD.scheduledSlotCount,
    created_at_utc: '2026-07-30T12:34:56.000Z',
  });

  const publicLockBytes = Buffer.concat(await Promise.all([
    'locks/implementation-inventory.json',
    'locks/method-lock.json',
    'locks/run-inventory.json',
    'locks/run-lock.json',
  ].map((relativePath) => readFile(path.join(fixture.root, relativePath)))));
  assert.equal(publicLockBytes.includes(fixture.keyBytes), false);
  assert.doesNotMatch(publicLockBytes.toString('utf8'), new RegExp(fixture.keyBytes.toString('hex')));
  assert.doesNotMatch(publicLockBytes.toString('utf8'), new RegExp(fixture.keyBytes.toString('base64')));
});

test('verification rejects extra keys in both inventories and both locks', async (t) => {
  const fixture = await makeFixture(t);
  await freeze(fixture);
  for (const relativePath of [
    'locks/implementation-inventory.json',
    'locks/method-lock.json',
    'locks/run-inventory.json',
    'locks/run-lock.json',
  ]) {
    const filename = path.join(fixture.root, relativePath);
    const original = await readFile(filename);
    const value = JSON.parse(original);
    value.extra = true;
    await writeFile(filename, canonicalJson(value));
    await assert.rejects(
      locks.verifyFrozenRun({
        root: fixture.root,
        implementationRoot: fixture.implementationRoot,
        io: fixture.io,
      }),
      /exact|key|inventory|lock/i,
      relativePath,
    );
    await writeFile(filename, original);
  }
});

test('verification rejects missing, extra, symlinked, or byte-drifted implementation and run files', async (t) => {
  const fixture = await makeFixture(t);
  await freeze(fixture);
  assert.equal(await locks.verifyFrozenRun({
    root: fixture.root,
    implementationRoot: fixture.implementationRoot,
    io: fixture.io,
  }), true);
  await writeFile(
    path.join(fixture.root, 'evaluator/receipts/preflight-after-lock.json'),
    '{"authenticated":"after-lock-preflight"}\n',
    { mode: 0o600 },
  );
  assert.equal(await locks.verifyFrozenRun({
    root: fixture.root,
    implementationRoot: fixture.implementationRoot,
    io: fixture.io,
  }), true);

  const implementationFile = path.join(fixture.implementationRoot, 'lib/a.mjs');
  const implementationBytes = await readFile(implementationFile);
  await writeFile(implementationFile, 'export const a = 2;\n');
  await assert.rejects(
    locks.verifyFrozenRun({
      root: fixture.root,
      implementationRoot: fixture.implementationRoot,
      io: fixture.io,
    }),
    /drift|sha-?256|inventory/i,
  );
  await writeFile(implementationFile, implementationBytes);

  const extraSource = path.join(fixture.implementationRoot, 'test/extra.test.mjs');
  await writeFile(extraSource, 'void 0;\n');
  await assert.rejects(
    locks.verifyFrozenRun({
      root: fixture.root,
      implementationRoot: fixture.implementationRoot,
      io: fixture.io,
    }),
    /unexpected|extra|inventory/i,
  );
  await unlink(extraSource);

  const packetPath = path.join(fixture.root, 'packets/NAP-V5-SLOT-01/prompt.txt');
  await writeFile(packetPath, 'drift\n');
  await assert.rejects(
    locks.verifyFrozenRun({
      root: fixture.root,
      implementationRoot: fixture.implementationRoot,
      io: fixture.io,
    }),
    /drift|sha-?256|prepared|inventory/i,
  );
  await unlink(packetPath);
  await symlink(
    path.join(fixture.root, 'packets/NAP-V5-SLOT-02/prompt.txt'),
    packetPath,
  );
  await assert.rejects(
    locks.verifyFrozenRun({
      root: fixture.root,
      implementationRoot: fixture.implementationRoot,
      io: fixture.io,
    }),
    /symlink|inventory/i,
  );

  await unlink(packetPath);
  await writeFile(packetPath, 'prompt NAP-V5-SLOT-01\n');
  const receiptPath = path.join(fixture.root, TEST_RECEIPT_PATH);
  await writeFile(receiptPath, `${await readFile(receiptPath, 'utf8')} `);
  await assert.rejects(
    locks.verifyFrozenRun({
      root: fixture.root,
      implementationRoot: fixture.implementationRoot,
      io: fixture.io,
    }),
    /receipt|prepared|run inventory|sha-?256|drift/i,
  );
});

test('freeze and independent verification both recheck the frozen V4 donor', async (t) => {
  let checks = 0;
  const fixture = await makeFixture(t, {
    recheckDonor: async () => { checks += 1; },
  });
  const defaultFreezeOptions = freezeOptions(fixture);
  delete defaultFreezeOptions.implementationRoot;
  await locks.freezeRun(defaultFreezeOptions);
  assert.equal(checks, 1);
  assert.equal(await locks.verifyFrozenRun({
    root: fixture.root,
    io: fixture.io,
  }), true);
  assert.equal(checks, 2);
  await assert.rejects(
    locks.verifyFrozenRun({
      root: fixture.root,
      io: {
        ...fixture.io,
        recheckDonor: async () => {
          throw new Error('V4 donor SHA-256 drift');
        },
      },
    }),
    /v4|donor|drift/i,
  );
});

test('invalid preexisting keys and conflicting lock bytes fail without overwrite', async (t) => {
  const invalidKeyFixture = await makeFixture(t);
  const invalidKey = Buffer.alloc(31, 0x61);
  await writePrivate(
    invalidKeyFixture.root,
    'evaluator/sealed-join/adjudication-key.bin',
    invalidKey,
  );
  await assert.rejects(freeze(invalidKeyFixture), /key|32 byte/i);
  assert.deepEqual(
    await readFile(path.join(
      invalidKeyFixture.root,
      'evaluator/sealed-join/adjudication-key.bin',
    )),
    invalidKey,
  );

  const collisionFixture = await makeFixture(t);
  const conflicting = Buffer.from('conflicting immutable method lock\n');
  await writePrivate(collisionFixture.root, 'locks/method-lock.json', conflicting);
  await assert.rejects(freeze(collisionFixture), /immutable|differ|method.lock/i);
  assert.deepEqual(
    await readFile(path.join(collisionFixture.root, 'locks/method-lock.json')),
    conflicting,
  );
  await chmod(path.join(collisionFixture.root, 'locks/method-lock.json'), 0o644);
  await assert.rejects(
    freeze(collisionFixture),
    /0600|mode|method.lock/i,
  );
});
