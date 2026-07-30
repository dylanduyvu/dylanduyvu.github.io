import { createHash } from 'node:crypto';

import { CANONICAL_CORPUS_SNAPSHOT_SHA256, METHOD } from '../config.mjs';
import { canonicalJson } from './immutable.mjs';
import { normalizeComponent, targetGranularity } from './identity.mjs';
import { buildEligibilityLedger, selectQuantileTargets } from './eligibility.mjs';
import {
  validateCanonicalCorpusSnapshot,
  validateEvidenceArtifact,
} from './task4-validation.mjs';

const SHA256 = /^[0-9a-f]{64}$/;
const TARGET_ID = /^NAP-V5-TARGET-(0[1-9]|1[01])-R1$/;
const SELECTION_KEYS = [
  'version',
  'source_hashes',
  'pool_event_ids',
  'N',
  'formula',
  'selected_positions',
  'selected_event_ids',
];
const SELECTION_SOURCE_KEYS = [
  'corpus_sha256',
  'evidence_inventory_sha256',
  'evidence_review_decisions_sha256',
  'eligibility_ledger_sha256',
];
const TARGET_KEYS = ['app', 'object', 'subtarget'];
const APPROVAL_KEYS = ['approved_by', 'basis', 'catalog_payload_sha256'];
const CATALOG_ENTRY_KEYS = [
  'target_id',
  'target_ordinal',
  'revision',
  'event_id',
  'chronology_index',
  'granularity',
  'canonical_target',
  'accepted_variants',
];
const FRAME_KEYS = [
  'recording_id',
  'locked_source_sha256',
  'decode_index',
  'local_pts',
  'global_pts',
  'age_milliseconds',
  'png_sha256',
  'store_relative_path',
  'width',
  'height',
];
const EVIDENCE_ROW_KEYS = [
  'chronology_index',
  'event_id',
  'evidence_scope',
  'mode',
  'raw_time',
  'anchor_time',
  'interval_predecessor_event_id',
  'searched_recording_ids',
  'selected_frame',
  'automated_checks',
  'automated_recommendation',
  'final_disposition',
  'review_provenance',
];
const CHECK_KEYS = [
  'decodes_successfully',
  'monitor_is_3',
  'timestamp_at_or_before_anchor',
  'age_at_most_5s',
  'dimensions_match',
  'sha256_matches',
];
const REVIEW_PROVENANCE_KEYS = ['reviewer', 'reviewed_at', 'method'];
const ACTUAL_INPUT_METHODS = new Set(['pointer', 'keyboard_enter', 'keyboard_command_w']);
const ACTION_TYPES = new Set(['focus', 'activate']);

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
    throw new Error(`${label} must contain exactly: ${keys.join(', ')}`);
  }
}

