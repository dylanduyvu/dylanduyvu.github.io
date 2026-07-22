---
type: source
status: captured
created: 2026-07-22
updated: 2026-07-22
source_date: 2026-07-11
source_type: market-data-analysis
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, compute-markets, residual-value, inference]
people: [jakub-janiak]
orgs: [ccir]
attachments: []
tags: [gpu-rentals, memory-bandwidth, inference, normalization, reference-rates]
---

# CCIR: cross-generation neocloud rents form a narrow memory-bandwidth band

## Context

Jakub shared [CCIR's Chip Economics analysis](https://ccir.io/chip-economics) on 2026-07-21 and summarized the claim as GPU prices across generations standardizing to dollars per terabyte per second of memory bandwidth rather than dollars per FLOP-hour.

The precise claim is narrower. CCIR analyzes **posted hourly GPU rental rates**, not GPU purchase or resale prices. It compares a single market cell: United States neoclouds, guaranteed on-demand rentals, using a July 6, 2026 snapshot.

## Observed Band

CCIR divides each GPU's posted hourly rental rate by its vendor-rated memory bandwidth:

| GPU | Posted rent / GPU-hour | Memory bandwidth | Rent / TB/s-hour |
| --- | ---: | ---: | ---: |
| B300 | $7.85 | ~8.0 TB/s | $0.98 |
| B200 | $6.92 | 8.0 TB/s | $0.87 |
| H200 | $4.18 | 4.8 TB/s | $0.87 |
| H100 SXM | $3.22 | 3.35 TB/s | $0.96 |
| A100 80GB | $1.80 | 2.0 TB/s | $0.90 |

The resulting range is $0.87-$0.98 per TB/s-hour, or roughly plus or minus 6% around a $0.92 mean. CCIR reports a 12% max-to-min spread for this lens, compared with 56% when normalized by memory capacity, 68% by dense BF16 FLOPs, and 43% by nameplate power.

## Plain-English Read

Newer GPUs rent for more dollars per hour, but in this sample they also provide proportionally more memory bandwidth. After dividing price by bandwidth, an A100, H100, H200, B200, and B300 look surprisingly similar.

One possible interpretation is that this part of the rental market is pricing the GPU's ability to move model data through memory. That makes technical sense for the token-generation stage of LLM inference, which is often constrained by memory movement rather than raw arithmetic speed.

This does not mean memory bandwidth is the universal value of a GPU. Training, prompt processing, multi-GPU workloads, model size, latency, software, interconnect, and actual achieved performance can depend on other attributes.

## Why It Matters for GPU Finance

If the relationship persists through time and across comparable rental segments, memory bandwidth could become a simple cross-generation anchor for rental earning power. A lender could begin with:

> nameplate memory bandwidth x market rent per TB/s-hour x expected rented hours

That would still require separate estimates for utilization, realized discounts, operating cost, topology, service quality, customer duration, and resale value. It is a possible input into an earning-power model, not a complete collateral mark.

It could also help explain why older GPUs retain rental demand. Their headline hourly price falls, but their price per unit of inference-relevant bandwidth may remain competitive.

## Strategic Read

The biggest possible consequence is that CCIR makes the **price side** of GPU lending easier while leaving the **utilization side** unsolved. A fleet's gross rental revenue can be written as:

> memory bandwidth x rent per TB/s-hour x hours actually rented

The CCIR band could provide a public reference for what an occupied GPU should earn across generations. It does not show whether a particular operator will keep its fleet occupied. A lender could know what every rented hour should earn and still refuse a first-fleet loan because future rented hours remain unproven.

If the band survives further testing:

- lenders could normalize mixed-generation fleets around inference capacity;
- rental and rental-based residual forecasts could rely less on model names alone;
- operators could compare purchase and operating cost per TB/s rather than defaulting to the newest GPU;
- indexes, forward contracts, and repeatable loan models would have a cleaner reference unit;
- easier price comparison could move neocloud differentiation toward utilization, reliability, networking, location, and service.

This weakens the naked GPU-KBB thesis at the margin. If public bandwidth normalization explains much of cross-generation rent, proprietary value is more likely to sit in realized utilization, operating costs, completed hardware transactions, and demand forecasts.

## Caveats

- One cross-section on one date is not a time series or economic law.
- The numerator is posted asking rent, not completed transactions or realized revenue.
- The flat band holds only after controlling for provider class, region, commitment term, and interruptibility.
- The denominator is vendor-rated bandwidth, not measured application throughput.
- The sample contains five generations and some cells are thin.
- Shortages, software changes, workload mix, memory capacity, interconnect, and new architectures can break the relationship.
- The finding does not directly describe hardware purchase prices or secondary-market residual values.

CCIR explicitly presents the analysis as a research-grade first print and says history has not yet accumulated. Its strongest current use is as a falsifiable hypothesis to monitor.

## Links

- Insight: [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|Cross-generation GPU rents may track memory bandwidth more closely than FLOPs]]
- Related: [[gpu-earning-power-is-macro-level-offtake|GPU earning power is macro-level offtake]]
- Related: [[compute-price-futures-do-not-hedge-fleet-utilization-risk|Compute price futures do not hedge fleet utilization risk]]
- Project: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Area: [[gpu-finance|GPU Finance]]
