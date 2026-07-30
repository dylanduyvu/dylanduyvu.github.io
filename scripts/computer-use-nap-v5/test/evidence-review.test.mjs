import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { deflateSync } from 'node:zlib';

import { buildEvidenceInventory, renderEvidenceReview } from '../lib/evidence-review.mjs';

const VIDEO_SHA = 'a'.repeat(64);
const CURRENT_SHA = 'b'.repeat(64);

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBytes.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 8 + data.length);
  return chunk;
}

function pngHeaderFragment(width = 1920, height = 1080) {
  const bytes = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12, 'ascii');
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  bytes[24] = 8;
  bytes[25] = 2;
  bytes[26] = 0;
  bytes[27] = 0;
  bytes[28] = 0;
  return bytes;
}

function pngBytes(width = 1920, height = 1080, marker = 0, extraInflatedBytes = 0) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const scanlines = Buffer.alloc(height * (1 + width * 3) + extraInflatedBytes);
  scanlines[1] = marker;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(scanlines)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const PNG_BYTES = pngBytes();
const PNG_SHA = createHash('sha256').update(PNG_BYTES).digest('hex');

function makeRows() {
  return Array.from({ length: 220 }, (_, index) => ({
    chronology_index: index + 1,
    event_id: `BLOG-V4-${String(index + 1).padStart(3, '0')}`,
    recording_id: String(1_000_000 + index * 10_000),
    raw_recording_time: '0:01',
    parsed_time: { kind: 'exact', seconds: 1, sequence: null, raw: '0:01' },
    canonical_status: index < 196 ? 'accepted' : 'unresolved',
    history_value: index < 196 ? 'yes' : 'no',
  }));
}

function rational(numerator, denominator = 1) {
  return { numerator: BigInt(numerator), denominator: BigInt(denominator) };
}

function sourceFilesFor(rows, indexes, eligibleIndexes = []) {
  const eligible = new Set(eligibleIndexes);
  const files = new Map();
  for (const index of indexes) {
    const row = rows[index];
    const current = BigInt(row.recording_id);
    const predecessor = String(current - 1_000n);
    const local = rational(3, 4);
    const global = rational((current - 1_000n) * 4n + 3_000n, 4_000n);
    for (const file of [
      {
        recording_id: predecessor,
        absolute_path: `/locked/compact_monitor_3_${predecessor}.mp4`,
        sha256: VIDEO_SHA,
        predecessor_recording_id: null,
        stream: { width: 1920, height: 1080 },
        frames: eligible.has(index) ? [{ decode_index: 7, local_seconds: local, global_seconds: global }] : [],
      },
      {
        recording_id: row.recording_id,
        absolute_path: `/locked/compact_monitor_3_${row.recording_id}.mp4`,
        sha256: CURRENT_SHA,
        predecessor_recording_id: predecessor,
        stream: { width: 1920, height: 1080 },
        frames: [],
      },
    ]) {
      file.probe_argv = ['-v', 'error', '-show_frames', file.absolute_path];
      files.set(file.recording_id, file);
    }
  }
  return [...files.values()];
}

function videoInventory(rows, indexes = [0], eligibleIndexes = []) {
  const files = sourceFilesFor(rows, indexes, eligibleIndexes);
  return {
    files,
    tool_provenance: {
      executable: 'ffprobe',
      version: 'ffprobe version 8.0 Copyright FFmpeg',
      version_argv: ['-version'],
      probe_argv: files.map((file) => [...file.probe_argv]),
    },
  };
}

function selectedFrame(row, overrides = {}) {
  const current = BigInt(row.recording_id);
  const recordingId = String(current - 1_000n);
  return {
    recording_id: recordingId,
    locked_source_sha256: VIDEO_SHA,
    decode_index: 7,
    local_pts: { numerator: '3', denominator: '4' },
    global_pts: { numerator: String((current - 1_000n) * 4n + 3_000n), denominator: '4000' },
    age_milliseconds: { numerator: '250', denominator: '1' },
    png_sha256: PNG_SHA,
    store_relative_path: `evaluator/evidence-store/sha256/${PNG_SHA.slice(0, 2)}/${PNG_SHA}.png`,
    width: 1920,
    height: 1080,
    ...overrides,
  };
}

