---
type: synthesis
status: active
created: 2026-07-22
updated: 2026-07-30
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
sources:
  - dylan-niyant-computer-use-nap-followup-2026-07-22
  - omar-shaikh-computer-use-personalization-stack-2026-07-22
  - screenpipe-live-capture-audit-2026-07-23
  - computer-use-capture-tool-research-2026-07-23
people:
  - dylan-vu
  - niyant
  - omar-shaikh
orgs:
  - general-user-models
tags:
  - experiment
  - computer-use
  - shadow-mode
  - semantic-routing
  - invalidation
---

# Computer-use NAP shadow experiment

## July 30 V5 result and current interpretation

The roughly 200-row manual collection and V5 expanded-history comparison are
complete. This supersedes the V3/V4 continuation directions below while
preserving them as experimental history.

On ten scorable paired targets, state-only scored 0/10 structured exact
top-three and state plus history scored 5/10. All five exact history hits were
returns to the same recurring `Patch NAP blog prep in vault` Codex task family;
all five Arc targets were missed.

Target-level review separates the result into four clean
exact-and-primary-semantic history wins, one canonical task-identity win where
state-only had already named the same practical composer generically, three
clear shared failures, and two granularity-sensitive Arc misses.

The result supports recurring-task recall, not general next-action competence.
The next product test should not rerun V5 or immediately fine-tune a personal
model. It should rank a shared hierarchical list of executable app, window,
task, document, page, and control candidates, retrieve comparable earlier
states, and abstain outside high-confidence patterns.

See
[[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history
produced five exact top-three wins and no losses in NAP V5]] and
[[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a
first navigation autocomplete still needs]].

## July 28 smoke result and current decision

The first retrospective model comparison is complete. This supersedes the
acquisition-first and five-row-next decisions below while preserving them as
history.

`BLOG-SMOKE-20260728-V3` ran 19 paired targets from one manually labeled
Screenpipe sequence. The same `gpt-5.6-sol` / `max` predictor received either
the current two-monitor state alone or that state plus every earlier frozen
state-action row.

In the preregistered transport-recovered view:

| Condition | Exact top-1 | Exact top-3 |
|---|---:|---:|
| Current screenshots only | 0/19 | 0/19 |
| Current screenshots plus all earlier rows | 5/19 | 6/19 |

In ordinary accuracy terms, history was correct on 5 targets and incorrect on
14 at top-1; it was correct on 6 and incorrect on 13 at top-3. In paired
win/loss/tie terms, that is 5 wins, 0 losses, and 14 ties at top-1, and 6 wins,
0 losses, and 13 ties at top-3. A tie here usually means both conditions were
wrong, not that both were right. The positive examples include cross-app
routing to a Coda note, repeated returns to the Patch NAP Codex task, its
composer, and Twitter profile controls.

This is a provisional signal pass, not a scale-to-200 pass. The free-text exact
scorer had no accepted aliases. History saw earlier canonical labels while the
screen-only condition had to invent target wording. Apparently identical
destinations could fail because one prediction added `conversation`, `task`,
or `prompt`. The comparison therefore mixes behavioral signal with vocabulary
imitation.

A narrow post-hoc semantic sensitivity pass moved screen-only to 2/19 top-1
and 5/19 top-3, and history to 5/19 top-1 and 7/19 top-3. The paired result
became 4 history wins, 1 loss, and 14 ties at top-1, and 3 wins, 1 loss, and 15
ties at top-3. History still led, but less dramatically. The complete
provisional matrix is
[[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc semantic rescore, July 28, 2026]].

Fourteen history calls also recovered from WebSocket disconnects by falling
back to HTTPS. The frozen event classifier mistook the fallback error item for
tool use. This was detected before labels were revealed, and a condition-blind
recovery policy was checksum-frozen. Original attempts and labels remain
immutable.

The current decision is to finish condition-blind adjudication, freeze stable
destination identities and scoring, fix transport-event classification, then
resume chronological labeling on July 29. The larger pool supplies history;
reserve its final 20–30 new targets for a paired bounded-history retest that
night. Do not predict every row in the larger history pool. See
[[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]],
[[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc semantic rescore, July 28, 2026]],
[[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan, July 28, 2026]]
and [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]].

## Decision

Historical status: superseded by the July 28 manual-pilot result above.

Do not begin the model-comparison phase yet. First determine whether the available recorder can produce high-fidelity, exact semantic action labels across browser and native desktop use.

