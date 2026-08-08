---
type: project
status: complete
created: 2026-08-07
updated: 2026-08-08
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
tags:
  - v0
  - packet-audit
  - codex
  - evaluation
---

# Computer-use autocomplete packet-fidelity audit

## Verdict

The live packet corpus does not carry exact **active** Codex task identity. The
Codex thread-list API is working, but its planned use as a full exact-ID/title
candidate catalog is missing from the runtime. The current implementation reads
the list once at startup, inserts only threads updated during the preceding 15
minutes into the ordinary history buffer, and lets them age out. This is a
partial/miswired implementation of the frozen plan, not lease gating and not a
thread-list outage.

The `state_only` twin also copies `recurring_destinations` exactly. It is
therefore not a strict no-history baseline. It measures the marginal value of
the recent 15-minute/100-event sequence **on top of** long-horizon recurring
memory.

No packet, runtime, prompt, schema, or provider code was changed in this audit.

## Repair outcome — August 8

The full-fidelity packet repair is implemented at candidate commit `07a9cf3`.
The live Codex directory now omits schema-valid untitled threads instead of
rejecting the whole page; the measured August 8 response contained 64 rows, of
which 42 were untitled and 22 were usable exact-ID/title candidates. The strict
screen-only twin and three-arm offline replay taxonomy are also implemented.
The complete suite passes `1,166/1,166`.

The isolated qualification source capture passed with five distinct repaired
packets. All five contained live Codex directory candidates and reached the
12-choice provider cap, with zero model calls during capture. Source manifest:
`3e613bc24570f88fae376e05d1270c69da8ff40857b5484e39ee4c3cf9b09298`.

The one authorized five-call Haiku gate then failed the deployment bar:

| Call | Outcome | Exact reason | Latency |
|---:|---|---|---:|
| 1 | Abstained | `ranking_tie` | 1,731.217 ms |
| 2 | Returned three | — | 2,536.552 ms |
| 3 | Abstained | `ranking_tie` | 1,151.724 ms |
| 4 | Returned three | — | 1,930.751 ms |
| 5 | Returned three | — | 1,442.751 ms |

There were zero timeouts, invalid/off-catalog responses, or fabricated
candidates. The anti-fabrication and latency boundaries therefore passed, but
the preregistered gate required at least four ranked returns and allowed no
other terminal failures. Qualification manifest:
`f8a7eef48199644643aa241dcafc25e1ac9b08677e5d532ec0862286ce0d631d`.

No cutover occurred. The approved tag remains at `3c8619d`; the runtime remains
stopped with `lock_missing`; trial day one did not start. The exact next
decision is how ranking ties should resolve. It is not another packet-capture,
transport, or schema-validity repair.

## Weekend ranking-tie resolution — August 8

Commit `b58f38e` supersedes the failed-gate state above. Plausible ties now rank
by rolling-history evidence first and catalog order second; `ranking_tie` is no
longer an abstention reason. Any local tie break is preserved as
`tie_broken_by_recency` telemetry. The full suite passed `1,182/1,182`, and
independent spec and code-quality reviews approved the implementation.

The exact same five qualification packets were rebound to the new source with
zero model calls (rebind manifest
`4ddf6f8eb7478f22a9abf2b34822f26428a63b93b23cfa761599d7d5e216f4c2`).
The fresh Haiku gate then passed `5/5` ranked predictions with zero timeout,
abstention, invalid response, or other failure:

| Call | Outcome | Latency |
|---:|---|---:|
| 1 | Returned three | 1,599.130 ms |
| 2 | Returned three | 1,950.808 ms |
| 3 | Returned three | 1,260.060 ms |
| 4 | Returned three | 1,164.354 ms |
| 5 | Returned three | 1,433.291 ms |

Qualification manifest:
`d64d05975d8ee232c744f87f22e83568b4bd63fc5689665b4514232c8ca7166c`.
The sanity tag now resolves to the exact qualified source. Runtime
`7813ae1f-412b-4a98-9886-8f647ed403d3` reached `ready:true`, and the immutable
schema-v2 trial marker started day one at `2026-08-08T16:27:40.931Z`
(`10:27:40.931 AM` Costa Rica time), marker
`f3b60b82097055ad0ae9e266657df42756d65d6fb1de56eea3e79438ff1177b3`.

The trial runtime is now frozen. Weekend days qualify at four or more hours of
live heartbeat. The separately authorized three-arm replay tooling runs only
against frozen offline artifacts and has zero contact with the live runtime;
its accuracy table is still pending.

## Corpus verification

The requested snapshot contained 60 packets. Three more immutable packets were
written before the runtime stopped, so the current directory and SQLite ledger
both contain 63. All 63 packet files passed their five embedded canonical hash
checks.

