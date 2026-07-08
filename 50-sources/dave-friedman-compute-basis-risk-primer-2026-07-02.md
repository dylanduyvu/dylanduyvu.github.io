---
type: source
status: captured
created: 2026-07-07
updated: 2026-07-07
source_date: 2026-07-02
source_type: article
projects: [gpu-compute-derivatives, gpu-residual-value-pricing]
domains: [gpu-finance, compute-derivatives, market-structure]
people: [dave-friedman]
orgs: []
attachments: []
tags: [derivatives, basis-risk, vintage-curves, obsolescence, market-design]
---

# Dave Friedman: Compute Derivatives Basis Risk Primer

## Context

Friedman's 2026-07-02 piece, the sequel to his perps article (already captured 2026-06-12). Read by Dylan 2026-07-07. The most rigorous public treatment so far of why compute futures contracts might fail and what shape could work. Conceptual, no data; he invites correspondence (email public on the post).

URL: https://davefriedman.substack.com/p/compute-derivatives-basis-risk-primer

## Core Argument

A hedge does not remove price risk; it converts it into basis risk, the gap between the contract traded and the exposure actually held. The predictable failure mode for first compute futures: a hedger trades one, discovers it does not track his book, and does not come back; the volume that was supposed to mature the contract never arrives.

Taxonomy of basis (plain words):
1. Liquidity/microstructure basis: thin trading, wide spreads. Decays with CUMULATIVE VOLUME, not calendar time.
2. Locational basis: where the compute sits (region, power market, latency).
3. Quality/grade basis: which chip, which cluster spec, what performance.
4. Calendar basis: mismatch between contract dates and exposure dates.
5. Settlement basis: a cash-settled contract converges only to its index, so the index methodology is the real deliverable.
6. Obsolescence basis: the reference object itself (an H100-hour) decays against the exposure set while the hedge is held.

The organizing line: every type except obsolescence has an ANCHOR, some convergence mechanism or physical bound that keeps the gap inside a measurable range you can reserve cash against. Obsolescence basis has no anchor: the drift is one-directional, resets each hardware generation, and you cannot haircut a moving reference. Compute is the only asset class that lights up every row; memory chips are the adjacent warning case (their exchange-traded contracts struggled).

## Two Clocks And The Sawtooth

Hedge effectiveness improves on a liquidity clock (runs on cumulative traded volume) and is knocked down on a hardware clock (each chip generation opens a fresh tracking gap). Superimposed, hedge quality is a sawtooth, not a smooth ramp. His line: convergence is not a property of time, it is a property of where you are in the hardware cycle.

## Failure Mode And Design Conclusion

Tracking error keeps hedgers away; without hedgers, volume never accumulates; without volume, the liquidity clock never runs; the contract dies. Liquidity is downstream of tracking quality, so a badly specified contract cannot be saved by patience.

Design consequence: generic contracts (a generic "GPU-hour" or "AI compute unit") bake the obsolescence drift into their own definition and never escape it. The viable market shape is a SUCCESSION OF VINTAGE-SPECIFIC CURVES: one curve per chip generation, each with a useful life tied to that generation's deployment window, plus transition instruments (calendar spreads across vintages, generation-migration swaps) bridging the handoffs. There is no eternal benchmark for compute the way natural gas has one.

## Vault Collisions

- NVIDIA's backstop floor schedule (GB300, six years, declining) is a GENERATION-LOCAL rent curve, exactly the vintage-shaped object this framework says is viable, published by the party that controls the hardware clock. See [[semianalysis-nvidia-backstop-trinity-2026-07-06|the Trinity source note]].
- Ornn's residual value swap maps to Friedman's "transition instrument" category: a hedge for the generational discontinuity itself.
- The settlement row is the verification seat one market over: every cash-settled compute contract inherits an index whose methodology and audit somebody must own.
- Productive tension with [[compute-basis-will-price-operator-topology-duration-and-sla-differences|the earlier basis insight]]: the 06-11 piece said non-fungibility is not fatal, it is the basis to price; the primer refines that to one exception, the obsolescence dimension cannot be priced-and-reserved inside a generic contract, only escaped by vintage-scoping the contract.

## Pushback (Dylan/Claude, not Friedman)

"No trade converts an H100-hour into a B200-hour" is too absolute for inference workloads: renters arbitrage across generations continuously through tokens-per-dollar, and throughput benchmarking products measure the conversion. The obsolescence anchor is SOFT (benchmark-mediated, fuzzy) rather than absent. This does not rescue the generic contract, but it makes the wedge quantifiable, which is friendlier to his own vintage-curve solution than his rhetoric admits.

## Promoted Insights

- [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|Compute derivatives need vintage curves, not a generic benchmark]]

## Open Questions

- Who publishes the first vintage curve that is not NVIDIA's own floor schedule: an exchange, SemiAnalysis, a broker survey?
- Do transition instruments (generation-migration swaps) find a natural seller? Ornn is the first candidate sighted.
- Does the soft anchor (tokens-per-dollar conversion) tighten enough over time to re-enable a generic benchmark, or does model-hardware co-design keep it loose?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- People: [[dave-friedman|Dave Friedman]]
- Related Insights: [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]], [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]], [[compute-commoditization-needs-convergence-plumbing-more-than-homogeneity|Compute commoditization needs convergence plumbing more than homogeneity]]
