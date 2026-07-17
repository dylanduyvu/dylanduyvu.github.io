---
type: insight
status: distilled
created: 2026-07-17
updated: 2026-07-17
confidence: high
domains: [gpu-finance, credit-markets, ai-infrastructure, compute-contracts]
projects: []
sources: [usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07, usd-ai-call-harry-page-2026-06-29, usd-ai-public-loan-book-snapshot-2026-07-17]
people: [david-choi, harry-page]
orgs: [usd-ai]
aliases: [saas credit versus ai offtake contradiction, ai offtake is not automatically bankable, contract inherits counterparty credit]
tags: [gpu, lending, offtake, counterparty-risk, underwriting]
---

# AI offtake inherits the credit risk David Choi says is dying

## Claim

David Choi's macro thesis and USD.AI's current underwriting contain a real tension. If SaaS and AI-company cash flows are too fragile to support corporate credit, a contract promising that the same company will pay for compute does not become reliable merely because it is labeled offtake. The contract inherits the customer's credit risk.

The coherent version of his long-term thesis is therefore not that offtake remains reliable. It is that no single offtaker needs to remain reliable because standardized GPUs can be re-rented, customer failures can be diversified across a large loan pool, and conservative collateral and amortization can absorb the transition. That is a bet on customer replaceability and portfolio behavior, not on the durability of AI-company contracts.

USD.AI has not yet demonstrated that end state. Its current pricing rewards stronger offtaker credit, its public upcoming book is almost entirely contract-backed, and its pre-offtake loans are expected to acquire customers before installation. Current practice still depends on bankable or demonstrated revenue.

## Segment Split

- **Investment-grade hyperscaler offtake:** reliable because Meta, Amazon, Microsoft, and similar customers have broad balance sheets and access to capital, not because compute contracts are intrinsically safe.
- **AI-startup offtake:** vulnerable to exactly the rapid revenue and business-model failure Choi invokes against SaaS credit. Lenders need higher pricing, deposits, prepayment, letters of credit, guarantees, or stronger collateral.
- **Diversified merchant demand:** the theoretical future substitute for one bankable contract. It requires liquid redeployment, stable aggregate utilization, and a pool large enough to absorb customer churn.

## Why It Matters

This contradiction explains why current GPU finance centralizes around investment-grade customers even while USD.AI predicts the decline of company-level credit. The strongest counterparties can still create bankable paper; weaker AI companies cannot manufacture creditworthiness by signing offtake.

It also identifies the actual load-bearing assumption in USD.AI's end state: a defaulted customer's workload can be replaced quickly enough that debt service survives. If many AI companies fail together, rental demand and GPU resale values can fall simultaneously. Diversification removes idiosyncratic customer risk but cannot remove a market-wide compute downturn.

## Evidence

- David Choi, Touchcraft, ~20:15-21:43: SaaS moats and cash flows become unfinanceable, so future lending migrates from AI-company corporate credit to GPUs.
- David Choi, ~32:46-33:50: USD.AI nevertheless prices Amazon/Fortune 500 offtake materially cheaper than no-offtake builds and expects those builds to obtain customers before installation.
- Harry Page, 2026-06-29: USD.AI implicitly underwrites both the contract and the offtaker's credit because the contract supports debt service.
- USD.AI public book, 2026-07-17: eight of nine upcoming loans were contract-backed and none was labeled `No Offtake`.

## Links

- [[usd-ai-wants-to-diversify-away-named-offtaker-credit-not-eliminate-compute-revenue|USD.AI wants to diversify away named offtaker credit, not eliminate compute revenue]]
- [[usd-ai-differentiates-on-standardization-and-distribution-not-residual-valuation|USD.AI differentiates on standardization and distribution, not residual valuation]]
- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]
- [[offtake-based-gpu-loans-systematically-centralize-capital|Offtake-based GPU loans systematically centralize capital]]
- [[usd-ai|USD.AI]]
