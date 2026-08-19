---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-14
source_type: web-research
domains: [inference, model-serving, inference-distribution]
people: []
orgs: [qwen, openrouter, hugging-face, lm-studio]
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
- **Still not established:** first API availability, first production provider, exact gateway-listing dates, demand durability, customer concentration, or a defensible new-provider edge.

## Action Relevance

On 2026-08-19, the release was five days old. It was therefore a current candidate for the event-zero provider test: measure demand, dated endpoint and provider counts, qualified supply for a named workload, gateway coverage, price, latency, throughput, context limits, uptime, and tool-call reliability before deciding whether a service gap exists.

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

## OpenRouter Activity Check

A later check of the [public OpenRouter model page](https://openrouter.ai/qwen/qwen3.8-27b) on 2026-08-19 found machine-readable daily activity embedded in the page.

| UTC day | Prompt tokens | Completion tokens | Prompt plus completion | Requests |
| --- | ---: | ---: | ---: | ---: |
| 2026-08-15 | 2.97B | 158.3M | 3.13B | 201,581 |
| 2026-08-16 | 9.38B | 570.0M | 9.95B | 546,476 |
| 2026-08-17 | 10.34B | 803.7M | 11.14B | 540,586 |
| 2026-08-18 | 21.67B | 2.93B | 24.60B | 1,492,286 |

The 2026-08-19 row was partial when checked and is excluded from the complete-day comparison.

The page also listed Hermes Agent, pi, Qwen Code, omp, and bcode as its five largest visible public applications. OpenRouter's public application data excludes private and hidden applications.

**Evidence boundary:** This is direct evidence of rapid hosted use on OpenRouter. It does not identify unique users, invoices, provider-level routing share, customer concentration, promotion effects, or whether the launch spike will persist. It supports a potential-opportunity flag, not a claim that our hardware can win traffic or earn a positive margin.

## Local-Inference Activity Check

An Exa search on 2026-08-19 found a strong local-use signal:

- The [LM Studio Qwen3.8-27B page](https://lmstudio.ai/models/qwen/qwen3.8-27b) displayed 908,400 downloads and 41 stars. It listed GGUF and MLX sources and a minimum system-memory figure of 16 GB.
- The older [LM Studio Qwen3.6-27B page](https://lmstudio.ai/models/qwen/qwen3.6-27b) displayed 1.4 million downloads in the same search pass.
- The Hugging Face API showed 4,318,134 downloads for `unsloth/Qwen3.8-27B-GGUF`, 1,098,016 for `lmstudio-community/Qwen3.8-27B-GGUF`, and 1,006,235 for `Qwen/Qwen3.8-27B` when checked. These repositories also had 1,982, 26, and 11,413 likes, respectively.
- The [Bartowski GGUF repository](https://huggingface.co/bartowski/Qwen3.8-27B-GGUF) offered many local quantizations. Its recommended Q4_K_M file was 17.77 GB.

**Evidence boundary:** Hugging Face states that its model-download metric counts qualifying HTTP requests. It does not count unique users. All GGUF file requests count, and a full repository clone can produce more than one counted download. The repository figures therefore must not be summed as unique adoption. See [Hugging Face's download-stat definition](https://huggingface.co/docs/hub/en/models-download-stats).

**Source claim:** Dylan reported that Jakub Janiak said many people like to run this model locally. The public local-download activity supports that direction, but it does not identify the users or why they chose local execution.

**Reasonable inference:** High local activity and high early OpenRouter activity make this a useful demand-adjusted gap candidate. The preserved screenshot showed five providers, while a later same-day live page showed six. A later check of OpenRouter's endpoint API on 2026-08-19 returned seven providers: Chutes, AkashML, Venice, Parasail, Reka, io.net, and Alibaba. Raw provider count does not prove scarce qualified supply. Further market research should test demand persistence, supply growth, application mix, and the qualified provider frontier for a named workload. Whether our hardware can compete is a separate question that has not been tested.

## Primary Sources

- [Official Qwen3.8 repository and dated news](https://github.com/QwenLM/Qwen3.8)
- [Official Qwen3.8-27B model card](https://huggingface.co/Qwen/Qwen3.8-27B)
- [LM Studio Qwen3.8-27B page](https://lmstudio.ai/models/qwen/qwen3.8-27b)
- [Hugging Face model download-stat definition](https://huggingface.co/docs/hub/en/models-download-stats)
- [OpenRouter Qwen3.8-27B page](https://openrouter.ai/qwen/qwen3.8-27b)

## Links

- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[inference|Inference]]
