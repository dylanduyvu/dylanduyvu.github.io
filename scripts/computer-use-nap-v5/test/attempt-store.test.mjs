import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  cp, link, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, stat, symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { claimAttemptJournal, finalizeAttemptJournal, recoverAttemptJournals, verifyAttemptRecord } from '../lib/attempt-store.mjs';
import { classifyAttemptArtifacts } from '../lib/event-classifier.mjs';
import { canonicalJson } from '../lib/immutable.mjs';
import { completedUsage, jsonl, structuralError, validPredictionResponse } from './attempt-fixtures.mjs';

const roots = new Set();
test.after(async () => Promise.all([...roots].map((root) => rm(root, { recursive: true, force: true }))));
const root = async () => {
  const value = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-attempt-store-')));
  roots.add(value);
  return value;
};
const request = (overrides = {}) => ({
  version: 1,
  slot_ordinal: 1,
  packet_sha256: 'a'.repeat(64),
  prompt_sha256: 'b'.repeat(64),
  image_sha256s: ['c'.repeat(64)],
  ...overrides,
});
const validFinal = () => Buffer.from(JSON.stringify(validPredictionResponse()));
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const namesEqualForTest = (left, right) => (
  left.length === right.length && left.every((entry, index) => entry === right[index])
);

async function claimed(sealedRoot, { slotId = 'slot-001', opaqueId = 'opaque-a' } = {}) {
  return claimAttemptJournal({ sealedRoot, slotId, opaqueId, request: request() });
}

async function fillValid(journal) {
  await journal.appendEvents(jsonl(completedUsage()));
  await journal.appendStderr(Buffer.from('diagnostic'));
  await journal.writeFinal(validFinal());
}

async function sealCrashRecord(journal, process = { exit_code: 0 }) {
  const requestBytes = await readFile(path.join(journal.path, 'request.json'));
  const eventsBytes = await readFile(path.join(journal.path, 'events.jsonl'));
  const stderrBytes = await readFile(path.join(journal.path, 'stderr.bin'));
  let finalBytes = null;
  try {
    finalBytes = await readFile(path.join(journal.path, 'final.raw.json'));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  const normalizedProcess = {
    exit_code: Number.isInteger(process.exit_code) ? process.exit_code : null,
    timed_out: process.timed_out === true,
    spawn_failed: process.spawn_failed === true,
    local_io_before_final: process.local_io_before_final === true,
    final_sha256: typeof process.final_sha256 === 'string' ? process.final_sha256 : null,
    metadata_present: true,
  };
  const computedFinalSha = finalBytes === null ? null : digest(finalBytes);
  const classification = classifyAttemptArtifacts({
    eventsBytes,
    stderrBytes,
    finalBytes,
    finalSha256: normalizedProcess.final_sha256 ?? computedFinalSha,
    processExitCode: normalizedProcess.exit_code,
    timedOut: normalizedProcess.timed_out,
    spawnFailed: normalizedProcess.spawn_failed,
    localIoBeforeFinal: normalizedProcess.local_io_before_final,
  });
  const record = {
    version: 1,
    invocation_id: path.basename(journal.path),
    request_sha256: digest(requestBytes),
    events_sha256: digest(eventsBytes),
    stderr_sha256: digest(stderrBytes),
    final_sha256: computedFinalSha,
    process: normalizedProcess,
    classification,
  };
  await writeFile(
    path.join(journal.path, 'record.json'),
    canonicalJson(record),
    { flag: 'wx', mode: 0o600 },
  );
  return record;
}

async function copyCrashTarget(journalPath, target) {
  await mkdir(path.dirname(target), { recursive: true });
  await cp(journalPath, target, { recursive: true, preserveTimestamps: true });
}

test('claims one inflight invocation directory exclusively', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  assert.equal(journal.path, path.join(sealedRoot, 'inflight', 'slot-001', 'opaque-a'));
  await assert.rejects(claimed(sealedRoot), /exist|claim|exclusive/i);

  const container = await root();
  const realSealedRoot = path.join(container, 'real-sealed-root');
  const linkedSealedRoot = path.join(container, 'linked-sealed-root');
  await mkdir(realSealedRoot);
  await symlink(realSealedRoot, linkedSealedRoot);
  await assert.rejects(claimed(linkedSealedRoot), /symlink|parent|root|directory/i);
});

