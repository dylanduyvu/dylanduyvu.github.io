---
type: project-spec
status: review-ready
created: 2026-07-29
updated: 2026-07-29
project: computer-use-nap
independent_review: approved
---

# Computer-use NAP V5 expanded-history experiment design, July 29, 2026

## Decision

Run a 15-target, 30-call paired retrospective experiment comparing the same
frontier predictor with and without Dylan's earlier personal workflow history.
The history condition uses compact long-term chronology plus a high-fidelity
recent working set:

- every earlier accepted history-eligible action as structured text;
- the ten most recent earlier rows with recoverable strictly-prior screenshots
  as screenshot/action pairs; and
- the same current strictly-prior screenshot used by the state-only condition.

This is the official successor to the frozen recent-10 V4 design. V4 remains
immutable and receives no model calls.

## Product question

The intended product is a personalized top-three router: one of three
predictions should take Dylan to an exact, useful next destination within or
across applications.

The experiment asks:

> Does hybrid personal workflow history improve a frontier model's ranked
> prediction of Dylan's immediate next monitor-3 action over the identical
> current screenshot alone?

This is an exploratory product experiment, not a statistical proof of durable
personalization.

## Frozen source corpus

The source of truth is
[[computer-use-nap-v4-canonical-dataset|Computer-use NAP V4 canonical
dataset]] at:

- dataset commit:
  `fa3a5c80f3689619da3bf7a3e902041b3b223aea`;
- canonical-file SHA-256:
  `5df40abf89f0083a0b73965045d75a6ddaa1509f0c04f4bfc2cce027ddae1a48`;
- 220 retained physical-event candidates;
- 196 accepted events; and
- 139 accepted nontrivial candidates after removing accepted Codex prompt
  submissions and Command-W.

Pending, unresolved, retired, and rejected rows cannot enter predictor history
or the target pool. Accepted Codex Enter submissions may enter history but
cannot become targets. No further labels may be added to this experiment
snapshot.

## Experimental unit and call count

The experimental unit is one accepted immediate-action target with two
independent prediction calls:

1. `state_only`; and
2. `state_plus_hybrid_history`.

There are exactly 15 targets and 30 scheduled slots. A slot may have more than
one transport attempt under the frozen infrastructure-retry policy. Every
schema-valid prediction contains exactly three ranked predictions. Rank 1
supplies top-1 scoring; ranks 1 through 3 supply top-3 scoring. There is no
adaptive stopping.

## Target eligibility and deterministic selection

Construct and freeze an evaluator-only `eligibility-ledger.json` before target
selection. It contains every retained canonical row, its authoritative
`chronology_index`, target/history dispositions, evidence disposition, and one
or more frozen reason codes. Canonical ledger order is authoritative; equal
player times, including `a`/`b` rows, follow that order.

A row enters predictor history only when canonical status is `accepted` and
`History` is `yes`.

A row enters the target candidate pool only when all of the following are
true:

- canonical status is `accepted`;
- `History` is `yes`;
- it is not an accepted Codex prompt-submission command or Command-W;
- `Demo` and `Shortcut` are not explicitly `no`; `pending` and `unrated` are
  deliberately eligible and are not silently converted to `yes`;
- its canonical destination parses without inference into one of the frozen
  target shapes—application, object, or subtarget—with nonempty named
  components and no placeholder such as `unknown`, `some message`, or an
  unresolved alternative;
- a readable monitor-3 screenshot strictly before the target action is
  recoverable; and
- at least ten earlier accepted history-eligible rows have recoverable
  strictly-prior screenshots.

Shortcut usefulness does not filter the natural target distribution beyond
rows already explicitly marked `no`. Dylan adjudicates predicted-shortcut
usefulness after inference under the blind contract below.

### Strictly-prior evidence disposition

The evidence authority is the chronological monitor-3 Screenpipe MP4 sequence
under `/Users/dylanvu/.screenpipe/data/data/2026-07-27/`. Convert each
recording filename's epoch-millisecond start plus the ledger player time into
one global timeline. Player times identify a whole second, so the screenshot
anchor is one full second before the labeled second:

```text
anchor_time = recording_start + player_time - 1.000 seconds
```

