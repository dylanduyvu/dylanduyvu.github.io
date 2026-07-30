import { execFile } from 'node:child_process';
import { deflateSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const mediaState = (overrides = {}) => ({ monitor: 3, ...overrides });

export async function makeProbeFixture(root, recordingId, {
  bytes = `fixture-${recordingId}`,
  codec = 'hevc',
  width = 1920,
  height = 1080,
  timeBase = '1/16',
  startTime = '0.000000',
  pts = ['0', '5', '10'],
  bestEffort = pts,
  duration = '9999.0',
} = {}) {
  await mkdir(root, { recursive: true });
  const absolutePath = path.join(root, `compact_monitor_3_${recordingId}.mp4`);
  await writeFile(absolutePath, bytes);
  return {
    absolutePath,
    probe: {
      streams: [{
        codec_name: codec,
        width,
        height,
        time_base: timeBase,
        start_time: startTime,
        duration,
      }],
      frames: pts.map((value, index) => ({
        pts: value,
        best_effort_timestamp: bestEffort[index],
      })),
    },
  };
}

export function probeSpawner(probes, calls = []) {
  return async (executable, argv, options) => {
    calls.push({ executable, argv: [...argv], options });
    if (argv.length === 1 && argv[0] === '-version') {
      return { stdout: 'ffprobe version 8.0 fixture\n', stderr: '' };
    }
    const absolutePath = argv.at(-1);
    const probe = probes.get(absolutePath)
      ?? [...probes.entries()].find(([candidate]) => (
        path.basename(candidate) === path.basename(absolutePath)
      ))?.[1];
    if (probe === undefined) throw new Error(`No fixture probe for ${absolutePath}`);
    return { stdout: JSON.stringify(probe), stderr: '' };
  };
}

export async function makeTinyHevcMp4(root, recordingId, {
  timeBaseDenominator = 16,
  frameCount = 3,
  rate = 4,
  color = 'black',
} = {}) {
  await mkdir(root, { recursive: true });
  const absolutePath = path.join(root, `compact_monitor_3_${recordingId}.mp4`);
  await execFileAsync('ffmpeg', [
    '-v', 'error',
    '-f', 'lavfi',
    '-i', `color=c=${color}:s=1920x1080:r=${rate}`,
    '-frames:v', String(frameCount),
    '-c:v', 'libx265',
    '-preset', 'ultrafast',
    '-x265-params', 'log-level=error',
    '-video_track_timescale', String(timeBaseDenominator),
    '-pix_fmt', 'yuv420p',
    absolutePath,
  ]);
  return absolutePath;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function pngChunk(type, data = Buffer.alloc(0), { corruptCrc = false } = {}) {
  const name = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE((crc32(Buffer.concat([name, data])) + (corruptCrc ? 1 : 0)) >>> 0);
  return Buffer.concat([length, name, data, crc]);
}

export function makePngBuffer({
  width = 2,
  height = 1,
  rgba = Buffer.from([255, 0, 0, 255, 0, 0, 255, 255]),
  chunksBeforeIdat = [],
  chunksAfterIdat = [],
  trailing = Buffer.alloc(0),
} = {}) {
  if (rgba.length !== width * height * 4) throw new Error('RGBA fixture has wrong length');
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const scanlines = [];
  for (let row = 0; row < height; row += 1) {
    scanlines.push(Buffer.from([0]), rgba.subarray(row * width * 4, (row + 1) * width * 4));
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    ...chunksBeforeIdat,
    pngChunk('IDAT', deflateSync(Buffer.concat(scanlines))),
    ...chunksAfterIdat,
    pngChunk('IEND'),
    trailing,
  ]);
}
