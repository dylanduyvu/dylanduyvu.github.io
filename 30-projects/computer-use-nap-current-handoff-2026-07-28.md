---
type: project-handoff
status: active
created: 2026-07-28
updated: 2026-07-28
aliases:
  - Computer-use NAP current handoff
  - NAP experiment current state
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - screenpipe
  - handoff
---

# Computer-use NAP current handoff, July 28, 2026

## Read this first

This is the current operational handoff. It supersedes older notes wherever they still say Dylan must finish the custom capture stack, 30-action diagnostic, formal calibration, or 50–100-action acquisition audit before trying prediction.

Those documents remain the historical record of what was attempted. They are not the current next step.

## Current objective

Manually turn Dylan's roughly four-to-five-hour Screenpipe recording of building the blog post into a chronological dataset of pre-navigation states and exact destinations.

The initial audit found six candidate rows in a short end-of-evening session. Dylan then clarified that those were never meant to replace the full dataset-building pass. Dylan is the ground-truth labeler. Screenpipe supplies replayable evidence, and Codex should help maintain the worksheet, retrieve strictly prior frames, and enforce the no-leakage boundary.

The current labeling workflow and exact row contract are in [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]].

The sequence Dylan approved on July 28 is:

1. create the first five full-fidelity rows;
2. use them for a state-only smoke test of labeling, packet construction, prediction, and scoring;
3. if the workflow works, continue labeling toward approximately 60 rows from the blog-building recording;
4. compare the same later rows under current screenshots only versus the same screenshots plus the ten most recent eligible full-fidelity rows; and
5. consider an automatic Screenpipe extractor only after prediction produces useful signal.

Do not resume the custom Hammerspoon, ScreenCaptureKit, Arc-extension, freeze-marker, or 30-action machinery for this first experiment.

## Product and experiment

The product idea is a personalized top-three router. Tab or one of three hotkeys would take Dylan to the exact place he is likely to want to go next within or across applications.

Possible destinations include:

- a specific application or window;
- a browser page or tab;
- a document, message thread, project, or Codex task;
- an input field; or
- a link or button that meaningfully changes the working context.

The first test is retrospective. It does not build a live interface, fine-tune a personal model, or train a new model.

The intended model comparison is:

1. the same off-the-shelf multimodal model seeing the current pre-navigation state; and
2. that model seeing the same state plus permitted earlier personal activity.

The immediate product question is qualitative:

> Do the top-three predictions contain enough exact, useful destinations that Dylan would want a live public demo?

## Current data contract

The core dataset is chronological. One row represents one semantic transition:

> prior state A -> exact destination B

It is not necessarily a pair of two low-level actions. The clicks and keystrokes between A and B are the route.

Example:

- Prior state: `Arc -> LongNAP paper -> conclusion`
- Route: open Codex, select the NAP task, focus its composer
- Exact destination: `Codex -> NAP task -> composer -> focus`

If opening the Codex task and focusing the composer are separate meaningful transitions, keep them as two rows. Do not collapse distinct semantic focus changes.

The ground-truth row stores both-monitor screenshots strictly before the first navigation input, the textual exact destination reached afterward, and a later image proving that destination. The later image, current destination, route, and labeler-only notes remain hidden from the predictor.

Post-action evidence may be used by the human labeler to identify the hidden destination. That evidence never enters the prediction prompt.

For the state-only condition, the predictor receives only the current row's two before-state screenshots and the frozen instruction. For the history condition, it receives those same screenshots plus the ten most recent eligible rows completed before the current cutoff. Each historical row contributes its two before-state screenshots, textual destination label, and timestamp. Historical examples are chosen mechanically by recency, not perceived similarity.

Two requirements do not relax:

- the observation shown to the predictor must be strictly earlier than the navigation; and
- the held-out destination label must be correct and specific.

Perfect synchronization, cryptographic provenance, stable executable selectors, and automatic identity for every interface element are not required for this first qualitative pilot.

## Historical correction that must not drift

The 30-action work was not designed as a permanent human-verification workflow.

The original automatic-acquisition ladder was:

1. a controlled 30-action component diagnostic;
2. a later blind 30-action calibration;
3. a 50–100-action natural-work audit; and
4. only after all three passed, direct use of later automatic records in prediction.

Human inspection and hidden expected answers graded the automatic recorder during calibration. They were test machinery, not fields in the intended dataset and not the intended everyday workflow.

The first 30-action walkthrough stopped at 12 accepted checkpoints. It was only the component diagnostic. It never reached the blind calibration or natural-work audit.

Manual labeling became the fallback after Dylan stopped pursuing the automatic stack. A future product may also expose uncertain rows for correction, but that is a later safeguard rather than part of the original core dataset.

## Why the automatic build stopped

Screenpipe recorded useful raw evidence, including both monitors, clicks, keyboard input, scrolling, application and window changes, URLs, OCR, and Accessibility content. It did not automatically output the required chronological prior-state and exact-destination rows.

