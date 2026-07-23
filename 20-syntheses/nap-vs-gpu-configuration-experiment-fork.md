---
type: synthesis
status: draft
created: 2026-07-23
updated: 2026-07-23
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - gpu-finance
  - ai-infrastructure
sources:
  - dylan-niyant-personal-ai-slack-2026-07-21
  - dylan-niyant-computer-use-nap-followup-2026-07-22
  - jakub-borrower-side-gpu-finance-and-shadow-loan-experiment-2026-07-21
  - omar-shaikh-computer-use-personalization-stack-2026-07-22
people:
  - dylan-vu
  - niyant
  - jakub-janiak
  - omar-shaikh
orgs:
  - general-user-models
tags:
  - decision
  - lbh
  - experiment
  - next-action-prediction
  - gpu-configuration
---

# NAP versus GPU configuration experiment fork

## How to Read This File

This is a case file, not a recommendation memo. It records the decision, how both branches developed, the experiment currently scoped for each branch, Dylan's stated attraction to and concern about each branch, relevant statements from Niyant and Jakub, and the questions that remain unresolved.

The file intentionally does not:

- score either branch;
- weight the comparison criteria;
- recommend a branch or a sequence;
- treat a proposed experiment threshold as an established scientific standard;
- convert Dylan's beliefs or preferences into external facts; or
- import pros and cons proposed by Codex or other agents into Dylan's stated case.

Provenance labels are used as follows:

- **Dylan-stated:** Dylan said this directly in the July 21–23 conversation or in a quoted source capture.
- **Niyant-stated:** It appears directly in a captured exchange with Niyant.
- **Dylan-reported Niyant view:** Dylan attributed this view or statement to Niyant, but it is not directly present in the captured exchange supplied to the reviewer.
- **Jakub-stated:** It appears in Jakub's captured advice.
- **Experiment-scoped:** It is part of the experiment contract already drafted in the vault. It has not necessarily been run or approved as a publication standard.
- **External evidence:** It comes from linked research or market evidence rather than Dylan's preference.
- **Unresolved:** The current record does not contain a settled answer.

## The Decision

Dylan's prior GPU-finance load-bearing hypothesis concerned whether a portable verified operator-delivery record would change financing eligibility or terms. He marked that hypothesis invalidated and moved to a broader branch-selection LBH.

His July 22 statement of the current LBH was:

> current lbh: i’ll feel like i understand niyant’s personalization interim thesis based on his notes by wednesday and choose a new lbh within the personalization thesis or the gpu financing problem detailed above^

The immediate decision is now which experiment should become the next LBH:

1. a shadow-mode test of personalized computer-use next-action prediction; or
2. a demand-informed test of which small-server GPU configuration, if any, should be purchased.

This is a choice of next experiment. The record does not establish that it is a permanent choice of company, domain, or career.

## How the Fork Evolved

### Personalization branch

1. Dylan studied Niyant's public thesis, Phase 1–3 specifications, Local Tasking, data plan, exploratory notebooks, internal all-hands context, and related work.
2. Dylan proposed a personalized Tab-style computer interface that predicts where he will likely go next within or across applications.
3. Niyant first called the proposal too vague and asked whether its value was merely pressing Tab instead of clicking Codex.
4. Dylan clarified a ladder from predicting the next place, to the action there, to the required context, to the desire or goal, to a better next action toward that goal.
5. Niyant then said the concept aligned overall. He retained a preference for predicting the content of the next write because he considered that stronger evidence of understanding. His main objection to app-level routing was that he uses roughly three applications, so a trivial model might appear accurate without being useful.
6. Dylan proposed increasing target diversity through both intra-application and inter-application navigation.
7. On July 22, Dylan asked what Niyant would have him, or a generic second pair of hands, build in service of the vision. Dylan reported that Niyant answered: build the computer-use NAP concept.
8. Dylan and Codex scoped an offline semantic-routing experiment rather than a live macOS application.

### GPU branch

1. Dylan had already chosen GPU financing as a deliberate search space and accumulated research, published writing, relationships, and prior invalidation work there.
2. Jakub suggested moving from lender interviews into the borrower/operator seat: identify compute, find offtake if possible, and attempt to assemble a GPU-backed loan.
3. The first scoped version was a shadow transaction rather than a committed purchase or financing.
4. Dylan then raised a live capital-allocation fork: assemble a loan and learn the borrower process, or use available capital to purchase a small GPU server and begin serving inference.
5. Dylan next observed that both routes appeared to depend on finding a customer, so the cash-versus-loan fork might be premature.
6. He subsequently sharpened the immediate GPU LBH again. The first decision is not necessarily to close an offtake or loan. It is to determine which GPU configuration should be bought based on individual customer demand or a reasonable marketplace belief.
7. The resulting experiment is a configuration demand gate. Customer and marketplace evidence select the asset. Offtake, cash purchase, and debt financing remain downstream possibilities.

