---
type: inbox
status: hunch
created: 2026-07-22
updated: 2026-07-22
confidence: medium
domains:
  - personalized-ai
  - human-computer-interaction
projects:
  - personal-ai-context-learning
sources:
  - google-deepmind-ai-value-alignment-for-evolving-social-norms-2026
  - omar-shaikh-computer-use-personalization-stack-2026-07-22
  - dylan-niyant-computer-use-nap-followup-2026-07-22
people:
  - dylan-vu
  - niyant
  - omar-shaikh
orgs:
  - general-user-models
aliases:
  - tab autocomplete for computer navigation
  - next-action autocomplete for the desktop
  - personalized computer action autocomplete
tags:
  - hunch
  - next-action-prediction
  - autocomplete
  - computer-navigation
  - predictive-ui
  - semantic-routing
---

# Tab could autocomplete the next computer action

## Origin

Dylan, 2026-07-22:

> a personalized tab autocomplete nap like feature for navigating your computer
>
> e.g., once a scroll to the end of an article on arc, the model predicts i'll want to focus on my codex app input field and allows me to hit "tab" to do so. can even present like top 3 picks of next actions hotkeyed to tab, shift, whatever

## Hunch

Text autocomplete predicts the next token. This product would predict the next semantic computer action and offer a one-key completion.

After Dylan reaches the end of an article in Arc, the system might show:

- Tab: focus the Codex input for the active project
- another stable hotkey: open the related Obsidian note
- another stable hotkey: return to the previous work window

The shorthand is: **Tab completes the workflow, not the text.**

The value is not merely avoiding Cmd-Tab. A good completion should preserve working context by landing on the exact app, window, project, and control needed for the next thought.

## Product thesis: intent compression

Dylan is especially drawn to high-craft, keyboard-first UX products such as Superhuman and Cursor Tab. Their shared appeal is **intent compression**: anticipate a likely intention, surface it without interrupting the user, and let one reversible confirmation replace several operations.

- Superhuman compresses known workflows into fast keyboard actions.
- Cursor Tab predicts and compresses the next code edit.
- This concept predicts and compresses the next meaningful computer action.

The standalone product thesis is: **autocomplete should extend beyond text and code to the next meaningful computer action.** A strong version would be frequent, instantly legible, effortless to ignore, cheap when wrong, and valuable before the system is trusted with consequential authority.

This creates a different starting lens from the broad personal-AI thesis. Next-action prediction can be valuable as a user-facing interaction primitive even before it demonstrates that a system understands a person's goals. Felt acceleration and interface quality are first-class evidence, not merely packaging around a model.

## Product and forcing function

Prediction can play two roles at once:

- **As the product**, it saves interactions, preserves attention, and moves the user into the right working state.
- **As a forcing function**, it gives the context system a concrete test: using only information available beforehand, can it identify the next useful action?

Requiring prediction forces the underlying pipeline to preserve timing, visibility, provenance, meaningful action boundaries, and user-specific patterns. But strong prediction does not automatically imply deep understanding. A transition model could learn "after Arc, Dylan usually opens Codex" without knowing why the article matters or what Dylan intends to accomplish.

Prediction is therefore a useful forcing function only if improvements eventually transfer into lower briefing cost, better context selection, saved work, or better outcomes. Otherwise the system may be optimizing an interesting benchmark rather than the painful workflow.

## Capability gradient

Better intent compression should require progressively stronger personalization, intent prediction, and goal understanding, but the requirements are graded rather than binary.

| Compressed action | Likely requirement |
|---|---|
| Focus Codex after Arc | Immediate state plus personal habits |
| Focus the correct Codex task and input | Task-state and local-intent inference |
| Bring the relevant article passages | Relevance judgment plus a representation of the local goal |
| Draft the prompt Dylan was about to write | Semantic personalization |
| Produce a better prompt than Dylan would have written | Goal understanding plus proposal quality |
| Complete several steps | Persistent goals, world state, safety, and authority |

The progression is:

