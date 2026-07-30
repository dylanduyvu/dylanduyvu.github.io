import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { inventoryVideoChain } from '../lib/video-index.mjs';
import { makeProbeFixture, makeTinyHevcMp4, probeSpawner } from './media-fixtures.mjs';

const REAL_ROOT = '/Users/dylanvu/.screenpipe/data/data/2026-07-27';
const START = '1785164400568';
const END = '1785173529401';
const PREDECESSOR_OUTSIDE_CHAIN = '1785164093104';
const temporaryRoots = new Set();

test.after(async () => {
  await Promise.all([...temporaryRoots].map((root) => rm(root, { recursive: true, force: true })));
});

async function fixtureChain(specs) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nap-v5-video-index-'));
  temporaryRoots.add(root);
  const probes = new Map();
  for (const [id, options] of specs) {
    const fixture = await makeProbeFixture(root, id, options);
    probes.set(fixture.absolutePath, fixture.probe);
  }
  return { root, probes };
}

test('invokes ffprobe without a shell using the exact frozen argv', async () => {
  const { root, probes } = await fixtureChain([['1000', {}]]);
  const calls = [];
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '1000', spawn: probeSpawner(probes, calls) });
  const probeArgv = ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,time_base,start_time', '-show_entries', 'frame=pts,best_effort_timestamp', '-show_frames', '-of', 'json', path.join(root, 'compact_monitor_3_1000.mp4')];
  assert.deepEqual(calls[0], {
    executable: 'ffprobe',
    argv: ['-version'],
    options: { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  });
  assert.deepEqual(calls[1].argv.slice(0, -1), probeArgv.slice(0, -1));
  assert.match(
    calls[1].argv.at(-1),
    /^\/private\/tmp\/nap-v5-video-probe-[^/]+\/compact_monitor_3_1000\.mp4$/u,
  );
  assert.notEqual(calls[1].argv.at(-1), probeArgv.at(-1));
  assert.deepEqual(inventory.tool_provenance, {
    executable: 'ffprobe',
    version: 'ffprobe version 8.0 fixture',
    version_argv: ['-version'],
    probe_argv: [probeArgv],
  });
});

test('includes only the sorted regular-file chain between frozen endpoints', async () => {
  const { root, probes } = await fixtureChain([['1000', {}], ['2000', {}], ['3000', {}]]);
  await writeFile(path.join(root, 'compact_monitor_3_2500.txt'), 'ignored');
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '3000', spawn: probeSpawner(probes) });
  assert.deepEqual(inventory.files.map((entry) => entry.recording_id), ['1000', '2000', '3000']);
  assert.deepEqual(inventory.files.map((entry) => entry.predecessor_recording_id), [null, '1000', '2000']);
});

test('rejects a symlink whose name would enter the locked chain', async () => {
  const { root, probes } = await fixtureChain([['1000', {}], ['3000', {}]]);
  await symlink(path.join(root, 'compact_monitor_3_1000.mp4'), path.join(root, 'compact_monitor_3_2000.mp4'));
  await assert.rejects(inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '3000', spawn: probeSpawner(probes) }), /symlink/i);
});

test('requires both endpoints and excludes an earlier external predecessor', async () => {
  const { root, probes } = await fixtureChain([['0900', {}], ['1000', {}], ['2000', {}]]);
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '2000', spawn: probeSpawner(probes) });
  assert.deepEqual(inventory.files.map((entry) => entry.recording_id), ['1000', '2000']);
  await assert.rejects(inventoryVideoChain({ root, startRecordingId: '1001', endpointRecordingId: '2000', spawn: probeSpawner(probes) }), /endpoint/i);
});

test('freezes byte lengths and SHA-256 without using probe duration', async () => {
  const bytes = Buffer.from('known-video-bytes');
  const { root, probes } = await fixtureChain([['1000', { bytes, duration: '-12345.5' }]]);
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '1000', spawn: probeSpawner(probes) });
  assert.equal(inventory.files[0].byte_length, bytes.length);
  assert.equal(inventory.files[0].sha256, createHash('sha256').update(bytes).digest('hex'));
  assert.equal('duration' in inventory.files[0].stream, false);

  const changed = await fixtureChain([['2000', { bytes }]]);
  const baseSpawn = probeSpawner(changed.probes);
  const mutatingSpawn = async (executable, argv, options) => {
    const result = await baseSpawn(executable, argv, options);
    if (argv.includes('-show_frames')) await writeFile(path.join(changed.root, 'compact_monitor_3_2000.mp4'), 'changed after hash');
    return result;
  };
  await assert.rejects(
    inventoryVideoChain({ root: changed.root, startRecordingId: '2000', endpointRecordingId: '2000', spawn: mutatingSpawn }),
    /changed|source lock|inventory/i,
  );
});

