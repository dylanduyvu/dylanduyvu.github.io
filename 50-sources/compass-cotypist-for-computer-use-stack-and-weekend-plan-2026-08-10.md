---
type: source
status: raw
created: 2026-08-10
updated: 2026-08-10
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - autocomplete
  - runtime-architecture
  - executor-research
  - compass
---

# Compass: Cotypist-for-computer-use stack and weekend build plan

Imported in full from the Compass artifact Dylan supplied on August 10, 2026.
This is preserved as raw research evidence, not as an endorsed implementation
plan. Its time-sensitive product, model, latency, and integration claims still
require primary-source or local verification before use.

## Original report

# Cotypist-for-Computer-Use: One Opinionated Stack + Weekend Build Plan (verified August 2026)

## TL;DR
- **Build it — the concept is worth prototyping — but the single locked decision that will break is the Codex Computer Use piggyback as literally specified.** Driving the bundled `SkyComputerUseClient` binary directly (or via `codex exec`) does NOT work from third-party code: the signed helper SIGKILLs any parent process that isn't Codex.app (`Sender process is not authenticated`), and `codex exec` auto-cancels computer-use tool calls headlessly. The working path is the community `codex-computer-use-mcp` bridge, which routes through OpenAI's own signed `codex app-server` `mcpServer/tool/call` endpoint. Adopt that bridge as your executor; it's the same "piggyback" spirit and is the more robust foundation anyway.
- **Recommended stack:** thin custom Python watcher (idle via `CGEventSourceSecondsSinceLastEventType` + screenshot + frontmost app + rolling action log) → **Gemini 3 Flash / 3.5 Flash-Lite** predictor (~0.24–0.29s TTFT, vision-capable, cheap) → a **small Swift HUD+event-tap helper** (non-activating `NSPanel` + `CGEventTap`) driven from Python → **codex-computer-use-mcp bridge** executor, with **Coasty** as the ranked fallback executor. Chronicle and Coast are background/long-term memory, not trigger-time context.
- **Expect ~3–15s per executed action from the Codex bridge** (not the optimistic 10–20s/10-step figure once process spin-up is counted), and **a few cents to a couple dollars/day** in prediction API cost at hundreds of triggers/day. Speed is a Phase-2 problem; for the weekend, optimize for "magical when it fires," reversible actions only.

## Key Findings

### 1. The locked executor decision needs one surgical amendment (flagged dealbreaker)
The task specifies registering the Codex desktop app's bundled `SkyComputerUseClient` MCP helper directly and driving it via `codex exec "<accepted suggestion>"`. Research shows this exact mechanism is broken in two independent ways as of August 2026:

- **The signed helper enforces a launch constraint.** Calling `SkyComputerUseClient mcp` directly from any non-Codex parent initializes and lists the tool schemas, but real tool calls are rejected with `Computer Use server error -10000: Sender process is not authenticated`, and the OS SIGKILLs the process (`Code Signature Invalid` / "Launch Constraint Violation," openai/codex #21200). The helper requires its launching ancestor to be Codex.app.
- **`codex exec` can't drive computer-use headlessly.** In non-interactive `codex exec`, MCP tool calls are auto-cancelled because stdin is closed (openai/codex #24135), and the "Approval Policy: Never" setting means "never *allow* approvals," so computer-use elicitations fail immediately (#19554). Ignoring an elicitation hangs ~120s then times out. There is also no first-class CLI computer-use support (open feature request #20851).

**The working path** (and what to actually build against): the community bridge **`codex-computer-use-mcp`** (by tmustier; also on npm/pi.dev; fork by wousp112). It routes calls through OpenAI's own signed `codex app-server` via the documented `mcpServer/tool/call` endpoint — "no model turn is required" — launching the signed bundled binary under the official responsible-process/authentication chain "without injection, re-signing, TCC changes, private socket emulation, or credential extraction." It creates an ephemeral zero-turn context (`ephemeral: true`, `turns: []`) and runs the app-server with `approvalPolicy: "never"` + `sandbox: "danger-full-access"`, which auto-accepts empty-schema approval elicitations. It's a Node/TypeScript stdio MCP server; your Python orchestrator consumes it as an MCP client subprocess (`node dist/mcp-server.js`). Requirements: macOS 15.0+, Node 22+, ChatGPT.app at `/Applications/ChatGPT.app`, Computer Use component under `~/.codex/computer-use/`.

**The ten computer-use action tools** the helper exposes (cross-confirmed by tmustier's bridge and vtomnet's reverse-engineering of the binary): `list_apps`, `get_app_state` (screenshot + accessibility tree), `click`, `perform_secondary_action`, `set_value`, `select_text`, `scroll`, `drag`, `press_key` (xdotool-style names like `Return`, `Tab`, `super+c`), `type_text`. All carry `destructiveHint: false`.

**Stability caveat:** the July 2026 merge of Codex into the ChatGPT desktop app introduced a live breakage — launching ChatGPT Desktop rewrites `~/.codex/config.toml` to set the computer-use MCP `enabled = false` on startup (#34807, opened Jul 22 2026, macOS 26.5.2 / ChatGPT Desktop build 5718; still reproduced in #36461 on build 6119). The bridge sidesteps this by running its own isolated `CODEX_HOME`/app-server that doesn't inherit the user's broken shared config — another reason to use the bridge rather than the user's real Codex config. Requires macOS 15.0+ (helper crashes on macOS 14.x with a Swift-runtime symbol error; #18755/#22822). Orphaned `SkyComputerUseClient` helper processes leak and accumulate (7+ parented to PID 1; #29157) — your kill switch should reap them.

### 2. Watcher / context layer: build a thin custom watcher; treat Chronicle/Coast as long-term memory only
The 2-second-pause trigger requires INSTANT capture at pause time. Periodic summarizers cannot satisfy that:
- **OpenAI Chronicle** writes rolling ~10-minute Markdown summaries to `~/.codex/memories_extensions/chronicle/` (filenames like `2026-05-17T01-40-00-...-10min-memory-summary.md`, per #23124). Screenshots are processed on OpenAI's servers; the resulting text memories are stored locally **unencrypted**, and OpenAI's docs explicitly note "other programs on your computer can also access these files" — so third-party code CAN read them, but a 10-minute cadence is useless as trigger-time context. Chronicle requires Screen Recording + Accessibility, runs only on Apple Silicon (macOS 14+), is limited to **ChatGPT Pro subscribers paying "$100 or more per month,"** is **unavailable in the EU, UK, or Switzerland**, and "uses rate limits quickly." Greg Brockman (X, Apr 20 2026): "Chronicle is an experimental feature giving Codex the ability to see and have recent memory over what you see… Feels surprisingly magical to use." (Sam Altman likened it to "telepathy.") **Slot Chronicle in as optional background/long-term memory only.**
- **Coast** (Attention Engineering; Aidan Guo/@aidangch + Julian Windeck; local preview opened July 28, 2026) is an always-on screen recorder doing local inference on Apple's Neural Engine — "fully local memory for you and your agents." As of launch it's a consumer preview with no documented public third-party API/SDK; not usable as a programmatic trigger-time context source yet.
- **Screenpipe** (YC S26) is a mature local 24/7 recorder with a REST API on `localhost:3030`, SQLite, and an MCP server (`claude mcp add screenpipe`). It moved to a source-available Screenpipe Commercial License (paid for commercial use). Usable as a rolling action log, but heavy and not tuned for instant-at-pause snapshots.
- **ctxd** (keeprlabs; Apache-2.0; `brew install keeprlabs/tap/ctxd`, `ctxd onboard`) is a single-binary MCP-native shared-memory daemon that wires Claude Desktop/Code/Codex to one append-only event log, with a Python SDK (`pip install ctxd-client`) and eight MCP tools (`ctx_write`/`ctx_read`/…). It's a memory *substrate*, not a screen watcher — a nice optional place to persist your rolling action log so the executor's Codex can read the same context, but not required for the weekend.

**Verdict:** For the weekend, a thin custom watcher is faster to build and gives exact trigger control: poll `CGEventSourceSecondsSinceLastEventType` for 2s idle, then capture a screenshot (ScreenCaptureKit/`CGWindowListCreateImage`), the frontmost app + window title (`NSWorkspace` / Accessibility), and keep a rolling deque of the last ~20 user actions from your event tap. No dependency risk, no cadence mismatch.

### 3. Predictor: Gemini 3 Flash / 3.5 Flash-Lite is the fast vision-capable pick
The predictor must emit a one-line semantic-step suggestion in well under ~1s from screenshot + frontmost app + last-20-actions. Latest fast-tier benchmarks (Artificial Analysis / Galileo AI, mid-2026):
- **Gemini 2.5 Flash-Lite** (non-reasoning) is measured at ~**0.24–0.29s TTFT and ~393–410 tokens/s** (Galileo AI: "392.8 tokens per second with just 0.29 seconds to first token"); **Gemini 3 Flash** is described as near-instant TTFT; **Gemini 3.1 Flash-Lite** is multimodal and beats GPT-5 mini on latency head-to-head (Google reports ~180ms internal median first-token). These are vision-capable and cheap.
- **GPT-5 mini / nano** are consistently slower on TTFT in third-party tests (GPT-5 nano showed pathological reasoning-mode latency); not the pick for a latency-first loop.
- **Claude Haiku 4.5** is a fine vision-capable backup (Intelligence Index ~30), but on throughput it runs "roughly 100 tokens per second" — much slower than the Flash-Lite tier.
- **Groq/Cerebras** are the fastest raw-token providers but host open-weights only. **Cerebras runs Gemma 4 31B (multimodal, Apache-2.0, 256K context) at a record 1,851 output tokens/s** and "returns its first answer token inclusive of reasoning in 1.5 seconds" — the fastest vision-capable open option, at roughly Haiku-4.5-class intelligence. Consider for Phase-2 speed optimization; for the weekend, Gemini Flash's hosted vision + sub-0.3s TTFT is the easier win.

**Prompt shape:** system prompt defines the one-line grammar and reversibility constraint; user turn = frontmost app + window title + last-20-actions (terse text) + one downscaled screenshot. Ask for a single imperative line + a confidence token; suppress the HUD below a confidence threshold. **Use vision, but lean on the accessibility tree for text-heavy apps** (`get_app_state` already returns the AX tree) — AX text is faster and cheaper to reason over than pixels for Mail/Slack/Notes; keep the screenshot for spatial/visual apps and as a fallback.

### 4. HUD + input interception: small Swift helper (NSPanel + CGEventTap), driven from Python
- **Idle detection:** `CGEventSourceSecondsSinceLastEventType` is Apple's sanctioned API (per Apple DTS, vs. scraping `ioreg HIDIdleTime`). Poll it ~4×/sec.
- **Tab/Escape interception:** a **`CGEventTap` at `kCGHIDEventTap` head-insert** is the robust approach — it sees events before the focused app and can swallow them by returning NULL. This is exactly Cotypist's trick: intercept Tab ONLY while a suggestion is visible (the tap callback checks a "HUD visible" flag), otherwise pass Tab through untouched so it still indents/navigates. Escape is intercepted globally as the hard abort.
- **HUD:** a **non-activating `NSPanel`** (`styleMask: [.nonactivatingPanel]`, `level: .floating`, `becomesKeyOnlyIfNeeded = true`, `collectionBehavior: [.canJoinAllSpaces, .fullScreenAuxiliary]`) renders a small always-on-top pill without stealing focus — the user's frontmost app keeps the keyboard. This is the same primitive Coasty's overlay and Cotypist's ghost-text use.
- **Language choice:** `CGEventTap` is "a bit tricky from Swift" but far more reliable than Python bridges for the event tap and non-activating panel. Recommendation: a **~200-line Swift helper** that owns the event tap, idle polling, and the NSPanel, and talks to your Python orchestrator over stdio/JSON or a local socket. pyobjc/Quartz can do event taps directly, but the Swift helper is more robust and avoids Python threading/CFRunLoop pitfalls. **Avoid pynput** (it wraps NSEvent global monitors, which can't reliably swallow Tab). **Hammerspoon** (`hs.eventtap`, `hs.canvas`, `hs.host.idleTime`) is a legitimate fast-prototype path if you'd rather not write Swift, but it's a heavier dependency.
- **Known gotchas:** Requires **Input Monitoring** (`CGRequestListenEventAccess`) + **Accessibility** + **Screen Recording**; the app must be restarted after granting (TCC changes don't hit a running process). **macOS Secure Input** (triggered by password fields) blocks single-key event taps system-wide — detect it and gracefully suppress the HUD when active (Cotypist documents this exact failure). Unsigned/ad-hoc builds may fail when launched via Finder (Launch Services) but work from Terminal; a Developer ID cert resolves it.

### 5. Executor ranking (primary + fallbacks)
1. **codex-computer-use-mcp bridge (primary)** — best "magical, general" GUI executor on the user's Pro plan; uses OpenAI's own signed chain; exposes the 10 semantic tools. Risk: rides an experimental app-server API OpenAI can change; the July merge already broke the naive config path.
2. **Coasty (coasty.ai / github.com/coasty-ai/open-computer-use)** — the ranked fallback. Open-source, "State of the Art 82% OSWorld" CUA, vision-not-selectors, `/v1/predict` + `/v1/ground` (screenshot in, structured actions + (x,y) grounding out), an MCP server (`npx @coasty/mcp`), a `LocalExecutor` that drives your own screen, and an always-on-top pill overlay you could reuse. BYOK (OpenAI/Gemini/Groq/local/Ollama). Cleanest swap because it's a documented local REST/MCP API. (Its sibling `open-cowork` runs the whole loop with `pnpm desktop`, BYOK.)
3. **Anthropic computer use** — mature, well-documented, but cloud-VM-oriented; you'd wire your own local execution; slower to integrate for local desktop.
4. **cua (trycua/cua, "Cua-Driver") / UI-TARS / self-operating-computer / Open Interpreter OS mode** — viable open harnesses; more glue. Cua-Driver is explicitly harness-agnostic and works with local models.

**Per-action latency & reliability:** No primary benchmark exists for Codex computer use. A secondhand figure claims 500ms–2s vision inference per action and 10–20s per 10-step workflow, but that understates real end-to-end time once screenshot capture, AX-tree serialization, app-server spin-up, and (for the bridge) per-call process teardown are included; treat 10–20s/10-step as optimistic and **measure empirically** (the bridge sets a 180s request timeout). Known failure modes: stale screenshots making the agent stall "for minutes" in long threads (#22350); leaked helper processes (#29157). Because you're doing single semantic steps (1–4 actions), not long chains, you avoid the worst long-thread degradation.

### 6. Prior art / competitive landscape
- **Adsideo.AI** — the closest direct competitor: "ambient intelligence for your Mac," local LLM, "suggest the next useful action: follow-ups, fixes, files," approve-or-ignore, local-first, 14-day trial / private beta. This is your exact interaction grammar minus GUI execution — it surfaces suggestions but is pitched as suggest-not-execute. **Steal:** its "approve quickly or ignore, no interruption tax" framing. **Differentiator for you:** actual GUI execution of the suggestion via Tab.
- **Coast / Attention Engineering** — raised an uncapped **$1.25M pre-seed** (backers include Lukas Haas of Google DeepMind/Sequoia Scout, Marvin von Hagen & Felix Schlegal of Interaction, Silas Alberti of Cognition, Bryan Pellegrino of LayerZero, Village Global, Liquid 2 Ventures; founders Aidan Guo (19) and Julian Windeck (23); 5 employees). Stated vision is a "fully proactive" general desktop assistant built on "next action prediction" — Guo calls it a **"cursor for everything"** — i.e., *exactly your concept*. But as of July 28, 2026 they shipped only the memory layer (Coast local preview), "one layer lower" than the acting assistant. Most strategically threatening, but has not shipped the acting product; you can prototype the acting layer this weekend.
- **OpenAI Chronicle** — screen-aware memory for Codex, not a suggester; your memory substrate, not a competitor to the interaction.
- **Google Gemini for Mac** — as of July 29, 2026 added system-wide dictation + opt-in "screen-aware reasoning" (highlight content, ask Gemini to act, it rewrites/inserts at cursor), triggered by long-press Fn; floating non-intrusive UI. Pull-based (you ask), not ambient-push next-action prediction. **Steal:** the Fn-key summon as a model for your pull hotkey.
- **Apple Intelligence / Siri onscreen awareness** — context-aware, OS-integrated, narrow action surface gated to Apple apps; not a next-action executor.
- **Microsoft Recall / Copilot, Simular AI (Mac agent), EnConvo** — Recall is passive memory (Windows); Simular is a full task-driven Mac computer-use agent (not ambient-suggest); EnConvo is a launcher/assistant. None ship the ambient "predict + Tab-to-execute next semantic action" loop.

**Implication:** the concept is differentiated in one specific way — **ambient prediction fused with one-keystroke GUI execution and zero dismissal cost.** Everyone else is either suggest-only (Adsideo), memory-only (Coast, Chronicle, Recall), or pull-then-act (Gemini, Simular). That fusion is the magic to demo.

### 7. Glue / orchestration
Two-process architecture:
- **Swift HUD/input helper** owns the event tap, idle timer, and NSPanel; emits `idle_2s`, `tab_pressed`, `esc_pressed`, `pull_hotkey`; receives `show_suggestion(text)` / `hide`.
- **Python orchestrator** (single asyncio process): on `idle_2s` or `pull_hotkey` → capture context → call Gemini Flash → if confident, `show_suggestion`. On `tab_pressed` → spawn the codex-computer-use-mcp bridge call for the accepted step (as an MCP client subprocess) → on completion, `hide`. On `esc_pressed` → **hard abort**: kill the bridge/app-server process group and reap any `SkyComputerUseClient` children. State (rolling action log, current suggestion, HUD-visible flag) lives in the Python process; the HUD-visible flag is mirrored to the Swift tap so Tab is only swallowed when a suggestion shows. Use `asyncio.create_subprocess_exec` with `start_new_session=True` so Escape can `os.killpg` the entire executor tree instantly.

## Details — Recommended stack (the exact winners)
| Component | Winner | Why it beats alternatives |
|---|---|---|
| Watcher | **Thin custom Python watcher** (`CGEventSourceSecondsSinceLastEventType` + ScreenCaptureKit + NSWorkspace + rolling deque) | Only option with instant-at-pause capture; zero cadence mismatch; no external-dependency risk. Chronicle/Coast/Screenpipe are 10-min/heavy/paid and slot in as optional long-term memory. |
| Predictor | **Gemini 3 Flash / 3.5 Flash-Lite** (vision) | Lowest measured TTFT among hosted vision models (~0.24–0.29s), cheap, multimodal, beats GPT-5 mini on latency. Claude Haiku 4.5 is the backup; Cerebras Gemma 4 is the Phase-2 speed play. |
| HUD + input | **Small Swift helper: non-activating NSPanel + CGEventTap (HID head-insert)** | Only robust way to swallow Tab conditionally and render a focus-preserving pill. pynput can't reliably swallow keys; pyobjc works but is fragile on the runloop. |
| Executor | **codex-computer-use-mcp bridge** (fallback: **Coasty**) | The naive Codex piggyback is blocked by launch-constraint SIGKILL + headless auto-cancel; the bridge is the working, signed-chain path with the same 10 semantic tools. Coasty is the clean local REST/MCP swap. |
| Orchestration | **Swift helper + single Python asyncio process, executor in its own process group** | Clean kill-switch semantics; state centralized; Tab-swallow flag mirrored to the tap. |

### Estimated daily API cost
At hundreds of predictions/day with Gemini Flash-Lite–class pricing (~$0.30/1M input; screenshot ≈ a few hundred–1k tokens + short text context + one-line output): on the order of **a few cents to a couple dollars per day** for prediction. Execution via the Codex bridge runs on the Pro plan's included computer-use (no per-call API charge beyond the $200/mo Pro tier, though it "uses rate limits quickly"). Even at heavy trigger volume this stays in single-digit dollars/day — well within "unlimited budget."

## Recommendations (staged)

**Saturday AM — plumbing & the risky executor first (de-risk the load-bearing piece).**
1. Install ChatGPT/Codex desktop app, enable Computer Use, grant Screen Recording + Accessibility + Input Monitoring. Stand up the **codex-computer-use-mcp bridge** and confirm `list_apps` + a single `click`/`type_text` works end-to-end from a Python MCP client. **If this doesn't work within ~2 hours, swap to Coasty immediately** (`open-computer-use`, BYOK) — don't burn the weekend fighting it.
2. Build the Swift helper skeleton: idle timer + `CGEventTap` (log Tab/Esc) + a hardcoded NSPanel pill. Prove Tab is swallowed only when the pill is shown.

**Saturday PM — close the loop on Tier 1 apps.**
3. Wire the Python orchestrator: idle → capture (screenshot + frontmost app + action log) → Gemini Flash → show pill → Tab → bridge executes → hide. Implement Escape hard-abort with process-group kill and helper reaping.
4. Enable **Tier 1 surfaces first (highest predictability × executability):** Apple Notes, Finder, iMessage, and the ChatGPT/Claude desktop apps — text-centric, stable AX trees, reversible actions (open, navigate, draft, label). Land one genuinely magical demo (e.g., "⇥ draft reply 'sounds good' in Messages" — draft only, no send).

**Sunday AM — Tier 2 (web surfaces via Arc).**
5. Add **Slack, and Arc-hosted Gmail/Notion/Twitter** — higher value, slightly less predictable (web DOM via vision + AX). Keep to reversible actions (open thread, draft, label, navigate). VS Code is Tier 2.5 (predictable, but its own completions overlap).

**Sunday PM — polish the vibes.**
6. Add the **pull hotkey** (model it on Gemini's Fn-summon). Tune confidence gating so the HUD stays quiet unless it's likely right (interruption economics: ignoring must cost nothing). Add a menu-bar kill switch. Record the demo.

**Benchmarks that would change the plan:** if bridge per-action latency feels sluggish (>~5s) on Tier-1 apps in testing, either (a) restrict to single-action suggestions, or (b) start Phase-2 fast-path work early for your top 2 apps. If Gemini Flash suggestions feel generic, add the AX tree to the prompt before reaching for a bigger/slower model.

## Caveats
- **The naive Codex `codex exec` piggyback as written will not work** — this is the one locked decision that needs the amendment above (use the bridge). Everything else in the locked scope holds.
- **The bridge rides an unofficial/experimental app-server API.** OpenAI can break it (the July merge already broke the config path; the bridge itself flags "ChatGPT's reviewed component locations may change"). Keep Coasty wired as a one-config-line fallback.
- **Latency numbers are estimates.** No primary benchmark exists for Codex computer-use per-action latency; measure on your own machine before trusting any figure.
- **Coast is the strategic threat** — same "cursor for everything" vision, funded — but hasn't shipped the acting layer; that's your window.
- **macOS permission friction is real:** Secure Input can silently block your tap; TCC grants need an app restart; unsigned builds may need Terminal launch or a Developer ID cert; the helper requires macOS 15.0+.
- **Reversible-only for the demo** (drafts/opens/navigation/labels; no sends/deletes) is the right call — the executor can misfire, and Escape-abort plus reversibility is what makes a live demo safe.

## Appendix — Phase-2 per-app fast-path map (ranked by value-per-hour of integration)
Fast paths replace the slow screenshot→model→GUI loop with a direct API/script for that app. Ranked by (latency bought back) × (predictability) ÷ (effort):

1. **Apple Notes / iMessage / Finder → AppleScript / JXA** — highest value-per-hour. Native scripting dictionaries; create note, draft message, reveal/move file in milliseconds vs. multi-second GUI. Buys back ~3–10s/action; very reliable.
2. **Slack → Web API / deep links** — draft messages, mark read, open channel via `slack://` deep links + Web API. High value; OAuth setup is the main cost.
3. **Gmail (in Arc) → Gmail API** — draft/label/archive via REST instead of clicking the web UI. High value; OAuth + reversible-action scoping.
4. **Notion (in Arc) → Notion API** — create/append pages, update properties directly. Medium-high; clean API.
5. **VS Code → CLI (`code`) + command URIs** — open files/folders, run commands via `code --command`. Medium; overlaps with editor's own features.
6. **Twitter/X (in Arc) → limited API** — draft-only is cheap via intent URLs; full API is rate-limited/costly. Low-medium.
7. **ChatGPT / Claude desktop apps → mostly no clean API** — stay on computer-use here; fast paths are marginal.
8. **General website interaction in Arc → Playwright/CDP** — for browsing/clicking, a persistent Playwright context is far faster and more reliable than vision GUI; medium-high value but really its own executor lane (Coasty's BrowserExecutor already does this).

Each AppleScript/API path typically buys back **3–10 seconds per action** and removes a class of misfires (no pixel-hunting). The right Phase-2 order mirrors the ranking: AppleScript trio first (a few hours, huge felt-speed gain), then the OAuth web APIs (Slack/Gmail/Notion), then browser automation for general web.
