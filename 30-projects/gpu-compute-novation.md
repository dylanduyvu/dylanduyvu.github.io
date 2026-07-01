---
type: project
status: shelved
created: 2026-06-29
updated: 2026-07-01
domains: [gpu-finance, ai-infrastructure, compute-contracts]
people: [harry-page, bernie-margulies]
orgs: [usd-ai, nebius, american-compute, meta]
tags: [gpu, novation, customer-discovery]
---

# GPU Compute Novation

## Current State

Shelved with tripwire. The original hypothesis that long-term GPU offtake customers are over-committed and need contract novation is effectively falsified for the current market. LBH0 - exit demand exists - was the pre-committed kill-switch, and the current evidence says exit demand is not there.

The clean kill is two-source and mechanism-backed: USD.AI reports that customers generally need more capacity, not less, and Dylan's Nebius evidence provides independent neocloud-side corroboration. The market appears supply-constrained rather than over-committed, so customers are short capacity rather than long capacity.

2026-07-01 nuance: Meta's reported plan to sell excess AI compute is a real supply-loosening signal, but it does not directly resurrect the original novation thesis. Hyperscaler fleet externalization is not the same workflow as a customer novating a committed offtake contract. It does mean the tripwire should watch hyperscaler N-1 / excess-capacity sales as a leading indicator for looser compute supply.

The better near-term problem may be SLA and uptime performance verification for GPU lenders, because trusted performance evidence could reduce top-line revenue risk and allow more aggressive lending.

American Compute is still a useful counterpoint, but it is now explicitly weaker. Bernie volunteered a hunch that some startups may be locked into three-year offtake they will not fully use, but he framed it as a bet rather than observed transfer demand.

## Decision

### 2026-06-30: Shelve current-market novation

Stop running additional generic invalidation calls on whether customers want to offload committed capacity. More "nobody wants out" evidence would not materially change the conclusion; it would mostly delay acting on the kill criteria.

Do not bury the thesis permanently. Revisit only if a tripwire fires:

- GPU supply catches up and customers become capacity-long rather than capacity-short.
- Next-gen GPU supply creates a glut or price crash similar to the H100 crash pattern.
- Hyperscalers begin selling enough excess or N-1 compute capacity to pressure neocloud utilization or pricing.
- Multiple direct buyer/operator sources name committed capacity they want to offload.
- Deposits weaken, reserved capacity becomes underwater, or provider consent paths become easier.

Tripwire watch (2026-07-01): Meta ("Meta Compute") and SpaceX/xAI moving to resell excess AI compute is a partial supply-loosening signal. It is not yet a trigger, because this is hyperscaler *older-gen excess* at scale rather than *startup committed-offtake* overhang. Watch whether it spreads to committed-contract resale. See [[hyperscalers-are-becoming-compute-sellers-pressuring-neoclouds|Hyperscalers are becoming compute sellers, pressuring neoclouds]].

## Key Insights

- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]: Seller-side contract liquidity may be thin because customers need reserved compute and have paid meaningful deposits.
- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]: Contract-only financing lacks a recovery asset if the cash flow defaults.
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]: USD.AI volunteered a lender pain tied to pricing and revenue-risk reduction.
- [[clean-kill-criteria-only-work-if-clean-kills-stop-work|Clean kill criteria only work if clean kills stop work]]: The validation process only matters if clean kills actually stop work.
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]: Existing risk transfer is centered on GPU hardware value, not naked contract cash flows.
- [[startups-may-be-locked-into-unused-three-year-compute-offtake|Startups may be locked into unused three-year compute offtake]]: American Compute's counter-hunch is worth testing, but currently weaker than USD.AI/Nebius evidence.
- [[gpu-financing-lender-types-fragment-by-credit-tolerance|GPU financing lender types fragment by credit tolerance]]: Offtake resale may matter differently to banks, private credit, crypto lenders, and equipment finance shops.

## Sources

- [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]]
- [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]]
- [[gpu-financing-blogs-relevance-list-2026-06-29|GPU financing blogs relevance list]]
- [[novation-shelving-decision-2026-06-30|Novation shelving decision memo]]
- [[meta-compute-hyperscalers-selling-excess-compute-2026-07-01|Meta Compute: hyperscalers moving to sell excess AI compute]]

## Open Questions

- What evidence would lenders trust for SLA/uptime verification?
- Who has budget for verification: lenders, borrowers, insurers, offtakers, marketplaces, or data center operators?
- What contract/SLA/operator requirements block clean split or resale of compute capacity?
- What raw source should capture the Nebius corroboration if Dylan can recover it?

## Next Tests

- Run a cheap discovery round specifically on SLA/uptime verification with lenders, operators, and insurers.
- Ask operators what telemetry, incident history, and customer reporting they already produce.
- Capture the Nebius conversation/source if available.
- Do not run further generic novation invalidation calls unless a tripwire fires.
- If a tripwire fires, ask for one named overcommitted buyer, one provider consent path, and one failed resale/transfer attempt.
- If a tripwire fires, route the contract-transferability / true-novation feasibility question through Evan Meagher (ex-CoreWeave CFO, USD.AI advisor), who would know whether offtake contracts are practically assignable/novatable and where provider consent breaks. (No person hub yet; he has not been contacted.)
