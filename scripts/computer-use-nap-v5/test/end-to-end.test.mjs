import assert from 'node:assert/strict';
import {
  cp,
  lstat,
  mkdir,
  readFile,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { METHOD } from '../config.mjs';
import { main as cliMain } from '../cli.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { verifyPrepared } from '../lib/prepare.mjs';
import { runWorkflowCommand } from '../lib/workflow.mjs';
import {
  completedUsage,
  jsonl,
  structuralError,
  validPredictionResponse,
} from './attempt-fixtures.mjs';
import {
  cloneRuntime,
  runTask6Pipeline,
} from './task6-fixtures.mjs';

const FIXED_NOW = '2026-07-30T20:00:00.000Z';
const roots = new Set();
let preparedPromise;
let receiptPromise;
let lockedPromise;
let terminalPromise;
let blindPromise;
let adjudicatedPromise;
let revealedPromise;

test.after(async () => {
  await Promise.all([...roots].map((root) => rm(root, { recursive: true, force: true })));
});

const absolute = (root, relativePath) => path.join(root, ...relativePath.split('/'));
const readJson = async (root, relativePath) => (
  JSON.parse(await readFile(absolute(root, relativePath), 'utf8'))
);

async function cloneStage(stage, label) {
  const root = `${stage.root}-${label}`;
  await cp(stage.root, root, { recursive: true, preserveTimestamps: true });
  roots.add(root);
  return { ...stage, root };
}

function preflightProbes() {
  const recording = '2'.repeat(64);
  const results = {
    canonical: {
      canonical_dataset_sha256: '5df40abf89f0083a0b73965045d75a6ddaa1509f0c04f4bfc2cce027ddae1a48',
      canonical_dataset_commit: 'fa3a5c80f3689619da3bf7a3e902041b3b223aea',
      retained_count: 220,
      accepted_count: 196,
      accepted_history_count: 196,
      accepted_nontrivial_count: 139,
    },
    donor: {
      file_count: 21,
      aggregate_sha256: '307f06ad992e20aa51d464a4b04e2145eab6f950f26fcb2edbe289319871d0bc',
      method_lock_sha256: '55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa',
    },
    prepared: {
      prepared_inventory_sha256: '1'.repeat(64),
      recording_sequence_sha256: recording,
      target_count: METHOD.targetCount,
      slot_count: METHOD.scheduledSlotCount,
      context_count: METHOD.scheduledSlotCount,
      packet_count: METHOD.scheduledSlotCount,
    },
    video: {
      recording_sequence_sha256: recording,
      file_count: 31,
      total_byte_length: 103_005_033,
      total_frame_count: 1_092,
      time_base_count: 13,
    },
    versions: {
      ffmpeg_version: 'ffmpeg version 8.0 synthetic',
      ffprobe_version: 'ffprobe version 8.0 synthetic',
      node_version: 'v24.11.1',
      codex_cli_version: '0.144.6',
    },
    capabilities: {
      codex_exec_help_sha256: '3'.repeat(64),
      bundled_model_catalog_sha256: '4'.repeat(64),
      bundled_model_instructions_sha256: '5'.repeat(64),
      debug_prompt_input_help_sha256: '6'.repeat(64),
    },
    adapter: {
      argv_sha256: '7'.repeat(64),
      config_count: 26,
      hard_no_tools_switch: false,
      structural_tool_events_terminal_invalid: true,
      timeout_ms: 1_200_000,
      termination_grace_ms: 5_000,
    },
    strictConfig: {
      strict_config_accepted: true,
      local_schema_rejection: true,
      provider_requests: 0,
      model_calls: 0,
      exit_code: 1,
      error_sha256: '8'.repeat(64),
    },
    auth: {
      source_readable: true,
      home_mode: '0700',
      auth_copy_mode: '0600',
      copied_file_count: 1,
      cleanup_verified: true,
      credential_log_count: 0,
      credential_hash_count: 0,
    },
    packets: {
      target_count: METHOD.targetCount,
      slot_count: METHOD.scheduledSlotCount,
      packet_count: METHOD.scheduledSlotCount,
      pair_count: METHOD.targetCount,
      leakage_audit_count: METHOD.scheduledSlotCount,
      pair_identical_current_count: METHOD.targetCount,
    },
    storage: {
      runtime_readable: true,
      runtime_writable: true,
      minimum_free_bytes: 1_073_741_824,
    },
    zeroState: {
      attempt_count: 0,
      environment_stop_count: 0,
      completion_count: 0,
      adjudication_count: 0,
      revealed_count: 0,
    },
    v5: {
      passed: 398,
      failures: 0,
      skips: 0,
      warnings: 0,
      model_calls: 0,
      exit_code: 0,
      output_sha256: '9'.repeat(64),
    },
    v4: {
      passed: 119,
      failures: 0,
      skips: 0,
      warnings: 0,
      model_calls: 0,
      exit_code: 0,
      output_sha256: 'a'.repeat(64),
    },
    frozen: {
      verified: true,
      receipts_verified: true,
      method_lock_sha256: 'b'.repeat(64),
      run_lock_sha256: 'c'.repeat(64),
    },
  };
  const result = (name) => structuredClone(results[name]);
  return {
    canonical: async () => result('canonical'),
    donor: async () => result('donor'),
    prepared: async () => result('prepared'),
    video: async () => result('video'),
    versions: async () => result('versions'),
    capabilities: async () => result('capabilities'),
    adapter: async () => result('adapter'),
    strictConfig: async () => result('strictConfig'),
    auth: async () => result('auth'),
    packets: async () => result('packets'),
    storage: async () => result('storage'),
    zeroState: async () => result('zeroState'),
    suite: async ({ suite }) => result(suite),
    frozen: async () => result('frozen'),
  };
}

async function preparedStage() {
  preparedPromise ??= (async () => {
    const stage = await runTask6Pipeline();
    roots.add(stage.parent);
    return stage;
  })();
  return preparedPromise;
}

async function receiptStage() {
  receiptPromise ??= (async () => {
    const prepared = await preparedStage();
    const stage = await cloneStage(prepared, 'e2e-receipts');
    await cliMain(
      ['preflight', '--phase', 'before-lock'],
      {
        root: stage.root,
        io: {
          preflight: {
            probes: preflightProbes(),
            now: () => new Date(FIXED_NOW),
          },
        },
      },
    );
    return stage;
  })();
  return receiptPromise;
}

async function lockedStage() {
  lockedPromise ??= (async () => {
    const receipt = await receiptStage();
    const stage = await cloneStage(receipt, 'e2e-locked');
    await cliMain(['freeze-run'], { root: stage.root });
    await cliMain(['verify-frozen'], { root: stage.root });
    return stage;
  })();
  return lockedPromise;
}

async function materializeBehavior(journal, behavior) {
  if (behavior === 'valid') {
    await journal.appendEvents(jsonl(completedUsage()));
    await journal.writeFinal(Buffer.from(JSON.stringify(validPredictionResponse())));
    return { exit_code: 0 };
  }
  if (behavior === 'invalid') {
    await journal.appendEvents(jsonl({ type: 'tool.requested', tool_name: 'shell' }));
    await journal.writeFinal(Buffer.from(JSON.stringify(validPredictionResponse())));
    return { exit_code: 0 };
  }
  if (behavior === 'retry') {
    await journal.appendEvents(jsonl(structuralError('rate_limit')));
    return { exit_code: 1 };
  }
  if (behavior === 'fatal') {
    await journal.appendEvents(jsonl(structuralError('authentication_error')));
    return { exit_code: 1 };
  }
  throw new Error(`Unknown behavior: ${behavior}`);
}

function runnerIo(stage, behaviors) {
  const queue = [...behaviors];
  let clock = 1_000;
  return {
    verifyPrepared: (options) => verifyPrepared({
      ...options,
      io: stage.io,
    }),
    authSourcePath: '/private/tmp/nap-v5-synthetic-auth.json',
    nowMs: () => {
      clock += 10;
      return clock;
    },
    createFreshAttemptRuntime: async () => ({ cleanup: async () => {} }),
    executeAttempt: async ({ journal, durableClassification }) => {
      const process = await materializeBehavior(journal, queue.shift() ?? 'valid');
      await durableClassification({
        journal_path: journal.path,
        process: {
          exit_code: process.exit_code,
          timed_out: false,
          spawn_failed: false,
          local_io_before_final: false,
          final_sha256: null,
        },
      });
    },
    writeOutput: () => {},
  };
}

async function terminalStage() {
  terminalPromise ??= (async () => {
    const locked = await lockedStage();
    const stage = await cloneStage(locked, 'e2e-terminal');
    await cliMain(
      ['run'],
      { root: stage.root, io: runnerIo(stage, ['valid', 'retry', 'valid', 'fatal']) },
    );
    await cliMain(
      ['run'],
      { root: stage.root, io: runnerIo(stage, ['valid', 'invalid']) },
    );
    await cliMain(
      ['verify-attempts'],
      { root: stage.root, io: runnerIo(stage, []) },
    );
    return stage;
  })();
  return terminalPromise;
}

async function blindStage() {
  blindPromise ??= (async () => {
    const terminal = await terminalStage();
    const stage = await cloneStage(terminal, 'e2e-blind');
    await cliMain(
      ['prepare-blind-adjudication'],
      {
        root: stage.root,
        io: {
          prepared: stage.io,
          writeOutput: () => {},
        },
      },
    );
    return stage;
  })();
  return blindPromise;
}

async function writeDecisions(stage) {
  const semantic = await readJson(stage.root, 'blind/semantic/worksheet.json');
  const usefulness = await readJson(stage.root, 'blind/usefulness/worksheet.json');
  semantic.candidates.forEach((candidate) => {
    candidate.decision = 'different_destination';
  });
  usefulness.candidates.forEach((candidate) => {
    candidate.decision = 'useful';
  });
  const decisionRoot = `${stage.root}-decisions`;
  roots.add(decisionRoot);
  await mkdir(decisionRoot, { recursive: true, mode: 0o700 });
  const semanticPath = path.join(decisionRoot, 'semantic.json');
  const usefulnessPath = path.join(decisionRoot, 'usefulness.json');
  await writeFile(semanticPath, canonicalJson(semantic.candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    decision: candidate.decision,
  }))), { flag: 'wx', mode: 0o600 });
  await writeFile(usefulnessPath, canonicalJson(usefulness.candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    decision: candidate.decision,
  }))), { flag: 'wx', mode: 0o600 });
  return { semanticPath, usefulnessPath };
}

