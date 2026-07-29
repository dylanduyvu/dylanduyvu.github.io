---
type: project-dataset
status: active
canonical: true
created: 2026-07-29
updated: 2026-07-29
project: computer-use-nap
---

# Computer-use NAP V4 canonical dataset

> This is the sole canonical merged event ledger. It is a continuous,
> highest-fidelity corpus; it is not currently partitioned into history,
> development, checkpoint, or holdout sets.

## Current state

- Twenty-three chronological monitor-3 recordings have been manually reviewed.
- Coverage runs through `compact_monitor_3_1785171409335.mp4`.
- Two recordings contained no narrated user invocations.
- The merged ledger retains 187 physical-event candidates, of which 166 are
  accepted.
- Fourteen batch-1 input-focus candidates were retired because Codex
  automatically focused its composer; batch-2 auto-focus descriptions were
  never promoted to event IDs.
- Finish the remaining seven recordings in the current ten-video batch before
  preparing the expanded-history prediction experiment. No experiment
  screenshots or model calls should be made before that merge.

Raw narration is preserved separately:

- [[computer-use-nap-labeling-batch-1-2026-07-29|Batch 1 raw narration and
  pre-cleanup ledger]]
- [[computer-use-nap-labeling-batch-2-2026-07-29|Batch 2 raw narration]]
- [[computer-use-nap-labeling-batch-3-2026-07-29|Batch 3 raw narration,
  currently three of ten recordings]]

## Event contract

One row represents one actual user invocation, not every UI effect caused by
that invocation.

- A single click that focuses an application and lands in its editor or
  composer is one row at the deepest intended target.
- Automatic focus is resulting state, not an event.
- Switching a Codex task is one event; its automatic composer focus is not a
  second event.
- Ordinary typing, paste, scrolling, cursor motion, resizing, and text
  selection remain context rather than events.
- Non-text command keystrokes are events. Pressing Enter to submit a Codex
  prompt is `activate` with `input_method: keyboard_enter`.
- Enter submissions remain useful workflow history but are not demo targets
  and have `shortcut_opportunity: no`.
- Existing IDs are stable audit identifiers. Removed or merged candidates are
  preserved in the cleanup log rather than renumbering later rows.

Fields:

- `Status`: `accepted`, `needs_invocation`, `needs_timing`,
  `needs_prior_frame`, `needs_target`, or `unresolved`.
- `History`: whether the event belongs in the full chronological context
  stream.
- `Demo`: whether the event is currently eligible as a useful-demo prediction
  target. `pending` means it has not been rated, not that the event is invalid.
- `Shortcut`: Dylan's utility judgment. Only obvious zero-value Enter
  submissions and Command-W are prefilled as `no`; everything else remains
  `unrated`.
- `Evidence`: status of a readable strictly-prior monitor-3 frame. Evidence
  does not overrule Dylan's manual label.

## Merged clean event ledger

