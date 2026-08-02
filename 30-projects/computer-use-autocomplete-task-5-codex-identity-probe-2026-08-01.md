---
type: project
status: complete
created: 2026-08-01
updated: 2026-08-02
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

> [!success] Read-derived identity passed, 2026-08-02
> The push listener's `0/3` result was not the final architecture result. A
> preregistered pull variant read the full thread list before each of three
> desktop-originated sends and again at approximately 2, 10, and 30 seconds.
> All `3/3` trials passed: the expected thread ID remained exact, `recencyAt`
> advanced by the first scheduled read, and raw ordering moved. Attempt
> `codex-activity/000003` froze under manifest
> `057ce508a067030a09d834dc94f1355c08a9c38f3aa67751c2d5528f8e219de5`
> and independently verified. V0 selects read-derived identity, and Task 6 is
> unblocked.

> [!failure] Activity-derived event bridge failed, 2026-08-01
> The frozen desktop event-visibility probe attached the planned sessionless
> standalone app-server listener, then Dylan manually sent messages in three
> distinct existing tasks. The listener observed no task event in 3/3 trials.
> Attempt `codex-activity/000002` froze `event_not_observed` under manifest
> `3cf152c8aa6e68dbae7417106bbbfc38433230e62b8eaf8ffa9eb55846085461`
> and independently verified. Task 6 is blocked. No title join or generic
> activation fallback is authorized.

> [!warning] Historical activity-derived V0 amendment, superseded
> The original exact-read blocker remains valid, but its decision to stop the
> whole V0 is superseded. A bounded AX spike proved that Codex exposes the
> selected task title through its public macOS Accessibility tree and that an
> exact `codex://threads/<id>` route changes that title. Two immutable formal
> attempts still failed the title-to-app-server-ID join at discovery, even
> though a bounded post-freeze reproduction recovered the unique ID. Exact
> current-task reading is therefore useful context when available, but not a
> reliable authority gate for V0.
>
> V0 now uses activity-derived identity: exact thread IDs for product-owned
> dispatch targets and qualifying app-server task activity; immediate endpoint
> verification is `observed_partial` when Codex is frontmost; exact-task and
> app-only labels are reported separately. Generic Codex activation remains
> forbidden. The subsequent blocking event probe failed, so this amendment did
> not unlock Task 6.

## Desktop event-visibility result

The activity-derived fallback froze and independently verified as **FAIL**.

- Private attempt: `codex-activity/attempts/000002`
- Manifest SHA-256: `3cf152c8aa6e68dbae7417106bbbfc38433230e62b8eaf8ffa9eb55846085461`
- Bound implementation commit: `561ab6d1a914a7ede2cb42a7e6c6887fa6b3d4cb`
- Result: `0/3` visible desktop-originated task events
- Closed reason in every trial: `event_not_observed`

The listener attached successfully and started no session or turn. Dylan—not
probe code—manually focused three distinct existing tasks, typed a short
composer message in each, and sent it. Every trial recorded null event kind and
latency, false thread-ID match, and zero provider/cache calls. The probe never
focused, typed, clicked, submitted, or otherwise drove the UI.

This failure is narrower than “Codex has no events.” It establishes that the
planned separately spawned, sessionless listener did not receive events from
the desktop app's sessions. It does not rule out a future supported shared
desktop event surface.

## Thread-list read-path result

The preregistered read-path variant froze and independently verified as
**PASS**.

- Private attempt: `codex-activity/attempts/000003`
- Manifest SHA-256: `057ce508a067030a09d834dc94f1355c08a9c38f3aa67751c2d5528f8e219de5`
- Bound implementation commit: `40933c66292fd6aca9dbab43eaaa581f5172f5b1`
- Result: `3/3` exact thread-state mutations
- Earliest qualifying read in every trial: scheduled `2,000 ms`
- Qualifying field in every trial: `recencyAt`
- Raw list ordering also moved in every trial
- Scheduled read success: `9/9`; provider and cache calls: `0`

Each trial privately preserved a full baseline and the 2-, 10-, and 30-second
thread-list reads. Exact IDs, titles, ordering, and metadata values remain in
twelve private 0600 artifacts. The manifest exposes only field names, exact-ID
match predicates, change classes, and timing. Probe code never drove the UI.

