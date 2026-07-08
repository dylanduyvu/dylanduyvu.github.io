---
type: source
status: captured
created: 2026-07-08
updated: 2026-07-08
source_date: 2026-03-18
source_type: article
projects: [gpu-residual-value-pricing, gpu-compute-derivatives]
domains: [gpu-finance, residual-value, ai-infrastructure, accounting]
people: [dave-friedman]
orgs: [nvidia, coreweave]
attachments: []
tags: [obsolescence, depreciation, residual-value, workload-waterfall, burry]
---

# Dave Friedman: GPU Obsolescence is Complicated

## Context

Friedman's 2026-03-18 piece, read by Dylan 2026-07-08 while working back through the archive. Chronologically the foundation stone of his arc: the three-curve decomposition here is what the trophy pieces (April) and the basis primer (July) build on. Frames the public depreciation fight (Burry/Chanos/Princeton short thesis vs Jensen vs hyperscaler schedules) as everyone pricing a different curve while insisting there is only one.

URL: https://davefriedman.substack.com/p/gpu-obsolescence-is-complicated

## The Paradox That Motivates It

Jensen at GTC: when Blackwell ships in volume, "you couldn't give Hoppers away." CoreWeave's Intrator, months later: H100s coming off contract REBOOKED AT 95 PERCENT of original price. Bernstein: five-year-old A100s nearly fully booked at comfortable margins. Same chips, same period, opposite claims. Resolution: both true, about different markets.

## The Three Stacked Curves

1. TRAINING OBSOLESCENCE, steep: a chip dies for frontier training when the next generation makes starting a new run on it uneconomical. Clock = NVIDIA's 12-18 month release cadence. Driver = raw compute per dollar at the frontier plus the opportunity cost of researcher time. This is the only curve the short-sellers price; priced alone it yields the "useful life is 2 years, the books are cooked" conclusion.
2. INFERENCE OBSOLESCENCE, shallow: trigger is not a better chip existing but migration cost falling below cumulative per-token savings. Three forces keep the bar high: inference optimizes throughput per dollar, not peak speed; switching costs are enormous (mature software stacks, engineers who know the hardware, quantization and optimization work already sunk); and demand grows fast enough that older chips get pushed DOWN the stack rather than out of it. His line: older chips do not become unemployed, they take a pay cut. The 95 percent rebooking is this curve's shape, measured. A chip can be training-obsolete at 18 months and inference-competitive for 3-4 years.
3. LONG-TAIL COMPUTE, nearly flat: recommendation engines, classical machine learning, fine-tuning small models, transcoding, simulation. V100s (2017) and T4s (2018) still run here. Retirement trigger = physical failure or the power-cost crossover (electricity + maintenance exceeding replacement economics). Measured in years.

## Why Nobody Frames It This Way

- US accounting rules demand ONE useful-life number per asset class; component depreciation decomposes physically (engine vs airframe), not by workload. "The framework literally cannot accommodate the reality." So the public debate is trapped arguing over a single parameter.
- Every loud party needs one curve: Jensen sells Blackwell, Burry supports the short, hyperscalers defend earnings.
- The people who DO think in stacked curves are not publishing: Magnetar, Castlake, and the structured credit shops modeling collateral recovery waterfalls "aren't writing blog posts. They're writing term sheets." The sophisticated residual model exists, privately, inside lenders.

## The Lender Payoff: Residual Value As A Workload Waterfall

The stacked-curve model IS a collateral recovery waterfall: if training demand for this chip evaporates, what is the inference floor? If inference erodes, what is the long-tail floor? What does each tier pay, and how deep is demand at each tier? Same discipline as commercial real estate, aircraft, and shipping structured credit. His reframe of the residual question: a GPU's residual value is not "what is this chip worth in three years" but "WHAT IS THE LOWEST-VALUE WORKLOAD THIS CHIP CAN STILL ECONOMICALLY SERVE, AND HOW MUCH DEMAND EXISTS AT THAT TIER." The mark is a workload-demand analysis, not a price forecast.

For equity analysts: the defensible schedule is accelerated-not-cliff (steeper years 1-2, shallower years 3-6). "A portfolio of decaying optionalities," each tier with its own decay rate and uncertainty.

## Per-Curve Uncertainties (his list)

- Training: NVIDIA execution risk, alternative silicon fragmenting the frontier (Groq's $20B licensing deal with NVIDIA noted; Jonathan Ross now at NVIDIA), scaling-law plateau.
- Inference: architecture evolution could orphan old chips faster; quantization/distillation cut the other way, extending them; demand growth rate is the swing variable for down-stack absorption.
- Long tail: power costs, cloud providers retiring old instance types for operational simplicity, non-AI accelerated computing growth.

## Tension With His Own July Primer (ours, worth holding)

The July basis primer claims obsolescence basis "has no anchor." This March piece documents the anchor's raw material: 95 percent rebooking, down-stack migration, switching costs that make the drift slow and soft for inference-heavy books. The drift is TIER-DEPENDENT: savage for training exposure, gentle for inference, nearly absent in the long tail. Does not break the vintage-curve conclusion, but means even vintage curves need a workload dimension: the residual object is closer to a matrix (generation x workload tier) than a family of curves.

## Promoted Insights

- [[a-gpu-has-three-obsolescence-curves-not-one|A GPU has three obsolescence curves, not one]]

## Open Questions

- Can the workload-waterfall method be run from public data (rental listings by chip generation as tier-pricing evidence), or does it require the private demand-depth data the term-sheet shops hold?
- Where is the power-cost crossover for A100s/V100s at current electricity prices, and who tracks it?
- Does any lender's amortization schedule already encode three slopes, or does everyone use one line?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]], [[gpu-compute-derivatives|GPU Compute Derivatives]]
- People: [[dave-friedman|Dave Friedman]]
- Orgs: [[nvidia|NVIDIA]], [[coreweave|CoreWeave]]
- Related Insights: [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]], [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|Compute derivatives need vintage curves, not a generic benchmark]], [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]
