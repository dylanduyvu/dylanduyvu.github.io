---
type: insight
status: active
created: 2026-07-22
updated: 2026-07-22
confidence: high
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
sources:
  - omar-shaikh-computer-use-personalization-stack-2026-07-22
people:
  - omar-shaikh
  - niyant
  - dylan-vu
orgs:
  - general-user-models
tags:
  - insight
  - tada
  - tabracadabra
  - retrieval
  - next-action-prediction
---

# Tabracadabra is a retrieval-augmented writer, not a computer-use NAP

## Claim

Tabracadabra supplies a runnable keyboard-first interface and a strong baseline for personalized writing, but its current interaction does not predict where the user will go next and does not by itself demonstrate learned personalization.

## Why It Matters

The superficial resemblance to Dylan's Tab concept can collapse three different claims:

1. A general model can use the current screen to write in an already-selected field.
2. Retrieval from personal records improves that writing.
3. Longitudinal personal behavior can predict and route the user to an exact future destination.

Tabracadabra directly implements the first and can exercise the second. Dylan's proposed computer-use NAP tests the third. Treating them as the same product would make existing UX look like evidence for an untested routing and learning claim.

## Evidence

In the current implementation, Option+Tab captures the monitor and cursor. A research phase can read local Tada logs and use read-only tools or web search. A separate writer phase receives the research transcript and screen, then streams a continuation or inline answer into the focused element.

The two phases currently use the same configured model identifier. The personal records are retrieved at inference time; the interaction does not require a model that has been trained on the user's longitudinal behavior. It also starts after the person has already chosen the destination field.

Primary sources:

- [Tada and Tabracadabra](https://generalusermodels.github.io/tada/)
- [Current implementation](https://github.com/GeneralUserModels/tada/blob/25a28f7519f4ebaedaf8817ccd4e9b8f2196e1fe/src/apps/tabracadabra/main.py)
- [Research-phase log instructions](https://github.com/GeneralUserModels/tada/blob/25a28f7519f4ebaedaf8817ccd4e9b8f2196e1fe/src/apps/tabracadabra/prompts/tab_phase1.txt)
- [Writer-phase instructions](https://github.com/GeneralUserModels/tada/blob/25a28f7519f4ebaedaf8817ccd4e9b8f2196e1fe/src/apps/tabracadabra/prompts/tab_phase2.txt)

## Implications

- Use Tabracadabra as prior art or a later writer baseline, not as the required experiment for Dylan's router.
- Compare any learned personal system against screen-only and retrieval-augmented versions before attributing improvement to weight adaptation.
- Evaluate semantic routing before building a live interface. The key question is whether correct personal history predicts an exact destination beyond recency and transition habits.
- Do not describe two separate inference phases as necessarily two different underlying models.
- Do not say cancellation deletes the generated output. User input or focus change stops further generation while preserving already inserted text.

## Counterpoints / Uncertainty

Retrieval can still produce meaningful personalization without changing model weights. The distinction is about mechanism and evidence, not whether the output feels personal. Tada also contains broader user-model and PowerNAP code, and future releases may change the interaction. This claim describes the public v0.0.16-alpha implementation inspected on July 22, 2026.

## Links

- Source: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Hunch: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Project: [[personal-ai-context-learning|Personal AI Context Learning]]

## Updates

- 2026-07-22: Captured after inspecting the public Tada site, onboarding code, prompts, and Tabracadabra implementation.

