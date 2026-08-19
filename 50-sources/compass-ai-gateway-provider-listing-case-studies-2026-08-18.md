---
type: source
status: contested
created: 2026-08-18
updated: 2026-08-18
source_date: 2026-08-18
source_type: automated_research
domains: [inference, model-serving, inference-marketplaces, compute-economics]
people: []
orgs: [openrouter, hugging-face, inceptron, chutes, parasail, baseten, siliconflow, telnyx]
source_file: compass_artifact_wf-db8f8ab6-d159-50b7-9614-0c73a458ab5b_text_markdown.md
source_sha256: e3c7879ac096fb4555dfc635e309a8b471de570377b5348fab8c99a6c811c5f1
tags: [openrouter, ai-gateways, provider-listing, case-studies, day-zero-serving]
---

> [!warning] Evidence status
> This note preserves a Compass-generated research artifact. It combines official process claims, provider self-reports, marketing claims, and automated synthesis. Its citations and time-sensitive figures have not been independently verified. Do not treat them as verified evidence until they are checked against the original sources.

> [!danger] 2026-08-18 causal correction
> The central claim that day-0 shipping is an application hook is unsupported by the cited cases. The cases show day-0 shipping after providers were already listed or had launch access. The official process and the post-listing growth evidence survive. The pre-listing approval mechanism remains unknown. The original report is preserved below for belief history.

# How Inference Providers Get Listed on AI Gateways: First-Hand Case Studies

The strongest unwritten tactic to get listed and prioritized on an AI gateway is to give **day-0 (first-to-market) support for a hot new open model, and use that as the application hook** — Parasail, Baseten, Inceptron, Chutes, and SiliconFlow all did this, and it is the single most repeated, load-bearing move across every first-hand account found.

## TL;DR
- **Ship a hot model first, then apply.** Be the first or fastest provider to serve a trending open model. Parasail did this with Gemma 27B ("first and only provider on OpenRouter"). Inceptron did it with MiniMax M2.5 ("first European provider... within 100 hours of release"). This creates the "network gap" that OpenRouter says it prioritizes.
- **Build and validate the `/models` endpoint before you apply.** Telnyx's public GitHub packet shows the real pre-work: pricing, capacity, datacenter codes, invoicing, and data-retention terms must be ready first. OpenRouter's `is_ready: false` flag lets you pre-stage a model in secret, then flip it live at launch.
- **Push through the human queue.** OpenRouter's listing is application-gated and human-run. Publish the endpoint, apply by form and to providers@openrouter.ai, and do direct outreach to named operators Tomas Oliva and Shashank Goyal. On Hugging Face, open three public PRs and escalate on the Discord Inference Providers channel.

## Key Findings
- Gateways publish the rules but hide the priorities. OpenRouter's public apply page states a backlog and a preference for "providers that fill gaps" and have "proprietary models." The workaround is to create your own gap by being first or fastest on a trending model.
- The fastest ramp in this data set is Inceptron: from launch to 10B tokens/day on OpenRouter in under one month, driven by first-to-market shipping plus #1-on-price pricing.
- Chutes shows the decentralized edge and a key lesson: a free tier plus fast model coverage put it at the top of OpenRouter, but a compliance flag (missing TEE) capped its traffic until fixed.
- On Hugging Face, the true gate is procedural and social, not just technical. Applicants with fully working, compliant endpoints (GMI Cloud, Latitude.sh) still stalled for weeks, waiting for maintainer review.
- The exact human contact and approval time are almost never published. Even Inceptron, the best-documented case, never said whom it emailed or how long onboarding took.

## Details

### OpenRouter — the official process (the baseline to beat)
OpenRouter's "Become a Provider" page (openrouter.ai/providers/apply, current) states the flow: publish a `/models` endpoint (with pricing, context length, max output tokens, supported features, and datacenter locations); submit an application; pass a technical review; get onboarded with test traffic; then go live, routed by performance and price. The page states plainly: "We currently have a large backlog of provider applications and are prioritizing providers with proprietary models" and "Priority is given to providers that fill gaps in our current network." The contact is providers@openrouter.ai. OpenRouter's own docs and blog (2026) state it routes across "70+ LLM providers" and handles very large monthly token volumes.

