---
type: blogpost
status: draft
created: 2026-07-26
updated: 2026-07-27
people: []
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - blogpost
  - computer-use
  - next-action-prediction
  - data-acquisition
sources:
  - screenpipe-live-capture-audit-2026-07-23
  - computer-use-nap-fidelity-research-2026-07-26
---

%%
Draft status: first complete draft. Harness section 17 checkpoint 2 reached (first complete draft exists).
Written from: blog-prep-day-0-took-three-days.md (all eight sections, four anchors, claim-ledger wording).
Completed 2026-07-26: first ownership edit, naive-reader full read, citation-binding pass, colon audit, overclaim search, belonging pass, and register re-scan.
Added after the lint passes on 2026-07-26: the section 4 comparison table and its two framing paragraphs, register-checked individually at insertion. Every table cell is a claim.
Completed 2026-07-26: compression pass reduced reader-visible article copy from 2,373 to 1,791 words without removing the table, evidence boundaries, or experiment stages.
Updated 2026-07-27: Mimica canceled the scheduled demo before the product questions could be asked. The Mimica capability cells remain question marks, and the cancellation screenshot now supports only the enterprise-market claim.
Completed 2026-07-27: connective-tissue pass added short causal and contrast words at abrupt seams without changing the argument or section order.
Completed 2026-07-27: global epistemic pass removed wording that made the unrun prediction experiment sound like a negative result.
Updated 2026-07-27: added the causal account of why the controlled capture stack stayed fragile and why making it dependable became product engineering.
Completed 2026-07-27: second compression pass removed repeated setup, conclusions, and product requirements while preserving the causal account, evidence boundaries, counterargument, and experiment stages.
Updated 2026-07-27: rewrote the deck to name the LLM, exact-destination scope, Tab-key interaction, unrun test, and automated dataset attempt; removed repeated opening lines.
Completed 2026-07-27: added the public associated-research, file-specific revision-history, and disclosure links required by the publication harness.
Updated 2026-07-27: expanded the opening into a day-by-day experiment list that defines the baseline, accumulating-history comparison, and qualitative live-demo decision.
Updated 2026-07-27: reorganized the capture-fragility section into five labeled causes while preserving its rationale, sequencing concession, and product implication.
Updated 2026-07-27: reconciled every Mimica and Celonis reference after the canceled demo, distinguishing evidence that the enterprise category exists from products usable in Dylan's setup.
Updated 2026-07-27: rewrote the opening thesis around the personal dataset, named the recorded inputs, and replaced the documentation-led gap claim with the stronger bounded finding that no product Dylan could use assembled the dataset.
Updated 2026-07-27: rewrote the dataset section to establish chronological order once, then stay at the navigation-record level; removed the redundant pilot and research aside.
Updated 2026-07-27: corrected the Screenpipe section to explain its event-driven screenshots, why a click-linked frame could show the post-click state, and how the raw streams could still produce candidates for manual review.
Updated 2026-07-27: narrowed the thesis after recognizing that Screenpipe may already have recorded enough evidence. The untested gap is conversion into proposed records for Dylan to verify, and the custom capture stack was not shown to be necessary.
Updated 2026-07-27: restored the broader dataset-assembly thesis after the Screenpipe reconstruction hypothesis overcorrected the article; kept the narrower concession that the raw-frame extraction path was not tested.
Corrected 2026-07-27: replaced the precision-dependent `76 of 164` Screenpipe ordering figure with the raw-timestamp split of 83 post-click and 81 pre-click frames.
Completed 2026-07-27: compressed the untested Screenpipe reconstruction path into a caveat so it qualifies the evidence without competing with the observed result.
Corrected 2026-07-27: separated the core dataset, acquisition-calibration machinery, and post-failure manual fallback. Human inspection in the 30-action walkthrough graded the recorder; it was not the intended ongoing labeling workflow.
Remaining before final publication: Dylan's personal read, including a per-cell check of the comparison table; final link verification after later edits.
%%

# The Missing Step Between Recording and Prediction

---