test('writes only the exact sanitized request schema as mode 0600', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  const stored = JSON.parse(await readFile(path.join(journal.path, 'request.json'), 'utf8'));
  assert.deepEqual(stored, request());
  assert.deepEqual(Object.keys(stored), ['image_sha256s', 'packet_sha256', 'prompt_sha256', 'slot_ordinal', 'version']);
  assert.equal((await stat(path.join(journal.path, 'request.json'))).mode & 0o777, 0o600);
  await assert.rejects(claimAttemptJournal({ sealedRoot, slotId: 'slot-002', opaqueId: 'opaque-b', request: { ...request(), prompt_text: 'secret' } }), /request|keys|sanitized/i);
});

test('streams raw events and stderr with fsync and writes final bytes exclusively', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await journal.appendEvents(Buffer.from('one\n'));
  await journal.appendEvents(Buffer.from('two\n'));
  await journal.appendStderr(Buffer.from([0, 1]));
  await journal.writeFinal(validFinal());
  assert.equal((await readFile(path.join(journal.path, 'events.jsonl'), 'utf8')), 'one\ntwo\n');
  assert.deepEqual(await readFile(path.join(journal.path, 'stderr.bin')), Buffer.from([0, 1]));
  assert.deepEqual(await readFile(path.join(journal.path, 'final.raw.json')), validFinal());
  for (const name of ['events.jsonl', 'stderr.bin', 'final.raw.json']) assert.equal((await stat(path.join(journal.path, name))).mode & 0o777, 0o600);
  await assert.rejects(journal.writeFinal(validFinal()), /exist|final/i);

  const replacementRoot = await root();
  const replacementJournal = await claimed(replacementRoot);
  const movedJournal = `${replacementJournal.path}-moved`;
  await rename(replacementJournal.path, movedJournal);
  await mkdir(replacementJournal.path);
  await writeFile(path.join(replacementJournal.path, 'events.jsonl'), '');
  await assert.rejects(
    replacementJournal.appendEvents(Buffer.from('redirected')),
    /changed|identity|journal|directory|pinned/i,
  );
});

test('classifies and atomically promotes a valid final to attempt-001', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await fillValid(journal);
  const record = await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 0, timed_out: false, spawn_failed: false } });
  assert.equal(record.classification.classification, 'valid_final');
  assert.equal(record.path, path.join(sealedRoot, 'slot-001', 'attempt-001'));
  await assert.rejects(stat(journal.path), /ENOENT/);
});

test('a structural tool event overrides and promotes even with a valid final', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await journal.appendEvents(jsonl({ type: 'tool.requested', tool_name: 'shell' }));
  await journal.writeFinal(validFinal());
  const record = await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 0 } });
  assert.deepEqual([record.classification.classification, record.classification.code], ['terminal_invalid', 'attempted_tool_use']);
});

