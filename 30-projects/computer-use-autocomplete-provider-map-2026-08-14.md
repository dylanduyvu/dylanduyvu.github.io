---
title: Provider map, per stack part
type: research
created: 2026-08-14
method: Exa web search + page fetches, 2026-08-14. Each entry carries its source claim date; availability is as-reported by cited pages, not tested by us.
used-by: blog-post-structure.md (sec 7, sec 9), blog-post-skeleton.md
---

# Provider map (as of 2026-08-14)


[LINK FILL 2026-08-15: all seventeen draft placeholders filled. From this map: coast.app, pieces.app, usenocta.app, opencua.xlang.ai, github.com/TongUI-agent/TongUI-agent, cua.ai, getcovalent.co. Verified fresh by web search this pass: screenpi.pe (Screenpipe), arxiv.org/abs/2603.05923 (NAPsack, the paper), scribe.com (Scribe, moved from scribehow.com), openadapt.ai, inductionlabs.com/news/scaling-video-pretraining (Photon-1 announcement), github.com/bytedance/UI-TARS, tzafon.ai/blog/northstar-cua-fast (Northstar release post), platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool (Anthropic), adsideo.ai, autocomputer.ai, github.com/xlang-ai/VideoAgentTrek. Remaining sub-item: archive.org snapshots for the two fragile sec 2 links (the OpenAI forum thread and the tweet) need a save action from a browser or web-enabled agent; not fabricated here.]

## Predictor (Dylan's priority: callable models trained on computer-use video)

**Video-native frontier, private:**
- FDM-1 (Standard Intelligence, announced 2026-02-23, si.inc/posts/fdm1). 11M hours of screen recordings; IDM trained on 40k contractor-labeled hours used to auto-label the corpus; video encoder ~2 hours of 30 FPS video in 1M tokens (verifies our long-context figure). Output space: keypresses + mouse deltas; no chain-of-thought, "keeps inference low-latency" (qualitative). Availability: no API, pricing, or weights per closest coverage (lilting.ch 2026-02-26, "demo and announcement stage"). NOTE: our "11 ms screen-to-action" figure did NOT surface this pass; one secondary explainer (digitalapplied.com) describes a speculative 100-300 ms API pattern. Treat 11 ms as unverified.
- Photon-1 (Induction Labs, 2026-07-23). 106B-A5B MoE "imagination model"; 575M frames at 1 fps = 552B tokens = 18 years of video; next-latent pretraining, then <35k trajectory SFT + RL. Availability: "No weights, no API, no license — a research result" (marktechpost 2026-07-26). Matches our July 30 review claim.

**Video-mined, open and callable (closest to "vLLM models trained on computer-use video"):**
- TongUI 3B/7B/32B (AAAI 2026). VLA models trained on GUI-Net-1M mined from web tutorial videos. HF weights, vLLM-servable, OpenAI-compatible calling. github.com/TongUI-agent/TongUI-agent.
- VideoAgentTrek (xlang). 39k YouTube tutorials -> 1.52M interaction steps via open inverse-dynamics pipeline; video-pretrained agent models on HF; OSWorld-Verified 15.8.

**Trajectory-trained, open weights:**
- UI-TARS (ByteDance Seed): UI-TARS-1.5-7B open (2025-04), 72B-SFT/DPO on HF; UI-TARS-2 (2025-09, report). OSWorld 42.5 (1.5).
- OpenCUA 7B/32B/72B (xlang): OSWorld-Verified 45.0, open SOTA; trained on AgentNet (22.5k human tasks). opencua.xlang.ai.
- Northstar CUA Fast 4B (Tzafon, 2026-03-16): Apache-2.0 weights AND hosted OpenAI-compatible API (api.tzafon.ai), GUI-RL (GRPO), <$1/M tokens, Lightcone harness OSS.

