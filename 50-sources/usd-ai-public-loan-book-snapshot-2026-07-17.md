---
type: source
status: captured
created: 2026-07-17
updated: 2026-07-17
source_date: 2026-07-17
source_type: dashboard
projects: []
domains: [gpu-finance, asset-backed-lending, capital-formation]
people: []
orgs: [usd-ai]
attachments: []
tags: [gpu, lending, offtake, loan-book, liquidity]
---

# USD.AI public loan-book snapshot, 2026-07-17

## Context

Snapshot of USD.AI's public loans dashboard and its live expected-APY API, captured 2026-07-17. The dashboard labels offtake as `Contract`, `On-Demand`, or `No Offtake`; its documentation defines upcoming loans as loans expected to close within 30 days.

- Dashboard: https://app.usd.ai/loans
- Expected-APY API: https://api.usd.ai/usdai/dashboard/expected-apy
- Underwriting policy: https://usd.ai/insights/usdai-underwriting-and-risk-management

## Upcoming Book

The dashboard listed nine upcoming loans totaling **$407.45M**:

- **Eight contract-backed loans:** $399.03M, or 97.9% of upcoming principal.
- **One on-demand loan:** $8.42M at 12%.
- **Zero loans labeled `No Offtake`.**

| Hardware | Principal | APR | Offtake | Stage |
|---|---:|---:|---|---|
| B300 [288] | $84.11M | 7.0% | Contract | Purchase order placed |
| B300 DGX [72] | $27.72M | 10.0% | Contract | Term sheet executed |
| B300 [170] | $56.00M | 7.0% | Contract | Term sheet executed |
| B300 DGX [24] | $8.42M | 12.0% | On-Demand | Term sheet executed |
| B200 [16] | $5.45M | 10.0% | Contract | Purchase order placed |
| B300 DGX [72] | $27.72M | 12.0% | Contract | Term sheet executed |
| GB200 NVL72 [32] | $128.30M | 9.0% | Contract | Term sheet executed |
| B300 [34] | $15.33M | 15.0% | Contract | Purchase order placed |
| B300 [130] | $54.40M | 11.5% | Contract | Purchase order placed |

This does not support the literal claim that every upcoming loan has a contract. It supports the stronger qualified claim that the visible new book is overwhelmingly contract-backed and contains no pure no-offtake deal.

## Capital Position

The expected-APY API returned:

- Active loans: **$100.74M** across 11 loans.
- Escrowed upcoming loans: **$99.44M** across two loans.
- Term sheets executed: **$308.01M** across seven loans.
- API field `newDealsCapital`: **$308.60M**.
- Idle PYUSD: **$206.36M**.
- API field `committed.amount`: **$508.19M**.
- Projected APY at full deployment: **11.30%**.

The API's `newDealsCapital` field exceeds idle PYUSD by approximately **$102.24M**. The current pipeline therefore cannot be funded from idle vault liquidity alone if every listed deal closes as shown.

The literal statement that USD.AI has more money currently deployed than sitting idle is false in this snapshot: active loans are about $100.74M versus $206.36M of PYUSD. The real imbalance is **future loan commitments versus currently idle capital**.

## Interpretation

- Behavioral book evidence qualifies USD.AI's asset-first rhetoric. Hardware still sets collateral value and recovery, but contracted or demonstrated revenue is doing substantial origination and pricing work in the visible pipeline.
- Borrower demand is ahead of capital currently ready for the full upcoming book. That is consistent with a capital-formation or distribution bottleneck.
- The snapshot does **not** prove the offered risk-adjusted return is unattractive. USD.AI had already attracted roughly $398M of TVL by its 2026-06-08 report, term sheets may not all close, and new deposits can arrive as loans approach funding.
- A stronger test would track the funding gap through time: vault net flows, how long deals remain in each stage, whether deals stall for capital, and whether higher projected yield closes the gap.

## Promoted Insights

- [[usd-ai-public-pipeline-is-overwhelmingly-contract-backed|USD.AI's public pipeline is overwhelmingly contract-backed]]
- [[usd-ai-upcoming-book-outruns-idle-capital-but-does-not-prove-poor-risk-reward|USD.AI's upcoming book outruns idle capital but does not prove poor risk-reward]]

## Links

- Area: [[gpu-finance|GPU Finance]]
- Org: [[usd-ai|USD.AI]]
