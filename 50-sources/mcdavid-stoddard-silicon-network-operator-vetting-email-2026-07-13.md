---
type: source
status: captured
created: 2026-07-13
updated: 2026-07-14
source_date: 2026-07-13
source_type: email
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, operator-underwriting, tokenization, compute-markets]
people: [mcdavid-stoddard]
orgs: [silicon-network, farmgpu]
attachments: []
tags: [email, operator-vetting, capital-formation, customer-discovery]
---

# McDavid Stoddard / Silicon Network email on operator vetting

## Context

Dylan cold-emailed Silicon Network founders McDavid Stoddard and Paul Hainsworth after reading Silicon's Cluster 00 comparison with BoostRun. The purpose was to learn how a platform that sits between outside capital and physical GPU operators evaluates an operator before capital is deployed.

The first question was abstract enough that McDavid read it as a question about responsibility for SLAs and day-to-day operations. A product audit then established a concrete example: Cluster 01 used pool capital to fund a FarmGPU deployment, while FarmGPU operated and monetized the hardware. Dylan replied with that specific capital flow.

## Raw Thread

### Dylan to McDavid, Paul cc'd - 2026-07-13 17:06 ET

Subject: `cluster 00 economics`

> Hi McDavid,
>
> Your Cluster 00 vs BoostRun breakdown caught my eye. I haven't seen another private GPU operator put its own unit economics next to a SPAC's SEC filings.
>
> Before this, I built Spice Finance, which did $2bn+ of onchain loan origination. I'm now digging into GPU credit full time, particularly how capital gets comfortable with operators that don't yet have an institutional track record. I wrote up the thesis here: https://dylanvu.substack.com/p/the-track-record-that-cant-travel
>
> What interests me about Silicon is that you sit between physical operators and investors. When you bring a third-party operator onto the platform, what do they have to prove before you're comfortable putting the cluster in front of investors?
>
> Dylan

### McDavid to Dylan, Paul cc'd - 2026-07-13 17:24 ET

> Hey Dylan,
>
> I'm not entirely following your question. Are you asking about who manages the SLAs and day-to-day operations for the cluster?
>
> Best,

### Dylan to McDavid, Paul cc'd - 2026-07-13 17:51 ET

> Not exactly. I'm asking from the capital side. For something like Cluster 01, FarmGPU deploys and operates the hardware while the pool funds it. Before deploying that capital, how does Silicon evaluate FarmGPU as the operator?

### McDavid to Dylan, Paul cc'd - 2026-07-13 20:36 ET

> Hey Dylan,
>
> We look at a few things: operational track record, technical competency of the team, and downside protection/collateralization structure.
>
> For FarmGPU specifically, we've worked with them before, so there's a degree of familiarity, but any new operator goes through a full diligence process.
>
> Best,

## Telegram Follow-up - 2026-07-14

After McDavid invited Dylan to continue on Telegram, Dylan asked the unresolved new-operator question directly:

> Dylan: oh yea, following up on the diligence process you mentioned. how do you guys verify a new operator's track record?
>
> McDavid: we just use farm
>
> McDavid: we havent had to diligence anyone else

Dylan then asked how Silicon originally got comfortable with FarmGPU:

> Dylan: got it. how'd you guys originally get comfortable with farm?
>
> McDavid: JM is an advisor to us

McDavid then clarified:

> McDavid: hes the CEO of farm
>
> McDavid: a lot of this portion of the industry is very relationship driven

JM's full name was not established in the thread. McDavid identified him as FarmGPU's CEO and an advisor to Silicon.

## Read

- McDavid's reply does not answer the underwriting question and does not prove Silicon lacks operator diligence. The substantive answer is still pending.
- It does show that the original phrase "what do they have to prove" was too abstract for a multi-sided platform spanning capital formation, asset ownership, servicing, and compute operations. It could be read as asking who performs the work rather than how capital approves the party performing it.
- Cluster 01 is the cleanest public example because the actors and timing are explicit: pool capital funds deployment; FarmGPU deploys and operates; Silicon chooses/manages the pooled assets and servicing layer.
- The sharper discovery-question form names four things: whose capital is at risk, which operator is being evaluated, what decision is being made, and when the evaluation happens.
- The public product still contains the thesis-relevant asymmetry: Silicon makes ownership, balances, and payouts legible, but its public materials do not explain how it verifies that an operator can deploy, perform, report, and remit before outside capital is committed.

