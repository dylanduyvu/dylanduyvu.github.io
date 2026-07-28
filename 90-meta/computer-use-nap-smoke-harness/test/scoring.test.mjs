import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertPairReadyForLabel,
  comparePair,
  hasBothConditionAttempts,
  normalizeComparedString,
  predictionMatchesTarget,
  scoreAttempt,
  summarizeConditionScores,
  summarizePairedComparisons,
  summarizeScores,
} from '../lib/scoring.mjs';

const frozenLabel = Object.freeze({
  target: Object.freeze({
    app: 'Arc',
    object: 'Twitter webpage',
    subtarget: 'Home control',
  }),
  accepted_aliases: Object.freeze({
    app: Object.freeze(['The Browser']),
    object: Object.freeze(['X web page']),
    subtarget: Object.freeze(['Home button']),
  }),
});
const frozenScoringLabel = Object.freeze({
  event_id: 'BLOG-CAND-022',
  row_version: 2,
  target: frozenLabel.target,
  accepted_aliases: frozenLabel.accepted_aliases,
});

function prediction(options = {}) {
  const {
    rank = 1,
    app = 'Arc',
    object = 'Twitter webpage',
    subtarget = 'Home control',
    reason = 'visible target',
  } = options;
  const canonicalLabel = Object.hasOwn(options, 'canonical_label')
    ? options.canonical_label
    : (
      subtarget === null
        ? `${app} -> ${object}`
        : `${app} -> ${object} -> ${subtarget}`
    );
  return {
    rank,
    app,
    object,
    subtarget,
    canonical_label: canonicalLabel,
    reason,
  };
}

function attempt({
  run_id = 'BLOG-SMOKE-20260728-V2',
  dataset_snapshot_id = 'BLOG-MINI-20-V2',
  manifest_id = 'MINI-20-20260728-V2',
  event_id = 'BLOG-CAND-022',
  event_row_version = 2,
  paired_target_ordinal = 15,
  condition = 'state_only',
  status = 'valid_prediction',
  ranked_predictions = [prediction()],
  prediction_saved_at_utc = status === 'valid_prediction'
    ? '2026-07-28T20:59:59.000Z'
    : null,
  attempt_saved_at_utc = '2026-07-28T21:00:00.000Z',
} = {}) {
  return {
    run_id,
    dataset_snapshot_id,
    manifest_id,
    event_id,
    event_row_version,
    paired_target_ordinal,
    condition,
    attempt_status: status,
    ranked_predictions,
    prediction_saved_at_utc,
    attempt_saved_at_utc,
  };
}

function scored({
  event_id = 'BLOG-CAND-022',
  condition = 'state_only',
  status = 'valid_prediction',
  top_1_correct = true,
  top_3_correct = true,
} = {}) {
  return {
    event_id,
    condition,
    attempt_status: status,
    exact_top_1: top_1_correct,
    exact_top_3: top_3_correct,
  };
}

test('normalizes only case and whitespace', () => {
  assert.equal(normalizeComparedString(' \tTwitter   WEBPAGE\n'), 'twitter webpage');
  assert.equal(normalizeComparedString('Home-control'), 'home-control');
  assert.notEqual(normalizeComparedString('Home-control'), normalizeComparedString('Home control'));
  assert.throws(() => normalizeComparedString(null), /string/i);
  assert.throws(() => normalizeComparedString(' \n '), /nonempty/i);
});

test('matches app, object, and non-null subtarget independently against canonical values or frozen aliases', () => {
  assert.equal(
    predictionMatchesTarget(
      prediction({
        app: ' the   browser ',
        object: '\nX WEB PAGE ',
        subtarget: ' home  BUTTON ',
      }),
      frozenLabel,
    ),
    true,
  );
  assert.equal(
    predictionMatchesTarget(
      prediction({ app: 'Arc', object: 'X web page', subtarget: 'Home control' }),
      frozenLabel,
    ),
    true,
  );
  assert.equal(
    predictionMatchesTarget(
      prediction({ app: 'The Browser', object: 'Twitter webpage', subtarget: 'Home button' }),
      frozenLabel,
    ),
    true,
  );
});

