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

## Attempt 000002 preregistration

This section supersedes the prior next-move sequence for attempt `000002`, but
does not alter attempt `000001`.

- The immutable `000001` inventory contains no Claude raw stdout or stderr.
  Therefore the exact response predicate cannot be recovered without a new
  call. All five warm calls returned before deadline, attempted no tools, and
  collapsed to `authority_failed`; schema drift is plausible but unproven.
- Add `anthropic-messages-api` as a third adapter. It calls the fixed Anthropic
  Messages endpoint directly, pins `claude-haiku-4-5-20251001`, reads its key
  only from private `provider.env`, and uses no tool field.
- Authority is verified from the exact request body: one user turn, bounded
  `max_tokens: 1024`, structured output, fixed model/API version, and no tools.
- Reuse the exact five `000001` packets, prompt, canonical validator, and
  five-second deadline. The API generation schema preserves the same exact
  candidate-or-abstention structure; unsupported scalar constraints remain in
  the local validator, and both schema hashes are recorded.
- Record one cold call separately and count five warm calls. The unchanged gate
  is `5/5` valid, warm p50 <= `2,500 ms`, acknowledged cancellation, and passing
  deadline enforcement.
- Run only the direct arm in `000002`. Codex repair is deferred. If the direct
  arm fails, selection remains null. No overlay work starts either way without
  a passing provider.

## Attempt 000002 direct-API result

The direct arm did not qualify. This was an account-billing failure, not a
model-quality, schema, authority, or latency result.

- Provider: `anthropic-messages-api`
- Model: `claude-haiku-4-5-20251001`
- Selected provider: none
- Counted warm validity: `0/5`
- Cold latency: `231.83 ms`
- Warm latencies: `143.74`, `174.58`, `124.57`, `211.45`, and `188.88 ms`
- Warm p50: `174.58 ms`
- Tool invocation rate: `0/5`
- Cancellation acknowledgement: pass
- Forced-deadline acknowledgement: pass
- Every cold and warm request failed with sanitized predicate `http_400`.
- One separate, non-counted diagnostic request returned Anthropic
  `invalid_request_error`: the API credit balance was too low.

The sub-250 ms timings measure fast rejection, not Haiku inference. They cannot
be used as provider-latency evidence.

The live calls wrote their canonical qualification artifact in private attempt
`000002`, but the manifest freeze then rejected an overly strict orchestration
schema: it expected the measurement status string `fail`, while the generic
runner correctly emitted the more specific closed status `authority_failed`.
No model call was repeated. The exact result artifact was copied with its hash
and failure provenance into private salvage attempt `000003`, then frozen and
independently verified.

- Frozen salvage attempt: `providers/attempts/000003`
- Manifest SHA-256: `ee475d552cb98838ac67987428e055a7ee83a9f6c66fc675fe4e45f84b3271e9`
- Bound implementation commit: `b93e419cc40cbce2be0bacfcbaa1d7672c38e453`
- Live attempt `000002` remains preserved as an incomplete attempt directory;
  it was not deleted, rewritten, or presented as a valid frozen manifest.

The stop condition remains in force: do not build Task 5 or the overlay. Before
a new qualification attempt, add Anthropic API credit, create a new dedicated
spend-capped key because the pasted key is compromised, and teach the adapter
to retain a sanitized API error category so billing failures do not require a
second request. Run the same frozen five-packet protocol as a new attempt.

### 2026-08-01 credential-selection correction

The billing interpretation above is superseded. A read-only Console audit
showed that the intended keys, active API credits, workspace, spend limit, and
rate limits were all aligned. The exact plain Messages request then succeeded
with HTTP `200` when the intended newly created key was selected explicitly.

The failed qualification had not used either key Dylan supplied. Its temporary
credential loader searched `~/.codex/history.jsonl` and silently selected an
unrelated pre-existing local key. Therefore attempt `000003` accurately
preserves the observed HTTP `400` responses, but it is not evidence about
Dylan's Anthropic account, the intended key, Haiku latency, or direct-provider
validity. The conservative null selection remains correct; the claimed billing
root cause does not.

The next attempt must bind the exact intended credential through private
`provider.env` and verify the selected credential identity locally without
printing, hashing, or storing its bytes. Then rerun the unchanged five-packet
qualification as a new immutable attempt. No overlay work starts before that
run passes.

## Attempt 000004 preregistration

Attempt `000004` is the first eligible direct-API rerun after correcting both
preflight defects. It does not reinterpret or overwrite `000001`-`000003`.

- Production reads the intended credential only from private `provider.env`;
  transcript/history search is forbidden during qualification.
- A non-counted exact Sonnet request using that credential returned HTTP `200`.
- A non-counted Haiku adapter preflight exposed the remaining incompatibility:
  Anthropic rejects JSON Schema keyword `oneOf` in structured outputs.
- The API generation-schema projection now recursively maps canonical `oneOf`
  unions to Anthropic-supported `anyOf` and continues to omit only unsupported
  scalar constraints. The canonical prompt, candidate-versus-abstention schema,
  and local validator remain unchanged and authoritative. Both schema hashes
  remain frozen evidence.
- The first corrected-adapter preflight remained non-counted and exposed one
  additional documented generation constraint: Anthropic rejects
  `minItems: 3`, then rejects `maxItems`. The generation projection therefore
  omits both array-size constraints; the
  unchanged local validator still requires exactly three candidates.
- The next non-counted response rejected tuple-form `prefixItems`; generation
  now projects the three ranked candidate shapes to supported `items.anyOf`,
  while the canonical local validator retains exact rank order and cardinality.
- The first schema-accepted warm preflight returned a legitimate abstention but
  used a `358`-character reason, beyond the unchanged local `256`-character
  bound. The generation schema now asks for concise text within that bound;
  prompt and local validation remain unchanged.
- Attempt `000004` reuses the exact five `000001` packets, pinned Haiku 4.5
  model, one-user-turn/no-tools request body, one cold call, five counted warm
  calls, five-second deadline, cancellation probe, and forced-deadline probe.
- Selection still requires `5/5` valid warm calls, zero tool invocations,
  acknowledged lifecycle checks, and warm p50 at or below `2,500 ms`.
- No Task 5 or overlay work begins unless the frozen attempt passes.

## Attempt 000004 result

Attempt `000004` is frozen and verified under manifest
`1766f22c47093c421f1f8682d04275a0e88f8cfcb4627f8462a69da05155d698`,
bound to source commit `f416902d40b69c1a2581b9a34b75d8bc25fe99ac`.

- Result: no provider selected; the strict `5/5` validity gate failed at `3/5`.
- Warm calls `0` and `1` failed with sanitized predicate `candidate_schema`.
  Their exact subpredicate is not recoverable because counted raw responses
  were not frozen. A non-counted preflight showed overlong abstention text can
  cause the same predicate, but that does not prove the counted failure cause.
- Latency passed: cold was valid at `1,936.49 ms`; warm p50 was `1,910.02 ms`
  across `2,132.64`, `2,122.35`, `1,910.02`, `1,545.39`, and `1,739.82 ms`.
- Authority and lifecycle passed: `0/5` tool calls, cancellation acknowledged,
  and forced-deadline enforcement acknowledged.

The blocker is now response-format reliability at usable latency—not billing,
credential binding, authority, or speed. Task 5 and the overlay remain locked.
Before any rerun, add a metadata-safe closed local-validation subpredicate so a
future failure names its actual cause; do not normalize around an inference.

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0 implementation plan]]
- [[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use autocomplete runtime decision audit]]
- [[personal-ai-context-learning|Personal AI context learning]]
