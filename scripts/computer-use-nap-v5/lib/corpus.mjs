import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile as readFileFromDisk } from 'node:fs/promises';
import { promisify } from 'node:util';

import { CANONICAL_COMMIT, CANONICAL_LEDGER_PATH, CANONICAL_SHA256 } from '../config.mjs';
import { parseLedgerTableInternal } from './corpus-table.mjs';
import { targetGranularity } from './identity.mjs';

const execFileAsync = promisify(execFile);
const STATUSES = new Set(['accepted', 'needs_invocation', 'needs_prior_frame', 'needs_timing', 'needs_target', 'unresolved']);
const INPUTS = new Set(['pointer', 'keyboard_enter', 'keyboard_command_w', 'unknown']);
const ACTIONS = new Set(['focus', 'activate']);
const PROVENANCE_PATH = '30-projects/computer-use-nap-v4-canonical-dataset.md';
const GIT_OPTIONS = Object.freeze({ encoding: 'buffer', maxBuffer: 1024 * 1024 });

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const freeze = (value) => Object.freeze(value);
const unwrap = (value) => value.startsWith('`') && value.endsWith('`') ? value.slice(1, -1) : value;
const text = (value) => unwrap(value.trim());

function cells(line) {
  if (!line.startsWith('|') || !line.endsWith('|')) throw new Error('Ledger row must be a Markdown table row');
  const values = line.slice(1, -1).split('|').map(text);
  if (values.length !== 11) throw new Error(`Ledger row must contain exactly eleven cells; got ${values.length}`);
  return values;
}

export function parsePlayerTime(raw) {
  if (/^~\d+:[0-5]\d$/.test(raw)) return { kind: 'unresolvable', reason: 'approximate', raw };
  if (/^\d+:[0-5]\d–\d+:[0-5]\d$/.test(raw)) return { kind: 'unresolvable', reason: 'range', raw };
  if (/^after \d+:[0-5]\d$/.test(raw)) return { kind: 'unresolvable', reason: 'relative_after', raw };
  if (/^before \d+:[0-5]\d$/.test(raw)) return { kind: 'unresolvable', reason: 'relative_before', raw };
  const exact = /^(\d+):([0-5]\d)([ab])?$/.exec(raw);
  if (exact === null) throw new Error(`Unrecognized player time: ${raw}`);
  const seconds = Number(exact[1]) * 60 + Number(exact[2]);
  if (!Number.isSafeInteger(seconds) || seconds < 0) throw new Error(`Unrecognized player time: ${raw}`);
  return { kind: 'exact', seconds, sequence: exact[3] ?? null, raw };
}

