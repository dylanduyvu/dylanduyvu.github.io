---
type: insight
status: distilled
created: 2026-08-19
updated: 2026-08-19
confidence: medium-high
domains: [inference, inference-marketplaces, distribution, go-to-market]
projects: []
sources: [inference-gateway-provider-onboarding-models-2026-08-19, openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19, exa-featherless-hugging-face-provider-onboarding-audit-2026-08-18, modelsdev-wafer-provider-pr-1488-2026-04-20]
people: []
orgs: [openrouter, hugging-face, vercel, cloudflare, portkey, requesty, opencode, models-dev, wafer-ai]
aliases: [gateway listing strategy depends on gateway type, not every gateway has a provider listing gate]
tags: [gateway-taxonomy, provider-listing, custom-providers, distribution-strategy]
---

# The build-launch-apply playbook generalizes only to curated supply marketplaces

## Claim

The OpenRouter strategy of finding a supply gap, building a public endpoint, launching it, applying, and running gateway business development generalizes to gateways that select third-party inference providers and route marketplace demand to them. It does not generalize unchanged to all AI gateways.

For customer-configured gateways, there is no central provider listing to win. The provider must win customers and make the endpoint easy for those customers to configure.

Open client catalogs are separate from both gateway categories. A catalog listing can make the provider available inside a client, but the customer still brings a direct provider key. This is useful distribution, not centralized gateway demand.

## Why It Matters

“AI gateway” describes different businesses. Treating all of them as marketplaces can waste time on applications that do not exist and can mistake technical compatibility for distribution.

There are two main categories. The classification changes the go-to-market target:

- centrally curated gateway: win provider selection, integration, and routing;
- customer-configured gateway: win end customers who bring the endpoint into their own gateway.

Public application and private partner-led intake are two onboarding methods inside the centrally curated category. They are not separate gateway types.

## Evidence

- **Direct evidence:** OpenRouter has a reviewed provider application, technical requirements, test traffic, and a stated preference for network gaps.
- **Direct evidence:** Hugging Face publishes a provider-registration process with task APIs, client pull requests, model mapping, billing, server-side enablement, documentation, and communication.
- **Direct evidence:** Cloudflare and Portkey allow customers to configure custom HTTPS or privately hosted provider endpoints.
- **Direct evidence:** OpenCode uses Models.dev for provider discovery. Wafer entered that catalog through a public pull request five days after WaferPass launched.
- **Scoped search result:** Current Vercel and Requesty documentation explains customer access to approved provider catalogs. The search found no public provider application for entering those central catalogs.
- **Reasonable inference:** A review-ready endpoint and direct business development transfer across centrally curated gateways, but each gateway needs its own selection evidence and intake method.

## Implications

- Classify the gateway before building gateway-specific work.
- Do not assume that OpenRouter's network-gap priority applies to another gateway without a direct source.
- For Hugging Face, plan for client integrations, billing, server-side enablement, organization requirements, documentation, and launch work in addition to the endpoint.
- For Vercel or another centrally curated gateway with private intake, lead with the endpoint and user value, but expect a partnership path rather than a public form.
- For Cloudflare, Portkey, LiteLLM, and similar configurable gateways, publish setup guides and sell to customers. Gateway-team approval is not the bottleneck.
- For open client catalogs such as Models.dev as used by OpenCode, submit a complete provider entry as soon as the endpoint is stable. Count resulting direct users separately from gateway-routed demand.
- Count routed marketplace demand separately from technical availability through a custom-provider feature.

## Counterpoints / Uncertainty

- Gateway programs can change, and a private intake path can exist without public documentation.
- Vercel or Requesty can add a public provider program after this check.
- One company can operate several models at once, such as managed marketplace supply, Bring Your Own Key routing, and customer-configured endpoints.
- Public compatibility does not guarantee demand, preferred routing, payment, or a commercial partnership.
- An open client-catalog merge can look like a gateway listing even though no supply agreement or central routing exists.

## Links

- Source: [[inference-gateway-provider-onboarding-models-2026-08-19|Inference gateway provider-onboarding models]]
- OpenRouter strategy: [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- Hugging Face case: [[featherless-reached-hugging-face-through-a-coordinated-provider-integration|Featherless reached Hugging Face through a coordinated provider integration]]
- OpenCode catalog case: [[wafer-entered-opencodes-open-provider-catalog-five-days-after-waferpass-launched|Wafer entered OpenCode's open provider catalog five days after WaferPass launched]]
- Area: [[inference|Inference]]

## Updates

- 2026-08-19: Created after classifying OpenRouter, Hugging Face, Vercel, Requesty, Cloudflare, and Portkey by provider-onboarding model.
- 2026-08-19: Corrected the taxonomy from three main types to two. Private partner catalogs are centrally curated gateways with private intake, not a separate type.
- 2026-08-19: Added open client catalogs as an adjacent distribution surface after verifying Wafer's five-day Models.dev integration for OpenCode. Clarified that this did not create a curated gateway supply deal.
