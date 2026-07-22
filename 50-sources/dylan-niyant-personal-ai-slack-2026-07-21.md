---
type: source
status: raw
created: 2026-07-22
updated: 2026-07-22
source_date: 2026-07-21
source_type: slack-conversation
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - enterprise-ai
people:
  - niyant
  - dylan-vu
orgs: []
attachments: []
tags:
  - slack
  - strategy
  - enterprise
  - public-proof
---

# Dylan and Niyant: personal-AI strategy Slack exchange

## Context

Dylan asked whether the enterprise problem was meant to narrow the general personal-AGI research program before the first experiments, or whether it mainly justified the work and could become useful later. The exchange clarified the current problem/solution hypothesis, the role of the personal demo, and the intended legitimacy, inbound, and outbound sequence.

The transcript references a screenshot posted at 6:30 PM. The image itself was not included in this capture.

## Raw Context

### 6:01 PM

**dylan vu**

niyant is your goal with finding the growing enterprise problem rn to scope down the subsequent experiments and invalidation ladder you've laid out for the "general personal agi" product?

e.g., something like next sentence prediction for email drafting, which would inform the datasets (maybe diff than those you have scoped rn) that you'd want to collect and structure for accurate outputs

or is this just more so a side quest just so that you can point to later

### 6:03 PM

**niyant**

The point is to have a reason to do the work at all

Like if it's not solving a growing business problem it's not worth working on

### 6:04 PM

**dylan vu**

by it do you mean a problem addressed by dynamic & live context ingestion pipeline + continual learning model? (edited)

### 6:13 PM

**dylan vu**

if i had to guess your answer based on what i remember, your vibe is:

1/ create something to show that we can produce something (hopefully it's valuable)

2/ approach enterprises to explore whether that something solves a problem. simultaneously gain legitimacy and build a relationship. if no problem is discovered for the solution, than leverage relationship to sift out other problems that they could lean on us to tackle

lmk if i'm wrong in understanding (edited)

### 6:24 PM

**niyant**

By it I mean literally any problem or any solution

### 6:25 PM

**niyant**

So yeah I have a hypothesis for a problem and solution as of now

**dylan vu**

i see - so you're in pure enterprise problem discovery mode rn? given your lbh

**niyant**

Need to show the ability to solve the problem publicly to have a chance with sales

The thesis I shared earlier outlines the enterprise problem

### 6:26 PM

**niyant**

But yeah given the current LBH yes. It's just that I've largely completed the LBH which was the thesis from earlier (edited)

Will move on after I clean up Jakub's comments

### 6:27 PM

**dylan vu**

i see, it's this problem: "Supplying context to LLMs is a ~$600B cost doubling every 2 years. For every $1 spent on tokens reading context, ~$13 of human time went into producing it. Businesses pay people to gather information, decide what matters, communicate it in meetings and messages, translate it into prompts, and correct work produced without it. As intelligence per dollar increases, more context becomes worth processing. The cost of producing and transmitting that context rises alongside the usefulness of the intelligence consuming it."

**niyant**

Yeah

### 6:30 PM

**dylan vu**

the intention of the toy example here is to be based on data in your phase 1 section, but the mvp for the enterprise will be diff data, right?

Screenshot 2026-07-21 at 6.29.32 PM.png

### 6:31 PM

**niyant**

theres not really an mvp for enterprise

i guess it would be the code for the data collection and cleaning pipeline

### 6:32 PM

**niyant**

the code i use for myself would be the same as the enterprise mvp

### 6:33 PM

**dylan vu**

ok like the intention is: ok here's this macro problem, here's a proposed solution and the build. i'll demonstrate it's efficacy on myself with my data. let's see how this fits for your enterprise to solve the stated problem (eventually)

**niyant**

yes

### 7:06 PM

**dylan vu**

any concerns around identifying specific problem in the "gather information, decide what matters, communicate it in meetings and messages, translate it into prompts, and correct work produced without it" stack before building the toy demo? or is the toy supposed to inform which part to focus on?

e.g., granola narrowing to meeting capture/synthesis

### 7:14 PM

**niyant**

i think the problem may not be specified enough regarding how much context is informational background vs specifying desires, but i think that sentence is already the correct level of specification. the experimentation itself is already quite focused starting with obsidian note taking then moving to browser use, since thats the data i have available

### 7:34 PM

**dylan vu**

i get it

### 7:43 PM

**dylan vu**

what counts as enough public proof to start enterprise outreach. i'm assuming it falls somewhere after one of the experiments/published posts within or at the end of phase 1?

### 8:01 PM

**niyant**

im not doing 80% of phase 1 fyi, just a static implementation with basic data. i also would not consider enterprise outreach a shot term goal. on an individial level, my intention is to increasingly present legitimacy (public product demos, pricing page, landing page, blogs, etc) and collect inbound. if the set of inbound generation strategies fails I would initiate outreach.

## Summary

- The enterprise problem thesis is the reason to pursue the work, not an input currently being used to select a narrow workflow before building.
- The current solution hypothesis is the data collection and cleaning pipeline plus the learning system demonstrated on personal data.
- Niyant regards the same collection and cleaning code as the closest enterprise MVP, even though the data and eventual workflow may differ.
- The first experiments use Obsidian and browser data because those sources are available.
- The near-term build is a static implementation with basic data, not most of formal Phase 1.
- The intended sequence is public proof and legitimacy, then inbound; outbound follows only if the inbound strategy set fails.

## Promoted Insights

- [[public-proof-can-establish-builder-legitimacy-without-proving-enterprise-demand|Public proof can establish builder legitimacy without proving enterprise demand]]
- [[a-static-personal-demo-cannot-validate-a-dynamic-enterprise-context-system|A static personal demo cannot validate a dynamic enterprise context system]]
- [[available-personal-data-can-scope-a-demo-without-identifying-the-enterprise-wedge|Available personal data can scope a demo without identifying the enterprise wedge]]

## Open Questions

- What qualifies as a failed set of inbound strategies?
- What does the static implementation test from the larger thesis?
- What evidence would justify calling shared collection and cleaning code an enterprise MVP?
- When and how does the informational-context versus desire-context split enter the experiments?

## Links

- Project: [[personal-ai-context-learning|Personal AI Context Learning]]
- Synthesis: [[personal-ai-strategy-and-evidence-sequencing|Personal AI strategy and evidence sequencing]]
