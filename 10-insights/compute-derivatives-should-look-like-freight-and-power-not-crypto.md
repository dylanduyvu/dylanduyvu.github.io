---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-06-29
confidence: high
domains: [gpu-finance, compute-derivatives, compute-commodities, ai-infrastructure]
projects: [gpu-compute-derivatives]
sources: [perps-dont-work-for-compute-derivatives-2026-06-12, can-compute-commoditize-if-its-not-fungible-2026-06-11]
people: [dave-friedman, brannin-mcbee]
orgs: [coreweave]
aliases: [compute derivatives resemble freight and power markets, compute is freight for ai workloads]
tags: [gpu, derivatives, freight, power, market-structure]
---

# Compute derivatives should look like freight and power, not crypto

## Claim

Compute derivatives should borrow more from freight and power markets than from crypto perps, because the product is dated capacity with forward supply/demand risk.

## Why It Matters

The right analogy affects instrument design. Freight and power markets center dated contracts and forward curves because time, delivery period, capacity, and infrastructure matter. Compute shares those traits more than it shares crypto's need for continuous leveraged spot exposure.

## Evidence

- 2026-06-12: Friedman notes that forward freight agreements are dated, cash-settle against spot freight indices, and help shipowners, cargo owners, operators, banks, and funds manage forward supply, demand, and cash-flow risk.
- 2026-06-12: He maps the vessel order book to the datacenter/GPU buildout pipeline: capacity is announced ahead of time, lands in waves, and reprices the curve.
- 2026-06-12: He argues power markets also require dated curves because power at one hour/season differs from power at another.
- 2026-06-12: He says stripping tenor out deletes the information the market needs to function.
- 2026-06-11: Friedman separately argues power and gas markets prove commodity markets can price non-fungibility through basis rather than requiring perfect sameness.
- 2026-06-11: He points to locational power basis, firmness, peak/off-peak shape, Henry Hub, and gas delivery-point basis swaps as analogues for compute basis.

## Implications

- Market design should start from dated settlement windows and capacity curves.
- Natural participants may include operators, lenders, banks, insurers, lessors, and funds, not just crypto-native speculators.
- The curve should expose buildout waves, delivery period, and capacity quality.
- Compute product design should separate reference grade, settlement hub, and basis spreads.

## Counterpoints / Uncertainty

- Compute delivery is more heterogeneous than standardized freight lanes or power nodes.
- A useful compute index may be harder to construct than a power or freight index.
- Crypto-native market makers may still be helpful liquidity participants if the product shape is right.

## Links

- Sources: [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]], [[can-compute-commoditize-if-its-not-fungible-2026-06-11|Can Compute Commoditize if it's Not Fungible?]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]], [[brannin-mcbee|Brannin McBee]]
- Orgs: [[coreweave|CoreWeave]]

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.

### 2026-06-29

Reinforced by Friedman's compute commoditization article: freight/power/gas analogies also matter because they show non-fungible capacity can trade through reference-plus-basis design.
