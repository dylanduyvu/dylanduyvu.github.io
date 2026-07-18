---
type: synthesis
status: draft
created: 2026-07-17
updated: 2026-07-17
domains: [gpu-finance, credit-markets, compute-contracts, asset-backed-lending]
projects: []
people: []
sources:
  [
    nebius-775m-contract-backed-gpu-financing-2026-07-17,
    usd-ai-public-loan-book-snapshot-2026-07-17,
    semianalysis-nvidia-backstop-trinity-2026-07-06,
    dave-friedman-compute-offtake-is-private-forward-market-2026-07-18,
  ]
orgs: []
tags: [blogpost, draft, gpu, offtake, merchant-compute, earning-power]
---

# GPU Finance Has a Second-Customer Problem

GPU lenders talk about hardware as the new collateral. Their biggest facilities still depend on long customer contracts. Nebius borrowed against an investment-grade payment stream. Nearly all of USD.AI's visible pipeline has offtake. NVIDIA is guaranteeing partner-cloud revenue so lenders can finance capacity serving shorter-term users.

The market can finance GPUs when a creditworthy customer has already committed to pay for them. It is only beginning to finance the same hardware against a changing pool of customers. I call that merchant GPU credit: debt supported by realized utilization and rental income rather than one named offtaker or vendor guarantee.

This matters for inference. Inference providers often avoid multiyear commitments because they do not know how long their own customers' demand will last. The hardware and its debt last several years. If lenders cannot underwrite replacement demand, the operator must find a long contract, accept expensive capital, or raise more equity.

I arrived at this question after chasing two narrower ideas. One was better residual-value data, a Kelley Blue Book for GPUs. The other was a portable record showing whether an operator delivered its prior clusters. Both could improve underwriting. Neither tells a lender who will rent the GPUs after the current customer leaves.

## Nebius still borrowed against the contract

