import { CANONICAL_CORPUS_SNAPSHOT_SHA256, METHOD } from '../config.mjs';
import { serializeHistoryRow } from './corpus.mjs';
import { canonicalJson } from './immutable.mjs';
import { normalizeComponent, targetGranularity } from './identity.mjs';
import {
  artifactSha256,
  validateCanonicalCorpusSnapshot,
  validateEvidenceArtifact,
} from './task4-validation.mjs';

const SHA256 = /^[0-9a-f]{64}$/;
const DISPOSITIONS = new Set([
  'usable',
  'missing',
  'stale_over_5s',
  'post_action_risk',
  'timing_unresolvable',
  'wrong_monitor',
  'corrupt_or_unreadable',
  'same_time_interval_unrecoverable',
]);
const PLACEHOLDERS = new Set([
  'unknown',
  'some message',
  'some page',
  'some file',
  'unresolved',
  'tbd',
  'n/a',
  '?',
]);
const DECISION_KEYS = ['chronology_index', 'event_id', 'disposition'];
const DECISION_KEYS_WITH_NOTE = [...DECISION_KEYS, 'reviewer_note'];
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
const REVIEW_PROVENANCE_KEYS = ['reviewer', 'reviewed_at', 'method'];
const LEDGER_ROW_KEYS = [
  'chronology_index',
  'event_id',
  'history_ordinal',
  'history_eligible',
  'history_reason_codes',
  'visual_eligible',
  'visual_reason_codes',
  'target_eligible',
  'target_reason_codes',
  'evidence_disposition',
  'evidence_sha256',
  'earlier_usable_visual_count',
];

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

function validateSources(corpusSnapshot, evidenceInventory, videoInventory) {
  validateCanonicalCorpusSnapshot(corpusSnapshot);
  validateEvidenceArtifact({ corpusSnapshot, evidenceInventory, videoInventory });
  if (!isPlainObject(corpusSnapshot)
    || !isPlainObject(corpusSnapshot.source)
    || !SHA256.test(corpusSnapshot.source.sha256)
    || !Array.isArray(corpusSnapshot.rows)
    || corpusSnapshot.rows.length !== 220) {
    throw new Error('Eligibility requires a 220-row corpus snapshot with a source SHA-256');
  }
  assertExactKeys(evidenceInventory, ['version', 'inventory_sha256', 'provenance', 'rows'], 'Evidence inventory');
  if (evidenceInventory.version !== 1
    || !SHA256.test(evidenceInventory.inventory_sha256)
    || !isPlainObject(evidenceInventory.provenance)
    || !Array.isArray(evidenceInventory.rows)
    || evidenceInventory.rows.length !== 220) {
    throw new Error('Eligibility requires a 220-row evidence inventory with an inventory SHA-256');
  }
  const ids = new Set();
  let acceptedHistoryCount = 0;
  for (let index = 0; index < 220; index += 1) {
    const row = corpusSnapshot.rows[index];
    const evidence = evidenceInventory.rows[index];
    assertExactKeys(evidence, EVIDENCE_ROW_KEYS, `Evidence row ${index + 1}`);
    if (!isPlainObject(row)
      || row.chronology_index !== index + 1
      || typeof row.event_id !== 'string'
      || row.event_id.length === 0
      || ids.has(row.event_id)) {
      throw new Error(`Corpus chronology or event ID is invalid at row ${index + 1}`);
    }
    ids.add(row.event_id);
    if (!isPlainObject(evidence)
      || evidence.chronology_index !== row.chronology_index
      || evidence.event_id !== row.event_id) {
      throw new Error(`Evidence chronology/order mismatch at ${row.event_id}`);
    }
    const acceptedHistory = row.canonical_status === 'accepted' && row.history_value === 'yes';
    if (evidence.evidence_scope !== (acceptedHistory ? 'required' : 'not_required')) {
      throw new Error(`Evidence scope does not match history eligibility at ${row.event_id}`);
    }
    if (acceptedHistory) {
      if (!DISPOSITIONS.has(evidence.final_disposition)) {
        throw new Error(`Required evidence final disposition is invalid at ${row.event_id}`);
      }
      assertExactKeys(evidence.review_provenance, REVIEW_PROVENANCE_KEYS, `Evidence review provenance ${row.event_id}`);
      if (evidence.review_provenance.reviewer !== 'codex_visual_review'
        || typeof evidence.review_provenance.reviewed_at !== 'string'
        || Number.isNaN(Date.parse(evidence.review_provenance.reviewed_at))
        || typeof evidence.review_provenance.method !== 'string'
        || evidence.review_provenance.method.trim().length === 0) {
        throw new Error(`Evidence review provenance must be a nonnull Codex visual review at ${row.event_id}`);
      }
    } else if (evidence.final_disposition !== null || evidence.review_provenance !== null) {
      throw new Error(`Non-history evidence must have null final disposition and review provenance at ${row.event_id}`);
    }
    if (acceptedHistory) acceptedHistoryCount += 1;
  }
  if (acceptedHistoryCount !== 196) throw new Error('Eligibility requires exactly 196 accepted History=yes rows');
}

