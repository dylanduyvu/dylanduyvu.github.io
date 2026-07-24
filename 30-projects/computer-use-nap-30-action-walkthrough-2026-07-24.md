---
type: project
status: active
created: 2026-07-24
updated: 2026-07-24
aliases:
  - Computer-use NAP 30-action walkthrough
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - data-acquisition
  - calibration
  - capture-layer-v2
---

# Computer-use NAP: what the 30-action walkthrough is

## Thirty-second version

The six-action smoke test showed that the new capture pieces can operate together without obvious data corruption.

The next 30-action walkthrough asks a broader question:

> Across a representative set of native, browser, dynamic-web, and cross-monitor actions, does each capture component produce the exact evidence the later experiment will need?

It is a controlled recorder diagnostic. It is not a next-action prediction test, a personalization test, a product demo, or yet the formal blind 27/30 calibration.

## Two exercises that had been conflated

### 1. Immediate diagnostic walkthrough

This is the next step after the smoke test.

- Perform 30 known actions while Hammerspoon, the dual-display ScreenCaptureKit recorder, and the Arc extension run together.
- Inspect what each component captured.
- Measure Accessibility coverage, dual-display frame freshness, clock alignment, focus and window notifications, and browser target fidelity.
- End with a short findings note that marks each component `ADOPT`, `ADOPT-WITH-CAVEAT`, or `REJECT`.

This walkthrough determines the measured constants and recorder behavior that should enter Capture Layer v2.

### 2. Later formal 30-action calibration

This happens only after the capture contract and Capture Layer v2 harness are implemented.

- A hidden manifest contains 30 exact expected targets.
- A reviewer reconstructs the targets from captured evidence without seeing the answers.
- Labels are sealed before the hidden answers are opened.
- A deterministic scorer reports all 30 rows.
- The calibration passes only with zero silent losses, at least 27/30 exact targets, at least 9/10 native targets, at least 14/15 webpage targets, and at least 4/5 cross-monitor targets.

Passing the immediate walkthrough does not mean the later calibration passed.

## Why the walkthrough comes after the smoke

The smoke test answered: “Does the plumbing work at all?”

Its clean run, `spike-20260724T191643Z-3e7c`, passed every checker gate:

- exact Finder Back clicks on both displays;
- one Hacker News DOM click and committed navigation;
- a literal `Command+Tab` switch to Finder;
- Gmail search-field focus;
- a secondary-display browser scroll;
- two-display ScreenCaptureKit streaming and six shared freezes;
- frames strictly before the freeze time, with no PTS fallback;
- decodable PNGs;
- healthy Hammerspoon event taps;
- complete, correctly sequenced browser records; and
- 54/54 checker failure fixtures.

Six hand-selected actions cannot establish coverage across Dylan’s normal environment. The walkthrough expands the surface area before the team invests in the full verification harness.

## Proposed composition

The walkthrough should reuse the formal protocol’s coverage matrix:

| Category | Click | Focus | App switch | Key command | Page navigation | Total |
|---|---:|---:|---:|---:|---:|---:|
| Native desktop | 4 | 2 | 2 | 2 | 0 | 10 |
| Ordinary Arc webpage | 5 | 3 | 0 | 0 | 2 | 10 |
| Dynamic Arc webpage | 3 | 1 | 0 | 0 | 1 | 5 |
| Cross-monitor | 1 | 1 | 2 | 1 | 0 | 5 |
| **Total** | **13** | **7** | **4** | **3** | **3** | **30** |

The categories mean:

- **Native desktop:** controls in Finder, Codex, Notes, or another normal Mac application.
- **Ordinary webpage:** stable links, buttons, and text fields in Arc, such as Gmail search or a Hacker News comments link.
- **Dynamic webpage:** controls rendered or changed by JavaScript, such as an X composer, menu, modal, or infinite-feed control.
- **Cross-monitor:** an action whose source and destination span Dylan’s primary and secondary displays.

