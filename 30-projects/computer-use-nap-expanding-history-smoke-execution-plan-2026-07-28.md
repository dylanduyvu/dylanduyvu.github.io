---
type: project-plan
status: approved
created: 2026-07-28
updated: 2026-07-28
aliases:
  - NAP expanding-history smoke execution plan
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - experiment
  - execution-plan
---

# NAP expanding-history smoke execution plan, July 28, 2026

## Status

Approved but not started. No prediction has run.

The private step-by-step implementation checklist is
`/Users/dylanvu/screenpipe-datasets/blog-work-20260727/EXECUTION-PLAN.md`.
This note preserves the load-bearing execution contract in the vault.

## Experiment

Use the 20 approved visual rows from `BLOG-MINI-20-V2`.
`BLOG-CAND-003` seeds history. Each of the remaining 19 chronological rows
receives two independent predictions:

1. `state_only`: the current monitor-1 and monitor-3 before-state images.
2. `state_plus_all_prior`: the same current images plus every earlier frozen
   state/action row, oldest to newest.

This produces exactly 38 condition slots. The only intended difference within
each pair is the presence of prior workflow history.

## Predictor

```yaml
model: gpt-5.6-sol
reasoning_effort: max
automatic_delegation: false
service_tier: priority
attempt_timeout_seconds: 1200
fresh_context_per_slot: true
retry_failed_slot: false
```

`max` is the highest supported single-model reasoning setting. Do not use
`ultra`, because Ultra adds automatic subagent delegation and would change one
predictor invocation into a multi-agent system.

Each call uses non-interactive `codex exec` with the existing Codex account,
an ephemeral fresh context, a read-only sandbox, the frozen developer
instruction, the exact ordered image attachments, and a frozen JSON response
schema. The model returns one to three ranked `app`, `object`, and `subtarget`
predictions.

## Leakage boundary

- The current action target is hidden until both condition attempts are saved.
- No current or future target enters history.
- State-only packets contain no candidate ID, player time, source path, or
  other chronology metadata.
- Historical targets use compact JSON with fixed key order `app`, `object`,
  `subtarget`.
- Later images, Screenpipe metadata, QA notes, and labeler notes are never
  predictor input.
- The maximum-depth history packet has 40 ordered images: 38 historical, then
  the two current images.

## Resumption and failure behavior

Every condition slot has one immutable `attempt.json`. The executor follows a
frozen 38-slot schedule:

- if an attempt already exists, skip it;
- restart at the first missing slot;
- never replace, delete, or retry a saved attempt;
- continue after model-contract failures such as tool use or invalid JSON,
  because those count as incorrect predictions;
- after an infrastructure failure such as timeout, authentication failure,
  rate limiting, transport failure, provider failure, or nonzero CLI exit,
  save that failed slot and pause before the next slot; and
- after infrastructure health is restored, run the same command again. It
  skips all saved attempts and continues from the first missing slot.

This allows interruption and resumption without rerunning the full prediction
circuit. An infrastructure-failed slot remains null and its target is excluded
from the paired comparison.

## Pre-call gate

Before the first model call:

1. freeze the structured 20-row target contract and accepted aliases;
2. implement and test packet rendering, scheduling, persistence, resumption,
   failure classification, scoring, and reporting without model calls;
3. freeze the scorer before any prediction output exists;
4. validate all 40 source images and hashes;
5. render the exact maximum-depth Codex prompt with `codex debug
   prompt-input`, verifying role order, image order, and absence of hidden
   labels; and
6. atomically hash every input, runtime module, test, packet, prompt, image,
   tool version, and debug artifact into the immutable run record.

## Scoring and interpretation

- Report exact top-1 and top-3 by condition.
- Report paired wins, losses, and ties.
- Count tool use and invalid schema as false.
- Treat infrastructure failure as null, report coverage, and exclude the
  affected target from paired comparison.
- Report obvious semantic near-misses separately because exact component
  scoring can reject useful predictions such as a web-app name in place of
  its browser host.
- Ask Dylan whether either condition produced a shortcut he would have used:
  `yes`, `maybe`, or `no`.

This is a method-and-signal smoke test, not a powered benchmark. After the
readout, decide whether to repair the method or scale chronological labeling
toward roughly 200 rows.

## Links

- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]]
