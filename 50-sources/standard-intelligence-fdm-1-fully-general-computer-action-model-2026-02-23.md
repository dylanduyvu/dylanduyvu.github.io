---
type: source
status: research-lead
created: 2026-07-30
updated: 2026-07-30
source_date: 2026-02-23
organization: Standard Intelligence
projects:
  - computer-use-autocomplete
domains:
  - computer-use
  - next-action-prediction
  - video-pretraining
tags:
  - fdm-1
  - inverse-dynamics
  - forward-dynamics
  - action-model
  - research-lead
source_url: https://si.inc/posts/fdm1/
---

# Standard Intelligence: FDM-1, a fully general computer action model

## Source

[The First Fully General Computer Action Model](https://si.inc/posts/fdm1/),
Standard Intelligence, February 23, 2026.

## What it presents

Standard Intelligence presents FDM-1, a video-native computer action model
trained from a portion of an 11-million-hour screen-recording corpus. Its
reported training recipe is:

1. train an inverse dynamics model on 40,000 hours of contractor-labeled
   screen recordings;
2. use that model to infer mouse and keyboard actions across the much larger
   video corpus; and
3. train a forward dynamics model to predict the next action from prior video
   frames and actions.

FDM-1 outputs low-level key presses, mouse movements, clicks, and scrolling.
Its video encoder is reported to fit approximately 1 hour 40 minutes of
30-FPS video into one million tokens, enabling much longer behavioral context
than screenshot-based VLM systems. The post also reports an internal
screen-to-action latency of 11 milliseconds using specialized co-located
infrastructure.

The demonstrations and scaling results are company-reported. The post does
not establish public model weights, an API, native macOS support, or whether
the model can be constrained to the commit-gated autocomplete authority model.

## Why it matters to computer-use autocomplete

- FDM-1 is unusually close to the literal research problem: predict the next
  computer action from a long history of observed states and actions without
  requiring a fresh natural-language instruction before every action.
- Its inverse-dynamics pipeline is directly relevant to the project's missing
  scalable labeling tool. It suggests a path from unlabeled natural-work video
  to inferred action sequences, while also documenting difficult long-range
  events such as copy followed later by paste.
- Its long video context may preserve workflow signal that was compressed out
  of the NAP V5 text-history packets.
- Its primitive action output is useful for execution but does not by itself
  solve semantic destination ranking, usefulness, personalization,
  confidence, abstention, or commit boundaries.
- Availability, adaptation, action confidence, candidate ranking, stopping,
  and compatibility with personal-history conditioning belong in the planned
  model audit.

## Links

- [[personal-ai-context-learning|Personal AI Context Learning]]
- [[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The computer-use autocomplete wedge is intent ranking, not another computer-use agent]]
- [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
- [[induction-labs-scaling-video-pretraining-with-imagination-models-2026-07-23|Induction Labs: Scaling Video Pretraining with Imagination Models]]
