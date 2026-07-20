---
type: source
status: captured
created: 2026-07-19
updated: 2026-07-19
source_date: 2026-07-19
source_type: research
projects: []
domains: [gpu-finance, credit-markets, compute-contracts, compute-derivatives]
people: [dave-friedman]
orgs:
  [
    lambda,
    macquarie,
    vultr,
    coreweave,
    iren,
    usd-ai,
    nvidia,
    nebius,
    semianalysis,
    silicon-data,
    cme-group,
    ice,
    ornn,
  ]
attachments: []
tags:
  [claim-ledger, blogpost, gpu, on-demand-compute, forward-curve, utilization]
---

# Claim ledger: GPU loans without a long-term customer

## Purpose

This ledger fixes the argument before another prose revision of [[the-gpu-backed-credit-market-does-not-exist-yet|The Missing Playbook for GPU Loans Without a Long-Term Customer]]. It separates direct evidence from inference, records the strongest objections, and defines the claims the article may and may not make.

## Locked Thesis

The market can be short compute while a young operator remains difficult to finance. Scarcity describes demand across the market today. A loan depends on one fleet earning enough money to make scheduled payments over several years. A long customer contract turns part of that broad demand into payments the lender can claim.

Forward prices and compute futures can make future rental prices easier to estimate and protect. They do not guarantee how many hours a particular fleet will rent. That remaining risk helps explain the structures visible today. A lender can rely on a long customer contract, lend less and charge more against an existing on-demand business, lend to an established company with diversified revenue, or rely on another company to promise a minimum amount of revenue.

## Thesis In One Sentence

A compute shortage is not a repayment stream. A forward price can tell a lender what GPU-hours may rent for, but not how many hours a particular fleet will sell over the life of the loan.

## Causal Chain

1. Current-generation compute appears scarce in parts of the market. Customers are waiting for GPUs, paying premiums for available capacity, and holding long contracts they still need.
2. A young operator normally seeks financing before its new fleet is operating. The loan then remains outstanding for years.
3. Market-wide demand today does not tell the lender whether customers will choose this fleet when it comes online, what they will pay, or how long they will stay.
4. Customer payments normally repay a GPU loan. The hardware provides a recovery source if those payments stop.
5. Fleet revenue depends on both the rental price and the share of available GPU-hours that customers rent.
6. A long customer contract fixes a customer, a price, and a minimum amount of revenue for several years. It turns broad demand into scheduled payments tied to the financed fleet.
7. A forward curve or futures contract can provide a market price for future GPU rentals and may let an operator offset losses when that market price falls.
8. The futures payout follows the market index, not the operator's actual sales. It therefore does not guarantee that this operator will find customers, keep its cluster working, or earn the market price.
9. Today lenders handle that uncertainty through an established company's financial history, more borrower cash and faster repayment, a long customer contract, or a third-party revenue promise.
10. To lend more aggressively against future rental income, lenders need both usable market-price tools and a repeatable way to measure or transfer the risk that a particular fleet sells fewer hours than expected.

## Definitions In Normal English

- **Forward rental curve:** an estimate of what one GPU-hour will rent for at different future dates.
- **Compute futures:** financial contracts whose value changes with a published GPU rental-price index. They can be used to protect against broad market-price changes once liquid trading exists.
- **Market-wide scarcity:** more customers want a category of compute than providers can currently supply. It does not show which provider those customers will choose later.
- **Utilization:** the share of available GPU-hours that paying customers actually rent.
- **Difference from the benchmark:** the gap between the published market price and what a particular cluster earns because of its location, networking, service quality, configuration, contract length, or operator.
- **Long customer contract:** an agreement requiring a customer to pay for a defined amount of compute over several years, often whether or not it uses all the capacity.
- **Minimum revenue promise:** a commitment from a third party to buy enough capacity, or otherwise supply enough revenue, for the loan to remain payable if ordinary customer demand is weak.
- **Fleet-level loan:** debt repaid mainly from one financed GPU deployment, with security over that deployment and its revenue.
- **Company-level credit:** debt underwritten against the operator's wider business, customer base, assets, and financial history rather than one GPU deployment alone.
- **Standardized lending:** loans that multiple lenders can compare and fund using similar rules, without designing every deal around one operator from scratch.

## Evidence Grades

