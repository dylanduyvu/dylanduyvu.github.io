const CONDITIONS = Object.freeze([
  'state_only',
  'state_plus_all_prior',
]);
const CONDITION_SET = new Set(CONDITIONS);
const ATTEMPT_STATUSES = Object.freeze([
  'valid_prediction',
  'invalid_tool_use',
  'invalid_schema',
  'infrastructure_failure',
]);
const ATTEMPT_STATUS_SET = new Set(ATTEMPT_STATUSES);
const OUTCOMES = new Set(['win', 'loss', 'tie']);
const PAIR_STRING_IDENTITY_FIELDS = Object.freeze([
  'run_id',
  'dataset_snapshot_id',
  'manifest_id',
  'event_id',
]);
const PAIR_INTEGER_IDENTITY_FIELDS = Object.freeze([
  'event_row_version',
  'paired_target_ordinal',
]);

function fail(message) {
  throw new Error(`Invalid scoring input: ${message}`);
}

function requireObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${name} must be an object`);
  }
  return value;
}

function requireNonemptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${name} must be a nonempty string`);
  }
  return value;
}

function requireCanonicalUtcTimestamp(value, name) {
  requireNonemptyString(value, name);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)) {
    fail(`${name} must be a canonical millisecond UTC timestamp`);
  }
  const milliseconds = Date.parse(value);
  if (
    !Number.isFinite(milliseconds)
    || new Date(milliseconds).toISOString() !== value
  ) {
    fail(`${name} must be a real canonical millisecond UTC timestamp`);
  }
  return milliseconds;
}

function requireExactKeys(value, expectedKeys, name) {
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (
    actual.length !== expected.length
    || actual.some((key, index) => key !== expected[index])
  ) {
    fail(`${name} must contain exactly these keys: ${expectedKeys.join(', ')}`);
  }
}

function requireCondition(value) {
  if (!CONDITION_SET.has(value)) fail(`condition must be one of ${CONDITIONS.join(', ')}`);
  return value;
}

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    fail(`${name} must be a positive integer`);
  }
  return value;
}

function requireStatus(value) {
  if (!ATTEMPT_STATUS_SET.has(value)) {
    fail(`status must be one of ${ATTEMPT_STATUSES.join(', ')}`);
  }
  return value;
}

function freezeRecord(value) {
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object' && !Object.isFrozen(child)) {
      freezeRecord(child);
    }
  }
  return Object.freeze(value);
}

export function normalizeComparedString(value) {
  requireNonemptyString(value, 'compared value');
  return value.trim().toLowerCase().replace(/\s+/gu, ' ');
}

function validatePrediction(value, expectedRank) {
  const prediction = requireObject(value, `prediction rank ${expectedRank}`);
  requireExactKeys(
    prediction,
    ['rank', 'app', 'object', 'subtarget', 'canonical_label', 'reason'],
    'prediction keys',
  );
  if (!Number.isInteger(expectedRank) || expectedRank < 1 || expectedRank > 3) {
    fail('prediction rank must be an integer from 1 through 3');
  }
  if (prediction.rank !== expectedRank) {
    fail('prediction ranks must be consecutive integers starting at 1');
  }
  requireNonemptyString(prediction.app, `prediction rank ${expectedRank}.app`);
  requireNonemptyString(prediction.object, `prediction rank ${expectedRank}.object`);
  if (
    prediction.subtarget !== null
    && (typeof prediction.subtarget !== 'string' || prediction.subtarget.trim() === '')
  ) {
    fail(`prediction rank ${expectedRank}.subtarget must be null or a nonempty string`);
  }
  requireNonemptyString(
    prediction.canonical_label,
    `prediction rank ${expectedRank}.canonical_label`,
  );
  const expectedCanonicalLabel = prediction.subtarget === null
    ? `${prediction.app} -> ${prediction.object}`
    : `${prediction.app} -> ${prediction.object} -> ${prediction.subtarget}`;
  if (prediction.canonical_label !== expectedCanonicalLabel) {
    fail(
      `prediction rank ${expectedRank}.canonical_label must use the mechanical app -> object -> subtarget format`,
    );
  }
  requireNonemptyString(prediction.reason, `prediction rank ${expectedRank}.reason`);
  return prediction;
}

function validateAliases(value, component) {
  if (!Array.isArray(value)) fail(`accepted_aliases.${component} must be an array`);
  for (const [index, alias] of value.entries()) {
    requireNonemptyString(alias, `accepted_aliases.${component}[${index}]`);
  }
  return value;
}

