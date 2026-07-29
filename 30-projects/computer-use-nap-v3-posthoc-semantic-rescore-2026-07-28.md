---
type: project-result
status: provisional
created: 2026-07-28
updated: 2026-07-28
aliases:
  - NAP V3 post-hoc semantic rescore, July 28, 2026
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
  - semantic-scoring
---

# NAP V3 post-hoc semantic rescore, July 28, 2026

## Status

This is a post-hoc development-set sensitivity analysis. It does not replace
the frozen exact-text result, and no model was rerun. The 38 original
predictions remain immutable.

Condition-blind row-by-row adjudication is complete. The conservative primary
view counts only obvious lexical naming variants while preserving wrong
applications, tasks, pages, controls, and target granularity as wrong.

Six child-control predictions against coarser labels remain queued for Dylan's
granularity decision. They appear only in a separate non-primary sensitivity
view. Shortcut usefulness also remains unresolved and was not inferred from
correctness.

## What the experiment actually ran

The dataset contained 20 chronological rows. `BLOG-CAND-003` supplied the
initial history and was not a prediction target. The remaining 19 rows were
separate prediction targets.

Each target received two independent calls:

1. `state_only`: its current two-monitor before-state screenshots;
2. `state_plus_all_prior`: the same screenshots plus every earlier frozen
   state-action row.

The history condition therefore walked up successively:

| Prediction target | Prior rows supplied to history |
|---|---:|
| First target | 1 |
| Second target | 2 |
| Third target | 3 |
| ... | ... |
| Nineteenth target | 19 |

This produced 19 paired targets and 38 model calls. A score such as `5/19`
means five correct predictions across 19 separate targets. It does not mean
one prediction was made with 19 history rows.

## Frozen exact-text result

In the preregistered transport-recovered view:

| Condition | Exact top-1 | Exact top-3 |
|---|---:|---:|
| Current screenshots only | 0/19 | 0/19 |
| Current screenshots plus all earlier rows | 5/19 | 6/19 |

At top-1, the paired result was 5 history wins, 0 history losses, and 14 ties.
At top-3, it was 6 wins, 0 losses, and 13 ties. Most ties meant both
conditions were wrong.

The exact-text history hits were:

- top-1: `BLOG-CAND-006`, `BLOG-CAND-007`, `BLOG-CAND-023`,
  `BLOG-CAND-024`, and `BLOG-CAND-027`;
- top-3: the same five plus `BLOG-CAND-011`.

## Why a post-hoc semantic view was needed

Every frozen accepted-alias list was empty. The exact scorer could reject
predictions that apparently named the same destination with extra interface
words.

Example:

- actual: `Codex -> Patch NAP blog prep in vault -> composer`;
- state-only prediction:
  `Codex -> “Patch NAP blog prep in vault” conversation -> “Do anything” prompt composer`.

The narrow rescore treats the following as naming equivalents:

- `Patch NAP blog prep in vault`, `Patch NAP blog prep in vault
  conversation`, and `Patch NAP blog prep in vault task`;
- `composer`, `prompt composer`, `message composer`, and
  `Do anything composer`; and
- quotation and formatting differences.

It does not forgive a wrong app, wrong task or page, or wrong immediate
control.

## Primary result: lexical repair with strict granularity

| Condition | Semantic top-1 | Semantic top-3 |
|---|---:|---:|
| Current screenshots only | 1/19 | 1/19 |
| Current screenshots plus all earlier rows | 4/19 | 5/19 |

Ordinary counts:

- state-only top-1: 1 correct and 18 incorrect;
- history top-1: 4 correct and 15 incorrect;
- state-only top-3: 1 correct and 18 incorrect;
- history top-3: 5 correct and 14 incorrect.

Paired counts:

- top-1: 3 history wins, 0 history losses, and 16 ties;
- top-3: 4 history wins, 0 history losses, and 15 ties.

