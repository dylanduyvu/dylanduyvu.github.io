---
type: source
status: captured
created: 2026-07-10
updated: 2026-07-13
source_date: 2026-07-10
source_type: call
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, venture-landscape, compute-markets, financialization]
people: [zile-cao]
orgs: [blockchain-capital]
attachments: []
tags: [call-notes, venture-capital, market-map, financialization, negative-space]
---

# Call: Zile Cao (Blockchain Capital) on the crypto-compute stack

## Context

30 minutes, 2026-07-10. Participants: Dylan and Jakub (co-founder) with Zile Cao (Research Engineer, Blockchain Capital). Kinjal is Zile's colleague at Blockchain Capital; a market map Zile made may be shareable pending Kinjal's sign-off. Transcript note: the recorder merged Dylan and Jakub into one "Me" track, so questions from our side are attributed jointly, not individually. Prep doc: [[zile-cao-blockchain-capital-call-prep-2026-07|here]], scored in its Outcome section.

Attribution discipline: one or two market observations below are stated at pattern level without pinning them to Zile, deliberately; he hedged how freely some deal-flow color should travel, and this vault is public.

## The headline: the negative-space finding

Asked to map the space he is actively diligencing, Zile walked the full stack unprompted for half an hour: neoclouds, marketplaces and aggregators, financialization, decentralized inference and training. THE VERIFICATION AND CREDIT LAYER NEVER APPEARED. Not dismissed, not contested: absent from his taxonomy. Asked directly about financing the compute buildout, his answer was that he has not dug into it, plus one tokenization deal (below). His own census: every category on his market map has "10, 15 companies all above 100 mil" EXCEPT financialization, which he counts at roughly four Series B stage players (the Ornn class; one funded early by Andreessen per his recall; SF Compute adjacent; Hyperbolic a late entrant).

Scope caveat, held honestly: this is the CRYPTO pitch-flow. It establishes that nobody crypto-native is pitching the verification or credit seat; it cannot see traditional fintech pitching traditional venture. Still the best competitive census to date, and the zero-pitch-layer question from the prep doc answered by omission. Follow-up queued to convert omission into statement (Telegram, open channel): across everything pitched, anyone building lender-facing verification or track records?

## His stack map (his framing, compressed)

- Neoclouds (CoreWeave, Lambda, Nebius, Fluidstack): sold out; signing 3-year enterprise reserved contracts. Hyperscalers always have supply; the GPU-native clouds do not.
- Marketplaces and aggregators (Modal, Lightning, Hyperbolic, Vast, SF Compute class): two value-adds. (1) Onboarding unsophisticated datacenters: small operators who lack cluster scale, hardware breadth, or software expertise get their Kubernetes, caching, and cleanup handled so their hardware can list at all. (2) Pass-through resale: the platform rents from neoclouds long and resells short at a premium.
- His pass-through numbers, capture-grade (his recall, not a filing): roughly $3.50/hour on a 3-year commitment versus ~$7/hour for a two-week self-serve rental. A ~2x TENOR PREMIUM: the first buy-side quantification in this vault of what the financing gap costs short renters.
- Book-running, stated here at pattern level: marketplace operators increasingly reserve compute themselves to resell later at premium; "speculation of GPU and compute" in his words. Consequence logged into the Shkreli console evidence: SOLD-OUT CONSOLES PARTLY REFLECT MIDDLEMEN LONGING INVENTORY, not pure end demand.
- Financialization thesis (the layer he is excited by): tokenize, hedge, short, long compute; build a derivatives exchange; "the degens come in to trade... 10x more volume than spot." Named blocker, unprompted, and the fifth seat to say it: "how do you standardize compute... compute is very heterogeneous... how do you price it?" Different players attack it differently (one indexes evals and benchmarks to price a unit of compute).
- Decentralized training and inference: Pluralis the credible one in his view (compression paper, NeurIPS acceptance, a 30B-parameter crowd-trained run; reference-checked with ML researcher friends); Nous Research and Prime Intellect have pivoted away from training (Nous toward its Hermes agent, which drives revenue). Open problem he flagged as his own diligence next step: keeping model weights hidden from inference hosts (his speculation: the coordinator withholds a fraction of weights so the full model can never be pieced together). Proof-of-useful-work slashing for bad contributions.
- Demand color: inference now the majority of compute use by his recall (he cited 50-70 percent, uncertain); agentic and coding model demand did NOT plateau as expected through late 2025; compute scarcer than 2025 ("a year and a half ago I was renting GPUs on Hyperbolic; these days everything is sold out").

## The silicon.net pass: the thesis making a capital decision

