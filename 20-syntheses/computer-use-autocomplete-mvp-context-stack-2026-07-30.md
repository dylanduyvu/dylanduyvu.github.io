---
type: synthesis
status: proposed
created: 2026-07-30
updated: 2026-07-31
projects:
  - computer-use-autocomplete
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - computer-use
  - macos
tags:
  - context-capture
  - event-logging
  - prospective-evaluation
  - hammerspoon
  - screenpipe
  - browser-extension
---

# The fastest credible MVP context stack is a thin Mac observer plus a product-owned ledger

Research current through July 30, 2026.

> [!important] V0 narrowing, July 31, 2026
> This synthesis preserves the fuller context-stack design space. The approved
> V0 keeps its complete product-owned episode ledger, packet persistence,
> idle-boundary events, and secret fail-closed test, but defers the Arc
> extension and any computer-use executor. V0 executes only app activation,
> window focus, structured Codex-task focus, and URL opening. Its immediate
> gates are proposal latency, exact Codex-task identity in the packet, and zero
> Tab interception during typing or unsafe focus. The approved contract in
> [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete
> V1 brainstorm and scope]] is authoritative where this broader synthesis
> differs.

## Executive recommendation

Build the minimum context/history system from four small pieces:

1. **Hammerspoon as the authoritative Mac observer.** Reuse a reduced version
   of the already-proven July 24 spike for physical clicks, shortcut keys,
   scroll bursts, application activation, focused-window changes, display
   resolution, idle time, and lightweight Accessibility metadata.
2. **The existing Arc extension as an optional browser identity adapter.** Keep
   only tab activation and committed navigation events for V1. Do not put
   rrweb, continuous DOM capture, or CDP element labeling on the hot path.
3. **One-shot transition screenshots.** Start with Hammerspoon screen snapshots
   scheduled outside the event callback. At a prediction trigger, capture the
   focused window's display at model resolution and the other display as a
   small thumbnail. If calibration shows Hammerspoon capture stalls or returns
   stale frames, replace only the screenshot function with a tiny
   `SCScreenshotManager` helper—not a continuous ScreenCaptureKit recorder.
4. **A product-owned SQLite ledger and packet builder.** The autocomplete
   product must own prediction opportunities, candidate scores, presentation,
   acceptance, execution, effects, and causality. No general recorder can infer
   those states as reliably as the product that creates them.

This is **Option B** below. It is the fastest stack that is credible for a
go-forward shadow loop on Dylan's known Mac. Most of its risky primitives have
already been exercised locally. It avoids two failure-prone joins:

- joining Screenpipe actions back to its independently sampled frames; and
- inferring which captured events came from the model after the fact.

It is also materially smaller than the July 24 exact-label capture layer. That
layer solved a different problem: building leakage-safe state/action training
pairs with exact semantic targets. The MVP only needs enough recent state to
condition a model and enough prospective telemetry to learn whether a
suggestion helped.

**Do not use Screenpipe, ActivityWatch, OpenAdapt Capture, NAPsack, or
AgentNetTool as the authoritative MVP event stream.** Screenpipe can remain an
optional debugging/search sidecar. ActivityWatch is useful prior art for
app/tab/idle context, but its input watcher is aggregated. OpenAdapt and
AgentNetTool are demonstration recorders. NAPsack's cursor-display and
coordinate behavior already failed on this machine. None eliminates the
product-owned ledger.

## The decision in one sentence

> Reuse the observer edges already proven on Dylan's Mac, capture a few images
> at state boundaries, and make the autocomplete product—not a passive
> recorder—the source of truth for every prediction and model action.

## Why the old acquisition gate does not apply

The prior capture work asked whether a recorder could recover at least roughly
90% of meaningful actions as exact semantic labels with leakage-safe
pre-action frames from both monitors. That requirement drove:

- one continuous ScreenCaptureKit stream per display;
- rrweb and CDP node identity;
- `oa_atomacos` element-at-point queries and `macapptree` tree dumps;
- strict frame/action timestamp matching;
- post-hoc reconstruction and manual review.

Those are defensible requirements for a retrospective training or evaluation
dataset. They are not requirements for the current MVP.

### Runtime context sufficiency

For runtime prediction, a coarse event such as:

```text
14:03:21.227 human click on display 2 at (1842, -311)
14:03:21.261 focused window remains Arc / Gmail
14:03:21.640 state stabilized; transition screenshot S-184
```

can be useful even if the observer cannot name the clicked DOM node. The model
receives the resulting pixels, current destination identity, and recent
chronology. The event says that the user advanced the state; the screenshot
shows what changed.

### Exact dataset-label fidelity

A supervised state/action example would need to establish what control was
clicked, the exact pre-action frame, whether the action was physical or
synthetic, and whether later pixels leaked into the input. Screenpipe's
post-click frame links, secondary-display semantic gaps, and duplicate event
rows are disqualifying for that job.

The MVP should preserve timestamps, origin, coordinates, and state references
so better labels can be derived later. It should not make exact labels a launch
dependency.

## Exact minimum event and state schema

Use the observer process's monotonic clock for authoritative local ordering and
UTC wall time for inspection. Preserve a producer timestamp and sequence when
a browser or executor message has one, but assign its join timestamp and ID
when the observer ingests it. Assign IDs before asynchronous screenshot or
database work.

### 1. Meaningful event envelope

Every event needs:

| Field | Minimum value |
|---|---|
| `event_id` | Locally generated sortable ID |
| `wall_time_utc` | ISO 8601 timestamp |
| `mono_ns` | Nanoseconds from the Mac monotonic clock |
| `source_time` / `source_seq` | Optional producer time and sequence for extension/executor diagnostics |
| `source` | `hammerspoon`, `arc_extension`, `product`, or `executor` |
| `origin` | `human`, `model`, `product`, or `system` |
| `kind` | One of the normalized kinds below |
| `episode_id` | Nullable prediction-opportunity ID |
| `route_id` / `action_id` | Nullable model execution IDs |
| `app` | Bundle ID, PID, and human-readable name when available |
| `window` | Window ID, title, bounds, focused state, and display ID when available |
| `browser` | Browser window ID, tab ID, document ID, canonical URL, title, and frame ID when available |
| `payload` | Kind-specific small JSON object |
| `snapshot_id` | Nullable transition or resulting-state image |
| `privacy_state` | `clear`, `redacted`, `suppressed`, or `unknown` |

Normalized `kind` values for V1:

- `app_activated`
- `window_focused`
- `window_title_changed`
- `tab_activated`
- `navigation_committed`
- `click`
- `shortcut`
- `typing_burst`
- `scroll_burst`
- `idle_started`
- `idle_ended`
- `state_stabilized`
- `prediction_triggered`
- `prediction_returned`
- `suggestion_shown`
- `suggestion_feedback`
- `execution_started`
- `model_action`
- `execution_finished`
- `result_observed`

Input details stay deliberately narrow:

- `click`: button, global `x/y`, click count, resolved display ID;
- `shortcut`: virtual key code plus modifiers;
- `typing_burst`: start/end, key count, and target app/window—**never the
  characters**;
- `scroll_burst`: start/end, aggregate horizontal/vertical delta, display ID.

Mouse-down/up pairs collapse into one click. Repeated scroll events collapse
until a short quiet window. Unmodified printable keys collapse into a typing
burst. Modifier shortcuts remain individual events. This gives the model the
shape of recent activity without building a keylogger.

### 2. Snapshot record

Each retained screenshot needs:

| Field | Purpose |
|---|---|
| `snapshot_id` | Stable reference from events and episodes |
| `captured_wall_time_utc` / `captured_mono_ns` | Join and freshness |
| `trigger_event_id` | State boundary that requested it |
| `capture_reason` | `transition`, `prediction_current`, `post_execution`, or `other_display_context` |
| `display_id` | Stable Screen/CG display identifier |
| `display_bounds` | Global bounds, including negative coordinates |
| `active_view` | Whether this is the focused window's display |
| `app_id` / `window_id` | Best-effort state at capture |
| `width` / `height` / `scale` | Packet rendering |
| `path` / `sha256` | File reference and integrity/deduplication |
| `privacy_state` | Redaction/suppression result |

Keep only the newest three to six transition snapshots in the hot buffer plus
the current trigger image. The ledger may retain episode-bound snapshots
longer under an explicit retention policy.

### 3. Prediction opportunity