On July 17, Nebius announced its first senior secured debt facility. The [$775 million loan](https://nebius.com/newsroom/nebius-raises-775-million-in-first-secured-debt-financing-to-accelerate-global-buildout) is backed by deployed GPU infrastructure and contracted cash flows from an investment-grade customer. It costs 2.50 percentage points over the benchmark rate and matures in October 2030.

The hardware was already installed and earning revenue. Nebius had an operating history. A broad syndicate of major banks still anchored the loan to one strong customer agreement. Nebius said it could repeat the structure across more than $40 billion of additional contracted revenue from customers including Microsoft and Meta.

The announcement does not tell us what Nebius could have borrowed without the contract. Maybe the answer is less money at a higher rate. It does tell us what a broad bank syndicate funded at scale: deployed GPUs plus an investment-grade payment stream.

## USD.AI's own loan book

USD.AI is where this argument should fail.

The company describes its underwriting as asset-based. Its [published policy](https://usd.ai/insights/usdai-underwriting-and-risk-management) says the primary credit anchor is the recoverability of the GPUs, not the creditworthiness of the borrower. The loans sit in isolated entities that hold the hardware, customer contracts, colocation agreements, and revenue accounts. If the operator, the company buying and running the GPUs, fails, USD.AI can take control of the collateral.

USD.AI also presents GPU lending as a successor to software credit. Its [stated thesis](https://usd.ai/insights/the-interest-rate-of-intelligence) is that recurring software revenue is becoming less dependable while GPUs are hard assets that can be seized and sold. Software lenders financed companies. USD.AI wants to finance the chips.

Then look at the loans.

On July 17, USD.AI's [public dashboard](https://app.usd.ai/loans) listed nine upcoming facilities totaling $407.45 million. Eight were backed by customer contracts. They represented $399.03 million, or 97.9 percent of the principal. One $8.42 million facility was supported by on-demand rental revenue. None was labeled `No Offtake`, its category for a project with neither a customer contract nor operating rental history.

The pricing policy still depends on the customer. A loan with an investment-grade customer contract costs 7 to 9 percent. A contract with a weaker customer costs 10 to 12 percent. On-demand revenue costs 12 to 15 percent. The hardware can be identical. The quality and duration of the revenue still move the rate.

This is one snapshot of upcoming deals, not funded history or rejected applications. Borrowers may arrive with contracts simply because contracts are available in a supply-constrained market. The visible behavior is still overwhelmingly contract-backed.

USD.AI's real break from incumbent lending is the operator's corporate credit. It cares less about the operator's general balance sheet and more about the hardware and the project's revenue.

## What the hardware does

Customer payments service the debt. The collateral helps set the advance rate and determines how much the lender can recover if those payments stop.

There is nothing unusual about underwriting cash flow and collateral together. These are genuine GPU-backed loans. The open question is how much scalable debt the hardware and merchant revenue can support before a named investment-grade customer enters the structure.

## The better comparison is leased equipment

GPU financing looks more like aircraft or heavy-equipment finance. An aircraft earns through leases. An excavator earns because a contractor can keep it working. Lenders care about the current contract and whether the machine can move to another user afterward.

Those markets have decades of operating data, standardized appraisals, established secondary markets, and records of lease rates and redeployment times. That makes the period between contracts easier to price.

A GPU's revenue depends heavily on the system around it. The same chip can earn differently depending on the site, power, networking, software, operator, and customer base. The financeable asset is the whole compute project, not the box by itself.

Contracts will remain part of GPU finance, just as leases remain part of aircraft finance. A mature market would be able to price what happens after the first contract instead of making one named customer carry the full debt term.

## Residual value does not show the cash-flow path

Most public attempts to improve GPU underwriting focus on residual value, the amount a lender can recover by selling the hardware later. A neutral resale mark would improve the recovery estimate and help set the starting loan size.

Residual value already contains some view of future earning power. A used-GPU buyer pays for the workloads that hardware can still serve. But one resale price compresses the remaining life into a single number. The lender also needs the timing of the cash flows that service debt before any sale.

In [The Compute Market has Multiple Views on Future Compute Prices](https://davefriedman.substack.com/p/the-compute-market-has-multiple-views), Dave Friedman argues that long offtake agreements already contain private forward prices for compute. Each one also bundles capacity reservation, configuration, location, performance terms, customer credit, and financing support. Because the contracts are confidential and hard to compare, lenders cannot pull out a common market price for future compute.

A public forward curve would improve that one input. It would not tell a lender how utilized a specific cluster will be, how long re-rental takes, or how far its realized revenue will move from the reference price.

Merchant compute, capacity sold across changing customers rather than one long contract, therefore requires project-level cash-flow underwriting. Calling it GPU earning power is shorthand. Roughly:

> available GPU-hours x realized utilization x realized rental rate
>
> minus power, colocation, operations, downtime, and redeployment costs
>
> plus terminal resale value

Every input changes over time. Advertised cloud prices differ from realized rates. Utilization depends on the operator's customer book. When a customer leaves, the operator loses revenue and may spend months finding a replacement. A newer chip can push down the rental rate without making the older chip useless.

A compute price index improves the rental-rate input. A hardware appraisal improves the recovery estimate. Operator history may help forecast utilization. A lender still has to combine them into an estimate of what the project will earn across several customers.

A long customer contract makes most of that forecast unnecessary.

## Why long contracts win

An offtake agreement is a contract where a customer commits to buying capacity in advance. A five-year take-or-pay agreement requires payment whether the customer uses the capacity or not. It fixes the buyer, price, and term. The lender no longer needs to guess who rents the GPUs next year or how long replacement takes. The contract turns uncertain merchant income into scheduled payments.

Without a public forward curve, the lender has no independent market price for the cluster's future output. The customer contract supplies one.

Inference customers do not want the same contract. [SemiAnalysis reported](https://newsletter.semianalysis.com/p/nvidia-gpu-debt-backstop-unleashes) that inference providers, companies running trained models for customers, are generally unwilling to sign for longer than one year. The established financing template relies on five-year investment-grade offtake. A cloud serving those customers must fund a long-lived cluster while renewing its revenue one year at a time. The operator keeps the future utilization and rental-price risk because lenders do not know how to price it.

NVIDIA's [new partnership program](https://blogs.nvidia.com/blog/nvidia-unlocks-ai-compute-at-scale-capital-partners-to-power-ai-infrastructure-buildout/) includes credit support for partner clouds. According to SemiAnalysis, the structure uses a multi-year minimum revenue guarantee. The cloud can serve shorter-term customers while the lender underwrites NVIDIA's credit. The cloud gets flexibility. The lender still gets a long contract from an investment-grade company.

NVIDIA may be lowering costs or speeding up deals that could have closed anyway, so the guarantee by itself does not establish that short-term demand was unfinanceable. Either way, NVIDIA supplies the long-dated credit that end customers will not.

## The offtaker is still a credit risk

USD.AI argues that AI is weakening software companies and the recurring revenue that supported the last private-credit cycle. It also argues that GPU finance can replace that corporate credit with hard collateral.

An AI company's promise to pay for compute inherits the same company's credit risk. The contract can be strengthened through prepayment, a letter of credit, cash reserves, assignment rights, or a third-party guarantee. In every case, someone still has to support the payment.

Hardware-first lending would diversify away one named customer, not customer revenue itself. The loan works if another customer can rent the GPUs after a startup fails or a workload moves to a newer chip. Individual contracts remain volatile, but aggregate demand may be stable enough to support the debt.

## What institutional merchant lending would require

A lender would need realized rental income, utilization, operating costs, customer concentration, and time to re-rent after a contract ends. It would also need a forward view of rental rates for that GPU generation and a conservative resale value. Those inputs would set the advance rate, amortization, covenants, and price.

Pooling could reduce exposure to one customer, operator, or location. It would not remove market-wide risk. An AI downturn could hit utilization, rental rates, and GPU resale values at the same time. Merchant pools would still need lower leverage, reserves, insurance, or other protection against that correlation.

This is ordinary project finance applied to a young asset class. The missing pieces are enough history and standardization to underwrite the project without leaning on one long investment-grade contract.

## The hardware-first edge already exists

USD.AI [says its Barkr and Munich Re warranty](https://usd.ai/insights/the-interest-rate-of-intelligence) enables no-offtake structures, and its July dashboard contained one on-demand facility. [American Compute has argued](https://www.amcompute.com/blog/how-to-underwrite-ai-infrastructure-and-gpu-financing) that strong current demand makes smaller merchant projects financeable at conservative leverage.

Merchant GPU credit already exists at the edge. The public examples are still small, expensive, or supported by structural protections that absorb much of the risk. USD.AI's visible upcoming book remained overwhelmingly contracted, and its own policy charges the highest rate for uncontracted revenue.

A different lender may already be financing diversified merchant capacity privately. Rental indices are improving, lenders are building histories, and NVIDIA's backstop gives them time to learn. The market may mature without a new company or product.

## What would change my mind

I would call merchant GPU credit institutional when at least two unaffiliated lenders each close a facility above $100 million against diversified short-term or on-demand revenue, without a named investment-grade offtaker or vendor guarantee. The lenders should use observed utilization and re-rental data to set the advance rate, amortization, and spread.

Those loans do not need to match investment-grade offtake pricing. They should finance a majority of the hardware cost and remain outstanding beyond the current customer contracts. Otherwise the lender has not actually underwritten replacement demand.

Today, the hardware is real collateral. The contract still makes it bankable.

If you have financed merchant or short-term GPU capacity without a named customer or vendor backstop, I would like to see how the deal was underwritten. I am at dylanduyvu@gmail.com.

_[Disclosure](https://dylanvu.substack.com/about)_
