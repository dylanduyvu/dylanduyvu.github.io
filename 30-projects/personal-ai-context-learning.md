---
type: project
status: active
created: 2026-07-22
updated: 2026-07-23
aliases:
  - Personal AI Context Learning
  - Niyant's personal-AI thesis
domains:
  - personalized-ai
  - continual-learning
  - agent-memory
people:
  - niyant
  - dylan-vu
orgs: []
tags:
  - personal-ai
  - context-ingestion
  - world-models
  - continual-learning
---

# Personal AI Context Learning

> [!note] Source boundary
> This project includes internal Notion and Slack context alongside the public World Models notes.

## Current State

The public World Models notes describe a three-phase research program: reconstruct a faithful personal event stream and predict the next action; learn bounded local comparisons from post-suggestion behavior; then test sandboxed multi-step assistance. The formal phases are specifications, not completed experiments.

Niyant's near-term execution is narrower than that program. In the July 21 Slack exchange, he said he plans a static implementation with basic data and does not expect to implement roughly 80% of formal Phase 1 now. He will start with Obsidian notes and then browser use because those are the personal data sources available to him.

The business thesis is that producing and transmitting context to LLMs is a growing enterprise cost. Niyant treats that thesis as the reason to do the work. The immediate build is meant to demonstrate ability publicly, build legitimacy, and attract inbound interest. Enterprise outreach is not a short-term milestone; outbound becomes relevant if the set of inbound strategies fails.

Dylan is exploring a more interaction-first product wedge: personalized intent compression for computer use. The initial example predicts the next app and control at a natural handoff point and offers a one-key, non-destructive completion. Niyant initially called the idea too vague, then said it aligns overall after Dylan clarified the progression. Niyant's ideal target remains the content of the next write because he sees that as stronger evidence of understanding; his main concern with starting at app prediction is that he uses roughly three apps, allowing a trivial frequency predictor to look accurate without being useful.

The resulting formulation is a structured-resolution ladder rather than an unrestricted computer-use branch: domain or app → exact object or control → operation → content. This mirrors Phase 1's domain, location, operation, and content decomposition. Each level must beat its own trivial baseline and demonstrate felt acceleration; easier location predictions do not automatically imply goal understanding or progress on semantic content prediction.

On July 22, Dylan asked what Niyant would have him, or a second pair of hands generally, build to contribute to the vision. Dylan reported that Niyant's answer was to build the computer-use NAP concept. This converts semantic computer routing from an adjacent product idea into an explicitly useful complementary workstream. It does not yet specify whether Niyant means exact destination routing, broader action trajectories, or a live Tab product.

Omar Shaikh's public stack is the closest prior art. Markov and NAPsack address capture and semantic action labeling; LongNAP predicts personal action trajectories; GUM, Just-In-Time Objectives, Behavior Latticing, and Tempo move from user propositions toward objectives and goals; Tada packages several personal-AI interfaces. Tada's Tabracadabra already uses Option+Tab to write in a field after a research phase can inspect personal logs. It is a runnable **writer**, not Dylan's proposed **router**, and it relies on inference-time retrieval rather than proving that a trained personal model learned the user.

Dylan decided not to use Tabracadabra as a separate experiment. The planned prediction target remains next semantic focus, but the immediate work moved one rung earlier after a live Screenpipe audit. Screenpipe captured screenshots, URLs, clicks, keys, scrolls, application switches, and window-focus events. In the later roughly 50-minute natural session, only 78 of an estimated 150 physical clicks had a direct role, name, and bounds. All 40 secondary-display clicks lacked direct semantic target fields, including the Arc-to-Codex interactions closest to the proposed product. Its window-focus stream also does not guarantee explicit focus events for webpage controls.

The current LBH is therefore an acquisition gate: determine whether an out-of-the-box or minimally augmented recorder can reconstruct roughly 90% or more of 50–100 meaningful browser and native-app actions as exact semantic targets, paired with a leakage-safe pre-action frame from both monitors. Ambiguous and unresolved events remain in the denominator. Only after this passes should the project compare exact top-one and top-three destinations under recency, source-transition, screen-only, correct-history, mismatched-history, and declared-goal conditions.

Recorder research found no single turnkey Mac tool that combines exact Arc DOM targets, native control identity, both displays, raw timestamps, and hours of passive capture. The lowest-engineering acquisition ladder is now: keep Screenpipe as the two-monitor application/window/URL backbone; run a short NAPsack calibration with Accessibility enabled, especially on the secondary display; add the Arc-compatible UI + API Recorder only if webpage controls remain the failing layer; and begin a long collection only after the hybrid passes the exact-target gate. See [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]].

