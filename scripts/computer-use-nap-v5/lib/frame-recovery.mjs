function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function rational(numerator, denominator = 1n) {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error('Rational denominator cannot be zero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}

function add(left, right) {
  return rational(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

function subtract(left, right) {
  return rational(
    left.numerator * right.denominator - right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

function compare(left, right) {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

function freezeDeep(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep(child);
    Object.freeze(value);
  }
  return value;
}

function validateRow(row) {
  if (row === null || typeof row !== 'object' || !Number.isSafeInteger(row.chronology_index) || typeof row.event_id !== 'string' || !/^\d+$/.test(row.recording_id) || row.parsed_time === null || typeof row.parsed_time !== 'object') {
    throw new TypeError('Recovery row is invalid');
  }
}

function precedingSameSecond(row, corpusRows) {
  if (row.parsed_time.kind !== 'exact') return null;
  const earlier = corpusRows
    .filter((candidate) => candidate !== null
      && typeof candidate === 'object'
      && candidate.chronology_index < row.chronology_index
      && candidate.recording_id === row.recording_id
      && candidate.parsed_time?.kind === 'exact'
      && candidate.parsed_time.seconds === row.parsed_time.seconds)
    .sort((left, right) => right.chronology_index - left.chronology_index);
  return earlier[0] ?? null;
}

function resultBase(row, mode, recommendation, overrides = {}) {
  return freezeDeep({
    event_id: row.event_id,
    chronology_index: row.chronology_index,
    mode,
    anchor_time: null,
    interval_predecessor_event_id: null,
    searched_recording_ids: [],
    selected_frame: null,
    automated_recommendation: recommendation,
    ...overrides,
  });
}

export function choosePriorFrame(row, videoInventory, { corpusRows = [] } = {}) {
  validateRow(row);
  if (videoInventory === null || typeof videoInventory !== 'object' || !Array.isArray(videoInventory.files) || !Array.isArray(corpusRows)) {
    throw new TypeError('Video inventory and corpus rows are required');
  }
  if (row.parsed_time.kind !== 'exact') {
    return resultBase(row, 'timing_unresolvable', 'timing_unresolvable');
  }
  if (!Number.isSafeInteger(row.parsed_time.seconds) || row.parsed_time.seconds < 0) {
    throw new TypeError('Exact player seconds must be a nonnegative safe integer');
  }

  const intervalPredecessor = precedingSameSecond(row, corpusRows);
  if (intervalPredecessor !== null) {
    return resultBase(row, 'same_time_interval_unrecoverable', 'same_time_interval_unrecoverable', {
      interval_predecessor_event_id: intervalPredecessor.event_id,
    });
  }

  const anchor = add(rational(BigInt(row.recording_id), 1000n), rational(BigInt(row.parsed_time.seconds - 1)));
  const byId = new Map(videoInventory.files.map((entry) => [entry.recording_id, entry]));
  const current = byId.get(row.recording_id);
  const searchedIds = current === undefined
    ? [row.recording_id]
    : [current.recording_id, current.predecessor_recording_id].filter((value) => value !== null);
  const searchedFiles = searchedIds.map((id) => byId.get(id)).filter((entry) => entry !== undefined);
  const candidates = [];
  for (const sourceFile of searchedFiles) {
    if (!Array.isArray(sourceFile.frames) || typeof sourceFile.absolute_path !== 'string') throw new TypeError('Video inventory file is invalid');
    for (const sourceFrame of sourceFile.frames) {
      if (sourceFrame?.global_seconds === null || typeof sourceFrame?.global_seconds !== 'object') throw new TypeError('Video frame global time is invalid');
      if (compare(sourceFrame.global_seconds, anchor) <= 0) {
        candidates.push({ sourceFile, sourceFrame });
      }
    }
  }
  candidates.sort((left, right) => {
    const time = compare(right.sourceFrame.global_seconds, left.sourceFrame.global_seconds);
    if (time !== 0) return time;
    if (left.sourceFrame.decode_index !== right.sourceFrame.decode_index) return left.sourceFrame.decode_index - right.sourceFrame.decode_index;
    return left.sourceFile.absolute_path < right.sourceFile.absolute_path ? -1 : left.sourceFile.absolute_path > right.sourceFile.absolute_path ? 1 : 0;
  });
  const chosen = candidates[0];
  if (chosen === undefined) {
    return resultBase(row, 'ordinary', 'missing', {
      anchor_time: anchor,
      searched_recording_ids: searchedIds,
    });
  }

  const age = subtract(anchor, chosen.sourceFrame.global_seconds);
  const recommendation = compare(age, rational(5n)) <= 0 ? 'pending_human' : 'stale_over_5s';
  const selected = {
    recording_id: chosen.sourceFile.recording_id,
    locked_source_sha256: chosen.sourceFile.sha256,
    source_path: chosen.sourceFile.absolute_path,
    decode_index: chosen.sourceFrame.decode_index,
    pts: chosen.sourceFrame.pts,
    local_seconds: chosen.sourceFrame.local_seconds,
    global_seconds: chosen.sourceFrame.global_seconds,
    age_seconds: age,
    width: chosen.sourceFile.stream?.width,
    height: chosen.sourceFile.stream?.height,
  };
  if (chosen.sourceFrame.png_sha256 !== undefined) selected.png_sha256 = chosen.sourceFrame.png_sha256;
  return resultBase(row, 'ordinary', recommendation, {
    anchor_time: anchor,
    searched_recording_ids: searchedIds,
    selected_frame: selected,
  });
}
