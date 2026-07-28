import { validateManifestStructure } from './manifest.mjs';

const CONDITIONS = new Set(['state_only', 'state_plus_all_prior']);

function fail(message) {
  throw new Error(`Cannot render packet: ${message}`);
}

function serializeHistoryTarget(target) {
  return JSON.stringify({ app: target.app, object: target.object, subtarget: target.subtarget });
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function imageEntry(input, attachmentOrdinal, provenanceRole, historyExampleOrdinal) {
  const entry = {
    attachment_ordinal: attachmentOrdinal,
    provenance_role: provenanceRole,
    ...(historyExampleOrdinal === undefined ? {} : { history_example_ordinal: historyExampleOrdinal }),
    monitor: input.monitor,
    path: input.path,
    sha256: input.sha256,
  };
  return entry;
}

export function renderPacket(manifest, { eventId, condition } = {}) {
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.rows)) fail('manifest must contain rows');
  if (!CONDITIONS.has(condition)) fail('unknown condition');
  // This is a structural precondition, not independent manifest approval. Callers
  // that load from disk must use loadAndValidateManifest for async evidence checks.
  validateManifestStructure(manifest);
  const currentIndex = manifest.rows.findIndex((row) => row?.event_id === eventId);
  if (currentIndex < 0) fail('unknown event');
  if (currentIndex === 0) fail('seed row cannot be a target');
  const current = manifest.rows[currentIndex];

  const history = condition === 'state_plus_all_prior' ? manifest.rows.slice(0, currentIndex) : [];
  const images = [];
  const attachmentLines = [];
  const historyBlocks = [];
  let attachmentOrdinal = 1;

  for (let index = 0; index < history.length; index += 1) {
    const row = history[index];
    const exampleOrdinal = index + 1;
    const inputs = row.before_state_inputs;
    for (const input of inputs) {
      images.push(imageEntry(input, attachmentOrdinal, 'history', exampleOrdinal));
      attachmentLines.push(`Image ${attachmentOrdinal}: HISTORY EXAMPLE ${exampleOrdinal} monitor ${input.monitor} before state`);
      attachmentOrdinal += 1;
    }
    historyBlocks.push(`HISTORY EXAMPLE ${exampleOrdinal}\nknown_action_target: ${serializeHistoryTarget(row.target)}\nEND HISTORY EXAMPLE ${exampleOrdinal}`);
  }

  const currentInputs = current.before_state_inputs;
  for (const input of currentInputs) {
    images.push(imageEntry(input, attachmentOrdinal, 'current'));
    attachmentLines.push(`Image ${attachmentOrdinal}: CURRENT BEFORE STATE monitor ${input.monitor}`);
    attachmentOrdinal += 1;
  }

  const promptText = [
    'ATTACHED IMAGE ORDER',
    ...attachmentLines,
    'END ATTACHED IMAGE ORDER',
    ...(historyBlocks.length === 0 ? [] : ['', ...historyBlocks]),
    '',
    'Predict the immediate next eligible action from the CURRENT BEFORE STATE.',
    '',
  ].join('\n');

  return deepFreeze({
    event_id: current.event_id,
    row_version: current.row_version,
    condition,
    current_source_recording_ref: current.source_recording_ref,
    current_before_player_time: current.before_player_time,
    current_action_player_time: current.action_player_time,
    history_event_ids_ordered: history.map((row) => row.event_id),
    history_audit_ordered: history.map((row) => ({
      event_id: row.event_id,
      row_version: row.row_version,
      source_recording_ref: row.source_recording_ref,
      before_player_time: row.before_player_time,
      action_player_time: row.action_player_time,
    })),
    prompt_text: promptText,
    images,
  });
}
