import assert from 'node:assert/strict';
import test from 'node:test';

import * as eligibility from '../lib/eligibility.mjs';
import {
  canonicalCorpusSnapshot,
  evidenceInventoryHash,
  makeTask4Sources,
} from './task4-fixtures.mjs';

const SHA_A = 'a'.repeat(64);

const makeCorpus = () => structuredClone(canonicalCorpusSnapshot);

function buildInputs(overrides = {}) {
  const corpusSnapshot = overrides.corpusSnapshot ?? makeCorpus();
  const base = makeTask4Sources({
    corpusSnapshot,
    usableTargetCount: overrides.usableTargetCount ?? 84,
  });
  return {
    corpusSnapshot,
    evidenceInventory: overrides.evidenceInventory ?? base.evidenceInventory,
    evidenceDecisions: overrides.evidenceDecisions ?? base.evidenceDecisions,
    videoInventory: overrides.videoInventory ?? base.videoInventory,
  };
}

function build(overrides = {}) {
  return eligibility.buildEligibilityLedger(buildInputs(overrides));
}

function rehashEvidence(evidenceInventory) {
  evidenceInventory.inventory_sha256 = evidenceInventoryHash(evidenceInventory);
  return evidenceInventory;
}

function rebindEvidenceSources(sources) {
  rehashEvidence(sources.evidenceInventory);
  sources.evidenceDecisions.inventory_sha256 = sources.evidenceInventory.inventory_sha256;
  return sources;
}

function validateSources(sources) {
  return eligibility.validateEvidenceDecisions(sources.evidenceDecisions, {
    corpusSnapshot: sources.corpusSnapshot,
    evidenceInventory: sources.evidenceInventory,
    videoInventory: sources.videoInventory,
  });
}

function emptyAutomatedChecks() {
  return {
    decodes_successfully: null,
    monitor_is_3: null,
    timestamp_at_or_before_anchor: null,
    age_at_most_5s: null,
    dimensions_match: null,
    sha256_matches: null,
  };
}

function reducedBigIntRational(numerator, denominator = 1n) {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  let left = n < 0n ? -n : n;
  let right = d < 0n ? -d : d;
  while (right !== 0n) [left, right] = [right, left % right];
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  return { numerator: n / left, denominator: d / left };
}

test('exports exactly the three frozen eligibility functions', () => {
  assert.deepEqual(Object.keys(eligibility).sort(), [
    'buildEligibilityLedger',
    'selectQuantileTargets',
    'validateEvidenceDecisions',
  ]);
});

test('validates exactly 196 ordered evidence decisions and freezes the validated graph', () => {
  const sources = buildInputs();
  const validated = eligibility.validateEvidenceDecisions(sources.evidenceDecisions, {
    corpusSnapshot: sources.corpusSnapshot,
    evidenceInventory: sources.evidenceInventory,
    videoInventory: sources.videoInventory,
  });
  assert.deepEqual(validated, sources.evidenceDecisions);
  assert.equal(validated.decisions.length, 196);
  assert.ok(Object.isFrozen(validated));
  assert.ok(Object.isFrozen(validated.decisions));
  assert.ok(Object.isFrozen(validated.decisions[0]));
  assert.throws(() => validated.decisions.push(validated.decisions[0]), TypeError);
});

