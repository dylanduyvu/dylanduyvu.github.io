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

> state immediately before an eligible action -> exact immediate action target

Dylan is the ground-truth labeler. His manual label from watching the recording
is authoritative. For V4, watch only the monitor 3 video during routine
labeling. Screenpipe metadata, monitor 1 companion evidence, and later frames
are optional QA, not an eligibility gate. Codex can maintain the worksheet,
find the strictly prior monitor 3 frame, and prepare predictor packets after
Dylan has labeled the actions.

Do not use the earlier candidate packet or V3 harness. The V3 20-row checkpoint
and 38-call experiment are complete and immutable. V4 was method-frozen before
future labels at `2026-07-29T01:56:17.000Z`; its method-lock SHA-256 is
`55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa`.
Do not scale toward roughly 200 rows until the fresh V4 holdout is reviewed.

## Completed smoke readout

`BLOG-SMOKE-20260728-V3` completed 38 model calls and scored 19 paired targets.
The predictor saw the current two-monitor state alone or the same state plus
every earlier frozen row.

In the preregistered transport-recovered view:

| Condition | Exact top-1 | Exact top-3 |
|---|---:|---:|
| Current screenshots only | 0/19 | 0/19 |
| Current screenshots plus all earlier rows | 5/19 | 6/19 |

In ordinary accuracy terms, history was correct on 5 targets and incorrect on
14 at top-1; it was correct on 6 and incorrect on 13 at top-3. In paired
win/loss/tie terms, top-1 was 5 wins, 0 losses, and 14 ties because both
conditions were wrong on those 14 targets. Top-3 was 6 wins, 0 losses, and 13
ties. This is a provisional signal pass.

It is also a method-repair result. All frozen accepted-alias lists were empty.
History saw earlier canonical target wording, while state-only had to invent
names. The exact free-text scorer could reject apparently identical
destinations because one prediction added `conversation`, `task`, or `prompt`.
Do not use this development-set gap alone to justify a larger labeling push.

A completed condition-blind lexical-only rescore made no new model calls. Its
conservative primary result preserves target granularity:

| Condition | Semantic top-1 | Semantic top-3 |
|---|---:|---:|
| Current screenshots only | 1/19 | 1/19 |
| Current screenshots plus all earlier rows | 4/19 | 5/19 |

Paired results are 3 history wins, 0 losses, and 16 ties at top-1, and 4 wins,
0 losses, and 15 ties at top-3.

A separate granularity-inclusive sensitivity retains the earlier state-only
2/19 top-1 and 5/19 top-3 versus history 5/19 and 7/19, with paired 4/1/14 and
3/1/15. It is not primary. Six ambiguous child-control ranks are queued for
Dylan's granularity decision, and shortcut usefulness remains unresolved. The
complete matrix and history-depth breakdown are in
[[computer-use-nap-v3-posthoc-semantic-rescore-2026-07-28|NAP V3 post-hoc semantic rescore, July 28, 2026]].

Fourteen history calls recovered from WebSocket disconnects by falling back to
HTTPS. The frozen event classifier mislabeled the fallback error item as tool
use. A condition-blind recovery policy was checksum-frozen before label reveal,
and the immutable as-recorded result is preserved separately.

Full private readout:

- `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/REPORT.md`
- `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/summary.json`
- `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/INTERPRETATION.md`
- `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/results/BLOG-SMOKE-20260728-V3/HITS-FOR-REVIEW.md`
- `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/SEMANTIC-ADJUDICATION.md`
- `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/semantic-adjudication.json`

## V4 superseding labeling and experiment contract

This section supersedes the V3 dual-monitor and expanding-history instructions
later in this note. Those later sections remain only as the historical record
of what V3 ran.

### What Dylan does

Watch the monitor 3 video only. For each candidate, provide:

```text
video: compact_monitor_3_...

00:12 [what was visible immediately before]
-> 00:15 [what you focused or activated]
```

Use the exact video filename and player times. Include natural detours and
off-task clicks when they occur on monitor 3. Do not synchronize monitor 1.

If an action leaves monitor 3 for monitor 1, record that fact as an explicit
coverage exclusion. It is not a prediction miss. The companion monitor 1
recording filename or image is optional audit provenance, and no monitor 1
image is ever model-visible.

