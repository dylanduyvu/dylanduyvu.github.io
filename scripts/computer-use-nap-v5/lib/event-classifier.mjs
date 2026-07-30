import { createHash } from 'node:crypto';

import { validatePredictions } from './response-validation.mjs';

const TOOL_EVENT_TYPES = new Set(['tool.requested', 'tool.invocation', 'tool.call', 'tool_call']);
const PASSIVE_ITEM_TYPES = new Set(['reasoning', 'agent_message', 'error']);
const FATAL_CODES = new Map([
  ['authentication_error', 'authentication'],
  ['authentication', 'authentication'],
  ['authorization_error', 'authorization'],
  ['authorization', 'authorization'],
  ['invalid_model', 'invalid_model'],
  ['model_not_found', 'invalid_model'],
  ['configuration_error', 'local_configuration'],
  ['invalid_configuration', 'local_configuration'],
  ['strict_config_error', 'local_configuration'],
]);
const INFRASTRUCTURE_CODES = new Set([
  'adapter_spawn_failure',
  'transport_disconnect',
  'rate_limit',
  'service_unavailable',
  'timeout_without_final',
  'transport_artifact_corrupt',
  'local_io_before_final',
]);
const MAX_FATAL_MESSAGE_CODE_POINTS = 4_096;
const MAX_FATAL_STDERR_BYTES = 16_384;
const FATAL_MESSAGE_PATTERNS = Object.freeze([
  [
    'authentication',
    /\b(?:authentication(?:\s+(?:error|failed|required))?|unauthenticated|not\s+logged\s+in|log(?:in|ged-in)\s+required|invalid\s+api\s+key|401\s+unauthorized)\b/iu,
  ],
  [
    'authorization',
    /\b(?:authorization(?:\s+(?:error|failed|required))?|forbidden|permission\s+denied|access\s+denied|403)\b/iu,
  ],
  [
    'invalid_model',
    /\b(?:invalid|unknown|unsupported)\s+model\b|\bmodel\b.{0,80}\bnot\s+found\b/iu,
  ],
  [
    'local_configuration',
    /\bstrict[-\s]?config(?:uration)?\b|\b(?:configuration|config)\s+(?:error|invalid|failed)\b|\bunknown\s+(?:configuration|config)\s+(?:field|key|option)\b|\bfailed\s+to\s+(?:load|parse)\s+(?:configuration|config)\b/iu,
  ],
]);

function result(classification, code, overrides = {}) {
  return Object.freeze({
    classification,
    code,
    response: null,
    usage: null,
    ...overrides,
  });
}

function parseEvents(bytes) {
  if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) throw new TypeError('eventsBytes must be bytes');
  const source = Buffer.from(bytes);
  const events = [];
  let offset = 0;
  while (offset < source.length) {
    const newline = source.indexOf(0x0a, offset);
    const end = newline === -1 ? source.length : newline;
    const lineBytes = source.subarray(offset, end);
    try {
      if (lineBytes.length === 0) throw new Error('Empty JSONL event line');
      const line = new TextDecoder('utf-8', { fatal: true }).decode(lineBytes);
      const value = JSON.parse(line);
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('JSONL event must be an object');
      }
      events.push(value);
    } catch {
      return { events, corrupt: true };
    }
    offset = newline === -1 ? source.length : newline + 1;
  }
  return { events, corrupt: false };
}

function isToolEvent(event) {
  if (TOOL_EVENT_TYPES.has(event.type)) return true;
  if (event.type === 'item.started' || event.type === 'item.completed') {
    return !PASSIVE_ITEM_TYPES.has(event.item?.type);
  }
  return event.tool_request !== undefined || event.tool_invocation !== undefined;
}

function structuralCode(event) {
  if (event.type !== 'error' && event.type !== 'turn.failed') return null;
  return typeof event.error?.code === 'string'
    ? event.error.code
    : typeof event.code === 'string'
      ? event.code
      : null;
}

function fatalFromMessage(value) {
  if (typeof value !== 'string'
    || value.length === 0
    || Array.from(value).length > MAX_FATAL_MESSAGE_CODE_POINTS) {
    return null;
  }
  for (const [classification, pattern] of FATAL_MESSAGE_PATTERNS) {
    if (pattern.test(value)) return classification;
  }
  return null;
}

