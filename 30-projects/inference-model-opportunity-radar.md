---
type: project
status: active
created: 2026-08-19
updated: 2026-08-21
domains: [inference, model-serving, inference-marketplaces, market-research]
people: []
orgs: [openrouter, hugging-face, lm-studio, ollama, artificial-analysis]
tags: [dashboard, model-demand, provider-supply, performance, day-zero, opportunity-screen]
---

# Inference Model Opportunity Radar

## Objective

Build a daily dashboard that identifies open-weight models with:

1. strong current or expected demand;
2. scarce qualified serverless supply;
3. a visible market gap in price, performance, reliability, context, tools, privacy, or geography.

The radar should support both day-zero model launches and existing underserved models. It should flag potential opportunities. It should not claim that our hardware can serve them, that we can beat an existing provider, or that the opportunity has positive unit economics.

The current selection goal is narrower: find the smallest practical open-weight model with the strongest durable demand, then test whether it is the best model for an initial serving offer. “Smallest” is not yet defined. Raw parameter count, active parameters per token, weight memory, and the minimum hardware needed at a target context and speed can give different answers. The radar should preserve these measures separately rather than call one model optimal before the serving and economics tests exist.

## Current State

V0 was built and live-tested on 2026-08-20 as an internal command-line evidence collector. It stores append-only raw snapshots, normalizes demand and supply facts, expands a checked manual model map from current source evidence, evaluates 24 mapped models under the L0-L3 evidence gates, replays fixed historical cases without backdating current evidence, and writes deterministic reports and exports. A browser dashboard remains a later interface after the collection logic is validated.

The initial ten-model checkpoint completed 40 source calls, imported 96 raw snapshots, and produced nine L1 records plus one L0 control. The final expanded V0 validation superseded those counts as the current result. Its live workflow completed all 330 planned stage operations, including 68 source calls and 228 raw snapshot imports. It produced 23 L1 demand-signal records and one L0 watch record. No model reached L2 or L3 because the database still has only one supply capture day, one Hugging Face capture day, and no approved named workload profile. The workflow succeeded, while its separate `evidence_complete` flag correctly remained false. See [[inference-opportunity-radar-v0-live-validation-2026-08-20|the V0 live validation record]].

The public-data audit found enough information for a useful first version. OpenRouter supplies daily top-model token totals, exact filtered totals for context buckets and tool-calling requests, estimated weekly category totals, and endpoint-level provider information. Hugging Face, LM Studio, and Ollama provide local-adoption signals. Artificial Analysis provides independent benchmark, price, and performance data.

OpenRouter is sufficient as the primary hosted-demand surface for a version-zero tool focused on winning an OpenRouter listing. It is not a total-market measure. All usage fields must retain the `OpenRouter` label, and broader conclusions need local signals and cross-gateway supply checks.

The dashboard search also found that much of the general charting layer already exists. OpenRouter Inference Provider Market Share covers host share and model-provider competition. CodeSOTA covers model churn, substitution, lifecycle, and application demand. token.app covers prices and OpenRouter rankings. ParaPulse and Open LLM Distribution Leaderboard cover Hugging Face download trends. Artificial Analysis covers provider performance. The proposed radar should join these surfaces into candidate decisions instead of cloning them.

The live implementation confirmed that these surfaces do not all provide independent evidence. token.app republishes OpenRouter rankings. CodeSOTA is a benchmark registry rather than a demand or scarcity measure. Artificial Analysis adds performance and provider coverage, but it does not replace demand evidence. Dashboard disagreements must remain visible rather than averaged.

Project sequencing is now explicit. First, make the existing collection workflow automatic, repeatable, and reliable so it continuously records market state and builds supply history. Only after that collection has run cleanly through a useful history window should the project define quantitative, workload-specific rules for flagging under-served models. The first live run was a demand screen, not a supply-shortage test.

The revised target does not replace the collection stage. The existing demand history can rank hosted use, and the provider history can show supply and quality. The missing input is a checked model-footprint layer. The current V0 records model identity and raw Hugging Face weight-file facts, but it does not normalize total parameters, active parameters for mixture-of-experts models, weight memory, or the minimum serving configuration. The first useful result should therefore be a demand-versus-size frontier, not one unsupported score.

## Core Views

### Release Radar

- model, lab, release time, country, license, architecture, parameter count, context, and modalities;
- prior-family demand;
- first-day local download velocity;
- hours to first, fifth, and tenth gateway provider; and
- price and performance frontier after launch.

### Demand and Scarcity