async function adjudicatedStage() {
  adjudicatedPromise ??= (async () => {
    const blind = await blindStage();
    const stage = await cloneStage(blind, 'e2e-adjudicated');
    const decisions = await writeDecisions(stage);
    const output = [];
    await cliMain([
      'freeze-adjudication',
      '--adjudicator',
      'codex_proxy',
      '--semantic-decisions',
      decisions.semanticPath,
      '--usefulness-decisions',
      decisions.usefulnessPath,
    ], {
      root: stage.root,
      io: {
        writeOutput: (text) => output.push(text),
      },
    });
    stage.adjudicationOutput = output.join('');
    stage.adjudicationReturn = await runWorkflowCommand({
      root: stage.root,
      command: 'freeze-adjudication',
      adjudicator: 'codex_proxy',
      semanticDecisionsPath: decisions.semanticPath,
      usefulnessDecisionsPath: decisions.usefulnessPath,
      io: { writeOutput: () => {} },
    });
    return stage;
  })();
  return adjudicatedPromise;
}

async function revealedStage() {
  revealedPromise ??= (async () => {
    const adjudicated = await adjudicatedStage();
    const stage = await cloneStage(adjudicated, 'e2e-revealed');
    await cliMain(
      ['reveal-results'],
      { root: stage.root, io: { prepared: stage.io, writeOutput: () => {} } },
    );
    const interpretationRoot = `${stage.root}-interpretation`;
    roots.add(interpretationRoot);
    await mkdir(interpretationRoot, { recursive: true, mode: 0o700 });
    const interpretationPath = path.join(interpretationRoot, 'proxy.json');
    await writeFile(interpretationPath, canonicalJson({
      adjudicator: 'codex_proxy',
      band: 'weak-or-mixed',
      would_want_router: null,
      rationale: 'Synthetic proxy fixture exercises the immutable finalization path.',
    }), { flag: 'wx', mode: 0o600 });
    await cliMain(
      ['finalize-report', '--interpretation', interpretationPath],
      { root: stage.root, io: { prepared: stage.io, writeOutput: () => {} } },
    );
    await cliMain(
      ['verify-results'],
      { root: stage.root, io: { prepared: stage.io, writeOutput: () => {} } },
    );
    return stage;
  })();
  return revealedPromise;
}

