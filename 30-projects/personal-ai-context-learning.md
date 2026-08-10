---
type: project
status: active
created: 2026-07-22
updated: 2026-08-08
aliases:
  - Personal AI Context Learning
  - Niyant's personal-AI thesis
domains:
  - personalized-ai
  - continual-learning
  - agent-memory
people:
  - niyant
  - dylan-vu
orgs: []
tags:
  - personal-ai
  - context-ingestion
  - world-models
  - continual-learning
---

# Personal AI Context Learning

> [!note] Source boundary
> This project includes internal Notion and Slack context alongside the public World Models notes.

> [!important] Current NAP direction, 2026-07-31
> The roughly 200-row manual corpus and V5 expanded-history experiment are
> complete. On ten scorable pairs, state-only scored 0/10 structured exact
> top-three and history scored 5/10. All five history hits were returns to the
> same recurring Codex task family; all five Arc targets were missed. The
> result supports recurring-task recall, not a general router. The approved V0
> therefore logs the full prediction-opportunity episode and context packet but
> executes only app activation, window focus, named Codex-task focus, and URL
> opening. It adds stable-idle as a proposal trigger, never arms Tab during
> typing or unsafe focus, and uses no computer-use execution model. Before the
> product shell, it probes proposal latency, exact Codex-task identity in the
> packet, and Tab safety. Fine-tuning, candidate enumeration, the Arc extension,
> and visual computer-use fallback remain deferred. See
> [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete
> V1 brainstorm and scope]] and
> [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what
> a first navigation autocomplete still needs]].

> [!failure] V0 exact Codex-task blocker, 2026-08-01
> The selected Haiku proposal provider passed, but the next load-bearing probe
> did not. Codex desktop exposes public thread list/read, completion events, and
> a registered deep link, yet no approved public surface identifies the exact
> task currently selected in the desktop UI. Manifest
> `3405bf06476d2132fee2d62e15877412a7cb3cc50068c131e882c7f3811bfe5f`
> freezes `active_task_unavailable`. The build stops before the Tab/pill rather
> than silently downgrading the V5-proven named-task behavior to generic app
> activation. See
> [[computer-use-autocomplete-task-5-codex-identity-probe-2026-08-01|the Task 5
> probe result]].

> [!failure] V0 activity-derived Codex event bridge failed, 2026-08-01
> A public-AX follow-up found the selected title and proved exact deep-link
> routing, but two immutable attempts still could not make the title-to-ID join
> reliable enough for exact verification. The activity-derived fallback then
> failed its blocking test: a sessionless standalone app-server listener saw
> none of three desktop-originated sends. Manifest
> `3cf152c8aa6e68dbae7417106bbbfc38433230e62b8eaf8ffa9eb55846085461`
> freezes `event_not_observed` in 3/3 trials. Generic Codex activation and title
> joins remain forbidden, so Task 6 is blocked pending an architecture choice.

> [!success] V0 Codex read-derived identity passed, 2026-08-02
> The push result ruled out only a standalone listener. In frozen read-path
> attempt `000003`, Dylan manually sent in three distinct tasks while the probe
> privately diffed full thread lists at baseline and approximately 2, 10, and
> 30 seconds. All `3/3` expected IDs showed `recencyAt` advancement and raw
> ordering movement by the first scheduled read. Manifest
> `057ce508a067030a09d834dc94f1355c08a9c38f3aa67751c2d5528f8e219de5`
> independently verified. V0 now uses read-derived identity for exact
> composer-concentrated labels and the Codex candidate catalog. Task 6 is the
> only next implementation task.

> [!success] V0 phase zero passed, 2026-08-02
> The local Tab/pill and armed-privacy probes passed, then the aggregate gate
> froze PASS under manifest
> `f4455bc12722af009a6acbc4c489c57b37cf499785991a27edaf1f14b7daedc3`.
> Direct Anthropic Haiku passed `5/5` warm calls at `2,045.63 ms` p50 with zero
> tools; Codex read-derived identity passed `3/3`; all seven physical Tab cells
> passed with exactly one consume and no focus theft; and all three privacy
> boundaries found zero canary bytes. Phase zero is closed. Task 8—the runtime
> ledger and five-axis state machine—is now the only next implementation task.

> [!success] V0 runtime ledger landed, 2026-08-02
> Task 8 is committed at `29c8b03`: six exact SQLite tables, private WAL
> sidecars, immutable provenance, ordered idempotent event ingest, and a pure
> five-axis episode reducer with deterministic restart/resync closure. Accepted
> feedback survives prediction or execution failure, and stale episodes cannot
> redisplay. The focused suite passes `22/22`, the repository passes `467/467`,
> and phase zero remains frozen PASS. Task 9—context epochs, triggers, and
> causal destination transitions—is now next.

> [!success] V0 causal opportunity state landed, 2026-08-02
> Task 9 is committed at `6d0c7ee` after ledger index correction `eb75ac0`.
> Node now owns context epochs, stable-idle/manual trigger arbitration, human
> versus product origin, destination-transition coalescing, pending
> override/ignore feedback, and the bounded Codex/Arc lease loop. Tab acceptance
> no longer invalidates its own accepted work; only verified navigation advances
> the next epoch. `496/496` repository tests and the frozen phase-zero verifier
> pass. Task 10—immutable live packets and frozen resolution catalogs—is next.

> [!success] V0 immutable packets landed, 2026-08-02
> Task 10 is committed at `35637e8`. The runtime now freezes one metadata-only
> current-plus-history packet, a provenance-bearing local resolution catalog,
> and a deterministic state-only derivative in a recoverable private envelope.
> History is capped at 15 minutes/100 events, exact Codex task identity is
> current-state data only while Codex is focused, and historical identities
> cannot resolve in the state-only arm. Privacy suppression records only coarse
> metadata and never invokes screenshot capture. `510/510` tests and the frozen
> phase-zero verifier pass. Task 11—live proposal coordination, validation, and
> local promise rendering—is next.

