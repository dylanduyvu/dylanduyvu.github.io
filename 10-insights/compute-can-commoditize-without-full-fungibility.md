---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-06-29
confidence: high
domains: [gpu-finance, compute-derivatives, compute-commodities, ai-infrastructure]
projects: [gpu-compute-derivatives]
sources: [can-compute-commoditize-if-its-not-fungible-2026-06-11]
people: [dave-friedman, brannin-mcbee]
orgs: [coreweave]
aliases: [fungibility is not required for compute commoditization, compute commodity markets need reference plus basis]
tags: [gpu, compute, commodities, fungibility, basis]
---

# Compute can commoditize without full fungibility

## Claim

Compute can commoditize even if GPU-hours are not perfectly fungible. Commodity market design needs a standardized reference plus separately priced basis, not binary sameness.

## Why It Matters

This keeps the compute-derivatives path alive despite real heterogeneity across clouds, clusters, software stacks, goodput, MFU, and SLAs. The right question is not whether every H100-hour is identical; it is whether the market can define a reference product and price deviations around it.

## Evidence

- 2026-06-11: Friedman argues that power and gas became deep commodity markets despite non-fungibility. Power has locational basis, firmness, and temporal shape. Gas has Henry Hub plus basis swaps for delivery points.
- 2026-06-11: Brannin McBee's objection is that an H100-hour in one cloud is not an H100-hour in another because goodput, MFU, and operating reality differ.
- 2026-06-11: Friedman reframes those differences as basis, not proof that a market cannot form.

## Implications

- Compute market design should start by defining the reference exposure, then explicitly pricing deviations.
- A useful compute curve may be possible before perfect operational standardization exists.
- GPU finance products can use reference-plus-basis logic instead of waiting for a pure commodity spot market.

## Counterpoints / Uncertainty

- Compute may still lack a robust settlement reference.
- Basis only works if deviations can be measured and trusted.
- Heterogeneity may be large enough that liquidity fragments across too many spreads.

## Links

- Sources: [[can-compute-commoditize-if-its-not-fungible-2026-06-11|Can Compute Commoditize if it's Not Fungible?]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]], [[brannin-mcbee|Brannin McBee]]
- Orgs: [[coreweave|CoreWeave]]

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute commoditization article.
