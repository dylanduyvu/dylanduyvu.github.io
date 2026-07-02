---
type: source
status: captured
created: 2026-07-01
updated: 2026-07-01
source_date: 2026-07-01
source_type: article
projects: [gpu-residual-value-pricing, gpu-compute-novation]
domains: [gpu-finance, ai-infrastructure, neoclouds, asset-backed-lending, private-credit]
people: [bernie-margulies]
orgs: [american-compute, coreweave, nebius]
attachments: []
tags: [gpu, private-credit, offtake, timeline-risk, residual-value]
---

# American Compute: "Who Is Building Compute and Why Is It So Lucrative"

## Context

Blog article by Bernie Margulies / AC Research at American Compute, read by Dylan on 2026-07-01. Bernie is the vault's warmest source, so this is his written market model. Logged because it supplies the causal machine under the small-operator GPU financing market: why demand for small operators exists, why timelines are the binding risk, and why the asset class sits in private credit at all.

URL: https://www.amcompute.com/blog/who-is-building-compute

Supplier-side caveat: American Compute sells residual value insurance. The article is, in part, the prospectus for Bernie's own product (timeline risk is the demand engine for RVI), and the attractive return framing (2-3x MOIC-style pitch) gets selection-bias treatment. The mechanism claims are cited and informative regardless.

## Key Content

Demand side:
- Customers commit to smaller operators because hyperscalers (AWS/Azure) run 2-3x the price; a company will sign a 2-year contract with a smaller operator "as long as the operator can deliver it on time in the next few months."
- Customers sign LOIs with multiple operators and go with whoever delivers first. Revenue goes to the operator who shipped on time.

Capital stack:
- Mega private credit funds the top: CoreWeave raised $2.3B from Magnetar/Blackstone (Aug 2023) and $7.5B from Blackstone (May 2024); Apollo provided $3.5B for the xAI/Valor compute transaction (Jan 2026); Nscale announced a $1.4B loan from PIMCO, Blue Owl, and LuminArx (Feb 2026).
- Smaller operators are funded by boutique private credit and family offices "speculating in the space," at 12-15% yields vs 4-5% on IG corporates.
- Regulatory origin: Basel III / Dodd-Frank pushed banks out of this mid-market risk lending post-2008; private credit filled the gap ($2.1T+ market as of 2023); GPU-backed lending is one of the newer asset classes absorbing that capital.

Risk mechanics:
- Biggest risk is timeline. Offtake agreements have milestones and tranches; miss a milestone and the customer can end the contract.
- The delay stack: 26% of 110 data center projects slated for 2025 were delayed; smaller GPU procurement orders face 6-9 month lead times; GPU-backed loans take 3-6 months to close; 40-80 kW/rack colocation is scarce; ~10,300 energy projects were waiting to connect to the US grid at end-2024.
- Offtake falls apart two ways: customer defaults (credit), or the operator misses deployment milestones and the customer walks without breaching.
- If offtake dies and no replacement customer is found, lender recovery falls back on GPU secondary-market residual value, "which compresses every time NVIDIA ships a new architecture."

Other artifacts:
- Depreciation schedule spread across operators: CoreWeave ~6 years, Lambda ~5, Nebius ~4.
- Utilization breakeven reference around ~61%.

## Promoted Insights

- [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]]
- [[gpu-lending-grew-up-outside-banks-and-lacks-bank-grade-infrastructure|GPU lending grew up outside banks and lacks bank-grade infrastructure]]
- [[timeline-slips-hit-gpu-loan-engine-and-backstop-together|Timeline slips hit GPU loan engine and backstop together]]

## Open Questions

- If Meta Compute / hyperscaler resale compresses the 2-3x price gap, how much of small-operator demand survives?
- What fraction of small-operator offtake deaths are execution-side (walk without breach) vs credit-side (customer default)?
- Does the 12-15% boutique tier map cleanly onto USD.AI's Tier 3, and is the whole ladder market-wide structure?
- Who, if anyone, currently underwrites the delivery/milestone window (construction-loan-style draws, milestone insurance, delivery bonding)?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]], [[gpu-compute-novation|GPU Compute Novation]]
- People: [[bernie-margulies|Bernie Margulies]]
- Orgs: [[american-compute|American Compute]], [[coreweave|CoreWeave]], [[nebius|Nebius]]
