---
type: source
status: captured
created: 2026-07-22
updated: 2026-07-22
source_date: 2026-07-22
source_type: website-research-audit
projects: [gpu-residual-value-pricing, gpu-compute-derivatives]
domains: [gpu-finance, compute-markets, credit-markets, residual-value, verification]
people: []
orgs: [ccir]
attachments: []
tags: [ccir, market-data, gpu-credit, secondary-market, term-curve, covenant-design, competitive-landscape]
---

# CCIR GPU compute-credit research audit

## Context

Audit of [CCIR's research and market-data site](https://ccir.io/research) against the vault's current GPU-finance theses on 2026-07-22. CCIR, or Compute Credit Index Research, publishes daily GPU rental reference rates, committed-term curves, credit-facility records, secondary-market observations, utilization data, and worked examples showing how its rates could enter loan documents.

CCIR says the company was formed on 2026-03-11. The site is therefore new, and several time series are still thin. Its main value today is assembling public compute-market and credit evidence into a citable data layer that can be updated over time.

## Evidence Rules

- **Direct:** a filed loan term, rating-agency statement, or observed price shown by CCIR with provenance.
- **CCIR-derived:** a calculation CCIR makes from public observations and disclosed assumptions.
- **Vault inference:** the implication for Dylan's existing thesis. These should not be presented as CCIR's own conclusion.
- Posted rental rates and hardware asks are not completed transactions.
- CCIR's executed hardware history comes from retail sold listings. It is useful evidence, but not an institutional liquidation or bulk-sale tape.
- The covenant examples on `/applications` are drafting illustrations. They are not evidence that a lender has adopted those terms.

## Thesis-Changing Findings

### 1. The second-customer problem is not confined to young operators

[Fitch's CoreWeave DDTL 5.5 rating case](https://ccir.io/research/fitch-coreweave-ddtl-5-5) assumes CoreWeave can renew or replace customer contracts that expire before the debt matures at favorable GPU lease rates. The rating case confirms that contract-rollover risk survives even at CoreWeave scale.

The risk exists at both ends of the market. Large operators can support the assumption with scale, customer diversity, public financial history, ratings, arranger reputation, and lender familiarity. A young operator cannot.

### 2. Large GPU loans already monitor contract cash

CCIR's [GPU SPV primer](https://ccir.io/research/gpu-spv) records CoreWeave DDTL 3.0 tests including a monthly contract-realization ratio of at least 0.85 and a debt-service coverage ratio of at least 1.40 beginning in April 2027. Other facilities use their own coverage tests and controlled accounts.

This corrects the vault's broadest version of the claim that GPU-loan covenants rely on self-reporting. Large structures can combine borrower reports with cash they control, objective ratio tests, serial-number schedules, and draw conditions. The remaining gap is service delivery and causality: why contract cash fell, whether an SLA failure caused it, whether credits were valid, and whether the operator can replace expiring revenue.

### 3. Self-reporting is one layer, not the entire enforcement system

The public structures mix:

- borrower financial reporting and compliance certificates;
- controlled cash accounts;
- asset schedules and GPU serial numbers;
- objective debt-service and contract-cash tests;
- installation verification before draws;
- lender step-in and enforcement rights.

The vault should therefore stop saying the whole covenant system is enforced by borrower attestation. The more defensible claim is that operating quality and contract-level service delivery remain much harder to verify independently than assets and cash.

### 4. GPU-backed debt is packaged project credit

CCIR's SPV work shows the collateral package can include the GPUs, customer contract rights, datacenter rights, controlled accounts, and a pledge of the borrower's equity. This strongly supports the existing inversion: the debt is not a simple loan against hardware. The operating project and its contracted cash are the repayment engine; the GPUs are one recovery source.

### 5. Operator risk can be handled through replacement rights

CCIR's [compute-contract primer](https://ccir.io/research/compute-contracts) records substitute-operator and assignment mechanics in the CoreWeave/OpenAI structure. Under specified failure conditions, contract and datacenter arrangements can move to another operator.

Replacement rights compete directly with a portable reputation product. A lender may not need to become certain that one operator will perform if the documents let another operator take over. The remaining question is whether those rights work below trophy-deal scale.

### 6. Long commitments trade price for certainty

CCIR's [on-demand versus committed analysis](https://ccir.io/research/od-vs-committed) reports that recent committed H100 posted prices generally sat 26 to 39 percent below guaranteed on-demand prices. Across the broader reconstructed period, the discount was usually material.

Part of the discount pays for occupancy and duration certainty. A borrower gives up potential upside in exchange for revenue the lender can count. The inputs are posted offers rather than completed contracts.

### 7. Inference changes the type of credit risk

CCIR's [training-versus-inference primer](https://ccir.io/research/training-vs-inference) frames training as concentrated, project-like demand under long commitments and inference as shorter, recurring, usage-driven demand. As inference expands, a lender relies less on one named customer's credit and more on a changing portfolio of customers plus market demand.

That does not remove customer risk. It changes it from single-name credit into portfolio, rollover, price, and utilization risk.

### 8. Public executed resale evidence exists, but it is retail evidence

CCIR's [secondary-market page](https://ccir.io/hardware) reconstructs 3,564 sold listings, 15,155 units, and $28.9 million of documented volume from July 2023 through July 2026. This corrects the vault's claim that no public observed resale record exists.

The correction is narrow. The executed history comes from eBay sold-listing research. It is not an institutional dealer tape, foreclosure record, lessor-return history, or a measure of how a large liquidation would move the market. The real gap is public institutional recovery evidence, not all public resale evidence.

### 9. Asking prices are poor recovery marks

CCIR keeps asks and executed retail medians separate. In its 2026-07-22 snapshot, current asks were roughly 1.2 to 2.0 times the trailing executed medians for models with enough observations. H100 SXM asks were about twice the executed retail median.

For credit work, a dealer ask cannot stand in for a recovery floor. Even executed single-unit retail prices still need a further haircut for bulk volume, speed, removal costs, configuration, and market impact.

### 10. GPUs have going-concern and liquidation values

CCIR explicitly separates:

- an income-derived value for a GPU that remains deployed and earning;
- completed retail sales that inform a downside floor;
- current asks that show replacement cost and dealer posture.

On 2026-07-22 its H100 example showed a $23,551 model-implied going-concern value, a $22,500 dealer ask, and an $11,500 trailing executed retail median. The first is assumption-heavy, the second is not a sale, and the third is not a bulk liquidation value.

This distinction matters whenever a lender claims the GPU can keep earning after default. That value is available only if the operating setup, power, software, customer access, and servicing can be preserved or transferred.

### 11. One smooth GPU depreciation curve is not defensible

CCIR's [generation histories](https://ccir.io/research/rental-rates-by-generation), [GPU age curve](https://ccir.io/research/gpu-age-curve), and secondary-market overlay show that different generations do not collapse onto one aging path. Rental rates fall in steps, and demand episodes can make older generations reprice upward.

A cross-sectional decay rate can be useful for stress testing, but it should not be treated as a law for every chip generation.

### 12. Memory-bandwidth normalization does not identify the best purchase

CCIR's cross-section found a narrow current rent-per-TB/s-hour band from A100 through B300. But its [rent-and-MSRP analysis](https://ccir.io/research/rent-and-msrp) reports that acquisition cost per unit of memory bandwidth fell roughly 2.5 times from A100 to H200/B200 while rent per unit of bandwidth did not fall with it.

This corrects the early vault implication that an older GPU might be the best purchase merely because occupied rents normalize by bandwidth. A useful purchasing model still needs acquisition cost, achieved performance, energy, service life, utilization, networking, and workload fit. Under CCIR's own posted-price inputs, newer silicon may have better gross economics per unit of bandwidth.

### 13. Rate cards overstate owner economics

CCIR shows idealized gross recovery of posted purchase price in about 8 to 14 months if a GPU rents continuously at posted rates with no costs. Its assumption-based net model produces much longer periods: 31 months for V100, 37 months for A100, and no full H100 recovery after 42 months in the observed window.

The exact outputs depend on CCIR's elections, including a 50 percent realization factor, imputed facility cost, overhead, and the selected hardware-cost basis. The usable conclusion is that posted price times every available hour is a ceiling, not a cash-flow forecast.

### 14. Public amortization schedules currently give no residual credit

CCIR's [Itel history](https://ccir.io/research/itel-1979) says all 17 disclosed GPU-collateral amortization schedules it found reduce the collateral balance to zero, and none references market residual value.

That is stronger evidence than simply saying lenders care about recovery. It suggests public structures are not yet allowing a balloon balance to rest on a forecast GPU resale value. The sharper residual-value tripwire is the first disclosed partial-amortization facility, balloon loan, or advance-rate schedule that explicitly cites an external GPU residual benchmark.

### 15. CCIR is already building much of the public data layer

CCIR publishes or is assembling:

- daily on-demand reference rates;
- committed-term curves;
- realized-versus-posted revenue data;
- a compute-credit facility ledger and derived series;
- secondary-market asks and completed retail observations;
- a hardware and provider explorer;
- utilization observations;
- worked covenant and rollover examples.

This crowds the generic public GPU pricing database, basic rental aggregator, public facility tracker, and simple residual-index ideas. A new product needs a harder moat: institutional transaction data, live bookable inventory, workflow integration, borrower or lender software, underwriting decisions, or actual risk transfer.

### 16. Price-triggered covenants could loosen contract requirements, but adoption is unproven

CCIR's [applications](https://ccir.io/applications) show hypothetical loan mechanics where a falling GPU reference rate automatically increases committed-revenue requirements, reserves, cash sweeps, and amortization. A separate example sizes re-leasing risk against the term curve before a contract expires.

This is a plausible answer to how public market data could enter loan terms. It is not proof that a lender has used the structure, and the examples still assume the financed fleet will remain rented at some level.

### 17. Utilization remains the weakest public dataset

CCIR's [utilization page](https://ccir.io/utilization) says only Vast.ai directly exposes rented units against total units. Other measures often show launchable inventory or provider breadth, which is not the same as occupancy.

This reinforces the current model: the public price side is improving faster than the public hours-rented side. A lender can increasingly estimate what an occupied hour should earn while still lacking a neutral forecast of how many hours one fleet will sell.

### 18. The borrower-finance operating-system direction gets stronger

CCIR's records expose recurring work inside a neocloud finance team:

- maintain GPU and serial-number schedules;
- map customer contracts and expiry dates to debt maturity;
- calculate contract realization and debt-service coverage;
- forecast re-leasing at current term rates;
- manage reserves, cash sweeps, and draw conditions;
- prepare lender reporting and refinancing materials.

This supports the hypothesis that automating the borrower-side finance function may be a stronger wedge than publishing one more data series.

### 19. GPU financing appears to refinance frequently

CCIR's [credit reference series](https://ccir.io/credit/series) reports a seven-month median life among resolved non-bridge compute facilities in its selected sample. Including bridge facilities lowers it further.

This may indicate repeated refinancing and continuous capital-markets work rather than one loan followed by passive servicing. The sample is small, selected, and includes broader compute facilities, so it should not be generalized as a market-wide loan life.

### 20. Credit marks are not standardized

CCIR found that different funds marked the same GPU debt facility about four price points apart, corresponding to roughly 110 basis points of implied-yield dispersion under its calculation convention.

Possible causes include different valuation policies, maturity assumptions, stale marks, or genuine uncertainty. The signal is not proof of a new standalone product, but it shows that even identical instruments can lack a common mark.

## Additional Deal Mechanics Worth Preserving

### GPU SPVs and CoreWeave facilities

- The borrower SPV can own the GPUs, contract rights, datacenter rights, and controlled accounts. The parent may provide only a limited bad-acts guarantee.
- Serial-number schedules increasingly identify collateral GPU by GPU.
- DDTL 2.0 assumed six-year straight-line GPU useful life.
- Public facilities use different debt-service coverage thresholds, including 1.15, 1.35, and 1.40 times depending on the transaction and period.
- CoreWeave DDTL 4.0, tied to Meta and rated investment grade, priced at SOFR plus 2.25 percent. DDTL 5.0, tied to two non-investment-grade customers, priced at SOFR plus 4.50 percent and carried a full parent guarantee.
- A lender that forecloses receives machines and an operating problem. Substitute-operator rights matter because the contracts and facilities still need someone to run them.

### Compute-contract mechanics

- The public contract spectrum runs from on-demand, through one-month-to-one-year reservations, to negotiated one-to-six-year take-or-pay agreements.
- A disclosed Microsoft contract suspended payment after specified consecutive hardware-failure days and could reprice committed usage toward on-demand rates after termination while offsetting remarketing proceeds.
- NVIDIA agreements can contain capacity-concentration limits.
- OpenAI agreed to notify CoreWeave if it projected an inability to pay within four months, an example of a covenant that still depends on counterparty disclosure.
- A Soluna/HPE mid-market agreement combined a 36-month term, roughly 30 percent prepayment, credit review, parent guarantee, and resale rights, but was later terminated. A signed contract is protection, not certainty.
- Datacenter leases can last much longer than customer compute contracts, extending the maturity mismatch beyond the GPU loan itself.

### Price, tenor, and utilization

- The cheap $2-per-hour H100 examples were often interruptible or auction capacity, not guaranteed on-demand capacity. CCIR's guaranteed on-demand observations remained materially higher.
- Physical term rental rates include both a view on future price and the value of reserving scarce capacity. They are not pure forecasts of future spot prices.
- Posted price multiplied by full utilization is not revenue.
- Inference demand can shorten contract books even when total demand grows.

### Secondary market and useful life

- CCIR's income-derived base case assumes 75 percent utilization, 65 percent net margin, a 15 percent discount rate, six-year service life, and a 30 percent annual rate decline after the observable term curve.
- Those are disclosed assumptions, not observed facts.
- Executed single-unit retail evidence can inform recovery but does not measure a forced bulk sale.
- Current asks should never be blended with completed sales.
- Different generations show different rental and resale paths.

### Drafting applications

- CCIR's example $200 million, four-year facility is hypothetical.
- Its price tiers would tighten committed-revenue coverage from 30 percent toward 85 percent while adding reserves, cash sweeps, and faster amortization as the reference rental rate fell.
- The rollover example illustrates how a contract resetting from a high old rate to a lower current one can push debt-service coverage below one.
- These examples show a possible product surface for public compute rates. They do not establish lender adoption.

## Corrections to Existing Vault Claims

1. Replace **"no public observed GPU resale data"** with **"no public institutional bulk-recovery tape."**
2. Replace **"GPU-loan covenants are enforced by self-reporting"** with **"large GPU loans measure assets and cash directly, while operating delivery and revenue causality remain less independently measured."**
3. Treat memory-bandwidth normalization as a rental-price lens, not a rule that older GPUs are the better purchase.
4. Treat the second-customer problem as a general rollover risk whose financing treatment differs by operator maturity, not as a problem unique to first fleets.
5. Treat generic GPU pricing, public facility data, and simple marketplace aggregation as already competitive categories.
6. Separate going-concern earning value, completed retail sale value, and bulk liquidation value in every collateral discussion.

## Highest-Value Strategic Implications

- The data layer is filling quickly. A generic public index is a weak wedge.
- Utilization and re-leasing remain less standardized than rental price.
- Contract and cash controls already do more work than the original verification thesis allowed.
- Replacement rights can route around operator reputation.
- Borrower-side capital-markets workflow remains complex, recurring, and possibly automatable.
- The best residual-value tripwire is not another appraisal. It is a real loan that leaves principal outstanding against a cited external residual mark.

## Open Tests

- Does any lender use a CCIR rate, term curve, or covenant example in an executed credit agreement?
- Can CCIR obtain institutional dealer, lessor, auction, or foreclosure records rather than retail sold listings?
- Does its memory-bandwidth rental band persist through time and realized revenue?
- Does any public GPU facility allow a balloon based on residual value?
- Can a lender use reference-rate triggers to finance less committed revenue, or do utilization assumptions remain the blocking input?
- What part of the neocloud finance workflow is repeated enough to become software rather than bespoke advisory work?

## Links

- Org: [[ccir|CCIR]]
- Area: [[gpu-finance|GPU Finance]]
- Project: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Existing CCIR source: [[ccir-memory-bandwidth-band-cross-generation-gpu-rents-2026-07-11|CCIR memory-bandwidth band]]
- Related: [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|GPU-backed debt is contract-backed with a hardware recovery floor]]
- Related: [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|GPU lending has a tenor mismatch]]
- Related: [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|The verification gap is contract-defined delivery and revenue truth]]
- Related: [[semianalysis-residual-value-is-modeled-not-observed|SemiAnalysis residual value is modeled, not observed]]
- Related: [[cross-generation-gpu-rents-may-track-memory-bandwidth-more-closely-than-flops|Cross-generation GPU rents may track memory bandwidth more closely than FLOPs]]
