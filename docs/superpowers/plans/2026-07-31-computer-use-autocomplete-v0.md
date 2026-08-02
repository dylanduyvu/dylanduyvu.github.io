# Computer-use Autocomplete V0 Implementation Plan

> **For agentic workers:** REQUIRED: Use
> `superpowers:subagent-driven-development` (if subagents are available) or
> `superpowers:executing-plans` to implement this plan. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** Build a Dylan-only Mac prototype that logs every eligible prediction
opportunity, proactively offers one exact navigation completion, and executes
only one of four deterministic primitives after a locally authorized Tab.

**Architecture:** A Hammerspoon Spoon owns observation, privacy-sensitive local
invalidation, the non-activating pill, physical Tab authority, screenshots, and
three native actuators. A Node 24 ESM process owns ordered ledger ingress,
immutable packets, tool-free provider calls, the Codex task adapter, lifecycle
state, SQLite persistence, replay, and reporting. They communicate through a
private append-only JSONL and atomic-command bridge under Application Support;
no model can dispatch an action.

**Tech Stack:** Node.js 24 ESM, `node:test`, built-in `node:sqlite`, Hammerspoon
Lua, AppleScript/registered URL handlers for Arc and Codex, SQLite WAL, JSONL,
PNG, Markdown.

**Authoritative spec:**
`/Users/dylanvu/notes/30-projects/computer-use-autocomplete-v0-design-2026-07-31.md`

**Implementation root:**
`/Users/dylanvu/Projects/computer-use-autocomplete`

---

## Plan-wide decisions and preregistrations

### 2026-07-31 scope correction: prototype threat model

This amendment is authoritative wherever later task text conflicts. The
remaining V0 is an n=1 personal-product test, not an untrusted multi-party
scientific release. Its primary threat is spending a week before Dylan can feel
the product. Keep evidence and physical gates only where they prevent an
irrecoverable safety failure or protect the actual product signal.

**Keep under the existing phase-zero discipline:** capture/privacy fail-closed
behavior and canaries; the reversible Hammerspoon loader; provider Probes A-C;
exact Codex task identity; the physical Tab keydown matrix; full episode
logging; and replay predictions frozen before labels. These defend against a
screenshot leak, a stolen keystroke, damage to a daily-driver Mac, lost signal,
or self-deception.

**Cut from the remaining implementation:**

1. Chunk 2's nested sanity component/final manifest system, `active.json`
   choreography, and sanity-specific abort/evidence machinery. Replace it with
   green focused/full tests, the guided executor trials themselves, one concise
   Markdown result note, and a Git tag.
2. The generated trial-unlock artifact and nine-field release-inventory
   verifier. Natural work remains locked behind one explicit runtime check that
   the approved release tag is checked out and the tree is clean.
3. Disabled-half-day snapshot/proof choreography. Stop the runtime, verify it is
   off, work normally, and write Dylan's end-of-period note.
4. The public-summary renderer. Build a public artifact only if the results earn
   a blog post.
5. Codex app-server authority discovery as the first provider path. Probe Claude
   Code headless first under documented tool exclusion. Run the Codex discovery
   and argv-isolation work only if Claude fails the latency/capability gate.
6. `open_url` as a V0 candidate/execution/reporting primitive. Keep read-only Arc
   URL access solely for privacy gating. The already-frozen wire enum may remain
   dormant for backward compatibility, but providers, runtime eligibility,
   executors, endpoint verification, and reports must not surface it.

**Replacement release discipline:** `npm test`, the load-bearing guided physical
trials, a concise Markdown decision note, a clean tree, and a Git tag. Do not
recreate deleted evidence systems under new names. If a later failure makes one
of them necessary, add back only that item.

**Execution order from here:** finish Task 3's focused capture repair; complete
Probes A-C under the existing discipline; then execute slimmed Chunks 2-3. One
systemic live failure gets one per-predicate diagnostic, one focused fix, and one
rerun. A second, different systemic failure triggers an architecture review.

**2026-07-31 execution checkpoint:** Task 3 is blocked at its ten-shot capture
calibration, and the agreed diagnostic/fix/rerun budget is exhausted. Capture
attempts `000005` and `000006` both failed 10/10 before screenshot creation on
the same first predicate: macOS returned no usable `AXFocusedUIElement` for the
local Hammerspoon probe window (`focused_element_query_ok = false`,
`privacy_unknown`). The focused repair at implementation commit `b5fcb29`
explicitly focused the probe's static `AXButton` on DOM load and window focus;
attempt `000006` remained identical. Its fresh eight-case privacy prerequisite
passed with zero artifacts and zero canary matches. Attempt `000006` produced
zero screenshots, cleaned up all probe windows, standard-verified at manifest
hash `0ba575673328f83545c5e0547e4b62ce1610065b7f72d7df327b45dd2fd47ee7`,
and restored the original Hammerspoon state. Do not rerun or weaken the
fail-closed predicates. Tasks 4 onward remain blocked pending an explicit
decision about this calibration surface.

### 2026-07-31 metadata-only V0 decision

This decision is authoritative over the capture blocker and every later packet,
provider, release, replay, and reporting step. Screenshot capture is deferred to
V0.1 and is not a phase-zero prerequisite for V0. V5 is the basis: every
observed history win was carried by destination/task identity in history, while
pixel-bearing prompts still missed the fine-control targets. The marginal value
of screenshots for the habitual navigation class is therefore unproven.

1. Add an explicit `metadata_only` capability mode. The aggregate phase-zero
   gate requires a passing capture calibration only when screenshot capability
   is enabled. In metadata-only V0, packet schemas must omit image paths,
   hashes, MIME types, and image payloads entirely rather than populate them
   with nulls. Immutable historical capture attempts remain unchanged.
2. Metadata privacy keeps raw Arc URL-risk checks, Secure Input, focused
   role/editability checks, focused app/window/title denylists, manual pause,
   and unknown-query fail-closed behavior. It no longer suppresses a packet
   merely because a background visible window intersects the active display;
   that rule protected pixel capture. Background windows are neither captured
   nor transmitted implicitly.
3. `current_state` contains the focused app/window identity, exact current Codex
   task when available, focused AX role, and at most five allowed currently open
   window titles sampled at packet freeze. Titles are ordered deterministically
   with the focused window first, length-bounded, excluded on denylist or query
   uncertainty, and contain no raw Arc query/fragment/userinfo. This is a
   current-scene catalog, not chronological action history, so state-only replay
   remains distinct from state-plus-history replay. A failed required focused
   title/role query suppresses the packet; an optional background-title query
   failure omits only that catalog entry because no unknown metadata is sent.
4. Run one bounded, non-blocking falsifier against a throwaway TextEdit window:
   evaluate the same readiness predicates without saving or transmitting any
   pixels and without allocating or replacing a canonical capture attempt. If
   it passes, record that attempts `000005`/`000006` convicted the synthetic
   Hammerspoon webview rather than capture generally; if it fails, record that
   real-app AX readiness also failed. Either result leaves metadata-only V0
   unblocked. Do not build a native calibration surface.
5. Task 4 starts Claude Code headless with JSON-only packets. Capture evidence
   is not a packet-set prerequisite in metadata-only mode. The identical packet
   contract remains tool-free, cancellable, schema-validated, privately logged,
   and measured against the existing five-warm-call/p50 <= 2.5-second gate.

### 2026-08-01 provider attempt 000002 amendment

This preregistration is authoritative for the next provider attempt. Preserve
immutable attempt `000001`; do not reinterpret it as a direct-API result.

1. Attempt `000001` froze no Claude stdout/stderr stream artifact, so its exact
   failed response predicate is not recoverable without a new call. Record only
   the supported sanitized result. Schema drift is a hypothesis.
2. Add a third adapter using the direct Anthropic Messages API over fixed HTTPS
   behind the existing proposal/cancellation contract. Load the key only from
   private `provider.env`. Pin `claude-haiku-4-5-20251001`, API version
   `2023-06-01`, one user turn, `max_tokens: 1024`, no `tools` field, and the
   existing five-second deadline.
3. Use `output_config.format` structured output. Keep the existing canonical
   prompt and validator unchanged. Send an API-compatible generation schema
   that preserves the exact candidate-versus-abstention `oneOf` and strips only
   unsupported scalar constraints; enforce those constraints locally and store
   both schema hashes.
4. Attempt `000002` runs only the direct arm on the exact five packet artifacts
   from `000001`: one cold call, then five counted warm calls. Select it only at
   `5/5` valid, warm p50 <= `2,500 ms`, acknowledged cancellation, and passing
   deadline enforcement. Otherwise select no provider.
5. Commit this amendment before any live call. Deprioritize Codex authority
   repair, keep every stop condition, and do not begin Task 5 or the overlay.

### 2026-08-01 provider attempt 000002 outcome

The direct arm ran on the exact five frozen packets and selected no provider.
Cold plus all five warm requests returned `http_400`; one separate non-counted
diagnostic request established that Anthropic rejected the account for
insufficient API credit. Counted warm validity was `0/5`; the `174.58 ms` warm
p50 is rejection latency and is not a model-latency result. Tool invocation
rate was `0/5`, and both lifecycle checks passed.

The live qualification artifact was written under attempt `000002`, but its
manifest freeze failed because the orchestration trial schema expected `fail`
instead of the generic runner's closed `authority_failed` status. The calls
were not repeated. The exact artifact and failure provenance were frozen and
verified as salvage attempt `000003`, manifest
`ee475d552cb98838ac67987428e055a7ee83a9f6c66fc675fe4e45f84b3271e9`,
bound to implementation commit `b93e419cc40cbce2be0bacfcbaa1d7672c38e453`.
The stop condition remains active: no Task 5 or overlay work until a fresh
credited-key attempt passes the unchanged gate.

#### Credential-selection correction

The failed run did not use either key Dylan supplied. Its temporary loader
selected an unrelated pre-existing key from `~/.codex/history.jsonl`. A
read-only Console audit showed the intended account/workspace and limits were
healthy, and the exact plain Messages request succeeded with HTTP `200` when
the intended new key was selected explicitly. Preserve `000002`/`000003`, but
do not treat them as evidence about Anthropic billing, Haiku latency, or the
direct adapter. The next immutable attempt must use exact private
`provider.env` credential binding and the unchanged five-packet qualification.

#### Attempt 000004 preregistration

Qualification may now read the intended credential only from private
`provider.env`; no transcript/history search is permitted. A non-counted exact
Messages request succeeded with HTTP `200`. A non-counted production-adapter
preflight then isolated the remaining failure to Anthropic's rejection of JSON
Schema keyword `oneOf`. Project the API generation schema recursively from
`oneOf` to supported `anyOf`; keep the canonical local schema and validator
unchanged and freeze both hashes. The first corrected-adapter preflight then
exposed Anthropic's `minItems: 3` restriction; omit `minItems` only from the
generation projection. The next non-counted response rejected `maxItems` too;
omit both array-size constraints only from generation and retain exact
cardinality in local validation. The next non-counted response rejected
tuple-form `prefixItems`; project the three ranked shapes to `items.anyOf` only
for generation and retain exact rank order and count locally. The first
schema-accepted warm preflight returned a legitimate abstention with a
`358`-character reason beyond the unchanged local `256`-character bound; add a
generation-only concise-text description. Run
attempt `000004` on the same five packets
with the same model, prompt, one cold/five warm schedule, no-tools body,
five-second deadline, lifecycle checks, and `5/5` plus p50 gate. Task 5 remains
blocked unless the immutable attempt passes.

#### Attempt 000004 outcome

The attempt froze and verified under manifest
`1766f22c47093c421f1f8682d04275a0e88f8cfcb4627f8462a69da05155d698`.
The direct arm failed selection at `3/5` valid warm calls. Warm indices `0` and
`1` failed with sanitized predicate `candidate_schema`; no counted raw response
was frozen, so the exact local subpredicate is unknown. Warm p50 passed at
`1,910.02 ms`, tool invocation was `0/5`, and cancellation plus forced-deadline
checks passed. Task 5 remains blocked. Before rerunning, add a metadata-safe
closed local-validation subpredicate rather than normalizing around an inferred
cause.

#### Attempt 000005 diagnostic amendment

Keep every provider input and gate from `000004` unchanged. Refine only the
sanitized post-validation failure predicate to
`abstention_text_bound`, `candidate_cardinality`, or fallback
`candidate_schema`, with no response text or payload values retained. Run the
same immutable schedule once. This attempt diagnoses response reliability; it
does not unlock Task 5 or authorize normalization by itself.

#### Attempt 000005 outcome and 000006 correction

Attempt `000005` froze and verified but its two new predicates were reduced to
`unspecified` by the generic bakeoff sanitizer. Other results were `3/5` valid,
`1,871.94 ms` p50, `0/5` tool calls, and passing lifecycle checks. Attempt
`000006` changes only the sanitizer allowlist to preserve
`abstention_text_bound` and `candidate_cardinality` end to end, then reruns the
same schedule once. No prediction input or gate changes.

#### Attempt 000006 outcome and 000007 normalization

Attempt `000006` proved every observed failure was
`abstention_text_bound`: cold plus warm indices `0`, `1`, and `3`. Warm p50 was
`1,766.93 ms`, tool use `0/5`, and lifecycle passed; no action-bearing field
failed. Attempt `000007` truncates only an otherwise exact abstention
explanation to the existing 256-character bound before unchanged local
validation. It does not change the abstention decision or any candidate field.
The same strict gate remains.

#### Attempt 000007 outcome

Attempt `000007` froze and verified PASS under manifest
`0180952b88c5d83959bbf196eb873214df08a98c900e82e00139841c49038b2f`.
Direct Anthropic Haiku is selected: cold valid, warm validity `5/5`, warm p50
`2,045.63 ms`, tool invocation `0/5`, both lifecycle checks passing, and no
failures. Task 5 is unlocked. Two individual warm calls exceeded 2.5 seconds,
so retain tail latency as a habit-week risk despite the passing p50 gate.

### 2026-08-01 prompt-caching transport amendment

After provider selection, implementation commit `79384fa` adds top-level
automatic Anthropic caching with the default five-minute ephemeral policy.
This changes only request transport configuration; it does not change or reopen
the selected provider, model, prompt, output schema, local validator, tool
boundary, or immutable attempt `000007`. Haiku 4.5 requires at least 4,096
cacheable input tokens. The qualification packets were below that threshold,
so cache creation/read may remain zero until live history packets grow. Claim
no latency benefit without nonzero API cache-usage fields.

### 2026-08-01 Task 5 outcome

Task 5 froze and independently verified as FAIL under private attempt
`codex/attempts/000001`, manifest
`3405bf06476d2132fee2d62e15877412a7cb3cc50068c131e882c7f3811bfe5f`,
bound to implementation commit `4a1a211dfac36eaa402049b09cc5deb021a77aea`.
The registered `codex://` handler, app-server thread list/read protocol, and
`turn/completed` event all exist. Exact active desktop-task identity does not:
even after opening the exact current thread route and making Codex frontmost,
AppleScript reports zero scriptable windows; the generic macOS window has no
document URL; and app-server thread enumeration does not reveal the desktop
selection. Exact focus-and-reread was therefore not attempted. Stop before
Task 6. Do not substitute generic Codex activation or add Electron/private-state,
arbitrary-UI, or coordinate infrastructure under this plan.

### 2026-08-01 Task 5 activity-derived identity amendment

This amendment supersedes only the requirement that Task 5 independently
reread the exact selected desktop thread before Task 6. Exact dispatch remains
mandatory.

