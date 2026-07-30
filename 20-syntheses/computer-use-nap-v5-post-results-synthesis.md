---
type: synthesis
status: active
created: 2026-07-30
updated: 2026-07-30
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - personalization
  - evaluation
  - product-design
---

# What NAP V5 established and what a first navigation autocomplete still needs

## Bottom line

NAP V5 found a real but narrow personalization effect. With the same current
monitor-3 screenshot, state-only produced no structured exact top-three hits
on ten scorable targets. Adding Dylan's earlier workflow history produced five.
All five exact hits were returns to the recurring
`Patch NAP blog prep in vault` Codex task or its composer. History produced no
exact hit on any of the five Arc targets.

The best plain-English read is:

> History learned a recurring return-to-task pattern. It did not demonstrate a
> general ability to predict Dylan's next computer destination.

The target-level review narrows the headline further:

- four of the five exact history wins were also clean blind primary-semantic
  wins;
- the fifth, target 10, was an exact-identity win but a practical semantic
  tie, because state-only already predicted the correct Codex composer using a
  generic label;
- three Arc cases were clear shared failures;
- two Arc cases were labeling-sensitive near misses rather than clean evidence
  that both models chose the wrong window.

This is enough evidence to motivate a rough personalized navigation-
autocomplete V1. It is not evidence that fine-tuning, a massive data set, or a
new LLM algorithm is already required. The first missing system layer is a
structured candidate ranker with confidence-gated abstention.

## Frozen experiment

The experiment scheduled 11 paired targets and 22 calls to the same
`gpt-5.6-sol` predictor at `max` reasoning:

1. **State-only:** the current strictly prior monitor-3 screenshot.
2. **State plus hybrid history:** the identical screenshot, every earlier
   accepted structured action, and the ten most recent recoverable earlier
   screenshot/action pairs.

The first target pair was unscorable because both calls inherited a
network-disabled launcher. The remaining ten pairs produced 20 valid outputs.

Official objective results:

| Metric | State-only | State + history |
| --- | ---: | ---: |
| Structured exact top-1 | 0/10 | **3/10** |
| Structured exact top-3 | 0/10 | **5/10** |
| Exact-action top-1 | 0/10 | **3/10** |
| Exact-action top-3 | 0/10 | **5/10** |

The paired exact top-three result was five history wins, zero state-only wins,
and five miss ties. A tie normally means both conditions missed.

The blind Codex-proxy primary-semantic result was 1/10 versus 5/10 at top
three. When `uncertain` decisions were counted as matches, it became 2/10
versus 7/10. These semantic numbers are sensitivity evidence, not
Dylan-authoritative adjudication.

## Exact ten-target read

| Target | Source event | Actual next action | State exact | History exact | Practical read |
| --- | --- | --- | ---: | ---: | --- |
| 2 | `BLOG-V4-079` | Focus recurring Codex task | miss | **rank 2** | Clean history win |
| 3 | `BLOG-V4-110` | Focus recurring Codex task | miss | **rank 1** | Clean history win |
| 4 | `BLOG-V4-121` | Focus recurring Codex task | miss | **rank 1** | Clean history win |
| 5 | `BLOG-V4-123` | Focus Arc Notion page | miss | miss | History's Arc meetings-page guess was proxy-uncertain |
| 6 | `BLOG-V4-124` | Focus recurring Codex task | miss | **rank 3** | Clean history win |
| 7 | `BLOG-V4-142` | Focus Arc | miss | miss | Both rank-one guesses pointed to the visible Meetings window but exceeded the coarse label |
| 8 | `BLOG-V4-148` | Activate Handsdiff handle-copy control | miss | miss | History found the profile, not the control |
| 9 | `BLOG-V4-151` | Activate Handsdiff Subscribe control | miss | miss | Clear shared failure despite the visible button |
| 10 | `BLOG-V4-155` | Focus recurring Codex composer | miss | **rank 1** | Exact history win, semantic tie |
| 11 | `BLOG-V4-230` | Activate Arc Notion shortcut | miss | miss | Clear shared failure |

### Target 2

Actual: focus `Codex -> Patch NAP blog prep in vault`.

