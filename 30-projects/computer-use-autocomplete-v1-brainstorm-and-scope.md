---
type: project
status: active
created: 2026-07-30
updated: 2026-08-02
aliases:
  - Computer-use autocomplete V1 brainstorm
  - Next-destination Tab V1 scope
  - History-conditioned computer-use autocomplete
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - autocomplete
  - next-action-prediction
  - latent-intent
  - product-scope
---

# Computer-use autocomplete V1 brainstorm and scope

## Status

Living brainstorming document. This is not an approved product specification
or implementation plan.

The V0 design is now approved in
[[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0
design]], and its reviewed execution sequence lives in
[[2026-07-31-computer-use-autocomplete-v0|Computer-use autocomplete V0
implementation plan]]. Those two documents supersede this brainstorm wherever
they conflict.

The purpose is to determine whether existing computer-use models can be
repackaged into a personalized next-destination autocomplete rather than
building computer-navigation intelligence from scratch.

## Current product thesis

Existing computer-use models are already trained to interpret interfaces,
identify actionable controls, navigate applications, and execute UI actions.
The product opportunity may therefore be a conditioning and interaction
problem:

> Replace the user's typed task instruction with latent intent inferred from
> personal history, then expose the model's highest-confidence next action as a
> Tab completion.

The analogy to an early Cursor autocomplete is at the product-architecture
level. The underlying capability may already exist; the differentiation comes
from context assembly, prediction framing, latency, confidence, interaction,
and feedback.

This remains a hypothesis. Computer-use models are trained to operate toward a
known goal. It is not yet established that they can infer the user's unspoken
goal from behavioral context accurately or quickly enough for autocomplete.

## Normal computer use versus this product

Normal computer use can be framed as next-action prediction under a known
goal:

`explicit goal + current state + task trajectory -> next action toward goal`

The proposed autocomplete removes the explicit instruction:

`personal history + current state + recent activity -> infer latent goal -> next action`

In probability terms:

- normal computer-use policy:
  `P(next action | current state, explicit goal, task trajectory)`;
- proposed autocomplete:
  `P(next action | current state, personal history, recent behavior)`.

The normal computer-use model receives the most important variable—the user's
goal—for free. The autocomplete must infer enough of that goal to make a useful
suggestion.

The product also changes the authority model:

- a normal agent is expected to continue acting toward the instruction;
- the autocomplete proposes one completion, waits for Tab, and can abstain
  entirely.

## Why the V5 experiment may understate feasibility

NAP V5 used a general multimodal LLM, not a model trained specifically for
computer use. The model had to do five things at once:

1. understand the screenshot;
2. recognize what was interactive;
3. infer what Dylan wanted;
4. invent the destination using the evaluator's text ontology; and
5. implicitly understand how the destination could be reached.

History improved exact top-three prediction from 0/10 to 5/10, but every exact
hit was a return to the same recurring Codex task family. History did not
exactly predict any of the five Arc targets.

That result shows recurring-task recall, not general next-action competence.
It may nevertheless be a weak test of the product architecture because a
general LLM was asked to solve intent inference, UI grounding, action
selection, and destination naming together.

A computer-use model should have better priors for:

- which screen elements are interactive;
- what a click, focus, or key command will do;
- how applications and webpages transition;
- how to ground a semantic destination to a control or coordinate; and
- how to emit an executable action rather than a prose label.

It is not automatically better at inferring unspoken intent. That remains the
personalization problem.

## Working system decomposition

The emerging separation is:

- **Personal-history layer:** infer where Dylan is likely trying to go and why.
- **Computer-use model:** determine how to reach and operate that destination.
- **Confidence layer:** decide whether the prediction is strong enough to
  display.
- **Tab interaction:** let Dylan approve the proposed action.
- **Feedback layer:** learn from acceptance, ignoring, overriding, and the
  action ultimately taken.

Candidate data flow:

`current state + relevant history`

`-> inferred intent or ranked destination candidates`

`-> computer-use model grounds candidates to executable actions`

`-> confidence gate`

`-> Tab executes`

The core product is not an autonomous agent. It is a personalized
next-action policy with user confirmation.

## Three possible ways to repackage computer-use models

### 1. History to latent instruction to computer-use model

Infer a short goal such as “continue revising the NAP article,” then give that
goal to an ordinary instruction-conditioned computer-use model.

Advantages:

- closely matches the interface computer-use models already expect;
- makes the inferred goal inspectable; and
- separates intent errors from navigation errors.

Risks:

- compressing history into one instruction may discard uncertainty;
- the inferred goal may be too broad to determine the immediate next action;
  and
- two model stages add latency.

### 2. Direct history-conditioned next-action prediction

Give the computer-use model current state plus personal history and ask it to
predict the next action directly, without generating an intermediate goal.

Advantages:

- simplest conceptual pipeline;
- preserves ambiguity in the history; and
- directly optimizes the desired interaction.

Risks:

- the model may still expect explicit instructions;
- failures are harder to diagnose; and
- open-ended action generation may repeat V5's naming and granularity
  problems.

### 3. Personal retrieval and candidate ranking plus computer-use grounding

Enumerate currently executable destinations, retrieve similar historical
transitions, rank the candidates using current state and personal history, and
use a computer-use model to ground and execute the selected destination.

Advantages:

- separates **where** from **how**;
- reduces open-ended label generation;
- supports hierarchical app, object, and control scoring;
- allows cheap frequency and transition baselines; and
- makes abstention and confidence easier to define.

Risks:

- candidate enumeration may omit hidden or dynamic destinations;
- the pipeline has more explicit system components; and
- personal retrieval may reinforce repetitive habits.

Architecture lean: **approach 3** remains the strongest fuller product
architecture. Personal history answers where; computer-use capability answers
how. Approach 1 remains a useful diagnostic or fallback for destinations that
cannot be enumerated.

MVP pressure test: a reliable cross-app candidate catalog is not simple.
Enumerating apps and windows is relatively cheap; stable browser tabs,
documents, tasks, controls, hidden destinations, semantic identities, and
endpoint verifiers can become a separate integration project.