A bounded public-AX spike found the selected task title under the focused
Codex window's `AXWebArea` and confirmed that an exact
`codex://threads/<id>` dispatch changes that title. Formal attempts `000002`
and `000003` nevertheless froze `thread_match_unavailable` at discovery under
manifests
`762099fb864e76357afa3ffec37a755e3e866a1dab0ca2aa57d0a29bf5823b14`
and
`9b883e1a5297b175c1b1bb483bb85c0912e82eda939567ae4e255eb58e85f9e3`.
The second attempt included the preregistered single fresh-directory retry. No
further retry, fuzzy title match, Electron/private-state read, or coordinate
fallback is permitted.

V0 proceeds with activity-derived identity:

1. A product-owned `focus_codex_task` dispatch always retains the exact
   app-server thread ID and uses only the exact registered deep link.
2. Immediate successful observation is `observed_partial` only when Codex is
   frontmost, with `frontmost_bundle` evidence. It is never called
   `verified_exact` merely because dispatch succeeded.
3. A matching qualifying app-server task event within the bounded verification
   or labeling horizon may corroborate the exact thread. A mismatching event is
   failure. If no event arrives, the result remains partial/app-level.
4. Product-owned dispatches and qualifying exact task events seed the short
   rolling task buffer. Manual/read-only task visits with no exact signal omit
   `current_state.codex_task` rather than guessing from title or recency.
5. Evaluation reports exact-task and app-only labels as separate strata.
6. Generic Codex activation is still forbidden as a substitute for an exact
   route.

Task 6 is not yet unlocked under this narrower verification contract. Before
Task 6, the app-server event-visibility check is promoted to an attempt-numbered,
frozen blocking probe because it is the load-bearing fact for the exact-task
stratum.

1. Attach the app-server listener exactly as V0 will attach it. Start no
   session or turn from probe code.
2. Across three existing tasks, Dylan manually focuses each task in Codex
   Desktop, types a short composer message, and sends it.
3. Pass only if 3/3 trials produce an app-server event with the correct thread
   ID within the 30-second label horizon. Record event kind, ID match, and
   send-to-event latency. For an observed event, use app-server
   `turn.startedAt` as the send timestamp. Begin passive event buffering before
   Dylan acts; after he confirms the send, keep observing a missing event long
   enough to cover at least the full 30-second horizon.
4. Freeze 0/3 or any partial result as FAIL, stop before Task 6, and surface it
   as an architecture decision. Do not fall back to title joins or generic
   activation.
5. Record, measurement-only, whether receiving desktop-session events required
   any unplanned listener configuration. No provider call is expected; provider
   call and cache-hit counts remain zero.

Exact-task labels are preregistered as sparse and composer-concentrated:
present when Dylan interacts with a task, absent for read-only visits. Sparse
exact-stratum counts in the habit trial are the design working, not model
failure. The app-only stratum carries the rest. A 3/3 probe pass unlocks Task 6;
all existing stop conditions remain unchanged.

Probe code never drives the desktop UI. Dylan alone focuses, types, clicks, and
sends. Pre-trial reservation `000001` was aborted before any send because its
arm-before-send wording violated this contract; it has no manifest and is not
evidence.

### 2026-08-02 Task 5 read-derived identity amendment

The `0/3` event result ruled out push-based observation only. Attempt `000003`
tested the already-proven pull surface without overwriting the historical
attempt: a full paginated `thread/list` baseline before each Dylan-only send,
then fresh reads at approximately 2, 10, and 30 seconds after confirmation.

The frozen result passed `3/3` under manifest
`057ce508a067030a09d834dc94f1355c08a9c38f3aa67751c2d5528f8e219de5`,
bound to implementation commit
`40933c66292fd6aca9dbab43eaaa581f5172f5b1`. All nine scheduled reads
succeeded. In every trial the expected thread ID remained exact, `recencyAt`
advanced by the first scheduled read, and raw list ordering moved. Exact IDs,
titles, ordering, and metadata values remain in twelve private 0600 artifacts;
the manifest contains only field names, predicates, change classes, and timing.

The authoritative V0 branch is now **read-derived identity**:

1. Resolve exact next-human Codex labels offline from thread-state diffs inside
   the label horizon.
2. Inject `thread/list` as the exact-ID/title Codex candidate catalog.
3. Keep exact labels sparse and composer-concentrated. Manual read-only visits
   remain app-level unless a product-owned dispatch already supplies an ID.
4. Retain exact deep-link execution, `observed_partial` frontmost verification,
   separate exact-task/app-only strata, and the bans on title joins and generic
   activation.
5. Task 6 is unblocked. No further Codex identity probe is authorized for V0.

- The isolated implementation repository now exists at
  `/Users/dylanvu/Projects/computer-use-autocomplete` on `codex/v0`. Preserve
  its immutable provider and Codex-probe commits; do not reuse or modify
  `/Users/dylanvu/Projects/computer-use-nap`.
- Runtime data is private and unversioned under
  `/Users/dylanvu/Library/Application Support/ComputerUseAutocompleteV0/`.
  Every runtime directory is mode `0700`; every packet, image, JSONL, command,
  transcript, and database is mode `0600`.
- Environmental preflight and capture-calibration failures may be repaired and
  rerun, but no later probe may start until they pass. One provider may fail if
  another passes. A completed blocking-probe failure—no passing provider,
  unavailable exact Codex dispatch or frontmost partial observation, any stolen unsafe Tab, or any canary
  leak—is terminal for this plan. Run one atomic `probe abort` operation, which
  records and commits the public-safe blocker, then in a guaranteed cleanup
  uninstalls the Hammerspoon loader and verifies restoration before exiting
  nonzero. Stop; do not add
  compensating infrastructure. The abort operation stages only
  `docs/phase-zero-decision.md`, commits it as
  `test: record autocomplete V0 phase-zero blocker`, and never commits private
  evidence.
- `open_url` is deferred from V0. Keep read-only Arc URL access for privacy
  gating, but do not admit, execute, verify, or report URL completions.
- `Control-Option-Space` in editable or sensitive focus emits a metadata-only
  `manual_trigger_suppressed` event with reason `editable_focus` or
  `sensitive_focus`; it creates no packet, provider call, or pill. V0 never
  displays a suggestion that its Tab gate cannot accept.
- Accepted episodes remain excluded from independent next-human exact
  accuracy. Replay also reports a separate **accepted-endorsed match rate**:
  state-plus-history and state-only top-one/top-three exact matches against the
  accepted primitive/identity. This is descriptive and selection-biased, not
  next-human accuracy or a causal history-lift estimate.
- Use only complete exact identifiers. Do not introduce candidate enumeration,
  coordinate clicking, authored text, multi-step routes, automatic retry,
  computer-use execution, or an Arc extension.

## File map

All paths below are relative to
`/Users/dylanvu/Projects/computer-use-autocomplete/` unless an absolute path is
shown.

### Repository and frozen contracts

- `AGENTS.md` — repository safety, scope, runtime-data, and verification rules.
- `README.md` — personal setup, probe gates, start/stop, pause, and recovery.
- `.gitignore` — excludes all runtime data, credentials, generated packets,
  screenshots, databases, transcripts, and local Hammerspoon install state.
- `package.json` — ESM scripts; no production npm dependency in V0.
- `config/runtime-policy.json` — versioned timers, leases, allowlist, privacy
  policy, trigger policy, and expected primitive coverage.
- `config/candidate.schema.json` — exact three-candidate-or-abstain response.
- `config/predictor-instruction.txt` — goal-free next-navigation contract.

### Node runtime

- `src/cli.mjs` — command routing only.
- `src/config.mjs` — validates and freezes the checked-in policy.
- `src/runtime/paths.mjs` — private root layout and permission assertions.
- `src/runtime/clock.mjs` — injected monotonic/wall clocks for deterministic
  tests.
- `src/runtime/json.mjs` — canonical JSON, SHA-256, atomic write, and immutable
  artifact helpers.
- `src/bridge/protocol.mjs` — event/command schemas and enum definitions.
- `src/bridge/event-ingress.mjs` — tails source JSONL and assigns authoritative
  `ingest_seq`/`event_id`.
- `src/bridge/command-writer.mjs` — session, command sequence, heartbeat,
  resync, atomic state snapshots, and acknowledgements.
- `src/ledger/schema.sql` — six-table SQLite schema and indexes.
- `src/ledger/store.mjs` — WAL setup and transactional append/state methods.
- `src/privacy/classifier.mjs` — pure fail-closed privacy classification.
- `src/context/catalog.mjs` — frozen local resolution catalog snapshot.
- `src/context/packet-builder.mjs` — privacy gate, immutable packet, and
  deterministic state-only derivative.
- `src/providers/validate.mjs` — exact schema/identifier/URL validation.
- `src/providers/codex-app-server.mjs` — proposal-only app-server adapter.
- `src/providers/claude-headless.mjs` — proposal-only Claude Code adapter.
- `src/adapters/arc.mjs` — bounded active-URL read/open/verify adapter.
- `src/adapters/codex.mjs` — exact current-task/read/focus/verify adapter.
- `src/state/context-epoch.mjs` — opportunity, invalidation, and one-per-epoch
  rules.
- `src/state/episode-machine.mjs` — five orthogonal lifecycle axes.
- `src/state/causality.mjs` — human tokens, product action IDs, coalescing, and
  origin rules.
- `src/execution/dispatcher.mjs` — one-primitive authority and routing.
- `src/evaluation/labels.mjs` — next-human destination labels.
- `src/evaluation/replay.mjs` — immutable history/state-only replay.
- `src/evaluation/report.mjs` — habit, exact, coverage, accepted-endorsed, and
  infrastructure tables.
- `src/coordinator.mjs` — composes modules; contains no provider- or
  primitive-specific implementation.

### Hammerspoon Spoon

- `hammerspoon/ComputerUseAutocomplete.spoon/init.lua` — lifecycle composition
  only.
- `hammerspoon/ComputerUseAutocomplete.spoon/emit.lua` — private JSONL append
  with `source_seq` and monotonic source time.
- `hammerspoon/ComputerUseAutocomplete.spoon/observer.lua` — physical input,
  focus, burst, quiet, role, and generation observation.
- `hammerspoon/ComputerUseAutocomplete.spoon/privacy.lua` — Secure Input,
  denylist, sensitive/unknown visible-window classification, and pause state.
- `hammerspoon/ComputerUseAutocomplete.spoon/capture.lua` — active-display
  selection and one-shot PNG.
- `hammerspoon/ComputerUseAutocomplete.spoon/bridge.lua` — heartbeat, command
  sequence, session, lease, immutable TTL, and resync handling.
- `hammerspoon/ComputerUseAutocomplete.spoon/authority.lua` — synchronous
  keydown decision; the only code allowed to consume Tab.
- `hammerspoon/ComputerUseAutocomplete.spoon/pill.lua` — non-activating canvas
  and paused/progress/failure states.
- `hammerspoon/ComputerUseAutocomplete.spoon/executor.lua` — app, window, and
  URL dispatch plus endpoint observations.

### Probes, installation, and tests

- `src/install/hammerspoon-loader.mjs` — reversible loader install that
  preserves the existing symlinked Hammerspoon config.
- `src/probes/capture.mjs` — ten-shot display/capture calibration.
- `src/probes/evidence.mjs` — immutable manifest writer/inventory verifier used
  by every probe.
- `src/probes/providers.mjs` — authority, payload-parity, latency, schema, and
  cancellation trials.
- `src/probes/codex.mjs` — three-task identity/focus/invalidation trials.
- `src/probes/tab-safety.mjs` — guided twenty-case physical Tab matrix.
- `src/probes/privacy.mjs` — synthetic and controlled canary suite.
- `src/probes/verify.mjs` — validates immutable probe evidence and emits one
  pass/fail decision.
- `docs/phase-zero-decision.md` — public-safe gate outcome without private
  titles, screenshots, or provider transcripts.
- `test/**/*.test.mjs` — focused unit/contract/integration tests mirroring the
  source paths.
- `test/fixtures/` — synthetic events, privacy windows, packets, provider
  streams, commands, and SQLite scenarios; never copies Dylan's work data.

### Private phase-zero evidence contract

Each probe writes under the private runtime root:

```text
probes/<probe>/attempts/<six-digit-ordinal>/manifest.json
probes/<probe>/attempts/<six-digit-ordinal>/manifest.sha256
probes/<probe>/attempts/<six-digit-ordinal>/artifacts/...
probes/<probe>/latest.json
probes/providers/packet-sets/attempts/<six-digit-ordinal>/manifest.json
probes/providers/packet-sets/attempts/<six-digit-ordinal>/manifest.sha256
probes/providers/packet-sets/attempts/<six-digit-ordinal>/packets/...
probes/providers/packet-sets/latest-real.json
```

`<probe>` is exactly `capture`, `privacy-base`, `privacy-provider`,
`privacy-armed`, `providers`, `codex`, `tab-safety`, or `phase-zero`.
`latest.json` is an atomic `0600` pointer containing only
attempt ordinal and manifest hash; it may advance but never rewrites an attempt.
The manifest has exact keys `schema_version`, `probe`, `status`,
`started_at`, `completed_at`, `policy_sha256`, `source_commit`,
`source_inventory`, `source_inventory_sha256`, `trials`, and
`artifact_inventory`. `source_inventory` is a canonically path-sorted array of
exact keys `path`, `byte_length`, and `sha256`; its canonical JSON bytes produce
`source_inventory_sha256`. Trial objects have stable probe-specific
schemas; inventory entries have relative path, byte length, mode, and SHA-256.
The manifest and sidecar are immutable `0600` files written only after all
artifacts close. Verification recomputes every hash/mode and rejects symlinks,
extra files, missing files, drift, a dirty source tree at probe start, a source
inventory that differs from the exact files at `source_commit`, or a source
commit that is not an ancestor of the final implementation commit. Later
commits may add downstream modules/docs without invalidating an earlier probe;
changing any source file in that probe's inventory requires rerunning it.
Raw Arc URLs exist only in memory for policy classification; persisted evidence
may contain only `had_userinfo`, `had_query`, `had_fragment`, normalized host,
and normalized path when allowed.

The packet-set manifest follows the same source/policy/inventory contract and
adds exact keys `prerequisite_manifest_hashes`, `packet_count`, and
`packet_inventory`. Each packet inventory entry includes packet JSON path/hash,
PNG path/hash, catalog hash, and packet-body hash. It requires exactly five
entries and binds the exact passing privacy-base, privacy-provider, and capture
attempt hashes. Provider manifests must reference this one packet-set manifest
hash; the aggregate verifier rejects different packet sets across providers.

## Chunk 1: Phase-zero gates before the product shell

### Task 1: Bootstrap the isolated repository and frozen policy

**Files:**

- Create: `AGENTS.md`
- Create: `.gitignore`
- Create: `README.md`
- Create: `package.json`
- Create: `config/runtime-policy.json`
- Create: `config/candidate.schema.json`
- Create: `config/predictor-instruction.txt`
- Create: `src/cli.mjs`
- Create: `src/config.mjs`
- Create: `src/runtime/paths.mjs`
- Create: `src/runtime/clock.mjs`
- Create: `src/runtime/json.mjs`
- Test: `test/config.test.mjs`
- Test: `test/cli.test.mjs`
- Test: `test/runtime/paths.test.mjs`
- Test: `test/runtime/json.test.mjs`

- [ ] **Step 1: Initialize the new repository without touching either existing repo**

  First prove the path is absent or an empty directory:

  ```bash
  test ! -e /Users/dylanvu/Projects/computer-use-autocomplete
  ```

  Expected: exit `0`. If it exists, stop and inspect it; do not run `git init`
  until a read-only `find ... -mindepth 1 -maxdepth 1` proves it empty.

  Then run these as separate fail-fast actions:

  ```bash
  mkdir /Users/dylanvu/Projects/computer-use-autocomplete
  cd /Users/dylanvu/Projects/computer-use-autocomplete
  git init -b main
  ```

  Expected: an empty repository whose `git rev-parse --show-toplevel` is
  exactly `/Users/dylanvu/Projects/computer-use-autocomplete`.

