---
type: writing-prep
status: ready-for-draft
created: 2026-07-26
updated: 2026-07-27
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

**Desired reader conclusion:** Most computer-use capture and workflow-discovery primitives already exist. Open tools did not produce Dylan's exact rows, and public materials for the stronger enterprise task-mining systems do not establish the complete contract either. Those systems are also built for organization-wide process-discovery programs, not self-serve personal experiments. An unvalidated offline prototype can reuse existing recording and ordering components while Dylan verifies the rows manually. A dependable automatic version may be a specialized adapter on top of an existing recorder or task-mining platform, but the strict prior-state, exact-destination, and row-verification contract still has to be implemented and validated.

**Primary use case:** Predicting the exact place Dylan will navigate next. This is one narrow kind of next-action prediction. The article's dataset rows are `next-destination examples`, not general examples of everything Dylan might type, click, or do. Broader personal AI context is origin and motivation, not the article's main claim.

**Author position:** Dylan is not an ML researcher or a computer-use data engineer. He used AI coding agents to inspect the tools, build glue, and validate the capture stack. The point is not that the agents failed. The point is that even with agents doing much of the technical work, producing this basic personal dataset imposed an unreasonable integration and review burden.

**Evidence posture:** First-person investigation. The article can say what happened on Dylan's Mac, what the reviewed public tools document, and what Dylan infers. It cannot prove that no internal, proprietary, or unreviewed tool solves the problem.

**Selected title:** `The Missing Step Between Recording and Prediction`

**Selected deck:**

> I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days trying to automatically assemble the dataset it needed.

## The live crux

The article answers four questions:

1. What exact output did Dylan need?
2. Which requirements remained unverified after reviewing the closest open and enterprise tools?
3. What can be assembled from components that already exist?
4. What still needs to work for Dylan's exact use case?

`Day 0 took three days` is the opening story and evidence. It is not the thesis.

## Working thesis

Recommended full wording:

> I needed a personal dataset that paired what was on my screens before each move with the exact place I went next. Then I needed to verify every row. The tools I tested could record my screens, clicks, app switches, and browser activity. But no product I could use turned a normal workday into that dataset.

Short compression:

> The tools recorded the activity. No product I could use assembled the personal dataset.

Buildability conclusion:

> I do not need to invent another recorder for the first experiment. I can test a bounded offline extractor that turns Screenpipe evidence into draft rows, then verify those rows manually in a table. Enterprise task-mining systems show that much of the machinery already exists, but they are not a usable path for this personal pilot. Mimica canceled the one-person evaluation, and Celonis runs only on Windows. A dependable version for Dylan's setup would still require a custom layer, but that does not establish a net-new product category.

Do not write `the tool does not exist`. Write `I could not find one that did the whole job for my workflow`.

## Causal chain

1. This navigation-prediction test needs a personal dataset pairing the state available before a move with the destination reached next.
2. Screenpipe, NAPsack, OpenCUA, Scribe, and enterprise task-mining systems already solve many of the underlying capture, ordering, segmentation, export, and review problems.
3. The public materials reviewed do not show one tool producing the complete output Dylan needed: what was visible before each move, the exact place he went next, proof that the answer is correct, a quick way for Dylan to approve or fix it, and the accepted rows saved in time order.
4. An unvalidated, bounded offline prototype can reuse Screenpipe, extract candidate rows, and leave verification to Dylan.
5. A dependable automatic version still needs those guarantees integrated and validated. That may require a custom product layer, or it may be possible as an adapter over a task-mining platform with sufficient data access.
6. Dylan initially treated that product-grade automatic pipeline as a prerequisite for a qualitative experiment. Building toward it consumed three days before he tested a model.
7. That delay revealed both the integration burden in Dylan's workflow and the sequencing mistake.
8. The manual pilot should establish whether the prediction is useful before Dylan automates the production of the rows.

Every section in the draft must prove one link in this chain.

## Opening and central scene

The article opens with a short abstract that defines the prediction test and explains why it did not begin:

> I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days trying to automatically assemble the dataset it needed.

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
- A custom Hammerspoon, ScreenCaptureKit, and browser stack was built and passed a six-action controlled check.
- A supposedly simple 30-action diagnostic walkthrough consumed most of a day and stopped at 12 accepted checkpoints.
- Five of those 12 freezes had more than one second of cross-display skew. The maximum was 3.765 seconds.
- The walkthrough had protocol drift and was a diagnostic, not a formal calibration.

The scene proves cost and motivates the scope correction. It does not by itself prove a market-wide product gap.

## The exact data unit

One usable row is:

> what was available strictly before I navigated → the exact place I went next → evidence → Dylan's verified verdict

Example:

> Dylan reaches the end of an article in Arc → `Codex → Personal AI task → composer`

