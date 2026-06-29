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
aliases: [compute basis prices operational and contractual differences, compute fungibility has physical operational and contractual layers]
tags: [gpu, compute, commodities, basis, sla]
---

# Compute basis will price operator, topology, duration, and SLA differences

## Claim

The non-fungible parts of compute are not fatal to a market; they are the basis a market would need to price: operator, topology, scale, duration, priority, delivery window, goodput, MFU, failure recovery, software stack, and SLA.

## Why It Matters

This connects compute derivatives to the live GPU finance pain around SLA/uptime verification. If the market's spread is driven by operator performance and contractual delivery, then measuring those differences is not back-office diligence; it is the basis layer.

## Evidence

- 2026-06-11: Friedman splits compute fungibility into physical/spec fungibility, operational fungibility, and contractual fungibility.
- 2026-06-11: He says GPU class, DGX spec, fabric, and cooling are closer to physically/spec fungible.
- 2026-06-11: He says goodput, failure recovery, software stack, duration, SLA, priority, scale, and delivery window are not settled and should be priced as basis.
- 2026-06-29: USD.AI independently named SLA/uptime performance verification as a lender pain, making the basis-measurement wedge more concrete.

## Implications

- A compute market could expose separate spreads for operator quality and contract quality.
- SLA and uptime verification may be derivative-market infrastructure, not just lender diligence tooling.
- The first useful compute index may need both a reference grade and basis sheets for delivery attributes.

## Counterpoints / Uncertainty

- Too many basis dimensions can fragment liquidity.
- Some basis variables may be hard to observe or verify independently.
- Buyers may care about workload-specific performance in ways that resist standardized spreads.

## Links

- Sources: [[can-compute-commoditize-if-its-not-fungible-2026-06-11|Can Compute Commoditize if it's Not Fungible?]], [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]], [[brannin-mcbee|Brannin McBee]], [[harry-page|Harry Page]]
- Orgs: [[coreweave|CoreWeave]], [[usd-ai|USD.AI]]

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute commoditization article, linked to USD.AI's independent SLA verification pain.
