import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { loadAndValidateManifest } from '../lib/manifest.mjs';
import { renderPacket } from '../lib/packets.mjs';

const experimentDir = path.resolve(import.meta.dirname, '..');
const manifest = await loadAndValidateManifest(path.join(experimentDir, 'manifest.json'));
const rows = manifest.rows;
const clone = (value) => structuredClone(value);
const visible = (packet) => ({ prompt_text: packet.prompt_text, images: packet.images });

function assertNoPromptLeakage(prompt, rowList = rows) {
  for (const row of rowList) {
    for (const value of [
      row.event_id, row.before_player_time, row.action_player_time, row.source_recording_ref,
      row.canonical_label, 'source_state_note', 'qa', 'later-frame',
    ]) assert.ok(!prompt.includes(value), `prompt leaked ${value}`);
  }
  assert.ok(!prompt.includes('/Users/'), 'prompt leaked an absolute path');
}

test('state_only is a two-image leakage-safe current-state packet', () => {
  const current = rows[1];
  const packet = renderPacket(manifest, { eventId: current.event_id, condition: 'state_only' });
  assert.equal(packet.images.length, 2);
  assert.deepEqual(packet.images.map(({ attachment_ordinal, provenance_role, monitor }) => ({ attachment_ordinal, provenance_role, monitor })), [
    { attachment_ordinal: 1, provenance_role: 'current', monitor: 1 },
    { attachment_ordinal: 2, provenance_role: 'current', monitor: 3 },
  ]);
  assert.equal(packet.history_event_ids_ordered.length, 0);
  assert.equal(packet.prompt_text, `ATTACHED IMAGE ORDER\nImage 1: CURRENT BEFORE STATE monitor 1\nImage 2: CURRENT BEFORE STATE monitor 3\nEND ATTACHED IMAGE ORDER\n\nPredict the immediate next eligible action from the CURRENT BEFORE STATE.\n`);
  assertNoPromptLeakage(packet.prompt_text);
  for (const row of rows) {
    for (const value of Object.values(row.target)) if (value !== null) assert.ok(!packet.prompt_text.includes(value), `state_only leaked target value ${value}`);
  }
  assert.deepEqual(Object.keys(packet).sort(), ['condition', 'current_action_player_time', 'current_before_player_time', 'current_source_recording_ref', 'event_id', 'history_audit_ordered', 'history_event_ids_ordered', 'images', 'prompt_text', 'row_version']);
  assert.equal(packet.current_source_recording_ref, current.source_recording_ref);
  assert.equal(packet.current_before_player_time, current.before_player_time);
  assert.equal(packet.current_action_player_time, current.action_player_time);
  assert.deepEqual(packet.history_audit_ordered, []);
  assert.ok(Object.isFrozen(packet));
  assert.ok(Object.isFrozen(packet.images));
  assert.ok(Object.isFrozen(packet.images[0]));
  const enriched = clone(manifest);
  Object.assign(enriched.rows[1], { action: 'leak', source_state_note: 'leak', qa: 'leak', later_frame: 'leak' });
  const enrichedPacket = renderPacket(enriched, { eventId: current.event_id, condition: 'state_only' });
  for (const forbiddenKey of ['target', 'action', 'source_state_note', 'qa', 'later_frame']) {
    assert.ok(!(forbiddenKey in enrichedPacket), `packet exposed ${forbiddenKey}`);
    assert.ok(!enrichedPacket.prompt_text.includes('leak'), `prompt exposed ${forbiddenKey}`);
  }
});