### Eligible action taxonomy

One row remains one immediate action. The V4 semantic action type is:

- `focus`: only makes an already-present application, object, or field active;
- `activate`: selects, navigates, opens, invokes, submits, dismisses, toggles,
  copies, or otherwise activates the target.

A click is the input method, not the semantic action type. A Submit-button
click is `activate`.

Continue to exclude ordinary typing, paste, scrolling, cursor movement, text
selection, and window resizing. Also exclude actions with an unknown monitor
or ambiguous action type.

### V4 row and target identity

Every eligible `history_only` or `heldout_target` row has:

- stable event identity and chronology;
- the exact source recording filename and player times;
- `action_monitor: 3`;
- one readable strictly prior monitor 3 screenshot;
- `action_type: focus | activate`;
- `input_method`, normally `pointer_click` for this pass;
- an evaluator-only opaque target reference; and
- optional monitor 1 companion provenance marked `predictor_visible: false`.

Target granularity is structural and strict:

| Granularity | `app` | `object` | `subtarget` |
|---|---|---|---|
| application | string | `null` | `null` |
| object | string | string | `null` |
| subtarget | string | string | string |

The same user-recognized destination at the same granularity reuses its opaque
target ID. A different granularity gets a different target ID. Opaque target
IDs remain evaluator-only and never enter prompts, response schemas, image
paths, or clean model-call directories.

### V4 chronology and holdout

The method is frozen. Start future V4 labels only after its
`2026-07-29T01:56:17.000Z` cutoff.

1. The first ten or more chronological eligible monitor 3 actions labeled
   under the frozen method form the history-only pool. Their source-video
   action times may predate the freeze; their manual label timestamps may not.
2. Close that pool once. Do not choose a stopping point from outcomes.
3. The next exactly 20 chronological eligible monitor 3 actions are the
   untouched held-out targets.
4. For each held-out target, call `state_only` once and
   `state_plus_recent_10` once, for exactly 40 calls.
5. The recent-10 condition uses the ten most recent earlier eligible monitor 3
   rows, oldest to newest.
6. Once an earlier held-out action has occurred, its frozen label may enter
   later rolling history. Predictions, scores, adjudications, and usefulness
   ratings never enter history.

### V4 predictor and scoring boundary

`state_only` sees one current monitor 3 before-state screenshot.
`state_plus_recent_10` sees ten earlier monitor 3 state/action examples and the
same current screenshot. The current target, current action type, opaque target
IDs, monitor 1 evidence, later evidence, labels, and QA notes stay hidden.

Report these separately:

- normalized exact target top-1 and top-3, with Unicode NFKC, lowercase,
  trimming, collapsed whitespace, no aliases, and strict granularity;
- action-type accuracy;
- exact action, requiring both exact target and action type;
- condition- and rank-blind semantic same-target adjudication; and
- Dylan's shortcut-usefulness judgment.

V4 is not numerically comparable with V3 because it changes monitor coverage,
history length, response schema, and target-granularity scoring.

Canonical private V4 artifacts:

- schema audit:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/postrun-analysis/v4-repair/V4-SCHEMA-AUDIT.md`
- method policy:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/method-policy.json`
- labeling guide:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/LABELING-GUIDE.md`
- adjudication rubric:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/ADJUDICATION-RUBRIC.md`
- isolated harness:
  `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/experiment-v4/`

## Historical V3 experiment contract

Dylan clarified the data and context design on July 28:

- The durable dataset stores each eligible action at full fidelity.
- One row pairs the two screenshots immediately before one eligible action with a textual label for that action's exact immediate target.
- Never collapse consecutive actions into an eventual target. After every eligible action, the resulting state becomes a new possible predictor input.
- A later screenshot may be retained as an optional reference, but Dylan's manual label does not require Screenpipe corroboration. The predictor never sees the current row's later screenshot or action target.
- The first checkpoint is 20 atomic-action candidates. It is a small method-and-signal experiment, not a conclusive evaluation.
- In the larger same-session experiment, the history condition receives the ten most recent eligible rows completed before the current prediction cutoff.
- Each historical row is shown at full fidelity as its two before-state screenshots plus its now-known textual action target.
- Historical rows are selected by recency, not perceived similarity. Retrieval and longer context windows are later experiments.
- The 20-row smoke test intentionally overrides the later fixed-ten rule: for
  each of its 19 paired targets, the history condition receives every earlier
  frozen row available at that point. History grows from one row to 19 rows.
  This maximizes available workflow signal for the small pilot; it is not a
  fixed-dose comparison.

