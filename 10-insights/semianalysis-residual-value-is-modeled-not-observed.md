---
type: insight
status: distilled
created: 2026-07-12
updated: 2026-07-22
confidence: high
domains: [gpu-finance, residual-value, verification]
projects: [gpu-residual-value-pricing]
sources: [semianalysis-nvidia-backstop-trinity-2026-07-06, semianalysis-call-prep-2026-07-13, semianalysis-rob-howle-sales-call-2026-07-13, ccir-gpu-compute-credit-research-audit-2026-07-22]
people: []
orgs: [semianalysis, american-compute, ccir]
aliases: [the data incumbent's residual leg is a model, semianalysis has no observed resale leg]
tags: [semianalysis, residual-value, tco-model, american-compute, observed-vs-modeled]
---

# SemiAnalysis residual value is modeled, not observed

## Claim

SemiAnalysis sells residual value as a model, not as a completed-resale dataset. Its transaction-validated product is rental-side: the GPU Rental Pricing Index, built from bilateral contract prices across several tenors. The residual layer inside the AI Cloud TCO Model derives value from future earning power, and no SemiAnalysis product page or sales-call answer identified observed resale, auction, or lessor-return inputs.

The wider market now has some public observed resale evidence. CCIR reconstructed retail sold listings, while American Compute cites proprietary resale data. The remaining gap is narrower than this note first stated: no public institutional bulk-sale, lessor-return, or foreclosure tape has been found.

## Why It Matters

1. The purchase: buying the TCO Model buys methodology plus rental data plus residual assumptions. Price it as assumptions.
2. The thesis: the main research incumbent has no observed residual leg, but CCIR now aggregates public retail sold listings. The white space moves toward institutional bulk recovery and lessor data rather than all observed resale.
3. The derivation risk: the one confirmed holder of actual resale data publicly reports weak correlation between rental indices and secondary sales after backtesting, with 2025 as the live example (H100 rentals fell while median resale rose, because most datacenters could not host Blackwell power densities). That is empirical evidence against earning-power-derived residual marks, which is the exact method the incumbent sells.

## Evidence

- 2026-07-12: AI Cloud TCO Model product page describes residual value analysis "based on future earnings and cash generation power." Package is model access, quarterly updates, methodology calls. No observed-data claim. (https://semianalysis.com/ai-cloud-tco-model/)
- 2026-07-06: the Trinity piece names the lender need as "a model for estimating and tracking GPU residual value" and positions the rental index as their transaction-validated benchmark. The residual side carries no validation claim. (see [[semianalysis-nvidia-backstop-trinity-2026-07-06|trinity source note]])
- 2026-04-06: rental index launch post details the observed side: direct survey, bilateral contract prices, H100 through GB300 plus AMD. All rent, no resale. (https://newsletter.semianalysis.com/p/the-great-gpu-shortage-rental-capacity)
- 2026-07-13: sales call (Rob Howle). Residual described as tracked and forecast downstream of rental inputs; the $20K pricing series confirmed rentals-only on direct ask (11M records, 244 sources, back to 2017, spot and on-demand); no observed resale claim anywhere in the tour. (see [[semianalysis-rob-howle-sales-call-2026-07-13|call capture]])
- June 2026, seen 2026-07-12: American Compute's GPU Residual Value Report backtests rental indices against secondary transactions, finds weak correlation, and sources an exhibit to "American Compute proprietary resale data as of June 2026." (https://www.amcompute.com/blog/gpu-depreciation-residual-value-report-2026)
- 2026-07-22: CCIR's secondary-market page reports a reconstructed record of 3,564 sold listings, 15,155 units, and $28.9 million from July 2023 through July 2026. The source is eBay sold-listing research, not institutional liquidation data. See [[ccir-gpu-compute-credit-research-audit-2026-07-22|the audit]].

## Implications

- Run-sheet question 2 on the 2026-07-13 call is the falsification test: what, if anything, anchors the framework to observed prints. "Nothing" confirms this note; a real anchor revises it.
- The observed-residual census belongs on the map: CCIR has public retail executes, American Compute claims proprietary resale data, and lessors, ITAD brokers, institutional dealers, and foreclosure channels remain open questions.
- If the record product ever extends toward collateral, the residual-data partner profile is an equipment-side holder, not the research incumbent.

## Counterpoints / Uncertainty

- Advertised is not actual: their consulting practice or teardown lab may hold observed prints they do not market. The 2026-07-13 call tested the PRODUCT SUITE only; the consulting archive remains untested, with an open thread (Rob's offer to ask the team what lenders request beyond ClusterMAX).
- American Compute's report is marketing for its own financing business; the scope and size of its "proprietary resale data" is unverified.
- SemiAnalysis productizes in quarters; an observed leg could appear fast if they decide the market wants it.
- CCIR's public record may become more institutional if market participants contribute dealer, disposal, auction, or portfolio-liquidation data.

## Links

- Sources: [[semianalysis-nvidia-backstop-trinity-2026-07-06|SemiAnalysis: Nvidia GPU Debt Backstop / AI Project Trinity]], [[semianalysis-call-prep-2026-07-13|SemiAnalysis call run sheet]], [[american-compute-bernie-ceo-call-2026-06-16|American Compute: Bernie CEO call]]
- Orgs: [[semianalysis|SemiAnalysis]]
- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- Related Insights: [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]] (its 2026-07-07 update watches for exactly this framework publishing a derived curve)

## Updates

### 2026-07-12

Initial capture, pre-call. Verification pending: run-sheet question 2 on the 2026-07-13 SemiAnalysis call. Update this note with the answer.

### 2026-07-13

Confirmed at product level on the sales call, confidence raised to high. Rental leg is stronger than the note assumed (relationship-sourced neocloud contract pricing, not just survey and scrape); residual leg unchanged: forecast off rents, no observed prints claimed, pricing series rentals-only on direct ask. Remaining falsifier: the consulting archive, thread open via Rob.

### 2026-07-22

Corrected the market-wide wording after CCIR published a reconstructed retail sold-listing record. SemiAnalysis still lacks an observed resale leg. The broader gap is now public institutional bulk-recovery evidence, not all public resale evidence.
