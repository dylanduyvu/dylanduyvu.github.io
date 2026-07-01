---
type: source
status: captured
created: 2026-06-30
updated: 2026-06-30
source_date: 2026-06-30
source_type: article
projects: []
domains: [ai-infrastructure, compute-commoditization, model-training, gpu-finance, financial-ml]
people: []
orgs: []
attachments: []
tags: [fine-tuning, tinker, open-weights, differentiated-intelligence, expert-judgment]
---

# Bridgewater x Thinking Machines: replicating expert judgment via fine-tuning

## Context

Article by Bridgewater's AIA Labs (Su, Zhu, Xiao, Alur, Kang) in collaboration with Thinking Machines Lab, published 2026-06-30. Logged because it surprised Dylan: a top-tier financial institution abstracts away GPU infrastructure and beats frontier LLMs on finance tasks with a small fine-tuned open-weight model. Relevant to the compute-commoditization and up-stack value-migration threads in [[gpu-finance|GPU Finance]].

URL: https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/

## What They Did

- Goal: automate investor "information triage" — filtering and labeling financial documents (article relevance, whether a central-bank document signals rate direction, where boilerplate begins, etc.). Six tasks drawn from daily investor workflow.
- Frontier LLMs (Gemini, Claude, GPT variants) scored roughly 50% accuracy naive, and only mid-70s to just under 80% even with expert-written prompts plus automatic prompt-optimization — below the ~80% bar investors would trust in a real workflow.
- They fine-tuned Qwen3-235B (open-weight base) on expert-labeled data using Tinker (TML's managed fine-tuning service), with a recipe of interleaved per-task batching, CISPO loss with asymmetric clipping, and on-policy distillation using a self-promoting teacher checkpoint.
- Result: 84.7% average accuracy vs 78.2% for the best frontier model tested (about 30% fewer errors), at roughly 13.8x lower inference cost because the tuned model is much smaller.
- Data-quality trick: they trained on cheap non-expert labels first, then routed only the contested examples — where the model disagreed with the labelers — to expensive expert reviewers, cleaning the set without paying experts for everything.
- They name the thesis "differentiated intelligence": models tuned to a specific organization's needs beating general frontier models on that organization's tasks.

## Why It's Notable (the surprise)

- A firm with the capital and skill to own compute chose deliberately NOT to touch GPU infrastructure — it rented an abstraction (Tinker) and started from open weights.
- Frontier models appear to be plateauing per dollar on these tasks (a newer GPT reportedly cost ~43% more than a prior version for only marginal accuracy gain). Bigger/newer is not buying much here.
- The differentiating input is the proprietary expert-labeled dataset, not compute scale or model size.

## Promoted Insights

- [[expert-labeled-fine-tuning-can-beat-frontier-models-per-task-and-per-dollar|Expert-labeled fine-tuning can beat frontier models per task and per dollar]]

## Open Questions

- Is Bridgewater representative, or does "abstract away the GPU layer" only hold for firms whose edge is data/judgment rather than model R&D?
- Thinking Machines co-authored and is marketing Tinker — how much of the "no GPU infrastructure to worry about" framing is vendor incentive versus a durable pattern?
- If small tuned models win per task, how does that reshape aggregate GPU demand (more cheap distributed inference, less frontier training), and does that feed or starve the neocloud lending market?
- Does "learn hard-to-articulate expert judgment from clean labels" transfer to compute-finance judgment products such as residual valuation or SLA/operator-performance assessment?

## Links

- Areas: [[gpu-finance|GPU Finance]]
