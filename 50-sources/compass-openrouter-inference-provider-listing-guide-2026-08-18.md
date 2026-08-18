---
type: source
status: raw
created: 2026-08-18
updated: 2026-08-18
source_date: 2026-08-18
source_type: automated_research
domains: [inference, model-serving, inference-marketplaces, compute-economics]
people: []
orgs: [openrouter, stripe, hugging-face, vercel, cloudflare, chutes]
source_file: compass_artifact_wf-4adf6cd0-dfea-554e-b677-5a29b659d40b_text_markdown.md
source_sha256: 7bf8898407346303b864f9bb989983c0e39ddc61f552b327e495f28db7ee7cc5
tags: [openrouter, provider-onboarding, routing, reliability, distribution]
---

> [!warning] Evidence status
> This note preserves a Compass-generated research artifact. It contains source claims and inferences. Its citations and time-sensitive figures have not been independently verified. Do not treat them as verified evidence until they are checked against the original sources.

# How to Become a Listed Inference Provider on OpenRouter: An Authoritative Guide

*Written in ASD-STE100 Simplified Technical English. Current date: August 18, 2026. Every claim has an inline source. Where a fact is not sourced, the text labels it "unverified" or "inference".*

## TL;DR (Key Action Items)

- **Meet the four hard requirements first.** You must have an OpenAI-compatible `/chat/completions` endpoint with streaming and usage tokens, a `/models` endpoint with full metadata, support for monthly invoicing, and a published privacy and data-retention policy. OpenRouter will not review applications that miss these (openrouter.ai/providers/apply).
- **Apply through the form, not by email.** Fill out the provider form at openrouter.ai/how-to-list. Expect a technical review, then a test-traffic phase, then go-live (openrouter.ai/providers/apply).
- **Do not expect fast acceptance.** OpenRouter states demand is high, not all providers are accepted, and priority goes to providers that fill network gaps (openrouter.ai/providers/apply). Its first supply-side partnerships hire is tasked to "own and execute OpenRouter's strategy for growing and managing our global network of LLM and inference providers", and the job post says inbound provider interest "outpaces our capacity to action it" (jobs.ashbyhq.com/openrouter; zerogtalent.com).
- **Differentiate beyond price.** Default routing is price-weighted, so competing on price alone is a race to the bottom (openrouter.ai/blog/insights/model-routing). Compete also on throughput, uptime, tool-call reliability, ZDR/HIPAA, geography, and context length.
- **Treat OpenRouter as one channel, not the only one.** Volume is large, but consider Hugging Face Inference Providers, Vercel AI Gateway, and hyperscaler marketplaces as complements (see Alternatives).

---

## Key Findings

1. **OpenRouter is the largest LLM marketplace and sends very large volume.** OpenRouter's May 26, 2026 Series B announcement states: "OpenRouter's volume has surged to 25 trillion tokens per week (100 trillion tokens per month), representing a 5X increase from the 5 trillion tokens processed per week just six months ago", across 8M+ developers and 400+ models (businesswire.com). This makes listing attractive.
2. **The bar to apply is concrete and public.** OpenRouter publishes exact technical requirements and a full `/models` schema (openrouter.ai/docs/guides/get-started/for-providers).
3. **Acceptance is selective and slow.** OpenRouter accepts on a rolling basis, does not accept all providers, and prioritizes providers that fill gaps (openrouter.ai/providers/apply).
4. **Routing is price-weighted by default.** OpenRouter picks the cheapest stable provider, weighted by the inverse square of price (openrouter.ai/blog/insights/model-routing). This pressures margins.
5. **Metrics are public and drive traffic.** TTFT, throughput, and uptime show on every model page and change how much traffic you get (openrouter.ai/providers/apply).
6. **The Stripe acquisition adds uncertainty.** Bloomberg reporters Yazhou Sun, Natasha Mascarenhas and Paige Smith reported August 16, 2026: "Stripe Inc. has finalized an agreement to acquire OpenRouter Inc., a startup that helps companies switch between artificial intelligence models, for more than $7 billion, according to people familiar with the matter" (bloomberg.com). No provider-term changes are announced.

---

## Details

### A. The official requirements and process

#### The four mandatory requirements

OpenRouter lists four requirements. Applications that do not meet them "will not be reviewed" (openrouter.ai/providers/apply):

