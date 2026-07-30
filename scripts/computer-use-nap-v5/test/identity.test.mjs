import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeComponent, normalizedFullAction, targetGranularity } from '../lib/identity.mjs';

test('normalizeComponent preserves null', () => {
  assert.equal(normalizeComponent(null), null);
});

test('normalizeComponent applies NFKC, trim, lowercase, and Unicode whitespace collapse only', () => {
  assert.equal(normalizeComponent('  ＦＯＯ\u00a0\tBAR!  '), 'foo bar!');
});

test('targetGranularity accepts only application, object, and subtarget shapes', () => {
  assert.equal(targetGranularity({ app: 'Safari', object: null, subtarget: null }), 'application');
  assert.equal(targetGranularity({ app: 'Safari', object: 'Tab', subtarget: null }), 'object');
  assert.equal(targetGranularity({ app: 'Safari', object: 'Tab', subtarget: 'Close' }), 'subtarget');
});

test('targetGranularity rejects null, empty, and asymmetric target shapes', () => {
  for (const target of [{ app: null, object: null, subtarget: null }, { app: '', object: null, subtarget: null }, { app: '   ', object: null, subtarget: null }, { app: 'Safari', object: null, subtarget: 'Close' }, { app: 'Safari', object: '', subtarget: null }, { app: 'Safari', object: '   ', subtarget: null }, { app: 'Safari', object: 'Tab', subtarget: '' }, { app: 'Safari', object: 'Tab', subtarget: '   ' }]) assert.throws(() => targetGranularity(target), /target|app|object|subtarget/i);
});

test('normalizedFullAction canonicalizes action type and every target component symmetrically', () => {
  assert.equal(normalizedFullAction({ action_type: ' ACTIVATE ', app: ' ＳＡＦＡＲＩ ', object: ' New\u00a0Tab ', subtarget: ' CLOSE ' }), '{\n  "action_type": "activate",\n  "app": "safari",\n  "object": "new tab",\n  "subtarget": "close"\n}\n');
  assert.equal(normalizedFullAction({ action_type: 'focus', app: 'Safari', object: null, subtarget: null }), '{\n  "action_type": "focus",\n  "app": "safari",\n  "object": null,\n  "subtarget": null\n}\n');
  assert.throws(() => normalizedFullAction({ action_type: 'type', app: 'Safari', object: null, subtarget: null }), /action.type|focus|activate/i);
  assert.throws(() => normalizedFullAction({ action_type: 'focus', app: null, object: null, subtarget: null }), /app|target/i);
  assert.throws(() => normalizedFullAction({ action_type: 'focus', app: 'Safari', object: null, subtarget: 'Close' }), /object|target/i);
});
