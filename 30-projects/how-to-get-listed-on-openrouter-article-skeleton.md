---
type: project
status: pre-draft
created: 2026-08-19
updated: 2026-08-19
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: [tomas-oliva, shashank-goyal]
orgs: [openrouter, wafer-ai, hugging-face, featherless-ai]
tags: [article, openrouter, provider-listing, operator-playbook, pre-draft]
---

# How to Get Listed on OpenRouter as an Inference Provider

## Article Target

- **Reader:** A new inference provider with access to GPUs that wants to become an OpenRouter provider.
- **Format:** A short, chronological operator playbook.
- **Target length:** 1,200 to 1,800 words. Draft toward 1,500.
- **Reader promise:** The best available process for selecting a useful model, proving an edge, shipping a review-ready endpoint, applying, and earning routed traffic.
- **Core thesis:** OpenRouter has a large provider backlog. It currently says it prioritizes providers with proprietary models, meaning models that the provider owns or controls rather than unchanged public weights that many companies can host. It also gives priority to providers that fill gaps in its network. An open-weight provider should therefore enter with demand-backed scarce supply and a live, measurable service instead of joining a crowded model price war.

## Writing Rules

- Follow the full [[blogpost-drafting-harness|Blogpost Drafting Harness]] for drafting, revision, evidence checks, normal-English checks, and pre-publish review.
- Use ASD-STE100 Simplified Technical English for all reader-visible prose. Prefer common words, active voice, simple sentence structure, and one main idea per sentence.
- Use the shortest connective word that states the logical relationship between sentences. Use words such as `but`, `and`, `so`, `because`, `still`, `instead`, `for example`, or `that said` when the relationship is not already clear.
- Do not stack connective words. Do not begin two sentences in sequence with connective words. Join the second relationship inside the sentence when this reads better.
- Use normal English. Explain gateway and inference terms on first use.
- Keep the article practical. Every section must end with an action or decision.
- State OpenRouter's published requirements and process as facts.
- Present provider actions as examples, not proof that the same action caused acceptance.
- Present day-zero shipping, event-zero shipping, paid X promotion, retail offers, and direct outreach as tactics to test.
- Do not turn provider count into demand. Combine demand, qualified supply scarcity, achievable edge, margin, and capacity.
- Do not say that OpenRouter's gap priority applies to every inference gateway.
- Do not use an unpublished or automated source as proof when an official source exists.

## Claim Ledger

| Article claim | Evidence status | Main support |
| --- | --- | --- |
| OpenRouter has a provider backlog, currently prioritizes providers with proprietary models, and also gives priority to providers that fill network gaps. | Direct official evidence | [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]] |
| A provider must meet the technical requirements before OpenRouter reviews it. | Direct official evidence | [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]] |
| A useful target needs demand and scarce qualified supply. | Reasonable decision rule | [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] |
| Serious provider business development should start after repeatable internal proof. | Reasonable operating inference | [[dylan-build-first-inference-gateway-listing-synthesis-2026-08-19|Dylan's build-first synthesis]] |
| Shipping means a live, authenticated, priced API rather than a marketing website. | Supported working definition | [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping an inference model means a live priced API, not a website]] |
| Public launch, paid promotion, and direct outreach can make a review-ready provider easier to notice and test. | Testable hypothesis | [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|Public endpoint and paid-launch hypothesis]] |
| A provider can launch against a market demand shock, not only a new model release. | Testable hypothesis | [[inference-providers-can-ship-against-demand-shocks-not-only-model-releases|Event-zero launch hypothesis]] |
| Listing does not guarantee traffic. Price, reliability, latency, throughput, and tool-call success affect later routing. | Direct official evidence | [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]] |

## Article Skeleton

### Opening: Getting listed starts before the application

**Target:** 100 to 130 words.

**Job:** Break the belief that the form is the main work.

- OpenRouter has a large provider backlog.
- It currently says it prioritizes providers with proprietary models. OpenRouter does not define the exact boundary on the application page. In this article, the term means an original model, private fine-tune, or exclusive model that the provider owns or controls. Serving unchanged Qwen, Llama, or GLM weights faster does not make the model proprietary.
- This priority makes the case harder for a new open-weight provider.
- A complete application for another crowded endpoint is weak positioning.
- OpenRouter says it prioritizes providers that fill gaps in its network.
- The useful question is not, "How do I complete the form?" It is, "What missing supply can I make live and testable?"
- Preview the sequence: find, prove, build, launch, apply, contact, and compete.

