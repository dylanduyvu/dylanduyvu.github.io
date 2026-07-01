---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-07-01
confidence: high
domains: [gpu-finance, compute-derivatives, ai-infrastructure, residual-value]
projects: [gpu-compute-derivatives, gpu-residual-value-pricing]
sources: [perps-dont-work-for-compute-derivatives-2026-06-12, meta-compute-hyperscalers-selling-excess-compute-2026-07-01]
people: [dave-friedman]
orgs: [meta]
aliases: [compute has perishability and obsolescence, gpu hours decay across time]
tags: [gpu, derivatives, residual-value, capacity]
---

# Compute is perishable capacity with an obsolescence curve

## Claim

Compute has two time dimensions: unused capacity perishes inside the horizon, and the economic value of a GPU-hour decays across horizons as silicon generations and system performance improve.

## Why It Matters

This is the core reason compute derivatives cannot be modeled like crypto perps. The market is not merely pricing ongoing exposure to a persistent digital asset; it is pricing dated productive capacity whose usefulness and residual economics change over time.

## Evidence

- 2026-06-12: Friedman describes a GPU-hour as use-it-or-lose-it productive capacity, analogous to an empty airline seat or undrawn megawatt.
- 2026-06-12: He argues that silicon gets superseded, so future H100-hour economics depend on Blackwell/Rubin volume, software optimization, interconnect repricing, and installed-base depreciation.
- 2026-06-12: He cites Nvidia's marketing of GB200 NVL72 at up to roughly 30x H100 on some LLM inference workloads as a vivid example of potential discontinuity.
- 2026-06-12: He distinguishes crypto basis around a persistent spot asset from compute's obsolescence curve in a wasting productive good.
- 2026-07-01: Meta's reported plan to sell excess AI compute is live evidence that large operators may repurpose older or surplus fleets into external inference/RL capacity rather than treating them as equally useful frontier-training capacity.

## Implications

- Compute curves should encode both short-term capacity scarcity and long-term hardware obsolescence.
- Residual-value products need dated depreciation and performance-substitution assumptions, not a single generic GPU mark.
- A useful index may need to distinguish chip generation, workload type, geography, interconnect, contract tenor, and service quality.
- Hyperscaler N-1 capacity can become market supply even when current-generation frontier-training capacity remains scarce.

## Counterpoints / Uncertainty

- Performance marketing numbers may overstate real workload substitution.
- Scarcity can keep older GPUs economically relevant longer than hardware curves imply.
- Some workloads may value availability, locality, or software compatibility more than frontier inference speed.

## Links

- Sources: [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- Related Source: [[meta-compute-hyperscalers-selling-excess-compute-2026-07-01|Meta Compute: hyperscalers moving to sell excess AI compute]]
- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]]

## Updates

### 2026-06-29

Initial capture from Dave Friedman compute derivatives article.

### 2026-07-01

Added Meta excess-compute reporting as live evidence that older or surplus hyperscaler capacity can be repurposed into external market supply.
