---
type: insight
status: active
created: 2026-08-25
updated: 2026-08-25
domains: [inference, model-serving, analytics]
projects: [inference-model-opportunity-radar]
tags: [model-demand, model-size, pareto-frontier, opportunity-score]
---

# Demand-to-size ratios are secondary, not complete opportunity scores

## Claim

A demand-to-size ratio is useful for model screening, but it should not select
the serving target by itself. Use a minimum demand threshold and a
demand-versus-size Pareto frontier first. Use the ratio as a secondary sort.

A model is on the Pareto frontier when no other reviewed model is both smaller
and more in demand.

## Why It Matters

The practical goal is to find the smallest model with the strongest durable
demand. A ratio can give a high rank to a very small model with little demand.
It can therefore hide the difference between efficiency and market importance.

## Evidence

- **Mathematical consequence:** Dividing demand by size can produce a large
  value when the denominator is small, even if absolute demand is low.
- **Local implementation fact:** The current dashboard ranks 30-day OpenRouter
  tokens per checked theoretical BF16 GiB.
- **Reasonable inference:** A Pareto frontier shows the models for which there
  is no clearly better demand-and-size choice. A business-set demand floor then
  removes efficient but immaterial models.

## Implications

- Keep the current ratio, but label it as a secondary comparison.
- Add a Pareto frontier to the demand-versus-size chart.
- Do not let the dashboard invent the minimum demand threshold. It is a
  business input.
- Keep BF16 size, quantized checkpoint size, and later serving-memory estimates
  as separate size bases.
- Do not call a frontier model underserved until provider supply, quality,
  workload fit, and operating economics are checked.

## Counterpoints / Uncertainty

The Pareto frontier does not measure service quality, achievable throughput,
provider competition, price, reliability, or unit economics. It narrows the
candidate set. It does not make the final build decision.

## Links

- [[analytics-dashboard-and-chart-design-research-2026-08-25|Analytics dashboard and chart design research]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference|Inference]]

## Updates

- 2026-08-25: Created from the dashboard design research and the current
  demand-per-BF16-GiB implementation.