| ID | Recording @ time | Status | Input | Type | Destination | History | Demo | Shortcut | Evidence | Context / cleanup |
|---|---|---|---|---|---|---|---|---|---|---|
| `BLOG-V4-001` | `1785164707150` @ 0:00 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | Explicit click into the input. |
| `BLOG-V4-002` | `1785164707150` @ 0:31 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Corrected from a supposed Submit-button click. |
| `BLOG-V4-003` | `1785164707150` @ 1:01 | accepted | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Focused Arc with the note open. |
| `BLOG-V4-004` | `1785165613408` @ 0:17 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | Explicit click before typing. |
| `BLOG-V4-005` | `1785165613408` @ 1:03 | needs_invocation | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Same-time pair with `006`; confirm one click versus two. |
| `BLOG-V4-006` | `1785165613408` @ 1:03 | needs_invocation | pointer | focus | Arc → Coda → `all hands 7.27` → editor/body | yes | pending | unrated | pending | Same-time pair with `005`; deepest target if one click. |
| `BLOG-V4-007` | `1785165613408` @ 3:03 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Response text had previously been selected, so app and composer may require separate clicks. |
| `BLOG-V4-008` | `1785165613408` @ 3:03 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | Explicit second click into composer. |
| `BLOG-V4-009` | `1785165613408` @ 3:10 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-010` | `1785165613408` @ 3:17 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-011` | `1785165613408` @ 3:17 | accepted | pointer | activate | Arc → URL/address command control | yes | pending | unrated | pending | Invoked the URL control. |
| `BLOG-V4-011A` | `1785165613408` @ after 3:17 | needs_timing | keyboard_enter | activate | Arc → `precursorlabs.org` | yes | pending | unrated | needs_timing | Recovered non-text navigation command; typed URL itself remains context. |
| `BLOG-V4-012` | `1785165613408` @ 3:50 | accepted | pointer | activate | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Clicked the Arc shortcut labeled `Notion`. |
| `BLOG-V4-013` | `1785165613408` @ 4:18 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Later text selection/copy remains context. |
| `BLOG-V4-014` | `1785165613408` @ 4:34 | needs_invocation | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Same-time pair with `015`; confirm one click versus two. |
| `BLOG-V4-015` | `1785165613408` @ 4:34 | needs_invocation | pointer | focus | Arc → Coda → `all hands 7.27` → editor/body | yes | pending | unrated | pending | Same-time pair with `014`; deepest target if one click. |
| `BLOG-V4-016` | `1785165921392` @ 1:20 | accepted | pointer | activate | Codex → `Automate rekordbox workflow` task | yes | pending | unrated | pending | Task switch; composer auto-focus is not another event. |
| `BLOG-V4-018` | `1785165921392` @ 1:27 | accepted | keyboard_enter | activate | Codex → `Automate rekordbox workflow` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-019` | `1785165921392` @ 1:27–1:47 | needs_timing | unknown | focus | Arc | yes | pending | unrated | needs_timing | Focus occurred, exact action time unknown. |
| `BLOG-V4-020` | `1785165921392` @ 1:47 | accepted | pointer | focus | Codex | yes | pending | unrated | pending | Focused Codex from Arc. |
| `BLOG-V4-021` | `1785165921392` @ 1:47 | accepted | pointer | activate | Codex → `Patch NAP blog prep in vault` task | yes | pending | unrated | pending | Task switch. |
| `BLOG-V4-022` | `1785165921392` @ 2:12 | accepted | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Focused Arc/Coda. |
| `BLOG-V4-023` | `1785165921392` @ 2:34 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Focused Codex. |
| `BLOG-V4-024` | `1785165921392` @ 2:37 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | Explicit later click into composer. |
| `BLOG-V4-025` | `1785165921392` @ 2:47 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-027` | `1785165921392` @ 2:56 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Composer remained auto-focused after `025`. |
| `BLOG-V4-029` | `1785165921392` @ 3:06 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Composer remained auto-focused after `027`. |
| `BLOG-V4-030` | `1785165921392` @ 3:50 | needs_invocation | unknown | focus | Codex → `Patch NAP blog prep in vault` → composer | pending | pending | unrated | pending | Composer may already have been auto-focused; confirm an actual click. |
| `BLOG-V4-031` | `1785165921392` @ 3:52 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-032` | `1785165921392` @ 3:55 | accepted | pointer | activate | Codex → `Automate rekordbox workflow` task | yes | pending | unrated | pending | Task switch. |
| `BLOG-V4-034` | `1785165921392` @ 4:02 | accepted | keyboard_enter | activate | Codex → `Automate rekordbox workflow` → prompt submission command | yes | no | no | pending | Task switch auto-focused composer; Enter submitted. |
| `BLOG-V4-035` | `1785166229371` @ 0:06 | needs_invocation | unknown | focus | iPhone Settings window | pending | pending | unrated | pending | Confirm how the window was focused. |
| `BLOG-V4-035A` | `1785166229371` @ ~0:06 | accepted | keyboard_command_w | activate | iPhone Settings window → close command | yes | no | no | pending | Recovered command invocation previously discarded as keyboard-only. |
| `BLOG-V4-036` | `1785166229371` @ 1:07 | accepted | pointer | activate | Codex → `Patch NAP blog prep in vault` task | yes | pending | unrated | pending | Task switch. |
| `BLOG-V4-038` | `1785166229371` @ ~1:15 | needs_prior_frame | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | needs_prior_frame | Screenpipe missed the granular prior state. |
| `BLOG-V4-040` | `1785166229371` @ 5:00 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code with file open. |
| `BLOG-V4-041` | `1785166534526` @ 1:40 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer remained focused; only window focus retained. |
| `BLOG-V4-043` | `1785166534526` @ 1:57 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-044` | `1785166534526` @ 2:26 | accepted | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Focused Arc/Coda. |
| `BLOG-V4-045` | `1785166534526` @ 2:38 | accepted | pointer | activate | Arc → Precursor Labs website tab | yes | pending | unrated | pending | Arc sidebar tab switch. |
| `BLOG-V4-046` | `1785166534526` @ 2:55 | accepted | pointer | activate | Arc → Coda → `all hands 7.27` tab | yes | pending | unrated | pending | Arc sidebar tab switch. |
| `BLOG-V4-047` | `1785166534526` @ 3:12 | accepted | pointer | focus | VS Code | yes | pending | unrated | pending | Exact visible object remains unspecified. |
| `BLOG-V4-048` | `1785166534526` @ 3:30 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Focused Codex. |
| `BLOG-V4-049` | `1785166534526` @ 4:10 | needs_invocation | unknown | focus | Codex → `Patch NAP blog prep in vault` → composer | pending | pending | unrated | pending | Confirm an actual click rather than retained auto-focus. |
| `BLOG-V4-050` | `1785166838487` @ 0:01 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-052` | `1785166838487` @ 1:20 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission; intervening composer auto-focus retired. |
| `BLOG-V4-053` | `1785166838487` @ 2:06 | accepted | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Focused Arc/Coda. |
| `BLOG-V4-054` | `1785166838487` @ 2:24 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-055` | `1785166838487` @ 3:01 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later click into editor. |
| `BLOG-V4-056` | `1785166838487` @ 3:21 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer remained auto-focused; only window focus retained. |
| `BLOG-V4-058` | `1785166838487` @ 3:50 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-060` | `1785167142102` @ 0:01 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission; composer auto-focus retired. |
| `BLOG-V4-061` | `1785167142102` @ 0:51 | accepted | pointer | activate | Codex → `GPU financing Obsidian` task | yes | pending | unrated | pending | Task switch; automatic composer focus retired. |
| `BLOG-V4-063` | `1785167142102` @ 1:22 | accepted | keyboard_enter | activate | Codex → `GPU financing Obsidian` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-064` | `1785167142102` @ 1:31 | accepted | pointer | activate | Codex → `Patch NAP blog prep in vault` task | yes | pending | unrated | pending | Task switch. |
| `BLOG-V4-065` | `1785167142102` @ 2:21 | accepted | pointer | focus | Arc → Coda → `all hands 7.27` note | yes | pending | unrated | pending | Focused Arc/Coda. |
| `BLOG-V4-066` | `1785167142102` @ 3:09 | accepted | pointer | focus | Codex | yes | pending | unrated | pending | Focused Codex. |
| `BLOG-V4-067` | `1785167142102` @ 3:10 | accepted | pointer | activate | Codex → `GPU financing Obsidian` task | yes | pending | unrated | pending | Task switch. |
| `BLOG-V4-068` | `1785167142102` @ 3:21 | accepted | pointer | activate | Codex → `Patch NAP blog prep in vault` task | yes | pending | unrated | pending | Task switch; composer auto-focus retired. |
| `BLOG-V4-070` | `1785167445853` @ 1:24 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-071` | `1785167445853` @ 2:32 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-072` | `1785167445853` @ 2:36 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate editor click; selection/copy remains context. |
| `BLOG-V4-073` | `1785167445853` @ 2:48 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer retained auto-focus; second focus row retired. |
| `BLOG-V4-075` | `1785167445853` @ 3:27 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-077` | `1785167445853` @ 4:20 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission; intervening auto-focus retired. |
| `BLOG-V4-078` | `1785167445853` @ 4:42 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-079` | `1785167750663` @ 0:01 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Focused Codex. |
| `BLOG-V4-080` | `1785167750663` @ 0:15 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | Separate later click into composer. |
| `BLOG-V4-081` | `1785167750663` @ 0:38 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-082` | `1785167750663` @ 1:16 | accepted | pointer | focus | Arc → Coda | yes | pending | unrated | pending | Focused Arc with Coda open. |
| `BLOG-V4-083` | `1785167750663` @ 1:30 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-084` | `1785167750663` @ 1:31 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-085` | `1785167750663` @ 2:22 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-086` | `1785167750663` @ 2:54 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-087` | `1785167750663` @ 3:07 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-088` | `1785167750663` @ 3:20 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer retained focus from prior submission; same-time composer effect not split. |
| `BLOG-V4-089` | `1785167750663` @ 3:50 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-090` | `1785167750663` @ 4:13 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-091` | `1785167750663` @ 4:24 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-092` | `1785167750663` @ 4:42 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer remained focused; same-time composer effect not split. |
| `BLOG-V4-093` | `1785168055694` @ 0:27 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-094` | `1785168055694` @ 0:39 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-095` | `1785168055694` @ 0:48 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-096` | `1785168055694` @ 1:13 | accepted | pointer | focus | Arc → Coda | yes | pending | unrated | pending | Focused Arc/Coda. |
| `BLOG-V4-097` | `1785168055694` @ 1:27 | accepted | pointer | activate | Arc → Coda → `all hands 7.23` note | yes | pending | unrated | pending | Opened the past meeting note. |
| `BLOG-V4-098` | `1785168055694` @ 1:34 | accepted | pointer | focus | Arc → Coda → `all hands 7.23` → editor/body | yes | pending | unrated | pending | Click into note retained; selection/copy itself is context. |
| `BLOG-V4-099` | `1785168055694` @ 1:47 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer remained focused; same-time effect not split. |
| `BLOG-V4-100` | `1785168055694` @ 2:00 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-101` | `1785168055694` @ 2:13 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-102` | `1785168055694` @ 2:33 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-103` | `1785168055694` @ 3:06 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-104` | `1785168055694` @ 3:06 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code immediately after submission. |
| `BLOG-V4-105` | `1785168055694` @ 3:41 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-106` | `1785168055694` @ 4:13 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-107` | `1785168055694` @ 4:33 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-108` | `1785168361574` @ 0:35 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-109` | `1785168361574` @ 1:04 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-110` | `1785168361574` @ 1:17 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-111` | `1785168361574` @ 1:33 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-112` | `1785168361574` @ 1:42 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-113` | `1785168361574` @ 1:55 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-114` | `1785168361574` @ 2:06 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-115` | `1785168361574` @ 2:17 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-116` | `1785168361574` @ 4:14 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Intervening composer auto-focus was not an event. |
| `BLOG-V4-117` | `1785168667070` @ 0:00 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click both focused VS Code and entered the editor. |
| `BLOG-V4-118` | `1785168667070` @ 3:20 | accepted | pointer | focus | Arc → Coda | yes | pending | unrated | pending | Focused Arc/Coda. |
| `BLOG-V4-119` | `1785168667070` @ 3:40 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-120` | `1785168972693` @ 0:11 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Clicked into editor. |
| `BLOG-V4-121` | `1785168972693` @ 0:23 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-122` | `1785168972693` @ 3:09 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-123` | `1785168972693` @ 3:43 | accepted | pointer | focus | Arc → Notion page | yes | pending | unrated | pending | Narration calls the already-open page Notion. |
| `BLOG-V4-124` | `1785168972693` @ 4:49 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-125` | `1785168972693` @ 5:01 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-126` | `1785169277197` @ 2:41 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Prior composer auto-focus was not an event. |
| `BLOG-V4-127` | `1785169277197` @ 3:30 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Prior composer auto-focus was not an event. |
| `BLOG-V4-128` | `1785169580168` @ 0:50 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Prior composer auto-focus was not an event. |
| `BLOG-V4-129` | `1785169580168` @ 3:10 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-130` | `1785169883592` @ 0:22 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-131` | `1785169883592` @ 0:52 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | Separate later editor click. |
| `BLOG-V4-132` | `1785169883592` @ 1:12 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-133` | `1785169883592` @ 1:52 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-134` | `1785169883592` @ ~2:30 | needs_prior_frame | unknown | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | needs_prior_frame | Screenpipe missed several actions. |
| `BLOG-V4-135` | `1785169883592` @ ~2:30 | needs_invocation | unknown | focus | Codex → `Patch NAP blog prep in vault` → composer | pending | pending | unrated | needs_prior_frame | Composer may have remained auto-focused; retain pending. |
| `BLOG-V4-136` | `1785169883592` @ ~2:30 | needs_prior_frame | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | needs_prior_frame | Enter submission observed but granular frames missing. |
| `BLOG-V4-137` | `1785169883592` @ 2:53 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click focused window and editor. |
| `BLOG-V4-138` | `1785169883592` @ 3:11 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Same-time composer effect not split. |
| `BLOG-V4-139` | `1785169883592` @ 4:01 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-140` | `1785170188681` @ 0:37 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Prior composer auto-focus was not an event. |
| `BLOG-V4-141` | `1785170188681` @ 1:51 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Prior composer auto-focus was not an event. |
| `BLOG-V4-142` | `1785170188681` @ 2:00 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-143` | `1785170188681` @ ~2:23 | needs_prior_frame | unknown | focus | Arc → URL/address editor | yes | pending | unrated | needs_prior_frame | Screenpipe missed exact invocation. |
| `BLOG-V4-144` | `1785170188681` @ ~2:23 | needs_prior_frame | keyboard_enter | activate | Arc → Substack | yes | pending | unrated | needs_prior_frame | Typed query is context; Enter navigation is the event. |
| `BLOG-V4-145` | `1785170188681` @ ~2:33 | needs_prior_frame | unknown | focus | Arc → URL/address editor | yes | pending | unrated | needs_prior_frame | Screenpipe missed exact invocation. |
| `BLOG-V4-146` | `1785170188681` @ ~2:33 | needs_prior_frame | keyboard_enter | activate | Arc → Precursor Labs Substack profile | yes | pending | unrated | needs_prior_frame | Typed query is context; Enter navigation is the event. |
| `BLOG-V4-147` | `1785170188681` @ ~2:41 | unresolved | unknown | activate | Arc → Handsdiff Substack profile | pending | pending | unrated | needs_prior_frame | Cannot tell whether link click or direct URL navigation. |
| `BLOG-V4-148` | `1785170188681` @ 2:45 | accepted | pointer | activate | Arc → Handsdiff profile → `@handsdiff` handle copy control | yes | pending | unrated | pending | Click copied profile URL. |
| `BLOG-V4-149` | `1785170188681` @ 2:53 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | One click treated as deepest target; paste is context. |
| `BLOG-V4-150` | `1785170188681` @ 3:17 | accepted | pointer | focus | Arc → Handsdiff Substack profile | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-151` | `1785170188681` @ 3:20 | accepted | pointer | activate | Arc → Handsdiff Substack profile → Subscribe control | yes | pending | unrated | pending | Clicked Subscribe. |
| `BLOG-V4-152` | `1785170188681` @ 3:29 | needs_target | pointer | activate | Arc → subscription options → `None` selection control | pending | pending | unrated | pending | Dylan said “I believe”; retain pending. |
| `BLOG-V4-153` | `1785170188681` @ 3:34 | needs_target | pointer | activate | Arc → Substack sidebar → profile icon | pending | pending | unrated | pending | Dylan said “I believe”; retain pending. |
| `BLOG-V4-154` | `1785170188681` @ 3:43 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click treated as deepest target; selection/copy is context. |
| `BLOG-V4-155` | `1785170188681` @ 3:45 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | One click treated as deepest target; paste is context. |
| `BLOG-V4-156` | `1785170494239` @ 0:00 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-157` | `1785170494239` @ 0:51 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 0:45 is context. |
| `BLOG-V4-158` | `1785170494239` @ ~1:10 | needs_prior_frame | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | needs_prior_frame | Screenpipe dropped frames. |
| `BLOG-V4-159` | `1785170494239` @ 1:51 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click treated as deepest target. |
| `BLOG-V4-160` | `1785170494239` @ 2:32 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Paste is context; composer retained focus. |
| `BLOG-V4-161` | `1785170494239` @ 4:01 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 4:28 is context for a later event. |
| `BLOG-V4-162` | `1785170798390` @ 0:18 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc; exact visible page was not narrated. |
| `BLOG-V4-163` | `1785170798390` @ 0:25 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Active file carried forward from the continuous preceding labels. |
| `BLOG-V4-164` | `1785170798390` @ 0:33 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Focused the active Codex task. |
| `BLOG-V4-165` | `1785170798390` @ 0:37 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission; earlier typing is context. |
| `BLOG-V4-166` | `1785170798390` @ 0:59 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | New prompt typing is context; only submission retained. |
| `BLOG-V4-167` | `1785170798390` @ 2:11 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click treated as deepest target. |
| `BLOG-V4-168` | `1785170798390` @ 2:23 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Focused the active Codex task. |
| `BLOG-V4-169` | `1785170798390` @ 2:59 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click treated as deepest target. |
| `BLOG-V4-170` | `1785170798390` @ 3:51 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 3:40 is context. |
| `BLOG-V4-171` | `1785170798390` @ 4:11 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 4:00 is context. |
| `BLOG-V4-172` | `1785170798390` @ 4:15 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typed prompt itself remains context. |
| `BLOG-V4-173` | `1785170798390` @ 4:28 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click treated as deepest target. |
| `BLOG-V4-174` | `1785170798390` @ 4:51 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | One click treated as deepest target; paste is context. |
| `BLOG-V4-175` | `1785171103377` @ 0:16a | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | First invocation in the narrated same-time sequence. |
| `BLOG-V4-176` | `1785171103377` @ 0:16b | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Immediately followed the prompt submission. |
| `BLOG-V4-177` | `1785171103377` @ 0:56 | accepted | pointer | focus | Arc → Dylan Vu Substack profile | yes | pending | unrated | pending | Focused Arc with the profile already open. |
| `BLOG-V4-178` | `1785171103377` @ 1:05 | accepted | pointer | activate | Arc → Gmail → `dylanduyvu@gmail.com` inbox | yes | pending | unrated | pending | Clicked the named Arc sidebar shortcut. |
| `BLOG-V4-179` | `1785171103377` @ 1:29 | accepted | pointer | activate | Arc → Gmail → `dylan@slate.ceo` inbox | yes | pending | unrated | pending | Clicked the named Arc sidebar shortcut. |
| `BLOG-V4-180` | `1785171103377` @ 1:44 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-181` | `1785171103377` @ 2:07a | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | First invocation in the narrated focus-type-submit sequence. |
| `BLOG-V4-182` | `1785171103377` @ 2:07b | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing is context; submission followed the focus invocation. |
| `BLOG-V4-183` | `1785171103377` @ 3:11 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` → editor | yes | pending | unrated | pending | One click treated as deepest target. |
| `BLOG-V4-184` | `1785171103377` @ 3:59 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Composer retained focus; paste and typing are context. |
| `BLOG-V4-185` | `1785171103377` @ 4:30 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-186` | `1785171103377` @ 4:46 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-187` | `1785171409335` @ 0:00 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Focus returned from VS Code; typing is context. |
| `BLOG-V4-188` | `1785171409335` @ 0:36 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-189` | `1785171409335` @ 1:08 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 0:57 is context. |
| `BLOG-V4-190` | `1785171409335` @ 1:33 | accepted | pointer | focus | Arc | yes | pending | unrated | pending | Focused Arc. |
| `BLOG-V4-191` | `1785171409335` @ 1:50 | accepted | pointer | activate | Arc → Dylan Vu Substack profile | yes | pending | unrated | pending | Clicked the named Arc sidebar tab. |
| `BLOG-V4-192` | `1785171409335` @ 2:11 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |
| `BLOG-V4-193` | `1785171409335` @ 2:20 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` | yes | pending | unrated | pending | Response highlighting remains context. |
| `BLOG-V4-194` | `1785171409335` @ 2:27 | accepted | pointer | focus | Codex → `Patch NAP blog prep in vault` → composer | yes | pending | unrated | pending | Explicit later focus into the input field. |
| `BLOG-V4-195` | `1785171409335` @ 2:34 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Enter submission. |
| `BLOG-V4-196` | `1785171409335` @ 3:20 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 2:40 is context. |
| `BLOG-V4-197` | `1785171409335` @ 3:35 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Typing at 3:24 is context. |
| `BLOG-V4-198` | `1785171409335` @ 4:03 | accepted | keyboard_enter | activate | Codex → `Patch NAP blog prep in vault` → prompt submission command | yes | no | no | pending | Paste and typing at 4:00 are context. |
| `BLOG-V4-199` | `1785171409335` @ 4:14 | accepted | pointer | focus | VS Code → `day-0-took-three-days.md` | yes | pending | unrated | pending | Focused VS Code. |