- OpenRouter tokens over one, three, seven, and 30 days;
- context-bucket demand for 1K, 10K, 100K, 1M, and 10M requests;
- tool-calling demand and labeled estimated programming demand;
- local-adoption percentile;
- qualified provider count;
- demand multiplied by a scarcity score; and
- change in each measure.

### Local Versus Hosted

Classify models into high-local/high-hosted, high-local/low-hosted, low-local/high-hosted, and low-local/low-hosted groups. Treat high-local/low-hosted as a conversion hypothesis, not an automatic opportunity.

### Provider Frontier

For every provider-model endpoint, show:

- prompt, output, and cache prices;
- time to first token;
- output throughput;
- uptime;
- context and output limits;
- tool-call error rate;
- quantization;
- privacy and Zero Data Retention support;
- geography; and
- supported request parameters.

### Candidate Record

Each opportunity should have:

- one-sentence demand thesis;
- direct evidence, source claims, inference, and speculation kept separate;
- visible provider frontier and possible market gap;
- intended customer and workload;
- missing evidence; and
- next cheapest test.

## Initial Data Sources

- OpenRouter daily rankings, app rankings, task classifications, model list, model endpoints, and Performance tabs.
- Hugging Face Hub API, model and quant repositories, download definitions, likes, and trending score.
- LM Studio model pages.
- Ollama library pages.
- Artificial Analysis model and provider data, subject to access tier.
- Hugging Face Inference Providers mappings and provider performance fields.
- Vercel AI Gateway's public model and provider catalog.
- Existing OpenRouter dashboards as validation sources, not as the only raw-data dependency.
- Official model-lab GitHub news, Hugging Face collections, ModelScope releases, and X posts for event timing.

## Decision Logic

Use three independent opportunity signals:

1. **Demand:** hosted tokens, local adoption, target-use share, and release momentum.
2. **Scarcity:** count only providers that meet the target workload's context, reliability, tools, privacy, and geography requirements.
3. **Visible gap:** record where current supply appears weak or narrow without claiming that we can fill the gap.

Use two lanes. The **launch lane** uses expected demand, earlier-family demand, release attention, and day-zero supply. It can reach L1 or provisional L2 before history exists. The **structural-gap lane** uses observed demand, a named workload, supply history, attribute-specific demand where available, and public friction evidence. It can reach L3.

Do not use one universal workload profile. A provider qualifies only against written requirements that come from observed demand, a named customer need, or an explicit research hypothesis. Store quantization and Auto Exacto evidence as facts, not universal pass-or-fail rules.

Use qualified provider-organization count for a named workload profile, not raw endpoint count. Within a comparable profile, more qualified supply should reduce priority. If no profile exists, show raw endpoint and provider counts as descriptive facts only. Do not use raw provider count as proof of scarcity.

## Scope Boundary

The automated radar ends with a ranked potential-opportunity list at L3 and an evidence record. L4, confirmed underserved, requires a manual gateway, customer, or provider evidence record. Hardware fit, serving-engine performance, achievable differentiation, capacity planning, and unit economics are separate downstream work. They should begin only after we have a real serving configuration to test.

## V0 Scope

Start with OpenRouter as the hosted-demand spine and text-generation models only. This scope is enough to choose an OpenRouter listing target. It is not enough to estimate total inference demand.

1. Take a daily snapshot of the top-50 token dataset for total traffic, each context bucket, tool-calling traffic, and labeled estimated programming traffic.
2. Take a daily snapshot of the model list and endpoint list.
3. Map the top open-weight models to Hugging Face repositories and local-tool pages.
4. Calculate release age, token velocity, attribute-specific demand where observable, local-download velocity, qualified provider count for named profiles, and frontier gaps.
5. Produce one ranked table and one local-versus-hosted quadrant.
6. Compare results with existing OpenRouter, Hugging Face, and performance dashboards.
7. Manually review the top ten candidates before any build decision.

The first version should not scrape every gateway or build a universal market estimate. OpenRouter is the first measurable hosted-demand surface.

## Open Questions

- Does OpenRouter's top-50 dataset contain enough open models to generate useful daily candidates?
- Can provider count and endpoint metrics be stored under the public data terms at the required frequency?
- What is the cleanest canonical mapping across official, GGUF, MLX, and fine-tuned model repositories?
- Which local source has the most stable downloadable metric and access method?
- How should the score handle models outside the daily top 50?
- Can public app and task-classification data identify coding and agent demand for a specific model?
- How much useful model coverage remains after each context-bucket and tool-calling query applies its own top-50 cutoff?
- What evidence threshold is sufficient to promote a model from watchlist to potential opportunity?
- Can existing dashboard data be reused legally and reliably, or should it be used only for validation against official sources?
- How often do unofficial OpenRouter scrapers miss a new model or break when a provider page changes?
- Should “smallest” mean total parameters, active parameters per token, model-weight memory, or the minimum hardware needed to meet one defined serving target?
- Which models sit on the demand-versus-size frontier, where no smaller measured model has more durable demand?