test('rejects exact component mismatches without fuzzy, substring, or semantic matching', () => {
  assert.equal(
    predictionMatchesTarget(
      prediction({ app: 'Arc Browser', object: 'Twitter webpage', subtarget: 'Home control' }),
      frozenLabel,
    ),
    false,
  );
  assert.equal(
    predictionMatchesTarget(
      prediction({ app: 'Arc', object: 'Twitter', subtarget: 'Home control' }),
      frozenLabel,
    ),
    false,
  );
  assert.equal(
    predictionMatchesTarget(
      prediction({ app: 'Arc', object: 'Twitter webpage', subtarget: 'Go home' }),
      frozenLabel,
    ),
    false,
  );
});

test('ignores a predicted subtarget only when the frozen subtarget is null', () => {
  const nullSubtargetLabel = {
    target: { app: 'Codex', object: 'Patch NAP blog prep in vault', subtarget: null },
    accepted_aliases: { app: [], object: [], subtarget: [] },
  };
  assert.equal(
    predictionMatchesTarget(
      prediction({
        app: ' codex ',
        object: 'Patch NAP blog prep in vault',
        subtarget: 'composer',
      }),
      nullSubtargetLabel,
    ),
    true,
  );
  assert.equal(
    predictionMatchesTarget(
      prediction({
        app: 'Codex',
        object: 'Patch NAP blog prep in vault',
        subtarget: null,
      }),
      nullSubtargetLabel,
    ),
    true,
  );
  assert.equal(
    predictionMatchesTarget(
      prediction({ app: 'Arc', object: 'Twitter webpage', subtarget: null }),
      frozenLabel,
    ),
    false,
  );
});

test('scores exact rank order for top-1 and top-3 without mutating inputs', () => {
  const inputAttempt = attempt({
    ranked_predictions: [
      prediction({ rank: 1, object: 'wrong object' }),
      prediction({ rank: 2, app: 'The Browser', object: 'X web page', subtarget: 'Home button' }),
      prediction({ rank: 3, subtarget: 'Notifications control' }),
    ],
  });
  const originalAttempt = structuredClone(inputAttempt);
  const originalLabel = structuredClone(frozenLabel);

  const result = scoreAttempt(inputAttempt, frozenScoringLabel);

  assert.deepEqual(result, {
    event_id: 'BLOG-CAND-022',
    condition: 'state_only',
    attempt_status: 'valid_prediction',
    exact_top_1: false,
    exact_top_3: true,
  });
  assert.deepEqual(inputAttempt, originalAttempt);
  assert.deepEqual(frozenLabel, originalLabel);
  assert.ok(Object.isFrozen(result));
});

test('scores the persisted attempt prediction shape with canonical_label', () => {
  const persistedAttempt = attempt({
    ranked_predictions: [{
      rank: 1,
      app: 'Arc',
      object: 'Twitter webpage',
      subtarget: 'Home control',
      canonical_label: 'Arc -> Twitter webpage -> Home control',
      reason: 'visible target',
    }],
  });

  assert.deepEqual(
    scoreAttempt(persistedAttempt, frozenScoringLabel),
    {
      event_id: 'BLOG-CAND-022',
      condition: 'state_only',
      attempt_status: 'valid_prediction',
      exact_top_1: true,
      exact_top_3: true,
    },
  );
});

test('requires canonical_label and rejects mechanically inconsistent values', () => {
  const {
    canonical_label: ignoredCanonicalLabel,
    ...missingCanonicalLabel
  } = prediction();
  assert.throws(
    () => predictionMatchesTarget(missingCanonicalLabel, frozenLabel),
    /prediction.*keys/i,
  );
  assert.throws(
    () => predictionMatchesTarget(
      prediction({ canonical_label: 'Arc -> wrong' }),
      frozenLabel,
    ),
    /canonical_label.*mechanical/i,
  );
  assert.equal(
    ignoredCanonicalLabel,
    'Arc -> Twitter webpage -> Home control',
  );
});

