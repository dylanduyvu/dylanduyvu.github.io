---
type: insight
status: hypothesis
created: 2026-08-19
updated: 2026-08-19
confidence: medium
domains: [inference, inference-marketplaces, distribution, go-to-market]
projects: []
sources: [dylan-public-endpoint-paid-launch-gateway-distribution-hypothesis-2026-08-19, dylan-build-first-inference-gateway-listing-synthesis-2026-08-19, openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19, dylan-openrouter-listing-case-study-causal-audit-2026-08-18, exa-featherless-hugging-face-provider-onboarding-audit-2026-08-18]
people: [tomas-oliva, shashank-goyal]
orgs: [openrouter, hugging-face, vercel]
aliases: [build prove amplify apply and follow up, public endpoint paid launch gateway test]
tags: [provider-listing, public-launch, paid-distribution, gateway-applications, business-development]
---

# A public benchmarked endpoint and paid launch can test gateway distribution

## Claim

The strongest current pre-listing action plan for centrally curated inference gateways is a coordinated sequence:

1. select a model with demand, scarce provider supply, and a measurable edge;
2. establish repeatable internal proof that the edge is technically and economically deliverable on relevant hardware;
3. after the proof passes, begin serious gateway business development while completing a public, authenticated, priced endpoint that meets review requirements;
4. publish live or reproducible performance and operating statistics;
5. announce the endpoint on X and use a defined paid-boost budget;
6. apply through each gateway's formal provider channel during the same launch window, where such a channel exists; and
7. use gateway mentions or replies selectively and run direct business-development follow-up with a test key and evidence packet.

OpenRouter's current rules directly support gap selection and technical readiness before review. The day-zero, paid-launch, tagging, and review-acceleration effects remain hypotheses.

The broader sequence is a reasonable transfer hypothesis for other centrally curated gateways, including Hugging Face Inference Providers and Vercel AI Gateway. It is not evidence that all gateways use OpenRouter's selection rules. Where no public provider application exists, the intake path can be a partnership or provider-ecosystem contact.

## Why It Matters

Gateway approval is currently a public black box. This sequence cannot remove that uncertainty, but it can turn one application into a measurable distribution experiment. The provider can observe public interest, real endpoint use, gateway responses, technical-review requests, and later routing traffic.

OpenRouter says providers must meet its technical requirements before they are considered. This makes it wrong to wait for formal approval before building the minimum review-ready endpoint. Gap discovery can start earlier, but serious provider-listing outreach should start after repeatable internal proof. The public endpoint can then be completed in parallel with outreach, and large capacity commitments can wait for stronger external evidence.

The endpoint remains the product. The launch and paid boost make the product visible.

## Evidence

- **Direct observation:** Dylan saw a boosted X post from an inference provider. The post and its outcome were not captured, so it only generated the hypothesis.
- **Direct official evidence:** OpenRouter says providers must meet its technical requirements before consideration and that it gives priority to providers that fill network gaps. Its application asks for infrastructure, endpoints, models, and data policies before technical review.
- **Direct official evidence:** OpenRouter's provider-partnership job material treats X and LinkedIn pings as real inbound channels and describes first conversations, qualification, onboarding, tests, pricing, and launch work.
- **Direct evidence from provider cases:** Providers publish day-zero launches, prices, performance, and traffic after listing. The public cases do not show that these actions caused approval.
- **Role correction:** Tomas Oliva in provider operations, not Shashank Goyal, the Head of Provider Ecosystem, publicly asked people to notify him when a new model drops.
- **Reasonable inference:** A live endpoint, clear price, reproducible statistics, and test key reduce the work needed to inspect a provider. A coordinated launch can also produce demand evidence. Serious business development should follow internal proof, but it does not need to wait for the final public endpoint.
- **Open speculation:** A large paid boost, public tags, or visible test traffic may move a gateway application forward.

## Test Design

- Use three gap-selection arms: day-zero service for a high-interest new Chinese open model; event-zero service when a policy, price, quota, outage, license, geography, model-removal, or client-adoption event creates urgent unmet demand; or an existing model with demonstrated demand, too few providers, and a performance attribute that can lead its current provider set.
- Do not use provider count alone. It measures supply, not demand. Rank candidates by demand adjusted for provider scarcity, measurable edge, margin, and available capacity. If a numerical screen is useful, use demand divided by provider count or demand multiplied by a scarcity score. Literal provider count multiplied by demand points in the wrong direction because it rewards crowded models.
- Check price and time to first token first. If those metrics are already saturated, test throughput, context length, uptime, tool-call reliability, region, privacy, or another supported capability. The endpoint needs one important, reproducible edge. It does not need to lead every metric.
- Set an internal acceptance gate before serious outreach. Require a working private endpoint or test harness, repeated benchmark results on relevant hardware, plausible unit economics, and a model-license check. Record the test method and failure conditions.
- Publish the model ID, base URL, price, context limits, privacy policy, uptime, time to first token, output speed, test method, hardware, region, and available capacity.
- Use an authenticated endpoint. Give each gateway a separate test key so its requests can be measured without exposing the service.
- Use one tracked launch URL. Record organic and paid impressions, link visits, API-key requests, successful calls, repeat users, spend, and cost per qualified tester.
- As an optional launch amplifier, attach a capped retail plan or prepaid-credit offer. Its purpose is to turn more of the promoted attention into visible activity around the provider's edge. Test it with a small cohort first. Increase paid distribution only after activation, repeat use, reliability, and unit economics are acceptable. Keep retail and gateway review traffic separate.
- For gateways with a formal provider application, submit from the same evidence packet. Where no public application exists, use the documented partnership or provider-ecosystem contact. Record the channel, named contacts, response time, review requests, test traffic, decision, and stated reason.
- Keep public traffic, gateway test traffic, gateway acceptance, and post-listing routed traffic as separate outcomes. Do not claim that paid reach caused approval without direct evidence.