1. **OpenAI-compatible API.** Your `/chat/completions` endpoint must be OpenAI-compatible. It must return usage tokens for both stream and non-stream requests. It must support streaming (openrouter.ai/providers/apply).
2. **List models endpoint.** You must publish a `/models` endpoint. It must return your models with pricing, context length, max output tokens, supported features, and datacenter locations (openrouter.ai/providers/apply).
3. **Automated payment.** You must support monthly invoicing so OpenRouter can pay for inference without manual work (openrouter.ai/providers/apply).
4. **Privacy and data policy.** You must have a published privacy policy and clear data-retention terms. You must disclose whether you log prompts and whether you use data for training (openrouter.ai/providers/apply).

#### The four-step process

OpenRouter describes four steps (openrouter.ai/providers/apply):

1. **Submit your application.** Give details about your infrastructure, API endpoints, supported models, and data policies.
2. **Technical review.** OpenRouter evaluates your API compatibility, endpoint reliability, pricing, and performance against network standards.
3. **Integration and testing.** Accepted providers are onboarded with test traffic to validate latency, throughput, and error handling.
4. **Go live.** Your models become available and begin to receive production requests routed by performance and price.

To start, fill out the form at openrouter.ai/how-to-list (openrouter.ai/docs/guides/get-started/for-providers). For contact, email is best; the provider address is providers@openrouter.ai (shown as the FAQ contact on the apply page) (openrouter.ai/providers/apply). For general support, use support@openrouter.ai and the Discord #help forum (openrouter.ai/support).

#### The /models endpoint schema (new modality-object format, schema_version 2.4)

The new format describes each model as typed input and output modality objects. Each modality owns its own capabilities, constraints, pricing, and capacity (openrouter.ai/docs/guides/get-started/for-providers).

**Identity fields (required unless noted):** `schema_version`, `id` (the exact model identifier OpenRouter calls), `name`, `hugging_face_id` (required if the model is on Hugging Face), `created`, `quantization` (or null), `tokenizer` (optional), `description` (openrouter.ai/docs/guides/get-started/for-providers).

**Modalities.** A document must declare at least one input modality and at least one output modality. Valid input types are `text`, `image`, `video`, `audio`, `file`. Valid output types are `text`, `image`, `video`, `speech`, `transcription`, `embeddings`, `rerank`, `audio` (openrouter.ai/docs/guides/get-started/for-providers).

**Pricing.** Pricing uses arrays nested on the modality that owns them. Each entry has a `type`, a `unit`, and a `cost_usd` string. All `cost_usd` fields are strings, to avoid floating-point errors, and must be USD. Input types are `prompt`, `cached_prompt`, `cache_write`. Output types are `completion`, `internal_reasoning`. Root request types are `request` and `web_search` (openrouter.ai/docs/guides/get-started/for-providers).

**Tiered and conditional pricing.** The new format uses `overrides` with a `when` predicate for conditional pricing, such as long-context tiers. Operators are `equals`, `gte`, `lte`, and `min_items`, with `allOf`, `anyOf`, and `not` for composition (openrouter.ai/docs/guides/get-started/for-providers). The legacy flat format instead uses a pricing array of up to two tiers, where tier 0 is the base and tier 1 applies at or above a `min_context` threshold (openrouter.ai/docs/guides/get-started/for-providers).

**Cache and time-of-day pricing.** Cache prices are first-class SKUs with a `ttl_seconds` qualifier and an `implicit` flag. Time-of-day prices use `utc_start` and `utc_end` (HHMM in UTC) qualifier fields (openrouter.ai/docs/guides/get-started/for-providers).

**Capacity.** Each modality can carry a `capacity` array. Each entry has a `type`, `unit`, `per` window (`minute`, `hour`, `day`), and integer `value`. Output and root entries can also use `concurrency` (openrouter.ai/docs/guides/get-started/for-providers).

**Quantization values.** Valid values are `int4`, `int8`, `fp4`, `mxfp4`, `nvfp4`, `fp6`, `fp8`, `mxfp8`, `fp16`, `bf16`, `fp32`. Use null when undeclared (openrouter.ai/docs/guides/get-started/for-providers).

**Datacenters and compliance.** Declare `datacenters` with ISO country code and region. Declare `compliance` with `zdr` (zero data retention) and `hipaa`. More flags (SOC 2, GDPR, FedRAMP) may be added over time (openrouter.ai/docs/guides/get-started/for-providers).

