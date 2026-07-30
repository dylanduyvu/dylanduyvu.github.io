import assert from 'node:assert/strict';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import * as catalog from '../lib/catalog.mjs';
import { buildEligibilityLedger, selectQuantileTargets } from '../lib/eligibility.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { evidenceInventoryHash, makeTask4Sources } from './task4-fixtures.mjs';

function fixtures() {
  const sources = makeTask4Sources();
  const { corpusSnapshot, evidenceInventory, evidenceDecisions, videoInventory } = sources;
  const eligibilityLedger = buildEligibilityLedger(sources);
  const targetSelection = selectQuantileTargets(
    eligibilityLedger,
    sources,
  );
  assert.equal(targetSelection.N, 84);
  const fixture = {
    corpusSnapshot,
    evidenceInventory,
    evidenceDecisions,
    videoInventory,
    eligibilityLedger,
    targetSelection,
    approvalProvenance: null,
  };
  fixture.approvalProvenance = approvalFor(fixture);
  return fixture;
}

function build(overrides = {}) {
  const base = fixtures();
  const merged = { ...base, ...overrides };
  const variants = overrides.variants;
  merged.approvalProvenance = overrides.approvalProvenance ?? approvalFor(merged, variants);
  return catalog.buildTargetCatalog(catalogOptions(merged, variants === undefined ? {} : { variants }));
}

const catalogOptions = (base, extras = {}) => ({
  corpusSnapshot: base.corpusSnapshot,
  evidenceInventory: base.evidenceInventory,
  evidenceDecisions: base.evidenceDecisions,
  videoInventory: base.videoInventory,
  eligibilityLedger: base.eligibilityLedger,
  targetSelection: base.targetSelection,
  approvalProvenance: base.approvalProvenance,
  ...extras,
});

const manifestOptions = (base, targetCatalog, extras = {}) => ({
  corpusSnapshot: base.corpusSnapshot,
  evidenceInventory: base.evidenceInventory,
  evidenceDecisions: base.evidenceDecisions,
  videoInventory: base.videoInventory,
  eligibilityLedger: base.eligibilityLedger,
  targetSelection: base.targetSelection,
  targetCatalog,
  ...extras,
});

function catalogTargets(base, variants = []) {
  const byEvent = new Map(variants.map((entry) => [entry.event_id, entry.accepted_variants]));
  return base.targetSelection.selected_event_ids.map((eventId, index) => {
    const row = base.corpusSnapshot.rows.find((candidate) => candidate.event_id === eventId);
    const granularity = row.target.object === null ? 'application' : row.target.subtarget === null ? 'object' : 'subtarget';
    return {
      target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
      target_ordinal: index + 1,
      revision: 1,
      event_id: row.event_id,
      chronology_index: row.chronology_index,
      granularity,
      canonical_target: row.target,
      accepted_variants: [row.target, ...(byEvent.get(eventId) ?? [])],
    };
  });
}

function approvalFor(base, variants = []) {
  const payload = {
    version: 1,
    source_hashes: {
      corpus_sha256: 'db3279c3bba976f110e02e2144cd1c0ac6ce4bdebfeed3c8696dd6e0743c1fcd',
      target_selection_sha256: sha256(canonicalJson(base.targetSelection)),
    },
    targets: catalogTargets(base, variants),
  };
  return {
    approved_by: 'dylan',
    basis: 'blanket_execution_authorization_2026-07-29',
    catalog_payload_sha256: sha256(canonicalJson(payload)),
  };
}

test('exports exactly two builders and defaults every selected target to its canonical variant only', () => {
  assert.deepEqual(Object.keys(catalog).sort(), ['buildEvaluatorManifest', 'buildTargetCatalog']);
  const output = build();
  assert.equal(output.targets.length, METHOD.targetCount);
  for (const entry of output.targets) assert.deepEqual(entry.accepted_variants, [entry.canonical_target]);
});