- **Direct:** stated in a primary source or mechanically true from disclosed terms.
- **Supported inference:** several facts point in the same direction, but the mechanism or market-wide frequency is not fully disclosed.
- **Hypothesis:** plausible and testable, but not established by the current evidence.

## Claim 1: A supply-constrained compute market can coexist with hard financing for a new fleet

**Grade:** Supported synthesis.

**Direct evidence:**

- In a June 29 conversation, the USD.AI team said there were not enough GPUs for what customers wanted. Customers were waiting or paying premiums to skip the line. The team had not seen buyers trying to shed long capacity contracts because those buyers still needed the capacity and had paid deposits of roughly 16 to 25 percent.
- USD.AI's public pipeline showed the other side of the same market. On July 17, eight of nine upcoming loans, representing 97.9 percent of principal, had customer contracts. The only exception already had on-demand rental revenue. No upcoming loan relied on an unproved expectation of future demand.
- SemiAnalysis reports that inference customers often want contracts of one year or less, while the easiest loans to finance have several years of committed customer payments. This suggests that strong demand can exist in a form that does not match the loan's payment period.

**Corroboration, not core evidence:** A July 7 snapshot of Lambda's walk-up console showed current-generation configurations unavailable. That observation cannot distinguish end-customer demand from deliberately limited on-demand inventory, hardware not yet installed, or capacity reserved by intermediaries.

**Strongest objection:** This evidence does not prove the entire compute market is supply-constrained. The USD.AI conversation covers its own lender and customer slice. Availability can differ by GPU generation, location, cluster size, networking, contract length, and provider. A shortage observed today can also disappear before a new fleet comes online or before its loan is repaid.

**Allowed wording:** "A market can be short compute while lenders still refuse to assume that a new fleet will stay rented throughout a multi-year loan. Scarcity belongs to the market. Loan repayment belongs to one borrower."

**Do not write:** "All neoclouds are sold out," "demand guarantees every new fleet will find customers," or "lenders ignore the compute shortage."

## Claim 2: Several large disclosed GPU loans are tied to customer contracts

**Grade:** Supported inference.

**Direct evidence:**

- Nebius's July 2026 facility was backed by deployed GPUs and payments from an investment-grade customer. Nebius described the structure as repeatable across its other long-term customer deployments.
- Nscale's February 2026 delayed-draw loan financed clusters tied to executed customer contracts, with some additional liquidity for pipeline clusters.
- CoreWeave said its 2023 $2.3 billion facility would fund hardware for contracts already executed with customers. That statement establishes the use of proceeds, but it does not prove that the customer payments were formally pledged to lenders.
- IREN's June 2026 financing for its Microsoft deployment included $1.5 billion of delayed-draw loans and $2.1 billion of notes. The collateral included the financed hardware and Microsoft payments. Public terms included a minimum 1.05 times debt-service coverage ratio and prepayment triggers tied to coverage and loan-to-cost tests.
- USD.AI's July 17 dashboard showed eight of nine upcoming loans, representing 98 percent of principal, backed by customer contracts.

**Boundary case:** Macquarie's Fluidstack case study says the financed GPUs were designated for a leading AI research lab, but it does not disclose whether the customer signed a long contract or supported the debt.

**Strongest objection:** These examples are selected public announcements, not a census of all GPU loans. Private facilities may rely on diversified rental revenue without disclosing it. The public announcements also do not always disclose contract length.

**Allowed wording:** "Several large disclosed GPU facilities tie the debt to customer contracts. Where those contracts run for the life of the loan, they remove much of the need to forecast the next customer."

**Do not write:** "GPU lenders require long-term offtake" or "all large GPU loans depend on one customer."

## Claim 3: Financing without long customer contracts exists, and established operators also obtain company-level credit

**Grade:** Direct for the announced financings. Supported inference for what the lenders relied on.

**Direct evidence:**

- Lambda announced an asset-based financing vehicle of up to $500 million in April 2024 for its on-demand cloud. The announcement said customers could rent the financed capacity without signing long-term contracts. The GPUs secured the financing and their cash flow supported it.
- Lambda closed a $1 billion syndicated senior secured credit facility in May 2026. The package expanded a 2025 facility and included term debt, delayed-draw debt, and a larger revolving line. Lambda said it would use the money for GPUs, working capital, and general corporate purposes. The announcement did not tie repayment to one named customer contract.
- Vultr announced $329 million of credit and lease financing in June 2025 for cloud and AI expansion. Vultr described itself as profitable and said it served hundreds of thousands of active customers across 32 regions. The public announcement did not tie the package to one named customer contract.

