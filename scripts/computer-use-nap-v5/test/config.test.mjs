import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  CANONICAL_COMMIT,
  CANONICAL_CORPUS_SNAPSHOT_SHA256,
  CANONICAL_LEDGER_PATH,
  CANONICAL_SHA256,
  CONDITIONS,
  METHOD,
  RESPONSE_FIELDS,
  RUNTIME_ROOT,
  V5_SPEC_SHA256,
} from '../config.mjs';

test('freezes the required method model, effort, service tier, and counts', () => {
  assert.deepEqual(METHOD, { model: 'gpt-5.6-sol', reasoningEffort: 'max', serviceTier: 'priority', targetCount: 11, scheduledSlotCount: 22, conditions: ['state_only', 'state_plus_hybrid_history'] });
  assert.ok(Object.isFrozen(METHOD));
});

test('freezes the two experiment conditions', () => {
  assert.deepEqual(CONDITIONS, ['state_only', 'state_plus_hybrid_history']);
  assert.ok(Object.isFrozen(CONDITIONS));
});

test('pins the canonical ledger provenance', () => {
  assert.equal(CANONICAL_LEDGER_PATH, '/Users/dylanvu/notes/30-projects/computer-use-nap-v4-canonical-dataset.md');
  assert.equal(CANONICAL_COMMIT, 'fa3a5c80f3689619da3bf7a3e902041b3b223aea');
  assert.equal(CANONICAL_SHA256, '5df40abf89f0083a0b73965045d75a6ddaa1509f0c04f4bfc2cce027ddae1a48');
  assert.equal(CANONICAL_CORPUS_SNAPSHOT_SHA256, 'db3279c3bba976f110e02e2144cd1c0ac6ce4bdebfeed3c8696dd6e0743c1fcd');
  assert.equal(V5_SPEC_SHA256, 'bbb6331e01239990ef76b0c5bc55afca15fa2ef2e900b39f8a5f16be7944807c');
  assert.equal(RUNTIME_ROOT, '/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history');
});

test('declares the exact response fields', () => {
  assert.deepEqual(RESPONSE_FIELDS, ['rank', 'action_type', 'app', 'object', 'subtarget', 'reason']);
});

test('freezes only the target count and exposes no preselected target identities', async () => {
  assert.equal(METHOD.targetCount, 11);
  assert.equal(METHOD.scheduledSlotCount, 22);
  const configSource = await readFile(new URL('../config.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(configSource, /TARGETS|application:/);
});

test('ships the exact structural prediction schema and predictor instruction', async () => {
  const schema = JSON.parse(await readFile(new URL('../prediction.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(schema.required, ['predictions']);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.predictions.minItems, 3);
  assert.equal(schema.properties.predictions.maxItems, 3);
  assert.equal(await readFile(new URL('../predictor-instruction.txt', import.meta.url), 'utf8'), "Predict Dylan's immediate next eligible monitor-3 navigation action from only\nthe supplied before-state and, when present, earlier personal workflow\nhistory. Return exactly three distinct ranked predictions. Each prediction is\none action: focus an already-present destination, or activate a control that\nnavigates/selects/invokes a destination. Do not predict typing, paste,\nscrolling, cursor movement, text selection, resizing, a multi-action\nsequence, or an eventual goal. Use only visible/provided evidence. Do not use\ntools. Keep each reason under 240 Unicode code points.\n");
});