The episode ledger should not compress every outcome into one overloaded
status. Store orthogonal states:

| Group | Required fields |
|---|---|
| Identity | `episode_id`, created UTC/monotonic time, trigger kind/event, context fingerprint |
| Input | packet JSON version, chronological event IDs, current snapshot ID, transition snapshot IDs, app/window/browser identity, model request ID |
| Prediction | requested/started/returned time, model/version/prompt version, latency, error, `prediction_state` |
| Candidates | rank 1–3, structured destination/action, model score, calibrated score, risk, route summary, abstain reason |
| Presentation | displayed rank/copy/endpoint, shown time, surface, `presentation_state` |
| Feedback | `none`, `accepted`, `dismissed`, `ignored`, or `expired`; feedback event/time |
| Validity | `current`, `stale`, or `cancelled`; reason and invalidating event |
| Execution | route ID, start/end, `not_started`, `running`, `succeeded`, `partial`, `failed`, or `cancelled` |
| Outcome | resulting snapshot/context, effect summary, first next human event ID, observation confidence |

Semantics:

- **accepted**: Dylan explicitly invokes the shown completion, normally Tab;
- **dismissed**: Dylan explicitly closes or rejects it;
- **ignored**: a different meaningful human action occurs while the suggestion
  is visible and eligible;
- **expired**: the suggestion's display timer ends without another terminal
  feedback;
- **cancelled**: a newer event invalidates an in-flight request before it can
  be used;
- **stale**: a result arrives, but its context fingerprint no longer matches
  the current state.

The first meaningful `origin=human` event after presentation or route
completion becomes `next_human_event_id`. If a human event overlaps a running
model route and cannot be attributed safely, leave the field unknown rather
than guessing.

### 4. Executed action

Every model primitive must be logged **before dispatch**:

```text
action_id
episode_id
route_id
sequence_index
origin = model
primitive = click | key | type | scroll | wait | open_url | ax_action
target_app/window/display
coordinates or non-secret structured target
expected_effect
dispatched_mono_ns
completed_mono_ns
delivery_status
observed_effect
result_snapshot_id
```

When the actuator posts Quartz events, set an action-specific 64-bit
`CGEventSource.userData` value and map it back to the full action ID in the
ledger. Hammerspoon exposes that value as
`eventSourceUserData`, so the observer can classify the resulting click or key
event as model-originated instead of counting it as Dylan's next action.

If a particular executor cannot tag its events, the fallback is a bounded
execution window plus an expected primitive signature. That is acceptable for
an initial calibration, but persistent ambiguity should falsify the stack or
force the actuator behind a taggable adapter.

### 5. Small physical schema

SQLite in WAL mode is enough:

- `events`
- `snapshots`
- `episodes`
- `episode_candidates`
- `execution_actions`

Images stay as JPEG/PNG files addressed by ID and hash; the database stores
paths and metadata. A short in-memory deque holds the hot event/snapshot
window. SQLite provides atomic episode updates and simple joins without
introducing an activity server, message broker, vector store, or cloud
dependency.

## Context packet contract

The packet builder should produce:

```json
{
  "packet_version": 1,
  "built_at": "...",
  "context_fingerprint": "...",
  "current": {
    "app": {},
    "window": {},
    "browser": {},
    "active_display_id": "..."
  },
  "recent_events": [],
  "transition_snapshots": [],
  "current_snapshot": {},
  "other_display_thumbnail": {},
  "active_episode": null
}
```

Recommended bounds:

- last 60–120 seconds or last 20–40 meaningful events, whichever is smaller;
- last three to six transition screenshots;
- one fresh current screenshot;
- one low-resolution other-display thumbnail only at a prediction opportunity;
- no raw typed text, clipboard value, form value, Accessibility value, query
  token, or full AX tree.

For browser URLs, remove embedded credentials and strip query/fragment by
default. Allow a small per-origin canonicalizer later when a safe query
parameter is necessary to distinguish documents.

## Requirement-to-component matrix