**Limits:**

- Lambda's 2024 release said "up to" $500 million. It did not disclose how much was drawn. A targeted search of public releases, legal announcements, and filings did not find an amount outstanding.
- The 2024 release did not disclose the interest rate, share of hardware cost financed, repayment schedule, reserves, guarantees, recourse, or required utilization.
- Lambda was founded in 2012 and reported more than 100,000 customer sign-ups. Sign-ups are not the same as paying customers.
- The financing occurred during exceptional demand and scarcity for NVIDIA GPUs.
- Lambda's 2026 and Vultr's 2025 financings look more like broad company-level credit than a loan underwritten only against one new GPU fleet. Their public disclosures do not reveal how much lenders relied on profitability, existing customer diversity, other assets, lender relationships, or protections in the loan documents.
- A financing announcement that does not name one customer contract does not prove that customer contracts played no role in underwriting.

**Allowed wording:** "Lambda proves that a large financing vehicle for on-demand GPU capacity was possible in 2024. Lambda and Vultr later raised broader company-level credit without publicly tying each facility to one customer contract."

**Do not write:** "Lambda proved a repeatable on-demand GPU loan model," "Macquarie lent the full $500 million against future rental revenue," or "these facilities had no contract support."

## Claim 4: The public record does not expose a reusable fleet-level method for a younger operator

**Grade:** Direct about public disclosure, hypothesis about the wider market.

**Direct evidence:** Lambda's 2024 announcement omitted the loan terms and operating assumptions another lender or borrower would need to reproduce the structure. The 2026 Lambda and 2025 Vultr announcements disclose facility size and broad use of proceeds, but they still omit the pricing, repayment rules, customer-revenue assumptions, required rental levels, and downside protections needed to copy the underwriting method.

**Strongest objection:** The later Lambda and Vultr facilities may show that ordinary company-level credit is already becoming the repeatable method. Macquarie and other lenders may also have clear internal methods that they reuse privately. Private loan terms are normally confidential.

**Allowed wording:** "The public record shows lenders financing established operators with diversified customer books. It does not show a common fleet-level method another lender could apply to a younger operator whose customers change over time."

**Do not write:** "Macquarie had no playbook," "lenders do not know how to make this loan," "Lambda was a one-off," or "no market for GPU loans without customer contracts exists."

## Claim 5: A public GPU forward curve now exists, while exchange-traded futures are still pending

**Grade:** Direct.

**Direct evidence:**

- Silicon Data launched a GPU forward curve in April 2026. It uses observed rental agreements from one to 36 months to calculate implied future rental rates for A100, H100, and B200 GPUs.
- CME Group announced plans to launch compute futures based on Silicon Data's daily on-demand rental benchmarks later in 2026, pending regulatory review. The announcement described the purpose as managing price volatility but did not yet publish full contract or settlement specifications.
- ICE and Ornn announced planned US dollar, cash-settled futures based on the Ornn Compute Price Index. Ornn says the index uses completed spot transactions for H100, H200, B200, and RTX 5090 compute.

**Limits:**

- The announced futures had not begun trading as of July 19, 2026.
- No live trading history, open interest, liquidity, hedge effectiveness, or lender adoption is yet observable.
- The Silicon Data curve is a calculated reference derived from term contracts, not a traded futures curve.

**Allowed wording:** "The first forward curves exist, and two exchanges plan to launch compute futures. The market has not yet shown whether those contracts will become liquid or useful to lenders."

**Do not write:** "GPU finance has no public forward curve" or "compute prices cannot be hedged."

## Supporting Claim 6: The current forward curve does not isolate a pure expectation of future spot prices

**Article role:** Optional footnote or one-sentence qualification. The main argument does not require a section on this point.

**Grade:** Supported inference.

**Direct evidence:** Bandi and Su argue that compute cannot use the standard spot-to-futures relationship for storable commodities because an unused GPU-hour cannot be saved for later. They use term rental agreements to construct synthetic futures prices, but say those prices are likely an upper bound on eventual financial futures. A physical term rental includes the right to reserve capacity, while a cash-settled futures contract does not.

**Strongest objection:** A calculated curve can still be useful for planning, comparison, loan stress tests, and derivative settlement even if it is not a pure forecast.

