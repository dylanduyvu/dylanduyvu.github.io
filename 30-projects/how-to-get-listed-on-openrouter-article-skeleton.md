---
type: project
status: pre-draft
created: 2026-08-19
updated: 2026-08-19
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: [tomas-oliva, shashank-goyal]
orgs: [openrouter, hugging-face, featherless-ai]
tags: [article, openrouter, provider-listing, operator-playbook, pre-draft]
---

# How to Get Listed on OpenRouter as an Inference Provider

## Article Target

- **Reader:** A new inference provider with access to GPUs that wants to become an OpenRouter provider.
- **Format:** A short, chronological operator playbook.
- **Draft:** [[how-to-get-listed-on-openrouter-article-draft-v1|How to get listed on OpenRouter as an inference provider, draft v1]].
- **Target length:** 1,200 to 1,800 words. Draft toward 1,500.
- **Reader promise:** The best available process for selecting a useful model, proving an edge, shipping a review-ready endpoint, applying, and earning routed traffic.
- **Core thesis:** OpenRouter currently prioritizes providers that bring models they own or control, so this guide focuses on the other route it names: filling a clear gap in its network. An open-weight provider should enter with demand-backed scarce supply and a live, measurable service instead of joining a crowded model price war.

## Writing Rules

- Follow the full [[blogpost-drafting-harness|Blogpost Drafting Harness]] for drafting, revision, evidence checks, normal-English checks, and pre-publish review.
- Use ASD-STE100 Simplified Technical English for all reader-visible prose. Prefer common words, active voice, simple sentence structure, and one main idea per sentence.
- Use the shortest connective word that states the logical relationship between sentences. Use words such as `but`, `and`, `so`, `because`, `still`, `instead`, `for example`, or `that said` when the relationship is not already clear.
- Do not stack connective words. Do not begin two sentences in sequence with connective words. Join the second relationship inside the sentence when this reads better.
- Write for people who can operate an inference service. Do not define baseline terms such as open-weight, API, endpoint, quantization, time to first token, HTTP `429`, or 95th percentile. Define a term only when the intended reader might not know it.
- Keep the article practical. Every section must end with an action or decision.
- State OpenRouter's published requirements and process as facts.
- Present provider actions as examples, not proof that the same action caused acceptance.
- Present day-zero shipping, event-zero shipping, paid X promotion, retail offers, and direct outreach as tactics to test.
- Do not turn provider count into demand. Combine demand, qualified supply scarcity, achievable edge, margin, and capacity.
- Do not say that OpenRouter's gap priority applies to every inference gateway.
- Do not use an unpublished or automated source as proof when an official source exists.
- State an evidence boundary once, then continue with the operating advice. Do not repeat the same caution after every step.

## Claim Ledger

| Article claim | Evidence status | Main support |
| --- | --- | --- |
| OpenRouter has a provider backlog, currently prioritizes providers with proprietary models, and also gives priority to providers that fill network gaps. | Direct official evidence | [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]] |
| A provider must meet the technical requirements before OpenRouter reviews it. | Direct official evidence | [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]] |
| A useful target needs demand and scarce qualified supply. | Reasonable decision rule | [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] |
| Serious provider business development should start after repeatable internal proof. | Reasonable operating inference | [[dylan-build-first-inference-gateway-listing-synthesis-2026-08-19|Dylan's build-first synthesis]] |
| Shipping means a live, authenticated, priced API rather than a marketing website. | Supported working definition | [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping an inference model means a live priced API, not a website]] |
| A public live dashboard lets users and reviewers verify the claimed serving edge under the provider's declared workload and operating conditions. | Operating recommendation | [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|Public endpoint and paid-launch hypothesis]] |
| Public launch, paid promotion, and direct outreach can make a review-ready provider easier to notice and test. | Testable hypothesis | [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|Public endpoint and paid-launch hypothesis]] |
| A provider can launch against a market demand shock, not only a new model release. | Testable hypothesis | [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Event-zero launch hypothesis]] |
| Listing does not guarantee traffic. Price, reliability, latency, throughput, and tool-call success affect later routing. | Direct official evidence | [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]] |

## Article Skeleton

### Opening: The playbook comes from public provider research

**Target:** 120 to 130 words.

**Job:** Establish that the guide comes from direct work with the public record, then give the reader the operating thesis.

