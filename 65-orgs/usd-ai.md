---
type: org
status: active
created: 2026-06-29
updated: 2026-07-17
aliases: [USD.AI, USD AI]
people: [harry-page]
projects: [gpu-compute-novation]
domains: [gpu-finance, ai-infrastructure]
tags: [gpu, lending]
---

# USD.AI

## Context

USD.AI is strategically relevant because it lends against GPU-backed infrastructure and sees borrower, collateral, offtake, and lender-risk dynamics directly.

## Known Claims / Signals

- USD.AI describes its lending as fundamentally GPU-backed.
- It treats offtake contracts and customer credit as support for debt service, not as independently recoverable collateral.
- It has not seen customers trying to offload termed-out GPU capacity in the current market.
- It sees supply scarcity as a bottleneck: customers wait for GPUs or pay premiums to skip the line.
- It volunteered SLA/uptime operator-performance verification as a current lender pain.
- It uses value warranties/reinsurance around GPU residual value, at least in the Barkr/Barker-style structure described on the call.
- In a roughly February 2026 Messari interview, Connor Moore described USD.AI's transaction wedge as standardized, nonrecourse, asset-secured execution for $300 thousand to hundreds of millions, with the typical cluster around $30-50 million. His claim is that bespoke private-credit legal economics make that middle unattractive.
- In the same interview, he priced the Barkr/Munich Re placement at 100-150 basis points annually on the loan balance, payable only when borrower default and collateral impairment occur together. It transfers loss severity, not the operating cause of default.
- USD.AI's planned regional hub-and-spoke model relies on local credit funds as originators and underwriters, meaning the front end standardizes execution and distribution more than it eliminates expert credit judgment.
- It already procures continuous infrastructure-level collateral verification from [[aravolta|Aravolta]] (published case study, seen 2026-07-02): "verify, don't trust" - real-time physical presence, serial identity, health, and availability of the GPU collateral, explicitly excluding tenant usage and application performance. Aravolta is plausibly the "verify" in the escrow-on-install-and-verify structure. New name: Conor Moore, co-founder & COO, quoted in the case study.
- Scale reference: on the order of $100M+ deployed against a ~$1.2B pipeline (compiled figures, see provenance note below).
- Public-book snapshot, 2026-07-17: eight of nine upcoming loans, representing 97.9% of upcoming principal, were labeled `Contract`; the ninth was `On-Demand`; none was `No Offtake`. This contradicts a collateral-only reading but fits the full podcast model: de-emphasize borrower corporate credit, then lend against hardware plus offtake or demonstrated rental cash flow. See [[usd-ai-public-pipeline-is-overwhelmingly-contract-backed|the distilled read]].
- The same snapshot showed a pipeline-funding gap rather than a current deployed-capital excess: $308.60M of API-labeled `newDealsCapital` versus $206.36M of idle PYUSD. Active loans were only $100.74M. This is consistent with capital formation lagging origination demand but does not prove unattractive risk-adjusted returns.

## Underwriting Model

> Provenance: this section is Dylan's compiled understanding of USD.AI's underwriting model. It is **not** stated in the 2026-06-29 Harry Page transcript, which only covers the GPU-backed framing, no-recovery-on-bare-contract, supply scarcity, the Barkr warranty, and the SLA pain. Treat the specifics below as unverified until confirmed against a USD.AI source (docs, site, or a follow-up with Sam/Harry). Partial corroboration (2026-07-01): Bernie's AC article independently reports boutique private credit lending to small operators at 12-15%, matching the Tier 2/3 range - the rate ladder looks like market-wide structure, not just one firm's pricing.

The model separates loan *size* from loan *rate*:

- **Hardware sets the loan size and the recovery floor.** Max ~80% LTV, and only in jurisdictions where title to the GPUs can be perfected. USD.AI dollar-values the hardware; it never standalone dollar-values a contract. This is the operational form of [[bare-compute-contracts-have-no-recovery-value-after-default|bare compute contracts having no recovery value]].
- **The offtake contract sets the rate**, graded into tiers:
  - Tier 1 — investment-grade counterparty: ~7-9%.
  - Tier 2 — multi-year non-IG counterparty: ~10-12%.
  - Tier 3 — spot / on-demand: ~12-15%.
  - Tier 1 and Tier 2 generally require 24+ months of remaining term.
- **Structure.** A bankruptcy-remote SPV holds the GPUs, the offtake contract, the colocation agreement, and the revenue. Escrow runs through Wilmington Trust and releases on hardware install + verification.
- **Risk transfer.** Barkr provides a reinsured value warranty (~150 bps/yr) locked on day one, which lets USD.AI synthesize a default swap on loss-given-default. See [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]].

This is the cleanest worked example so far of the [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|contract-backed-with-hardware-recovery-floor]] inversion: the hardware backstops, the contract prices.

## The Contrarian Bet, Reframed (2026-07-16, from Dylan's cross-assistant discussion on commoditization and personalization)

The question was what USD.AI's fundamental bet is, against the current state of the market. Wrong version of the bet: small token PRODUCERS proliferate. Token production has steep scale economies (memory-bandwidth batching, prefix caching, expert parallelism), so serving concentrates, and small token-sellers get squeezed like farmers under concentrated aggregators. Right version of the bet: compute OWNERSHIP fragments even while serving concentrates. USD.AI finances ownership, not serving.

Why ownership can fragment while serving concentrates: the batching advantage belongs to whoever can pool traffic. A workload that cannot be pooled (private weights, continuous use, data that cannot leave) gains nothing from renting, because the landlord cannot batch it with anyone else's traffic either. The renter pays the landlord's margin for zero amortization benefit. For exactly those workloads, owning beats renting, which is USD.AI's mortgage pitch, and Harry's 2026-06-29 answer already shows it in the book: small borrowers use the loans for "proprietary development, running proprietary models," owner-occupied compute down to single RTX 6000 workstations.

