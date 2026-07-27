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

**Desired reader conclusion:** Most computer-use capture and workflow-discovery primitives already exist. Open tools did not automatically produce Dylan's chronological prior-state and exact-destination records, and public materials for the stronger enterprise task-mining systems do not establish the complete contract either. Dylan's original plan was to validate an automatic acquisition system through a component walkthrough, blind calibration, and natural-work audit, then feed later output directly into prediction. Human inspection graded the recorder during calibration; it was not the intended everyday labeling workflow. Manual labeling and review became the post-failure fallback. A dependable version may be a specialized adapter on top of an existing recorder or task-mining platform, but the automatic assembly contract still has to be implemented and validated. Screenpipe's raw events may support retrospective frame relinking, but Dylan did not validate that path.

**Primary use case:** Predicting the exact place Dylan will navigate next. This is one narrow kind of next-action prediction. The article's dataset rows are `next-destination examples`, not general examples of everything Dylan might type, click, or do. Broader personal AI context is origin and motivation, not the article's main claim.

**Author position:** Dylan is not an ML researcher or a computer-use data engineer. He used AI coding agents to inspect the tools, build glue, and validate the capture stack. The point is not that the agents failed. The point is that even with agents doing much of the technical work, building and validating an automatic personal-data pipeline imposed an unreasonable integration burden. Dylan also made a sequencing mistake by treating a calibrated automatic pipeline as a prerequisite for a small qualitative test.

**Evidence posture:** First-person investigation. The article can say what happened on Dylan's Mac, what the reviewed public tools document, and what Dylan infers. It cannot prove that no internal, proprietary, or unreviewed tool solves the problem.

**Selected title:** `The Missing Step Between Recording and Prediction`

**Selected deck:**

> I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days failing to assemble the dataset it needed.

## The live crux

The article answers four questions:

1. What exact output did Dylan need?
2. Which requirements remained unverified after reviewing the closest open and enterprise tools?
3. What can be assembled from components that already exist?
4. What still needs to work for Dylan's exact use case?

`Day 0 took three days` is the opening story and evidence. It is not the thesis.

## Working thesis

Recommended full wording:

> I needed a personal dataset that paired what was on my screens before each move with my exact next destination. The tools I tested could record my screens, clicks, app switches, and browser activity. But no product I could use turned a normal workday into that dataset.

Short compression:

> The tools recorded the activity. No product I could use assembled the personal dataset.

Buildability conclusion:

> I do not need to invent another recorder for the first experiment. After the automatic acquisition ladder stalled, I can label the first records manually, then test a bounded offline extractor if it materially reduces that work. Enterprise task-mining systems show that much of the machinery already exists, but they are not a usable path for this personal pilot. A dependable version for Dylan's setup may still require a custom layer, but that does not establish a net-new product category. The Screenpipe extractor path remains unvalidated.

Do not write `the tool does not exist`. Write `I could not find one that did the whole job for my workflow`.

## Causal chain

1. This navigation-prediction test needs a personal dataset pairing the state available before a move with the destination reached next.
2. Screenpipe, NAPsack, OpenCUA, Scribe, and enterprise task-mining systems already solve many of the underlying capture, ordering, segmentation, export, and review problems.
3. The core dataset contains chronological pairs of what was visible before each move and the exact place Dylan went next.
4. Screenpipe may already have recorded enough raw evidence for an extractor to propose some records, but Dylan did not validate that path.
5. The original acquisition ladder was a component diagnostic, blind 30-action calibration, and 50–100-action natural-work audit. Human inspection and hidden answers graded the automatic system; they were calibration machinery, not fields in the intended dataset or a permanent review workflow.
6. If the full ladder passed, later records would flow directly into the prediction experiment.
7. Dylan treated that calibrated automatic pipeline as a prerequisite for a qualitative experiment. Building toward it consumed three days before he tested an LLM.
8. The stopped 30-action walkthrough shows the cost and fragility of that custom stack. It does not show that Screenpipe's existing recording was insufficient.
9. Manual labeling and per-record review became the fallback after Dylan stopped pursuing the automatic stack. Dylan should run that manual pilot first, then test the bounded extractor only if it materially reduces labeling work.

Every section in the draft must prove one link in this chain.

## Opening and central scene

The article opens with a short abstract that defines the prediction test and explains why it did not begin:

> I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days failing to assemble the dataset it needed.

Then move into the concrete scene:

> I planned a five-day project: one setup day followed by four experiment days. Day 0 was recorder setup. Three days later, it was still not complete.

Date check for the title-level fact:

- the experiment fork was committed on July 23 at 11:04 AM;
- the build ledger began on July 23 at 5:09 PM;
- the protocol was simplified into a manual pilot on July 26 at 12:49 PM, with prediction still not begun; and
- Dylan stated during the work, `it's been 3 days on day 0`.

`Three days` means roughly three elapsed days, not three discrete eight-hour workdays.

Then the concrete facts:

- The intended experiment was to record a day of work, replay navigation moments retrospectively, and test whether an LLM's top three guesses felt useful enough to justify a live demo where pressing Tab took Dylan to the most likely destination.
- Prediction had not begun.
- Screenpipe was audited first.
- NAPsack was added and patched for Dylan's negative-coordinate secondary monitor.
- A custom Hammerspoon, ScreenCaptureKit, and browser stack was built and passed a six-action controlled check.
- A supposedly simple 30-action diagnostic walkthrough consumed most of a day and stopped at 12 accepted checkpoints.
- Five of those 12 freezes had more than one second of cross-display skew. The maximum was 3.765 seconds.
- The walkthrough had protocol drift and was a diagnostic, not a formal calibration.
- The planned next gates were a blind 30-action calibration and a 50–100-action natural-work audit. Only after those passed would later records feed directly into prediction.

The scene proves the cost of the custom stack and motivates the scope correction. It does not establish that the full calibration ladder would have failed because Dylan never ran the later gates. It also does not by itself prove a market-wide product gap. The later Screenpipe section owns the narrower concession that its raw frames may support a simpler extractor.

## The exact data unit

One usable row is:

> what was available strictly before I navigated → the exact place I went next

Example:

> Dylan reaches the end of an article in Arc → `Codex → Personal AI task → composer`

The destination may be an app, window, webpage, document, Codex task, input field, link, or button.

In plain English, each row needs two things:

1. a screenshot or record of what Dylan could see before he moved;
2. the exact place he went next.

The dataset saves those records in the order they happened.

The word `before` matters. If the model sees a screenshot taken after Dylan clicks or switches apps, the screenshot may reveal the answer it is supposed to predict.

Keep three layers separate:

1. **Core prediction dataset:** chronological prior-state and exact-destination pairs.
2. **Calibration machinery:** hidden intended actions, captured evidence, blind reconstruction, and scoring used to determine whether the automatic system can be trusted.
3. **Post-failure fallback:** manual selection, labeling, or review used to run the first prediction experiment after the automatic stack stalled.

The 30-action walkthrough was the first component diagnostic, not the permanent labeling workflow. Dylan knew each intended action and inspected the captured evidence to grade the recorder. If that walkthrough produced a stable capture contract, the next gates were a blind 30-action calibration and an audit of 50–100 actions from natural work. Only after the full ladder passed would later records flow directly into prediction without manual review.

Two validity requirements do not relax:

1. The predictor cannot see the result of the action. The observation must be strictly prior.
2. The recorded next destination must be correct.

The manual fallback does not require perfect cross-display synchronization, exact AX plus DOM identity, cryptographic provenance, exact sub-second timing, or automatic reconstruction of every control. Correct observation attribution and destination labels still matter.

## The complete tool contract

The original automatic acquisition system had to:

1. run passively while Dylan works across native apps and browsers;
2. preserve the state that was available strictly before navigation;
3. retain correctly attributed evidence from both monitors for every record;
4. represent the exact destination in one normalized field, whether it is an app, window, page, document, task, input field, link, or button;
5. propose meaningful transition boundaries rather than treating every raw input as a separate example;
6. export the records chronologically in a format the LLM can use.

The recorder handles job one and supplies raw evidence for jobs two through four. Jobs two through five still require the system to choose the safe prior state, join monitor evidence, normalize the destination, and group inputs into one move. The calibration ladder was supposed to establish that all six jobs worked accurately enough for later records to enter prediction directly.

After the automatic stack stalled, Dylan added manual labeling as the first-experiment fallback. A future dependable product should also surface uncertain records for fast correction instead of silently exporting them. Neither was part of the original core dataset.

The original comparison against NAPsack, OpenCUA, and Scribe was too narrow. Enterprise task-mining products already document ambient capture, task discovery, structured event data, review, and export. Celonis even documents an `all desktops` screenshot mode for multiple screens. Mimica now documents a native macOS recorder with step-level data and screenshots. But neither product was usable for Dylan's experiment. Mimica rejected his personal signup and later canceled the one-person demo because it focuses on larger enterprises. Celonis runs only on Windows.

After adding those systems, the clearest original automatic-assembly requirements are:

1. a documented guarantee that the observation attached to each record is strictly before the navigation action, with correctly attributed evidence from both monitors for every record;
2. one normalized, machine-readable exact-destination field spanning native apps and browsers; and
3. automatic transition boundaries and chronological dataset export.

The original target workflow was:

> record work as it happens → find each meaningful move → save what Dylan saw before it → identify where he went → save the records in time order

The defensible claim is not that task-mining systems lack a conversion layer. They plainly have one. The claim is that the reviewed public materials do not show one tool completing all five conversion steps above for Dylan's prediction experiment. Mimica's detailed data format is not public enough to resolve the technical question, and its enterprise onboarding did not provide a self-serve or one-person evaluation path. Celonis documents rich event tables, multi-screen capture, and task grouping, but it is Windows-only and does not document a guarantee that the saved screen is from before the move or one normalized exact destination spanning native apps and browsers. These may be undocumented enterprise capabilities, but neither product is a current option for Dylan's setup.

## What can be cobbled together for the experiment

The first experiment does not require a new recorder, extractor, or custom review application. Dylan can label the first records manually. If an offline extractor would materially reduce later labeling work, Screenpipe can remain the evidence backbone and the extractor can:

1. find candidate navigation moments from app, window, URL, focus, and meaningful-click changes;
2. select the latest usable state from before each move;
3. use later evidence to draft the destination label; and
4. export the draft rows chronologically to CSV or another simple table.

This post-failure prototype is still unvalidated. It requires new code for the record schema, candidate-boundary logic, safe frame selection, destination drafting, and export. Dylan remains responsible for approving, correcting, or rejecting each proposed record. That review is part of the revised fallback, not the original automatic acquisition plan. The automated work is finding the events, joining the evidence, and drafting the destination before Dylan reviews it.

The prototype deliberately skips live suggestions, a dedicated review interface, reliable automatic segmentation, perfect dual-monitor synchronization, and stable automatic identity for every interface target. Its purpose is to determine whether Screenpipe's existing evidence can reduce the work to reviewing proposed records. If building it becomes another infrastructure project, Dylan should keep labeling the first records manually.

`Low friction` means install, record, and review. It does not mean query a SQLite database, join several clocks, run a marker ritual, or debug monitor geometry.

## What a dependable version still needs

The stalled acquisition ladder changed what Dylan would now require from a dependable automatic system. It still needs:

1. reliable ambient transition detection;
2. selection of the screen state from before each move;
3. target grounding across Accessibility data, browser structure, and visual evidence;
4. robust multi-monitor and cross-stream time joins;
5. explicit handling of missing, stale, or contradictory evidence;
6. a fast correction workflow; and
7. stable dataset export.

Open tools provide most of the primitives but still require custom assembly. Enterprise task-mining systems already provide more of the conversion layer than the initial survey recognized. The remaining work may be a specialized adapter, schema, and review flow rather than a new system from scratch. Public documentation is not enough to support a market-wide novelty claim. But Mimica and Celonis are both nonstarters for Dylan's current setup, so the dependable path for this experiment still requires custom work. No pending vendor demo or trial blocks the article, manual pilot, or later extractor test.

## Claim ledger

### Direct observations

