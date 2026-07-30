import assert from 'node:assert/strict';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import * as scoring from '../lib/scoring.mjs';

const {
  aggregateConditions,
  pairTargets,
  scoreSlot,
} = scoring;

const STATE = 'state_only';
const HISTORY = 'state_plus_hybrid_history';

const target = (overrides = {}) => ({
  app: 'Arc',
  object: 'Inbox',
  subtarget: null,
  ...overrides,
});

const prediction = (rank, overrides = {}) => ({
  rank,
  action_type: rank === 2 ? 'activate' : 'focus',
  app: ['Arc', 'Slack', 'Codex'][rank - 1],
  object: ['Inbox', 'general', 'Task'][rank - 1],
  subtarget: [null, 'composer', 'panel'][rank - 1],
  reason: `reason ${rank}`,
  ...overrides,
});

const validInput = (overrides = {}) => ({
  slot_id: 'NAP-V5-SLOT-01',
  slot_ordinal: 1,
  target_id: 'NAP-V5-TARGET-01-R1',
  target_ordinal: 1,
  condition: STATE,
  terminal_state: 'valid_final',
  observed_action: {
    action_type: 'focus',
    ...target(),
  },
  accepted_variants: [target()],
  predictions: [prediction(1), prediction(2), prediction(3)],
  semantic_decisions: [null, 'different_destination', 'different_destination'],
  usefulness_decisions: ['useful', 'not_useful', 'not_useful'],
  ...overrides,
});

function terminalInput(terminalState, overrides = {}) {
  return validInput({
    ...overrides,
    terminal_state: terminalState,
    predictions: null,
    semantic_decisions: null,
    usefulness_decisions: null,
  });
}

function inputFor(targetOrdinal, condition, overrides = {}) {
  const pairOffset = (targetOrdinal - 1) * 2;
  const slotOrdinal = pairOffset + (condition === STATE ? 1 : 2);
  return validInput({
    slot_id: `NAP-V5-SLOT-${String(slotOrdinal).padStart(2, '0')}`,
    slot_ordinal: slotOrdinal,
    target_id: `NAP-V5-TARGET-${String(targetOrdinal).padStart(2, '0')}-R1`,
    target_ordinal: targetOrdinal,
    condition,
    ...overrides,
  });
}

function completeScores(factory = (targetOrdinal, condition) => (
  scoreSlot(inputFor(targetOrdinal, condition))
)) {
  return Array.from({ length: METHOD.targetCount }, (_, index) => index + 1)
    .flatMap((targetOrdinal) => [
      factory(targetOrdinal, STATE),
      factory(targetOrdinal, HISTORY),
    ]);
}

test('exports only the three frozen scoring functions', () => {
  assert.deepEqual(Object.keys(scoring).sort(), [
    'aggregateConditions',
    'pairTargets',
    'scoreSlot',
  ]);
});

test('normalizes both prediction and accepted variant with NFKC case trim and collapsed whitespace', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [{
      app: '  ＡＲＣ  ',
      object: '  Team   Inbox ',
      subtarget: null,
    }],
    predictions: [
      prediction(1, { app: ' arc ', object: 'team inbox' }),
      prediction(2),
      prediction(3),
    ],
  }));
  assert.deepEqual(result.scores.structured_normalized_exact, {
    top_1: true,
    top_3: true,
  });
});

