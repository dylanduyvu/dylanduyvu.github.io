---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: chat
domains: [inference, inference-marketplaces, distribution, compute-economics]
people: []
orgs: [wafer-ai, openrouter, vercel, truefoundry]
tags: [retail-pass, paid-launch, subscriptions, provider-listing, demand-proof]
---

# Dylan: Add a capped retail offer to the paid inference-provider launch

## Raw Context

> Wafer Pass and Wafer Serverless are two different ways Wafer offered (or still offers) access to their optimized open-source LLMs.
>
> Wafer Pass (discontinued)
> This was Wafer’s earlier flat-rate subscription product.
>
> You paid a fixed weekly (or monthly/yearly) fee instead of per-token charges.
> Plans started at about $10/week (Starter: 1,000 requests every 5 hours) or $25/week (Privacy: 2,000 requests + Zero Data Retention).
> One subscription + one API key gave you access to every model they hosted at the time.
> Designed mainly for agentic coding tools (Claude Code, OpenClaw, Cline, etc.).
> Endpoint was https://pass.wafer.ai.
>
> It was sunsetted around June 2026 because demand shifted heavily toward pay-per-use options. Wafer told users to switch to Serverless instead.
>
> Wafer Serverless (current product)
> This is Wafer’s main offering now: pay-as-you-go inference.
>
> You load credits, get an API key, and pay only for the tokens you use (input + output + cache, etc.).
> No fixed subscription window or request quotas like Pass had.
> Same underlying endpoint (https://pass.wafer.ai/v1) and OpenAI-/Anthropic-compatible APIs.
> Supports features like request-scoped Zero Data Retention (ZDR).
> Models appear in public catalogs and on gateways such as OpenRouter, Vercel AI Gateway, and TrueFoundry.
>
> You just call the API; Wafer handles everything else.
>
> What does “serverless” mean?
> In cloud and AI inference, serverless means:
>
> You do not manage or provision any servers, GPUs, scaling, or infrastructure yourself.
> The provider (Wafer) runs and scales the models automatically in the background.
> You only interact via an API endpoint and pay for actual usage (usually per token).
> No idle costs if you’re not making requests (unlike renting dedicated GPUs that sit unused).
>
> It’s the opposite of “dedicated” capacity, where you reserve specific hardware that runs only for you.
>
> Quick comparison
>
> | Aspect              | Wafer Pass (old)              | Wafer Serverless (current)     |
> |---------------------|-------------------------------|--------------------------------|
> | Pricing model       | Flat weekly/monthly fee      | Pay per token                  |
> | Status              | Discontinued (June 2026)     | Active                         |
> | Best for            | Predictable agent workloads  | Flexible, variable usage       |
> | Infrastructure      | Handled by Wafer             | Handled by Wafer (serverless)  |
>
> In short: Wafer Pass was the fixed-price subscription; Serverless is the usage-based API that replaced it. Both ran on the same fast, optimized inference stack that Wafer is known for.
>
> think you can adopt this strat as well to bootstrap attention from retail yk during the tweet boosted phase

## Evidence Status

- **Direct official evidence:** Wafer's current catalog describes serverless models with per-token prices and uses `https://pass.wafer.ai/v1/chat/completions` in its examples. Wafer's current main site promotes serverless and dedicated inference.
- **Direct historical evidence:** Wafer's public launch material confirms the Pass pricing, rolling request caps, shared model access, and agent-user positioning.
- **User-supplied claim requiring a primary source:** Wafer ended Pass around June 2026 because demand moved to pay-per-use and told users to move to Serverless. The current product surface is consistent with discontinuation, but this check did not find a first-party sunset announcement or reason.
- **Strategy hypothesis:** A new provider can attach a capped self-serve retail offer to its public launch so paid attention produces real users, usage, revenue, workload evidence, and an operating record before or during gateway review.

## Durable Delta

The paid X launch should not point only to a benchmark or application form. It can point to a callable endpoint and a limited self-serve offer. This is an optional way to amplify the existing public-launch workflow and attract gateway attention. It is not a separate route to a listing. The offer should use rolling token, request, context, output, and concurrency controls. It should begin with a small canary cohort and expand only after reliability and unit economics are measured.

The retail offer is a demand and operating-proof experiment. It is not evidence that a gateway will accept the provider, and it does not need to become the provider's permanent pricing model.

## Follow-up Context

> yeah it's more of an aside. it's in the same vein as tweeting about your edge and boosting it. this just supercharges that workflow to get the attention of the gateway

## Pricing-Ladder Follow-up

> in step 4 i think we should mention a quick aside on the wafer strategy of going subscription unlimited -> subscription limited token usage -> ppt as people spill over subscription limits -> migrate fully to ppt structure to subsidize early usage and get off the ground

### Evidence Boundary

- **Verified Wafer history:** WaferPass had flat-rate pricing and rolling request caps. Wafer also offered per-token Serverless. Wafer's current site emphasizes per-token and dedicated service.
- **Not verified as Wafer history:** a literal unlimited first stage, a later change from unlimited to token allowances, automatic pay-per-token overage after the allowance, or a planned full migration caused by this ladder.
- **Strategy hypothesis:** A new provider can test this staged retail ladder to reduce initial trial friction, collect workload data, and move toward safer metered pricing. The first stage must still have cohort, concurrency, request, context, output, duration, and total-loss controls.

### Durable Delta

The article's launch section should include the ladder as a short Wafer-inspired aside. Spell out `pay per token` before using an abbreviation. Present the ladder as a tactic for subsidizing early trial and reducing risk over time, not as a confirmed account of Wafer's product history.

## Article Wording Follow-up

> in general, no need to overly hedge. unlimited is right ahead of flat rate request capped access

### Durable Delta

The first retail stage should use the direct phrase `unlimited-token access under a flat-rate, request-capped plan`. Unlimited describes token billing. The request rate, concurrency, context, output length, cohort size, campaign duration, and total loss remain capped.

## Links

- [[a-capped-retail-pass-can-turn-a-paid-provider-launch-into-measurable-demand|A capped retail pass can turn a paid provider launch into measurable demand]]
- [[waferpass-bootstrap-public-evidence-check-2026-08-19|WaferPass bootstrap hypothesis and public evidence check]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- [[inference|Inference]]
