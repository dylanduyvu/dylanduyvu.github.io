# AGENTS.md

This vault is Dylan's local-first, Git-backed, high-fidelity insight store at `~/notes`.

## Mission

Act as the capture and curation harness. Extract durable insights, preserve full evidence, maintain sparse retrieval hubs, and commit/push every confident capture or update so the public Quartz site stays current.

The vault is insight-driven. Raw notes, transcripts, stream-of-consciousness material, source captures, and attachments are allowed, but they are evidence and raw material. The main durable object is an insight: a claim or learning that changes a belief, records a pattern, names a heuristic, preserves a decision, or captures context likely to matter later.

## Conversation Capture

Not all valuable material arrives as an explicit "extract/store" request. During normal back-and-forth, listen for durable deltas:

- a changed belief or model update
- a claim worth retrieving later
- a project decision
- a reusable framing, heuristic, or pattern
- an open question, test, or research direction
- a non-obvious connection across projects, people, orgs, or sources

When a durable delta appears, capture the delta, not the transcript noise. If useful, create a `50-sources/` chat/source note for the conversation context, then promote the durable takeaways into insight notes and hubs. If Dylan says "capture that", "save the delta", "checkpoint this", or asks what should go into Obsidian, treat that as an explicit capture trigger.

Do not capture casual chatter, transient preferences, or half-formed material unless it is useful as an inbox hunch. If Dylan says "don't save this" or "don't publish this", do not commit/push it.

## Storage Rules

- Use `00-inbox/` for hunches, uncertain captures, possible duplicates, and material needing review.
- Use `10-insights/` for atomic durable claim notes.
- Use `20-syntheses/` for multi-claim summaries and stitched arguments.
- Use `30-projects/` for sparse active project hubs.
- Use `40-areas/` for sparse long-running domain hubs.
- Use `50-sources/` for raw source captures, transcripts, chats, emails, call notes, and research sessions.
- Use `60-people/` and `65-orgs/` only for agent-maintained sparse retrieval hubs.
- Use `70-attachments/` for PDFs, screenshots, images, exports, and binaries.
- Use `90-meta/` for templates, schemas, setup docs, and vault instructions.

## Search Before Create

Search before create.

Before creating a new insight note, search for overlapping claims, aliases, sources, projects, domains, people, orgs, and body text.

If new material reinforces, revises, weakens, or adds evidence to an existing insight, update the existing note instead of creating a duplicate. Create a new insight only when the claim is meaningfully distinct.

If overlap is uncertain, place the candidate in `00-inbox/` with `status: hunch` or `status: raw` and note the possible duplicate.

## Insight Notes

Use claim-style titles, not topic labels.

Good: `Bare compute contracts have no recovery value after default`

Avoid: `Compute Contract Recovery Risk`

Use medium evidence density. Every insight should usually include:

- `## Claim`
- `## Why It Matters`
- `## Evidence`
- `## Implications`
- `## Counterpoints / Uncertainty`
- `## Links`
- `## Updates`

## Belief History

Always preserve contradicted historical claims. Do not rename an old note to erase the original claim.

When a claim is contradicted:

- keep the original title
- set `status` to `contested`, `weakened`, or `superseded`
- add a dated `## Updates` entry
- explain what changed and why
- link to a replacement claim when useful
- commit the change explicitly

## Source Capture

Store full raw context when practical. For rich artifacts, use hybrid capture:

1. Store raw context in `50-sources/`.
2. Create one source or synthesis note.
3. Promote durable takeaways into atomic insight notes.
4. Link insights back to the source/synthesis.
5. Link the source/synthesis to promoted insights.

## Hubs

Auto-maintain sparse project and domain hubs. Update a hub only when new material changes current state, key insights, sources, open questions, or next tests. Hubs should stay curated and sparse, not exhaustive.

Auto-maintain people/org notes only when useful. Create or update them when a person/org appears repeatedly, is strategically important, or contributes a strong claim/source. These are retrieval hubs, not manual CRM.

## Links

Use Obsidian wiki links that resolve to the actual filename. Because most notes use slug filenames, prefer slug target plus readable alias:

```text
[[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]
```

Do not link only by the H1/title when the filename is slugified, or Obsidian may create a duplicate note.

## Git And Publishing

This vault is local-first, but it now has a public GitHub remote and Quartz/GitHub Pages frontend.

- Remote: `https://github.com/dylanduyvu/dylanduyvu.github.io.git`
- Public site: `https://dylanduyvu.github.io/`
- GitHub Actions rebuilds and deploys Quartz after every push to `main`.
- Do not use the Obsidian Git plugin in v0.
- Commit and push after every confident capture/update by default.
- Git history is the capture log.
- Use boring, explicit commit messages.
- Prefer `npm run publish -- "<message>"` for the final build/stage/commit/push loop.
- Do not stage random `.obsidian/` UI/plugin setting drift during publishing unless the setting change is intentional and relevant.

Examples:

```text
insight: add bare compute contracts no recovery claim
source: capture USD.AI interview raw notes
project: update gpu compute novation current state
insight: mark novation demand claim weakened
publish: update public notes harness
```

## Privacy

The current GitHub repo is public. Anything committed and pushed is public on GitHub, even if Quartz does not render it on the site. Before committing sensitive personal/professional material, either ask Dylan, keep it out of this public repo, or create a separate private workflow. Still do not store raw credentials, private keys, access tokens, passwords, or seed phrases unless Dylan explicitly designs a secrets workflow.

## Prohibited Without Approval

- Broad reorganization.
- Deleting notes or attachments.
- Rewriting historical claims to hide old beliefs.
- Changing publishing scope, visibility, or remote configuration.
- Storing secrets.
- Creating daily notes or a separate capture log.