test('rejects missing, extra, out-of-order, wrong-hash, invalid, empty-note, and extra-key decisions', () => {
  const sources = buildInputs();
  const { corpusSnapshot: corpus, evidenceInventory: evidence, videoInventory } = sources;
  const base = sources.evidenceDecisions;
  const options = (evidenceInventory = evidence) => ({ corpusSnapshot: corpus, evidenceInventory, videoInventory });
  const mutation = (change) => ({ ...base, decisions: base.decisions.map((decision, index) => index === 0 ? change(decision) : decision) });
  assert.throws(() => eligibility.validateEvidenceDecisions({ ...base, decisions: base.decisions.slice(1) }, options()), /196|missing|count/i);
  assert.throws(() => eligibility.validateEvidenceDecisions({ ...base, decisions: [...base.decisions, base.decisions[0]] }, options()), /196|extra|count/i);
  assert.throws(() => eligibility.validateEvidenceDecisions({ ...base, decisions: [base.decisions[1], base.decisions[0], ...base.decisions.slice(2)] }, options()), /order|chronology|event/i);
  assert.throws(() => eligibility.validateEvidenceDecisions({ ...base, inventory_sha256: SHA_A }, options()), /inventory.*sha|hash/i);
  assert.throws(() => eligibility.validateEvidenceDecisions(mutation((decision) => ({ ...decision, disposition: 'pending_human' })), options()), /disposition/i);
  assert.throws(() => eligibility.validateEvidenceDecisions(mutation((decision) => ({ ...decision, reviewer_note: '   ' })), options()), /reviewer.note|nonempty/i);
  assert.throws(() => eligibility.validateEvidenceDecisions(mutation((decision) => ({ ...decision, reviewer_note: ' padded ' })), options()), /reviewer.note|trim|text/i);
  assert.throws(() => eligibility.validateEvidenceDecisions(mutation((decision) => ({ ...decision, reviewer_note: 'control\u0000character' })), options()), /reviewer.note|control|text/i);
  assert.throws(() => eligibility.validateEvidenceDecisions(mutation((decision) => ({ ...decision, reviewer_note: 'x'.repeat(2_001) })), options()), /reviewer.note|length|2000/i);
  assert.throws(() => eligibility.validateEvidenceDecisions(mutation((decision) => ({ ...decision, extra: true })), options()), /exact/i);
  const wrongScope = rehashEvidence(structuredClone(evidence));
  wrongScope.rows[0].evidence_scope = 'not_required';
  rehashEvidence(wrongScope);
  const wrongScopeDecisions = { ...base, inventory_sha256: wrongScope.inventory_sha256 };
  assert.throws(() => eligibility.validateEvidenceDecisions(wrongScopeDecisions, options(wrongScope)), /scope|required|history/i);
  const conflictingEvidence = structuredClone(evidence);
  conflictingEvidence.rows[0].final_disposition = 'post_action_risk';
  assert.throws(() => eligibility.validateEvidenceDecisions(base, options(conflictingEvidence)), /match|bound|disposition/i);
  const fakeReview = structuredClone(evidence);
  fakeReview.rows[0].review_provenance.reviewer = 'dylan';
  assert.throws(() => eligibility.validateEvidenceDecisions(base, options(fakeReview)), /codex|review|provenance/i);
  for (const reviewedAt of ['0', '2026-07-30T12:00:00Z', '2026-02-30T00:00:00.000Z']) {
    const invalidDate = structuredClone(evidence);
    invalidDate.rows[0].review_provenance.reviewed_at = reviewedAt;
    assert.throws(() => eligibility.validateEvidenceDecisions(base, options(invalidDate)), /review|timestamp|UTC|canonical/i);
  }
  const forgedCorpus = structuredClone(corpus);
  forgedCorpus.rows[0].event_id = 'BLOG-V4-INVENTED';
  assert.throws(() => eligibility.validateEvidenceDecisions(base, { ...options(), corpusSnapshot: forgedCorpus }), /canonical|snapshot|sha|hash/i);
  const forgedInventory = structuredClone(evidence);
  forgedInventory.rows[0].raw_time = 'invented';
  assert.throws(() => eligibility.validateEvidenceDecisions(base, options(forgedInventory)), /inventory|sha|hash/i);

  const unexpectedlyAccepted = [];
  const mustReject = (label, sources) => {
    try {
      validateSources(rebindEvidenceSources(sources));
      unexpectedlyAccepted.push(label);
    } catch {
      // Expected: each mutation must be rejected by source-bound validation.
    }
  };

  const suppressedCandidate = buildInputs();
  const suppressedRow = suppressedCandidate.evidenceInventory.rows.find((row) => (
    row.mode === 'strictly_prior'
    && row.selected_frame !== null
    && row.final_disposition === 'usable'
  ));
  suppressedRow.selected_frame = null;
  suppressedRow.automated_checks = emptyAutomatedChecks();
  suppressedRow.automated_recommendation = 'missing';
  suppressedRow.final_disposition = 'missing';
  suppressedCandidate.evidenceInventory.provenance.inputs.ffmpeg = suppressedCandidate
    .evidenceInventory.provenance.inputs.ffmpeg
    .filter((entry) => entry.event_id !== suppressedRow.event_id);
  suppressedCandidate.evidenceDecisions.decisions
    .find((decision) => decision.event_id === suppressedRow.event_id)
    .disposition = 'missing';
  mustReject('strictly-prior null suppressed a deterministic candidate', suppressedCandidate);

  const nullStale = buildInputs();
  const nullStaleRow = nullStale.evidenceInventory.rows.find((row) => (
    row.mode === 'strictly_prior' && row.selected_frame === null
  ));
  nullStaleRow.automated_recommendation = 'stale_over_5s';
  nullStaleRow.final_disposition = 'stale_over_5s';
  nullStale.evidenceDecisions.decisions
    .find((decision) => decision.event_id === nullStaleRow.event_id)
    .disposition = 'stale_over_5s';
  mustReject('strictly-prior null frame was labelled stale', nullStale);

  for (const mode of ['timing_unresolvable', 'same_time_interval']) {
    const claimedCheck = buildInputs();
    const claimedCheckRow = claimedCheck.evidenceInventory.rows.find((row) => row.mode === mode);
    claimedCheckRow.automated_checks.decodes_successfully = true;
    mustReject(`${mode} claimed an automated check`, claimedCheck);
  }

  const invalidVersionSuffixes = ['invented', 'placeholder', 'redacted', 'unknown', '8.0...'];
  for (const suffix of invalidVersionSuffixes) {
    const inventedProbe = buildInputs();
    const version = `ffprobe version ${suffix}`;
    inventedProbe.videoInventory.tool_provenance.version = version;
    inventedProbe.evidenceInventory.provenance.inputs.ffprobe.version = version;
    mustReject(`ffprobe accepted ${suffix}`, inventedProbe);

    const inventedExtraction = buildInputs();
    inventedExtraction.evidenceInventory.provenance.inputs.ffmpeg[0].version = `ffmpeg version ${suffix}`;
    mustReject(`ffmpeg accepted ${suffix}`, inventedExtraction);
  }

  const unselectedProvenance = buildInputs();
  const unselectedRow = unselectedProvenance.evidenceInventory.rows.find((row) => (
    row.mode === 'strictly_prior' && row.selected_frame === null
  ));
  const forgedFfmpeg = structuredClone(unselectedProvenance.evidenceInventory.provenance.inputs.ffmpeg[0]);
  forgedFfmpeg.event_id = unselectedRow.event_id;
  unselectedProvenance.evidenceInventory.provenance.inputs.ffmpeg.push(forgedFfmpeg);
  assert.throws(
    () => validateSources(rebindEvidenceSources(unselectedProvenance)),
    /ffmpeg|selected frame|unselected evidence|exactly cover/i,
  );

  assert.deepEqual(
    unexpectedlyAccepted,
    [],
    `Evidence validation accepted forbidden mutations: ${unexpectedlyAccepted.join(', ')}`,
  );
});

