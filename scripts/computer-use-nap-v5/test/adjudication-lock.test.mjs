import assert from 'node:assert/strict';
import {
  chmod,
  lstat,
  mkdir,
  readFile,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import * as adjudication from '../lib/adjudication-lock.mjs';
import { prepareBlindAdjudication } from '../lib/blind-worksheets.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { makeTask9Fixture } from './task9-fixtures.mjs';

const SEMANTIC_PATH = 'blind/semantic/worksheet.json';
const USEFULNESS_PATH = 'blind/usefulness/worksheet.json';
const COMPLETED_SEMANTIC_PATH =
  'evaluator/sealed-join/completed-semantic-worksheet.json';
const COMPLETED_USEFULNESS_PATH =
  'evaluator/sealed-join/completed-usefulness-worksheet.json';
const JOIN_PATH = 'evaluator/sealed-join/join-map.json';
const LOCK_PATH = 'locks/adjudication-lock.json';
const COMPLETED_AT = '2026-07-30T04:05:06.789Z';

const absolute = (root, relativePath) => path.join(root, ...relativePath.split('/'));
const readJson = async (filename) => JSON.parse(await readFile(filename, 'utf8'));

async function writeDecisionInput(filename, worksheet) {
  await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  await writeFile(filename, canonicalJson(worksheet), { flag: 'wx', mode: 0o600 });
}

async function preparedDecisionFixture({
  adjudicator = 'codex_proxy',
  semanticDecisions = ['same_destination', 'different_destination'],
  usefulnessDecisions = ['useful', 'not_useful', 'uncertain'],
} = {}) {
  const fixture = await makeTask9Fixture();
  await prepareBlindAdjudication({ root: fixture.root }, fixture.dependencies);
  const semantic = await readJson(absolute(fixture.root, SEMANTIC_PATH));
  const usefulness = await readJson(absolute(fixture.root, USEFULNESS_PATH));
  semantic.candidates.forEach((candidate, index) => {
    candidate.decision = semanticDecisions[index];
  });
  usefulness.candidates.forEach((candidate, index) => {
    candidate.decision = usefulnessDecisions[index];
  });
  const semanticDecisionArray = semantic.candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    decision: candidate.decision,
  }));
  const usefulnessDecisionArray = usefulness.candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    decision: candidate.decision,
  }));
  const decisionRoot = `${fixture.root}-decision-inputs`;
  const semanticDecisionsPath = path.join(decisionRoot, 'semantic.json');
  const usefulnessDecisionsPath = path.join(decisionRoot, 'usefulness.json');
  await writeDecisionInput(semanticDecisionsPath, semanticDecisionArray);
  await writeDecisionInput(usefulnessDecisionsPath, usefulnessDecisionArray);
  const options = {
    root: fixture.root,
    adjudicator,
    semanticDecisionsPath,
    usefulnessDecisionsPath,
    completedAtUtc: COMPLETED_AT,
  };
  return {
    ...fixture,
    semantic,
    usefulness,
    semanticDecisionArray,
    usefulnessDecisionArray,
    semanticDecisionsPath,
    usefulnessDecisionsPath,
    options,
    adjudicationDependencies: {
      verifyFrozenRun: fixture.dependencies.verifyFrozenRun,
    },
  };
}

async function frozenFixture(options = {}) {
  const fixture = await preparedDecisionFixture(options);
  await adjudication.freezeAdjudication(
    fixture.options,
    fixture.adjudicationDependencies,
  );
  return fixture;
}

test('exports only adjudication freeze and the verified reveal gate', () => {
  assert.deepEqual(Object.keys(adjudication).sort(), [
    'freezeAdjudication',
    'verifyAdjudicationGate',
  ]);
});