**Allowed wording:** "The existing curve is useful, but it contains the value of reserving scarce physical capacity as well as a view on future rental prices."

**Do not write:** "The curve is wrong" or "term rental data cannot inform future prices."

## Claim 7: A rental-price hedge does not remove the risk that a fleet sits idle

**Grade:** Direct mechanism.

**Mechanism:**

> fleet revenue = available GPU-hours x share rented x actual rental price
>
> minus power, data-center, maintenance, and operating costs

A futures contract can offset a broad decline in the reference rental price, whether or not the operator rents all of its capacity. But its payout does not automatically rise because one operator loses customers while the market price remains stable. It also does not keep a delayed or poorly performing cluster available for rent.

An operator can sell futures against an expected amount of future rentals, but that creates a mismatch if it sells fewer GPU-hours than expected. A market-price decline may produce a helpful futures gain, while an operator-specific customer loss may not. The hedge also introduces collateral requirements and the risk that the operator's actual rental price moves differently from the reference index.

This distinction is standard in project finance. Akin Gump describes a power-price hedge as protection against changes in the price per unit while the project keeps the risk of producing or selling a different volume than expected. Norton Rose describes the same mismatch in fixed-volume power hedges. Dave Friedman identifies a separate compute-specific risk: an index may move differently from the operator's actual rental price. These sources support the mechanism, but they are not direct evidence about losses in GPU loans.

**Strongest objection:** In a supply-constrained market, an available current-generation GPU may be easy to re-rent, making idle time a small risk. A diversified operator may also have enough customer demand that its rental volume is predictable.

**Response:** That can make the risk acceptable for a particular operator or market period. It does not make the price curve itself a guarantee of rental volume.

**Important boundary:** A future physical-delivery contract, fixed-volume rental hedge, or revenue guarantee could transfer more than price risk. This claim applies to the announced cash-settled price-index futures and similar financial hedges, not every derivative the market could design.

**Allowed wording:** "Compute futures can address broad market-price risk. Their payout does not directly track whether a particular fleet stays rented."

## Claim 8: USD.AI already publishes a conservative method for lending against on-demand revenue

**Grade:** Direct.

**Direct evidence:** USD.AI's published policy permits loans supported by documented on-demand or spot rental history. These loans cost 12 to 15 percent, compared with 7 to 9 percent for contracts with highly rated customers. USD.AI lends up to 80 percent of hardware cost, requires the borrower to supply the remaining equity, uses a three-year repayment schedule, and requires enough cash for three months of loan payments.

**Limits:**

- The public dashboard showed only one upcoming on-demand loan on July 17, 2026.
- The policy does not disclose defaults, recoveries, rejected applications, or how it forecasts future utilization.
- USD.AI's borrower segment and capital base differ from a broad bank syndicate.

**Secondary corroboration:** Nodestream advertises GPU financing at 70 percent loan-to-value and 15 percent annual interest, or 80 percent loan-to-value and 20 percent interest, with repayment over as long as three years. The page does not state that a customer contract is required, but it is marketing material and omits the full loan terms, underwriting rules, and performance history.

**Allowed wording:** "One public method already exists for on-demand revenue: start with proven rental income, lend conservatively, charge more, and require cash set aside."

**Do not write:** "No lending playbook exists" or "USD.AI lends against GPUs alone."

## Claim 9: A long customer contract and NVIDIA-style support solve more than rental-price risk

**Grade:** Direct for the broad mechanism, supported inference for detailed NVIDIA terms.

**Direct evidence:** A take-or-pay customer contract requires payment for a defined amount of capacity, fixing both a price and a promised minimum revenue stream. Its value still depends on the customer remaining able and willing to pay. NVIDIA officially describes its 2026 partner program as a revenue-sharing and credit-support model for multi-tenant AI clouds.

SemiAnalysis reports that the NVIDIA structure contains a multi-year minimum revenue guarantee with declining annual prices. Under that account, lenders can size the loan against the revenue available if ordinary customer demand is weak.

**Limits:** NVIDIA's public post does not disclose the exact guarantee, trigger, price schedule, termination rights, or bankruptcy treatment. The detailed mechanics and example prices come from SemiAnalysis and must remain attributed.

**Allowed wording:** "According to SemiAnalysis, NVIDIA's support gives lenders a minimum revenue case, not merely a forecast of future rental prices."