test('builds one exact eligibility row per canonical event with nullable history ordinals', () => {
  const ledger = build();
  assert.deepEqual(Object.keys(ledger), ['version', 'source_hashes', 'rows']);
  assert.equal(ledger.rows.length, 220);
  assert.deepEqual(Object.keys(ledger.rows[0]), [
    'chronology_index', 'event_id', 'history_ordinal',
    'history_eligible', 'history_reason_codes',
    'visual_eligible', 'visual_reason_codes',
    'target_eligible', 'target_reason_codes',
    'evidence_disposition', 'evidence_sha256',
    'earlier_usable_visual_count',
  ]);
  const historyRows = ledger.rows.filter((row) => row.history_eligible);
  const nonhistory = ledger.rows.find((row) => !row.history_eligible);
  assert.equal(historyRows[0].history_ordinal, 1);
  assert.equal(historyRows.at(-1).history_ordinal, 196);
  assert.equal(nonhistory.history_ordinal, null);
  assert.ok(nonhistory.history_reason_codes.includes('status_not_accepted'));
});

test('records every applicable target failure in frozen predicate order and only one positive reason', () => {
  const ledger = build();
  const order = [
    'status_not_accepted', 'history_not_yes', 'excluded_prompt_submission',
    'excluded_command_w', 'demo_explicit_no', 'shortcut_explicit_no',
    'target_placeholder', 'target_parse_failed', 'current_evidence_not_usable',
    'fewer_than_10_prior_usable_visuals',
  ];
  for (const row of ledger.rows) {
    if (row.target_eligible) assert.deepEqual(row.target_reason_codes, ['target_eligible']);
    else assert.deepEqual(row.target_reason_codes, [...row.target_reason_codes].sort((left, right) => order.indexOf(left) - order.indexOf(right)));
  }
  const forged = makeCorpus();
  forged.rows[0].event_id = 'BLOG-V4-INVENTED';
  assert.throws(() => build({ corpusSnapshot: forged }), /canonical|snapshot|sha|hash/i);
});