## Branch A: Computer-Use NAP Shadow Experiment

### Origin and product idea

**Dylan-stated:** The product intuition is a personalized Tab-style completion layer for computer navigation. At a likely handoff point, Tab or one of three hotkeys would take Dylan to where he is likely to go next within or across applications, including a specific window, input field, link, or GUI button.

Dylan's fuller Slack formulation was:

> yeah, tab or one of 3 hotkeys (for top 3 nap) would take me to where i’d likely want to go next within or across apps, like the next window, input field, or gui button click. basically moving toward replacing most mouse navigation
>
> if it only ever replaces one click then yea that’s too weak as a forever value prop. but i could see it feeling or looking magical and making waves as a demo if the prediction is good and well personalized
>
> i was imagining climbing from:
>
> where i’d likely go next on computer
> ↓
> what i’d likely do there
> ↓
> what context i’d need
> ↓
> what desire / goal is driving it
> ↓
> a better next action toward that goal

The first experiment isolates only the first rung. It does not assume that success at destination prediction establishes action, context, desire, goal understanding, or better-action recommendation.

### Proposed LBH

**Experiment-scoped:**

> Within two to three days, determine whether Dylan's exact semantic computer destinations are diverse and predictable beyond simple navigation habits, and whether sufficiently accurate top-three suggestions would save enough work to justify building a live Tab interface.

### Prediction target

**Experiment-scoped:** Predict the next semantic focus immediately before the first navigation input.

A target contains:

1. surface: application or operating-system window;
2. object: exact tab, document, thread, project, page, or panel;
3. control: composer, search box, editor, link, or button; and
4. operation: focus, open, activate, or click.

Example:

> Codex → Personal AI task → composer → focus

Included events:

- application or window changes;
- browser-tab changes;
- document, page, project, or thread changes;
- input-field focus;
- link activation; and
- GUI-button activation.

Excluded events:

- ordinary typing;
- scrolling;
- text selection;
- cursor repositioning within the same draft;
- window resizing; and
- unrestricted action trajectories.

### Data record

**Experiment-scoped:** Each handoff records:

- timestamp;
- pre-action screenshot;
- recent semantic actions available before the handoff;
- actual next semantic target;
- clicks, keystrokes, or approximate time used to navigate;
- an optional block-level goal declared before the work block; and
- label ambiguity.

The underlying experiment contract is internally inconsistent about the goal condition: the minimum event schema calls it optional, while the Day 1 sequence says to write one before starting. That optionality must be resolved before execution. If a goal is used, it must be stated before the work block rather than reconstructed afterward.

The data scope should remain bounded. Prefer dedicated, non-sensitive work blocks, avoid collecting more raw key data than the test needs, keep recordings local where possible, and redact or exclude unrelated sensitive screens before model calls.

### Experimental sequence

#### Day 1: calibration and history

**Experiment-scoped:**

- Run two ordinary 60–90 minute work blocks in a bounded workspace.
- Write one plain block-level goal before each block under the current Day 1 procedure. Whether every block must include this condition remains unresolved because the event schema labels it optional.
- Capture semantic handoffs without displaying suggestions.
- Settle the target labels and exclusion rules;
- build recency and source-transition baselines; and
- freeze the prompt, history window, and scoring rules before held-out collection.

#### Day 2: chronological held-out test

**Experiment-scoped:** Capture 30–50 new handoffs without modifying the frozen rules. At each cutoff, hide the future and rank up to three destinations or abstain under these conditions:

1. three most recently used semantic destinations;
2. three destinations most often reached from this source state during calibration;
3. current screen and short immediate context only;
4. the same model with correct personal history;
5. the same model with an equal amount of unrelated or mismatched history; and
6. correct history plus the optional predeclared block goal.

The comparable model conditions use the same underlying model and fixed prompt. The first gate does not require fine-tuning or a continually trained personal model.

#### Day 3: optional simulated interaction

