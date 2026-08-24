---
type: source
status: captured
created: 2026-08-21
updated: 2026-08-24
source_date: 2026-08-21
source_type: web-research
domains: [inference, model-serving, inference-marketplaces, market-research]
people: []
orgs: [openrouter, vercel, anyrouter, llm-gateway, bharatrouter, requesty, hugging-face, tangle, alltoken, cloudflare, portkey]
tags: [router-data, model-demand, provider-supply, public-data, tokens, requests, performance]
---

# Several inference routers publish demand data, but their totals must not be added together

## Research Question

Dylan asked which inference routers publish data that the inference-opportunity radar can collect. The search used Exa to find current official pages and documentation, then checked the public endpoints directly on 2026-08-21.

## Bottom Line

OpenRouter is no longer the only useful public demand source. Vercel AI Gateway, AnyRouter, LLM Gateway, and BharatRouter also expose machine-readable model-usage data. Tangle Router and AllToken publish useful public ranking pages, but no stable documented export was found in this pass.

These sources support cross-router confirmation. They do not support one total-market token count. Each router covers a different user base, uses different time windows and token accounting, and can route through another gateway. Raw totals must remain labeled by source.

## High-Priority Machine-Readable Sources

### OpenRouter

- [Daily model rankings](https://openrouter.ai/docs/api/api-reference/datasets/get-rankings-daily) provide absolute daily token totals for the top 50 public models and one `other` row.
- [Model endpoints](https://openrouter.ai/docs/api/api-reference/endpoints/list-all-endpoints-for-a-model) provide provider, price, context, quantization, supported parameters, latency, throughput, and uptime.
- The daily dataset can be filtered for context length and tool use. OpenRouter usage remains one gateway's demand, not total market demand.
- OpenRouter licenses its public dataset endpoints under CC BY 4.0 with a required citation.

### Vercel AI Gateway

- [Leaderboards](https://vercel.com/docs/ai-gateway/leaderboards) publish daily request, token, spend, and media shares for models and labs. They also include provider and application rankings.
- Public export: `https://vercel.com/api/ai/leaderboard-export?dataset=models&modality=text`.
- Public model catalog: `https://ai-gateway.vercel.sh/v1/models`.
- Public provider routes: `https://ai-gateway.vercel.sh/v1/models/{creator}/{model}/endpoints`.
- A live check returned 351 models. The leaderboard export returned 1,755 dated rows from 2026-06-22 through 2026-08-21 and identified its license as CC BY 4.0.
- Vercel reports percentage share, not absolute platform volume. This makes it good for independent demand rank and trend confirmation, but not for adding tokens to OpenRouter totals.

### AnyRouter

- [Network Stats API](https://docs.anyrouter.dev/api-reference/network-stats) documents the public, no-authentication endpoint `GET /api/v1/analytics/network`.
- Live endpoint: `https://anyrouter.dev/api/v1/analytics/network`.
- It returns total input, output, cached, and reasoning tokens; request totals; the top 15 models by 30-day token use; and 24-hour, seven-day, and 30-day trends.
- The live response included model ID, provider, tokens, requests, rank, and share. The site says the snapshot refreshes hourly.
- This is a smaller and different user population. Some route identifiers, such as BYOK and free pools, are not one model and require filtering.

### LLM Gateway

- [Public rankings](https://llmgateway.io/rankings) show 24-hour, seven-day, and 30-day model token use, request counts, model trends, and provider share.
- The page uses the public JSON endpoint `https://internal.llmgateway.io/public/models/stats?window=7d`.
- A live check returned 163 models, 43 providers, and ten model time series for the seven-day view.
- The JSON endpoint was found in the site's public client code, but it is not documented as a stable data API. Treat it as machine-readable but more fragile than the documented OpenRouter, Vercel, or AnyRouter feeds.

### BharatRouter

- [Usage and rankings documentation](https://bharatrouter.com/docs/usage) states that `GET /v1/rankings` is public and reports the platform's most-used models.
- Live endpoint: `https://api.bharatrouter.com/v1/rankings`.
- The live response returned absolute requests and tokens for seven-day and 30-day windows.
- The public [API index](https://api.bharatrouter.com/llms.txt) also lists model statistics with seven-day success, latency, and output speed; a model catalog; and a provider registry.
- This is useful independent demand evidence, especially for India and Indic workloads, but its scale and model mix differ from OpenRouter.

## Supply and Quality Sources

### Hugging Face Inference Providers

- [Hub API documentation](https://huggingface.co/docs/inference-providers/en/hub-api) describes the public router model catalog at `https://router.huggingface.co/v1/models`.
- A live check returned 131 models. Records can include provider status, context, input and output price, tool support, structured-output support, latest first-token latency, throughput, and whether the provider is the model author.
- No public platform-wide demand history was found. Use this for provider coverage and quality, not demand.

### Requesty

- [Requesty's public data library](https://www.requesty.ai/data) publishes production-gateway studies of latency, throughput, caching, tool use, and failure patterns. It states that each dataset includes its method, a machine-readable export, and a citation block.
- [The live latency leaderboard](https://www.requesty.ai/rankings/latency) shows model-provider matchups from production traffic. It says the data refreshes each minute and uses recency-weighted, outlier-trimmed measurements.
- The public model endpoint `https://router.requesty.ai/v1/models` returned 668 route records with price, context, capability, privacy, retention, geography, open-weight, and canonical-model fields.
- No public platform-wide model-demand feed was found. Use Requesty for quality, route coverage, and model metadata.

## Secondary Public Pages

- [Tangle Router rankings](https://router.tangle.tools/rankings?period=7d) publish model, upstream provider, tokens, requests, average cost, and average latency for real operator-network traffic. The page is useful, but this pass found no stable rankings export. Some rows are routes through OpenRouter, so adding them to OpenRouter totals would double count traffic.
- [AllToken rankings](https://alltoken.ai/rankings) publish seven-, 30-, and 90-day routed-token rankings and provider share. No documented export was found. Current traffic is concentrated in a small number of models, so use it as a weak confirming source.
- [OrcaRouter's leaderboard](https://www.orcarouter.ai/leaderboard) combines its own production reliability with external benchmarks, ecosystem adoption, and community votes. Its composite rank is not a clean demand measure and should not enter the demand score without separating the source fields.
- [BetaRouter rankings](https://betarouter.com/rankings) expose the same type of public statistics endpoint as LLM Gateway, but a live seven-day check returned zero models, zero providers, and zero traffic. Do not ingest it until it has data.

## Public Catalogs Without Public Market Demand

- [Cloudflare AI Gateway analytics](https://developers.cloudflare.com/ai-gateway/observability/analytics/) report requests, tokens, errors, latency, and cost for each customer's own gateway. They are not public platform-wide data. The public supported-model pages can still supply catalog facts.
- [Portkey's model catalog](https://portkey.ai/docs/product/model-catalog) is built from a customer's configured provider credentials. It is not a public market-wide supply or demand dataset.

## Collection Rules

1. Store every demand measure with its router name, time window, time zone, update time, and unit.
2. Do not add raw token or request totals across routers.
3. Calculate rank, share, and trend inside each router first. Then count how many independent routers confirm the same direction.
4. Mark traffic that is routed through another gateway. Do not count a Tangle `openrouter/...` route as independent from OpenRouter.
5. Keep demand separate from supply and quality. Hugging Face and Requesty can strengthen a quality-gap case without proving demand.
6. Capture the public JSON response when an official endpoint exists. Page parsing is a fallback and must carry a higher fragility label.
7. Read and record the reuse terms before scheduled collection. OpenRouter and Vercel identify CC BY 4.0 for the checked demand exports. Terms for the other feeds remain an open check.

## Recommended Build Order

1. Add Vercel as the second high-quality demand surface.
2. Add AnyRouter, LLM Gateway, and BharatRouter as smaller independent demand surfaces.
3. Add Hugging Face Inference Providers and Requesty as supply and quality surfaces.
4. Add Tangle and AllToken only after the stable feeds run correctly and their page parsers have tests.

## Analytics-Layer Follow-up

A 2026-08-24 list from Jakub Janiak added Tidelines, TKX, OpenRouter Share, the Interconnects Open Models Dashboard, and DeepInfra status to the review set.

- Tidelines derives daily analytics from OpenRouter and Vercel. It is useful for archive and calculation checks, not independent demand.
- TKX exposes public JSON and a source-labeled methodology. Its model-demand board currently uses OpenRouter usage, while some provider probes remain pending.
- Interconnects tracks Hugging Face downloads and derivative repositories. It is a local-distribution signal, not hosted demand.
- DeepInfra's checked status JSON is provider-wide health, not model demand or model-level quality.
- OpenRouter Share could not be checked because its public page returned a Cloudflare challenge.

These findings do not change the build order. Finish OpenRouter V1B, then add Vercel as the second demand adapter. Use the derived layers as cross-checks unless they supply a distinct, tested field.

## Links

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[public-router-demand-feeds-support-triangulation-not-market-summing|Public router demand feeds support triangulation, not market summing]]
- [[openrouter-is-enough-for-a-listing-radar-not-a-market-demand-estimate|OpenRouter is enough for a listing radar, not a market-demand estimate]]
- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]
- [[inference|Inference]]
- [[jakub-janiak-inference-data-source-list-2026-08-24|Jakub Janiak shared additional inference-demand and analytics sources]]