Tabracadabra is useful prior art for the writer interaction, but Dylan's distinct question is whether a model can route him to the exact place he intends to work next. Niyant explicitly identified computer-use NAP as useful work for Dylan or a second pair of hands, so this is now a complementary contribution path rather than a branch competing with Niyant's next-write experiment.

The first artifact is now an acquisition audit. It must show that the data can distinguish exact application, window, webpage, document, input-field, link, and button targets without future leakage. Only after this gate passes should the project build a retrospective offline replay from the captured history.

Build the Tab interface only if personal history improves prediction and the resulting routes would save meaningful work. The longer-term goal is a credible public demo, but the offline replay is the gate that keeps the demo from being a staged interaction with no evidence that personalization mattered.

### July 24 execution update

The Screenpipe-plus-patched-NAPsack plan below is now historical. Capture Layer v2 replaced it with Hammerspoon, one ScreenCaptureKit stream per display, and mandatory Arc browser evidence. The six-action smoke passed. A fixed 30-action component diagnostic is paused at 12/30 immutable accepted checkpoints, with Gmail `Settings` next.

The raw recorder evidence is preserved, but the semantic checkpoint validator was repaired during live collection, creating explicit source-inventory drift. This run can diagnose capture components; it is not the later blind calibration under one frozen runtime. Before resumption, remaining browser validators should be completed and tested in one batch. The exact state and resume procedure are in [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]].

## Proposed LBH

> Before beginning next-action prediction, determine whether an out-of-the-box or minimally augmented recorder can reconstruct at least roughly 90% of 50–100 meaningful browser and native-app actions as exact semantic targets, paired with a leakage-safe two-monitor pre-action state.

The previous predictor LBH is deferred, not rejected:

> Determine whether an off-the-shelf model predicts Dylan's next exact computer destination better as his personal history accumulates.

It becomes testable only after acquisition passes. Otherwise, poor predictions cannot be separated from missing, coarse, or incorrect action labels.

## July 23 Screenpipe audit

Screenpipe `2.5.132` is healthy and running in full input-capture mode on Dylan's Mac. Screen Recording, Accessibility, Input Monitoring, click capture, and keyboard capture are enabled. Clipboard and audio recording are disabled; the audio database contained zero chunks.

At the audit checkpoint, Screenpipe had captured 40 application switches, 128 clicks, 13 individual key events, 17 scroll gestures, 87 aggregated text bursts, 59 window-focus changes, and 139 JPEG screenshots. Arc URL capture worked across ten frames and three distinct pages.

The recorder therefore captures much more than OCR text. Its remaining weakness is semantic action identity:

- only 58 of 128 clicks had a direct element name;
- only 61 had an accessibility role and bounds;
- all four sampled Arc clicks had coordinates and screenshots, but none had a direct control role, name, or bounds; and
- webpage control focus is not guaranteed as a first-class event.

Post-hoc coordinate mapping into Arc's accessibility tree recovered two button hits, one static-text region, and one unresolved target. That is evidence that reconstruction may work, not evidence that it is reliable enough.

Dylan also uses two monitors. Screenpipe stores them separately and uses combined-desktop pointer coordinates. Every pre-action observation must therefore include the most recent leakage-safe frame from both displays. `ui_events.frame_id` cannot be used blindly because linked frames can precede or follow the event by seconds, describe another monitor, or already show the destination.

Full evidence and the raw acquisition schema are preserved in [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]].

### Natural-session result

The subsequent roughly 50-minute natural session makes the failure clearer. After collapsing near-identical raw and Accessibility-enriched click pairs, Screenpipe captured an estimated 150 physical clicks. Only 78 had a direct role, name, and bounds. More importantly, all 40 clicks on Dylan's secondary display lacked direct semantic target fields, including the Arc-to-Codex interactions closest to the proposed product.

Screenpipe successfully retained both-monitor frames, OCR, Accessibility trees, application and window changes, and active Arc URLs. It is therefore a useful contextual backbone. It is not sufficient as the exact action-label source. Starting the multi-day prediction comparison now would confound model quality with missing second-monitor and control-level labels.

### NAPsack calibration result

NAPsack `0.1.3` was installed under Python 3.13 and run concurrently with Screenpipe. The first run exposed a concrete dual-monitor bug rather than a failure of the underlying capture idea. NAPsack's input handler used `screeninfo` display coordinates, which placed Dylan's secondary display below the primary at positive `y`, while its screenshot worker and macOS pointer events used MSS physical coordinates, which placed that display above the primary at `y = -1440`. Secondary-display clicks therefore fell back to monitor 0 and could be paired with a primary-display screenshot.

