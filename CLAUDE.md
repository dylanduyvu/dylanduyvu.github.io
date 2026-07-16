# CLAUDE.md

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
- As of 2026-07-06: a separate agent handles regular commits/pushes as edits accumulate. Agents without shell access (e.g. Claude via Filesystem MCP) should NOT repeatedly remind Dylan to publish; assume captures reach the public site shortly after writing. This also means the vault is a multi-agent workspace: always re-read a file immediately before editing it, since another agent may have changed it.
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

## Writing Style For Dylan

- No em dashes anywhere.
- No acronyms. Spell every term out in plain words (write "loan-to-value" not "LTV", "master service agreement" not "MSA", "power purchase agreement" not "PPA"). If a source quote contains an acronym, gloss it in plain words immediately after. This applies to chat replies, vault notes, and drafted emails.
- No coined jargon or compressed abstractions. Do not invent shorthand phrases and then use them as if they are established terms. If a concept needs a name, first explain it in one plain sentence a smart outsider would understand, and prefer a concrete everyday analogy (a home inspector, a security camera, a meter) over an abstract label. When catching yourself writing a phrase like "checkpoint certification that accumulates" or "treat a feed as an actuator", stop and say the plain version instead: "someone independent checks the work at key moments and writes it down, and the write-ups add up to a track record" or "the lender actually does something automatic with the data, like holding back money".
- Say it simply first, add precision second. Plain sentence, then the technical detail if it earns its place.
- Conclusion first, in one line, before any reasoning (codified 2026-07-15 after Dylan flagged "I don't understand your answer" six times in three days). Short sentences. Name the thing instead of gesturing at it: no analogies, no metaphors, no sideways references to context Dylan may not be holding, unless he asks for them. If a reply would need a second read to parse, rewrite it before sending. When Dylan says "again, plain," restate the entire answer in plain form and add nothing. These rules bind chat replies to Dylan with the same force as drafted messages.
- Succinct, low-jargon, plain language throughout.

## Drafting Messages In Dylan's Voice

Codified 2026-07-13 after a live email thread where an assistant draft opened on three stacked abstractions and handed the counterpart the research vocabulary before the question. These rules sit on top of Writing Style For Dylan above and bind every agent drafting anything Dylan sends (email, telegram, slack, comments).

Before drafting, approving, or sending cold outreach, read `90-meta/outreach-drafting-harness.md`.

- Continue the other person's last message, not Dylan's thesis. Any setup sentence that restates what Dylan already believes gets deleted before sending.
- One idea per message, and the question is the message. Framing sentences are overhead.
- Never hand a counterpart the research vocabulary inside a question. Mirror their own words back (if they said "operational track record", ask about that, not about "verifiable history"), because an answer shaped by our words is worth little as evidence.
- Concrete beats abstract: named deals, named people, real numbers. A sentence that stacks two abstractions gets rewritten as one plain sentence or cut.
- Match the channel and the hour. A telegram reply or a late-evening email should read like one, not like an analyst settling in, a website review, or a questionnaire.
- Final check before anything ships: would the recipient suspect an assistant drafted it? Cut until the answer is no.
- Chat drafts are proposals. Dylan's edit is the style authority; when he shortens a draft, the shortened version becomes the example to match.
- Audit message architecture, not only words that sound machine-written. Reject the sequence of scraped fact, compressed credential block, and generic survey question.
- A personalized fact must directly create or change the question. If only names and company facts need to change across a list, the draft fails.
- Ask one question in the first touch and use at most one short credential clause. Earn the deeper question through the reply.
- For a new first-touch structure, default to a five-to-ten-recipient canary before the full batch unless Dylan explicitly chooses an immediate full send.
- Explain any objection before changing Dylan's proposed wording, and make the smallest possible fix.
- Gist over draft for any recipient who may test for AI (codified 2026-07-15 after an operator CEO ran a placeholder trap on a wave email and declared "checkmate"). For live threads, Dylan types the reply himself at thumb speed; agents contribute the gist, never finished sentences. Live-thread replies match the counterpart's register and length, not the writer's: no greetings mid-thread, one thought, never restate what the thread already knows, a stray typo is fine. A Claude draft that could be sent without Dylan rewriting it is a defect, not a goal. Templated bumps on an already-templated wave are prohibited; a row either earns an individual second touch or gets none.

## Verify Before Asserting

- Never state a person's name, title, firm, or affiliation from memory. Verify against the vault (60-people, 65-orgs, 50-sources) or the private outreach CSV first, and if it is in neither, say so instead of guessing. A wrong name asserted confidently is worse than a checked "I don't know."
- Confidence words are earned by a lookup, not by vividness of recall. Codified 2026-07-14 after an agent delivered a "solid answers" list built from session memory that omitted fresh findings and overrode the vault's own sharper boundary. Any claim delivered to Dylan as solid, established, confirmed, or high confidence must name the vault note it stands on, inline, and the agent must have read that note in the current session. If the note has not been re-read, either check it first or label the claim "from memory, unverified." No citation, no confidence language. This applies to chat takes, strategy answers, and status summaries, not just published material; Dylan makes allocation decisions off chat answers.
- The same rule applies to operational state: send counts, bounce counts, reply tallies, and draft states come from a fresh scan of the actual system (Gmail, the packet file), never from memory of an earlier scan. Method note from 2026-07-14: mailer-daemon searches cannot detect failed deliveries in this mailbox; delivery failures are found only by full thread scans.
- Do not convert absence of evidence into a claim of absence. "I found no sign of X" and "X does not exist" are different sentences; write the first one. When a sentence rests on not having seen something (no clients shown, no competitors found, nobody has done Y), flag it as an inference at the moment of writing.
- Auto-generated transcripts, marketing pages, and secondary summaries are capture-grade, not assertion-grade. Names, dates, titles, and quotes taken from them get verified against a primary before they are asserted in chat, published, or sent in an email.
- These rules bind every agent working in this vault, in chat replies as much as in notes.

## Privacy

The current GitHub repo is public. Anything committed and pushed is public on GitHub, even if Quartz does not render it on the site. Before committing sensitive personal/professional material, either ask Dylan, keep it out of this public repo, or create a separate private workflow. Still do not store raw credentials, private keys, access tokens, passwords, or seed phrases unless Dylan explicitly designs a secrets workflow.

## Prohibited Without Approval

- Broad reorganization.
- Deleting notes or attachments.
- Rewriting historical claims to hide old beliefs.
- Changing publishing scope, visibility, or remote configuration.
- Storing secrets.
- Creating daily notes or a separate capture log.
