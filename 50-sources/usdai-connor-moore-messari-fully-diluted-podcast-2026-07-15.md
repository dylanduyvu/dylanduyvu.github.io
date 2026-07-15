---
type: source
status: captured
created: 2026-07-15
updated: 2026-07-15
source_date: 2026-02
source_type: podcast_transcript
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, credit-markets, verification, insurance]
people: [connor-moore, thomas-barkr]
orgs: [usd-ai, permian-labs, barkr, munich-re, macquarie]
tags: [podcast, usdai, value-insurance, barkr, operator-blind, tenor, residuals, capture]
---

# Connor Moore (USD.AI) on Messari Fully Diluted: value insurance, operator-blind underwriting, duration push

## Context

Messari podcast with Connor Moore, co-founder and chief operating officer of USD.AI (Permian Labs, a Delaware C corporation; Permian is the company, USD.AI is the protocol). RECORDED ROUGHLY FEBRUARY 2026 per Dylan; captured 2026-07-15. Everything time-sensitive below is five months old at capture. Third Permian voice in the vault after the Harry Page call (2026-06-29) and the David Choi Touchcraft capture. Auto-transcript; capture-grade per vault rules, quotes verified against the transcript text Dylan supplied, "Barker" read as Barkr.

CORRECTION LOGGED AT CAPTURE: the first version of this note framed the Barkr and Munich Re relationship as a fresh network collision. Wrong twice. The 2026-06-18 Thomas call already established Barkr is Munich Re-backed and works with USD.AI (Dylan asked him about it directly), and the 2026-07-01 Thomas email already established that operator performance sits outside Barkr's valuation and guarantee lane. The agent wrote the collision framing without re-reading the linked Barkr notes, and dated the source by paste date instead of recording date. What this transcript genuinely adds is listed under deltas, and it is narrower.

## The deltas against what the vault already held

### 1. The value insurance mechanics get numbers the vault lacked

Verbatim: "We actually just placed something called value insurance which I would think of as a credit default swap... we bought insurance from a massive reinsurer called Munich Re. The lenders pay somewhere between 100 to 150 bips on the entire loan basis each year and in exchange if the depreciation is super high and the assets depreciate underneath the loan balance and the borrower defaults the value insurance pays out." ("Just placed" as of roughly February 2026.)

Structure, verbatim: "The insurance is technically coming from a company called Barker which is a startup and then Barker has insurance from Munich Re... Barker has a way to price insurance and price assets using more cutting edge technology primarily AI then they're selling Munich Re on their ability to underwrite... Barker has access to the real data just like we do that says, okay, you can go into the gray market today and sell H100s in serious size at 150k a server."

He claims first-of-its-kind status: "doesn't exist anywhere else. Not even in traditional capital markets."

What is genuinely new against the two Barkr notes: the PRICE (100 to 150 basis points a year on loan balance, at least for the USD.AI placement), which partially answers the 2026-06-18 note's open question about the guarantee fee, and the PAYOUT TRIGGER coupling (depreciation below loan balance AND borrower default), which partially answers that note's trigger-mechanics question. Connor's "credit default swap" characterization matches Thomas's own swap-versus-insurance framing from June.

OPEN QUESTION THAT SURVIVES THE JULY 1 ANSWER: Thomas already said operator uptime and SLA performance are "yes, separate" from Barkr's warranty process, so current pricing is pure hardware and market. The unanswered half is directional: the payout trigger couples depreciation with BORROWER DEFAULT, default probability is operator-correlated, so would verified operator delivery history MOVE the 100 to 150 basis points if it existed? A guarantee fee is a financing term the borrower ultimately bears, so a yes from Thomas or Munich Re's side would be a stated term movement conditional on the record, trigger-1 shaped for the Friday criterion. Thomas's own 2026-07-01 words already name the bottlenecks for the adjacent product ("it'll come down to cost and accuracy"), which makes him the most engaged adjacent builder on exactly this question. He is not a lender, so whether his seat counts toward the pre-registered five is Dylan's call; the registered list stays as written and any Thomas evidence gets counted as what it is, a new touch, not a retroactive seat.

### 2. Operator-blindness stated as design premise

Verbatim: "I don't really care who the actual counterparty is, who the borrower is besides some, you know, standard KYC requirements because fundamentally these businesses beyond... an offtake agreement, a contract with a customer and the hardware that you own, there's not a ton of like equity value in the business. So why not just strip it out altogether and say all I care about is having clean title to these assets... you should treat that as a standalone asset and not, you know, underwrite years of corporate credit history."

Reading: the route-around does not solve the verification gap, it deletes the operator variable. Structure substitutes for trust: tokenized title, escrowed custody in high-security data centers, draw gates, and now value insurance. The 9 to 13 percent pricing (his number this episode; "maybe a little bit higher if it's a smaller borrower") is the cost of that blindness. The Choi capture's 15 to 10-12 reprice when they watched a borrower firsthand remains the internal evidence of what operator information is worth inside their own book. At the small tier, a portable record competes with a lender whose design premise is that operator history is unnecessary.

### 3. Duration push via insurance: the tenor countermove

Verbatim: "We've historically underwritten three years, three-year loan terms because that is as conservative a view on depreciation as you can take and still be a useful product... Now that we have this value insurance though, we actually will most likely try to push those durations as long as we possibly can... if you can offer a longer duration loan product, you can win deals that other participants wouldn't be able to get."

