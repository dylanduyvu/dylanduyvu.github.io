---
type: synthesis
status: draft
created: 2026-07-18
updated: 2026-07-18
domains: [gpu-finance, credit-markets, verification, asset-backed-lending]
projects: []
people: []
sources:
  [
    usdai-connor-moore-messari-fully-diluted-podcast-2026-07-15,
    aravolta-usdai-collateral-verification-case-study-2026-07-02,
  ]
orgs: []
tags: [blogpost, draft, gpu, underwriting, verification, capital-structure]
---

# The Verification Gap Wasn't the Financing Gap

In my last two posts, I argued that GPU credit was missing a portable record of operator performance. Then I tried to find out whether that record would actually change a loan.

The broad thesis did not survive. Lenders care whether an operator can deploy and run a cluster, but when I asked about the record itself, the people I reached could not point to a rate, advance rate, equity requirement, or approval that it would change. They already handle uncertain operators through financials, reference calls, customer contracts, equity, reserves, insurance, and control of the collateral.

Direct performance telemetry may be missing. But the risk is not untreated.

This came from outreach, not a survey. It includes an investor evaluating large private-credit facilities, people working around smaller GPU equipment loans, operators, and public material from USD.AI. The sample is uneven. The pattern was still strong enough to kill the broad version of the idea.

## The question behind the record

