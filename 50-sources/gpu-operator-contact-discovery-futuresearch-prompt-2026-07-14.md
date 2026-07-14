---
type: source
status: active
created: 2026-07-14
updated: 2026-07-14
source_date: 2026-07-14
source_type: outreach_plan
projects: []
domains: [gpu-finance, customer-discovery, credit-markets]
people: []
orgs: []
attachments: []
tags: [outreach, operators, borrower-chair, futuresearch, prompt, contact-discovery]
---

# Operator outreach: contact discovery FutureSearch prompt (ready to fire)

Run in the same FutureSearch thread as the prior lists. Attach: the facility dataset CSV (70-attachments), the neocloud census, and both lender-wave recipient lists. This is the discovery half of the operator packet; the copy, send rules, and borrower-chair question set get built on the results.

## The prompt (paste as is)

Objective: Build a contact list of 60-70 decision-makers at small and mid-size GPU / AI-compute operators (neoclouds), so I can run short interviews about their experience RAISING DEBT for GPU deployments: what lenders pushed on, what they could not prove, and what would have made financing cheaper or faster. I need the person who actually ran the financing, or would run it. Two target pools, roughly equal:

POOL A, financed operators (~30-35 contacts): small and mid-size GPU operators with at least one documented debt facility, lease line, or structured financing 2023-2026. Start from this seed list (I am attaching a facility dataset with deal details): Sharon AI, QumulusAI, Massed Compute, Firmus, Soluna Holdings, Verda (formerly DataCrunch), GMI Cloud, Sesterce, Boost Run, WhiteFiber / Enovum. EXPAND the pool: find other small operators with documented facilities in that window (press releases, SEC filings, trade coverage), especially at the $5M-$100M deal size. For each, note which facility qualifies them (date, lender, size, source link).

POOL B, not-yet-financed operators (~30-35 contacts): small GPU clouds that are actively operating but have no documented debt facility. Source primarily from the current ClusterMAX rating list (clustermax.ai), taking the Bronze and lower tiers, plus other active small providers you find (examples of the profile: Hot Aisle, Cudo Compute, Hyperstack / NexGen Cloud, Ori, Civo, Latitude.sh, Salad, Genesis Cloud, SF Compute, Parasail, Denvr Dataworks). Evidence of active operation required (live pricing page, recent capacity announcements, or ClusterMAX listing).

Who to exclude entirely: CoreWeave, Lambda, Nebius, Crusoe, Nscale, Together AI, and the large public miner-pivots (IREN, Applied Digital, Core Scientific, Hut 8, TeraWulf, Cipher, Galaxy, Bitdeer, MARA, Riot, CleanSpark, Bitfarms); acquired or merged companies (Paperspace, TensorDock, Voltage Park / Lightning AI); and these existing relationships: Hyperbolic, FarmGPU, Silicon Network, USD.AI / Permian Labs, Refinery, American Compute, Barkr, SemiAnalysis. Exclude pure marketplaces and aggregators with no owned fleet (Shadeform, Vast.ai) and decentralized token networks (io.net, Akash, Aethir, Render).

Target roles, in priority order: (1) founder or CEO, since at this size they ran the financing personally; (2) CFO, head of finance, or VP finance, the borrower chair itself; (3) COO. Strongly prefer whoever is quoted in or publicly attached to the company's financing announcement. Maximum 2 contacts per company.

Output format, one row per person: company; pool (A or B); why qualified (Pool A: facility date, lender, size, one source link; Pool B: operating evidence, ClusterMAX tier if listed); person name; title; financing-role evidence if any (quoted in the deal announcement, listed as finance lead); email; email confidence (verified / pattern-inferred / guessed); LinkedIn URL; HQ country; scale proxy (GPU count, funding raised, or revenue if known); artifact note (any public evidence the company documents its own delivery: status page, uptime dashboard, customer case studies, published cluster economics); one-line relevance note.

Quality bars: gather 85-90 raw and cut to the strongest 60-70. Email accuracy matters more than volume: an earlier wave had 15 of 46 addresses fail delivery, which materially weakened the experiment, so verify hard and label confidence honestly per row. Prefer breadth of companies over depth per company. US-first, but include qualifying operators globally. Flag any company that appears distressed, pivoting away from GPU compute, or shutting down. Where the financing-role person cannot be identified, say so in the row rather than guessing.

## Notes

- The artifact-note column is load-bearing: it pre-screens for operators who already document delivery publicly, the best candidates for the one-artifact-one-lender test.
- Pool A openers will be deal-anchored (the wave-two pattern); Pool B openers reference their operation. Copy gets written per row in the packet, not templated.
- Sends are throttled batches of ~25, warm rows (Jasper, FarmGPU via McDavid) fire first outside this list, stop condition: 8-10 conversations booked and at least one operator open to sharing delivery documentation.
