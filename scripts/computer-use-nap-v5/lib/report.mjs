import { CONDITIONS, METHOD } from '../config.mjs';
import { aggregateConditions, pairTargets } from './scoring.mjs';

const INPUT_KEYS = ['adjudication', 'slot_scores', 'slot_operations'];
const ADJUDICATION_KEYS = [
  'adjudicator',
  'proxy_only',
  'adjudication_lock_sha256',
];
const OPERATION_KEYS = ['slot_id', 'slot_ordinal', 'attempts'];
const ATTEMPT_KEYS = [
  'attempt_ordinal',
  'classification',
  'input_tokens',
  'output_tokens',
  'total_tokens',
  'latency_ms',
];
const INTERPRETATION_KEYS = [
  'adjudicator',
  'band',
  'would_want_router',
  'rationale',
];
const PACKAGE_KEYS = [
  'version',
  'adjudication',
  'condition_aggregates',
  'pair_aggregates',
  'target_matrix',
  'depth_bands',
  'operational_summary',
  'interpretation',
  'method_limitations',
];
const SCORE_FAMILIES = [
  'semantic_same_destination',
  'structured_normalized_exact',
  'action_type',
  'structured_exact_action',
  'shortcut_usefulness',
];
const ANALYZED_FAMILIES = new Set([
  'semantic_same_destination',
  'shortcut_usefulness',
]);
const PAIRED_METRICS = [
  'semantic_top_1_primary',
  'semantic_top_1_sensitivity',
  'semantic_top_3_primary',
  'semantic_top_3_sensitivity',
  'structured_normalized_exact_top_1',
  'structured_normalized_exact_top_3',
];
const OUTCOMES = [
  'history_win',
  'state_only_win',
  'tie',
  'unscorable_pair',
];
const CLASSIFICATIONS = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_retry',
]);
const INTERPRETATION_BANDS = new Set([
  'negative',
  'weak-or-mixed',
  'promising',
  'demo-worthy',
]);
const SHA256 = /^[0-9a-f]{64}$/u;
const SLOT_ID = /^NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])$/u;
const TARGET_ID = /^NAP-V5-TARGET-(?:0[1-9]|1[01])-R1$/u;
const QUALITATIVE_PAIR_FLOOR = 9;
const DEPTH_BANDS = Object.freeze([
  Object.freeze({ band: 'shallow', first: 1, last: 5 }),
  Object.freeze({ band: 'medium', first: 6, last: 10 }),
  Object.freeze({ band: 'deep', first: 11, last: 11 }),
]);
const LIMITATIONS = Object.freeze({
  residual_cli_tool_schema_exposure: 'possible',
  disclosure: 'Residual CLI tool-schema exposure remains possible because the available CLI has no universal hard tools=[] switch; identical isolation and terminal tool-use rejection apply to both conditions.',
  v3_v4_numeric_comparison: 'prohibited',
});

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, expected, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length
    || actual.some((key, index) => key !== wanted[index])) {
    throw new Error(`${label} must contain the exact keys`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function clone(value) {
  return structuredClone(value);
}

function nonnegativeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a nonnegative safe integer`);
  }
}

function validateAdjudication(value) {
  assertExactKeys(value, ADJUDICATION_KEYS, 'Verified adjudication');
  const dylan = value.adjudicator === 'dylan' && value.proxy_only === false;
  const proxy = value.adjudicator === 'codex_proxy' && value.proxy_only === true;
  if ((!dylan && !proxy) || !SHA256.test(value.adjudication_lock_sha256)) {
    throw new Error('Verified adjudication identity, proxy flag, or lock hash is invalid');
  }
  return {
    adjudicator: value.adjudicator,
    proxy_only: value.proxy_only,
    adjudication_lock_sha256: value.adjudication_lock_sha256,
  };
}

function validateTokenTelemetry(attempt, label) {
  const fields = [
    attempt.input_tokens,
    attempt.output_tokens,
    attempt.total_tokens,
  ];
  const missing = fields.every((value) => value === null);
  if (missing) return;
  if (fields.some((value) => value === null)) {
    throw new Error(`${label} token telemetry must be wholly present or wholly null`);
  }
  nonnegativeInteger(attempt.input_tokens, `${label} input token count`);
  nonnegativeInteger(attempt.output_tokens, `${label} output token count`);
  nonnegativeInteger(attempt.total_tokens, `${label} total token count`);
  if (attempt.total_tokens !== attempt.input_tokens + attempt.output_tokens) {
    throw new Error(`${label} total token count must equal the input and output sum`);
  }
}

function validateAttempt(value, index, operationLabel) {
  const label = `${operationLabel} attempt ${index + 1}`;
  assertExactKeys(value, ATTEMPT_KEYS, label);
  if (value.attempt_ordinal !== index + 1
    || !CLASSIFICATIONS.has(value.classification)) {
    throw new Error(`${label} ordinal or classification is invalid`);
  }
  validateTokenTelemetry(value, label);
  if (value.latency_ms !== null) {
    nonnegativeInteger(value.latency_ms, `${label} latency`);
  }
  return {
    attempt_ordinal: value.attempt_ordinal,
    classification: value.classification,
    input_tokens: value.input_tokens,
    output_tokens: value.output_tokens,
    total_tokens: value.total_tokens,
    latency_ms: value.latency_ms,
  };
}

function validateTerminalOperations(score, attempts) {
  const last = attempts.at(-1);
  if (attempts.slice(0, -1).some(
    (attempt) => attempt.classification !== 'infrastructure_retry',
  )) {
    throw new Error('Only infrastructure retry attempts may precede a terminal attempt');
  }
  if (score.terminal_state === 'valid_final'
    && last.classification !== 'valid_final') {
    throw new Error('Valid-final score requires a valid-final terminal attempt');
  }
  if (score.terminal_state === 'terminal_invalid'
    && last.classification !== 'terminal_invalid') {
    throw new Error('Terminal-invalid score requires a terminal-invalid attempt');
  }
  if (score.terminal_state === 'infrastructure_failure'
    && (attempts.length !== 3
      || attempts.some(
        (attempt) => attempt.classification !== 'infrastructure_retry',
      ))) {
    throw new Error('Infrastructure failure requires exactly three retryable attempts');
  }
}

function summarizeAttempts(attempts) {
  const knownTokens = attempts.filter((attempt) => attempt.total_tokens !== null);
  const knownLatency = attempts.filter((attempt) => attempt.latency_ms !== null);
  return {
    attempt_count: attempts.length,
    retry_count: attempts.length - 1,
    invalid_attempt_count: attempts.filter(
      (attempt) => attempt.classification === 'terminal_invalid',
    ).length,
    infrastructure_retry_attempt_count: attempts.filter(
      (attempt) => attempt.classification === 'infrastructure_retry',
    ).length,
    input_tokens: knownTokens.reduce(
      (total, attempt) => total + attempt.input_tokens,
      0,
    ),
    output_tokens: knownTokens.reduce(
      (total, attempt) => total + attempt.output_tokens,
      0,
    ),
    total_tokens: knownTokens.reduce(
      (total, attempt) => total + attempt.total_tokens,
      0,
    ),
    token_usage_missing_attempts: attempts.length - knownTokens.length,
    latency_ms: knownLatency.reduce(
      (total, attempt) => total + attempt.latency_ms,
      0,
    ),
    latency_missing_attempts: attempts.length - knownLatency.length,
  };
}

function validateOperations(values, scores) {
  if (!Array.isArray(values) || values.length !== METHOD.scheduledSlotCount) {
    throw new Error(`Slot operations must contain exactly ${METHOD.scheduledSlotCount} entries`);
  }
  const scoresBySlot = new Map(scores.map((score) => [score.slot_id, score]));
  const operations = new Map();
  for (const [index, value] of values.entries()) {
    const label = `Slot operation ${index + 1}`;
    assertExactKeys(value, OPERATION_KEYS, label);
    if (!SLOT_ID.test(value.slot_id)
      || !Number.isSafeInteger(value.slot_ordinal)
      || value.slot_ordinal < 1
      || value.slot_ordinal > METHOD.scheduledSlotCount
      || value.slot_id !== `NAP-V5-SLOT-${String(value.slot_ordinal).padStart(2, '0')}`
      || operations.has(value.slot_id)) {
      throw new Error(`${label} identity is invalid or duplicated`);
    }
    const score = scoresBySlot.get(value.slot_id);
    if (score === undefined || score.slot_ordinal !== value.slot_ordinal) {
      throw new Error(`${label} does not match a scheduled score`);
    }
    if (!Array.isArray(value.attempts)
      || value.attempts.length < 1
      || value.attempts.length > 3) {
      throw new Error(`${label} must contain one to three attempts`);
    }
    const attempts = value.attempts.map(
      (attempt, attemptIndex) => validateAttempt(attempt, attemptIndex, label),
    );
    validateTerminalOperations(score, attempts);
    operations.set(value.slot_id, {
      attempts,
      summary: summarizeAttempts(attempts),
    });
  }
  if (operations.size !== scoresBySlot.size) {
    throw new Error('Every scheduled score requires exactly one operation entry');
  }
  return operations;
}

function pairedOutcome(stateScore, historyScore, valueFor) {
  if (!stateScore.model_scorable || !historyScore.model_scorable) {
    return 'unscorable_pair';
  }
  const state = valueFor(stateScore);
  const history = valueFor(historyScore);
  if (history && !state) return 'history_win';
  if (state && !history) return 'state_only_win';
  return 'tie';
}

function pairedOutcomes(stateScore, historyScore) {
  return {
    semantic_top_1_primary: pairedOutcome(
      stateScore,
      historyScore,
      (score) => score.scores.semantic_same_destination.top_1.primary,
    ),
    semantic_top_1_sensitivity: pairedOutcome(
      stateScore,
      historyScore,
      (score) => score.scores.semantic_same_destination.top_1.sensitivity,
    ),
    semantic_top_3_primary: pairedOutcome(
      stateScore,
      historyScore,
      (score) => score.scores.semantic_same_destination.top_3.primary,
    ),
    semantic_top_3_sensitivity: pairedOutcome(
      stateScore,
      historyScore,
      (score) => score.scores.semantic_same_destination.top_3.sensitivity,
    ),
    structured_normalized_exact_top_1: pairedOutcome(
      stateScore,
      historyScore,
      (score) => score.scores.structured_normalized_exact.top_1,
    ),
    structured_normalized_exact_top_3: pairedOutcome(
      stateScore,
      historyScore,
      (score) => score.scores.structured_normalized_exact.top_3,
    ),
  };
}

function depthBandFor(targetOrdinal) {
  return DEPTH_BANDS.find(
    (band) => targetOrdinal >= band.first && targetOrdinal <= band.last,
  ).band;
}

function slotReadout(score, operation) {
  return {
    slot_id: score.slot_id,
    slot_ordinal: score.slot_ordinal,
    terminal_state: score.terminal_state,
    model_scorable: score.model_scorable,
    invalid_model_output: score.invalid_model_output,
    scores: clone(score.scores),
    operations: clone(operation.summary),
  };
}

function buildTargetMatrix(scores, operations) {
  const rows = [];
  for (let targetOrdinal = 1; targetOrdinal <= METHOD.targetCount; targetOrdinal += 1) {
    const targetId = `NAP-V5-TARGET-${String(targetOrdinal).padStart(2, '0')}-R1`;
    const state = scores.find(
      (score) => score.target_id === targetId && score.condition === CONDITIONS[0],
    );
    const history = scores.find(
      (score) => score.target_id === targetId && score.condition === CONDITIONS[1],
    );
    if (state === undefined || history === undefined) {
      throw new Error(`Target ${targetId} does not contain both conditions`);
    }
    rows.push({
      target_ordinal: targetOrdinal,
      target_id: targetId,
      depth_band: depthBandFor(targetOrdinal),
      state_only: slotReadout(state, operations.get(state.slot_id)),
      state_plus_hybrid_history: slotReadout(
        history,
        operations.get(history.slot_id),
      ),
      paired_outcomes: pairedOutcomes(state, history),
    });
  }
  return rows;
}

function outcomeCounts(rows, metric) {
  const output = {
    history_win: 0,
    state_only_win: 0,
    tie: 0,
    unscorable_pair: 0,
    scorable_pairs: 0,
  };
  for (const row of rows) {
    const outcome = row.paired_outcomes[metric];
    output[outcome] += 1;
    if (outcome !== 'unscorable_pair') output.scorable_pairs += 1;
  }
  return output;
}

function buildPairAggregates(rows) {
  return Object.fromEntries(PAIRED_METRICS.map(
    (metric) => [metric, outcomeCounts(rows, metric)],
  ));
}

function ratio(successes, scheduled, modelScorable) {
  return {
    successes,
    scheduled_denominator: scheduled,
    model_scorable_denominator: modelScorable,
  };
}

function aggregateSubset(scores) {
  const scheduled = scores.length;
  const modelScorable = scores.filter((score) => score.model_scorable).length;
  const metrics = {};
  for (const family of SCORE_FAMILIES) {
    metrics[family] = {};
    for (const cutoff of ['top_1', 'top_3']) {
      if (ANALYZED_FAMILIES.has(family)) {
        metrics[family][cutoff] = {
          primary: ratio(
            scores.filter(
              (score) => score.scores[family][cutoff].primary,
            ).length,
            scheduled,
            modelScorable,
          ),
          sensitivity: ratio(
            scores.filter(
              (score) => score.scores[family][cutoff].sensitivity,
            ).length,
            scheduled,
            modelScorable,
          ),
        };
      } else {
        metrics[family][cutoff] = ratio(
          scores.filter((score) => score.scores[family][cutoff]).length,
          scheduled,
          modelScorable,
        );
      }
    }
  }
  return {
    scheduled_slots: scheduled,
    model_scorable_slots: modelScorable,
    invalid_model_outputs: scores.filter(
      (score) => score.invalid_model_output,
    ).length,
    infrastructure_failures: scores.filter(
      (score) => !score.model_scorable,
    ).length,
    metrics,
  };
}

function buildDepthBands(scores, matrix) {
  return DEPTH_BANDS.map((definition) => {
    const targetOrdinals = Array.from(
      { length: definition.last - definition.first + 1 },
      (_, index) => definition.first + index,
    );
    const targetSet = new Set(targetOrdinals);
    const rows = matrix.filter((row) => targetSet.has(row.target_ordinal));
    return {
      band: definition.band,
      target_ordinals: targetOrdinals,
      target_count: targetOrdinals.length,
      interpretation_status: 'descriptive_confounded',
      conditions: Object.fromEntries(CONDITIONS.map((condition) => [
        condition,
        aggregateSubset(
          scores.filter(
            (score) => targetSet.has(score.target_ordinal)
              && score.condition === condition,
          ),
        ),
      ])),
      paired_outcomes: buildPairAggregates(rows),
    };
  });
}

function buildOperationalSummary(scores, operations) {
  const summaries = [...operations.values()].map((operation) => operation.summary);
  const sum = (key) => summaries.reduce((total, summary) => total + summary[key], 0);
  return {
    scheduled_slots: METHOD.scheduledSlotCount,
    model_scorable_slots: scores.filter((score) => score.model_scorable).length,
    invalid_model_outputs: scores.filter(
      (score) => score.invalid_model_output,
    ).length,
    infrastructure_failures: scores.filter(
      (score) => !score.model_scorable,
    ).length,
    total_attempts: sum('attempt_count'),
    retry_count: sum('retry_count'),
    invalid_attempt_count: sum('invalid_attempt_count'),
    infrastructure_retry_attempt_count: sum(
      'infrastructure_retry_attempt_count',
    ),
    input_tokens: sum('input_tokens'),
    output_tokens: sum('output_tokens'),
    total_tokens: sum('total_tokens'),
    token_usage_missing_attempts: sum('token_usage_missing_attempts'),
    total_latency_ms: sum('latency_ms'),
    latency_missing_attempts: sum('latency_missing_attempts'),
  };
}

function unavailableInterpretation() {
  return {
    official_product_band: null,
    official_would_want_router: null,
    proxy_sensitivity_interpretation: null,
  };
}

export function buildScorePackage(input) {
  assertExactKeys(input, INPUT_KEYS, 'Score-package input');
  const adjudication = validateAdjudication(input.adjudication);
  const conditionAggregates = aggregateConditions(input.slot_scores);
  pairTargets(input.slot_scores);
  const scores = [...input.slot_scores];
  const operations = validateOperations(input.slot_operations, scores);
  const targetMatrix = buildTargetMatrix(scores, operations);
  const scorePackage = {
    version: 1,
    adjudication,
    condition_aggregates: clone(conditionAggregates),
    pair_aggregates: buildPairAggregates(targetMatrix),
    target_matrix: targetMatrix,
    depth_bands: buildDepthBands(scores, targetMatrix),
    operational_summary: buildOperationalSummary(scores, operations),
    interpretation: unavailableInterpretation(),
    method_limitations: clone(LIMITATIONS),
  };
  return deepFreeze(scorePackage);
}

function validateCounts(value, label) {
  assertExactKeys(
    value,
    [...OUTCOMES, 'scorable_pairs'],
    label,
  );
  for (const key of [...OUTCOMES, 'scorable_pairs']) {
    nonnegativeInteger(value[key], `${label} ${key}`);
  }
  if (OUTCOMES.reduce((total, key) => total + value[key], 0) !== METHOD.targetCount
    || value.scorable_pairs !== METHOD.targetCount - value.unscorable_pair) {
    throw new Error(
      `${label} counts do not reconcile to the ${METHOD.targetCount}-target matrix`,
    );
  }
}

function validateScorePackage(value) {
  assertExactKeys(value, PACKAGE_KEYS, 'Score package');
  if (value.version !== 1) throw new Error('Score package version must be 1');
  validateAdjudication(value.adjudication);
  if (!isPlainObject(value.condition_aggregates)
    || value.condition_aggregates.version !== 1
    || !isPlainObject(value.condition_aggregates.conditions)) {
    throw new Error('Score package condition aggregates are invalid');
  }
  assertExactKeys(value.pair_aggregates, PAIRED_METRICS, 'Pair aggregates');
  for (const metric of PAIRED_METRICS) {
    validateCounts(value.pair_aggregates[metric], `Pair aggregate ${metric}`);
  }
  if (!Array.isArray(value.target_matrix)
    || value.target_matrix.length !== METHOD.targetCount
    || value.target_matrix.some((row, index) => (
      !isPlainObject(row)
      || row.target_ordinal !== index + 1
      || row.target_id !== `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`
      || !TARGET_ID.test(row.target_id)
    ))) {
    throw new Error(
      `Score package target matrix must contain all ${METHOD.targetCount} canonical rows`,
    );
  }
  if (!Array.isArray(value.depth_bands)
    || value.depth_bands.length !== DEPTH_BANDS.length
    || value.depth_bands.some((band, index) => (
      !isPlainObject(band)
      || band.band !== DEPTH_BANDS[index].band
      || band.target_count
        !== DEPTH_BANDS[index].last - DEPTH_BANDS[index].first + 1
      || band.interpretation_status !== 'descriptive_confounded'
    ))) {
    throw new Error('Score package history-depth bands are invalid');
  }
  if (!isPlainObject(value.operational_summary)) {
    throw new Error('Score package operational summary is invalid');
  }
  assertExactKeys(
    value.interpretation,
    [
      'official_product_band',
      'official_would_want_router',
      'proxy_sensitivity_interpretation',
    ],
    'Score package interpretation',
  );
  if (Object.values(value.interpretation).some((entry) => entry !== null)) {
    throw new Error('Machine-readable score package cannot contain an invented interpretation');
  }
  assertExactKeys(
    value.method_limitations,
    Object.keys(LIMITATIONS),
    'Score package method limitations',
  );
  if (value.method_limitations.residual_cli_tool_schema_exposure !== 'possible'
    || value.method_limitations.v3_v4_numeric_comparison !== 'prohibited'
    || value.method_limitations.disclosure !== LIMITATIONS.disclosure) {
    throw new Error('Score package method limitations differ from the frozen contract');
  }
  return value;
}

function validateRationale(value) {
  if (typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || value.normalize('NFKC') !== value
    || [...value].length > 2_000
    || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error('Interpretation rationale must be normalized trimmed bounded text of at most 2,000 code points');
  }
}

export function validateInterpretationRecord(record, scorePackage) {
  assertExactKeys(record, INTERPRETATION_KEYS, 'Interpretation record');
  const verifiedPackage = validateScorePackage(scorePackage);
  const gate = verifiedPackage.adjudication;
  if (record.adjudicator !== gate.adjudicator) {
    throw new Error('Interpretation adjudicator does not match the verified adjudication gate');
  }
  validateRationale(record.rationale);
  const scorablePairs = verifiedPackage.pair_aggregates
    .semantic_top_3_primary.scorable_pairs;
  if (scorablePairs < QUALITATIVE_PAIR_FLOOR) {
    if (record.band !== null || record.would_want_router !== null) {
      throw new Error('Fewer than 12 scorable pairs force the product band and router preference to null');
    }
  } else if (!INTERPRETATION_BANDS.has(record.band)) {
    throw new Error('Interpretation band must be one frozen qualitative band');
  }
  if (gate.proxy_only) {
    if (record.would_want_router !== null) {
      throw new Error('A proxy interpretation must leave Dylan router preference null');
    }
    if (record.band === 'demo-worthy') {
      throw new Error('Demo-worthy requires Dylan adjudication and a true router preference');
    }
  } else if (scorablePairs >= QUALITATIVE_PAIR_FLOOR
    && typeof record.would_want_router !== 'boolean') {
    throw new Error('Dylan interpretation must answer the router-preference field');
  }
  if (record.band === 'demo-worthy'
    && (record.adjudicator !== 'dylan' || record.would_want_router !== true)) {
    throw new Error('Demo-worthy requires adjudicator=dylan and would_want_router=true');
  }
  return deepFreeze({
    adjudicator: record.adjudicator,
    band: record.band,
    would_want_router: record.would_want_router,
    rationale: record.rationale,
  });
}

function ratioText(value) {
  return `${value.successes}/${value.scheduled_denominator} scheduled; `
    + `${value.successes}/${value.model_scorable_denominator} model-scorable`;
}

function outcomeText(value) {
  return `H ${value.history_win} / S ${value.state_only_win} / `
    + `tie ${value.tie} / unscorable ${value.unscorable_pair}`;
}

function metricBoolean(value, modelScorable) {
  if (!modelScorable) return 'NA';
  return value ? '1' : '0';
}

function slotOperationText(slot) {
  const operation = slot.operations;
  return `attempts=${operation.attempt_count}; retries=${operation.retry_count}; `
    + `invalid=${operation.invalid_attempt_count}; tokens=${operation.total_tokens}`
    + `${operation.token_usage_missing_attempts === 0
      ? ''
      : ` (+${operation.token_usage_missing_attempts} missing)`}; `
    + `latency_ms=${operation.latency_ms}`
    + `${operation.latency_missing_attempts === 0
      ? ''
      : ` (+${operation.latency_missing_attempts} missing)`}`;
}

function renderConditionTable(scorePackage) {
  const state = scorePackage.condition_aggregates.conditions[CONDITIONS[0]].metrics;
  const history = scorePackage.condition_aggregates.conditions[CONDITIONS[1]].metrics;
  const rows = [
    ['Semantic top-1 (primary)', (metrics) => metrics.semantic_same_destination.top_1.primary],
    ['Semantic top-1 (sensitivity)', (metrics) => metrics.semantic_same_destination.top_1.sensitivity],
    ['Semantic top-3 (primary)', (metrics) => metrics.semantic_same_destination.top_3.primary],
    ['Semantic top-3 (sensitivity)', (metrics) => metrics.semantic_same_destination.top_3.sensitivity],
    ['Structured exact top-1', (metrics) => metrics.structured_normalized_exact.top_1],
    ['Structured exact top-3', (metrics) => metrics.structured_normalized_exact.top_3],
    ['Action type top-1', (metrics) => metrics.action_type.top_1],
    ['Action type top-3', (metrics) => metrics.action_type.top_3],
    ['Structured exact-action top-1', (metrics) => metrics.structured_exact_action.top_1],
    ['Structured exact-action top-3', (metrics) => metrics.structured_exact_action.top_3],
    ['Shortcut usefulness top-1 (primary)', (metrics) => metrics.shortcut_usefulness.top_1.primary],
    ['Shortcut usefulness top-1 (sensitivity)', (metrics) => metrics.shortcut_usefulness.top_1.sensitivity],
    ['Shortcut usefulness top-3 (primary)', (metrics) => metrics.shortcut_usefulness.top_3.primary],
    ['Shortcut usefulness top-3 (sensitivity)', (metrics) => metrics.shortcut_usefulness.top_3.sensitivity],
  ];
  return [
    '## Condition aggregates',
    '',
    `| Metric | ${CONDITIONS[0]} | ${CONDITIONS[1]} |`,
    '| --- | --- | --- |',
    ...rows.map(([label, select]) => (
      `| ${label} | ${ratioText(select(state))} | ${ratioText(select(history))} |`
    )),
  ];
}

function pairedMetricLabel(metric) {
  return {
    semantic_top_1_primary: 'Semantic top-1 (primary)',
    semantic_top_1_sensitivity: 'Semantic top-1 (sensitivity)',
    semantic_top_3_primary: 'Semantic top-3 (primary)',
    semantic_top_3_sensitivity: 'Semantic top-3 (sensitivity)',
    structured_normalized_exact_top_1: 'Structured exact top-1',
    structured_normalized_exact_top_3: 'Structured exact top-3',
  }[metric];
}

function renderPairTable(scorePackage) {
  return [
    '## Paired outcomes',
    '',
    '| Metric | History wins / state-only wins / ties / unscorable |',
    '| --- | --- |',
    ...PAIRED_METRICS.map(
      (metric) => `| ${pairedMetricLabel(metric)} | ${outcomeText(scorePackage.pair_aggregates[metric])} |`,
    ),
  ];
}

function renderTargetMatrix(scorePackage) {
  const lines = [
    `## Complete ${METHOD.targetCount}-target matrix`,
    '',
    '| Target | Depth | State sem-1 / sem-3 / exact-1 / exact-3 | History sem-1 / sem-3 / exact-1 / exact-3 | Semantic pairs top-1 / top-3 | Structured exact pairs top-1 / top-3 | State operations | History operations |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const row of scorePackage.target_matrix) {
    const state = row.state_only;
    const history = row.state_plus_hybrid_history;
    const metricCells = (slot) => [
      slot.scores.semantic_same_destination.top_1.primary,
      slot.scores.semantic_same_destination.top_3.primary,
      slot.scores.structured_normalized_exact.top_1,
      slot.scores.structured_normalized_exact.top_3,
    ].map((value) => metricBoolean(value, slot.model_scorable)).join(' / ');
    lines.push(
      `| ${row.target_id} | ${row.depth_band}`
      + ` | ${metricCells(state)}`
      + ` | ${metricCells(history)}`
      + ` | ${row.paired_outcomes.semantic_top_1_primary} / ${row.paired_outcomes.semantic_top_3_primary}`
      + ` | ${row.paired_outcomes.structured_normalized_exact_top_1} / ${row.paired_outcomes.structured_normalized_exact_top_3}`
      + ` | ${slotOperationText(state)}`
      + ` | ${slotOperationText(history)} |`,
    );
  }
  return lines;
}