- [ ] **Step 2: Write failing policy, canonical-JSON, and permission tests**

  Require this exact top-level policy shape and exact first-run constants:

  ```js
  export const EXPECTED_POLICY = Object.freeze({
    schemaVersion: 1,
    privacyPolicyVersion: 1,
    timing: {
      keyboardQuietMs: 750, scrollQuietMs: 400, stabilizationMs: 800,
      semanticQuietMs: 300, humanCauseMaxMs: 1000,
      providerDeadlineMs: 5000, suggestionTtlMs: 5000,
      heartbeatEveryMs: 250, heartbeatLeaseMs: 1000,
      adapterPollMs: 200, adapterLeaseMs: 350,
      historyMaxMs: 900000, historyMaxEvents: 100, labelHorizonMs: 30000
    },
    actions: ['activate_app', 'focus_window', 'focus_codex_task', 'open_url'],
    manualTriggerEditableBehavior: 'suppress_and_log',
    openUrlExpectedCoverage: 'sparse_by_privacy_policy',
    acceptedEndorsedReplay: true,
    privacy: {
      unknownBehavior: 'suppress',
      sensitiveRoles: ['AXSecureTextField'],
      denylistedBundleIds: [
        'com.apple.Passwords', 'com.apple.keychainaccess',
        'com.1password.1password', 'com.agilebits.onepassword7'
      ],
      denylistedProcessNames: ['SecurityAgent', 'authorizationhost'],
      denylistedNamePatterns: [
        'password', 'wallet', 'keychain', 'ledger', 'trezor', 'metamask', 'phantom'
      ]
    }
  });
  ```

  Tests must reject extra/missing policy keys, non-integer durations, any fifth
  primitive, world/group-readable runtime artifacts, non-canonical JSON, hash
  drift, and writes inside either Git repository.

- [ ] **Step 3: Run the contract tests and verify RED**

  Run:

  ```bash
  node --test test/cli.test.mjs test/config.test.mjs \
    test/runtime/paths.test.mjs test/runtime/json.test.mjs
  ```

  Expected: module-not-found failures for the four unimplemented source modules.

- [ ] **Step 4: Implement the minimal frozen contracts**

  `paths.mjs` resolves the private root from a constant—not `$HOME`—creates it
  with `0700`, rejects symlinks in the directory chain, and exposes only named
  subdirectories. `json.mjs` canonicalizes recursively sorted object keys,
  preserves array order, terminates with one newline, hashes bytes, and uses
  exclusive/atomic writes with `0600`.

- [ ] **Step 5: Implement the exact candidate union and predictor instruction**

  The response always has exactly `candidates` and `abstain_reason`. It is
  exactly one of:

  ```json
  {
    "candidates": [
      {"rank":1,"model_target_label":"Codex task","confidence":"high","action":{"kind":"focus_codex_task","thread_id":"thread-1"}},
      {"rank":2,"model_target_label":"Arc","confidence":"medium","action":{"kind":"activate_app","bundle_id":"company.thebrowser.Browser"}},
      {"rank":3,"model_target_label":"Notes window","confidence":"low","action":{"kind":"focus_window","bundle_id":"com.microsoft.VSCode","window_id":42}}
    ],
    "abstain_reason": null
  }
  ```

  Or:

  ```json
  { "candidates": [], "abstain_reason": "insufficient evidence" }
  ```

  JSON Schema uses `oneOf` for those two complete shapes. Candidate objects
  contain only `rank`, `model_target_label`, `confidence`, and `action`;
  `confidence` is exactly `high|medium|low`; ranks are exactly ordered 1/2/3;
  and `action` is an exact-key discriminated union:

  ```text
  activate_app:     kind, bundle_id
  focus_window:     kind, bundle_id, window_id
  focus_codex_task: kind, thread_id
  open_url:         kind, url
  ```

  Application-level validation enforces distinct targets, exact rank order,
  trimmed nonempty labels/reasons, and the exclusive candidate/abstain union.
  The instruction says to predict one immediate navigation completion from the
  supplied current state and history, return three distinct candidates or
  abstain, never use tools, never invent identifiers, never type or commit, and
  never emit a route containing more than one primitive.

- [ ] **Step 6: Run tests and verify GREEN**

  Implement `src/cli.mjs` as a no-side-effect command router with `--help`,
  explicit known command names, lazy imports, and nonzero exit for an
  unimplemented/unknown command. Run the Step 3 command. Expected: all tests
  pass with zero skipped tests.

- [ ] **Step 7: Commit the bootstrap and enter the feature branch**

  ```bash
  git add AGENTS.md .gitignore README.md package.json config src test
  git commit -m "chore: bootstrap autocomplete V0 contracts"
  git switch -c codex/v0
  ```

### Task 2: Build only the ordered bridge and immutable probe-evidence substrate

**Files:**

- Create: `src/bridge/protocol.mjs`
- Create: `src/bridge/event-ingress.mjs`
- Create: `src/bridge/command-writer.mjs`
- Create: `src/probes/evidence.mjs`
- Create: `src/probes/record-stop.mjs`
- Create: `docs/phase-zero-decision.md`
- Test: `test/bridge/protocol.test.mjs`
- Test: `test/bridge/event-ingress.test.mjs`
- Test: `test/bridge/command-writer.test.mjs`
- Test: `test/probes/evidence.test.mjs`
- Test: `test/probes/record-stop.test.mjs`

- [ ] **Step 1: Write failing ordered-ingress and command-state tests**

  Cover `0600` creation of JSONL/command/artifact files, partial JSONL records,
  duplicate source events, source restarts,
  authoritative arrival-order `ingest_seq`, immutable `event_id`, atomic rename,
  heartbeat expiry, session mismatch, command gaps, acknowledgement-only
  `source_seq` changes, and lease refreshes that do not change
  `local_generation` or extend a suggestion TTL.

- [ ] **Step 2: Write failing immutable-manifest tests**

  Exercise every exact private evidence path/schema above. Assert exclusive
  `0600` writes, `0700` directories, canonical manifests, SHA sidecars,
  historical `source_commit` plus canonical source-path inventory binding,
  artifact inventories, raw-URL absence,
  symlink/extra/missing/drift rejection, and idempotent verification. No SQLite
  or full lifecycle state machine is built in phase zero.

- [ ] **Step 3: Run the focused tests and verify RED**

  ```bash
  node --test test/bridge/*.test.mjs test/probes/evidence.test.mjs \
    test/probes/record-stop.test.mjs
  ```

  Expected: module-not-found failures for bridge and evidence modules.

- [ ] **Step 4: Implement protocol validation and event ingress**

  Every source record has `bridge_session_id`, `source_seq`, `source_mono_ns`,
  `kind`, and exact kind-specific payload. Node alone assigns `ingest_seq` and
  UUID `event_id` in the probe ingress journal. Duplicate
  `(bridge_session_id, source_seq)` records are idempotent; conflicting bytes
  are fatal bridge corruption.

  Freeze the complete dormant runtime command/event envelope now so Chunk 2
  never changes probe-inventoried bridge files. Commands are exactly
  `unarmed_snapshot`, `arm_suggestion`, `invalidate`, `lease_refresh`,
  `capture_request`, `execute_native`, `show_progress`, and `show_failure`.
  Product events are exactly `suggestion_shown`, `tab_accepted`,
  `escape_dismissed`, `escape_stop_requested`, `action_dispatched`,
  `action_observed`, `verification_result`, `capture_result`, and
  `bridge_resync_requested`. Phase-zero stages reject dormant execution commands
  by runtime stage; they do not treat them as unknown protocol.

  Freeze exact payload schemas too. `C` means every command has
  `{protocol_version,bridge_session_id,command_seq,issued_mono_ns,kind,
  context_epoch,local_generation}`; `E` means every event has the source
  envelope above plus `{context_epoch,local_generation}`. Required payloads:

  ```text
  C unarmed_snapshot {reason}
  C arm_suggestion {episode_id,suggestion_instance_id,ttl_duration_ms,provider_lease_expires_mono_ns,required_leases,promise_text,primitive,target_identity}
  C invalidate {episode_id,reason}
  C lease_refresh {episode_id,suggestion_instance_id,provider_lease_expires_mono_ns,required_leases}
  C capture_request {request_id,episode_id,display_id}
  C execute_native {action_id,episode_id,source_seq_floor,primitive,target,expected_identity_set}
  C show_progress {action_id,episode_id,promise_text}
  C show_failure {action_id,episode_id,reason_code}
  E suggestion_shown|tab_accepted|escape_dismissed {episode_id,suggestion_instance_id}
  E escape_stop_requested {action_id,episode_id}
  E action_dispatched {action_id,episode_id,source_seq_floor,primitive,expected_identity_set}
  E action_observed {action_id,episode_id,source_seq_floor,observed_identity_set,evidence_kind}
  E verification_result {action_id,episode_id,source_seq_floor,result,observed_identity_set,evidence_kind}
  E capture_result {request_id,episode_id,status,display_id,path,byte_length,sha256,reason_code}
  E bridge_resync_requested {last_applied_command_seq,observed_command_seq,reason}
  ```

  UUID fields are canonical lowercase UUIDv7 strings; sequence/monotonic values
  are unsigned decimal strings; epoch/generation/window/display/byte length are
  nonnegative safe integers; hashes are lowercase SHA-256 hex; promise text is
  normalized 1–120 characters; reason codes are closed policy enums. `target`
  and `target_identity` are the same closed union: app `{kind,bundle_id}`, window
  `{kind,bundle_id,window_id}`, Codex `{kind,thread_id}`, or URL `{kind,url}`
  where URL is normalized query/fragment/userinfo-free HTTPS. `required_leases`
  is an exact map whose only optional keys are `codex` and `arc`; it contains
  every packet dependency and maps each present key to an expiry, while `{}` is
  valid when neither adapter is required. Identity sets are
  canonically sorted unique arrays of 1–4 grammar-checked `app:`, `window:`,
  `codex_task:`, or `url:` strings. Capture status is `ok|suppressed|failed`:
  only `ok` permits/requires path, byte length, and hash with null reason; the
  other two require those three null and a closed reason code. Verification
  result is `verified_exact|observed_partial|failed|precondition_failed`: the
  first two require a nonempty observed set and non-`none` evidence; the latter
  two permit an empty set and `none` evidence. Evidence kind is exactly
  `frontmost_bundle|focused_window|codex_thread|arc_url|none`. Private paths
  must resolve under the runtime root.
  Schemas reject type/nullability/enum/unknown/missing violations, and
  phase-zero tests exercise every kind in both Node and Lua fixture validators.

- [ ] **Step 5: Implement immutable suggestion timing and resync**

  The first arm for `suggestion_instance_id` carries `ttl_duration_ms=5000`.
  Hammerspoon—not Node wall time—will establish expiry on receipt. Later lease
  updates preserve that ID and carry no new TTL. A command gap produces
  `bridge_resync_requested`; Node hides/stales/cancel-requests live work,
  records no feedback, rotates session ID, and writes a complete unarmed state.

- [ ] **Step 6: Implement the immutable probe-evidence writer**

  Each probe opens a private working directory, writes artifacts exclusively,
  closes them, inventories exact relative paths/modes/lengths/hashes, then
  atomically freezes `manifest.json` and `manifest.sha256`. A failed attempt is
  preserved as a numbered private attempt; only an explicit rerun command may
  create the next attempt. The aggregate verifier reads the latest frozen
  attempt without mutating it.

  Implement the internal `recordStop()` at the same time. It accepts only a
  known probe and verified frozen manifest hash, writes a public-safe fail
  decision with no private labels/artifacts, and refuses to overwrite an
  existing decision. It does not exit the process; Task 3's atomic abort command
  will compose record, exact-note commit, uninstall, restoration verification,
  then one final nonzero exit.

- [ ] **Step 7: Run the focused tests and commit**

  ```bash
  node --test test/bridge/*.test.mjs test/probes/evidence.test.mjs \
    test/probes/record-stop.test.mjs
  ```

  Expected: exit `0`, all focused tests pass. Then separately:

  ```bash
  git add src/bridge src/probes/evidence.mjs src/probes/record-stop.mjs \
    docs/phase-zero-decision.md test/bridge test/probes/evidence.test.mjs \
    test/probes/record-stop.test.mjs
  git commit -m "feat: add ordered bridge and probe evidence"
  ```

### Task 3: Calibrate active-display capture and fail-closed privacy

**Files:**

- Create: `hammerspoon/ComputerUseAutocomplete.spoon/init.lua`
- Create: `hammerspoon/ComputerUseAutocomplete.spoon/emit.lua`
- Create: `hammerspoon/ComputerUseAutocomplete.spoon/observer.lua`
- Create: `hammerspoon/ComputerUseAutocomplete.spoon/privacy.lua`
- Create: `hammerspoon/ComputerUseAutocomplete.spoon/capture.lua`
- Create: `src/privacy/classifier.mjs`
- Create: `src/adapters/arc.mjs`
- Create: `src/install/hammerspoon-loader.mjs`
- Create: `src/probes/abort.mjs`
- Create: `src/probes/capture.mjs`
- Create: `src/probes/privacy.mjs`
- Create: `src/probes/preflight.mjs`
- Test: `test/privacy/classifier.test.mjs`
- Test: `test/adapters/arc.test.mjs`
- Test: `test/install/hammerspoon-loader.test.mjs`
- Test: `test/probes/abort.test.mjs`
- Test: `test/probes/capture.test.mjs`
- Test: `test/probes/privacy.test.mjs`
- Test: `test/probes/preflight.test.mjs`

- [ ] **Step 1: Write failing synthetic privacy, Arc, and installer tests**

  Privacy fixtures cover Secure Input, `AXSecureTextField`, editable focus,
  denylisted foreground/background windows, intersecting and non-intersecting
  displays, unknown bundle/role, raw Arc userinfo/query/fragment, manual pause,
  and an ordinary allowed display. Unknown is always suppress.

  Arc tests parse the raw active URL only in memory and persist only coarse
  presence flags plus allowed normalized host/path. Userinfo/query/fragment
  values and the raw string must be absent from JSONL, manifest, error, and
  outbound-capture fixtures.

  Installer tests use a temporary fake `.hammerspoon` tree. They require the
  actual current shape—`init.lua` may be a symlink—and prove install/uninstall
  never edits the original symlink target, records its exact prior form under
  the private runtime root, uses atomic replacement, and refuses drift.