function structuralFatal(event) {
  const code = structuralCode(event);
  if (code !== null && FATAL_CODES.has(code)) return FATAL_CODES.get(code);
  if ((event.type === 'item.started' || event.type === 'item.completed')
    && event.item?.type === 'error') {
    return fatalFromMessage(event.item?.message)
      ?? fatalFromMessage(event.item?.error?.message);
  }
  if (event.type !== 'error' && event.type !== 'turn.failed') return null;
  return fatalFromMessage(event.error?.message)
    ?? fatalFromMessage(event.message);
}

function stderrFatal(stderrBytes) {
  if (!Buffer.isBuffer(stderrBytes) && !(stderrBytes instanceof Uint8Array)) {
    throw new TypeError('stderrBytes must be bytes');
  }
  const bounded = Buffer.from(stderrBytes).subarray(0, MAX_FATAL_STDERR_BYTES);
  return fatalFromMessage(new TextDecoder('utf-8').decode(bounded));
}

function tokenUsage(events) {
  const completed = events.filter((event) => event.type === 'turn.completed' && event.usage !== null && typeof event.usage === 'object').at(-1);
  if (completed === undefined) return null;
  const keys = ['input_tokens', 'cached_input_tokens', 'output_tokens'];
  const usage = {};
  for (const key of keys) {
    const value = completed.usage[key] ?? 0;
    if (!Number.isSafeInteger(value) || value < 0) return null;
    usage[key] = value;
  }
  return Object.freeze(usage);
}

function decodeFinal(finalBytes, finalSha256) {
  if (finalBytes === null) return { state: 'absent' };
  if (!Buffer.isBuffer(finalBytes) && !(finalBytes instanceof Uint8Array)) throw new TypeError('finalBytes must be bytes or null');
  const bytes = Buffer.from(finalBytes);
  if (bytes.length === 0) return { state: 'empty' };
  if (finalSha256 !== null) {
    if (typeof finalSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(finalSha256)) return { state: 'corrupt' };
    if (createHash('sha256').update(bytes).digest('hex') !== finalSha256) return { state: 'corrupt' };
  }
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return { state: 'corrupt' };
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { state: 'corrupt' };
  }
  try {
    return { state: 'valid', response: validatePredictions(parsed) };
  } catch (error) {
    if (error?.code === 'invalid_schema') return { state: 'invalid_schema' };
    throw error;
  }
}

export function classifyAttemptArtifacts({
  eventsBytes,
  finalBytes,
  finalSha256 = null,
  processExitCode = 0,
  timedOut = false,
  spawnFailed = false,
  localIoBeforeFinal = false,
  stderrBytes = Buffer.alloc(0),
} = {}) {
  const parsedEvents = parseEvents(eventsBytes);
  const { events } = parsedEvents;
  const usage = tokenUsage(events);
  if (events.some(isToolEvent)) return result('terminal_invalid', 'attempted_tool_use', { usage });

  const refusal = events.some((event) => event.type === 'response.refusal' || event.type === 'turn.refused');
  const final = decodeFinal(finalBytes, finalSha256);
  if (final.state === 'valid') return result('valid_final', 'valid_final', { response: final.response, usage });
  if (localIoBeforeFinal) return result('infrastructure_retry', 'local_io_before_final', { usage });
  if (refusal) return result('terminal_invalid', 'refusal', { usage });
  if (final.state === 'empty') return result('terminal_invalid', 'empty_final', { usage });
  if (final.state === 'invalid_schema') return result('terminal_invalid', 'invalid_schema', { usage });

  const fatal = events.map(structuralFatal).find((value) => value !== null)
    ?? stderrFatal(stderrBytes);
  if (fatal !== null) return result('fatal_environment', fatal, { usage });
  if (parsedEvents.corrupt) return result('infrastructure_retry', 'transport_artifact_corrupt', { usage });
  if (final.state === 'corrupt') return result('infrastructure_retry', 'transport_artifact_corrupt', { usage });

  const codes = events.map(structuralCode).filter((code) => code !== null);
  if (spawnFailed) return result('infrastructure_retry', 'adapter_spawn_failure', { usage });
  if (timedOut) return result('infrastructure_retry', 'timeout_without_final', { usage });
  for (const code of codes) {
    if (code === 'rate_limit' || code === 'service_unavailable' || code === 'transport_disconnect') {
      return result('infrastructure_retry', code, { usage });
    }
  }
  if (processExitCode !== 0) return result('infrastructure_retry', 'transport_disconnect', { usage });
  const fallback = 'transport_disconnect';
  if (!INFRASTRUCTURE_CODES.has(fallback)) throw new Error('Unreachable infrastructure classification');
  return result('infrastructure_retry', fallback, { usage });
}