The docs also reveal an under-used technical lever: the `is_ready` boolean in the `/models` response (openrouter.ai/docs/guides/get-started/for-providers). Set `is_ready: false` to upload a model before an announcement (staged but hidden). Set `is_ready: true`, or leave it out, and OpenRouter's monitor auto-stages the model, runs baseline tests, and unhides it once pricing is set. This is the exact mechanism that makes a "day-0" surprise launch possible.

Named people to contact: Tomas Oliva (Tomas O.) is Provider Operations Manager. His LinkedIn states he is "responsible for onboarding new models and providers and maintaining the existing 400+ models and 70+ provider integrations." On his first day (2025-01-27) he wrote: "I'll be focusing on operations (ping me when a new model drops), support, and developer relations." Shashank Goyal is Head of Provider Ecosystem (ex-founding engineer, ex-OpenSea). On 2026-02-07 he posted that OpenRouter was hiring to "build and own our Provider Partnerships program... working directly with frontier AI labs." OpenRouter's own August 2026 job posts confirm the queue is human-limited: "inbound interest (Twitter/LinkedIn pings... intros) outpaces our capacity to action it." This tells providers that persistent, high-signal outreach across channels genuinely moves the queue.

### Case Study: Inceptron (Sweden) — OpenRouter
Sources (all first-hand LinkedIn posts):
- Inceptron / Nima Karimi, 2026-02-12: "We launched in OpenRouter three weeks ago as the only Swedish provider and the second AI Studio in Europe" and "over 1B tokens a day processed."
- Lucas Ferreira, 2026-02-17: "Three weeks. That's how long we've been live on OpenRouter... Today, we're at 2B+ tokens per day."
- Inceptron, 2026-02-17: "MiniMax M2.5 is now live on OpenRouter via Inceptron - the first European provider to ship it, and currently #1 on price (live within 100 hours of release)."
- Lucas Ferreira, 2026-02-21: "Inceptron is now at 10B tokens/day on OpenRouter - inside our first month live... we went from ~2B to 10B basically overnight... Capacity becomes strategy. Because demand doesn't wait for procurement. PS: We need more GPUs."
- Simon Bowker (advisor), 2026-04-01: "I advise Inceptron... Inceptron's compiler delivers 51% throughput advantage over standard serving stacks (vLLM)... processing more than 20B tokens a day."

Timeline: go-live in late January 2026; 1B tokens/day by Feb 12; 2B+ by Feb 17; 10B by Feb 21; 20B+ by April.

How they applied and whom they talked to: NOT PUBLICLY STATED. Inceptron never named an OpenRouter contact. They never described the application channel (form, email, or warm intro). They never gave the onboarding time or the step sequence. A dedicated search of the founders' posts, podcasts, and press found no account of the listing mechanics.

Edge tactics:
- (Explicitly stated) First-to-market model shipping: "the first European provider to ship" MiniMax M2.5, "live within 100 hours of release."
- (Explicitly stated) Aggressive launch pricing: "currently #1 on price" on MiniMax M2.5.
- (Explicitly stated) Proprietary throughput tech as a differentiator: a compiler with a claimed 51% throughput advantage over vLLM (advisor Bowker; unaudited internal benchmark).
- (Strongly implied) Capacity as strategy: "Capacity becomes strategy... We need more GPUs."
- (Inference) EU data residency as a "gap-filler": they marketed as "the only Swedish provider" and an EU-residency option. This matches OpenRouter's stated preference for providers that fill network gaps.

### Case Study: Telnyx — OpenRouter (application prep, documented in GitHub)
Source: GitHub PR team-telnyx/ai #246, "AIF-156: Add OpenRouter provider readiness packet," opened 2026-06-26 by ifthikar-razik, closed 2026-06-28. Reviewers: gbattistel, Oliver-Zimmerman, aaronjo-Telnyx, aisling404.

This PR is a rare, public look at the provider side. Telnyx built an internal "readiness packet" before applying, because "OpenRouter provider onboarding is application-based rather than a normal upstream code PR." The packet held an OpenRouter-shaped draft model manifest with `TODO_` placeholders, a credential-gated validation script, and a CI test. The PR listed the exact open blockers before external submission: confirm the launch model set; confirm USD-per-token pricing and tiering; confirm max output tokens, supported params, and supported features per model; confirm production datacenter country codes and capacity TPM; confirm the OpenRouter payment/invoicing path; and confirm privacy/data-retention terms.