test('the reveal gate refuses before the immutable adjudication lock exists', async () => {
  const fixture = await preparedDecisionFixture();
  await assert.rejects(
    adjudication.verifyAdjudicationGate(
      { root: fixture.root },
      fixture.adjudicationDependencies,
    ),
    /adjudication|lock|missing|ENOENT/i,
  );
  await writeFile(
    absolute(fixture.root, COMPLETED_SEMANTIC_PATH),
    canonicalJson(fixture.semantic),
    { flag: 'wx', mode: 0o600 },
  );
  await assert.rejects(
    adjudication.verifyAdjudicationGate(
      { root: fixture.root },
      fixture.adjudicationDependencies,
    ),
    /adjudication|lock|missing|ENOENT/i,
  );
  await assert.rejects(lstat(path.join(fixture.root, 'revealed')), { code: 'ENOENT' });
});

test('freeze requires exact safe options, a truthful adjudicator enum, and regular private decision files', async () => {
  {
    const fixture = await preparedDecisionFixture();
    await assert.rejects(
      adjudication.freezeAdjudication(
        { ...fixture.options, extra: true },
        fixture.adjudicationDependencies,
      ),
      /exact|key|option|extra/i,
    );
    await assert.rejects(
      adjudication.freezeAdjudication(
        { ...fixture.options, adjudicator: 'dylan_proxy' },
        fixture.adjudicationDependencies,
      ),
      /adjudicator|dylan|codex_proxy/i,
    );
  }
  {
    const fixture = await preparedDecisionFixture();
    await chmod(fixture.semanticDecisionsPath, 0o644);
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /decision|0600|private|mode/i,
    );
  }
  {
    const fixture = await preparedDecisionFixture();
    const linked = `${fixture.semanticDecisionsPath}.link`;
    await symlink(fixture.semanticDecisionsPath, linked);
    await assert.rejects(
      adjudication.freezeAdjudication({
        ...fixture.options,
        semanticDecisionsPath: linked,
      }, fixture.adjudicationDependencies),
      /decision|symlink|regular/i,
    );
  }
  {
    const fixture = await preparedDecisionFixture();
    const imagePath = path.join(
      fixture.root,
      'blind/semantic/images',
      `${fixture.semantic.candidates[0].candidate_id}.png`,
    );
    await writeFile(imagePath, Buffer.from('different-before-state-bytes'));
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /blind|image|hash|state|drift/i,
    );
    await assert.rejects(lstat(absolute(fixture.root, LOCK_PATH)), { code: 'ENOENT' });
  }
  {
    const fixture = await preparedDecisionFixture();
    const completion = structuredClone(fixture.completion);
    completion.terminal_records[0].terminal_record_sha256 = 'f'.repeat(64);
    await writeFile(fixture.completionPath, canonicalJson(completion));
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /completion|terminal|marker|hash|drift/i,
    );
    await assert.rejects(lstat(absolute(fixture.root, LOCK_PATH)), { code: 'ENOENT' });
  }
  {
    const fixture = await preparedDecisionFixture();
    const joinFilename = absolute(fixture.root, JOIN_PATH);
    const join = await readJson(joinFilename);
    const left = join.semantic[0].refs;
    join.semantic[0].refs = join.semantic[1].refs;
    join.semantic[1].refs = left;
    await writeFile(joinFilename, canonicalJson(join));
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /sealed|join|binding|HMAC|authenticated|drift/i,
    );
    await assert.rejects(lstat(absolute(fixture.root, LOCK_PATH)), { code: 'ENOENT' });
  }
  {
    const fixture = await preparedDecisionFixture();
    const semanticPath = absolute(fixture.root, 'blind/semantic/worksheet.json');
    const semantic = await readJson(semanticPath);
    semantic.candidates[0].observed_target.app = 'Drifted observed destination';
    await writeFile(semanticPath, canonicalJson(semantic), { mode: 0o600 });
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /observed|semantic|identity|join|drift|authenticated/i,
    );
    await assert.rejects(lstat(absolute(fixture.root, LOCK_PATH)), { code: 'ENOENT' });
  }
});