Select the latest decoded monitor-3 frame at or before the anchor, searching
the current recording and then the immediately preceding continuous recording.
The frame must be no more than five seconds older than the anchor. When frames
share the same global timestamp, choose the lower decode index; if still tied,
choose the lexicographically smaller absolute source path.

Every sequential event sharing the same recording and labeled player second
requires its own distinct state interval, whether or not the ledger uses
`a`/`b` suffixes. The first row in that second may use the ordinary anchor
rule. Each later row is target-eligible only if a retained frame is strictly
after the immediately preceding action in that same second and strictly before
the current action. Otherwise that later row may remain text history but cannot
be a target or visual-history example.

Every candidate frame is re-encoded as metadata-free PNG and must pass all
automated checks:

- decodes successfully;
- monitor is 3;
- timestamp ordering and five-second age bound pass;
- width and height equal the source monitor-3 video dimensions; and
- SHA-256 matches the evidence inventory.

A pre-selection human evidence pass assigns exactly one disposition:

- `usable`;
- `missing`;
- `stale_over_5s`;
- `post_action_risk`;
- `timing_unresolvable`;
- `wrong_monitor`;
- `corrupt_or_unreadable`; or
- `same_time_interval_unrecoverable`.

`usable` means the frame is legible enough to identify the active application
and the visible object or control needed to understand the before-state; it
does not require the future target to be visible. Only `usable` frames qualify.
The disposition ledger and hashes freeze before `N` is calculated; no evidence
decision can change after target IDs are selected.

Filter first, then select. Let `N` be the final ordered pool and use zero-based
pool positions:

```text
floor((i + 0.5) * N / 15), for i = 0 through 14
```

This selects the midpoint of each of 15 equal chronological bands. No target
may be hand-picked, replaced based on apparent predictability, or replaced
after outcomes are known. If `N < 15`, the run does not start.

## Predictor-visible conditions

### State only

The predictor receives:

- the frozen predictor instruction;
- the frozen response schema; and
- one full-resolution monitor-3 screenshot captured strictly before the
  current target action.

It receives no earlier activity.

### State plus hybrid history

The predictor receives:

- the identical instruction, schema, and current screenshot;
- every earlier accepted `History=yes` row as an oldest-to-newest structured
  text record; and
- screenshots for the ten most recent earlier history rows whose strictly-prior
  monitor-3 screenshots are recoverable.

Each structured history record contains only:

- chronological history ordinal;
- semantic action type: `focus` or `activate`;
- input method;
- target granularity;
- application;
- object or `null`; and
- subtarget or `null`.

Every accepted `History=yes` row must serialize deterministically into this
grammar. A missing or ambiguous action type, input method, granularity,
application, object, or subtarget that the canonical row requires is a fatal
preflight error. The compiler must abort rather than infer a value, repair the
source row, or silently omit the history record.

The ten visual-history screenshots point to their corresponding structured
history ordinals. Their action text is not duplicated. Earlier rows without
recoverable screenshots remain in text history.

Structured history is serialized in authoritative `chronology_index` order.
Equal-time events never sort by timestamp or event-ID text. Visual-history
rows are the ten highest earlier chronology indexes with `usable` evidence and
are attached oldest to newest as images 1 through 10. The current screenshot
is always image 11.

Predictor-facing images use neutral filenames `image-001.png` through
`image-011.png`, contain no metadata, and live in a clean per-slot staging
directory. Prompt text maps images 1 through 10 only to visible history
ordinals and identifies image 11 only as the current before-state. It contains
no source path, recording time, event ID, target ID, role, evidence
disposition, or evaluator filename.

An earlier selected target's ground-truth action may enter later history only
after that action occurred. Predictions, reasons, scores, adjudications,
shortcut ratings, target IDs, source filenames, post-action frames, and future
rows never enter either condition.

Each history call therefore contains exactly 11 images: ten earlier
strictly-prior screenshots plus the current strictly-prior screenshot.

## Predictor configuration

Every slot uses the same configuration:

- model: `gpt-5.6-sol`;
- reasoning effort: `max`;
- service tier: `priority`;
- standard single-agent execution;
- no pro or Ultra orchestration;
- no tools;
- no persisted reasoning or conversation state between calls;
- a fresh isolated runtime/session for every slot; and
- exactly three schema-constrained ranked predictions.

