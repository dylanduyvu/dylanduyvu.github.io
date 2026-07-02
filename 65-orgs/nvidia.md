---
type: org
status: active
created: 2026-07-01
updated: 2026-07-01
aliases: [NVIDIA, Nvidia]
people: [dylan-patel]
projects: []
domains: [gpu-finance, ai-infrastructure, semiconductors]
tags: [gpu, chips, allocation, channel-strategy]
---

# NVIDIA

## Context

NVIDIA sits upstream of everything in this vault: it makes the GPUs, controls allocation (who gets chips and when), sets the obsolescence clock (architecture release cadence drives residual decay), and defines the reference grade (DGX). It sells chips/modules at ~mid-70s gross margins through OEMs (Dell, HPE, Supermicro) and ODMs (Foxconn, Quanta), while allocation is negotiated with NVIDIA directly - the money flows through the OEM, the permission flows through NVIDIA.

## Known Claims / Signals

- Allocation is a strategic lever, not a price-clearing queue: smaller operators face 6-9 month lead times partly as an allocation-priority story.
- Per Dylan Patel (2026-06-30): Jensen funds neoclouds and neolabs on purpose; a GPU sold to CoreWeave today weakens Google TPU and Amazon Trainium in ~5 years.
- Working strategy model: NVIDIA fragments its demand side because only hyperscalers can fund defection (custom silicon); neoclouds are captive distribution that also drains hyperscaler cloud share. See [[nvidia-fragments-its-demand-side-because-only-hyperscalers-can-defect|the fragmentation insight]].
- Selective up-stack integration: DGX systems (reference machines), NVL72 rack-scale, DGX Cloud - it takes the reference-design layer, not the box-building layer, and offloads capital intensity (inventory, depreciation, debt) down the chain while holding none of the residual risk its cadence creates.
- Via Thomas/Barkr (2026-07-01): an NVIDIA-adjacent conversation raised operator usage/SLA monitoring; the concrete ask traced to a lender in a specific deal. NVIDIA's interest in bankable contracts makes sense structurally: financeable operators buy more chips.
- NVIDIA reportedly supplies compute to Thinking Machines Lab (with Google Cloud), part of the neolab-side fragmentation play.

## Open Questions

- How durable is the neocloud allocation tailwind if hyperscaler silicon matures or the strategic need recedes? (Concentration risk upstream of all contract-book risk.)
- Is DGX Cloud a contained hedge or the start of a first-party posture shift that would compete with the borrower universe?
- Does NVIDIA's interest in operator financeability ever become a product or program (vendor financing, certification, telemetry standards) that reshapes the verification space?

## Related Sources

- [[semianalysis-dylan-patel-neocloud-thesis-2026-06-30|SemiAnalysis (Dylan Patel) on the neocloud thesis]]

## Related Insights

- [[nvidia-fragments-its-demand-side-because-only-hyperscalers-can-defect|NVIDIA fragments its demand side because only hyperscalers can defect]]
- [[nvidia-cares-about-sla-verification-because-bankable-contracts-drive-gpu-demand|NVIDIA cares about SLA verification because bankable contracts drive GPU demand]]
- [[dgx-reference-spec-is-a-compute-grade-not-a-market-hub|DGX reference spec is a compute grade, not a market hub]]
- [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]]
- [[gpu-pricing-opacity-is-structural-not-just-immature|GPU pricing opacity is structural, not just immature]]

## Related Areas

- [[gpu-finance|GPU Finance]]
