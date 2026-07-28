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

Manually turn Dylan's roughly four-to-five-hour Screenpipe recording of building the blog post into a chronological dataset of pre-action states and exact immediate action targets.

The initial audit found six candidate rows in a short end-of-evening session. Dylan then clarified that those were never meant to replace the full dataset-building pass. Dylan is the ground-truth labeler. His manual label from watching the recording is authoritative. Screenpipe metadata and later frames are optional QA, not an eligibility gate. Codex should help maintain the worksheet, retrieve strictly prior frames, and enforce the no-leakage boundary.

The current labeling workflow and exact row contract are in [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]].

The sequence Dylan approved on July 28 is:

1. collect 20 chronological atomic-action rows from the current review point;
2. stop and run a small retrospective prediction experiment to inspect signal and method quality;
3. use that checkpoint to decide whether the labeling, packet, prompt, or scoring methods need repair;
4. scale toward roughly 200 rows only if the mini experiment justifies it; and
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

The core dataset is chronological. One row represents one immediate eligible user action:

> prior state A -> exact target of the next action B

Do not collapse consecutive actions into an eventual destination. The prediction is made again after each eligible action from the new resulting state.

Example:

- Row 1 prior state: `Arc -> Coda -> all hands 7.27 note`
- Row 1 next action target: `Codex -> Patch NAP blog prep in vault`
- Row 2 prior state: `Codex -> Patch NAP blog prep in vault`
- Row 2 next action target: `Codex -> Patch NAP blog prep in vault -> response copy control`

If Dylan first clicks into Codex and then clicks its copy button, those are two rows. The second row's before-state screenshots come after Codex is focused but before the copy click. The same rule applies to focusing Codex and then focusing its composer.

The ground-truth row stores both-monitor screenshots strictly before the immediate action and the textual exact action target Dylan observed afterward. A later reference image and Screenpipe UI-event, OCR, Accessibility, application, and window evidence are optional QA. Record whether those sources corroborate the label, but never let them overrule Dylan's manual label or determine row eligibility. The current action target, exact input, optional QA, and labeler-only notes remain hidden from the predictor.

Post-action frames may be used by the human labeler to identify the hidden action target. They are not required once Dylan has confidently labeled the event, and they never enter the prediction prompt.

For the state-only condition, the predictor receives only the current row's two before-state screenshots and the frozen instruction. For the frozen 20-row smoke test, the history condition receives those same screenshots plus every earlier frozen row available before that cutoff, oldest to newest. Each historical row contributes its two before-state screenshots and textual action-target label. History therefore grows from one row to 19 rows across the 19 paired targets. This all-prior rule is a bounded smoke-test choice; the later scaled experiment still defaults to the ten most recent eligible rows unless Dylan changes it after reviewing this result.

Two requirements do not relax:

- the observation shown to the predictor must be strictly earlier than the immediate action; and
- the held-out action-target label must be correct and specific.

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

Screenpipe recorded useful raw evidence, including both monitors, clicks, keyboard input, scrolling, application and window changes, URLs, OCR, and Accessibility content. It did not automatically output the required chronological pre-action-state and exact-action-target rows.

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
- six clear candidate interaction sequences with strictly prior two-monitor observations

Three tempting actions were excluded because the latest active-display pixels did not show the true pre-action state. This preserved the two requirements that do not relax: strictly pre-action predictor input and a correct exact action-target label.

Full evidence, retained rows, exclusions, and hidden labels: [[screenpipe-natural-work-audit-2026-07-28|Screenpipe natural-work audit, July 28, 2026]].

## Exact next task

The 20-row collection checkpoint has been reached and exceeded. Its visual
preflight is complete, Dylan approved all 20 proposed image/action pairs with
no corrections, and the pool is frozen as `BLOG-MINI-20-V1` /
`MINI-20-20260728-V1`. The bounded protocol is frozen as
`BLOG-EXPANDING-HISTORY-SMOKE-V1`. Stop labeling. Do not execute V1: an
independent pre-call review found that the scoring components are not
structured consistently across all 20 display labels, V1 exposes candidate
IDs/times that add chronology metadata to the screenshot-only baseline, and
its stated system-message contract does not literally match the available
Codex CLI prompt stack.

The reviewed implementation plan is
`/Users/dylanvu/screenpipe-datasets/blog-work-20260727/EXECUTION-PLAN.md`.
Its zero-call repair gate and implementation are complete. V1 remains
preserved as superseded-before-execution. V2 was minted, all 38 packets were
rendered, the maximum-depth 40-image Codex input was audited, and the complete
pre-call run lock was frozen at `2026-07-28T22:17:49.760Z`. No model call has
run.

Dylan approved both repair-gate choices at `2026-07-28T19:55:56Z`.
At `2026-07-28T20:49:04Z`, he also approved `gpt-5.6-sol` with `max`
single-model reasoning, a 1,200-second per-attempt timeout, and an
infrastructure circuit breaker. Each attempt is immutable. Restarting skips
every saved attempt and continues at the first missing schedule slot. A failed
slot is never retried; an infrastructure failure is saved and pauses the run
before another slot is attempted. The V2 harness and no-model preflight are
complete; execution is ready but intentionally not started.

