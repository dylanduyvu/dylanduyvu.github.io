---
type: insight
status: supported
created: 2026-07-28
updated: 2026-07-28
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - evaluation
  - scoring
---

# Exact free-text scoring can mistake label imitation for personalized action prediction

## Claim

When one next-action condition sees prior canonical destination labels and
another sees only screenshots, exact free-text target matching can overstate the
value of history. The comparison mixes behavioral prediction with access to the
evaluator's preferred vocabulary.

## Why It Matters

The intended question is whether personal workflow history helps identify where
Dylan will act next. It is not whether history helps the model reproduce strings
such as `Patch NAP blog prep in vault`.

If target identity and target wording are not separated, a screen-only
prediction can refer to the correct task or field and still fail because it
adds `conversation`, `task`, or `prompt`. A history-conditioned model can copy
the canonical wording from prior examples. That creates an asymmetric scoring
advantage even when both predictions point to the same interface destination.

## Evidence

The 19-pair `BLOG-SMOKE-20260728-V3` comparison used the same
`gpt-5.6-sol` / `max` predictor under two conditions:

- current two-monitor screenshots only; and
- the same screenshots plus every earlier frozen state-action row.

In the preregistered transport-recovered view, screen-only scored 0/19 at
top-1 and top-3. History scored 5/19 at top-1, meaning 5 correct and 14
incorrect, and 6/19 at top-3, meaning 6 correct and 13 incorrect. In paired
win/loss/tie terms, top-1 was 5 wins, 0 losses, and 14 ties because both
conditions were wrong on those 14 targets. Top-3 was 6 wins, 0 losses, and 13
ties for the same reason.

The result contains promising behavioral signal, but every frozen
`accepted_aliases` list was empty. Several failed predictions appeared to name
the labeled destination with extra interface nouns. For example:

- label: `Codex -> Patch NAP blog prep in vault -> composer`
- prediction: `Codex -> “Patch NAP blog prep in vault” conversation -> “Do anything” prompt composer`

The exact scorer rejected the second object's added `conversation` token even
though the apparent task and field were the same.

## Implications

- Use stable destination IDs separate from display prose.
- Freeze aliases before a held-out run, or use condition-blind semantic
  adjudication that judges target identity rather than stylistic wording.
- Give both conditions the same target ontology if the experiment is intended
  to isolate behavioral context.
- Treat the current 20-row smoke as a development set and run a fresh holdout
  after repairing scoring.
- Do not start the roughly 200-row labeling push from the strict exact-score
  gap alone.

## Counterpoints / Uncertainty

Canonical vocabulary can itself be useful personal context. A real system must
eventually map a prediction to an executable app, object, and control, so wrong
application or control identity should still fail.

The smoke sample is also only 19 consecutive targets from one short workflow
sequence. It cannot estimate durable personalization or generalization. The
observed history wins remain promising, but the current experiment cannot say
how much came from behavioral signal versus vocabulary alignment.

## Links

- [[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan, July 28, 2026]]
- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]

## Updates

- 2026-07-28: Created from the first 19-pair retrospective smoke readout.
