import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { CANONICAL_COMMIT, CANONICAL_SHA256 } from '../config.mjs';
import { parseCanonicalLedger } from '../lib/corpus.mjs';
import { choosePriorFrame } from '../lib/frame-recovery.mjs';
import { inventoryVideoChain } from '../lib/video-index.mjs';

const rational = (numerator, denominator = 1n) => ({ numerator: BigInt(numerator), denominator: BigInt(denominator) });
const exactRow = (overrides = {}) => ({
  chronology_index: 1,
  event_id: 'BLOG-V4-TEST',
  recording_id: '10000',
  raw_recording_time: '0:02',
  parsed_time: { kind: 'exact', seconds: 2, sequence: null, raw: '0:02' },
  canonical_status: 'accepted',
  history_value: 'yes',
  ...overrides,
});
const frame = (decodeIndex, globalNumerator, globalDenominator = 1n, overrides = {}) => ({
  decode_index: decodeIndex,
  pts: BigInt(decodeIndex),
  best_effort_timestamp: BigInt(decodeIndex),
  local_seconds: rational(decodeIndex),
  global_seconds: rational(globalNumerator, globalDenominator),
  ...overrides,
});
const file = (recordingId, frames, overrides = {}) => ({
  recording_id: recordingId,
  predecessor_recording_id: null,
  absolute_path: `/recordings/compact_monitor_3_${recordingId}.mp4`,
  sha256: recordingId.padStart(64, '0').slice(-64),
  stream: { codec_name: 'hevc', width: 1920, height: 1080, time_base: '1/1', start_time: '0.000000' },
  frames,
  ...overrides,
});
const inventory = (...files) => ({ files });

test('ordinary anchor is exact recording epoch plus player seconds minus one', () => {
  const result = choosePriorFrame(exactRow(), inventory(file('10000', [frame(0, 11)])));
  assert.deepEqual(result.anchor_time, rational(11));
  assert.equal(result.mode, 'ordinary');
});

test('searches only the current recording and its locked predecessor', () => {
  const older = file('8000', [frame(0, 10)]);
  const predecessor = file('9000', [frame(1, 21, 2)]);
  const current = file('10000', [], { predecessor_recording_id: '9000' });
  const result = choosePriorFrame(exactRow(), inventory(older, predecessor, current));
  assert.deepEqual(result.searched_recording_ids, ['10000', '9000']);
  assert.equal(result.selected_frame.recording_id, '9000');
});

test('retains candidates at or before the anchor and chooses latest global time', () => {
  const current = file('10000', [frame(0, 10), frame(1, 11), frame(2, 12)]);
  const result = choosePriorFrame(exactRow(), inventory(current));
  assert.equal(result.selected_frame.decode_index, 1);
  assert.deepEqual(result.selected_frame.global_seconds, rational(11));
});

test('accepts an age of exactly five seconds inclusively for BLOG-V4-121', () => {
  const row = exactRow({ event_id: 'BLOG-V4-121', recording_id: '100000', parsed_time: { kind: 'exact', seconds: 6, sequence: null, raw: '0:06' } });
  const result = choosePriorFrame(row, inventory(file('100000', [frame(0, 100)])));
  assert.equal(result.automated_recommendation, 'pending_human');
  assert.deepEqual(result.selected_frame.age_seconds, rational(5));
});

test('marks a candidate older than five seconds stale', () => {
  const result = choosePriorFrame(exactRow(), inventory(file('10000', [frame(0, 5999, 1000)])));
  assert.equal(result.automated_recommendation, 'stale_over_5s');
  assert.deepEqual(result.selected_frame.age_seconds, rational(5001, 1000));
});

test('marks missing when no candidate exists at or before the anchor', () => {
  const result = choosePriorFrame(exactRow(), inventory(file('10000', [frame(0, 12)])));
  assert.equal(result.automated_recommendation, 'missing');
  assert.equal(result.selected_frame, null);
});

test('BLOG-V4-035A remains text history but visual timing is unresolvable', () => {
  const row = exactRow({ event_id: 'BLOG-V4-035A', parsed_time: { kind: 'unresolvable', reason: 'approximate', raw: '~0:06' } });
  const result = choosePriorFrame(row, inventory(file('10000', [frame(0, 9)])));
  assert.equal(result.mode, 'timing_unresolvable');
  assert.equal(result.automated_recommendation, 'timing_unresolvable');
  assert.equal(result.anchor_time, null);
  assert.deepEqual(result.searched_recording_ids, []);
});

test('breaks equal-global-time ties by lower decode index', () => {
  const current = file('10000', [frame(7, 11), frame(3, 11)]);
  const result = choosePriorFrame(exactRow(), inventory(current));
  assert.equal(result.selected_frame.decode_index, 3);
});