**Operational fields.** `deprecation_date` (ISO 8601), `is_ready` (launch control), `is_free` (free-variant marker), `discount_to_user` (a decimal fraction, sent as a number), and `openrouter.slug` (openrouter.ai/docs/guides/get-started/for-providers).

- `is_ready: false` keeps a new model hidden and takes a live model offline. This helps you upload a model before an announcement (openrouter.ai/docs/guides/get-started/for-providers).
- `is_free: true` marks a free endpoint and ignores any pricing sent with it (openrouter.ai/docs/guides/get-started/for-providers).
- `discount_to_user: 0.2` shows users a 20% lower price. A negative value applies a markup (openrouter.ai/docs/guides/get-started/for-providers).

The full schema is an OpenAPI 3.1 JSON document, downloadable from the provider docs (openrouter.ai/docs/guides/get-started/for-providers).

**Legacy flat format.** The old format (a flat `pricing` object with `pricing.overrides`, `supported_sampling_parameters`, `supported_features`, and `capacity_tpm`) remains supported for existing integrations. Use the new format for all new integrations (openrouter.ai/docs/guides/get-started/for-providers). In the legacy format, valid features are `tools`, `json_mode`, `structured_outputs`, `logprobs`, `web_search`, `reasoning` (openrouter.ai/docs/guides/get-started/for-providers).

#### Payment and reconciliation

OpenRouter pays providers through monthly invoicing. It sets up payment details during onboarding (openrouter.ai/providers/apply). To let OpenRouter pay automatically, you must support auto top-up or invoicing (openrouter.ai/docs/guides/get-started/for-providers). You set your own per-token pricing in USD, and OpenRouter reconciles token counts automatically (openrouter.ai/providers/apply).

#### Uptime monitoring and routing thresholds

OpenRouter calculates uptime as successful requests divided by total requests, and it excludes user errors (openrouter.ai/docs/guides/get-started/for-providers).

**Errors that count against uptime:** authentication (401), payment (402), model not found (404), all server errors (500+), mid-stream errors, and successful requests with error finish reasons (openrouter.ai/docs/guides/get-started/for-providers).

**Errors that do not count:** bad requests (400), oversized payloads (413), rate limiting (429, tracked separately), and geographic restrictions (403, tracked separately) (openrouter.ai/docs/guides/get-started/for-providers).

**Routing thresholds:** you need 100+ requests before uptime calculation starts. 95%+ uptime gives normal routing. 80–94% gives degraded status and lower priority. Below 80% gives down status, used only as fallback (openrouter.ai/docs/guides/get-started/for-providers).

#### Performance metrics

OpenRouter publicly tracks TTFT (time to first token) and throughput (tokens per second) on each model page (openrouter.ai/docs/guides/get-started/for-providers). It calculates throughput as output tokens divided by generation time, and generation time includes fetch latency, TTFT, and streaming time. So any queueing on your side shows in your throughput (openrouter.ai/docs/guides/get-started/for-providers).

To keep metrics competitive (openrouter.ai/docs/guides/get-started/for-providers):
- Return early 429s under load instead of queueing requests.
- Stream tokens as soon as they are available.
- Send SSE comments as keep-alives for slow reasoning models, or OpenRouter may cancel with a fetch timeout and fall back.

OpenRouter also tracks latency and throughput as p50, p75, p90, and p99 percentiles over a rolling 5-minute window (openrouter.ai/docs/guides/routing/provider-selection).

#### Auto Exacto: tool-calling routing

Auto Exacto reorders providers for all requests that include tools. It runs by default. It does not affect non-tool traffic, which follows price-weighted routing (openrouter.ai/docs/guides/get-started/for-providers).

It uses three signals: throughput, tool-calling success rate, and benchmark data from internal evaluations (openrouter.ai/docs/guides/get-started/for-providers).

**Thresholds** (openrouter.ai/docs/guides/get-started/for-providers):
- **Benchmark accuracy:** a baseline from the first ~21 days of benchmarking, computed as the median minus 2 standard deviations (median − 2σ). Score below the cutoff, or missing data, causes deprioritization.
- **Throughput:** deprioritized if more than 1.5 standard deviations below the median.
- **Tool-calling success rate:** deprioritized if more than 2 standard deviations below the median.

**Data minimums:** a minimum of 4 providers is required before live thresholds are computed. An endpoint needs at least 100 general requests (30-minute window) and 200 tool-call requests (2-hour window) before evaluation (openrouter.ai/docs/guides/get-started/for-providers).

