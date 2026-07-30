import { CONDITIONS, METHOD } from '../config.mjs';
import { normalizeComponent } from './identity.mjs';

const SLOT_KEYS = [
  'slot_id',
  'slot_ordinal',
  'target_id',
  'target_ordinal',
  'condition',
  'terminal_state',
  'observed_action',
  'accepted_variants',
  'predictions',
  'semantic_decisions',
  'usefulness_decisions',
];
const SCORE_KEYS = [
  'version',
  'slot_id',
  'slot_ordinal',
  'target_id',
  'target_ordinal',
  'condition',
  'terminal_state',
  'model_scorable',
  'invalid_model_output',
  'scores',
];
const TARGET_KEYS = ['app', 'object', 'subtarget'];
const ACTION_KEYS = ['action_type', ...TARGET_KEYS];
const PREDICTION_KEYS = ['rank', ...ACTION_KEYS, 'reason'];
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
const TERMINAL_STATES = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_failure',
]);
const SEMANTIC_DECISIONS = new Set([
  'same_destination',
  'different_destination',
  'uncertain',
]);
const USEFULNESS_DECISIONS = new Set([
  'useful',
  'not_useful',
  'uncertain',
]);
const ACTION_TYPES = new Set(['focus', 'activate']);
const SLOT_ID = /^NAP-V5-SLOT-(0[1-9]|1\d|2[0-2])$/u;
const TARGET_ID = /^NAP-V5-TARGET-(0[1-9]|1[01])-R1$/u;

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

function validateIdentity(value) {
  if (!SLOT_ID.test(value.slot_id)
    || !Number.isSafeInteger(value.slot_ordinal)
    || value.slot_ordinal < 1
    || value.slot_ordinal > METHOD.scheduledSlotCount
    || value.slot_id !== `NAP-V5-SLOT-${String(value.slot_ordinal).padStart(2, '0')}`) {
    throw new Error('Scored slot ID or ordinal is invalid');
  }
  if (!TARGET_ID.test(value.target_id)
    || !Number.isSafeInteger(value.target_ordinal)
    || value.target_ordinal < 1
    || value.target_ordinal > METHOD.targetCount
    || value.target_id !== `NAP-V5-TARGET-${String(value.target_ordinal).padStart(2, '0')}-R1`) {
    throw new Error('Scored target ID or ordinal is invalid');
  }
  if (!CONDITIONS.includes(value.condition)) throw new Error('Scored condition is invalid');
}

function validateTarget(value, label) {
  assertExactKeys(value, TARGET_KEYS, label);
  if (typeof value.app !== 'string' || normalizeComponent(value.app).length === 0) {
    throw new Error(`${label} app must be nonempty text`);
  }
  if (value.object === null) {
    if (value.subtarget !== null) {
      throw new Error(`${label} target shape requires null subtarget when object is null`);
    }
  } else if (typeof value.object !== 'string' || normalizeComponent(value.object).length === 0) {
    throw new Error(`${label} object must be nonempty text or null`);
  }
  if (value.subtarget !== null
    && (typeof value.subtarget !== 'string'
      || normalizeComponent(value.subtarget).length === 0)) {
    throw new Error(`${label} subtarget must be nonempty text or null`);
  }
  return {
    app: normalizeComponent(value.app),
    object: normalizeComponent(value.object),
    subtarget: normalizeComponent(value.subtarget),
  };
}

function targetKey(value) {
  return JSON.stringify({
    app: value.app,
    object: value.object,
    subtarget: value.subtarget,
  });
}

function validateAction(value, label) {
  assertExactKeys(value, ACTION_KEYS, label);
  if (!ACTION_TYPES.has(value.action_type)) {
    throw new Error(`${label} action type must be focus or activate`);
  }
  return {
    action_type: value.action_type,
    target: validateTarget({
      app: value.app,
      object: value.object,
      subtarget: value.subtarget,
    }, `${label} target`),
  };
}

function validateVariants(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 16) {
    throw new Error('Accepted variants must contain one to sixteen complete targets');
  }
  const variants = value.map((entry, index) => (
    validateTarget(entry, `Accepted variant ${index + 1}`)
  ));
  if (new Set(variants.map(targetKey)).size !== variants.length) {
    throw new Error('Accepted variants must be distinct after symmetric normalization');
  }
  return variants;
}

