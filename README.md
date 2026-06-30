# Dylan Notes

This is Dylan's local-first Obsidian vault, Git-backed insight store, and public Quartz notes site.

The vault is **insight-driven**. Raw notes, transcripts, source captures, attachments, and scratch material are welcome, but they are secondary evidence. The primary durable object is an insight: a claim or learning that changes a belief, records a reusable pattern, preserves a decision, or captures context likely to matter later.

## Structure

```text
00-inbox/       uncertain captures, hunches, possible duplicates
10-insights/    atomic durable claim notes
20-syntheses/   multi-claim summaries and stitched arguments
30-projects/    sparse hubs for active efforts
40-areas/       sparse hubs for long-running domains
50-sources/     raw source captures and source notes
60-people/      agent-maintained person hubs
65-orgs/        agent-maintained org hubs
70-attachments/ PDFs, screenshots, images, exports, binaries
90-meta/        templates, schemas, setup notes, instructions
```

## Operating Model

- Codex and Claude Desktop are the capture and curation harness.
- Obsidian is the reading and browsing UI.
- Local Git is the audit trail and chronology.
- GitHub is the public remote and GitHub Pages host.
- Quartz renders the public site at <https://dylanduyvu.github.io/>.
- Agents commit and push after every confident capture or update.
- Normal conversation can be captured when it creates a durable delta: a changed belief, claim, decision, reusable framing, open question, or next test.
- Use `npm run publish -- "<message>"` for the standard build/stage/commit/push path.

## Core Rules

- Search before create.
- Update overlapping notes instead of duplicating them.
- Use claim-style titles for insight notes.
- Preserve contradicted historical claims; mark them contested, weakened, or superseded.
- Store full raw context and attachments when practical.
- Maintain sparse project/domain/people/org hubs automatically.
- Do not create daily notes or a capture log in v0.
- Do not publish casual chatter or random `.obsidian/` settings drift.
- Remember that anything committed to this repo is public on GitHub, even if Quartz does not render it.
- Do not store raw credentials, private keys, access tokens, passwords, or seed phrases.