## Read, After The Evening Reply (2026-07-13)

- The substantive answer names a three-part diligence frame: operational track record, technical competency of the team, and downside protection / collateralization. Track record is named first, unprompted, by the platform itself.
- For the repeat counterparty, familiarity does the work: FarmGPU gets "a degree of familiarity" because "we've worked with them before." That is the same mechanism the track-record post describes, trust built by watching your own counterparty, operating here at the two-million-dollar tokenized tier. It does not transfer to operators they have not worked with, which is why the new-operator case is the one that matters.
- "Full diligence process" is self-described and unspecified. What it can check independently versus what arrives as operator-provided material is the open fork. A final question forcing that fork was drafted; the exact version sent and the send status were not confirmed at capture time.
- Answer quality: three-hour latency, substantive, no deflection. The concrete framing (named deal, named parties, capital side) converted a confused first reply into a structured answer; the abstract version had stumbled.

## Read, After The Telegram Clarification (2026-07-14)

- Silicon has not yet diligenced a new operator. Its entire observed operator-selection history is FarmGPU, an operator it already knew and had worked with.
- The earlier phrase "any new operator goes through a full diligence process" describes what Silicon says it would do, not a process it has exercised in a real second-operator decision. Silicon may have a checklist, but this exchange provides no practiced evidence for it.
- The actual mechanism is simpler and stronger than the earlier email implied: "we just use farm." Familiarity is not merely one input into diligence here; it has so far replaced the need to diligence another operator at all.
- McDavid attributed Silicon's original comfort with FarmGPU to a direct cross-company relationship: FarmGPU's CEO, identified only as JM, is an advisor to Silicon. This is relationship-based trust, not evidence of a repeatable operator-verification process.
- McDavid generalized the mechanism from his seat: "a lot of this portion of the industry is very relationship driven." Grade this as one market participant's informed characterization, not independent proof that the whole segment works this way. It is consistent with the observed Silicon/FarmGPU behavior and the wider same-counterparty familiarity pattern.
- This supports the portable-history thesis's mechanism but does not validate willingness to pay. Silicon is not yet a buyer seat for new-operator verification because it has avoided the decision the product would help with.
- McDavid is mined out on the current diligence question. The useful re-entry trigger is Silicon considering a second operator, not another hypothetical question now.

## What Remains Open

- HISTORICAL, SUPERSEDED 2026-07-14: What the named "full diligence process" consists of in practice: what Silicon can verify independently versus what it receives from the operator. CONFIRMED SENT 2026-07-14 from sent mail: the fork question went out 2026-07-13 22:20 ET in the confirm-my-guess form. REPLY 2026-07-14 12:26 ET: McDavid neither confirmed nor corrected the guess; he escalated to live chat ("Happy to chat live for a bit if thats helpful. Im @mcdmcdmcdmcd on Telegram. Ping me there."). The fork moved to Telegram. The Telegram answer established that Silicon has not yet diligenced another operator, so the question cannot be answered from its practiced history.
- What Silicon would actually do when it considers its first operator beyond FarmGPU. Revisit only when that decision becomes real.
- Whether Silicon itself makes the provider-approval decision for pooled deployments or relies on RunPod validation, contractual protections, investor choice, or some combination.
- Whether prior-cluster performance changes provider eligibility, capital cost, reserves, economics, or the amount Silicon will fund.
- Whether the direct-compute business shown on Silicon's current homepage uses the same operator and capital controls as the tokenized products.

## Links

- Audit: [[silicon-network-product-and-risk-model-audit-2026-07-13|Silicon Network product and risk model audit]]
- Insight: [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|GPU tokenization makes ownership auditable, not operator performance true]]
- Org: [[silicon-network|Silicon Network]]
- Person: [[mcdavid-stoddard|McDavid Stoddard]]
