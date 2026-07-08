---
type: insight
status: distilled
created: 2026-07-07
updated: 2026-07-07
confidence: medium-high
domains: [gpu-finance, compute-derivatives, market-structure, residual-value]
projects: [gpu-compute-derivatives]
sources: [dave-friedman-compute-basis-risk-primer-2026-07-02, dave-friedman-where-gpu-debt-starts-to-break-2026-04-19]
people: [dave-friedman]
orgs: [ornn, nvidia]
aliases: [generic compute benchmarks die of unanchored obsolescence drift, compute markets form as a succession of generation-specific curves, there is no eternal henry hub for compute]
tags: [derivatives, vintage-curves, obsolescence, basis, market-design]
---

# Compute derivatives need vintage curves, not a generic benchmark

## Claim

A generic compute benchmark contract (a generic "GPU-hour" or "AI compute unit") is structurally doomed because obsolescence drift is baked into its own definition: the reference object decays against every holder's real exposure, the drift is one-directional and resets each hardware generation, and unlike every other basis type it has no anchor, no convergence mechanism that bounds the gap so a trader can measure and reserve against it. The viable market shape is a succession of generation-specific curves (an H100 curve, a GB300 curve, each living roughly as long as its deployment window) plus transition instruments bridging the generational handoffs. Per Friedman: convergence is not a property of time, it is a property of where you are in the hardware cycle.

## Why It Matters

Three seats in the vault depend on which shape wins. The residual-value project: the forward strips lenders need for collateral marks must be vintage-specific, so "the curve" everyone waits for is actually a family of short-lived curves plus a rollover convention, a harder standardization problem than one benchmark. The Ornn conversation: a residual value swap is a transition instrument in this taxonomy, a hedge for the generational discontinuity itself, which gives that call a market-structure frame beyond one company's product. The verification thread: cash-settled contracts converge only to their index, so index methodology and audit are the actual deliverable, meaning the who-measures seat exists in the derivatives market before the derivatives exist.

## Evidence

- 2026-07-02 (Friedman primer): the taxonomy, the anchor concept, the two clocks (liquidity clock runs on cumulative volume, hardware clock knocks tracking down each generation), the sawtooth, and the death spiral: tracking error keeps hedgers away, so volume never accumulates, so the contract dies. Liquidity is downstream of tracking quality.
- Memory chips as the adjacent warning: exchange-traded contracts on a fast-turnover silicon product struggled to hold hedgers (warning, not proof).
- 2026-07-06 (SemiAnalysis): NVIDIA's backstop floor schedule is a generation-local rent curve for GB300 specifically, six years, declining. The first published vintage-shaped curve, from the party that controls the hardware clock. The market's most credible actor independently chose the vintage shape.
- 2026-04-19 (Friedman, Abilene): the realized case, months before the primer formalized it. OpenAI declined to expand at the Stargate Abilene facility because the completed buildout would hold wrong-generation chips: an anchor tenant walking on vintage grounds, not credit grounds. Obsolescence drift detonating inside a physical lease before any derivative exists, and the event that forces lenders to price terminal value on facilities whose anchor may not stay past the underwritten term.
- 2026-07-07 (Shkreli tweet, corroboration only, not load-bearing): Lambda's walk-up console with the vintage gradient photographed in one image - every current-generation configuration (H100, B200, GH200) out of capacity at $4-7/GPU/hr while 2020-2021 era chips sat bookable (A100 $1.99, A10 $1.29). Demand piles onto the newest generation and abandons the old: the old vintage still earns, but it is the capacity nobody fights for. Exactly the shape a per-generation curve family would price and a generic benchmark would smear. Caveat: one provider, one evening; console capacity conflates demand with allocation policy.

## Implications

- Watch for vintage-curve formation, not benchmark formation: an exchange listing per-generation contracts, a broker survey quoting an H100 strip, SemiAnalysis extending its rental index term structure per chip.
- Rollover conventions and generation-migration instruments are an unclaimed product category; Ornn is the first candidate sighted on the sell side.
- Anyone underwriting multi-year GPU loans is implicitly short the generational handoff; the vintage frame names the risk their amortization schedules are groping at.
- For the residual thread: an implied residual curve derived from rent strips inherits the vintage structure, one derived curve per generation.

## Counterpoints / Uncertainty

- Single-author conceptual piece, no data; the memory-chip precedent is contested and the mapping to compute imperfect.
- The no-anchor claim is too absolute: inference renters arbitrage across generations through tokens-per-dollar continuously, and throughput benchmarking measures the conversion rate. The anchor is soft, not absent. If that conversion tightens (stable price-performance ratios across generations), a quality-adjusted generic benchmark could become viable after all, the way electricity markets handle heterogeneous generators through a settlement formula. Strengthened 2026-07-08 by Friedman's own March data: off-contract H100s rebooked at 95 percent of original price, five-year-old A100s nearly fully booked. His obsolescence-decomposition piece documents the mechanism (down-stack migration, switching costs) that makes the drift slow and soft for inference-heavy exposure; the drift is TIER-DEPENDENT, savage for training books, gentle for inference, nearly absent in the long tail. Implication for this insight: even vintage contracts may need workload scoping or tier-aware settlement, because a single H100 curve smears three different decay rates. See [[a-gpu-has-three-obsolescence-curves-not-one|the three-curves insight]].
- Fragmentation cost is real: per-generation contracts split liquidity across short-lived curves, and the death spiral he describes for generic contracts could just as easily kill each thin vintage contract individually.
- NVIDIA choosing the vintage shape for its backstop is weak confirmation; a bilateral guarantee is not a traded contract and faces none of the liquidity dynamics.

## Links

- Source: [[dave-friedman-compute-basis-risk-primer-2026-07-02|Dave Friedman: Compute Derivatives Basis Risk Primer]]
- Related Insights: [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]], [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]], [[compute-basis-will-price-operator-topology-duration-and-sla-differences|Compute basis will price operator, topology, duration, and SLA differences]], [[compute-derivatives-need-dated-term-structures-not-perps|Compute derivatives need dated term structures, not perps]], [[compute-commoditization-needs-convergence-plumbing-more-than-homogeneity|Compute commoditization needs convergence plumbing more than homogeneity]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]]
- Orgs: [[ornn|Ornn]], [[nvidia|NVIDIA]]

## Updates

### 2026-07-07

Initial capture from the basis risk primer. Note the productive tension with the earlier basis insight: the 06-11 piece framed non-fungibility as not fatal, just the basis to price; this piece carves out one exception, the obsolescence dimension cannot be priced-and-reserved inside a generic contract, only escaped by scoping the contract to a generation.
