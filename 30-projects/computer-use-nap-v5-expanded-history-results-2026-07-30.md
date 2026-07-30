---
type: project-result
status: complete
created: 2026-07-30
updated: 2026-07-30
project: computer-use-nap
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - screenpipe
  - experiment
  - personalization
---

# Workflow history produced five exact top-three wins and no losses in NAP V5

## Bottom line

The V5 expanded-history experiment produced a clear positive signal for
personal workflow history:

- state-only found the exact next destination in its top three on **0/10**
  model-scorable targets;
- state plus hybrid history found the exact destination on **5/10**;
- the paired exact top-three result was **five history wins, zero state-only
  wins, and five ties**; and
- history's exact top-one result was **3/10**, versus **0/10** for state-only.

The frozen proxy interpretation is **promising**, not demo-worthy. The result
supports the narrow claim that personal history helps route Dylan back to
recurring destinations. It does not yet establish a general router across
arbitrary applications and controls.

The most important concentration is that history hit all five scorable Codex
targets and missed all five scorable Arc targets. Its advantage came from
recognizing Dylan's recurring `Patch NAP blog prep in vault` destination,
including its composer, rather than from broad next-action mastery.

The later target-by-target product read is slightly narrower than the official
exact headline: four history wins were clean exact-and-semantic wins; the
fifth was an exact task-identity win where state-only had already named the
same practical composer generically. Two official Arc misses were also
granularity-sensitive. Full synthesis:
[[computer-use-nap-v5-post-results-synthesis|What NAP V5 established and what
a first navigation autocomplete still needs]].

## Frozen setup

The preregistered evidence pass found only 11 targets that satisfied every
strictly-prior screenshot and target-quality rule. Dylan approved using all
11 before inference. Each target received:

1. the current monitor-3 screenshot alone; and
2. the identical screenshot plus every earlier accepted structured action and
   the ten most recent recoverable screenshot/action pairs.

This produced 22 scheduled calls to the same `gpt-5.6-sol` predictor at `max`
reasoning. The first target pair suffered symmetric infrastructure failures
because the first launcher inherited a network-disabled Codex sandbox. The
remaining ten pairs produced valid schema-conforming predictions.

Official design:
[[computer-use-nap-v5-expanded-history-experiment-design-2026-07-29|Computer-use
NAP V5 expanded-history experiment design, July 29, 2026]].

## Condition results

All semantic and usefulness numbers below are explicitly **Codex-proxy blind
sensitivity outputs**, not Dylan-authoritative judgments. Structured exact,
action-type, exact-action, and operational results are objective.

| Metric | State-only | State + hybrid history |
| --- | ---: | ---: |
| Structured exact top-1 | 0/10 scorable | **3/10** |
| Structured exact top-3 | 0/10 scorable | **5/10** |
| Proxy semantic top-1, primary | 1/10 | **3/10** |
| Proxy semantic top-3, primary | 1/10 | **5/10** |
| Proxy semantic top-3, uncertainty sensitivity | 2/10 | **7/10** |
| Action type top-1 | 6/10 | 7/10 |
| Action type top-3 | **9/10** | 8/10 |
| Structured exact-action top-1 | 0/10 | **3/10** |
| Structured exact-action top-3 | 0/10 | **5/10** |
| Proxy usefulness top-1, primary | 9/10 | 9/10 |
| Proxy usefulness top-3, primary | 9/10 | **10/10** |

Scheduled-denominator versions include the symmetric failed pair: exact
top-three is `0/11` versus `5/11`; proxy semantic top-three is `1/11` versus
`5/11`.

## Paired outcomes

| Metric | History wins | State-only wins | Ties | Unscorable |
| --- | ---: | ---: | ---: | ---: |
| Structured exact top-1 | **3** | 0 | 7 | 1 |
| Structured exact top-3 | **5** | 0 | 5 | 1 |
| Proxy semantic top-1, primary | **2** | 0 | 8 | 1 |
| Proxy semantic top-3, primary | **4** | 0 | 6 | 1 |
| Proxy semantic top-3, uncertainty sensitivity | **5** | 0 | 5 | 1 |

## Complete target matrix

`H@1`, `H@2`, and `H@3` mean that only the history condition produced a
structured exact match at that rank. A miss tie means neither condition
produced an exact top-three match.

