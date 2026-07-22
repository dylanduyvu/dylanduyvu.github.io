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
sources: []
people:
  - dylan-vu
orgs: []
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

## Cheapest test

Start in shadow mode on an allowlist of Arc, Codex, and Obsidian. Record structured focus changes, active controls, page identity, and scroll completion without executing anything. Define a semantic label such as "focus Codex project input" rather than a screen coordinate.

Compare personalized top-one and top-three accuracy with recency and transition-frequency baselines. If the model cannot beat those cheap baselines at useful coverage, stop. If it can, expose one visible, non-destructive completion for one frequent bridge and measure acceptance, time saved, dismissals, and reversals.

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
