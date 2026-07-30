import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { CONDITIONS, METHOD } from '../config.mjs';
import { buildTargetCatalog, buildEvaluatorManifest } from '../lib/catalog.mjs';
import { buildEligibilityLedger, selectQuantileTargets } from '../lib/eligibility.mjs';
import { canonicalJson, sha256 } from '../lib/immutable.mjs';
import { evidenceInventoryHash, makeTask4Sources } from './task4-fixtures.mjs';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

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

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const payload = Buffer.concat([typeBytes, data]);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(payload));
  return Buffer.concat([length, payload, checksum]);
}

export function syntheticPng(seed = 0, {
  width = 1920,
  height = 1080,
  colorType = 2,
  palette = null,
  filterType = 0,
  rawSuffix = Buffer.alloc(0),
  compressedSuffix = Buffer.alloc(0),
} = {}) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = colorType;
  const channels = colorType === 3 ? 1 : 3;
  const row = Buffer.alloc(1 + width * channels);
  row[0] = filterType;
  for (let column = 0; column < width; column += 1) {
    if (colorType === 3) {
      row[1 + column] = filterType === 1 && column > 0 ? 0 : seed & 1;
    } else {
      row[1 + column * 3] = seed & 0xff;
      row[2 + column * 3] = (seed * 17) & 0xff;
      row[3 + column * 3] = (seed * 31) & 0xff;
    }
  }
  const pixels = Buffer.concat([
    ...Array.from({ length: height }, () => row),
    rawSuffix,
  ]);
  const chunks = [pngChunk('IHDR', ihdr)];
  if (palette !== null) chunks.push(pngChunk('PLTE', palette));
  chunks.push(pngChunk('IDAT', Buffer.concat([deflateSync(pixels), compressedSuffix])));
  chunks.push(pngChunk('IEND', Buffer.alloc(0)));
  return Buffer.concat([
    PNG_SIGNATURE,
    ...chunks,
  ]);
}

function approvalFor(corpusSnapshot, targetSelection) {
  const targets = targetSelection.selected_event_ids.map((eventId, index) => {
    const row = corpusSnapshot.rows.find((candidate) => candidate.event_id === eventId);
    const granularity = row.target.object === null
      ? 'application'
      : row.target.subtarget === null ? 'object' : 'subtarget';
    return {
      target_id: `NAP-V5-TARGET-${String(index + 1).padStart(2, '0')}-R1`,
      target_ordinal: index + 1,
      revision: 1,
      event_id: row.event_id,
      chronology_index: row.chronology_index,
      granularity,
      canonical_target: row.target,
      accepted_variants: [row.target],
    };
  });
  const payload = {
    version: 1,
    source_hashes: {
      corpus_sha256: targetSelection.source_hashes.corpus_sha256,
      target_selection_sha256: sha256(canonicalJson(targetSelection)),
    },
    targets,
  };
  return {
    approved_by: 'dylan',
    basis: 'blanket_execution_authorization_2026-07-29',
    catalog_payload_sha256: sha256(canonicalJson(payload)),
  };
}

export async function makeTask5Fixture(root) {
  const sources = makeTask4Sources();
  const pngByEvent = new Map();
  const pngCache = [syntheticPng(1), syntheticPng(2)];
  let seed = 1;
  for (const row of sources.evidenceInventory.rows) {
    if (row.selected_frame === null) continue;
    const bytes = pngCache[seed % pngCache.length];
    seed += 1;
    const digest = sha256(bytes);
    row.selected_frame.png_sha256 = digest;
    row.selected_frame.store_relative_path = `evaluator/evidence-store/sha256/${digest.slice(0, 2)}/${digest}.png`;
    pngByEvent.set(row.event_id, bytes);
    const destination = path.join(root, row.selected_frame.store_relative_path);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, bytes);
  }
  sources.evidenceInventory.inventory_sha256 = evidenceInventoryHash(sources.evidenceInventory);
  sources.evidenceDecisions.inventory_sha256 = sources.evidenceInventory.inventory_sha256;
  const eligibilityLedger = buildEligibilityLedger(sources);
  const targetSelection = selectQuantileTargets(eligibilityLedger, sources);
  const approvalProvenance = approvalFor(sources.corpusSnapshot, targetSelection);
  const catalogOptions = {
    ...sources,
    eligibilityLedger,
    targetSelection,
    approvalProvenance,
  };
  const targetCatalog = buildTargetCatalog(catalogOptions);
  const evaluatorManifest = buildEvaluatorManifest({
    ...sources,
    eligibilityLedger,
    targetSelection,
    targetCatalog,
  });
  assert.equal(targetSelection.selected_event_ids.length, METHOD.targetCount);
  return {
    ...sources,
    eligibilityLedger,
    targetSelection,
    targetCatalog,
    evaluatorManifest,
    evidenceRoot: root,
    pngByEvent,
  };
}

export const contextOptions = (fixture, extras = {}) => ({
  condition: CONDITIONS[1],
  targetOrdinal: METHOD.targetCount,
  corpusSnapshot: fixture.corpusSnapshot,
  videoInventory: fixture.videoInventory,
  evidenceInventory: fixture.evidenceInventory,
  evidenceDecisions: fixture.evidenceDecisions,
  eligibilityLedger: fixture.eligibilityLedger,
  targetSelection: fixture.targetSelection,
  targetCatalog: fixture.targetCatalog,
  evaluatorManifest: fixture.evaluatorManifest,
  ...extras,
});

export function sha256Bytes(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}