The local NAPsack installation was patched so the input handler uses the same MSS monitor bounds as the screenshot worker. Two regression tests now verify that a primary-display point maps to monitor 0 and a negative-`y` secondary-display point maps to monitor 1.

The corrected run established:

- all seven secondary-display clicks were assigned to the secondary display with bounds `left = -557`, `top = -1440`, `width = 2560`, `height = 1440`;
- each click was paired with a pre-action screenshot from that display roughly 0.10 to 0.17 seconds before the click;
- direct Accessibility hit-testing exactly identified an Arc Gmail account tab and the pinned X favorite;
- Accessibility did not directly identify an X new-posts control or the Codex composer; and
- a blind screenshot-plus-click-location review recovered both missing meaningful targets.

This run does not yield a valid coverage percentage. Of the seven secondary-display clicks, only four were meaningful intended controls. The others landed on a window edge, static instruction text, or blank conversation space while Dylan was following or stopping the calibration. The four meaningful actions were reconstructable by combining Accessibility evidence with the pre-click image and coordinate, but four actions are far below the 30-action controlled calibration and the 50–100-action acquisition gate.

The current result is therefore: **monitor capture and leakage-safe click alignment pass; Accessibility-only semantic labeling fails; hybrid semantic reconstruction is promising but not yet validated at the required scale.**

## Recorder research decision

No single turnkey Mac recorder was found that combines exact Arc DOM targets, exact native controls, both monitors, raw timestamped events, and low-friction recording for hours of normal work.

The next move is a short acquisition calibration, not a long collection:

1. Keep Screenpipe running for both-monitor frames, applications, windows, URLs, OCR, and its existing event stream.
2. Run NAPsack directly with Accessibility enabled for a second raw action stream, active-monitor screenshots, and click-time macOS Accessibility hit-testing.
3. Exercise 30 known native, ordinary-web, dynamic-web, and cross-monitor interactions.
4. Add the Arc-compatible UI + API Recorder only if exact webpage controls remain the failing layer.
5. Begin one-to-two-hour natural capture only if the short stack clears the exact-target gate.

NAPsack is the preferred first addition because it is runnable today, comes from the same General User Models / LongNAP research line, and adds the specific click-time evidence Screenpipe lacks. It does not solve dual-monitor context or authoritative DOM identity by itself, which is why Screenpipe remains in the stack and browser instrumentation stays conditional.

On Dylan's Mac, install NAPsack with Python 3.13 and run the controlled session as documented in [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]. Do not use `--buffer-all-images`, and do not run cloud labeling for the acquisition calibration.

AgentNetTool has the highest out-of-the-box browser-label ceiling because its optional extension records DOM click targets and HTML, while its desktop tool captures input and Accessibility data. It is not the default because its Mac setup depends on OBS, officially records the main display, is designed around task-sized demonstrations, and has not been validated in Arc.

Full comparisons and limitations are preserved in [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]].

## Acquisition-first scope

Audit 50–100 meaningful navigation or control actions across Arc and native desktop applications.

Each reconstructed event must include:

| Field | Requirement |
|---|---|
| pre-action state | Latest leakage-safe frame from both monitors |
| source | Application, window, page or document, and URL when applicable |
| physical action | Switch, focus, click, key command, or page navigation |
| exact target | Application, window, object, control role, control name, and operation |
| target location | Display, global coordinates, and normalized local bounds |
| reconstructed-label provenance | Direct event, DOM event, accessibility hit-test, or visual reconstruction |
| manual audit label | Independent ground truth used to judge reconstruction |
| label confidence | High, ambiguous, or unresolved |
| resulting state | Validation evidence only, never predictive input |

Ordinary typing, scrolling, cursor repositioning, text selection, and window resizing remain outside the first prediction target unless they activate a new semantic destination.

The provisional gate passes if the capture and reconstruction stack independently produces the correct exact semantic target for roughly 90% or more of meaningful sampled actions when compared with manual audit ground truth. A target supplied only by the human auditor does not count in the numerator. Report browser and native-app performance separately. Manual-only, ambiguous, and unresolved actions remain in the denominator and cannot be silently excluded.

If Screenpipe-only reconstruction passes, proceed without adding instrumentation. If it fails, prefer an existing hybrid recorder that combines screen and application context with browser DOM events and native Accessibility hit-testing. Build custom instrumentation only if no out-of-the-box option meets the gate.

## Deferred prediction hypothesis

If the acquisition gate passes, test whether the current two-monitor state plus Dylan's correct recent personal history predicts his next exact semantic destination more accurately than recency, source-conditioned transition frequency, screen-only context, and mismatched history at a level that creates useful keyboard shortcuts.