function normalizedText(value) {
  return typeof value === 'string' ? normalizeComponent(value) : null;
}

function componentIsPlaceholder(value) {
  const normalized = normalizedText(value);
  return normalized !== null
    && (PLACEHOLDERS.has(normalized) || /^.+\s+or\s+.+$/u.test(normalized));
}

function targetHasPlaceholder(target) {
  if (!isPlainObject(target)) return false;
  return ['app', 'object', 'subtarget'].some((key) => componentIsPlaceholder(target[key]));
}

function targetParses(row) {
  try {
    targetGranularity(row.target);
    return true;
  } catch {
    return false;
  }
}

function isExplicitNo(value) {
  return normalizedText(value) === 'no';
}

function evidenceHash(evidence, disposition, eventId) {
  const value = evidence.selected_frame?.png_sha256 ?? null;
  if (value !== null && !SHA256.test(value)) throw new Error(`Evidence PNG SHA-256 is invalid for ${eventId}`);
  if (disposition === 'usable' && value === null) throw new Error(`Usable evidence requires a PNG SHA-256 for ${eventId}`);
  return value;
}

function selectPositions(N, count) {
  if (!Number.isSafeInteger(N) || N < count) throw new Error(`Eligible target pool has fewer than ${count} rows`);
  return Array.from({ length: count }, (_, index) => Math.floor((index + 0.5) * N / count));
}

export function validateEvidenceDecisions(value, options) {
  assertExactKeys(
    options,
    ['corpusSnapshot', 'evidenceInventory', 'videoInventory'],
    'Evidence decision source options',
  );
  const { corpusSnapshot, evidenceInventory, videoInventory } = options;
  assertExactKeys(
    value,
    ['version', 'inventory_sha256', 'review_provenance', 'decisions'],
    'Evidence review decisions',
  );
  validateSources(corpusSnapshot, evidenceInventory, videoInventory);
  if (value.version !== 1) throw new Error('Evidence review decisions version must be 1');
  if (value.inventory_sha256 !== evidenceInventory.inventory_sha256) {
    throw new Error('Evidence review decisions inventory SHA-256 mismatch');
  }
  if (!Array.isArray(value.decisions) || value.decisions.length !== 196) {
    throw new Error('Evidence review decisions must contain exactly 196 decisions');
  }
  assertExactKeys(
    value.review_provenance,
    REVIEW_PROVENANCE_KEYS,
    'Evidence decision review provenance',
  );
  const reviewedAt = value.review_provenance.reviewed_at;
  if (value.review_provenance.reviewer !== 'codex_visual_review'
    || typeof reviewedAt !== 'string'
    || Number.isNaN(Date.parse(reviewedAt))
    || new Date(reviewedAt).toISOString() !== reviewedAt
    || typeof value.review_provenance.method !== 'string'
    || value.review_provenance.method.length === 0
    || value.review_provenance.method !== value.review_provenance.method.trim()) {
    throw new Error('Evidence decision review provenance must be explicit, canonical, and authenticated');
  }
  const required = corpusSnapshot.rows.filter((row) => row.canonical_status === 'accepted' && row.history_value === 'yes');
  value.decisions.forEach((decision, index) => {
    const allowedKeys = Object.hasOwn(decision ?? {}, 'reviewer_note') ? DECISION_KEYS_WITH_NOTE : DECISION_KEYS;
    assertExactKeys(decision, allowedKeys, `Evidence decision ${index + 1}`);
    const row = required[index];
    if (decision.chronology_index !== row.chronology_index || decision.event_id !== row.event_id) {
      throw new Error(`Evidence decision order or chronology mismatch at decision ${index + 1}`);
    }
    if (!DISPOSITIONS.has(decision.disposition)) {
      throw new Error(`Evidence disposition is invalid at ${decision.event_id}`);
    }
    const evidence = evidenceInventory.rows[row.chronology_index - 1];
    if (decision.disposition !== evidence.final_disposition) {
      throw new Error(`Evidence decision disposition must match its bound inventory row at ${decision.event_id}`);
    }
    if (canonicalJson(evidence.review_provenance) !== canonicalJson(value.review_provenance)) {
      throw new Error(`Evidence decision review provenance must match its bound inventory row at ${decision.event_id}`);
    }
    if (Object.hasOwn(decision, 'reviewer_note')
      && (typeof decision.reviewer_note !== 'string'
        || decision.reviewer_note.length === 0
        || decision.reviewer_note !== decision.reviewer_note.trim()
        || /[\u0000-\u001f\u007f]/u.test(decision.reviewer_note)
        || [...decision.reviewer_note].length > 2_000)) {
      throw new Error(`Evidence decision reviewer_note must be trimmed control-free text of at most 2000 code points at ${decision.event_id}`);
    }
  });
  return deepFreeze(cloneJson(value, 'Evidence review decisions'));
}

