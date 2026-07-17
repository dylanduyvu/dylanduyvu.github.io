---
type: insight
status: distilled
created: 2026-07-17
updated: 2026-07-17
confidence: high
domains: [gpu-finance, asset-backed-lending, ai-infrastructure]
projects: []
sources: [usd-ai-public-loan-book-snapshot-2026-07-17]
people: []
orgs: [usd-ai]
aliases: [usdai upcoming loans have offtake, usdai pipeline is contract backed, usdai behavioral loan book]
tags: [gpu, lending, offtake, underwriting, loan-book]
---

# USD.AI's public pipeline is overwhelmingly contract-backed

## Claim

USD.AI presents its underwriting as lending to recoverable GPU assets rather than relying on borrower credit, but its public 2026-07-17 pipeline was overwhelmingly revenue-backed: eight of nine upcoming loans, representing 97.9% of principal, were labeled `Contract`; the ninth was `On-Demand`; none was labeled `No Offtake`.

The correct read is not that USD.AI refuses merchant exposure. One on-demand loan remains. It is that the behavioral book looks much more contract-dependent than the strongest version of the hardware-first positioning suggests.

## Why It Matters

This is stronger than a statement of policy because it shows what USD.AI is actually preparing to fund. Hardware appears to determine the recovery floor and possible loan size, while contracted or demonstrated compute revenue still determines which large deals enter the visible book and how they price.

It reinforces the broader inversion that GPU-backed debt is contract-backed cash flow with hardware collateral underneath, while preserving the small but real Tier 3 route for on-demand operators.

## Evidence

- 2026-07-17 dashboard: nine upcoming loans totaling $407.45M.
- Eight `Contract` deals totaled $399.03M, or 97.9% of upcoming principal.
- One $8.42M deal was `On-Demand`; zero were `No Offtake`.
- USD.AI's published underwriting policy says rates are set by offtake quality and LTV, and closing requires an executed offtake agreement or documented on-demand revenue history.

## Counterpoints / Uncertainty

- This is one public snapshot of a selected pipeline, not USD.AI's complete historical approval set.
- Upcoming deals are term sheets or purchase orders, not necessarily funded loans.
- The on-demand deal proves that a formal contract is not an absolute eligibility requirement.
- USD.AI can still coherently call the loans asset-backed if hardware governs advance rate and recovery even when cash-flow quality governs pricing and selection.

## Links

- Source: [[usd-ai-public-loan-book-snapshot-2026-07-17|USD.AI public loan-book snapshot, 2026-07-17]]
- Related: [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|GPU-backed debt is contract-backed with a hardware recovery floor]]
- Related: [[offtake-based-gpu-loans-systematically-centralize-capital|Offtake-based GPU loans systematically centralize capital]]
- Org: [[usd-ai|USD.AI]]
- Area: [[gpu-finance|GPU Finance]]
