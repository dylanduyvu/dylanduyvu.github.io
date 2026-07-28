---
type: project
status: candidate
created: 2026-07-28
updated: 2026-07-28
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - next-action-prediction
  - screenpipe
  - shakedown
  - predictor-input
---

# Computer-use NAP shakedown predictor packets, July 28, 2026

> [!warning] Candidate examples only
> These packets came from the initial short-session audit and are retained only as historical candidate evidence. Never run predictions from this note. Build new smoke and main packets only from the frozen contracts and manifests in [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook, July 28, 2026]].

> [!important] July 28 contract update
> This note's compact text-history packets are superseded. The first five new rows use a state-only workflow smoke test. The later history condition uses the ten most recent eligible full-fidelity rows, each rendered as two before-state screenshots plus its known destination text and timestamp. Follow the manual workbook for the canonical row and packet contract.

## Predictor boundary

This note contains predictor-visible material only. It does not contain the actual route or destination for any event.

Do not open the hidden-label audit while producing predictions. The scorer may open [[screenpipe-natural-work-audit-2026-07-28|Screenpipe natural-work audit, July 28, 2026]] only after both conditions for all five evaluation rows have been saved.

The initial audit proposed these five candidate evaluation rows:

1. `SP-20260727-214619`
2. `SP-20260727-214657`
3. `SP-20260727-215116`
4. `SP-20260727-215123`
5. `SP-20260727-215223`

Keep `SP-20260727-215107` as a spare.

## Prompt

Use the same off-the-shelf multimodal model and the same prompt for both conditions.

```text
You are predicting Dylan's next semantic navigation destination from evidence captured strictly before the first navigation input.

Predict up to three ranked exact destinations. A destination should be specific enough to name the application plus the window, page, task, folder, document, thread, input field, link, button, or other meaningful focus target when the evidence supports it.

Predict a destination, not a low-level route. Do not predict ordinary typing, scrolling, cursor movement, text selection, or window resizing.

Use only the current state, the two pre-action images, and the earlier history included below. Do not assume access to later frames or the actual action.

Return:
1. destination
2. destination
3. destination

For each destination, add one short reason grounded only in the permitted evidence.
```

Run each row twice:

1. `state_only`: omit the permitted earlier history.
2. `state_plus_history`: include the permitted earlier history exactly as written.

Save both outputs before moving to the hidden scorer.

## Media references

The pre-action frames are stored in two existing compact videos:

- monitor 1: `/Users/dylanvu/.screenpipe/data/data/2026-07-28/compact_monitor_1_1785204977089.mp4`
- monitor 3: `/Users/dylanvu/.screenpipe/data/data/2026-07-28/compact_monitor_3_1785204979758.mp4`

The database frame IDs and compact-video offsets below identify the exact predictor inputs. Do not substitute `ui_events.frame_id`.

## `SP-20260727-214619`

- local timestamp: July 27, 2026, 9:46:19.650 PM EDT
- UTC cutoff: `2026-07-28T01:46:19.650504Z`
- current state: Codex, inside the ChatGPT desktop app, task `Patch NAP blog prep in vault`, at the response containing the `graphics-options.html` Web preview card. The ChatGPT conversation `personalization obsidian` is visible alongside it.
- pre-action evidence:
  - monitor 1 frame `9468`, compact offset `9`, 24.483 seconds before cutoff
  - monitor 3 frame `9467`, compact offset `12`, 29.748 seconds before cutoff
- permitted earlier history: none; the session starts in the current context

## `SP-20260727-214657`

- local timestamp: July 27, 2026, 9:46:57.902 PM EDT
- UTC cutoff: `2026-07-28T01:46:57.901507Z`
- current state: Codex browser preview at `localhost:64437`, page `Which graphic earns its place?`, option B selected. The Codex composer contains `ok`.
- pre-action evidence:
  - monitor 1 frame `9479`, compact offset `14`, 2.753 seconds before cutoff
  - monitor 3 frame `9480`, compact offset `19`, 2.754 seconds before cutoff
- permitted earlier history:
  - 9:46:30 PM - Codex -> visual comparison preview -> Which graphic earns its place?