export function buildEligibilityLedger(options) {
  assertExactKeys(options, ['corpusSnapshot', 'evidenceInventory', 'evidenceDecisions', 'videoInventory'], 'Eligibility options');
  const { corpusSnapshot, evidenceInventory, videoInventory } = options;
  const evidenceDecisions = validateEvidenceDecisions(options.evidenceDecisions, { corpusSnapshot, evidenceInventory, videoInventory });
  const decisions = new Map(evidenceDecisions.decisions.map((decision) => [decision.event_id, decision]));

  let historyOrdinal = 0;
  let earlierUsableVisualCount = 0;
  const rows = corpusSnapshot.rows.map((row, index) => {
    const evidence = evidenceInventory.rows[index];
    const statusAccepted = row.canonical_status === 'accepted';
    const historyYes = row.history_value === 'yes';
    const historyEligible = statusAccepted && historyYes;
    const historyReasonCodes = [];
    if (!statusAccepted) historyReasonCodes.push('status_not_accepted');
    if (!historyYes) historyReasonCodes.push('history_not_yes');
    if (historyEligible) {
      if (row.input_method === 'unknown') {
        throw new Error(`Accepted History=yes input method unknown is invalid for the frozen corpus at ${row.event_id}`);
      }
      historyOrdinal += 1;
      serializeHistoryRow(row, historyOrdinal);
      historyReasonCodes.push('history_eligible');
    }

    const decision = decisions.get(row.event_id);
    const disposition = decision?.disposition ?? 'missing';
    const visualEligible = historyEligible && disposition === 'usable';
    const visualReasonCodes = disposition === 'usable'
      ? ['visual_usable']
      : [`evidence_${disposition}`];
    const pngSha256 = evidenceHash(evidence, disposition, row.event_id);

    const targetReasonCodes = [];
    if (!statusAccepted) targetReasonCodes.push('status_not_accepted');
    if (!historyYes) targetReasonCodes.push('history_not_yes');
    if (row.input_method === 'keyboard_enter') targetReasonCodes.push('excluded_prompt_submission');
    if (row.input_method === 'keyboard_command_w') targetReasonCodes.push('excluded_command_w');
    if (isExplicitNo(row.demo_value)) targetReasonCodes.push('demo_explicit_no');
    if (isExplicitNo(row.shortcut_value)) targetReasonCodes.push('shortcut_explicit_no');
    if (targetHasPlaceholder(row.target)) targetReasonCodes.push('target_placeholder');
    if (!targetParses(row)) targetReasonCodes.push('target_parse_failed');
    if (!visualEligible) targetReasonCodes.push('current_evidence_not_usable');
    if (earlierUsableVisualCount < 10) targetReasonCodes.push('fewer_than_10_prior_usable_visuals');
    const targetEligible = targetReasonCodes.length === 0;
    if (targetEligible) targetReasonCodes.push('target_eligible');

    const output = {
      chronology_index: row.chronology_index,
      event_id: row.event_id,
      history_ordinal: historyEligible ? historyOrdinal : null,
      history_eligible: historyEligible,
      history_reason_codes: historyReasonCodes,
      visual_eligible: visualEligible,
      visual_reason_codes: visualReasonCodes,
      target_eligible: targetEligible,
      target_reason_codes: targetReasonCodes,
      evidence_disposition: decision?.disposition ?? null,
      evidence_sha256: pngSha256,
      earlier_usable_visual_count: earlierUsableVisualCount,
    };
    assertExactKeys(output, LEDGER_ROW_KEYS, `Eligibility row ${row.event_id}`);
    if (visualEligible) earlierUsableVisualCount += 1;
    return output;
  });

  return deepFreeze({
    version: 1,
    source_hashes: {
      corpus_sha256: CANONICAL_CORPUS_SNAPSHOT_SHA256,
      evidence_inventory_sha256: artifactSha256(evidenceInventory),
      evidence_review_decisions_sha256: artifactSha256(evidenceDecisions),
    },
    rows,
  });
}

