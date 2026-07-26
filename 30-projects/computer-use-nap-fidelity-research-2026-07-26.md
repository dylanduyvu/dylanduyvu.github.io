---
type: research
status: reference
created: 2026-07-26
updated: 2026-07-26
aliases:
  - NAP dataset fidelity research
  - Observation fidelity and label quality synthesis
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - data-acquisition
  - dataset-fidelity
  - deep-research
---

# Computer-use NAP: dataset fidelity research, July 26, 2026

**Date:** 2026-07-26

**Provenance:** Claude deep-research run over primary sources (papers, dataset cards, benchmark repos), commissioned to verify the 2026-07-26 scoping decision: the complete synchronized dataset (dual-monitor sync, joint AX+DOM identity, cryptographic provenance, zero-loss guarantees) is load-bearing only for the eventual always-on automated product; a simple dataset (latest active-monitor pre-action screenshot, active app/window/URL, click/key/app-switch events, approximate target identity, manually verified next-action labels) suffices for the first qualitative NAP experiment.

**Verdict:** The minimal experiment can proceed without the complete product-grade dataset. Two properties do not relax: strict pre-action frame ordering (no future-information leakage) and verified next-action labels. Exact element identity, joint AX+DOM identity, cryptographic provenance, and perfectly clean trajectories can be deferred. No reviewed study directly tests synchronized multi-monitor versus active-monitor-only evidence, so perfect synchronization is unproven for the pilot. Correct attribution to the screen the user actually saw is still required.

**Standing caveat:** this research validates dataset *scope* for the first experiment. It does not change the gate ladder — the diagnostic walkthrough and capture-contract findings remain prerequisites, because even the simple dataset depends on the label pipeline they validate.

**Primary-source audit update, 2026-07-26:** The article-facing claims and their boundaries were independently checked against the original papers in [[day-0-computer-use-tool-gap-web-audit-2026-07-26|the web evidence audit]]. The corrections below distinguish training episodes from generic examples, instructed UI-control steps from spontaneous next destinations, and single-screen benchmarks from the dual-monitor collection used by `A Click Ahead`.

## Related notes

- Build log: [[computer-use-nap-build-log|Computer-use NAP build log]]
- Capture v2 plan: [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Capture layer v2 plan and spike sequence, July 24, 2026]]
- Deep tooling survey: [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey, July 24, 2026]]
- Walkthrough: [[computer-use-nap-30-action-walkthrough-2026-07-24|Computer-use NAP: what the 30-action walkthrough is]]

---

# Observation Fidelity and Label Quality in GUI Next-Action Prediction: A Cross-Paper Synthesis

## TL;DR
- **The evidence supports trying the lower-fidelity pilot, not declaring its input sufficient in advance.** Coarse next-app and next-command systems work from event histories with much less context than the proposed dataset. Those results establish precedent, but their closed, coarser targets do not validate Dylan's finer exact-destination task.
- **Two fidelity properties cannot be relaxed even in a minimal first experiment: (1) correct pre-action frame ordering (pairing each action with the last distinct frame *before* it, to avoid future-information leakage), and (2) verified next-action labels.** Published pipelines invest deliberate engineering in both. Approximate element semantics are usable in a pilot. The effect of single-monitor versus synchronized multi-monitor evidence has not been directly tested.
- **Fidelity matters most for grounding/execution (clicking the exact right pixel) and least for coarse intent prediction (which app/panel/action).** Since your first experiment tests whether predictions "feel useful" at the intent level rather than executing them, it sits squarely in the regime where lower fidelity is tolerable — but data *diversity* and label *correctness* matter more than any single richness feature.

## Key Findings

