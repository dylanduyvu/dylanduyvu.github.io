---
type: source
status: captured
created: 2026-06-29
updated: 2026-06-29
source_date: 2026-06-11
source_type: article
projects: [gpu-compute-derivatives, gpu-residual-value-pricing]
domains: [gpu-finance, compute-derivatives, compute-commodities, ai-infrastructure, residual-value]
people: [dave-friedman, brannin-mcbee]
orgs: [coreweave]
attachments: []
tags: [gpu, compute, commodities, fungibility, basis, market-structure]
---

# Can Compute Commoditize if it's Not Fungible?

## Context

Dave Friedman argues that compute can commoditize even if GPU-hours are not fully fungible. The sharper requirement is a standardized reference plus explicitly priced basis spreads for the deviations.

## Raw Context

```text
Can Compute Commoditize if it's Not Fungible?
Fungibility is not a requirement for commoditization
[Dave Friedman](https://substack.com/@davefriedman)
Jun 11, 2026
Please see relevant disclosures [here](https://davefriedman.substack.com/about).

On a recent episode of Bloomberg's [OddLots](https://www.youtube.com/watch?v=BrpadR5KuMo) podcast, CoreWeave co-founder [Brannin McBee](https://www.coreweave.com/leadership/brannin-mcbee) was asked whether compute will ever trade as a commodity. His answer was a careful no-for-now, maybe-later, and it rested on one claim: compute isn't fungible the way a commodity has to be. To make the point he reached for gold. Gold is defined by its chemical composition; an ounce is an ounce. An H100-hour in one cloud, he argued, is not an H100-hour in another. They have different [goodput](https://en.wikipedia.org/wiki/Goodput), different [model-flop utilization](https://lmms-engine.readthedocs.io/en/latest/reference/mfu.html), different operational reality under the same nameplate. No fungibility, no commodity.

Gold is a convenient analogy because it turns fungibility into a binary. But commodity markets rarely work that way, and McBee, of all people, knows it. Before CoreWeave he traded natural gas, power, and agricultural products. Power has locational basis, meaning the same megawatt is worth different amounts at different nodes, and the congestion between them is itself a traded product. It has firmness (firm versus interruptible) and temporal shape (peak versus off-peak). Gas has Henry Hub and then an entire complex of basis swaps pricing every delivery point against it. These are among the deepest derivatives markets on the planet, and they got there in spite of non-fungibility, not because of homogeneity. Commodity market design has never required sameness. It requires a standardized reference plus a basis you price separately. The art is inventing a fungible reference and trading the deviations around it.

So the easy version of the case against McBee ("he doesn't understand commodity markets") is wrong. He understands them perfectly. That's exactly why his objection is worth taking apart.

The substantive objection to commoditization is that compute lacks a clean convergence mechanism. Gas has pipes, storage, nominations, and delivery points. Power has nodes, congestion, dispatch, and transmission rights. Those are the plumbing that forces a sprawling physical market to converge onto a price. Compute has clusters, queues, software environments, failure domains, data gravity, security requirements, and workload-specific performance, and no settled plumbing to make them converge. That doesn't make a market impossible. It tells you what the first tradable product might look like: a cash-settled reference exposure wrapped in wide, messy, explicitly priced spreads for operator, topology, scale, duration, and SLA.

Which is the right way to read McBee's own tell. "We build everything to DGX reference spec," he says. That is Nvidia's blueprint, the most performant standardized way to deploy their GPUs. That isn't the hub; it's the grade. It's pipeline-quality gas, .995 fine gold, the specification a contract can be written against. The hub is the index and settlement convention built on top of it. And the goodput and MFU differentials he keeps emphasizing? Those are the basis. Split fungibility into its layers and the picture resolves: physical/spec fungibility (GPU class, DGX spec, fabric, cooling) is largely there; operational fungibility (goodput, failure recovery, the software stack) and contractual fungibility (duration, SLA, priority, scale, delivery window) are not yet. McBee is right that the back two layers aren't settled today. But that's not an argument against a market. It's a specification of the basis a market would price.

So why does he make this argument? Because the non-commodity framing is the keystone of a whole valuation bundle the market has accorded CoreWeave: long useful lives for its GPUs, its operator moat, contracted rather than merchant cash flows, and a cost of capital that's fallen far enough to let CoreWeave raise more than $21 billion year to date. The depreciation debate and the fungibility debate are the same fight in different clothes: a commodity on a merchant curve gets you brutal depreciation, price-taker margins, and a utility multiple; a differentiated operator on contracted flows gets you benign depreciation, pricing power, and a software multiple.

McBee's frontier point is real, his caution is rational, and he is plainly talking a sophisticated book rather than making an error. But the man knows what a basis swap is. When a former power trader tells you locational differentials prove there can be no market, he isn't describing the commodity. He's pricing it, and telling you where the spread still hides.
```

## Summary

The article rejects the claim that compute cannot commoditize because it is not perfectly fungible. Friedman argues commodity markets do not require sameness; they require a standardized reference and separately priced basis. Natural gas and power are deep markets despite locational, temporal, firmness, and delivery-point differences.

For compute, the real blocker is not heterogeneity itself but missing convergence plumbing. Compute lacks settled analogues to gas pipes/storage/nominations or power nodes/dispatch/transmission rights. That points toward a first product that is cash-settled against a reference exposure with wide basis spreads for operator, topology, scale, duration, SLA, priority, and delivery window.

The article also reframes CoreWeave's non-commodity argument as a valuation argument. If compute becomes a commodity on a merchant curve, the story shifts toward brutal depreciation, price-taker margins, and a utility multiple. If CoreWeave remains a differentiated operator on contracted flows, the story supports longer useful lives, pricing power, and a higher multiple.

## Promoted Insights

- [[compute-can-commoditize-without-full-fungibility|Compute can commoditize without full fungibility]]
- [[compute-commoditization-needs-convergence-plumbing-more-than-homogeneity|Compute commoditization needs convergence plumbing more than homogeneity]]
- [[dgx-reference-spec-is-a-compute-grade-not-a-market-hub|DGX reference spec is a compute grade, not a market hub]]
- [[compute-basis-will-price-operator-topology-duration-and-sla-differences|Compute basis will price operator, topology, duration, and SLA differences]]
- [[non-commodity-compute-framing-supports-neocloud-valuation-premiums|Non-commodity compute framing supports neocloud valuation premiums]]
- [[compute-derivatives-should-look-like-freight-and-power-not-crypto|Compute derivatives should look like freight and power, not crypto]]

## Open Questions

- What compute reference product is standardized enough to become the first hub?
- Who can credibly measure and publish goodput, MFU, failure recovery, and SLA basis?
- Could a cash-settled compute reference market form before physical delivery/convergence plumbing matures?
- Which basis spread is most commercially legible first: operator, topology, scale, duration, priority, SLA, or delivery window?
- How much of neocloud valuation depends on preserving non-commodity framing?

## Links

- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]], [[brannin-mcbee|Brannin McBee]]
- Orgs: [[coreweave|CoreWeave]]
