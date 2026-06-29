---
type: project
status: active
created: 2026-06-29
updated: 2026-06-29
domains: [gpu-finance, residual-value, asset-backed-lending, compute-derivatives]
people: [thomas-galbraith, bernie-margulies, dave-friedman]
orgs: [barkr, american-compute]
tags: [gpu, valuation, guarantees, customer-discovery]
---

# GPU Residual Value Pricing

## Current State

The residual-value data thesis is sharper when framed as lender-grade recovery floor plus risk transfer, not a generic GPU Kelley Blue Book. Barkr's call suggests the highest-WTP object is a guaranteed valuation: a client-specific collateral value backed by diligence, guarantee mechanics, and Munich Re credibility. American Compute reinforces the same direction from the RVI side, but adds sales friction: customers may use residual quotes as free gut checks until a market correction makes downside risk undeniable.

This keeps the residual-value track alive, but pushes against a data-only product. The strongest near-term wedge would need to change guarantee pricing, lender advance rates, lessor return assumptions, insurer confidence, or loss-given-default assumptions.

Compute derivatives add a possible market-data layer: a dated futures/forward strip could supply residual marks and amortization inputs in a way a perp cannot.

## Key Insights

- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]: Lenders care about minimum recovery value, not just abstract marks.
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]: GPU customers appear to pay for the backed mark, not only the data.
- [[banks-may-prefer-guarantees-or-swaps-over-insurance-for-gpu-collateral-risk|Banks may prefer guarantees or swaps over insurance for GPU collateral risk]]: Structure affects whether counterparties trust and recognize the protection.
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]: Data matters, but private feeds, interpretation, and reinsurer backing are the commercial stack.
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]: Warranty/guarantee structures can turn hardware residual risk into financeable protection.
- [[gpu-pricing-opacity-is-structural-not-just-immature|GPU pricing opacity is structural, not just immature]]: Transparency will be resisted by participants who earn margin from opacity.
- [[gpu-residual-risk-matters-more-to-lessors-than-lenders|GPU residual risk matters more to lessors than lenders]]: Lessors may be a sharper ICP because residuals affect return, not only recovery.
- [[gpu-rvi-demand-may-need-a-residual-correction|GPU RVI demand may need a residual correction]]: Overconfidence may suppress purchase until residual downside becomes visible.
- [[gpu-financing-lender-types-fragment-by-credit-tolerance|GPU financing lender types fragment by credit tolerance]]: Positioning should segment banks, equipment finance, private credit, crypto lenders, and lessors.
- [[gpu-financing-needs-forward-strips-for-residual-marks|GPU financing needs forward strips for residual marks]]: Dated compute curves could become residual-value underwriting infrastructure.
- [[compute-is-perishable-capacity-with-an-obsolescence-curve|Compute is perishable capacity with an obsolescence curve]]: Residual marks need to account for perishable capacity and silicon decay.

## Sources

- [[barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18|Barkr call with Thomas]]
- [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]]
- [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- [[gpu-financing-blogs-relevance-list-2026-06-29|GPU financing blogs relevance list]]

## Open Questions

- What guarantee fee does Barkr charge as a percentage of asset value?
- What exact triggers and exclusions apply to the guarantee?
- What due diligence did Munich Re require before backing the product?
- How much do guaranteed valuations change lender terms: LTV, spread, capital treatment, or deal approval?
- Is there a wedge supplying data into Barkr/American Compute/Munich Re, or is the better opportunity building a competing risk-transfer wrapper?
- Are lessors a better initial ICP than lenders?
- What event or evidence would convert RVI curiosity/gut-check behavior into purchase?
- Could a dated compute strip become the market primitive for GPU residual marks?

## Next Tests

- Ask lenders whether a guaranteed GPU residual mark changed a real deal's terms.
- Ask Barkr/American Compute-style players what data would reduce guarantee cost or expand coverage.
- Find one transaction where residual-value uncertainty changed LTV, spread, premium, or deal approval.
- Compare guarantee vs insurance acceptance across banks, private credit, insurers, lessors, and asset managers.
- Ask Bernie for one prior quote or policy with target guarantee, premium, source data, and lender/reinsurer pushback.
- Test whether lenders/lessors would use a surveyed forward strip before exchange liquidity exists.