test('keeps Enter and Command-W in history while excluding both from targets', () => {
  const corpus = makeCorpus();
  const rows = build().rows;
  const enterIndex = corpus.rows.findIndex((row) => row.input_method === 'keyboard_enter');
  const commandWIndex = corpus.rows.findIndex((row) => row.input_method === 'keyboard_command_w');
  assert.equal(rows[enterIndex].history_eligible, true);
  assert.equal(rows[commandWIndex].history_eligible, true);
  assert.ok(rows[enterIndex].target_reason_codes.includes('excluded_prompt_submission'));
  assert.ok(rows[commandWIndex].target_reason_codes.includes('excluded_command_w'));
});

test('treats only explicit Demo or Shortcut no as ineligible and keeps pending or unrated eligible', () => {
  const corpus = makeCorpus();
  const rows = build().rows;
  const pendingIndex = corpus.rows.findIndex((row) => row.input_method === 'pointer' && row.demo_value === 'pending' && row.shortcut_value === 'unrated' && rows[row.chronology_index - 1].target_eligible);
  const noIndex = corpus.rows.findIndex((row) => row.demo_value === 'no' && row.shortcut_value === 'no');
  assert.deepEqual(rows[pendingIndex].target_reason_codes, ['target_eligible']);
  assert.ok(rows[noIndex].target_reason_codes.includes('demo_explicit_no'));
  assert.ok(rows[noIndex].target_reason_codes.includes('shortcut_explicit_no'));
});

test('rejects normalized placeholders and exact unresolved alternatives but not editor/body', () => {
  const corpus = makeCorpus();
  const rows = build().rows;
  const editorIndex = corpus.rows.findIndex((row) => row.target.subtarget === 'editor/body' && rows[row.chronology_index - 1].target_eligible);
  assert.ok(editorIndex >= 0);
  assert.equal(rows[editorIndex].target_reason_codes.includes('target_placeholder'), false);
  const forged = makeCorpus();
  forged.rows[editorIndex].target.object = 'Arc or Safari';
  assert.throws(() => build({ corpusSnapshot: forged }), /canonical|snapshot|sha|hash/i);
});

test('requires usable current evidence and serializes the evidence disposition and PNG hash', () => {
  const sources = buildInputs();
  const original = eligibility.buildEligibilityLedger(sources);
  const index = original.rows.findIndex((row) => row.target_eligible);
  const eventId = original.rows[index].event_id;
  assert.equal(original.rows[index].visual_eligible, true);
  assert.deepEqual(original.rows[index].visual_reason_codes, ['visual_usable']);
  assert.equal(original.rows[index].evidence_sha256, sources.evidenceInventory.rows[index].selected_frame.png_sha256);
  const evidence = structuredClone(sources.evidenceInventory);
  const decisions = structuredClone(sources.evidenceDecisions);
  evidence.rows[index].final_disposition = 'post_action_risk';
  decisions.decisions.find((decision) => decision.event_id === eventId).disposition = 'post_action_risk';
  const ledger = eligibility.buildEligibilityLedger({ ...sources, evidenceInventory: evidence, evidenceDecisions: decisions });
  assert.equal(ledger.rows[index].visual_eligible, false);
  assert.deepEqual(ledger.rows[index].visual_reason_codes, ['evidence_post_action_risk']);
  assert.ok(ledger.rows[index].target_reason_codes.includes('current_evidence_not_usable'));

  const staleSources = buildInputs();
  const staleIndex = staleSources.evidenceInventory.rows.findIndex((row) => row.event_id === 'BLOG-V4-129');
  const staleEvidence = staleSources.evidenceInventory.rows[staleIndex];
  const staleDecision = staleSources.evidenceDecisions.decisions.find((decision) => decision.event_id === staleEvidence.event_id);
  const staleVideo = staleSources.videoInventory.files.find((file) => file.recording_id === staleEvidence.selected_frame.recording_id);
  assert.equal(staleVideo.frames.length, 1);
  const staleLocalMilliseconds = BigInt(staleSources.corpusSnapshot.rows[staleIndex].parsed_time.seconds - 7) * 1_000n;
  const staleGlobalMilliseconds = BigInt(staleVideo.recording_id) + staleLocalMilliseconds;
  staleVideo.frames[0].pts = staleLocalMilliseconds;
  staleVideo.frames[0].best_effort_timestamp = staleLocalMilliseconds;
  staleVideo.frames[0].local_seconds = reducedBigIntRational(staleLocalMilliseconds, 1_000n);
  staleVideo.frames[0].global_seconds = reducedBigIntRational(staleGlobalMilliseconds, 1_000n);
  staleEvidence.selected_frame.local_pts = {
    numerator: String(staleVideo.frames[0].local_seconds.numerator),
    denominator: String(staleVideo.frames[0].local_seconds.denominator),
  };
  staleEvidence.selected_frame.global_pts = {
    numerator: String(staleVideo.frames[0].global_seconds.numerator),
    denominator: String(staleVideo.frames[0].global_seconds.denominator),
  };
  staleEvidence.selected_frame.age_milliseconds = { numerator: '6000', denominator: '1' };
  staleEvidence.automated_checks.age_at_most_5s = false;
  staleEvidence.automated_recommendation = 'stale_over_5s';
  staleEvidence.final_disposition = 'stale_over_5s';
  staleDecision.disposition = 'stale_over_5s';
  rehashEvidence(staleSources.evidenceInventory);
  staleSources.evidenceDecisions.inventory_sha256 = staleSources.evidenceInventory.inventory_sha256;
  const staleLedger = eligibility.buildEligibilityLedger(staleSources);
  assert.equal(staleLedger.rows[staleIndex].visual_eligible, false);
  assert.deepEqual(staleLedger.rows[staleIndex].visual_reason_codes, ['evidence_stale_over_5s']);
});

