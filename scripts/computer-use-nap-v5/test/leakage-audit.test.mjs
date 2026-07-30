import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  cp, link, mkdtemp, mkdir, readFile, realpath, rename, symlink, unlink, writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { deflateSync } from 'node:zlib';

import { CONDITIONS } from '../config.mjs';
import { writeContextBundle } from '../lib/contexts.mjs';
import * as auditor from '../lib/leakage-audit.mjs';
import { renderFrozenPacket, renderPredictorPrompt } from '../lib/packet-renderer.mjs';
import {
  contextOptions, makeTask5Fixture, sha256Bytes, syntheticPng,
} from './task5-fixtures.mjs';

const execFileAsync = promisify(execFile);
const [STATE_CONDITION, HISTORY_CONDITION] = CONDITIONS;
const encodeCanary = (value) => `b64u:${Buffer.from(value, 'utf8').toString('base64url')}`;
const BASE_CANARY = encodeCanary('CANARY-TRUSTED-COMPLETE-BASELINE-7c91');
const BASE_FORBIDDEN_KEYS = Object.freeze([
  'event_id',
  'recording_id',
  'target_id',
  'slot_id',
  'chronology_index',
  'accepted_variants',
  'ground_truth_target',
  'evidence_provenance',
  'review_provenance',
  'reviewer_note',
  'final_disposition',
  'prediction',
  'outcome',
]);

const baseRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'nap-v5-audit-base-')));
const baseFixture = await makeTask5Fixture(baseRoot);
const baseExpected = new Map();
for (const condition of CONDITIONS) {
  const contextDirectory = path.join(baseRoot, 'contexts', condition);
  await writeContextBundle(contextOptions(baseFixture, {
    condition,
    outputDirectory: contextDirectory,
    evidenceRoot: baseFixture.evidenceRoot,
  }));
  await renderFrozenPacket({
    condition,
    contextDirectory,
    outputDirectory: path.join(baseRoot, 'packets', condition),
  });
  const contextBytes = await readFile(path.join(contextDirectory, 'context.json'));
  const packet = JSON.parse(await readFile(path.join(baseRoot, 'packets', condition, 'packet.json'), 'utf8'));
  baseExpected.set(condition, {
    context_sha256: sha256Bytes(contextBytes),
    ordered_image_sha256: packet.images.map((entry) => entry.sha256),
    forbidden_canaries: [BASE_CANARY],
    forbidden_json_keys: [...BASE_FORBIDDEN_KEYS],
  });
}

async function freshPair(label) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), `nap-v5-audit-${label}-`)));
  await cp(path.join(baseRoot, 'contexts'), path.join(root, 'contexts'), { recursive: true });
  await cp(path.join(baseRoot, 'packets'), path.join(root, 'packets'), { recursive: true });
  return {
    root,
    options: (condition, forbiddenCanaries = [], expectedInventory = null) => ({
      condition,
      contextDirectory: path.join(root, 'contexts', condition),
      packetDirectory: path.join(root, 'packets', condition),
      expectedInventory: expectedInventory ?? {
        ...baseExpected.get(condition),
        ordered_image_sha256: [...baseExpected.get(condition).ordered_image_sha256],
        forbidden_canaries: [BASE_CANARY, ...forbiddenCanaries],
        forbidden_json_keys: [...BASE_FORBIDDEN_KEYS],
      },
    }),
  };
}

