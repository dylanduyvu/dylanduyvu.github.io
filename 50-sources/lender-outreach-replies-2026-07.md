---
type: source
status: capturing
created: 2026-07-07
updated: 2026-07-07
source_date: 2026-07-07
source_type: email-thread
projects: []
domains: [gpu-finance, customer-discovery, underwriting, verification]
people: []
orgs: []
attachments: []
tags: [outreach, lenders, h2, eligibility, tally]
---

# Lender outreach replies: running log (Jul 2026 wave)

## Context

Accumulating log of replies to the July 2026 cold-outreach wave to GPU lenders (~46 personalized emails; pattern-check format: "unproven operators get skipped or post big equity cushions - is that how it works at your shop?"). Each reply gets scored against H2 (eligibility hypothesis: lenders skip unproven operators for lack of verifiable track record; a verified delivery record would change eligibility or cushion at fixed price). The kill question is deployed in replies, not cold: would a verified delivery record move the terms, or do only the equity numbers move them?

PRIVACY: lenders are anonymized here (Lender A, B, ...) with seat descriptions only. Identity mapping lives in the local outreach CSV (not in this vault). Quotes are kept to short fragments.

Scoring rubric per reply:
- CONFIRM: mechanism matches pattern (skip, or equity cushion) with no verification instrument mentioned
- CONFIRM-WITH-REFINEMENT: pattern holds but adds mechanism detail
- FALSIFY: lender says they underwrite operator delivery quality directly, or says a verified record would change nothing while cushions also do not bind
- H3 PULL: lender raises delivery/revenue visibility unprompted

## Running tally (n=1)

- Equity cushion / LTV: 1
- Amortization speed as protection: 1
- Sponsor reputation ("equity story") as proxy track record: 1
- Skip entirely: 0
- Verification / measurement mentioned unprompted: 0
- H3 pull: 0
- Kill question answered: 0 (1 pending)

## Entries

### 2026-07-07 - Lender A

Seat: MD of originations at a large independent equipment / asset-based lender ($20M-$100M+ tickets, multiple marquee GPU financings). Replied within ~2 minutes of the cold email.

Reply, near-verbatim: "It's an LTV and Amort play. Also helped to have the right equity story."

Reading:
- No skip. Unproven operators get STRUCTURED, not declined: lower LTV (the equity cushion expressed as a ratio) plus faster amortization (protection via speed - principal burns off before delivery/obsolescence risk bites). Amort speed is a mechanism the pattern statement missed; rhymes with the punitive-amort/short-refi terms datacenter lenders put on neocloud tenants and with the 3y tenor at the first-execution pricing tier.
- "The right equity story" = sponsor identity as underwriting input. Reputation-by-proxy: the backer's track record substitutes for the operator's missing one. Past tense ("helped") = describing done deals, behavioral evidence.
- Zero mention of verifying anything. Delivery risk handled entirely by structure + sponsor reputation - consistent with no instrument existing.

Score: CONFIRM-WITH-REFINEMENT. Mechanism = cushion (LTV) + amort speed + sponsor proxy.

Follow-up: kill question sent same day (would a verified delivery record, past clusters stood up on time with third-party-confirmed uptime, move the LTV or amort, or does the equity story still set those?). Answer pending; will log as kill-confirm or kill-falsify.

## Promoted Insights

- None yet. Promote when n >= 3 or a clean kill-question answer lands. Candidate targets: [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|equity cushions insight]] (amort-speed and sponsor-proxy refinements), [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|execution risk insight]].

## Open Questions

- Does ANY lender mention verification, measurement, or delivery data unprompted? (H3 pull; zero so far.)
- Does anyone answer the kill question with "wouldn't change anything"? (Direct H2 falsification at that shop.)
- Do equipment lenders and venture debt shops name different mechanisms? (Track by firm type as n grows.)
- Does amort speed recur? If cushion + clock is the standard pair, the credential's pitch is "move both."

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Related Insights: [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|Less-proven GPU operators get funded through equity cushions, not SLA evidence]], [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]], [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]]
