---
type: synthesis
status: distilled
created: 2026-07-22
updated: 2026-07-22
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - next-action-prediction
  - continual-learning
sources: []
people:
  - niyant
orgs: []
aliases:
  - Personal AI Phase 1
tags:
  - personal-ai
  - phase-1
  - next-action-prediction
---

# Can an AI Learn What Matters to You by Watching You Work?

A general AI may know how research works without knowing what matters to one student today. Phase 1 is a working research plan with no experimental results. It tests whether a truthful record of ordinary work helps a model predict the student's next meaningful piece of writing. A second test asks whether showing those predictions improves the student-AI team, a question the model's score cannot answer.

## The missing context is already in the work

Imagine a student studying why a city changed its housing policy. She reads a paper, asks an AI to explain a term, searches for another source, writes a note, then edits her argument. Her next move may depend on a connection absent from her prompt.

A conventional AI memory feature keeps facts. It may miss the question behind a search or a constraint in a message. Stopping after each step to label what mattered would interrupt the research.

Phase 1 instead learns from the work itself. Inbound events are things the student could see, such as paper text, messages, and AI outputs. Outbound actions are things she did, such as searches, prompts, and edits.

Phase 1 studies the student and model as a team, with the model supplying knowledge and possible continuations. The student keeps judgment, synthesis, goals, and authority. The plan is not trying to build a digital clone.

## The timeline has to be honest

The data must look like an ordered movie, not a scrapbook assembled later. If the student saw one paragraph, the record cannot include the whole page. A completed AI answer cannot appear before it was visible.

Each event needs its time, visibility, authorship, and provenance, meaning where it came from. A later note cannot leak into the context for an earlier edit. Copied text, AI text, automatic edits, and original human writing remain distinct.

The scored target is a macro-action: one meaningful, bounded written action the student has finished herself. It might be the student's submitted search, explanation prompt, saved bullet, or coherent edit. Navigation, visible pages, received messages, and AI outputs normally supply context instead.

The action boundary must be stable. A keystroke is usually too small to express intent, while a long work session may contain several decisions. If reviewers cannot reconstruct the pre-action timeline or agree on meaningful boundaries, later prediction claims stop until the team fixes the event record or redefines where one action ends.

The event record marks material as private or excluded. Those labels are not a full privacy system. Sensitive or excluded material must be removed before any dataset is published.

## The model learns the next human action

Phase 1 begins with past activity. It uses behavioral cloning, which means training a model to be less surprised by the human action that followed the available history.

Only the student's finalized writing is scored. The paper, earlier notes, messages, and AI answers remain context.

The plan compares six ways to use personal evidence:

- Full history.
- Automatically selected relevant history.
- An older-history summary.
- A written guess at the current goal.
- Changes to the model's learned internal settings trained from past actions.
- Combinations of those methods.

It does not assume one will win.

For the student, the test asks whether the paper, explanation, and search make her next note edit easier to predict. The observed edit may not be optimal. Prediction does not prove a preference, show which event caused the edit, reconstruct what she would have written without AI, or produce one scoring rule that captures everything she values.

## The hard test is the local goal

Some actions are easy to predict from routine. A model may learn the student's punctuation, favorite files, or repeated search pattern without learning what her project is about. That can improve prediction while adding little useful help.

The harder cases are novel or ambiguous. Identical wording in two papers may call for different searches. One project asks about cost, while another asks about fairness.

Phase 1 tests whether a local objective, what the student is trying to do now, improves prediction.

This is a hypothesis. Better predictions on difficult test actions would support a useful task representation. They would not prove that the model found one unique, stable, complete, or human-readable account of the student's goals.

## Suggestions change the history

After the earlier tests pass, the model may offer possible next actions. Suppose it suggests a search about construction costs while the student revises her housing argument. If the screen showed that suggestion, it becomes an assistant-authored event in the history she experienced.

An unrendered candidate, one that never appeared on screen, stays outside that history. The model later learns from the student's next finalized action with the shown suggestion included. She may copy it, rewrite it, combine it with another idea, ignore it, or change direction.

Phase 1 does not call an ignored proposal rejected. It also does not treat the later human action as proof that it was better than the proposal. That stronger comparative assumption belongs to Phase 2.

A cost-focused search could uncover evidence the student missed. It could also anchor her on costs, distract her from the fairness question, and make later searches and arguments more alike. A manipulative suggestion could shift the project without helping it.