test('assigns the frozen ordinal revision syntax NAP-V5-TARGET-01..11-R1', () => {
  const output = build();
  assert.deepEqual(output.targets.map((entry) => entry.target_id), Array.from({ length: METHOD.targetCount }, (_, index) => `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`));
  assert.ok(output.targets.every((entry) => entry.revision === 1));
  const bad = fixtures();
  bad.targetSelection = structuredClone(bad.targetSelection);
  bad.targetSelection.selected_event_ids[0] = 'NAP-V5-TARGET-01-R2';
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(bad)), /event|selection|join|missing/i);
  const undersized = fixtures();
  undersized.targetSelection = structuredClone(undersized.targetSelection);
  undersized.targetSelection.pool_event_ids = undersized.targetSelection.pool_event_ids.slice(0, 14);
  undersized.targetSelection.N = 14;
  undersized.targetSelection.selected_positions = Array.from({ length: METHOD.targetCount }, (_, index) => Math.floor((index + 0.5) * 10 / METHOD.targetCount));
  undersized.targetSelection.selected_event_ids = undersized.targetSelection.selected_positions.map((position) => undersized.targetSelection.pool_event_ids[position]);
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(undersized)), /11|duplicate|selection|eligible|canonical/i);
});

test('requires complete variants with the canonical null shape and granularity', () => {
  const base = fixtures();
  const eventId = base.targetSelection.selected_event_ids[0];
  const canonical = base.corpusSnapshot.rows.find((row) => row.event_id === eventId).target;
  const wrongShapeTarget = canonical.object === null
    ? { app: 'Arc Browser', object: 'Page', subtarget: null }
    : { app: 'Arc Browser', object: null, subtarget: null };
  const wrongShape = [{ event_id: eventId, accepted_variants: [wrongShapeTarget] }];
  const missingKey = [{ event_id: eventId, accepted_variants: [{ app: 'Arc Browser', object: canonical.object }] }];
  const valid = [{ event_id: eventId, accepted_variants: [{ ...canonical, app: 'Arc Browser' }] }];
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: wrongShape, approvalProvenance: approvalFor(base, wrongShape) })), /shape|granularity|null/i);
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: missingKey, approvalProvenance: approvalFor(base, missingKey) })), /exact|variant|subtarget/i);
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: valid, approvalProvenance: approvalFor(base, valid) })), /blanket|canonical.only|variant|approval/i);
  const excessive = [{ event_id: eventId, accepted_variants: Array.from({ length: 17 }, (_, index) => ({ ...canonical, app: `Alias ${index}` })) }];
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: excessive, approvalProvenance: approvalFor(base, excessive) })), /variant|16|limit|many/i);
  const longText = [{ event_id: eventId, accepted_variants: [{ ...canonical, app: 'x'.repeat(257) }] }];
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: longText, approvalProvenance: approvalFor(base, longText) })), /component|length|256|long/i);
});

test('deep-freezes catalog and evaluator-manifest outputs against post-output mutation', () => {
  const base = fixtures();
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  const manifest = catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog));
  assert.ok(Object.isFrozen(targetCatalog));
  assert.ok(Object.isFrozen(targetCatalog.targets[0].accepted_variants[0]));
  assert.ok(Object.isFrozen(manifest));
  assert.ok(Object.isFrozen(manifest.targets[0].ground_truth_target));
  assert.throws(() => { targetCatalog.targets[0].canonical_target.app = 'Mutated'; }, TypeError);
  assert.throws(() => manifest.targets.pop(), TypeError);
});

test('joins exactly 11 selected IDs to canonical chronology in selected order', () => {
  const base = fixtures();
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  const manifest = catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog));
  assert.equal(manifest.targets.length, METHOD.targetCount);
  assert.deepEqual(manifest.targets.map((entry) => entry.event_id), base.targetSelection.selected_event_ids);
  assert.deepEqual(manifest.targets.map((entry) => entry.chronology_index), base.targetSelection.selected_event_ids.map((eventId) => base.corpusSnapshot.rows.find((row) => row.event_id === eventId).chronology_index));
  assert.deepEqual(manifest.targets.map((entry) => entry.target_ordinal), Array.from({ length: METHOD.targetCount }, (_, index) => index + 1));
  const ineligible = fixtures();
  const demoNoIds = ineligible.corpusSnapshot.rows.filter((row) => row.canonical_status === 'accepted' && row.demo_value === 'no').slice(0, METHOD.targetCount).map((row) => row.event_id);
  ineligible.eligibilityLedger = structuredClone(ineligible.eligibilityLedger);
  for (const eventId of demoNoIds) {
    const row = ineligible.eligibilityLedger.rows.find((candidate) => candidate.event_id === eventId);
    row.target_eligible = true;
    row.target_reason_codes = ['target_eligible'];
  }
  ineligible.targetSelection = {
    ...structuredClone(ineligible.targetSelection),
    source_hashes: {
      ...ineligible.targetSelection.source_hashes,
      eligibility_ledger_sha256: sha256(canonicalJson(ineligible.eligibilityLedger)),
    },
    pool_event_ids: demoNoIds,
    N: METHOD.targetCount,
    selected_positions: Array.from({ length: METHOD.targetCount }, (_, index) => index),
    selected_event_ids: demoNoIds,
  };
  ineligible.approvalProvenance = approvalFor(ineligible);
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(ineligible)), /canonical|eligible|selection|enter|pointer|demo|ledger/i);
});

