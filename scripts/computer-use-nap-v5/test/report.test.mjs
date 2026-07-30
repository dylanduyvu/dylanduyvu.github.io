import assert from 'node:assert/strict';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import * as report from '../lib/report.mjs';
import { scoreSlot } from '../lib/scoring.mjs';

const STATE = 'state_only';
const HISTORY = 'state_plus_hybrid_history';
const LOCK_SHA256 = 'a'.repeat(64);

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

function slotIdentity(targetOrdinal, condition) {
  const slotOrdinal = ((targetOrdinal - 1) * 2) + (condition === STATE ? 1 : 2);
  return {
    slot_id: `NAP-V5-SLOT-${String(slotOrdinal).padStart(2, '0')}`,
    slot_ordinal: slotOrdinal,
    target_id: `NAP-V5-TARGET-${String(targetOrdinal).padStart(2, '0')}-R1`,
    target_ordinal: targetOrdinal,
    condition,
  };
}

function validInput(targetOrdinal, condition, overrides = {}) {
  return {
    ...slotIdentity(targetOrdinal, condition),
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
  };
}

function terminalScore(targetOrdinal, condition, terminalState) {
  return scoreSlot(validInput(targetOrdinal, condition, {
    terminal_state: terminalState,
    predictions: null,
    semantic_decisions: null,
    usefulness_decisions: null,
  }));
}

function completeScores(factory = (targetOrdinal, condition) => (
  scoreSlot(validInput(targetOrdinal, condition))
)) {
  return Array.from({ length: METHOD.targetCount }, (_, index) => index + 1)
    .flatMap((targetOrdinal) => [
      factory(targetOrdinal, STATE),
      factory(targetOrdinal, HISTORY),
    ]);
}

function attempt(attemptOrdinal, classification = 'valid_final', overrides = {}) {
  const inputTokens = 100 + attemptOrdinal;
  const outputTokens = 10 + attemptOrdinal;
  return {
    attempt_ordinal: attemptOrdinal,
    classification,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: inputTokens + outputTokens,
    latency_ms: 1_000 + attemptOrdinal,
    ...overrides,
  };
}

function operationsFor(scores, overrides = new Map()) {
  return scores.map((score) => {
    const replacement = overrides.get(score.slot_id);
    if (replacement !== undefined) {
      return {
        slot_id: score.slot_id,
        slot_ordinal: score.slot_ordinal,
        attempts: replacement,
      };
    }
    const attempts = score.terminal_state === 'infrastructure_failure'
      ? [
          attempt(1, 'infrastructure_retry'),
          attempt(2, 'infrastructure_retry'),
          attempt(3, 'infrastructure_retry'),
        ]
      : [
          attempt(
            1,
            score.terminal_state === 'terminal_invalid'
              ? 'terminal_invalid'
              : 'valid_final',
          ),
        ];
    return {
      slot_id: score.slot_id,
      slot_ordinal: score.slot_ordinal,
      attempts,
    };
  });
}

function packageInput({
  scores = completeScores(),
  adjudicator = 'dylan',
  proxyOnly = false,
  operationOverrides = new Map(),
} = {}) {
  return {
    adjudication: {
      adjudicator,
      proxy_only: proxyOnly,
      adjudication_lock_sha256: LOCK_SHA256,
    },
    slot_scores: scores,
    slot_operations: operationsFor(scores, operationOverrides),
  };
}

test('exports only the pure score-package builder and three report functions', () => {
  assert.deepEqual(Object.keys(report).sort(), [
    'buildScorePackage',
    'renderFinalReport',
    'renderPreliminaryReport',
    'validateInterpretationRecord',
  ]);
});

test('buildScorePackage requires exact verified-adjudication, score, and operation inputs', () => {
  assert.throws(
    () => report.buildScorePackage({ ...packageInput(), extra: true }),
    /exact|key|input|extra/i,
  );
  const badAdjudication = packageInput();
  badAdjudication.adjudication.extra = true;
  assert.throws(
    () => report.buildScorePackage(badAdjudication),
    /adjudication|exact|key|extra/i,
  );
  const badOperations = packageInput();
  badOperations.slot_operations[0].attempts[0].total_tokens += 1;
  assert.throws(
    () => report.buildScorePackage(badOperations),
    /token|total|sum/i,
  );
});

