---
type: source
status: captured
created: 2026-08-24
updated: 2026-08-24
source_date: 2026-08-24
source_type: chat-and-live-web-check
domains: [inference, model-serving, inference-marketplaces, market-research]
people: [jakub-janiak]
orgs: [vercel, llm-gateway, deepinfra, tidelines, tkx, requesty, interconnects, openrouter]
tags: [router-data, model-demand, provider-quality, local-adoption, analytics-dashboards]
---

# Jakub Janiak shared additional inference-demand and analytics sources

## Raw Context

Jakub Janiak sent Dylan this source list on 2026-08-24.

Data sources:

- https://vercel.com/ai-gateway/leaderboards/models
- https://llmgateway.io/rankings
- https://status.deepinfra.com/

Analytics layers:

- https://tidelines.ai/
- https://openrouter-share.theo-bearman.com/
- https://tkx.org/
- https://www.requesty.ai/rankings
- https://dashboard.interconnects.ai/

## Direct Evidence

The links were checked without credentials on 2026-08-24.

- [Vercel AI Gateway leaderboards](https://vercel.com/ai-gateway/leaderboards/models) returned HTTP 200. Vercel documents a public export at `GET https://vercel.com/api/ai/leaderboard-export`. A live text-model request returned HTTP 200, 1,806 rows from 2026-06-25 through 2026-08-24, and daily shares for requests, tokens, and spend. The response identifies the license as CC BY 4.0. It reports shares, not absolute platform volume.
- [LLM Gateway rankings](https://llmgateway.io/rankings) returned HTTP 200 and describes model token volume, request counts, trends, and provider share from traffic routed through LLM Gateway. The existing router audit found its public client JSON route, but the route is not documented as a stable API.
- [DeepInfra status](https://status.deepinfra.com/) and its public `status.json` returned HTTP 200. The JSON exposed current API and website status. It did not expose model demand or model-level provider quality in this check.
- [Tidelines](https://tidelines.ai/) and its [methodology](https://tidelines.ai/methodology) returned HTTP 200. Tidelines states that it derives its figures from daily OpenRouter and Vercel snapshots. It adds a long archive, price and spend calculations, trend measures, and model classifications. It is a useful calculation and history cross-check, not an independent source from those two gateways.
- [OpenRouter Share](https://openrouter-share.theo-bearman.com/) returned HTTP 403 behind a Cloudflare challenge. Its method and current data were not verified in this check.
- [TKX](https://tkx.org/), its [API page](https://tkx.org/api/), and its [methodology](https://tkx.org/methodology/) returned HTTP 200. TKX documents public JSON for rankings, providers, applications, prices, and GPU rates. Its model-demand board currently uses OpenRouter daily usage. Some provider-performance fields come from public APIs, while TKX labels some direct probes as pending. Use it as a lead and cross-check until each field's source is tested.
- [Requesty rankings](https://www.requesty.ai/rankings) returned HTTP 200. Requesty describes token share, spend, cost, cache, and latency from its own production traffic. The page reported 40 models and 31 providers during this check. It is gateway-owned demand and quality evidence, but scheduled collection still needs a stable export and reuse-terms check.
- [Interconnects Open Models Dashboard](https://dashboard.interconnects.ai/) returned HTTP 200. It describes daily Hugging Face download and derivative-repository statistics. This is a local-distribution signal, not serverless token demand.

## Assessment

### Direct evidence

Vercel remains the strongest next independent public gateway-demand source after OpenRouter. Its export is official, machine-readable, dated, and licensed for reuse.

### Reasonable inference

Tidelines and TKX can save research time by preserving history, publishing formulas, and exposing cross-checks. They should not replace direct OpenRouter or Vercel evidence for fields those gateways publish themselves.

Interconnects can help with the planned local-versus-hosted comparison because it groups Hugging Face downloads and derivatives. Its counts still measure file activity, not active users, inference tokens, or willingness to pay.

### Open questions

- Does Requesty publish a stable, documented model-demand export and clear reuse terms?
- Which TKX provider fields are copied from public APIs, measured by TKX, or still pending?
- Can OpenRouter Share be checked without bypassing the site's access controls?
- Does DeepInfra expose useful model-level incident history beyond its provider-wide status JSON?

## Decision

Do not add these sources to the active OpenRouter V1B model-facts implementation. Finish the OpenRouter demand, model-size, MoE, quant-checkpoint, and sequence-state dashboard first.

After V1B is useful:

1. add Vercel as the second source-labeled demand adapter;
2. use Tidelines to check calculations and archived trends;
3. test TKX as a supply, price, and quality cross-check;
4. use Interconnects as a local-distribution cross-check; and
5. review Requesty export stability and terms before collection.

## Links

- [[public-inference-router-data-audit-2026-08-21|Several inference routers publish demand data, but their totals must not be added together]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[openrouter-is-enough-for-a-listing-radar-not-a-market-demand-estimate|OpenRouter is enough for a listing radar, not a market-demand estimate]]
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[inference|Inference]]