**Three tiers:** Good (top priority), Insufficient data (behind good, ahead of deprioritized), and Deprioritized (routed last) (openrouter.ai/docs/guides/get-started/for-providers). Consistent 429s reduce the data available for a fair evaluation, so minimize rate limits where possible (openrouter.ai/docs/guides/get-started/for-providers).

#### The provider dashboard

Once onboarded, the OpenRouter team can give you access to a provider dashboard. It shows the same throughput, tool-call success, and benchmark metrics that drive Auto Exacto (openrouter.ai/docs/guides/get-started/for-providers). OpenRouter says it will make internal benchmark data available in the provider dashboard so you can review and reproduce the benchmarks (openrouter.ai/docs/guides/get-started/for-providers).

#### BYOK implications for providers

BYOK (bring your own key) is mainly a buyer feature: developers add their own provider key, and OpenRouter routes directly using that key and the developer's own billing (tech-insider.org). For a provider, this means some traffic comes through a customer's own account and direct billing relationship, not through OpenRouter's credit pool. OpenRouter charges the developer a BYOK fee (about 5% after a free allowance) but passes inference at your list price (usagepricing.com). *Inference:* BYOK lets a provider keep a direct billing relationship while still gaining OpenRouter routing; OpenRouter documentation does not describe separate provider-side BYOK terms, so treat this as inference.

### B. The gaps you asked about

#### 1. Provider onboarding accounts and traffic

**Inceptron (new EU provider).** Inceptron launched on OpenRouter and reported over 1 billion tokens per day within three weeks. It described itself as the only Swedish provider and the second AI studio in Europe (linkedin.com/posts/nima-karimi). Within its first month, it reported a jump from about 2 billion to 10 billion tokens per day "basically overnight" from real workloads (linkedin.com, Lucas Ferreira). By July 30, 2026, it reported 20 billion tokens in a single day across GLM 5.2, Kimi K2.6, MiniMax M2.5, and Kimi K2.7 Code (linkedin.com/posts/inceptron). This suggests a fast traffic ramp once live.

**Telnyx (application-prep account).** Telnyx documented its OpenRouter application prep in a public GitHub pull request. It notes onboarding "is application-based rather than a normal upstream code PR" and lists a readiness packet: model metadata, validation commands, endpoint fit, and unresolved pricing, billing, privacy, and capacity fields (github.com/team-telnyx/ai/pull/246). Its blockers before submission included launch model set, USD-per-token pricing, max output tokens and supported params, datacenter country codes and capacity TPM, payment/invoicing path, and privacy terms (github.com/team-telnyx/ai/pull/246). This is a useful checklist template.

**Chutes.** Chutes is a top provider on OpenRouter and runs billions of tokens per day through it (subnetalpha.ai). Chutes removed a sponsored free tier of about 20 billion tokens per day that ran via OpenRouter (a TNG Tech program), which shows sponsored free programs are meaningful and time-limited (chutes.ai/news).

*Gap:* I did not find detailed first-hand time-to-listing or test-traffic accounts from Parasail, Atlas Cloud, NextBit, DeepInfra, Novita, Targon, or similar. They appear in the OpenRouter provider list (openrouter.ai/provider/parasail), but published onboarding narratives are rare. Reddit r/LocalLLaMA and Hacker News discussion focus on the buyer side, not the provider side.

#### 2. Acceptance rate and wait time

OpenRouter does not publish a numeric acceptance rate, application count, review turnaround, or backlog size. The public statements are: "We review applications on a rolling basis. Due to high demand, not all providers will be accepted. Priority is given to providers that fill gaps in our current network" (openrouter.ai/providers/apply). An earlier version of the page also stated OpenRouter had "a large backlog of provider applications and are prioritizing providers with proprietary models" (openrouter.ai/providers/apply, per search snapshot).

The strongest staff-adjacent signal is OpenRouter's own hiring post for a "Partner Development Manager, Provider Ecosystem." This is the company's first supply-side partnerships hire, tasked to "own and execute OpenRouter's strategy for growing and managing our global network of LLM and inference providers" (jobs.ashbyhq.com/openrouter; builtin.com). The listing says: "inbound interest… outpaces our capacity to action it" and that the role must qualify, scope, and drive hands-on onboarding "so no promising provider slips through the cracks" (zerogtalent.com, posted August 3, 2026). This confirms a backlog exists, but gives no number. I did not find any statement from Alex Atallah or Louis Vichy with a specific acceptance rate or review time; treat any such number as unverified.

