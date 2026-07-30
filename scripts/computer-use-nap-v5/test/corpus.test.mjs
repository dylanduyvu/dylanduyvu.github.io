import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { CANONICAL_COMMIT, CANONICAL_LEDGER_PATH, CANONICAL_SHA256 } from '../config.mjs';
import { parseCanonicalLedger, parseDestination, parsePlayerTime, serializeHistoryRow, compileCorpusSnapshot } from '../lib/corpus.mjs';
import { parseLedgerTableInternal } from '../lib/corpus-table.mjs';
import { ledgerHeader, ledgerRow, provenance } from './corpus-fixtures.mjs';

const canonicalBytes = await readFile(CANONICAL_LEDGER_PATH);
const canonicalMarkdown = new TextDecoder('utf-8', { fatal: true }).decode(canonicalBytes);
const parsed = () => parseCanonicalLedger(canonicalBytes, provenance);
const tableParsed = (markdown) => parseLedgerTableInternal(markdown);

test('requires the exact eleven-column ledger header', () => {
  assert.throws(() => tableParsed(canonicalMarkdown.replace(ledgerHeader, '| ID | nope |')), /header/i);
  assert.throws(() => parseCanonicalLedger(canonicalBytes, { ...provenance, extra: 'nope' }), /provenance/i);
  assert.throws(() => parseCanonicalLedger(canonicalBytes, { ...provenance, sha256: '0'.repeat(64) }), /provenance/i);
});

test('isolates the named ledger table before retired candidates', () => {
  const snapshot = parsed();
  assert.equal(snapshot.rows.length, 220);
  assert.equal(snapshot.rows.at(-1).event_id, 'BLOG-V4-232');
  for (const invalid of [
    canonicalMarkdown.replace('## Retired batch-1 candidates', '## Retired batch-1 candidates suffix'),
    canonicalMarkdown.replace('## Retired batch-1 candidates', '## Merged clean event ledger\n## Retired batch-1 candidates'),
    canonicalMarkdown.replace(`## Merged clean event ledger\n\n${ledgerHeader}`, `## Merged clean event ledger\n${ledgerHeader}`),
  ]) assert.throws(() => tableParsed(invalid), /heading|topology|boundary/i);
});

test('requires exactly eleven cells in every data row', () => {
  const lines = canonicalMarkdown.split('\n');
  const firstRow = lines.indexOf(ledgerHeader) + 2;
  lines[firstRow] = lines[firstRow].replace(' | pointer |', ' |');
  assert.throws(() => tableParsed(lines.join('\n')), /eleven cells/i);
});

test('preserves 220 physical rows with one-based chronology indexes', () => {
  const rows = parsed().rows;
  assert.equal(rows.length, 220);
  assert.deepEqual(rows.slice(0, 2).map(({ chronology_index, event_id }) => ({ chronology_index, event_id })), [{ chronology_index: 1, event_id: 'BLOG-V4-001' }, { chronology_index: 2, event_id: 'BLOG-V4-002' }]);
  assert.deepEqual(Object.keys(rows[0]), ['event_id', 'chronology_index', 'recording_id', 'raw_recording_time', 'parsed_time', 'canonical_status', 'input_method', 'action_type', 'target', 'history_value', 'demo_value', 'shortcut_value', 'canonical_evidence_value', 'context_cleanup']);
  assert.deepEqual(Object.keys(rows[0].target), ['app', 'object', 'subtarget']);
  const shortened = canonicalMarkdown.split('\n');
  shortened.splice(shortened.indexOf(ledgerHeader) + 2, 1);
  assert.throws(() => tableParsed(shortened.join('\n')), /exactly 220/i);
  assert.throws(() => { rows[0].target.app = 'mutated'; }, TypeError);
  assert.equal(parsed().rows[0].target.app, 'Codex');
});

test('removes component-wrapping Markdown backticks only', () => {
  const first = parsed().rows[0];
  assert.equal(first.event_id, 'BLOG-V4-001');
  assert.equal(first.target.object, 'Patch NAP blog prep in vault');
  assert.equal(first.context_cleanup, 'Explicit click into the input.');
  const rows = parsed().rows;
  for (const [event_id, field, expected] of [['BLOG-V4-003', 'subtarget', 'all hands 7.27 note'], ['BLOG-V4-016', 'object', 'Automate rekordbox workflow task'], ['BLOG-V4-148', 'subtarget', '@handsdiff handle copy control'], ['BLOG-V4-178', 'subtarget', 'dylanduyvu@gmail.com inbox']]) assert.equal(rows.find((row) => row.event_id === event_id).target[field], expected);
  assert.ok(rows.every((row) => Object.values(row.target).every((value) => value === null || !value.includes('`'))));
});