test('recovery promotes open or record-bearing inflight journals and reconciles an identical published target', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await fillValid(journal);
  const recovered = await recoverAttemptJournals({ sealedRoot, slotId: 'slot-001' });
  assert.equal(recovered[0].classification.classification, 'valid_final');
  assert.equal(recovered[0].process_metadata_present, false);

  const sealedCrashRoot = await root();
  const sealedCrashJournal = await claimed(sealedCrashRoot);
  await fillValid(sealedCrashJournal);
  await sealCrashRecord(sealedCrashJournal, { exit_code: 0 });
  const recoveredSealed = await recoverAttemptJournals({
    sealedRoot: sealedCrashRoot,
    slotId: 'slot-001',
  });
  assert.equal(recoveredSealed[0].path, path.join(sealedCrashRoot, 'slot-001', 'attempt-001'));
  assert.equal(recoveredSealed[0].process_metadata_present, true);
  await assert.rejects(stat(sealedCrashJournal.path), /ENOENT/);

  const duplicateRoot = await root();
  const duplicateJournal = await claimed(duplicateRoot);
  await fillValid(duplicateJournal);
  await sealCrashRecord(duplicateJournal, { exit_code: 0 });
  const publishedTarget = path.join(duplicateRoot, 'slot-001', 'attempt-001');
  await copyCrashTarget(duplicateJournal.path, publishedTarget);
  const reconciled = await recoverAttemptJournals({
    sealedRoot: duplicateRoot,
    slotId: 'slot-001',
  });
  assert.equal(reconciled[0].path, publishedTarget);
  assert.deepEqual(await readdir(path.join(duplicateRoot, 'slot-001')), ['attempt-001']);
  await assert.rejects(stat(duplicateJournal.path), /ENOENT/);
});

test('recovery turns only an incomplete no-valid-final journal into local_io_before_final', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await journal.appendEvents(Buffer.alloc(0));
  const recovered = await recoverAttemptJournals({ sealedRoot, slotId: 'slot-001' });
  assert.deepEqual([recovered[0].classification.classification, recovered[0].classification.code], ['infrastructure_retry', 'local_io_before_final']);

  {
    const invalid = validPredictionResponse();
    invalid.predictions[0].rank = 2;
    const cases = [
      ['empty', Buffer.alloc(0)],
      ['schema', Buffer.from(JSON.stringify(invalid))],
      ['corrupt', Buffer.from('{"truncated":')],
    ];
    for (const [label, bytes] of cases) {
      const caseRoot = await root();
      const caseJournal = await claimed(caseRoot, { opaqueId: `opaque-${label}` });
      await caseJournal.writeFinal(bytes);
      const [caseRecovered] = await recoverAttemptJournals({
        sealedRoot: caseRoot,
        slotId: 'slot-001',
      });
      assert.deepEqual(
        [caseRecovered.classification.classification, caseRecovered.classification.code],
        ['infrastructure_retry', 'local_io_before_final'],
      );
    }

    const toolRoot = await root();
    const toolJournal = await claimed(toolRoot, { opaqueId: 'opaque-tool' });
    await toolJournal.appendEvents(jsonl({
      type: 'item.completed',
      item: { type: 'command_execution' },
    }));
    await toolJournal.writeFinal(Buffer.alloc(0));
    const [toolRecovered] = await recoverAttemptJournals({
      sealedRoot: toolRoot,
      slotId: 'slot-001',
    });
    assert.deepEqual(
      [toolRecovered.classification.classification, toolRecovered.classification.code],
      ['terminal_invalid', 'attempted_tool_use'],
    );
  }

  {
    const distinctRoot = await root();
    const first = await claimed(distinctRoot, { opaqueId: 'opaque-first' });
    await first.appendEvents(jsonl(structuralError('rate_limit')));
    await finalizeAttemptJournal({
      sealedRoot: distinctRoot,
      slotId: 'slot-001',
      journalPath: first.path,
      process: { exit_code: 1 },
    });

    const second = await claimed(distinctRoot, { opaqueId: 'opaque-second' });
    await second.appendEvents(jsonl(structuralError('rate_limit')));
    await sealCrashRecord(second, { exit_code: 1 });
    const [recoveredSecond] = await recoverAttemptJournals({
      sealedRoot: distinctRoot,
      slotId: 'slot-001',
    });
    assert.equal(
      recoveredSecond.path,
      path.join(distinctRoot, 'slot-001', 'attempt-002'),
    );
    assert.deepEqual(
      (await readdir(path.join(distinctRoot, 'slot-001'))).sort(),
      ['attempt-001', 'attempt-002'],
    );
    const records = await Promise.all(
      ['attempt-001', 'attempt-002'].map(async (name) => JSON.parse(
        await readFile(path.join(distinctRoot, 'slot-001', name, 'record.json'), 'utf8'),
      )),
    );
    assert.deepEqual(
      records.map((record) => record.invocation_id),
      ['opaque-first', 'opaque-second'],
    );
  }
});