## Implications

- A strong edge should map to a visible gateway supply gap, not only to a provider benchmark.
- Gap-filling is a selection strategy. It does not remove later price competition. Once several providers serve the model, routing can again favor price, uptime, latency, throughput, and tool success.
- The launch post should point to a callable product and reproducible evidence, not only to a throughput chart.
- The main launch post does not need to mention a gateway. A separate reply, direct message, or application can carry the targeted provider pitch without weakening the customer-facing announcement.
- Paid distribution is useful only if it produces qualified testers, customer demand, or gateway attention at an acceptable cost.
- A rejection or no response still produces useful evidence if the full sequence and funnel are recorded.
- The resulting application history could become the first public OpenRouter provider case study found in the current research.

## Counterpoints / Uncertainty

- Paid impressions can create attention without qualified demand.
- A gateway may treat public tagging as useful proof, irrelevant marketing, or unwanted pressure.
- Self-reported statistics can be discounted unless the method is reproducible and the endpoint performs under real traffic.
- Applying to every gateway can create shallow integrations. The provider should first confirm that each gateway is accepting partners and that the endpoint fills a relevant gap.
- Discovery conversations can happen before internal proof, but the team should not pitch an unproven performance edge as deliverable. Serious provider-listing outreach should follow the internal acceptance gate.
- A day-zero launch can force the team to serve an unfamiliar model before its kernels, tokenizer, license, reliability, and real demand are understood.
- One campaign will be a case study, not a universal listing rule.

## Links

- Source: [[dylan-public-endpoint-paid-launch-gateway-distribution-hypothesis-2026-08-19|Dylan: Build, prove, amplify, apply, and follow up with gateways]]
- Refined synthesis: [[dylan-build-first-inference-gateway-listing-synthesis-2026-08-19|Dylan: Build a gap-filling endpoint before relying on gateway business development]]
- Primary-source check: [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]
- Readiness definition: [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping an inference model means a live priced API, not a website]]
- Evidence boundary: [[day-zero-shipping-is-evidenced-after-listing-not-as-a-path-to-approval|Day-0 shipping is evidenced after listing, not as a path to approval]]
- Research gap: [[current-openrouter-research-found-no-public-first-hand-provider-listing-account|Current OpenRouter research found no public first-hand provider-listing account]]
- Retail launch layer: [[a-capped-retail-pass-can-turn-a-paid-provider-launch-into-measurable-demand|A capped retail pass can turn a paid provider launch into measurable demand]]
- Event-zero strategy: [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Inference providers can ship against demand shocks, not only model releases]]
- Area: [[inference|Inference]]

## Updates

- 2026-08-19: Created from Dylan's proposed build, public proof, paid launch, gateway application, tagging, and business-development sequence. Recorded as a testable hypothesis because no current case proves that the launch causes acceptance.
- 2026-08-19: Raised confidence from low-medium to medium after a primary-source check confirmed OpenRouter's gap priority, pre-review technical requirements, and formal handling of social inbound. Kept day-zero acceptance, paid amplification, tagging, and review acceleration as hypotheses. Corrected the new-model notification quote from Shashank Goyal to Tomas Oliva.
- 2026-08-19: Incorporated Dylan's revised OpenRouter-specific version. The existing-model arm now seeks one leading, reproducible performance or capability metric when price and latency are already saturated. Preserved provider count as a supply signal, not proof of demand.
- 2026-08-19: Generalized the action sequence to centrally curated inference gateways. Made formal applications conditional on a gateway having that channel. Kept OpenRouter's network-gap priority as OpenRouter-specific evidence.
- 2026-08-19: Corrected the business-development sequence. Serious outreach now starts after repeatable internal proof, not before technical feasibility is known. It can still run while the public review-ready endpoint is completed.
- 2026-08-19: Captured the version Dylan sent. Added demand-adjusted provider scarcity, geography as a possible edge, and selective gateway mentions outside the main launch post. Preserved maximum paid boosting as an unverified tactic.
- 2026-08-19: Added an optional capped retail or prepaid-credit offer to convert paid launch attention into measurable demand. Required a canary and separate gateway review traffic before increasing paid distribution.
- 2026-08-19: Clarified that the retail offer is an optional amplifier within the public-launch step, not a separate listing strategy. Gateway attention remains an unverified effect.
- 2026-08-19: Expanded day-zero model service into an event-zero gap-selection arm for market events that create urgent unmet inference demand.