The first NAPsack calibration found and locally fixed a display-coordinate mismatch between its input handler and screenshot worker. A corrected run assigned all seven sampled secondary-display clicks to the right monitor and paired each with a same-display pre-action image roughly 0.10 to 0.17 seconds earlier. Direct Accessibility labels covered only two of the four meaningful intended controls, while blind screenshot-plus-coordinate reconstruction recovered all four. This is enough to keep the hybrid approach alive, but not enough to pass the gate: the run contained only four valid intended actions, so the required controlled and natural-session coverage audits remain undone.

The NAP experiment is one side of Dylan's current branch-selection LBH, not yet the chosen next project. The competing GPU branch has been sharpened from “find an offtake customer” into a demand-informed configuration gate: determine which small-server GPU configuration, if any, deserves to be purchased based on workload-specific customer evidence or defensible marketplace behavior. See [[gpu-configuration-demand-gate|GPU configuration demand gate]].

A July 2026 Google DeepMind paper adds a failure-mode lens rather than evidence for feasibility. Once a personalized predictor shows suggestions, it helps cause the future behavior it learns from. Exposed-history accuracy may rise because the model understands the person better, because the person is conforming to the model's historical predictions, or both. This makes shadow mode, randomized exposure, goal-change tests, washout periods, and agency/diversity measures necessary before treating online accuracy or acceptance as evidence of deeper personalization.

## Evidence Boundary

- A coherent thesis can justify an experiment. It does not validate the size, urgency, or buyer ownership of the enterprise problem.
- A static self-demo can test a narrow technical capability. It cannot establish the full dynamic-ingestion or continual-learning thesis.
- Obsidian and browser data make the first experiment feasible. They do not identify the best enterprise workflow.
- Public demos and inbound can establish legitimacy or interest. They do not establish deployment value, retention, or willingness to pay.
- The formal Phase 1-3 ladder remains useful as a map, but omitted rungs remain untested.
- The GDM paper formalizes a plausible value-lock-in mechanism with equations and simulated populations. It contains no new human, LLM-agent, or product experiment and does not validate that the effect occurs at a material magnitude.
- LongNAP establishes learnable personal action signal under its own phone-derived, trajectory-level setup. Its pass@1 is not next-app accuracy and it supplies no end-user routing-value result.
- Tabracadabra establishes that the keyboard-first writer interaction is runnable. It does not establish learned personalization, exact semantic routing, or goal understanding.
- Niyant's assignment establishes that computer-use NAP is strategically relevant to his vision. It does not validate Dylan's target, product value, or proposed implementation.
- Screenpipe establishes that Dylan's Mac can produce a continuous raw action and screen stream. It does not yet establish exact control-level labels. Running a predictor before that distinction is resolved would confound model quality with recorder quality.

## Key Insights

- [[public-proof-can-establish-builder-legitimacy-without-proving-enterprise-demand|Public proof can establish builder legitimacy without proving enterprise demand]]
- [[a-static-personal-demo-cannot-validate-a-dynamic-enterprise-context-system|A static personal demo cannot validate a dynamic enterprise context system]]
- [[available-personal-data-can-scope-a-demo-without-identifying-the-enterprise-wedge|Available personal data can scope a demo without identifying the enterprise wedge]]
- [[personal-agents-need-continuous-local-tracking-not-a-finished-world-model|Personal agents need continuous local tracking, not a finished world model]]
- [[a-personal-predictor-can-improve-by-making-its-user-more-predictable|A personal predictor can improve by making its user more predictable]]
- [[tabracadabra-is-a-retrieval-augmented-writer-not-a-computer-use-nap|Tabracadabra is a retrieval-augmented writer, not a computer-use NAP]]

## Syntheses