- [ ] **Step 2: Run the focused tests and verify RED**

  ```bash
  node --test test/privacy/classifier.test.mjs \
    test/adapters/arc.test.mjs \
    test/install/hammerspoon-loader.test.mjs \
    test/probes/capture.test.mjs test/probes/privacy.test.mjs \
    test/probes/preflight.test.mjs test/probes/abort.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 3: Implement the minimal Spoon observer, Arc reader, and privacy snapshot**

  Port only generic eventtap/window patterns from the old spike. Never record
  printable characters, clipboard values, form values, or complete AX trees.
  Node creates the JSONL leaf exclusively at `0600` before Spoon start;
  `emit.lua` opens only that existing regular non-symlink file for append and
  refuses to create or chmod it itself.
  The privacy snapshot returns focused role/editability, Secure Input, active
  display, and every visible intersecting window's bundle/role/subrole. Any
  failed query is `unknown`, increments `local_generation`, and suppresses.

  `init.lua` is finalized here as a stable composition registry. It always
  knows the future module names `bridge`, `authority`, and `pill`, but enables
  them only when those files exist and the runtime stage requires them; a stage
  requiring a missing/hash-mismatched module fails closed. Task 6 adds those
  new files without modifying `init.lua`, so capture/privacy-base evidence is
  not invalidated later.

  `src/adapters/arc.mjs` invokes only read-only AppleScript against Arc's native
  scripting dictionary for `currentUrl()`. It returns the raw URL to the privacy
  classifier in memory, zeroes the reference after classification, and exposes
  only the coarse safe result to evidence/packet code.

- [ ] **Step 4: Implement capture only after privacy and raw-URL preflight**

  Resolve active display from the focused window, not mouse location. First ask
  the Arc adapter for the raw URL when Arc is active; suppress on userinfo,
  query, or fragment. Then classify all intersecting windows. Only an allowed
  result may call `hs.screen:snapshot()` and save one PNG. Node immediately
  verifies PNG signature/dimensions, enforces `0600`, hashes it, and records
  capture latency. No thumbnail or other display is captured.

- [ ] **Step 5: Implement the reversible Hammerspoon loader**

  Generate a private loader that first loads the exact pre-existing init path,
  then loads this Spoon. Preserve the current symlink itself as install-state
  metadata; uninstall restores it only if the installed loader has not drifted.
  Do not edit the current old spike or its symlink target. The private loader
  registers `hammerspoon://computer-use-autocomplete-reload`; reload emits an
  `observer_started` record containing policy hash, Spoon source hash, and
  version so controlled trials can prove the loaded code matches Git.

  Implement `probe abort --probe NAME --from-latest` in the same step, where
  `NAME` is restricted to the exact probe enum in the evidence contract.
  It verifies the latest frozen manifest, calls `recordStop()`, stages only the
  decision note in an otherwise clean source tree, commits the fixed blocker
  message, restores the exact prior Hammerspoon init form, verifies restoration,
  and only then exits `2`. A `try/finally` guarantees uninstall and restoration
  even if the Git commit fails; that case exits `3` after cleanup and reports
  the uncommitted note as the sole remaining source change. Tests inject fake
  Git/installer processes and prove exact staging and cleanup before exit.

- [ ] **Step 6: Run automated tests; do not install on failure**

  ```bash
  node --test test/privacy/classifier.test.mjs \
    test/adapters/arc.test.mjs \
    test/install/hammerspoon-loader.test.mjs \
    test/probes/capture.test.mjs test/probes/privacy.test.mjs \
    test/probes/preflight.test.mjs test/probes/abort.test.mjs
  ```

  Expected: exit `0`, all tests pass. Stop this step on any nonzero exit.

- [ ] **Step 7: Commit the clean probe source before collecting evidence**

  ```bash
  git add hammerspoon src/privacy src/adapters/arc.mjs src/install src/probes \
    test/privacy test/adapters/arc.test.mjs test/install test/probes
  git commit -m "feat: add fail-closed capture and privacy substrate"
  ```

  Expected: `git status --porcelain` is empty. Every following Task 3 manifest
  records this commit and the exact source inventory it exercised.

- [ ] **Step 8: Install, restart Hammerspoon, and verify required Mac permissions**

  Run:

  ```bash
  node src/cli.mjs install-hammerspoon --restart
  ```

  The installer atomically installs the loader, asks a running Hammerspoon to
  quit, waits for exit, reopens it, and waits for `observer_started` carrying
  the exact committed policy/Spoon hashes. This initial restart cannot depend
  on the not-yet-loaded reload URL. Expected: `LOADED_SPOON=PASS`.

  Then run:

  ```bash
  node src/cli.mjs probe preflight
  ```

  The preflight verifies Accessibility eventtap/window/AX reads, Screen
  Recording through a local throwaway capture, Apple Events read access for
  Arc and Codex, the expected existing-loader preservation record, and the
  loaded policy/Spoon hashes. Missing permission is reparable: grant it
  manually, reload through the registered URL, and rerun preflight. Expected:
  `MAC_PREFLIGHT=PASS`; otherwise do not continue.

- [ ] **Step 9: Run and freeze the base pre-cloud canary suite**

  ```bash
  node src/cli.mjs probe privacy --precloud
  ```

  Use only synthetic/local capture sinks—no provider process or network. Test
  Secure Input, secure/editable/unknown roles, denylisted foreground and
  background windows, raw Arc URL values, manual pause, and one controlled
  system-password surface without entering a real secret. Scan the entire
  private runtime root—not only the current attempt—for every unique in-memory canary and
  assert JSONL/artifact modes are `0600`. Expected:
  `PRIVACY_PRECLOUD=PASS`, a frozen privacy attempt selected by
  `probes/privacy-base/latest.json`, and zero canary bytes. Any leak is terminal:
  run `node src/cli.mjs probe abort --probe privacy-base --from-latest` and stop
  before provider code is invoked.

- [ ] **Step 10: Run the ten-shot capture calibration**

  ```bash
  node src/cli.mjs probe capture --shots 10
  ```

  Follow the guided matrix across both displays, app switches, window changes,
  and one negative-origin display case. Expected: 10/10 correct active displays,
  intended post-transition state in every image, p95 capture latency below 500
  ms. The frozen attempt is addressed by `probes/capture/latest.json`. A wrong display
  or stale frame is reparable calibration work, but provider timing remains
  blocked until a fresh immutable attempt passes.

### Task 4: Compare proposal providers under one enforced tool-free contract

> **Two-sided run completed and blocked on 2026-08-01.** Dylan narrowed the
> contract only for Codex's non-machine-authority `update_plan` advertisement;
> any invocation remained invalid and the manifest reported a counted warm
> tool-invocation rate. Claude used API-key-backed `--bare` with structural tool
> exclusion. After spec and code-quality review, both arms ran on the same five
> canonical metadata fixtures. Claude returned `0/5` valid warm calls and
> `4,080.54 ms` p50 with `0/5` tool invocations. Codex's fresh authority proof
> produced no exact generated model request and failed before a live call.
> Frozen manifest:
> `412eed079f3ec4c4762590cafcea5680f1ccb170097544a214c362d30c2b0540`.
> No provider was selected; do not begin Task 5. See
> [[computer-use-autocomplete-provider-bakeoff-2026-08-01|the result note]].

> **Stopped at the provider gate on 2026-07-31.** The reviewed metadata-only
> packet/provider foundation is green at 313 tests, but neither installed
> provider can satisfy the exact zero-tool authority contract. Claude's
> isolated `--bare` mode needs an `ANTHROPIC_API_KEY`, which is absent; Codex
> CLI `0.144.6` rejects the override needed to remove its unconditional
> `update_plan` tool. The frozen conditional preflight made zero model calls,
> selected no provider, and left both authority and live qualification false.
> Per Step 11, do not begin Task 5 without a new decision: provide a Claude API
> key or amend the zero-tool contract narrowly.

> **Scope correction:** Run Claude Code headless first. Implement/run the Codex
> app-server discovery and authority path only if Claude fails the latency or
> capability gate. `open_url` is not an admitted V0 candidate. Under the
> metadata-only decision, packets are JSON-only, contain no screenshot fields,
> and do not require a passing capture manifest.

**Files:**

- Create: `src/providers/validate.mjs`
- Create: `src/providers/codex-app-server.mjs`
- Create: `src/providers/claude-headless.mjs`
- Create: `src/probes/providers.mjs`
- Create: `src/probes/provider-packets.mjs`
- Test: `test/providers/validate.test.mjs`
- Test: `test/providers/codex-app-server.test.mjs`
- Test: `test/providers/claude-headless.test.mjs`
- Test: `test/probes/providers.test.mjs`
- Test: `test/probes/provider-packets.test.mjs`
- Create: `test/fixtures/provider-packets/*.json`
- Create: `test/fixtures/provider-packets/*.png`
- Create: `test/fixtures/provider-streams/*.jsonl`

- [ ] **Step 1: Write failing validation, stream, timeout, and cancellation tests**

  Reject 1/2/4 candidates, duplicate rank/target, unknown keys/kinds, invented
  IDs, unavailable live targets, non-HTTPS or unsafe URLs, malformed abstain,
  tool events, partial finals, and responses after a terminal state. Use fake
  processes to prove acknowledged cancellation and forced termination at the
  five-second monotonic deadline.

