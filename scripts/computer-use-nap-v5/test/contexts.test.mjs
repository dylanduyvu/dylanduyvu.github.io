import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  link, mkdir, mkdtemp, lstat, readFile, readdir, realpath, symlink, writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { CONDITIONS, METHOD } from '../config.mjs';
import { publishAtomicBundle } from '../lib/bundle-publisher.mjs';
import * as contexts from '../lib/contexts.mjs';
import { contextOptions, makeTask5Fixture, sha256Bytes } from './task5-fixtures.mjs';

const tempFixture = async () => {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-contexts-')));
  return { root, fixture: await makeTask5Fixture(root) };
};
const [STATE_CONDITION] = CONDITIONS;

test('exports exactly the sanitized context builder and bundle writer', () => {
  assert.deepEqual(Object.keys(contexts).sort(), ['buildSanitizedContext', 'writeContextBundle']);
});

test('returns an exact-key deeply frozen sanitized context', async () => {
  const { fixture } = await tempFixture();
  const output = contexts.buildSanitizedContext(contextOptions(fixture));
  assert.deepEqual(Object.keys(output), ['version', 'current', 'history', 'visual_history']);
  assert.deepEqual(Object.keys(output.current), ['image_sha256']);
  assert.deepEqual(Object.keys(output.history[0]), [
    'history_ordinal', 'action_type', 'input_method', 'granularity', 'app', 'object', 'subtarget',
  ]);
  assert.deepEqual(Object.keys(output.visual_history[0]), ['image_ordinal', 'history_ordinal', 'image_sha256']);
  assert.ok(Object.isFrozen(output));
  assert.ok(Object.isFrozen(output.current));
  assert.ok(Object.isFrozen(output.history[0]));
  assert.ok(Object.isFrozen(output.visual_history[0]));
  assert.throws(() => output.history.pop(), TypeError);
});

test('state-only exposes only the authenticated selected current image', async () => {
  const { fixture } = await tempFixture();
  const output = contexts.buildSanitizedContext(contextOptions(fixture, {
    condition: STATE_CONDITION,
    targetOrdinal: 4,
  }));
  const eventId = fixture.targetSelection.selected_event_ids[3];
  const evidence = fixture.evidenceInventory.rows.find((row) => row.event_id === eventId);
  assert.deepEqual(output, {
    version: 1,
    current: { image_sha256: evidence.selected_frame.png_sha256 },
    history: [],
    visual_history: [],
  });
});

test('requires one selected target with authenticated usable current evidence', async () => {
  const { fixture } = await tempFixture();
  assert.throws(
    () => contexts.buildSanitizedContext(contextOptions(fixture, { targetOrdinal: 0 })),
    /selected|ordinal|1.*11/i,
  );
  const drift = structuredClone(fixture.evaluatorManifest);
  drift.targets[METHOD.targetCount - 1].current_evidence_sha256 = '0'.repeat(64);
  assert.throws(
    () => contexts.buildSanitizedContext(contextOptions(fixture, { evaluatorManifest: drift })),
    /manifest|evidence|hash|authentic/i,
  );
});

test('history contains every strictly earlier accepted History=yes row in canonical ledger order', async () => {
  const { fixture } = await tempFixture();
  const output = contexts.buildSanitizedContext(contextOptions(fixture));
  const eventId = fixture.targetSelection.selected_event_ids[METHOD.targetCount - 1];
  const current = fixture.corpusSnapshot.rows.find((row) => row.event_id === eventId);
  const expected = fixture.corpusSnapshot.history.filter((row) => {
    const source = fixture.corpusSnapshot.rows.find((candidate) => (
      candidate.canonical_status === 'accepted'
      && candidate.history_value === 'yes'
      && candidate.action_type === row.action_type
      && candidate.input_method === row.input_method
      && candidate.chronology_index < current.chronology_index
      && candidate.target.app === row.app
      && candidate.target.object === row.object
      && candidate.target.subtarget === row.subtarget
    ));
    return source !== undefined && row.history_ordinal < fixture.corpusSnapshot.rows
      .filter((candidate) => candidate.canonical_status === 'accepted' && candidate.history_value === 'yes')
      .findIndex((candidate) => candidate.event_id === eventId) + 1;
  });
  assert.deepEqual(output.history, expected);
  assert.ok(output.history.every((row) => row.history_ordinal >= 1 && row.history_ordinal <= 196));
});

