---
type: project
status: active
created: 2026-07-22
updated: 2026-07-22
aliases:
  - Personal AI Context Learning
  - Niyant's personal-AI thesis
domains:
  - personalized-ai
  - continual-learning
  - agent-memory
people:
  - niyant
  - dylan-vu
orgs: []
tags:
  - personal-ai
  - context-ingestion
  - world-models
  - continual-learning
---

# Personal AI Context Learning

> [!note] Source boundary
> This project includes internal Notion and Slack context alongside the public World Models notes.

## Current State

The public World Models notes describe a three-phase research program: reconstruct a faithful personal event stream and predict the next action; learn bounded local comparisons from post-suggestion behavior; then test sandboxed multi-step assistance. The formal phases are specifications, not completed experiments.

Niyant's near-term execution is narrower than that program. In the July 21 Slack exchange, he said he plans a static implementation with basic data and does not expect to implement roughly 80% of formal Phase 1 now. He will start with Obsidian notes and then browser use because those are the personal data sources available to him.

The business thesis is that producing and transmitting context to LLMs is a growing enterprise cost. Niyant treats that thesis as the reason to do the work. The immediate build is meant to demonstrate ability publicly, build legitimacy, and attract inbound interest. Enterprise outreach is not a short-term milestone; outbound becomes relevant if the set of inbound strategies fails.

## Evidence Boundary

- A coherent thesis can justify an experiment. It does not validate the size, urgency, or buyer ownership of the enterprise problem.
- A static self-demo can test a narrow technical capability. It cannot establish the full dynamic-ingestion or continual-learning thesis.
- Obsidian and browser data make the first experiment feasible. They do not identify the best enterprise workflow.
- Public demos and inbound can establish legitimacy or interest. They do not establish deployment value, retention, or willingness to pay.
- The formal Phase 1-3 ladder remains useful as a map, but omitted rungs remain untested.

## Key Insights

- [[public-proof-can-establish-builder-legitimacy-without-proving-enterprise-demand|Public proof can establish builder legitimacy without proving enterprise demand]]
- [[a-static-personal-demo-cannot-validate-a-dynamic-enterprise-context-system|A static personal demo cannot validate a dynamic enterprise context system]]
- [[available-personal-data-can-scope-a-demo-without-identifying-the-enterprise-wedge|Available personal data can scope a demo without identifying the enterprise wedge]]
- [[personal-agents-need-continuous-local-tracking-not-a-finished-world-model|Personal agents need continuous local tracking, not a finished world model]]

## Syntheses

- [[niyant-personal-ai-thesis-study-guide|Niyant's personal-AI thesis: a beginner's study guide]]
- [[personal-ai-phase-1-next-action-prediction|Phase 1: Can an AI learn what matters to you by watching you work?]]
- [[personal-ai-phase-2-local-preference-learning|Phase 2: Can a better next move train a better AI?]]
- [[personal-ai-phase-3-bounded-multi-step-assistance|Phase 3: Can an AI help with more than the next move?]]
- [[personal-ai-strategy-and-evidence-sequencing|Personal AI strategy and evidence sequencing]]

## Sources

- [[dylan-niyant-personal-ai-slack-2026-07-21|Dylan and Niyant: personal-AI strategy Slack exchange]]
- [World Models public notes](https://handsdiff.github.io/)
- [Pinned public notes snapshot](https://github.com/handsdiff/notes/tree/3151afa93fd81719a6e9dc7862c269ea1f1a70e6)
- Internal Notion page: [All hands 7.20](https://app.notion.com/p/3a3307288ccf800c9d43e5386a0a1b4f)

## Open Questions

- What exact claim is the static implementation designed to test?
- Which formal Phase 1 rungs are included, and which are intentionally deferred?
- What separates informational background from context that expresses a person's desires and judgment?
- What evidence would show that the broad enterprise context cost is urgent, budgeted, and owned by a specific buyer?
- What counts as successful inbound, and when does failure trigger outbound?
- What would make the personal data pipeline transferable to an enterprise workflow rather than merely reusable code?
- Would the work still be worth doing if no enterprise paid for it?

## Next Tests

- State the demo's claim and nonclaims before publishing it.
- Compare the static implementation against simple context, retrieval, and memory baselines on held-out personal events.
- Keep proof of builder quality, proof of technical efficacy, and proof of market demand as separate outputs.
- Record which inbound artifact produces each conversation and what the respondent actually wants.
- Before calling the pipeline an enterprise MVP, test whether it reconstructs context for one real team workflow with tolerable capture and privacy costs.
