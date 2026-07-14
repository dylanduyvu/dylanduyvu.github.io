---
type: source
status: captured
created: 2026-07-14
updated: 2026-07-14
source_date: 2026-07-14
source_type: dataset
projects: []
domains: [gpu-finance, credit-markets, verification]
people: []
orgs: []
attachments: [extract_gpu_ai_debt_facility_terms_399a9f39.csv]
tags: [dataset, repeat-financing, kill-route-two, facility-terms, first-pass]
---

# GPU debt facility dataset: repeat-financing pairs, first pass

## What this is

Deliverable from the repeat-financing FutureSearch prompt ([[gpu-repeat-financing-pairs-futuresearch-prompt-2026-07-14|prompt file]]), received 2026-07-14. Roughly 100 facility rows across ~30 operators, 2022-2026, built to test kill route two from documents: same-lender repeats versus lender switches. Raw data: [[extract_gpu_ai_debt_facility_terms_399a9f39.csv]] in 70-attachments. Sourcing skews primary (SEC filings, company releases), pricing confidence labeled per row, source conflicts noted per row.

## Segmentation rules, apply BEFORE quoting anything from this file

1. Bitcoin-collateralized facilities are margin loans against liquid collateral, not operator credit: Hut 8's Coinbase and Two Prime and FalconX lines, Riot's Coinbase lines, CleanSpark's lines, Bitdeer's BTC facility. Operator history is structurally irrelevant to them. OUT of route-two analysis.
2. Several "Fluidstack facilities" are landlord-side debt (TeraWulf, Cipher, the Morgan Stanley Indiana deal) where Fluidstack is the tenant and Google the backstop. Reassign or exclude.
3. Purchase agreements and leases mixed in with debt: Boost Run's Dell purchase agreement, IREN's Dell lease. Flag, do not treat as loans. Boost Run "facility 1" is a related-party loan from its own chief executive.
4. Crusoe and Cipher rows came back EMPTY; Nscale rows are thin (no pricing, no collateral). Coverage gaps, not evidence of absence.

## The honest headline: customer credit dominates visible pricing

Two natural experiments isolate it. CoreWeave, same lender group, first half of 2026: the Meta-backed facility prices at benchmark plus 2.25 (rated A3, first investment-grade GPU financing) while the non-investment-grade-customer facility prices at plus 4.50, in the same period, operator history held constant. And CoreWeave's 2024 facility prices plus 6.00 versus plus 13.00 INSIDE ONE FACILITY depending on customer tier. Applied Digital mirrors it: Oracle-leased notes at 6.75 percent four months after CoreWeave-leased notes at 9.25 percent, back up to 7.00 percent when the tenant is CoreWeave again. Where pricing is visible, who pays the operator sets the rate more than whether the operator has delivered before. This quantifies what the post, Choi's box, and the SemiAnalysis matrix already said qualitatively.

## What survives for the thesis

- Same-lender repeat pairs are real and consistently improve: Blackstone and Magnetar across CoreWeave's ladder (8.75 to 9.62, then 6.00 to 6.50, then 4.25); Macquarie three times and Goldman four times at Applied Digital; TeraWulf with Morgan Stanley running 7.75 percent to plus 1.75 across eight months; IREN with NYDIG, third deal 100 basis points inside the first. Lender memory prices within the relationship. The decomposition (how much is memory, how much is customer credit and market period) is NOT done and the confounder columns exist for exactly that.
- The switch case: Hut 8 left Coinbase for FalconX and saved 200 basis points, publicly attributing it to "diversified revenue and operating history." It is a bitcoin margin loan, so the attribution reads as public relations, but it is the only borrower-attributed record-traveled claim in the file.
- First-execution tier corroborated in documents, now ~6 instances: Firmus at benchmark plus 10 to 11 WITH Nomura failing to syndicate the paper (conversion-layer absence caught on tape), CIM at 12 percent with warrants, B. Riley at 9 percent, community banks at 5 to 6.5 percent when the collateral was real estate rather than GPUs.
- Route-around sightings in the wild: USD.AI appears TWICE in SEC filings (Sharon AI $500M, QumulusAI $500M), which feeds the loan-map probe in [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|the USD.AI capture]]; Google backstops appear five times; Dell Financial wrote a 100 percent loan-to-value 24-month GPU lease for IREN (a vendor absorbing residual risk completely); IREN's Microsoft deal pairs a $1.94B customer prepayment with 96 percent capex coverage.

## The one adjustment this makes now

The artifact test's scoreboard reweights: rate movement is likely dominated or contaminated by customer credit, so the primary readouts become ELIGIBILITY (does the record open the door at all) and EQUITY (does the required cushion shrink at the same structure), with rate as secondary. And the operator conversations gain one question: on your last facility, what set the rate, your customer's credit or anything about you?

Everything else deliberately holds until (a) the segmentation above is applied and (b) Friday's pre-committed read, so the lbh is not rewritten mid-week on one unsegmented first pass. Tension noted for the thesis: the lbh's "eligibility or financing terms" clause is increasingly eligibility-weighted.

## Links

- Prompt: [[gpu-repeat-financing-pairs-futuresearch-prompt-2026-07-14|repeat-financing FutureSearch prompt]]
- Data: [[extract_gpu_ai_debt_facility_terms_399a9f39.csv]]
- Related: [[solid-findings-audit-and-next-rung-2026-07-14|solid findings audit and next rung]], [[the-track-record-that-cant-travel|post two]], [[semianalysis-residual-value-is-modeled-not-observed|residual modeled not observed]]