The only primary state-only hit was `BLOG-CAND-027` at rank 1. Primary history
hits were `BLOG-CAND-007` at rank 1, `BLOG-CAND-011` at rank 3,
`BLOG-CAND-023` at rank 1, `BLOG-CAND-024` at rank 1, and `BLOG-CAND-027` at
rank 1.

## Granularity-inclusive sensitivity, not primary

If the six unresolved child-control predictions are counted as matches for
their coarser app-and-object labels, the result returns to the earlier
provisional figures:

| Condition | Semantic top-1 | Semantic top-3 |
|---|---:|---:|
| Current screenshots only | 2/19 | 5/19 |
| Current screenshots plus all earlier rows | 5/19 | 7/19 |

The paired sensitivity is 4 history wins, 1 loss, and 14 ties at top-1, and 3
wins, 1 loss, and 15 ties at top-3. This is not the primary result because it
relaxes target granularity after seeing the V3 outputs.

## Granularity-inclusive target matrix

`R1`, `R2`, and `R3` mean the correct semantic destination appeared at that
rank. `Miss` means none of the three predictions matched. `†` means the
prediction failed the original exact-text scorer but passed the narrow
granularity-inclusive sensitivity view.

| Prior rows | Event | Actual next target | State only | History |
|---:|---|---|---:|---:|
| 1 | `BLOG-CAND-004` | Codex → Patch NAP task | R2† | R3† |
| 2 | `BLOG-CAND-006` | Arc → Coda all-hands 7.27 | Miss | R1 |
| 3 | `BLOG-CAND-007` | Codex → Patch NAP task | R2† | R1 |
| 4 | `BLOG-CAND-008` | Codex → Patch NAP composer | Miss | Miss |
| 5 | `BLOG-CAND-009` | Codex → prompt-submit control | Miss | Miss |
| 6 | `BLOG-CAND-010` | Codex → Personalization Obsidian task | Miss | Miss |
| 7 | `BLOG-CAND-011` | Codex → Patch NAP task | R3† | R3 |
| 8 | `BLOG-CAND-013` | Codex → prompt-submit control | Miss | Miss |
| 9 | `BLOG-CAND-014` | Arc → application window | Miss | Miss |
| 10 | `BLOG-CAND-016` | Twitter → bottom-left profile control | Miss | Miss |
| 11 | `BLOG-CAND-018` | Twitter → Notifications control | Miss | Miss |
| 12 | `BLOG-CAND-019` | Twitter → Precursor profile control | Miss | Miss |
| 13 | `BLOG-CAND-020` | Precursor profile → banner image | Miss | Miss |
| 14 | `BLOG-CAND-021` | Banner overlay → dismissal target | Miss | Miss |
| 15 | `BLOG-CAND-022` | Twitter → Home control | Miss | Miss |
| 16 | `BLOG-CAND-023` | Twitter → Precursor profile control | Miss | R1 |
| 17 | `BLOG-CAND-024` | Precursor profile → banner image | Miss | R1 |
| 18 | `BLOG-CAND-026` | Codex → Patch NAP task | R1† | Miss |
| 19 | `BLOG-CAND-027` | Codex → Patch NAP composer | R1† | R1 |

In this non-primary sensitivity at top-3:

- both conditions were correct on `BLOG-CAND-004`, `BLOG-CAND-007`,
  `BLOG-CAND-011`, and `BLOG-CAND-027`;
- only history was correct on `BLOG-CAND-006`, `BLOG-CAND-023`, and
  `BLOG-CAND-024`;
- only state-only was correct on `BLOG-CAND-026`; and
- both failed on `BLOG-CAND-008`, `BLOG-CAND-009`, `BLOG-CAND-010`,
  `BLOG-CAND-013`, `BLOG-CAND-014`, `BLOG-CAND-016`, `BLOG-CAND-018`,
  `BLOG-CAND-019`, `BLOG-CAND-020`, `BLOG-CAND-021`, and
  `BLOG-CAND-022`.

## Did progressively more history help?

The experiment did use successively increasing history, but its results do not
show a monotonic relationship between context depth and accuracy.

