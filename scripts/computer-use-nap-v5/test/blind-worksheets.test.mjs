import assert from 'node:assert/strict';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  symlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import * as worksheets from '../lib/blind-worksheets.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { makeTask9Fixture, TASK9_KEY } from './task9-fixtures.mjs';

const readJson = async (root, relativePath) => (
  JSON.parse(await readFile(path.join(root, ...relativePath.split('/')), 'utf8'))
);

const semanticWorksheetPath = 'blind/semantic/worksheet.json';
const usefulnessWorksheetPath = 'blind/usefulness/worksheet.json';
const joinPath = 'evaluator/sealed-join/join-map.json';

test('exports only worksheet preparation and sealed-join validation', () => {
  assert.deepEqual(Object.keys(worksheets).sort(), [
    'prepareBlindAdjudication',
    'validateSealedJoin',
  ]);
});

test('verifies locks, prepared bytes, completion, and all-terminal state before any write', async () => {
  for (const [label, mutate] of [
    ['lock', async (fixture) => {
      fixture.dependencies.verifyFrozenRun = async () => false;
    }],
    ['prepared', async (fixture) => {
      fixture.dependencies.verifyPrepared = async () => false;
    }],
    ['completion', async (fixture) => {
      const completion = structuredClone(fixture.completion);
      completion.terminal_slot_count = METHOD.scheduledSlotCount - 1;
      await writeFile(fixture.completionPath, canonicalJson(completion));
    }],
    ['nonterminal', async (fixture) => {
      const terminalPath = path.join(
        fixture.root,
        'sealed-attempts/slot-state/NAP-V5-SLOT-22/terminal.json',
      );
      const terminal = JSON.parse(await readFile(terminalPath, 'utf8'));
      terminal.terminal_state = 'pending';
      const bytes = Buffer.from(canonicalJson(terminal));
      await writeFile(terminalPath, bytes);
      const completion = structuredClone(fixture.completion);
      completion.terminal_records[METHOD.scheduledSlotCount - 1]
        .terminal_record_sha256 = sha256(bytes);
      await writeFile(fixture.completionPath, canonicalJson(completion));
    }],
  ]) {
    const fixture = await makeTask9Fixture();
    await mutate(fixture);
    await assert.rejects(
      worksheets.prepareBlindAdjudication(
        { root: fixture.root },
        fixture.dependencies,
      ),
      /lock|prepared|completion|terminal|verify|pending/i,
      label,
    );
    await assert.rejects(lstat(path.join(fixture.root, 'blind')), { code: 'ENOENT' });
    await assert.rejects(lstat(path.join(fixture.root, ...joinPath.split('/'))), { code: 'ENOENT' });
  }
});

test('bridges real Task8 completion and attempt verification and rejects mismatched verified predictions', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  assert.deepEqual(fixture.calls.attempts, fixture.terminalSlots.map(
    (terminal) => terminal.attempt_path,
  ));
  assert.equal(fixture.calls.frozen, 1);
  assert.equal(fixture.calls.prepared, 1);
  assert.equal(fixture.calls.inputs, 1);

  for (const replacement of [
    undefined,
    {
      classification: {
        ...fixture.verifiedAttempts.values().next().value.classification,
        classification: 'terminal_invalid',
      },
      hashes: fixture.verifiedAttempts.values().next().value.hashes,
    },
  ]) {
    const invalid = await makeTask9Fixture();
    invalid.dependencies.verifyAttemptRecord = async () => replacement;
    await assert.rejects(
      worksheets.prepareBlindAdjudication({ root: invalid.root }, invalid.dependencies),
      /attempt|prediction|slot|verified/i,
    );
    await assert.rejects(lstat(path.join(invalid.root, 'blind')), { code: 'ENOENT' });
  }

  const integrated = await makeTask9Fixture({ realValidAttempts: true });
  await worksheets.prepareBlindAdjudication(
    { root: integrated.root },
    integrated.dependencies,
  );
  assert.equal(integrated.calls.attempts.length, METHOD.scheduledSlotCount);
});

test('renders the exact semantic worksheet while excluding automatic exact candidates', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const sheet = await readJson(fixture.root, semanticWorksheetPath);
  assert.deepEqual(Object.keys(sheet).sort(), [
    'candidates',
    'instructions',
    'kind',
    'version',
  ]);
  assert.equal(sheet.version, 1);
  assert.equal(sheet.kind, 'semantic');
  assert.equal(sheet.instructions,
    'Using only the screenshot, compare observed_target with predicted_target. Set decision to same_destination, different_destination, or uncertain. Ignore action type.');
  assert.equal(sheet.candidates.length, 2);
  for (const candidate of sheet.candidates) {
    assert.deepEqual(Object.keys(candidate).sort(), [
      'candidate_id',
      'current_image',
      'decision',
      'observed_target',
      'predicted_target',
    ]);
    assert.match(candidate.candidate_id, /^[0-9a-f]{32}$/);
    assert.equal(candidate.current_image, `images/${candidate.candidate_id}.png`);
    assert.deepEqual(candidate.observed_target, {
      app: 'Arc',
      object: 'Coda',
      subtarget: null,
    });
    assert.equal(candidate.decision, null);
  }
});