test('fatal auth environment results move unchanged and consume no attempt ordinal', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await journal.appendEvents(jsonl(structuralError('authentication_error')));
  const before = (await readdir(journal.path)).sort();
  const record = await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 1 } });
  assert.equal(record.classification.classification, 'fatal_environment');
  assert.equal(record.path, path.join(sealedRoot, 'environment-stops', 'slot-001', 'opaque-a'));
  assert.equal((await readdir(path.join(sealedRoot, 'slot-001')).catch(() => [])).length, 0);
  assert.deepEqual((await readdir(record.path)).filter((name) => name !== 'record.json').sort(), before);

  const stderrJournal = await claimed(sealedRoot, { opaqueId: 'opaque-b' });
  await stderrJournal.appendStderr(
    Buffer.from('strict config error: unknown configuration key features.invalid'),
  );
  const stderrRecord = await finalizeAttemptJournal({
    sealedRoot,
    slotId: 'slot-001',
    journalPath: stderrJournal.path,
    process: { exit_code: 1 },
  });
  assert.deepEqual(
    [stderrRecord.classification.classification, stderrRecord.classification.code],
    ['fatal_environment', 'local_configuration'],
  );
  assert.equal((await readdir(path.join(sealedRoot, 'slot-001')).catch(() => [])).length, 0);

  const fatalCrashRoot = await root();
  const fatalCrashJournal = await claimed(fatalCrashRoot, { opaqueId: 'opaque-c' });
  await fatalCrashJournal.appendEvents(jsonl(structuralError('authentication_error')));
  await sealCrashRecord(fatalCrashJournal, { exit_code: 1 });
  const recoveredFatal = await recoverAttemptJournals({
    sealedRoot: fatalCrashRoot,
    slotId: 'slot-001',
  });
  assert.equal(
    recoveredFatal[0].path,
    path.join(fatalCrashRoot, 'environment-stops', 'slot-001', 'opaque-c'),
  );
  assert.equal(recoveredFatal[0].classification.classification, 'fatal_environment');
  assert.equal((await readdir(path.join(fatalCrashRoot, 'slot-001')).catch(() => [])).length, 0);

  const duplicateFatalRoot = await root();
  const duplicateFatalJournal = await claimed(duplicateFatalRoot, { opaqueId: 'opaque-d' });
  await duplicateFatalJournal.appendEvents(jsonl(structuralError('authentication_error')));
  await sealCrashRecord(duplicateFatalJournal, { exit_code: 1 });
  const publishedFatal = path.join(
    duplicateFatalRoot,
    'environment-stops',
    'slot-001',
    'opaque-d',
  );
  await copyCrashTarget(duplicateFatalJournal.path, publishedFatal);
  const reconciledFatal = await recoverAttemptJournals({
    sealedRoot: duplicateFatalRoot,
    slotId: 'slot-001',
  });
  assert.equal(reconciledFatal[0].path, publishedFatal);
  assert.deepEqual(
    await readdir(path.join(duplicateFatalRoot, 'environment-stops', 'slot-001')),
    ['opaque-d'],
  );
  await assert.rejects(stat(duplicateFatalJournal.path), /ENOENT/);
});

