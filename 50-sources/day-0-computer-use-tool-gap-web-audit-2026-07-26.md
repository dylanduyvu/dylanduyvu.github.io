---
type: research
status: reference
created: 2026-07-26
updated: 2026-07-27
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - task-mining
  - next-action-prediction
  - evidence-audit
  - deep-research
---

# Day 0 computer-use tool-gap web audit, July 26, 2026

## Update, July 27

The row definition and narrower verdict below conflated three different layers. The core prediction dataset contained chronological pairs of prior screen state and exact next destination. Captured evidence, hidden answers, blind reconstruction, and scoring belonged to the acquisition-calibration machinery. Manual per-record labeling or review became the fallback only after Dylan stopped pursuing the automatic stack.

The original goal was for a component diagnostic, blind 30-action calibration, and 50–100-action natural-work audit to establish that later automatic records could enter prediction directly. Human inspection graded the recorder during those gates; it was not the intended everyday workflow.

Read the narrower tool-gap question as whether a usable system automatically finds meaningful moves, preserves the prior state across Dylan's two monitors, assigns the exact destination, and exports the records in order. Fast correction remains a reasonable dependable-product requirement, but it was not a field in the original dataset.

## Research question

Does current public evidence support the claim that no existing tool turns ordinary work into Dylan's required next-destination examples?

The required row is:

> what was available strictly before I navigated → the exact place I went next → evidence → Dylan's verified verdict

The destination may be an app, window, webpage, document, Codex task, input field, link, or button.

## Verdict

The broad missing-tool claim does not survive.

Ambient cross-app capture, automatic task discovery, structured event tables, review, multi-monitor screenshots, and CSV export already exist across the task-mining market. Mimica is the strongest current macOS counterexample. Celonis is the strongest publicly documented event-data counterexample. Skan documents automatic cross-application process discovery. UiPath's discontinued Unassisted Task Mining is a strong historical counterexample.

The narrower claim survives:

> In the public materials I reviewed, I found no documented workflow that does this whole job: save what I saw before each move, identify the exact place I went next, show me enough proof to approve or fix the answer, and export the approved examples in time order.

This is a public-documentation finding. It is not proof that Mimica, Celonis, Skan, or another enterprise product cannot provide the workflow through configuration, APIs, or services.

## Claim audit

| Prep claim | Verdict | Evidence and correction |
|---|---|---|
| Most capture primitives already exist. | Supported and understated. | Open recorders and enterprise task-mining systems cover capture, event grouping, UI metadata, workflow discovery, review, and export. |
| No public tool reviewed turns ordinary work into the required rows. | Supported only after narrowing. | Public materials do not establish the complete strict row contract. Several systems come much closer than the original survey acknowledged. |
| Both-monitor evidence is an unmet atomic capability. | Refuted as a broad claim. | Celonis documents an `all desktops` screenshot mode. Historical UiPath Unassisted Task Mining documented multi-monitor support. The unresolved property is strict pre-action timing and correct attribution, not the ability to capture multiple displays at all. |
| The conversion layer is net new. | Refuted as written. | Mimica, Celonis, Skan, Scribe, and UiPath all convert raw activity into tasks, traces, guides, maps, or labeled tables. Dylan may need a specialized adapter and review schema, not a new conversion system from scratch. |
| One exact destination field across native apps and browsers is not publicly documented. | Supported with caution. | Celonis and UiPath expose many relevant fields, including app, URL, button, selector, coordinates, and UI Automation attributes. They do not document one normalized destination object with Dylan's exact semantics. |
| Strictly prior state remains necessary. | Supported. | OpenCUA deliberately aligns click actions to the last visually distinct frame before mouse movement to avoid future-information leakage. |
| Manual verification of the predicted label remains necessary. | Supported. | OpenCUA's review flow checks action-video correspondence. UiPath states that current Task Mining does not replace analyst or SME review. Approximate UI semantics do not justify an incorrect target label. |
| A bounded Screenpipe extractor is enough to try first. | Plausible but unvalidated. | Screenpipe documents event-driven screenshots, accessibility data, OCR fallback, UI events, local APIs, and programmable pipes. Dylan's local audit shows the joins and timing still need care. |
| A dependable version is definitely a new standalone product. | Not established. | A task-mining integration or adapter may be enough. A vendor trial is required before making a novelty claim. |

