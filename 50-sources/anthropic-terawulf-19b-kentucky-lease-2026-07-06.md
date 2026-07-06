---
type: source
status: captured
created: 2026-07-06
updated: 2026-07-06
source_date: 2026-07-06
source_type: article
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, ai-infrastructure, compute-contracts, datacenters]
people: []
orgs: [coreweave]
attachments: []
tags: [offtake, lease, anthropic, terawulf, ig-credit, brownfield-power]
---

# Anthropic x TeraWulf: 20-year, ~$19B Kentucky lease

## Context

On 2026-07-06, TeraWulf (Nasdaq: WULF, ex-bitcoin miner pivoted to AI infrastructure) announced a 20-year lease with Anthropic at its Justified Data campus in Hawesville, Kentucky. Logged same-day: it is the contract-as-engine machinery operating at top scale, days after the ununderwritten-half post published, and it feeds several vault threads at once.

Primary source: TeraWulf press release / 8-K (SEC): https://investors.terawulf.com/news-events/press-releases/detail/142/terawulf-announces-anthropic-lease-at-justified-data-campus-and-sale-of-majority-interest-in-abernathy-joint-venture-to-fluidstack

## The Facts (from TeraWulf's release + Reuters/DCD)

- 20-year lease, ~401MW of critical IT load, purpose-built AI campus, phased delivery: initial capacity H2 2027, full 401MW by early 2028.
- ~$19B of contracted revenue expected over the initial term (~$950M/yr simple average; actual rent depends on phased delivery and escalators).
- TeraWulf's own language: the lease "is expected to be supported by an investment-grade credit."
- Site: 750-acre former Century Aluminum smelter, bought Feb 2026 for $200M, chosen explicitly for the pre-existing bulk power transmission infrastructure the smelter left behind.
- Separately, TeraWulf sold its 50.1% of the Abernathy JV (168MW, Texas) to a Fluidstack-led group for ~$530M (vs ~$450M invested), recycling capital into wholly owned campuses. TeraWulf recently raised $3.2B in high-yield bonds for Lake Mariner.
- Market reaction: WULF up 10-17%.
- Context from DCD: Anthropic separately leases xAI's entire Colossus 1 (reported ~$1.25B/month) and space in Colossus II.

## Vault Reads

- Contract-as-engine at maximum scale: an IG-supported 20-year lease is bankable paper; expect it to anchor TeraWulf's next debt raises the way the Meta contract anchored CoreWeave's A3 facility. Feeds [[offtake-based-gpu-loans-systematically-centralize-capital|capital centralization]].
- The ununderwritten half, live: Anthropic committed 20 years against a campus with first power in H2 2027. Between signing and delivery, the live risk is TeraWulf's execution - the exact window the [[the-ununderwritten-half-of-gpu-credit|post]] argues nobody instruments. Watch Justified as a top-tier delivery-risk case.
- Term bifurcation: 20-year IG leases at the top vs 2-year conditional contracts in the mid-market - Friedman's tier scoping made vivid; the two tiers are effectively different asset classes.
- Brownfield-power pattern (promoted to inbox hunch): smelter site chosen to bypass the grid interconnection queue.
- Ex-miner pivot: TeraWulf joins the Crusoe/ex-crypto class of operators converting energy assets to AI infrastructure - the borrower class GPU lenders underwrite, now at IG-anchored scale.

## Open Questions

- What does "supported by an investment-grade credit" mean precisely: Anthropic's own rating, a guarantor, or credit enhancement? (Determines who the lender to TeraWulf is actually exposed to.)
- What are the lease's delivery-milestone and remedy terms - does a 20-year IG lease still have walk/renegotiate rights if H2 2027 slips? (Top-tier version of the walk-without-breach question.)
- Does the lease anchor a disclosed financing (bond, DDTL) that prints the contract-grading machinery publicly, like CoreWeave/Meta did?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Related Insights: [[offtake-based-gpu-loans-systematically-centralize-capital|Offtake-based GPU loans systematically centralize capital]], [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|GPU-backed debt is contract-backed with a hardware recovery floor]], [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]]
- Synthesis: [[the-ununderwritten-half-of-gpu-credit|The Ununderwritten Half of GPU Credit]]
