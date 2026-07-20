---
type: org
status: active
created: 2026-07-02
updated: 2026-07-20
aliases: [Aravolta]
people: []
projects: []
domains: [gpu-finance, verification, dcim]
tags: [verification, dcim, monitoring, lenders, competitor-adjacent, draw-gate]
---

# Aravolta

## Context

Aravolta is a data center infrastructure monitoring (DCIM) company (EPMS/BMS/SCADA/NOC product lines, SOC 2 Type 1+2) with a dedicated lender vertical: continuous, infrastructure-level verification of GPU collateral for credit positions. Relevant as the closest existing player to the vault's verification thesis - it claims the collateral-existence layer while explicitly excluding the contract-performance layer.

## Known Facts / Signals

- USD.AI is a published customer (case study, seen 2026-07-02): real-time verification of GPU-backed credit positions - physical presence, serial-number identity, configuration, health/fault status, thermals, continuous availability. Endorsed by Conor Moore (co-founder & COO, USD.AI).
- Explicit scope boundary: does NOT collect customer workloads, tenant-specific usage, or application performance. The confidentiality line is a design choice ("without creating operational friction for our infrastructure partners").
- Positions as a transparency layer between physical infrastructure and credit protocols; plausibly the "verify" in USD.AI's escrow-on-install-and-verify.
- 2026-07-20 clarification: USD.AI's confirmed economic use is installation / collateral verification before releasing escrowed loan proceeds. Choi says money is not released until the GPUs are installed and verified. The nodes continue collecting telemetry afterward, but no available evidence shows ongoing telemetry repricing or resizing the loan.
- Has a general "Lenders" page, suggesting the lender product is a vertical, not a one-off.
- Apparent relation to Central Axis (DCIM lineage per site metadata).

## Read For The Thesis

Aravolta's existence is behavioral proof that lenders pay for verification when it controls a draw release. Its scope boundary maps the unclaimed territory: SLA delivery to tenants, revenue crediting, offtake performance. Competitor-adjacent rather than competitor - unless it crosses its own boundary.

Scope refinement (2026-07-06): "utilization" and "tenant usage" are different layers. Aravolta CAN see aggregate hardware utilization (powered, busy, thermals - chip-level, tenant-blind) and its lender page monetizes exactly that, marketing facilities where borrowing capacity and rates tie to actual GPU-hour utilization. What it does not collect is tenant identity, workloads, and application performance. So the precise open layer is contract-defined delivery and revenue truth: a busy, healthy GPU can still fail its SLA as the contract defines it, and utilization says nothing about whether revenue was credited.

## Open Questions

- Will it move up into tenant/SLA-layer verification, or is the exclusion structural? Working answer (2026-07-06, chat analysis): the exclusion is structural on three axes - (1) channel conflict: its original customers are operators/datacenters, and attesting contract failure grades its own installed base with data operators consented to share ("without creating operational friction" is the sales promise); (2) different business: contract-level truth needs contracts, service-level data, and invoices/credit memos, none of which flow through DCIM pipes - it is an assurance/audit motion, not telemetry SaaS; (3) liability: "contract honored, revenue true" is an opinion others move money on (auditor-grade liability), not a data feed. BUT the origination/credential model (operator volunteers) dissolves the channel conflict, and Aravolta already creeps along the performance axis (utilization-linked rates), so it remains one product decision away. Watch triggers: an Aravolta attestation/report product, hiring assurance/audit talent, or contract-terms ingestion.
- Strategic option (not either/or): layer on them rather than compete - their tenant-blind telemetry as a corroborating input to a contract-level delivery report (the historical data-provider-underneath / assurance-on-top split). Testable in the same anchor conversations as the lender kill question.
- Deployment breadth at USD.AI and across other lenders? PARTIAL ANSWER 2026-07-15 (Choi podcast, recorded ~June 2026): Choi confirmed the node deployment directly, boxes "that plug into the GPUs directly and verify that they're there and then you guys can see all the utilization," with tier-4-verified video cameras as the alternative for sensitive clients. And the demand-side half of this note's structural-exclusion analysis, verbatim: "We don't actually reveal all the information for now because our borrowers don't want to reveal that." The tenant-blindness is not only Aravolta protecting its installed base; the BORROWERS refuse workload disclosure. Utilization data exists inside live loans and is deliberately withheld. Consequence for any record product: operator consent to disclosure is a confirmed gating constraint. Capture: [[usdai-david-choi-decentralised-podcast-gpu-finance-rails-2026-06|Choi Decentralised capture]].

## Related Sources

- [[aravolta-usdai-collateral-verification-case-study-2026-07-02|Aravolta x USD.AI case study]]

## Related Insights

- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[gpu-finance-monitoring-may-be-default-risk-telemetry-not-sla-uptime|GPU finance monitoring may be default-risk telemetry, not SLA uptime]]

## Related Areas

- [[gpu-finance|GPU Finance]]
