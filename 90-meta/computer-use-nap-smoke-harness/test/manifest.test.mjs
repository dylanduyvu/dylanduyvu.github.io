import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after } from 'node:test';

import { deriveCanonicalLabel, loadAndValidateManifest, validateManifestStructure, validatePng } from '../lib/manifest.mjs';

const experimentDir = path.resolve(import.meta.dirname, '..');
const manifestPath = path.join(experimentDir, 'manifest.json');
const expectedIds = [
  'BLOG-CAND-003', 'BLOG-CAND-004', 'BLOG-CAND-006', 'BLOG-CAND-007',
  'BLOG-CAND-008', 'BLOG-CAND-009', 'BLOG-CAND-010', 'BLOG-CAND-011',
  'BLOG-CAND-013', 'BLOG-CAND-014', 'BLOG-CAND-016', 'BLOG-CAND-018',
  'BLOG-CAND-019', 'BLOG-CAND-020', 'BLOG-CAND-021', 'BLOG-CAND-022',
  'BLOG-CAND-023', 'BLOG-CAND-024', 'BLOG-CAND-026', 'BLOG-CAND-027',
];
const temporaryDirectories = new Set();

async function createTempDirectory(prefix) {
  const directory = await mkdtemp(path.join(tmpdir(), prefix));
  temporaryDirectories.add(directory);
  return directory;
}

after(async () => {
  await Promise.all([...temporaryDirectories].map((directory) => rm(directory, { recursive: true, force: true })));
});

