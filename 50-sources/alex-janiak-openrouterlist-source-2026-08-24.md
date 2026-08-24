---
type: source
status: captured
created: 2026-08-24
updated: 2026-08-24
source_date: 2026-08-24
source_type: chat-and-live-code-check
domains: [inference, model-serving, inference-marketplaces, market-research]
people: [alex-janiak]
orgs: [openrouter]
tags: [model-catalog, price-history, open-source-dashboard, data-quality]
---

# Alex Janiak shared OpenRouterList as a model-catalog and price-history source

## Raw Context

Alex Janiak sent Dylan this repository on 2026-08-24:

- https://github.com/jvrck/openrouterlist

## Direct Evidence

The repository and its current data were checked on 2026-08-24.

- [OpenRouterList](https://github.com/jvrck/openrouterlist) is an open-source OpenRouter model and price comparison dashboard.
- Its scheduled job calls OpenRouter's public `GET /api/v1/models` endpoint twice each day. It commits changed model data and rebuilds a compact price-history file from Git history.
- The checked price-history file covered 979 model identifiers from 2024-09-21 through 2026-08-24. It marked 418 as currently present and 561 as no longer present. Of the 979 records, 332 had more than one recorded price point.
- The current data file contained 419 models. A new direct call to the same default OpenRouter endpoint contained 417. The repository had three model identifiers that the live endpoint no longer returned, the live endpoint had one model that the repository lacked, and five shared models had different price objects. This is normal lag for a twice-daily snapshot, but it means the repository is not a live source of truth.
- The repository calls the default model-list route. It does not request `output_modalities=all`, so it does not preserve the wider embedding, audio, video, speech, transcription, and reranking catalog.
- Its history stores model-level prompt and completion price change points. It does not store provider-specific endpoint prices, provider count, latency, throughput, uptime, demand, model parameters, mixture-of-experts structure, quantized checkpoint sizes, or key-value-cache size.
- The repository uses an MIT license file, but its copyright name and year remain placeholder text. Reuse of the data still needs an OpenRouter terms check rather than reliance on the repository license alone.

## Assessment

### Direct evidence

OpenRouterList can provide a fast historical cross-check for model availability, discontinuation, and the model-level prices that OpenRouter returned at each captured point.

### Reasonable inference

The repository can help test our own price-history calculations or provide an optional backfill after field definitions and reuse terms are checked. Its Git-history method is also a useful example of how to build a compact change ledger.

### Limits

It does not answer which models have demand or insufficient supply. Its price history is not a provider-level price frontier, and its current data can lag OpenRouter by up to about 12 hours.

## Decision

Do not add OpenRouterList to the active V1B implementation. Continue to collect current OpenRouter facts from official endpoints.

After V1B passes, consider one bounded price-history task:

1. compare OpenRouterList model-level price changes with our direct snapshots;
2. check OpenRouter's terms for reuse and historical storage;
3. decide whether the backfill is accurate enough for a clearly labeled historical panel; and
4. keep provider-level price and quality history in our own collection because OpenRouterList does not contain it.

## Links

- [[public-inference-router-data-audit-2026-08-21|Several inference routers publish demand data, but their totals must not be added together]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference|Inference]]
