import { normalizedFullAction, targetGranularity } from './identity.mjs';

const RESPONSE_KEYS = ['predictions'];
const PREDICTION_KEYS = ['rank', 'action_type', 'app', 'object', 'subtarget', 'reason'];

function fail(message, cause) {
  const error = new Error(`invalid_schema: ${message}`, cause === undefined ? undefined : { cause });
  error.code = 'invalid_schema';
  throw error;
}

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function exactKeys(value, expected) {
  if (!isPlainObject(value)) return false;
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function trimmedNonempty(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value;
}

function freezeDeep(value) {
  for (const child of Object.values(value)) {
    if (child !== null && typeof child === 'object') freezeDeep(child);
  }
  return Object.freeze(value);
}

export function validatePredictions(value) {
  if (!exactKeys(value, RESPONSE_KEYS)) fail('response must contain exactly predictions');
  if (!Array.isArray(value.predictions) || value.predictions.length !== 3) fail('predictions must contain exactly three entries');

  const normalized = [];
  const predictions = value.predictions.map((entry, index) => {
    if (!exactKeys(entry, PREDICTION_KEYS)) fail(`prediction ${index + 1} has invalid keys`);
    if (!Number.isInteger(entry.rank) || entry.rank !== index + 1) fail(`prediction ${index + 1} rank must equal ${index + 1}`);
    if (entry.action_type !== 'focus' && entry.action_type !== 'activate') fail(`prediction ${index + 1} action_type is invalid`);
    if (!trimmedNonempty(entry.app)) fail(`prediction ${index + 1} app must be trimmed and nonempty`);
    if (entry.object !== null && !trimmedNonempty(entry.object)) fail(`prediction ${index + 1} object must be null or trimmed and nonempty`);
    if (entry.subtarget !== null && !trimmedNonempty(entry.subtarget)) fail(`prediction ${index + 1} subtarget must be null or trimmed and nonempty`);
    if (!trimmedNonempty(entry.reason)) fail(`prediction ${index + 1} reason must be trimmed and nonempty`);
    if (Array.from(entry.reason).length > 240) fail(`prediction ${index + 1} reason exceeds 240 Unicode code points`);
    try {
      targetGranularity(entry);
      normalized.push(normalizedFullAction(entry));
    } catch (error) {
      fail(`prediction ${index + 1} target shape is invalid`, error);
    }
    return {
      rank: entry.rank,
      action_type: entry.action_type,
      app: entry.app,
      object: entry.object,
      subtarget: entry.subtarget,
      reason: entry.reason,
    };
  });
  if (new Set(normalized).size !== 3) fail('predictions must be three distinct normalized full actions');
  return freezeDeep({ predictions });
}