**Do not write:** "NVIDIA guarantees utilization for every partner" or present SemiAnalysis's illustrative schedule as a disclosed contract.

## Claim 10: Fleet-level rental volume is less publicly standardized for operators without a long company history

**Grade:** Supported synthesis.

**Support:**

- Lambda's 2024 vehicle shows that on-demand fleet revenue can be financed for an established operator under undisclosed terms.
- Lambda's 2026 and Vultr's 2025 facilities show that established operators can also move into broader company-level credit.
- USD.AI shows one conservative way to finance an existing on-demand business.
- Long customer contracts remain central in several large disclosed facilities.
- According to SemiAnalysis, NVIDIA's intervention supplies minimum revenue where customers want shorter commitments.
- Forward curves and planned futures improve market-price visibility without guaranteeing that a specific fleet earns revenue.

**Strongest objection:** No new standard may be necessary. Lambda and Vultr suggest that operators can accumulate customers, financial history, and lender trust, then borrow through ordinary company-level credit. Specialist lenders can serve younger operators until they reach that point. Lenders can also adopt Silicon Data or Ornn benchmarks without publishing a common method.

**Allowed wording:** "The market is developing public tools for future rental prices. The public record is less clear on how a lender should forecast the number of hours a younger operator will rent, before that operator has enough history to borrow as an established company."

**Do not write:** "Utilization is the only remaining barrier," "forward curves will not improve GPU lending," or "established operators cannot borrow against diversified revenue."

## Supporting Claim 11: Weak demand can pressure both fleet revenue and hardware recovery

**Article role:** Keep in the ledger. Use in the post only if the downside-recovery section needs it; otherwise it opens a separate residual-value argument.

**Grade:** Supported mechanism, not an established historical correlation.

**Mechanism:** A buyer of used GPUs is partly paying for the future work those GPUs can still perform. A broad decline in demand for that generation can therefore reduce rental income and the resale price at the same time. This matters because the lender may need the hardware precisely when the operating cash flow has failed.

**Strongest objection:** Rental prices and hardware sale prices can diverge. Data-center power limits, physical scarcity, export rules, and compatibility can support used hardware prices even while rental prices weaken. American Compute's transaction history includes a period when H100 rental prices fell while used server prices rose.

**Allowed wording:** "A broad demand decline can hurt both cash flow and hardware recovery, although rental and resale prices do not always move together."

**Do not write:** "Rental prices determine resale prices" or "the collateral always falls when utilization falls."

## The Strongest Alternative Explanation

There may be no missing market institution. If scarcity persists, lenders may learn from completed loans that capable operators can quickly find replacement customers. Specialist lenders can build that history privately and finance the earlier stage. The 2026 Lambda facility and 2025 Vultr package show the later stage: operators build a diversified customer base, become profitable or otherwise creditworthy, and move into ordinary company-level lending.

The article survives this explanation only if it makes a narrower claim. The public record does not yet show a common fleet-level method a broad group of lenders can use for a younger operator with a changing customer book. It must not claim that no private method exists, that established operators cannot obtain credit, or that a new company is required.

## Conditions That Weaken The Thesis

- Current-generation GPUs remain scarce enough that capable operators can re-rent them quickly.
- A lender finances at a low enough share of hardware value that liquidation alone protects principal.
- A strong corporate borrower supports the debt from cash flows outside the financed fleet.
- The operator has a long and diversified rental history that makes future demand predictable.
- Profitable operators can use broad company-level loans and revolving credit for new GPU purchases without matching each purchase to a customer contract.
- Compute futures become liquid enough to protect rental prices, while industry data makes rental volume easy to forecast.
- The eventual futures contract tracks the operator's actual hardware, location, service quality, and contract length closely enough to keep the hedge reliable.
- Physical-delivery, fixed-volume, or revenue-linked contracts become liquid enough to transfer part of the rental-volume risk as well as the price risk.

## What Would Falsify The Thesis