export function parseDestination(raw) {
  if (raw !== raw.trim() || raw.includes('->') || (raw.includes('→') && !raw.includes(' → '))) throw new Error(`Invalid destination separator: ${raw}`);
  const components = raw.split(' → ');
  if (components.length === 0 || components.some((component) => component.length === 0 || component !== component.trim() || component.includes('→'))) throw new Error(`Invalid destination separator: ${raw}`);
  const cleaned = components.map((component) => {
    const backticks = [...component.matchAll(/`/g)].map((match) => match.index);
    const invalidQuote = backticks.length > 2 || backticks.length % 2 !== 0 || backticks.some((position, index) => {
      if (index % 2 === 0) return position !== 0 && component[position - 1] !== ' ';
      return position === backticks[index - 1] + 1 || (position !== component.length - 1 && component[position + 1] !== ' ');
    });
    if (invalidQuote) throw new Error(`Invalid destination backtick quoting: ${raw}`);
    return backticks.length === 2 ? `${component.slice(0, backticks[0])}${component.slice(backticks[0] + 1, backticks[1])}${component.slice(backticks[1] + 1)}` : component;
  });
  const target = cleaned.length === 1
    ? { app: cleaned[0], object: null, subtarget: null }
    : cleaned.length === 2
      ? { app: cleaned[0], object: cleaned[1], subtarget: null }
      : { app: cleaned[0], object: cleaned.slice(1, -1).join(' → '), subtarget: cleaned.at(-1) };
  targetGranularity(target);
  return target;
}

function parseRecording(raw) {
  const match = /^`?(\d+)`? @ (.+)$/.exec(raw);
  if (match === null) throw new Error(`Invalid recording/time cell: ${raw}`);
  return { recording_id: match[1], raw_recording_time: match[2], parsed_time: parsePlayerTime(match[2]) };
}

function validateProvenance(provenance) {
  if (provenance === null || typeof provenance !== 'object' || Array.isArray(provenance) || Object.getPrototypeOf(provenance) !== Object.prototype || Object.keys(provenance).sort().join(',') !== 'dataset_commit,dataset_path,sha256' || provenance.dataset_commit !== CANONICAL_COMMIT || provenance.dataset_path !== PROVENANCE_PATH || provenance.sha256 !== CANONICAL_SHA256) {
    throw new Error('Canonical ledger provenance is invalid');
  }
}

function parseLedger(markdown, provenance) {
  validateProvenance(provenance);
  const rows = parseLedgerTableInternal(markdown).map((line, index) => {
    const [event_id, recording, canonical_status, input_method, action_type, destination, history_value, demo_value, shortcut_value, canonical_evidence_value, context_cleanup] = cells(line);
    if (!/^BLOG-V4-\d{3}[A-Z]?$/.test(event_id)) throw new Error(`Invalid event ID: ${event_id}`);
    if (!STATUSES.has(canonical_status)) throw new Error(`Unknown canonical status: ${canonical_status}`);
    if (!INPUTS.has(input_method)) throw new Error(`Unknown input method: ${input_method}`);
    if (!ACTIONS.has(action_type)) throw new Error(`Unknown action type: ${action_type}`);
    const timing = parseRecording(recording);
    return { event_id, chronology_index: index + 1, ...timing, canonical_status, input_method, action_type, target: parseDestination(destination), history_value, demo_value, shortcut_value, canonical_evidence_value, context_cleanup };
  });
  const accepted_history = rows.filter((row) => row.canonical_status === 'accepted' && row.history_value === 'yes');
  if (rows.some((row) => row.canonical_status === 'accepted' && row.history_value !== 'yes')) throw new Error('Accepted rows must have History=yes');
  const frozenRows = rows.map((row) => freeze({ ...row, parsed_time: freeze({ ...row.parsed_time }), target: freeze({ ...row.target }) }));
  const frozenHistory = frozenRows.filter((row) => row.canonical_status === 'accepted' && row.history_value === 'yes');
  return freeze({ provenance: freeze({ ...provenance }), rows: freeze(frozenRows), accepted_history: freeze(frozenHistory) });
}

export function parseCanonicalLedger(markdownBytes, provenance) {
  const bytes = Buffer.isBuffer(markdownBytes) ? markdownBytes : Buffer.from(markdownBytes);
  if (sha256(bytes) !== CANONICAL_SHA256) throw new Error('Canonical ledger hash does not match frozen SHA-256');
  const markdown = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return parseLedger(markdown, provenance);
}

export function serializeHistoryRow(row, historyOrdinal) {
  if (row.canonical_status !== 'accepted' || row.history_value !== 'yes') throw new Error('Only accepted History=yes rows can be serialized');
  if (!Number.isSafeInteger(historyOrdinal) || historyOrdinal <= 0) throw new Error('History ordinal must be a positive safe integer');
  if (!ACTIONS.has(row.action_type)) throw new Error('Invalid action type');
  if (!INPUTS.has(row.input_method)) throw new Error('Invalid input method');
  return freeze({ history_ordinal: historyOrdinal, action_type: row.action_type, input_method: row.input_method, granularity: targetGranularity(row.target), app: row.target.app, object: row.target.object, subtarget: row.target.subtarget });
}

export async function compileCorpusSnapshot({ spawn = execFileAsync, readFile = readFileFromDisk } = {}) {
  const git = async (args, message) => {
    let result;
    try { result = await spawn('git', args, GIT_OPTIONS); } catch { throw new Error(message); }
    if (result === null || typeof result !== 'object' || (result.code !== undefined && result.code !== 0) || !Buffer.isBuffer(result.stdout)) throw new Error(message);
    return result.stdout;
  };
  await git(['cat-file', '-e', `${CANONICAL_COMMIT}^{commit}`], 'Frozen dataset commit is unavailable');
  const historicalBytes = await git(['show', `${CANONICAL_COMMIT}:${PROVENANCE_PATH}`], 'Cannot read frozen canonical ledger');
  const currentBytes = await readFile(CANONICAL_LEDGER_PATH);
  if (!Buffer.isBuffer(currentBytes) || sha256(historicalBytes) !== CANONICAL_SHA256 || sha256(currentBytes) !== CANONICAL_SHA256) throw new Error('Current or historical ledger hash does not match frozen SHA-256');
  const source = { dataset_commit: CANONICAL_COMMIT, dataset_path: PROVENANCE_PATH, sha256: CANONICAL_SHA256 };
  const ledger = parseCanonicalLedger(currentBytes, source);
  const history = ledger.accepted_history.map((row, index) => serializeHistoryRow(row, index + 1));
  const accepted = ledger.accepted_history;
  const targets = accepted.filter((row) => row.input_method === 'pointer').map((row) => freeze({ event_id: row.event_id, chronology_index: row.chronology_index, action_type: row.action_type, input_method: row.input_method, target: freeze({ ...row.target }), granularity: targetGranularity(row.target) }));
  const excluded = accepted.filter((row) => row.input_method !== 'pointer');
  if (!excluded.every((row) => (row.input_method === 'keyboard_enter' && row.target.app === 'Codex' && row.target.subtarget === 'prompt submission command') || row.input_method === 'keyboard_command_w') || targets.length !== 139) throw new Error('Unexpected accepted nonpointer target eligibility');
  return freeze({ source: freeze({ ...source }), retained_count: ledger.rows.length, accepted_count: ledger.rows.filter((row) => row.canonical_status === 'accepted').length, accepted_history_count: history.length, accepted_nontrivial_count: targets.length, rows: ledger.rows, history: freeze(history), targets: freeze(targets) });
}