test('equal-time earlier rows retain physical ledger order and current/future rows stay excluded', async () => {
  const { fixture } = await tempFixture();
  const output = contexts.buildSanitizedContext(contextOptions(fixture));
  const eventId = fixture.targetSelection.selected_event_ids[METHOD.targetCount - 1];
  const current = fixture.corpusSnapshot.rows.find((row) => row.event_id === eventId);
  const accepted = fixture.corpusSnapshot.rows.filter((row) => row.canonical_status === 'accepted' && row.history_value === 'yes');
  const earlier = accepted.filter((row) => row.chronology_index < current.chronology_index);
  assert.deepEqual(output.history.map((row) => row.history_ordinal), earlier.map((row) => accepted.indexOf(row) + 1));
  const equalTimePair = earlier.find((row, index) => (
    index > 0
    && row.recording_id === earlier[index - 1].recording_id
    && row.parsed_time.kind === 'exact'
    && earlier[index - 1].parsed_time.kind === 'exact'
    && row.parsed_time.seconds === earlier[index - 1].parsed_time.seconds
  ));
  assert.ok(equalTimePair, 'fixture must contain an earlier equal-time pair');
  assert.ok(output.history.every((row) => row.history_ordinal <= earlier.length));
});

test('visual history is the ten highest earlier usable chronology rows, renumbered oldest-to-newest', async () => {
  const { fixture } = await tempFixture();
  const output = contexts.buildSanitizedContext(contextOptions(fixture));
  const eventId = fixture.targetSelection.selected_event_ids[METHOD.targetCount - 1];
  const current = fixture.corpusSnapshot.rows.find((row) => row.event_id === eventId);
  const accepted = fixture.corpusSnapshot.rows.filter((row) => row.canonical_status === 'accepted' && row.history_value === 'yes');
  const expectedEvidence = fixture.evidenceInventory.rows
    .filter((row) => row.chronology_index < current.chronology_index && row.final_disposition === 'usable')
    .slice(-10);
  assert.equal(output.visual_history.length, 10);
  assert.deepEqual(output.visual_history, expectedEvidence.map((row, index) => ({
    image_ordinal: index + 1,
    history_ordinal: accepted.findIndex((candidate) => candidate.event_id === row.event_id) + 1,
    image_sha256: row.selected_frame.png_sha256,
  })));
});

test('sanitized bytes contain no evaluator IDs, paths, aliases, roles, dispositions, provenance, predictions, or outcomes', async () => {
  const { fixture } = await tempFixture();
  const output = contexts.buildSanitizedContext(contextOptions(fixture));
  const encoded = JSON.stringify(output);
  for (const forbidden of [
    'event_id', 'recording_id', 'target_id', 'slot_id', 'chronology_index',
    'accepted_variants', 'ground_truth', 'role', 'disposition', 'provenance',
    'store_relative_path', 'prediction', 'outcome',
  ]) {
    assert.equal(encoded.includes(forbidden), false, forbidden);
  }
});

test('rejects caller-supplied target labels, IDs, chronology, hashes, or unknown input keys', async () => {
  const { fixture } = await tempFixture();
  for (const forbidden of [
    { targetEventId: 'CANARY-EVENT' },
    { currentImageSha256: '0'.repeat(64) },
    { chronologyIndex: 5 },
    { groundTruth: { app: 'CANARY' } },
  ]) {
    assert.throws(
      () => contexts.buildSanitizedContext(contextOptions(fixture, forbidden)),
      /exact|unknown|forbidden|option/i,
    );
  }
});

