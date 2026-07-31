---
type: project
status: complete
created: 2026-07-30
updated: 2026-07-31
aliases:
  - Computer-use autocomplete runtime decision audit
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
  - macos
tags:
  - runtime-audit
  - architecture-decision
  - computer-use
  - macos
---

# Computer-use autocomplete runtime decision audit

Research and local feasibility testing current through July 30, 2026.

## Decision status

The backend/runtime decision is **unfrozen**. Earlier Gemini and Codex
recommendations in
[[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete
V1 brainstorm and scope]] are historical, provisional inputs—not conclusions
for this audit.

This is an evidence-gathering and architecture-decision memo. It does not
authorize or implement an MVP.

> [!important] Subsequent V0 product decision, July 31, 2026
> The audit's product-owned local architecture remains the durable direction,
> but the approved V0 is narrower than the runtime recommendation below. It
> uses only deterministic app activation, window focus, structured Codex-task
> focus, and URL opening; it includes no computer-use execution model or opaque
> surface fallback. Codex app-server and Claude Code headless are first tested
> only as tool-free proposal providers under the same packet and schema. This
> preserves the audit's evidence while removing unneeded execution risk from
> the first habit-forming build.

## Product contract held fixed

The target is a Dylan-only prototype that can stay on during real work, produce
strong product signal, support a teammate demo, and record high-integrity
telemetry. It is proactive and goal-free:

- observe current and recent context;
- infer an unspoken useful completion;
- display one suggestion while silently logging the top three;
- let Tab accept a frozen visible promise;
- execute only bounded reversible preparation;
- require a fresh approval/Tab before authored or consequential action; and
- log ignores as ambiguous non-accepts rather than automatic negative labels.

Manual capability is not backend viability. A runtime must be evaluated
separately for:

1. a manual capability demonstration;
2. automatic invocation from the prospective lightweight local app; and
3. action-level observability and control suitable for a real personal
   prototype.

## Frozen decision framework

Frozen before runtime research and hands-on testing on July 30, 2026. New
evidence may change scores but not the criteria or weights below.

### Evidence labels

- **D — documented:** current official public documentation.
- **L — locally observed:** bounded test on Dylan's Mac.
- **I — inferred:** architectural implication from documented or observed
  facts.
- **U — unknown/blocker:** not established without additional access,
  permissions, infrastructure, or a consequential test.

### Scoring scale

Each weighted dimension receives 0–4:

- `0`: unavailable or disqualifying;
- `1`: manual-only, opaque, or materially fragile;
- `2`: callable with major gaps or babysitting;
- `3`: credible for a personally usable prototype;
- `4`: robust enough to preserve as a durable component.

Weighted totals are decision aids, not substitutes for hard gates. Unsupported
claims receive `U`, not an optimistic midpoint.

### Fixed weighted matrix

| Dimension | Weight | Fixed question |
| --- | ---: | --- |
| Automatic/programmatic invocation | 14 | Can a lightweight local app start proposal and execution turns without Dylan operating another UI? Is the surface documented or only locally/private callable? |
| Surface and host-app coverage | 12 | Can it address Arc, Codex, VS Code, Claude, browser chrome, multiple monitors, and opaque apps? Can it target its own host, and what exact boundary prevents it? |
| Latency | 12 | What are p50/p95 time to proposal, first action, and verified route completion on the identical route when at least five valid trials exist? |
| Foreground takeover/interference | 8 | How much does capture, reasoning, focus, or actuation interrupt Dylan's concurrent work? |
| Observability, cancellation, verification, recovery | 14 | Are planned and dispatched actions visible before execution? Can the host cancel, reject stale results, verify endpoints, detect divergence, and recover fail-closed? |
| Proposal-only and two-Tab authority | 10 | Can proposal turns be tool-free, and can the host—not the model—enforce a fresh approval before authored or consequential action? |
| Telemetry fidelity | 10 | Can the ledger distinguish top-three predictions, display, accept, dismiss, ignore, override, staleness, model actions, execution failures, endpoints, and stage latency without post-hoc guessing? |
| Setup to personal usability | 6 | What effort and continual babysitting are required on Dylan's present Mac? |
| Brittleness and migration/discard cost | 7 | Does the path depend on unsupported/private interfaces, app UI details, or a provider-specific actuator? Can the predictor, planner, actuator, and verifier be replaced separately? |
| Security and privacy | 7 | What screenshots, metadata, history, or sensitive state leave the Mac? Can capture/transmission fail closed and remain inspectable for a one-user prototype? |
| **Total** | **100** | |