> [!success] V0 live proposal coordination landed, 2026-08-02
> Task 11 is committed at `dca267a`. The frozen direct Anthropic/Haiku provider
> now runs at most once per context epoch behind a five-second deadline and an
> explicit cancellation boundary. The coordinator persists before launch,
> validates exact-three or abstention output, stores every rank, selects the
> highest executable target, and arms one exact epoch/generation/lease-bound
> suggestion. Visible promises use only local canonical app, window, and Codex
> task names; model labels, malformed output, stale packets, and dormant
> `open_url` remain silent. Cancellation races and late responses are
> evidence-only. `525/525` repository tests and the frozen phase-zero verifier
> pass. Task 12—three deterministic executors and exact endpoint verification—is
> next.

> [!success] V0 deterministic execution landed, 2026-08-02
> Task 12 is committed at `2f3e436`. A closed stage-8 Spoon adds only native
> app/window execution; exact Codex-task routing stays in the structured
> adapter. Dispatch is one-primitive, persist-first, accepted-only, and guarded
> again by exact epoch, generation, target, and lease checks. Pointer or key
> activity after Tab invalidates the action. Endpoint outcomes distinguish
> exact verification from Codex app-only partial observation, with no retry,
> generic activation fallback, multi-step route, or URL execution. `75/75`
> focused tests, `540/540` repository tests, and the unchanged frozen phase-zero
> verifier pass. Task 13—runtime lifecycle wiring and the slim controlled sanity
> run—is next.

> [!success] V0 controlled sanity passed and natural work is unlocked, 2026-08-03
> The ordinary metadata-only product path is now running under the production
> Anthropic provider. One certification-only physical case showed the real pill,
> consumed Dylan's physical Tab, dispatched exactly one Finder activation, and
> verified Finder exactly. The ledger ended accepted/verified-exact and SQLite
> integrity passed. A harness ordering race initially misreported the run by
> checking a later unrelated stabilization abstention before the already
> completed episode; regression commit `9b7bdf3` fixes that readout without
> weakening genuine pre-episode fail-closed behavior. The final 763/763 suite,
> current-Spoon preflight, 8/8 leak-free AX coverage sweep, and clean authority
> state passed. The first ordinary runtime then exposed one production-only
> invalidation race: an active episode could clear during an awaited state read
> before the callback dereferenced it. Commit `f6b237e` adds a failing-first
> concurrent regression and revalidates the same episode after the await. The
> full suite now passes 764/764; the local sanity tag points to that commit, and
> the restarted ordinary runtime is `ready=true` with no blocker codes after a
> bounded live context-change check. The deterministic case certifies machinery
> only; the earlier Haiku abstention remains separate prediction-behavior
> evidence.

> [!warning] Week-one exploration policy blocked at qualification, 2026-08-04
> The brighter pill and higher-coverage display policy are implemented and the
> complete source suite passed 865/865, but the one authorized five-call live
> gate failed: three valid responses all abstained, two calls hit the exact
> five-second deadline, and zero returned ranked candidates. The preregistered
> bar was 5/5 valid, so the new policy was not installed, the sanity tag was not
> advanced, and the natural runtime remains stopped. Any fresh attempt requires
> an explicit preregistered amendment rather than a retry of the frozen result.

> [!info] Overnight week-one hardening, 2026-08-04
> The no-hands follow-up completed without changing the live runtime. Automated
> AX coverage produced closed metadata-only rows for all 11 requested surfaces,
> but only Finder was programmatically focusable/readable; Codex chat and
> composer, Arc body and sidebar, VS Code editor/sidebar/terminal, Slack,
> Terminal, and Obsidian require a short manual-focus sweep. A source-only
> week-one allowlist now permits the exact observed Finder `AXApplication` pair
> to override only `unknown` editability; editable, sensitive, denylisted, and
> Secure Input states remain suppressed, and the Tab and privacy gate hashes did
> not change. The nightly warm-start reducer generated four privacy-safe
> recurring window priors from the existing ledger and added the same capped
> block to both packet arms. The planned Haiku/Sonnet wager stopped before any
> model call: all 22 V5 packets use the old multimodal schema and all 24 live
> packets predate the new recurring-destination field, leaving 0/46 common
> compatible inputs. Haiku therefore remains unchanged rather than winning a
> comparison that never ran. The branch suite passes 884/884; none of these
> overnight changes is installed, the sanity tag remains at `f6b237e`, and the
> runtime remains stopped.

> [!info] Morning qualification setup, 2026-08-04
> The ten-surface manual AX harness is implemented and regression-tested, but
> Dylan paused the physical sweep before any final row manifest was frozen. No
> harness process or cue overlay remains, and the tracked allowlist still
> contains only Finder. The failed qualification postmortem is now immutable:
> it used five old phase-zero probe packets with one history row and no
> recurring entries; the three valid calls took 1.905, 2.215, and 2.952
> seconds. V1 did not persist response text, so its verbatim abstain reasons are
> unrecoverable rather than inferred. A new Qualification V2 is prepared on a
> clean source-only branch. It deterministically selects the five richest of 24
> real metadata packets, inserts only the frozen warm-start block, freezes the
> source before calls, stores abstain reasons, makes one no-retry call per
> packet, and requires 5/5 validity at the exact runtime commit. The suite
> passes 902/902. No V2 model call, install, tag move, or runtime launch has
> occurred.

