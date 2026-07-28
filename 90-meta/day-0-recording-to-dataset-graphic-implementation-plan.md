# Recording-to-Dataset Graphic Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one clear, publication-ready graphic that shows why continuous recording is not yet a navigation dataset.

**Architecture:** Build the visual as a deterministic SVG so every word and position is editable, render it to the approved 1600 × 800 PNG with `rsvg-convert`, and embed only the PNG in the article. Keep both source and output in `70-attachments/`, inspect the PNG at full and half size, then run the article's narrow context and Quartz checks before publishing the coherent checkpoint.

**Tech Stack:** SVG, `rsvg-convert`, `sips`, Markdown, Quartz, Git

---

## Task 1: Create the editable graphic

**Files:**

- Create: `70-attachments/recording-to-navigation-record.svg`
- Reference: `90-meta/day-0-recording-to-dataset-graphic-design.md`

- [x] **Step 1: Draw the 1600 × 800 canvas**

Use an off-white background and a restrained left-to-right layout with three rounded stages:

1. neutral `CONTINUOUS EVIDENCE`
2. muted-rust `MISSING CONVERSION`
3. muted-green `NAVIGATION RECORD`

- [x] **Step 2: Add the approved content**

Use the title `Recording is not the dataset`.

Summarize the stages as:

- evidence: screens, clicks and keys, apps and windows, browser events, two monitors
- conversion: find the move, recover prior state, join the evidence, name the destination
- record: what was on my screens before the move → exact place I went next

Use large plain sans-serif type and no logos, gradients, illustrations, or em dashes.

- [x] **Step 3: Check the SVG source**

Run:

```bash
rg -n "Recording is not the dataset|CONTINUOUS EVIDENCE|MISSING CONVERSION|NAVIGATION RECORD|two monitors|exact place I went next" 70-attachments/recording-to-navigation-record.svg
rg -n "—" 70-attachments/recording-to-navigation-record.svg
```

Expected: every required phrase appears and the em-dash search returns no matches.

## Task 2: Render and inspect the PNG

**Files:**

- Create: `70-attachments/recording-to-navigation-record.png`
- Modify if needed: `70-attachments/recording-to-navigation-record.svg`

- [x] **Step 1: Render the approved dimensions**

Run:

```bash
rsvg-convert -w 1600 -h 800 \
  -o 70-attachments/recording-to-navigation-record.png \
  70-attachments/recording-to-navigation-record.svg
sips -g pixelWidth -g pixelHeight 70-attachments/recording-to-navigation-record.png
```

Expected: `pixelWidth: 1600` and `pixelHeight: 800`.

- [x] **Step 2: Inspect at full size**

Open `70-attachments/recording-to-navigation-record.png` with the local image viewer. Check every rendered word, alignment, contrast, spacing, and arrow.

- [x] **Step 3: Inspect at half size**

Create a temporary 800-pixel-wide preview outside the vault, inspect it, then remove it. Confirm that stage names and the record definition remain readable.

- [x] **Step 4: Revise and rerender if necessary**

Edit only the SVG source, rerender the PNG, and repeat the two visual inspections until the result matches the approved design.

## Task 3: Place the graphic in the article

**Files:**

- Modify: `20-syntheses/day-0-took-three-days.md`

- [x] **Step 1: Insert the image after the five conversion steps**

Add:

```markdown
![Continuous screen and input evidence must pass through a conversion layer that identifies navigation moments, recovers prior screen state, joins both monitors, and names the destination before it becomes a chronological navigation record.](../70-attachments/recording-to-navigation-record.png)
```

Place it immediately after step 5 and before the Screenpipe evidence paragraph.

- [x] **Step 2: Record the revision**

Add a dated line to the article's hidden revision log describing the explanatory graphic. Do not change the article's prose or thesis.

- [x] **Step 3: Run the local context and global checks**

Run:

```bash
rg -n -A18 -B6 "recording-to-navigation-record|Recording captured evidence" 20-syntheses/day-0-took-three-days.md
rg -n "recording-to-navigation-record" 20-syntheses/day-0-took-three-days.md 90-meta/day-0-recording-to-dataset-graphic-design.md
git diff --check
git diff -- 20-syntheses/day-0-took-three-days.md 70-attachments/recording-to-navigation-record.svg
```

Read the article from beginning to end once. Confirm that the visual clarifies the central distinction without making adjacent prose redundant.

## Task 4: Verify Quartz and publish the checkpoint

**Files:**

- Verify: `20-syntheses/day-0-took-three-days.md`
- Verify: `70-attachments/recording-to-navigation-record.png`
- Verify: `70-attachments/recording-to-navigation-record.svg`
- Preserve untouched: `.obsidian/community-plugins.json`

- [x] **Step 1: Build Quartz**

Run:

```bash
npm run build
```

Expected: build exits successfully and Quartz copies the attachment.

- [x] **Step 2: Verify the rendered asset path**

Run a narrow search in `public/` for `recording-to-navigation-record.png` and confirm the generated article references it.

- [x] **Step 3: Verify the intended Git scope**

Run:

```bash
git status --short
git diff --check
```

Expected: only the article, the two graphic files, the two graphic planning notes, generated `latest/` output if refreshed by the harness, and the pre-existing `.obsidian/community-plugins.json` drift are present. The `.obsidian` file must remain unstaged.

- [ ] **Step 4: Publish the coherent article checkpoint**

Run:

```bash
npm run publish -- "article: add recording to dataset graphic"
```

Expected: the relevant files are committed and pushed to `main`; `.obsidian/community-plugins.json` remains local and uncommitted.

- [ ] **Step 5: Confirm remote state**

Run:

```bash
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

Expected: `HEAD` equals `origin/main`, with only the unrelated `.obsidian/community-plugins.json` drift remaining.
