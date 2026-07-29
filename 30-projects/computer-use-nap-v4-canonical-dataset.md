---
type: project-dataset
status: active
canonical: true
created: 2026-07-29
updated: 2026-07-29
project: computer-use-nap
---

# Computer-use NAP V4 canonical dataset

> Canonical public-vault dataset. Dylan's narration is authoritative for the
> action label. All future labels, evidence status updates, and experimental
> row assignments belong in this file rather than a competing external ledger.

## Batch summary

- Source: Dylan's manual pass over the 10 monitor-3 recordings listed in `NEXT-10-VIDEOS.md`.
- Recording coverage: 10 recordings.
- No-action recordings: 2.
- Human action labels accepted from Dylan's narration: 76.
- Currently well-timed pointer rows ready for prior-frame extraction: 74.
- Preserved but not yet experiment-ready rows: 4. Two have accepted action labels but missing prior-frame granularity; one needs tighter timing; one needs its input method confirmed.
- Total narrated candidate rows: 78.
- Typing, pasted text, text highlighting/selection, keyboard-only closing, and waiting are retained as context where useful but are not rows.
- All predictor screenshots remain pending. A label can be accepted while still being ineligible for the screenshot-based experiment.
- Experimental roles below are provisional until prior screenshots and event timing are validated. On the current accepted set, the first 10 rows are history-only, and the next 20 eligible rows are the early checkpoint holdout.

## Current labeling queue

These are the next ten chronological monitor-3 recordings after the completed
`compact_monitor_3_1785167445853.mp4` batch. Routine V4 labeling does not
require opening the monitor-1 companions.

| # | Start ET | Monitor-3 recording |
|---:|---|---|
| 1 | 11:55:50 AM | [compact_monitor_3_1785167750663.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785167750663.mp4) |
| 2 | 12:00:55 PM | [compact_monitor_3_1785168055694.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785168055694.mp4) |
| 3 | 12:06:01 PM | [compact_monitor_3_1785168361574.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785168361574.mp4) |
| 4 | 12:11:07 PM | [compact_monitor_3_1785168667070.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785168667070.mp4) |
| 5 | 12:16:12 PM | [compact_monitor_3_1785168972693.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785168972693.mp4) |
| 6 | 12:21:17 PM | [compact_monitor_3_1785169277197.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785169277197.mp4) |
| 7 | 12:26:20 PM | [compact_monitor_3_1785169580168.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785169580168.mp4) |
| 8 | 12:31:23 PM | [compact_monitor_3_1785169883592.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785169883592.mp4) |
| 9 | 12:36:28 PM | [compact_monitor_3_1785170188681.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785170188681.mp4) |
| 10 | 12:41:34 PM | [compact_monitor_3_1785170494239.mp4](/Users/dylanvu/.screenpipe/data/data/2026-07-27/compact_monitor_3_1785170494239.mp4) |

## Status meanings

- `accepted`: Dylan clearly narrated an atomic pointer action and its destination.
- `needs_timing`: the action is accepted as having happened, but its exact timestamp is too uncertain to recover a trustworthy strictly-prior screenshot.
- `needs_input_method`: it is not yet clear that the narrated state change was caused by a pointer action.
- `needs_prior_frame`: the action label is accepted, but Screenpipe reportedly missed the granular frames needed for predictor input.
- `pending_prior_frame`: the label is accepted; the strictly-prior monitor-3 screenshot has not yet been extracted and checked.

## Normalized rows