test('preserves punctuation during structured target matching', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [target({ object: 'Inbox: Today' })],
    predictions: [
      prediction(1, { object: 'Inbox Today' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('does not remove words or permit a parent target to match a child target', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [target({ object: 'Project Alpha', subtarget: null })],
    predictions: [
      prediction(1, { object: 'Project', subtarget: null }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('requires application-level null shape to match exactly', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [target({ object: null, subtarget: null })],
    predictions: [
      prediction(1, { object: 'Inbox', subtarget: null }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('requires object-level null shape to match exactly', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [target({ subtarget: null })],
    predictions: [
      prediction(1, { subtarget: 'composer' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('requires every subtarget component to match', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [target({ subtarget: 'composer' })],
    predictions: [
      prediction(1, { subtarget: 'send button' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('matches any complete accepted target variant', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [
      target(),
      { app: 'Arc Browser', object: 'Inbox', subtarget: null },
    ],
    predictions: [
      prediction(1, { app: 'arc browser' }),
      prediction(2),
      prediction(3),
    ],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, true);
});

test('never treats one matching alias component as a complete variant match', () => {
  const result = scoreSlot(validInput({
    accepted_variants: [
      { app: 'Arc Browser', object: 'Inbox', subtarget: null },
      { app: 'Arc', object: 'Mail', subtarget: null },
    ],
    predictions: [
      prediction(1, { app: 'Arc Browser', object: 'Mail' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('semantic same_destination counts in primary and sensitivity scoring', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['same_destination', 'different_destination', 'different_destination'],
  }));
  assert.deepEqual(result.scores.semantic_same_destination.top_1, {
    primary: true,
    sensitivity: true,
  });
});

test('semantic different_destination counts as different in both analyses', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.deepEqual(result.scores.semantic_same_destination.top_1, {
    primary: false,
    sensitivity: false,
  });
});

test('semantic uncertain is different primary and same only in sensitivity', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['uncertain', 'different_destination', 'different_destination'],
  }));
  assert.deepEqual(result.scores.semantic_same_destination.top_1, {
    primary: false,
    sensitivity: true,
  });
});

test('semantic top-3 succeeds independently when only rank 3 is same destination', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'same_destination'],
  }));
  assert.equal(result.scores.semantic_same_destination.top_1.primary, false);
  assert.equal(result.scores.semantic_same_destination.top_3.primary, true);
});

test('semantic top-1 success necessarily appears in top-3', () => {
  const result = scoreSlot(validInput());
  assert.equal(result.scores.semantic_same_destination.top_1.primary, true);
  assert.equal(result.scores.semantic_same_destination.top_3.primary, true);
});

test('structured normalized-exact top-1 scores rank 1 only', () => {
  const result = scoreSlot(validInput());
  assert.deepEqual(result.scores.structured_normalized_exact, {
    top_1: true,
    top_3: true,
  });
});

test('structured normalized-exact top-3 can succeed only at rank 3', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3, { app: 'Arc', object: 'Inbox', subtarget: null }),
    ],
    semantic_decisions: ['different_destination', 'different_destination', null],
  }));
  assert.deepEqual(result.scores.structured_normalized_exact, {
    top_1: false,
    top_3: true,
  });
});

test('semantic same destination never substitutes for structured exact identity', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['same_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.semantic_same_destination.top_1.primary, true);
  assert.equal(result.scores.structured_normalized_exact.top_1, false);
});

test('action-type top-1 ignores target identity', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari', action_type: 'focus' }),
      prediction(2),
      prediction(3),
    ],
    semantic_decisions: ['different_destination', 'different_destination', 'different_destination'],
  }));
  assert.equal(result.scores.action_type.top_1, true);
});

test('action-type top-3 can succeed only at a later rank', () => {
  const result = scoreSlot(validInput({
    observed_action: { action_type: 'activate', ...target() },
    predictions: [
      prediction(1, { action_type: 'focus' }),
      prediction(2, { action_type: 'focus' }),
      prediction(3, { action_type: 'activate' }),
    ],
  }));
  assert.deepEqual(result.scores.action_type, {
    top_1: false,
    top_3: true,
  });
});

test('structured exact-action requires both exact target and observed action type', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { action_type: 'activate' }),
      prediction(2),
      prediction(3),
    ],
  }));
  assert.equal(result.scores.structured_normalized_exact.top_1, true);
  assert.equal(result.scores.structured_exact_action.top_1, false);
});

test('structured exact-action top-3 can succeed only at rank 3', () => {
  const result = scoreSlot(validInput({
    predictions: [
      prediction(1, { app: 'Safari', action_type: 'focus' }),
      prediction(2),
      prediction(3, {
        app: 'Arc',
        object: 'Inbox',
        subtarget: null,
        action_type: 'focus',
      }),
    ],
    semantic_decisions: ['different_destination', 'different_destination', null],
  }));
  assert.deepEqual(result.scores.structured_exact_action, {
    top_1: false,
    top_3: true,
  });
});

test('useful rank 1 succeeds in primary and sensitivity top-1/top-3', () => {
  const result = scoreSlot(validInput());
  assert.deepEqual(result.scores.shortcut_usefulness, {
    top_1: { primary: true, sensitivity: true },
    top_3: { primary: true, sensitivity: true },
  });
});

test('shortcut usefulness top-3 can succeed only at rank 3', () => {
  const result = scoreSlot(validInput({
    usefulness_decisions: ['not_useful', 'not_useful', 'useful'],
  }));
  assert.equal(result.scores.shortcut_usefulness.top_1.primary, false);
  assert.equal(result.scores.shortcut_usefulness.top_3.primary, true);
});