## Retired batch-1 candidates

These IDs remain in the batch-1 source ledger but are not independent events:

| Retired ID | Disposition |
|---|---|
| `BLOG-V4-017` | Composer auto-focused after switching to `Automate rekordbox workflow`. |
| `BLOG-V4-026` | Composer remained auto-focused after `BLOG-V4-025`. |
| `BLOG-V4-028` | Composer remained auto-focused after `BLOG-V4-027`. |
| `BLOG-V4-033` | Composer auto-focused after switching tasks. |
| `BLOG-V4-037` | Composer auto-focused after switching tasks; the later Enter submission survives as `038`. |
| `BLOG-V4-039` | Response completion left the composer focused; no user invocation established. |
| `BLOG-V4-042` | Returning to Codex did not require a second composer click. |
| `BLOG-V4-051` | Composer remained auto-focused after submission. |
| `BLOG-V4-057` | Returning to Codex did not require a second composer click. |
| `BLOG-V4-059` | Composer remained auto-focused after submission. |
| `BLOG-V4-062` | Composer auto-focused after switching tasks. |
| `BLOG-V4-069` | Composer auto-focused after switching tasks. |
| `BLOG-V4-074` | Returning to Codex did not require a second composer click. |
| `BLOG-V4-076` | Composer remained auto-focused after submission. |

