---
type: source
status: captured
created: 2026-07-30
updated: 2026-07-30
source_date: 2026-03-09
projects:
  - computer-use-autocomplete
domains:
  - computer-use
  - next-action-prediction
  - proactive-agents
tags:
  - pira-bench
  - intent-recommendation
  - personalization
  - abstention
  - gui-agents
source_url: https://arxiv.org/abs/2603.08013
---

# PIRA-Bench tests proactive intent recommendation from continuous GUI screenshots

## Source

[PIRA-Bench: A Transition from Reactive GUI Agents to GUI-based Proactive
Intent Recommendation Agents](https://arxiv.org/abs/2603.08013), submitted
March 9, 2026. The [project leaderboard](https://www.pira-bench.top/) links to
the downloadable data.

## Reported contribution

PIRA-Bench defines a proactive GUI task in which a model receives a passive
stream of screenshots plus a user profile and must recommend actionable future
intents without a typed instruction. The benchmark contains 100 curated mobile
and desktop trajectories, an average of roughly 32 sequential screenshots per
trajectory, and three profiles for each trajectory.

The trajectories deliberately include:

- interleaved task threads;
- irrelevant application switching, idle screens, and browsing;
- profile-dependent cases in which the same visible context should yield
  different recommendations; and
- pure-noise negative cases for which the correct output is no recommendation.

Predictions are natural-language instructions or structured commands such as
booking a restaurant or adding a calendar event. They are not grounded clicks,
semantic destination IDs, or executable routes.

Ground truth is built from three independent human annotators, retaining
intents named by at least two. Gemini 3 Flash judges semantic matches. The
benchmark combines intent F1 on positive samples with a penalty for false
positive recommendations on negative samples.

## PIRF baseline

The paper also proposes the Proactive Intent Recommendation Framework. PIRF
wraps a general multimodal model with:

- a static user-profile record;
- a dynamic bank of active and suspended intent threads;
- a ten-frame sliding window;
- structured `CREATE`, `RESUME`, `UPDATE`, and `IDLE` state transitions; and
- reflection that deletes completed or abandoned intents.

This is a framework and benchmark baseline, not a released end-user agent. The
paper evaluates several general multimodal models rather than releasing a
specialized computer-use policy.

## Relevance to personalized computer-use autocomplete

PIRA-Bench is closer to the product hypothesis than ordinary computer-use
benchmarks because it removes the typed goal, explicitly includes personal
context, and evaluates restraint when no useful intent exists. Its dynamic
thread bank is also a plausible representation for interrupted cross-app work.

Important gaps remain:

- It predicts broad future intents, not the exact semantic destination or
  bounded route that the current Tab will complete.
- Its profile personalization is assigned context, not adaptation from one
  person's longitudinal action history.
- It does not execute actions, stop after one accepted completion, verify the
  resulting state, or enforce commit boundaries.
- Its 100 curated trajectories and LLM-as-judge evaluation are useful early
  evidence, not proof of natural always-on desktop reliability.
- Its objective still emphasizes matching likely intents. Dylan's product
  needs to rank by expected usefulness and risk, which can prefer a less
  probable but more valuable safe completion or abstain despite a plausible
  prediction.

## Durable implications

- Treat `IDLE` or `ABSTAIN` as a first-class policy output, not a threshold
  applied after unconstrained generation.
- Track multiple suspended intent threads rather than forcing a single current
  goal.
- Evaluate positive usefulness and false-positive interruption jointly.
- Use profile-conditioned cases only as a partial proxy for real
  history-conditioned personalization.
- Keep intent inference, candidate ranking, route execution, and commit gating
  as separate layers.

## Links

- [[personal-ai-context-learning|Personal AI Context Learning]]
- [[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The computer-use autocomplete wedge is intent ranking, not another computer-use agent]]
- [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
- [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
- [[a-first-computer-navigation-autocomplete-should-rank-candidates-and-abstain|A first computer-navigation autocomplete should rank candidates and abstain]]
