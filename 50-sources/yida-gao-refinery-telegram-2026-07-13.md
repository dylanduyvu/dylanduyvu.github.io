---
type: source
status: captured
created: 2026-07-13
updated: 2026-07-13
source_date: 2026-07-13
source_type: chat
projects: []
domains: [gpu-finance, credit-markets, datacenters]
people: [yida-gao]
orgs: []
attachments: [Screenshot_2026-07-13_at_3_14_17_PM.png, photo_2026-07-13_15_14_26.jpeg, photo_2026-07-13_17_16_35.jpeg]
tags: [telegram, refinery, powered-colo, dscr, warm-path, keep-warm]
---

# Yida (Refinery, via Telegram): powered-colo bet forming inside our own cap table

REWRITTEN 2026-07-13 evening, superseding the same-day first capture. The original note over-resolved two readings within hours (borrower chair; landlord). This version carries his statements verbatim and holds the tensions open. Relationship: yida is our last round's LEAD INVESTOR (VC), warmest possible channel, cap-table sensitivity on everything here.

## The company

REFINERY, incubated by yida, deck-stage. Tagline "Compute Where Power Exists." Modular micro data centers (cabins, 70-280kW nodes) at qualified host sites, aggregated and run as one network. Draft site: refinery-project-site.vercel.app. Site strengths: the thesis line ("the bottleneck is not demand, it is the path to power"), the one-campus-queue vs nodes-where-power-works comparison, Atlas site-scoring kept off the public page.

