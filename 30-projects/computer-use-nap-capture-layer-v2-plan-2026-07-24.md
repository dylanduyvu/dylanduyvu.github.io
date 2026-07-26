# Computer-use NAP: capture layer v2 plan

**Date:** 2026-07-24

**Status:** Adopted. Six-action smoke passed; diagnostic walkthrough paused at 12/30 accepted checkpoints, with step 13 next.

**Context:** Follows three audit rounds of the hybrid action-labeler spec, the 2026-07-24 deep system audit, and the capture-tooling research survey.

## Why the pivot

- Deep audit findings: 0/493 secondary-monitor Screenpipe clicks carry direct AX role/name/bounds; ~43% of click-linked frames have equal-or-later timestamps; NAPsack buffers only the cursor's display.
- Roughly half of the current spec's complexity is compensation machinery for those specific tool weaknesses: state-change frame validity, browser-lineage inference, keyboard-display bounds intersection, the WAL snapshot apparatus, the NAPsack patch guard.
- Tooling survey conclusion: no off-the-shelf recorder meets the dual-monitor + pre-action + accessibility bar, but MIT-licensed components cover every capture primitive individually.

## The decision: split the spec

**Spec A — Calibration & Verification Protocol (keep ~90%).** Manifest structure, canonical naming rubric, marker/invalidation state machine, blind pack, reviewer isolation, sealing, three-level failure table, zero-tolerance gates, thresholds (27/30 overall, 9/10 native, 14/15 web, 4/5 cross-monitor, zero silent loss), single-shot review/seal/score, decision tree, evidence boundary. Capture references rewritten as a tool-agnostic **capture contract**: per action, the capture layer must provide one authoritative trigger with epoch-µs timestamp; a decision-point frame from every connected display strictly before the trigger; element identity at trigger point; committed destination state before completion; per-source clock alignment proven to ±100 ms. Acceptance thresholds and gate strength are invariant (27/30 overall, 9/10 native, 14/15 web, 4/5 cross-monitor, zero silent loss, zero-tolerance display correctness); timing constants and tool-specific wording are set from spike measurements, then frozen into Spec B's hash before any calibration run — measured once, never tuned against results.

**Spec B — Capture Layer v2 (rewrite).** New stack and what each piece replaces:

- Two ScreenCaptureKit streams, one per physical display, rolling ring buffers → replaces NAPsack's cursor-only buffer and Screenpipe frames as predictor context; restores a simple max-age freshness rule; makes `decision_point_us` (freeze both buffers at the tone) implementable. Action-proximate frames become label-only.
- Hammerspoon AXObserver + window filter + eventtap → replaces focus/app-switch inference from Screenpipe rows; real focus-change notifications with window identity end the browser-lineage and app-switch-signature inference entirely.
- rrweb + CDP (`Page.frameNavigated`, `loaderId`, `DOM.getNodeForLocation`) in the Arc extension → label-only navigation and DOM ground truth; tab/frame/target IDs distinguish same-display Arc windows directly.
- atomacos element-at-point + macapptree tree dumps at trigger time → the direct answer to the 0/493 accessibility gap.
- NAPsack: retired entirely (patch guard, hash pins, adapter deleted). Screenpipe: demoted to optional label-side OCR/search context, removed from every gate; the snapshot/watermark section is deleted — evidence lives in harness-owned append-only files (fsync + hash).

**Carry rule for old-spec content:** requirements carry verbatim; tool-coercion machinery dies; tool-phrased gates translate at equal or stricter strength (e.g. "NAPsack trigger-display preframe ≤500 ms" → "decision-point frame from every connected display ≤ N ms").

## Spike before Spec B (1–2 days, throwaway)

Purpose: never again write load-bearing rules on unprobed recorder behavior — every prior major failure (frame linkage, focus-row emission, cursor-monitor attribution) came from legislating assumed behavior. Four glue pieces, no harness, no scoring:

1. Hammerspoon config logging AXObserver notifications (focus, window, title) and eventtaps (clicks, keys, scrolls) to JSONL with timestamps, window IDs, per-event display resolution.
2. Dual SCK streams dumping frames with presentation timestamps; test freezing both buffers at a marker.
3. atomacos element-at-point per click + macapptree dump of the frontmost window.
4. Minimal rrweb + `chrome.webNavigation` extension loaded into Arc, run on real sites.

Walk the 30-action manifest through it informally. Go/no-go questions:

- Element-at-point role/name coverage on the secondary (negative-coordinate) display.
- Arc AX and focus-notification sanity, including Little Arc and split view.
- Both SCK streams correct on the secondary display; SCK presentation clock alignable to eventtap time within tolerance (known epoch mismatch).
- rrweb survival on Gmail and X.
- Measured constants — real frame ages, clock skew, AX coverage — that become spec numbers instead of placeholders.

Output: one-page findings note (per component: works/doesn't on this setup + measured numbers).

## Smoke result and next gate

The clean six-action smoke run `spike-20260724T191643Z-3e7c` passed every real-data checker gate. The checker’s mutation suite also verified 54/54 failure gates. This proves that the current spike can join exact native controls on both displays, browser DOM and navigation events, focus and application switches, scrolling, shared two-display freezes, and correctly sequenced local evidence without the previously observed recorder failures.

The smoke does not establish coverage across ordinary work. The next step is the diagnostic 30-action walkthrough described in [[computer-use-nap-30-action-walkthrough-2026-07-24|Computer-use NAP: what the 30-action walkthrough is]].

This diagnostic walkthrough is distinct from the later blind, scored 30-action calibration. Its job is to measure capture-component behavior and produce the findings needed to write the capture contract and Spec B. The formal `27/30` acceptance gate applies only after the harness exists.

The live diagnostic now has 12 immutable accepted checkpoints. The recorder sources remained frozen, but the semantic checkpoint validator was repaired during collection, so the repository source-inventory check now differs on the validator and its test. This protocol drift is disclosed in [[computer-use-nap-walkthrough-handoff-2026-07-24|the operational handoff]]. The run remains useful as a component diagnostic but is not one frozen formal calibration.

## Sequence

1. Freeze the current spec hash as the protocol baseline (post latest agent patch).
2. Run the spike; write the findings note.
3. Draft the capture contract + Spec B skeleton against measured behavior (Claude, from findings + frozen hash).
4. Single re-audit of the pair.
5. Implement the harness.
6. 30-action calibration → 30-min natural-segmentation test → 50–100-action natural audit (≥90%, zero silent loss) → endurance test → multi-day collection.

## Principles and risks to own

- Probe-before-legislate: every load-bearing recorder behavior gets a live doctor probe before any rule depends on it.
- Clock alignment is the #1 correctness risk in the new stack; generalize the three-source marker round-trip into a per-source clock proof at session start.
- Encrypt session directories at rest (Meta MCI leak is the cautionary tale); keep the data-egress enumeration (blind pack → reviewer model service, nothing else leaves).
- Licenses: adopted components are MIT (rrweb, Hammerspoon, atomacos, macapptree, openadapt-capture patterns). No code from OpenCUA/AgentNetTool (research-only license) or Screenomics (CC BY-NC) — reference designs only.

## Related notes

- Build log: [[computer-use-nap-build-log|Computer-use NAP build log]]
- Walkthrough: [[computer-use-nap-30-action-walkthrough-2026-07-24|Computer-use NAP: what the 30-action walkthrough is]]
- Operational handoff: [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]]
- Recorder survey: [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
- Deep tooling survey: [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey, July 24, 2026]]
- Fidelity research: [[computer-use-nap-fidelity-research-2026-07-26|NAP dataset fidelity research, July 26, 2026]]
- Screenpipe evidence: [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- Current spec: `/Users/dylanvu/Projects/computer-use-nap/docs/superpowers/specs/2026-07-23-hybrid-action-labeler-design.md`