The exact 30 targets are not yet frozen. The spike directory contains `checklist.md`, but it does not contain the referenced 30-step manifest. The next preparation step is therefore to write and freeze the exact action list before recording.

## What one walkthrough action looks like

For each action:

1. Prepare the application and target outside the measured interval.
2. Put the cursor or focus where the step requires.
3. Sweep the cursor across both displays so both ScreenCaptureKit streams have fresh frames.
4. Mark `ready`.
5. Freeze the latest complete frame from both displays at one shared decision time.
6. Perform exactly one intended action.
7. Wait for the resulting focus, window, application, URL, or DOM state to settle.
8. Mark `complete`.
9. Invalidate and redo the entire clean run if the step accidentally contains a second unrelated action.

The intended target is known in advance. An example is:

> `Arc > Gmail > Ask Gmail > focus > secondary display`

The recorders should independently show the physical trigger, the target or destination, the relevant display, and the surrounding state.

## What gets measured

### 1. Exact native-control identity

For secondary- and primary-display clicks:

- Did Hammerspoon find a non-null Accessibility role?
- Did it recover a stable human-readable title or description?
- Did it find the actionable ancestor, such as the actual button rather than only the containing window?
- How often does this work in Arc, Finder, Codex, and one Electron application?

This is the direct replacement test for Screenpipe’s missing semantic labels on the secondary display.

### 2. Focus, application, and window semantics

- Does same-window Arc navigation emit useful title or focus notifications?
- Does `Command+Tab` produce a clean source and destination?
- Can two Arc windows on one display be distinguished?
- Do Little Arc and Arc split view expose usable identities?

This determines whether the system can trust OS notifications instead of inferring transitions from nearby rows.

### 3. Both-display visual state

- Are both displays continuously streaming?
- Does every decision-point freeze contain the correct image from both displays?
- How old is each chosen frame at the freeze?
- What are the median and p95 frame ages?
- Is CPU and memory usage acceptable for an hours-long session?

These measurements determine the actual freshness constant for the later capture contract.

### 4. Clock alignment

- Can Hammerspoon event time, macOS monotonic time, epoch time, and ScreenCaptureKit display time be joined within 100 milliseconds?
- Is the offset stable, or does it drift?

If the clocks cannot be aligned, the project cannot safely claim that a frame came before an action.

### 5. Browser ground truth

On real Gmail and X interactions:

- Does `webNavigation` capture ordinary, SPA, redirect, and hash navigation?
- Does the DOM recorder identify useful roles, labels, and text for clicked or focused controls?
- Does rrweb start and continue on both sites?
- Can two Arc windows be distinguished through tab and window IDs?
- Does browser evidence join to the correct action window without missing, duplicate, or malformed records?

CDP remains untested in the current spike. It needs a separate probe before Capture Layer v2 depends on it.

## What “success” means

The immediate walkthrough does not use the formal 27/30 product gate.

Its deliverable is a findings note containing:

- `ADOPT`, `ADOPT-WITH-CAVEAT`, or `REJECT` for each capture component;
- exact coverage counts for native and browser targets;
- measured frame-age, clock-skew, and resource-usage constants;
- explicit failure categories;
- the two recorder JSONL files, one dual-display freeze pair, and the browser export; and
- a frozen hash of the protocol used.

The walkthrough succeeds if it gives enough evidence to write a capture contract and Spec B without assuming untested recorder behavior. A component can fail and the walkthrough can still be useful because the failure tells the team what to replace.

## What follows

1. Freeze the exact 30-action diagnostic manifest.
2. Run the walkthrough and write the component findings note.
3. Draft the capture contract and Capture Layer v2 specification using the measured results.
4. Re-audit the contract and specification once.
5. Implement the formal harness.
6. Run the blind, scored 30-action calibration.
7. If that passes, run a short natural-session segmentation test and then audit 50–100 ordinary actions.
8. Only then begin multi-day next-action prediction collection.

## Related notes

- [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Capture Layer v2 plan]]
- [[computer-use-nap-build-log|Computer-use NAP build log]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]

