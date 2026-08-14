---
type: project
status: proposed
created: 2026-08-04
updated: 2026-08-04
aliases:
  - Expressive tier design
  - Piggyback computer-use tier
  - Action pill spec
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - autocomplete
  - expressive-tier
  - product-spec
---

# Expressive tier: piggyback computer-use design

## One paragraph version

The narrow tier predicts which window or task Dylan goes to next and jumps there. The expressive tier extends the same prediction pipeline one level deeper: it predicts what Dylan is about to do inside an app, shows it as an action pill, and on Tab hands that intent as a plain language task to a computer use agent Dylan already runs (Codex desktop or Claude Code). The host agent does the looking and the clicking with its own cursor animation. We build glue only. The whole point is to find out whether repackaging existing computer use applications is enough, not to build a computer use system.

## What this is not

- Not our own computer use loop. We never call a computer use model directly, never execute clicks ourselves, never draw our own ghost cursor. If the hosts fail the probes, the finding is "the piggyback thesis is falsified for now," not a license to build the loop.
- Not vision in our stack. The predictor stays metadata only: history, catalogs, warm start block. No screenshots are captured or sent by our code. Perception happens inside the host agent at execution time.
- Not a replacement for the narrow tier. The narrow tier stays untouched, keeps its speed, and runs the trial week regardless.

## Architecture

1. **Predict intent from metadata.** Same packet pipeline as the narrow tier (Haiku, history, recurring destinations, window and task catalogs). Output is an intent sentence, for example "subscribe to this profile" or "reply in this thread." No pixels involved.
2. **Show an action pill.** Visually distinct from a navigation pill because accepting it moves things on screen. Same 5 second life, same display policy.
3. **Tab hands off.** The accepted intent goes to a host agent as a natural language task: Codex desktop through the app server client for general apps, Claude Code headless with computer use enabled for anything inside Codex itself (Codex computer use cannot target Codex, confirmed in the runtime audit).
4. **Host executes.** The host's own perceive and click loop finds the target on the current screen and acts, drawing its own shadow cursor. The motion user experience is inherited, not rebuilt.
5. **Escape aborts. Only Escape.** During a flight, a Hammerspoon watcher maps Escape to the host's interrupt (abort turn for Codex app server, process kill for Claude headless). Kill latency on our side under 50ms; host side latency is measured by Probe A, not assumed. Mouse movement, other keys, and focus changes do not abort. The flight completes unless Escape is pressed.

## Triggering

Auto triggered, same opportunity triggers as the narrow tier (context change plus pause, idle end). At opportunity time the pipeline forks: if a good navigation candidate exists, the navigation pill wins as today; if the moment looks in app, the intent path proposes instead. The trigger chord (Control Option Space) is demoted to a force it now override, consistent with its narrow tier role.

## Preregistered expectations

- **Coverage is habitual only.** History can only name in app actions that have happened before and left metadata traces. Novel actions are invisible to the predictor. That matches the product thesis: habit prediction, now with reach.
- **Stale intent grounding misses are the expected new failure class.** The predictor is blind, so it can propose an action whose target is not on the current screen. The host will visibly fail or flail; Escape kills it; the episode is logged as a grounding miss, not read as "product broken."

## Gating probes, before any glue is built

**Probe A, host viability.** Per host (Codex desktop, Claude Code headless): can we programmatically start a task aimed at the current screen; does it execute there; is the native cursor animation present; per action latency; abort latency through the host's own interrupt; can it drive Codex. Frozen evidence like every other probe.

**Probe B, intent quality.** Five real ledger moments where the actual next action was in app. Feed each metadata packet, no screenshot, to Haiku asking for the intent. Dylan scores whether he would have accepted each. Accepted intents are then handed to the host on the recreated screen and scored for correct execution.

Probe B failing on prediction means our data cannot name in app intents yet; that is the evidence backed moment to revisit vision, not before. Probe A failing on both hosts falsifies the piggyback route. Either failure costs an afternoon.

## Sequencing and isolation

