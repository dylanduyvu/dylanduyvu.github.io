import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';

import * as blindIds from '../lib/blind-ids.mjs';

const KEY = Buffer.from(
  '000102030405060708090a0b0c0d0e0f'
  + '101112131415161718191a1b1c1d1e1f',
  'hex',
);
const SHA_A = 'a'.repeat(64);
const TARGET = Object.freeze({ app: 'Arc', object: 'Coda', subtarget: null });

const prediction = (rank, overrides = {}) => ({
  rank,
  action_type: rank === 2 ? 'activate' : 'focus',
  app: rank === 1 ? 'Arc' : rank === 2 ? 'Codex' : 'Slack',
  object: rank === 1 ? 'Coda' : rank === 3 ? 'general' : null,
  subtarget: rank === 3 ? 'composer' : null,
  reason: `reason ${rank}`,
  ...overrides,
});

const slot = (overrides = {}) => ({
  slot_id: 'NAP-V5-SLOT-01',
  slot_ordinal: 1,
  condition: 'state_only',
  target_id: 'NAP-V5-TARGET-01-R1',
  target_ordinal: 1,
  current_image_sha256: SHA_A,
  target_revision: 'NAP-V5-TARGET-01-R1',
  observed_target: { ...TARGET },
  accepted_variants: [{ ...TARGET }],
  predictions: [prediction(1), prediction(2), prediction(3)],
  ...overrides,
});

const build = (slots = [slot()], dependencies) => (
  blindIds.buildBlindCandidateSets({ key: KEY, slots }, dependencies)
);

const independentLengthPrefix = (...fields) => Buffer.concat(fields.flatMap((field) => {
  const bytes = Buffer.isBuffer(field) ? field : Buffer.from(field, 'utf8');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(bytes.length);
  return [length, bytes];
}));

const independentHmac = (key, bytes) => createHmac('sha256', key).update(bytes).digest();

test('exports only the two frozen blind-ID functions', () => {
  assert.deepEqual(Object.keys(blindIds).sort(), [
    'buildBlindCandidateSets',
    'encodeLengthPrefixedHmacInput',
  ]);
});

test('encodes exact uint32be byte lengths for Unicode and raw identity bytes', () => {
  const candidate = blindIds.encodeLengthPrefixedHmacInput({
    domain: 'nap-v5/candidate/v1',
    kind: 'semantic',
    identity: 'é',
  });
  assert.deepEqual(
    candidate,
    independentLengthPrefix('nap-v5/candidate/v1', 'semantic', 'é'),
  );
  const raw = Buffer.from(Array.from({ length: 32 }, (_, index) => index));
  assert.deepEqual(
    blindIds.encodeLengthPrefixedHmacInput({
      domain: 'nap-v5/order/v1',
      kind: 'usefulness',
      identity: raw,
    }),
    independentLengthPrefix('nap-v5/order/v1', 'usefulness', raw),
  );
});

test('derives the full and display candidate IDs from the exact candidate-domain HMAC', () => {
  const output = build();
  const entry = output.semantic.find((candidate) => (
    candidate.refs.some((ref) => ref.rank === 2)
  ));
  const identityJson = `${JSON.stringify(entry.normalized_identity, null, 2)}\n`;
  const digest = independentHmac(
    KEY,
    independentLengthPrefix('nap-v5/candidate/v1', 'semantic', identityJson),
  );
  assert.equal(entry.full_id, digest.toString('hex'));
  assert.equal(entry.display_id, digest.subarray(0, 16).toString('hex'));
});

test('derives order keys from the raw 32-byte full ID under the separate order domain', () => {
  const entry = build().usefulness[0];
  const digest = independentHmac(
    KEY,
    independentLengthPrefix(
      'nap-v5/order/v1',
      'usefulness',
      Buffer.from(entry.full_id, 'hex'),
    ),
  );
  assert.equal(entry.order_key, digest.toString('hex'));
});

test('semantic identity contains only current state, normalized predicted target, and revision', () => {
  const entry = build().semantic.find((candidate) => (
    candidate.refs.some((ref) => ref.rank === 2)
  ));
  assert.deepEqual(entry.normalized_identity, {
    current_state_sha256: SHA_A,
    predicted_target: {
      app: 'codex',
      object: null,
      subtarget: null,
    },
    target_revision: 'NAP-V5-TARGET-01-R1',
  });
  assert.equal(JSON.stringify(entry).includes('reason 2'), false);
  assert.equal(JSON.stringify(entry.normalized_identity).includes('action_type'), false);
});

test('usefulness identity contains current state and the normalized complete predicted action', () => {
  const entry = build().usefulness.find((candidate) => (
    candidate.refs.some((ref) => ref.rank === 2)
  ));
  assert.deepEqual(entry.normalized_identity, {
    current_state_sha256: SHA_A,
    predicted_action: {
      action_type: 'activate',
      app: 'codex',
      object: null,
      subtarget: null,
    },
  });
  assert.equal(Object.hasOwn(entry.normalized_identity, 'target_revision'), false);
});

