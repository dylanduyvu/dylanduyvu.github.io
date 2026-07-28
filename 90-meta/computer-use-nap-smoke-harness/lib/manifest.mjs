import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

const execFileAsync = promisify(execFile);
const EXPECTED_TOP_LEVEL = {
  dataset_snapshot_id: 'BLOG-MINI-20-V2',
  manifest_id: 'MINI-20-20260728-V2',
  protocol_id: 'BLOG-EXPANDING-HISTORY-SMOKE-V2',
  logical_session_id: 'BLOG-WORK-20260727',
};
const EXPECTED_IDS = [
  'BLOG-CAND-003', 'BLOG-CAND-004', 'BLOG-CAND-006', 'BLOG-CAND-007',
  'BLOG-CAND-008', 'BLOG-CAND-009', 'BLOG-CAND-010', 'BLOG-CAND-011',
  'BLOG-CAND-013', 'BLOG-CAND-014', 'BLOG-CAND-016', 'BLOG-CAND-018',
  'BLOG-CAND-019', 'BLOG-CAND-020', 'BLOG-CAND-021', 'BLOG-CAND-022',
  'BLOG-CAND-023', 'BLOG-CAND-024', 'BLOG-CAND-026', 'BLOG-CAND-027',
];
const EXCLUDED_IDS = new Set([
  'BLOG-CAND-005', 'BLOG-CAND-012', 'BLOG-CAND-015', 'BLOG-CAND-017',
  'BLOG-CAND-025', 'BLOG-CAND-028', 'BLOG-CAND-029', 'BLOG-CAND-030',
  'BLOG-CAND-031', 'BLOG-CAND-032',
]);
const SOURCE_RECORDING = '/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785164400568.mp4';
const EXPECTED_AUDIT_TIMES = new Map([
  ['BLOG-CAND-003', ['00:12', '00:13']], ['BLOG-CAND-004', ['00:20', '00:21']],
  ['BLOG-CAND-006', ['00:30', '00:33']], ['BLOG-CAND-007', ['01:28', '01:29']],
  ['BLOG-CAND-008', ['01:29', '01:29']], ['BLOG-CAND-009', ['01:29', '01:40']],
  ['BLOG-CAND-010', ['02:14', '02:19']], ['BLOG-CAND-011', ['02:19', '02:22']],
  ['BLOG-CAND-013', ['02:25', '02:27']], ['BLOG-CAND-014', ['02:59', '03:03']],
  ['BLOG-CAND-016', ['03:03', '03:07']], ['BLOG-CAND-018', ['03:09', '03:18']],
  ['BLOG-CAND-019', ['03:18', '03:29']], ['BLOG-CAND-020', ['03:29', '03:34']],
  ['BLOG-CAND-021', ['03:34', '03:44']], ['BLOG-CAND-022', ['03:44', '03:49']],
  ['BLOG-CAND-023', ['03:49', '03:59']], ['BLOG-CAND-024', ['03:59', '04:02']],
  ['BLOG-CAND-026', ['04:04', '04:12']], ['BLOG-CAND-027', ['04:12', '04:16']],
]);
const EXPECTED_TARGETS = Object.freeze({
  'BLOG-CAND-003': Object.freeze({ app: 'Arc', object: 'Coda: all hands 7.27 meeting note', subtarget: null }),
  'BLOG-CAND-004': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: null }),
  'BLOG-CAND-006': Object.freeze({ app: 'Arc', object: 'Coda: all hands 7.27 meeting note', subtarget: null }),
  'BLOG-CAND-007': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: null }),
  'BLOG-CAND-008': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'composer' }),
  'BLOG-CAND-009': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'prompt submit control' }),
  'BLOG-CAND-010': Object.freeze({ app: 'Codex', object: 'Personalization Obsidian task', subtarget: null }),
  'BLOG-CAND-011': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: null }),
  'BLOG-CAND-013': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'prompt submit control' }),
  'BLOG-CAND-014': Object.freeze({ app: 'Arc', object: 'application window', subtarget: null }),
  'BLOG-CAND-016': Object.freeze({ app: 'Arc', object: 'Twitter webpage', subtarget: 'bottom-left profile control' }),
  'BLOG-CAND-018': Object.freeze({ app: 'Arc', object: 'Twitter webpage', subtarget: 'Notifications control' }),
  'BLOG-CAND-019': Object.freeze({ app: 'Arc', object: 'Twitter webpage', subtarget: 'Precursor Labs profile control' }),
  'BLOG-CAND-020': Object.freeze({ app: 'Arc', object: 'Twitter: Precursor Labs profile', subtarget: 'banner image' }),
  'BLOG-CAND-021': Object.freeze({ app: 'Arc', object: 'Twitter: expanded profile banner overlay', subtarget: 'empty-space dismissal target' }),
  'BLOG-CAND-022': Object.freeze({ app: 'Arc', object: 'Twitter webpage', subtarget: 'Home control' }),
  'BLOG-CAND-023': Object.freeze({ app: 'Arc', object: 'Twitter webpage', subtarget: 'Precursor Labs profile control' }),
  'BLOG-CAND-024': Object.freeze({ app: 'Arc', object: 'Twitter: Precursor Labs profile', subtarget: 'banner image' }),
  'BLOG-CAND-026': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: null }),
  'BLOG-CAND-027': Object.freeze({ app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'composer' }),
});
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function fail(message, cause) {
  throw new Error(`Invalid manifest: ${message}`, cause === undefined ? undefined : { cause });
}

function nonemptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') fail(`${name} must be a nonempty string`);
  return value;
}

export function deriveCanonicalLabel(target) {
  if (!target || typeof target !== 'object' || Array.isArray(target)) fail('target must be an object');
  const app = nonemptyString(target.app, 'target.app');
  const object = nonemptyString(target.object, 'target.object');
  if (target.subtarget !== null && (typeof target.subtarget !== 'string' || target.subtarget.trim() === '')) {
    fail('target.subtarget must be null or a nonempty string');
  }
  return target.subtarget === null ? `${app} -> ${object}` : `${app} -> ${object} -> ${target.subtarget}`;
}

function validateAuditFields(row) {
  if (row.source_recording_ref !== SOURCE_RECORDING) fail(`${row.event_id}: source_recording_ref is not authoritative`);
  for (const name of ['before_player_time', 'action_player_time']) {
    if (!/^\d{2}:\d{2}$/.test(row[name] ?? '')) fail(`${row.event_id}: ${name} must be MM:SS`);
  }
  const expected = EXPECTED_AUDIT_TIMES.get(row.event_id);
  if (!expected || row.before_player_time !== expected[0]) fail(`${row.event_id}: before_player_time is not authoritative`);
  if (row.action_player_time !== expected[1]) fail(`${row.event_id}: action_player_time is not authoritative`);
}

async function decodePngBytes(bytes, inputPath) {
  let directory;
  try {
    directory = await mkdtemp(path.join(tmpdir(), 'blog-manifest-decode-'));
    const temporaryPng = path.join(directory, 'evidence.png');
    await writeFile(temporaryPng, bytes, { mode: 0o600 });
    const { stdout } = await execFileAsync(
      '/usr/bin/sips',
      ['-g', 'pixelWidth', '-g', 'pixelHeight', temporaryPng],
      { timeout: 5_000, maxBuffer: 64 * 1024 },
    );
    const width = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
    const height = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
    if (!(width > 0 && height > 0)) fail(`${inputPath}: non-decodable PNG`);
  } catch (error) {
    if (error.message?.startsWith('Invalid manifest:')) throw error;
    if (error.code === 'ENOENT' || error.killed || error.code === 'ETIMEDOUT') {
      fail(`${inputPath}: PNG decoder operational failure`, error);
    }
    fail(`${inputPath}: non-decodable PNG`, error);
  } finally {
    if (directory) await rm(directory, { recursive: true, force: true });
  }
}

export async function validatePng(input, expectedPath) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('before-state input must be an object');
  nonemptyString(input.path, 'before-state input path');
  if (input.path !== expectedPath) fail(`before-state input path must be ${expectedPath}`);
  if (!/^[a-f0-9]{64}$/.test(input.sha256 ?? '')) fail(`${input.path}: sha256 must be lowercase SHA-256`);
  let bytes;
  try {
    bytes = await readFile(input.path);
  } catch (error) {
    fail(`${input.path}: cannot read evidence`, error);
  }
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) fail(`${input.path}: not a PNG`);
  if (bytes.readUInt32BE(16) === 0 || bytes.readUInt32BE(20) === 0) fail(`${input.path}: PNG dimensions must be positive`);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  if (actualHash !== input.sha256) fail(`${input.path}: SHA-256 mismatch`);
  await decodePngBytes(bytes, input.path);
}

