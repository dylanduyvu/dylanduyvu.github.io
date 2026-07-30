import assert from 'node:assert/strict';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import { main as cliMain } from '../cli.mjs';
import { buildEvaluatorManifest, buildTargetCatalog } from '../lib/catalog.mjs';
import { buildDonorInventory } from '../lib/donor-guard.mjs';
import { buildEligibilityLedger, selectQuantileTargets, validateEvidenceDecisions } from '../lib/eligibility.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { auditPredictorSafeTree } from '../lib/leakage-audit.mjs';
import { renderPredictorPrompt } from '../lib/packet-renderer.mjs';
import * as prepare from '../lib/prepare.mjs';
import { buildSchedule } from '../lib/schedule.mjs';
import { reviveVideoInventory, serializeVideoInventory } from '../lib/video-index.mjs';
import {
  APPROVAL_BASIS,
  cloneRuntime,
  makeTask6IoFixture,
  REVIEW_PROVENANCE,
  runTask6Pipeline,
  seedTask6Authority,
  writeReviewDecisions,
} from './task6-fixtures.mjs';

const readJson = async (root, relativePath) => (
  JSON.parse(await readFile(path.join(root, ...relativePath.split('/')), 'utf8'))
);
let fullPipelinePromise;
let evidencePipelinePromise;
const fullPipeline = () => {
  fullPipelinePromise ??= runTask6Pipeline();
  return fullPipelinePromise;
};
const evidencePipeline = () => {
  evidencePipelinePromise ??= runTask6Pipeline({ stopAfter: 'prepare-evidence' });
  return evidencePipelinePromise;
};