Under the conservative primary lexical-only rescore:

| Prior-history depth | State top-1 | History top-1 | State top-3 | History top-3 |
|---|---:|---:|---:|---:|
| 1–5 | 0/5 | 1/5 | 0/5 | 1/5 |
| 6–10 | 0/5 | 0/5 | 0/5 | 1/5 |
| 11–19 | 1/9 | 3/9 | 1/9 | 3/9 |

The granularity-inclusive sensitivity was:

| Prior-history depth | State top-1 | History top-1 | State top-3 | History top-3 |
|---|---:|---:|---:|---:|
| 1–5 | 0/5 | 2/5 | 2/5 | 3/5 |
| 6–10 | 0/5 | 0/5 | 1/5 | 1/5 |
| 11–19 | 2/9 | 3/9 | 2/9 | 3/9 |

The deepest section produced three history hits, but it also contained nine
targets. Its top-3 rate was `3/9`, compared with `3/5` in the shallowest
section.

The observed hits cluster around repeated workflow motifs:

- early cross-app movement between Coda and the Patch NAP Codex task;
- late repetition of the Twitter profile and banner loop; and
- a final return to the already-focused Codex composer.

This walk-up cannot isolate the causal effect of context quantity because
history depth, time, workflow phase, and target difficulty all change together.
A history-depth ablation would predict the same held-out targets with windows
such as last 1, 3, 5, 10, and all prior rows.

## Unresolved human judgments

The six prediction ranks awaiting Dylan's granularity decision are:

- `BLOG-CAND-004`, state-only rank 2;
- `BLOG-CAND-004`, history rank 3;
- `BLOG-CAND-006`, history rank 1;
- `BLOG-CAND-007`, state-only rank 2;
- `BLOG-CAND-011`, state-only rank 3; and
- `BLOG-CAND-026`, state-only rank 1.

These predicted a child control or section when the frozen label named only
the coarser task or page. Until Dylan decides whether those are the same
immediate action, exclude them from the primary numerator.

Usefulness remains unresolved. Correct target prediction and a shortcut Dylan
would actually invoke are separate judgments.

## Decision and V4 sequence

For this smoke test, retroactive rescoring is sufficient. The 38 model calls do
not need to be rerun.

The next sequence is:

1. Treat the V3 rows and predictions only as a development set.
2. Use the isolated V4 method frozen before future labels at
   `2026-07-29T01:56:17.000Z`.
3. Label monitor 3 only. Monitor 1 actions are explicit coverage exclusions,
   and any monitor 1 companion evidence is optional audit provenance that the
   predictor never sees.
4. Close a history-only pool after at least ten eligible monitor 3 actions.
5. Use the next exactly 20 chronological eligible monitor 3 actions as the
   untouched holdout.
6. Predict each holdout once with its current monitor 3 screenshot and once
   with the rolling ten prior eligible monitor 3 rows, for 40 calls total.
7. Score exact target identity, action type, their conjunction, blind semantic
   equivalence, and shortcut usefulness separately.
8. Decide whether to continue toward roughly 200 rows from that repaired
   holdout.

The current smoke supports continuing the investigation. It does not yet show
that more history is always better, durable personalization, or a statistically
stable effect.

V4 is not numerically comparable with V3. It changes monitor coverage, history
length, the prediction schema, and strict target-granularity scoring.

## Private adjudication and V4 artifacts

- adjudication report:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/SEMANTIC-ADJUDICATION.md`
- row-by-row machine-readable adjudication:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/semantic-adjudication.json`
- V4 schema audit:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/V4-SCHEMA-AUDIT.md`
- V4 method policy:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/method-policy.json`
- V4 labeling guide:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/LABELING-GUIDE.md`
- isolated V4 harness:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/`

## Links

- [[exact-free-text-scoring-can-mistake-label-imitation-for-personalized-action-prediction|Exact free-text scoring can mistake label imitation for personalized action prediction]]
- [[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan, July 28, 2026]]
- [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]]
- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