> [!warning] Morning AX sweep passed; Qualification V2 failed closed, 2026-08-04
> Dylan completed the ten-surface metadata-only AX sweep in one sitting. All
> ten rows froze under manifest
> `5741c11204e57b204d3061fc127cce5512c25f7119b1e3c9e25d3d44b9d111de`.
> The exact known-safe pairs are Finder `AXApplication`, Codex `AXGroup`, Arc
> `AXWindow`, VS Code `AXWebArea`, and Slack `AXGroup`; composer, editor, and
> terminal-like surfaces remained suppressed. A second manifest,
> `51cc29d94f61c6142bd013a8868029942b5c1947b771818c3e3b9796d61328e7`,
> binds those pairs to the unchanged privacy and synchronous Tab-predicate
> hashes. Qualification V2 then made exactly five no-retry Haiku calls on the
> richest schema-current real packets. Four were valid—three returned ranked
> candidates and one abstained—and one completed in 2.683 seconds with an
> invalid response. The valid calls took 1.918, 1.944, 2.746, and 3.470
> seconds. Terminal manifest
> `c4fcd7aaf188be38c76a4930b0e7df1ada8be9e68b437b11b4ccdd12a9950d39`
> therefore failed the unchanged 5/5 gate. No retry, deadline change, install,
> tag move, or natural-runtime launch occurred.

> [!warning] Six-pair policy passed; instrumented Qualification V2 still failed, 2026-08-04
> The policy derivation now binds both frozen AX sources, including the earlier
> privacy-allowed, non-editable Arc page sample at `AXGroup`. The final six
> known-safe pairs are Finder `AXApplication`, Codex `AXGroup`, Arc `AXWindow`,
> Arc `AXGroup`, VS Code `AXWebArea`, and Slack `AXGroup`. Private policy
> manifest `637392328d38e31c72f020e853dfb0295a3a156d5e04449786ec16b3b5070b60`
> binds both evidence hashes to unchanged privacy and synchronous Tab-predicate
> hashes. The full source suite passed 911/911 at candidate `23bbb96`.
>
> Attempt `000001` had discarded call 1's validation subpredicate, so its exact
> historical invalidity cannot be recovered honestly. A non-counted replay of
> the exact packet was valid in 2.471 seconds; it did not justify a speculative
> salvage. The repaired evidence path now retains closed predicates. Fresh
> counted attempt `000002` then failed 3/5: calls 1, 3, and 4 returned valid
> ranked candidates in 3.438, 2.813, and 2.302 seconds; call 2 failed
> `candidate_target_unavailable` in 3.345 seconds; call 5 failed
> `candidate_cardinality` in 2.049 seconds. Terminal manifest
> `edb6469407e45df180cd463e604cf54e4e20dfdf307b9ce4b6eed825bf22c859`
> failed the unchanged 5/5 gate. Because unavailable-target repair would alter
> a decision rather than formatting, no salvage, install, tag move, warm-start
> regeneration, or natural-runtime launch occurred. The runtime remains
> stopped.

> [!warning] Structural target repair passed locally; maximum-size provider boundary timed out, 2026-08-04
> Candidate `14f4818` makes off-catalog targets structurally unrepresentable:
> each request exposes at most 24 executable entries as opaque IDs, the model
> scores those IDs or structurally abstains, and local code alone resolves the
> top three and executor actions. The final suite passed 931/931 and independent
> review found no blocker. The required non-counted 24-entry schema check then
> hit the unchanged five-second deadline at 5007.122 ms and froze
> `failure_predicate=deadline` under manifest
> `c284a6d943e7998e70d5a2909f4c309f7b2a61a86310eab4a646ed72bc1f482f`.
> The stop rule prevented all five counted calls. No retry, tag move, install,
> warm-start regeneration, or runtime launch occurred; the runtime was already
> stopped with `lock_missing`.

> [!warning] Twelve-choice packet economics missed the four-second boundary, 2026-08-04
> Candidate `9ca875a` caps each provider-visible choice set at 12, prioritizes
> recurring/current/MRU destinations before schema construction, uses compact
> one-character IDs, and sends selected catalog rows only once. The final suite
> passed 954/954 and independent review approved the request, evidence, and
> at-cap qualification contracts. The single authorized non-counted boundary
> call returned a valid rank in 4118.091 ms: 118.091 ms above the preregistered
> 4000 ms bar but below the unchanged 5000 ms deadline. Manifest
> `5296dc4418e979e376dd09583c256a9dbcf418de00e8a17418dfb48cb6ca15ad`
> records `latency_threshold`, 5989 request bytes, 619 schema bytes, 1936 input
> tokens, 55 output tokens, and zero cache tokens. The stop rule prevented all
> five counted calls. No retry, deadline change, tag move, install, warm-start
> regeneration, or runtime launch occurred; the runtime remains stopped with
> `lock_missing` and the sanity tag still resolves to `f6b237e`.

> [!warning] Five-sample boundary passed its median but missed the all-call deadline bar, 2026-08-04
> The one-shot result was superseded through a preregistered estimator change,
> not retried under the old rule. Candidate `31c05a8` made exactly five
> sequential, identical 12-choice boundary calls with no retry or early stop.
> Latencies were 1791.977, 2581.453, 2312.019, 5006.670, and 1256.988 ms.
> Median latency passed at 2312.019 ms, but one call hit the unchanged 5000 ms
> production deadline, so only 4/5 were within deadline and manifest
> `bb6db3e193eb50dfcc24a981bdfd2707943a4b7823211b404302a26aff02178f`
> froze `production_deadline`. All five outcomes remain immutable. The stop rule
> prevented counted qualification, deployment, warm-start regeneration, and
> runtime launch; the runtime remains stopped and the sanity tag remains at
> `f6b237e`.

## Current State

