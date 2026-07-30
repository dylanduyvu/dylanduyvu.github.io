import { createHash } from 'node:crypto';

import { compileCorpusSnapshot } from '../lib/corpus.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';

const VIDEO_ROOT = '/locked/synthetic-monitor-3';
const REVIEWED_AT = '2026-07-30T12:00:00.000Z';
const REVIEW_METHOD = 'full_resolution_png_visual_review';
const CHECK_KEYS = [
  'decodes_successfully',
  'monitor_is_3',
  'timestamp_at_or_before_anchor',
  'age_at_most_5s',
  'dimensions_match',
  'sha256_matches',
];

export const canonicalCorpusSnapshot = await compileCorpusSnapshot();

const isAcceptedHistory = (row) => row.canonical_status === 'accepted' && row.history_value === 'yes';
const intervalKey = (row) => row.parsed_time.kind === 'exact'
  ? `${row.recording_id}\0${row.parsed_time.seconds}`
  : null;

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function rational(numerator, denominator = 1n) {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return {
    numerator: String(n / divisor),
    denominator: String(d / divisor),
  };
}

function bigintRational(numerator, denominator = 1n) {
  const value = rational(numerator, denominator);
  return { numerator: BigInt(value.numerator), denominator: BigInt(value.denominator) };
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  if (typeof value === 'bigint') return String(value);
  return value;
}

export function evidenceInventoryHash({ provenance, rows }) {
  const draftRows = rows.map((row) => ({
    ...structuredClone(row),
    final_disposition: null,
    review_provenance: null,
  }));
  return createHash('sha256')
    .update(JSON.stringify(stableValue({ version: 1, provenance, rows: draftRows })))
    .digest('hex');
}

function selectedUsableIds(corpusSnapshot, usableTargetCount) {
  const ordinary = corpusSnapshot.rows.filter((row) => isAcceptedHistory(row) && row.parsed_time.kind === 'exact');
  const firstPhysicalByInterval = new Map();
  for (const row of corpusSnapshot.rows) {
    const key = intervalKey(row);
    if (key !== null && !firstPhysicalByInterval.has(key)) firstPhysicalByInterval.set(key, row.event_id);
  }
  const firstByInterval = ordinary.filter((row, index, rows) => (
    rows.findIndex((candidate) => intervalKey(candidate) === intervalKey(row)) === index
    && firstPhysicalByInterval.get(intervalKey(row)) === row.event_id
  ));
  const usable = new Set(firstByInterval.slice(0, 10).map((row) => row.event_id));
  let targets = 0;
  for (const row of firstByInterval) {
    if (targets >= usableTargetCount) break;
    if (usable.has(row.event_id) || row.input_method !== 'pointer') continue;
    usable.add(row.event_id);
    targets += 1;
  }
  if (targets !== usableTargetCount) throw new Error(`Cannot create ${usableTargetCount} usable target fixtures`);
  return usable;
}

function makeVideoInventory(corpusSnapshot, usableIds) {
  const recordingIds = [...new Set(corpusSnapshot.rows.map((row) => row.recording_id))]
    .sort((left, right) => BigInt(left) < BigInt(right) ? -1 : BigInt(left) > BigInt(right) ? 1 : 0);
  const selectedByRecording = new Map(recordingIds.map((recordingId) => [recordingId, []]));
  for (const row of corpusSnapshot.rows) {
    if (!usableIds.has(row.event_id)) continue;
    const localMilliseconds = BigInt(row.parsed_time.seconds) * 1_000n - 1_250n;
    selectedByRecording.get(row.recording_id).push({ row, localMilliseconds });
  }
  const files = recordingIds.map((recordingId, index) => {
    const absolutePath = `${VIDEO_ROOT}/compact_monitor_3_${recordingId}.mp4`;
    const entries = selectedByRecording.get(recordingId)
      .sort((left, right) => left.localMilliseconds < right.localMilliseconds ? -1 : left.localMilliseconds > right.localMilliseconds ? 1 : 0);
    const frames = entries.map(({ localMilliseconds }, decodeIndex) => ({
      decode_index: decodeIndex,
      pts: localMilliseconds,
      best_effort_timestamp: localMilliseconds,
      local_seconds: bigintRational(localMilliseconds, 1_000n),
      global_seconds: bigintRational(BigInt(recordingId) + localMilliseconds, 1_000n),
    }));
    const probeArgv = [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=codec_name,width,height,time_base,start_time',
      '-show_entries', 'frame=pts,best_effort_timestamp',
      '-show_frames', '-of', 'json', absolutePath,
    ];
    return {
      recording_id: recordingId,
      relative_path: `compact_monitor_3_${recordingId}.mp4`,
      absolute_path: absolutePath,
      byte_length: 1_000 + index,
      sha256: sha256(`video:${recordingId}`),
      predecessor_recording_id: index === 0 ? null : recordingIds[index - 1],
      stream: {
        codec_name: 'hevc',
        width: 1920,
        height: 1080,
        time_base: '1/1000',
        start_time: '0.000000',
      },
      time_base: { numerator: 1n, denominator: 1_000n },
      frames,
      probe_argv: probeArgv,
    };
  });
  return {
    root: VIDEO_ROOT,
    start_recording_id: recordingIds[0],
    endpoint_recording_id: recordingIds.at(-1),
    files,
    total_byte_length: files.reduce((sum, file) => sum + file.byte_length, 0),
    total_frame_count: files.reduce((sum, file) => sum + file.frames.length, 0),
    no_event_recording_ids: [],
    tool_provenance: {
      executable: 'ffprobe',
      version: 'ffprobe version 8.0 synthetic-fixture',
      version_argv: ['-version'],
      probe_argv: files.map((file) => [...file.probe_argv]),
    },
  };
}

