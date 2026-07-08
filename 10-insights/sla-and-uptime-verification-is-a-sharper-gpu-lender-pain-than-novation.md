---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-07-07
confidence: high
domains: [gpu-finance, ai-infrastructure, compute-contracts]
projects: [gpu-compute-novation]
sources: [usd-ai-call-harry-page-2026-06-29, novation-shelving-decision-2026-06-30, compute-finance-space-commitment-and-problem-inventory-2026-06-30, barkr-thomas-sla-email-reply-2026-07-01, american-compute-bernie-sla-email-reply-2026-07-01, codex-chat-sla-insurance-monitoring-2026-07-01, aravolta-usdai-collateral-verification-case-study-2026-07-02]
people: [harry-page, thomas-galbraith, bernie-margulies]
orgs: [usd-ai, barkr, american-compute, nvidia, aravolta]
aliases: [gpu lenders need sla verification, uptime performance verification is a lender pain]
tags: [gpu, lending, sla, uptime, customer-discovery]
---

# SLA and uptime verification is a sharper GPU lender pain than novation

## Claim

USD.AI volunteered operator SLA and uptime performance verification as a more immediate lender pain than contract novation. Better visibility into whether operators meet contracted uptime could reduce top-line revenue risk and let lenders price more aggressively.

## Why It Matters

This is an unprompted, willingness-to-pay-shaped problem from a highly relevant lender. Instead of forcing a novation thesis into a market that appears supply-constrained, the next cheap test should probe whether lenders, insurers, borrowers, or offtakers will pay for trustworthy SLA and uptime verification.

The 2026-06-30 novation shelving decision makes this sharper: if novation is shelved under LBH0, SLA/uptime verification is the better adjacent problem to test rather than a side quest.

The 2026-06-30 compute-finance portfolio memo adds an important constraint: SLA should be treated as a live probe, not the new foreground, until the pain replicates across Barkr and other lenders, insurers, or offtakers.

Thomas's 2026-07-01 reply gives the first replication outside USD.AI, but also sharpens the lane: this is separate from Barkr's hardware warranty / valuation product and may map better to credit insurance or business interruption against the offtaker / contract cash-flow risk.

The NVIDIA mention suggests this may be more than lender-by-lender diligence. If unreliable operator delivery makes customer contracts less bankable, the issue can bottleneck GPU fleet financing and therefore downstream chip demand.

Bernie's 2026-07-01 reply changes the shape of the wedge: some lenders may not be pricing SLA risk at all; they skip unknown or unproven operators instead of evaluating them. That moves the value proposition from only "better terms if visible" toward "turn skipped operators into evaluable operators."

Dylan's 2026-07-01 analysis adds an important constraint: SLA monitoring is backward-looking. It cannot directly prove future performance for hardware that has not been built. The forward-looking value has to come from prior operator history, credible underwriting proxies, insurance/coverage structure, lender levers, or future financing.

Bernie's follow-up weakens the "make unknown operators fundable through SLA evidence" version. Asked how unknown / less-proven operators get funded anyway, he pointed to more equity in the deal: for example, $5M of operator cash against $10M of equipment. That suggests the exception-case lever may be capital structure / lower lender exposure, not verified uptime.

Bernie's second follow-up makes this even less SLA-specific: extra equity can resolve any kind of lender concern. So the fact that equity solves weak-operator deals does not prove the missing variable is SLA transparency. It may just be generic deleveraging.

Thomas's follow-up refines the Barkr/NVIDIA signal. The concrete ask was not "NVIDIA wants this"; it was that a lender in a specific deal asked whether such a product existed. He also broadened the product shape from SLA verification to usage monitoring that can predict default, with insurance possible only if the data is accurate enough and cheap enough.

## Evidence

