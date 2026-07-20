---
type: insight
status: superseded
created: 2026-07-18
updated: 2026-07-20
confidence: high
domains: [gpu-finance, compute-markets, compute-derivatives, offtake]
projects: []
sources:
  [
    dave-friedman-compute-offtake-is-private-forward-market-2026-07-18,
    gpu-loans-without-long-term-customer-claim-ledger-2026-07-19,
  ]
people: [dave-friedman]
orgs: [coreweave]
aliases:
  [offtake as private compute forward curve, second-customer forward price gap]
tags: [compute, forward-curve, offtake, merchant-revenue, basis-risk]
---

# GPU finance has no public forward price for second-customer revenue

## Claim

**Superseded on 2026-07-19.** The original claim below was too broad.

Compute offtake agreements are the market's private substitute for a forward curve. They give lenders a future output price and a named counterparty, but the price remains locked inside a contract that also bundles capacity, configuration, location, service, credit, and flexibility.

That leaves merchant GPU lenders without a common market price for what a cluster should earn after its current customer leaves. The second-customer problem is therefore partly a forward-price problem, not only a utilization or operator-history problem.

Silicon Data launched a public, calculated GPU forward curve in April 2026, before this note was written. CME and ICE have also announced compute futures, although neither product had begun trading as of 2026-07-19. The corrected claim is narrower: market-price tools are emerging, but their payout does not directly track how many GPU-hours a particular operator sells.

Replacement claim: [[compute-price-futures-do-not-hedge-fleet-utilization-risk|Compute price futures do not hedge fleet utilization risk]].

## Why It Matters

- Long offtake makes a project bankable by fixing future revenue inside one bilateral agreement.
- Confidential and incomparable contracts prevent lenders from separating general compute-price risk from deal-specific basis and credit risk.
- A public forward curve could make future compute prices observable and hedgeable across customers.
- The curve would improve one underwriting input. Lenders would still need utilization, re-rental, operating-cost, basis-risk, and counterparty analysis.

## Evidence

Dave Friedman identifies four jobs inside current offtake agreements: future pricing, physical capacity reservation, performance-risk allocation, and financing support. CoreWeave's March 2026 financing could hedge interest rates and certain power costs, while compute-output price risk remained tied to its customer contract.

Source: [[dave-friedman-compute-offtake-is-private-forward-market-2026-07-18|Dave Friedman: compute offtake is a private forward market]].

## Links

- [[gpu-earning-power-is-macro-level-offtake|GPU earning power is macro-level offtake]]
- [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]
- [[compute-basis-will-price-operator-topology-duration-and-sla-differences|Compute basis will price operator, topology, duration, and SLA differences]]
- [[the-gpu-backed-credit-market-does-not-exist-yet|GPU Finance Has a Second-Customer Problem]]
- [[compute-price-futures-do-not-hedge-fleet-utilization-risk|Compute price futures do not hedge fleet utilization risk]]

## Updates

### 2026-07-20

Linked the replacement claim that separates market-price risk from fleet-level rental-volume risk.

### 2026-07-19

Marked the original claim superseded after finding Silicon Data's April 2026 forward curve and the announced CME and ICE futures. The underlying credit problem survives in narrower form. A market-price curve can help price or hedge GPU rentals, but lenders still need to forecast how much capacity a particular operator will sell. Full correction and evidence: [[gpu-loans-without-long-term-customer-claim-ledger-2026-07-19|Claim ledger: GPU loans without a long-term customer]].
