---
type: insight
status: developing
created: 2026-07-22
updated: 2026-07-22
confidence: medium-high
domains: [gpu-finance, residual-value, asset-backed-lending]
projects: [gpu-residual-value-pricing]
sources: [ccir-gpu-compute-credit-research-audit-2026-07-22]
people: []
orgs: [ccir]
aliases: [public gpu collateral amortizes to zero, gpu loans do not yet leave a residual balloon]
tags: [gpu, amortization, residual-value, balloon, credit]
---

# Public GPU loans do not yet credit residual value

## Claim

Public GPU-loan amortization schedules currently appear to repay principal as if the collateral were worth zero at maturity. CCIR says all 17 disclosed GPU-collateral schedules it found amortize the collateral balance to zero, and none cites a market residual value.

This is strong evidence that lenders may consider GPU recovery in downside analysis without giving borrowers formal borrowing credit for a future resale value.

## Why It Matters

The sharp residual-value adoption test is no longer whether a lender says GPU collateral matters. It is whether a real loan:

- leaves a balloon balance against expected GPU value;
- uses partial rather than full amortization because of that value;
- sets an advance rate or borrowing base from an external residual benchmark;
- cites a residual warranty, appraisal, or market series in the documents.

The first public transaction doing one of those things would be stronger evidence of willingness to pay than another residual report or appraisal request.

## Counterpoints / Uncertainty

- CCIR's sample covers disclosed schedules, not the full private market.
- Full amortization can reflect conservative lender preference even when the collateral has obvious value.
- Some loans may benefit from residual insurance or asset recovery without exposing that value in the amortization schedule.

## Links

- Source: [[ccir-gpu-compute-credit-research-audit-2026-07-22|CCIR GPU compute-credit research audit]]
- Related: [[gpu-collateral-has-going-concern-and-liquidation-values|GPU collateral has separate going-concern and liquidation values]]
- Related: [[naked-gpu-residual-data-is-demoted-until-buyers-show-standalone-wtp|Naked GPU residual data is demoted until buyers show standalone WTP]]
- Project: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Area: [[gpu-finance|GPU Finance]]
