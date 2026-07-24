---
type: source
status: captured
created: 2026-07-23
updated: 2026-07-24
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - data-acquisition
  - computer-use
  - recorder-research
  - napsack
  - screenpipe
---

# Computer-use capture-tool research, July 23, 2026

## Question

After the live Screenpipe audit, the remaining acquisition problem was:

> Is there an out-of-the-box recorder that can capture hours of Dylan's normal two-monitor Mac use while preserving exact Arc webpage targets, native application controls, timestamps, and leakage-safe pre-action visual state?

## Bottom line

No single available tool satisfies the complete requirement.

The missing combination is:

1. exact Arc DOM targets and webpage focus;
2. exact native macOS control identity;
3. both displays at every prediction point;
4. raw, timestamped, machine-readable events;
5. passive or low-friction recording for one to two hours or longer; and
6. a clean frame from before the action rather than after it.

Some tools solve two or three of these. None solves all six without validation or light integration.

The lowest-engineering next move is not to abandon Screenpipe or begin a long collection. It is to run a short calibration with **Screenpipe plus NAPsack**, then add a browser recorder only if Arc remains the failing layer.

## Recommended acquisition ladder

### 1. First calibration: Screenpipe plus NAPsack

[NAPsack 0.1.3](https://github.com/GeneralUserModels/napsack) is runnable today. It is also the collection tool from the General User Models / LongNAP research line, making it directly relevant rather than merely adjacent tooling. Dylan's default Python 3.14 is outside NAPsack's supported Python 3.11–3.13 range, so use the installed Python 3.13 explicitly.

Install and run it as a short local calibration:

```bash
uv tool install --python 3.13 'napsack==0.1.3'

/Users/dylanvu/.local/bin/napsack-record \
  --session-dir /Users/dylanvu/napsack-runs/calibration-2026-07-23 \
  --fps 12 \
  --buffer-seconds 12 \
  --accessibility \
  --disable move
```

Use a fresh session directory for every run. Stop once with `Ctrl+C` and wait for sanitization to finish. Do not use `--buffer-all-images` for this calibration because it unnecessarily retains every captured frame. Do not run the VLM labeling step yet.

NAPsack adds:

- timestamped mouse-down, mouse-up, mouse-move, scroll, key-press, and key-release events;
- cursor coordinates and monitor metadata;
- screenshot and event JSONL output;
- a screenshot stream from the display containing the cursor; and
- macOS Accessibility hit-testing on mouse-down, including best-effort role, title, description, identifier, DOM identifier, URL, value, and focused-element data.

It does **not** add:

- a simultaneous screenshot of both monitors;
- a structured application, bundle, window, browser-tab, or page-URL event stream;
- control bounds;
- an authoritative DOM selector or node path; or
- guaranteed Arc control identity.

Screenpipe remains useful alongside it because Screenpipe supplies the two-monitor history, application and window transitions, Arc URLs, OCR, and existing raw events. NAPsack supplies a second event clock, per-action screenshots, and a different click-time Accessibility lookup. The calibration asks whether the two together reconstruct exact targets reliably enough without custom code.

NAPsack's monitor number must not be assumed to match Screenpipe's monitor number. Join displays by their stored position and size. NAPsack assigns keyboard events to the monitor containing the cursor, which can be wrong for keyboard-only application changes when the cursor remains on the other display. Its recording is local, but literal keys and Accessibility values from text fields can be written to disk. Grant the launching Terminal Screen Recording, Accessibility, and Input Monitoring, and avoid sensitive typing during the controlled pilot.

#### Live calibration finding

The shipped `0.1.3` recorder initially mislabeled Dylan's upper secondary display as monitor 0. Its input handler used `screeninfo`, which reported that display at positive `y`, while macOS pointer events and the MSS screenshot worker used physical coordinates with the display at `top = -1440`. The local installation was patched so both paths use MSS bounds. Regression tests now cover primary and negative-`y` secondary points.

After the patch, seven secondary-display clicks had the correct display geometry and a same-display pre-action screenshot roughly 0.10 to 0.17 seconds before the event. Only four clicks were meaningful intended targets because several actions landed on the on-screen instructions or blank space. Direct Accessibility evidence named two of those four. A blind visual audit using only the marked pre-click screenshot identified all four when combined with the direct labels.

This is a diagnostic pass for display assignment and screenshot alignment, not a pass for the acquisition gate. The sample is too small and was not a valid 30-action checklist. It also shows that NAPsack Accessibility alone will not produce complete target labels. The next controlled audit must score the combined reconstruction path and retain every ambiguous action in the denominator.

### 2. Add only if Arc is still weak: UI + API Recorder

[UI + API Recorder](https://chromewebstore.google.com/detail/ui-%2B-api-recorder/dcjnljbaccofglbdpcmllnghchfjicfk) is the closest installable browser companion found.

Its published requirements explicitly include Arc and other Chromium 109+ browsers. During an explicitly started recording, it exports local timestamped `events.json` data containing the clicked element's role, computed accessible name, test ID, label, placeholder, text, CSS path, iframe URL, semantic peers, and ancestor anchors. It can follow navigation and tabs opened from the recorded flow.

Important limits:

- it is very new and lightly exercised;
- it records webpage content, not Arc's own sidebar, tab chrome, or URL bar;
- its current events do not include click coordinates, element bounds, or `focus` and `blur`;
- it follows tabs opened by the recorded flow rather than passively observing every unrelated Arc tab;
- it requires explicit start and stop; and
- its broad site and debugger permissions warrant using a dedicated or non-sensitive Arc profile for the pilot.

This should be added only if the first calibration shows that exact webpage controls are the bottleneck. Its epoch-millisecond timestamps make it possible to join its events to Screenpipe and NAPsack.

### 3. If the short hybrid still fails

Do not collect hours of ambiguous data. At that point the available paths are:

- make a small trusted Arc extension that records DOM target, bounds, focus, tab identity, URL, and epoch timestamp;
- patch an existing recorder to add those fields; or
- narrow the prediction target to the coarser level the recorders can observe honestly.

## Short calibration protocol

Before a one-to-two-hour natural session, perform 30 known interactions while Screenpipe and NAPsack run:

- 10 native macOS or desktop-app controls;
- 10 ordinary Arc DOM controls such as links, buttons, and text fields;
- 5 custom or dynamic webpage controls such as menus, popovers, or SPA components; and
- 5 interactions that alternate between the two monitors.

Keep a simple independent checklist of the intended target for each action. Then audit:

- whether every physical action appeared;
- whether the pre-action frame is from the correct display and precedes the action;
- whether app, window, page, and exact control can be recovered;
- whether the semantic label came from direct DOM/Accessibility evidence or visual inference;
- whether the resulting state confirms the label without leaking into model input; and
- whether duplicate or missing events make the streams impossible to join.

Do not move to a long collection unless browser and native targets each clear the existing roughly 90% exact-target gate, unresolved events remain in the denominator, and no second-monitor action is silently lost.

## Other tools considered

| Tool | Useful capability | Why it is not the default |
|---|---|---|
| [AgentNetTool](https://github.com/xlang-ai/AgentNetTool) | Records screen video, mouse and keyboard, native Accessibility data, and optional webpage HTML / exact DOM click targets | Highest browser-label ceiling, but its Mac setup requires OBS, officially records the main display, uses task-sized sessions, and Arc compatibility is unverified |
| [Screencap](https://github.com/proteus-computer-use/screencap) | Whole-day, crash-safe chunks; raw SQLite and JSONL; click-time native AX role, title, identifier, position, and size | Strong long-session candidate, but no DOM instrumentation, its standard JSONL drops stored element state, and its current macOS multi-display capture is not trustworthy |
| [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture) | Time-aligned local mouse, keyboard, window, combined-display video, coordinates, and SQLite | Its own documentation says desktop capture records pixels and coordinates rather than structural Accessibility locators; browser extension is experimental |
| [Folge](https://folge.me/) | Mac app; screenshots on every click; active-window or multi-monitor capture; click markers; JSON export; automatic control names | Designed for guides, not a raw chronological research stream; its own docs estimate only 70–80% automatic element parsing |
| [rrweb](https://github.com/rrweb-io/rrweb) | Precise browser DOM snapshots, mutations, pointer events, input, focus, blur, coordinates, and epoch timestamps | Requires post-processing node IDs into targets and does not cover browser chrome or native apps |
| [UI.Vision](https://ui.vision/rpa/docs/) | Mature browser recorder with CSS/XPath-style selectors and JSON macros | Lacks useful wall-clock timestamps, bounds, and focus stream for joining to Screenpipe |
| Chrome DevTools Recorder | Strong browser selectors and click offsets | Chrome-only developer workflow, not reliable for normal Arc use and lacks wall-clock timestamps |
| Scribe and Tango | Easy cross-page workflow documentation | Export human-readable guides rather than a complete raw semantic event stream; Tango explicitly says Arc is unsupported |
| Power Automate, UiPath Task Mining, and similar enterprise RPA recorders | Strong UI selectors on supported systems | Recorder clients are Windows-only |
| Tada / powerNAP | Runnable personal-AI interface using NAPsack underneath | Adds prediction and UI, not higher-fidelity capture; its defaults retain less raw evidence than the proposed direct NAPsack run |
| Markov | Rich private collection pipeline and released data samples | No public self-recorder; released samples lack exact control targets and browser URLs |

## Consequence for the experiment

The prediction LBH remains deferred behind acquisition. The immediate result worth producing is a recorder coverage result:

> Can existing tools independently recover Dylan's exact next destination from normal Mac and Arc actions with little enough label noise to make a prediction result interpretable?

If this fails, the conclusion is about the acquisition stack, not the predictability of Dylan's behavior.

## Update, 2026-07-24: second deep-research pass on reusable software

Provenance: Dylan's other assistant ran a deep-research sweep on preexisting capture software after Dylan asked whether something like this must already exist ("meta does this to their employees internally for example"). Findings pasted 2026-07-24 and logged here; the external claims are that assistant's research, not independently re-verified in this pass.

Category confirmation, nothing downloadable: Meta's Model Capability Initiative (MCI), announced internally April 2026 out of Meta Superintelligence Labs under Alexandr Wang's data org, installs capture software on US employees' computers recording mouse movements, clicks, keystrokes, and periodic screenshots across designated work apps, explicitly to train computer-use agents on dropdowns, shortcuts, and app navigation, with no opt-out. The vendor ecosystem around it (Scale, Mercor-style contractor recording) sells labor and data, not software. Dylan's hunch was literally true and recent; the category is real and there is still nothing to install.

Deltas against the July 23 table above:
- AgentNetTool gains context: it is the collection app behind OpenCUA (xlang-ai, NeurIPS 2025 spotlight), used to collect 22.5K real task demonstrations including 5K on macOS, and it REUSED OpenAdapt's macOS Accessibility capture code. Practical consequence: that OpenAdapt macOS AX layer is battle-tested code to mine or import rather than rewrite. Caveats stand: task-scoped demonstration recording with annotator review, not continuous natural-work capture, and dual-monitor rigor unverified, which is exactly where recorders quietly lie.
- OpenAdapt entry gains two pieces: openadapt-capture pairs every action event with an immediately-prior screenshot plus OS-accessibility window state (NAPsack's job, independently reinvented), and openadapt-privacy does PII scrubbing of recordings, mapping directly onto the blind-pack-leaves-the-machine concern. Note the flagship OpenAdapt project has since pivoted toward deterministic workflow replay; the capture components are the part to take.
- rrweb's role UPGRADES from the July 23 dismissal. For the conditional Arc ground-truth layer, do not write a bespoke DOM recorder: rrweb is the mature open-source standard for DOM snapshots, mutations, and input events with timestamps (it powers most commercial session replay), and wrapping it in a WebExtension with chrome.webNavigation adds committed URLs, tab/frame/document identifiers, and actual event targets. Estimated roughly 80 percent of the label-only browser ground truth off the shelf. This coexists with, and may supersede, the UI + API Recorder option above if the browser category fails calibration.
- New lesser fits: PC Tracker (PC Agent paper), lightweight background keyboard/mouse plus screenshot recording, worth reading as a second reference implementation; Microsoft Recall proves shipped continuous capture with OCR and element understanding but is Windows-only and closed; Rewind/Limitless closed with no element-level API; ActivityWatch app/window granularity only.

What genuinely does not exist anywhere, per this sweep: dual-monitor decision-point-safe preframes, exact-semantic-destination scoring with blind labels, zero-silent-loss accounting, and a natural-action segmentation contract. Labs do not ship these because they solve fidelity with scale (22K trajectories or thousands of employees drown the noise); at N=1 that option does not exist, which is why this project's gates exist. Net conclusion adopted into the build: the reusable pieces shrink the work from "write two recorders and a browser instrument" to "glue proven capture components and write the verification harness," and the harness is the genuinely novel part.

## Links

- Experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Screenpipe audit: [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