### Hard gates for a sole primary backend

A runtime cannot be the sole primary backend unless local evidence establishes:

1. automatic invocation without a person operating the provider UI;
2. a complete route to Dylan's high-frequency surfaces, including Codex,
   through the same actuator or an explicit structured adapter;
3. action-level observation and prompt cancellation;
4. host-enforced proposal-only and fresh-Tab commit boundaries;
5. causal action/outcome telemetry, stale-result rejection, and endpoint
   verification; and
6. repeated operation without continual babysitting.

A runtime that misses a hard gate can still be a manual baseline, specialized
adapter, planner, or fallback.

## Frozen identical-route local protocol

Frozen before inspecting the candidate runtimes. Tests are bounded to
reversible focus/navigation on already-open, public-safe Arc, Codex, VS Code,
and Claude surfaces. No message, prompt, form, edit, publication, install,
permission change, credential display, or consequential command is allowed.

### Test objects

Use one already-open public-safe object per application and assign local labels
instead of publishing unrelated titles:

- `A1`: Arc tab;
- `C1`: Codex task;
- `V1`: VS Code document or editor tab;
- `L1`: Claude task/conversation surface.

The private local evidence log may retain exact object identities only when
needed for reproducibility. The public memo records the labels and observable
endpoint predicates.

### Starting-state rule

Before each valid trial:

1. focus `V1`;
2. ensure `A1`, `C1`, and `L1` remain open;
3. record frontmost app, target labels, display layout, runtime/version, and a
   monotonic start time;
4. clear only the runtime's pending route/request state; and
5. do not rearrange unrelated windows or close Dylan's work.

If a runtime cannot be reset without manual UI work, record that as setup or
babysitting cost.

### Route cases

1. **Simple app focus:** from `V1`, focus the already-running target app.
2. **Exact object focus:** focus each of `A1`, `C1`, `V1`, and `L1`, not merely
   the containing app.
3. **Bounded multi-step route:** `V1 -> C1 -> A1`, stopping when the exact Arc
   endpoint is visibly current.
4. **Cancellation:** begin the multi-step route, cancel after the first
   observed action, and verify that no later action dispatches.
5. **Commit stop:** navigate to an already-open surface containing a
   Send/Submit/Edit/Publish affordance, reveal or focus it if reversible, and
   stop before typing or activating it.

### Measurements

For each genuinely testable runtime, record:

- invocation success and manual steps;
- target success and endpoint evidence;
- proposal latency, first-action latency, and completion latency;
- number and type of primitive actions;
- foreground focus changes and interference;
- whether actions were inspectable before dispatch;
- cancellation time and any action after cancellation;
- stale-result behavior;
- endpoint verification and divergence behavior;
- whether the consequential boundary was respected;
- model-versus-human origin attribution; and
- exact blockers.

Report individual timings for fewer than five valid trials. Report p50/p95 only
with at least five comparable trials; do not manufacture percentiles from one
demonstration.

## Runtime matrix

The score abbreviations preserve the frozen dimension order:

- `A`: automatic invocation;
- `B`: surface and host-app coverage;
- `C`: latency;
- `D`: interference;
- `E`: observability, cancellation, verification, and recovery;
- `F`: proposal-only and two-Tab authority;
- `G`: telemetry;
- `H`: setup;
- `I`: brittleness and migration cost; and
- `J`: security and privacy.

Scores describe the runtime/control substrate, not next-destination prediction
quality. A high score for native control does not make it a semantic planner.
A blocked candidate is not eligible merely because its documented architecture
scores well.

