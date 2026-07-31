---
type: synthesis
status: active
created: 2026-07-30
updated: 2026-07-30
projects:
  - computer-use-autocomplete
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
  - computer-use
tags:
  - competitor-landscape
  - computer-use-models
  - proactive-agents
  - world-models
  - macos
  - data-infrastructure
---

# The computer-use autocomplete wedge is intent ranking, not another computer-use agent

Research current through July 30, 2026.

> [!important] Runtime ordering superseded
> This landscape remains authoritative for model/competitor capabilities and
> the product boundary. Its later Gemini-first feasibility ordering was
> provisional and is superseded by
> [[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use
> autocomplete runtime decision audit]], which applied a frozen matrix and
> local bakeoff. The current recommendation is a product-owned local hybrid
> with a replaceable proposal provider; no public API provider is selected yet.

## Executive summary

No released product or model found combines all of the required behavior:

1. infer an untyped latent intent from one person's longitudinal computer-use
   history and the current state;
2. choose the most useful completion at adaptive semantic granularity;
3. accurately describe the entire result of the current Tab;
4. execute reversible preparation across native macOS applications and browser
   chrome;
5. stop at the described endpoint, abstain when nothing is useful enough, and
   require a fresh explicit Tab at every consequential commit.

The market is converging on pieces of this product from four directions:

- **Goal-free prediction research:** [LongNAP](https://arxiv.org/abs/2603.05923)
  predicts personal future action descriptions from interaction history;
  [PIRA-Bench](https://arxiv.org/abs/2603.08013) tests latent-intent
  recommendations and false-positive restraint; [FDM-1](https://si.inc/posts/fdm1/)
  predicts raw computer actions from video without a typed goal.
- **Instruction-driven executors:** [Gemini Computer
  Use](https://ai.google.dev/gemini-api/docs/computer-use), [OpenAI Computer
  use](https://developers.openai.com/api/docs/guides/tools-computer-use), Claude
  Computer Use, UI-TARS, OpenCUA, and Agent S can navigate once given a goal.
- **Proactive product surfaces:** Superhuman Go, Amazon Quick, Microsoft
  Recall/Click to Do, and Apple App Intents already place contextual or
  proactive suggestions close to work, but none continuously predicts the
  user's next semantic desktop destination from personal action history.
- **Video and world models:** Photon-1, FDM-1, Microsoft's Computer-Using World
  Model, ViMo, and Code2World improve long-context representation or
  counterfactual outcome prediction. The most relevant models are research
  artifacts or company demonstrations, not dependencies an MVP can ship on.

The practical boundary is therefore unusually clear:

> **Build the personal intent/candidate/utility layer and the authority state
> machine. Repackage navigation and grounding.**

For an MVP, the best architecture is not an end-to-end fine-tuned action model.
It is:

1. a semantic candidate generator over open tasks, destinations, controls, and
   bounded safe workflows;
2. a history-conditioned ranker that estimates usefulness, risk, and
   confidence and can explicitly abstain;
3. a deterministic route when Accessibility, App Intents, browser DOM, or an
   application API supplies one;
4. a commercial computer-use model as a fallback route planner;
5. a host-enforced commit boundary that the route model cannot waive.

This conclusion agrees with the local NAP V5 result. History recovered a
recurring Codex task but did not produce general open-ended next-destination
competence. The result supports retrieval and ranking over a known personal
candidate set, not immediate end-to-end behavior cloning. See
[[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a
first navigation autocomplete still needs]].

## The product contract used for this review

This landscape is evaluated against
[[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1
brainstorm and scope]], not against the broader category of computer-use
agents.

The target interaction is:

- **No typed goal is required.** The predictor uses current state, recent
  action history, retrieved personal episodes, open-task state, and durable
  preferences to infer a latent goal.
- **The prediction unit is adaptive.** A suggestion may be one primitive
  action, a semantic destination, or a short bounded workflow.
- **The visible promise is exact.** Its text describes everything the current
  Tab will accomplish, including where it will stop.
- **Preparation is bounded.** Reversible locator steps such as opening an app,
  searching, navigating, and typing an ephemeral query or URL may occur. The
  system does not author messages, posts, or document prose as preparation.
- **Commit authority is fresh.** Sending, submitting, publishing, purchasing,
  deleting, changing access, and consequential edits require a new explicit
  Tab at the point of risk.
- **The objective is usefulness, not imitation.** A likely next action can be
  too trivial, risky, or annoying to suggest. A less likely safe completion can
  be more useful. `ABSTAIN` is a valid and often correct result.

A computer-use model that completes a typed instruction well is therefore an
executor candidate, not a direct solution.

## Evidence and availability labels

The note uses four evidence classes:

- **Released:** a current product, API, downloadable application, model
  weights, dataset, or code path can be used now.
- **Open research:** a paper and some artifacts are public, but it is not a
  supported product path.
- **Research only:** the paper describes the system but the required
  model/code is not released.
- **Company-reported demo:** claims and demonstrations come from the company
  and lack independently reproducible weights, API access, or public
  evaluation.

`Reported` below means a primary source states the claim. `Assessment` means
the implication for this product is an inference from that evidence. Vendor
benchmark numbers are not treated as independent validation.

## Landscape at a glance

### Goal-free prediction and proactive-intent research

| Candidate | Typed goal? | Input and output | History / personalization | Abstention, stopping, commits | Availability as of July 30 | Product decision |
| --- | --- | --- | --- | --- | --- | --- |
| [LongNAP](https://arxiv.org/abs/2603.05923), Mar. 6, 2026 | **No** | Multimodal interaction history → an eight-action natural-language future trajectory | Per-user adaptation plus retrieval over an unbounded library of past reasoning traces; the evaluated input uses a short recent window and retrieved history | Filters on self-reported confidence; no executable stopping or commit semantics | NAPsack is released; project page still says LongNAP code is coming soon; no supported weights/API | Closest modeling precedent for the personal predictor. Reuse retrieval and temporal reward ideas, not the model as an MVP dependency. |
| [PIRA-Bench / PIRF](https://arxiv.org/abs/2603.08013), Mar. 9, 2026 | **No** | Continuous screenshot stream + assigned profile → a set of actionable future intents | Ten-frame window plus dynamic active/suspended intent memory; profile-conditioned, not learned from a person's natural history | Explicit `IDLE`, pure-noise negatives, and stale-intent deletion; no execution or commit gate | Dataset/leaderboard and paper released; framework is a benchmark baseline | Best benchmark shape for intent discovery, multithreading, and false-positive restraint. |
| [FDM-1](https://si.inc/posts/fdm1/), Feb. 23, 2026 | **No fresh instruction is shown** | Long computer video/action history → next primitive key, mouse, click, or scroll action | Long recent context; no public evidence of per-user adaptation across days | Raw behavioral imitation; no semantic candidate ranking, usefulness objective, calibrated abstention, bounded route, or commit gate | Company-reported demo; no public API, weights, license, or macOS support | Closest literal next-action model. Watch closely; do not build around it. |
| [A Click Ahead](https://arxiv.org/abs/2309.12170), Sept. 21, 2023 | **No** | One user's action sequence → one of 442 recurring actions | One week / 46.21 hours from one dual-monitor Windows user; recurrent model | Closed candidate list permits top-k; no risk or commit model | Paper only | Strong fixed-candidate personal baseline. Its 34.63% exact top-one result is precedent, not an estimate for open semantic destinations. |
| [SummAct](https://doi.org/10.1145/3706598.3713190), CHI 2025 | No new typed goal at prediction time, but evaluated on goal-oriented datasets | Prior UI actions + inferred goal summary + 50 current-page candidates → element and operation | Interaction summary, not longitudinal personal adaptation | Candidate restriction reduces hallucination; no calibrated abstention or commits | Paper; no end-user product | Direct support for summarizing history, enumerating candidates, then ranking instead of generating an unconstrained action. |
| [FC-MIR](https://arxiv.org/abs/2512.19107), Dec. 22, 2025 | No new goal | Compressed mobile screen trajectory → intent, follow-on operations, or search suggestions | Trajectory summary; includes real-user interactions, but not a released personal policy | Paper reports that useful and surprising suggestions remain hard; no commit system | Research paper/prototype | Useful evidence for keyframe compression and for separating likely from useful suggestions; mobile-specific. |
| [ScreenLLM](https://arxiv.org/abs/2503.20978), Mar. 26, 2025 | Depends on task prompt | Keyframes + a stateful textual screen schema → action understanding or prediction | Compact temporal schema, not durable personal memory | No product authority model | Research paper | Reuse the representation idea: pixels alone are a costly and lossy history format. |
| [InvisibleMentor](https://arxiv.org/abs/2509.26557), Sept. 30, 2025 / CHI 2026 | **No typed problem statement** after observation | Screen recording → reconstructed workflow → post-task improvement recommendation | Behavior-grounded session history; Excel-focused, not longitudinal adaptation | Suggests after completion; does not execute | Research prototype | Closest evidence that passive screen observation can yield useful proactive help. It improves a completed workflow rather than predicting the next destination. |

### Instruction-driven computer-use models and platforms

| Candidate | State and action interface | Context / adaptation | Safety and stopping | Native Mac / browser / cross-app | Availability and latency | Reusable role |
| --- | --- | --- | --- | --- | --- | --- |
| [Gemini Computer Use](https://ai.google.dev/gemini-api/docs/computer-use) | Screenshot loop; structured coordinate actions with an `intent` attached to each step; browser, mobile, and desktop action spaces | Conversation/action history can be supplied; no built-in personal behavior memory | Built-in safety categories can return `require_confirmation`; official prompt pattern prepares then confirms before irreversible action | API advertises desktop and browser environments, but the client must implement execution; no macOS Accessibility semantics are supplied | **Released preview API.** Gemini 3.6 Flash is recommended; 3.5 Flash-Lite is positioned as low latency. No product-specific end-to-end latency guarantee. | First commercial route-planning bakeoff candidate. Step intents and safety decisions are especially useful for truthful suggestion auditing. |
| [OpenAI Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) | Screenshot loop; `click`, `double_click`, `scroll`, `type`, `keypress`, `drag`, `move`, `wait`, and screenshot; actions can be batched | Conversation state and custom context; no native personal-history adaptation | Official guidance says proceed safely, confirm at the point of risk, and treat sensitive typing as transmission | Custom harness can target a browser or computer; official examples emphasize browser/Linux VM and do not provide native Mac semantics | **Released Responses API** with current examples using `gpt-5.6`; proprietary; no latency SLA for this interaction | Second commercial executor candidate and strongest reference for point-of-risk confirmation semantics. |
| [Claude Computer Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) | Screenshot plus mouse/keyboard desktop actions through a client loop | Conversation history; no personal behavior model | Vendor recommends isolated environments and human confirmation for real-world consequences | General desktop pixels; reference implementation is container/Linux rather than native Mac semantics | **Released beta API**; proprietary; exact low-latency behavior must be measured | Useful control arm, but less directly aligned than Gemini's structured intents and safety response. |
| [UI-TARS 1.5-7B](https://github.com/bytedance/UI-TARS) + [desktop app](https://github.com/bytedance/UI-TARS-desktop) | Screenshot + typed instruction → thought/action or action-only coordinate commands | Prompt templates carry limited recent screenshot/action history; no personal adaptation | No host-quality commit or confidence layer | Downloadable macOS desktop and browser operator; requires Accessibility and Screen Recording; docs warn that multi-monitor use can fail | **Released open weights and app**, Apache-2.0. Local or hosted inference; latency depends on hardware. Larger UI-TARS 2 capability is announced, not equivalent to the open 7B path. | Best open/private grounding baseline and useful local fallback; still needs the entire predictor and authority layer. |
| [OpenCUA](https://github.com/xlang-ai/OpenCUA), Aug. 13, 2025 | Screenshot/action history → executable low-level action with reflective reasoning | Default agent uses three images; models do not learn Dylan's history without additional work | No product-ready confirmation or calibrated abstention layer | AgentNet spans three OSs and 200+ apps/sites; runtime is research infrastructure, not a polished Mac harness | **Released** 7B/32B/72B weights, data, tools, and vLLM support; repository is MIT, but individual model/data terms must still be checked before commercial use. 32B/72B require substantial GPU capacity. | Best open data/model stack to inspect; heavier and less MVP-friendly than UI-TARS 7B for local grounding. |
| [Agent S3](https://github.com/simular-ai/Agent-S), Oct. 2025 | Screenshot → planning + grounding + executable computer action through an agent-computer interface | Retrieves experience and can reuse task knowledge, but the goal is typed | Framework has validation and multi-rollout selection, not the required one-Tab authority contract | Framework exposes `darwin`, Windows, and Linux paths | **Released Apache-2.0 framework**; recommended configuration uses a frontier API plus UI-TARS 7B. Best-of-N improves reported success but multiplies latency/cost. | Reuse orchestration, grounding split, and experience retrieval ideas. Do not put Best-of-N in the autocomplete latency path. |
| [UFO² / UFO³](https://github.com/microsoft/UFO) | Hybrid UI Automation, Win32/COM, vision, and application APIs | Execution history and experience reuse; typed task | Plan/execute/verify architecture; no goal-free usefulness policy | **Windows only**; deep Office/Windows integration | **Released MIT framework** | Architectural reference for preferring structured APIs and verifying effects. Not an MVP runtime on macOS. |
| [ShowUI](https://github.com/showlab/ShowUI) and [AGUVIS](https://aguvis-project.github.io/) | Pure screenshot grounding and cross-platform action prediction | Short interleaved visual/action history; typed goal | No commit state machine or useful abstention | Web, desktop, and mobile research coverage | Open research models/data; smaller ShowUI model is attractive for cheap grounding | Secondary local grounding candidates if UI-TARS latency or licensing becomes unattractive. |

All systems in this table are **reactive executors** in their normal use. The
typed goal can be supplied by a separate predictor, but doing so does not make
their policy history-conditioned or safe by itself.

### Adjacent products and interaction competitors

| Product | What is currently released | Why it is close | Why it is not the same product |
| --- | --- | --- | --- |
| [Superhuman Go for Mac/Windows](https://support.grammarly.com/hc/en-us/articles/45113077035789-Superhuman-Go-for-Windows-and-Superhuman-Go-for-Mac-user-guide) + [agents/connectors](https://support.grammarly.com/hc/en-us/articles/40642362241293-About-Superhuman-Go-agents-and-connectors) | A proactive desktop/browser assistant using active-window context, inline writing suggestions, chat, agents, and connectors that can take one-click actions in services | Most direct interaction competitor: ambient, cross-app, contextual, and visually close to the user's current work | Its documented proactive desktop behavior is mainly writing assistance. Agents take instructions and connector actions; the docs do not establish continuous prediction of the next semantic computer destination from action history. |
| [Amazon Quick desktop](https://docs.aws.amazon.com/quick/latest/userguide/what-is-desktop.html) | macOS/Windows assistant with local files, connected services, a personal knowledge graph, long-term memory, browser automation, skills, MCP, and scheduled agents | Strongest broad personal-work context stack. Its Feed Agent periodically ranks items and proposes actions without a fresh prompt. | Proactivity is scheduled or connector-driven. It does not document continuous screen/action-history NAP or Tab-to-navigate across native UI. |
| [Microsoft Recall and Click to Do](https://learn.microsoft.com/en-us/windows/client-management/manage-recall) | Opt-in local periodic screenshots, semantic history search, relaunch links, and actions on elements in current or saved snapshots on Copilot+ Windows PCs | Best released precedent for private visual history, history retrieval, and actionable overlays on screen content | Retrieval is user-queried and Click to Do is selection-driven. It does not predict the next useful destination. Windows-only. |
| [Apple App Intents and donations](https://developer.apple.com/documentation/appintents/donating-your-apps-data-and-actions-to-the-system) | Apps expose typed semantic actions/entities; donations help the system learn behavior and suggest future actions in system surfaces | Native semantic action IDs, parameters, deep links, and behavior-conditioned suggestions are nearly ideal candidate objects | Coverage depends on app developers. It cannot see arbitrary UI, browser chrome, or cross-app workflows and does not expose a general personal ranking model to this product. |
| [Tada / Tabracadabra](https://generalusermodels.github.io/tada/) | A macOS research preview in which Option+Tab writes into an already focused field after retrieving personal context | Same keyboard gesture, passive context stack, and research lineage as LongNAP | The user has already chosen the destination. It predicts or retrieves what to write, not where to go. See [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap\|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]. |
| [InvisibleMentor](https://arxiv.org/abs/2509.26557) | Research prototype that observes Excel work and proactively recommends a better workflow afterward | Goal-free, behavior-grounded suggestion rather than chat-first assistance | It is retrospective instruction, not real-time navigation or execution. |
| [Glean proactive intelligence](https://www.glean.com/ai-assistant/proactive-intelligence) | Enterprise knowledge graph and proactive summaries/next steps from connected work data | Competes for the “AI notices what matters before I ask” promise | Works through enterprise data and app integrations, not personal screen/action history or arbitrary GUI navigation. |

The competitive threat is more likely to come from a **bundle** than from a
specialized NAP startup. Superhuman, Amazon, Microsoft, Apple, Google, or
OpenAI can combine an existing contextual surface, proprietary user graph, and
improving executor. The durable differentiation therefore has to be the
quality and trustworthiness of the personal completion policy, not access to a
mouse-control model.

### Video-native policies and computer world models

| System | What it predicts | Context and data | Availability | Relevance |
| --- | --- | --- | --- | --- |
| [Photon-1](https://www.inductionlabs.com/news/scaling-video-pretraining), July 23, 2026 | A desired next latent computer state and then an action conditioned on an instruction | 106B-A5B MoE; company reports 575M frames, 32K context, latent video tokens, fewer than 35K action trajectories for computer-use post-training, and online RL in Linux VMs | Company post/demo; no public API, weights, license, or macOS evidence | Future-state prediction before action is an attractive internal planning representation, but Photon does not supply the untyped personal objective. |
| [FDM-1](https://si.inc/posts/fdm1/), Feb. 23, 2026 | Next primitive action from prior screen/action video | Portion of an 11M-hour video corpus labeled by an inverse dynamics model trained on 40K labeled hours; very long recent context | Company post/demo only | Best evidence that observational computer video can train a goal-free primitive policy. It optimizes imitation, not safe usefulness. |
| [Computer-Using World Model](https://arxiv.org/abs/2602.17365), Feb. 19, 2026 | Next textual state delta and rendered screenshot **conditioned on a proposed action** | Office state-action-next-state transitions; used to compare candidate actions at test time | Research paper; no supported API/weights path established | Strong fit for route verification and counterfactual ranking after candidate generation. It is not a predictor of personal intent. |
| [ViMo](https://ai-agents-2030.github.io/ViMo/) | Future mobile GUI state conditioned on current screenshot and action | Mobile GUI transitions | Open research project | Confirms the candidate-action simulation pattern; mobile-specific. |
| [Code2World](https://amap-ml.github.io/Code2World/) | Action-conditioned renderable future Android UI represented through code | Reported 80K Android state/action pairs | Open research project | Interesting structured world representation, but far from native Mac and personal intent. |

Two superficially similar uses of “future state” must stay separate:

- Photon predicts the **desired** future latent state as part of an
  instruction-conditioned policy.
- CUWM, ViMo, and Code2World predict the **consequence of a candidate action**
  and can therefore help compare routes.

For this product, the second capability may be more valuable in the medium
term. A world model could reject a route whose predicted result exceeds the
visible suggestion or crosses a commit boundary. It still needs candidates, a
personal utility function, and a host policy.

## Strongest candidate dossiers

### 1. LongNAP is the closest model precedent, but not a deployable router

**Reported.** LongNAP formalizes next-action prediction without a prompt. The
released paper labels more than 360,000 actions from 20 users across roughly
1,800 hours of screen time. It combines a learned per-user component with a
two-phase retrieval policy: generate reasoning for a retrieval query, retrieve
past traces with BM25, then reason again to predict an eight-action future.
Training uses the later observed trajectory as a temporal reward. The authors
report 17.1% pass@1 on an LLM-judged semantic trajectory metric, rising to
about 26% on a high-confidence subset. See
[[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's
computer-use personalization stack]] for the full local review.

**State and output.** Its evaluated history is captioned interaction events
with images for only the latest portion, not a live Mac accessibility tree,
browser DOM, or exact destination set. The output is a free-text future
trajectory, not an executable semantic route.

**Long context and adaptation.** The important long-context mechanism is
retrieval over an accumulating trace library rather than stuffing raw video
into one prompt. PowerNAP extends the design toward online single-pass
learning. That is directly relevant to one person's growing history.

**Confidence and abstention.** Filtering by model confidence improves the
reported metric, but the paper does not establish calibrated probability,
selective risk under asymmetric harm, or whether the remaining predictions
save meaningful effort. Confidence filtering is a starting point, not the
product policy.

**Mac, latency, and availability.** NAPsack is downloadable and has been run
locally. The LongNAP project page still labels its GitHub release as coming
soon. There is no supported inference API, model weight, measured Mac
latency, semantic target grounding, or execution path. The paper's training
setup is not an MVP deployment recipe.

**Assessment.** Reuse the “reason to retrieve, then predict” separation and
the append-only episodic memory. Replace unconstrained trajectory generation
with candidate scoring. Do not reproduce its training loop before retrieval,
frequency, transition, wrong-history, and general multimodal ranking baselines
have been exhausted.

### 2. PIRA-Bench supplies the right negative class and task-thread model

**Reported.** PIRA-Bench asks models to infer actionable future intents from
continuous mobile and desktop screenshots without an instruction. Its 100
curated trajectories contain interleaved tasks, noise, three assigned user
profiles each, and pure-noise examples whose correct output is empty. PIRF
keeps a user profile and suspended-intent bank, processes ten recent frames,
and emits `CREATE`, `RESUME`, `UPDATE`, or `IDLE`; it deletes abandoned and
completed intents. See
[[pira-bench-proactive-intent-recommendation-agents-2026-03-09|PIRA-Bench tests
proactive intent recommendation from continuous GUI screenshots]].

**Output and control.** The output is a broad instruction such as scheduling
an event or booking a restaurant. It is not a control, semantic destination,
or executable bounded route. There is no one-step stopping or commit gate.

**Personalization.** Assigned profiles change the expected answer, which is
useful for testing preference conditioning. They do not prove adaptation from
one person's longitudinal behavior. The benchmark also relies on consensus
human labels and an LLM judge for inherently ambiguous latent intent.

**Assessment.** Copy three abstractions immediately: multiple suspended task
threads, an explicit idle/abstain action, and joint positive/false-positive
evaluation. Do not copy the probability-only objective. Candidate utility and
commit risk should be explicit features.

### 3. FDM-1 is the closest raw policy and the strongest data-labeling clue

**Reported.** Standard Intelligence describes a forward dynamics model trained
to emit low-level key and mouse actions from long computer video. Its action
vocabulary includes key press/release, scrolling, mouse deltas, and clicks.
The post says an inverse dynamics model trained on 40,000 hours of labeled
recordings inferred actions for an 11-million-hour video corpus. The inverse
model is noncausal and can use later frames to resolve an earlier hidden action
such as copy followed later by paste. The company reports 11-millisecond
screen-to-action latency on bespoke colocated infrastructure.

**Context and personalization.** The encoding can retain very long recent
video context, but long context is not the same as a durable personal model.
No public evidence shows per-user adaptation, retrieval across days, personal
candidate ranking, or transfer to Dylan's Mac.

**Output and authority.** Primitive imitation is below the semantic level
needed for a truthful Tab. It can predict a click without knowing whether the
click is worth suggesting, whether it is the last action, or whether it sends
a message. Nothing public establishes confidence, abstention, route bounds, or
commit gating.

**Availability.** There is no public API, model weight, license, evaluation
suite, or Mac runtime. Every capability claim is company-reported.

**Assessment.** FDM-1 is not an MVP option. It is important because it validates
two research directions: inverse-dynamics labeling of raw video at scale and
video-native action context. A future partnership or released API could
replace primitive execution and labeling, but not the usefulness or authority
layers.

### 4. Photon-1 is an instruction-conditioned imagination model, not a NAP

**Reported.** Induction Labs describes Photon-1 as a sparse 106B-A5B model
pretrained on 575 million frames. It compresses frames into discrete latent
tokens, predicts future latent state during video pretraining, and after
computer-use post-training predicts a desired next latent state before an
action. The post describes fewer than 35,000 computer-use trajectories and
online RL in Linux VMs. It reports stronger internal benchmark performance and
lower cost than a named Gemini baseline.

**Goal and output.** The demonstrations still provide an instruction. Photon
could serve as a capable “how” policy after another layer produces the latent
instruction; it does not publicly demonstrate history-conditioned unprompted
intent.

**Availability and feasibility.** No public API, weights, license, latency
distribution, Mac runtime, confidence interface, or commit semantics were
found. The comparison is a company report rather than independent evidence.

**Assessment.** Future-state imagination is relevant to adaptive workflow
completion, but waiting for Photon would conflate two problems. The MVP can
test the predictor today with a released executor.

### 5. Gemini Computer Use is the first executor to test

**Reported interface.** The current Gemini API supports browser, mobile, and
desktop computer-use environments. Gemini 3.x actions include an `intent`
field, normalized coordinates, and an optional safety decision. Gemini 3.6
Flash is recommended; Gemini 3.5 Flash-Lite is described as the low-latency,
cost-effective option. The capability remains preview and requires a
client-side action harness.

**Safety.** The API can classify an action as allowed, confirmation-required,
or blocked. Google's documented prompt pattern performs preparatory work and
then asks before Send, Submit, Confirm Purchase, or Share. This is close to the
desired two-Tab state machine.

**Critical mismatch.** The same official example permits typing a drafted
message before confirmation. This product explicitly excludes authored
writing from reversible preparation. The host policy must therefore reject
model-authored communication even if the vendor safety layer permits it.

**Grounding and Mac.** The API supplies pixel actions, not macOS Accessibility
targets, App Intent IDs, Arc tab identity, or DOM proof. “Desktop support”
means the model can emit desktop actions; the product still owns capture,
execution, display mapping, effect verification, and permissions. Cross-app
Mac feasibility is plausible but unproven until tested on Dylan's actual apps
and monitor layout.

**Confidence and stopping.** The API does not expose a calibrated probability
that a latent predicted goal is useful. Its action intent can help audit
whether a proposed primitive remains inside the visible Tab promise. Stopping
must be enforced by the host once the declared semantic endpoint is verified.

**Assessment.** Gemini is the leading first bakeoff candidate because it pairs
a potentially low-latency model family with desktop actions, per-action
intent, and confirmation classifications. Use it only after the personal
ranker has chosen a candidate.

### 6. OpenAI Computer use is the second executor and the best policy reference

**Reported interface.** The current Responses API exposes a `computer` tool
and current examples use `gpt-5.6`. A call can request a screenshot or return
one or more actions such as click, scroll, type, keypress, drag, move, or wait.
The developer supplies the browser, VM, or custom harness and returns a fresh
screenshot after execution.

**Safety.** Official guidance says not to stop safe progress prematurely, to
confirm immediately before the next risky action, and to treat typing
sensitive information as transmission. It distinguishes the user's explicit
instruction from untrusted content found on screen. These are strong design
references for the product's authority state machine.

**Mismatch.** The model remains instruction-driven and screenshot-first. It
has no native personal-history learner, semantic destination catalog,
expected-utility score, or calibrated abstention interface. A custom Mac
harness is possible, but the official path does not provide Accessibility or
browser-chrome identity.

**Assessment.** Test it against Gemini on the same safe routes. Keep the host
policy and endpoint verifier vendor-independent. The point-of-risk language is
worth copying even if another model wins the executor bakeoff.

### 7. UI-TARS 1.5-7B is the most practical open/private control

**Reported.** ByteDance released UI-TARS 1.5-7B and inference tooling under
Apache-2.0. Its screenshot-to-coordinate output can be parsed into executable
actions. The desktop application runs on macOS, requires Screen Recording and
Accessibility, and offers computer and browser modes.

**Caveats.** The desktop quick start warns that the app is designed for a
single monitor and that multi-monitor configurations can fail. The open 7B
model is not the same as every performance number attached to later or larger
UI-TARS releases. It is goal-conditioned and carries only limited recent
history. It has no personal adaptation, usefulness ranking, confidence
calibration, or commit boundary.

**Assessment.** UI-TARS is valuable as a private local grounding control and
for measuring the latency floor of an open model. It should not be the primary
product architecture unless it beats commercial APIs on real Mac routes.

### 8. Superhuman Go and Amazon Quick are the product competitors to watch

**Superhuman Go.** Its official desktop guide calls it proactive across
applications and says it uses active-window context. It presents an always
available edge tab and inline suggestions. Its agents and connectors can
search, draft, send, update, and organize across services. This is very close
to the desired interaction placement and “help without context switching”
promise. The documented automatic behavior remains centered on writing
quality; agents still take instructions or explicit one-click invocations.

**Amazon Quick.** The desktop product has local file access, connectors,
browser automation, MCP, custom skills, a knowledge graph, and long-term
memory. A built-in Feed Agent runs every 15 minutes by default and produces
prioritized items with suggested actions from messaging, email, and calendar.
It therefore already has personal context, proactive ranking, and actions in
one released desktop product. Its trigger is scheduled/connector data rather
than continuous GUI state and action history.

**Assessment.** These products validate the surface and the value of proactive
ranking. They also show why “it controls the computer” is not a durable moat.
The wedge is high-precision, low-interruption inference of the next useful
semantic completion from behavior that integrations cannot see.

## Enabling approaches and what they contribute

### Long-context computer history

There are four distinct strategies:

1. **Raw recent video:** FDM-1 retains unusually long, dense screen/action
   context. This is best for local motor continuity but expensive and not
   durable personal memory.
2. **Latent video tokens:** Photon compresses screen video before temporal
   modeling. This may retain visual state changes better than captions.
3. **Structured summaries:** ScreenLLM and SummAct convert pixels and low-level
   events into compact screen/action/goal schemas. This is cheaper to retrieve
   and easier to audit, but can erase exact identity.
4. **Episodic retrieval:** LongNAP retrieves relevant old traces from an
   unbounded store. This is the best match for recurring destinations separated
   by hours or days.

**Assessment.** The MVP should use a hybrid: exact recent state plus structured
semantic action history plus episodic retrieval. Raw all-day video should
remain evidence and relabeling material rather than the ranker's only input.

### Inverse dynamics and scalable labeling

FDM-1 supplies the clearest large-scale recipe: pay for a smaller high-quality
state/action set, train a noncausal inverse dynamics model, infer actions over
a much larger video corpus, then train the forward policy. The noncausal
labeler can use later effects to resolve ambiguous earlier actions.

That recipe does not make noisy labels trustworthy automatically. For personal
desktop autocomplete, the label must preserve:

- the strictly prior state available at suggestion time;
- the actual semantic destination or resulting state;
- whether the action was a locator, authored content, or commit;
- whether it completed or merely advanced a task thread; and
- whether suggesting it would have been useful.

NAPsack's VLM captions, ScreenLLM's schema, SummAct's hierarchical summaries,
and InvisibleMentor's visual reconstruction can bootstrap labels. None should
silently become exact ground truth without human or structural verification.

### Action tokenization

Primitive policies use different action spaces:

- FDM-1 tokenizes physical keyboard and mouse events, including quantized
  deltas.
- Gemini, OpenAI, Claude, UI-TARS, ShowUI, and OpenCUA emit structured
  coordinate/keyboard commands.
- App Intents, DOM events, Accessibility nodes, and application APIs expose
  semantic actions.

The product needs a canonical action object above all three:

```text
candidate
  semantic endpoint
  user-visible promise
  reversible route variants
  expected effort saved
  probability / uncertainty
  commit class
  endpoint verifier
```

A primitive action token cannot tell the UI what the Tab fully accomplishes.
A semantic candidate can compile down to deterministic APIs, a GUI route, or a
mixture.

### Latent future-state prediction

Photon predicts a desired latent next state before acting. CUWM predicts the
result of a proposed action. Both support an endpoint-first design:

1. choose or describe the desired bounded endpoint;
2. generate candidate routes;
3. simulate, predict, or verify route effects;
4. execute only while effects remain inside the promise.

For the MVP, exact deterministic postconditions are cheaper than a learned
world model: active app/window/task, URL/tab, selected document, visible
control, and absence of a commit. A learned visual simulator becomes useful
when routes are ambiguous or effects cannot be read structurally.

### Candidate ranking, confidence, and abstention

The strongest evidence all points toward explicit candidates:

- A Click Ahead predicts within 442 recurring personal actions.
- SummAct ranks 50 current-page elements and an operation.
- NAP V5 succeeds mainly on a recurring known task.
- PIRA-Bench gives `IDLE` first-class status and penalizes false positives.
- LongNAP's reported result improves when filtered for confidence.

The ranking objective should not be `argmax P(next action)`. A more appropriate
decision rule is:

```text
expected value(candidate)
  = P(user accepts and route succeeds) × effort saved
  - interruption cost
  - execution failure cost
  - authority / privacy risk
```

Display only if the best candidate exceeds an abstention threshold and is
meaningfully better than the next plausible candidate. Calibrate this with
selective-risk curves and user acceptance, not model confidence prose.

### One-step stopping and trajectory control

Instruction-driven agents normally loop until the model says the task is done.
That is too weak for autocomplete. The host should instead:

1. freeze a semantic endpoint and promise before showing the suggestion;
2. compile a route whose allowed actions are known;
3. verify after every primitive that the route remains within scope;
4. halt when the endpoint predicate is true, even if the model wants to
   continue;
5. cancel when the observed state diverges; and
6. create a new suggestion for any newly visible consequential action.

OpenAdapt's current compiler is a useful adjacent pattern: demonstrated
workflows compile to deterministic replay, verify identity/effects, and halt
rather than guess when the screen diverges. It is not goal-free, but its
fail-closed execution philosophy is a better fit than an unconstrained agent
loop.

### Commit and confirmation boundaries

Google and OpenAI both document a point-of-risk pattern: make safe progress,
then confirm immediately before the consequential action. This product should
implement a stricter host policy:

| Class | Current Tab may do it? | Examples |
| --- | --- | --- |
| Navigation / observation | Yes | Open app, switch window, scroll, reveal a pane, visit a URL |
| Ephemeral locator input | Yes, if clearly part of the route | Search query, filename filter, URL |
| Reversible local preparation | Yes, when the visible promise includes it | Select item, open draft view, fill a non-communicative filter |
| Authored communication or document prose | **No** | Draft email, Slack message, post, paragraph, code change |
| Consequential commit | **No; fresh Tab required** | Send, submit, publish, delete, purchase, grant access, merge |

The route model can label an action's intent, but it cannot classify away this
boundary. The host state machine is authoritative.

### Native macOS, browser chrome, and cross-app grounding

Pure screenshot models can click almost anywhere but have weak identity and
proof. The most reliable stack is layered:

1. **App Intents / Shortcuts / application APIs** for semantic actions and
   parameters when exposed.
2. **macOS Accessibility** for applications, windows, controls, roles, names,
   bounds, focus, and value changes.
3. **Browser extension, Chrome DevTools Protocol, and DOM/rrweb** for page,
   tab, URL, control identity, and navigation.
4. **Pixel grounding** only for browser chrome, custom canvases, and controls
   missing from structural layers.

No reviewed API delivers this Mac stack as a service. UI-TARS Desktop proves a
pixel-driven Mac path is runnable but documents multi-monitor fragility.
Google, OpenAI, and Claude require the application to own the harness.
OpenCUA provides cross-OS training evidence, not a turnkey native runtime.

## Data and tooling landscape

### What is available now

| Tool / approach | Useful primitives | Important gap for natural personal autocomplete data | Availability |
| --- | --- | --- | --- |
| [NAPsack](https://github.com/GeneralUserModels/napsack) | Passive screenshots and input events, event-burst grouping, VLM action captions, JSONL, annotated playback | Active-display and caption-centric output is not a guaranteed exact cross-app semantic destination ledger. Dylan's tested version needed a local negative-coordinate display fix. | Released Python tool; public repository does not present a clear top-level license in its current page. |
| [OpenCUA / AgentNetTool](https://github.com/xlang-ai/OpenCUA) | Human demonstration capture, video, input, accessibility/HTML evidence, review, standardized trajectories, offline evaluation; AgentNet spans three OSs | Task-scoped demonstrations with declared goals, not ambient natural work or personal usefulness labels; Mac/multi-monitor details need local validation | Released code, dataset, tools, and weights |
| [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture) | Local mouse/keyboard/screen capture, action-aligned screenshots/video, window bounds, typed canonical records, privacy components; current Mac window capture is live-validated | Current native structural observations are documented for Windows UIA, not emitted as macOS AX; recorder is experimental and demonstration-oriented | Released experimental MIT component |
| [Screenpipe](https://github.com/screenpipe/screenpipe) | Always-on local multi-monitor video/OCR/audio history, app/window metadata, search/API | Local audit found stale action-linked frames and weak secondary-monitor Accessibility identity; not exact label ground truth | Released open-source/local product |
| [rrweb](https://github.com/rrweb-io/rrweb) + CDP/browser extension | Exact web DOM snapshots, incremental mutations, inputs, navigation, and replay | Covers webpage content, not all browser chrome or native applications; needs careful privacy filtering | Released open source |
| [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) + Hammerspoon [`hs.axuielement`](https://www.hammerspoon.org/docs/hs.axuielement.html) / AXObserver | Native per-display frames, timestamps, input/focus/window events, Accessibility trees | Requires a custom join, semantic normalization, privacy handling, and browser instrumentation | Apple/native + open-source automation |
| [macapptree](https://github.com/MacPaw/macapptree) / `oa_atomacos` | Parse or query macOS Accessibility structures | AX coverage varies by app and does not identify arbitrary web DOM or opaque canvases | Released open source |
| Enterprise task mining: Mimica, Celonis, Skan; historical UiPath task mining | Ambient capture, workflow discovery, clustering, review, process export | Enterprise access, task/process objectives, Windows bias in some products, and no proof of strict pre-action dual-monitor semantic rows for a one-person Mac | Commercial enterprise products |
| FDM-1 inverse dynamics | Scales action labels from a smaller expert-labeled set to huge video | Not released; requires large training/data infrastructure and still produces primitive rather than semantic/usefulness labels | Company-reported research |

The earlier capture audits remain the strongest evidence about local reality:

- [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool
  research, July 23, 2026]]
- [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tool
  research, July 24, 2026]]
- [[screenpipe-natural-work-audit-2026-07-28|Screenpipe natural-work audit,
  July 28, 2026]]

### The scalable labeling pipeline that appears most defensible

The smallest credible path is:

1. **Capture a strictly prior state.** Maintain per-display ScreenCaptureKit
   ring buffers and freeze every display at the decision point before the
   human action.
2. **Capture exact structural evidence.** Join Hammerspoon/AXObserver state,
   application/window metadata, Arc/Chrome tab and URL state, DOM/rrweb events,
   and raw input timestamps.
3. **Construct a semantic destination candidate.** Use deterministic evidence
   first; use a VLM to propose a label only when structural identity is absent.
4. **Use later frames noncausally for labeling only.** Outcome evidence can
   disambiguate what happened, as FDM's inverse dynamics model does, but it
   must never leak into predictor input.
5. **Retain uncertainty.** Do not force an exact label from ambiguous pixels.
   Store candidate sets, evidence, and confidence for review.
6. **Add product labels.** Record whether a suggestion would have saved effort,
   whether it would have been accepted, its safe stopping point, and its commit
   class. Behavioral frequency alone cannot train expected usefulness.
7. **Graduate to learned inverse dynamics only after the schema is stable.**
   A label model trained on unstable semantic objects will scale inconsistency.

There is still no self-serve tool that turns arbitrary natural multi-monitor
Mac use into this complete ledger automatically. The missing part is not
screen recording; it is high-integrity semantic assembly and product judgment.

## Gap map

| Required capability | Best available component | What remains novel or unsolved |
| --- | --- | --- |
| Goal-free next-intent inference | LongNAP retrieval policy; PIRA/PIRF task-thread memory; A Click Ahead transitions | Real-time exact Mac destination/workflow ranking from one person's natural history |
| Candidate enumeration | App Intents, Accessibility, DOM/CDP, open windows/tasks, prior personal destinations | One stable cross-app semantic candidate ontology and adaptive candidate horizon |
| Personalization | LongNAP per-user adaptation/retrieval; Amazon Quick memory; Apple intent donations | Demonstrating that personal history improves useful acceptance beyond recency, frequency, and visible state |
| Expected usefulness | PIRA false-positive penalty; FC-MIR's useful/surprising analysis | A calibrated value model combining acceptance, effort saved, interruption, failure, privacy, and authority risk |
| Abstention | PIRA `IDLE`; LongNAP confidence filtering | Product-calibrated selective prediction with very low costly false-positive rate |
| Route planning | Gemini, OpenAI, Claude, UI-TARS, OpenCUA, Agent S | Low-latency Mac route success from a latent semantic endpoint, including browser chrome and multiple displays |
| Route verification | Deterministic AX/DOM/API postconditions; OpenAdapt fail-closed replay; CUWM research | Uniform endpoint predicates across opaque apps and visual-only states |
| Truthful suggestion text | Gemini per-action intent; semantic route plan | A compiler that guarantees displayed text equals the full set of allowed effects |
| Commit safety | Google/OpenAI point-of-risk confirmation guidance | A model-independent two-Tab authority state machine that excludes authored writing from preparation |
| Long personal history | LongNAP episodic retrieval; Screenpipe/Recall visual stores; structured summaries | Private, efficient, high-integrity retrieval over months of cross-app behavior |
| Scalable labels | NAPsack, AgentNetTool, OpenAdapt, FDM inverse dynamics | Strictly prior dual-monitor state + exact semantic destination + usefulness/commit labels without expensive review |
| Native macOS | Accessibility, ScreenCaptureKit, App Intents, Hammerspoon, UI-TARS Desktop | Reliable cross-app identity, browser chrome, opaque canvas handling, and multi-monitor route execution in one harness |

The boldest novel claim is not “a model can predict the next click.” FDM-1,
LongNAP, A Click Ahead, and older interface-prediction work all weaken that
claim. The novel product combination is:

> A personal semantic candidate ranker that only exposes useful completions,
> compiles them into bounded routes, and gives a truthful one-Tab promise under
> an explicit authority boundary.

## Likely build-versus-repackage boundary

### Build

- The cross-app semantic candidate schema: task, app, window, page/document,
  control, endpoint, route, effect, and commit class.
- Candidate enumerators over open tasks, recent personal destinations,
  suspended threads, App Intents, Accessibility, DOM, and browser history.
- The personal episodic memory and retrieval logic.
- Ranking by expected usefulness rather than next-action likelihood.
- Calibration, uncertainty, diversity, and the abstention policy.
- The exact suggestion-text compiler.
- The host route controller, endpoint verifier, divergence handling, and fresh
  Tab commit state machine.
- The local privacy, retention, exclusion, and redaction boundary.
- Product evaluation: useful suggestion rate, acceptance, saved effort,
  interruption, selective risk, promise fidelity, route success, and commit
  violations.

### Repackage or adapt

- Commercial computer-use APIs for visual route planning.
- UI-TARS or ShowUI as open local grounding controls.
- App Intents, Shortcuts, application APIs, Accessibility, CDP, DOM, and rrweb
  for deterministic navigation and postconditions.
- ScreenCaptureKit and existing recorder components for evidence capture.
- NAPsack/ScreenLLM/SummAct-style VLM labeling and summarization for drafts.
- OpenAdapt and UFO patterns for deterministic-first, fail-closed execution.
- LongNAP/PIRF patterns for episodic retrieval and suspended task threads.

### Watch, but do not depend on

- FDM-1 access, licensing, personal adaptation, and Mac feasibility.
- Photon-1 API/weights and whether it can accept latent goals at autocomplete
  latency.
- CUWM/ViMo-style action simulation for route-risk scoring.
- LongNAP code/weights and any exact-action rather than trajectory benchmark.
- OS-level moves from Apple, Microsoft, Amazon, Google, and Superhuman that
  expose richer semantic candidates or personal history.

## Prioritized MVP feasibility shortlist

### 1. History-conditioned semantic candidate ranker

**Priority:** highest.
**Use now:** current frontier multimodal model or lightweight ranker, retrieved
personal episodes, explicit candidate JSON.
**Do not use yet:** LongNAP reproduction or end-to-end FDM imitation.

Candidate sources should include:

- currently visible controls and destinations;
- open/recent windows, tabs, documents, and Codex tasks;
- source-conditioned personal transition frequencies;
- suspended intent threads;
- retrieved semantically similar past states; and
- safe bounded workflow templates.

The ranker returns expected value, uncertainty, rationale, route class, and
`ABSTAIN`. V5 predicts that recurring task destinations will be the first
useful category.

### 2. Gemini 3.6 Flash Computer Use as the primary route-planner trial

**Why first:** current desktop action space, per-action intent, configurable
safety decisions, and a low-latency sibling model.
**Unknowns to measure:** real Mac route success, Arc/browser-chrome grounding,
multi-monitor errors, p50/p95 time to first action and endpoint, and whether
its step intents are stable enough for promise auditing.

### 3. OpenAI `gpt-5.6` Computer use as the commercial control

**Why:** released screenshot/action loop, batched actions, custom harness
support, and strong documented point-of-risk semantics.
**Unknowns:** Mac grounding, latency, cost, exact stopping, and comparative
route success.

### 4. UI-TARS 1.5-7B as the local/private grounding control

**Why:** open weights, Apache-2.0, actual Mac desktop app, and a small enough
model to test local inference.
**Unknowns:** latency on Dylan's hardware, dual-monitor reliability, Arc
chrome, route success, and whether screenshot-only grounding is adequate.

### 5. LongNAP/NAPsack/PIRF as personalization and data references

Use NAPsack's segmentation/caption pipeline, LongNAP's retrieval design, and
PIRF's suspended intent/`IDLE` state machine as baselines. Do not treat any of
them as a shippable policy. A candidate ranker can test their useful ideas
without training their models.

## Concrete implications

1. **The initial product should autocomplete destinations and bounded routes,
   not primitive clicks.** Primitive actions are an execution detail and a
   poor user-visible promise.
2. **A semantic candidate list is a feature, not a compromise.** It makes
   usefulness, uncertainty, abstention, verification, and truthful text
   tractable. The strongest personal prediction precedents are candidate- or
   retrieval-driven.
3. **Separate “where/what” from “how.”** The personal layer infers and values a
   completion. A replaceable executor compiles it into actions. This protects
   the product from rapid model churn.
4. **Commit safety belongs outside the model.** Vendor safety decisions are
   useful signals, but the host must own the exact two-Tab boundary and the
   stricter authored-writing exclusion.
5. **The first latency budget is mostly a ranking and routing problem.** FDM's
   11-millisecond company claim is not the relevant bar if a commercial
   executor takes seconds. Candidate precomputation, deterministic routes, and
   a small local ranker may matter more than a larger policy.
6. **Personal data collection needs usefulness labels.** More state/action
   pairs can improve imitation while making the product more annoying. Record
   saved effort, acceptance, interruption, and safe stopping in addition to
   what the user did.
7. **Native structure should dominate pixels when available.** Accessibility,
   DOM, App Intents, and APIs improve identity, latency, verification, and
   safety simultaneously.
8. **The defensible metric is selective useful completion rate.** Report
   coverage versus accepted-and-correct suggestions, promise fidelity, route
   success, time saved, and authority violations. Raw next-action top-k is only
   a component metric.

## Next research and prototype tests

### Test 1: Candidate-ranking and abstention benchmark

Build an offline candidate set for at least 100 natural decision points. Score
the same candidates under:

1. state only;
2. recency and source-conditioned transition frequency;
3. retrieved correct personal history;
4. retrieved wrong-person or shuffled history; and
5. correct history plus an explicit usefulness/risk rubric.

Measure top-k target coverage, semantic exactness, acceptance/usefulness,
selective risk as the abstention threshold changes, and gains over simple
frequency. This decides whether a specialized personal ranker is warranted.

### Test 2: Safe Mac route-executor bakeoff

Run Gemini 3.6 Flash, OpenAI `gpt-5.6`, UI-TARS 1.5-7B, and a deterministic
AX/DOM route on the same 40–60 reversible endpoints across Arc/browser chrome,
Codex, Finder, System Settings, and at least two opaque native apps.

Measure:

- endpoint success;
- p50/p95 time to first action and completion;
- primitive action count;
- multi-monitor errors;
- divergence recovery;
- whether every executed effect stayed inside the visible promise; and
- whether the harness stopped immediately when the endpoint predicate became
  true.

### Test 3: Promise and commit-boundary adversarial suite

Create cases where safe navigation is followed by a tempting Send, Submit,
Delete, Share, Purchase, Publish, or authored-writing step. Also include
on-screen prompt injection and sensitive form fields. Verify that:

- the first Tab reaches only the declared reversible endpoint;
- no authored message or document prose is generated;
- the next consequential action becomes a new suggestion;
- a fresh Tab is necessary;
- vendor safety classifications cannot override the host; and
- the promise compiler catches route plans whose full effects exceed the text.

### Test 4: Semantic label assembly audit

On 100 manually adjudicated Mac actions, compare the current dual
ScreenCaptureKit + AX + browser evidence path with NAPsack/Screenpipe/VLM-only
reconstruction. Score strictly-prior frame validity, exact destination
identity, task-thread identity, action/locator/commit class, and review time.
This identifies where structural capture is worth product engineering and
where a label model could safely scale.

### Test 5: Shadow suggestion utility study

Run the ranker silently for several days. Later show Dylan the exact suggestion
that would have appeared and its planned stopping point, without execution.
Collect `would press`, effort saved, wrong/annoying, too obvious, too risky, and
preferred granularity. Use the result to set the first abstention threshold and
decide whether the valuable unit is usually a control, destination, or short
workflow.

If only one test runs next, run Test 1. If two run, pair it with Test 2. Those
separate the novel predictor risk from the increasingly commoditized executor
risk.

## Primary sources

### Goal-free and predictive research

- [LongNAP / Learning Next Action Predictors from Human-Computer
  Interaction](https://arxiv.org/abs/2603.05923), March 6, 2026; [project
  page](https://generalusermodels.github.io/nap/); [NAPsack
  repository](https://github.com/GeneralUserModels/napsack)
- [PIRA-Bench](https://arxiv.org/abs/2603.08013), March 9, 2026; [dataset and
  leaderboard](https://www.pira-bench.top/)
- [A Click Ahead](https://arxiv.org/abs/2309.12170), September 21, 2023
- [SummAct](https://doi.org/10.1145/3706598.3713190), CHI 2025
- [ScreenLLM](https://arxiv.org/abs/2503.20978), March 26, 2025
- [FC-MIR](https://arxiv.org/abs/2512.19107), December 22, 2025
- [The Invisible Mentor](https://arxiv.org/abs/2509.26557), September 30, 2025

### Models, agents, and world models

- [Induction Labs: Scaling Video Pretraining with Imagination
  Models](https://www.inductionlabs.com/news/scaling-video-pretraining), July
  23, 2026
- [Standard Intelligence: The First Fully General Computer Action
  Model](https://si.inc/posts/fdm1/), February 23, 2026
- [Computer-Using World Model](https://arxiv.org/abs/2602.17365), February 19,
  2026
- [Gemini Computer Use documentation](https://ai.google.dev/gemini-api/docs/computer-use)
- [OpenAI Computer use documentation](https://developers.openai.com/api/docs/guides/tools-computer-use)
- [Claude Computer Use documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- [UI-TARS repository](https://github.com/bytedance/UI-TARS) and [desktop
  application](https://github.com/bytedance/UI-TARS-desktop)
- [OpenCUA repository](https://github.com/xlang-ai/OpenCUA) and
  [paper](https://arxiv.org/abs/2508.09123)
- [Agent S repository](https://github.com/simular-ai/Agent-S)
- [Microsoft UFO repository](https://github.com/microsoft/UFO)
- [ShowUI repository](https://github.com/showlab/ShowUI)
- [AGUVIS project](https://aguvis-project.github.io/)
- [ViMo project](https://ai-agents-2030.github.io/ViMo/)
- [Code2World project](https://amap-ml.github.io/Code2World/)

### Products, native interfaces, and data tooling

- [Superhuman Go desktop guide](https://support.grammarly.com/hc/en-us/articles/45113077035789-Superhuman-Go-for-Windows-and-Superhuman-Go-for-Mac-user-guide)
  and [agents/connectors](https://support.grammarly.com/hc/en-us/articles/40642362241293-About-Superhuman-Go-agents-and-connectors)
- [Amazon Quick desktop](https://docs.aws.amazon.com/quick/latest/userguide/what-is-desktop.html)
  and [skills/scheduled agents](https://docs.aws.amazon.com/quick/latest/userguide/skills-and-agents-desktop.html)
- [Microsoft Recall and Click to Do](https://learn.microsoft.com/en-us/windows/client-management/manage-recall)
- [Apple App Intent donations and action
  prediction](https://developer.apple.com/documentation/appintents/donating-your-apps-data-and-actions-to-the-system)
- [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture)
- [OpenCUA / AgentNetTool](https://github.com/xlang-ai/AgentNetTool)
- [Screenpipe](https://github.com/screenpipe/screenpipe)
- [rrweb](https://github.com/rrweb-io/rrweb)
- [macapptree](https://github.com/MacPaw/macapptree)
- [Hammerspoon `hs.axuielement`](https://www.hammerspoon.org/docs/hs.axuielement.html)
- [Apple ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit)

## Vault links

- Project hub:
  [[personal-ai-context-learning|Personal AI Context Learning]]
- Active product scope:
  [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
- Local result boundary:
  [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
- Closest goal-free modeling lineage:
  [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Proactive-intent benchmark:
  [[pira-bench-proactive-intent-recommendation-agents-2026-03-09|PIRA-Bench tests proactive intent recommendation from continuous GUI screenshots]]
- Video-native model sources:
  [[induction-labs-scaling-video-pretraining-with-imagination-models-2026-07-23|Induction Labs: Scaling Video Pretraining with Imagination Models]]
  and
  [[standard-intelligence-fdm-1-fully-general-computer-action-model-2026-02-23|Standard Intelligence: FDM-1, a fully general computer action model]]