| Claim | Evidence | Allowed wording |
|---|---|---|
| Day 0 consumed three days and prediction had not begun. | Dylan's contemporaneous account; [[computer-use-nap-build-log]] | First-person only. Never say the model failed. |
| Screenpipe 2.5.132 captured screenshots, clicks, keys, scrolling, app switches, focus changes, accessibility content, OCR, and Arc URLs on Dylan's Mac. | [[screenpipe-live-capture-audit-2026-07-23]] | Scope to the tested version and setup. |
| In the natural Screenpipe session, raw microsecond timestamps placed 83 of 164 linked click frames after the click and 81 before it. Some earlier frames were up to 25.3 seconds old. | [[screenpipe-live-capture-audit-2026-07-23]] | Say the linked frame was not a guaranteed immediate pre-action frame. The earlier `76 of 164` figure was a precision-dependent lower bound. |
| In the same session, zero of 40 secondary-display clicks contained direct semantic role, name, and bounds fields. | [[screenpipe-live-capture-audit-2026-07-23]] | Scope to the measured session. Do not generalize to all installations. |
| All 33 Arc frames had a page URL, while none of 484 UI-event rows directly carried one. | [[screenpipe-live-capture-audit-2026-07-23]] | Do not say Screenpipe failed to record URLs. The streams were not joined at the action row. |
| NAPsack required a local monitor-geometry patch on Dylan's negative-coordinate display setup. | [[computer-use-nap-build-log]] | Local implementation fact, not a claim about every setup or current release. |
| The corrected NAPsack controlled run produced same-display pre-action screenshots 106 to 171 ms before seven secondary-display clicks. | [[computer-use-nap-build-log]] | Tiny controlled sample. Use only to show useful primitives existed. |
| Direct Accessibility identified two of four meaningful targets. Screenshot-plus-coordinate review reconstructed the two misses. The combined AX and visual path resolved four of four, with AX resolving one visual disagreement. | [[computer-use-nap-build-log]] | Promising diagnostic, not production-level coverage. |
| Capture Layer v2 passed a six-action real-data check and the checker caught 54 of 54 synthetic failure mutations. | [[computer-use-nap-build-log]] | Validates controlled plumbing, not natural-work segmentation or prediction. |
| The 30-action diagnostic stopped at 12 accepted checkpoints. Five freezes exceeded one second of cross-display skew, with a 3.765-second maximum. | [[computer-use-nap-build-log]] | Progress and engineering evidence, not accuracy. |
| The stopped walkthrough was only the first component diagnostic. The planned next gates were a blind 30-action calibration and a 50–100-action natural-work audit before any automatic records entered prediction. | [[computer-use-nap-30-action-walkthrough-2026-07-24]]; [[computer-use-nap-build-log]] | Human inspection graded the recorder during calibration. It was not the intended ongoing labeling workflow. |
| Niyant first called the idea too vague, later said it aligned overall, and warned that Dylan's small app distribution could make suggestions trivial. | [[tab-could-autocomplete-the-next-computer-action]] | Preserve both the alignment and the unresolved low-entropy concern. |

### Supported synthesis

| Claim | Support | Confidence and boundary |
|---|---|---|
| Existing tools solve real subsets of the capture problem. | Screenpipe, NAPsack, OpenCUA, OpenAdapt, and rrweb primary materials plus local tests | High. This should be stated before any gap claim. |
| Screenpipe was a useful context backbone but did not automatically produce Dylan's exact next-destination rows. | Local Screenpipe audit | High for this setup and version. |
| Screenpipe's raw click timestamp and coordinates may allow a converter to select an earlier frame instead of trusting the linked screenshot. | Local Screenpipe audit and database inspection | Plausible but unvalidated across the target navigation types. The linked frame is not reliably an input or a result frame, and earlier links can be stale. State the required search, freshness judgment, and separate destination recovery as load-bearing conversion work. |
| A post-action frame can invalidate retrospective next-destination evaluation. | Local timestamps plus OpenCUA's documented last-distinct-prior-frame matching | High. |
| The custom stack shows the required evidence streams can be joined. | Controlled check and mutation suite | High for controlled actions. It does not show passive segmentation at useful scale. |
| Bad acquisition can make recorder failure look like model failure. | Frame-ordering and label-coverage findings | Strong evaluation logic. |
| Enterprise task-mining systems already combine ambient desktop capture with task or process discovery, structured data, and analysis or review. | Mimica, Celonis, Skan, and UiPath primary materials | High as a capability-category correction. Product marketing is not proof of Dylan's exact row semantics. |
| The reviewed public materials do not establish one workflow that automatically finds meaningful moves, preserves strict pre-navigation state across both monitors, assigns exact cross-app destinations, and exports chronological prediction records. | Bounded tool survey and local tests | Defensible only as a public-documentation finding. Direct vendor evidence could overturn it, but neither Mimica nor Celonis was a usable evaluation path for this setup. |

### Inference

| Inference | Safe treatment |
|---|---|
| There may be a product or adapter opportunity in the exact prediction-example layer. | Dylan's conclusion from the investigation, not established novelty or market demand. Existing task-mining platforms are strong counterevidence to a broad product-gap claim. |
| Automatic boundary proposals would remove most of the manual work. | Product requirement to test, not an achieved feature. |
| Screenpipe plus a thin converter and human verification may be enough to reduce labeling work. | A later path to test, not a completed result or a prerequisite for the manual pilot. Do not collapse manual assembly into verification. |
| Approximate target identity will be enough to judge qualitative usefulness. | A scoped hypothesis for the first experiment. |
| Perfect simultaneous capture of both monitors is unnecessary for the first converter test. | Distinguish perfect synchronization from correct observation attribution, which remains necessary. |

### Speculation

The draft must flag or exclude these:

- Dylan's exact next destination is predictable.
- Personal history will improve prediction.
- Top-three shortcuts will feel useful.
- The result will justify a public live demo.
- A recorder can segment work accurately with little review.
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
- 83 of 164 linked click frames after the click and 81 before it, with some earlier frames up to 25.3 seconds old

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
5. Published pipelines tolerate approximate element semantics and messy trajectories, but calibration still needs independent ground truth for the exact label being predicted. That does not imply permanent per-record review after an automatic system passes.

