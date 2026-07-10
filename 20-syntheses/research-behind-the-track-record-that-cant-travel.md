---
type: synthesis
status: draft
created: 2026-07-09
updated: 2026-07-09
canonical: 
domains: [gpu-finance, credit-markets, verification]
projects: []
people: []
sources: [neil-tiwari-magnetar-no-priors-podcast-2026-07-08, semianalysis-nvidia-backstop-trinity-2026-07-06, dave-friedman-luke-mellor-trophy-deal-trap-2026-04-06, deep-research-track-record-post-pressure-test-2026-07-08]
tags: [blogpost, research-companion, lender-memory, gpu-credit]
---

# Research behind "The Track Record That Can't Travel"

This page collects the sources, numbers, and open uncertainties behind [[the-track-record-that-cant-travel|the post]], the same way [[research-behind-the-ununderwritten-half|the first post's companion]] did. Everything here is public; where a claim rests on my own field notes, that is labeled.

## The three prices (all primary sources)

- 2023 facility: $2.3B, announced August 3, 2023, led by Magnetar Capital and Blackstone Tactical Opportunities. The margin figure (north of nine and a half points over the benchmark) is from CoreWeave's own proxy filing on [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001769628&type=DEF+14A); press coverage at the time reported a coupon around 14 percent, consistent with it.
- March 2026 facility: $8.5B against the Meta contract, about 5.9 percent, rated A3. [Moody's rating action](https://ratings.moodys.com/ratings-news/462400) is the primary document, and it also carries the detail the post leans on: Meta itself is rated Aa3 and CoreWeave itself Ba3, so the structure lifts the deal six notches above its own operator while the remaining three-notch gap to Meta is priced operator dependency.
- May 2026 facility: $3.1B, SOFR + 4.50 percent, Ba2/BB+, two non-investment-grade customers, oversubscribed with pricing tightening 50 basis points during syndication. [CoreWeave's announcement](https://investors.coreweave.com/news/news-details/2026/CoreWeave-Closes-3-1-Billion-Loan-Facility-Expanding-Access-to-Public-Markets-for-GPU-Backed-Financing/default.aspx) is the source of the "first publicly syndicated" claim, in their scope (HPC infrastructure-backed).

## The lender memory quote

Neil Tiwari, head of AI infrastructure at Magnetar, on the No Priors podcast, episode 152, aired February 26, 2026. The two quoted lines ("the operators had no experience" / "now you have the history") are from the episode transcript; the surrounding reading is mine. Working notes: [[neil-tiwari-magnetar-no-priors-podcast-2026-07-08|the full capture]]. Timeline worth noticing: he described the investment-grade and non-investment-grade blend ten weeks before the May facility printed it as a public transaction.

## The pricing matrix

SemiAnalysis, ["NVIDIA GPU Debt Backstop Unleashes $1T of Credit"](https://newsletter.semianalysis.com/p/nvidia-gpu-debt-backstop-unleashes) (July 2026): the tier named "first-execution" with heavy equity, 10-15 percent rates, 3-year terms. Working notes: [[semianalysis-nvidia-backstop-trinity-2026-07-06|the capture]].

## The precedents

- Dun and Bradstreet began as the Mercantile Agency (1841), correspondents writing down whether merchants paid their bills; the files became the product. The Lincoln-as-correspondent detail appears in Dun and Bradstreet's own corporate histories.
- PayNet: equipment lenders pooling how their loans actually performed so payment history could travel between lenders; acquired by Equifax in 2019.
- Factoring: invoice financiers advancing money only after verifying proof of delivery, and often confirming the invoice directly with the paying customer. The oldest working version of delivery verification gating credit.

## The field-notes paragraph

The claim that lenders describe cushions, amortization speed, and sponsor quality (and have not yet described verifying claimed history) comes from my own outreach conversations, a few dozen threads as of this writing. It is labeled field notes in the post because that is what it is: a running tally, not a survey, and it can change as replies come in. The tally lives in this vault, anonymized.

## What I am genuinely unsure about

The post carries its three weaknesses in the text; the sharpest is the third. Venture debt re-lends to existing borrowers as standard practice, so at least one corner of small-ticket lending builds lender memory by design. Whether GPU-specific lenders do the same, and whether round two prices better when they do, is the open factual question, and the reason the post ends by asking it.

A fourth uncertainty the post does not carry but should be named here: segment size. The argument matters in proportion to how many skipped operators have real prior builds (versus no builds at all, whom no record can help). That ratio is not established anywhere, including in my own notes, and it is now a standing question in the field work: when lenders pass on an unproven operator, how often is it someone who has actually built before?

## Related notes in this vault

- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|The running thesis note]] (the lender-memory reframe and its two falsification routes live here)
- [[the-nvidia-backstop-is-a-track-record-bridge-not-a-floor|The backstop as a track-record bridge]]
- [[gpu-lending-has-a-tenor-mismatch-inference-rents-short-debt-runs-long|The tenor mismatch]]
- [[a-gpu-has-three-obsolescence-curves-not-one|Three obsolescence curves]]
- [[operator-execution-risk-is-the-ununderwritten-half-of-gpu-credit|Operator execution risk]] (post one's spine)

If you lend against GPUs and have an answer to the repeat-lending question, either direction: dylanduyvu@gmail.com.