**Experiment-scoped:** If the offline result shows signal, replay 10–15 high-confidence cases as a simulated top-three hotkey interface. For each case, record whether Dylan would have selected the suggestion, what work it would have saved, how costly a wrong slate felt, and whether he would leave an always-on version installed.

### Measures already scoped

**Experiment-scoped prediction measures:**

- exact-target Hit@1 and Hit@3;
- coverage and accuracy at different confidence thresholds;
- number and distribution of distinct destinations;
- performance at app, object, control, and operation resolution;
- correct-history lift over screen-only and mismatched-history conditions; and
- label ambiguity.

**Experiment-scoped product-value measures:**

- whether Dylan would have selected the target;
- physical navigation actions avoided;
- time or target search avoided;
- false-trigger or wrong-suggestion cost;
- reversals after accepting a suggestion;
- number of useful hits available per workday; and
- willingness to tolerate the necessary capture permissions.

### Provisional continuation and stopping conditions

These are personal decision thresholds proposed for branch selection, not publication standards.

**Experiment-scoped continuation evidence:**

- roughly 30 or more usable held-out handoffs;
- roughly 10 or more distinct semantic destinations;
- trivial recency and transition baselines do not nearly solve the task;
- correct history shows clear directional lift over both screen-only and mismatched history, ideally around 15 percentage points or more in Hit@3;
- some history-dependent wins cannot be explained by the current screen alone;
- at least five plausible daily hits save three or more physical actions, avoid finding the target manually, or preserve meaningful working context; and
- Dylan would use the interaction and tolerate the required observation permissions.

**Experiment-scoped stop, demote, or retarget evidence:**

- a few destinations account for nearly all behavior;
- a simple source-transition rule nearly matches the contextual model;
- correct personal history adds no clear lift;
- targets cannot be labeled consistently;
- most correct suggestions replace only one easy click;
- useful opportunities are rare; or
- wrong suggestions are too distracting.

### Division of labor currently scoped

**Experiment-scoped:**

- Dylan owns the product question, semantic target labels, block goals, value judgments, and privacy tolerance.
- A technical second pair of hands owns capture setup, pre-action cutoffs, blinded model calls, context matching, baseline calculation, and scoring hygiene.
- Niyant can review whether the target and controls create evidence relevant to the broader thesis.

The record does not yet name the technical operator or confirm Niyant's review.

### What this experiment can and cannot establish

**Experiment-scoped:** It can test whether one person's semantic computer handoffs contain nontrivial and potentially useful predictive signal under a fixed offline setup.

It cannot by itself establish:

- goal understanding;
- a need for continual learning;
- a trained personal model beating retrieval;
- live-product value;
- usefulness for other people;
- enterprise demand or willingness to pay; or
- the later action, context, preference, and goal rungs.

## Branch B: GPU Configuration Demand Gate

### Origin and operating idea

**Dylan-stated:** Dylan is considering acting from the operator side rather than continuing only with interviews and desk research. The live operating possibility is to identify a GPU configuration, acquire a small server if justified, serve inference, find customers, and learn the workflow directly.

The earlier cash-versus-loan framing was:

> 1. Going down the GPU financing route of putting together a loan. There's a fork: I could put it together alone and see what the process looks like there from the operator's side.
> 2. We have enough money and runway in order to just straight up purchase a small server of GPUs, let's say, and begin serving inference, finding a customer doing off-tick, etc.
> Doing the first one gives me practice with putting together a loan and seeing what the problems are but doing the second gets things off the ground quicker and allows us to begin making money

Dylan then deferred that fork:

> yeah i think either way first thing's first is to find a customer. so maybe it's not even worth deciding on that fork yet

He subsequently made the immediate LBH more specific:

> i think actually the more specific lbh for the gpu stuff is to determine what gpu configuration to buy informed by customer demand (whether individual or reasonable marketplace belief)

### Proposed LBH

**Experiment-scoped:**

> Within a fixed timebox, determine whether a specific small-server GPU configuration has enough credible customer or marketplace demand at achievable net prices to justify purchasing it under conservative utilization and downside assumptions.

The exact timebox, return threshold, capital-loss tolerance, and definition of a reasonable marketplace belief remain unresolved.

### Decision object

**Experiment-scoped:** The configuration decision includes:

- GPU generation and memory capacity;
- GPU count and topology;
- interconnect;
- CPU, system memory, storage, and networking;
- server form factor;
- power, cooling, and colocation compatibility;
- deployment region and service level; and
- intended workload, such as inference, fine-tuning, training, or a mixture.

