---
type: synthesis
status: active
created: 2026-07-22
updated: 2026-07-23
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

## Decision

Do not begin the model-comparison phase yet. First determine whether the available recorder can produce high-fidelity, exact semantic action labels across browser and native desktop use.

Tabracadabra is useful prior art for the writer interaction, but Dylan's distinct question is whether a model can route him to the exact place he intends to work next. Niyant explicitly identified computer-use NAP as useful work for Dylan or a second pair of hands, so this is now a complementary contribution path rather than a branch competing with Niyant's next-write experiment.

The first artifact is now an acquisition audit. It must show that the data can distinguish exact application, window, webpage, document, input-field, link, and button targets without future leakage. Only after this gate passes should the project build a retrospective offline replay from the captured history.

Build the Tab interface only if personal history improves prediction and the resulting routes would save meaningful work. The longer-term goal is a credible public demo, but the offline replay is the gate that keeps the demo from being a staged interaction with no evidence that personalization mattered.

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

Research current out-of-the-box recorders and instrumentation that can capture exact browser DOM clicks and focus, native desktop controls, two-monitor pre-action state, application and window identity, and a unified chronological event stream.

In parallel, let Screenpipe continue recording normal work. Treat the next one to two hours as acquisition-audit material, not prediction-training data. Reconstruct and manually inspect 50–100 meaningful actions. If an existing tool or Screenpipe-only reconstruction reaches the semantic-label gate, freeze the event schema and begin the multi-day history collection.

Send Niyant the revised contract for a one-pass check that exact semantic routing is the intended first rung. That review does not need to block raw collection.

## Links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Product hunch: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Niyant follow-up: [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- Prior art: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Tada boundary: [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]
- Live capture audit: [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