- 2026-06-29: When asked what problem USD.AI wishes someone would solve, Harry pointed to ensuring contract-related operator performance.
- 2026-06-29: He highlighted service-level agreements with high uptime thresholds, where downtime can trigger top-line revenue credits.
- 2026-06-29: Harry said more assurance around performance and SLAs is an area USD.AI is actively looking at.
- 2026-06-29: He said doing this would let USD.AI price more aggressively by de-risking top-line revenue.
- 2026-07-01: Thomas at Barkr said operator uptime / SLA performance is separate from Barkr's warranty process, but he has heard it as an issue.
- 2026-07-01: Thomas said NVIDIA brought up something similar.
- 2026-07-01: Thomas suggested the product shape may be credit insurance or business interruption against the offtaker, rather than an input to hardware recovery-floor valuation.
- 2026-07-01: Thomas clarified that the concrete product question came from a lender in a specific deal, not NVIDIA directly.
- 2026-07-01: Thomas said the broader data gap could help data centers even without a loan and that monitoring usage to predict default would be useful.
- 2026-07-01: Thomas said an insurance wrapper is possible but difficult, with cost and accuracy as the bottlenecks.
- 2026-07-01: Bernie at American Compute said most lenders do not dig deep into SLAs or the operator's ability to meet them.
- 2026-07-01: Bernie said lenders mainly ask whether the operator has completed a few deployments before.
- 2026-07-01: Bernie said a lender he spoke with normally passes on unknown or unproven operators when SLA/operator performance is uncertain.
- 2026-07-01: Bernie suggested Dylan could help lenders evaluate the operators they currently skip.
- 2026-07-01: Dylan identified the core time mismatch: live monitoring only measures operating clusters, so pre-build underwriting needs prior performance data or proxies.
- 2026-07-01: Asked how unknown / less-proven operators get funded anyway, Bernie said they bring more equity to the deal, such as $5M cash against $10M of equipment.
- 2026-07-01: Bernie then clarified that extra equity can generally resolve any kind of lender concern.
- 2026-07-02: Aravolta's published case study shows USD.AI already buys continuous infrastructure-level collateral verification (physical presence, serial identity, health, availability) under the principle "verify, don't trust" - behavioral proof a lender pays for verification. Aravolta explicitly does NOT collect tenant usage, workloads, or application performance.
- 2026-07-02: AC's offtake contract review documents the SLA remedy mechanics: service credits only (future-use, no cash, customer-filed claims within 30-60 days), with Bernie's own editorial that customers should pick reputable providers over generous SLAs - conceding the paper protection is weak and only operator delivery behavior matters. The customer's selection problem is the same unpriced operator-quality problem as the lender's underwriting problem.

## Implications

- Run one cheap discovery round around SLA/uptime verification before spending more cycles on novation.
- Treat this as the follow-on discovery lane after shelving current-market novation, but do not over-rotate onto it before replication.
- Test who owns the budget: GPU lenders, borrowers, insurers, offtakers, marketplaces, or data center operators.
- Do not treat Barkr as an upcoming call. The Barkr call already happened; Dylan sent async emails to Thomas at Barkr and Bernie at American Compute on 2026-07-01 about USD.AI's volunteered SLA pain.
- Use their replies as the first double-purpose test: SLA replication plus "what pain are you seeing instead?" problem mining.
- Treat Thomas's reply as partial validation and as a product-category correction: the pain may sit closer to credit insurance / business interruption / contract cash-flow protection than Barkr-style hardware warranty.
- Dylan's initial product-shape intuition was SaaS / dashboard / FDE around trusted SLA visibility; Thomas's reply opens an insurance or business-interruption wrapper branch worth testing.
- Bernie adds a second product-shape wedge: evaluation infrastructure that converts unknown or unproven operators from automatic pass to underwritable.
- The commercial outcome may be deal eligibility or approval before better pricing.
- Treat the NVIDIA signal as weakened; the sharper customer-discovery signal is deal-level lender demand.
- Expand the product frame from SLA/uptime verification to usage/default-risk telemetry.
- Ask what "usage" means in buyer language: GPU utilization, contracted-capacity drawdown, customer revenue, workload stickiness, incident frequency, or another default proxy.
- Map the required evidence stack: telemetry, contract terms, monitoring data, incident reporting, revenue-credit exposure, and lender-facing auditability.
- A useful product may look more like verification, monitoring, underwriting infrastructure, or insurance enablement than contract trading.
- Treat existing/repeat operators as the cleaner first wedge; their current deployments can become evidence for the next facility, refi, or insurance policy.
- Do not pitch pure live monitoring unless the lender/insurer has a lever: delayed draws, covenants, reserves, borrowing-base eligibility, claims, renewals, repricing, or future underwriting.
- Test whether SLA/ops diligence can reduce required equity contribution or improve LTV. If it cannot, the priced wedge may be capital structure rather than verification.
- Do not infer SLA-specific pain from equity cushions alone; test whether better operator evidence changes terms at a fixed equity level.
- Position against the existing layer: USD.AI already has collateral-existence verification (Aravolta). The open layer is contract-performance and revenue-crediting verification - what infrastructure telemetry cannot see. Ask Harry what Aravolta-style data still fails to tell them that shows up in pricing.
- Consent asymmetry reshapes the product: operators want verification at origination (credential) and resist it post-close (surveillance), so the natural wedge is operator-volunteered credentialing of completed deployments for the next facility, with post-close monitoring riding on loan docs. See [[operators-want-verification-at-origination-and-resist-it-post-close|Operators want verification at origination and resist it post-close]].

