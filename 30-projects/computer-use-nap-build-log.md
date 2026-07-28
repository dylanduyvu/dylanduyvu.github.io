---
type: project
status: active
created: 2026-07-23
updated: 2026-07-27
aliases:
  - Computer-use NAP build log
  - Desktop next-action prediction build log
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - screenpipe
  - napsack
  - data-acquisition
  - calibration
---

# Computer-use NAP build log

> [!important] Current direction, 2026-07-28
> The custom capture build and its 30-action walkthrough are historical for the first experiment. The immediate path is a manually verified retrospective pilot using Screenpipe evidence. Do not resume the capture ladder unless prediction results later justify automatic acquisition work. Current operational state: [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]].

> [!summary] Current status
> As of 2026-07-24: Capture Layer v2’s six-action smoke passed every real-data checker gate, and the checker independently caught all 54 synthetic failure mutations. The diagnostic walkthrough is now paused cleanly at **12/30 accepted checkpoints**, with Gmail `Settings` next. Steps 1–10 cover native actions; steps 11–12 prove exact Gmail DOM clicks and browser export integrity. The raw recorder stack remained stable, but the checkpoint validator was repaired during the walkthrough, so this is a diagnostic with disclosed protocol drift rather than one frozen formal calibration. Full continuation state is in [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]].

## Dataset-fidelity research, 2026-07-26

Scoping decision verified by a cross-paper deep-research pass: the complete synchronized dataset (dual-monitor sync, joint AX+DOM identity, cryptographic provenance, zero-loss guarantees) is load-bearing for the eventual always-on router, not for the first retrospective prediction experiment. Published precedent (AITW, AgentNet/OpenCUA, AndroidControl in-domain scaling, next-app prediction literature) supports a simple first dataset: active-monitor pre-action frame, active app/window/URL, input events, approximate target identity, manually verified next-action labels. Two properties do not relax even in the minimal experiment: strict pre-action frame ordering (no future-information leakage) and verified next-action labels; approximate element identity and single-monitor capture are compensable. In-domain fine-tuning saturates at hundreds-to-low-thousands of examples — the regime a personal system occupies by construction. Full synthesis with numbers, the modality-vs-performance table, and the staged fidelity-escalation plan: [[computer-use-nap-fidelity-research-2026-07-26|NAP dataset fidelity research, July 26, 2026]].

This does not change the gate ladder: the diagnostic walkthrough and capture-contract findings remain prerequisites, because even the simple dataset depends on the label pipeline they validate.

## Walkthrough checkpoint, 2026-07-24

The fixed 30-row manifest is frozen at SHA-256 `1b9a75f09d01b4fc605d7147cf34b59f59d7acf68cec68deef194ccb01fbe494`. The checkpoint session is:

`/Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z`

Accepted rows:

- primary Finder Icon and List View clicks;
- secondary Finder Column and Gallery View clicks;
- Notes search focus;
- Codex composer focus;
- Finder and Notes window activation;
- Finder `Command+1` and `Command+2`;
- Gmail `Main menu`; and
- Gmail `Advanced search options`.

Every accepted row has a hash-addressed evidence inventory, two display-freeze PNGs, Hammerspoon and SCK prefixes, and a link to the prior checkpoint. The browser rows also contain a local export with exact DOM target identity, top-frame document identity, contiguous sequence metadata, and zero declared write failures.

The procedure originally required a monolithic run. After missed markers and ambiguous live instructions threatened to erase valid progress, it was replaced with one immutable checkpoint per accepted action. Four partial runs are preserved as aborts. The latest is a clean pause after step 12; the step-13 ledger was opened but no ready marker or measured action occurred.

Current code at commit `42eb09e` passes 102 Python tests, four Arc recorder JavaScript tests, and all 54 failure-mutation fixtures. The original source inventory now fails on exactly the semantic checkpoint validator and its test because support was added for real native and Gmail evidence after preflight. The recorder sources still verify. Before Dylan resumes, remaining browser validators should be implemented and tested in one batch, the runtime should be frozen once, and preserved checkpoints should be revalidated where practical.