- [ ] **Step 2: Run provider tests and verify RED**

  ```bash
  node --test test/providers/*.test.mjs test/probes/providers.test.mjs \
    test/probes/provider-packets.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 3: Implement the shared provider contract and exact validator**

  Both adapters implement `propose(packet, signal)` and `cancel(requestId)` and
  return normalized event streams plus one validated final. Persist raw private
  streams in the provider probe attempt, but admit only the normalized union to
  probe evidence. Implement `src/probes/providers.mjs` here; it writes the exact
  provider manifest contract and refuses to start unless the frozen pre-cloud
  privacy and capture manifests both verify.

  Implement `provider-packets.mjs` as the narrow Probe-A packet builder: one
  allowed active-display PNG, exact current app/window/focused-role/display,
  current Codex task or Arc URL when present, up to 100 chronological events
  from 15 minutes, request metadata, and a separately hashed local resolution
  catalog. It contains no future label and writes only the immutable private
  packet-set contract above. Chunk 2's runtime builder must later reproduce
  these schema/hash tests rather than silently change the probe input.

- [ ] **Step 4 (conditional): Implement Codex app-server discovery only if Claude fails**

  Run exact discovery before a model call:

  ```bash
  codex --version
  codex app-server generate-json-schema --help
  codex app-server --help
  ```

  Create a private temporary directory and generate the schema with:

  ```bash
  AUTOCOMPLETE_SCHEMA_DIR="$(mktemp -d /private/tmp/autocomplete-app-server.XXXXXX)"
  codex app-server generate-json-schema --experimental --out "$AUTOCOMPLETE_SCHEMA_DIR"
  ```

  Pin CLI version, every generated file hash, and discovered request/event
  methods. Before proceeding, require the installed app-server to expose all of:
  an ignore-user-config or equivalent isolated-config mode, an ephemeral
  non-persisted thread, an empty plugin/hook registry, and an empty tool/MCP
  registry. If the generated protocol or `--help` cannot prove each boundary,
  Codex is `authority_failed` before any model call.

  The adapter launches stdio with `--strict-config` and explicit
  feature disables for `shell_tool`, `unified_exec`, `code_mode`,
  `computer_use`, `apps`, `browser_use`, `in_app_browser`, `web_search`,
  `enable_mcp_apps`, `tool_suggest`, `deferred_executor`, `plugins`, and
  `hooks`; it also supplies an empty MCP configuration, isolated user config,
  read-only sandbox config, and `ephemeral=true` for the proposal thread.
  Startup rejection of any setting or persistence under the normal Codex data
  root is an authority failure, not permission to remove it.

  The tested argv is pinned exactly by the adapter test and is equivalent to:

  ```bash
  codex app-server --stdio --strict-config \
    --disable shell_tool --disable unified_exec --disable code_mode \
    --disable computer_use --disable apps --disable browser_use \
    --disable in_app_browser --disable enable_mcp_apps \
    --disable tool_suggest --disable deferred_executor \
    --disable plugins --disable hooks \
    -c 'web_search="disabled"' -c 'mcp_servers={}' \
    -c 'sandbox_mode="read-only"'
  ```

  The actual tested argv must additionally contain whatever documented
  installed flag supplies isolated user config; the test pins it exactly. If
  no such flag exists, do not invent one or use the normal Codex home—mark the
  provider ineligible. Thread-start tests require the discovered ephemeral
  field and verify no thread appears in normal Codex history after the canary.

  Unit tests use frozen schemas/streams to assert that initialized sessions with
  any callable tool, tool registry, missing image transport, normal-home
  persistence, or absent isolation are rejected. Do not start an authority or
  model request in this step.

- [ ] **Step 5: Implement Claude headless authority and payload-parity checks without a model call**

  First record `claude --version` and relevant `claude --help` output. Launch
  from a private empty cwd with `--print`, `--output-format stream-json`,
  `--setting-sources ""`, an explicit settings object with empty hooks,
  `--tools ""`, `--strict-mcp-config`, `--mcp-config '{"mcpServers":{}}'`,
  `--no-chrome`, `--disable-slash-commands`, `--no-session-persistence`, and
  `--permission-mode dontAsk`. If the installed CLI rejects empty setting
  sources, loads any user/project/local hook, plugin, MCP, or tool, the adapter
  is ineligible; do not relax isolation to preserve subscription auth.

  The eventual live probe must establish a documented streaming image+JSON input path; a
  hidden Read tool, file-path prompt, or text-only substitute is not payload
  parity. Any tool event or missing image support makes Claude ineligible and
  no latency call counts. This step builds and unit-tests argv/event/payload
  validation only; it does not launch Claude.

- [ ] **Step 6: Run the provider tests**

  ```bash
  node --test test/providers/*.test.mjs test/probes/providers.test.mjs \
    test/probes/provider-packets.test.mjs
  ```

  Expected: exit `0` with no skipped tests.

- [ ] **Step 7: Commit the clean provider source before transport or model evidence**

  ```bash
  git add src/providers src/probes/providers.mjs src/probes/provider-packets.mjs \
    test/providers test/probes/providers.test.mjs \
    test/probes/provider-packets.test.mjs test/fixtures/provider-*
  git commit -m "feat: add tool-free proposal provider probe"
  ```

  Expected: clean status. Later provider/privacy manifests bind to this source
  commit and source inventory.

- [ ] **Step 8: Rerun canaries through the real serializers with networking disabled**

  ```bash
  node src/cli.mjs probe privacy --provider-transports --network-disabled
  ```

  The command instantiates both actual adapters but replaces their process
  launchers with a local capture sink that cannot open a network connection. It
  serializes the same PNG+JSON request shape, including cancellation, scans the
  entire private runtime root—not only the new attempt—for every unique canary,
  verifies normal Codex/Claude data roots were untouched, and freezes
  `privacy-provider`. Expected: `PRIVACY_PROVIDER=PASS` and
  `probes/privacy-provider/latest.json`. Any leak invokes
  `probe abort --probe privacy-provider --from-latest` and stops before a model
  call.

- [ ] **Step 9: Build the five-packet private measured set**

  ```bash
  node src/cli.mjs probe providers prepare-real-packets --count 5
  ```

  The checked-in fixtures remain synthetic tests only. This guided command
  captures five representative allowed current-state-plus-history packets,
  verifies each against the privacy/capture prerequisites, freezes them outside
  Git, and advances `probes/providers/packet-sets/latest-real.json`. It makes no
  model call. Expected: exactly five distinct packet hashes.

- [ ] **Step 10: Run one cold and five counted warm calls per eligible provider**

  ```bash
  node src/cli.mjs probe providers run --packet-set latest-real
  ```

  The command first launches each candidate's committed adapter and runs its
  live isolation/payload canary. Codex receives one synthetic request asking for
  a tool; Claude receives the equivalent. Any tool item/registry, hook/plugin,
  normal-home persistence, missing image transport, or isolation ambiguity
  makes that provider `authority_failed` before counted latency.

  For eligible providers, use the same five private packets, prompt, output
  schema, deadline, and validation. Record the cold call separately. Expected for a pass: 5/5
  schema-valid warm calls and warm p50 at or below 2500 ms. Also run one
  acknowledged cancel and one ignore-cancel-until-deadline case. An individual
  provider may fail while the other passes. Before freezing, select the faster
  passing provider and assemble the complete manifest: selected provider, exact
  model/version/effort, CLI/app-server version, prompt/schema/packet-set hashes,
  every raw latency, authority evidence, and every failed-candidate reason.
  Freeze once and advance `probes/providers/latest.json`.

- [ ] **Step 11: Verify the frozen provider decision or stop**

  Read the immutable manifest; do not add or change fields. If it names one
  passing selected provider, continue. If neither provider passes, run
  `node src/cli.mjs probe abort --probe providers --from-latest`; after its
  verified cleanup and exit `2`, stop this plan before Task 5.

### Task 5: Prove exact Codex task identity and structured focus

> **Amended after attempts 000002–000003:** Keep the exact-route construction
> and controlled routing evidence below, but replace independent exact reread
> with the read-derived contract in the plan-wide amendment above. The
> executor records `observed_partial` on frontmost Codex unless a matching
> product-owned dispatch already supplies the thread. Next-human task labels
> may be resolved from bounded thread-list diffs after composer activity. Task 6
> no longer depends on a universally readable current desktop thread and is
> unblocked by frozen read-path attempt `000003`.

**Files:**

- Create: `src/adapters/codex.mjs`
- Create: `src/probes/codex.mjs`
- Test: `test/adapters/codex.test.mjs`
- Test: `test/probes/codex.test.mjs`

- [ ] **Step 1: Write failing adapter tests against a fake structured surface**

  Require `currentTask() -> {threadId,title}|null`, ordered `task_changed` and
  optional `turn_completed`, bounded polling fallback, a 350 ms lease, exact
  `focusTask(threadId,{actionId,sourceSeqFloor})` verification, disconnect
  invalidation, and task title
  collisions that still resolve by ID. Absence of structured completion events
  disables only that trigger; it does not fail exact identity/focus.

- [ ] **Step 2: Run the tests and verify RED**

  ```bash
  node --test test/adapters/codex.test.mjs test/probes/codex.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 3: Implement the exact structured-surface discovery contract without executing it**

  Build and unit-test command parsers for these read-only checks:

  ```bash
  plutil -extract CFBundleURLTypes json -o - /Applications/ChatGPT.app/Contents/Info.plist
  sed -n '1,260p' /Applications/ChatGPT.app/Contents/Resources/scripting.sdef
  osascript -e 'tell application id "com.openai.codex" to get URL of active tab of front window'
  osascript -e 'tell application id "com.openai.codex" to get title of active tab of front window'
  ```

  At live probe time, also inspect the generated app-server schema from Task 4 for thread list/read
  and task/turn events. Discovery passes only if a public structured read returns
  an exact active `codex://threads/<threadId>` plus readable title and the
  registered `codex` handler can reopen that same route. Do not search
  `app.asar`, Electron internals, private state databases, or UI coordinates.
  If the installed app exposes no window to AppleScript during the later guided
  probe, make one normal task window visible and rerun that attempt; continued
  absence is a probe failure. Do not execute these checks while source is dirty.

- [ ] **Step 4: Implement only the discovered structured surface**

  Probe the app-server thread list/events plus the installed app's registered
  `codex://threads/{threadId}` route and Chromium scripting dictionary. Read the
  active tab URL/title through AppleScript when available; normalize only an
  exact `codex://threads/<id>` route. Focus by opening that exact registered
  route, then re-read the active route and require the same thread ID. Do not
  inspect Electron internals, read private state databases, traverse arbitrary
  UI, or click coordinates. If app-server exposes no structured
  `turn_completed`, set capability `completion_trigger=false` and omit that
  trigger without failing identity/focus. While `focusTask` is in flight, direct
  task events carry its exact `actionId` and `sourceSeqFloor`; unrelated task
  events remain human/system/unknown under the shared causality rules.

- [ ] **Step 5: Run tests and commit the clean Codex adapter source**

  ```bash
  node --test test/adapters/codex.test.mjs test/probes/codex.test.mjs
  ```

  Expected: exit `0`. Then separately:

  ```bash
  git add src/adapters/codex.mjs src/probes/codex.mjs test/adapters test/probes/codex.test.mjs
  git commit -m "feat: add structured Codex task probe"
  ```

  Expected: clean status. The controlled manifest binds to this source commit.

- [ ] **Step 6: Run the three-task controlled probe**

  ```bash
  node src/cli.mjs probe codex --tasks 3
  ```

  The command first runs the committed discovery contract. Whether discovery
  passes or fails, it freezes a `codex` attempt and advances
  `probes/codex/latest.json`, so terminal cleanup always has an exact manifest.
  On discovery pass, switch repeatedly among three existing public-safe tasks. Verify exact ID and
  readable title, ordered changes, history retention after leaving Codex, exact
  focus/verification for each ID, invalidation during one outstanding proposal,
  and invalidation during one fake displayed pill within the 350 ms lease.
  Freeze exact trials and advance `probes/codex/latest.json`.

- [ ] **Step 7: Apply the stop condition**

  Expected: every read and focus request resolves to the intended thread ID. A
  generic Codex window title, focus without exact re-read, private-only hook, or
  missing current-task identity is a failure. Only on that failure, run
  `node src/cli.mjs probe abort --probe codex --from-latest` and stop after its
  verified cleanup; do not downgrade to generic Codex activation.

  **Superseded result:** The stop condition fired twice for the AX-title to
  app-server-ID join. Per the preregistered fallback, stop repairing exact
  reread and proceed only under activity-derived identity. The remaining hard
  stop is failure to dispatch the exact route or establish frontmost Codex as
  partial endpoint evidence.

- [x] **Step 8: Run the frozen desktop event-visibility probe**

  ```bash
  node src/cli.mjs probe codex-activity --trials 3
  ```

  The probe attaches the same sessionless standalone app-server listener V0
  plans to use. Select three existing tasks from the private Terminal prompt.
  For each, begin passive buffering, then Dylan manually focuses that task in
  Codex Desktop, types a short composer message, sends it, and confirms the send
  out of band. Probe code performs no UI action. Titles and IDs stay out of the
  frozen manifest. Only 3/3 correct thread-ID events whose receive latency from
  app-server `turn.startedAt` is within 30 seconds pass.

- [x] **Step 9: Apply the event-visibility stop condition**

  On 3/3 PASS, proceed directly to Task 6. On 0/3 or any partial result, freeze
  FAIL and stop before Task 6 for an architecture decision. Do not repair with
  title joins, generic Codex activation, or another informal retry.

  **Frozen result:** FAIL, `0/3`. The sessionless standalone listener attached,
  but all three distinct desktop-originated sends froze `event_not_observed`.
  Manifest:
  `3cf152c8aa6e68dbae7417106bbbfc38433230e62b8eaf8ffa9eb55846085461`,
  source commit `561ab6d1a914a7ede2cb42a7e6c6887fa6b3d4cb`. Standard verification passed.
  Stop here for an architecture decision.

- [x] **Step 10: Run the frozen thread-list read-path variant**

  ```bash
  node src/cli.mjs probe codex-activity-read --trials 3
  ```

  For each of three distinct tasks, privately preserve a full baseline and
  fresh 2-, 10-, and 30-second reads. Dylan performs every UI action. Pass only
  if the expected exact thread ID shows a timestamp/count or raw-order mutation
  within the schedule. Perform every scheduled read even after an early change.

  **Frozen result:** PASS, `3/3`. Every expected ID showed `recencyAt`
  advancement and raw-order movement by the first scheduled read; all `9/9`
  scheduled reads succeeded. Manifest:
  `057ce508a067030a09d834dc94f1355c08a9c38f3aa67751c2d5528f8e219de5`,
  source commit `40933c66292fd6aca9dbab43eaaa581f5172f5b1`. Standard verification passed.

- [x] **Step 11: Apply the read-path branch**

  Select read-derived identity. Exact next-human labels come from bounded
  thread-state diffs; the thread list supplies the exact-ID/title candidate
  catalog; read-only visits remain app-level; accepted product-owned routes
  retain exact identity. Proceed directly to Task 6. Do not add a title join,
  generic Codex activation, or another identity probe.

### Task 6: Prove the local Tab gate and secret fail-closed behavior

> **UNBLOCKED:** Frozen read-path attempt `000003` passed `3/3`. Begin this task
> under the read-derived identity branch. No title-join or generic-activation
> fallback is authorized.

**Files:**

- Create: `hammerspoon/ComputerUseAutocomplete.spoon/bridge.lua`
- Create: `hammerspoon/ComputerUseAutocomplete.spoon/authority.lua`
- Create: `hammerspoon/ComputerUseAutocomplete.spoon/pill.lua`
- Create: `src/probes/tab-safety.mjs`
- Test: `test/bridge/authority-fixtures.test.mjs`
- Test: `test/probes/tab-safety.test.mjs`
- Create: `test/probes/privacy-armed.test.mjs`

- [ ] **Step 1: Write failing authority-state fixtures**

  Cover product Escape before generic key invalidation, valid Tab, no pill,
  hidden pill, active/recent typing, editable/sensitive/unknown focus, stale
  epoch/generation, expired immutable TTL, heartbeat loss, stale adapter lease,
  command gap, session change, privacy transition, active action, manual trigger
  suppression, pause/resume requiring a new generation/epoch/stabilization, and
  a lease refresh that cannot extend expiry.

- [ ] **Step 2: Run the tests and verify RED**

  ```bash
  node --test test/bridge/authority-fixtures.test.mjs \
    test/probes/tab-safety.test.mjs test/probes/privacy-armed.test.mjs
  ```

  Expected: missing fixture/probe implementation failures.

- [ ] **Step 3: Implement the non-activating pill and synchronous Lua gate**

  `authority.lua` receives the physical keydown before Node. It handles product
  Escape first, then accepts Tab only if every spec predicate is already true in
  local memory; otherwise it returns the key unchanged immediately. The canvas
  ignores mouse events, never activates, shows one locally rendered canonical
  promise, silently retains ranks two/three, and uses the first arm receipt to
  fix its five-second expiry. The stable Task 3 `init.lua` registry discovers
  and loads the three newly present modules; verify that Spoon start fails
  closed if any required module or source hash is missing. `bridge.lua` is the
  only reader of atomic Node commands and supplies
  heartbeat, session, sequence, epoch, generation, TTL, and adapter leases to
  authority state.

- [ ] **Step 4: Implement manual-trigger suppression in editable focus**

  `Control-Option-Space` snapshots local focus/privacy first. Editable,
  sensitive, or unknown focus emits only `manual_trigger_suppressed` with a
  coarse reason, increments no provider demand, and shows nothing. Allowed focus
  emits the normal manual opportunity event. `Control-Option-P` locally toggles
  pause, disarms, increments generation, and shows the persistent non-activating
  paused indicator. Resume increments generation again and emits
  `privacy_resumed`; Node advances to a new epoch and marks `resume_pending`.
  No suggestion can arm until a later 800 ms local quiet event is ingested,
  adapters are reread, and Node emits `state_stabilized` for that new epoch.

- [ ] **Step 5: Run the automated authority/privacy tests**

  ```bash
  node --test test/bridge/authority-fixtures.test.mjs \
    test/probes/tab-safety.test.mjs test/probes/privacy-armed.test.mjs
  ```

  Expected: exit `0`, including the resume gate and `init.lua` composition
  fixtures.

- [ ] **Step 6: Commit the clean authority source before physical evidence**

  ```bash
  git add hammerspoon src/probes test/bridge test/probes
  git commit -m "feat: enforce local Tab and privacy gates"
  ```

  Expected: clean status. Tab and armed-privacy manifests bind to this commit.

- [ ] **Step 7: Reload and prove the installed Spoon version before physical trials**

  ```bash
  open 'hammerspoon://computer-use-autocomplete-reload'
  node src/cli.mjs probe preflight --require-current-spoon
  ```

  Expected: a new `observer_started` event whose policy and source hashes equal
  the checked-out `codex/v0` files. Do not run the matrix against older loaded
  Lua. If reload fails, repair only the loader/reload path and rerun.

- [ ] **Step 8: Run the guided twenty-case physical Tab matrix**

  ```bash
  node src/cli.mjs probe tab-safety --guided
  ```

  Exercise the exact spec matrix across Codex, Arc, VS Code, and one native app,
  including coordinator crash/restart, heartbeat loss, stale file, new session,
  command gap, Arc URL changes, 749/751 ms typing quiet, and one valid acceptance.
  Expected: every unsafe Tab reaches the foreground app; the one valid armed Tab
  is consumed; the pill never activates or takes focus. Freeze all twenty cases
  and loaded hashes, then advance `probes/tab-safety/latest.json`. Any stolen
  unsafe Tab, focus-stealing pill, or armed state surviving bridge/coordinator
  loss is terminal: freeze the partial failed attempt immediately, run
  `node src/cli.mjs probe abort --probe tab-safety --from-latest` and stop after
  its verified cleanup.

- [ ] **Step 9: Repeat the armed-transition canaries against the loaded gate**

  ```bash
  node src/cli.mjs probe privacy --armed-transitions
  ```

  The full pre-cloud suite already passed in Task 3. This bounded repeat covers
  rapid Secure Input/role/pause transitions while a fake pill is armed and a
  synthetic authentication window behind an ordinary foreground window.
  Expected: local disarm precedes Tab. Before freezing, scan the entire private
  runtime root—not only expected artifact classes—for every unique in-memory
  canary. Freeze this as the distinct probe identity selected by
  `probes/privacy-armed/latest.json`. Any leak is terminal: run
  `node src/cli.mjs probe abort --probe privacy-armed --from-latest` and stop.

### Task 7: Freeze the phase-zero decision before runtime expansion

**Files:**

- Create: `src/probes/verify.mjs`
- Modify: `docs/phase-zero-decision.md`
- Test: `test/probes/verify.test.mjs`

- [ ] **Step 1: Write failing aggregate-gate tests**

  Reject missing/drifted probe manifests, fewer than required trials, wrong
  packet hashes, invalid provider authority, provider p50 above 2500 ms, capture
  p95 at/above 500 ms, any Codex identity/focus miss, any stolen Tab, any canary
  leak, or runtime-policy/version mismatch. The exact pass matrix is: capture
  10/10 plus p95 below 500 ms; at least one provider with authority/payload
  parity, 5/5 valid warm calls, and p50 at/below 2500 ms; all three Codex tasks
  read/focused/verified by ID; 20/20 Tab cases with exactly one intended consume;
  zero focus-stealing pill events; no armed state surviving bridge/coordinator
  loss;
  all three privacy probes leak-free; all artifact modes/hashes valid; and every
  probe's `source_commit` is an ancestor of final `HEAD` whose listed source
  files still match `source_inventory_sha256`.

- [ ] **Step 2: Implement and test the aggregate verifier**

  ```bash
  node --test test/probes/verify.test.mjs
  ```

  Expected: exit `0` with synthetic pass/fail fixtures.

- [ ] **Step 3: Commit the clean verifier before it creates aggregate evidence**

  ```bash
  git add src/probes/verify.mjs test/probes/verify.test.mjs
  git commit -m "test: add autocomplete V0 phase-zero verifier"
  ```

  Expected: clean status.

- [ ] **Step 4: Run the aggregate gate**

  ```bash
  node src/cli.mjs probe verify
  ```

  Outcomes are exact:

  - `PHASE_ZERO=PASS`: selected provider plus immutable phase-zero attempt hash;
  - `PHASE_ZERO=INVALID_EVIDENCE`: missing/drifted/mode/source/hash failure;
    repair or rerun only the affected probe, then rerun verification—do not
    create a product-blocker note; or
  - `PHASE_ZERO=BLOCKED`: a verified substantive stop condition that should
    already have aborted at its component probe. If encountered here, freeze the
    aggregate blocker, run
    `node src/cli.mjs probe abort --probe phase-zero --from-latest`, and stop.

  Only PASS permits Chunk 2.

- [ ] **Step 5: Write the public-safe decision note**

  Record pass/fail, provider/model/version, aggregate timing, exact blocker if
  any, Codex adapter result, Tab/privacy result, and the preregistered expectation
  that `open_url` coverage will be sparse. Include no task/window titles,
  screenshots, prompts containing work context, or raw transcripts.

- [ ] **Step 6: Run the full phase-zero suite**

  ```bash
  npm test
  ```

  Expected: exit `0`, all tests pass, and the decision note agrees with the
  immutable private manifest.

- [ ] **Step 7: Commit the passing decision note**

  ```bash
  git add docs/phase-zero-decision.md
  git commit -m "test: freeze autocomplete V0 phase-zero decision"
  ```

  Expected: clean status. Re-run `node src/cli.mjs probe verify --read-only` and
  require every component and aggregate `source_commit` to remain an ancestor
  of final `HEAD`, with every listed source inventory unchanged. Do not rerun
  model calls or controlled trials merely because this decision-note commit
  advanced `HEAD`.

## Chunk 2: Conditional product runtime and controlled sanity run

Do not begin this chunk unless `node src/cli.mjs probe verify --read-only`
returns exactly `PHASE_ZERO=PASS`. The phase-zero source files are frozen:
extend through new composition modules instead of changing files listed by any
probe source inventory. If a change to a probe-inventoried file is truly
required, rerun only every affected probe and aggregate verification before
continuing.

### Task 8: Add the six-table runtime ledger and five-axis state machine

**Files:**

- Create: `src/ledger/schema.sql`
- Create: `src/ledger/store.mjs`
- Create: `src/state/episode-machine.mjs`
- Test: `test/ledger/store.test.mjs`
- Test: `test/state/episode-machine.test.mjs`
- Create: `test/fixtures/ledger-events.jsonl`

- [ ] **Step 1: Reverify phase zero and write failing ledger/state tests**

  ```bash
  node src/cli.mjs probe verify --read-only
  ```

  Expected: `PHASE_ZERO=PASS`. Then test all six exact tables, WAL/foreign-key
  setup, monotonic `ingest_seq`, transaction rollback, duplicate-source
  idempotence, restart recovery, and every valid/invalid transition across the
  five orthogonal axes. Assert prediction/execution failure cannot overwrite
  feedback and accepted feedback survives execution failure.

  Every event/snapshot/packet/episode/candidate/action record must carry
  `schema_version`, monotonic and wall timestamps, origin, `context_epoch`, and
  every applicable episode/action/event ID. Episodes additionally store the
  complete runtime-policy snapshot/hash, provider/model/sampling config,
  prompt/schema hashes, observer/Spoon version+hash, Arc/Codex adapter
  version+hash, `first_post_trigger_human_event_id`, `next_human_event_id`, and
  nullable `destination_transition_id`/destination identity-set fields. Tests
  reject inserts that omit or mutate any applicable provenance field.

- [ ] **Step 2: Add permission tests for the database and both sidecars**

  Force WAL activity and assert the SQLite leaf plus `-wal` and `-shm` are
  regular non-symlink files at `0600` inside a `0700` directory. Reopening must
  revalidate and rechmod all present leaves before sensitive writes.

- [ ] **Step 3: Run the focused tests and verify RED**

  ```bash
  node --test test/ledger/store.test.mjs test/state/episode-machine.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement the schema and pure transition reducer**

  `schema.sql` contains only the six spec tables and required uniqueness/index
  constraints. `episode-machine.mjs` is a pure reducer whose inputs are current
  axes plus one ordered event; `store.mjs` validates through that reducer and
  transactionally appends event/state together. Put version/policy snapshots in
  canonical JSON columns plus indexed hash columns; keep both human-event refs
  and destination label nullable and independent. Raw transcripts are never
  authoritative.

- [ ] **Step 5: Implement deterministic restart and resync closure**

  On open, pending predictions become `cancel_requested` then `cancelled` or
  `timed_out`; accepted-but-undispatched work becomes
  `cancelled_before_dispatch`; displayed presentations become hidden/stale with
  feedback unchanged. A dispatched action may only receive its observed
  terminal result. Bridge resync uses the same reducer and cannot redisplay an
  old episode.

- [ ] **Step 6: Run tests and commit**

  ```bash
  node --test test/ledger/store.test.mjs test/state/episode-machine.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/ledger src/state/episode-machine.mjs test/ledger \
    test/state/episode-machine.test.mjs test/fixtures/ledger-events.jsonl
  git commit -m "feat: add autocomplete episode ledger"
  ```

### Task 9: Add context epochs, triggers, and causal destination transitions

**Files:**

- Create: `src/state/context-epoch.mjs`
- Create: `src/state/causality.mjs`
- Create: `src/state/opportunity-manager.mjs`
- Create: `src/runtime/adapter-refresh.mjs`
- Test: `test/state/context-epoch.test.mjs`
- Test: `test/state/causality.test.mjs`
- Test: `test/state/opportunity-manager.test.mjs`
- Test: `test/runtime/adapter-refresh.test.mjs`

- [ ] **Step 1: Write failing epoch and one-opportunity-per-state tests**

  Cover every meaningful state change, 750/400/800 ms timers, automatic
  non-editable requirement, manual trigger, editable manual suppression event,
  one automatic opportunity per epoch, optional Codex completion trigger,
  privacy resume pending, adapter disconnect/lease expiry, and no retrigger after
  dismiss/ignore/expiry/provider failure without new state.

- [ ] **Step 2: Write failing causal-origin and coalescing tests**

  Cover one-second human cause tokens, product action IDs, human/product races,
  unknown origin, 300 ms semantic quiet, one-second hard close, watcher-order
  permutations, complete contributing-event IDs, exact identity sets, and fixed
  display specificity without losing lower-granularity identities.

  Also test the bounded live adapter loop: Codex and Arc are read at most every
  200 ms only while an episode is predicting or displayed; every successful
  exact read creates a 350 ms lease; change/disconnect emits `invalidate`
  before publishing any replacement/read refresh; expired/unknown leases disarm
  locally; and `lease_refresh` can never change local generation or suggestion
  TTL. Leaving predicting/displayed state stops polling immediately.

- [ ] **Step 3: Run the tests and verify RED**

  ```bash
  node --test test/state/context-epoch.test.mjs \
    test/state/causality.test.mjs test/state/opportunity-manager.test.mjs \
    test/runtime/adapter-refresh.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement Node-owned epochs and opportunities**

  Consume the frozen phase-zero event ingress without modifying it. Node alone
  advances `context_epoch`; Hammerspoon `local_generation` remains a local
  safety counter. `state_stabilized` is emitted only after local quiet plus
  exact app/window/title/task/URL/role/privacy/display re-read. Optional missing
  Codex completion disables only that trigger.

- [ ] **Step 5: Implement pending feedback and destination coalescing**

  Non-Tab/Escape input while shown hides/stales immediately but leaves feedback
  pending on the cause token. Token close sets `override` only when its
  coalesced identity set contains a different supported destination; otherwise
  `ignored`. Store both trigger-relative and outcome-relative first-human event
  IDs independently from destination labels.

  Implement `adapter-refresh.mjs` as the only live task/URL lease owner. It
  composes the frozen phase-zero adapters without modifying them, polls only in
  `pending|returned+shown` lifecycle states, invalidates synchronously on the
  first change/disconnect/expiry, and only then records the new adapter value or
  refreshes a lease. The coordinator may arm or keep a pill only while every
  packet-recorded adapter dependency has a fresh 350 ms lease.

- [ ] **Step 6: Run tests and commit**

  ```bash
  node --test test/state/context-epoch.test.mjs \
    test/state/causality.test.mjs test/state/opportunity-manager.test.mjs \
    test/runtime/adapter-refresh.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/state src/runtime/adapter-refresh.mjs test/state \
    test/runtime/adapter-refresh.test.mjs
  git commit -m "feat: add causal opportunity state"
  ```

### Task 10: Build immutable live packets and frozen resolution catalogs

**Files:**

- Create: `src/context/catalog.mjs`
- Create: `src/context/packet-builder.mjs`
- Create: `src/context/screenshot-client.mjs`
- Test: `test/context/catalog.test.mjs`
- Test: `test/context/packet-builder.test.mjs`
- Test: `test/context/screenshot-client.test.mjs`

- [ ] **Step 1: Write failing packet-equivalence and privacy tests**

  Require the runtime packet to reproduce the phase-zero packet schema/hash
  contract; one allowed active-display PNG; current task/URL only when active;
  chronological 15-minute/100-event cap; exact adapter dependencies; and zero
  future labels. Privacy suppression creates only the coarse metadata episode
  and never asks Hammerspoon to capture.

- [ ] **Step 2: Write failing catalog and ablation tests**

  Canonically persist/hash app, window, Codex task, and allowed URL identities
  with `current_state|history_context` provenance. Full history validation uses
  the full frozen catalog; state-only derives only the current subset from that
  exact snapshot. Historical identities must never leak into the state-only
  packet or resolver.

- [ ] **Step 3: Run the focused tests and verify RED**

  ```bash
  node --test test/context/*.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement the packet transaction**

  Freeze epoch and adapter reads, run privacy/visible-window/raw-URL preflight,
  request one screenshot over the proven bridge, verify PNG/mode/hash, build
  current/history/feedback/request fields, freeze the local catalog, then commit
  packet/snapshot/catalog rows and immutable artifacts in one recoverable
  transaction. A changed epoch or expired lease at any point records stale and
  sends no provider request.

- [ ] **Step 5: Implement the deterministic state-only derivative**

  Retain only `current_state` and `request_meta`; remove history, feedback,
  historical target refs, and summaries. Store original/derivative body hashes
  plus the same screenshot hash. Evaluator-only identity data remains outside
  both provider-visible bodies.

- [ ] **Step 6: Run tests and commit**

  ```bash
  node --test test/context/*.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/context test/context
  git commit -m "feat: build immutable autocomplete packets"
  ```

### Task 11: Add live proposal coordination, validation, and local promise rendering

**Files:**

- Create: `src/providers/runner.mjs`
- Create: `src/providers/promise-renderer.mjs`
- Create: `src/coordinator.mjs`
- Test: `test/providers/runner.test.mjs`
- Test: `test/providers/promise-renderer.test.mjs`
- Test: `test/coordinator.test.mjs`

- [ ] **Step 1: Write failing selected-provider and cancellation tests**

  The runner must load only the phase-zero-selected provider/config/hash, reject
  drift, allow one live request per epoch, cancel on any invalidation, enforce
  the five-second monotonic deadline, terminate an uncooperative process, and
  store late output without reopening terminal state.

- [ ] **Step 2: Write failing candidate/promise tests**

  Cover exact-three/abstain, frozen-catalog resolution, state-dependent
  executability, unsafe URL rejection, one/two-candidate invalidity, highest
  ranked valid+executable selection, all-invalid silence, local canonical names,
  bidi/control stripping, whitespace collapse, 120-character cap, and proof
  that `model_target_label` never enters command/display state.

- [ ] **Step 3: Run tests and verify RED**

  ```bash
  node --test test/providers/runner.test.mjs \
    test/providers/promise-renderer.test.mjs test/coordinator.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement live orchestration through atomic commands**

  On an opportunity, persist episode/packet/request before launch. Normalize and
  validate all returned candidates, persist all ranks, choose one eligible
  action, and write one arm command with fixed suggestion ID/TTL, exact epoch,
  generation, and adapter leases. Provider abstain/invalid/failure/stale logs a
  complete episode and displays nothing.

- [ ] **Step 5: Implement race and bridge failure handling**

  Lower authoritative `ingest_seq` wins. Acceptance/dismissal precede same-event
  invalidation; pending override token precedes TTL; bridge gap/resync closes the
  episode exactly as the reducer specifies. Heartbeat/lease updates never extend
  the fixed local TTL.

- [ ] **Step 6: Run tests and commit**

  ```bash
  node --test test/providers/runner.test.mjs \
    test/providers/promise-renderer.test.mjs test/coordinator.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/providers/runner.mjs src/providers/promise-renderer.mjs \
    src/coordinator.mjs test/providers test/coordinator.test.mjs
  git commit -m "feat: coordinate proactive navigation proposals"
  ```

### Task 12: Add three deterministic executors and exact endpoint verification

> **Scope correction:** V0 executes only `activate_app`, `focus_window`, and
> `focus_codex_task`. Keep Arc URL reads for privacy; do not build `open_url`
> dispatch, validation, endpoint verification, or reporting.

**Files:**

- Create: `hammerspoon/ComputerUseAutocomplete.spoon/executor.lua`
- Create: `src/execution/arc-url.mjs`
- Create: `src/execution/dispatcher.mjs`
- Create: `src/execution/verify.mjs`
- Test: `test/execution/arc-url.test.mjs`
- Test: `test/execution/dispatcher.test.mjs`
- Test: `test/execution/verify.test.mjs`

- [ ] **Step 1: Write failing allowlist, precondition, and dispatch tests**

  Reject a fifth primitive, multi-step arrays, disappeared targets, stale
  epoch/generation, expired leases, dispatch before accepted feedback, duplicate
  dispatch, and any authored/consequential action. Assert one action ID and one
  primitive maximum per acceptance. Every `action_dispatched` must include the
  canonical expected endpoint identity set and the Hammerspoon source-sequence
  floor captured immediately before dispatch.

- [ ] **Step 2: Write failing exact endpoint tests**

  Require frontmost bundle for app, bundle+window ID for window, re-read thread
  ID for Codex, and exact normalized allowed URL for Arc. Distinguish
  `precondition_failed`, `dispatched`, `verified_exact`, `observed_partial`, and
  `failed`. Escape can cancel only before dispatch; no retry/recovery runs.

- [ ] **Step 3: Run the focused tests and verify RED**

  ```bash
  node --test test/execution/*.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement app/window dispatch in the new Lua executor**

  The stable `init.lua` registry loads the new module without modification.
  Hammerspoon emits `action_dispatched` before native app/window dispatch,
  including action ID, expected endpoint, and source-sequence floor; marks that
  action in flight; and tags matching observed transitions until
  verification/deadline. Arc remains read-only and privacy-only in V0.

- [ ] **Step 5: Implement Codex routing and one central dispatcher**

  Node routes `focus_codex_task` through the frozen proven adapter; all other
  primitives go through one Hammerspoon command. Revalidate epoch, generation,
  target presence, and leases immediately before one dispatch. Verification
  writes execution state without altering accepted feedback. Pass the same
  `actionId` and `sourceSeqFloor` into the frozen Codex adapter so task-change
  events emitted during focus carry product origin directly; events outside
  that in-flight call cannot inherit its action ID.

- [ ] **Step 6: Run tests and commit**

  ```bash
  node --test test/execution/*.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add hammerspoon/ComputerUseAutocomplete.spoon/executor.lua \
    src/execution test/execution
  git commit -m "feat: execute four reversible navigation primitives"
  ```

### Task 13: Wire start/stop/status and complete the controlled sanity run

> **Scope correction:** Keep runtime lifecycle tests and the guided executor
> trials. Delete the nested component/final sanity manifests, `active.json`,
> sanity evidence/abort modules, and immutable final-run choreography. Record
> focused/full test results and guided-trial outcomes in
> `docs/controlled-sanity.md`, then tag the clean commit.

**Files:**

- Create: `src/commands/run.mjs`
- Create: `src/commands/status.mjs`
- Create: `src/commands/stop.mjs`
- Create: `src/runtime/health.mjs`
- Create: `src/sanity/scenario-provider.mjs`
- Create: `src/sanity/executor-trials.mjs`
- Create: `src/sanity/evidence.mjs`
- Create: `src/sanity/abort.mjs`
- Create: `docs/controlled-sanity.md`
- Test: `test/commands/run.test.mjs`
- Test: `test/commands/status.test.mjs`
- Test: `test/commands/stop.test.mjs`
- Test: `test/runtime/health.test.mjs`
- Test: `test/sanity/scenario-provider.test.mjs`
- Test: `test/sanity/executor-trials.test.mjs`
- Test: `test/sanity/evidence.test.mjs`
- Test: `test/sanity/abort.test.mjs`
- Test: `test/integration/opportunity-flow.test.mjs`

- [ ] **Step 1: Write failing process/health/end-to-end tests**

  Use fake Hammerspoon/provider/adapters to cover start lock, heartbeat, status,
  graceful stop, crash recovery, stale command cleanup, privacy suppression,
  returned, abstained, malformed, stale, dismissed, ignored, override,
  accepted-success, and accepted-failure episodes. Assert each ends with one
  internally valid five-axis row and complete stage timing.

  Freeze the operator contract: ordinary natural-work `run` requires the
  approved release tag and a clean tree. Before that it exits `trial_locked`;
  guided sanity may run explicitly against the clean candidate.
  After unlock, `run --background --wait-ready-ms 5000` returns one JSON object
  containing `ready`, PID, bridge session, source commit, and policy hash, or
  exits nonzero after cleanup. `status
  --expect-ready` exits nonzero unless that exact committed runtime is healthy.
  `stop --wait-ms 5000` exits only after unarmed state is written, pending
  undispatched work is terminal, SQLite is closed, and the process lock is
  gone. Tests prohibit a second runtime and reject the sanity-only provider in
  ordinary `run` mode.

- [ ] **Step 2: Write failing deterministic-sanity and evidence tests**

  The scenario provider is callable only by `sanity run`; it must enter through
  the production packet schema, provider-result validator, coordinator,
  presentation lifecycle, Tab authority, dispatcher, and ledger. It may choose
  fixture outcomes but may not bypass those modules. Test deterministic
  scenarios for `returned`, `abstained`, `malformed`, `stale`, `dismissed`,
  `ignored`, `override`, `accepted-success`, `accepted-failure`, and
  privacy-suppressed. The ordinary runtime must reject its provider ID.

  Test an exact executor-trial matrix for all four primitives and these races:
  exact dispatch/verification; a physical human event interleaved before
  acceptance; a context change after acceptance but before dispatch (zero
  actions); and a context change after dispatch (no retry or recovery, only the
  first action's terminal verification). Assert exact episode/action IDs,
  origins, expected identity sets, and source-sequence floors throughout.

  Component and final sanity evidence are private and immutable:

  ```text
  sanity/components/<suite>/attempts/<six-digit-ordinal>/manifest.json
  sanity/components/<suite>/attempts/<six-digit-ordinal>/manifest.sha256
  sanity/components/<suite>/latest.json
  sanity/attempts/<six-digit-ordinal>/manifest.json
  sanity/attempts/<six-digit-ordinal>/manifest.sha256
  sanity/attempts/<six-digit-ordinal>/artifacts/...
  sanity/active.json
  sanity/latest.json
  ```

  Each suite freezes a component manifest. A distinct final attempt starts
  before the real-provider run, binds those component hashes, remains at
  `active.json`, and freezes only after stop plus SQLite integrity. Its manifest
  uses the phase-zero inventory rules and additionally binds runtime source
  commit, aggregate phase-zero manifest hash, runtime-policy hash, source
  inventory/hash, an exact `action_runtime_inventory`/hash covering every
  behavior-bearing file through Task 13, component manifests,
  controlled-opportunity episode IDs, and final SQLite integrity. Later
  evaluation/report command files may be added outside that closed inventory;
  read-only verification requires every inventoried action-runtime file to
  remain byte-identical and rejects its modification/deletion, while permitting
  additive files whose complete inventory is separately bound by Task 16.
  Aborted final attempts remain immutable and advance
  `latest.json`; no rerun may overwrite them.

  Before any component or final manifest freezes, the runtime must unarm, stop,
  close SQLite, and inventory only quiescent artifacts. A passing component
  freezes and clears its active pointer. A fatal component result freezes and
  returns its exact attempt ID/hash plus `requires_abort=true`; tests prove the
  later abort names that ID directly rather than consulting `latest.json`.
  Compatibility tests add an evaluation-only file and require the frozen
  action-runtime subset to remain valid, then modify/delete a frozen runtime
  file and require failure. Release-mode verification additionally requires
  Task 16's complete-inventory unlock hash.

- [ ] **Step 3: Run the focused tests and verify RED**

  ```bash
  node --test test/commands/*.test.mjs test/runtime/health.test.mjs \
    test/sanity/*.test.mjs test/integration/opportunity-flow.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement convention-based CLI commands without changing `src/cli.mjs`**

  `cli.mjs` discovers exact command modules by filename. `run` takes the
  exclusive process lock, verifies phase zero and loaded Spoon hashes, opens the
  ledger, rotates bridge session, and starts coordination. `status` is read-only.
  `stop` cancels undispatched work, writes unarmed state, closes ledger, and
  leaves Hammerspoon loaded but inactive.

  Ordinary `run` also verifies `config/trial-unlock.json` with exact fields
  `{schema_version,enabled,runtime_source_commit,runtime_inventory_sha256,
  evaluation_inventory_sha256,policy_sha256,protocol_sha256,
  phase_zero_manifest_sha256,sanity_manifest_sha256}` and rejects absence,
  unknown fields, false, dirty/drifted inventoried files, mismatched prerequisite
  manifests, or non-ancestor commits. The runtime inventory covers every tracked
  `src/`, `hammerspoon/`, runtime `config/`, package manifest/lockfile, and
  evaluation protocol file except the self-referential unlock artifact itself.
  `sanity run` bypasses only this
  artifact check and only when bound to the exact active component/final sanity
  attempt; it cannot write a natural-work cohort.

- [ ] **Step 5: Implement deterministic sanity mode and immutable evidence**

  Give `sanity run` its own private runtime session/root and an explicit
  scenario-provider capability unavailable to normal `run`. Scenario fixtures
  select responses and operator instructions only; their packets, outputs,
  UI events, feedback, actions, and verification still travel through the
  production paths. Quiesce and freeze each attempt before producing a decision.

  Implement `sanity abort --active` for an in-progress final attempt and
  `sanity abort --attempt <exact-id>` for the just-frozen fatal component
  returned by `sanity run`. Either form is one atomic operator action: it
  freezes the partial failed attempt, writes unarmed state, stops Node, closes
  SQLite, writes only public-safe blocker facts to
  `docs/controlled-sanity.md`, stages and commits only that document as
  `test: record autocomplete V0 sanity blocker`, restores/uninstalls the
  Hammerspoon loader, verifies restoration, and exits `2`. It never resolves a
  target through a previous passing `latest.json`; an active partial is frozen
  during abort, while an exact frozen component ID is hash-verified. Cleanup is
  in a guaranteed finalizer; private evidence is never staged.

- [ ] **Step 6: Implement health output and private diagnostics**

  Health reports observer/bridge/adapter/provider freshness, privacy pause,
  active epoch/episode, last terminal outcome, and exact blocker codes without
  packet text, titles, raw URLs, or screenshots. No telemetry leaves the Mac.

- [ ] **Step 7: Run tests separately and commit the complete runtime**

  ```bash
  node --test test/commands/*.test.mjs test/runtime/health.test.mjs \
    test/sanity/*.test.mjs test/integration/opportunity-flow.test.mjs
  ```

  Expected: exit `0`. Only then run:

  ```bash
  npm test
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/commands src/runtime/health.mjs src/sanity \
    docs/controlled-sanity.md test
  git commit -m "feat: complete autocomplete V0 runtime"
  ```

- [ ] **Step 8: Reload the exact commit and fail fast through preflight**

  ```bash
  open 'hammerspoon://computer-use-autocomplete-reload'
  ```

  Confirm the reload reports the exact current commit and exits successfully.
  Only then run:

  ```bash
  node src/cli.mjs probe preflight --require-current-spoon
  ```

  Expected: exit `0`. Do not start a runtime after any preflight error.

- [ ] **Step 9: Run deterministic scenarios and the guided physical executor matrix**

  ```bash
  node src/cli.mjs sanity run --suite deterministic --wait-ready-ms 5000
  ```

  Expected: one frozen passing scenario result. Only then run:

  ```bash
  node src/cli.mjs sanity run --suite executor-trials --guided \
    --wait-ready-ms 5000
  ```

  Exercise every primitive against harmless prepared endpoints, including the
  physical interleavings and context races from Step 2. `open_url` gets one
  safe query/fragment-free test URL; sparse natural coverage remains expected.
  Expected: one frozen passing executor result with exact verification for all
  four primitives and no second dispatch.

- [ ] **Step 10: Run five to ten real-provider controlled opportunities**

  ```bash
  node src/cli.mjs sanity begin-final --require-components latest
  ```

  Expected: one active final-attempt ID bound to both passing component
  manifests. Only then:

  ```bash
  node src/cli.mjs sanity run --suite real-provider --background \
    --attempt active --wait-ready-ms 5000
  ```

  Expected: `ready:true` with PID/session/source commit/policy hash. Only then:

  ```bash
  node src/cli.mjs status --expect-ready
  ```

  Exercise five to ten harmless opportunities with the selected real provider;
  this is an integration sample, not the mechanism for manufacturing every
  lifecycle outcome. Confirm the pill never focuses, promise/action agree, top
  three persist silently, only one primitive dispatches, endpoints verify
  exactly, and metadata-only suppressed episodes contain no sensitive payload.
  Record public-safe counts/outcomes in `docs/controlled-sanity.md`; keep raw
  rows private.

- [ ] **Step 11: Stop and verify each gate separately**

  ```bash
  node src/cli.mjs stop --wait-ms 5000
  ```

  Expected: clean stop. Only then run:

  ```bash
  npm test
  ```

  Expected: exit `0`. Only then run:

  ```bash
  node src/cli.mjs probe verify --read-only
  ```

  Expected: `PHASE_ZERO=PASS`. Only then freeze the still-active final attempt;
  finalization reruns SQLite integrity and binds its result:

  ```bash
  node src/cli.mjs sanity finalize --attempt active
  ```

  Expected: one immutable final manifest and no `active.json`. Only then run the
  read-only sanity verifier and require all source inventories,
  scenario/executor component evidence, controlled episode IDs, artifact
  modes/hashes, and SQLite integrity to pass:

  ```bash
  node src/cli.mjs sanity verify --read-only
  ```

  Expected: `SANITY=PASS`.

- [ ] **Step 12: Apply the falsifier policy and commit the sanity decision**

  A stolen Tab, focus-stealing pill, armed state surviving bridge loss, secret
  leak, or provider-authority violation is a terminal phase-zero regression:
  for an in-progress final run, immediately run `node src/cli.mjs sanity abort
  --active`; for a completed component, use `node src/cli.mjs sanity abort
  --attempt <returned-attempt-id>`. Stop this plan. A non-safety functional
  failure preserves its failed private episode;
  fix only the named V0 module, rerun affected automated and controlled cases,
  and never delete the failed attempt.

  After `SANITY=PASS`:

  ```bash
  git add docs/controlled-sanity.md
  git commit -m "test: verify autocomplete V0 controlled sanity"
  ```

  Chunk 2 deliberately stops before the habit trial. Chunk 3 must add label
  resolution, immutable offline ablations, accepted-endorsed replay, reporting,
  and the five-day protocol before `run` may be used for natural-work data.

## Chunk 3: Frozen evaluation and the personal habit trial

Do not begin this chunk unless both `PHASE_ZERO=PASS` and `SANITY=PASS` verify
read-only against the exact runtime source commit. Do not begin natural-work
collection until Tasks 14–16 are committed. Evaluation code may read private
runtime artifacts but must never copy them into Git.

### Task 14: Resolve independent next-human and accepted-endorsed labels

**Files:**

- Create: `src/evaluation/labels.mjs`
- Create: `src/evaluation/identity.mjs`
- Test: `test/evaluation/labels.test.mjs`
- Test: `test/evaluation/identity.test.mjs`
- Create: `test/fixtures/evaluation-episodes.jsonl`

- [ ] **Step 1: Write failing anchor, horizon, and exclusion tests**

  For non-accepted episodes, anchor at trigger when never shown and at
  `suggestion_shown` when shown. Select the first coalesced human-origin
  supported `destination_transition` after the anchor and within 30 seconds of
  trigger. Test shown/unshown episodes, first physical input that is not a
  destination, exact 30-second boundary, no destination, privacy suppression,
  ambiguous/unknown/system/product origin, unsupported destination, and an
  accepted episode. Accepted episodes must always be excluded from independent
  next-human exact accuracy.

- [ ] **Step 2: Write failing identity and accepted-endorsement tests**

  Preserve the complete transition identity set and require primitive-specific
  comparison: app for `activate_app`, app+window for `focus_window`, thread for
  `focus_codex_task`, and normalized URL for `open_url`. Never award a
  lower-granularity app hit to a task/window/URL candidate. For an accepted
  episode, define the separate endorsement label as the exact accepted
  primitive plus accepted canonical identity set frozen before dispatch—not
  the product-caused destination observed afterward. Missing/invalid accepted
  identity makes that episode unscorable for endorsement rather than guessing.

- [ ] **Step 3: Run focused tests and verify RED**

  ```bash
  node --test test/evaluation/labels.test.mjs \
    test/evaluation/identity.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement pure, read-only label resolution**

  The resolver consumes a frozen episode/event/action export and returns a new
  evaluation record; it never mutates the live ledger. Store explicit nullable
  fields and stable unscorable reasons. Keep `first_post_trigger_human_event_id`
  and `next_human_event_id` as evidence references, never substitutes for the
  destination transition. Output both possible label families with disjoint
  eligibility flags: `next_human_exact` for non-accepted episodes and
  `accepted_endorsed` for accepted episodes.

- [ ] **Step 5: Run tests and commit**

  ```bash
  node --test test/evaluation/labels.test.mjs \
    test/evaluation/identity.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/evaluation/labels.mjs src/evaluation/identity.mjs \
    test/evaluation test/fixtures/evaluation-episodes.jsonl
  git commit -m "feat: resolve autocomplete evaluation labels"
  ```

### Task 15: Freeze blind paired replay before attaching labels

**Files:**

- Create: `src/evaluation/replay.mjs`
- Create: `src/evaluation/replay-evidence.mjs`
- Create: `src/commands/replay.mjs`
- Test: `test/evaluation/replay.test.mjs`
- Test: `test/evaluation/replay-evidence.test.mjs`
- Test: `test/commands/replay.test.mjs`

- [ ] **Step 1: Write failing ablation, authority, and drift tests**

  From one immutable packet/catalog/screenshot, generate exactly two conditions:
  original state-plus-history and deterministic state-only. Assert byte-stable
  bodies/hashes, the same screenshot hash, total removal of history/feedback/
  historical target references from state-only, and a resolver catalog limited
  to current-state identities for state-only. Future destination and accepted
  identity must be unavailable to packet construction, provider invocation,
  validation, and prediction persistence.

  Pin the selected phase-zero provider, model, sampling, prompt, schema, policy,
  adapter, and source hashes. Drift must stop the batch before calls; it may not
  silently reinterpret the comparison. Provider tool use remains forbidden.

- [ ] **Step 2: Write failing resumability and freeze-order tests**

  A replay batch has an immutable manifest, deterministic episode/condition
  schedule, per-attempt files, and an append-only completion index. Interrupt
  during a call, rerun, and prove every completed terminal attempt is
  hash-verified and skipped. Model invalidity, abstain, timeout, transport error,
  and provider failure are immutable terminal condition outcomes and are never
  retried. Only an attempt lacking a terminal marker because the local replay
  process was interrupted may resume, using a new ordinal while preserving the
  partial attempt. The first later terminal ordinal supplies that condition's
  outcome; no ordinal after a terminal outcome is permitted. Freeze
  both conditions' normalized predictions, candidates, validation results,
  timing, abstain/failure state, and artifact hashes before a distinct
  `labels attach` command can read labels. Reject label attachment if any
  scheduled prediction is still mutable or absent.

- [ ] **Step 3: Run focused tests and verify RED**

  ```bash
  node --test test/evaluation/replay*.test.mjs test/commands/replay.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 4: Implement immutable private replay evidence**

  Store under the private runtime root:

  ```text
  evaluation/replays/<batch-id>/manifest.json
  evaluation/replays/<batch-id>/manifest.sha256
  evaluation/replays/<batch-id>/attempts/<episode-id>/<condition>/...
  evaluation/replays/<batch-id>/predictions-frozen.json
  evaluation/replays/<batch-id>/predictions-frozen.sha256
  evaluation/replays/<batch-id>/labels-attached.json
  ```

  The batch manifest binds the ledger snapshot/hash, eligible episode IDs,
  packet/catalog/screenshot hashes, both condition hashes, exact schedule,
  provider configuration, source inventory/hash, and prerequisite phase-zero
  and sanity manifest hashes. Raw provider output stays private. Atomic
  sidecars and `0600`/`0700` rules match earlier evidence contracts.

- [ ] **Step 5: Implement commands and blind ordering**

  `replay prepare` freezes the eligible schedule without labels. `replay run
  --resume` performs both conditions in deterministic episode order and freezes
  predictions. Only afterward may `replay attach-labels` call Task 14's pure
  resolver against the frozen ledger snapshot. Accepted episodes enter only the
  accepted-endorsed stratum; non-accepted scorable episodes enter only the
  next-human stratum. Every terminal infrastructure failure and model abstention
  remains the selected condition outcome in the batch and denominator tables
  rather than disappearing or being retried away.

- [ ] **Step 6: Run tests and commit**

  ```bash
  node --test test/evaluation/replay*.test.mjs test/commands/replay.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/evaluation/replay.mjs src/evaluation/replay-evidence.mjs \
    src/commands/replay.mjs test/evaluation test/commands/replay.test.mjs
  git commit -m "feat: add blind paired autocomplete replay"
  ```

### Task 16: Freeze the diagnostic report and habit-trial protocol

> **Scope correction:** Keep the private diagnostic report and human protocol.
> Delete `trial-unlock.mjs`, `config/trial-unlock.json`, release-inventory
> verification, disabled-period proof machinery, and the public-summary
> renderer. Unlock natural work with one check for the approved Git tag plus a
> clean tree. Build a public renderer only after results justify publication.

**Files:**

- Create: `src/evaluation/report.mjs`
- Create: `src/commands/report.mjs`
- Create: `docs/habit-trial-protocol.md`
- Create: `docs/evaluation-schema.md`
- Test: `test/evaluation/report.test.mjs`
- Test: `test/commands/report.test.mjs`

- [ ] **Step 1: Write failing denominator and metric tests**

  Require exact counts before rates. For next-human outcomes, report paired
  state-plus-history and state-only top-one/top-three exact matches overall and
  separately by primitive/granularity, plus paired win/loss/tie counts and the
  raw rate difference. Keep null labels, unsupported targets, provider invalid,
  timeout/failure, and abstain in separate explicit tables. Do not recode an
  abstention or infrastructure failure as a wrong semantic guess without also
  exposing its class.

  Freeze two denominators per label family and rank: **end-to-end exact yield**
  is exact hits divided by all label-eligible episodes, with every terminal
  abstain/invalid/timeout/failure counted as no hit; **conditional exact
  accuracy** is exact hits divided only by schema-valid, non-abstaining returned
  predictions. End-to-end paired win/loss/tie uses every episode with terminal
  outcomes in both conditions, scoring exact=1 and every other terminal class=0.
  A second conditional paired table includes only episodes where both conditions
  returned schema-valid non-abstaining predictions. A missing terminal outcome
  makes the batch incomplete rather than changing a denominator. Apply these
  exact rules independently to `next_human_exact` and `accepted_endorsed`.

  Primitive tables are fixed and may overlap. A next-human episode enters kind
  `K` when its coalesced label set contains a `K` identity; an accepted-endorsed
  episode enters only its accepted primitive kind. Top one/top three for `K`
  examine only returned candidates of kind `K` and require an exact same-kind
  identity match; no `K` candidate is a miss in end-to-end and otherwise-eligible
  conditional tables. A mixed-kind top-three list can therefore hit multiple
  overlapping next-human kind tables, while overall top-three is one hit if any
  candidate exactly matches its own kind. Reports state that primitive counts
  are non-additive.

  For accepted episodes, report state-plus-history and state-only top-one/
  top-three matches against the accepted primitive/identity as a separate
  `accepted_endorsed` table. Its heading and machine-readable schema must say
  `descriptive_selection_biased=true`; it cannot enter next-human accuracy or a
  causal history-lift estimate.

- [ ] **Step 2: Write failing product, latency, and sparse-URL tests**

  Report trigger/opportunity/suppression/packet/call/display counts; proposal
  validity and p50/p95; displayed feedback outcomes; verified execution rate;
  stale/cancel/failure reasons; primitive distribution; and daily exposure.
  `open_url` gets a preregistered standalone funnel from opportunity through
  acceptance, with the note that query/fragment privacy rules exclude Gmail
  and many revisit targets. Near-zero URL use must not decrement general model
  validity or be narrated as predictor failure.

  Define a URL opportunity only when the frozen packet catalog contains at
  least one policy-valid, exact, currently executable safe URL. Editable- or
  sensitive-focus manual-trigger suppressions belong only in suppression counts,
  never any primitive opportunity or accuracy denominator.

  Report exploratory accuracy by chronological-history amount only when each
  bin has a disclosed denominator. It is descriptive; no monotonic or causal
  history claim follows from a small personal sample.

- [ ] **Step 3: Write the human protocol before natural use**

  The committed protocol specifies five normal workdays, roughly 50 displayed
  suggestions as exposure guidance rather than quota, no threshold tuning to
  manufacture displays, manual privacy pause, how Dylan records a genuine
  safety/problem note, and one subsequent half-day with the runtime fully
  disabled. The primary habit read is Dylan reaching for Tab while suggestions
  are useful and noticing/reaching for it during the disabled half-day. The
  disabled period collects only Dylan's explicit end-of-period note; it does
  not install a hidden keylogger or observer.

  A normal workday is at least four hours of ordinary, non-test Mac work while
  the exact release runtime is healthy and not privacy-paused. Runtime downtime,
  provider/adapter outage, and privacy pause do not count; a shorter day is
  excluded and the calendar window extends until five qualifying days exist.
  An exact-build restart is allowed only after read-only ledger and inventory
  verification and records its downtime in the same cohort. Any safety stop,
  source/config drift, canary leak, unrecoverable ledger corruption, or inability
  to restore the exact build terminates the cohort. Other process/provider
  failures may recover or restart and extend the clock, but remain reported.
  The disabled half-day is at least four continuous wall-clock hours of ordinary
  work (sleep does not count), with exact start/end wall and monotonic bounds
  plus Dylan's work-period attestation stored privately.

- [ ] **Step 4: Run tests and verify RED**

  ```bash
  node --test test/evaluation/report.test.mjs test/commands/report.test.mjs \
    test/commands/trial-unlock.test.mjs test/commands/trial-disable.test.mjs
  ```

  Expected: module-not-found failures.

- [ ] **Step 5: Implement private and public-safe report renderers**

  `report build` reads only a hash-verified frozen replay with attached labels
  and produces a private JSON/Markdown report containing exact episode-level
  outcomes. `report public-summary` emits only aggregate public-safe counts,
  metrics, uncertainty, infrastructure failures, and the explicit limitations;
  it constructs output from a fixed field whitelist rather than redacting a
  private report, and fails closed on any extra field. Private titles, URLs,
  task IDs, screenshot paths, packet bodies, raw transcripts, free-form safety
  notes, and the free-form disabled-half-day note are never inputs to the public
  renderer. Public habit fields are exactly `noticed_absence` and
  `reached_for_tab`, each `yes|no|unsure`; any prose requires Dylan's explicit
  approval outside the automatic renderer. Reports name source, replay, label,
  and policy hashes.

  `trial-unlock create --source-commit <commit>` verifies and binds the exact
  phase-zero and final-sanity manifest hashes; inventories the complete committed
  runtime/source/config/package/protocol set defined in Task 13, excluding only
  the unlock artifact; records the evaluation subset hash separately; and emits
  only Task 13's frozen nine-field artifact. It rejects a dirty tree,
  non-ancestor commit, missing runtime/evaluation file, or mismatched
  source/policy/protocol/prerequisite hash. It also requires the final-sanity
  `action_runtime_inventory_sha256` to be an exact subset match of the release
  inventory. Ordinary `run` recomputes the entire release inventory, the frozen
  action-runtime subset, and both prerequisite hashes, so a descendant commit
  cannot make drift acceptable while additive evaluation files do not falsely
  invalidate the earlier controlled action-runtime evidence.

  `trial-disable begin` atomically disarms the pill, disables the Spoon observer,
  stops Node, closes SQLite, and returns an immutable snapshot ID binding start
  clocks and bridge/JSONL paths plus sizes/hashes.
  `trial-disable verify --quiet-ms 2000` requires no Node/process lock/heartbeat,
  Spoon state exactly inactive+unarmed, and no observer/bridge/JSONL change over
  the interval. Both commands fail closed without rewriting telemetry.

- [ ] **Step 6: Run tests and commit the frozen evaluation contract**

  ```bash
  node --test test/evaluation/report.test.mjs test/commands/report.test.mjs \
    test/commands/trial-unlock.test.mjs test/commands/trial-disable.test.mjs
  ```

  Expected: exit `0`. Then:

  ```bash
  git add src/evaluation/report.mjs src/commands/report.mjs \
    src/commands/trial-unlock.mjs src/commands/trial-disable.mjs \
    docs/habit-trial-protocol.md docs/evaluation-schema.md \
    test/evaluation/report.test.mjs test/commands/report.test.mjs \
    test/commands/trial-unlock.test.mjs test/commands/trial-disable.test.mjs
  git commit -m "feat: freeze autocomplete V0 evaluation"
  ```

- [ ] **Step 7: Generate and commit the trial-unlock artifact**

  With a clean tree, run:

  ```bash
  node src/cli.mjs trial-unlock create --source-commit HEAD
  ```

  Verify its complete committed source inventory and nine exact fields, then:

  ```bash
  git add config/trial-unlock.json
  git commit -m "chore: unlock autocomplete V0 habit trial"
  ```

  Ordinary `run` must now pass the artifact gate; deleting or modifying any
  inventoried evaluation/protocol file must return it to `trial_locked`.

### Task 17: Enable natural use, then close the five-day read

> **Scope correction:** Replace sanity/release-inventory verification with
> `npm test`, the approved Git tag, and a clean tree. For the disabled half-day,
> stop the runtime, confirm it is off, work normally, and write the explicit
> habit note; do not build begin/end snapshot proofs. Produce only the private
> report unless a later publication decision authorizes a public artifact.

**Files:**

- Modify: `README.md`
- Create: `docs/habit-trial-results.md`

- [ ] **Step 1: Verify the exact release candidate before enabling it**

  Run separately and stop on the first failure:

  ```bash
  npm test
  ```

  ```bash
  node src/cli.mjs probe verify --read-only
  ```

  ```bash
  git describe --tags --exact-match HEAD
  ```

  ```bash
  git status --porcelain
  ```

  Expected: tests pass, the approved release tag identifies `HEAD`, and status
  is clean.
  Tag the exact commit locally as `v0-habit-trial-rc1`; any source/config change
  during the trial ends that cohort and requires a new verified release tag.

- [ ] **Step 2: Start the background runtime and verify readiness**

  ```bash
  node src/cli.mjs run --background --wait-ready-ms 5000
  ```

  Expected: `ready:true`. Only then:

  ```bash
  node src/cli.mjs status --expect-ready
  ```

  Use the system naturally for five normal workdays. Daily checks are read-only
  `status --expect-ready` plus private ledger integrity; do not inspect or tune
  predictions mid-cohort. Pause for real privacy/safety concerns and preserve
  all completed episodes. `open_url` may remain mostly absent by design.

- [ ] **Step 3: Stop cleanly and freeze the observation cohort**

  ```bash
  node src/cli.mjs stop --wait-ms 5000
  ```

  Then freeze a read-only cohort manifest containing exact runtime tag/commit,
  policy/provider hashes, wall/monotonic bounds, ledger snapshot/hash, episode
  IDs, and integrity result. Do not edit or relabel the live database.

- [ ] **Step 4: Turn the runtime off, work a disabled half-day, and write the habit note**

  ```bash
  node src/cli.mjs stop --wait-ms 5000
  ```

  Confirm `status` reports stopped. Dylan then uses the Mac normally for at
  least four continuous hours
  and records whether he noticed the absence or reflexively reached for Tab,
  plus brief context. Store the raw note only in private cohort evidence; the
  public renderer may use only the two fixed structured fields. No background
  input logging runs during this period.

  At the end, write the explicit habit note. No hidden observer or snapshot
  proof runs during the disabled period.

- [ ] **Step 5: Run resumable blind replay and attach labels**

  Execute one command at a time, verifying the reported manifest hash before
  proceeding:

  ```bash
  node src/cli.mjs replay prepare --cohort latest-frozen
  ```

  ```bash
  node src/cli.mjs replay run --resume
  ```

  ```bash
  node src/cli.mjs replay verify-predictions --read-only
  ```

  ```bash
  node src/cli.mjs replay attach-labels
  ```

  No dual live calls occurred during use; this is the frozen offline comparison.

- [ ] **Step 6: Build, verify, and commit the result shell**

  ```bash
  node src/cli.mjs report build --replay latest-frozen
  ```

  ```bash
  node src/cli.mjs report verify --read-only
  ```

  Expected: exact target-level private outcomes pass verification. Only then:

  ```bash
  node src/cli.mjs report public-summary --report latest-verified
  ```

  ```bash
  node src/cli.mjs report verify-public --read-only
  ```

  Expected: field-whitelisted public artifact passes verification. Copy only
  that exact aggregate artifact into
  `docs/habit-trial-results.md`, manually inspect its public-safety inventory,
  then:

  ```bash
  git add README.md docs/habit-trial-results.md
  git commit -m "test: report autocomplete V0 habit trial"
  ```

  The result must lead with the behavioral habit read, then next-human paired
  top-one/top-three, the separate accepted-endorsed table, execution reliability,
  latency/coverage, URL sparsity, exact infrastructure failures, uncertainty,
  and the narrowest observed reason for either continuing or stopping. It may
  motivate a later layer but must not add one inside this plan.

## Review record

- Dylan approved the authoritative design and the three implementation notes
  preregistered at the top of this plan on July 31, 2026.
- Chunk 1 and Chunk 2 passed independent adversarial review after five bounded
  iterations covering wire contracts, leases, causal execution, sanity evidence,
  and the natural-work lock.
- Chunk 3 passed independent adversarial review after three bounded iterations
  covering replay retry policy, denominators, release-inventory compatibility,
  cohort rules, disabled-period proof, and public-report privacy.
- This reviewed plan authorizes implementation but does not waive any phase-zero
  or sanity stop condition.