The load-bearing product claim has three parts:

1. **Nontriviality:** Dylan's destinations have enough diversity that the task is not “choose one of three apps.”
2. **Personal signal:** Correct history adds predictive lift beyond the visible screen and generic habits.
3. **Product value:** Correct predictions remove meaningful navigation or target search, not merely one inconsequential click.

## What the later prediction experiment can and cannot show

The current acquisition audit can show only whether exact chronological examples can be reconstructed reliably. If it passes, the later prediction experiment can show whether one person's semantic handoffs contain nontrivial, useful predictive signal under a fixed offline setup and whether giving the same off-the-shelf model temporally valid personal history improves prediction over giving it the same two-monitor state alone.

It cannot establish:

- that the system understands Dylan's goals;
- that continual learning is required;
- that a trained personal model beats retrieval;
- that fine-tuning or changing model weights is necessary;
- that live suggestions improve outcomes;
- that other users share the same behavior;
- that an enterprise will adopt or pay for the product; or
- that later content, context-staging, preference-learning, and agentic rungs follow automatically.

## Prediction target

Predict the **next semantic focus**, not the next app, cursor coordinates, full action trajectory, or text payload.

A target label has four levels:

1. **Surface:** application or operating-system window.
2. **Object:** exact browser tab, document, thread, project, page, or panel.
3. **Control:** composer, search box, editor, link, or button.
4. **Operation:** focus, open, activate, or click.

Examples:

- `Codex → Personal AI task → composer → focus`
- `Chrome → LongNAP paper → results section → open`
- `Obsidian → Personal AI project note → editor → focus`
- `Slack → Niyant DM → reply field → focus`
- `Notion → article draft → publish button → click`

Include window changes, browser-tab changes, document or thread changes, input-field focus, link activation, and GUI-button activation. Exclude scrolling, text selection, cursor repositioning inside the same draft, window resizing, and ordinary typing.

The prediction point is immediately before the first navigation input. The observed label is the semantic target on which focus lands. This preserves the independence of the first rung: it asks only where Dylan went, not what he wrote, what context he needed, or what goal drove it.

## Minimum event record

Each handoff needs:

| Field | Meaning |
|---|---|
| timestamp | When the prediction point occurred |
| pre-action state | Latest leakage-safe screenshot from each monitor |
| source state | Active application, window, object, page or URL |
| recent semantic actions | A short, temporally correct history before the event |
| actual next target | The exact semantic destination label |
| target location | Display, global coordinates, and normalized local bounds |
| label provenance | How the target was obtained |
| label confidence | High, ambiguous, or unresolved |
| resulting state | Post-action evidence used to validate the label but never given to the predictor |
| navigation cost | Clicks, keystrokes, and approximate time actually used |
| declared block goal | Optional goal written before the work block, never inferred from the future |
| label ambiguity | Whether more than one destination description is reasonably correct |

Do not record more sensitive raw key data than the experiment needs. Prefer dedicated work blocks and local storage. Redact or exclude unrelated sensitive screens before model calls.

## Experimental sequence

### Setup: verify capture

The short Screenpipe smoke test passed raw physical-event capture but did not yet pass semantic labeling. Use the acquisition-first scope above to audit 50–100 events. Do not start the rolling Day 1–4 prediction comparison until the exact-target gate passes.

### Day 1: structure and initial history

Use the capture stack that passed the acquisition gate to record normal work without displaying predictions or changing behavior for the experiment.

- Record the screens and input events needed to reconstruct navigation.
- Write a block-level goal only if goal conditioning will be tested later. It is not required for the core history comparison.
- Define the semantic target labels and exclusions.
- Convert the raw capture into a chronological event structure containing what was visible, what Dylan did, and the exact stable destination reached next.
- Audit the pre-navigation cutoff and reconstruct a sample of real handoffs.
- Define the simple recency and transition baselines.

Day 1 produces the first usable history and establishes whether the proposed dataset can be reconstructed. It does not produce a personal-history comparison because no earlier recorded day exists yet.

### Days 2–4: rolling unseen replays

At the end of each new day, replay that day's navigation events against every amount of prior history then available:

| Test events | Conditions compared on those same events |
|---|---|
| Day 2 | screen only versus Day 1 history |
| Day 3 | screen only versus Day 2 history versus Days 1–2 history |
| Day 4 | screen only versus Day 3 history versus Days 2–3 history versus Days 1–3 history |