Revised MVP recommendation: begin with structured open-ended generation. Ask
the model for top-three semantic completions plus `ABSTAIN`, an exact endpoint,
visible promise, route class, confidence, and commit class. Supply cheap
app/window/recent-destination metadata as context without requiring the model
to choose only from that list. Add explicit candidate enumeration only where
observed failures show that free generation is too vague, unstable, or
ungroundable. This preserves a path toward approach 3 without making its full
infrastructure a prerequisite for the first useful version.

Working decision: structured open-ended top-three generation is the initial
MVP predictor. Candidate enumeration is deferred until observed failures
demonstrate where it is necessary.

Existing computer-use models already perform a related capability implicitly:
given a stated goal and the current screenshot, they reason over visible UI
possibilities and emit the next grounded action. The MVP should reuse that
internal action-selection ability rather than reproduce it. What these systems
do not ordinarily provide is an exposed, personalized catalog of possible
*goals* to pursue before the user has stated one. Inferring that missing goal
from recent personal context is the product's thin prediction layer.

Approved MVP decision, July 30, 2026: do not build a separate semantic
candidate enumerator. Let the computer-use model propose completions from
current state and recent history; introduce an explicit catalog only if
observed prediction or grounding failures require one.

### Relationship to the landscape-recommended stack

Scoping rule: always choose the thinner implementation when it can still
produce the signal needed for the next decision. Infrastructure earns its way
into the MVP only when omitting it would make the test uninterpretable.

The product direction is consistent with the fuller stack recommended in
[[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|the computer-use autocomplete landscape]]:

- personal history and current Mac state inform the prediction;
- prediction and route execution remain separable system responsibilities;
- the predictor supports ranked alternatives and explicit abstention;
- the visible promise and endpoint are frozen before Tab is accepted;
- the host, rather than the model, enforces verification and commit boundaries;
  and
- an existing computer-use model supplies general routing capability instead
  of requiring a new executor to be trained from scratch.

The MVP deliberately does not implement that entire stack up front. It starts
with structured open-ended prediction rather than a complete semantic
candidate catalog, a short rolling history plus prospective episode ledger
rather than a full personal retrieval system, one replaceable executor rather
than a multi-model routing layer, and opportunistic structural signals rather
than requiring complete AX, DOM, App Intents, and deterministic-route coverage.

This is a sequencing decision, not a different destination. The system
boundaries should preserve the path to the fuller architecture. Promote the
deferred layers when evidence identifies the need:

- vague, invented, or unstable endpoints -> add semantic candidate enumeration;
- weak personalization lift -> add richer episodic retrieval and intent-thread
  tracking;
- route or endpoint failures -> add structural AX, DOM, App Intents, and
  deterministic routes;
- excessive cost or latency -> add local grounding or a multi-model execution
  policy; and
- multi-display failures -> add explicit display-aware capture, grounding, and
  verification.

Working decision: treat the research stack as the north-star architecture and
the current scope as a deliberately thin implementation of the same system
boundaries.

This is not yet an approved architecture.

## Working V1 interaction

A rough V1 could:

- observe the current computer state and recent workflow;
- predict a semantic destination even when it is not currently open or visible;
- rank currently available destinations directly and generate a bounded route
  to hidden destinations when needed;
- display one completion only when confidence is high;
- execute the completion only after Dylan presses Tab; and
- remain silent otherwise.

Here, “not currently present” means that the destination is not already open
or visible on screen—for example, a closed app, unopened document, absent
browser tab, page that must be searched for, or task that must be reopened.
Ordinary computer-use systems can often reach these destinations when the user
states the goal explicitly: they launch an app, search or navigate, and execute
a sequence of UI actions. The proposed product would reuse that routing
capability after inferring the unstated destination from personal context.

Predicting a destination that is not currently present introduces an
unresolved interaction decision. One accepted prediction *could* correspond
to several low-level UI actions, analogous to a code completion inserting
more than one character. But it could instead reveal or stage a route, execute
only its first action, or require another confirmation before continuing.
The product should not yet assume that one Tab always authorizes an entire
route.

The first version does not need to predict every action. It can specialize in
high-confidence transitions such as:

- working document -> recurring Codex task;
- completed Codex response -> working document;
- source note -> active drafting task; or
- one recurring browser tab -> another.

### Ideal authority boundary: execute until a commit point

The ideal interaction is not simply “one Tab equals one click” or “one Tab
equals the whole route.” It is:

1. Tab accepts a predicted destination or action.
2. The system may perform the reversible navigation needed to prepare it.
3. The system stops at a **commit point**.
4. The interface makes the pending consequential action explicit.
5. A fresh Tab authorizes that action.

Example: if Dylan is in Codex and the predicted next action is to send an
email that is already drafted in Arc, the first Tab could navigate to the
correct Arc window and email, then focus or reveal the Send control. It would
stop and display “Tab to send.” A second, separately interpreted Tab would
click Send.

The system ideally does almost everything except authoring content through
typing. Navigation, focusing, opening, scrolling, and selecting can be part of
the preparation route. Editing, submitting, sending, publishing, deleting,
purchasing, committing, running consequential commands, or otherwise
mutating durable state should introduce a new approval boundary. Whether
the route requires keystrokes is not itself the boundary: machine-entered
locator text—such as an email subject in search, an app name in Spotlight, or
a URL—may execute inside the preparation route when it is ephemeral routing
machinery rather than authored content.

This is the product vision, not yet an MVP commitment. A first implementation
may need a narrower action allowlist, fewer supported applications, shorter
routes, or stepwise execution in exchange for lower latency, lower safety
complexity, and easier debugging.

Working decision: when execution misses its promised endpoint, the executor
may inspect the resulting state and make one bounded recovery attempt. Every
recovery action must remain reversible and inside the frozen visible promise.
It stops on a second failure, uncertainty, user input or `Escape`, scope
expansion, or a consequential commit point, then reports that the route could
not be completed.

### Working hypothesis: adaptive completion granularity