The walkthrough also surfaced two substantive capture-contract findings. First, five of the first 12 freezes had more than one second of cross-display skew, with a maximum of 3.765 seconds; the current checkpoint validator allows frames up to five seconds old and does not enforce the smoke test’s sub-second skew bar. Second, the supported browser validator proves the exact physical and DOM click but treats the declared UI postcondition as an operator observation rather than an independently required browser consequence. Both must be resolved or explicitly specified before the formal calibration.

This walkthrough still proves nothing about next-action predictability or product value.

## Capture Layer v2 smoke result, 2026-07-24

Clean run `spike-20260724T191643Z-3e7c` passed:

- exact Finder Back-button clicks on the secondary and primary displays;
- same-window Hacker News DOM click and committed navigation;
- literal `Command+Tab` and Finder activation;
- Gmail search-field focus;
- a secondary-display browser scroll and rrweb incremental events;
- two live ScreenCaptureKit display streams and six matched shared freezes;
- strictly prior, fresh, no-fallback freeze frames with decodable PNGs;
- healthy Hammerspoon event taps and Accessibility notifications; and
- complete browser run IDs and contiguous sequence numbers.

The fixture suite reported `54/54` failure gates verified.

An initial run failed three exact-native-target gates because the Finder coordinates were treated as window-relative rather than global Accessibility coordinates. The coordinates were corrected, the run was restarted from a fresh run ID, and the clean rerun passed without weakening the checker.

The next step is documented in [[computer-use-nap-30-action-walkthrough-2026-07-24|Computer-use NAP: what the 30-action walkthrough is]]. The immediate walkthrough is a diagnostic measurement pass. It should not be confused with the later blind, scored 30-action acquisition calibration.

## Status update, 2026-07-24

Snapshot reported from Dylan's other assistant's working session, logged verbatim in substance; sample sizes differ from the July 23 audit because these come from later, larger sessions, so the numbers below coexist with rather than correct the earlier ones.

Proven as of this date:
- Continuous raw evidence on both monitors: screens, OCR, accessibility trees, application, window, and URL metadata, physical input (Screenpipe), plus pre-action screenshots roughly 100-170 milliseconds before each click with coordinates and click-time accessibility (NAPsack).
- Monitor attribution fixed and holding: 11 of 11 smoke clicks mapped to the correct physical display after the vertical-monitor patch, and the two recorders agree on click position within roughly 13 milliseconds.
- Artifacts durable: database integrity, decodable screenshots, ample storage all check out.
- On paper: a fully specified, three-times-audited fidelity protocol (blind labeling, sealed answers, deterministic scoring, hash-pinned inputs).

Missing toward the goal:
- THE CRUX, semantic identity where Dylan actually works: zero of 493 secondary-monitor clicks in the larger session carried direct role, name, and bounds from Screenpipe, and NAPsack got direct accessibility on only 5 of 11 smoke clicks. "What exactly did I click" currently rests on screenshot-plus-coordinate inference that has never been scored at scale; webpage controls will likely need the Arc extension as ground truth. This is the one genuinely open question; everything else is engineering.
- Trustworthy pre-action context: Screenpipe's linked frames remain unsafe (roughly 43 percent land at or after the action in this sample, versus roughly 46 percent in the July 23 audit, different sessions), NAPsack buffers only the cursor's monitor, and the both-screens-at-decision-moment path, especially for keyboard actions on the other display, is designed but unvalidated. The decision-point cutoff fix is only landing now.
- Coverage: every non-click action (keyboard navigation, focus, app switches, page navigation) has zero measured fidelity.
- Code: the repository contains the specification and nothing else. No runner, joiner, snapshotter, or scorer.
- Natural work: the controlled test uses manual markers; real work has none, and the rules for what counts as one action do not exist yet.

Position and honest framing: step zero-to-one on the ladder (harness, 30-action calibration, natural-segmentation test, 50-100-action natural audit at roughly 90 percent, endurance, multi-day collection). Nothing found so far disproves the goal; every failure is unmeasured rather than impossible. Passing all capture gates deliberately proves nothing yet about whether the next actions are predictable; that question stays parked until the pipeline earns trust.