1. Young operators without customer contracts or operating history consistently receive low-cost fleet-level loans because lenders treat current market demand and GPU collateral as sufficient.
2. Multiple unaffiliated lenders close fleet-level loans against diversified short-term or on-demand GPU revenue using similar published or observable rules, without a long customer contract or third-party minimum revenue promise.
3. Broad company-level credit becomes available before operators have a long operating history, profitability, or a large diversified customer base.
4. Lenders say expected idle time does not affect the share financed, repayment schedule, required cash cushion, or interest rate.
5. Lenders use exchange-traded compute futures with simple rental-volume assumptions and no longer require a long customer contract, third-party minimum revenue promise, or operator-specific negotiation.
6. A liquid fixed-volume or revenue-linked compute contract becomes an accepted replacement for long customer contracts in GPU loan underwriting.

## Questions The Article Should Leave Open

Do not carry every question into the post. The ending should compress them into the smallest useful set.

1. How much of the apparent shortage is paying end-customer demand rather than limited on-demand inventory, hardware waiting to come online, or capacity reserved by intermediaries?
2. What evidence would let a lender treat market-wide demand as reliable repayment support for a young operator's fleet?
3. What did Macquarie require from Lambda in 2024, and how much of the facility was actually drawn?
4. Did Macquarie rely mainly on Lambda's rental history, conservative leverage, GPU resale value, company support, or another protection?
5. How much can Lambda draw under its 2026 company-level facility for GPUs that do not yet have matching customer contracts?
6. Once compute futures trade, can an operator hedge future rentals without creating a new loss when its own fleet rents fewer hours than expected?

## Narrative Design For The Revision

1. **Opening paradox:** A GPU lender said customers were waiting or paying premiums because there were not enough GPUs. The same lender's visible pipeline was 97.9 percent contract-backed. If demand exceeds supply, why does a young fleet still need a signed customer?
2. **Answer in one distinction:** The shortage belongs to the market. The loan belongs to one borrower. A lender needs this fleet to produce cash on fixed dates for several years.
3. **Why customer contracts work:** A long contract turns broad demand into a named customer, a price, a minimum amount of revenue, and a payment schedule tied to the fleet.
4. **The counterexamples:** Lambda financed on-demand capacity in 2024. Lambda and Vultr later obtained company-level credit. Financing without one long customer is possible once the lender has enough other evidence, but the public terms do not show a method a young operator can copy.
5. **The conservative route:** USD.AI finances demonstrated on-demand revenue at higher rates, with more borrower cash and cash set aside for loan payments. It does not lend cheaply against an unproved belief that customers will arrive.
6. **The apparent market answer:** Forward curves now estimate future rental prices, and CME and ICE plan to launch compute futures.
7. **Why that answer is incomplete:** Fleet revenue depends on both the rental price and the number of hours sold. A price-index futures contract protects the first variable, not the second.
8. **The stand:** Compute futures can help standardize GPU credit, but they cannot turn market-wide scarcity into this fleet's repayment stream by themselves.
9. **Close:** Ask what evidence or contract would let a lender rely on market-wide demand, then name the observations that would prove the market has solved it.

## Ownership And Novelty

Dave Friedman argues that long compute contracts function as private forward prices. Silicon Data argues that a forward curve is the missing primitive for compute financialization. This article should credit those points rather than presenting them as original.

The article's contribution is the financing paradox and the credit consequence these price tools do not fully resolve:

> Market-wide scarcity is not a claim on one fleet's revenue. A futures contract can protect what each GPU-hour earns. A lender still needs to know how many hours that fleet will sell.

The piece then uses USD.AI, Lambda, Vultr, NVIDIA, and current contract-backed loans to show how lenders and vendors handle that remaining risk.

## Sources

