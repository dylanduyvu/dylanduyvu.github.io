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
source_file: compass_artifact_wf-a6a55a70-40f8-503d-b56e-4cd1888ca1a9_text_markdown.md
source_sha256: df4d44feb07d19cf53beec5aa2639dcf05dadd37e7ec5ab9178988ce67c58232
tags: [openrouter, ai-gateways, provider-listing, distribution, demand-discovery]
---

> [!warning] Evidence status
> This note preserves a Compass-generated research artifact. It contains source claims, inferences, and automated subagent findings. Its citations and time-sensitive figures have not been independently verified. Do not treat them as verified evidence until they are checked against the original sources.

# Getting Listed on OpenRouter and Alternative AI Gateways: Channel Playbooks and Gap Analysis (August 18, 2026)

## TL;DR (Ranked Action Items for This Week)
1. **Apply to OpenRouter today.** Use the form at openrouter.ai/how-to-list and email providers@openrouter.ai. OpenRouter gives priority to providers that "fill gaps" and, per its apply page, providers "with proprietary models" (openrouter.ai/providers/apply). Bloomberg reported on Aug 16, 2026 that "Stripe Inc. has finalized an agreement to acquire OpenRouter Inc. ... for more than $7 billion" (bloomberg.com). This makes fast outreach smart before any organizational change.
2. **Target thin, high-traffic models, not saturated ones.** Xiaomi MiMo-V2.5 is #1 by daily tokens but has only about 5 providers. Tencent Hy3 is #3 overall but has only about 6. GLM 5.2 has about 27 providers and is saturated (subagent findings; openrouter.ai/rankings).
3. **Build a day-0 serving capability.** New Chinese open-weight builds launch with 1-2 providers and pull heavy traffic at once. Inceptron reached 1 billion tokens/day in 3 weeks and 10 billion/day within its first month (linkedin.com, Inceptron posts, Feb 2026).

---

## Key Findings

- OpenRouter listing is a **reviewed application**, not self-serve. The steps are: build an OpenAI-compatible `/chat/completions` endpoint with streaming and usage tokens; publish a `/models` endpoint; support auto top-up or monthly invoicing; publish a privacy and data-retention policy; submit the form; pass technical review; onboard with test traffic; go live (openrouter.ai/providers/apply; openrouter.ai/docs/guides/get-started/for-providers).
- OpenRouter is building a formal provider program. It posted a "Partner Development Manager, Provider Ecosystem" role on Aug 3, 2026 — its first supply-side partnerships hire — and a "Program Manager, Provider Program" role to "turn our Provider Program into a product" with "provider tiering (our 'buckets')" (jobs.ashbyhq.com/openrouter; startup.jobs/company/openrouter).
- **Routing is meritocratic.** Per OpenRouter provider docs: "Normal routing: 95%+ uptime · Degraded status: 80-94% uptime → receives lower priority · Down status: <80% uptime → only used as fallback," and 100+ requests are required before uptime calculation begins (openrouter.ai/docs/guides/get-started/for-providers). Non-tool traffic uses price-weighted load balancing (inverse square of price). Tool traffic uses Auto Exacto, which deprioritizes providers below statistical thresholds on throughput and tool-call success.
- **The fastest permissionless path is Chutes / Bittensor Subnet 64.** You register on-chain and add GPU nodes. But the demand signal for a price/performance test is weaker than OpenRouter's real developer traffic.
- **The clearest underserved wedge** is serving high-traffic models that have thin provider coverage, plus reliable day-0 serving of new open-weight releases. Chinese models now dominate demand: per ChainThink data reported by KuCoin (Aug 5, 2026 OpenRouter weekly token leaderboard), Chinese models held 8 of the top 10, and "Only two U.S. models—OpenAI's GPT-5.6 Luna and NVIDIA's Nemotron 3 Ultra—made the list" (kucoin.com).

---

## Details

### QUESTION 1 — Comparative Listing Playbooks

