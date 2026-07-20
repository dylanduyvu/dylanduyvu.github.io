---
type: synthesis
status: draft
created: 2026-07-17
updated: 2026-07-20
domains: [gpu-finance, credit-markets, compute-contracts, asset-backed-lending]
projects: []
people: []
sources:
  [
    gpu-loans-without-long-term-customer-claim-ledger-2026-07-19,
    lambda-on-demand-gpu-financing-ladder-2024-2026,
    usd-ai-public-loan-book-snapshot-2026-07-17,
    nebius-775m-contract-backed-gpu-financing-2026-07-17,
    semianalysis-nvidia-backstop-trinity-2026-07-06,
    jakub-compute-futures-tenor-mismatch-take-2026-07-20,
  ]
orgs: []
tags: [blogpost, draft, gpu, customer-contracts, on-demand-compute, utilization]
---

# Why New GPU Fleets Can Go Unfunded in a Compute Shortage

---

*[Associated research](https://dylanduyvu.github.io/50-sources/gpu-loans-without-long-term-customer-claim-ledger-2026-07-19)*

*[Revision history](https://github.com/dylanduyvu/dylanduyvu.github.io/commits/main/20-syntheses/the-gpu-backed-credit-market-does-not-exist-yet.md)*

*[Disclosure](https://dylanvu.substack.com/about)*

---

In June, the USD.AI team told me the compute market was supply-constrained. Customers were waiting for GPUs or paying premiums to skip the line.

Yet [USD.AI's own upcoming loan book](https://dylanduyvu.github.io/50-sources/usd-ai-public-loan-book-snapshot-2026-07-17) was overwhelmingly contract-backed. Eight of nine loans, representing 98 percent of the money, were backed by signed customer contracts. The only exception involved GPUs already earning rental revenue.

If customers want more compute than providers can supply, why do lenders still want revenue from specific customers locked in for years?

USD.AI's pipeline is one snapshot, not the whole market. It does not show rejected applications and therefore cannot prove that USD.AI requires a contract. But it captures the distinction between market demand and one fleet's revenue. A compute shortage says customers want GPUs somewhere. A loan depends on revenue from one specific set of GPUs.

That creates a narrower financing problem: how to estimate what a new fleet will earn when its customers may change before the loan is repaid. The examples below handle that risk with long customer contracts, an operator's existing rental and financial history, or a third party promising revenue.

## The lender needs this fleet to stay rented for years

The first problem is timing. The loan may begin before the GPUs are installed and remain outstanding for three years or longer. Today's shortage can disappear before the GPUs start operating.

Strong demand may also be for a different fleet. Customers care about the chip, the cluster size, the networking, the location, and whether the company operating it can keep it running. A customer waiting for one configuration is not automatically a customer for another.

Even a customer that chooses the fleet may not commit for as long as the lender needs. [SemiAnalysis reports](https://newsletter.semianalysis.com/p/nvidia-gpu-debt-backstop-unleashes) that companies renting GPUs to run AI products often want capacity for one year or less because they do not know how much demand their own products will have. Loans are easiest to finance when customers commit payments for several years.

Short customer commitments do not mean demand is weak. An inference company can urgently need compute today while refusing to promise that it will need the same capacity several years from now.

The lender therefore needs to know more than whether compute is scarce. It needs a reason to expect payments from these GPUs over the life of the loan. A long customer contract does that directly. In GPU finance, this kind of contract is usually called an offtake agreement.

## A customer contract gives the lender specific payments

A long contract names the customer. It sets the price, the amount of capacity the customer will pay for, and how long the payments will continue. If the contract lasts through the loan, the lender does not have to guess who rents the GPUs next.

The contract is only as reliable as the customer making the promise. That is why lenders care about the customer's credit as well as the length of the contract.

For example, IREN tied its GPU debt directly to a Microsoft contract in June 2026. It raised $3.6 billion through loans and notes. The [public documents](https://www.sec.gov/Archives/edgar/data/1878848/000114036126023427/ef20075181_8k.htm) gave lenders claims on the financed hardware and the Microsoft payments.

The loan required project cash to exceed debt payments and let lenders demand early repayment if that cushion remained thin for six months. The contract did more than suggest that demand existed. It gave the lenders a defined source of cash and rules for what happened if that cash weakened.

Nebius used a similar idea in July. Its [$775 million facility](https://nebius.com/newsroom/nebius-raises-775-million-in-first-secured-debt-financing-to-accelerate-global-buildout) was backed by installed GPUs and payments from a customer with a strong credit rating.

The GPUs still mattered in both deals. Lenders could recover value by taking and selling them if the projects failed. But while the loans were working, customer payments supplied the cash.

A lender can rely more heavily on the hardware by keeping the loan below a conservative estimate of what the GPUs would fetch in a sale. But a smaller loan leaves the operator to fund more of the build itself. That can protect the lender without providing enough debt for the project to proceed.

A long contract can solve much of the lender's problem, but it moves the burden to the operator. To use this structure, the operator must find a customer willing to promise years of payments, often before the GPUs are installed. That is a high bar when customers running AI products often want capacity for one year or less.

The question is whether a lender can finance the fleet without one long customer carrying the loan.

## Lambda borrowed without requiring long customer contracts

In April 2024, Macquarie arranged up to [$500 million](https://www.businesswire.com/news/home/20240402148086/en/Lambda-Announces-%24500M-GPU-Backed-Facility-to-Expand-Cloud-for-AI/) of financing for Lambda's on-demand cloud. Lambda's customers could rent the financed GPUs without signing long contracts.

So, Macquarie was willing to finance a fleet whose customers change. But the public release does not reveal the rules it used.

Specifically, it did not disclose how much Lambda drew, the interest rate, the share of the hardware cost Macquarie funded, the required repayment schedule, or the minimum rental revenue.

Those missing terms are only part of the problem. Lambda, of course, was not a new operator. It was founded in 2012 and reported more than 100,000 customer sign-ups by the time of the loan. Macquarie may therefore have relied on Lambda's operating history and customer base alongside the expected income from the new fleet. That makes the deal less useful as a model for a young operator.

Lambda has since graduated from a loan tied to one GPU fleet to financing for its broader business. In May 2026, it closed a [$1 billion loan](https://lambda.ai/blog/lambda-closes-1-billion-senior-secured-credit-facility) for GPUs and general company needs. Vultr, another established cloud with hundreds of thousands of active customers, raised a similar [$329 million package](https://www.businesswire.com/news/home/20250623608954/en/Vultr-Secures-%24329-Million-in-Credit-Financing-to-Expand-Global-AI-Infrastructure-and-Cloud-Computing-Platform) in 2025.

By then, both operators had large customer bases and years of financial history. Lenders could judge whether the company as a whole could repay, rather than relying only on rentals from one fleet.

## USD.AI charges for the uncertainty

A younger operator does not have that history. USD.AI offers a different route. It will lend against a GPU fleet with short-term rental revenue, but the uncertainty changes the terms.

Its [lending policy](https://usd.ai/insights/usdai-underwriting-and-risk-management) lists annual interest rates of 7 to 9 percent when a highly rated customer has signed a long contract. A long contract with a less creditworthy customer costs 10 to 12 percent. A loan supported by short-term rentals costs 12 to 15 percent.

But a borrower cannot rely on projected rentals alone. USD.AI requires documented history showing that the operator has already earned revenue from on-demand customers. It also lends no more than 80 percent of the hardware cost, so the borrower supplies the rest. The borrower sets aside enough cash for three months of loan payments and repays the loan over three years.

This is a working method for financing on-demand revenue, but it still requires evidence from an existing rental business. The higher rate pays the lender for the remaining uncertainty around who rents the financed GPUs.

That explains why a market can look short while its loan book still leans on contracts. Lenders do not dispute that customers want compute. They charge for the uncertainty around which fleet those customers will choose and how long they will stay.

One part of that uncertainty is the price those future rentals will earn. Can a market price for future GPU rentals make these loans cheaper and easier for more lenders to make?

## A forward price solves one variable

The compute market is beginning to publish prices for future GPU rentals. [Silicon Data launched a forward curve](https://www.silicondata.com/news-room/silicon-data-unveils-first-gpu-forward-curve) in April 2026. It estimates future rental rates from observed agreements lasting up to three years.

[CME](https://www.cmegroup.com/media-room/press-releases/2026/5/12/cme_group_and_silicondatapartnertolaunchfirstcomputefutures.html) and [ICE](https://ir.theice.com/press/news-details/2026/ICE-and-Ornn-to-Launch-GPU-Compute-Futures-Contracts/default.aspx) have announced plans for financial contracts tied to published GPU rental-price indexes. If those contracts attract enough trading, an operator could protect itself against a broad fall in rental prices.

Together, the forward curve and futures contracts could solve part of the problem. The curve gives lenders a shared estimate of future rental prices. If the futures attract enough trading, they could offset losses when the published price falls.

But fleet revenue has two main inputs.

> Fleet revenue = rental price per hour x hours rented

A price-index futures contract can protect against a broad decline in market rental prices. It does not guarantee the hours rented or the exact price this fleet earns.

Suppose the market rental price stays at $3 per hour, but a young operator loses its main customer and half its GPUs sit idle. The price index has not fallen, so the futures contract does not pay. The operator's revenue still drops by half.

The curve still matters because it gives lenders a shared reference price. Futures could add protection against a broad price decline. Neither tells lenders how many hours this particular fleet will sell.

A different kind of futures contract could cover the missing variable. If someone promised to pay for a fixed number of GPU-hours over several years, the lender would have a longer payment stream even if the operator could not find enough short-term renters.

But that contract would not make the risk disappear. It would move the risk to the buyer or financial counterparty making the promise. Economically, it would start to look like a standardized, tradable offtake agreement.

## NVIDIA may be supplying the long revenue promise customers will not

NVIDIA's program may be one version of that risk transfer. A price hedge cannot promise that customers will rent enough hours, but a revenue guarantee can.

NVIDIA announced a [revenue-sharing and credit-support program](https://blogs.nvidia.com/blog/nvidia-unlocks-ai-compute-at-scale-capital-partners-to-power-ai-infrastructure-buildout/) for partner clouds in July. Its public post does not disclose the detailed terms.

[SemiAnalysis reports](https://newsletter.semianalysis.com/p/nvidia-gpu-debt-backstop-unleashes) that NVIDIA promises partners a minimum amount of revenue for several years. If ordinary customers rent less capacity than expected, the lender can still assume that minimum when deciding how much to lend.

That support covers more than future rental prices. It shifts some of the risk that customers do not rent enough hours to NVIDIA.

## The remaining problem is a new operator with no history and no promised revenue

None of the examples above relies on the general compute shortage alone. USD.AI requires a documented rental history. Macquarie financed Lambda after it had operated for years and built a large customer base. Lambda and Vultr later received broader loans as established companies. SemiAnalysis says NVIDIA's program promises revenue for years even when customers will not make equally long commitments.

But the unresolved case is a young operator with no rental history and no customer or vendor promising years of revenue.

The absence of a long customer contract is not itself evidence of a weak operator. Inference customers often avoid multi-year commitments because they cannot predict demand for their own products. A capable operator built for those customers may therefore face real demand without having years of payments locked in before the fleet is built.

Forward prices do not solve that problem. They can estimate what each rented hour may earn, but not how many hours this operator will sell. Because the operator is new, there is no past rental performance to examine.

A specialist lender may still make the loan after investigating the operator and requiring it to contribute more cash. The terms may work for that deal, but the public record does not reveal a method another lender could apply to the next operator.

The public record therefore does not show a repeatable way to finance enough of a new fleet's hardware cost for the project to proceed when the operator has no rental history and no one promising minimum revenue. Expected market demand alone has not filled that gap.

## Why this matters for compute buildout

This is not an argument that every new operator should receive debt. Debt should favor projects with clearer repayment, and equity may be the right funding for an unproven operator. The open question is whether lenders have a repeatable way to distinguish a capable operator targeting short-term customers from a weak one.

That creates a loop in the visible lending models. Without a long customer contract or third-party revenue promise, the operator needs rental history to borrow enough for the project to proceed. But it needs financing to build the fleet that would produce that history.

If the demand described at the start persists and existing fleets remain full, meeting it will require more compute capacity. If capable operators targeting short-term customers cannot finance new fleets because customer commitments are shorter than the loans, viable capacity may go unbuilt even while customers are waiting for compute. The evidence in this article shows that mismatch, but not how much new capacity it prevents.

## What would change my mind

Three observations would weaken this argument.

1. Young operators begin receiving fleet-level loans large enough for their projects to proceed despite having no long customer contracts, operating history, or third-party revenue promises.
2. Several unrelated lenders make these loans using similar terms and assumptions.
3. Once compute futures begin trading, lenders reduce their need for long customer contracts or guarantees from companies like NVIDIA.

Until lenders have a repeatable way to estimate what a new fleet will earn when its customers may change before the loan is repaid, a compute shortage can coexist with viable new capacity going unbuilt.

If you lend against GPUs or have structured one of these loans, I would like to compare notes. I am at dylanduyvu@gmail.com.