This keeps two concerns separate:

1. **Storage fidelity:** preserve the manual label and enough pre-action visual state to render different experiments later without relabeling.
2. **Predictor exposure:** give the model a fixed, leakage-safe view of the pre-action state for each condition.

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

Segment D should not supply ordinary physical-action rows for actions performed by automation. It can still provide later visual evidence or a physical row if Dylan personally initiated and completed a qualifying action.

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

For V4, apply the list below only to actions performed on monitor 3. Preserve
monitor 1 or unknown-monitor actions as explicit coverage exclusions. Do not
open or synchronize the monitor 1 video for routine labeling.

Include:

- switching to another application or window;
- opening a specific browser page, tab, or embedded preview;
- opening a document, message thread, project, folder, or Codex task;
- focusing a meaningful input field;
- activating a link or button that materially changes the working context; and
- one immediate click, keystroke, or focus action targeting one exact application, object, field, link, button, or control.

Do not combine consecutive actions. For example:

1. `Coda focused -> click/focus Codex`
2. `Codex focused -> click the response copy button`

These are two rows. The second row is predicted from screenshots captured after Codex is focused and before the copy click.

Exclude:

- ordinary typing;
- paste and other keyboard text entry; retain their visible results in the next row's `source_state_note` when useful context;
- ordinary scrolling within one page;
- cursor repositioning;
- text selection;
- window resizing;
- promotional-dialog dismissal unless it is genuinely the action target being tested;
- computer-use automation actions that Screenpipe did not record as Dylan's physical action; and
- any row whose true source state or immediate action target Dylan cannot label confidently.

## Historical V3 manual review workflow

### Stage 1: reach the 20-row checkpoint

The completed pass resumed in `compact_monitor_3_1785164400568.mp4` immediately after player time `01:29` without backfilling the earlier first-video candidates. For each possible eligible next action, the collection rule was to record:

- approximate local timestamp;
- one-line state before the action;
- one-line immediate action target;
- whether it felt like a shortcut opportunity; and
- `keep`, `unclear`, or `exclude`.

Candidates were kept in chronological order without skipping a qualifying cursor/focus action in favor of a later or more interesting example.

Current status: collection complete and visual preflight complete. The workbook
contains 30 candidates. Screenpipe skipped the exact intermediate pre-action
state for `BLOG-CAND-005`, `BLOG-CAND-012`, `BLOG-CAND-015`,
`BLOG-CAND-017`, and `BLOG-CAND-025`, so those labels are preserved but
excluded from the screenshot-based mini. The proposed 20-row visual pool is
`BLOG-CAND-003`, `004`, `006`, `007`, `008`, `009`, `010`, `011`, `013`,
`014`, `016`, `018`, `019`, `020`, `021`, `022`, `023`, `024`, `026`, and
`027`. Dylan reviewed those image/action pairs, reported no corrections, and
froze them as `BLOG-MINI-20-V1` / `MINI-20-20260728-V1`.
`BLOG-CAND-028` through `BLOG-CAND-032` remain reserve rows.

### Stage 2: fully label each candidate

For every `keep` row:

1. Rewind to immediately before that action's click or keystroke.
2. Record the exact cutoff timestamp.
3. Confirm what Dylan saw on both monitors.
4. Record or reference the latest frame from each monitor strictly before the cutoff.
5. Play forward only until that immediate action reaches or activates its target.
6. Record the exact input and exact immediate action target as hidden ground truth. Dylan's observation is authoritative.
7. Estimate clicks, keys, and elapsed time.
8. Mark label confidence.
9. Exclude the row only if Dylan cannot confidently label the immediate action target or the predictor-visible pre-action observation cannot be recovered without leakage.

Later frames and Screenpipe metadata may corroborate the hidden action target. Record their support status, but do not use them to overrule Dylan or determine eligibility. They never enter the predictor packet.