test('first history packet uses exact deterministic prompt and four ordered images', () => {
  const current = rows[1];
  const packet = renderPacket(manifest, { eventId: current.event_id, condition: 'state_plus_all_prior' });
  assert.equal(packet.images.length, 4);
  assert.deepEqual(packet.history_event_ids_ordered, [rows[0].event_id]);
  assert.deepEqual(packet.history_audit_ordered, [{
    event_id: rows[0].event_id,
    row_version: rows[0].row_version,
    source_recording_ref: rows[0].source_recording_ref,
    before_player_time: rows[0].before_player_time,
    action_player_time: rows[0].action_player_time,
  }]);
  assert.equal(packet.prompt_text, `ATTACHED IMAGE ORDER\nImage 1: HISTORY EXAMPLE 1 monitor 1 before state\nImage 2: HISTORY EXAMPLE 1 monitor 3 before state\nImage 3: CURRENT BEFORE STATE monitor 1\nImage 4: CURRENT BEFORE STATE monitor 3\nEND ATTACHED IMAGE ORDER\n\nHISTORY EXAMPLE 1\nknown_action_target: {"app":"Arc","object":"Coda: all hands 7.27 meeting note","subtarget":null}\nEND HISTORY EXAMPLE 1\n\nPredict the immediate next eligible action from the CURRENT BEFORE STATE.\n`);
  assert.ok(!packet.prompt_text.includes(rows[0].canonical_label));
  assertNoPromptLeakage(packet.prompt_text);
});

test('max history packet has 38 historical images and current images last', () => {
  const packet = renderPacket(manifest, { eventId: rows.at(-1).event_id, condition: 'state_plus_all_prior' });
  assert.equal(packet.images.length, 40);
  assert.deepEqual(packet.images.map((image) => image.attachment_ordinal), Array.from({ length: 40 }, (_, index) => index + 1));
  assert.deepEqual(packet.images.map((image) => image.monitor), Array.from({ length: 20 }, () => [1, 3]).flat());
  assert.deepEqual(packet.images.slice(0, 38).map((image) => image.history_example_ordinal), Array.from({ length: 19 }, (_, index) => [index + 1, index + 1]).flat());
  assert.equal((packet.prompt_text.match(/^HISTORY EXAMPLE \d+$/gm) ?? []).length, 19);
  assert.deepEqual(packet.images.slice(0, 38).map((image) => image.provenance_role), Array(38).fill('history'));
  assert.deepEqual(packet.images.slice(-2).map((image) => image.provenance_role), ['current', 'current']);
});

