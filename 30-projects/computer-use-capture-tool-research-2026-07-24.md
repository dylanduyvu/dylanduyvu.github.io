# Computer-use capture-tooling deep survey, July 24, 2026

**Date:** 2026-07-24

**Source:** Claude deep-research run (multi-source survey; primary sources: GitHub repos, arXiv papers, official docs, vendor/Apple developer sources). Distilled conclusions live in [[computer-use-nap-capture-layer-v2-plan-2026-07-24|the capture layer v2 plan]].

## TL;DR

- **No single existing tool solves the multi-monitor + pre-action + accessibility problem out of the box** — every continuous recorder (Screenpipe, AgentNetTool, DuckTrack) either records only the main/cursor display or derives "pre-action" frames post-hoc, which is exactly the failure mode already hit. Best path: **mine code from OpenAdapt's `oa_atomacos` fork + `openadapt-capture`, build capture on Hammerspoon `hs.axuielement` (AXObserver) + ScreenCaptureKit per-display streams, and adopt rrweb inside the Arc extension for DOM ground truth.**
- **Adopt now:** rrweb (MIT) for browser DOM truth; `macapptree` (MIT) or `oa_atomacos` (MIT) as the macOS AX-tree/element-at-point extractor; Hammerspoon (MIT) for AXObserver focus/window/title notifications with window IDs; ScreenCaptureKit (native) for per-display continuous capture with per-frame presentation timestamps.
- **Reference design only (do not adopt):** AgentNetTool/OpenCUA (OBS-based, main-screen only, post-hoc state-action matching), DuckTrack (main-screen-only, self-flagged Retina bug), PC-Tracker, Microsoft Recall (Windows-only, but its event-driven + VBS-enclave privacy model is worth copying). Commercial data-vendor recorders (Scale/Mercor/Surge/Meta MCI) are **not available** to individuals — and Meta's MCI was paused in June 2026 after a data-security failure, a cautionary tale for local privacy design.

## Key findings

1. **The two hardest requirements — correct display attribution for negative-coordinate secondary monitors, and true pre-action (no-leak) screenshots of BOTH displays — are not met by any off-the-shelf continuous recorder.** AgentNetTool and DuckTrack record only the main screen via OBS; Screenpipe claims all-monitor capture but the measured accessibility and frame-timing gaps stand. The pre-action-context guarantee is only cleanly achievable by capturing live at decision time (as OpenAdapt does), not by backtracking through video (as OpenCUA does).
2. **The most reusable code is the OpenAdapt lineage.** AgentNetTool itself is based on DuckTrack and OpenAdapt and ships OpenAdapt's macOS accessibility fork (`oa_atomacos`), which wraps Apple's AXUIElement API via pyobjc and supports element-at-coordinates lookups — precisely the per-click element identity needed. `openadapt-capture` is the only recorder in this set that captures screenshots live and action-gated (`action.screenshot` = PIL image at time of action).
3. **Browser ground truth is a solved problem: rrweb (MIT) is the right tool** for DOM event targets, mutations, and navigations inside a Chromium extension. ~19.6k GitHub stars / 1.7k forks (Feb 2026); the most widely used open-source session-replay library, relied on in production by Datadog, New Relic, and Sentry. Complement with Chrome DevTools Protocol `Page.frameNavigated`/committed-`loaderId` events for exact URL-commit truth and `DOM.getNodeForLocation` for element-at-point.
4. **macOS-native building blocks exist and are well-maintained:** Hammerspoon's `hs.axuielement` and `hs.axuielement.observer` expose AXObserver notifications (focus, window/title changes) with window IDs; `macapptree` (MacPaw, MIT) dumps AX trees with bounding boxes and is actively used by 2025 research (GUIrilla, Screen2AX); ScreenCaptureKit provides multi-display capture with per-frame timestamps (with documented virtual-display and clock-epoch caveats).
5. **The commercial/vendor landscape offers reference designs but no reusable artifacts.** Meta's Model Capability Initiative, Scale/Mercor/Surge/Handshake, and Microsoft Recall do not publish their capture SDKs. Recall's architecture (event-driven snapshots, on-device semantic index, VBS-enclave encryption, app-exclusion lists) is the best-documented privacy-design reference.

## Details

### 1. Open-source desktop interaction recorders

