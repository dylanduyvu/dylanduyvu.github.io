---
type: blogpost
status: draft
created: 2026-07-26
updated: 2026-07-26
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
Remaining before final publication: Dylan ownership pass; naive-reader full read; final lint (colon audit, overclaim class search, belonging pass, register re-scan of any paragraph added after this draft); Mimica demo and Celonis follow-up; final link verification.
%%

# Day 0 Took Three Days

*I wanted to test whether a model could predict where I would go next on my computer. The hard part was turning normal work into correctly ordered, verified examples, and learning how much of that rigor the first test actually needed.*

I wanted to test whether a model could predict where I would navigate next on my computer. That test needed examples of what I saw before each move and where I went. The recording tools I tried captured most of the raw material. I could not find one that assembled those examples from my ordinary work.

## Day 0 took three days

I planned a four-day experiment. Day 0 was recorder setup. Day 0 took three days.

The plan was simple. Record my normal work. Then replay the moments right before I navigated somewhere, ask a model for its top three guesses about where I would go, and judge whether the guesses felt useful enough to justify a live demo bound to the Tab key.

Prediction never started. The three days went to the data.

I audited [Screenpipe](https://github.com/screenpipe/screenpipe), an open source tool that records your screen and inputs continuously. I added [NAPsack](https://github.com/GeneralUserModels/napsack), a research recorder that groups activity into bursts and captions them, and patched it because my second monitor sits above my main one at negative screen coordinates, and clicks there were being assigned to the wrong display. I then built a custom capture layer out of Hammerspoon (a macOS automation tool), ScreenCaptureKit (Apple's screen recording framework), and a browser extension. That layer passed a six-action smoke test. A supposedly simple 30-action diagnostic then consumed most of a day and stopped at 12 accepted checkpoints. In five of those 12, the paired screenshots of my two displays were captured more than one second apart. The worst gap was 3.765 seconds.

All of that proved higher-fidelity recording was technically obtainable. None of it proved the place I would navigate next was predictable.

Part of the delay was a real gap in the tools. Part of it was my decision to build a production-grade pipeline for a first qualitative test. This post separates the two.

## The example I actually needed

One usable example has five parts:

1. a screenshot or record of what I could see before I moved;
2. the exact place I went next;
3. later evidence showing I really went there;
4. my approval or correction of that answer; and
5. the approved examples saved in the order they happened.

Here is a concrete one. I reach the end of an article in Arc, my browser. The next place I go is one specific task inside Codex, and specifically its message box. The example must record what the end of that article looked like, name the destination as that exact task and field rather than just "Codex," attach the later evidence confirming the move, and carry my verdict that the label is right.

Two requirements do not relax, even for a small pilot. The observation must come from strictly before the move. The recorded destination must be correct. The first matters because a screenshot taken after I click can show the very answer the model is supposed to predict. The second matters because a prediction test scored against wrong answers measures nothing.

Everything else can be loose at first. I do not need perfectly synchronized captures of both monitors, a tamper-proof record of where every file came from, or automatic identification of every on-screen control. I checked this against [the published research on how much data quality these systems need](https://dylanduyvu.github.io/30-projects/computer-use-nap-fidelity-research-2026-07-26). The two requirements above are the ones the literature treats as non-negotiable too.

## The recorder is only one part of the tool

The tool I wanted has seven jobs:

1. run quietly during ordinary work, across native apps and browsers;
2. preserve what was on screen strictly before each move;
3. keep correctly attributed evidence from both monitors when a move crosses displays;
4. name the exact destination in one consistent field, whether it is an app, window, page, document, task, input field, link, or button;
5. propose meaningful boundaries between moves, instead of treating every keystroke as its own example;
6. show enough evidence that a person can approve, fix, reject, or park each example; and
7. export the approved examples in time order, in a format a model can train on.

A continuous recording covers the first job and supplies raw material for the rest. It does not do the rest.

Screenpipe is the concrete case. The version I tested, 2.5.132 in July 2026, captured a lot on my Mac. Screenshots of both monitors. Clicks, keys, and scrolls. App and window changes. Web addresses. Text read out of the screenshots, and the structured descriptions of on-screen controls that macOS exposes for assistive software, called the accessibility tree.

It still did not produce my examples. In one 50-minute session of natural work, 76 of the 164 screenshots Screenpipe linked to clicks were captured after the click. The linked frame was not a guaranteed before-frame, which breaks the first requirement. The full measurements are in [my audit](https://dylanduyvu.github.io/50-sources/screenpipe-live-capture-audit-2026-07-23). Screenpipe's current documentation claims broader capture than the build I measured, including a fuller accessibility tree and more input methods. Every number here is scoped to the version and setup I tested.

## The closest tools already form a product category

I first compared against research and prosumer tools. NAPsack records passively, groups activity into bursts, and has a vision model write captions describing what happened; its authors train next-action predictors on the result, though their [published task](https://arxiv.org/abs/2603.05923) predicts task-level descriptions in plain language, a different target than my exact destinations. [OpenCUA](https://arxiv.org/abs/2508.09123) collects human task demonstrations and pairs every action with the last distinct screenshot from before it, exactly the discipline my first requirement demands. But its tasks are deliberate demonstrations with a declared start and stop, and its [macOS setup](https://agentnet-tool.xlang.ai/quickstart/mac_quick_start/) records one display through OBS, a free screen recording app. [Scribe](https://support.scribehow.com/hc/en-us/articles/30708953411229-Using-Autocapture) discovers workflows in the background across an approved list of business apps and lets you review, edit, publish, or discard the result. Its output is a how-to guide, not training data.

Then I looked at enterprise task mining, and the comparison got harder. [Mimica](https://www.mimica.ai/product) advertises passive capture of clicks, keystrokes, and application interactions across desktop apps, automatic task discovery, step-level screenshots, and export to spreadsheet files, with a [native macOS recorder](https://www.mimica.ai/articles/introducing-mimica-task-mining-for-macos) announced July 22, 2026. It is sold as an organization-wide process-intelligence system. Its [proof of concept](https://www.mimica.ai/contact) runs through sales, and when I tried the public registration page with my personal email, the response was "This email is not enabled, please contact your admin." [Celonis Task Mining](https://docs.celonis.com/en/task-mining.html) documents background capture, raw and labeled event tables, and a screenshot mode covering [all attached desktops](https://docs.celonis.com/en/event-processing-rules.html). It runs on Windows only. [Skan](https://www.skan.ai/process-discovery-and-analysis) and [current UiPath Task Mining](https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/introduction-as) round out the category, and UiPath's earlier unassisted mode did ambient discovery across monitors before it [was removed](https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/november-2024) from their cloud in December 2025.

So the honest framing is not that a category is missing. It is that four narrower questions stayed unresolved in everything I could read publicly. Does the saved screenshot show what the user saw before the move, or after it? Does the output name the exact destination, down to a field or button, across native apps and browsers? Can the user approve or fix that answer on each individual example? And can the approved examples come back out in time order as reusable data? For the enterprise systems, those may be demo questions rather than gaps. The public pages do not say.

## The strongest objection, conceded

The strongest objection to this post goes like this. You did not discover a missing product category. You missed task mining, then overbuilt a benchmark. Mimica claims passive cross-app capture and export on macOS. Celonis documents granular events and all-desktop screenshots. Screenpipe already captured enough raw material for a manual test. Stopping at 12 of 30 checkpoints proves the protocol was over-scoped, not that a product is missing.

Most of that is right, and I concede it. Several tools can capture ordinary work, discover workflows, or export structured traces. I also treated an automatic, production-grade dataset as a prerequisite for a small qualitative experiment. That was a sequencing mistake, and it cost most of the three days.

What survives the concession is narrower. The enterprise systems are not self-serve for a personal experiment; Mimica would not enable my account without an administrator. And no public material I reviewed shows one tool saving what the user saw before each move, naming the exact destination, and letting the user approve or fix every answer before export. That may be an undocumented capability, or an adapter someone could build on an existing platform, rather than a new category. I have a vendor demo booked to find out.

## A first version can be cobbled together

The first experiment does not need that product to exist. Screenpipe stays on as the evidence recorder. A small offline script can read its database, find candidate navigation moments from app, window, web-address, and click changes, pick the latest usable frame from before each one, draft the destination label from the later evidence, and write the draft examples to a table in time order. I then check every row by hand.

The script deliberately skips live suggestions, a review interface, reliable automatic segmentation, perfect dual-monitor synchronization, and stable identification of every on-screen control. Its only job is to reduce the manual work of assembling examples. If it starts turning into another infrastructure project, the fallback is labeling the first examples fully by hand.

Low friction here means install, record, and review. It does not mean querying a database, aligning several clocks, or debugging monitor geometry. That is what my three days looked like.

## What a dependable version still needs

A dependable automatic version has to guarantee six things. Reliable detection of meaningful transitions in ambient work. Identification of the target from accessibility data, page structure, and pixels together, because in my testing no single source covered every case. Correct joins across monitors and data streams. Explicit handling of missing or contradictory evidence. A fast way for the user to correct labels. Stable export.

Whether that is a new product or an adapter on an existing platform is genuinely unresolved. The open tools provide the primitives and require custom assembly. The enterprise systems already provide much of the conversion machinery, and their public documentation simply does not answer the four questions above. I will not call this a net-new gap until a demo or trial settles it.

## Why this matters and what happens next

The idea came from a conversation with [Niyant](https://handsdiff.github.io/phase-1), whose broader thesis is personal AI that learns you from how you actually work. I proposed a small first rung: press Tab, or one of three hotkeys, and get routed to the place you most likely want next, down to a specific task or input field. He called the first version too vague. After I narrowed it to exact destinations, he said it aligned. He also raised the objection I take most seriously. If I mostly use a few apps, a system that cycles among them could look useful without understanding anything. That is why the target is the exact place rather than the app label, and why the first test is whether predictions feel useful, not raw accuracy. The longer version of the idea is in [my Tab note](https://dylanduyvu.github.io/00-inbox/tab-could-autocomplete-the-next-computer-action) and [the experiment plan](https://dylanduyvu.github.io/20-syntheses/computer-use-nap-shadow-experiment).

There is precedent that the prediction side can work at all. [A Click Ahead](https://arxiv.org/abs/2309.12170) trained a compact recurrent neural network, not a large language model, on about one week of one person's Windows activity and reached 34.63 percent exact top-one accuracy choosing among 442 known actions. My setup differs in the directions that matter. My destinations are finer-grained and not confined to a fixed list. I read the result as an existence proof, not a forecast.

The corrected sequence is short. Run the manual pilot. Decide whether the predictions are useful. Use the offline script only if it actually reduces the labeling work. Build, or buy, the dependable version only if the prediction earns it.

If you have built something that already produces these examples, or you are working on it, I want to see it. The seven jobs above are the test. dylanduyvu@gmail.com.