test('preserves canonical ground-truth target, action type, and input method', () => {
  const base = fixtures();
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  const manifest = catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog));
  const source = base.corpusSnapshot.rows.find((row) => row.event_id === base.targetSelection.selected_event_ids[0]);
  assert.deepEqual(manifest.targets[0].ground_truth_target, source.target);
  assert.equal(manifest.targets[0].ground_truth_action_type, source.action_type);
  assert.equal(manifest.targets[0].ground_truth_input_method, source.input_method);
  const alteredCatalog = structuredClone(targetCatalog);
  alteredCatalog.targets[0].canonical_target.app = 'Safari';
  alteredCatalog.targets[0].accepted_variants[0].app = 'Safari';
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, alteredCatalog)), /canonical|ground.truth|corpus|target/i);
  const badAction = structuredClone(base.corpusSnapshot);
  badAction.rows[source.chronology_index - 1].action_type = 'delete_everything';
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog, { corpusSnapshot: badAction })), /canonical|snapshot|hash|action|focus|activate|ground.truth/i);
  const badInput = structuredClone(base.corpusSnapshot);
  badInput.rows[source.chronology_index - 1].input_method = 'telepathy';
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog, { corpusSnapshot: badInput })), /canonical|snapshot|hash|input|pointer|keyboard|ground.truth/i);
});

test('joins each target to its usable current evidence hash and source-bound evidence provenance', () => {
  const base = fixtures();
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  const manifest = catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog));
  const evidenceIndex = base.evidenceInventory.rows.findIndex((row) => row.event_id === base.targetSelection.selected_event_ids[0]);
  const selectedFrame = base.evidenceInventory.rows[evidenceIndex].selected_frame;
  assert.equal(manifest.targets[0].current_evidence_sha256, selectedFrame.png_sha256);
  assert.deepEqual(manifest.targets[0].evidence_provenance, {
    inventory_sha256: base.evidenceInventory.inventory_sha256,
    locked_source_sha256: selectedFrame.locked_source_sha256,
    recording_id: selectedFrame.recording_id,
    decode_index: selectedFrame.decode_index,
  });
  const unusable = structuredClone(base.evidenceInventory);
  unusable.rows[evidenceIndex].final_disposition = 'post_action_risk';
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog, { evidenceInventory: unusable })), /usable|evidence|disposition/i);
});

test('retains exact pre-run approval provenance only in evaluator artifacts', () => {
  const base = fixtures();
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  const manifest = catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog));
  assert.deepEqual(targetCatalog.approval_provenance, base.approvalProvenance);
  assert.deepEqual(manifest.provenance, {
    visibility: 'evaluator_only',
    catalog_approval: base.approvalProvenance,
  });
  assert.throws(() => build({ approvalProvenance: { ...base.approvalProvenance, approved_by: 'codex' } }), /dylan|approval/i);
  const eventId = base.targetSelection.selected_event_ids[0];
  const canonical = base.corpusSnapshot.rows.find((row) => row.event_id === eventId).target;
  const alias = [{ event_id: eventId, accepted_variants: [{ ...canonical, app: 'Safari' }] }];
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: alias })), /approval|payload|sha|hash|blanket|variant/i);
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: alias, approvalProvenance: approvalFor(base, alias) })), /blanket|canonical.only|variant|approval/i);
});

test('binds catalog and manifest to exact canonical source artifact hashes', () => {
  const base = fixtures();
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  const manifest = catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog));
  assert.deepEqual(Object.keys(targetCatalog.source_hashes), ['corpus_sha256', 'target_selection_sha256']);
  assert.equal(targetCatalog.source_hashes.corpus_sha256, 'db3279c3bba976f110e02e2144cd1c0ac6ce4bdebfeed3c8696dd6e0743c1fcd');
  assert.match(targetCatalog.source_hashes.target_selection_sha256, /^[0-9a-f]{64}$/);
  assert.deepEqual(Object.keys(manifest.source_hashes), [
    'corpus_sha256', 'evidence_inventory_sha256', 'target_selection_sha256', 'target_catalog_sha256',
  ]);
  assert.equal(manifest.source_hashes.evidence_inventory_sha256, sha256(canonicalJson(base.evidenceInventory)));
  assert.match(manifest.source_hashes.target_catalog_sha256, /^[0-9a-f]{64}$/);
});

