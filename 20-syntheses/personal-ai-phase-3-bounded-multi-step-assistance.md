---
type: synthesis
status: distilled
created: 2026-07-22
updated: 2026-07-22
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - planning
  - human-ai-interaction
sources: []
people:
  - niyant
orgs: []
aliases:
  - Personal AI Phase 3
tags:
  - personal-ai
  - phase-3
  - bounded-planning
---

# Can an AI Help With More Than the Next Move?

Phase 3 proposes multi-step plans with a horizon, the number of future steps they consider. This directional extension has no experimental result. It targets a better student-AI result than unaided work and the strongest shorter-horizon assistant, not replacement of the student. It starts only after earlier gates pass and the remaining problem is sequential.

## One good next move does not make a good plan

The housing-policy student turns her Minneapolis displacement research into a cited memo. Her versioned computer workspace holds a fixed source snapshot, evidence table, and draft. It cannot search the live web, publish, send messages, or edit shared files.

A Phase 2 search may duplicate evidence. A dull definition check may unlock the strongest paragraph. Late effects and information gathering can change the next move.

## Phase 3 begins only when the remaining problem is sequential

Entry requires:

- Phase 1: the record must truthfully show event order, visible content, who acted, where each meaningful action starts and ends, every source, and no later information appearing earlier. Correct history must repeatedly beat no history, wrong history, and another person's history at predicting the next action. That advantage must come from subject matter, not style or routine, while unrelated abilities stay intact. Updates must keep older useful behavior and improve real work without unacceptable harm. Suggestions appear only during limited test periods. Accepted versions are frozen. The prior version can be restored.
- Phase 2, direct alternative: at one immediate decision, a valid pair compares one proposal the student actually saw with the different but comparable action she then took. Those proposal-versus-student-action pairs must improve proposals and real outcomes in randomized comparisons.
- Phase 2, scorer alternative: the same pairs must produce an optional scorer that still works beyond the proposal model that collected them and tracks independently judged outcomes.

Phase 1 and either Phase 2 alternative must pass.

The remaining failure must concern sequences: good local actions fail together, effects arrive later, information gathering matters, or an untried workspace transition needs testing. Weak records, bad local suggestions, and unsafe exposure cannot justify longer planning. A local failure stays with the strongest shorter-horizon system.

In an assistance game, a person and assistant change the same workspace while the assistant remains unsure what the person wants. Phase 3 borrows that idea. The analogy does not prove optimal help, aligned goals, or eventual correct behavior.

The student may act imperfectly, change goals across tasks, or lack one machine-readable objective. She can redefine the goal, select, edit, reject, ask for clarification, withhold permission, or stop.

## The system previews several complete research paths

A trajectory is a multi-step plan. One memo path checks a primary source's displacement definition, extracts a statistic with its source, adds an evidence-table row, and drafts a caveated paragraph. Others prioritize eviction filings or summarize a secondary report.

Each display contains the exact actions, predicted workspace changes and result, uncertainty, simulator version, and approval boundaries. She selects the eviction path, edits it to use primary sources, and stops before memo prose.

Her response applies only to the exact bundle she saw. Choosing an attractive forecast does not mean she prefers a bad outcome if it proves wrong. The choice compares displayed whole plans. It does not mark each winning step good, each losing step bad, or an unseen plan rejected.

The record keeps selection, edit, rejection, clarification, intervention, abort, rollback request, simulator disagreement, and final outcome distinct. Planned, sandbox-verified, and executed actions stay separate. So do predicted, simulated, and observed workspace snapshots. Original displayed forecasts and uncertainty stay separate from revisions. The record names who authorized every external side effect.

## Predicting the student and predicting the workspace are different jobs

The behavioral human-response model predicts the student's checkpoint response from the history she actually experienced. It keeps its own version, which planner training cannot silently change.

The Phase 2 action prior is the model suggesting plausible next actions. It predicts neither workspace consequences nor everything the student values. If the optional Phase 2 scorer passes its tests, that same model serves as the local critic, not a new component. It compares candidates at one decision. Its score is not a whole plan's total value.

A predicted software effect is an expected file or application-state change. The workspace-effects model, or dynamics model, forecasts such changes to documents, citations, and tables, never the student or value.

The trajectory planner combines evidence into candidate paths. It has no authority to execute them. The trajectory scorer learns from displayed whole-plan choices, edits, interventions, comparisons, and delayed outcomes. It is not the local critic renamed.

The execution governor is a non-learned or separately audited control layer. It enforces typed permissions, reversibility, checkpoints, rate limits, sandbox rules, and rollback.

These seven jobs may share foundations but need separate versions, evidence, and failure diagnoses. A bad plan may start in response or workspace prediction, value estimation, search, or execution control.

## A sandbox can test software changes, not people or reality

Historical traces show transitions only under actions that people and deployed assistants took. Reviewers need before-and-after snapshots, records of who acted, unrelated events, and which workspace changed. Passive history cannot reveal every untried action's effect.

A sandbox is an isolated clone where software actions run without changing the real workspace. The hybrid simulator prefers structured application data, document diffs, and files. A learned model searches cheaply. Promising paths run in clones. Only a selected, edited, rechecked, and explicitly permitted path can touch the real workspace.

A sandbox cannot establish future human responses, third-party or social reactions, or the safety of irreversible external effects. The system must express uncertainty, seek real approval, or abstain. In this memo, a correct file change does not prove a source claim. This warning is example-specific, not another Phase 3 gate.

