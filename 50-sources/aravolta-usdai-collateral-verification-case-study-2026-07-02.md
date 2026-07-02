---
type: source
status: captured
created: 2026-07-02
updated: 2026-07-02
source_date: 2026-07-02
source_type: article
projects: []
domains: [gpu-finance, verification, dcim, asset-backed-lending]
people: []
orgs: [usd-ai, aravolta]
attachments: []
tags: [verification, collateral, monitoring, dcim, sla]
---

# Aravolta x USD.AI case study: infrastructure-level collateral verification

## Context

Aravolta (a DCIM / data center infrastructure monitoring company, SOC 2 Type 1+2, with a dedicated "Lenders" vertical) publishes a case study showing USD.AI as a customer for continuous, infrastructure-level verification of GPU-backed credit positions. Found by Dylan on 2026-07-02, notably while a follow-up email to Harry (USD.AI) asking "what have you already looked at" on operator verification was in flight. This partially answers that question before the reply.

URL: https://www.aravolta.com/case-studies/usdai-case-study

## What The Case Study Says

- USD.AI's stated principle: "Verify, don't trust" - GPUs cannot be verified through paperwork alone; value depends on being installed as described, operational over time, continuously accounted for.
- Aravolta replaces the traditional approach (quarterly PDF audits, trust-based self-attestation, manual spreadsheets, point-in-time snapshots) with real-time API data feeds, automated infrastructure verification, continuous telemetry, live operational status, instant asset-change detection, and a verifiable audit trail.
- Verified scope: physical presence of servers/GPUs, asset identity (serial numbers, e.g. H100 80GB in a Dell PowerEdge XE9680), configuration, operational health/fault status, thermal data, continuous availability over time.
- Explicitly NOT collected: customer workloads, model/application data, tenant-specific usage, application performance metrics. The boundary is deliberate (customer confidentiality, avoiding operational friction for infrastructure partners).
- Quote from Conor Moore (co-founder & COO, USD.AI): Aravolta "bridged the gap between our risk requirements and the technical reality of the data center, allowing for collateral auditing without creating operational friction."
- Aravolta positions itself as a transparency layer between physical infrastructure and credit protocols; likely the "verify" in USD.AI's escrow-releases-on-install-and-verify structure.

## Why It Matters

- Behavioral WTP evidence: a GPU lender already pays for verification infrastructure. The strongest evidence yet that verification moves real economics - procurement, not opinion.
- Narrows the open wedge: infrastructure-layer collateral verification (exists, is on, is healthy) is claimed. The unclaimed layer is contract-performance verification: SLA delivery to the tenant, revenue crediting, offtake performance - exactly what Aravolta's scope excludes, and exactly where Harry located the cashflow risk (missed SLA means revenue not credited).
- Explains why the remaining layer is unclaimed: it requires tenant-adjacent data that operators/customers resist sharing. The trusted-proof question is the hard part, not the telemetry.
- Pre-answers part of the in-flight Harry follow-up; expect Aravolta to appear in his account of what USD.AI has already tried.

## Promoted Insights

- Update to [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|the SLA insight]]: collateral verification exists and is bought; contract-performance verification is the remaining gap.

## Open Questions

- Does Aravolta intend to cross its own boundary into tenant/SLA-layer data, or is the exclusion structural for them (DCIM heritage, operator relationships)?
- Is Aravolta deployed across USD.AI's whole book or select facilities?
- Who else uses Aravolta's lender product? (Their "Lenders" page suggests a vertical, not a one-off.)
- Does infrastructure-level "continuous availability" already capture enough of uptime that the marginal value of true SLA verification is small? (The version of this find that weakens the thesis.)

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Orgs: [[usd-ai|USD.AI]], [[aravolta|Aravolta]]
