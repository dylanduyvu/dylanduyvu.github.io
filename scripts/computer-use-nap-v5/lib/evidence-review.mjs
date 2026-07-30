import { constants as bufferConstants } from 'node:buffer';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';

const ROW_KEYS = [
  'chronology_index', 'event_id', 'evidence_scope', 'mode', 'raw_time', 'anchor_time',
  'interval_predecessor_event_id', 'searched_recording_ids', 'selected_frame',
  'automated_checks', 'automated_recommendation', 'final_disposition', 'review_provenance',
];
const FRAME_KEYS = [
  'recording_id', 'locked_source_sha256', 'decode_index', 'local_pts', 'global_pts',
  'age_milliseconds', 'png_sha256', 'store_relative_path', 'width', 'height',
];
const CHECK_KEYS = [
  'decodes_successfully', 'monitor_is_3', 'timestamp_at_or_before_anchor',
  'age_at_most_5s', 'dimensions_match', 'sha256_matches',
];
const DECISION_KEYS = ['event_id', 'inventory_sha256', 'disposition', 'review_provenance'];
const REVIEW_PROVENANCE_KEYS = ['reviewer', 'reviewed_at', 'method'];
const FROZEN_DISPOSITIONS = new Set([
  'usable', 'missing', 'stale_over_5s', 'post_action_risk', 'timing_unresolvable',
  'wrong_monitor', 'corrupt_or_unreadable', 'same_time_interval_unrecoverable',
]);
const AUTOMATIC_DISPOSITIONS = new Set([
  'timing_unresolvable', 'missing', 'stale_over_5s',
  'same_time_interval_unrecoverable', 'wrong_monitor', 'corrupt_or_unreadable',
]);
const VISUAL_DISPOSITIONS = new Set([
  'usable', 'post_action_risk', 'wrong_monitor', 'corrupt_or_unreadable',
]);
const SHA256 = /^[0-9a-f]{64}$/;
const RECORDING_ID = /^\d+$/;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

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

