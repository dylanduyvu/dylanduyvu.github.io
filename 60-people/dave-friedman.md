---
type: person
status: active
created: 2026-06-29
updated: 2026-07-07
aliases: [Dave Friedman]
orgs: []
projects: [gpu-compute-derivatives]
domains: [gpu-finance, compute-derivatives, compute-commodities, ai-infrastructure]
tags: [gpu, derivatives, source]
---

# Dave Friedman

## Context

Dave Friedman is a relevant public source for GPU/neocloud finance and compute market structure. His Substack appeared in Dylan's GPU financing blog/source corpus. His 2026-06-12 article on compute perps and 2026-06-11 article on compute commoditization produced several durable market-design claims. His 2026-05-28 CoreWeave debt article is the public-market source for the claim that GPU-backed debt is effectively contract-backed debt with hardware collateral as recovery floor.

## Relationship

No direct relationship captured in the vault yet.

## Useful Signals

- He argues that compute derivatives need dated term structures rather than crypto-style perps.
- He frames compute as perishable productive capacity with an obsolescence curve.
- He compares compute derivatives to freight and power markets rather than crypto.
- He connects dated futures strips directly to GPU loan collateral marks and residual-value curves.
- He argues compute can commoditize without full fungibility if the market defines a reference and prices basis separately.
- He frames DGX reference spec as compute grade, not the market hub.
- He links non-commodity compute framing to neocloud valuation, depreciation, and multiple defense.
- His basis-risk primer (2026-07-02) argues obsolescence basis has no anchor, so generic compute benchmarks die and the viable market is a succession of generation-specific curves plus transition instruments. He publishes his email and invites pushback; peer-grade contact, one of very few people doing public market-design work on compute derivatives. Candidate correspondence opener: the tokens-per-dollar soft-anchor pushback captured in the primer source note.
- His March 2026 obsolescence decomposition is the foundation of the whole arc: three stacked curves (training steep, inference shallow via down-stack migration and switching costs, long-tail nearly flat), the accounting constraint that forces the public debate onto one number, and the observation that the shops who model it properly (Magnetar, Castlake) write term sheets, not blog posts. His residual reframe: the mark is the lowest workload tier a chip can still serve times demand depth at that tier. Note the internal tension worth raising with him: this piece's 95 percent H100 rebooking data is the strongest counterevidence to his own July primer's "no anchor" rhetoric.
- His April 2026 trophy/anti-trophy frame (with co-author Luke Mellor, Partner and Head of Structuring at Optio Investment Partners, a firm on the lender outreach list): bankable GPU debt rests on four preconditions (counterparty credit passthrough, operator step-in rights, full pay-down inside the contract term, hedged power), and the named distress cases (Oracle, Abilene, CoreWeave's pre-Meta book) each map to a missing leg. His unifying diagnosis, "no market mechanism to price what remains when the contract stops doing the full job," is the vault's missing-pricing-layer thesis stated independently. He named in April the hole the NVIDIA backstop plugged in July, and the trophy piece's market-scaling list (multi-obligor models, operator ratings, forward curve as the binding constraint) is the problem portfolio written from the rating-agency side.

## Related Sources

- [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- [[can-compute-commoditize-if-its-not-fungible-2026-06-11|Can Compute Commoditize if it's Not Fungible?]]
- [[coreweave-issued-yet-more-debt-2026-05-28|CoreWeave Issued Yet More Debt]]
- [[dave-friedman-compute-basis-risk-primer-2026-07-02|Compute Derivatives Basis Risk Primer]]
- [[dave-friedman-gpu-obsolescence-is-complicated-2026-03-18|GPU Obsolescence is Complicated]]
- [[dave-friedman-where-gpu-debt-starts-to-break-2026-04-19|Where GPU Debt Starts to Break]]
- [[dave-friedman-luke-mellor-trophy-deal-trap-2026-04-06|The Trophy Deal Trap]]
- [[gpu-financing-blogs-relevance-list-2026-06-29|GPU financing blogs relevance list]]

## Related Insights

- [[compute-derivatives-need-dated-term-structures-not-perps|Compute derivatives need dated term structures, not perps]]
- [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]]
- [[compute-derivatives-should-look-like-freight-and-power-not-crypto|Compute derivatives should look like freight and power, not crypto]]
- [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]
- [[compute-perps-need-a-spot-index-anchor-compute-does-not-have|Compute perps need a spot-index anchor compute does not have]]
- [[compute-can-commoditize-without-full-fungibility|Compute can commoditize without full fungibility]]
- [[compute-commoditization-needs-convergence-plumbing-more-than-homogeneity|Compute commoditization needs convergence plumbing more than homogeneity]]
- [[dgx-reference-spec-is-a-compute-grade-not-a-market-hub|DGX reference spec is a compute grade, not a market hub]]
- [[compute-basis-will-price-operator-topology-duration-and-sla-differences|Compute basis will price operator, topology, duration, and SLA differences]]
- [[non-commodity-compute-framing-supports-neocloud-valuation-premiums|Non-commodity compute framing supports neocloud valuation premiums]]
- [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|Compute derivatives need vintage curves, not a generic benchmark]]

## Related Projects / Areas

- [[gpu-compute-derivatives|GPU Compute Derivatives]]
- [[gpu-finance|GPU Finance]]
