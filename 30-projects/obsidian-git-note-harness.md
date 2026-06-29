---
type: project
status: active
created: 2026-06-29
updated: 2026-06-29
aliases:
  - Obsidian Git Note Harness
domains:
  - personal-knowledge-management
  - agent-memory
people: []
orgs: []
tags:
  - obsidian
  - git
  - agent-harness
---

# Obsidian Git Note Harness

## Current State

The v0 vault is local-first at `~/notes`, backed by local Git only. It is insight-driven, agent-maintained, and designed for full-fidelity private capture.

## Key Insights

- Insight notes should use claim titles, not topic labels.
- Rich sources should use hybrid capture: raw source/synthesis plus atomic promoted insight notes.
- Agents should search before create and update overlapping notes instead of duplicating.
- Git history is the capture log; no daily notes or separate capture ledger in v0.

## Sources

- [[obsidian-harness-setup-chat-2026-06-29|Obsidian harness setup chat 2026-06-29]]

## Open Questions

- When should agent memory start mirroring durable insights into this vault?
- When does repo size justify Git LFS or encrypted external storage?

## Next Tests

- Capture the first real source and promote 2-3 atomic insight notes.
- Test whether sparse hub maintenance stays useful without becoming noisy.
