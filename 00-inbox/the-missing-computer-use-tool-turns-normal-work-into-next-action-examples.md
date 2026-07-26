---
type: idea
status: hunch
created: 2026-07-26
updated: 2026-07-26
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - article-concept
  - computer-use
  - data-acquisition
  - recorder-research
---

# The missing computer-use tool turns normal work into next-action examples

## Status

Article concept only. This is a framework for later reference, not the beginning of a draft.

## Core claim

Tools exist for recording screens, logging physical inputs, replaying webpages, extracting accessibility data, and collecting task demonstrations. What does not exist is a low-friction tool that turns normal computer use into valid pre-action-state -> verified-next-action examples automatically, without days of manual reconstruction or custom capture engineering.

This is a utility, fidelity, and usability claim. Privacy should not be foregrounded in the article.

## Narrative hook

Dylan wanted to run a simple four-day experiment: record normal work, ask a model to predict the next computer destination, and see whether the suggestions would justify a live Tab-style demo.

Day 0 was supposed to be recorder setup. It took three days. The hard part was not yet prediction. It was producing trustworthy examples of what Dylan saw before navigating and where he actually went next.

Possible opening:

> I wanted to test whether an AI could predict my next computer action. Before I could test the model, I discovered that the tool for creating the dataset does not exist.

## Important scope boundary

The eventual article must distinguish the missing automatic acquisition product from the minimum data needed for the first qualitative experiment.

The first retrospective NAP pilot does not require a perfect computer-use dataset. Screenpipe plus human review is sufficient because Dylan can manually identify event boundaries and supply the destination labels.

The July 26 fidelity review found only two non-relaxable requirements for a valid minimal experiment:

1. Strict pre-action ordering. The model must see only the state available before the navigation begins, never the resulting state.
2. Verified next-action labels. The recorded destination must actually be correct.

Exact joint AX and DOM identity, perfectly synchronized dual-monitor frames, cryptographic provenance, exact sub-second timing, and zero-loss guarantees are not prerequisites for the first qualitative test. They become more important when acquisition must be automatic, repeatable, and scalable.

The article should therefore not argue that a complete audit-grade dataset is necessary before testing whether NAP feels useful. It should argue that no existing tool produces even the valid state-action examples automatically and conveniently enough for an ordinary user.

## What the existing tools provide

| Tool or category | What it provides | Functional hole for this use case |
|---|---|---|
| Screenpipe | Continuous local history, separate monitor frames, screenshots, OCR, accessibility trees, app and window transitions, URLs, clicks, keys, scrolling | Linked frames can occur after the action; semantic click targets are incomplete, especially on the secondary display and inside Arc; it does not automatically segment normal work into verified semantic transitions |
| NAPsack | Timestamped input events, cursor coordinates, a pre-action screenshot buffer, click-time accessibility hit-testing | Captures only the cursor display, lacks structured app/window/tab context, does not reliably identify exact controls, and required a local patch for Dylan's negative-coordinate monitor |
| OpenAdapt | Action-gated screenshots and reusable macOS accessibility components | Built around recorded workflows and single-monitor assumptions rather than passive natural work; useful components, not a finished personal dataset recorder |
| AgentNetTool / OpenCUA | Task demonstrations with video, mouse and keyboard events, accessibility data, and browser HTML | Task-scoped annotation software; OBS and primary-screen assumptions; pre-action states are reconstructed later rather than guaranteed during capture |
| rrweb and browser recorders | Strong DOM event targets, mutations, focus, and webpage navigation evidence | Browser content only; no native applications, browser chrome, or cross-application transition layer |
| Folge, Scribe, and Tango | Easy workflow documentation and screenshots | Produce human-readable guides rather than a complete chronological state-action dataset |
| Recall, Rewind, and Screenomics-style systems | Searchable visual histories or sampled screen streams | Do not expose the verified semantic next-action examples needed for this experiment; some are closed or platform-specific |
| Custom Hammerspoon + ScreenCaptureKit + browser harness | Demonstrated that dual-display frames, native events, browser targets, and timestamps can be joined | Required excessive implementation, validation, permissions, and operator ceremony for a simple personal prediction experiment |

## The missing product

The missing tool is not another generic screen recorder. It is a dataset recorder for personal computer use.

For each meaningful navigation, it should produce an inspectable example containing:

- the observation available immediately before navigation began;
- current app, window, webpage, document, or task context;
- the physical route, when useful;
- the semantic destination actually reached;
- timestamps and monitor attribution sufficient to reconstruct the transition;
- the underlying screenshot and event evidence; and
- an easy way for a human to correct or reject the generated label.

It should propose meaningful event boundaries automatically. The user should review examples, not manually construct every row from raw screenshots and event tables.

A first version can tolerate approximate element identity and human correction. Its core job is to turn normal work into a usable sequence of state -> next-action examples.

## Proposed article shape

1. Start with the intended four-day NAP experiment.
2. Explain why Day 0 took three days.
3. Define the deceptively simple data unit: what I saw immediately before acting -> where I went next.
4. Show what Screenpipe captured and why it still did not automatically yield that unit.
5. Compare the other recorder categories and the hole each leaves.
6. Describe the custom harness and why proving that the pieces can be glued is not the same as having a usable product.
7. Specify the missing dataset recorder.
8. Separate the minimal manual experiment from the eventual automatic acquisition layer.
9. End with the simpler Screenpipe-plus-human-label pilot now being run.

The article should use the first-person investigation as its narrative, the tool comparison as evidence, and the missing dataset recorder as the product conclusion.

## Claims and framings to avoid

- Do not foreground privacy, security, or a privacy-conscious positioning.
- Do not claim Screenpipe records only screenshots or OCR. The local audit proved that it records clicks, keys, scrolling, application switches, focus changes, screenshots, accessibility content, and URLs.
- Do not claim every existing tool failed. Each solves a real subset of the problem.
- Do not claim the audit-grade capture stack is required for the first qualitative NAP experiment.
- Do not treat exact element identity, perfect dual-monitor synchronization, or cryptographic provenance as universal prerequisites.
- Do not claim the custom capture harness proves that next actions are predictable. It only shows that higher-fidelity acquisition is technically possible.
- Do not confuse a failed recorder with a failed prediction model.

## Candidate titles

- Day 0 Took Three Days
- The Missing Tool for Personal AI Is a Dataset Recorder
- Screen Recorders Are Not Dataset Recorders
- I Wanted to Predict My Next Computer Action. First I Had to Build the Recorder
- The Tool That Turns Normal Work Into Next-Action Data Does Not Exist Yet

## Evidence and related notes

- Minimal experiment and current protocol: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Fidelity scope and the two non-relaxables: [[computer-use-nap-fidelity-research-2026-07-26|NAP dataset fidelity research, July 26, 2026]]
- Screenpipe measurements: [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- Initial recorder comparison: [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
- Deep tooling survey: [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey, July 24, 2026]]
- Capture-layer design and smoke result: [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Capture layer v2 plan and spike sequence, July 24, 2026]]
- Full implementation history: [[computer-use-nap-build-log|Computer-use NAP build log]]

## Open decisions before drafting

- Primary audience: technical AI builders, founders and investors, or both.
- Whether the manual prediction pilot result becomes the ending or a later sequel.
- How much tool-by-tool technical detail belongs in the main text versus an appendix.
- Whether the final product claim is limited to NAP datasets or generalized to personal-model training data.

## Updates

- 2026-07-26: Framework captured after the first successful two-monitor Screenpipe test. Article drafting intentionally deferred.