import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { extractMetadataFreePng } from '../lib/png-evidence.mjs';
import { makePngBuffer, makeTinyHevcMp4, pngChunk } from './media-fixtures.mjs';

const temporaryRoots = new Set();

test.after(async () => {
  await Promise.all([...temporaryRoots].map((root) => rm(root, { recursive: true, force: true })));
});

async function harness(png = makePngBuffer(), { sourceName = 'source.mp4' } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nap-v5-png-'));
  temporaryRoots.add(root);
  const sourcePath = path.join(root, sourceName);
  const sourceBytes = Buffer.from('fixture video');
  await writeFile(sourcePath, sourceBytes);
  const calls = [];
  const spawn = async (executable, argv, options) => {
    calls.push({ executable, argv: [...argv], options });
    if (argv.length === 1 && argv[0] === '-version') {
      return { stdout: Buffer.from('ffmpeg version 8.0 fixture\n'), stderr: Buffer.alloc(0) };
    }
    if (argv.includes('-vf')) await writeFile(argv.at(-1), png, { flag: 'wx' });
    return { stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
  };
  return { root, sourcePath, sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'), calls, spawn };
}

function extractOptions(fixture, overrides = {}) {
  return {
    sourcePath: fixture.sourcePath,
    decodeIndex: 7,
    sourceSha256: fixture.sourceSha256,
    width: 2,
    height: 1,
    runtimeRoot: fixture.root,
    spawn: fixture.spawn,
    dedup: new Map(),
    ...overrides,
  };
}

function chunkTypes(bytes) {
  const types = [];
  let offset = 8;
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    types.push(bytes.subarray(offset + 4, offset + 8).toString('ascii'));
    offset += 12 + length;
  }
  return types;
}

test('uses exact decode-index ffmpeg selection argv without a shell', async () => {
  const fixture = await harness();
  const result = await extractMetadataFreePng(extractOptions(fixture));
  const version = fixture.calls[0];
  const extraction = fixture.calls[1];
  const validation = fixture.calls[2];
  assert.deepEqual(version.argv, ['-version']);
  assert.equal(extraction.executable, 'ffmpeg');
  assert.deepEqual(extraction.argv.slice(0, -1), ['-v', 'error', '-i', fixture.sourcePath, '-vf', 'select=eq(n\\,7)', '-fps_mode', 'passthrough', '-frames:v', '1', '-map_metadata', '-1', '-map_chapters', '-1', '-c:v', 'png']);
  assert.equal(path.isAbsolute(extraction.argv.at(-1)), true);
  assert.equal(extraction.options.shell, false);
  assert.deepEqual(result.extraction_argv, extraction.argv);
  assert.deepEqual(result.validation_argv, validation.argv);
  assert.equal(path.isAbsolute(result.validation_argv[3]), true);
  assert.deepEqual(result.tool_provenance, {
    executable: 'ffmpeg',
    version: 'ffmpeg version 8.0 fixture',
    version_argv: ['-version'],
    extraction_argv: extraction.argv,
    validation_argv: validation.argv,
  });
});

test('gives ffmpeg an absent output inside an exclusive temporary directory', async () => {
  const fixture = await harness();
  fixture.spawn = async (executable, argv, options) => {
    if (argv.length === 1 && argv[0] === '-version') {
      return { stdout: Buffer.from('ffmpeg version 8.0 fixture\n'), stderr: Buffer.alloc(0) };
    }
    if (argv.includes('-vf')) {
      await assert.rejects(access(argv.at(-1)));
      await writeFile(argv.at(-1), makePngBuffer(), { flag: 'wx' });
    }
    return { stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
  };
  await extractMetadataFreePng(extractOptions(fixture));
});

test('requires IHDR dimensions to equal locked source dimensions', async () => {
  const fixture = await harness(makePngBuffer({ width: 2, height: 1 }));
  await assert.rejects(extractMetadataFreePng(extractOptions(fixture, { width: 1920, height: 1080 })), /dimension/i);

  const changed = await harness();
  const baseSpawn = changed.spawn;
  changed.spawn = async (executable, argv, options) => {
    const result = await baseSpawn(executable, argv, options);
    if (argv.includes('-vf')) await writeFile(changed.sourcePath, 'changed during extraction');
    return result;
  };
  await assert.rejects(extractMetadataFreePng(extractOptions(changed)), /source|changed|sha/i);
});

test('extracts the exact generated MP4 decode index with stable decoded pixels', { timeout: 30_000 }, async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nap-v5-png-real-'));
  temporaryRoots.add(root);
  const sourcePath = await makeTinyHevcMp4(root, '1000', { frameCount: 3, color: 'blue' });
  const result = await extractMetadataFreePng({
    sourcePath,
    decodeIndex: 1,
    sourceSha256: createHash('sha256').update(await readFile(sourcePath)).digest('hex'),
    width: 1920,
    height: 1080,
    runtimeRoot: root,
  });
  const stored = path.join(root, result.store_relative_path);
  const ffmpegText = (argv) => new Promise((resolve, reject) => {
    import('node:child_process').then(({ execFile }) => execFile('ffmpeg', argv, { encoding: 'utf8' }, (error, stdout) => error ? reject(error) : resolve(stdout)));
  });
  const [sourceDecoded, storedDecoded] = await Promise.all([
    ffmpegText(['-v', 'error', '-i', sourcePath, '-vf', 'select=eq(n\\,1)', '-frames:v', '1', '-pix_fmt', 'rgb24', '-f', 'framemd5', '-']),
    ffmpegText(['-v', 'error', '-i', stored, '-pix_fmt', 'rgb24', '-f', 'framemd5', '-']),
  ]);
  const pixelHash = (text) => /,\s+([0-9a-f]{32})\s*$/m.exec(text)?.[1];
  assert.match(storedDecoded, /#dimensions 0: 1920x1080/);
  assert.equal(pixelHash(storedDecoded), pixelHash(sourceDecoded));
});

test('produces repeatable sanitized bytes and SHA-256 across extractions', async () => {
  const fixture = await harness();
  const first = await extractMetadataFreePng(extractOptions(fixture));
  const second = await extractMetadataFreePng(extractOptions(fixture, { dedup: new Map() }));
  assert.equal(first.png_sha256, second.png_sha256);
  assert.deepEqual(await readFile(path.join(fixture.root, first.store_relative_path)), await readFile(path.join(fixture.root, second.store_relative_path)));
});

test('preserves only ordered critical chunks with valid CRCs', async () => {
  const fixture = await harness(makePngBuffer());
  const result = await extractMetadataFreePng(extractOptions(fixture));
  const stored = await readFile(path.join(fixture.root, result.store_relative_path));
  assert.deepEqual(chunkTypes(stored), ['IHDR', 'IDAT', 'IEND']);
});

test('strips pHYs, text, EXIF, time, and unknown ancillary chunks', async () => {
  const fixture = await harness(makePngBuffer({
    chunksBeforeIdat: [
      pngChunk('pHYs', Buffer.alloc(9)),
      pngChunk('tEXt', Buffer.from('author\0private')),
      pngChunk('eXIf', Buffer.from('private exif')),
      pngChunk('tIME', Buffer.alloc(7)),
      pngChunk('vpAg', Buffer.from('unknown ancillary')),
    ],
  }));
  const result = await extractMetadataFreePng(extractOptions(fixture));
  assert.deepEqual(chunkTypes(await readFile(path.join(fixture.root, result.store_relative_path))), ['IHDR', 'IDAT', 'IEND']);
});

test('rejects bytes trailing after IEND', async () => {
  const fixture = await harness(makePngBuffer({ trailing: Buffer.from('secret') }));
  await assert.rejects(extractMetadataFreePng(extractOptions(fixture)), /trailing/i);
});

test('rejects corrupt chunk CRC before sanitization', async () => {
  const fixture = await harness(makePngBuffer({ chunksBeforeIdat: [pngChunk('tEXt', Buffer.from('x\0y'), { corruptCrc: true })] }));
  await assert.rejects(extractMetadataFreePng(extractOptions(fixture)), /CRC/i);
});

test('rejects invalid critical chunk order and unknown critical chunks', async () => {
  const valid = makePngBuffer();
  const badOrder = Buffer.concat([valid.subarray(0, 8), pngChunk('IDAT', Buffer.from('x')), valid.subarray(8)]);
  const unknown = Buffer.concat([valid.subarray(0, -12), pngChunk('ABCD'), valid.subarray(-12)]);
  for (const bytes of [badOrder, unknown]) {
    const fixture = await harness(bytes);
    await assert.rejects(extractMetadataFreePng(extractOptions(fixture)), /PNG|critical|IHDR/i);
  }
});

test('stores content once at the evaluator SHA-256 path idempotently', async () => {
  const fixture = await harness();
  const expectedSha = createHash('sha256').update(makePngBuffer()).digest('hex');
  const expectedTarget = path.join(fixture.root, `evaluator/evidence-store/sha256/${expectedSha.slice(0, 2)}/${expectedSha}.png`);
  await assert.rejects(
    extractMetadataFreePng(extractOptions(fixture, {
      beforeStorePublish: async () => { throw new Error('injected publish failure'); },
    })),
    /injected publish failure/,
  );
  await assert.rejects(access(expectedTarget));

  const result = await extractMetadataFreePng(extractOptions(fixture));
  assert.equal(result.store_relative_path, `evaluator/evidence-store/sha256/${result.png_sha256.slice(0, 2)}/${result.png_sha256}.png`);
  assert.equal(createHash('sha256').update(await readFile(path.join(fixture.root, result.store_relative_path))).digest('hex'), result.png_sha256);
  const repeated = await Promise.all(Array.from({ length: 8 }, () => extractMetadataFreePng(extractOptions(fixture, { dedup: new Map() }))));
  assert.ok(repeated.every((entry) => entry.png_sha256 === result.png_sha256));
});

test('deduplicates only by source path plus decode index, never row or image hash', async () => {
  const fixture = await harness();
  const dedup = new Map();
  await extractMetadataFreePng(extractOptions(fixture, { dedup, eventId: 'ROW-A' }));
  await extractMetadataFreePng(extractOptions(fixture, { dedup, eventId: 'ROW-B' }));
  await extractMetadataFreePng(extractOptions(fixture, { dedup, decodeIndex: 8, eventId: 'ROW-C' }));
  const other = await harness(makePngBuffer(), { sourceName: 'other.mp4' });
  await extractMetadataFreePng(extractOptions(other, { runtimeRoot: fixture.root, spawn: other.spawn, dedup, eventId: 'ROW-D' }));
  assert.equal(fixture.calls.filter((call) => call.argv.includes('-vf')).length, 2);
  assert.equal(other.calls.filter((call) => call.argv.includes('-vf')).length, 1);
});