| Check | Original 60 | Current 63 |
|---|---:|---:|
| Current focus is Codex | 22 | 23 |
| Current Codex window title is only `ChatGPT` | 22 | 23 |
| Exact `current_state.codex_task` present | 0 | 0 |
| Packet has any `codex_task` catalog entry | 7 | 7 |
| Unique Codex task IDs represented | 1 | 1 |
| Nonempty `required_adapter_leases` | 0 | 0 |
| State-only packet retains nonempty recurring memory | 36 | 39 |
| State-only packet has recent history events | 0 | 0 |
| State-only packet has a Codex task candidate | 0 | 0 |

The claim that the corpus has no Codex identity needs one qualification. Seven
packets contain one historical task from the startup directory read. None has
exact active-task identity, and the other 53 packets in the original snapshot
have no Codex task candidate at all.

## Why the task catalog is missing

The frozen read-derived identity amendment required the runtime to:

1. use thread-list diffs for sparse post-composer labels; and
2. inject the thread list as the predictor's exact-ID/title Codex candidate
   catalog.

The runtime does neither at packet-build time. Its current behavior is:

- `readCodexTask` is deliberately hardwired to return `null`, preserving the
  decision that manual read-only Codex visits stay app-level;
- `thread/list` is called once when the product coordinator starts;
- `observeCodexDirectory` admits only threads whose `recencyAt` is already
  inside the 15-minute history horizon;
- admitted threads are labeled `history_context`, not candidate-directory
  entries; and
- they disappear when that history ages out.

A fresh read-only directory call on August 7 returned 22 valid exact IDs with
22 usable titles. The underlying read surface is available. The missing
coverage is packet construction and refresh policy.

`required_adapter_leases` is not suppressing the catalog. The packet builder
creates a Codex lease only when exact `current_state.codex_task` already exists.
Because active task reading is disabled, that condition never occurs. The empty
lease objects are an expected downstream symptom of the missing active identity.

## Restoration scope and cost

### Candidate catalog only

Estimated cost: **one to two focused engineering days**, plus the existing cheap
five-call qualification gate.

The bounded repair would need to:

- maintain a privacy-filtered background thread-directory snapshot rather than
  perform one startup read;
- add an honest candidate-directory provenance instead of pretending every
  listed task was recent human history;
- carry task titles through the local catalog/projection so the model and pill
  can distinguish them;
- rank/cap those tasks inside the existing 12-choice boundary;
- define stale-directory and read-failure behavior without blocking ordinary
  app/window prediction; and
- add packet, ranking, privacy, refresh, and resolver regressions.

This changes packet/ranking inventory, so the current provider qualification
cannot be inherited silently.

### Exact active task plus Codex lease

This is a separate, unresolved architecture problem and is **not included** in
the one-to-two-day estimate. The desktop app does not expose a reliable exact
selected-task ID through the approved current-state path, which is why the live
reader was disabled. Product-owned deep-link dispatches can retain exact IDs,
and post-send list diffs can label composer activity, but arbitrary manual
read-only task selection remains app-level. Restoring exact active identity and
self-exclusion requires a newly reviewed authority design, not a packet-builder
patch.

## State-only contamination

For all 60 requested packets, the full and state-only recurring blocks are
byte-for-byte identical when present. Thirty-six of the 60 contain a nonempty
block; 35 have at least one recurring window that directly overlaps a current
catalog window, so this is capable of influencing rankings rather than merely
adding unused text.

The behavior is explicit in `deriveStateOnlyPacket`: it clears
`history_context` but clones `recurring_destinations`.

Two honest comparisons are available:

- **Strict screen-only baseline:** current state/scene, empty recent history,
  and empty recurring memory. This answers whether any personal history helps.
- **Rolling-history ablation:** current state/scene plus recurring memory, then
  compare against the same packet with the recent 15-minute/100-event sequence.
  This answers whether short-term chronology adds value beyond learned habits.

Recommendation for future replay: preserve the immutable packets and derive
both twins offline. Do not rename the current twin “screen-only.” Producing the
two offline arms is roughly two to four hours of implementation and tests and
does not require a live cutover or provider requalification. Changing the live
packet builder itself would be closer to half a day to one day and would require
fresh qualification under the source-inventory rule.

## Consequence for the provider wager

Do not treat the present corpus as a faithful wager over the intended Codex-task
product. Twenty-two of the original 60 opportunities occurred while Codex was
focused, yet none identified the active task and only seven exposed any task
candidate—and those seven all exposed the same historical task. A Haiku/Sonnet
comparison on this corpus would principally test coarse app/window routing.

The packet-catalog repair should precede the wager if the desired conclusion is
about an early Cursor-Tab-like product that returns to exact Codex tasks. A wager
run before that repair must be preregistered and reported as coarse
app/window-only.

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[computer-use-autocomplete-task-5-codex-identity-probe-2026-08-01|The Codex desktop app does not expose exact active-task identity through the approved public surfaces]]
- [[codex-thread-list-recency-reveals-desktop-originated-task-activity|Codex thread-list recency reveals desktop-originated task activity]]
- [[personal-ai-context-learning|Personal AI context learning]]
