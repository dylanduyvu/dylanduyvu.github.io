---
type: insight
status: developing
created: 2026-07-22
updated: 2026-07-22
confidence: high
domains:
  - personalized-ai
  - product-strategy
projects:
  - personal-ai-context-learning
sources:
  - dylan-niyant-personal-ai-slack-2026-07-21
people:
  - niyant
  - dylan-vu
orgs: []
aliases:
  - available data is not the market wedge
  - demo tractability does not identify the buyer workflow
tags:
  - experiment-design
  - enterprise-wedge
  - personal-data
  - scope
---

# Available personal data can scope a demo without identifying the enterprise wedge

## Claim

Starting with the data already available to the builder can make an experiment cheap and concrete. It does not show that the selected workflow has the greatest enterprise pain or the best path to adoption.

Data availability selects a tractable experiment. Market evidence selects a wedge.

## Why It Matters

Niyant plans to start with Obsidian note-taking and then browser use because those are the personal data sources he has. That is enough to test parts of collection, reconstruction, context selection, or next-action prediction.

It would be a mistake to reverse the logic and infer that note-taking or browser context is therefore the enterprise product. A workflow such as email drafting, meeting capture, research synthesis, or code review may require different events, labels, permissions, latency, and outcome measures.

The same collection and cleaning code may be reusable across settings. Reusability is an engineering property. A wedge also needs recurring pain, a buyer, deployment permission, and a measurable result.

## Evidence

In the July 21 Slack exchange, Niyant said the experiment is focused on Obsidian and browser use because that is the data available. He considers the broad context-supply sentence sufficiently specific for the present build, while acknowledging that informational background and context specifying desires may need to be separated.

## Implications

- Treat Obsidian and browser use as the demonstration environment unless separate evidence supports them as the market wedge.
- Preserve the general pipeline only where doing so does not make the first experiment vague.
- When an enterprise workflow appears, redesign the dataset around its actual event stream and outcome rather than forcing it into the personal schema.
- Test informational context and desire or judgment context separately if they require different labels or supervision.

## Counterpoints / Uncertainty

- A personal workflow can become the wedge if real users share the same pain and the builder can reach them.
- Building on available data may reveal a use case that interviews would not have surfaced.
- A broad pipeline can retain option value across workflows, but only if the generality does not prevent a decisive first test.

## Links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Source: [[dylan-niyant-personal-ai-slack-2026-07-21|Dylan and Niyant: personal-AI strategy Slack exchange]]
- Synthesis: [[personal-ai-strategy-and-evidence-sequencing|Personal AI strategy and evidence sequencing]]