Exclude detailed OSWorld modality percentages, general annotation-error statistics, synthetic-grounding scaling curves, robotics analogies, and Microsoft Recall unless the draft develops a specific argumentative need for one.

Allow roughly four memorable quantitative anchors in the article:

1. the three-day delay;
2. 12 of 30 diagnostic checkpoints;
3. the local ordering result that 83 of 164 linked click frames came after the click, while some earlier links were up to 25.3 seconds old; and
4. one directly relevant prior next-action result. The primary [A Click Ahead paper](https://arxiv.org/abs/2309.12170) reports 34.63% exact top-one accuracy for a conventional GRU recurrent neural network choosing among 442 distinct user actions after training on roughly one week of one person's Windows activity.

The `A Click Ahead` result is precedent, not a forecast. The study recorded 46.21 hours and 86,284 actions from one person's dual-monitor Windows setup, discarded interactive areas clicked no more than five times, and reduced the prediction space to 442 actions. Its 34.63% figure is exact top-one validation accuracy on an unseen sequence of 6,000 actions. The model was a GRU, not an LLM. It only had to choose from a fixed list of known actions. Dylan's LLM-based system may need to understand screenshots and name more specific destinations that are not confined to that list.

## Tool comparison

This table maps reusable primitives, existing conversion products, and the narrower row-contract questions that remain unresolved. It is not a scoreboard.

| Tool | Reusable contribution | What remained outside the documented end-to-end contract | Role in a bounded prototype |
|---|---|---|---|
| [Screenpipe](https://github.com/screenpipe/screenpipe) | Always-on, event-driven screenshot capture, accessibility data, OCR, clicks, scrolls, app and window changes, URLs, search, local APIs, and programmable pipes | The tested version exposed raw ingredients, and its timestamps may allow a converter to replace a bad action-linked frame with an earlier one. That path is unvalidated. Screenpipe did not automatically produce chronological exact-destination records. Current public materials are inconsistent about `all monitors` versus an event-time screenshot of the `active monitor`, so multi-monitor behavior should be scoped to Dylan's local audit. | Recording and evidence backbone for the converter test |
| [NAPsack](https://github.com/GeneralUserModels/napsack) | Passive natural-work recording, event-burst grouping, before-and-after evidence on the active display, generated action captions, and JSONL | Its public output does not document synchronized both-monitor state or one stable destination object spanning native and browser targets. The tested version also needed a local monitor-geometry patch. | Candidate-boundary heuristics and captioning patterns |
| [OpenCUA / AgentNetTool](https://github.com/xlang-ai/OpenCUA) | Deliberate task demonstrations, video, inputs, accessibility trees, review, action reduction, last-distinct-prior-frame matching, and standardized trajectories | It is a curated task workflow with declared start and stop. Its macOS instructions document main-display capture. It does not publicly document ambient dual-monitor work becoming proposed exact cross-app destinations. | Safe prior-frame alignment and review patterns |
| [Scribe AutoCapture](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) | Background workflow discovery across approved apps plus the ability to review, edit, publish, or discard the result | Its documented product output is a guide. It does not document strictly prior next-destination rows, synchronized dual-monitor evidence, a normalized cross-app destination object, or reusable raw dataset export. | Review-inbox interaction pattern |
| [Mimica](https://www.mimica.ai/product) | Passive clicks, keystrokes, and application interactions across desktop apps; automatic task and process discovery; step-level screenshots; process maps; CSV, PDD, and BPMN exports; native macOS and Windows recording | This is the strongest current enterprise counterexample. It is designed for organization-wide process-discovery programs and uses sales-led, administrator-enabled onboarding. Dylan's personal signup was rejected, and Mimica canceled his one-person demo. Public materials do not expose enough schema or timing detail to verify strict pre-action state, multi-monitor behavior, one exact destination object, or row-level label correction. | Evidence that the conversion machinery exists; not usable for the current experiment |
| [Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) | Background desktop and browser event capture, optional screenshots, raw and labeled event tables, UI Automation and web attributes, `all desktops` screenshots, manual task definitions, and private-preview AI task grouping | It is Windows-only. Public docs expose rich event data but do not document strict pre-action screenshot semantics or a review flow centered on accepting or correcting an exact next-destination label. | Strong evidence that much of the conversion layer already exists |
| [UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) | Known-task recording, screenshot clustering, trace merging, action annotation, review, and raw CSV export with app, URL, button, selector, timestamp, and coordinates | The current product requires a known task and deliberate traces. Its earlier Unassisted Task Mining did ambient unknown-task discovery and multi-monitor capture but was removed from Automation Cloud in December 2025. Neither public workflow documents Dylan's strict prediction row. | Review, trace, and export reference; historical counterexample to novelty |
| [Skan AI](https://www.skan.ai/process-discovery-and-analysis) | Automatic discovery across applications and handoffs, process maps, screenshots, and a separate recorded-task review flow with editable event names | Public product pages do not expose the event schema, timing contract, multi-monitor semantics, or reusable prediction-row export. ProcessDoc is Windows-only and task-declared. | Additional evidence that automatic workflow discovery is an established product category |
| [OpenAdapt Capture](https://github.com/OpenAdaptAI/openadapt-capture) | Time-aligned event streams and media for recorded GUI workflows | Useful capture primitives do not by themselves create verified ambient next-destination rows. | Additional capture implementation reference |
| [rrweb](https://github.com/rrweb-io/rrweb) | DOM serialization, mutations, interactions, and web-session replay | It does not cover native apps, browser chrome, or cross-app transitions. | Optional browser evidence |
| Custom Hammerspoon + ScreenCaptureKit + Arc extension | Physical events, native Accessibility evidence, both-display images, browser events, timestamps, and controlled validation | It required custom engineering, multiple permissions, manual markers, frozen frames, validation rituals, and repeated repairs. | Evidence that the streams can be joined, not the recommended first-pilot stack |

Do not write that NAPsack or AgentNetTool failed to create state-action data. They do create forms of it. Do not write that Scribe lacks workflow discovery or review. Do not write that the market lacks ambient task discovery, structured event export, or cross-app workflow mapping. The claim is narrower: the public materials reviewed do not establish Dylan's complete automatic-assembly contract. Mimica and Celonis remain evidence against a broad novelty claim, but neither was usable for Dylan's current setup. Do not turn a hypothetical future vendor evaluation into a publication blocker.

## The strongest counterargument

> You did not discover a missing product category. You missed task mining, then overbuilt a benchmark. Mimica claims passive cross-app capture, automatic process discovery, step-level screenshots, CSV export, and native macOS support. Celonis documents granular events, UI and browser attributes, all-desktop screenshots, labeled tables, and task grouping. Screenpipe already recorded both monitors and raw events. Stopping at 12 of 30 proves that the custom protocol was over-scoped, not that a product is missing.

The article should concede most of this and include the narrower Screenpipe-specific objection.

Recommended response:

> I was wrong if I meant that nobody can capture work as it happens, discover workflows, or export structured traces. That is an established task-mining category. I also built a new capture layer before testing whether Screenpipe's raw frames could support a simpler extractor. But neither of the strongest enterprise counterexamples was usable in my setup. Mimica canceled the one-person evaluation, and Celonis only runs on Windows. I still found no public material showing a self-serve Mac tool that automatically found meaningful moves, preserved prior state, named the exact destination, and exported the resulting records in order. That may be an adapter problem or an undocumented enterprise capability rather than a new category. Treating a calibrated automatic pipeline as a prerequisite for a small qualitative experiment was the sequencing mistake.

This section is load-bearing. Without it, the post mistakes self-imposed protocol complexity and an incomplete market search for external evidence.

Planned placement: its own section immediately after the tool comparison and before the converter section, so the converter reads as the direct answer to the objection. Section 1 gestures at the concession and the closing section recalls it briefly, but the full block lives here, not split across the frame.

## Niyant origin section

Keep this short.

Above the three-link metadata line, add a standalone sentence labeling the article as a brief detour into Niyant's personalization thesis. Link `Niyant` to `https://substack.com/@handsdiff` and link only `personalization thesis` to [[niyant-personal-ai-thesis-study-guide|the public vault study guide]]. This is origin context, not disclosure.

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

Use the five-day plan and the fact that Day 0 was still incomplete after three days as the hook. Describe the NAPsack patch, custom capture layer, controlled check, browser extension, and stopped 30-action diagnostic. End by stating that the six-action check passed, but the component walkthrough stalled before the project reached formal calibration, the natural-work audit, or prediction. Do not fully interpret the sequencing mistake here. Section 5 owns that conclusion.

> The stack passed an initial six-action controlled run. But the broader walkthrough stalled before it could establish that the components produced high-fidelity records across Dylan's workflow.

### 2. What the dataset had to contain

Define the core dataset as a chronological sequence of navigation records. Each record contains:

> what was available strictly before I navigated → the exact place I went next

Give a concrete record: Dylan reaches the end of an article in Arc, then goes to `Codex → Personal AI task → composer`. Explain that the saved input must show what he saw before moving and the answer must name the exact destination rather than merely `Codex`.

Explain why the timing and destination label must be right for the prediction test to mean anything. A post-click screenshot can give the LLM the answer, while a bad label can make it impossible to tell whether the prediction was right.

Then distinguish the dataset from the acquisition ladder. The stopped walkthrough was a component diagnostic in which Dylan knew the intended actions and graded the captured evidence. It was supposed to inform a later blind 30-action calibration, followed by a 50–100-action natural-work audit. Only after the full ladder passed would subsequent automatic records enter prediction without manual review. Manual labeling became the fallback after Dylan stopped pursuing that stack.

### 3. Recording alone does not produce this dataset

State the six-part automatic-assembly contract. Explain that the original plan relied on the acquisition ladder to establish that those jobs worked accurately enough for direct downstream use. Human review was calibration instrumentation, not a seventh dataset field. Then explain that Screenpipe runs continuously but takes event-driven screenshots. Neither its linked frame nor the recording alone determines meaningful boundaries, safe prior state, exact destination, or a usable record.

Use Screenpipe as the concrete example. Lead with what worked: screenshots, both monitors, inputs, app and window events, URLs, OCR, and accessibility data. Then use the one local finding chosen in the checks section: raw timestamps placed 83 of 164 linked click frames after the click and 81 before it, with some earlier frames up to 25.3 seconds old. Keep zero of 40 and the remaining metrics in the linked audit unless the draft develops a specific need for them.

Treat the possible Screenpipe reconstruction path as a compact caveat directly after the ordering result, not as a second solution-level argument. State that the inconsistent linkage is load-bearing because an extractor cannot treat `frame_id` as either the input state or proof of the destination. Then say a script might instead use the click timestamp to search both monitor histories for the latest earlier image and use later evidence to propose the destination. Make clear that Dylan did not test this path and does not know how often it would produce a usable record. Keep the fuller search, freshness, and destination-recovery mechanics in this prep and the linked audit.

Add one sentence pre-empting the current-version reply: name the tested version (2.5.132) and dates, note that Screenpipe's current documentation claims expanded capture (full accessibility tree with OCR fallback, keyboard input, app switches, multiple capture methods), and state that the measurements stand for the tested version and setup.

### 4. The closest tools already form a product category

Treat NAPsack, OpenCUA, and Scribe as reusable components in one compact paragraph. Then use Mimica and Celonis as the strongest enterprise counterexamples to broad missing-product claims while stating just as clearly that neither was usable for Dylan's experiment. Mimica canceled the one-person evaluation, and Celonis is Windows-only. Mention Skan, current UiPath, and historical UiPath Unassisted Task Mining together in one short paragraph or note rather than giving each a separate tour. Answer explicitly:

1. which primitive each already solves;
2. which part could be reused in Dylan's prototype; and
3. which parts of the complete contract remain unverified in public documentation.

Do not say that multi-monitor capture, workflow discovery, structured export, or conversion layers are absent from the market. Celonis documents all-desktop screenshots. Mimica documents passive cross-app discovery and CSV export on macOS. Treat those as category evidence, not immediately usable alternatives. Name the simpler residual questions from the original pipeline: does the system find meaningful moves, does the saved input show what Dylan saw before moving, does the output name the exact native-app or browser destination, and can the records be exported in time order? Treat fast correction as a later dependable-product requirement.

### 5. The strongest counterargument, conceded

Run the full counterargument block from the section above. State that task mining is an established category, concede the over-scoped protocol and sequencing mistake, and include the narrower Screenpipe objection that raw frames may support a simpler extractor. Then narrow the residual gap to a self-serve Mac workflow that automatically finds meaningful moves, reconstructs prior state, names exact destinations, and exports chronological records.

### 6. A first version can be cobbled together

Make clear that this is the post-failure fallback, not the original workflow. Lead with the manual pilot because prediction utility is now the first unknown. Then describe the unvalidated offline Screenpipe extractor as a later way to reduce labeling work: propose candidate boundaries, select safe prior evidence, draft the destination from later evidence, and export chronological records to a simple table.

Explain that Dylan approves, corrects, or rejects every proposal in this revised fallback. That review was not part of the original automatic collection plan. The automated work is finding events, joining evidence, and drafting destinations. Without that assembly, Dylan would have to query the database, align events, choose frames, and construct every record himself.

State what the converter deliberately skips: live suggestions, a custom review interface, perfect synchronization, and stable identity for every interface target. Make the fallback explicit: if even this bounded converter becomes another infrastructure project, assemble the first examples manually.

### 7. What a dependable version still needs

Explain what still has to be guaranteed for Dylan's use case:

1. reliable ambient segmentation;
2. selection of the screen state from before each move;
3. Accessibility, DOM, and visual target grounding;
4. multi-monitor and cross-stream joining;
5. missing-data handling;
6. fast correction; and
7. stable export.

Then state the bounded conclusion. Open tools require custom assembly. Enterprise task-mining systems show that much of the machinery already exists, so Dylan cannot claim a new category. But Mimica and Celonis were both unusable for this experiment, and their public documentation does not settle the strict row-contract questions. A dependable version for Dylan's current setup would still require a custom layer.

### 8. Why this matters and what happens next

Use the Niyant exchange to connect the narrow data problem to the larger personalization thesis. Keep the claim bounded: personal next-action prediction requires a personal interaction dataset, and automatically producing high-fidelity records remains an integration burden.

Recall the concession from section 5 briefly rather than re-arguing it: Dylan tried to build the dependable automatic product before establishing that the prediction felt useful.

Explain the corrected sequence:

1. run the manual pilot;
2. decide whether the predictions are useful;
3. use the offline extractor only if it actually reduces the labeling work; and
4. build, or buy, the dependable version only if the prediction earns it.

Close the section and the article plainly, pointing the invitation at the contract so it is answerable:

> If you have built something that already produces these examples, or you are working on it, I want to see it. The automatic-assembly requirements above are the test.

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
- `No product captures work as it happens and discovers workflows automatically.`
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
   These unanswered questions do not block the article, the manual pilot, or a later Screenpipe extractor test.
5. Resolved for this experiment 2026-07-27: Celonis is Windows-only, so it is not usable on Dylan's Mac. It remains evidence that multi-screen screenshots, structured event tables, and task grouping exist in the enterprise category. A future market-wide novelty claim would still need to distinguish those capabilities from Dylan's strict row contract, but Celonis is not an immediate product option or a publication blocker.
6. Corrected 2026-07-27: use the raw-timestamp split of `83 of 164 after` and `81 before` in the body because it directly explains the ordering problem. Some earlier links were up to 25.3 seconds old. The original `76 of 164` figure treated seven sub-millisecond post-click frames as tied at SQLite date-comparison precision. Keep `zero of 40` and the remaining metrics in the linked audit unless the draft develops a specific need for them.
7. Verify the public URLs after Quartz updates. Link primary tool sources in the final post.
8. Do not state that the post-failure Screenpipe converter and human-review fallback has passed until it actually produces valid records.
9. Added 2026-07-26: Recheck Screenpipe's current release and documentation at draft time. Current documentation and marketing claim expanded capture, including a full accessibility tree with OCR fallback, keyboard input, app switches, and multiple capture methods. The tested version was 2.5.132 in July 2026. Keep every measured claim scoped to it and include the section 3 pre-empt sentence.

## Title decision

Selected: **The Missing Step Between Recording and Prediction**

`Day 0 took three days` remains the opening hook, not the title or thesis. The deck and first paragraphs must establish that the article is answering the tool-gap and buildability questions, not merely recounting a difficult setup.

## Candidate final compression

> I started by asking whether an LLM could predict where I would go next. Instead, I spent three days trying to validate an automatic pipeline for the data it needed. The component walkthrough stalled before formal calibration or a natural-work audit, so the prediction test never began. Existing tools recorded the ingredients, but no product I could use assembled the personal dataset. Screenpipe's raw frames may support a smaller extractor, although I did not test that path. The next step is to label enough records by hand to run the prediction experiment, then automate more only if the prediction is useful.

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
- The article should end with the manual prediction experiment ahead, not pretend the prediction or extractor has already worked.

## Draft gate

The first draft can begin only if it preserves all seven boundaries:

1. The opening abstract and section 1 frame all four crux questions. What output Dylan needed, what remains unverified in the closest tools, what can be cobbled together, and what may still require custom work are each answered by the end of section 7.
2. The universal `missing tool` claim has been narrowed to a public-documentation finding about Dylan's exact row contract.
3. Existing tools are treated as reusable components and counterexamples, not dismissed as failures.
4. The article openly concedes that the first capture protocol was over-scoped.
5. The core dataset, calibration machinery, and post-failure manual fallback are treated as three different things. The article states that human inspection graded the automatic system during calibration and was not the intended ongoing workflow. The manual pilot, bounded offline extractor, and dependable automatic product remain three levels of future work.
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