| Target | Canonical event | Observed destination | Exact top-three outcome | Note |
| --- | --- | --- | --- | --- |
| 1 | `BLOG-V4-048` | Codex → Patch NAP blog prep in vault | Unscorable | Both calls failed under the initial network-disabled launcher |
| 2 | `BLOG-V4-079` | Codex → Patch NAP blog prep in vault | **H@2** | History returned to the recurring Codex task |
| 3 | `BLOG-V4-110` | Codex → Patch NAP blog prep in vault | **H@1** | History exact at rank one |
| 4 | `BLOG-V4-121` | Codex → Patch NAP blog prep in vault | **H@1** | History exact at rank one |
| 5 | `BLOG-V4-123` | Arc → Notion page | Miss tie | History's Coda/all-hands prediction was proxy-uncertain, not a primary match |
| 6 | `BLOG-V4-124` | Codex → Patch NAP blog prep in vault | **H@3** | History exact at rank three |
| 7 | `BLOG-V4-142` | Arc | Miss tie | Both conditions proposed the visible meetings window only at uncertain semantic granularity |
| 8 | `BLOG-V4-148` | Arc → Handsdiff profile → handle copy control | Miss tie | Neither condition found the exact profile control |
| 9 | `BLOG-V4-151` | Arc → Handsdiff Substack profile → Subscribe control | Miss tie | Neither condition found Subscribe |
| 10 | `BLOG-V4-155` | Codex → Patch NAP blog prep in vault → composer | **H@1** | State-only named a semantic composer alias, but only history matched the frozen structured target |
| 11 | `BLOG-V4-230` | Arc → Notion | Miss tie | The sole deep-history target was missed by both conditions |

## Post-results target-level refinement

The frozen objective result remains `0/10` versus `5/10` structured exact
top-three. The best practical decomposition is:

- **four clean history wins:** targets 2, 3, 4, and 6 were exact history-only
  hits that also passed the blind primary semantic judgment;
- **one canonical-identity history win:** target 10 was exact only for history,
  but state-only's generic `message composer -> Do anything` prediction was
  judged the same practical destination;
- **three clear shared failures:** targets 8, 9, and 11 missed the handle-copy
  control, Subscribe control, and Notion shortcut;
- **two labeling-sensitive shared misses:** target 5's Arc meetings-page
  prediction and target 7's blue-outlined Meetings-window prediction were
  proxy-uncertain rather than cleanly wrong.

All five official exact hits were returns to Codex from another application:
four from VS Code and one from Arc. History produced no exact hit on a
non-Codex destination.

Therefore, the narrow supported claim is recurring-task recall. The result
does not yet show general next-action prediction, browser routing, or
fine-control selection.

## Visual summary

![[computer-use-nap-v5-scientific-poster-2026-07-30.png]]

## What the result means

### Supported

- Personal history materially improved exact routing in this frozen sample.
- The result was not driven by one lucky rank: history produced three rank-one
  exact hits and two additional top-three hits.
- State-only never beat history on any paired exact or proxy-semantic metric.
- History correctly recovered a stable, personally named Codex destination
  that the screenshot alone could not reliably name.

### Not established

- The experiment does not show general next-action prediction across apps.
  Every exact history hit was a Codex destination; every Arc target was missed.
- More history depth cannot be credited causally. Chronology, workflow phase,
  target difficulty, and history depth changed together, and only one deep
  target survived eligibility.
- The very high usefulness rates are not an official product verdict. They
  came from a blind Codex proxy and were high in both conditions, making them
  weakly discriminative.
- Ten scorable pairs from one blog-writing workflow are enough for a product
  signal, not a statistical or deployment claim.

## Product interpretation

The frozen proxy band is **promising**:

> workflow history clearly helps the model recover recurring personal
> destinations, but the evidence is not yet broad or human-adjudicated enough
> to call the router demo-worthy.

The official product band and “would Dylan want the router?” field remain
unavailable because Dylan did not perform the blind semantic and usefulness
adjudication. A later Dylan review can replace interpretation of those
subjective metrics without rerunning the 22 model calls.

## Operational accounting

- Scheduled slots: 22
- Model-scorable slots: 20
- Valid model outputs: 20
- Invalid model outputs: 0
- Attempts: 28
- Retries: 6
- Infrastructure failures: 2
- Total known tokens: 562,844
- Total known attempt latency: 1,491,765 ms
- Final verification: passed

## Immutable artifacts

The complete private runtime remains in the canonical in-vault ignored tree:

`/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history/`

Key hashes:

- method lock:
  `60227a7dbf437314314373e34095639356c13438f056b25bc2360ab4b37d5513`;
- run lock:
  `419a7c1b35b11d8b9254030c68c3b8b869e3fa2b3c43f7e0a5eae30ced7731cc`;
- adjudication lock:
  `b712049e2e5b3fab3a8683dac01b155940dc401cefd6ba4f2c7d04e4f54a9a94`;
- score package:
  `f71129970eb1796bdb369e147730f3624e7adf9b70c84cce87e04cedf45e0b52`;
- final report:
  `90d8e336ac7877798c773a071437b960059d2a92c7bf84f88db0157339e572ba`.

The executable public harness is under `scripts/computer-use-nap-v5/`.

## Next move

Do not rerun V5. Preserve it as the first expanded-history result.

The next discriminating test should retain the paired design while adding more
non-Codex and fine-control targets. The key question is no longer whether
history can help name a recurring destination—it can. The next question is
whether the advantage survives across browser pages, documents, controls, and
less repetitive workflow phases.

The first product-oriented follow-up should rank a shared, hierarchical list
of executable app, window, task, document, page, and control candidates, then
abstain when confidence is low. Fine-tuning is not required for that test. See
[[a-first-computer-navigation-autocomplete-should-rank-candidates-and-abstain|A
first computer navigation autocomplete should rank candidates and abstain]].