test('assigns stable zero-based decode indexes in returned frame order', async () => {
  const { root, probes } = await fixtureChain([['1000', { pts: ['7', '9', '12'] }]]);
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '1000', spawn: probeSpawner(probes) });
  assert.deepEqual(inventory.files[0].frames.map((frame) => frame.decode_index), [0, 1, 2]);
  assert.deepEqual(inventory.files[0].frames.map((frame) => frame.pts), [7n, 9n, 12n]);
});

test('reduces BigInt local and global rational times with positive denominators', async () => {
  const { root, probes } = await fixtureChain([['1500', { timeBase: '2/8', pts: ['0', '6'] }]]);
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1500', endpointRecordingId: '1500', spawn: probeSpawner(probes) });
  assert.deepEqual(inventory.files[0].time_base, { numerator: 1n, denominator: 4n });
  assert.deepEqual(inventory.files[0].frames[1].local_seconds, { numerator: 3n, denominator: 2n });
  assert.deepEqual(inventory.files[0].frames[1].global_seconds, { numerator: 3n, denominator: 1n });
});

test('rejects nonmonotonic, null, or best-effort-mismatched PTS', async () => {
  for (const options of [
    { pts: ['0', '2', '1'] },
    { pts: ['0', null, '2'], bestEffort: ['0', null, '2'] },
    { pts: ['0', '1'], bestEffort: ['0', '2'] },
  ]) {
    const { root, probes } = await fixtureChain([['1000', options]]);
    await assert.rejects(inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '1000', spawn: probeSpawner(probes) }), /PTS/i);
  }
});

test('requires exactly one HEVC 1920x1080 stream starting at zero', async () => {
  for (const options of [
    { codec: 'h264' },
    { width: 1280 },
    { height: 720 },
    { startTime: '0.125000' },
  ]) {
    const { root, probes } = await fixtureChain([['1000', options]]);
    await assert.rejects(inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '1000', spawn: probeSpawner(probes) }), /stream/i);
  }
});

test('indexes generated HEVC MP4 fixtures with known PTS and multiple time bases', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nap-v5-real-mp4-'));
  temporaryRoots.add(root);
  await makeTinyHevcMp4(root, '1000', { timeBaseDenominator: 16, frameCount: 3 });
  await makeTinyHevcMp4(root, '2000', { timeBaseDenominator: 90_000, frameCount: 3, color: 'blue' });
  const inventory = await inventoryVideoChain({ root, startRecordingId: '1000', endpointRecordingId: '2000' });
  assert.deepEqual(inventory.files.map((entry) => entry.stream.time_base), ['1/16', '1/90000']);
  assert.deepEqual(inventory.files.map((entry) => entry.frames.map((frame) => frame.pts)), [[0n, 4n, 8n], [0n, 22500n, 45000n]]);
});

test('real locked chain has exact files, bytes, frames, time bases, and no-event recordings', { timeout: 120_000 }, async () => {
  const inventory = await inventoryVideoChain({ root: REAL_ROOT, startRecordingId: START, endpointRecordingId: END });
  assert.equal(inventory.files.length, 31);
  assert.equal(inventory.total_byte_length, 103_005_033);
  assert.equal(inventory.total_frame_count, 1092);
  assert.equal(new Set(inventory.files.map((entry) => entry.stream.time_base)).size, 13);
  assert.deepEqual(inventory.no_event_recording_ids, ['1785165009266', '1785165310520', '1785172925051']);
  assert.equal(inventory.files[0].relative_path, `compact_monitor_3_${START}.mp4`);
  assert.equal(inventory.files.at(-1).relative_path, `compact_monitor_3_${END}.mp4`);
  assert.equal(inventory.files.some((entry) => entry.recording_id === PREDECESSOR_OUTSIDE_CHAIN), false);
});

test('real locked hashes match independent read-only hashing and every PTS equals best effort', { timeout: 120_000 }, async () => {
  const inventory = await inventoryVideoChain({ root: REAL_ROOT, startRecordingId: START, endpointRecordingId: END });
  const first = inventory.files[0];
  assert.equal(first.sha256, createHash('sha256').update(await readFile(first.absolute_path)).digest('hex'));
  assert.equal(inventory.files.every((entry) => entry.frames.every((frame) => frame.pts === frame.best_effort_timestamp)), true);
});