State-only predicted a Codex article link, a VS Code revision-history link,
and a Codex Review control. History ranked the VS Code article first and the
exact recurring Codex task second. This was a clean exact and semantic history
win.

### Target 3

Actual: focus `Codex -> Patch NAP blog prep in vault`.

State-only proposed Review, a generic Codex composer, and Read in context.
History named the exact recurring task at rank one. This was a clean exact and
semantic history win.

### Target 4

Actual: focus `Codex -> Patch NAP blog prep in vault`.

State-only proposed a generic message composer and two review links. History
named the exact recurring task at rank one. This was a clean exact and
semantic history win.

### Target 5

Actual: focus `Arc -> Notion page`.

State-only proposed three Codex destinations. History proposed the recurring
Codex composer first and `Arc -> Coda -> all hands 7.27 -> editor/body`
second. The exact scorer rejected the second prediction; the blind proxy
called it `uncertain`, not `same`. This is an official miss tie but not a clean
behavioral failure.

### Target 6

Actual: focus `Codex -> Patch NAP blog prep in vault`.

State-only proposed the generic composer and two file links. History proposed
the recurring task's composer first, VS Code second, and the exact task object
third. This was a clean exact and semantic history win at rank three.

### Target 7

Actual: focus `Arc`, with no object in the frozen target.

The screenshot showed Mission Control with the Meetings window outlined in
blue. State-only predicted `Notion -> Meetings window`; history predicted
`Arc -> Notion — Meetings -> all hands 7.27`. Exact scoring rejected both
because the accepted target stopped at the application level. The proxy called
both rank-one predictions `uncertain`.

This is likely a scorer-granularity false negative. It should remain an
official exact miss, but it is weak evidence that the model failed to identify
the intended window.

### Target 8

Actual: activate
`Arc -> Handsdiff profile -> @handsdiff handle copy control`.

State-only predicted Codex Send, Codex Review, and focusing the visible Arc
profile. History predicted the Codex composer, the Handsdiff personal-site
link, and Codex prompt submission. History recognized the relevant profile but
not the exact handle-copy control. This was a clear shared failure at control
granularity.

### Target 9

Actual: activate
`Arc -> Handsdiff Substack profile -> Subscribe control`.

The orange Subscribe button was prominent in the screenshot. State-only
predicted three Codex destinations. History predicted Codex, the Codex
composer, and VS Code. Neither named Subscribe. This is the cleanest evidence
that workflow history can over-bias the model toward a recurring loop and
reduce sensitivity to a visible one-off control.

### Target 10

Actual: focus
`Codex -> Patch NAP blog prep in vault -> composer`.

State-only's rank-one prediction was
`Codex -> message composer -> Do anything`. History's rank-one prediction used
the exact accepted task and composer names. The structured scorer therefore
awarded only history an exact hit, while the blind semantic proxy counted both
as the same destination.

This is a legitimate canonical-identity win but not a clean claim that history
alone knew the practical destination. Removing this naming-sensitive case
leaves four clean exact-and-semantic history wins.

### Target 11

Actual: activate `Arc -> Notion`.

State-only proposed the recurring Codex task, the wrong Arc meeting note, and a
Codex audit link. History proposed Codex, VS Code, and the Codex composer. Both
missed. State-only at least produced the right app and action type at rank two,
but the destination was wrong.

## What history learned

The five official exact history hits were:

- four returns from VS Code to the recurring Codex task or composer; and
- one return from Arc to that Codex task.

History hit all five scorable Codex targets and zero of five Arc targets.
Therefore, V5 supports recurring-task recall, not broad next-destination
competence.

This distinction matters because a larger quantity of similarly repetitive
history could strengthen the wrong behavior. If most recorded activity is a
Codex/article loop, simply adding more rows may make `return to Codex` an even
stronger default without teaching the model when Dylan will instead click a
browser control.

## Why a rough Cursor-Tab-like V1 is still plausible

The relevant comparison is not a mature, polished Cursor Tab. It is an early
version of the interaction: occasionally offer a useful completion when a
personal pattern is strong.

A rough navigation-autocomplete V1 does not need to predict every arbitrary
computer action. It could begin with:

- application;
- window;
- document, browser tab, or recurring task; and
- only later, prominent controls.

