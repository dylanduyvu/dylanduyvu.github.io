---
type: person
status: active
created: 2026-06-29
updated: 2026-07-01
aliases: [Thomas, Thomas Galbraith]
orgs: [barkr]
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, residual-value, asset-backed-lending]
tags: [gpu, valuation, customer-discovery]
---

# Thomas Galbraith

## Context

Thomas is Dylan's Barkr/Barker contact for GPU asset pricing, hard-asset collateral valuation, guarantee structures, and lender-side risk transfer.

## Relationship

Dylan spoke with Thomas on 2026-06-18 while exploring GPU residual-value pricing and guarantee structures. Thomas offered to help with further intros and to reconnect when Dylan has a clearer direction.

On 2026-07-01, Dylan sent Thomas a follow-up asking whether operator uptime / SLA performance factors into Barkr's warranty process at all, or whether lenders raise it as a separate diligence gap outside Barkr's hardware-value / recovery-risk inputs.

Thomas replied the same morning: SLA/uptime is separate from Barkr's warranty process, but he has heard it as an issue and NVIDIA brought up something similar. He suggested the wrapper may be credit insurance or business interruption against the offtaker.

Dylan's follow-up analysis after Thomas's reply: the insurance / business-interruption frame is cleaner than pure monitoring because live SLA data is backward-looking. Monitoring matters most when it supports insurance eligibility, claims, repricing, renewals, lender levers, or future underwriting.

## Useful Signals

- He framed Barkr's lender product as bespoke recovery-floor pricing, not generic fair-market-value indexing.
- He said GPU clients mostly want valuation plus guarantee.
- He said Barkr has done almost half a billion dollars in guarantees.
- He distinguished Barkr's guarantee from American Compute-style residual value insurance.
- He said banks often dislike insurance because they do not believe claims will pay.
- He said Barkr's data is roughly half public scrape and half private client data.
- He said data is not currently Barkr's bottleneck because Munich Re is comfortable backing them.
- He said SLA/uptime performance is separate from Barkr's hardware warranty process, but he has heard it as an issue and NVIDIA raised something similar.
- He framed the potential wrapper as credit insurance or business interruption against the offtaker rather than a hardware-value warranty input.
- His insurance framing helps solve the "why monitor after go-live?" question: monitoring can become the evidence layer for coverage or claims, not just a dashboard.

## Related Sources

- [[barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18|Barkr call with Thomas]]
- [[barkr-thomas-sla-email-reply-2026-07-01|Barkr Thomas SLA email reply]]
- [[codex-chat-sla-insurance-monitoring-2026-07-01|Codex chat on SLA insurance and monitoring]]

## Related Insights

- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]
- [[banks-may-prefer-guarantees-or-swaps-over-insurance-for-gpu-collateral-risk|Banks may prefer guarantees or swaps over insurance for GPU collateral risk]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[sla-monitoring-is-backward-looking-but-can-feed-forward-underwriting|SLA monitoring is backward-looking but can feed forward underwriting]]

## Related Projects / Areas

- [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- [[gpu-finance|GPU Finance]]
