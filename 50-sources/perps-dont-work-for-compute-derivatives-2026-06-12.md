---
type: source
status: captured
created: 2026-06-29
updated: 2026-06-29
source_date: 2026-06-12
source_type: article
projects: [gpu-compute-derivatives, gpu-residual-value-pricing]
domains: [gpu-finance, compute-derivatives, ai-infrastructure, residual-value]
people: [dave-friedman]
orgs: []
attachments: []
tags: [gpu, derivatives, perps, futures, market-structure]
---

# Perps Don't Work for Compute Derivatives

## Context

Dave Friedman argues that crypto-style perpetual futures are the wrong instrument for compute derivatives because compute markets need dated term structure, not continuous leveraged spot exposure.

The pasted source included a stray email/password UI artifact from the page capture. That artifact is intentionally omitted from the raw context below because it is not article content.

## Raw Context

```text
Perps Don't Work for Compute Derivatives
The crypto-native instrument has a certain appeal, but it's the wrong instrument for the compute market
Dave Friedman
Jun 12, 2026

Please see relevant disclosures here.

Over the past several months, I have spoken with a number of people who want to design perps for compute. Perps, short for perpetuals, are an innovation from crypto world. They are, essentially, undated futures. Whereas in traditional finance futures are dated, perps have no expiration date (thus, perpetual).

The logic is reflexive: crypto solved the problem of trading a thing with no natural expiry, perps are the most liquid instrument in crypto, compute is the new digital commodity, ergo perps. It's a clean syllogism built on a category error. It's the wrong template, imported by people whose native derivatives language happens to be crypto, onto an asset that behaves nothing like the ones perps were built for.

Start with what a perp actually is, because the simple objection, that perps can't see the future, is wrong. A perp is forward-looking. It compresses the term structure into a single number: the funding rate, which prices tonight's cost of carry and is tethered to the index by construction. The perp does carry information about the future, but it carries it only as pressure on the current index and current funding. What it cannot do is separate that information by date. It cannot isolate, hedge, finance, or settle a specific maturity. Perpetual pricing may be an expectation over future spot and funding dynamics, but you cannot pull a dated node out of it and trade that node alone.

And, that dated node is the only thing that matters. The term structure is the entire informational payload of a compute derivative, and a perp is structurally incapable of producing one.

Two time dimensions

Why does compute need a term structure when bitcoin doesn't? Because compute lives in two time dimensions at once, and a perp can reflect both only as a smear on the front.

The first is perishability within the horizon. A GPU-hour is use-it-or-lose-it. An idle H100 at 2am is revenue that no longer exists. It's the same as a megawatt that wasn't drawn or an airline seat that flew empty. Compute is perishable productive capacity, not a store of value.

The second is decay across the horizon. Silicon gets superseded. The forward price of an H100-hour is a function of when Blackwell and Rubin volume lands, how fast software optimization and interconnect repricing move, and how the install base depreciates against all of it. Nvidia's own positioning makes the discontinuity vivid: it markets GB200 NVL72 at up to ~30x H100 on certain LLM inference workloads. Whether or not you believe Nvidia's marketing, that is the shape of the problem: H100 compute in 2027 maybe a materially different economic good from H100 compute now. This is the obsolescence curve, and it is the thing the market exists to price.

This isn't to say that crypto has no curve. Crypto can have basis, and sometimes a violent basis. But that basis is mostly is mostly a financing and positioning artifact around a persistent spot asset. It is not an obsolescence curve in a wasting productive good. Bitcoin in September is not operationally obsolete relative to bitcoin in March. That's why perps work in crypto. The dominant user need is continuous leveraged spot exposure, not date-specific exposure to physical capacity, depreciation, and delivery economics. Compute is the opposite asset on that axis.

The right comparable is freight, not crypto

Forward freight agreements are always dated, and never perpetual. They cash-settle against spot freight indices, and shipowners, cargo owners, operators, banks, and funds use them to manage forward supply, demand, and cash flow risk. The forward curve is driven by the vessel order book, meaning capacity coming online, which maps almost one-to-one onto the datacenter and GPU buildout pipeline. New capacity is announced years ahead, lands in waves, and reprices the dated curve when it does. Compute is freight for AI workloads.

Similarly, consider the power markets. Nobody trades a perpetual swap on electricity. Power at 2pm in August is a different good from power at 3am in March, and the forward curve carrying that capacity information across weeks, quarters, and years is the entire product. Strip the tenor out and you've deleted the latent information the market requires to function.

Where it bites: financing

A futures strip gives a lender dated collateral marks. You can value collateral against the curve, shape amortization to a declining residual schedule, and build the residual-value curve for a four-year GPU loan off the strip. A single forward price isn't enough; a loan book needs the whole curve, and the strip is the curve. The derivative feeds the credit structure.

A perp's funding rate gives a lender nothing it can underwrite. It's a floating, reflexive number about tonight's positioning, not 2027's residual value. You can't shape amortization out of it. You can't mark a term loan against it. The GPU financing structures being built around GPU collateral right now--the economic engine of this market--cannot ingest a perp. It needs dated points, because debt has a tenor and the hedge has to match it.

Objections to the above

There are two objections worth considering here: liquidity and anchoring.

On liquidity: perps win in crypto because they concentrate flow into one instrument instead of fragmenting it across dozens of expiries, and in a market this young, fragmentation across tenors can mean no liquidity at any tenor. This is a fair objective. A perp might genuinely seed a speculative book and bootstrap volume. But the compute hedger needs tenor, so build the instrument that matches that need.

On anchoring: A perp has to fund against a robust, continuously-cleared spot. Compute spot is fragmented, heterogeneous, and constructed. It has a surveyed index, not a deep 24/7 book. Fund a perpetual off a thin index, and you've built a casino for basis games that discrete settlement over a window resists far better. Crypto's perp design assumes an anchor that compute doesn't yet have.

The bottom line is this: a perp prices the cost of staying exposed to compute. A futures strip prices the decay of compute, and decay is the ultimate product in compute.
```

## Summary

The article argues that compute derivatives need dated futures/forward strips rather than crypto-style perpetuals. Perps collapse future information into current funding and cannot isolate a specific maturity. Compute is perishable within a usage horizon and decays across horizons as silicon generations, software optimization, interconnects, and new capacity reshape economics. Therefore the useful derivative is closer to freight or power: dated, curve-producing, and tied to capacity coming online.

The financing implication is the sharpest piece for the vault: lenders need dated collateral marks to value GPU collateral, shape amortization, and build residual-value curves for term loans. A perp funding rate is too reflexive and front-loaded to underwrite a 2027 residual value.

## Promoted Insights

- [[compute-derivatives-need-dated-term-structures-not-perps|Compute derivatives need dated term structures, not perps]]
- [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]]
- [[compute-derivatives-should-look-like-freight-and-power-not-crypto|Compute derivatives should look like freight and power, not crypto]]
- [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]
- [[compute-perps-need-a-spot-index-anchor-compute-does-not-have|Compute perps need a spot-index anchor compute does not have]]

## Open Questions

- What underlying compute index is credible enough for dated settlement?
- Which product should launch first: quarterly futures, bilateral forwards, FFAs-style cash-settled agreements, or a surveyed index?
- Who are the first natural hedgers: lenders, lessors, neoclouds, GPU buyers, insurers, or structured-credit investors?
- Can liquidity be bootstrapped without collapsing into a perp-like instrument that fails hedger needs?
- How does a dated compute curve connect to RVI, recovery floors, and GPU loan amortization?

## Links

- Projects: [[gpu-compute-derivatives|GPU Compute Derivatives]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[dave-friedman|Dave Friedman]]