function compareRationals(left, right) {
  const delta = BigInt(left.numerator) * BigInt(right.denominator)
    - BigInt(right.numerator) * BigInt(left.denominator);
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

function exactAnchor(row) {
  return rational(BigInt(row.recording_id) + BigInt(row.parsed_time.seconds - 1) * 1_000n, 1_000n);
}

function candidateFor(row, searchedRecordingIds, videoInventory) {
  const anchor = exactAnchor(row);
  const candidates = videoInventory.files
    .filter((file) => searchedRecordingIds.includes(file.recording_id))
    .flatMap((file) => file.frames
      .filter((frame) => compareRationals(frame.global_seconds, anchor) <= 0)
      .map((frame) => ({ file, frame })));
  candidates.sort((left, right) => (
    compareRationals(right.frame.global_seconds, left.frame.global_seconds)
    || left.frame.decode_index - right.frame.decode_index
    || left.file.absolute_path.localeCompare(right.file.absolute_path)
  ));
  return candidates[0] ?? null;
}

function selectedFrameFor(row, candidate) {
  const { file, frame } = candidate;
  const anchor = exactAnchor(row);
  const ageNumerator = (
    BigInt(anchor.numerator) * BigInt(frame.global_seconds.denominator)
    - BigInt(frame.global_seconds.numerator) * BigInt(anchor.denominator)
  ) * 1_000n;
  const ageDenominator = BigInt(anchor.denominator) * BigInt(frame.global_seconds.denominator);
  const pngSha256 = sha256(`png:${row.event_id}`);
  return {
    recording_id: file.recording_id,
    locked_source_sha256: file.sha256,
    decode_index: frame.decode_index,
    local_pts: rational(frame.local_seconds.numerator, frame.local_seconds.denominator),
    global_pts: rational(frame.global_seconds.numerator, frame.global_seconds.denominator),
    age_milliseconds: rational(ageNumerator, ageDenominator),
    png_sha256: pngSha256,
    store_relative_path: `evaluator/evidence-store/sha256/${pngSha256.slice(0, 2)}/${pngSha256}.png`,
    width: 1920,
    height: 1080,
  };
}

function makeEvidenceRows(corpusSnapshot, usableIds, videoInventory) {
  const priorIntervals = new Map();
  return corpusSnapshot.rows.map((row) => {
    const accepted = isAcceptedHistory(row);
    let predecessor = null;
    if (row.parsed_time.kind === 'exact') {
      const key = intervalKey(row);
      predecessor = priorIntervals.get(key) ?? null;
      priorIntervals.set(key, row.event_id);
    }
    if (!accepted) {
      return {
        chronology_index: row.chronology_index,
        event_id: row.event_id,
        evidence_scope: 'not_required',
        mode: 'not_required',
        raw_time: row.raw_recording_time,
        anchor_time: null,
        interval_predecessor_event_id: null,
        searched_recording_ids: [],
        selected_frame: null,
        automated_checks: Object.fromEntries(CHECK_KEYS.map((key) => [key, null])),
        automated_recommendation: null,
        final_disposition: null,
        review_provenance: null,
      };
    }
    let mode = 'strictly_prior';
    let disposition = 'missing';
    if (row.parsed_time.kind === 'unresolvable') {
      mode = 'timing_unresolvable';
      disposition = 'timing_unresolvable';
    } else {
      if (predecessor !== null) {
        mode = 'same_time_interval';
        disposition = 'same_time_interval_unrecoverable';
      }
    }
    const fileIndex = videoInventory.files.findIndex((file) => file.recording_id === row.recording_id);
    const searched = mode === 'strictly_prior'
      ? fileIndex === 0
        ? [row.recording_id]
        : [row.recording_id, videoInventory.files[fileIndex - 1].recording_id]
      : [];
    const candidate = mode === 'strictly_prior'
      ? candidateFor(row, searched, videoInventory)
      : null;
    const selectedFrame = candidate === null ? null : selectedFrameFor(row, candidate);
    const ageAtMostFiveSeconds = selectedFrame !== null
      && BigInt(selectedFrame.age_milliseconds.numerator)
        <= 5_000n * BigInt(selectedFrame.age_milliseconds.denominator);
    if (mode === 'strictly_prior' && selectedFrame !== null) {
      disposition = usableIds.has(row.event_id)
        ? 'usable'
        : ageAtMostFiveSeconds ? 'post_action_risk' : 'stale_over_5s';
    }
    return {
      chronology_index: row.chronology_index,
      event_id: row.event_id,
      evidence_scope: 'required',
      mode,
      raw_time: row.raw_recording_time,
      anchor_time: row.parsed_time.kind === 'exact' ? exactAnchor(row) : null,
      interval_predecessor_event_id: mode === 'same_time_interval' ? predecessor : null,
      searched_recording_ids: searched,
      selected_frame: selectedFrame,
      automated_checks: selectedFrame === null
        ? Object.fromEntries(CHECK_KEYS.map((key) => [key, null]))
        : {
            decodes_successfully: true,
            monitor_is_3: true,
            timestamp_at_or_before_anchor: true,
            age_at_most_5s: ageAtMostFiveSeconds,
            dimensions_match: true,
            sha256_matches: true,
          },
      automated_recommendation: selectedFrame === null
        ? disposition
        : ageAtMostFiveSeconds ? 'pending_human' : 'stale_over_5s',
      final_disposition: disposition,
      review_provenance: {
        reviewer: 'codex_visual_review',
        reviewed_at: REVIEWED_AT,
        method: REVIEW_METHOD,
      },
    };
  });
}

function makeProvenance(rows, videoInventory) {
  const ffmpeg = rows.filter((row) => row.selected_frame !== null).map((row) => {
    const frame = row.selected_frame;
    const file = videoInventory.files.find((candidate) => candidate.recording_id === frame.recording_id);
    return {
      event_id: row.event_id,
      executable: 'ffmpeg',
      version: 'ffmpeg version 8.0 synthetic-fixture',
      version_argv: ['-version'],
      extraction_argv: [
        '-v', 'error', '-i', file.absolute_path, '-vf', `select=eq(n\\,${frame.decode_index})`,
        '-fps_mode', 'passthrough', '-frames:v', '1', '-map_metadata', '-1',
        '-map_chapters', '-1', '-c:v', 'png', `/tmp/${row.event_id}/extracted.png`,
      ],
      validation_argv: ['-v', 'error', '-i', `/tmp/${row.event_id}/sanitized.png`, '-f', 'null', '-'],
    };
  });
  return {
    inputs: {
      ffprobe: structuredClone(videoInventory.tool_provenance),
      ffmpeg,
    },
    options: {},
  };
}

export function makeTask4Sources({
  corpusSnapshot = structuredClone(canonicalCorpusSnapshot),
  usableTargetCount = 84,
} = {}) {
  const usableIds = selectedUsableIds(corpusSnapshot, usableTargetCount);
  const videoInventory = makeVideoInventory(corpusSnapshot, usableIds);
  const rows = makeEvidenceRows(corpusSnapshot, usableIds, videoInventory);
  const provenance = makeProvenance(rows, videoInventory);
  const evidenceInventory = {
    version: 1,
    inventory_sha256: evidenceInventoryHash({ provenance, rows }),
    provenance,
    rows,
  };
  const evidenceDecisions = {
    version: 1,
    inventory_sha256: evidenceInventory.inventory_sha256,
    review_provenance: {
      reviewer: 'codex_visual_review',
      reviewed_at: REVIEWED_AT,
      method: REVIEW_METHOD,
    },
    decisions: rows.filter((row) => row.evidence_scope === 'required').map((row) => ({
      chronology_index: row.chronology_index,
      event_id: row.event_id,
      disposition: row.final_disposition,
    })),
  };
  return { corpusSnapshot, evidenceInventory, evidenceDecisions, videoInventory };
}

export function catalogArtifactSha256(value) {
  return sha256(canonicalJson(value));
}