test('renders the exact usefulness worksheet for every schema-valid prediction', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const sheet = await readJson(fixture.root, usefulnessWorksheetPath);
  assert.deepEqual(Object.keys(sheet).sort(), [
    'candidates',
    'instructions',
    'kind',
    'version',
  ]);
  assert.equal(sheet.kind, 'usefulness');
  assert.equal(sheet.instructions,
    'Using only the screenshot, decide whether you would choose predicted_action as an offered shortcut regardless of what happened next. Set decision to useful, not_useful, or uncertain.');
  assert.equal(sheet.candidates.length, 3);
  for (const candidate of sheet.candidates) {
    assert.deepEqual(Object.keys(candidate).sort(), [
      'candidate_id',
      'current_image',
      'decision',
      'predicted_action',
    ]);
    assert.equal(candidate.decision, null);
    assert.equal(Object.hasOwn(candidate, 'observed_target'), false);
  }
});

test('writes only the exact blind worksheet and display-ID image paths as byte copies', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  assert.deepEqual((await readdir(path.join(fixture.root, 'blind'))).sort(), [
    'semantic',
    'usefulness',
  ]);
  for (const kind of ['semantic', 'usefulness']) {
    assert.deepEqual((await readdir(path.join(fixture.root, 'blind', kind))).sort(), [
      'images',
      'worksheet.json',
    ]);
    const sheet = await readJson(fixture.root, `blind/${kind}/worksheet.json`);
    const imageNames = (await readdir(path.join(fixture.root, 'blind', kind, 'images'))).sort();
    assert.deepEqual(
      imageNames,
      sheet.candidates.map((candidate) => `${candidate.candidate_id}.png`).sort(),
    );
    for (const imageName of imageNames) {
      const bytes = await readFile(path.join(fixture.root, 'blind', kind, 'images', imageName));
      assert.deepEqual(bytes, fixture.currentImageBytes);
      const stat = await lstat(path.join(fixture.root, 'blind', kind, 'images', imageName));
      assert.equal(stat.isFile(), true);
      assert.equal(stat.isSymbolicLink(), false);
      assert.equal(stat.nlink, 1);
      assert.equal(stat.mode & 0o777, 0o600);
    }
  }
});

test('persists the exact evaluator-only sealed join with key hash, IDs, order, identities, flags, and refs', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const join = await readJson(fixture.root, joinPath);
  assert.deepEqual(Object.keys(join).sort(), [
    'binding_hmac_sha256',
    'completion_marker_sha256',
    'key_sha256',
    'semantic',
    'usefulness',
    'version',
  ]);
  assert.equal(join.version, 1);
  assert.equal(join.key_sha256, sha256(TASK9_KEY));
  assert.equal(join.completion_marker_sha256, fixture.completionMarkerSha256);
  assert.match(join.binding_hmac_sha256, /^[0-9a-f]{64}$/);
  for (const [kind, candidates] of [['semantic', join.semantic], ['usefulness', join.usefulness]]) {
    for (const candidate of candidates) {
      assert.deepEqual(Object.keys(candidate).sort(), [
        'auto_exact',
        'display_id',
        'full_id',
        'normalized_identity',
        ...(kind === 'semantic' ? ['observed_target'] : []),
        'order_key',
        'refs',
      ].sort());
      assert.match(candidate.full_id, /^[0-9a-f]{64}$/);
      assert.equal(candidate.display_id, candidate.full_id.slice(0, 32));
      assert.match(candidate.order_key, /^[0-9a-f]{64}$/);
      assert.ok(candidate.refs.length > 0, kind);
      if (kind === 'semantic') {
        assert.deepEqual(candidate.observed_target, {
          app: 'Arc',
          object: 'Coda',
          subtarget: null,
        });
      } else {
        assert.equal(Object.hasOwn(candidate, 'observed_target'), false);
      }
    }
  }
});

test('keeps full IDs, joins, conditions, ranks, target IDs, reasons, and key hashes out of blind trees', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const join = await readJson(fixture.root, joinPath);
  const blindBytes = Buffer.concat([
    await readFile(path.join(fixture.root, ...semanticWorksheetPath.split('/'))),
    await readFile(path.join(fixture.root, ...usefulnessWorksheetPath.split('/'))),
  ]).toString('utf8');
  for (const hidden of [
    ...join.semantic.map((candidate) => candidate.full_id),
    ...join.usefulness.map((candidate) => candidate.full_id),
    join.key_sha256,
    'NAP-V5-SLOT',
    'NAP-V5-TARGET',
    'state_only',
    'state_plus_hybrid_history',
    'sealed reason',
    '"rank"',
    '"refs"',
    '"auto_exact"',
  ]) {
    assert.equal(blindBytes.includes(hidden), false, hidden);
  }
  await assert.rejects(lstat(path.join(fixture.root, 'blind', 'join-map.json')), { code: 'ENOENT' });
});