> [!warning] 2026-08-07 packet-fidelity audit
> The current corpus has grown from the requested 60 packets to 63. Exact active
> Codex task identity is absent in all 63. Seven packets contain one historical
> task from the startup directory read; the rest have no Codex task candidate.
> The planned full thread-list candidate catalog was not implemented: the
> runtime performs one startup read, admits only already-recent threads into the
> 15-minute history buffer, and lets them age out. The state-only twin also
> retains recurring memory, so it is a rolling-recent-history ablation rather
> than a strict screen-only baseline. See
> [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the complete
> audit and restoration-cost estimate]].

> [!warning] 2026-08-08 full-fidelity repair qualified packets but missed the gate
> Candidate `07a9cf3` repairs live Codex-directory injection and the honest
> screen-only/recurring/rolling-history replay arms; `1,166/1,166` tests pass.
> Five isolated packets all carried directory candidates and hit the 12-choice
> cap. The exact five-call Haiku gate returned ranked threes on 3/5 and
> abstained twice on `ranking_tie`; it had zero timeout, invalid, off-catalog,
> or fabricated outcomes. The fixed bar required at least 4/5 ranked returns,
> so no cutover or trial start occurred. Tag `3c8619d` is unchanged and the
> runtime remains stopped. See
> [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the repair and
> qualification record]].

> [!success] 2026-08-08 ranking ties repaired and trial day one started
> Commit `b58f38e` retired `ranking_tie` abstention, passed `1,182/1,182` tests
> and independent review, then returned ranked top-threes on all 5/5 fresh
> Haiku qualification calls. Runtime
> `7813ae1f-412b-4a98-9886-8f647ed403d3` reached `ready:true`; the immutable
> marker starts day one at `2026-08-08T16:27:40.931Z`. The runtime is frozen for
> the trial, and weekend days qualify at four or more live-heartbeat hours. See
> [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the full repair,
> qualification, and trial-start record]].

> [!success] 2026-08-08 strict three-arm replay shows directional history lift
> Only 7/63 frozen packets had a clean subsequent-event label, so the result is
> small-n: screen-only scored 0/7 exact top-three, recurring memory scored 1/7,
> and rolling history scored 2/7. All arms used the same denominator; 189/189
> calls reached terminal evidence with two timeouts and no other failures. The
> monotonic ordering supports the history-lift hypothesis but does not establish
> its magnitude. See
> [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the complete
> replay table and provenance]].

> [!warning] 2026-08-10 verdict-week lifecycle and indicator faults
> The frozen runtime lost its lock and stopped ingesting while its Node PID
> remained alive and raw Hammerspoon ingress continued. The documented direct
> recovery path restarted the exact same `b58f38e` source successfully as
> runtime `7c5d7714-7b19-4eab-a28d-553b377a459b`. The old raw session retained
> 1,157 rows that did not backfill into SQLite. `CUA OFFLINE` was also hidden:
> parked supervision leaves `desired_running:false`, which makes the indicator
> return `desired_disabled` before checking stale health or the missing lock.
> Both are frozen supervisor-verdict evidence, not fix tickets. Under the new
> day rule—≥4 live hours, ≥5 opportunities, and a direct-user-input hour—only
> Saturday qualifies; Sunday had six opportunities but only window events.
> Current qualifying-day total: **1**. See
> [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the exact outage,
> recovery, reconciliation-gap, and accounting record]].

> [!success] 2026-08-10 freeze-exception ingress and indicator repair
> The apparent second silent failure was deterministic: the ingress reader
> treated its 4,096 retained duplicate digests as a lifetime event limit, so
> source sequence 4,097 killed the managed runtime while its detached Node shell
> and raw observer remained alive. Commit `644a3ec` converts that into a bounded
> rolling duplicate window and adds honest `direct_runtime_stale` and
> `runtime_ingress_stalled` indicator states. The final runtime is
> `ready:true`; its first post-fix epoch was 1, verification reached epoch 4,
> raw and ledger frontiers matched, and integrity was `ok`. The trial freeze now
> resumes at `644a3ec`; the prior outage remains verdict-week evidence. See
> [[computer-use-autocomplete-packet-fidelity-audit-2026-08-07|the exact root
> cause, TDD repair, qualification, and cutover evidence]].

The first expanded-history NAP comparison is complete. Its official exact
top-three result is 0/10 for state-only and 5/10 for state plus history.
Target-level review decomposes the five history wins into four clean
exact-and-semantic wins and one canonical task-name win where state-only had
already identified the same practical composer generically. History did not
exactly predict any non-Codex destination.

The rough V1 opportunity is therefore narrower than general computer-use
prediction but closer than a comparison with a mature autocomplete product
would imply. A first version can occasionally offer a high-confidence return
to an app, window, or recurring Codex task. It does not need to predict
every action. Candidate enumeration, richer retrieval, hierarchical ranking,
and confidence calibration may later improve coverage, but the immediate V0
tests whether a tool-free proposal model plus a three-primitive deterministic
executor produces a habit-forming interaction.

