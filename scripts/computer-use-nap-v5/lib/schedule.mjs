import { CONDITIONS, METHOD } from '../config.mjs';

const TARGET_ID = /^NAP-V5-TARGET-(0[1-9]|1[01])-R1$/;

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
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${label} must contain exactly: ${keys.join(', ')}`);
  }
}

function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

export function buildSchedule(targetPlan) {
  assertExactKeys(targetPlan, ['version', 'targets'], 'Schedule target plan');
  if (targetPlan.version !== 1
    || !Array.isArray(targetPlan.targets)
    || targetPlan.targets.length !== METHOD.targetCount) {
    throw new Error(`Schedule target plan must contain exactly ${METHOD.targetCount} targets`);
  }

  let priorChronology = 0;
  targetPlan.targets.forEach((target, index) => {
    assertExactKeys(
      target,
      ['target_ordinal', 'target_id', 'chronology_index'],
      `Schedule target ${index + 1}`,
    );
    const ordinal = index + 1;
    const expectedId = `NAP-V5-TARGET-${String(ordinal).padStart(2, '0')}-R1`;
    if (target.target_ordinal !== ordinal
      || !TARGET_ID.test(target.target_id)
      || target.target_id !== expectedId) {
      throw new Error(`Schedule target ID, ordinal, or revision is invalid at target ${ordinal}`);
    }
    if (!Number.isSafeInteger(target.chronology_index)
      || target.chronology_index <= priorChronology) {
      throw new Error(`Schedule targets must be in strict canonical chronology at target ${ordinal}`);
    }
    priorChronology = target.chronology_index;
  });

  const slots = [];
  for (const target of targetPlan.targets) {
    const first = target.target_ordinal % 2 === 1 ? CONDITIONS[0] : CONDITIONS[1];
    const second = first === CONDITIONS[0] ? CONDITIONS[1] : CONDITIONS[0];
    for (const [pairIndex, condition] of [first, second].entries()) {
      const slotOrdinal = slots.length + 1;
      slots.push({
        slot_ordinal: slotOrdinal,
        slot_id: `NAP-V5-SLOT-${String(slotOrdinal).padStart(2, '0')}`,
        target_ordinal: target.target_ordinal,
        target_id: target.target_id,
        target_chronology_index: target.chronology_index,
        pair_position: pairIndex + 1,
        condition,
      });
    }
  }

  return deepFreeze({
    version: 1,
    target_count: METHOD.targetCount,
    scheduled_slot_count: METHOD.scheduledSlotCount,
    conditions: [...CONDITIONS],
    first_condition_balance: {
      [CONDITIONS[0]]: targetPlan.targets.filter((target) => target.target_ordinal % 2 === 1).length,
      [CONDITIONS[1]]: targetPlan.targets.filter((target) => target.target_ordinal % 2 === 0).length,
    },
    slots,
  });
}
