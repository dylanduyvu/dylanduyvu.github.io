---
type: project
status: blocked
created: 2026-08-01
updated: 2026-08-01
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
  - macos
tags:
  - v0
  - codex
  - blocking-probe
---

# The Codex desktop app does not expose exact active-task identity through the approved public surfaces

## Result

Task 5 froze and independently verified as **FAIL**.

- Private attempt: `codex/attempts/000001`
- Manifest SHA-256: `3405bf06476d2132fee2d62e15877412a7cb3cc50068c131e882c7f3811bfe5f`
- Bound implementation commit: `4a1a211dfac36eaa402049b09cc5deb021a77aea`
- Failure reason: `active_task_unavailable`

The result matrix was:

| Capability | Result |
| --- | --- |
| Registered `codex://` handler | Pass |
| Public app-server `thread/list` | Pass |
| Public app-server `thread/read` | Pass |
| Public `turn/completed` event | Pass |
| Exact active desktop task ID + title | Fail |
| Exact focus-and-reread verification | Not attempted because identity failed |

## What was tested

The probe used only the preregistered public surfaces:

1. the app's `CFBundleURLTypes` entry for the `codex` scheme;
2. its shipped AppleScript dictionary for active-tab URL and title;
3. the generated app-server schema for thread list/read and completion events;
4. reopening the exact current `codex://threads/<id>` route once to make a normal task window visible.

Even after the exact route was opened and Codex was frontmost, AppleScript
reported zero scriptable windows. The generic macOS window exposed only the
title `ChatGPT` and no document URL. The app-server could enumerate and read
threads, but it did not identify which thread the desktop UI had selected.

No `app.asar`, Electron internals, private state database, arbitrary UI
traversal, coordinate click, or generic-activation fallback was used.

## Decision

Stop before the Tab gate and pill. A generic Codex activation would remove the
exact recurring-task behavior that produced all of V5's history wins, so it is
not an acceptable substitute for `focus_codex_task`.

The current plan can resume only after a new architecture decision supplies an
exact, verifiable task identity surface—for example, a first-party active-task
API/AppleScript route or a product-owned Codex task surface. This failure does
not invalidate the prediction provider, metadata observer, or app/window
actuators; it blocks the specific load-bearing Codex-task primitive.

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[computer-use-autocomplete-provider-bakeoff-2026-08-01|Computer-use autocomplete provider bakeoff]]
- [[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0 implementation plan]]
- [[personal-ai-context-learning|Personal AI context learning]]

