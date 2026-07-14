---
type: source
status: active
created: 2026-07-13
updated: 2026-07-13
source_date: 
source_type: question_set
projects: []
domains: [gpu-finance, verification, credit-markets, residual-value]
people: []
orgs: []
attachments: []
tags: [question-set, lender-elicitation, kill-tests, residual-census, reusable]
---

# GPU lender question set, v1 (2026-07-13)

Reusable six-question instrument for informal lender conversations (warm intros, friendlies, the deal-runner layer). Built 2026-07-13 for Jakub's private-credit contact; designed to travel. Register: craft talk between peers, never a pitch. Every answer gets a follow-up question, not a product mention. The SemiAnalysis-call discipline applies to friendlies too.

## Seat calibrator (ask first, one line)

"Are you guys doing these direct, or coming into deals someone else puts together?"

Direct originator: the set lands as designed. Participant: honest answers to 3 and 4 become "the arranger's box" and "whatever's in the lender pack," and the conversation upgrades into a live specimen of the syndication mechanism; pivot to what is in the pack, page by page. Either way this is the deal-runner layer.

## The six

1. What gave you the better residual view? Actual sale prices from somewhere, or modeled off rents?
   (Feeds the observed-residual census. If real prints: WHERE is a new node on the map. Natural opener whenever residual came up first.)
2. What's the sticking point on the deals you're close on but haven't committed to?
   (The marginal underwriting concern on live deals. An operator-shaped answer is route-one fuel.)
3. What's the operator profile you'll lend to, and what makes someone an automatic pass?
   (Tests the SKIP half of the lbh: does an eligibility gate exist, and what is it built from. "They need to have built before" gets the Q4 follow-up with teeth. "Offtake plus equity is enough" is route-around evidence, structure substituting for history. RELAY WARNING: "automatic pass" means auto-DECLINE to a credit person; do not let it paraphrase into "passes the bar.")
4. For the ones that clear the bar, what can you actually verify about what they've built before, versus taking the deck's word?
   (The verification gap, asked as craft talk.)
5. Does the operator's track record move your pricing or structure at all, or do collateral and sponsor do the work?
   (Kill route one, de-primed, no product language.)
6. Zooming out from your deals, what's the biggest problem with getting gpu deals done at all?
   (The only hypothesis-free question in the set; the disconfirmation channel. Prior from the wave and Stonebriar: the expected answer is NOT verification (cushion, speed, sponsor). An unprompted operator-shaped answer here outranks a yes on 5, because nobody led him there. Wording note: an earlier draft opened "aside from this," which instructs the answerer to EXCLUDE the probed topics and deletes exactly the signal this question exists to catch; keep the zoom-out form.)

## Ordering and compression

Default order: 1, 2, 6, 3, 4, 5. Asking 6 after three questions of track-record talk primes the answer toward the thesis; asked right after 2 it flows naturally (his deals, then the market) and stays clean. If the conversation compresses to three questions: 1, 3, 6. The opened door, the eligibility gate, the unprompted ranking.

## Deployment rules

- Drip across the conversation, never a six-question wall.
- Don't ask past the answer; lead with whatever door the person opened themselves.
- Capture each deployment to a source note and route the answers: Q1 to the residual census, Q3 to ICP existence, Q4 to the verification gap, Q5 to kill route one, Q6 to the problem-ranking baseline.
- Every deployment is n=1. Signal accumulates in the log below, not in any single conversation.

## Deployment log

- 2026-07-13, deployment 1 (partial): Jakub's contact PHIL (surname/firm TBD). The calibrator answered itself: PARTICIPANT, Apollo/BX-led tier, so he reclassifies out of the wave-two ICP and into syndication-mechanism informant. Jakub opened with the outside-diligence question CUT from v1, and it earned its keep: it produced the seat read and the participant verification stack. Sharpened follow-ups and full reading: [[phil-private-credit-jakub-relay-2026-07-13|capture note]].
- 2026-07-13, deployment 2 (partial, demand side): McDavid Stoddard (Silicon Network), cold email thread. The question-four analog stumbled in abstract form ("who manages the SLAs?") and landed once anchored to a named capital flow (Cluster 01, FarmGPU, pool capital). Answer: operational track record, technical competency of the team, downside protection and collateralization; familiarity carries the repeat counterparty. The verify-independently-versus-operator-provided fork is drafted as the thread's final question, send status unconfirmed. Capture: [[mcdavid-stoddard-silicon-network-operator-vetting-email-2026-07-13|email thread]]; insight updated: [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|tokenization auditable, not true]].
- Needed, not yet built: a BORROWER-CHAIR variant of this set. DEFERRED 2026-07-13 evening: the first candidate (yida/Refinery) downgraded to keep-warm periscope, probably shell-side; build the variant when a genuine borrower-chair target exists, or if yida's discriminator answers come back our-balance-sheet / we-operate.

## Links

- Related Insights: [[semianalysis-residual-value-is-modeled-not-observed|residual modeled not observed]] (Q1 census), [[gpu-financing-needs-forward-strips-for-residual-marks|forward strips]] (residual marks), [[the-verification-gap-is-contract-defined-delivery-and-revenue-truth|the verification gap]] (Q4)
- Related Sources: [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|USD.AI podcast capture]] (the route-around reading behind Q3)
- Areas: [[gpu-finance|GPU Finance]]
