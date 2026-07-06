---
type: synthesis
status: draft
created: 2026-07-05
updated: 2026-07-05
projects: []
domains: [gpu-finance, compute-contracts, verification, asset-backed-lending]
sources: [american-compute-who-is-building-compute-article-2026-07-01, american-compute-compute-offtake-agreements-article-2026-07-02, aravolta-usdai-collateral-verification-case-study-2026-07-02, nvidia-ai-compute-partnership-backstop-2026-07-05, deep-research-gpu-credit-post-pressure-test-2026-07-05]
people: []
orgs: []
tags: [gpu, lending, verification, offtake, blogpost]
---

# The Ununderwritten Half of GPU Credit

GPU-backed lending grades whether the customer can pay. It has no instrument for whether the operator will deliver. And so far, the deals that have broken have broken on delivery, not on payment. This post is about that gap: how the market papers over it today, what exists next to it and what is still missing, and why NVIDIA's new financing program makes the question urgent.

This comes from a few weeks of conversations with people in GPU lending and insurance, plus public contract filings and the published writing of firms in the space. Outreach, not a survey. Where a claim rests on one conversation, I say so.

## The clause that gives it away

Start with a clause buried in CoreWeave's IPO filings. If CoreWeave materially breaches its master services agreement (the contract governing its compute services), OpenAI can hand the entire contract to a replacement operator of its choosing, within two business days. The GPUs stay in their racks. The workloads keep running. A different company takes over running them. The contract is [public as an SEC exhibit](https://www.sec.gov/Archives/edgar/data/1769628/000119312525052207/d899798dex1024.htm).

OpenAI committed roughly $11.9 billion over five years and still negotiated, in advance, the right to fire its supplier from its own contract in two business days. There is no way to verify ahead of time whether an operator will deliver. So the most sophisticated compute buyer in the world bought an exit instead.

## How the loans work

A GPU-backed loan has two parts.

The hardware sets the loan size. Lenders advance a percentage of the GPU purchase price, and the resale value of the GPUs is the recovery floor if things go wrong.

The customer contract sets the rate. Lenders grade the offtake agreement, the contract where a customer commits to buying compute in advance. An investment-grade customer gets the operator cheap debt. A multi-year contract with a weaker customer prices in the low teens. Spot exposure prices above that.

The public deals show the same structure. CoreWeave's $8.5 billion loan facility earned an [A3 investment-grade rating](https://qz.com/gpu-collateralized-debt-ai-neocloud-coreweave-financing-risks-050526) because of the Meta contract behind it, not because of CoreWeave's own credit, which is rated speculative.

So one half of the risk, customer credit, is priced like a bond. Tiers, ratings, credit committees. That machinery exists and works.

## The two ways a deal dies