## Counterpoints / Uncertainty

- This is one lender's volunteered pain; it still needs validation across other lenders and operators.
- Barkr's confirmation is secondhand and compact: Thomas has heard the issue and cites NVIDIA, but did not yet describe a paid workflow, buyer, budget, or failed deal.
- Thomas's follow-up weakens the NVIDIA-specific reading; the concrete buyer/problem-owner was a lender in a specific deal.
- Bernie's signal is still indirect: it reflects American Compute's market map plus one lender conversation, not direct lender willingness to pay.
- Existing monitoring tools may solve part of the problem but may not be trusted, standardized, or lender-facing.
- Data access, confidentiality, and liability could make third-party verification hard.
- The "credit insurance or business interruption" framing may point away from pure software verification and toward an insurance-enabled product that requires balance sheet, underwriting, or carrier partnerships.
- SLA monitoring is backward-looking; totally greenfield operators with no prior deployment history may still be skipped unless there are strong proxies, exclusions, deductibles, or sponsor support.
- Bernie has now named equity cushion, not SLA proof, as the observed mechanism for financing less-proven operators. This weakens the "turn skipped operators into underwritable operators" version of the thesis.
- Bernie's second follow-up makes the equity signal broad rather than SLA-specific, so it should be treated as a generic lender-risk workaround.
- The broader compute-finance search space has multiple candidate problems, so SLA needs to earn foreground attention rather than inherit it from novation's failure.
- Aravolta cuts both ways: it proves lenders pay for verification, but it also means the monitoring/dashboard layer is partially claimed at the anchor prospect, and infrastructure-level "continuous availability" may already capture enough uptime that the marginal value of true SLA/tenant-layer verification is small. The remaining wedge also sits behind the exact confidentiality boundary Aravolta chose not to cross.

## Links

- Sources: [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]], [[novation-shelving-decision-2026-06-30|Novation shelving decision memo]], [[compute-finance-space-commitment-and-problem-inventory-2026-06-30|Compute finance space commitment and problem inventory memo]], [[barkr-thomas-sla-email-reply-2026-07-01|Barkr Thomas SLA email reply]], [[american-compute-bernie-sla-email-reply-2026-07-01|American Compute Bernie SLA email reply]], [[codex-chat-sla-insurance-monitoring-2026-07-01|Codex chat on SLA insurance and monitoring]], [[aravolta-usdai-collateral-verification-case-study-2026-07-02|Aravolta x USD.AI case study]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[harry-page|Harry Page]], [[thomas-galbraith|Thomas Galbraith]], [[bernie-margulies|Bernie Margulies]]
- Orgs: [[usd-ai|USD.AI]], [[barkr|Barkr]], [[american-compute|American Compute]], [[nvidia|NVIDIA]]
- Related Insight: [[nvidia-cares-about-sla-verification-because-bankable-contracts-drive-gpu-demand|NVIDIA cares about SLA verification because bankable contracts drive GPU demand]], [[gpu-finance-monitoring-may-be-default-risk-telemetry-not-sla-uptime|GPU finance monitoring may be default-risk telemetry, not SLA uptime]], [[sla-monitoring-is-backward-looking-but-can-feed-forward-underwriting|SLA monitoring is backward-looking but can feed forward underwriting]], [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|Less-proven GPU operators get funded through equity cushions, not SLA evidence]], [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]], [[operators-want-verification-at-origination-and-resist-it-post-close|Operators want verification at origination and resist it post-close]]

