---
type: source
status: research-lead
created: 2026-07-30
updated: 2026-07-30
source_date: 2026-07-23
authors:
  - David Li
  - Jonathan Li
organization: Induction Labs
projects:
  - computer-use-autocomplete
domains:
  - computer-use
  - next-action-prediction
  - video-pretraining
tags:
  - photon-1
  - imagination-models
  - observational-learning
  - research-lead
source_url: https://www.inductionlabs.com/news/scaling-video-pretraining
---

# Induction Labs: Scaling Video Pretraining with Imagination Models

## Source

[Scaling Video Pretraining with Imagination Models](https://www.inductionlabs.com/news/scaling-video-pretraining),
David Li and Jonathan Li, Induction Labs, July 23, 2026.

## What it presents

Induction Labs introduces “imagination models,” which predict future states in
a learned latent representation. Its first model, Photon-1, is a sparse
106B-A5B mixture-of-experts transformer pretrained on 575 million frames,
described as roughly 18 years of computer-use video sampled at one frame per
second.

The reported computer-use recipe is:

1. pretrain on video without action labels by predicting future latent states;
2. finetune on fewer than 35,000 computer-use trajectories to learn
   instruction following and an action format;
3. predict a desired next state before emitting the action intended to reach
   it; and
4. improve the policy with online reinforcement learning in virtual machines.

The post reports that Photon-1 outperforms Gemini 3.1 Flash-Lite on Induction
Labs' internal computer-use benchmark while using less inference compute. That
claim is internal and should be independently evaluated. The post does not
establish public model weights, an API, macOS support, autocomplete latency, or
whether Photon-1 can operate without an explicit user instruction.

## Why it matters to computer-use autocomplete

- It is direct evidence that a model trained on natural computer-use video can
  learn useful action priors without requiring action labels throughout
  pretraining.
- Its “imagine the next state, then act toward it” architecture resembles
  semantic-destination prediction followed by computer-use grounding.
- It may be a stronger foundation for the navigation layer than the general
  multimodal LLM used in NAP V5.
- The open product question remains whether personal history can replace or
  generate the explicit instruction that Photon-1 currently receives.
- Availability, latency, controllability, action stopping, confidence, and
  commit-boundary behavior belong in the planned model audit.

## Links

- [[personal-ai-context-learning|Personal AI Context Learning]]
- [[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The computer-use autocomplete wedge is intent ranking, not another computer-use agent]]
- [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
- [[standard-intelligence-fdm-1-fully-general-computer-action-model-2026-02-23|Standard Intelligence: FDM-1, a fully general computer action model]]
