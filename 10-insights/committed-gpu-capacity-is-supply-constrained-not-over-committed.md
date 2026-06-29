---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-06-29
confidence: high
domains: [gpu-finance, ai-infrastructure, compute-contracts]
projects: [gpu-compute-novation]
sources: [usd-ai-call-harry-page-2026-06-29, american-compute-bernie-ceo-call-2026-06-16]
people: [harry-page, bernie-margulies]
orgs: [usd-ai, american-compute]
aliases: [gpu customers are not offloading committed capacity, long-term gpu offtake is supply constrained]
tags: [gpu, customer-discovery, novation, supply]
---

# Committed GPU capacity is supply-constrained, not over-committed

## Claim

In USD.AI's current market view, long-term GPU offtake customers are not generally stuck with excess committed capacity. They need the capacity, have paid meaningful deposits, and face future supply uncertainty, so they are not trying to offload termed-out contracts.

## Why It Matters

This weakens the core contract novation hypothesis that there is a latent pool of over-committed GPU customers who need secondary liquidity. If the market problem is supply scarcity rather than over-commitment, a novation marketplace may lack urgent seller-side supply in the current market.

## Evidence

- 2026-06-29: When asked whether borrower customers want to offload capacity or are stuck with capacity they cannot use, USD.AI answered no and said customers mostly do not have enough capacity.
- 2026-06-29: USD.AI has seen on-demand marketplace routing, but not actual termed-out contracts swapping hands between parties.
- 2026-06-29: Harry explained that customers signing multi-year commitments with deposits are doing so because they need capacity for a long period.
- 2026-06-29: Longer-term GPU deals commonly include deposits around 16-25%, which can be several million dollars, giving customers a strong reason to hold onto reserved take-or-pay capacity.
- 2026-06-29: USD.AI named supply as a bottleneck: there are not enough GPUs for what people want, so customers wait or pay premiums to skip the line.

## Implications

- Do not assume seller-side liquidity exists for a GPU contract novation product without fresh evidence from buyers, operators, and lenders.
- The immediate pain may be around access, financing, underwriting, or performance verification rather than exit liquidity.
- If novation remains worth testing, look for edge cases: failed startups, strategy pivots, underused reserved clusters, distressed borrowers, or contracts with weak deposits.

## Counterpoints / Uncertainty

- USD.AI sees a lender-filtered slice of the market, not necessarily every buyer or contract type.
- The claim may change if GPU supply loosens, deposits fall, AI demand cools, or customers overbuy during a hype cycle.
- Smaller customers, distressed startups, or non-core GPU buyers may behave differently from USD.AI's borrowers and offtakers.
- 2026-06-16 counterpoint: Bernie from American Compute guessed that some startups may have bought three-year offtake to satisfy lenders or investor narratives and may not actually use all the compute. This is useful, but weaker than observed offloading evidence because he did not cite a named transfer, failed transfer, or specific customer.

## Links

- Sources: [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]], [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[harry-page|Harry Page]], [[bernie-margulies|Bernie Margulies]]
- Orgs: [[usd-ai|USD.AI]], [[american-compute|American Compute]]

## Updates

### 2026-06-29

Initial capture from USD.AI call transcript.

### 2026-06-29

Added American Compute counterpoint and linked the locked-compute hunch. Status remains distilled because Bernie's version was framed as a guess, while USD.AI's signal was direct observed market behavior.
