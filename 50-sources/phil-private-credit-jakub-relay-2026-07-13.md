---
type: source
status: captured
created: 2026-07-13
updated: 2026-07-14
source_date: 2026-07-13
source_type: relay
projects: []
domains: [gpu-finance, credit-markets, verification]
people: [jakub-janiak]
orgs: []
attachments: []
tags: [relay, private-credit, syndication, participant, diligence, deployment-1]
---

# Phil (private credit, via Jakub): how a participant diligences GPU deals

## Context

Slack relay from Jakub, 2026-07-13 ~3:00 PM. Phil (surname and firm TBD), Jakub's friend in private credit, the question-set's first deployment target. THIRDHAND CAPTURE: Phil to Jakub to us, quotes as Jakub pasted them. Prior context from Phil, earlier the same day: firm has "looked at a few" GPU financing deals, "haven't committed to one yet but we're very close," and has "a better view of residual value (which is hanging in better than we originally expected)."

Jakub asked (his own wording, which happens to be the outside-diligence question CUT from question-set v1): "on the GPU financing deals, do you guys bring in consultants to help diligence or are you doing it all in house?"

Phil, verbatim per relay: "For us, we will usually get it from whoever is leading the deal. Apollo / BX have shown us some stuff and they hire consultants / external DD to validate that. We will use our expert networks to talk to experts to validate what we learn through the materials we receive."

## Seat calibration, answered without being asked

PARTICIPANT, mega-tier. "Whoever is leading the deal" plus Apollo and Blackstone as the leads places him in slices of $1B-class club facilities, not the $5-100M tier. Reclassification: OUT of the wave-two ICP, INTO a rarer box, syndication-mechanism informant. The question-set doc's participant pivot now governs this thread.

## The reading

- THE PRIVATE CONVERSION LAYER. Inside a club with no rating and no filings, the lead's reputation and the lead-commissioned DD do the job Moody's and public filings did in the CoreWeave May deal. Same function as post two's conversion layer, private form, and it exists only because an Apollo-sized lead is in the room.
- THE PARTICIPANT VERIFICATION STACK: the lead's pack, the lead's consultants' conclusions, then rented judgment (expert-network calls) validating the narrative. No independent primary diligence on the operator. Economically forced, not lazy: a slice-taker cannot spend $250-300K re-doing what the lead bought. Reliance is the design.
- LOCKS ONTO THE ROB DATAPOINT (2026-07-13 sales call): the $250-300K bespoke engagements are LEAD purchases; participants consume conclusions downstream. The work travels, but only inside the syndicate, attached to one deal. The operator never carries it to the next lender. This is the post's distinction, observed from the buyer's chair.
- ABSENT FROM HIS TOOLKIT, unprompted: ratings, ClusterMAX, any data product. Pack plus experts is the entire stack from his seat.
- What surprised Jakub, named: not the structure (textbook syndication) but how thin the participant's own verification layer is, and that it satisfies a credit committee. Real money, operator-shaped risk, phone calls about the market.

## The six answers (relayed 2026-07-14, verbatim per Dylan's paste; ask order unconfirmed)

1. Residual view: "model off rental curves. Which recently had been flat to even up. But you can indeed make residual assumption based on resale value by estimate compute demand vs TSMS production forecast." (TSMS read as TSMC.) MODELED, third seat: rental curves plus a demand-versus-chip-supply fundamentals model. No observed prints. The observed-resale census still has one member.
2. Sticking point on the near-commit deals: "quality of the counterparty. Loopholes in the cancellation clauses. If neoclouds, installation track record." Customer quality first (matches the facility dataset), CONTRACT LOOPHOLES second (the contract-defined-truth layer, live), and installation track record NAMED as a current blocker on real deals.
3. Operator profile and auto-decline: "track record in large scale deployment. Power derisked. Equip secured. Automatic pass would be bad track record or no record or no IG offtake (IG wrapper)." INITIAL READING, NOW SUPERSEDED: record or wrapper; either leg opens the door. Phil's follow-up below resolves the ambiguity the other way. At his seat, a trusted record does not substitute for investment-grade offtake. The requirements are conjunctive: credible operator record AND investment-grade offtake / wrapper.
4. Verify versus deck's word: "you actually must verify and dig in on track record. Industry calls. Verification done in real world. Think of it like a new hire being reference checked." Verification EXISTS and it is phone-based reference checking through industry calls. This REFINES the 2026-07-13 reading below (dated correction per belief history): the participant stack is not verification-free; its track-record layer is informal human reference calls. The incumbent competitor for any portable record is a free phone call, not nothing.
5. Does the record move pricing: "pricing is based on ultimately credit counterparty risk. If you have IG wrapper, you start with that IG SUNs and build 150-250 bps on top based on contract tightness." A PRICING FORMULA: base is the customer's own senior unsecured curve, plus 150 to 250 basis points set by contract tightness. The operator's record is not in the formula. Pricing half of the hypothesis DISCONFIRMED at this tier; contract quality is a priced variable inside the band.
6. Biggest problem zoomed out: "many don't have track record or they don't have IG wrapper." The gap named from the buyer's chair: many operators hold NEITHER leg. GRADING CAVEAT: this arrived after several track-record questions, so partially primed; but answers 2 and 3 named track record before the priming compounded.