As of August 4, V0 implementation and controlled machinery certification are
complete, but the proposed week-one exploration policy is blocked before
natural use. The metadata-only observer, packet foundation, direct Anthropic
provider, read-derived Codex identity, physical Tab boundary, non-activating
pill, privacy boundary, five-axis ledger, context epochs, three-primitive
executor, and exact endpoint verification now run as one product path. The one
physical certification case used a deterministic guided-only provider to
isolate machinery from prediction quality; the natural runtime hard-rejects
that provider. The manual AX sweep now supports a narrow five-pair safe
allowlist while keeping composer, editor, and terminal-like surfaces
suppressed. Qualification V2 replaced the old probe packets with five rich
schema-current real packets and warm-start history, but still failed the fixed
5/5 gate: 4/5 valid, with three returned candidates, one abstention, and one
invalid response. The gate correctly left the prior sanity tag and installed
runtime untouched and left the runtime stopped.
The initial ordinary run exposed and now has regression coverage for an async
invalidation race without repeating the physical certification. Exact
arbitrary active-task reading remains unreliable. The manual AX sweep closed
all ten requested surfaces without content capture; only five exact pairs are
allowlisted, while unknown or editable composer/editor/terminal-like surfaces
continue to fail closed. The fresh schema-consistent qualification is now
complete and failed closed; deployment remains blocked until a new, explicitly
preregistered response-validity decision rather than an automatic retry. See
[[codex-thread-list-recency-reveals-desktop-originated-task-activity|the frozen
read-path finding]].

The August 4 overnight hardening branch adds two useful V0.1 inputs without
claiming a live-policy success: a narrowly reviewable unknown-editability
allowlist and a four-entry recurring-destination weak prior. The automated AX
sweep was too sparse to expand the allowlist beyond Finder without Dylan
focusing ten surfaces manually. A planned cross-model wager also produced no
accuracy or latency result because the V5 and live packets do not share the
new provider schema. The bounded manual AX sweep and schema-current
Qualification V2 are now complete. Their result is not a provider wager win:
the coverage gate passed, but the response-validity gate failed 4/5. V5 is
permanently off-policy for provider comparison. The Haiku/Sonnet wager is
rescheduled to midweek using accumulated real schema-current opportunities and
labels derived only from their subsequent event streams.

The subsequent structural-output repair closes the invalid-target and
candidate-cardinality representation defects, but it has not yet qualified for
week-one use. The first 24-entry boundary hit the five-second transport
deadline. A preregistered packet-economics amendment reduced the maximum choice
set to 12, and an explicit follow-up replaced the noisy one-shot estimator with
five fixed samples. The five-sample median passed at 2312.019 ms, but one call
timed out at 5006.670 ms, so the aggregate failed its requirement that all five
calls remain inside the unchanged production deadline. Every stop occurred
before counted call 1, so there is still no new five-packet behavior result and
no live exploration runtime. The frozen result does not authorize a retry or
deadline change.

A final explicit measured-risk amendment now supersedes only that last
all-calls latency decision. The single V4 counted gate at `9a5c094` passed with
four ranked predictions, one graceful timeout, zero abstentions, zero invalid
responses, and zero other failures; p50 was 2259.857 ms. The one-use evidence
lineage is frozen under manifest
`bbe4766d135ce5688d13fd085bf14cd7589777cf35164c88fe03c0216b11275e`.
Natural use still did not begin: deployment stopped before mutation because
the installer cannot validate the live historical Stage-8 module set created
before `arming_policy.lua` existed. The prior sanity tag was restored to
`f6b237e`, the live Spoon remains byte-for-byte aligned with its recorded
nine-file state, and the runtime remains stopped. The current blocker is an
installer migration contract, not provider validity or prediction latency.

That blocker is now resolved at `df3f87a`. The installer verifies and migrates
only the exact historical nine-file Stage-8 shape, while all new writes remain
the current ten-file shape. The full suite passed 988/988. A frozen 32-file
provider-source inventory proved that every decision-bearing packet, schema,
prompt, and transport blob remained byte-identical to qualified commit
`9a5c094`, so the V4 result was inherited without another model call under
manifest `9a843fe3caf04043b8d7f75491fb7413c4affb8424252fe8bf83dbeaad4f8973`.
The current Spoon installed and reloaded, preflight passed, the privacy-safe
four-entry warm-start block regenerated, and natural mode is now `ready=true`
with runtime ID `46bcd646-df69-4f09-b347-b436f46e4ff2`, no blocker codes, and
source commit `df3f87a`. The qualifying week began on August 4, 2026.

A July 30 model and competitor audit found no released system that combines
goal-free personal intent inference, usefulness-ranked semantic completion,
native Mac execution, truthful one-Tab scope, abstention, and fresh
confirmation at consequential commits. The recommended boundary is to build
the personal candidate, ranking, utility, and authority layers while
repackaging existing computer-use models for route execution. The strongest
MVP executor candidates are Gemini Computer Use, OpenAI Computer use, and
UI-TARS 1.5-7B; LongNAP, PIRA-Bench, FDM-1, and Photon-1 are research
references rather than shippable dependencies. See
[[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The
computer-use autocomplete wedge is intent ranking, not another computer-use
agent]].

A July 30 runtime decision audit supersedes any provider-first reading of that
landscape. On Dylan's Mac, the installed Codex actuator could focus and verify
exact Arc and VS Code objects but hard-blocked Codex itself; a structured Codex
task adapter bridged that route, while Claude Computer Use and the three public
APIs lacked the local approval, configuration, credentials, or client actuator
needed for an honest common bakeoff. The fastest credible prototype is
therefore a product-owned local hybrid: deterministic app adapters and
authority/telemetry first, with the proposal model replaceable. Gemini is no
longer the selected first backend. See
[[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use
autocomplete runtime decision audit]].

A narrower July 30 context-stack audit found that the live MVP does not need
the exact-label capture machinery built for retrospective datasets. The
approved July 31 V0 keeps a reduced Hammerspoon observer and a product-owned
SQLite ledger for every prediction opportunity; screenshots were subsequently
deferred to V0.1 after their marginal value for the habitual class remained
unproven. The audit's proposed Arc adapter and computer-use fallback remain
deferred. Screenpipe can remain an optional search/debugging sidecar, while
continuous video, rrweb, full Accessibility trees, historical reconstruction,
and long-term semantic memory remain deferred. See
[[computer-use-autocomplete-mvp-context-stack-2026-07-30|The fastest credible
MVP context stack is a thin Mac observer plus a product-owned ledger]].