#### a) OpenRouter (reviewed application; business-development trend)

**Gate type:** Reviewed application. OpenRouter states: "We review applications on a rolling basis. Due to high demand, not all providers will be accepted. Priority is given to providers that fill gaps in our current network" (openrouter.ai/providers/apply). The apply page also states OpenRouter has "a large backlog of provider applications and are prioritizing providers with proprietary models."

**Ordered steps to list:**
1. Build an OpenAI-compatible `/chat/completions` endpoint. It must support streaming and return `usage` token counts for both stream and non-stream requests (openrouter.ai/providers/apply).
2. Publish a `/models` endpoint. It must return each model with pricing, context length, max output tokens, supported features, datacenter locations, and compliance flags (`zdr`, `hipaa`). The current schema is version 2.4, with typed input/output modality objects (openrouter.ai/docs/guides/get-started/for-providers).
3. Set up automatic payment: auto top-up or monthly invoicing (openrouter.ai/docs/guides/get-started/for-providers).
4. Publish a privacy policy and clear data-retention terms. Disclose logging and training (openrouter.ai/providers/apply).
5. Submit the form at openrouter.ai/how-to-list (openrouter.ai/docs/guides/get-started/for-providers).
6. Pass technical review of API compatibility, reliability, pricing, and performance (openrouter.ai/providers/apply).
7. Onboard with test traffic to validate latency, throughput, and error handling (openrouter.ai/providers/apply).
8. Go live. Traffic auto-routes by performance and price (openrouter.ai/providers/apply).

**Timeline:** OpenRouter does not publish a provider timeline. Its enterprise *customer* onboarding targets go-live by day 14 and full pace by day 30 (openrouter.ai/docs/cookbook/get-started/enterprise-onboarding-journey). Provider onboarding uses an `is_ready` flag, so a provider can stage a model before launch (openrouter.ai/docs/guides/get-started/for-providers). Inference: provider go-live can take days once the API meets spec, because the provider monitor auto-stages and auto-unhides models after baseline tests pass (inference).

**Contacts/entry points:** Form at openrouter.ai/how-to-list; email providers@openrouter.ai; Discord (discord.gg/fVyRaUDgxW); the new Partner Development Manager role and Program Manager, Provider Program role (jobs.ashbyhq.com/openrouter). Tomas Oliva leads provider operations at OpenRouter (linkedin.com/in/oliva-tomas). Louis Vichy (co-founder) described routing as practical heuristics — fallbacks, cost, throughput, latency — on The Infra Pod podcast (podcasts.apple.com, Mar 2026). Alex Atallah (CEO) said in the AI Engineer talk that OpenRouter aggregates many providers per model to boost uptime, and that closed models "couldn't keep up with the demand" (youtube.com/watch?v=84Vtz2IL1Ug, Aug 2025).

**What the job post reveals OpenRouter wants:** The role will "source, prioritize, and onboard new model providers, inference services, and accelerator-based platforms"; build a pipeline of "GPU/ASIC providers to expand OpenRouter's supply diversity"; enforce data compliance (no-train/no-retain, ZDR, SOC2/ISO, GDPR); and enforce SLAs on uptime, latency, throughput, and error rate (builtin.com job posting). This signals that OpenRouter wants supply diversity, compliance, and reliability.

**Volume potential:** Per OpenRouter's own release (May 26, 2026): "OpenRouter's volume has surged to 25 trillion tokens per week (100 trillion tokens per month), representing a 5X increase from the 5 trillion tokens processed per week just six months ago," across 400+ models for 8M+ users (businesswire via techstartups.com; openrouter.ai/blog). Inceptron, a new Swedish provider, reached 1 billion tokens/day three weeks after launch and 10 billion tokens/day within its first month (linkedin.com, Inceptron posts, Feb 2026).

**Economics:** The provider sets its own per-token USD pricing. OpenRouter passes through provider pricing with no markup on inference and pays via monthly invoicing (openrouter.ai/docs/faq; openrouter.ai/providers/apply).