> predict my behavior → infer my immediate intent → represent my objective → propose a better route to it

App switching can test the first step. It cannot by itself establish the later ones. Operationally, "goal understanding" would mean choosing useful actions across changed contexts and plausible alternatives, not merely reproducing routine behavior.

## Why this could be a strong first wedge

- It turns Phase 1 next-action prediction into an immediate product interaction.
- Navigation targets form a smaller, more testable action space than arbitrary computer use.
- Focus changes, accepts, dismissals, and the action actually taken create frequent feedback.
- Early actions can remain non-destructive and reversible.
- Personal habits matter: the same screen state can lead different people to different destinations.

## Product boundary

The first version should complete one transition, not a multi-step plan. Safe default actions include focusing, opening, revealing, copying, or preparing an unsent draft. Sending a message, running a command, deleting, buying, or committing should require a separate explicit confirmation and remain outside the first test.

Tab already has a system and application meaning. The product should never steal it unless a visible suggestion is armed. Low-confidence predictions should remain hidden.

## What it would test

This can directly test whether personal event history improves top-one or top-three prediction of the next macro-action over simple baselines such as:

- the most recent app;
- the most common app transition;
- the same transition model without personal context;
- a generic context model without the user's history.

A live version can then test whether accepted completions reduce time or interactions without creating annoyance or mistakes.

It would not by itself validate continual learning, broad computer autonomy, the enterprise context-cost thesis, or Phase 2 preference learning. Once suggestions are displayed, they change the history being predicted. The system must log the exact suggestion set and retain withheld periods.

## Self-fulfilling accuracy risk

A deployed predictor can become more accurate partly by influencing the behavior it later predicts. The loop is:

> past navigation → personal model → visible destinations → selected destination → new training data

This sharpens Niyant's three-app objection. If Arc, Codex, and Obsidian dominate the slate, Dylan may select them because they are convenient and immediately available. Future accuracy then rises even if the system has not learned more about his underlying intent. Destination diversity may fall while the dashboard looks better.

Acceptance therefore cannot be the only success metric. The pilot should:

- preserve shadow-mode predictions and randomized no-suggestion periods;
- randomize slate order so hotkey placement is not mistaken for preference;
- report accuracy separately before and after exposure;
- test recovery when the active project or declared next goal changes;
- include washout periods where Tab suggestions disappear;
- track exact-destination entropy, novel destinations, overrides, reversals, time saved, and task outcomes.

The failure condition is not merely low accuracy. The wedge should also fail if exposure raises accuracy or acceptance while slowing adaptation, narrowing useful exploration, or producing no meaningful work savings.

The design principle is: **compress intentional navigation without compressing the person into their most common destinations.**

## Prior art: Tada and Tabracadabra

[Tada](https://generalusermodels.github.io/tada/) is Omar Shaikh's runnable research platform for personal-AI interfaces. Its Tabracadabra interaction already uses Option+Tab in an existing text field. It captures the current monitor and cursor, runs a research phase that can inspect relevant Tada activity records, and then runs a separate writer phase that streams a continuation or inline answer into the field.

This is close to Dylan's preferred keyboard-first UX but answers a different question. Tabracadabra begins after the user has already chosen the field. It is a **writer**. Dylan's first computer-use NAP must decide which exact field, document, thread, tab, or control the user intends to reach. It is a **router**.

The current Tabracadabra interaction retrieves personal records at inference time and does not require a model trained on the user's longitudinal behavior. It therefore supplies prior art and a possible later baseline, not evidence that learned personal history improves exact destination prediction. See [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]].

Dylan decided not to make a Tabracadabra trial a prerequisite. The direct experiment should test the distinct routing claim.

## Agreed first experiment

Start in shadow mode and record structured semantic focus changes without executing or displaying suggestions. Define a destination such as `Codex → Personal AI task → composer → focus`, not a screen coordinate or the app label `Codex`.

Use one calibration session to freeze the label format, prompt, history window, and simple baselines. Then collect 30–50 chronologically held-out handoffs. Compare top-one and top-three predictions under recency, source-conditioned transition frequency, screen-only context, correct personal history, mismatched history, and correct history plus a declared work-block goal. Allow abstention.

Measure exact-target accuracy, coverage, destination diversity, personal-history lift, label ambiguity, actions avoided, target-search avoided, and whether Dylan would actually use a correct suggestion. The wedge should fail or change target if three destinations dominate, a transition baseline nearly matches the model, correct history adds no lift, labels are unstable, or correct suggestions mostly save one click.

If the offline result survives, replay 10–15 high-confidence cases through a Wizard-of-Oz top-three hotkey mock before building a global Tab interface. Do not add context staging, content generation, or consequential execution until the destination-only rung has independent evidence.

The full contract is in [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]].