The one financing-adjacent deal he has seen: silicon.net, tokenizing fractional GPU shares as a datacenter funding mechanism. Datacenters bring GPU inventory; the platform tokenizes it and runs a public sale; buyers get revenue share on the rent; sale proceeds fund the datacenter's next inventory purchase (front-running revenue). The platform manages the book: squeeze value from aging H100s, dump them to secondary markets, rotate into the next profitable hardware.

He PASSED. His reasons, near-verbatim: GPU values depreciate rapidly, so why would holders keep the token rather than dump it; "who are these silicon.net guys that think they can manage this risk"; and is there even enough secondary liquidity to offload that much hardware when it ages out. Reading: a capital allocator declined a GPU-financing deal BECAUSE nobody can price depreciation or trust the residual risk management. The missing-residual-mark thesis causing an allocation decision, from an unexpected seat. Behavioral-grade evidence.

### 2026-07-13 audit correction

The initial description was directionally right but compressed several products. Silicon supports specific-GPU NFT pre-sales, a pooled ERC-20 claim on GPU NFTs and USDC, provider servicing/payout software, secondary trading, and now a direct-compute surface. Cluster 01 specifically used pre-deposits to fund a FarmGPU deployment. The core pass signal survives: tokenization makes ownership and payouts more legible but leaves operator deployment, reporting, remittance, and residual-management risk offchain. Full audit: [[silicon-network-product-and-risk-model-audit-2026-07-13|Silicon Network product and risk model audit]].

## Seat calibration (prep prediction confirmed)

He has never talked to a lender; the credit stack is untouched in his research; his sharpest market takes are secondhand (the Hyperbolic founder, whose "narrative shifts week by week" and is drifting toward book-running and hedge-fund dynamics). The Blockchain Capital pipeline contains nothing resembling primary lender evidence, which makes that evidence upstream-unique in this relationship. Validation of lender-behavior claims is not available from this seat; do not spend future slots on it.

## Doors opened

- Jasper Zhang (Hyperbolic): triple-warm route: Jakub's prior contact, Zile's explicit endorsement ("surprisingly responsive... best grasp of the situation"), shared group context. Jakub's thread to fire.
- Kinjal's market map: pending sign-off; nudge in a week if quiet.
- Open Telegram channel for follow-ups; the unasked verification question goes there.

## Promoted

- 2x tenor premium and the book-running caveat into [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|the tenor mismatch insight]]
- Book-running caveat into [[compute-derivatives-need-vintage-curves-not-a-generic-benchmark|the vintage curves insight]] (Shkreli evidence annotation)
- Standardization blocker as fifth-seat evidence into [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|the verification gap insight]]
- Silicon audit into [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|the tokenization does not verify operator performance insight]]

## Open Questions

- ANSWERED 2026-07-14 via Telegram (asked 2:11 PM, answered 2:50-2:51 PM). Dylan: "btw across everything you've seen pitched, is anyone building verification or track record stuff aimed at lenders (that fund datacenter buildout)?" Zile, verbatim: "like credit score?" / "or infra reliability" / "i've seen people build software to plug into data centers to verify the work they're offering is genuine and not underspecced" / "+ track metrics and uptime etc" / "but nothing aimed at lenders." READ: the negative space upgrades from inference (seat never appeared in his unprompted walk) to statement (asked directly, nothing lender-aimed). The ADJACENT CATEGORY EXISTS: customer-aimed datacenter verification software (genuineness, spec checks, metrics, uptime), meaning the sensor substrate is being built and the open wedge is the aim at capital; those teams are the nearest-competitor set, one pivot away. His clarifiers ("credit score? or infra reliability?") show the category has no crisp name even in a sophisticated infra head. SCOPE GUARD: his "nothing" covers the crypto pitch flow; Aravolta (lender-aimed collateral EXISTENCE checks) exists outside it, so the precise claim is: nothing track-record-shaped aimed at lenders has crossed this flow. FOLLOW-UP STAGED: "who's building the plug-in verification stuff? curious who's furthest along" (names = watch list and possible sensor-layer partners).
- Silicon provider diligence remains open after the landscape audit: what standards sit behind its public claim of "strict standards"?
- Does Kinjal's market map have a credit or verification column at all?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- People: [[zile-cao-blockchain-capital-call-prep-2026-07|Zile Cao (prep note)]]
- Orgs: Blockchain Capital (no hub yet; create if relationship deepens), [[silicon-network|Silicon Network]]
- Related Insights: [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|thesis note]], [[a-gpu-has-three-obsolescence-curves-not-one|three curves]]
