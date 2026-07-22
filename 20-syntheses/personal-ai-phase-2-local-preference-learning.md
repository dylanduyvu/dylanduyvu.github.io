---
type: synthesis
status: distilled
created: 2026-07-22
updated: 2026-07-22
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - preference-learning
sources: []
people:
  - niyant
orgs: []
aliases:
  - Personal AI Phase 2
tags:
  - personal-ai
  - phase-2
  - local-preference
---

# Can a Better Next Move Train a Better AI?

Phase 1 asked whether truthful personal work history could improve prediction and a limited human–AI task. Phase 2 asks whether a person’s response to a visible suggestion can train the model to make a better suggestion. It starts with one unproven assumption: for this immediate decision, the person’s later action was better than a different but comparable suggestion she saw. This is a research proposal, not a report of experimental findings.

## A wrong suggestion can still teach

The housing-policy student chooses her next Minneapolis search. A proposer, a model, generates three broad searches before she acts. The interface shows two. She submits a distinct query about displacement and low-income renters.

Coactive learning uses her ordinary response instead of a rating. A weak suggestion may expose a missing issue.

Phase 2 begins only if Phase 1 passes. Correctly timed personal history must repeatedly improve predictions over no history, wrong history, and another person’s history. The gain must depend on her work’s content, hold for novel or goal-ambiguous tasks, and leave the model’s general abilities intact. Controlled tests must show displayed suggestions improve the human–AI task without pulling the student too strongly toward one line of thought or reducing her work’s variety. Generic model quality, style imitation, or one good prediction is not enough. If these gates fail, researchers must repair or narrow Phase 1.

## The central bet is local

Phase 2 treats her query as better than each distinct, comparable query she saw. Its later timing, different wording, and human authorship do not prove that judgment. Independent reviewers and real outcomes must test it.

She may be inconsistent. Her authority covers only this decision. It neither makes every human action best nor validates her path.

Exposure may shape her query: it could borrow from one suggestion, combine both, or arise elsewhere. Phase 2 cannot reconstruct what she would have searched without seeing the suggestions or determine which words and ideas came from which one. The comparison goes beyond imitation but does not reveal her complete objective.

## One interaction creates two honest histories

The pre-display history is the exact context frozen immediately before candidate generation and used for all three searches. Researchers must capture and freeze this history at that moment because they cannot reliably recreate it after suggestions appear.

The post-display history is the real event stream before she begins her query. It includes the two shown searches and later pages, messages, and tool results. The third search is absent. Researchers must record events as they happen, not edit the log later.

The behavioral model predicts her action after suggestions, using the post-display history. The proposer update asks what would have been better before she acted, comparing both queries at the same pre-display state. Mixing histories changes the question and makes her action look unaided.

## A comparison exists only when four gates pass

A shown query becomes a labeled loser only if:

- It was visible before the student began acting.
- It addressed the same search decision.
- It was the same kind of action and roughly the same scope.
- It differed in meaning from her query.

Each shown search may pair with her query. The hidden third did not lose. A candidate never shown before action is not exposed.

A copy or paraphrase is behavioral data, but only a tie. No pair is created if she switches tasks, times out, gives no response, deletes work at a different scope, or takes an incomparable action. Silence is not rejection.

The shown suggestions are not ranked. Screen position, viewing time, clicks, selections, and edits do not become labels. The audit record keeps all three suggestions, including the hidden one.

Independent reviewers must audit whether the suggestion appeared in time, addressed the same decision, matched the action’s scope, and differed in meaning. Reports must count generated, shown, valid, tied, incomparable, and unanswered cases. They must ask whether ordinary work produces enough trustworthy pairs. If labels are too sparse or unreliable, Phase 2 fails even if a hand-picked subset looks clean.

## Three models learn three different things

The interaction supports three models:

- The behavioral model predicts her response from post-display history.
- The proposer uses valid pre-display comparisons to improve offers.
- An optional reward model, or critic, scores limited actions so another system can choose among options or test new ones.

The models may share training data or a starting model. Researchers must track each separately, with its own training goal, version history, and release decision. Predicting reactions does not automatically produce good help or a reusable score. Combining both goals should be a separate experiment, not the default. One goal imitates the student’s response after help. The other improves suggestions made before she acts.

## IPO changes the proposer against one exact reference

Identity Preference Optimization (IPO) is the first proposed way to update the proposer. It compares a new proposer with the exact frozen version that generated the shown searches. It gives the student’s query a modest rather than ever-growing advantage.

This limit is conservative because labels may be noisy. Direct Preference Optimization (DPO) can keep rewarding larger gaps and remains a diagnostic. Researchers should not assume IPO is better than DPO or its chosen gap is correct.

