import { createHmac } from 'node:crypto';

import { CONDITIONS, METHOD } from '../config.mjs';
import {
  normalizeComponent,
  normalizedFullAction,
  targetGranularity,
} from './identity.mjs';
import { canonicalJson } from './immutable.mjs';
import { validatePredictions } from './response-validation.mjs';

const CANDIDATE_DOMAIN = 'nap-v5/candidate/v1';
const ORDER_DOMAIN = 'nap-v5/order/v1';
const KINDS = new Set(['semantic', 'usefulness']);
const DOMAINS = new Set([CANDIDATE_DOMAIN, ORDER_DOMAIN]);
const SHA256 = /^[0-9a-f]{64}$/;
const SLOT_ID = /^NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])$/;
const TARGET_ID = /^NAP-V5-TARGET-(?:0[1-9]|1[01])-R1$/;
const INPUT_KEYS = ['key', 'slots'];
const DEPENDENCY_KEYS = ['hmacSha256'];
const SLOT_KEYS = [
  'slot_id',
  'slot_ordinal',
  'condition',
  'target_id',
  'target_ordinal',
  'current_image_sha256',
  'target_revision',
  'observed_target',
  'accepted_variants',
  'predictions',
];

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
  if (actual.length !== expected.length
    || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${label} must contain exact keys`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function lengthPrefix(bytes) {
  if (bytes.length > 0xffffffff) throw new Error('HMAC field exceeds uint32be length');
  const prefix = Buffer.alloc(4);
  prefix.writeUInt32BE(bytes.length);
  return Buffer.concat([prefix, bytes]);
}

export function encodeLengthPrefixedHmacInput(options) {
  assertExactKeys(options, ['domain', 'kind', 'identity'], 'HMAC input options');
  if (!DOMAINS.has(options.domain) || !KINDS.has(options.kind)) {
    throw new Error('HMAC input domain or kind is outside the frozen contract');
  }
  const identity = options.domain === CANDIDATE_DOMAIN
    ? typeof options.identity === 'string' && options.identity.length > 0
      ? Buffer.from(options.identity, 'utf8')
      : null
    : Buffer.isBuffer(options.identity) && options.identity.length === 32
      ? Buffer.from(options.identity)
      : null;
  if (identity === null) {
    throw new Error('Candidate identity must be text and order identity must be 32 raw bytes');
  }
  return Buffer.concat([
    lengthPrefix(Buffer.from(options.domain, 'utf8')),
    lengthPrefix(Buffer.from(options.kind, 'utf8')),
    lengthPrefix(identity),
  ]);
}

function defaultHmacSha256(key, input) {
  return createHmac('sha256', key).update(input).digest();
}

function normalizeTarget(target, label) {
  assertExactKeys(target, ['app', 'object', 'subtarget'], `${label} target`);
  try {
    targetGranularity(target);
  } catch (error) {
    throw new Error(`${label} target shape is invalid`, { cause: error });
  }
  return {
    app: normalizeComponent(target.app),
    object: normalizeComponent(target.object),
    subtarget: normalizeComponent(target.subtarget),
  };
}

function normalizeAction(prediction) {
  return JSON.parse(normalizedFullAction(prediction));
}

function validateSlot(source, index) {
  assertExactKeys(source, SLOT_KEYS, `Valid slot ${index + 1}`);
  if (!SLOT_ID.test(source.slot_id)
    || !Number.isSafeInteger(source.slot_ordinal)
    || source.slot_ordinal < 1
    || source.slot_ordinal > METHOD.scheduledSlotCount
    || !CONDITIONS.includes(source.condition)
    || !TARGET_ID.test(source.target_id)
    || !Number.isSafeInteger(source.target_ordinal)
    || source.target_ordinal < 1
    || source.target_ordinal > METHOD.targetCount
    || source.target_revision !== source.target_id
    || !SHA256.test(source.current_image_sha256)) {
    throw new Error(`Valid slot ${index + 1} identity is invalid`);
  }
  const observedTarget = normalizeTarget(source.observed_target, 'Observed');
  if (!Array.isArray(source.accepted_variants) || source.accepted_variants.length === 0) {
    throw new Error('Accepted variants must be a nonempty array');
  }
  const acceptedVariants = source.accepted_variants.map((variant) => (
    normalizeTarget(variant, 'Accepted variant')
  ));
  const predictions = validatePredictions({ predictions: source.predictions }).predictions;
  return {
    slot_id: source.slot_id,
    slot_ordinal: source.slot_ordinal,
    condition: source.condition,
    target_id: source.target_id,
    target_ordinal: source.target_ordinal,
    current_image_sha256: source.current_image_sha256,
    target_revision: source.target_revision,
    observed_target: observedTarget,
    accepted_variants: acceptedVariants,
    predictions,
  };
}

function refFor(slot, rank) {
  return {
    slot_id: slot.slot_id,
    slot_ordinal: slot.slot_ordinal,
    condition: slot.condition,
    target_id: slot.target_id,
    target_ordinal: slot.target_ordinal,
    rank,
  };
}

function semanticIdentity(slot, prediction) {
  return {
    current_state_sha256: slot.current_image_sha256,
    predicted_target: normalizeTarget({
      app: prediction.app,
      object: prediction.object,
      subtarget: prediction.subtarget,
    }, 'Predicted'),
    target_revision: slot.target_revision,
  };
}

function usefulnessIdentity(slot, prediction) {
  return {
    current_state_sha256: slot.current_image_sha256,
    predicted_action: normalizeAction(prediction),
  };
}

function isAutomaticExact(slot, normalizedTarget) {
  const targetJson = canonicalJson(normalizedTarget);
  return slot.accepted_variants.some((variant) => canonicalJson(variant) === targetJson);
}

function checkedHmac(hmacSha256, key, input) {
  const digest = hmacSha256(key, input);
  if (!Buffer.isBuffer(digest) || digest.length !== 32) {
    throw new Error('HMAC-SHA-256 dependency must return exactly 32 raw digest bytes');
  }
  return Buffer.from(digest);
}

function addCandidate(map, kind, identity, autoExact, ref) {
  const identityJson = canonicalJson(identity);
  const existing = map.get(identityJson);
  if (existing === undefined) {
    map.set(identityJson, {
      identityJson,
      normalized_identity: identity,
      auto_exact: autoExact,
      refs: [ref],
    });
    return;
  }
  if (existing.auto_exact !== autoExact) {
    throw new Error(`${kind} deduplication disagrees about automatic exact identity`);
  }
  existing.refs.push(ref);
}

function materializeCandidates({
  kind,
  map,
  key,
  hmacSha256,
  fullIds,
  displayIds,
}) {
  const candidates = [];
  for (const candidate of map.values()) {
    const fullDigest = checkedHmac(
      hmacSha256,
      key,
      encodeLengthPrefixedHmacInput({
        domain: CANDIDATE_DOMAIN,
        kind,
        identity: candidate.identityJson,
      }),
    );
    const fullId = fullDigest.toString('hex');
    const displayId = fullDigest.subarray(0, 16).toString('hex');
    const identityKey = `${kind}\n${candidate.identityJson}`;
    if (fullIds.has(fullId) && fullIds.get(fullId) !== identityKey) {
      throw new Error('Blind candidate full-ID collision');
    }
    if (displayIds.has(displayId) && displayIds.get(displayId) !== fullId) {
      throw new Error('Blind candidate display-ID collision');
    }
    fullIds.set(fullId, identityKey);
    displayIds.set(displayId, fullId);
    const orderKey = checkedHmac(
      hmacSha256,
      key,
      encodeLengthPrefixedHmacInput({
        domain: ORDER_DOMAIN,
        kind,
        identity: fullDigest,
      }),
    ).toString('hex');
    candidate.refs.sort((left, right) => (
      left.slot_ordinal - right.slot_ordinal || left.rank - right.rank
    ));
    candidates.push({
      full_id: fullId,
      display_id: displayId,
      order_key: orderKey,
      normalized_identity: candidate.normalized_identity,
      auto_exact: candidate.auto_exact,
      refs: candidate.refs,
    });
  }
  candidates.sort((left, right) => (
    Buffer.compare(Buffer.from(left.order_key, 'hex'), Buffer.from(right.order_key, 'hex'))
    || Buffer.compare(Buffer.from(left.full_id, 'hex'), Buffer.from(right.full_id, 'hex'))
  ));
  return candidates;
}

export function buildBlindCandidateSets(options, dependencies = {}) {
  assertExactKeys(options, INPUT_KEYS, 'Blind candidate options');
  assertExactKeys(dependencies, Object.keys(dependencies).length === 0 ? [] : DEPENDENCY_KEYS, 'Blind candidate dependencies');
  if (!Buffer.isBuffer(options.key) || options.key.length !== 32) {
    throw new Error('Adjudication HMAC key must be exactly 32 bytes');
  }
  if (!Array.isArray(options.slots)) throw new TypeError('Valid slots must be an array');
  const hmacSha256 = dependencies.hmacSha256 ?? defaultHmacSha256;
  if (typeof hmacSha256 !== 'function') throw new TypeError('hmacSha256 dependency must be a function');
  const slots = options.slots.map(validateSlot);
  const slotIds = new Set();
  const slotOrdinals = new Set();
  const targetContracts = new Map();
  for (const current of slots) {
    if (slotIds.has(current.slot_id) || slotOrdinals.has(current.slot_ordinal)) {
      throw new Error('Valid slots contain a duplicate slot ID or ordinal');
    }
    slotIds.add(current.slot_id);
    slotOrdinals.add(current.slot_ordinal);
    const targetContract = canonicalJson({
      observed_target: current.observed_target,
      accepted_variants: current.accepted_variants,
    });
    const prior = targetContracts.get(current.target_id);
    if (prior !== undefined && prior !== targetContract) {
      throw new Error('Repeated target revision has inconsistent variants or observed target');
    }
    targetContracts.set(current.target_id, targetContract);
  }

  const semanticMap = new Map();
  const usefulnessMap = new Map();
  for (const current of slots) {
    for (const prediction of current.predictions) {
      const semantic = semanticIdentity(current, prediction);
      addCandidate(
        semanticMap,
        'semantic',
        semantic,
        isAutomaticExact(current, semantic.predicted_target),
        refFor(current, prediction.rank),
      );
      addCandidate(
        usefulnessMap,
        'usefulness',
        usefulnessIdentity(current, prediction),
        false,
        refFor(current, prediction.rank),
      );
    }
  }
  const fullIds = new Map();
  const displayIds = new Map();
  return deepFreeze({
    version: 1,
    semantic: materializeCandidates({
      kind: 'semantic',
      map: semanticMap,
      key: options.key,
      hmacSha256,
      fullIds,
      displayIds,
    }),
    usefulness: materializeCandidates({
      kind: 'usefulness',
      map: usefulnessMap,
      key: options.key,
      hmacSha256,
      fullIds,
      displayIds,
    }),
  });
}