The public World Models notes describe a three-phase research program: reconstruct a faithful personal event stream and predict the next action; learn bounded local comparisons from post-suggestion behavior; then test sandboxed multi-step assistance. The formal phases are specifications, not completed experiments.

Niyant's near-term execution is narrower than that program. In the July 21 Slack exchange, he said he plans a static implementation with basic data and does not expect to implement roughly 80% of formal Phase 1 now. He will start with Obsidian notes and then browser use because those are the personal data sources available to him.

The business thesis is that producing and transmitting context to LLMs is a growing enterprise cost. Niyant treats that thesis as the reason to do the work. The immediate build is meant to demonstrate ability publicly, build legitimacy, and attract inbound interest. Enterprise outreach is not a short-term milestone; outbound becomes relevant if the set of inbound strategies fails.

Dylan is exploring a more interaction-first product wedge: personalized intent compression for computer use. The initial example predicts the next app and control at a natural handoff point and offers a one-key, non-destructive completion. Niyant initially called the idea too vague, then said it aligns overall after Dylan clarified the progression. Niyant's ideal target remains the content of the next write because he sees that as stronger evidence of understanding; his main concern with starting at app prediction is that he uses roughly three apps, allowing a trivial frequency predictor to look accurate without being useful.

The resulting formulation is a structured-resolution ladder rather than an unrestricted computer-use branch: domain or app → exact object or control → operation → content. This mirrors Phase 1's domain, location, operation, and content decomposition. Each level must beat its own trivial baseline and demonstrate felt acceleration; easier location predictions do not automatically imply goal understanding or progress on semantic content prediction.

On July 22, Dylan asked what Niyant would have him, or a second pair of hands generally, build to contribute to the vision. Dylan reported that Niyant's answer was to build the computer-use NAP concept. This converts semantic computer routing from an adjacent product idea into an explicitly useful complementary workstream. It does not yet specify whether Niyant means exact destination routing, broader action trajectories, or a live Tab product.

Omar Shaikh's public stack is the closest prior art. Markov and NAPsack address capture and semantic action labeling; LongNAP predicts personal action trajectories; GUM, Just-In-Time Objectives, Behavior Latticing, and Tempo move from user propositions toward objectives and goals; Tada packages several personal-AI interfaces. Tada's Tabracadabra already uses Option+Tab to write in a field after a research phase can inspect personal logs. It is a runnable **writer**, not Dylan's proposed **router**, and it relies on inference-time retrieval rather than proving that a trained personal model learned the user.

Dylan decided not to use Tabracadabra as a separate experiment. The planned prediction target remains next semantic focus, but the immediate work moved one rung earlier after a live Screenpipe audit. Screenpipe captured screenshots, URLs, clicks, keys, scrolls, application switches, and window-focus events. In the later roughly 50-minute natural session, only 78 of an estimated 150 physical clicks had a direct role, name, and bounds. All 40 secondary-display clicks lacked direct semantic target fields, including the Arc-to-Codex interactions closest to the proposed product. Its window-focus stream also does not guarantee explicit focus events for webpage controls.

The current LBH is therefore an acquisition gate: determine whether an out-of-the-box or minimally augmented recorder can reconstruct roughly 90% or more of 50–100 meaningful browser and native-app actions as exact semantic targets, paired with a leakage-safe pre-action frame from both monitors. Ambiguous and unresolved events remain in the denominator. Only after this passes should the project compare exact top-one and top-three destinations under recency, source-transition, screen-only, correct-history, mismatched-history, and declared-goal conditions.

Recorder research found no single turnkey Mac tool that combines exact Arc DOM targets, native control identity, both displays, raw timestamps, and hours of passive capture. The lowest-engineering acquisition ladder is now: keep Screenpipe as the two-monitor application/window/URL backbone; run a short NAPsack calibration with Accessibility enabled, especially on the secondary display; add the Arc-compatible UI + API Recorder only if webpage controls remain the failing layer; and begin a long collection only after the hybrid passes the exact-target gate. See [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]].

The first NAPsack calibration found and locally fixed a display-coordinate mismatch between its input handler and screenshot worker. A corrected run assigned all seven sampled secondary-display clicks to the right monitor and paired each with a same-display pre-action image roughly 0.10 to 0.17 seconds earlier. Direct Accessibility labels covered only two of the four meaningful intended controls, while blind screenshot-plus-coordinate reconstruction recovered all four. This is enough to keep the hybrid approach alive, but not enough to pass the gate: the run contained only four valid intended actions, so the required controlled and natural-session coverage audits remain undone.

That Screenpipe-plus-NAPsack branch has now been superseded for the controlled diagnostic. Capture Layer v2 uses Hammerspoon for physical input and Accessibility evidence, one ScreenCaptureKit stream per display, and mandatory Arc DOM, navigation, and rrweb evidence. Its six-action smoke passed. The fixed diagnostic walkthrough is paused at 12/30 immutable checkpoints, with step 13 next. The raw evidence is preserved, but semantic validator patches during collection created disclosed source-inventory drift, so this remains a component diagnostic rather than the later frozen calibration. See [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]].

The July 26 through July 28 decision supersedes that capture ladder for the first qualitative pilot. Human review can supply event boundaries and exact hidden destinations without pretending Screenpipe already emits predictor-ready rows. An initial July 28 audit reconstructed six candidate transitions from a short end-of-evening session. Dylan then clarified that his intended source is the full several-hour blog-building recording and that he planned to sift and label it manually. The likely review window is approximately 5:15 PM through 10:20 PM EDT, containing 2,306 two-monitor frames and 1,945 UI events across several recorded segments. The short-session rows remain examples only. Dylan will first build five complete rows and smoke-test the state-only labeling, packet, prediction, and scoring workflow. If it passes, he will continue toward approximately 60 rows. The later history condition receives the ten most recent eligible historical rows, each represented by both before-state screenshots and its known destination text. See [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]] and [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]].

