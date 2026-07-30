---
type: insight
status: supported
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
  - product-design
  - ranking
  - abstention
---

# A first computer navigation autocomplete should rank candidates and abstain

## Claim

A rough computer-navigation autocomplete should rank concrete destinations
that are currently executable and abstain when confidence is low. It should
not require an LLM to invent an exact free-text destination on every action.

## Why It Matters

Open-ended prediction confounds behavioral forecasting with naming. It also
makes an already large action space unnecessarily difficult. A rough
Cursor-Tab-like V1 only needs to surface occasional high-confidence app,
window, document, tab, or recurring-task completions.

## Evidence

NAP V5 exposed several avoidable free-text and granularity errors:

- state-only named the correct Codex composer generically, while history used
  the accepted task name and received the exact hit;
- a prediction of the visible Arc Meetings window failed an accepted target
  that contained only the coarse label `Arc`;
- history found the correct Handsdiff profile but chose its website link
  instead of the handle-copy control; and
- both conditions ignored the visible Subscribe control while overpredicting
  the recurring Codex loop.

These failures separate into two problems:

1. identify the correct region of the destination hierarchy; and
2. select the exact executable candidate within that region.

A stable candidate ontology can score those levels separately and convert the
selected candidate directly into an action.

## Implications

- Enumerate current apps, windows, tasks, documents, tabs, and accessibility
  controls before prediction.
- Give both experiment conditions the same candidate list.
- Predict hierarchically:
  `application -> window/task -> document/page -> control`.
- Retrieve analogous earlier states rather than dumping undifferentiated
  history.
- Surface a suggestion only when its calibrated benefit exceeds distraction
  and recovery cost.
- Measure precision when shown, coverage, time saved, overrides, and
  abstention quality alongside top-one and top-three accuracy.
- Defer fine-tuning until retrieval and candidate ranking have been tested on
  a larger, more diverse personal corpus.

## Counterpoints / Uncertainty

Candidate enumeration can miss dynamic or semantically hidden destinations.
Accessibility and browser metadata may also disagree. The system should retain
an open-ended fallback for discovery, but executable candidates should remain
the primary product and evaluation surface.

A week of diverse personal activity may be enough to test an app/window/task
V1. It is not enough to assume general arbitrary-control prediction.

## Links

- [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
- [[workflow-history-can-recover-recurring-destinations-without-general-next-action-competence|Workflow history can recover recurring destinations without general next-action competence]]
- [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]

## Updates

- 2026-07-30: Created from the V5 target-level review and the post-result
  comparison with a rough, early Cursor-Tab-like interaction.

