import { createHash } from 'node:crypto';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  utimes,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { main as cliMain } from '../cli.mjs';
import { DEFAULT_INVENTORY_PATH } from '../lib/donor-guard.mjs';
import { canonicalJson } from '../lib/immutable.mjs';
import { makeTask4Sources } from './task4-fixtures.mjs';
import { syntheticPng } from './task5-fixtures.mjs';

export const APPROVAL_BASIS = 'blanket_execution_authorization_2026-07-29';
export const REVIEW_PROVENANCE = Object.freeze({
  reviewer: 'codex_visual_review',
  reviewed_at: '2026-07-30T12:00:00.000Z',
  method: 'full_resolution_png_visual_review',
});

const template = makeTask4Sources().videoInventory;
const pngCache = new Map();

function jsonSafe(value) {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, jsonSafe(child)]));
  }
  return value;
}

function videoDigest(recordingId) {
  return createHash('sha256').update(`locked-video:${recordingId}`).digest('hex');
}

export async function makeTask6IoFixture() {
  const parent = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-task6-io-')));
  const videoRoot = path.join(parent, 'videos');
  await mkdir(videoRoot, { recursive: true });
  const templateByName = new Map();
  for (const file of template.files) {
    const filename = `compact_monitor_3_${file.recording_id}.mp4`;
    templateByName.set(filename, file);
    await writeFile(path.join(videoRoot, filename), `locked-video:${file.recording_id}`, { mode: 0o600 });
  }
  const counters = { ffprobe: 0, ffmpeg: 0, model: 0 };
  const ffprobeProbePaths = [];
  const ffprobeProbeSha256 = [];
  const ffprobeSpawn = async (executable, argv) => {
    if (executable !== 'ffprobe') throw new Error(`unexpected executable ${executable}`);
    counters.ffprobe += 1;
    if (argv.length === 1 && argv[0] === '-version') {
      return { stdout: 'ffprobe version 8.0 Copyright FFmpeg\n' };
    }
    const probePath = argv.at(-1);
    ffprobeProbePaths.push(probePath);
    ffprobeProbeSha256.push(createHash('sha256').update(await readFile(probePath)).digest('hex'));
    const source = templateByName.get(path.basename(probePath));
    if (source === undefined) throw new Error(`unexpected ffprobe source ${argv.at(-1)}`);
    return {
      stdout: JSON.stringify({
        streams: [source.stream],
        frames: source.frames.map((frame) => ({
          pts: String(frame.pts),
          best_effort_timestamp: String(frame.best_effort_timestamp),
        })),
      }),
    };
  };
  const ffmpegSpawn = async (executable, argv) => {
    if (executable !== 'ffmpeg') throw new Error(`unexpected executable ${executable}`);
    counters.ffmpeg += 1;
    if (argv.length === 1 && argv[0] === '-version') {
      return { stdout: Buffer.from('ffmpeg version 8.0 Copyright FFmpeg\n') };
    }
    if (argv.includes('-c:v') && argv.includes('png')) {
      const selector = argv[argv.indexOf('-vf') + 1];
      const decodeIndex = Number(/(\d+)/.exec(selector)?.[1] ?? 0);
      let png = pngCache.get(decodeIndex);
      if (png === undefined) {
        png = syntheticPng(decodeIndex + 1);
        pngCache.set(decodeIndex, png);
      }
      await writeFile(argv.at(-1), png, { mode: 0o600 });
      return { stdout: Buffer.alloc(0) };
    }
    if (argv.includes('-f') && argv.includes('null')) return { stdout: Buffer.alloc(0) };
    throw new Error(`unexpected ffmpeg argv ${argv.join(' ')}`);
  };
  return {
    parent,
    videoRoot,
    counters,
    ffprobeProbePaths,
    ffprobeProbeSha256,
    donorInventoryBytes: await readFile(DEFAULT_INVENTORY_PATH),
    io: {
      videoRoot,
      startRecordingId: template.start_recording_id,
      endpointRecordingId: template.endpoint_recording_id,
      ffprobeSpawn,
      ffmpegSpawn,
    },
    expectedVideoSha256: new Map(template.files.map((file) => [file.recording_id, videoDigest(file.recording_id)])),
  };
}

export async function seedTask6Authority(root, fixture) {
  await mkdir(path.join(root, 'evaluator'), { recursive: true });
  await writeFile(
    path.join(root, 'evaluator/v4-donor-inventory.json'),
    fixture.donorInventoryBytes,
    { flag: 'wx', mode: 0o600 },
  );
}

export async function writeReviewDecisions(root, parent) {
  const draft = JSON.parse(await readFile(path.join(root, 'evaluator/evidence-review-inventory.json'), 'utf8'));
  const decisions = {
    version: 1,
    inventory_sha256: draft.inventory_sha256,
    review_provenance: REVIEW_PROVENANCE,
    decisions: draft.rows
      .filter((row) => row.evidence_scope === 'required')
      .map((row, index) => ({
        chronology_index: row.chronology_index,
        event_id: row.event_id,
        disposition: row.automated_recommendation === 'pending_human'
          ? 'usable'
          : row.automated_recommendation,
        ...(index === 0 ? { reviewer_note: '🧪'.repeat(2_000) } : {}),
      })),
  };
  const decisionsPath = path.join(parent, 'review-decisions.json');
  await writeFile(decisionsPath, canonicalJson(decisions), { mode: 0o600 });
  const unrelatedMtime = new Date('2031-01-02T03:04:05.000Z');
  await utimes(decisionsPath, unrelatedMtime, unrelatedMtime);
  return decisionsPath;
}

export async function runTask6Pipeline({ stopAfter = 'verify-prepared' } = {}) {
  const fixture = await makeTask6IoFixture();
  const root = path.join(fixture.parent, 'runtime');
  await seedTask6Authority(root, fixture);
  const commands = [
    ['compile-corpus'],
    ['prepare-evidence'],
  ];
  for (const argv of commands) {
    await cliMain(argv, { root, io: fixture.io });
    if (argv[0] === stopAfter) return { ...fixture, root, decisionsPath: null };
  }
  const decisionsPath = await writeReviewDecisions(root, fixture.parent);
  const remainder = [
    ['freeze-evidence', '--decisions', decisionsPath],
    ['select-targets'],
    ['approve-catalog', '--basis', APPROVAL_BASIS],
    ['prepare-packets'],
    ['verify-prepared'],
  ];
  for (const argv of remainder) {
    await cliMain(argv, { root, io: fixture.io });
    if (argv[0] === stopAfter) return { ...fixture, root, decisionsPath };
  }
  return { ...fixture, root, decisionsPath };
}

export async function cloneRuntime(fixture, label) {
  const root = path.join(fixture.parent, `runtime-${label}`);
  await cp(fixture.root, root, { recursive: true, preserveTimestamps: true });
  return root;
}