function validatePredictions(value) {
  if (!Array.isArray(value) || value.length !== 3) {
    throw new Error('A valid final must contain exactly three predictions');
  }
  const normalizedActions = new Set();
  const predictions = value.map((entry, index) => {
    assertExactKeys(entry, PREDICTION_KEYS, `Prediction ${index + 1}`);
    if (entry.rank !== index + 1) throw new Error('Prediction ranks must be exactly 1, 2, 3');
    if (typeof entry.reason !== 'string'
      || entry.reason.length === 0
      || entry.reason !== entry.reason.trim()
      || [...entry.reason].length > 240) {
      throw new Error(`Prediction ${index + 1} reason is invalid`);
    }
    const action = validateAction({
      action_type: entry.action_type,
      app: entry.app,
      object: entry.object,
      subtarget: entry.subtarget,
    }, `Prediction ${index + 1}`);
    const actionKey = JSON.stringify({
      action_type: action.action_type,
      ...action.target,
    });
    if (normalizedActions.has(actionKey)) {
      throw new Error('Predictions must remain distinct after normalization');
    }
    normalizedActions.add(actionKey);
    return {
      rank: entry.rank,
      action_type: action.action_type,
      target: action.target,
    };
  });
  return predictions;
}

function analyzed(primary, sensitivity) {
  return { primary, sensitivity };
}

function falseScores() {
  return {
    semantic_same_destination: {
      top_1: analyzed(false, false),
      top_3: analyzed(false, false),
    },
    structured_normalized_exact: { top_1: false, top_3: false },
    action_type: { top_1: false, top_3: false },
    structured_exact_action: { top_1: false, top_3: false },
    shortcut_usefulness: {
      top_1: analyzed(false, false),
      top_3: analyzed(false, false),
    },
  };
}

function topScores(values) {
  return {
    top_1: values[0],
    top_3: values.some(Boolean),
  };
}

function analyzedTopScores(primary, sensitivity) {
  return {
    top_1: analyzed(primary[0], sensitivity[0]),
    top_3: analyzed(primary.some(Boolean), sensitivity.some(Boolean)),
  };
}

function scoreValidSlot(input, observedAction, variants) {
  const predictions = validatePredictions(input.predictions);
  const exact = predictions.map((entry) => variants.some(
    (variant) => targetKey(variant) === targetKey(entry.target),
  ));

  if (!Array.isArray(input.semantic_decisions)
    || input.semantic_decisions.length !== 3) {
    throw new Error('A valid final requires exactly three semantic decisions');
  }
  const semantic = input.semantic_decisions.map((decision, index) => {
    if (exact[index]) {
      if (decision !== null && decision !== 'same_destination') {
        throw new Error('An automatic exact semantic decision must be null or same_destination');
      }
      return 'same_destination';
    }
    if (!SEMANTIC_DECISIONS.has(decision)) {
      throw new Error('Every non-exact prediction requires one semantic decision');
    }
    return decision;
  });

  if (!Array.isArray(input.usefulness_decisions)
    || input.usefulness_decisions.length !== 3
    || input.usefulness_decisions.some((decision) => !USEFULNESS_DECISIONS.has(decision))) {
    throw new Error('A valid final requires exactly three usefulness decisions');
  }

  const semanticPrimary = semantic.map((decision) => decision === 'same_destination');
  const semanticSensitivity = semantic.map(
    (decision) => decision === 'same_destination' || decision === 'uncertain',
  );
  const actionType = predictions.map(
    (entry) => entry.action_type === observedAction.action_type,
  );
  const exactAction = exact.map((matches, index) => matches && actionType[index]);
  const usefulnessPrimary = input.usefulness_decisions.map(
    (decision) => decision === 'useful',
  );
  const usefulnessSensitivity = input.usefulness_decisions.map(
    (decision) => decision === 'useful' || decision === 'uncertain',
  );

  return {
    semantic_same_destination: analyzedTopScores(
      semanticPrimary,
      semanticSensitivity,
    ),
    structured_normalized_exact: topScores(exact),
    action_type: topScores(actionType),
    structured_exact_action: topScores(exactAction),
    shortcut_usefulness: analyzedTopScores(
      usefulnessPrimary,
      usefulnessSensitivity,
    ),
  };
}

