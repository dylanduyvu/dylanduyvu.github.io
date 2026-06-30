---
type: source
status: captured
created: 2026-06-30
updated: 2026-06-30
source_type: conversation-memo
domains: [gpu-finance, residual-value, asset-backed-lending, startup-validation]
projects: [gpu-residual-value-pricing]
sources: [american-compute-bernie-ceo-call-2026-06-16, barkr-thomas-gpu-asset-pricing-guarantee-2026-06-18]
people: [bernie-margulies, thomas-galbraith]
orgs: [american-compute, barkr]
tags: [gpu, valuation, guarantees, customer-discovery]
---

# GPU KBB demotion decision memo

## Summary

This memo clarifies why the GPU KBB / naked residual-data thesis was demoted after the Bernie, Barkr, and business-model analysis sequence. The right status is not killed, but shelved pending a buyer-side test. Supplier-side evidence points away from standalone marks and toward wrappers, but that evidence is selection-biased enough that S&P, KBRA, Fitch, and lessor-style buyers need to decide the question directly.

## Durable Takeaways

- The KBB idea was not shelved by the Bernie call alone; it was demoted in stages across Bernie, Barkr, and the business-model analysis.
- Bernie supplied the first disconfirmation: American Compute's appraisal product was not gaining traction, customers used him as a free residual gut-check, and lenders treat residual value as worst-case recovery while focusing on offtake.
- Barkr supplied the stronger second disconfirmation: it built the quality-adjusted GPU pricing index the KBB thesis imagined, but commercialized it mainly through a Munich Re-backed guarantee because GPU clients mostly want the wrapper.
- The structural business-model issue is independent of the calls: a KBB/Moody's-style residual-data standard is a slow trust, defensibility, and first-mover game, which fits poorly with fast PMF timelines and Barkr's apparent data/reinsurer/distribution lead.
- The thesis should be demoted, not killed, because the supplier evidence is selection-biased and Barkr's valuation-only tier is a live counter-signal that some buyers may want the naked number.
- The settling test is buyer-side demand: if S&P, KBRA, Fitch, and at least one lessor independently say they would pay for neutral GPU residual data without a guarantee wrapper, the data-only thesis can come back to foreground.

## Raw Context

btw, why was the kbb idea shelved? post bernie call

It wasn't fully shelved on the Bernie call alone - it got demoted in stages across three conversations, and it's worth being precise about what each one actually did to it, because the reasons compound and a couple of them are softer than they might feel in hindsight.

Bernie's call delivered the first real disconfirmation. Two things specifically. His appraisal product - the closest thing American Compute sells to a naked-data product - wasn't gaining traction, because customers used him as a free gut-check then didn't buy; they already had internal residual estimates. And he said lenders treat residual as worst-case recovery only and are 100% focused on offtake, meaning the biggest pool of capital structurally doesn't care about the number. So Bernie was one credible data point that (a) the naked number is hard to sell and (b) the supposed buyers mostly don't want it.

Barkr's call was the second, and it's what really moved it. Barkr has built the thing the KBB thesis imagined - a quality-adjusted hedonic GPU price index - and still chose to wrap it in a Munich Re guarantee rather than sell it as data. GPU clients "almost universally want the guarantee, not just the valuation." That's a second independent company confirming the wrapper sells and the naked number doesn't. Two suppliers, same answer.

Then the business-model analysis added a structural reason independent of the calls. The KBB/Moody's model is a slow-to-build, defensibility-is-everything, first-mover-takes-the-standard game - beautiful economics (45-50% margins, multi-billion outcomes) but a marathon to a fortress, not a fast PMF curve. That collides with your fast-timelines worldview and with the competitive reality that Barkr already has an ~18-month data head start, the Munich Re credibility, and USD.AI distribution. So even if the naked-data business were viable, you'd be entering late behind a funded incumbent in a game where being late is structurally bad.

So the stack of reasons, in order of strength: (1) two independent suppliers say people pay for the wrapper, not the number; (2) the business shape (slow trust-building) fits your timeline poorly; (3) you'd be a late second mover behind Barkr.

But here's the honest caveat you yourself raised and shouldn't lose: reason (1), which is the load-bearing one, is selection-biased. You only sampled companies that chose the wrapper, and they have an incentive to discourage a data-only entrant. And there's a live counter-signal sitting right there: Barkr just launched a valuation-only tier driven by inbound demand - meaning someone is asking for the naked number, hard enough to move their roadmap. So the strongest reason for shelving is real but not clean.

Which is exactly why it's demoted, not killed. The honest status is: the naked-data thesis is unproven in both directions, because you've only asked suppliers (biased) and never asked buyers directly. The pre-set bar is that the demand-side cold emails - S&P, KBRA, Fitch, a lessor - decide it. If three buyers independently say they'd pay for neutral residual data on its own, it resurrects to foreground. If they don't, it dies clean. That test is the thing that would actually settle it, and as far as I know it hasn't run yet (the open "did the cold batch send" question), so technically the KBB idea is shelved pending a test you haven't completed - which means if it's bugging you, the move isn't to re-litigate the Bernie/Barkr calls, it's to send those four emails and let the buyers decide.

## Promoted Insights

- [[naked-gpu-residual-data-is-demoted-until-buyers-show-standalone-wtp|Naked GPU residual data is demoted until buyers show standalone WTP]]
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]
- [[gpu-residual-risk-matters-more-to-lessors-than-lenders|GPU residual risk matters more to lessors than lenders]]
- [[gpu-rvi-demand-may-need-a-residual-correction|GPU RVI demand may need a residual correction]]

## Open Questions

- Did the buyer-side cold batch to S&P, KBRA, Fitch, and a lessor actually send?
- Would those buyers pay for neutral GPU residual data without a guarantee wrapper?
- Does Barkr's valuation-only inbound demand represent real standalone willingness to pay or just top-of-funnel curiosity?

## Links

- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[bernie-margulies|Bernie Margulies]], [[thomas-galbraith|Thomas Galbraith]]
- Orgs: [[american-compute|American Compute]], [[barkr|Barkr]]
