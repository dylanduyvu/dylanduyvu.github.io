---
type: source
status: captured
created: 2026-07-13
updated: 2026-07-13
source_date: 2026-07-13
source_type: chat
projects: []
domains: [gpu-finance, credit-markets, datacenters]
people: [yida-gao]
orgs: []
attachments: [Screenshot_2026-07-13_at_3_14_17_PM.png, photo_2026-07-13_15_14_26.jpeg]
tags: [telegram, refinery, borrower-chair, dscr, warm-path, first-execution]
---

# Yida (Refinery, via Telegram): a first-execution operator forming inside our own cap table

## Context

Telegram exchange 2026-07-13, 2:41 to 3:14 PM, captured from screenshots. Dylan asked the warm-path question from the Thursday all-hands plan ("are you involved in / adjacent to any gpu financing deals for datacenter buildouts"). Yida: "Yes I am." He is INCUBATING a company, was working on its financial model that same hour, and shared a draft site and a model screenshot unprompted. Relationship: yida is our last round's LEAD INVESTOR (VC), so this is the warmest possible channel and carries cap-table sensitivity.

The company: REFINERY. Tagline "Compute Where Power Exists." Micro data centers deployed at qualified host sites and operated as one AI inference fleet. Draft site: refinery-project-site.vercel.app ("Rough draft of new site. Don't mind the shitty logo").

## The model screenshot (facts as shown)

- Table 1, DSCR by leverage: Y2 with 2% hosting escalation, TARGET >1.25x. Hosting fee columns $0.180 to $0.350 per kWh (with $/kW/month equivalents $130 to $252). Debt rows 55% to 80%. DSCR spans 0.73 (80% debt, $0.18) to 2.35 (55% debt, $0.35).
- Table 2, DSCR by power cost: annotated that power nets to zero at PUE pass-through, so DSCR is power-cost-invariant. Rows $0.05 to $0.10 per kWh, values constant down each column.
- Table 3 header visible, cut off: equity IRR proxy by leverage.

## The reading

1. DEBT SIZING IS HAPPENING NOW. Nobody builds a DSCR-by-leverage sensitivity with a 1.25x target unless they are sizing debt. The "financing or just equity" question was answered by the artifact before it was asked.
2. LAYER DISTINCTION, load-bearing and unresolved: this model finances the SHELL. Hosting fee per kWh is colo-style revenue; PUE pass-through pushes commodity risk to tenants (lender-friendly). Per the Choi capture, the shell is the ~30% of datacenter cost that already has an asset-backed market. The GPUs inside, the 70% with no market, are either customer-owned, financed separately, or the part of "operated as one AI inference fleet" that makes Refinery an OPERATOR rather than a landlord. Which of those it is determines whether yida is about to experience the thesis firsthand.
3. RECLASSIFICATION: yida is the BORROWER CHAIR, prospectively, at the first-execution tier, plus his VC dealflow seat. The lender question set does not apply; a borrower-chair variant is needed (logged in the question-set doc).
4. THE WARM PATH INVERTED: Thursday's plan was "ask yida for warm intros to lenders." He turned out to be generating lender conversations of his own. Every lender who quotes Refinery terms becomes a warm wave-two contact instead of a cold row.
5. MODEL HINGE: the green zone starts around $0.25/kWh hosting at 70% leverage (DSCR 1.25). Whether the market pays that is the model's whole question, and question 5 below tests it.
6. HELD, NOT FOR ANY CALL: a first-execution operator incubated by our own lead investor is the softest imaginable landing for a record-product pilot. Logged so it is not forgotten; unsaid so it is not fumbled. Cap-table dynamics make this doubly a Dylan-only decision.

## Questions drafted for the Telegram thread (send status UNKNOWN as of capture; check the thread before assuming)

1. this is great. are you talking to lenders on this yet, or equity-first for the initial sites?
2. if yes: who lends against modular deployments like this, and what did they quote? (rate, advance rate, term)
3. what did they ask about you as the operator, versus the site and the host contract?
4. the GPUs inside: customer-owned, or are you financing those too? separately or same facility?
5. what hosting fee are real conversations landing at?

## Boundaries

- Draft-stage company, self-reported, model is his own work-in-progress, screenshot partial (IRR section cut off).
- "Incubating" is doing unknown work: his role could be anywhere from advisor to acting CEO. Clarify on the call.
- All numbers are model assumptions, not market quotes, until question 5 returns.

## Next

- Get him on a call (Dylan's stated intent). Build the borrower-chair question set before it.
- On the call: the layer question (point 2 above) first, lender-conversation inventory second, dealflow angle (Zile-style walk of what GPU financing he sees as a VC) third.
- Create a yida-gao person hub if the call happens.

## Links

- Sources: [[gpu-lender-question-set-2026-07-13|Question set v1]] (borrower-chair variant flagged there), [[usdai-david-choi-touchcraft-podcast-gpu-financing-2026-07|USD.AI podcast capture]] (the shell-vs-GPU 30/70 framing), [[phil-private-credit-jakub-relay-2026-07-13|Phil relay]] (same-day deployment sibling)
- Areas: [[gpu-finance|GPU Finance]]
