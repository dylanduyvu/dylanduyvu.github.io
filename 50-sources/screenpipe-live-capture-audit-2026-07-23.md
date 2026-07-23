---
type: source
status: captured
created: 2026-07-23
updated: 2026-07-23
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - screenpipe
  - data-acquisition
  - computer-use
  - live-audit
---

# Screenpipe live capture audit, July 23, 2026

## Context

Dylan and Codex installed and tested Screenpipe as the proposed recorder for the computer-use NAP experiment. The immediate question was whether Screenpipe captures only screenshots and extracted text or also provides the exact action data needed to reconstruct:

> what Dylan saw immediately before an action → the exact place or control Dylan acted on

The audit used Screenpipe `2.5.132` on Dylan's Mac. Screen Recording, Accessibility, Input Monitoring, click capture, and keyboard capture were enabled. Clipboard capture, microphone access, and Screenpipe audio recording were disabled.

## Verified capture

Screenpipe's local health endpoint reported:

- `status: healthy`
- UI recorder `mode: full`
- input tap running
- application-event recorder running

The live SQLite database at `~/.screenpipe/db.sqlite` contained first-class rows for:

| Event type | Rows at the audit checkpoint |
|---|---:|
| Application switches | 40 |
| Clicks | 128 |
| Individual key events | 13 |
| Scroll gestures | 17 |
| Aggregated text bursts | 87 |
| Window-focus changes | 59 |

The frame table contained 139 stored JPEG screenshots at that checkpoint. Ten Arc frames contained browser URLs spanning three distinct pages. The audio table contained zero chunks.

This directly falsifies the concern that the shipped Screenpipe application records only OCR text. It captures raw physical actions, application and window transitions, screenshots, accessibility text, and browser URLs.

## Dual-monitor behavior

Dylan has two displays:

- primary: `1512×982` at global origin `(0,0)`
- secondary: `2560×1440` positioned at `(-557,-1440)`

Screenpipe stores separate frames by monitor. Pointer coordinates use the combined macOS desktop coordinate system, so actions on the secondary display can have negative coordinates.

The correct pre-action observation is therefore not one screenshot. It is a timestamp-aligned pair containing the most recent leakage-safe frame from each monitor. Any model comparison must give both the no-history and personal-history conditions the same two-monitor current state.

## The linked frame is not a clean pre-action screenshot

`ui_events.frame_id` is a loose trigger correlation, not a trustworthy statement that the linked frame occurred immediately before the action.

In an early 56-event sample:

- 52 events had frame links;
- application switches and window-focus events generally linked to later frames;
- linked scroll frames appeared roughly 3.4–4.2 seconds later at `scroll_stop`;
- click and text links pointed both backward and forward by seconds; and
- some linked frames described another monitor or already showed the resulting destination.

The event's linked frame must not be fed directly to the predictor. For each event, the dataset builder must independently select the latest frame strictly before the event for each monitor, enforce a safety margin, record frame age, and manually audit for future leakage.

## Control-level labeling is currently incomplete

The sampled database contains click rows with timestamps and global coordinates. This audit did not compare Screenpipe against an independent click ground truth, so it does not establish click-capture recall or false-positive rate. For the click rows that were present, Screenpipe did not reliably attach the semantic identity of the clicked control.

At the audit checkpoint:

| Click-label field | Coverage |
|---|---:|
| Total clicks | 128 |
| Accessibility role present | 61 |
| Element name present | 58 |
| Element bounds present | 61 |

Only 45.3% of clicks had a direct element name. Coverage varied by application. Most importantly, all four sampled Arc clicks had coordinates and linked frames, but zero had a direct role, name, or element bounds in the click row.

The associated Arc frames did contain URLs and accessibility trees with buttons and links. Mapping global click coordinates into the correct monitor and then into the frame's accessibility bounds recovered an `AXButton` hit for two clicks, a static-text region for one, and no confident element for one. This shows that post-hoc reconstruction is possible, but the four-click sample is too small and too incomplete to treat it as solved.

Screenpipe's `window_focus` event describes application or OS-window focus. It does not guarantee an explicit event whenever focus moves between webpage inputs, links, or buttons.

## Why this is load-bearing

Dylan's proposed product is not merely a next-application launcher. It should eventually route to an exact app, window, webpage, thread, document, input field, link, or button.

If the dataset collapses distinct control-level actions into a generic page or window label:

- a model can look accurate at coarse routing while failing the intended interaction;
- correct predictions can be scored as wrong because the recorded label is missing;
- noisy labels can make a capable model appear poor;
- silently excluding unresolved clicks biases evaluation toward easy events; and
- a failed prediction experiment cannot be distinguished from a failed recorder.

Data acquisition and semantic labeling must therefore pass before the multi-day prediction comparison begins.

## Revised acquisition gate

Audit 50–100 meaningful navigation or control actions across both Arc and native desktop applications.

Each event should contain:

| Field | Requirement |
|---|---|
| action timestamp | Exact recorder timestamp |
| pre-action state | Latest leakage-safe frame from both monitors |
| source | Application, window, page or document, and URL when applicable |
| physical action | Switch, focus, click, key command, or page navigation |
| exact target | Application, window, object, control role, control name, and operation |
| target location | Display, global coordinates, normalized local bounds |
| reconstructed-label provenance | Direct event, DOM event, accessibility hit-test, or visual reconstruction |
| manual audit label | Independent ground truth used to judge reconstruction |
| confidence | High, ambiguous, or unresolved |
| resulting state | Post-action evidence used to validate the label, never predictive input |

Ordinary typing, scrolling, cursor repositioning, text selection, and window resizing remain outside the initial prediction target unless they activate a new semantic destination.

The provisional gate passes if the capture and reconstruction stack independently produces the correct exact semantic target for roughly 90% or more of meaningful sampled actions when compared with manual audit ground truth, with browser and native-app results reported separately. A target supplied only by the human auditor does not count in the numerator. Manual-only, ambiguous, and unresolved events remain in the denominator and must be reported rather than silently discarded.

This 90% threshold is a product-oriented branch gate, not a publication standard. Its purpose is to ensure that label noise is unlikely to dominate the later prediction result.

## Candidate acquisition approaches

1. **Screenpipe-only reconstruction:** combine raw coordinates, two-monitor screenshots, URLs, accessibility trees, and resulting state.
2. **Hybrid capture:** retain Screenpipe for screens, applications, windows, and URLs; add browser instrumentation for DOM clicks, focus, and navigation; use macOS Accessibility hit-testing for native controls.
3. **Purpose-built recorder:** replace or supplement Screenpipe with a recorder designed around exact semantic action targets.

The immediate next step is to research whether an existing out-of-the-box tool already provides the hybrid or purpose-built fidelity before writing custom instrumentation.

## Additional operational finding

Computer-control automation generated synthetic UI actions that Screenpipe did not add to `ui_events`, while Dylan's physical actions were recorded normally. Recorder validation and the actual dataset must therefore use physical user input rather than scripted UI automation unless synthetic-event handling is separately instrumented.

## Links

- Experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