- [[nap-vs-gpu-configuration-experiment-fork|NAP versus GPU configuration experiment fork]]
- [[niyant-personal-ai-thesis-study-guide|Niyant's personal-AI thesis: a beginner's study guide]]
- [[personal-ai-phase-1-next-action-prediction|Phase 1: Can an AI learn what matters to you by watching you work?]]
- [[personal-ai-phase-2-local-preference-learning|Phase 2: Can a better next move train a better AI?]]
- [[personal-ai-phase-3-bounded-multi-step-assistance|Phase 3: Can an AI help with more than the next move?]]
- [[personal-ai-strategy-and-evidence-sequencing|Personal AI strategy and evidence sequencing]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- [[computer-use-nap-build-log|Computer-use NAP build log]]

## Hunches

- [[tab-could-autocomplete-the-next-computer-action|Tab could autocomplete the next computer action]]

## Sources

- [[dylan-niyant-personal-ai-slack-2026-07-21|Dylan and Niyant: personal-AI strategy Slack exchange]]
- [[dylan-niyant-computer-use-nap-followup-2026-07-22|Dylan and Niyant: computer-use NAP contribution follow-up]]
- [[omar-shaikh-computer-use-personalization-stack-2026-07-22|Omar Shaikh's computer-use personalization stack]]
- [[screenpipe-live-capture-audit-2026-07-23|Screenpipe live capture audit, July 23, 2026]]
- [[computer-use-capture-tool-research-2026-07-23|Computer-use capture-tool research, July 23, 2026]]
- [[google-deepmind-ai-value-alignment-for-evolving-social-norms-2026|Google DeepMind: AI Value Alignment for Evolving Social Norms]]
- [World Models public notes](https://handsdiff.github.io/)
- [Pinned public notes snapshot](https://github.com/handsdiff/notes/tree/3151afa93fd81719a6e9dc7862c269ea1f1a70e6)
- Internal Notion page: [All hands 7.20](https://app.notion.com/p/3a3307288ccf800c9d43e5386a0a1b4f)

## Open Questions

- What exact claim is the static implementation designed to test?
- After a navigation-only signal gate, should the product remain a router or carry selected context into the accepted destination?
- Is next-action prediction primarily the daily product, a forcing function for building a faithful context system, or both?
- At what rung does intent compression require genuine local-goal representation rather than shallow personal transition habits?
- When Niyant says “computer-use NAP,” does he mean exact semantic destination routing, a broader action trajectory, or the full live Tab interaction?
- Is there enough out-of-time entropy among semantic UI destinations for personalization to beat most-common and transition-frequency baselines?
- After suggestions are exposed, can accuracy improve without narrowing useful behavior or slowing adaptation after a project or goal change?
- Should domain, location, operation, and content be predicted jointly, hierarchically, or treated only as separate diagnostic heads?
- Which formal Phase 1 rungs are included, and which are intentionally deferred?
- What separates informational background from context that expresses a person's desires and judgment?
- What evidence would show that the broad enterprise context cost is urgent, budgeted, and owned by a specific buyer?
- What counts as successful inbound, and when does failure trigger outbound?
- What would make the personal data pipeline transferable to an enterprise workflow rather than merely reusable code?
- Would the work still be worth doing if no enterprise paid for it?
- Which next experiment produces more decision-changing evidence for Dylan: the semantic-routing shadow test or the GPU configuration demand gate?

## Next Tests

- Complete the repeatable Screenpipe + patched NAPsack hybrid labeler and run the clean 30-action acceptance test documented in [[computer-use-nap-build-log|Computer-use NAP build log]]. Require all 30 physical actions, at least 27 exact semantic targets, at least 9/10 native targets, at least 14/15 combined webpage targets, at least 4/5 cross-monitor targets, and zero silent misses before a one-to-two-hour natural capture.
- State the demo's claim and nonclaims before publishing it.
- Compare the static implementation against simple context, retrieval, and memory baselines on held-out personal events.
- Send Niyant the navigation-only experiment contract and confirm that its exact semantic-destination target matches what he meant by computer-use NAP.
- Research out-of-the-box recorders that combine exact browser DOM actions, native Accessibility controls, application and window state, and dual-monitor pre-action screens.
- Audit 50–100 meaningful Screenpipe actions, report browser and native-app semantic-label coverage separately, and retain ambiguous or unresolved events in the denominator.
- Begin model comparison only if the acquisition stack produces roughly 90% or better exact semantic labels without future leakage.
- After acquisition passes, freeze the ontology, prompt, history window, baselines, and scoring rules before collecting chronological held-out handoffs.
- Then compare MRU-3, source-transition, screen-only, correct-history, mismatched-history, and correct-history-plus-declared-goal conditions with top-three prediction and abstention.
- Kill or redirect the router if destinations have low entropy, trivial baselines nearly match the model, correct history adds no lift, labels are unstable, or hits mostly replace one click.
- Treat Tabracadabra as prior art and a possible later writer baseline, not as a required experiment.
- Keep proof of builder quality, proof of technical efficacy, and proof of market demand as separate outputs.
- Record which inbound artifact produces each conversation and what the respondent actually wants.
- Before calling the pipeline an enterprise MVP, test whether it reconstructs context for one real team workflow with tolerable capture and privacy costs.
- Before interpreting online accuracy or acceptance, randomize suggestion exposure, preserve hidden predictions, introduce a declared goal change, and measure adaptation speed, outcomes, overrides, novel actions, and washout behavior.
- Decide whether to run this shadow experiment or [[gpu-configuration-demand-gate|the GPU configuration demand gate]] as the next LBH; do not treat either branch as selected yet.
