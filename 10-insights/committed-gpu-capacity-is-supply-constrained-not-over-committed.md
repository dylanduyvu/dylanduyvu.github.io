---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-07-01
confidence: high
domains: [gpu-finance, ai-infrastructure, compute-contracts]
projects: [gpu-compute-novation]
sources: [usd-ai-call-harry-page-2026-06-29, american-compute-bernie-ceo-call-2026-06-16, novation-shelving-decision-2026-06-30, meta-compute-hyperscalers-selling-excess-compute-2026-07-01]
people: [harry-page, bernie-margulies]
orgs: [usd-ai, nebius, american-compute, meta]
aliases: [gpu customers are not offloading committed capacity, long-term gpu offtake is supply constrained, current-market novation is falsified, hyperscaler excess compute is a tripwire]
tags: [gpu, customer-discovery, novation, supply]
---

# Committed GPU capacity is supply-constrained, not over-committed

## Claim

In the lender/neocloud customer slice Dylan tested, long-term GPU offtake appears supply-constrained rather than over-committed. USD.AI and Dylan's Nebius evidence both point to customers needing capacity rather than offloading term commitments.

This should not be overgeneralized into "nobody has excess compute." Hyperscalers may still externalize excess or older-generation fleet capacity. That is a supply-loosening tripwire, but it is not the same as startup/customer contract novation.

## Why It Matters

This falsifies the current-market version of the contract novation hypothesis under its LBH0 kill criteria: exit demand exists. If the market problem is supply scarcity rather than over-commitment, a novation marketplace lacks urgent seller-side supply.

## Evidence

- 2026-06-29: When asked whether borrower customers want to offload capacity or are stuck with capacity they cannot use, USD.AI answered no and said customers mostly do not have enough capacity.
- 2026-06-29: USD.AI has seen on-demand marketplace routing, but not actual termed-out contracts swapping hands between parties.
- 2026-06-29: Harry explained that customers signing multi-year commitments with deposits are doing so because they need capacity for a long period.
- 2026-06-29: Longer-term GPU deals commonly include deposits around 16-25%, which can be several million dollars, giving customers a strong reason to hold onto reserved take-or-pay capacity.
- 2026-06-29: USD.AI named supply as a bottleneck: there are not enough GPUs for what people want, so customers wait or pay premiums to skip the line.
- 2026-06-30: Dylan's decision memo treats Nebius as independent neocloud-side corroboration that current-market customers are not trying to offload committed capacity.
- 2026-07-01: Reports that Meta is exploring a cloud business for excess AI compute are a counter-signal at the hyperscaler fleet level. The signal is real supply loosening, but not direct evidence of customers trying to novate committed offtake.

## Implications

- Shelve the current-market GPU compute novation project rather than keep searching for redundant disconfirmation.
- The immediate pain may be around access, financing, underwriting, or performance verification rather than exit liquidity.
- Revisit only if a tripwire fires: supply loosens, next-gen GPUs create a glut, GPU prices crash, deposits weaken, or direct buyer/operator sources name committed capacity they want to offload.
- Track hyperscaler excess-capacity offerings separately from customer/offtaker novation. They can pressure the same market without proving the same seller-side workflow exists.

## Counterpoints / Uncertainty

- USD.AI sees a lender-filtered slice of the market, not necessarily every buyer or contract type.
- The claim is market-conditional. It may change if GPU supply loosens, deposits fall, AI demand cools, or customers overbuy during a hype cycle.
- Smaller customers, distressed startups, or non-core GPU buyers may behave differently from USD.AI's borrowers and offtakers.
- 2026-06-16 counterpoint: Bernie from American Compute guessed that some startups may have bought three-year offtake to satisfy lenders or investor narratives and may not actually use all the compute. This is useful, but weaker than observed offloading evidence because he did not cite a named transfer, failed transfer, or specific customer.
- 2026-07-01 counterpoint / nuance: Meta's reported cloud push suggests hyperscalers may sell excess or N-1 compute even while financed neocloud borrowers and their customers remain capacity-short.
- The raw Nebius source still needs to be captured if available; current Nebius evidence is represented through Dylan's 2026-06-30 decision memo.

## Links

- Sources: [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]], [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]], [[novation-shelving-decision-2026-06-30|Novation shelving decision memo]], [[meta-compute-hyperscalers-selling-excess-compute-2026-07-01|Meta Compute: hyperscalers moving to sell excess AI compute]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[harry-page|Harry Page]], [[bernie-margulies|Bernie Margulies]]
- Orgs: [[usd-ai|USD.AI]], [[nebius|Nebius]], [[american-compute|American Compute]]

## Updates

### 2026-06-29

Initial capture from USD.AI call transcript.

### 2026-06-29

Added American Compute counterpoint and linked the locked-compute hunch. Status remains distilled because Bernie's version was framed as a guess, while USD.AI's signal was direct observed market behavior.

### 2026-06-30

Updated from the novation shelving decision memo. Confidence increased because Nebius independently corroborates the USD.AI no-offloading signal from the neocloud side. Current-market novation is now treated as shelved with a tripwire, not as an active thesis needing more generic invalidation calls.

### 2026-07-01

Added hyperscaler nuance from Meta's reported excess-compute cloud push. Confidence moved from very-high to high because the original no-offloading claim remains strong for the tested lender/neocloud customer slice, but should not be generalized to hyperscaler fleet management.