- The narrow tier finishes its qualification gate, deploys, and the trial week starts first. This tier never blocks that.
- Probes run in declared windows with the ambient runtime stopped, so agent driven app switches never pollute the trial ledger. Qualifying hours exclude probe windows.
- Glue is built only on probe pass, feature flagged, in separate modules the certified runtime does not load. No live runtime redeploys mid week except preregistered fixes.

## Logging

Every expressive episode lands in the ledger with a tier tag: proposal, accept or escape or complete, per step outcomes where the host exposes them, and latencies. The Friday replay scores the tiers separately.

## Research findings, 2026-08-04, pre-probe

Half day of source reading before committing the probe design. Four findings, each changing the spec or the probes.

1. **Codex app server is a better host than assumed.** `turn/interrupt` is a first class API call: it requests cancellation and the server emits `turn/completed` with status `interrupted`. That is exactly the Escape mapping. `turn/start` also accepts per turn overrides including approval policy, and there is a `turn/steer` call for redirecting a live turn (future option, not v1). Two probe additions: measure Escape kill latency as interrupt-to-completed time, and observe whether computer use turns emit approval requests to the client mid flight; if so, the per turn approval policy override must pre approve them or every flight stalls waiting on us.
2. **The Claude leg is the weak leg.** Claude Code headless has clean permission machinery, but no native desktop cursor animation and no built in desktop actuator: computer control would arrive through tools we would have to supply, which drifts toward the prohibited owned loop. Revised ladder: Codex computer use for general apps; Codex internal navigation stays on the existing codex deep link primitive; in app actions inside Codex itself are out of scope for v1 unless Probe A surprises us. Probe A's Claude leg is demoted to a curiosity check, not a dependency.
3. **Latency literature says single step intents only.** Benchmarks show model calls for planning dominate agent latency, later steps run up to three times slower than early ones, and agents take two to four times more steps than needed. Design consequence: proposals must be atomic actions (one click, one reply box focus), never workflows. Probe A measures time to first action separately from per step time, because time to first action is the felt number.
4. **A precedent wrapper exists and we inherit its lessons.** OpenClaw's Codex harness wraps the same app server and learned the hard parts already: an idle watchdog that best effort interrupts a turn when the server goes quiet, disarmed by progress notifications. Glue spec addition: every flight gets an idle watchdog that auto interrupts a hung turn. Second inherited lesson: the app server can generate version pinned type definitions; regenerate them after any Codex upgrade so protocol drift cannot repeat our stale Spoon incident.

### Comprehensive pass (Exa), same day

Wider sweep across hosts, competitors, and integration ecosystems. Six deltas.

1. **Codex computer use is the Sky acquisition, and it is accessibility-first, not screenshot-first.** It reads the accessibility tree for semantic control, falls back to pixels and coordinates, and runs background virtual cursors through private window APIs so agents act on windows without stealing the user's mouse or focus. Reviewers call it the best computer use shipped anywhere. The cursor is visible, animated, and per agent. This is the exact spectacle the expressive tier wants, inherited for free.
2. **New make-or-break probe question: the plugin may not be reachable from the app server.** Computer use ships as a desktop app plugin; the documented CLI path (codex exec) cannot trigger it. Whether a turn started programmatically through the app server gets plugin access is unknown and now the first thing Probe A must answer. If it cannot, the handoff needs the desktop app as intermediary or the thesis narrows.
3. **Fast mode exists and changes the latency math.** A Cerebras hosted fast model (Codex Spark) is reported dramatically faster than default for simple tasks. Probe A should measure both default and fast mode; atomic single actions may be viable in the low seconds on fast mode.
4. **Real world constraints to preregister:** irreversible actions pause for approval under the permission file (per turn approval policy must pre approve within our declared scope or every flight stalls); Electron apps can grab focus and break the background illusion (Notion cited; Arc is Chromium and needs probing); custom canvas surfaces (Figma class) still miss about two thirds of small targets, matching our T8 and T9 evidence; the private API basis means an macOS update can break the host at any time.
5. **Claude computer use is now a real research preview (March 2026, API beta) but takes over the display or needs a virtual display.** That confirms the demotion: wrong shape for acting on the screen Dylan is looking at.
6. **The glue is mostly on the shelf.** A small ecosystem of app server SDKs already exists (Python, TypeScript, Node) with typed interrupt, steer, cancellation with event drain, inactivity continuation, and approval hooks. Adopt one instead of hand rolling JSON-RPC. Competitor scan found proactive desktop assistants (Ovo, Coworker, Castor, Clippy) but none doing destination level Tab autocomplete; the wedge holds. Ovo's trust ladder and teach-never-again feedback rules are worth stealing for V1.

