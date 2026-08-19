---
type: source
status: captured
created: 2026-08-19
updated: 2026-08-19
source_date: 2026-08-19
source_type: chat
domains: [inference, inference-marketplaces, distribution, go-to-market]
people: []
orgs: [openrouter]
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

## Durable Delta

Dylan's current best-action synthesis is build first, then launch, apply, and run business development in one coordinated window. The supply strategy has two arms: serve a high-interest new Chinese open model on day zero, or find an existing model with too few providers or a weak performance attribute and supply that gap.

The synthesis rejects waiting for pre-approval before building a review-ready endpoint. It treats the endpoint and measured performance as the object that makes technical review possible.

## Evidence Status

- **Direct official support:** OpenRouter says applications must meet its technical requirements before review and that it gives priority to providers that fill gaps in its network.
- **Reasonable inference:** Building a minimum review-ready endpoint before formal approval is the strongest current action for OpenRouter.
- **Open hypothesis:** Day-zero service, paid X amplification, public tagging, or direct outreach improves acceptance odds or review speed.
- **Required correction:** The public “ping me when a new model drops” statement came from Tomas Oliva in provider operations, not from Shashank Goyal, OpenRouter's Head of Provider Ecosystem.

## Links

- [[a-public-benchmarked-endpoint-and-paid-launch-can-test-gateway-distribution|A public benchmarked endpoint and paid launch can test gateway distribution]]
- [[openrouter-provider-selection-and-onboarding-primary-source-check-2026-08-19|OpenRouter provider selection and onboarding primary-source check]]
- [[inference|Inference]]
