---
type: source
status: captured
created: 2026-06-29
updated: 2026-06-29
source_date: 2026-06-16
source_type: call_transcript
projects: [gpu-residual-value-pricing, gpu-compute-novation]
domains: [gpu-finance, residual-value, asset-backed-lending, compute-contracts]
people: [bernie-margulies]
orgs: [american-compute]
attachments: [american-compute-bernie-ceo-call-2026-06-16-transcript.txt]
tags: [gpu, lending, insurance, valuation, customer-discovery]
---

# American Compute CEO call with Bernie

## Context

Dylan spoke with Bernie Margulies, CEO of American Compute, on 2026-06-16 while exploring GPU residual value pricing, residual value insurance, and whether a neutral GPU pricing layer could unlock more financing liquidity.

## Raw Context

Full raw transcript: [american-compute-bernie-ceo-call-2026-06-16-transcript.txt](american-compute-bernie-ceo-call-2026-06-16-transcript.txt)

## Summary

Bernie framed American Compute as a residual value insurance provider for GPU servers. The product guarantees resale value through insurance/reinsurance; American Compute does underwriting and business development, then earns a cut of premium while reinsurers keep most of the risk.

The call strongly challenged a simple GPU Kelley Blue Book thesis. Bernie said GPU pricing opacity is structural because Nvidia, OEMs, and VARs all benefit from bespoke pricing and margin opacity. American Compute's own residual data comes mostly from iTAD transaction data, not public scrape datasets, but Bernie said customers often use him as a free pricing gut check rather than buying insurance or appraisals. Reinsurer backing supplies the social proof.

The call also clarified ICP differences. Lenders care about residual value mostly as worst-case recovery and focus 99% on offtake, while lessors actually depend on residual values to improve returns, sometimes to 20-30%. Bernie prefers leasing risk because enterprise lessors are smaller, more sophisticated, and lower default risk, but leasing is a smaller market.

Bernie expects many operators to be overconfident about GPU residuals, citing customers who expect 70% resale after three years on H100s. He thinks a residual correction would make RVI much easier to sell. He also volunteered two possible problem areas for Dylan: reselling/breaking up locked three-year compute offtake, and energy/interconnection bottlenecks.

## Promoted Insights

- [[gpu-pricing-opacity-is-structural-not-just-immature|GPU pricing opacity is structural, not just immature]]
- [[gpu-residual-risk-matters-more-to-lessors-than-lenders|GPU residual risk matters more to lessors than lenders]]
- [[gpu-rvi-demand-may-need-a-residual-correction|GPU RVI demand may need a residual correction]]
- [[gpu-financing-lender-types-fragment-by-credit-tolerance|GPU financing lender types fragment by credit tolerance]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]
- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- [[startups-may-be-locked-into-unused-three-year-compute-offtake|Startups may be locked into unused three-year compute offtake]]

## Open Questions

- Does American Compute have a named policy or quote where RVI changed a real lender's LTV, spread, approval, or coverage ratio?
- What premium percentage does American Compute charge for GPU RVI across tenor and collateral type?
- How often do customers who request quotes later return after residual marks correct?
- Is the better ICP lessors rather than lenders, given residuals enter lessor return profiles directly?
- Does Bernie's locked-compute hunch survive against USD.AI and Nebius evidence that customers are not offloading committed capacity?
- What exact contractual/SLA mechanics would be required to resell or split three-year offtake cleanly?
- Is energy/interconnection a tractable startup wedge, or just a giant infrastructure bottleneck?

## Links

- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]], [[gpu-compute-novation|GPU Compute Novation]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[bernie-margulies|Bernie Margulies]]
- Orgs: [[american-compute|American Compute]]