test('exports the exact command contract and production CLI compiles without caller-authored artifacts', async () => {
  assert.deepEqual(Object.keys(prepare).sort(), [
    'PREPARATION_COMMANDS',
    'buildPreparedInventory',
    'runPreparationCommand',
    'verifyPrepared',
  ]);
  assert.deepEqual(prepare.PREPARATION_COMMANDS, [
    'compile-corpus',
    'prepare-evidence',
    'freeze-evidence',
    'select-targets',
    'approve-catalog',
    'prepare-packets',
    'verify-prepared',
  ]);
  const fixture = await makeTask6IoFixture();
  const root = path.join(fixture.parent, 'compile-runtime');
  assert.equal(await cliMain(['compile-corpus'], { root, io: fixture.io }), 0);
  const corpus = await readJson(root, 'evaluator/corpus-snapshot.json');
  assert.equal(corpus.rows.length, 220);
  assert.equal(corpus.history.length, 196);
  const cliSource = await readFile(new URL('../cli.mjs', import.meta.url), 'utf8');
  const prepareSource = await readFile(new URL('../lib/prepare.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(cliSource, /artifactProvider|artifacts:\s*\[\]/);
  assert.doesNotMatch(prepareSource, /caller-authored|validateArtifacts|allowedForCommand/);

  const downstreamRoot = path.join(fixture.parent, 'downstream-runtime');
  await cliMain(['compile-corpus'], { root: downstreamRoot, io: fixture.io });
  await assert.rejects(
    cliMain(['prepare-evidence'], { root: downstreamRoot, io: fixture.io }),
    /donor|authority|inventory|prerequisite/i,
  );
  await seedTask6Authority(downstreamRoot, fixture);
  assert.equal(await cliMain(['prepare-evidence'], { root: downstreamRoot, io: fixture.io }), 0);
});

test('prepare-evidence probes actual source files and rebuilds authenticated review artifacts idempotently', async () => {
  const fixture = await evidencePipeline();
  const serializedVideo = await readJson(fixture.root, 'evaluator/video-inventory.json');
  const video = reviveVideoInventory(serializedVideo);
  assert.equal(canonicalJson(serializeVideoInventory(video)), canonicalJson(serializedVideo));
  const invalidVideo = structuredClone(serializedVideo);
  invalidVideo.files[0].time_base.denominator = '0';
  invalidVideo.files[0].extra = 'forbidden';
  invalidVideo.extra = 'forbidden';
  assert.throws(() => reviveVideoInventory(invalidVideo), /video|time base|keys|denominator/i);
  const draft = await readJson(fixture.root, 'evaluator/evidence-review-inventory.json');
  const frameIndex = await readJson(fixture.root, 'evaluator/frame-index.json');
  assert.equal(video.files.length, 27);
  assert.equal(frameIndex.files.length, video.files.length);
  assert.equal(draft.rows.length, 220);
  assert.equal(draft.rows.filter((row) => row.evidence_scope === 'required').length, 196);
  assert.ok(draft.rows.filter((row) => row.evidence_scope === 'required').every((row) => row.final_disposition === null));
  assert.ok(fixture.counters.ffprobe > 0);
  assert.ok(fixture.counters.ffmpeg > 0);
  assert.equal(fixture.ffprobeProbePaths.length > 0, true);
  assert.ok(fixture.ffprobeProbePaths.every((sourcePath) => (
    /^\/private\/tmp\/nap-v5-video-probe-[^/]+\/compact_monitor_3_\d+\.mp4$/u.test(sourcePath)
    && !sourcePath.startsWith(`${fixture.videoRoot}${path.sep}`)
  )));
  assert.deepEqual(
    fixture.ffprobeProbeSha256,
    fixture.ffprobeProbePaths.map((sourcePath) => (
      fixture.expectedVideoSha256.get(/(\d+)\.mp4$/u.exec(sourcePath)[1])
    )),
  );
  for (const file of video.files) {
    assert.equal(file.absolute_path, path.join(fixture.videoRoot, file.relative_path));
    assert.equal(file.sha256, fixture.expectedVideoSha256.get(file.recording_id));
  }
  const selected = draft.rows.find((row) => row.selected_frame !== null);
  const pngPath = path.join(fixture.root, ...selected.selected_frame.store_relative_path.split('/'));
  assert.equal((await lstat(pngPath)).isFile(), true);
  assert.equal(sha256(await readFile(pngPath)), selected.selected_frame.png_sha256);
  const before = await readFile(path.join(fixture.root, 'evaluator/evidence-review-inventory.json'));
  await cliMain(['prepare-evidence'], { root: fixture.root, io: fixture.io });
  assert.deepEqual(await readFile(path.join(fixture.root, 'evaluator/evidence-review-inventory.json')), before);
  const missingFrameRoot = await cloneRuntime(fixture, 'missing-frame-index');
  const expectedFrameIndex = await readFile(path.join(missingFrameRoot, 'evaluator/frame-index.json'));
  await unlink(path.join(missingFrameRoot, 'evaluator/frame-index.json'));
  await cliMain(['prepare-evidence'], { root: missingFrameRoot, io: fixture.io });
  assert.deepEqual(
    await readFile(path.join(missingFrameRoot, 'evaluator/frame-index.json')),
    expectedFrameIndex,
  );
  const missingReviewRoot = await cloneRuntime(fixture, 'missing-review-document');
  const expectedReview = await readFile(path.join(missingReviewRoot, 'evaluator/evidence-review.md'));
  await unlink(path.join(missingReviewRoot, 'evaluator/evidence-review.md'));
  await cliMain(['prepare-evidence'], { root: missingReviewRoot, io: fixture.io });
  assert.deepEqual(
    await readFile(path.join(missingReviewRoot, 'evaluator/evidence-review.md')),
    expectedReview,
  );
});

test('every stage semantically reauthenticates prerequisites and locked source bytes', async () => {
  const fixture = await makeTask6IoFixture();
  const root = path.join(fixture.parent, 'invalid-prerequisite');
  await writeFile(path.join(fixture.parent, 'fake-corpus.json'), '{}\n', { mode: 0o600 });
  await assert.rejects(
    cliMain(['prepare-evidence'], { root, io: fixture.io }),
    /prerequisite|corpus|missing/i,
  );
  const prepared = await fullPipeline();
  const downstreamCommands = [
    ['prepare-evidence'],
    ['freeze-evidence', '--decisions', prepared.decisionsPath],
    ['select-targets'],
    ['approve-catalog', '--basis', APPROVAL_BASIS],
    ['prepare-packets'],
    ['verify-prepared'],
  ];
  for (const [index, argv] of downstreamCommands.entries()) {
    const missingDonorRoot = await cloneRuntime(prepared, `missing-donor-${index}`);
    await unlink(path.join(missingDonorRoot, 'evaluator/v4-donor-inventory.json'));
    await assert.rejects(
      cliMain(argv, { root: missingDonorRoot, io: prepared.io }),
      /donor|authority|inventory|prerequisite/i,
    );
  }
  const clone = await cloneRuntime(prepared, 'source-drift');
  const firstSource = path.join(prepared.videoRoot, `compact_monitor_3_${prepared.io.startRecordingId}.mp4`);
  const original = await readFile(firstSource);
  await writeFile(firstSource, Buffer.concat([original, Buffer.from('drift')]));
  await assert.rejects(
    cliMain(['select-targets'], { root: clone, io: prepared.io }),
    /source|video|hash|inventory|drift|differs/i,
  );
  await writeFile(firstSource, original);
});

test('freeze-evidence securely consumes --decisions and produces a validator-bound final inventory', async () => {
  const fixture = await fullPipeline();
  const corpus = await readJson(fixture.root, 'evaluator/corpus-snapshot.json');
  const video = reviveVideoInventory(await readJson(fixture.root, 'evaluator/video-inventory.json'));
  const evidence = await readJson(fixture.root, 'evaluator/evidence-inventory.json');
  const decisions = await readJson(fixture.root, 'evaluator/evidence-review-decisions.json');
  assert.deepEqual(decisions.review_provenance, REVIEW_PROVENANCE);
  assert.equal([...decisions.decisions[0].reviewer_note].length, 2_000);
  assert.doesNotThrow(() => validateEvidenceDecisions(decisions, {
    corpusSnapshot: corpus,
    evidenceInventory: evidence,
    videoInventory: video,
  }));
  assert.equal(evidence.rows.filter((row) => row.final_disposition !== null).length, 196);
  assert.ok(evidence.rows
    .filter((row) => row.evidence_scope === 'required')
    .every((row) => row.review_provenance.reviewer === 'codex_visual_review'
      && row.review_provenance.reviewed_at === '2026-07-30T12:00:00.000Z'));
  await writeFile(fixture.decisionsPath, canonicalJson(decisions), { mode: 0o600 });
  await cliMain(
    ['freeze-evidence', '--decisions', fixture.decisionsPath],
    { root: fixture.root, io: fixture.io },
  );
  assert.equal(
    (await readJson(fixture.root, 'evaluator/evidence-inventory.json'))
      .rows.find((row) => row.evidence_scope === 'required')
      .review_provenance.reviewed_at,
    '2026-07-30T12:00:00.000Z',
  );

  const draftFixture = await evidencePipeline();
  const badRoot = await cloneRuntime(draftFixture, 'bad-decisions');
  const decisionsPath = await writeReviewDecisions(badRoot, draftFixture.parent);
  const bad = JSON.parse(await readFile(decisionsPath, 'utf8'));
  bad.decisions[0].disposition = 'pending_human';
  await writeFile(decisionsPath, canonicalJson(bad), { mode: 0o600 });
  await assert.rejects(
    cliMain(['freeze-evidence', '--decisions', decisionsPath], { root: badRoot, io: draftFixture.io }),
    /disposition|pending|decision/i,
  );
  const realDecisions = path.join(draftFixture.parent, 'real-decisions.json');
  await writeFile(realDecisions, '{}\n', { mode: 0o600 });
  const linked = path.join(draftFixture.parent, 'linked-decisions.json');
  await symlink(realDecisions, linked);
  await assert.rejects(
    cliMain(['freeze-evidence', '--decisions', linked], { root: badRoot, io: draftFixture.io }),
    /symlink|regular|secure/i,
  );
});

test('select-targets recomputes the 220-row ledger, 84-row pool, 11 quantiles, and canonical drafts', async () => {
  const fixture = await fullPipeline();
  const corpusSnapshot = await readJson(fixture.root, 'evaluator/corpus-snapshot.json');
  const videoInventory = reviveVideoInventory(await readJson(fixture.root, 'evaluator/video-inventory.json'));
  const evidenceInventory = await readJson(fixture.root, 'evaluator/evidence-inventory.json');
  const evidenceDecisions = await readJson(fixture.root, 'evaluator/evidence-review-decisions.json');
  const eligibility = await readJson(fixture.root, 'evaluator/eligibility-ledger.json');
  const selection = await readJson(fixture.root, 'evaluator/target-selection.json');
  const sources = { corpusSnapshot, videoInventory, evidenceInventory, evidenceDecisions };
  assert.equal(eligibility.rows.length, 220);
  assert.equal(selection.N, 84);
  assert.equal(selection.selected_event_ids.length, METHOD.targetCount);
  assert.equal(canonicalJson(eligibility), canonicalJson(buildEligibilityLedger(sources)));
  assert.equal(canonicalJson(selection), canonicalJson(selectQuantileTargets(eligibility, sources)));
  const draftCatalog = await readJson(fixture.root, 'evaluator/target-catalog-draft.json');
  const draftManifest = await readJson(fixture.root, 'evaluator/evaluator-manifest-draft.json');
  assert.equal(draftCatalog.targets.length, METHOD.targetCount);
  assert.equal(draftManifest.targets.length, METHOD.targetCount);
  assert.equal(Object.hasOwn(draftCatalog, 'approval_provenance'), false);
});

test('approve-catalog rebuilds canonical-only catalog and manifest with payload-bound truthful approval', async () => {
  const fixture = await fullPipeline();
  const corpusSnapshot = await readJson(fixture.root, 'evaluator/corpus-snapshot.json');
  const videoInventory = reviveVideoInventory(await readJson(fixture.root, 'evaluator/video-inventory.json'));
  const evidenceInventory = await readJson(fixture.root, 'evaluator/evidence-inventory.json');
  const evidenceDecisions = await readJson(fixture.root, 'evaluator/evidence-review-decisions.json');
  const eligibilityLedger = await readJson(fixture.root, 'evaluator/eligibility-ledger.json');
  const targetSelection = await readJson(fixture.root, 'evaluator/target-selection.json');
  const targetCatalog = await readJson(fixture.root, 'evaluator/target-catalog.json');
  const evaluatorManifest = await readJson(fixture.root, 'evaluator/evaluator-manifest.json');
  const canonicalSources = {
    corpusSnapshot, videoInventory, evidenceInventory, evidenceDecisions,
    eligibilityLedger, targetSelection,
  };
  const rebuiltCatalog = buildTargetCatalog({
    ...canonicalSources,
    approvalProvenance: targetCatalog.approval_provenance,
  });
  const rebuiltManifest = buildEvaluatorManifest({
    ...canonicalSources,
    targetCatalog: rebuiltCatalog,
  });
  assert.equal(canonicalJson(targetCatalog), canonicalJson(rebuiltCatalog));
  assert.equal(canonicalJson(evaluatorManifest), canonicalJson(rebuiltManifest));
  assert.equal(targetCatalog.approval_provenance.basis, APPROVAL_BASIS);
  assert.ok(targetCatalog.targets.every((target) => (
    target.accepted_variants.length === 1
    && canonicalJson(target.accepted_variants[0]) === canonicalJson(target.canonical_target)
  )));
  const payload = {
    version: targetCatalog.version,
    source_hashes: targetCatalog.source_hashes,
    targets: targetCatalog.targets,
  };
  assert.equal(targetCatalog.approval_provenance.catalog_payload_sha256, sha256(canonicalJson(payload)));
});

test('prepare-packets derives the approved schedule, renders Task5 bundles, and freezes complete internal canaries/source lineage', async () => {
  const fixture = await fullPipeline();
  const manifest = await readJson(fixture.root, 'evaluator/evaluator-manifest.json');
  const schedule = await readJson(fixture.root, 'evaluator/schedule.json');
  const expectedSchedule = buildSchedule({
    version: 1,
    targets: manifest.targets.map((target) => ({
      target_ordinal: target.target_ordinal,
      target_id: target.target_id,
      chronology_index: target.chronology_index,
    })),
  });
  assert.equal(canonicalJson(schedule), canonicalJson(expectedSchedule));
  const prepared = await readJson(fixture.root, 'evaluator/prepared-inventory.json');
  assert.equal(prepared.packet_count, METHOD.scheduledSlotCount);
  assert.equal(prepared.context_bundle_count, METHOD.scheduledSlotCount);
  assert.equal(prepared.packet_audit_expectations.length, METHOD.scheduledSlotCount);
  assert.equal(prepared.source_video_lineage.file_count, 27);
  assert.equal(
    prepared.files.some((file) => file.path === 'evaluator/v4-donor-inventory.json'),
    true,
  );
  for (const file of prepared.source_video_lineage.files) {
    assert.equal(file.sha256, fixture.expectedVideoSha256.get(file.recording_id));
    assert.equal(file.absolute_path, path.join(fixture.videoRoot, file.relative_path));
  }
  const first = prepared.packet_audit_expectations[0];
  const encodedCanaries = first.expected_inventory.forbidden_canaries;
  assert.ok(encodedCanaries.every((value) => /^b64u:[A-Za-z0-9_-]+$/u.test(value)));
  const canaries = encodedCanaries.map((value) => (
    Buffer.from(value.slice('b64u:'.length), 'base64url').toString('utf8')
  ));
  const forbiddenKeys = first.expected_inventory.forbidden_json_keys;
  for (const key of [
    'event_id',
    'recording_id',
    'target_id',
    'slot_id',
    'chronology_index',
    'accepted_variants',
    'ground_truth_target',
    'evidence_provenance',
    'review_provenance',
    'reviewer_note',
    'final_disposition',
    'prediction',
    'outcome',
  ]) {
    assert.ok(forbiddenKeys.includes(key), `missing field-aware forbidden key ${key}`);
  }
  for (const ordinary of [
    'usable',
    'missing',
    'stale_over_5s',
    'post_action_risk',
    'timing_unresolvable',
    'wrong_monitor',
    'corrupt_or_unreadable',
    'same_time_interval_unrecoverable',
    'ffprobe',
    'ffmpeg',
  ]) {
    assert.equal(canaries.includes(ordinary), false, `ordinary word became a raw canary: ${ordinary}`);
  }
  const catalog = await readJson(fixture.root, 'evaluator/target-catalog.json');
  const evidence = await readJson(fixture.root, 'evaluator/evidence-inventory.json');
  assert.ok(canaries.includes(manifest.targets[0].event_id));
  assert.ok(canaries.includes(manifest.targets[0].target_id));
  assert.ok(canaries.includes(evidence.rows.find((row) => row.selected_frame !== null).selected_frame.store_relative_path));
  assert.ok(canaries.includes(JSON.stringify(catalog.targets[0].canonical_target)));
  assert.ok(canaries.some((value) => value.includes('"history_ordinal"') && value.includes('"action_type"')));
  const corpus = await readJson(fixture.root, 'evaluator/corpus-snapshot.json');
  const eligibility = await readJson(fixture.root, 'evaluator/eligibility-ledger.json');
  assert.ok(canaries.includes(corpus.source.sha256));
  assert.ok(canaries.includes(eligibility.source_hashes.evidence_inventory_sha256));
  assert.ok(canaries.includes(JSON.stringify(catalog.approval_provenance)));
  assert.ok(canaries.includes('🧪'.repeat(2_000)));
  assert.ok(
    encodedCanaries.find((value) => (
      Buffer.from(value.slice('b64u:'.length), 'base64url').toString('utf8')
        === '🧪'.repeat(2_000)
    )).length > 4_096,
  );
  const firstPacket = await readJson(fixture.root, `packets/${schedule.slots[0].slot_id}/packet.json`);
  assert.equal(firstPacket.condition, schedule.slots[0].condition);
  assert.equal(firstPacket.images.length, 1);
  const historySlot = schedule.slots.find((slot) => slot.condition === 'state_plus_hybrid_history');
  const historyPacket = await readJson(fixture.root, `packets/${historySlot.slot_id}/packet.json`);
  assert.equal(historyPacket.images.length, 11);

  const ordinaryRoot = await cloneRuntime(fixture, 'ordinary-word-canary');
  const target = String(historySlot.target_ordinal).padStart(3, '0');
  const contextDirectory = path.join(
    ordinaryRoot,
    'contexts',
    target,
    historySlot.condition,
  );
  const packetDirectory = path.join(ordinaryRoot, 'packets', historySlot.slot_id);
  const ordinaryContext = await readJson(
    ordinaryRoot,
    `contexts/${target}/${historySlot.condition}/context.json`,
  );
  ordinaryContext.history[0].app = 'missing';
  const ordinaryContextBytes = Buffer.from(`${JSON.stringify(ordinaryContext, null, 2)}\n`);
  await writeFile(path.join(contextDirectory, 'context.json'), ordinaryContextBytes);
  const ordinaryPrompt = renderPredictorPrompt(historySlot.condition, ordinaryContext);
  await writeFile(path.join(packetDirectory, 'prompt.txt'), ordinaryPrompt);
  const ordinaryPacket = await readJson(
    ordinaryRoot,
    `packets/${historySlot.slot_id}/packet.json`,
  );
  ordinaryPacket.context_sha256 = sha256(ordinaryContextBytes);
  ordinaryPacket.prompt_text = ordinaryPrompt;
  await writeFile(
    path.join(packetDirectory, 'packet.json'),
    `${JSON.stringify(ordinaryPacket, null, 2)}\n`,
  );
  const ordinaryExpected = structuredClone(
    prepared.packet_audit_expectations
      .find((entry) => entry.slot_id === historySlot.slot_id)
      .expected_inventory,
  );
  ordinaryExpected.context_sha256 = sha256(ordinaryContextBytes);
  ordinaryExpected.forbidden_canaries = [...new Set([
    ...ordinaryExpected.forbidden_canaries,
    `b64u:${Buffer.from('missing', 'utf8').toString('base64url')}`,
  ])];
  assert.equal((await auditPredictorSafeTree({
    condition: historySlot.condition,
    contextDirectory,
    packetDirectory,
    expectedInventory: ordinaryExpected,
  })).ok, true);
});

test('immutable reruns resume exact bytes and reject packet drift without rewriting it', async () => {
  const fixture = await fullPipeline();
  const root = await cloneRuntime(fixture, 'idempotent');
  const packetPath = path.join(root, 'packets/NAP-V5-SLOT-01/packet.json');
  const before = await readFile(packetPath);
  await cliMain(['prepare-packets'], { root, io: fixture.io });
  assert.deepEqual(await readFile(packetPath), before);
  await writeFile(packetPath, Buffer.from('drift\n'));
  await assert.rejects(
    cliMain(['prepare-packets'], { root, io: fixture.io }),
    /differs|drift|immutable|packet|json/i,
  );
  assert.equal(await readFile(packetPath, 'utf8'), 'drift\n');
});

test('verify-prepared rederives trusted expectations and detects packet, evaluator, or source mutation', async () => {
  const fixture = await fullPipeline();
  const packetRoot = await cloneRuntime(fixture, 'verify-packet-drift');
  const promptPath = path.join(packetRoot, 'packets/NAP-V5-SLOT-01/prompt.txt');
  await writeFile(promptPath, 'mutated\n');
  await assert.rejects(
    prepare.verifyPrepared({ root: packetRoot, io: fixture.io }),
    /prompt|hash|inventory|drift|audit|differs/i,
  );
  const evaluatorRoot = await cloneRuntime(fixture, 'verify-evaluator-drift');
  const catalogPath = path.join(evaluatorRoot, 'evaluator/target-catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  catalog.targets[0].canonical_target.app = 'Tampered';
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  await assert.rejects(
    prepare.verifyPrepared({ root: evaluatorRoot, io: fixture.io }),
    /catalog|canonical|payload|hash|drift|differs/i,
  );
  const extraRoot = await cloneRuntime(fixture, 'verify-extra-packet');
  const extraDirectory = path.join(extraRoot, 'packets/NAP-V5-SLOT-31');
  await mkdir(extraDirectory, { recursive: true });
  await writeFile(path.join(extraDirectory, 'leak.txt'), 'leak\n', { mode: 0o600 });
  await assert.rejects(
    prepare.verifyPrepared({ root: extraRoot, io: fixture.io }),
    /exact path|unexpected|extra|inventory/i,
  );
  const forgedDonorRoot = await cloneRuntime(fixture, 'verify-forged-donor');
  const alternateDonor = path.join(fixture.parent, 'alternate-v4-donor');
  await mkdir(alternateDonor, { recursive: true });
  await writeFile(path.join(alternateDonor, 'method-lock.json'), '{}\n', { mode: 0o600 });
  const forgedDonor = await buildDonorInventory(alternateDonor);
  await writeFile(
    path.join(forgedDonorRoot, 'evaluator/v4-donor-inventory.json'),
    `${JSON.stringify(forgedDonor, null, 2)}\n`,
    { mode: 0o600 },
  );
  await assert.rejects(
    prepare.verifyPrepared({ root: forgedDonorRoot, io: fixture.io }),
    /donor authority|donor root|configured donor/i,
  );

  const downstreamRoot = await cloneRuntime(fixture, 'verify-authenticated-downstream');
  await mkdir(path.join(downstreamRoot, 'locks'), { recursive: true });
  await writeFile(
    path.join(downstreamRoot, 'locks/method-lock.json'),
    '{"authenticated":"method"}\n',
    { mode: 0o600 },
  );
  await writeFile(
    path.join(downstreamRoot, 'locks/run-lock.json'),
    '{"authenticated":"run"}\n',
    { mode: 0o600 },
  );
  await mkdir(
    path.join(downstreamRoot, 'sealed-attempts/NAP-V5-SLOT-01/attempt-001'),
    { recursive: true },
  );
  await writeFile(
    path.join(
      downstreamRoot,
      'sealed-attempts/NAP-V5-SLOT-01/attempt-001/record.json',
    ),
    '{"authenticated":"attempt"}\n',
    { mode: 0o600 },
  );
  await mkdir(path.join(downstreamRoot, 'evaluator/receipts'), { recursive: true });
  await writeFile(
    path.join(downstreamRoot, 'evaluator/receipts/preflight-before-lock.json'),
    '{"authenticated":"preflight-receipt"}\n',
    { mode: 0o600 },
  );
  await assert.rejects(
    cliMain(['verify-prepared'], { root: downstreamRoot, io: fixture.io }),
    /forbidden|run|attempt|lock|downstream/i,
  );
  assert.equal(await prepare.verifyPrepared({
    root: downstreamRoot,
    io: fixture.io,
    downstreamAuthenticated: true,
  }), true);
  await writeFile(
    path.join(downstreamRoot, 'packets/NAP-V5-SLOT-01/prompt.txt'),
    'mutated after downstream authentication\n',
  );
  await assert.rejects(
    prepare.verifyPrepared({
      root: downstreamRoot,
      io: fixture.io,
      downstreamAuthenticated: true,
    }),
    /prompt|hash|inventory|drift|audit|differs/i,
  );

  const raceRoot = await cloneRuntime(fixture, 'verify-root-swap');
  const replacementRoot = await cloneRuntime(fixture, 'verify-root-swap-replacement');
  const displacedRoot = `${raceRoot}-displaced`;
  let swapped = false;
  const swappingIo = {
    ...fixture.io,
    ffprobeSpawn: async (executable, argv, options) => {
      const result = await fixture.io.ffprobeSpawn(executable, argv, options);
      if (!swapped && argv.includes('-show_frames')) {
        await rename(raceRoot, displacedRoot);
        await rename(replacementRoot, raceRoot);
        swapped = true;
      }
      return result;
    },
  };
  await assert.rejects(
    prepare.verifyPrepared({ root: raceRoot, io: swappingIo }),
    /prepared tree|root|directory|identity|changed|replaced|snapshot/i,
  );
  assert.equal(swapped, true);

  const auditRaceRoot = await cloneRuntime(fixture, 'verify-audit-snapshot-race');
  const auditCleanRoot = await cloneRuntime(fixture, 'verify-audit-snapshot-clean');
  const auditDisplacedRoot = `${auditRaceRoot}-displaced`;
  const auditPromptRelative = 'packets/NAP-V5-SLOT-01/prompt.txt';
  const auditMarker = 'CAPTURED-TREE-MUST-BE-AUDITED-7f0cc9\n';
  await writeFile(path.join(auditRaceRoot, ...auditPromptRelative.split('/')), auditMarker);
  const snapshotPrefix = 'nap-v5-prepared-audit-';
  const priorSnapshots = new Set(
    (await readdir(os.tmpdir())).filter((name) => name.startsWith(snapshotPrefix)),
  );
  let auditSnapshotFound = false;
  let auditRootSwapped = false;
  const auditSwappingIo = {
    ...fixture.io,
    ffprobeSpawn: async (executable, argv, options) => {
      const result = await fixture.io.ffprobeSpawn(executable, argv, options);
      if (!auditRootSwapped && argv.includes('-show_frames')) {
        for (const name of await readdir(os.tmpdir())) {
          if (!name.startsWith(snapshotPrefix) || priorSnapshots.has(name)) continue;
          const candidate = path.join(os.tmpdir(), name, ...auditPromptRelative.split('/'));
          if (await readFile(candidate, 'utf8').catch(() => null) === auditMarker) {
            auditSnapshotFound = true;
            break;
          }
        }
        if (!auditSnapshotFound) throw new Error('NO_BOUND_PRIVATE_AUDIT_SNAPSHOT');
        await rename(auditRaceRoot, auditDisplacedRoot);
        await rename(auditCleanRoot, auditRaceRoot);
        auditRootSwapped = true;
      }
      return result;
    },
  };
  await assert.rejects(
    prepare.buildPreparedInventory({ root: auditRaceRoot, io: auditSwappingIo }),
    /prompt|packet|hash|audit|mismatch/i,
  );
  assert.equal(auditSnapshotFound, true);
  assert.equal(auditRootSwapped, true);

  const snapshotMutationRoot = await cloneRuntime(fixture, 'verify-private-snapshot-mutation');
  const cleanPromptBytes = await readFile(
    path.join(fixture.root, ...auditPromptRelative.split('/')),
  );
  await writeFile(
    path.join(snapshotMutationRoot, ...auditPromptRelative.split('/')),
    auditMarker,
  );
  const snapshotsBeforeMutation = new Set(
    (await readdir(os.tmpdir())).filter((name) => name.startsWith(snapshotPrefix)),
  );
  let privateSnapshotMutated = false;
  const snapshotMutatingIo = {
    ...fixture.io,
    ffprobeSpawn: async (executable, argv, options) => {
      const result = await fixture.io.ffprobeSpawn(executable, argv, options);
      if (!privateSnapshotMutated && argv.includes('-show_frames')) {
        for (const name of await readdir(os.tmpdir())) {
          if (!name.startsWith(snapshotPrefix) || snapshotsBeforeMutation.has(name)) continue;
          const candidate = path.join(os.tmpdir(), name, ...auditPromptRelative.split('/'));
          if (await readFile(candidate, 'utf8').catch(() => null) === auditMarker) {
            await writeFile(candidate, cleanPromptBytes);
            privateSnapshotMutated = true;
            break;
          }
        }
      }
      return result;
    },
  };
  await assert.rejects(
    prepare.buildPreparedInventory({
      root: snapshotMutationRoot,
      io: snapshotMutatingIo,
    }),
    /private|snapshot|prompt|hash|audit|mismatch|changed/i,
  );
  assert.equal(privateSnapshotMutated, true);
});

test('all seven CLI stages remain model-free, strict-argument, resumable, and create no locks or attempts', async () => {
  const fixture = await fullPipeline();
  assert.equal(fixture.counters.model, 0);
  assert.equal(await cliMain(['verify-prepared'], { root: fixture.root, io: fixture.io }), 0);
  for (const forbidden of [
    'locks/method-lock.json',
    'locks/run-lock.json',
    'evaluator-sealed/adjudication-key.bin',
    'sealed-attempts',
    'blind',
    'revealed',
  ]) {
    await assert.rejects(lstat(path.join(fixture.root, forbidden)), { code: 'ENOENT' });
  }
  await assert.rejects(cliMain(['not-a-command'], { root: fixture.root, io: fixture.io }), /unknown.*command/i);
  await assert.rejects(cliMain(['approve-catalog'], { root: fixture.root, io: fixture.io }), /basis|required/i);
  await assert.rejects(cliMain(['freeze-evidence'], { root: fixture.root, io: fixture.io }), /decisions|required/i);
  await assert.rejects(cliMain(['compile-corpus', '--surprise'], { root: fixture.root, io: fixture.io }), /argument|option|usage/i);
  const nestedForbiddenRoot = path.join(fixture.parent, 'nested-forbidden');
  await mkdir(path.join(nestedForbiddenRoot, 'evaluator/safe/locks'), { recursive: true });
  await writeFile(
    path.join(nestedForbiddenRoot, 'evaluator/safe/locks/innocent.txt'),
    'forbidden nested component\n',
    { mode: 0o600 },
  );
  await assert.rejects(
    cliMain(['compile-corpus'], { root: nestedForbiddenRoot, io: fixture.io }),
    /forbidden|run|adjudication|locks/i,
  );
  await assert.rejects(
    lstat(path.join(nestedForbiddenRoot, 'evaluator/corpus-snapshot.json')),
    { code: 'ENOENT' },
  );
  const cliSource = await readFile(new URL('../cli.mjs', import.meta.url), 'utf8');
  const prepareSource = await readFile(new URL('../lib/prepare.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(`${cliSource}\n${prepareSource}`, /codex-adapter|runModel|modelSpawn|sealed-attempt/);
  if (fixture.decisionsPath !== null) await unlink(fixture.decisionsPath).catch(() => {});
});
