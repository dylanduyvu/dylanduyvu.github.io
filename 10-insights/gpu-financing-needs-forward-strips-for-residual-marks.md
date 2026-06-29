---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-06-29
confidence: high
domains: [gpu-finance, compute-derivatives, residual-value, asset-backed-lending]
projects: [gpu-compute-derivatives, gpu-residual-value-pricing]
sources: [perps-dont-work-for-compute-derivatives-2026-06-12]
people: [dave-friedman]
orgs: []
aliases: [futures strips feed gpu loan collateral marks, dated compute curves support residual value underwriting]
tags: [gpu, derivatives, lending, residual-value]
---

# GPU financing needs forward strips for residual marks

## Claim

GPU financing needs dated forward/futures strips because loan underwriting, amortization, and residual-value schedules require dated collateral marks. A perp funding rate gives lenders no underwritable residual curve.

## Why It Matters

This connects compute derivatives directly to the residual-value pricing thesis. A dated compute curve could become an input into GPU collateral valuation, RVI pricing, loan amortization, and lessor terminal-value assumptions. A perp cannot do that job.

## Evidence

- 2026-06-12: Friedman argues that a futures strip gives lenders dated collateral marks.
- 2026-06-12: He says lenders can value collateral against the curve and shape amortization to a declining residual schedule.
- 2026-06-12: He says the residual-value curve for a four-year GPU loan can be built from the strip, while a single forward price is insufficient.
- 2026-06-12: He argues that a perp's funding rate is about current positioning, not 2027 residual value, so GPU loan structures cannot ingest it.

## Implications

- A compute derivative market could be most valuable as underwriting infrastructure, not just a speculative venue.
- RVI, warranty, and residual-value products should watch for dated compute-curve formation.
- A useful MVP might be a surveyed forward strip or indicative curve before a fully liquid exchange product exists.
- Lessors may care even more than lenders because residual value enters their return profile.

## Counterpoints / Uncertainty

- Lenders may still rely mostly on offtake and borrower credit until the curve is trusted.
- A thin or manipulable curve could be worse than no curve if it creates false precision.
- Settlement index quality and standardization are prerequisites.

## Links

- Sources: [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]]

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.
