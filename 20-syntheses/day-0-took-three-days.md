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
Remaining before final publication: Dylan's personal read, including a per-cell check of the comparison table; final link verification after later edits.
%%

# The Missing Step Between Recording and Prediction

---

*This article is a brief detour into [Niyant](https://substack.com/@handsdiff)'s [personalization thesis](https://dylanduyvu.github.io/20-syntheses/niyant-personal-ai-thesis-study-guide).*

*[Associated research](https://dylanduyvu.github.io/30-projects/computer-use-nap-fidelity-research-2026-07-26) | [Revision history](https://github.com/dylanduyvu/dylanduyvu.github.io/commits/main/20-syntheses/day-0-took-three-days.md) | [Disclosure](https://dylanvu.substack.com/about)*

---

*I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days trying to automatically assemble the dataset it needed.*

I needed a personal dataset that paired what was on my screens before each move with my exact next destination. Then I needed to verify every row. The tools I tested could record my screens, clicks, app switches, and browser activity. But no product I could use turned a normal workday into that dataset. This post separates what I can reuse now from what a dependable system would still need.

## Day 0 took three days

I planned a five-day project: one setup day followed by four experiment days.

- **Day 0:** Configure Screenpipe and define how recorded work would become dataset rows.
- **Day 1:** Record a day of work and create the first day of history.
- **Day 2:** On the same navigation events, compare the LLM seeing only my current screen against the LLM seeing that screen plus Day 1 history.
- **Day 3:** Repeat with zero, one, and two days of history.
- **Day 4:** Repeat with zero, one, two, and three days of history.

If history made the top-three exact-destination guesses qualitatively more useful, I would build a live public demo where pressing Tab took me to the most likely destination.

Day 0 was supposed to be setup. Three days later, it was still not complete.

I audited [Screenpipe](https://github.com/screenpipe/screenpipe), which records screens and inputs continuously. I added [NAPsack](https://github.com/GeneralUserModels/napsack), which groups activity into captioned bursts, but patched its display assignment because my second monitor sits above my main one. I then built a capture layer from Hammerspoon (a macOS automation tool), ScreenCaptureKit (Apple's screen recording framework), and a browser extension. A 30-action diagnostic stopped at 12 accepted checkpoints. Even then, the monitors were still out of sync.

The stack worked during an initial controlled run and produced verified checkpoints. But it could not automatically assemble enough verified navigation records to start the prediction test.

## What one dataset row needed

One usable row has four parts:

1. a screenshot or record of what I could see before I moved;
2. the exact place I went next;
3. later evidence showing I really went there;
4. my approval or correction of that answer.

A useful dataset also keeps the approved rows in the order they happened.

Suppose I finish an article in Arc, then go to the message box in one Codex task. The row must show the article before I moved, name that task and field rather than just "Codex," attach later evidence, and carry my verdict.

Two requirements stay strict. The observation must come from strictly before the move, and the recorded destination must be correct. That is because a post-click screenshot can reveal the answer, while a wrong destination makes the score meaningless.

The rest can be loose at first. I do not need perfectly synchronized monitors, a tamper-proof record, or automatic identification of every control. OpenCUA's [collection method](https://arxiv.org/abs/2508.09123) also pairs each action with the last visually distinct screen from before it. The other studies are in [a separate research note](https://dylanduyvu.github.io/30-projects/computer-use-nap-fidelity-research-2026-07-26).

## The recorder is only one part of the tool

The tool I wanted has seven jobs:

1. run quietly while I worked across native apps and browsers;
2. preserve what was on screen strictly before each move;
3. keep correctly attributed evidence from both monitors when a move crosses displays;
4. name the exact destination in one consistent field, whether it is an app, window, page, document, task, input field, link, or button;
5. propose meaningful boundaries between moves, instead of treating every keystroke as its own row;
6. show enough evidence that a person can approve, fix, reject, or park each row; and
7. export the approved rows in time order, in a format a model can train on.

A continuous recording covers the first job and supplies screen, input, app, and browser evidence for the rest. But it does not do the rest.

Screenpipe shows the difference. Version 2.5.132 captured both monitors, inputs, app and window changes, web addresses, screenshot text, and the accessibility tree, which is how macOS describes on-screen controls to assistive software.

But it still did not produce the dataset. In one 50-minute session, 76 of 164 click-linked screenshots came after the click, so the frame was not guaranteed to show the prior state. The full measurements are in [my audit](https://dylanduyvu.github.io/50-sources/screenpipe-live-capture-audit-2026-07-23). Screenpipe's [current documentation](https://docs.screenpipe.com/architecture) describes a fuller accessibility tree and more input methods than I observed, so these numbers apply only to my version and setup.

## Why the capture system stayed fragile

The 30 actions were a coverage check, not training data or a prediction test. The initial controlled run did not establish that the stack worked across native controls, ordinary and dynamic webpages, focus and app changes, keyboard navigation, and both monitors. I needed a broader check before trusting several days of recordings.

That broader check was fragile for five reasons:

- **The protocol required perfect choreography.** I had to prepare the application, mark ready, freeze both displays, perform one action, mark completion, and export browser evidence when relevant. An extra click, missed marker, or delayed input could contaminate the interval.

- **The evidence did not share one clock or identifier.** The system had to join input events, separate display streams, macOS Accessibility records, browser events, and an action ledger. The browser did not know the Mac automation layer's action ID, so the join depended on timestamps, coordinates, window and document identity, and a narrow interval.

- **The interfaces changed during capture.** Webpages responded to JavaScript events, focus arrived late, and browser tabs, split views, and temporary windows exposed different identities. A static monitor might not emit a fresh frame when the other monitor changed.

- **Exact targets had no shared representation.** macOS might return the intended button, an image inside it, a generic container, an unnamed field, or nothing useful. Browser structure was more precise for webpages but could not describe native controls or browser chrome. Screenshots and coordinates filled gaps but required another inference step.

- **The validator was still changing.** The diagnostic exposed cases we had not anticipated. Fixing the validator helped preserve genuine evidence, but one frozen set of rules no longer judged every checkpoint. A formal test would have required implementing the remaining cases, freezing the validator, and running it again.

Checking the rows first was reasonable. Otherwise, a wrong prediction could reflect my behavior, the model, the action boundary, the destination label, or a screenshot that already showed the answer. But requiring automatic rows before trying a small manually verified set was the sequencing mistake.

A person could infer what happened from imperfect records. Automation had to handle missing evidence, align streams, normalize native and browser targets, detect action boundaries, and send uncertain rows to me. By then, I was building that product while trying to run the experiment.

## The closest tools already form a product category

I first compared research tools and self-serve products. NAPsack groups passive activity into captioned bursts, but its [published task](https://arxiv.org/abs/2603.05923) predicts plain-language task descriptions rather than exact destinations. [OpenCUA](https://arxiv.org/abs/2508.09123) pairs actions with the last distinct prior screenshot, but collects declared demonstrations; its [macOS setup](https://agentnet-tool.xlang.ai/quickstart/mac_quick_start/) records one display. [Scribe](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) discovers workflows across approved business apps and lets users review, edit, publish, or discard them. Its documented exports are finished guides, including [Markdown](https://support.scribehow.com/hc/en-us/articles/9254133020189-Exporting-a-Scribe-to-Markdown), rather than raw prediction rows.

Then I looked at enterprise task mining, which records work to find repeated business processes. [Mimica](https://www.mimica.ai/product) advertises passive desktop capture, task discovery, step-level screenshots, spreadsheet export, and a [native macOS recorder](https://www.mimica.ai/articles/introducing-mimica-task-mining-for-macos). Its signup rejected my personal email with "This email is not enabled, please contact your admin." On the morning of my scheduled demo, Mimica canceled because my one-person request did not fit its focus on larger enterprises.

![Mimica canceled my scheduled demo after deciding that my one-person request did not fit its focus on larger enterprise organizations.](../70-attachments/mimica-demo-canceled-enterprise-focus-2026-07-27.png)

[Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) is another enterprise counterexample. It documents background capture, raw and labeled event tables, and screenshots of [all attached desktops](https://docs.celonis.com/en/event-processing-rules.html), but runs only on Windows. [Skan](https://www.skan.ai/process-discovery-and-analysis) and [UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) are in the same category. UiPath's earlier [unassisted mode](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/unassisted-task-mining-analysis-guide) found workflows across monitors before it [was removed](https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/november-2024) from the cloud in December 2025.

So the category exists, but not as an option for this experiment. Mimica would not take the one-person evaluation, and Celonis was Windows-only. Four narrower questions also stayed unresolved in the public material. Is the screenshot from before the move? Does the output name the exact native-app or browser destination? Can the user fix each answer? Can approved rows be exported in time order? For enterprise systems, these may be undocumented capabilities rather than gaps.

The table maps documented capabilities and my tests to the seven jobs. It does not mean that a product was usable in my setup. A question mark means the material did not answer. Vendor rows are vendor claims, while local measurements apply only to my July 2026 setup.

| Tool | 1. Ambient | 2. Prior state | 3. Both monitors | 4. Exact destination | 5. Boundaries | 6. Row review | 7. Export |
|---|---|---|---|---|---|---|---|
| Screenpipe 2.5.132 | Yes (measured) | No (measured) | Partial (measured) | Partial (measured) | ? | ? | Partial (raw data) |
| NAPsack 0.1.3 | Yes | Yes (active display) | No (active display only) | Partial | Yes (bursts) | ? | Partial (JSONL) |
| OpenCUA tool | No (declared tasks) | Yes (documented) | No (one display on macOS) | Partial | Partial (within tasks) | Yes (annotator review) | Yes (trajectories) |
| Scribe Autocapture | Partial (approved apps) | ? | ? | ? | Yes | Partial (guide level) | No (guide formats) |
| Mimica | Yes (vendor claim) | ? | ? | ? | Yes (vendor claim) | ? | Partial (spreadsheet export) |
| Celonis Task Mining | Partial (Windows only) | ? | Partial (all-desktop screenshots) | Partial (event attributes) | Partial | ? | Yes (event tables) |
| UiPath Task Mining | No (known tasks) | ? | ? | Partial (export fields) | Partial | Yes (review) | Yes (raw export) |
| Skan | Partial (vendor claim) | ? | ? | ? | Yes (vendor claim) | Partial | ? |
| My custom stack | Partial (controlled runs) | Yes (measured) | Partial (measured) | Partial (measured) | No | No | No |

Several tools cover ambient capture, boundaries, and export. The questions cluster around prior state, exact destination, and row review. My custom stack is the concession in one row: I built much of the capture layer, but not the parts that made the data usable.

## The strongest objection, conceded

The strongest objection is simple. I missed task mining, then overbuilt a benchmark. Enterprise products already capture, group, and export desktop activity. Screenpipe recorded enough screen and input history to attempt a manual test. Stopping at 12 of 30 checkpoints shows an over-scoped protocol, not a missing product category.

Most of that is right. Several tools capture work, discover workflows, and export records. I wrongly treated an automatic dataset as a prerequisite for a small test.

But neither of the strongest enterprise counterexamples was usable in my setup. Mimica canceled the one-person evaluation, and Celonis only runs on Windows. I also found no public material showing a self-serve tool that preserves prior state, names the exact destination, supports row correction, and exports accepted rows in order. That may be an undocumented enterprise capability or a thin layer on an existing platform.

## A first version can be cobbled together

So the first experiment does not need that product. Screenpipe can remain the recorder, while a small offline script finds possible navigation moments, selects the latest usable prior frame, drafts a destination from later evidence, and writes the rows to a table. I have not validated this plan, and I would check every row by hand.

The script skips live suggestions, a review interface, reliable boundaries, perfect monitor synchronization, and stable identification of every control. Its only job is to reduce labeling work. If it becomes another project, I will label the rows by hand.

Low friction means install, record, and review, not querying a database, aligning clocks, or debugging monitor geometry.

## What a dependable version still needs

A dependable automatic version still has to:

1. notice meaningful moves while I work;
2. identify the target from macOS interface labels, webpage structure, and pixels;
3. match screen, click, app, and browser records across both monitors;
4. flag missing or conflicting evidence;
5. make corrections fast; and
6. export corrected rows consistently.

Enterprise systems show that much of this machinery already exists, so I cannot call the category new. But neither Mimica nor Celonis was usable in my setup, and public material did not establish the four requirements above. For this experiment, a dependable version would still require a custom layer.

## Why this matters and what happens next

The idea came from a conversation with [Niyant](https://handsdiff.github.io/phase-1) about personal AI that learns from how you work. I proposed using Tab, or one of three hotkeys, to route me to the likely next place. He first called the idea vague, then said the narrowed version aligned overall. He also warned that cycling among a few apps could look useful without understanding anything. That is why I care about the exact place, not the app, and useful predictions, not raw accuracy. The longer idea is in [my Tab note](https://dylanduyvu.github.io/00-inbox/tab-could-autocomplete-the-next-computer-action) and [experiment plan](https://dylanduyvu.github.io/20-syntheses/computer-use-nap-shadow-experiment).

Still, [A Click Ahead](https://arxiv.org/abs/2309.12170) shows that a simpler version can work under easier conditions. Its conventional recurrent neural network, not a large language model, chose the exact next action correctly 34.63 percent of the time from 442 known actions. My destinations are more specific and not confined to a fixed list, so I read the result as precedent, not a forecast.

So the corrected sequence is short. Run the manual pilot. Decide whether the predictions are useful. Use the offline script only if it actually reduces the labeling work. Build, or buy, the dependable version only if the prediction earns it.

If you have built something that already produces these dataset rows, or you are working on it, I want to see it. The seven jobs above are the test. dylanduyvu@gmail.com.