This produces preliminary signal after Day 2, a stronger check after Day 3, and the cleanest scaling comparison on Day 4. Do not infer improvement by comparing raw Day 2 accuracy with raw Day 3 or Day 4 accuracy because the work and target difficulty differ across days. Compare the history conditions against one another within each day.

For every replayed event:

1. Find the last unquestionably pre-navigation state.
2. Hide the navigation input, destination, and everything that followed.
3. Generate and save all predictions using only the permitted past.
4. Reveal the actual next stable destination.
5. Score whether it appeared first, appeared in the top three, or was missed.

For the final Day 4 comparison, apply the frozen inclusion rules to every eligible held-out handoff rather than choosing favorable examples after seeing the outcomes. If a history-selection method is used, it may use the current screen and other pre-navigation information, but it must remain blind to the destination and all post-cutoff data. Save any selected history and all predictions before revealing the label.

Rank up to three destinations or abstain under these conditions:

1. **MRU-3:** the three most recently used semantic destinations.
2. **Transition-3:** the three destinations most often reached next from this source state in the history available before that test day.
3. **Screen-only:** a frontier multimodal model receives only the current pre-navigation screen.
4. **Correct personal history:** the same model receives the same current screen plus the permitted one-, two-, or three-day personal history condition.
5. **Mismatched history:** the same amount of context comes from an unrelated block or task.
6. **Correct history plus declared goal:** an upper-bound condition that also receives Dylan's prewritten work-block goal.

The main personalization comparison is condition 3 versus condition 4. The model, current screen, prompt, output format, and candidate rules stay fixed. Only access to the earlier personal history changes. If a short immediate context window is tested later, add it as a separate condition rather than quietly including it in the screen-only baseline.

Start with structured raw history if it fits within practical context, latency, and cost limits. Introduce a separate retrieval step only when the full history no longer fits comfortably. Day 2 and Day 3 are directional pilots and may expose data-structure problems. Freeze the final structure, model, prompt, and scoring setup before the Day 4 replay.

Do not fine-tune during this gate. This test asks whether access to accumulating personal history helps at all. A later experiment can compare raw context, retrieval, and models trained on increasing amounts of activity.

### After a positive offline result

Replay 10–15 high-confidence cases as a simulated top-three hotkey interface. A simple mock or human operator can present the choices. Ask:

- Would I actually have pressed one of these?
- Did the hit save one click, several actions, or a search for the right context?
- How distracting was a wrong slate?
- Would I leave an always-on version installed with the required permissions?

This tests the interaction before investing in a live global hotkey, focus control, or training pipeline.

## Path to a public demo

1. **Offline replay:** establish that correct personal history improves prediction over screen-only and simple habits.
2. **Live shadow mode:** make predictions in real time without showing them, confirming that the offline result survives present-day latency and capture.
3. **Live Tab interface:** show up to three routes, allow instant dismissal, and measure actual use, time saved, wrong-route recovery, and retention.
4. **Public artifact:** publish an honest demonstration plus the complete held-out result summary, including misses and the limits of a single-user test.
5. **Later learning test:** after collecting substantially more data, compare the best recall system with models trained on increasing amounts of Dylan's activity.

The first defensible public claim is narrow: an off-the-shelf model predicted one person's next exact computer destination better when it could recall that person's earlier work, and a live interface converted some of those predictions into useful shortcuts. A stronger claim about the model learning Dylan requires the later training comparison.

## Metrics

### Prediction

- exact-target Hit@1 and Hit@3;
- coverage at each confidence threshold;
- accuracy-versus-coverage when abstention is allowed;
- performance by app, object, control, and operation level;
- correct-history lift over screen-only and mismatched-history conditions;
- label ambiguity and human agreement;
- number and entropy of distinct semantic destinations.

Do not use a vague LLM similarity judge for the first rung. Exact semantic destinations should be scored deterministically after aliases are normalized.

### Product value

- whether Dylan would have selected the suggested destination;
- physical navigation actions avoided;
- time or target-search avoided;
- false-trigger and wrong-suggestion cost;
- reversals after accepting a suggestion;
- useful hits available per workday;
- willingness to keep the system installed.

Correctness and value are separate. A prediction can match what Dylan did while being too cheap, obvious, late, or distracting to deserve a product.

## Decision gates

These are personal branch-selection thresholds, not publication standards.

### Unlock the prediction experiment if