test('requires at least ten strictly earlier usable visual-history rows', () => {
  const rows = build().rows;
  const fewer = rows.find((row) => row.earlier_usable_visual_count === 9 && row.visual_eligible);
  const eligible = rows.find((row) => row.target_eligible);
  assert.ok(fewer.target_reason_codes.includes('fewer_than_10_prior_usable_visuals'));
  assert.ok(eligible.earlier_usable_visual_count >= 10);
  assert.deepEqual(eligible.target_reason_codes, ['target_eligible']);
});

test('treats accepted History=yes serialization failure as fatal rather than reason-coded omission', () => {
  const corpus = makeCorpus();
  corpus.rows[20] = { ...corpus.rows[20], target: { app: 'Arc', object: null, subtarget: 'orphan' } };
  assert.throws(() => build({ corpusSnapshot: corpus }), /canonical|snapshot|sha|hash|target/i);
  const unknownInput = makeCorpus();
  unknownInput.rows[20] = { ...unknownInput.rows[20], input_method: 'unknown' };
  assert.throws(() => build({ corpusSnapshot: unknownInput }), /canonical|snapshot|sha|hash|unknown|input/i);
});

test('selects the exact midpoint-quantile positions for an 84-row pool', () => {
  const sources = buildInputs();
  const selection = eligibility.selectQuantileTargets(eligibility.buildEligibilityLedger(sources), sources);
  assert.equal(selection.N, 84);
  assert.deepEqual(selection.selected_positions, [3, 11, 19, 26, 34, 42, 49, 57, 64, 72, 80]);
  assert.deepEqual(selection.selected_event_ids, selection.selected_positions.map((position) => selection.pool_event_ids[position]));
});

test('aborts selection when the final eligible pool has fewer than 11 rows', () => {
  const sources = buildInputs({ usableTargetCount: 10 });
  assert.throws(() => eligibility.selectQuantileTargets(eligibility.buildEligibilityLedger(sources), sources), /fewer|11|pool/i);
});

test('selection is deterministic, ignores outcome-like extras, binds source hashes, and is deeply immutable', () => {
  const sources = buildInputs();
  const ledger = eligibility.buildEligibilityLedger(sources);
  const first = eligibility.selectQuantileTargets(ledger, sources);
  const second = eligibility.selectQuantileTargets(structuredClone(ledger), structuredClone(sources));
  assert.deepEqual(first, second);
  assert.throws(() => eligibility.selectQuantileTargets(ledger, { ...sources, outcomes: {} }), /exact|option|key/i);
  const forged = structuredClone(ledger);
  forged.rows[0].target_eligible = true;
  forged.rows[0].target_reason_codes = ['target_eligible'];
  assert.throws(() => eligibility.selectQuantileTargets(forged, sources), /canonical|recomputed|ledger|match/i);
  assert.deepEqual(Object.keys(first), ['version', 'source_hashes', 'pool_event_ids', 'N', 'formula', 'selected_positions', 'selected_event_ids']);
  assert.equal(first.formula, 'Math.floor((i + 0.5) * N / 11)');
  assert.match(first.source_hashes.eligibility_ledger_sha256, /^[0-9a-f]{64}$/);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.selected_event_ids));
  assert.throws(() => first.selected_event_ids.pop(), TypeError);
});
