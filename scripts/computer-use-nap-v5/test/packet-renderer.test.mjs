import assert from 'node:assert/strict';
import {
  link, mkdir, mkdtemp, lstat, readFile, readdir, realpath, rename, symlink,
  unlink, writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { CONDITIONS } from '../config.mjs';
import { writeContextBundle } from '../lib/contexts.mjs';
import * as renderer from '../lib/packet-renderer.mjs';
import { contextOptions, makeTask5Fixture, sha256Bytes } from './task5-fixtures.mjs';

const STATE_PROMPT = 'CURRENT BEFORE-STATE\nimage-001.png\n\nPredict the immediate next eligible action.\n';
const [STATE_CONDITION, HISTORY_CONDITION] = CONDITIONS;

async function preparedPair() {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-packets-')));
  const fixture = await makeTask5Fixture(root);
  const stateDirectory = path.join(root, 'contexts', STATE_CONDITION);
  const historyDirectory = path.join(root, 'contexts', HISTORY_CONDITION);
  const stateContext = await writeContextBundle(contextOptions(fixture, {
    condition: STATE_CONDITION,
    outputDirectory: stateDirectory,
    evidenceRoot: fixture.evidenceRoot,
  }));
  const historyContext = await writeContextBundle(contextOptions(fixture, {
    condition: HISTORY_CONDITION,
    outputDirectory: historyDirectory,
    evidenceRoot: fixture.evidenceRoot,
  }));
  return { root, fixture, stateDirectory, historyDirectory, stateContext, historyContext };
}

test('exports exactly the prompt and frozen packet renderers', () => {
  assert.deepEqual(Object.keys(renderer).sort(), ['renderFrozenPacket', 'renderPredictorPrompt']);
});

test('renders the frozen state-only prompt with UTF-8 LF and exactly one trailing newline', async () => {
  const { stateContext } = await preparedPair();
  const prompt = renderer.renderPredictorPrompt(STATE_CONDITION, stateContext);
  assert.equal(prompt, STATE_PROMPT);
  assert.equal(prompt.includes('\r'), false);
  assert.equal(prompt.endsWith('\n\n'), false);
  assert.deepEqual(Buffer.from(prompt, 'utf8'), Buffer.from(STATE_PROMPT));
});

test('renders each history action once in exact compact JSON key order', async () => {
  const { historyContext } = await preparedPair();
  const prompt = renderer.renderPredictorPrompt(HISTORY_CONDITION, historyContext);
  const lines = prompt.split('\n');
  assert.equal(lines[0], 'EARLIER COMPLETED ACTIONS (oldest to newest)');
  const actionLines = lines.slice(1, historyContext.history.length + 1);
  assert.deepEqual(actionLines, historyContext.history.map((entry) => JSON.stringify({
    history_ordinal: entry.history_ordinal,
    action_type: entry.action_type,
    input_method: entry.input_method,
    granularity: entry.granularity,
    app: entry.app,
    object: entry.object,
    subtarget: entry.subtarget,
  })));
  for (const line of actionLines) assert.equal(prompt.split(line).length - 1, 1);
});

test('renders exactly ten unique ordinal-only visual mappings and current image-011 last', async () => {
  const { historyContext } = await preparedPair();
  const prompt = renderer.renderPredictorPrompt(HISTORY_CONDITION, historyContext);
  const expectedMappings = historyContext.visual_history.map((entry, index) => (
    `image-${String(index + 1).padStart(3, '0')}.png -> history_ordinal=${entry.history_ordinal}`
  ));
  const mappingLines = prompt.split('\n').filter((line) => line.includes(' -> '));
  assert.deepEqual(mappingLines, expectedMappings);
  assert.equal(new Set(mappingLines).size, 10);
  assert.equal(mappingLines.some((line) => /action_type|app|object|subtarget/.test(line)), false);
  assert.ok(prompt.endsWith('CURRENT BEFORE-STATE\nimage-011.png\n\nPredict the immediate next eligible action.\n'));
  const duplicateOrdinal = structuredClone(historyContext);
  duplicateOrdinal.visual_history[1].image_ordinal = 1;
  assert.throws(
    () => renderer.renderPredictorPrompt(HISTORY_CONDITION, duplicateOrdinal),
    /visual|ordinal|increasing|unique/i,
  );
});

test('rejects malformed, evaluator-expanded, or condition-inconsistent context objects', async () => {
  const { stateContext, historyContext } = await preparedPair();
  assert.throws(
    () => renderer.renderPredictorPrompt(STATE_CONDITION, { ...stateContext, event_id: 'CANARY' }),
    /exact|context|key/i,
  );
  assert.throws(
    () => renderer.renderPredictorPrompt(HISTORY_CONDITION, stateContext),
    /history|ten|condition/i,
  );
  assert.throws(
    () => renderer.renderPredictorPrompt(STATE_CONDITION, historyContext),
    /state|empty|condition/i,
  );
  const mutations = [
    (value) => { value.history[0].action_type = 'delete'; },
    (value) => { value.history[0].input_method = 'unknown'; },
    (value) => { value.history[0].granularity = 'application'; },
    (value) => { value.history[0].history_ordinal = 197; },
    (value) => { value.history[0].app = ' padded '; },
    (value) => { value.history[0].app = 'x'.repeat(257); },
    (value) => { value.history[0].object = {}; },
    (value) => { value.history[0].subtarget = []; },
  ];
  for (const mutate of mutations) {
    const invalid = structuredClone(historyContext);
    mutate(invalid);
    assert.throws(
      () => renderer.renderPredictorPrompt(HISTORY_CONDITION, invalid),
      /history|action|input|granularity|ordinal|component|target|plain|string|bounded|trim/i,
    );
  }
});

test('renders an exact-key state packet bound to raw context and copied current bytes', async () => {
  const pair = await preparedPair();
  const outputDirectory = path.join(pair.root, 'packets', 'state');
  const packet = await renderer.renderFrozenPacket({
    condition: STATE_CONDITION,
    contextDirectory: pair.stateDirectory,
    outputDirectory,
  });
  const contextBytes = await readFile(path.join(pair.stateDirectory, 'context.json'));
  assert.deepEqual(Object.keys(packet), ['version', 'condition', 'prompt_text', 'context_sha256', 'images']);
  assert.deepEqual(Object.keys(packet.images[0]), ['attachment_ordinal', 'sha256']);
  assert.equal(packet.condition, STATE_CONDITION);
  assert.equal(packet.prompt_text, STATE_PROMPT);
  assert.equal(packet.context_sha256, sha256Bytes(contextBytes));
  assert.deepEqual(packet.images, [{ attachment_ordinal: 1, sha256: pair.stateContext.current.image_sha256 }]);
  assert.deepEqual((await readdir(outputDirectory)).sort(), ['image-001.png', 'packet.json', 'prompt.txt']);
  assert.equal(sha256Bytes(await readFile(path.join(outputDirectory, 'image-001.png'))), packet.images[0].sha256);
});

test('renders history attachments in visual ordinal order with the identical current image last', async () => {
  const pair = await preparedPair();
  const outputDirectory = path.join(pair.root, 'packets', HISTORY_CONDITION);
  const packet = await renderer.renderFrozenPacket({
    condition: HISTORY_CONDITION,
    contextDirectory: pair.historyDirectory,
    outputDirectory,
  });
  assert.equal(packet.images.length, 11);
  assert.deepEqual(packet.images.map((entry) => entry.attachment_ordinal), Array.from({ length: 11 }, (_, index) => index + 1));
  assert.deepEqual(packet.images.map((entry) => entry.sha256), [
    ...pair.historyContext.visual_history.map((entry) => entry.image_sha256),
    pair.historyContext.current.image_sha256,
  ]);
  assert.equal(
    (await readFile(path.join(outputDirectory, 'image-011.png'))).equals(
      await readFile(path.join(pair.stateDirectory, 'current.png')),
    ),
    true,
  );
});

test('packet image artifacts are regular non-symlink byte copies rather than links', async () => {
  const pair = await preparedPair();
  const outputDirectory = path.join(pair.root, 'packets', HISTORY_CONDITION);
  await renderer.renderFrozenPacket({
    condition: HISTORY_CONDITION,
    contextDirectory: pair.historyDirectory,
    outputDirectory,
  });
  const sourceStat = await lstat(path.join(pair.historyDirectory, 'visual-001.png'));
  const packetStat = await lstat(path.join(outputDirectory, 'image-001.png'));
  assert.equal(packetStat.isFile(), true);
  assert.equal(packetStat.isSymbolicLink(), false);
  assert.equal(packetStat.nlink, 1);
  assert.notEqual(packetStat.ino, sourceStat.ino);
  for (const name of await readdir(outputDirectory)) {
    assert.equal((await lstat(path.join(outputDirectory, name))).nlink, 1);
  }
});

test('packet writes are exclusive and byte-idempotent while refusing extra output entries', async () => {
  const pair = await preparedPair();
  const outputDirectory = path.join(pair.root, 'packets', 'state');
  const options = { condition: STATE_CONDITION, contextDirectory: pair.stateDirectory, outputDirectory };
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'prompt.txt'), STATE_PROMPT, { mode: 0o600 });
  const first = await renderer.renderFrozenPacket(options);
  const firstBytes = await readFile(path.join(outputDirectory, 'packet.json'));
  assert.deepEqual(await renderer.renderFrozenPacket(options), first);
  assert.equal((await readFile(path.join(outputDirectory, 'packet.json'))).equals(firstBytes), true);
  const external = path.join(pair.root, 'hardlinked-packet.json');
  await link(path.join(outputDirectory, 'packet.json'), external);
  await assert.rejects(renderer.renderFrozenPacket(options), /hardlink|link count|nlink/i);
  await unlink(external);
  await writeFile(path.join(outputDirectory, 'evaluator.json'), 'CANARY');
  await assert.rejects(renderer.renderFrozenPacket(options), /extra|unexpected|exact|entry/i);
});