## `SP-20260727-215116`

- local timestamp: July 27, 2026, 9:51:16.637 PM EDT
- UTC cutoff: `2026-07-28T01:51:16.637054Z`
- current state: Finder, `/Users/dylanvu`, list view
- pre-action evidence:
  - monitor 1 frame `9505`, compact offset `26`, 1.331 seconds before cutoff
  - monitor 3 frame `9506`, compact offset `33`, 0.500 seconds before cutoff
- permitted earlier history:
  - 9:46:30 PM - Codex -> visual comparison preview -> Which graphic earns its place?
  - 9:47:01 PM - Codex -> Patch NAP blog prep in vault -> conversation, preview closed
  - 9:51:08 PM - Finder -> Recents
  - 9:51:15 PM - Finder -> `/Users/dylanvu`

## `SP-20260727-215123`

- local timestamp: July 27, 2026, 9:51:23.082 PM EDT
- UTC cutoff: `2026-07-28T01:51:23.082010Z`
- current state: Finder, `/Users/dylanvu/notes`, list view
- pre-action evidence:
  - monitor 1 frame `9511`, compact offset `28`, 1.117 seconds before cutoff
  - monitor 3 frame `9512`, compact offset `37`, 0.767 seconds before cutoff
- permitted earlier history:
  - 9:46:30 PM - Codex -> visual comparison preview -> Which graphic earns its place?
  - 9:47:01 PM - Codex -> Patch NAP blog prep in vault -> conversation, preview closed
  - 9:51:08 PM - Finder -> Recents
  - 9:51:15 PM - Finder -> `/Users/dylanvu`
  - 9:51:22 PM - Finder -> `/Users/dylanvu/notes`

## `SP-20260727-215223`

- local timestamp: July 27, 2026, 9:52:23.868 PM EDT
- UTC cutoff: `2026-07-28T01:52:23.868275Z`
- current state: Codex task `Patch NAP blog prep in vault`, agent working on the approved graphic. Finder `70-attachments` is open beside it.
- pre-action evidence:
  - monitor 1 frame `9521`, compact offset `34`, 17.223 seconds before cutoff
  - monitor 3 frame `9520`, compact offset `40`, 18.000 seconds before cutoff
- permitted earlier history:
  - 9:46:30 PM - Codex -> visual comparison preview -> Which graphic earns its place?
  - 9:47:01 PM - Codex -> Patch NAP blog prep in vault -> conversation, preview closed
  - 9:51:08 PM - Finder -> Recents
  - 9:51:15 PM - Finder -> `/Users/dylanvu`
  - 9:51:22 PM - Finder -> `/Users/dylanvu/notes`
  - 9:51:23 PM - Finder -> `/Users/dylanvu/notes/70-attachments`
  - 9:51:33 PM - Codex -> Patch NAP blog prep in vault -> composer, agent working

## Spare: `SP-20260727-215107`

- local timestamp: July 27, 2026, 9:51:07.500 PM EDT
- UTC cutoff: `2026-07-28T01:51:07.500332Z`
- current state: ChatGPT conversation `personalization obsidian`, with the Codex `Patch NAP blog prep in vault` task visible beside it
- pre-action evidence:
  - monitor 1 frame `9500`, compact offset `24`, 3.395 seconds before cutoff
  - monitor 3 frame `9501`, compact offset `30`, 3.395 seconds before cutoff
- permitted earlier history:
  - 9:46:30 PM - Codex -> visual comparison preview -> Which graphic earns its place?
  - 9:47:01 PM - Codex -> Patch NAP blog prep in vault -> conversation, preview closed

## Scoring shell

Fill this only after both prediction conditions are saved.

| Event | State-only top 1 | State-only top 3 | History top 1 | History top 3 | Shortcut useful to Dylan | Notes |
|---|---:|---:|---:|---:|---|---|
| `SP-20260727-214619` |  |  |  |  |  |  |
| `SP-20260727-214657` |  |  |  |  |  |  |
| `SP-20260727-215116` |  |  |  |  |  |  |
| `SP-20260727-215123` |  |  |  |  |  |  |
| `SP-20260727-215223` |  |  |  |  |  |  |