**OpenCUA / AgentNet Tool (xlang-ai/AgentNetTool)** — *Reference design; mine post-processing logic only.*
- Captures: full-screen OBS video (2 fps keyframes), mouse/keyboard events, accessibility (Axtree) snapshots, HTML via a browser extension. Cross-platform (Windows, macOS, Ubuntu).
- macOS mechanics: screen capture via **OBS + obs-websocket** (`obsws-python==1.7.0` in requirements_macos.txt), not ScreenCaptureKit. Accessibility uses `oa_atomacos==3.2.0` + pyobjc; Axtree parsing follows the OSWorld framework. Official macOS docs require installing OBS.
- Multi-monitor: inherits DuckTrack's main-screen-only OBS source model; bundles `mss` and `screeninfo` (primary monitor). **No documented multi-monitor compositing.** No negative-coordinate handling.
- Pre-action context: state-action pairs are **derived in post-processing from the video** — for clicks they backtrack to the mouse's pre-movement phase and search backward for the last visually distinct frame. Offline extraction, not live capture; cannot guarantee both-display pre-action context.
- Standalone continuous use? No — task-scoped annotation-session software, not a background continuous recorder.
- License: MIT overall, but usage terms are research/educational — **treat as reference only for anything commercializable.** Maintenance: OpenCUA paper arXiv 2508.09123 (Aug 2025), NeurIPS 2025 spotlight; OpenCUA-72B hits 45.0% on OSWorld-Verified. The AgentNetTool repo itself: 5 commits, v1.0.0 (Aug 11 2025), ~52 stars.

