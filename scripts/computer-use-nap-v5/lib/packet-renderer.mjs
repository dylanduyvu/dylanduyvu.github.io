import { constants } from 'node:fs';
import { lstat, open, readdir } from 'node:fs/promises';
import path from 'node:path';

import { CONDITIONS } from '../config.mjs';
import { publishAtomicBundle } from './bundle-publisher.mjs';
import { targetGranularity } from './identity.mjs';
import { sha256 } from './immutable.mjs';

const [STATE_CONDITION, HISTORY_CONDITION] = CONDITIONS;
const SHA256 = /^[0-9a-f]{64}$/;
const CONTEXT_KEYS = ['version', 'current', 'history', 'visual_history'];
const HISTORY_KEYS = [
  'history_ordinal', 'action_type', 'input_method', 'granularity',
  'app', 'object', 'subtarget',
];
const VISUAL_KEYS = ['image_ordinal', 'history_ordinal', 'image_sha256'];
const RENDER_KEYS = ['condition', 'contextDirectory', 'outputDirectory'];
const ACTION_TYPES = new Set(['focus', 'activate']);
const INPUT_METHODS = new Set(['pointer', 'keyboard_enter', 'keyboard_command_w']);
const GRANULARITIES = new Set(['application', 'object', 'subtarget']);
const MAX_COMPONENT_CODE_POINTS = 256;

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, keys, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${label} must contain exactly these keys: ${keys.join(', ')}`);
  }
}

function validateComponent(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || Array.from(value).length > MAX_COMPONENT_CODE_POINTS
    || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error(`${label} must be a trimmed nonempty bounded string${nullable ? ' or null' : ''}`);
  }
}

function validateContext(condition, context) {
  if (!CONDITIONS.includes(condition)) {
    throw new Error(`Packet condition must be one frozen token: ${CONDITIONS.join(', ')}`);
  }
  assertExactKeys(context, CONTEXT_KEYS, 'Predictor-safe context');
  assertExactKeys(context.current, ['image_sha256'], 'Predictor-safe current image');
  if (context.version !== 1 || !SHA256.test(context.current.image_sha256)) {
    throw new Error('Predictor-safe context version or current image hash is invalid');
  }
  if (!Array.isArray(context.history) || !Array.isArray(context.visual_history)) {
    throw new Error('Predictor-safe history arrays are required');
  }
  let priorOrdinal = 0;
  for (const [index, entry] of context.history.entries()) {
    assertExactKeys(entry, HISTORY_KEYS, `History entry ${index + 1}`);
    if (!Number.isSafeInteger(entry.history_ordinal)
      || entry.history_ordinal <= priorOrdinal
      || entry.history_ordinal > 196) {
      throw new Error(`History entry ${index + 1} ordinal must be strictly increasing within 1..196`);
    }
    if (!ACTION_TYPES.has(entry.action_type)) {
      throw new Error(`History entry ${index + 1} action_type must be focus or activate`);
    }
    if (!INPUT_METHODS.has(entry.input_method)) {
      throw new Error(`History entry ${index + 1} input_method is outside the frozen corpus enum`);
    }
    if (!GRANULARITIES.has(entry.granularity)) {
      throw new Error(`History entry ${index + 1} granularity is invalid`);
    }
    validateComponent(entry.app, `History entry ${index + 1} app`);
    validateComponent(entry.object, `History entry ${index + 1} object`, { nullable: true });
    validateComponent(entry.subtarget, `History entry ${index + 1} subtarget`, { nullable: true });
    let derivedGranularity;
    try {
      derivedGranularity = targetGranularity({
        app: entry.app,
        object: entry.object,
        subtarget: entry.subtarget,
      });
    } catch {
      throw new Error(`History entry ${index + 1} target null shape is invalid`);
    }
    if (derivedGranularity !== entry.granularity) {
      throw new Error(`History entry ${index + 1} granularity does not match target null shape`);
    }
    priorOrdinal = entry.history_ordinal;
  }
  const historyOrdinals = new Set(context.history.map((entry) => entry.history_ordinal));
  let priorVisualHistoryOrdinal = 0;
  for (const [index, entry] of context.visual_history.entries()) {
    assertExactKeys(entry, VISUAL_KEYS, `Visual history entry ${index + 1}`);
    if (entry.image_ordinal !== index + 1
      || !Number.isSafeInteger(entry.history_ordinal)
      || !historyOrdinals.has(entry.history_ordinal)
      || entry.history_ordinal <= priorVisualHistoryOrdinal
      || !SHA256.test(entry.image_sha256)) {
      throw new Error(`Visual history entry ${index + 1} must have unique strictly increasing ordinals tied to history`);
    }
    priorVisualHistoryOrdinal = entry.history_ordinal;
  }
  if (condition === STATE_CONDITION
    && (context.history.length !== 0 || context.visual_history.length !== 0)) {
    throw new Error('State-only context history arrays must be empty');
  }
  if (condition === HISTORY_CONDITION
    && (context.history.length === 0 || context.visual_history.length !== 10)) {
    throw new Error('History condition requires structured history and exactly ten visual rows');
  }
  return context;
}

export function renderPredictorPrompt(condition, context) {
  validateContext(condition, context);
  if (condition === STATE_CONDITION) {
    return 'CURRENT BEFORE-STATE\nimage-001.png\n\nPredict the immediate next eligible action.\n';
  }
  const actionLines = context.history.map((entry) => JSON.stringify({
    history_ordinal: entry.history_ordinal,
    action_type: entry.action_type,
    input_method: entry.input_method,
    granularity: entry.granularity,
    app: entry.app,
    object: entry.object,
    subtarget: entry.subtarget,
  }));
  const mappingLines = context.visual_history.map((entry, index) => (
    `image-${String(index + 1).padStart(3, '0')}.png -> history_ordinal=${entry.history_ordinal}`
  ));
  return [
    'EARLIER COMPLETED ACTIONS (oldest to newest)',
    ...actionLines,
    '',
    'RECENT VISUAL HISTORY (oldest to newest)',
    ...mappingLines,
    '',
    'CURRENT BEFORE-STATE',
    'image-011.png',
    '',
    'Predict the immediate next eligible action.',
    '',
  ].join('\n');
}

async function exactDirectoryEntries(directory, expected, label, { allowMissing = false } = {}) {
  let stat;
  try {
    stat = await lstat(directory);
  } catch (error) {
    if (allowMissing && error?.code === 'ENOENT') return null;
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`${label} must be a non-symlink directory`);
  }
  const names = (await readdir(directory)).sort();
  const sortedExpected = [...expected].sort();
  if (names.length !== sortedExpected.length
    || names.some((name, index) => name !== sortedExpected[index])) {
    throw new Error(`${label} contains extra, missing, or unexpected entries`);
  }
  for (const name of names) {
    const entry = await lstat(path.join(directory, name));
    if (entry.isSymbolicLink() || !entry.isFile()) {
      throw new Error(`${label}/${name} must be a regular non-symlink file`);
    }
    if (entry.nlink !== 1) throw new Error(`${label}/${name} has forbidden hardlink count`);
  }
  return names;
}

async function readRegularFile(filename, label) {
  const stat = await lstat(filename);
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`${label} must be a regular non-symlink file`);
  }
  if (stat.nlink !== 1) throw new Error(`${label} has forbidden hardlink count`);
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const handleStat = await handle.stat();
    if (!handleStat.isFile() || handleStat.dev !== stat.dev || handleStat.ino !== stat.ino) {
      throw new Error(`${label} changed during read`);
    }
    return await handle.readFile();
  } finally {
    await handle.close();
  }
}

function parseContextBytes(bytes) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('Context JSON must be valid UTF-8');
  }
  if (text.includes('\r') || !text.endsWith('\n') || text.endsWith('\n\n')) {
    throw new Error('Context JSON must use LF and exactly one trailing newline');
  }
  let context;
  try {
    context = JSON.parse(text);
  } catch {
    throw new Error('Context JSON must parse');
  }
  if (text !== `${JSON.stringify(context, null, 2)}\n`) {
    throw new Error('Context JSON bytes are not in frozen serialization');
  }
  return context;
}

export async function renderFrozenPacket(options) {
  assertExactKeys(options, RENDER_KEYS, 'Frozen packet options');
  if (!CONDITIONS.includes(options.condition)) {
    throw new Error(`Packet condition must be one frozen token: ${CONDITIONS.join(', ')}`);
  }
  if (typeof options.contextDirectory !== 'string'
    || !path.isAbsolute(options.contextDirectory)
    || typeof options.outputDirectory !== 'string'
    || !path.isAbsolute(options.outputDirectory)) {
    throw new Error('Packet context and output directories must be absolute paths');
  }
  const sourceNames = options.condition === STATE_CONDITION
    ? ['context.json', 'current.png']
    : [
        'context.json', 'current.png',
        ...Array.from({ length: 10 }, (_, index) => `visual-${String(index + 1).padStart(3, '0')}.png`),
      ];
  await exactDirectoryEntries(options.contextDirectory, sourceNames, 'Predictor-safe context bundle');
  const contextBytes = await readRegularFile(path.join(options.contextDirectory, 'context.json'), 'Context JSON');
  const context = parseContextBytes(contextBytes);
  validateContext(options.condition, context);
  const prompt = renderPredictorPrompt(options.condition, context);
  const sourceImageNames = options.condition === STATE_CONDITION
    ? ['current.png']
    : [
        ...Array.from({ length: 10 }, (_, index) => `visual-${String(index + 1).padStart(3, '0')}.png`),
        'current.png',
      ];
  const expectedHashes = options.condition === STATE_CONDITION
    ? [context.current.image_sha256]
    : [...context.visual_history.map((entry) => entry.image_sha256), context.current.image_sha256];
  const images = [];
  const imageBytes = [];
  for (let index = 0; index < sourceImageNames.length; index += 1) {
    const bytes = await readRegularFile(
      path.join(options.contextDirectory, sourceImageNames[index]),
      `Context image ${sourceImageNames[index]}`,
    );
    const digest = sha256(bytes);
    if (digest !== expectedHashes[index]) throw new Error(`Context image hash mismatch at attachment ${index + 1}`);
    imageBytes.push(bytes);
    images.push({ attachment_ordinal: index + 1, sha256: digest });
  }
  const packet = {
    version: 1,
    condition: options.condition,
    prompt_text: prompt,
    context_sha256: sha256(contextBytes),
    images,
  };
  const files = [
    { name: 'packet.json', contents: `${JSON.stringify(packet, null, 2)}\n` },
    { name: 'prompt.txt', contents: prompt },
  ];
  for (let index = 0; index < imageBytes.length; index += 1) {
    files.push({
      name: `image-${String(index + 1).padStart(3, '0')}.png`,
      contents: imageBytes[index],
    });
  }
  await publishAtomicBundle({
    targetDirectory: options.outputDirectory,
    files,
    label: 'Packet output directory',
  });
  return packet;
}