The custom stack attempted to guarantee those rows at capture time by combining:

- Hammerspoon for input and macOS Accessibility events;
- one ScreenCaptureKit stream per display;
- an Arc extension for browser DOM and navigation evidence;
- shared action identifiers and freeze markers;
- zero-loss and sequence checks;
- evidence bundling; and
- semantic reconstruction and scoring.

The six-action plumbing smoke passed. The broader walkthrough became slow and fragile because every new action category required another exact validator, the browser recorder required repeated repairs, cross-display freezes were not consistently synchronized, and the runtime changed during collection.

This proved that dependable automatic acquisition required additional product engineering. It did not prove that Screenpipe's raw evidence was inadequate for a manually labeled pilot or a later bounded extractor.

## Current Screenpipe state

At this handoff:

- The Screenpipe app and server are running.
- Capture is paused. The newest capture session stopped cleanly at `2026-07-28T02:20:30.505150+00:00`.
- The recording audit did not start, stop, or mutate Screenpipe.
- Database: `/Users/dylanvu/.screenpipe/db.sqlite`
- Media and snapshots: `/Users/dylanvu/.screenpipe/data/data/`
- Application logs: `/Users/dylanvu/.screenpipe/screenpipe-app.2026-07-28.log`
- The database uses a live WAL, so analysis should be read-only or use a consistent SQLite backup.
- Microphone, audio, and clipboard capture were intentionally kept off.
- Dylan uses two monitors and performs most of his work on the secondary monitor.

A read-only checkpoint query on July 28 found:

| Source | First timestamp | Last timestamp | Rows |
|---|---|---|---:|
| Frames | `2026-07-28T00:00:09.974985+00:00` | `2026-07-28T02:20:24.033364+00:00` | 340 |
| UI events | `2026-07-28T01:34:51.881352+00:00` | `2026-07-28T02:20:28.970105+00:00` | 165 |

UI-event counts in that checkpoint:

| Event type | Rows |
|---|---:|
| text | 59 |
| click | 55 |
| window focus | 18 |
| application switch | 13 |
| scroll | 13 |
| key | 7 |

Frame counts:

| Screenpipe display | Frames |
|---|---:|
| `monitor_1` | 163 |
| `monitor_3` | 177 |

These counts prove that more data exists. They do not yet define the complete recording interval, establish event fidelity, or identify usable navigation rows. Screenpipe was still running when queried, and the database can continue changing.

## Recording audit outcome

### Scope correction

The first audit interpreted "newest natural-work recording" as the newest explicit Screenpipe capture session. Dylan clarified that the intended raw source is the roughly four-to-five-hour workflow of building the blog post. The six reconstructed short-session rows remain candidate examples only.

The best current review boundary is July 27, approximately 5:15 PM to 10:20 PM EDT. This matches the article's final revision checkpoints from 5:18 PM through 10:01 PM and Screenpipe evidence through the 10:20 PM Substack handoff.

Across that candidate window, Screenpipe contains:

- 1,115 monitor 1 frames;
- 1,191 monitor 3 frames;
- 1,945 UI events;
- dense work in ChatGPT/Codex, VS Code, Obsidian, Slack, Arc, Notes, Messages, and other applications; and
- three recording gaps that must remain explicit rather than treated as continuous activity.

Full boundaries and the manual schema: [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]].

### Initial short-session audit

The newest Screenpipe session ran for only 5 minutes 13.6 seconds, from `02:15:16.883501Z` to `02:20:30.505150Z`. It was a computer-use automation session, not a qualifying physical-work sample. Screenpipe captured the changing screens but not the automated route as matching UI events.

The newest qualifying natural-work session was the immediately prior capture:

- `2026-07-28T01:42:21.483799Z` to `2026-07-28T01:53:05.558310Z`
- 10 minutes 44.1 seconds
- 42 monitor 1 frames
- 46 monitor 3 frames
- 78 UI events across ChatGPT/Codex, Finder, and rekordbox
- six clear semantic transitions with strictly prior two-monitor observations

Three tempting transitions were excluded because the latest active-display pixels did not show the true pre-action state. This preserved the two requirements that do not relax: strictly pre-action predictor evidence and a correct exact destination label.

Full evidence, retained rows, exclusions, and hidden labels: [[screenpipe-natural-work-audit-2026-07-28|Screenpipe natural-work audit, July 28, 2026]].

## Exact next task

Create and smoke-test the first five rows before committing to the full-session labeling push.

