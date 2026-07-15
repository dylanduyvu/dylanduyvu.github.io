---
type: source
status: captured
created: 2026-07-12
updated: 2026-07-12
source_date: 2026-05
source_type: podcast
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, verification, credit-markets, financialization]
people: [david-choi]
orgs: [usd-ai]
attachments: []
tags: [podcast, usdai, gpu-backed-lending, residual-value, kill-tests, route-around]
---

# David Choi (USD.AI) on Touchcraft: the state of GPU financing

## Context

Touchcraft podcast episode, "The State of GPU Financing, ft David, Founder of USD.AI." Listened 2026-07-12 from an auto-generated transcript. FULL RAW TRANSCRIPT stored 2026-07-15 at [[usdai-david-choi-touchcraft-podcast-gpu-financing-transcript.txt]] (the raw file is the completeness guarantee, this note is the curation). DATING REVISED 2026-07-15 from the raw text: the original early-July placement was the weakest anchor. Stronger internal evidence points months earlier: "the work that we've been doing over the last seven eight months" against the September 2025 public launch puts recording at April-May 2026, and the host places the Burry depreciation Substack "two months ago in January," pointing near March. Best estimate: roughly April-May 2026, so all time-sensitive numbers (7.4 percent staked yield, sub-half utilization, the $96M "next" loan, monthly loan records since January) are roughly two months old at capture, not fresh. The $96M next loan plausibly matches the Duos $98.1M facility later visible in the operator dataset. Speaker pinned via search: DAVID CHOI, co-founder of USD.AI (Permian Labs), ex-Deutsche Bank, background lending against hard-to-price assets; co-founders Conor Moore (ex-DB, structured credit) and Dan (mining infra, DRW FPGA).

CAPTURE GRADE: promotional venue. A founder selling yield to a crypto audience. Numbers are his box and his book, uncorroborated unless marked. Transcript garbles corrected in this note: "50%" starting rate read as 15% (his own stated range is 7-15); "Munich agree and Barker" read as Munich Re (CONFIRMED cross-venue: the DCo episode description independently states Munich Re covers resale shortfall) plus possibly Barkr (UNCONFIRMED, plausible given our Thomas contact there); "ITAZ" read as ITADs; "UC 12" read as UCC Article 12 electronic documents of title.

RELATIONSHIP: this is the firm where Harry ghosted us; the monitoring wish froze at n=1. The founder just answered several of our unasked questions publicly. Re-entry hook available; decision is Dylan's.

## The route-around reading (the honest headline)

USD.AI is a live experiment in making operator history UNNECESSARY rather than portable. Chip-only collateral ("we give loans against chips and chips alone"), lender-held title during the loan, near-100 percent cash-sweep amortization, months of payments in reserve, verification-gated draws, Munich Re residual shortfall cover, 10-day record origination, at exactly the small end our lbh says gets skipped or equity-taxed. If that structure scales into a performing book, the financing gap closes without a record that travels, and the wedge shrinks to whatever structure cannot reach.

CANDIDATE KILL ROUTE THREE, staged for the thesis note: not "would proof move terms" but "does structure make proof unnecessary." Falsification bed is public: their loan map. Track book count, sizes, tier mix, and any defaults and recoveries over time; a performing no-offtake tier is the route-around working in the open.

Held against it, honestly both ways: their box prices identity-blind. The 15-to-10-12 improvement is milestone-driven WITHIN a deal; nothing in the design rewards a second-time operator over a first-timer at origination, so cross-deal history is unpriced even here. And the model leans on NVIDIA secondary liquidity by their own admission (see backstop section), so it may stop at the chip-liquidity boundary. Both readings stay live until the book decides.

## The rate box and intra-deal repricing

His pricing: 7-15 percent by a governance-driven box. Fortune-500-grade offtake gets ~7 at 70 LTV; "no offtake and no rental agreement" gets 15. Mechanism sentence: deals that start at the top rate have never stayed there; "by the time it's installed it's 10 to 12."