async function mutateJson(filename, mutation) {
  const value = JSON.parse(await readFile(filename, 'utf8'));
  mutation(value);
  await writeFile(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) === 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function insertBeforeIend(png, inserted) {
  return Buffer.concat([png.subarray(0, png.length - 12), inserted, png.subarray(png.length - 12)]);
}

async function bindStateImage(pair, png) {
  const digest = sha256Bytes(png);
  const contextFile = path.join(pair.root, 'contexts', STATE_CONDITION, 'context.json');
  const packetFile = path.join(pair.root, 'packets', STATE_CONDITION, 'packet.json');
  await writeFile(path.join(pair.root, 'contexts', STATE_CONDITION, 'current.png'), png);
  await writeFile(path.join(pair.root, 'packets', STATE_CONDITION, 'image-001.png'), png);
  await mutateJson(contextFile, (context) => {
    context.current.image_sha256 = digest;
  });
  const contextSha256 = sha256Bytes(await readFile(contextFile));
  await mutateJson(packetFile, (packet) => {
    packet.context_sha256 = contextSha256;
    packet.images[0].sha256 = digest;
  });
  return {
    context_sha256: contextSha256,
    ordered_image_sha256: [digest],
    forbidden_canaries: [BASE_CANARY],
    forbidden_json_keys: [...BASE_FORBIDDEN_KEYS],
  };
}

test('exports only the independent auditor and accepts clean state/history trees', async () => {
  assert.deepEqual(Object.keys(auditor), ['auditPredictorSafeTree']);
  const pair = await freshPair('clean');
  assert.equal((await auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION))).ok, true);
  assert.equal((await auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION))).ok, true);
  const emptyCanaries = pair.options(STATE_CONDITION);
  emptyCanaries.expectedInventory.forbidden_canaries = [];
  await assert.rejects(auditor.auditPredictorSafeTree(emptyCanaries), /canar|empty|complete/i);
  const nonNormalized = pair.options(STATE_CONDITION);
  nonNormalized.expectedInventory.forbidden_canaries = ['ＣＡＮＡＲＹ'];
  await assert.rejects(auditor.auditPredictorSafeTree(nonNormalized), /encoded|canar|base64/i);
  const missingForbiddenKeys = pair.options(STATE_CONDITION);
  missingForbiddenKeys.expectedInventory.forbidden_json_keys = [];
  await assert.rejects(
    auditor.auditPredictorSafeTree(missingForbiddenKeys),
    /forbidden.*key|key.*empty|complete/i,
  );
});

test('catches unique current-label and future-label evaluator canaries', async () => {
  const pair = await freshPair('labels');
  const canaries = [
    'CANARY-CURRENT-LABEL-9ef1', 'CANARY-FUTURE-LABEL-a218',
    'CANARY-POST-ACTION-HASH-b329', 'CANARY-GROUND-TRUTH-c43a',
  ].map(encodeCanary);
  await mutateJson(path.join(pair.root, 'contexts', HISTORY_CONDITION, 'context.json'), (value) => {
    value.current_label = canaries[0];
    value.future_label = canaries[1];
    value.post_action_hash = canaries[2];
    value.ground_truth_target = canaries[3];
  });
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION, canaries)), /canary|forbidden/i);
  const escapedPair = await freshPair('decoded-escaped');
  const escapedCanary = encodeCanary('CANARY-"QUOTED\\BACKSLASH-8da2');
  await mutateJson(path.join(escapedPair.root, 'contexts', HISTORY_CONDITION, 'context.json'), (value) => {
    value.history[0].app = escapedCanary;
  });
  await assert.rejects(
    auditor.auditPredictorSafeTree(escapedPair.options(HISTORY_CONDITION, [escapedCanary])),
    /canary|forbidden/i,
  );
  const racePair = await freshPair('canary-array-toctou');
  const raceCanary = encodeCanary('CANARY-CALLER-MUTATION-TOCTOU-49f3');
  const raceContextFile = path.join(racePair.root, 'contexts', HISTORY_CONDITION, 'context.json');
  const racePacketFile = path.join(racePair.root, 'packets', HISTORY_CONDITION, 'packet.json');
  const racePromptFile = path.join(racePair.root, 'packets', HISTORY_CONDITION, 'prompt.txt');
  const raceContext = JSON.parse(await readFile(raceContextFile, 'utf8'));
  raceContext.history[0].app = raceCanary;
  const raceContextBytes = Buffer.from(`${JSON.stringify(raceContext, null, 2)}\n`);
  await writeFile(raceContextFile, raceContextBytes);
  const racePrompt = renderPredictorPrompt(HISTORY_CONDITION, raceContext);
  await writeFile(racePromptFile, racePrompt);
  await mutateJson(racePacketFile, (packet) => {
    packet.context_sha256 = sha256Bytes(raceContextBytes);
    packet.prompt_text = racePrompt;
  });
  const raceExpected = {
    context_sha256: sha256Bytes(raceContextBytes),
    ordered_image_sha256: [...baseExpected.get(HISTORY_CONDITION).ordered_image_sha256],
    forbidden_canaries: [raceCanary],
    forbidden_json_keys: [...BASE_FORBIDDEN_KEYS],
  };
  const inFlight = auditor.auditPredictorSafeTree(
    racePair.options(HISTORY_CONDITION, [], raceExpected),
  );
  raceExpected.forbidden_canaries.length = 0;
  await assert.rejects(inFlight, /canary|forbidden/i);
});