### Stage 3: mini prediction experiment, then decide

At 20 candidates:

1. stop labeling;
2. finish the required predictor inputs for usable rows and freeze a 20-row checkpoint snapshot;
3. choose and record the bounded mini-experiment protocol before the first model call;
4. save each raw response and structured prediction before revealing that row's hidden action target;
5. inspect both prediction signal and method failures; and
6. decide whether to revise the collection or evaluation method, or scale toward roughly 200 rows.

The 20-row checkpoint is exploratory. It does not commit the project to a 200-row push, and it does not by itself establish durable personalization.

The preserved original smoke-test protocol is
`BLOG-EXPANDING-HISTORY-SMOKE-V1`; do not execute it. Its approved
pre-execution successor is `BLOG-EXPANDING-HISTORY-SMOKE-V2`.
`BLOG-CAND-003` seeds history. Each of the remaining 19 frozen rows receives
one `state_only` call and one `state_plus_all_prior` call, for 38 calls total.
Use one `gpt-5.6-sol`/`max` single-model call per condition with no repeated
trials, automatic delegation, or model comparison. Full execution details
live in the private canonical workbook.

> Historical pre-execution review update, 2026-07-28: V1 must
> not be executed. The reviewed plan at
> `/Users/dylanvu/screenpipe-datasets/blog-work-20260727/EXECUTION-PLAN.md`
> first requires Dylan to approve a uniform structured target table and the
> actual Codex base-plus-developer-plus-user prompt stack. That approval mints
> a superseding V2 while preserving V1. The dataset membership, chronological
> all-prior comparison, 38-attempt limit, and scoring rules stay unchanged.
> Dylan approved both repair-gate choices at `2026-07-28T19:55:56Z`.
> At `2026-07-28T20:49:04Z`, Dylan approved `max` reasoning, a 1,200-second
> timeout, and a circuit breaker that saves an infrastructure-failed slot and
> pauses before the next slot. Restarting skips all saved attempts and
> continues from the first missing slot; failed slots are never retried.
> V2 later stopped before its first model call on an isolated-runtime-home
> preflight defect. The test-driven repair was minted and completed as V3.

## Candidate index

Add one line per possible eligible action during the fast pass.

| Candidate | Local timestamp | Before state | Immediate action target | Shortcut opportunity | Verdict | Notes |
|---|---|---|---|---|---|---|
| `BLOG-001` |  |  |  |  |  |  |

## Historical V3 ground-truth row contract

> [!warning] V3 only
> The dual-monitor, alias-bearing row contract below records the completed V3
> experiment. Do not use it for new V4 labels. Use `V4 superseding labeling
> and experiment contract` above and the private V4 labeling guide.

One row is one immediate eligible human action from its pre-action state to its exact target. Consecutive actions are separate rows, even when they occur within the same player second.

The prediction cutoff is the instant immediately before that action's click or keystroke. Both before-state screenshots must have capture timestamps strictly earlier than that cutoff. The action completes when its intended application, page, document, conversation, folder, task, field, link, button, or other control is reached or activated.

### Required fields