test('exposes the exact post-preparation CLI surface and strict arguments', async () => {
  const {
    WORKFLOW_COMMANDS,
    runWorkflowCommand,
  } = await import('../lib/workflow.mjs');
  assert.deepEqual(WORKFLOW_COMMANDS, [
    'preflight',
    'freeze-run',
    'verify-frozen',
    'prepare-blind-adjudication',
    'freeze-adjudication',
    'reveal-results',
    'finalize-report',
    'verify-results',
  ]);
  assert.equal(typeof runWorkflowCommand, 'function');
  await assert.rejects(cliMain(['preflight']), /phase|required/i);
  await assert.rejects(cliMain(['preflight', '--phase', 'during']), /phase|before-lock|after-lock/i);
  await assert.rejects(cliMain(['freeze-adjudication']), /adjudicator|required|decision/i);
  await assert.rejects(
    cliMain([
      'freeze-adjudication',
      '--adjudicator',
      'dylan',
      '--semantic-decisions',
      '/tmp/semantic.json',
      '--usefulness-decisions',
      '/tmp/usefulness.json',
    ]),
    /adjudicator|codex_proxy/i,
  );
  await assert.rejects(cliMain(['finalize-report']), /interpretation|required/i);
});

test('runs the synthetic corpus through retry and fatal-resume to one proxy-only final report', async () => {
  const stage = await revealedStage();
  const scorePackage = await readJson(stage.root, 'revealed/score-package.json');
  const report = await readFile(absolute(stage.root, 'revealed/FINAL-REPORT.md'), 'utf8');
  assert.equal(scorePackage.operational_summary.scheduled_slots, METHOD.scheduledSlotCount);
  assert.equal(scorePackage.operational_summary.model_scorable_slots, METHOD.scheduledSlotCount);
  assert.equal(scorePackage.operational_summary.retry_count, 1);
  assert.equal(scorePackage.adjudication.adjudicator, 'codex_proxy');
  assert.equal(scorePackage.adjudication.proxy_only, true);
  assert.equal(scorePackage.interpretation.official_product_band, null);
  assert.deepEqual(stage.adjudicationReturn, {
    ok: true,
    command: 'freeze-adjudication',
    adjudicator: 'codex_proxy',
    proxy_only: true,
  });
  assert.doesNotMatch(
    stage.adjudicationOutput,
    /NAP-V5-SLOT|normalized_identity|"reason"|"predictions"/u,
  );
  assert.match(report, /scheduled.*11/i);
  assert.match(report, /model-scorable.*11/i);
  assert.match(report, /Proxy sensitivity interpretation:\s*weak-or-mixed/i);
  assert.match(report, /Official product band:\s*unavailable.*proxy-only/i);
  assert.equal((await readJson(stage.root, 'evaluator/corpus-snapshot.json')).rows.length, 220);
  assert.equal((await readJson(stage.root, 'evaluator/target-selection.json')).selected_event_ids.length, METHOD.targetCount);
  assert.equal((await readJson(stage.root, 'evaluator/schedule.json')).slots.length, METHOD.scheduledSlotCount);
});