test('catches unique prediction and outcome evaluator canaries', async () => {
  const pair = await freshPair('outcomes');
  const canaries = [
    'CANARY-PREDICTION-4b92',
    'CANARY-OUTCOME-7da3',
  ].map(encodeCanary);
  await mutateJson(path.join(pair.root, 'packets', HISTORY_CONDITION, 'packet.json'), (value) => {
    value.prediction = canaries[0];
    value.outcome = canaries[1];
  });
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION, canaries)), /canary|forbidden/i);
});

test('catches unique source-path and evidence-provenance evaluator canaries', async () => {
  const pair = await freshPair('provenance');
  const canaries = [
    'CANARY-SOURCE-PATH-10c4',
    'CANARY-EVIDENCE-PROVENANCE-6ef5',
    'CANARY-SOURCE-FILENAME-70a6',
  ].map(encodeCanary);
  await mutateJson(path.join(pair.root, 'contexts', HISTORY_CONDITION, 'context.json'), (value) => {
    value.source_path = canaries[0];
    value.evidence_provenance = canaries[1];
    value.source_filename = canaries[2];
  });
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION, canaries)), /canary|forbidden/i);
});

test('catches unique recording, event, target, and slot ID evaluator canaries', async () => {
  const pair = await freshPair('ids');
  const canaries = [
    'CANARY-RECORDING-ID-b161', 'CANARY-EVENT-ID-c272',
    'CANARY-TARGET-ID-d383', 'CANARY-SLOT-ID-e494', 'CANARY-CHRONOLOGY-INDEX-f5a5',
  ].map(encodeCanary);
  await mutateJson(path.join(pair.root, 'packets', STATE_CONDITION, 'packet.json'), (value) => {
    [
      value.recording_id,
      value.event_id,
      value.target_id,
      value.slot_id,
      value.chronology_index,
    ] = canaries;
  });
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION, canaries)), /canary|forbidden/i);
});

test('catches unique aliases, roles, and evidence-disposition evaluator canaries', async () => {
  const pair = await freshPair('roles');
  const canaries = [
    'CANARY-ALIAS-06b6',
    'CANARY-ROLE-17c7',
    'CANARY-DISPOSITION-28d8',
    'CANARY-EVIDENCE-DECISION-39e9',
  ].map(encodeCanary);
  await mutateJson(path.join(pair.root, 'contexts', HISTORY_CONDITION, 'context.json'), (value) => {
    value.aliases = [canaries[0]];
    value.role = canaries[1];
    value.evidence_disposition = canaries[2];
    value.evidence_decision = canaries[3];
  });
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION, canaries)), /canary|forbidden/i);
});

test('raw-byte search catches a unique prompt-text evaluator canary', async () => {
  const pair = await freshPair('prompt');
  const canary = encodeCanary('CANARY-PROMPT-TEXT-28d8');
  await writeFile(path.join(pair.root, 'packets', STATE_CONDITION, 'prompt.txt'), `${canary}\n`);
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION, [canary])), /canary|forbidden/i);
});

test('raw-name search enforces neutral fixed names and catches a unique filename canary', async () => {
  const pair = await freshPair('name');
  const canary = encodeCanary('CANARY-FILENAME-39e9');
  await rename(
    path.join(pair.root, 'packets', HISTORY_CONDITION, 'image-001.png'),
    path.join(pair.root, 'packets', HISTORY_CONDITION, `${canary}.png`),
  );
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION, [canary])), /canary|filename|name/i);
});