1. **Screenshot + accessibility tree beats screenshot-only across every benchmark that ablates it, but the gap is modest (single-digit to ~20 pp) and model-dependent.** On OSWorld, adding the a11y tree to screenshots roughly doubled or better the success rate for weaker vision models.
2. **Grounding accuracy is the dominant lever for *execution*, and it scales with data quantity and diversity, not with per-record perfection.** SeeClick showed downstream agent success rises monotonically with grounding accuracy; UGround/OS-Atlas/JEDI show grounding improves smoothly with more synthetic data.
3. **Label noise is surprisingly tolerable, and imperfect trajectories can *help*.** OpenCUA explicitly found that error-containing human demonstrations improve models by teaching error recovery; AITW ships noisy OCR/icon-derived semantic labels by design.
4. **Pre-action frame alignment is treated as non-negotiable by the best pipeline.** OpenCUA's "state-action matching" aligns each action to the last distinct screenshot *before* it, specifically "to avoid leaking future info."
5. **In-domain Android UI-control fine-tuning scales more favorably than out-of-domain transfer.** This motivates a personal experiment, but it is not a next-action result and does not predict Dylan's sample needs or accuracy.
6. **Multi-monitor capture is essentially unrepresented in the three agent benchmarks checked** — OSWorld, WindowsAgentArena, and AndroidWorld are single-screen environments — which means those benchmarks provide no evidence about dual-monitor fidelity. This is not a claim that multi-monitor next-action collection is unprecedented: `A Click Ahead` recorded one user on a dual-monitor Windows setup.

## Details

### Sub-question 1: Observation fidelity ablations

The cleanest, most-replicated finding in the field is that **screenshot + accessibility tree > accessibility-tree-only > screenshot-only**, but with important nuances.

