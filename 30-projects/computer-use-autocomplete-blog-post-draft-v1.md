---
type: blog-draft
status: draft-v1 (text and links; diagrams as placeholders)
created: 2026-08-14
source: computer-use-autocomplete-blog-post-skeleton.md (reader order) and computer-use-autocomplete-blog-post-structure.md (decisions, evidence bank, draft harness); whole blog set moved to the vault 2026-08-14, path key in the structure file's move note
register: simple declarative (harness sec 16); no em dashes; active voice; one idea per sentence
notes: "bracketed [NOTE] items are open verifies or fill-ins; [DIAGRAM n] items are the six decided visuals; [LINK: name] items need URLs from the provider map"
revision history: commit checkpoints per harness sec 17 are Dylan's or a shell agent's to run
---

# How Computer Use Crosses the Chasm: Tab Autocomplete for Your Next Action

*Thanks to [Niyant (handsdiff)](https://substack.com/@handsdiff) for his personalization work on this project, and for a day-one objection that became our measured ceiling. His thesis notes are [here](https://dylanduyvu.github.io/20-syntheses/niyant-personal-ai-thesis-study-guide). [Cursor](https://cursor.com/tab) proved Tab autocomplete as a product shape. [Cotypist](https://cotypist.app), by Daniel Alm of Accelerated Thought GmbH, took it beyond code, and we copied its interaction grammar.* [NOTE: pull Niyant's exact contributions from the master record before publishing.]

## 1. The promise

Computer use removes the interface tax between what you want and what the machine does. There is a valuable product to be built here. Work needs to be done to make it 10x. But its value proposition is sound: fewer clicks, less friction. Nobody ever wants more clicks to do what they want on their computer. Jeff Bezos built Amazon on what won't change: nobody will ever want [higher prices or slower delivery](https://quoteinvestigator.com/2021/03/03/not-change/). Fewer clicks is the same kind of bet. We built the tightest version of this design, watched where it broke, and traced the break to two missing pieces. This post is the map.

## 2. The trust wall

Capability is arriving faster than trust. The past year of agent incidents shows the gap.

- **Replit, July 2025.** An agent wiped a production database during an explicit code freeze. Replit's CEO called it unacceptable and shipped dev and prod separation after ([The Register](https://theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/), [Gizmodo](https://gizmodo.com/replits-ai-agent-wipes-companys-codebase-during-vibecoding-session-2000633176)).
- **Gemini CLI, July 2025.** A user asked for a simple file move. The folder creation failed silently and the moves destroyed the files. The agent's own verdict: "I have failed you completely and catastrophically" ([Slashdot](https://developers.slashdot.org/story/25/07/26/0642239/), [Vibe Graveyard](https://vibegraveyard.ai/story/google-gemini-cli-file-deletion/)).
- **GPT-5.6 Codex, July 2026.** OpenAI confirmed it was investigating full-access sessions that deleted users' home directories. It added an explicit safeguard against `rm -rf $HOME` and promised a postmortem ([Mallory](https://mallory.ai/stories/019f6f1d-62eb-7f9b-b9a4-1e220f2ecc02), [Popular AI](https://popularai.org/p/gpt-5-6-sol-deleted-files-codex-safety)).
- **The quiet version, July 16, 2026.** No dramatic command. A Codex user's parent Dropbox folder got renamed mid-task: "Codex unexpectedly renamed a parent folder in my local Dropbox." Everything was offline for hours ([tweet](https://x.com/Voxyz_ai/status/2077792879909453849)).
- **August 12, 2026.** A fresh Windows report: recursive deletion that hit the C: root, Program Files, and directories outside the project ([OpenAI forum](https://community.openai.com/t/on-august-12-2026-between-approximately-21-48-and-21-55-a-recursive-deletion-occurred-on-my-windows-computer-while-i-was-using-the-codex-app-the-deletion-affected-the-root-of-the-c-drive-program-files-and-other-directories-outside-the-project-folde/1390215)).

None of these people asked for anything unusual. They asked for a file move, a database task, a coding session. That is the wall.

## 3. Patch versus design

The industry patches trust on: approval dialogs, allowlists, sandboxes. Bolt-ons. The alternative (more schlep) is trust designed into the interaction itself, with the human in the loop at the tightest grain. That sets up the tightest loop. This is the wedge. As trust builds, you naturally let the agent do more and more for further friction reduction.

## 4. The tightest loop

Here is the shape. A prediction engine constantly watches your current system state and your history, and predicts what you are trying to do next. At a pause, a small pill appears with the predicted next step. Tab accepts one step. Escape aborts. Ignoring it costs nothing. The system never executes anything send-, submit-, or delete-shaped on the first accept. It walks up to the action, holds, and requires a deliberate second key.

One step at a time, with a held boundary before anything consequential. That is autocomplete for computer use, and it is the tightest trust loop we know how to draw.

We tried to build it. The scope ran downward into the stack, and section 8 holds what we found there. We never validated the design in ordinary use.

## 5. The system this needs

The design needs four parts.

[DIAGRAM 1: four boxes, one per part, each labeled with its ideal instantiation and an availability stamp: recorder partial, predictor private, interaction baseline built, executor sealed. Dotted ambient-summarizer split inside the predictor box. Dotted preview layer inside the interaction box.]

- **Recorder.** Ideal: record everything. Screen video plus keylog, clicks, and accessibility data, structured into before-state to next-action history. Today, capture is cheap and shipping. The remaining work is turning the log into training-grade rows: the target named right, real boundaries between actions, no holes in the sequence, and a confirmed effect. Training-grade is deliberate. If accuracy ends up requiring a personal action model, finetuned or continuously finetuned, possibly on top of a computer-use video model, these rows are its training set and its ongoing feed. Until then they are the context and the eval labels. Record everything is the signal-maximal ideal. A builder today would start from the thinner event stream and add video only where events fail. We weighed both layers ourselves: our live build ran interaction events, and our offline tests ran screenshots.

[DIAGRAM 2: the recorder decision tree. Branch one, screen video plus vision: rich, slow, heavy. Branch two, interaction events plus accessibility: fast, thin visuals. Our live focus trail and OpenAI's Computer History both sit on branch two.]

- **Predictor.** Ideal: one model pretrained on computer-use video and actions. It reads the raw recording, understands the goals in play, predicts the next semantic action, and knows you (next section). Today, the new labs training these have not shipped them. General LLMs stand in, and our best stand-in capped at habit. There is room to split this part into an ambient summarizer feeding a lighter predictor, for efficiency. The summarizer continuously turns the recording into "what has happened, what the goals seemingly are" text. That text seam is inspectable, and it is a natural place to inject your history. Our own tradeoff was blunt: the live build ran a small fast model with no vision, and the strong frontier arm was far too slow for a pill.
- **Interaction.** Ideal: the pill plus a preview of what pressing Tab will do. The plan spelled out, the coming action ghosted on screen: ghost cursor, highlighted target, gesture hint. It is the visual analog of ghost text. The consequence gate stays. Today, pill, keys, and gate are built and proven. The preview layer is unbuilt but buildable, the only gap that is work rather than access. The gate buys trust with friction; free dismissal keeps the attention cost near zero.
- **Executor.** Ideal: hand the accepted step to an already-built, low-latency computer-use app. Proven hands. Today, the apps are sealed to their makers' front ends, and the one callable option is documented as too slow. Universal pixel drivers exist, but none is both callable and fast. So you fall back to raw primitives on the accessibility layer, which is fast and exact but needs apps to cooperate.

Latency is key at every part of the stack for productizing this; it is not the immediate bottleneck to accurate prediction (section 9). Each part becomes a question: does a usable version already exist to adopt? Can this be packaged? If not, what needs to be built?

## 6. Why the predictor has to know you

The hard part is the predictor, and the reason is information, not model quality. The argument in five lines:

1. To predict a next step, something has to carry the goal. Usually the goal itself; sometimes a proxy that embodies it, like habit.
2. The goal gets onto the record three ways: you act it out (weak signal per step), you write it down (strong signal), or the world hands it to you (an event). Some of it never arrives.
3. The behavioral record comes down to two numbers: goal per step, and steps per goal. Words carry a lot and come in hundreds. Navigation actions carry little and come in a handful.
4. Text autocomplete lives downstream of disclosure: by the time it fires, the goal is on the page. Navigation autocomplete lives upstream: it fires at the boundary, before the acting has said anything.
5. So the gap closes from elsewhere: repetition, declarations, events, or asking. A stronger model shrinks how much goal you need. What never reaches any record and won't be told stays unpredictable for any system. That is the hard limit.

A paired example makes it concrete. You decline Thursday's meeting. Text version: you type "Hi Maya, unfortunately I can't make..." and autocomplete predicts word 20 of a goal that words 1 through 19 already announced. Navigation version: you finish an article and pause. The pill must fire before any click, and the first click is exactly the thing that would have revealed the goal. Text predicts step N of a goal from steps 1 through N-1 of the same goal. Navigation predicts step 1 of a new goal from the leftovers of the previous one.

[DIAGRAM 3: the disclosure timeline. Two lanes. Text predicts step N after the goal is on the page. Navigation predicts step 1 before any click. Annotated with the Maya pair.]

Every autocomplete is two ingredients: a shared model (pretraining plus whatever context is sitting there) and personal signal (the part only your data can supply). The products differ in whether the work already captured that signal.

| Product | Personal signal it needs | Already captured by the work? | What remains |
|---|---|---|---|
| [Cursor](https://cursor.com/tab) | Your repo and edits | Yes, in exactly the form a model reads | Personalization comes free |
| [Cotypist](https://cotypist.app) | Your voice: phrases, tone, recipients | Scattered across your machine | Small debt, now optionally collected: Cotypist ships an opt-in collector, off by default |
| Computer use | Your goals | Mostly never recorded | The declared slice (task titles, calendar) is the exception, and it is exactly where our only wins came from |

The last row is where our results live. The only lever we ever tested was adding my own history to the model's input. It moved the score every time we tried it: best case, 0 out of 10 to 5 out of 10. But every hit was a habit: the recurring Codex task or its composer. Fresh targets: zero. And it missed a visible Subscribe button to propose a return to the routine. History taught the model my habits, not my intentions. That ceiling is the habit cap. Niyant called it on day one; the data agreed.

## 7. What exists per part

The pill was the only part with a proven design to copy. Cotypist had already shown the exact interaction on text. Everything else has providers now, and each one misses the specific thing this design needs.

**Recorders exist and are getting closer.** [Screenpipe]([LINK: screenpipe]), [NAPsack]([LINK: napsack]), OpenCUA's capture tool, and [Scribe]([LINK: scribe]) each cover a piece. [OpenAdapt]([LINK: openadapt]) records continuously with scrubbing. [Coast]([LINK: coast]) ships always-on local screen recording as a commercial memory product; [Pieces]([LINK: pieces]) ships background local memory. As of this week the OS-vendor tier exists too: OpenAI's [Computer History](https://learn.chatgpt.com/docs/customization/computer-history), launched August 13, 2026, records clicks, typing, and app switches from approved apps into local memories. It is opt-in, macOS only, no screenshots, and raw events are gone after 48 hours. It suggests skills and automations from repeated work, so it reaches habit grain without next-action prediction. Our full-day audit of its stream is in section 9. The headline: rich per-event context, exact typed text, and roughly half of clicks carry a usable label. [activity-frames]([LINK: nocta]) compiles passive capture into replayable routines for detected recurring work (marketing-sourced). Training-grade rows for the general stream remain the open question. I wrote about that missing layer in [The Missing Step Between Recording and Prediction](https://dylanvu.substack.com/p/the-missing-step-between-recording); section 9 cites it again with the five conversion steps.

**The video-scale predictor models are private.** These pretrain on years of raw screen video and learn what a person does next by watching. [FDM-1](https://si.inc) trained on 11 million hours of screen video; [Photon-1]([LINK: photon-1]) on roughly 18 years. Both were announced in 2026. Neither ships weights or an API. Below that scale, action-trained models are open and callable: these start from a general vision-language model and finetune on instructed task demonstrations. [UI-TARS]([LINK: ui-tars]), [OpenCUA]([LINK: opencua]), [TongUI]([LINK: tongui]) (mined from tutorial videos, vLLM-servable), and [Northstar]([LINK: northstar]) (4B, open weights plus a hosted API), plus hosted computer-use endpoints from Google, OpenAI, and [Anthropic]([LINK: anthropic computer use docs]). Those endpoints are general models carrying a computer-use tool; your harness does the clicking. None is trained to predict your next action from passive personal history. They execute instructed tasks. The missing model is still missing; the stand-ins got better.

**Executors are sealed or disqualified.** The Codex signed helper kills non-Codex parents, headless mode auto-cancels, and there is no allow mode ([21200](https://github.com/openai/codex/issues/21200), [24135](https://github.com/openai/codex/issues/24135), [19554](https://github.com/openai/codex/issues/19554), [20851](https://github.com/openai/codex/issues/20851)). Coasty is hosted-only with a not-implemented endpoint. macos-use has toolchain and license problems. The one exception: Anthropic's tool is callable and accepts custom tools, so per our research it technically should be integrable. Their own docs warn it may be too slow for interactive use. It fails on latency, not access. As of today an open driver layer also exists ([Cua Driver]([LINK: cua driver]): cross-platform, MIT, background window-targeted input). A builder starting now would start there rather than at raw primitives.

**The market is waking up, and the space is still wide open.** [Coast]([LINK: coast]) ("cursor for everything," funded) shipped an always-on recorder as a memory product first: the data store before the assistant that acts. OpenAI joined the memory-first move on the day this project was killed; Computer History ships the data store with no prediction and no hands. [Adsideo]([LINK: adsideo]) offers ambient suggestions you approve or ignore. [AutoComputer]([LINK: autocomputer]) runs predicted action sequences accepted one keystroke at a time. [Covalent]([LINK: covalent]) (private beta) goes furthest: OS-wide text Tab plus one-click task suggestions from calls and tickets. It is genuinely cool that people are taking a stab at this already. And look where every entrant lands: text after the goal is disclosed, declared work, recurring patterns. Exactly the channels this argument says are tractable today. The deep layer, click-grain ambient prediction from passive history, remains untouched, because the two bottlenecks block it for everyone. That is the open field. [NOTE: Covalent claims are marketing-sourced and no independent hands-on exists yet; attribute inline as "per their site" or trim "goes furthest" if none lands by publish.]

## 8. Can you easily build this by packaging what exists and filling in the gaps?

We tried. Three fragility rings ate the project.

1. **Sealed executors force you down a layer to raw primitives.** We fell back to axcli, a small accessibility-layer clicker. It clicks in 200 to 430 ms with exact element identity.
2. **The callable substrate lies at its seams.** A bridge returned success while Slack did not change. Background trees and clicks fail. A scroll dispatched twice and the page never moved. The broker was dead for 6,718 cycles while its health check read ready. A depth cap of 20 hid Slack's Send button.
3. **Owning the contract layer is where generality dies.** At least 16 hand-written capability bounds across 8 enforcement surfaces. One null-versus-absent field deleted every cross-app proposal: 53 proposed, 0 displayed. 413 of 882 "model abstentions" were our own contract discarding real proposals.

Two takeaways, stated precisely. First: fragility spent the runway, so we never cleanly tested the product idea. We never got to find out. Second: the one clean offline result caps expectations anyway. V5, our strongest offline arm, ran a frontier model at max reasoning with screenshots and full history. It went from 0 out of 10 to 5 out of 10 on exact top-3. Every hit was the recurring Codex task or its composer. Arc browser targets: 0 of 5. It missed a visible Subscribe button while proposing returns to the loop. History is a habit prior, not an intent signal.

[DIAGRAM 4: the full-run funnel. 8,488 cycles, 1,480 provider requests, 882 abstentions, 123 returned, 124 shown, 5 accepts. Drop-offs labeled.]

[DIAGRAM 5: the actuator decision tree. Pixels plus synthetic input on one branch (universal, slower, sealed or disqualified). Accessibility layer on the other (fast, exact, apps must cooperate). Footer: universal options exist, none are both callable and fast.]

[DIAGRAM 6: the loop with real latencies. Packet 817 ms, provider 3,752 ms, total 4,698 ms medians.]

I should own what I believed while building. At the all-hands, I ranked the suspected causes: poor context first, a weak model second, our contract layer third. I labeled the ranking myself: "just vibes and intuition based." The evidence inverted it. The contract layer, my third pick, was the one proven contaminator: it discarded 413 action-bearing completions and every one of the 53 cross-app proposals. Context, my first pick, is partially supported and habit-only. The weak-model pick narrows rather than survives: a frontier model with my full history still capped at habit. And my list had no fourth entry. The possibility that the signal does not exist entered the record only at the postmortem.

## 9. The two immediate bottlenecks

These are the two immediate bottlenecks to this product existing, and they are the two things next-word prediction got for free. Bottleneck 1 is the prefix: the record of your own work, which text models get from the document itself. Bottleneck 2 is the prior: a model that already knows how people use computers before it ever sees you.

**Bottleneck 1, the personal recorder.** Recorders exist, and each covers a piece. None produces training-grade history: rows whose targets you can trust. Insufficient, not absent. (One routine-scoped partial exception is noted above.) The evidence from our own build: assembling one day of usable history took three days. The only lift ever measured ran on roughly 196 hand-labeled rows. The live product collected rich signal (clicks, scrolls, keys, dwell) and dropped it at projection, sending a 12-row focus trail. Even the postmortem dataset needs a new temporal join, because the human-event pointers are null on all 1,423 packets. [The Missing Step Between Recording and Prediction](https://dylanvu.substack.com/p/the-missing-step-between-recording) documents the three days and the five conversion steps. Proven so far: history recovers the habit signal, cheaply. Open, and I will not promise it: whether richer history unlocks novel actions. Our semi-rich version did not. New since the kill: raw capture is commoditizing. OpenAI's Computer History shipped continuous event capture the day this project ended. So Bottleneck 1 splits. Capture is now shipped by an OS vendor. Training-grade rows are still nobody's product, and the problem is now normalization on top of shipped capture rather than a recorder build. Our full-day audit (2,198 events over 3.5 hours) judged the stream sufficient for the coarse grains of the fair test in section 10, next app and semantic action, with exact-destination scoring only on the grounded half of clicks. That is a data-sufficiency judgment; the prediction lift is untested.

**Bottleneck 2, the pretrained action model.** Private only: FDM-1 and Photon-1, as of our July 30 review.

**Complementary, not independent.** A long-context pretrained action model could consume the raw personal stream and personalize in-context. That shrinks Bottleneck 1 from hand-labeled history to reliable raw capture. The personal channel survives; the curation may not.

**A shared missing primitive.** Automatic action labeling from raw recordings, called inverse dynamics. Labs built it to pseudo-label pretraining corpora. The same capability would make the personal recorder automatic. Today it ships as [open research code]([LINK: videoagenttrek]), not as a product.

**The third, after these two: latency.** Latency is key at every part of the stack for productizing this; it is not the immediate bottleneck for getting the full stack to predict accurately. Once the two bottlenecks fall, it becomes the biggest issue. [Interaction models](https://thinkingmachines.ai/blog/interaction-models) are the candidate class to solve it (Thinking Machines, research preview, 0.40 s turn-taking, self-reported, partner-only). FDM-1's design is built for speed, per its maker: video-native, no chain of thought. A hint the fight is winnable. The ordering is our judgment rather than a measurement. Today an absent pill is invisible, so speed cannot save a prediction that does not exist.

**The legibility residual.** The open question is what fraction of prediction moments sit upstream of disclosure. If it is large, the durable product is habit routing plus world-disclosed moments, not continuous prediction. Unmeasured either way.

## 10. The close

This is the best-supported hypothesis, not a finding. The fair test never ran. The test that would separate context, model, and signal: offline replay of the 1,423 packet-backed moments, labels via a new temporal join, with baseline arms included this time (frequency, recency, source-transition, mismatched history). A cheaper data source for the same test now exists: the Computer History stream, after two to four weeks of collection.

Midway through, I wrote that I would walk away once I could prove the real bottleneck was one of three things: no model finetuned on my actions, no computer-use foundation model, or latency. This conclusion is that same list, in order.

If you are working on this, or on any part of this stack, the recorder, the predictor, the interaction, or the executor, please reach out through DM. I would love to chat and collaborate.
