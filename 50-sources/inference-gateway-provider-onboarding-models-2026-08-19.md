---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: web-research
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: []
orgs: [openrouter, hugging-face, vercel, cloudflare, portkey, requesty]
tags: [gateway-taxonomy, provider-listing, provider-onboarding, custom-providers, distribution]
---

# Inference gateway provider-onboarding models

## Research Question

Can the OpenRouter build, launch, apply, and business-development strategy be generalized to other inference gateways?

## Bottom Line

The full strategy generalizes to curated supply marketplaces that select third-party inference providers and route paid demand to them. It only partly generalizes to partner catalogs, and it does not describe customer-configured gateways where users can add any custom endpoint.

## Gateway Types

### Curated supply marketplaces

These gateways select providers, integrate their endpoints, handle billing or routing, and can send marketplace demand.

- **OpenRouter:** The full playbook applies. Its public application requires a review-ready endpoint and prioritizes providers that fill network gaps.
- **Hugging Face Inference Providers:** Much of the playbook applies. [Hugging Face's provider-registration guide](https://huggingface.co/docs/inference-providers/register-as-a-provider) requires standard task APIs, JavaScript and Python client integrations, model mapping, billing, server-side enablement, provider documentation, and launch communication. A Team or Enterprise organization is required for model mapping. The guide invites direct contact and social outreach.

Hugging Face does not publish the same network-gap priority as OpenRouter. Public implementation work also does not guarantee server-side partner selection.

### Curated partner catalogs

These gateways expose a catalog of approved providers, but the public provider-side intake path can be private or partner-led.

- **Vercel AI Gateway:** [Vercel's public gateway documentation](https://vercel.com/docs/ai-gateway/models-and-providers) shows a provider catalog, model discovery, routing, and Bring Your Own Key support. [Its provider installation guide](https://vercel.com/docs/agent-resources/integrations-for-models/adding-a-provider) explains how a customer installs an approved provider. The current search found no public provider application that explains how a new inference service enters the central AI Gateway catalog.
- **Requesty:** [Requesty's public documentation](https://docs.requesty.ai/features/supported-models) exposes a large managed model catalog and buyer-side routing. The current search found no public third-party provider-onboarding guide.

For this group, a public endpoint and measurable edge remain useful. Direct partnership work is probably more important than a formal public application because no such intake path was found. The selection criteria and value of a paid public launch remain unknown.

### Customer-configured gateways

These products let each customer route to a custom endpoint. They do not create one central listing gate or guaranteed marketplace demand.

- **Cloudflare AI Gateway:** [Cloudflare's custom-provider documentation](https://developers.cloudflare.com/ai-gateway/configuration/custom-providers/) lets a customer configure any provider with an HTTPS endpoint. OpenAI-compatible endpoints can use the unified API.
- **Portkey:** [Portkey's custom-endpoint documentation](https://docs.portkey.ai/docs/api-reference/inference-api/gateway-for-other-apis) lets customers route through privately hosted or other custom provider endpoints.
- **LiteLLM and similar self-hosted routers:** The customer controls the provider configuration. There is no central marketplace approval.

For this group, “get listed” is the wrong objective. The provider must publish integration instructions, win customers, and get those customers to configure the endpoint.

## Generalization Matrix

| Strategy component | Curated marketplace | Curated partner catalog | Customer-configured gateway |
| --- | --- | --- | --- |
| Build a review-ready public endpoint | Required | Usually useful | Required for customer use |
| Fill a gateway supply gap | Often useful; directly stated by OpenRouter | Possibly useful; criteria private | Not a central selection factor |
| Formal provider application | Yes when published | Often private or unavailable | No |
| Direct gateway business development | Useful | Usually central | Secondary to customer sales |
| Public launch and paid amplification | Testable attention tactic | Testable attention tactic | Customer acquisition tactic |
| Central gateway listing brings demand | Yes, if accepted and routed | Possible | No |

## Evidence Boundaries

- **Direct evidence:** OpenRouter and Hugging Face publish provider-side technical onboarding requirements.
- **Direct evidence:** Cloudflare and Portkey let customers configure custom endpoints without a central provider-selection event.
- **Scoped search result:** The current pass found buyer-side Vercel and Requesty documentation but no public provider application for entering their central catalogs.
- **Reasonable inference:** Build-first execution plus parallel business development is the best transfer strategy for curated marketplaces and partner catalogs.
- **Open speculation:** Gap-filling, a day-zero launch, social tags, or paid reach improves acceptance outside OpenRouter.

## Links

- [[the-build-launch-apply-playbook-generalizes-only-to-curated-supply-marketplaces|The build-launch-apply playbook generalizes only to curated supply marketplaces]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- [[featherless-reached-hugging-face-through-a-coordinated-provider-integration|Featherless reached Hugging Face through a coordinated provider integration]]
- [[inference|Inference]]
