---
type: source
status: captured
created: 2026-07-18
updated: 2026-07-18
source_date: 2026-07-18
source_type: article
projects: []
domains: [gpu-finance, compute-markets, compute-derivatives, offtake]
people: [dave-friedman]
orgs: [coreweave]
attachments: []
tags: [compute, forward-curve, offtake, basis-risk, financing]
---

# Dave Friedman: compute offtake is a private forward market

## Source

- Dave Friedman, "The Compute Market has Multiple Views on Future Compute Prices," 2026-07-18
- https://davefriedman.substack.com/p/the-compute-market-has-multiple-views

## Main Argument

Long compute offtake agreements are privately negotiated forward prices. They establish a future compute price while also reserving physical capacity, allocating performance risk, and supporting infrastructure financing.

There is no single forward curve because every agreement differs by hardware configuration, location, delivery schedule, service level, flexibility, and counterparty. Prices and terms are confidential. The result is a patchwork of private views on future compute demand rather than one observable market curve.

## Financing Mechanism

- A lender cannot use a public forward price to value a cluster's future output, so it uses the customer contract.
- CoreWeave's March 2026 $8.5B DDTL financed infrastructure tied to a long-term Meta contract. The financing included the infrastructure, customer contract, and related data-center leases.
- The project was required to hedge at least 95% of anticipated floating-rate borrowings and also hedge certain power costs. Compute-output price risk could only be fixed through the customer agreement.
- Customer identity matters because the contract's financing value includes counterparty credit, prepayments, guarantees, and other protections in addition to the nominal compute price.

## What A Public Curve Would Change

A public forward curve could separate general compute-price risk from the bilateral terms that belong in the physical contract. Configuration, location, delivery, service levels, credit, and contractual flexibility would trade as basis around a reference price.

That could make GPU financing more modular. A lender could evaluate customer contracts and market-price hedges separately instead of treating the offtake agreement as one indivisible source of bankability.

## Limits

- A forward curve would not create utilization or make a delayed cluster operational.
- A hedge would introduce basis risk, collateral requirements, margin calls, and tenor mismatch.
- Customers would still need physical capacity, and lenders could still require committed demand.
- A public output price would improve one input in merchant underwriting. It would not solve operator risk, re-rental time, customer concentration, or cluster-specific revenue.

## Reading For The Second-Customer Thesis

The second-customer problem has both a demand-history gap and a market-price gap. Lenders lack a public way to observe what a GPU generation should earn after the current contract ends. Offtake solves that problem privately by fixing future output price and counterparty credit inside one bilateral agreement.

This supports [[gpu-finance-has-no-public-forward-price-for-second-customer-revenue|GPU finance has no public forward price for second-customer revenue]] and the draft [[the-gpu-backed-credit-market-does-not-exist-yet|GPU Finance Has a Second-Customer Problem]].

## Links

- [[gpu-finance|GPU Finance]]
- [[dave-friedman|Dave Friedman]]
- [[gpu-earning-power-is-macro-level-offtake|GPU earning power is macro-level offtake]]
- [[compute-can-commoditize-without-full-fungibility|Compute can commoditize without full fungibility]]
- [[compute-basis-will-price-operator-topology-duration-and-sla-differences|Compute basis will price operator, topology, duration, and SLA differences]]