| Candidate | A | B | C | D | E | F | G | H | I | J | Weighted | Hard-gate status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Codex Desktop Computer Use + app-server | 3 | 1 | 2 | 1 | 3 | 2 | 3 | 3 | 2 | 2 | **56.0** | **Fail:** cannot target Codex; external plugin invocation and turn-level tool exclusion were not locally established |
| Claude Desktop/Cowork/Claude Code | 2 | 1 | 1 | 1 | 2 | 3 | 2 | 1 | 2 | 2 | **43.0** | **Fail:** installed Computer Use was not externally configured or approved; Desktop is interactive-only |
| Anthropic Computer Use API + Mac actuator | 4 | 3 | 1 | 2 | 4 | 4 | 4 | 1 | 3 | 4 | **77.8** | **Blocked:** no API credential or completed actuator on this Mac |
| OpenAI GPT-5.6 Computer Use API + Mac actuator | 4 | 3 | 1 | 2 | 4 | 4 | 4 | 1 | 3 | 3 | **76.0** | **Blocked:** Codex account auth is not an API key; no completed client actuator |
| Gemini Computer Use API + Mac actuator | 4 | 3 | 1 | 2 | 4 | 4 | 4 | 1 | 2 | 2 | **72.5** | **Blocked:** no Gemini API key/ADC, no completed actuator, and the tool remains preview |
| Deterministic native macOS control | 4 | 2 | 2 | 3 | 4 | 4 | 4 | 2 | 3 | 4 | **81.3** | **Fail alone:** strong actuator and authority substrate, but not an open-ended semantic planner; exact cross-app object adapters are incomplete |
| Product-owned hybrid | 4 | 3 | 2 | 3 | 4 | 4 | 4 | 2 | 4 | 3 | **84.3** | **Recommended architecture, not yet gate-complete:** measured actuator and host adapter work; proposal latency and unattended end-to-end operation remain to be proved |

### Why the rows scored this way

#### 1. Codex Desktop Computer Use, app-server, and noninteractive Codex