test('scores top-1 true when rank one matches and top-3 false only when no rank matches', () => {
  assert.deepEqual(
    scoreAttempt(attempt(), frozenScoringLabel),
    {
      event_id: 'BLOG-CAND-022',
      condition: 'state_only',
      attempt_status: 'valid_prediction',
      exact_top_1: true,
      exact_top_3: true,
    },
  );
  assert.deepEqual(
    scoreAttempt(
      attempt({
        ranked_predictions: [
          prediction({ rank: 1, object: 'wrong 1' }),
          prediction({ rank: 2, object: 'wrong 2' }),
          prediction({ rank: 3, object: 'wrong 3' }),
        ],
      }),
      frozenScoringLabel,
    ),
    {
      event_id: 'BLOG-CAND-022',
      condition: 'state_only',
      attempt_status: 'valid_prediction',
      exact_top_1: false,
      exact_top_3: false,
    },
  );
});

test('scoreAttempt requires and verifies frozen row identity while low-level matching remains target-only', () => {
  assert.equal(predictionMatchesTarget(prediction(), frozenLabel), true);
  assert.throws(
    () => scoreAttempt(attempt(), frozenLabel),
    /label\.event_id/i,
  );
  assert.throws(
    () => scoreAttempt(
      attempt(),
      { ...frozenScoringLabel, event_id: 'BLOG-CAND-023' },
    ),
    /event/i,
  );
  assert.throws(
    () => scoreAttempt(
      attempt(),
      { ...frozenScoringLabel, row_version: 3 },
    ),
    /version/i,
  );
  const {
    row_version: ignoredRowVersion,
    ...explicitVersionLabel
  } = frozenScoringLabel;
  assert.deepEqual(
    scoreAttempt(
      attempt(),
      { ...explicitVersionLabel, event_row_version: 2 },
    ),
    {
      event_id: 'BLOG-CAND-022',
      condition: 'state_only',
      attempt_status: 'valid_prediction',
      exact_top_1: true,
      exact_top_3: true,
    },
  );
  assert.equal(ignoredRowVersion, 2);
});

test('scores invalid tool/schema attempts false and infrastructure failures null', () => {
  for (const status of ['invalid_tool_use', 'invalid_schema']) {
    assert.deepEqual(
      scoreAttempt(attempt({ status, ranked_predictions: [] }), frozenScoringLabel),
      {
        event_id: 'BLOG-CAND-022',
        condition: 'state_only',
        attempt_status: status,
        exact_top_1: false,
        exact_top_3: false,
      },
    );
  }
  assert.deepEqual(
    scoreAttempt(
      attempt({ status: 'infrastructure_failure', ranked_predictions: [] }),
      frozenScoringLabel,
    ),
    {
      event_id: 'BLOG-CAND-022',
      condition: 'state_only',
      attempt_status: 'infrastructure_failure',
      exact_top_1: null,
      exact_top_3: null,
    },
  );
});

test('stores exact per-condition numerators and denominators with infrastructure excluded', () => {
  const scores = [
    scored(),
    scored({ event_id: 'BLOG-CAND-023', top_1_correct: false, top_3_correct: true }),
    scored({
      event_id: 'BLOG-CAND-024',
      status: 'invalid_schema',
      top_1_correct: false,
      top_3_correct: false,
    }),
    scored({
      event_id: 'BLOG-CAND-026',
      status: 'infrastructure_failure',
      top_1_correct: null,
      top_3_correct: null,
    }),
  ];

  const summary = summarizeConditionScores(scores, 'state_only');
  assert.deepEqual(summary, {
    condition: 'state_only',
    attempts: {
      total: 4,
      valid_prediction: 2,
      invalid_tool_use: 0,
      invalid_schema: 1,
      infrastructure_failure: 1,
    },
    top_1: { numerator: 1, denominator: 3 },
    top_3: { numerator: 2, denominator: 3 },
  });
  assert.ok(Object.isFrozen(summary));
  assert.ok(Object.isFrozen(summary.attempts));
  assert.ok(Object.isFrozen(summary.top_1));
  assert.ok(Object.isFrozen(summary.top_3));
});

