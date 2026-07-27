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
Remaining before final publication: Dylan's personal read, including a per-cell check of the comparison table; final link verification after later edits.
%%

# The Missing Step Between Recording and Prediction

---

*This article is a brief detour into [Niyant](https://substack.com/@handsdiff)'s [personalization thesis](https://dylanduyvu.github.io/20-syntheses/niyant-personal-ai-thesis-study-guide).*

*[Associated research](https://dylanduyvu.github.io/30-projects/computer-use-nap-fidelity-research-2026-07-26) | [Revision history](https://github.com/dylanduyvu/dylanduyvu.github.io/commits/main/20-syntheses/day-0-took-three-days.md) | [Disclosure](https://dylanvu.substack.com/about)*

---

*I wanted to test whether an LLM could predict the exact app, page, document, task, or field I would navigate to next, so pressing the Tab key could take me there. But the prediction test never started. Instead, I spent three days building a stricter capture system before testing whether Screenpipe's existing recordings could be turned into the dataset.*

I needed a personal dataset that paired what was on my screens before each move with my exact next destination. I also needed to approve or correct each proposed destination. Screenpipe may already have recorded enough raw evidence. But it did not give me an out-of-the-box workflow that assembled that evidence into records I could review and export. I built a new capture stack before testing a simple converter.

## Day 0 took three days

I planned a five-day project: one setup day followed by four experiment days.

- **Day 0:** Configure Screenpipe (or research relevant tools) and define how recorded work would become navigation records.
- **Day 1:** Record a day of work and create the first day of history.
- **Day 2:** On the same navigation events, compare the LLM seeing only my current screen against the LLM seeing that screen plus Day 1 history.
- **Day 3:** Repeat with zero, one, and two days of history.
- **Day 4:** Repeat with zero, one, two, and three days of history.

If history made the top-three exact-destination guesses qualitatively more useful, I would build a live public demo where pressing Tab took me to the most likely destination.

Day 0 was supposed to be setup. Three days later, it was still not complete.

I audited [Screenpipe](https://github.com/screenpipe/screenpipe), which runs in the background and records screen and input activity. I added [NAPsack](https://github.com/GeneralUserModels/napsack), which groups nearby clicks and keystrokes into short activity segments and generates a plain-English description of each one. But I had to patch its display assignment because my two-monitor setup places the second display above the main one. Because I could not trust the screenshot Screenpipe attached to a click as evidence of what I had seen before it, I treated the problem as capture. I built a new layer from Hammerspoon (a macOS automation tool), ScreenCaptureKit (Apple's screen recording framework), and a browser extension.

Then I ran a 30-action diagnostic to see whether those pieces worked together across the kinds of navigation I make. I spent most of the day patching failures as it exposed one edge case after another, then paused with only 12 of the 30 checkpoints accepted. Even in those accepted checkpoints, the two monitor streams were not reliably in sync.

The stack worked during an initial controlled run and produced verified checkpoints. But it could not assemble enough navigation records for me to verify and start the prediction test.

## What the dataset had to contain

The dataset had to keep the navigation records in the order they happened. Each record needed four parts:

1. what was on my screens immediately before I moved;
2. the exact place I went next;
3. evidence that I arrived there;
4. my approval or correction of the proposed destination.

For example, suppose I finished reading an article on my Arc browser, then moved to the message box in one Codex task. The record needed to show the article before I moved, name that specific task and field rather than just "Codex," attach evidence that I arrived there, and include my verdict.

For the prediction test to mean anything, the timing and destination label had to be right. A screenshot taken after I moved could give the LLM the answer, while a bad label could make it impossible to tell whether its prediction was right.

## The missing step was converting the recording

Turning recorded activity into the dataset required seven jobs:

1. run quietly while I worked across native apps and browsers;
2. preserve what was on screen strictly before each move;
3. keep correctly attributed evidence from both monitors for every record;
4. name the exact destination in one consistent field, whether it is an app, window, page, document, task, input field, link, or button;
5. propose meaningful boundaries between moves, instead of treating every keystroke as its own record;
6. show enough evidence that a person can approve, fix, reject, or park each record; and
7. export the approved records in time order, in a format I could give to the LLM.

The recorder handles the first job and supplies raw evidence for jobs two through four. But jobs two through five still require assembly. The system must choose the safe prior state, join the monitor evidence, normalize the destination, and decide which inputs belong to one move. The sixth job lets me verify the proposed record, and the seventh saves the verified dataset.

Screenpipe covered the first job and supplied much of the raw evidence needed for the rest. In my test, version 2.5.132 captured both monitors, inputs, app and window changes, web addresses, screenshot text, and the accessibility tree, which is how macOS describes on-screen controls to assistive software. Its [current architecture documentation](https://docs.screenpipe.com/architecture) explains that events such as clicks, app switches, scrolls, typing pauses, and idle periods trigger screenshots instead of fixed-rate video.

But the screenshot Screenpipe linked to a click was not guaranteed to show the state before the click. In one 50-minute session, 76 of 164 click-linked screenshots were captured after the click.

For clicks, the raw event still carried its own timestamp and coordinates. An extractor could ignore the linked screenshot, match the event to the most recent earlier frame from each monitor, and use later frames to propose the destination label. That is the assembly workflow I wanted. The system would propose a record, and I would approve, correct, reject, or park it.

I did not test that path over the weekend. So I still do not know how often Screenpipe has a recent enough earlier frame or enough evidence to name the exact destination across clicks, keyboard navigation, app switches, and both monitors.

The full measurements are in [my audit](https://dylanduyvu.github.io/50-sources/screenpipe-live-capture-audit-2026-07-23). Screenpipe's current documentation describes a fuller accessibility tree and more input methods than I observed, so these numbers apply only to my version and setup.

## Why my custom capture system stayed fragile

The 30 actions were a coverage check, not training data or a prediction test. The initial controlled run did not establish that the stack worked across native controls, ordinary and dynamic webpages, focus and app changes, keyboard navigation, and both monitors. I needed a broader check before trusting several days of recordings.

That broader check was fragile for five reasons:

- **The protocol required perfect choreography.** I had to prepare the application, mark ready, freeze both displays, perform one action, mark completion, and export browser evidence when relevant. An extra click, missed marker, or delayed input could contaminate the interval.

- **The evidence did not share one clock or identifier.** The system had to join input events, separate display streams, macOS Accessibility records, browser events, and an action ledger. The browser did not know the Mac automation layer's action ID, so the join depended on timestamps, coordinates, window and document identity, and a narrow interval.

- **The interfaces changed during capture.** Webpages responded to JavaScript events, focus arrived late, and browser tabs, split views, and temporary windows exposed different identities. A static monitor might not emit a fresh frame when the other monitor changed.

- **Exact targets had no shared representation.** macOS might return the intended button, an image inside it, a generic container, an unnamed field, or nothing useful. Browser structure was more precise for webpages but could not describe native controls or browser chrome. Screenshots and coordinates filled gaps but required another inference step.

- **The validator was still changing.** The diagnostic exposed cases we had not anticipated. Fixing the validator helped preserve genuine evidence, but one frozen set of rules no longer judged every checkpoint. A formal test would have required implementing the remaining cases, freezing the validator, and running it again.

Checking the records first was reasonable. Otherwise, a wrong prediction could reflect my behavior, the LLM, the action boundary, the destination label, or a screenshot that already showed the answer.

But I was automating capture and conversion at the same time. The diagnostic exposed the cost of that custom stack. It did not establish that Screenpipe's existing recording was insufficient.

## The closest tools already form a product category

I first compared research tools and self-serve products. NAPsack groups nearby clicks and keystrokes into short activity segments and describes each one in plain language. But its [published task](https://arxiv.org/abs/2603.05923) predicts those descriptions rather than exact destinations. [OpenCUA](https://arxiv.org/abs/2508.09123) pairs actions with the last distinct prior screenshot, but collects declared demonstrations; its [macOS setup](https://agentnet-tool.xlang.ai/quickstart/mac_quick_start/) records one display. [Scribe](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) discovers workflows across approved business apps and lets users review, edit, publish, or discard them. Its documented exports are finished guides, including [Markdown](https://support.scribehow.com/hc/en-us/articles/9254133020189-Exporting-a-Scribe-to-Markdown), rather than raw prediction records.

Then I looked at enterprise task mining, which records work to find repeated business processes. [Mimica](https://www.mimica.ai/product) advertises passive desktop capture, task discovery, step-level screenshots, spreadsheet export, and a [native macOS recorder](https://www.mimica.ai/articles/introducing-mimica-task-mining-for-macos). Its signup rejected my personal email with "This email is not enabled, please contact your admin." On the morning of my scheduled demo, Mimica canceled because my one-person request did not fit its focus on larger enterprises.

![Mimica canceled my scheduled demo after deciding that my one-person request did not fit its focus on larger enterprise organizations.](../70-attachments/mimica-demo-canceled-enterprise-focus-2026-07-27.png)

[Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) is another enterprise counterexample. It documents background capture, raw and labeled event tables, and screenshots of [all attached desktops](https://docs.celonis.com/en/event-processing-rules.html), but runs only on Windows. [Skan](https://www.skan.ai/process-discovery-and-analysis) and [UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) are in the same category. UiPath's earlier [unassisted mode](https://docs.uipath.com/task-mining/automation-suite/2024.10/user-guide/unassisted-task-mining-analysis-guide) found workflows across monitors before it [was removed](https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/november-2024) from the cloud in December 2025.

So the category exists, but not as an option for this experiment. Mimica would not take the one-person evaluation, and Celonis was Windows-only. Four narrower questions also stayed unresolved in the public material. Is the screenshot from before the move? Does the output name the exact native-app or browser destination? Can the user fix each answer? Can approved records be exported in time order? For enterprise systems, these may be undocumented capabilities rather than gaps.

The table maps documented capabilities and my tests to the seven jobs. It does not mean that a product was usable in my setup. A question mark means the material did not answer. Vendor rows are vendor claims, while local measurements apply only to my July 2026 setup.

| Tool | 1. Ambient | 2. Prior state | 3. Both monitors | 4. Exact destination | 5. Boundaries | 6. Record review | 7. Export |
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

The table shows that recording was not the main gap. Screenpipe may already supply enough raw evidence, and the enterprise tools go further. My custom stack added more capture without finishing the conversion.

## I had not shown that a new recorder was necessary

Screenpipe already recorded both monitors and raw events. A screenshot linked after a click did not mean that every earlier frame was missing. But I built a new capture stack before testing whether those earlier frames could be relinked.

At minimum, I had not shown that the new capture stack was necessary. Stopping at 12 of 30 checkpoints shows that my custom protocol was over-scoped. It does not show that Screenpipe's existing recording could not support the dataset.

The remaining gap is narrower. I still did not find a self-serve Mac tool that assembled raw activity into proposed exact-destination records, let me correct each one, and exported the accepted records in order. Mimica may do much of this, but it canceled my one-person evaluation. Celonis also goes further than Screenpipe, but it only runs on Windows. The missing piece may be a thin adapter or an undocumented enterprise capability rather than a new product category.

## A small converter may be enough

The next test is whether a small offline script can turn Screenpipe's raw history into the records I need. It would find possible navigation moments, select the latest usable earlier frame, draft a destination from later evidence, and write each proposed record to a table.

I would still approve, correct, or reject every proposal. That verification is part of the target workflow. The automated work is finding the events, joining the evidence, and drafting the destination before I review it.

I have not validated this plan. The script can skip live suggestions, a custom review interface, perfect monitor synchronization, and stable identification of every control. But it must reduce the work to reviewing proposed records. Without it, I would have to query a database, align events, choose frames, and construct every record myself. That is manual assembly, not verification.

## What a dependable conversion layer still needs

A dependable version still has to:

1. notice meaningful moves while I work;
2. select evidence that is safely before each move;
3. identify the target from macOS interface labels, webpage structure, and pixels;
4. match screen, click, app, and browser records across both monitors;
5. flag missing or conflicting evidence;
6. make corrections fast; and
7. export corrected records consistently.

Enterprise systems show that much of this machinery already exists, so I cannot call the category new. But neither Mimica nor Celonis was usable in my setup, and their public material did not establish the complete conversion and review workflow for my Mac. Until the Screenpipe path is validated or another option becomes usable, a dependable version still requires custom work.

## Why this matters and what happens next

The idea came from a conversation with [Niyant](https://handsdiff.github.io/phase-1) about personal AI that learns from how you work. I proposed using Tab, or one of three hotkeys, to route me to the likely next place. He first called the idea vague, then said the narrowed version aligned overall. He also warned that cycling among a few apps could look useful without understanding anything. That is why I care about the exact place, not the app, and useful predictions, not raw accuracy. The longer idea is in [my Tab note](https://dylanduyvu.github.io/00-inbox/tab-could-autocomplete-the-next-computer-action) and [experiment plan](https://dylanduyvu.github.io/20-syntheses/computer-use-nap-shadow-experiment).

Still, [A Click Ahead](https://arxiv.org/abs/2309.12170) shows that a simpler version can work under easier conditions. Its conventional recurrent neural network, not a large language model, chose the exact next action correctly 34.63 percent of the time from 442 known actions. My destinations are more specific and not confined to a fixed list, so I read the result as precedent, not a forecast.

So the corrected sequence is short. Test the Screenpipe converter first. Improve capture only where the existing recording genuinely lacks evidence. Verify the resulting records. Then run the LLM experiment and build a live demo only if the predictions feel useful.

If you have built something that already produces these navigation records, or you are working on it, I want to see it. The seven jobs above are the test. dylanduyvu@gmail.com.