function renderDepthTable(scorePackage) {
  const lines = [
    '## History-depth readout',
    '',
    'These shallow, medium, and deep five-target bands are descriptive/confounded: chronology, workflow phase, target difficulty, and available history change together.',
    '',
    '| Depth band | Targets | State semantic top-3 | History semantic top-3 | State structured exact top-3 | History structured exact top-3 | Semantic top-3 pairs |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const band of scorePackage.depth_bands) {
    const state = band.conditions[CONDITIONS[0]].metrics;
    const history = band.conditions[CONDITIONS[1]].metrics;
    lines.push(
      `| ${band.band} | ${band.target_ordinals[0]}-${band.target_ordinals.at(-1)}`
      + ` | ${ratioText(state.semantic_same_destination.top_3.primary)}`
      + ` | ${ratioText(history.semantic_same_destination.top_3.primary)}`
      + ` | ${ratioText(state.structured_normalized_exact.top_3)}`
      + ` | ${ratioText(history.structured_normalized_exact.top_3)}`
      + ` | ${outcomeText(band.paired_outcomes.semantic_top_3_primary)} |`,
    );
  }
  return lines;
}

function renderOperations(scorePackage) {
  const summary = scorePackage.operational_summary;
  return [
    '## Operational accounting',
    '',
    `- Scheduled slots: ${summary.scheduled_slots}`,
    `- Model-scorable slots: ${summary.model_scorable_slots}`,
    `- Attempts: ${summary.total_attempts}`,
    `- Retries: ${summary.retry_count}`,
    `- Invalid model outputs: ${summary.invalid_model_outputs}`,
    `- Invalid attempts: ${summary.invalid_attempt_count}`,
    `- Infrastructure failures: ${summary.infrastructure_failures}`,
    `- Infrastructure-retry attempts: ${summary.infrastructure_retry_attempt_count}`,
    `- Tokens: ${summary.total_tokens} total (${summary.input_tokens} input, ${summary.output_tokens} output); missing telemetry for ${summary.token_usage_missing_attempts} attempts`,
    `- Latency: ${summary.total_latency_ms} ms across known attempts; missing telemetry for ${summary.latency_missing_attempts} attempts`,
  ];
}

