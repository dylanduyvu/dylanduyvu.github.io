---
type: writing-prep
status: ready-for-draft
created: 2026-07-26
updated: 2026-07-26
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - blogpost-prep
  - computer-use
  - data-acquisition
  - next-action-prediction
---

# Blog prep: Day 0 Took Three Days

## Status

Prep document only. This freezes the evidence, scope, argument, and planned structure before a first draft. It is not draft prose.

## Editorial decision

**Primary audience:** AI builders, written clearly enough for a smart generalist.

**Desired reader conclusion:** Dylan could not find one public tool that turned ordinary work on both of his monitors into verified navigation examples he could quickly review and use. He wants builders who already have that tool, or are working on it, to react or reach out.

**Primary use case:** Predicting the exact place Dylan will navigate next. This is one narrow kind of next-action prediction. The article's dataset rows are `next-destination examples`, not general examples of everything Dylan might type, click, or do. Broader personal AI context is origin and motivation, not the article's main claim.

**Author position:** Dylan is not an ML researcher or a computer-use data engineer. He used AI coding agents to inspect the tools, build glue, and validate the capture stack. The point is not that the agents failed. The point is that even with agents doing much of the technical work, producing this basic personal dataset imposed an unreasonable integration and review burden.

**Evidence posture:** First-person investigation. The article can say what happened on Dylan's Mac, what the reviewed public tools document, and what Dylan infers. It cannot prove that no internal, proprietary, or unreviewed tool solves the problem.

**Recommended title:** `Day 0 Took Three Days`

**Recommended deck:**

> I wanted to test whether a model could predict where I would go next on my computer. The hard part was turning normal work into correctly ordered, verified examples.

## The live crux

Why did tools that recorded Dylan's screens and inputs still leave him manually reconstructing what he saw before each move and where he went next?

Most of the raw recording pieces already exist. The useful question is whether an individual builder can install one product, record ordinary work across apps, and receive valid navigation examples to review without querying raw databases or operating a capture ceremony for every move.

## Working thesis

Recommended full wording:

> Screenpipe recorded both monitors and many of my inputs. I did not find one tool that turned that recording into a queue showing what I could see before each move and the exact place I went next. Screenpipe gave me enough evidence to try building those examples by hand, but it did not build them automatically.

Short compression:

> Screenpipe gives me enough raw material to attempt the manual pilot. I have not yet validated the resulting examples. It was not an automatic dataset builder for my workflow.

Product conclusion:

> The missing part sits between recording and the dataset. It proposes navigation examples from ordinary work and lets the user accept, correct, or reject them.

Do not write `the tool does not exist`. Write `I could not find one that did the whole job for my workflow`.

## Causal chain

1. This navigation-prediction test needs examples pairing the state available before a move with the destination reached next.
2. Existing recorders capture many of the raw ingredients.
3. Raw ingredients do not automatically determine where one move ends and another begins, which screen state came safely before the move, or the exact destination reached.
4. Building an audit-grade automatic pipeline around those gaps consumed three days before Dylan tested a model.
5. That delay exposed both a real missing example-building step and a sequencing mistake. The full automatic pipeline was not required for the first qualitative pilot.
6. Screenpipe plus manual review is the minimal protocol now being attempted.
7. If the prediction proves useful, automatically creating those review rows becomes a concrete product worth building.

Every section in the draft must prove one link in this chain.

## Opening and central scene

The article opens with a four-sentence abstract that compresses the claim:

> I wanted to test whether a model could predict where I would navigate next. That test needed examples of what I saw before each move and where I went. The recording tools captured most of the raw material. I could not find one that assembled the examples for my ordinary work.

Then move into the concrete scene:

> I planned a four-day experiment. Day 0 was recorder setup. Day 0 took three days.

Date check for the title-level fact:

- the experiment fork was committed on July 23 at 11:04 AM;
- the build ledger began on July 23 at 5:09 PM;
- the protocol was simplified into a manual pilot on July 26 at 12:49 PM, with prediction still not begun; and
- Dylan stated during the work, `it's been 3 days on day 0`.

`Three days` means roughly three elapsed days, not three discrete eight-hour workdays.

Then the concrete facts:

- The intended experiment was to record normal work, replay navigation moments retrospectively, and test whether a model's top three guesses felt useful enough to justify a live Tab-style demo.
- Prediction had not begun.
- Screenpipe was audited first.
- NAPsack was added and patched for Dylan's negative-coordinate secondary monitor.
- A custom Hammerspoon, ScreenCaptureKit, and browser stack was built and passed a six-action smoke test.
- A supposedly simple 30-action diagnostic walkthrough consumed most of a day and stopped at 12 accepted checkpoints.
- Five of those 12 freezes had more than one second of cross-display skew. The maximum was 3.765 seconds.
- The walkthrough had protocol drift and was a diagnostic, not a formal calibration.

The scene proves cost and motivates the scope correction. It does not by itself prove a market-wide product gap.

## The exact data unit

One usable example is:

> what was available immediately before I navigated → where I actually went next

Example:

> Arc showing the end of a specific article, with a specific Codex task unfinished → that Codex task's input field

The minimum fields for the first pilot are:

| Field | Meaning |
|---|---|
| pre-action observation | The screen state available before navigation began |
| context | Active app, window, webpage, document, or task when recoverable |
| recorded event | The physical switch, click, key command, scroll, focus, or page navigation |
| destination | The app, window, page, task, field, link, or button actually reached |
| verification evidence | The later screen or event evidence used to confirm the label, never shown to the predictor |
| human verdict | Accept, correct, reject, or unresolved |

Two validity requirements do not relax for this pilot:

1. The predictor cannot see the result of the action. The observation must be strictly prior.
2. The recorded next destination must be correct.

The first pilot does not require perfect cross-display synchronization, exact AX plus DOM identity, cryptographic provenance, exact sub-second timing, or automatic reconstruction of every control. Correct observation attribution still matters. Perfect automation does not.

## The minimum product

The missing product should run during normal work and produce a review queue of meaningful transitions.

Each row should show:

1. what was on screen immediately before navigation;
2. the destination it believes Dylan reached;
3. the screenshot and event evidence behind both;
4. enough app, window, page, and control context to understand the row; and
5. controls to accept, correct, reject, or mark the row unresolved.

The accepted rows should remain in chronological order and be exportable as verified next-destination examples. Earlier accepted rows can then serve as personal history while later rows remain held-out events for prediction.

The user reviews examples. The user does not construct each example from raw frames, coordinates, event tables, and timestamps.

`Low friction` means install, record, and review. It does not mean query a SQLite database, join several clocks, run a marker ritual, or debug monitor geometry.

## Claim ledger

### Direct observations

| Claim | Evidence | Allowed wording |
|---|---|---|
| Day 0 consumed three days and prediction had not begun. | Dylan's contemporaneous account; [[computer-use-nap-build-log]] | First-person only. Never say the model failed. |
| Screenpipe 2.5.132 captured screenshots, clicks, keys, scrolling, app switches, focus changes, accessibility content, OCR, and Arc URLs on Dylan's Mac. | [[screenpipe-live-capture-audit-2026-07-23]] | Scope to the tested version and setup. |
| In the natural Screenpipe session, 76 of 164 linked click frames were timestamped after the click. | [[screenpipe-live-capture-audit-2026-07-23]] | Say the linked frame was not a guaranteed pre-action frame. |
| In the same session, zero of 40 secondary-display clicks contained direct semantic role, name, and bounds fields. | [[screenpipe-live-capture-audit-2026-07-23]] | Scope to the measured session. Do not generalize to all installations. |
| All 33 Arc frames had a page URL, while none of 484 UI-event rows directly carried one. | [[screenpipe-live-capture-audit-2026-07-23]] | Do not say Screenpipe failed to record URLs. The streams were not joined at the action row. |
| NAPsack required a local monitor-geometry patch on Dylan's negative-coordinate display setup. | [[computer-use-nap-build-log]] | Local implementation fact, not a claim about every setup or current release. |
| The corrected NAPsack controlled run produced same-display pre-action screenshots 106 to 171 ms before seven secondary-display clicks. | [[computer-use-nap-build-log]] | Tiny controlled sample. Use only to show useful primitives existed. |
| Direct Accessibility identified two of four meaningful targets. Screenshot-plus-coordinate review reconstructed the two misses. The combined AX and visual path resolved four of four, with AX resolving one visual disagreement. | [[computer-use-nap-build-log]] | Promising diagnostic, not production-level coverage. |
| Capture Layer v2 passed a six-action real-data smoke test and the checker caught 54 of 54 synthetic failure mutations. | [[computer-use-nap-build-log]] | Validates controlled plumbing, not natural-work segmentation or prediction. |
| The 30-action diagnostic stopped at 12 accepted checkpoints. Five freezes exceeded one second of cross-display skew, with a 3.765-second maximum. | [[computer-use-nap-build-log]] | Progress and engineering evidence, not accuracy. |
| Niyant first called the idea too vague, later said it aligned overall, and warned that Dylan's small app distribution could make suggestions trivial. | [[tab-could-autocomplete-the-next-computer-action]] | Preserve both the alignment and the unresolved low-entropy concern. |