| Frozen MVP requirement | Authoritative component | What it supplies | Known gap / policy |
|---|---|---|---|
| App focus | Hammerspoon `hs.application.watcher` | Bundle ID, PID, app, timestamp | macOS permission/app lifecycle edge cases |
| Window focus/title | Hammerspoon window filter + focused AX element | Window ID/title/bounds/display | Notifications are app-dependent; poll once after an input edge as fallback |
| Human click | Hammerspoon `hs.eventtap` | Time, global coordinates, button, modifiers, display | No exact semantic target required |
| Human key command | Hammerspoon `hs.eventtap` | Key code and modifiers | Printable text becomes counts only; Secure Input suppresses key visibility |
| Scroll | Hammerspoon `hs.eventtap` coalescer | Direction/delta/burst | Semantic scroll container deferred |
| Browser page/tab | Existing Arc extension using `tabs` and `webNavigation.onCommitted` | Window/tab/document IDs, title, committed URL, epoch timestamp | Arc/Chrome extension availability; null outside browser |
| Native document | Window title and cheap `AXDocument` lookup | Best-effort document identity | Null is allowed; no exhaustive AX traversal |
| Idle | `hs.host.idleTime` plus observer quiet timer | User idle and event-loop quiet | “Stable” is a scheduling heuristic, not universal app completion |
| Transition screenshot | Hammerspoon `hs.screen` one-shot capture | Per-display state image | Swap only capture path to `SCScreenshotManager` if calibration fails |
| Current model screenshot | Same one-shot provider used by the executor | Fresh active display/window state | Capture at request time, not from recorder history |
| Other monitor context | Display enumeration + one thumbnail | Layout and lightweight other-display state | Full-resolution second display only when it is active/recently changed |
| Prediction and UI events | Product logger | Trigger, candidates, scores, presentation, feedback | Necessarily custom |
| Model action and effect | Executor logger + Quartz `userData` tag | Route/action causality and origin | Third-party injectors may need a thin adapter |
| Next human action | Event ledger join | First later human event ID | Unknown if origin is ambiguous |
| Async completion | Product-owned model/request lifecycle | Reliable for this product's calls | Third-party app completions are optional adapters, not V1 requirements |

## Multi-monitor policy

Dylan's Mac has already exposed the important edge case: the external display
can use negative global coordinates. Display attribution must therefore use
actual display bounds, never “cursor display” assumptions or a primary-screen
coordinate system.

The model does not need two full-resolution screenshots at every opportunity.
Use:

1. the focused window's display as the full-resolution active view;
2. the other display as a downscaled thumbnail at prediction time;
3. a full transition screenshot from whichever display produced the recent
   meaningful event;
4. full views of both displays only when focus/display attribution is
   ambiguous or the recent sequence crossed displays.

Determine the active display from the focused window bounds first, the most
recent event location second, and cursor location only as a last resort. This
handles keyboard-driven transitions where the pointer remains on the other
monitor.

This policy preserves cross-display context without doubling vision tokens or
reintroducing two continuously synchronized video streams.

## Architecture options

### Option A — one integrated collector: Screenpipe plus the product ledger

**Stack**

- Screenpipe local app/database/API for recent UI events, frames, OCR,
  app/window identity, and occasional URL identity;
- product-owned prediction/execution ledger;
- a thin adapter that converts Screenpipe rows into the packet schema.

**Why it is attractive**

- Already installed and permissioned on Dylan's Mac.
- Official code exposes local SQLite/REST search over frames, OCR, UI elements,
  application/window metadata, and browser URLs.
- Event-driven capture supports clicks, app changes, typing pauses, scrolls,
  and multiple displays.
- It is the closest thing to a single off-the-shelf ambient collector.

**Why it is not the recommendation**

The local Screenpipe 2.5.132 audits found:

- duplicated logical click rows;
- click-linked frames that were often post-action, and some stale pre-action
  frames;
- no direct semantic target on all 40 sampled secondary-display clicks;
- active browser URLs in frame rows but none in 484 UI-event rows;
- synthetic computer-use actions missing from `ui_events`.

Exact semantic target loss is acceptable for runtime context. The other
failures still matter: the product must know which state followed which event,
must distinguish model actions from human actions, and must trigger from a
fresh current state. Once Hammerspoon and a product logger are added to repair
those gaps, Screenpipe is no longer simplifying the authoritative path.

**Assessment**

