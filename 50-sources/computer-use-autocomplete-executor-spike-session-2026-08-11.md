---
type: source
status: complete
created: 2026-08-11
updated: 2026-08-11
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - computer-use
  - macos
tags:
  - executor-spike
  - session-record
  - briefing
---

# Computer-use autocomplete: executor-spike briefing and session record, August 10 to 11, 2026

This note files the executor-spike conversation artifacts so the living spec's source chain closes: the briefing that superseded the deep-research report, the August 11 spike-session results that superseded the briefing's actuator choice, and the same-day toggle-map and Coasty decisions. Punctuation is lightly normalized (no em dashes per vault rule); wording is otherwise preserved. The builder's evidence record remains authoritative for exact numbers, manifests, and timestamps.

## Part 1: executor-spike briefing (2026-08-10)

Status of the deep-research report: superseded on architecture and sequencing. One discovery, one fatal flaw, one wrong premise.

- Discovery (stands): the codex-computer-use-mcp bridge. Direct launch of the bundled SkyComputerUseClient dies on Apple's responsible-process authentication; the bridge works because it routes through OpenAI's own signed codex app-server mcpServer/tool/call endpoint.
- Fatal flaw (conceded): the report treated the bridge as an executor. It is an actuator only (get_app_state, click, type_text, set_value, press_key); no model turn, no action planning. The missing planner loop is the project's one genuinely open component decision.
- Wrong premise (conceded): the report assumed greenfield. The existing product shell (Node/Hammerspoon runtime, pill, conditional Tab gate, observer, causal ledger, replay machinery, Haiku predictor at roughly 1.3 to 1.4 s median on text packets) was mid frozen trial. The Swift plus Python weekend rebuild was rejected: a working shell at zero forward cost beats marginal robustness. Falsifier attached: instrument for kCGEventTapDisabledByTimeout under future planner load; if it trips, port only the roughly 200 hot-path lines.

Decisions locked in the briefing, with reasons:

- Keep Haiku. No accuracy data on this packet format for other models, trial integrity, and the key insight that pre-consent prediction latency is not load-bearing: in an ambient HUD absence is invisible, and the suggestion races the user's decision (seconds), not their fingers (roughly 300 ms). Faster TTFT mostly buys interruptions at low-receptivity moments. The model question is adjudicable later offline via a pre-committed replay two by two: {Haiku, Flash} by {text, text plus frame}.
- Promoted instead: receptivity-aware triggering (roughly 30 lines). Completion events (sent, closed, finished) get a short-fuse trigger, the golden what-next moment. App activation gets a 5 to 8 second grace period suppressing push, because switching apps is itself intent. Raw idle is the weakest signal and gets a higher confidence bar. The pull hotkey stays live throughout.
- Screenshots stay off the ambient path, on sequencing grounds only (privacy is explicitly not a constraint for the user). The planner gets pixels plus AX at execution time via get_app_state anyway. Revisit pause-frames only if post-loop predictions feel context-starved; Arc will show it first because web AX is worst.
- Tier one corrected to actual usage: Arc, Codex, VS Code, Slack, not the report's Notes, iMessage, Finder. Spikes add two stable-AX control routes so failures diagnose cleanly ("bridge broken" versus "Arc is hard").
- Safety is product-owned at the MCP-client wire, not in prompts, and not MCP's destructiveHint metadata. Closed allowlist execution policy on resolved AX element identity: allow navigation, focus, scroll, search, drafting; block send, submit, publish, delete, purchase, confirm; a second Tab releases the exact blocked action; fail closed on unresolved identity; explicitly gate keyboard submits (Cmd plus Enter, Return in compose); gate decisions join the same get_app_state snapshot the planner acted from.
- Deterministic fast lane stays for focus-app, window, and Codex task; computer use handles multi-step completions. Log full tool trajectories; repeated successes are promotion candidates into the fast lane, so computer use doubles as fast-path discovery.

Architecture at briefing time: existing observer, history, and runtime feed a history-aware semantic predictor (Haiku); the pill is an exact promise of what Tab accomplishes; Tab starts a planner loop over bridge tools (Coasty as one-line-swap fallback actuator, its 82 percent OSWorld figure a vendor claim earning its slot by smoke test); stop at the consequential boundary; second Tab if submission is required.

The next experiment was a bounded executor spike, not a rebuild: disposable harness with zero hooks into product or ledger; bridge smoke test (state read plus one reversible action); Codex-as-planner probe under a one-hour hard timebox in an isolated CODEX_HOME seeded with the real auth.json so an auth failure cannot masquerade as a planner failure; fallback bake-off (Haiku-in-loop versus one stronger model, same routes); physical routes inside a two-hour excluded session with the frozen runtime paused and restarted after, because code separation is not causal separation; Escape kills the planner process group and in-flight call, reaps orphans, and writes partial trajectories to the ledger as their own state; routes: two control plus three real across Arc, Codex, VS Code, Slack, with Codex self-operation flagged for focus-contention risk.