function passingEvidence(row, overrides = {}) {
  const predecessor = String(BigInt(row.recording_id) - 1_000n);
  const sourcePath = `/locked/compact_monitor_3_${predecessor}.mp4`;
  return {
    event_id: row.event_id,
    searched_recording_ids: [row.recording_id, predecessor],
    selected_frame: selectedFrame(row),
    selected_png_bytes: PNG_BYTES,
    tool_provenance: {
      executable: 'ffmpeg',
      version: 'ffmpeg version 8.0 Copyright FFmpeg',
      version_argv: ['-version'],
      extraction_argv: [
        '-v', 'error', '-i', sourcePath, '-vf', 'select=eq(n\\,7)', '-fps_mode', 'passthrough',
        '-frames:v', '1', '-map_metadata', '-1', '-map_chapters', '-1', '-c:v', 'png',
        `/tmp/${row.event_id}/extracted.png`,
      ],
      validation_argv: ['-v', 'error', '-i', `/tmp/${row.event_id}/sanitized.png`, '-f', 'null', '-'],
    },
    automated_checks: {
      decodes_successfully: true,
      monitor_is_3: true,
      timestamp_at_or_before_anchor: true,
      age_at_most_5s: true,
      dimensions_match: true,
      sha256_matches: true,
    },
    ...overrides,
  };
}

function recovery(rows, selectedIndexes = []) {
  const selected = new Set(selectedIndexes);
  const seen = new Set();
  const ordinaryIndexes = [];
  rows.forEach((row, index) => {
    if (row.canonical_status !== 'accepted' || row.history_value !== 'yes' || row.parsed_time.kind !== 'exact') return;
    const key = `${row.recording_id}\0${row.parsed_time.seconds}`;
    if (seen.has(key)) return;
    seen.add(key);
    ordinaryIndexes.push(index);
  });
  const sourceLock = videoInventory(rows, ordinaryIndexes, selectedIndexes);
  const preparedEvidence = ordinaryIndexes.map((index) => {
    if (selected.has(index)) return passingEvidence(rows[index]);
    const predecessor = String(BigInt(rows[index].recording_id) - 1_000n);
    return {
      event_id: rows[index].event_id,
      searched_recording_ids: [rows[index].recording_id, predecessor],
      selected_frame: null,
    };
  });
  return { preparedEvidence, videoInventory: sourceLock };
}

function build(options) {
  return buildEvidenceInventory(options);
}

function decisionsFor(draft, choices = new Map()) {
  return draft.rows.filter((row) => row.evidence_scope === 'required').map((row) => ({
    event_id: row.event_id,
    inventory_sha256: draft.inventory_sha256,
    disposition: choices.get(row.event_id)
      ?? (row.automated_recommendation === 'pending_human' ? 'usable' : row.automated_recommendation),
    review_provenance: {
      reviewer: 'codex_visual_review',
      reviewed_at: '2026-07-30T12:00:00.000Z',
      method: 'full_resolution_png_visual_review',
    },
  }));
}

test('builds exact rows for all 220 corpus events and requires validated executable provenance', () => {
  const rows = makeRows();
  const recovered = recovery(rows);
  const inventory = build({ corpusRows: rows, ...recovered });
  assert.deepEqual(Object.keys(inventory), ['version', 'inventory_sha256', 'provenance', 'rows']);
  assert.equal(inventory.rows.length, 220);
  assert.equal(inventory.rows.filter((row) => row.evidence_scope === 'required').length, 196);
  assert.deepEqual(Object.keys(inventory.rows[0]), [
    'chronology_index', 'event_id', 'evidence_scope', 'mode', 'raw_time', 'anchor_time',
    'interval_predecessor_event_id', 'searched_recording_ids', 'selected_frame',
    'automated_checks', 'automated_recommendation', 'final_disposition', 'review_provenance',
  ]);
  assert.deepEqual(inventory.provenance.inputs.ffprobe, recovered.videoInventory.tool_provenance);
  assert.deepEqual(inventory.provenance.inputs.ffmpeg, []);
  assert.throws(() => buildEvidenceInventory({ corpusRows: rows, videoInventory: recovered.videoInventory }), /prepared|recovery|search/i);
  assert.throws(() => buildEvidenceInventory({ corpusRows: rows, preparedEvidence: recovered.preparedEvidence }), /video.*inventory|source lock/i);
  const falselyMissing = structuredClone(recovered.videoInventory);
  const predecessor = String(BigInt(rows[0].recording_id) - 1_000n);
  falselyMissing.files.find((file) => file.recording_id === predecessor).frames = [{
    decode_index: 7,
    local_seconds: rational(3, 4),
    global_seconds: rational(3999, 4),
  }];
  assert.throws(() => build({ corpusRows: rows, preparedEvidence: recovered.preparedEvidence, videoInventory: falselyMissing }), /missing|eligible|candidate/i);
});