test('uses the literal Unicode arrow separator for destinations', () => {
  assert.deepEqual(parseDestination('Arc → Coda → `all hands 7.23` → editor/body'), { app: 'Arc', object: 'Coda → all hands 7.23', subtarget: 'editor/body' });
  for (const invalid of ['Arc->Coda', 'Arc→ Coda', 'Arc →Coda', 'Arc → Coda→x', 'Arc  → Coda', 'Arc →  Coda', ' Arc → Coda', 'Arc → Coda ', 'Arc →  → Coda', 'Arc → `Coda', 'Arc → Co`da', 'Arc → Coda`', 'Arc → ``']) assert.throws(() => parseDestination(invalid), /separator|destination|backtick/i);
});

test('retains accepted and nonaccepted statuses as canonical audit records', () => {
  const statuses = Object.groupBy(parsed().rows, (row) => row.canonical_status);
  assert.deepEqual(Object.fromEntries(Object.entries(statuses).map(([key, value]) => [key, value.length])), { accepted: 196, needs_invocation: 8, needs_prior_frame: 10, needs_timing: 2, needs_target: 2, unresolved: 2 });
});

test('accepts history rows only when status is accepted and History is yes', () => {
  const snapshot = parsed();
  assert.equal(snapshot.accepted_history.length, 196);
  assert.ok(snapshot.rows.filter((row) => row.canonical_status !== 'accepted').every((row) => !snapshot.accepted_history.includes(row)));
});

test('parses exact player time', () => { assert.deepEqual(parsePlayerTime('0:16'), { kind: 'exact', seconds: 16, sequence: null, raw: '0:16' }); for (const invalid of ['0:99', '0:1', 'x:16', '999999999999999999999999999999999999999999:00']) assert.throws(() => parsePlayerTime(invalid), /time/i); });
test('parses exact player time sequence suffix', () => { assert.deepEqual(parsePlayerTime('0:16a'), { kind: 'exact', seconds: 16, sequence: 'a', raw: '0:16a' }); assert.deepEqual(parsePlayerTime('0:16b'), { kind: 'exact', seconds: 16, sequence: 'b', raw: '0:16b' }); for (const invalid of ['0:16c', '0:16z']) assert.throws(() => parsePlayerTime(invalid), /time/i); });
test('marks approximate player time unresolvable', () => { assert.deepEqual(parsePlayerTime('~0:06'), { kind: 'unresolvable', reason: 'approximate', raw: '~0:06' }); assert.throws(() => parsePlayerTime('~0:99'), /time/i); });
test('marks ranged player time unresolvable', () => { assert.deepEqual(parsePlayerTime('1:27–1:47'), { kind: 'unresolvable', reason: 'range', raw: '1:27–1:47' }); for (const invalid of ['1:99–1:47', '1:27–1:99']) assert.throws(() => parsePlayerTime(invalid), /time/i); });
test('marks after player time unresolvable', () => { assert.deepEqual(parsePlayerTime('after 3:17'), { kind: 'unresolvable', reason: 'relative_after', raw: 'after 3:17' }); assert.throws(() => parsePlayerTime('after 3:99'), /time/i); });
test('marks before player time unresolvable', () => { assert.deepEqual(parsePlayerTime('before 0:00'), { kind: 'unresolvable', reason: 'relative_before', raw: 'before 0:00' }); assert.throws(() => parsePlayerTime('before 0:99'), /time/i); });

test('does not reorder equal-second authoritative rows', () => {
  const rows = parsed().rows.filter((row) => row.recording_id === '1785165613408' && row.raw_recording_time.endsWith('1:03'));
  assert.deepEqual(rows.map((row) => row.event_id), ['BLOG-V4-005', 'BLOG-V4-006']);
});

test('retains the canonical input method values', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(parsed().accepted_history, (row) => row.input_method)).map(([key, value]) => [key, value.length])), { pointer: 139, keyboard_enter: 56, keyboard_command_w: 1 });
});

test('enforces app object subtarget target shapes', () => {
  const target = parseDestination('Codex → `Patch NAP blog prep in vault` → composer');
  assert.deepEqual(target, { app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'composer' });
  assert.deepEqual(parseDestination('Arc'), { app: 'Arc', object: null, subtarget: null });
  assert.deepEqual(parseDestination('Arc → Tab'), { app: 'Arc', object: 'Tab', subtarget: null });
});

