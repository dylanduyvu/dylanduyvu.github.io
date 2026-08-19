---
type: insight
status: distilled
created: 2026-08-18
updated: 2026-08-18
confidence: medium
domains: [inference, model-serving, inference-marketplaces, compute-economics]
projects: []
sources: [dylan-shipping-an-inference-model-means-a-live-priced-api-2026-08-18, compass-openrouter-inference-provider-listing-guide-2026-08-18, compass-ai-gateway-provider-listing-case-studies-2026-08-18]
people: []
orgs: [openrouter]
aliases: [shipping inference is a live api, serving with a price is shipping, the endpoint is the product]
tags: [shipping, provider-readiness, api, pricing, distribution]
---

# Shipping an inference model means a live priced API, not a website

## Claim

For an inference provider, shipping means that a model runs on the provider's hardware behind a callable, authenticated, public-internet API with a price. A marketing website is not the product surface.

The minimum package is:

1. deployed model weights on an operating inference stack;
2. an OpenAI-compatible `/chat/completions` endpoint with streaming and usage counts;
3. a machine-readable `/models` endpoint with model, pricing, capability, location, and compliance metadata;
4. a published privacy and data-retention policy; and
5. a per-token price.

“Public” means that the gateway can reach the endpoint on the internet. It does not mean unauthenticated. API keys still control access.

## Why It Matters

This definition turns a vague website task into a provider-readiness test. Before gateway listing, the live endpoint can make the application concrete because a reviewer can test the model, price, latency, and throughput. After listing, a new model can become a capacity deployment plus a change to the provider's model manifest.

It also separates two actions:

- **Shipping:** make the endpoint callable, priced, secure, and reviewable.
- **Announcing:** publish a post or performance chart to attract attention.

The first is the operating product. The second is marketing.

## Evidence

- **Direct decision record:** Dylan defined this minimum package in the 2026-08-18 chat capture and said that serving without a price is a demo, while serving with a price is shipping.
- **Source support, not independently verified:** The captured Compass reports describe OpenRouter's API, model metadata, privacy, invoicing, test-traffic, and model-staging requirements. They also describe day-0 launch cases from provider self-reports.

## Implications

- Do not make self-serve signup, dashboards, payment pages, or a large marketing site prerequisites for the first provider test.
- Treat the privacy and data-retention page as the minimum website surface.
- Give reviewers and testers scoped API keys. Never expose an unauthenticated endpoint.
- Before listing, use a live model endpoint as the application proof.
- After listing, pre-stage model metadata and capacity, then change readiness at launch only when the gateway process permits it.
- Test demand and economics with a real price, not only a technical demo.

## Counterpoints / Uncertainty

- OpenRouter can change its provider requirements, review process, payment terms, and model-staging behavior.
- A technically complete endpoint does not guarantee acceptance, customer demand, adequate margin, or reliable capacity.
- The supporting Compass reports contain automated research and provider marketing claims that still need primary-source verification.
- “OpenRouter is the first customer” is an operating shorthand. It becomes true only after OpenRouter accepts the provider and sends paid traffic.

## Links

- Source: [[dylan-shipping-an-inference-model-means-a-live-priced-api-2026-08-18|Dylan: Shipping an inference model means a live priced API]]
- Related source: [[compass-openrouter-inference-provider-listing-guide-2026-08-18|Compass OpenRouter inference-provider listing guide]]
- Related source: [[compass-ai-gateway-provider-listing-case-studies-2026-08-18|Compass AI gateway provider-listing case studies]]
- Area: [[inference|Inference]]

## Updates

- 2026-08-18: Created from Dylan's explicit definition of shipping for an inference provider. Kept current OpenRouter process claims at medium confidence because the supporting automated research is not independently verified.
