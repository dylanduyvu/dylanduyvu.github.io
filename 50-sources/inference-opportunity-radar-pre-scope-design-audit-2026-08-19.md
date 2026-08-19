---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: web-research-design-audit
domains: [inference, model-serving, inference-marketplaces, market-research]
people: []
orgs: [openrouter, hugging-face, lm-studio, ollama, artificial-analysis, xiaomi, qwen]
tags: [opportunity-screen, evidence-gates, data-audit, model-demand, provider-supply, pre-scope]
---

# Pre-scope design audit: the automated opportunity radar is buildable through label 3

Skeptical pre-scope audit of the [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]. Requested by Dylan on 2026-08-19. All live checks in this note were accessed on **2026-08-19**. Evidence classes are labeled: **(direct)** = verified against a primary source in this session; **(source claim)** = stated by a named source, not independently verified; **(inference)** = reasoned from evidence; **(speculation)** = plausible, weak support; **(negative result)** = checked and not found.

---

## 1. Executive verdict

**Is the tool possible?** Yes, as a screening radar with strict evidence labels. Public data supports daily demand tracking, some attribute-specific demand tracking, endpoint-supply snapshots, and frontier-gap observation. It does not support automated confirmed-unmet-demand claims.

**What it can validly claim:**
- OpenRouter-realized demand level, rank, and trend for any model inside the daily top 50, back to 2025-01-01 (direct: [rankings-daily API](https://openrouter.ai/docs/api/api-reference/datasets/get-rankings-daily)).
- A censored upper bound for models outside the top 50 (below that day's cutoff; the `other` row gives the residual) (direct).
- Bucketed long-context demand through the exact `context_bucket` filters and tool-calling demand through `modality=tool_calling`, subject to the same top-50 censoring (direct: [rankings-daily API](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)). Programming and other use categories are also available, but those totals are sampled, upsampled, and weekly rather than exact daily data.
- Point-in-time endpoint supply per model: price, limits, quantization, supported parameters, uptime (5m/30m/1d), latency and throughput percentiles (30m) (direct: [endpoints API schema](https://openrouter.ai/docs/api/api-reference/endpoints/list-all-endpoints-for-a-model)).
- Qualified-supply counts **against a named workload profile**, from the tool's own accumulated snapshots.
- Observed frontier gaps (price spread, perf spread, missing attributes) as descriptions, not causes.

**What it cannot claim:**
- Total-market or off-OpenRouter demand (private apps and direct provider traffic are invisible; rankings exclude user-private traffic (direct: [rankings page](https://openrouter.ai/rankings))).
- Confirmed unmet demand from public data alone. Public friction proxies exist, but failed requests, refused capacity, and most customer asks are private. **(negative result: no sufficient public confirmation source found.)**
- Demand for every service attribute. OpenRouter exposes bucketed context and tool-calling demand, but not geography, privacy, continuous request-length distributions, or model-level demand for each other service attribute. **(negative result for those fields.)**
- Why a gap exists, whether it persists for a reason, or whether we can fill it (out of scope by design; correct).
- Historical supply quality before the tool's own first snapshot day (see S0).

---

## 2. Critical holes

### Serious

**S0. Official supply history starts when collection starts.** The endpoints API exposes latency and throughput only as last-30-minute percentiles and uptime only up to last-1-day (direct: [endpoints OpenAPI schema](https://openrouter.ai/docs/api/api-reference/endpoints/list-all-endpoints-for-a-model)). No official historical endpoint-quality API was found. This is a cold-start limit, not a build blocker.
**Patch:** self-collect. Snapshot endpoints 2–4×/day at staggered UTC hours from day 1. Mark persistence claims provisional until observations span a stated number of calendar days. Backfill demand to 2025-01-01. Treat Wayback captures and third-party dashboards as validation-grade supply history only.

**S0a. Automated label 4 is unavailable from public data.** Public uptime, price, provider churn, endpoint removal, performance, routing treatment, and dated user complaints can support a friction hypothesis. They cannot prove that customers tried and failed to buy supply. Uptime also **excludes rate-limited requests** by definition (direct: schema text "Rate-limited requests are excluded"), so capacity shortfalls can hide inside a clean uptime number.
**Patch:** cap automated classification at label 3. Keep label 4 as a manual post-BD or post-customer outcome that requires a gateway statement about the gap, a customer commitment that names an unmet requirement, or provider-side failure or capacity data. The label-3 shortlist is an input to those conversations.

**S1. Top-50 censoring plus variant splitting plus privacy exclusion.** Rankings return the top 50 models per UTC day plus one `other` row; variants of the same model (for example a `:free` variant) are **ranked separately**; requests users keep private are **excluded before aggregation** (direct: [rankings-daily docs](https://openrouter.ai/docs/api/api-reference/datasets/get-rankings-daily), [rankings page](https://openrouter.ai/rankings)). A watchlist model below the cutoff has unknown demand, not zero.
**Patch:** treat absence as a censored bound. Track presence-days. Test the models API `top weekly` sort as an ordinal signal beyond rank 50 (week-1 task). Sum paid and `:free` permaslugs separately and never merge them silently.

**S2. Endpoint ≠ provider ≠ independent capacity.** Dylan's preserved OpenRouter screenshot and an endpoints-API check for `qwen/qwen3.8-27b` showed **5 endpoints/providers** earlier on 2026-08-19 (direct screenshot; source claim for API: [[inference-model-opportunity-data-source-audit-2026-08-19|data-source audit]]). A later live-page check on the same day showed **6 providers**, adding Alibaba Cloud International (direct: [model page](https://openrouter.ai/qwen/qwen3.8-27b), accessed 2026-08-19). This proves intraday supply change. A prior four-provider observation was not preserved and is not used as evidence. One provider can run multiple endpoints; pages and API can also update at different times. Separately, aggregator or marketplace hosts can resell third-party GPU capacity, and the same underlying capacity can appear across gateways (inference).
**Patch:** store each source-specific count with its capture time. Count qualified supply over distinct provider organizations after an alias table. Tag provider class (first-party lab, dedicated host, aggregator/decentralized). Never present raw endpoint count as "independent suppliers" or as proof of scarcity.

**S3. Realized-demand survivorship.** Rankings measure served tokens. Demand that failed (429s, downtime, absent supply) never appears, and per S2/S0a the failure signal is also hidden.
**Patch:** never infer "demand is satisfied" from token presence or "no demand" from token absence. The only honest public proxy stack for friction is: sustained volume + low qualified count + price-premium share + recurring uptime dips — and even that stack reaches label 3, not 4.

**S4. Attribute-level demand is only partly observable.** The rankings API can filter exact traffic by `context_bucket` (`1K`, `10K`, `100K`, `1M`, `10M`) and by `modality=tool_calling` (direct: [rankings-daily API](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)). It also exposes sampled, upsampled weekly categories such as programming. This supports bucketed long-context and tool-use demand, but the top-50 cutoff still censors each filtered result. Nothing public gives geography, privacy, or a continuous request-length distribution per model.
**Patch:** make attribute eligibility field-specific. Context and tool-use gaps can use the filtered demand datasets. Other parameter gaps require a dated user request or another source that names the attribute. All public parameter findings still cap at label 3.

**S5. Tokens are not comparable value.** Token counts come from each upstream provider's own tokenizer, so cross-model token comparisons are officially not directly comparable (direct: rankings-daily docs). Agent workloads resend context, inflating prompt tokens. Subsidies distort: Xiaomi's launch included a large token grant (source claim: [VentureBeat, 2026-04-28](https://venturebeat.com/technology/open-source-xiaomi-mimo-v2-5-and-v2-5-pro-are-among-the-most-efficient-and-affordable-at-agentic-claw-tasks)), and `:free` variants carry zero willingness-to-pay. Demand can concentrate in one whale app.
**Patch:** report tokens with rank, not as value. Optional price-weighted value estimate labeled with wide error. Record app-concentration (top-app share from app rankings) and a subsidy flag per model.

**S6. Snapshot-time bias.** Latency/throughput are 30-minute windows and are auth-gated (unauthenticated calls return null for these fields) (direct: schema). A single daily snapshot at a fixed hour measures that hour's load, not the day.
**Patch:** snapshot 2–4×/day at staggered hours with an authenticated key; store the capture timestamp with every row; compare like hours to like hours.

### Minor

**M1. Identity drift.** Permaslug vs slug vs variants vs 85 Qwen models on one author page (direct: [openrouter.ai/qwen](https://openrouter.ai/qwen)). Patch: canonical key = official Hugging Face repo id; mapping table to OpenRouter permaslug(s) and variants; hand-map the first 10 (already planned in the hub).
**M2. Local-signal fragility.** LM Studio and Ollama have no documented public stats API (source claim: data-source audit; consistent with this session **(negative result)** — none found). HF downloads are qualifying HTTP requests, not users or executions (source claim: [HF download-stats docs](https://huggingface.co/docs/hub/en/models-download-stats)). Patch: V0 local signal = HF only; ParaPulse and Open LLM Distribution Leaderboard as validation.
**M3. Terms and licensing.** The Datasets endpoints (rankings, app rankings) are licensed **CC BY 4.0, commercial reuse allowed with attribution**, with a required citation string "Source: OpenRouter (openrouter.ai/rankings), as of {as_of}" (direct: OpenAPI Datasets tag description + rankings-daily docs). This resolves the hub's legal open question for demand data. The endpoints/models APIs carry no such license text **(negative result)** — storing snapshots is probably acceptable for a public API (inference), but read the full ToS in week 1.
**M4. Undocumented endpoint status codes.** `status` takes values {0, −1, −2, −3, −5, −10} with no published meanings (direct: schema) **(negative result on meanings)**. Do not interpret; map empirically against observed behavior.
**M5. Platform risk.** Public APIs can change without preserving the fields needed by this tool. Patch: version the collectors, store the raw response, and alert on schema drift. Acquisition news is not required to support this design rule.

---

## 3. Claim-to-evidence matrix

| Tool claim | Required evidence | Publicly available? |
|---|---|---|
| Model X has OpenRouter demand of N tokens/day | rankings-daily row | **Yes** (if top-50 that day; else censored bound) |
| Demand is growing | ≥2 windows of rankings-daily | **Yes** (history to 2025-01-01) |
| Demand is for coding/agent work | task-classification share + app mix | **Partial** (7-day sampled shares; public apps only) |
| Model X has K endpoints / J providers now | endpoints API + alias table | **Yes** (snapshot only; both counts) |
| Only Q providers are qualified for profile P | endpoint fields vs stated profile thresholds | **Partial** (params, price, limits, quant, uptime yes; tool-call error rate only via Performance-tab scrape; geo/ZDR via separate lists) |
| Scarcity is persistent | own observations across a stated number of calendar days | **No at launch** (self-collected only; cold-start limit) |
| Users cannot get what they need (confirmed unmet demand) | failure rates, refused capacity, customer asks | **No public confirmation source**; manual L4 evidence only |
| A price premium persists despite cheap listings | per-endpoint price (yes) + per-endpoint traffic share | **No officially**; scrape-based dashboards only, ±30% grade (source claim: data-source audit) |
| Long-context demand exists | `context_bucket` rankings for the relevant bucket and model | **Partial** (exact filtered traffic, but top-50-censored and bucketed rather than continuous) |
| Tool-calling demand exists | rankings with `modality=tool_calling` | **Partial** (exact filtered traffic, but top-50-censored; does not measure tool-call success) |
| Another attribute demand exists, such as geography or privacy | attribute-specific request data or named user asks | **No general public dataset**; manual evidence only |
| Local demand is high | HF downloads (+ definitions caveat) | **Yes**, as a labeled proxy |
| Local demand converts to hosted demand | user evidence | **No** (hypothesis only, per the insight note) |
| We can serve/win/profit | out of scope | **Correctly excluded** |

---

## 4. Data-source feasibility table

Access date for all live checks: 2026-08-19. "V0" = required for the first build.

| Field | Source (exact) | Auth / limits | History | Granularity | Key gaps | Reliability | V0 |
|---|---|---|---|---|---|---|---|
| Model release date | OpenRouter models/endpoints `created`; HF repo `createdAt`; model page | none / API key | full | per model | OR `created` = listing date, not weight release (inference) — prefer HF/lab date | High | **Yes** |
| OpenRouter token volume | `GET /api/v1/datasets/rankings-daily` (direct) | any OR API key; 30/min, 500/day | **2025-01-01→** (direct) | daily UTC × permaslug, top-50 + `other` | top-50 censoring; variants split; private traffic excluded; per-provider tokenizers | High | **Yes** |
| Context-bucket demand | rankings-daily with `context_bucket=1K|10K|100K|1M|10M` (direct) | same | same | daily UTC × bucket × permaslug, top-50 + `other` | bucketed, not continuous; each filtered result is censored at 50 | High | **Yes** |
| Tool-calling demand | rankings-daily with `modality=tool_calling` (direct) | same | same | daily UTC × permaslug, top-50 + `other` | proves tool use, not tool-call correctness | High | **Yes** |
| Programming and other category demand | rankings-daily with `category` or `language_type` (direct) | same | same | weekly estimated totals × permaslug | sampled and upsampled; filters cannot be combined with exact context or modality filters | Medium | **Yes**, labeled estimate |
| Token growth / rank change | derived from above | — | same | daily | censoring at edges | High | **Yes** |
| App / task use | `datasets/app-rankings` (popular, trending sorts) (direct); task classifications endpoint (source claim: 7-day window) | API key | app: windowed; task: trailing 7d | app × window; class share | public apps only; sampled shares; no absolute class volume | Medium | **Yes** |
| HF downloads + growth | HF Hub API `downloads`, `downloadsAllTime`, likes, trendingScore | none (rate-limited) | rolling 30d + all-time; **no public per-day series** — self-snapshot or ParaPulse | per repo | requests ≠ users; GGUF double-count (source claim: HF docs) | Medium | **Yes** (official repos only) |
| LM Studio downloads | model pages only | scrape | none | per package | **no API (negative result)** | Low | No (post-V0) |
| Ollama pulls | ollama.com/library pages | scrape | none | per package | **no API (negative result)** | Low | No (post-V0) |
| Provider / endpoint count | `GET /api/v1/models/{author}/{slug}/endpoints` (direct); model page provider list (direct) | key recommended (perf fields null unauth) | **no official history — self-snapshot (S0)** | per endpoint, live | endpoint≠provider (S2); page/API lag (4 vs 5 case) | High fields, snapshot-only | **Yes** |
| Price (prompt/completion/cache, tiers, discount) | endpoints API `pricing` incl. `overrides` (min_prompt_tokens, utc windows), `discount` (direct) | as above | none — self-snapshot | per endpoint | negotiated/BYOK prices invisible | High | **Yes** |
| TTFT | endpoints `latency_last_30m` p50–p99, ms (direct) | **auth-gated** | none — self-snapshot | 30-min window | time-of-day bias (S6); gateway path included (inference) | Medium | **Yes** |
| Output speed | endpoints `throughput_last_30m` p50–p99 tok/s (direct) | **auth-gated** | none — self-snapshot | 30-min window | same as TTFT | Medium | **Yes** |
| Uptime | endpoints `uptime_last_5m/30m/1d` (direct) | key | none — self-snapshot | 5m/30m/1d | **excludes rate-limited requests** (direct); null if sparse data | Medium-High | **Yes** |
| Context / output limits | endpoints `context_length`, `max_prompt_tokens`, `max_completion_tokens` (direct) | none | none — self-snapshot | per endpoint | — | High | **Yes** |
| Tool support | endpoints `supported_parameters` incl. `tools`, `structured_outputs`, `reasoning` (direct) | none | none — self-snapshot | per endpoint | declared, not tested | High | **Yes** |
| Tool-call reliability | model Performance tab "Tool Call Error Rate" (source claim: data-source audit); `:exacto` pool membership (model pages name an Exacto routing mode) (direct); OpenAPI shows an undocumented **Benchmarks** group (direct) | scrape / unknown | none | per endpoint, current | schema-validity only; scrape fragility; Benchmarks API unexplored | Low-Medium | Partial (capture exacto membership; scrape optional) |
| Quantization | endpoints `quantization` enum incl. mxfp4/nvfp4/mxfp8/unknown (direct) | none | none — self-snapshot | per endpoint | `unknown` common (speculation) | High | **Yes** |
| Privacy / ZDR | `endpoints/zdr` machine-readable list (source claim: OR docs, verified 2026-08-18 session); provider data-policy pages | key | none — self-snapshot | per endpoint | HIPAA/BAA not in endpoints API **(negative result)** | Medium | **Yes** (zdr list) |
| Geography | **not in endpoints API (negative result, direct schema read)**; provider docs/press; `eu.openrouter.ai` EU-filtered model list (direct: [docs](https://openrouter.ai/docs/api/api-reference/models/list-models-user)) | varies | none | per provider, manual | provider-declared; datacenter detail private | Low-Medium | Partial (EU-filter diff + manual table) |
| Provider start/stop dates | own snapshot diffs; Wayback model pages | — | forward from day 1 | daily | pre-launch history coarse | Medium | **Yes** (derived) |
| Provider rate limits | not published per endpoint **(negative result)** | — | — | — | only visible as user-side 429s | — | No (not measurable) |
| Capacity availability | not published **(negative result)**; `capacity_tpm` is provider→OR private manifest data | — | — | — | — | — | No (not measurable) |
| Request failures / failed demand | not published **(negative result)**; uptime excludes 429s | — | — | — | S0a/S3 | — | No (not measurable) |
| Request-length distribution | rankings-daily context buckets (direct) | API key | 2025-01-01→ | five buckets, top-50 per result | not a continuous distribution; censored when the model is outside a bucket's top 50 | High for returned rows | **Yes**, bucketed only |
| Provider-level demand share | no official dataset **(negative result)**; [or-provider-dashboard](https://or-provider-dashboard.vercel.app/) scrape, ±30% revenue error, top-30 model detail (source claim: data-source audit) | scrape | dashboard's own | model×provider | fragility; coverage holes (Qwen3.8-27B had no series 2026-08-19, source claim) | Low | Validation only |
| Cross-gateway coverage | HF Inference Providers hub API; Vercel AI Gateway catalog (source claims: data-source audit) | none/low | none | per model×provider | no demand data outside OR | Medium | Post-V0 |

---

## 5. Corrected evidence gates

**Workload profiles first.** "Qualified" is undefined without a named workload and justified requirements. A qualified count is always per `(model, workload profile)`. Do not use one default threshold set for all models. Each required field must come from observed demand, a named customer requirement, or a stated research hypothesis. OpenRouter's [public rankings interface](https://openrouter.ai/rankings) presents context buckets as broad bands. The `100K` bucket covers 10K–100K, so it cannot support a 128K requirement. The `1M` bucket can show demand in the 100K–1M band, but it still cannot isolate demand above 128K. Treat tool support the same way: tool-calling traffic can justify testing a tool profile, but it does not prove tool-call success. Compare latency and throughput with the current frontier for the same model and workload before setting a fixed limit. Store quantization and Auto Exacto evidence as facts; do not treat either as a universal qualification rule.

**Labels = gates passed, plus exits.**
- **L0 Watch.** On watchlist; no gate passed.
- **L1 Demand signal.** Each lane must state its minimum demand rule before a candidate is evaluated. Record either observed demand or expected launch demand. Observed demand can come from total, context-filtered, tool-calling, or labeled estimated category data. Expected launch demand must name its prior, such as earlier-family demand, and must not be presented as observed demand. Record top-app concentration and subsidy flags. Keep paid and `:free` volume separate.
- **L2 Demand + scarce qualified supply.** L1 plus a low qualified-supply count for a named profile. The profile and scarcity threshold must be written before the candidate is evaluated. During the supply-history cold start, mark L2 as provisional. Do not use one universal provider-count or performance threshold.
- **L3 Potential underserved opportunity.** L2 plus at least one dated public friction proxy or a direct demand-to-supply mismatch for the named attribute. Examples include recurring uptime weakness while demand persists, provider removal, persistent price or performance separation, a dated user request that names the model or attribute, 100K-context demand with little qualified long-context supply, or tool-calling demand with weak qualified tool supply. Auto Exacto treatment is supporting evidence, not a hard qualification rule. Add a written hypothesis for why the gap remains open and test disqualifying explanations such as a temporary launch spike or a first-party subsidy.
- **L4 Confirmed underserved.** Direct evidence only: a gateway-team statement about the gap, a customer commitment that names an unmet requirement, or provider-side failure or capacity data. **The automated process never assigns L4.** A human can record L4 later as a BD or customer outcome, subject to privacy rules.
- **Exit states:** `explained-not-opportunity` (gap has a disqualifying cause), `closed` (qualified count crossed threshold), `stale` (evidence older than 14 days). Log every transition; the transition history is the product.

**Two lanes.** The **launch lane** uses expected demand, earlier-family demand, release attention, and day-zero supply. It is capped at L1 or provisional L2 until observed demand and supply history arrive. The **structural-gap lane** uses observed demand, a named workload, supply history, attribute-specific demand where available, and public friction evidence. It can reach L3. The evidence label controls the claim. A separate action policy can still trigger a cheap, fast test from L1 or provisional L2.

**Strict gates vs confidence scores:** keep strict gates for **labels** (they prevent narrative welding); allow a continuous score only for **ordering within a label**. Never rank across labels with one number.

---

## 6. Minimum valid V0

**Required sources (5):** rankings-daily, including total, context-bucket, tool-calling, and labeled estimated programming queries (authenticated; backfill to 2025-01-01); models list API (discovery + `created`); endpoints API for {top-50 open-weight ∪ manual watchlist ∪ new releases}, snapshot 2–4×/day staggered; `endpoints/zdr` list daily; HF Hub API for canonically mapped official repos daily.
**Required fields:** the V0="Yes" rows in §4.
**Historical window:** demand from 2025-01-01 (backfilled); official supply quality forward-only from the first snapshot day. A persistence rule must use a stated number of calendar days and a minimum observation count. Do not treat 14 individual snapshots as 14 days.
**Model identity:** canonical key = official HF repo id; mapping table {OR slug, OR permaslug(s), variants (`:free`, `:exacto`, `:nitro`), family, version, quant repos (link, never sum)}; hand-map 10 models before automation (keeps the hub's existing next-test).
**Gates and labels:** §5 verbatim.
**Manual review:** weekly human pass over the top 10; any L3 promotion requires a human-written "why open" hypothesis and sign-off; any exit requires a one-line reason.
**Outputs:** raw JSON snapshots (append-only) + one daily markdown report: new releases, gate transitions, L2/L3 list with per-candidate evidence blocks (demand thesis; direct/claim/inference/speculation separated; missing facts; next cheapest test). Same store later feeds the dashboard.
**Validation:** (a) retrodiction — replay stored/backfilled data for MiMo-V2.5 (released 2026-04-28), Qwen3.6-27B (2026-04-27), Qwen3.8-27B (2026-08-14) and check the tool would have surfaced them at the right time with the right label; (b) weekly cross-check against or-provider-dashboard, CodeSOTA, token.app, Artificial Analysis — investigate disagreements, never average them.
**Exclusion rules:** proprietary models; non-text output (V0); `:free` volume never merged into paid; models absent from top-50 for 30 straight days with no watchlist reason. A first-party subsidy is a disqualifying hypothesis to review, not an automatic exit.

**Buckets.**
- *Required for V0:* the five sources above; gates; daily report.
- *Useful after V0:* LM Studio, Ollama, ModelScope; Performance-tab tool-call scrape; provider-share scrape; HF Inference Providers + Vercel catalogs; AA Commercial tier; Discord/Reddit ask-capture.
- *Not publicly measurable:* continuous request-length distribution; capacity; failed demand; official per-provider token share; geography-specific and privacy-specific demand volumes; automated L4 confirmation.
- *Not worth collecting:* ModelUptime-style probes (path ambiguity, per its own methodology); single-machine telemetry projects; automated social sentiment at V0.

---

## 7. Sample candidate records (what the tool could conclude today)

**Qwen3.8-27B** (`qwen/qwen3.8-27b`, released 2026-08-14 (direct: model page)).
- Demand: [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|the captured model-page evidence]] reports approximately 24.60 billion prompt-plus-completion tokens and 1.49 million requests for the complete 2026-08-18 UTC day, plus high local-download activity. This proves substantial realized activity on that day, not durable paid demand or broad customer concentration.
- Qualified supply: the preserved screenshot and one same-day API check showed five endpoints/providers. A later live model-page check showed six providers. Store both dated observations as an intraday supply change. Qualification remains unknown until a named workload profile is applied to the endpoint fields.
- Possible attribute gap: query the official `1M` context bucket and `tool_calling` filter before claiming broad demand above 100K or agent demand. The `1M` bucket still cannot isolate requests above a 128K threshold. A preserved earlier screenshot displayed a 262K model context limit, while the later live model page displayed 1,000,000 tokens and individual endpoints still had different limits. Store model-page and endpoint limits with capture times. None of these supply limits is demand evidence.
- Confidence: **L1 observed demand; L2 provisional only after a named supply profile is tested.**
- Strongest permitted conclusion: "New open-weight model with strong local activity and one day of substantial OpenRouter activity. Same-day supply counts disagree. It is a candidate for a live demand-and-supply record, not yet a qualified-supply finding."

**Xiaomi MiMo-V2.5 / -Pro** (released 2026-04-28, MIT (direct: prior session, Xiaomi/VentureBeat)).
- Demand: ranked #1 by daily tokens with ~5 providers in the 2026-08-17/18 research pass (source claim: prior deep-research session; **stale — re-pull**). Subsidy flag: Xiaomi 100T-token grant reported (source claim: VentureBeat) → demand-quality caveat.
- Qualified supply: count unknown against any profile (missing).
- Possible gap: model-level scarcity at the top of the rankings (if re-pull confirms).
- Confidence: **L2-provisional**, pending fresh rankings row + endpoint snapshot + subsidy assessment.
- Strongest permitted conclusion: "As of the ~Aug-17 snapshot, top-ranked demand with roughly five providers — a potential scarcity signal that is unconfirmed for gate 3 and possibly subsidy-inflated."

**Qwen3.6-27B** (released 2026-04-27 (direct: model page)).
- Demand: family prior for 3.8; own current rank unchecked.
- Supply: 7 providers incl. DeepInfra, SiliconFlow, CoreWeave, Alibaba (direct, 2026-08-19); has AA benchmarks (direct: page).
- Conclusion: raw provider count does not show obvious scarcity, but the model cannot pass or fail gate 2 until a named profile defines qualified supply. Use it as a control case and as the demand prior for the Qwen3.8 launch lane.

**GLM-5.2.**
- Supply: ~27 providers (source claim: prior research pass, ~2026-08-17; stale). Demand: high (same pass).
- Conclusion: likely supply-saturated by raw count, subject to a fresh pull and named-profile qualification. Use it as a saturation control instead of forcing an exit from stale counts.

**Qwen3-8B** (released 2025-04-28 (direct: page)).
- Supply: **one provider** — "hosted by one provider… no routing decisions" (direct: page). Demand: not in any recent top-50 evidence found (unverified).
- Conclusion: low count with no demand evidence = **L0, not an opportunity**. Demonstrates "low provider count can mean low demand" — the exact failure the gates exist to prevent.

---

## 8. Scope recommendation

**Scope the collection spine now.** No public-data hole blocks collection. Official supply-quality history begins when the tool starts taking snapshots. Automated classification stops at L3, while a human can record L4 after BD or customer evidence. Before the database fields and promotion rules are frozen, complete one end-to-end live candidate record and one low-demand control record.

**Answer these in week 1, inside the build:**
1. Open-weight density in the daily top 50 — one backfill pull answers it (hub open question).
2. Full OpenRouter ToS read for endpoint/model snapshot storage (Datasets are CC BY 4.0 with a required citation string (direct); the rest is unlicensed text **(negative result)**).
3. Probe the undocumented **Benchmarks** and **Providers** API groups found in the OpenAPI spec (direct) before building any page scraper — tool-call error rate and provider metadata may already be machine-readable.
4. Hand-map 10 canonical identities, including one rename/permaslug case.
5. Test whether the models API `top weekly` sort yields usable ordinal demand beyond rank 50.
6. Empirically map the endpoint `status` codes {0,−1,−2,−3,−5,−10} (direct: schema; meanings undocumented).
7. Pull total, `context_bucket`, `tool_calling`, programming-category, and programming-language rankings for Qwen3.8-27B and a low-demand control. Record where top-50 censoring prevents a result.
8. Apply one written workload profile to both models and confirm that every qualification field has a demand source or an explicit research hypothesis.
9. Store the public display label and API version for each context bucket with every collection. Do not infer a range from the enum name alone, and alert if OpenRouter changes the labels.

**Do not build yet:** any gateway scraper (pending #3), local-tool scrapers, cross-gateway supply join, social listening. **Never build into V0:** hardware matching, serving tests, capacity planning, unit economics (per the 2026-08-19 scope correction in the hub).

---

## Links

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] (audited project)
- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference model opportunity data-source audit]] (prior pass this audit builds on)
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[inference|Inference]]

## Updates

- 2026-08-19: Initial capture. Live checks: rankings-daily docs, endpoints OpenAPI schema, Qwen3.8-27B / Qwen3.6-27B / Qwen3-8B model pages, Qwen author page. Notable side finding: the endpoints API ProviderName enum includes **Wafer** as a live OpenRouter provider and does **not** include Telnyx (direct, 2026-08-19).
- 2026-08-19: Corrected after design review. The missing official supply history is a cold-start limit, not a build blocker. The current rankings API exposes exact context-bucket and tool-calling demand plus sampled weekly categories. Universal workload thresholds were removed. The design now separates a fast launch lane from a persistent structural-gap lane, caps automated labels at L3, and keeps L4 as a manual evidence outcome.
