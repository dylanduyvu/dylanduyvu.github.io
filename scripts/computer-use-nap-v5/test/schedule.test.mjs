import assert from 'node:assert/strict';
import test from 'node:test';

import { CONDITIONS, METHOD } from '../config.mjs';
import { canonicalJson } from '../lib/immutable.mjs';
import * as schedule from '../lib/schedule.mjs';

function manifest() {
  return {
    version: 1,
    targets: Array.from({ length: METHOD.targetCount }, (_, index) => ({
      target_ordinal: index + 1,
      target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
      chronology_index: 20 + index * 7,
    })),
  };
}

test('exports one pure builder and emits exactly 11 adjacent pairs / 22 slots', () => {
  assert.deepEqual(Object.keys(schedule), ['buildSchedule']);
  const output = schedule.buildSchedule(manifest());
  assert.equal(output.target_count, METHOD.targetCount);
  assert.equal(output.scheduled_slot_count, METHOD.scheduledSlotCount);
  assert.equal(output.slots.length, METHOD.scheduledSlotCount);
  for (let index = 0; index < METHOD.targetCount; index += 1) {
    const pair = output.slots.slice(index * 2, index * 2 + 2);
    assert.deepEqual(pair.map((slot) => slot.target_ordinal), [index + 1, index + 1]);
  }
});

test('preserves targets in strict canonical chronology', () => {
  const output = schedule.buildSchedule(manifest());
  assert.deepEqual(
    output.slots.filter((slot) => slot.pair_position === 1).map((slot) => slot.target_chronology_index),
    manifest().targets.map((target) => target.chronology_index),
  );
  const reordered = manifest();
  [reordered.targets[4].chronology_index, reordered.targets[5].chronology_index] = [
    reordered.targets[5].chronology_index,
    reordered.targets[4].chronology_index,
  ];
  assert.throws(() => schedule.buildSchedule(reordered), /chronolog/i);
});

test('puts state_only first for every odd target ordinal', () => {
  const output = schedule.buildSchedule(manifest());
  for (const target of output.slots.filter((slot) => slot.target_ordinal % 2 === 1)) {
    assert.equal(
      target.condition,
      target.pair_position === 1 ? 'state_only' : 'state_plus_hybrid_history',
    );
  }
});

test('puts state_plus_hybrid_history first for every even target ordinal', () => {
  const output = schedule.buildSchedule(manifest());
  for (const target of output.slots.filter((slot) => slot.target_ordinal % 2 === 0)) {
    assert.equal(
      target.condition,
      target.pair_position === 1 ? 'state_plus_hybrid_history' : 'state_only',
    );
  }
});

test('freezes the exact condition tokens and 6/5 first-condition balance', () => {
  const output = schedule.buildSchedule(manifest());
  assert.deepEqual(output.conditions, CONDITIONS);
  assert.deepEqual(output.first_condition_balance, {
    state_only: 6,
    state_plus_hybrid_history: 5,
  });
  const first = output.slots.filter((slot) => slot.pair_position === 1);
  assert.equal(first.filter((slot) => slot.condition === 'state_only').length, 6);
  assert.equal(first.filter((slot) => slot.condition === 'state_plus_hybrid_history').length, 5);
});

test('assigns unique consecutive slot IDs and ordinals', () => {
  const output = schedule.buildSchedule(manifest());
  assert.deepEqual(
    output.slots.map((slot) => slot.slot_id),
    Array.from({ length: METHOD.scheduledSlotCount }, (_, index) => `NAP-V5-SLOT-${String(index + 1).padStart(2, '0')}`),
  );
  assert.deepEqual(output.slots.map((slot) => slot.slot_ordinal), Array.from({ length: METHOD.scheduledSlotCount }, (_, index) => index + 1));
  assert.equal(new Set(output.slots.map((slot) => slot.slot_id)).size, METHOD.scheduledSlotCount);
});

test('binds each adjacent pair to the same target and pair positions 1 then 2', () => {
  const output = schedule.buildSchedule(manifest());
  for (let index = 0; index < METHOD.targetCount; index += 1) {
    const [first, second] = output.slots.slice(index * 2, index * 2 + 2);
    assert.equal(first.target_id, second.target_id);
    assert.equal(first.target_chronology_index, second.target_chronology_index);
    assert.deepEqual([first.pair_position, second.pair_position], [1, 2]);
    assert.notEqual(first.condition, second.condition);
  }
});

test('is byte-deterministic, exact-key validating, and deeply frozen', () => {
  const left = schedule.buildSchedule(manifest());
  const right = schedule.buildSchedule(structuredClone(manifest()));
  assert.equal(canonicalJson(left), canonicalJson(right));
  assert.ok(Object.isFrozen(left));
  assert.ok(Object.isFrozen(left.slots[0]));
  assert.throws(() => left.slots.pop(), TypeError);

  const extra = manifest();
  extra.targets[0].future_label = 'forbidden';
  assert.throws(() => schedule.buildSchedule(extra), /exact|key|target/i);
  const short = manifest();
  short.targets.pop();
  assert.throws(() => schedule.buildSchedule(short), /11/);
  const wrongId = manifest();
  wrongId.targets[0].target_id = 'NAP-V5-TARGET-01-R2';
  assert.throws(() => schedule.buildSchedule(wrongId), /target.*id|revision/i);
});
