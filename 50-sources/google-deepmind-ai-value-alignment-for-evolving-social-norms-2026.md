---
type: source
status: captured
created: 2026-07-22
updated: 2026-07-22
source_date: 2026-07-20
source_type: research-paper
projects: [personal-ai-context-learning]
domains: [personalized-ai, alignment, human-ai-interaction, collective-intelligence]
people: [nenad-tomasev, matija-franklin, simon-osindero]
orgs: [google-deepmind]
attachments: []
tags: [value-lock-in, endogenous-feedback, normative-mode-collapse, personal-agents]
---

# Google DeepMind: AI Value Alignment for Evolving Social Norms

## Context

Nenad Tomašev, Matija Franklin, and Simon Osindero's July 2026 paper models the long-term co-evolution of people and personalized AI assistants. Dylan read it against Niyant's World Models thesis, especially Phase 1's next-action predictor, Phase 2's proposal-conditioned preference pairs, Phase 3's planning system, and the personalized Tab concept.

- [arXiv abstract](https://arxiv.org/abs/2607.18506)
- [PDF](https://arxiv.org/pdf/2607.18506)
- Version reviewed: arXiv v1, submitted July 20, 2026

## Straight Read

The paper is most relevant to what happens **after** a personal predictor is deployed. It does not make next-action prediction more likely to work.

Its central warning is:

> A personal model can become better at predicting a person partly by keeping that person similar to the historical version it learned.

Once suggestions are visible, the assistant no longer merely observes a fixed target. It helps produce the behavior that becomes its future training data:

> past behavior → personal model → suggestions → influenced behavior → new training data

Prediction accuracy can then rise for two different reasons: the model understands the person better, or the person is becoming more like the model's predictions. An online evaluation must separate those mechanisms.

## Model in Plain English

Each simulated person has:

- a current value state, `V`;
- a personalized AI's historical model of that person, `M`;
- a changing external or social environment, `E`.

The AI updates its model toward the person at learning rate `λ`. The user also changes through independent exploration, social influence, feedback from the environment, and influence from the AI. The paper calls the final influence term “alignment strength,” `α`.

That label needs care. In this paper, `α` is not general alignment quality or safety. It is a proxy for how strongly the assistant's behavior reflects its historical user model and pulls the person toward that model. “AI influence” or “historical anchoring strength” is often the clearer interpretation.

The assistant's model is a moving average, so it normally lags behind the changing person. If the lagged model strongly influences the person while the environment keeps changing, the assistant can pull the person back toward an obsolete state.

The paper also models trust as a function of how closely the user and AI agree. This creates a possible **trust trap**: the user and assistant remain mutually aligned, so usage remains high, while both fall out of step with external reality. A sycophantic assistant can make the gap harder for the user to detect.

## Main Findings Inside the Model

### Individual value lock-in

Under continuing environmental change, stronger historical anchoring increases the user's lag. Faster AI updating and stronger independent human adaptation reduce it. Following a sudden change, a strongly anchored population takes longer to recover and can remain in a stable but maladapted state.

The proposed mitigation is adaptive rather than fixed personalization: reduce the assistant's pull when the user needs to adapt, and let the AI update more rapidly during change. The authors note that very fast updating may introduce oscillation and is not automatically easy to operationalize.

### Normative mode collapse

In a heterogeneous population, strong social coupling relative to local learning pulls distinct groups toward one global average. That average can be wrong for every local group.

This result should not be misread as “personalization alone homogenizes society.” In the base theorem, mode collapse is driven primarily by social consensus dynamics. The paper's extensions add specifically AI-mediated homogenizing forces, including a shared developer constitution and AI-to-AI synthetic-data coupling.

### Epistemic filtering and synthetic loops

If the assistant becomes the user's main interface to information, it can both increase the pull of its existing user model and weaken direct feedback from the world. In another extension, assistants trained on one another's outputs converge with each other faster than they track their respective users.

These extensions are especially relevant to networked personal agents and collective intelligence. A system can improve aggregate coordination or consistency while losing fidelity to individual principals and local communities.

## Evidence Boundary

The paper contains no new human-subject experiment, personal-assistant deployment, observational dataset, or LLM-agent evaluation. Its original evidence consists of mathematical analysis and simulations of hand-specified equations. The default simulation has 1,000 artificial user-AI pairs, 60-dimensional value vectors, and 10,000 abstract time steps.

The central individual result is substantially produced by the setup: a lagging historical model pulls a person backward while the target environment moves forward. The mathematics clarifies the consequences of that mechanism; it does not establish that real assistants exert that force at the assumed magnitude.

Other major assumptions include:

- values are continuous vectors with mostly linear updates;
- an external environment has an identifiable utility-maximizing normative direction;
- users and assistants share common parameters;
- every user has an assistant;
- simulation steps have no calibrated mapping to real time;
- real polarization, backfire effects, hysteresis, generational change, and multilayer social networks are mostly omitted.

The normative-environment assumption is particularly strong. Adapting to prevailing conditions is not always good; resistance may protect rights or enable moral progress. The authors acknowledge this and explicitly position the model as hypothesis generation rather than a replacement for real-world studies.

## Relationship to the World Models Thesis

| Thesis layer | What this paper changes |
|---|---|
| Phase 1 offline prediction | Nothing about feasibility. It gives no evidence that personal history predicts a bounded next write. |
| Phase 1 live participation | It strengthens the endogenous-feedback warning. Accuracy after exposure is not clean evidence of understanding. |
| Phase 2 local preference learning | A later action reveals what a proposal-conditioned person chose, not automatically an enduring preference or a better action. |
| Phase 3 planning | A planner could make future approval easier by shaping the user rather than serving the user's original goal. Execution permission does not prevent subtle preference shaping. |
| Collective intelligence | Networked assistants may converge with one another, central defaults, or influential hubs faster than they track distinct principals. Coordination must improve without erasing local goals. |
| Enterprise thesis | Unchanged. The paper supplies no evidence about context-supply cost, buyer urgency, adoption, retention, or willingness to pay. |

The clean conceptual difference is:

- Niyant asks whether an AI can learn a person well enough to help.
- This paper asks which temporal version of that person it learns, and whether helping preserves the person's ability to change.

## Invalidation-Ladder Update

Keep the offline rungs unchanged. Once suggestions become visible, add a separate adaptation-and-agency gate:

1. Randomize no-suggestion, static-suggestion, and personalized-suggestion windows.
2. Preserve hidden or shadow-mode predictions as a counterfactual.
3. Introduce or wait for a clearly declared project or goal change.
4. Compare recency-heavy, replay-heavy, slow-update, and fast-update policies.
5. Include washout periods where suggestions disappear.
6. Measure outcomes, recovery time, overrides, corrections, novel actions, behavioral diversity, and effects that persist during washout.
7. Report prediction accuracy separately for exposed and unexposed histories.

A hard failure condition is:

> Personalized exposure raises prediction accuracy or acceptance, but slows adaptation after a declared change, reduces outcomes, narrows useful exploration, or leaves unwanted effects after removal.

Before Phase 2, also ask whether inferred preferences survive delayed reflection and outcome review. Keep “what I would do” autocomplete separate from “what I should do” advice.

For collective intelligence, test both coordination gain and preservation of per-person fidelity, subgroup diversity, correction, and disconnection rights.

## Relationship to the Tab Concept

Tab navigation is a relatively low-risk surface for testing this loop because focus changes are frequent, reversible, and less normatively loaded than writing arguments or choosing long-term plans.

It also gives the paper's failure mode a concrete form. If Dylan uses three apps and the system repeatedly suggests those apps, acceptance can entrench the same routine. Apparent accuracy may improve while destination diversity falls. Acceptance may reflect convenience or hotkey placement rather than prior intent.

The test therefore needs more than acceptance rate:

- beat most-common, recency, and transition-frequency baselines;
- predict the exact semantic destination, not only the app;
- randomize hidden versus visible predictions and slate order;
- test adaptation when the active project changes;
- track destination entropy, novel destinations, overrides, and washout behavior;
- measure time and attention saved.

A good Tab system compresses intentional navigation. It should not compress the person into their most common destinations.

## Bottom Line

Treat the paper as a strong conceptual red-team and experiment-design prompt, not empirical validation or invalidation of the personal-AI thesis.

It leaves the probability that Phase 1 works almost unchanged. It raises the probability that a naive online personalization loop produces misleading success metrics, and it makes shadow mode, randomized exposure, forgetting, reversibility, agency, and diversity measurements more load-bearing.

## Promoted

- [[a-personal-predictor-can-improve-by-making-its-user-more-predictable|A personal predictor can improve by making its user more predictable]]
- [[personal-ai-context-learning|Personal AI Context Learning]]
- [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]