**Documented capability.** Codex app-server is an official JSON-RPC integration
surface with threads, turns, approvals, streamed events, and `turn/interrupt`;
stdio is supported and WebSocket remains experimental. `codex exec` also
supports noninteractive JSONL event output, output schemas, sandboxing, and
resume. The installed desktop Computer Use feature supplies the actual Mac
screenshot/Accessibility loop. [Codex app-server
documentation](https://learn.chatgpt.com/docs/app-server), [noninteractive
mode](https://learn.chatgpt.com/docs/non-interactive-mode), and [Computer Use
documentation](https://learn.chatgpt.com/docs/computer-use) are the relevant
official surfaces. **D**

**Local capability.** Codex Desktop `26.721.81911`, `codex-cli 0.144.6`, and
`computer-use@openai-bundled 1.0.1000502` are installed and enabled. The
current trusted plugin runtime could read and act on Arc and VS Code. It
exposed a fresh screenshot plus Accessibility tree after every action. **L**

**Exact host boundary.** A local state request against Codex returned:
`Computer Use is not allowed to use the app 'com.openai.codex' for safety
reasons.` This matches the official statement that the feature cannot automate
ChatGPT itself. Codex is therefore a hard hole for this product, not an edge
case. A separate structured Codex navigation call successfully focused `C1`,
which proves that a hybrid adapter can bridge the hole; it does not make the
Computer Use actuator host-complete. **D/L**

**Invocation boundary.** Generated local app-server schemas confirm
`thread/start`, `turn/start`, `turn/interrupt`, `plugin/list`, approvals, and
streamed tool events. `TurnStartParams` has model, sandbox, approval,
input/output-schema, and thread fields, but no per-turn tool allowlist. The
proposal/execution split therefore needs separate locked-down configuration or
a product-owned dispatcher; an instruction saying “do not act” is not an
authority boundary. **L/I**

The live external `app-server` and `codex exec` smoke tests stopped before
model invocation because this audit task can read but cannot write
`~/.codex/state_5.sqlite`; both commands attempted to initialize that state
database. That is an audit-sandbox blocker, not evidence that a normal local
app cannot invoke app-server. It does mean the external Computer Use plugin
path, action event fidelity, and interrupt latency remain unproved here. **U**

**Conclusion.** Keep Codex Desktop Computer Use as the manual/reference
baseline and possible opaque-app fallback. Do not make it the sole executor.
Do not directly embed its private `@oai/sky` runtime; app-server is public, but
the bundled Mac actuator is not a documented distributable SDK. **I**

#### 2. Claude Desktop, Cowork, and Claude Code

Claude Desktop `1.24012.9` and Claude Code `2.1.119` are installed. Claude Code
has a documented headless surface (`claude -p`) with JSON/streaming output and
schema constraints. Its tool permission model can remove tools entirely or
combine `allowed_tools` with `permissionMode: dontAsk`, which is stronger for a
proposal-only turn than a prompt-only prohibition. [Claude Code headless
mode](https://code.claude.com/docs/en/headless) and [Agent SDK
permissions](https://code.claude.com/docs/en/agent-sdk/permissions) document
those controls. **D/L**

Claude Desktop Computer Use is a research preview that requires the app to
stay open. The official desktop matrix says browsers are view-only,
terminals/IDEs are click-only, and other apps have fuller control. The same
documentation explicitly says Desktop is interactive-only: `--print`,
`--output-format`, and related automation flags are CLI features, not Desktop
features. [Claude Desktop
documentation](https://code.claude.com/docs/en/desktop) and [Cowork Computer
Use support](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork)
make the manual/programmatic distinction clear. **D**

Locally, no Computer Use MCP was configured for Claude Code. Codex's installed
Mac controller returned `Computer Use was not approved to use Claude`, so the
identical `L1` leg could not run without a permission change. The safe
tool-free `claude -p` proposal probe produced no JSON within 60 seconds in the
audit environment, so it is not a valid latency sample. No prompt was sent
through Claude Desktop and no permission was changed. **L/U**

Whether Claude Desktop Computer Use can target Codex specifically remains
unknown. The official tier table does not name Codex, and a manual UI success
would still not establish automatic invocation, event observability, or
unattended cancellation from the prospective app. **U**

**Conclusion.** Claude Code remains a credible replaceable proposal engine
because its headless tool exclusion is strong. Installed Claude
Desktop/Cowork Computer Use is not a viable backend on the evidence collected.

#### 3. Anthropic Computer Use API plus a client-side Mac actuator

Anthropic's public Computer Use tool is client-side: the API returns computer
tool calls, while the client owns screenshots, mouse/keyboard execution, and
the continuation loop. That is a good authority and telemetry shape because
the product can inspect, reject, label, and stop every action. The tool remains
beta. [Anthropic Computer Use
documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
and the [tool
reference](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference)
describe that split. **D**

The API path can be zero-data-retention eligible; screenshots and files are
captured/stored in the client environment and processed by the API, but the
consumer Claude product is a separate retention regime. [Anthropic API data
retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
is the relevant policy for an API-backed prototype. **D**

No Anthropic API environment credential or separate SDK credential store was
present. Claude subscription auth is not evidence of API authorization. With
no completed Mac actuator, no safe live API route or latency test was
available. **L/U**

#### 4. OpenAI GPT-5.6 Computer Use API plus a client-side Mac actuator

OpenAI's public `computer` tool uses GPT-5.6 and returns batched `actions[]`.
The client must execute each batch, capture the resulting screenshot, and
continue the loop. A custom tool/harness is also supported. This makes
proposal/execution separation, commit interception, action IDs, cancellation,
and endpoint verification product-owned rather than provider-UI-owned.
[OpenAI Computer Use API
documentation](https://developers.openai.com/api/docs/guides/tools-computer-use)
describes the loop. **D**

Default API abuse-monitoring logs may retain customer content for up to 30
days; approved Modified Abuse Monitoring or Zero Data Retention changes that
regime. [OpenAI API data
controls](https://developers.openai.com/api/docs/guides/your-data) must
therefore be treated as part of the runtime choice, not an afterthought. **D**

No `OPENAI_API_KEY` or OpenAI API credential store was present. Codex
subscription/account auth does not establish public API access. No client Mac
actuator existed outside the installed Codex plugin, so there was no honest
live API route test. **L/U**

#### 5. Gemini Computer Use API plus a client-side Mac actuator

Gemini Computer Use is a public-preview client-side action loop with browser,
mobile, and desktop action vocabulary. Google currently recommends Gemini 3.6
Flash and positions 3.5 Flash-Lite for lower-latency work. The client still
owns execution, screenshots, confirmation policy, logging, and state
verification. [Gemini Computer Use
documentation](https://ai.google.dev/gemini-api/docs/computer-use) and the
[Gemini API changelog](https://ai.google.dev/gemini-api/docs/changelog) are the
official sources. Neither publishes a usable p50/p95 SLA for Dylan's route.
**D/U**

Google's unpaid and paid service terms differ materially: unpaid content may
be used to improve products, while paid service content is not used that way.
Interactions API storage and optional logging also need explicit
configuration. [Gemini API
terms](https://ai.google.dev/gemini-api/terms) and [logs/datasets
documentation](https://ai.google.dev/gemini-api/docs/logs-datasets) make
“Gemini” an incomplete privacy specification without tier and storage
settings. **D**

There is no installed Gemini CLI, `GEMINI_API_KEY`, or Google application
default credential. Existing local Antigravity configuration is not proof of
Gemini API authorization. No live probe was run, and the audit did not install
software or ask for credentials. **L/U**

**Conclusion across public APIs.** All three are planner/tool-loop candidates,
not Mac actuators. None earns the backend decision from documentation alone.
They must be compared over the same product-owned actuator and context packet.
The prior Gemini-first recommendation had no such common local bakeoff and is
therefore superseded.

#### 6. Deterministic native macOS control

The durable primitives exist publicly:

- Accessibility exposes structured UI attributes and actions through
  `AXUIElement` and `AXUIElementPerformAction`;
- ScreenCaptureKit can capture current frames;
- `NSRunningApplication` can request app activation; and
- Core Graphics events cover bounded keyboard/mouse fallback.

These APIs are documented by Apple: [Accessibility
elements](https://developer.apple.com/documentation/applicationservices/axuielement),
[performing Accessibility
actions](https://developer.apple.com/documentation/applicationservices/1460434-axuielementperformaction),
[ScreenCaptureKit
screenshots](https://developer.apple.com/documentation/screencapturekit/scscreenshotmanager),
[application
activation](https://developer.apple.com/documentation/appkit/nsrunningapplication),
and [Core Graphics
events](https://developer.apple.com/documentation/coregraphics/cgevent). **D**

Dylan already has Hammerspoon `1.1.1` and a local observer that records screen
layout, app activation, Accessibility observers, input, window state, and
action-bound completion evidence. Existing local evidence showed two displays
and successful Accessibility observer attachment to Arc, ChatGPT/Codex, VS
Code, and Claude. That is important: native Accessibility is not subject to
Codex Computer Use's self-host policy. **L**

The current Hammerspoon configuration does not load `hs.ipc`; the `hs` CLI
returned `Connection invalid`. This audit did not change the config or
permissions. Therefore pure Hammerspoon actuation was not live-invocable from
the external audit shell. **L/U**

The installed Codex Mac bridge did provide a bounded hands-on test of the same
kind of native, app-targeted Accessibility action plus screenshot/tree
verification. It raised and verified exact Arc and VS Code objects with no
text entry or consequential click. This proves local actuator feasibility, but
not that the private bridge should be embedded. **L/I**

**Conclusion.** Native control is the strongest authority, telemetry, latency,
privacy, and host-coverage substrate. It needs app-specific object adapters
and a visual fallback, and it is not the semantic proposal engine.

#### 7. Product-owned hybrid

The recommended shape combines:

1. a local observer, authority state machine, overlay, cancellation path, and
   causal episode ledger;
2. deterministic adapters for app/window activation, Arc/browser structure,
   Codex task focus, VS Code document focus, Claude surfaces, and endpoint
   predicates;
3. ScreenCaptureKit plus bounded coordinate/key fallback only when structure
   is insufficient;
4. a replaceable proposal model behind
   `propose(contextPacket) -> ranked completions | ABSTAIN`; and
5. an optional replaceable route planner behind
   `plan(frozenCompletion, currentState) -> bounded proposed actions`.

The product, not a model, dispatches each allowed action. The commit point is a
state transition the executor cannot cross without a new Tab event. This
architecture can use Codex app-server first for proposal feasibility without
making Codex Computer Use the universal actuator. It can later compare public
Anthropic, OpenAI, Gemini, or local models without replacing the observer,
authority boundary, actuator, verifier, or telemetry schema.

## Local test results

### Setup and authorization inventory

| Item | Local result |
| --- | --- |
| Mac | macOS 26.5.2 |
| Displays | Two displays in the latest local Hammerspoon screen record: built-in 1512×982 and external 2560×1440 |
| Codex | Desktop 26.721.81911; CLI 0.144.6; Computer Use plugin 1.0.1000502 installed/enabled |
| Claude | Desktop 1.24012.9; Claude Code 2.1.119; no Computer Use MCP configured |
| Browser/editor | Arc 1.157.1; VS Code 1.130.0 |
| Native harness | Hammerspoon 1.1.1; observer loaded, external IPC not loaded |
| Public API auth | No OpenAI, Anthropic, or Gemini API environment credential; no Google ADC |
| Raw evidence | Read locally only; no screenshot or personal event log added to Git |

Credential checks recorded presence/absence and variable names only. No token,
credential value, private screenshot, or unrelated app content was printed or
committed.

### Remaining setup before personal usability

| Candidate | Remaining setup on this Mac |
| --- | --- |
| Codex Desktop path | Moderate and uncertain: prove external app-server plugin retention, create a genuinely tool-free proposal configuration, consume events/interrupts, and add a Codex self-target adapter |
| Claude Desktop/Cowork | High/unknown: configure or approve Computer Use and still add an external programmatic control/observation surface; a manual Desktop task is insufficient |
| Claude Code proposal-only | Low-to-moderate: headless/tool-free flags exist, but the local latency/connectivity probe must first complete reliably |
| Any public Computer Use API | High: obtain the relevant API access and implement the same client-side Mac actuator, verifier, safety state machine, and ledger |
| Deterministic native control | Moderate: expose a supported local command surface and add exact Arc/Codex/VS Code/Claude adapters; the observer and permissions are already partly present |
| Product-owned hybrid | Moderate and lowest-discard: combine the native work above with one replaceable proposal adapter; none of the control or telemetry work is provider-specific |

### Identical-route bakeoff

Only the installed Codex Computer Use bridge and the structured Codex task
adapter were genuinely testable without changing permissions or adding
credentials. The public APIs and Claude Desktop Computer Use were not assigned
fictional route results.

| Test | Codex Computer Use bridge | Structured/native hybrid | Claude Desktop/Cowork | Public APIs |
| --- | --- | --- | --- | --- |
| Simple app focus | `V1` pass; `A1` pass | `C1` adapter pass | `L1` blocked by app approval | Blocked before invocation |
| Exact object focus | `V1` exact document pass; `A1` exact tab/page pass | `C1` exact current task pass | Not run | Not run |
| `V1 -> C1 -> A1` | Fail at `C1` due host prohibition | One bounded demonstration passed using native `V1`, structured `C1`, native `A1` | Not run | Not run |
| Cancellation after first action | Passed at controller boundary; zero later actions dispatched | Same product-owned boundary | Not run | Not run |
| Stop before consequential action | Passed: arrived at existing editable surface; issued no click, key, text, value-set, Send, Submit, Edit, or Publish action | Same | Not run | Not run |
| Endpoint verification | Fresh screenshot + Accessibility tree after every native action | Structured adapter returned navigation success; native endpoints re-read | Not established | Client-owned in docs; not locally established |

The `V1 -> C1 -> A1` hybrid demonstration proves composition, not unattended
route execution. It required three explicit controller calls, which is exactly
the control plane a prototype must automate and log.

The Arc and VS Code exact-object passes reactivated the objects that were
already selected inside their respective apps. They do not prove arbitrary
hidden-tab/document selection. In particular, the observed Arc Accessibility
tree exposed the current page and application menus but not a complete Arc
sidebar/tab model; the existing Arc-specific navigation adapter is still
needed for browser-chrome coverage.

### Measured native action latency

Each valid sample includes the `Raise` action and a fresh screenshot plus
Accessibility-tree endpoint check. It excludes model proposal time.
Percentiles use the nearest-rank convention; with five trials, p95 is the
slowest observed valid sample.

| Endpoint | Five samples (ms) | p50 | p95 |
| --- | --- | ---: | ---: |
| Exact `V1` | 640, 656, 636, 616, 632 | **636 ms** | **656 ms** |
| Exact `A1` | 593, 580, 589, 601, 562 | **589 ms** | **601 ms** |
| Paired `V1 -> A1` action/verify route | 1,233, 1,236, 1,225, 1,217, 1,194 | **1,225 ms** | **1,236 ms** |

One full hybrid `V1 -> C1 -> A1` demonstration recorded 706 ms for the `V1`
leg and 611 ms for the `A1` leg; the structured `C1` call succeeded but the
tool wrapper did not expose a comparable local duration. No percentile is
reported from that one route.

Proposal latency is **unmeasured**, not zero:

- Codex app-server/exec stopped at the read-only state-database blocker before
  invocation;
- the tool-free Claude Code probe produced no output within 60 seconds in the
  audit environment; and
- the public APIs had no credentials.

There is therefore no evidence-backed provider latency winner in this audit.

### Interference, cancellation, staleness, and recovery

- Native focus routes necessarily take the foreground for the action, but the
  measured controller issued one explicit focus change at a time. There was no
  model wandering or hidden click sequence. **L**
- App-server documents `turn/interrupt`, and Claude headless streams events,
  but neither Computer Use execution path was locally exercised from the
  external app. **D/U**
- The native controller can cancel between primitives because it owns
  dispatch. The cancellation case stopped after `V1`; no `C1` or `A1` action
  was issued. **L**
- Fresh Accessibility/screenshot state was required after every action.
  Element indices were not reused across state refreshes. **L**
- Stale proposal rejection, focus-epoch invalidation, and endpoint recovery
  are not provider features to trust implicitly. They belong in the
  product-owned authority state machine and ledger. **I**
- A public computer-use API can propose a batch, but the local host should
  still split it into inspectable primitives and stop at divergence or commit
  risk. **I**

### Telemetry implications

The observed native action surface and all three public API loops can support
high-integrity telemetry only if Dylan's local shell assigns the causal IDs.
The minimum episode record should keep separate fields for:

- top-three proposals and which one was displayed;
- displayed, accepted, ignored, dismissed, and manually overridden outcomes;
- proposal context epoch and staleness reason;
- frozen visible promise;
- planner-proposed action, host-dispatched action, and human action;
- precondition, endpoint predicate, verification result, and failure reason;
- proposal, acceptance, first-action, and completion timestamps; and
- commit boundary requested, approved, declined, or expired.

Provider transcripts alone cannot reliably infer ignores, overrides, human
actions, stale invalidation, or whether an endpoint was reached for the
intended reason.

## Blockers and uncertainties

1. **No complete runtime passed every hard gate.** The recommendation is the
   architecture to prototype, not a claim that an unattended backend is ready.
2. **Codex external plugin invocation remains unproved.** The protocol is
   documented and locally generated, but the audit sandbox could not write the
   Codex state database.
3. **Proposal-only Codex turns need a real authority test.** The local
   `TurnStartParams` schema lacks a per-turn tool allowlist.
4. **Claude Computer Use is not locally configured/approved.** A manual
   Desktop demonstration would not settle programmatic control.
5. **Public API performance is unknown on Dylan's context packet and route.**
   Product naming and “Flash” positioning are not latency evidence.
6. **Native exact-object coverage needs a route adapter spike.** Hammerspoon
   can observe all four apps, and native actions worked in Arc/VS Code, but
   exact Codex/Claude object targeting through a public local controller was
   not completed.
7. **Browser chrome and opaque-app coverage are incomplete.** The current Arc
   page was verifiable, but hidden Arc tabs/sidebar state and a screenshot-only
   opaque-app route were not exercised.
8. **Multi-monitor interference needs a relocated-window test.** Two displays
   are visible to the local observer, but this audit did not rearrange Dylan's
   windows to manufacture a test.
9. **Consumer-product privacy is not API privacy.** Codex/Claude subscription
   auth and public API data controls must not be conflated.

## Recommendation

### Fastest personally usable prototype

Build the first runtime as a **product-owned local hybrid**, not a
provider-owned desktop agent:

`local observer + authority/Tab state machine + overlay + ledger + native/app
adapters + replaceable proposal call`

Use the already-present Hammerspoon/context observer as an input source, add
deterministic Arc/VS Code/Codex/Claude focus adapters and endpoint predicates,
and keep every dispatched action in the local controller. Use Codex app-server
as the first **proposal-only feasibility spike** because it is already
installed and has an official programmatic surface—not because installation
makes it the winner. If it cannot be locked tool-free or meet the proposal
latency budget in a normal unsandboxed local client, replace only the proposal
adapter.

Keep installed Codex Computer Use as a manual route baseline and optional
opaque-app fallback. Do not make it the main executor because it cannot target
Codex, one of Dylan's dominant destinations.

Do not select Gemini first yet. The prior recommendation pivoted from the
Codex host hole to Gemini without a common actuator, credentialed test, or
measured latency. This audit found no new evidence that closes those gaps.

### Best durable architecture

Preserve the same local shell and split the stack into independently
replaceable components:

1. context observer and local redaction/filtering;
2. next-destination ranker;
3. visible promise and authority state machine;
4. deterministic structured actuator;
5. optional visual planner/fallback;
6. endpoint verifier and recovery policy; and
7. causal episode ledger.

Prefer structure before pixels: app/window APIs, Accessibility, browser
structure, and app-specific task/document adapters first; screenshot-guided
computer use second; raw coordinates last. Public OpenAI, Anthropic, Gemini,
and future local models should compete behind the same proposal and planning
contracts over the same actuator. The two-Tab boundary stays local and cannot
be delegated to any model.

### Evidence that would change the decision

Change the recommendation only after a common, credentialed, five-trial
bakeoff shows one of the following:

- Codex app-server can automatically invoke and stream the installed Computer
  Use plugin, exclude actions on proposal turns, interrupt execution, and pair
  with a complete low-maintenance Codex adapter at acceptable p95 latency;
- Claude exposes a documented noninteractive Computer Use path on this Mac
  with action events, cancellation, exact Codex targeting, and no manual
  Desktop operation;
- OpenAI, Anthropic, or Gemini materially wins proposal and completion p95,
  endpoint success, privacy, and cost on the identical product-owned actuator;
- native Arc/Codex/VS Code/Claude adapters fail often enough in real work that
  visual-first control requires less babysitting; or
- a local model reaches the same top-three proposal quality and latency,
  making cloud screenshot/context transmission unnecessary.

Until then, provider neutrality is not indecision. It is the architecture
supported by the evidence.

## Sources

Official product and platform documentation is linked inline above. Local
evidence came from installed version/config inspection, generated Codex
app-server schemas, bounded Accessibility focus/verification calls, the
existing ignored Hammerspoon observer log, and non-mutating credential
presence checks. No private raw evidence was added to the public vault.

## Links

- [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use
  autocomplete V1 brainstorm and scope]]
- [[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The
  computer-use autocomplete wedge is intent ranking, not another computer-use
  agent]]
- [[computer-use-autocomplete-mvp-context-stack-2026-07-30|The fastest
  credible MVP context stack is a thin Mac observer plus a product-owned
  ledger]]
- [[personal-ai-context-learning|Personal AI Context Learning]]