export function selectQuantileTargets(eligibilityLedger, sources) {
  assertExactKeys(
    sources,
    ['corpusSnapshot', 'evidenceInventory', 'evidenceDecisions', 'videoInventory'],
    'Target selection canonical source options',
  );
  assertExactKeys(eligibilityLedger, ['version', 'source_hashes', 'rows'], 'Eligibility ledger');
  if (eligibilityLedger.version !== 1) throw new Error('Eligibility ledger version must be 1');
  assertExactKeys(
    eligibilityLedger.source_hashes,
    ['corpus_sha256', 'evidence_inventory_sha256', 'evidence_review_decisions_sha256'],
    'Eligibility source hashes',
  );
  for (const [name, value] of Object.entries(eligibilityLedger.source_hashes)) {
    if (!SHA256.test(value)) throw new Error(`Eligibility source hash is invalid: ${name}`);
  }
  if (!Array.isArray(eligibilityLedger.rows) || eligibilityLedger.rows.length !== 220) {
    throw new Error('Eligibility ledger must contain exactly 220 rows');
  }
  const recomputed = buildEligibilityLedger(sources);
  if (canonicalJson(eligibilityLedger) !== canonicalJson(recomputed)) {
    throw new Error('Supplied eligibility ledger does not exactly match the canonical recomputed ledger');
  }
  const poolEventIds = recomputed.rows
    .filter((row, index) => {
      assertExactKeys(row, LEDGER_ROW_KEYS, `Eligibility row ${index + 1}`);
      if (row.chronology_index !== index + 1 || typeof row.event_id !== 'string') {
        throw new Error('Eligibility ledger chronology is invalid');
      }
      return row.target_eligible === true;
    })
    .map((row) => row.event_id);
  const N = poolEventIds.length;
  const selectedPositions = selectPositions(N, METHOD.targetCount);
  return deepFreeze({
    version: 1,
    source_hashes: {
      corpus_sha256: eligibilityLedger.source_hashes.corpus_sha256,
      evidence_inventory_sha256: eligibilityLedger.source_hashes.evidence_inventory_sha256,
      evidence_review_decisions_sha256: eligibilityLedger.source_hashes.evidence_review_decisions_sha256,
      eligibility_ledger_sha256: artifactSha256(recomputed),
    },
    pool_event_ids: poolEventIds,
    N,
    formula: `Math.floor((i + 0.5) * N / ${METHOD.targetCount})`,
    selected_positions: selectedPositions,
    selected_event_ids: selectedPositions.map((position) => poolEventIds[position]),
  });
}