test('usefulness uncertain is not useful primary and useful only in sensitivity', () => {
  const result = scoreSlot(validInput({
    usefulness_decisions: ['uncertain', 'not_useful', 'not_useful'],
  }));
  assert.deepEqual(result.scores.shortcut_usefulness.top_1, {
    primary: false,
    sensitivity: true,
  });
});

test('not_useful is false in both usefulness analyses', () => {
  const result = scoreSlot(validInput({
    usefulness_decisions: ['not_useful', 'not_useful', 'not_useful'],
  }));
  assert.deepEqual(result.scores.shortcut_usefulness.top_3, {
    primary: false,
    sensitivity: false,
  });
});

test('terminal invalid output is model-scorable and incorrect for every metric', () => {
  const result = scoreSlot(terminalInput('terminal_invalid'));
  assert.equal(result.model_scorable, true);
  assert.equal(result.invalid_model_output, true);
  assert.deepEqual(new Set([
    result.scores.structured_normalized_exact.top_1,
    result.scores.action_type.top_3,
    result.scores.structured_exact_action.top_3,
    result.scores.semantic_same_destination.top_3.primary,
    result.scores.shortcut_usefulness.top_3.primary,
  ]), new Set([false]));
});

test('terminal infrastructure failure is scheduled but not model-scorable', () => {
  const result = scoreSlot(terminalInput('infrastructure_failure'));
  assert.equal(result.model_scorable, false);
  assert.equal(result.invalid_model_output, false);
  assert.equal(result.scores.semantic_same_destination.top_3.primary, false);
});

test('scoreSlot rejects extra keys invalid statuses missing decisions and malformed null shapes', () => {
  assert.throws(() => scoreSlot({ ...validInput(), extra: true }), /keys|exact|extra/i);
  assert.throws(() => scoreSlot(validInput({ terminal_state: 'retryable' })), /terminal|state/i);
  assert.throws(() => scoreSlot(validInput({ semantic_decisions: null })), /semantic|decision/i);
  assert.throws(
    () => scoreSlot(validInput({
      predictions: [
        prediction(1, { object: null, subtarget: 'child' }),
        prediction(2),
        prediction(3),
      ],
    })),
    /shape|target|object|subtarget/i,
  );
});

test('aggregateConditions fixes 11 scheduled and 11 model-scorable denominators per condition', () => {
  const aggregate = aggregateConditions(completeScores());
  for (const condition of [STATE, HISTORY]) {
    assert.equal(aggregate.conditions[condition].scheduled_slots, METHOD.targetCount);
    assert.equal(aggregate.conditions[condition].model_scorable_slots, METHOD.targetCount);
    assert.deepEqual(
      aggregate.conditions[condition].metrics.structured_normalized_exact.top_1,
      {
        successes: METHOD.targetCount,
        scheduled_denominator: METHOD.targetCount,
        model_scorable_denominator: METHOD.targetCount,
      },
    );
  }
});

test('aggregateConditions includes terminal invalid outputs in model-scorable denominators', () => {
  const scores = completeScores((targetOrdinal, condition) => (
    targetOrdinal === 1 && condition === STATE
      ? scoreSlot(terminalInput('terminal_invalid', inputFor(targetOrdinal, condition)))
      : scoreSlot(inputFor(targetOrdinal, condition))
  ));
  const summary = aggregateConditions(scores).conditions[STATE];
  assert.equal(summary.invalid_model_outputs, 1);
  assert.equal(summary.model_scorable_slots, METHOD.targetCount);
  assert.equal(summary.metrics.semantic_same_destination.top_1.primary.successes, METHOD.targetCount - 1);
});

test('aggregateConditions excludes infrastructure failures only from model-scorable denominators', () => {
  const scores = completeScores((targetOrdinal, condition) => (
    targetOrdinal === 1 && condition === HISTORY
      ? scoreSlot(terminalInput('infrastructure_failure', inputFor(targetOrdinal, condition)))
      : scoreSlot(inputFor(targetOrdinal, condition))
  ));
  const summary = aggregateConditions(scores).conditions[HISTORY];
  assert.equal(summary.infrastructure_failures, 1);
  assert.equal(summary.scheduled_slots, METHOD.targetCount);
  assert.equal(summary.model_scorable_slots, METHOD.targetCount - 1);
  assert.deepEqual(summary.metrics.action_type.top_1, {
    successes: METHOD.targetCount - 1,
    scheduled_denominator: METHOD.targetCount,
    model_scorable_denominator: METHOD.targetCount - 1,
  });
});