test('freeze requires exact ID/decision arrays and rejects missing, duplicate, extra, or drifted entries', async () => {
  const cases = [
    ['missing', (decisions) => { decisions.pop(); }],
    ['duplicate', (decisions) => { decisions[1] = structuredClone(decisions[0]); }],
    ['extra', (decisions) => {
      decisions.push({
        ...structuredClone(decisions[0]),
        candidate_id: 'f'.repeat(32),
      });
    }],
    ['invalid', (decisions) => { decisions[0].decision = 'maybe'; }],
    ['extra field', (decisions) => { decisions[0].predicted_target = { app: 'Slack' }; }],
    ['not an array', () => ({ decisions: [] })],
  ];
  for (const [label, mutate] of cases) {
    const fixture = await preparedDecisionFixture();
    const source = structuredClone(fixture.semanticDecisionArray);
    const decisions = mutate(source) ?? source;
    await unlink(fixture.semanticDecisionsPath);
    await writeDecisionInput(fixture.semanticDecisionsPath, decisions);
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /array|candidate|decision|opaque|semantic|exact|drift|duplicate|extra/i,
      label,
    );
    await assert.rejects(lstat(absolute(fixture.root, LOCK_PATH)), { code: 'ENOENT' });
  }
  {
    const fixture = await preparedDecisionFixture();
    await unlink(fixture.semanticDecisionsPath);
    await writeDecisionInput(fixture.semanticDecisionsPath, fixture.semantic);
    await assert.rejects(
      adjudication.freezeAdjudication(
        fixture.options,
        fixture.adjudicationDependencies,
      ),
      /array|semantic|decision|exact/i,
      'completed worksheet compatibility shape',
    );
    await assert.rejects(lstat(absolute(fixture.root, LOCK_PATH)), { code: 'ENOENT' });
  }
});

test('freeze writes exact evaluator-only completed worksheets, hashes, counts, and lock schema', async () => {
  const fixture = await frozenFixture();
  const semanticBytes = await readFile(absolute(fixture.root, COMPLETED_SEMANTIC_PATH));
  const usefulnessBytes = await readFile(absolute(fixture.root, COMPLETED_USEFULNESS_PATH));
  assert.deepEqual(JSON.parse(semanticBytes), fixture.semantic);
  assert.deepEqual(JSON.parse(usefulnessBytes), fixture.usefulness);
  const joinBytes = await readFile(absolute(fixture.root, JOIN_PATH));
  const lock = await readJson(absolute(fixture.root, LOCK_PATH));
  assert.deepEqual(Object.keys(lock).sort(), [
    'adjudicator',
    'completed_at_utc',
    'proxy_only',
    'sealed_join_sha256',
    'semantic_decision_counts',
    'semantic_worksheet_sha256',
    'usefulness_decision_counts',
    'usefulness_worksheet_sha256',
    'version',
  ]);
  assert.deepEqual(lock, {
    version: 1,
    adjudicator: 'codex_proxy',
    semantic_worksheet_sha256: sha256(semanticBytes),
    usefulness_worksheet_sha256: sha256(usefulnessBytes),
    sealed_join_sha256: sha256(joinBytes),
    semantic_decision_counts: {
      same_destination: 1,
      different_destination: 1,
      uncertain: 0,
    },
    usefulness_decision_counts: {
      useful: 1,
      not_useful: 1,
      uncertain: 1,
    },
    completed_at_utc: COMPLETED_AT,
    proxy_only: true,
  });
  for (const relativePath of [
    COMPLETED_SEMANTIC_PATH,
    COMPLETED_USEFULNESS_PATH,
    LOCK_PATH,
  ]) {
    const stat = await lstat(absolute(fixture.root, relativePath));
    assert.equal(stat.isFile(), true);
    assert.equal(stat.isSymbolicLink(), false);
    assert.equal(stat.nlink, 1);
    assert.equal(stat.mode & 0o777, 0o600);
  }
});