## Scope decision, 2026-08-04 evening

Codex-internal targets are dropped from V1 entirely, per Dylan. The expressive tier drives other apps only. Rationale: Codex-internal carried the three hardest open problems (the host cannot drive Codex, the Claude fallback leg takes over the display, and exact in-Codex grounding), while Dylan's usage pattern means he is usually already in Codex, so the valuable expressive actions are on the other screen surfaces anyway. The ambient tier's existing codex deep link navigation is unaffected and stays: it is built, certified, and carries the V5-proven habitual signal.

Cascade: the Claude leg is removed from the ladder, not just demoted. Probe A drops the can-it-drive-Codex dimension and now tests only: app-server reachability of the computer use plugin, latency in default and fast mode, interrupt behavior, approval pre-approval, and Electron focus-grab behavior on Arc. Probe B's five ledger moments should be non-Codex in-app actions (the T8 and T9 class), since that is the expressive tier's whole target class now. If the trial shows Dylan repeatedly wanting in-Codex actions the tier cannot reach, that ledger evidence funds the workaround as a V2 decision.

## Final V1 shape, 2026-08-04 night: universal Tab, routed execution

This section supersedes the two tier framing above. Approved by Dylan.

**One pill grammar everywhere.** A single suggestion surface across all apps: the pill appears, names what will happen, Tab accepts, Escape kills, five seconds and it evaporates. The user never thinks in tiers. Some pills teleport (navigation), some pills do an errand while you watch (agent flight). Which one is invisible routing, not product surface.

**Routed execution, not a new executor.** The predictor emits a typed intent; the existing executor validator dispatches to the cheapest tool that fulfills it:

- Navigation intents (focus, activate, open, focus Codex task) route to the four certified native primitives. Sub second, verified, unchanged.
- A new fifth action type, agent_action, routes to a Codex computer use flight through the app server: plain language atomic intent, host supplies eyes and cursor, Escape maps to turn interrupt, idle watchdog auto interrupts hung flights.

This mirrors the host's own internal architecture (plugin first, computer use as fallback) and adds one enum variant plus one dispatch case to shipped code. Codex remains unreachable by the agent path by fact, and unneeded: going to Codex is always a navigation intent served natively.

**V1 discipline: exactly one agent verb.** Single click on a visible control in another app. No typing, no multi step, no forms. Every additional verb must be funded by ledger evidence of Dylan reaching for it. Complexity varies across versions, never inside V1.

**Build sequence, probe gated:**

1. Probe first (one afternoon, declared window, ambient runtime stopped): app server reachability of the computer use plugin, latency in default and Spark fast mode, interrupt kill behavior, approval pre approval, Arc focus grab behavior. This is the only step that can kill the design, so it runs before any glue.
2. Glue (three to five build days if the probe passes): agent_action schema variant, off the shelf app server SDK wired to turn start and turn interrupt, Escape watcher, intent prompt work. TDD, feature flagged, ambient runtime untouched.
3. First felt moment: a pill reading click Subscribe while focused in Codex, Tab, ghost cursor executes in the background app.

Estimated total: roughly ten days end to end from probe start, dominated by the trial week's schedule, not the code.

## Related

[[computer-use-autocomplete-v0-design-2026-07-31]] · [[computer-use-autocomplete-runtime-decision-audit-2026-07-30]] · [[computer-use-nap-v5-expanded-history-results-2026-07-30]] · [[personal-ai-context-learning]]