test('deduplicates normalized semantic identities and retains every slot/rank reference', () => {
  const second = slot({
    slot_id: 'NAP-V5-SLOT-02',
    slot_ordinal: 2,
    condition: 'state_plus_hybrid_history',
    predictions: [
      prediction(1, { app: 'ＡＲＣ', object: 'Ｃｏｄａ' }),
      prediction(2, { app: 'CODEX' }),
      prediction(3, { app: 'Slack' }),
    ],
  });
  const output = build([slot(), second]);
  assert.equal(output.semantic.length, 3);
  for (const candidate of output.semantic) assert.equal(candidate.refs.length, 2);
  assert.deepEqual(
    output.semantic.flatMap((candidate) => candidate.refs.map((ref) => ref.slot_id)).sort(),
    Array(3).fill('NAP-V5-SLOT-01').concat(Array(3).fill('NAP-V5-SLOT-02')).sort(),
  );
});

test('semantic dedup ignores action type while usefulness keeps distinct full actions', () => {
  const source = slot({
    predictions: [
      prediction(1),
      prediction(2, {
        action_type: 'activate',
        app: 'Arc',
        object: 'Coda',
      }),
      prediction(3),
    ],
  });
  const output = build([source]);
  const semanticArc = output.semantic.find((candidate) => (
    candidate.normalized_identity.predicted_target.app === 'arc'
  ));
  assert.equal(semanticArc.refs.length, 2);
  assert.equal(output.usefulness.length, 3);
});

test('marks exact semantic identities automatic and maps every non-exact rank to review', () => {
  const output = build();
  const exact = output.semantic.find((candidate) => candidate.auto_exact);
  assert.deepEqual(exact.refs.map((ref) => ref.rank), [1]);
  const reviewRefs = output.semantic
    .filter((candidate) => !candidate.auto_exact)
    .flatMap((candidate) => candidate.refs.map((ref) => ref.rank))
    .sort();
  assert.deepEqual(reviewRefs, [2, 3]);
});

test('maps all three predictions from every valid slot into usefulness refs', () => {
  const second = slot({
    slot_id: 'NAP-V5-SLOT-02',
    slot_ordinal: 2,
    condition: 'state_plus_hybrid_history',
  });
  const refs = build([slot(), second]).usefulness
    .flatMap((candidate) => candidate.refs)
    .map((ref) => `${ref.slot_id}:${ref.rank}`)
    .sort();
  assert.deepEqual(refs, [
    'NAP-V5-SLOT-01:1',
    'NAP-V5-SLOT-01:2',
    'NAP-V5-SLOT-01:3',
    'NAP-V5-SLOT-02:1',
    'NAP-V5-SLOT-02:2',
    'NAP-V5-SLOT-02:3',
  ]);
});

test('sorts by raw order-key bytes deterministically and deeply freezes output', () => {
  const first = build();
  const second = build();
  assert.deepEqual(first, second);
  for (const candidates of [first.semantic, first.usefulness]) {
    assert.deepEqual(
      candidates.map((entry) => entry.order_key),
      candidates.map((entry) => entry.order_key).sort(),
    );
  }
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.semantic[0].refs[0]), true);
});

test('rejects a full-ID collision between distinct normalized identities', () => {
  const hmacSha256 = (_key, input) => (
    input.includes(Buffer.from('nap-v5/candidate/v1'))
      ? Buffer.alloc(32, 7)
      : independentHmac(KEY, input)
  );
  assert.throws(
    () => build(undefined, { hmacSha256 }),
    /full.*collision|collision.*full/i,
  );
});

test('rejects a display-ID collision even when full candidate IDs differ', () => {
  let candidateOrdinal = 0;
  const hmacSha256 = (_key, input) => {
    if (!input.includes(Buffer.from('nap-v5/candidate/v1'))) {
      return independentHmac(KEY, input);
    }
    candidateOrdinal += 1;
    const digest = Buffer.alloc(32, 9);
    digest.writeUInt32BE(candidateOrdinal, 28);
    return digest;
  };
  assert.throws(
    () => build(undefined, { hmacSha256 }),
    /display.*collision|collision.*display/i,
  );
});

test('fails closed on invalid key, slot schema, slot identity, rank, variant, or dependency', () => {
  assert.throws(
    () => blindIds.buildBlindCandidateSets({ key: Buffer.alloc(31), slots: [slot()] }),
    /key|32/i,
  );
  assert.throws(() => build([{ ...slot(), extra: true }]), /slot|keys|exact/i);
  assert.throws(() => build([slot(), slot()]), /duplicate|slot/i);
  assert.throws(
    () => build([slot({ predictions: [prediction(2), prediction(1), prediction(3)] })]),
    /rank|prediction|schema/i,
  );
  assert.throws(
    () => build([slot({ accepted_variants: [{ app: 'Arc', object: null, subtarget: 'bad' }] })]),
    /variant|shape|target/i,
  );
  assert.throws(
    () => build([slot({
      observed_target: {
        app: 'Arc',
        object: 'Coda',
        subtarget: null,
        condition: 'state_only',
        rank: 1,
        action_type: 'focus',
      },
    })]),
    /observed|target|keys|exact/i,
  );
  assert.throws(
    () => build([slot({
      accepted_variants: [{
        app: 'Arc',
        object: 'Coda',
        subtarget: null,
        condition: 'state_only',
      }],
    })]),
    /variant|target|keys|exact/i,
  );
  assert.throws(
    () => build(undefined, { hmacSha256: () => Buffer.alloc(31) }),
    /hmac|32|digest/i,
  );
});