`gpt-5.6-sol` is the frontier GPT-5.6 model, and `max` is the highest
quality-first single-model reasoning effort documented for the API. Ultra is
not used because it can change orchestration rather than only reasoning depth.

Official model guidance:
<https://developers.openai.com/api/docs/guides/latest-model.md>

## Prediction schema

Each rank contains:

- `rank`: 1, 2, or 3, consecutive and unique;
- `action_type`: `focus` or `activate`;
- `app`;
- `object` or `null`;
- `subtarget` or `null`; and
- one short evidence-bound `reason`.

Response validation also requires:

- exactly three entries with ranks 1, 2, and 3;
- `action_type` exactly `focus` or `activate`;
- a nonempty trimmed `app`;
- `object` and `subtarget` each either `null` or a nonempty trimmed string;
- `subtarget` is `null` whenever `object` is `null`;
- a nonempty trimmed reason of at most 240 Unicode code points; and
- three pairwise-distinct normalized full actions, where full action identity
  is `action_type + app + object + subtarget`.

A violation makes the successfully transported response terminal
schema-invalid and therefore an incorrect model result; the harness never
deduplicates, repairs, or reranks it.

The predictor must name one immediate eligible action per rank, never a
multi-action sequence or eventual destination. Ordinary typing, paste,
scrolling, cursor movement, text selection, and resizing are not eligible
predictions.

## Target catalog and leakage boundary

Before inference, create and freeze an evaluator-only target catalog containing
canonical structured identities, strict granularity, revisions, and
conservative accepted structured variants. Catalog review finishes before any
model output exists. Dylan approves all 15 canonical entries and their accepted
variants before the run lock is written.

Each accepted variant has exactly `app`, `object`, and `subtarget` components
with the same null shape and granularity as the canonical target. Normalize
every label and prediction component symmetrically using:

1. Unicode NFKC;
2. trim leading and trailing whitespace;
3. lowercase; and
4. collapse internal whitespace.

Do not remove punctuation, words, or components. A prediction is an exact
target match only when its three normalized components equal one complete
accepted structured variant. Parent and child targets never match. Aliases may
normalize genuine names such as an application or task's established surface
form, but no post-inference alias may be added. Non-exact same-destination
cases are handled only by the frozen blind semantic process.

The catalog, target IDs, target roles, aliases, ground truth, and evaluation
metadata are forbidden from predictor packets and clean model-call
directories. Packet validation must search for and reject evaluator-only
identifiers and source provenance.

Only later evidence used by the human labeler to recover a hidden destination
may appear in evaluator provenance. It never becomes predictor input.

## Schedule and isolation

Targets remain in chronological order. Each target's two condition slots are
adjacent to reduce overnight service drift. Condition order alternates by
target:

- odd target ordinals: state-only, then history;
- even target ordinals: history, then state-only.

This gives an 8/7 first-condition balance. The complete 30-slot schedule is
generated deterministically and frozen in the run lock before inference.

Slots run sequentially. If a slot receives an infrastructure retry, finish all
attempts for that slot before starting its adjacent paired slot. Every slot has
its own immutable packet and prompt; every attempt has separate events, final
response, classification, token usage, and latency records.

## Failure, retry, and resume policy

- The exhaustive infrastructure-failure codes are:
  `adapter_spawn_failure`, `transport_disconnect`, `rate_limit`,
  `service_unavailable`, `timeout_without_final`, `transport_artifact_corrupt`,
  and `local_io_before_final`.
- A slot with one of those failures may receive at most two additional
  attempts, immediately, for three attempts total.
- Every attempt is immutable and preserved.
- Subject to the frozen event-classification precedence below, the first
  schema-valid final response is authoritative and ends the slot.
- A successfully transported refusal, empty final, schema-invalid output, or
  attempted tool use is a terminal invalid prediction result, receives no
  extra chance, and counts as incorrect.
- After three infrastructure failures, the slot becomes terminal
  `infrastructure_failure`; it is never silently rerun.
- Re-running the command verifies every frozen byte and resumes at the first
  unfinished slot or incomplete allowed retry.
- Completed slots are never overwritten.
- Any method, manifest, catalog, packet, image, schema, instruction, or schedule
  drift stops the run.