**Hosted fused computer-use endpoints (predictor as a service, you execute):**
- Gemini Computer Use / Interactions API: Gemini 3.6 Flash recommended, 3.5 Flash-Lite low-latency; browser/mobile/desktop environments; per-action intents; safety decisions. ai.google.dev/gemini-api/docs/computer-use. Lineage note (verified 2026-08-14): computer use began as a dedicated model (gemini-2.5-computer-use-preview) and became a built-in tool of the general Flash line from 3.5 Flash onward (Google blog 2026-06-24). Gemini 3.7 Flash (GA 2026-08-13, half of 3.6's introductory price, 1M context) lists computer-use preview support on its enterprise model card; the AI-dev supported list still names 3.6 and lags the release. So the hosted tier is now general models carrying a CU tool, not dedicated CU models. Resolves the field-chatter verify flag for 3.7.
- OpenAI computer use (Responses API); Scrapybara ships first-party support.
- Anthropic computer use (already in record: callable, custom tools, docs warn on interactive latency).
- Platform-vendor note (partially fills the declared OS-vendor gap): Gemini Spark, Google's 24/7 personal agent for AI Pro/Ultra subscribers, runs on 3.7 Flash as of 2026-08-13 and "takes action on your behalf while under your direction." Instructed, not ambient.

**Commercial realtime autopilot (behavior-cloned from recordings):**
- Ace / ace-control-small and -medium (General Agents, generalagents.com/ace). Trained on staff screen recordings + mouse/keyboard events, 1M+ tasks; markets an "Action Prediction Latency (ms)" chart (numeric values render in-chart, not in page text) and "superhuman time"; desktop autopilot product; custom enterprise agents by contact. Closest living relative of our product concept; instructed tasks, not ambient prediction.

**Latency direction (the sec 9 third mention):**
- Thinking Machines "interaction models" VERIFIED: research preview 2026-05-11 (thinkingmachines.ai/blog/interaction-models). TML-Interaction-Small, 276B MoE / 12B active, 200 ms micro-turns, interaction + async background dual model, 0.40 s turn-taking (self-reported). Availability: selected partners only, wider release "later in the year." Conversational multimodal, not CU-specific; cite as architecture direction, not a CU product.

## Recorder

**Passive capture -> structured, local:**
- activity-frames + nocta-recorder (usenocta.app, macOS, local): compiles screen + a11y tree + input events into deterministic "activity frames" and replayable a11y-grounded routines; MCP tools; two-tier measured/inferred contract. Closest surfaced thing to "verified state-to-action rows" for recurring work. Investigate before the draft repeats "none produces verified rows."
- OpenAdapt (openadapt-capture / desktop / privacy / ml): continuous capture, PII scrubbing, gated egress, training runtime.
- Screenpipe (already in record; current positioning: 24/7 screen + audio, OCR to local SQLite, MCP server for agents).

**Commercial passive recorders shipped as memory products (added 2026-08-14 on Dylan's catch):**
- Coast (Attention Engineering, coast.app): "an always-on screen recording app that runs secure, local inference on Apple's Neural Engine." Local preview opened 2026-07-28. Coverage framing: the "cursor for everything" pitch narrowed to the memory layer first, building the personal data store before an assistant that acts. Third-party corroboration of the sec 7 market pattern. Previously in the map's market column only; also a recorder.
- Pieces (pieces.app): background memory app, forms memories every 2 seconds from the apps in use, local storage, MCP server into Claude/Cursor/Codex.

**Session/annotation capture for training data:**
- OpenCUA AgentNetTool (cross-platform; video + events + axtree; built on DuckTrack + OpenAdapt).
- ocap / Open World Agents (Windows; OWAMcap nanosecond-aligned video+events; feeds D2E vision-action pretraining).
- Computer-Use-Recorder (gmananya, 2026-05; Windows research: UIA trees + browser DOM per task).
- computeruse-data-collection (bobcoi03; simple local-first JSONL + MP4).
- NAPsack, Scribe (already in record).

**Video -> actions (inverse dynamics availability):**
- VideoAgentTrek Video2Action: OPEN inverse-dynamics models on HF (ScreenFilter, IDM-s1-7B, IDM-s2-7B). Overturns sec 9's "nobody ships it as a tool" as absolutely stated; accurate version: shipped as open research code, not as a maintained product.
- screen-recorder-analyzer (OSS; Whisper + OCR + LLM extraction; self-describes screen-to-action extraction as a novel task with no benchmark).
- FDM-1's IDM: internal only.

## Executor

- Cua Driver (cua.ai, MIT, macOS/Windows/Linux): agents connect over MCP/CLI; window-targeted input WITHOUT moving the system cursor; background operation; snapshots; used by Hermes, Clicky, H Company, Factory Droid. Directly relevant to our "background clicks fail / fell back to raw primitives" story; as of today an outsider would likely start here instead of raw axcli.
- Cua Sandbox: VM/container control SDK (mouse/keyboard/screen/shell), local (Docker/Lume/QEMU) or cloud.
- Scrapybara: hosted virtual desktops + Act SDK.
- Simular Sai (Mac product, private remote VM), UI-TARS Desktop (local app), Ace (drives the real desktop): product-level executors, not primitives.
- Sealed set unchanged from record: Codex helper, Coasty endpoint, macos-use; Anthropic callable but latency-disqualified.

## Interaction

- No off-the-shelf ambient pill/preview provider surfaced. Templates remain Cotypist / Cursor ghost text. Ace and UI-TARS Desktop ship their own task UIs, not ambient autocomplete. Consistent with sec 5/7: baseline solved by template, preview ideal is new design work.

## Claim impacts (Dylan's calls)

1. Sec 7 predictor bullet re-scoped (applied 2026-08-14): video-native frontier private (holds); open action-trained models exist and are callable; none is trained on passive personal history for ambient next-action prediction. Bottleneck 2 survives with sharper wording.
2. Sec 9 shared primitive: revise "nobody ships it as a tool" -> shipped as open research code (VideoAgentTrek), not a product. PENDING Dylan.
3. FDM-1 "11 ms screen-to-action": unverified this pass; replace with the qualitative low-latency design claim or find the SI source before draft. PENDING Dylan.
4. Thinking Machines: verified, partner-only; cite with date and self-reported caveat. APPLIED to verify marker.
5. Recorder "none produces verified rows": softened to open-question wording with an activity-frames check item (applied 2026-08-14).
6. Executor: Cua Driver mentioned as an as-of-today note in sec 7 (applied 2026-08-14); sec 8's axcli story stays scoped to the build window.
7. (Second pass) "Nobody ships ambient next-action prediction" broke within a day. Accurate version: a first wave ships or markets pieces of the ambient loop; none verified at click-grain ambient prediction from passive history. Applied to sec 7 in both files. Verify Covalent's shipped behavior before the draft leans on it.

---

# Second pass (2026-08-14, seven further queries after Dylan's comprehensiveness challenge)

**Recorder, commercial memory tier (class confirmed):** Rewind.ai (now Limitless; macOS, active-window capture, cloud), Microsoft Recall (Windows, Copilot+ hardware, local), Granola (meetings, macOS, cloud), OpenRecall (OSS, cross-platform, screenshots + OCR), Infinite Recall (OSS, macOS, fully local; fork of Omi by Based Hardware). All are capture-and-search memory products; none produces state-to-action training rows. Consistent with sec 7's open-question wording.

**Recorder/executor, workflow-demonstration tier:** Scribe (capture to docs plus agent context via MCP; on-screen walkthrough guidance). Tango (browser: records a demonstrated workflow, then EXECUTES it: autofill, click, type, tab-switch, with click-level user control and approval). Tango is a demonstrate-then-replay executor with a human gate: the closest shipped thing to the pill's click-grain control, but for pre-demonstrated routines, browser-scoped.

**Executor, browser tier (absent from the first pass):** Browser Use (OSS agent framework, MCP server, 45+ actions), Playwright MCP (official, accessibility-snapshot based), BAP (thin execution protocol over Playwright; 10-25 ms per action; semantic selectors; deterministic replay), Stagehand (bundled LLM plus execution), Browserbase (hosted browser infrastructure). Browser-scoped, not desktop-wide.

**Executor, OS vendors: NOT SEARCHED this pass.** Microsoft Copilot actions and Apple Intelligence App Intents are the known platform direction. Declared gap; verify only if the post leans on them.

**Predictor, video-native tier re-confirmed as two companies:** the neolab query returned only FDM-1 and Photon-1 (plus VideoAgentTrek). Added precision: FDM-1's post critiques VideoAgentTrek (screenshot-action-CoT triplets, no video context); VideoAgentTrek's base model is Qwen2.5-VL-7B; its 39k videos are 7,377 filtered GUI hours; FDM-1's eval infrastructure runs 80,000 forking VMs at over 1M rollouts per hour.

**Predictor, grounding sub-tier (from already-returned UI-TARS comparison tables, not newly searched):** Aguvis, OS-Atlas, ShowUI, UGround, CogAgent: open element-grounding and agent models, screenshot-trajectory class.

**Direct relatives (the important find):**
- Covalent (getcovalent.co; private beta, Mac; third-party coverage 2026-03-12; full landing page fetched 2026-08-14): OS-wide TEXT Tab autocomplete (Option+Tab accept, Esc dismiss, local, personal voice) PLUS prompt-less ambient action suggestions executed in one click (create the ticket, post the update, draft the email; the demo also suggests developer commands, e.g. run cargo test against named files, read from screen context), built on a local knowledge graph and screen reading. Positioning: "Built for PM work." Tagline: "Your next task, already done." No claim of training on behavioral history; "learns your patterns" is the whole claim. Task-grain ambient prediction, shipping in beta. Supersedes Ace as the closest living relative of this design. NAME COLLISION: their hero demo is "Reply to Sarah: Confirm availability for tomorrow's meeting at 5pm"; our sec 6 example pair uses "Hi Sarah" and Thursday's meeting. Rename our example's recipient before draft so the pair does not read as borrowed.
- AutoComputer (YC): desktop RPA. Prompt-seeded; then it predicts keystroke and click sequences that the user accepts one keystroke at a time, with granular correct/reject. The pill's accept-loop, for instructed tasks.
- Ria (joinria.com): desktop copilot; markets next-step prediction plus execution; thin public detail.
- Adsideo (detail upgrade): ambient local-LLM suggestions you approve or ignore; no execution. Ambient prediction without hands.
- TypeTab (Muvon; launched 2026-06-01; $49 one-time): system-wide on-device TEXT autocomplete for the Mac; ghost text; Tab takes a word, Ctrl+E a line. A living Cotypist-class peer for sec 6's comparison.

**Field chatter (2026-08-14, X thread by @yacineMTB, "What's the fastest computer use model out there right now?", 18.1K views; all entries unverified word-of-mouth):** names raised: deepseek v4 flash 0731 (used in Codex or Hermes), Gemini 3.7 Flash (newer than this map's 3.6 note; verify), gemini-3.1-flash-lite, SWE 1.7 (Cognition) with an open computer-use MCP, GPT-5.6 Sol Ultrafast (faster variant of our V5 model; verify), Nemotron-3.5-lightning (open source, 30B-A3B, 300+ tok/s claimed), "Hark handoff" (noise only, no benchmarks per the thread itself). The load-bearing observation, from @JustinWaugh: no one publishes a computer-use speed pareto or tracks actions per second; he has seen no benchmarks. Candidate one-line texture cite for sec 9's third mention: the field is asking the latency question today, and nobody has the measurement.

---

# Third pass (2026-08-14, OS-vendor recorder, after Dylan's find; method note: Exa not connected in that session, WebSearch/WebFetch used)

**Recorder, OS-vendor tier (new; partially fills the declared OS-vendor gap on the recorder side):**
- OpenAI Computer History (launched 2026-08-13, the kill day; macOS ChatGPT desktop app plus a Codex plugin; docs: learn.chatgpt.com/docs/customization/computer-history; coverage: thenewstack.io/openai-chatgpt-computer-history/, published 2026-08-13). Opt-in and off by default, per user; Business and Enterprise members need an admin grant first; requires Memories; not available with an API key or Bedrock. Records interaction events from allowlisted apps and websites: clicks, typing, keyboard shortcuts, app switches, macOS accessibility context. Does not record screenshots, screen video, microphone, or system audio; private browsing is never included; pause and resume from the menu bar. Raw event files stay on-device up to 48 hours; compiled into local Markdown memories at $CODEX_HOME/memories/extensions/skysight/. OpenAI's wording: "does not retain those event files after processing unless required by law and does not use them for training." Docs warn it "increases the risk of prompt injection from content in apps and websites." Observation only: no prediction, no execution, no public API documented (supported access is the Codex plugin; the local files are a private format). EEA, UK, and Switzerland rollout delayed at launch.
- First local sample (Dylan's Mac, enabled 2026-08-14; inspected by the prior session that day; this session confirmed only that the skysight memories directory exists): 140 events across 11 apps in the first hour, near-real-time; exact typed text and field values present; 2 of 55 clicks carried a nonempty identifier; no screen coordinates; events arrive out of order with 1-second timestamps, so sort by event id.

**Claim impacts (third pass):**
8. Sec 7 recorder bullet: OS-vendor tier now exists. Applied 2026-08-14 in both files. The insufficient-not-absent framing survives and strengthens: an OS vendor now ships capture-to-memory, and still no verified before-state to next-action rows, no outcome feedback, and a 48-hour raw horizon.
9. Sec 9 Gap 1: corroboration bullet applied. The complementarity note gains a live example: raw capture commoditizes, curation and verification remain the gap.
10. Market paragraph: candidate clause (OpenAI joins the memory-first move on the kill day). PENDING Dylan.
11. Timing texture for the draft: Computer History launched the day the project was killed. PENDING Dylan.

---

# Fourth pass (2026-08-14, Computer History deep dive; method: Exa restored, two searches plus one full docs fetch; local raw-file verification via Filesystem; independent check of a Codex-authored stream audit Dylan supplied)

**Web findings (new against the third pass):**
- Summarization mechanism: Computer History periodically starts an ephemeral Codex session that reads the interaction-event stream and writes the memories; events go to OpenAI servers for that step (official docs, learn.chatgpt.com/docs/customization/computer-history).
- Cadence and format: one summary per completed ten-minute segment. Each memory is Markdown with YAML front matter (title, description, applications as bundle ids), a memory-summary body with a prior-context section, a recording summary, and citations to the raw segment files. Later summaries chain earlier ones as context. (MacStories hands-on 2026-08-14; confirmed on-disk by us, see local verification.)
- Habit-grain suggestion loop: the timeline proposes skills and automations when repeated work is detected; docs example: a daily recap automation. So it is not pure observation; it suggests at workflow grain, without next-action prediction. (Docs; The Decoder; Unite.AI.)
- Sibling feature, new tier entry (workflow-demonstration, OS-vendor): Record & Replay. Demonstrate a workflow on the Mac; it drafts a skill (when to use, inputs, steps, verification); replay executes through Computer Use, browser actions, or plugins. macOS, requires Computer Use, EEA/UK/CH excluded at launch. The OS-vendor analog of Tango's demonstrate-then-execute, desktop-wide. (Docs page fetched in full.)
- Stated rationale for events over screenshots: capture memories "faster and more efficiently" (Dominik Kundel, announcement video, via The New Stack). Same tradeoff direction as our live recorder; corroborates the sec 5 recorder tree.
- Lineage: Computer History replaces Chronicle, OpenAI's screenshot-plus-OCR research preview from spring 2026; rebuilt, not renamed (9to5Mac, The Decoder, Neowin). Consequence applied in both files: Chronicle leaves the market list.
- EEA, UK, Switzerland: access in the coming weeks per OpenAI's announcement post (via Unite.AI). Refines "delayed at launch."
- Codename family: the Computer Use binaries are SkyComputerUseClient and com.openai.sky.CUAService, so skysight and Computer Use share the Sky family. A third-party Linux port (ilysenko/codex-desktop-linux) reimplements a skysight daemon with ten-minute summaries and six-hour rollups; port evidence only, not verified for macOS. Public Codex issues (25815, 26293) show lifecycle bugs in that client family (unbounded unlinked temp files; orphaned helpers retaining payload in argv). Texture only.
- Access correction to this map's third pass: "the local files are a private format" stands, but the raw event files are readable by the user's own account in practice (undocumented format, app-group container). The prior session and this one both read them. No supported API remains true.

**Local verification (this session, Filesystem reads; no raw contents copied into project files):**
- Segment layout: segments/<timestamp>/events.jsonl plus metadata.json; metadata carries id, startedAt, endedAt, eventCount, eventsPath, suppressedEventCount, nothing else (no reasons, no schema version). In-progress segments lack endedAt and eventCount until close.
- Sample scope confirmed: five completed segments 18:00 to 18:50Z, eventCounts 153, 330, 260, 184, 32, sum 959, matching the Codex audit exactly. Suppressed 12, 25, 22, 9, 1: the audit's 68 covered its four completed segments; the fifth closed with 1 more. A sixth segment was live during this session.
- Schema spot-check (two raw lines read): top-level fields app {bundleIdentifier, name}, ax {mode, text}, id (integer), kind (e.g. mouse.click, keyboard.text_input, session.started), mouse {button, target{role}}, keyboard {target{description, role, value}, text}, timestamp (1 s precision), window {title, url}. No coordinates anywhere. Click targets carry no tree element number even though the ax text numbers its elements, matching the audit's no-join finding.
- Before-versus-after resolved in part: a click's ax carries mode diffFromPrevious, and its added elements were changes accumulated since the previous capture, not the click's own effect. Model: the ax on event N is the state at event N; the outcome of N appears in the diff attached to N+1, one event late. Usable as lagged outcome evidence. One example; Dylan's queued synthetic test should confirm.
- Id space finding (new): session.started is id 1 at 18:00:29Z; id 3205 appears by 18:40:45Z; stored plus suppressed accounts for 1,028. Roughly 2,200 allocated ids were never stored and are not counted as suppressed; adjacent stored lines jump 3148 to 3205. Capture is coalesced or filtered upstream; suppressedEventCount is not the full drop accounting.
- Raw retention shorter than 48 h in practice (new): today's session directory begins at 18:00:29Z at id 1, and the earlier same-day 140-event sample has no raw files present. Cause unknown (post-summarization pruning or a restart clear). Consequence: copy raw segments promptly, per segment; the persistent copier is delegated to a separate agent per Dylan.
- URL quality caveat (new): Electron apps report file:// bundle URLs (Claude's window.url is the app bundle path), so URL-presence counts overstate web grounding. The grounding stats need an http-versus-file split.
- Text batching: text_input events fire mid-composition (a 56-char partial of a message captured mid-typing, target value mirroring it). Normalization rule: merge consecutive text_input events on one target.
- Summary side: the 18-40 summary landed 114 s after segment end (audit claimed 57 to 89 s; range widens to one to two minutes, variable). Structure verified on disk: YAML front matter, prior-context chaining, citations to events.jsonl and metadata.json, an "important non-obvious context about the user" section, second-person address. Reading: the shipped, inspectable personalization seam sec 5's concession describes.
- Provenance note: the stream auditor was Codex, running inside the product under audit, and the audit session itself dominates the sample (492 of 959 events are the Claude conversation; most of the rest is the ChatGPT audit). Numbers held where checkable, but zero behavior statistics from this window generalize; collection must precede any habit-versus-novel split.

**Not verified this session (copy bridge to the analysis sandbox was down):** the event-type table, the 71 percent click-grounding figure, per-app label coverage, timestamp inversion counts, text-length percentiles. Gate: reproduce locally with the URL split before the draft uses any of them.

**Claim impacts (fourth pass):**
12. Sec 5: recorder decision tree added (video plus vision, versus events plus accessibility) with the events-first fork decision (per Dylan): next experiment runs on Computer History's stream, vision only if events fail. Applied in both files.
13. Sec 7: "observation only" nuanced (habit-grain suggestions, Record & Replay sibling); Chronicle retired from the market list. Applied in both files and the Landscape line.
14. Sec 9 Bottleneck 1: splits into commoditized capture versus verified rows, with the sufficiency result (data-sufficiency only, prediction lift untested) gated on the local stats reproduction. Applied in both files.
15. Frame: optimistic gradient recorded under the spine with a candidate beat 9 amendment. PENDING Dylan's beat audit.
16. Experiment logistics: two weeks of collection minimum, four for weekly routines; persistent raw copier delegated to a separate agent; raw files provably vanish early, so copying is per-segment and urgent.

---

## Fifth pass (2026-08-14, evening): local stats reproduction, gate result

Method: scripts/verify_computer_history_stats.py (stdlib, aggregates only), run locally by Dylan against the live segments root. 20 segments, 18:00Z to 21:30Z, 2,198 stored events, 142 suppressed, one segment still active. The first five segments match the audited morning sample exactly (153, 330, 260, 184, 32), so the audit's per-segment counts are independently confirmed.

**Gate result: the 71 percent click-grounding figure did NOT reproduce.** Full-day identifier-or-label over 602 mouse events: 313, which is 52 percent. Stable identifiers alone: 67, which is 11 percent (consistent with the audit's 24 of 263). With a real http(s) window URL as fallback grounding: 390, which is 65 percent. The audited 41-minute window was either unrepresentative or overcounted; either way the 71 does not describe a day of ordinary use, and the record should carry roughly half, not roughly seven in ten.

**URL split (the caveat confirmed, decisively):** on clicks, file 286, absent 113, http(s) 112, other 91. Only 19 percent of clicks carry a real web URL; the file scheme (Electron bundle paths) is the largest bucket, as the fourth pass predicted.

**Grounding is an Electron problem (new, quotable):** per-app identifier-or-label rates: Messages 96, Dock 100, Notes 73, ChatGPT 58, Claude 54, Arc 33, Slack 33, VS Code 9. Native AppKit apps ground well; Electron surfaces ground poorly; code editors are near-blind at the target level.

**Other new facts at day scale:**
- eventCount equals actual line count on all 19 closed segments. Validates the closed-segment rule in the archiver spec on real data, 19 of 19.
- Two segment gaps in continuous-ish use: 20-00-00Z and 20-40-00Z do not exist (idle windows produce no segment). Segment adjacency is therefore not guaranteed; the archiver's gap-as-warning severity is the right call, and experiment sequencing cannot assume contiguous windows.
- Kind table at day scale: mouse.click 546, keyboard.shortcut 525, window.changed 419, keyboard.text_input 365, selection.changed 167, keyboard.submit 119, mouse.drag 33, mouse.context_menu 23, session.started 1. keyboard.submit is a kind the fourth pass had not catalogued.
- Id space: allocated about 9,870, stored 2,198, suppressed 142, unaccounted about 7,530 (77 percent). The coalescing ratio grew over the day (morning about 3x, full day about 4.5x).
- Id inversions in file order: 130. File order is not id order; sequence reconstruction should order by timestamp then id, and within-second order is ambiguous (0 sub-second timestamps; 1,457 events share a second with another).
- Scrolls: zero events in 3.5 hours. Scroll capture is confirmed absent, not merely unobserved.
- ax context: absent on 988 of 2,198 (45 percent); diffFromPrevious 754; fullTree 456. Nearly half of events carry no tree.
- text_input: 365 events, median 14 chars, max 97; 314 consecutive same-role pairs confirm the merge rule from the fourth pass.

**Sufficiency re-scored (supersedes the fourth pass's gated judgment):** the stream remains sufficient for the fair test at the next-app and semantic-action grains, and for the habit-versus-novel split, across the whole day. Exact-destination scoring is possible only on the grounded roughly-half, with strong per-app selection bias and near-zero coverage inside code editors; any exact-grain result must carry that caveat. The complementarity note strengthens: normalization, not capture, is where the cost moved.

**Claim impacts (fifth pass):**
17. Sec 7 skeleton line "roughly 7 in 10 clicks carrying a usable label" corrected to roughly half; verify marker resolved with the correction. Applied.
18. Sec 9 sufficiency bullet: gate closed with the correction and the re-scoped judgment; the 71 figure retired from reader-facing use. Applied.
19. Archiver relay for the other agent: 19 of 19 closed segments pass the row-count rule; segment gaps are real and benign; an active segment exists at any time during use.
