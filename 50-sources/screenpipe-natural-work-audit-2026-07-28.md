---
type: source
status: partial
created: 2026-07-28
updated: 2026-07-28
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - screenpipe
  - natural-work
  - next-action-prediction
  - audit
---

# Screenpipe natural-work audit, July 28, 2026

> [!important] Scope correction, 2026-07-28
> Dylan clarified that the intended raw source is the roughly four-to-five-hour blog-building workflow, not only the newest explicit Screenpipe start/stop session. This note preserves the initial short-session audit, but its five primary rows and one spare are candidate examples only. They are not the manually approved dataset, and predictions should not run from them yet. The current workflow is [[computer-use-nap-manual-labeling-workbook-2026-07-28|the full-session manual labeling pass]].

## Initial short-session conclusion, superseded as the next step

The initial audit found that a five-event retrospective prediction shakedown could be assembled from the short end-of-evening sessions without changing Screenpipe or rebuilding capture infrastructure.

The newest Screenpipe capture session is not the natural-work sample. It ran from `2026-07-28T02:15:16.883501Z` to `2026-07-28T02:20:30.505150Z`, or 5 minutes 13.6 seconds. Dylan typed a computer-use instruction in ChatGPT, then the screens changed while automation ran. Screenpipe did not record the automated route as matching UI events. That session contains only one clear physical navigation near its end and is not a valid natural-work dataset.

The newest qualifying physical-work session is the immediately prior capture:

- UTC: `2026-07-28T01:42:21.483799Z` to `2026-07-28T01:53:05.558310Z`
- EDT: July 27, 2026, 9:42:21 PM to 9:53:05 PM
- Duration: 10 minutes 44.1 seconds
- Result: six clear semantic transitions with strictly prior two-monitor observations

This session is shorter than the planned 30 minutes, but it contains enough clear transitions to validate the replay, labeling, prompting, and scoring workflow. It is still only a workflow shakedown, not a product result.

Those candidate predictor-visible packets are separated from the hidden labels in [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Computer-use NAP shakedown predictor packets, July 28, 2026]]. They should remain unused until Dylan manually reviews the full blog-work interval.

## Audit method

The audit used a consistent SQLite backup created with SQLite's online backup command from:

`/Users/dylanvu/.screenpipe/db.sqlite`

Snapshot:

`/tmp/screenpipe-audit-20260728.CsuDHF/db.sqlite`

The live database had a WAL. The backup was created without stopping or mutating Screenpipe. The snapshot's newest database rows were unchanged from the July 28 handoff counts.

The session boundaries came from the Screenpipe application log, not inferred counts:

- capture start: `2026-07-28T01:42:21.483799Z`
- capture stop: `2026-07-28T01:53:05.558310Z`
- UI session: `f4aef3a2-3403-44a7-bcbc-733a4ba1f05b`

Frames were read from the existing compacted media:

- monitor 1: `/Users/dylanvu/.screenpipe/data/data/2026-07-28/compact_monitor_1_1785204977089.mp4`
- monitor 3: `/Users/dylanvu/.screenpipe/data/data/2026-07-28/compact_monitor_3_1785204979758.mp4`

No extractor was built. Frame rows, compact-video offsets, screenshots, UI events, application logs, Accessibility fields, and later visual evidence were inspected manually.

## Coverage

### Frames

| Display | First frame | Last frame | Frames | Maximum within-session gap |
|---|---|---|---:|---:|
| `monitor_1` | `01:42:22.946479Z` | `01:53:00.577423Z` | 42 | 33.668 s |
| `monitor_3` | `01:42:23.031386Z` | `01:53:02.891332Z` | 46 | 52.439 s |

Both displays have decodable compacted video covering the session. All 88 frame rows have full text and Accessibility text. Forty monitor 1 rows and all 46 monitor 3 rows have Accessibility trees.

Two final database rows point to JPEGs that no longer exist:

- frame `9532`: `1785203580577_m1.jpg`
- frame `9533`: `1785203582891_m3.jpg`

Those missing files do not affect the six retained events because their required evidence is in the compact videos.

### UI events

| Event type | Rows |
|---|---:|
| click | 29 |
| text | 24 |
| scroll | 10 |
| window focus | 7 |
| application switch | 4 |
| key | 4 |
| total | 78 |

Seventy-five of 78 UI events have a strictly earlier frame on both displays. The three events without a full prior pair occur at session startup before the first screenshots.

Coordinate-bearing activity covered both displays:

| Display | Clicks | Scrolls |
|---|---:|---:|
| `monitor_1` | 8 | 2 |
| `monitor_3` | 21 | 8 |

Application coverage:

| Application | Rows | Time pattern |
|---|---:|---|
| ChatGPT, including the Codex window | 49 | session start through 9:51:07 PM, then 9:51:32 PM through 9:52:38 PM |
| Finder | 17 | 9:51:07 PM through 9:51:32 PM |
| rekordbox | 12 | 9:52:38 PM through session end |

Window titles included `ChatGPT`, `Recents`, `dylanvu`, `notes`, `70-attachments`, and `rekordbox`.

No frame or UI-event row had a populated browser URL. The embedded Codex browser preview visibly showed `localhost:64437`, so its exact destination is recoverable from pixels even though Screenpipe's URL field is empty.

### Frame freshness at retained cutoffs

| Event | Monitor 1 frame age | Monitor 3 frame age |
|---|---:|---:|
| `SP-20260727-214619` | 24.483 s | 29.748 s |
| `SP-20260727-214657` | 2.753 s | 2.754 s |
| `SP-20260727-215107` | 3.395 s | 3.395 s |
| `SP-20260727-215116` | 1.331 s | 0.500 s |
| `SP-20260727-215123` | 1.117 s | 0.767 s |
| `SP-20260727-215223` | 17.223 s | 18.000 s |

The two older pairs were manually checked. Their relevant screens remained semantically unchanged until the first navigation input. The later screens were used only to verify hidden destinations.

## Six retained transitions

Shortcut-usefulness judgments below are audit estimates. Dylan should record his own reaction after seeing predictions.

### `SP-20260727-214619`

- cutoff: `2026-07-28T01:46:19.650504Z`
- current state: Codex task `Patch NAP blog prep in vault`, at the response containing the `graphics-options.html` Web preview card
- strictly prior evidence:
  - monitor 1 frame `9468`, compact offset `9`
  - monitor 3 frame `9467`, compact offset `12`
- actual route, hidden from predictor: one click on the Web preview/open control
- exact destination, hidden from predictor: Codex embedded browser preview, `localhost:64437`, page `Which graphic earns its place?`
- navigation cost: 1 click; destination visible in retained evidence by 10.1 seconds after the click
- label confidence: clear
- one-hotkey usefulness: low, because the recorded route was already one click
- post-action verification: monitor 3 frame `9470`, compact offset `13`

### `SP-20260727-214657`

- cutoff: `2026-07-28T01:46:57.901507Z`
- current state: Codex browser preview `Which graphic earns its place?`, option B selected, with `ok` in the Codex composer
- strictly prior evidence:
  - monitor 1 frame `9479`, compact offset `14`
  - monitor 3 frame `9480`, compact offset `19`
- actual route, hidden from predictor: one click on the preview pane's top-right close control
- exact destination, hidden from predictor: Codex task `Patch NAP blog prep in vault`, conversation and composer visible, preview closed
- navigation cost: 1 click; destination visible 2.9 seconds later
- label confidence: clear
- one-hotkey usefulness: low, because the recorded route was already one click
- post-action verification: monitor 3 frame `9482`, compact offset `21`

### `SP-20260727-215107`

- cutoff: `2026-07-28T01:51:07.500332Z`
- current state: ChatGPT conversation `personalization obsidian`, with the Codex `Patch NAP blog prep in vault` task visible beside it
- strictly prior evidence:
  - monitor 1 frame `9500`, compact offset `24`
  - monitor 3 frame `9501`, compact offset `30`
- actual route, hidden from predictor: one click on the Finder Dock icon on monitor 1
- exact destination, hidden from predictor: Finder, `Recents` window on monitor 3
- navigation cost: 1 click, approximately 0.44 seconds to application and window focus
- label confidence: clear; destination identity comes from the post-click application-switch and window-focus rows because the destination pixels were not retained cleanly
- one-hotkey usefulness: low, because the recorded route was already one click
- post-action verification: UI events `9737` and `9738`, reporting Finder and window `Recents`

### `SP-20260727-215116`

- cutoff: `2026-07-28T01:51:16.637054Z`
- current state: Finder, `/Users/dylanvu`, list view
- strictly prior evidence:
  - monitor 1 frame `9505`, compact offset `26`
  - monitor 3 frame `9506`, compact offset `33`