test('rejects extra keys throughout inputs, variants, approval, catalog, and evidence joins', () => {
  const base = fixtures();
  assert.throws(() => catalog.buildTargetCatalog({ ...catalogOptions(base), extra: true }), /exact|key/i);
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { approvalProvenance: { ...base.approvalProvenance, extra: true } })), /exact|approval/i);
  const badVideo = structuredClone(base.videoInventory);
  badVideo.files[0].time_base.extra = true;
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions({ ...base, videoInventory: badVideo })), /exact|video|time.base|key/i);
  const firstTarget = base.corpusSnapshot.rows.find((row) => row.event_id === base.targetSelection.selected_event_ids[0]).target;
  assert.throws(() => catalog.buildTargetCatalog(catalogOptions(base, { variants: [{ event_id: base.targetSelection.selected_event_ids[0], accepted_variants: [{ ...firstTarget, extra: true }] }] })), /exact|variant/i);
  const targetCatalog = catalog.buildTargetCatalog(catalogOptions(base));
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, { ...targetCatalog, extra: true })), /exact|catalog|key/i);
  const badEvidence = structuredClone(base.evidenceInventory);
  const evidenceIndex = badEvidence.rows.findIndex((row) => row.event_id === base.targetSelection.selected_event_ids[0]);
  const selectedFrame = base.evidenceInventory.rows[evidenceIndex].selected_frame;
  badEvidence.rows[evidenceIndex].selected_frame.extra = true;
  badEvidence.inventory_sha256 = evidenceInventoryHash(badEvidence);
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog, { evidenceInventory: badEvidence })), /exact|evidence|frame/i);
  const minimalEvidence = structuredClone(base.evidenceInventory);
  minimalEvidence.rows[evidenceIndex] = {
    chronology_index: minimalEvidence.rows[evidenceIndex].chronology_index,
    event_id: base.targetSelection.selected_event_ids[0],
    final_disposition: 'usable',
    selected_frame: {
      png_sha256: 'a'.repeat(64),
      locked_source_sha256: selectedFrame.locked_source_sha256,
      recording_id: selectedFrame.recording_id,
      decode_index: selectedFrame.decode_index,
    },
  };
  minimalEvidence.inventory_sha256 = evidenceInventoryHash(minimalEvidence);
  assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog, { evidenceInventory: minimalEvidence })), /exact|evidence|schema|provenance/i);
  for (const mutate of [
    (row) => { row.review_provenance.reviewer = 'dylan'; },
    (row) => { row.review_provenance.reviewed_at = '0'; },
    (row) => { row.automated_checks.sha256_matches = false; },
    (row) => { row.anchor_time = { numerator: '0', denominator: '1' }; row.selected_frame.global_pts = { numerator: '1', denominator: '1' }; row.selected_frame.age_milliseconds = { numerator: '0', denominator: '1' }; },
    (row) => { row.selected_frame.locked_source_sha256 = 'f'.repeat(64); },
    (row) => { row.selected_frame.decode_index += 1; },
    (row) => { row.selected_frame.local_pts = { numerator: '0', denominator: '1' }; },
    (row) => { row.selected_frame.global_pts = { numerator: '0', denominator: '1' }; },
    (row) => { row.selected_frame.width = 1; row.selected_frame.height = 1; },
    (row) => { row.searched_recording_ids = row.searched_recording_ids.filter((id) => id !== row.selected_frame.recording_id); },
    (row) => { row.selected_frame.age_milliseconds = { numerator: '5001', denominator: '1' }; },
    (row) => { row.selected_frame.store_relative_path = 'evaluator/evidence-store/invented.png'; },
  ]) {
    const invalid = structuredClone(base.evidenceInventory);
    mutate(invalid.rows[evidenceIndex]);
    invalid.inventory_sha256 = evidenceInventoryHash(invalid);
    assert.throws(() => catalog.buildEvaluatorManifest(manifestOptions(base, targetCatalog, { evidenceInventory: invalid })), /evidence|review|check|age|path|provenance|inventory|hash|canonical|ledger|frame|selected|deterministic/i);
  }
});