The model therefore changes the data that trains later versions. Better predictability cannot show whether that loop is healthy. Live use must label AI suggestions, allow override, limit their frequency, check whether the student's work narrows, randomly withhold or vary suggestions, and support rollback, which restores an earlier model if harm appears.

## New learning must not erase old learning

The student's priorities will change. Recent work on housing policy may matter more today than an older class project, but one intense session should not erase durable research habits. Useful evidence must accumulate faster than it becomes stale.

Phase 1 calls for recent examples plus stratified replay, which means deliberately mixing in older examples. Those examples come from different periods, apps, and kinds of actions, such as searches and note edits.

They also track whether words came from the student, an AI, or another source, and whether suggestions appeared earlier. The plan tests whether this can preserve rare workflows without locking the model into obsolete habits.

The word memory can hide four different choices. There is history shown for one prediction, old examples kept for later training, knowledge placed into the model's learned internal settings, called weights, and hardware capacity used during training. Treating these as one resource would make the experiment hard to interpret.

Each update first creates a candidate, not a deployed model. Reviewers check recent work, older behavior, general skills, safety, and important groups of examples by app, action type, source, and action length. Only a passing candidate becomes immutable: a fixed version that cannot later change.

If the candidate fails, it stays unpublished. The team rejects it, changes the mix of old examples, isolates the personal changes, uses rollback, or keeps the model static.

## The experiments must happen in order

1. Audit whether the student's exact timeline can be reconstructed without future leakage.
2. Test whether history from Obsidian, the note-taking app, predicts later edits better than baselines, simple comparison methods such as repeating the last action or using only the current note.
3. Add and remove correctly timed browser and AI-chat events to learn which sources matter.
4. Compare the six methods above.
5. Vary model strength, personal-data amount, recency, and the context budget, meaning how much history the model can inspect at once.
6. Lock the evaluation method before looking at a later untouched period, then repeat the test and evaluate recent-plus-replay updates.

Only after those gates pass does the plan show suggestions during limited periods. The central control keeps the same strong model and the same future actions. The comparison uses correct history, absent history, reordered history, mistimed or wrong-time history, history with damaged timestamps, and mismatched history from another person.

Stronger models may erase or amplify the value of personal evidence. If the strongest models erase the gain, the thesis should narrow to rare or private context.

The tests must train on earlier periods and use sealed later periods. Randomly splitting neighboring edits across training and testing would inflate results because adjacent edits are related.

An oracle context is relevant history selected by hand. If it helps but automatic selection fails, useful information exists and automatic selection or summarization is the bottleneck. If it also fails, the source coverage, action boundary, or personal-data thesis needs to change.

## Success requires three different results

The predictive claim comes first: correct, automatically built personal history must meaningfully improve future-action prediction over no, wrong, and mismatched history. The gain must survive later chronological tests and content-sensitive cases, including novel or goal-ambiguous work. It must not depend only on style or routine.

If correct history does not beat the controls, the plan must add sources, change the action boundary, narrow the thesis, or abandon this target. If gains stop at style or routine, it must redesign the test so choosing among next actions depends on content, not merely style or routine.

The second claim concerns what the model represents about the current task. A summary or internal representation of the student's local objective must add value on difficult cases. If it does not, a useful behavior predictor might remain, but the local-goal story weakens.

The system-level test returns to the student's fixed housing-research task. It compares unaided work, fixed or static assistance, and continual personalized assistance. The study checks completion time, argument quality, errors, rework, and whether the result satisfies the student's stated goal.

In some work periods, chosen at random, the student receives no suggestion or a different one. Those comparisons are required before claiming that a suggestion caused an improvement.

If prediction improves but the housing work does not, the team must change the interface, timing, or variety of suggestions and withhold the usefulness claim. If suggestions make the work worse or narrow the student's searches and arguments, exposure stops and the system rolls back to an earlier model.

Success also requires general skills to remain intact, without harmful anchoring or loss of diversity. Not every suggestion must help, and a small personal model need not beat the strongest generic model.

If all these tests hold, Phase 1 would produce a validated event record, a continually trained behavioral model, and a record of when suggestions appeared and what the student did next. Phase 2 could use that record. Phase 1 does not produce an autonomous agent.

An early failure calls for repair, a narrower claim, or stopped exposure. The plan never assumes the final system works.

## Vault links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Full guide: [[niyant-personal-ai-thesis-study-guide|Niyant's personal-AI thesis: a beginner's study guide]]
- Next: [[personal-ai-phase-2-local-preference-learning|Phase 2: Can a better next move train a better AI?]]
