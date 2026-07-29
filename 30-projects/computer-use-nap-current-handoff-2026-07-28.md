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

The first 20-row dataset and its 19-pair retrospective smoke test are complete.
The current objective is to finish semantic adjudication, repair destination
identity and scoring, resume chronological labeling under the patched schema,
and reserve a fresh 20–30-target holdout before deciding whether to continue
toward roughly 200 rows.

The source task was to manually turn Dylan's roughly four-to-five-hour Screenpipe recording of building the blog post into a chronological dataset of pre-action states and exact immediate action targets.

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

The 20-row expanding-history smoke test is complete. Do not resume labeling yet.

`BLOG-SMOKE-20260728-V3` ran all 38 `gpt-5.6-sol` / `max` condition slots and
scored all 19 paired targets. The pre-score audit found no label, packet,
working-directory, or future-state leakage; no actual tool event; and no
unexpected artifact or duplicate attempt.

The preregistered transport-recovered result is:

| Condition | Exact top-1 | Exact top-3 |
|---|---:|---:|
| Current screenshots only | 0/19 | 0/19 |
| Current screenshots plus all earlier rows | 5/19 | 6/19 |

In ordinary accuracy terms, history was correct on 5 targets and incorrect on
14 at top-1; it was correct on 6 and incorrect on 13 at top-3. In paired
win/loss/tie terms, top-1 was 5 wins, 0 losses, and 14 ties because both
conditions were wrong on those 14 targets. Top-3 was 6 wins, 0 losses, and 13
ties. The hits include routing to the Patch NAP Codex task, its composer, the
Coda all-hands note, and two Twitter profile controls.

This is a provisional signal pass, not a scale-to-200 pass. The exact
free-text scorer had no accepted aliases. History saw earlier canonical target
wording while state-only had to invent names, so the measured difference mixes
workflow prediction with vocabulary imitation. Apparently identical
destinations could score differently because one prediction added
`conversation`, `task`, or `prompt`.

A narrow post-hoc semantic sensitivity pass, with no new model calls, counted
only obvious naming equivalents:

| Condition | Semantic top-1 | Semantic top-3 |
|---|---:|---:|
| Current screenshots only | 2/19 | 5/19 |
| Current screenshots plus all earlier rows | 5/19 | 7/19 |

The paired result became 4 history wins, 1 loss, and 14 ties at top-1, and 3
wins, 1 loss, and 15 ties at top-3. This is still provisional because the
equivalence rule was designed after seeing the outputs. Full matrix:
[[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc semantic rescore, July 28, 2026]].

The walk-up supplied successively increasing history from one through 19 prior
rows. Correctness did not increase monotonically: semantic history top-3 was
3/5 at depths 1–5, 1/5 at 6–10, and 3/9 at 11–19. The current design cannot
isolate context quantity because the target and workflow phase also changed at
every depth.

Fourteen expanding-history calls also recovered from WebSocket disconnects by
falling back to HTTPS. They returned valid predictions, but the frozen
classifier mislabeled the fallback error item as tool use. This was detected
and the transport-recovery rule was checksum-frozen before labels were
revealed. The original attempts remain immutable.

The private canonical artifacts are:

- workbook:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/dataset.md`
- full report:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/REPORT.md`
- machine-readable summary:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/summary.json`
- interpretation:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/INTERPRETATION.md`
- six history hits for Dylan's usefulness review:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/HITS-FOR-REVIEW.md`

Next:

1. Finish condition-blind row-by-row adjudication, recording `same immediate
   action target` separately from `useful semantic shortcut`.
2. Freeze stable destination identities, aliases, and granularity rules; fix
   recovered transport-event classification.
3. On July 29, resume chronological manual labeling under the patched schema.
   Use the earlier new rows as history and reserve the final 20–30 new targets
   as an untouched retest set.
4. On July 29 night, rerun only those targets under paired state-only and
   bounded-history conditions. Do not make predictions for every history row.
5. Decide whether to continue toward roughly 200 rows from the repaired
   holdout and Dylan's shortcut-usefulness ratings.

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
11. [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]
12. [[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc semantic rescore, July 28, 2026]]
13. [[90-meta/computer-use-nap-smoke-harness/README|Computer-use NAP smoke harness V2]]
14. [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Candidate shakedown predictor packets, July 28, 2026]]

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

> Read this handoff, the post-hoc semantic-rescore note, the manual labeling workbook, the smoke execution-plan note, and the private V3 `INTERPRETATION.md`. `BLOG-SMOKE-20260728-V3` is complete: 38 immutable `gpt-5.6-sol` / `max` calls over 19 paired targets. The history condition walked from one through 19 prior rows. Frozen transport-recovered exact scoring was state-only 0/19 top-1 and top-3 versus history 5/19 top-1 and 6/19 top-3. A narrow post-hoc naming-equivalence pass, with no new calls, provisionally moved state-only to 2/19 top-1 and 5/19 top-3, and history to 5/19 top-1 and 7/19 top-3. Paired semantic results are 4/1/14 top-1 and 3/1/15 top-3. Accuracy did not increase monotonically with context depth. Treat the current 19 targets as a development set. Next, finish condition-blind adjudication, separately record exact immediate-target identity and shortcut usefulness, freeze stable target identity/aliases/granularity, and fix recovered-transport classification. On July 29, resume chronological labeling under the patched schema, reserve the final 20–30 new targets as an untouched test set, and that night predict only those targets with state-only versus bounded prior history. Do not restore excluded candidates, mutate Screenpipe, resume the custom capture stack, modify the article, build an extractor, or publish unless Dylan asks.