#### b) Hugging Face Inference Providers

**Gate type:** Reviewed + technical PRs + paid-plan requirement.

**Ordered steps:** (1) Implement the standard task API schemas; (2) submit a PR to huggingface.js for JS client integration; (3) register model mappings via the Model Mapping API; (4) implement a billing endpoint; (5) submit a PR to huggingface_hub for the Python client; (6) create a provider documentation page and send logos (huggingface.co/docs/inference-providers/register-as-a-provider).

**Requirement:** Step 3 requires the organization to upgrade to a Team or Enterprise plan (huggingface.co/docs/inference-providers/register-as-a-provider).

**Real accounts:** GMI Cloud, AlphaNeural, Mokzu, Latitude.sh, gcube-ai, and Simplismart all posted in the HF discussions asking about the process. A recurring blocker is that the model-mapping endpoint only becomes usable after the JS-client PR is merged (huggingface.co/spaces/huggingface/HuggingDiscussions/discussions/49; discuss.huggingface.co/t/170414).

#### c) Vercel AI Gateway

**Gate type:** Business-development / partner-driven. Vercel documents BYOK for customers, but has no public self-serve path for a provider to be added to the catalog. The catalog is curated by Vercel (vercel.com/ai-gateway/models; vercel.com/docs/ai-gateway). Entry point: the Partner Finder / enterprise contact on the AI Gateway page (vercel.com/ai-gateway). There is no markup on tokens, including BYOK (vercel.com/docs/ai-gateway).

#### d) Cloudflare Workers AI / AI Gateway

**Gate type:** Partner-driven / curated. Cloudflare AI Gateway is an observability and control proxy over other providers, not a marketplace for provider listing. Workers AI is a first-party model catalog curated by Cloudflare. GLM-5.2 launched day-0 on Cloudflare Workers AI, which shows Cloudflare works directly with labs (news.smol.ai / latent.space). Provider inclusion is business-development.

#### e) Requesty, AI/ML API, Eden AI, Unify/Martian/Not Diamond

Requesty is a routing competitor that already lists Inceptron models with no markup (requesty.ai/models/inceptron). These aggregators generally onboard providers by business-development contact, not public self-serve. Inference: listing here is low-volume relative to OpenRouter but low-effort if the API is already OpenAI-compatible (inference).

#### f) Poe (Quora)

**Gate type:** Self-serve creator/bot monetization. A provider builds a server bot via the Poe API, joins creator monetization at poe.com/creators, and sets a price per message. The Bot Monetization API allows dynamic pricing by input/output length (help.poe.com; creator.poe.com). Poe had paid out over $100,000 to bot makers by mid-2026 (pureailabs.com). This is a low-volume channel for a raw inference provider.

#### g) Chutes / Bittensor Subnet 64 (permissionless)

**Gate type:** Permissionless. Steps: create a Bittensor coldkey/hotkey; run `btcli subnet register --netuid 64`; deploy the chutes-miner; add GPU nodes with the CLI `add-node` command (chutes.ai/docs/miner-resources/overview; github.com/rayonlabs/chutes-miner). Miners are scored on compute capacity (55%), speed (20%), availability (20%), and bounties (5%) over rolling 7-day windows (tao.media). Subnet 64 earned roughly $54k/day in TAO emissions, halving to $27k (tao.media). Chutes discontinued its free tier around March 15, 2026 (github.com/diegosouzapw/OmniRoute).

**Signal quality for a price/performance test:** Moderate. It rewards raw compute time, not developer willingness to pay per model. Inference: it validates that a serving stack is cheap and stable, but not that a specific model/price point has real demand — OpenRouter gives a better market signal (inference).

#### h) Cloud marketplaces (brief)

