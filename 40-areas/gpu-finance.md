---
type: area
status: active
created: 2026-06-29
updated: 2026-06-29
domains: [gpu-finance, ai-infrastructure, compute-contracts]
projects: [gpu-compute-novation]
people: [harry-page, thomas-galbraith]
orgs: [usd-ai, barkr]
tags: [gpu, lending, infrastructure]
---

# GPU Finance

## Current Understanding

GPU finance is anchored around recoverable hardware collateral, with offtake contracts and customer credit supporting debt service. In the current USD.AI view, supply scarcity dominates: customers with long-term commitments generally want the capacity and are not trying to offload it.

The most interesting live pain from the 2026-06-29 USD.AI call is not contract novation, but lender-grade verification of operator uptime and SLA performance.

The residual-value pricing path is still alive, but should be framed around lender recovery floors and guaranteed valuations rather than a generic public GPU price index. Barkr's 2026-06-18 call suggests GPU clients pay for guarantee-backed marks and institutional trust, not just standalone data.

## Useful Patterns

- Hardware recovery matters more than bare contract cash flows.
- Long-term GPU offtake can include large deposits, making reserved take-or-pay capacity valuable to keep.
- Supply bottlenecks reduce near-term seller-side liquidity for novation.
- Risk transfer products can wrap GPU residual value through warranties and reinsurance.
- Lenders may price defensively when they cannot verify operator performance against SLAs.
- GPU collateral marks become more commercially useful when expressed as recoverable floor value.
- Banks may prefer guarantee or swap-like structures over insurance if they distrust insurance claim mechanics.
- Private/public pricing data is necessary but may not be sufficient without diligence and a credible risk-transfer counterparty.

## Active Projects

- [[gpu-compute-novation|GPU Compute Novation]]
- [[gpu-residual-value-pricing|GPU Residual Value Pricing]]

## Best Insights

- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]
- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]
- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]
- [[banks-may-prefer-guarantees-or-swaps-over-insurance-for-gpu-collateral-risk|Banks may prefer guarantees or swaps over insurance for GPU collateral risk]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]

## Open Questions

- How broad is the supply-constrained/no-offloading pattern across the GPU market?
- Which parties can provide lender-trusted SLA evidence?
- How does GPU residual-value insurance interact with performance risk and offtake credit risk?
- What happens to this market if GPU supply loosens or AI demand becomes less frantic?
- What guarantee fee, exclusion structure, or lender term change proves residual-value protection has budget?
