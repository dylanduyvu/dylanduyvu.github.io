---
type: source
status: captured
created: 2026-07-14
updated: 2026-07-14
source_date: 2026-07-14
source_type: research_session
projects: []
domains: [gpu-finance, verification, credit-markets]
people: []
orgs: []
attachments: []
tags: [strategy-checkpoint, solid-findings, kill-tests, next-rung, audit]
---

# Solid findings audit and the next invalidation rung (2026-07-14)

Context: strategy checkpoint. A first "solid answers" list was delivered from an agent's session memory, failed Dylan's vault-check challenge, and produced the confidence-requires-citation rule now in CLAUDE.md's Verify Before Asserting section. This note is the corrected list, each line naming the disk it stands on, plus the next-rung test design that survived the audit.

## Solid findings, with anchors

1. No shared record of operator performance exists; the working substitute at every observed tier is familiarity, structure, or conversion at scale. Anchors: [[phil-private-credit-jakub-relay-2026-07-13|Phil relay]], [[mcdavid-stoddard-silicon-network-operator-vetting-email-2026-07-13|McDavid thread]], [[the-track-record-that-cant-travel|post two]], [[same-counterparty-familiarity-substitutes-for-history-at-every-observed-tier|inbox hunch]].
2. The incumbent data layer's residual number is modeled from rental inputs, not observed from sales; the only confirmed holder of resale prints is equipment-side. Anchor: [[semianalysis-residual-value-is-modeled-not-observed|residual modeled not observed]] (confidence high, sales-confirmed 2026-07-13).
3. The delivery milestone prices at roughly 300 to 500 basis points when the lender watches it firsthand, inside one deal. Anchor: [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|USD.AI capture]], intra-deal caveat intact.
4. Verification is not absent, it is misaimed. Collateral existence verification exists and is bought (Aravolta); draw-gate verification exists at origination (USD.AI). What nobody does is independently verify claimed history, contract-defined delivery and revenue truth in a form that travels between deals. Anchor: [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|the verification gap]] (three narrowings recorded there).
5. Downgraded from the first list: "capital collects materials rather than checking" is solid for the participant tier (Phil) and PENDING for Silicon; the fork question sent 2026-07-13 22:20 ET used the confirm-my-guess form, so McDavid's reply gets graded by whether he corrects it, not whether he nods. Anchor: [[mcdavid-stoddard-silicon-network-operator-vetting-email-2026-07-13|McDavid thread]].
6. Service-level remedies are toothless (future-use credits only), so reputation carries delivery risk across four seats: customer, lender, insurer, and landlord (neocloud colocation leases run 3 to 5 percent higher yield-on-cost). Bear case attached to any credential product: the market's revealed answer is "pay up for CoreWeave." Anchor: [[sla-remedies-are-toothless-so-reputation-carries-delivery-risk|remedies are toothless]].
7. Extra borrower equity is the generic cure for any lender concern, which makes the cushion-and-amortization toolkit finding less diagnostic of a verification gap than it first appears. Anchor: [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|equity cushions not evidence]].

## The next rung, in plain words

The gap is confirmed and the substitutes are mapped, but nobody has ever been shown a record and asked to act on it. Every conversation so far asked whether history matters in the abstract. The next rung is a forced choice with a real document.

The test: take one operator's verified delivery record, a real document showing what they built, when it went live, how it ran, and whether they got paid (draw-file material from a live loan, or a realistic mock). Put it in front of one lender. Ask them to price the same deal twice, once without the document and once with it, everything else held still.

The scoreboard, and why it is equity: Bernie's insight says lenders resolve any discomfort by demanding more borrower cash, so "this is interesting" answers are noise. The only result that counts is a moved number: with the document, does the operator put in less of their own cash, or pay a lower rate, at the same structure. If the lender would still demand the same equity, the record does not price at that seat, and that is a clean no.

Provenance note: this test was already in the vault before it was proposed in chat. The equity-cushion note's implications section prescribes nearly this exact comparison ("what they would do at the same equity level with and without better operator evidence"). The chat contribution is only the artifact-first form: demo a document, not a concept.

What feeds it: the five operator conversations planned this week supply the artifact (one of them is where the record comes from, with consent) and test the supply side in the same motion, whether an operator will hand over their draw file at all.

## Provenance of the rung: what moved between Monday's all-hands and this proposal

Asked directly by Dylan 2026-07-14: this experiment was not in Monday's notes because it did not exist yet. It is a same-morning synthesis of four dated inputs, three of which were uncaptured or unconnected when the notes posted.

1. The artifact exists (captured 2026-07-12 late, [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|USD.AI capture]]): money is released only after installation is verified, so verified delivery documentation is already produced inside live loans, as draw files. Captured before the all-hands posted but not metabolized into it.
2. The priced/unpriced boundary is exact (same capture): the 15 to 10-12 repricing proves the delivery event is worth 300 to 500 basis points when the lender watches it firsthand. The open question collapsed from "does history matter" to "does the portable form of an already-priced fact also price." That narrow question is demo-shaped.
3. Concrete beats abstract, demonstrated (2026-07-13 evening, [[mcdavid-stoddard-silicon-network-operator-vetting-email-2026-07-13|McDavid thread]]): the abstract question stumbled, the named-deal version answered in three hours, and Stonebriar's abstract version sits unanswered at seven days. The next instrument should be a document, not a survey question.
4. The scoreboard predates the idea (2026-07-01, [[less-proven-gpu-operators-get-funded-through-equity-cushions-not-sla-evidence|equity cushions note]], first read 2026-07-14): same equity level, with and without the evidence. Today's audit connected it to the artifact.

No new lender input demanded this rung. The connection is the new thing, which is why it postdates the notes.

## Open

- Hub placement: no underwriting-record project hub exists in 30-projects (only derivatives, novation, residual-value-pricing, harness). Creating one versus attaching this to an existing hub is Dylan's call.
- Which lender gets the first demo: Ryan if his thread revives, a bump replier, or Bernie as the friendly seat.
- Real draw-file versus realistic mock for artifact one.

## Links

- Related Insights: all seven anchors above.
- Related Sources: [[gpu-lender-question-set-2026-07-13|question set v1]], [[semianalysis-rob-howle-sales-call-2026-07-13|Rob Howle call]].
- Rule produced by this incident: CLAUDE.md, Verify Before Asserting, confidence-requires-citation entry dated 2026-07-14.