test('reads only one exact predictor-safe context bundle and refuses source symlinks or evaluator options', async () => {
  const pair = await preparedPair();
  await writeFile(path.join(pair.stateDirectory, 'evaluator-manifest.json'), 'CANARY');
  await assert.rejects(renderer.renderFrozenPacket({
    condition: STATE_CONDITION,
    contextDirectory: pair.stateDirectory,
    outputDirectory: path.join(pair.root, 'packets', 'extra-source'),
  }), /extra|unexpected|context.*bundle/i);
  const source = path.join(pair.historyDirectory, 'visual-001.png');
  const moved = path.join(pair.root, 'visual-source.png');
  await rename(source, moved);
  await symlink(moved, source);
  await assert.rejects(renderer.renderFrozenPacket({
    condition: HISTORY_CONDITION,
    contextDirectory: pair.historyDirectory,
    outputDirectory: path.join(pair.root, 'packets', 'symlink'),
  }), /symlink|regular/i);
  await assert.rejects(renderer.renderFrozenPacket({
    condition: HISTORY_CONDITION,
    contextDirectory: pair.historyDirectory,
    outputDirectory: path.join(pair.root, 'packets', 'unknown-option'),
    evaluatorManifest: 'CANARY',
  }), /exact|option|key/i);
  await assert.rejects(renderer.renderFrozenPacket({
    condition: 'state-only',
    contextDirectory: pair.stateDirectory,
    outputDirectory: path.join(pair.root, 'packets', 'shorthand'),
  }), /condition|frozen|state_only|state_plus/i);
});
