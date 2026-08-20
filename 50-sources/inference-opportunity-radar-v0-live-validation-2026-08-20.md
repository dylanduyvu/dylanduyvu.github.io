---
type: source
status: verified
created: 2026-08-20
updated: 2026-08-20
domains: [inference, model-serving, inference-marketplaces, market-research]
orgs: [openrouter, hugging-face, artificial-analysis]
tags: [opportunity-radar, live-test, demand, provider-supply, retrodiction]
---

# Inference opportunity radar V0 live validation

## Context

The first live V0 run tested the [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] against ten manually mapped open-weight models. The tool is an internal evidence collector. It stops at L3, potential opportunity. It does not test hardware fit, achievable serving performance, capacity, or unit economics.

The run collected public OpenRouter demand and supply data plus Hugging Face model data. It then normalized the snapshots, evaluated the ten candidates, replayed three historical test cases, and generated reports and exports.

## Direct Evidence

The completed source and transformation calls were:

- 18 of 18 OpenRouter demand calls;
- 12 of 12 OpenRouter supply calls;
- 10 of 10 Hugging Face calls;
- 96 of 96 raw snapshot imports;
- 10 of 10 candidate evaluations; and
- 3 of 3 retrodiction cases.

The append-only store contained 96 validated raw snapshots, 586,107 ranking observations, 828 model observations, 1,766 endpoint observations, 20 Hugging Face observations, and 12,587 preserved missing-data rows. A second import did not change any table count. SQLite integrity and foreign-key checks passed.

The first live labels were:

| Model | Label | Best exact paid-demand rank in tested profiles | Distinct OpenRouter provider organizations |
| --- | --- | ---: | ---: |
| DeepSeek-V4-Flash-0731 | L1 | 1 | 28 |
| Hy3 | L1 | 1 | 6 |
| MiMo-V2.5 | L1 | 1 | 5 |
| DeepSeek-V4-Flash | L1 | 1 | 18 |
| GLM-5.2 | L1 | 3 | 26 |
| MiniMax-M3 | L1 | 8 | 12 |
| Kimi-K3 | L1 | 9 | 12 |
| Qwen3.6-27B | L1 | 31 | 7 |
| Qwen3.8-27B | L1 | 44 | 7 |
| Qwen3-8B | L0 | not returned | 1 |

The displayed demand rank is the best exact paid rank across the tested total, context-bucket, and tool-calling profiles. It is not a universal or total-week ranking. An absent top-50 row is censored data, not zero demand.

No candidate reached L2 or L3. The run had no approved named workload profile, only one OpenRouter endpoint capture day, and only one Hugging Face capture day. Qualified supply and local-download velocity therefore remained unavailable.

The raw API work found two operational constraints:

- OpenRouter rejected a ranking request longer than 366 days. The collector now divides longer history into bounded calls.
- A weekly ranking response can return a bucket whose date begins up to six days before the requested start date. The collector stores the returned week and does not invent missing weeks.

## Retrodiction

MiMo-V2.5, Qwen3.6-27B, and Qwen3.8-27B replayed as L0 at their historical test dates. This is not evidence that the models had no demand. Every stored snapshot was captured after the test date, so the current database cannot prove historical supply or demand at those dates. The report keeps unavailable evidence separate from evidence that was testable at the historical cutoff.

## Manual Dashboard Cross-check

The OpenRouter Provider Market Share dashboard matched the radar's distinct provider count for DeepSeek-V4-Flash-0731, Hy3, MiMo-V2.5, MiniMax-M3, and Kimi-K3. It showed 28 providers for GLM-5.2 while the radar showed 26. The dashboard says it rolls regional variants into a base provider, so identity rules or capture timing can explain the difference. The disagreement remains open.

token.app's weekly OpenRouter view placed DeepSeek-V4-Flash, Hy3, MiMo-V2.5, GLM-5.2, MiniMax-M3, and Kimi-K3 at ranks 1, 2, 3, 5, 11, and 12. This supports the demand signal but is not independent evidence because token.app states that its rankings come from OpenRouter.

CodeSOTA is a dated benchmark and capability registry. It does not measure served demand or provider scarcity. Artificial Analysis confirmed model performance and some provider coverage, but it did not supply independent demand evidence. It listed four API providers for Qwen3.6-27B while the radar observed seven distinct OpenRouter provider organizations, which is a coverage difference rather than a direct contradiction.

## Interpretation

**Reasonable inference:** The first run proves that public data can produce a bounded demand watchlist and preserve provider-supply facts without turning raw provider count into an opportunity claim.

**Not supported:** The run does not show that any listed model is underserved. It does not show that our hardware can beat an endpoint, that a provider can win meaningful routed share, or that serving the model has positive unit economics.

## Next Tests

- Collect endpoint snapshots on at least three UTC days across a seven-day span.
- Collect a second Hugging Face capture day before calculating local-download change.
- Write one named workload profile only after its requirements have a customer, observed-demand, or explicit research-hypothesis basis.
- Reconcile the GLM-5.2 provider-organization difference with the dashboard's regional roll-up rules.
- Keep hardware benchmarks and unit economics in a later project after the radar identifies a testable candidate.

## Links

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference-opportunity-radar-pre-scope-design-audit-2026-08-19|Pre-scope design audit]]
- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]]
- [[inference|Inference]]