export function scoreSlot(input) {
  assertExactKeys(input, SLOT_KEYS, 'Scoring slot input');
  validateIdentity(input);
  if (!TERMINAL_STATES.has(input.terminal_state)) {
    throw new Error('Scoring terminal state is invalid');
  }
  const observedAction = validateAction(input.observed_action, 'Observed action');
  const variants = validateVariants(input.accepted_variants);
  const modelScorable = input.terminal_state !== 'infrastructure_failure';
  const invalidModelOutput = input.terminal_state === 'terminal_invalid';
  let scores;
  if (input.terminal_state === 'valid_final') {
    scores = scoreValidSlot(input, observedAction, variants);
  } else {
    if (input.predictions !== null
      || input.semantic_decisions !== null
      || input.usefulness_decisions !== null) {
      throw new Error('A non-valid terminal slot cannot carry predictions or adjudication decisions');
    }
    scores = falseScores();
  }
  return deepFreeze({
    version: 1,
    slot_id: input.slot_id,
    slot_ordinal: input.slot_ordinal,
    target_id: input.target_id,
    target_ordinal: input.target_ordinal,
    condition: input.condition,
    terminal_state: input.terminal_state,
    model_scorable: modelScorable,
    invalid_model_output: invalidModelOutput,
    scores,
  });
}

function validateBoolean(value, label) {
  if (typeof value !== 'boolean') throw new Error(`${label} must be boolean`);
}

function validateAnalyzed(value, label) {
  assertExactKeys(value, ['primary', 'sensitivity'], label);
  validateBoolean(value.primary, `${label} primary`);
  validateBoolean(value.sensitivity, `${label} sensitivity`);
}

function validateScores(value) {
  assertExactKeys(value, SCORE_FAMILIES, 'Slot score families');
  for (const family of SCORE_FAMILIES) {
    assertExactKeys(value[family], ['top_1', 'top_3'], `${family} cutoffs`);
    for (const cutoff of ['top_1', 'top_3']) {
      if (ANALYZED_FAMILIES.has(family)) {
        validateAnalyzed(value[family][cutoff], `${family} ${cutoff}`);
      } else {
        validateBoolean(value[family][cutoff], `${family} ${cutoff}`);
      }
    }
  }
}

function validateSlotScore(value) {
  assertExactKeys(value, SCORE_KEYS, 'Slot score');
  if (value.version !== 1 || !TERMINAL_STATES.has(value.terminal_state)) {
    throw new Error('Slot score version or terminal state is invalid');
  }
  validateIdentity(value);
  const expectedModelScorable = value.terminal_state !== 'infrastructure_failure';
  const expectedInvalid = value.terminal_state === 'terminal_invalid';
  if (value.model_scorable !== expectedModelScorable
    || value.invalid_model_output !== expectedInvalid) {
    throw new Error('Slot score terminal accounting is inconsistent');
  }
  validateScores(value.scores);
  return value;
}

function validateCompleteScores(values) {
  if (!Array.isArray(values) || values.length !== METHOD.scheduledSlotCount) {
    throw new Error(`Scoring requires exactly ${METHOD.scheduledSlotCount} scheduled slots`);
  }
  const scores = values.map(validateSlotScore);
  const slotOrdinals = scores.map((score) => score.slot_ordinal).sort((a, b) => a - b);
  if (new Set(scores.map((score) => score.slot_id)).size !== scores.length
    || slotOrdinals.some((ordinal, index) => ordinal !== index + 1)) {
    throw new Error('Scheduled score slots must have unique consecutive identities');
  }
  const targetConditions = new Set();
  for (const score of scores) {
    const key = `${score.target_id}\0${score.condition}`;
    if (targetConditions.has(key)) throw new Error('A target condition is duplicated');
    targetConditions.add(key);
  }
  for (let targetOrdinal = 1; targetOrdinal <= METHOD.targetCount; targetOrdinal += 1) {
    const targetId = `NAP-V5-TARGET-${String(targetOrdinal).padStart(2, '0')}-R1`;
    for (const condition of CONDITIONS) {
      if (!targetConditions.has(`${targetId}\0${condition}`)) {
        throw new Error('Every target must contain one score for each condition');
      }
    }
  }
  return scores;
}