test('deduplicates worksheet rows and images while preserving all uses only in the sealed join', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const semantic = await readJson(fixture.root, semanticWorksheetPath);
  const usefulness = await readJson(fixture.root, usefulnessWorksheetPath);
  const join = await readJson(fixture.root, joinPath);
  assert.equal(semantic.candidates.length, 2);
  assert.equal(usefulness.candidates.length, 3);
  assert.ok(join.semantic.every((candidate) => candidate.refs.length === 2));
  assert.ok(join.usefulness.every((candidate) => candidate.refs.length === 2));
});

test('is byte-idempotent and does not create completed evaluator worksheets before freeze', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const paths = [
    semanticWorksheetPath,
    usefulnessWorksheetPath,
    joinPath,
  ];
  const before = await Promise.all(paths.map((relative) => (
    readFile(path.join(fixture.root, ...relative.split('/')))
  )));
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const after = await Promise.all(paths.map((relative) => (
    readFile(path.join(fixture.root, ...relative.split('/')))
  )));
  assert.deepEqual(after, before);
  for (const relative of [
    'evaluator/sealed-join/completed-semantic-worksheet.json',
    'evaluator/sealed-join/completed-usefulness-worksheet.json',
  ]) {
    await assert.rejects(lstat(path.join(fixture.root, ...relative.split('/'))), { code: 'ENOENT' });
  }
});

test('rejects image hash drift, source symlinks, and preexisting blind-tree extras before publication', async () => {
  {
    const fixture = await makeTask9Fixture();
    fixture.dependencies.loadAdjudicationInputs = async () => {
      const values = structuredClone(fixture.adjudicationInputs);
      values[0].current_image_sha256 = 'f'.repeat(64);
      return values;
    };
    await assert.rejects(
      worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies),
      /image|hash|drift/i,
    );
  }
  {
    const fixture = await makeTask9Fixture();
    fixture.adjudicationInputs[0].observed_target.condition = 'state_only';
    fixture.adjudicationInputs[0].observed_target.rank = 1;
    fixture.adjudicationInputs[0].observed_target.action_type = 'focus';
    await assert.rejects(
      worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies),
      /observed|target|exact|key|condition|rank|action/i,
    );
    await assert.rejects(lstat(path.join(fixture.root, 'blind')), { code: 'ENOENT' });
  }
  {
    const fixture = await makeTask9Fixture();
    const linked = path.join(fixture.root, 'linked-current.png');
    await symlink(fixture.currentImagePath, linked);
    fixture.dependencies.loadAdjudicationInputs = async () => (
      fixture.adjudicationInputs.map((value) => ({ ...structuredClone(value), current_image_path: linked }))
    );
    await assert.rejects(
      worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies),
      /image|symlink|regular/i,
    );
  }
  {
    const fixture = await makeTask9Fixture();
    await mkdir(path.join(fixture.root, 'blind/semantic'), { recursive: true });
    await writeFile(path.join(fixture.root, 'blind/semantic/extra.txt'), 'extra\n', { mode: 0o600 });
    await assert.rejects(
      worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies),
      /blind|extra|unexpected|bundle/i,
    );
  }
});

test('validateSealedJoin rejects schema, collision, order, auto-exact, and ref drift and freezes valid data', async () => {
  const fixture = await makeTask9Fixture();
  await worksheets.prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const source = await readJson(fixture.root, joinPath);
  const valid = worksheets.validateSealedJoin(source, TASK9_KEY);
  assert.equal(Object.isFrozen(valid), true);
  assert.equal(Object.isFrozen(valid.semantic[0].refs[0]), true);
  for (const mutate of [
    (join) => { join.secret_key = TASK9_KEY.toString('hex'); },
    (join) => { join.semantic[0].display_id = join.semantic[1].display_id; },
    (join) => { join.semantic.reverse(); },
    (join) => { join.usefulness[0].auto_exact = true; },
    (join) => { join.semantic[0].refs[0].rank = 4; },
    (join) => {
      const left = join.semantic[0].refs;
      join.semantic[0].refs = join.semantic[1].refs;
      join.semantic[1].refs = left;
    },
    (join) => { join.binding_hmac_sha256 = '0'.repeat(64); },
  ]) {
    const invalid = structuredClone(source);
    mutate(invalid);
    assert.throws(
      () => worksheets.validateSealedJoin(invalid, TASK9_KEY),
      /key|schema|collision|display|order|automatic|exact|ref|rank|binding|HMAC/i,
    );
  }
  assert.equal(canonicalJson(valid), canonicalJson(source));
});
