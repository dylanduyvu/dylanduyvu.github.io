import { constants } from 'node:fs';
import { lstat, open } from 'node:fs/promises';
import path from 'node:path';

import { CONDITIONS, METHOD } from '../config.mjs';
import { publishAtomicBundle } from './bundle-publisher.mjs';
import { buildEvaluatorManifest } from './catalog.mjs';
import { canonicalJson, sha256 } from './immutable.mjs';

const BUILD_KEYS = [
  'condition',
  'targetOrdinal',
  'corpusSnapshot',
  'videoInventory',
  'evidenceInventory',
  'evidenceDecisions',
  'eligibilityLedger',
  'targetSelection',
  'targetCatalog',
  'evaluatorManifest',
];
const WRITE_KEYS = [...BUILD_KEYS, 'outputDirectory', 'evidenceRoot'];
const [STATE_CONDITION] = CONDITIONS;
const SHA256 = /^[0-9a-f]{64}$/;

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
    throw new Error(`${label} must contain exact known option keys only: ${keys.join(', ')}`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function authenticate(options) {
  const canonicalSources = {
    corpusSnapshot: options.corpusSnapshot,
    evidenceInventory: options.evidenceInventory,
    evidenceDecisions: options.evidenceDecisions,
    videoInventory: options.videoInventory,
  };
  const rebuiltManifest = buildEvaluatorManifest({
    ...canonicalSources,
    eligibilityLedger: options.eligibilityLedger,
    targetSelection: options.targetSelection,
    targetCatalog: options.targetCatalog,
  });
  if (canonicalJson(rebuiltManifest) !== canonicalJson(options.evaluatorManifest)) {
    throw new Error('Evaluator manifest does not match authenticated canonical sources');
  }
  return canonicalSources;
}

function selectedTarget(options) {
  if (!Number.isSafeInteger(options.targetOrdinal)
    || options.targetOrdinal < 1
    || options.targetOrdinal > METHOD.targetCount) {
    throw new Error(
      `Selected target ordinal must be an integer from 1 through ${METHOD.targetCount}`,
    );
  }
  const eventId = options.targetSelection.selected_event_ids[options.targetOrdinal - 1];
  const target = options.evaluatorManifest.targets[options.targetOrdinal - 1];
  const corpusRow = options.corpusSnapshot.rows.find((row) => row.event_id === eventId);
  const evidenceRow = options.evidenceInventory.rows.find((row) => row.event_id === eventId);
  const ledgerRow = options.eligibilityLedger.rows.find((row) => row.event_id === eventId);
  if (target?.target_ordinal !== options.targetOrdinal
    || target.event_id !== eventId
    || corpusRow === undefined
    || evidenceRow === undefined
    || ledgerRow === undefined
    || ledgerRow.target_eligible !== true
    || ledgerRow.visual_eligible !== true
    || evidenceRow.final_disposition !== 'usable'
    || evidenceRow.selected_frame === null
    || target.current_evidence_sha256 !== evidenceRow.selected_frame.png_sha256
    || !SHA256.test(target.current_evidence_sha256)) {
    throw new Error('Current target must be one authenticated selected target with usable evidence');
  }
  return { eventId, target, corpusRow, evidenceRow };
}

function buildInputs(options) {
  return Object.fromEntries(BUILD_KEYS.map((key) => [key, options[key]]));
}

export function buildSanitizedContext(options) {
  assertExactKeys(options, BUILD_KEYS, 'Sanitized context options');
  if (!CONDITIONS.includes(options.condition)) {
    throw new Error(`Condition must be one frozen token: ${CONDITIONS.join(', ')}`);
  }
  authenticate(options);
  const selected = selectedTarget(options);
  const current = { image_sha256: selected.evidenceRow.selected_frame.png_sha256 };
  if (options.condition === STATE_CONDITION) {
    return deepFreeze({ version: 1, current, history: [], visual_history: [] });
  }

  const earlierLedger = options.eligibilityLedger.rows.filter((row) => (
    row.chronology_index < selected.corpusRow.chronology_index
  ));
  const earlierHistory = earlierLedger
    .filter((row) => row.history_eligible === true)
    .map((row) => options.corpusSnapshot.history[row.history_ordinal - 1]);
  if (earlierHistory.some((row) => row === undefined)) {
    throw new Error('Authenticated history ordinal does not join to the canonical corpus');
  }
  const usableVisuals = earlierLedger.filter((row) => row.visual_eligible === true).slice(-10);
  if (usableVisuals.length !== 10) {
    throw new Error('History targets require exactly ten earlier usable visual rows');
  }
  const visualHistory = usableVisuals.map((row, index) => {
    const evidence = options.evidenceInventory.rows[row.chronology_index - 1];
    if (evidence?.event_id !== row.event_id
      || evidence.final_disposition !== 'usable'
      || evidence.selected_frame === null
      || evidence.selected_frame.png_sha256 !== row.evidence_sha256
      || !SHA256.test(row.evidence_sha256)) {
      throw new Error('Earlier visual history does not join to authenticated usable evidence');
    }
    return {
      image_ordinal: index + 1,
      history_ordinal: row.history_ordinal,
      image_sha256: row.evidence_sha256,
    };
  });
  return deepFreeze({
    version: 1,
    current,
    history: earlierHistory.map((row) => ({
      history_ordinal: row.history_ordinal,
      action_type: row.action_type,
      input_method: row.input_method,
      granularity: row.granularity,
      app: row.app,
      object: row.object,
      subtarget: row.subtarget,
    })),
    visual_history: visualHistory,
  });
}

async function readAuthenticatedImage(evidenceRoot, storeRelativePath, expectedSha256) {
  if (typeof evidenceRoot !== 'string' || !path.isAbsolute(evidenceRoot)) {
    throw new Error('Evidence root must be an absolute path');
  }
  if (typeof storeRelativePath !== 'string'
    || path.isAbsolute(storeRelativePath)
    || storeRelativePath.includes('\\')
    || path.posix.normalize(storeRelativePath) !== storeRelativePath
    || storeRelativePath.split('/').includes('..')) {
    throw new Error('Authenticated evidence store path is unsafe');
  }
  const root = path.resolve(evidenceRoot);
  const source = path.resolve(root, ...storeRelativePath.split('/'));
  if (!source.startsWith(`${root}${path.sep}`)) throw new Error('Evidence source escapes evidence root');
  const stat = await lstat(source);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('Evidence source must be a regular non-symlink file');
  const handle = await open(source, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const handleStat = await handle.stat();
    if (!handleStat.isFile() || handleStat.dev !== stat.dev || handleStat.ino !== stat.ino) {
      throw new Error('Evidence source changed during authenticated read');
    }
    const bytes = await handle.readFile();
    if (sha256(bytes) !== expectedSha256) throw new Error('Evidence image bytes do not match authenticated SHA-256');
    return bytes;
  } finally {
    await handle.close();
  }
}

export async function writeContextBundle(options) {
  assertExactKeys(options, WRITE_KEYS, 'Context bundle options');
  if (typeof options.outputDirectory !== 'string' || !path.isAbsolute(options.outputDirectory)) {
    throw new Error('Context output directory must be an absolute path');
  }
  const context = buildSanitizedContext(buildInputs(options));
  const selected = selectedTarget(options);

  const currentBytes = await readAuthenticatedImage(
    options.evidenceRoot,
    selected.evidenceRow.selected_frame.store_relative_path,
    context.current.image_sha256,
  );
  const visualBytes = [];
  for (const entry of context.visual_history) {
    const ledger = options.eligibilityLedger.rows.find((row) => row.history_ordinal === entry.history_ordinal);
    const evidence = options.evidenceInventory.rows[ledger.chronology_index - 1];
    visualBytes.push(await readAuthenticatedImage(
      options.evidenceRoot,
      evidence.selected_frame.store_relative_path,
      entry.image_sha256,
    ));
  }

  const files = [
    { name: 'context.json', contents: `${JSON.stringify(context, null, 2)}\n` },
    { name: 'current.png', contents: currentBytes },
  ];
  for (let index = 0; index < visualBytes.length; index += 1) {
    files.push({
      name: `visual-${String(index + 1).padStart(3, '0')}.png`,
      contents: visualBytes[index],
    });
  }
  await publishAtomicBundle({
    targetDirectory: options.outputDirectory,
    files,
    label: 'Context output directory',
  });
  return context;
}
