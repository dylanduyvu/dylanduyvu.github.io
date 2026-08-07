---
type: insight
status: active
created: 2026-08-02
updated: 2026-08-02
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
tags:
  - codex
  - app-server
  - task-identity
  - read-path
---

# Codex thread-list recency reveals desktop-originated task activity

## Claim

A fresh `codex app-server` `thread/list` read can identify which exact Codex
task received a desktop-originated send. In three distinct tasks, the expected
thread ID's `recencyAt` advanced and its raw list position moved by the first
scheduled read, approximately two seconds after send confirmation.

## Why It Matters

The Codex desktop app does not expose a reliable exact active-task read, and a
separately spawned app-server listener receives no push event from ordinary
desktop sends. The list-diff path still recovers exact task identity at the
composer moments most relevant to the V0 product. This restores the named-task
history signal without a title join, Electron internals, or generic Codex
activation.

## Evidence

Frozen private `codex-activity` attempt `000003` used implementation commit
`40933c66292fd6aca9dbab43eaaa581f5172f5b1` and manifest
`057ce508a067030a09d834dc94f1355c08a9c38f3aa67751c2d5528f8e219de5`.

- Dylan manually sent one short message in each of three distinct existing
  Codex tasks; probe code performed no UI action.
- Every baseline and every scheduled 2-, 10-, and 30-second read succeeded.
- All three baselines contained the expected thread ID.
- All three first scheduled reads showed `recencyAt` advancement for that same
  ID and a raw-order movement.
- Exact IDs, titles, order, and metadata values remain in twelve private 0600
  artifacts. The public manifest contains only field names, predicates, change
  classes, and timings.
- The standard evidence verifier recomputed the manifest hash, schema, private
  modes, artifact inventory, source inventory, and bound commit successfully.

## Implications

- V0 uses read-derived identity for exact next-human Codex labels after
  composer activity inside the label horizon.
- The thread list becomes the exact-ID/title Codex candidate catalog supplied
  to the predictor.
- Exact labels remain sparse and composer-concentrated; read-only Codex visits
  remain app-level unless product-owned dispatch already supplies an ID.
- Task 6's physical Tab matrix and suggestion pill are unblocked.
- Push events are not required for this V0 identity path.

## Counterpoints / Uncertainty

This is three controlled sends on the installed Codex version. It establishes
the read path for composer activity, not arbitrary read-only task selection.
The observed roughly two-second change is confirmation-relative and includes
the cost of a fresh app-server read; habit-week telemetry should measure live
coverage, latency, and false joins before broadening the claim.

## Links

- [[computer-use-autocomplete-task-5-codex-identity-probe-2026-08-01|The Codex desktop app does not expose exact active-task identity through the approved public surfaces]]
- [[a-standalone-codex-app-server-listener-cannot-observe-desktop-originated-task-events|A standalone Codex app-server listener cannot observe desktop-originated task events]]
- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0 implementation plan]]
- [[personal-ai-context-learning|Personal AI context learning]]

## Updates

- 2026-08-02: Frozen after three passive desktop-originated trials passed the
  full baseline plus 2-/10-/30-second read schedule.
- 2026-08-07: The read-path claim remains supported, but a read-only audit found
  that the promised candidate-catalog implication did not land in the runtime.
  The implementation performs one startup list read, inserts only threads
  already inside the 15-minute history horizon as `history_context`, and lets
  them age out. The current 63-packet corpus has zero exact active-task states
  and only seven packets with any Codex task candidate. See
  [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the packet-fidelity audit]].