- Say that the author read OpenRouter's provider documents and compiled the public sources he could find from inference providers that already earned gateway listings.
- Say that he compared those provider launches with OpenRouter's published rules.
- State that this article gives the resulting plan for how a new provider can put its best foot forward.
- Preserve both current OpenRouter priorities, then state that the guide covers the network-gap route.
- Preview the sequence: find a gap, prove it, launch a public endpoint with inspectable performance data, apply, and contact the provider team.

**Primary evidence:** [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]], [[compass-ai-gateway-provider-listing-case-studies-2026-08-18|compiled provider case studies]], and [[exa-featherless-hugging-face-provider-onboarding-audit-2026-08-18|Featherless provider-onboarding audit]].

**Required evidence note:** The provider requirements and review sequence come from OpenRouter's page as checked on 2026-08-19. The launch, promotion, and outreach steps are the operating strategy that follows from those published rules.

### 1. Find a demand-backed gap

**Target:** 220 to 250 words.

**Job:** Give the reader a model-selection rule.

- Start with demand, then adjust for qualified provider scarcity.
- Do not use raw provider count as proof. Few providers can mean weak demand.
- Use three search lanes:
  1. **Day zero:** A strong new open-weight model that users already expect.
  2. **Event zero:** A policy, price, quota, outage, license, geography, model-removal, or client-adoption event that creates urgent demand.
  3. **Structural gap:** An existing model with measured use but too few providers that meet a named requirement.
