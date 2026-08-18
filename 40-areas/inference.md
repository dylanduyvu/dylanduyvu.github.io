---
type: area
status: active
created: 2026-08-18
updated: 2026-08-18
domains: [inference, ai-infrastructure, model-serving, compute-economics]
projects: []
tags: [inference, serving, infrastructure, operations, unit-economics]
---

# Inference

## Current Understanding

- **Direct evidence:** Public company cases show that a predictable, high-use inference baseline can move from metered cloud to controlled capacity. Controlled capacity can be owned hardware or a long-term dedicated cluster. Cloud remains useful for bursts, regions, experiments, and closed models.
- **Source claim:** SemiAnalysis reports that many inference providers prefer contracts of one year or less, while the easiest GPU debt has several years of committed customer payments. This is evidence of a financing mismatch, but it is not a market-wide survey.
- **Reasonable inference:** Workload shape connects serving technology to business structure. Stable workloads can support dedicated capacity. Variable or pooled workloads can favor cloud or serverless providers. Rental price risk and fleet-utilization risk are separate.
- **Technical hypothesis:** One July 2026 neocloud snapshot found a narrow range of posted rents after adjustment for nameplate memory bandwidth. This can matter during decode, the stage that generates output tokens, because decode can be limited by data movement from memory. The result is not a universal pricing law or a transaction benchmark.
- **Research gap:** The vault is stronger on ownership, demand, contracts, and financing than on serving engines, batching, scheduling, cache management, routing, reliability, and workload-level benchmarks.

## Key Insights

- [[steady-inference-baseload-moves-to-controlled-capacity-not-always-owned-gpus|Steady inference baseload moves to controlled capacity, not always owned GPUs]]
- [[inference-capacity-internalization-is-an-s-curve-toward-a-hybrid-end-state|Inference-capacity internalization is an S-curve toward a hybrid end state]]
- [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch: inference rents short, debt runs long]]
- [[compute-price-futures-do-not-hedge-fleet-utilization-risk|Compute price futures do not hedge fleet utilization risk]]
- [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|Cross-generation GPU rents may track memory bandwidth more closely than FLOPs]]
- [[funded-inference-platforms-are-traceable-gpu-demand-beacons|Funded inference platforms are traceable GPU-demand beacons]]

## Active Projects

No inference-only project is active in the current vault record.

- **Candidate, not started:** [[gpu-configuration-demand-gate|GPU configuration demand gate]] tests whether a small GPU server has enough workload-specific demand and conservative net economics to justify a purchase. The last update kept a no-buy result valid and did not record branch selection.

## Important Sources

- [[inference-rent-to-controlled-capacity-evidence-audit-2026-07-16|Do AI companies with steady inference demand buy GPUs?]]: company-level evidence on ownership, dedicated capacity, hybrid infrastructure, and utilization.
- [[ccir-memory-bandwidth-band-cross-generation-gpu-rents-2026-07-11|CCIR memory-bandwidth band]]: a narrow posted-rent comparison and its limits.
- [[gpu-loans-without-long-term-customer-claim-ledger-2026-07-19|GPU loans without a long-term customer claim ledger]]: evidence grades for short-term demand, utilization, and financing.
- [[semianalysis-nvidia-backstop-trinity-2026-07-06|SemiAnalysis: NVIDIA GPU debt backstop and AI Project Trinity]]: source claims on contract length, rental pricing, and financing structure.
- [[ccir-gpu-compute-credit-research-audit-2026-07-22|CCIR GPU compute-credit research audit]]: pricing, contract-rollover, utilization, and collateral evidence.

## Open Questions

- Which customer and workload types create stable inference baseload, and which remain variable enough to need pooled capacity?
- How do prefill, the stage that processes the input prompt, and decode produce different latency, throughput, memory, and hardware economics?
- How much do batching, scheduling, routing, quantization, speculative decoding, and key-value cache management change cost at a fixed quality and reliability level?
- Which benchmark best predicts achieved customer performance rather than vendor-rated performance?
- At what sustained utilization does controlled capacity beat metered service after power, colocation, staff, failures, spare capacity, financing, and hardware obsolescence?
- Can short-term inference demand support fleet financing? Which evidence, contract, reserve, guarantee, or operating history changes loan approval or terms?
- Who should own the capacity and residual risk: the model company, a specialist provider, a lessor, or a special-purpose vehicle?

## Next Tests

- Benchmark one open model and one defined workload across serving engines and hardware. Measure time to first token, output speed, total latency, GPU memory, error rate, and cost per million tokens.
- Re-run the memory-bandwidth pricing test with current posted prices, more providers, and achieved workload performance. Keep price and utilization as separate variables.
- Select one customer type and collect real prompt lengths, output lengths, concurrency, latency limits, traffic variation, reliability needs, geography, and budget before selecting hardware.
- Build a rent-versus-control model from observed workload data. Include all operating costs, conservative utilization, downtime, financing, and resale downside.
- Ask inference infrastructure and finance leaders for factual receipts on legal ownership, utilization before and after conversion, realized all-in cost, expansion after the first deployment, and remaining burst-cloud share.

## Related Areas

- [[gpu-finance|GPU Finance]]: financing, collateral, contracts, capacity ownership, utilization risk, and residual value. Inference is a peer area, not a GPU Finance subproject.
