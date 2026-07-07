---
type: source
status: captured
created: 2026-07-06
updated: 2026-07-06
source_date: 2026-07-06
source_type: research
projects: []
domains: [gpu-finance, verification, project-finance, market-structure]
people: []
orgs: [aravolta, coreweave]
attachments: []
tags: [research, analogies, independent-engineer, verification, draw-gating]
---

# Deep research: how other industries verify operator delivery (analogies report)

## Context

Deep-research report (2026-07-06) commissioned by Dylan: how energy/project finance, CRE, shipping, aviation, equipment finance, franchising, trade finance, and SaaS lending solved the operator-delivery verification problem, to extract transferable lessons for GPU lending. Full report lives as a chat artifact; this note captures the decision-relevant findings and the one tension it creates with the wedge decision.

## The Five Institutional Forms (cross-industry patterns)

1. Independent engineer / draw-gate (project finance, CRE construction): lender-selected, borrower-paid engineer certifies milestones; "no drawdown certificate, no disbursement." Fits staged capex against technical milestones.
2. Classification society (shipping, since 1760): asset integrity to a written rule set; certificate is a condition of insurance AND mortgage; owner-pays conflict policed by IACS quality schemes, transfer-of-class rules, and port state control as the independent government check.
3. Data consortium / credit bureau (PayNet in equipment finance; SBA franchise-brand default rates): operator track record from pooled lender data; predictive but cold-start - needed critical mass of lenders and documented defaults.
4. Vetting regime (OCIMF SIRE/TMSA in tankers): DEMAND-side buyers (oil majors) forced a shared operator-inspection database after disasters; a bad record means no charter.
5. Servicer / watchlist (CMBS): standardized surveillance and early-distress triggers (e.g. 10% DSCR drop, largest-tenant loss) on securitized pools - still substantially fed by borrower self-reporting.

## Key Transferable Mechanics

- Conflict-of-interest solution, settled across industries: LENDER SELECTS, BORROWER PAYS. Adopt directly.
- Draw-gating is universal for the build phase; the GPU embryo already exists: CoreWeave's $8.5B Meta facility funds only after NVIDIA Level 3 testing "validated by a technical advisor" (Moody's) - a one-time completion gate, not an ongoing monitor. The IE role is being born at the top tier.
- Estoppel certificates (CRE): the lender verifies the lease DIRECTLY WITH THE TENANT. Direct-counterparty confirmation of the compute MSA (in force, undisputed, payments current) is the cheapest proven revenue-truth mechanic and maps cleanly to compute.
- Read-only billing access (SaaS/RBF lending, Stripe pattern): instrument the operator's billing/usage systems instead of trusting periodic self-reports.
- Performance tests gate risk conversion (solar performance-ratio tests convert construction loans to term loans; debt sized on conservative P90 not P50).
- Aviation's answer to no-track-record operators: security deposits + maintenance reserves + tight covenants - i.e., MORE COLLATERAL, not a credential.

## Failure Modes (warnings)

- Capture: owner-pays without policing invites class-hopping; needed quality schemes + independent checks.
- Fraud mutation: Qingdao 2014 - duplicate warehouse receipts pledged the same metal to multiple banks (>$1B losses); without a shared collateral/contract registry, GPU lending invites duplicate financing.
- Verifier over-optimism: solar IE/yield estimates ran systematically high, spawning litigation; a delivery verifier must be conservative or dies with the first underperformance wave. Applies to any product Dylan builds.
- Liability: class societies faced existential suits (Prestige: Spain sued ABS for ~$5B); verifiers survive via liability limits, E&O insurance, rule-based (not guarantee-based) certification.

## Tensions With Current Vault Positions (flagged honestly)

1. AGAINST H2's precedent strength: history's answer to Bernie's exact problem (unproven operator) was deposits/reserves, not a credential. The credential-at-origination product has the WEAKEST clean analog; the strong analogs are draw-gating (build phase), estoppels (revenue truth), and ongoing IE monitoring. H2's closest cousins (PayNet, SIRE) both required consortiums or buyer mandates to exist - the cold-start is real. The one-report test is therefore really testing: can a credential beat the historical default of posting more cash?
2. Report staging vs wedge decision: the report recommends building the ongoing contract-level monitor first (P3-shaped, "independent engineer for compute"), deferring the bureau. This is a WHAT-TO-BUILD recommendation, not a what-to-test-first recommendation; the wedge decision (H2, one-report test) stands as the cheapest kill test. But if lender conversations pull P3-ward, the report supplies the build blueprint.
3. Anchoring confirmed from history: standards emerged from lenders/insurers/associations, never from standalone operator-pays startups without a relying-party mandate - consistent with the existing anchoring insight, now with named precedents.

## Report's Staged Recommendation (recorded, not adopted)

Stage 1: ongoing delivery monitor wired into draw gates/covenants, lender-selected borrower-paid, plus direct counterparty MSA confirmation and read-only billing access. Stage 2: recurring independent performance test / accreditation. Stage 3 (deferred): the cross-lender delivery bureau, seeded by Stage 1's data. Benchmarks to revisit: a shared collateral registry emerging; ClusterMAX or NVIDIA attestation becoming lender-accepted (then pivot to the loan-documentation layer on top); defaults clustering 2026-27 (accelerate everything).

## Open Questions

- Would GPU lenders accept a Level-3-style gate made recurring, or is one-time commissioning "good enough" at their tier?
- Who plays port-state-control / the independent government check in compute, if anyone?
- Is there any appetite among compute customers (the Meta/OpenAI seat) to sign estoppel-style confirmations - the untested counterparty in the whole structure?

## Links

- Synthesis: [[the-ununderwritten-half-of-gpu-credit|The Ununderwritten Half of GPU Credit]]
- Related Insights: [[operators-want-verification-at-origination-and-resist-it-post-close|Operators want verification at origination and resist it post-close]], [[mid-term-monitoring-moves-money-through-loan-events-not-the-rate|Mid-term monitoring moves money through loan events, not the rate]], [[loan-covenants-are-enforced-by-self-reporting-not-measurement|Loan covenants are enforced by self-reporting, not measurement]], [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|The verification gap is contract-defined delivery and revenue truth]]
- Areas: [[gpu-finance|GPU Finance]]
