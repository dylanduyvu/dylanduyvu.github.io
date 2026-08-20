---
type: area
status: active
created: 2026-08-18
updated: 2026-08-20
domains: [inference, ai-infrastructure, model-serving, compute-economics]
projects: [inference-model-opportunity-radar]
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
- **Go-to-market synthesis:** OpenRouter requires technical readiness before it reviews an application and says it prioritizes providers that fill network gaps. The best current action is to select a demand-backed gap, build the minimum review-ready endpoint, and run launch, application, and business development in parallel. Day-zero acceptance and paid-launch effects remain unproven.
- **Belief update:** OpenRouter also says it currently prioritizes providers with proprietary models. This weakens the listing case for a provider that only serves unchanged public weights. Gap coverage remains an explicit selection factor, but OpenRouter does not publish the relative weight of the two priorities.
- **Event-zero hypothesis:** New model releases are one type of launch event. Access restrictions, price or quota changes, outages, model removals, license or geography changes, and sudden client growth can also create urgent inference gaps. WaferPass launched 11 days after an Anthropic access change affected OpenClaw users, but no public evidence proves that the event caused Wafer's launch or gateway acceptance.
- **Direct distribution evidence:** Wafer entered the open Models.dev provider catalog used by OpenCode five days after WaferPass launched. This was a public Bring Your Own Key client integration, not a curated gateway supply agreement.
- **Potential opportunity, not a build recommendation:** A preserved 2026-08-19 snapshot showed five Qwen3.8-27B providers on OpenRouter; a later same-day live page showed six, and the endpoint API later returned seven. LM Studio displayed 908,400 local downloads, and OpenRouter reported approximately 24.60 billion prompt-plus-completion tokens and 1.49 million requests for 2026-08-18. This supports both local and hosted activity with fast-changing early listed supply. It does not prove scarce qualified supply, durable customer demand, hardware fit, achievable differentiation, or positive unit economics.
- **Measurement scope:** OpenRouter is enough as the hosted-demand spine for a first radar whose decision is what to serve and pitch to OpenRouter. It is not a total-market estimate. Local distribution and other-gateway catalogs are required before generalizing the result.
- **Radar scope:** The automated model-opportunity radar stops at L3, potential opportunity. It uses separate launch and structural-gap lanes. OpenRouter can partly measure long-context and tool-calling demand through filtered rankings, but public data cannot confirm unmet demand. L4 requires manual gateway, customer, or provider evidence. Hardware matching, serving benchmarks, and unit economics require a separate later evidence pass.
- **Radar validation:** The final expanded V0 live workflow completed all 330 planned operations, including 68 source calls and 228 raw imports. It produced 23 L1 demand-signal records plus one L0 watch record. Qwen3.8-27B was L1 with exact paid-demand rank 44 in the tested 100K-context profile; Qwen3-8B was the L0 control. No candidate reached L2 or L3 because there was only one supply day, one local-download day, and no approved workload profile. The workflow succeeded, but evidence completeness remains false. The initial nine-L1 and one-L0 checkpoint is preserved in the validation note as superseded history.
- **Gateway taxonomy:** There are two main types. Centrally curated gateways select providers through public or private intake; this includes OpenRouter, Hugging Face, Vercel, and Requesty. Customer-configured gateways such as Cloudflare and Portkey have no central listing gate; the provider must win customers instead.
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
- [[the-build-launch-apply-playbook-generalizes-only-to-curated-supply-marketplaces|The build-launch-apply playbook generalizes only to curated supply marketplaces]]
- [[waferpass-pooled-capped-subscription-demand-with-elastic-gpu-rentals-but-its-listing-role-is-unproven|WaferPass pooled capped subscription demand with elastic GPU rentals, but its listing role is unproven]]
- [[a-capped-retail-pass-can-turn-a-paid-provider-launch-into-measurable-demand|A capped retail pass can turn a paid provider launch into measurable demand]]
- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- [[wafer-entered-opencodes-open-provider-catalog-five-days-after-waferpass-launched|Wafer entered OpenCode's open provider catalog five days after WaferPass launched]]
- [[openrouters-proprietary-model-priority-weakens-the-common-open-weight-provider-path|OpenRouter's proprietary-model priority weakens the common open-weight provider path]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[openrouter-is-enough-for-a-listing-radar-not-a-market-demand-estimate|OpenRouter is enough for a listing radar, not a market-demand estimate]]

## Active Projects

- [[how-to-get-listed-on-openrouter-article-draft-v1|How to get listed on OpenRouter as an inference provider]]: complete first draft of the seven-step operator playbook, backed by the [[how-to-get-listed-on-openrouter-article-skeleton|claim ledger and skeleton]].

- **Active:** [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] has a live-tested V0 collection and reporting spine. The next project stage is to automate and harden recurring collection so the radar continuously records market state and builds reliable history. Quantitative, workload-specific under-service rules come after that collection stage is stable.

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
- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]: current official evidence on gap priority, technical readiness, post-listing routing, social inbound, provider roles, and the remaining causal gaps.
- [[inference-gateway-provider-onboarding-models-2026-08-19|Inference gateway provider-onboarding models]]: comparison of centrally curated and customer-configured gateways, including public and private intake subtypes.
- [[waferpass-bootstrap-public-evidence-check-2026-08-19|WaferPass bootstrap hypothesis and public evidence check]]: public plan terms, elastic-capacity structure, current OpenRouter listing, and the missing causal link between subscription demand and provider acceptance.
- [[waferpass-anthropic-openclaw-event-timeline-2026-08-19|WaferPass and the Anthropic/OpenClaw event timeline]]: the close launch timing, direct user targeting, correction to the company-start claim, and missing evidence of causation.
- [[modelsdev-wafer-provider-pr-1488-2026-04-20|Models.dev Wafer provider pull request]]: exact models, limits, endpoint metadata, contributor interaction, five-day launch-to-merge timing, and the boundary between client catalogs and curated gateways.
- [[qwen3-8-27b-open-weights-release-date-2026-08-14|Qwen3.8-27B open-weight release record]]: official confirmation that the model weights became available on Hugging Face Hub and ModelScope on 2026-08-14.
- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]: official public sources for model tokens, provider supply, serving performance, local downloads, and their measurement limits.
- [[inference-opportunity-radar-pre-scope-design-audit-2026-08-19|Inference opportunity radar pre-scope audit]]: corrected evidence gates, field-level demand limits, the supply-history cold start, and the minimum collection scope.
- [[inference-opportunity-radar-v0-live-validation-2026-08-20|Inference opportunity radar V0 live validation]]: first live run, labels, database counts, retrodiction limits, API constraints, and dashboard disagreements.

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
- Did WaferPass subscription traffic create operating proof or demand history that helped Wafer become a gateway provider, and why did Wafer later stop promoting the Pass?

## Next Tests

- Benchmark one open model and one defined workload across serving engines and hardware. Measure time to first token, output speed, total latency, GPU memory, error rate, and cost per million tokens.
- Re-run the memory-bandwidth pricing test with current posted prices, more providers, and achieved workload performance. Keep price and utilization as separate variables.
- Select one customer type and collect real prompt lengths, output lengths, concurrency, latency limits, traffic variation, reliability needs, geography, and budget before selecting hardware.
- Build a rent-versus-control model from observed workload data. Include all operating costs, conservative utilization, downtime, financing, and resale downside.
- Ask inference infrastructure and finance leaders for factual receipts on legal ownership, utilization before and after conversion, realized all-in cost, expansion after the first deployment, and remaining burst-cloud share.
- Verify the OpenRouter provider requirements and routing rules against primary documentation. Then run one live model-gap scan that combines token demand, provider count, price, latency, throughput, uptime, and tool-call success.
- Run and document a real provider application. Record the channel, contacts, elapsed time, review requests, technical tests, decision, and post-listing traffic as separate evidence.
- Run one measured provider launch: ship a gap-filling endpoint, publish reproducible statistics, use a defined paid X budget, apply to relevant gateways, and track public traffic, gateway tests, responses, acceptance, and routed traffic as separate outcomes.
- As an optional paid-launch amplifier, test a capped self-serve plan or prepaid-credit offer on a small retail cohort. Measure whether it creates more visible use and gateway attention, while tracking workload shape, cost, and reliability. Keep gateway test traffic separate.
- Maintain an event watchlist for policy, price, quota, outage, model-removal, license, geography, and agent-client changes. Predefine the affected user, replacement requirement, serviceable model, edge, and launch assets for each event.
- Submit stable endpoints to relevant open client catalogs during the launch window. Track direct keys and client-specific use separately from curated-gateway applications and routed demand.
- Do not gate the generic review-ready endpoint on pre-approval. During the build, confirm partner intake and the target gap. Gate gateway-specific work and large capacity commitments on stronger demand or partner evidence.
- Classify each target gateway before outreach. Record whether it is centrally curated or customer-configured. For centrally curated gateways, record whether provider intake is public or private.
- Reconstruct Wafer's timeline from WaferPass launch through OpenRouter listing. Ask Wafer for subscriber usage distribution, request-cap logic, spot-versus-dedicated capacity, gross-margin history, and what evidence OpenRouter reviewed.
- Continue the Qwen3.8-27B gap scan. Measure OpenRouter activity, paid API intent, provider changes, application mix, tool-call success, and the visible price, throughput, latency, uptime, long-context, privacy, and geography frontier. Stop at a potential-opportunity finding. Test our ability to compete only in a separate later project.
- Automate one daily model-opportunity radar run with preserved dated evidence, incomplete-stage detection, stale-data reporting, and safe reruns. Continue until each mapped model has three endpoint capture days across seven calendar days and two Hugging Face capture days. Then define one justified quantitative workload profile and re-run the gates. Treat the earlier GLM-5.2 provider-count difference as unconfirmed until a model-level provider-organization cross-check exists.

## Related Areas

- [[gpu-finance|GPU Finance]]: financing, collateral, contracts, capacity ownership, utilization risk, and residual value. Inference is a peer area, not a GPU Finance subproject.
