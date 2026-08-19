---
type: source
status: captured
created: 2026-08-18
updated: 2026-08-18
source_date: 2026-08-18
source_type: chat
domains: [inference, model-serving, inference-marketplaces, compute-economics]
people: []
orgs: [openrouter]
tags: [shipping, provider-readiness, openai-compatible-api, pricing, distribution]
---

# Dylan: Shipping an inference model means a live priced API

## Context

Dylan clarified what “ship” means for an inference provider. This is a product and operating definition, not independent verification of OpenRouter's current requirements.

## Raw Context

Good question — "ship" is more specific than a website. It means the model is live on your GPUs behind a callable, sellable API. The website is almost incidental.

The minimum package:

1. **The model runs on your hardware.** Download the open weights, deploy them on your inference stack (vLLM, SGLang, or your own), and tune throughput.
2. **A public HTTPS endpoint serves it.** OpenAI-compatible `/chat/completions`, with streaming and usage token counts. "Public" means reachable on the open internet — not behind a VPN — so OpenRouter's servers can call it. It is **not** unauthenticated. You gate it with API keys. You hand keys to OpenRouter, to testers, and to the model lab.
3. **A `/models` endpoint describes it.** Model ID, USD pricing, context length, max output, features, datacenter, compliance flags. This is machine-readable proof that you are a real provider, not a demo.
4. **A published privacy and data-retention policy.** This is the main reason you need a website at all — one page that states what you log and whether you train. OpenRouter requires it before review.
5. **A price.** You commit to a per-token number. "Serving" without a price is a demo; serving with a price is shipping.

So the application hook is not "we have a website." It is: "Model X is live at this base URL, at this price, at this throughput. Here is an API key. Test it now." OpenRouter's reviewer can hit your endpoint in minutes. That is what makes the gap real instead of claimed.

One nuance from the case studies: Parasail and Inceptron did their day-0 launches as **already-listed** providers. Once you are listed, "ship" gets even simpler — you add the model to your `/models` document, OpenRouter's monitor auto-stages it, runs baseline tests, and unhides it. The `is_ready: false` flag lets you pre-stage it in secret and flip it live at the release announcement. So the tactic has two forms: before listing, the live endpoint **is** your application; after listing, shipping is a manifest change plus GPUs.

What you can skip at first: self-serve signup, dashboards, payment pages, marketing site. OpenRouter is effectively your first customer, and it pays by monthly invoice. Self-serve users help later, because independent traffic is proof, but they are not the gate.

The public announcement (the LinkedIn post, the throughput chart) is a separate, second move. It is marketing that attracts the gateway's attention. The thing that gets reviewed is the endpoint.

## Links

- [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping an inference model means a live priced API, not a website]]
- [[compass-openrouter-inference-provider-listing-guide-2026-08-18|Compass OpenRouter inference-provider listing guide]]
- [[compass-ai-gateway-provider-listing-case-studies-2026-08-18|Compass AI gateway provider-listing case studies]]
- [[inference|Inference]]
