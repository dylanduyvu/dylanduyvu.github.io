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

## Granular claims ledger (sequential, timestamped, one line per discrete claim; added 2026-07-15, exhaustive by design)

1. (~1:08) "The biggest buildout in human history"; people underestimate facility scale: "a single data center is arguably going to be bigger than all of DeFi put together."
2. (~1:26) "The project Hail Mary of our modern era. But we're not trying to save humanity. We're trying to make AGI and make also a lot of money on the way there."
3. (~1:38) Macro claim: the AI capex boom is why US GDP is positive; "if we didn't have the buildout today, we would be negative for the first time in a very long time in US history."
4. (~1:56) Where the money comes from: "all the money leaving SaaS... leaving SaaS credit. It's going all to AI."
5. (~2:06) Durability claim: it will surprise people how long it lasts, because it is "really productive value" versus SaaS "dashboarding."
6. (~2:34) Capex figures cited: last year's projection $600B, now "$750 or something" billion; bubble-top timing called foolish.
7. (~3:13) NVIDIA sells ~$500B of chips a year, "across five quarters-ish"; roughly 70 percent goes to hyperscalers.
8. (~3:32) Deal sequence: anchor customer first, like a Miami condo presale; customer commitments function as the equity for the buildout.
9. (~3:59) His critique of that model: "it's almost like accounts receivable financing... safe, but incredibly hard to scale," and only the best clients qualify.
10. (~4:11) Ordering: equity organizes first (guaranteed cash flow makes it riskless), debt comes LAST, and offtake is typically required.
11. (~4:29) The chicken-and-egg: "nobody wants to sign a deal unless you already have the chips, but nobody wants to get the chips if you don't have a customer."
12. (~4:42) Only the largest deals get financed; "this really does remove the last 30% of the sales by Nvidia. These people just can't get financing."
13. (~5:00) Hyperscaler bottleneck is ENERGY: a gigawatt equals Denver's annual energy use; you cannot find that, "but you can find small clusters of energy."
14. (~5:19) The asymmetry, verbatim: "small guys can't get financing but they have power," wide availability, diverse, expanding use cases, with inference growing fast.
15. (~5:32) Big-guy financing strain: Meta tapped Blue Owl ("why Blue Owl, why not a bank"), Oracle tapped out; financing is an issue for both ends, power mainly for the biggest.
16. (~6:29) Crypto's fitness claim: "every single AI HPC company at one point really did just do crypto" (CoreWeave, Hut 8); the skill was "scaling large-scale capex with fast depreciation qualities at massive scale."
17. (~6:49) "In a sense AI's growth wouldn't have been possible without ETH and BTC staking or mining."
18. (~7:02) Cisco vendor-financing history: "a drug dealer doing their own drugs," balance-sheet loans to buy its own product, inflating asset prices; "it's going to blow up every time," moral hazard.
19. (~7:13) NVIDIA rebuttal: "Nvidia cannot finance their own deals. It's actually internal policy... They said that three times [on] my customers' calls with them."
20. (~7:31) The preferred-funders list exists BECAUSE they refuse to finance; "every single one of these preferred funders are actually just private credit funds," and private credit is in retreat.
21. (~7:38) The expansion is demand-driven, not supply-side liquidity; buildouts require paying customers.
22. (~7:54) NVIDIA's small LLM investments acknowledged but "it's not that circular as people think"; the real circularity is debt structuring for capital access (Oracle cited).
23. (~8:11) Root diagnosis: "asset-backed financing has never really developed in this sector," and it is "the hammer in your tool set," the tool every trillion-dollar market scaled with.
24. (~8:29) The ABS that exists covers the shell, land, energy, only ~30 percent of a data center's cost; of a $50B gigawatt buildout, $35B is GPUs with no asset-backed market.
25. (~8:55) Housing comparison: the $42T housing market was "created because of the mortgage-backed security industry. You literally can't think of a house without a mortgage... a million dollar house is not expensive, but 10k a month."
26. (~9:15) "A mortgage doesn't exist for GPUs. You can't get a loan against a single chip, only against large deals," which cannot scale a $10T buildout.
27. (~9:27) Precise gap definition: "There is no diversified asset-backed security against a group of GPUs across different customers. It's only against CoreWeave. It's only against Lambda... that's just a CoreWeave loan."
28. (~9:46) Why those bonds don't trade: buying them is just trading CoreWeave exposure, not a diversified loan pool; diversification is what makes debt liquid.
29. (~9:57) Host cites BlackRock's CEO calling for compute-futures-style markets given the growth.
30. (~10:23) Google deals are special: Fluidstack-type structures "selling the TPU-as-backed financing," because "nobody wants to actually finance TPUs for TPU's sake, there's no actual secondary market for TPUs."
31. (~10:40) The Google/AMD backstop, verbatim: "with our company balance sheet, I am your pimp. I am going to guarantee your safety on this deal and you will not default. If it defaults, we'll just guarantee a payout on rent." A Google guarantee, "not Fannie Mae, but one day."
32. (~11:05) Same structure with AMD; different from NVIDIA deals because NVIDIA is "90% of the financing of the chip market" [share claim as spoken].
33. (~11:12) NVIDIA chips need no guarantee: liquid enough to "put them on RunPod and just earn yield... pretty much cash. Not pretty much cash. It's very far from cash, but there's a strong liquidity market around it."
34. (~11:30) Two NVIDIA deal structures: secured against the company ("horrible... if you try to IPO you will get slaughtered... debt to cash flows is like 10x, 20x") versus off-balance-sheet non-recourse against the chip.
35. (~12:00) The mortgage analogy for non-recourse: "it's not against you personally. It's against the house. You just lose the house... at least you don't go into personal bankruptcy."
36. (~12:16) Corporate-guarantee companies "are willing to go into bankruptcy for these loans. Nobody really wants that... it's also just not scalable."
37. (~12:27) The asset-backed problem: once a loan is made the money is stuck, so "you gotta have derivatives for it" (jitoSOL analogy); this is what mortgage-backed securities were; LST-fi naming.
38. (~12:52) The pitch: "Imagine LST-fi but for data centers," pull the money out, borrow against it, use it for liquidity; "it is not actually a five-year loan. It's really one day, you can sell the next day" given volume.
39. (~13:22) TradFi issuance walkthrough: warehouse facility from a bank, 10,000 loans across clients (how auto loans, houses, airplanes batch), tranche it, price it, roadshow to resell because DB or JPM wants the warehouse money back, then add to indices: "This takes a year... three years sometimes for a new asset."
40. (~14:04) "Everyone is always running out of time. The obsolescence doesn't allow you to keep up with this antiquated hundred-year fintech product called Fannie Mae."
41. (~14:17) UCC modernization precedent: electronic documents of title were invented specifically for the auto-loan industry ["UC 12"], "the fastest that we can do it," and it is still too slow here.
42. (~14:30) Figure comparison: Figure does on-chain for efficiency; "he's creating an efficiency. What I'm saying, you're creating an entire market. This market doesn't even exist for GPUs."
43. (~14:48) Stablecoin theory: "a yield-bearing stable is a perpetual instrument... you can refresh the loans for the speed of obsolescence for chips"; "kimchi and ramen... olive oil and bread," the perfect combo.
44. (~15:19) Financing named "right now the limiter of growth for the entirety of the AI sector."
45. (~15:47) Is it a race to capital? "Yes... it is" that simple.
46. (~15:52) The Anthropic example, verbatim: "why does Claude 4.7 suck? Because they don't have enough Blackwells. That's the answer. They don't have enough chips."
47. (~16:06) TPUs "nice, but they take forever to build out"; Anthropic "needed the chips today"; "SpaceX AI is now a neocloud."
48. (~16:51) The real-estate metaphor: landlord owns the office, tenants rent, "the landlord pays Wall Street. Same thing... AI is paying Wall Street."
49. (~17:03) The ranking claim: "the second largest business in AI... The first is Nvidia. The second business is Wall Street, and then it's Anthropic and OpenAI, and Wall Street makes way more money than those two."
50. (~17:18) The numbers: $500B in sales means "you're actually paying 700 billion for 500 billion because of interest, much like a house"; ~$200B in interest; "OpenAI is making 20 billion."
51. (~17:39) "The money is in the chips and the second largest way to make money in chips is being the debt"; ~12 percent a year, amortizing down.
52. (~17:59) Host: didn't OpenAI offer ~14 percent when raising? Choi: "that's cheap, back then... there's a demand for yield. They want to pay money to get that capital."
53. (~18:20) DeFi's yield problem: earning yield requires someone willing to pay for capital; the "where is the yield coming from" critique of circular DeFi: "using money to borrow against money. Oh wow. Real productive."
54. (~18:47) GPU borrowing has a real use (like living in a house); demand comes from the sheer money being pushed into AI.
55. (~18:59) Positioning: DeFi's best move in AI "is that it will become the second largest business and replace Wall Street."
56. (~19:40) When does the debt become concerning: "not until they start doing bad structuring. Right now, it's really good structuring," loans against real cash flows and balance sheets, "not structured as ninja loans... there are AI jobs and there's AI income."
57. (~20:15) TAM restated: "not just GPU sales. It's the replacement of all of SaaS. It's the replacement of all of credit, which is even bigger."
58. (~20:21) SaaS credit autopsy: unsecured corporate loans against 10-year subscription cash-flow history; "private credit is under retreat because you're giving loans against a dashboard that had some stickiness of a moat and that moat is gone."
59. (~20:46) Where the money goes: to AI, to AI tokens; but AI companies are loss-leading with ~90 percent compute cost, "so you can't give a loan against the AI company because it's negative cash flow generating. What you can really give a loan to is just the GPU."
60. (~21:04) Predictions: "elimination of dashboarding... elimination of [SaaS] credit. It's not software eating the world. It's AI replacing all jobs."
61. (~21:20) "GPU-backed financing is not a niche. It is in fact the replacement of all credit in humanity today... the only debt you're going to trade in the future on Bloomberg is going to be just GPU-backed financing," plus some oil components tied to running chips.
62. (~22:02) The factory frame: "the AI token factory... This is the buildout of China... of the oil sector. It is these data centers. And 70% of the data center costs is in GPU."
63. (~22:19) Host comparison from All-In: the US electricity buildout spent ~$250B across five-six years; AI is spending $750B in one year.
64. (~23:02) Product philosophy: "DeFi does really well giving loans against assets. It's very bad at giving loans against companies. It always has been. We don't give any loans to companies... chips and chips alone."
65. (~23:26) Kamino comparison: like lending against SOL, except chips are "not that liquid but generate a lot of cash."
66. (~23:38) CASH-FLOW CLAIM: chips generate "70 to 80% of the entire value of the chip across one year." Their liquidity is the cash flows, not traded volume.
67. (~23:50) They monitor the resale ecosystem via ITADs ["ITAZ"], "the guys who buy and sell all chips."
68. (~24:01) Mission statement: "discover the interest rate of intelligence... by being the interest rate protocol for GPUs."
69. (~24:30) Growth cadence: largest loan every month "since January"; framed as the culmination of "the last seven eight months" since launch.
70. (~24:47) Deals take time: installation periods, unlike basis trades or market-maker loans; an escrow yield system [name garbled, "with trust"] smooths yield in the interim.
71. (~25:05) Another record loan expected "end of this month, might blink by a few weeks, just got installations."
72. (~25:12) The made-to-order chain: financing approved, order sent to Taiwan, manufactured, shipped (France example), installed, verified, then money released.
73. (~25:26) Speed claim: "we are the fastest financing solution in the entire market today, in the entire world."
74. (~25:38) House style, verbatim: "we're very aggressive. We're very rude. We're very impatient and we're very ruthless. But man, you can get a loan really fast. If you don't meet our requirements, yeah, get the [expletive] out... go talk to a private credit fund and try to negotiate. Not with us."
75. (~25:57) The Fannie analogy for strictness: miss one payment, you lose it; intermediaries (JPM, local mortgage brokers) exist to buffer that in housing; "if you go directly to the source... it is a program. It is a machine. It does not have a call center."
76. (~26:25) Debt service reserve asset: minimum months, auto-drawn buffer for missed payments.
77. (~26:37) DSRA yield mechanic: the reserve is minted in [P]USD earning 4.5 percent, "lowering their all-in interest rate by 50 bips, so from 12 to 11 and a half." Bank-like entity behavior.
78. (~27:01) Historical framing: Citibank was born from oil-boom financing; JPMorgan from railroads; "the second largest business in AI that everyone's overlooking is a stable coin, a yield-bearing stable."
79. (~27:24) The list claim repeated with precision: "we're the only startup that's a preferred funder on the Nvidia preferred funder list. Everyone else is a private credit fund," because nobody believed a large debt book could be built with tech; "crypto clearly shows that you can."
80. (~27:51) RECORD LOAN TIME: 10 days, because the equipment was already installed at a US location, bought with the borrower's own capital; "it could have been shorter. He just pushed back on stuff. I'm like, no, this is the terms."
81. (~28:08) The same borrower's second purchase went to escrow (not yet installed): 30-60 days for delivery; once installed in a tier data center, "we technically own the underlying asset... there's a lien" under UCC.
82. (~28:40) Missing metric admitted: they track TVL, not GPU device count; "we should probably add that as a metric."
83. (~29:05) Live screen-share: a world map of loans with statuses ("equipment out for delivery"), one escrowed deal "very close... should be happening this week"; loans in Canada and Europe.
84. (~29:52) ASIA ANNOUNCEMENT teased: "we have an announcement for Asia exposure coming soon... global expansion is happening."
85. (~30:06) Upcoming-loans list was "tidied up" to drop deals too far out; presented as an honest pipeline view.
86. (~30:25) Sizes at recording: max active loan ~$30M; "next one's going to be 96" [$96M; plausibly the Duos facility].
87. (~30:41) Yield claim: "I think I have the most sustainable yield in the entire world," backed by "the largest capital demand humanity has ever seen" and fast-paying assets.
88. (~31:05) Underwriting authority claim: "we've done more deals than a handful of GPs put together," versus a private credit fund doing one deal a year.
89. (~31:25) Crypto's native familiarity: everyone in crypto "kind of gets Bitcoin mining," so these deals read straightforward.
90. (~31:38) Custody thesis restated: a data center is "such a perfect place to transport an asset on chain," second only to gold in a Swiss vault; now with security, insurance, "a fence around it, a rectangular square in the middle of [expletive] nowhere in West Texas."
91. (~32:02) The repo contrast: a defaulted Honda Civic auto loan recovers "less than 5% residual value... for us it's like 100%."
92. (~32:26) NUMBERS AT RECORDING: sUSD.AI ~7.4 percent because utilization is under half, "about to get bumped up"; Pendle futures imply ~10 percent as the market's settling expectation; most loans around 12 percent.
93. (~32:46) THE GOVERNANCE PRICING BOX: range 7 to 15 percent. Amazon or Fortune 500 offtake: 7 percent at 70 percent loan-to-value; 9-10 percent at 80 percent; "no offtake and there's no rental agreement and you're just buying the chips, it's a 15% interest rate."
94. (~33:14) THE 15-TO-10-12 REPRICE, mechanism verbatim: with the Munich Re and Barkr reinsurance they finance the buildout at the high rate, and "by the time it's already getting installed, literally when they start shipping, there's so many customers lined up and they can get the offtake almost instantly... we never actually had a deal where we started at 15% [garbled as 50%] interest rate [where] by the time it's installed it's [not] 10 to 12."
95. (~33:52) Depositor context: DeFi capital sits earning 2-3 percent; agent-driven yield optimization is hunting inefficiencies.
96. (~34:24) Scaling proof claim: "we went from literally 10 to 100 million [TVL] just through these consecutive processes"; "USD.AI is open for business."
97. (~34:51) The core issue is education; the misperception he hates: "they think we're giving unsecured loans to corporations... that is literally what I hate. We are giving asset financing, restructuring the risk correctly."
98. (~35:16) Scale belief: "USD.AI protocol will be able to earn 10% at two billion, at 10 billion"; working with SOLANA and other liquidity partners for depth.
99. (~35:36) Competition framing: "the only competition we really have in terms of yield is frankly STRC," the "three-body problem of MSTR, BTC and STRC."
100. (~36:14) Risk-complexity claim: "technically lower risk than a lot of the vaults because our permutations of risk is so low"; a curator on Resolv juggles 15-20 assets, "on USD.AI you have eight assets, that's it."
101. (~37:08) Product-from-complaint pattern: "every time we get a complaint we create a new product on top."
102. (~37:14) Depositor objection number one is depreciation; answer one: "the most aggressive amortized loan in the market today... pretty much 100% cash sweep. Anytime they make money, they're paying down the debt," and borrowers bet on residual value beating expectations.
103. (~37:29) Answer two, the reinsurance origin story: skeptics were haircutting yield ~5 points for depreciation uncertainty; "let me go price it with someone who actually understands the risks... we end up paying 150 bips, a little less now. Every single month it's getting lower... now it's eight and a half" [all-in, as spoken].
104. (~38:08) The Burry dismissal: "he's just reading GAAP accounting... one of the most [garbled] takes I've seen"; useful life "actually is that length," five to six years; "you've seen with H100s the pricing just pumped because the time it takes to deploy the capital is so difficult."
105. (~38:39) Host dating anchor: Burry's Substack depreciation piece landed ~January and was "proven wrong in just a month or so."
106. (~39:22) Final-form answer: skip the end state; "we just have to talk about what we have to do next. We have to make the debt tradable... liquid"; a renaissance follows the moment capex capital is no longer illiquid, the LSD-revival analogy, including the Three Arrows stETH trade reference.
107. (~40:19) Compute-futures skepticism: "90% of CME contracts fail" on market imbalance; no organic hedger balance yet; term-discount structures in 2-3 year contracts already occupy that role.
108. (~40:54) HIS DERIVATIVE PREDICTION: "interest rate derivatives for compute is exactly what people will want to trade as a form of hedge, much like mortgage rates. You don't trade Airbnb or cap rates in real estate. You hedge mortgage rates."
109. (~41:11) The reasoning: ~90 percent of the capital in a house rides the mortgage rate; "what you really want to trade is the debt, not the revenues, not the cost... the debt drives the equity costs."
110. (~41:36) Closing thesis: "the prime rate of AI needs to be discovered and then you can start doing derivatives, and that's what USD.AI really is. It's the interest rate protocol for intelligence."

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