## Strongest current enterprise counterexample: Mimica

[Mimica's product page](https://www.mimica.ai/product) says its recorder captures clicks and keystrokes across the desktop and all applications, automatically generates process maps, and exports PDD, BPMN, and CSV outputs. [Mimica's task-mining explanation](https://www.mimica.ai/articles/what-is-task-mining) says the desktop agent records clicks, keystrokes, and application interactions passively, then uses AI to identify recurring task patterns and produce process maps and automation artifacts.

On July 22, 2026, four days before this audit, Mimica [announced native macOS recording](https://www.mimica.ai/articles/introducing-mimica-task-mining-for-macos). It says the Mac recorder provides the same process maps, step-level data, and screenshots as its Windows recorder.

Mimica is built and sold as an enterprise process-intelligence system. Its [contact page](https://www.mimica.ai/contact) offers a free 14-day proof of concept, and its [official FAQ](https://www.mimica.ai/use-cases/test) says users receive an email invitation before downloading the recorder. Dylan tried the public registration page with his Gmail address on July 26, 2026 and received `This email is not enabled, please contact your admin.` This establishes that the observed evaluation path was administrator-enabled or sales-led for Dylan. It does not prove that every personal email or every organization is rejected.

This directly counters these broad claims:

- no current product passively captures ordinary cross-app work on macOS;
- no current product converts that activity into discovered workflows;
- no current product exports structured results; and
- the automatic conversion layer must be built from scratch.

What the public material does not establish:

- whether one Mac can capture multiple monitors;
- whether a screenshot attached to an event is strictly before the action;
- the raw CSV schema and whether it includes stable native and browser target identity;
- whether a reviewer can correct the exact destination at the event or row level; and
- whether accepted rows can be exported in chronological prediction-ready form.

Mimica should be evaluated before the article claims a net-new automatic product gap. It is evidence that enterprise conversion machinery exists, but it is not evidence that an individual has a low-friction, self-serve way to create personal next-destination examples.

## Strongest documented event-data counterexample: Celonis

[Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) runs a client on user machines and captures granular interactions across software applications and websites, with optional desktop screenshots. Its [desktop application documentation](https://docs.celonis.com/en/task-mining-desktop-application.html) says the client runs in the background. It is currently Windows-only.

[Working with Task Mining data](https://docs.celonis.com/en/working-with-task-mining-data.html) documents:

- a raw `user_interaction_event_log` table;
- a processed `TM_Labeled_Data` table;
- clicks, scrolling, text entry, and other user actions;
- optional screenshots;
- browser URL extraction;
- UI Automation context; and
- configurable processing and analysis.

The [current event-processing documentation](https://docs.celonis.com/en/event-processing-rules.html) retains screenshot modes for the active window, active desktop, or all desktops. The [older text-editor reference](https://docs.celonis.com/en/event-processing-rules---text-editor.html) explicitly described `ALL_DESKTOPS` as the mode for multiple screens. Together, these refute a broad claim that enterprise task mining lacks multi-monitor capture.

The [Task Mining data reference](https://docs.celonis.com/en/task-mining-data-reference.html) documents granular event types and attributes, including active-window changes, clicks, browser-tab activation, timestamps, application process, URL and link context, screenshot IDs, snippet IDs, mouse location, and UI Automation fields. The [UI Automation documentation](https://docs.celonis.com/en/capturing-ui-automation-data.html) also warns that target metadata may be missing or inconsistent, especially when the clicked element disappears before it is queried.

Celonis offers two task-grouping paths:

- a limited-availability rules workflow that defines task start and end events; and
- a [private-preview AI Task Discovery workflow](https://docs.celonis.com/en/grouping-task-mining-events-into-tasks--task-discovery-.html) that groups captured events into tasks and subtasks and writes results to a table joined with labeled event data.

What remains undocumented for Dylan's use case:

- whether `all desktops` evidence is captured strictly before or after the triggering event;
- whether one normalized destination field spans native UI Automation and browser targets;
- whether the review flow centers on accepting or correcting that exact destination label; and
- whether the accepted result exports directly as chronological prediction rows.

Celonis shows that much of the proposed conversion layer is already an enterprise product. It does not settle the strict row-contract question.

## UiPath: current and historical counterevidence

[Current UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) records variations of a known task, clusters screenshots, merges traces, supports action annotation and analyst review, and exports automation artifacts. It explicitly says it does not automatically discover unknown tasks and does not replace analyst or SME review.

UiPath's [raw-data export](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/raw-data-export) produces CSV rows with action ID, action title, UTC timestamp, application, URL, domain, step name, action type, button name, raw selector, mouse position, and duration. This is a strong counterexample to any claim that cross-app machine-readable action export is absent.

UiPath previously offered Unassisted Task Mining. Its [archived analysis guide](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/unassisted-task-mining-analysis-guide) describes automatic task-candidate discovery from ambient recordings, chronological screenshot review, noise, split tasks, and missing starts or ends. The [historical FAQ](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/faq) explicitly answered yes to multi-monitor recording, described manual step-label editing after analysis, and documented CSV export of user actions, including actions not assigned to a task. UiPath's [official deprecation notice](https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/november-2024) said the feature would be removed from Automation Cloud on December 1, 2025.

The historical product proves that ambient unknown-task discovery with reviewer triage and multi-monitor capture is not a new category. Its removal also suggests that dependable segmentation and review are hard product problems.

## Other live counterexamples

[Skan's process-discovery page](https://www.skan.ai/process-discovery-and-analysis) says it observes clicks, applications, and handoffs across applications and automatically builds process maps. [Skan ProcessDoc](https://www.skan.ai/free-trial/skan-processdoc) records a declared task on Windows, captures screenshots and events, and presents them for review, renaming, and refinement. Its public pages do not expose enough schema or timing detail to verify Dylan's row contract.

[Microsoft Power Automate Task Mining](https://learn.microsoft.com/en-us/power-automate/process-advisor-processes) records declared processes and lets reviewers edit or remove captured actions. It is another strong task-recording and review precedent, but not an ambient unknown-task workflow.

[Scribe AutoCapture](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) was updated July 15, 2026. It is in beta for Pro Team and Enterprise customers, discovers workflows in the background across a curated or admin-controlled approved-app list, and lets users review, edit, publish, or discard a guide. Older cached text used whitelisted-domain language. The current official page should control.

## Open and research tools

### Screenpipe

[Screenpipe's repository](https://github.com/screenpipe/screenpipe) and [architecture documentation](https://docs.screenpipe.com/architecture) support the bounded prototype:

- continuous event-driven capture;
- screenshots paired with accessibility data;
- OCR fallback;
- UI-event storage;
- frame, context, element, search, and raw SQL APIs; and
- programmable pipes that can query data and write files.

The current repository says multi-monitor capture is supported, while the architecture page describes an event-triggered screenshot of the active monitor. This is a documentation inconsistency. Use Dylan's local audit for measured multi-monitor behavior and keep all timing and semantic-coverage claims scoped to version 2.5.132 and the tested sessions.

### NAPsack

The [NAPsack repository](https://github.com/GeneralUserModels/napsack), [PyPI package](https://pypi.org/project/napsack/), and [paper](https://arxiv.org/abs/2603.05923) verify:

- passive screenshots and input events;
- temporal grouping into event bursts;
- forced burst restart when the active monitor changes;
- screenshots 75 ms before the first burst event and 75 ms after the last;
- VLM-generated action captions; and
- `aggregations.jsonl`, `captions.jsonl`, and `data.jsonl` output.

The burst thresholds were chosen qualitatively and the paper says they should be retuned for new interfaces. Public materials do not document synchronized both-monitor state, a row-correction queue, or Dylan's normalized exact-destination object.

### OpenCUA and AgentNetTool

The [OpenCUA paper](https://arxiv.org/abs/2508.09123), [AgentNetTool pipeline](https://agentnet-tool.xlang.ai/requirements/annotation/annotation/), and [Mac quickstart](https://agentnet-tool.xlang.ai/quickstart/mac_quick_start/) verify:

- deliberate start-and-stop task demonstrations;
- screen video, mouse and keyboard activity, and accessibility data;
- review of action-video correspondence and deletion of redundant actions;
- reduction of dense inputs into meaningful actions;
- alignment of clicks to the last visually distinct frame before mouse movement; and
- a documented Mac OBS setup using the main display.

This is the strongest support for the no-future-information rule. It is not an ambient all-day discovery workflow.

## Scientific claim checks

### A Click Ahead

The primary [A Click Ahead paper](https://arxiv.org/abs/2309.12170) supports the proposed quantitative anchor.

Verified details:

- one person's Windows activity;
- a dual-monitor setup;
- 46.21 recorded hours;
- 86,284 actions;
- 3,008 distinct raw actions;
- interactive areas clicked no more than five times removed;
- a retained prediction space of 442 actions;
- an unseen validation sequence of 6,000 actions, about one day of activity; and
- 34.63% exact top-one validation accuracy for the best GRU, a conventional recurrent neural network rather than an LLM.

This is direct precedent for personal next-action prediction. It is not an accuracy forecast. The system was not LLM-based, and its model only had to choose among 442 known actions. Dylan's proposed LLM system may need to interpret richer context and name finer-grained destinations outside a fixed list.

### AndroidControl scaling

[On the Effects of Data Scale on UI Control Agents](https://arxiv.org/abs/2406.03679) verifies that in-domain fine-tuning scaled more favorably than out-of-domain transfer.

Important boundaries:

- 15,283 demonstrations across 833 Android apps;
- models predict steps under high-level or low-level instructions;
- input is accessibility-tree text, not screenshots;
- the metric is relaxed step-wise action accuracy, not spontaneous next-destination accuracy;
- five training episodes were enough for the low-level fine-tuned model to slightly exceed the best non-fine-tuned low-level baseline;
- high-level performance needed substantially more data; and
- projected out-of-domain requirements were one to two orders of magnitude larger.

This motivates testing a personal in-domain system. It does not prove Dylan's prediction task will work.

### Single-screen benchmark claim

The primary sources support a bounded statement:

- [OSWorld](https://arxiv.org/abs/2404.07972) uses one full computer screenshot, default 1920 by 1080, plus optional accessibility and terminal observations.
- [WindowsAgentArena](https://arxiv.org/abs/2409.08264) uses current and previous screenshots at 1440 by 900 from one Windows VM.
- [AndroidWorld](https://arxiv.org/abs/2405.14573) uses one full-resolution screenshot and UI tree from one Pixel 6 emulator.

These benchmarks do not test synchronized multi-monitor observations. That is absence of evidence. `A Click Ahead` separately proves that dual-monitor next-action collection has been done.

### Approximate semantics and messy trajectories

[Android in the Wild](https://arxiv.org/abs/2307.10088) uses OCR text or one of 96 detected icon classes to create a pixel-derived UI representation and explicitly notes that this representation is noisy. This supports approximate semantics in a pilot.

OpenCUA retains recoverable human errors to teach reflection and correction. That supports realistic imperfect trajectories. It does not support incorrect labels for the action being predicted. Dylan still needs to verify the exact destination.

## Draft implications

1. Keep `Day 0 took three days` as the hook.
2. Replace the missing-product thesis with a strict row-contract thesis.
3. Introduce task mining before claiming novelty.
4. Treat Mimica as the most important unresolved enterprise product, while stating that its administrator-enabled, sales-led onboarding makes it unsuitable as the immediate personal pilot.
5. Use Celonis to show that multi-monitor screenshots, granular event tables, and task grouping already exist.
6. State that the first experiment still does not need a vendor procurement cycle. Screenpipe plus manual verification remains the fastest test.
7. Describe the dependable version as an unresolved build-versus-buy question.
8. Do not use acquisition work as evidence that prediction will succeed.

## Vendor questions that could overturn the remaining gap

Ask Mimica:

1. Does the macOS recorder capture every attached monitor or only the active display?
2. Is each step screenshot taken before or after the action?
3. What are the raw CSV columns?
4. Do native and browser targets share a normalized element schema?
5. Can a reviewer correct the target label at the event level?
6. Can accepted events be exported chronologically?

Ask Celonis:

1. Does `all desktops` capture one synchronized image or separate display images?
2. Is the screenshot captured before or after the triggering event?
3. Can task labels be attached to individual navigation events rather than task spans?
4. Can reviewers correct a proposed native or browser destination?
5. Is macOS support available or planned?

## Related notes

- [[blog-prep-day-0-took-three-days|Blog prep: Day 0 Took Three Days]]
- [[computer-use-nap-fidelity-research-2026-07-26|Computer-use NAP: dataset fidelity research]]
- [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey]]
- [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live-capture audit]]
