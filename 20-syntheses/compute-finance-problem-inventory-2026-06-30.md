---
type: synthesis
status: active
created: 2026-06-30
updated: 2026-07-01
domains: [gpu-finance, ai-infrastructure, compute-contracts, residual-value, compute-derivatives]
projects: [gpu-compute-novation, gpu-residual-value-pricing, gpu-compute-derivatives]
sources: [compute-finance-space-commitment-and-problem-inventory-2026-06-30, usd-ai-call-harry-page-2026-06-29, novation-shelving-decision-2026-06-30, gpu-kbb-demotion-decision-2026-06-30, barkr-thomas-sla-email-reply-2026-07-01]
people: [harry-page, thomas-galbraith]
orgs: [usd-ai, nebius, barkr, nvidia]
tags: [gpu, compute-finance, problem-inventory, customer-discovery]
---

# Compute Finance Problem Inventory

## Current Frame

Compute-finance is now the deliberate search space. Individual ideas should be managed as probes inside this space, not as isolated all-or-nothing pivots. The operating system is: keep an explicit problem inventory, test the cheapest fatal uncertainty for each candidate, and let validated pain earn foreground attention.

## Active Candidate Problems

### 1. SLA / Performance Verification

Status: live probe.

Why it is live: USD.AI volunteered this as an active lender pain and connected it to pricing more aggressively by reducing top-line revenue risk. Thomas at Barkr then confirmed that he has heard this as an issue and that NVIDIA brought up something similar, while clarifying that it is separate from Barkr's hardware warranty lane.

Cheapest fatal test: Thomas/Barkr has partially replicated the pain. Next cheapest step is to clarify what NVIDIA raised and whether the actual product category is verification alone, credit insurance, business interruption, or some hybrid. Await Bernie/American Compute; if useful, add one or two more async lender/insurer/offtaker outreaches.

Kill or demote if: other qualified counterparties do not recognize it as a painful underwriting or pricing problem, or existing monitoring/data-room processes already satisfy lender trust.

Foreground if: multiple counterparties independently say they would pay, change terms, or approve deals faster with credible third-party SLA evidence.

### 2. Naked Valuation Data / GPU KBB

Status: shelved pending buyer-side WTP test.

Why it is not dead: supplier-side evidence favors guarantee wrappers, but Barkr's valuation-only tier is a live counter-signal.

Cheapest fatal test: ask S&P, KBRA, Fitch, and at least one lessor whether they would pay for neutral GPU residual data without a guarantee wrapper.

Kill or demote if: buyer-side conversations do not show standalone willingness to pay.

Foreground if: three independent buyers say neutral residual data is valuable enough to pay for directly.

### 3. Bare Compute-Contract Underwriting

Status: hunch to structure-test.

Why it exists: USD.AI avoids lending against bare compute contracts because there is no recoverable value after default. That may be a dead end, or it may point to a missing structure that makes contract-only lending financeable.

Cheapest fatal test: ask lenders and contract-heavy operators what rights, collateral, assignment mechanics, guarantees, escrow, or insurance would be required to make contract-only exposure lendable.

Kill or demote if: the answer remains "nothing survives default except hardware" across lenders and lawyers.

Foreground if: a repeatable structure emerges that gives lenders recovery or control without owning the GPUs.

### 4. Novation Tripwire

Status: shelved with tripwire.

Why it is shelved: USD.AI and Nebius both point to a supply-constrained market where customers are short capacity, not over-committed and trying to offload.

Tripwire: revisit if GPU supply loosens, next-gen capacity creates a glut, deposits weaken, or multiple operators name committed capacity they want to offload.

Kill or demote if: supply stays tight and no offloader-side demand appears.

Foreground if: stranded commitments reappear with clear buyer/seller liquidity.

## Next Test Plan

- No upcoming Barkr call is scheduled. The Barkr call already happened and is historical evidence.
- Thomas/Barkr replied that SLA/uptime is separate from Barkr's warranty process, but he has heard it as an issue and NVIDIA brought up something similar.
- Follow up with Thomas to clarify what NVIDIA raised and whether the paid product is verification, credit insurance, business interruption, or a hybrid.
- Await Bernie/American Compute's reply to see whether American Compute sees this as RVI-adjacent, deal-comfort-adjacent, or irrelevant.
- If responses warrant it, send one or two more async lender/insurer/offtaker follow-ups for SLA replication plus problem inventory mining.
- Keep updating this inventory after each response so the process stays portfolio-based, not single-threaded.

## Links

- Area: [[gpu-finance|GPU Finance]]
- Source Memo: [[compute-finance-space-commitment-and-problem-inventory-2026-06-30|Compute finance space commitment and problem inventory memo]]
- Core Insight: [[compute-finance-should-be-run-as-a-problem-portfolio-not-a-single-thesis|Compute finance should be run as a problem portfolio, not a single thesis]]
- Related: [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]], [[barkr-thomas-sla-email-reply-2026-07-01|Barkr Thomas SLA email reply]], [[naked-gpu-residual-data-is-demoted-until-buyers-show-standalone-wtp|Naked GPU residual data is demoted until buyers show standalone WTP]], [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]], [[gpu-compute-novation|GPU Compute Novation]]
