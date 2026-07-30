import { canonicalJson } from './immutable.mjs';

export const normalizeComponent = (value) => value === null ? null : value.normalize('NFKC').trim().toLowerCase().replace(/\s+/gu,' ');

export function targetGranularity(target) {
  const { app, object, subtarget } = target ?? {};
  if (typeof app !== 'string' || normalizeComponent(app).length === 0) throw new TypeError('Target app must be nonempty');
  if (object === null && subtarget === null) return 'application';
  if (typeof object !== 'string' || normalizeComponent(object).length === 0) throw new TypeError('Target object must be nonempty or null');
  if (subtarget === null) return 'object';
  if (typeof subtarget !== 'string' || normalizeComponent(subtarget).length === 0) throw new TypeError('Target subtarget must be nonempty or null');
  return 'subtarget';
}

export function normalizedFullAction(action) {
  const actionType = normalizeComponent(action.action_type);
  if (actionType !== 'focus' && actionType !== 'activate') throw new TypeError('action_type must be focus or activate');
  targetGranularity({ app: action.app, object: action.object, subtarget: action.subtarget });
  return canonicalJson({
    action_type: actionType,
    app: normalizeComponent(action.app),
    object: normalizeComponent(action.object),
    subtarget: normalizeComponent(action.subtarget),
  });
}
