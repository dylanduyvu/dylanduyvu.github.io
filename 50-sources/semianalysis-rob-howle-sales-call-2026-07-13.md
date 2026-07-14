---
type: source
status: captured
created: 2026-07-13
updated: 2026-07-13
source_date: 2026-07-13
source_type: call
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, residual-value, verification, credit-markets]
people: [rob-howle, jakub-janiak]
orgs: [semianalysis]
attachments: []
tags: [call-notes, semianalysis, tco-model, pricing, clustermax, sales]
---

# Call: Rob Howle (SemiAnalysis sales) on the TCO model and product suite

## Context

~25 minutes, 2026-07-13, calendar title "SemiAnalysis w/ Precursor Labs." Dylan and Jakub with Rob Howle (Sales Associate). Transcript caveats: the recorder merged our side into one "Me" track, so our questions are attributed jointly per the Zile convention; "Andrew" in the greeting read as a garble; "GPU repo pricing" read as rental pricing. Register as planned: use case delivered research-first with the operator evaluation as the conditional; no reverse-discovery pressure arrived; guardrails never tested; corrections credential deliberately unused with a sales seat. Scored against the run sheet in [[semianalysis-call-prep-2026-07-13|its Outcome section]].

## The must-get: modeled-not-observed, confirmed at product level

Asked the anchored-or-modeled question nearly verbatim. The answer, assembled from his own tour: rental inputs are real and better than scraping (public spot PLUS direct contract pricing from major neoclouds they hold testing relationships with); residual is "tracked and forecast" downstream of those rental inputs; and the $20K pricing series, on direct ask ("is that resale pricing or rentals?"), is rentals only, spot and on-demand, 11 MILLION RECORDS FROM 244 SOURCES BACK TO 2017, not one resale print. Nobody claimed observed resale, auction, or lessor-return data anywhere in the suite. [[semianalysis-residual-value-is-modeled-not-observed|The insight note]] moves to confidence: high, with one caveat still open: the consulting archive remains untested, and Rob owes us exactly that thread ("I can ask the team" what lenders request beyond ClusterMAX).

Fair capture of their edge: the RENTAL leg is genuinely relationship-sourced, not scrape-only. The residual leg is unchanged by that.

## ClusterMAX recalibration (tension, not resolution)

Sales chair: ClusterMAX is "not part of the model, just an article we released in the newsletter," fully accessible with a newsletter sub. No participation mechanics, no payment mechanics, no product wrapper. Lender-facing work is BESPOKE CONSULTING STARTING AT $250-300K per engagement. Two readings stay live: a sales associate underdescribing a strategic asset, or the rating layer of the conversion stack being editorial content rather than product. Logged as a dated tension in [[semianalysis|the org note]] rather than overwriting the Trinity-piece framing. Consequence either way: run-sheet Q5's who-pays question dissolves at product level; the money lenders send them flows through consulting.

## Terms, complete

- Institutional models: $75K/year each, up to five seats; monthly Excel deliverable, two to three research reports per month, one to two analyst calls per quarter plus unlimited email. Tokenomics is $100K. Networking and optics cannot be bought standalone (requires the accelerator model).
- Core research: $65K basic (reports only, NO analyst access), $75K expanded (adds conference notes, webinars, analyst email). Geared to public-equity investing. NOTABLE: core research front-runs the newsletter by one to two months; the free Substack is a delayed shadow of the paid tier.
- GPU pricing series: $20K/year, an internet scraper over open endpoints, spot and on-demand only.
- API access: $20K add-on per product (TCO and pricing series only; none for core research).
- Firm shape per his deck: ~95 employees, 40-50 analysts, offices SF, NY, Chicago (new), Singapore, analysts across Taiwan, Korea, Japan.
- His recommendation for us: TCO first ("having that contract pricing is very valuable"), pricing series as the cheap start.

## Smaller reads

- Silicon Data, asked directly: "don't come up with them too much," different clientele, high confidence in own niche. Sales-grade non-answer; Q6 spent for little.
- He is sending: the pricing deck, core research samples, and a TCO SHELL (structure visible, data pulled). The shell is the pre-purchase inspection object.

## Follow-up

### Prepared after the call, not sent

Rob, thanks for the walkthrough today, clear and useful. Three things as we review on our end. First, before we decide on the TCO model, could we get a short session on the shell with whoever owns the residual framework? That is the piece our decision leans on. Second, could you send licensing terms in writing, internal use versus commercial and derived-works, for the model and the API? Third, you offered to ask the team what lenders request beyond ClusterMAX in those engagements; we would genuinely value that answer. Also, the piece from the research side of our work published this morning, in case it is useful context for the team: https://dylanvu.substack.com/p/the-track-record-that-cant-travel

Dylan

### Sent 2026-07-14

The reply isolated Rob's consulting-team offer rather than burying it in the full three-item follow-up:

> Hi Rob,
>
> Thank you again for the walkthrough and for sending these materials over.
>
> You mentioned that you could ask the team what lenders typically request beyond ClusterMAX in the bespoke consulting engagements. We'd appreciate any examples they're comfortable sharing, as it would help us understand how the model fits alongside the bespoke work.
>
> Best,  
> Dylan

Status: awaiting Rob's answer after he checks with the consulting team. The residual-owner session and written licensing questions remain unsent.

## Open Questions

- TCO shell inspection list: does the residual tab expose a term structure by SKU and vintage or point estimates, and what assumptions drive it?
- Who owns the residual framework (name), and does the included methodology call reach them?
- Is the $20K pricing series enough for the rental leg while the residual question stays unbought? Jakub's budget call.
- Pilot or sub-year terms were never raised; ask if the $75K sticker matters.
- Licensing menu still unstated; carried by the follow-up.

## Links

- Sources: [[semianalysis-call-prep-2026-07-13|Run sheet (scored)]], [[semianalysis-nvidia-backstop-trinity-2026-07-06|Trinity source note]]
- Orgs: [[semianalysis|SemiAnalysis]]
- Related Insights: [[semianalysis-residual-value-is-modeled-not-observed|SemiAnalysis residual value is modeled, not observed]]
- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