**Primary evidence:** [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]].

**Required evidence note:** The provider requirements and review sequence come from OpenRouter. The launch, promotion, and outreach steps are the operating strategy that follows from those published rules.

### 1. Find a demand-backed gap

**Target:** 180 to 220 words.

**Job:** Give the reader a model-selection rule.

- Start with demand, then adjust for qualified provider scarcity.
- Do not use raw provider count as proof. Few providers can mean weak demand.
- Use three search lanes:
  1. **Day zero:** A strong new open-weight model that users already expect.
  2. **Event zero:** A policy, price, quota, outage, license, geography, model-removal, or client-adoption event that creates urgent demand.
  3. **Structural gap:** An existing model with measured use but too few providers that meet a named requirement.
- Screen the candidate for demand, qualified supply, possible edge, margin, capacity, and license.
- Use a manual candidate checklist now. The proposed [[inference-model-opportunity-radar|Inference Model Opportunity Radar]] is the planned repeatable version, but no collector or dashboard exists yet.

**Example options:** Qwen3.8-27B, released on 2026-08-14, as a time-bound release candidate; WaferPass as an event-timing example. Recheck Qwen provider supply before drafting. Do not treat either example as proof of an OpenRouter listing tactic. Source: [[qwen3-8-27b-open-weights-release-date-2026-08-14|Qwen3.8-27B release record]].

### 2. Prove that you can serve the gap

**Target:** 150 to 190 words.

**Job:** Set the gate before serious outreach or public claims.

- Run the model on the hardware that will support the offer.
- Require a working private endpoint or test harness.
- Repeat the benchmark under a written workload. Record concurrency, prompt and output lengths, hardware, quantization, serving engine, and test duration.
- Check time to first token, output throughput, error rate, uptime under load, GPU memory, and cost per million tokens.
- Run a repeatable quality regression test against the reference model. Quantization and serving changes must not create an unacceptable loss in output quality.
- Test tool-call correctness if the offer includes tool use. Record valid calls, invalid calls, and execution failures separately.
- Confirm model-license and data-policy constraints.
- Calculate plausible unit economics and available capacity.
- Choose one important edge. Price and latency are the first checks. Other edges can include throughput, context length, uptime, tool-call reliability, region, privacy, or Zero Data Retention.
- Stop if the edge is not reproducible or the economics fail.

**Core line:** Do not ask a gateway to diligence a benchmark that you cannot reproduce internally.

### 3. Build the minimum review-ready endpoint

**Target:** 210 to 250 words.

**Job:** Define the product that OpenRouter can inspect.

- Run the model on provider-controlled infrastructure.
- Expose an authenticated public HTTPS endpoint.
- Support the required OpenAI-compatible chat interface.
- Support streaming responses and accurate usage-token counts.
- Expose machine-readable model information, including model ID, price, context limits, capacity, features, location, and compliance fields.
- Publish privacy and data-retention terms.
- Provide a price and a test key.
- Meet OpenRouter's current payment and operating requirements.
- Confirm reliability before the launch window.

**What can wait:** self-serve signup, a full dashboard, payment pages for retail users, and a large marketing site.

**Core line:** The endpoint is the application. The website supports trust and policy disclosure.

**Evidence:** [[shipping-an-inference-model-means-a-live-priced-api-not-a-website|Shipping means a live priced API]] and [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter primary-source check]].

### 4. Launch the service publicly

**Target:** 150 to 190 words.

**Job:** Turn technical readiness into visible proof and measurable demand.

- Announce the model, base URL, price, context limits, region, privacy terms, and available capacity.
- Publish a reproducible benchmark method with time to first token, output speed, uptime, error rate, and the workload used.
- State the gap that the service fills.
- Give testers a direct action. This can be API access, prepaid credit, or a small capped retail plan.
- Use a defined X promotion budget. Track organic and paid impressions, link visits, key requests, successful calls, repeat use, spend, and cost per qualified tester.
- Increase spend only if real use, reliability, and economics justify it.
- Keep retail traffic separate from gateway test traffic.

**Evidence boundary:** Public launch and paid reach can produce attention and demand evidence. They are not established causes of provider acceptance.