The destination may be an app, window, webpage, document, Codex task, input field, link, or button.

In plain English, each row needs five things:

1. a screenshot or record of what Dylan could see before he moved;
2. the exact place he went next;
3. later evidence showing that he really went there;
4. Dylan's approval or correction of the answer; and
5. the approved rows saved in the order they happened.

The word `before` matters. If the model sees a screenshot taken after Dylan clicks or switches apps, the screenshot may reveal the answer it is supposed to predict.

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

## The complete tool contract

The eventual tool should:

1. run passively during ordinary work across native apps and browsers;
2. preserve the state that was available strictly before navigation;
3. retain correctly attributed evidence from both monitors when the move crosses displays;
4. represent the exact destination in one normalized field, whether it is an app, window, page, document, task, input field, link, or button;
5. propose meaningful transition boundaries rather than treating every raw input as a separate example;
6. show enough evidence for a person to accept, correct, reject, or mark the row unresolved; and
7. export accepted rows chronologically in a model-ready format.

The original comparison against NAPsack, OpenCUA, and Scribe was too narrow. Enterprise task-mining products already document ambient capture, task discovery, structured event data, review, and export. Celonis even documents an `all desktops` screenshot mode for multiple screens. Mimica now documents a native macOS recorder with step-level data and screenshots. But neither product was usable for Dylan's experiment. Mimica rejected his personal signup and later canceled the one-person demo because it focuses on larger enterprises. Celonis runs only on Windows.

After adding those systems, the clearest residual requirements are:

1. a documented guarantee that the observation attached to each row is strictly before the navigation action, including correctly attributed multi-monitor evidence when relevant;
2. one normalized, machine-readable exact-destination field spanning native apps and browsers; and
3. a row-level workflow for Dylan to accept, correct, reject, or mark that proposed destination unresolved before chronological dataset export.

The complete target workflow remains:

> record ordinary work → find each meaningful move → save what Dylan saw before it → identify where he went → let Dylan approve or fix the answer → save the examples in time order

The defensible claim is not that task-mining systems lack a conversion layer. They plainly have one. The claim is that the reviewed public materials do not show one tool completing all six steps above for Dylan's prediction experiment. Mimica's detailed data format and review behavior are not public enough to resolve the technical question, and its enterprise onboarding did not provide a self-serve or one-person evaluation path. Celonis documents rich event tables, multi-screen capture, and task grouping, but it is Windows-only and does not document a guarantee that the saved screen is from before the move or a way for Dylan to approve the exact destination for every example. These may be undocumented enterprise capabilities, but neither product is a current option for Dylan's setup.

## What can be cobbled together for the experiment

The first experiment does not require a new recorder or a custom review application. Screenpipe can remain the evidence backbone. An offline extractor can:

1. find candidate navigation moments from app, window, URL, focus, and meaningful-click changes;
2. select the latest usable state from before each move;
3. use later evidence to draft the destination label; and
4. export the draft rows chronologically to CSV or another simple table.

This prototype is still unvalidated. It requires new code for the row schema, candidate-boundary logic, safe frame selection, destination drafting, and export. Dylan remains responsible for correcting each row. It deliberately skips live suggestions, a dedicated review interface, reliable automatic segmentation, perfect dual-monitor synchronization, and stable automatic identity for every interface target.

Its purpose is narrower: determine whether existing evidence can reduce the work of assembling examples without becoming another capture-infrastructure project. If it cannot quickly produce a small set of reviewable rows, Dylan should label the first examples manually.

`Low friction` means install, record, and review. It does not mean query a SQLite database, join several clocks, run a marker ritual, or debug monitor geometry.

## What a dependable version still needs

A dependable automatic system still needs:

1. reliable ambient transition detection;
2. target grounding across Accessibility data, browser structure, and visual evidence;
3. robust multi-monitor and cross-stream time joins;
4. explicit handling of missing, stale, or contradictory evidence;
5. a fast correction workflow; and
6. stable dataset export.

Open tools provide most of the primitives but still require custom assembly. Enterprise task-mining systems already provide more of the conversion layer than the initial survey recognized. The remaining work may be a specialized adapter, schema, and review flow rather than a new system from scratch. Public documentation is not enough to support a market-wide novelty claim. But Mimica and Celonis are both nonstarters for Dylan's current setup, so the dependable path for this experiment still requires custom work. No pending vendor demo or trial blocks the article or the manual pilot.

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
| Capture Layer v2 passed a six-action real-data check and the checker caught 54 of 54 synthetic failure mutations. | [[computer-use-nap-build-log]] | Validates controlled plumbing, not natural-work segmentation or prediction. |
| The 30-action diagnostic stopped at 12 accepted checkpoints. Five freezes exceeded one second of cross-display skew, with a 3.765-second maximum. | [[computer-use-nap-build-log]] | Progress and engineering evidence, not accuracy. |
| Niyant first called the idea too vague, later said it aligned overall, and warned that Dylan's small app distribution could make suggestions trivial. | [[tab-could-autocomplete-the-next-computer-action]] | Preserve both the alignment and the unresolved low-entropy concern. |