test('independent PNG parser rejects ancillary metadata carrying a unique canary', async () => {
  const pair = await freshPair('metadata');
  const canary = encodeCanary('CANARY-PNG-METADATA-4afa');
  const filename = path.join(pair.root, 'packets', HISTORY_CONDITION, 'image-001.png');
  const png = await readFile(filename);
  await writeFile(filename, insertBeforeIend(png, chunk('tEXt', Buffer.from(`Comment\0${canary}`))));
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION, [canary])), /canary|ancillary|metadata|png/i);
});

test('independent PNG parser rejects invalid critical chunks, CRC corruption, and trailing bytes', async () => {
  for (const [label, mutate] of [
    ['critical', (png) => insertBeforeIend(png, chunk('ABCD', Buffer.alloc(0)))],
    ['crc', (png) => { const copy = Buffer.from(png); copy[copy.length - 1] ^= 0xff; return copy; }],
    ['trailing', (png) => Buffer.concat([png, Buffer.from('TRAILING')])],
  ]) {
    const pair = await freshPair(`invalid-${label}`);
    const filename = path.join(pair.root, 'packets', STATE_CONDITION, 'image-001.png');
    await writeFile(filename, mutate(await readFile(filename)));
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /png|critical|crc|trailing|hash/i);
  }
  for (const [label, png, expectation] of [
    ['truecolor-plte', syntheticPng(3, { palette: Buffer.from([0, 0, 0, 255, 255, 255]) }), null],
    ['indexed-plte', syntheticPng(1, { colorType: 3, palette: Buffer.from([0, 0, 0, 255, 255, 255]) }), null],
    ['indexed-filtered-out-of-palette', syntheticPng(1, {
      colorType: 3,
      palette: Buffer.from([0, 0, 0]),
      filterType: 1,
    }), /palette|index|plte/i],
    ['indexed-missing-plte', syntheticPng(1, { colorType: 3 }), /plte|palette|required/i],
    ['illegal-grayscale-plte', syntheticPng(1, { colorType: 0, palette: Buffer.from([0, 0, 0]) }), /plte|palette|forbidden/i],
    ['wrong-dimensions', syntheticPng(1, { width: 1, height: 1 }), /1920|1080|dimension/i],
    ['residual-zlib', syntheticPng(1, { compressedSuffix: deflateSync(Buffer.from([0])) }), /zlib|residual|compressed|stream/i],
    ['inflate-bomb', syntheticPng(1, { rawSuffix: Buffer.alloc(1) }), /bomb|output|scanline|inflate|length/i],
  ]) {
    const pair = await freshPair(`png-${label}`);
    const expected = await bindStateImage(pair, png);
    const audited = auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION, [], expected));
    if (expectation === null) assert.equal((await audited).ok, true);
    else await assert.rejects(audited, expectation);
  }
});

test('rejects symlinks, special files, extra entries, and missing required files', async () => {
  {
    const pair = await freshPair('symlink');
    const target = path.join(pair.root, 'packets', STATE_CONDITION, 'image-001.png');
    const moved = path.join(pair.root, 'image-source.png');
    await rename(target, moved);
    await symlink(moved, target);
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /symlink|regular/i);
  }
  {
    const pair = await freshPair('special');
    const target = path.join(pair.root, 'packets', STATE_CONDITION, 'image-001.png');
    await unlink(target);
    await execFileAsync('mkfifo', [target]);
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /special|regular|file/i);
  }
  {
    const pair = await freshPair('extra');
    await mkdir(path.join(pair.root, 'packets', STATE_CONDITION, 'extra'));
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /extra|unexpected|entry/i);
  }
  {
    const pair = await freshPair('missing');
    await rename(
      path.join(pair.root, 'packets', STATE_CONDITION, 'prompt.txt'),
      path.join(pair.root, 'missing-prompt.txt'),
    );
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /missing|unexpected|entry/i);
  }
  {
    const pair = await freshPair('hardlink');
    const target = path.join(pair.root, 'packets', STATE_CONDITION, 'image-001.png');
    await link(target, path.join(pair.root, 'external-hardlink.png'));
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /hardlink|link count|nlink/i);
  }
  {
    const pair = await freshPair('inode-alias');
    const first = path.join(pair.root, 'packets', HISTORY_CONDITION, 'image-001.png');
    const second = path.join(pair.root, 'packets', HISTORY_CONDITION, 'image-002.png');
    await unlink(second);
    await link(first, second);
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION)), /hardlink|inode|alias|link count|nlink/i);
  }
});