test('nonfatal journals promote sequentially to the next immutable attempt ordinal', async () => {
  const sealedRoot = await root();
  for (const opaqueId of ['opaque-a', 'opaque-b']) {
    const journal = await claimed(sealedRoot, { opaqueId });
    await journal.appendEvents(jsonl(structuralError('rate_limit')));
    await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 1 } });
  }
  assert.deepEqual((await readdir(path.join(sealedRoot, 'slot-001'))).sort(), ['attempt-001', 'attempt-002']);

  const gapRoot = await root();
  await mkdir(path.join(gapRoot, 'slot-001', 'attempt-002'), { recursive: true });
  const gapJournal = await claimed(gapRoot);
  await gapJournal.appendEvents(jsonl(structuralError('rate_limit')));
  await assert.rejects(
    finalizeAttemptJournal({ sealedRoot: gapRoot, slotId: 'slot-001', journalPath: gapJournal.path, process: { exit_code: 1 } }),
    /contiguous|gap|ordinal|inventory/i,
  );

  const untrustedRoot = await root();
  await mkdir(path.join(untrustedRoot, 'slot-001'), { recursive: true });
  await writeFile(path.join(untrustedRoot, 'slot-001', '.DS_Store'), 'untrusted');
  const untrustedJournal = await claimed(untrustedRoot);
  await untrustedJournal.appendEvents(jsonl(structuralError('rate_limit')));
  await assert.rejects(
    finalizeAttemptJournal({ sealedRoot: untrustedRoot, slotId: 'slot-001', journalPath: untrustedJournal.path, process: { exit_code: 1 } }),
    /unexpected|untrusted|entry|inventory/i,
  );
});

test('never overwrites an existing attempt promotion target', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await fillValid(journal);
  const slot = path.join(sealedRoot, 'slot-001');
  await import('node:fs/promises').then(async ({ mkdir }) => {
    for (const ordinal of ['001', '002', '003']) await mkdir(path.join(slot, `attempt-${ordinal}`), { recursive: true });
  });
  await assert.rejects(finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 0 } }), /limit|immutable|attempt/i);
  assert.ok((await stat(journal.path)).isDirectory());

  const raceRoot = await root();
  const raceJournal = await claimed(raceRoot);
  await fillValid(raceJournal);
  const racedTarget = path.join(raceRoot, 'slot-001', 'attempt-001');
  let injected = false;
  let settled = false;
  const racer = (async () => {
    while (!settled) {
      try {
        await mkdir(racedTarget);
        injected = true;
        return;
      } catch (error) {
        if (error?.code === 'EEXIST') return;
        if (error?.code !== 'ENOENT') throw error;
      }
      await new Promise(setImmediate);
    }
  })();
  let promotion;
  let promotionError;
  try {
    promotion = await finalizeAttemptJournal({
      sealedRoot: raceRoot,
      slotId: 'slot-001',
      journalPath: raceJournal.path,
      process: { exit_code: 0 },
    });
  } catch (error) {
    promotionError = error;
  } finally {
    settled = true;
    await racer;
  }
  if (injected) {
    assert.match(
      promotionError?.message ?? '',
      /exist|no-replace|promotion|target|immutable|inventory|attempt/i,
    );
    assert.deepEqual(await readdir(racedTarget), []);
  } else {
    assert.equal(promotion?.path, racedTarget);
    assert.equal(promotionError, undefined);
  }

  const atomicRoot = await root();
  const atomicJournal = await claimed(atomicRoot);
  await fillValid(atomicJournal);
  const atomicTarget = path.join(atomicRoot, 'slot-001', 'attempt-001');
  const completeNames = [
    'events.jsonl',
    'final.raw.json',
    'record.json',
    'request.json',
    'stderr.bin',
  ];
  let atomicSettled = false;
  let partialObserved = false;
  const observer = (async () => {
    while (!atomicSettled) {
      try {
        const names = (await readdir(atomicTarget)).sort();
        if (!namesEqualForTest(names, completeNames)) partialObserved = true;
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
      await new Promise(setImmediate);
    }
  })();
  try {
    await finalizeAttemptJournal({
      sealedRoot: atomicRoot,
      slotId: 'slot-001',
      journalPath: atomicJournal.path,
      process: { exit_code: 0 },
    });
  } finally {
    atomicSettled = true;
    await observer;
  }
  assert.equal(partialObserved, false);
});