test('buildScorePackage materializes all 11 target rows in canonical order', () => {
  const scorePackage = report.buildScorePackage(packageInput());
  assert.equal(scorePackage.target_matrix.length, METHOD.targetCount);
  assert.deepEqual(
    scorePackage.target_matrix.map((row) => row.target_ordinal),
    Array.from({ length: METHOD.targetCount }, (_, index) => index + 1),
  );
  assert.deepEqual(
    scorePackage.target_matrix[10].target_id,
    'NAP-V5-TARGET-11-R1',
  );
  assert.ok(Object.isFrozen(scorePackage));
  assert.ok(Object.isFrozen(scorePackage.target_matrix[0]));
});

test('target matrix pairs semantic top-1 and top-3 independently', () => {
  const scores = completeScores((targetOrdinal, condition) => {
    if (targetOrdinal !== 1 || condition !== STATE) {
      return scoreSlot(validInput(targetOrdinal, condition));
    }
    return scoreSlot(validInput(targetOrdinal, condition, {
      predictions: [
        prediction(1, { app: 'Safari' }),
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
  });
  const row = report.buildScorePackage(packageInput({ scores })).target_matrix[0];
  assert.equal(row.paired_outcomes.semantic_top_1_primary, 'history_win');
  assert.equal(row.paired_outcomes.semantic_top_3_primary, 'tie');
  assert.equal(
    row.paired_outcomes.semantic_top_1_sensitivity,
    'history_win',
  );
});

test('target matrix pairs structured normalized-exact top-1 and top-3 independently', () => {
  const scores = completeScores((targetOrdinal, condition) => {
    if (targetOrdinal !== 1 || condition !== STATE) {
      return scoreSlot(validInput(targetOrdinal, condition));
    }
    return scoreSlot(validInput(targetOrdinal, condition, {
      predictions: [
        prediction(1, { app: 'Safari' }),
        prediction(2),
        prediction(3, {
          app: 'Arc',
          object: 'Inbox',
          subtarget: null,
          action_type: 'focus',
        }),
      ],
      semantic_decisions: ['same_destination', 'different_destination', null],
    }));
  });
  const row = report.buildScorePackage(packageInput({ scores })).target_matrix[0];
  assert.equal(
    row.paired_outcomes.structured_normalized_exact_top_1,
    'history_win',
  );
  assert.equal(
    row.paired_outcomes.structured_normalized_exact_top_3,
    'tie',
  );
});

test('each matrix slot accounts for attempts retries invalids tokens and latency', () => {
  const scores = completeScores((targetOrdinal, condition) => (
    targetOrdinal === 1 && condition === STATE
      ? terminalScore(targetOrdinal, condition, 'terminal_invalid')
      : scoreSlot(validInput(targetOrdinal, condition))
  ));
  const overrides = new Map([[
    'NAP-V5-SLOT-02',
    [
      attempt(1, 'infrastructure_retry'),
      attempt(2, 'valid_final'),
    ],
  ]]);
  const row = report.buildScorePackage(packageInput({
    scores,
    operationOverrides: overrides,
  })).target_matrix[0];
  assert.deepEqual(row.state_only.operations, {
    attempt_count: 1,
    retry_count: 0,
    invalid_attempt_count: 1,
    infrastructure_retry_attempt_count: 0,
    input_tokens: 101,
    output_tokens: 11,
    total_tokens: 112,
    token_usage_missing_attempts: 0,
    latency_ms: 1001,
    latency_missing_attempts: 0,
  });
  assert.equal(row.state_plus_hybrid_history.operations.attempt_count, 2);
  assert.equal(row.state_plus_hybrid_history.operations.retry_count, 1);
});

test('operational summary totals telemetry and explicitly counts missing measurements', () => {
  const scores = completeScores();
  const overrides = new Map([[
    'NAP-V5-SLOT-01',
    [
      attempt(1, 'infrastructure_retry', {
        input_tokens: null,
        output_tokens: null,
        total_tokens: null,
        latency_ms: null,
      }),
      attempt(2, 'valid_final'),
    ],
  ]]);
  const summary = report.buildScorePackage(packageInput({
    scores,
    operationOverrides: overrides,
  })).operational_summary;
  assert.equal(summary.scheduled_slots, METHOD.scheduledSlotCount);
  assert.equal(summary.total_attempts, METHOD.scheduledSlotCount + 1);
  assert.equal(summary.retry_count, 1);
  assert.equal(summary.token_usage_missing_attempts, 1);
  assert.equal(summary.latency_missing_attempts, 1);
  assert.ok(summary.total_tokens > 0);
  assert.ok(summary.total_latency_ms > 0);
});

test('history-depth bands are fixed five-target descriptive and confounded readouts', () => {
  const scorePackage = report.buildScorePackage(packageInput());
  assert.deepEqual(
    scorePackage.depth_bands.map((band) => ({
      band: band.band,
      targets: band.target_ordinals,
      status: band.interpretation_status,
    })),
    [
      {
        band: 'shallow',
        targets: [1, 2, 3, 4, 5],
        status: 'descriptive_confounded',
      },
      {
        band: 'medium',
        targets: [6, 7, 8, 9, 10],
        status: 'descriptive_confounded',
      },
      {
        band: 'deep',
        targets: [11],
        status: 'descriptive_confounded',
      },
    ],
  );
  assert.equal(
    scorePackage.depth_bands[0].conditions[HISTORY]
      .metrics.semantic_same_destination.top_3.primary.successes,
    5,
  );
});

test('validateInterpretationRecord enforces exact keys frozen bands and bounded rationale', () => {
  const scorePackage = report.buildScorePackage(packageInput());
  const valid = {
    adjudicator: 'dylan',
    band: 'promising',
    would_want_router: false,
    rationale: 'history wins are useful, but not yet routine.',
  };
  assert.deepEqual(report.validateInterpretationRecord(valid, scorePackage), valid);
  assert.throws(
    () => report.validateInterpretationRecord({ ...valid, threshold: 0.7 }, scorePackage),
    /exact|key|threshold/i,
  );
  assert.throws(
    () => report.validateInterpretationRecord({ ...valid, band: 'great' }, scorePackage),
    /band|frozen/i,
  );
  assert.throws(
    () => report.validateInterpretationRecord({ ...valid, rationale: 'x'.repeat(2_001) }, scorePackage),
    /rationale|2.?000|bounded/i,
  );
});

test('fewer than 9 scorable pairs forces a null qualitative band', () => {
  const scores = completeScores((targetOrdinal, condition) => (
    targetOrdinal <= 3 && condition === HISTORY
      ? terminalScore(targetOrdinal, condition, 'infrastructure_failure')
      : scoreSlot(validInput(targetOrdinal, condition))
  ));
  const scorePackage = report.buildScorePackage(packageInput({ scores }));
  assert.equal(scorePackage.pair_aggregates.semantic_top_3_primary.scorable_pairs, 8);
  assert.throws(
    () => report.validateInterpretationRecord({
      adjudicator: 'dylan',
      band: 'promising',
      would_want_router: true,
      rationale: 'not enough scorable pairs',
    }, scorePackage),
    /9|scorable|null|band/i,
  );
  assert.equal(report.validateInterpretationRecord({
    adjudicator: 'dylan',
    band: null,
    would_want_router: null,
    rationale: 'operational readout only because three pairs were unscorable.',
  }, scorePackage).band, null);
});

test('demo-worthy requires Dylan adjudication and a true router preference', () => {
  const scorePackage = report.buildScorePackage(packageInput());
  assert.throws(
    () => report.validateInterpretationRecord({
      adjudicator: 'dylan',
      band: 'demo-worthy',
      would_want_router: false,
      rationale: 'useful but not wanted',
    }, scorePackage),
    /demo|router|true/i,
  );
  assert.equal(report.validateInterpretationRecord({
    adjudicator: 'dylan',
    band: 'demo-worthy',
    would_want_router: true,
    rationale: 'i would want the router during normal work.',
  }, scorePackage).band, 'demo-worthy');
});

test('proxy interpretation must match the proxy gate and cannot answer for Dylan', () => {
  const scorePackage = report.buildScorePackage(packageInput({
    adjudicator: 'codex_proxy',
    proxyOnly: true,
  }));
  assert.throws(
    () => report.validateInterpretationRecord({
      adjudicator: 'dylan',
      band: 'promising',
      would_want_router: true,
      rationale: 'wrong adjudicator',
    }, scorePackage),
    /adjudicator|proxy|gate/i,
  );
  assert.throws(
    () => report.validateInterpretationRecord({
      adjudicator: 'codex_proxy',
      band: 'promising',
      would_want_router: false,
      rationale: 'proxy cannot answer this',
    }, scorePackage),
    /proxy|router|null|dylan/i,
  );
});

test('preliminary report renders both denominators and every target matrix row', () => {
  const text = report.renderPreliminaryReport(
    report.buildScorePackage(packageInput()),
  );
  assert.match(text, /scheduled.*11/i);
  assert.match(text, /model-scorable.*11/i);
  assert.match(text, /semantic top-1/i);
  assert.match(text, /semantic top-3/i);
  assert.match(text, /structured exact top-1/i);
  assert.match(text, /structured exact top-3/i);
  assert.match(text, /action type top-1/i);
  assert.match(text, /action type top-3/i);
  assert.match(text, /structured exact-action top-1/i);
  assert.match(text, /structured exact-action top-3/i);
  assert.match(text, /shortcut usefulness top-1.*primary/i);
  assert.match(text, /shortcut usefulness top-3.*sensitivity/i);
  for (let ordinal = 1; ordinal <= METHOD.targetCount; ordinal += 1) {
    assert.match(
      text,
      new RegExp(`NAP-V5-TARGET-${String(ordinal).padStart(2, '0')}-R1`, 'u'),
    );
  }
});

test('preliminary report discloses operations depth confounding and residual CLI schema exposure', () => {
  const text = report.renderPreliminaryReport(
    report.buildScorePackage(packageInput()),
  );
  assert.match(text, /attempts/i);
  assert.match(text, /tokens/i);
  assert.match(text, /latency/i);
  assert.match(text, /invalid/i);
  assert.match(text, /retr(?:y|ies)/i);
  assert.match(text, /shallow/i);
  assert.match(text, /medium/i);
  assert.match(text, /deep/i);
  assert.match(text, /descriptive.*confounded/i);
  assert.match(text, /residual.*CLI.*tool.schema.*expos/i);
  assert.match(text, /V3.*V4.*not numerically compared/i);
  assert.doesNotMatch(text, /V[34][^\n]*(?:\d+%|\d+\/\d+)/u);
});

test('preliminary score package and report never invent a qualitative interpretation', () => {
  const scorePackage = report.buildScorePackage(packageInput());
  assert.deepEqual(scorePackage.interpretation, {
    official_product_band: null,
    official_would_want_router: null,
    proxy_sensitivity_interpretation: null,
  });
  const text = report.renderPreliminaryReport(scorePackage);
  assert.match(text, /no qualitative interpretation/i);
  assert.doesNotMatch(
    text,
    /Official product band:\s*(negative|weak-or-mixed|promising|demo-worthy)/iu,
  );
});

test('final report places Dylan interpretation in the official product fields', () => {
  const scorePackage = report.buildScorePackage(packageInput());
  const text = report.renderFinalReport(scorePackage, {
    adjudicator: 'dylan',
    band: 'promising',
    would_want_router: true,
    rationale: 'the paired advantage is clear enough for another live test.',
  });
  assert.match(text, /Official product band:\s*promising/i);
  assert.match(text, /Would Dylan want the router:\s*yes/i);
  assert.match(text, /Proxy sensitivity interpretation:\s*unavailable/i);
  assert.match(text, /paired advantage is clear/i);
});

test('final report keeps proxy interpretation nonofficial and official product fields null', () => {
  const scorePackage = report.buildScorePackage(packageInput({
    adjudicator: 'codex_proxy',
    proxyOnly: true,
  }));
  const text = report.renderFinalReport(scorePackage, {
    adjudicator: 'codex_proxy',
    band: 'promising',
    would_want_router: null,
    rationale: 'proxy review sees a clear paired advantage.',
  });
  assert.match(text, /Official product band:\s*unavailable.*proxy-only/i);
  assert.match(text, /Would Dylan want the router:\s*unavailable/i);
  assert.match(text, /Proxy sensitivity interpretation:\s*promising/i);
  assert.doesNotMatch(text, /Official product band:\s*promising/i);
});

test('package and report rendering are deterministic and do not mutate caller inputs', () => {
  const input = packageInput();
  const before = structuredClone(input);
  const first = report.buildScorePackage(input);
  const second = report.buildScorePackage(input);
  assert.deepEqual(first, second);
  assert.deepEqual(input, before);
  assert.equal(report.renderPreliminaryReport(first), report.renderPreliminaryReport(second));
  const interpretation = {
    adjudicator: 'dylan',
    band: 'weak-or-mixed',
    would_want_router: false,
    rationale: 'mixed results need another frozen run.',
  };
  assert.equal(
    report.renderFinalReport(first, interpretation),
    report.renderFinalReport(second, interpretation),
  );
});
