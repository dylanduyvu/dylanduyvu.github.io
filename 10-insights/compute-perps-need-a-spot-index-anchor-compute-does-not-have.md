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
aliases: [compute perps lack robust spot index anchor, fragmented compute spot makes perps gameable]
tags: [gpu, derivatives, perps, index-design]
---

# Compute perps need a spot-index anchor compute does not have

## Claim

Compute perps would need a robust, continuously cleared spot index, but compute spot is fragmented, heterogeneous, and constructed. A thin surveyed index creates basis-game risk.

## Why It Matters

Even if perps were attractive for liquidity, their funding mechanism depends on an anchor compute does not yet have. Without a deep spot market, the perp may become a speculative venue detached from the hedging and financing needs of compute users.

## Evidence

- 2026-06-12: Friedman says a perp has to fund against a robust, continuously cleared spot market.
- 2026-06-12: He describes compute spot as fragmented, heterogeneous, and constructed.
- 2026-06-12: He says compute has a surveyed index, not a deep 24/7 book.
- 2026-06-12: He argues that funding a perpetual off a thin index creates a casino for basis games, while discrete settlement over a window is more resistant.

## Implications

- Index construction may be the bottleneck before any derivative format works.
- Dated settlement windows could be more robust than continuous funding when the spot anchor is weak.
- Survey methodology, participant selection, quality adjustment, and manipulation resistance matter as much as instrument UX.

## Counterpoints / Uncertainty

- A perp could bootstrap liquidity that later improves spot/index quality.
- Some compute categories may have enough transaction density to support a stronger index sooner than others.
- Crypto-native venues may tolerate basis-game risk if the product is mainly speculative, but that would not satisfy lender hedging needs.

## Links

- Sources: [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: Dave Friedman

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.