test('writes exact regular byte-bound bundles exclusively, idempotently, and refuses symlink targets', async () => {
  const { root, fixture } = await tempFixture();
  const crashTarget = path.join(root, 'contexts', 'crash-before-publish');
  const publisherUrl = new URL('../lib/bundle-publisher.mjs', import.meta.url).href;
  const crashFiles = [
    { name: 'context.json', contents: 'complete-context\n' },
    { name: 'current.png', contents: 'complete-image' },
  ];
  const child = spawnSync(process.execPath, [
    '--input-type=module',
    '--eval',
    `import { publishAtomicBundle } from ${JSON.stringify(publisherUrl)}; await publishAtomicBundle({ targetDirectory: ${JSON.stringify(crashTarget)}, files: ${JSON.stringify(crashFiles)}, label: 'Injected crash bundle', beforePublish() { process.exit(86); } });`,
  ], { encoding: 'utf8' });
  assert.equal(child.status, 86, child.stderr);
  await assert.rejects(lstat(crashTarget), { code: 'ENOENT' });
  await publishAtomicBundle({
    targetDirectory: crashTarget,
    files: crashFiles,
    label: 'Injected crash bundle',
  });
  assert.deepEqual((await readdir(crashTarget)).sort(), ['context.json', 'current.png']);
  assert.equal(
    (await readdir(path.dirname(crashTarget))).some((name) => name.includes('.nap-v5-bundle-')),
    false,
  );

  const outputDirectory = path.join(root, 'contexts', '015-history');
  const options = contextOptions(fixture, { outputDirectory, evidenceRoot: fixture.evidenceRoot });
  const expected = contexts.buildSanitizedContext(contextOptions(fixture));
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    path.join(outputDirectory, 'context.json'),
    `${JSON.stringify(expected, null, 2)}\n`,
    { mode: 0o600 },
  );
  const first = await contexts.writeContextBundle(options);
  const second = await contexts.writeContextBundle(options);
  assert.deepEqual(second, first);
  assert.deepEqual((await readdir(outputDirectory)).sort(), [
    'context.json', 'current.png',
    ...Array.from({ length: 10 }, (_, index) => `visual-${String(index + 1).padStart(3, '0')}.png`),
  ].sort());
  const parsed = JSON.parse(await readFile(path.join(outputDirectory, 'context.json'), 'utf8'));
  assert.deepEqual(parsed, first);
  assert.equal(sha256Bytes(await readFile(path.join(outputDirectory, 'current.png'))), first.current.image_sha256);
  for (let index = 0; index < 10; index += 1) {
    const imagePath = path.join(outputDirectory, `visual-${String(index + 1).padStart(3, '0')}.png`);
    assert.equal((await lstat(imagePath)).isFile(), true);
    assert.equal((await lstat(imagePath)).isSymbolicLink(), false);
    assert.equal((await lstat(imagePath)).nlink, 1);
    assert.equal(sha256Bytes(await readFile(imagePath)), first.visual_history[index].image_sha256);
  }
  const contextStat = await lstat(path.join(outputDirectory, 'context.json'));
  const currentPath = path.join(outputDirectory, 'current.png');
  assert.equal(contextStat.nlink, 1);
  assert.equal((await lstat(currentPath)).nlink, 1);
  await link(currentPath, path.join(root, 'hardlinked-current.png'));
  await assert.rejects(
    contexts.writeContextBundle(options),
    /hardlink|link count|nlink/i,
  );
  const blocked = path.join(root, 'contexts', 'blocked');
  await symlink(root, blocked);
  await assert.rejects(
    contexts.writeContextBundle(contextOptions(fixture, {
      outputDirectory: blocked,
      evidenceRoot: fixture.evidenceRoot,
    })),
    /symlink|regular|directory/i,
  );
  assert.throws(
    () => contexts.buildSanitizedContext(contextOptions(fixture, { condition: 'history' })),
    /condition|frozen|state_only|state_plus/i,
  );
});