- USD.AI lender conversation on supply constraints and contract demand: [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]]
- USD.AI public pipeline snapshot: [[usd-ai-public-loan-book-snapshot-2026-07-17|USD.AI public loan-book snapshot, 2026-07-17]]
- Short customer commitments versus longer GPU debt: [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch]]
- Lambda, 2024 financing announcement: https://www.businesswire.com/news/home/20240402148086/en/Lambda-Announces-%24500M-GPU-Backed-Facility-to-Expand-Cloud-for-AI/
- Lambda, 2026 senior secured facility: https://lambda.ai/blog/lambda-closes-1-billion-senior-secured-credit-facility
- Davis Polk, components of Lambda's 2026 facility: https://www.davispolk.com/experience/lambda-1-billion-senior-secured-credit-facility
- Willkie, J.P. Morgan's role in Lambda's 2026 facility: https://www.willkie.com/news/2026/05/willkie-advises-jp-morgan-on-1-0-billion-upsized-syndicated-senior-credit-facility-for-lambda
- Vultr, 2025 credit and lease financing: https://www.businesswire.com/news/home/20250623608954/en/Vultr-Secures-%24329-Million-in-Credit-Financing-to-Expand-Global-AI-Infrastructure-and-Cloud-Computing-Platform
- CNBC, Vultr pricing and customer-base context: https://www.cnbc.com/2025/06/23/vultr-raises-300-million-in-debt-from-bank-of-america-citi-goldman.html
- Nebius, 2026 senior secured facility: https://nebius.com/newsroom/nebius-raises-775-million-in-first-secured-debt-financing-to-accelerate-global-buildout
- Nscale, 2026 delayed-draw loan: https://www.nscale.com/press-releases/nscale-signs-1-4bn-delayed-draw-term-loan
- CoreWeave, 2023 financing and executed customer contracts: https://www.coreweave.com/blog/coreweave-secures-2-3-billion-debt-financing-magnetar-capital-blackstone
- IREN, 2026 financing terms and Microsoft security package: https://www.sec.gov/Archives/edgar/data/1878848/000114036126023427/ef20075181_8k.htm
- Macquarie asset finance: https://www.macquarie.com/us/en/about/company/commodities-and-global-markets/specialised-and-asset-finance/asset-finance.html
- Macquarie Fluidstack case study: https://www.macquarie.com/fi/en/insights/accelerating-investment-in-compute-infrastructure-for-fluidstack-a-leading-ai-cloud-platform.html
- USD.AI underwriting policy: https://usd.ai/insights/usdai-underwriting-and-risk-management
- USD.AI public loan dashboard: https://app.usd.ai/loans
- Nodestream GPU financing terms: https://nodestream.ai/products/financing/
- NVIDIA partner program: https://blogs.nvidia.com/blog/nvidia-unlocks-ai-compute-at-scale-capital-partners-to-power-ai-infrastructure-buildout/
- SemiAnalysis NVIDIA backstop analysis: https://newsletter.semianalysis.com/p/nvidia-gpu-debt-backstop-unleashes
- Silicon Data forward-curve methodology: https://www.silicondata.com/products/forward-curve
- Silicon Data forward curve: https://www.silicondata.com/news-room/silicon-data-unveils-first-gpu-forward-curve
- CME compute futures announcement: https://www.cmegroup.com/media-room/press-releases/2026/5/12/cme_group_and_silicondatapartnertolaunchfirstcomputefutures.html
- ICE and Ornn compute futures announcement: https://ir.theice.com/press/news-details/2026/ICE-and-Ornn-to-Launch-GPU-Compute-Futures-Contracts/default.aspx
- Bandi and Su, "(Early) AI Compute Asset Pricing": https://arxiv.org/abs/2607.12156
- Akin Gump, price hedges and remaining production-volume risk: https://www.akingump.com/a/web/112293/aokJ5/rew-reprint-why-corporate-renewable-energy-buyers-4821-3380-06.pdf
- Norton Rose Fulbright, fixed-volume hedge mismatch risk: https://www.projectfinance.law/publications/2019/june/physical-fixed-volume-hedges
- Axpo, collateral requirements created by futures hedges: https://www.axpo.com/ch/en/knowledge/magazine/energy-market/how-hedging-works-in-energy-markets.html
- Dave Friedman, compute index basis risk: https://davefriedman.substack.com/p/compute-derivatives-and-index-basis
- Dave Friedman, "The Compute Market has Multiple Views on Future Compute Prices": https://davefriedman.substack.com/p/the-compute-market-has-multiple-views

## Links

- Draft: [[the-gpu-backed-credit-market-does-not-exist-yet|The Missing Playbook for GPU Loans Without a Long-Term Customer]]
- [[gpu-finance-has-no-public-forward-price-for-second-customer-revenue|GPU finance has no public forward price for second-customer revenue]]
- [[gpu-earning-power-is-macro-level-offtake|GPU earning power is macro-level offtake]]
- [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch]]
- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]
- [[usd-ai-wants-to-diversify-away-named-offtaker-credit-not-eliminate-compute-revenue|USD.AI wants to diversify away named offtaker credit, not eliminate compute revenue]]
- [[dave-friedman-compute-offtake-is-private-forward-market-2026-07-18|Dave Friedman: compute offtake is a private forward market]]
