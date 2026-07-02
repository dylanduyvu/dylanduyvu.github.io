---
type: project
status: active
created: 2026-06-29
updated: 2026-07-01
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

## Maintenance Watch

- 2026-07-01 smell (flagged by Claude): the [[gpu-finance|GPU Finance]] area hub's Current Understanding section has accreted to roughly 15 paragraphs of chronological signals (USD.AI, SLA thread evolution, Meta Compute, Patel, Bernie's article). Area hubs are supposed to be sparse; this one is drifting toward being a journal. The accreted signals now cohere into one argument (contract-backed inversion + execution risk + correlated floor decay + missing bank-grade infrastructure), so the fix is to distill them into a proper 20-syntheses piece (working title: "State of GPU credit, July 2026") and cut the hub's Current Understanding back to a short summary that links to it. Same watch applies to the [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA insight note]], whose Why It Matters / Implications sections are absorbing update-by-update history rather than staying a distilled claim. Not urgent; do it when the SLA thread reaches a natural checkpoint (e.g. after Harry's reply).

## Next Tests

- Capture the first real source and promote 2-3 atomic insight notes.
- Test whether sparse hub maintenance stays useful without becoming noisy.
- Distill the GPU Finance area hub's accreted Current Understanding into a synthesis note, then re-sparsify the hub (see Maintenance Watch).
