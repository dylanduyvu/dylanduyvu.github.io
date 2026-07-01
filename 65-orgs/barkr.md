---
type: org
status: active
created: 2026-06-29
updated: 2026-07-01
aliases: [Barkr, Barker, The Barker Price, barkr.ai]
people: [thomas-galbraith]
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, residual-value, asset-backed-lending]
tags: [gpu, valuation, guarantees]
---

# Barkr

## Context

Barkr is strategically relevant because it prices hard assets used as loan collateral and provides guarantee-backed valuations for GPU and other asset-backed lending use cases.

## Known Claims / Signals

- Barkr focuses on hard assets used as loan collateral, not only GPUs.
- For lenders, Barkr's valuation is closer to a minimum sale / recovery floor than generic fair market value.
- Barkr offers both valuation-only platform access and valuation plus guarantee.
- Thomas said GPU clients mostly want the guarantee because the mark is backed.
- Barkr's valuation-only tier is also a counter-signal against killing the naked-data thesis: inbound demand exists for marks without guarantees, even if guarantee-backed marks appear higher-WTP.
- Thomas said Barkr has done almost half a billion dollars in guarantees.
- Barkr uses a mix of public scraping and private client data.
- Data quality is messy, but Barkr does not currently see data as the bottleneck because it can price assets comfortably enough for Munich Re to back.
- Munich Re backing matters heavily in sales to major institutions.
- Barkr's guarantee structure may be easier for some banks to trust than insurance, depending on risk-transfer recognition and payout mechanics.
- Thomas said operator SLA / uptime performance is separate from Barkr's warranty process, but he has heard it as an issue and NVIDIA brought up something similar.
- Thomas later clarified that the concrete signal was not NVIDIA as the buyer/problem-owner; it was a lender in a specific deal asking whether such a product existed.
- Thomas's product-shape instinct for SLA/uptime was credit insurance or business interruption against the offtaker, not hardware recovery-floor valuation.
- Thomas broadened the useful data gap from SLA uptime to usage monitoring that predicts default.
- Thomas thinks insurance around that monitoring is possible but hard, with cost and accuracy as the gating issues.
- That framing makes the monitoring layer more coherent: live SLA data is backward-looking, but it can support insurance eligibility, claims, repricing, renewals, lender levers, and future underwriting.

## Related People

- [[thomas-galbraith|Thomas Galbraith]]

## Related Sources

- [[barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18|Barkr call with Thomas]]
- [[barkr-thomas-sla-email-reply-2026-07-01|Barkr Thomas SLA email reply]]
- [[codex-chat-sla-insurance-monitoring-2026-07-01|Codex chat on SLA insurance and monitoring]]
- [[gpu-kbb-demotion-decision-2026-06-30|GPU KBB demotion decision memo]]

## Related Insights

- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]
- [[naked-gpu-residual-data-is-demoted-until-buyers-show-standalone-wtp|Naked GPU residual data is demoted until buyers show standalone WTP]]
- [[banks-may-prefer-guarantees-or-swaps-over-insurance-for-gpu-collateral-risk|Banks may prefer guarantees or swaps over insurance for GPU collateral risk]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[gpu-finance-monitoring-may-be-default-risk-telemetry-not-sla-uptime|GPU finance monitoring may be default-risk telemetry, not SLA uptime]]
- [[sla-monitoring-is-backward-looking-but-can-feed-forward-underwriting|SLA monitoring is backward-looking but can feed forward underwriting]]

## Related Projects / Areas

- [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- [[gpu-finance|GPU Finance]]
