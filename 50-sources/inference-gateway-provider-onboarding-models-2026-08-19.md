---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: web-research
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: []
orgs: [openrouter, hugging-face, vercel, cloudflare, portkey, requesty, opencode, models-dev]
tags: [gateway-taxonomy, provider-listing, provider-onboarding, custom-providers, distribution]
---

# Inference gateway provider-onboarding models

## Research Question

Can the OpenRouter build, launch, apply, and business-development strategy be generalized to other inference gateways?

## Bottom Line

There are two main gateway types for this decision: centrally curated gateways and customer-configured gateways. A private partner catalog is a centrally curated gateway with private or partner-led intake, not a separate type.

The full strategy generalizes to centrally curated gateways that select third-party inference providers. The exact application and distribution mechanics can still differ. It does not describe customer-configured gateways where users can add any custom endpoint.

Open client catalogs are an adjacent distribution surface, not a third gateway type. They can make a provider discoverable in a client while each user still brings a direct provider key.

## Gateway Types

### Centrally curated gateways

These gateways select providers, integrate their endpoints, handle billing or routing, and can send marketplace demand.

Their provider intake can be public or private.

#### Public or documented intake

- **OpenRouter:** The full playbook applies. Its public application requires a review-ready endpoint and prioritizes providers that fill network gaps.
- **Hugging Face Inference Providers:** Much of the playbook applies. [Hugging Face's provider-registration guide](https://huggingface.co/docs/inference-providers/register-as-a-provider) requires standard task APIs, JavaScript and Python client integrations, model mapping, billing, server-side enablement, provider documentation, and launch communication. A Team or Enterprise organization is required for model mapping. The guide invites direct contact and social outreach.

Hugging Face does not publish the same network-gap priority as OpenRouter. Public implementation work also does not guarantee server-side partner selection.

#### Private or partner-led intake

These gateways still expose a centrally approved provider catalog, but the provider-side intake path can be private or partner-led.

- **Vercel AI Gateway:** [Vercel's public gateway documentation](https://vercel.com/docs/ai-gateway/models-and-providers) shows a provider catalog, model discovery, routing, and Bring Your Own Key support. [Its provider installation guide](https://vercel.com/docs/agent-resources/integrations-for-models/adding-a-provider) explains how a customer installs an approved provider. The current search found no public provider application that explains how a new inference service enters the central AI Gateway catalog.
- **Requesty:** [Requesty's public documentation](https://docs.requesty.ai/features/supported-models) exposes a large managed model catalog and buyer-side routing. The current search found no public third-party provider-onboarding guide.

For this subtype, a public endpoint and measurable edge remain useful. Direct partnership work is probably more important than a formal public application because no such intake path was found. The selection criteria and value of a paid public launch remain unknown.

### Customer-configured gateways

These products let each customer route to a custom endpoint. They do not create one central listing gate or guaranteed marketplace demand.

- **Cloudflare AI Gateway:** [Cloudflare's custom-provider documentation](https://developers.cloudflare.com/ai-gateway/configuration/custom-providers/) lets a customer configure any provider with an HTTPS endpoint. OpenAI-compatible endpoints can use the unified API.
- **Portkey:** [Portkey's custom-endpoint documentation](https://docs.portkey.ai/docs/api-reference/inference-api/gateway-for-other-apis) lets customers route through privately hosted or other custom provider endpoints.
- **LiteLLM and similar self-hosted routers:** The customer controls the provider configuration. There is no central marketplace approval.

For this group, “get listed” is the wrong objective. The provider must publish integration instructions, win customers, and get those customers to configure the endpoint.

### Open client and provider catalogs

OpenCode uses Models.dev for provider and model discovery. Its contribution guide tells a new provider to first make a Models.dev pull request. Once merged, the provider can appear in OpenCode, but users still authenticate with the provider's own API key.

Wafer is a direct case. WaferPass launched on April 15, 2026. A contributor opened the Wafer Models.dev entry on April 18, and a collaborator merged it on April 20. The entry added the API base URL, authentication variable, documentation, two model IDs, limits, capabilities, and price metadata.

This process offers client distribution without a commercial gateway supply agreement. It can support customer acquisition and later business development, but it does not create centralized marketplace routing or prove curated-gateway acceptance.

## Generalization Matrix

| Strategy component | Centrally curated gateway | Customer-configured gateway |
| --- | --- | --- |
| Build a review-ready public endpoint | Required or strongly useful | Required for customer use |
| Fill a gateway supply gap | Often useful; directly stated by OpenRouter | Not a central selection factor |
| Provider intake | Public form, documented process, or private partnership | No central intake |
| Direct gateway business development | Useful; central when intake is private | Secondary to customer sales |
| Public launch and paid amplification | Testable attention tactic | Customer acquisition tactic |
| Central gateway listing can bring demand | Yes, depending on routing and commercial model | No |

Open client catalogs sit beside this matrix. They can improve discovery and setup for Bring Your Own Key users, but they do not act as a central buyer or router of inference supply.

## Evidence Boundaries

- **Direct evidence:** OpenRouter and Hugging Face publish provider-side technical onboarding requirements.
- **Direct evidence:** Cloudflare and Portkey let customers configure custom endpoints without a central provider-selection event.
- **Direct evidence:** OpenCode uses Models.dev for provider support. Wafer entered that open catalog through a public pull request five days after WaferPass launched.
- **Scoped search result:** The current pass found buyer-side Vercel and Requesty documentation but no public provider application for entering their central catalogs.
- **Reasonable inference:** Build-first execution plus parallel business development is the best transfer strategy for centrally curated gateways, whether intake is public or private.
- **Open speculation:** Gap-filling, a day-zero launch, social tags, or paid reach improves acceptance outside OpenRouter.

## Updates

- 2026-08-19: Corrected the taxonomy after Dylan noted that private partner catalogs and curated supply marketplaces share the same central provider-selection gate. Kept public versus private intake as subtypes.
- 2026-08-19: Added open client catalogs as an adjacent distribution surface after verifying Wafer's five-day Models.dev integration for OpenCode. Kept it outside the gateway taxonomy because users bring their own provider keys.

## Links

- [[the-build-launch-apply-playbook-generalizes-only-to-curated-supply-marketplaces|The build-launch-apply playbook generalizes only to curated supply marketplaces]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- [[featherless-reached-hugging-face-through-a-coordinated-provider-integration|Featherless reached Hugging Face through a coordinated provider integration]]
- [[wafer-entered-opencodes-open-provider-catalog-five-days-after-waferpass-launched|Wafer entered OpenCode's open provider catalog five days after WaferPass launched]]
- [[inference|Inference]]