### Supported synthesis

| Claim | Support | Confidence and boundary |
|---|---|---|
| Existing tools solve real subsets of the capture problem. | Screenpipe, NAPsack, OpenCUA, OpenAdapt, and rrweb primary materials plus local tests | High. This should be stated before any gap claim. |
| Screenpipe was a useful context backbone but did not automatically produce Dylan's exact semantic transitions. | Local Screenpipe audit | High for this setup and version. |
| A post-action frame can invalidate retrospective next-destination evaluation. | Local timestamps plus OpenCUA's documented last-distinct-prior-frame matching | High. |
| The custom stack shows the required evidence streams can be joined. | Smoke test and mutation suite | High for controlled actions. It does not show passive segmentation at useful scale. |
| Bad acquisition can make recorder failure look like model failure. | Frame-ordering and label-coverage findings | Strong evaluation logic. |
| No public tool reviewed combined passive natural work, both displays, safe prior state, semantic cross-app destinations, and a quick correction queue for Dylan's setup. | Bounded tool survey and local tests | Defensible only as `no tool I reviewed`. |

### Inference

| Inference | Safe treatment |
|---|---|
| There is a product opportunity in the example-construction layer. | Dylan's conclusion from the investigation, not established market demand. |
| Automatic boundary proposals would remove most of the manual work. | Product requirement to test, not an achieved feature. |
| Screenpipe plus manual review is enough for the first pilot. | The minimal protocol now being tested, not a completed result. |
| Approximate target identity will be enough to judge qualitative usefulness. | A scoped hypothesis for the first experiment. |
| Perfect simultaneous capture of both monitors is unnecessary for the manual pilot. | Distinguish perfect synchronization from correct observation attribution, which remains necessary. |

### Speculation

The draft must flag or exclude these:

- Dylan's exact next destination is predictable.
- Personal history will improve prediction.
- Top-three shortcuts will feel useful.
- The result will justify a public live demo.
- A recorder can segment ordinary work accurately with little review.
- Navigation prediction leads naturally to understanding desires or goals.
- There is enough market demand for a standalone recorder business.

None of the capture work establishes prediction quality, personalization lift, product value, or goal understanding.

## Quantitative fact sheet

Use only numbers that materially teach the distinction.

### Initial Screenpipe checkpoint

- 40 app switches
- 128 clicks
- 13 individual key events
- 17 scroll gestures
- 87 text bursts
- 59 focus changes
- 139 JPEG frames
- zero audio chunks

Of the 128 clicks, 61 had a role, 58 had a name, and 61 had bounds. The four sampled Arc clicks had none of those direct fields.

### Natural Screenpipe session

- roughly 50 minutes of frames and 48 minutes of UI events
- 484 UI-event rows
- 169 raw click rows
- 117 text bursts
- 94 focus events
- 68 app switches
- 22 scroll gestures
- 14 key events
- an estimated 150 physical clicks after removing likely duplicate enrichments
- 273 primary-display frames and 204 secondary-display frames
- zero of 40 secondary-display clicks with complete direct semantic target fields
- 76 of 164 linked click frames after the click

Do not use the later `0 of 493` formulation unless the underlying audit is recovered and the denominator is verified. Use `0 of 40`.

### Custom stack

- 11 of 11 smoke clicks mapped to the correct display after the NAPsack patch
- recorder timestamps agreed within roughly 13 ms in that smoke sample
- six real smoke actions passed
- 54 of 54 synthetic failure mutations were caught
- walkthrough stopped at 12 of 30 accepted checkpoints
- five of 12 freezes exceeded one second of display skew
- maximum skew was 3.765 seconds

## Tool comparison

This table is evidence for a conversion-layer gap, not a scoreboard. Every tool solves something real.