The product should not necessarily force every prediction into the same unit.
At a given state, plausible completions may exist at several horizons:

- primitive action: “Focus Arc”;
- semantic destination: “Open Alice's draft”; or
- bounded workflow: “Prepare Alice's draft to send.”

The model can propose candidates at these different levels, but raw model
probability should not directly determine what Tab arms. Probabilities across
different horizons are not necessarily calibrated or comparable. A trivial
focus action may be highly likely but save almost no effort, while a longer
route may be somewhat less likely but much more useful.

A separate completion policy should choose among proposed candidates using:

- probability that the inferred destination is correct;
- probability that the route can execute successfully;
- time and effort saved;
- cost of a wrong interruption or route;
- reversibility and commit-point risk;
- confidence calibration from Dylan's accept and reject history; and
- whether a shorter safe completion can be offered when a longer one is too
  uncertain.

Conceptually, the system should maximize expected usefulness rather than raw
next-action probability:

`expected value = correctness × effort saved - error cost - risk cost`

The policy can back off hierarchically. If “prepare Alice's draft to send” is
too uncertain but “focus Arc” is reliable and still useful, it can offer the
shorter completion. If no candidate clears the usefulness threshold, it should
remain silent.

Working decision: there is no hard minimum number of actions a completion must
save. A highly confident one-click or one-gesture completion remains eligible,
but its display threshold should be higher because the potential benefit is
smaller. Repeated acceptance can lower a shortcut's threshold; repeated
ignoring can raise it or suppress that shortcut.

The wording shown to Dylan must match the scope authorized by that Tab. If the
first Tab only opens and stages a draft, it should say “Open Alice's draft” or
“Prepare Alice's draft to send,” not “Send Alice's draft.” The subsequent
commit-gated suggestion can separately say “Tab to send.”

Working decision: the visible suggestion describes only what the current Tab
will fully accomplish. The system may internally infer a larger eventual goal,
but it must not use that larger goal to overstate the scope Dylan is accepting.

Working decision: the initial interface displays only one adaptive completion.
The system silently retains and logs its top-three candidates for evaluation,
calibration, and later product decisions. Lower-ranked alternatives are not
initially exposed in the interface.

Working decision: the V1 suggestion surface is a compact, non-focus-stealing
pill attached to the active window, preferably near its bottom center. It
shows the exact completion plus concise `Tab` and `Escape` affordances, moves
with the active window to the correct display, and disappears immediately
when accepted, dismissed, expired, or invalidated. Contextual anchoring near a
caret, control, or pointer is deferred until real use shows that the stable
window-relative surface is too easy to miss.

Working decision: after Tab is accepted, the pill becomes a compact execution
status for the same frozen promise, for example `Opening Patch NAP in Codex…
Esc to stop`. It does not narrate primitive clicks. It disappears on verified
success, briefly reports a route failure, and becomes a new separately
actionable suggestion if execution reaches a consequential commit point.

### Invocation and display timing

The product does not need to run an expensive prediction model continuously.
It can separate three functions:

1. a cheap local observer continuously maintains recent state and actions;
2. an event-driven gate decides whether the user may be at a decision point;
3. the expensive predictor is called only when that gate opens.

Potential decision-point signals include:

- foreground app, window, tab, document, page, or conversation changes;
- a long-running operation or model response completing;
- a short pause after a meaningful UI action;
- the user stopping typing, scrolling, or moving rapidly; and
- an explicit prediction hotkey.

The call and the display do not need the same trigger. A likely sequence is:

1. a meaningful state transition occurs;
2. a short debounce confirms that the state is stable;
3. prediction begins speculatively;
4. any new user action cancels or invalidates the pending result;
5. a current result is displayed only after the user pauses and only if it
   clears the confidence and expected-usefulness threshold; and
6. ignored suggestions create a cooldown rather than immediately reappearing.

This policy should cache repeated states, discard stale responses, and avoid
calling on a fixed clock. Exact debounce, idle, cooldown, and latency budgets
remain empirical MVP questions.

Working decision: prediction is proactive by default at detected decision
points, with a manual-key fallback. The system should start speculative
inference shortly after a meaningful state transition rather than waiting a
full second before making the call. Display remains separately gated on the
result being current, sufficiently useful, and timed to a user pause.

Working decision: Tab is intercepted only while a visible completion is
armed. When no completion is visible, Tab preserves its normal application
behavior. A separate configurable hotkey manually requests a prediction.

### Feedback semantics

The system must not collapse every non-accept into a negative label:

- accepting with Tab is strong positive evidence;
- an explicit dismissal is strong negative evidence;
- performing another action provides counterfactual behavioral evidence but
  does not necessarily prove the suggestion was useless;
- ignoring or letting a suggestion expire is an ambiguous non-accept;
- an accepted prediction whose route fails is an execution failure, not
  necessarily a prediction failure; and
- a result invalidated by intervening state changes is stale and receives no
  user-feedback label.

Working decision: ignored suggestions are logged separately as ambiguous.
Only explicit dismissal is treated as clear negative feedback. This prevents
poor timing, low value, or deferred intent from being mislabeled as an
incorrect destination.

Working decision: while a completion is visibly armed, `Escape` explicitly
dismisses it and records strong negative feedback. Continuing work through
another click or keystroke, allowing the suggestion to expire, or changing
state does not become an explicit rejection; it is classified separately as
an override, ambiguous ignore, or stale result based on what occurred.

#### Relationship to Cursor Tab's feedback loop

Cursor's published online-RL description is directionally similar but appears
more binary. Its simplified example assigns positive reward to accepted
suggestions, negative reward to shown suggestions that are not accepted, and
zero reward when no suggestion is shown. Cursor says its real reward is more
complicated and accounts for suggestion size, cursor jumps, and subsequent
suggestions.

Cursor does not publicly document a taxonomy separating explicit dismissal,
passive expiry, a different user action, stale pre-display results, and
execution failure. Its public description therefore does not establish that
it makes the distinctions proposed here. Computer-use autocomplete also needs
a separate execution-failure label because an accepted multi-action route can
fail after the destination prediction was correct.

