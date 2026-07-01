---
type: org
status: active
created: 2026-06-29
updated: 2026-06-30
aliases: [USD.AI, USD AI]
people: [harry-page]
projects: [gpu-compute-novation]
domains: [gpu-finance, ai-infrastructure]
tags: [gpu, lending]
---

# USD.AI

## Context

USD.AI is strategically relevant because it lends against GPU-backed infrastructure and sees borrower, collateral, offtake, and lender-risk dynamics directly.

## Known Claims / Signals

- USD.AI describes its lending as fundamentally GPU-backed.
- It treats offtake contracts and customer credit as support for debt service, not as independently recoverable collateral.
- It has not seen customers trying to offload termed-out GPU capacity in the current market.
- It sees supply scarcity as a bottleneck: customers wait for GPUs or pay premiums to skip the line.
- It volunteered SLA/uptime operator-performance verification as a current lender pain.
- It uses value warranties/reinsurance around GPU residual value, at least in the Barkr/Barker-style structure described on the call.
- Scale reference: on the order of $100M+ deployed against a ~$1.2B pipeline (compiled figures, see provenance note below).

## Underwriting Model

> Provenance: this section is Dylan's compiled understanding of USD.AI's underwriting model. It is **not** stated in the 2026-06-29 Harry Page transcript, which only covers the GPU-backed framing, no-recovery-on-bare-contract, supply scarcity, the Barkr warranty, and the SLA pain. Treat the specifics below as unverified until confirmed against a USD.AI source (docs, site, or a follow-up with Sam/Harry).

The model separates loan *size* from loan *rate*:

- **Hardware sets the loan size and the recovery floor.** Max ~80% LTV, and only in jurisdictions where title to the GPUs can be perfected. USD.AI dollar-values the hardware; it never standalone dollar-values a contract. This is the operational form of [[bare-compute-contracts-have-no-recovery-value-after-default|bare compute contracts having no recovery value]].
- **The offtake contract sets the rate**, graded into tiers:
  - Tier 1 — investment-grade counterparty: ~7-9%.
  - Tier 2 — multi-year non-IG counterparty: ~10-12%.
  - Tier 3 — spot / on-demand: ~12-15%.
  - Tier 1 and Tier 2 generally require 24+ months of remaining term.
- **Structure.** A bankruptcy-remote SPV holds the GPUs, the offtake contract, the colocation agreement, and the revenue. Escrow runs through Wilmington Trust and releases on hardware install + verification.
- **Risk transfer.** Barkr provides a reinsured value warranty (~150 bps/yr) locked on day one, which lets USD.AI synthesize a default swap on loss-given-default. See [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]].

This is the cleanest worked example so far of the [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|contract-backed-with-hardware-recovery-floor]] inversion: the hardware backstops, the contract prices.

## Related People

- [[harry-page|Harry Page]] — originations; did the 2026-06-29 call.
- Sam McCulloch — the intro path into USD.AI originations (reached via Manav). No hub yet.
- Evan Meagher — ex-CoreWeave CFO and USD.AI advisor; named routing target for GPU contract-transferability questions (relevant if the novation tripwire fires). No hub yet.

## Related Sources

- [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]]

## Related Insights

- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]
- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]

## Related Projects / Areas

- [[gpu-compute-novation|GPU Compute Novation]]
- [[gpu-finance|GPU Finance]]
