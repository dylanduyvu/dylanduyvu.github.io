---
type: insight
status: active
created: 2026-08-01
updated: 2026-08-01
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
tags:
  - codex
  - app-server
  - event-visibility
---

# A standalone Codex app-server listener cannot observe desktop-originated task events

## Claim

In the current Codex Desktop architecture, a separately spawned, sessionless
`codex app-server` listener did not receive task events caused by normal sends
in the desktop app. This makes desktop activity unusable as the V0 exact-task
identity bridge on that listener path.

## Why It Matters

The activity-derived fallback was supposed to preserve the named recurring-task
behavior that produced every history win in NAP V5. Without desktop-originated
events, the fallback cannot attach exact thread identity to manual Codex work.
Task 6's Tab matrix and pill therefore remain blocked rather than silently
downgrading to generic Codex activation or a title-based join.

## Evidence

Frozen `codex-activity` attempt `000002` used implementation commit
`561ab6d1a914a7ede2cb42a7e6c6887fa6b3d4cb` and manifest
`3cf152c8aa6e68dbae7417106bbbfc38433230e62b8eaf8ffa9eb55846085461`.

- The listener attached successfully and started no session or turn.
- Dylan manually focused three distinct existing tasks, typed a short composer
  message in each, and sent it.
- Probe code performed no UI action.
- All three trials froze `event_not_observed`.
- Event kind and latency were null, thread-ID match was false, and no provider
  or cache call occurred in every trial.
- The standard evidence verifier recomputed the manifest hash, trial schema,
  private modes, source inventory, and source commit successfully.

## Implications

- Do not build Task 6 under the current activity-derived identity assumption.
- Do not add another title join or generic Codex activation fallback.
- The next step is an explicit architecture choice: obtain a supported shared
  desktop event surface, introduce a product-owned task surface, change the
  Codex exact-task requirement, or abandon Codex-task completion for V0.
- This result says nothing about prediction quality or the selected Anthropic
  provider. It is an identity/telemetry integration failure.

## Counterpoints / Uncertainty

The result is scoped to the installed Codex version and the planned standalone,
sessionless listener path. It does not prove that every possible first-party
desktop integration or future shared control socket is incapable of exposing
events. A different listener configuration would require a new preregistered
architecture and probe rather than an informal retry.

## Links

- [[computer-use-autocomplete-task-5-codex-identity-probe-2026-08-01|The Codex desktop app does not expose exact active-task identity through the approved public surfaces]]
- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0 implementation plan]]
- [[personal-ai-context-learning|Personal AI context learning]]

## Updates

- 2026-08-01: Frozen after three passive desktop-originated trials produced no
  observable app-server task event.
