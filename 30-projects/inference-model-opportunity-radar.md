---
type: project
status: proposed
created: 2026-08-19
updated: 2026-08-19
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
3. a visible service metric that a new provider can beat; and
4. plausible positive unit economics on available hardware.

The radar should support both day-zero model launches and existing underserved models.

## Current State

Proposed on 2026-08-19. No dashboard or automated collector has been built.

The public-data audit found enough information for a useful first version. OpenRouter supplies daily top-model token totals and endpoint-level provider information. Hugging Face, LM Studio, and Ollama provide local-adoption signals. Artificial Analysis provides independent benchmark, price, and performance data.

## Core Views

### Release Radar

- model, lab, release time, country, license, architecture, parameter count, context, and modalities;
- prior-family demand;
- first-day local download velocity;
- hours to first, fifth, and tenth gateway provider; and
- price and performance frontier after launch.

### Demand and Scarcity

- OpenRouter tokens over one, three, seven, and 30 days;
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
- service edge to beat;
- intended customer and workload;
- hardware and serving-engine assumption;
- estimated gross margin at conservative utilization;
- missing evidence; and
- next cheapest test.

## Initial Data Sources

- OpenRouter daily rankings, app rankings, task classifications, model list, model endpoints, and Performance tabs.
- Hugging Face Hub API, model and quant repositories, download definitions, likes, and trending score.
- LM Studio model pages.
- Ollama library pages.
- Artificial Analysis model and provider data, subject to access tier.
- Official model-lab GitHub news, Hugging Face collections, ModelScope releases, and X posts for event timing.

## Decision Logic

Use four independent gates:

1. **Demand:** hosted tokens, local adoption, target-use share, and release momentum.
2. **Scarcity:** count only providers that meet the target workload's context, reliability, tools, privacy, and geography requirements.
3. **Edge feasibility:** compare the intended endpoint with the best current provider on one important metric and minimum standards on the rest.
4. **Economics:** confirm achievable margin and capacity before a public build.

Provider count must reduce the opportunity score. Use demand divided by provider count or demand multiplied by `1 / provider_count`. Do not use literal demand multiplied by provider count.

## V0 Scope

Start with OpenRouter and text-generation models only.

1. Take a daily snapshot of the top-50 token dataset.
2. Take a daily snapshot of the model list and endpoint list.
3. Map the top open-weight models to Hugging Face repositories and local-tool pages.
4. Calculate release age, token velocity, local-download velocity, qualified provider count, and frontier gaps.
5. Produce one ranked table and one local-versus-hosted quadrant.
6. Manually review the top ten candidates before any build decision.

The first version should not scrape every gateway or build a universal market estimate. OpenRouter is the first measurable hosted-demand surface.

## Open Questions

- Does OpenRouter's top-50 dataset contain enough open models to generate useful daily candidates?
- Can provider count and endpoint metrics be stored under the public data terms at the required frequency?
- What is the cleanest canonical mapping across official, GGUF, MLX, and fine-tuned model repositories?
- Which local source has the most stable downloadable metric and access method?
- How should the score handle models outside the daily top 50?
- Can public app and task-classification data identify coding and agent demand for a specific model?
- Which hardware-cost source is accurate enough for the first unit-economics gate?

## Next Tests

- Pull 30 days of OpenRouter daily rankings and determine how many open-weight models appear.
- Build a one-day endpoint table for those models and calculate qualified provider count.
- Map ten models to Hugging Face, LM Studio, and Ollama by hand before automating identity resolution.
- Test the local-versus-hosted classification on Qwen3.8-27B, Qwen3.6-27B, GLM-5.1, and two weak-demand control models.
- Define the minimum service edge and economics fields needed before a model becomes a build candidate.

## Sources

- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]
- [[dave-friedman-hugging-face-downloads-compute-markets-2026-07-09|Dave Friedman: Hugging Face downloads and compute markets]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]

## Related Areas

- [[inference|Inference]]
- [[gpu-finance|GPU Finance]]
