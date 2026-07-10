---
type: insight
status: distilled
created: 2026-07-08
updated: 2026-07-08
confidence: medium-high
domains: [gpu-finance, residual-value, ai-infrastructure, asset-backed-lending]
projects: [gpu-residual-value-pricing]
sources: [dave-friedman-gpu-obsolescence-is-complicated-2026-03-18]
people: [dave-friedman]
orgs: [nvidia, coreweave]
aliases: [gpu residual value is a workload waterfall, older chips take a pay cut not unemployment, training-obsolete is not inference-obsolete]
tags: [obsolescence, residual-value, workload-waterfall, depreciation, underwriting]
---

# A GPU has three obsolescence curves, not one

## Claim

A GPU's economic life decays on three stacked curves, not one: a steep TRAINING curve (dead for frontier training in 12-18 months, on NVIDIA's release clock), a shallow INFERENCE curve (alive until migration cost falls below cumulative per-token savings, protected by switching costs and by demand growth that pushes old chips down the stack rather than out of it), and a nearly flat LONG-TAIL curve (classical machine learning, transcoding, simulation, retired only by physical failure or the power-cost crossover). The public depreciation fight exists because every party prices one curve and insists it is the only one. The residual-value consequence: a GPU's residual is not "what is this chip worth in three years" but "what is the lowest-value workload it can still economically serve, and how much demand exists at that tier." The mark is a workload-demand waterfall, not a price forecast.

## Why It Matters

This hands the residual-value project its missing method. The Kelley-Blue-Book thread stalled on "no trusted mark exists"; the waterfall reframes what the mark IS: tier floors and demand depth, the same discipline aircraft and shipping structured credit already run. It also explains observed contradictions cleanly (Jensen's "couldn't give Hoppers away" and CoreWeave's 95 percent H100 rebooking are both true, about different curves), and it names where the sophisticated version already lives: structured credit shops (Magnetar, Castlake per Friedman) model exactly this in private term sheets, meaning the method is validated but unpublished, which is itself a gap. For lenders, three curves imply amortization should have three slopes; for the vintage-curves thread, it means obsolescence drift is tier-dependent, so the true residual object is a matrix: chip generation by workload tier.

## Evidence

- 2026-03-18 (Friedman): the full decomposition, the accounting constraint (US rules force one useful-life number per asset class, so the framework cannot express the reality), and the incentive map (Jensen, the short-sellers, and hyperscaler schedules each need one curve).
- Same source: Intrator/CoreWeave, H100s off contract rebooked at 95 percent of original price; Bernstein, five-year-old A100s nearly fully booked at comfortable margins. The inference curve's shallowness, measured.
- Same source: V100s (2017) and T4s (2018) still economically employed in the long tail.
- 2026-07-07 (Shkreli console screenshot, corroboration): the vintage gradient live, current-generation sold out at $4-7/hr while A100s sat bookable at $1.99: the down-stack tiers visibly priced and occupied.
- Convergent: SemiAnalysis's AI TCO Model advertises a "GPU residual value framework," and NVIDIA's declining backstop floors ($3.68 to $1.04 over six years) are consistent with accelerated-not-cliff decay on the rental side.

## Implications

- Residual underwriting question set, ready for lender calls: if training demand for this fleet evaporates, what is the inference floor? If inference erodes, what is the long-tail floor? What does each tier pay, and how deep is demand at each tier?
- A defensible depreciation schedule is accelerated-not-cliff: steep years 1-2, shallow 3-6. Neither the two-year short thesis nor the six-year straight line survives the decomposition.
- The public-data version of the waterfall may be buildable: rental listings by chip generation ARE tier pricing. Worth testing before assuming the demand-depth data is private-only.
- For [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|vintage curves]]: contracts may need workload scoping as well as generation scoping, or at least tier-aware settlement indices.

## Counterpoints / Uncertainty

- Single-author framework; the three-way split is analytically clean but boundaries blur in practice (fine-tuning sits between training and inference; "long tail" is a residual category).
- Inference-curve shallowness is scarcity-dependent: if demand growth slows or new architectures orphan old chips (his own listed uncertainty), the middle curve steepens toward the training curve, and the 95 percent rebooking becomes a boom artifact rather than structure.
- Demand depth at lower tiers is the load-bearing unknown: down-stack migration only works if the tiers below can absorb the volume coming off the tier above. Nobody has published tier-depth data. Partial first instrument, 2026-07-09 (Friedman, Hugging Face downloads): text-generation models are only 17.6% of top-3,000 download activity, with embedding/similarity/classification work collectively larger - a public, author-caveated gesture at how broad and cheap-per-invocation the lower workload tiers are. Weak proxy (downloads are not executions or accelerator-hours), but it demonstrates the public-data path this note's open question asks about.
- The waterfall method requires workload-tier price and demand data that may only exist inside the term-sheet shops; the method being right does not make it runnable from outside.

## Links

- Source: [[dave-friedman-gpu-obsolescence-is-complicated-2026-03-18|Dave Friedman: GPU Obsolescence is Complicated]]
- Related Insights: [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]], [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|Compute derivatives need vintage curves, not a generic benchmark]], [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]], [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch]]
- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]]
- Orgs: [[nvidia|NVIDIA]], [[coreweave|CoreWeave]]
