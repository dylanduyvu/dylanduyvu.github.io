---
type: insight
status: distilled
created: 2026-07-02
updated: 2026-07-06
confidence: medium-high
domains: [gpu-finance, compute-contracts, sla, verification]
projects: []
sources: [american-compute-compute-offtake-agreements-article-2026-07-02, usd-ai-call-harry-page-2026-06-29, semianalysis-nvidia-backstop-trinity-2026-07-06]
people: [bernie-margulies, harry-page]
orgs: [american-compute, usd-ai]
aliases: [service credits are structurally toothless, sla paper protection is weak so only operator behavior matters, customers and lenders share the same unpriced operator-quality problem]
tags: [gpu, sla, service-credits, reputation, customer-discovery]
---

# SLA remedies are toothless, so reputation carries delivery risk

## Claim

Contractual SLA remedies do not transfer downtime risk; they gesture at it. The standard remedy is service credits equal to validated outage duration, usable only against future purchases from the provider that just failed you, claimable only by the customer within a 30-60 day window - while the actual cost of downtime (delayed training runs, business delay) is orders of magnitude larger than the GPU-hours credited. Because the paper protection is weak, the only real protection is operator delivery behavior - which is exactly the variable the market cannot measure. So customers select on reputation-by-anecdote, which is the same prior-deployments proxy lenders use: the customer's selection problem and the lender's underwriting problem are one problem, unpriced on both sides.

## Why It Matters

Third-seat convergence: customer, lender, and insurer all fall back on reputation because no instrument for operator delivery quality exists. It also redirects the customer-side product angle - the WTP is not in collecting toothless credits better (claims tooling), it is in choosing operators better before signing. That snaps the customer side onto the same wedge as the lender side (pre-contract operator credentialing): one verified delivery record, three audiences - lender prices it, customer selects on it, insurer rates it. The ISTAT/KBB shape again, but for operator delivery rather than hardware value.

## Evidence

- 2026-07-02 (AC contract review): service credits standard, future-use only, no cash, customer-filed claims within ~30 days-2 months.
- Same source, Bernie's own editorial: credits are clearly worse for the customer, so "customers should always pick more reputable providers over less reliable providers with more generous SLAs" - the author of the market's contract review conceding the paper does not matter, only delivery behavior does.
- Hardware-level remedies and escalation exist (dead node unbilled; sustained failure as material breach after e.g. six consecutive months) but the escalation ladder is slow and terminal, not compensatory.
- 2026-06-29 (Harry/USD.AI): the lender-side mirror - missed SLA means revenue credits, which means loan cashflow risk that USD.AI prices defensively.
- 2026-07-06 (SemiAnalysis): a fourth seat prices the same blindness - datacenter landlords. Neocloud colocation leases run +3-5% higher yield-on-cost than hyperscaler leases because neocloud cashflow certainty (effectively, operator credit quality) is viewed as weaker, and the debt behind neocloud-tenant projects carries punitive terms: forced amortization, cash sweeps, ~3-year refi windows. Landlords, like lenders and customers, are pricing operator quality with no instrument - reputation and tenant-category priors set the number.

## Implications

- The bear case, stated honestly: if remedies are toothless and everyone knows it, the market's revealed solution is "pay up for CoreWeave" - a credential only matters if it can move a customer or lender off that default. Concrete kill question for a customer seat: would a verified delivery record ever make you choose the cheaper unknown operator over the reputable one?
- Customer seat is the untested seat; this insight gives it a de-primed opening question (how do you get comfort a provider will actually deliver before you sign?).
- Service-credit exposure is also the lender's revenue-crediting exposure (credits reduce operator top line), so credit-claims frequency is default-risk telemetry if anyone could see it.
- Reputation-by-anecdote is the incumbent competitor for any credentialing product - cheap, informal, and currently good enough for the top tier.

## Counterpoints / Uncertainty

- Toothless-by-design may be efficient: sophisticated customers may prefer cheap compute plus self-insurance over paying for real indemnification; the missing market might be missing for demand reasons.
- Reference calls and informal networks may price operator quality well enough at the tier where deals are relationship-driven.
- Some contracts do escalate to termination + refund, so the remedy is not zero - it is slow and binary rather than compensatory.
- AC's sample skews to flagship contracts; smaller deals may have harsher (or softer) remedy terms.

## Links

- Source: [[american-compute-compute-offtake-agreements-article-2026-07-02|American Compute: Compute Offtake Agreements]], [[semianalysis-nvidia-backstop-trinity-2026-07-06|SemiAnalysis: Nvidia GPU Debt Backstop / AI Project Trinity]]
- Related Insights: [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]], [[operators-want-verification-at-origination-and-resist-it-post-close|Operators want verification at origination and resist it post-close]], [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]], [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|Less-proven GPU operators get funded through equity cushions, not SLA evidence]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[bernie-margulies|Bernie Margulies]], [[harry-page|Harry Page]]
- Orgs: [[american-compute|American Compute]], [[usd-ai|USD.AI]]
