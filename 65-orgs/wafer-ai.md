---
type: org
status: active
created: 2026-08-19
updated: 2026-08-19
aliases: [Wafer, Wafer AI, WaferPass]
people: [emilio-andere, steven-arellano]
projects: []
domains: [inference, model-serving, inference-marketplaces, compute-economics]
tags: [inference-provider, serving-optimization, subscriptions, openrouter]
---

# Wafer AI

## Current Understanding

Wafer builds inference-performance software and sells dedicated and serverless inference. It is relevant to the vault because it moved through several distribution models: a capped flat-rate WaferPass subscription for agent users, per-token serverless service, dedicated endpoints, and current listings on gateways including OpenRouter.

The public record supports Wafer's product terms and mixed spot-plus-dedicated rental structure. It does not yet show how Wafer got accepted by OpenRouter or whether WaferPass helped the listing.

## Key Claims / Signals

- WaferPass launched with flat-rate access to optimized open models but used rolling request limits.
- WaferPass launched on Product Hunt on April 15, 2026, 11 days after an Anthropic access change affected third-party harnesses including OpenClaw. Wafer directly targeted OpenClaw and other coding-harness users. The timing is direct evidence; an intentional causal response is not documented.
- Wafer says its optimized serving stack reduced cost per request and kept subscription margins positive. This is an unaudited company claim.
- Spheron says WaferPass and Wafer Serverless shared per-minute B300 spot and dedicated capacity.
- Wafer is currently listed on OpenRouter and its current site emphasizes per-token serverless and dedicated inference.

## Open Questions

- Did subscription traffic create the operating proof used in gateway diligence?
- What caused the move away from WaferPass on the current public site?
- How did Wafer balance rolling subscription demand, serverless traffic, and gateway traffic on one fleet?
- What were the actual utilization and gross-margin effects of the subscription product?

## Sources

- [[waferpass-bootstrap-public-evidence-check-2026-08-19|WaferPass bootstrap hypothesis and public evidence check]]
- [[waferpass-anthropic-openclaw-event-timeline-2026-08-19|WaferPass launched soon after an Anthropic access change, but causation is unproven]]
- [[compass-ai-gateway-provider-listing-case-studies-2026-08-18|Compass AI gateway provider-listing case studies]]

## Related Insights

- [[waferpass-pooled-capped-subscription-demand-with-elastic-gpu-rentals-but-its-listing-role-is-unproven|WaferPass pooled capped subscription demand with elastic GPU rentals, but its listing role is unproven]]
- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- [[current-openrouter-research-found-no-public-first-hand-provider-listing-account|Current OpenRouter research found no public first-hand provider-listing account]]

## Related Areas

- [[inference|Inference]]
