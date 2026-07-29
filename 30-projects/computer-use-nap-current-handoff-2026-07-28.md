---
type: project-handoff
status: active
created: 2026-07-28
updated: 2026-07-29
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
The condition-blind V3 semantic adjudication and V4 method design are also
complete. The isolated V4 monitor-3 method was frozen before future labels at
`2026-07-29T01:56:17.000Z`. The current objective is to resume chronological
monitor-3 labeling toward roughly 200 atomic rows. The first ten eligible new
rows seed history, and the next 20 form the early V4 checkpoint holdout.
Labeling continues past row 30 while that checkpoint runs.

The source task was to manually turn Dylan's roughly four-to-five-hour Screenpipe recording of building the blog post into a chronological dataset of pre-action states and exact immediate action targets.

The initial audit found six candidate rows in a short end-of-evening session. Dylan then clarified that those were never meant to replace the full dataset-building pass. Dylan is the ground-truth labeler. His manual label from watching the recording is authoritative. Screenpipe metadata and later frames are optional QA, not an eligibility gate. Codex should help maintain the worksheet, retrieve strictly prior frames, and enforce the no-leakage boundary.

The current labeling workflow and exact row contract are in
[[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual
labeling workbook, July 28, 2026]]. The executable V4 artifacts live privately
under
`/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/`.

The current sequence Dylan approved on July 28 is:

1. continue collecting one chronological, atomic monitor-3 dataset toward
   roughly 200 labeled rows;
2. use the first ten eligible new rows as history and rows 11–30 as the early
   V4 checkpoint holdout;
3. run the 40-call checkpoint without pausing collection;
4. preserve rows 31 onward as the still-untested pool and freeze each later
   experiment split before making predictions on it; and
5. consider an automatic Screenpipe extractor only after prediction produces
   useful signal.

On July 29, Dylan completed a manual pass over the next ten monitor-3
recordings. The pass produced 78 narrated candidate rows: 76 action labels are
accepted from Dylan's narration, 74 are currently well-timed pointer rows ready
for strictly-prior-frame extraction, and four are preserved but not yet
experiment-ready. Two recordings contained no actions. The four unresolved
rows comprise one focus with an imprecise timestamp, one possible focus whose
input method needs confirmation, and two accepted actions for which Screenpipe
missed the granular prior frames. These rows stay in the raw chronology rather
than being silently discarded.

The normalized 78-row ledger is now the canonical public-vault dataset:
[[computer-use-nap-v4-canonical-dataset|Computer-use NAP V4 canonical
dataset]]. Every future task working in this vault should read and update that
file. Do not create a competing canonical ledger outside the vault. The next
operational step is to extract and validate the strictly-prior monitor-3
screenshots and update the canonical file in place.

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

The V4 dataset is chronological and monitor-3-only. One eligible row
represents one immediate user action performed on monitor 3:

> prior state A -> exact target of the next action B

Do not collapse consecutive actions into an eventual destination. The prediction is made again after each eligible action from the new resulting state.

Example:

- Row 1 prior state: `Arc -> Coda -> all hands 7.27 note`
- Row 1 next action target: `Codex -> Patch NAP blog prep in vault`
- Row 2 prior state: `Codex -> Patch NAP blog prep in vault`
- Row 2 next action target: `Codex -> Patch NAP blog prep in vault -> response copy control`

If Dylan first clicks into Codex and then clicks its copy button, those are two rows. The second row's before-state screenshots come after Codex is focused but before the copy click. The same rule applies to focusing Codex and then focusing its composer.

For each eligible V4 row, store one readable monitor 3 screenshot strictly
before the immediate action, Dylan's textual exact target, and the action type.
The two action types are:

- `focus`: only makes an already-present application, object, or field active;
- `activate`: selects, navigates, opens, invokes, submits, dismisses, toggles,
  copies, or otherwise activates the target.

A click is an input method, not an action type. A Submit-button click is
`activate`.