test('cross-checks a selected frame against its locked source and binds the PNG hash to the only authoritative path', () => {
  const rows = makeRows();
  const recovered = recovery(rows, [0]);
  const inventory = build({ corpusRows: rows, ...recovered });
  const selected = inventory.rows[0].selected_frame;
  assert.deepEqual(Object.keys(selected), [
    'recording_id', 'locked_source_sha256', 'decode_index', 'local_pts', 'global_pts',
    'age_milliseconds', 'png_sha256', 'store_relative_path', 'width', 'height',
  ]);
  assert.deepEqual(selected.local_pts, { numerator: '3', denominator: '4' });
  assert.deepEqual(selected.global_pts, { numerator: '3999', denominator: '4' });
  assert.deepEqual(selected.age_milliseconds, { numerator: '250', denominator: '1' });
  assert.equal(selected.store_relative_path, `evaluator/evidence-store/sha256/${PNG_SHA.slice(0, 2)}/${PNG_SHA}.png`);
  assert.equal(inventory.rows[0].automated_recommendation, 'pending_human');
  const nonlatest = structuredClone(recovered.videoInventory);
  nonlatest.files.find((file) => file.recording_id === rows[0].recording_id).frames = [{
    decode_index: 0,
    local_seconds: rational(0),
    global_seconds: rational(1000),
  }];
  assert.throws(() => build({ corpusRows: rows, preparedEvidence: recovered.preparedEvidence, videoInventory: nonlatest }), /latest|chosen|candidate|selection/i);
});

test('rejects post-anchor, 1x1, recording, source, decode, PTS, age, PNG-hash, and path mutations instead of trusting passing booleans', () => {
  const rows = makeRows();
  const base = passingEvidence(rows[0]);
  const otherPng = pngBytes(1, 1, 1);
  const otherHash = createHash('sha256').update(otherPng).digest('hex');
  const mutations = [
    { selected_frame: { ...base.selected_frame, global_pts: { numerator: '4001', denominator: '4' }, age_milliseconds: { numerator: '0', denominator: '1' } } },
    { selected_frame: { ...base.selected_frame, width: 1, height: 1 }, selected_png_bytes: otherPng },
    { selected_frame: { ...base.selected_frame, recording_id: rows[0].recording_id } },
    { selected_frame: { ...base.selected_frame, locked_source_sha256: CURRENT_SHA } },
    { selected_frame: { ...base.selected_frame, decode_index: 8 } },
    { selected_frame: { ...base.selected_frame, global_pts: { numerator: '3998', denominator: '4' } } },
    { selected_frame: { ...base.selected_frame, local_pts: { numerator: '2', denominator: '4' } } },
    { selected_frame: { ...base.selected_frame, age_milliseconds: { numerator: '251', denominator: '1' } } },
    { selected_frame: { ...base.selected_frame, png_sha256: otherHash, store_relative_path: `evaluator/evidence-store/sha256/${otherHash.slice(0, 2)}/${otherHash}.png` } },
    { selected_frame: { ...base.selected_frame, store_relative_path: `evaluator/evidence-store/${PNG_SHA}.png` } },
    { selected_png_bytes: pngHeaderFragment() },
  ];
  const recovered = recovery(rows, [0]);
  for (const mutation of mutations) {
    const preparedEvidence = recovered.preparedEvidence.map((entry, index) => index === 0 ? { ...base, ...mutation } : entry);
    assert.throws(() => build({
      corpusRows: rows,
      preparedEvidence,
      videoInventory: recovered.videoInventory,
    }), /frame|source|decode|PTS|age|dimension|PNG|path|check|recording|chunk|IEND|inflate|artifact|provenance/i);
  }
  const oversizedPng = pngBytes(1920, 1080, 0, 1);
  const oversizedHash = createHash('sha256').update(oversizedPng).digest('hex');
  const oversizedEntry = {
    ...base,
    selected_png_bytes: oversizedPng,
    selected_frame: {
      ...base.selected_frame,
      png_sha256: oversizedHash,
      store_relative_path: `evaluator/evidence-store/sha256/${oversizedHash.slice(0, 2)}/${oversizedHash}.png`,
    },
  };
  assert.throws(() => build({
    corpusRows: rows,
    preparedEvidence: recovered.preparedEvidence.map((entry, index) => index === 0 ? oversizedEntry : entry),
    videoInventory: recovered.videoInventory,
  }), /bounded IDAT|output limit|maxOutputLength/i);
});