test('groups exact score totals by both frozen conditions', () => {
  const all = [
    scored(),
    scored({
      event_id: 'BLOG-CAND-022',
      condition: 'state_plus_all_prior',
      top_1_correct: false,
      top_3_correct: true,
    }),
  ];
  const summary = summarizeScores(all);
  assert.deepEqual(summary, {
    state_only: {
      condition: 'state_only',
      attempts: {
        total: 1,
        valid_prediction: 1,
        invalid_tool_use: 0,
        invalid_schema: 0,
        infrastructure_failure: 0,
      },
      top_1: { numerator: 1, denominator: 1 },
      top_3: { numerator: 1, denominator: 1 },
    },
    state_plus_all_prior: {
      condition: 'state_plus_all_prior',
      attempts: {
        total: 1,
        valid_prediction: 1,
        invalid_tool_use: 0,
        invalid_schema: 0,
        infrastructure_failure: 0,
      },
      top_1: { numerator: 0, denominator: 1 },
      top_3: { numerator: 1, denominator: 1 },
    },
  });
  assert.ok(Object.isFrozen(summary));
  assert.ok(Object.isFrozen(summary.state_only));
  assert.ok(Object.isFrozen(summary.state_plus_all_prior));
});

test('derives every paired top-1 and top-3 win/loss/tie outcome for history versus state-only', () => {
  const cases = [
    [false, true, 'win'],
    [true, false, 'loss'],
    [true, true, 'tie'],
    [false, false, 'tie'],
  ];
  for (const [stateCorrect, historyCorrect, expected] of cases) {
    const comparison = comparePair({
      state_only: scored({
        top_1_correct: stateCorrect,
        top_3_correct: stateCorrect,
      }),
      state_plus_all_prior: scored({
        condition: 'state_plus_all_prior',
        top_1_correct: historyCorrect,
        top_3_correct: historyCorrect,
      }),
    });
    assert.equal(comparison.top_1, expected);
    assert.equal(comparison.top_3, expected);
    assert.equal(comparison.excluded, false);
  }
});

test('excludes a pair at both ranks if either condition is infrastructure-null', () => {
  for (const infrastructureCondition of ['state_only', 'state_plus_all_prior']) {
    const pair = {
      state_only: scored(),
      state_plus_all_prior: scored({ condition: 'state_plus_all_prior' }),
    };
    pair[infrastructureCondition] = scored({
      condition: infrastructureCondition,
      status: 'infrastructure_failure',
      top_1_correct: null,
      top_3_correct: null,
    });
    assert.deepEqual(comparePair(pair), {
      event_id: 'BLOG-CAND-022',
      excluded: true,
      top_1: null,
      top_3: null,
    });
  }
});

test('reconciles paired totals and exact denominators', () => {
  const comparisons = [
    { event_id: '1', excluded: false, top_1: 'win', top_3: 'win' },
    { event_id: '2', excluded: false, top_1: 'loss', top_3: 'tie' },
    { event_id: '3', excluded: false, top_1: 'tie', top_3: 'loss' },
    { event_id: '4', excluded: true, top_1: null, top_3: null },
  ];
  const summary = summarizePairedComparisons(comparisons);
  assert.deepEqual(summary, {
    pairs: { total: 4, included: 3, excluded: 1 },
    top_1: { wins: 1, losses: 1, ties: 1, denominator: 3 },
    top_3: { wins: 1, losses: 1, ties: 1, denominator: 3 },
  });
  assert.ok(Object.isFrozen(summary));
  assert.ok(Object.isFrozen(summary.pairs));
  assert.ok(Object.isFrozen(summary.top_1));
  assert.ok(Object.isFrozen(summary.top_3));
});