Reading: Phil's kill condition (long liabilities against short rental agreements, his WeWork mechanism) being attacked by an insurance wrapper rather than by operator evidence or longer offtake. TIMING CAVEAT: this was stated intent as of roughly February 2026, five months before capture. The real update is now checkable rather than quotable: did USD.AI loan durations actually extend past three years? The SEC-visible borrower facilities (Sharon AI, QumulusAI, Crucible, Duos, NexGen, Quantum Solutions) carry tenors; check them before treating the push as real. Promoted to the tenor insight with the same caveat.

### 4. Rental rates went up; market beat the models

Verbatim: "For a long time semi analysis was projecting, you know, basically just linear decline in H100 rental rates. Very like academic approach. Made a lot of sense to me. It just didn't happen. And now you've seen H100s and H200 rental prices go up." And on wholesale: H100s at $300K a server in 2023, $150K today, roughly 50 percent over three years; "the guys that are actually in the business... are paying 150K a server... maybe the market knew a lot more than I did."

Reading: recorded roughly February 2026, this is the EARLIER of two seats now saying rental curves flat-to-up, with Phil's 2026-07-14 "recently had been flat to even up" as the later, independent corroboration five months on. Two observations spanning February to July make the flat-to-up read more durable than either alone. And the observed-residual census grows: USD.AI/Barkr reference live gray-market wholesale prints ("in serious size") as their valuation anchor, a method distinct from American Compute's iTAD transaction data and from everyone else's models. Mark-to-market plus haircut, his words: "reference what is the actual market pricing these at today. Take a haircut to that... project the rental rates, and try to be as conservative as you possibly can."

### 5. Structural and market facts worth holding

- No asset-backed-securities market for GPU loans, "maybe ever": loan durations are shorter than the issuance cycle. Macquarie told them a new-asset securitization took THREE YEARS of approvals. USD.AI's counter: a freely trading debt token; at one billion dollars outstanding it becomes "a forcing mechanism" for the rest of the market's pricing, borrowers quoting it back to private credit funds.
- Private credit economics from their seat: funds want 500 million dollars plus per transaction, legal fees stated as hundreds of thousands early in the episode and two million dollars per deal later (inconsistent within one episode, both captured), complexity as a feature ("as many opportunities... to scrape extra points of yield"), equity warrants, hundred-page master lease agreements.
- Banks finance the building, not the servers: "bank lenders think, oh, I'm financing a computer. Don't those depreciate quickly?"
- Loan range 300 thousand dollars to hundreds of millions; origination goal roughly one billion dollars in 2026.
- Deposit-side ladder: seed funds first (SIG and Brevan Howard named as first-slice participants), then DeFi-native depositors (5 to 15 billion potential in his view), then crypto-curious traditional institutions (the Ethena playbook, his analogy).
- Hub-and-spokes origination: recruiting actual credit funds as regional originators and underwriters (Asia, US, Europe) beyond "Permian Labs, our Delaware C Corp's ability to go and drum up business." The small-tier lending network is being franchised.
- Useful-life view: five to seven years; A100s still earning; some neocloud participants "running the same servers for north of 10 years"; announcement-to-availability lags (Blackwell roughly two years to non-hyperscaler availability plus 12 months of software catch-up; Vera Rubin roughly three years announcement to market).
- Company history: founded 2021 as a generalized structured-credit DeFi primitive; iterated through real-world assets, non-fungible tokens, tokenized land, gold bars, watches; Gensler-era adverse selection ("the only people who were willing to come and do crypto things had the reason which was that their assets sucked"); pivoted to GPUs on the AI capex boom plus regulatory turn. The route-around is itself a pivot-to-niche story.
- The stablecoin moonshot: dual token, treasury-bill yield subsidizing borrower rate discounts for holding the payments stable, pushed down the chain to compute customers. Upside optionality, not core lending. His words: "I can jam the payments business down their throats."

## Promotions

- Tenor insight update: DONE 2026-07-15 (insurance-wrapped duration push as countermove to the duration-mismatch kill condition).
- Residual insight candidate update: gray-market wholesale reference as observed-prints method two, rental-rates-up second seat. Pending next pass.
- Thomas/Barkr follow-up: KILLED 2026-07-15. Held earlier the same day pending the what-next direction; then Dylan ruled the insurance pool out entirely on buyer count (two to three insurers in the whole space, a partnership hunt rather than a product direction), so the question dies with the pool. The settled wording and grading key are preserved below for the record only. The settled wording, when it fires: "I know you mentioned SLA performance is separate from Barkr's guarantee. Say a lender brings you a deal for an operator whose past deployments went live on time and performed as promised. Would that change what Barkr charges for the guarantee, and roughly by how much? Or is pricing still all hardware and market?" Design notes: single-barreled, operator-controlled facts only (no "customers paid," which would smuggle offtaker credit into an operator-signal test), both exits open, no "verified" (the hypothetical grants the facts; the verifier-spec question is the earned follow-up). GRADING KEY: a number = first priced signal from the risk-bearing seat, opens the insurance pool; "all hardware and market" = the pool closes cleanly.

## Links

- Prior Permian/USD.AI sources: [[usd-ai-call-harry-page-2026-06-29|Harry Page call]], [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|David Choi Touchcraft capture]]
- Barkr: [[barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18|pricing guarantee note]], [[barkr-thomas-sla-email-reply-2026-07-01|SLA reply note]]
- Related insights: [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|tenor mismatch]], [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|equity cushions]], [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|tokenization auditability boundary]]
- Facility dataset: [[gpu-debt-facility-dataset-first-pass-2026-07-14|first pass]] (USD.AI's SEC-visible borrowers)