**OSWorld** (the desktop standard, 369 tasks, Ubuntu/Windows; human success 72.36%). Independent ablations (OS-Harm, using Xie et al.'s OSWorld harness) on the OSWorld small test set report:
- A11y Tree + Screenshot: 25.6% (Gemini 2.5 Pro), 18.4% (Gemini 2.5 Flash), 18.4% (o4-mini)
- A11y Tree only: 21.1% / 18.4% / 18.0%
- Screenshot only: 5.3% / 5.3% / 15.4%
- Set-of-marks: 15.8% / 13.5% / 18.9%

The striking result: for Gemini 2.5 Pro, screenshot-only collapsed to 5.3% while a11y+screenshot reached 25.6% — a roughly 5× gap. But for o4-mini the screenshot-only penalty was small (15.4% vs 18.4%). So the value of structured metadata is large for some models and marginal for others. The original OSWorld paper itself cautions that a11y tree and set-of-marks "can be helpful, [but] can also lead to potential misguidance and varies across models."

A separate ProjGuard ablation on current frontier models found a11y+screenshot at ~69–72% vs screenshot-only ~59–62% and set-of-marks ~56% — a ~10 pp structured-data advantage that persists even at high absolute performance.

**WebArena / enterprise web.** The EntWorld enterprise-GUI benchmark (arXiv 2601.17722) found the same ordering (a11y+screenshot best; EntAgent-RL reached 53.7% average success rate on screenshot+a11y) but with a critical caveat directly relevant to macOS desktop apps: "relying solely on A11y tree is particularly inadequate for legacy enterprise applications, where accessibility metadata is often incomplete or inconsistently implemented." This is a direct warning that AX-tree quality on real macOS third-party apps is uneven, and it is why screenshot input should never be dropped entirely.

**Counter-evidence — sometimes structured text alone wins.** On WebChoreArena, adding screenshots to accessibility-tree input *decreased* performance for several models (e.g., Gemini text-only 48.2% vs image+tree 43.5% on "Any"-observation tasks). The TRAP benchmark found no statistically significant difference between AXTree-only and AXTree+screenshot on GoCalendar (8.7% vs 10.5% ASR, p>0.5). Takeaway: extra modalities add tokens and can distract; more is not automatically better.

**Set-of-marks and OCR augmentation.** WindowsAgentArena's NAVI baseline and WebVoyager both rely on set-of-marks (numbered boxes over interactive elements). OSWorld's ablation shows set-of-marks is competitive but rarely the single best modality. OmniParser-style screen parsing is a common way to synthesize marks from pixels when no DOM/AX is available.

### Sub-question 2: Label quality and noise

**Noisy labels are the norm, not the exception, and are often deliberately shipped.** AITW (Android in the Wild) post-processes RGB screenshots into UI elements with "either OCR-detected text or an icon class label (one of 96 icon types detected using IconNet)," and explicitly warns: "this screen representation inferred from pixels is noisy and not as comprehensive as that obtained from UI metadata … certain characters can be misidentified and text blocks are not always grouped as desired." AITW became one of the most-used mobile-agent datasets *despite* this.

**Imperfect trajectories can improve models — the OpenCUA/AgentNet finding.** OpenCUA (NeurIPS 2025 Spotlight; AgentNet dataset of 22,625 trajectories, 140+ apps, 190+ websites, avg 18.6 actions/task) states: "Unlike previous approaches that require annotators to demonstrate 'gold' trajectories with all-correct steps, OpenCUA recognizes that annotation errors can actually improve model capabilities by teaching agents to detect and recover from mistakes." Their reflective long-CoT pipeline includes a "reflector" that inspects human steps for errors and synthesizes correction reasoning. Quantitatively, reflective CoT lifted a Qwen2-VL-7B model from 11.5% to 15.3% on OSWorld; naive SFT on raw state-action pairs (no CoT) scored only 4.4%. Sub-trajectories that were "redundant or incorrect but later corrected within the same trajectory" are mined into an explicit recovery memory in follow-on work.

**Human-verification pipelines are standard for the *action* label even when semantics are auto-generated.** Android-in-the-Zoo recruits three UI experts to verify that generated action descriptions match the "golden actions," revising inconsistencies. AMEX manually reviews trajectory annotations and drops erroneous annotator steps. This is the pattern your plan already follows: *manually verify the next-action label* even if element semantics are approximate.

**Annotation error rates in datasets generally.** Klie et al., "Analyzing Dataset Annotation Quality Management in the Wild" (Computational Linguistics 50(3), 2024, MIT Press) — a corpus of 591 scientific publications introducing text datasets — found only 18% of papers with human annotation even reported an error rate; among those the mean error rate was 8.27% (median 6.00%), and the authors "deem the effort of 30% of the works as only subpar." Error rates are routinely underestimated: Stoica, Platanios & Poczos ("Re-TACRED," AAAI 2021) found that after verification "23.9% of TACRED labels are incorrect" (versus the ~6.7% originally estimated), yielding "an average f1-score improvement of 14.3%" once corrected. GUI grounding benchmarks that do measure quality report high spatial accuracy but lower instruction validity: WinDeskGround reports 99% bounding-box/spatial accuracy but only 85% instruction validity under strict uniqueness criteria, with quality dropping sharply on hard multi-window scenes (L5: 79.6% bbox accuracy). Implication: the *target-identity* label is the noisy part; the *action-and-location* label is easier to get right.

### Sub-question 3: Timing / state-alignment correctness

This is where the evidence most strongly *supports keeping fidelity high even in a minimal experiment.*

**OpenCUA's state-action matching** is the canonical positive example: raw demonstrations are processed so that each action is aligned "with the last distinct screenshot before the action to avoid leaking future info." This is a deliberate design choice, not an afterthought — pairing an action with a post-action frame would let the model "see" the consequence of the action it is supposed to predict, inflating offline metrics and producing a model that fails online.

**Temporal misalignment is a known, quantified failure mode in adjacent fields.** The precise-action-spotting literature shows that ground-truth temporal misalignment (label tagged to frame *t* when the event is really at *t–1*) degrades models and must be corrected with dynamic label assignment. In video/robot pretraining, latent-action models (LAPA) and effect-alignment methods (SeqΔ-REPA/Olaf-World) exist precisely because raw action labels are hard to align to frames; VLA work reports that "temporal or granularity misalignment between text and actions weakens instruction following." The consistent lesson: getting the observation→action temporal pairing right is a first-order correctness issue, cheap to enforce at capture time and expensive to repair later.

### Sub-question 4: Minimal-data / small-scale personalization precedents

There is a deep literature showing **useful next-action/next-app prediction from modest, imperfect personal logs — with no screenshots, DOM, or AX at all.**

- **Next-app prediction from event logs alone.** WhatsNextApp (LSTM over app-usage sequences, 975 users, 22M events) treats app sequences like word sequences; a related dual-display LSTM reports top-5 accuracy of 86.43%; DeepApp (RL) reports precision 70.6% / recall 62.4%. AppUsageOTM-style models report Accuracy@1 of 46.4%, @5 66.4%, @10 75.9% on 1,000+ apps. First-order Markov models perform respectably with small data and are a natural baseline.
- **IDE/command prediction.** A neural model predicting developers' next IDE command achieved 64% accuracy across 61 possible commands (micro-averaged ROC AUC 0.82). PowerShell Predictive IntelliSense and shell-history predictors work off command history alone. Next-terminal prediction in code reached 46% when confident.
- **Screenomics.** The Stanford/Penn State Human Screenome Project captures a screenshot every 5 seconds and extracts text/image content for analysis. Brinberg et al., "The Idiosyncrasies of Everyday Digital Lives: Using the Human Screenome Project" (Computers in Human Behavior, 2021) used "screenshots (N > 6 million) collected every five seconds … from 132 smartphone users over several weeks" (600+ participants across the program). This establishes that *low-frequency sampled screenshots plus extracted text* is a scientifically productive observation stream for modeling digital behavior, without any AX/DOM identity or sub-second timing.
- **Personalization in the CUA literature.** "Towards Computer-Using Personal Agents" (Dagstuhl, arXiv 2503.15515) proposes a user-controlled Personal Knowledge Graph as the personalization substrate, seeded from data the user enters into web forms — i.e., personalization is framed as accumulating modest structured personal context over time, not as high-fidelity screen capture.

**What each actually required:** none of these required synchronized dual-monitor capture, cryptographic provenance, or joint AX+DOM identity. Event logs plus sequence models deliver useful results on coarser next-app and next-command targets. That supports a low-cost first experiment, but it does not validate the simple dataset as sufficient for Dylan's finer task.

### Sub-question 5: Scaling vs. fidelity trade-off

**In adjacent UI-control and grounding tasks, more varied data can compensate for some lower-fidelity representations. Transfer to Dylan's task is unproven.**

- **A motivating but indirect result for a personal system (Li et al., "On the Effects of Data Scale on UI Control Agents," NeurIPS 2024, arXiv 2406.03679, Google DeepMind).** Fine-tuning PaLM-2S on the AndroidControl dataset (15,283 demos, 833 apps; a11y-tree text input, *no screenshots*): the best fine-tuned model reaches "71.5% accuracy on high-level instructions and 86.6% on low-level instructions in-domain." Low-level relaxed step accuracy already beats all non-fine-tuned models with just **5 training episodes**; high-level needs ~1,000 episodes. Both in-domain curves are log-linear (R²>0.95), extrapolating to ~500K/1M episodes for 95% step accuracy on low/high-level. **Out-of-domain** grows far slower — the paper extrapolates that "10M and 150M episodes would be required" (low-level and high-level respectively) for the same target — and the in-domain-vs-unseen gap widens with model capacity (up to ~12 pp on high-level tasks). These are instructed UI-control steps on Android, not spontaneous next destinations. The result motivates an in-domain personal experiment but does not establish its likely data requirement or accuracy.
- **Grounding scales smoothly with synthetic/auto-labeled data.** UGround's Web-Hybrid (9M elements / 773K screenshots) improves monotonically, with diminishing returns after ~100K screenshots; with just 50K screenshots it beat SeeClick trained on ~3M elements — quality of synthesis beat raw quantity. OS-Atlas (13M+ elements, 2.3M screenshots) and JEDI show no saturation across 10/20/50/100% data fractions, and "scaling up mixed data types … produced more stable improvements than scaling a single data type." GROUNDCUA scaling (100k→700k) lifted UI-Vision from 29.8 to 58.2.
- **Coordinate/label representation matters at the margin.** ScaleCUA found raw coordinates beat normalized (42.3% vs 37.9% on ScreenSpot-Pro) — a label-format choice, not a fidelity choice, worth ~4 pp.
- **Robotics analogue.** Imitation-learning data-scaling-laws work found generalization is a power law in *environment/object diversity*, and "diversity … is far more important than the absolute number of demonstrations" once a per-setting threshold is met. This reinforces: for your first experiment, breadth of situations captured beats obsessive per-record fidelity.

### Sub-question 6: Where fidelity is genuinely load-bearing

- **Grounding/execution, not intent.** Every grounding paper (SeeClick, UGround, OS-Atlas, OSWorld-G) shows that clicking the exact correct element is the bottleneck for *executing* actions, and it is sensitive to pixel-accurate targets and high-resolution capture. SeeClick's core empirical result is that "improvement in GUI grounding directly correlates with enhanced performance in downstream GUI agent tasks," with monotonic gains as grounding accuracy rises. This is exactly the "always-on automated product" regime you scoped as needing the complete dataset.
- **Missing/incomplete accessibility metadata.** EntWorld's finding that a11y-only fails on legacy enterprise apps, and AndroidControl's observation that only high-popularity apps "tend to include well-annotated accessibility trees," mean AX identity is unreliable for many real macOS apps — an argument *against* treating joint AX+DOM identity as load-bearing for a first experiment, and *for* keeping a pixel/screenshot fallback.
- **Multi-monitor capture is unrepresented in the three benchmarks checked.** OSWorld defines its observation as one screenshot at a default 1920×1080 plus optional a11y tree; WindowsAgentArena uses current and previous screenshots at 1440×900 from one Windows VM; AndroidWorld uses one full-resolution emulator screenshot and UI tree. These benchmarks provide no evidence that dual-monitor synchronization affects prediction quality. This supports treating perfect synchronization as unproven for the pilot, not declaring it irrelevant.
- **Always-on capture reliability is a real, separate engineering problem.** Microsoft Recall (snapshot "every few seconds when the content of your active window changes") has documented reliability gaps — repeated tests show it still captures sensitive data it was supposed to filter, and inconsistently recognizes content. This is precisely the "capture-pipeline reliability" burden you correctly assigned to the always-on product, not the one-off research collection.

### Mapping table: dataset/benchmark → observation modality → label source/quality → reported performance

| Dataset / Benchmark | Observation modality | Label source / quality | Reported performance (selected) |
|---|---|---|---|
| OSWorld (desktop) | Screenshot, a11y tree, SoM, or combos | Execution-based verifiers (state check) | a11y+screenshot best: 25.6% (Gemini 2.5 Pro); screenshot-only 5.3%; human 72.36% |
| WebArena | a11y tree / HTML (+ optional screenshot) | Programmatic functional correctness | Text/AXTree agents competitive; multimodal not always better |
| Mind2Web | HTML/DOM snapshot (+ screenshot in MM-Mind2Web) | Human-annotated (element, operation) pairs | GPT-4 MindAct 11.2% step SR; ~53% element accuracy |
| AITW (Android in the Wild) | Screenshots + OCR/IconNet-derived elements | Noisy pixel-derived semantics; human task oversight | Partial action-match metric; SeeClick 59.3% overall |
| AndroidControl | a11y-tree text (no screenshot) | 15,283 human demos, high+low-level instructions | In-domain 71.5% HL / 86.6% LL; OOD needs 1–2 orders more data |
| OpenCUA / AgentNet | Screen video + mouse/keyboard + a11y tree | Real human demos, errors *kept* deliberately; reflective CoT | OpenCUA-72B 45.0% OSWorld-Verified; raw SFT 4.4% |
| SeeClick / ScreenSpot | Screenshot only | Auto-curated grounding pairs | Grounding accuracy monotonically predicts downstream SR |
| UGround / Web-Hybrid | Screenshot only | 9M synthetic elements | Saturates ~100K screenshots; beats SeeClick at 50K |
| OS-Atlas | Screenshot only | 13M+ synthesized elements, 5 platforms | No saturation across data fractions |
| Next-app (WhatsNextApp etc.) | App-usage event logs only | Implicit (actual next app) | Top-5 up to 86.4%; Acc@1 46.4% |
| Screenomics | Screenshot every 5s + extracted text | Research coding / ML / human labeling | Productive for behavioral modeling; no AX/DOM |

## Recommendations

**Stage 1 — Build the simple dataset as scoped, with two non-negotiable fidelity guarantees.** Proceed with latest active-monitor screenshot + active app/window/URL + click/key/app-switch events + approximate target identity + manually verified next-action labels. But enforce, from day one:
1. **Pre-action frame ordering.** Pair every action with the last distinct frame captured *before* the event timestamp. This is the OpenCUA state-action-matching discipline ("aligns actions with the last distinct screenshot before the action to avoid leaking future info"); violating it silently inflates offline accuracy and produces a model that cannot predict, only postdict. This costs almost nothing at capture time.
2. **Verified next-action labels.** Keep your manual verification of the action label (the thing being predicted). Element *identity* can be approximate; the *action + coarse target* should be correct. This mirrors AITW/AitZ/AMEX practice.

**Stage 1 evaluation signal that would change the plan:** If your qualitative test shows that predictions fail primarily because the model can't tell *which element* the user will hit (not which app/panel), that is your signal that grounding fidelity — set-of-marks, OCR, or AX/DOM identity — has become load-bearing, and you should add it *before* scaling data. If instead failures are about *intent* (wrong app/panel/next-step), invest in more/broader data, not richer per-record capture.

**Stage 2 — Add fidelity features in evidence-ranked order, only as needed:**
1. **OCR/set-of-marks on the single screenshot** (cheap, model-agnostic, biggest grounding lift per the SeeClick/UGround evidence) — before any AX/DOM work.
2. **AX identity where available, with a pixel fallback** (because macOS AX quality is uneven per EntWorld/AndroidControl).
3. **Browser DOM identity** only for browser-heavy prediction targets.
4. **Perfect multi-monitor sync, exact sub-second timing, cryptographic provenance, no-missing/duplicate guarantees** — defer unless pilot errors show they matter. A dependable product will need explicit cross-stream joins and missing-data handling, but the required synchronization precision is not established.

**Data strategy:** Favor *breadth of situations* over per-record perfection. AndroidControl makes a personal in-domain experiment more plausible, but it does not justify predicting that hundreds or low thousands of examples will be enough for Dylan's spontaneous next-destination task.

## The fidelity properties that CANNOT be relaxed vs. those that CAN (in a minimal first experiment)

**Cannot relax (cheap, and published evidence shows they are load-bearing for validity):**
- **Pre-action frame ordering / no future-information leakage** — OpenCUA state-action matching; temporal-misalignment literature.
- **Correctness of the next-action label being predicted** (action type + coarse target) — AITW/AitZ/AMEX human-verification practice; general annotation-error findings (mislabels are systematically underestimated and directly cost accuracy).
- **Correct event → observation attribution** (the screenshot must be the one the user actually saw before acting, on the monitor they were looking at) — a corollary of frame ordering.

**Can defer in the minimal experiment, based on direct precedent or because necessity is unproven:**
- **Exact element identity** — approximate/OCR/icon-derived semantics are used successfully throughout AITW and auto-labeled corpora.
- **Joint AX + DOM identity for every element** — AX quality is unreliable on many apps anyway; add later, selectively.
- **Perfect dual-monitor synchronization** — unrepresented in the three benchmarks checked, so its effect on prediction quality is unknown. Correct observation attribution still cannot be relaxed.
- **Cryptographic provenance, sub-second timing precision, guaranteed no-missing/duplicate/misordered records** — reliability-engineering requirements for an always-on product, not for a qualitative research collection.
- **Perfectly clean trajectories** — OpenCUA shows messy, error-containing real trajectories can *improve* models (for multi-step execution).

## Caveats

- **Absolute numbers are not cross-comparable.** OSWorld ablation numbers come from different harnesses, model versions, and dates (e.g., Gemini 2.5, o4-mini, and GPT-5.2/Claude Opus 4.5 in one 2026 paper); treat the *direction and rough magnitude* of deltas as the signal, not the exact percentages. Some cited figures are from third-party ablations (OS-Harm, ProjGuard) rather than the original benchmark authors.
- **Direct fidelity ablations for your exact question are scarce.** No paper found in this audit ablates "correct vs. wrong-monitor screenshot" or "synchronized dual-monitor vs. active-monitor-only" for next-action prediction. The recommendation to defer perfect dual-monitor synchronization is therefore an inference from absence of evidence in the three benchmarks checked, not a direct measurement.
- **The strongest personalization precedents (next-app, IDE-command prediction) predict coarser targets than your "Arc > Gmail > Search mail" granularity.** Their high accuracies (46–86%) may not transfer directly to finer-grained within-app action prediction; treat them as existence proofs that low-fidelity data is *useful*, not as accuracy forecasts for your system.
- **OpenCUA's "errors help" finding is about *error-recovery learning* in multi-step execution**, not about tolerating *mislabeled* next-action targets. It supports keeping messy real trajectories; it does *not* license skipping verification of the label you are trying to predict.
- **AndroidControl used a11y-tree text, not screenshots**, so its scaling numbers are not a pure screenshot-only result; the authors expect trends to hold for multimodal models but did not prove it.
- **`A Click Ahead` used a GRU recurrent neural network, not an LLM or multimodal LLM.** Its 34.63% result shows that one person's history can support prediction when the model chooses among 442 known actions. It does not estimate the accuracy of Dylan's LLM-based system on finer, open-ended destinations.