For scale context: OpenRouter lists "80+ providers" on the apply page (openrouter.ai/providers/apply), while other pages say "60+ providers" and "400+ models" (rywalker.com). This range is a minor inconsistency across OpenRouter's own surfaces.

#### 3. Alternatives and complements

| Channel | What it takes to list | Economics | Notes |
|---|---|---|---|
| **OpenRouter** | Application + technical review + test traffic (openrouter.ai/providers/apply) | You set USD pricing; OpenRouter passes it through with no token markup and charges buyers a 5.5% credit fee (amnic.com) | Largest volume (25T tokens/week) (businesswire.com); price-weighted routing (openrouter.ai/blog/insights/model-routing) |
| **Hugging Face Inference Providers** | Implement task APIs, submit PRs to huggingface.js and huggingface_hub, register model mappings, implement a billing endpoint; org must upgrade to Team or Enterprise (huggingface.co) | HF bills users and pays providers; automated tests every 6 hours (huggingface.co) | Requires code PRs and a billing endpoint; failed tests remove you temporarily (huggingface.co) |
| **Vercel AI Gateway** | Vercel curates the model/provider catalog; no public self-serve provider application found | Zero token markup; buyers pay provider list price (vercel.com) | Fast-growing gateway; provider onboarding appears partner-driven (inference) |
| **Requesty** | OpenAI-compatible; migration is a base-URL change for buyers (truefoundry.com) | 5% model markup on buyers (omidsaffari.com) | Smaller than OpenRouter |
| **AWS Bedrock Marketplace** | Register as an AWS Marketplace seller (tax, bank, KYC); list model; endpoints checked for compatibility (docs.aws.amazon.com) | AWS collects funds and disburses to sellers (startups.aws.com) | Enterprise procurement and IAM; 100+ models (aws.amazon.com) |
| **Chutes / Bittensor Subnet 64** | Register GPU hardware as a miner; deploy models as "chutes"; create a Bittensor wallet (simplytao.ai) | Miners scored on compute (55%), speed (20%), availability (20%), bounties (5%); paid partly in TAO (tao.media) | Decentralized; ~20–25% of Chutes' daily volume itself flows through OpenRouter (blockeden.xyz, single third-party source) |
| **LiteLLM / Portkey / Helicone** | Open-source or self-hosted gateways; buyers pay providers directly (truefoundry.com) | No marketplace demand of their own; they are routing layers, not demand channels | Complement, not a demand source (inference) |

**Assessment:** OpenRouter is the strongest single demand channel by volume (businesswire.com). Hugging Face Inference Providers is the most realistic complementary marketplace, but needs code PRs and a billing endpoint (huggingface.co). Hyperscaler marketplaces (Bedrock, Azure AI Foundry, Vertex) reach enterprise buyers but need heavier onboarding (docs.aws.amazon.com). Open-source gateways (LiteLLM, Portkey) do not bring demand; they only route traffic buyers already have (*inference*).

#### 4. The Stripe acquisition

Bloomberg reporters Yazhou Sun, Natasha Mascarenhas and Paige Smith reported August 16, 2026 that Stripe finalized a deal to acquire OpenRouter for more than $7 billion (bloomberg.com; techcrunch.com). This is about 5x OpenRouter's reported $1.3 billion Series B valuation from about three months earlier (techstartups.com). Stripe already processed payments for OpenRouter before the deal (dataconomy.com).

**What it means for providers:** As of publication, neither Stripe nor OpenRouter confirmed the deal publicly, and no post-close plan is published (llmgateway.io). A Stripe spokesperson told TechCrunch it does not comment on rumors or speculation (techjournal.org). One report says: "Model providers and third-party tooling that integrate with OpenRouter will work with Stripe on commercial agreements and technical requirements" (gncrypto.news). But this is analyst framing, not an official term change. No pricing, payout, or routing changes are announced (explainx.ai). The realistic short-term expectation is that the API keeps working and pricing gets revisited on Stripe's timeline (llmgateway.io).

**Watch-outs:** Analysts raise a neutrality question, because Stripe now owns the routing layer and also has commercial relationships with model providers (techtimes.com). Any perceived bias could affect how traffic is routed (forbes.com). *This is analyst commentary, not confirmed policy.*