### 5. Submit the OpenRouter application

**Target:** 120 to 150 words.

**Job:** Make the application easy to review.

- Submit during the same window as the public launch, after the endpoint is testable.
- Complete the official fields for infrastructure, endpoints, models, and data policies.
- Add a recommended evidence packet for the form where possible and for later outreach. State:
  - the model and network gap;
  - the demand evidence;
  - the measurable edge and benchmark method;
  - the base URL and test key;
  - pricing, capacity, and location;
  - privacy and retention terms; and
  - the operating contact.
- Do not make the reviewer reconstruct the offer from several pages.
- Do not make large, hard-to-reverse capacity purchases from provider scarcity alone.

**Possible insert:** A compact application-packet checklist.

### 6. Contact the provider team with evidence

**Target:** 130 to 170 words.

**Job:** Define useful business development rather than generic follow-up.

- Start discovery earlier if useful, but begin the serious listing pitch only after repeatable internal proof.
- Send the live endpoint, the exact gap, the price, the benchmark, and a dedicated test key.
- OpenRouter's job materials confirm that provider messages through X and LinkedIn are real inbound channels.
- In a 2025 first-day post, Tomas Oliva, then identified publicly in provider operations, asked people to notify him when a new model drops. Recheck his role before publication.
- Keep the customer-facing launch post clear. Use a reply, direct message, or separate note for the provider pitch when that reads better.
- Follow up with new evidence, not repeated pressure.

**Correction to preserve:** The new-model quote came from Tomas Oliva, not Shashank Goyal.

### 7. Pass review, then win routed traffic

**Target:** 170 to 210 words.

**Job:** Separate acceptance from the business result.

- Use OpenRouter's published sequence: application, technical review, integration and test traffic, then production.
- Expect checks for API compatibility, reliability, pricing, and performance.
- Give OpenRouter a separate key so gateway test calls can be measured.
- Record response time, review requests, test traffic, decision, and stated reason.
- After listing, track routed requests, revenue, margin, error rate, and repeat demand.
- Explain that a gap can close quickly when more providers add the model.
- Normal routing then rewards stable, lower-priced endpoints. Users can also select for latency or throughput. Tool-call success can affect tool traffic.
- Keep four outcomes separate: public attention, endpoint use, listing acceptance, and routed demand.

**Core line:** Listing gives the provider access to distribution. It does not guarantee distribution.

### Conclusion: Build the application that can be called

**Target:** 70 to 100 words.

**Job:** Compress the whole playbook into one operating rule.

- Find a gap with demand.
- Prove one useful edge.
- Ship the endpoint and evidence.
- Launch, apply, and contact the provider team in one measured window.
- Treat acceptance and routed traffic as separate gates.

**Closing line candidate:** Do not ask OpenRouter to believe a future promise. Give it a useful gap, a live endpoint, a measurable edge, and a test key.

## V1 Supporting Element

- Include one compact seven-step checklist at the end.

Do not add a second table, a WaferPass sidebar, or a downloadable evidence-packet template in version one. These can become separate follow-up material.

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
- [[qwen3-8-27b-open-weights-release-date-2026-08-14|Qwen3.8-27B release record]]
- [[inference|Inference]]

## Open Draft Decisions

- Final title and subtitle.
- Whether the opening should name the application backlog in its first sentence.
- Whether to keep the dated Qwen3.8-27B example after its provider supply is checked again.
- Whether WaferPass earns one sentence in the event-zero subsection. Do not add a sidebar in version one.
- Whether to include the paid-promotion tactic in the title or only in step four.
- Final wording of the required evidence note.

## Updates

- 2026-08-19: Created after Dylan approved a hybrid, 1,200-to-1,800-word, seven-step operator playbook for new inference providers seeking an OpenRouter listing.
- 2026-08-19: Added OpenRouter's proprietary-model priority, corrected the proposed radar status, separated official application fields from the recommended evidence packet, added quality and tool-call tests, dated the Qwen and Tomas examples, and limited version one to one supporting checklist.
- 2026-08-19: Made the vault's Blogpost Drafting Harness controlling for the article. Added ASD-STE100 Simplified Technical English and explicit connective-word rules for reader-visible prose.
- 2026-08-19: Defined `proprietary model` for this article and preserved that OpenRouter does not publish an exact boundary for the term.