test('the autonomous harness rejects fabricated Dylan provenance and supports Codex proxy-only', async () => {
  const unsupported = await preparedDecisionFixture({ adjudicator: 'dylan' });
  await assert.rejects(
    adjudication.freezeAdjudication(
      unsupported.options,
      unsupported.adjudicationDependencies,
    ),
    /dylan|unsupported|codex_proxy|provenance/i,
  );
  await assert.rejects(lstat(absolute(unsupported.root, LOCK_PATH)), { code: 'ENOENT' });

  const proxy = await frozenFixture();
  const proxyGate = await adjudication.verifyAdjudicationGate(
    { root: proxy.root },
    proxy.adjudicationDependencies,
  );
  assert.equal(proxyGate.adjudicator, 'codex_proxy');
  assert.equal(proxyGate.proxy_only, true);
  assert.equal(Object.hasOwn(proxyGate, 'official_product_band'), false);
});

test('freeze reruns are byte-idempotent and reject conflicting decisions or provenance', async () => {
  const fixture = await frozenFixture();
  const paths = [
    COMPLETED_SEMANTIC_PATH,
    COMPLETED_USEFULNESS_PATH,
    LOCK_PATH,
  ];
  const before = await Promise.all(paths.map((relativePath) => (
    readFile(absolute(fixture.root, relativePath))
  )));
  await adjudication.freezeAdjudication(
    fixture.options,
    fixture.adjudicationDependencies,
  );
  const after = await Promise.all(paths.map((relativePath) => (
    readFile(absolute(fixture.root, relativePath))
  )));
  assert.deepEqual(after, before);

  const changed = structuredClone(fixture.semanticDecisionArray);
  changed[0].decision = 'uncertain';
  await unlink(fixture.semanticDecisionsPath);
  await writeDecisionInput(fixture.semanticDecisionsPath, changed);
  await assert.rejects(
    adjudication.freezeAdjudication(
      fixture.options,
      fixture.adjudicationDependencies,
    ),
    /immutable|differs|decision|hash|lock/i,
  );
  await assert.rejects(
    adjudication.freezeAdjudication(
      { ...fixture.options, adjudicator: 'dylan' },
      fixture.adjudicationDependencies,
    ),
    /adjudicator|provenance|lock|differs/i,
  );
});

test('the gate rejects modified, non-private, or symlinked completed artifacts', async () => {
  for (const mutate of [
    async (fixture) => {
      const filename = absolute(fixture.root, COMPLETED_SEMANTIC_PATH);
      const sheet = await readJson(filename);
      sheet.candidates[0].decision = 'uncertain';
      await writeFile(filename, canonicalJson(sheet));
    },
    async (fixture) => {
      await chmod(absolute(fixture.root, LOCK_PATH), 0o644);
    },
    async (fixture) => {
      const filename = absolute(fixture.root, COMPLETED_USEFULNESS_PATH);
      const copy = `${filename}.copy`;
      await writeFile(copy, await readFile(filename), { flag: 'wx', mode: 0o600 });
      await unlink(filename);
      await symlink(copy, filename);
    },
    async (fixture) => {
      const imagePath = path.join(
        fixture.root,
        'blind/usefulness/images',
        `${fixture.usefulness.candidates[0].candidate_id}.png`,
      );
      await writeFile(imagePath, Buffer.from('different-before-state-bytes'));
    },
    async (fixture) => {
      const completion = structuredClone(fixture.completion);
      completion.terminal_records[0].terminal_record_sha256 = 'f'.repeat(64);
      await writeFile(fixture.completionPath, canonicalJson(completion));
    },
  ]) {
    const fixture = await frozenFixture();
    await mutate(fixture);
    await assert.rejects(
      adjudication.verifyAdjudicationGate(
        { root: fixture.root },
        fixture.adjudicationDependencies,
      ),
      /adjudication|blind|completed|completion|terminal|marker|worksheet|image|state|hash|private|0600|symlink|regular/i,
    );
    await assert.rejects(lstat(path.join(fixture.root, 'revealed')), { code: 'ENOENT' });
  }
});

