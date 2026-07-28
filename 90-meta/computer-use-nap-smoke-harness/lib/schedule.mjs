import { validateManifestStructure } from './manifest.mjs';

const STATE_ONLY = 'state_only';
const STATE_PLUS_ALL_PRIOR = 'state_plus_all_prior';

export function buildSchedule(manifest) {
  // This synchronous check enforces the frozen manifest structure without
  // replacing loadAndValidateManifest, which remains the async approval,
  // evidence-hash, and image-decode boundary for manifests loaded from disk.
  validateManifestStructure(manifest, { enforceApprovedTargets: false });

  const schedule = [];
  for (let index = 1; index < manifest.rows.length; index += 1) {
    const row = manifest.rows[index];
    const pairedTargetOrdinal = index;
    const conditions = pairedTargetOrdinal % 2 === 1
      ? [STATE_ONLY, STATE_PLUS_ALL_PRIOR]
      : [STATE_PLUS_ALL_PRIOR, STATE_ONLY];

    for (const condition of conditions) {
      schedule.push(Object.freeze({
        call_sequence_index: schedule.length + 1,
        paired_target_ordinal: pairedTargetOrdinal,
        event_id: row.event_id,
        event_row_version: row.row_version,
        condition,
        history_event_ids_ordered: Object.freeze(
          condition === STATE_ONLY
            ? []
            : manifest.rows.slice(0, index).map((historyRow) => historyRow.event_id),
        ),
      }));
    }
  }

  return Object.freeze(schedule);
}