### Demand evidence ladder

**Experiment-scoped:**

1. general market narrative about compute scarcity or AI growth;
2. posted marketplace asks and visible availability;
3. behavioral marketplace evidence, including repeated booking or availability observations, net prices after fees, transaction evidence where accessible, and triangulation across providers or marketplace operators;
4. workload-specific customer evidence, including model, workload shape, memory, latency, throughput, geography, timing, and budget;
5. a paid pilot on rented capacity; and
6. a reservation, deposit, or offtake commitment.

The experiment contract currently treats posted prices as candidate-generation evidence rather than proof of realized utilization or revenue. The draft proposes behavioral marketplace evidence as the minimum rung for a reasonable marketplace belief, while the final operational evidence bar remains unresolved.

### Experimental sequence

**Experiment-scoped:**

1. Choose two or three configurations that can be purchased, hosted, and compared within the contemplated capital range.
2. Collect customer workload evidence and marketplace evidence for those configurations.
3. Translate workloads into technical and operational requirements.
4. Model net economics, including acquisition, marketplace fees, colocation, power, networking, maintenance, downtime, staffing or managed operations, and financing if relevant.
5. Model downside, including redeployability, resale value, exit timing, configuration-specific obsolescence, and maximum capital loss.
6. Select a configuration only if one clears the precommitted demand, return, operations, and downside bars. Otherwise the experiment can conclude that no purchase is justified yet.

The record has not yet confirmed whether Dylan accepts “do not buy” as a valid final result.

### Relationship to customer, purchase, and financing

**Experiment-scoped:**

- customer and marketplace evidence select the candidate asset;
- a paid pilot can test delivery using rented capacity before ownership;
- a reservation or offtake can support a purchase or lender request;
- a named configuration, site, operating model, and customer case can make a shadow-loan packet concrete; and
- continued rental, cash purchase, and debt financing are later alternatives rather than the first decision.

### Provisional continuation and stopping conditions

**Experiment-scoped continuation evidence:** One configuration maps to credible demand, has conservative positive economics, appears operationally feasible, and has acceptable redeployment or resale downside.

**Experiment-scoped stop, demote, or defer evidence:**

- demand remains general and cannot be mapped to one configuration;
- marketplace evidence stops at posted asks;
- likely customer workloads require a different configuration;
- attractive returns require implausible utilization;
- the server is too specialized to redeploy or resell within the accepted downside;
- operational requirements do not fit the intended setup; or
- no candidate clears the precommitted bars.

### What this experiment can and cannot establish

**Experiment-scoped:** It can identify whether one concrete small-server configuration has enough demand evidence and risk-adjusted economics to clear the purchase bar, or conclude that no tested configuration does.

It does not by itself establish:

- that a customer will sign long-term offtake;
- that the server will achieve forecast utilization;
- that Dylan's team can operate the service reliably;
- that a lender will finance the transaction;
- that cash purchase is superior to rental or debt;
- that one-server revenue becomes a scalable company; or
- that residual value for the selected configuration will remain stable.

## Dylan-Stated Reasons for Pull and Reservations

This section contains Dylan's stated considerations only. It excludes pros and cons introduced by Codex or other agents.

### Computer-use NAP

#### Reasons for pull

**Dylan-stated:**

- “i'm quite partial to ux tools like this (e.g., superhuman, cursor tab) i find them super interesting”
- Dylan likes predictive, keyboard-first interaction design and the possibility that a strong personalized prediction could feel or look magical.
- Dylan believes better intent compression should involve personalization, intent prediction, and eventually some representation of desires or goals.
- Dylan was already partial to the computer-use NAP concept before Niyant explicitly identified it as useful contribution work.
- Dylan wants a high-return-on-investigation entry point that could make the personalization path more interesting to him.

#### Reservations or requirements

**Dylan-stated:**

- “i kinda like this next action prediction stuff (per my ux leans i mentioned before), but i feel like i lack technical expertise”
- “i'm concerned that in order to design the experiment i'd probably want something apprxoimating the technical depth of knowledge that niyant has rn, which i don't have. or maybe you don't think that's necessary?”
- Dylan agreed not to use Tabracadabra itself as the branch-selection experiment. The intended test is the distinct semantic-routing target.
- Dylan asked whether defining goals is important to the test.

### GPU configuration and operator path

#### Reasons for pull

**Dylan-stated:**

