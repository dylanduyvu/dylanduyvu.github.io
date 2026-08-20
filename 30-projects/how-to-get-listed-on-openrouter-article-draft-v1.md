---
type: blog-draft
status: draft-v1
created: 2026-08-19
updated: 2026-08-19
source: how-to-get-listed-on-openrouter-article-skeleton
register: "ASD-STE100 Simplified Technical English; simple declarative; no em dashes"
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: [tomas-oliva, shashank-goyal]
orgs: [openrouter]
sources: [openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19, inference-model-opportunity-data-source-audit-2026-08-19]
tags: [article, openrouter, provider-listing, operator-playbook, draft-v1]
---

# How to get listed on OpenRouter as an inference provider

I read through OpenRouter's provider documents and compiled every public source I could find from inference providers that have already been listed on OpenRouter or another gateway. I then compared their launches with OpenRouter's published rules. This is what I learned about how a new provider can put its best foot forward to get listed.

[OpenRouter currently prioritizes](https://openrouter.ai/providers/apply) providers that bring models they own or control. But it also gives priority to providers that fill gaps in its network, which is the route this guide covers.

A solo application won't get you noticed. It's best to: first, find a gap, prove that you can serve it, and launch a public endpoint with performance data that anyone can inspect. Then apply, contact the provider team, and give them an offer they can test.

## 1. Find a gap with real demand

Let's say you are trying to find a wedge today. Look in three places:

- A strong, upcoming open-weight model release can create a day-zero opening.
- A new policy, outage, price change, quota change, license change, or popular client blowup can create replacement demand.
- An existing model can have users but still lack an important provider feature.

Use the [OpenRouter rankings](https://openrouter.ai/rankings) to find models with rising usage. Then use the [OpenRouter Inference Provider Market Share dashboard](https://or-provider-dashboard.vercel.app/) to see which hosts serve the top models and how their routing share changes. The provider dashboard is unofficial and its model view covers the top models, so confirm each candidate on its OpenRouter model and endpoint pages.

Give your agent a prompt like this:

> Using the OpenRouter rankings and provider market-share dashboard, find five open-weight models with rising OpenRouter usage and limited qualified provider supply. For each model, verify the current provider list on OpenRouter. Compare price, uptime, context length, region, privacy, latency, output speed, and tool support. Name the unmet need, cite each source, and state the evidence date. Do not recommend a model only because it has few providers.

Use the result to choose one gap worth testing. Before you commit hardware, estimate the price, capacity, and gross margin you can achieve. If you cannot show demand and a profitable edge, keep looking.

## 2. Prove the edge on your hardware

Run the model on the planned hardware through a private endpoint. Before the test, record simultaneous requests, prompt and output lengths, hardware, serving software, duration, and quantization.

Measure time to first token. Also measure output speed, errors, queue time, GPU memory use, and cost per million tokens. Repeat the test at several request levels to find where the service starts to fail.

When capacity is full, return an HTTP `429` response quickly. A long hidden queue makes the service look slow and reduces measured throughput.

Compare output quality with the unmodified model. If you offer tool use, count valid calls, invalid calls, and execution failures separately. Also check the model license and your data policy.

Stop if the result is not repeatable or the revenue cannot cover GPU and operating costs. Serious provider outreach should only start after this internal proof passes.

## 3. Start provider outreach while you finish the endpoint

Once the internal test passes, start business development while you finish the public service. Send the model, network gap, measured result, and endpoint date. Ask whether the gap matters and whether OpenRouter is reviewing new providers. Do not ask for a listing promise before technical review.

You can use `providers@openrouter.ai`, but bespoke outreach also matters. [Shashank Goyal](https://www.linkedin.com/in/shashankgoyal1) is OpenRouter's Head of Provider Ecosystem. [Tomas Oliva](https://www.linkedin.com/posts/oliva-tomas_excited-to-share-that-today-marks-my-first-activity-7289788708579405824-tYx7) works in provider operations and has asked people to notify him when a new model drops. Contact one person first. Do not send the same pitch to several employees at once.

At the same time, finish the minimum product that OpenRouter can inspect.

- Run the model on infrastructure that you operate, whether you own or rent it.
- Expose an authenticated public HTTPS endpoint that supports OpenAI-compatible chat requests, streaming answers, and accurate token counts.
- Publish a `/models` endpoint with the model ID, price, context length, features, capacity, location, and data-handling fields.
- Publish privacy terms that state whether you log prompts, how long you keep data, and whether you train on it.
- Set a price, prepare a test key, and support monthly invoicing.

Self-serve signup, retail billing, and a large marketing site can wait. The endpoint makes the application testable. The website only needs to support trust, documentation, and policy disclosure.

## 4. Launch with proof that anyone can inspect

Announce the model, base URL, price, context limit, region, privacy terms, capacity, and the gap. Ask readers to request a key, buy credit, or join a small retail plan.

Publish the benchmark method, workload, and result. One speed number can hide low concurrency, short prompts, an already warm model, or a different setup.

The launch also needs a public live performance dashboard. It must show that the service meets the claimed edge under the conditions that define the offer. State concurrency, prompt and output lengths, warm or cold state, hardware class, quantization, serving software, and region.

Show current status, rolling uptime, error rate, median and 95th-percentile time to first token, output tokens per second, and sample count. Use clear time windows and label production traffic and automated tests separately. Show the model version, method, and last update time. Never expose prompts, customer data, credentials, or sensitive infrastructure details.

Post the launch on X and link the same dashboard from the post, API documentation, and application packet. Set a promotion budget and track impressions, visits, key requests, successful calls, repeat use, and spend. Increase the budget only when the service stays reliable and produces useful demand evidence. Put a gateway mention in a reply or separate note if it weakens the customer post.

A small retail pass can make the launch easier to test. Start with a time-limited, unlimited-token offer under a flat-rate, request-capped plan. Cap users, request rate, concurrency, campaign length, and total loss. Issue the first keys manually. Then move to a subscription with a token allowance and pay-per-token overage. If pay-per-token use becomes the stronger product, make it the default.

Public attention and paid traffic can make the endpoint easier to notice and test. They do not establish that OpenRouter will accept it. Launch only after the service can survive the traffic you plan to buy.

## 5. Submit one complete application

Apply through the [official provider form](https://openrouter.ai/providers/apply/form) when the endpoint is live. Use the same launch window for the application, public announcement, and direct follow-up.

Give the reviewer one evidence packet. It should state the model, the network gap, demand evidence, your measured edge, the benchmark method, and the dashboard link. Add the base URL, a dedicated test key, price, capacity, location, privacy terms, and an operating contact.

OpenRouter asks for infrastructure, endpoint, model, and data-policy information before technical review. Do not force the reviewer to rebuild the offer from several pages. But do not buy large, hard-to-reverse capacity only because the model has few providers. The application is evidence, not a purchase commitment.

## 6. Follow up with new evidence

Continue the same provider thread that you started after the internal test. Send the live endpoint, exact gap, price, benchmark, dashboard, and dedicated test key. OpenRouter's [partner-development job material](https://jobs.ashbyhq.com/openrouter/99b31b81-5ee6-4f4a-990b-d4f4f1b65516) confirms that provider messages through X and LinkedIn are real inbound channels.

Use the same relevant contact from Step 3. The launch gives you a reason to follow up because the offer is now public and callable. If the metrics improve, send the new result. If real users appear, send the usage evidence. Repeat evidence, not pressure.

## 7. Treat listing and traffic as separate gates

[OpenRouter's published process](https://openrouter.ai/providers/apply) has four stages: application, technical review, integration and test traffic, then production. The review covers API compatibility, reliability, pricing, and performance. Give OpenRouter a separate key so you can measure its test calls without mixing them with retail traffic.

Acceptance is not the business result. After listing, OpenRouter's normal routing favors lower prices among stable providers. Users can instead choose providers by latency or throughput. Tool requests can use Auto Exacto, which also considers tool-call success.

Reliability has hard effects. OpenRouter starts its uptime calculation after 100 requests. Providers at 95% uptime or higher keep normal routing priority. Providers between 80% and 94% receive less traffic, while providers below 80% are used only as fallback.

Track routed requests, revenue, gross margin, errors, and repeat demand after listing. Compare OpenRouter's public time-to-first-token, throughput, and uptime figures with your dashboard. A gap can also close quickly when more providers add the same model.

Keep four outcomes separate: public attention, direct endpoint use, listing acceptance, and routed demand. Listing gives you access to distribution. It does not guarantee distribution.

## Build the application that can be called

Find a gap with demand, then prove one edge on the hardware you will use. Start focused provider outreach, finish the endpoint, and launch with public evidence. Then apply and follow up with a test key.

Do not ask for a listing before the endpoint is callable. Give OpenRouter a useful gap, a live endpoint, a measurable edge, and a test key.

## Seven-step checklist

- Find demand with scarce qualified supply.
- Prove one edge on real hardware.
- Start focused outreach after internal proof.
- Ship the priced endpoint and live dashboard.
- Launch publicly and submit the form.
- Follow up with new evidence and a test key.
- Measure acceptance and routed traffic separately.

## Related research

- [[how-to-get-listed-on-openrouter-article-skeleton|Article skeleton and claim ledger]]
- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding source check]]
- [[inference-model-opportunity-data-source-audit-2026-08-19|Inference opportunity data-source audit]]
- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|Public endpoint and paid-launch hypothesis]]
- [[inference|Inference area]]
