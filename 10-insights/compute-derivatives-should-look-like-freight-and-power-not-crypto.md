---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-06-29
confidence: high
domains: [gpu-finance, compute-derivatives, ai-infrastructure]
projects: [gpu-compute-derivatives]
sources: [perps-dont-work-for-compute-derivatives-2026-06-12]
people: [dave-friedman]
orgs: []
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

## Implications

- Market design should start from dated settlement windows and capacity curves.
- Natural participants may include operators, lenders, banks, insurers, lessors, and funds, not just crypto-native speculators.
- The curve should expose buildout waves, delivery period, and capacity quality.

## Counterpoints / Uncertainty

- Compute delivery is more heterogeneous than standardized freight lanes or power nodes.
- A useful compute index may be harder to construct than a power or freight index.
- Crypto-native market makers may still be helpful liquidity participants if the product shape is right.

## Links

- Sources: [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]]

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.