## Next Tests

- Automate one daily run of the existing collection workflow. Preserve each dated run, detect incomplete stages, report stale data, and make reruns safe without replacing earlier evidence.
- Add checked model-size facts without extracting parameter counts from model names. Keep total parameters, active parameters, weight bytes, quantization, and estimated serving memory separate, with unknown values left unknown.
- Produce a demand-versus-size frontier after the collection schedule is stable. Do not choose one optimal model until a target workload and minimum serving performance are defined.
- Keep the automatic collection running until each model has at least three UTC endpoint-capture days across a seven-day span.
- Collect a second Hugging Face capture day before calculating local-download change.
- After the collection workflow is stable, write one named workload profile and a quantitative provider threshold only when each requirement has a customer, observed-demand, or explicit research-hypothesis basis.
- Find a model-level provider-organization cross-check before treating the earlier GLM-5.2 count difference as a real disagreement; the current provider-wide dashboard is not comparable.
- Add the browser dashboard only after the command-line reports remain stable through the first history window.
- Keep hardware fit, achievable serving performance, capacity planning, and unit economics in a separate downstream test.

## Sources

- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]
- [[inference-opportunity-radar-pre-scope-design-audit-2026-08-19|Pre-scope design audit: evidence gates, data feasibility, and V0 scope]]
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]
- [[dave-friedman-hugging-face-downloads-compute-markets-2026-07-09|Dave Friedman: Hugging Face downloads and compute markets]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[inference-opportunity-radar-v0-live-validation-2026-08-20|Inference opportunity radar V0 live validation]]

## Related Areas

- [[inference|Inference]]
- [[gpu-finance|GPU Finance]]

## Updates

- 2026-08-21: Dylan narrowed the practical selection goal to finding the smallest model with the strongest demand, if the choice can be justified as optimal. The project now treats this as a demand-versus-size frontier first. It does not treat raw parameter count as a complete serving-cost measure, especially for mixture-of-experts models. The current radar can supply demand and provider evidence, but it still needs checked model-footprint facts and a later hardware benchmark before it can justify one model as optimal.
- 2026-08-20: Dylan set the next project order. First automate and harden recurring market-data collection so the radar builds reliable history. Then define quantitative, workload-specific under-service rules. The initial 23 L1 results remain demand signals only, not supply-shortage findings.
- 2026-08-20: SUPERSEDED the initial ten-model live counts as the final V0 result. Run `run-20260820T144305.290706Z` completed all 330 planned operations: 68 source calls, 228 raw imports, 24 evaluations, three retrodictions, and seven report-output groups. All 228 snapshot envelopes matched the SQLite manifest, a second import left every table count unchanged, 103 immutable run artifacts matched their stored hashes and byte counts, and no credential was present. The final labels were 23 L1 and one L0. Evidence completeness remained false only because supply history, local-download history, and a named workload profile are still missing. The four durable dashboard checks are `not_comparable`; they supersede the earlier informal GLM-5.2 disagreement claim.
- 2026-08-20: Initial live checkpoint, later superseded as the final V0 count. All planned source calls completed. The run stored 96 validated raw snapshots and produced nine L1 demand-signal records plus one L0 control. No L2 or L3 label was supported because supply history, local-download history, and a named workload profile were missing. Retrodiction correctly refused to use current snapshots as historical evidence. The informal dashboard pass reported one possible GLM-5.2 provider-count disagreement and confirmed that token.app is not an independent demand source.
- 2026-08-19: Scope correction from Dylan. The radar now stops at potential-opportunity identification. Hardware fit, a realizable serving edge, and unit economics are separate later validation stages because the team has not yet proved its hardware or serving performance.
- 2026-08-19: Pre-scope design audit completed and corrected. Verdict: build the collection spine now and cap automated labels at potential opportunity (L3). Missing official endpoint history is a cold-start limit, not a blocker. OpenRouter's current rankings API partly measures attribute demand through exact context-bucket and tool-calling filters plus sampled weekly categories. Universal workload thresholds were removed. L4 remains a manual BD or customer outcome. The Datasets endpoints are licensed CC BY 4.0 with a required citation string. See [[inference-opportunity-radar-pre-scope-design-audit-2026-08-19|the pre-scope design audit]] for the evidence gates, data limits, and week-1 tests.
