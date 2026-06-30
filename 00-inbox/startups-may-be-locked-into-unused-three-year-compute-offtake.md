---
type: insight
status: weakened
created: 2026-06-29
updated: 2026-06-30
confidence: very-low
domains: [gpu-finance, compute-contracts, ai-infrastructure]
projects: [gpu-compute-novation]
sources: [american-compute-bernie-ceo-call-2026-06-16, novation-shelving-decision-2026-06-30]
people: [bernie-margulies]
orgs: [american-compute, usd-ai, nebius]
aliases: [startups may overbuy three year compute contracts, locked compute offtake resale hunch]
tags: [gpu, novation, hunch, customer-discovery]
possible_duplicates: [committed-gpu-capacity-is-supply-constrained-not-over-committed]
---

# Startups may be locked into unused three-year compute offtake

## Claim

Some startups may be locked into three-year compute offtake contracts they will not fully use, creating a possible opportunity to resell, break up, or reallocate committed compute.

## Why It Matters

This is a direct counter-signal to the current stronger conclusion that committed GPU capacity is supply-constrained rather than over-committed. Bernie volunteered it as a possible problem worth exploring, but framed it as a guess rather than observed deal evidence.

As of 2026-06-30, this hunch is weakened enough that it should not drive more generic novation discovery. It remains useful only as a tripwire: revive it if a direct buyer/operator names unused committed capacity or if the GPU market flips from supply-constrained to over-supplied.

## Evidence

- 2026-06-16: Bernie said lenders require three-year offtake contracts to finance equipment, so startups may buy three-year commitments.
- 2026-06-16: He guessed some startups overestimated compute needs to tell an AI story to investors and may not actually use all the compute.
- 2026-06-16: He said freeing up locked compute through resale, breaking up, or reallocation could be interesting.
- 2026-06-16: He framed the problem as contractual/SLA/operations-heavy rather than purely technical.

## Implications

- Keep this as a hunch until direct buyer/operator evidence confirms unused committed capacity.
- If tested, ask for concrete examples of a startup with unused committed compute, the contract rights, the provider consent path, and what blocks transfer today.
- This could be adjacent to SLA/uptime verification because operational trust matters if compute is split or resold.

## Counterpoints / Uncertainty

- USD.AI later said it has not seen customers trying to offload committed capacity and that the market is supply-constrained.
- Dylan has Nebius evidence that also weakens the current-market over-commitment premise.
- Bernie did not cite a named customer, transaction, or failed resale attempt; he presented this as a bet.
- 2026-06-30 decision update: the novation track is now shelved with a tripwire because USD.AI and Nebius jointly killed current-market LBH0.

## Links

- Sources: [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]], [[novation-shelving-decision-2026-06-30|Novation shelving decision memo]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[bernie-margulies|Bernie Margulies]]
- Orgs: [[american-compute|American Compute]]
- Possible duplicate / contradiction: [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]

## Updates

### 2026-06-29

Initial hunch capture from American Compute call transcript.

### 2026-06-30

Marked weakened after the novation shelving decision memo. Preserve as a market-conditional tripwire rather than an active discovery path.
