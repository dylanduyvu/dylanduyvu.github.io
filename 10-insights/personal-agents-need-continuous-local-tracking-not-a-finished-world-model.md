---
type: insight
status: developing
created: 2026-07-22
updated: 2026-07-22
confidence: medium
domains: [personalized-ai, continual-learning, agent-memory]
projects: []
sources: [oak-lab-big-world-hypothesis-2024, personalized-models-compute-fragmentation-cross-assistant-2026-07-16]
people: [khurram-javed, richard-sutton]
orgs: [oak-lab]
aliases: [personalization is tracking, personal agents operate in big worlds, agent memory as local tracking]
tags: [personal-agents, tracking, continual-learning, temporal-coherence, memory]
---

# Personal agents need continuous local tracking, not a finished world model

## Claim

A useful personal agent cannot learn a complete and permanent model of a person's world. The relevant environment keeps changing and contains more information than any one agent can observe or retain. The agent must continually decide what to learn, preserve, retrieve, revise, and forget.

The strongest personalization advantage may therefore come from **tracking**: concentrating limited memory and compute on the user's current projects, relationships, preferences, and recurring situations. Recent personal experience is valuable because it is temporally coherent with the decisions likely to come next.

## Why It Matters

This reframes personalization from a static profile into an ongoing learning system. The architecture can include:

- a shared general model for broad capabilities;
- durable external memory for selected personal facts and evidence;
- retrieval of context relevant to the current decision;
- short-lived working state for what matters now;
- adapters or weight updates only where memory and context are insufficient.

This is also a better description of Dylan's insight vault than "put everything into the model." The vault is selective long-term memory, the current conversation is working memory, and agent search performs retrieval.

## Connection to Compute Fragmentation

The big-world hypothesis strengthens the case that personal agents will need continual local experience. It does not establish that each person needs a separate large model or dedicated GPU fleet. Continual adaptation could remain compatible with shared serving through retrieval, adapters, or shared bases.

The fragmentation case becomes stronger only if agent-generated experience creates valuable behavior that cannot be represented cheaply outside divergent model weights. That remains an open technical and economic question.

## Counterpoints

- The big-world hypothesis is a research framing rather than direct evidence about consumer agents.
- Tracking can fail when the environment changes unpredictably or relevant events are far apart.
- Selective memory introduces its own errors: the agent may discard something that later becomes important.
- Current learning algorithms remain weak at stable online learning from noisy experience.

## Links

- Source: [[oak-lab-big-world-hypothesis-2024|Oak Lab: The Big World Hypothesis]]
- Related: [[personalized-models-compute-fragmentation-cross-assistant-2026-07-16|Personalized models and compute fragmentation]]