1. Open the Screenpipe timeline at approximately July 27, 5:15 PM EDT.
2. Find the first five clear, meaningful human navigation events.
3. For each event, pause immediately before the first navigation input and record the exact cutoff.
4. Retrieve the latest readable frame from both monitors strictly before that cutoff.
5. Play forward until the destination stabilizes, write the exact destination as text, and retain a later image as verification evidence.
6. Complete every required field in [[computer-use-nap-manual-labeling-workbook-2026-07-28#Exact ground-truth row contract|the ground-truth row contract]].
7. Render and run one fresh state-only predictor call per row, saving predictions before revealing labels.
8. If all five rows can be captured, rendered, predicted, and scored without changing the contract, continue the full-session labeling push toward approximately 60 rows.

Do not stop or mutate Screenpipe, delete recordings, resume the 30-action walkthrough, or build an extractor unless Dylan asks.

## Manual-pilot structure

The exact row fields, templates, predictor views, leakage boundary, and smoke-test pass criteria live in the manual workbook and should not be duplicated loosely here.

The durable distinction is:

- Dataset storage is full fidelity: two strictly prior screenshots, a structured textual destination, later verification evidence, timestamps, route, quality, and utility fields.
- Predictor exposure is bounded: current screenshots only for the baseline; the same screenshots plus the ten most recent eligible historical state-destination rows for the history condition.
- History membership is derived, not manually selected or stored in the ground-truth row.
- The five-row smoke test validates the workflow, not accuracy or history lift.
- In an approximately 60-row same-session run, the first ten eligible rows establish history and approximately 50 later rows supply the paired comparison.

## Canonical vault notes

Read in this order:

1. [[computer-use-nap-shadow-experiment#July 26 decision: manual retrospective prediction pilot|Manual retrospective prediction pilot]]
2. [[computer-use-nap-build-log|Computer-use NAP build log]]
3. [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
4. [[computer-use-nap-fidelity-research-2026-07-26|Computer-use NAP dataset-fidelity research]]
5. [[computer-use-nap-30-action-walkthrough-2026-07-24|What the 30-action walkthrough was]]
6. [[computer-use-nap-walkthrough-handoff-2026-07-24|Historical custom-capture handoff]]
7. [[blog-prep-day-0-took-three-days|Blog prep: Day 0 Took Three Days]]
8. [[day-0-took-three-days|The Missing Step Between Recording and Prediction]]
9. [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]]
10. [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Candidate shakedown predictor packets, July 28, 2026]]

The initial predictor packet note is candidate-only. Do not run it before Dylan's manual full-session pass. Once Dylan approves the final five rows, keep their hidden routes and destinations separate from the predictor.

The custom-capture source and preserved evidence remain at:

- `/Users/dylanvu/Projects/computer-use-nap`
- `/Users/dylanvu/napsack-runs`

Treat them as historical unless Dylan explicitly resumes that build.

## Article status

The current article is:

`/Users/dylanvu/notes/20-syntheses/day-0-took-three-days.md`

It has a complete draft and awaits Dylan's final publication approval. The corresponding preparation document is:

`/Users/dylanvu/notes/20-syntheses/blog-prep-day-0-took-three-days.md`

The historical distinction between the core dataset, calibration machinery, and post-failure manual fallback has already been corrected in both. Do not reverse that correction.

Do not edit the article during the recording audit unless Dylan explicitly asks.

## Repository state and working conventions

Vault:

`/Users/dylanvu/notes`

Branch:

`main`, tracking `origin/main`

At handoff, the pre-existing local change was:

`M .obsidian/community-plugins.json`

That drift belongs to Dylan. Preserve it and exclude it from unrelated commits.

All project writing, preparation, and handoff work belongs directly in the vault. Do not stage project documents elsewhere and copy them in later.

Do not publish, build Quartz, or watch deployment unless Dylan asks. For a requested vault publish, commit only intended note changes, push `main`, and let GitHub Pages update asynchronously.

## Dylan's operating preferences

- Explain technical matters for a college student with minimal AI background.
- Lead with the conclusion and use plain language.
- Keep recommendations stable. If evidence changes a recommendation, name the changed evidence.
- Do not turn the first experiment into another infrastructure project.
- Optimize for utility and function. Privacy is not a load-bearing product concern for Dylan.
- Avoid em dashes in prose written for Dylan.
- Be specific about instructions, targets, and UI locations.
- Preserve existing user changes and unrelated vault drift.
- If an audit step is blocked, report the blocker quickly rather than spending hours silently rebuilding the system.

## Resume prompt

> Read this handoff and the manual labeling workbook. Help Dylan create the first five full-fidelity rows from the approximately 5:15 PM to 10:20 PM Screenpipe blog-work recording, then run the state-only workflow smoke test. Each row stores two strictly prior screenshots, the textual exact destination, later verification evidence, timestamps, route, quality, and utility fields. If the smoke works, continue toward approximately 60 rows. For the later history condition, mechanically supply the ten most recent eligible historical rows, each rendered as two before-state screenshots plus its known destination text. Do not use current or future labels, select history by similarity, resume the custom capture stack, modify the article, mutate Screenpipe, or build an extractor.
