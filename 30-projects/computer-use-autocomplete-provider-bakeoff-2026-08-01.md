---
type: project
status: blocked
created: 2026-08-01
updated: 2026-08-01
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
tags:
  - provider-bakeoff
  - latency
  - v0
---

# Neither provider passed the first two-sided autocomplete bakeoff

## Decision

Do not select a proposal provider or begin the habit-week product build yet.
The August 1 credentialed bakeoff ran both Claude Code headless and Codex
app-server under the same five metadata packets, prompt, schema, five-second
deadline, and five counted warm calls. Neither provider passed.

This is a failed provider gate, not a prediction-accuracy result. The five
packets were the canonical checked-in metadata fixtures, not later human
destinations or representative natural-work packets. They are sufficient to
falsify the current validity/latency integration, but not to establish that a
future passing provider would meet the real-work latency gate.

## Frozen result

- Selected provider: none
- Selection rationale: `no_provider_passed`
- Private attempt: `providers/attempts/000001`
- Manifest SHA-256: `412eed079f3ec4c4762590cafcea5680f1ccb170097544a214c362d30c2b0540`
- Bound implementation commit: `5afab1b4e092061618700e90bf84204f43465067`
- Independent manifest verification reproduced the same hash.

### Claude Code headless

- Configuration: Claude Code `2.1.119`, `claude-sonnet-4-6`, low effort,
  `--bare`, and structural `--tools ""`.
- Cold call: invalid after `5,110.76 ms`; it crossed the five-second deadline.
- Warm latencies: `4,151.69`, `2,908.19`, `2,454.74`, `4,834.58`, and
  `4,080.54 ms`.
- Warm p50: `4,080.54 ms`, above the `2,500 ms` gate.
- Warm validity: `0/5`.
- Tool invocation rate: `0/5`.
- Cancellation and forced-deadline lifecycle checks both passed.
- Frozen failure: `warm_validity`; each warm call violated the pinned
  authority/stream contract. The public-safe manifest intentionally does not
  retain raw model transcripts, so it does not identify which closed stream
  predicate failed.

Claude therefore failed independently on both validity and median latency.
The absence of tool calls is useful but insufficient.

### Codex app-server

- Configuration: Codex CLI `0.144.6`, `gpt-5.4-mini`, low effort.
- The fresh local authority proof reached model metadata and one prewarm
  request but produced zero `generate:true` model requests.
- With no generated request, it observed no proposal-tool advertisement and
  failed `proposal_tool_advertisement_mismatch` before any live model call.
- Warm validity: `0/5`; tool invocation rate: `0/5` because the model never ran.
- The near-zero recorded fallback-call timings are not model latency and must
  not be compared with Claude's timings.

Codex did not become the default merely because its narrow `update_plan`
amendment was approved. The production gate required a fresh proof that the
actual request advertised exactly that one non-machine-authority tool, and the
proof did not reach an actual generated request.

## What changed in the harness

The reviewed two-sided implementation now:

- runs both providers even if one passes;
- permits Codex to advertise exactly `update_plan` but invalidates any call
  that invokes it;
- records cold status separately and counted warm tool-invocation frequency as
  an explicit `n/5` rate;
- keeps Claude's API key in a private `0700` runtime directory and `0600`
  file, outside both Git repositories;
- makes production providers, timing, deadlines, credentials, cancellation,
  and fresh authority proof non-injectable;
- waits for bounded child cleanup before advancing calls;
- rejects credential symlinks, replacements, loose modes, oversized files,
  non-regular files, and blocking FIFOs through no-follow/nonblocking
  same-descriptor validation;
- preserves split UTF-8 code points across provider and loopback streams; and
- freezes only sanitized metrics and hashes.

The final implementation passed `349/349` tests and independent spec and code
quality review before the live run. The no-network serializer canary rejected
all three denied packets for both providers and launched zero network
processes.

## Security cleanup

Dylan pasted the Anthropic API key into chat, so it must be treated as
compromised and revoked. The run consumed it once, cleared the clipboard, and
removed the private `provider.env` afterward. The key does not appear in the
implementation repository, public vault, or frozen provider attempt.

## Next move

Do not build Task 5 or the overlay from this result. Run two narrow diagnostic
fixes first:

1. Make Claude's closed stream validator emit a sanitized predicate-level
   reason so a single bounded canary can distinguish startup authority drift,
   assistant/result shape drift, and candidate-schema invalidity without
   publishing raw output.
2. Diagnose why the production Codex authority proof completed metadata and
   prewarm traffic but emitted no exact `generate:true` request, without
   relaxing the exact-one-tool rule.

After those fixes pass review, use a new dedicated spend-capped Anthropic key
and rerun both providers on one frozen set of five representative real
metadata packets. A provider still needs `5/5` valid warm calls and p50 at or
below `2.5 seconds`; if both pass, choose the faster one, with an exact timing
tie going to Claude's structural tool exclusion.

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0 implementation plan]]
- [[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use autocomplete runtime decision audit]]
- [[personal-ai-context-learning|Personal AI context learning]]
