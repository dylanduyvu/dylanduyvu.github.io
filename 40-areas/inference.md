---
type: area
status: active
created: 2026-08-18
updated: 2026-08-19
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
- **Working definition:** Shipping an inference model means that it runs on provider hardware behind an authenticated, priced, public-internet API with machine-readable metadata and a published privacy policy. The website is not the product surface.
- **Belief correction:** Current provider cases support day-0 shipping as a post-listing growth tactic, not as a demonstrated path to approval. The current research found no public first-hand account of how a provider moved from application to OpenRouter acceptance.
- **Go-to-market hypothesis:** Build a differentiated public endpoint, publish reproducible statistics, amplify the launch with a defined paid X campaign, apply to relevant gateways, and run direct follow-up in one measured window. This can test demand and gateway response, but it is not a verified route to acceptance.
- **Direct evidence:** Featherless has a public provider-authored implementation trail for Hugging Face Inference Providers. It shows named reviewers, live tests, staging, client integrations, documentation, and a coordinated launch. It does not expose the initial partnership decision. Later working provider integrations show that Hugging Face can stop onboarding at a separate server-side partner-selection gate.
- **Unverified source claim:** Two Compass reports say inference gateways can turn serving quality into distribution because routing can depend on price, uptime, throughput, and tool-call success. This is a research direction until the claims are checked against primary documentation and live routing data.
- **Research gap:** The vault is stronger on ownership, demand, contracts, and financing than on serving engines, batching, scheduling, cache management, routing, reliability, and workload-level benchmarks.

## Key Insights

- [[steady-inference-baseload-moves-to-controlled-capacity-not-always-owned-gpus|Steady inference baseload moves to controlled capacity, not always owned GPUs]]
- [[inference-capacity-internalization-is-an-s-curve-toward-a-hybrid-end-state|Inference-capacity internalization is an S-curve toward a hybrid end state]]
- [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch: inference rents short, debt runs long]]
- [[compute-price-futures-do-not-hedge-fleet-utilization-risk|Compute price futures do not hedge fleet utilization risk]]
- [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|Cross-generation GPU rents may track memory bandwidth more closely than FLOPs]]
- [[funded-inference-platforms-are-traceable-gpu-demand-beacons|Funded inference platforms are traceable GPU-demand beacons]]
- [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping an inference model means a live priced API, not a website]]
- [[day-zero-shipping-is-evidenced-after-listing-not-as-a-path-to-approval|Day-0 shipping is evidenced after listing, not as a path to approval]]
- [[current-openrouter-research-found-no-public-first-hand-provider-listing-account|Current OpenRouter research found no public first-hand provider-listing account]]
- [[a-working-client-integration-does-not-secure-hugging-face-provider-acceptance|A working client integration does not secure Hugging Face provider acceptance]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]

## Active Projects

No inference-only project is active in the current vault record.

- **Candidate, not started:** [[gpu-configuration-demand-gate|GPU configuration demand gate]] tests whether a small GPU server has enough workload-specific demand and conservative net economics to justify a purchase. The last update kept a no-buy result valid and did not record branch selection.

## Important Sources

