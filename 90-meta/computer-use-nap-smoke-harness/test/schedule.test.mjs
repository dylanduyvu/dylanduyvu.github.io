import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { loadAndValidateManifest } from '../lib/manifest.mjs';
import { buildSchedule } from '../lib/schedule.mjs';

const experimentDir = path.resolve(import.meta.dirname, '..');
const manifest = await loadAndValidateManifest(path.join(experimentDir, 'manifest.json'));
const rows = manifest.rows;
const targetRows = rows.slice(1);
const clone = (value) => structuredClone(value);

test('builds the exact 38-slot paired schedule in canonical target order', () => {
  const schedule = buildSchedule(manifest);

  assert.equal(rows[0].event_id, 'BLOG-CAND-003');
  assert.equal(schedule.length, 38);
  assert.deepEqual(
    [...new Set(schedule.map((entry) => entry.event_id))],
    targetRows.map((row) => row.event_id),
  );
  assert.deepEqual(
    schedule.map((entry) => entry.call_sequence_index),
    Array.from({ length: 38 }, (_, index) => index + 1),
  );

  const uniqueSlots = new Set(
    schedule.map((entry) => `${entry.event_id}:${entry.condition}`),
  );
  assert.equal(uniqueSlots.size, 38);

  for (let index = 0; index < targetRows.length; index += 1) {
    const targetOrdinal = index + 1;
    const row = targetRows[index];
    const pair = schedule.slice(index * 2, index * 2 + 2);
    const expectedConditions = targetOrdinal % 2 === 1
      ? ['state_only', 'state_plus_all_prior']
      : ['state_plus_all_prior', 'state_only'];

    assert.deepEqual(pair.map((entry) => entry.condition), expectedConditions);
    assert.deepEqual(pair.map((entry) => entry.paired_target_ordinal), [targetOrdinal, targetOrdinal]);
    assert.deepEqual(pair.map((entry) => entry.event_id), [row.event_id, row.event_id]);
    assert.deepEqual(pair.map((entry) => entry.event_row_version), [row.row_version, row.row_version]);

    for (const entry of pair) {
      assert.deepEqual(Object.keys(entry), [
        'call_sequence_index',
        'paired_target_ordinal',
        'event_id',
        'event_row_version',
        'condition',
        'history_event_ids_ordered',
      ]);
      assert.deepEqual(
        entry.history_event_ids_ordered,
        entry.condition === 'state_only'
          ? []
          : rows.slice(0, targetOrdinal).map((historyRow) => historyRow.event_id),
      );
    }
  }
});

test('first and final history slots contain every prior event exactly once', () => {
  const schedule = buildSchedule(manifest);
  const historySlots = schedule.filter(
    (entry) => entry.condition === 'state_plus_all_prior',
  );

  assert.equal(historySlots.length, 19);
  assert.deepEqual(historySlots[0].history_event_ids_ordered, ['BLOG-CAND-003']);
  assert.deepEqual(
    historySlots.at(-1).history_event_ids_ordered,
    rows.slice(0, -1).map((row) => row.event_id),
  );
  assert.equal(historySlots.at(-1).history_event_ids_ordered.length, 19);
  for (const entry of historySlots) {
    assert.equal(
      new Set(entry.history_event_ids_ordered).size,
      entry.history_event_ids_ordered.length,
    );
    assert.ok(!entry.history_event_ids_ordered.includes(entry.event_id));
  }
});

test('is deterministic, deeply immutable, and does not mutate the manifest', () => {
  const original = clone(manifest);
  const first = buildSchedule(manifest);
  const second = buildSchedule(manifest);

  assert.deepEqual(first, second);
  assert.notEqual(first, second);
  assert.deepEqual(manifest, original);
  assert.ok(Object.isFrozen(first));
  for (const entry of first) {
    assert.ok(Object.isFrozen(entry));
    assert.ok(Object.isFrozen(entry.history_event_ids_ordered));
  }
  assert.throws(() => first.push({}), TypeError);
  assert.throws(() => {
    first[0].condition = 'state_plus_all_prior';
  }, TypeError);
  assert.throws(() => {
    first[1].history_event_ids_ordered.push('BLOG-CAND-999');
  }, TypeError);
});

test('fails closed on non-frozen manifest structure through the shared validator', () => {
  const duplicate = clone(manifest);
  duplicate.rows[1].event_id = duplicate.rows[0].event_id;
  assert.throws(() => buildSchedule(duplicate), /duplicate|frozen order/i);

  const missing = clone(manifest);
  missing.rows.pop();
  assert.throws(() => buildSchedule(missing), /exactly 20/i);

  const reordered = clone(manifest);
  [reordered.rows[1], reordered.rows[2]] = [reordered.rows[2], reordered.rows[1]];
  assert.throws(() => buildSchedule(reordered), /frozen order/i);

  const wrongVersion = clone(manifest);
  wrongVersion.rows[1].row_version = 1;
  assert.throws(() => buildSchedule(wrongVersion), /row_version/i);

  const wrongManifestId = clone(manifest);
  wrongManifestId.manifest_id = 'not-frozen';
  assert.throws(() => buildSchedule(wrongManifestId), /manifest_id/i);
});

test('structural scheduling does not replace async approved-target loading', () => {
  const structurallyValid = clone(manifest);
  structurallyValid.rows[1].target = {
    app: 'TEST SENTINEL',
    object: 'structurally coherent target',
    subtarget: null,
  };
  structurallyValid.rows[1].canonical_label =
    'TEST SENTINEL -> structurally coherent target';

  assert.deepEqual(buildSchedule(structurallyValid), buildSchedule(manifest));
});
