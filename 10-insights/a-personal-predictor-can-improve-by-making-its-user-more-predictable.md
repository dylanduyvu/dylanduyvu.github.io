---
type: insight
status: developing
created: 2026-07-22
updated: 2026-07-22
confidence: medium
domains: [personalized-ai, human-ai-interaction, continual-learning]
projects: [personal-ai-context-learning]
sources: [google-deepmind-ai-value-alignment-for-evolving-social-norms-2026]
people: []
orgs: [google-deepmind]
aliases: [prediction accuracy can be self-fulfilling, personalized suggestions can narrow their target]
tags: [endogenous-feedback, value-lock-in, evaluation, agency]
---

# A personal predictor can improve by making its user more predictable

## Claim

Once a personal predictor displays suggestions, higher future accuracy can come from two sources: better understanding of the user, or influence that makes the user behave more like the predictor's historical model.

Acceptance rate and exposed-history accuracy are therefore endogenous metrics. They cannot by themselves establish personalization quality, goal understanding, or beneficial assistance.

## Why It Matters

The distinction is load-bearing for systems that continually learn from ordinary use:

> past behavior → personal model → suggestions → influenced behavior → new training data

A model may appear to improve while narrowing the user's action distribution, preserving obsolete routines, or making convenient suggestions feel like pre-existing preferences. The user becomes easier to predict, but not necessarily better served.

This separates two products that may share an interface:

- autocomplete predicts what the person was likely to do;
- advice recommends what the person should do toward a stated goal.

The second has a stronger steering effect and needs a separate consent and evaluation standard.

## Evidence

Google DeepMind's *AI Value Alignment for Evolving Social Norms* formalizes a stylized loop in which a personalized assistant learns a historical user model, influences the user toward that lagged model, and then continues updating from the influenced user. Under the model's assumptions, strong historical anchoring slows adaptation and can create value lock-in.

The paper is mathematical and simulation-based. It contains no new human or deployed-assistant experiment, so it establishes a coherent mechanism and testable risk rather than the real-world magnitude of that risk.

The formal World Models Phase 1 already names endogenous feedback: suggestions can inspire, anchor, narrow, or homogenize behavior. The paper sharpens the evaluation implication. Prediction measured after exposure combines learning and intervention.

The personalized Tab concept offers a concrete micro-example. If three apps dominate Dylan's work, repeatedly suggesting them may increase acceptance and future accuracy while reducing useful exploration. A hotkey selection can also reflect convenience rather than unaided intent.

## Implications

- Establish offline and shadow-mode predictive lift before visible deployment.
- Randomize show/hide periods and suggestion order so exposure has a counterfactual.
- Report accuracy separately for exposed and unexposed histories.
- Test recovery after a declared project or goal change.
- Use washout periods to detect effects that persist after suggestions disappear.
- Track outcomes, adaptation speed, overrides, corrections, behavioral diversity, novel actions, and abstention alongside accuracy and acceptance.
- Treat fast continual updating as a possible remedy for stale models, not a solution to self-generated training data.
- Preserve inspection, correction, forgetting, reset, rollback, and disconnection mechanisms.
- For networked agents, measure per-person fidelity and subgroup diversity alongside aggregate coordination.

## Counterpoints / Uncertainty

- A suggestion can beneficially expand the user's option set rather than narrow it.
- Behavioral regularity is not inherently harmful; good tools intentionally make useful routines easier.
- The GDM result follows from stylized assumptions about linear values, historical anchoring, and a changing normative optimum.
- Lower behavioral diversity is not automatically worse if outcomes and endorsed goals improve.
- Shadow-mode behavior is not a perfect counterfactual for behavior under useful assistance.

The correct conclusion is not “do not personalize.” It is “do not interpret exposed accuracy as pure evidence of understanding.”

## Links

- Source: [[google-deepmind-ai-value-alignment-for-evolving-social-norms-2026|Google DeepMind: AI Value Alignment for Evolving Social Norms]]
- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Product hunch: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Related: [[personal-agents-need-continuous-local-tracking-not-a-finished-world-model|Personal agents need continuous local tracking, not a finished world model]]

## Updates

- 2026-07-22: Created from Dylan's review of the GDM paper against Niyant's Phase 1–3 thesis and the Tab concept.
