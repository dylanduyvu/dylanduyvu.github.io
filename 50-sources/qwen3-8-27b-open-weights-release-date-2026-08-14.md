---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-14
source_type: web-research
domains: [inference, model-serving, inference-distribution]
people: []
orgs: [qwen]
tags: [exa, qwen3-8-27b, model-release, open-weights, event-zero, local-inference, openrouter]
---

# Qwen3.8-27B open weights released on August 14, 2026

## Research Question

Dylan asked when Qwen3.8-27B dropped. The search used Exa and checked for an official model record instead of relying on third-party release calendars.

## Finding

**Direct evidence:** Qwen's official Qwen3.8 repository states that Qwen3.8-27B became available on Hugging Face Hub and ModelScope on 2026-08-14. This is the best release date for the public open weights.

The official Hugging Face model card is live under `Qwen/Qwen3.8-27B`.

The repository itself existed before this model release and contains news for several Qwen3.8 models. Its repository creation date is therefore not the Qwen3.8-27B release date.

## Evidence Boundary

- **Verified release date:** 2026-08-14.
- **Verified meaning:** public availability of the Qwen3.8-27B weights on Hugging Face Hub and ModelScope.
- **Not tested in this pass:** first API availability, first production provider, gateway-listing dates, launch demand, or provider coverage.

## Action Relevance

On 2026-08-19, the release was five days old. It was therefore a current candidate for the event-zero provider test: measure demand, provider count, gateway coverage, price, latency, throughput, context limits, uptime, and tool-call reliability before deciding whether a service gap exists.

## OpenRouter Supply Snapshot

Dylan supplied an OpenRouter screenshot taken at 2:28 PM on 2026-08-19.

**Direct evidence:** The page showed five providers: Chutes, AkashML, Venice, Reka AI, and io.net.

| Provider | Input / 1M | Output / 1M | Latency | Throughput | Uptime |
| --- | ---: | ---: | ---: | ---: | ---: |
| Chutes | $0.40 | $3.00 | 2.20 s | 26 tps | 97.99% |
| AkashML | $0.45 | $3.20 | 1.15 s | 39 tps | 98.66% |
| Venice | $0.45 | $3.20 | 0.70 s | 126 tps | 97.60% |
| Reka AI | $0.45 | $3.20 | 1.74 s | 48 tps | 98.94% |
| io.net | $0.48 | $3.40 | 0.98 s | 37 tps | 99.35% |

The screenshot showed a weighted average input price of $0.3213 and output price of $3.167 per million tokens. OpenRouter says the effective average can be below listed prices because of caching and discounts.

This is a point-in-time page observation. It does not show token demand, provider share, tool-call success, or whether users encountered capacity limits.

![[openrouter-qwen3-8-27b-providers-2026-08-19.png]]

## Local-Inference Activity Check

An Exa search on 2026-08-19 found a strong local-use signal:

- The [LM Studio Qwen3.8-27B page](https://lmstudio.ai/models/qwen/qwen3.8-27b) displayed 908,400 downloads and 41 stars. It listed GGUF and MLX sources and a minimum system-memory figure of 16 GB.
- The older [LM Studio Qwen3.6-27B page](https://lmstudio.ai/models/qwen/qwen3.6-27b) displayed 1.4 million downloads in the same search pass.
- The Hugging Face API showed 4,318,134 downloads for `unsloth/Qwen3.8-27B-GGUF`, 1,098,016 for `lmstudio-community/Qwen3.8-27B-GGUF`, and 1,006,235 for `Qwen/Qwen3.8-27B` when checked. These repositories also had 1,982, 26, and 11,413 likes, respectively.
- The [Bartowski GGUF repository](https://huggingface.co/bartowski/Qwen3.8-27B-GGUF) offered many local quantizations. Its recommended Q4_K_M file was 17.77 GB.

**Evidence boundary:** Hugging Face states that its model-download metric counts qualifying HTTP requests. It does not count unique users. All GGUF file requests count, and a full repository clone can produce more than one counted download. The repository figures therefore must not be summed as unique adoption. See [Hugging Face's download-stat definition](https://huggingface.co/docs/hub/en/models-download-stats).

**Source claim:** Dylan reported that Jakub Janiak said many people like to run this model locally. The public activity supports that direction, but it does not prove paid API demand.

**Reasonable inference:** High local activity combined with five visible OpenRouter providers makes this a useful demand-adjusted gap candidate. Local popularity can be a leading indicator of hosted demand, but it can also select for users who prefer privacy, ownership, or zero marginal token cost.

## Primary Sources

- [Official Qwen3.8 repository and dated news](https://github.com/QwenLM/Qwen3.8)
- [Official Qwen3.8-27B model card](https://huggingface.co/Qwen/Qwen3.8-27B)
- [LM Studio Qwen3.8-27B page](https://lmstudio.ai/models/qwen/qwen3.8-27b)
- [Hugging Face model download-stat definition](https://huggingface.co/docs/hub/en/models-download-stats)

## Links

- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[inference|Inference]]