Target: winning planner wired behind the existing pill in prototype mode by the following weekend, with a deliberately non-scientific felt verdict. Still valid from the report: the bridge discovery and its failure modes (config-disable bug, orphan helpers, macOS 15 plus requirement); Coasty as fallback; Chronicle, Coast, and Screenpipe being wrong-cadence for trigger-time context; macOS gotchas (Secure Input blocking taps, TCC restart after grant); the phase-two per-app fast-path appendix; and the prior-art landscape (Adsideo suggest-only; Coast and Attention Engineering same vision, memory layer only), with the differentiation remaining ambient prediction fused with one-keystroke execution at zero dismissal cost.

## Part 2: spike-session results (2026-08-11)

### Route and window outcomes

Windows 1 through 3 completed. Route 7, the Codex-as-planner turn through the app server (the free-planner path), died opaquely: the harness discarded the error details, so the true cause is unrecoverable. Two real harness bugs regardless: diagnostics get discarded, and Slack was read while backgrounded, giving the planner an 8-element menu bar instead of 279 elements, a starved prompt. The builder declined to call the fix small until a preflight proposal succeeds. Window 4 ordering puts the gate test (Route 7 class work) last because Escape ends any window by rule, so the gate test cannot cannibalize the other probes. One folded-in question for the foreground fix: whether axcli can read backgrounded apps at all; it can click them via process-targeted events, but if it cannot see them, background operation is half-off.

Two manual-trigger chords (Control Option Space) never arrived at the OS layer while the tap stayed alive and everything else ingested; inconclusive at the time, later matched to a known OS bug family (below). The morning pill no-show plus flash pair remains a real bug on the candidate fix list.

### Capability status after windows 1 to 3

One sentence: it can watch, suggest app switches, and, as of this session, click and scroll real things in real apps under supervision; it cannot yet do all of that together, on its own, live.

Proven working, tested on the machine:

- Live now (V0): watches activity, detects pauses, shows pills; Tab, Escape, and ignore all work; pills are app-switching only.
- Proven in windows, not live: reading any app's full UI (every element with names and positions, via axcli); real verified clicks and scrolls in Slack and Arc at 210 to 430 ms; clicking backgrounded apps without stealing the cursor (reads still need foreground); Haiku turning an intent like "open DMs" into the exact right click in about 2.7 s; full lab safety (pausable trial, marked windows, clean restarts, every action ledgered).