## Current labeling queue

The first three recordings in this batch are merged through `BLOG-V4-199`.
Continue with the remaining seven chronological monitor-3 recordings:

| Batch # | Start ET | Recording |
|---:|---|---|
| 4 | 1:01:54 PM | [compact_monitor_3_1785171714551.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785171714551.mp4) |
| 5 | 1:06:57 PM | [compact_monitor_3_1785172017894.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785172017894.mp4) |
| 6 | 1:12:00 PM | [compact_monitor_3_1785172320699.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785172320699.mp4) |
| 7 | 1:17:03 PM | [compact_monitor_3_1785172623051.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785172623051.mp4) |
| 8 | 1:22:05 PM | [compact_monitor_3_1785172925051.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785172925051.mp4) |
| 9 | 1:27:07 PM | [compact_monitor_3_1785173227162.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785173227162.mp4) |
| 10 | 1:32:09 PM | [compact_monitor_3_1785173529401.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785173529401.mp4) |

## Labeling format going forward

Name the physical invocation, not only the resulting state:

```text
video: compact_monitor_3_...

00:38 pressed Enter
-> submitted the current Codex prompt

01:30 clicked directly inside the VS Code editor
-> VS Code → day-0-took-three-days.md → editor

context only: Codex automatically focused its composer; no user action
```

Include non-text command keystrokes such as Enter, Command-W, Command-C, or a
browser navigation command. Continue excluding ordinary typing, paste,
scrolling, cursor movement, text selection, and resizing.