- custom engineering: low to start, medium to make causally trustworthy;
- latency: medium and dependent on Screenpipe's sampling/indexing;
- always-on cost: materially higher than event metadata plus a few images;
- reliability: locally observed as adequate for broad recall, weak for exact
  joins;
- use mode: as-is for optional search/debugging, not source of truth.

### Option B — minimal Mac observer plus product-owned logging

**Stack**

- reduced Hammerspoon observer;
- existing Arc extension, reduced to tab/navigation identity;
- Hammerspoon one-shot screenshots, with `SCScreenshotManager` as a narrow
  fallback;
- in-process event coalescer and ring buffer;
- SQLite episode ledger;
- model executor with tagged, pre-dispatch action logging.

**Why it wins**

- The July 24 spike already validated the important inputs, focus changes,
  browser transitions, display geometry, and six-action smoke sequence on this
  Mac.
- It uses one authoritative ordering clock for event IDs and product events.
- It captures a screenshot because a meaningful state boundary occurred,
  rather than searching a sampled video stream afterward.
- It can read Quartz `eventSourceUserData` to separate model input from human
  input.
- It allows every field to be null when a surface does not cheaply expose it.
- It has no OCR, video encoder, full AX traversal, transcription process, or
  recorder database on the hot path.

**What is custom**

1. strip the diagnostic July 24 Hammerspoon config down to an observer and
   heartbeat;
2. normalize/coalesce raw events and write them through a non-blocking queue;
3. schedule and retain transition screenshots;
4. receive the existing extension's tab/navigation messages;
5. implement the five SQLite tables, packet builder, and episode state machine;
6. tag and log the product executor's actions;
7. implement capture pauses, redaction, retention, and health checks.

This is product-specific code, but it is also the code no third-party recorder
can supply correctly. It should be hundreds to low thousands of lines, not a
new capture platform.

**Assessment**

- custom engineering: low-medium, mostly glue and state semantics;
- latency: lowest expected because capture is event-driven and local;
- always-on cost: low;
- reliability: strongest local evidence, with event-tap and extension health
  still needing calibration;
- use mode: existing components lightly wrapped;
- recommendation: **yes**.

### Option C — hybrid: Hammerspoon authority plus Screenpipe recent-state sidecar

**Stack**

- Option B's Hammerspoon observer, Arc adapter, and product ledger;
- Screenpipe queried for recent OCR, screenshots, app/window history, or search
  context;
- packet builder joins Screenpipe material to authoritative event IDs by time.

**When it is worth it**

- the model materially benefits from OCR or older state that is not in the
  small ring buffer;
- one-shot screenshots prove unreliable;
- debugging needs a searchable visual trail;
- later experiments intentionally test richer history.

**Why not at MVP start**

- two clocks, two retention policies, two permissioned always-on processes, and
  another join;
- Screenpipe's frame/action relationships remain advisory;
- higher CPU, memory, and disk use;
- it does not remove any required product-owned work.

**Assessment**

- custom engineering: medium;
- latency: medium;
- always-on cost: highest of the three;
- reliability: good as redundant evidence, not as one coherent causal stream;
- use mode: existing collector plus adapter;
- recommendation: reserve as a fallback or debugging mode.

## Serious candidates not selected