### C. Economics and strategy

#### Volume and rankings

OpenRouter publishes live rankings by token volume at openrouter.ai/rankings. These measure adoption, not quality, and describe only traffic through OpenRouter (openrouter.ai/rankings). Chinese-origin models reached 46.4% of routed tokens versus 35.7% US-origin (June 2026); a CNBC investigation published July 7, 2026 found the share routed to Chinese models held above 30% every week since February 8, peaking at 46%, up from an 11% twelve-month average (cnbc.com; digitalapplied.com). DeepSeek is OpenRouter's single largest vendor at 17.6% of routed tokens weekly (5.13 trillion tokens), ahead of Google (12.5%) and OpenAI (8.4%) combined, with Alibaba's Qwen next at 13.9% (2.77 trillion) (openrouter.ai/rankings via CNBC, June 2026). This shows open-weight, cost-efficient models win volume, and buyers "vote with wallets" (nodemini.com).

#### Price-weighted routing and margins

Default routing has two steps: it deprioritizes any provider with a significant outage in the last 30 seconds, then picks the lowest-cost stable provider weighted by the inverse square of price (openrouter.ai/blog/insights/model-routing). So a $1/M provider is about 9x more likely to be chosen first than a $3/M provider (openrouter.ai/docs/guides/routing/provider-selection). Setting `sort` or `order` turns load balancing off (openrouter.ai/docs/guides/routing/provider-selection).

**This is a race to the bottom on price for undifferentiated open-weight models.** The same model can vary by 4x in price across providers on OpenRouter (coworker.ai). Open-source Chinese models are 60% to 90% cheaper than leading Anthropic and OpenAI offerings, per OpenRouter's Justin Summerville (cited by CNBC, 2026); for example, DeepSeek V4 Flash lists near $0.14/M input versus OpenAI GPT-5.5 at $5.00/M (cnbc.com). David Cahn of Sequoia Capital, in "AI's $600B Question", frames the underlying economics: "GPU computing is increasingly turning into a commodity, metered per hour. Without a monopoly or oligopoly, high fixed cost + low marginal cost businesses almost always see prices competed down to marginal cost (e.g., airlines)" (sequoiacap.com; finance.biggo.com). Model brands become commodities on a price-sorted shelf (finance.biggo.com).

#### How to differentiate beyond price

You can differentiate on (openrouter.ai/docs/guides/get-started/for-providers; openrouter.ai/providers/apply):
- **Throughput and TTFT** — public metrics that drive traffic.
- **Uptime** — 95%+ keeps normal routing priority.
- **Tool-call reliability** — Auto Exacto rewards strong tool-calling with more tool traffic.
- **ZDR and HIPAA** — compliance flags open enterprise and privacy-sensitive traffic (openrouter.ai/docs/guides/get-started/for-providers).
- **Geography and data residency** — declared datacenters get geographic routing (openrouter.ai/providers/apply).
- **Quantization and context length** — buyers filter on these (openrouter.ai/docs/guides/routing/provider-selection).

#### Revenue share and dependence

OpenRouter takes about 5% of inference spend (5.5% credit fee) (sacra.com). For providers, one third-party analysis estimates about 20–25% of Chutes' daily volume flows through OpenRouter (blockeden.xyz). This is a single third-party source, not confirmed by Chutes or OpenRouter. I did not find OpenRouter revenue-share figures for other named providers; treat them as unknown.

#### Risks

- **Commoditization.** Price-sorted shelves erode brand value (finance.biggo.com).
- **Public shaming via metrics.** Weak TTFT, throughput, or uptime show publicly and cut traffic (openrouter.ai/providers/apply).
- **Deprioritization.** Auto Exacto and uptime rules route weak endpoints last (openrouter.ai/docs/guides/get-started/for-providers).
- **Channel dependence.** Heavy reliance on one channel is risky, especially with the Stripe deal's unknowns (llmgateway.io).

---

## Recommendations