test('verifyAttemptRecord re-derives hashes and classification without writing', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await fillValid(journal);
  const promoted = await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 0 } });
  const recordPath = path.join(promoted.path, 'record.json');
  const before = (await stat(recordPath, { bigint: true })).mtimeNs;
  const verified = await verifyAttemptRecord(promoted.path);
  const after = (await stat(recordPath, { bigint: true })).mtimeNs;
  assert.equal(verified.classification.classification, 'valid_final');
  assert.equal(after, before);
});

test('verifyAttemptRecord rejects hash or classification drift', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await fillValid(journal);
  const promoted = await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 0 } });
  await writeFile(path.join(promoted.path, 'extra.bin'), 'untrusted');
  await assert.rejects(verifyAttemptRecord(promoted.path), /extra|unexpected|inventory|artifact/i);

  const driftRoot = await root();
  const driftJournal = await claimed(driftRoot);
  await fillValid(driftJournal);
  const drifted = await finalizeAttemptJournal({ sealedRoot: driftRoot, slotId: 'slot-001', journalPath: driftJournal.path, process: { exit_code: 0 } });
  await writeFile(path.join(drifted.path, 'stderr.bin'), 'tampered');
  await assert.rejects(verifyAttemptRecord(drifted.path), /hash|drift|verify/i);
});

test('a declared final hash mismatch promotes as transport_artifact_corrupt', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await fillValid(journal);
  const record = await finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 0, final_sha256: '0'.repeat(64) } });
  assert.deepEqual([record.classification.classification, record.classification.code], ['infrastructure_retry', 'transport_artifact_corrupt']);
});

test('rejects symlinked journal artifacts during finalization and recovery', async () => {
  const sealedRoot = await root();
  const journal = await claimed(sealedRoot);
  await rm(path.join(journal.path, 'events.jsonl'));
  await symlink('/dev/null', path.join(journal.path, 'events.jsonl'));
  await assert.rejects(finalizeAttemptJournal({ sealedRoot, slotId: 'slot-001', journalPath: journal.path, process: { exit_code: 1 } }), /symlink|regular/i);

  const extraRoot = await root();
  const extraJournal = await claimed(extraRoot);
  await writeFile(path.join(extraJournal.path, 'extra.bin'), 'untrusted');
  await assert.rejects(
    finalizeAttemptJournal({ sealedRoot: extraRoot, slotId: 'slot-001', journalPath: extraJournal.path, process: { exit_code: 1 } }),
    /extra|unexpected|inventory|artifact/i,
  );

  const aliasRoot = await root();
  const aliasJournal = await claimed(aliasRoot);
  await rm(path.join(aliasJournal.path, 'stderr.bin'));
  await link(path.join(aliasJournal.path, 'events.jsonl'), path.join(aliasJournal.path, 'stderr.bin'));
  await assert.rejects(
    finalizeAttemptJournal({ sealedRoot: aliasRoot, slotId: 'slot-001', journalPath: aliasJournal.path, process: { exit_code: 1 } }),
    /hardlink|link count|inode|alias/i,
  );

  const escapeRoot = await root();
  const outsideRoot = await root();
  const escapedJournal = await claimed(escapeRoot);
  const inflightSlot = path.join(escapeRoot, 'inflight', 'slot-001');
  const outsideSlot = path.join(outsideRoot, 'moved-slot');
  await rename(inflightSlot, outsideSlot);
  await symlink(outsideSlot, inflightSlot);
  await assert.rejects(
    finalizeAttemptJournal({
      sealedRoot: escapeRoot,
      slotId: 'slot-001',
      journalPath: escapedJournal.path,
      process: { exit_code: 1 },
    }),
    /outside|escape|symlink|parent|pinned/i,
  );
});
