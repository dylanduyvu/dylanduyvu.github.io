---
type: source
status: captured
created: 2026-07-15
updated: 2026-07-15
source_date: 2026-06
source_type: podcast_transcript
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, credit-markets, verification, insurance]
people: [david-choi, connor-moore]
orgs: [usd-ai, permian-labs, nvidia, aravolta, munich-re, barkr]
tags: [podcast, usdai, nvidia-list, no-offtake, aravolta, insurance-mechanics, private-credit, capture]
---

# David Choi (USD.AI) on Building GPU Finance Rails: the NVIDIA list, no-offtake pricing, borrower-refused disclosure

## Context

Decentralised.co podcast with David Choi, co-founder of USD.AI (Permian Labs). RECORDED ROUGHLY MID-JUNE 2026 per Dylan ("a month ago"); captured 2026-07-15. Fourth Permian voice-capture in the vault (Harry Page call, Choi Touchcraft, Connor Moore Messari). FULL RAW TRANSCRIPT stored at [[usdai-david-choi-decentralised-podcast-gpu-finance-rails-2026-06-transcript.txt]] (added 2026-07-15 after Dylan flagged granular details missing from the curated layer; the raw file is the completeness guarantee, this note is the curation). Auto-transcript with heavy garble: "David Troy" is Choi, "Flatstone" read as Blackstone, "error volta nodes" read as Aravolta, "A6" read as ASICs, "core we" read as CoreWeave. Single-source founder claims throughout; capture-grade, not assertion-grade.

## Granular claims ledger (sequential, timestamped, one line per discrete claim; added 2026-07-15, exhaustive by design)

