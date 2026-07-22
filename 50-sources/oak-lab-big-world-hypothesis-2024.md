---
type: source
status: captured
created: 2026-07-22
updated: 2026-07-22
source_date: 2024
source_type: research-essay
projects: []
domains: [personalized-ai, continual-learning, reinforcement-learning, compute-efficiency]
people: [khurram-javed, richard-sutton]
orgs: [oak-lab]
attachments: []
tags: [big-world-hypothesis, tracking, online-learning, bounded-agents, temporal-coherence]
---

# Oak Lab: The Big World Hypothesis and its ramifications for AI

## Source

[The Big World Hypothesis and its Ramifications for Artificial Intelligence](https://oaklab.ai/posts/the-big-world-hypothesis), Khurram Javed and Richard S. Sutton, 2024. Captured from a full-text copy supplied by Dylan on 2026-07-22.

## Core Claim

For many real decision problems, the environment is permanently much larger than the agent trying to act within it. The agent cannot observe, remember, model, or precompute the best action for every relevant state. Intelligence therefore depends on using limited compute and memory well, not on eventually learning a complete and final model of the world.

The opposing view is that the important problems have simple underlying solutions and sufficiently large agents can learn those solutions once. Javed and Sutton argue that this framing selects the wrong class of problems.

## Why More Compute Does Not End the Constraint

The authors give two reasons:

1. Better compute expands sensing. Cameras, microphones, logs, and other sensors generate more detailed and frequent observations, so the input stream grows alongside the agent.
2. Better compute makes the environment itself more complex. Other agents and computers become more capable, so accurately modeling them requires increasing resources too.

The result is a moving frontier. A larger agent can know more, but it does not finish knowing the world.

## Proposed Research Consequences

### Continual online learning

An agent should learn what matters in its current region of the world and revise or discard knowledge as relevance changes. The authors call this **tracking**. Tracking works when experience is temporally coherent: the near future resembles the recent past enough that current learning is useful.

### Efficient approximation

Under a fixed compute budget, a cheaper approximate algorithm can outperform a more exact algorithm if the saved computation supports a larger or more useful agent. The objective is effective decisions under resource limits, not complete causal truth.

### Resource-constrained benchmarks

Benchmarks should prevent agents from brute-forcing environments that are tiny relative to them. Candidate constraints include operations, memory, memory bandwidth, and energy. Different constraints can produce different winning algorithms.

## Evidence Grade

The essay is a research hypothesis and agenda, not a demonstrated law. Its Go-planning and language-model scaling examples are described by the authors as indirect or circumstantial evidence. The strongest content is the conceptual consequence of assuming permanently bounded agents.

## Connection to Dylan's Current Work

### Strong connection: personalized agents

The paper supports the need for an agent that continually updates around one person's changing environment. A static general model cannot encode every relationship, preference, project, conversation, and external change relevant to that person. Personalization becomes a tracking problem, not merely a one-time profile or fine-tune.

Temporal coherence is the potential advantage. Dylan's next decision is disproportionately related to his recent projects, people, beliefs, and actions. A personal agent can spend its limited resources on that local stream rather than representing every possible user equally well.

This connects directly to the earlier discussion about whether personal agents can generate enough on-policy experience to diverge meaningfully. The big-world framing gives a reason for continual local adaptation, but it does not determine whether adaptation belongs in full model weights, small adapters, external memory, retrieval, or a combination.

### Direct systems analogy: the insight vault

The Obsidian harness already behaves like a crude tracking architecture. The base model supplies broad prior knowledge; the vault preserves selected durable context; search retrieves what matters now; recent conversation acts as working memory. The system does not need to fit Dylan's entire world into model weights at once.

The insight-driven policy is also a compression choice: preserve claims, decisions, evidence, and changes in belief, while retaining raw sources when needed. This is analogous to a bounded agent deciding which information deserves scarce memory.

### Conditional connection: compute demand

Continual learning could blur deployment and training because agents would update while operating. That may create persistent low-batch, event-driven, or local compute demand. Oak Lab's current research list explicitly includes event-driven neural networks with batch-size-one learning algorithms.

However, the essay does not establish dedicated GPU ownership, decentralized serving, or per-user model weights. Efficient tracking may instead favor shared base models plus memory, retrieval, adapters, and occasional updates. It motivates a workload; it does not determine its infrastructure.

### Secondary connection: memory bandwidth

The authors explicitly treat operations, memory, memory bandwidth, and energy as alternative constraints that can change which algorithms win. This is conceptually consistent with CCIR's observation that current inference rental prices align more closely with memory bandwidth than with raw FLOPs. The essay does not validate CCIR's pricing result; both simply reject compute as a single undifferentiated resource.

## What It Does Not Prove

- That full model weights must become personalized.
- That continual learning must happen on the user's device or owned GPUs.
- That personalized agents will defeat batching economics.
- That a commercial product or willingness to pay exists.
- That current SGD-based systems can perform stable lifelong learning from noisy experience.

## Links

- Insight: [[personal-agents-need-continuous-local-tracking-not-a-finished-world-model|Personal agents need continuous local tracking, not a finished world model]]
- Related discussion: [[personalized-models-compute-fragmentation-cross-assistant-2026-07-16|Personalized models, compute fragmentation, and batching]]
- Related infrastructure lens: [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|Cross-generation GPU rents may track memory bandwidth more closely than FLOPs]]