- roughly 90% or more of 50–100 audited meaningful actions have the correct exact semantic target;
- browser and native-app coverage each pass rather than one hiding weakness in the other;
- unresolved and ambiguous actions were retained in the denominator;
- the leakage-safe two-monitor pre-action state can be reconstructed consistently; and
- the capture stack produces one unified chronological stream without relying on future state as model input.

### Unlock the simulated interaction if

- the held-out set contains roughly 30 or more usable handoffs and at least about 10 distinct semantic destinations;
- MRU-3 and Transition-3 do not already solve the task;
- correct history shows clear directional lift over screen-only and mismatched history, ideally around 15 percentage points or more in Hit@3;
- several correct-history wins cannot be explained from the current screen alone.

These prediction results unlock only the simulated top-three interaction. They do not yet justify a live product or public product-value claim.

### Continue toward a live prototype if

- the prediction gate above passes;
- at least five plausible daily hits save three or more physical actions, avoid hunting for a target, or preserve meaningful working context; and
- Dylan would actually use the slate and tolerate its capture permissions.

### Kill, demote, or change the target if

- three destinations account for nearly all behavior;
- a source-transition rule nearly matches the context model;
- correct personal history adds no clear lift;
- targets cannot be labeled consistently;
- correct suggestions mostly replace one click;
- useful opportunities are too rare;
- wrong suggestions are cognitively expensive even when easy to dismiss; or
- Dylan would not leave the required observation permissions enabled.

Failure of this test invalidates or weakens the routing wedge. It does not invalidate Niyant's next-write target or the broader personalization thesis.

## Interpretation matrix

| Result | Interpretation |
|---|---|
| Routing wins and correct history matters | Build the live semantic-routing wedge |
| Screen-only performs similarly | A general computer-use model or contextual launcher may be sufficient |
| Declared goal helps but passive history does not | Explore a Just-In-Time Objective interface rather than continual personalization |
| History helps prediction but routes save little | Personal signal exists, but the product target is wrong |
| Simple app or transition baselines dominate | This is a shortcut launcher, not evidence of personal understanding |
| Labels remain ambiguous | Repair the semantic action ontology before modeling |
| No condition produces product pull | Return to GPU financing or choose another personalization rung without claiming the thesis was disproven |

## Division of labor

Dylan does not need Niyant-level ML depth for this first gate. Screenpipe already supplies useful raw recording, but the final capture stack remains open until exact semantic labeling passes. The remaining work is acquisition research, dataset reconstruction, manual audit, and only then controlled replay.

- **Dylan owns:** running Screenpipe, the product question, semantic target labels, value judgments, privacy tolerance, and whether a hit feels useful.
- **Codex or a technical analyst owns:** extracting the last pre-action state, preventing future leakage, running matched model calls, selecting context, calculating baselines, and scoring.
- **Niyant reviews:** whether the target and controls produce evidence relevant to the broader thesis.

Niyant-level technical depth becomes necessary after this gate if the work turns to data-pipeline architecture, SFT versus retrieval, per-user training, continual updates, or scientific claims about why a model improved.

## Immediate next step

Batch-complete and freeze the remaining Capture Layer v2 browser validators, revalidate the preserved diagnostic checkpoints where practical, and resume the existing session at step 13. Do not repeat steps 1–12.

When the component diagnostic finishes, write the measured capture contract and implement the later blind 30-action calibration. Only after that formal calibration passes should the project record one to two hours of normal work as acquisition-audit material, not prediction-training data. Reconstruct and manually inspect 50–100 meaningful clicks, switches, focus changes, key commands, and page navigations. Only if that natural audit reaches the roughly 90% exact-target gate without silent losses should the project freeze the event schema and begin multi-day history collection.

If the controlled or natural audit fails mainly on webpage controls, add Arc DOM instrumentation and rerun that category. If failures are broad, repair or replace the acquisition stack before collecting more work.

Send Niyant the revised contract for a one-pass check that exact semantic routing is the intended first rung. That review does not need to block raw collection.

## Links