## Three follow-up answers (relayed 2026-07-14)

1. Dylan asked: "if a neocloud has a deployment record you trust but no IG offtaker, is it still an automatic decline?"
   Phil: "Yes. Cause the reason to be in that position is either (i) spec building, (ii) issue with site, (iii) potentially end up mismatched on long term lease liability and short term rental agreement (wework issue )"
2. Dylan asked: "have you seen a new lender group rely on a diligence or performance report produced for an operator's prior financing?"
   Phil: "don't know"
3. Dylan asked: "on the industry ref calls, who do you usually speak with and what, if anything, remains unresolved?"
   Phil: "former employees. Customers. Consultants. Local GC"

The first answer resolves the load-bearing ambiguity. Even a trusted deployment record does not get a deal considered without investment-grade offtake at this participant's tier. Phil's mechanisms are not missing operator telemetry: speculative building, a site problem, or a WeWork-style duration mismatch in which long-lived lease obligations are supported by short rental contracts. A record cannot cure those risks.

The second answer is UNKNOWN, not evidence that prior reports do or do not travel. The third maps the incumbent reference-checking network: former employees for team execution, customers for delivered service, consultants for technical / market diligence, and the local general contractor for site and construction execution. Phil did not answer what remains unresolved after those calls, so no gap should be inferred from that half of the question.

## Composite read after the nine

The hypothesis is narrower at this tier than the six-answer read suggested. The operator record is a necessary but insufficient eligibility input. Investment-grade offtake / wrapper is an independent gate, and customer credit plus contract tightness sets the rate. A portable record therefore cannot turn an otherwise unbankable merchant build into a financeable mega-tier deal. Its possible value is limited to satisfying the operator-diligence gate inside a deal that already has bankable offtake, power, equipment, and site.

The incumbent it must beat is also stronger than "phone calls": former employees, customers, consultants, and local contractors form a real reference network. The record product would have to make that evidence cheaper, more consistent, more portable, or more reliable. The equity axis remains a separate small-tier question because this seat uses investment-grade wrappers rather than equity cushions.

## Candidate insight, staged NOT promoted

The conversion layer has a private form: inside club deals, lead reputation and lead-commissioned diligence substitute for ratings and filings, so the record travels exactly one syndicate wide and dies with the deal. Corollary hypothesis, untested: a PARTICIPANT may be a better early customer for a portable record than a lead, because the lead has consultants and the participant has nothing independent at all. Promote only if a second seat corroborates. WEAKENED 2026-07-14 by answer 4: participants do hold an independent layer, informal industry reference calls, so the corollary's premise (nothing independent) overstated. The follow-up weakens it again by showing those calls reach former employees, customers, consultants, and local contractors. The sharper version: a portable record must arm or compress a functioning reference process, not replace an empty seat.

## Boundaries

- n=1 firm, thirdhand, casual channel. Some participants shadow-underwrite fully; his firm's practice is not the category's.
- His tier is Apollo/BX-led. Whether lead-participant structures exist at the $5-100M tier AT ALL is unknown and load-bearing: if they do not, small-tier deals are sole-balance-sheet, and memory travels even less down there than post two claims.
- The improved residual view likely derives from the lead's materials. Untested.
- "Yes" in follow-up answer 1 is read as "yes, it is still an automatic decline," based on the exact question wording. This is a thirdhand relay and should be corrected if Jakub says Phil meant the opposite.

## Thread status

Stop extracting for now. Phil has answered nine questions through a thirdhand relay, the marginal value is falling, and the key ambiguity is resolved. The only natural housekeeping left is his surname / firm. Reopen the thread only with a real operator artifact or deal packet that lets him react to something concrete.

## Links

- Sources: [[gpu-lender-question-set-2026-07-13|Question set v1]] (deployment 1), [[semianalysis-rob-howle-sales-call-2026-07-13|Rob Howle call]] (the consulting price this locks onto)
- Related Insights: [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|the verification gap]]
- Areas: [[gpu-finance|GPU Finance]]