Read with discipline: this is INTRA-DEAL milestone repricing, delivery bundled with offtake materializing. It is NOT route-one evidence (prior history moving the next loan's terms). If anything it cuts the other way: lenders can price the delivery event transactionally, fresh, every deal. What it does prove: the installation-plus-offtake milestone is worth roughly 300-500bps to this lender, from the lender's own chair. The milestone is priced; whether its RECORD travels is untouched.

## Residual bundle

- Reinsurance on depreciation risk at ~150bps and falling monthly, per Choi. AN OBSERVED MARKET PRICE FOR RESIDUAL RISK TRANSFER, categorically different from a modeled residual mark. Munich Re confirmed cross-venue; the second name unconfirmed.
- Secondary liquidity monitored through ITADs, "the guys who buy and sell all chips." Same equipment-side seat where American Compute's resale prints live. The observed-residual census grows.
- H100 prices "pumped" against the Burry depreciation take: a third seat on rentals-vs-resale divergence, but PROMOTIONAL DISCOUNT APPLIES; he is talking his book.
- Structure-versus-rhetoric tension, kept deliberately: depreciation risk is called overblown while the firm runs near-total cash sweep and buys reinsurance on exactly that risk. The structure discloses the belief; the rhetoric is marketing.

## Pooling and the missing GPU ABS

No diversified asset-backed market exists across GPUs and customers; a CoreWeave bond "is just a CoreWeave loan," which is why the paper does not trade. His fix is liquidity-side: tokenize the debt instantly (sUSD.AI) instead of the three-year TradFi securitization pipeline. OUR INFERENCE, marked ours: a diversified GPU ABS also needs standardized per-asset delivery and performance records for a servicer to report against. He names the missing hammer; the handle is unnamed.

## Backstop generalization

Google and AMD guarantee rent on their chip deals because no secondary market exists for the silicon; NVIDIA deals skip the guarantee because the chips are liquid. Extends the backstop-bridge insight from an NVIDIA story to a vendor-general rule: GUARANTEES SUBSTITUTE FOR MISSING RESIDUAL MARKETS.

## Corroborations and one sizing

- His no-offtake tier at 15 percent independently corroborates the SemiAnalysis first-execution tier (10-15, heavy equity) from a live book.
- Sixth unprompted compute-futures skeptic: "90% of CME contracts fail... I don't see many organic" hedgers; the tradable thing is the debt rate, not the compute price. Different reasoning from the standardization blocker, same conclusion.
- His sizing of the unfinanceable tier: the financing chicken-and-egg "does remove the last 30%" of NVIDIA sales. Founder estimate, but it is a number where we had none.

## Counterpoints / Uncertainty

- Everything quantitative is founder-sourced on a promotional venue: loan cadence, the 96M next loan, 70-80 percent of chip value cash-generated in year one, the near-100 percent residual bravado. None verified.
- A public critique exists: Pine Analytics on lagging utilization (surfaced in an earlier Edge episode listing). Unread; queue it for the counterpoint file before citing USD.AI numbers anywhere.
- Auto-transcript; corrections above are reads, not certainties.
- The route-around section is the bias check on ourselves: first pass over-mined this for thesis support. This note leads with the hostile reading on purpose.

## Promotions staged, NOT applied

- [[the-nvidia-backstop-is-a-track-record-bridge-not-a-floor|backstop-bridge insight]]: add vendor-general line (Google/AMD rent guarantees where secondary markets are missing).
- [[gpu-financing-needs-forward-strips-for-residual-marks|forward strips insight]]: add the reinsurance price (~150bps, falling) as the first observed price of residual risk transfer, and the ITAD seat.
- [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|verification gap insight]]: add draw-gate verification existing at origination speed (money released only after install verification).
- [[semianalysis-residual-value-is-modeled-not-observed|residual modeled-not-observed insight]]: add that a lender transfers residual risk at an observed reinsurance price rather than holding modeled marks.
- Thesis note: stage KILL ROUTE THREE (structure makes proof unnecessary) next to the existing two. Placement is Dylan's call.

## Open Questions

- Loan-map probe: define the tracking cadence (monthly?) and what counts as the route-around succeeding or failing on their book.
- Harry re-entry: use the episode as the hook, or leave frozen?
- Does their draw verification produce a document the OPERATOR receives and could carry to the next lender? If yes, the liberation thesis has a partner shape, not just a competitor.
- Confirm the reinsurance counterparty set (Barkr in or out?). ANSWERED 2026-07-15: Barkr IN, confirmed by the Connor Moore Messari capture (Barkr fronts the coverage, Munich Re reinsures Barkr, 100-150 basis points a year on loan balance) and consistent with the Choi Decentralised capture's payout mechanics. See [[usdai-connor-moore-messari-fully-diluted-podcast-2026-07-15|Connor capture]].
- Read the Pine Analytics critique.
- Pin the episode date and archive the audio link. PARTIALLY ANSWERED 2026-07-15: dating revised to roughly April-May 2026 from internal evidence (see Context). Audio link still unarchived.

## Links

- Areas: [[gpu-finance|GPU Finance]]
- People: David Choi (no person note yet; create if re-entry fires). Relationship history runs through Harry (ghosted thread, n=1 freeze).
- Orgs: USD.AI / Permian Labs (no org hub yet; create if the loan-map probe becomes a standing item).
- Related Insights: [[the-nvidia-backstop-is-a-track-record-bridge-not-a-floor|backstop bridge]], [[gpu-financing-needs-forward-strips-for-residual-marks|forward strips]], [[semianalysis-residual-value-is-modeled-not-observed|residual modeled not observed]], [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|tenor mismatch]]
