import {
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { METHOD } from '../config.mjs';
import {
  claimAttemptJournal,
  finalizeAttemptJournal,
  verifyAttemptRecord as verifyRealAttemptRecord,
} from '../lib/attempt-store.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';

export const TASK9_KEY = Buffer.from(
  '000102030405060708090a0b0c0d0e0f'
  + '101112131415161718191a1b1c1d1e1f',
  'hex',
);

const prediction = (rank) => ({
  rank,
  action_type: rank === 2 ? 'activate' : 'focus',
  app: rank === 1 ? 'Arc' : rank === 2 ? 'Codex' : 'Slack',
  object: rank === 1 ? 'Coda' : rank === 3 ? 'general' : null,
  subtarget: rank === 3 ? 'composer' : null,
  reason: `sealed reason ${rank}`,
});

const hashes = (valid) => ({
  request_sha256: 'a'.repeat(64),
  events_sha256: 'b'.repeat(64),
  stderr_sha256: 'c'.repeat(64),
  final_sha256: valid ? 'd'.repeat(64) : null,
});

const verifiedAttempt = (terminalState) => {
  const valid = terminalState === 'valid_final';
  const infrastructure = terminalState === 'infrastructure_failure';
  return {
    classification: {
      classification: valid
        ? 'valid_final'
        : infrastructure
          ? 'infrastructure_retry'
          : 'terminal_invalid',
      code: valid
        ? 'valid_final'
        : infrastructure
          ? 'transport_disconnect'
          : 'attempted_tool_use',
      response: valid ? { predictions: [prediction(1), prediction(2), prediction(3)] } : null,
      usage: null,
    },
    hashes: hashes(valid),
  };
};

async function materializeRealValidAttempt(sealedRoot, slotId, slotOrdinal) {
  const journal = await claimAttemptJournal({
    sealedRoot,
    slotId,
    opaqueId: `task9-real-${String(slotOrdinal).padStart(2, '0')}`,
    request: {
      version: 1,
      slot_ordinal: slotOrdinal,
      packet_sha256: 'a'.repeat(64),
      prompt_sha256: 'b'.repeat(64),
      image_sha256s: ['c'.repeat(64)],
    },
  });
  await journal.appendEvents(Buffer.from(
    `${JSON.stringify({
      type: 'turn.completed',
      usage: {
        input_tokens: 100,
        cached_input_tokens: 25,
        output_tokens: 30,
      },
    })}\n`,
  ));
  await journal.writeFinal(Buffer.from(JSON.stringify({
    predictions: [prediction(1), prediction(2), prediction(3)],
  })));
  const finalized = await finalizeAttemptJournal({
    sealedRoot,
    slotId,
    journalPath: journal.path,
    process: {
      exit_code: 0,
      timed_out: false,
      spawn_failed: false,
      local_io_before_final: false,
    },
  });
  return finalized.path;
}

export async function makeTask9Fixture({ realValidAttempts = false } = {}) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-task9-')));
  const sealedJoinRoot = path.join(root, 'evaluator/sealed-join');
  const sourceRoot = path.join(root, 'synthetic-current-images');
  const sealedRoot = path.join(root, 'sealed-attempts');
  const locksRoot = path.join(root, 'locks');
  await mkdir(sealedJoinRoot, { recursive: true, mode: 0o700 });
  await mkdir(sourceRoot, { recursive: true, mode: 0o700 });
  await mkdir(path.join(sealedRoot, 'slot-state'), { recursive: true, mode: 0o700 });
  await mkdir(locksRoot, { recursive: true, mode: 0o700 });
  await writeFile(
    path.join(sealedJoinRoot, 'adjudication-key.bin'),
    TASK9_KEY,
    { flag: 'wx', mode: 0o600 },
  );
  const currentImageBytes = Buffer.from('synthetic-current-before-state-png-bytes');
  const currentImagePath = path.join(sourceRoot, 'current.png');
  await writeFile(currentImagePath, currentImageBytes, { flag: 'wx', mode: 0o600 });
  const currentImageSha256 = sha256(currentImageBytes);

  const terminalSlots = [];
  const completionRecords = [];
  const verifiedAttempts = new Map();
  const realAttemptPaths = new Set();
  for (let index = 0; index < METHOD.scheduledSlotCount; index += 1) {
    const slotOrdinal = index + 1;
    const slotId = `NAP-V5-SLOT-${String(slotOrdinal).padStart(2, '0')}`;
    const valid = slotOrdinal <= 2;
    const terminalState = valid ? 'valid_final' : 'terminal_invalid';
    let attemptPath = path.join(
      sealedRoot,
      slotId,
      `attempt-${String(1).padStart(3, '0')}`,
    );
    if (valid && realValidAttempts) {
      attemptPath = await materializeRealValidAttempt(sealedRoot, slotId, slotOrdinal);
      realAttemptPaths.add(attemptPath);
    }
    const terminal = {
      slot_id: slotId,
      slot_ordinal: slotOrdinal,
      terminal_state: terminalState,
      attempt_path: attemptPath,
    };
    terminalSlots.push(terminal);
    const verified = verifiedAttempt(terminalState);
    verifiedAttempts.set(attemptPath, verified);
    const terminalRecord = {
      version: 1,
      slot_ordinal: slotOrdinal,
      terminal_state: terminalState,
      classification: verified.classification.classification,
      code: verified.classification.code,
      authoritative_attempt_ordinal: 1,
      latency_ms: 100 + slotOrdinal,
    };
    const terminalBytes = Buffer.from(canonicalJson(terminalRecord));
    const terminalRoot = path.join(sealedRoot, 'slot-state', slotId);
    await mkdir(terminalRoot, { recursive: true, mode: 0o700 });
    await writeFile(
      path.join(terminalRoot, 'terminal.json'),
      terminalBytes,
      { flag: 'wx', mode: 0o600 },
    );
    completionRecords.push({
      slot_ordinal: slotOrdinal,
      terminal_record_sha256: sha256(terminalBytes),
    });
  }
  const completion = {
    version: 1,
    scheduled_slot_count: METHOD.scheduledSlotCount,
    terminal_slot_count: METHOD.scheduledSlotCount,
    terminal_records: completionRecords,
  };
  const completionPath = path.join(locksRoot, 'all-slots-terminal.json');
  await writeFile(
    completionPath,
    canonicalJson(completion),
    { flag: 'wx', mode: 0o600 },
  );
  const completionMarkerSha256 = sha256(await readFile(completionPath));
  const adjudicationInputs = terminalSlots.slice(0, 2).map((terminal, index) => ({
    slot_id: terminal.slot_id,
    slot_ordinal: terminal.slot_ordinal,
    condition: index === 0 ? 'state_only' : 'state_plus_hybrid_history',
    target_id: 'NAP-V5-TARGET-01-R1',
    target_ordinal: 1,
    current_image_sha256: currentImageSha256,
    current_image_path: currentImagePath,
    target_revision: 'NAP-V5-TARGET-01-R1',
    observed_target: { app: 'Arc', object: 'Coda', subtarget: null },
    accepted_variants: [{ app: 'Arc', object: 'Coda', subtarget: null }],
  }));
  const calls = {
    frozen: 0,
    prepared: 0,
    attempts: [],
    inputs: 0,
  };
  const dependencies = {
    verifyFrozenRun: async ({ root: received }) => {
      calls.frozen += 1;
      return received === root;
    },
    verifyPrepared: async ({ root: received }) => {
      calls.prepared += 1;
      return received === root;
    },
    verifyAttemptRecord: async (attemptPath) => {
      calls.attempts.push(attemptPath);
      if (realAttemptPaths.has(attemptPath)) {
        return verifyRealAttemptRecord(attemptPath);
      }
      return structuredClone(verifiedAttempts.get(attemptPath));
    },
    loadAdjudicationInputs: async ({ root: received, slotIds }) => {
      calls.inputs += 1;
      if (received !== root
        || JSON.stringify(slotIds) !== JSON.stringify(['NAP-V5-SLOT-01', 'NAP-V5-SLOT-02'])) {
        throw new Error('unexpected adjudication input request');
      }
      return structuredClone(adjudicationInputs);
    },
  };
  return {
    root,
    completion,
    completionPath,
    completionMarkerSha256,
    terminalSlots,
    adjudicationInputs,
    verifiedAttempts,
    dependencies,
    calls,
    currentImageBytes,
    currentImagePath,
    currentImageSha256,
  };
}
