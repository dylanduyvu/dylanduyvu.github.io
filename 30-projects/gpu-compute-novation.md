---
type: project
status: active
created: 2026-06-29
updated: 2026-06-29
domains: [gpu-finance, ai-infrastructure, compute-contracts]
people: [harry-page, bernie-margulies]
orgs: [usd-ai, american-compute]
tags: [gpu, novation, customer-discovery]
---

# GPU Compute Novation

## Current State

The original hypothesis that long-term GPU offtake customers are over-committed and need contract novation is weakened in the current market. USD.AI reports that customers generally need more capacity, not less, and that contracts are useful for debt service but not recoverable collateral without hardware.

The better near-term problem may be SLA and uptime performance verification for GPU lenders, because trusted performance evidence could reduce top-line revenue risk and allow more aggressive lending.

American Compute is a useful counterpoint: Bernie volunteered a hunch that some startups may be locked into three-year offtake they will not fully use, but he framed it as a bet rather than observed transfer demand. Keep it in inbox until direct customer/provider evidence appears.

## Key Insights

- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]: Seller-side contract liquidity may be thin because customers need reserved compute and have paid meaningful deposits.
- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]: Contract-only financing lacks a recovery asset if the cash flow defaults.
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]: USD.AI volunteered a lender pain tied to pricing and revenue-risk reduction.
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]: Existing risk transfer is centered on GPU hardware value, not naked contract cash flows.
- [[startups-may-be-locked-into-unused-three-year-compute-offtake|Startups may be locked into unused three-year compute offtake]]: American Compute's counter-hunch is worth testing, but currently weaker than USD.AI/Nebius evidence.
- [[gpu-financing-lender-types-fragment-by-credit-tolerance|GPU financing lender types fragment by credit tolerance]]: Offtake resale may matter differently to banks, private credit, crypto lenders, and equipment finance shops.

## Sources

- [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]]
- [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]]

## Open Questions

- Does the no-offloading signal hold outside USD.AI's borrower and offtaker base?
- Are distressed startups, strategy pivots, or failed AI labs creating hidden contract-offload supply?
- What evidence would lenders trust for SLA/uptime verification?
- Who has budget for verification: lenders, borrowers, insurers, offtakers, marketplaces, or data center operators?
- What source should capture the Nebius corroboration Dylan mentioned so the vault has an evidence trail?
- Can anyone name a concrete startup/operator with unused committed three-year offtake?
- What contract/SLA/operator requirements block clean split or resale of compute capacity?

## Next Tests

- Run a cheap discovery round specifically on SLA/uptime verification with lenders, operators, and insurers.
- Ask operators what telemetry, incident history, and customer reporting they already produce.
- Test whether any distressed or overbought buyers exist despite the supply-constrained baseline.
- Capture the Nebius conversation/source if available.
- If testing Bernie's hunch, ask for one named overcommitted buyer, one provider consent path, and one failed resale/transfer attempt.
