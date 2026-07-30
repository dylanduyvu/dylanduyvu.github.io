import assert from 'node:assert/strict';
import test from 'node:test';

import { decideSlotState } from '../lib/slot-state.mjs';

const attempt = (
  attemptOrdinal,
  classification = 'infrastructure_retry',
  code = 'transport_disconnect',
  overrides = {},
) => ({
  attempt_ordinal: attemptOrdinal,
  classification,
  code,
  verified: true,
  latency_ms: 25,
  ...overrides,
});

const decide = (overrides = {}) => decideSlotState({
  slotOrdinal: 1,
  attempts: [],
  terminalRecord: null,
  fatalEnvironment: null,
  ...overrides,
});

test('an untouched slot starts at attempt 1', () => {
  assert.deepEqual(decide(), {
    kind: 'attempt',
    slot_ordinal: 1,
    attempt_ordinal: 1,
    completed_attempts: 0,
  });
});

test('one retryable infrastructure result retries the same slot immediately at attempt 2', () => {
  assert.deepEqual(decide({ attempts: [attempt(1)] }), {
    kind: 'attempt',
    slot_ordinal: 1,
    attempt_ordinal: 2,
    completed_attempts: 1,
  });
});

test('two retryable infrastructure results resume the exact unfinished attempt 3', () => {
  assert.deepEqual(decide({ attempts: [attempt(1), attempt(2)] }), {
    kind: 'attempt',
    slot_ordinal: 1,
    attempt_ordinal: 3,
    completed_attempts: 2,
  });
});

test('a slot can never contain more than three attempts', () => {
  assert.throws(
    () => decide({ attempts: [attempt(1), attempt(2), attempt(3), attempt(4)] }),
    /three|attempt|limit/i,
  );
});

test('the first valid final becomes the authoritative terminal result', () => {
  const state = decide({
    attempts: [attempt(1, 'valid_final', 'valid_final', { latency_ms: 41 })],
  });
  assert.deepEqual(state, {
    kind: 'terminal',
    terminal_record: {
      version: 1,
      slot_ordinal: 1,
      terminal_state: 'valid_final',
      classification: 'valid_final',
      code: 'valid_final',
      authoritative_attempt_ordinal: 1,
      latency_ms: 41,
    },
  });
});

test('a valid second attempt is authoritative after one retryable failure', () => {
  const state = decide({
    attempts: [
      attempt(1, 'infrastructure_retry', 'rate_limit'),
      attempt(2, 'valid_final', 'valid_final', { latency_ms: 73 }),
    ],
  });
  assert.equal(state.terminal_record.authoritative_attempt_ordinal, 2);
  assert.equal(state.terminal_record.latency_ms, 73);
});

test('a terminal-invalid result receives no retry', () => {
  const state = decide({
    attempts: [attempt(1, 'terminal_invalid', 'attempted_tool_use')],
  });
  assert.deepEqual(
    [state.kind, state.terminal_record.terminal_state, state.terminal_record.code],
    ['terminal', 'terminal_invalid', 'attempted_tool_use'],
  );
});

test('three retryable infrastructure failures terminate as infrastructure_failure', () => {
  const state = decide({
    attempts: [
      attempt(1, 'infrastructure_retry', 'rate_limit'),
      attempt(2, 'infrastructure_retry', 'service_unavailable'),
      attempt(3, 'infrastructure_retry', 'transport_disconnect', { latency_ms: 99 }),
    ],
  });
  assert.deepEqual(state, {
    kind: 'terminal',
    terminal_record: {
      version: 1,
      slot_ordinal: 1,
      terminal_state: 'infrastructure_failure',
      classification: 'infrastructure_retry',
      code: 'transport_disconnect',
      authoritative_attempt_ordinal: 3,
      latency_ms: 99,
    },
  });
});

test('a fatal environment result stops without consuming the next attempt and repair resumes it', () => {
  const attempts = [attempt(1, 'infrastructure_retry', 'rate_limit')];
  const stopped = decide({
    attempts,
    fatalEnvironment: {
      classification: 'fatal_environment',
      code: 'authentication',
      verified: true,
    },
  });
  assert.deepEqual(stopped, {
    kind: 'fatal_stop',
    slot_ordinal: 1,
    attempt_ordinal: 2,
    completed_attempts: 1,
    classification: 'fatal_environment',
    code: 'authentication',
  });
  assert.deepEqual(decide({ attempts }), {
    kind: 'attempt',
    slot_ordinal: 1,
    attempt_ordinal: 2,
    completed_attempts: 1,
  });
});

test('an authenticated completed terminal record returns complete and is never overwritten', () => {
  const attempts = [attempt(1, 'valid_final', 'valid_final', { latency_ms: 41 })];
  const terminalRecord = decide({ attempts }).terminal_record;
  const completed = decide({ attempts, terminalRecord });
  assert.equal(completed.kind, 'complete');
  assert.deepEqual(completed.terminal_record, terminalRecord);
  assert.equal(Object.isFrozen(completed), true);
});

test('a terminal record that differs from verified attempts fails closed', () => {
  const attempts = [attempt(1, 'terminal_invalid', 'refusal')];
  const terminalRecord = {
    ...decide({ attempts }).terminal_record,
    code: 'invalid_schema',
  };
  assert.throws(
    () => decide({ attempts, terminalRecord }),
    /terminal|differ|verified|mismatch/i,
  );
});

test('partial or unverified attempt artifacts fail closed', () => {
  assert.throws(
    () => decide({ attempts: [attempt(1, 'infrastructure_retry', 'rate_limit', { verified: false })] }),
    /verified|partial|corrupt/i,
  );
  assert.throws(
    () => decide({ attempts: [{ ...attempt(1), code: undefined }] }),
    /attempt|code|artifact|exact/i,
  );
});

test('gapped duplicate or out-of-order attempt ordinals fail closed', () => {
  assert.throws(() => decide({ attempts: [attempt(2)] }), /contiguous|ordinal|order/i);
  assert.throws(
    () => decide({ attempts: [attempt(1), attempt(1)] }),
    /contiguous|ordinal|order/i,
  );
  assert.throws(
    () => decide({ attempts: [attempt(1), attempt(3)] }),
    /contiguous|ordinal|order/i,
  );
});

test('no attempt may appear after the first terminal classification', () => {
  assert.throws(
    () => decide({
      attempts: [
        attempt(1, 'terminal_invalid', 'refusal'),
        attempt(2, 'valid_final', 'valid_final'),
      ],
    }),
    /after|terminal|authoritative|overwrite/i,
  );
});
