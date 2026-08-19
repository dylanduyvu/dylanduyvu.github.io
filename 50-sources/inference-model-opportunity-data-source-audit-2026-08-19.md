---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: web-research
domains: [inference, model-serving, inference-marketplaces, market-research]
people: []
orgs: [openrouter, hugging-face, lm-studio, ollama, artificial-analysis, modelscope, vercel, codesota]
tags: [model-demand, provider-supply, public-data, downloads, tokens, performance, opportunity-screen]
---

# Public data can support an inference-model opportunity radar

## Research Question

Dylan asked how to find two types of provider opportunity:

1. day-zero service for a strong new Chinese open-weight model; and
2. an existing model with demand, scarce provider supply, or an underserved performance attribute.

He also proposed comparing local downloads with serverless inference tokens to separate models that users run locally from models that users consume through APIs.

## Bottom Line

A useful first dashboard is possible with mostly public data. OpenRouter now exposes daily model token totals and machine-readable endpoint supply. Hugging Face, LM Studio, and Ollama provide local-use signals. Artificial Analysis provides independent price, performance, and benchmark data.

The important limitation is that these sources measure different events. A download is not a user, execution, token, GPU-hour, or dollar of revenue. The dashboard should compare age-adjusted ranks or percentiles instead of treating downloads and tokens as directly equivalent units.

OpenRouter is sufficient as the primary hosted-demand surface for a first dashboard whose immediate decision is what to serve and pitch to OpenRouter. It is not sufficient for a claim about the total inference market. The first version should call its metric `OpenRouter demand`, then use local-distribution and other-gateway catalogs to show where the OpenRouter view is incomplete.

## OpenRouter Demand Data

### Daily model token totals