| Tool | What it publicly documents or locally demonstrated | Why it did not directly produce the agreed output for Dylan |
|---|---|---|
| [Screenpipe](https://github.com/screenpipe/screenpipe) | Event-driven multi-monitor capture, screenshots, accessibility trees, OCR fallback, clicks, scrolls, app switches, search, and local APIs | The tested version exposed raw ingredients, but the action-linked frame was not guaranteed to be prior and semantic targets were incomplete on Dylan's secondary display and inside Arc. No automatic queue of verified transitions emerged. |
| [NAPsack](https://github.com/GeneralUserModels/napsack) | Passively records launched natural-work sessions, groups input events into bursts, captures before and after evidence on the active display, generates action captions, and exports raw events and JSONL | This is a direct counterexample to broad claims about state-action generation. Its documented output does not promise stable AX or DOM destination identity or a correction inbox. It captures the active display rather than a synchronized two-display state. The version tested on Dylan's negative-coordinate setup also needed a local monitor patch. |
| [OpenCUA / AgentNetTool](https://github.com/xlang-ai/OpenCUA) | Records deliberate task demonstrations with screen video, inputs, accessibility trees, review tools, action reduction, the last distinct screen from before each action, and standardized trajectory export | This is the strongest counterexample. It is a curated annotation workflow with a declared task, start and stop, and manual review. Its macOS instructions document main-display capture. The residual claim is ambient ordinary-work discovery, dual-monitor state, and an inbox of proposed cross-app examples. |
| [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture) | Time-aligned event streams and media for recorded GUI workflows | Useful capture primitives and demonstration tooling. It is not evidence that passive ordinary work becomes a verified cross-app next-destination queue automatically. |
| [rrweb](https://github.com/rrweb-io/rrweb) | Serializes DOM state, records mutations and interactions, and replays web sessions | Strong browser evidence only. It does not cover native apps, browser chrome, or cross-app transitions. |
| [Scribe AutoCapture](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-discover-workflows) | A private beta for select customers that discovers workflows in the background on whitelisted web domains and lets users review, edit, save, share, or discard the resulting guide | This is a direct counterexample to claims that automatic workflow discovery or review queues do not exist. The residual gap is different: its public documentation does not promise native cross-app or dual-monitor capture, strictly prior next-destination rows, stable destination labels, or reusable raw dataset export. |
| Custom Hammerspoon + ScreenCaptureKit + Arc extension | Joined physical events, native Accessibility evidence, both-display images, browser events, timestamps, and validations in a controlled smoke test | It required custom engineering, multiple permissions, manual markers, frozen frames, validation rituals, and repeated repairs. It proved technical obtainability, not a usable acquisition product. |

Do not write that NAPsack or AgentNetTool failed to create state-action data. They do create forms of it. The narrower point is that neither directly gave Dylan the passive, dual-monitor, cross-app, review-ready semantic transitions specified here with low setup.

## The strongest counterargument

> You did not discover a missing tool. You overbuilt a benchmark. Screenpipe already captured screenshots, inputs, apps, windows, URLs, and accessibility data. A human can select the last pre-action frame and label the destination. Every dataset requires annotation. Stopping at 12 of 30 proves that the protocol was over-scoped, not that a tool is missing.

The article should concede most of this.

Recommended response:

> I was wrong if I meant that nobody can collect these pairs. NAPsack turns interaction bursts into screenshot-and-action examples, and OpenCUA has a sophisticated pipeline for safely ordered human demonstrations. The tools still left holes for my workflow, but I also treated an automatic, product-grade dataset as a prerequisite for a small qualitative experiment. That was a sequencing mistake. Screenpipe gives me enough raw material to attempt the prediction test with manual labeling. I have not yet validated those examples. The residual product gap is the work between recording and review: finding meaningful transitions, selecting a safely prior observation, proposing the destination, and packaging the evidence so the user corrects a row instead of building it.

This section is load-bearing. Without it, the post mistakes self-imposed protocol complexity for external evidence.

## Niyant origin section

Keep this short.

The idea came from trying to find a smaller first rung inside Niyant's broader personalization thesis. Dylan proposed Tab, or one of three hotkeys, routing him to the place he was most likely to want next: a specific app, window, webpage, task, input field, link, or button.

Niyant initially called the idea too vague. After Dylan narrowed it, Niyant said it aligned overall. His ideal target was still the content of the next write because that would imply deeper understanding. He also raised the most important easy-baseline concern: if Dylan uses only three applications, the system could cycle among them without being useful.

That exchange sets the target. The experiment is not trying to predict `Arc` or `Codex` as broad app labels. It is trying to predict the exact place within or across apps, such as a particular Codex task and its input field. It also explains why the first product question is qualitative usefulness, not raw app-switch accuracy.

Public context:

- [Dylan's full Tab / next-action note](https://dylanduyvu.github.io/00-inbox/tab-could-autocomplete-the-next-computer-action)
- [Dylan's shadow-experiment note](https://dylanduyvu.github.io/20-syntheses/computer-use-nap-shadow-experiment)
- [Niyant's Phase 1](https://handsdiff.github.io/phase-1)
- [Niyant's local tasking](https://handsdiff.github.io/local-tasking)

## Planned article structure

### 1. Day 0 took three days

Open with the four-sentence abstract above. Then tell the four-day plan, the fact that prediction never started, and the 12-of-30 stopping point. Concede immediately that the delay mixed a tooling gap with over-scoping.

### 2. The model needs destinations, not recordings

Define the example in normal English:

> what was visible immediately before I moved → where I went next

Explain why a continuous recording does not identify that row by itself.

### 3. Screenpipe recorded the ingredients, not the rows

Lead with what worked. Name screenshots, both monitors, inputs, app and window events, URLs, OCR, and accessibility data. Do not strawman the product as OCR-only.

Then use the two clean failures:

- 76 of 164 linked click frames were after the click.
- zero of 40 secondary-display clicks had complete direct semantic target fields.

Explain that someone still had to choose the boundary, find a safely prior state, and verify the destination.

### 4. The closest tools were genuinely close

Treat NAPsack, AgentNetTool, and Scribe AutoCapture as counterexamples, not footnotes. Explain what they already solve. NAPsack creates screenshot-and-action examples. AgentNetTool creates and reviews leakage-safe task demonstrations. Scribe discovers workflows in the background and already has a review queue. The residual difference is the specific output Dylan needs: verified exact navigation destinations from passive dual-monitor, cross-app work, with reusable row export.

### 5. I tried to close every gap at once

Describe the NAPsack patch, custom capture layer, smoke test, browser extension, and 30-action diagnostic. State what the engineering proved and what it did not.

> It proved that higher-fidelity recording was technically obtainable. It did not prove that the place I would navigate next was predictable.

Then state the scope correction. The minimal protocol now being attempted uses Screenpipe and human labeling. Safe prior-state ordering and correct labels remain non-negotiable. The audit-grade stack was not a prerequisite for this first qualitative test.

### 6. The missing product is a review queue

Specify the five product jobs:

1. run during ordinary work;
2. propose meaningful transition boundaries;
3. select the last safe pre-action state;
4. propose the exact destination with supporting evidence; and
5. let the user accept, correct, reject, or mark the row unresolved.

### 7. The experiment now comes before the infrastructure

Explain the sequence:

1. run the manual pilot;
2. decide whether the predictions are useful;
3. automate the creation and review of the rows only if the answer is yes.

Close the section and the article plainly:

> If you have built something that already produces these examples, or you are working on it, I want to see it.

Include `dylanduyvu@gmail.com`.

## Evidence map

### Dylan's public project record

- [Computer-use NAP shadow experiment](https://dylanduyvu.github.io/20-syntheses/computer-use-nap-shadow-experiment)
- [Screenpipe live-capture audit](https://dylanduyvu.github.io/50-sources/screenpipe-live-capture-audit-2026-07-23)
- [NAP dataset fidelity research](https://dylanduyvu.github.io/30-projects/computer-use-nap-fidelity-research-2026-07-26)
- [Computer-use NAP build log](https://dylanduyvu.github.io/30-projects/computer-use-nap-build-log)
- [Capture-tool survey](https://dylanduyvu.github.io/30-projects/computer-use-capture-tool-research-2026-07-24)

### Primary tool sources

- [Screenpipe repository](https://github.com/screenpipe/screenpipe)
- [Screenpipe architecture](https://docs.screenpipe.com/architecture)
- [NAPsack repository](https://github.com/GeneralUserModels/napsack)
- [NAPsack package and output description](https://pypi.org/project/napsack/)
- [Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923)
- [OpenCUA repository](https://github.com/xlang-ai/OpenCUA)
- [AgentNetTool repository](https://github.com/xlang-ai/AgentNetTool)
- [AgentNetTool annotation process](https://agentnet-tool.xlang.ai/requirements/annotation/annotation/)
- [AgentNetTool macOS setup](https://agentnet-tool.xlang.ai/quickstart/mac_quick_start/)
- [OpenCUA paper](https://arxiv.org/abs/2508.09123)
- [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture)
- [rrweb repository](https://github.com/rrweb-io/rrweb)
- [Scribe AutoCapture](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-discover-workflows)

## Claims to avoid

- `The tool does not exist.`
- `No existing tool creates state-action examples.`
- `Screenpipe records only screenshots or OCR.`
- `Screenpipe cannot identify clicks.`
- `NAPsack failed.`
- `AgentNetTool does not create usable computer-use data.`
- `The custom stack solved acquisition.`
- `The 30-action walkthrough was an accuracy test.`
- `The capture work shows next actions are predictable.`
- `Perfect dual-monitor synchronization is required for the first pilot.`
- `Only two fidelity properties matter universally.`
- `A personal model will need only hundreds of examples.`
- `Niyant endorsed the implementation.`
- Any privacy-led product positioning.

## Open fact checks before first draft

1. Recheck NAPsack's current release before describing limitations. Separate current official capabilities from version 0.1.3 behavior on Dylan's setup.
2. Confirm whether AgentNetTool can record multiple displays on macOS. Its current setup guide documents the main display, but the article should not infer more than the documentation says.
3. Recheck Scribe AutoCapture availability and supported-domain language at draft time because it is a private beta.
4. Decide whether `76 of 164` and `zero of 40` are enough for the main text. Keep the rest of the metrics in an appendix or linked audit.
5. Verify the public URLs after Quartz updates. Link primary tool sources in the final post.
6. Do not state that Screenpipe plus manual review has passed until the manual pilot actually produces valid examples.

## Candidate titles

1. **Day 0 Took Three Days**
2. **Screen Recordings Are Not Next-Destination Examples**
3. **I Wanted to Predict Where I Would Go Next. First I Had to Define the Data**
4. **The Missing Layer Between Screen Recording and Personal AI**

`Day 0 Took Three Days` is strongest because it is concrete, honest about the investigation, and does not rely on an unsupported universal negative.

## Candidate final compression

> I started by asking whether a model could predict where I would go next. Three days later, I had learned something narrower. Recording screens and inputs is easy. Turning that recording into correctly ordered, verified examples is still work. I should test whether the prediction matters before automating that work. But if it does matter, the product I want is now specific.

## Drafting constraints

- No em dashes.
- Use the simple-declarative American Compute register.
- Keep one idea per sentence and one job per paragraph.
- Say `the exact place I went next`, then give an example such as a specific Codex task and input field.
- Start with what each tool does well.
- Use the first-person investigation as the evidence spine.
- Separate direct observation, inference, and speculation in the prose.
- Do not foreground privacy.
- Do not let the tool survey become a catalog. Every tool belongs only where it sharpens the residual gap.
- Keep the Niyant section short.
- Use at most two main numbers in the body. Link the detailed audits for readers who want the full record.
- The article should end with the manual experiment ahead, not pretend the prediction result already exists.

## Draft gate

The first draft can begin only if it preserves all four boundaries:

1. The universal `missing tool` claim has been narrowed to Dylan's reviewed public tools and workflow.
2. The article openly concedes that the first capture protocol was over-scoped.
3. The manual pilot and the automatic acquisition product are treated as separate problems.
4. Nothing in the acquisition work is presented as evidence that prediction will work.

## Related notes

- Article concept: [[the-missing-computer-use-tool-turns-normal-work-into-next-action-examples]]
- Experiment: [[computer-use-nap-shadow-experiment]]
- Capture audit: [[screenpipe-live-capture-audit-2026-07-23]]
- Tool surveys: [[computer-use-capture-tool-research-2026-07-23]], [[computer-use-capture-tool-research-2026-07-24]]
- Build record: [[computer-use-nap-build-log]]
- Fidelity scope: [[computer-use-nap-fidelity-research-2026-07-26]]
- Product origin: [[tab-could-autocomplete-the-next-computer-action]]