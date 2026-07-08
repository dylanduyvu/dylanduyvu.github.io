---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-07-07
confidence: high
domains: [gpu-finance, compute-derivatives, residual-value, asset-backed-lending]
projects: [gpu-compute-derivatives, gpu-residual-value-pricing]
sources: [perps-dont-work-for-compute-derivatives-2026-06-12, semianalysis-nvidia-backstop-trinity-2026-07-06, dave-friedman-compute-basis-risk-primer-2026-07-02]
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

### 2026-07-07 - The strips must be vintage-specific

Friedman's basis-risk primer (sequel to the perps piece) adds a shape constraint: a generic compute benchmark cannot anchor obsolescence drift, so the dated strips this insight calls for will form as GENERATION-SPECIFIC curves (an H100 strip, a GB300 strip), each with a useful life tied to that generation's deployment window, plus transition instruments bridging handoffs. The residual curve a lender derives from rent strips therefore inherits the vintage structure too: one derived residual curve per generation, with a rollover convention, not one eternal curve. Consistent with this, the first vintage-shaped rent curve to actually exist is NVIDIA's GB300 backstop floor schedule. See [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|the vintage-curves insight]].

### 2026-07-07 - A rent curve now exists; the residual curve still does not

The NVIDIA backstop schedule (per SemiAnalysis's illustrative model: $3.68 to $1.04/hr/GPU over 6 years) plus SemiAnalysis's rental index term structure means dated RENTAL price curves for compute now exist in embryonic form. Precision matters here: these are rent curves ($/hr a GPU earns per year), NOT residual value curves (what the box sells for). The object this insight says is missing - a dated resale/residual mark a lender can underwrite LTV and amortization against - still does not exist. The rent curve is an input one inferential step removed: resale value approximates discounted remaining earning power, so an implied residual view can be DERIVED from rent strips, but the derivation has real gaps (floors are set deliberately below expected market rates; resale prices embody scarcity and expectations, not just current rent - H100 resale in 2024-25 held far above naive rent-decay; a used-GPU buyer purchases all remaining years plus optionality, not one year's rate). Net: the insight stands; what changed is that the derivation input got published. Watch for anyone (SemiAnalysis's TCO residual framework, an appraiser, a lender) publishing the derived residual curve itself - that would be the actual solve.

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.