function validateLabel(value) {
  const label = requireObject(value, 'label');
  const target = requireObject(label.target, 'label.target');
  requireExactKeys(target, ['app', 'object', 'subtarget'], 'label.target keys');
  requireNonemptyString(target.app, 'label.target.app');
  requireNonemptyString(target.object, 'label.target.object');
  if (
    target.subtarget !== null
    && (typeof target.subtarget !== 'string' || target.subtarget.trim() === '')
  ) {
    fail('label.target.subtarget must be null or a nonempty string');
  }
  const aliases = requireObject(label.accepted_aliases, 'label.accepted_aliases');
  requireExactKeys(
    aliases,
    ['app', 'object', 'subtarget'],
    'label.accepted_aliases keys',
  );
  for (const component of ['app', 'object', 'subtarget']) {
    validateAliases(aliases[component], component);
  }
  return { target, aliases };
}

function validateScoringLabel(value) {
  const label = requireObject(value, 'label');
  const { target, aliases } = validateLabel(label);
  requireNonemptyString(label.event_id, 'label.event_id');
  const hasRowVersion = Object.hasOwn(label, 'row_version');
  const hasEventRowVersion = Object.hasOwn(label, 'event_row_version');
  if (!hasRowVersion && !hasEventRowVersion) {
    fail('label must include row_version or event_row_version');
  }
  const rowVersion = hasRowVersion
    ? requirePositiveInteger(label.row_version, 'label.row_version')
    : requirePositiveInteger(
      label.event_row_version,
      'label.event_row_version',
    );
  if (
    hasEventRowVersion
    && requirePositiveInteger(
      label.event_row_version,
      'label.event_row_version',
    ) !== rowVersion
  ) {
    fail('label row_version and event_row_version must match');
  }
  return {
    target,
    aliases,
    eventId: label.event_id,
    eventRowVersion: rowVersion,
  };
}

function componentMatches(predicted, canonical, aliases) {
  const accepted = new Set([
    normalizeComparedString(canonical),
    ...aliases.map(normalizeComparedString),
  ]);
  return accepted.has(normalizeComparedString(predicted));
}

export function predictionMatchesTarget(value, labelValue) {
  const prediction = validatePrediction(value, value?.rank);
  const { target, aliases } = validateLabel(labelValue);
  if (!componentMatches(prediction.app, target.app, aliases.app)) return false;
  if (!componentMatches(prediction.object, target.object, aliases.object)) return false;
  if (target.subtarget === null) return true;
  if (prediction.subtarget === null) return false;
  return componentMatches(
    prediction.subtarget,
    target.subtarget,
    aliases.subtarget,
  );
}

function validateAttempt(value, { requireSaved = false } = {}) {
  const attempt = requireObject(value, 'attempt');
  requireNonemptyString(attempt.event_id, 'attempt.event_id');
  requireCondition(attempt.condition);
  requireStatus(attempt.attempt_status);
  if (!Array.isArray(attempt.ranked_predictions)) {
    fail('attempt.ranked_predictions must be an array');
  }
  if (attempt.attempt_status === 'valid_prediction') {
    if (
      attempt.ranked_predictions.length < 1
      || attempt.ranked_predictions.length > 3
    ) {
      fail('valid_prediction ranked_predictions must contain one to three entries');
    }
    attempt.ranked_predictions.forEach((entry, index) => {
      validatePrediction(entry, index + 1);
    });
  } else if (attempt.ranked_predictions.length !== 0) {
    fail('non-valid attempt ranked_predictions must be empty');
  }
  if (attempt.attempt_status === 'valid_prediction') {
    requireCanonicalUtcTimestamp(
      attempt.prediction_saved_at_utc,
      'valid_prediction attempt.prediction_saved_at_utc',
    );
  } else if (attempt.prediction_saved_at_utc !== null) {
    fail('prediction_saved_at_utc must be null for every non-valid attempt');
  }
  if (requireSaved) {
    const attemptSaved = requireCanonicalUtcTimestamp(
      attempt.attempt_saved_at_utc,
      'attempt.attempt_saved_at_utc',
    );
    if (attempt.attempt_status === 'valid_prediction') {
      const predictionSaved = requireCanonicalUtcTimestamp(
        attempt.prediction_saved_at_utc,
        'attempt.prediction_saved_at_utc',
      );
      if (predictionSaved > attemptSaved) {
        fail('prediction must be saved before the immutable attempt');
      }
    }
  }
  return attempt;
}