| Component | What it really supplies now | Why it does not replace Option B |
|---|---|---|
| [ActivityWatch](https://github.com/ActivityWatch/activitywatch) | Mature MPL-2.0 local journal; app/window/title, active browser tab/URL, AFK state, timestamped buckets and REST API | Its input watcher is fine-grained activity **counts**, not a reliable ordered sequence of click coordinates and key commands; no transition screenshots or product causality. Adding Hammerspoon, screenshots, and a ledger leaves an extra server and join. It remains good design prior art, and THUNLP's ProactiveAgent confirms it can support coarse proactive context. |
| [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture) | Active task-scoped demonstration capture with input, screenshots, media, and structured observations | Designed around explicit recording sessions and demonstration compilation; video/FFmpeg and post-processing are heavier than a tiny ambient ring. macOS structural capture has also evolved across packages. It is a code/reference source, not a drop-in daemon for this ledger. |
| [Peekaboo](https://github.com/openclaw/Peekaboo) | Current MIT Mac CLI/MCP with multi-screen screenshots, AX inspection, structured JSON, and actuation; warm daemon reduces repeat capture overhead | Excellent optional screenshot/inspection or executor layer, but it observes actions it performs—not Dylan's ambient human clicks and key commands. Installing another permissioned daemon is not justified unless Hammerspoon capture or the current actuator fails calibration. |
| [NAPsack](https://github.com/BuffaloComputerGraphics/NAPsack) | Event bursts, screenshots, captions, and JSONL-oriented personal activity capture | Local testing exposed negative-coordinate and cursor-display assumptions; it also risks retaining raw key material. Cursor-display capture is insufficient for keyboard-driven multi-monitor use. |
| [OpenCUA / AgentNetTool](https://github.com/xlang-ai/OpenCUA) | Current MIT cross-platform demonstration recorder plus action reduction and state/action matching for dataset construction | Research/data tooling centered on synchronized video, review, reduction, and post-hoc matching. Current licensing now permits commercial use, but its architecture still solves dataset collection, not the smallest live context buffer. |
| [rrweb](https://github.com/rrweb-io/rrweb) + [CDP](https://chromedevtools.github.io/devtools-protocol/) | Exact web DOM replay, mutations, events, navigation, and element-at-point tooling | Strong when exact browser labels are required. For V1, `tabs` plus `webNavigation.onCommitted` supplies the cheap identity fields; full replay expands privacy, volume, and extension fragility. |
| [macapptree](https://github.com/MacPaw/macapptree) / [oa-atomacos](https://pypi.org/project/oa-atomacos/) | On-demand Accessibility trees and element-at-point metadata | Useful debugging or later labeling adapters. Continuous or per-click tree traversal is unnecessary for context sufficiency and has weaker maintenance/performance characteristics than lightweight Hammerspoon AX summaries. |
| OpenTelemetry / Langfuse | Product request traces, model latency, sessions, tool spans, and evaluation scores | Useful mirrors after the local ledger works. They do not observe Mac state or own autocomplete feedback semantics, and sending screenshots/inputs to a hosted tracing system expands the secret boundary. Do not make either the runtime context store. |

## Reliability, latency, and resource risks

### Hammerspoon event loop

Event-tap callbacks must do almost nothing: assign an ID, read small event
properties, and append to a queue. Screenshotting, Accessibility traversal,
JSON encoding, and SQLite writes happen later. Long callbacks can create input
latency or cause the OS to disable the tap.

Retain the existing heartbeat and `isEnabled` checks. Recreate a tap after
wake, permission changes, or detected disablement.

### Window and Accessibility notifications

AX notifications vary by application, and Hammerspoon labels parts of its
window-filter surface experimental. Treat notifications as accelerators. After
a click, shortcut, app activation, or browser navigation, sample the
frontmost app/window once during the stabilization callback. A missing AX field
becomes null; it should not block an episode.

### Screenshot freshness

The July 24 continuous-stream spike occasionally waited 1.4–3.8 seconds for a
new frame on a static display. That is a stream synchronization problem, not a
reason to keep video. A one-shot API should request the current state after the
transition quiet period.

Start with Hammerspoon for minimum engineering. If controlled tests show
blocking, stale content, or bad cross-display selection, use Apple's
`SCScreenshotManager`, which is explicitly a single-frame ScreenCaptureKit API.
Do not fall back to a per-display ring stream unless one-shot capture itself is
falsified.

### Browser extension lifecycle

Arc can suspend or reload an extension service worker. Include extension
sequence numbers and a heartbeat. Missing browser metadata should degrade to
app/window/title, not stop the observer. Do not ask the extension to capture
form values.

### Origin attribution

Product-owned logging is authoritative. The observer's model-event tag is a
cross-check. Quartz provides 64 bits of event-source user data, and Hammerspoon
can read it. Synthetic events also default to timestamp zero, but timestamp
zero is only a heuristic; the explicit tag is the contract.

### Secret handling

The observer must fail closed around sensitive input:

- never record literal unmodified keystrokes, clipboard values, form values,
  Accessibility values, or typed model action payloads;
- when `hs.eventtap.isSecureInputEnabled()` is true, suppress keyboard-derived
  events and screenshots until the sensitive state clears;
- let the browser adapter send a `sensitive_focus` boolean for password fields,
  but never their value;
- suppress screenshots and cloud packets for password managers, wallet apps,
  system authentication dialogs, and a user-maintained denylist;
- provide a global pause hotkey and visible paused state;
- sanitize URL credentials/query/fragment and window titles before persistence;
- run packet redaction locally before any image or metadata goes to a cloud
  model;
- if privacy state is `unknown`, send no screenshot.

Secure Input alone cannot guarantee that a terminal, note, or ordinary webpage
is not displaying a token. A small denylist plus manual pause remains necessary
on a one-user MVP. Any test that transmits a seeded secret is a release blocker.

### Resource profile

Option B does not need continuous OCR, audio, encoding, or full-resolution
video. Its steady state is small JSON events, a quiet timer, and occasional
JPEGs. The main resource risks are accidental screenshot storms and per-event
AX traversal. Debounce both, cap the image ring, and enforce file retention.

## What should remain deferred

- continuous video as model context;
- exact semantic labels for every human action;
- full Accessibility trees;
- rrweb replay and CDP element-at-point labeling;
- OCR and transcription in the hot path;
- historical Screenpipe reconstruction;
- a manually labeled seed corpus;
- long-term semantic memory;
- embeddings, task graphs, and vector retrieval;
- cross-device or multi-user support;
- universal third-party LLM completion detection;
- dataset-grade leakage guarantees;
- cloud observability as the source of truth.

The event and episode IDs should make these additive later. None should delay
the first prospective loop.

## Controlled calibration that can falsify the recommendation

Run this before implementation work expands beyond a thin wrapper. It can use
the existing July 24 spike and a disposable output directory; it should not
modify Screenpipe, NAPsack, or the current dataset.

### Probe 1 — meaningful-event recall

Perform a written 40-event script across both displays:

- 10 app/window switches;
- 10 clicks;
- 5 shortcut keys;
- 5 scroll bursts;
- 5 Arc tab/navigation changes;
- one short idle interval and four cross-display transitions.

Pass if at least 38 of 40 intended meaningful events appear once in order,
every coordinate resolves to the correct display, and normal typing/clicking
shows no perceptible lag. Treat duplicate logical clicks as a coalescer bug,
not separate recall.

**Falsifier:** repeated tap disablement, material input latency, or missed
cross-display events after one repair pass. If falsified, replace Hammerspoon
input/focus capture with a small signed Swift observer using CGEventTap,
NSWorkspace, and AXObserver.

### Probe 2 — one-shot screenshot timing

Capture 20 stabilized transitions split across both displays, including static
pages and window switches. Record request time, completion time, selected
display, and whether the image shows the expected post-transition state.

Pass if all 20 choose the correct display, at least 19 show the intended state,
and p95 capture plus local save is below 500 ms without event-tap stalls.

**Falsifier:** stale frames, incorrect display selection, or p95 above 500 ms.
Swap only the capture provider to `SCScreenshotManager` and repeat. If both
one-shot paths fail, reconsider the continuous SCK ring.

### Probe 3 — human/model provenance

Dispatch 10 tagged model primitives interleaved with 10 physical actions. Log
the intended route/action ID before every dispatch.

Pass only with 20/20 correct origin classifications and complete route/action
links.

**Falsifier:** any model action counted as Dylan's next human action after
tagging. Bring that executor behind a taggable adapter before prospective
evaluation.

### Probe 4 — browser identity degradation

Across Arc Gmail, X, GitHub, and Codex pages, exercise tab activation, normal
navigation, history-state navigation, and an extension service-worker restart.

Pass if committed navigations and tab changes carry monotonically increasing
extension sequence numbers, tab/window/document identity when Chrome exposes
it, and recover after restart. The observer must continue with app/window
identity while the extension is absent.

**Falsifier:** extension loss breaks packet construction or captures any form
value. Remove the extension from the required path and use window title plus
current screenshot until it is repaired.

### Probe 5 — prospective ledger completeness

Create 20 shadow prediction opportunities without displaying or executing
them. Force returned, failed, cancelled, and stale cases. Then display five
controlled suggestions and exercise accept, dismiss, ignore, and expiry.

Pass if every opportunity has:

- immutable input references;
- silent top-three candidates and scores;
- independent prediction, presentation, feedback, validity, and execution
  states;
- the first later human event when observable;
- no episode that silently changes its original input packet.

### Probe 6 — secret fail-closed test

Use synthetic canary strings in a password field, denied app/window, URL query,
ordinary terminal, and ordinary note. Inspect all event rows, screenshot files,
packet JSON, logs, and outbound request bodies.

Pass only if no literal canary reaches persistence or the network and no
screenshot is captured/transmitted while a sensitive state is active.

**Falsifier:** any leaked canary. Fix capture suppression/redaction before any
cloud model test.

## Final decision

Start with Option B:

```text
Hammerspoon observer
        +
small Arc tab/navigation adapter
        +
one-shot active-display screenshots
        +
product-owned SQLite episode ledger
        +
tagged computer-use executor
```

Keep Screenpipe running only if Dylan independently wants its recall/search
features; the MVP should not depend on it. Add Screenpipe history, Peekaboo
inspection, richer Accessibility capture, or rrweb only after a prospective
test shows that the minimum packet lacks a specific field that changes
prediction quality.

The likely bottleneck is not context collection. It is whether latent-intent
ranking can abstain well enough and whether a displayed completion is useful
often enough to justify interruption. The context stack should become just
reliable enough to test that product question, then stop growing.

## Primary sources checked

- [Hammerspoon event taps](https://www.hammerspoon.org/docs/hs.eventtap.html),
  [event properties](https://www.hammerspoon.org/docs/hs.eventtap.event.html),
  [application watcher](https://www.hammerspoon.org/docs/hs.application.watcher.html),
  [window filter](https://www.hammerspoon.org/docs/hs.window.filter.html),
  [Accessibility observer](https://www.hammerspoon.org/docs/hs.axuielement.observer.html),
  and [screen capture/enumeration](https://www.hammerspoon.org/docs/hs.screen.html)
- Apple [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit),
  [`SCScreenshotManager`](https://developer.apple.com/documentation/screencapturekit/scscreenshotmanager),
  [`NSWorkspace.didActivateApplicationNotification`](https://developer.apple.com/documentation/appkit/nsworkspace/didactivateapplicationnotification),
  and [`CGEventSource.userData`](https://developer.apple.com/documentation/coregraphics/cgeventsource/userdata)
- Chrome [tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs)
  and [`webNavigation`](https://developer.chrome.com/docs/extensions/reference/api/webNavigation)
- [Screenpipe repository](https://github.com/screenpipe/screenpipe) and
  [local API documentation](https://docs.screenpi.pe/api-reference)
- [ActivityWatch repository](https://github.com/ActivityWatch/activitywatch),
  [watchers](https://docs.activitywatch.net/en/latest/watchers.html), and
  [API](https://docs.activitywatch.net/en/latest/api.html)
- [OpenAdapt](https://github.com/OpenAdaptAI/OpenAdapt) and
  [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture)
- [OpenCUA / AgentNetTool](https://github.com/xlang-ai/OpenCUA)
- [Peekaboo](https://github.com/openclaw/Peekaboo)
- [rrweb](https://github.com/rrweb-io/rrweb) and
  [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [macapptree](https://github.com/MacPaw/macapptree) and
  [oa-atomacos](https://pypi.org/project/oa-atomacos/)
- [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
  and [Langfuse tracing](https://langfuse.com/docs/observability/overview)
- [THUNLP ProactiveAgent](https://github.com/thunlp/ProactiveAgent)

Exa semantic discovery was attempted twice but timed out. Final claims above
were checked against primary documentation, repositories, changelogs, and the
local experiments.

## Vault evidence and links

- Active scope:
  [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
- Project hub:
  [[personal-ai-context-learning|Personal AI Context Learning]]
- Model/product boundary:
  [[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|The computer-use autocomplete wedge is intent ranking, not another computer-use agent]]
- Earlier capture landscape:
  [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
  and
  [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey, July 24, 2026]]
- Exact-label architecture:
  [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Computer-use NAP capture layer v2 plan]]
- Local Screenpipe evidence:
  [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
  and
  [[screenpipe-natural-work-audit-2026-07-28|Screenpipe natural-work audit, July 28, 2026]]
- Local cross-app/cross-display spike:
  [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff, July 24, 2026]]