**Stage 1 — Before you apply (build the readiness packet).**
1. Make your `/chat/completions` endpoint OpenAI-compatible with streaming and usage tokens for both stream and non-stream (openrouter.ai/providers/apply).
2. Build a `/models` endpoint in the new modality-object format (schema_version 2.4). Validate it against the OpenAPI 3.1 schema (openrouter.ai/docs/guides/get-started/for-providers).
3. Set USD per-token pricing, and decide any tiered or cache pricing (openrouter.ai/providers/apply).
4. Declare datacenters, quantization, ZDR, and HIPAA accurately (openrouter.ai/docs/guides/get-started/for-providers).
5. Publish a privacy policy and clear data-retention terms; state training and logging policy (openrouter.ai/providers/apply).
6. Set up monthly invoicing or auto top-up (openrouter.ai/docs/guides/get-started/for-providers).
7. Use the Telnyx readiness packet as a template: model set, validation commands, pricing, capacity TPM, invoicing path, privacy terms (github.com/team-telnyx/ai/pull/246).

**Stage 2 — Apply and position.**
8. Apply through the form at openrouter.ai/how-to-list (openrouter.ai/docs/guides/get-started/for-providers).
9. Emphasize how you fill a network gap — a scarce model, a region, ZDR, or unusually strong throughput — because OpenRouter prioritizes gap-fillers (openrouter.ai/providers/apply).
10. If you have a proprietary model, lead with it; OpenRouter has prioritized proprietary models (openrouter.ai/providers/apply).

**Stage 3 — Onboarding and test traffic.**
11. During the test phase, return early 429s under load and stream tokens immediately to protect throughput metrics (openrouter.ai/docs/guides/get-started/for-providers).
12. Send SSE keep-alives for reasoning models to avoid fetch-timeout fallback (openrouter.ai/docs/guides/get-started/for-providers).
13. Keep uptime above 95% to hold normal routing priority (openrouter.ai/providers/apply).

**Stage 4 — After go-live (grow and defend).**
14. Ask the team for provider dashboard access and monitor benchmark, throughput, and tool-call metrics (openrouter.ai/docs/guides/get-started/for-providers).
15. Maintain tool-call reliability to earn more tool traffic via Auto Exacto (openrouter.ai/docs/guides/get-started/for-providers).
16. Add a second channel (Hugging Face Inference Providers is the most direct complement) to reduce channel dependence (huggingface.co).

**Benchmarks that would change these steps:**
- If your uptime drops below 95%, fix reliability before you add models, because traffic falls (openrouter.ai/providers/apply).
- If your throughput sits more than 1.5σ below the median, invest in serving speed, or you get deprioritized for tools (openrouter.ai/docs/guides/get-started/for-providers).
- If OpenRouter or Stripe publishes new provider terms, re-check payout and routing before you scale spend on the channel (llmgateway.io).

---

## Common reasons applications are rejected or stall

*The following causes come from OpenRouter's stated criteria and the readiness accounts. Where a cause is not directly stated, the text labels it inference.*

- **You miss a hard requirement.** No streaming, no usage tokens, no `/models` endpoint, no invoicing, or no privacy policy. OpenRouter says such applications "will not be reviewed" (openrouter.ai/providers/apply).
- **You do not fill a network gap.** OpenRouter prioritizes gap-fillers and proprietary models. A duplicate open-weight offering with no edge may stall (openrouter.ai/providers/apply).
- **Backlog and limited capacity.** Inbound interest "outpaces" OpenRouter's capacity to action it, so review can be slow (zerogtalent.com).
- **Unclear pricing, capacity, or data terms.** The Telnyx packet shows these are common open blockers before submission (github.com/team-telnyx/ai/pull/246).
- **Weak reliability signals in test traffic.** *Inference:* poor latency, throughput, or error handling in the test phase likely delays go-live, because the process validates exactly these (openrouter.ai/providers/apply).

---

## Caveats

- **Acceptance rate and wait time are not published.** Any specific number is unverified (openrouter.ai/providers/apply).
- **Provider-side BYOK terms are inferred**, not documented (inference).
- **Vercel AI Gateway provider onboarding** appears partner-driven; I found no public self-serve provider application (inference).
- **Chutes' 20–25% OpenRouter share** is a single third-party estimate (blockeden.xyz).
- **The Stripe deal is reported, not officially confirmed by either company**, and no provider-term changes are announced (llmgateway.io; techjournal.org).
- **Provider-count numbers vary** across OpenRouter's own pages (80+, 60+) (openrouter.ai/providers/apply; rywalker.com).
- **Some third-party pricing/statistics sites** (gitnux.org, tokenmaxxing.com) are aggregators; I prioritized OpenRouter's own docs, Bloomberg, TechCrunch, CNBC, Business Wire, Menlo Ventures, and Sacra where possible.