function renderLimitations(scorePackage) {
  return [
    '## Method limitations',
    '',
    `- ${scorePackage.method_limitations.disclosure}`,
    '- V3 and V4 are not numerically compared with V5 because monitor coverage, history representation, target selection, model configuration, response contract, and scoring differ.',
  ];
}

function renderCore(scorePackage, title) {
  const verified = validateScorePackage(scorePackage);
  const proxyLabel = verified.adjudication.proxy_only
    ? 'Semantic and shortcut-usefulness results are proxy-only sensitivity outputs; objective structured/action/operational metrics remain official.'
    : 'Semantic and shortcut-usefulness results are Dylan-authoritative.';
  return [
    `# ${title}`,
    '',
    proxyLabel,
    '',
    ...renderConditionTable(verified),
    '',
    ...renderPairTable(verified),
    '',
    ...renderTargetMatrix(verified),
    '',
    ...renderDepthTable(verified),
    '',
    ...renderOperations(verified),
    '',
    ...renderLimitations(verified),
  ];
}

export function renderPreliminaryReport(scorePackage) {
  return [
    ...renderCore(scorePackage, 'NAP V5 Preliminary Report'),
    '',
    '## Interpretation status',
    '',
    'No qualitative interpretation has been supplied or inferred from the metrics. The official product band, Dylan router preference, and proxy sensitivity interpretation remain null.',
    '',
  ].join('\n');
}

export function renderFinalReport(scorePackage, interpretationRecord) {
  const verifiedPackage = validateScorePackage(scorePackage);
  const interpretation = validateInterpretationRecord(
    interpretationRecord,
    verifiedPackage,
  );
  const proxy = verifiedPackage.adjudication.proxy_only;
  const officialBand = proxy
    ? 'unavailable (proxy-only; null)'
    : interpretation.band ?? 'unavailable (fewer than 12 scorable pairs; null)';
  const routerPreference = interpretation.would_want_router === null
    ? 'unavailable'
    : interpretation.would_want_router
      ? 'yes'
      : 'no';
  const proxyInterpretation = proxy
    ? interpretation.band ?? 'unavailable (fewer than 12 scorable pairs; null)'
    : 'unavailable';
  return [
    ...renderCore(verifiedPackage, 'NAP V5 Final Report'),
    '',
    '## Explicit qualitative interpretation',
    '',
    `- Adjudicator: ${interpretation.adjudicator}`,
    `- Official product band: ${officialBand}`,
    `- Would Dylan want the router: ${routerPreference}`,
    `- Proxy sensitivity interpretation: ${proxyInterpretation}`,
    `- Rationale: ${interpretation.rationale}`,
    '',
  ].join('\n');
}
