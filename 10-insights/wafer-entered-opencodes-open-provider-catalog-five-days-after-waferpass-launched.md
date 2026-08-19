---
type: insight
status: distilled
created: 2026-08-19
updated: 2026-08-19
confidence: high
domains: [inference, distribution, go-to-market, developer-tools]
projects: []
sources: [modelsdev-wafer-provider-pr-1488-2026-04-20, waferpass-anthropic-openclaw-event-timeline-2026-08-19]
people: []
orgs: [wafer-ai, opencode, models-dev]
aliases: [wafer opencode listing, wafer models.dev provider integration]
tags: [waferpass, opencode, models-dev, provider-catalog, onboarding]
---

# Wafer entered OpenCode's open provider catalog five days after WaferPass launched

## Claim

WaferPass publicly launched on April 15, 2026, with GLM-5.1 and Qwen3.5 397B A17B. A contributor opened a Models.dev pull request for the Wafer provider on April 18, and a collaborator merged it on April 20. This made Wafer discoverable in OpenCode five days after the public launch.

This is the first fully public Wafer distribution-onboarding record found in the current research. It is not evidence of a curated gateway supply deal. OpenCode uses Models.dev as an open provider catalog, and the user supplies a Wafer API key.

## Why It Matters

The case gives the build-and-launch strategy one proven near-term distribution result. A new inference provider with a standard endpoint and complete model metadata can enter an open client catalog quickly. This can put the provider inside the tool used by its target customers while curated gateway applications remain uncertain.

It also prevents a category error. Client-catalog availability improves discovery and configuration. It does not guarantee centralized routing demand, payment by the gateway, a commercial contract, or later acceptance by OpenRouter or another curated marketplace.

## Evidence

- **Direct launch evidence:** Wafer's Product Hunt page dates WaferPass to April 15. A same-day founder announcement names GLM-5.1 and Qwen3.5 397B A17B as its initial inference models.
- **Direct onboarding evidence:** Models.dev pull request 1488 opened on April 18 and merged on April 20. Its provider entry used Wafer's public API, documentation, API-key variable, model limits, and flat-rate cost metadata.
- **Direct OpenCode process evidence:** OpenCode tells contributors to add new providers through Models.dev and uses the catalog for provider and model support.
- **Correction:** The public launch-to-merge interval was five days. The 13-day interval from GLM-5.1's April 7 base-model release to the merge is not evidence that Wafer launched as an inference provider on April 7.
- **Correction:** Zero token cost in the catalog represented the subscription price structure. WaferPass itself required payment.
- **Missing evidence:** The pull request does not identify a Wafer employee, show a commercial review, or report traffic after the merge.

## Implications

- Treat open client catalogs as a separate distribution surface from curated inference gateways.
- Submit complete provider metadata to open catalogs as soon as the public endpoint is stable.
- Use the same model IDs, limits, modalities, authentication, API base URL, and pricing semantics across the endpoint, documentation, and catalog entry.
- Publish a direct setup guide for the client and target its users during the launch.
- Track API-key creation and client-specific usage after the catalog merge. Catalog availability alone is not demand.
- Use the quick client integration as retail and operating proof during later curated-gateway business development, but do not call it a prior gateway acceptance.

## Counterpoints / Uncertainty

- An external contributor, not an identified Wafer employee, opened the pull request.
- The public record does not show whether Wafer asked for or supported the contribution.
- A five-day merge is one case and does not establish a standard review time.
- OpenCode or Models.dev can change its contribution and catalog process.
- The initial zero-cost metadata became outdated when Wafer later added per-token serverless pricing.

## Links

- Source: [[modelsdev-wafer-provider-pr-1488-2026-04-20|Models.dev PR 1488 added Wafer to OpenCode's provider catalog]]
- Event-zero strategy: [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- Gateway taxonomy: [[the-build-launch-apply-playbook-generalizes-only-to-curated-supply-marketplaces|The build-launch-apply playbook generalizes only to curated supply marketplaces]]
- Org: [[wafer-ai|Wafer AI]]
- Area: [[inference|Inference]]

## Updates

- 2026-08-19: Created from Dylan's Wafer model and OpenCode timeline claim, checked against the merged Models.dev pull request and OpenCode's contribution process. Corrected two weeks to five days from public launch and classified the result as an open client-catalog integration.
