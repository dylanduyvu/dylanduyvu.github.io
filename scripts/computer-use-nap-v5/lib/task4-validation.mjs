import { createHash } from 'node:crypto';
import path from 'node:path';

import {
  CANONICAL_COMMIT,
  CANONICAL_CORPUS_SNAPSHOT_SHA256,
  CANONICAL_SHA256,
} from '../config.mjs';
import { canonicalJson, sha256 } from './immutable.mjs';

const CANONICAL_PATH = '30-projects/computer-use-nap-v4-canonical-dataset.md';
const SHA256 = /^[0-9a-f]{64}$/;
const UTC_MILLISECONDS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const INTEGER_STRING = /^(?:0|-?[1-9]\d*)$/;
const DIGITS = /^\d+$/;
const MAX_RATIONAL_DIGITS = 32;
const MAX_PROVENANCE_TEXT = 1_024;
const EVIDENCE_ROW_KEYS = [
  'chronology_index', 'event_id', 'evidence_scope', 'mode', 'raw_time',
  'anchor_time', 'interval_predecessor_event_id', 'searched_recording_ids',
  'selected_frame', 'automated_checks', 'automated_recommendation',
  'final_disposition', 'review_provenance',
];
const FRAME_KEYS = [
  'recording_id', 'locked_source_sha256', 'decode_index', 'local_pts', 'global_pts',
  'age_milliseconds', 'png_sha256', 'store_relative_path', 'width', 'height',
];
const CHECK_KEYS = [
  'decodes_successfully', 'monitor_is_3', 'timestamp_at_or_before_anchor',
  'age_at_most_5s', 'dimensions_match', 'sha256_matches',
];
const REVIEW_KEYS = ['reviewer', 'reviewed_at', 'method'];
const VIDEO_KEYS = [
  'root', 'start_recording_id', 'endpoint_recording_id', 'files',
  'total_byte_length', 'total_frame_count', 'no_event_recording_ids',
  'tool_provenance',
];
const VIDEO_FILE_KEYS = [
  'recording_id', 'relative_path', 'absolute_path', 'byte_length', 'sha256',
  'predecessor_recording_id', 'stream', 'time_base', 'frames', 'probe_argv',
];
const VIDEO_STREAM_KEYS = ['codec_name', 'width', 'height', 'time_base', 'start_time'];
const VIDEO_FRAME_KEYS = [
  'decode_index', 'pts', 'best_effort_timestamp', 'local_seconds', 'global_seconds',
];
const PROBE_KEYS = ['executable', 'version', 'version_argv', 'probe_argv'];
const FFMPEG_KEYS = [
  'event_id', 'executable', 'version', 'version_argv',
  'extraction_argv', 'validation_argv',
];
const DISPOSITIONS = new Set([
  'usable', 'missing', 'stale_over_5s', 'post_action_risk',
  'timing_unresolvable', 'wrong_monitor', 'corrupt_or_unreadable',
  'same_time_interval_unrecoverable',
]);
const AUTOMATIC_DISPOSITIONS = new Set([
  'missing', 'stale_over_5s', 'timing_unresolvable', 'wrong_monitor',
  'corrupt_or_unreadable', 'same_time_interval_unrecoverable',
]);
const VISUAL_DISPOSITIONS = new Set([
  'usable', 'post_action_risk', 'wrong_monitor', 'corrupt_or_unreadable',
]);

export function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