### Supported synthesis

| Claim | Support | Confidence and boundary |
|---|---|---|
| Existing tools solve real subsets of the capture problem. | Screenpipe, NAPsack, OpenCUA, OpenAdapt, and rrweb primary materials plus local tests | High. This should be stated before any gap claim. |
| Screenpipe was a useful context backbone but did not automatically produce Dylan's exact next-destination rows. | Local Screenpipe audit | High for this setup and version. |
| A post-action frame can invalidate retrospective next-destination evaluation. | Local timestamps plus OpenCUA's documented last-distinct-prior-frame matching | High. |
| The custom stack shows the required evidence streams can be joined. | Controlled check and mutation suite | High for controlled actions. It does not show passive segmentation at useful scale. |
| Bad acquisition can make recorder failure look like model failure. | Frame-ordering and label-coverage findings | Strong evaluation logic. |
| Enterprise task-mining systems already combine ambient desktop capture with task or process discovery, structured data, and analysis or review. | Mimica, Celonis, Skan, and UiPath primary materials | High as a capability-category correction. Product marketing is not proof of Dylan's exact row semantics. |
| The reviewed public materials do not establish one workflow that combines strict pre-navigation state, exact cross-app destinations, Dylan's verdict on each label, and chronological training-row export. | Bounded tool survey and local tests | Defensible only as a public-documentation finding. Direct vendor evidence could overturn it, but neither Mimica nor Celonis was a usable evaluation path for this setup. |

### Inference

| Inference | Safe treatment |
|---|---|
| There may be a product or adapter opportunity in the exact prediction-example layer. | Dylan's conclusion from the investigation, not established novelty or market demand. Existing task-mining platforms are strong counterevidence to a broad product-gap claim. |
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

- 11 of 11 controlled clicks mapped to the correct display after the NAPsack patch
- recorder timestamps agreed within roughly 13 ms in that controlled sample
- six real controlled actions passed
- 54 of 54 synthetic failure mutations were caught
- walkthrough stopped at 12 of 30 accepted checkpoints
- five of 12 freezes exceeded one second of display skew
- maximum skew was 3.765 seconds

## Study selection and metric discipline

The final article should use [[computer-use-nap-fidelity-research-2026-07-26|the fidelity research note]] selectively. It should not become a literature review.

Every study gets one sentence and one argumentative job. If removing the study does not weaken a specific claim, leave it in the linked research note.

Recommended study jobs:

1. OpenCUA's last-distinct-pre-action alignment supports the no-future-information requirement.
2. `A Click Ahead` shows that a conventional recurrent neural network could predict one person's next action from a fixed list of 442 actions. It did not use an LLM. It does not forecast the accuracy of Dylan's LLM-based system, which may need to name finer-grained destinations outside a fixed list.
3. AndroidControl's favorable in-domain versus out-of-domain scaling motivates a personal experiment. It predicts instructed UI-control steps on Android, uses a relaxed step-accuracy metric, and does not prove that spontaneous next-destination prediction will work.
4. OSWorld, WindowsAgentArena, and AndroidWorld each evaluate one desktop or emulator screen. Treat that as an absence of multi-monitor benchmark evidence, not evidence that synchronization never matters. `A Click Ahead` itself recorded a dual-monitor setup, so multi-monitor next-action collection is not unprecedented.
5. Published pipelines tolerate approximate element semantics and messy trajectories, but the exact label being predicted still needs human verification.

Exclude detailed OSWorld modality percentages, general annotation-error statistics, synthetic-grounding scaling curves, robotics analogies, and Microsoft Recall unless the draft develops a specific argumentative need for one.

Allow roughly four memorable quantitative anchors in the article:

1. the three-day delay;
2. 12 of 30 diagnostic checkpoints;
3. the local ordering result that 76 of 164 linked click frames came after the click; and
4. one directly relevant prior next-action result. The primary [A Click Ahead paper](https://arxiv.org/abs/2309.12170) reports 34.63% exact top-one accuracy for a conventional GRU recurrent neural network choosing among 442 distinct user actions after training on roughly one week of one person's Windows activity.

The `A Click Ahead` result is precedent, not a forecast. The study recorded 46.21 hours and 86,284 actions from one person's dual-monitor Windows setup, discarded interactive areas clicked no more than five times, and reduced the prediction space to 442 actions. Its 34.63% figure is exact top-one validation accuracy on an unseen sequence of 6,000 actions. The model was a GRU, not an LLM. It only had to choose from a fixed list of known actions. Dylan's LLM-based system may need to understand screenshots and name more specific destinations that are not confined to that list.

## Tool comparison

This table maps reusable primitives, existing conversion products, and the narrower row-contract questions that remain unresolved. It is not a scoreboard.

| Tool | Reusable contribution | What remained outside the documented end-to-end contract | Role in a bounded prototype |
|---|---|---|---|
| [Screenpipe](https://github.com/screenpipe/screenpipe) | Continuous local capture, accessibility data, OCR, clicks, scrolls, app and window changes, URLs, search, local APIs, and programmable pipes | The tested version exposed raw ingredients, but its action-linked frame was not guaranteed to be prior, semantic targets were incomplete in important cases, and it did not create a correction queue of verified transitions. Current public materials are inconsistent about `all monitors` versus an event-time screenshot of the `active monitor`, so multi-monitor behavior should be scoped to Dylan's local audit. | Recording and evidence backbone |
| [NAPsack](https://github.com/GeneralUserModels/napsack) | Passive natural-work recording, event-burst grouping, before-and-after evidence on the active display, generated action captions, and JSONL | Its public output does not document a correction inbox, synchronized both-monitor state, or one stable destination object spanning native and browser targets. The tested version also needed a local monitor-geometry patch. | Candidate-boundary heuristics and captioning patterns |
| [OpenCUA / AgentNetTool](https://github.com/xlang-ai/OpenCUA) | Deliberate task demonstrations, video, inputs, accessibility trees, review, action reduction, last-distinct-prior-frame matching, and standardized trajectories | It is a curated task workflow with declared start and stop. Its macOS instructions document main-display capture. It does not publicly document ambient dual-monitor work becoming proposed exact cross-app destinations. | Safe prior-frame alignment and review patterns |
| [Scribe AutoCapture](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) | Background workflow discovery across approved apps plus the ability to review, edit, publish, or discard the result | Its documented product output is a guide. It does not document strictly prior next-destination rows, synchronized dual-monitor evidence, a normalized cross-app destination object, or reusable raw dataset export. | Review-inbox interaction pattern |
| [Mimica](https://www.mimica.ai/product) | Passive clicks, keystrokes, and application interactions across desktop apps; automatic task and process discovery; step-level screenshots; process maps; CSV, PDD, and BPMN exports; native macOS and Windows recording | This is the strongest current enterprise counterexample. It is designed for organization-wide process-discovery programs and uses sales-led, administrator-enabled onboarding. Dylan's personal signup was rejected, and Mimica canceled his one-person demo. Public materials do not expose enough schema or timing detail to verify strict pre-action state, multi-monitor behavior, one exact destination object, or row-level label correction. | Evidence that the conversion machinery exists; not usable for the current experiment |
| [Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) | Background desktop and browser event capture, optional screenshots, raw and labeled event tables, UI Automation and web attributes, `all desktops` screenshots, manual task definitions, and private-preview AI task grouping | It is Windows-only. Public docs expose rich event data but do not document strict pre-action screenshot semantics or a review flow centered on accepting or correcting an exact next-destination label. | Strong evidence that much of the conversion layer already exists |
| [UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) | Known-task recording, screenshot clustering, trace merging, action annotation, review, and raw CSV export with app, URL, button, selector, timestamp, and coordinates | The current product requires a known task and deliberate traces. Its earlier Unassisted Task Mining did ambient unknown-task discovery and multi-monitor capture but was removed from Automation Cloud in December 2025. Neither public workflow documents Dylan's strict prediction row. | Review, trace, and export reference; historical counterexample to novelty |
| [Skan AI](https://www.skan.ai/process-discovery-and-analysis) | Automatic discovery across applications and handoffs, process maps, screenshots, and a separate recorded-task review flow with editable event names | Public product pages do not expose the event schema, timing contract, multi-monitor semantics, or reusable prediction-row export. ProcessDoc is Windows-only and task-declared. | Additional evidence that automatic workflow discovery is an established product category |
| [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture) | Time-aligned event streams and media for recorded GUI workflows | Useful capture primitives do not by themselves create verified ambient next-destination rows. | Additional capture implementation reference |
| [rrweb](https://github.com/rrweb-io/rrweb) | DOM serialization, mutations, interactions, and web-session replay | It does not cover native apps, browser chrome, or cross-app transitions. | Optional browser evidence |
| Custom Hammerspoon + ScreenCaptureKit + Arc extension | Physical events, native Accessibility evidence, both-display images, browser events, timestamps, and controlled validation | It required custom engineering, multiple permissions, manual markers, frozen frames, validation rituals, and repeated repairs. | Evidence that the streams can be joined, not the recommended first-pilot stack |

Do not write that NAPsack or AgentNetTool failed to create state-action data. They do create forms of it. Do not write that Scribe lacks workflow discovery or review. Do not write that the market lacks ambient task discovery, structured event export, or cross-app workflow mapping. The claim is narrower: the public materials reviewed do not establish Dylan's complete row contract. Mimica and Celonis remain evidence against a broad novelty claim, but neither was usable for Dylan's current setup. Do not turn a hypothetical future vendor evaluation into a publication blocker.

## The strongest counterargument

> You did not discover a missing product category. You missed task mining, then overbuilt a benchmark. Mimica claims passive cross-app capture, automatic process discovery, step-level screenshots, CSV export, and native macOS support. Celonis documents granular events, UI and browser attributes, all-desktop screenshots, labeled tables, and task grouping. Screenpipe already recorded enough activity for a manual test. Stopping at 12 of 30 proves that the protocol was over-scoped, not that a product is missing.

The article should concede most of this.

Recommended response:

> I was wrong if I meant that nobody can capture ordinary work, discover workflows, or export structured traces. That is an established task-mining category. NAPsack turns interaction bursts into screenshot-and-action examples. OpenCUA pairs human demonstrations with the screen from before each action. Scribe discovers workflows in the background. Mimica and Celonis go further toward automatic process discovery and structured output. But neither was usable for my experiment. Mimica rejected my personal signup and canceled the one-person demo because it focuses on larger enterprises. Celonis runs only on Windows. Their public material also does not show one tool saving what I saw before each move, naming the exact destination, and letting me approve or fix every answer. That may still be an adapter problem or an undocumented enterprise capability rather than a new category. I also treated an automatic, product-grade dataset as a prerequisite for a small qualitative experiment. That was a sequencing mistake. Screenpipe recorded enough activity for me to attempt the prediction test with manual labeling.

This section is load-bearing. Without it, the post mistakes self-imposed protocol complexity and an incomplete market search for external evidence.

Planned placement: its own section immediately after the tool comparison and before the cobbled-together pilot, so the pilot reads as the direct answer to the objection. Section 1 gestures at the concession and the closing section recalls it briefly, but the full block lives here, not split across the frame.

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

Use the four-day plan and the fact that prediction never started as the hook. Describe the NAPsack patch, custom capture layer, controlled check, browser extension, and stopped 30-action diagnostic. State immediately that the delay mixed a real conversion-layer gap with Dylan's decision to overbuild the first experiment.

> The controlled run showed that the evidence streams could be joined. But it did not automatically produce enough dataset rows from ordinary work, so the prediction test never began.

### 2. What one dataset row needed

Define one row in normal English:

> what was available strictly before I navigated → the exact place I went next → evidence → Dylan's verified verdict

Give a concrete row: Dylan reaches the end of an article in Arc, then goes to `Codex → Personal AI task → composer`. Explain that the saved input must show what he saw before moving, the answer must name the exact destination rather than merely `Codex`, later evidence confirms the move, and Dylan approves or corrects the answer.

State the two validity requirements as a named pair, using the data-unit section's wording: the observation must be strictly prior, and the recorded destination must be correct. This pair is the article's most quotable constraint and should appear once, here.

### 3. The recorder is only one part of the tool

State the complete seven-part tool contract. Then explain why a continuous recording does not determine meaningful boundaries, safe prior state, exact destination, or a verified row by itself.

Use Screenpipe as the concrete example. Lead with what worked: screenshots, both monitors, inputs, app and window events, URLs, OCR, and accessibility data. Then use the one local finding chosen in the checks section: 76 of 164 linked click frames were after the click. Keep zero of 40 and the remaining metrics in the linked audit unless the draft develops a specific need for them.

Add one sentence pre-empting the current-version reply: name the tested version (2.5.132) and dates, note that Screenpipe's current documentation claims expanded capture (full accessibility tree with OCR fallback, keyboard input, app switches, multiple capture methods), and state that the measurements stand for the tested version and setup.

### 4. The closest tools already form a product category

Treat NAPsack, OpenCUA, and Scribe as reusable components in one compact paragraph. Then use Mimica and Celonis as the strongest enterprise counterexamples to broad missing-product claims while stating just as clearly that neither was usable for Dylan's experiment. Mimica canceled the one-person evaluation, and Celonis is Windows-only. Mention Skan, current UiPath, and historical UiPath Unassisted Task Mining together in one short paragraph or note rather than giving each a separate tour. Answer explicitly:

1. which primitive each already solves;
2. which part could be reused in Dylan's prototype; and
3. which parts of the complete contract remain unverified in public documentation.

Do not say that multi-monitor capture, workflow discovery, structured export, or conversion layers are absent from the market. Celonis documents all-desktop screenshots. Mimica documents passive cross-app discovery and CSV export on macOS. Treat those as category evidence, not immediately usable alternatives. Name the simpler residual questions: does the saved input show what Dylan saw before moving, does the output name the exact native-app or browser destination, can Dylan approve or fix each answer, and can the accepted examples be exported in time order?

### 5. The strongest counterargument, conceded

Run the full counterargument block from the section above: state the objection in its strongest form, concede the over-scoped protocol and the sequencing mistake, and narrow the residual gap to the target workflow plus the three residual requirements from the tool-contract section. Placing it here, before the pilot, makes the next section read as the answer to the objection rather than a retreat.

### 6. A first version can be cobbled together

Describe the unvalidated offline Screenpipe extractor: propose candidate boundaries, select safe prior evidence, draft the destination from later evidence, and export chronological rows to a simple table for Dylan to verify manually.

State what it deliberately skips: live suggestions, a custom review interface, reliable automatic segmentation, perfect synchronization, and stable identity for every interface target.

Make the fallback explicit: if even this bounded extractor becomes another infrastructure project, label the first examples manually.

### 7. What a dependable version still needs

Explain what still has to be guaranteed for Dylan's use case:

1. reliable ambient segmentation;
2. Accessibility, DOM, and visual target grounding;
3. multi-monitor and cross-stream joining;
4. missing-data handling;
5. fast correction; and
6. stable export.

Then state the bounded conclusion. Open tools require custom assembly. Enterprise task-mining systems show that much of the machinery already exists, so Dylan cannot claim a new category. But Mimica and Celonis were both unusable for this experiment, and their public documentation does not settle the strict row-contract questions. A dependable version for Dylan's current setup would still require a custom layer.

### 8. Why this matters and what happens next

Use the Niyant exchange to connect the narrow data problem to the larger personalization thesis. Keep the claim bounded: personal next-action prediction requires a personal interaction dataset, and producing verified rows remains an integration burden.

Recall the concession from section 5 briefly rather than re-arguing it: Dylan tried to build the dependable automatic product before establishing that the prediction felt useful.

Explain the corrected sequence:

1. run the manual pilot;
2. decide whether the predictions are useful;
3. try the bounded offline extractor only if it materially reduces labeling work; and
4. build the dependable automatic product only if the prediction earns it.

Close the section and the article plainly, pointing the invitation at the contract so it is answerable:

> If you have built something that already produces these examples, or you are working on it, I want to see it. The seven-part contract above is the test.

Include `dylanduyvu@gmail.com`.

## Citation discipline

The evidence map is a research index. It is not a substitute for inline citations. In the final draft, bind every concrete external claim to the exact primary source that supports it.

- **NAPsack:** cite the repository, package page, or paper next to claims about event bursts, before-and-after evidence on the active display, generated captions, and JSONL output.
- **OpenCUA / AgentNetTool:** cite the paper and annotation documentation next to claims about deliberate demonstrations, review, action reduction, and last-distinct-prior-frame matching. Cite the macOS quickstart next to the statement that the documented setup uses the main display.
- **Scribe:** cite the current official AutoCapture documentation next to background workflow discovery and the ability to `review, edit, publish, or discard`. Cite the official export documentation for documented guide outputs. Current documentation describes approved business apps, not only whitelisted web domains.
- **Screenpipe:** cite official documentation for general capabilities. Cite Dylan's public local audit for claims about tested version 2.5.132, measured sessions, frame ordering, and semantic-label coverage.
- **Mimica:** cite the official product page for passive cross-app capture, process maps, and CSV, PDD, and BPMN exports. Cite the July 22, 2026 macOS announcement for native Mac recording, step-level data, and screenshots. Cite the official proof-of-concept page for its sales-led onboarding. The rejected Gmail registration is Dylan's first-person observation and should be presented only as his attempt, not as proof that every personal email is rejected. Treat product capabilities as vendor claims. Do not infer multi-monitor support, strict pre-action timing, or row-level correction.
- **Celonis:** cite official Task Mining documentation for background capture, raw and labeled event tables, UI Automation context, and event processing. Cite the current event-processing documentation for the retained `all desktops` screenshot option. The older text-editor documentation explicitly described this as the option for multiple screens. Cite the private-preview AI Task Discovery page only when its release status and limitations are stated.
- **UiPath:** cite the current official introduction and raw-data export docs for known-task traces, review, action fields, and CSV. If historical Unassisted Task Mining is mentioned, link its archived analysis guide and the official deprecation notice.
- **Skan:** cite official product pages and label capability statements as vendor claims. Do not infer schema, timing, or multi-monitor behavior that the pages do not publish.

Important scientific claims drawn from the fidelity note must cite the original papers, not the Claude-generated synthesis as their ultimate authority. The fidelity note can still be linked for transparency. At minimum:

- cite the [OpenCUA paper](https://arxiv.org/abs/2508.09123) for last-distinct-pre-action alignment;
- cite [On the Effects of Data Scale on UI Control Agents](https://arxiv.org/abs/2406.03679) if the AndroidControl in-domain scaling claim appears;
- cite [A Click Ahead](https://arxiv.org/abs/2309.12170) for the 34.63% result, the 442-action space, and the GRU model; state explicitly that it was not an LLM system; and
- cite the original benchmark papers or documentation for any claim that their evaluated observation is single-screen.

Negative capability claims need the same discipline. Use bounded wording such as `none publicly documents` or `I found no documented...`, link the reviewed public material, and do not turn missing documentation into proof that a capability is impossible.

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
- [Scribe AutoCapture](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture)
- [Scribe Markdown export documentation](https://support.scribehow.com/hc/en-us/articles/9254133020189-Exporting-a-Scribe-to-Markdown)
- [Mimica product](https://www.mimica.ai/product)
- [Mimica macOS recorder announcement](https://www.mimica.ai/articles/introducing-mimica-task-mining-for-macos)
- [Mimica task-mining description](https://www.mimica.ai/articles/what-is-task-mining)
- [Celonis Task Mining](https://docs.celonis.com/en/task-mining.html)
- [Celonis Task Mining data flow](https://docs.celonis.com/en/working-with-task-mining-data.html)
- [Celonis Task Mining data reference](https://docs.celonis.com/en/task-mining-data-reference.html)
- [Celonis UI Automation capture](https://docs.celonis.com/en/capturing-ui-automation-data.html)
- [Celonis current event processing and screenshot modes](https://docs.celonis.com/en/event-processing-rules.html)
- [Celonis older text-editor rule reference](https://docs.celonis.com/en/event-processing-rules---text-editor.html)
- [Celonis AI Task Discovery private preview](https://docs.celonis.com/en/grouping-task-mining-events-into-tasks--task-discovery-.html)
- [UiPath current Task Mining introduction](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as)
- [UiPath raw CSV export](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/raw-data-export)
- [UiPath historical Unassisted Task Mining analysis guide](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/unassisted-task-mining-analysis-guide)
- [UiPath historical Unassisted Task Mining FAQ](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/faq)
- [UiPath Unassisted Task Mining deprecation notice](https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/november-2024)
- [Skan automatic process discovery](https://www.skan.ai/process-discovery-and-analysis)
- [Skan ProcessDoc](https://www.skan.ai/free-trial/skan-processdoc)
- [A Click Ahead](https://arxiv.org/abs/2309.12170)
- [On the Effects of Data Scale on UI Control Agents](https://arxiv.org/abs/2406.03679)
- [Android in the Wild](https://arxiv.org/abs/2307.10088)
- [OSWorld](https://arxiv.org/abs/2404.07972)
- [WindowsAgentArena](https://arxiv.org/abs/2409.08264)
- [AndroidWorld](https://arxiv.org/abs/2405.14573)

## Claims to avoid

- `The tool does not exist.`
- `No existing tool creates state-action examples.`
- `No product captures ordinary work and discovers workflows automatically.`
- `No existing product records multiple monitors.`
- `The conversion layer is wholly net new.`
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

## Checks before publication or stronger product claims

1. Resolved 2026-07-26: NAPsack's current PyPI release is 0.1.3, uploaded 2026-04-04, with releases 0.1.0 through 0.1.3 and a Python requirement of >=3.11,<=3.13. Dylan tested the current release, so limitations can be stated against the current release at the time of writing rather than an old version. Repo HEAD was not audited. Re-verify the version once at draft time.
2. Resolved 2026-07-26: AgentNetTool's macOS documentation records the screen through OBS with a single Display Capture source and instructs the annotator to set it to the main display. Webpage HTML comes from a separate browser extension. The bounded claim is that the documented macOS recording path is one display via OBS. Do not claim multi-display recording is impossible. OBS could be configured differently, but that configuration is not documented.
3. Resolved 2026-07-26: Scribe's official Autocapture page was updated July 15, 2026. It is in beta for Pro Team and Enterprise customers and runs across a curated or admin-controlled approved-app list. It documents review, edit, publish, or discard. Older cached text used domain-whitelist language. Cite the current page and date rather than repeating the stale wording. Its documented exports are finished guide formats, not raw prediction rows.
4. Resolved for this experiment 2026-07-27: Dylan scheduled a `Mimica Intro & Demo`, but Mimica canceled after deciding that a one-person request did not fit its focus on larger enterprise organizations. Dylan's earlier attempt to use the [public registration page](https://app.mimica.ai/register) with his Gmail address also returned `This email is not enabled, please contact your admin.` The cancellation is preserved in [[mimica-demo-canceled-enterprise-focus-2026-07-27.png]]. Mimica remains evidence that enterprise conversion machinery exists, but it was not a usable evaluation path for Dylan's setup. Its technical answers therefore remain unknown:
   1. Does the macOS recorder capture every attached monitor, and how are screenshots timed relative to the triggering action?
   2. Can it identify exact native-app and browser destinations such as a window, tab, document, input field, link, or button?
   3. What fields appear in the raw CSV, and can the original event-level data be exported in chronological order?
   4. Can a reviewer correct the destination or step label for an individual event?
   5. Can a one-person proof of concept run on ordinary cross-app work rather than a declared enterprise process?
   6. What minimum seats, administrative setup, data-access restrictions, and pricing apply after the proof of concept?
   These unanswered questions do not block the article or the manual pilot.
5. Resolved for this experiment 2026-07-27: Celonis is Windows-only, so it is not usable on Dylan's Mac. It remains evidence that multi-screen screenshots, structured event tables, and task grouping exist in the enterprise category. A future market-wide novelty claim would still need to distinguish those capabilities from Dylan's strict row contract, but Celonis is not an immediate product option or a publication blocker.
6. Resolved 2026-07-26: use `76 of 164` as the one local Screenpipe metric in the body because it directly explains the before-versus-after problem. Keep `zero of 40` and the remaining metrics in the linked audit unless the draft develops a specific need for them.
7. Verify the public URLs after Quartz updates. Link primary tool sources in the final post.
8. Do not state that Screenpipe plus manual review has passed until the manual pilot actually produces valid examples.
9. Added 2026-07-26: Recheck Screenpipe's current release and documentation at draft time. Current documentation and marketing claim expanded capture, including a full accessibility tree with OCR fallback, keyboard input, app switches, and multiple capture methods. The tested version was 2.5.132 in July 2026. Keep every measured claim scoped to it and include the section 3 pre-empt sentence.

## Title decision

Selected: **The Missing Step Between Recording and Prediction**

`Day 0 took three days` remains the opening hook, not the title or thesis. The deck and first paragraphs must establish that the article is answering the tool-gap and buildability questions, not merely recounting a difficult setup.

## Candidate final compression

> I started by asking whether an LLM could predict where I would go next. Three days later, I could finally specify the example I needed. Open recorders captured the ingredients, and enterprise task-mining systems already automate much of workflow discovery. But the strongest enterprise examples were not usable for my setup, and I still could not verify a public path that saved what I saw before each move, named the exact place I went, and let me approve or fix the answer. A bounded offline extractor might be enough for the first experiment. I should prove the prediction matters before deciding whether the dependable version deserves custom work.

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
- When the NAPsack paper appears, add one sentence distinguishing this article's next-destination rows from the paper's next-action-prediction task, which operates at the granularity of natural-language task descriptions annotated by a VLM. Do not imply that the paper's problem is unsolved or identical to this one.
- Use roughly four memorable quantitative anchors in the body. Do not turn the article into a metric parade. Link the detailed audits for readers who want the full record.
- The article should end with the manual experiment ahead, not pretend the prediction result already exists.

## Draft gate

The first draft can begin only if it preserves all seven boundaries:

1. The opening abstract and section 1 frame all four crux questions. What output Dylan needed, what remains unverified in the closest tools, what can be cobbled together, and what may still require custom work are each answered by the end of section 7.
2. The universal `missing tool` claim has been narrowed to a public-documentation finding about Dylan's exact row contract.
3. Existing tools are treated as reusable components and counterexamples, not dismissed as failures.
4. The article openly concedes that the first capture protocol was over-scoped.
5. The manual pilot, bounded offline extractor, and dependable automatic product are treated as three different levels of work.
6. Nothing in the acquisition work is presented as evidence that prediction will work.
7. The article acknowledges Mimica, Celonis, Skan, current UiPath, and historical UiPath Unassisted Task Mining before making any novelty or product-gap claim.

## Related notes

- Article concept: [[the-missing-computer-use-tool-turns-normal-work-into-next-action-examples]]
- Experiment: [[computer-use-nap-shadow-experiment]]
- Capture audit: [[screenpipe-live-capture-audit-2026-07-23]]
- Tool surveys: [[computer-use-capture-tool-research-2026-07-23]], [[computer-use-capture-tool-research-2026-07-24]]
- Build record: [[computer-use-nap-build-log]]
- Fidelity scope: [[computer-use-nap-fidelity-research-2026-07-26]]
- Web evidence audit: [[day-0-computer-use-tool-gap-web-audit-2026-07-26]]
- Product origin: [[tab-could-autocomplete-the-next-computer-action]]