Actions performed on monitor 1 or actions whose monitor is unknown are
preserved as explicit coverage exclusions. They are not prediction misses and
never enter the rolling history. A monitor 1 companion recording or image is
optional audit provenance only and is never predictor-visible. Dylan does not
need to synchronize the monitor 1 video during routine labeling.

Post-action frames and Screenpipe UI-event, OCR, Accessibility, application,
and window evidence are optional QA. They may help the human labeler identify
the hidden target, but they never overrule Dylan's manual label, determine
eligibility, or enter a prediction prompt.

The target grammar has strict structural granularity:

- application target: `app`, with `object: null` and `subtarget: null`;
- object target: `app -> object`, with `subtarget: null`;
- subtarget target: `app -> object -> subtarget`.

An otherwise correct child control does not exactly match a coarser object
label, or vice versa.

For the V4 state-only condition, the predictor receives the current row's one
monitor 3 before-state screenshot and the frozen instruction. For the V4
history condition, it receives that same screenshot plus the rolling ten most
recent earlier eligible monitor 3 state-action rows, oldest to newest. Once an
earlier held-out action has occurred, its frozen label may enter the rolling
history for later held-out targets. Predictions, scores, adjudications, and
usefulness ratings never enter history.

The history-only pool contains at least the first ten chronological eligible
monitor 3 actions labeled under the frozen method. The source actions may
predate the method freeze because this is retrospective video review; the
manual label timestamp must postdate it. After that pool closes, the next
exactly 20 eligible monitor 3 actions are the held-out targets. Each held-out
target gets two calls, one per condition, for 40 calls total. There is no
adaptive stopping based on outcomes.

The V4 primary outputs are reported separately:

- normalized exact target identity at top 1 and top 3;
- action-type accuracy;
- exact action, meaning exact target and action type together;
- condition- and rank-blind semantic same-target adjudication; and
- Dylan's separate shortcut-usefulness judgment.

Two requirements do not relax:

- the observation shown to the predictor must be strictly earlier than the immediate action; and
- the held-out action-target label must be correct and specific.

The V4 method was frozen before future V4 labels at
`2026-07-29T01:56:17.000Z`. Its method-lock SHA-256 is
`55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa`.
The later run lock freezes the completed manifest, evaluator-only target
catalog, evidence, packets, and schedule before inference.

V4 must not be compared numerically with V3. V3 used both monitors, expanding
all-prior history, a different response schema, and permissive granularity
behavior.

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

The 20-row expanding-history V3 smoke test and its condition-blind semantic
adjudication are complete. Do not rerun or mutate V3.

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

The completed conservative lexical-only rescore, with no new model calls,
preserves strict target granularity:

| Condition | Semantic top-1 | Semantic top-3 |
|---|---:|---:|
| Current screenshots only | 1/19 | 1/19 |
| Current screenshots plus all earlier rows | 4/19 | 5/19 |

The primary paired result is 3 history wins, 0 losses, and 16 ties at top-1,
and 4 wins, 0 losses, and 15 ties at top-3.

A separate granularity-inclusive sensitivity retains the earlier figures:
state-only 2/19 top-1 and 5/19 top-3, history 5/19 top-1 and 7/19 top-3,
paired 4/1/14 and 3/1/15. It is not primary. Six child-control predictions
against coarser labels remain queued for Dylan's granularity decision, and
shortcut usefulness remains unresolved. Full matrix and queue:
[[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc
semantic rescore, July 28, 2026]].