A schema and event-type-aware classifier applies this frozen precedence to each
attempt; it never infers tool use or transport state from free-text error
messages:

1. an actual tool request or tool-invocation event overrides any later final
   and makes the slot terminal invalid;
2. absent tool use, a schema-valid final is authoritative even when an earlier
   recoverable disconnect or fallback event appears in the same attempt;
3. absent a valid final, a successfully transported refusal, empty final, or
   schema-invalid final is terminal invalid;
4. absent any final, authentication, authorization, invalid-model, or local
   configuration errors are fatal preflight/environment errors: stop the run
   before changing the slot, repair the environment, then resume against the
   identical locks; and
5. only absent a final and all higher-precedence classifications may one of the
   exhaustive infrastructure codes trigger a retry.

`transport_artifact_corrupt` applies only when the final artifact cannot be
decoded or its integrity cannot be verified; a verified schema-valid final is
not corrupt merely because the event stream records a recovered transport
error.

A fresh session means a new isolated runtime directory and Codex home, no
conversation identifier, no `previous_response_id`, no persisted reasoning,
no shared writable model directory, and only the neutralized packet files
staged into the model-visible working directory.

The 30-slot schedule remains the intent-to-test denominator. Per-condition
accuracy reports both `correct / 15 scheduled` and
`correct / model-scorable slots`. Terminal invalid model outputs are scorable
incorrect results. Infrastructure-failed slots are not model-scorable and are
reported separately. A paired win/loss/tie excludes a target when either
condition has a terminal infrastructure failure and reports it as
`unscorable_pair`. If fewer than 12 of 15 pairs are scorable, the experiment
may produce an operational report but no negative/mixed/promising/demo-worthy
product conclusion.

## Freeze sequence

No model call occurs until these stages pass:

1. validate the canonical dataset snapshot;
2. recover and hash strictly-prior screenshots;
3. construct the final target pool and select the 15 quantile targets;
4. create the manifest and evaluator-only target catalog;
5. pre-freeze conservative aliases;
6. render and leakage-check all 30 packets;
7. generate the deterministic schedule;
8. run the complete no-model test suite and preflight;
9. create the method lock and run lock; and
10. independently verify both locks.

## Outcome hierarchy

### Primary

Strict-granularity, same-destination top-3 accuracy after condition- and
rank-blind semantic adjudication.

### Secondary

- strict-granularity, same-destination top-1 accuracy;
- structured normalized-exact top-1 and top-3;
- action-type top-1 and top-3 accuracy;
- structured exact-action top-1 and top-3: structured normalized-exact target
  identity plus the observed action type;
- paired history win / state-only win / tie counts;
- shortcut-usefulness top-1 and top-3; and
- shallow, medium, and deep history results, using five chronological targets
  per band.

Primary paired history win / state-only win / tie counts use semantic top-3.
Separate paired tables report semantic top-1 and structured-exact top-1/top-3.
The shallow/medium/deep split is descriptive only: chronology, workflow phase,
target difficulty, and available history all change together, so it cannot
support a causal claim about history quantity.

For every per-condition correctness metric above, top-1 evaluates rank 1 and
top-3 evaluates whether any of ranks 1 through 3 succeeds. Action-type scoring
ignores target identity. Structured exact-action scoring does not substitute a
semantic same-destination judgment for structured normalized-exact identity.
Every metric reports both `successes / 15 scheduled` and
`successes / model-scorable slots`. Terminal invalid model outputs count as
incorrect in both denominators; terminal infrastructure failures remain in the
scheduled denominator, are excluded from the model-scorable denominator, and
make the corresponding pair `unscorable_pair`.

The automatic exact scorer uses the frozen structured target variants and
symmetric normalization above. Every non-exact prediction/target pair—not a
selective ambiguous subset—enters semantic adjudication. Items deduplicate by
`current_before_state_sha256 + normalized predicted target + canonical target
revision`; one decision is reused when the same candidate appears at multiple
ranks or in both conditions.

The blind semantic worksheet contains the current before-state screenshot, the
canonical observed target, and one predicted target consisting only of `app`,
`object`, and `subtarget`. It hides both action types as well as condition,
original rank, slot, paired outcome, exact-score result, and model reason.
Action-type disagreement cannot affect `same_destination`; action type is
scored separately. Dylan assigns:

- `same_destination`;
- `different_destination`; or
- `uncertain`.

`uncertain` counts as different in the primary result and as same only in a
clearly labeled sensitivity analysis. Exact matches are automatically
`same_destination`; every non-exact item receives a human decision, so semantic
false cases are explicit rather than inferred by selective triage.

Shortcut-usefulness uses a separate blind worksheet containing only the
current before-state screenshot and predicted structured action. It hides the
observed target as well as condition, rank, reason, and outcome. Dylan assigns:

- `useful`;
- `not_useful`; or
- `uncertain`.

The question is: “Would I choose this offered shortcut from this visible
state, regardless of what I actually did next?” `uncertain` counts as
`not_useful` in the primary result and as useful only in sensitivity. A
condition's usefulness top-1 is true when rank 1 is `useful`; usefulness top-3
is true when at least one of ranks 1 through 3 is `useful`. Items deduplicate
by current-state hash plus normalized predicted action.

Per-condition usefulness top-1 and top-3 each report both
`useful / 15 scheduled` and `useful / model-scorable slots`. A terminal invalid
model output counts as not useful in both denominators and produces no
worksheet candidate because it has no valid prediction. A terminal
infrastructure failure remains in the scheduled denominator, is excluded from
the model-scorable denominator, and likewise produces no worksheet candidate.
Every schema-valid prediction contributes its deduplicated candidate or reuses
the frozen decision for that candidate.

Dylan is the authoritative semantic and shortcut-usefulness adjudicator.

Predicted shortcuts may be useful even when they do not match the observed
ground-truth action; usefulness therefore remains separate from correctness.

## Interpretation rubric

There is no statistical-significance or hard numerical gate at 15 targets.
Interpret the complete frozen readout using these predeclared bands:

- **Negative:** history does no better than state-only or causes more paired
  losses than wins.
- **Weak or mixed:** history improves some targets, but exact/semantic top-3
  and useful-shortcut rates remain inconsistent.
- **Promising:** history has a clear paired advantage and its top three
  regularly contain exact or genuinely useful destinations.
- **Demo-worthy:** predictions are useful often enough that Dylan would want
  the router available during normal work.

The report must show the complete target matrix rather than only aggregate
scores.

## Required output

The final run produces:

- immutable raw attempts and model responses;
- frozen method and run locks;
- target and packet inventories with hashes;
- complete top-1/top-3 exact and semantic matrices;
- paired win/loss/tie tables;
- shortcut-usefulness worksheet and readout;
- history-depth breakdown;
- invalid-call, retry, token, latency, and completion accounting; and
- a plain-language product conclusion using the frozen interpretation rubric.

V5 results are not numerically compared with V3 or the unrun frozen V4 method
because their monitor coverage, history representation, target selection,
model configuration, response contract, and scoring differ.

## Implementation boundaries

Create a new canonical working directory:

`/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history/`

Reuse V4 components where their contracts remain valid, but do not modify V4
in place.

### File interfaces and trust boundaries

Evaluator-only files:

- `corpus-snapshot.json`: parsed canonical rows and immutable source hash;
- `eligibility-ledger.json`: chronology, dispositions, and reason codes;
- `evidence-inventory.json`: source provenance, timing, hashes, and evidence
  decisions;
- `target-selection.json`: final pool, `N`, formula, selected positions, and
  15 event IDs;
- `target-catalog.json`: canonical targets, revisions, and accepted variants;
- `evaluator-manifest.json`: roles and ground truth; and
- scoring/adjudication outputs.

Predictor-safe files:

- `contexts/<target-ordinal>/context.json`: current image hash plus only
  earlier structured history and visual-history ordinals;
- `contexts/<target-ordinal>/current.png` and
  `contexts/<target-ordinal>/visual-001.png` through `visual-010.png`:
  metadata-free, provenance-free image bytes written by the trusted context
  compiler;
- `packets/<slot>/packet.json`: condition, prompt text, neutral attachment
  order, and hashes;
- `packets/<slot>/prompt.txt`; and
- `packets/<slot>/image-001.png` through the required final image.

