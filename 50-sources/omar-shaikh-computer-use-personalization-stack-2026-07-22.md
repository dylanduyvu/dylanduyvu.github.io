---
type: source
status: captured
created: 2026-07-22
updated: 2026-07-22
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
people:
  - omar-shaikh
  - niyant
  - dylan-vu
orgs:
  - general-user-models
  - markov-studios
tags:
  - source
  - longnap
  - tada
  - tabracadabra
  - computer-use
  - prior-art
---

# Omar Shaikh's computer-use personalization stack

## Why this was reviewed

Dylan reviewed Markov's public computer-use sample, LongNAP, Omar Shaikh's research program, and the runnable Tada application while deciding whether to pursue a personalized computer-use NAP. The question was not just whether next-action prediction is technically possible. It was whether Dylan needs Niyant-level ML depth to run a useful first experiment, what work has already been done, and what product question remains open.

## Markov: raw capture is not semantic understanding

The [Writing and Research sample](https://www.markovstudios.com/data_samples/writing-and-research) shows one browser-heavy workflow: the contributor researches old and new Perplexity interfaces through Google Images and Reddit, then writes notes in Notion.

Its public artifacts include a full-screen video, a [raw event stream](https://www.markovstudios.com/data_samples/writing-and-research/events_0.jsonl), and [action/intent narration](https://www.markovstudios.com/data_samples/writing-and-research/narration_0.json). The event stream contains 765 low-level events while the narration contains 49 higher-level segments. The narration includes overlaps, near-duplicates, uncertain intent language, and imperfect semantic app attribution.

The sample makes three design problems concrete:

1. Raw mouse, key, scroll, and window events are much easier to collect than stable semantic actions.
2. An operating-system app label is too coarse. One Chrome process can contain a Google result, Reddit thread, Notion document, specific browser tab, and several controls.
3. Full-screen capture and literal typing expose names, queries, workspaces, and document contents. Privacy is part of the product, not a later compliance detail.

The public sample does not include stable semantic control IDs, a declared user goal, a success outcome, longitudinal personal history, or suggestion exposure. It is a useful data-pipeline specimen, not evidence of personalization.

## LongNAP: the closest scientific precedent

[Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/html/2603.05923) defines next-action prediction over natural-language descriptions of computer behavior. Its main setup gives the model 16 preceding action events, includes images for the last two, and asks it to predict an eight-event future trajectory.

The reported dataset uses 20 participants over 28 days, about 1.9 million screenshots, roughly 1,837 screen-on hours, and 359,219 generated action descriptions. The underlying Screenomics data is phone activity rather than a desktop routing deployment. LongNAP trains a per-user LoRA, retrieves past observations with BM25, reasons about what to retrieve and predict, and uses GRPO with a Gemini-family judge. The reported training used eight B200 GPUs.

Reported results include 17.1% pass@1, 36.3% pass@20, and 25.9% pass@1 on the highest-confidence subset. Those numbers are LLM-judged semantic matches on eight-action natural-language trajectories. They are not next-app or exact-destination accuracy.

The paper establishes that longitudinal behavior contains learnable personal signal. It does not establish a useful desktop product. It does not report retention, productivity, exact semantic-destination routing, or the simple product baselines most relevant to Dylan, such as most-recent destination and source-conditioned transition frequency.

## Omar's broader research ladder

[Omar Shaikh's research](https://oshaikh.com/) decomposes the path from observation to assistance rather than treating it as one automatic implication:

1. **Capture and label behavior:** Markov and [NAPsack](https://github.com/GeneralUserModels/napsack).
2. **Predict future behavior:** LongNAP.
3. **Construct a persistent user model:** [General User Models](https://oshaikh.com/papers/gums).
4. **Infer the current objective:** [Just-In-Time Objectives](https://oshaikh.com/papers/just-in-time-objectives).
5. **Infer deeper motivations:** [Behavior Latticing](https://arxiv.org/html/2604.07629).
6. **Represent longer-term goals with user participation:** [Tempo](https://oshaikh.com/papers/co-creating-life-goals).
7. **Generate or execute assistance:** Tada, GUMBO, Dawn, and SleepWalk.

This closely resembles Dylan's proposed ladder:

> where I will go → what I will do there → what context I need → what desire or goal drives it → a better next action

The prior work also warns against assuming the arrows. Accurate surface behavior can be shallow; deep motivational interpretations can hallucinate; the same action can serve several goals. Tempo therefore adds lightweight self-description and editable goal hierarchies rather than assuming passive observation reveals the true goal.

## Tada versus Tabracadabra

[Tada](https://generalusermodels.github.io/tada/) is the umbrella research platform for testing personal-AI interfaces. Tabracadabra is one interaction built inside it. Memex, a passively constructed personal wiki, is another.

As of July 22, 2026, the latest public release is the [v0.0.16-alpha Apple-Silicon macOS research preview](https://github.com/GeneralUserModels/tada/releases/tag/v0.0.16-alpha). Onboarding requires a Gemini API key plus Screen Recording and Accessibility permissions. Other connectors, including Gmail, Calendar, browser cookies, filesystem, notifications, microphone, and system audio, are optional. The application warns that the preview can be buggy.

The current Tabracadabra implementation works as follows:

1. The user focuses an editable field and presses Option+Tab.
2. Tada captures the monitor under the cursor and adds cursor-position context.
3. A research phase can inspect relevant Tada activity records and use read-only tools or web search.
4. A separate writer phase receives the screen plus the research transcript and streams a continuation or inline answer into the focused element through synthetic keyboard events.
5. A non-Option keypress, mouse click, or detected focus shift stops further generation. If text has already streamed, the inserted partial text remains.

The research and writer phases use the same configured model identifier in the current source, so they are two calls or phases, not necessarily two different underlying models. The implementation assumes the focused element is editable rather than enforcing that condition.

Relevant Tada activity records can include screen captions, meeting transcripts, the Memex memory wiki, prior chats, self-report conversations, email, calendar, notifications, filesystem activity, and completed research moments. The research prompt says to skip the log scan when the request is self-contained.

Primary implementation references:

- [Tabracadabra trigger, streaming, and cancellation](https://github.com/GeneralUserModels/tada/blob/25a28f7519f4ebaedaf8817ccd4e9b8f2196e1fe/src/apps/tabracadabra/main.py)
- [Research-phase prompt and available log sources](https://github.com/GeneralUserModels/tada/blob/25a28f7519f4ebaedaf8817ccd4e9b8f2196e1fe/src/apps/tabracadabra/prompts/tab_phase1.txt)
- [Writer-phase prompt](https://github.com/GeneralUserModels/tada/blob/25a28f7519f4ebaedaf8817ccd4e9b8f2196e1fe/src/apps/tabracadabra/prompts/tab_phase2.txt)

## What Tabracadabra proves and does not prove

Tabracadabra proves that the keyboard-first in-line interaction is runnable today. It also supplies an implementation reference for screen capture, local context access, and streaming into arbitrary text fields.

It does not show that a model trained on longitudinal personal data beats retrieval, that it accurately predicts an unaided next write, or that exact computer destinations can be routed usefully. It handles the **writer** question:

> Given the field the user already chose, what should appear here?

Dylan's computer-use NAP begins with the **router** question:

> Given the user's current state, what exact semantic destination will they choose next?

Tabracadabra is therefore prior art and a possible future baseline, not a required branch-selection experiment.

## Relationship to Niyant's work

Niyant's [`Algorithms` note](https://github.com/handsdiff/notes/blob/3151afa93fd81719a6e9dc7862c269ea1f1a70e6/Algorithms.md#L312-L321) directly links Omar's site, calls LongNAP the closest work, describes its data pipeline as useful, and links the Tada repository. This verifies that Niyant knows Tada exists. The note does not explicitly name Tabracadabra or show whether he has installed or deeply inspected that interaction.

Omar's stack raises the baseline for Niyant's static experiment. A new result must distinguish learned temporal personalization from strong screen context, retrieval, prompting, and proposition-based memory. The existing work does not settle Dylan's exact semantic-routing product question.

## Durable implications

- Dylan does not need to reproduce LongNAP to decide whether the computer-use NAP direction deserves more investment.
- The first experiment should test a product and signal gate, not select a training algorithm.
- Exact semantic destinations, not app names or screen coordinates, are the appropriate first target.
- Correct personal history must beat visible-screen context, wrong history, recency, and transition-frequency baselines.
- Goal understanding must be tested as a later rung. It does not follow automatically from navigation accuracy.
- Tabracadabra can remain a reference implementation; Dylan has chosen to test the distinct routing hypothesis directly.

## Links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Product hunch: [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- Experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Insight: [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]