The product should preserve the fine-grained raw events above, then decide
later how much weak reward or penalty each class receives. This retains the
option to test a Cursor-style binary reward without permanently labeling every
ignore as a strong negative.

Source: [Improving Cursor Tab with online RL](https://cursor.com/blog/tab-rl).

## Personal prototype success criterion

Working decision, July 30, 2026: the primary success signal is **habit
formation**. After using the prototype during normal work, Dylan should
naturally reach for Tab and notice when the tool is unavailable.

Acceptance rate, correct-prediction rate, accepted-route success, useful
completions per day, time saved, and disruptive failures remain important
diagnostics. They explain why the habit did or did not form; they do not
replace the primary qualitative judgment of whether Dylan voluntarily keeps
the tool enabled and misses it when absent.

## The prediction target is still unresolved

There are two related but different objectives:

1. **Behavioral prediction:** what would Dylan literally do next?
2. **Intent compression:** what useful action best advances Dylan's inferred
   goal, even if it skips several manual steps?

The V5 dataset was behavioral: one physical invocation to the next. The
product may ultimately be more valuable when it predicts the second objective.
Cursor-style autocomplete is valuable because the accepted completion can
compress work, not merely imitate the exact sequence the user would otherwise
perform.

This distinction affects labels, evaluation, and feedback:

- literal next-action accuracy can be scored against recorded behavior;
- better-shortcut quality requires counterfactual human judgment;
- acceptance is evidence of usefulness but can also change future behavior;
  and
- a multi-step semantic completion requires a different authority and recovery
  model from a one-step destination jump.

### Working bottleneck hypothesis

The video-native models do not change every part of the problem equally.
FDM-1 is unusually well matched to literal goal-free next-action prediction:
it consumes long frame/action histories and predicts primitive computer
actions without requiring a natural-language instruction before each action.
Its long-video representation and inverse-dynamics labeling pipeline could
materially improve the temporal signal lost when recent work is compressed
into sparse screenshots and text rows.

Photon-1 attacks a different bottleneck. Its published computer-use flow is
still instruction-conditioned: it imagines a desired next state, then emits an
action intended to reach it. That may improve route planning and grounding
after another layer has inferred Dylan's latent objective, but the public
evidence does not show that Photon independently infers a personal unspoken
goal.

Neither model, as publicly described, supplies the whole autocomplete policy.
FDM's most probable primitive action may reproduce low-value habits rather
than choose the most useful semantic completion. Neither establishes
user-specific adaptation, calibrated abstention, exact visible promises,
commit gating, or a supported Mac integration.

The current working bottleneck order for a personal prototype is:

1. infer a useful latent completion from high-fidelity recent personal
   context and know when to abstain;
2. make that context available without a fragile manual labeling pipeline;
3. invoke and execute an accepted completion quickly and reliably on Dylan's
   actual Mac; and
4. preserve truthful scope, cancellation, verification, and commit boundaries.

For FDM-1 or Photon-1 specifically, availability and integration are an
earlier binary blocker: there is no public API or released weight path
established in the current research. Founder outreach is therefore worth
running in parallel, but the personally usable prototype should not wait for
access.

## What may be reusable

- visual UI understanding;
- Accessibility- or DOM-backed control grounding;
- app and webpage navigation policies;
- coordinate and structured action output;
- action execution and state verification;
- trajectory handling; and
- safety controls developed for computer-use agents.

## What is likely new

- personal-history ingestion and retrieval;
- latent-goal inference without a typed instruction;
- user-specific destination ranking;
- stable candidate identity across apps and time;
- confidence calibration and abstention;
- autocomplete-level latency;
- a visible but non-disruptive Tab interaction;
- accept, ignore, override, and outcome feedback; and
- adaptation without collapsing behavior toward the most common destinations.

## Data and learning hypothesis

Fine-tuning is not assumed to be necessary for V1.

A first system could use:

- an off-the-shelf computer-use model;
- the current screenshot and structured UI state;
- a list of executable candidates;
- recent actions;
- retrieved analogous personal transitions; and
- an explicit option to abstain.

Personal data initially serves three purposes:

1. retrieval examples;
2. evaluation of out-of-time predictions; and
3. evidence for whether the product interaction is useful.

Fine-tuning becomes relevant only if a computer-use model with strong
grounding, structured candidates, and relevant retrieved history still makes
systematic intent or ranking errors.

### MVP privacy and deployment posture

Working decision: locality is not a hard MVP requirement. Choose the
architecture that produces a useful test fastest and with the least
engineering complexity, including cloud-hosted history or remote inference if
that materially accelerates the MVP. Revisit local-first storage, selective
context disclosure, encryption, retention, and production security before
expanding beyond the initial controlled user.

Even a speed-first prototype should not record or transmit raw credentials,
private keys, access tokens, passwords, seed phrases, or similarly obvious
secrets.

### MVP platform and application scope

The MVP can be Dylan-only on one known Mac without being restricted to an app
whitelist. A general computer-use model should remain free to perceive and
operate any accessible application surface. Arc, Codex, VS Code, Obsidian, and
other high-frequency apps can form the initial evaluation and hardening set,
not the product's permitted application set.

App-specific integrations may improve browser-tab identity, event triggers,
grounding, latency, or commit-point detection, but they should be optional
accelerators rather than a requirement for the model to attempt an action.
Unknown or weakly grounded applications may receive lower confidence or cause
abstention rather than being categorically excluded.

Working decision: constrain the initial user and environment, not the
application surface. The MVP is Dylan-only on one known Mac but remains
best-effort general across applications. High-frequency apps are the initial
evaluation and hardening set only.

### Staged context strategy

Building a high-fidelity, long-term personal context collector may be a major
project independent of the autocomplete interaction. The work should
distinguish three stages:

1. **Current-state plumbing baseline:** current screenshot plus immediately
   available app, window, and UI state. This can validate model integration,
   suggestion display, Tab acceptance, execution, commit gates, cancellation,
   and latency. It cannot validate the core history-conditioned product thesis.
2. **Minimum-context MVP:** current state plus a short recent-session buffer
   assembled from existing operating-system events, screenshots at meaningful
   transitions, active app/window metadata, and any other reliable
   off-the-shelf signals. This is the smallest version that can test whether
   recent personal behavior improves useful predictions.
3. **Full personal context layer:** durable cross-session history, semantic
   retrieval, richer destination identity, long-horizon workflow patterns, and
   scalable data collection. This should follow only if the earlier interaction
   and model feasibility tests justify it.

Current recommendation: build or evaluate the current-state baseline first,
but call it a plumbing and execution prototype rather than the product MVP.
Require at least a minimal recent-session context buffer before claiming to
test the differentiated product.

A separate research task should audit existing context collectors,
computer-use recorders, accessibility and browser instrumentation, activity
stores, and model-native video/history inputs against an explicitly scoped
minimum-context packet. Do not dispatch that research until the minimum packet
requirements are agreed.

Status, July 30, 2026: the minimum packet is agreed and the component audit is
complete. The fastest credible stack is a reduced Hammerspoon observer, the
existing Arc tab/navigation adapter, one-shot transition screenshots, and a
product-owned SQLite episode ledger with tagged model actions. Screenpipe is
optional debugging/search context rather than the authoritative event stream.
The exact event schema, component matrix, alternatives, risks, and falsifying
calibration are in
[[computer-use-autocomplete-mvp-context-stack-2026-07-30|The fastest credible
MVP context stack is a thin Mac observer plus a product-owned ledger]].

#### Concrete minimum-context system

The MVP context system can be only four small conceptual pieces:

1. **Event observer:** notices meaningful events already needed by the product,
   such as app/window changes, clicks, key commands, navigation, idle periods,
   completed model responses, and Tab feedback.
2. **Rolling buffer:** keeps the most recent meaningful metadata events. It is
   a bounded timeline, not continuous video or screenshot capture.
3. **Prospective episode ledger:** persists prediction opportunities,
   candidates, feedback, executed routes, human follow-up actions, and
   resulting states so the usable history grows after installation.
4. **Context packet builder:** when a prediction is triggered, selects the
   current state and a short slice of the recent timeline for the
   computer-use model.

A first prediction packet could contain:

- active app, window, page, tab, or document identity when cheaply available;
- focused role and a bounded set of allowed open-window titles;
- a chronological text representation of the last several meaningful events;
- recent accepted, ignored, or overridden completions when relevant.

Exact event counts and time windows should be tuned empirically. The first
version does not require embeddings, semantic task graphs, exhaustive DOM or
Accessibility capture, manually verified action labels, continuous
full-resolution video, or long-term history retrieval. It begins mostly empty,
then gains useful recent context and clean product-interaction episodes as
Dylan uses it.

Working decision: this rolling recent-event buffer plus prospective episode
ledger is sufficient as the MVP context system. Long-term semantic memory and
high-fidelity continuous capture are explicitly deferred.

### Prospective event ledger

The MVP should collect clean go-forward evidence from the moment it starts
running. This is not an optional full recorder or historical reconstruction
project. The trigger, prediction, display, feedback, cancellation, and
execution systems already produce most of the required events, so persisting
them has relatively low marginal complexity and is necessary for debugging.

At each prediction opportunity, store when available:

- timestamp and trigger reason;
- current screenshot or state packet;
- recent context supplied to the model;
- the silent top-three candidates, scores, and proposed completion scope;
- whether a suggestion was displayed and which one;
- accept, explicit dismissal, ignore, expiry, cancellation, or invalidation;
- the route attempted and each observed execution result;
- the next human action or destination that the event listener can recover;
  and
- the resulting state.

Do not store only accepted Tabs. That would create selection bias, hide the
actions the model failed to propose, and cause the personalized history to
collapse toward the model's own behavior. Preserve the complete opportunity
stream while retaining the feedback distinctions above.

Accepted suggestions produce particularly clean state -> prediction ->
execution -> outcome examples. Non-accepted opportunities remain valuable for
calibration and for reconstructing what Dylan did instead, even when they
cannot be treated as simple negative labels.

### MVP success gates

The MVP has three sequential success claims:

1. **End-to-end feasibility:** the system proactively predicts, displays a
   truthful completion, accepts Tab, executes within scope, verifies the
   endpoint, and respects commit boundaries.
2. **Context contribution:** the rolling recent-history packet improves
   predictions over the same system using only the current state.
3. **Sustained personal usefulness:** Dylan wants to leave the system running
   during real work because it regularly saves effort without becoming
   annoying.

Working decision: sustained personal usefulness is the primary MVP success
claim. Technical feasibility and history lift are supporting diagnostic gates,
not sufficient endpoints by themselves.

Working decision: the initial habit-formation trial runs for five normal
workdays and should include roughly 50 displayed suggestions before drawing a
product conclusion. It is followed by a deliberate half-day with the tool
disabled. The primary read is whether Dylan instinctively reaches for Tab and
notices the missing completions; the logged quantitative metrics diagnose why
that habit did or did not form.

Because the first prototype is Dylan-only, it does not require an extended
shadow rollout. Before the five active days, run only a short technical sanity
check over roughly five to ten opportunities to verify current-state capture,
stale-result cancellation, truthful suggestion scope, and the absence of
accidental consequential actions. Then enable reversible Tab completions
immediately. Commit gates remain enforced throughout.

The product should log current-state-only and history-conditioned top-three
predictions at the same eligible decision points when cost permits. This
preserves a prospective context-lift comparison without requiring another
manually reconstructed retrospective dataset. Only one prediction is eligible
for display under the active product policy.

The scalable-data bottleneck remains real. Existing tools record screens,
inputs, applications, and partial UI semantics, but Dylan did not find a
low-friction tool that automatically turns natural work into verified
pre-action-state -> exact-next-action examples. A larger experiment needs
either a much faster review workflow or a collection layer that proposes rows
for correction.

## Approved V0 contract

Working decision, revised July 31, 2026: **log everything, run almost
nothing.** V0 should preserve the evidence needed to diagnose usefulness and
history lift while executing only the smallest deterministic navigation
surface that covers the V5 wins.

The complete V0 is:

1. Observe metadata-only active app/window identity, exact Codex task identity
   when available, focused role, bounded open-window titles, and a short
   chronological event buffer. The buffer
   records interaction shape such as typing, scrolling, focus, and idle
   boundaries without storing literal keystrokes or clipboard contents.
2. Trigger proposal calls after a meaningful app/window transition, an
   observable LLM-response completion, or the end of a typing, scrolling, or
   interaction burst followed by stable idle. Retain a manual hotkey fallback.
   Cancel or discard a proposal as soon as activity makes its context stale.
3. Ask the proposal provider for three ranked structured completions but
   display only the best fresh, executable completion in a compact
   active-window pill.
4. Let Tab accept the visible completion and Escape dismiss or stop it. Tab is
   armed only while a fresh suggestion is visible, no typing burst is active,
   the context epoch is unchanged, and the focused control is neither editable
   nor sensitive. Otherwise the physical Tab passes through untouched.
5. Restrict execution to three deterministic primitives: activate an
   application, focus a window, and focus a named Codex task through the
   structured adapter. Unsupported predictions—including dormant URL
   completions—may be logged but are not displayed or executed.
6. Use no computer-use execution model in V0. Codex app-server and Claude Code
   headless are proposal-provider candidates behind the same tool-free
   contract. Visual computer use remains later evidence-driven expansion.
7. Persist the complete immutable episode row and exact input-packet
   references for every prediction opportunity: trigger; context epoch and
   packet; silent top three; displayed candidate; returned, failed, cancelled,
   or stale state; accept, explicit dismissal, ignore, expiry, or override;
   first later human event when observable; allowlisted route and dispatched
   primitives; endpoint verification and failure reason; and proposal,
   acceptance, first-action, and completion timestamps.
8. Measure state-only performance offline by replaying stored packets with
   history removed through a frozen model, prompt, and schema. Do not double
   live inference cost merely to preserve the comparison. Treat replay as a
   product diagnostic rather than a perfectly contemporaneous randomized
   experiment.
9. Judge the prototype primarily by whether Dylan naturally starts reaching
   for Tab and notices when the tool is unavailable.

Before building the rest of the product shell, run three tightly timeboxed
feasibility probes:

1. **Proposal latency:** send the same representative real packets through
   Codex app-server and Claude Code headless under the same tool-free structured
   output contract. Collect at least five valid calls per provider, record cold
   and warm validity and latency, and use roughly 2.5 seconds p50 as the initial
   stale-by-default kill screen rather than a permanent product standard.
2. **Codex task identity:** verify that the observer can recover and retain the
   exact active Codex task ID and readable title across task changes and place
   that identity in the chronological packet. This is load-bearing because the
   named recurring task supplied the V5 history lift.
3. **Tab safety:** verify across controlled typing and navigation trials that
   active typing, editable focus, sensitive focus, stale context, or no visible
   suggestion always causes Tab to pass through. One stolen keystroke blocks
   the active habit trial.

Keep the synthetic secret fail-closed test before any real packet is sent to a
cloud model. Explicitly defer the Arc extension, computer-use fallback,
semantic granularity policy, sophisticated confidence calibration, forced
suggestion quotas, elaborate recovery, candidate enumeration, long-term
semantic memory, automatic personalization or fine-tuning, formal shadow
experiments, and production-grade multi-user architecture.

The five-day and roughly 50-suggestion framework above remains a rough usage
lens, not a quota or calibration system. V0 should not lower a threshold to hit
a count, implement daily threshold tuning, or block ordinary use on
statistical sufficiency.

No additional product-scoping questions are required before the design step.
Write one concise integrated design around this contract, then move to the
implementation plan only after review.

### August 1 implementation finding

The exact Codex-task feasibility probe failed. The app exposes thread
list/read, completion events, and an exact registered deep link, but no approved
public surface exposes which thread is active in the desktop UI, so the route
cannot be reread and verified after focus. The V0 plan stops before the Tab
gate/pill rather than replacing `focus_codex_task` with generic Codex
activation. See
[[computer-use-autocomplete-task-5-codex-identity-probe-2026-08-01|The Codex
desktop app does not expose exact active-task identity through the approved
public surfaces]].

That stop decision is now superseded for V0 by an activity-derived identity
amendment. A public-AX spike can read the selected title and exact deep links
route correctly, but two immutable attempts could not make the title-to-ID join
reliable enough for authority. V0 will therefore retain exact app-server thread
IDs for product-owned dispatches, verify immediate arrival as
`observed_partial` when Codex is frontmost, and promote identity only when a
qualifying observable task event corroborates it. Manual/read-only visits stay
app-level, exact-task and app-only labels are separate strata, and generic
Codex activation remains forbidden. The subsequent frozen event-visibility
probe showed that the planned standalone listener observed none of three
desktop-originated sends. Task 6 therefore remains blocked; the activity-derived
amendment did not restore an exact-task signal. See
[[a-standalone-codex-app-server-listener-cannot-observe-desktop-originated-task-events|the event-visibility finding]].

The push failure was subsequently narrowed rather than repaired. A
preregistered pull variant passed `3/3`: after a desktop-originated send, the
expected app-server thread ID's `recencyAt` and raw list position changed by the
first scheduled read in all three distinct tasks. V0 therefore uses
read-derived identity for composer-concentrated next-human labels, injects the
thread list as its exact-ID/title Codex candidate catalog, and leaves read-only
visits app-level. Task 6 is unblocked; title joins and generic Codex activation
remain forbidden. See
[[codex-thread-list-recency-reveals-desktop-originated-task-activity|Codex
thread-list recency reveals desktop-originated task activity]].

Phase zero then completed on August 2. The physical seven-cell Tab matrix and
four-cell armed-privacy matrix passed, the missing network-disabled provider
transport proof found zero canary bytes, and the aggregate verifier froze PASS
under manifest
`f4455bc12722af009a6acbc4c489c57b37cf499785991a27edaf1f14b7daedc3`.
The V0 now moves to its runtime ledger and five-axis state machine rather than
another feasibility probe.

Task 13's August 3 controlled sanity reached one real provider result but did
not reach a displayed candidate or action. The runtime candidate passed
`587/587` automated tests, installed-Spoon preflight, deterministic sanity
`10/10`, and SQLite integrity. The exact empty-payload bridge mismatch was fixed
and verified live; one opportunity then completed with a valid abstention. A
second opportunity exposed a new state-ownership race: two paths attempted to
apply `context_stale`, and the reducer correctly rejected the duplicate
validity transition. The retained ledger has eight episodes—six
cancelled/stale, one current abstention, and one pending/stale—with zero
candidates and zero actions. No sanity tag exists and natural work remains
locked. The next decision is whether stale invalidation becomes explicitly
idempotent or gets one owner; it is not authorization for another unbounded
patch loop or a wider product surface.

## Questions for computer-use model research

- Which existing products and models—including the Induction Labs lead Dylan
  named—are plausible foundations rather than merely adjacent demos?
- Which models can accept screenshots plus Accessibility or DOM state?
- Which emit structured, executable actions rather than prose?
- Which can rank supplied candidates instead of freely generating actions?
- Can the explicit instruction be omitted or replaced with behavioral history?
- Can the model expose usable confidence or support repeated sampling cheaply?
- What are the latency and hardware requirements?
- Can it ground to apps, windows, browser chrome, webpages, and native
  controls?
- Does it support macOS directly, or only benchmark/browser environments?
- Can it navigate to destinations that are closed, hidden, or absent from the
  current screen?
- Can it execute a bounded multi-action route, verify arrival, and stop
  reliably?
- Can its policy be used without granting open-ended autonomous authority?
- Are weights or APIs available for adaptation?
- What data was it trained on, and how close is that data to natural personal
  computer use?

## Candidate research comparison

The first research pass should compare model families on:

| Dimension | Question |
| --- | --- |
| State input | Screenshot, Accessibility tree, DOM, app/window metadata |
| Conditioning | Explicit goal required versus history or candidate support |
| Output | Coordinates, structured action, semantic target, or trajectory |
| Candidate ranking | Can it rank a supplied live destination set? |
| Grounding | Native apps, browser content, browser chrome, cross-app actions |
| Control | One action and stop, abstention, user confirmation |
| Latency | Fast enough for autocomplete rather than background agency |
| Adaptation | Prompting, retrieval, fine-tuning, or open weights |
| Platform | macOS support and feasibility |
| Evaluation fit | Can it be tested on Dylan's frozen or newly collected rows? |

The first research pass is complete. See
[[computer-use-autocomplete-model-and-competitor-landscape-2026-07-30|the
computer-use autocomplete model and competitor landscape]].

### Saved research leads

- [[induction-labs-scaling-video-pretraining-with-imagination-models-2026-07-23|Induction Labs: Scaling Video Pretraining with Imagination Models]] —
  Photon-1 predicts a future latent computer state before emitting an action,
  after video pretraining without action labels and smaller action-format
  finetuning.
- [[standard-intelligence-fdm-1-fully-general-computer-action-model-2026-02-23|Standard Intelligence: FDM-1, a fully general computer action model]] —
  a video-native next-action model trained on inverse-dynamics labels over a
  large screen-recording corpus, with long behavioral context.

## Working path from experiment to rough V1

1. Select one plausible computer-use model or API for the first integration.
2. Freeze a two-stage contract: proposal without action, then execution only
   after Dylan accepts the exact visible completion.
3. Build the agreed thin context system: observer, rolling recent-event
   buffer, prospective episode ledger, and packet builder.
4. Implement proactive triggering, stale-result cancellation, one visible
   suggestion, Tab acceptance, commit boundaries, and endpoint verification.
5. Run live shadow mode while logging history-conditioned and
   current-state-only predictions at the same opportunities.
6. Expose Tab for high-confidence reversible completions, then evaluate
   acceptance, execution success, usefulness, annoyance, latency, and context
   lift.
7. Add candidate enumeration, richer retrieval, fine-tuning, or broader
   autonomy only when observed failure modes justify them.

This path is provisional and should not be implemented until the product scope
and research findings are approved.

## Load-bearing open questions

1. Does Tab execute exactly one physical action, jump to one semantic
   destination, or complete a short multi-action route?
2. Is the target literal next behavior or the most useful shortcut toward
   inferred intent?
3. Does the system display one prediction or a ranked top-three slate?
4. What confidence and expected-time-saved threshold justifies interruption?
5. What is the minimum viable personal history before suggestions begin?
6. Which parts of intent inference belong in retrieval, an explicit latent
   instruction, or the computer-use model itself?
7. What is the acceptable latency from state change to armed Tab completion?
8. How does the system avoid overfitting to repetitive destinations and
   narrowing Dylan's behavior?
9. What evidence is sufficient to move from shadow mode to a live
    autocomplete?

Working decision: V1 is not limited to destinations already open or visible.
It should be able to predict a hidden semantic destination and use
computer-use capability to navigate there after Dylan accepts.

Approved MVP decision, July 30, 2026: prediction and execution are two
explicit stages even when they use the same underlying model. The proposal
call may observe state and history but cannot act. It returns ranked
completions and an exact visible promise. Only a fresh Tab acceptance freezes
one completion as an explicit goal and authorizes a separate computer-use
execution call.

> [!important] Runtime recommendation superseded
> The provider/backend choice below is preserved as historical reasoning, not
> a frozen conclusion. The July 30 runtime audit evaluated Codex, Claude,
> Anthropic API, OpenAI API, Gemini API, native macOS control, and hybrids
> against one pre-frozen matrix and bounded local tests. Its current conclusion
> is a product-owned local hybrid with deterministic adapters and a replaceable
> proposal model; it does **not** select Gemini as the first backend. See
> [[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use
> autocomplete runtime decision audit]].

### Codex Desktop Computer Use as the thinnest executor candidate

Dylan already uses the installed Codex Desktop Computer Use plugin during
ordinary work. For the personal MVP, it should be tested before integrating a
separate commercial computer-use API. The existing runtime already provides
Mac Screen Recording and Accessibility permissions, per-app approvals, app
discovery and launch, Accessibility state, screenshots, semantic
element-index actions, coordinate fallback, clicking, typing, key presses,
scrolling, and cross-app operation.

A thin version could use one Codex model in two turns:

1. a proposal-only turn returns ranked completions and cannot use Computer
   Use; and
2. after Tab, a separate execution turn receives the frozen completion as its
   explicit goal and may invoke the installed Computer Use plugin.

The feasibility question moves from “can a model control Dylan's Mac?” to
“can the local autocomplete shell invoke and observe Codex turns with the
installed plugin quickly and reliably enough?” Codex app-server exposes
threads, turns, approvals, history, and streamed events to custom clients, but
the exact programmatic path that preserves the installed Computer Use plugin
must be verified.

Important constraints: the bundled plugin is proprietary and therefore is a
personal-MVP dependency rather than a proven distributable product component.
Official product documentation also says Computer Use cannot automate ChatGPT
itself, so navigation into or within Codex may require a structured Codex
app-server, deep-link, or native app action rather than the Computer Use
plugin.

Revised after the Codex self-control boundary was made explicit: do not make
Codex Desktop Computer Use the sole primary executor. It cannot automate
ChatGPT itself, while Codex is one of Dylan's most frequent destinations.
Treat the installed plugin as a reference implementation and manual route
baseline. Use an app-agnostic public computer-use API as the primary MVP
backend unless a structured Codex adapter is proven trivial and complete.

There are three distinct integration depths:

1. **Codex-task prototype:** easiest. Keep the interaction inside a dedicated
   Codex task and let the model invoke the installed Computer Use plugin. This
   proves proposal and route execution but does not supply the proactive
   global overlay or hotkey experience.
2. **Hybrid personal MVP:** recommended. A small Mac process owns observation,
   triggers, the suggestion overlay, global Tab handling, cancellation, and
   the episode ledger. It sends proposal and execution turns to a local Codex
   app-server client. Codex remains the model and tool host, and the installed
   Computer Use plugin performs accepted actions. The shell consumes streamed
   turn, tool, approval, and completion events.
3. **Directly embed the bundled Mac control runtime:** avoid. The plugin wrapper
   loads a proprietary internal `@oai/sky` package through Codex's trusted
   Node runtime. It is not a documented public SDK or a safe distributable
   dependency.

The hybrid path is moderate rather than trivial. Codex already exposes
non-interactive execution with images, JSON event streaming, and an output
schema, while app-server exposes local transports and generated protocol
bindings. The remaining spike must verify that a custom app-server or
non-interactive turn retains the installed Computer Use plugin, that proposal
turns can reliably forbid actions, that execution actions and approvals can be
observed and interrupted, and that end-to-end latency is acceptable.

### Historical recommended system choice — superseded July 30, 2026

The best current system for the personal MVP is a provider-neutral Mac shell
with Gemini 3.6 Flash Computer Use as the first backend:

`Mac observer + overlay + ledger + action executor -> Gemini proposal call ->
Tab -> Gemini computer-use execution loop`

The shell supplies screenshots and recent context, executes the model's
bounded desktop actions, verifies state, and owns all authority boundaries.
Because the shell—not a provider-specific application—controls the desktop,
Codex is visible and actionable like any other target app. This avoids making
one of Dylan's dominant destinations a special case.

The provider must nevertheless remain replaceable behind two product-owned
methods:

- `propose(contextPacket) -> ranked completions | ABSTAIN`
- `execute(frozenCompletion) -> streamed actions, approvals, state, outcome`

Gemini is selected only if a bounded feasibility spike proves:

- proposal-only structured output works without actions;
- desktop action calls can operate Arc, Codex, and VS Code;
- execution can be observed, cancelled, and stopped at commit points;
- endpoint state can be verified; and
- proposal and first-action latency are usable with speculative invocation.

OpenAI GPT-5.6 Computer use is the next commercial control behind the same
contract. The installed Codex Desktop Computer Use plugin remains a manual
baseline and possible later specialized adapter, not the product backbone.
UI-TARS remains a later local/private option. Do not run a broad model bakeoff
before the Gemini feasibility gates are tested.

### Current runtime conclusion

The runtime audit supersedes the Gemini-first ordering. The fastest credible
personal prototype is a product-owned local shell with deterministic
Arc/VS Code/Codex/Claude adapters, local authority and telemetry, and a
replaceable proposal call. Installed Codex Computer Use remains useful as a
manual route baseline and possible opaque-app fallback, but cannot be the sole
executor because it hard-blocks Codex itself. No public API provider earned
selection without credentials, a common Mac actuator, and comparable local
latency/route evidence.

## Historical next brainstorming question

Should Gemini 3.6 Flash Computer Use be the first app-agnostic MVP backend,
with OpenAI GPT-5.6 as the fallback and Codex Desktop Computer Use retained
only as a reference baseline?

## Links

- [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]
- [[computer-use-nap-v5-expanded-history-results-2026-07-30|Workflow history produced five exact top-three wins and no losses in NAP V5]]
- [[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what a first navigation autocomplete still needs]]
- [[workflow-history-can-recover-recurring-destinations-without-general-next-action-competence|Workflow history can recover recurring destinations without general next-action competence]]
- [[a-first-computer-navigation-autocomplete-should-rank-candidates-and-abstain|A first computer navigation autocomplete should rank candidates and abstain]]
- [[day-0-took-three-days|The Missing Step Between Recording and Prediction]]
- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-autocomplete-mvp-context-stack-2026-07-30|The fastest credible MVP context stack is a thin Mac observer plus a product-owned ledger]]
- [[computer-use-autocomplete-runtime-decision-audit-2026-07-30|Computer-use autocomplete runtime decision audit]]