- actual route, hidden from predictor: three scroll events, click the file list, type `notes` to select, then double-click the selected folder
- exact destination, hidden from predictor: Finder, `/Users/dylanvu/notes`, list view
- navigation cost: 3 scrolls, 3 click rows, typing `notes`, approximately 5.33 seconds
- label confidence: clear
- one-hotkey usefulness: yes, because it would replace search and selection work
- post-action verification: monitor 3 frame `9512`, compact offset `37`, and window-focus event `9749`

### `SP-20260727-215123`

- cutoff: `2026-07-28T01:51:23.082010Z`
- current state: Finder, `/Users/dylanvu/notes`, list view
- strictly prior evidence:
  - monitor 1 frame `9511`, compact offset `28`
  - monitor 3 frame `9512`, compact offset `37`
- actual route, hidden from predictor: double-click `70-attachments`
- exact destination, hidden from predictor: Finder, `/Users/dylanvu/notes/70-attachments`, list view
- navigation cost: 2 click rows, approximately 0.35 seconds to window focus
- label confidence: clear
- one-hotkey usefulness: low, because the destination was already visible and two clicks away
- post-action verification: window-focus event `9752`; monitor 3 frame `9518`, compact offset `39`, later shows the folder contents

### `SP-20260727-215223`

- cutoff: `2026-07-28T01:52:23.868275Z`
- current state: Codex task `Patch NAP blog prep in vault`, agent working on the approved graphic, with Finder `70-attachments` open beside it
- strictly prior evidence:
  - monitor 1 frame `9521`, compact offset `34`
  - monitor 3 frame `9520`, compact offset `40`
- actual route, hidden from predictor: `Command+Space`, type `reko`, press Return, wait for launch, then click `Close` on the startup modal
- exact destination, hidden from predictor: rekordbox, Performance view, Collection, with playlist `EROOM - FINAL - SHIRTLESS (88 Tracks)` visible and an upgrade popover present
- navigation cost: one key chord, five typed keys including Return, one physical modal-close click, approximately 15 seconds to the retained stable view
- label confidence: clear
- one-hotkey usefulness: yes if the shortcut can route to the exact playlist; marginal if it only launches rekordbox because application startup time remains
- post-action verification: application-switch event `9762`, window-focus event `9763`, and monitor 1 frame `9529`, compact offset `40`

## Excluded transitions

The exclusions are part of the result. They prevent the manual fallback from quietly recreating the recorder's earlier label-quality problem.

| Candidate | Why excluded |
|---|---|
| Session-start switch into ChatGPT | The first application-switch and window-focus rows occur before both monitors have prior frames. |
| Finder `Recents` to `/Users/dylanvu` | The destination is clear, but the latest active-display pixels before the click still show ChatGPT instead of `Recents`. |
| Finder `70-attachments` to the Codex task | The latest strictly prior active-display pixels show the parent `notes` folder with `70-attachments` selected, not the opened folder Dylan was actually leaving. |
| Clicks among graphics A, B, and C | The selected cards can be inferred visually, but these are choice-state changes within one preview rather than clear routing destinations for this first dataset. |
| Later rekordbox clicks | Some are duplicate raw/enriched pairs, some dismiss promotional UI, and the final track-area actions do not have a sufficiently exact semantic outcome before recording ends. |
| The `02:15:16Z` capture | It is a computer-use automation session, not natural physical work, and Screenpipe does not expose the automated route as predictor-grade UI events. |

## Initial shakedown decision, now candidate-only

The short-session audit originally selected these five clearest rows:

1. `SP-20260727-214619`
2. `SP-20260727-214657`
3. `SP-20260727-215116`
4. `SP-20260727-215123`
5. `SP-20260727-215223`

It kept `SP-20260727-215107` as the sixth spare row. Its exact destination is clear from post-click focus evidence, but the destination pixels were not retained cleanly.

Do not proceed directly from these rows. Dylan's manual full-session pass now comes first. After he approves the chronological dataset, five clear rows can be selected for the workflow shakedown.

The later shakedown procedure remains:

1. run the state-only prompt;
2. run the same prompt with only the permitted earlier history;
3. save both top-three outputs before reading the hidden label in this note;
4. score exact top one, exact top three, and whether Dylan would have wanted the shortcut; and
5. report raw outcomes without treating five rows as a product conclusion.

## Links

- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]]
- [[computer-use-nap-shadow-experiment#July 26 decision: manual retrospective prediction pilot|Manual retrospective prediction pilot]]
- [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Computer-use NAP shakedown predictor packets, July 28, 2026]]