Each preference comparison belongs to the proposer version that generated the shown suggestion, so researchers must judge it against that same version. Behavioral examples can be reused because they record what the student actually saw and did. To reuse an old preference pair, researchers must preserve either the original proposer or scores calculated and saved from it; data for a critic must be evaluated separately.

At the start of each collection round, researchers should first copy the accepted behavioral model and freeze that copy as the baseline proposer. It generates that round’s suggestions; they then train and evaluate a new proposer against it while keeping the roles and records separate. Alternatively, they may maintain a separate proposer or attach a removable update; either choice still requires exact version tracking.

For each model, researchers must record when its training data stops and every suggestion it generated. They must evaluate each update separately, keep accepted versions fixed, check general abilities, and be ready to restore the last accepted version. Even if the models share the same internal parameters, researchers still need separate records for each role. Failed updates stay unpublished or require a return to the last accepted version.

A model may calculate an action’s score by adding scores for each word or word fragment, so a longer action can receive a lower total merely because it contains more pieces. Different scopes are unfair. The study should compare similar scopes, report total and length-adjusted scores, choose the adjustment before training, and check for pressure toward unnaturally short or long answers.

## A local critic is not a life objective

The optional reward model turns local comparisons into a reusable action score. Before researchers use that score to guide another proposer or train one through reinforcement learning, the critic needs harder tests. In reinforcement learning, a model learns from rewards for high-scoring actions.

The critic must work when the proposer, application, or project changes. It must survive changes in an action’s length, style, or boundaries without losing its meaning. It must handle conflicting preferences and loops, such as A beating B, B beating C, and C beating A.

Researchers should keep optimized actions close to the critic’s training examples while hunting for odd actions that exploit its rules. Its score gaps should match independent judgments, and higher scores should predict better outcomes when reviewers do not know which system produced the action. If the critic fails these tests or breaks in a later setting, it cannot train another proposer or support reinforcement learning. It may still pass a narrower test that chooses among familiar actions.

Generative Adversarial Imitation Learning (GAIL) and Adversarial Inverse Reinforcement Learning (AIRL) learn from action sequences but are premature. Phase 2 lacks trustworthy whole-project examples, a safe simulator, and evidence that one score keeps its meaning across steps.

Neither an IPO update measured against a frozen proposer nor a critic reveals a stable life objective. Local scores cannot simply be added across a sequence and treated as a trustworthy long-term goal. If comparisons that work for a single move do not predict which whole sequence produces the best result, Phase 3 may study only whether those one-step judgments can safely extend across multiple steps. It needs whole-sequence evidence and either a tested world model that simulates project effects or a test environment, plus action limits, permissions, rollback, and the student’s right to select, edit, reject, withhold permission, or stop.

## Better scores do not count unless the work improves

Evaluation has three stages:

1. Pair validity. Independent audits confirm timing, comparability, boundaries, equivalence, and enough ordinary-work pairs.
2. Proposer quality. On a held-out group of examples not used for training, independent judges compare the update with its exact frozen source. The behavioral model, DPO, a model trained simply to copy her past actions, and generic or unchanged proposers help explain the results. These are diagnostics, not a must-beat list.
3. System usefulness. Randomized tests of real human–AI work must show better outcomes, such as faster completion, fewer errors or revisions, greater goal satisfaction, or higher quality judged without revealing which system helped. They must also rule out harmful anchoring, narrowing, manipulation, interruption, reduced variety, and weaker general abilities.

Pair accuracy and wider score gaps are only diagnostics. They do not prove useful assistance. Independent reviewers and outcome measures must be able to rate a model proposal above the human action despite training labels that favor the human. Otherwise the proposer may merely become more human-like.

Failures have different responses:

- If Phase 1 succeeds but yields too few valid pairs, remain in Phase 1.
- If score gaps improve but proposals or outcomes do not, revisit timing, validity, and local superiority rather than optimizing harder.
- If the critic does not carry into new settings, keep it out of proposer training and reinforcement learning.
- If local comparisons work one step at a time but fail across a sequence, carry only that question into a limited, safety-tested Phase 3.
- If suggestions pull the student toward one line of thought, reduce variety, manipulate her, or worsen outcomes, stop collection and restore the last accepted model despite better technical metrics.

Without confirmed transfer across people, every result remains specific to this student. A successful Phase 2 could yield a continually updated behavioral model, a separately improved proposer, and perhaps a critic for other settings. It would not recover a stable life objective, justify adding local scores into a long-term reward, or create an autonomous agent.

## Vault links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Full guide: [[niyant-personal-ai-thesis-study-guide|Niyant's personal-AI thesis: a beginner's study guide]]
- Previous: [[personal-ai-phase-1-next-action-prediction|Phase 1: Can an AI learn what matters to you by watching you work?]]
- Next: [[personal-ai-phase-3-bounded-multi-step-assistance|Phase 3: Can an AI help with more than the next move?]]