| Group | Field | Rule |
|---|---|---|
| Identity | `event_id` | Stable ID such as `BLOG-001`; never reuse an ID |
| Identity | `row_version` | Integer content version for this event row |
| Identity | `logical_session_id` | `BLOG-WORK-20260727` for this complete multi-segment workflow |
| Identity | `capture_segment_id` | Review segment `A`, `B`, `C`, or `D`; gaps are not segments |
| Identity | `source_recording_ref` | Screenpipe session, compact-video, or database reference |
| Boundary | `prediction_cutoff_local` | Local time immediately before this action's click or keystroke |
| Boundary | `prediction_cutoff_utc` | Same cutoff in UTC |
| Boundary | `action_completed_at_utc` | First time the immediate action has reached or activated its target |
| Before state | `before_state.monitor_1` | Readable image or exact frame reference captured strictly before the cutoff |
| Before state | `before_state.monitor_3` | Readable image or exact frame reference captured strictly before the cutoff |
| Before state | `source_state_note` | Labeler-only description used for QA, not shown to the predictor |
| Hidden outcome | `next_action_target.canonical_label` | Exact target label in `app -> object -> subtarget` form |
| Hidden outcome | `next_action_target.app` | Target application |
| Hidden outcome | `next_action_target.object` | Specific target page, document, thread, folder, task, or window |
| Hidden outcome | `next_action_target.subtarget` | Target field, control, section, or focus target when applicable |
| Hidden outcome | `next_action_target.accepted_aliases` | Component aliases frozen before prediction, never added after seeing output |
| Hidden outcome | `action` | The click, keystroke, or input that performs this one action; never predictor-visible |
| QA | `after_evidence` | Optional later image or exact frame retained as a reference |
| QA | `screenpipe_support` | `not_checked`, `corroborated`, `partial`, `absent`, or `contradictory`; never an eligibility gate |
| QA | `screenpipe_support_notes` | Optional description of what Screenpipe did or did not corroborate |
| Verification | `label_confidence` | `clear`, `unclear`, or `exclude` |
| Eligibility | `human_initiated` | Must be `true` for a scored row |
| Eligibility | `privacy_status` | `allowed` or `exclude` |
| Eligibility | `dataset_eligible` | Derived from the complete predicate below, not assigned by judgment |
| Eligibility | `eligibility_frozen_at_utc` | Time eligibility and accepted labels were frozen |
| Utility | `navigation_cost` | Observed clicks, keystrokes, and elapsed time |
| Utility | `shortcut_opportunity` | Dylan's post-label judgment: `yes`, `maybe`, or `no` |
| Notes | `labeler_notes` | Ambiguity, gaps, or unusual evidence |

### Frozen eligibility predicate

`dataset_eligible` is `true` if and only if all of these conditions hold before any model call:

1. the event is an eligible immediate next action under `What Dylan labels`;
2. `label_confidence` is `clear`;
3. `human_initiated` is `true`;
4. `privacy_status` is `allowed`;
5. both before-state images are readable and have timestamps strictly before `prediction_cutoff_utc`;
6. `action_completed_at_utc` is strictly after the cutoff;
7. Dylan manually labeled and approved the immediate action target before any model call;
8. action target `app` and `object` are nonempty, and `subtarget` is filled when the intended target is more specific than the object;
9. the row does not duplicate or overlap another kept action; and
10. the row belongs to `BLOG-WORK-20260727`.

Order eligible rows by `prediction_cutoff_utc`, breaking an exact timestamp tie by `event_id`. Eligibility, accepted aliases, and manifest membership freeze before model calls. If a later correction changes any of them, create a new dataset and manifest version and rerun every affected prediction. Do not silently mutate a frozen manifest.

### Ground-truth row template

Copy this block for each kept action.

```yaml
event_id: BLOG-001
row_version: 1
logical_session_id: BLOG-WORK-20260727
capture_segment_id:
source_recording_ref:
prediction_cutoff_local:
prediction_cutoff_utc:
action_completed_at_utc:
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
next_action_target:
  canonical_label:
  app:
  object:
  subtarget: null
  accepted_aliases:
    app: []
    object: []
    subtarget: []
action:
after_evidence:
  image_or_frame_ref: null
  captured_at_utc: null
screenpipe_support: not_checked
screenpipe_support_notes:
navigation_cost:
  clicks:
  keystrokes:
  elapsed_seconds:
label_confidence: clear
human_initiated: true
privacy_status: allowed
dataset_eligible:
eligibility_frozen_at_utc:
shortcut_opportunity:
labeler_notes:
```

The ground-truth dataset keeps all of these fields. It does not store a hand-selected `available_history` field. History is derived mechanically from earlier eligible rows so that it cannot become stale or be selected after seeing the answer.

Each immutable dataset snapshot has its own manifest:

```yaml
dataset_snapshot_id: BLOG-MINI-20-V1
manifest_id: MINI-20-20260728-V1
logical_session_id: BLOG-WORK-20260727
frozen_at_utc:
ordered_event_refs:
  - event_id: BLOG-001
    row_version: 1
```

Assign a separate snapshot and manifest ID only if Dylan chooses a later scaled experiment after reviewing the 20-row checkpoint.

## Historical V3 predictor views

The same ground-truth row produces different predictor packets.

