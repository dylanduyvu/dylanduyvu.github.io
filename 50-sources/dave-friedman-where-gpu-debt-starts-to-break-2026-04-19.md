---
type: source
status: captured
created: 2026-07-07
updated: 2026-07-07
source_date: 2026-04-19
source_type: article
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, credit-markets, neoclouds, residual-value]
people: [dave-friedman]
orgs: [coreweave, nvidia]
attachments: []
tags: [gpu-debt, trophy-deal, oracle, abilene, refinancing, distress]
---

# Dave Friedman: Where GPU Debt Starts to Break

## Context

Friedman's 2026-04-19 piece, read by Dylan 2026-07-07 while working back through his archive. Sequel to a piece co-written with Luke Mellor two weeks earlier framing CoreWeave's Meta financing (a delayed-draw term loan, money released in stages) as a "trophy deal" whose investment-grade rating rested on narrow preconditions. This piece finds the deals where those preconditions are missing and reads them as a map of where GPU debt risk lives. Most concrete of his pieces: three named distress cases, not theory. Reading it in July adds hindsight value: his open questions have partially resolved, in ways worth annotating (marked as ours below).

URL: https://davefriedman.substack.com/p/where-gpu-debt-starts-to-break

## The Four Trophy Preconditions (what made the Meta deal bankable)

1. A giant creditworthy customer whose credit passes through to the lender (raters were effectively rating Meta, not CoreWeave).
2. Step-in rights: the lender can swap in a replacement operator if the borrower fails.
3. Debt fully pays down inside the customer contract's own term (no reliance on renewal or terminal value).
4. Power costs hedged against fixed contracted revenue.

Remove any leg and the bankability argument weakens. The rest of the market mostly cannot replicate all four.

## Three Anti-Trophy Failure Modes

### Oracle: the balance sheet carries the risk (no passthrough)

Oracle carries its Stargate commitment on its own balance sheet. Consequences as of April: roughly 500 percent debt to equity, negative free cash flow, a Barclays downgrade to underweight warning of a slide to one notch above junk, and a 45 to 50 billion dollar capital raise including a 20 billion dollar program selling stock gradually into the market. Sharp market-reading: prices on default insurance for Oracle's debt narrowed after the raise announcement while the stock fell 25 percent year to date, and "when equity and credit diverge, equity is usually pricing the problem earlier."

### Abilene / Stargate: the contract is shorter than the hardware's useful life

Early March, via CNBC: OpenAI is not expanding at the Abilene facility because by completion the chips inside will be the wrong generation. Friedman: the first clearly observed case of the obsolescence clock outrunning the buildout clock. An anchor tenant walked on VINTAGE grounds, not credit grounds. Once the anchor signals it will not stay past the underwritten term, lenders must price what the facility and hardware are worth standing alone (terminal value), the exact question the trophy structure was designed to eliminate. His mechanics: a 1.26x debt service coverage ratio is only underwritable if you believe the cash flows arrive for the full pay-down period.

### CoreWeave pre-Meta book: the refinancing wall

Same borrower as the trophy deal, opposite condition: 4.2 billion dollars due in 2026 against chips that depreciated while the principal stayed fixed (his term "collateral bifurcation": the physical asset and the contracted cash flows are now worth very different amounts). Interest expense tripled to 311 million dollars in one quarter; roughly 34 billion dollars of leases sit off balance sheet through 2028. Point worth repeating: the trophy structure does not generalize even within the same company; it covers the Meta slice while Microsoft, Anthropic, OpenAI, and Perplexity capacity sits on older structures.

## The Unifying Diagnosis

Each distress case "lacks a reliable way to price residual risk once the contract stops doing the full job... there's no market mechanism to step in and price what remains." A strong enough contract makes the missing pricing layer invisible; the anti-trophy deals are what the market looks like when the contract stops hiding it. This is the vault's ununderwritten-half and missing-residual-mark thesis stated independently by a third analyst, from the wreckage side.

## What He Said To Watch, With July Status (status annotations are OURS, not his)

1. Oracle executing 20 billion of gradual stock sales without a doom loop. Status: open; watch alongside the equity-versus-credit divergence signal.
2. Whether any other neocloud replicates the trophy structure with a different investment-grade anchor (template versus one-off). Status: the market answered sideways within ten weeks. NVIDIA's backstop program (July 1) manufactures the investment-grade element by vendor guarantee instead of finding more Metas, and the Anthropic/TeraWulf lease arrived "supported by an investment-grade credit." He named the hole in April; the backstop is the plug: a vendor balance sheet standing in for the market mechanism he said did not exist.
3. Whether more anchors follow OpenAI's vintage-based walk, forcing raters to price obsolescence-driven termination into every long-dated deal. Status: this is his own July basis-risk primer arriving early; Abilene is obsolescence drift realized in a physical lease before any derivative exists. See [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|the vintage-curves insight]].

## Promoted Insights

- Evidence promoted into [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|Compute derivatives need vintage curves, not a generic benchmark]] (Abilene as the realized case)
- Evidence promoted into [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch]] (Abilene plus the full-amortization precondition as the mismatch inverted)

## Open Questions

- Does the Oracle equity-credit divergence resolve toward the equity view (stress) or the credit view (fine)?
- Post-backstop, does anyone still attempt a true trophy replication with a second hyperscaler anchor, or does vendor guarantee become the standard second-best?
- Who is Luke Mellor, and is he a peer contact like Friedman? (Second name in the compute-credit writing world.)

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- People: [[dave-friedman|Dave Friedman]]
- Orgs: [[coreweave|CoreWeave]], [[nvidia|NVIDIA]]
- Related Insights: [[the-neocloud-risk-is-the-balance-sheet-not-compute-performance|The neocloud risk is the balance sheet, not compute performance]], [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]], [[timeline-slips-hit-gpu-loan-engine-and-backstop-together|Timeline slips hit GPU loan engine and backstop together]], [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]]