Screenpipe stored monitor 3 about every `4.0625s` and monitor 1 about every
`5.078125s`. Five correct manual labels lack the exact intermediate
predictor-visible state and are excluded only from the screenshot-based mini:
`BLOG-CAND-005`, `BLOG-CAND-012`, `BLOG-CAND-015`, `BLOG-CAND-017`, and
`BLOG-CAND-025`.

The earliest 20 candidates with usable pre-action image pairs are:

`BLOG-CAND-003`, `BLOG-CAND-004`, `BLOG-CAND-006`, `BLOG-CAND-007`,
`BLOG-CAND-008`, `BLOG-CAND-009`, `BLOG-CAND-010`, `BLOG-CAND-011`,
`BLOG-CAND-013`, `BLOG-CAND-014`, `BLOG-CAND-016`, `BLOG-CAND-018`,
`BLOG-CAND-019`, `BLOG-CAND-020`, `BLOG-CAND-021`, `BLOG-CAND-022`,
`BLOG-CAND-023`, `BLOG-CAND-024`, `BLOG-CAND-026`, and `BLOG-CAND-027`.

Their exact image paths and hidden action labels are in the private canonical
workbook at
`/Users/dylanvu/screenpipe-datasets/blog-work-20260727/dataset.md`.
`BLOG-CAND-028` through `BLOG-CAND-032` remain reserve rows.

1. Await Dylan's explicit go-ahead before running `execute`; it is the first command that makes model calls.
2. Make one `gpt-5.6-sol`/`max` attempt per condition slot with no selective retries. Preserve tool use and invalid JSON as incorrect model results. Preserve infrastructure failures, pause immediately, and resume later from the first missing slot without retrying the failed slot.
3. Save both condition attempt records for a target before revealing its action label. A prediction may be absent only when its attempt status records why.
4. Inspect prediction signal and method failures, then decide whether to revise the method or scale toward roughly 200 rows. Do not commit to the 200-row push before this review.

Do not stop or mutate Screenpipe, delete recordings, resume the 30-action walkthrough, or build an extractor unless Dylan asks.

## Manual-pilot structure

The exact row fields, templates, predictor views, leakage boundary, and 20-row checkpoint criteria live in the manual workbook and should not be duplicated loosely here.

The durable distinction is:

- Dataset storage is full fidelity for the experiment: two strictly prior screenshots, Dylan's structured immediate action target, timestamps, exact input, quality, and utility fields. Later frames and Screenpipe metadata are optional QA.
- Predictor exposure is bounded: current screenshots only for the baseline; for this smoke test, the same screenshots plus every earlier frozen state-action row for the history condition. A later scaled experiment defaults to recent ten.
- The logical experiment session is `BLOG-WORK-20260727`; capture segment `A`, `B`, `C`, or `D` is recorded separately.
- Dataset eligibility follows one frozen predicate. Smoke and main manifests are chronological and versioned.
- History membership is derived from the same frozen main manifest, not manually selected or stored in the ground-truth row.
- The 20-row mini experiment is a method-and-signal checkpoint, not a conclusive evaluation.
- A larger run may scale toward roughly 200 rows, but only after reviewing the mini experiment.

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
10. [[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan, July 28, 2026]]
11. [[90-meta/computer-use-nap-smoke-harness/README|Computer-use NAP smoke harness V2]]
12. [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Candidate shakedown predictor packets, July 28, 2026]]

The initial predictor packet note is obsolete candidate evidence. Never run it. Build new packets only from the frozen row contract and smoke manifest in the manual workbook, keeping hidden actions, action targets, and optional post-action QA outside predictor-visible files.

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

> Read this handoff, the manual labeling workbook, and `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/EXECUTION-PLAN.md`. The atomic-action workbook contains 30 manually narrated candidates. Dylan approved the V2 20-row protocol with rows `BLOG-CAND-003`, `004`, `006`, `007`, `008`, `009`, `010`, `011`, `013`, `014`, `016`, `018`, `019`, `020`, `021`, `022`, `023`, `024`, `026`, and `027`; preserve V1 but do not execute it. Preserve but exclude `005`, `012`, `015`, `017`, and `025` from the screenshot-based mini because Screenpipe skipped their exact intermediate state; this does not invalidate Dylan's manual labels. `028` through `032` remain reserve. No prediction has run. The V2 harness and no-model preflight are complete: `190/190` tests passed, all 38 packets were rendered, the exact 40-image prompt audit passed, and `BLOG-SMOKE-20260728-V2/run.json` is frozen with zero attempts and 38 remaining. Await Dylan's explicit approval before running `execute`. Follow the reviewed V2 plan using `gpt-5.6-sol`, `max` single-model reasoning, priority service, and a 1,200-second timeout. The experiment remains 19 paired targets and exactly 38 one-attempt condition slots, with all-prior chronological history versus current screenshots only, no selective retries, and both records saved before label reveal. Every existing attempt is immutable; restart by skipping saved attempts and continuing at the first missing slot. On infrastructure failure, save that slot and pause before the next; never retry the failed slot. Invalid model output counts false; infrastructure failure is null and removes its target from paired comparison. Dylan's labels are authoritative; Screenpipe metadata and later frames are optional QA. Do not restore earlier first-video candidates, resume labeling, use future labels, resume the custom capture stack, modify the article, mutate Screenpipe, build an extractor, or publish unless Dylan explicitly asks.