This selects the preregistered **read-derived identity** branch:

1. exact next-human Codex labels may be resolved offline from thread-state
   diffs inside the label horizon;
2. the thread list supplies the predictor's exact-ID/title Codex candidate
   catalog;
3. exact labels remain sparse and composer-concentrated, while read-only visits
   remain app-level unless a product-owned dispatch already supplies identity;
4. generic Codex activation and title joins remain forbidden; and
5. Task 6's physical Tab matrix and pill are the only next implementation task.

## Historical exact-read result

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

## Historical exact-read decision

Stop before the Tab gate and pill. A generic Codex activation would remove the
exact recurring-task behavior that produced all of V5's history wins, so it is
not an acceptable substitute for `focus_codex_task`.

The current plan can resume only after a new architecture decision supplies an
exact, verifiable task identity surface—for example, a first-party active-task
API/AppleScript route or a product-owned Codex task surface. This failure does
not invalidate the prediction provider, metadata observer, or app/window
actuators; it blocks the specific load-bearing Codex-task primitive.

## Historical AX follow-up and activity-derived decision

The one-hour-capped public-AX follow-up produced three immutable records:

| Attempt | Manifest | Result |
| --- | --- | --- |
| `000001` | `3405bf06476d2132fee2d62e15877412a7cb3cc50068c131e882c7f3811bfe5f` | AppleScript active task unavailable |
| `000002` | `762099fb864e76357afa3ffec37a755e3e866a1dab0ca2aa57d0a29bf5823b14` | AX title present; single-shot thread join unavailable |
| `000003` | `9b883e1a5297b175c1b1bb483bb85c0912e82eda939567ae4e255eb58e85f9e3` | AX title present; one fresh-directory retry still did not make the formal join reliable |

The important distinction is:

- **Execution identity is exact.** A displayed completion contains an existing
  app-server thread ID, and dispatch uses only its exact registered deep link.
- **Immediate observation is partial.** The endpoint can reliably establish
  that Codex is frontmost, but cannot always independently recover the selected
  thread ID at that moment.
- **Later activity can be exact.** A qualifying observable app-server task
  event within the labeling horizon can corroborate a thread ID. Without one,
  the episode remains app-level rather than being promoted by inference.

The amended V0 contract is therefore:

1. Product-owned exact dispatch targets seed the short-lived current-task
   buffer; qualifying app-server task activity may also seed or corroborate it.
2. Manual/read-only Codex visits with no exact activity signal expose app-level
   state only; `current_state.codex_task` is omitted rather than guessed.
3. `focus_codex_task` succeeds immediately only as `observed_partial` when
   Codex is frontmost. A matching task event inside the bounded verification
   horizon may yield `verified_exact`; a mismatch is failure.
4. Evaluation reports exact-task and app-only outcomes as separate strata.
5. Generic activation never substitutes for the requested thread route.

This preserves the named-task mechanism V5 found without pretending that a
flaky title join is exact verification. Read-only task visits are the degraded
case; task returns followed by observable activity retain exact identity when
the event surface supplies it.

The frozen event-visibility result shows that the planned listener does not
supply that activity. At that checkpoint, the implementation stopped before
Task 6 pending an explicit architecture decision. The later read-path result
above supersedes that stop without changing the push-path finding.

## Final V0 decision

Task 5 is complete under read-derived identity. Exact execution still uses only
registered `codex://threads/<id>` routes. Exact next-human labels may be
recovered from bounded thread-list diffs after composer activity, and the same
list supplies the predictor's Codex candidate catalog. Read-only visits remain
app-level unless product-owned dispatch already supplies identity. Task 6 is
unblocked; no title join, generic activation, or further V0 identity probe is
authorized.

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[computer-use-autocomplete-provider-bakeoff-2026-08-01|Computer-use autocomplete provider bakeoff]]
- [[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0 implementation plan]]
- [[personal-ai-context-learning|Personal AI context learning]]
- [[a-standalone-codex-app-server-listener-cannot-observe-desktop-originated-task-events|A standalone Codex app-server listener cannot observe desktop-originated task events]]
- [[codex-thread-list-recency-reveals-desktop-originated-task-activity|Codex thread-list recency reveals desktop-originated task activity]]
