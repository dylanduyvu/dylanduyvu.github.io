---
type: source
status: captured
created: 2026-07-20
updated: 2026-07-20
source_date: 2026-07-20
source_type: conversation-relay
projects: [gpu-compute-derivatives]
domains: [gpu-finance, compute-derivatives, credit-markets]
people: [jakub-janiak]
orgs: []
attachments: []
tags: [gpu, tenor-mismatch, compute-futures, risk-transfer]
---

# Jakub: compute futures as the cleanest way to transfer the tenor mismatch

## Raw Relay

Dylan reported: "Jakub's take is that the loan maturity mismatch issue is unsolveable without shifting risk - he said compute futures is the cleanest mechanism to solve this."

## Read

The first claim holds: better measurement cannot remove the risk that short-term customers disappear before a multi-year GPU loan is repaid. That risk must remain with the borrower or move to a lender, long-term customer, vendor, insurer, or derivative counterparty.

The futures claim depends on the contract. A cash-settled compute-price future protects against a fall in the market rental price. It does not pay merely because one operator fails to rent its fleet. A fixed-volume delivery contract, minimum-revenue contract, or similar instrument could transfer more of that rental-volume risk, but economically it begins to resemble standardized offtake.

## Follow-Up For Jakub

When you say compute futures, do you mean cash-settled price futures, or a contract that locks in payment for a fixed number of GPU-hours? The first hedges price but not idle capacity; the second is closer to standardized offtake.

## Links

- [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch: inference rents short, debt runs long]]
- [[compute-price-futures-do-not-hedge-fleet-utilization-risk|Compute price futures do not hedge fleet utilization risk]]
- [[gpu-loans-without-long-term-customer-claim-ledger-2026-07-19|Claim ledger: GPU loans without a long-term customer]]
- [[gpu-compute-derivatives|GPU Compute Derivatives]]
