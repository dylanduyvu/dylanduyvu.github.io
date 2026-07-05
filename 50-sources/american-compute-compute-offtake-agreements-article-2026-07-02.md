---
type: source
status: captured
created: 2026-07-02
updated: 2026-07-02
source_date: 2026-07-02
source_type: article
projects: [gpu-compute-novation, gpu-residual-value-pricing]
domains: [gpu-finance, compute-contracts, ai-infrastructure, asset-backed-lending]
people: [bernie-margulies]
orgs: [american-compute, coreweave, nvidia]
attachments: []
tags: [offtake, contracts, sla, msa, credit-support]
---

# American Compute: "Compute Offtake Agreements"

## Context

Second AC blog article read by Dylan (2026-07-02, day after "Who Is Building Compute"). Bernie/AC's review of actual compute offtake MSAs - largely CoreWeave's SEC-filed exhibits (OpenAI, Microsoft, Meta) plus private contracts AC has reviewed. Logged because it documents, in contract language, the mechanisms the vault has so far only had from calls: SLA revenue-crediting, operator substitution machinery, credit support on both sides, and the confidentiality walls around performance data.

URL: https://www.amcompute.com/blog/compute-offtake-agreements

Supplier-side caveat as usual (AC sells RVI), though this piece is mostly descriptive contract review with SEC citations - the most verifiable AC content so far.

## Key Content

Scale and equity entanglement:
- OpenAI committed ~$11.9B over five years to CoreWeave, with CoreWeave issuing OpenAI $350M in stock at IPO price - compute-for-equity embedded in the services contract. The customer captures a slice of the supplier valuation its own commitment creates; deepens the circularity of AI financing (NVIDIA into neoclouds, customers into suppliers) and muddies the arm's-length quality of the offtake a lender underwrites.

SLA mechanics as written:
- Service credits, not cash, are the standard downtime remedy: credits equal to validated outage duration, future-use only (cannot offset past invoices), customer must file claims within ~30 days-2 months.
- Bernie's own editorial: credits are clearly worse for the customer (business delay costs exceed GPU-hours), so customers should pick reputable providers over generous SLAs - i.e., the paper protection is weak enough that only operator delivery behavior matters.
- Hardware-specific SLAs exist (broken node unbilled until restored); sustained SLA failure can be a material breach (HPE/Soluna: six consecutive months) triggering termination + refund of prepaids.
- No-offset clauses: customer must pay invoices even amid disputes (protects lender cashflow).

Operator substitution machinery (novation-adjacent):
- OpenAI's "alternate operator option": on material CoreWeave breach, OpenAI can force the entire contract onto a replacement operator of its choosing within two business days - GPUs stay racked, workloads keep running, new company operates. Legal machinery for swapping a party out of a live compute contract exists at the largest scale (provider substitution, not payer substitution).
- Termination asymmetry: customer breach = owes full remaining balance (provider resale of freed capacity offsets the claim); provider breach = refund of prepaids only.

Credit support on both sides:
- SharonAI's $1.25B MSA with ESDS requires $140M in letters of credit / bank guarantees as customer security, on top of monthly advance payments - offtaker-side credit support beyond deposits. Banks appear here as credit transformers (LC providers) even while private credit does the lending.
- Deposits: HPE/Soluna 30% upfront ($10.3M on $34.3M); IREN/Microsoft 20% per tranche credited after month 24. Extends the vault's 16-25% deposit range.
- OpenAI four-month financial early-warning covenant: must notify CoreWeave if projected unable to pay within 4 months (offtaker-credit telemetry in contract form).

Customer restrictions (standard per AC's review):
- No subcontracting of compute without prior written consent (OpenAI/CoreWeave prohibits subcontracting the bare-metal environment) - at the top of the market, the customer cannot otherwise verify whose hardware they run on.
- Publicity as material breach (Meta/CoreWeave): provider cannot disclose customer identity or relationship.
- Benchmarking restrictions: customers prohibited from disclosing performance/benchmark results without provider consent.
- Customer's DPA governs (Microsoft imposed its own data-protection framework on CoreWeave).
- Feature-removal notice (~12 months); capacity concentration caps (customer protects against being the operator's only real customer - customers doing amateur credit analysis on suppliers).

Provider-favorable clauses:
- Assignment to affiliate "cannot be unreasonably withheld": parent signs MSA, hardware + debt in SPV, Order Form assigned so lenders can perfect a security interest. The clause that makes GPU-backed lending possible; the whole lending market lives inside this customer permission.
- Force majeure spread across three CoreWeave contracts: NVIDIA delayed-not-excused, OpenAI exit after 30 days, Meta exempt during event - same provider, three deals, three different terms. Nothing is standardized.

Rare public price points:
- Bit Digital H200 rates $2.15-$3.40 per card-hour.

## Promoted Insights

- [[offtake-contracts-legislate-what-the-market-cannot-verify|Offtake contracts legislate what the market cannot verify]]
- [[sla-remedies-are-toothless-so-reputation-carries-delivery-risk|SLA remedies are toothless, so reputation carries delivery risk]]

## Open Questions

- Is LC/bank-guarantee support for sub-IG offtakers becoming standard or is SharonAI/ESDS exotic? (Clean de-primed question for Bernie/Harry: "how do you get comfortable when the offtaker isn't rated - rate, structure, or third-party support?")
- Has the OpenAI alternate-operator option (or anything like it) ever been exercised anywhere?
- Do benchmarking gags appear in mid-market contracts too, or only flagship deals?
- What does an LC cost the customer annually (sizes the trapped-capital prize any verification/credit product competes against)?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- People: [[bernie-margulies|Bernie Margulies]]
- Orgs: [[american-compute|American Compute]], [[coreweave|CoreWeave]], [[nvidia|NVIDIA]]