1. (~0:00) NVIDIA reached out to USD.AI directly: "We heard you finance chips. You're going to be on the list."
2. (~0:06) The list includes Blackstone ["Flatstone"], BlackRock, Upper 90, and "many of the active funds in the space"; USD.AI is "the only guys... not a private equity, not a private credit fund on the list."
3. (~0:19) Self-framing: "We really are trying to become the Fannie Mae but for GPUs."
4. (~0:26) Macro claim: "Every dollar in the US being printed is subsidizing AI indirectly because it has to, otherwise the dollar is gone."
5. (~0:32) Last year's AI capex exceeded all US project capex, "highways to oil refineries, in the last 10 years combined," done in a single year.
6. (~0:44) Credit logic in one line: "You can't give a loan to an AI company... you're giving a loan against the GPUs because that's the only thing that's hard and that's physical."
7. (~1:00) Ten-year vision: every AI company will eventually own a chip; the traded market becomes GPU loans, not corporate credit.
8. (~1:39) Background: first job financing artwork (Warhols, Frank Stellas) at an Upper East Side gallery.
9. (~1:52) Deutsche Bank: exotic assets, real estate gaming lodging leisure, large casinos to timeshares; career theme "illiquid assets."
10. (~2:04) Crypto entry: MEV as "an interesting bearer asset," ICOs 2017-2018, honestly "just trying to make money."
11. (~2:38) Meta Street origins: DeFi for assets without an oracle price.
12. (~3:09) Finance aphorism: "the more you know the price of something the less money you make... it's perfect information"; art fairs made pricing clear and dealers earned less.
13. (~3:39) Thesis constant across pivots: finance productive-but-illiquid assets (NFTs, Tesla chargers, GPUs).
14. (~3:53) Origin story: farming Bittensor, realized they were paying roughly 100 percent of chip value in rent per year at peak, so "I should just buy the chip."
15. (~4:27) Bought a $300K H100 server and could not get a loan against it: "like buying a house and Airbnbing it... and there's no market for liquidity."
16. (~4:48) Inbound demand followed: AI companies seeking liquidity because "there really was no loan book for individual chips," only against companies.
17. (~5:18) 13 asset-selection "mini pivots" (he later reframes as 13 iterations); the thesis never changed.
18. (~5:37) Margin-versus-loans taxonomy: margin is money markets (liquid things); "a tractor is not money but bitcoin is."
19. (~5:58) Anti-restaking take: Bitcoin and ETH are currencies being retrofitted for productivity (EigenLayer, ETH staking) and "it's never going to be that productive."
20. (~6:22) NFT lending lesson: floors but no bid-ask spread, "an ask market, an incomplete one."
21. (~6:45) Product conclusion: you must create a derivative, the LST-fi pattern; early product had tranches, including something called "infinite tranche maker."
22. (~7:18) Ambition framing: "compressing the entire securitization sector into a single click... decentralizing the investment bank," governed by token holders.
23. (~7:49) Asset scoring: NFTs generate no income (Axie's on-chain labor was interesting but failed); art generates no cash, so best case is low-LTV short-duration rollover loans.
24. (~8:07) History lesson: balloon loans of the 1920s, rolled five-year house loans, banks recalled them in the Depression, hence Fannie Mae and tradable debt; "let's not hold it on the balance sheet because it sucks. You're holding the punk loan."
25. (~8:35) Tesla chargers failed on debt-service coverage for yield farmers' liquidity needs; "nobody could actually destroy them" was the plus.
26. (~9:06) Watch lending was one of their most successful products: 20 percent yield, high borrow demand, "but nobody wanted [to] deposit." Lesson: "it does matter what collateral you use"; deposit demand follows the collateral's story.
27. (~9:53) Product philosophy: financial instruments are not just an APR; collateral, position, and mechanics determine product-market fit.
28. (~10:22) DSCR explained via mortgage math: million-dollar house across 100 months, ~$10K a month plus interest; cash flows must exceed payments.
29. (~11:09) Longer duration lowers required cash flow; they back-calculate the most aggressive terms that keep coverage positive, which is how rate and amortization are derived.
30. (~11:38) Governance forums launching "pretty soon" to publish the underwriting math.
31. (~11:44) Debt service reserve asset: minimum three months of prepayment, drawn down automatically, "like your checking account and a credit card."
32. (~12:12) DeFi's yield critique: nothing in DeFi generates real cash flows from an asset perspective; ETH staking ~2 percent; restaking's actual use was "cat money... 99% of the use cases."
33. (~12:52) Fixed-income litmus test: an economy is real when people pay 7 percent FLAT (not floating) because they reliably net more; fixed-income demand signals a stabilizing productive economy.
34. (~13:36) Co-founder Ivan: worked at 21.co, saw the first US Bitcoin-mining blowup; "Lily from Solana" [Lily Liu] restructured it and fire-sold the ASICs ("not GPUs, ASICs... brand new back then... fire selling that requires a lot of talent"); Ivan then did TPUs and other chips at DRW doing high-frequency trading.
35. (~14:27) Co-founder Connor: private equity background, "wants to make sure a business is actually created."
36. (~14:39) Choi self-description: novelty-driven, "I don't think trade-offs exist. I think abundance can be created."
37. (~14:53) Bitcoin mining rejected as "a step backwards": 100 percent exposure to a single asset price; NYDIG exists to hedge that; not a productive end market.
38. (~15:07) Historical credit: "without Bitcoin mining really AI today wouldn't exist as a sector"; the energy buildout and CoreWeave-style transitions came from mining; "every single Bitcoin miner is moving over to AI HPC."
39. (~16:33) Liquidity math party trick: Bitcoin market cap divided by daily volume ≈ 25x (whole cap turns over in ~25 days); real estate ≈ 2,000 years; real estate holds value because it is productive, priced on cash flows not liquidity.
40. (~17:22) GPUs scored on his grid: shy cash-flow generating [transcript garble, likely "high"], very productive, and fairly liquid because demand is high and watched.
41. (~18:24) Fiber-optics history lesson: Cisco ("named for San Francisco") did vendor financing, "a drug dealer doing their own drugs," loans from its balance sheet to buy its own products; asset prices inflated; "blew up very quick"; moral hazard.
42. (~19:18) NVIDIA contrast: accused of the same but "Nvidia doesn't finance their own chips ever. There's actually a huge internal policy"; they may rile up interest on big sales but route financing to the list.
43. (~20:17) The list's meaning: NVIDIA says "if you want a loan for your chips, you have to find somebody who's willing to take the risk, the debt, and the equity. And it's not going to be us." Therefore capex is end-user-demand-driven, not vendor-inflated.
44. (~20:40) Financing precondition: "You can't finance the chips unless you have a tenant... you're not going to get an office loan unless you know it's going to get filled"; law firms versus WeWorks as tenant quality.
45. (~21:00) A hyperscaler five-year guaranteed contract makes buildout money easy: "I'll build it out the next day. I just need the money."
46. (~21:15) Big-guy financing anecdotes: Oracle nearly tapped out; Meta went to Blue Owl, "which is weird, right? Usually you go to a massive fund," read as people hunting different market pockets for money.
47. (~21:40) "If you're small, good luck. You're not going to get any money. You have to sponsor that with your own cash or a friendly loan... cracks of this market starting to appear. People are doing side missions to get money."
48. (~21:53) Why banks refuse GPUs: "the debt's not tradable." A CoreWeave loan against its own GPUs and clients "is not an asset security anymore. It's a CoreWeave flow," not 10,000 diversified assets with default probabilities; bilateral lending is "what, do I trust you?"
49. (~22:59) Capex is demand-driven, not supply-side liquidity injection; even Claude [Anthropic] remains "significantly compute restrained" despite the [SpaceX/]XAI arrangement.
50. (~23:25) Salary-versus-compute math: a $100M researcher is "a tenth of the cost related to compute... my compute bill is in the tens and hundreds of billions," so paying for marginal compute-bill optimization is trivial.
51. (~24:27) Scale metaphor: the Las Vegas Sphere cost $2-3B; "a gigawatt is like 15 of these Las Vegas spheres in terms of financing costs. And we're building like 50 of these."
52. (~25:04) Against the shorts: "people are so short into this market... imagine the world going back from AI. It's not going to happen."
53. (~25:29) Permanent constraint claim: "I think we will always be compute restrained"; unlike blockspace, capacity will not become infinitely available; bottlenecks are energy, supply chains, financing.
54. (~25:57) Model-quality-is-compute claim, with the Anthropic example: hoppers-to-Blackwells made models "insane"; [Mythos] is strong "because it's run on Blackwells."
55. (~26:16) Obsolescence is why USD.AI exists: an instrument that accommodates how fast chips obsolete; even efficient models require chip REPLACEMENT, "which means you have to create a debt instrument for that replacement cost."
56. (~26:50) Market-share mechanism: "the massive move from Claude to OpenAI... wasn't because of model quality. It's because of compute access"; OpenAI spent to scale compute, "it's why people are using Codex."
57. (~27:31) Willingness-to-pay logic: if the next guy pays 10x for compute and gets a 30 percent better model, customers pay 10x "every time. You don't want the cheap model... you want the best."
58. (~28:04) Model-regression explanation: versions that seem worse than predecessors are supply-constraint artifacts; "a lot of the models aren't even trained on the Blackwells because there's not enough Blackwells out there installed even though it's been announced for two years."
59. (~28:45) China-export read: the US allowing H200 sales to China signals how steep the frontier gap is; "who cares about the hoppers now we got the Blackwells"; Vera Rubin and Feynman next.
60. (~29:11) Jensen's "five-layer cake": energy, chips, infra, models, apps; chips are the hardest layer BECAUSE no debt financing market exists for them.
61. (~29:33) Sarah Friar [OpenAI CFO] quoted on the easy layers: "energy, the land, the shell, it's easy... like 30-year mortgages."
62. (~29:40) Cost split: chips are 70 percent of a data center; a $50B gigawatt buildout is $35B of GPUs, and that piece has no asset-backed market.
63. (~29:52) Market size: $500B of GPU sales per year ("every five quarters-ish"), accelerating; total spend at least $5T over the next few years, "probably closer to 10 trillion."
64. (~30:18) TAM logic: AI replaces every SaaS; "the entire Silicon Valley is being replaced by itself"; capex is "a drip in the bucket versus the effect."
65. (~30:42) Historical comparison: more spend than China's buildout; largest US spend since roughly World War II, which "was really existential threat," and AI is framed the same: "if we lose AI there is no sovereignty of the US anymore."
66. (~31:25) Securitization timing math: ABS setup time is too long versus asset half-life "like 1.5" years; worst case ~3 years.
67. (~31:41) Market settling view: "the market is settling to like a six year useful life"; chips arrive faster than installation keeps up, so "it just takes longer and longer to get installed."
68. (~32:00) Rental-ratio shape: dips then "comes back up because the Blackwells are just not getting installed," an energy-driven installation lag.
69. (~32:24) Energy asymmetry: gigawatts are near-impossible (Denver, "80 miles across"), "whereas smaller megawatt all over the US, it's very easy. You can always find five megawatts here or there, but you can't get financing... I'd rather just do the convertible with Core[Weave]."
70. (~33:18) Why ABS matters: "every trillion dollar market has this market... it's the hammer that you use in the tool set"; airplanes, houses, auto loans all have one; GPUs do not.
71. (~33:51) Headline reading: "Oracle's max leverage," "private credit's in retreat," tough financing, insufficient chip supply, all one connected scale problem.
72. (~34:22) Crypto analogy: ETH staking without stETH would be illiquid ("very good for the ETH price" joke); USD.AI is "wrapped staking but for data centers."
73. (~34:49) Tradability improves credit supply: a lender deposits when they can sell, trade, or borrow against the position instead of being stuck three years.
74. (~35:12) Private credit's structural limit: after lending, "they're not doing anything else. They're just monitoring it," so they must raise a new LP fund before the next loan; tradable debt lets leverage recycle deal to deal.
75. (~35:52) Speed contrast: traditional issuance to indices takes a year, "three years sometimes for a new asset"; in DeFi it is instant at creation, "a single multicall."
76. (~36:24) Stablecoin theory: "a stable coin is a perpetual debt instrument... a continuous debt yielding instrument where you can refresh and replenish the liquidity instantaneously."
77. (~36:43) No warehouse facility needed: issuance is asynchronous, not synchronous; "the fastest horse for the fastest spend in the world"; "you need the speed of DeFi to accommodate the speed of AI."
78. (~37:10) Mechanics: the moment a loan is created it is added to the instrument (sUSD.AI).
79. (~37:22) Their stablecoin's rate mechanic: "the more people use it, the lower your interest rate is," versus Tether keeping the spread; USDC framed as "a tokenized money market fund."
80. (~37:35) Commerce aside: e-commerce agent startups are "completely poorly designed and all the startup money is going to go to zero because they're ignoring the most important thing... everything's paying for compute."
81. (~38:12) Position claim: "if you can solve this problem well you become the reference, everyone looks at you for liquidity."
82. (~38:18) FIRST SECONDARY DEAL: "we're doing our first deal right now where there's an existing loan and they can sell it into the [protocol] for liquidity," loan trading beginning.
83. (~38:38) Role summary: "we're the ones that structure liquidity for the loans."
84. (~39:07) Draw discipline: money only moves once chips are verified installed; "we don't actually give a loan until they're installed... Nobody does this. Nobody does it pre-release. That's ridiculous unless it's against a corporate guarantee."
85. (~39:38) Operator-blindness verbatim: "We only give financing against the [chips], not against a company. The company could be Allbirds... I actually don't care what they do. I care about the chip."
86. (~39:51) Chicken-and-egg inversion: "it's actually way easier to get a contract if the chips are already installed. Ironically."
87. (~40:00) Aave analogy: "much like [Aave] doesn't care about your FICO score. They care about your ETH... and then they can take it."
88. (~40:13) Architecture: a permissionless DeFi engine that only ingests loan types dictated by governance, "perfectly clean assets" only.
89. (~40:33) Verification menu: for sensitive clients, video cameras in the data center verified by a tier-4 operator; otherwise "Aravolta nodes" ["error volta"] plugged into the GPUs verifying presence and utilization.
90. (~41:00) Disclosure limit, verbatim: "We don't actually reveal all the information for now because our borrowers don't want to reveal that. But you get to know that it's always working."
91. (~41:10) Legal stack: UCC liens (US); "the most important thing is that these borrowers don't actually own the chips during the loan."
92. (~41:28) Theft insurance exists for the exotic case where someone defeats data-center security and contracts.
93. (~41:47) Recovery confidence: "can we take the chips and fire sell them? Yes."
94. (~41:52) Product evolution: the on-chain auction from the first iteration was REMOVED "literally 3-4 months ago."
95. (~42:04) Loss insurance mechanics: chips must sell on an approved platform; an IT asset disposition firm quotes; if under "95 cents to the dollar of our expected loss value... Munich Re pays out the delta. It's a back-to-back insurance policy."
96. (~42:39) Underwriting summary: verify presence, verify installation, verify cash generation (post-installation means cash), plus debt service reserve assets covering months of payments.
97. (~43:07) Self-described moat: "horizontally specialized," knowing DeFi, AI, and the structuring bridge between; "somebody has to do the dirty work... create the liquidity engine."
98. (~43:59) Default path: contract breaches trigger payouts "almost like legal finance" when an offtake guarantee exists; otherwise lien and repossession, and "the data center knows... you literally can't [remove it] by contract."
99. (~44:11) NO-OFFTAKE TIER EXISTS: "the riskiest deal... no rental agreement... purely spec on RunPod or something. It's the highest interest rate," with a wider debt service reserve so 80 percent LTV is effectively "68 to 60 percent."
100. (~45:01) Data centers described: "rectangular metallic boxes with a fence around it," tiered (uptime differentiates, security similar), own insurance at tier 3-4; "5,000 data centers at least in the US."
101. (~45:25) Tokenization thesis: data centers are "almost the perfect way to transport something on chain," the closest thing to a Swiss gold vault; "if it's a pseudo promise... no trust."
102. (~45:56) Escrow float monetized: "the end customer has to pay for escrow... you have to pay us for even locking up that capital for you before the release."
103. (~46:21) Meat-space anecdote: "in one deal the truck literally crashed with the chips"; releasing money pre-installation would have burned the reserve before revenue existed, hence the rule.
104. (~47:01) Design method: "a lot of what-could-go-wrong simulation."
105. (~47:42) Physical-digital bridge framing: US data centers as "free ports," the Swiss-vault equivalent; they never lend against assets in people's houses, only extremely secure third-party locations.
106. (~48:31) Residual confidence: GPU "resids" are "one of the best in the world, even better than real estate," because houses have squatters; "watch a video of a guy trying to repo a car from Harlem... you're going to get shot"; recovery here "almost 100%... we designed it so we can take it back."
107. (~49:36) Client definition: "we're financing the landlord... not the tenants," the infra providers between NVIDIA/energy and the model companies; started small, "getting larger clients."
108. (~50:04) EVERYONE WANTS TO LANDLORD: "pretty much every AI company we talked to, if they last long enough, they will buy chips"; LLM companies and rental platforms both say it.
109. (~50:40) The pitch that converts: "what about a mortgage? What if you get a mortgage for your chips instead of paying rent? Pay effectively the same thing."
110. (~50:55) TAM expansion: "not just NeoClouds, but really every AI company in the world"; Claude and OpenAI building data centers because "the economics are in the chips"; XAI "kind of a neocloud now."
111. (~51:25) Cost structure: compute is ~90 percent of an AI company's costs; "everything is paying down GPUs and GPU debt."
112. (~51:46) Truth Terminal joke made serious: an AGI's first act would be subsidizing GPU financing, then energy, then "whatever it takes to live forever."
113. (~52:20) Microsoft-OpenAI detail: the $10B investment "wasn't $10 billion of cash. It was actually nine billion in Azure credits."
114. (~52:53) OpenAI spend charts: "it's just compute and compute-related services"; compute is "the blood of the entire sector."
115. (~53:26) Rent-versus-own line: "instead of paying three times the cost of a house that I'm renting, why not just buy the house? Well, the answer is you can't get a loan unless it's a novice building" [garble, likely "an office building"].
116. (~53:39) Deal size range: financings from RTX 6000s at ~$100K "all the way to $300 million. To us it's like the same process because we only care about the chip. Nobody else in the market thinks like this."
117. (~54:00) Big-fund constraint from their side: "we're a large company, we only have 10 analysts. I can only give loans of minimum $500 mill... otherwise get out, door's that way."
118. (~54:15) Small-lender exit: "the smaller guys don't give financings anymore... is it really worth the effort of all the legal fees to do a single $10 million loan?"
119. (~54:26) Unit-economics claim: boilerplate per-loan scalability "is done through blockchains," Figure doing it for HELOCs as precedent; "why don't we just do it for the largest buildout in human history."
120. (~54:44) Anti-tokenized-real-estate take (citing Mike [Cagney]): real estate already has "the best capital markets in the world. Do you really need to bring it on chain? No, you need to bring something on chain that really needs it."
121. (~55:31) Full ABS walkthrough: warehouse facility (a billion from a bank; "that's actually what Figure really is, same with USD.AI... sitting capital is just somewhere in T-bills, or PUSD which gets 4.5% for us"), 10,000 loans, tranche and price, roadshow to 10,000 buyers, repay Deutsche's warehouse, then make it liquid; "this entire process can take up to three years."
122. (~57:20) Why banks tolerate that: a 30-year asset life makes 3-year setup fine ("I'm going to go on my summer vacation"); works for 10-year auto loans only because UCC [Article 12] created electronic documents of title, "the fastest that we can do it."
123. (~57:51) Private-credit vulture passage: "they're going to screw you in covenants... the interest rate you'll have to pay ends up going to 25%. All in... 'it's only 10%.' But then there's a fair market value buyout at the very end of the loan... 'it's a two-year lease.' I thought I signed a loan... they're not your friends. They never are."
124. (~58:38) Bank-model contrast: the debt-instrumentation business is about AUM, size, scale, selling a yield product to end users, "not trying to ink every fast return," which is USD.AI's stated posture.
125. (~59:00) Structure choice restated: Munich Re reinsurance instead of "a first loss [fund] operator [scalping] every return possible with a convertible debt on USD.AI."
126. (~59:12) The missing-hammer lament: "this is the largest buildout in history and you tell me we don't have the main hammer... we're literally using toothpicks... alternative assets like the back of a coffee cup."
127. (~59:54) Revenue model: origination fee plus a net interest margin of 10 percent on protocol interest; fee switch already ON; "most of the money we make is actually not from DeFi users, it's from AI companies that are willing to pay"; comps: Maple's OI and NIM.
128. (~1:01:02) Anti-buyback philosophy: buybacks are "some sacrificial ritual to demonstrate that you believe in this token god... this isn't how you build a trillion dollar company"; Amazon's no-dividend growth cited; governance can choose buybacks but growth goes linear.
129. (~1:01:56) Token utility design constraints: demonstrating that CHIP ownership represents something "without breaking the Howey test"; exploring a sponsorship model with "a benevolent actor," the Consensys-to-Ethereum analogy ("did better work than the Ethereum Foundation").
130. (~1:02:44) No utility announcement yet because lawyers are reviewing "the very frontier of what is possible with tokenomics."
131. (~1:03:03) Tokenomics history read: Curve was great but not final; the market moved from vote-escrow toward staking models, "a better more attractive way to get institutional capital"; "there's the theory true... and then there's actually realistic true."
132. (~1:03:38) "We're going to do something better than buybacks" as a proposal coming soon; interesting institutional use cases land "once the deals get signed and done," then "direct exposure to the AI ecosystem... a debt play and there will also be an equity play."
133. (~1:04:56) On resurrecting DATs: they existed as lazy 5-percent-of-network buyers; he thinks an equity vehicle could attract institutions and generate cash flows beyond buybacks; "what STRC was trying to do is interesting."
134. (~1:06:02) Token-versus-equity view: "tokenizing equity doesn't really do much"; tokens are superior for protocol engagement because "a protocol is not a company... it's a smart contract that we are unified by"; a16z network-value framing endorsed; "we've been in the discovery phase for 10 years for tokens."
135. (~1:07:16) Interviewer's structural point conceded: protocols did well while tokens stalled; Choi answers with the early-tech-companies analogy (users first, monetization switch later) and "growth is the best driver... it's one of belief structures."
136. (~1:08:13) "Value accrual is a word that people use without really digesting"; no value accrual to Amazon equity, no dividends, "we still believe in it"; dividend payers worth less than non-payers.
137. (~1:09:22) Examples he will name when pressed: Sky's new entity structure ("cleanly structured"), locked-token instruments into entities, Hyperliquid-style entities; "in terms of token-on-token pure play, I haven't seen much."
138. (~1:09:54) His actual token-value theory: PRIORITIZATION FEES drive accrual (Solana's push, exchange staking tiers like HYPE and BNB, "you're really paying for a maker-taker prioritization fee").
139. (~1:10:39) Planned mechanic: "if you want to redeem in our protocol you have to stake CHIP," one concept being explored; no redemption-queue pressure yet so it is not a revenue source yet.
140. (~1:11:15) Token roadmap as three products: an equity vehicle, clear demonstration of where cash flows go, and new protocol functions people will pay for.
141. (~1:11:44) Startup framing: "there's two hard problems at a startup: how do you make money and how do you share it"; he personally owns 5 percent of the network, "there's still 95% that needs to be aligned."
142. (~1:12:11) TAM answer: "the entirety of credit... especially SaaS credit as a first stop."
143. (~1:12:26) Private credit's "$3 trillion blow up right now" attributed to software: subscription cash flows were underwritable for 10-30 year loans, "then AI was introduced... we're just one prompt away from your cash flow is going to zero."
144. (~1:13:04) "SaaS apocalypse" coinage; SaaS credit "like bidding altcoins on the way down"; credit is worse than equity here: "the only upside is their yield, but there's infinite downside."
145. (~1:13:37) Who eats the cash flow: AI companies, but they are loss-leading at 90 percent compute cost, so "you can't give a loan against the AI company because it's negative cash flow generating. What you can really give a loan to is just the GPU."
146. (~1:14:24) Theory-of-the-firm claim: unsecured corporate lending dies because "the theory of the firm is being questioned with AI... you're one prompt away"; the only loanable thing in the stack is the GPU.
147. (~1:15:02) "GPU-backed financing is not a niche sector. It's a replacement of all SaaS credit, of all credit in every single sector, eventually... the entirety of print."
148. (~1:15:19) The Dario [Amodei] job-replacement fear inverted: "if it does, well, you're not financing humans anymore. You're financing AI," and AI is financed through its number-one cost, token generation, which is GPU financing; "the interest rate of intelligence is really the replacement of all credit."
149. (~1:15:42) Short-term TAM: "about 20% of Nvidia sales of small financings... my next three years. It's about 100 billion every year" (corrected from "100 million" in-conversation).
150. (~1:16:07) Failure modes, his own list: losing either borrowers or depositors; borrowers are clearly abundant; depositor risk sits in liquidity-mechanism design.
151. (~1:16:39) His Grayscale scar: "I was in a Grayscale trade myself... you can't get BTC for your GBTC. No, in fact you can't. You have to wait for an ETF"; they studied "pretty much every single [collateralized] stable coin blow up."
152. (~1:17:13) Honest risk framing: "you can't get riskless 10% yield. I'm not Terra"; trade-offs improve with new instruments, partners, derivatives.
153. (~1:17:30) Existential risk he names: "losing control of how those derivatives are priced and represented," plus the reinsurance ceiling: "[Munich Re] can't reinsure the loans that we did because they couldn't cover the 200-300 billion dollars on their balance sheet."
154. (~1:17:56) Macro exposure acknowledged but discounted: "if AI comes down, maybe this AI thing was all for [naught]... I really don't think it's [likely]."
155. (~1:18:12) Near-term roadmap: governance launching soon, more loans, more TVL; "once you run out of cash then find more money."
156. (~1:18:43) Long-term objective: "a stable coin is one of the biggest businesses you can create in the AI sector... every single dollar in the space is settled [in the] coin"; agentic commerce as the follow-on conversation.
157. (~1:19:15) Closing line: "once you have an interest rate of intelligence you can create a central bank."

## New against the vault, ranked

### 1. The NVIDIA referral list, and NVIDIA's no-self-financing policy

Verbatim: "Nvidia reached out to us. They're like, 'We heard you finance chips. You're going to be on the list.' There's Flatstone [Blackstone], there's BlackRock... there's Upper 90... many of the active funds in the space, and then there's a startup called USDA. We're the only guys... that is not a private equity, not a private credit fund on the list." And: "Nvidia doesn't finance their own chips ever. There's actually a huge internal policy... they say if you want a loan for your chips, you have to find somebody who's willing to take the risk... and it's not going to be us."

Reading: two market-structure claims in one. NVIDIA maintains a financing-provider referral list it points chip buyers toward (a distribution channel nobody else has surfaced), and it has an internal never-finance-own-chips policy, his rebuttal to Cisco-style vendor-financing accusations (his own history lesson: Cisco as "a drug dealer doing their own drugs"). TENSION WITH VAULT, flagged not resolved: the NVIDIA backstop notes ([[nvidia-ai-compute-partnership-backstop-2026-07-05|backstop capture]], [[semianalysis-nvidia-backstop-trinity-2026-07-06|backstop trinity]]) document NVIDIA guaranteeing others' deals; guaranteeing is not direct financing, so the claims are reconcilable, but the boundary between backstop and finance is exactly where that reconciliation lives. Also connects to Thomas's 2026-07-01 line that a lender NVIDIA works with asked whether an operator-performance product existed: NVIDIA sits adjacent to lender-product conversations in two independent captures now.

### 2. No-offtake merchant deals get PRICED, not declined

Verbatim: "Say it's like the riskiest deal... it's called a no offtake, which is no rental agreement. It's just purely like they're just going to do it spec on like RunPod or something. It's the highest interest rate. But we also have a wider debt service reserve asset... So 80% LTV is really like a 68 to like 60% LTV because they're paying at least that much in the [debt] service [reserve] asset."

Reading: the sharpest tier-map addition of the capture. The exact profile Phil's tier auto-declines (no investment-grade offtake, spec build) is a live product tier at USD.AI: priced at the top of their range with a wider reserve, effective loan-to-value cut by the reserve requirement. At the mega tier the missing wrapper kills the deal; at the route-around it moves the price and the cushion. Promoted into the end-of-day tier map in the audit note. Also new precision: nominal versus effective loan-to-value (80 nominal, roughly 60-68 effective), and the debt service reserve asset as roughly 3 months of prepayment, auto-drawn like "your checking account and a credit card."

### 3. Borrowers refuse utilization disclosure; Aravolta named by the founder

Verbatim: "these new boxes we call them [Aravolta] nodes that plug into the GPUs directly and verify that they're there and then you guys can see all the utilization and everything like that. We don't actually reveal all the information for now because our borrowers don't want to reveal that. But you get to know that it's always working." Also: video cameras verified by a tier-4 data center company as the alternative verification for sensitive clients.

Reading: hardens the Aravolta org note's boundary from the demand side. The tenant-blindness is not only the vendor protecting its installed base; the BORROWERS demand it. For any future record product, operator consent to disclosure is a gating constraint confirmed at the founder's mouth. Utilization data exists inside the loans and is deliberately withheld.

### 4. Recovery and insurance mechanics, more precise than the Connor capture

- Title: "these borrowers don't actually own the chips during the loan." UCC lien; the data center knows the equipment is under loan and "you literally can't [remove it] by contract."
- Theft insurance exists on top.
- Fire-sale path: approved platforms only, an IT asset disposition firm quotes a price, and "if it's underneath 95 cents to the dollar of our expected loss value, Munich Re pays out the delta. It's a back-to-back insurance policy."
- The onchain auction from the first product iteration was REMOVED ("literally 3 months 4 months ago").
- Escrow float is charged to the end customer ("you have to pay us for even locking up that capital for you before the release"), and the crashed-truck anecdote as the reason money releases only on installation.
- Munich Re scaling limit acknowledged: they "couldn't cover the 200-300 billion dollars on their balance sheet"; reinsurance capacity is a named constraint on the model's ceiling.

### 5. Private-credit borrower-experience vocabulary (interview ammo for the operator wave)

Verbatim: "Private credit fund is vultures... They're going to screw you in covenants... the interest rate you'll have to pay [ends up at] 25% all in... they're like, 'Yeah, it's only 10%.' But then there's a fair market value buyout at the very end of the loan... I thought I signed a loan [and it was a lease]."

Reading: two named traps to probe in this week's Pool A conversations: all-in effective cost versus headline rate (covenants, warrants, fees), and end-of-term fair-market-value buyouts that convert loans into leases. Operators' answers to "what was your all-in cost" and "was there a buyout at the end" will beat rate quotes as evidence.

### 6. Tradability as his causal frame for bank absence, and the flywheel starting

Verbatim: "a bank won't give a loan against GPU... the reason being is that the debt's not tradable... if CoreWeave issues their own loan against their own GPUs with their own clients it's not an asset security anymore. It's a CoreWeave flow." Plus the full asset-backed-securities process walkthrough (warehouse facility, 10,000 loans, tranche, roadshow, up to three years) matching Connor's Macquarie datapoint, and: "We're doing our first deal right now where there's an existing loan and they can sell it into the [protocol] for liquidity," secondary loan purchases beginning. "We really are trying to become the Fannie Mae but for GPUs."

Reading: a third causal frame for why traditional lenders sit out, alongside Bernie's (lenders diligence financials) and Phil's (offtake and duration): no securitization means no diversified probability-of-default underwriting, so every loan is a bilateral trust question. Three frames, three seats, not mutually exclusive; hold all three.

### 7. Origin story, co-founders, and the deposit-side collateral lesson

- Origin: farming Bittensor, paying roughly 100 percent of chip value in annual rent, so they bought a $300K H100 server and "I couldn't get a loan against it." The founding observation is the small-operator gap experienced personally.
- Third co-founder mapped: Ivan, ex-21.co (saw the first US Bitcoin-mining blowup and the ASIC fire-sale), then TPUs and chips at DRW doing high-frequency trading. Connor private equity, Choi novelty. 13 asset-selection iterations (NFTs, art, Tesla chargers, watches) before GPUs.
- Watch lending lesson, verbatim: "I'm earning 20% on watch lending... but nobody wanted [to] deposit." Deposit demand depends on the collateral's story, not just the yield: "it does matter what collateral you use." GPUs cleared the bar; watches did not.

### 8. Corroborations without novelty

- Rental rates flat-to-up WITH a mechanism this time: Blackwell installation lag ("the rental ratio [dips] but... comes back up because the Blackwells are just not getting installed"). Third seat on flat-to-up (Connor ~Feb, Phil July 14, Choi ~June), now with a supply-side explanation.
- Useful life "settling to like a six year" (consistent with Connor's five to seven); worst-case half-life framing of ~1.5 years.
- "If you're small, good luck. You're not going to get any money. You have to sponsor that with your own cash or a friendly loan." The small-tier gap from the route-around's own mouth.
- Economics: origination fee plus 10 percent net interest margin, fee switch on. Short-term addressable market claim: "20% of Nvidia sales of small financings... about 100 billion every year" over the next three years. Grand narrative (all credit, the SaaS credit apocalypse, "interest rate of intelligence," stablecoin ambitions) captured as narrative, not fact.
- H200-to-China export claim ("the US government is like yeah we can sell the H200s to China... we get the Vera Rubins") captured as his statement, unverified.

### 9. Non-thesis alpha (added 2026-07-15 after Dylan's push; deliberately outside the record thesis)

1. THE SAAS CREDIT APOCALYPSE, his biggest macro claim. Verbatim: "at one point software was stable cash flows based on subscription models that you could underwrite... then AI was introduced... we're just one prompt away from your cash flow is going to zero." And: "you can't give a loan to an AI company... you're giving a loan against the GPUs because that's the only thing that's hard and that's physical." His ten-year line: "are you really going to be trading corporate credit or are you going to be trading GPU loans?" Ties private credit's "$3 trillion blow up" to software underwriting. Falsifiable macro claim, held not adopted; dialectic with the contract-backed inversion logged as a dated update on [[gpu-backed-debt-contract-backed-inversion-2026-06-30|the inversion note]].
2. THE SMALL-SITE FINANCING GAP. Verbatim: "you can always find five megawatts here or there, but you can't get financing because you're like, why would I finance this, I'd rather just do the convertible with Core[Weave]." THREE-SEAT CONVERGENCE, logged as observation not direction per the what-next deferral: Tiwari at Magnetar named 4-5 megawatt stitched distributed-inference sites as the unfinanced frontier (tenor insight, 2026-02-26 entry), Choi gives the borrower-flow version, and Refinery ([[yida-gao-refinery-telegram-2026-07-13|yida capture]]) is building small powered cabins for exactly that footprint. Small distributed sites are where power is findable and money is not, per three independent captures.
3. EVERYONE BECOMES A LANDLORD. "Pretty much every AI company we talked to, if they last long enough, they will buy chips." Their addressable market reframes from neoclouds to "every AI company in the world." Implication he does not say: the rental neocloud layer gets squeezed from below over time, and the durable business is the mortgage rail, not the landlord.
4. COMPUTE ACCESS BEATS MODEL QUALITY. His read: "the massive move from Claude to OpenAI... wasn't model quality, it's compute access," and model releases that seem worse than predecessors are supply-constraint artifacts ("a lot of the models aren't even trained on the Blackwells because there's not enough Blackwells out there installed even though it's been announced for two years"). A financing seat's explanation for product phenomena usually attributed to research.
5. CHINA EXPORTS AS A RESIDUAL BID. His read of the H200-to-China policy: the frontier gap is now steep enough that last-generation chips are strategically disposable ("we can sell the H200s to China... we get the Vera Rubins"). Unnoticed implication: a legal China buyer pool is a new floor under used H200 prices. Residual-relevant; the policy claim itself unverified.
6. OPACITY IS MARGIN. "The more you know the price of something the less money you make," his art-market lesson: dealers earned less once fairs made pricing clear. The cleanest explanation on record for who would fight a GPU price index, and it bears directly on [[gpu-kbb-demotion-decision-2026-06-30|the Kelley-Blue-Book demotion decision]]: incumbent resistance is not inertia, it is their profit margin.
7. MECHANICS WORTH HOLDING: the stablecoin as a warehouse-free securitization ("a perpetual debt instrument," replacing the bank warehouse facility; his Figure comparison; idle capital sits in treasury bills "which gets 4 and a half% for us"); revenue today comes "actually from AI companies that are willing to pay," not DeFi depositors; Choi personally owns 5 percent of the network; named failure modes in his own words (deposit-side liquidity design with his Grayscale scar, "you can't get BTC for your GBTC," losing control of derivatives priced on top of the token, Munich Re's balance-sheet ceiling); and the co-founder detail that Lily Liu of Solana restructured 21.co and fire-sold its mining ASICs, Ivan's formative blowup.

## Promotions

- Audit note tier map: DONE 2026-07-15 (no-offtake priced-not-declined at the route-around).
- Aravolta org note: DONE 2026-07-15 (borrower-demanded blindness, founder confirmation of the node deployment).
- Operator interview question additions: all-in effective cost, end-of-term fair-market-value buyout. Feed into live conversations, not new templated sends.

## Links

- Prior Permian/USD.AI sources: [[usd-ai-call-harry-page-2026-06-29|Harry Page call]], [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|Choi Touchcraft capture]], [[usdai-connor-moore-messari-fully-diluted-podcast-2026-07-15|Connor Moore Messari capture]]
- Aravolta: [[aravolta-usdai-collateral-verification-case-study-2026-07-02|case study]], [[aravolta|org note]]
- Related insights: [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|tokenization auditability boundary]], [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|tenor mismatch]]
- Tier map: [[solid-findings-audit-and-next-rung-2026-07-14|solid findings audit, end-of-day section]]
