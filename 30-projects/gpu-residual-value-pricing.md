---
type: project
status: active
created: 2026-06-29
updated: 2026-06-30
domains: [gpu-finance, residual-value, asset-backed-lending, compute-derivatives]
people: [thomas-galbraith, bernie-margulies, dave-friedman]
orgs: [barkr, american-compute]
tags: [gpu, valuation, guarantees, customer-discovery]
---

# GPU Residual Value Pricing

## Current State

The broader residual-value pricing track remains active, but the pure GPU KBB / naked residual-data wedge is shelved pending buyer-side evidence. The demotion happened in stages: Bernie showed that appraisal-style naked data can become free gut-check behavior and that lenders mostly focus on offtake; Barkr showed that even a quality-adjusted GPU valuation index sells more strongly when wrapped in a guarantee; the business-model analysis showed that a KBB/Moody's-style standard is a slow trust and first-mover game where Barkr may already have a meaningful lead.

That is enough to demote the naked-data thesis, but not enough to kill it. The supplier evidence is selection-biased, and Barkr's valuation-only tier is a counter-signal that some buyers may want the number without the wrapper. The deciding test is direct buyer demand from S&P, KBRA, Fitch, and at least one lessor.

The strongest near-term wedge would need to change guarantee pricing, lender advance rates, lessor return assumptions, insurer confidence, or loss-given-default assumptions.

Compute derivatives add a possible market-data layer: a dated futures/forward strip could supply residual marks and amortization inputs in a way a perp cannot.

## Key Insights

- [[naked-gpu-residual-data-is-demoted-until-buyers-show-standalone-wtp|Naked GPU residual data is demoted until buyers show standalone WTP]]: The pure KBB/data-only wedge should stay shelved until buyer-side demand proves standalone willingness to pay.
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

- [[gpu-kbb-demotion-decision-2026-06-30|GPU KBB demotion decision memo]]
- [[barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18|Barkr call with Thomas]]
- [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]]
- [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- [[gpu-financing-blogs-relevance-list-2026-06-29|GPU financing blogs relevance list]]

## Decisions

### 2026-06-30: Demote data-only GPU KBB thesis pending buyer test

Do not treat Bernie alone as the kill. The demotion comes from the combined evidence: American Compute appraisal/RVI gut-check friction, Barkr's stronger valuation-plus-guarantee demand, and the slow KBB/Moody's-style business shape. Keep the broader residual-value project alive, but shelve the naked-data wedge until direct buyers validate standalone willingness to pay.

## Open Questions

- What guarantee fee does Barkr charge as a percentage of asset value?
- What exact triggers and exclusions apply to the guarantee?
- What due diligence did Munich Re require before backing the product?
- How much do guaranteed valuations change lender terms: LTV, spread, capital treatment, or deal approval?
- Is there a wedge supplying data into Barkr/American Compute/Munich Re, or is the better opportunity building a competing risk-transfer wrapper?
- Are lessors a better initial ICP than lenders?
- What event or evidence would convert RVI curiosity/gut-check behavior into purchase?
- Could a dated compute strip become the market primitive for GPU residual marks?
- Would S&P, KBRA, Fitch, or lessors pay for neutral GPU residual data without a guarantee wrapper?
- Does Barkr's valuation-only inbound demand represent real standalone willingness to pay or just top-of-funnel curiosity?

## Next Tests

- Send the buyer-side cold batch to S&P, KBRA, Fitch, and at least one lessor. Ask whether they would pay for neutral GPU residual data on its own.
- Resurrect the data-only KBB thesis only if three independent buyers show standalone willingness to pay; otherwise kill it cleanly.
- Ask lenders whether a guaranteed GPU residual mark changed a real deal's terms.
- Ask Barkr/American Compute-style players what data would reduce guarantee cost or expand coverage.
- Find one transaction where residual-value uncertainty changed LTV, spread, premium, or deal approval.
- Compare guarantee vs insurance acceptance across banks, private credit, insurers, lessors, and asset managers.
- Ask Bernie for one prior quote or policy with target guarantee, premium, source data, and lender/reinsurer pushback.
- Test whether lenders/lessors would use a surveyed forward strip before exchange liquidity exists.
