---
type: project
status: active
created: 2026-08-21
updated: 2026-08-21
deadline: 2026-08-25
domains: [inference, model-serving, compute-economics, distribution, go-to-market]
people: [jakub-janiak]
orgs: [wafer-ai, openrouter]
tags: [lbh, first-customers, gpu-rental, amd, unit-economics, customer-acquisition]
---

# First Five Inference Customers Plan

## Objective

By Tuesday, August 25, 2026, produce a decision-ready plan for the smallest viable inference service and its first five paying customers. The plan must select one customer, workload, and model combination. If no combination passes the evidence and economic gates, the plan must recommend no launch.

The source brief is [[dylan-first-five-inference-customers-brief-2026-08-21|Dylan's first-five-customer LBH]].

## Required Decisions

1. **Starting customer and workload:** Select one customer type and one workload. Define prompt length, output length, concurrency, latency, reliability, tool-use, privacy, geography, and budget needs.
2. **Model:** Select one primary model and one fallback that fit the target workload, available hardware, license, and achievable service edge.
3. **Minimum service:** Specify the smallest GPU setup that can meet the service promise. Include the GPU type and count, serving engine, quantization, memory limit, network, region, and failure plan.
4. **Capacity source:** Compare AMD rental options by exact GPU, price, minimum term, availability, region, software support, and operating limits. Keep one NVIDIA comparison so that AMD is a tested option, not a fixed conclusion.
5. **Economics:** Show the lowest monthly cash burn, direct cost per input and output token, subsidy cost, gateway or payment fees, and break-even utilization. Show a base case, a weak-demand case, and a high-use case.
6. **First five customers:** Give a specific acquisition plan for five independent paying accounts or paid pilots. State the target type, channel, offer, owner, next action, and evidence that the workload can use the selected model.
7. **Launch decision:** State the maximum test loss, test duration, success threshold, and stop conditions.

## Research Workstreams

### 1. Reconstruct Wafer before OpenRouter

Build a dated play-by-play from WaferPass launch through the first confirmed OpenRouter listing. Record:

- product, model, price, quota, and target-user changes;
- public launches and paid or organic promotion;
- direct API and client-catalog integrations;
- rented GPU supply and changes in capacity structure;
- named contacts and public business-development actions;
- the first confirmed OpenRouter appearance; and
- all missing steps between application and acceptance.

Use [[waferpass-bootstrap-public-evidence-check-2026-08-19|the WaferPass public evidence check]] as the start. Do not state that WaferPass caused OpenRouter acceptance unless new evidence proves it.

### 2. Select the customer-workload-model combination

Use [[inference-model-opportunity-radar|the model opportunity radar]] to generate candidates. Then test each candidate against direct customer need and available hardware. Few providers, local downloads, or OpenRouter tokens are screening signals. They do not prove a service opportunity alone.

### 3. Define the smallest service

For each finalist, calculate the minimum GPU memory and count. Test whether the serving engine, model format, quantization, attention kernels, and tool-call behavior work on the exact AMD hardware. Measure time to first token, output speed, total latency, error rate, memory use, and sustainable concurrency.

For a model that can fit on eight GPUs, test whether one eight-GPU system can reach an acceptable price and performance point. Compare it with public results from larger rack-scale systems under the same model, precision, prompt length, output length, concurrency, and service target. Do not treat model fit, nameplate bandwidth, or rate limits as proof of competitive serving. See [[nvl72-expands-the-fast-gpu-domain-not-the-bandwidth-of-each-blackwell-gpu|the NVL72 bandwidth correction]].

### 4. Build the economic model

Calculate monthly fixed and variable cash cost. Include GPU rent, storage, network traffic, observability, payment or gateway fees, idle capacity, failures, and the planned subsidy. Show:

- utilization by GPU time and by available token capacity;
- revenue and contribution margin at each utilization level;
- break-even utilization under normal and subsidized prices;
- maximum cash loss during the test; and
- the result if one heavy user consumes the allowed quota.

State whether founder time and general company cost are excluded from the cash break-even figure. Show a separate all-in view when practical.

### 5. Find the first five customers

Start with users whose present workload maps to the chosen model. Possible channels include coding-agent and OpenClaw communities, open-model maintainers, application developers who already use the model locally, open client catalogs, direct outreach, and a small public launch offer.

Do not stop at a list of channels. The plan must provide five concrete account targets or tightly defined target profiles, the reason each can use the service, and the next contact action. Store only public or non-sensitive details in this vault.

## Working Definitions

- **Customer:** One independent paying direct account or paid pilot. Free testers, gateway approval, and gateway traffic are tracked separately.
- **Break-even utilization:** The sustained share of available service capacity at which revenue covers GPU rent and other direct serving costs. The plan must also show the all-in result if it includes operating labor and general company costs.
- **Subsidy:** A measured launch discount or capped plan with a fixed cohort size, request limit, concurrency limit, end date, and maximum loss.
- **Smallest setup:** The lowest-cost configuration that can meet the written service promise with repeatable internal test results. It is not only the GPU with the lowest posted rent.

## Go or No-Go Gates

Launch only if all of these gates pass:

1. one customer-workload-model combination has direct demand evidence;
2. the exact rental configuration can run it reliably;
3. the service has a repeatable edge or a clear access advantage;
4. the weak-demand case stays inside the agreed loss limit;
5. the subsidy cannot create open-ended GPU cost; and
6. there is a direct route to five paying trials.

## Open Decisions for Dylan and Jakub

- What is the maximum test loss?
- How long can the test run before a stop decision?
- Does a paid pilot count as one of the first five customers?
- Is the first goal direct revenue, operating proof, gateway acceptance, or a ranked combination of these results?
- Is AMD a requirement, or should it win against the best available NVIDIA rental?
- What measured distance from the current price and performance frontier is acceptable for the first service?

## Related Work

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[gpu-configuration-demand-gate|GPU configuration demand gate]]
- [[how-to-get-listed-on-openrouter-article-draft-v1|How to get listed on OpenRouter as an inference provider]]
- [[wafer-ai|Wafer AI]]
- [[inference|Inference]]
