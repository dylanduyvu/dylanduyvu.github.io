# Homepage Contact Section Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Dylan's personal and Precursor Labs contact links to the bottom of the public notes homepage.

**Architecture:** Make one Markdown-only content change in `index.md`. Append a compact `Contact` section with two grouped rows and rely on the existing Quartz Markdown renderer; no components, CSS, or JavaScript change.

**Tech Stack:** Markdown, Quartz, Git

---

## Chunk 1: Homepage content and publication

### Task 1: Add the Contact section

**Files:**
- Modify: `index.md`
- Reference: `docs/superpowers/specs/2026-07-22-homepage-contact-section-design.md`

- [ ] **Step 1: Append the approved Contact section after Notes**

Add exactly this Markdown after the current final sentence in `index.md`:

```md

## Contact

- **Dylan:** [Email](mailto:dylanduyvu@gmail.com) · [Substack](https://substack.com/@dylanvu) · [X @dylanduyvu](https://x.com/dylanduyvu) · [X @bicep_pump](https://x.com/bicep_pump) · [Telegram](https://t.me/dylanduyvu)
- **Precursor Labs:** [Website](https://precursorlabs.org/) · [Substack](https://precursorlabs.substack.com/) · [X @precursorlabs](https://x.com/precursorlabs)
```

- [ ] **Step 2: Verify the Markdown and exact scope**

Run:

```bash
git diff --check
test "$(git diff --name-only)" = "index.md"
git diff -- index.md
```

Expected:

- `git diff --check` exits successfully with no output.
- The changed-file check exits successfully and confirms `index.md` is the only modified file.
- The `index.md` diff only appends `## Contact` after `## Notes`.
- The section contains exactly two grouped list rows.
- No existing homepage line changes.

- [ ] **Step 3: Verify every supplied destination appears exactly once**

Run:

```bash
for target in \
  'mailto:dylanduyvu@gmail.com' \
  'https://substack.com/@dylanvu' \
  'https://x.com/dylanduyvu' \
  'https://x.com/bicep_pump' \
  'https://x.com/precursorlabs' \
  'https://precursorlabs.org/' \
  'https://precursorlabs.substack.com/' \
  'https://t.me/dylanduyvu'; do
  test "$(rg -oF -- "$target" index.md | wc -l | tr -d ' ')" -eq 1 || exit 1
done
```

Expected: exit status `0` with no output.

- [ ] **Step 4: Commit the homepage content change**

Run:

```bash
test "$(git branch --show-current)" = "main"
git add -- index.md
test "$(git diff --cached --name-only)" = "index.md"
git commit -m "site: add homepage contact links"
```

Expected: both scope checks exit successfully, and one commit changes only `index.md` on `main`.

### Task 2: Publish and verify the Git state

**Files:**
- No additional file changes

- [ ] **Step 1: Push the approved commits**

Run:

```bash
git push origin main
```

Expected: the local `main` branch pushes successfully to `origin/main`.

- [ ] **Step 2: Verify the published commit and clean worktree**

Run:

```bash
git fetch origin main
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
```

Expected:

- Status is `## main...origin/main` with no changed files.
- `HEAD` and `origin/main` resolve to the same commit.
- GitHub Pages rebuilds asynchronously; do not wait for deployment because this is content-only.
