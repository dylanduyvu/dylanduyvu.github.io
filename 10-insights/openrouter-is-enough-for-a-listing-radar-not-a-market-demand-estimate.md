---
type: insight
status: active
created: 2026-08-19
updated: 2026-08-21
confidence: high
domains: [inference, model-serving, inference-marketplaces, market-research]
projects: [inference-model-opportunity-radar]
sources: [inference-model-opportunity-data-source-audit-2026-08-19]
people: []
orgs: [openrouter, hugging-face, vercel, lm-studio, artificial-analysis]
aliases: [OpenRouter demand spine, OpenRouter-only radar scope]
tags: [openrouter, demand-measurement, dashboard, provider-supply, market-scope]
---

# OpenRouter is enough for a listing radar, not a market-demand estimate

## Claim

OpenRouter alone is a sufficient hosted-demand surface for a first radar whose decision is which model and edge to pitch to OpenRouter. It is not sufficient to estimate total serverless inference demand or choose a durable multi-channel inference business.

## Why It Matters

The measurement scope should match the decision. OpenRouter token demand, provider count, price, latency, throughput, uptime, tool-call errors, and application mix are the most relevant public data when the immediate goal is an OpenRouter listing.

Calling that result `market demand` would create false confidence. Direct provider APIs, other gateways, private applications, enterprise contracts, and local execution are outside the OpenRouter data.

## Evidence

- OpenRouter publishes daily top-model token totals, application rankings, model catalogs, endpoint supply, and performance signals.
- Unofficial dashboards can reconstruct host share and model-provider competition from OpenRouter provider pages. Their coverage and scraper reliability are weaker than official APIs.
- CodeSOTA states directly that OpenRouter is one market slice and that direct API and first-party application traffic are missing.
- **SUPERSEDED evidence state:** The 2026-08-19 search found no public Vercel demand dataset. A 2026-08-21 live check found Vercel's public leaderboard export with daily model and lab shares for requests, tokens, and spend. Vercel reports shares rather than absolute volume, so OpenRouter remains sufficient for an OpenRouter-listing radar but is no longer the only public hosted-demand surface.
- Hugging Face, LM Studio, and Ollama expose local-distribution activity that OpenRouter cannot observe.

## Implications

- Use OpenRouter as the hosted-demand spine for version zero.
- Label every usage metric as `OpenRouter tokens`, `OpenRouter requests`, or `OpenRouter application share`, not total market demand.
- Add Hugging Face, LM Studio, Ollama, and other-gateway provider catalogs before generalizing a result beyond OpenRouter.
- For a new model that has not entered OpenRouter's daily top 50, use local velocity, prior-family demand, application discussion, and endpoint growth as early signals. Treat hosted demand as censored, not zero.
- Do not apply one unsupported multiplier to convert OpenRouter volume into total inference volume.

## Counterpoints / Uncertainty

- OpenRouter's user and application mix may be exactly the market a new retail inference provider wants, even if it is not globally representative.
- Public data from other gateways may remain too thin to improve demand measurement. Cross-gateway catalog breadth still improves supply measurement.
- An OpenRouter-only screen can miss models whose users stay local or use direct first-party APIs.

## Links

- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[inference|Inference]]
- [[public-router-demand-feeds-support-triangulation-not-market-summing|Public router demand feeds support triangulation, not market summing]]

## Updates

- 2026-08-19: Initial capture after an Exa search of existing demand, provider-supply, local-adoption, price, and performance dashboards.
- 2026-08-21: SUPERSEDED the earlier search result that Vercel exposed no public aggregate demand data. Vercel now has a public daily leaderboard export. The main claim remains active because OpenRouter alone is still sufficient for a listing-specific radar and neither source measures the total market.