**OpenAdapt ecosystem (OpenAdaptAI)** — *Mine code from; strongest reusable macOS capture primitives.*
- `oa_atomacos` / atomacos fork: wraps the Accessibility API via pyobjc; exposes AXUIElement role/title/position/size and **element-at-coordinates lookup**. MIT. Same code AgentNetTool reused.
- `openadapt-capture` (PyPI, MIT, pre-alpha, v0.5.2 Mar 17 2026): multi-process reader/processor/writer architecture; **action-gated video (frames encoded only when actions occur); each ActionEvent carries `action.screenshot` at time of action** — live pre-action screenshots, the wanted design. Stores `recording.db` (SQLite: events, screenshots, window events, perf stats) + mp4 + optional audio. Includes a `chrome_extension/` and browser bridge. Schema stores a single monitor width/height per recording (primary-monitor model) — needs extension for dual-display.
- Legacy screen-capture paths: `mss` for time-aligned screenshots (carries the known python-mss secondary-monitor/negative-coordinate pitfall, issue #49); AVFoundation path for hardware-accelerated video (issue #570 notes it lacked time-aligned screenshots).
- `openadapt-privacy`: PII/PHI scrubbing sub-package (MIT) — reusable for the privacy layer.
- Project pivot: flagship OpenAdapt now targets deterministic workflow replay (openadapt-flow); the monolithic recorder is frozen at v0.46.0 in legacy/. The capture pieces live in the modular `openadapt-capture` sub-package.

**PC Tracker (GAIR-NLP/PC-Agent)** — *Reference only.* Lightweight background recorder (keyboard/mouse + screenshots as state observations); open-sourced Dec 2024 (arXiv 2412.17589). Windows-centric; no documented macOS multi-monitor or per-click AX fidelity.

**Screenpipe** — *Keep for OCR/audio/search convenience only; cannot be the AX or pre-action source of truth.*
- Now under the screenpipe org (from mediar-ai), Rust, YC S26, MIT, ~19.3k stars (July 2026). Event-driven: listens for app switches, clicks, typing pauses, scrolling and captures a screenshot only on change, pairing screenshot + accessibility tree at the same timestamp.
- Relevant 2025–2026 DB work: batch accessibility-element inserts (#5042), redaction indexes (#5047), capture-write durability fixes (#5051). Open macOS multi-monitor reconnection bug (#1118, macOS 15.2).
- Local audit stands: 0/493 secondary-monitor clicks with AX role/name/bounds; ~43% click-linked frames equal-or-later.

**Other recorders:**
- **DuckTrack (TheDuckAI, MIT):** OBS capture of only the main screen (`get_monitors()[0]`); pynput input; no AX at record time. `obs_client.py` hard-codes a macOS Retina 2× hack with an inline TODO admitting external displays may break — the clearest documented multi-monitor hazard in this lineage. Not a fit; read `obs_client.py` to understand the Retina trap.
- **Cua (trycua/cua, MIT, ~14k stars, very active):** actuation/eval stack for agents (background macOS driver, Lume VMs, benchmarks), not a human-demonstration recorder. Reference for background AX/CGEvent handling.
- **Bytebot / Open Interpreter / AgentSea / Simular Agent S / UI-TARS:** agent-execution frameworks or VM sandboxes; none provide a macOS multi-monitor human-capture layer worth reusing.
- **Captr_MacOS (anaishowland):** small solo research recorder — keyboard/mouse, OBS screen video, Chromium DOM snapshots, macOS AX trees. Near-exact feature match but OBS-dependent (main-screen bias) and unmaintained. Mine its DOM+AX pairing approach; don't depend on it.

### 2. macOS-native capture building blocks

- **Hammerspoon (`hs.axuielement`, `hs.axuielement.observer`, `hs.window.filter`, `hs.eventtap`) — MIT.** AXObserver subscriptions for AXTitleChanged, focus changes, window events with window IDs; element-at-point queries. Most direct route to the resulting semantic destination. Mature (CommandPost builds on the same module).
- **`macapptree` (MacPaw, MIT):** dumps an app's AX tree to JSON with roles/names/values and bounding boxes plus segmented screenshots; used by GUIrilla (arXiv 2510.16051) and Screen2AX (arXiv 2507.16704). Runs per-app; macOS 13.2+.
- **`oa_atomacos` (MIT):** pyobjc AXUIElement wrapper with element-at-coordinates — best per-click element lookup.
- **Design note (mcp-server-macos-use):** the useful signal after an action is often the AX-tree *diff* (before vs after), not the whole tree — relevant to segmentation/verification design.
- **ScreenCaptureKit (native, macOS 12.3+):** per-display `SCStream` with `SCContentFilter`; each sample buffer carries a presentation timestamp and `.displayTime` attachment. Caveats: documented confusion with virtual/DisplayLink displays; **PTS/`.displayTime` are in a different clock epoch than `CACurrentMediaTime()`** (Apple-confirmed) — align clocks manually; DisplayLink USB displays may not be capturable. Rust (`screencapturekit-rs`) and Swift CLI (`SwiftCapture`) wrappers exist. **One SCStream per display** (not the all-displays bounding box) is the cleanest way to get correct per-display attribution and dodge negative-coordinate compositing bugs.
- **Input capture:** CGEventTap is the right primitive; Hammerspoon's `hs.eventtap` wraps it. Resolve the display per event via NSScreen/CGDisplay geometry rather than trusting a recorder's single-monitor assumption.

### 3. Browser-side ground truth

- **rrweb (rrweb-io/rrweb) — adopt. MIT.** Full initial DOM snapshot + incremental mutations + user interactions with unique node IDs; `record.addCustomEvent()` for custom semantics on the same timeline; masking/blocking of sensitive fields at capture time; official `web-extension` package for Chromium. Production users: Datadog, New Relic, Sentry. Caveats: primarily records the active tab/document; some sites block it — validate on the real Arc workload. (Browserbase deprecating its *hosted* rrweb replay API is about their product, not the OSS library.)
- **Chrome DevTools Protocol (via `chrome.debugger`) — complement.** `Page.frameNavigated` / committed `loaderId` for exact committed-URL truth (same-document vs cross-document); `DOM.getNodeForLocation` for node-at-coordinate with owning frame; `DOMSnapshot.captureSnapshot`; Target/Page domains for window/tab/frame IDs; experimental Accessibility domain.
- Playwright trace internals: same CDP primitives, automation-oriented — reference only. Mind2Web / WebLINX / WebArena tooling: web-only annotation/benchmark schemas — reference. PostHog / OpenReplay / Sentry replay cores are largely rrweb-based — no advantage over rrweb directly.

### 4. Industry / commercial landscape

- **Meta Model Capability Initiative (announced Apr 21 2026):** tracking software on US employees' machines capturing mouse movements, keystrokes, and occasional screenshots on a defined list of work apps (internal messages name Gmail, Google Chat, Metamate, VS Code, plus Google, LinkedIn, Wikipedia), feeding AI training; CTO confirmed no opt-out. No public SDK or architecture. **Paused ~June 22 2026 after a data-security failure** — reporting described sensitive material (private conversations, performance data, transcriptions; in one case personal tax and medical records) becoming accessible company-wide, with earlier reporting that data was stored without encryption. Lesson: encrypt-at-rest and permission-gate any continuous capture from day one.
- **Data vendors (Scale/Outlier, Mercor, Surge, Turing, Handshake, Invisible, Mechanize, Fleet, Prime Intellect):** sell RL environments and human-data services, not recording software. Prime Intellect's Environments Hub + `verifiers` library + `prime` SDK are the only publicly reusable artifacts — RL-environment scaffolding, not desktop capture. Mercor valued at $10B (Oct 2025); these vendors have their own incident history (Meta paused work with Mercor after a LiteLLM supply-chain breach).
- **Microsoft Recall / Click To Do (Windows-only) — privacy reference:** event-driven snapshots of the active window; on-device OCR + semantic index + vector DB; VBS-enclave encryption gated by Windows Hello; app/website exclusion lists; DRM/InPrivate exclusion; opt-in, local-only. Copy the privacy architecture and event-driven capture model.
- **Rewind/Limitless:** Rewind acquired by Meta (Dec 2025); local Mac recorder shut down (export window closed late Dec 2025). Teardown showed ScreenCaptureKit with window-level filtering/recompositing. Not a fit.

### 5. Academic capture infrastructure

- **Stanford Screenomics:** open-source privacy-aware continuous capture, but current platform is Android-only. **CC BY-NC 4.0 — non-commercial; do not incorporate.** Design reference for privacy-aware sampling cadence.
- **"How Do AI Agents Do Human Work?" (arXiv 2510.22780, CMU/Stanford, Oct 2025):** releases a workflow-induction toolkit (github.com/zorazrw/workflow-induction-toolkit) that induces structured workflows from captured human/agent activity — relevant to natural-action segmentation, operates on already-captured activity.
- **GUIrilla (MacPaw, arXiv 2510.16051) + macapptree:** strongest recent macOS AX-fidelity artifact; the AX extraction code is directly reusable. Accessibility-driven crawler, not a human recorder.
- GUI-World / AGUVIS / OS-Atlas: dataset/model pipelines; capture tooling not the reusable part.

## Recommendations (staged)

**Stage 1 — adopt immediately:** (1) rrweb in the Arc extension + CDP committed-navigation/element-at-point — replaces hand-rolled DOM capture; fall back to targeted listeners + CDP if rrweb's per-tab limits or overhead bite. (2) `oa_atomacos` element-at-point + `macapptree` tree dumps — replaces the missing secondary-monitor AX (the 0/493 gap).

**Stage 2 — build the capture core on native primitives:** (3) one SCK `SCStream` per physical display with PTS/`.displayTime` per frame — replaces NAPsack's cursor-only buffer; gives both-display pre-action frames; fallback to `screencapturekit-rs` or CGDisplayStream if clock-epoch/virtual-display issues prove intractable. (4) Hammerspoon AXObserver + window filter + eventtap with per-event display resolution — replaces custom semantic-destination and provenance capture. (5) Adopt `openadapt-capture`'s action-gated screenshot pattern, driven from the two-SCStream buffer, so both displays snapshot at the decision point strictly before the action.

**Stage 3 — privacy & keep-as-is:** (6) `openadapt-privacy` for scrubbing; copy Recall's privacy model (exclusion lists, local-only, secure-by-default); encrypt-at-rest from the start. (7) Keep Screenpipe only for OCR/audio/search convenience and app/URL metadata; track its accessibility-element DB work in case fidelity improves.

**What stays custom:** natural-action segmentation, zero-silent-loss accounting, blind-labeled fidelity scoring. Read the workflow-induction toolkit for segmentation ideas.

**Licensing bottom line:** rrweb, macapptree, oa_atomacos, openadapt-capture, openadapt-privacy, Hammerspoon, Cua, Screenpipe — all MIT (commercial-friendly). ScreenCaptureKit is Apple-native. **Flags: Screenomics is CC BY-NC 4.0; OpenCUA/AgentNetTool is research/educational-use — reference designs only, no code incorporation.**

## Caveats

- Multi-monitor/negative-coordinate traps are documented in the lineage to mine from: DuckTrack's Retina 2× hack; `mss`-based paths hit the known secondary-monitor bug; SCK has virtual-display confusion and a clock-epoch mismatch. Mitigation: per-display SCStreams + own display-geometry resolution.
- AgentNetTool's per-click AX behavior is inferred from requirements files, README, and the paper — its backend source wasn't fully readable; hence reference-not-adopt.
- rrweb records primarily the active tab; validate against the Arc workload.
- `openadapt-capture` is self-described pre-alpha (~5 stars) — code to mine, not a dependency to pin.
- Meta MCI / vendor details come from press reporting (Reuters, CNBC, Business Insider, Quartz), not primary technical docs — directional, not architectural.

## Related notes

- Plan: [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Capture layer v2 plan and spike sequence, July 24, 2026]]
- Build log: [[computer-use-nap-build-log|Computer-use NAP build log]]
- Earlier survey: [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
