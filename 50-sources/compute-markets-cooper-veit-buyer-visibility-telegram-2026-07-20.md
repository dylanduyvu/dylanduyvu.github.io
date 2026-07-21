---
type: source
status: captured
created: 2026-07-20
updated: 2026-07-20
source_date: 2026-07-20
source_type: chat
projects: []
domains: [gpu-marketplaces, compute-contracts, verification, ai-infrastructure]
people: [cooper-veit, dave-friedman]
orgs: [usd-ai, aravolta, silicon-data]
attachments: [compute-markets-cooper-veit-buyer-visibility-2026-07-20.png]
tags: [telegram, buyer-visibility, gpu-rentals, procurement, bidding, benchmarks]
---

# Cooper Veit: buyers cannot specify or verify exactly what compute they get

## Context

Telegram discussion in the Compute Markets group on 2026-07-20. Dylan's cross-provider rental-search hunch was inspired by Cooper Veit's description of a market where buyers have limited visibility, public service-level agreements are vague, and suitable providers cannot yet bid against a clear set of auditable requirements.

Cooper said he has spent six months exploring this problem and invited others to discuss it. That makes him a useful research contact, but the thread is not evidence that buyers will pay for a product.

Screenshot: [[compute-markets-cooper-veit-buyer-visibility-2026-07-20.png]]

## What Cooper Said

- Large bilateral compute service-level agreements that are public are generally vague.
- Users of large cloud interfaces often have to trust the provider because the provider does not specify everything they receive.
- By his account, an ordinary Lambda or RunPod customer does not receive basic NVIDIA telemetry.
- The technically difficult end state is a buyer specifying checkable, enforceable, and auditable requirements for a job, followed by multiple vetted providers bidding to supply it. He calls the specification a "kernel contract."
- Buyers currently have limited control and visibility into exactly what they receive.
- The risk can range from weak hardware performance, such as bad thermals, to fraud.
- He cited Aravolta's basic telemetry and registry against double pledging as work on the lending side rather than a buyer procurement solution.

Dave Friedman responded that Silicon Data's [SiliconMark](https://www.silicondata.com/products/silicon-mark) solves part of the problem. SiliconMark's public page describes independent performance benchmarking, provider comparison, machine inventory details, and cluster measurements such as bandwidth and latency. The page does not present live rental availability, structured buyer requests, provider bidding, or contract enforcement.

## Raw Transcript

Cooper Veit, 7:04 PM:

> If anyone else is interested in this topic would like to jam
>
> Very underdeveloped space imo. 30k foot view big bilateral compute SLAs are generally pretty vague from the ones that are publicly available. And when you hit a big cloud API a lot of it is trusting the provider since they don't spell out everything. As like a lambda/runpod consumer you actually don't get the basic nvidia telemetry afaik.
>
> For faithful execution and security there are trusted execution environments as well as theoretically newer anti-fraud stuff like TopLoc. But it's a pretty hard tech area. I have spent the last six months on this idea and how you can better specify checkable enforceable requirements as a buyer ("kernel contract"). In my ideal world the buyer would be able to specify auditable requirements for a job and there would be multiple vetted providers to bid, but that is very far from the world we live in

Dave Friedman, 7:08 PM:

> Are you referring to verifying that a chip performs as its advertised? Or something else?

Cooper Veit, 7:10 to 7:12 PM:

> Yeah would be good to know if you get some bad chip with wack thermals or something
>
> But eventually there could be actual fraud. USD.ai has worked with a data center telemetry startup called aravolta for getting basic telemetry I believe on the lending side
>
> And they have a registry to prevent double pledging
>
> Currently buyer doesn't have a lot of say or visibility into exactly what they get

Dave Friedman, after 7:12 PM:

> Ok well Silicon Data's SiliconMark solves some of this. No affiliation. https://www.silicondata.com/products/silicon-mark

Terminology in the raw transcript: "SLA" means service-level agreement; "API" means application programming interface; "afaik" means "as far as I know."

## Product Reading

The discussion separates four layers that are easy to blur together:

1. **Discovery:** find available capacity with the required hardware and configuration.
2. **Structured buying:** let the buyer state requirements once and receive bids from vetted providers.
3. **Independent comparison:** benchmark whether the offered systems perform as claimed.
4. **Verification and enforcement:** check whether the provider continues to meet the promised requirements during the job and give the buyer a remedy if it does not.

Dylan's aggregator hunch begins with the first layer and may extend into the second. SiliconMark addresses part of the third. Cooper's "kernel contract" ambition reaches the fourth, which he describes as technically difficult.

## What This Changes

This is the first direct source in the vault describing buyer-side visibility and specification as underdeveloped. It strengthens the reason to test the rental-search hunch, but it does not establish demand for a standalone aggregator. The sharpest next question is whether real buyers lose time or accept worse capacity because existing marketplaces cannot filter and compare the details they need.

## Links

- Hunch: [[cross-provider-gpu-rental-search-may-solve-buyer-discovery-friction|Cross-provider GPU rental search may solve buyer discovery friction]]
- People: [[cooper-veit|Cooper Veit]], [[dave-friedman|Dave Friedman]]
- Orgs: [[aravolta|Aravolta]], [[usd-ai|USD.AI]]
- Area: [[gpu-finance|GPU Finance]]

