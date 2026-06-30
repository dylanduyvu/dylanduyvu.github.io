---
type: source
status: captured
created: 2026-06-30
updated: 2026-06-30
source_type: conversation-memo
domains: [gpu-finance, ai-infrastructure, compute-contracts, startup-validation]
projects: [gpu-compute-novation, gpu-residual-value-pricing, gpu-compute-derivatives]
sources: [usd-ai-call-harry-page-2026-06-29, novation-shelving-decision-2026-06-30, gpu-kbb-demotion-decision-2026-06-30]
people: [harry-page, thomas-galbraith]
orgs: [usd-ai, nebius, barkr]
tags: [gpu, compute-finance, customer-discovery, problem-inventory]
---

# Compute finance space commitment and problem inventory memo

## Summary

This memo marks a space-level decision: compute-finance is the deliberate arena, so individual thesis failures should be treated as probes in a compounding search process rather than as resets. Novation is one probe down, SLA verification is the immediate cheap test, and the next upgrade is to maintain an explicit portfolio of compute-finance problems instead of single-threading the next volunteered pain.

Correction: the raw memo below talks about a future Barkr call, but no upcoming Barkr call is scheduled. The only Barkr call was the already-logged 2026-06-18 Thomas call. The current next step is async email follow-up to Thomas at Barkr and Bernie at American Compute about USD.AI's SLA/uptime verification pain.

## Durable Takeaways

- Compute-finance is now the chosen search space, not just a sequence of disconnected startup ideas.
- Novation dying is not a setback if the space is deliberate; the context, relationships, and stack understanding remain compounding capital.
- SLA/uptime verification is the best immediate lead because USD.AI volunteered it and tied it to pricing/WTP, but it should stay a probe until it replicates.
- The larger upgrade is deliberate problem inventory: list the unsolved compute-finance pains and test them cheapest-fatal-first.
- The current portfolio includes SLA/performance verification, naked valuation/KBB demand-side testing, bare compute-contract underwriting, and a novation tripwire.
- Thomas/Barkr and Bernie/American Compute are the first async follow-up tests for the SLA pain USD.AI volunteered.

## Raw Context

i'm currently doing this:

Good - that resolves the fork, and it changes the calculus in your favor. If compute-finance is the deliberate space, then novation dying isn't a setback, it's one probe down in a domain you're committed to, and all the context you've built (the lending stack, the players, Barkr, the supply dynamics, the relationships with Sam/USD.AI/Nebius) is compounding capital, not sunk cost. You're not starting over. You're a few probes into a space you've chosen, with a working method and warm relationships. That's a genuinely strong position.

So with the space settled, here's how I'd think about effort allocation, and it's not just "go test SLA."

The space-level conviction lets you do something you couldn't do when you were thesis-by-thesis: map the space's problems deliberately instead of waiting for the next one to be volunteered to you. SLA is one pain you stumbled into. But you now understand this stack well enough to ask, systematically, "where are all the unsolved problems in compute-finance?" rather than chasing whichever one the last call surfaced. That's the upgrade conviction-in-the-space buys you.

So I'd run two things in parallel, weighted toward the first:

1. Test SLA cheaply (the lead in hand). Still the right immediate move - it's volunteered, WTP-backed, and free to test via Barkr. One cheap question: does the pain replicate with WTP across other lenders/insurers? Barkr first, two or three others. But hold it as a probe, not the new foreground. Don't build the ladder until it survives.

2. Deliberately inventory the space's problems (the upgrade). Because you're committed to compute-finance, spend some real effort listing the candidate problems you've already brushed against, so SLA isn't your only shot and you're not back to single-thread-or-bust. From just our conversations, you've already surfaced several:

SLA / performance verification (USD.AI volunteered, WTP-backed)

Naked valuation data / KBB-of-compute (parked, but the demand-side test never ran - and you keep accumulating "everyone wraps the number" signal)

Credit/underwriting of bare compute contracts (USD.AI won't do it because no recovery - is there a structure that makes contract-only lending work?)

The novation tripwire (dead now, revives if supply loosens - keep the alert)

That's already a portfolio, not a single bet. The move conviction-in-the-space enables is treating these as a pipeline you test in sequence by cheapest-fatal-first, rather than marrying one.

Why I'm pushing the inventory and not just "go hard on SLA": the failure mode for someone who's just had a thesis die is to over-rotate onto the next available one to fill the void. You have conviction in the space, not yet in SLA specifically. So the disciplined move is to let SLA earn the foreground through the same cheap test novation went through, while also having two or three other candidate problems mapped so that if SLA fails its first test, you're not in crisis - you're just onto probe three.

Concretely, the next week:

Barkr conversation - tests SLA cheapest, and you can mine them the same way you mined USD.AI ("what do you wish someone solved?"). Barkr sits at a different point in the stack (valuation/insurance), so their volunteered pain will be different from Harry's, which enriches your problem inventory. Double-purpose call.

One or two more lender/insurer/offtaker calls with the same dual purpose: test SLA replication and harvest "what hurts" answers to populate the problem map.

Write the problem inventory down - even rough - so you're explicitly running a portfolio, not a single thread.

## Promoted Notes

- [[compute-finance-should-be-run-as-a-problem-portfolio-not-a-single-thesis|Compute finance should be run as a problem portfolio, not a single thesis]]
- [[compute-finance-problem-inventory-2026-06-30|Compute Finance Problem Inventory]]
- [[gpu-finance|GPU Finance]]
- [[sla-and-uptime-verification-is-a-sharper-gpu-lender-pain-than-novation|SLA and uptime verification is a sharper GPU lender pain than novation]]

## Open Questions

- Does SLA/uptime verification replicate across Barkr, American Compute, other lenders, insurers, or offtakers?
- What volunteered pain do Thomas/Barkr or Bernie/American Compute name from their positions in the stack?
- Can bare compute-contract lending be made financeable through structure, collateral, assignment rights, escrow, or insurance?
- Which candidate problem has the cheapest fatal test next?

## Links

- Areas: [[gpu-finance|GPU Finance]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]], [[gpu-residual-value-pricing|GPU Residual Value Pricing]], [[gpu-compute-derivatives|GPU Compute Derivatives]]
- Orgs: [[usd-ai|USD.AI]], [[nebius|Nebius]], [[barkr|Barkr]]