The NAP experiment is one side of Dylan's current branch-selection LBH, not yet the chosen next project. The competing GPU branch has been sharpened from “find an offtake customer” into a demand-informed configuration gate: determine which small-server GPU configuration, if any, deserves to be purchased based on workload-specific customer evidence or defensible marketplace behavior. See [[gpu-configuration-demand-gate|GPU configuration demand gate]].

A July 2026 Google DeepMind paper adds a failure-mode lens rather than evidence for feasibility. Once a personalized predictor shows suggestions, it helps cause the future behavior it learns from. Exposed-history accuracy may rise because the model understands the person better, because the person is conforming to the model's historical predictions, or both. This makes shadow mode, randomized exposure, goal-change tests, washout periods, and agency/diversity measures necessary before treating online accuracy or acceptance as evidence of deeper personalization.

## Evidence Boundary

- A coherent thesis can justify an experiment. It does not validate the size, urgency, or buyer ownership of the enterprise problem.
- A static self-demo can test a narrow technical capability. It cannot establish the full dynamic-ingestion or continual-learning thesis.
- Obsidian and browser data make the first experiment feasible. They do not identify the best enterprise workflow.
- Public demos and inbound can establish legitimacy or interest. They do not establish deployment value, retention, or willingness to pay.
- The formal Phase 1-3 ladder remains useful as a map, but omitted rungs remain untested.
- The GDM paper formalizes a plausible value-lock-in mechanism with equations and simulated populations. It contains no new human, LLM-agent, or product experiment and does not validate that the effect occurs at a material magnitude.
- LongNAP establishes learnable personal action signal under its own phone-derived, trajectory-level setup. Its pass@1 is not next-app accuracy and it supplies no end-user routing-value result.
- Tabracadabra establishes that the keyboard-first writer interaction is runnable. It does not establish learned personalization, exact semantic routing, or goal understanding.
- Niyant's assignment establishes that computer-use NAP is strategically relevant to his vision. It does not validate Dylan's target, product value, or proposed implementation.
- Screenpipe establishes that Dylan's Mac can produce a continuous raw action and screen stream. It does not establish automatic exact control-level labels. Running a predictor on unverified automatic labels would confound model quality with recorder quality; manually verified exact labels are acceptable for the first retrospective pilot.

## Key Insights

- [[public-proof-can-establish-builder-legitimacy-without-proving-enterprise-demand|Public proof can establish builder legitimacy without proving enterprise demand]]
- [[a-static-personal-demo-cannot-validate-a-dynamic-enterprise-context-system|A static personal demo cannot validate a dynamic enterprise context system]]
- [[available-personal-data-can-scope-a-demo-without-identifying-the-enterprise-wedge|Available personal data can scope a demo without identifying the enterprise wedge]]
- [[personal-agents-need-continuous-local-tracking-not-a-finished-world-model|Personal agents need continuous local tracking, not a finished world model]]
- [[a-personal-predictor-can-improve-by-making-its-user-more-predictable|A personal predictor can improve by making its user more predictable]]
- [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]
- [[workflow-history-can-recover-recurring-destinations-without-general-next-action-competence|Workflow history can recover recurring destinations without general next-action competence]]
- [[a-first-computer-navigation-autocomplete-should-rank-candidates-and-abstain|A first computer navigation autocomplete should rank candidates and abstain]]
- [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]

## Syntheses