test('the verified in-memory join resolves auto-exact and blind decisions with every sealed ref', async () => {
  const fixture = await frozenFixture();
  const join = await readJson(absolute(fixture.root, JOIN_PATH));
  const gate = await adjudication.verifyAdjudicationGate(
    { root: fixture.root },
    fixture.adjudicationDependencies,
  );
  assert.deepEqual(Object.keys(gate).sort(), [
    'adjudication_lock_sha256',
    'adjudicator',
    'completion_marker_sha256',
    'proxy_only',
    'semantic',
    'usefulness',
    'version',
  ]);
  assert.equal(gate.adjudication_lock_sha256,
    sha256(await readFile(absolute(fixture.root, LOCK_PATH))));
  assert.equal(gate.completion_marker_sha256, fixture.completionMarkerSha256);
  assert.equal(gate.semantic.length, join.semantic.length);
  assert.equal(gate.usefulness.length, join.usefulness.length);
  const semanticByDisplay = new Map(
    fixture.semantic.candidates.map((candidate) => [candidate.candidate_id, candidate.decision]),
  );
  gate.semantic.forEach((candidate, index) => {
    assert.deepEqual(Object.keys(candidate).sort(), [
      'auto_exact',
      'decision',
      'display_id',
      'full_id',
      'normalized_identity',
      'refs',
    ]);
    assert.deepEqual(candidate.refs, join.semantic[index].refs);
    assert.equal(
      candidate.decision,
      candidate.auto_exact
        ? 'same_destination'
        : semanticByDisplay.get(candidate.display_id),
    );
  });
  const usefulnessByDisplay = new Map(
    fixture.usefulness.candidates.map((candidate) => [candidate.candidate_id, candidate.decision]),
  );
  gate.usefulness.forEach((candidate, index) => {
    assert.equal(candidate.decision, usefulnessByDisplay.get(candidate.display_id));
    assert.deepEqual(candidate.refs, join.usefulness[index].refs);
  });
  assert.equal(Object.isFrozen(gate), true);
  assert.equal(Object.isFrozen(gate.semantic[0].refs[0]), true);
  await assert.rejects(lstat(path.join(fixture.root, 'revealed')), { code: 'ENOENT' });
});

test('the gate rejects lock schema, count, proxy relation, completed-ID, and sealed-join drift', async () => {
  const cases = [
    async (fixture) => {
      const filename = absolute(fixture.root, LOCK_PATH);
      const lock = await readJson(filename);
      lock.extra = true;
      await writeFile(filename, canonicalJson(lock));
    },
    async (fixture) => {
      const filename = absolute(fixture.root, LOCK_PATH);
      const lock = await readJson(filename);
      lock.semantic_decision_counts.same_destination += 1;
      await writeFile(filename, canonicalJson(lock));
    },
    async (fixture) => {
      const filename = absolute(fixture.root, LOCK_PATH);
      const lock = await readJson(filename);
      lock.proxy_only = false;
      await writeFile(filename, canonicalJson(lock));
    },
    async (fixture) => {
      const filename = absolute(fixture.root, COMPLETED_SEMANTIC_PATH);
      const sheet = await readJson(filename);
      sheet.candidates[0].candidate_id = 'e'.repeat(32);
      await writeFile(filename, canonicalJson(sheet));
      const lockFilename = absolute(fixture.root, LOCK_PATH);
      const lock = await readJson(lockFilename);
      lock.semantic_worksheet_sha256 = sha256(await readFile(filename));
      await writeFile(lockFilename, canonicalJson(lock));
    },
    async (fixture) => {
      const filename = absolute(fixture.root, JOIN_PATH);
      const join = await readJson(filename);
      join.semantic.reverse();
      await writeFile(filename, canonicalJson(join));
      const lockFilename = absolute(fixture.root, LOCK_PATH);
      const lock = await readJson(lockFilename);
      lock.sealed_join_sha256 = sha256(await readFile(filename));
      await writeFile(lockFilename, canonicalJson(lock));
    },
  ];
  for (const mutate of cases) {
    const fixture = await frozenFixture();
    await mutate(fixture);
    await assert.rejects(
      adjudication.verifyAdjudicationGate(
        { root: fixture.root },
        fixture.adjudicationDependencies,
      ),
      /lock|schema|exact|count|proxy|candidate|opaque|join|order|drift/i,
    );
  }
});