Does the bet REQUIRE continuously self-updating personalized models (Dylan's question, 2026-07-16)? No for the base case, yes for the bull case:
- BASE CASE, no personalization needed, three buyer types that own compute today: (1) privacy and sovereignty buyers running commodity open models on data that cannot leave (Connor: governments buy for "sovereign compute control," not unit economics); (2) cost-crossover buyers with steady inference load (Choi: rent runs 70-80 percent of chip value per year, so ownership wins on math alone); (3) edge and small-site buyers needing inference near users. This case supports thousands of organization-level owners.
- BULL CASE, personalization required: for ownership to fragment down to the per-person or per-agent grain (millions of owners), weights must genuinely diverge per owner, funded by continuous machine-scale on-policy learning, because static personalization gets absorbed into adapters and shared serving. The condition does not need to be exponential; divergence only needs marginal value above the roughly 10-100x batching premium, and steady compounding clears that.
- CAVEAT on the bull case: the per-person grain that most needs the condition is also the likeliest to escape to devices, where the financing becomes consumer paper, not datacenter loans. So USD.AI's realistic prize is the organization-grain owner in both cases.

Watchables: on-device capability creep from below; private-expert-hosting economics (shared superstructures) from above; whether agent weight divergence materializes at all; whether personalization layers stay portable across base models (if adapters lock to a base, accrued personalization becomes switching cost captured by the serving incumbent, one more concentration force).

EVIDENCE CHECK ON THE BASE CASE, 2026-07-16, DEEP-RESEARCH VERSION (supersedes the one-search version below, which is preserved for method history). Five tracks, primary or near-primary sources throughout. VERDICT: the base case is confirmed with verified inputs, at slower breakeven than the first pass claimed.

1. Rental price, verified: Lambda publishes $2.99 per GPU-hour on-demand for H100 ($3.99-4.29 for some SXM configs, clusters from $2.76 reserved); a 46-provider live tracker shows a $3.39 average, DOWN roughly 4 percent year over year. A rented 8-GPU server-year costs about $210K on-demand, and Dihuni literally publishes "1-Year 8-GPU H100 Rental $210,240," confirming the figure to the dollar; reserved deals run roughly $133-190K a year.
2. Purchase price, verified from non-sellers: refurbished 8x H100 SXM servers with three-year warranties list at $247-259K (Network Outlet, June 2026: Dell XE9680 $249K, Supermicro $247K; bare HGX baseboard $215K elsewhere). CORRECTION: the $150K-a-server figure from Choi and Barkr describes a bulk gray-market channel, not the price a normal buyer can hit; conservative math uses $250K.
3. Operating cost, verified: CBRE's H2 2025 wholesale average is about $196 per kW-month base, roughly $250 all-in, Tier-1 markets to $370, vacancy at a record-low 1.4 percent with prices rising about 6.6 percent a year; a single ~12 kW server at retail rates lands at $30-45K a year all-in. CORRECTION: the earlier $20-30K estimate was light.
4. Breakeven, recomputed on verified inputs: about 1.5 years at full use against on-demand rental, about 2.3 years at 70 percent use, about 2.7 years against discounted rentals; with the gray-market $150K server it drops under 1.6 years. Useful life 5-7 years per multiple sources, so ownership wins with years of margin in every case. GMI Cloud's own published break-even (10,000 sustained GPU-hours monthly for multiple years, about 14 continuously-used GPUs) is consistent.
5. Ownership demand in dollars, from Dell filings and earnings calls: $64.1B of AI orders and $25.2B of AI servers shipped in fiscal 2026 with a $43B exit backlog; $16.1B of AI server revenue in Q1 fiscal 2027 alone, up 757 percent, guidance raised to $60B; customer count grew from over 4,000 to over 5,000 in one quarter across neoclouds, sovereigns, and enterprises, with the chief operating officer describing enterprise buyers as companies running inference and agentic workloads inside their own environments. GAP: Dell does not publish the enterprise slice as a separate dollar figure, so enterprise-ownership growth rests on customer counts and commentary, not a clean revenue split.
6. Trend correction: the "rents up 40 percent, NVIDIA raising rental prices 20 percent" story from crypto aggregators is contradicted by the live tracker (down 4 percent) and stays UNVERIFIED, likely garbled. The spread is stable, not widening, and the crossover never depended on rising rents.

Standing tracker if maintained: the rent-own spread monthly (Lambda list price versus refurb server price versus colo rate) plus Dell's quarterly AI server revenue and customer count. Caveat unchanged: ownership wins only at sustained utilization; bursty workloads should rent. No technical bottleneck audit unchanged: hardware purchasable, open-weight models adequate for non-frontier work, serving software mature, financing live; staffing is a cost, not a missing technology.

COMPANY-LEVEL FOLLOW-ON, 2026-07-16: the cost-crossover buyer is real, but the borrower conclusion needs narrowing. Deepgram directly owns and racks GPUs for production inference; Boson moved from cloud to a 65-node on-prem H100 cluster; DeepL deployed Arion after Mercury. But Perplexity gets dedicated baseline economics through a multi-year CoreWeave cluster, and both Deepgram and DeepL retain cloud for peaks and geography. The durable pattern is [[steady-inference-baseload-moves-to-controlled-capacity-not-always-owned-gpus|predictable inference baseload moving into controlled capacity]], not every successful AI company taking GPU title. For USD.AI, this means inference growth creates financing demand, but the borrower may be the AI company, an SPV, a lessor, or the neocloud.

TECHNICAL CORRECTION, 2026-07-16: "no new invention is required" is supported; "no technical bottlenecks" is too strong. Current systems and serving software already work in production, but utilization, power/cooling, cluster operations, model portability, procurement, obsolescence, and burst/geographic coverage can still block or reshape a purchase. Full evidence audit: [[inference-rent-to-controlled-capacity-evidence-audit-2026-07-16|Do AI companies with steady inference demand buy GPUs?]]

SUPERSEDED FIRST PASS, kept for method history: EVIDENCE CHECK ON THE BASE CASE, 2026-07-16 (Dylan asked how to verify it with evidence; sovereignty leg dropped at his direction, so the case stands on the cost-crossover buyer and the edge buyer). METHOD GRADE, added same day after Dylan challenged rigor: this was ONE web search plus arithmetic, not deep research; input grades marked inline. Market-median H100 rental $2.29-3.12 per GPU-hour (SOLID, multiple independent sources agree on a $2-4 bulk band), so an 8-GPU server rents for roughly $140K a year at full use, $98K at 70 percent. Buying runs $200-450K new (secondary blogs, adequate) or about $150K used (WEAK: seller testimony, Choi and Barkr, the parties whose loans depend on the number; verify against an IT-disposition listing before leaning further). Owner opex roughly $20-30K a year (WEAK: agent estimate from typical power and colo rates, no source). Breakeven of roughly 14-20 months at sustained load follows arithmetically IF those inputs hold. GMI Cloud, a rental provider, publishes a break-even at 10,000 sustained GPU-hours monthly for multiple years, about 14 continuously-used GPUs (NOTE: their blog frames that threshold as high to argue for renting; the two-servers-of-steady-load reframe is ours, arithmetically true but a reframe). Continuation signals (WEAK SOURCES, crypto news aggregators, hold lightly): claimed 40 percent rental rise October to April with sold-out capacity, and a claimed 20 percent NVIDIA rental price increase that is suspect on its face since NVIDIA does not set third-party rental prices; directionally consistent with the flat-to-up reads from Phil, Connor, and Choi, but not independently confirmed. No technical bottleneck exists on the base case (reasoned audit, not researched): hardware purchasable, open-weight models adequate for non-frontier work, open serving software mature, financing live; the one real friction is operational staffing, a cost not a missing technology. DEEP-RESEARCH UPGRADES IF PURSUED: primary pricing pages, non-seller used-server prints, a real colo quote, Dell and HPE enterprise AI server revenue from filings as the ownership time series, and the NVIDIA rental-price story checked against a real outlet. Caveat kept honest: ownership wins only at sustained utilization; bursty workloads should rent.

## Related People

- [[harry-page|Harry Page]] — originations; did the 2026-06-29 call.
- Conor Moore — co-founder & COO; quoted endorsing Aravolta's verification. No hub yet (no direct contact).
- Sam McCulloch — the intro path into USD.AI originations (reached via Manav). No hub yet.
- Evan Meagher — ex-CoreWeave CFO and USD.AI advisor; named routing target for GPU contract-transferability questions (relevant if the novation tripwire fires). No hub yet.

## Related Sources

- [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]]
- [[aravolta-usdai-collateral-verification-case-study-2026-07-02|Aravolta x USD.AI case study]]
- [[usdai-connor-moore-messari-fully-diluted-podcast-2026-07-15|Connor Moore on Messari Fully Diluted]]
- [[usd-ai-public-loan-book-snapshot-2026-07-17|USD.AI public loan-book snapshot, 2026-07-17]]

## Related Insights

- [[bare-compute-contracts-have-no-recovery-value-after-default|Bare compute contracts have no recovery value after default]]
- [[committed-gpu-capacity-is-supply-constrained-not-over-committed|Committed GPU capacity is supply-constrained, not over-committed]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]
- [[gpu-finance-missing-middle-is-partly-a-transaction-cost-problem|GPU finance's missing middle is partly a transaction-cost problem]]
- [[usd-ai-public-pipeline-is-overwhelmingly-contract-backed|USD.AI's public pipeline is overwhelmingly contract-backed]]
- [[usd-ai-upcoming-book-outruns-idle-capital-but-does-not-prove-poor-risk-reward|USD.AI's upcoming book outruns idle capital but does not prove poor risk-reward]]

## Related Projects / Areas

- [[gpu-compute-novation|GPU Compute Novation]]
- [[gpu-finance|GPU Finance]]