- **AWS Bedrock Marketplace / AWS Marketplace:** Register as an AWS Marketplace seller (public profile, tax info, US bank account or eligible jurisdiction, KYC). Registration takes 1-4 weeks (docs.aws.amazon.com; clazar.io). Bedrock Marketplace hosts 100+ models on managed endpoints (aws.amazon.com/bedrock/marketplace).
- **Azure AI Foundry** and **Google Vertex Model Garden:** Partner/business-development registration. Inference: these are slower, contract-heavy channels aimed at enterprise buyers, not fast market tests (inference).

#### Ranked table — listing channels

| Channel | Gate type | Speed to live | Signal quality | Volume | Economics |
|---|---|---|---|---|---|
| Chutes / Subnet 64 | Permissionless | Fastest (hours-days) | Low-medium | High raw compute | TAO emissions, volatile |
| OpenRouter | Reviewed application | Fast if API ready (days-weeks) | **Highest** | **Highest** (~100T tokens/mo) | No markup, you set price |
| Hugging Face | Reviewed + PRs + paid plan | Medium (weeks) | High | Medium-high | Provider rates, billing endpoint |
| Poe | Self-serve bot | Fast | Low | Low-medium | Per-message pricing |
| Requesty/other routers | BD contact | Fast | Medium | Low | No markup |
| Vercel AI Gateway | BD / curated | Slow (BD cycle) | Medium | Medium | No markup |
| Cloudflare Workers AI | BD / curated | Slow | Medium | Medium | Contract |
| AWS/Azure/GCP marketplaces | Legal/marketplace registration | Slowest (weeks-months) | Medium (enterprise) | Enterprise | Rev-share/contract |

**Verdict:** For a fast, high-quality market test of a pareto-optimal serving stack, **OpenRouter is the best single channel**. Chutes is fastest to live but gives a weaker demand signal. Hugging Face is a strong second channel that also carries a compliance and discoverability halo.

### QUESTION 2 — What Is Underserved

#### Thin provider coverage on high-traffic models
- **Xiaomi MiMo-V2.5** is #1 by daily tokens yet has only about 5 providers (subagent findings; openrouter.ai/rankings).
- **Tencent Hy3** is #3 overall by tokens yet has only about 6 providers (subagent findings).
- New frontier builds launch with 1-2 providers: DeepSeek V4 Pro 0813 launched with a single provider (DeepSeek first-party); Kimi K2.7-Code had about 2 providers; MiniMax M2.1 and GLM-4.5V had about 2 each (subagent findings).
- Saturated (avoid): GLM 5.2 (~27 providers), DeepSeek V3.2 (~14), MiniMax M2.5/M3 (~10-16), Kimi K2.5/K3 (~10-12) (subagent findings).

#### Day-0 serving as a repeatable wedge
Inceptron, the only Swedish provider, launched on OpenRouter and hit 1 billion tokens/day in 3 weeks and 10 billion/day within its first month, jumping from about 2 billion to 10 billion "basically overnight" (linkedin.com, Inceptron posts, Feb 2026). New Chinese models launch with few providers and heavy immediate demand, so a reliable day-0 host captures outsized traffic (subagent findings). GLM-5.2 had named day-0 partners including Cloudflare Workers AI, DeepInfra, Fireworks, and Baseten (news.smol.ai / latent.space).

#### Capacity/reliability complaints
429s are the loudest recurring builder complaint in 2026. Per Requesty: "Rate limits are the loudest recurring complaint among AI builders right now, and the reason they feel unfixable is that most people are attacking them at the wrong layer ... rate limits are per provider and per model" (requesty.ai). GloryCloud lists DeepSeek routing as the #3 cause of Janitor AI 429s: "Upstream provider throttling (common for DeepSeek via Chutes/Targon)" (glorycloud.com). On thin models, weak endpoints drag availability (the subagent found Phala at about 76% uptime on Kimi K2.5) (subagent findings).

#### Geographic / data-residency gaps
OpenRouter supports EU in-region routing for enterprise via eu.openrouter.ai and lets users restrict to EU-headquartered providers (openrouter.ai/blog/insights/ai-data-residency). Inceptron markets EU/Swedish positioning explicitly (linkedin.com, Inceptron posts). This is an active demand signal for non-US datacenters.

