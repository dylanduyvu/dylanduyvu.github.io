---
type: project-handoff
status: active
created: 2026-07-28
updated: 2026-07-30
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

The roughly 200-row collection push and V5 expanded-history experiment are
complete. V5 produced ten scorable paired targets: history achieved exact
top-three matches on 5/10 versus 0/10 for state-only, with five history wins,
zero state-only wins, and five ties. Every exact history hit was a recurring
Codex destination; all five scorable Arc targets were missed. The result is a
promising narrow personalization signal, not yet a general-router result.
The target-level product read is four clean exact-and-semantic history wins,
one naming-sensitive exact win, three clear shared failures, and two
granularity-sensitive Arc misses.
Verified readout:
[[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history
produced five exact top-three wins and no losses in NAP V5]].

Do not rerun V5. The current product hypothesis is a rough, confidence-gated
navigation autocomplete, not a claim of mature general computer prediction.
Its first scope should be app, window, task, document, and tab routing.
Enumerate executable candidates, represent them hierarchically, retrieve
comparable personal history, rank the shared candidate list, and abstain when
confidence is low. Fine-tuning is not the next required step.

One good week of diverse personal activity could be enough to test that rough
V1, but another Codex-heavy week would mostly strengthen the already observed
return-to-Codex prior. The next collection must deliberately include several
workflows, non-Codex destinations, departures from recurring patterns, and
browser/control cases. Full post-result synthesis:
[[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a
first navigation autocomplete still needs]].

The source task was to manually turn Dylan's roughly four-to-five-hour Screenpipe recording of building the blog post into a chronological dataset of pre-action states and exact immediate action targets.

The initial audit found six candidate rows in a short end-of-evening session. Dylan then clarified that those were never meant to replace the full dataset-building pass. Dylan is the ground-truth labeler. His manual label from watching the recording is authoritative. Screenpipe metadata and later frames are optional QA, not an eligibility gate. Codex should help maintain the worksheet, retrieve strictly prior frames, and enforce the no-leakage boundary.

The current labeling workflow and exact row contract are in
[[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual
labeling workbook, July 28, 2026]]. The executable V4 artifacts live privately
under
`/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v4/`.

The current sequence Dylan approved on July 29 is:

1. stop labeling after the completed third ten-video batch;
2. use the one canonical continuous ledger as the source corpus;
3. retain non-text commands such as Enter submissions as chronological history
   while excluding zero-value prompt submissions from demo targets;
4. freeze target eligibility, the expanded-history condition, strictly-prior
   screenshots, paired call schedule, and scoring before inference; and
5. reuse the repaired resumable harness rather than rebuilding experiment
   infrastructure.

By July 29, Dylan had completed manual passes over 30 chronological monitor-3
recordings. The merged cleanup retained 220 physical-event candidates through
`compact_monitor_3_1785173529401.mp4`: 196 accepted, 22 requiring a specific
timing, invocation, target, or prior-frame resolution, and two unresolved
destinations. Fourteen batch-1 composer-focus candidates were retired because
they described Codex automatic focus rather than a user invocation. Enter
submissions remain chronological events but are marked as non-demo targets.

The merged continuous ledger remains the canonical public-vault dataset:
[[computer-use-nap-v4-canonical-dataset|Computer-use NAP V4 canonical
dataset]]. Every future task working in this vault should read and update that
file. Do not create a competing canonical ledger outside the vault. The third
ten-video labeling batch and expanded-history prediction experiment are
complete.
The approved official design is
[[computer-use-nap-v5-expanded-history-experiment-design-2026-07-29|Computer-use
NAP V5 expanded-history experiment design, July 29, 2026]]. Its completed
result is
[[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history
produced five exact top-three wins and no losses in NAP V5]]. Do not alter or
rerun the frozen V5 runtime.

On July 29, the complete 483-file, 200 MB
`/Users/dylanvu/screenpipe-datasets/` project tree was copied and checksum
verified at `/Users/dylanvu/notes/screenpipe-datasets/`. The in-vault tree is
now the canonical working location; the old external tree is preserved only as
a deprecated source copy. Active vault references have been repointed to the
in-vault mirror. Raw screenshots and debug packets remain Git-ignored so they
cannot be swept into the public repository by a routine publish.

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

V5 completed that first test. Its positive result is limited to recurring-task
recall. A rough live V1 can still be justified if it surfaces only
high-confidence recurring routes and remains silent elsewhere. It does not
need to predict every action or control.

The intended model comparison is:

