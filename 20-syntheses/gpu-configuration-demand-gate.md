---
type: synthesis
status: draft
created: 2026-07-22
updated: 2026-07-23
domains:
  - gpu-finance
  - ai-infrastructure
  - inference
  - compute-markets
projects: []
sources:
  - jakub-borrower-side-gpu-finance-and-shadow-loan-experiment-2026-07-21
  - gpu-loans-without-long-term-customer-claim-ledger-2026-07-19
  - inference-rent-to-controlled-capacity-evidence-audit-2026-07-16
  - ccir-gpu-compute-credit-research-audit-2026-07-22
tags:
  - experiment
  - demand
  - configuration
  - operator
  - capital-allocation
---

# GPU configuration demand gate

## Decision Context

Dylan is choosing his next load-bearing hypothesis between two branches:

1. run the shadow-mode computer-use NAP experiment; or
2. continue the GPU work from the operator seat.

The GPU branch is now more specific than “find an offtake customer” or “try to assemble a loan.” Its immediate question is which GPU configuration, if any, deserves to be purchased given customer demand or a defensible marketplace view.

Customer discovery remains upstream, but a signed long-term offtake is not the first required output. Customer workloads and marketplace evidence are inputs into configuration selection. The cash-versus-loan decision comes only after a concrete asset and demand case exist.

## Proposed LBH

> Within a fixed timebox, determine whether a specific small-server GPU configuration has enough credible customer or marketplace demand at achievable net prices to justify purchasing it under conservative utilization and downside assumptions.

A valid conclusion should name one configuration and the evidence supporting it, or conclude that no configuration currently clears the purchase bar. The no-buy outcome is the proposed invalidation condition and still needs to remain explicit when the final experiment contract is set.

## What Must Be Selected

“Which GPU?” is too coarse. The decision object includes:

- GPU generation and memory capacity;
- GPU count and topology;
- interconnect requirements;
- CPU, system memory, storage, and networking;
- server form factor, power, cooling, and colocation compatibility;
- deployment region and service level; and
- whether the intended workload is inference, fine-tuning, training, or a mixture.

Customer demand determines which of these constraints matter. Marketplace demand can supply a broader liquidity prior, but it may not match the exact fleet, location, service, or contract Dylan would offer.

## Demand Evidence Ladder

1. **General market narrative:** “compute is scarce” or “AI demand is growing.” Useful for category selection, not a purchase decision.
2. **Posted marketplace asks:** advertised hourly prices and visible availability. Useful for candidate generation, but not proof of utilization or realized revenue.
3. **Behavioral marketplace evidence:** repeated booking or availability observations, transaction evidence where accessible, net pricing after fees, and triangulation across providers or marketplace operators. This is the minimum rung for a reasonable marketplace belief.
4. **Workload-specific customer evidence:** a customer supplies model, workload shape, memory, latency, throughput, geography, timing, and budget requirements that map to a configuration.
5. **Paid pilot:** the workload runs on rented capacity and produces observed usage, performance, price, and support requirements.
6. **Reservation, deposit, or offtake:** the customer commits to future capacity under named commercial and delivery conditions.

A marketplace listing alone cannot carry the LBH. Posted price does not reveal achieved utilization, marketplace take rate, downtime, operating cost, or whether apparent scarcity reflects end demand, limited inventory, unracked hardware, or intermediaries reserving capacity.

## Experiment Sequence

1. **Generate candidates.** Choose two or three configurations that can be purchased, hosted, and compared within the contemplated capital range.
2. **Collect demand evidence.** Interview prospective users about real workloads while gathering marketplace availability, price, and booking evidence for the same configurations.
3. **Translate workloads into requirements.** Map memory, throughput, latency, model size, batching, interconnect, location, and reliability needs to each candidate.
4. **Model net economics.** Include acquisition, marketplace fees, colocation, power, networking, maintenance, downtime, staffing or managed operations, financing if relevant, and conservative utilization.
5. **Model downside.** Estimate redeployability, resale value, time to re-rent, configuration-specific obsolescence, and maximum capital loss.
6. **Choose or reject.** Select the configuration only if one clears the precommitted demand, return, and downside bars. Otherwise do not buy yet.

## Failure Modes

Demote or stop the purchase if:

- demand remains general and cannot be mapped to one configuration;
- posted marketplace prices cannot be connected to credible utilization or net revenue;
- likely customer workloads need a materially different configuration;
- acceptable returns require implausibly high utilization;
- the server is too specialized to redeploy or resell safely;
- operational requirements exceed the team's current ability or economics; or
- no candidate stays attractive under conservative assumptions.

## Relationship to Offtake and Financing

Offtake and financing sit higher on the ladder.

- Customer evidence helps select the asset.
- A paid pilot tests whether the team can deliver the workload before owning the asset.
- A reservation or offtake can support the purchase and a lender request.
- A named configuration, site, operating model, and customer case make the shadow-loan packet concrete.
- Only then should Dylan compare continued rental, cash purchase, and debt financing.

This corrects the earlier framing that the GPU experiment begins by finding an offtake customer. The immediate gate is demand-informed configuration selection. Offtake is one strong form of evidence, not the definition of the first experiment.

## Relationship to the NAP Fork

This demand gate and the [[computer-use-nap-shadow-experiment|computer-use NAP shadow experiment]] are now comparable short-horizon experiments:

- the NAP experiment asks whether personalized semantic routing contains nontrivial signal and felt value;
- the GPU experiment asks whether any purchasable configuration has enough credible demand and risk-adjusted economics to deserve capital.

The branch has not yet been selected.

## Current Demand Lead

On July 23, Dylan reported that Jakub believes there is an on-demand GPU shortage because Hyperbolic, Runpod, and similar marketplaces were showing no H100 nodes available.

Treat this as a timestamped, Jakub-attributed observation rather than a verified market-wide shortage. It becomes stronger behavioral marketplace evidence if repeated checks show that specific H100 configurations remain unavailable across providers, regions, quantities, and times despite customers attempting to launch them.

## Open Questions

- What is the exact timebox for the configuration decision?
- Is “do not buy” an accepted outcome of the LBH?
- What customer segment and workload should seed the first candidate set?
- Which marketplaces or operators can supply evidence beyond posted asks?
- What minimum demand evidence is required before relying on a marketplace belief?
- What conservative utilization, return, and maximum-loss bars must a candidate clear?
- Who would operate, colocate, and support the server?

## Links

- Alternative experiment: [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- Borrower-side experiment: [[jakub-borrower-side-gpu-finance-and-shadow-loan-experiment-2026-07-21|Jakub: search from the borrower seat and try to assemble a GPU loan]]
- Merchant-loan evidence: [[gpu-loans-without-long-term-customer-claim-ledger-2026-07-19|GPU loans without a long-term customer claim ledger]]
- Rent-versus-control evidence: [[steady-inference-baseload-moves-to-controlled-capacity-not-always-owned-gpus|Steady inference baseload moves to controlled capacity, not always owned GPUs]]
- Compute-finance portfolio: [[compute-finance-problem-inventory-2026-06-30|Compute Finance Problem Inventory]]
- Area: [[gpu-finance|GPU Finance]]