#### ZDR / HIPAA coverage
ZDR is a live routing setting; the machine-readable list is at openrouter.ai/api/v1/endpoints/zdr (openrouter.ai/docs/guides/features/zdr). Providers declare `compliance.zdr` and `compliance.hipaa` in the `/models` document (openrouter.ai/docs/guides/get-started/for-providers). Analysts note OpenRouter offers a clean managed EU endpoint but does not provide a HIPAA BAA path itself — healthcare needs provider-level BAAs (apirank.vip). Inference: HIPAA-capable endpoints are comparatively scarce and are a compliance wedge (inference).

#### Tool-calling reliability (Auto Exacto)
Auto Exacto reorders providers on tool-calling requests using throughput, tool-call success rate, and benchmark data. Providers below the median by set standard-deviation margins are deprioritized (openrouter.ai/docs/guides/routing/auto-exacto). Per OpenRouter's Auto Exacto announcement: "GLM-5 and GLM-4.7 tool call error rate dropped by 88% and 80%, respectively ... Where previously we were seeing approximately 8% error rates, we now average closer to 1%" (openrouter.ai/blog/announcements/auto-exacto). The `:exacto` variant restricts routing to a curated high-accuracy pool (openrouter.ai/docs/docs/routing/model-variants/exacto). Reliable tool-calling on hot agentic models is an open wedge, because many providers get deprioritized.

#### Free-tier / sponsored programs
TNG Tech's DeepSeek Chimera models were served free via Chutes; Chutes discontinued its free tier around March 15, 2026 (github.com/diegosouzapw/OmniRoute). All DeepSeek free variants became paid-only by mid-2026 (pinggy.io). Sponsored free programs create temporary listing and visibility opportunities, but they are unstable.

#### What OpenRouter staff say they want more of
- The apply page: priority to providers that "fill gaps" and "proprietary models" (openrouter.ai/providers/apply).
- The Partner Development Manager post: supply diversity across GPU/ASIC platforms, compliance (ZDR/SOC2/GDPR), and SLA enforcement (builtin.com).
- The provider docs: high tool-call reliability, high throughput, and early 429s under load rather than queueing (openrouter.ai/docs/guides/get-started/for-providers).

#### Industry-wide underserved areas
The provider schema now supports embeddings, rerank, speech, transcription, and video output modalities (openrouter.ai/docs/guides/get-started/for-providers), which signals OpenRouter wants more non-text serving. Enterprise ZDR/compliance, EU sovereignty, agentic tool-call reliability, batch/async, embeddings/rerank, and speech/transcription are all comparatively thin.

#### Most credible wedges (ranked)
1. **Day-0 reliable serving of new Chinese open-weight models.** Evidence: Inceptron's ramp; 1-2 provider launch windows (linkedin.com, Inceptron posts; subagent findings). Chinese open models are also far cheaper — per OpenRouter's Justin Summerville (via CNBC, July 7, 2026), Chinese open models are "consistently 60% to 90% cheaper" than Anthropic/OpenAI flagships; for example, DeepSeek V4 Flash at about $0.14/M input tokens versus OpenAI GPT-5.5 at about $5.00/M as of June 2026 (finance.yahoo.com).
2. **High-traffic, thin-coverage models** (MiMo-V2.5, Tencent Hy3). Evidence: top rankings with about 5-6 providers (subagent findings; openrouter.ai/rankings).
3. **Reliable tool-calling to win Auto Exacto / :exacto.** Evidence: deprioritization mechanics; large error-rate drops (openrouter.ai/blog/announcements/auto-exacto).
4. **EU/sovereign + ZDR/HIPAA compliant endpoints.** Evidence: EU routing feature, compliance flags, HIPAA gap (openrouter.ai/blog/insights/ai-data-residency; apirank.vip).
5. **Undercut Western no-train hosts on price.** Western no-train hosts (Fireworks, Together, DeepInfra) charge roughly double the first-party price, per OpenRouter blog data (subagent findings).