function ratio(successes, modelScorable) {
  return {
    successes,
    scheduled_denominator: METHOD.targetCount,
    model_scorable_denominator: modelScorable,
  };
}

function aggregateFamily(scores, family, modelScorable) {
  const output = {};
  for (const cutoff of ['top_1', 'top_3']) {
    if (ANALYZED_FAMILIES.has(family)) {
      output[cutoff] = {
        primary: ratio(
          scores.filter((score) => score.scores[family][cutoff].primary).length,
          modelScorable,
        ),
        sensitivity: ratio(
          scores.filter((score) => score.scores[family][cutoff].sensitivity).length,
          modelScorable,
        ),
      };
    } else {
      output[cutoff] = ratio(
        scores.filter((score) => score.scores[family][cutoff]).length,
        modelScorable,
      );
    }
  }
  return output;
}

export function aggregateConditions(values) {
  const scores = validateCompleteScores(values);
  const conditions = {};
  for (const condition of CONDITIONS) {
    const conditionScores = scores.filter((score) => score.condition === condition);
    if (conditionScores.length !== METHOD.targetCount) {
      throw new Error(`Condition ${condition} must contain exactly ${METHOD.targetCount} slots`);
    }
    const modelScorable = conditionScores.filter((score) => score.model_scorable).length;
    conditions[condition] = {
      scheduled_slots: METHOD.targetCount,
      model_scorable_slots: modelScorable,
      invalid_model_outputs: conditionScores.filter(
        (score) => score.invalid_model_output,
      ).length,
      infrastructure_failures: conditionScores.filter(
        (score) => !score.model_scorable,
      ).length,
      metrics: Object.fromEntries(SCORE_FAMILIES.map((family) => [
        family,
        aggregateFamily(conditionScores, family, modelScorable),
      ])),
    };
  }
  return deepFreeze({ version: 1, conditions });
}

function pairOutcome(stateScore, historyScore, analysis) {
  if (!stateScore.model_scorable || !historyScore.model_scorable) {
    return 'unscorable_pair';
  }
  const state = stateScore.scores.semantic_same_destination.top_3[analysis];
  const history = historyScore.scores.semantic_same_destination.top_3[analysis];
  if (history && !state) return 'history_win';
  if (state && !history) return 'state_only_win';
  return 'tie';
}

function outcomeCounts(pairs, key) {
  const counts = {
    history_win: 0,
    state_only_win: 0,
    tie: 0,
    unscorable_pair: 0,
    scorable_pairs: 0,
  };
  for (const pair of pairs) {
    counts[pair[key]] += 1;
    if (pair[key] !== 'unscorable_pair') counts.scorable_pairs += 1;
  }
  return counts;
}

export function pairTargets(values) {
  const scores = validateCompleteScores(values);
  const pairs = [];
  for (let targetOrdinal = 1; targetOrdinal <= METHOD.targetCount; targetOrdinal += 1) {
    const targetId = `NAP-V5-TARGET-${String(targetOrdinal).padStart(2, '0')}-R1`;
    const stateScore = scores.find(
      (score) => score.target_id === targetId && score.condition === CONDITIONS[0],
    );
    const historyScore = scores.find(
      (score) => score.target_id === targetId && score.condition === CONDITIONS[1],
    );
    pairs.push({
      target_ordinal: targetOrdinal,
      target_id: targetId,
      state_only_slot_id: stateScore.slot_id,
      state_plus_hybrid_history_slot_id: historyScore.slot_id,
      semantic_top_3_primary: pairOutcome(stateScore, historyScore, 'primary'),
      semantic_top_3_sensitivity: pairOutcome(stateScore, historyScore, 'sensitivity'),
    });
  }
  return deepFreeze({
    version: 1,
    pairs,
    primary_counts: outcomeCounts(pairs, 'semantic_top_3_primary'),
    sensitivity_counts: outcomeCounts(pairs, 'semantic_top_3_sensitivity'),
  });
}
