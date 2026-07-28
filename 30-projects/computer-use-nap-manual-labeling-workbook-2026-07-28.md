---
type: project
status: active
created: 2026-07-28
updated: 2026-07-28
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - screenpipe
  - manual-labeling
  - dataset
  - next-action-prediction
---

# Computer-use NAP manual labeling workbook, July 28, 2026

## Objective

Manually turn Dylan's several-hour Screenpipe record of building the blog post into a chronological dataset of:

> state immediately before navigation -> exact destination reached

Dylan is the ground-truth labeler. Screenpipe supplies the replayable evidence. Codex can maintain the worksheet, check timestamps, find strictly prior frames, and prepare predictor packets after Dylan has chosen and verified the transitions.

Do not run predictions from the earlier five-row candidate packet until Dylan has reviewed the full intended interval and approved the evaluation rows.

## Locked experiment contract

Dylan clarified the data and context design on July 28:

- The durable dataset stores each transition at full fidelity.
- One row pairs the two screenshots immediately before navigation with a textual label for the exact destination reached afterward.
- A later screenshot is retained only as evidence that the destination label is correct. The predictor never sees the current row's later screenshot or destination.
- The first five rows are a smoke test of collection, packet construction, prediction, and scoring. Five rows do not test whether history improves prediction.
- In the larger same-session experiment, the history condition receives the ten most recent eligible rows completed before the current prediction cutoff.
- Each historical row is shown at full fidelity as its two before-state screenshots plus its now-known textual destination.
- Historical rows are selected by recency, not perceived similarity. Retrieval and longer context windows are later experiments.

This keeps two concerns separate:

1. **Storage fidelity:** preserve enough evidence to render different experiments later without relabeling.
2. **Predictor exposure:** give the model a fixed, leakage-safe view of that evidence for each condition.

## Candidate review window

The most likely intended blog-work window is:

- local: July 27, 2026, approximately 5:15 PM to 10:20 PM EDT
- UTC: `2026-07-27T21:15:00Z` to `2026-07-28T02:20:30Z`
- wall-clock span: 5 hours 5 minutes

Why this is the best current boundary:

- the article's final revision checkpoints run from 5:18 PM through 10:01 PM EDT;
- the active Screenpipe frames repeatedly show `day-0-took-three-days.md`, `blog-prep-day-0-took-three-days.md`, the corresponding Codex tasks, research, graphics work, and the Substack editor; and
- Screenpipe evidence continues through the final 10:20 PM switch into the Substack draft.

This is a candidate boundary, not a claim about Dylan's intent. Adjust it if Dylan remembers starting or ending elsewhere.

## Recording segments inside the window

| Segment | Local time | What the database shows |
|---|---|---|
| A | 5:15 PM to 8:45 PM | Dense continuous physical work in the long Screenpipe session |
| gap | 8:45 PM to 9:34 PM | No frames or UI events |
| B | 9:34 PM to 9:37 PM | Short return in the long session |
| gap | 9:37 PM to 9:42 PM | Capture paused |
| C | 9:42 PM to 9:53 PM | Physical work across ChatGPT/Codex, Finder, and rekordbox |
| gap | 9:53 PM to 10:15 PM | Capture paused |
| D | 10:15 PM to 10:20 PM | Computer-use automation followed by a physical switch into the Substack editor |

Segment D should not supply ordinary physical-navigation rows for actions performed by automation. It can still provide later visual evidence or a physical row if Dylan personally initiated and completed a qualifying transition.

## Raw coverage

The candidate window contains:

| Source | Rows |
|---|---:|
| monitor 1 frames | 1,115 |
| monitor 3 frames | 1,191 |
| total frames | 2,306 |
| clicks | 577 |
| text bursts | 560 |
| window-focus events | 260 |
| application switches | 218 |
| scroll events | 213 |
| key events | 117 |
| total UI events | 1,945 |

Both displays have full-text coverage throughout the recorded segments. Most frames also contain Accessibility trees. Browser URLs appear in 103 frame rows but zero UI-event rows.

These raw counts are not dataset rows. Most clicks, typing, and scrolling should be ignored.

## What Dylan labels

Include:

- switching to another application or window;
- opening a specific browser page, tab, or embedded preview;
- opening a document, message thread, project, folder, or Codex task;
- focusing a meaningful input field;
- activating a link or button that materially changes the working context; and
- a continuous multi-input route to one exact destination.

Exclude:

- ordinary typing;
- ordinary scrolling within one page;
- cursor repositioning;
- text selection;
- window resizing;
- promotional-dialog dismissal unless it is genuinely the destination being tested;
- computer-use automation actions that Screenpipe did not record as Dylan's physical route; and
- any row whose true source state or destination Dylan cannot label confidently.

## Manual review workflow

### Pass 1: mark candidates quickly

Replay the candidate window in Screenpipe. For each meaningful transition, record:

- approximate local timestamp;
- one-line state before navigation;
- one-line destination;
- whether it felt like a shortcut opportunity; and
- `keep`, `unclear`, or `exclude`.

Do not stop to reconstruct every low-level action on the first pass.

### Pass 2: fully label kept rows

For every `keep` row:

1. Rewind to immediately before the first navigation input.
2. Record the exact cutoff timestamp.
3. Confirm what Dylan saw on both monitors.
4. Record or reference the latest frame from each monitor strictly before the cutoff.
5. Play forward until the destination stabilizes.
6. Record the full low-level route and exact semantic destination as hidden ground truth.
7. Estimate clicks, keys, and elapsed time.
8. Mark label confidence.
9. Exclude the row if the pre-action observation or destination is not actually recoverable.

Later frames may verify the hidden destination. They never enter the predictor packet.

### Pass 3: freeze the chronological dataset

After Dylan approves the labels:

1. keep all rows in chronological order;
2. freeze the ground-truth row schema and destination-label format;
3. use the first five complete, eligible rows for the workflow smoke test;
4. run one state-only prediction per smoke-test row;
5. save each prediction before opening that row's hidden destination;
6. fix any workflow defect before labeling the rest of the recording; and
7. if the workflow works, continue toward approximately 60 full-fidelity rows for the paired history experiment.

The five-row shakedown is a test of the labeling and scoring machinery. It does not replace the full manual dataset.

## Candidate index

Add one line per possible transition during the fast pass.

| Candidate | Local timestamp | Before state | Destination | Shortcut opportunity | Verdict | Notes |
|---|---|---|---|---|---|---|
| `BLOG-001` |  |  |  |  |  |  |

## Exact ground-truth row contract

One row is one human navigation from a stable source state to one stable semantic destination.

The prediction cutoff is the instant immediately before the first click or keystroke that begins the route. Both before-state screenshots must have capture timestamps strictly earlier than that cutoff. The destination becomes stable when the intended page, document, conversation, folder, task, field, link, button, or other meaningful focus target is visibly reached.

### Required fields

| Group | Field | Rule |
|---|---|---|
| Identity | `event_id` | Stable ID such as `BLOG-001`; never reuse an ID |
| Identity | `session_id` | Screenpipe session or review-segment identifier |
| Boundary | `prediction_cutoff_local` | Local time immediately before the first navigation input |
| Boundary | `prediction_cutoff_utc` | Same cutoff in UTC |
| Boundary | `destination_stable_at_utc` | First time the destination is visibly stable |
| Before state | `monitor_1_before` | Image or exact frame reference captured strictly before the cutoff |
| Before state | `monitor_3_before` | Image or exact frame reference captured strictly before the cutoff |
| Before state | `source_state_note` | Labeler-only description used for QA, not shown to the predictor |
| Hidden outcome | `actual_destination.canonical_label` | Exact textual answer in `app -> object -> subtarget` form |
| Hidden outcome | `actual_destination.app` | Destination application |
| Hidden outcome | `actual_destination.object` | Specific page, document, thread, folder, task, or window |
| Hidden outcome | `actual_destination.subtarget` | Meaningful field, control, section, or focus target when applicable |
| Hidden outcome | `actual_route` | Human route from cutoff to destination; never predictor-visible |
| Verification | `after_evidence` | Later image or exact frame proving the destination label |
| Verification | `label_confidence` | `clear`, `unclear`, or `exclude` |
| Eligibility | `human_initiated` | Must be `true` for a scored row |
| Eligibility | `history_eligible` | `true` only when the row can safely appear as past context |
| Eligibility | `privacy_status` | `allowed` or `exclude` |
| Utility | `navigation_cost` | Observed clicks, keystrokes, and elapsed time |
| Utility | `shortcut_opportunity` | Dylan's post-label judgment: `yes`, `maybe`, or `no` |
| Notes | `labeler_notes` | Ambiguity, gaps, or unusual evidence |

### Ground-truth row template

Copy this block for each kept transition.

```yaml
event_id: BLOG-001
session_id:
prediction_cutoff_local:
prediction_cutoff_utc:
destination_stable_at_utc:
before_state:
  monitor_1:
    image_or_frame_ref:
    captured_at_utc:
    milliseconds_before_cutoff:
  monitor_3:
    image_or_frame_ref:
    captured_at_utc:
    milliseconds_before_cutoff:
source_state_note:
actual_destination:
  canonical_label:
  app:
  object:
  subtarget:
actual_route:
after_evidence:
  image_or_frame_ref:
  captured_at_utc:
navigation_cost:
  clicks:
  keystrokes:
  elapsed_seconds:
label_confidence: clear
human_initiated: true
history_eligible: true
privacy_status: allowed
shortcut_opportunity:
labeler_notes:
```

The ground-truth dataset keeps all of these fields. It does not store a hand-selected `available_history` field. History is derived mechanically from earlier eligible rows so that it cannot become stale or be selected after seeing the answer.

## Predictor views