The evidence preparer writes verified metadata-free PNG bytes into an
evaluator-only content-addressed store. The trusted context compiler may read
that store and the evaluator files. For each target, it copies the required
bytes into the predictor-safe context bundle under the fixed names above and
writes a sanitized context that omits the current action, future actions,
target IDs, aliases, roles, provenance, predictions, and outcomes. The packet
renderer resolves images only from that one context bundle; it cannot read the
content-addressed store, evaluator manifest, or catalog. The model adapter may
read only one frozen packet directory in a fresh isolated runtime.

Leakage tests inject evaluator canaries into every forbidden field and prove
that no canary, source filename, event ID, target ID, post-action hash, current
label, or future label appears in a context, packet, prompt, staged filename,
image metadata, clean model-call directory, or model event input.

The implementation units are:

- corpus compiler: canonical ledger to V5 manifest candidates;
- evidence preparer: recover and hash strictly-prior screenshots;
- selector: filter and choose the 15 fixed quantile targets;
- packet builder: render state-only and hybrid-history packets;
- scheduler and lock writer;
- isolated model adapter;
- immutable attempt store and resume controller;
- exact scorer and blind-adjudication worksheet generator; and
- final report generator.

Each unit has a deterministic file interface and can be tested without model
calls. The model adapter receives only a frozen packet and returns raw events
plus one final structured response.

### Outcome seal during execution

The runner writes raw responses and reasons directly into an immutable
`sealed-attempts/` store and never prints them to stdout. During execution the
CLI exposes only slot ordinal, attempt ordinal, terminal/nonterminal status,
frozen classification code, latency, and aggregate completion count. It does
not calculate or render scores, prediction tables, semantic worksheets, or
shortcut-usefulness worksheets.

Only after all 30 scheduled slots are terminal does the runner atomically write
`all-slots-terminal.json`. The post-run lifecycle then has three irreversible,
ordered stages:

1. `prepare-blind-adjudication` verifies the locks, attempt hashes, and
   completion marker. It may compute exact identity internally only to exclude
   automatic exact semantic matches, but it exposes only the two blind
   worksheets and their required screenshots—never responses, reasons,
   condition/rank mappings, exact scores, or reports.
2. Dylan completes both worksheets. `freeze-adjudication` validates that every
   required opaque candidate ID has exactly one allowed decision, hashes the
   completed worksheets, and writes an immutable adjudication lock.
3. Only `reveal-results`, after verifying the adjudication lock, may
   materialize model responses, reasons, condition/rank joins, exact scores,
   matrices, and reports.

Before the run, generate one random 256-bit adjudication key and store it only
in the evaluator-sealed join area covered by the run lock. Candidate IDs are
opaque HMAC-SHA-256 values derived from that key, worksheet kind, current-state
hash, normalized candidate target or action, and—only for semantic
adjudication—the canonical target revision. Truncate the displayed ID to 128
bits while retaining the full value in the sealed join map. Deduplicated items
therefore retain one stable opaque ID without exposing a slot, condition,
target, or rank.

Within each worksheet, sort candidates by a separate HMAC-SHA-256 ordering key
derived from the same secret key, the fixed worksheet domain, and the full
candidate ID. This frozen pseudorandom order must not preserve target,
condition, rank, slot, or chronological grouping. The worksheet contains no
join key or hidden mapping. The sealed join map remains inaccessible to the
worksheet generator's rendered output and is not revealed until stage 3.

Dylan does not inspect the sealed attempt or join files during the run or blind
adjudication. This keeps target selection frozen and prevents earlier condition
outcomes from contaminating later judgments.

## Non-goals

This experiment does not:

- label more videos;
- mutate Screenpipe;
- resume the custom capture stack;
- build a general automatic Screenpipe extractor;
- fine-tune a model;
- build the live router interface;
- run V4;
- use monitor 1; or
- inspect model responses, mappings, or outcomes before all 30 scheduled slots
  finish and Dylan's blinded adjudications are frozen.

## Links

- [[computer-use-nap-v4-canonical-dataset|Computer-use NAP V4 canonical
  dataset]]
- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current
  handoff, July 28, 2026]]
- [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP
  manual labeling workbook, July 28, 2026]]
- [[computer-use-nap-build-log|Computer-use NAP build log]]