Built and tested synthetically, never run for real: the full chain (pause, rich pill, Tab, plan, clicks, done); the safety gate holding a Send-button click for the second Tab (window 4's job); rich semantic pills from real context (zero real examples yet).

Cannot do by decision: type on the user's behalf (v1 is click-only); touch anything consequential without the second Tab. Cannot do, not yet built: go live; the cutover machinery was rejected in review and needs a rebuild, the main gap between all pieces proven and living in it.

### Exa check 1: Codex computer-use integration

The exits hold. Official documentation states Computer Use cannot automate terminal apps or ChatGPT itself, so the self-control ban is vendor policy, not a bug. The CLI feature-request thread shows launch-context and signing fragility with no official headless contract; further issues corroborate env-injection failures and Homebrew-versus-bundled CLI splits. New finding: OpenAI has a GA computer-use API, the computer tool in the Responses API with gpt-5.4 and later, where the model returns batched UI actions and the harness executes them, explicitly supporting custom or MCP-based harnesses via normal tool calling. Their CUA-trained model could legally serve as the planner over axcli hands, pay per token. Shelved as a planner bake-off candidate after the felt week, not a plan change; Haiku already works.

### Exa check 2: app scope

Scope rule: anything whose UI appears in the accessibility tree, which is nearly every Mac app. iMessage works for visible recent chats (activate Messages, read tree, click the conversation row); old chats need typed search, which is v2 because typing is out in click-only v1. Proven: Slack and Arc, the hard Electron and web cases. Very likely, untested: Messages, Finder, Notes, VS Code. Resurrected surface: the ChatGPT and Claude desktop apps; the old ban was Codex's rule about its own host, and axcli carries no such rule, so they are back in scope, untested. Out: typed text (v1), consequential clicks without the second Tab (by design), and rare tree-less canvas or game surfaces.

### Exa check 3: platform risks on macOS 26.5

Two findings; the stack stands with no changes.

1. macOS 26 (Tahoe) has a known, unfixed bug family matching the vanished-chord symptoms exactly: Accessibility permission can go silently stale while the system reports it granted, with event taps quietly receiving nothing, and a documented race where a tap installs fine but never gets callbacks after re-signing or relaunch. Karabiner, BetterTouchTool, and Hammerspoon all ship detection-and-regrant workarounds. Candidate fix, list only: a tap health sentinel (tapIsEnabled polling, probe-tap permission check, Secure Input logging, auto-reinstall). A product whose hotkey silently dies is dead on arrival; the OS itself is now the suspect.
2. Apple laid groundwork in macOS 26.1 for MCP support inside App Intents: MCP-speaking agents could invoke apps' typed, declared actions (Notes already exposes 46 intents on disk) instead of clicking pixels. Today it is hack-grade only (headless execution needs dylib injection), so it is a watch item; when shipped, the planner gains a second sanctioned action type.

### Builder queue addition (verbatim intent)

Candidate fix list: add a tap health sentinel (tapIsEnabled polling plus probe-tap permission check plus Secure Input logging plus auto-reinstall); macOS 26 has known silent tap-death bugs, the likely root cause of the vanished manual triggers. Do not implement now; list only. Then: start window.

## Part 3: toggle map, Coasty decision, and laptop rule (2026-08-11)

Laptop rule: window open (agent physically acting, roughly 30 to 90 minutes, user present) means hands off except cued roles (Escape, permission popups, smoke keypress); input mid-route can change app state between the agent's read and its click or trip human-interference aborts. Everything else (fix passes, prep, diagnosis, rehearsals) is normal laptop use; the builder's terminal work is untouched by it and the live trial wants normal activity. None of the window failures traced to intermittent use.

Why not Coasty: what broke was click delivery, never seeing or thinking; Coasty replaces the entire stack to fix a thirty line problem, while axcli replaced exactly the broken part. Safety gate quality: the second-Tab gate classifies targets by provable identity, and axcli hands it OS-level facts like AXRadioButton#dms, while Coasty is vision-grounded, so "that is the Send button" is a model's claim about pixels, downgrading the gate from verifying to trusting, the exact thing the design refuses. Speed and cost: axcli clicks in 210 to 430 ms with zero model tokens per action; vision grounding costs a model call per action. Portability: the fresh-read invariant, wire gate, trajectory ledger, and pill all port onto axcli unchanged, while Coasty means adopting its loop, its overlay (which duplicates the pill), BYOK config, and OSS rough edges, and its 82 percent OSWorld benchmark remains an untested vendor claim. Where Coasty genuinely wins: tree-less surfaces (canvas apps, games) where pixels are all there is; it stays the documented fallback, possibly per-surface.

Bitter-lesson discussion, conclusion: ideologically pixels, practically tree now and pixels when cheap, with the gate staying identity-based either way. Pixels are universal and ride model scaling directly with zero code changes; the AX tree is a hand-designed intermediate representation that loses in the limit. Tempering factors today: the lesson's corollary says do not pay the general method's cost before scaling has paid for it; vision grounding today costs seconds and tokens per action versus microseconds and exactness for AX; and a scaling-pilled perception layer under a trust-based gate is a worse product than a scaffolded perception layer under a verifying gate for a tool that clicks Send buttons on real accounts. The scaling-pilled component was never the actuator but the planner: the model does all the understanding, and see tree, pick element, click is a thin general mechanism with no per-app code, so the eventual pixel swap is a perception-substrate change behind an existing seam. This mirrors the earlier Haiku-now-over-Gemini-later call: the reversible, works-today choice with the upgrade documented.

Toggle map: two explicit toggles plus one already flipped off. Toggle 1, planner: raw Haiku now at about 2.7 s; swaps are OpenAI's GA computer-use API, a stronger general model, Cerebras-class speed, or Coasty's packaged planner; behind the planner-selection seam; quality, latency, and cost only. Toggle 2, perception: axcli AX reads now; swap is vision and pixels; coupled consequence: the gate downgrade above, so the flip drags safety along. Toggle 3, typing: click-only v1 with set_value staged as the v2 vocabulary switch; the felt week decides. Coasty is a bundle sitting on both toggles plus the actuator, which is why it is the fallback, not a knob. Each toggle is testable offline before flipping live: planner via the bake-off on logged packets, pixels via the frames-versus-text two by two, typing via the felt week itself.

## Links

- [[computer-use-autocomplete-product-spec|Computer-use autocomplete: living product spec]]
- [[computer-use-autocomplete-expressive-tier-design-2026-08-04|Expressive-tier design]] (superseded by the above where in conflict)
- [[compass-cotypist-for-computer-use-stack-and-weekend-plan-2026-08-10|Compass: Cotypist-for-computer-use stack and weekend build plan]]
- [[personal-ai-context-learning|Personal AI context learning]]
