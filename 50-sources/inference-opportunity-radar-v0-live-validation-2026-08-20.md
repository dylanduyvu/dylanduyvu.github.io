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

The V0 validation began with ten manually mapped open-weight models and ended with 24 models after checked source evidence expanded the model map. The [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] is an internal evidence collector. It stops at L3, potential opportunity. It does not test hardware fit, achievable serving performance, capacity, or unit economics.

The final run collected public OpenRouter demand and supply data plus Hugging Face model data. It then normalized the snapshots, evaluated 24 candidates, replayed three historical test cases, and generated reports and exports.

## Direct Evidence

Final run `run-20260820T144305.290706Z` completed all 330 planned stage operations:

- 18 of 18 OpenRouter demand calls;
- one of one OpenRouter model-list calls;
- 25 of 25 OpenRouter endpoint and Zero Data Retention calls;
- 24 of 24 Hugging Face calls;
- 228 of 228 raw snapshot imports;
- 24 of 24 candidate evaluations;
- three of three retrodiction cases; and
- seven of seven report-output groups.

The append-only store contained 228 validated raw snapshots, 589,575 ranking observations, 1,248 model observations, 3,078 endpoint observations, 96 Hugging Face observations, and 13,965 preserved missing-data rows. A second import did not change any table count. SQLite integrity and foreign-key checks passed. All 228 envelope IDs and hashes matched the SQLite snapshot manifest. All 103 immutable run artifacts matched their recorded hashes and byte counts. The exact live credential did not occur in tracked or ignored project files.

The final labels were 23 L1 demand signals and one L0 control. The top ten candidates and the two required Qwen records were:

| Model | Label | Best exact paid-demand rank in tested profiles | Distinct OpenRouter provider organizations |
| --- | --- | ---: | ---: |
| DeepSeek-V4-Flash-0731 | L1 | 1 | 30 |
| Hy3 | L1 | 1 | 6 |
| MiMo-V2.5 | L1 | 1 | 5 |
| DeepSeek-V4-Flash | L1 | 1 | 18 |
| GLM-5.2 | L1 | 3 | 26 |
| DeepSeek-V4-Pro-0813 | L1 | 6 | 12 |
| DeepSeek-V4-Pro | L1 | 6 | 18 |
| MiniMax-M3 | L1 | 8 | 12 |
| DeepSeek-V3.2 | L1 | 8 | 14 |
| Kimi-K3 | L1 | 9 | 12 |
| Qwen3.8-27B | L1 | 44 | 7 |
| Qwen3-8B | L0 | not returned | 1 |

The displayed demand rank is the best exact paid rank across the tested total, context-bucket, and tool-calling profiles. It is not a universal or total-week ranking. An absent top-50 row is censored data, not zero demand.

No candidate reached L2 or L3. The run had no approved named workload profile, only one OpenRouter endpoint capture day, and only one Hugging Face capture day. Qualified supply and local-download velocity therefore remained unavailable.

The workflow status was `success`, all planned and actual counts matched, and the separate `evidence_complete` field was false. Expected cold-start evidence gaps did not turn a completed collection and report run into a workflow failure.

### Superseded initial checkpoint

The initial ten-model checkpoint completed 40 source calls, imported 96 snapshots, and produced nine L1 records plus one L0 record. Those facts remain valid for that earlier checkpoint. They are superseded as the current V0 totals by the expanded final run above.

The raw API work found two operational constraints:

- OpenRouter rejected a ranking request longer than 366 days. The collector now divides longer history into bounded calls.
- A weekly ranking response can return a bucket whose date begins up to six days before the requested start date. The collector stores the returned week and does not invent missing weeks.

## Retrodiction

MiMo-V2.5, Qwen3.6-27B, and Qwen3.8-27B replayed as `unavailable` at their historical test dates. Their checked model mappings and live snapshots postdated the test dates, so the current database cannot prove what label the radar would have assigned then. The earlier checkpoint rendered these cases as L0. That was corrected because missing historical evidence is not evidence of no demand.

## Manual Dashboard Cross-check

Four dated manual records checked OpenRouter's provider page, token.app, CodeSOTA, and Artificial Analysis. All four were `not_comparable` with the radar's model-level demand and qualified-supply decision. OpenRouter's provider page reports provider-wide traffic. token.app states that its rankings come from OpenRouter and is not independent demand evidence. CodeSOTA is a benchmark registry. Artificial Analysis compares provider price and performance, not OpenRouter demand. The radar stores these findings and does not scrape or average them.

An earlier informal pass claimed several provider-count matches and one GLM-5.2 disagreement. The final durable cross-check records supersede that interpretation because the available dashboard views were not directly comparable to the radar's model-level and workload-qualified fields.

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

## Updates

- 2026-08-20: Final expanded live validation completed. It supersedes the initial ten-model counts as the current V0 result while preserving that checkpoint above. Retrodiction was corrected from L0 to `unavailable` when the checked mapping postdated the test. Manual dashboard claims were also narrowed to four dated `not_comparable` records.