An offtake contract falls apart in two ways. The customer defaults and cannot pay. Or the operator misses its deployment milestones and the customer walks away without breaching the contract. [American Compute](https://www.amcompute.com/blog/who-is-building-compute), a residual value insurer that publishes some of the best material on this market, lays out both.

The second one is the dangerous one. Here is why.

Customers rent from smaller operators because hyperscalers cost 2-3x more. They only do it if the operator can deliver within months. Customers sign letters of intent with several operators at once and go with whoever ships first.

Meanwhile the operator's supply chain barely fits inside that window. Smaller GPU orders carry 6-9 month lead times. High-density colocation space is scarce. Power is the slowest piece of all: Berkeley Lab's [interconnection data](https://emp.lbl.gov/queues) shows only about 13% of the projects of all types that entered US grid queues from 2000 to 2019 ever reached operation. And per Sightline Climate's project tracking, 26% of data center projects slated for 2025 slipped their dates.

Put those together: until the racks are live, the contract that supports the loan is a free option for the customer. They can leave, legally, the moment a competitor delivers first.

American Compute's own underwriting guide calls timeline the biggest risk in GPU infrastructure investing. The visible failures so far agree: the documented breaks in this market have been delivery-side. Crusoe paused its 1.8GW Wyoming campus in June at a customer's request. Missed dates and customers walking are the pattern underneath. The asset class is young, so treat that as an early pattern, not a base rate. But the asymmetry does not depend on it. One failure mode has rating agencies attached. The other, the one the industry's own writing calls the biggest risk, has no instrument at all.

| | Customer default | Operator delivery miss |
|---|---|---|
| What happens | The offtaker cannot pay | Milestones slip, the customer walks without breach |
| Who grades it | Rating agencies, credit committees | Nobody |
| The instrument | Tiered pricing, IG ratings, credit look-through | None |
| The fallback | Take-or-pay terms, customer LCs | Reputation, deposits, equity cushions, clauses |

## What the market does instead

With no instrument, the market uses money and legal language.

- Reputation. Lenders check whether the operator has deployed before. No track record usually means no loan.
- Equity cushions. One lender described a borrower posting $5 million in cash against $10 million of equipment. That is one conversation, but a clean one, and it matches the 16-30% deposits in disclosed deals.
- Letters of credit. In SharonAI's $1.25 billion offtake with ESDS, the [customer had to post $140 million in bank guarantees](https://www.amcompute.com/blog/compute-offtake-agreements) on top of monthly advance payments. Both sides over-collateralize because neither trusts the bare contract.
- Contract clauses. The flagship agreements prohibit subcontracting the compute, because the customer cannot otherwise verify whose hardware runs its workloads. They cap how much capacity one customer can take, because customers cannot measure operator durability any other way. They ban publishing benchmark results. Each clause is a rule standing in for a measurement nobody can make.

Even the headline protection is weak. The standard remedy for missed uptime is service credits: discounts on future purchases from the provider that just failed you, claimable within 30-60 days. American Compute's advice to customers is telling: pick reputable providers over generous SLAs. The paper does not protect you. Only the operator's behavior does, and no instrument measures delivery against the contract.

One layer of verification does exist. USD.AI, an on-chain GPU lender, [pays Aravolta for continuous monitoring](https://www.aravolta.com/case-studies/usdai-case-study) of its collateral: physical presence, serial numbers, health, availability. Their principle is "verify, don't trust." This settles one question: lenders will pay for verification.

But look at the scope. Aravolta explicitly does not collect customer workloads, tenant usage, or application performance. The existence of the hardware is verified. Whether the operator is delivering what the contract promises is exactly where the coverage stops.

## What exists, and what is missing

Two instruments already serve parts of this problem. Their boundaries define the hole.

Aravolta verifies that the collateral exists, covered above. And SemiAnalysis publishes [ClusterMAX](https://www.clustermax.ai/), an independent rating system that grades 80+ GPU clouds on security, networking, reliability, and seven other criteria. ClusterMAX matters more than most people in credit seem to have noticed. The tiers already move money on the customer side: SemiAnalysis reports that its top-tier providers command a pricing premium, and vendors now sell tooling to help clouds climb the ratings. So a reputation instrument exists, and operators respond to it.

But ClusterMAX is a capability rating, not a delivery record. It answers whether a cloud can run demanding workloads well today, assessed by a research firm on its own schedule. It does not attest that a specific operator delivered a specific contract on time at the promised uptime, and no lender prices a loan off it. The missing instrument is narrower and more boring: a finance-grade, deal-level, operator-consented delivery record that moves loan terms. The Michelin stars exist. The credit bureau does not.

| Instrument | What it answers | What it cannot answer |
|---|---|---|
| Aravolta (collateral monitoring) | Does the hardware exist and is it healthy | Is the operator delivering the contract |
| ClusterMAX (capability rating) | Can this cloud run demanding workloads well | Did this operator deliver this deal on time |
| The missing instrument | Did the operator deliver, on contract, at the promised uptime | Does not exist yet |

## Why the gap survives

The obstacle is not telemetry. GPUs are heavily instrumented, and the delivery data already sits in every operator's monitoring stack. The obstacle is consent.

After a loan closes, delivery data can only hurt the operator. It can trigger covenants, freeze loan draws, or reprice the debt. The benchmarking bans block collecting it from the customer side. So any product shaped like surveillance dies on arrival. The one monitoring vendor in the market drew its scope line exactly where operator consent runs out.

At origination, the incentive flips. The operator with no track record is the one getting skipped or posting punitive equity. For them, a verified delivery record is the credential that gets the loan done. Borrowers volunteering their own diligence to unlock capital is an old pattern. Thin-file borrowers hand over bank statements. Startups pay for their own SOC 2 audits. Nobody calls that surveillance.

That points at a product shape. I will state it as a hypothesis, not a finding: operator-volunteered delivery credentialing. Verify completed deployments, at the operator's request, so they can win the next facility or refinancing. One record serves the audiences a capability rating does not reach. The lender prices it. The insurer rates it. And the customer gets the one answer ClusterMAX cannot give them: did this operator deliver its last contract on time. One insurer told me the insurance wrap would be tough but possible, and that cost and accuracy will decide it.

The contract clauses that kill every other approach become the advantage here. A consent-first dataset is the only one that can legally exist in this market. And where lenders want ongoing monitoring after close, it gets written into the loan documents at origination, the way covenants always have been.

History suggests one more thing about how this gets built. In the asset classes that solved the same problem, the standard rarely came from a standalone startup. Aircraft appraisal standards came from an industry association, ISTAT. Equipment-finance credit data came from lenders pooling their own books, PayNet. Container inspection criteria came from the leasing trade body. And operator-pays audits, from ship classification societies to SOC 2, stayed credible only with third-party governance on top. If the GPU version gets built, it probably gets anchored to a lender or an insurer rather than sold to them cold.

## NVIDIA just took the other side

On July 1, NVIDIA [announced a revenue-sharing and credit-support model](https://blogs.nvidia.com/blog/nvidia-unlocks-ai-compute-at-scale-capital-partners-to-power-ai-infrastructure-buildout/) for AI clouds. Sharon AI and Firmus are the first partners, across roughly 210,000 GPUs. Sharon AI, note, is the same provider whose offtake required $140 million of customer credit support above. The provider that needed the most creative credit support is the first to get it from the vendor instead. NVIDIA's own post is thin on mechanics. [Reporting that originated with The Information](https://www.datacenterdynamics.com/en/news/nvidia-acts-as-backstop-for-customer-gpus-in-return-for-cut-of-cloud-revenue/) describes the credit support as NVIDIA renting back unused partner capacity at set prices. The terms are undisclosed, so treat that as reported, not confirmed. The precedent is confirmed, though: NVIDIA already carries a disclosed obligation, initially $6.3 billion, to purchase CoreWeave's unsold capacity through 2032. The new program looks like that arrangement turned into a product.

If the reporting holds, the largest single holder of operator utilization risk is now NVIDIA itself. A revenue share cannot settle without measuring the partner's cloud revenue. A capacity backstop cannot pay out without agreed measurement of utilization. Who performs that measurement has not been said. The question this market never answered just acquired its best-capitalized customer.

## Where this is wrong

At the top tier, it mostly does not apply. As Dave Friedman [has argued](https://davefriedman.substack.com/p/the-gpu-debt-treadmill), a fully amortizing loan against a five-year investment-grade contract pays off before delivery risk matters to the lender. The residual accrues to equity, and the real problem moves to refinancing. This thesis lives in the mid-market, where contracts can die before the debt amortizes.

And the simple answer may win. The market's current solution is to pay up for proven operators and cover the rest with cash. Reputation plus equity is crude, but it works. A credential only matters if it moves a lender or a customer off that default.

## The test

One question decides most of this, and it is the question I am asking now.

If an operator showed up with independently verified delivery history, would you cut the equity requirement or improve the terms, at the same price?

If yes, GPU credit is missing its credit bureau, and someone will build it. If no, the posted collateral is the product, and the clauses are as good as this market gets. Either answer is worth knowing before the next hundred billion dollars of this paper gets written.