### State-only packet

The predictor receives:

- the current row's `before_state.monitor_1` image;
- the current row's `before_state.monitor_3` image; and
- the frozen prediction instruction.

It does not receive the labeler's `source_state_note`. The screenshots are the current-state evidence.

### State-plus-history packet

The predictor receives:

- the exact same two current before-state images;
- the exact same prediction instruction; and
- the historical rows selected by the frozen protocol, ordered oldest to newest.

Each historical row contributes only:

- its two before-state screenshots;
- its structured `next_action_target` serialized as compact JSON with fixed
  key order `app`, `object`, `subtarget`.

The historical action target is allowed because it occurred before the current prediction cutoff. Historical actions, after-evidence images, navigation costs, usefulness judgments, and labeler notes are omitted.

`BLOG-EXPANDING-HISTORY-SMOKE-V2` supplies every earlier frozen row, from one
through 19. A later scaled protocol defaults to the ten most recent rows.

### Frozen prompt and packet rendering

Use the actual Codex prompt stack approved by Dylan: the immutable Codex base
prompt, then prompt ID `NAP-ACTION-TARGET-V1` as `developer_instructions`,
then one user packet. The frozen developer instruction is:

```text
You are predicting the exact target of Dylan's next eligible computer action from screenshots captured strictly before that action.

Return up to three ranked action targets. Each target must contain:
- app
- specific object: page, document, conversation, folder, task, or window
- subtarget: field, control, section, or focus target, or null when the object is the complete target
- one short reason using only the supplied evidence

Predict the application, object, and subtarget of the immediate next eligible action. Do not combine multiple actions into an eventual target. Do not predict ordinary typing, scrolling, cursor movement, text selection, or window resizing.

Return JSON only in exactly this shape:
{
  "predictions": [
    {
      "rank": 1,
      "app": "string",
      "object": "string",
      "subtarget": "string or null",
      "reason": "string"
    }
  ]
}

Return between one and three predictions. Ranks must be consecutive integers beginning at 1. Do not add other top-level keys.

Do not call tools, inspect the filesystem, search, or use information outside the supplied instruction, text blocks, and attached images.
```

The user message contains neutral image-order text and the images. For the
history condition, render historical rows exactly in this form:

```text
ATTACHED IMAGE ORDER
Image 1: HISTORY EXAMPLE 1 monitor 1 before state
Image 2: HISTORY EXAMPLE 1 monitor 3 before state
...
Image N-1: CURRENT BEFORE STATE monitor 1
Image N: CURRENT BEFORE STATE monitor 3
END ATTACHED IMAGE ORDER

HISTORY EXAMPLE 1
known_action_target: {"app":"Arc","object":"Coda: all hands 7.27 meeting note","subtarget":null}
END HISTORY EXAMPLE 1
```

Render every history row selected by the current frozen protocol, oldest to
newest. End with:

```text
Predict the immediate next eligible action from the CURRENT BEFORE STATE.
```

The state-only user message contains only the neutral two-image current order
and the final prediction sentence. Candidate IDs, timestamps, source paths,
and current labels stay in the audit manifest and never enter either
predictor-visible packet. Do not make collages, rewrite image contents as
prose, or change monitor order.

Literal valid response example:

```json
{
  "predictions": [
    {
      "rank": 1,
      "app": "Chrome",
      "object": "Substack draft: Day 0 Took Three Days",
      "subtarget": "editor",
      "reason": "The visible article workflow appears ready to move into the publishing editor."
    }
  ]
}
```

### Mechanical history-selection rule

For target row `i`:

1. Use only rows in the current frozen protocol manifest and `logical_session_id`.
2. Consider only `dataset_eligible: true` rows whose actions completed strictly before row `i`'s prediction cutoff.
3. Sort them by `action_completed_at_utc`, breaking a tie by `event_id`.
4. For `BLOG-EXPANDING-HISTORY-SMOKE-V2`, select every earlier eligible row in
   `BLOG-MINI-20-V2`. For a later fixed-ten protocol, select the last ten.
5. Present the selected rows oldest to newest.

Do not choose examples because they appear similar to the target. Do not use a
current or future action target to retrieve history.