## Niyant's reaction and low-entropy objection

In Slack on 2026-07-22, Dylan asked whether the concept fit Niyant's vision:

> **Dylan:** a personalized tab autocomplete nap like feature for navigating your computer
>
> e.g., once i scroll to the end of an article on arc, the model predicts i'll want to focus on my codex app input field and allows me to hit "tab" to do so. can even present like top 3 picks of next actions hotkeyed to tab, shift, whatever
>
> do you have a reaction to something like this? could something like this within your vision or is it outside
>
> **Niyant:** too vague imo
>
> **Dylan:** vague in terms of what specific actions would be tab-able or which part

"Too vague" does not yet distinguish whether the objection is underspecification, insufficient product value, a weak test of semantic personalization, or a prediction target outside the intended vision. The concrete navigation-only test above is designed to force that distinction.

The sharper follow-up is:

> At a defined handoff point, predict only the next app/control I focus within 60 seconds, show `Tab → Codex composer`, and change focus without staging context or executing. Compare it with Cmd-Tab and the most common transition. Is that inside the vision but too weak, or is the prediction target itself wrong?

Dylan's full clarification at 2:55 PM was:

> **Dylan:** yeah, tab or one of 3 hotkeys (for top 3 nap) would take me to where i’d likely want to go next within or across apps, like the next window, input field, or gui button click. basically moving toward replacing most mouse navigation
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
>
> but i’m remembering now you and jakub already considered computer use nap and narrowed to next sentence / prompt prediction. idk to what complexity you guys were considering for computer use nap before you had decided against it

Niyant then updated toward alignment:

> **Niyant:** Internalized a bit more and I think it aligns overall yeah. The ideal goal was to predict the content of the next write given information since to me that implies actually understanding me. But I can see the argument for starting simpler and working up to it. Biggest issue imo from starting that simple tho is I think there's only like 3 apps I really use so it might just learn to always suggest those which isn’t useful
>
> **Dylan:** yeah but i think there could be potentially more diversity when you expand the scope slightly to both intra and inter apps (e.g., webpage navigation + app switching)

Niyant reacted to Dylan's final message with a thumbs-up and did not add another reply. The thread therefore closed with overall alignment and the low-entropy concern still open, rather than with agreement on an implementation.

This narrows the disagreement. Niyant sees the concept as aligned with the overall vision and accepts a simpler starting point in principle. His remaining objection is that app-level prediction may have very low entropy: if three apps dominate, a frequency baseline can look accurate while producing little value. His preferred target remains the content of the next bounded write because novel semantic content is more likely than a routine app transition to require a representation of what the user is trying to accomplish.

The response should not be to indiscriminately include every click. That would add a large, unstable, noisy action space and much heavier capture requirements. The cleaner expansion is from app labels to **semantic destinations and structured macro-actions**.

## Structured action resolution

The formal Phase 1 write target already decomposes an action into domain, location, operation, and content. The Tab concept can use the same structure as a diagnostic ladder:

1. **Domain:** Codex, Arc, Obsidian, Slack.
2. **Location:** the exact thread, browser tab, document, block, or input control.
3. **Operation:** focus, open, click, search, append, edit, or submit.
4. **Content:** the actual prompt, sentence, query, message, or edit payload.