## Updates

### 2026-06-29

Initial capture from USD.AI call transcript.

### 2026-06-30

Updated after the novation shelving decision. SLA/uptime verification is now the preferred adjacent discovery lane if Dylan continues exploring GPU lender pain.

### 2026-06-30

Reframed SLA as a live probe inside a compute-finance problem portfolio, not the automatic new foreground. Barkr was initially described as the first cheap replication and problem-mining call.

### 2026-06-30

Corrected the next action: no Barkr call is scheduled; test SLA replication through async emails to Thomas/Barkr and Bernie/American Compute.

### 2026-07-01

Dylan sent the async SLA/uptime follow-ups to Thomas/Barkr and Bernie/American Compute. Next state is waiting for replies before deciding whether to broaden the replication test.

### 2026-07-01

Thomas replied that SLA/uptime is separate from Barkr's warranty process, but he has heard it as an issue and NVIDIA brought up something similar. This is partial replication outside USD.AI and a product-shape correction toward credit insurance / business interruption rather than hardware-value warranty.

### 2026-07-01

Logged Dylan's current product-shape fork: initial instinct was SaaS / dashboard / FDE for trusted SLA visibility, but Thomas's insurance framing may be a meaningful alternative wrapper.

### 2026-07-01

Bernie replied that most lenders do not dig deeply into SLA performance or operator ability to meet SLAs. Instead, they use prior deployments as a shortcut and often pass on unknown or unproven operators. This reframes the wedge as lender evaluation infrastructure that could make skipped operators underwritable, not only a tool for improving terms on already-bankable deals.

### 2026-07-01

Added the backward-looking caveat: live SLA monitoring cannot prove the future performance of unbuilt hardware. The stronger product shape is underwriting plus monitoring infrastructure for repeat operators, lender levers, insurance claims, renewals, and future financing rather than pure dashboard monitoring.

### 2026-07-01

Bernie's follow-up weakened the SLA wedge further: when less-proven operators get funded anyway, he has seen them bring more equity to the deal, e.g. $5M cash against $10M of equipment. This shifts the next test from "can SLA proof make unknown operators fundable?" to "can SLA/ops diligence actually reduce the required equity cushion, improve LTV, or change terms?"

### 2026-07-01

Thomas clarified the NVIDIA mention: the specific ask came from a lender in a deal, not NVIDIA per se. Logged the pivot from pure SLA verification toward usage/default-risk telemetry, with insurance possible but constrained by cost and accuracy.

### 2026-07-01

Logged Bernie's second equity clarification: extra equity can generally resolve any kind of lender concern. This makes equity-cushion evidence less diagnostic for SLA/operator transparency and raises the bar for proving monitoring changes credit terms.

### 2026-07-01

Bernie's AC article reframes the pain as market structure: offtake dies from customer credit (underwritten in tiers) or from operator execution misses where the customer walks without breaching (no underwriting instrument, only proxies). The sharpest unverifiable window may be go-live/milestone delivery, where the contract itself lives or dies pre-revenue. See [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk is the ununderwritten half of GPU credit]].

### 2026-07-02