test('marks an accepted later same-second row unrecoverable even when the interval predecessor is non-history', () => {
  const rows = makeRows();
  rows[0] = { ...rows[0], canonical_status: 'unresolved', history_value: 'no', recording_id: '9000000' };
  rows[196] = { ...rows[196], canonical_status: 'accepted', history_value: 'yes', recording_id: '9000000' };
  const inventory = build({ corpusRows: rows, ...recovery(rows) });
  assert.equal(inventory.rows[0].evidence_scope, 'not_required');
  assert.equal(inventory.rows[196].mode, 'same_time_interval');
  assert.equal(inventory.rows[196].interval_predecessor_event_id, rows[0].event_id);
  assert.equal(inventory.rows[196].automated_recommendation, 'same_time_interval_unrecoverable');
});

test('requires explicit automatic confirmations and restricts mechanically passing visual decisions', () => {
  const rows = makeRows();
  const recovered = recovery(rows, [0, 1, 2, 3]);
  const preparedEvidence = recovered.preparedEvidence;
  const sourceLock = recovered.videoInventory;
  const draft = build({ corpusRows: rows, preparedEvidence, videoInventory: sourceLock });
  const choices = new Map([
    [rows[0].event_id, 'usable'],
    [rows[1].event_id, 'post_action_risk'],
    [rows[2].event_id, 'wrong_monitor'],
    [rows[3].event_id, 'corrupt_or_unreadable'],
  ]);
  const final = build({ corpusRows: rows, preparedEvidence, videoInventory: sourceLock, decisions: decisionsFor(draft, choices) });
  assert.deepEqual(final.rows.slice(0, 4).map((row) => row.final_disposition), [...choices.values()]);
  assert.equal(final.rows.filter((row) => row.final_disposition !== null).length, 196);
  const invalid = decisionsFor(draft);
  invalid[4] = { ...invalid[4], disposition: 'usable' };
  assert.throws(() => build({ corpusRows: rows, preparedEvidence, videoInventory: sourceLock, decisions: invalid }), /confirm|recommendation/i);
});

test('rejects missing, extra, out-of-order, wrong-hash, extra-key, and pending final decisions', () => {
  const rows = makeRows();
  const recovered = recovery(rows);
  const draft = build({ corpusRows: rows, ...recovered });
  const decisions = decisionsFor(draft);
  assert.throws(() => build({ corpusRows: rows, ...recovered, decisions: decisions.slice(0, -1) }), /missing/i);
  assert.throws(() => build({ corpusRows: rows, ...recovered, decisions: [...decisions, decisions[0]] }), /extra|count/i);
  assert.throws(() => build({ corpusRows: rows, ...recovered, decisions: [decisions[1], decisions[0], ...decisions.slice(2)] }), /order/i);
  assert.throws(() => build({ corpusRows: rows, ...recovered, decisions: decisions.map((value, index) => index === 0 ? { ...value, inventory_sha256: CURRENT_SHA } : value) }), /inventory.*sha|hash/i);
  assert.throws(() => build({ corpusRows: rows, ...recovered, decisions: decisions.map((value, index) => index === 0 ? { ...value, extra: true } : value) }), /exactly/i);
  assert.throws(() => build({ corpusRows: rows, ...recovered, decisions: decisions.map((value, index) => index === 0 ? { ...value, disposition: 'pending' } : value) }), /pending|disposition/i);
});

test('rejects missing, placeholder, redacted, or non-exact tool provenance and inconsistent claimed checks', () => {
  const rows = makeRows();
  const recovered = recovery(rows, [0]);
  const derived = build({ corpusRows: rows, ...recovered }).provenance;
  assert.doesNotThrow(() => build({ corpusRows: rows, ...recovered, provenance: structuredClone(derived) }));
  const invented = structuredClone(derived);
  invented.inputs.ffprobe.version = 'ffprobe version invented';
  assert.throws(() => build({ corpusRows: rows, ...recovered, provenance: invented }), /provenance|artifact|match/i);
  const badVideo = structuredClone(recovered.videoInventory);
  badVideo.tool_provenance.probe_argv[0] = ['<redacted>'];
  assert.throws(() => build({ corpusRows: rows, preparedEvidence: recovered.preparedEvidence, videoInventory: badVideo }), /provenance|probe|argv|redacted/i);
  const evidence = structuredClone(recovered.preparedEvidence[0]);
  evidence.automated_checks = { ...evidence.automated_checks, age_at_most_5s: false };
  assert.throws(() => build({
    corpusRows: rows,
    preparedEvidence: recovered.preparedEvidence.map((entry, index) => index === 0 ? evidence : entry),
    videoInventory: recovered.videoInventory,
  }), /check|age/i);
});