For example, `Codex` is not a sufficiently useful prediction. `Focus the composer in the Personal AI task` is a semantic destination. `Draft a question about whether navigation prediction is too low-entropy` adds the operation and content that move toward Niyant's preferred target.

These levels can be evaluated separately, but they are not guaranteed to teach one another. High app or control accuracy can still come from habit. The key questions at every level are:

- How diverse are the labels?
- How well does the most-common or transition-frequency baseline perform?
- Does personal and semantic context add out-of-time accuracy?
- Does a correct prediction remove meaningful navigation, search, typing, or thought reconstruction?

The lowest rung is useful only if it beats the trivial baselines and delivers felt acceleration. Otherwise, skip directly to the more semantic write or prompt target.

## Contribution decision

On July 22, Dylan asked Niyant what he would have Dylan, or a second pair of hands generally, build to contribute to the vision. Dylan reported that Niyant's answer was to build the computer-use NAP concept.

This converts the idea from an adjacent product interpretation into an explicitly useful contribution path inside Niyant's program. It also gives Dylan a personalization project that does not duplicate Niyant's current static next-write experiment.

The endorsement establishes strategic relevance, not success or exact scope. “Computer-use NAP” could still mean semantic destination routing, broader next-action trajectories, or a live interaction. The agreed first proof remains navigation-only and offline so those later layers are not smuggled into the result. See [[dylan-niyant-computer-use-nap-followup-2026-07-22|the follow-up source note]].

## Nested action ladder

These are normally conditional layers rather than independent products:

1. Predict and focus the destination.
2. Given that destination, select and stage the context needed there.
3. Given the destination and context, draft or execute the next task under a separate authority check.

In the Arc example, the system must first infer that Codex is the next destination before it can autonomously decide what to carry into Codex. Context handoff adds a second prediction: which URL, selection, or document matters for the next step.

The layers can still be evaluated separately for diagnosis. A test can fix Codex as the correct destination and ask only whether the model selects the right article context. That isolates context selection, but it does not make the full product non-conditional.

The natural product sequence is therefore navigation first, then context handoff after the destination is accepted, then consequential execution only under a distinct confirmation and authority model.

## Risks

- A smart app switcher may not save enough time to justify cross-app observation.
- A late or wrong suggestion interrupts the exact flow it is meant to preserve.
- A top-three deck may become visual noise and make the experiment about menu design rather than prediction.
- Accessibility and screen observation create a surveillance-shaped permission request.
- Acceptance is not a clean preference label because seeing the suggestion can cause the action.
- Generic routines may produce useful completions without supporting any claim of goal understanding.
- The research program and the predictive-UX product can appear aligned while optimizing different outcomes: model understanding versus felt acceleration.
- Expanding from three apps to arbitrary clicks can manufacture label diversity while making collection, prediction, and evaluation much noisier.
- A dominant-app or transition-frequency baseline may achieve high accuracy while exposing no meaningful personal signal.

## Promote this hunch if

- personalized predictions beat simple switching baselines on held-out sessions;
- one repeated workflow bridge earns sustained voluntary use;
- users describe preserved train of thought as more valuable than saved clicks; or
- context handoff proves useful without requiring consequential automation.

Demote it if switching heuristics perform just as well, suggestions need constant correction, or users will not grant the observation permissions.

## Links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Phase 1: [[personal-ai-phase-1-next-action-prediction|Can an AI learn what matters to you by watching you work?]]
- Phase 2: [[personal-ai-phase-2-local-preference-learning|Can a better next move train a better AI?]]
- Related: [[personal-agents-need-continuous-local-tracking-not-a-finished-world-model|Personal agents need continuous local tracking, not a finished world model]]
- Insight: [[a-personal-predictor-can-improve-by-making-its-user-more-predictable|A personal predictor can improve by making its user more predictable]]
- Source: [[google-deepmind-ai-value-alignment-for-evolving-social-norms-2026|Google DeepMind: AI Value Alignment for Evolving Social Norms]]
- Prior art: [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- Decision: [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- Experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Tada boundary: [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]