Freeze and save each target's complete ordered `history_event_ids` manifest
before either condition is called.

Do not apply this expanding-history exception automatically to a later scaled
experiment. The later main experiment still defaults to the fixed recent-ten
rule unless Dylan changes it after reviewing the smoke test.

## Historical V3 prediction-run record

Predictions belong in a separate results table. One model call produces one result row:

```yaml
run_id:
dataset_snapshot_id:
manifest_id:
event_id:
event_row_version:
condition: state_only
paired_target_ordinal:
call_sequence_index:
model_provider:
model_name:
model_version:
inference_parameters:
  temperature:
  top_p:
  max_output_tokens:
  seed:
  provider_defaults:
prompt_id: NAP-ACTION-TARGET-V1
history_event_ids_ordered: []
rendered_packet_path:
rendered_packet_sha256:
requested_at_utc:
raw_response_path:
raw_response_sha256:
attempt_status: valid_prediction
invalid_reason: null
attempt_saved_at_utc:
prediction_saved_at_utc:
ranked_predictions:
  - rank: 1
    app:
    object:
    subtarget:
    canonical_label:
    reason:
  - rank: 2
    app:
    object:
    subtarget:
    canonical_label:
    reason:
  - rank: 3
    app:
    object:
    subtarget:
    canonical_label:
    reason:
label_revealed_at_utc:
scored_after_prediction:
  exact_top_1:
  exact_top_3:
  useful_shortcut:
  scoring_notes:
scored_at_utc:
scorer:
```

For the history condition, `history_event_ids_ordered` records every row
supplied to the model; the rendered packet manifest records their row versions.
Every call must use a fresh model context. Record explicit inference settings
when supported and record which provider defaults were left unset. Save the
rendered packet, raw response, and structured prediction before revealing or
scoring against the current row's action target.

For the paired smoke test, alternate call order to reduce service-time drift:
odd target ordinals call `state_only` first; even target ordinals call
`state_plus_all_prior` first. A later fixed-ten protocol uses
`state_plus_recent_10`.

`attempt_status` is one of:

- `valid_prediction`: a no-tool, schema-valid final response was saved;
- `invalid_tool_use`: the event log contains a predictor tool invocation;
- `invalid_schema`: a final model response exists but violates the frozen JSON schema; or
- `infrastructure_failure`: no final model response exists because the CLI,
  transport, or provider failed.

`prediction_saved_at_utc` is non-null only for `valid_prediction`.
`attempt_saved_at_utc` is required for every status. For a paired target, do
not reveal its hidden label until both condition records have nonempty
`attempt_saved_at_utc` values. `label_revealed_at_utc` is one pair-level event
copied into both result rows. Set `ranked_predictions: []` for every non-valid
attempt.

## Historical V3 scoring contract

Before prediction, freeze the action-target components and any accepted component aliases. Normalize model outputs and frozen labels only by lowercasing, trimming leading and trailing whitespace, and collapsing repeated internal whitespace.

An exact action-target match requires:

- normalized `app` to equal the frozen app or one of its frozen aliases;
- normalized `object` to equal the frozen object or one of its frozen aliases; and
- when the frozen `subtarget` is non-null, normalized `subtarget` to equal it or one of its frozen aliases.

When the frozen `subtarget` is null, score only app plus object and ignore any predicted subtarget. `exact_top_1` is true when rank 1 matches. `exact_top_3` is true when any returned rank matches. Do not add an alias after seeing a prediction; create a new row version and dataset snapshot, then rerun instead.

Freeze invalid-attempt scoring as follows:

- `invalid_tool_use` and `invalid_schema` count as `exact_top_1: false` and
  `exact_top_3: false` because the model completed but failed the required
  prediction contract.
- `infrastructure_failure` receives null accuracy fields. Exclude that
  condition slot from its condition accuracy denominator and exclude the
  entire target from paired winner/loss/tie calculations.
- Always report infrastructure coverage and invalid-model-output counts beside
  accuracy, including the exact numerator and denominator for each condition.

`useful_shortcut` is Dylan's post-prediction judgment:

- `yes`: he would have invoked one of the suggestions at that moment and it would have avoided meaningful navigation or search;
- `maybe`: the suggestion was plausible but benefit or willingness is uncertain;
- `no`: he would not have invoked it or it would not have saved meaningful effort.