test('breaks remaining ties by ASCII absolute source path', () => {
  const predecessor = file('9000', [frame(3, 11)], { absolute_path: '/z/source.mp4' });
  const current = file('10000', [frame(3, 11)], { predecessor_recording_id: '9000', absolute_path: '/A/source.mp4' });
  const result = choosePriorFrame(exactRow(), inventory(predecessor, current));
  assert.equal(result.selected_frame.source_path, '/A/source.mp4');
});

test('compares global timestamps by rational cross multiplication across time bases', () => {
  const current = file('10000', [
    frame(0, 109, 10, { local_seconds: rational(9, 10) }),
    frame(1, 11001, 1000, { local_seconds: rational(1001, 1000) }),
  ]);
  const result = choosePriorFrame(exactRow({
    raw_recording_time: '0:03',
    parsed_time: { kind: 'exact', seconds: 3, sequence: null, raw: '0:03' },
  }), inventory(current));
  assert.equal(result.selected_frame.decode_index, 1);
  assert.deepEqual(result.selected_frame.age_seconds, rational(999, 1000));
});

test('duplicate image hashes never collapse distinct history-row recoveries', () => {
  const current = file('10000', [frame(0, 11, 1, { png_sha256: 'a'.repeat(64) })]);
  const first = choosePriorFrame(exactRow({ event_id: 'BLOG-V4-A', chronology_index: 1 }), inventory(current));
  const second = choosePriorFrame(exactRow({ event_id: 'BLOG-V4-B', chronology_index: 2, raw_recording_time: '0:03', parsed_time: { kind: 'exact', seconds: 3, sequence: null, raw: '0:03' } }), inventory(current));
  assert.notEqual(first.event_id, second.event_id);
  assert.equal(first.selected_frame.png_sha256, second.selected_frame.png_sha256);
});

test('all seven frozen later same-second events are unrecoverable visual intervals', () => {
  const laterIds = ['BLOG-V4-008', 'BLOG-V4-011', 'BLOG-V4-021', 'BLOG-V4-104', 'BLOG-V4-176', 'BLOG-V4-182', 'BLOG-V4-204'];
  for (const [index, eventId] of laterIds.entries()) {
    const recordingId = String(20_000 + index);
    const earlier = exactRow({ chronology_index: index * 2 + 1, event_id: `EARLIER-${index}`, recording_id: recordingId });
    const later = exactRow({ chronology_index: index * 2 + 2, event_id: eventId, recording_id: recordingId, raw_recording_time: '0:02b', parsed_time: { kind: 'exact', seconds: 2, sequence: 'b', raw: '0:02b' } });
    const result = choosePriorFrame(later, inventory(file(recordingId, [frame(0, 21)])), { corpusRows: [earlier, later] });
    assert.equal(result.mode, 'same_time_interval_unrecoverable');
    assert.equal(result.automated_recommendation, 'same_time_interval_unrecoverable');
    assert.equal(result.interval_predecessor_event_id, earlier.event_id);
  }
});

test('the first ledger row in a shared base second still uses the ordinary anchor', () => {
  const first = exactRow({ chronology_index: 1, event_id: 'FIRST', parsed_time: { kind: 'exact', seconds: 2, sequence: 'a', raw: '0:02a' } });
  const later = exactRow({ chronology_index: 2, event_id: 'LATER', parsed_time: { kind: 'exact', seconds: 2, sequence: 'b', raw: '0:02b' } });
  const result = choosePriorFrame(first, inventory(file('10000', [frame(0, 11)])), { corpusRows: [first, later] });
  assert.equal(result.mode, 'ordinary');
  assert.equal(result.automated_recommendation, 'pending_human');
});

test('BLOG-V4-001 selects locked predecessor decode 75 at local 304.6875s with 894.5ms age', { timeout: 120_000 }, async () => {
  const [bytes, videos] = await Promise.all([
    readFile('/Users/dylanvu/notes/30-projects/computer-use-nap-v4-canonical-dataset.md'),
    inventoryVideoChain(),
  ]);
  const ledger = parseCanonicalLedger(bytes, {
    dataset_commit: CANONICAL_COMMIT,
    dataset_path: '30-projects/computer-use-nap-v4-canonical-dataset.md',
    sha256: CANONICAL_SHA256,
  });
  const row = ledger.rows.find((entry) => entry.event_id === 'BLOG-V4-001');
  const result = choosePriorFrame(row, videos, { corpusRows: ledger.rows });
  assert.equal(result.selected_frame.recording_id, '1785164400568');
  assert.equal(result.selected_frame.decode_index, 75);
  assert.deepEqual(result.selected_frame.local_seconds, rational(4875, 16));
  assert.deepEqual(result.selected_frame.age_seconds, rational(1789, 2000));
});
