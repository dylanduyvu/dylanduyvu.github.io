---
type: source
status: captured
created: 2026-07-21
updated: 2026-07-21
source_date: 2026-07-21
source_type: conversation
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, ai-infrastructure, capital-markets]
people: [jakub-janiak]
orgs: [compute-exchange, usd-ai]
attachments: []
tags: [borrower, neocloud, debt-capital-markets, cfo, loan-origination, colo, problem-search]
---

# Jakub: search from the borrower seat and try to assemble a GPU loan

## Raw Context

Dylan shared his current view of GPU finance with Jakub and the broader team:

> where i'm at is essentially i believe that it will be a growing vertical (overall, fs big lending at least). there is very little competition, so it'd prob be easy to gain legitimacy and also bootstrap a following and content (i've noticed outsider likes from ppl following gpu financing related stuff on 2/4 substack posts i've posted w/ no external pushing). we'd absolutely print (b2b, large money deals) if we can identify a problem and solution.
>
> concerns:
> 1/ technical bottlenecks on the LLM front gating financing directions
> 2/ my personal finance catch up work that would continuously need to be done to get to the edge
> 3/ necessity of doing on the ground work (flying out)
> 4/ virtue stances on value creation, making money off rents, etc. (although i don't personally mind as much)

Jakub recommended searching from the borrower side:

> i would do problem search by understanding what the debt cap markets / CFO guys are doing on the borrower side
>
> they are the most forward looking and most finance-technical
> they likely pay the most since it’s critical to their business (private credit guys prob don’t care as much because they can always pass on the deal)
> i think it’s the hardest job in the game

He also suggested trying the borrower workflow directly: find compute, find offtake if possible, and attempt to put together a GPU-backed loan with Dylan and Jakub acting as the proposed operator.

Jakub's bearish structural hypothesis:

> the default scenario rn is big lending, custom contracts, minimal standardization leads to the “optimal finance firm” being a neocloud. they just internalize the problems using headcount and hiring.
>
> so wedging into the market would be either building a neocloud or figuring out how to automate the finance function at the neocloud

In a related thread, Jakub shared [Compute Exchange's hardware market](https://compute.exchange/hardware-market), said a prospective operator could colocate as much as roughly $150 million of GPUs, and then identified colocation vacancy as the likely practical limit. The capacity number and availability have not been independently verified.

## Read

The strongest part of this advice is the seat change. A lender can decline a difficult transaction. The operator's CFO or debt-capital-markets lead has to make the financing work, so this seat should reveal expensive, recurring problems rather than optional diligence annoyances.

Trying to assemble a transaction is also a higher-information experiment than asking another broad interview question. It forces every requirement into the open: equipment and vendor terms, site and power, customer commitments, operator equity, collateral controls, lender diligence, legal work, reserves, repayment schedule, and pricing.

The first version should be a **shadow transaction**, not a committed build. Dylan and Jakub can act as the proposed operator, assemble a credible deal packet, and seek an indicative lender response without buying GPUs, signing a long colocation lease, or promising customer capacity.

## Transaction Map

The commercial triangle is:

1. **Operator / borrower:** owns or controls the GPUs and owes the loan.
2. **Capital provider:** supplies debt and sets the required protections and terms.
3. **Customer / offtaker:** supplies the revenue expected to repay the debt.

But a deployable transaction also needs the physical layer:

- a GPU vendor or hardware source;
- a colocation site with enough power, cooling, networking, and available space;
- an operator capable of installing and running the cluster.

If there is no long customer commitment, equity, a vendor guarantee, an insurer, or another risk-bearing party has to absorb more of the demand risk.

## Experiment Design

### Stage 1: paper deal

- Pick one real GPU configuration, quantity, site, and deployment date.
- Obtain indicative hardware and colocation terms.
- Build a simple operating model under contracted and short-term rental cases.
- Assemble the documents a lender would expect from a borrower.

### Stage 2: market test

- Ask one or more lenders for an indicative structure or explicit decline.
- Record what changes approval, amount financed, operator equity, rate, reserves, repayment speed, and covenants.
- Identify which work is repeated manually and which party owns its budget.

### Stage 3: commitment gate

Do not sign hardware, colocation, customer, or financing commitments merely to complete discovery. Consider a live transaction only if the paper deal reveals both a credible economic opportunity and a problem worth owning.

## What This Can Prove

- Whether colocation, customer demand, operator credibility, deal size, legal cost, or lender capital is the real first bottleneck.
- Whether the finance function contains repeatable work that can become software, data, or a managed service.
- Whether the best company is actually a neocloud that internalizes financing rather than a vendor selling into neoclouds.
- Whether a young uncontracted fleet can earn terms that work for both the operator and the capital provider.

Success is not closing a loan. The first success condition is reaching a credible indicative term sheet or a specific, evidence-backed decline that identifies the binding constraint.

## Links

- Related capital mismatch: [[young-no-offtake-gpu-fleets-carry-equity-risk-without-clear-venture-upside|Young no-offtake GPU fleets carry equity risk without clear venture upside]]
- Related risk-transfer view: [[jakub-compute-futures-tenor-mismatch-take-2026-07-20|Jakub on compute futures and the tenor mismatch]]
- Current claim ledger: [[gpu-loans-without-long-term-customer-claim-ledger-2026-07-19|GPU loans without a long-term customer claim ledger]]
- Area: [[gpu-finance|GPU Finance]]