- Screen the candidate for demand, qualified supply, possible edge, margin, capacity, and license.
- Run a manual screen before the build. Measure recent token and request growth, then count the providers that meet the requirement that matters to the target workload. Compare their price, uptime, context, region, tool support, latency, and throughput. Estimate the price, capacity, and margin that you can achieve. Build only if one useful gap remains.
- Use the proposed [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] as internal support for this screen.
- Start the worked flow with, "Let's say you are trying to find a wedge today."
- Link the [official OpenRouter rankings](https://openrouter.ai/rankings) for demand discovery.
- Link the [OpenRouter Inference Provider Market Share dashboard](https://or-provider-dashboard.vercel.app/) for provider share and model-level host competition. State that it is unofficial and has limited model coverage, then verify candidates on OpenRouter.
- Give the reader a short agent prompt that requests five candidates, current provider verification, performance and capability comparisons, source links, evidence dates, and a named unmet need. Tell the agent not to recommend a model only because it has few providers.

**Primary evidence:** [[inference-model-opportunity-data-source-audit-2026-08-19|Inference opportunity data-source audit]].

### 2. Prove that you can serve the gap

**Target:** 140 to 170 words.

**Job:** Set the gate before serious outreach or public claims.

- Run the model on the hardware that will support the offer.
- Require a working private endpoint or test harness.
- Repeat the benchmark under a written workload. Record concurrency, prompt and output lengths, hardware, quantization, serving engine, and test duration.
- Check time to first token, output throughput, error rate, uptime under load, GPU memory, and cost per million tokens.
- Build a concurrency curve. Record sustainable input and output tokens per minute, warm and cold performance, queue time, timeout behavior, and the point at which the service begins to return an HTTP `429` response, which tells the caller that capacity is full.
- Return an early `429` when the service is full instead of hiding overload in a long queue.
- Run a repeatable quality regression test against the reference model. Quantization and serving changes must not create an unacceptable loss in output quality.
- Test tool-call correctness if the offer includes tool use. Record valid calls, invalid calls, and execution failures separately.
- Confirm model-license and data-policy constraints.
- Calculate plausible unit economics and available capacity.
- Treat reliability as the gate. OpenRouter's normal routing favors lower prices among stable providers. Latency, throughput, tool-call quality, context length, region, privacy, and Zero Data Retention can win specific traffic or fill a capability gap.
- Stop if the edge is not reproducible or the economics fail.

**Core line:** Do not ask a gateway to diligence a benchmark that you cannot reproduce internally.

**BD gate:** If the internal proof passes, begin serious provider BD now while you complete the public endpoint. Earlier gateway conversations are discovery only.

### 3. Begin BD while you build the minimum review-ready endpoint

**Target:** 200 to 230 words.

**Job:** Start serious provider conversations from internal proof while completing the product that OpenRouter can inspect.

- Contact the provider team with the model, the network gap, and the repeatable internal result. Use `providers@openrouter.ai` or one relevant public contact. State clearly that the public endpoint is still in progress.
- Cite two named public contacts. [Shashank Goyal](https://www.linkedin.com/in/shashankgoyal1) is publicly identified as OpenRouter's Head of Provider Ecosystem. [Tomas Oliva](https://www.linkedin.com/posts/oliva-tomas_excited-to-share-that-today-marks-my-first-activity-7289788708579405824-tYx7) is publicly identified in provider operations and asked people to notify him when a new model drops.
- Recheck both roles before publication. Their public roles make them relevant contacts, but they do not guarantee a response or replace the formal provider channel.
- Contact one person first. Do not send the same pitch to several OpenRouter employees at once.
- Ask whether the gap matters and whether provider intake is active. Do not ask for a listing promise before technical review.
- Run the model on infrastructure that you operate, whether you own or rent it.
- Expose an authenticated public HTTPS endpoint.
- Support the required OpenAI-compatible chat interface.
- Support streaming responses and accurate usage-token counts.
- Expose machine-readable model information, including model ID, price, context limits, capacity, features, location, and compliance fields.
- Publish privacy and data-retention terms. State whether prompts are logged, how long data is kept, and whether it is used for training.
- Provide a price and a test key.
- Support OpenRouter's current monthly invoices and automatic token-count reconciliation.
- Confirm reliability before the launch window.

**What can wait:** self-serve signup, a full customer account and billing dashboard, payment pages for retail users, and a large marketing site. The public live performance dashboard in Step 4 cannot wait for the launch.

**Core line:** The endpoint makes the application testable. The website supports trust and policy disclosure.

**Evidence:** [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping means a live priced API]] and [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]].

### 4. Launch the service publicly

**Target:** 280 to 320 words, including the performance dashboard and pricing aside.

**Job:** Turn technical readiness into visible proof and measurable demand.

- Announce the model, base URL, price, context limits, region, privacy terms, and available capacity.
- Publish a reproducible benchmark method with time to first token, output speed, uptime, error rate, and the workload used.
- Give users a public live performance dashboard so they can verify that the service achieves the claimed edge under the serving conditions that define the offer. Link it from the launch post, API documentation, and gateway evidence packet.
- Choose the workload and operating conditions that matter to the target user. State them in full. Include concurrency, prompt and output lengths, warm or cold state, hardware class, quantization, serving engine, and region.
- Show current service status, rolling uptime, error rate, median and 95th-percentile time to first token, output tokens per second, and sample count. Use clear one-hour, 24-hour, and seven-day windows when that history exists.
- State whether each metric comes from production traffic or a synthetic probe. Show the model version, measurement method, and last update time.
- Do not expose prompts, customer data, gateway-specific traffic, credentials, or security-sensitive infrastructure details.
- State the gap that the service fills.
- Give testers a direct action. This can be API access, prepaid credit, or a small capped retail plan.
- Use a defined X promotion budget. Track organic and paid impressions, link visits, key requests, successful calls, repeat use, spend, and cost per qualified tester.
- Increase spend only if real use, reliability, and economics justify it.
- Keep retail traffic separate from gateway test traffic.

**Evidence boundary:** Public launch and paid reach can produce attention and demand evidence. They are not established causes of provider acceptance.

**Quick aside: A retail pricing ladder**

- Present this as a provider tactic to test.
- Start with a small, time-limited unlimited-token offer under a flat-rate, request-capped plan. State the limits on cohort size, request rate, concurrency, context, output length, campaign duration, and total loss.
- Issue keys manually to the first invite-only cohort so self-serve signup and a full billing dashboard can wait.
- Move to a subscription with a defined token allowance when usage data shows the workload shape.
- Charge per token when subscribers use more than the included allowance. Write `pay per token` on first use instead of `PPT`.
- If metered demand becomes the stronger product, make pay-per-token pricing the default and retire the subscription.
- The economic purpose is to subsidize early trial, create demand and operating data, and then reduce open-ended usage risk as the provider grows.

**Research provenance:** The Wafer research helped generate this hypothesis, but do not name or credit Wafer in the final article. The public evidence also does not prove the full pricing sequence.

### 5. Submit the OpenRouter application

**Target:** 110 to 130 words.

**Job:** Make the application easy to review.

- Submit during the same window as the public launch, after the endpoint is testable.
- Complete the [official OpenRouter provider form](https://openrouter.ai/providers/apply/form) with the required infrastructure, endpoint, model, and data-policy information.
- Add a recommended evidence packet for the form where possible and for later outreach. State:
  - the model and network gap;
  - the demand evidence;
  - the measurable edge and benchmark method;
  - the public live dashboard;
  - the base URL and test key;
  - pricing, capacity, and location;
  - privacy and retention terms; and
  - the operating contact.
- Do not make the reviewer reconstruct the offer from several pages.
- Do not make large, hard-to-reverse capacity purchases from provider scarcity alone.

**Possible insert:** A compact application-packet checklist.

### 6. Follow up with the provider team using live evidence

**Target:** 110 to 140 words.

**Job:** Turn the earlier provider conversation into a specific post-application follow-up.

- Discovery can happen before internal proof. The serious listing pitch begins after Step 2 and continues while the endpoint is built.
- Send the live endpoint, the exact gap, the price, the benchmark, the public dashboard, and a dedicated test key.
- OpenRouter's job materials confirm that provider messages through X and LinkedIn are real inbound channels.
- Continue the existing provider email or contact thread. Follow up with the same provider-ecosystem or provider-operations contact named in Step 3. Use new launch evidence rather than repeating the earlier message.
- Keep the customer-facing launch post clear. Use a reply, direct message, or separate note for the provider pitch when that reads better.
- Follow up with new evidence, not repeated pressure.

**Attribution rule to preserve:** Shashank Goyal is the provider-ecosystem contact. The public request to report new model drops came from Tomas Oliva.

### 7. Pass review, then win routed traffic

**Target:** 150 to 180 words.

**Job:** Separate acceptance from the business result.

- Use OpenRouter's published sequence: application, technical review, integration and test traffic, then production.
- Expect checks for API compatibility, reliability, pricing, and performance.
- Give OpenRouter a separate key so gateway test calls can be measured.
- Record response time, review requests, test traffic, decision, and stated reason.
- After listing, track routed requests, revenue, margin, error rate, and repeat demand.
- Explain that a gap can close quickly when more providers add the model.
- OpenRouter removes recently unstable providers from the first routing group. Its normal routing then favors lower prices among stable providers. Users can instead select for latency or throughput. Auto Exacto uses tool-call quality and performance to route tool traffic.
- Compare OpenRouter's public time-to-first-token, throughput, and uptime measurements with the provider's launch dashboard.
- Keep four outcomes separate: public attention, endpoint use, listing acceptance, and routed demand.

**Core line:** Listing gives the provider access to distribution. It does not guarantee distribution.

### Conclusion: Build the application that can be called

**Target:** 60 to 80 words.

**Job:** Compress the whole playbook into one operating rule.

- Find a gap with demand.
- Prove one useful edge.
- Ship the endpoint and evidence.
- Launch, apply, and contact the provider team in one measured window.
- Treat acceptance and routed traffic as separate gates.

**Closing line candidate:** Do not ask for a listing before the endpoint is callable. Give OpenRouter a useful gap, a live endpoint, a measurable edge, and a test key.

## V1 Supporting Element

- Include one compact seven-step checklist at the end.
- Include the short retail pricing ladder inside Step 4. Do not turn it into a company case-study sidebar.
- Keep the checklist to 100 words or less. Keep the full article, including the checklist, below 1,800 words.

Do not add a second table, a company sidebar, or a downloadable evidence-packet template in version one. These can become separate follow-up material.

## Main Evidence Set

- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]
- [[dylan-build-first-inference-gateway-listing-synthesis-2026-08-19|Dylan's build-first gateway-listing synthesis]]
- [[dylan-openrouter-listing-case-study-causal-audit-2026-08-18|Dylan's causal audit of the OpenRouter case studies]]
- [[current-openrouter-research-found-no-public-first-hand-provider-listing-account|Current OpenRouter research found no public first-hand provider-listing account]]
- [[day-zero-shipping-is-evidenced-after-listing-not-as-a-path-to-approval|Day-zero shipping is evidenced after listing, not as a path to approval]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|Public benchmarked endpoint and paid-launch hypothesis]]
- [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Event-zero launch hypothesis]]
- [[waferpass-bootstrap-public-evidence-check-2026-08-19|WaferPass bootstrap evidence check]]
- [[waferpass-anthropic-openclaw-event-timeline-2026-08-19|WaferPass and Anthropic/OpenClaw timeline]]
- [[exa-featherless-hugging-face-provider-onboarding-audit-2026-08-18|Featherless Hugging Face onboarding audit]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference opportunity data-source audit]]
- [[inference|Inference]]

## Open Draft Decisions

- Final title and subtitle.
- Exact compression of the retail pricing ladder inside Step 4.
- Whether to include the paid-promotion tactic in the title or only in step four.
- Final wording of the required evidence note.

## Publication-Day Checks

- Confirm that the live provider page still contains both priority statements in one page version. Save the access date and an archive.
- Recheck Shashank Goyal's and Tomas Oliva's public roles. Keep both named in the BD step.

## Updates

- 2026-08-19: Created after Dylan approved a hybrid, 1,200-to-1,800-word, seven-step operator playbook for new inference providers seeking an OpenRouter listing.
- 2026-08-19: Added OpenRouter's proprietary-model priority, corrected the proposed radar status, separated official application fields from the recommended evidence packet, added quality and tool-call tests, dated the Qwen and Tomas examples, and limited version one to one supporting checklist.
- 2026-08-19: Made the vault's Blogpost Drafting Harness controlling for the article. Added ASD-STE100 Simplified Technical English and explicit connective-word rules for reader-visible prose.
- 2026-08-19: Defined `proprietary model` for this article and preserved that OpenRouter does not publish an exact boundary for the term.
- 2026-08-19: Replaced the detailed proprietary-model explanation with Dylan's approved one-sentence bridge into the network-gap playbook.
- 2026-08-19: Moved the start of serious provider BD to immediately after internal proof. Step 3 now runs BD and the public endpoint build in parallel. Step 6 is the post-application follow-up with live evidence.
- 2026-08-19: Added Dylan's Wafer-inspired retail pricing ladder to Step 4: temporary flat-rate access, a defined subscription allowance, pay-per-token overage, and a possible full move to pay-per-token pricing. Preserved that the public Wafer record does not prove this exact sequence.
- 2026-08-19: Removed Wafer attribution from the reader-visible pricing aside. Preserved Wafer only as internal hypothesis provenance.
- 2026-08-19: Added Shashank Goyal and Tomas Oliva as named public BD contacts in Step 3. Preserved that the new-model notification request came from Tomas, not Shashank, and that the named contacts do not replace the formal application channel.
- 2026-08-19: Made a public live performance dashboard part of the launch package. Defined the minimum live metrics and separated it from the full customer account dashboard that can wait.
- 2026-08-19: Completed a full outline review. Added a manual gap screen, load and overload tests, exact routing logic, the official provider email, a single-contact sequence, clearer privacy and payment requirements, and a worked Qwen screen. Defined the public dashboard as proof of the provider's claimed edge under declared serving conditions. Kept the seven-step sequence without failure branches and retained unlimited-token language for the flat-rate, request-capped launch offer.
- 2026-08-19: Applied the post-review patch. Removed the repeated opening thesis, added a dated Stripe acquisition note without an unconfirmed sale price, reduced section targets so the checklist fits below 1,800 words, added publication-day source checks, and tightened the closing. Kept the two named BD contacts, the live dashboard, and the seven-step structure without a failure branch.
- 2026-08-19: Drafted the complete version-one article from this skeleton and linked it above. The draft retains the approved seven-step sequence, named provider contacts, live dashboard, retail pricing aside, and evidence boundaries.
- 2026-08-19: Removed the Stripe acquisition sentence from the article and the drafting instructions because it did not change the provider-listing playbook. Kept the acquisition evidence in the source note.
- 2026-08-19: Replaced the policy-first opening with Dylan's research-led framing. The opening now starts with the provider documents and public case studies behind the guide, then states the network-gap playbook.
- 2026-08-19: Calibrated definitions to the target reader after the draft overexplained basic inference terms. ASD-STE100 still controls sentence clarity, but the article now assumes that an inference provider understands standard serving vocabulary.
- 2026-08-19: Replaced the dated Qwen example with a present-tense wedge search. Added the official OpenRouter rankings, the unofficial provider market-share dashboard, and a reusable agent prompt that joins demand, provider supply, operating edge, and source verification.
