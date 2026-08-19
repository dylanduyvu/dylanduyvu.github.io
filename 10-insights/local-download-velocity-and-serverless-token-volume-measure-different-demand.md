---
type: insight
status: hypothesis
created: 2026-08-19
updated: 2026-08-19
confidence: medium
domains: [inference, model-serving, inference-marketplaces, market-research]
projects: [inference-model-opportunity-radar]
sources: [inference-model-opportunity-data-source-audit-2026-08-19, dave-friedman-hugging-face-downloads-compute-markets-2026-07-09]
people: []
orgs: [openrouter, hugging-face, lm-studio, ollama]
aliases: [local versus hosted model demand, model locality index]
tags: [downloads, tokens, local-inference, serverless-inference, demand-signals]
---

# Local download velocity and serverless token volume measure different demand

## Claim

Local-model downloads and serverless inference tokens should be treated as separate demand signals. Their age-adjusted ranks can classify a model as local-first, hosted-first, hybrid, or low-demand. Their raw values should not be divided into a literal conversion rate.

## Why It Matters

Provider count alone can mistake absent demand for scarce supply. Local download activity supplies an independent signal that users value a model. Serverless token volume shows that users are willing to send real workloads through a hosted API.

The difference between those signals can reveal a possible distribution gap. A model with high local velocity and low hosted use may have users who want an API but cannot find a good one. It may also have users who specifically prefer privacy, ownership, and zero marginal token charges. The dashboard cannot decide between those explanations without user or endpoint evidence.

## Evidence

- OpenRouter now provides daily total-token data for its top 50 public models, starting on 2025-01-01.
- Hugging Face exposes recent and all-time downloads, likes, trending score, model formats, and repository dates.
- LM Studio and Ollama display downloads or pulls for local model packages.
- Hugging Face defines downloads as qualifying file requests, not unique users or model executions. GGUF requests can double count a full repository download.
- OpenRouter states that different upstream tokenizers limit direct token comparisons across models.
- The Qwen3.8-27B case showed the usefulness of both signals: high local download activity and only five visible OpenRouter providers five days after release. Paid hosted demand remained unknown.

## Implications

- Normalize local and hosted metrics separately by model age and peer group.
- Use percentiles, ranks, or standardized scores instead of a raw downloads-to-tokens ratio.
- Treat absence from OpenRouter's daily top 50 as censored demand below the day's cutoff, not as zero.
- Aggregate quantized and converted repositories under a canonical model while retaining each channel's raw count. Do not sum them as unique users.
- Use a high-local, low-hosted result as a research trigger. Confirm conversion intent before committing capacity.
- Combine demand with a scarcity score such as `1 / provider_count`, then flag the result as a potential opportunity. Do not infer hardware fit, an achievable service edge, or positive unit economics from the radar.

## Counterpoints / Uncertainty

- OpenRouter may not represent demand on other gateways or direct provider APIs.
- Download bots, continuous integration, repeated pulls, and file formats can change local metrics.
- Serverless token volume can be concentrated in a few applications and may not be durable.
- Larger or more verbose models can produce more tokens for the same task.
- Local and hosted users may be different populations rather than two channels for the same users.

## Links

- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- [[inference|Inference]]

## Updates

- 2026-08-19: Initial capture from Dylan's proposal to compare local downloads with serverless inference tokens.
- 2026-08-19: Scope correction. The model-opportunity radar stops at potential-opportunity identification. Hardware fit, achievable differentiation, and unit economics require separate later evidence.