The scorer records `label_revealed_at_utc`, `scored_at_utc`, and `scorer`.
Label reveal must occur after both paired `attempt_saved_at_utc` values and,
for a `valid_prediction`, after its `prediction_saved_at_utc`.

## Historical V3 twenty-row mini prediction checkpoint

Collection has stopped with 30 chronological atomic-action candidates.
Preflight selected the earliest 20 candidates with usable pre-action image
pairs, ending at `BLOG-CAND-027`. It preserved but visually excluded
`BLOG-CAND-005`, `BLOG-CAND-012`, `BLOG-CAND-015`, `BLOG-CAND-017`, and
`BLOG-CAND-025` because Screenpipe's roughly four-to-five-second frame cadence
skipped the exact intermediate state. `BLOG-CAND-028` through
`BLOG-CAND-032` remain reserve rows.

The image/action review is complete. The completed V3 run:

1. used frozen protocol `BLOG-EXPANDING-HISTORY-SMOKE-V2`; and
2. kept every tested action target hidden until both paired predictions had
   been saved.

The checkpoint asks two practical questions:

- Is there enough prediction signal to justify collecting much more data?
- Did collection, packet construction, prompting, or scoring expose a method problem that should be fixed first?

It is exploratory and is not intended to establish statistical significance or durable personalization.

## Decision after the mini experiment

The checkpoint selected an isolated monitor-3 repair-and-retest path.
Condition-blind V3 adjudication is complete. The conservative primary is
state-only 1/19 top-1 and top-3 versus history 4/19 top-1 and 5/19 top-3,
paired 3/0/16 and 4/0/15. The old 2/5 versus 5/7 result remains only as a
non-primary granularity-inclusive sensitivity.

Freeze the V4 method before future V4 labels. Then resume chronological
monitor 3 labeling under the superseding contract above. Use at least ten
earlier eligible rows as a history-only pool and reserve the next exactly 20
eligible monitor 3 actions as the untouched paired holdout. The retest predicts
only those 20 held-out targets, twice each, for 40 calls.

Decide whether to continue toward roughly 200 rows after separately reviewing
exact target, action type, exact action, blind semantic same-target identity,
and shortcut usefulness. Six V3 granularity ranks and usefulness remain
unresolved human judgments, but they do not change the V4 primary rules.

Because every row is stored at full fidelity, later experiments can choose
different history windows or ask for immediate versus model-defined semantic
continuations without relabeling the atomic base.

## Leakage boundary

For the current target row, the predictor never sees:

- `source_state_note`;
- `action`;
- `next_action_target`;
- `after_evidence`;
- navigation cost or shortcut judgment;
- any row that had not completed before the current prediction cutoff; or
- any future history entry.

For V4 it also never sees monitor 1 evidence, opaque target IDs, target-catalog
data, excluded rows, predictions, scores, adjudications, or usefulness
ratings.

## Experimental role of the dataset

The manually labeled before-and-after rows are the data.

For V4, the experimental variable is whether the model receives earlier
personal activity:

1. the current row's monitor 3 pre-action screenshot only; or
2. that same screenshot plus the rolling ten prior eligible monitor 3
   state-action rows.

Earlier held-out rows enter later rolling history only after their actions
occur. The first ten or more eligible rows are history-only; the next exactly
20 are held-out targets.

The immediate action target remains hidden ground truth for scoring.

Because this recording follows one blog project, a same-session result mainly tests whether recent task context helps. It does not establish durable personalization across days or unrelated work. That stronger question still requires the later two-day experiment.

V3 used dual-monitor current states and all-prior history. It remains a
development run and is not a numeric baseline for V4.

## Links

- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff, July 28, 2026]]
- [[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan, July 28, 2026]]
- [[computer-use-nap-shadow-experiment#July 26 decision: manual retrospective prediction pilot|Manual retrospective prediction pilot]]
- [[screenpipe-natural-work-audit-2026-07-28|Partial Screenpipe natural-work audit, July 28, 2026]]
- [[computer-use-nap-shakedown-predictor-packets-2026-07-28|Candidate shakedown predictor packets, July 28, 2026]]