function cloneJson(value, label) {
  let encoded;
  try {
    encoded = JSON.stringify(value);
  } catch {
    throw new TypeError(`${label} must be JSON-serializable`);
  }
  if (encoded === undefined) throw new TypeError(`${label} must be JSON-serializable`);
  return JSON.parse(encoded);
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function artifactSha256(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function assertSha(value, label) {
  if (!SHA256.test(value)) throw new Error(`${label} must be a lowercase SHA-256`);
}

function corpusRows(corpusSnapshot) {
  validateCanonicalCorpusSnapshot(corpusSnapshot);
  if (!isPlainObject(corpusSnapshot)
    || !isPlainObject(corpusSnapshot.source)
    || !Array.isArray(corpusSnapshot.rows)
    || corpusSnapshot.rows.length !== 220) {
    throw new Error('A 220-row canonical corpus snapshot is required');
  }
  assertSha(corpusSnapshot.source.sha256, 'Canonical corpus source hash');
  const rows = new Map();
  corpusSnapshot.rows.forEach((row, index) => {
    if (!isPlainObject(row)
      || row.chronology_index !== index + 1
      || typeof row.event_id !== 'string'
      || row.event_id.length === 0
      || rows.has(row.event_id)) {
      throw new Error(`Canonical corpus chronology or event ID is invalid at row ${index + 1}`);
    }
    rows.set(row.event_id, row);
  });
  return rows;
}

function validateSelection(targetSelection, corpusSnapshot) {
  assertExactKeys(targetSelection, SELECTION_KEYS, 'Target selection');
  if (targetSelection.version !== 1) throw new Error('Target selection version must be 1');
  assertExactKeys(targetSelection.source_hashes, SELECTION_SOURCE_KEYS, 'Target selection source hashes');
  for (const [name, value] of Object.entries(targetSelection.source_hashes)) assertSha(value, `Target selection ${name}`);
  if (targetSelection.source_hashes.corpus_sha256 !== CANONICAL_CORPUS_SNAPSHOT_SHA256) {
    throw new Error('Target selection canonical corpus source hash mismatch');
  }
  if (!Array.isArray(targetSelection.pool_event_ids)
    || !Number.isSafeInteger(targetSelection.N)
    || targetSelection.N < METHOD.targetCount
    || targetSelection.N !== targetSelection.pool_event_ids.length
    || new Set(targetSelection.pool_event_ids).size !== targetSelection.pool_event_ids.length
    || targetSelection.pool_event_ids.some((eventId) => typeof eventId !== 'string' || eventId.length === 0)) {
    throw new Error('Target selection final pool IDs or N are invalid');
  }
  if (targetSelection.formula
    !== `Math.floor((i + 0.5) * N / ${METHOD.targetCount})`) {
    throw new Error('Target selection formula is invalid');
  }
  if (!Array.isArray(targetSelection.selected_positions)
    || targetSelection.selected_positions.length !== METHOD.targetCount
    || !Array.isArray(targetSelection.selected_event_ids)
    || targetSelection.selected_event_ids.length !== METHOD.targetCount
    || new Set(targetSelection.selected_event_ids).size !== METHOD.targetCount) {
    throw new Error(
      `Target selection must contain exactly ${METHOD.targetCount} selected positions and IDs`,
    );
  }
  const rows = corpusRows(corpusSnapshot);
  let priorChronology = 0;
  for (const eventId of targetSelection.pool_event_ids) {
    const row = rows.get(eventId);
    if (row === undefined || row.chronology_index <= priorChronology) {
      throw new Error('Target selection pool must contain unique canonical IDs in exact chronology order');
    }
    priorChronology = row.chronology_index;
  }
  const expectedPositions = Array.from(
    { length: METHOD.targetCount },
    (_, index) => Math.floor(
      (index + 0.5) * targetSelection.N / METHOD.targetCount,
    ),
  );
  if (targetSelection.selected_positions.some((position) => !Number.isSafeInteger(position) || position < 0 || position >= targetSelection.N)
    || expectedPositions.some((position, index) => targetSelection.selected_positions[index] !== position)
    || expectedPositions.some((position, index) => targetSelection.selected_event_ids[index] !== targetSelection.pool_event_ids[position])) {
    throw new Error('Target selection positions do not join to the frozen final pool');
  }
}

function validateApproval(value, payloadSha256) {
  assertExactKeys(value, APPROVAL_KEYS, 'Catalog approval provenance');
  if (value.approved_by !== 'dylan') throw new Error('Catalog approval must be explicitly attributed to Dylan');
  if (value.basis !== 'blanket_execution_authorization_2026-07-29') {
    throw new Error('Catalog approval basis must truthfully identify the 2026-07-29 blanket execution authorization');
  }
  if (!SHA256.test(value.catalog_payload_sha256)
    || value.catalog_payload_sha256 !== payloadSha256) {
    throw new Error('Catalog approval payload SHA-256 does not bind the exact catalog payload');
  }
  return cloneJson(value, 'Catalog approval provenance');
}

function validateTarget(value, label) {
  assertExactKeys(value, TARGET_KEYS, label);
  for (const key of TARGET_KEYS) {
    if (value[key] !== null
      && (typeof value[key] !== 'string' || [...value[key]].length > 256)) {
      throw new Error(`${label} component ${key} must be at most 256 code points`);
    }
  }
  const granularity = targetGranularity(value);
  return { target: cloneJson(value, label), granularity };
}

function nullShape(target) {
  return [target.object === null, target.subtarget === null];
}

function normalizedTarget(target) {
  return canonicalJson({
    app: normalizeComponent(target.app),
    object: normalizeComponent(target.object),
    subtarget: normalizeComponent(target.subtarget),
  });
}

function variantsByEvent(variants, selectedIds) {
  if (variants === undefined) return new Map();
  if (!Array.isArray(variants) || variants.length > 15) throw new TypeError('Explicit catalog variants must be an array of at most 15 entries');
  const selected = new Set(selectedIds);
  const output = new Map();
  for (const entry of variants) {
    assertExactKeys(entry, ['event_id', 'accepted_variants'], 'Explicit catalog variant entry');
    if (!selected.has(entry.event_id)) throw new Error(`Explicit variant event is not selected: ${entry.event_id}`);
    if (output.has(entry.event_id)) throw new Error(`Duplicate explicit variant entry: ${entry.event_id}`);
    if (!Array.isArray(entry.accepted_variants)
      || entry.accepted_variants.length === 0
      || entry.accepted_variants.length > 16) {
      throw new Error(`Explicit accepted variants must be nonempty for ${entry.event_id}`);
    }
    output.set(entry.event_id, entry.accepted_variants);
  }
  return output;
}

function catalogPayload(value) {
  return {
    version: value.version,
    source_hashes: cloneJson(value.source_hashes, 'Catalog payload source hashes'),
    targets: cloneJson(value.targets, 'Catalog payload targets'),
  };
}

function validateCanonicalSelection({
  corpusSnapshot,
  evidenceInventory,
  evidenceDecisions,
  videoInventory,
  eligibilityLedger,
  targetSelection,
}) {
  const recomputed = selectQuantileTargets(
    eligibilityLedger,
    { corpusSnapshot, evidenceInventory, evidenceDecisions, videoInventory },
  );
  if (canonicalJson(targetSelection) !== canonicalJson(recomputed)) {
    throw new Error('Target selection does not exactly match canonical eligibility and midpoint-quantile selection');
  }
  if (targetSelection.source_hashes.eligibility_ledger_sha256 !== artifactSha256(eligibilityLedger)) {
    throw new Error('Target selection eligibility ledger SHA-256 mismatch');
  }
}

function canonicalIntegerString(value, { nonnegative = false, positive = false } = {}) {
  if (typeof value !== 'string' || !/^(?:0|-?[1-9]\d*)$/.test(value)) return false;
  const integer = BigInt(value);
  if (nonnegative && integer < 0n) return false;
  if (positive && integer <= 0n) return false;
  return true;
}

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function validateRational(value, label, { nonnegative = false, maximum = null } = {}) {
  assertExactKeys(value, ['numerator', 'denominator'], label);
  if (!canonicalIntegerString(value.numerator, { nonnegative })
    || !canonicalIntegerString(value.denominator, { positive: true })) {
    throw new Error(`${label} must use canonical base-10 integer strings with a positive denominator`);
  }
  const numerator = BigInt(value.numerator);
  const denominator = BigInt(value.denominator);
  if (gcd(numerator, denominator) !== 1n) throw new Error(`${label} must be reduced`);
  if (maximum !== null && numerator > BigInt(maximum) * denominator) {
    throw new Error(`${label} exceeds its maximum`);
  }
}

function validateReviewProvenance(value, eventId) {
  assertExactKeys(value, REVIEW_PROVENANCE_KEYS, `Evidence review provenance ${eventId}`);
  if (value.reviewer !== 'codex_visual_review'
    || typeof value.reviewed_at !== 'string'
    || Number.isNaN(Date.parse(value.reviewed_at))
    || typeof value.method !== 'string'
    || value.method.trim().length === 0) {
    throw new Error(`Evidence review provenance is invalid for ${eventId}`);
  }
}

function validateUsableEvidenceRow(evidence, corpusRow) {
  assertExactKeys(evidence, EVIDENCE_ROW_KEYS, `Evidence row ${corpusRow.event_id}`);
  if (evidence.chronology_index !== corpusRow.chronology_index
    || evidence.event_id !== corpusRow.event_id
    || evidence.evidence_scope !== 'required'
    || evidence.mode !== 'strictly_prior'
    || typeof evidence.raw_time !== 'string'
    || evidence.raw_time.length === 0
    || evidence.interval_predecessor_event_id !== null
    || !Array.isArray(evidence.searched_recording_ids)
    || evidence.searched_recording_ids.length === 0
    || evidence.searched_recording_ids.some((id) => typeof id !== 'string' || !/^\d+$/.test(id))
    || new Set(evidence.searched_recording_ids).size !== evidence.searched_recording_ids.length
    || evidence.automated_recommendation !== 'pending_human'
    || evidence.final_disposition !== 'usable') {
    throw new Error(`Selected evidence row is not a usable Task 3 strictly-prior record for ${corpusRow.event_id}`);
  }
  validateRational(evidence.anchor_time, `Evidence anchor time ${corpusRow.event_id}`);
  validateReviewProvenance(evidence.review_provenance, corpusRow.event_id);
  assertExactKeys(evidence.automated_checks, CHECK_KEYS, `Evidence automated checks ${corpusRow.event_id}`);
  if (CHECK_KEYS.some((key) => evidence.automated_checks[key] !== true)) {
    throw new Error(`Usable evidence automated checks must all pass for ${corpusRow.event_id}`);
  }
  assertExactKeys(evidence.selected_frame, FRAME_KEYS, `Evidence selected frame ${corpusRow.event_id}`);
  const frame = evidence.selected_frame;
  if (typeof frame.recording_id !== 'string'
    || !/^\d+$/.test(frame.recording_id)
    || !SHA256.test(frame.locked_source_sha256)
    || !Number.isSafeInteger(frame.decode_index)
    || frame.decode_index < 0
    || !SHA256.test(frame.png_sha256)
    || frame.store_relative_path !== `evaluator/evidence-store/sha256/${frame.png_sha256.slice(0, 2)}/${frame.png_sha256}.png`
    || !Number.isSafeInteger(frame.width)
    || frame.width <= 0
    || !Number.isSafeInteger(frame.height)
    || frame.height <= 0) {
    throw new Error(`Selected evidence frame provenance or content-addressed path is invalid for ${corpusRow.event_id}`);
  }
  validateRational(frame.local_pts, `Evidence local PTS ${corpusRow.event_id}`);
  validateRational(frame.global_pts, `Evidence global PTS ${corpusRow.event_id}`);
  validateRational(frame.age_milliseconds, `Evidence age ${corpusRow.event_id}`, { nonnegative: true, maximum: 5_000 });
}

function validateCatalog(targetCatalog, targetSelection, corpusSnapshot) {
  const sourceRows = corpusRows(corpusSnapshot);
  assertExactKeys(targetCatalog, ['version', 'source_hashes', 'approval_provenance', 'targets'], 'Target catalog');
  if (targetCatalog.version !== 1) throw new Error('Target catalog version must be 1');
  assertExactKeys(targetCatalog.source_hashes, ['corpus_sha256', 'target_selection_sha256'], 'Target catalog source hashes');
  assertSha(targetCatalog.source_hashes.corpus_sha256, 'Target catalog corpus source hash');
  assertSha(targetCatalog.source_hashes.target_selection_sha256, 'Target catalog selection source hash');
  if (targetCatalog.source_hashes.corpus_sha256 !== CANONICAL_CORPUS_SNAPSHOT_SHA256
    || targetCatalog.source_hashes.target_selection_sha256 !== artifactSha256(targetSelection)) {
    throw new Error('Target catalog source hashes do not match canonical inputs');
  }
  if (!Array.isArray(targetCatalog.targets)
    || targetCatalog.targets.length !== METHOD.targetCount) {
    throw new Error(`Target catalog must contain exactly ${METHOD.targetCount} targets`);
  }
  targetCatalog.targets.forEach((entry, index) => {
    assertExactKeys(entry, CATALOG_ENTRY_KEYS, `Target catalog entry ${index + 1}`);
    const targetId = `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`;
    if (!TARGET_ID.test(entry.target_id)
      || entry.target_id !== targetId
      || entry.target_ordinal !== index + 1
      || entry.revision !== 1
      || entry.event_id !== targetSelection.selected_event_ids[index]
      || !Number.isSafeInteger(entry.chronology_index)
      || entry.chronology_index <= 0) {
      throw new Error(`Target catalog revision or selected join is invalid at ordinal ${index + 1}`);
    }
    const canonical = validateTarget(entry.canonical_target, `Canonical target ${entry.target_id}`);
    const sourceRow = sourceRows.get(entry.event_id);
    if (sourceRow === undefined
      || sourceRow.chronology_index !== entry.chronology_index
      || sourceRow.canonical_status !== 'accepted'
      || sourceRow.history_value !== 'yes'
      || canonicalJson(sourceRow.target) !== canonicalJson(entry.canonical_target)) {
      throw new Error(`Target catalog canonical target does not match the corpus ground truth at ${entry.target_id}`);
    }
    if (sourceRow.input_method !== 'pointer') {
      throw new Error(`Target catalog entries must be pointer-only at ${entry.target_id}`);
    }
    if (entry.granularity !== canonical.granularity) throw new Error(`Target catalog granularity mismatch at ${entry.target_id}`);
    if (!Array.isArray(entry.accepted_variants) || entry.accepted_variants.length === 0) {
      throw new Error(`Target catalog accepted variants are missing at ${entry.target_id}`);
    }
    if (canonicalJson(entry.accepted_variants[0]) !== canonicalJson(entry.canonical_target)) {
      throw new Error(`Canonical target must be the first accepted variant at ${entry.target_id}`);
    }
    const shape = nullShape(entry.canonical_target);
    const identities = new Set();
    for (const variant of entry.accepted_variants) {
      const checked = validateTarget(variant, `Accepted variant ${entry.target_id}`);
      if (checked.granularity !== canonical.granularity
        || nullShape(variant).some((isNull, component) => isNull !== shape[component])) {
        throw new Error(`Accepted variant null shape or granularity mismatch at ${entry.target_id}`);
      }
      const identity = normalizedTarget(variant);
      if (identities.has(identity)) throw new Error(`Duplicate normalized accepted variant at ${entry.target_id}`);
      identities.add(identity);
    }
  });
  validateApproval(targetCatalog.approval_provenance, artifactSha256(catalogPayload(targetCatalog)));
}

export function buildTargetCatalog(options) {
  const optionKeys = Object.hasOwn(options ?? {}, 'variants')
    ? [
      'corpusSnapshot', 'evidenceInventory', 'evidenceDecisions', 'eligibilityLedger',
      'videoInventory', 'targetSelection', 'approvalProvenance', 'variants',
    ]
    : [
      'corpusSnapshot', 'evidenceInventory', 'evidenceDecisions', 'eligibilityLedger',
      'videoInventory', 'targetSelection', 'approvalProvenance',
    ];
  assertExactKeys(options, optionKeys, 'Target catalog options');
  const { corpusSnapshot, targetSelection } = options;
  const rows = corpusRows(corpusSnapshot);
  validateSelection(targetSelection, corpusSnapshot);
  validateCanonicalSelection(options);
  const aliases = variantsByEvent(options.variants, targetSelection.selected_event_ids);
  const targets = targetSelection.selected_event_ids.map((eventId, index) => {
    const row = rows.get(eventId);
    if (row === undefined) throw new Error(`Selected event is missing from the canonical corpus: ${eventId}`);
    if (row.canonical_status !== 'accepted' || row.history_value !== 'yes') {
      throw new Error(`Selected event is not accepted History=yes: ${eventId}`);
    }
    if (row.input_method !== 'pointer') throw new Error(`Selected targets must be pointer-only: ${eventId}`);
    const canonical = validateTarget(row.target, `Canonical target ${eventId}`);
    const acceptedVariants = [canonical.target];
    const shape = nullShape(canonical.target);
    const identities = new Set([normalizedTarget(canonical.target)]);
    for (const variant of aliases.get(eventId) ?? []) {
      const checked = validateTarget(variant, `Explicit accepted variant ${eventId}`);
      if (checked.granularity !== canonical.granularity
        || nullShape(checked.target).some((isNull, component) => isNull !== shape[component])) {
        throw new Error(`Explicit variant null shape or granularity differs from canonical target: ${eventId}`);
      }
      const identity = normalizedTarget(checked.target);
      if (identities.has(identity)) throw new Error(`Explicit variant duplicates an accepted target after normalization: ${eventId}`);
      identities.add(identity);
      acceptedVariants.push(checked.target);
    }
    return {
      target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
      target_ordinal: index + 1,
      revision: 1,
      event_id: eventId,
      chronology_index: row.chronology_index,
      granularity: canonical.granularity,
      canonical_target: canonical.target,
      accepted_variants: acceptedVariants,
    };
  });
  const draft = {
    version: 1,
    source_hashes: {
      corpus_sha256: CANONICAL_CORPUS_SNAPSHOT_SHA256,
      target_selection_sha256: artifactSha256(targetSelection),
    },
    targets,
  };
  if (aliases.size !== 0) {
    throw new Error('The blanket_execution_authorization_2026-07-29 basis authorizes only the canonical-only catalog; variants require a separate explicit review');
  }
  const approvalProvenance = validateApproval(options.approvalProvenance, artifactSha256(draft));
  const output = {
    version: draft.version,
    source_hashes: draft.source_hashes,
    approval_provenance: approvalProvenance,
    targets: draft.targets,
  };
  validateCatalog(output, targetSelection, corpusSnapshot);
  return deepFreeze(output);
}

export function buildEvaluatorManifest(options) {
  assertExactKeys(
    options,
    [
      'corpusSnapshot', 'evidenceInventory', 'evidenceDecisions', 'videoInventory',
      'eligibilityLedger', 'targetSelection', 'targetCatalog',
    ],
    'Evaluator manifest options',
  );
  const {
    corpusSnapshot,
    evidenceInventory,
    evidenceDecisions,
    videoInventory,
    eligibilityLedger,
    targetSelection,
    targetCatalog,
  } = options;
  const rows = corpusRows(corpusSnapshot);
  const canonicalSources = { corpusSnapshot, evidenceInventory, evidenceDecisions, videoInventory };
  validateEvidenceArtifact({ corpusSnapshot, evidenceInventory, videoInventory });
  const rebuiltLedger = buildEligibilityLedger(canonicalSources);
  if (canonicalJson(eligibilityLedger) !== canonicalJson(rebuiltLedger)) {
    throw new Error('Evaluator manifest eligibility ledger does not match canonical source rederivation');
  }
  const rebuiltSelection = selectQuantileTargets(eligibilityLedger, canonicalSources);
  if (canonicalJson(targetSelection) !== canonicalJson(rebuiltSelection)) {
    throw new Error('Evaluator manifest target selection does not match canonical eligibility rederivation');
  }
  const rebuiltCatalog = buildTargetCatalog({
    ...canonicalSources,
    eligibilityLedger,
    targetSelection,
    approvalProvenance: targetCatalog.approval_provenance,
  });
  if (canonicalJson(targetCatalog) !== canonicalJson(rebuiltCatalog)) {
    throw new Error('Evaluator manifest target catalog does not match canonical-only catalog rederivation');
  }
  validateCatalog(targetCatalog, targetSelection, corpusSnapshot);
  if (artifactSha256(evidenceInventory) !== targetSelection.source_hashes.evidence_inventory_sha256) {
    throw new Error('Final evidence inventory artifact hash does not match target selection');
  }
  const evidenceRows = new Map();
  evidenceInventory.rows.forEach((entry, index) => {
    const corpusRow = corpusSnapshot.rows[index];
    assertExactKeys(entry, EVIDENCE_ROW_KEYS, `Evidence row ${index + 1}`);
    if (entry.chronology_index !== corpusRow.chronology_index
      || entry.event_id !== corpusRow.event_id
      || evidenceRows.has(entry.event_id)) {
      throw new Error(`Evidence inventory chronology/order is invalid at row ${index + 1}`);
    }
    evidenceRows.set(entry.event_id, entry);
  });

  const targets = targetCatalog.targets.map((catalogEntry, index) => {
    const row = rows.get(catalogEntry.event_id);
    const evidence = evidenceRows.get(catalogEntry.event_id);
    if (row === undefined || evidence === undefined || row.chronology_index !== catalogEntry.chronology_index) {
      throw new Error(`Evaluator manifest selected join is invalid at ordinal ${index + 1}`);
    }
    if (!ACTION_TYPES.has(row.action_type)) {
      throw new Error(`Evaluator manifest ground-truth action type must be focus or activate for ${row.event_id}`);
    }
    if (!ACTUAL_INPUT_METHODS.has(row.input_method) || row.input_method !== 'pointer') {
      throw new Error(`Evaluator manifest target input method must be pointer and within the frozen actual set for ${row.event_id}`);
    }
    validateUsableEvidenceRow(evidence, row);
    return {
      target_ordinal: index + 1,
      target_id: catalogEntry.target_id,
      event_id: row.event_id,
      chronology_index: row.chronology_index,
      ground_truth_target: cloneJson(row.target, `Ground truth target ${row.event_id}`),
      ground_truth_action_type: row.action_type,
      ground_truth_input_method: row.input_method,
      current_evidence_sha256: evidence.selected_frame.png_sha256,
      evidence_provenance: {
        inventory_sha256: evidenceInventory.inventory_sha256,
        locked_source_sha256: evidence.selected_frame.locked_source_sha256,
        recording_id: evidence.selected_frame.recording_id,
        decode_index: evidence.selected_frame.decode_index,
      },
    };
  });
  return deepFreeze({
    version: 1,
    source_hashes: {
      corpus_sha256: CANONICAL_CORPUS_SNAPSHOT_SHA256,
      evidence_inventory_sha256: artifactSha256(evidenceInventory),
      target_selection_sha256: artifactSha256(targetSelection),
      target_catalog_sha256: artifactSha256(targetCatalog),
    },
    provenance: {
      visibility: 'evaluator_only',
      catalog_approval: cloneJson(targetCatalog.approval_provenance, 'Catalog approval provenance'),
    },
    targets,
  });
}