test('gates label revelation until both distinct persisted condition attempts exist', () => {
  const stateOnly = attempt();
  const history = attempt({ condition: 'state_plus_all_prior' });
  assert.equal(hasBothConditionAttempts([]), false);
  assert.equal(hasBothConditionAttempts([stateOnly]), false);
  assert.equal(hasBothConditionAttempts([stateOnly, history]), true);
  const gate = assertPairReadyForLabel([history, stateOnly]);
  assert.deepEqual(gate, {
    run_id: 'BLOG-SMOKE-20260728-V2',
    dataset_snapshot_id: 'BLOG-MINI-20-V2',
    manifest_id: 'MINI-20-20260728-V2',
    event_id: 'BLOG-CAND-022',
    event_row_version: 2,
    paired_target_ordinal: 15,
    state_only: stateOnly,
    state_plus_all_prior: history,
  });
  assert.ok(Object.isFrozen(gate));
  assert.ok(Object.isFrozen(gate.state_only));
  assert.ok(Object.isFrozen(gate.state_only.ranked_predictions));
  assert.ok(Object.isFrozen(gate.state_only.ranked_predictions[0]));
  assert.ok(Object.isFrozen(gate.state_plus_all_prior));
  assert.ok(Object.isFrozen(gate.state_plus_all_prior.ranked_predictions));
  assert.ok(Object.isFrozen(gate.state_plus_all_prior.ranked_predictions[0]));

  assert.equal(
    hasBothConditionAttempts([
      stateOnly,
      { ...history, attempt_saved_at_utc: undefined },
    ]),
    false,
  );
  assert.equal(
    hasBothConditionAttempts([
      stateOnly,
      { ...history, prediction_saved_at_utc: null },
    ]),
    false,
  );
  assert.equal(
    hasBothConditionAttempts([
      stateOnly,
      {
        ...history,
        prediction_saved_at_utc: '2026-07-28T21:00:01.000Z',
      },
    ]),
    false,
  );
  assert.equal(hasBothConditionAttempts([stateOnly, { ...history, event_id: 'other' }]), false);
  assert.equal(hasBothConditionAttempts([stateOnly, { ...stateOnly }]), false);
  assert.throws(() => assertPairReadyForLabel([stateOnly]), /both.*attempt/i);
});

test('pair gate requires equal canonical pair identity on both persisted attempts', () => {
  const stateOnly = attempt();
  const history = attempt({ condition: 'state_plus_all_prior' });
  const mismatches = {
    run_id: 'other-run',
    dataset_snapshot_id: 'other-dataset',
    manifest_id: 'other-manifest',
    event_id: 'BLOG-CAND-999',
    event_row_version: 3,
    paired_target_ordinal: 16,
  };
  for (const [field, changedValue] of Object.entries(mismatches)) {
    assert.equal(
      hasBothConditionAttempts([
        stateOnly,
        { ...history, [field]: changedValue },
      ]),
      false,
      field,
    );
    assert.throws(
      () => assertPairReadyForLabel([
        stateOnly,
        { ...history, [field]: changedValue },
      ]),
      new RegExp(field),
    );
  }
  for (const [field, invalidValue] of [
    ['run_id', ''],
    ['dataset_snapshot_id', null],
    ['manifest_id', 7],
    ['event_id', ''],
    ['event_row_version', 0],
    ['paired_target_ordinal', 1.5],
  ]) {
    assert.equal(
      hasBothConditionAttempts([
        { ...stateOnly, [field]: invalidValue },
        history,
      ]),
      false,
      `${field} shape`,
    );
  }
});

test('pair gate accepts only real canonical millisecond UTC persistence timestamps', () => {
  const stateOnly = attempt();
  const history = attempt({ condition: 'state_plus_all_prior' });
  for (const badTimestamp of [
    '0',
    '1',
    '2026-07-28T21:00:00Z',
    '2026-07-28T17:00:00.000-04:00',
    '2026-02-30T21:00:00.000Z',
  ]) {
    assert.equal(
      hasBothConditionAttempts([
        { ...stateOnly, attempt_saved_at_utc: badTimestamp },
        history,
      ]),
      false,
      `attempt timestamp ${badTimestamp}`,
    );
    assert.equal(
      hasBothConditionAttempts([
        { ...stateOnly, prediction_saved_at_utc: badTimestamp },
        history,
      ]),
      false,
      `prediction timestamp ${badTimestamp}`,
    );
  }
  assert.throws(
    () => assertPairReadyForLabel([
      { ...stateOnly, attempt_saved_at_utc: '0' },
      history,
    ]),
    /canonical.*UTC|timestamp/i,
  );
});