test('refuses reveal before all frozen slots terminate and writes no revealed byte', async () => {
  const locked = await lockedStage();
  const stage = await cloneStage(locked, 'e2e-early-reveal');
  await assert.rejects(
    cliMain(['reveal-results'], { root: stage.root }),
    /terminal|completion|adjudication|lock|gate/i,
  );
  await assert.rejects(lstat(path.join(stage.root, 'revealed')), { code: 'ENOENT' });
});

test('refuses reveal after completion but before adjudication freezes', async () => {
  const terminal = await terminalStage();
  const stage = await cloneStage(terminal, 'e2e-unadjudicated-reveal');
  await assert.rejects(
    cliMain(['reveal-results'], { root: stage.root }),
    /adjudication|lock|gate|missing/i,
  );
  await assert.rejects(lstat(path.join(stage.root, 'revealed')), { code: 'ENOENT' });
});

test('prepared evaluator mutation blocks freeze-run before any key or lock write', async () => {
  const receipt = await receiptStage();
  const stage = await cloneStage(receipt, 'e2e-prepared-mutation');
  const catalogPath = absolute(stage.root, 'evaluator/target-catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  catalog.targets[0].canonical_target.app = 'Mutated';
  await writeFile(catalogPath, canonicalJson(catalog), { mode: 0o600 });
  await assert.rejects(cliMain(['freeze-run'], { root: stage.root }), /catalog|prepared|hash|receipt|drift/i);
  for (const relativePath of [
    'evaluator/sealed-join/adjudication-key.bin',
    'locks/method-lock.json',
    'locks/run-lock.json',
  ]) {
    await assert.rejects(lstat(absolute(stage.root, relativePath)), { code: 'ENOENT' });
  }

  const packetStage = await cloneStage(receipt, 'e2e-packet-mutation');
  const promptPath = absolute(
    packetStage.root,
    'packets/NAP-V5-SLOT-01/prompt.txt',
  );
  await writeFile(
    promptPath,
    Buffer.concat([await readFile(promptPath), Buffer.from('\n')]),
    { mode: 0o600 },
  );
  await assert.rejects(
    cliMain(['freeze-run'], { root: packetStage.root }),
    /packet|prepared|inventory|hash|drift/i,
  );
  for (const relativePath of [
    'evaluator/sealed-join/adjudication-key.bin',
    'locks/method-lock.json',
    'locks/run-lock.json',
  ]) {
    await assert.rejects(
      lstat(absolute(packetStage.root, relativePath)),
      { code: 'ENOENT' },
    );
  }
});

test('sealed-attempt mutation blocks blind worksheet publication', async () => {
  const terminal = await terminalStage();
  const stage = await cloneStage(terminal, 'e2e-attempt-mutation');
  const eventsPath = absolute(
    stage.root,
    'sealed-attempts/NAP-V5-SLOT-01/attempt-001/events.jsonl',
  );
  await writeFile(eventsPath, Buffer.from('{"type":"tampered"}\n'), { mode: 0o600 });
  await assert.rejects(
    cliMain(
      ['prepare-blind-adjudication'],
      { root: stage.root, io: { prepared: stage.io, writeOutput: () => {} } },
    ),
    /attempt|terminal|sealed|hash|verification/i,
  );
  await assert.rejects(lstat(path.join(stage.root, 'blind')), { code: 'ENOENT' });
});

test('adjudication mutation blocks reveal before any score or report write', async () => {
  const adjudicated = await adjudicatedStage();
  const stage = await cloneStage(adjudicated, 'e2e-adjudication-mutation');
  const completed = absolute(
    stage.root,
    'evaluator/sealed-join/completed-semantic-worksheet.json',
  );
  const bytes = await readFile(completed);
  await writeFile(completed, Buffer.concat([bytes, Buffer.from('\n')]), { mode: 0o600 });
  await assert.rejects(
    cliMain(
      ['reveal-results'],
      { root: stage.root, io: { prepared: stage.io, writeOutput: () => {} } },
    ),
    /adjudication|worksheet|hash|canonical|gate/i,
  );
  await assert.rejects(lstat(path.join(stage.root, 'revealed')), { code: 'ENOENT' });
});

test('verify-results independently catches revealed drift without rewriting it', async () => {
  const revealed = await revealedStage();
  const stage = await cloneStage(revealed, 'e2e-result-mutation');
  const packagePath = absolute(stage.root, 'revealed/score-package.json');
  const before = await readFile(packagePath);
  const mutated = Buffer.concat([before.subarray(0, -1), Buffer.from(' \n')]);
  await writeFile(packagePath, mutated, { mode: 0o600 });
  await assert.rejects(
    cliMain(
      ['verify-results'],
      { root: stage.root, io: { prepared: stage.io, writeOutput: () => {} } },
    ),
    /result|score|canonical|hash|drift|differ/i,
  );
  assert.deepEqual(await readFile(packagePath), mutated);
  assert.notEqual(sha256(mutated), sha256(before));
  await unlink(packagePath);
});
