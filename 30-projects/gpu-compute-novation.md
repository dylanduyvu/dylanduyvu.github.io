---
type: project
status: active
created: 2026-06-29
updated: 2026-06-29
domains: [gpu-finance, ai-infrastructure, compute-contracts]
people: [harry-page]
orgs: [usd-ai]
tags: [gpu, novation, customer-discovery]
---

# GPU Compute Novation

## Current State

The original hypothesis that long-term GPU offtake customers are over-committed and need contract novation is weakened in the current market. USD.AI reports that customers generally need more capacity, not less, and that contracts are useful for debt service but not recoverable collateral without hardware.

The better near-term problem may be SLA and uptime performance verification for GPU lenders, because trusted performance evidence could reduce top-line revenue risk and allow more aggressive lending.

## Key Insights

- [[Committed GPU capacity is supply-constrained, not over-committed]]: Seller-side contract liquidity may be thin because customers need reserved compute and have paid meaningful deposits.
- [[Bare compute contracts have no recovery value after default]]: Contract-only financing lacks a recovery asset if the cash flow defaults.
- [[SLA and uptime verification is a sharper GPU lender pain than novation]]: USD.AI volunteered a lender pain tied to pricing and revenue-risk reduction.
- [[GPU value warranties can synthetically insure lender loss given default]]: Existing risk transfer is centered on GPU hardware value, not naked contract cash flows.

## Sources

- [[usd-ai-call-harry-page-2026-06-29]]

## Open Questions

- Does the no-offloading signal hold outside USD.AI's borrower and offtaker base?
- Are distressed startups, strategy pivots, or failed AI labs creating hidden contract-offload supply?
- What evidence would lenders trust for SLA/uptime verification?
- Who has budget for verification: lenders, borrowers, insurers, offtakers, marketplaces, or data center operators?
- What source should capture the Nebius corroboration Dylan mentioned so the vault has an evidence trail?

## Next Tests

- Run a cheap discovery round specifically on SLA/uptime verification with lenders, operators, and insurers.
- Ask operators what telemetry, incident history, and customer reporting they already produce.
- Test whether any distressed or overbought buyers exist despite the supply-constrained baseline.
- Capture the Nebius conversation/source if available.
