---
type: source
status: active
created: 2026-07-09
updated: 2026-07-09
source_date: 
source_type: call_prep
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, credit-markets, venture-landscape]
people: [zile-cao]
orgs: [blockchain-capital]
attachments: []
tags: [call-prep, venture-capital, gpu-financing, landscape]
---

# Call prep: Zile Cao, Blockchain Capital

30 minutes, booked via the Slate and Blockchain Capital Telegram group. Post-call: capture to a source note, tally any secondhand signal into the outreach log labeled as venture-filtered.

## Him, in four lines

- Research Engineer at Blockchain Capital since June 2024 (Research Scholar Program; UPenn; ex-Solana Foundation). Technical diligence and research, not check-writing.
- Has contributed to Hyperbolic's agent toolkit on GitHub: hands-on with GPU marketplace plumbing.
- His words: "we've talked with companies in various parts of the stack in this category lately." From his seat that likely means he ran or supported the technical diligence.
- Blockchain Capital: crypto-native, 2013, 110+ investments (Coinbase, Kraken, Aave tier), equity and tokens, multi-stage. Whether they have invested in GPU financing: unknown, ask (question 1).

## The 90-second opener

One borrower, three prices: CoreWeave paid roughly 15 percent in 2023, then 4.5 points over the benchmark this May against weaker customers, then 2.25 points over against Meta. The chips did not change; the history did. The mechanism was lender memory: the same lenders watching their own borrower repeat across five facilities. Memory does not travel down-market, where operators switch lenders. A month of asking lenders how they handle unproven operators keeps returning cushions, amortization speed, and sponsor quality. Nobody has described verifying claimed history. The seat that checks whether an operator actually delivered, portably, is empty at every layer.

## Question list, in order

1. You said various parts of the stack. How do you slice it? Where are the pitches concentrated?
2. Which layers have you seen no pitches in at all?
3. When these companies pitch, what lender pain do they claim they solve? Is there anything recurring?
4. Has bcap invested in any of these companies?
5. What has made you pass so far?
6. Have any gone past pitch into real diligence? Where did the stories crack: did claimed lender demand hold up when you checked, or is it mostly build-first? Did the data room get thin anywhere? (His unique knowledge: the verified failure map of the space.)
7. Did you end up talking to lenders yourselves during any of that? What did they tell you? (If yes: compare tallies against the cushion, amortization, sponsor pattern. Independent convergence is the strongest corroboration available. If no: a month of primary lender evidence is something nobody in his pipeline has.)
8. Where do you think the durable business in this stack is?
9. Anyone building lender-facing data or verification? Ratings, delivery records, attestation? (Deliberately late: get his unprompted map before telegraphing the thesis.)
10. Technical read: would you trust a compute index built from marketplace prints? (Silicon Data and Ornn both have exchange partnerships now; his answer is also prep for the Ornn call.)

===

where's the compute supply coming from for these long tail players? how is that getting built out
what are customers doing with 2 week compute rentals?


Must-asks if time compresses: questions 1, 3, and 6.

## On-call insights

The ladder (all public, primary-sourced):
- 2023: $2.3B facility, led by Magnetar and Blackstone, margin ~9.6 points over the benchmark, roughly 15 percent money (proxy filing).
- March 2026: $8.5B against the Meta contract, ~5.9 percent, Moody's A3. Meta itself Aa3, CoreWeave itself Ba3: the structure lifts the deal six notches above its operator, and the remaining three-notch gap to Meta is the priced operator-dependency layer.
- May 2026: $3.1B, Ba2/BB+, benchmark +4.5, TWO non-investment-grade customers, oversubscribed, tightened 50bps in syndication, first publicly syndicated deal of its kind per the company.

Magnetar (No Priors ep. 152, aired Feb 26): early deals were investment-grade only "because the space was so nascent, the operators had no experience"; now blended "because now you have the history." Said ten weeks BEFORE the May deal printed the blend. Also his: "the primary collateral was the contracted cash flows," GPUs second or third; and the next build he wants to finance is distributed inference (small stitched sites, variable demand, no take-or-pay).

SemiAnalysis (the trinity piece, July): riskiest pricing tier literally named "first-execution" (heavy equity, 10-15 percent, 3 years). Execution risk priced at ~1 point on essentially every deal, with no instrument behind it. NVIDIA backstop: ~6-year revenue floors declining $3.68 to $1.04/hr, 40-60 percent share above, contingent book modeled toward ~$175B. First backstop partner sits in ClusterMAX's underperforming band.

Landscape one-liners:
- SemiAnalysis is alone at GPU-cloud ratings plus lender diligence; every neighbor verifies an adjacent layer (Uptime the building, MLPerf the chip, Artificial Analysis the API, independent engineers the power).
- Benchmark seat claimed twice in one week of May: CME x Silicon Data, ICE x Ornn. Both futures suites are per-GPU-model: the market independently chose vintage-scoped contracts.
- Rating agencies verbatim: GPU residual data "insufficient or too volatile to sustain an investment-grade rating."
- Lawyers arriving: Clifford Chance forecasts measurement standards and audit rights becoming bankability requirements; Quinn Emanuel pre-positioning for GPU valuation litigation ("no one agrees on what GPUs are actually worth").
- Three obsolescence curves: dead for frontier training ~18 months; off-contract H100s rebooked at 95 percent of original price for inference; 2017 chips still earn. Residual = lowest workload the chip can still serve times demand at that tier.

Crypto-side hooks he will know: USD.AI (GPU collateral, 80 percent value warranty from an insurer, first-loss), GAIB, Hyperbolic. My frame if it comes up: onchain rails are one distribution channel; the evidence says the customers are boutique equipment and private credit lenders.

Deeper dives if needed mid-call: [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|thesis note]], [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|tenor mismatch]], [[the-nvidia-backstop-is-a-track-record-bridge-not-a-floor|backstop bridge]], [[a-gpu-has-three-obsolescence-curves-not-one|three curves]].

## Outcome (2026-07-10, scored after the call)

Call happened 2026-07-10, Dylan and Jakub with Zile. Full capture: [[zile-cao-blockchain-capital-call-2026-07-10|call notes]].

- Q1 (invested or pipeline): pipeline so far; one documented pass (silicon.net), no portfolio positions mentioned. Filter applied: his thesis answers read as genuine research, not book-talk.
- Q3 (zero-pitch layers): ANSWERED BY OMISSION, the call's headline. His unprompted map of the whole stack never contained a verification or credit layer; his own census puts 10-15 companies above $100M in every category except financialization (~4 players), with the credit stack below it at zero. Scope: crypto pitch-flow only.
- Q6 (diligence-crack): partially. The silicon.net pass is the one worked example, and its pass reasons are the missing-residual-mark thesis making a capital decision.
- Q7 (talked to lenders): no. The prep's if-no branch confirmed: a month of primary lender evidence is something nobody in his pipeline has.
- Q9 (verification builders, direct): ran out of room; moved to the open Telegram channel as a one-line follow-up.
- Unexpected yields: the ~2x tenor premium number; the marketplaces-run-their-own-books correction (now annotated onto the Shkreli console evidence in two insights); fifth-seat heterogeneity convergence; Jasper at Hyperbolic triple-warm (Jakub's prior contact plus Zile's endorsement); Kinjal's market map pending sign-off, nudge in a week.
- Seat calibration confirmed: validation of lender-behavior claims is not available here; do not spend future slots on it. The relationship value runs the other direction.