Reuse conclusion adopted from the [[computer-use-capture-tool-research-2026-07-23|recorder survey's 2026-07-24 update]]: the big labs run this category internally (Meta's Model Capability Initiative confirmed), open components exist to glue (OpenAdapt's battle-tested macOS accessibility layer, openadapt-capture and openadapt-privacy, rrweb for the conditional Arc extension, AgentNetTool and PC Tracker as reference implementations), and the four things the gates require (dual-monitor decision-point-safe preframes, exact-semantic scoring with blind labels, zero-silent-loss accounting, natural-action segmentation) exist nowhere and remain the novel build.

## Product target

Dylan's proposed product is a personalized keyboard routing layer for computer use:

- Tab, or one of three stable hotkeys, offers the top three places Dylan is most likely to want to go next.
- A destination may be a specific application, window, webpage, document, Codex task, input field, link, or button.
- The initial target is **where Dylan goes next**, not what he writes there, what context he needs, or what higher-order goal caused the action.
- The first evaluation is retrospective. No suggestions are displayed while Dylan works.
- The desired output is eventually a public live demo if the retrospective evidence is strong enough.

The original resolution ladder remains a possible longer-term direction:

> where Dylan goes next
>
> ↓
>
> what he does there
>
> ↓
>
> what context he needs
>
> ↓
>
> what desire or goal is driving it
>
> ↓
>
> a better next action toward that goal

Only the first rung is currently in scope.

## Why this is inside Niyant's vision

On July 22, Dylan asked Niyant what he would have Dylan, or a generic second pair of hands, build to contribute to the personalization vision. Dylan reported that Niyant answered: build the computer-use NAP concept.

Niyant had initially called the Tab-routing idea too vague. After Dylan specified exact within-app and cross-app destinations, the progression from destination to content and goal, and the intended top-three shortcut interface, Niyant said it aligned overall. Niyant's own ideal target remains prediction of the next write because he considers content prediction stronger evidence of understanding. His main concern with starting at app prediction was that he uses only a few applications, allowing a trivial frequency predictor to appear useful.

The computer-use build therefore complements Niyant's next-write branch. It does not establish that navigation prediction implies goal understanding or validate the broader enterprise thesis.

## Prior art and the residual question

The broad claim that personal actions can be predicted is not novel:

- *A Click Ahead* recorded roughly one week of one person's Windows activity, trained a closed-vocabulary recurrent model, reported `34.63%` exact next-action accuracy over 442 recurring actions, and built a real-time top-five display.
- LongNAP found learnable personal action-trajectory signal under its own phone-derived, retrieval-augmented setup.
- Tada and Tabracadabra provide a runnable keyboard-first personal-AI writer. Tabracadabra begins after the user has already selected a text field, retrieves relevant Tada activity logs, and streams text into the field.

These systems do not answer Dylan's product-specific residual:

> Can an obtainable record of Dylan's normal Mac work support exact, useful top-three destination shortcuts that feel valuable enough to justify a public live router?

Tabracadabra was therefore treated as prior art rather than a separate experiment. It is a writer; Dylan's first target is the router.

## Evolution of the experiment

### Initial rolling replay

The first plan was:

1. Record one day of work.
2. On Day 2, compare the same off-the-shelf model with current-screen-only input versus Day 1 history.
3. On Day 3, compare no history, one day, and two days on the same Day 3 events.
4. On Day 4, compare no history, one day, two days, and three days on the same Day 4 events.

This rolling design remains a possible later experiment. It can provide early signal while preserving a within-day comparison. It does not involve fine-tuning.

### Why prediction was deferred

The team correctly identified Day 0 as load bearing: before measuring model quality, the project must prove that it can obtain and structure the exact action labels.

If the recorder knows only that a click occurred at coordinates, then a failed prediction could mean:

- the behavior was not predictable;
- the model was poor;
- the event boundary was wrong;
- the target label was missing or too coarse; or
- the supposedly pre-action screenshot already showed the result.

The current LBH therefore moved one rung earlier:

> Can a practical capture stack reconstruct exact semantic targets with little enough noise that a next-action result would be interpretable?

## Screenpipe setup

Screenpipe `2.5.132` was installed and configured with:

- Screen Recording enabled;
- Accessibility enabled;
- Input Monitoring enabled;
- click and keyboard capture enabled;
- clipboard capture disabled;
- microphone access denied; and
- Screenpipe audio recording disabled.

Its local health endpoint reported a healthy full-mode UI recorder, active input tap, and active application-event recorder.

Screenpipe records much more than extracted text. The database contained:

- clicks;
- scroll gestures;
- individual and aggregated keyboard events;
- application switches;
- window-focus changes;
- screenshots;
- OCR and Accessibility trees; and
- active Arc URLs in the frame stream.

### Display geometry

Dylan's display layout is:

| Display | Global bounds |
|---|---|
| Primary | `left=0`, `top=0`, `1512×982` |
| Secondary | `left=-557`, `top=-1440`, `2560×1440` |

Dylan does most of his work on the secondary display, including Arc, Codex, and Claude. Reliable secondary-display capture is therefore mandatory rather than an edge case.

## Screenpipe audit

### What passed

Screenpipe is useful as a contextual backbone:

- both displays are recorded visually;
- physical clicks and global coordinates are present;
- application and window transitions are present;
- Arc page URLs appear in frames;
- OCR and Accessibility context are available; and
- audio remained off.

### What failed

In a frozen roughly 50-minute natural session:

- there were an estimated 150 physical clicks after collapsing duplicate raw and Accessibility-enriched rows;
- only 78 had a direct role, name, and bounds;
- all 40 secondary-display clicks lacked direct semantic target fields;
- all sampled Arc webpage clicks lacked an authoritative DOM target; and
- zero UI events directly carried the Arc URL even though Arc frames did.

Screenpipe can often answer:

> a click happened here while this application or page was visible

It cannot consistently answer:

> Dylan clicked this exact named button, link, input, task, or document

### Frame-link leakage

`ui_events.frame_id` is not a trustworthy pre-action observation. In the audit, linked frames sometimes occurred before the action and sometimes after it. The original audit counted roughly 46% of click-linked frames as post-click. A July 27 recheck of the raw microsecond timestamps corrected the split to 83 of 164 after the click and 81 before it. Some pre-click links were up to 25.3 seconds old.

The correct reconstruction must independently select the latest frame with a timestamp strictly earlier than the action for each display. A linked result frame may be preserved only as validation evidence, never as model input.

### Screenpipe-only decision

Screenpipe alone failed the exact-target acquisition gate. Starting the rolling prediction test at that point would have confounded recorder failure with model failure.

## Recorder research

No reviewed turnkey Mac recorder combined all of the following:

- exact Arc DOM targets;
- native Accessibility controls;
- both displays;
- raw timestamps;
- long passive recording;
- application, window, and URL context; and
- leakage-safe pre-action images.

The selected acquisition ladder was:

1. Keep Screenpipe for both-monitor context, applications, windows, URLs, OCR, and its raw event stream.
2. Add NAPsack for click-time coordinates, active-monitor screenshots, and independent macOS Accessibility hit-testing.
3. Add Arc DOM instrumentation only if webpage controls remain the failing category.

AgentNetTool, Screencap, Understudy, OpenAdapt, UI + API Recorder, rrweb, UI.Vision, and other recorders were considered. Each solved only part of the problem or added premature setup cost. UI + API Recorder remains the leading conditional Arc companion because it can export semantic webpage target fields, but it does not cover Arc chrome or native applications.

## NAPsack setup

NAPsack `0.1.3` was installed as a `uv` tool under Python `3.13.5` because Dylan's default Python 3.14 is unsupported.

The calibration configuration used:

```bash
/Users/dylanvu/.local/bin/napsack-record \
  --session-dir <fresh-session-directory> \
  --fps 12 \
  --buffer-seconds 12 \
  --accessibility \
  --disable move
```

Important operational facts:

- Screen Capture and Accessibility permission were verified.
- Screenpipe and NAPsack can run concurrently.
- The bouncing Python Dock icon is a harmless side effect of the recorder registering as a GUI process.
- A clean `Ctrl+C` normally triggers sanitization.
- `aggregations.jsonl` is valid JSON and is the preferred input.
- `events.jsonl` contains Python representations despite its extension and must not be parsed as strict JSON.
- A fresh session directory is required for each run because outputs append.
- Literal keys and text-field Accessibility values may be stored.

## First NAPsack smoke run

The first run recorded clicks, typing, and other input. It substantially improved secondary-display evidence over Screenpipe alone. NAPsack Accessibility identified examples such as:

- Gmail search;
- `Has attachment`;
- `gpu financing obsidian`; and
- `personalization obsidian`.

The run also exposed a critical monitor mismatch. NAPsack assigned secondary-display events to monitor 0 even when their global `y` coordinate was negative.

## Dual-monitor bug

### Root cause

NAPsack used two incompatible coordinate sources:

- its input handler used `screeninfo`, which reported the secondary display below the primary at positive `y`; and
- its screenshot worker and macOS pointer events used MSS physical coordinates, which reported the display above the primary at `top=-1440`.

Negative-`y` clicks did not match the input handler's monitor bounds and fell back to monitor 0. The event monitor and screenshot monitor could therefore disagree.

### Fix

The installed NAPsack input handler was patched to use MSS monitor bounds, matching the screenshot worker and physical pointer coordinate system.

The local patch is currently in:

`/Users/dylanvu/.local/share/uv/tools/napsack/lib/python3.13/site-packages/napsack/record/handlers/input_event.py`

Regression tests are in:

`/Users/dylanvu/napsack-runs/tests/test_secondary_monitor_mapping.py`

The tests verify:

- a primary point maps to primary monitor 0; and
- a negative-`y` point maps to secondary monitor 1 with the correct bounds.

Both tests pass. The patch is fragile because reinstalling or upgrading NAPsack can overwrite it. The repeatable build must preserve the patch or apply a version-checked adapter and replace the machine-specific test with mocked display layouts.

## Corrected NAPsack run

The corrected run produced 11 clicks, including seven on the secondary display.

### Verified capture

- All seven secondary clicks mapped to monitor 1.
- The recorded bounds were `left=-557`, `top=-1440`, `width=2560`, `height=1440`.
- Every secondary click had a same-display pre-action screenshot.
- The screenshot preceded the click by approximately `0.106` to `0.171` seconds.

### Semantic labels

Only four of the seven secondary clicks were meaningful intended controls. The other clicks landed on a window edge, static instruction text, or blank space while Dylan followed the on-screen checklist or tried to stop the Python process.

Of the four meaningful controls:

- direct NAPsack Accessibility identified the Arc Gmail account tab;
- direct NAPsack Accessibility identified the pinned X favorite;
- Accessibility did not identify X's new-posts control; and
- Accessibility did not identify the Codex composer.

Two independent blind visual reviews inspected only the marked pre-click screenshots. Screenshot plus coordinate reconstruction recovered the X new-posts control and Codex composer. Direct Accessibility resolved the one visual disagreement about the pinned X favorite.

The hybrid therefore reconstructed all four meaningful controls in this tiny sample.

### Why this did not pass

The run was not a valid 10-action calibration:

- several clicks were on the instructions displayed inside Codex;
- several clicks were used to stop Python;
- only four actions were meaningful intended targets; and
- the hybrid visual step was not yet a repeatable pipeline.

Four reconstructable actions are evidence that the hybrid is promising. They are not evidence of roughly 90% coverage.

## Current capture status

| Layer | Status |
|---|---|
| Both-monitor screenshots | Passed |
| Physical click timestamps and coordinates | Passed in observed samples |
| Secondary-monitor assignment | Fixed and regression-tested |
| Same-display pre-click screenshot | Passed in the corrected sample |
| Application and window transitions | Available from Screenpipe |
| Arc page URL | Available from Screenpipe frames |
| Direct exact native or Arc Accessibility label | Partial |
| Retrospective screenshot-plus-coordinate label | Promising, not yet automated or validated |
| Authoritative Arc DOM selector | Missing |
| Exact destination dataset at useful scale | Not yet produced |
| Next-action prediction | Not started |
| Live top-three shortcut | Not started |
| Public demo | Not started |

Broad inter-app transitions are ahead of webpage control recording. The current stack can often reconstruct that Dylan left one application or page and went to another. It cannot yet automatically and reliably produce the exact endpoint for every action.

## Exact-target definition

For the acquisition calibration, an exact target is the specific human-understandable destination or control, for example:

> X's `Show 15 posts` button

A stable DOM selector is not required at this rung.

This boundary matches the retrospective experiment. Executable selectors become necessary only if prediction succeeds and the project builds the live router.

## Canonical hybrid event

The repeatable labeler should emit one record per intended action:

```text
action_id = <run_id>:<burst_id>
timestamp_us
action_kind = click | focus | app_switch | key_command | page_navigation
physical input events inside the action interval
global_x, global_y when applicable
monitor bounds and scale
NAPsack Accessibility payload when available
NAPsack same-display preframe and click marker when applicable
strictly prior Screenpipe frame from each display
Screenpipe application, window, and URL context
observed destination transition
reconstructed semantic target
label confidence
label provenance
algorithm or prompt version
ground-truth comparison result
```

Important joins:

- For clicks, use the NAPsack `request_state=start` aggregation containing `mouse_down`.
- For keyboard, focus, application-switch, and page-navigation actions, use the calibration action interval and the relevant NAPsack and Screenpipe events inside it.
- Do not trust NAPsack's monitor field for keyboard-only actions because it assigns the event to the monitor containing the cursor. Derive the source and destination display from Screenpipe application/window transitions and timestamp-aligned frames instead.
- Do not use its top-level cursor position because it may be null or stale.
- Convert NAPsack epoch seconds to integer microseconds.
- Match monitor geometry by bounds, not numeric monitor index.
- Select Screenpipe frames with timestamps strictly earlier than the action.
- Open the active Screenpipe SQLite database read-only without `immutable=1` because it uses a write-ahead log.
- Resolve deduplicated Screenpipe element trees with `COALESCE(elements_ref_frame_id, id)`.

## Controlled stack acceptance test

The project will not move directly from the four-action sample to ordinary multi-day recording.

Clarification added July 27: this ladder was intended to validate an automatic collection pipeline, not establish a permanent human-labeling workflow. Known actions, hidden answers, blind reconstruction, and scoring were calibration machinery. If the controlled diagnostic, formal calibration, and 50–100-action natural-work audit all passed, subsequent records would enter the prediction experiment directly. Manual per-record labeling became the fallback after the automatic stack was paused.

The next sequence is:

1. Make hybrid reconstruction repeatable.
2. Run one clean 30-action calibration.
3. Proceed to a one-to-two-hour natural session only if the calibration passes.
4. Audit 50–100 mixed natural actions with unresolved events retained.
5. Begin multi-day prediction recording only if the natural audit reaches the roughly 90% exact-target gate without silent losses.
6. Add Arc DOM recording if webpage controls are the failing category.

### Proposed calibration composition

The exact allocation below is a proposed design decision for the first repeatable runner. It has not yet been executed or validated.

| Category | Actions |
|---|---:|
| Native desktop controls | 10 |
| Ordinary Arc webpage controls | 10 |
| Dynamic or custom webpage controls | 5 |
| Cross-monitor actions | 5 |
| **Total** | **30** |

The set should include clicks, application or window switches, focus changes, key commands, and page navigation rather than testing clicks alone.

### Proposed pass criteria

The overall `27/30` threshold and zero-silent-miss rule were reaffirmed before this logging pass. The category-specific thresholds below preserve the earlier recorder protocol and remain part of the design awaiting final approval.

- All 30 intended physical actions appear.
- There are zero silently missing actions.
- At least 27 of 30 semantic targets are reconstructed exactly.
- At least 9 of 10 native targets are exact.
- At least 14 of 15 combined ordinary and dynamic webpage targets are exact.
- At least 4 of 5 cross-monitor targets are exact.
- Every action has a correctly assigned display and a strictly earlier pre-action image.
- Ambiguous, extra, and unresolved actions remain failures rather than being discarded.

If the browser categories fail while native and cross-monitor categories pass, add Arc DOM instrumentation and rerun the failed browser category. If the hybrid fails broadly, repair or replace the acquisition stack before collecting ordinary work.

Passing this controlled test validates only that the stack deserves a natural-session audit. It does not yet validate ordinary-work coverage or unlock prediction by itself.

## Proposed repeatable build

The proposed implementation has not yet been built or approved. Dylan confirmed the exact-target definition, then asked for this complete log before reviewing the remaining design.

### Recommended approach

Create a small standalone Python repository at:

`/Users/dylanvu/Projects/computer-use-nap`

Keep raw Screenpipe and NAPsack data outside Git.

The proposed system has four parts:

1. **Calibration runner**
   - Reads the 30 instructions aloud so the target list does not appear in screenshots.
   - Brackets one intended action at a time.
   - Uses an F8 completion marker to associate the action with its hidden expected target.
   - These voice and marker mechanics are proposed and remain subject to Dylan's design approval.

2. **Deterministic evidence bundler**
   - Joins NAPsack and Screenpipe.
   - Produces one evidence package per action, with a click marker when coordinates exist and transition evidence for non-click actions.
   - Keeps expected answers in a separate file.

3. **Blind semantic labeler**
   - Labels each package without seeing the expected target.
   - Uses direct Accessibility evidence first and visual reconstruction when necessary.
   - Saves the prompt, model or reviewer identity, raw output, confidence, and provenance.

4. **Automatic scorer**
   - Compares reconstructed labels with the hidden checklist.
   - Reports overall and category-level coverage.
   - Counts missing, ambiguous, extra, and unresolved events as failures.

### Alternatives rejected for now

- A fully automated external model API is more scalable but introduces API setup and model variability before the first acceptance test.
- Adding Arc DOM instrumentation first is premature because webpage controls have not yet failed the clean hybrid calibration.

The recommended first implementation is therefore a deterministic local bundler, blind Codex visual labeling, and automatic scoring. The code should preserve the NAPsack patch, guard against version drift, and include mocked monitor tests.

## Decisions that should not drift

- The first product question is next destination prediction, not semantic context or goal inference.
- The first prediction evaluation is retrospective, not live.
- The current work is acquisition, not prediction.
- Screenpipe alone failed the exact-target bar.
- The corrected four-action hybrid sample did not pass the acquisition gate.
- Stopping recorder research does not mean skipping validation of the selected stack.
- The clean 30-action test remains mandatory before a short natural capture.
- Dylan reaffirmed the overall threshold of at least 27 of 30 and zero silent misses before proceeding.
- Passing 30 does not replace the 50–100-action natural audit.
- Human-understandable semantic identity counts at this rung; stable executable selectors do not.
- Browser-side ground truth is required in Capture Layer v2 and is strictly label-only; it never enters predictor input. Current tooling (rrweb + CDP) is subject to spike results. (Supersedes: Arc DOM recording conditional on browser-category failure, 2026-07-23.)
- No result from this acquisition work validates prediction quality, product usefulness, personalization, goal understanding, or Niyant's enterprise thesis.

## Local artifacts

- NAPsack run A: `/Users/dylanvu/napsack-runs/secondary-smoke-2026-07-23-a`
- Corrected run B: `/Users/dylanvu/napsack-runs/secondary-smoke-2026-07-23-b`
- Monitor regression test: `/Users/dylanvu/napsack-runs/tests/test_secondary_monitor_mapping.py`
- Patched handler: `/Users/dylanvu/.local/share/uv/tools/napsack/lib/python3.13/site-packages/napsack/record/handlers/input_event.py`
- Screenpipe database: `/Users/dylanvu/.screenpipe/db.sqlite`

## Related notes

- Experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Product origin: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Niyant follow-up: [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- Prior art: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Screenpipe evidence: [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- Recorder survey: [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
- Deep tooling survey: [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey, July 24, 2026]]
- Fidelity research: [[computer-use-nap-fidelity-research-2026-07-26|NAP dataset fidelity research, July 26, 2026]]
- Branch decision context: [[nap-vs-gpu-configuration-experiment-fork|NAP versus GPU configuration experiment fork]]
- Capture v2 plan: [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Capture layer v2 plan and spike sequence, July 24, 2026]]
- Capture v2 walkthrough: [[computer-use-nap-30-action-walkthrough-2026-07-24|Computer-use NAP: what the 30-action walkthrough is]]
- Walkthrough handoff: [[computer-use-nap-walkthrough-handoff-2026-07-24|Computer-use NAP walkthrough handoff]]
