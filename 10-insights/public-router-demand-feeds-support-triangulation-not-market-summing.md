---
type: insight
status: active
created: 2026-08-21
updated: 2026-08-21
confidence: high
domains: [inference, model-serving, inference-marketplaces, market-research]
projects: [inference-model-opportunity-radar]
sources: [public-inference-router-data-audit-2026-08-21]
people: []
orgs: [openrouter, vercel, anyrouter, llm-gateway, bharatrouter, requesty, hugging-face]
aliases: [cross-router demand confirmation, inference router demand feeds]
tags: [router-data, model-demand, triangulation, public-data, measurement]
---

# Public router demand feeds support triangulation, not market summing

## Claim

OpenRouter, Vercel AI Gateway, AnyRouter, LLM Gateway, and BharatRouter publish usable public model-demand data. The inference-opportunity radar should compare a model's rank, share, and trend inside each router, then measure cross-router agreement. It should not add their raw token or request totals into one market-size number.

## Why It Matters

More than one demand surface reduces dependence on OpenRouter's customer mix and top-50 cutoff. A model that rises on several independent routers is a stronger demand candidate than a model that appears on one gateway only.

Raw totals are not comparable. The routers have different customers, token accounting, time windows, and model catalogs. Some routers also send traffic through another gateway, which creates double counting.

## Evidence

- OpenRouter publishes absolute daily token totals for its top 50 public models.
- Vercel publishes daily model and lab shares for requests, tokens, and spend. Its export returned dated rows and a CC BY 4.0 license in a live check.
- AnyRouter publishes public network totals, the top 15 models, requests, tokens, shares, and time series.
- LLM Gateway's public rankings page uses a JSON feed with model and provider token totals, requests, trends, and time series.
- BharatRouter publishes public seven-day and 30-day model tokens and requests.
- Tangle publishes real routed use, but some routes use OpenRouter upstream and therefore are not independent OpenRouter demand.
- Hugging Face Inference Providers and Requesty publish useful provider, price, feature, and performance data without a comparable public model-demand feed.

## Implications

- Keep OpenRouter as the first listing-specific demand source.
- Add Vercel first, then AnyRouter, LLM Gateway, and BharatRouter.
- Produce one source-labeled demand panel per router and one cross-router confirmation score.
- Use Hugging Face and Requesty to test supply and quality gaps after demand is visible.
- Do not call the combined result total serverless demand or global market share.

## Counterpoints / Uncertainty

- Smaller routers can have concentrated or unstable traffic, so agreement should not give every router equal weight.
- A model can be absent because the router does not list it, not because users do not want it.
- Undocumented JSON endpoints can change without notice.
- Reuse terms remain unverified for several smaller-router feeds.

## Links

- [[public-inference-router-data-audit-2026-08-21|Several inference routers publish demand data, but their totals must not be added together]]
- [[openrouter-is-enough-for-a-listing-radar-not-a-market-demand-estimate|OpenRouter is enough for a listing radar, not a market-demand estimate]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference|Inference]]

## Updates

- 2026-08-21: Initial capture after an Exa search and live endpoint checks.
