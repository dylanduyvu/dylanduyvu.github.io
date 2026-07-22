---
type: insight
status: developing
created: 2026-07-22
updated: 2026-07-22
confidence: medium
domains: [gpu-finance, residual-value, asset-backed-lending]
projects: [gpu-residual-value-pricing]
sources: [ccir-gpu-compute-credit-research-audit-2026-07-22]
people: []
orgs: [ccir]
aliases: [a deployed gpu and a liquidated gpu have different values, gpu recovery needs separate operating and liquidation marks]
tags: [gpu, collateral, residual-value, liquidation, going-concern]
---

# GPU collateral has separate going-concern and liquidation values

## Claim

A GPU that remains installed, powered, connected, and rented can be worth much more than the same GPU removed and sold after a default. GPU credit therefore needs at least two separate marks:

1. **Going-concern value:** the discounted income the GPU can earn if the operating setup survives.
2. **Liquidation value:** what the hardware can be sold for quickly after the operating setup breaks.

Current dealer asks are neither mark. They show what sellers request, not what a lender can recover.

## Evidence

CCIR's 2026-07-22 H100 example placed its model-implied deployed earning value at $23,551, the current dealer ask at $22,500, and the trailing executed retail median at $11,500. CCIR also says no current tape measures the market impact of a bulk liquidation.

Across models with enough observations, current asks were roughly 1.2 to 2.0 times executed retail medians. H100 SXM asks were about twice the executed figure. This makes asking prices a poor direct input for lender recovery.

## Why It Matters

- A lender cannot claim the full income value after default unless power, colocation, software, contracts, and servicing can be preserved or transferred.
- Completed single-unit retail sales are better than asks, but still need a haircut for bulk volume, speed, removal, configuration, and market impact.
- Residual insurance, advance rates, and amortization should state which value they use.
- A portable operator record does not preserve going-concern value by itself. Step-in rights and substitute operators may matter more.

## Counterpoints / Uncertainty

- CCIR's income values are models with disclosed assumptions, not completed transactions.
- The executed history is reconstructed from retail sold listings, not institutional dealer or foreclosure records.
- A well-run foreclosure process may preserve more of the operating setup than a simple hardware sale, making recovery fall between the two marks.

## Links

- Source: [[ccir-gpu-compute-credit-research-audit-2026-07-22|CCIR GPU compute-credit research audit]]
- Related: [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- Related: [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|GPU-backed debt is contract-backed with a hardware recovery floor]]
- Project: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Area: [[gpu-finance|GPU Finance]]