test('fails closed on malformed labels, attempts, scores, statuses, ranks, and conditions', () => {
  assert.throws(
    () => predictionMatchesTarget(prediction(), {
      target: { app: 'Arc', object: 'Twitter webpage', subtarget: 'Home control' },
      accepted_aliases: { app: ['Arc Browser'], object: [], subtarget: 'Home button' },
    }),
    /accepted_aliases\.subtarget/i,
  );
  assert.throws(
    () => predictionMatchesTarget(prediction(), {
      target: { app: 'Arc', object: 'Twitter webpage', subtarget: 'Home control' },
      accepted_aliases: { app: [''], object: [], subtarget: [] },
    }),
    /nonempty/i,
  );
  assert.throws(
    () => predictionMatchesTarget(
      { ...prediction(), confidence: 0.9 },
      frozenLabel,
    ),
    /prediction.*keys/i,
  );
  assert.throws(
    () => predictionMatchesTarget(prediction(), {
      target: {
        app: 'Arc',
        object: 'Twitter webpage',
        subtarget: 'Home control',
        prediction_derived_alias: 'home',
      },
      accepted_aliases: { app: [], object: [], subtarget: [] },
    }),
    /target.*keys/i,
  );
  assert.throws(
    () => scoreAttempt(attempt({ status: 'valid' }), frozenScoringLabel),
    /status/i,
  );
  assert.throws(
    () => scoreAttempt(attempt({ condition: 'history' }), frozenScoringLabel),
    /condition/i,
  );
  assert.throws(
    () => scoreAttempt(
      attempt({
        ranked_predictions: [
          prediction({ rank: 1 }),
          prediction({ rank: 3 }),
        ],
      }),
      frozenScoringLabel,
    ),
    /consecutive/i,
  );
  assert.throws(
    () => predictionMatchesTarget(
      prediction({ rank: 0 }),
      frozenLabel,
    ),
    /rank/i,
  );
  assert.throws(
    () => scoreAttempt(attempt({ status: 'invalid_schema' }), frozenScoringLabel),
    /ranked_predictions.*empty/i,
  );
  assert.throws(
    () => summarizeConditionScores([
      scored({ top_1_correct: null, top_3_correct: null }),
    ], 'state_only'),
    /null.*infrastructure/i,
  );
  assert.throws(
    () => summarizeConditionScores([
      scored({ top_1_correct: true, top_3_correct: false }),
    ], 'state_only'),
    /top-1.*top-3/i,
  );
  assert.throws(
    () => comparePair({
      state_only: scored(),
      state_plus_all_prior: scored({
        event_id: 'different',
        condition: 'state_plus_all_prior',
      }),
    }),
    /same event/i,
  );
  assert.throws(
    () => summarizePairedComparisons([
      { event_id: '1', excluded: false, top_1: 'almost', top_3: 'tie' },
    ]),
    /outcome/i,
  );
  for (const [top1, top3] of [
    ['loss', 'win'],
    ['win', 'loss'],
  ]) {
    assert.throws(
      () => summarizePairedComparisons([
        { event_id: '1', excluded: false, top_1: top1, top_3: top3 },
      ]),
      /revers/i,
    );
  }
  assert.throws(
    () => summarizeConditionScores([
      scored(),
      scored(),
    ], 'state_only'),
    /duplicate/i,
  );
  assert.throws(
    () => summarizePairedComparisons([
      { event_id: '1', excluded: false, top_1: 'tie', top_3: 'tie' },
      { event_id: '1', excluded: false, top_1: 'tie', top_3: 'tie' },
    ]),
    /duplicate/i,
  );
});