THEIR BET, compressed: powered-colo arbitrage. Grid interconnection queues for large loads run years; small pockets of already-connected underused power exist everywhere; a cabin fits almost anywhere; aggregate hundreds of pockets into one logical facility, capacity in months. (Same observation Choi made from the financing side: power is the big guys' bottleneck, small clusters of energy are findable.) Skeptic side, held: neocloud tenants mostly want dense contiguous capacity, so the addressable tenant skews latency-tolerant small-footprint inference; host sites add ops mess a Tier 3 building lacks; per-kW build costs on tiny nodes usually run worse; the format has a thin track record (distributed-power compute tried mostly from the mining direction, mixed survivors). ATOMS BUSINESS consequences: capital per unit of growth, so equity-only has a shelf life measured in cabins; milestones are physical (months per site, cost per kW, uptime per node); execution-risk legibility eventually becomes their lender problem, the thesis one layer down the stack.

## His statements, verbatim

2026-07-13 ~3:10 PM (to "are you involved in / adjacent to any gpu financing deals for datacenter buildouts"): "Yes I am." "A company im incubating does modular data centers." "I was just working on the financial model." "Rough draft of new site. Don't mind the shitty logo."

2026-07-13 4:51 PM (to the equity-or-lenders question): "we are aggregating our modular DC's up to 1GW is the high end goal" / "since we are DC, our customers are the neoclouds" / "equity most likely" / "and we may partner with superx or supermicro to get the servers contributed in kind."

## Model facts (two screenshots, same day)

V1 (~3:14 PM): DSCR by leverage, Y2 with 2% hosting escalation, target >1.25x; hosting fee columns $0.180-0.350/kWh ($130-252 /kW/month equiv); debt 55-80%; DSCR 0.73-2.35. DSCR by power cost annotated power nets to zero at PUE pass-through (power-cost-invariant). Equity IRR proxy header cut off.

V2 (~5:16 PM): columns re-anchored to $0.225-0.350 with "Yellow = base case" legend (either display cleanup or price re-anchoring; unknown which). Base case identifiable by inference: table 2's constant rows match table 1's 70% debt row, so the center is 70% DEBT, $0.250/kWh, DSCR EXACTLY 1.25 (at target, zero cushion), ~34% equity IRR proxy. New table 4 header: 10-year MOIC with Y6-10 "at degraded terms (recontract step, availability decline, opex escalation)": SHELL-SIDE RESIDUAL MODELING, the DC cousin of the GPU residual question; the recontract step-down number is not visible. Reality anchor: NoVA wholesale colo runs ~$200-215/kW/month; his $0.25/kWh base is $180 equiv, priced under prime wholesale (conservative, or the built-in weird-host-site discount). NOT SENSITIZED anywhere: occupancy/lease-up (a colo lender's primary axis), capex base per cabin, assumed cost of debt. The IRR proxy is annualized cash-on-cash, not IRR, and prints returns even in sub-1.0 DSCR cells.

## Open tensions, deliberately unresolved

1. LANDLORD-TO-OPERATOR SPECTRUM. "We are DC, our customers are the neoclouds" reads landlord; the site's "operated as one AI inference fleet" reads operator-flavored; the in-kind server exploration is the hinge (Dylan's catch: a pure landlord has no use for servers). Bridge readings, ranked by commonness not thesis-fit: (a) seed capacity for the format's cold start, landlord eventually, operator temporarily; (b) hybrid by design, Refinery runs vendor-contributed compute and neoclouds rent capacity; (c) pass-through of vendor hardware to tenants who cannot finance their own (speculative). SuperX verified as a real counterpart: Nasdaq-listed AI server maker shipping 8x B200 boxes, challenger-OEM profile for in-kind deals; Supermicro is the giant version.
2. EQUITY VS THE MODEL. "Equity most likely" for initial sites coexists with a debt-sizing model. Relationship unknown: later-phase leverage, deck furniture showing debt capacity, or debt sought and not yet available. Do not rank without his answer.
3. VENDOR IN-KIND. "May" = exploratory. Terms, title, and balance sheet all unknown. If servers land on Refinery's books, they cross into the unfinanceable 70% layer.

## Status and priority (downgraded 2026-07-13 evening)

NOT the lender-set profile; NOT the record ICP (true first-timer, zero history, out of scope per the ICP note); probably shell-side. KEEP-WARM PERISCOPE, not a workstream. The value is positional, three junctions nothing else in the corpus can see: (1) if debt conversations start, every lender quoting Refinery is route-one data at the format boundary AND a warm wave-two contact; (2) whatever vendor in-kind terms materialize are a backstop-generalization specimen one rung below Google/AMD; (3) if cabins fill, his tenant roster is our ICP and his hosting contracts are their customer-acceptance lines. Plus one immediate ground truth: the hosting fee real conversations land at (feeds thesis and, quietly, our own inference-op cost model).

CALL: conditional, not scheduled. Triggers: discriminator answers come back our-balance-sheet / we-operate; or Refinery enters actual lender conversations. Relationship-hygiene calls with the lead investor run on their own schedule and just carry the pocket questions if they happen.

## Thread state and question ladder

- SENT or sending 2026-07-13 evening, Dylan's wording (merged discriminator, cites the site-vs-message tension): "wait are you guys operating the gpus? or just hosting. cuz you mention operations on the website but from what i can gather you're providing the powered dc for the neoclouds to fill (and operate) right?"
- STAGED, born from his answer: "so the superx servers would sit on the tenants' books, not yours?" (whose-balance-sheet)
- POCKETED: what hosting fee are real conversations landing at.
- CALL-TIER (only if a call happens): the recontract step-down in the MOIC table; the occupancy/lease-up assumption; the cost of debt the model assumes; who racks and runs day to day; incubating means what (advisor to acting CEO); the Zile-style dealflow walk.
- Earlier five-question draft from the first capture: partially overtaken; send status of the original set was never confirmed.

## Held, not for any call

A first-execution-adjacent company incubated by our own lead investor is the softest imaginable landing for a record-product pilot IF the operator readings firm up. Logged so it is not forgotten; unsaid so it is not fumbled. Cap-table dynamics make this doubly a Dylan-only decision.

## Boundaries

- Deck-stage, self-reported, doubly motivated source (our investor, his incubation). Everything is projection until a cabin energizes.
- Model numbers are assumptions, not market quotes, until the hosting-fee question returns.
- This note over-resolved twice on day one; keep statements verbatim and tensions open in all future updates.

## Links

- Sources: [[gpu-lender-question-set-2026-07-13|Question set v1]], [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|USD.AI podcast capture]] (30/70 shell-vs-GPU framing; the power-vs-financing bottleneck line), [[phil-private-credit-jakub-relay-2026-07-13|Phil relay]] (same-day sibling)
- Areas: [[gpu-finance|GPU Finance]]
