---
type: synthesis
status: active
created: 2026-07-22
updated: 2026-07-22
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
sources:
  - dylan-niyant-computer-use-nap-followup-2026-07-22
  - omar-shaikh-computer-use-personalization-stack-2026-07-22
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

Go directly to a shadow-mode test of Dylan's computer-use NAP. Do not make trying Tabracadabra a prerequisite.

Tabracadabra is useful prior art for the writer interaction, but Dylan's distinct question is whether a model can route him to the exact place he intends to work next. Niyant explicitly identified computer-use NAP as useful work for Dylan or a second pair of hands, so this is now a complementary contribution path rather than a branch competing with Niyant's next-write experiment.

The first artifact should be an offline benchmark, not a polished macOS application and not a new training method. Build the Tab interface only if the underlying prediction target survives.

## Proposed LBH

> Within two to three days, determine whether Dylan's exact semantic computer destinations are diverse and predictable beyond simple navigation habits, and whether sufficiently accurate top-three suggestions would save enough work to justify building a live Tab interface.

## Hypothesis

Given only information available immediately before navigation, the current screen plus Dylan's correct recent personal history will predict his next exact semantic destination more accurately than recency, source-conditioned transition frequency, screen-only context, and mismatched history at a level that creates useful keyboard shortcuts.

The load-bearing product claim has three parts:

1. **Nontriviality:** Dylan's destinations have enough diversity that the task is not “choose one of three apps.”
2. **Personal signal:** Correct history adds predictive lift beyond the visible screen and generic habits.
3. **Product value:** Correct predictions remove meaningful navigation or target search, not merely one inconsequential click.

## What this experiment can and cannot show

It can show whether one person's semantic handoffs contain nontrivial, useful predictive signal under a fixed offline setup.

It cannot establish:

- that the system understands Dylan's goals;
- that continual learning is required;
- that a trained personal model beats retrieval;
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
| pre-action screenshot | What was visible before navigation |
| recent semantic actions | A short, temporally correct history before the event |
| actual next target | The exact semantic destination label |
| navigation cost | Clicks, keystrokes, and approximate time actually used |
| declared block goal | Optional goal written before the work block, never inferred from the future |
| label ambiguity | Whether more than one destination description is reasonably correct |

Do not record more sensitive raw key data than the experiment needs. Prefer dedicated work blocks and local storage. Redact or exclude unrelated sensitive screens before model calls.

## Experimental sequence

### Day 1: calibration and history

Run two ordinary 60–90 minute work blocks in a bounded, non-sensitive workspace.

- Write the block-level goal before starting.
- Capture natural semantic handoffs without showing suggestions.
- Agree on the label format and exclusion rules.
- Build the simple recency and transition baselines.
- Freeze the prompt, history window, and scoring rules before the held-out session.

Day 1 is calibration and context. Do not report its tuned accuracy as the result.

### Day 2: chronological held-out test

Capture 30–50 new handoffs without changing the rules. For each event, freeze the trace immediately before navigation, commit all predictions, then reveal the future.

Rank up to three destinations or abstain under these conditions:

1. **MRU-3:** the three most recently used semantic destinations.
2. **Transition-3:** the three destinations most often reached next from this source state during Day 1.
3. **Screen-only:** a frontier multimodal model receives the current screen and short immediate history.
4. **Correct personal history:** the same model also receives relevant Day 1 history.
5. **Mismatched history:** the same amount of context comes from an unrelated block or task.
6. **Correct history plus declared goal:** an upper-bound condition that also receives Dylan's prewritten work-block goal.

Use the same underlying model and fixed prompt for the comparable model conditions. Do not fine-tune during this gate. The goal is to determine whether a target is worth engineering, not which learning algorithm ultimately wins.

### Day 3: optional Wizard-of-Oz experience

Only if the offline result shows signal, replay 10–15 high-confidence cases as a fake top-three hotkey interface. A simple mock or human operator can present the choices. Ask:

- Would I actually have pressed one of these?
- Did the hit save one click, several actions, or a search for the right context?
- How distracting was a wrong slate?
- Would I leave an always-on version installed with the required permissions?

This tests the interaction before investing in a live global hotkey, focus control, or training pipeline.

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

### Continue toward a live prototype if

- the held-out set contains roughly 30 or more usable handoffs and at least about 10 distinct semantic destinations;
- MRU-3 and Transition-3 do not already solve the task;
- correct history shows clear directional lift over screen-only and mismatched history, ideally around 15 percentage points or more in Hit@3;
- several correct-history wins cannot be explained from the current screen alone;
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

Dylan does not need Niyant-level ML depth for this first gate.

- **Dylan owns:** the product question, semantic target ontology, work-block goals, labels, value judgments, privacy tolerance, and whether a hit feels useful.
- **A technical second pair of hands owns:** capture instrumentation, freezing pre-action observations, blinded model calls, context matching, baseline implementation, and scoring hygiene.
- **Niyant reviews:** whether the target and controls produce evidence relevant to the broader thesis.

Niyant-level technical depth becomes necessary after this gate if the work turns to data-pipeline architecture, SFT versus retrieval, per-user training, continual updates, or scientific claims about why a model improved.

## Immediate next step

Send Niyant a one-page experiment contract that states:

- navigation-only target;
- exact semantic labels;
- top-three plus abstention;
- chronological holdout;
- recency, transition, screen-only, correct-history, and mismatched-history conditions;
- product-value measures; and
- explicit nonclaims.

Ask whether “computer-use NAP” means this exact first rung or a broader action/content target. Do not expand the implementation until that scope is resolved.

## Links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Product hunch: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Niyant follow-up: [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- Prior art: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Tada boundary: [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]