*This article is a brief detour into [Niyant](https://substack.com/@handsdiff)'s [personalization thesis](https://dylanduyvu.github.io/20-syntheses/niyant-personal-ai-thesis-study-guide).*

*[Associated research](https://dylanduyvu.github.io/30-projects/computer-use-nap-fidelity-research-2026-07-26) | [Revision history](https://github.com/dylanduyvu/dylanduyvu.github.io/commits/main/20-syntheses/day-0-took-three-days.md) | [Disclosure](https://dylanvu.substack.com/about)*

---

*I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days failing to assemble the dataset it needed.*

I needed a personal dataset that paired what was on my screens before each move with my exact next destination. The tools I tested could record my screens, clicks, app switches, and browser activity. But no product I could use turned a normal workday into that dataset. This post separates what I can reuse now from what a dependable system would still need.

## Day 0 took three days

I planned a five-day project: one setup day followed by four experiment days.

- **Day 0:** Configure Screenpipe (or research relevant tools) and define how recorded work would become navigation records.
- **Day 1:** Record a day of work and create the first day of history.
- **Day 2:** On the same navigation events, compare the LLM seeing only my current screen against the LLM seeing that screen plus Day 1 history.
- **Day 3:** Repeat with zero, one, and two days of history.
- **Day 4:** Repeat with zero, one, two, and three days of history.

If history made the top-three exact-destination guesses qualitatively more useful, I would build a live public demo where pressing Tab took me to the most likely destination.

Day 0 was supposed to be setup. Three days later, it was still not complete.

I audited [Screenpipe](https://github.com/screenpipe/screenpipe), which runs in the background and records screen and input activity. I added [NAPsack](https://github.com/GeneralUserModels/napsack), which groups nearby clicks and keystrokes into short activity segments and generates a plain-English description of each one. But I had to patch its display assignment because my two-monitor setup places the second display above the main one. I then built a capture layer from Hammerspoon (a macOS automation tool), ScreenCaptureKit (Apple's screen recording framework), and a browser extension.

Then I ran a 30-action diagnostic to see whether those pieces worked together across the kinds of navigation I make. I spent most of the day patching failures as it exposed one edge case after another, then paused with only 12 of the 30 checkpoints accepted. Even in those accepted checkpoints, the two monitor streams were not reliably in sync.

The stack passed an initial six-action controlled run. But the broader walkthrough stalled before it could establish that the components produced high-fidelity records across my workflow. I never reached formal calibration, a natural-work audit, or the prediction test.

## What the dataset had to contain

The dataset had to keep the navigation records in the order they happened. Each record needed two parts:

1. what was on my screens immediately before I moved;
2. the exact place I went next.

For example, suppose I finished reading an article on my Arc browser, then moved to the message box in one Codex task. The record needed to show the article before I moved and name that specific task and field rather than just "Codex."

The 30-action walkthrough was the first validation gate for an automatic collection system. I knew each intended action, then inspected the captured evidence to see whether the system reconstructed it correctly. I was grading the recorder, not labeling the dataset I intended to collect every day.

Even passing that walkthrough would not have unlocked prediction. The next gates were a blind 30-action calibration and an audit of 50 to 100 actions from normal work. Only if the full acquisition ladder passed would later records flow directly into the prediction experiment without manual review.

For the prediction test to mean anything, the timing and destination label had to be right. A screenshot taken after I moved could give the LLM the answer, while a bad label could make it impossible to tell whether its prediction was right.

## Recording alone does not produce this dataset

Turning recorded activity into the dataset automatically required six jobs:

1. run quietly while I worked across native apps and browsers;
2. preserve what was on screen strictly before each move;
3. keep correctly attributed evidence from both monitors for every record;
4. name the exact destination in one consistent field, whether it is an app, window, page, document, task, input field, link, or button;
5. propose meaningful boundaries between moves, instead of treating every keystroke as its own record;
6. export the records in time order, in a format I could give to the LLM.

My original plan assumed the acquisition ladder would establish that these jobs worked well enough to run without checking every later record. A review and correction queue became relevant only after I stopped pursuing that automatic plan.

Screenpipe covered the first job and supplied much of the raw evidence needed for the rest. In my test, version 2.5.132 captured both monitors, inputs, app and window changes, web addresses, screenshot text, and the accessibility tree, which is how macOS describes on-screen controls to assistive software. Its [current architecture documentation](https://docs.screenpipe.com/architecture) explains that events such as clicks, app switches, scrolls, typing pauses, and idle periods trigger screenshots instead of fixed-rate video.

But the screenshot Screenpipe linked to a click was not guaranteed to show the state before the click. In one 50-minute session, 83 of 164 click-linked screenshots came after the click. The other 81 came before, but some were up to 25 seconds old. So an extractor could not treat the link as either the input state or proof of where I arrived.

That did not prove the raw recording was unusable though. A script could ignore Screenpipe's frame link, use the click timestamp to search both monitor histories for the latest earlier image, and use later evidence to propose the destination. I did not test that approach, so I do not know how often it would produce a usable record.

The full measurements are in [my audit](https://dylanduyvu.github.io/50-sources/screenpipe-live-capture-audit-2026-07-23). Screenpipe's current documentation describes a fuller accessibility tree and more input methods than I observed, so these numbers apply only to my version and setup.

## Why my custom capture system stayed fragile

The 30 actions were a component diagnostic, not training data, a formal calibration, or a prediction test. The initial controlled run did not establish that the stack worked across native controls, ordinary and dynamic webpages, focus and app changes, keyboard navigation, and both monitors. I needed a broader check before building the formal calibration harness.

That broader check was fragile for five reasons:

- **The protocol required perfect choreography.** I had to prepare the application, mark ready, freeze both displays, perform one action, mark completion, and export browser evidence when relevant. An extra click, missed marker, or delayed input could contaminate the interval.

- **The evidence did not share one clock or identifier.** The system had to join input events, separate display streams, macOS Accessibility records, browser events, and an action ledger. The browser did not know the Mac automation layer's action ID, so the join depended on timestamps, coordinates, window and document identity, and a narrow interval.

- **The interfaces changed during capture.** Webpages responded to JavaScript events, focus arrived late, and browser tabs, split views, and temporary windows exposed different identities. A static monitor might not emit a fresh frame when the other monitor changed.

- **Exact targets had no shared representation.** macOS might return the intended button, an image inside it, a generic container, an unnamed field, or nothing useful. Browser structure was more precise for webpages but could not describe native controls or browser chrome. Screenshots and coordinates filled gaps but required another inference step.

- **The validator was still changing.** The diagnostic exposed cases we had not anticipated. Fixing the validator helped preserve genuine evidence, but one frozen set of rules no longer judged every checkpoint. A formal test would have required implementing the remaining cases, freezing the validator, and running it again.

Testing the capture stack first was reasonable. Otherwise, a wrong prediction could reflect my behavior, the LLM, the action boundary, the destination label, or a screenshot that already showed the answer.

But the diagnostic measured my custom stack. It did not show that Screenpipe's raw recording could not support a simpler extractor. I should have tested that path before building more capture infrastructure.

## The closest tools already form a product category

I first compared research tools and self-serve products. NAPsack groups nearby clicks and keystrokes into short activity segments and describes each one in plain language. But its [published task](https://arxiv.org/abs/2603.05923) predicts those descriptions rather than exact destinations. [OpenCUA](https://arxiv.org/abs/2508.09123) pairs actions with the last distinct prior screenshot, but collects declared demonstrations; its [macOS setup](https://agentnet-tool.xlang.ai/quickstart/mac_quick_start/) records one display. [Scribe](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) discovers workflows across approved business apps and lets users review, edit, publish, or discard them. Its documented exports are finished guides, including [Markdown](https://support.scribehow.com/hc/en-us/articles/9254133020189-Exporting-a-Scribe-to-Markdown), rather than raw prediction records.

Then I looked at enterprise task mining, which records work to find repeated business processes. [Mimica](https://www.mimica.ai/product) advertises passive desktop capture, task discovery, step-level screenshots, spreadsheet export, and a [native macOS recorder](https://www.mimica.ai/articles/introducing-mimica-task-mining-for-macos). Its signup rejected my personal email with "This email is not enabled, please contact your admin." On the morning of my scheduled demo, Mimica canceled because my one-person request did not fit its focus on larger enterprises.

![Mimica canceled my scheduled demo after deciding that my one-person request did not fit its focus on larger enterprise organizations.](../70-attachments/mimica-demo-canceled-enterprise-focus-2026-07-27.png)

[Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) is another enterprise counterexample. It documents background capture, raw and labeled event tables, and screenshots of [all attached desktops](https://docs.celonis.com/en/event-processing-rules.html), but runs only on Windows. [Skan](https://www.skan.ai/process-discovery-and-analysis) and [UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) are in the same category. UiPath's earlier [unassisted mode](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/unassisted-task-mining-analysis-guide) found workflows across monitors before it [was removed](https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/november-2024) from the cloud in December 2025.

So the category exists, but not as an option for this experiment. Mimica would not take the one-person evaluation, and Celonis was Windows-only. Four parts of the original automatic pipeline also stayed unresolved in the public material. Does it find meaningful moves during normal work? Is the screenshot from before the move? Does the output name the exact native-app or browser destination? Can the records be exported in time order? For enterprise systems, these may be undocumented capabilities rather than gaps.

The table maps documented capabilities and my tests to the six original jobs, plus the review flow I would now want in a dependable product. It does not mean that a product was usable in my setup. A question mark means the material did not answer. Vendor rows are vendor claims, while local measurements apply only to my July 2026 setup.

| Tool | 1. Ambient | 2. Prior state | 3. Both monitors | 4. Exact destination | 5. Boundaries | Later review | 6. Export |
|---|---|---|---|---|---|---|---|
| Screenpipe 2.5.132 | Yes (measured) | Partial (raw frames) | Partial (measured) | Partial (measured) | Partial (event triggers) | ? | Partial (raw data) |
| NAPsack 0.1.3 | Yes | Yes (active display) | No (active display only) | Partial | Yes (bursts) | ? | Partial (JSONL) |
| OpenCUA tool | No (declared tasks) | Yes (documented) | No (one display on macOS) | Partial | Partial (within tasks) | Yes (annotator review) | Yes (trajectories) |
| Scribe Autocapture | Partial (approved apps) | ? | ? | ? | Yes | Partial (guide level) | No (guide formats) |
| Mimica | Yes (vendor claim) | ? | ? | ? | Yes (vendor claim) | ? | Partial (spreadsheet export) |
| Celonis Task Mining | Partial (Windows only) | ? | Partial (all-desktop screenshots) | Partial (event attributes) | Partial | ? | Yes (event tables) |
| UiPath Task Mining | No (known tasks) | ? | ? | Partial (export fields) | Partial | Yes (review) | Yes (raw export) |
| Skan | Partial (vendor claim) | ? | ? | ? | Yes (vendor claim) | Partial | ? |
| My custom stack | Partial (controlled runs) | Yes (measured) | Partial (measured) | Partial (measured) | No | No | No |

Several tools cover ambient capture, boundaries, and export. The unresolved questions cluster around prior state, exact destination, and dependable automatic assembly. My custom stack built much of the capture layer, but not the parts that made the data usable.

## The strongest objection, conceded

The strongest objection is simple. I missed task mining, then overbuilt a benchmark. Enterprise products already capture, group, and export desktop activity. Screenpipe may already have recorded enough raw evidence for an extractor to reconstruct the records. Stopping at 12 of 30 checkpoints shows an over-scoped protocol, not a missing product category.

Most of that is right. The diagnostic measured my over-scoped protocol, not the limits of Screenpipe's recording.

But neither of the strongest enterprise counterexamples was usable in my setup. Mimica canceled the one-person evaluation, and Celonis only runs on Windows. I also found no public material showing a self-serve tool that finds meaningful moves, preserves prior state, names the exact destination, and exports the resulting records in order. A dependable product would also need a fast way to correct failures. That may be an undocumented enterprise capability or a thin layer on an existing platform.

## A first version can be cobbled together

The first experiment never required an automatic collection product. I had made one a prerequisite anyway. I could label the first records by hand and run the prediction test. If the prediction is useful, or if manual labeling becomes the bottleneck, Screenpipe can remain the recorder while a small offline script finds possible navigation moments, selects the latest usable prior frame, drafts a destination from later evidence, and writes the records to a table.

I have not validated this plan, and I would check every proposed record by hand. The script skips live suggestions, a review interface, reliable boundaries, perfect monitor synchronization, and stable identification of every control. Its job is to reduce assembly to reviewing proposed records. If it becomes another project, I will keep labeling the records by hand.

Low friction means install, record, and review, not querying a database, aligning clocks, or debugging monitor geometry.

## What a dependable version still needs

The stalled acquisition ladder also changed what I would require from a product. A dependable version still has to:

1. notice meaningful moves while I work;
2. select the screen state from before each move;
3. identify the target from macOS interface labels, webpage structure, and pixels;
4. match screen, click, app, and browser records across both monitors;
5. flag missing or conflicting evidence;
6. make corrections fast; and
7. export corrected records consistently.

Enterprise systems show that much of this machinery already exists, so I cannot call the category new. But neither Mimica nor Celonis was usable in my setup, and public material did not settle the original automatic-assembly questions or the later correction path. For this experiment, a dependable version would still require a custom layer.

## Why this matters and what happens next

The idea came from a conversation with [Niyant](https://handsdiff.github.io/phase-1) about personal AI that learns from how you work. I proposed using Tab, or one of three hotkeys, to route me to the likely next place. He first called the idea vague, then said the narrowed version aligned overall. He also warned that cycling among a few apps could look useful without understanding anything. That is why I care about the exact place, not the app, and useful predictions, not raw accuracy. The longer idea is in [my Tab note](https://dylanduyvu.github.io/00-inbox/tab-could-autocomplete-the-next-computer-action) and [experiment plan](https://dylanduyvu.github.io/20-syntheses/computer-use-nap-shadow-experiment).

Still, [A Click Ahead](https://arxiv.org/abs/2309.12170) shows that a simpler version can work under easier conditions. Its conventional recurrent neural network, not a large language model, chose the exact next action correctly 34.63 percent of the time from 442 known actions. My destinations are more specific and not confined to a fixed list, so I read the result as precedent, not a forecast.

So the corrected sequence is short. Run the manual pilot. Decide whether the predictions are useful. Use the offline script only if it actually reduces the labeling work. Build, or buy, the dependable version only if the prediction earns it.

If you have built something that already produces these navigation records, or you are working on it, I want to see it. The automatic-assembly requirements above are the test. dylanduyvu@gmail.com.
