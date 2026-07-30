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
  - personalization
  - evaluation
---

# Workflow history can recover recurring destinations without general next-action competence

## Claim

Personal workflow history can help a model recover a stable recurring
destination without giving it general competence at predicting the next
computer action.

## Why It Matters

A positive personalized-history result can come from one repeated transition
family rather than broad intent understanding. Treating that result as a
general router would overstate what the model learned and could direct the next
data collection toward more repetition instead of more discriminating cases.

## Evidence

NAP V5 compared the same current screenshot under state-only and
state-plus-history conditions on ten scorable paired targets.

- State-only structured exact top-three: 0/10.
- State plus history structured exact top-three: 5/10.
- Paired result: five history wins, zero state wins, five miss ties.
- History hit all five scorable Codex targets.
- History missed all five scorable Arc targets.

The five hits were four VS Code-to-Codex returns and one Arc-to-Codex return,
all involving `Patch NAP blog prep in vault` or its composer. History did not
exactly predict the Notion page, the Handsdiff handle-copy control, the
Handsdiff Subscribe control, a coarse Arc focus, or the Arc Notion shortcut.

Four of the five exact wins also survived blind primary-semantic adjudication.
The fifth was an exact-label win on the named Codex composer; state-only had
already predicted the same practical composer using a generic label.

## Implications

- Describe V5 as evidence for recurring-task recall, not general
  next-destination prediction.
- Collect transitions that break the dominant workflow loop, not only more
  instances of it.
- Stratify future evaluation by destination family, application, and control
  depth.
- Compare against frequency and source-transition baselines.
- A rough first product can specialize in high-confidence returns to recurring
  tasks while abstaining elsewhere.

## Counterpoints / Uncertainty

The sample contained only ten scorable targets from one blog-writing workflow.
Two Arc misses were sensitive to target granularity, including a Mission
Control case in which the model identified the visible Meetings window while
the accepted label stopped at `Arc`.

The result therefore does not prove that history actively harms browser
prediction. It shows that no broad browser benefit was established in this
sample.

## Links

- [[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history produced five exact top-three wins and no losses in NAP V5]]
- [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
- [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]

## Updates

- 2026-07-30: Created from the completed V5 result and target-by-target
  post-result review.