Outcome: the public PR was closed and moved private. The author wrote: "Closing this public PR because the OpenRouter provider packet includes unresolved provider-commercial readiness fields and belongs in a private/internal staging path first. Moved to private AI FDE blueprint PR." As of this research, Telnyx does not appear as a live OpenRouter provider. The public evidence stops at the readiness stage.

Edge tactics:
- (Explicitly stated) Build and validate the `/models` manifest and a validation script before you apply.
- (Strongly implied) Treat the application as a commercial-readiness exercise (pricing, invoicing, data-retention), not a pure engineering task.

### Case Study: Chutes / Rayon Labs (Bittensor SN64, founder Jon Durbin) — OpenRouter
Sources: Jon Durbin interview on Hash Rate (YouTube, Jesus Martinez channel, 2026-04-12); Durbin's article "Chutes: a glance behind, and a leap ahead" (May 2026, via tao.media 2026-05-16); TAO Daily (2025-10-17); OAK Research (2025-04-29); Subnet Alpha profile.

Key first-hand detail on the TEE compliance flag (from Durbin's interview): before a traffic spike, "there was that flag on there simply because not all of our models were in TEE, so you had to go specifically opt in to use Chutes on OpenRouter." After Chutes moved to TEE-only models on OpenRouter, the flag was lifted and traffic jumped. Durbin says revenue rose "from just under $10,000 to... 18, 19, 20... 22 was our peak per day," while the team cut inventory "from 1,700 H200s down to 700."

How Chutes rose: it was first to serve hot models, it used a free tier, and it used a decentralized miner network (paid in TAO emissions) to spin up new models fast. Subnet Alpha's profile states Chutes "was the first to offer cutting-edge models like DeepSeek V3, and partners noted its execution speed as best-in-class on OpenRouter," and that its free tier drew "over 100,000 users." Chutes became the #1 open-source inference provider on OpenRouter and, per Subnet Alpha, was "handling on the order of 100 billion tokens per day" by late May 2025.

Edge tactics:
- (Explicitly stated) Fix the compliance flag (TEE) to unlock routing and monetization.
- (Explicitly stated, structural) Free tier to acquire users and prove real workloads.
- (Strongly implied) First-to-market on hot open models via a fast, incentive-driven supply side.
- (Explicitly stated) Full open-source stack as a trust and verification tactic.

### Case Study: TNG Technology (model lab) + Chutes — the free-tier / lab-push pattern
Sources: TNG Technology Consulting GmbH news posts (2025-05-02 and later); OpenRouter and Hugging Face model pages; nolist.ai (2026).

TNG built DeepSeek-R1T-Chimera (a merge of DeepSeek R1 and V3). It "got picked up and hosted by Open Router, where it was temporarily ranked as the #2 trending model." TNG's own posts thank "OpenRouter and Chutes for hosting it." The model ran free, subsidized on Chutes' H200 miners. TNG noted "peak 'free model' H200 infrastructure costs of roughly $18k/day," after which the miners rate-limited it. The free R1T Chimera endpoints were shut down on 2026-02-12 due to abuse and DDoS attacks.

Edge tactics:
- (Explicitly stated) A model lab that publishes a buzzy open model can get it "picked up" by gateways and providers without a formal application. The lab creates the demand.
- (Explicitly stated) A free, subsidized tier drives ranking and visibility, at real GPU cost.

### Case Study: Parasail (CEO Mike Henry, ex-Groq) — OpenRouter
Sources: Mike Henry LinkedIn, 2025-03-13; Parasail PRNewswire release and SiliconANGLE, 2026-04-15; TechCrunch, 2025-04-02; Next Platform, 2025-04-03.

Henry's 2025-03-13 post is the clearest single statement of the day-0 tactic: "Parasail delivered zero-day support for Google's new Gemma 27b and we're the first and only provider on OpenRouter. We've learned the best weapon to win deals in this highly competitive environment is insanely fast speed." Per Parasail's April 15, 2026 announcement, the company "processes over 500 billion tokens per day" with "30% MoM revenue growth," and raised a $32M Series A (total funding $42M), co-led by Touring Capital and Kindred Ventures, with Samsung NEXT and Flume participating. Henry also publicly analyzed the market: "There's no room for margin for a reseller in the long run unless you built a massive reseller marketplace like OpenRouter."

Edge tactics:
- (Explicitly stated) Zero-day support for a hot new model to become "the first and only provider on OpenRouter."
- (Explicitly stated) Speed of shipping as the primary competitive weapon.

### Case Study: Baseten — OpenRouter (day-0 launch-partner pattern)
Sources: Baseten blog (2025-08-07 GPT-OSS 120B; 2026-07-27 Kimi K3; 2026-03-11 Nemotron 3 Super; 2026-07-15 Inkling); OpenAI gpt-oss launch post.

Baseten repeatedly positions itself as a day-0 launch partner and uses public OpenRouter data as proof. For gpt-oss-120b (released 2025-08-05), Baseten wrote: "As a launch partner for OpenAI's first open-source LLM since 2019... By the end of launch day, we were the clear leader running on NVIDIA GPUs for both latency and throughput per public data from real-world use on OpenRouter." OpenAI's own launch post names Baseten among its pre-launch partners (alongside Azure, Hugging Face, vLLM, Fireworks, Together AI, and OpenRouter). For Kimi K3, Baseten thanked "Moonshot AI for sharing the Kimi K3 weights with us for early access," plus the Inferact (vLLM) and RadixArk (SGLang) teams.

Edge tactics:
- (Explicitly stated) Get early or pre-release model weights from the lab to enable day-0 support.
- (Explicitly stated) Publish benchmark and throughput leadership using OpenRouter's public data as the scoreboard.
- (Strongly implied) Partner with open-source inference-engine teams (vLLM/SGLang) so you are ready at launch.

### Case Study: SiliconFlow — the early lab-timing bet
Sources: elsewhere.news interview (2025-06-09) and 36Kr, quoting founder Yuan Jinhui; Caixin (2025-02-12); Gasgoo/Benzinga (June 2026).

SiliconFlow's edge was to be early to a lab, before it was hot. Yuan stated: "for a long time after DeepSeek-V2 was open-sourced, we were the only third-party MaaS platform supporting DeepSeek." This set them up to catch the DeepSeek R1/V3 wave. They also bet on domestic Huawei Ascend chips to serve DeepSeek faster than NVIDIA-based rivals. SiliconFlow (founded August 2023, Beijing; Yuan is ex-Microsoft Research Asia) later raised a large Series B (reported over 2 billion yuan) led by Alibaba.

Edge tactic:
- (Explicitly stated) Bet early on a specific open-source lab before it is hot, so you are the default provider when it breaks out.

### Case Study: Targon / Manifold Labs (Bittensor SN4) — OpenRouter
Sources: TAO Protocol (2026-04-17); Own Your Mind review; Intel–Manifold co-authored whitepaper (2026-03-23); targon.com.

Targon sells confidential-compute (TEE) inference. Customers use it "as a regular OpenAI-compatible inference API at targon.com and through OpenRouter listings." Its differentiators are a research-paper collaboration with Intel and NVIDIA, deep Bittensor-insider founders (Rob Myers and James Woodman, ex-Opentensor Foundation), and named enterprise customers (Dippy AI). No first-hand account of the OpenRouter listing mechanics was published.

Edge tactic:
- (Inference) Use confidential compute / TEE as a differentiated "gap-filler" capability, and co-authored technical validation (Intel/NVIDIA) as public credibility.

### Hugging Face Inference Providers — the PR-driven path
Official process (huggingface.co/docs/inference-providers/register-as-a-provider): (1) implement standard task APIs; (2) submit a PR to huggingface.js; (3) register model mappings via the Model Mapping API; (4) implement a billing endpoint; (5) submit a PR to huggingface_hub; (6) get registered server-side and provide an icon; (7-9) add docs and "share share share." Step 3 requires upgrading the org to a Team or Enterprise plan. When you open PRs, ping Wauplin, SBrandeis, julien-c, and hanouticelina.

Case: Featherless AI. Sources: HF blog (2025-06-12); Featherless blog (2025-06-12); huggingface.js PR #1310 (opened 2025-03-24 by wxgeorge, merged after about five weeks). The PR thread shows HF asked them to (a) rewrite against a refactored provider structure, (b) update the README, and (c) run tests in cache mode to update `tapes.json` with an `HF_FEATHERLESS_KEY`. Featherless launched with 6,700+ models and used the tactic of auto-onboarding "any model with 100+ downloads." The blog guest authors were wxgeorge, pohnean-recursal, and picocreator (Featherless), with HF co-authors celinah, Wauplin, and sbrandeis.

Case: GMI Cloud. Sources: HF Forum thread (2025-11-13, "Inquiry About Becoming an Inference Provider... [GMI Cloud]," by Kyle Shao); huggingface.js PR #2297 (opened 2026-07-15 by Alas129). The forum thread shows the real gate. GMI asked how to get access to the `/api/partners/{provider}/models` endpoint and was told mappings only work after the JS PR is merged, and "If you want a faster merge, the most reliable approach is to consult the Hugging Face team via the Inference Providers channel on the Hugging Face Discord." Their PR then stalled from mid-July to mid-August. A GMI employee (roangws) bumped it: "This has been open since 15 July... 3 workflows awaiting maintainer approval... As a first-time fork contributor we can't trigger those ourselves." They listed their compliance proof in the PR: Team-plan org, OpenAI-compatible endpoints, a request-ID header, tool calling and structured output working, a TTFT of 1.54s inside the 5s gate, and 83 models live.

Case: Latitude.sh. Sources: hub-docs PR #2180, huggingface_hub PR #3715, huggingface.js #1927 (all January 2026, by gsalberto). Same pattern: three coordinated PRs, a two-week wait, and a bump: "bumping this docs PR. It's been 2 weeks... Happy to update anything needed."

Case: AlphaNeural (huggingface_hub PR #3678, opened 2026-01-13), plus Simplismart and Mokzu (forum requests), show the same funnel of applicants entering by PR and forum post.

Case: Novita, Hyperbolic, Nebius. Sources: HF blog (2025-02-18); huggingface_hub v0.29.0 release; Novita blog (2025-02-19). HF onboarded these three as a batch (led by HF's Vaibhavs10 / reach-vb), with provider engineers as guest authors (albertworks/Nebius, viktor-hu/Novita, cchevli/Hyperbolic). Novita's own blog framed it as a partnership and ran a referral credit promo.

Edge tactics (Hugging Face):
- (Explicitly stated) Open all three PRs yourself (huggingface.js, huggingface_hub, hub-docs) and keep them moving with polite, specific bumps.
- (Explicitly stated) Escalate to the Inference Providers channel on the HF Discord for a faster merge.
- (Explicitly stated) Pre-verify every checklist item (Team-plan org, OpenAI-compat, request-ID header, tool calling, TTFT under the 5s gate) and list it in the PR to cut reviewer back-and-forth.
- (Explicitly stated) Bring scale or a differentiated offer (Featherless: 6,700+ models plus auto-onboarding) to be blog-worthy.

## Cross-Case Synthesis: the recurring unwritten tactics, ranked
1. **Day-0 / first-to-market on a hot open model** (most common, most load-bearing). Seen in Parasail (Gemma 27B), Inceptron (MiniMax M2.5), Baseten (gpt-oss, Kimi K3, Nemotron, Inkling), Chutes (DeepSeek V3), and SiliconFlow (DeepSeek). This is the primary hook that turns an application into a fast approval and immediate routing.
2. **Below-market / #1-on-price launch pricing.** Explicit in Inceptron ("#1 on price"). Structural in Chutes and TNG (free, subsidized tiers). Low price wins the router's default traffic on day one.
3. **Pre-build and validate the `/models` endpoint before applying.** Explicit in Telnyx's readiness packet, and baked into the HF PR flow. Providers that arrive with pricing, capacity, and datacenter metadata ready move faster.
4. **Model-lab proximity.** Baseten got early Kimi K3 weights from Moonshot. SiliconFlow bet early on DeepSeek. TNG (a lab) had its model "picked up" without applying. Lab attention pulls a provider up the queue.
5. **Fill a stated network gap with a differentiated capability.** EU/data residency (Inceptron), TEE/confidential compute (Targon, Chutes), or the largest model catalog (Featherless). OpenRouter explicitly prioritizes gap-fillers and proprietary models.
6. **Publish throughput/benchmark proof using the gateway's own public data.** Baseten uses OpenRouter's public leaderboard as marketing. Inceptron posts its token-volume graph. This attracts more routing and more provider-side attention.
7. **Clear compliance flags early.** Chutes' TEE flag capped its traffic until fixed. Telnyx flagged data-retention terms as a pre-submission blocker.
8. **Persistent, high-signal human outreach.** OpenRouter says inbound intros outpace its capacity to act. On HF, polite, specific PR bumps and a Discord escalation are the difference between a 2-week and a 6-week wait.

## Recommendations
Staged plan for a provider applying to OpenRouter this week:
1. **Build and validate the `/models` endpoint first** (Telnyx pattern). Include accurate per-token USD pricing, context length, max output, supported features, datacenter country codes, and capacity_tpm. Test it against the schema before you apply.
2. **Pick one hot, trending open model and be first or fastest to serve it** (Parasail/Inceptron/Baseten). Time your application to that model's release. Use `is_ready: false` to pre-stage it, then flip it live at the announcement.
3. **Launch at aggressive (#1-on-price) pricing on that model** to win routing at once (Inceptron). Accept thin margins to earn volume and a leaderboard position.
4. **Apply by the form and to providers@openrouter.ai, and in parallel do high-signal outreach** to Tomas Oliva and the provider-ecosystem team on LinkedIn, Discord, and X. OpenRouter itself says inbound intros move the queue.
5. **Fill a stated network gap** — a capability the network lacks (TEE/confidential compute, EU data residency, a proprietary or exclusive model). OpenRouter explicitly prioritizes gap-fillers and proprietary models.
6. **Publish your throughput and latency using OpenRouter's own public data** (Baseten). Turn the ranking into marketing that attracts more routing.
7. **Clear compliance flags early** (Chutes' TEE lesson). Settle data-retention and privacy terms, and any TEE requirement, before they cap your traffic.

Parallel path for Hugging Face: open the three PRs, pre-verify the full checklist (Team-plan org, OpenAI-compat, request-ID header, tool calling, TTFT under 5s), and escalate on the Inference Providers Discord channel. Expect roughly 2-6 weeks, gated by maintainer attention, so bump politely and with specifics.

Benchmarks that would change the plan: if OpenRouter's backlog message stops "prioritizing proprietary models," a pure open-model reseller play becomes viable without a differentiator. If your day-0 model does not trend within about 72 hours, pivot to the next release instead of waiting.

## Caveats
- Almost all provider-side claims are self-published marketing (LinkedIn, company blogs). Milestone numbers — Inceptron's "10B tokens/day" and "51% over vLLM," Chutes' revenue, Parasail's "500B tokens/day," Targon's ARR — are unaudited assertions by the providers themselves.
- The most important mechanic — exactly whom a provider emailed or DM'd, and how long approval took — is almost never published. Inceptron, the best-documented fast ramp, never disclosed its application channel, its named contact, or its onboarding time. Treat "warm intro vs. cold apply" as unconfirmed for every OpenRouter case here.
- Telnyx's evidence stops at the readiness stage. There is no public confirmation that it went live on OpenRouter.
- **Wafer AI** (wafer.ai; also branded Herdora; San Francisco; about $4M raised; founded 2025) is an inference-optimization company that runs "Wafer Pass" endpoints and is integrated into third-party gateways such as TrueFoundry. It has published nothing first-hand about getting listed on OpenRouter or Hugging Face Inference Providers. This is an explicit dead end.
- Dead ends (searched, no first-hand listing account found): Wafer AI; Targon/Manifold (listing mechanics); Requesty, Poe, Cloudflare Workers AI, and Vercel AI Gateway (from the provider side); DeepInfra; Hyperbolic and Nebius (beyond the batch blog); Atlas Cloud; NextBit; kluster.ai; Enfer; Ubicloud; Phala; Crusoe; Venice AI; Lambda; CentML; Avian; Mancer; Infermatic; AI Horde; Mokzu; and gcube-ai. These providers exist and are listed on gateways, but did not publish a first-person account of how they got listed.

## Updates

- 2026-08-18: Marked the report contested after a causal audit. The provider cases support day-0 shipping as a post-listing growth tactic, not as a demonstrated path to approval. The report's own caveats show that the approval mechanics were not public. See [[dylan-openrouter-listing-case-study-causal-audit-2026-08-18|the correction source]], [[day-zero-shipping-is-evidenced-after-listing-not-as-a-path-to-approval|the corrected day-0 claim]], and [[current-openrouter-research-found-no-public-first-hand-provider-listing-account|the public-record gap]].
