---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: chat
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: []
orgs: [openrouter, hugging-face, vercel]
tags: [provider-listing, gap-filling, day-zero-serving, paid-distribution, business-development]
---

# Dylan: Build a gap-filling endpoint before relying on gateway business development

## Raw Context

> still researching, but my best foot forward action to get listed on inference gateways is:
>
> set up the infrastructure ready to serve an undeserved open source model. for these gateways, plugging provider network holes is the priority over competition and race to the bottom dynamics amongst already popular models. this can mainly be done via two strats:
> 1/ day 0 service of a new chinese open source model with impressive performance on typical stats (i.e., cost, latency)
> 2/ find underserved open source model (by provider # - easiest - or by underserved performance attribute) and serve it there
> launch an inference endpoint publicly and announce it on twitter citing the hole that you're plugging. boost the tweet maximally to get eyeballs on it. tag target gateways in the tweet.
> apply formally through application channels on these gateways
> do bd with the target gateways (there are heads of provider eco that we can target) to speed up our application process; openrouter's provider eco head specifically asks to be notified when a new model drops for example
>
> notably, it's the wrong strategy to gate building the infra and endpoint before doing bd. there is no shot that we get a confirmation that we can get listed ahead of a technical diligence of our performance
>
> wdyt about this^ my synthesis

## Revised Raw Context

Later on 2026-08-19, Dylan narrowed the target to OpenRouter and made the second model-selection strategy more specific:

> still researching, but my best foot forward action to get listed on openrouter is:
>
> set up the infrastructure ready to serve an undeserved open source model. for these gateways, plugging provider network holes is the priority over competition and race to the bottom dynamics amongst already popular models. this can mainly be done via two strats:
> 1/ day 0 service of a new chinese open source model with impressive performance on typical stats (i.e., cost, latency)
> 2/ find underserved open source model (by provider # - easiest to spot - or by underserved performance attribute), build the best metric on a primary parameter or alternative parameter if price and latency are farmed (i.e., context window, throughput, uptime, tool call reliability) and serve it there
> launch an inference endpoint publicly and announce it on twitter citing the hole that you're plugging. boost the tweet maximally to get eyeballs on it. tag target gateways in the tweet.
> apply formally through application channels on these gateways
> do bd with the target gateways (there are heads of provider eco that we can target) to speed up our application process; openrouter's provider eco head specifically asks to be notified when a new model drops for example
>
> notably, it's the wrong strategy to gate building the infra and endpoint before doing bd. there is no shot that we get a confirmation that we can get listed ahead of a technical diligence of our performance
>
> modified a bit^

## Revision Delta

- The target is now OpenRouter, not inference gateways as a general class.
- The existing-model strategy now requires a measurable performance edge. Price and latency are the first checks. If those are already saturated, the candidate edge can be context length, throughput, uptime, or tool-call reliability.
- Provider count remains the easiest supply-gap signal, but it is not enough without demand.

## Generalized Revision

Later on 2026-08-19, Dylan generalized the action plan from OpenRouter to centrally curated inference gateways and made formal applications conditional on the gateway having a public application channel:

> changing the breakdown to: apply formally through application channels on these gateways (where they exist)
>
> still researching, but my best foot forward action to get listed on curated provider gateways (like openrouter, huggingface, vercel, etc.) is:
>
> is probably good enough right? to generalized for the curated provider gateway strategy?

### Generalized Revision Delta

- The action plan now targets centrally curated inference gateways, including OpenRouter, Hugging Face Inference Providers, and Vercel AI Gateway.
- A formal provider application is one possible intake path, not a feature of every gateway.
- When no public application exists, use the gateway's partnership or provider-ecosystem contact.
- The sequence can transfer across this gateway type. OpenRouter's stated priority for network gaps does not transfer as verified evidence to every other gateway.

## Internal-Proof Gate Correction

Later on 2026-08-19, Dylan challenged the suggestion to begin serious business development before the build was complete:

> Do not wait until the build is complete before starting BD. - why? we'd probably at least want some internal proof we can deliver on the gap right? that's what we'd wait for?

### Correction Delta

- Serious provider-listing outreach should wait for repeatable internal proof that the team can deliver the proposed edge.
- The internal gate does not require a finished public or production-scale service. It requires a working private endpoint or test harness, reproducible results on relevant hardware, plausible unit economics, and no known model-license blocker.
- Before this gate, gateway conversations should be limited to discovery. The team can ask about supply gaps and technical requirements, but it should not claim that the service is ready.
- After the internal gate, the team can begin serious business development while it completes the public, review-ready endpoint. Formal application and public launch should wait for the required endpoint and evidence packet.

## Sent Version

Later on 2026-08-19, Dylan sent this version:

> still researching, but my best foot forward action to get listed on curated provider gateways (like openrouter, huggingface, vercel, etc.) is:
>
> set up the infrastructure ready to serve an undeserved open source model. for these gateways, plugging provider network holes is the priority over competition and race to the bottom dynamics amongst already popular models. this can mainly be done via two strats:
> 1/ day 0 service of a new chinese open source model with impressive performance on typical stats (i.e., cost, latency)
> 2/ find underserved open source model (by provider # * demand - easiest to spot - or by underserved performance attribute), build the best metric on a primary parameter or alternative parameter if price and latency are farmed (i.e., context window, throughput, uptime, tool call reliability, geography) and serve it there
> launch an inference endpoint publicly and announce it on twitter citing the hole that you're plugging - doesn't have to @ the gateways specifically. boost the tweet maximally to get eyeballs on it. tag target gateways in the tweet (maybe replies or something).
> apply formally through application channels on these gateways (where they exist)
> do bd with the target gateways (there are heads of provider eco that we can target) to speed up our application process; openrouter's provider eco head specifically asks to be notified when a new model drops for example
>
> notably, it's the wrong strategy to gate building the infra with bd. probably the move is identify gap, prove internally you can service the gap, bd with that and make it publicly serviceable, full retail strat push (tweet etc.) + formal application to provider. there is no shot that we get a confirmation that we can get listed as a provider ahead of a technical diligence of our performance

### Sent-Version Delta

- The internal proof is now an explicit gate before serious provider business development.
- The existing-model screen now combines provider scarcity with demand and includes geography as a possible performance or capability edge.
- The main launch post does not need to mention a gateway directly. Targeted mentions can be separate replies or follow-up.
- “Provider count times demand” is best interpreted as demand adjusted for provider scarcity. A literal multiplication by provider count would rank crowded models higher, which is the opposite of the intended screen.

## Durable Delta

Dylan's revised best-action synthesis is select a gap, prove the edge internally, then begin serious business development while completing the public endpoint. Launch and the available provider-intake path follow when the endpoint is review-ready. The supply strategy has two arms: serve a high-interest new Chinese open model on day zero, or find an existing model with demand, too few providers, and a performance attribute that can lead its current provider set.

The synthesis rejects waiting for pre-approval before building a review-ready endpoint. It treats the endpoint and measured performance as the object that makes technical review possible.

## Evidence Status

- **Direct official support:** OpenRouter says applications must meet its technical requirements before review and that it gives priority to providers that fill gaps in its network.
- **Reasonable inference:** Building a minimum review-ready endpoint before formal approval is the strongest current action for OpenRouter.
- **Reasonable inference:** A repeatable internal proof is the correct gate for serious business development. It prevents an unsupported performance pitch without requiring the full production build first.
- **Transfer hypothesis:** The build, prove, launch, apply where possible, and follow-up sequence can transfer to other centrally curated inference gateways. Each gateway can have different selection criteria and integration work.
- **Open hypothesis:** Day-zero service, paid X amplification, public tagging, or direct outreach improves acceptance odds or review speed.
- **Required correction:** The public “ping me when a new model drops” statement came from Tomas Oliva in provider operations, not from Shashank Goyal, OpenRouter's Head of Provider Ecosystem.

## Links

- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]
- [[inference|Inference]]