1. the same off-the-shelf multimodal model seeing the current pre-navigation state; and
2. that model seeing the same state plus permitted earlier personal activity.

The immediate product question is qualitative:

> Do the top-three predictions contain enough exact, useful destinations that Dylan would want a live public demo?

## Current data contract

The dataset is chronological and monitor-3-only. One row represents one actual
user invocation performed on monitor 3:

> prior state A -> exact target of the next action B

Do not collapse consecutive invocations into an eventual destination, but also
do not split one invocation into multiple rows merely because it caused
multiple focus effects. One click directly into an editor is one editor-target
row even when it also focuses the application. Automatic composer focus after
a Codex task switch or Enter submission is resulting state, not another row.
A Mission Control or App Exposé trackpad sequence that focuses VS Code is a
valid shortcut opportunity but targets the VS Code window/file, not an
unfocused editor. If Dylan then clicks into the editor, that click is a second
event. Do not assume gesture use unless the narration names it.

Example:

- Row 1 prior state: `Arc -> Coda -> all hands 7.27 note`
- Row 1 next action target: `Codex -> Patch NAP blog prep in vault`
- Row 2 prior state: `Codex -> Patch NAP blog prep in vault`
- Row 2 next action target: `Codex -> Patch NAP blog prep in vault -> response copy control`

If Dylan first clicks into Codex and then clicks its copy button, those are two rows. The second row's before-state screenshots come after Codex is focused but before the copy click. The same rule applies to focusing Codex and then focusing its composer.

During continuous labeling, store Dylan's textual target, exact physical input,
action type, status, chronology/history eligibility, demo-target eligibility,
shortcut utility, and evidence status. Strictly-prior screenshots may be added
later if Dylan chooses an experiment; they are not required to continue
labeling. The two action types are:

- `focus`: only makes an already-present application, object, or field active;
- `activate`: selects, navigates, opens, invokes, submits, dismisses, toggles,
  copies, or otherwise activates the target.

A click or keystroke is an input method, not an action type. Non-text command
keystrokes are events. Codex prompts are submitted with Enter and use
`input_method: keyboard_enter`, `action_type: activate`, and target `prompt
submission command`. They stay in workflow history but are not useful demo
targets. Ordinary typing and paste remain context only.

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

### Deferred V4 experiment design

The sections below preserve the frozen V4 experiment design for possible later
use. They do not assign roles to the current continuous corpus and do not
authorize a checkpoint or model run.

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

V5 is complete and immutable. Do not rerun it.

The next product-oriented task is to design the first candidate-ranked,
confidence-gated navigation-autocomplete test:

1. define a stable hierarchical candidate ontology for application,
   window/task, document/page, and control;
2. enumerate the same executable candidates for state-only and history
   conditions from strictly prior state;
3. use structured current state, a screenshot, recent actions, and retrieved
   analogous history rather than undifferentiated full-history dumping;
4. collect a diverse week or equivalent work block across several workflows,
   deliberately including non-Codex destinations and departures from recurring
   patterns;
5. reserve 50–100 later chronological targets across app, object, and control
   depth;
6. compare frequency, most-recent, source-transition, state-only, and
   state-plus-history baselines;
7. measure top-one, top-three, hierarchical correctness, confidence coverage,
   abstention quality, and Dylan-authoritative usefulness; and
8. test an app/window/task shadow-mode V1 before arbitrary-control prediction
   or fine-tuning.

The product hypothesis is intentionally rough: like an early autocomplete
feature, the first version may surface only occasional high-confidence
completions. It does not need to predict every action. One good week of diverse
data could be enough to test that V1, while another Codex-heavy week would
mostly strengthen the already observed recurring-task prior.

Full reasoning and ten-target read:
[[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a
first navigation autocomplete still needs]].

### Superseded V3/V4 snapshot

Everything below in this subsection is historical. It preserves the decisions
that led to V5 but is not the current next task.

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
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/dataset.md`
- full report:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/REPORT.md`
- machine-readable summary:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/summary.json`
- interpretation:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/INTERPRETATION.md`
- six history hits for Dylan's usefulness review:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/HITS-FOR-REVIEW.md`
- completed semantic adjudication:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/SEMANTIC-ADJUDICATION.md`
- row-by-row adjudication:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/semantic-adjudication.json`
- V4 schema audit:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/V4-SCHEMA-AUDIT.md`
- V4 method policy and harness:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v4/`
- frozen V4 method lock:
  `/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v4/method-lock.json`

Next:

1. Do not label another video batch yet.
2. Apply the V5 eligibility predicate before target selection. `Demo=pending`
   and `Shortcut=unrated` remain eligible unless explicitly `no`; do not
   silently relabel the full pool or use model outcomes to filter it.
3. Freeze the accepted corpus, evidence dispositions, evaluation targets,
   expanded-history policy, strictly-prior screenshots, response schema,
   paired schedule, and scorer.
4. Reuse the resumable V4 harness to run state-only versus expanded-history
   predictions and preserve every attempt immutably.

V4 is not a numeric rerun of V3. Monitor coverage, history length, target
grammar, response schema, and scoring all changed.

Do not stop or mutate Screenpipe, delete recordings, resume the 30-action walkthrough, or build an extractor unless Dylan asks.

## Historical manual-pilot structure

The exact historical predictor views and leakage boundary live in the manual
workbook. The current collection phase does not use a checkpoint.

The durable distinction is:

- Current dataset storage requires Dylan's structured immediate target,
  `focus` or `activate`, timestamps, exact input, physical-invocation status,
  history eligibility, demo eligibility, quality, and utility fields.
  Strictly-prior screenshots are deferred.
- The historical frozen V4 design bounded predictor exposure to the current
  monitor 3 screenshot alone or that screenshot plus the rolling ten prior
  eligible monitor 3 state-action rows. The new expanded-history policy has
  not yet been frozen.
- The logical experiment session is `BLOG-WORK-20260727`; capture segment `A`, `B`, `C`, or `D` is recorded separately.
- Dataset eligibility follows one frozen predicate. Smoke and main manifests are chronological and versioned.
- History membership is derived from the same frozen main manifest, not manually selected or stored in the ground-truth row.
- The frozen V4 design used at least ten history-only rows followed by exactly
  20 held-out targets and 40 calls; no such roles are currently assigned.
- Exact target, action type, exact action, semantic equivalence, and shortcut
  usefulness are separate outputs.
- Collection stopped after 220 retained candidates. The next experimental
  split and expanded-history construction must be designed and frozen before
  predictions.

## Canonical vault notes

Read in this order:

1. [[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history produced five exact top-three wins and no losses in NAP V5]]
2. [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
3. [[computer-use-nap-build-log|Computer-use NAP build log]]
4. [[computer-use-nap-v5-expanded-history-experiment-design-2026-07-29|Computer-use NAP V5 expanded-history experiment design, July 29, 2026]]
5. [[workflow-history-can-recover-recurring-destinations-without-general-next-action-competence|Workflow history can recover recurring destinations without general next-action competence]]
6. [[a-first-computer-navigation-autocomplete-should-rank-candidates-and-abstain|A first computer navigation autocomplete should rank candidates and abstain]]
7. [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]
8. [[computer-use-nap-shadow-experiment#July 26 decision: manual retrospective prediction pilot|Manual retrospective prediction pilot]]
9. [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
10. [[computer-use-nap-fidelity-research-2026-07-26|Computer-use NAP dataset-fidelity research]]
11. [[computer-use-nap-30-action-walkthrough-2026-07-24|What the 30-action walkthrough was]]
12. [[computer-use-nap-walkthrough-handoff-2026-07-24|Historical custom-capture handoff]]
13. [[blog-prep-day-0-took-three-days|Blog prep: Day 0 Took Three Days]]
14. [[day-0-took-three-days|The Missing Step Between Recording and Prediction]]
15. [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]]
16. [[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan, July 28, 2026]]
17. [[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc semantic rescore, July 28, 2026]]
18. [[90-meta/computer-use-nap-smoke-harness/README|Computer-use NAP smoke harness V2]]
19. [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Candidate shakedown predictor packets, July 28, 2026]]

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

> Read this handoff, the V5 result, and the V5 post-results synthesis. V5 is a
> completed immutable 22-call experiment with ten scorable pairs. Its official
> structured exact top-three result is state-only 0/10 versus history 5/10,
> paired five history wins, zero state wins, and five ties. All five exact hits
> were returns to the same recurring Codex task family; four were clean
> exact-and-semantic wins and one was a canonical task-name win where
> state-only already identified the same practical composer. No Arc target was
> an exact hit. Do not rerun V5. The next test should rank a shared hierarchical
> list of executable candidates, retrieve comparable personal history, and
> abstain when confidence is low. Collect diverse non-Codex transitions before
> that test. Do not fine-tune yet, restore excluded candidates, mutate
> Screenpipe, resume the custom capture stack, modify the article, or build an
> extractor unless Dylan asks.
