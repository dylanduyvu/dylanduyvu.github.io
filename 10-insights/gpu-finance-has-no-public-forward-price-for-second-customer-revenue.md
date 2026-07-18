---
type: insight
status: distilled
created: 2026-07-18
updated: 2026-07-18
confidence: high
domains: [gpu-finance, compute-markets, compute-derivatives, offtake]
projects: []
sources: [dave-friedman-compute-offtake-is-private-forward-market-2026-07-18]
people: [dave-friedman]
orgs: [coreweave]
aliases:
  [offtake as private compute forward curve, second-customer forward price gap]
tags: [compute, forward-curve, offtake, merchant-revenue, basis-risk]
---

# GPU finance has no public forward price for second-customer revenue

## Claim

Compute offtake agreements are the market's private substitute for a forward curve. They give lenders a future output price and a named counterparty, but the price remains locked inside a contract that also bundles capacity, configuration, location, service, credit, and flexibility.

That leaves merchant GPU lenders without a common market price for what a cluster should earn after its current customer leaves. The second-customer problem is therefore partly a forward-price problem, not only a utilization or operator-history problem.

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