async function readManifest() {
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

async function writeTempManifest(manifest) {
  const directory = await createTempDirectory('blog-manifest-');
  const file = path.join(directory, 'manifest.json');
  await writeFile(file, JSON.stringify(manifest), 'utf8');
  return file;
}

async function assertRejected(mutator, pattern) {
  const manifest = await readManifest();
  await mutator(manifest);
  await assert.rejects(loadAndValidateManifest(await writeTempManifest(manifest)), pattern);
}

test('derives canonical labels mechanically', () => {
  assert.equal(
    deriveCanonicalLabel({ app: 'Codex', object: 'Task', subtarget: null }),
    'Codex -> Task',
  );
  assert.equal(
    deriveCanonicalLabel({ app: 'Arc', object: 'Twitter webpage', subtarget: 'Home control' }),
    'Arc -> Twitter webpage -> Home control',
  );
  assert.throws(() => deriveCanonicalLabel({ app: '', object: 'Task', subtarget: null }), /app/);
});

test('shared structural validation supports approved and rendering modes', async () => {
  const baseline = await readManifest();
  assert.equal(validateManifestStructure(baseline), baseline);
  const coherentSentinel = structuredClone(baseline);
  coherentSentinel.rows[1].target = { app: 'SENTINEL', object: 'object', subtarget: null };
  coherentSentinel.rows[1].canonical_label = 'SENTINEL -> object';
  assert.equal(validateManifestStructure(coherentSentinel), coherentSentinel);
  assert.throws(() => validateManifestStructure(coherentSentinel, { enforceApprovedTargets: true }), /approved target/);
  coherentSentinel.rows[1].row_version = 1;
  assert.throws(() => validateManifestStructure(coherentSentinel), /row_version/);
});

test('loads the frozen V2 manifest with exact order and valid visual evidence', async () => {
  const manifest = await loadAndValidateManifest(manifestPath);
  assert.equal(manifest.dataset_snapshot_id, 'BLOG-MINI-20-V2');
  assert.equal(manifest.manifest_id, 'MINI-20-20260728-V2');
  assert.equal(manifest.protocol_id, 'BLOG-EXPANDING-HISTORY-SMOKE-V2');
  assert.equal(manifest.logical_session_id, 'BLOG-WORK-20260727');
  assert.deepEqual(manifest.rows.map(({ event_id }) => event_id), expectedIds);
  assert.equal(manifest.rows.length, 20);
  for (const row of manifest.rows) {
    assert.equal(row.row_version, 2);
    assert.equal(row.before_state_inputs.length, 2);
    assert.deepEqual(row.accepted_aliases, { app: [], object: [], subtarget: [] });
    assert.equal(row.canonical_label, deriveCanonicalLabel(row.target));
  }
});

test('rejects top-level IDs, wrong row count/order, duplicate IDs, and excluded/reserve IDs', async () => {
  await assertRejected((m) => { m.dataset_snapshot_id = 'wrong'; }, /dataset_snapshot_id/);
  await assertRejected((m) => { m.manifest_id = 'wrong'; }, /manifest_id/);
  await assertRejected((m) => { m.protocol_id = 'wrong'; }, /protocol_id/);
  await assertRejected((m) => { m.logical_session_id = 'wrong'; }, /logical_session_id/);
  await assertRejected((m) => { m.rows.pop(); }, /exactly 20/);
  await assertRejected((m) => { [m.rows[0], m.rows[1]] = [m.rows[1], m.rows[0]]; }, /order/);
  await assertRejected((m) => { m.rows[1].event_id = m.rows[0].event_id; }, /duplicate|order/);
  await assertRejected((m) => { m.rows[0].event_id = 'BLOG-CAND-005'; }, /excluded|order/);
  await assertRejected((m) => { m.rows[0].event_id = 'BLOG-CAND-028'; }, /excluded|order/);
});

test('rejects invalid row schema, audit fields, targets, labels, and aliases', async () => {
  await assertRejected((m) => { m.rows[0].row_version = 1; }, /row_version/);
  await assertRejected((m) => { delete m.rows[0].source_recording_ref; }, /source_recording_ref/);
  await assertRejected((m) => { m.rows[0].before_player_time = '12 seconds'; }, /before_player_time/);
  await assertRejected((m) => { m.rows[0].before_player_time = '00:00'; }, /before_player_time is not authoritative/);
  await assertRejected((m) => { m.rows[0].action_player_time = '00:00'; }, /action_player_time/);
  await assertRejected((m) => { m.rows[0].target.object = ''; }, /object/);
  await assertRejected((m) => {
    m.rows[0].target = { app: 'Arc', object: 'application window', subtarget: null };
    m.rows[0].canonical_label = deriveCanonicalLabel(m.rows[0].target);
  }, /approved target/);
  await assertRejected((m) => { m.rows[0].canonical_label = 'manual label'; }, /canonical_label/);
  await assertRejected((m) => { m.rows[0].accepted_aliases.app = 'Arc'; }, /accepted_aliases/);
  await assertRejected((m) => { m.rows[0].accepted_aliases.app.push('Arc'); }, /accepted_aliases/);
});

test('rejects invalid before-state inputs', async (t) => {
  await t.test('missing monitor', () => assertRejected((m) => { m.rows[0].before_state_inputs.pop(); }, /exactly two/));
  await t.test('extra monitor', () => assertRejected((m) => { m.rows[0].before_state_inputs.push({ ...m.rows[0].before_state_inputs[0] }); }, /exactly two/));
  await t.test('string monitor ID', () => assertRejected((m) => { m.rows[0].before_state_inputs[0].monitor = '1'; }, /monitor 1/));
  await t.test('duplicate monitor ID', () => assertRejected((m) => { m.rows[0].before_state_inputs[1].monitor = 1; }, /monitor 1 then monitor 3/));
  await t.test('nonexistent wrong path', () => assertRejected((m) => { m.rows[0].before_state_inputs[0].path = '/does/not/exist.png'; }, /before-state input path/));
  await t.test('non-PNG wrong path', () => assertRejected((m) => { m.rows[0].before_state_inputs[0].path = '/etc/hosts'; }, /before-state input path/));
  await t.test('hash mismatch', () => assertRejected((m) => { m.rows[0].before_state_inputs[0].sha256 = '0'.repeat(64); }, /SHA-256 mismatch/));
  const corrupt = path.join(await createTempDirectory('blog-manifest-corrupt-'), 'bad.png');
  await writeFile(corrupt, 'not a PNG');
  await t.test('corrupt wrong path', () => assertRejected((m) => { m.rows[0].before_state_inputs[0].path = corrupt; }, /before-state input path/));
});

test('rejects path mismatches, invalid hash format, zero-dimension PNGs, and signature-only PNGs', async () => {
  const validPath = '/Users/dylanvu/screenpipe-datasets/blog-work-20260727/evidence/BLOG-CAND-003/monitor-1-before.png';
  const validHash = '350583cdc30fc181e0904dbd6691db4ecc7ef95846b90125a4563493bdfa240f';
  await assert.rejects(validatePng({ path: validPath, sha256: validHash }, `${validPath}.wrong`), /path must be/);
  await assert.rejects(validatePng({ path: validPath, sha256: validHash.toUpperCase() }, validPath), /lowercase SHA-256/);

  const directory = await createTempDirectory('blog-manifest-png-');
  const zeroDimension = path.join(directory, 'zero.png');
  const signatureOnly = path.join(directory, 'signature-only.png');
  const pngHeader = (width, height) => {
    const bytes = Buffer.alloc(24);
    bytes.set([137, 80, 78, 71, 13, 10, 26, 10]);
    bytes.write('IHDR', 12);
    bytes.writeUInt32BE(width, 16);
    bytes.writeUInt32BE(height, 20);
    return bytes;
  };
  const zeroBytes = pngHeader(0, 1);
  const signatureOnlyBytes = pngHeader(1, 1);
  await writeFile(zeroDimension, zeroBytes);
  await writeFile(signatureOnly, signatureOnlyBytes);
  await assert.rejects(
    validatePng({ path: zeroDimension, sha256: createHash('sha256').update(zeroBytes).digest('hex') }, zeroDimension),
    /dimensions must be positive/,
  );
  await assert.rejects(
    validatePng({ path: signatureOnly, sha256: createHash('sha256').update(signatureOnlyBytes).digest('hex') }, signatureOnly),
    /non-decodable PNG/,
  );
});

test('authorizes the exact evidence path before any filesystem access', async () => {
  const expectedPath = '/Users/dylanvu/screenpipe-datasets/blog-work-20260727/evidence/BLOG-CAND-003/monitor-1-before.png';
  await assert.rejects(
    validatePng({ path: '/definitely/not/the-approved-evidence.png', sha256: '0'.repeat(64) }, expectedPath),
    new RegExp(`before-state input path must be ${expectedPath}`),
  );
});