## Choosing a plan does not approve every step or create a long-term reward

The Phase 2 local score can judge an eviction search. Plans change future contexts, so summed local scores cannot recover her long-term objective.

The Phase 2 proposer and optional scorer may remove weak options at the same decision, seed proposals, offer uncertainty-aware hints, or guide short searches. Valid local comparisons remain training evidence.

Four longer-horizon estimators are alternatives, not one combined objective:

- Trajectory Identity Preference Optimization (IPO) makes the plan generator favor a chosen complete plan over displayed alternatives. It requires whole-plan comparisons and probabilities the system can calculate for generating each complete plan. Without either, do not use trajectory IPO.
- A trajectory-preference scorer ranks full paths when mixed search outputs lack one useful probability model. Without whole-plan comparisons, do not train it.
- An outcome model predicts a measurable result such as quality, errors, or time. Without one, do not claim this branch.
- Adversarial Inverse Reinforcement Learning (AIRL) tries to infer a reusable scoring rule from action sequences. Use it only if the sandbox records transitions and permits safe AI-generated trial paths, enough complete-path evidence exists, and the score must keep working under changed software transition rules. Missing any condition blocks AIRL.

Human traces are not automatically examples of expert behavior. No estimator proves useful assistance by its own score. That claim needs randomized downstream comparisons with no plan or alternative plans and measured real outcomes.

## Plan length expands one tested step at a time

Start at the observed one-step boundary. Test two steps, then three. Every listed gate must pass. Passing at the current horizon permits only a bounded experiment at the next horizon, not deployment or broader autonomy.

- Forecast gates: confidence must match how often comparable forecasts are right, with meaningful uncertainty across the entire predicted path. Learned predictions must agree with sandbox transitions, and sandbox predictions with authorized real-workspace transitions.
- Human and value gates: measure selection, edit, rejection, intervention, abort, and rollback separately. A learned reward or value score must work on planner-generated plans.
- Outcome gates: compare real results against no-plan and strongest shorter horizon.
- Execution gates: require safety, reversibility, rollback and recovery, and support coverage. Typed tool permissions must name allowed action, data, and scope. Support coverage means proposed actions resemble model- and sandbox-backed cases.

For the edited eviction path, a sandbox tests file, citation, and table changes. A whole-plan method judges it. A randomized memo-quality comparison tests whether assistance helped.

Authority moves in order:

1. Imagine plans without touching real files.
2. Sandbox-check promising plans in a clone.
3. Show exact actions, results, uncertainty, simulator version, and limits, then wait. Selection enters guarded review, not blanket approval. Rejection or clarification means no execution. An edit requires revalidation.
4. Apply typed permissions through the governor. Run only permitted, reversible steps at checkpoints.
5. Record actual transitions, interventions, and outcomes for learning.

For permitted, reversible actions, a student abort or rollback request requires stopping and restoring the last checkpoint. Checkpoint safety controls can also stop the run. There is no universal automatic rollback trigger for each forecast mismatch. Rollback cannot undo irreversible or social effects, which stay outside this experiment.

Scores cannot skip stages or authorize side effects.

## Real outcomes, human authority, and the invalidation ladder decide success

The initial experiment:

1. Reconstruct earlier workspace transitions.
2. Choose one reversible application with structured state and a deterministic clone.
3. Calibrate one- and two-step predictions against sandbox results.
4. Display outcomes without execution and test whether uncertainty is clear.
5. Collect whole-plan feedback and outcomes.
6. Compare estimator branches whose prerequisites exist.
7. Execute selected two-step plans with checkpoints and rollback immediately available.
8. Expand only after predeclared forecast, outcome, intervention, and safety gates pass.
9. Consider irreversible or socially consequential actions only under a separately reviewed authority model, if permitted at all.

The invalidation ladder:

- Entry: Phase 1 failure or failure of both Phase 2 alternatives blocks Phase 3.
- Scope: local failures return to the shorter-horizon system.
- Transition evidence: sandbox-test unsupported actions, state uncertainty, or abstain.
- Sandbox boundary: human, social, or irreversible consequences require meaningful real approval or abstention.
- Human authority: rejection or clarification permits no execution; edits require revalidation.
- Estimator evidence: missing complete-plan probabilities blocks trajectory IPO; missing whole-plan comparisons blocks the trajectory-preference scorer; no measurable outcome blocks an outcome-model claim; missing safe AI trial paths, enough complete-path evidence, or genuine transfer need blocks AIRL.
- Causal result: higher internal scores without randomized downstream gains invalidate the assistance claim.
- Expansion: failure of any horizon gate means remain there, diagnose, or stop.

Phase 3 succeeds only if a longer horizon beats the strongest shorter-horizon system in real joint outcomes while retaining calibration, human control, reversibility, and recovery. Planning that worsens the result or sacrifices any safeguard fails. Success grants no unilateral action, new application, unbounded horizon, irreversible authority, or human replacement.

## Vault links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Full guide: [[niyant-personal-ai-thesis-study-guide|Niyant's personal-AI thesis: a beginner's study guide]]
- Previous: [[personal-ai-phase-2-local-preference-learning|Phase 2: Can a better next move train a better AI?]]
- Strategy: [[personal-ai-strategy-and-evidence-sequencing|Personal AI strategy and evidence sequencing]]
