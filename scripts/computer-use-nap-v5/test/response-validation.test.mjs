import assert from 'node:assert/strict';
import test from 'node:test';

import { validatePredictions } from '../lib/response-validation.mjs';

const prediction = (rank, overrides = {}) => ({
  rank,
  action_type: rank === 2 ? 'activate' : 'focus',
  app: rank === 1 ? 'Arc' : rank === 2 ? 'Codex' : 'Slack',
  object: rank === 1 ? 'Coda' : null,
  subtarget: null,
  reason: `reason ${rank}`,
  ...overrides,
});
const response = (overrides = {}) => ({
  predictions: [prediction(1), prediction(2), prediction(3)],
  ...overrides,
});
const invalid = (fn, pattern = /invalid_schema/) => assert.throws(fn, (error) => error?.code === 'invalid_schema' && pattern.test(error.message));

test('accepts exactly three schema-valid predictions and returns a defensive frozen value', () => {
  const input = response();
  const result = validatePredictions(input);
  assert.deepEqual(result, input);
  assert.notEqual(result, input);
  assert.ok(Object.isFrozen(result) && Object.isFrozen(result.predictions) && result.predictions.every(Object.isFrozen));
});

test('requires an exact plain top-level object with only predictions', () => {
  for (const value of [null, [], { predictions: response().predictions, extra: true }, {}]) invalid(() => validatePredictions(value));
});

test('requires exactly three predictions', () => {
  for (const predictions of [[], [prediction(1)], [prediction(1), prediction(2)], [...response().predictions, prediction(4)]]) {
    invalid(() => validatePredictions({ predictions }));
  }
});

test('requires every prediction to be a plain object', () => {
  for (const value of [null, [], 'prediction']) {
    const input = response();
    input.predictions[0] = value;
    invalid(() => validatePredictions(input));
  }
});

test('requires every prediction to contain exactly the six frozen keys', () => {
  for (const changed of [
    { rank: 1, action_type: 'focus', app: 'Arc', object: null, subtarget: null },
    { ...prediction(1), extra: true },
  ]) {
    const input = response();
    input.predictions[0] = changed;
    invalid(() => validatePredictions(input));
  }
});

test('requires rank to be an integer', () => {
  for (const rank of [1.5, '1', null]) invalid(() => validatePredictions(response({ predictions: [prediction(rank), prediction(2), prediction(3)] })));
});

test('requires ranks exactly 1, 2, 3 at array indexes zero through two', () => {
  for (const ranks of [[2, 1, 3], [1, 1, 3], [1, 3, 2], [0, 2, 3]]) {
    invalid(() => validatePredictions({ predictions: ranks.map((rank, index) => prediction(rank, { app: ['Arc', 'Codex', 'Slack'][index] })) }));
  }
});

test('requires action_type to be exactly focus or activate', () => {
  for (const action_type of ['click', 'Focus', '', null]) {
    const input = response();
    input.predictions[0] = prediction(1, { action_type });
    invalid(() => validatePredictions(input));
  }
});

test('requires app to be a string', () => {
  for (const app of [null, 1, {}]) {
    const input = response();
    input.predictions[0] = prediction(1, { app });
    invalid(() => validatePredictions(input));
  }
});

test('requires every nonnull target component to be trimmed and nonempty', () => {
  for (const overrides of [{ app: ' Arc' }, { app: '   ' }, { object: 'Coda ' }, { object: '' }, { object: 'Coda', subtarget: ' editor' }, { object: 'Coda', subtarget: '' }]) {
    const input = response();
    input.predictions[0] = prediction(1, overrides);
    invalid(() => validatePredictions(input));
  }
});

test('enforces strict application, object, and subtarget null shapes', () => {
  const valid = response();
  valid.predictions[0] = prediction(1, { object: null, subtarget: null });
  valid.predictions[1] = prediction(2, { object: 'Thread', subtarget: null });
  valid.predictions[2] = prediction(3, { object: 'Channel', subtarget: 'composer' });
  assert.deepEqual(validatePredictions(valid), valid);
  const broken = response();
  broken.predictions[0] = prediction(1, { object: null, subtarget: 'composer' });
  invalid(() => validatePredictions(broken));
});

test('requires reason to be a trimmed nonempty string', () => {
  for (const reason of [null, '', '   ', ' reason', 'reason ']) {
    const input = response();
    input.predictions[0] = prediction(1, { reason });
    invalid(() => validatePredictions(input));
  }
});

test('counts reason limits by Unicode code points and accepts exactly 240', () => {
  const input = response();
  input.predictions[0] = prediction(1, { reason: '🧭'.repeat(240) });
  assert.equal(Array.from(validatePredictions(input).predictions[0].reason).length, 240);
});

test('rejects a reason longer than 240 Unicode code points', () => {
  const input = response();
  input.predictions[0] = prediction(1, { reason: '🧭'.repeat(241) });
  invalid(() => validatePredictions(input));
});

test('requires three distinct normalized full actions', () => {
  const input = response();
  input.predictions[1] = prediction(2, { action_type: 'focus', app: 'ＡＲＣ', object: 'Coda', subtarget: null });
  invalid(() => validatePredictions(input));
});

test('never repairs, deduplicates, or reranks invalid transported bytes', () => {
  const input = response({ predictions: [prediction(2), prediction(1), prediction(3)] });
  const before = structuredClone(input);
  invalid(() => validatePredictions(input));
  assert.deepEqual(input, before);
});