Found Aravolta's USD.AI case study while the Harry follow-up was in flight. USD.AI already procures continuous infrastructure-level collateral verification from Aravolta ("verify, don't trust"), which is the strongest behavioral WTP evidence yet - a lender pays for verification. But Aravolta's scope explicitly excludes tenant usage, workloads, and application performance, so the collateral-existence layer is claimed while the contract-performance / revenue-crediting layer remains open, sitting behind the confidentiality boundary Aravolta chose not to cross. Expect Aravolta to appear in Harry's answer; the sharper follow-up is what infrastructure-level data still fails to tell them that shows up in pricing.

### 2026-07-02

Dylan's pushback (verification also helps operators get funded) produced the consent-asymmetry sharpening: verification is a credential at origination and a threat post-close, so the willing party is the operator credentialing completed deployments for the next facility. Restates kill #2 as: does verified prior delivery reduce the equity cushion or improve terms at fixed equity?

### 2026-07-02

AC's offtake-agreements article closes the loop from the customer seat: SLA remedies are structurally toothless (credits, future-use only, claims windows), so customers also select on reputation - the third seat converging on unmeasured operator delivery quality. Benchmarking gags and publicity clauses in flagship MSAs define the legal perimeter: any credential must be operator-volunteered and consent-first. See [[sla-remedies-are-toothless-so-reputation-carries-delivery-risk|SLA remedies are toothless, so reputation carries delivery risk]] and [[offtake-contracts-legislate-what-the-market-cannot-verify|Offtake contracts legislate what the market cannot verify]].

### 2026-07-05

NVIDIA's AI Compute Partnership (launched 2026-07-01) may migrate the verification buyer up the stack: NVIDIA now guarantees floor utilization and takes usage-linked revenue share, so the program's economics run through utilization metering and revenue truth - verification as program plumbing rather than deal diligence. Retroactively consistent with the NVIDIA-adjacent monitoring interest Thomas reported. New discovery question for any NVIDIA-adjacent seat: who measures utilization for the backstop and revenue for the share? See [[nvidia-absorbing-utilization-risk-makes-nvidia-the-verification-buyer|NVIDIA absorbing utilization risk makes NVIDIA the verification buyer]].

### 2026-07-05

Status correction: the lender-intro path via Thomas is closed. He declined (2026-07-01 evening) - NVIDIA never shared the lender's identity with him and he isn't comfortable asking. The "lender who proactively asked if the product existed" remains the strongest known demand signal but is currently unreachable through this channel. Remaining paths to a lender seat: Harry follow-up (in flight), Bernie's network, or new outreach.

### 2026-07-06

Gap definition tightened and split into its own note: the open layer is contract-defined delivery and revenue truth - everything between "hardware is working hard" (Aravolta reaches this, including tenant-blind utilization) and "the customer's contract was honored" (nothing reaches this). See [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|The verification gap is contract-defined delivery and revenue truth]]. Companion mechanics: [[loan-covenants-are-enforced-by-self-reporting-not-measurement|covenants run on self-reporting]] and [[mid-term-monitoring-moves-money-through-loan-events-not-the-rate|monitoring moves money through loan events]].

### 2026-07-06