test('preserves noncontiguous identifiers and suffix identifiers', () => {
  const rows = parsed().rows;
  for (const suffix of ['BLOG-V4-011A', 'BLOG-V4-035A']) {
    const index = rows.findIndex((row) => row.event_id === suffix);
    assert.equal(rows[index].chronology_index, index + 1);
    assert.equal(rows[index - 1].event_id, suffix.replace('A', ''));
    assert.equal(rows[index + 1].event_id, `BLOG-V4-${String(Number(suffix.slice(-4, -1)) + 1).padStart(3, '0')}`);
  }
  const gap = rows.findIndex((row) => row.event_id === 'BLOG-V4-016');
  assert.equal(rows[gap + 1].event_id, 'BLOG-V4-018');
  assert.equal(rows[gap + 1].chronology_index, rows[gap].chronology_index + 1);
  assert.equal(rows.some((row) => row.event_id === 'BLOG-V4-017'), false);
});

test('serializes accepted history rows with the exact identity shape', () => {
  assert.deepEqual(serializeHistoryRow(parsed().accepted_history[0], 1), { history_ordinal: 1, action_type: 'focus', input_method: 'pointer', granularity: 'subtarget', app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'composer' });
  for (const ordinal of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => serializeHistoryRow(parsed().accepted_history[0], ordinal), /ordinal/i);
  assert.throws(() => serializeHistoryRow({ ...parsed().accepted_history[0], action_type: 'type' }, 1), /action/i);
});

test('compiles the frozen current and historical ledger snapshot without a shell', async () => {
  const git = async (file, args, options) => {
    assert.equal(file, 'git');
    assert.deepEqual(options, { encoding: 'buffer', maxBuffer: 1024 * 1024 });
    if (args[0] === 'cat-file') { assert.deepEqual(args, ['cat-file', '-e', `${CANONICAL_COMMIT}^{commit}`]); return { stdout: Buffer.alloc(0), stderr: Buffer.alloc(0), code: 0 }; }
    assert.deepEqual(args, ['show', `${CANONICAL_COMMIT}:30-projects/computer-use-nap-v4-canonical-dataset.md`]);
    return { stdout: canonicalBytes, stderr: Buffer.alloc(0), code: 0 };
  };
  const snapshot = await compileCorpusSnapshot({ spawn: git, readFile: async () => canonicalBytes });
  assert.equal(snapshot.retained_count, 220);
  assert.equal(snapshot.accepted_count, 196);
  assert.equal(snapshot.accepted_history_count, 196);
  assert.equal(snapshot.accepted_nontrivial_count, 139);
  assert.deepEqual(snapshot.source, provenance);
  assert.deepEqual(snapshot.targets[0].target, { app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: 'composer' });
  assert.deepEqual(snapshot.targets.find((row) => row.event_id === 'BLOG-V4-098').target, { app: 'Arc', object: 'Coda → all hands 7.23', subtarget: 'editor/body' });
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(snapshot.targets, (row) => row.action_type)).map(([key, value]) => [key, value.length])), { focus: 115, activate: 24 });
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(snapshot.targets, (row) => row.target.app)).map(([key, value]) => [key, value.length])), { Codex: 56, Arc: 36, 'VS Code': 47 });
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(snapshot.targets, (row) => row.granularity)).map(([key, value]) => [key, value.length])), { application: 11, object: 79, subtarget: 49 });
  assert.throws(() => { snapshot.targets[0].target.app = 'mutated'; }, TypeError);
  assert.equal(snapshot.rows[0].target.app, 'Codex');
  const failed = (stage, mode) => async (_file, args) => {
    if ((stage === 'commit' && args[0] === 'cat-file') || (stage === 'show' && args[0] === 'show')) {
      if (mode === 'throw') throw new Error('injected git failure');
      return { stdout: Buffer.alloc(0), stderr: Buffer.alloc(0), code: 1 };
    }
    return { stdout: canonicalBytes, stderr: Buffer.alloc(0), code: 0 };
  };
  await assert.rejects(compileCorpusSnapshot({ spawn: failed('commit', 'throw'), readFile: async () => canonicalBytes }), /commit/i);
  await assert.rejects(compileCorpusSnapshot({ spawn: failed('commit', 'code'), readFile: async () => canonicalBytes }), /commit/i);
  await assert.rejects(compileCorpusSnapshot({ spawn: failed('show', 'throw'), readFile: async () => canonicalBytes }), /ledger/i);
  await assert.rejects(compileCorpusSnapshot({ spawn: failed('show', 'code'), readFile: async () => canonicalBytes }), /ledger/i);
  await assert.rejects(compileCorpusSnapshot({ spawn: async (_file, args) => ({ stdout: args[0] === 'show' ? Buffer.from('drift') : Buffer.alloc(0), code: 0 }), readFile: async () => canonicalBytes }), /hash/i);
  await assert.rejects(compileCorpusSnapshot({ spawn: git, readFile: async () => Buffer.from('drift') }), /hash/i);
});
