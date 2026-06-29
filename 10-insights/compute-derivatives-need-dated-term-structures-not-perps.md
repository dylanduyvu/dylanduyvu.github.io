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
aliases: [perps collapse compute term structure, compute hedgers need dated nodes]
tags: [gpu, derivatives, perps, futures]
---

# Compute derivatives need dated term structures, not perps

## Claim

Compute derivatives need dated term structure. A perpetual future can express pressure on current spot and funding, but it cannot isolate, hedge, finance, or settle exposure at a specific maturity.

## Why It Matters

The core informational payload of a compute derivative is the dated curve. If the instrument collapses the curve into one undated perp price, it removes the exact information that lenders, operators, lessors, and hedgers need.

## Evidence

- 2026-06-12: Dave Friedman argues that a perp compresses term structure into the funding rate and current index.
- 2026-06-12: He notes that a perp can be forward-looking but cannot separate future information by date.
- 2026-06-12: He frames the dated node as the thing compute markets actually need to trade.
- 2026-06-12: He argues that compute hedgers need tenor, so the instrument should match dated hedging needs rather than speculative crypto market structure.

## Implications

- The first serious compute derivative should probably be a dated future, forward, strip, or FFA-style contract, not a perpetual.
- Liquidity design should not override hedger fit; concentrating flow into one perp may create volume while failing the real risk-transfer job.
- Index builders should think in curve nodes and settlement periods from day one.

## Counterpoints / Uncertainty

- Perps might still seed speculative flow and market attention in an early market.
- Fragmenting liquidity across many tenors can make each tenor illiquid.
- A hybrid design could use a front-month or rolling contract while still preserving dated curve information.

## Links

- Sources: [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: Dave Friedman

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.