- “gpu stuff obv i liked cuz i chose the gpu financing path before”
- Dylan said the GPU path could help the company make revenue and increase runway.
- Dylan said the company has enough money and runway to purchase a small GPU server.
- Dylan said purchasing directly could get the operation off the ground faster and allow it to begin making money.
- Dylan said assembling a loan would provide practice with the borrower process and reveal the problems encountered there.
- Dylan currently believes the capital downside is manageable because “residual value for gpus is insane.” This is recorded as Dylan's belief, not as a verified statement about an unnamed configuration.

#### Reservations or requirements

**Dylan-stated, from the July 21 borrower-side source capture:**

> concerns:
> 1/ technical bottlenecks on the LLM front gating financing directions
> 2/ my personal finance catch up work that would continuously need to be done to get to the edge
> 3/ necessity of doing on the ground work (flying out)
> 4/ virtue stances on value creation, making money off rents, etc. (although i don't personally mind as much)

**Dylan-stated, current design requirement:**

- The configuration should be chosen from customer demand or a reasonable marketplace belief rather than selected in the abstract.
- Customer discovery is upstream of the cash-versus-loan choice.

## Relevant Third-Party Statements

These statements provide context. They are not counted as Dylan's own pros or cons.

### Niyant

**Niyant-stated:**

- After Dylan clarified the computer-use ladder, Niyant said it aligned overall.
- Niyant's ideal target remains predicting the content of the next write from available information because he regards that as evidence of actually understanding him.
- Niyant said starting simpler and working upward could be defensible.
- Niyant's main stated concern was low app diversity: with roughly three commonly used applications, a model might repeatedly suggest those applications without creating value.
**Dylan-reported Niyant view:**

- Dylan reported that when he asked what he or a second pair of hands should build to contribute to the vision, Niyant answered: build the computer-use NAP concept.

### Jakub

**Jakub-stated:**

- Borrower-side CFO and debt-capital-markets work may expose more urgent and valuable problems because a lender can pass on a difficult transaction while the borrower must make the financing work.
- Trying to assemble the transaction can reveal the full requirement stack rather than another abstract interview answer.
- His bearish structural hypothesis is that custom contracts and weak standardization may make the neocloud itself the optimal finance firm, with a possible external opportunity in automating its finance function.
- His original transaction suggestion included finding compute, finding offtake if possible, and attempting to assemble a GPU-backed loan with Dylan and Jakub acting as the proposed operator.

## Side-by-Side Factual Snapshot

This table describes the current experiment contracts. It does not score the rows or claim that every row should carry equal decision weight.

| Dimension | Computer-use NAP shadow experiment | GPU configuration demand gate |
|---|---|---|
| Immediate decision | Whether exact semantic routing contains nontrivial personal signal and enough potential value to justify a live interface | Whether any specific small-server configuration has enough demand evidence and acceptable economics to clear the purchase bar, or whether no tested configuration does |
| Primary subject | Dylan's own computer-use handoffs | A candidate GPU server and its potential workloads or rental demand |
| Proposed timebox | Two to three days | Unresolved |
| Immediate artifact | Offline held-out benchmark and optional simulated top-three interaction | Ranked configuration candidates, demand evidence, economics, downside analysis, and a buy-or-defer conclusion |
| Initial capital commitment | No hardware purchase is required by the shadow test | No hardware purchase is required by the demand gate; purchase is a possible downstream result |
| Core evidence | Held-out predictions, trivial baselines, correct versus mismatched history, and Dylan's value judgments | Customer workload evidence, marketplace behavior, net economics, operating requirements, and downside evidence |
| Personal-history test | Explicitly tested | Not part of the scoped question |
| Customer or market test | Not part of the first single-user shadow test | Explicitly included |
| Revenue produced by the experiment itself | Not claimed | Not claimed; the experiment informs a potential revenue-producing purchase |
| Dylan's scoped role | Define targets, label handoffs, judge usefulness, and set privacy tolerance | Own the decision; execution ownership remains unresolved |
| Additional capability currently needed | A technical operator for capture, blinded model conditions, baselines, and scoring | Workload translation, hardware and hosting diligence, operating economics, and potentially customer, marketplace, or colocation access |
| Contract readiness | Active draft: timebox, procedure, sample size, conditions, and provisional gates are largely specified; the goal-condition optionality and technical operator remain unresolved | Draft: a behavioral marketplace-evidence rung is proposed, while the timebox, candidate set, final operational evidence bar, return and loss thresholds, and execution ownership remain unresolved |
| Positive result leads toward | Live semantic-routing prototype or a revised personalization target | Paid pilot, continued rental, purchase, shadow loan, or another transaction step |
| Negative result directly bears on | Dylan's routing wedge under the tested setup | The purchase case for the tested candidate set under the chosen evidence and thresholds |
| Negative result does not automatically bear on | Niyant's next-write target or the full personalization thesis | The whole GPU-finance market or every possible configuration and customer segment |

## Assumptions and Unresolved Questions

### Questions about the decision itself

- Is the objective to choose the highest-information next experiment, the nearest revenue path, the domain Dylan most wants to work in, or another criterion?
- How much time is available before the next LBH must produce evidence?
- Must one branch be selected exclusively, or is a sequential test admissible?
- What result would make Dylan regret not choosing the other branch first?

### NAP experiment unknowns

- Does Niyant mean exact semantic routing when he says computer-use NAP, or a broader action trajectory or content target?
- Who will be the technical operator?
- What capture method will isolate pre-navigation context without leaking the future?
- Are 30–50 held-out handoffs feasible within the timebox?
- Is the proposed target ontology stable enough for deterministic scoring?
- What exact lift threshold is required for another week or month of work?
- What external replication, if any, is required after a single-user positive result?
- What privacy permissions would Dylan accept in a live product?
- Does a declared block goal improve prediction, and if it does, does that point toward explicit goal conditioning rather than passive personalization?

### GPU experiment unknowns

- What exact customer segment or workload seeds the candidate set?
- Which two or three configurations are under consideration?
- What is the purchase price and full bill of materials for each?
- What constitutes a reasonable marketplace belief rather than a posted-price observation?
- What utilization and net-price assumptions are acceptable?
- What return threshold and maximum capital loss must a configuration clear?
- Is “do not buy” an accepted result?
- What evidence supports Dylan's residual-value belief for the exact configuration, condition, and planned holding period?
- Who will colocate, operate, maintain, and support the server?
- What commitments remain if the server is resold?
- What evidence is required before moving from demand research to a paid pilot, purchase, or lender request?
- How quickly could this branch produce revenue, and what would that revenue contribute after all costs?

## Neutral Review Packet for Other Agents

Provide the reviewer this file, both experiment contracts, and the cited primary source captures for attributed Dylan, Niyant, and Jakub statements. Do not provide prior recommendation memos from Codex or other agents.

Suggested prompt:

> Review this fork as a neutral decision analyst. Distinguish sourced facts, Dylan's stated preferences and beliefs, experiment-design choices, and your own inferences. Do not silently add decision criteria. Return:
>
> 1. whether the decision is determined by the current record; if yes, your recommended next experiment and the exact objective you optimized for; if not, a conditional recommendation or the minimum missing information;
> 2. the strongest case for the other experiment;
> 3. every new assumption or criterion you introduced;
> 4. the unresolved fact most likely to reverse your recommendation;
> 5. any flaw that would make either experiment's negative result ambiguous;
> 6. the smallest change that would make each experiment more decision-useful; and
> 7. your confidence, with reasons.
>
> Do not treat Dylan's stated belief about GPU residual value, the proposed NAP thresholds, or any revenue timeline as independently verified unless you inspect supporting evidence. If you recommend either an exclusive choice or a sequence, explain why it is superior to its strongest alternative under your stated objective.

## Canonical Links

- NAP experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- GPU experiment: [[gpu-configuration-demand-gate|GPU configuration demand gate]]
- Personal AI project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Compute-finance portfolio: [[compute-finance-problem-inventory-2026-06-30|Compute Finance Problem Inventory]]
- Niyant Slack source: [[dylan-niyant-personal-ai-slack-2026-07-21|Dylan and Niyant: personal-AI strategy Slack exchange]]
- Niyant contribution follow-up: [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- Jakub borrower-side source: [[jakub-borrower-side-gpu-finance-and-shadow-loan-experiment-2026-07-21|Jakub: search from the borrower seat and try to assemble a GPU loan]]
- Computer-use prior art: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Relevant inference infrastructure evidence: [[steady-inference-baseload-moves-to-controlled-capacity-not-always-owned-gpus|Steady inference baseload moves to controlled capacity, not always owned GPUs]]

## Updates

- 2026-07-23: Created as a recommendation-free case file for Dylan's own review and independent agent review.
