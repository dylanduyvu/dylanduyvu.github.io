---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-04-20
source_type: github-pr
domains: [inference, distribution, go-to-market, developer-tools]
people: []
orgs: [wafer-ai, opencode, models-dev]
tags: [waferpass, opencode, models-dev, provider-catalog, onboarding]
---

# Models.dev PR 1488 added Wafer to OpenCode's provider catalog

## User Context

> qwen 3.5; glm 5.1 were the two models that wafer hosted then
>
> - GLM-5.1- 202.8K context, 131K output, zero cost
> - Qwen3.5 397B-A17B- 262K context, 65K output, zero cost
>
> then they got listed on opencode 2 weeks after launching these as their debut as an inference provider

## Primary Record

[Models.dev pull request 1488](https://github.com/anomalyco/models.dev/pull/1488), titled “Add wafer.ai provider,” was opened by GitHub contributor `Sewer56` on April 18, 2026, and merged on April 20. The public discussion shows one Models.dev collaborator thanking the contributor before the merge. It shows no commercial negotiation or Wafer business-development contact.

The pull request added:

- the Wafer provider name;
- `WAFER_API_KEY` authentication;
- the OpenAI-compatible `https://pass.wafer.ai/v1` API;
- a link to the WaferPass documentation;
- GLM-5.1 with a 202,752-token context window and 131,072-token maximum output; and
- Qwen3.5 397B A17B with a 262,144-token context window and 65,536-token maximum output.

The model files recorded zero input, output, cache-read, and cache-write token cost. This described the flat-rate subscription's marginal token price in OpenCode. It did not mean that WaferPass was free. Users still needed a paid Wafer account and their own Wafer API key.

## Timeline Correction

- **2026-04-15:** [Product Hunt](https://www.producthunt.com/products/wafer) records the public WaferPass launch. A [same-day founder announcement](https://www.linkedin.com/posts/emi-andere_two-updates-from-wafer-today-wafer-pass-activity-7450253205852299264-yNO7) names GLM-5.1 and Qwen3.5 397B A17B as its initial inference models.
- **2026-04-18:** The Models.dev provider pull request opened three days after the launch.
- **2026-04-20:** The pull request merged five days after the launch.

The initial GLM-5.1 model file used April 7 as the underlying model release date. April 7 to April 20 is 13 days, which can explain a “two weeks” description. However, the public evidence does not show that April 7 was Wafer's inference-provider launch date. Qwen3.5 397B A17B had an earlier February 16 model release date.

## What “Listed on OpenCode” Meant

[OpenCode's contribution guide](https://github.com/anomalyco/opencode/blob/dev/CONTRIBUTING.md) directs new providers to first make a pull request to Models.dev. OpenCode uses Models.dev as its provider and model catalog. A merged provider entry makes the provider discoverable and configurable in OpenCode.

This is a Bring Your Own Key integration. The customer supplies a Wafer API key, and requests go to Wafer's endpoint. The record does not show OpenCode buying inference supply, routing centrally purchased traffic, paying Wafer, or approving Wafer through a commercial provider program.

## Evidence Boundary

- **Direct evidence:** Wafer's initial OpenCode catalog entry used the two models and limits in Dylan's account.
- **Direct evidence:** The public launch-to-merge interval was five days. The pull request process, people, files, and merge are public.
- **Correction:** “Zero cost” was catalog metadata for marginal token charges under the subscription, not a free service.
- **Correction:** This was an open client catalog integration, not a curated inference-marketplace listing.
- **Reasonable inference:** A live standard endpoint, clear metadata, subscription access, and direct relevance to coding-harness users made the integration small and quick to review.
- **Open speculation:** Wafer staff requested the pull request, the listing produced material demand, or the OpenCode visibility later improved Wafer's odds with curated gateways.

## Links

- [[wafer-entered-opencodes-open-provider-catalog-five-days-after-waferpass-launched|Wafer entered OpenCode's open provider catalog five days after WaferPass launched]]
- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- [[inference-gateway-provider-onboarding-models-2026-08-19|Inference gateway provider-onboarding models]]
- [[wafer-ai|Wafer AI]]
- [[inference|Inference]]
