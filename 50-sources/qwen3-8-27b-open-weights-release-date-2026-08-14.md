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
tags: [exa, qwen3-8-27b, model-release, open-weights, event-zero]
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

## Primary Sources

- [Official Qwen3.8 repository and dated news](https://github.com/QwenLM/Qwen3.8)
- [Official Qwen3.8-27B model card](https://huggingface.co/Qwen/Qwen3.8-27B)

## Links

- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- [[inference|Inference]]