[OpenRouter's daily rankings endpoint](https://openrouter.ai/docs/api/api-reference/datasets/get-rankings-daily) is the strongest public hosted-demand source found in this pass.

- Endpoint: `GET /api/v1/datasets/rankings-daily`
- Output: the top 50 public models for each UTC day by total tokens, plus one `other` row for the remaining models.
- Token definition: prompt tokens plus completion tokens.
- History begins: 2025-01-01.
- Default window: 30 days ending on the most recent complete UTC day.
- Authentication: any valid OpenRouter API key.
- Limits: 30 requests per minute per key and 500 requests per day per account.
- Important caveat: token counts use each upstream provider's tokenizer. A token for one model is not always equivalent to a token for another model.

The top-50 limit creates censored data. A model that is absent does not have zero hosted demand. It is below that day's fiftieth-place threshold. The threshold can still provide an upper bound.

### Use-case and application demand

- [Task classifications](https://openrouter.ai/docs/api/api-reference/classifications/get-task-classifications) report sampled request and token shares for Code, Data, Agent, and General categories. They also show the top models within each class. Only a trailing seven-day window is currently available, and absolute classified volume is not exposed.
- [App rankings](https://openrouter.ai/docs/api/api-reference/datasets/get-app-rankings) report public application request and token totals. They can be filtered for categories such as coding and command-line agents. Private and hidden applications are excluded.

These sources help test whether a model's demand matches the intended customer. A coding model with high aggregate tokens but little coding-agent share is a weaker target than its headline rank suggests.

## OpenRouter Supply and Performance Data

### Model discovery

[The model-list API](https://openrouter.ai/docs/api/api-reference/models/get-models) supports machine-readable sorting by:

- newest;
- top weekly token use;
- popularity;
- price;
- context length;
- throughput;
- latency;
- Artificial Analysis intelligence score; and
- Design Arena rating.

It also supports an RSS response. This makes it suitable for a day-zero release watchlist.

### Provider count and endpoint attributes

[The endpoint-list API](https://openrouter.ai/docs/api/api-reference/endpoints/list-endpoints) returns the providers for one model. A direct check for `qwen/qwen3.8-27b` on 2026-08-19 returned five endpoints and these machine-readable fields:

- provider name and endpoint tag;
- price for prompt, completion, and cache reads;
- context, prompt, and completion limits;
- quantization;
- supported parameters, including tools and structured outputs;
- implicit caching support;
- latency percentiles;
- throughput percentiles; and
- uptime over five minutes, 30 minutes, and one day.

OpenRouter's model Performance tabs add a public [Tool Call Error Rate](https://openrouter.ai/docs/guides/routing/auto-exacto). This measures the share of tool-calling requests with invalid JSON, an unknown tool name, or arguments that do not match the supplied JSON Schema.

OpenRouter states that its normal routing favors price and stability. Auto Exacto changes tool-calling provider order using throughput, tool-call success, and evaluation data. This makes the visible endpoint metrics commercially relevant, not only descriptive.

## Local-Use Data

### Hugging Face

[The Hugging Face Hub API](https://huggingface.co/docs/hub/api) and `huggingface_hub` client expose:

- recent downloads and all-time downloads;
- likes and trending score;
- creation and modification dates;
- tags, libraries, applications, and model format;
- parameter and GGUF metadata; and
- inference-provider mappings.

Search must include the official weights and important GGUF, MLX, AWQ, GPTQ, FP8, and other quantized versions. These repositories should be mapped to one base model. They should not be summed as unique users.

[Hugging Face's download-stat definition](https://huggingface.co/docs/hub/en/models-download-stats) says that downloads are qualifying HTTP requests. GGUF file requests count separately, and a full repository clone can count more than once. The metric does not identify unique people, successful installations, model executions, or inference tokens.

### LM Studio and Ollama

- [LM Studio's catalog](https://lmstudio.ai/models) displays model downloads, stars, model size, memory requirements, supported formats, capabilities, and update time. No stable public catalog-stat API was found in this pass, so collection may require a page snapshot or direct agreement.
- [Ollama's model library](https://ollama.com/library) displays pull counts, model variants, file sizes, quantization, and recency. No documented public catalog-stat API was found in this pass.

These are useful local-adoption channels because they represent tools used to install and run models. They still measure downloads or pulls, not active use.

### ModelScope

ModelScope is important for Chinese model demand and distribution. This pass did not find clear official documentation for a public model-popularity API. Model pages and community activity can be captured as secondary signals, but the method and access limits need a separate check.

## Independent Performance Data

[Artificial Analysis](https://artificialanalysis.ai/data-api/docs) exposes structured model metadata, benchmarks, prices, and performance.

- Free tier: headline indices, median performance, and input and output prices; 100 requests per 24-hour window.
- Pro tier: model-level detail, full pricing, percentiles, context, parameters, modality, licensing, and Hugging Face and OpenRouter identifiers; 500 requests per 24-hour window.
- Commercial tier: provider-level data, seven-, 30-, and 90-day performance history, and possible measurement and hardware data.

Its provider time series includes output speed, time to first token, time to first answer token, and end-to-end response time. The provider-level history requires Commercial access. The public or Free data is still useful for model-level capability and market-frontier checks.

## Existing Dashboard and Tool Landscape

The search found several tools that already cover parts of the proposed radar. The differentiated product is the joined decision layer, not another general OpenRouter chart.

### OpenRouter demand and provider competition

- [OpenRouter Inference Provider Market Share](https://or-provider-dashboard.vercel.app/) measures host share, token volume, estimated revenue, provider changes, and model-level host competition. It scrapes OpenRouter provider pages. Complete provider totals include the long-tail `Others` bucket, but model and revenue detail is limited to the top 30 models plus each provider's top models. Its stated revenue error range is approximately plus or minus 30 percent because input-output mix, long-tail price, historical price, Bring Your Own Key, and negotiated rates are not fully visible. A live metadata check on 2026-08-19 showed 63 providers and 269 tracked models. The Qwen3.8-27B model endpoint returned no series at that time, which demonstrates that a new candidate can fall outside the model-detail slice even when the dashboard covers its providers. Exa did not find a public source repository in this pass.
- [CodeSOTA's OpenRouter dashboard](https://ort.fabryka.ai/dashboard.html) measures model and lab volume, churn, substitution, lifecycle stage, application demand, and estimated spend. Its [methodology](https://ort.fabryka.ai/assumptions.html) combines current OpenRouter frontend statistics, provider or author pages, application pages, and Internet Archive snapshots. It explicitly labels OpenRouter as one market slice and labels its market-scaling and revenue assumptions.
- [token.app](https://token.app/) combines OpenRouter usage rankings with model prices, subscriptions, task demand, and application rankings. It states that pricing and rankings refresh hourly. This is a broad comparison surface, not a supply-gap or edge-feasibility screen.
- [Dirac's lab market-share dashboard](https://dirac.run/labs-market-share) tracks daily OpenRouter tokens by model author. [Jimmy Research's provider dashboard](https://www.jimmyresearch.com/openrouter/) estimates provider revenue from OpenRouter provider pages. These are useful cross-checks, but they do not add local demand, build feasibility, or hardware economics.

### Local adoption

- [LM Studio Trending Models](https://lmstudio.ai/trending/models) ranks models using downloads, stars, and forks. Individual model pages expose package-level download counts and memory requirements.
- [ParaPulse](https://parapulse.io/) stores daily Hugging Face download snapshots and calculates seven- and 30-day changes, growth, and comparison charts. It says it records the top 5,000 models every 24 hours and retains history that Hugging Face does not expose directly.
- [Open LLM Distribution Leaderboard](https://osolmaz-leaderboard.hf.space/) groups official, quantized, and component repositories into model families, normalizes downloads by model age, and writes daily snapshots. This directly addresses part of the identity-resolution and release-age problem.
- [Hugging Face Data for Research](https://huggingface.co/HF-Data-for-Research) points to daily Hub snapshots and warns that download counts work better for trends and relative comparisons than for absolute fine-grained rankings.
- [Ollama's library](https://ollama.com/library) exposes popularity order and per-package downloads. The search found no robust public Ollama usage census. One opt-in community telemetry project existed, but its displayed sample was one machine and was not useful as a market measure.

### Cross-gateway supply and serving quality

- [Hugging Face's Inference Providers Hub API](https://huggingface.co/docs/inference-providers/en/hub-api) exposes provider mappings, status, context, price, tool and structured-output support, time to first token, throughput, and whether the endpoint is first-party. It does not expose aggregate provider token demand.
- [Vercel AI Gateway's public catalog](https://vercel.com/ai-gateway/models) exposes model, provider, price, context, capability, release, latency, and throughput fields. It is useful for cross-gateway supply comparison, but the search found no public aggregate market-demand dataset comparable with OpenRouter rankings.
- [Artificial Analysis](https://artificialanalysis.ai/) compares model quality, cost, latency, and output speed across direct inference providers. Its [performance method](https://artificialanalysis.ai/methodology/performance-benchmarking) tests one-thousand-, ten-thousand-, and one-hundred-thousand-token prompts, plus vision and parallel loads. Standard public measurements are represented as the median over the prior 72 hours. It measures endpoint performance, not demand.
- [ModelUptime](https://www.modeluptime.com/methodology/) derives reliability from repeated AILatency probes through OpenRouter. The method is transparent, but the measured path includes the monitor, network, gateway, routing, and upstream endpoint. It cannot assign a slowdown or failure to one component.

### What remains unbuilt

No tool found in this pass combines all of these in one candidate record:

1. release timing and prior-family momentum;
2. OpenRouter demand and application mix;
3. qualified supply across OpenRouter, Hugging Face, and Vercel;
4. local download velocity with repository-lineage handling;
5. a service edge that the provider can realistically beat; and
6. hardware cost, utilization, and unit economics.

The radar should therefore reuse or validate against existing dashboards where possible. Its unique job is to join model identity across sources, score the gap, preserve measurement limits, and produce the next test.

## Measurement Method

### Normalize model identity first

Create one canonical record per model version. Map:

- official repository;
- quantized and converted repositories;
- OpenRouter permanent slug;
- LM Studio catalog entry;
- Ollama tag;
- ModelScope model ID; and
- aliases used by providers.

Do not combine different versions such as Qwen3.6-27B and Qwen3.8-27B. Do not combine a base model with a fine-tune unless the analysis is explicitly at family level.

### Use daily snapshots and age-adjusted velocity

For a new model, cumulative counts favor older models. Store daily snapshots and calculate:

- downloads per day since release;
- change in downloads over one, three, and seven days;
- serverless tokens over one, three, seven, and 30 days;
- provider-count change;
- price and performance-frontier change; and
- time from weight release to first provider, fifth provider, and tenth provider.

For day-zero work, prior-family momentum is also useful because exact token demand will not exist before release.

### Compare ranks, not raw units

Create separate standardized scores for local and hosted demand:

- **Local score:** age-adjusted Hugging Face downloads, LM Studio downloads, Ollama pulls, likes, trending score, and quant-repository growth.
- **Hosted score:** OpenRouter daily tokens, weekly rank, task-classification share, public app use, and growth.

Use percentiles or standardized ranks inside comparable age groups. Do not calculate one literal `downloads / tokens` conversion rate.

This gives four useful groups:

| Local score | Hosted score | Interpretation |
| --- | --- | --- |
| High | High | Hybrid demand. Users want both local control and hosted scale. |
| High | Low | Possible API conversion gap, or a genuinely local-only model. Requires user testing. |
| Low | High | Hosted-first demand. The model may be too large, closed, or mainly embedded in applications. |
| Low | Low | Weak or unproven demand. Provider scarcity is probably not an opportunity by itself. |

### Score scarcity correctly

Provider count should reduce, not increase, the opportunity score. Use demand multiplied by a scarcity score such as `1 / provider_count`, or use demand divided by provider count. A literal `demand × provider_count` rewards crowded models.

Provider count is only the first supply measure. Also record:

- number of providers that meet a minimum uptime threshold;
- number that support the required context, tools, privacy, and geography;
- spread between the best and median price;
- spread between the best and median latency and throughput; and
- change in provider count after release.

### Separate opportunity from feasibility

A useful model-opportunity score needs four separate gates:

1. demand;
2. provider scarcity;
3. a measurable service edge; and
4. positive unit economics on available hardware.

The performance edge can be price, time to first token, throughput, uptime, context, tool-call reliability, privacy, or geography. The dashboard should show the edge as a gap to beat, not assume that another provider can achieve it.

## Recommended Dashboard Views

1. **Release radar:** new open models, release age, lab, size, license, early download velocity, and first provider count.
2. **Demand-scarcity table:** hosted tokens, local score, provider count, and demand multiplied by scarcity.
3. **Local versus hosted map:** the four groups above.
4. **Provider frontier:** price, latency, throughput, uptime, context, tools, privacy, geography, and quantization for each endpoint.
5. **Opportunity watchlist:** candidates with a written thesis, missing evidence, service edge to beat, hardware estimate, and next test.

## Evidence Boundary

- OpenRouter is one gateway, not the complete serverless-inference market.
- Public token data is limited to the top 50 models each day.
- Different model tokenizers limit cross-model token comparisons.
- Local download sources can double count requests and do not show active use.
- Private applications and direct provider traffic are missing.
- Provider share inside one model is not available in the official public datasets found here. Unofficial dashboards reconstruct it by scraping OpenRouter provider pages, with narrower model-detail coverage and scraper fragility.
- Tool-call metrics test schema validity, not whether the tool selection was useful or correct.
- Social attention is an event signal, not paid demand.

## Links

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[local-download-velocity-and-serverless-token-volume-measure-different-demand|Local download velocity and serverless token volume measure different demand]]
- [[dave-friedman-hugging-face-downloads-compute-markets-2026-07-09|Dave Friedman: Hugging Face downloads and compute markets]]
- [[qwen3-8-27b-may-have-local-demand-ahead-of-gateway-supply|Qwen3.8-27B may have local demand ahead of gateway supply]]
- [[inference|Inference]]