Three-product map, to stop conflation (chat, Dylan's push). Product 1: sensor feed (Aravolta) - hardware on/busy; solves neither seat's stated problem, ingredient to both. Product 2: delivery record - past contracts honored; solves BERNIE's problem (unproven operators at origination: eligibility/cushion), helps Harry only indirectly (better priors on new-deal pricing). Product 3: live contract-level monitoring - SLA hit now, revenue real; solves HARRY's problem (defensive pricing on funded deals); does not exist. Sale structure: Product 2 gets the operator in the door at origination; consent to Product 3 is written into the loan docs as part of the price. Kill-question variants map 1:1 - Bernie-shaped ("would a verified track record cut the cash requirement?") tests Product 2; Harry-shaped ("would live delivery visibility change how you price?") tests Product 3. Which one a lender lights up at determines which product to build first.

### 2026-07-06

WEDGE DECISION (Dylan's call: one wedge, one MVP - the map above is analysis, this is the decision). The wedge is Product 2: verified delivery records that turn skipped operators into fundable ones. Why: (1) zero-build MVP - one manually assembled record for one real operator, put in front of one lender, tested against terms; (2) the strongest evidence backs its problem (Bernie's eligibility gate is observed behavior; Harry's pricing pain is a stated wish); (3) it contains Product 3 as a later upsell (monitoring consent rides in the loan docs), while the reverse produces no time-zero credential. Operational consequence: lender outreach leads with the Bernie-shaped kill question ONLY ("would a verified track record cut the cash requirement, at the same price?"); the Harry-shaped question becomes a listen-for, not an ask. Products 1 and 3 are context, not roadmap, until the record survives the one-report test.

### 2026-07-06

HYPOTHESIS SPLIT (Dylan's correction, supersedes the bundling language above). Products 2 and 3 solve different problems and are SEPARATE HYPOTHESES with separate kill criteria, not one product architecture:

- H2 (eligibility hypothesis): lenders skip unproven operators for lack of a verifiable track record, and a verified delivery record would change eligibility or the equity cushion at fixed price. Evidence: Bernie, observed lender behavior. Status: FOREGROUND. Kill test: the one-report / fixed-equity question.
- H3 (visibility hypothesis): lenders price already-funded deals defensively for lack of live contract-level delivery visibility, and such visibility would behaviorally change pricing or terms. Evidence: Harry, stated wish, n=1, plus a secondhand lender ask via Thomas. Status: SEPARATE, UNTESTED. Passive listen-for during H2 outreach; earns its own test only on its own evidence.
- The bundle (a P2 sale carrying P3 consent in loan docs) is a THIRD, conditional speculation, meaningful only if H2 and H3 both survive independently. It is not a sale structure and not a roadmap. The "sale structure" phrasing in the three-product-map entry and reason (3) of the wedge decision ("contains Product 3 as a later upsell") are hereby marked as speculation that got ahead of the evidence - the wedge decision itself stands on reasons (1) and (2) alone.

Note also: this note's own LBH statement blends H2 and H3 into one claim ("...lack of trusted verification changes financing terms"). Read it as the umbrella pain; H2/H3 are its separable, separately-killable components. The [[operators-want-verification-at-origination-and-resist-it-post-close|consent-asymmetry insight]]'s "unified product shape" refinement and [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|the execution-risk insight]]'s "two faces of one underwritable object" line carry the same blending and should be read under this split.

### 2026-07-07 - Precedent audit: monitoring-first is weakly precedented; the record's true ancestors are checkpoints and pooled outcomes

Dylan's challenge ("is monitoring a naive / cope solution given how analogous industries evolved?") is substantially supported by the analogies record. Across the industries studied, lenders converged on STRUCTURE (cushions, deposits, reserves, fast amortization - Ryan/Lender A's "LTV and amort play" is this verbatim), CHECKPOINTS at risk-conversion moments (draw gates, performance tests, completion certificates), and POOLED OUTCOME RECORDS (payment-history consortiums, no sensors, no operator consent) - not continuous surveillance. Where continuous monitoring did evolve, the risk-bearer owned the monitor (engine maker selling engine-hours, insurer's tracking device, the meter that settles a power contract). Nobody in the record durably sold monitoring TO lenders as a standalone service; and wherever cash became observable, lenders converted observation into POSSESSION (lockboxes, cash dominion, trustee waterfall accounts, deduction at the payment rail) rather than subscribing to a feed.

Three-layer taxonomy this produces (supersedes the two-way machine-vs-contract framing): (1) MACHINE WATCHING - leading signal, two inferential steps from the lender's cash, occupied (Aravolta), no lender-adoption precedent; (2) MONEY WATCHING - zero steps from exposure but lagging, historically collapses into cash control, durable versions owned by the payment rail; (3) the CONTRACT JOIN - was delivery to spec, were the revenue credits legitimate, is the agreement alive. Layer 3 is the genuinely empty seat, and it is adjudication, not monitoring.

Harry re-read under this taxonomy: a billing-tap (read-only into the operator's billing system) would give him revenue truth and near-live credit visibility - most of the visibility half of his wish - but it is still self-reporting with better plumbing unless reconciled against bank receipts or the customer, and it cannot answer the question his defensive pricing hinges on: were the credits LEGITIMATE per the contract? Even full cash control fails there. So H3 in standalone-feed form carries a PRECEDENT-BASED PRIOR AGAINST IT; if the visibility product emerges, precedent says it belongs to the risk-bearer (NVIDIA settling its own floor-and-share, an insurer pricing a wrap) or arrives shaped as control/adjudication, not a dashboard.

Strongest ancestor for the delivery record, newly identified: FACTORING. Invoice financiers verify PROOF OF DELIVERY before advancing (signed receipt, bill of lading) and confirm the invoice directly with the paying customer - per-transaction delivery credentials plus counterparty confirmation, internal to the lender's own process because the factor bears the risk. This both strengthens the checkpoint-shaped version of the record and hints at an unclaimed product shape: invoice finance for compute contracts, where verification IS the underwriting rather than a service sold alongside it.

The one compute-specific counter to the pooled-outcomes precedent, held as hypothesis: default data may be too slow here. The asset lives four to six years and delivery failure destroys value long before a default prints, so a payment-outcome bureau might spend its whole cold-start waiting for a default cycle the hardware outruns - an argument that compute needs a faster (delivery-based) record than history's default-based one. Flagged: this is also exactly what a monitoring vendor would want to believe.

Net effect on the wedge: re-endorses H2-as-record (reframed as checkpoint certification that accumulates, not monitoring-lite), adds the precedent prior against H3, and marks the deal-one-monitoring bootstrap as legitimate ONLY under the narrow job of manufacturing the record for deal two.

### 2026-07-07 - Business shape is a separate question from the problem hypothesis: agency, file business, or lender

Dylan's objection to the inspector-shaped product: one person checking one deployment and writing one report for one lender is billable hours, a consultancy or agency, not a scalable technology business. Correct as stated, and the history contains the resolution: the inspector shape produced two completely different kinds of company, and the difference is not technology versus manual labor. It is what happens to the write-up after it is written.

- Shape A, agency: the report dies with the deal. The lender pays, files it, and every new deal means new hours. Project-finance engineering firms live here permanently.
- Shape B, file business: the write-ups stack into a file on the operator that MANY parties pay to read. Dun and Bradstreet started as human correspondents visiting merchants and writing down whether they paid their bills; the reports stacked into files and the files became a data company. Same story: Carfax (car damage records), PayNet (pooled payment histories, sold to Equifax), the credit rating agencies (one analyst's rating, read by thousands, software-grade margins). Front labor identical to the agency; back economics unrecognizable, because one unit of verification work is resold many times.
- Shape C, be the lender: the factoring pattern. Verification of delivery is internal to the financier's own underwriting, the cost of advancing money, and the data asset accrues as a side effect. Financing compute invoices with delivery verification built in is lending economics, not agency economics. Noted, not adopted: it matches Dylan's on-chain origination background (Spice), but it is a different company than a verification product.

Two testable questions decide between A and B, both askable on lender calls:
1. Does one verification serve many readers? The vault already shows four parties pricing the same blind variable (lenders, insurers, customers, datacenter landlords). Call question: would you rely on a delivery report produced for another lender's deal? If reports travel, Shape B is open. If every lender demands fresh work done for them alone, it is Shape A.
2. Can the rulebook standardize? If every compute contract defines delivered differently and confidentially, hours per report never compress. If a standard methodology emerges (the way ship inspections follow one written rule set), hours fall and the brand becomes the moat. The confidential, bespoke nature of current offtake contracts is the main force pushing toward Shape A.

Honest branch held open: some industries only ever produced large inspection firms, no file business. Fine companies, not the intended one. Whether compute lands there turns mostly on question 2.

The one-report test is upstream of this fork and unchanged: a manual first report is also how Dun and Bradstreet started, and the kill question it answers (does a verified record move terms) must survive before any of the three shapes matters.