function isSafeRelativePngPath(value) {
  if (typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || !value.endsWith('.png')
    || value.startsWith('/')
    || value.includes('\\')
    || value.includes('%')
    || /[\s\u0000-\u001f\u007f]/u.test(value)
    || /[?#[\]()<>]/.test(value)
    || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) {
    return false;
  }
  const components = value.split('/');
  return components.every((component) => component.length > 0 && component !== '.' && component !== '..');
}

function integer(value, label) {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number' && Number.isSafeInteger(value)) return BigInt(value);
  if (typeof value === 'string' && /^-?\d+$/.test(value)) return BigInt(value);
  throw new TypeError(`${label} must be an integer`);
}

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function rational(value, label, { nonnegative = false } = {}) {
  assertExactKeys(value, ['numerator', 'denominator'], label);
  let numerator = integer(value.numerator, `${label} numerator`);
  let denominator = integer(value.denominator, `${label} denominator`);
  if (denominator === 0n) throw new Error(`${label} denominator must not be zero`);
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  if (nonnegative && numerator < 0n) throw new Error(`${label} must be nonnegative`);
  const divisor = gcd(numerator, denominator);
  return {
    numerator: String(numerator / divisor),
    denominator: String(denominator / divisor),
  };
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

function sha256(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function cloneJson(value, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  let encoded;
  try {
    encoded = JSON.stringify(value);
  } catch {
    throw new TypeError(`${label} must be JSON-serializable`);
  }
  if (encoded === undefined) throw new TypeError(`${label} must be JSON-serializable`);
  const cloned = JSON.parse(encoded);
  if (stableStringify(cloned) !== stableStringify(value)) throw new TypeError(`${label} must contain only JSON values`);
  return cloned;
}

function emptyChecks() {
  return Object.fromEntries(CHECK_KEYS.map((key) => [key, null]));
}

function checks(value) {
  assertExactKeys(value, CHECK_KEYS, 'Automated checks');
  const normalized = {};
  for (const key of CHECK_KEYS) {
    if (typeof value[key] !== 'boolean') throw new TypeError(`Automated check ${key} must be boolean`);
    normalized[key] = value[key];
  }
  return normalized;
}

function selectedFrame(value) {
  assertExactKeys(value, FRAME_KEYS, 'Selected frame');
  if (!RECORDING_ID.test(value.recording_id)) throw new Error('Selected frame recording_id is invalid');
  if (!SHA256.test(value.locked_source_sha256)) throw new Error('Selected frame locked source SHA-256 is invalid');
  if (!Number.isSafeInteger(value.decode_index) || value.decode_index < 0) throw new Error('Selected frame decode index is invalid');
  if (!SHA256.test(value.png_sha256)) throw new Error('Selected frame PNG SHA-256 is invalid');
  if (!isSafeRelativePngPath(value.store_relative_path)) {
    throw new Error('Selected frame store path must be a safe relative PNG path');
  }
  if (!Number.isSafeInteger(value.width) || value.width <= 0 || !Number.isSafeInteger(value.height) || value.height <= 0) {
    throw new Error('Selected frame dimensions must be positive safe integers');
  }
  return {
    recording_id: value.recording_id,
    locked_source_sha256: value.locked_source_sha256,
    decode_index: value.decode_index,
    local_pts: rational(value.local_pts, 'Selected frame local PTS'),
    global_pts: rational(value.global_pts, 'Selected frame global PTS'),
    age_milliseconds: rational(value.age_milliseconds, 'Selected frame age', { nonnegative: true }),
    png_sha256: value.png_sha256,
    store_relative_path: value.store_relative_path,
    width: value.width,
    height: value.height,
  };
}

function rationalParts(value, label) {
  const normalized = rational(value, label);
  return { numerator: BigInt(normalized.numerator), denominator: BigInt(normalized.denominator) };
}

function compareRationals(left, right) {
  const delta = left.numerator * right.denominator - right.numerator * left.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

function subtractRationals(left, right) {
  return rational({
    numerator: left.numerator * right.denominator - right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  }, 'Derived rational');
}

function equalRational(serialized, source, label) {
  const normalizedSource = rational(source, `${label} source`);
  return serialized.numerator === normalizedSource.numerator
    && serialized.denominator === normalizedSource.denominator;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngMetadata(value, expectedWidth, expectedHeight) {
  if (!Buffer.isBuffer(value) && !(value instanceof Uint8Array)) {
    throw new TypeError('Selected PNG bytes are required for source-bound verification');
  }
  if (!Number.isSafeInteger(expectedWidth) || expectedWidth <= 0 || !Number.isSafeInteger(expectedHeight) || expectedHeight <= 0) {
    throw new Error('Locked expected PNG dimensions are invalid');
  }
  const bytes = Buffer.from(value);
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('Selected PNG signature is invalid');
  let offset = 8;
  let state = 'before_ihdr';
  let width;
  let height;
  let bitDepth;
  let colorType;
  let sawPlte = false;
  const idat = [];
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw new Error('Selected PNG has a truncated chunk');
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new Error('Selected PNG has truncated chunk data');
    const typeBytes = bytes.subarray(offset + 4, offset + 8);
    const type = typeBytes.toString('ascii');
    if (!/^[A-Z]{4}$/.test(type) || !['IHDR', 'PLTE', 'IDAT', 'IEND'].includes(type)) {
      throw new Error(`Selected PNG contains a non-sanitized chunk: ${type}`);
    }
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (crc32(Buffer.concat([typeBytes, data])) !== bytes.readUInt32BE(offset + 8 + length)) {
      throw new Error(`Selected PNG CRC mismatch in ${type}`);
    }
    if (state === 'before_ihdr') {
      if (type !== 'IHDR' || length !== 13) throw new Error('Selected PNG IHDR must be first and length 13');
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      const validDepths = {
        0: [1, 2, 4, 8, 16],
        2: [8, 16],
        3: [1, 2, 4, 8],
        4: [8, 16],
        6: [8, 16],
      };
      if (width === 0 || height === 0
        || !validDepths[colorType]?.includes(bitDepth)
        || data[10] !== 0
        || data[11] !== 0
        || data[12] !== 0) {
        throw new Error('Selected PNG IHDR is unsupported or invalid');
      }
      if (width !== expectedWidth || height !== expectedHeight) {
        throw new Error('Selected PNG IHDR dimensions do not match the locked source');
      }
      state = 'before_idat';
    } else if (type === 'IHDR') {
      throw new Error('Selected PNG may contain only one IHDR');
    } else if (type === 'PLTE') {
      if (state !== 'before_idat' || sawPlte || length === 0 || length % 3 !== 0 || length > 768 || colorType === 0 || colorType === 4) {
        throw new Error('Selected PNG PLTE is invalid or out of order');
      }
      sawPlte = true;
    } else if (type === 'IDAT') {
      if (state === 'after_idat' || state === 'ended') throw new Error('Selected PNG IDAT chunks must be consecutive');
      state = 'in_idat';
      idat.push(data);
    } else {
      if (length !== 0 || idat.length === 0 || (colorType === 3 && !sawPlte)) throw new Error('Selected PNG IEND is invalid or premature');
      state = 'ended';
      offset = end;
      if (offset !== bytes.length) throw new Error('Selected PNG has trailing bytes after IEND');
      break;
    }
    offset = end;
  }
  if (state !== 'ended') throw new Error('Selected PNG is missing IEND');
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  const rowBits = BigInt(width) * BigInt(channels) * BigInt(bitDepth);
  const rowBytesBig = (rowBits + 7n) / 8n;
  const expectedLengthBig = BigInt(height) * (rowBytesBig + 1n);
  if (expectedLengthBig <= 0n || expectedLengthBig > BigInt(bufferConstants.MAX_LENGTH)) {
    throw new Error('Selected PNG expected scanline output exceeds the safe buffer limit');
  }
  const expectedLength = Number(expectedLengthBig);
  let decoded;
  try {
    decoded = inflateSync(Buffer.concat(idat), { maxOutputLength: expectedLength });
  } catch (error) {
    throw new Error('Selected PNG bounded IDAT inflate failed or exceeded the exact output limit', { cause: error });
  }
  if (decoded.length !== expectedLength) throw new Error('Selected PNG inflated scanline size is invalid');
  const rowBytes = Number(rowBytesBig);
  for (let row = 0; row < height; row += 1) {
    if (decoded[row * (rowBytes + 1)] > 4) throw new Error('Selected PNG scanline filter is invalid');
  }
  return { sha256: createHash('sha256').update(bytes).digest('hex'), width, height };
}

function videoFiles(videoInventory) {
  if (!isPlainObject(videoInventory) || !Array.isArray(videoInventory.files)) {
    throw new TypeError('A videoInventory source lock is required for selected evidence');
  }
  const files = new Map();
  for (const file of videoInventory.files) {
    if (!isPlainObject(file) || !RECORDING_ID.test(file.recording_id) || files.has(file.recording_id)) {
      throw new Error('Video inventory recording IDs must be valid and unique');
    }
    if (!SHA256.test(file.sha256)
      || typeof file.absolute_path !== 'string'
      || !file.absolute_path.startsWith('/')
      || !isPlainObject(file.stream)
      || !Number.isSafeInteger(file.stream.width)
      || file.stream.width <= 0
      || !Number.isSafeInteger(file.stream.height)
      || file.stream.height <= 0
      || !Array.isArray(file.frames)) {
      throw new Error(`Video inventory source lock is invalid for ${file.recording_id}`);
    }
    if (file.predecessor_recording_id !== null
      && (typeof file.predecessor_recording_id !== 'string' || !RECORDING_ID.test(file.predecessor_recording_id))) {
      throw new Error(`Video inventory predecessor is invalid for ${file.recording_id}`);
    }
    files.set(file.recording_id, file);
  }
  return files;
}

function assertActualVersion(executable, version) {
  if (typeof version !== 'string'
    || !version.startsWith(`${executable} version `)
    || version.trim() !== version
    || /(?:unknown|placeholder|redacted|invented|\.\.\.)/i.test(version)) {
    throw new Error(`${executable} artifact provenance version is invalid`);
  }
}

function assertArtifactArgv(argv, label) {
  if (!Array.isArray(argv)
    || argv.length === 0
    || argv.some((argument) => typeof argument !== 'string'
      || argument.length === 0
      || argument.trim() !== argument
      || /(?:placeholder|redacted|<[^>]*>|\.\.\.)/i.test(argument))) {
    throw new Error(`${label} must be an exact artifact argv array`);
  }
}

function sameJson(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function deriveEvaluatorProvenance(preparedEvidence, videoInventory, suppliedProvenance) {
  const files = videoFiles(videoInventory);
  const probe = videoInventory.tool_provenance;
  assertExactKeys(probe, ['executable', 'version', 'version_argv', 'probe_argv'], 'ffprobe artifact provenance');
  if (probe.executable !== 'ffprobe' || !sameJson(probe.version_argv, ['-version'])) {
    throw new Error('ffprobe artifact provenance executable or version argv is invalid');
  }
  assertActualVersion('ffprobe', probe.version);
  if (!Array.isArray(probe.probe_argv) || probe.probe_argv.length !== videoInventory.files.length) {
    throw new Error('ffprobe artifact provenance must bind every video inventory file');
  }
  videoInventory.files.forEach((file, index) => {
    assertArtifactArgv(file.probe_argv, `ffprobe file argv ${index + 1}`);
    assertArtifactArgv(probe.probe_argv[index], `ffprobe provenance argv ${index + 1}`);
    if (!sameJson(probe.probe_argv[index], file.probe_argv) || file.probe_argv.at(-1) !== file.absolute_path) {
      throw new Error(`ffprobe provenance argv is not bound to video artifact ${file.recording_id}`);
    }
  });

  const ffmpeg = [];
  for (const entry of preparedEvidence) {
    if (entry?.selected_frame === null || entry?.selected_frame === undefined) continue;
    const selected = entry.selected_frame;
    const source = files.get(selected.recording_id);
    if (source === undefined) throw new Error(`ffmpeg provenance selected source is absent for ${entry.event_id}`);
    const artifact = entry.tool_provenance;
    assertExactKeys(artifact, ['executable', 'version', 'version_argv', 'extraction_argv', 'validation_argv'], `ffmpeg artifact provenance for ${entry.event_id}`);
    if (artifact.executable !== 'ffmpeg' || !sameJson(artifact.version_argv, ['-version'])) {
      throw new Error(`ffmpeg artifact provenance executable or version argv is invalid for ${entry.event_id}`);
    }
    assertActualVersion('ffmpeg', artifact.version);
    assertArtifactArgv(artifact.extraction_argv, `ffmpeg extraction argv for ${entry.event_id}`);
    assertArtifactArgv(artifact.validation_argv, `ffmpeg validation argv for ${entry.event_id}`);
    const expectedPrefix = [
      '-v', 'error', '-i', source.absolute_path, '-vf', `select=eq(n\\,${selected.decode_index})`,
      '-fps_mode', 'passthrough', '-frames:v', '1', '-map_metadata', '-1',
      '-map_chapters', '-1', '-c:v', 'png',
    ];
    const extractionOutput = artifact.extraction_argv.at(-1);
    if (!sameJson(artifact.extraction_argv.slice(0, -1), expectedPrefix)
      || typeof extractionOutput !== 'string'
      || !extractionOutput.startsWith('/')
      || !extractionOutput.endsWith('/extracted.png')) {
      throw new Error(`ffmpeg extraction argv is not bound to selected artifact ${entry.event_id}`);
    }
    const validationInput = artifact.validation_argv[3];
    if (!sameJson(artifact.validation_argv, ['-v', 'error', '-i', validationInput, '-f', 'null', '-'])
      || typeof validationInput !== 'string'
      || !validationInput.startsWith('/')
      || !validationInput.endsWith('/sanitized.png')) {
      throw new Error(`ffmpeg validation argv is not bound to sanitized artifact ${entry.event_id}`);
    }
    ffmpeg.push({ event_id: entry.event_id, ...cloneJson(artifact, `ffmpeg artifact provenance for ${entry.event_id}`) });
  }

  const derived = {
    inputs: {
      ffprobe: cloneJson(probe, 'ffprobe artifact provenance'),
      ffmpeg,
    },
    options: {},
  };
  if (suppliedProvenance !== undefined) {
    const supplied = cloneJson(suppliedProvenance, 'Supplied inventory provenance');
    if (!sameJson(supplied, derived)) throw new Error('Supplied provenance does not exactly match execution artifacts');
  }
  return derived;
}

function validateLockedSearch(row, entry, files) {
  const current = files.get(row.recording_id);
  if (current === undefined) throw new Error(`Current recording is absent from the video source lock for ${row.event_id}`);
  const expectedSearch = current.predecessor_recording_id === null
    ? [row.recording_id]
    : [row.recording_id, current.predecessor_recording_id];
  if (entry.searched_recording_ids.length !== expectedSearch.length
    || expectedSearch.some((recordingId) => !entry.searched_recording_ids.includes(recordingId))) {
    throw new Error(`Searched recordings must be exactly the current and locked predecessor for ${row.event_id}`);
  }
  return { current, expectedSearch };
}

function selectLockedCandidate(row, entry, files, anchor) {
  const { expectedSearch } = validateLockedSearch(row, entry, files);
  const anchorParts = rationalParts(anchor, 'Anchor time');
  const candidates = [];
  for (const recordingId of expectedSearch) {
    const source = files.get(recordingId);
    if (source === undefined) throw new Error(`Searched source recording is absent for ${row.event_id}`);
    const decodeIndexes = new Set();
    for (const frame of source.frames) {
      if (!isPlainObject(frame)
        || !Number.isSafeInteger(frame.decode_index)
        || frame.decode_index < 0
        || decodeIndexes.has(frame.decode_index)) {
        throw new Error(`Locked frame decode indexes are invalid for ${recordingId}`);
      }
      decodeIndexes.add(frame.decode_index);
      rationalParts(frame.local_seconds, `Locked local PTS for ${recordingId}/${frame.decode_index}`);
      const global = rationalParts(frame.global_seconds, `Locked global PTS for ${recordingId}/${frame.decode_index}`);
      if (compareRationals(global, anchorParts) <= 0) candidates.push({ source, frame, global });
    }
  }
  candidates.sort((left, right) => {
    const timeOrder = compareRationals(right.global, left.global);
    if (timeOrder !== 0) return timeOrder;
    if (left.frame.decode_index !== right.frame.decode_index) return left.frame.decode_index - right.frame.decode_index;
    return left.source.absolute_path < right.source.absolute_path
      ? -1
      : left.source.absolute_path > right.source.absolute_path ? 1 : 0;
  });
  return candidates[0] ?? null;
}

function verifySelectedEvidence(row, entry, selected, anchor, files) {
  const chosen = selectLockedCandidate(row, entry, files, anchor);
  if (chosen === null) throw new Error(`Selected frame has no eligible locked candidate for ${row.event_id}`);
  const { source, frame: sourceFrame } = chosen;
  if (selected.recording_id !== source.recording_id
    || selected.decode_index !== sourceFrame.decode_index
    || !equalRational(selected.local_pts, sourceFrame.local_seconds, 'Selected local PTS')
    || !equalRational(selected.global_pts, sourceFrame.global_seconds, 'Selected global PTS')) {
    throw new Error(`Selected frame is not the deterministic chosen candidate for ${row.event_id}`);
  }
  if (!equalRational(selected.local_pts, sourceFrame.local_seconds, 'Selected local PTS')) {
    throw new Error(`Selected frame local PTS does not match the source lock for ${row.event_id}`);
  }
  if (!equalRational(selected.global_pts, sourceFrame.global_seconds, 'Selected global PTS')) {
    throw new Error(`Selected frame global PTS does not match the source lock for ${row.event_id}`);
  }

  const anchorParts = rationalParts(anchor, 'Anchor time');
  const globalParts = rationalParts(selected.global_pts, 'Selected global PTS');
  const ageSeconds = subtractRationals(anchorParts, globalParts);
  const ageMilliseconds = rational({
    numerator: BigInt(ageSeconds.numerator) * 1000n,
    denominator: BigInt(ageSeconds.denominator),
  }, 'Derived frame age');
  if (selected.age_milliseconds.numerator !== ageMilliseconds.numerator
    || selected.age_milliseconds.denominator !== ageMilliseconds.denominator) {
    throw new Error(`Selected frame age does not match anchor minus global PTS for ${row.event_id}`);
  }

  const png = pngMetadata(entry.selected_png_bytes, source.stream.width, source.stream.height);
  const expectedPath = `evaluator/evidence-store/sha256/${selected.png_sha256.slice(0, 2)}/${selected.png_sha256}.png`;
  if (selected.store_relative_path !== expectedPath) {
    throw new Error(`Selected frame path is not the hash-bound evaluator evidence-store path for ${row.event_id}`);
  }
  const derivedChecks = {
    decodes_successfully: true,
    monitor_is_3: true,
    timestamp_at_or_before_anchor: compareRationals(globalParts, anchorParts) <= 0,
    age_at_most_5s: BigInt(ageMilliseconds.numerator) >= 0n
      && BigInt(ageMilliseconds.numerator) <= 5_000n * BigInt(ageMilliseconds.denominator),
    dimensions_match: selected.width === source.stream.width
      && selected.height === source.stream.height
      && png.width === selected.width
      && png.height === selected.height,
    sha256_matches: selected.locked_source_sha256 === source.sha256
      && selected.png_sha256 === png.sha256,
  };
  const claimed = checks(entry.automated_checks);
  for (const key of CHECK_KEYS) {
    if (claimed[key] !== derivedChecks[key]) {
      throw new Error(`Automated check ${key} is inconsistent with source-bound evidence for ${row.event_id}`);
    }
  }
  return derivedChecks;
}

function exactAnchor(row) {
  if (!RECORDING_ID.test(row.recording_id)) throw new Error(`Invalid recording ID for ${row.event_id}`);
  if (!Number.isSafeInteger(row.parsed_time.seconds) || row.parsed_time.seconds < 0) {
    throw new Error(`Invalid exact player time for ${row.event_id}`);
  }
  return rational({
    numerator: BigInt(row.recording_id) + BigInt(row.parsed_time.seconds - 1) * 1000n,
    denominator: 1000n,
  }, `Anchor time for ${row.event_id}`);
}

function recommendation(selected, automatedChecks) {
  if (selected === null) return 'missing';
  if (!automatedChecks.decodes_successfully) return 'corrupt_or_unreadable';
  if (!automatedChecks.monitor_is_3) return 'wrong_monitor';
  if (!automatedChecks.timestamp_at_or_before_anchor) return 'timing_unresolvable';
  if (!automatedChecks.age_at_most_5s) return 'stale_over_5s';
  if (!automatedChecks.dimensions_match || !automatedChecks.sha256_matches) return 'corrupt_or_unreadable';
  return 'pending_human';
}

function validateCorpus(corpusRows) {
  if (!Array.isArray(corpusRows) || corpusRows.length !== 220) throw new Error('Evidence inventory requires exactly 220 corpus rows');
  const eventIds = new Set();
  let acceptedHistory = 0;
  for (const [index, row] of corpusRows.entries()) {
    if (!isPlainObject(row)) throw new TypeError(`Corpus row ${index + 1} must be an object`);
    if (row.chronology_index !== index + 1) throw new Error('Corpus rows must be in exact chronology order');
    if (typeof row.event_id !== 'string' || row.event_id.length === 0 || eventIds.has(row.event_id)) throw new Error('Corpus event IDs must be nonempty and unique');
    eventIds.add(row.event_id);
    if (row.canonical_status === 'accepted' && row.history_value === 'yes') acceptedHistory += 1;
  }
  if (acceptedHistory !== 196) throw new Error('Evidence inventory requires exactly 196 accepted History=yes rows');
}

function preparedMap(preparedEvidence, corpusRows) {
  if (!Array.isArray(preparedEvidence)) throw new TypeError('Prepared evidence must be an array');
  const corpusIds = new Set(corpusRows.map((row) => row.event_id));
  const result = new Map();
  for (const entry of preparedEvidence) {
    if (!isPlainObject(entry) || typeof entry.event_id !== 'string') throw new TypeError('Prepared evidence entry must have an event_id');
    if (!corpusIds.has(entry.event_id)) throw new Error(`Extra prepared evidence event ID: ${entry.event_id}`);
    if (result.has(entry.event_id)) throw new Error(`Duplicate prepared evidence event ID: ${entry.event_id}`);
    result.set(entry.event_id, entry);
  }
  return result;
}

function buildDraftRows(corpusRows, preparedEvidence, files) {
  const prepared = preparedMap(preparedEvidence, corpusRows);
  const priorInInterval = new Map();
  return corpusRows.map((corpusRow) => {
    const required = corpusRow.canonical_status === 'accepted' && corpusRow.history_value === 'yes';
    const rawTime = corpusRow.raw_recording_time ?? corpusRow.parsed_time?.raw;
    if (typeof rawTime !== 'string' || rawTime.length === 0) throw new Error(`Missing raw time for ${corpusRow.event_id}`);
    const parsedTime = corpusRow.parsed_time;
    if (!isPlainObject(parsedTime) || !['exact', 'unresolvable'].includes(parsedTime.kind)) {
      throw new Error(`Invalid parsed time for ${corpusRow.event_id}`);
    }
    let intervalPredecessor = null;
    if (parsedTime.kind === 'exact') {
      if (!Number.isSafeInteger(parsedTime.seconds) || parsedTime.seconds < 0) {
        throw new Error(`Invalid exact player time for ${corpusRow.event_id}`);
      }
      const intervalKey = `${corpusRow.recording_id}\0${parsedTime.seconds}`;
      intervalPredecessor = priorInInterval.get(intervalKey) ?? null;
      priorInInterval.set(intervalKey, corpusRow.event_id);
    }
    if (!required) {
      return {
        chronology_index: corpusRow.chronology_index,
        event_id: corpusRow.event_id,
        evidence_scope: 'not_required',
        mode: 'not_required',
        raw_time: rawTime,
        anchor_time: null,
        interval_predecessor_event_id: null,
        searched_recording_ids: [],
        selected_frame: null,
        automated_checks: emptyChecks(),
        automated_recommendation: null,
        final_disposition: null,
        review_provenance: null,
      };
    }

    if (parsedTime.kind === 'unresolvable') {
      return {
        chronology_index: corpusRow.chronology_index,
        event_id: corpusRow.event_id,
        evidence_scope: 'required',
        mode: 'timing_unresolvable',
        raw_time: rawTime,
        anchor_time: null,
        interval_predecessor_event_id: null,
        searched_recording_ids: [],
        selected_frame: null,
        automated_checks: emptyChecks(),
        automated_recommendation: 'timing_unresolvable',
        final_disposition: null,
        review_provenance: null,
      };
    }

    if (intervalPredecessor !== null) {
      return {
        chronology_index: corpusRow.chronology_index,
        event_id: corpusRow.event_id,
        evidence_scope: 'required',
        mode: 'same_time_interval',
        raw_time: rawTime,
        anchor_time: exactAnchor(corpusRow),
        interval_predecessor_event_id: intervalPredecessor,
        searched_recording_ids: [],
        selected_frame: null,
        automated_checks: emptyChecks(),
        automated_recommendation: 'same_time_interval_unrecoverable',
        final_disposition: null,
        review_provenance: null,
      };
    }

    const entry = prepared.get(corpusRow.event_id);
    if (entry === undefined) throw new Error(`Completed locked recovery is missing prepared evidence for ${corpusRow.event_id}`);
    let searchedRecordingIds;
    let selected = null;
    let automatedChecks = emptyChecks();
    if (!Array.isArray(entry.searched_recording_ids)
      || entry.searched_recording_ids.some((id) => typeof id !== 'string' || !RECORDING_ID.test(id))
      || new Set(entry.searched_recording_ids).size !== entry.searched_recording_ids.length) {
      throw new Error(`Searched recording IDs are invalid for ${corpusRow.event_id}`);
    }
    searchedRecordingIds = [...entry.searched_recording_ids];
    validateLockedSearch(corpusRow, entry, files);
    if (entry.selected_frame !== null) {
      selected = selectedFrame(entry.selected_frame);
      automatedChecks = verifySelectedEvidence(corpusRow, entry, selected, exactAnchor(corpusRow), files);
    } else {
      if (entry.selected_png_bytes !== undefined || entry.tool_provenance !== undefined || entry.automated_checks !== undefined) {
        throw new Error(`Missing recovery for ${corpusRow.event_id} must not claim extraction artifacts or automated checks`);
      }
      if (selectLockedCandidate(corpusRow, entry, files, exactAnchor(corpusRow)) !== null) {
        throw new Error(`Missing disposition is invalid because an eligible locked candidate exists for ${corpusRow.event_id}`);
      }
    }
    return {
      chronology_index: corpusRow.chronology_index,
      event_id: corpusRow.event_id,
      evidence_scope: 'required',
      mode: 'strictly_prior',
      raw_time: rawTime,
      anchor_time: exactAnchor(corpusRow),
      interval_predecessor_event_id: null,
      searched_recording_ids: searchedRecordingIds,
      selected_frame: selected,
      automated_checks: automatedChecks,
      automated_recommendation: recommendation(selected, automatedChecks),
      final_disposition: null,
      review_provenance: null,
    };
  });
}

function validateReviewProvenance(value) {
  assertExactKeys(value, REVIEW_PROVENANCE_KEYS, 'Review provenance');
  if (value.reviewer !== 'codex_visual_review') throw new Error('Review provenance reviewer must be codex_visual_review, never human or Dylan');
  if (typeof value.reviewed_at !== 'string' || Number.isNaN(Date.parse(value.reviewed_at))) throw new Error('Review provenance reviewed_at is invalid');
  if (typeof value.method !== 'string' || value.method.length === 0) throw new Error('Review provenance method is invalid');
  return { ...value };
}

function applyDecisions(rows, inventorySha256, decisions) {
  if (decisions === null || decisions === undefined) return rows;
  if (!Array.isArray(decisions)) throw new TypeError('Decisions must be an array');
  const required = rows.filter((row) => row.evidence_scope === 'required');
  if (decisions.length < required.length) throw new Error('Missing evidence review decisions');
  if (decisions.length > required.length) throw new Error('Extra evidence review decision count');
  return rows.map((row) => {
    if (row.evidence_scope !== 'required') return row;
    const decisionIndex = required.findIndex((requiredRow) => requiredRow.event_id === row.event_id);
    const decision = decisions[decisionIndex];
    assertExactKeys(decision, DECISION_KEYS, `Decision ${decisionIndex + 1}`);
    if (decision.event_id !== row.event_id) throw new Error(`Evidence decision order mismatch at ${row.event_id}`);
    if (decision.inventory_sha256 !== inventorySha256) throw new Error(`Evidence decision inventory SHA-256 mismatch at ${row.event_id}`);
    if (!FROZEN_DISPOSITIONS.has(decision.disposition)) throw new Error(`Invalid or pending final disposition at ${row.event_id}`);
    if (AUTOMATIC_DISPOSITIONS.has(row.automated_recommendation)) {
      if (decision.disposition !== row.automated_recommendation) throw new Error(`Automatic recommendation must be explicitly confirmed for ${row.event_id}`);
    } else if (row.automated_recommendation === 'pending_human') {
      if (!VISUAL_DISPOSITIONS.has(decision.disposition)) throw new Error(`Mechanically passing visual review disposition is invalid for ${row.event_id}`);
    } else {
      throw new Error(`Invalid automated recommendation for ${row.event_id}`);
    }
    return {
      ...row,
      final_disposition: decision.disposition,
      review_provenance: validateReviewProvenance(decision.review_provenance),
    };
  });
}

export function buildEvidenceInventory({
  corpusRows,
  preparedEvidence = [],
  decisions = null,
  provenance,
  videoInventory,
}) {
  validateCorpus(corpusRows);
  if (!Array.isArray(preparedEvidence)) throw new TypeError('Prepared evidence must be an array');
  const inventoryProvenance = deriveEvaluatorProvenance(preparedEvidence, videoInventory, provenance);
  const files = videoFiles(videoInventory);
  const draftRows = buildDraftRows(corpusRows, preparedEvidence, files);
  for (const row of draftRows) assertExactKeys(row, ROW_KEYS, `Evidence row ${row.event_id}`);
  const inventorySha256 = sha256({ version: 1, provenance: inventoryProvenance, rows: draftRows });
  const rows = applyDecisions(draftRows, inventorySha256, decisions);
  return {
    version: 1,
    inventory_sha256: inventorySha256,
    provenance: inventoryProvenance,
    rows,
  };
}

export function renderEvidenceReview(inventory, { contactSheetLinks = [] } = {}) {
  if (!isPlainObject(inventory) || inventory.version !== 1 || !SHA256.test(inventory.inventory_sha256) || !Array.isArray(inventory.rows)) {
    throw new Error('Invalid evidence inventory');
  }
  if (!Array.isArray(contactSheetLinks) || contactSheetLinks.some((link) => !isSafeRelativePngPath(link))) {
    throw new Error('Contact sheets must be safe relative PNG links');
  }
  const lines = [
    '# Evidence review',
    '',
    `Inventory SHA-256: \`${inventory.inventory_sha256}\``,
    '',
    'Full-resolution authoritative evidence is embedded below. Contact sheets are navigation-only and are never decision evidence.',
    '',
  ];
  if (contactSheetLinks.length > 0) {
    lines.push('## Contact-sheet navigation', '');
    contactSheetLinks.forEach((link, index) => {
      lines.push(`[Contact sheet ${index + 1} — navigation only](${link})`);
    });
    lines.push('');
  }
  for (const row of inventory.rows.filter((candidate) => candidate.evidence_scope === 'required')) {
    lines.push(`## ${row.chronology_index}. ${row.event_id}`, '');
    lines.push(`- Automated recommendation: \`${row.automated_recommendation}\``);
    lines.push(`- Final disposition: ${row.final_disposition === null ? '`unreviewed`' : `\`${row.final_disposition}\``}`);
    if (row.selected_frame === null) {
      lines.push('- Full-resolution evidence: unavailable');
    } else {
      lines.push(`- Full-resolution PNG SHA-256: \`${row.selected_frame.png_sha256}\``, '');
      lines.push(`![${row.event_id} full-resolution](${row.selected_frame.store_relative_path})`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}