The walk-up supplied successively increasing history from one through 19 prior
rows. Correctness did not increase monotonically. The design cannot isolate
context quantity because the target and workflow phase also changed at every
depth.

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
- completed semantic adjudication:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/SEMANTIC-ADJUDICATION.md`
- row-by-row adjudication:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/semantic-adjudication.json`
- V4 schema audit:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/V4-SCHEMA-AUDIT.md`
- V4 method policy and harness:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/`
- frozen V4 method lock:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/method-lock.json`

Next:

1. Resume chronological labeling from the monitor 3 videos only. Preserve
   monitor 1 actions as explicit exclusions without synchronizing its video.
2. Close the history-only pool after at least ten eligible monitor 3 actions.
3. Reserve the next exactly 20 eligible monitor 3 actions as the untouched
   holdout.
4. Freeze the completed run inputs, then make 40 calls: state-only and rolling
   recent-10 history for each held-out target, without pausing labeling.
5. Score exact target, action type, their conjunction, blind semantic
   same-target identity, and shortcut usefulness separately.
6. Continue the same atomic dataset toward roughly 200 labeled rows and freeze
   later development/holdout splits before evaluating them.

V4 is not a numeric rerun of V3. Monitor coverage, history length, target
grammar, response schema, and scoring all changed.

Do not stop or mutate Screenpipe, delete recordings, resume the 30-action walkthrough, or build an extractor unless Dylan asks.

## Manual-pilot structure

The exact row fields, templates, predictor views, leakage boundary, and 20-row checkpoint criteria live in the manual workbook and should not be duplicated loosely here.

The durable distinction is:

- V4 dataset storage requires one strictly prior monitor 3 screenshot, Dylan's
  structured immediate target, `focus` or `activate`, timestamps, exact input,
  quality, and utility fields. Monitor 1 provenance and later evidence are
  optional audit-only fields.
- V4 predictor exposure is bounded to the current monitor 3 screenshot alone
  or that screenshot plus the rolling ten prior eligible monitor 3
  state-action rows.
- The logical experiment session is `BLOG-WORK-20260727`; capture segment `A`, `B`, `C`, or `D` is recorded separately.
- Dataset eligibility follows one frozen predicate. Smoke and main manifests are chronological and versioned.
- History membership is derived from the same frozen main manifest, not manually selected or stored in the ground-truth row.
- V4 uses at least ten history-only rows followed by exactly 20 held-out
  targets and 40 calls.
- Exact target, action type, exact action, semantic equivalence, and shortcut
  usefulness are separate outputs.
- Collection continues toward roughly 200 rows while the early V4 checkpoint
  runs. Later experimental splits must be frozen before predictions, rather
  than selected from observed model outcomes.

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

The initial predictor packet note and V3 smoke harness are historical. Never
run them for V4. Build V4 packets only with the isolated private harness,
keeping opaque target IDs, current labels, monitor 1 audit evidence, and
optional post-action QA outside predictor-visible files.

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

> Read this handoff, the post-hoc semantic-rescore note, the manual labeling
> workbook, the private V3 `INTERPRETATION.md`, and the private V4
> `README.md`, `method-policy.json`, and `LABELING-GUIDE.md`.
> `BLOG-SMOKE-20260728-V3` is an immutable 38-call development run. Its
> conservative lexical-only rescore is state-only 1/19 top-1 and top-3 versus
> history 4/19 top-1 and 5/19 top-3, paired 3/0/16 top-1 and 4/0/15 top-3.
> The old 2/5 versus 5/7 figures are a non-primary granularity-inclusive
> sensitivity. Six ambiguous child-control ranks and shortcut usefulness still
> require Dylan's judgment. V4 is an isolated monitor-3-only experiment. Freeze
> the method before future V4 labels. Monitor 1 actions are explicit coverage
> exclusions; monitor 1 companion evidence is optional audit-only provenance
> and never model-visible. Use `focus` versus `activate`, strict application,
> object, or subtarget granularity, a rolling ten prior eligible monitor 3
> rows including earlier holdouts after they occur, and the next exactly 20
> eligible monitor 3 actions as the holdout. The 20 targets receive two calls
> each, for 40 total. Report exact target, action type, exact action, blind
> semantic equivalence, and usefulness separately. Do not compare V4 accuracy
> numerically with V3. Do not restore excluded candidates, mutate Screenpipe,
> resume the custom capture stack, modify the article, build an extractor, or
> publish unless Dylan asks.
