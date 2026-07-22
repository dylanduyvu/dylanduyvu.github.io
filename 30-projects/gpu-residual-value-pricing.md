---
type: project
status: active
created: 2026-06-29
updated: 2026-07-22
domains: [gpu-finance, residual-value, asset-backed-lending, compute-derivatives]
people: [thomas-galbraith, bernie-margulies, dave-friedman]
orgs: [barkr, american-compute, ornn, ccir]
tags: [gpu, valuation, guarantees, customer-discovery]
---

# GPU Residual Value Pricing

## Current State

The broader residual-value pricing track remains active, but the pure GPU KBB / naked residual-data wedge is shelved pending buyer-side evidence. The demotion happened in stages: Bernie showed that appraisal-style naked data can become free gut-check behavior and that lenders mostly focus on offtake; Barkr showed that even a quality-adjusted GPU valuation index sells more strongly when wrapped in a guarantee; the business-model analysis showed that a KBB/Moody's-style standard is a slow trust and first-mover game where Barkr may already have a meaningful lead.

That is enough to demote the naked-data thesis, but not enough to kill it. The supplier evidence is selection-biased, and Barkr's valuation-only tier is a counter-signal that some buyers may want the number without the wrapper. The deciding test is direct buyer demand from S&P, KBRA, Fitch, and at least one lessor.

The strongest near-term wedge would need to change guarantee pricing, lender advance rates, lessor return assumptions, insurer confidence, or loss-given-default assumptions.

Compute derivatives add a possible market-data layer: a dated futures/forward strip could supply residual marks and amortization inputs in a way a perp cannot.

CCIR adds a separate cross-generation rental lens. In one July 2026 neocloud on-demand snapshot, A100 through B300 posted rents clustered between $0.87 and $0.98 per TB/s-hour of nameplate memory bandwidth, much tighter than rents normalized by capacity, FLOPs, or power. This may become an inference-oriented anchor for rental earning power if it persists, but it is currently one cross-section of posted asks, not transaction evidence or a residual-value curve. See [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|the developing insight]].

If that public normalization holds, it weakens the naked GPU-KBB wedge further. Cross-generation rental price may become easier to estimate without proprietary data, while the valuable private layer shifts toward completed hardware transactions, realized utilization, operating costs, and future demand. For lending, the band may price an occupied hour without proving how many hours a fleet will sell.

The wider CCIR audit sharpens the competitive and data boundaries. CCIR already publishes retail sold-listing history, dealer asks, model-implied going-concern values, rental term curves, and public credit records. The vault should no longer say that no public observed resale record exists. The missing tape is institutional: bulk dealer sales, lessor returns, auctions, foreclosures, and portfolio liquidations.

CCIR also found that all 17 disclosed GPU-collateral amortization schedules in its sample reduce the collateral balance to zero and none cites market residual value. That makes the first public partial-amortization or balloon facility tied to an external residual mark the cleanest adoption tripwire.

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
- [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|Cross-generation GPU rents may track memory bandwidth more closely than FLOPs]]: One CCIR snapshot suggests an inference-oriented normalization worth monitoring, not yet a durable law.
- [[gpu-collateral-has-going-concern-and-liquidation-values|GPU collateral has separate going-concern and liquidation values]]: Deployed earning value, dealer asks, completed retail sales, and bulk liquidation value are different objects.
- [[public-gpu-loans-do-not-yet-credit-residual-value|Public GPU loans do not yet credit residual value]]: Recovery may matter in underwriting without earning the borrower a balloon or slower amortization.
- [[ccir-is-building-the-public-compute-credit-data-layer|CCIR is building the public compute-credit data layer]]: Generic public pricing and facility data are already becoming crowded.

## Sources

- [[gpu-kbb-demotion-decision-2026-06-30|GPU KBB demotion decision memo]]
- [[barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18|Barkr call with Thomas]]
- [[american-compute-bernie-ceo-call-2026-06-16|American Compute CEO call with Bernie]]
- [[perps-dont-work-for-compute-derivatives-2026-06-12|Perps Don't Work for Compute Derivatives]]
- [[gpu-financing-blogs-relevance-list-2026-06-29|GPU financing blogs relevance list]]
- [[ccir-memory-bandwidth-band-cross-generation-gpu-rents-2026-07-11|CCIR memory-bandwidth band]]
- [[ccir-gpu-compute-credit-research-audit-2026-07-22|CCIR GPU compute-credit research audit]]

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
- Does CCIR's $/TB/s-hour rental band persist across dates, regions, provider classes, commitment terms, and realized transactions?
- Can CCIR or another source assemble institutional bulk recovery evidence rather than retail sold listings?
- What is the first disclosed loan to leave principal outstanding against an external GPU residual mark?

## Next Tests

- Send the buyer-side cold batch to S&P, KBRA, Fitch, and at least one lessor. Ask whether they would pay for neutral GPU residual data on its own.
- Resurrect the data-only KBB thesis only if three independent buyers show standalone willingness to pay; otherwise kill it cleanly.
- Ask lenders whether a guaranteed GPU residual mark changed a real deal's terms.
- Ask Barkr/American Compute-style players what data would reduce guarantee cost or expand coverage.
- Find one transaction where residual-value uncertainty changed LTV, spread, premium, or deal approval.
- Compare guarantee vs insurance acceptance across banks, private credit, insurers, lessors, and asset managers.
- Ask Bernie for one prior quote or policy with target guarantee, premium, source data, and lender/reinsurer pushback.
- Test whether lenders/lessors would use a surveyed forward strip before exchange liquidity exists.
- Track CCIR's bandwidth band through time and test it against realized rental revenue before using it in collateral or residual models.
- Watch for partial amortization, balloons, borrowing-base formulas, or advance-rate terms that explicitly cite an external GPU residual benchmark.
- Talk to [[ornn|Ornn]] (Wayne / Jack) about their GPU Residual Value Swap, specifically how the reference value is set (internal mark vs external reference vs negotiated deal-by-deal). A live RVS product is a direct probe of who trusts what GPU residual number. Intro from Bernie on 2026-06-17; conversation at scheduling stage.