My first post on this problem was [The Ununderwritten Half of GPU Credit](https://dylanvu.substack.com/p/the-ununderwritten-half-of-gpu-credit). It argued that lenders had machinery for customer credit but no comparable instrument for operator delivery.

The next post, [The Track Record That Can't Travel](https://dylanvu.substack.com/p/the-track-record-that-cant-travel), narrowed the idea. Large operators can turn repeated execution into cheaper and broader financing because ratings, public filings, arrangers, and repeat lenders carry their history. Smaller operators cannot package their history as easily for the next lender.

There was a real reason to test this. One lender volunteered that better visibility into live SLA performance could reduce top-line revenue risk and let the firm price more aggressively. But live monitoring or insurance on a current contract is not the same product as a portable record of prior deployments. I was testing whether history from one deployment could change the next loan.

That left one practical test. Hold the equipment and customer constant. Give the lender a third-party record showing that the operator's earlier clusters went live on time, ran as promised, and produced customer payments. Does anything in the new loan change?

The record only matters as a product if the answer is yes.

## In one large-deal seat, the contract still decided

A private-credit investor evaluating large GPU facilities, whose answers were relayed to me through a colleague, described three separate gates. The operator needs a deployment history. Power must be secured and the equipment committed. The deal also needs investment-grade customer offtake or a comparable credit wrapper.

I asked whether a trusted deployment record could compensate for a weaker customer. His answer was no. A strong operator without investment-grade offtake was still an automatic decline. The risks he named were speculative building, site problems, and a long lease supported by short customer rentals.

Operator history could not fix a mismatch between a long liability and short revenue.

The operator's record was also absent from the pricing formula he described. Pricing began with the customer's own credit curve, then added roughly 1.5 to 2.5 percentage points based on how tight the contract was. Operator diligence determined whether the team could execute the deal. Customer credit and contract quality determined what the debt cost.

The diligence was not missing. His group relied on materials from the lead lender, outside consultants, and industry calls. For operator references, the calls reached former employees, customers, consultants, and the local general contractor.

A new performance record would therefore compete with an existing process. It would not fill an empty seat.

## At the smaller end, cash solves many concerns

The response was different around smaller equipment deals, but it did not favor a verification product.

One residual-value insurer who works with GPU lenders gave a simple example. An unproven operator could get $10 million of equipment financed by contributing $5 million of its own cash. Asked why, he said extra equity can resolve almost any lender concern.

I later held the equipment and customer constant and added the trusted operator record. Would the $5 million contribution fall? He did not know. He added that prior deployments already appear in historical revenue, and most lenders would rather diligence financials than uptime metrics or equipment operations.

That answer does not prove a record has no value. But it shows what the record has to beat. Before an operator has deployed anything, there is no history to verify. After it has operated long enough, revenue, financial statements, references, and lender familiarity begin to carry the history. The portable record therefore lives in the narrow period between those states.

![Where a portable record could matter](../70-attachments/portable-record-window.png)

_A portable record has a narrow opening after performance exists but before financials and lender familiarity make it redundant._

It also has to beat a crude alternative. A lender can advance less money and require the borrower to absorb more of the loss.

## USD.AI uses structure to reduce the operator risk

USD.AI shows the structural approach in its clearest form.

Its [published underwriting policy](https://usd.ai/insights/usdai-underwriting-and-risk-management) says the primary credit anchor is GPU recoverability rather than the operator's general corporate credit. It then builds a loan that limits how much the operator can hurt the lender.

The GPUs, customer contract, colocation agreement, and revenue accounts sit inside a legally isolated entity. USD.AI holds the first lien and control of that entity. The borrower contributes at least 20 percent equity and funds a three-month debt-service reserve. Capital stays in escrow until the hardware is installed and independently verified. The standard loan repays principal in a straight line over three years. A collateral warranty covers part of a shortfall if liquidation proceeds fall below the agreed schedule.

USD.AI still checks whether the operator can install the hardware, run it, and generate enough revenue to repay the loan. A lien cannot make a cluster work.

But the structure reduces the consequences of getting that judgment wrong. The borrower's equity absorbs losses first. Funds stay in escrow until installation is verified. Revenue remains inside the isolated entity, and USD.AI can take control of the collateral and cash accounts after a default. That lets it finance less-proven operators without relying as heavily on years of reputation.

## Lenders do pay for information

Lenders still buy and require plenty of information.

Large lead lenders hire consultants. Participants validate their work through expert calls. USD.AI requires financial statements, purchase orders, contracts, lien searches, and operating revenue history. It also requires independent installation and collateral verification before releasing capital.

The information that gets bought is attached to a transaction and a decision. It can clear a diligence gate, release escrow, size the loan, test a covenant, or support enforcement.

But a portable operator score sits outside any one transaction. It may duplicate financials, references, or a lender's own prior experience. To become a product, it has to earn a budget and change something those substitutes do not change.

This is where my original argument went wrong. I treated the absence of a clean measurement as evidence of missing underwriting. Credit markets often handle risks they cannot measure directly by demanding more protection. The risk can be expensive without being ignored.

## The middle may be expensive to manufacture

The search also produced a competing explanation for the financing gap.

In a [February interview with Messari](https://open.spotify.com/episode/3gxodvhx8c9qarj30jOVrS), USD.AI cofounder Connor Moore said its typical cluster is around $30 million to $50 million. He argued that conventional private-credit processes are too bespoke for many deals in that range. Legal work, diligence, and custom documents make the loan expensive to originate before the lender has taken any risk.

His numbers should be treated as a founder describing his own wedge. The mechanism is plausible. A portable record cannot unlock a loan that is already understood but too expensive to manufacture.

USD.AI's answer is standardized documents, visible committed capital, asset-level security, and a pooled funding base. Its differentiated claim is less about discovering that GPUs have residual value and more about packaging familiar protections cheaply and repeatedly.

That points toward a different problem. Mid-sized GPU operators may need faster closing, predictable terms, standard documents, and capital willing to write the check. Better evidence only matters if it changes one of those outcomes.

## What survives

Operator performance still matters. A bad or absent track record can kill a large deal. Historical revenue can make a seasoned operator easier to finance. Installation verification can determine whether loan proceeds leave escrow.

The product test I took from the search is that verification should control money.

It needs to change approval, borrower equity, the advance rate, amortization, reserves, insurance cost, or the release of funds. A dashboard that makes diligence cleaner but leaves the deal unchanged is a feature inside someone else's underwriting process.

There may still be a window for operators that have completed a few deployments but do not yet have bankable financials. I have not found evidence that this window is large, durable, or willing to pay for a standalone record. It remains a testable corner, not a market-wide thesis.

The question I will carry into the next idea is simple. When someone says a lender needs better data, which line of the term sheet moves?

If nothing moves, the data is not the financing product.

_[Disclosure](https://dylanvu.substack.com/about)_
