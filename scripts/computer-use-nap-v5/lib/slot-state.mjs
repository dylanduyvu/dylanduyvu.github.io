import { METHOD } from '../config.mjs';
import { canonicalJson } from './immutable.mjs';

const ATTEMPT_KEYS = [
  'attempt_ordinal',
  'classification',
  'code',
  'verified',
  'latency_ms',
];
const FATAL_KEYS = ['classification', 'code', 'verified'];
const TERMINAL_KEYS = [
  'version',
  'slot_ordinal',
  'terminal_state',
  'classification',
  'code',
  'authoritative_attempt_ordinal',
  'latency_ms',
];
const OPTION_KEYS = ['slotOrdinal', 'attempts', 'terminalRecord', 'fatalEnvironment'];
const ATTEMPT_CLASSIFICATIONS = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_retry',
]);
const TERMINAL_STATES = new Set([
  'valid_final',
  'terminal_invalid',
  'infrastructure_failure',
]);

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, expected, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (actual.length !== sortedExpected.length
    || actual.some((key, index) => key !== sortedExpected[index])) {
    throw new Error(`${label} must contain the exact artifact keys`);
  }
}

function validCode(value) {
  return typeof value === 'string'
    && value.length > 0
    && Array.from(value).length <= 128;
}

function validLatency(value) {
  return value === null || (Number.isSafeInteger(value) && value >= 0);
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function validateAttempts(attempts) {
  if (!Array.isArray(attempts)) throw new TypeError('Slot attempts must be an array');
  if (attempts.length > 3) throw new Error('A slot cannot exceed the three-attempt limit');
  let terminalSeen = false;
  return attempts.map((source, index) => {
    assertExactKeys(source, ATTEMPT_KEYS, `Attempt artifact ${index + 1}`);
    const ordinal = index + 1;
    if (source.attempt_ordinal !== ordinal) {
      throw new Error('Attempt ordinals must be exact, contiguous, and ordered');
    }
    if (source.verified !== true) {
      throw new Error(`Attempt ${ordinal} is partial, corrupt, or not verified`);
    }
    if (!ATTEMPT_CLASSIFICATIONS.has(source.classification)
      || !validCode(source.code)
      || !validLatency(source.latency_ms)) {
      throw new Error(`Attempt artifact ${ordinal} classification, code, or latency is invalid`);
    }
    if (source.classification === 'valid_final' && source.code !== 'valid_final') {
      throw new Error('A valid-final attempt must carry the valid_final code');
    }
    if (terminalSeen) {
      throw new Error('No attempt may appear after an authoritative terminal result');
    }
    if (source.classification === 'valid_final'
      || source.classification === 'terminal_invalid') {
      terminalSeen = true;
    }
    return {
      attempt_ordinal: source.attempt_ordinal,
      classification: source.classification,
      code: source.code,
      verified: true,
      latency_ms: source.latency_ms,
    };
  });
}

function terminalFromAttempt(slotOrdinal, attempt, terminalState) {
  return {
    version: 1,
    slot_ordinal: slotOrdinal,
    terminal_state: terminalState,
    classification: attempt.classification,
    code: attempt.code,
    authoritative_attempt_ordinal: attempt.attempt_ordinal,
    latency_ms: attempt.latency_ms,
  };
}

function derivePersistedState(slotOrdinal, attempts) {
  const terminalAttempt = attempts.find((attempt) => (
    attempt.classification === 'valid_final'
    || attempt.classification === 'terminal_invalid'
  ));
  if (terminalAttempt !== undefined) {
    return {
      kind: 'terminal',
      terminal_record: terminalFromAttempt(
        slotOrdinal,
        terminalAttempt,
        terminalAttempt.classification,
      ),
    };
  }
  if (attempts.length === 3) {
    return {
      kind: 'terminal',
      terminal_record: terminalFromAttempt(
        slotOrdinal,
        attempts[2],
        'infrastructure_failure',
      ),
    };
  }
  return {
    kind: 'attempt',
    slot_ordinal: slotOrdinal,
    attempt_ordinal: attempts.length + 1,
    completed_attempts: attempts.length,
  };
}

function validateFatalEnvironment(value) {
  if (value === null) return null;
  assertExactKeys(value, FATAL_KEYS, 'Fatal environment artifact');
  if (value.classification !== 'fatal_environment'
    || value.verified !== true
    || !validCode(value.code)) {
    throw new Error('Fatal environment artifact is not verified or valid');
  }
  return {
    classification: value.classification,
    code: value.code,
    verified: true,
  };
}

function validateTerminalRecord(value, slotOrdinal) {
  assertExactKeys(value, TERMINAL_KEYS, 'Terminal slot record');
  if (value.version !== 1
    || value.slot_ordinal !== slotOrdinal
    || !TERMINAL_STATES.has(value.terminal_state)
    || !ATTEMPT_CLASSIFICATIONS.has(value.classification)
    || !validCode(value.code)
    || !Number.isSafeInteger(value.authoritative_attempt_ordinal)
    || value.authoritative_attempt_ordinal < 1
    || value.authoritative_attempt_ordinal > 3
    || !validLatency(value.latency_ms)) {
    throw new Error('Terminal slot record is invalid');
  }
  return Object.fromEntries(TERMINAL_KEYS.map((key) => [key, value[key]]));
}

export function decideSlotState(options) {
  assertExactKeys(options, OPTION_KEYS, 'Slot-state options');
  const {
    slotOrdinal,
    terminalRecord,
  } = options;
  if (!Number.isSafeInteger(slotOrdinal)
    || slotOrdinal < 1
    || slotOrdinal > METHOD.scheduledSlotCount) {
    throw new Error('Slot ordinal is outside the frozen schedule');
  }
  const attempts = validateAttempts(options.attempts);
  const fatalEnvironment = validateFatalEnvironment(options.fatalEnvironment);
  const persisted = derivePersistedState(slotOrdinal, attempts);

  if (terminalRecord !== null) {
    if (fatalEnvironment !== null || persisted.kind !== 'terminal') {
      throw new Error('Terminal slot record has no matching verified terminal attempts');
    }
    const validated = validateTerminalRecord(terminalRecord, slotOrdinal);
    if (canonicalJson(validated) !== canonicalJson(persisted.terminal_record)) {
      throw new Error('Terminal slot record differs from verified attempts');
    }
    return deepFreeze({ kind: 'complete', terminal_record: validated });
  }

  if (fatalEnvironment !== null) {
    if (persisted.kind !== 'attempt') {
      throw new Error('Fatal environment stop cannot overwrite a terminal slot');
    }
    return deepFreeze({
      kind: 'fatal_stop',
      slot_ordinal: slotOrdinal,
      attempt_ordinal: persisted.attempt_ordinal,
      completed_attempts: persisted.completed_attempts,
      classification: fatalEnvironment.classification,
      code: fatalEnvironment.code,
    });
  }

  return deepFreeze(persisted);
}