The same ground-truth row produces different predictor packets.

### State-only packet

The predictor receives:

- the current row's `monitor_1_before` image;
- the current row's `monitor_3_before` image; and
- the frozen prediction instruction.

It does not receive the labeler's `source_state_note`. The screenshots are the current-state evidence.

### State-plus-history packet

The predictor receives:

- the exact same two current before-state images;
- the exact same prediction instruction; and
- the ten most recent eligible historical rows, ordered oldest to newest.

Each historical row contributes only:

- its two before-state screenshots;
- its `actual_destination.canonical_label`; and
- its timestamp so a long gap remains visible.

The historical destination is allowed because it occurred before the current prediction cutoff. Historical routes, after-evidence images, navigation costs, usefulness judgments, and labeler notes are omitted.

### Mechanical history-selection rule

For target row `i`:

1. Consider only rows whose destination stabilized strictly before row `i`'s prediction cutoff.
2. Keep only rows with `label_confidence: clear`, `human_initiated: true`, `history_eligible: true`, and `privacy_status: allowed`.
3. Sort them by `destination_stable_at_utc`.
4. Select the last ten.
5. Present those ten oldest to newest.

Do not choose examples because they appear similar to the target. Do not use a current or future destination to retrieve history. If fewer than ten eligible rows exist, use all available rows, but do not treat that trial as part of the fixed-ten main comparison.

## Prediction-run record

Predictions belong in a separate results table. One model call produces one result row:

```yaml
run_id:
event_id:
condition: state_only
model:
model_version:
prompt_version:
history_event_ids: []
prediction_saved_at_utc:
ranked_predictions:
  - rank: 1
    canonical_label:
    reason:
  - rank: 2
    canonical_label:
    reason:
  - rank: 3
    canonical_label:
    reason:
scored_after_prediction:
  exact_top_1:
  exact_top_3:
  useful_shortcut:
  scoring_notes:
```

For the history condition, `history_event_ids` records the exact ten rows supplied to the model. Every call must use a fresh model context. Save the prediction before revealing or scoring against the current row's destination.

## Five-row smoke test

Gather the first five complete, eligible rows before labeling the rest of the five-hour recording. For each row:

1. confirm both before-state images are readable and strictly pre-cutoff;
2. confirm the textual destination and later verification image agree;
3. render a state-only predictor packet;
4. obtain up to three ranked destination predictions in a fresh model context;
5. save the prediction;
6. reveal and score the hidden destination; and
7. record any ambiguity or packet failure.

The smoke test passes when all five rows can be captured, rendered, predicted, and scored without changing the row contract or rebuilding capture infrastructure. Model accuracy is not the pass criterion.

Rows 2 through 5 may be rendered once with the preceding available smoke-test rows to verify that a history packet is technically readable. Their history lengths will vary from one to four, so these outputs are not evidence about the value of a fixed ten-row history window.

## Larger same-session experiment

If the smoke test passes, continue toward approximately 60 eligible rows:

- The first ten eligible rows establish the initial history and are not part of the fixed-ten paired comparison.
- Each later row is predicted under two matched conditions: `state_only` and `state_plus_recent_10`.
- The history condition receives the ten most recent eligible full-fidelity state-destination pairs before that row.
- Approximately 50 rows should therefore produce approximately 100 matched model calls.
- The same off-the-shelf multimodal model, model version, prompt, output format, and current screenshots must be used in both conditions.
- Report exact top-one, exact top-three, shortcut usefulness, raw paired gains and losses, and representative failures.

This is exploratory go/no-go evidence for whether recent context helps during one blog-building workflow. It is not a statistically conclusive study, evidence of durable cross-day personalization, or proof that a model understands Dylan's goals.

Because every row is stored at full fidelity, later tests may compare recent 5, recent 20, all prior, retrieved-similar, or deliberately mismatched history without relabeling the source data.

## Leakage boundary

For the current target row, the predictor never sees:

- `source_state_note`;
- `actual_route`;
- `actual_destination`;
- `after_evidence`;
- navigation cost or shortcut judgment;
- any row that had not completed before the current prediction cutoff; or
- any future history entry.

## Experimental role of the dataset

The manually labeled before-and-after rows are the data.

The experimental variable is not the after state. It is whether the model receives earlier personal activity:

1. the current row's two pre-action screenshots only; or
2. the same screenshots plus the ten most recent eligible full-fidelity state-destination rows.

The after destination remains hidden ground truth for scoring.

Because this recording follows one blog project, a same-session result mainly tests whether recent task context helps. It does not establish durable personalization across days or unrelated work. That stronger question still requires the later two-day experiment.

## Links

- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-shadow-experiment#July 26 decision: manual retrospective prediction pilot|Manual retrospective prediction pilot]]
- [[screenpipe-natural-work-audit-2026-07-28|Partial Screenpipe natural-work audit, July 28, 2026]]
- [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Candidate shakedown predictor packets, July 28, 2026]]