export function scoreAttempt(attemptValue, labelValue) {
  const attempt = validateAttempt(attemptValue);
  const label = validateScoringLabel(labelValue);
  const attemptRowVersion = requirePositiveInteger(
    attempt.event_row_version,
    'attempt.event_row_version',
  );
  if (attempt.event_id !== label.eventId) {
    fail('attempt event_id must match label.event_id');
  }
  if (attemptRowVersion !== label.eventRowVersion) {
    fail('attempt event_row_version must match label row version');
  }
  let top1;
  let top3;
  if (attempt.attempt_status === 'infrastructure_failure') {
    top1 = null;
    top3 = null;
  } else if (attempt.attempt_status !== 'valid_prediction') {
    top1 = false;
    top3 = false;
  } else {
    top1 = predictionMatchesTarget(attempt.ranked_predictions[0], {
      target: label.target,
      accepted_aliases: label.aliases,
    });
    top3 = attempt.ranked_predictions.some((entry) => (
      predictionMatchesTarget(entry, {
        target: label.target,
        accepted_aliases: label.aliases,
      })
    ));
  }
  return freezeRecord({
    event_id: attempt.event_id,
    condition: attempt.condition,
    attempt_status: attempt.attempt_status,
    exact_top_1: top1,
    exact_top_3: top3,
  });
}

function validateScore(value) {
  const score = requireObject(value, 'score');
  requireNonemptyString(score.event_id, 'score.event_id');
  requireCondition(score.condition);
  requireStatus(score.attempt_status);
  const values = [score.exact_top_1, score.exact_top_3];
  if (score.attempt_status === 'infrastructure_failure') {
    if (!values.every((entry) => entry === null)) {
      fail('only infrastructure_failure scores may be null');
    }
  } else {
    if (!values.every((entry) => typeof entry === 'boolean')) {
      fail('null scores require infrastructure_failure status');
    }
    if (score.exact_top_1 && !score.exact_top_3) {
      fail('top-1 correctness implies top-3 correctness');
    }
    if (
      (
        score.attempt_status === 'invalid_tool_use'
        || score.attempt_status === 'invalid_schema'
      )
      && !values.every((entry) => entry === false)
    ) {
      fail('invalid tool/schema scores must be false');
    }
  }
  return score;
}

export function summarizeConditionScores(scoreValues, conditionValue) {
  if (!Array.isArray(scoreValues)) fail('scores must be an array');
  const condition = requireCondition(conditionValue);
  const scores = scoreValues.map(validateScore);
  if (scores.some((score) => score.condition !== condition)) {
    fail(`all scores must use condition ${condition}`);
  }
  const eventIds = scores.map(({ event_id }) => event_id);
  if (new Set(eventIds).size !== eventIds.length) {
    fail(`duplicate score event in condition ${condition}`);
  }
  const attempts = {
    total: scores.length,
    valid_prediction: 0,
    invalid_tool_use: 0,
    invalid_schema: 0,
    infrastructure_failure: 0,
  };
  for (const score of scores) attempts[score.attempt_status] += 1;
  const included = scores.filter(
    ({ attempt_status }) => attempt_status !== 'infrastructure_failure',
  );
  return freezeRecord({
    condition,
    attempts,
    top_1: {
      numerator: included.filter(({ exact_top_1 }) => exact_top_1).length,
      denominator: included.length,
    },
    top_3: {
      numerator: included.filter(({ exact_top_3 }) => exact_top_3).length,
      denominator: included.length,
    },
  });
}

export function summarizeScores(scoreValues) {
  if (!Array.isArray(scoreValues)) fail('scores must be an array');
  const scores = scoreValues.map(validateScore);
  return freezeRecord(Object.fromEntries(CONDITIONS.map((condition) => [
    condition,
    summarizeConditionScores(
      scores.filter((score) => score.condition === condition),
      condition,
    ),
  ])));
}

function pairedOutcome(stateCorrect, historyCorrect) {
  if (historyCorrect === stateCorrect) return 'tie';
  return historyCorrect ? 'win' : 'loss';
}

