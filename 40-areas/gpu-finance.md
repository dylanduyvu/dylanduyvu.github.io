---
type: area
status: active
created: 2026-06-29
updated: 2026-06-29
domains: [gpu-finance, ai-infrastructure, compute-contracts, compute-derivatives]
projects: [gpu-compute-novation, gpu-residual-value-pricing, gpu-compute-derivatives]
people: [harry-page, thomas-galbraith, bernie-margulies, dave-friedman]
orgs: [usd-ai, barkr, american-compute]
tags: [gpu, lending, infrastructure]
---

# GPU Finance

## Current Understanding

GPU finance is anchored around recoverable hardware collateral, with offtake contracts and customer credit supporting debt service. In the current USD.AI view, supply scarcity dominates: customers with long-term commitments generally want the capacity and are not trying to offload it.

The most interesting live pain from the 2026-06-29 USD.AI call is not contract novation, but lender-grade verification of operator uptime and SLA performance.

The residual-value pricing path is still alive, but should be framed around lender recovery floors and guaranteed valuations rather than a generic public GPU price index. Barkr's 2026-06-18 call suggests GPU clients pay for guarantee-backed marks and institutional trust, not just standalone data.

American Compute adds that RVI demand may be suppressed by operator residual overconfidence and by customers using quotes as free gut checks. Residual products may sell better to lessors or after a correction than to lenders in the current scarcity market.

The compute-derivatives path points toward dated futures/forward strips rather than perps. That matters because a dated curve could feed residual marks, amortization schedules, and hedges for GPU financing.

## Useful Patterns

- Hardware recovery matters more than bare contract cash flows.
- Long-term GPU offtake can include large deposits, making reserved take-or-pay capacity valuable to keep.
- Supply bottlenecks reduce near-term seller-side liquidity for novation.
- Risk transfer products can wrap GPU residual value through warranties and reinsurance.
- Lenders may price defensively when they cannot verify operator performance against SLAs.
- GPU collateral marks become more commercially useful when expressed as recoverable floor value.
- Banks may prefer guarantee or swap-like structures over insurance if they distrust insurance claim mechanics.
- Private/public pricing data is necessary but may not be sufficient without diligence and a credible risk-transfer counterparty.
- GPU pricing opacity is partly structural because OEMs, VARs, and suppliers benefit from bespoke margins.
- Lenders and lessors use residual values differently: recovery protection vs return enhancement.
- Reinsurer or warranty backer credibility can matter more than advertised data-point counts.
- Compute derivatives need tenor because compute value changes by delivery date and silicon generation.
- Perps may concentrate speculative liquidity but do not produce the dated curve GPU finance needs.

## Active Projects

- [[gpu-compute-novation|GPU Compute Novation]]
- [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- [[gpu-compute-derivatives|GPU Compute Derivatives]]

## Useful Source Lists

- [[gpu-financing-blogs-relevance-list-2026-06-29|GPU financing blogs relevance list]]: 32-source CSV corpus for GPU financing, residual value, neocloud debt, compute economics, and data center infrastructure research.

## Best Insights

- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]
- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]
- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]
- [[banks-may-prefer-guarantees-or-swaps-over-insurance-for-gpu-collateral-risk|Banks may prefer guarantees or swaps over insurance for GPU collateral risk]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]
- [[gpu-pricing-opacity-is-structural-not-just-immature|GPU pricing opacity is structural, not just immature]]
- [[gpu-residual-risk-matters-more-to-lessors-than-lenders|GPU residual risk matters more to lessors than lenders]]
- [[gpu-rvi-demand-may-need-a-residual-correction|GPU RVI demand may need a residual correction]]
- [[gpu-financing-lender-types-fragment-by-credit-tolerance|GPU financing lender types fragment by credit tolerance]]
- [[compute-derivatives-need-dated-term-structures-not-perps|Compute derivatives need dated term structures, not perps]]
- [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]]
- [[compute-derivatives-should-look-like-freight-and-power-not-crypto|Compute derivatives should look like freight and power, not crypto]]
- [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]
- [[compute-perps-need-a-spot-index-anchor-compute-does-not-have|Compute perps need a spot-index anchor compute does not have]]

## Open Questions

- How broad is the supply-constrained/no-offloading pattern across the GPU market?
- Which parties can provide lender-trusted SLA evidence?
- How does GPU residual-value insurance interact with performance risk and offtake credit risk?
- What happens to this market if GPU supply loosens or AI demand becomes less frantic?
- What guarantee fee, exclusion structure, or lender term change proves residual-value protection has budget?
- Which GPU finance segment has the sharpest residual-value WTP: lessors, equipment finance, banks, private credit, insurers, or crypto lenders?
- What compute index is robust enough for dated derivative settlement?