| Row ID | Recording | Action time | Label status | Prior-frame status | Provisional role | Action type | Canonical destination | Notes |
|---|---|---:|---|---|---|---|---|---|
| BLOG-V4-001 | `compact_monitor_3_1785164707150.mp4` | 0:00 | accepted | pending_prior_frame | history_only | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-002 | `compact_monitor_3_1785164707150.mp4` | 0:31 | accepted | pending_prior_frame | history_only | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the typed prompt. |
| BLOG-V4-003 | `compact_monitor_3_1785164707150.mp4` | 1:01 | accepted | pending_prior_frame | history_only | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc with the meeting note open. |
| BLOG-V4-004 | `compact_monitor_3_1785165613408.mp4` | 0:17 | accepted | pending_prior_frame | history_only | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Began typing; later text highlighting is context only. |
| BLOG-V4-005 | `compact_monitor_3_1785165613408.mp4` | 1:03 | accepted | pending_prior_frame | history_only | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc/Coda. |
| BLOG-V4-006 | `compact_monitor_3_1785165613408.mp4` | 1:03 | accepted | pending_prior_frame | history_only | focus | Arc → Coda → `all hands 7.27` → meeting-note editor/body | Clicked into the note to edit. |
| BLOG-V4-007 | `compact_monitor_3_1785165613408.mp4` | 3:03 | accepted | pending_prior_frame | history_only | focus | Codex → `Patch NAP blog prep in vault` | Focused Codex. |
| BLOG-V4-008 | `compact_monitor_3_1785165613408.mp4` | 3:03 | accepted | pending_prior_frame | history_only | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-009 | `compact_monitor_3_1785165613408.mp4` | 3:10 | accepted | pending_prior_frame | history_only | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the typed prompt. |
| BLOG-V4-010 | `compact_monitor_3_1785165613408.mp4` | 3:17 | accepted | pending_prior_frame | history_only | focus | Arc | Focused Arc before invoking the URL control. |
| BLOG-V4-011 | `compact_monitor_3_1785165613408.mp4` | 3:17 | accepted | pending_prior_frame | heldout_target | activate | Arc → URL/address command control | Clicked the URL control; subsequent typing/navigation is context only. |
| BLOG-V4-012 | `compact_monitor_3_1785165613408.mp4` | 3:50 | accepted | pending_prior_frame | heldout_target | activate | Arc → Coda → `all hands 7.27` meeting note | Clicked the Arc sidebar shortcut labeled `Notion`, returning to the meeting note. |
| BLOG-V4-013 | `compact_monitor_3_1785165613408.mp4` | 4:18 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Patch NAP blog prep in vault` | Subsequent response highlighting/copying is context only. |
| BLOG-V4-014 | `compact_monitor_3_1785165613408.mp4` | 4:34 | accepted | pending_prior_frame | heldout_target | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc/Coda. |
| BLOG-V4-015 | `compact_monitor_3_1785165613408.mp4` | 4:34 | accepted | pending_prior_frame | heldout_target | focus | Arc → Coda → `all hands 7.27` → meeting-note editor/body | Clicked into the note to edit. |
| BLOG-V4-016 | `compact_monitor_3_1785165921392.mp4` | 1:20 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Automate rekordbox workflow` task | Clicked the task in the sidebar. |
| BLOG-V4-017 | `compact_monitor_3_1785165921392.mp4` | 1:20 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Automate rekordbox workflow` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-018 | `compact_monitor_3_1785165921392.mp4` | 1:27 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Automate rekordbox workflow` → prompt Submit control | Submitted the typed prompt. |
| BLOG-V4-019 | `compact_monitor_3_1785165921392.mp4` | 1:27–1:47 | needs_timing | needs_timing | unresolved | focus | Arc | The focus happened in this interval, but the exact action time is unknown. Preserve chronologically; exclude from a screenshot-based run unless timing is recovered. |
| BLOG-V4-020 | `compact_monitor_3_1785165921392.mp4` | 1:47 | accepted | pending_prior_frame | heldout_target | focus | Codex | Focused Codex from Arc. |
| BLOG-V4-021 | `compact_monitor_3_1785165921392.mp4` | 1:47 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Patch NAP blog prep in vault` task | Clicked the task in the sidebar. |
| BLOG-V4-022 | `compact_monitor_3_1785165921392.mp4` | 2:12 | accepted | pending_prior_frame | heldout_target | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc/Coda. |
| BLOG-V4-023 | `compact_monitor_3_1785165921392.mp4` | 2:34 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Patch NAP blog prep in vault` | Focused Codex. |
| BLOG-V4-024 | `compact_monitor_3_1785165921392.mp4` | 2:37 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-025 | `compact_monitor_3_1785165921392.mp4` | 2:47 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-026 | `compact_monitor_3_1785165921392.mp4` | 2:49 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-027 | `compact_monitor_3_1785165921392.mp4` | 2:56 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-028 | `compact_monitor_3_1785165921392.mp4` | 3:00 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-029 | `compact_monitor_3_1785165921392.mp4` | 3:06 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-030 | `compact_monitor_3_1785165921392.mp4` | 3:50 | accepted | pending_prior_frame | heldout_target | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-031 | `compact_monitor_3_1785165921392.mp4` | 3:52 | accepted | pending_prior_frame | heldout_target | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-032 | `compact_monitor_3_1785165921392.mp4` | 3:55 | accepted | pending_prior_frame | future_pool | activate | Codex → `Automate rekordbox workflow` task | Clicked the task in the sidebar. |
| BLOG-V4-033 | `compact_monitor_3_1785165921392.mp4` | 4:00 | accepted | pending_prior_frame | future_pool | focus | Codex → `Automate rekordbox workflow` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-034 | `compact_monitor_3_1785165921392.mp4` | 4:02 | accepted | pending_prior_frame | future_pool | activate | Codex → `Automate rekordbox workflow` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-035 | `compact_monitor_3_1785166229371.mp4` | 0:06 | needs_input_method | needs_input_method | unresolved | focus | iPhone Settings window | Narration says the window was focused, then closed with Command-W. The keyboard close is excluded; confirm that the focus itself came from a pointer click. |
| BLOG-V4-036 | `compact_monitor_3_1785166229371.mp4` | 1:07 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` task | Clicked the task in the sidebar. |
| BLOG-V4-037 | `compact_monitor_3_1785166229371.mp4` | ~1:15 | accepted | needs_prior_frame | unresolved | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Dylan observed the focus, but Screenpipe missed the granular frames. Keep the ground-truth label; exclude from screenshot-based evaluation unless a valid prior frame is recovered. |
| BLOG-V4-038 | `compact_monitor_3_1785166229371.mp4` | ~1:15 | accepted | needs_prior_frame | unresolved | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Dylan observed the submit, but Screenpipe missed the granular frames. Keep the ground-truth label; exclude from screenshot-based evaluation unless a valid prior frame is recovered. |
| BLOG-V4-039 | `compact_monitor_3_1785166229371.mp4` | 4:19 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Focused the input after the response completed. |
| BLOG-V4-040 | `compact_monitor_3_1785166229371.mp4` | 5:00 | accepted | pending_prior_frame | future_pool | focus | VS Code → `day-0-took-three-days.md` | Focused VS Code with the file already open. |
| BLOG-V4-041 | `compact_monitor_3_1785166534526.mp4` | 1:40 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` | Focused Codex. |
| BLOG-V4-042 | `compact_monitor_3_1785166534526.mp4` | 1:40 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-043 | `compact_monitor_3_1785166534526.mp4` | 1:57 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-044 | `compact_monitor_3_1785166534526.mp4` | 2:26 | accepted | pending_prior_frame | future_pool | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc/Coda. |
| BLOG-V4-045 | `compact_monitor_3_1785166534526.mp4` | 2:38 | accepted | pending_prior_frame | future_pool | activate | Arc → Precursor Labs website tab | Switched tabs through the Arc sidebar. |
| BLOG-V4-046 | `compact_monitor_3_1785166534526.mp4` | 2:55 | accepted | pending_prior_frame | future_pool | activate | Arc → Coda → `all hands 7.27` meeting-note tab | Switched back through the Arc sidebar. |
| BLOG-V4-047 | `compact_monitor_3_1785166534526.mp4` | 3:12 | accepted | pending_prior_frame | future_pool | focus | VS Code | Focused VS Code; exact visible object remains to be confirmed from the prior frame. |
| BLOG-V4-048 | `compact_monitor_3_1785166534526.mp4` | 3:30 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` | Focused Codex. |
| BLOG-V4-049 | `compact_monitor_3_1785166534526.mp4` | 4:10 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-050 | `compact_monitor_3_1785166838487.mp4` | 0:01 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt carried over from the prior recording. |
| BLOG-V4-051 | `compact_monitor_3_1785166838487.mp4` | 0:42 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-052 | `compact_monitor_3_1785166838487.mp4` | 1:20 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-053 | `compact_monitor_3_1785166838487.mp4` | 2:06 | accepted | pending_prior_frame | future_pool | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc/Coda. |
| BLOG-V4-054 | `compact_monitor_3_1785166838487.mp4` | 2:24 | accepted | pending_prior_frame | future_pool | focus | VS Code → `day-0-took-three-days.md` | Focused VS Code with the file open. |
| BLOG-V4-055 | `compact_monitor_3_1785166838487.mp4` | 3:01 | accepted | pending_prior_frame | future_pool | focus | VS Code → `day-0-took-three-days.md` → editor | Clicked into the text editor to edit. |
| BLOG-V4-056 | `compact_monitor_3_1785166838487.mp4` | 3:21 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` | Focused Codex. |
| BLOG-V4-057 | `compact_monitor_3_1785166838487.mp4` | 3:21 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-058 | `compact_monitor_3_1785166838487.mp4` | 3:50 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-059 | `compact_monitor_3_1785166838487.mp4` | 3:51 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked back into the prompt input. |
| BLOG-V4-060 | `compact_monitor_3_1785167142102.mp4` | 0:01 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt carried over from the prior recording. |
| BLOG-V4-061 | `compact_monitor_3_1785167142102.mp4` | 0:51 | accepted | pending_prior_frame | future_pool | activate | Codex → `GPU financing Obsidian` task | Clicked the task in the sidebar. |
| BLOG-V4-062 | `compact_monitor_3_1785167142102.mp4` | 0:51 | accepted | pending_prior_frame | future_pool | focus | Codex → `GPU financing Obsidian` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-063 | `compact_monitor_3_1785167142102.mp4` | 1:22 | accepted | pending_prior_frame | future_pool | activate | Codex → `GPU financing Obsidian` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-064 | `compact_monitor_3_1785167142102.mp4` | 1:31 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` task | Clicked the task in the sidebar. |
| BLOG-V4-065 | `compact_monitor_3_1785167142102.mp4` | 2:21 | accepted | pending_prior_frame | future_pool | focus | Arc → Coda → `all hands 7.27` meeting note | Focused Arc/Coda. |
| BLOG-V4-066 | `compact_monitor_3_1785167142102.mp4` | 3:09 | accepted | pending_prior_frame | future_pool | focus | Codex | Focused Codex. |
| BLOG-V4-067 | `compact_monitor_3_1785167142102.mp4` | 3:10 | accepted | pending_prior_frame | future_pool | activate | Codex → `GPU financing Obsidian` task | Clicked the task in the sidebar. |
| BLOG-V4-068 | `compact_monitor_3_1785167142102.mp4` | 3:21 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` task | Clicked the task in the sidebar. |
| BLOG-V4-069 | `compact_monitor_3_1785167142102.mp4` | 3:21 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-070 | `compact_monitor_3_1785167445853.mp4` | 1:24 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt carried over from the prior recording. |
| BLOG-V4-071 | `compact_monitor_3_1785167445853.mp4` | 2:32 | accepted | pending_prior_frame | future_pool | focus | VS Code → `day-0-took-three-days.md` | Focused VS Code. |
| BLOG-V4-072 | `compact_monitor_3_1785167445853.mp4` | 2:36 | accepted | pending_prior_frame | future_pool | focus | VS Code → `day-0-took-three-days.md` → editor | Clicked into the editor; text selection/copying is context only. |
| BLOG-V4-073 | `compact_monitor_3_1785167445853.mp4` | 2:48 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` | Focused Codex. |
| BLOG-V4-074 | `compact_monitor_3_1785167445853.mp4` | 2:48 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-075 | `compact_monitor_3_1785167445853.mp4` | 3:27 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-076 | `compact_monitor_3_1785167445853.mp4` | 3:41 | accepted | pending_prior_frame | future_pool | focus | Codex → `Patch NAP blog prep in vault` → `Do anything` composer | Clicked into the prompt input. |
| BLOG-V4-077 | `compact_monitor_3_1785167445853.mp4` | 4:20 | accepted | pending_prior_frame | future_pool | activate | Codex → `Patch NAP blog prep in vault` → prompt Submit control | Submitted the prompt. |
| BLOG-V4-078 | `compact_monitor_3_1785167445853.mp4` | 4:42 | accepted | pending_prior_frame | future_pool | focus | VS Code → `day-0-took-three-days.md` | Focused VS Code. |

## No-action recordings

- `compact_monitor_3_1785165009266.mp4`
- `compact_monitor_3_1785165310520.mp4`

## Narrated context intentionally not promoted to rows

- `compact_monitor_3_1785165613408.mp4` 0:49: highlighted Codex response text.
- `compact_monitor_3_1785165613408.mp4` after 3:17: typed/navigated to `precursorlabs.org` without a pointer action.
- `compact_monitor_3_1785165613408.mp4` after 4:18: highlighted/copied response text.
- `compact_monitor_3_1785166229371.mp4` 0:06: Command-W close after the possible focus action.
- `compact_monitor_3_1785167445853.mp4` 2:36: text selection/copying after the editor-focus click.

## Before an early checkpoint can be frozen

1. Recover and validate one readable, strictly-prior monitor-3 screenshot for each proposed history and target row.
2. Decide whether `BLOG-V4-019` has recoverable timing. If it does, it belongs chronologically inside the early holdout and shifts later target membership. If it does not, retain it in the raw chronology but exclude it from the screenshot-based experiment.
3. Keep `BLOG-V4-037` and `BLOG-V4-038` as accepted human labels even if their prior frames are unrecoverable; they need not be prediction targets.
4. Confirm whether `BLOG-V4-035` began with a pointer click. Otherwise it is not an eligible action row under the frozen V4 method.

## Original Dylan narration

The original submitted narration follows. Whitespace has been normalized, but
the wording and timestamps are preserved so the normalized rows can always be
audited without depending on a temporary Codex attachment.

### `compact_monitor_3_1785164707150`

At 0:00 we clicked to focus on the codex prompt input field this is in the
patch NAP blog prep in vault chat

At 0:31 we hit the submit button to submit the prompt that was being typed in

At 1:01 we focused on the Arc browser on the currently opened page, which is
Coda, for the all-hands 7.27 meeting notes

### `compact_monitor_3_1785165009266`

Nothing happened

### `compact_monitor_3_1785165310520`

Nothing happened

### `compact_monitor_3_1785165613408`

The pre-state of this video is the generated response from the prompt that was
submitted in compact_monitor_3_1785164707150 completed

At 0:17 I click into the Codex input field to focus on it ahead of typing out
another prompt this is still in the patch NAP blog prep in Vault chat

At 0:49 I highlighted some of the text in the generated response from the
previous prompt submission, the one I referred to right before I did not end
up submitting the prompt that was typed in after focusing on the input chat at
00:17. Not sure if this counts as a navigation (probably not) but this is just
narrative context.

At 1:03 I focus back onto the Arc browser on the currently open page, which is
Coda, for the all-hands 7.27 meeting notes

At 1:03 I click into the meeting notes so I focus on the meeting notes to be
able to edit the notes.

At 3:03 I focus back onto the Codex app in the same chat

At 3:03 I focus on the input field so that I can type out another prompt

At 3:10 I hit the submit button on the prompt I typed out

At 3:17 I focus back onto Arc

At 3:17 I click on the URL button that allows me to then type in a URL to
navigate to. The URL button is in the Arc side tab

I ended up navigating to precursorlabs.org but that did not require any button
clicks

At 3:50 I click on the Notion shortcut button on the Arc sidebar and that
brings me back to the Notion page with the all-hands meeting notes for 7.27.

At 4:18 I focus back onto the Codex app

I then highlight some of the text of the response from the previously
submitted prompt but I don't think this counts as navigation I'll then copy
the prompt or the selected part of the prompt that I had selected

At 4:34 I focus back onto the Arc browser

At 4:34 I click and focus into the all-hands 7.27 meeting notes in Coda, in the
body section, to allow me to edit

### `compact_monitor_3_1785165921392`

I guess the previous state of the video is where we left off in the last video

At 1:20 I click on the "Automate recordbox workflow" button on the left sidebar
of the Codex app

At 1:20 I click on the input fields of the Codex app to type out a prompt in
that chat

At 1:27 I hit the submit button to submit the prompt

Screenpipe is really, really shitty but

I think sometime between 1:27 and 1:47 I focus on the Arc browser

At 1:47 I focus back onto the Codex app

At 1:47 I click on the Patchnap chat button on the left sidebar of Codex

At 2:12 I focus back onto the Arc browser the Arc browser still opened onto the
Coda web page with the all-hands 7/27 meeting notes

At 2:34 I focus back onto the Codex app opened on the patched Nap chat from
before

At 2:37 I focus into the input field so that I could start typing out a prompt

At 2:47 I hit the submit button to submit the prompt

At 2:49 I focus into the input field to type out another prompt on Codex ofc

At 2:56 I hit the submit button to submit the prompt

At 3 minutes I focus into the input field to start typing out another prompt

At 3:06 I hit the submit button

At 3:50 I focus into the input field again

At 3:52 I submit the prompts by hitting the button

At 3:55 I click on the record box button to navigate to the record box
automation chat that I had going on for Codex

At 4 minutes I focus on the input field to type out a prompt to this chat

At 4:02 I submit the prompt

### `compact_monitor_3_1785166229371`

At 6 seconds I focused on this settings thing that shows my iPhone settings
window. I close it using the Command-W shortcut.

At 1:07 I click on the Patchnap chat button on the left sidebar of Codex

Looks like around 1:15 I focused on the input field, typed out a prompt, and
submitted it but the fucking shitty screen pipe did not get granular
screenshot or video recording data

at 4:19 the prompt response completes and i focus on the “Do anything” input
field on codex in the same chat

at 5:00 i focus on the vs code app opened to day-0-took-three-days.md, which
was already opened on the app

### `compact_monitor_3_1785166534526`

starting from where the last video left off

1:40 i focus on the codex app with the patch nap blog prep in vault chat open

1:40 i focus on the text input field that says “Do anything” to begin typing
out a prompt

1:57 i hit the submit button to submit the prompt

2:26 i focus on the arc browser with the coda tab open (already opened i think)

2:38 i switch tot he precursor labs tab that was opened perviously on arc

2:55 i switch back to the coda tab on arc (all this navigation is happening via
the arc sidebar)

3:12 i focus onto vs code window

3:30 i focus onto the codex window

4:10 i focus onto input field to type out a prompt

### `compact_monitor_3_1785166838487`

starting from where the last video left off

0:01 the submit button was pressed to submit the prompt

0:42 i focus on the codex prompt input field again to type out another prompt

1:20 the submit button was pressed to submit the prompt

2:06 i focus on the arc browser with coda open (already opened there)

2:24 i focus back onto the vs code window

3:01 i focus into text in the day-0-took-three-days.md file so that i can edit
it

3:21 i focus onto the codex window

3:21 i focus onto the prompt input field yk where it says “Do anything” to type
out another prompt

3:50 the submit button was pressed to submit the prompt

3:51 i focus onto the prompt input field yk where it says “Do anything” to type
out another prompt

### `compact_monitor_3_1785167142102`

starting from where the last video left off

00:01 i submit the prompt that was typed out via the submit button on codex

00:51 i click onto the gpu financing obsidian chat in the sidebar of the codex
app

00:51 i focus onto the prompt input field yk where it says “Do anything” to
type out a prompt

1:22 the submit button was pressed to submit the prompt

1:31 i click the patch nap blog prep in vault chat button in the codex sidebar
to switch back to that chat’s view

2:21 i focus back onto the arc window with coda opened already

3:09 i focus back onto the codex window

3:10 i click onto the gpu financing obsidian chat in the sidebar of the codex
app

3:21 i click the patch nap blog prep in vault chat button in the codex sidebar
to switch back to that chat’s view

3:21 i focus into the prompt input field to type out anothe rprompt

### `compact_monitor_3_1785167445853`

starting off where we left off…

1:24 i click the submit button to submit the prompt that was typed in

2:32 i focus onto the vs code window

2:36 i focused/clicked into the editor to select some text to copy in the
opened .md (same .md from before)

2:48 i focus onto the codex app

2:48 i focus onto the input field to type out another prompt

3:27 i click the submit button to submit the prompt i typed out

3:41 i focus onto the input field to type out another prompt

4:20 clicked the submit button to submit the prompt i typed out

4:42 i focus on the vs code window