- [[inference-rent-to-controlled-capacity-evidence-audit-2026-07-16|Do AI companies with steady inference demand buy GPUs?]]: company-level evidence on ownership, dedicated capacity, hybrid infrastructure, and utilization.
- [[ccir-memory-bandwidth-band-cross-generation-gpu-rents-2026-07-11|CCIR memory-bandwidth band]]: a narrow posted-rent comparison and its limits.
- [[gpu-loans-without-long-term-customer-claim-ledger-2026-07-19|GPU loans without a long-term customer claim ledger]]: evidence grades for short-term demand, utilization, and financing.
- [[semianalysis-nvidia-backstop-trinity-2026-07-06|SemiAnalysis: NVIDIA GPU debt backstop and AI Project Trinity]]: source claims on contract length, rental pricing, and financing structure.
- [[ccir-gpu-compute-credit-research-audit-2026-07-22|CCIR GPU compute-credit research audit]]: pricing, contract-rollover, utilization, and collateral evidence.
- [[compass-openrouter-and-ai-gateway-channel-playbooks-2026-08-18|Compass OpenRouter and AI gateway channel playbooks]]: raw automated research on provider channels, market gaps, and demand discovery. Not independently verified.
- [[compass-openrouter-inference-provider-listing-guide-2026-08-18|Compass OpenRouter inference-provider listing guide]]: raw automated research on onboarding, routing, metrics, and channel economics. Not independently verified.
- [[compass-ai-gateway-provider-listing-case-studies-2026-08-18|Compass AI gateway provider-listing case studies]]: raw automated case-study research on day-0 launches, pricing, compliance, and human review. Most metrics are provider self-reports and are not independently verified.
- [[dylan-openrouter-listing-case-study-causal-audit-2026-08-18|Dylan's causal audit of the OpenRouter case studies]]: correction that preserves the official process and post-listing evidence while rejecting the unsupported pre-listing causal claim.
- [[exa-featherless-hugging-face-provider-onboarding-audit-2026-08-18|Featherless Hugging Face provider-onboarding audit]]: primary provider and gateway records for code review, staging, documentation, launch, failed comparators, and the remaining private approval gap.
- [[featherless-reached-hugging-face-through-a-coordinated-provider-integration|Featherless provider-onboarding case study]]: synthesis of the public chronology, named people, supported edge tactics, and claims that remain unproven.

## Open Questions

- Which customer and workload types create stable inference baseload, and which remain variable enough to need pooled capacity?
- How do prefill, the stage that processes the input prompt, and decode produce different latency, throughput, memory, and hardware economics?
- How much do batching, scheduling, routing, quantization, speculative decoding, and key-value cache management change cost at a fixed quality and reliability level?
- Which benchmark best predicts achieved customer performance rather than vendor-rated performance?
- At what sustained utilization does controlled capacity beat metered service after power, colocation, staff, failures, spare capacity, financing, and hardware obsolescence?
- Can short-term inference demand support fleet financing? Which evidence, contract, reserve, guarantee, or operating history changes loan approval or terms?
- Who should own the capacity and residual risk: the model company, a specialist provider, a lessor, or a special-purpose vehicle?
- Can an inference gateway supply enough durable demand and margin for a new provider after price competition, routing rules, and channel dependence?
- What actually happens between an OpenRouter provider application and acceptance, rejection, or silence?
- Which partner-selection factors matter before a gateway enables the provider server-side, and which are only implementation requirements after acceptance?

## Next Tests

- Benchmark one open model and one defined workload across serving engines and hardware. Measure time to first token, output speed, total latency, GPU memory, error rate, and cost per million tokens.
- Re-run the memory-bandwidth pricing test with current posted prices, more providers, and achieved workload performance. Keep price and utilization as separate variables.
- Select one customer type and collect real prompt lengths, output lengths, concurrency, latency limits, traffic variation, reliability needs, geography, and budget before selecting hardware.
- Build a rent-versus-control model from observed workload data. Include all operating costs, conservative utilization, downtime, financing, and resale downside.
- Ask inference infrastructure and finance leaders for factual receipts on legal ownership, utilization before and after conversion, realized all-in cost, expansion after the first deployment, and remaining burst-cloud share.
- Verify the OpenRouter provider requirements and routing rules against primary documentation. Then run one live model-gap scan that combines token demand, provider count, price, latency, throughput, uptime, and tool-call success.
- Run and document a real provider application. Record the channel, contacts, elapsed time, review requests, technical tests, decision, and post-listing traffic as separate evidence.
- Run one measured provider launch: ship a gap-filling endpoint, publish reproducible statistics, use a defined paid X budget, apply to relevant gateways, and track public traffic, gateway tests, responses, acceptance, and routed traffic as separate outcomes.
- Before building every gateway integration, confirm that partner intake is open and ask which supply gap the gateway wants. Track partner selection separately from client-code acceptance.

## Related Areas

- [[gpu-finance|GPU Finance]]: financing, collateral, contracts, capacity ownership, utilization risk, and residual value. Inference is a peer area, not a GPU Finance subproject.