test('rejects context, prompt, image hash, attachment order, and byte-copy mismatches', async () => {
  for (const [label, mutate] of [
    ['context-hash', (packet) => { packet.context_sha256 = '0'.repeat(64); }],
    ['image-hash', (packet) => { packet.images[0].sha256 = '1'.repeat(64); }],
    ['order', (packet) => { packet.images[0].attachment_ordinal = 2; }],
  ]) {
    const pair = await freshPair(`mismatch-${label}`);
    await mutateJson(path.join(pair.root, 'packets', HISTORY_CONDITION, 'packet.json'), mutate);
    await assert.rejects(auditor.auditPredictorSafeTree(pair.options(HISTORY_CONDITION)), /hash|order|ordinal|context|inventory/i);
  }
  const pair = await freshPair('byte-copy');
  const image = path.join(pair.root, 'packets', STATE_CONDITION, 'image-001.png');
  const bytes = await readFile(image);
  const changed = Buffer.from(bytes);
  changed[changed.length - 8] ^= 0x01;
  await writeFile(image, changed);
  await assert.rejects(auditor.auditPredictorSafeTree(pair.options(STATE_CONDITION)), /hash|bytes|png|crc/i);
  const grammarPair = await freshPair('auditor-grammar');
  await mutateJson(path.join(grammarPair.root, 'contexts', HISTORY_CONDITION, 'context.json'), (context) => {
    context.history[0].action_type = 'delete';
  });
  await assert.rejects(
    auditor.auditPredictorSafeTree(grammarPair.options(HISTORY_CONDITION)),
    /action.type|focus|activate|history grammar/i,
  );
  const trustedPair = await freshPair('trusted-inventory');
  const contextFile = path.join(trustedPair.root, 'contexts', HISTORY_CONDITION, 'context.json');
  const packetFile = path.join(trustedPair.root, 'packets', HISTORY_CONDITION, 'packet.json');
  const promptFile = path.join(trustedPair.root, 'packets', HISTORY_CONDITION, 'prompt.txt');
  const context = JSON.parse(await readFile(contextFile, 'utf8'));
  context.history[0].app = 'Self-consistent but unauthenticated';
  await writeFile(contextFile, `${JSON.stringify(context, null, 2)}\n`);
  const prompt = renderPredictorPrompt(HISTORY_CONDITION, context);
  await writeFile(promptFile, prompt);
  await mutateJson(packetFile, (packet) => {
    packet.context_sha256 = sha256Bytes(Buffer.from(`${JSON.stringify(context, null, 2)}\n`));
    packet.prompt_text = prompt;
  });
  await assert.rejects(
    auditor.auditPredictorSafeTree(trustedPair.options(HISTORY_CONDITION)),
    /trusted|expected|context.*hash|inventory/i,
  );
  const racePair = await freshPair('snapshot-toctou');
  const raceContextPath = path.join(racePair.root, 'contexts', HISTORY_CONDITION, 'context.json');
  const cleanContextBytes = await readFile(raceContextPath);
  let racing = true;
  const audit = auditor.auditPredictorSafeTree(racePair.options(HISTORY_CONDITION));
  const replacements = (async () => {
    for (let index = 0; index < 5_000 && racing; index += 1) {
      const replacement = path.join(racePair.root, `context-replacement-${index}.json`);
      await writeFile(replacement, cleanContextBytes, { mode: 0o600 });
      await rename(replacement, raceContextPath);
      await new Promise(setImmediate);
    }
  })();
  await assert.rejects(audit, /changed|snapshot|inode|revalid|drift/i);
  racing = false;
  await replacements;
});
