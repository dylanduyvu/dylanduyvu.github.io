---
type: org
status: active
created: 2026-07-13
updated: 2026-07-13
aliases: [Silicon Network, Silicon.net, Berkeley Compute, Berkeley Compute Inc.]
people: [mcdavid-stoddard]
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, tokenization, compute-markets]
tags: [gpu, rwa, depin, compute]
---

# Silicon Network

## Context

Silicon Network is the Berkeley Compute Inc. brand for tokenized GPU ownership, pool-based GPU capital formation, asset/earnings servicing, and secondary trading. Its live homepage now also markets long-term dedicated compute from clusters it says it owns and operates.

This is not Silicon Data, Carmen Li's separate GPU pricing and performance-data company.

Strategic relevance: it is a live example of outside capital funding GPU infrastructure through tokenized claims, and a behavioral proof point for the unresolved operator-underwriting and residual-risk questions.

## Product Model

- Specific-asset route: claim tickets/unpaired NFTs fund future GPUs; deployed hardware is later paired to the token.
- Pool route: `$silGPUa` represents a fractional claim on a pool of GPU-server NFTs and USDC.
- Servicing: provider dashboards ingest marketplace data, track assets/earnings, manage agreements, and process payouts.
- Liquidity: individual NFTs and pool tokens can trade after issuance.
- Compute: FarmGPU/Pantheon-style operators monetize through RunPod and other marketplaces; the current Silicon homepage also offers direct multi-year offtake.

## Risk / Verification Read

- The operator controls deployment, uptime, marketplace integrations, earnings calculations, and payouts.
- Silicon's Terms say individual owner-provider disputes remain between those parties.
- Silicon says it keeps strict provider standards but publishes no diligence criteria.
- Onchain records make ownership and completed payouts auditable; public docs do not establish independent truth for deployment, utilization, revenue completeness, or SLA delivery.
- Current direct-compute copy and tokenization docs may describe parallel products or a recent pivot; the relationship is not public.

## Known People

- Paul Hainsworth: founder and CEO.
- [[mcdavid-stoddard|McDavid Stoddard]]: founder contact in the current email thread.

## Current Outreach

On 2026-07-13, Dylan asked what a third-party operator must prove before Silicon is comfortable placing a cluster in front of investors. McDavid initially interpreted this as asking who manages SLAs and day-to-day operations. Dylan clarified using the actual Cluster 01 flow: FarmGPU operates the hardware while the pool funds it, so how does Silicon evaluate FarmGPU before deploying that capital? Substantive response pending.

The exchange is not evidence that Silicon performs no diligence. It does show that operating responsibility and capital approval are easy to collapse unless the question names the operator, capital source, decision, and timing.

## Related Sources

- [[silicon-network-product-and-risk-model-audit-2026-07-13|Silicon Network product and risk model audit]]
- [[mcdavid-stoddard-silicon-network-operator-vetting-email-2026-07-13|McDavid Stoddard / Silicon Network email on operator vetting]]
- [[zile-cao-blockchain-capital-call-2026-07-10|Zile Cao / Blockchain Capital call]]

## Related Insights

- [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|GPU tokenization makes ownership auditable, not operator performance true]]
- [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|The verification gap is contract-defined delivery and revenue truth]]
- [[a-gpu-has-three-obsolescence-curves-not-one|A GPU has three obsolescence curves, not one]]

## Open Questions

- What provider diligence does Silicon perform before pool or buyer capital is deployed?
- Are the new Silicon-operated clusters financed by the token pools, or is direct compute a separate business/pivot?
- Who guarantees the documented end-of-life liquidation floor?
- Which operational and revenue fields come directly from RunPod versus the provider?