V5 already demonstrates one useful primitive for that product: personalized
history can recover a stable task identity that the screenshot alone does not
name reliably.

The gap from V5 to a rough V1 is more systems work than model research:

1. enumerate the destinations currently available;
2. represent them with stable IDs and a hierarchy;
3. retrieve genuinely comparable earlier states;
4. ask the model or a lightweight ranker to order those candidates;
5. surface a completion only when confidence is high; and
6. learn from accept, ignore, and override behavior.

## Candidate ranking is the main architectural correction

V5 asked the model to invent destination labels freely. This caused avoidable
errors:

- `message composer` versus the accepted named task and composer;
- `Arc` versus a more specific visible Meetings window;
- `Notion` versus `Coda`;
- correct profile versus wrong control.

A product should instead enumerate concrete, executable candidates from the
operating system, browser, accessibility tree, and current application state.
The prediction question becomes:

> Which of these available destinations is Dylan most likely to use next?

rather than:

> Invent the exact text label for what Dylan will do next.

The candidate set can be hierarchical:

`application -> window/task -> document/page -> control`.

Hierarchical scoring would preserve partial correctness without confusing it
with exact execution. A prediction may correctly choose Arc while missing the
page, or correctly choose the profile while missing Subscribe.

## Abstention is part of the product, not an evaluation escape hatch

A navigation autocomplete does not need full coverage. It should appear only
when the expected benefit exceeds distraction and recovery cost.

The initial V1 can specialize in high-confidence recurring transitions such
as:

- VS Code article -> named Codex task;
- Codex response -> working article;
- meeting note -> recurring task;
- one recurring browser tab -> another.

Low-confidence control-level cases can receive no suggestion. Coverage,
precision when shown, time saved, and override cost then matter alongside raw
top-one and top-three accuracy.

## Data requirement and fine-tuning

One good week of diverse personal activity could plausibly support a rough
app/window/task-routing V1. The useful property is diversity, not just row
count. Collection should include:

- several workflows rather than one Codex-heavy session;
- recurring transitions and deliberate departures from them;
- document and tab switching;
- interruptions and off-task browsing;
- browser controls and other fine-grained actions; and
- stable identifiers for every candidate visible before the action.

A week does not by itself establish a general arbitrary-control predictor. It
can test whether a confidence-gated personalized router produces enough useful
suggestions to justify a live shadow mode.

Fine-tuning is not the next required step. For a first version, use the same
frontier model with:

- the current structured state and screenshot;
- the list of executable candidates;
- recent actions;
- retrieved analogous historical situations; and
- an explicit option to abstain.

Fine-tuning becomes relevant only after enough diverse examples exist to show
systematic errors that candidate ranking and retrieval do not solve. The
current roughly 200-row corpus is valuable for evaluation and architecture
discovery, not for claiming that a personal model has learned general computer
behavior.

## Recommended next experiment

Do not rerun V5. Preserve it as the first expanded-history result.

The next test should:

1. define an initial app/window/task candidate ontology;
2. enumerate stable candidates available in each strictly prior state;
3. collect a week or other sufficiently diverse block of activity;
4. reserve 50–100 later chronological targets across transition families;
5. compare state-only and state-plus-retrieved-history using the same candidate
   list;
6. report hierarchical app, object, and control accuracy separately;
7. include frequency, most-recent, and source-transition baselines;
8. measure top-one, top-three, confidence coverage, and abstention quality; and
9. perform Dylan-authoritative usefulness review on surfaced high-confidence
   cases.

The immediate product question is no longer whether history can help name a
recurring destination. V5 shows that it can. The next question is whether a
candidate-ranked, confidence-gated system produces useful suggestions outside
the single recurring Codex loop.

## Links

- [[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history produced five exact top-three wins and no losses in NAP V5]]
- [[computer-use-nap-v5-expanded-history-experiment-design-2026-07-29|Computer-use NAP V5 expanded-history experiment design, July 29, 2026]]
- [[workflow-history-can-recover-recurring-destinations-without-general-next-action-competence|Workflow history can recover recurring destinations without general next-action competence]]
- [[a-first-computer-navigation-autocomplete-should-rank-candidates-and-abstain|A first computer navigation autocomplete should rank candidates and abstain]]
- [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]
- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]