- [[nap-vs-gpu-configuration-experiment-fork|NAP versus GPU configuration experiment fork]]
- [[niyant-personal-ai-thesis-study-guide|Niyant's personal-AI thesis: a beginner's study guide]]
- [[personal-ai-phase-1-next-action-prediction|Phase 1: Can an AI learn what matters to you by watching you work?]]
- [[personal-ai-phase-2-local-preference-learning|Phase 2: Can a better next move train a better AI?]]
- [[personal-ai-phase-3-bounded-multi-step-assistance|Phase 3: Can an AI help with more than the next move?]]
- [[personal-ai-strategy-and-evidence-sequencing|Personal AI strategy and evidence sequencing]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- [[computer-use-nap-build-log|Computer-use NAP build log]]
- [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]]
- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]]
- [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Computer-use NAP shakedown predictor packets, July 28, 2026]]
- [[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history produced five exact top-three wins and no losses in NAP V5]]
- [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
- [[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The computer-use autocomplete wedge is intent ranking, not another computer-use agent]]
- [[computer-use-autocomplete-mvp-context-stack-2026-07-30|The fastest credible MVP context stack is a thin Mac observer plus a product-owned ledger]]
- [[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use autocomplete runtime decision audit]]
- [[computer-use-autocomplete-provider-bakeoff-2026-08-01|Neither provider passed the first two-sided autocomplete bakeoff]]

## Hunches

- [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]

## Sources

- [[dylan-niyant-personal-ai-slack-2026-07-21|Dylan and Niyant: personal-AI strategy Slack exchange]]
- [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- [[screenpipe-natural-work-audit-2026-07-28|Screenpipe natural-work audit, July 28, 2026]]
- [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
- [[pira-bench-proactive-intent-recommendation-agents-2026-03-09|PIRA-Bench tests proactive intent recommendation from continuous GUI screenshots]]
- [[induction-labs-scaling-video-pretraining-with-imagination-models-2026-07-23|Induction Labs: Scaling Video Pretraining with Imagination Models]]
- [[standard-intelligence-fdm-1-fully-general-computer-action-model-2026-02-23|Standard Intelligence: FDM-1, a fully general computer action model]]
- [[google-deepmind-ai-value-alignment-for-evolving-social-norms-2026|Google DeepMind: AI Value Alignment for Evolving Social Norms]]
- [World Models public notes](https://handsdiff.github.io/)
- [Pinned public notes snapshot](https://github.com/handsdiff/notes/tree/3151afa93fd81719a6e9dc7862c269ea1f1a70e6)
- Internal Notion page: [All hands 7.20](https://app.notion.com/p/3a3307288ccf800c9d43e5386a0a1b4f)

## Open Questions

- What exact claim is the static implementation designed to test?
- After a navigation-only signal gate, should the product remain a router or carry selected context into the accepted destination?
- Is next-action prediction primarily the daily product, a forcing function for building a faithful context system, or both?
- At what rung does intent compression require genuine local-goal representation rather than shallow personal transition habits?
- When Niyant says “computer-use NAP,” does he mean exact semantic destination routing, a broader action trajectory, or the full live Tab interaction?
- Is there enough out-of-time entropy among semantic UI destinations for personalization to beat most-common and transition-frequency baselines?
- After suggestions are exposed, can accuracy improve without narrowing useful behavior or slowing adaptation after a project or goal change?
- Should domain, location, operation, and content be predicted jointly, hierarchically, or treated only as separate diagnostic heads?
- Which formal Phase 1 rungs are included, and which are intentionally deferred?
- What separates informational background from context that expresses a person's desires and judgment?
- What evidence would show that the broad enterprise context cost is urgent, budgeted, and owned by a specific buyer?
- What counts as successful inbound, and when does failure trigger outbound?
- What would make the personal data pipeline transferable to an enterprise workflow rather than merely reusable code?
- Would the work still be worth doing if no enterprise paid for it?
- Which next experiment produces more decision-changing evidence for Dylan: the semantic-routing shadow test or the GPU configuration demand gate?

## Next Tests

- Observe the frozen `644a3ec` qualifying runtime through the trial. Make no
  cutovers or fixes unless a signal-killing fault prevents the runtime from
  staying up, rendering pills, or preserving ledger integrity. Report one
  telemetry readout each evening; treat imperfect predictions and ignored
  suggestions as trial data.
- Treat the completed three-arm replay as directional evidence only: exact
  top-three rose from 0/7 screen-only to 1/7 with recurring memory and 2/7 with
  rolling history, but strict label coverage was only 7/63. Use the frozen
  offline tooling again at the trial verdict once more clean labels exist.
- Keep the Haiku/Sonnet wager parked until the trial verdict. If it resumes,
  use only accumulated post-repair schema-current opportunities and require
  Sonnet to add at least two exact top-three hits with p50 at or below 3.5
  seconds. V5 remains out of scope.
- Preserve V5 and its immutable runtime; do not rerun it.
- Define a stable hierarchical ontology for application, window/task,
  document/page, and control candidates.
- Enumerate the same executable candidates for both model conditions rather
  than asking each model to invent destination labels.
- Collect a diverse week or equivalent work block across several workflows,
  deliberately including non-Codex targets and departures from recurring
  loops.
- Reserve 50–100 later chronological targets, stratified by transition family
  and destination depth.
- Compare frequency, most-recent, source-transition, state-only, and
  state-plus-retrieved-history baselines.
- Report hierarchical accuracy, top-one, top-three, confidence coverage,
  abstention quality, and Dylan-authoritative shortcut usefulness.
- Test an app/window/task shadow-mode V1 before investing in arbitrary-control
  prediction or fine-tuning.
- Before selecting a proposal provider, run the same credentialed five-trial
  route and context packet through each genuinely viable candidate over the
  same product-owned actuator; compare proposal and completion p50/p95,
  endpoint success, privacy, and cost.
- Before rerunning the provider gate, add sanitized predicate-level Claude
  stream failure reasons, diagnose Codex's missing generated authority request,
  freeze five representative real metadata packets, and use a new dedicated
  spend-capped Anthropic key. Do not begin the overlay while no provider has
  `5/5` valid warm calls and p50 at or below `2.5 seconds`.
- Revisit automatic capture only when live shadow mode requires it or Dylan
  explicitly resumes that work.
- State the demo's claim and nonclaims before publishing it.
- Compare the static implementation against simple context, retrieval, and memory baselines on held-out personal events.
- Send Niyant the navigation-only experiment contract and confirm that its exact semantic-destination target matches what he meant by computer-use NAP.
- If the two-day result is promising, freeze the ontology, prompt, history window, baselines, and scoring rules before a larger chronological test.
- In a larger test, compare MRU-3, source-transition, screen-only, correct-history, mismatched-history, and correct-history-plus-declared-goal conditions with top-three prediction and abstention.
- Kill or redirect the router if destinations have low entropy, trivial baselines nearly match the model, correct history adds no lift, labels are unstable, or hits mostly replace one click.
- Treat Tabracadabra as prior art and a possible later writer baseline, not as a required experiment.
- Keep proof of builder quality, proof of technical efficacy, and proof of market demand as separate outputs.
- Record which inbound artifact produces each conversation and what the respondent actually wants.
- Before calling the pipeline an enterprise MVP, test whether it reconstructs context for one real team workflow with tolerable capture and privacy costs.
- Before interpreting online accuracy or acceptance, randomize suggestion exposure, preserve hidden predictions, introduce a declared goal change, and measure adaptation speed, outcomes, overrides, novel actions, and washout behavior.
- Decide whether to run this shadow experiment or [[gpu-configuration-demand-gate|the GPU configuration demand gate]] as the next LBH; do not treat either branch as selected yet.