test('history is oldest-to-newest, pairs monitors, and assigns each prior target once by provenance', () => {
  const currentIndex = 5;
  const packet = renderPacket(manifest, { eventId: rows[currentIndex].event_id, condition: 'state_plus_all_prior' });
  assert.deepEqual(packet.history_event_ids_ordered, rows.slice(0, currentIndex).map((row) => row.event_id));
  assertNoPromptLeakage(packet.prompt_text);
  assert.deepEqual(packet.images.map((image) => image.attachment_ordinal), Array.from({ length: 12 }, (_, index) => index + 1));
  for (let index = 0; index < packet.images.length; index += 2) {
    assert.deepEqual(packet.images.slice(index, index + 2).map((image) => image.monitor), [1, 3]);
  }
  for (let ordinal = 1; ordinal <= currentIndex; ordinal += 1) {
    assert.equal((packet.prompt_text.match(new RegExp(`^HISTORY EXAMPLE ${ordinal}\\n`, 'gm')) ?? []).length, 1);
    assert.equal((packet.prompt_text.match(new RegExp(`^END HISTORY EXAMPLE ${ordinal}\\n`, 'gm')) ?? []).length, 1);
  }
  for (const row of rows.slice(0, currentIndex)) {
    const compactLine = `known_action_target: ${JSON.stringify({ app: row.target.app, object: row.target.object, subtarget: row.target.subtarget })}`;
    const ordinal = rows.indexOf(row) + 1;
    const block = packet.prompt_text.match(new RegExp(`HISTORY EXAMPLE ${ordinal}\\n([\\s\\S]*?)\\nEND HISTORY EXAMPLE ${ordinal}`))?.[1] ?? '';
    assert.equal((block.match(new RegExp(`^${compactLine.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'gm')) ?? []).length, 1);
    assert.ok(!packet.prompt_text.includes(row.canonical_label), `prompt separately emitted ${row.canonical_label}`);
  }
});

test('rendering is deterministic, does not mutate its manifest, and isolates target provenance', () => {
  const original = clone(manifest);
  const baseline = renderPacket(manifest, { eventId: rows[5].event_id, condition: 'state_plus_all_prior' });
  assert.deepEqual(baseline, renderPacket(manifest, { eventId: rows[5].event_id, condition: 'state_plus_all_prior' }));
  assert.deepEqual(manifest, original);

  const currentMutated = clone(manifest);
  currentMutated.rows[5].target = { app: 'CURRENT_TARGET_SENTINEL', object: 'leak', subtarget: null };
  currentMutated.rows[5].canonical_label = 'CURRENT_TARGET_SENTINEL -> leak';
  Object.assign(currentMutated.rows[5], { action: 'CURRENT_ACTION_SENTINEL', source_state_note: 'CURRENT_NOTE_SENTINEL', qa: 'CURRENT_QA_SENTINEL', later_frame: 'CURRENT_LATER_SENTINEL' });
  const currentPacket = renderPacket(currentMutated, { eventId: rows[5].event_id, condition: 'state_plus_all_prior' });
  assert.deepEqual(visible(currentPacket), visible(baseline));
  const futureMutated = clone(manifest);
  futureMutated.rows[6].target = { app: 'FUTURE_TARGET_SENTINEL', object: 'leak', subtarget: null };
  futureMutated.rows[6].canonical_label = 'FUTURE_TARGET_SENTINEL -> leak';
  Object.assign(futureMutated.rows[6], { action: 'FUTURE_ACTION_SENTINEL', source_state_note: 'FUTURE_NOTE_SENTINEL', qa: 'FUTURE_QA_SENTINEL', later_frame: 'FUTURE_LATER_SENTINEL' });
  const futurePacket = renderPacket(futureMutated, { eventId: rows[5].event_id, condition: 'state_plus_all_prior' });
  assert.deepEqual(visible(futurePacket), visible(baseline));
  for (const sentinel of ['CURRENT_TARGET_SENTINEL', 'CURRENT_ACTION_SENTINEL', 'CURRENT_NOTE_SENTINEL', 'CURRENT_QA_SENTINEL', 'CURRENT_LATER_SENTINEL', 'FUTURE_TARGET_SENTINEL', 'FUTURE_ACTION_SENTINEL', 'FUTURE_NOTE_SENTINEL', 'FUTURE_QA_SENTINEL', 'FUTURE_LATER_SENTINEL']) {
    assert.ok(!currentPacket.prompt_text.includes(sentinel));
    assert.ok(!futurePacket.prompt_text.includes(sentinel));
    assert.ok(!JSON.stringify(currentPacket).includes(sentinel));
    assert.ok(!JSON.stringify(futurePacket).includes(sentinel));
  }
  const priorMutated = clone(manifest);
  priorMutated.rows[2].target = { app: 'PRIOR_SENTINEL', object: 'only-line-changes', subtarget: null };
  priorMutated.rows[2].canonical_label = 'PRIOR_SENTINEL -> only-line-changes';
  const changed = renderPacket(priorMutated, { eventId: rows[5].event_id, condition: 'state_plus_all_prior' });
  const beforeLines = baseline.prompt_text.split('\n');
  const afterLines = changed.prompt_text.split('\n');
  const changedIndexes = afterLines.flatMap((line, index) => line === beforeLines[index] ? [] : [index]);
  assert.deepEqual(changedIndexes, [22]);

  const historicalAuditMutated = clone(manifest);
  Object.assign(historicalAuditMutated.rows[0], { action: 'HISTORY_ACTION_SENTINEL', source_state_note: 'HISTORY_NOTE_SENTINEL', qa: 'HISTORY_QA_SENTINEL', later_frame: 'HISTORY_LATER_SENTINEL' });
  const historicalAuditPacket = renderPacket(historicalAuditMutated, { eventId: rows[5].event_id, condition: 'state_plus_all_prior' });
  for (const sentinel of ['HISTORY_ACTION_SENTINEL', 'HISTORY_NOTE_SENTINEL', 'HISTORY_QA_SENTINEL', 'HISTORY_LATER_SENTINEL']) {
    assert.ok(!historicalAuditPacket.prompt_text.includes(sentinel));
    assert.ok(!JSON.stringify(historicalAuditPacket).includes(sentinel));
  }
});

test('rejects invalid rendering inputs instead of silently rendering', () => {
  assert.throws(() => renderPacket(manifest, { eventId: rows[0].event_id, condition: 'state_plus_all_prior' }), /seed/i);
  assert.throws(() => renderPacket(manifest, { eventId: 'unknown', condition: 'state_only' }), /unknown event/i);
  assert.throws(() => renderPacket(manifest, { eventId: rows[1].event_id, condition: 'wrong' }), /condition/i);
  const monitorMalformed = clone(manifest); [monitorMalformed.rows[0].before_state_inputs[0], monitorMalformed.rows[0].before_state_inputs[1]] = [monitorMalformed.rows[0].before_state_inputs[1], monitorMalformed.rows[0].before_state_inputs[0]];
  assert.throws(() => renderPacket(monitorMalformed, { eventId: rows[1].event_id, condition: 'state_plus_all_prior' }), /monitor 1 then monitor 3/i);
  const targetMalformed = clone(manifest); targetMalformed.rows[0].target = { app: 'Arc', object: '', subtarget: null };
  assert.throws(() => renderPacket(targetMalformed, { eventId: rows[1].event_id, condition: 'state_plus_all_prior' }), /target/i);
  const currentTargetMalformed = clone(manifest); currentTargetMalformed.rows[1].target = { app: 'Codex', object: '', subtarget: null };
  assert.throws(() => renderPacket(currentTargetMalformed, { eventId: rows[1].event_id, condition: 'state_only' }), /target/i);
  const appended = clone(manifest); appended.rows.push(clone(rows.at(-1)));
  assert.throws(() => renderPacket(appended, { eventId: rows[1].event_id, condition: 'state_only' }), /exactly 20|row.*order/i);
  const removed = clone(manifest); removed.rows.pop();
  assert.throws(() => renderPacket(removed, { eventId: rows[1].event_id, condition: 'state_only' }), /exactly 20|row.*order/i);
  const reordered = clone(manifest); [reordered.rows[1], reordered.rows[2]] = [reordered.rows[2], reordered.rows[1]];
  assert.throws(() => renderPacket(reordered, { eventId: rows[1].event_id, condition: 'state_only' }), /exactly 20|frozen order/i);
  const wrongTopId = clone(manifest); wrongTopId.manifest_id = 'wrong';
  assert.throws(() => renderPacket(wrongTopId, { eventId: rows[1].event_id, condition: 'state_only' }), /manifest_id/);
  const wrongVersion = clone(manifest); wrongVersion.rows[1].row_version = 1;
  assert.throws(() => renderPacket(wrongVersion, { eventId: rows[1].event_id, condition: 'state_only' }), /row_version/);
  const wrongPath = clone(manifest); wrongPath.rows[1].before_state_inputs[0].path = '/wrong.png';
  assert.throws(() => renderPacket(wrongPath, { eventId: rows[1].event_id, condition: 'state_only' }), /before-state input path/);
  const malformedHash = clone(manifest); malformedHash.rows[1].before_state_inputs[0].sha256 = 'not-a-hash';
  assert.throws(() => renderPacket(malformedHash, { eventId: rows[1].event_id, condition: 'state_only' }), /sha256/);
});
