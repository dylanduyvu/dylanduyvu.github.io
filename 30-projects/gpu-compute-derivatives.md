---
type: project
status: active
created: 2026-06-29
updated: 2026-06-29
domains: [gpu-finance, compute-derivatives, compute-commodities, ai-infrastructure]
people: [dave-friedman, brannin-mcbee]
orgs: [coreweave]
tags: [gpu, derivatives, futures, market-structure]
---

# GPU Compute Derivatives

## Current State

The first serious compute derivative should likely be dated, not perpetual. Compute is perishable productive capacity with an obsolescence curve, so the useful market object is a forward/futures strip that exposes dated capacity, decay, and residual-value assumptions.

This derivative layer matters because it could feed the rest of GPU finance: lender collateral marks, loan amortization, RVI pricing, lessor terminal-value assumptions, and hedges for operators or buyers.

The commoditization question now looks less like "are all GPU-hours identical?" and more like "can the market define a reference grade, settlement hub, and priced basis for operator/topology/SLA differences?" Fungibility is not binary; the first useful product may be a cash-settled reference exposure with messy but explicit basis spreads.

## Key Insights

- [[compute-derivatives-need-dated-term-structures-not-perps|Compute derivatives need dated term structures, not perps]]: Perps collapse the curve into current funding and cannot isolate maturity-specific exposure.
- [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]]: GPU-hours perish inside the horizon and decay across silicon generations.
- [[compute-derivatives-should-look-like-freight-and-power-not-crypto|Compute derivatives should look like freight and power, not crypto]]: Freight/power analogies preserve dated capacity information.
- [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]: Dated curves can feed collateral marks and amortization schedules.
- [[compute-perps-need-a-spot-index-anchor-compute-does-not-have|Compute perps need a spot-index anchor compute does not have]]: Compute spot is fragmented and constructed, making perp funding gameable.
- [[compute-can-commoditize-without-full-fungibility|Compute can commoditize without full fungibility]]: Commodity design needs reference plus basis, not sameness.
- [[compute-commoditization-needs-convergence-plumbing-more-than-homogeneity|Compute commoditization needs convergence plumbing more than homogeneity]]: The missing piece is settlement/measurement plumbing.
- [[dgx-reference-spec-is-a-compute-grade-not-a-market-hub|DGX reference spec is a compute grade, not a market hub]]: DGX can define grade, but index and settlement define the hub.
- [[compute-basis-will-price-operator-topology-duration-and-sla-differences|Compute basis will price operator, topology, duration, and SLA differences]]: The non-fungible details become spreads.
- [[non-commodity-compute-framing-supports-neocloud-valuation-premiums|Non-commodity compute framing supports neocloud valuation premiums]]: Market-structure framing affects depreciation and multiples.

## Sources

- [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- [[can-compute-commoditize-if-its-not-fungible-2026-06-11|Can Compute Commoditize if it's Not Fungible?]]

## Open Questions

- What index can settle dated compute contracts credibly?
- Which compute product is standardized enough for the first curve: H100, H200, B200, GB200, or workload-adjusted inference/training capacity?
- Who are the natural first hedgers: lenders, lessors, operators, insurers, neocloud customers, or funds?
- Can liquidity be bootstrapped without a perp?
- What settlement window best resists manipulation while remaining useful for hedgers?
- Which compute attributes become standardized grade versus traded basis?
- Can SLA/goodput/MFU be measured well enough for basis settlement?

## Next Tests

- Compare freight FFA and power forward market design to possible compute products.
- Ask GPU lenders/lessors whether a dated strip would change residual marks, amortization, or loan terms.
- Identify existing compute spot/rental indices and evaluate whether any are robust enough for settlement.
- Map natural buyers/sellers of dated compute risk.
- Build a simple reference-grade versus basis-spread map for H100/H200/B200 capacity.
- Ask lenders and operators which compute-basis attribute they would actually pay to hedge or verify first.