#### Repeatable weekly gap-detection method
1. Pull openrouter.ai/api/v1/models and each model's endpoint list. Count providers per model. Flag models with 1-3 providers.
2. Cross-reference openrouter.ai/rankings for high token volume. The intersection (high volume + few providers) is the target list.
3. Pull openrouter.ai/api/v1/endpoints/zdr. Find popular models that lack ZDR/HIPAA endpoints.
4. Check per-model Performance tabs for TTFT, throughput, uptime, and tool-call error rate. Find models where all providers are weak.
5. Watch new model releases (GLM, Kimi, MiniMax, Qwen, DeepSeek, Tencent, Xiaomi). Note launch-day provider counts.
6. Monitor OpenRouter Discord, r/LocalLLaMA, r/SillyTavernAI, Hacker News, and X for 429/capacity complaints tied to specific models.
7. Log the results weekly. Act on the models that stay thin under sustained demand.

### Stripe acquisition implications
Bloomberg (Yazhou Sun, Natasha Mascarenhas, and Paige Smith, Aug 16, 2026) reported: "Stripe Inc. has finalized an agreement to acquire OpenRouter Inc. ... for more than $7 billion, according to people familiar with the matter" (bloomberg.com; corroborated by techcrunch.com and fortune.com). This is a 5.4x markup over the $1.3 billion May 2026 Series B valuation (finance.yahoo.com). Stripe declined to comment; OpenRouter declined to comment (fortune.com). Inference: near-term, the provider program continues, because the hiring push predates the deal. But organizational change is likely, so providers should accelerate outreach now to build relationships before integration reshuffles priorities (inference). No new provider-facing statements from OpenRouter have appeared since Aug 16.

---

## Recommendations

**This week (article due Thursday, Aug 20):**
1. Submit the OpenRouter form at openrouter.ai/how-to-list and email providers@openrouter.ai. State clearly which gap you fill (thin-coverage model, day-0 capacity, or EU/ZDR).
2. Verify the API meets spec: OpenAI-compatible streaming, usage tokens, `/models` v2.4 schema with compliance flags, and invoicing.
3. Run the gap-detection method once now to name the 3-5 target models (start with MiMo-V2.5 and Tencent Hy3).
4. Join the OpenRouter Discord and connect with provider-operations staff on LinkedIn.

**Next 30 days:**
5. Stand up day-0 serving for the next Chinese open-weight release. Declare `is_ready: false` to stage ahead of launch, then flip it live.
6. Pursue Hugging Face registration in parallel (Team/Enterprise plan + PRs).
7. Optimize for Auto Exacto: high tool-call success, high throughput, and early 429s under load.

**Thresholds that change the plan:**
- If OpenRouter rejects for backlog, list on Chutes and Requesty to build a track record, then re-apply.
- If a target model gains more than 8 providers, drop it and rotate to the next thin, high-volume model.
- If uptime falls below 95%, fix reliability before chasing new models — traffic is throttled below that line.

---

## Caveats
- Provider counts move fast. A 1-2 provider model can gain 10+ providers within days. Re-run counts before you act (subagent findings).
- OpenRouter provider tables render via JavaScript. Some counts were read from page meta descriptions and third-party trackers, and some conflicted (the subagent flagged MiMo-V2.5-Pro at 3 versus 7 providers). Treat counts as snapshots.
- Provider go-live timelines are inferred, not published (inference).
- The Stripe deal price "could still change," per Bloomberg's sources (seekingalpha.com).
- Bloomberg is behind a paywall. The deal is corroborated by TechCrunch, Fortune, and Yahoo Finance.
- The KuCoin/ChainThink Aug 5 leaderboard and the openrouter.ai/rankings Aug 17 board show slightly different model orders, because one is a single-day snapshot and the other is a weekly total. Both confirm Chinese-model dominance.