export function comparePair(value) {
  const pair = requireObject(value, 'pair');
  const stateOnly = validateScore(pair.state_only);
  const history = validateScore(pair.state_plus_all_prior);
  if (stateOnly.condition !== 'state_only') {
    fail('pair.state_only must use state_only condition');
  }
  if (history.condition !== 'state_plus_all_prior') {
    fail('pair.state_plus_all_prior must use state_plus_all_prior condition');
  }
  if (stateOnly.event_id !== history.event_id) {
    fail('paired scores must use the same event');
  }
  if (
    stateOnly.attempt_status === 'infrastructure_failure'
    || history.attempt_status === 'infrastructure_failure'
  ) {
    return freezeRecord({
      event_id: stateOnly.event_id,
      excluded: true,
      top_1: null,
      top_3: null,
    });
  }
  return freezeRecord({
    event_id: stateOnly.event_id,
    excluded: false,
    top_1: pairedOutcome(
      stateOnly.exact_top_1,
      history.exact_top_1,
    ),
    top_3: pairedOutcome(
      stateOnly.exact_top_3,
      history.exact_top_3,
    ),
  });
}

function validateComparison(value) {
  const comparison = requireObject(value, 'paired comparison');
  requireNonemptyString(comparison.event_id, 'paired comparison.event_id');
  if (typeof comparison.excluded !== 'boolean') {
    fail('paired comparison.excluded must be boolean');
  }
  if (comparison.excluded) {
    if (comparison.top_1 !== null || comparison.top_3 !== null) {
      fail('excluded paired comparison outcomes must be null');
    }
  } else {
    if (!OUTCOMES.has(comparison.top_1) || !OUTCOMES.has(comparison.top_3)) {
      fail('included paired comparison outcome must be win, loss, or tie');
    }
    if (
      (comparison.top_1 === 'win' && comparison.top_3 === 'loss')
      || (comparison.top_1 === 'loss' && comparison.top_3 === 'win')
    ) {
      fail('paired win/loss outcomes cannot reverse from top-1 to top-3');
    }
  }
  return comparison;
}

export function summarizePairedComparisons(comparisonValues) {
  if (!Array.isArray(comparisonValues)) fail('paired comparisons must be an array');
  const comparisons = comparisonValues.map(validateComparison);
  const eventIds = comparisons.map(({ event_id }) => event_id);
  if (new Set(eventIds).size !== eventIds.length) {
    fail('duplicate paired comparison event');
  }
  const included = comparisons.filter(({ excluded }) => !excluded);
  const metricSummary = (key) => ({
    wins: included.filter((entry) => entry[key] === 'win').length,
    losses: included.filter((entry) => entry[key] === 'loss').length,
    ties: included.filter((entry) => entry[key] === 'tie').length,
    denominator: included.length,
  });
  return freezeRecord({
    pairs: {
      total: comparisons.length,
      included: included.length,
      excluded: comparisons.length - included.length,
    },
    top_1: metricSummary('top_1'),
    top_3: metricSummary('top_3'),
  });
}

export function assertPairReadyForLabel(attemptValues) {
  if (!Array.isArray(attemptValues) || attemptValues.length !== 2) {
    fail('both immutable condition attempts must exist before label revelation');
  }
  const attempts = attemptValues.map((entry) => validateAttempt(entry, {
    requireSaved: true,
  }));
  for (const attempt of attempts) {
    for (const field of PAIR_STRING_IDENTITY_FIELDS) {
      requireNonemptyString(attempt[field], `attempt.${field}`);
    }
    for (const field of PAIR_INTEGER_IDENTITY_FIELDS) {
      requirePositiveInteger(attempt[field], `attempt.${field}`);
    }
  }
  for (const field of [
    ...PAIR_STRING_IDENTITY_FIELDS,
    ...PAIR_INTEGER_IDENTITY_FIELDS,
  ]) {
    if (attempts[0][field] !== attempts[1][field]) {
      fail(`both immutable condition attempts must use the same ${field}`);
    }
  }
  const byCondition = Object.fromEntries(
    attempts.map((entry) => [entry.condition, entry]),
  );
  if (Object.keys(byCondition).length !== 2 || CONDITIONS.some((key) => !byCondition[key])) {
    fail('both immutable condition attempts must include each condition exactly once');
  }
  return freezeRecord({
    run_id: attempts[0].run_id,
    dataset_snapshot_id: attempts[0].dataset_snapshot_id,
    manifest_id: attempts[0].manifest_id,
    event_id: attempts[0].event_id,
    event_row_version: attempts[0].event_row_version,
    paired_target_ordinal: attempts[0].paired_target_ordinal,
    state_only: structuredClone(byCondition.state_only),
    state_plus_all_prior: structuredClone(byCondition.state_plus_all_prior),
  });
}

export function hasBothConditionAttempts(attemptValues) {
  try {
    assertPairReadyForLabel(attemptValues);
    return true;
  } catch {
    return false;
  }
}