test('aggregateConditions reports both denominator families for every frozen top-1/top-3 metric', () => {
  const summary = aggregateConditions(completeScores()).conditions[STATE];
  for (const family of [
    'semantic_same_destination',
    'structured_normalized_exact',
    'action_type',
    'structured_exact_action',
    'shortcut_usefulness',
  ]) {
    for (const cutoff of ['top_1', 'top_3']) {
      const value = summary.metrics[family][cutoff];
      const analyses = Object.hasOwn(value, 'primary')
        ? [value.primary, value.sensitivity]
        : [value];
      for (const ratio of analyses) {
        assert.deepEqual(Object.keys(ratio).sort(), [
          'model_scorable_denominator',
          'scheduled_denominator',
          'successes',
        ]);
      }
    }
  }
});

test('aggregateConditions keeps the two condition summaries independent', () => {
  const scores = completeScores((targetOrdinal, condition) => (
    condition === STATE
      ? scoreSlot(inputFor(targetOrdinal, condition))
      : scoreSlot(terminalInput('terminal_invalid', inputFor(targetOrdinal, condition)))
  ));
  const aggregate = aggregateConditions(scores);
  assert.equal(
    aggregate.conditions[STATE].metrics.semantic_same_destination.top_3.primary.successes,
    METHOD.targetCount,
  );
  assert.equal(
    aggregate.conditions[HISTORY].metrics.semantic_same_destination.top_3.primary.successes,
    0,
  );
});

test('pairTargets counts primary semantic top-3 history wins state-only wins and ties', () => {
  const scores = completeScores((targetOrdinal, condition) => {
    if (targetOrdinal === 1 && condition === STATE) {
      return scoreSlot(terminalInput('terminal_invalid', inputFor(targetOrdinal, condition)));
    }
    if (targetOrdinal === 2 && condition === HISTORY) {
      return scoreSlot(terminalInput('terminal_invalid', inputFor(targetOrdinal, condition)));
    }
    return scoreSlot(inputFor(targetOrdinal, condition));
  });
  const paired = pairTargets(scores);
  assert.deepEqual(paired.primary_counts, {
    history_win: 1,
    state_only_win: 1,
    tie: METHOD.targetCount - 2,
    unscorable_pair: 0,
    scorable_pairs: METHOD.targetCount,
  });
  assert.deepEqual(
    paired.pairs.slice(0, 3).map((entry) => entry.semantic_top_3_primary),
    ['history_win', 'state_only_win', 'tie'],
  );
});

test('pairTargets marks a pair unscorable when either condition has infrastructure failure', () => {
  const scores = completeScores((targetOrdinal, condition) => (
    targetOrdinal === 4 && condition === HISTORY
      ? scoreSlot(terminalInput('infrastructure_failure', inputFor(targetOrdinal, condition)))
      : scoreSlot(inputFor(targetOrdinal, condition))
  ));
  const paired = pairTargets(scores);
  assert.equal(paired.pairs[3].semantic_top_3_primary, 'unscorable_pair');
  assert.equal(paired.pairs[3].semantic_top_3_sensitivity, 'unscorable_pair');
  assert.equal(paired.primary_counts.unscorable_pair, 1);
  assert.equal(paired.primary_counts.scorable_pairs, METHOD.targetCount - 1);
});

test('pairTargets reports uncertain semantic sensitivity separately and returns deterministic frozen output', () => {
  const scores = completeScores((targetOrdinal, condition) => {
    if (targetOrdinal !== 1) return scoreSlot(inputFor(targetOrdinal, condition));
    const predictions = [
      prediction(1, { app: 'Safari' }),
      prediction(2),
      prediction(3),
    ];
    return scoreSlot(inputFor(targetOrdinal, condition, {
      predictions,
      semantic_decisions: condition === STATE
        ? ['uncertain', 'different_destination', 'different_destination']
        : ['different_destination', 'different_destination', 'different_destination'],
    }));
  });
  const first = pairTargets(scores);
  const second = pairTargets(scores);
  assert.equal(first.pairs[0].semantic_top_3_primary, 'tie');
  assert.equal(first.pairs[0].semantic_top_3_sensitivity, 'state_only_win');
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first) && Object.isFrozen(first.pairs[0]));
});