- Build ledger: [[computer-use-nap-build-log|Computer-use NAP build log]]
- Operational handoff: [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]]
- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Product hunch: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Niyant follow-up: [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- Prior art: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Tada boundary: [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]
- Live capture audit: [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]


## July 26 decision: manual retrospective prediction pilot

This section supersedes the earlier Immediate next step and acquisition-first gate for the next LBH. The earlier capture plan remains in this note as historical context.

After three days of acquisition work, pause the audit-grade capture build. The capture work established that high-fidelity computer-use data is obtainable by combining screen, input, accessibility, and browser evidence, but no current out-of-the-box tool produces the complete dataset reliably. Building that automatic acquisition layer is a separate product-development problem.

That automatic layer is not required to answer the first product question. Human review can supply the missing event boundaries and exact destination labels. The immediate experiment therefore uses Screenpipe as a replayable record and Dylan as the ground-truth labeler.

### Question

Can the same off-the-shelf multimodal model generate top-three next-destination suggestions that Dylan finds useful during his normal work, and does giving the model Dylan's earlier activity improve those suggestions compared with the current screen alone?

This is retrospective. There are no live suggestions, no fine-tuning, and no trained personal model.

### Minimum sequence

1. Run a five-event shakedown from one 30-minute work session.
2. If the replay, labeling, prompt, and scoring workflow works, run the two-day minimum experiment.
3. Only run the original four-day 0/1/2/3-day scaling study if the two-day test produces promising signal.

### Recording protocol

For the five-event shakedown, use Screenpipe only. Leave the custom Hammerspoon, ScreenCaptureKit freeze, browser recorder, markers, and 30-action calibration machinery off.

- Confirm Screenpipe is recording both monitors.
- Keep microphone, audio, and clipboard capture off.
- Record the exact start and end time.
- Work normally for 30 minutes on one real task, such as GPU customer or configuration research.
- Do not stage actions, announce transitions, or change behavior for the experiment.
- Afterward, select only moments that Screenpipe captured clearly.

The experiment does not require Screenpipe to detect or label every action. It only requires enough visual evidence for a human to reconstruct a small set of clear transitions.

### Unit of data

One data point is one semantic transition:

starting state A -> destination B

This is not a pair of two actions. A is the place Dylan occupied immediately before navigating. B is the stable destination reached at the end of that navigation. The clicks and keystrokes between A and B are the route.

A route may contain several low-level inputs while still counting as one data point if they are continuous and serve one destination.

Example:

- A: Arc -> LongNAP paper -> conclusion
- Route: click Codex, select the NAP task, focus its composer
- B: Codex -> NAP task -> composer -> focus

The prediction point is immediately before the first navigation input. The model may see A and permitted earlier history. It may not see the route, B, or any post-action frame.

### What Dylan does to label one event

1. Replay the recording and find a clear, meaningful navigation.
2. Pause immediately before the first click or keystroke that begins the navigation.
3. Record the timestamp and save or reference the pre-action frame from each relevant monitor.
4. Write the current semantic location.
5. Play forward until the destination stabilizes.
6. Write the route and exact destination as hidden ground truth.
7. Estimate what a correct shortcut would have saved.
8. Mark any ambiguity. Exclude the event if the source or destination cannot be labeled confidently.

Example labeled event:

Event D2-007

- Timestamp: 2:17:42 PM
- Current location: Arc -> LongNAP paper -> conclusion
- Pre-action evidence: event-D2-007-before-primary.png and event-D2-007-before-secondary.png
- Actual route, hidden from predictor: clicked Codex, selected NAP task, focused composer
- Exact destination, hidden from predictor: Codex -> NAP task -> composer -> focus
- Actual navigation cost: 3 clicks, approximately 6 seconds
- Useful shortcut: yes
- Ambiguity: none

### Dataset structure

The dataset has two related views of the same chronological activity.

#### History log

The history log is a compact chronological list of earlier meaningful destinations. Each entry should be one line and approximately 10 to 25 words, not a paragraph.

Example:

- 2:01 PM - Arc -> RunPod pricing page
- 2:05 PM - Arc -> Google search for available H100 instances
- 2:09 PM - Arc -> Hyperbolic pricing page
- 2:12 PM - Codex -> GPU configuration research task -> composer
- 2:15 PM - Arc -> LongNAP paper -> conclusion

Do not include ordinary typing, every scroll, or every cursor movement. The log represents meaningful handoffs between working contexts.

#### Evaluation rows

Each evaluation row contains these fields:

- event_id: stable identifier
- timestamp: location in the replay
- current_state: semantic location immediately before navigation
- pre_action_evidence: screenshots or Screenpipe frame references available to the model
- available_history: earlier history permitted for that condition
- actual_route: held-out low-level path used by Dylan
- actual_destination: held-out semantic answer
- navigation_cost: clicks, keystrokes, and approximate time used
- label_confidence: clear, ambiguous, or excluded
- shortcut_usefulness: Dylan's qualitative judgment after seeing the prediction

The predictor receives only current_state, pre_action_evidence, and the history allowed for that condition. Actual_route, actual_destination, and everything after the cutoff remain hidden until predictions are saved.

### What counts as a navigation event

Include:

- switching to another application or window;
- opening a specific browser tab or webpage;
- opening a document, message thread, project, or Codex task;
- focusing a meaningful input field;
- activating a link or button that changes the working context; and
- a continuous multi-click route to one specific destination.

Exclude:

- ordinary typing;
- scrolling within the same page;
- cursor repositioning;
- text selection;
- window resizing;
- clicks that do not meaningfully change the working context; and
- events whose pre-action state or final destination is unclear.

### Five-event shakedown

Use one 30-minute session and label five clear transitions. For each event, test the same model twice:

1. Current pre-action state only.
2. The same state plus the preceding ten meaningful navigation events from that session.

Use the same prediction prompt and request up to three exact semantic destinations. Save both predictions before revealing the actual destination.

The shakedown passes if all five examples can be reconstructed, prompted, and scored without rebuilding capture infrastructure. Its purpose is workflow validation, not a product conclusion.

### Two-day minimum experiment

Day 1 supplies the personal history. Day 2 supplies 20 held-out evaluation events.

- Label Day 1 as a chronological one-line history log.
- Label 20 clear Day 2 transitions using the evaluation schema.
- For every Day 2 event, run the same model and prompt under two conditions: current pre-action state only, and the same state plus the Day 1 history log.
- Neither condition may see the actual route, destination, or future frames.
- Save all predictions before scoring them.

This is the smallest credible version of the original Day 1 through Day 4 experiment. It tests whether earlier personal activity adds useful predictive signal without requiring a four-day commitment first.

### Scoring and decision

For every prediction, record:

- whether the actual destination ranked first;
- whether it appeared anywhere in the top three;
- whether a suggested shortcut would have saved meaningful navigation or search;
- what the shortcut would have saved; and
- Dylan's qualitative reaction, including whether he would have wanted to invoke it while working.

Report raw counts and representative successes and failures. Do not hide ambiguous or failed examples.

The main decision remains qualitative: did the suggestions produce enough moments of genuine usefulness to justify building a live public demo?

The history comparison is secondary but informative: did Day 1 context noticeably improve the suggestions over the same model seeing only the current state?

If promising, write a public experiment post, describe the strongest proposed demo interactions, and then decide whether to build the live Tab-style router or run the longer history-scaling study. If unpromising, stop or change the navigation target before investing further in model or capture complexity.

### What this experiment cannot establish

This pilot cannot show that the model understands Dylan's goals, that fine-tuning is necessary, that the behavior generalizes to other people, that live suggestions improve outcomes, or that the automatic acquisition product is solved. It only tests whether one person's real work contains useful next-destination prediction opportunities and whether earlier personal activity appears to help an off-the-shelf model exploit them.

### July 28 update: full-fidelity rows and recent-ten context

Dylan clarified that the immediate raw source is his roughly five-hour Screenpipe recording of building the blog post, which he will label manually. This update supersedes the earlier instruction to finish the full dataset before a shakedown and the compact text-only history format for this same-session run.

The durable ground-truth row pairs:

- one strictly pre-navigation screenshot from each monitor;
- a structured textual label for the exact semantic destination reached afterward;
- exact cutoff and destination-stabilization timestamps;
- the hidden human route; and
- a later screenshot retained only to verify that the destination label is correct.

The predictor never sees the current row's route, destination, later screenshot, labeler notes, or future activity.

The immediate sequence is:

1. Build the first five complete rows.
2. Run a state-only smoke test to confirm those rows can be rendered, predicted, and scored without changing the contract.
3. If the workflow passes, continue labeling toward approximately 60 eligible rows.
4. Use the first ten eligible rows as initial history.
5. On approximately 50 later rows, compare current screenshots only against the same screenshots plus the ten most recent eligible historical rows.

For a target row, history selection is mechanical. Consider only clear, allowed, human-initiated rows whose destinations stabilized before the target cutoff; sort them chronologically; take the last ten; and present them oldest to newest. Each historical row contributes both before-state screenshots, its known textual destination, and its timestamp. Do not select examples because they appear similar to the current target.

The five-row smoke test validates workflow only. The later paired same-session comparison supplies exploratory go/no-go evidence about recent task context, not statistically conclusive evidence or durable personalization. Full-fidelity storage preserves the option to rerun later tests with recent 5, recent 20, all prior, retrieved-similar, or deliberately mismatched history without relabeling the source data.

This proposed five-row-then-60 sequence was superseded later on July 28. Dylan
approved a 20-row all-prior smoke checkpoint instead. That V3 experiment is now
complete; its result and current decision are recorded at the top of this note.