export function assertExactKeys(value, keys, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${label} must contain exactly: ${keys.join(', ')}`);
  }
}

export function artifactSha256(value) {
  return sha256(canonicalJson(value));
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  if (typeof value === 'bigint') return String(value);
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function sameStableValue(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function boundedText(value, label, maximum = MAX_PROVENANCE_TEXT) {
  if (typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || [...value].length > maximum
    || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error(`${label} must be trimmed nonempty text of at most ${maximum} code points`);
  }
}

function validateToolVersion(value, executable, label) {
  boundedText(value, label);
  if (!value.startsWith(`${executable} version `)
    || /(?:unknown|placeholder|redacted|invented|\.\.\.)/i.test(value)) {
    throw new Error(`${label} must be an actual ${executable} artifact version`);
  }
}

export function validateCanonicalUtcTimestamp(value, label) {
  if (typeof value !== 'string'
    || !UTC_MILLISECONDS.test(value)
    || Number.isNaN(Date.parse(value))
    || new Date(value).toISOString() !== value) {
    throw new Error(`${label} must be an exact canonical UTC timestamp with milliseconds`);
  }
}

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function integerText(value, label, { nonnegative = false, positive = false } = {}) {
  if (typeof value !== 'string'
    || value.length > MAX_RATIONAL_DIGITS + 1
    || !INTEGER_STRING.test(value)) {
    throw new Error(`${label} must be a bounded canonical integer string`);
  }
  const integer = BigInt(value);
  if (nonnegative && integer < 0n) throw new Error(`${label} must be nonnegative`);
  if (positive && integer <= 0n) throw new Error(`${label} must be positive`);
  return integer;
}

function rational(value, label, { nonnegative = false } = {}) {
  assertExactKeys(value, ['numerator', 'denominator'], label);
  const numerator = integerText(value.numerator, `${label} numerator`, { nonnegative });
  const denominator = integerText(value.denominator, `${label} denominator`, { positive: true });
  if (gcd(numerator, denominator) !== 1n) throw new Error(`${label} must be reduced`);
  return { numerator, denominator };
}

function bigintRational(value, label) {
  assertExactKeys(value, ['numerator', 'denominator'], label);
  if (typeof value.numerator !== 'bigint'
    || typeof value.denominator !== 'bigint'
    || value.denominator <= 0n
    || gcd(value.numerator, value.denominator) !== 1n) {
    throw new Error(`${label} must be a reduced BigInt rational`);
  }
  return value;
}

function equalRational(left, right) {
  return left.numerator * right.denominator === right.numerator * left.denominator;
}

function compareRational(left, right) {
  const delta = left.numerator * right.denominator - right.numerator * left.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

function addRational(left, right) {
  return {
    numerator: left.numerator * right.denominator + right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  };
}

function multiplyRational(left, right) {
  return {
    numerator: left.numerator * right.numerator,
    denominator: left.denominator * right.denominator,
  };
}

export function validateCanonicalCorpusSnapshot(snapshot) {
  assertExactKeys(snapshot, [
    'source', 'retained_count', 'accepted_count', 'accepted_history_count',
    'accepted_nontrivial_count', 'rows', 'history', 'targets',
  ], 'Canonical corpus snapshot');
  assertExactKeys(snapshot.source, ['dataset_commit', 'dataset_path', 'sha256'], 'Canonical corpus source');
  if (snapshot.source.dataset_commit !== CANONICAL_COMMIT
    || snapshot.source.dataset_path !== CANONICAL_PATH
    || snapshot.source.sha256 !== CANONICAL_SHA256
    || snapshot.retained_count !== 220
    || snapshot.accepted_count !== 196
    || snapshot.accepted_history_count !== 196
    || snapshot.accepted_nontrivial_count !== 139
    || !Array.isArray(snapshot.rows)
    || snapshot.rows.length !== 220
    || !Array.isArray(snapshot.history)
    || snapshot.history.length !== 196
    || !Array.isArray(snapshot.targets)
    || snapshot.targets.length !== 139) {
    throw new Error('Canonical corpus snapshot source, counts, or arrays are invalid');
  }
  if (artifactSha256(snapshot) !== CANONICAL_CORPUS_SNAPSHOT_SHA256) {
    throw new Error('Canonical corpus snapshot SHA-256 does not match the frozen compiled artifact');
  }
}

function validateProbeProvenance(value, files) {
  assertExactKeys(value, PROBE_KEYS, 'ffprobe provenance');
  validateToolVersion(value.version, 'ffprobe', 'ffprobe provenance version');
  if (value.executable !== 'ffprobe'
    || !sameStableValue(value.version_argv, ['-version'])
    || !Array.isArray(value.probe_argv)
    || value.probe_argv.length !== files.length) {
    throw new Error('ffprobe provenance is invalid');
  }
  files.forEach((file, index) => {
    if (!sameStableValue(value.probe_argv[index], file.probe_argv)) {
      throw new Error(`ffprobe provenance does not bind file ${file.recording_id}`);
    }
  });
}

export function validateVideoInventory(videoInventory) {
  assertExactKeys(videoInventory, VIDEO_KEYS, 'Video inventory');
  if (typeof videoInventory.root !== 'string'
    || !path.isAbsolute(videoInventory.root)
    || !DIGITS.test(videoInventory.start_recording_id)
    || !DIGITS.test(videoInventory.endpoint_recording_id)
    || !Array.isArray(videoInventory.files)
    || videoInventory.files.length === 0
    || !Number.isSafeInteger(videoInventory.total_byte_length)
    || videoInventory.total_byte_length < 0
    || !Number.isSafeInteger(videoInventory.total_frame_count)
    || videoInventory.total_frame_count < 0
    || !Array.isArray(videoInventory.no_event_recording_ids)) {
    throw new Error('Video inventory top-level contract is invalid');
  }
  const files = new Map();
  let totalBytes = 0;
  let totalFrames = 0;
  videoInventory.files.forEach((file, index) => {
    assertExactKeys(file, VIDEO_FILE_KEYS, `Video source ${index + 1}`);
    assertExactKeys(file.stream, VIDEO_STREAM_KEYS, `Video stream ${file.recording_id}`);
    const timeBase = bigintRational(file.time_base, `Video time base ${file.recording_id}`);
    const expectedProbeArgv = [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=codec_name,width,height,time_base,start_time',
      '-show_entries', 'frame=pts,best_effort_timestamp',
      '-show_frames',
      '-of', 'json',
      file.absolute_path,
    ];
    if (!DIGITS.test(file.recording_id)
      || file.recording_id.length > 20
      || (index > 0 && BigInt(file.recording_id) <= BigInt(videoInventory.files[index - 1].recording_id))
      || file.relative_path !== `compact_monitor_3_${file.recording_id}.mp4`
      || file.absolute_path !== path.join(videoInventory.root, file.relative_path)
      || !Number.isSafeInteger(file.byte_length)
      || file.byte_length < 0
      || !SHA256.test(file.sha256)
      || file.predecessor_recording_id !== (index === 0 ? null : videoInventory.files[index - 1].recording_id)
      || file.stream.codec_name !== 'hevc'
      || file.stream.width !== 1920
      || file.stream.height !== 1080
      || file.stream.time_base !== `${file.time_base.numerator}/${file.time_base.denominator}`
      || !/^0(?:\.0+)?$/.test(file.stream.start_time)
      || timeBase.numerator <= 0n
      || !Array.isArray(file.frames)
      || !Array.isArray(file.probe_argv)
      || !sameStableValue(file.probe_argv, expectedProbeArgv)
      || files.has(file.recording_id)) {
      throw new Error(`Video source lock is invalid for ${file.recording_id}`);
    }
    const epoch = { numerator: BigInt(file.recording_id), denominator: 1_000n };
    let previous = null;
    file.frames.forEach((frame, decodeIndex) => {
      assertExactKeys(frame, VIDEO_FRAME_KEYS, `Video frame ${file.recording_id}/${decodeIndex}`);
      if (typeof frame.pts !== 'bigint'
        || typeof frame.best_effort_timestamp !== 'bigint') {
        throw new Error(`Video frame PTS must be BigInt for ${file.recording_id}/${decodeIndex}`);
      }
      const local = bigintRational(frame.local_seconds, `Video local PTS ${file.recording_id}/${decodeIndex}`);
      const global = bigintRational(frame.global_seconds, `Video global PTS ${file.recording_id}/${decodeIndex}`);
      const expectedLocal = multiplyRational(
        { numerator: frame.pts, denominator: 1n },
        file.time_base,
      );
      if (frame.decode_index !== decodeIndex
        || frame.best_effort_timestamp !== frame.pts
        || !equalRational(local, expectedLocal)
        || !equalRational(global, addRational(epoch, local))
        || (previous !== null && compareRational(previous, global) >= 0)) {
        throw new Error(`Video frame source binding is invalid for ${file.recording_id}/${decodeIndex}`);
      }
      previous = global;
    });
    totalBytes += file.byte_length;
    totalFrames += file.frames.length;
    files.set(file.recording_id, file);
  });
  if (videoInventory.files[0].recording_id !== videoInventory.start_recording_id
    || videoInventory.files.at(-1).recording_id !== videoInventory.endpoint_recording_id
    || totalBytes !== videoInventory.total_byte_length
    || totalFrames !== videoInventory.total_frame_count
    || videoInventory.no_event_recording_ids.some((id) => (
      typeof id !== 'string' || !files.has(id)
    ))
    || new Set(videoInventory.no_event_recording_ids).size !== videoInventory.no_event_recording_ids.length
    || videoInventory.no_event_recording_ids.some((id, index, ids) => index > 0 && BigInt(id) <= BigInt(ids[index - 1]))) {
    throw new Error('Video inventory endpoints or totals are invalid');
  }
  boundedText(videoInventory.root, 'Video inventory root', 4_096);
  validateProbeProvenance(videoInventory.tool_provenance, videoInventory.files);
  return files;
}

function evidenceInventoryId(provenance, rows) {
  const draftRows = rows.map((row) => ({
    ...row,
    final_disposition: null,
    review_provenance: null,
  }));
  return createHash('sha256')
    .update(stableStringify({ version: 1, provenance, rows: draftRows }))
    .digest('hex');
}

function validateReview(value, eventId) {
  assertExactKeys(value, REVIEW_KEYS, `Review provenance ${eventId}`);
  if (value.reviewer !== 'codex_visual_review') throw new Error(`Review provenance reviewer is invalid for ${eventId}`);
  validateCanonicalUtcTimestamp(value.reviewed_at, `Review provenance timestamp ${eventId}`);
  boundedText(value.method, `Review provenance method ${eventId}`, 128);
}

function exactSearchIds(row, files) {
  const file = files.get(row.recording_id);
  if (file === undefined) throw new Error(`Canonical row recording is absent from the video lock: ${row.event_id}`);
  return file.predecessor_recording_id === null
    ? [row.recording_id]
    : [row.recording_id, file.predecessor_recording_id];
}

function validateFfmpegProvenance(value, eventId, file, decodeIndex) {
  assertExactKeys(value, FFMPEG_KEYS, `ffmpeg provenance ${eventId}`);
  validateToolVersion(value.version, 'ffmpeg', `ffmpeg provenance version ${eventId}`);
  const extractionPrefix = [
    '-v', 'error', '-i', file.absolute_path, '-vf', `select=eq(n\\,${decodeIndex})`,
    '-fps_mode', 'passthrough', '-frames:v', '1', '-map_metadata', '-1',
    '-map_chapters', '-1', '-c:v', 'png',
  ];
  const extractionOutput = value.extraction_argv?.at(-1);
  const validationInput = value.validation_argv?.[3];
  if (value.event_id !== eventId
    || value.executable !== 'ffmpeg'
    || !sameStableValue(value.version_argv, ['-version'])
    || !Array.isArray(value.extraction_argv)
    || !sameStableValue(value.extraction_argv.slice(0, -1), extractionPrefix)
    || typeof extractionOutput !== 'string'
    || !extractionOutput.startsWith('/')
    || !extractionOutput.endsWith('/extracted.png')
    || !Array.isArray(value.validation_argv)
    || !sameStableValue(
      value.validation_argv,
      ['-v', 'error', '-i', validationInput, '-f', 'null', '-'],
    )
    || typeof validationInput !== 'string'
    || !validationInput.startsWith('/')
    || !validationInput.endsWith('/sanitized.png')) {
    throw new Error(`ffmpeg provenance does not bind selected evidence ${eventId}`);
  }
  for (const argument of [...value.extraction_argv, ...value.validation_argv]) {
    boundedText(argument, `ffmpeg argv for ${eventId}`);
  }
}

function deterministicCandidate(evidence, files, anchor) {
  const candidates = [];
  for (const recordingId of evidence.searched_recording_ids) {
    const source = files.get(recordingId);
    for (const frame of source.frames) {
      if (compareRational(frame.global_seconds, anchor) <= 0) {
        candidates.push({ source, frame });
      }
    }
  }
  candidates.sort((left, right) => {
    const timeOrder = compareRational(right.frame.global_seconds, left.frame.global_seconds);
    if (timeOrder !== 0) return timeOrder;
    if (left.frame.decode_index !== right.frame.decode_index) {
      return left.frame.decode_index - right.frame.decode_index;
    }
    return left.source.absolute_path < right.source.absolute_path
      ? -1
      : left.source.absolute_path > right.source.absolute_path ? 1 : 0;
  });
  return candidates[0] ?? null;
}

function validateSelectedFrame({ evidence, corpusRow, files, ffmpegByEvent }) {
  const frame = evidence.selected_frame;
  assertExactKeys(frame, FRAME_KEYS, `Selected frame ${corpusRow.event_id}`);
  const source = files.get(frame.recording_id);
  if (source === undefined
    || !evidence.searched_recording_ids.includes(frame.recording_id)
    || frame.locked_source_sha256 !== source.sha256
    || !Number.isSafeInteger(frame.decode_index)
    || frame.decode_index < 0
    || frame.width !== source.stream.width
    || frame.height !== source.stream.height
    || frame.width !== 1920
    || frame.height !== 1080
    || !SHA256.test(frame.png_sha256)
    || frame.store_relative_path !== `evaluator/evidence-store/sha256/${frame.png_sha256.slice(0, 2)}/${frame.png_sha256}.png`) {
    throw new Error(`Selected frame source, dimensions, or content-addressed path is invalid for ${corpusRow.event_id}`);
  }
  const sourceFrame = source.frames[frame.decode_index];
  if (sourceFrame === undefined) throw new Error(`Selected decode index is absent for ${corpusRow.event_id}`);
  const local = rational(frame.local_pts, `Selected local PTS ${corpusRow.event_id}`);
  const global = rational(frame.global_pts, `Selected global PTS ${corpusRow.event_id}`);
  const age = rational(frame.age_milliseconds, `Selected age ${corpusRow.event_id}`, { nonnegative: true });
  const anchor = rational(evidence.anchor_time, `Evidence anchor ${corpusRow.event_id}`);
  const chosen = deterministicCandidate(evidence, files, anchor);
  if (chosen === null
    || chosen.source.recording_id !== frame.recording_id
    || chosen.frame.decode_index !== frame.decode_index) {
    throw new Error(`Selected frame is not the deterministic locked candidate for ${corpusRow.event_id}`);
  }
  if (!equalRational(local, sourceFrame.local_seconds)
    || !equalRational(global, sourceFrame.global_seconds)) {
    throw new Error(`Selected frame PTS does not match the locked video frame for ${corpusRow.event_id}`);
  }
  if (compareRational(global, anchor) > 0) throw new Error(`Selected global PTS is after the anchor for ${corpusRow.event_id}`);
  const expectedAge = {
    numerator: (anchor.numerator * global.denominator - global.numerator * anchor.denominator) * 1_000n,
    denominator: anchor.denominator * global.denominator,
  };
  if (!equalRational(age, expectedAge)) {
    throw new Error(`Selected evidence age is not exact for ${corpusRow.event_id}`);
  }
  assertExactKeys(evidence.automated_checks, CHECK_KEYS, `Automated checks ${corpusRow.event_id}`);
  const ageAtMostFiveSeconds = age.numerator <= 5_000n * age.denominator;
  const derivedChecks = {
    decodes_successfully: true,
    monitor_is_3: true,
    timestamp_at_or_before_anchor: true,
    age_at_most_5s: ageAtMostFiveSeconds,
    dimensions_match: true,
    sha256_matches: true,
  };
  if (CHECK_KEYS.some((key) => evidence.automated_checks[key] !== derivedChecks[key])) {
    throw new Error(`Selected evidence automated checks do not match source-bound evidence for ${corpusRow.event_id}`);
  }
  const expectedRecommendation = ageAtMostFiveSeconds ? 'pending_human' : 'stale_over_5s';
  if (evidence.automated_recommendation !== expectedRecommendation) {
    throw new Error(`Selected evidence recommendation is invalid for ${corpusRow.event_id}`);
  }
  if ((AUTOMATIC_DISPOSITIONS.has(expectedRecommendation)
    && evidence.final_disposition !== expectedRecommendation)
    || (expectedRecommendation === 'pending_human'
      && !VISUAL_DISPOSITIONS.has(evidence.final_disposition))) {
    throw new Error(`Selected evidence final disposition is inconsistent for ${corpusRow.event_id}`);
  }
  const ffmpeg = ffmpegByEvent.get(corpusRow.event_id);
  if (ffmpeg === undefined) throw new Error(`Selected evidence lacks ffmpeg provenance for ${corpusRow.event_id}`);
  validateFfmpegProvenance(ffmpeg, corpusRow.event_id, source, frame.decode_index);
}

export function validateEvidenceArtifact({ corpusSnapshot, evidenceInventory, videoInventory }) {
  validateCanonicalCorpusSnapshot(corpusSnapshot);
  const files = validateVideoInventory(videoInventory);
  assertExactKeys(evidenceInventory, ['version', 'inventory_sha256', 'provenance', 'rows'], 'Evidence inventory');
  assertExactKeys(evidenceInventory.provenance, ['inputs', 'options'], 'Evidence inventory provenance');
  assertExactKeys(evidenceInventory.provenance.inputs, ['ffprobe', 'ffmpeg'], 'Evidence provenance inputs');
  if (evidenceInventory.version !== 1
    || !SHA256.test(evidenceInventory.inventory_sha256)
    || !isPlainObject(evidenceInventory.provenance.options)
    || Object.keys(evidenceInventory.provenance.options).length !== 0
    || !Array.isArray(evidenceInventory.provenance.inputs.ffmpeg)
    || !Array.isArray(evidenceInventory.rows)
    || evidenceInventory.rows.length !== 220
    || !sameStableValue(evidenceInventory.provenance.inputs.ffprobe, videoInventory.tool_provenance)) {
    throw new Error('Evidence inventory provenance or row count is invalid');
  }
  if (evidenceInventoryId(evidenceInventory.provenance, evidenceInventory.rows) !== evidenceInventory.inventory_sha256) {
    throw new Error('Evidence inventory SHA-256 does not match the exact Task 3 pre-review artifact');
  }
  const ffmpegByEvent = new Map();
  for (const value of evidenceInventory.provenance.inputs.ffmpeg) {
    if (!isPlainObject(value)
      || typeof value.event_id !== 'string'
      || ffmpegByEvent.has(value.event_id)) {
      throw new Error('Evidence ffmpeg provenance event IDs must be unique');
    }
    ffmpegByEvent.set(value.event_id, value);
  }

  const priorIntervals = new Map();
  const selectedIds = new Set();
  evidenceInventory.rows.forEach((evidence, index) => {
    const corpusRow = corpusSnapshot.rows[index];
    assertExactKeys(evidence, EVIDENCE_ROW_KEYS, `Evidence row ${index + 1}`);
    assertExactKeys(evidence.automated_checks, CHECK_KEYS, `Automated checks ${corpusRow.event_id}`);
    if (evidence.chronology_index !== corpusRow.chronology_index
      || evidence.event_id !== corpusRow.event_id
      || evidence.raw_time !== corpusRow.raw_recording_time) {
      throw new Error(`Evidence row chronology/order/raw time mismatch at ${corpusRow.event_id}`);
    }
    let intervalPredecessor = null;
    if (corpusRow.parsed_time.kind === 'exact') {
      const key = `${corpusRow.recording_id}\0${corpusRow.parsed_time.seconds}`;
      intervalPredecessor = priorIntervals.get(key) ?? null;
      priorIntervals.set(key, corpusRow.event_id);
    }
    const required = corpusRow.canonical_status === 'accepted' && corpusRow.history_value === 'yes';
    if (!required) {
      if (evidence.evidence_scope !== 'not_required'
        || evidence.mode !== 'not_required'
        || evidence.anchor_time !== null
        || evidence.interval_predecessor_event_id !== null
        || !sameStableValue(evidence.searched_recording_ids, [])
        || evidence.selected_frame !== null
        || evidence.automated_recommendation !== null
        || evidence.final_disposition !== null
        || evidence.review_provenance !== null
        || Object.values(evidence.automated_checks).some((value) => value !== null)) {
        throw new Error(`Non-history evidence row is invalid at ${corpusRow.event_id}`);
      }
      return;
    }
    if (evidence.evidence_scope !== 'required' || !DISPOSITIONS.has(evidence.final_disposition)) {
      throw new Error(`Required evidence scope or disposition is invalid at ${corpusRow.event_id}`);
    }
    validateReview(evidence.review_provenance, corpusRow.event_id);
    if (corpusRow.parsed_time.kind === 'unresolvable') {
      if (evidence.mode !== 'timing_unresolvable'
        || evidence.anchor_time !== null
        || evidence.interval_predecessor_event_id !== null
        || !sameStableValue(evidence.searched_recording_ids, [])
        || evidence.selected_frame !== null
        || Object.values(evidence.automated_checks).some((value) => value !== null)
        || evidence.automated_recommendation !== 'timing_unresolvable'
        || evidence.final_disposition !== 'timing_unresolvable') {
        throw new Error(`Timing-unresolvable evidence row is invalid at ${corpusRow.event_id}`);
      }
      return;
    }
    const canonicalAnchor = {
      numerator: BigInt(corpusRow.recording_id) + BigInt(corpusRow.parsed_time.seconds - 1) * 1_000n,
      denominator: 1_000n,
    };
    const anchor = rational(evidence.anchor_time, `Evidence anchor ${corpusRow.event_id}`);
    if (!equalRational(anchor, canonicalAnchor)) {
      throw new Error(`Evidence anchor does not match the canonical row at ${corpusRow.event_id}`);
    }
    if (intervalPredecessor !== null) {
      if (evidence.mode !== 'same_time_interval'
        || evidence.interval_predecessor_event_id !== intervalPredecessor
        || !sameStableValue(evidence.searched_recording_ids, [])
        || evidence.selected_frame !== null
        || Object.values(evidence.automated_checks).some((value) => value !== null)
        || evidence.automated_recommendation !== 'same_time_interval_unrecoverable'
        || evidence.final_disposition !== 'same_time_interval_unrecoverable') {
        throw new Error(`Same-time interval evidence row is invalid at ${corpusRow.event_id}`);
      }
      return;
    }
    if (evidence.mode !== 'strictly_prior'
      || evidence.interval_predecessor_event_id !== null
      || !sameStableValue(evidence.searched_recording_ids, exactSearchIds(corpusRow, files))) {
      throw new Error(`Strictly-prior evidence search is not bound to current plus locked predecessor at ${corpusRow.event_id}`);
    }
    if (evidence.selected_frame === null) {
      if (deterministicCandidate(evidence, files, anchor) !== null
        || evidence.automated_recommendation !== 'missing'
        || evidence.final_disposition !== 'missing'
        || Object.values(evidence.automated_checks).some((value) => value !== null)
        || ffmpegByEvent.has(corpusRow.event_id)) {
        throw new Error(`Unselected evidence recommendation/checks are invalid at ${corpusRow.event_id}`);
      }
      return;
    }
    selectedIds.add(corpusRow.event_id);
    validateSelectedFrame({ evidence, corpusRow, files, ffmpegByEvent });
  });
  if (ffmpegByEvent.size !== selectedIds.size
    || [...ffmpegByEvent.keys()].some((eventId) => !selectedIds.has(eventId))) {
    throw new Error('Evidence ffmpeg provenance must exactly cover selected frames');
  }
  return {
    files,
    final_artifact_sha256: artifactSha256(evidenceInventory),
  };
}