test('renders only hash-bound full-resolution evidence as authoritative and contact sheets as navigation-only', () => {
  const rows = makeRows();
  const draft = build({ corpusRows: rows, ...recovery(rows, [0]) });
  const markdown = renderEvidenceReview(draft, { contactSheetLinks: ['contact-sheets/sheet-001.png'] });
  assert.match(markdown, /full-resolution authoritative evidence/i);
  assert.match(markdown, new RegExp(`!\\[BLOG-V4-001 full-resolution\\]\\(evaluator/evidence-store/sha256/${PNG_SHA.slice(0, 2)}/${PNG_SHA}\\.png\\)`));
  assert.match(markdown, /\[contact sheet 1 — navigation only\]\(contact-sheets\/sheet-001\.png\)/i);
  assert.doesNotMatch(markdown, /!\[[^\]]*contact sheet/i);
  assert.throws(() => renderEvidenceReview(draft, { contactSheetLinks: ['https://evil.example/sheet.png'] }), /contact|relative|safe|path/i);
  assert.throws(() => renderEvidenceReview(draft, { contactSheetLinks: ['contact-sheets/x).png'] }), /contact|relative|safe|path/i);
  assert.throws(() => renderEvidenceReview(draft, { contactSheetLinks: ['contact-sheets/x\u00a0y.png'] }), /contact|relative|safe|path/i);
  assert.throws(() => renderEvidenceReview(draft, { contactSheetLinks: ['%2e%2e/secret.png'] }), /contact|relative|safe|path/i);
});

test('keeps the deterministic pre-review inventory hash stable across finalization and sensitive to source-bound evidence', () => {
  const rows = makeRows();
  const recovered = recovery(rows, [0]);
  const preparedEvidence = recovered.preparedEvidence;
  const sourceLock = recovered.videoInventory;
  const first = build({ corpusRows: rows, preparedEvidence, videoInventory: sourceLock });
  const second = build({ corpusRows: structuredClone(rows), preparedEvidence: structuredClone(preparedEvidence), videoInventory: structuredClone(sourceLock) });
  const final = build({ corpusRows: rows, preparedEvidence, videoInventory: sourceLock, decisions: decisionsFor(first) });
  const changed = build({
    corpusRows: rows,
    preparedEvidence: preparedEvidence.map((entry, index) => index === 0
      ? { ...entry, searched_recording_ids: [...entry.searched_recording_ids].reverse() }
      : entry),
    videoInventory: sourceLock,
  });
  assert.match(first.inventory_sha256, /^[0-9a-f]{64}$/);
  assert.equal(first.inventory_sha256, second.inventory_sha256);
  assert.equal(first.inventory_sha256, final.inventory_sha256);
  assert.notEqual(first.inventory_sha256, changed.inventory_sha256);
});

test('enforces frozen corpus counts, eight dispositions, Codex provenance, and null finals for non-history rows', () => {
  const rows = makeRows();
  const recovered = recovery(rows);
  const draft = build({ corpusRows: rows, ...recovered });
  const final = build({ corpusRows: rows, ...recovered, decisions: decisionsFor(draft) });
  const allowed = new Set(['usable', 'missing', 'stale_over_5s', 'post_action_risk', 'timing_unresolvable', 'wrong_monitor', 'corrupt_or_unreadable', 'same_time_interval_unrecoverable']);
  assert.equal(allowed.size, 8);
  assert.ok(final.rows.slice(0, 196).every((row) => allowed.has(row.final_disposition) && row.final_disposition !== 'pending'));
  assert.ok(final.rows.slice(0, 196).every((row) => row.review_provenance.reviewer === 'codex_visual_review'));
  assert.ok(final.rows.slice(196).every((row) => row.final_disposition === null && row.review_provenance === null));
  assert.throws(() => build({ corpusRows: rows.slice(0, 219), ...recovered }), /220/);
  assert.throws(() => build({ corpusRows: rows.map((row, index) => index === 195 ? { ...row, canonical_status: 'unresolved', history_value: 'no' } : row), ...recovered }), /196/);
});
