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
