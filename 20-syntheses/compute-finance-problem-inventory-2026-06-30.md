---
type: synthesis
status: active
created: 2026-06-30
updated: 2026-07-01
domains: [gpu-finance, ai-infrastructure, compute-contracts, residual-value, compute-derivatives]
projects: [gpu-compute-novation, gpu-residual-value-pricing, gpu-compute-derivatives]
sources: [compute-finance-space-commitment-and-problem-inventory-2026-06-30, usd-ai-call-harry-page-2026-06-29, novation-shelving-decision-2026-06-30, gpu-kbb-demotion-decision-2026-06-30, barkr-thomas-sla-email-reply-2026-07-01, american-compute-bernie-sla-email-reply-2026-07-01, codex-chat-sla-insurance-monitoring-2026-07-01]
people: [harry-page, thomas-galbraith, bernie-margulies]
orgs: [usd-ai, nebius, barkr, american-compute, nvidia]
tags: [gpu, compute-finance, problem-inventory, customer-discovery]
---

# Compute Finance Problem Inventory

## Current Frame

Compute-finance is now the deliberate search space. Individual ideas should be managed as probes inside this space, not as isolated all-or-nothing pivots. The operating system is: keep an explicit problem inventory, test the cheapest fatal uncertainty for each candidate, and let validated pain earn foreground attention.

## Active Candidate Problems

### 1. SLA / Performance Verification

Status: live probe.

Why it is live: USD.AI volunteered this as an active lender pain and connected it to pricing more aggressively by reducing top-line revenue risk. Thomas at Barkr then confirmed that he has heard this as an issue, while clarifying that it is separate from Barkr's hardware warranty lane. His follow-up weakened the NVIDIA-specific read but strengthened the deal-level lender read: in a specific deal, a lender asked whether a product like this existed. Bernie at American Compute added that lenders often do not dig deeply into SLAs; they use prior deployments as a proxy and pass on unknown or unproven operators. The caveat is that SLA monitoring is backward-looking, so the first wedge likely needs prior operator history, underwriting proxies, insurance structure, or lender levers. Bernie's follow-up weakens the pure SLA wedge: the unknown-operator exception he has seen was solved by more operator equity, not SLA evidence. His second follow-up makes that even less SLA-specific: extra equity can generally resolve any kind of lender concern.

Cheapest fatal test: Thomas/Barkr and Bernie/American Compute have partially replicated the pain but also narrowed it. Next cheapest step is direct lender/insurer testing: would verified prior performance, operator diligence, and ongoing monitoring reduce required equity, improve LTV, change pass/approval, unlock coverage, or improve pricing for a repeat operator's next deployment at the same equity level? Also test whether the actual product category is verification alone, usage/default-risk telemetry, credit insurance, business interruption, deal-underwriting infrastructure, or some hybrid. Dylan's current product-shape fork is SaaS / dashboard / FDE for trusted SLA visibility versus an insurance-enabled wrapper.

Kill or demote if: other qualified counterparties do not recognize it as a painful underwriting or pricing problem, existing monitoring/data-room processes already satisfy lender trust, live monitoring has no contractual/insurance lever that changes decisions, or the only lender answer is "bring more equity / lower LTV."

Foreground if: multiple counterparties independently say they would pay, reduce required equity, improve LTV, change terms, approve deals faster, offer coverage, or stop passing on operators with credible third-party SLA evidence and monitored prior performance.

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
- Thomas/Barkr replied that SLA/uptime is separate from Barkr's warranty process, but he has heard it as an issue. He later clarified that the concrete ask came from a lender in a specific deal, not NVIDIA directly.
- Thomas also reframed the broader data gap as usage monitoring to predict default, with insurance possible but limited by cost and accuracy.
- Bernie/American Compute replied that lenders usually do not deeply evaluate SLA performance; they mainly ask whether the operator has done prior deployments and may pass on unknown or unproven operators.
- Bernie then said unknown / less-proven operators can get funded by bringing more equity, e.g. $5M cash against $10M of equipment.
- Bernie then clarified that extra equity can generally resolve any kind of lender concern, making the equity signal broad rather than SLA-specific.
- Stop treating the NVIDIA mention as the main evidence. The sharper evidence is lender-triggered demand in a specific deal.
- Test whether the paid product is SaaS / dashboard / FDE verification, usage/default-risk telemetry, credit insurance, business interruption, or a hybrid.
- Next direct-lender/insurer test: ask whether monitored history from existing deployments would reduce the required equity cushion, improve LTV, change pass/approval, eligibility, advance rate, guarantee/insurance terms, or pricing on the next deployment at the same equity level.
- Separate greenfield build risk from operating SLA risk; do not assume live monitoring can solve pre-build underwriting without prior data or proxies.
- If responses warrant it, send one or two more async lender/insurer/offtaker follow-ups for SLA replication plus problem inventory mining.
- Keep updating this inventory after each response so the process stays portfolio-based, not single-threaded.

## Links

- Area: [[gpu-finance|GPU Finance]]
- Source Memo: [[compute-finance-space-commitment-and-problem-inventory-2026-06-30|Compute finance space commitment and problem inventory memo]]
- Core Insight: [[compute-finance-should-be-run-as-a-problem-portfolio-not-a-single-thesis|Compute finance should be run as a problem portfolio, not a single thesis]]
- Related: [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]], [[gpu-finance-monitoring-may-be-default-risk-telemetry-not-sla-uptime|GPU finance monitoring may be default-risk telemetry, not SLA uptime]], [[sla-monitoring-is-backward-looking-but-can-feed-forward-underwriting|SLA monitoring is backward-looking but can feed forward underwriting]], [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|Less-proven GPU operators get funded through equity cushions, not SLA evidence]], [[barkr-thomas-sla-email-reply-2026-07-01|Barkr Thomas SLA email reply]], [[american-compute-bernie-sla-email-reply-2026-07-01|American Compute Bernie SLA email reply]], [[naked-gpu-residual-data-is-demoted-until-buyers-show-standalone-wtp|Naked GPU residual data is demoted until buyers show standalone WTP]], [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]], [[gpu-compute-novation|GPU Compute Novation]]