function validateRowStructure(row, index, { enforceApprovedTargets }) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) fail(`row ${index} must be an object`);
  if (row.row_version !== 2) fail(`${row.event_id ?? `row ${index}`}: row_version must be 2`);
  validateAuditFields(row);
  const expectedLabel = deriveCanonicalLabel(row.target);
  if (row.canonical_label !== expectedLabel) fail(`${row.event_id}: canonical_label is not mechanical`);
  if (enforceApprovedTargets) {
    const approvedTarget = EXPECTED_TARGETS[row.event_id];
    if (!approvedTarget || ['app', 'object', 'subtarget'].some((key) => row.target[key] !== approvedTarget[key]) || row.canonical_label !== deriveCanonicalLabel(approvedTarget)) {
      fail(`${row.event_id}: target differs from approved target`);
    }
  }
  if (!row.accepted_aliases || typeof row.accepted_aliases !== 'object' || Array.isArray(row.accepted_aliases)) fail(`${row.event_id}: accepted_aliases must be an object`);
  for (const key of ['app', 'object', 'subtarget']) {
    if (!Array.isArray(row.accepted_aliases[key])) fail(`${row.event_id}: accepted_aliases.${key} must be an array`);
    if (row.accepted_aliases[key].length !== 0) fail(`${row.event_id}: accepted_aliases.${key} must be empty`);
  }
  if (!Array.isArray(row.before_state_inputs) || row.before_state_inputs.length !== 2) fail(`${row.event_id}: exactly two before-state inputs are required`);
  const evidenceRoot = `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/evidence/${row.event_id}`;
  const monitors = row.before_state_inputs.map((input) => input?.monitor);
  if (monitors[0] !== 1 || monitors[1] !== 3) fail(`${row.event_id}: before-state inputs must be monitor 1 then monitor 3`);
  for (const [inputIndex, input] of row.before_state_inputs.entries()) {
    nonemptyString(input?.path, `${row.event_id}: before-state input path`);
    const expectedPath = `${evidenceRoot}/monitor-${inputIndex === 0 ? 1 : 3}-before.png`;
    if (input.path !== expectedPath) fail(`${row.event_id}: before-state input path must be ${expectedPath}`);
    if (!/^[a-f0-9]{64}$/.test(input?.sha256 ?? '')) fail(`${row.event_id}: before-state input sha256 must be lowercase SHA-256`);
  }
}

async function validateRowEvidence(row) {
  const evidenceRoot = `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/evidence/${row.event_id}`;
  await validatePng(row.before_state_inputs[0], `${evidenceRoot}/monitor-1-before.png`);
  await validatePng(row.before_state_inputs[1], `${evidenceRoot}/monitor-3-before.png`);
}

export function validateManifestStructure(manifest, { enforceApprovedTargets = false } = {}) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) fail('top-level value must be an object');
  for (const [key, value] of Object.entries(EXPECTED_TOP_LEVEL)) {
    if (manifest[key] !== value) fail(`${key} must be ${value}`);
  }
  if (!Array.isArray(manifest.rows) || manifest.rows.length !== 20) fail('rows must contain exactly 20 entries');
  const ids = manifest.rows.map((row) => row?.event_id);
  if (new Set(ids).size !== ids.length) fail('duplicate event IDs are not allowed');
  for (const id of ids) if (EXCLUDED_IDS.has(id)) fail(`${id}: excluded/reserve ID`);
  if (ids.join(',') !== EXPECTED_IDS.join(',')) fail('event IDs must use the frozen order');
  for (let index = 0; index < manifest.rows.length; index += 1) {
    validateRowStructure(manifest.rows[index], index, { enforceApprovedTargets });
  }
  return manifest;
}

export async function loadAndValidateManifest(urlOrPath) {
  let manifest;
  try {
    manifest = JSON.parse(await readFile(urlOrPath, 'utf8'));
  } catch (error) {
    fail(`cannot load JSON: ${error.message}`);
  }
  validateManifestStructure(manifest, { enforceApprovedTargets: true });
  for (const row of manifest.rows) await validateRowEvidence(row);
  return manifest;
}
