# Computer-use NAP V5 Expanded-History Implementation Plan

> **For agentic workers:** REQUIRED: Use
> `superpowers:subagent-driven-development` (if subagents are available) or
> `superpowers:executing-plans` to implement this plan. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** Build, run, score, and report the frozen 15-target / 30-slot V5
experiment comparing the current monitor-3 state alone with the identical
state plus all earlier structured workflow history and ten recent visual
examples.

**Architecture:** Keep versioned source, method artifacts, and tests in
`scripts/computer-use-nap-v5/`. Write all large evidence, packets, attempts, and
results into the single canonical ignored runtime root at
`/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history/`.
The pipeline has three trust zones: evaluator-only source/evidence, sanitized
predictor-safe contexts/packets, and sealed post-run responses joined to blind
adjudications only after those decisions freeze.

**Tech Stack:** Node.js 24 ESM and `node:test`; built-in `crypto`, `fs`,
`child_process`, and `util`; system `ffprobe`/`ffmpeg`; Codex CLI 0.144.6;
Markdown and JSON artifacts.

**Authoritative spec:**
`/Users/dylanvu/notes/30-projects/computer-use-nap-v5-expanded-history-experiment-design-2026-07-29.md`

**Execution constraint:** Git metadata is read-only in the current sandbox, so
the required worktree cannot be created. Dylan explicitly authorized continuing
through results. Keep changes isolated to the new V5 source/runtime paths,
preserve `.obsidian/community-plugins.json`, and publish when Git writes become
available.

---

## File map

### Versioned source and method

- `scripts/computer-use-nap-v5/cli.mjs` — command router; contains no business
  logic.
- `scripts/computer-use-nap-v5/config.mjs` — frozen absolute inputs, runtime
  subpaths, method constants, and expected canonical hashes.
- `scripts/computer-use-nap-v5/prediction.schema.json` — strict three-rank
  response shape.
- `scripts/computer-use-nap-v5/predictor-instruction.txt` — one-action,
  no-tool, evidence-bound predictor contract.
- `scripts/computer-use-nap-v5/lib/immutable.mjs` — canonical JSON, SHA-256,
  atomic exclusive writes, inventories, and drift checks.
- `scripts/computer-use-nap-v5/lib/identity.mjs` — target-component
  normalization, null-shape/granularity, and full-action identity.
- `scripts/computer-use-nap-v5/lib/corpus.mjs` — canonical Markdown parser,
  destination grammar, chronology, history eligibility, and serialization.
- `scripts/computer-use-nap-v5/lib/video-index.mjs` — immutable recording-chain
  probe and rational frame index.
- `scripts/computer-use-nap-v5/lib/frame-recovery.mjs` — anchors, predecessor
  search, age/tie rules, and same-second handling.
- `scripts/computer-use-nap-v5/lib/png-evidence.mjs` — indexed extraction,
  ancillary-chunk stripping, decode/dimension verification, and
  content-addressed storage.
- `scripts/computer-use-nap-v5/lib/evidence-review.mjs` — automated
  dispositions, full-resolution review bundle, and decision validation.
- `scripts/computer-use-nap-v5/lib/eligibility.mjs` — history/visual/target
  dispositions and midpoint-quantile selection.
- `scripts/computer-use-nap-v5/lib/catalog.mjs` — target revisions, accepted
  structured variants, and evaluator manifest.
- `scripts/computer-use-nap-v5/lib/contexts.mjs` — evaluator-to-predictor
  sanitization and visual recent-10 resolution.
- `scripts/computer-use-nap-v5/lib/packet-renderer.mjs` — condition prompts,
  regular neutral image copies, and packet inventory.
- `scripts/computer-use-nap-v5/lib/leakage-audit.mjs` — independent canary and
  allowlist inspection of contexts, packets, staging, and model inputs.
- `scripts/computer-use-nap-v5/lib/schedule.mjs` — alternating 30-slot schedule.
- `scripts/computer-use-nap-v5/lib/response-validation.mjs` — strict
  application-level prediction validation.
- `scripts/computer-use-nap-v5/lib/event-classifier.mjs` — structural provider
  event parsing and frozen attempt precedence.
- `scripts/computer-use-nap-v5/lib/codex-adapter.mjs` — isolated argv,
  auth-safe ephemeral homes, process streaming, and timeout.
- `scripts/computer-use-nap-v5/lib/attempt-store.mjs` — exclusive attempt
  journals, fsync, hashes, and verification.
- `scripts/computer-use-nap-v5/lib/locks.mjs` — method/run inventories, freeze
  sequence, V4 donor guard, and immutable key claim.
- `scripts/computer-use-nap-v5/lib/preflight.mjs` — no-model environmental and
  leakage verification.
- `scripts/computer-use-nap-v5/lib/slot-state.mjs` — pure retry/terminal state
  machine.
- `scripts/computer-use-nap-v5/lib/runner.mjs` — sequential resume, completion
  accounting, and outcome seal.
- `scripts/computer-use-nap-v5/lib/blind-ids.mjs` — opaque HMAC candidate IDs,
  deduplication, domain separation, and randomized order.
- `scripts/computer-use-nap-v5/lib/blind-worksheets.mjs` — exact blind
  worksheet rendering and sealed join persistence.
- `scripts/computer-use-nap-v5/lib/adjudication-lock.mjs` — decision
  validation/freeze and reveal gate.
- `scripts/computer-use-nap-v5/lib/scoring.mjs` — exact, semantic, action-type,
  exact-action, usefulness, paired, and denominator calculations.
- `scripts/computer-use-nap-v5/lib/report.mjs` — complete matrix and
  plain-language final report.
- `scripts/computer-use-nap-v5/test/*.test.mjs` — one focused suite per module
  plus end-to-end fixture and mutation tests.
- `scripts/computer-use-nap-v5/test/corpus-fixtures.mjs` — typed ledger/table
  fixtures.
- `scripts/computer-use-nap-v5/test/media-fixtures.mjs` — tiny MP4/PNG and
  rational-timestamp fixtures.
- `scripts/computer-use-nap-v5/test/attempt-fixtures.mjs` — valid/invalid
  provider streams and synthetic run roots.

### Canonical ignored runtime

- `evaluator/` — corpus snapshot, eligibility/evidence ledgers, target
  selection/catalog, sealed join material, and ground truth.
- `predictor/contexts/` — sanitized context bundles.
- `predictor/packets/` — immutable condition packets with neutral images.
- `locks/` — method/run/completion/adjudication locks and inventories.
- `sealed-attempts/` — immutable per-attempt events/finals/records.
- `blind/` — only the two blinded worksheets and their screenshot assets
  before decision freeze.
- `revealed/` — responses, joins, scores, matrices, and final report created
  only after adjudication freezes.

## Chunk 1: Frozen inputs, evidence, and predictor packets

### Task 1: Freeze the V5 method surface

**Files:**

- Create: `scripts/computer-use-nap-v5/config.mjs`
- Create: `scripts/computer-use-nap-v5/prediction.schema.json`
- Create: `scripts/computer-use-nap-v5/predictor-instruction.txt`
- Create: `scripts/computer-use-nap-v5/lib/immutable.mjs`
- Create: `scripts/computer-use-nap-v5/lib/identity.mjs`
- Create: `scripts/computer-use-nap-v5/lib/donor-guard.mjs`
- Create: `scripts/computer-use-nap-v5/test/corpus-fixtures.mjs`
- Create: `scripts/computer-use-nap-v5/test/media-fixtures.mjs`
- Create: `scripts/computer-use-nap-v5/test/attempt-fixtures.mjs`
- Create: `scripts/computer-use-nap-v5/test/config.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/immutable.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/identity.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/donor-guard.test.mjs`

- [ ] **Step 0: Write six failing V4 donor-guard tests**

  Cover recursive regular-file discovery, relative POSIX sorting,
  symlink/special-entry rejection, byte-length/hash drift, the frozen 21-file
  baseline, and static/dynamic import specifiers containing `experiment-v4`.

- [ ] **Step 0a: Run donor-guard tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/donor-guard.test.mjs`.
  Expected: one module-not-found failure for `donor-guard.mjs`.

- [ ] **Step 0b: Implement and execute the V4 donor guard**

  Exact inventory keys are `version`, `root`, `files`, and
  `aggregate_sha256`; each file has `path`, `byte_length`, and `sha256`.
  Aggregate bytes are one UTF-8 line per sorted file:
  `<sha256><two spaces><relative POSIX path><LF>`. Require 21 files, aggregate
  `307f06ad992e20aa51d464a4b04e2145eab6f950f26fcb2edbe289319871d0bc`,
  and existing method-lock SHA
  `55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa`.

  Run:

  ```bash
  node --input-type=module -e 'import { freezeV4DonorInventory } from "./scripts/computer-use-nap-v5/lib/donor-guard.mjs"; await freezeV4DonorInventory();'
  node --test scripts/computer-use-nap-v5/test/donor-guard.test.mjs
  ```

  Expected: the evaluator inventory is exclusively created and exactly six
  tests pass. Every later verification reruns the inventory and audits V5
  import specifiers. Before this guard passes, implementation may not copy or
  adapt any V4 pattern.

- [ ] **Step 1: Write failing contract tests**

  Assert the exact model (`gpt-5.6-sol`), effort (`max`), tier (`priority`),
  conditions, 15 targets, 30 slots, canonical file/commit provenance, runtime
  root, response fields, and structural target-shape constraints. Cross-entry
  rank/distinctness, trimmed-string, and code-point rules are explicitly tested
  later by the authoritative response validator in Task 7, not claimed as JSON
  Schema behavior.
  Add immutable-write tests proving equal bytes are idempotent and different
  bytes fail without overwrite. Identity tests require NFKC, trim, lowercase,
  collapsed internal whitespace, strict null shape, and no punctuation/word
  removal.

- [ ] **Step 2: Run the tests and verify RED**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/config.test.mjs \
    scripts/computer-use-nap-v5/test/immutable.test.mjs \
    scripts/computer-use-nap-v5/test/identity.test.mjs \
    scripts/computer-use-nap-v5/test/donor-guard.test.mjs
  ```

  Expected: three module-not-found failures for the contract modules; the
  already-green donor guard remains six-for-six.

- [ ] **Step 3: Implement the minimal frozen contract**

  Export these exact public values/functions:

  ```js
  export const METHOD = Object.freeze({
    model: 'gpt-5.6-sol',
    reasoningEffort: 'max',
    serviceTier: 'priority',
    targetCount: 15,
    scheduledSlotCount: 30,
    conditions: Object.freeze([
      'state_only',
      'state_plus_hybrid_history',
    ]),
  });
  export const sha256 = (bytes) =>
    createHash('sha256').update(bytes).digest('hex');
  export const normalizeComponent = (value) => value === null
    ? null
    : value.normalize('NFKC').trim().toLowerCase().replace(/\s+/gu, ' ');
  ```

  `canonicalJson` recursively sorts object keys, preserves array order, uses
  two-space indentation and one trailing newline, and rejects unsupported
  values. `writeImmutable` opens with `wx`/`0600`, fsyncs file and parent, and
  treats byte-identical existing content as idempotent.
  `targetGranularity` returns `application` only for both-null,
  `object` only for object/nonempty plus null subtarget, and `subtarget` only
  for two nonempty components; every other shape throws.
  `normalizedFullAction` canonical-JSON serializes the action type plus three
  symmetrically normalized components. `verifyInventory` rejects symlinks,
  missing/extra paths, byte lengths, and hash drift.

  Use this complete predictor instruction:

  ```text
  Predict Dylan's immediate next eligible monitor-3 navigation action from only
  the supplied before-state and, when present, earlier personal workflow
  history. Return exactly three distinct ranked predictions. Each prediction is
  one action: focus an already-present destination, or activate a control that
  navigates/selects/invokes a destination. Do not predict typing, paste,
  scrolling, cursor movement, text selection, resizing, a multi-action
  sequence, or an eventual goal. Use only visible/provided evidence. Do not use
  tools. Keep each reason under 240 Unicode code points.
  ```

  The complete schema is an exact-key object with required `predictions`; its
  array has `minItems=maxItems=3`; each exact-key item requires integer
  `rank` 1–3, enum `action_type`, string `app`, string-or-null `object` and
  `subtarget`, and string `reason`, with `additionalProperties=false`
  everywhere. JSON Schema performs only structural checks. Task 7's validator
  authoritatively enforces order, trimming, null dependency, distinctness, and
  Unicode code-point length.

- [ ] **Step 4: Run the focused tests and verify GREEN**

  Run the exact Step 2 command. Expected: exactly 24 tests pass, zero
  failures/skips/warnings.

- [ ] **Step 5: Run `git diff --check`**

  If Git remains metadata-read-only, record the exact limitation but continue;
  never alter `.obsidian/community-plugins.json`.

### Task 2: Compile the canonical ledger without inference

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/corpus.mjs`
- Create: `scripts/computer-use-nap-v5/test/corpus.test.mjs`
- Modify: `scripts/computer-use-nap-v5/test/corpus-fixtures.mjs`

- [ ] **Step 1: Write failing parser and serialization tests**

  Cover the eleven-column Markdown table, backtick removal, Unicode arrows,
  accepted/nonaccepted statuses, `History=yes`, player times `m:ss`,
  approximate/range/`after` timing as text-history-valid but
  visual-timing-unresolvable, equal-second authoritative row order,
  `focus`/`activate`, input method, and strict application/object/subtarget
  shapes. For three or more arrow-separated destination segments, preserve the
  first as `app`, the last as `subtarget`, and join every intervening segment
  into `object` with the literal ` → ` separator.

  Isolate only the table beginning with the exact eleven-column header under
  `## Merged clean event ledger` and ending immediately before
  `## Retired batch-1 candidates`. Require exactly 220 body rows and eleven
  cells per row. Exercise noncontiguous numeric IDs plus `011A`/`035A`,
  Markdown backticks, and all observed time kinds:

  ```js
  { kind: 'exact', seconds: 16, sequence: null, raw: '0:16' }
  { kind: 'exact', seconds: 16, sequence: 'a', raw: '0:16a' }
  { kind: 'unresolvable', reason: 'approximate', raw: '~0:06' }
  { kind: 'unresolvable', reason: 'range', raw: '1:27–1:47' }
  { kind: 'unresolvable', reason: 'relative_after', raw: 'after 3:17' }
  { kind: 'unresolvable', reason: 'relative_before', raw: 'before 0:00' }
  ```

  Required fixture assertions:

  ```js
  assert.equal(snapshot.retained_count, 220);
  assert.equal(snapshot.accepted_count, 196);
  assert.equal(snapshot.accepted_history_count, 196);
  assert.equal(snapshot.accepted_nontrivial_count, 139);
  assert.equal(snapshot.source.dataset_commit,
    'fa3a5c80f3689619da3bf7a3e902041b3b223aea');
  assert.deepEqual(snapshot.rows[0].target, {
    app: 'Codex',
    object: 'Patch NAP blog prep in vault',
    subtarget: 'composer',
  });
  assert.deepEqual(byId.get('BLOG-V4-098').target, {
    app: 'Arc',
    object: 'Coda → all hands 7.23',
    subtarget: 'editor/body',
  });
  ```

- [ ] **Step 2: Run the focused test and verify RED**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/corpus.test.mjs
  ```

  Expected: module-not-found failure.

- [ ] **Step 3: Implement the canonical parser**

  Public functions are `parseCanonicalLedger(markdownBytes, provenance)`,
  `parsePlayerTime(raw)`, `parseDestination(raw)`,
  `serializeHistoryRow(row, historyOrdinal)`, and
  `compileCorpusSnapshot(options)`.

  `parseCanonicalLedger` first hashes the unmodified bytes, requires the frozen
  SHA, then decodes UTF-8 and parses only the named table. `compileCorpusSnapshot`
  shell-free invokes `git cat-file -e <commit>^{commit}` and
  `git show <commit>:30-projects/computer-use-nap-v4-canonical-dataset.md`,
  requiring those historical bytes to have the same frozen SHA.

  Every parsed row has exactly:

  ```text
  event_id, chronology_index, recording_id, raw_recording_time,
  parsed_time, canonical_status, input_method, action_type,
  target{app,object,subtarget}, history_value, demo_value,
  shortcut_value, canonical_evidence_value, context_cleanup
  ```

  Preserve every physical row and a one-based `chronology_index`. Never sort by
  timestamp or event ID. Accepted `History=yes` rows that cannot serialize
  exactly must abort preflight; nonaccepted ambiguous rows remain evaluator
  audit records. `serializeHistoryRow` emits exact keys
  `history_ordinal`, `action_type`, `input_method`, `granularity`, `app`,
  `object`, and `subtarget`.

- [ ] **Step 4: Run Task 2 tests and the Task 1 regression tests**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/{config,immutable,identity,donor-guard,corpus}.test.mjs
  ```

  Expected: exactly 44 tests pass, zero failures/skips, and the frozen canonical SHA remains
  `5df40abf89f0083a0b73965045d75a6ddaa1509f0c04f4bfc2cce027ddae1a48`.

### Task 3: Recover strictly-prior monitor-3 evidence

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/video-index.mjs`
- Create: `scripts/computer-use-nap-v5/lib/frame-recovery.mjs`
- Create: `scripts/computer-use-nap-v5/lib/png-evidence.mjs`
- Create: `scripts/computer-use-nap-v5/lib/evidence-review.mjs`
- Create: `scripts/computer-use-nap-v5/test/video-index.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/frame-recovery.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/png-evidence.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/evidence-review.test.mjs`
- Modify: `scripts/computer-use-nap-v5/test/media-fixtures.mjs`

- [ ] **Step 1: Write 12 failing video-index tests**

  Generate tiny fixture MP4s with known PTS values and multiple time bases.
  Cover regular-file/symlink rules, endpoint/predecessor membership, ignored
  duration, hashes, monotonic PTS, PTS/best-effort equality, stream shape,
  reduced BigInt rationals, and stable decode indexes. Freeze the real-corpus
  assertions: 31 files, 103,005,033 bytes, 1,092 frames, 13 time bases, and the
  three no-event recordings.

- [ ] **Step 2: Run video-index tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/video-index.test.mjs`.
  Expected: one module-not-found failure for `video-index.mjs`.

- [ ] **Step 3: Implement the exact probe and rational timeline**

  Spawn without a shell:

  ```text
  ffprobe -v error -select_streams v:0
    -show_entries stream=codec_name,width,height,time_base,start_time
    -show_entries frame=pts,best_effort_timestamp
    -show_frames -of json <absolute-mp4>
  ```

  Assign zero-based decode index from returned frame order. Parse
  `time_base=n/d` and frame PTS as `BigInt`. Represent every time as a reduced
  rational `{numerator, denominator}`; global seconds are
  `(recording_epoch_ms / 1000) + pts*n/d`. Compare rationals by cross
  multiplication—never `Number`, average FPS, duration, or index arithmetic.
  Require one HEVC 1920×1080 stream, start time zero, non-null monotonic PTS,
  and PTS equal to best-effort timestamp.

  The video chain is the complete sorted regular-file sequence between the two
  frozen endpoint IDs plus the explicit predecessor. Freeze relative path,
  byte length, SHA-256, probe metadata, and predecessor ID. Never infer
  continuity from MP4 duration.

- [ ] **Step 4: Run video-index tests and verify GREEN**

  Run the Step 2 command. Expected: exactly 12 tests pass, zero failures/skips.

- [ ] **Step 5: Write 14 failing frame-recovery tests**

  Cover ordinary anchor, current+locked-predecessor search, exact five-second
  inclusive boundary, stale/missing/timing-unresolvable, lower-decode-index and
  ASCII-path ties, rational comparisons across time bases, duplicate image
  hashes as distinct rows, and all seven later same-second events (`008`,
  `011`, `021`, `104`, `176`, `182`, `204`).

- [ ] **Step 6: Run frame-recovery tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/frame-recovery.test.mjs`.
  Expected: one module-not-found failure for `frame-recovery.mjs`.

- [ ] **Step 7: Implement deterministic frame recovery**

  Ordinary anchor is exact global `recording epoch + player seconds - 1`.
  Search only current plus its locked predecessor. Retain candidates at/before
  anchor and choose global time descending, decode index ascending, then ASCII
  absolute path ascending. Age `<=5` seconds passes; `>5` is stale.

  Group same-second rows by recording plus base whole second, ignoring suffix;
  ledger order is authoritative. Because the corpus contains no independently
  frozen subsecond action boundaries, every later row in such a group receives
  `same_time_interval_unrecoverable` and never reuses the ordinary anchor.
  Earlier rows and all seven later-row IDs remain text history.

- [ ] **Step 8: Run frame-recovery tests and verify GREEN**

  Run the Step 6 command. Expected: exactly 14 tests pass, zero failures/skips.

- [ ] **Step 9: Write 12 failing PNG-evidence tests**

  Cover exact decode-index selection, exclusive output, source dimensions,
  stable pixel decode, repeatable bytes, critical-chunk CRCs, rejection/removal
  of `pHYs`, text, EXIF, time, unknown ancillary chunks, trailing bytes,
  corrupt PNGs, and content-addressed idempotency.

- [ ] **Step 10: Run PNG-evidence tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/png-evidence.test.mjs`.
  Expected: one module-not-found failure for `png-evidence.mjs`.

- [ ] **Step 11: Implement indexed PNG extraction and sanitization**

  Spawn without a shell:

  ```text
  ffmpeg -v error -i <absolute-mp4>
    -vf select=eq(n\\,<decode-index>) -fps_mode passthrough
    -frames:v 1 -map_metadata -1 -map_chapters -1
    -c:v png <exclusive-temporary-png>
  ```

  Parse PNG chunks with CRC verification, reject trailing bytes, and rewrite
  only critical chunks (`IHDR`, optional `PLTE`, one or more `IDAT`, `IEND`);
  this removes `pHYs`, text, EXIF, time, and every other ancillary chunk. Decode
  the sanitized file again with ffmpeg, require source dimensions, hash final
  bytes, and store once at
  `evaluator/evidence-store/sha256/<first-two>/<sha256>.png`. Deduplicate
  extraction only by `(source path, decode index)`, never history rows or image
  hashes.

- [ ] **Step 12: Run PNG-evidence tests and verify GREEN**

  Run the Step 10 command. Expected: exactly 12 tests pass, zero failures/skips.

- [ ] **Step 13: Write 10 failing evidence-review tests**

  Require one review decision for every accepted `History=yes` row, including
  confirmation of automatic recommendations. Validate exact allowed
  dispositions, inventory hash, IDs/order, reviewer provenance, full-resolution
  links, and rejection of missing/extra/pending decisions.

- [ ] **Step 14: Run evidence-review tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/evidence-review.test.mjs`.
  Expected: one module-not-found failure for `evidence-review.mjs`.

- [ ] **Step 15: Implement evidence inventory and review ownership**

  Public functions are:

  `inventoryVideoChain`, `choosePriorFrame`, `extractMetadataFreePng`,
  `buildEvidenceInventory`, and `renderEvidenceReview`.

  Automated final dispositions are `timing_unresolvable`, `missing`,
  `stale_over_5s`, `same_time_interval_unrecoverable`, `wrong_monitor`, and
  decode/integrity-derived `corrupt_or_unreadable`. Mechanically passing rows
  remain `pending_human`; the reviewer must choose `usable`,
  `post_action_risk`, `wrong_monitor`, or `corrupt_or_unreadable`. The frozen
  output permits exactly the eight spec dispositions, never
  `pending_human`. Full-resolution direct PNG links are authoritative; contact
  sheets are navigation aids only. Capture executable versions and exact argv
  in evaluator provenance. Never mutate source MP4s.

- [ ] **Step 16: Freeze the exact evidence-inventory row schema**

  Every one of the 220 rows stores exact keys:

  ```text
  chronology_index, event_id, evidence_scope, mode, raw_time,
  anchor_time{numerator,denominator}|null,
  interval_predecessor_event_id|null, searched_recording_ids[],
  selected_frame|null, automated_checks, automated_recommendation,
  final_disposition|null, review_provenance|null
  ```

  `selected_frame` has recording ID, locked source SHA, decode index,
  rational local/global PTS, rational age milliseconds, PNG SHA/store-relative
  path, width, and height. Rational numerators/denominators are canonical base-10
  strings, reduced, with positive denominator. Non-history rows use
  `evidence_scope=not_required` and null final disposition. Every one of the
  196 accepted history rows must receive a final manually reviewed one-of-eight
  disposition, even when confirming an automatic recommendation. Reviewer
  provenance says `codex_visual_review`, never `human` or `dylan`.

- [ ] **Step 17: Run evidence-review tests and verify GREEN**

  Run the Step 14 command. Expected: exactly 10 tests pass, zero failures/skips.

- [ ] **Step 18: Run Task 3 tests and all prior tests**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/{config,immutable,identity,donor-guard,corpus,video-index,frame-recovery,png-evidence,evidence-review}.test.mjs
  ```

  Expected: exactly 92 tests pass, zero failures/skips; mutation tests catch stale,
  post-action, wrong-monitor, ancillary metadata, trailing bytes, corrupt,
  dimension, hash, and same-second errors.

### Task 4: Freeze manual evidence decisions and select 15 targets

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/eligibility.mjs`
- Create: `scripts/computer-use-nap-v5/lib/catalog.mjs`
- Create: `scripts/computer-use-nap-v5/test/eligibility.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/catalog.test.mjs`
- Create at runtime:
  `evaluator/evidence-review-decisions.json`
- Create at runtime: `evaluator/eligibility-ledger.json`
- Create at runtime: `evaluator/target-selection.json`
- Create at runtime: `evaluator/target-catalog.json`
- Create at runtime: `evaluator/evaluator-manifest.json`

- [ ] **Step 1: Write 14 failing eligibility and quantile tests**

  Assert:

  ```js
  positions = Array.from(
    { length: 15 },
    (_, i) => Math.floor((i + 0.5) * N / 15),
  );
  assert.deepEqual(selectPositions(84, 15),
    [2, 8, 14, 19, 25, 30, 36, 42, 47, 53, 58, 64, 70, 75, 81]);
  ```

  Cover `Demo`/`Shortcut` explicit `no`, pending/unrated eligibility, Enter and
  Command-W target exclusion but history inclusion, placeholder destination
  rejection, usable current evidence, ten earlier usable visual rows, `N<15`
  abort, no outcome-adaptive replacement, and exact selected positions.

  Freeze these reason vocabularies:

  ```text
  history: history_eligible | status_not_accepted | history_not_yes
  visual: visual_usable | evidence_<one-of-eight-dispositions>
  target: target_eligible | status_not_accepted | history_not_yes |
          excluded_prompt_submission | excluded_command_w |
          demo_explicit_no | shortcut_explicit_no |
          target_placeholder | target_parse_failed |
          current_evidence_not_usable | fewer_than_10_prior_usable_visuals
  ```

  Serialization failure for an accepted `History=yes` row is fatal and cannot
  become a reason-coded omission.

  Record every applicable failure reason in the exact predicate order printed
  above; use the single positive code only when no failure applies. The frozen
  placeholder predicate NFKC/trim/lowercase/collapses whitespace and rejects a
  complete component equal to `unknown`, `some message`, `some page`,
  `some file`, `unresolved`, `tbd`, `n/a`, or `?`, plus a component matching
  the complete unresolved-alternative form `<nonempty> or <nonempty>`. It does
  not treat punctuation such as `editor/body` as an alternative.

- [ ] **Step 2: Run eligibility tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/eligibility.test.mjs`.
  Expected: one module-not-found failure for `eligibility.mjs`.

- [ ] **Step 3: Implement exact eligibility artifact schemas**

  `evidence-review-decisions.json` has exact keys `version`, `inventory_sha256`,
  and ordered decisions of `chronology_index`, `event_id`, `disposition`, and
  optional nonempty reviewer note. `eligibility-ledger.json` has all 220 rows
  with canonical chronology, nullable `history_ordinal`, history/visual/target
  eligibility booleans, ordered frozen `reason_codes` arrays, evidence
  disposition/hash, and `earlier_usable_visual_count`.

- [ ] **Step 4: Implement eligibility and selection**

  Public functions are `validateEvidenceDecisions`,
  `buildEligibilityLedger`, and `selectQuantileTargets`.

- [ ] **Step 5: Run eligibility tests and verify GREEN**

  Run the Step 2 command. Expected: exactly 14 tests pass, zero failures/skips.

- [ ] **Step 6: Write 10 failing catalog/manifest tests**

  Cover canonical-only variants, revision syntax, strict null/granularity
  shape, no post-output mutation, 15 selected joins, ground truth, evidence
  hashes, approval provenance, source hashes, and exact-key rejection.

- [ ] **Step 7: Run catalog tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/catalog.test.mjs`.
  Expected: one module-not-found failure for `catalog.mjs`.

- [ ] **Step 8: Implement catalog and evaluator manifest schemas**

  `target-selection.json` has exact source hashes, final ordered pool IDs, `N`,
  formula string, zero-based selected positions, and 15 selected IDs.
  `target-catalog.json` has one `NAP-V5-TARGET-<01..15>-R1` entry per selected
  row, strict granularity, canonical target, and one or more complete accepted
  structured variants with identical null shape. `evaluator-manifest.json`
  joins each target ordinal to canonical chronology, ground-truth target/action
  type/input method, current evidence hash, and evaluator-only provenance.

  Public functions are `buildTargetCatalog` and `buildEvaluatorManifest`.

  Default every catalog entry to its canonical structured identity only.
  Additional variants require explicit pre-run entries with the same null shape
  and granularity; never synthesize or add aliases after inference.

- [ ] **Step 9: Run catalog tests and verify GREEN**

  Run the Step 7 command. Expected: exactly 10 tests pass, zero failures/skips.

- [ ] **Step 10: Run Task 4 and regression tests**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/{identity,corpus,evidence-review,eligibility,catalog}.test.mjs
  ```

  Expected: exactly 60 tests pass, zero failures/skips, deterministic selection
  for identical frozen evidence decisions, and failure on any missing
  disposition, invalid reason, target revision, variant, or
  evaluator-manifest field.

### Task 5: Build sanitized contexts and leakage-safe packets

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/contexts.mjs`
- Create: `scripts/computer-use-nap-v5/lib/packet-renderer.mjs`
- Create: `scripts/computer-use-nap-v5/lib/leakage-audit.mjs`
- Create: `scripts/computer-use-nap-v5/test/contexts.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/packet-renderer.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/leakage-audit.test.mjs`

- [ ] **Step 1: Write 10 failing context tests**

  Prove state-only sees only the current PNG. Prove history sees every earlier
  accepted `History=yes` serialized row, plus the ten highest earlier usable
  evidence rows in chronology order, and the identical current PNG last.
  Equal-time rows must retain ledger order. Current/future rows, predictions,
  outcomes, source paths, IDs, aliases, roles, and evidence dispositions must
  be absent.

  The sanitized context has exactly:

  ```text
  version
  current{image_sha256}
  history[{history_ordinal,action_type,input_method,granularity,
           app,object,subtarget}]
  visual_history[{image_ordinal,history_ordinal,image_sha256}]
  ```

  `history_ordinal` is 1-based across the 196 accepted history rows.
  `image_ordinal` is 1–10 oldest-to-newest. No target/event/recording/slot ID or
  chronology index is permitted in JSON.

- [ ] **Step 2: Run context tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/contexts.test.mjs`.
  Expected: one module-not-found failure for `contexts.mjs`.

- [ ] **Step 3: Implement and verify contexts**

  Implement `buildSanitizedContext` and `writeContextBundle`, then rerun Step 2.
  Expected: exactly 10 tests pass, zero failures/skips.

- [ ] **Step 4: Write 10 failing packet-renderer tests**

  A packet has exactly `version`, `condition`, `prompt_text`,
  `context_sha256`, and `images[{attachment_ordinal,sha256}]`. It contains no
  source path. Predictor packet images are regular non-symlink byte copies,
  never links. History prompt text contains each structured action once; image
  mapping lines contain only `image ordinal → history ordinal` and never
  duplicate the action text.

  Freeze UTF-8/LF prompt bytes with one trailing newline. State-only is exactly:

  ```text
  CURRENT BEFORE-STATE
  image-001.png

  Predict the immediate next eligible action.
  ```

  History is exactly:

  ```text
  EARLIER COMPLETED ACTIONS (oldest to newest)
  <one compact JSON record per line in frozen key order>

  RECENT VISUAL HISTORY (oldest to newest)
  image-001.png -> history_ordinal=<integer>
  ...
  image-010.png -> history_ordinal=<integer>

  CURRENT BEFORE-STATE
  image-011.png

  Predict the immediate next eligible action.
  ```

  Record key order is `history_ordinal`, `action_type`, `input_method`,
  `granularity`, `app`, `object`, `subtarget`. Use `JSON.stringify` on an object
  constructed in exactly that order; no indentation or extra spaces.

- [ ] **Step 5: Run packet-renderer tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/packet-renderer.test.mjs`.
  Expected: one module-not-found failure for `packet-renderer.mjs`.

- [ ] **Step 6: Implement and verify packet rendering**

  Implement `renderPredictorPrompt` and `renderFrozenPacket`. The renderer may
  read only one predictor-safe context bundle, never evaluator files. Rerun
  Step 5. Expected: exactly 10 tests pass, zero failures/skips.

- [ ] **Step 7: Write 12 failing independent leakage-audit tests**

  Inject unique canaries into every forbidden evaluator field. The independent
  auditor—not the renderer—asserts none appears in context JSON, prompt, packet
  JSON, filenames, or PNG metadata. Clean-call-directory and serialized model
  request tests belong to Task 7 after staging exists. Require neutral filenames
  `image-001.png`…`image-011.png`; state-only uses only `image-001.png`.

- [ ] **Step 8: Run leakage-audit tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/leakage-audit.test.mjs`.
  Expected: one module-not-found failure for `leakage-audit.mjs`.

- [ ] **Step 9: Implement the independent leakage auditor**

  Implement `auditPredictorSafeTree` using exact-key allowlists plus byte search
  over JSON/text/names and a PNG critical-chunk parser independent of the
  renderer. It rejects symlinks, special files, extra files, and hashes/order
  outside the packet inventory.

- [ ] **Step 10: Run leakage-audit tests and verify GREEN**

  Run the Step 8 command. Expected: exactly 12 tests pass, zero failures/skips.

- [ ] **Step 11: Run Task 5 tests and all Chunk 1 tests**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/{config,immutable,identity,donor-guard,corpus,video-index,frame-recovery,png-evidence,evidence-review,eligibility,catalog,contexts,packet-renderer,leakage-audit}.test.mjs
  ```

  Expected: exactly 148 tests pass, zero failures/skips; byte-identical current screenshots
  across each pair and every canary caught by an independent audit mutation.

### Task 6: Add deterministic preparation without freezing the run

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/schedule.mjs`
- Create: `scripts/computer-use-nap-v5/lib/prepare.mjs`
- Create: `scripts/computer-use-nap-v5/cli.mjs`
- Create: `scripts/computer-use-nap-v5/test/schedule.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/prepare.test.mjs`

- [ ] **Step 1: Write 8 failing schedule tests**

  Assert 15 adjacent pairs / 30 slots, chronological targets, odd target
  state-first, even target history-first, 8/7 first-condition balance, unique
  slot IDs, adjacent pair order, and deterministic byte-identical output.

- [ ] **Step 2: Run schedule tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/schedule.test.mjs`.
  Expected: one module-not-found failure for `schedule.mjs`.

- [ ] **Step 3: Implement and verify the schedule**

  Implement the pure schedule builder and rerun Step 2. Expected: exactly eight
  tests pass, zero failures/skips.

- [ ] **Step 4: Write 10 failing preparation/CLI tests**

  Test exact command prerequisites/artifacts, exclusive idempotent writes,
  refusal to skip stages, canonical catalog approval before packet rendering,
  no model spawn, and a prepared inventory that omits method/run/adjudication
  locks.

- [ ] **Step 5: Run preparation tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/prepare.test.mjs`.
  Expected: one module-not-found failure for `prepare.mjs`.

- [ ] **Step 6: Implement preparation commands**

  Required commands and effects:

  ```text
  compile-corpus       evaluator/corpus-snapshot.json only
  prepare-evidence     evidence inventory, PNG store, review sheets only
  freeze-evidence      validates/finalizes dispositions
  select-targets       eligibility, target selection, draft catalog/manifest
  approve-catalog      canonical-only variants plus truthful blanket provenance
  prepare-packets      contexts, packets, schedule, prepared inventory
  verify-prepared      rehashes prepared artifacts and runs leakage checks
  ```

  No command above may call a model or expose future labels to predictor-safe
  files. No command above may generate an adjudication key, method lock, or run
  lock; those freeze only in Task 11 after the complete adapter, scoring,
  no-model suite, real preflight, and reviews pass. Each command is
  byte-idempotent: rerun verifies existing prerequisites/artifacts and
  continues at the first missing stage; drift fails without rewrite.

- [ ] **Step 7: Run preparation tests and verify GREEN**

  Run the Step 5 command. Expected: exactly 10 tests pass, zero failures/skips.

- [ ] **Step 8: Run all Chunk 1 tests**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/{config,immutable,identity,donor-guard,corpus,video-index,frame-recovery,png-evidence,evidence-review,eligibility,catalog,contexts,packet-renderer,leakage-audit,schedule,prepare}.test.mjs
  ```

  Expected: exactly 166 tests pass, zero failures/skips/warnings.

- [ ] **Step 9: Leave real preparation deferred**

  Do not create real corpus/evidence/target/packet artifacts yet. Task 11 runs
  the exact commands only after every implementation task, full test suite, and
  independent code reviews pass. This prevents an implementation fix from
  stranding immutable prepared bytes. Task 6 ends with synthetic tests only.

## Chunk 2: Isolated execution, blind adjudication, and results

### Task 7: Implement the isolated model adapter and attempt classifier

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/response-validation.mjs`
- Create: `scripts/computer-use-nap-v5/lib/event-classifier.mjs`
- Create: `scripts/computer-use-nap-v5/lib/codex-adapter.mjs`
- Create: `scripts/computer-use-nap-v5/lib/attempt-store.mjs`
- Create: `scripts/computer-use-nap-v5/test/response-validation.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/event-classifier.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/codex-adapter.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/attempt-store.test.mjs`
- Modify: `scripts/computer-use-nap-v5/test/attempt-fixtures.mjs`

- [ ] **Step 1: Write 16 failing response-validation tests**

  Test exactly three ranks, consecutive unique rank integers, trimmed nonempty
  components, null-shape rules, 240-code-point reasons, and normalized
  full-action distinctness. A transported response violating any rule is
  terminal `invalid_schema`; it is never repaired, deduplicated, or reranked.

- [ ] **Step 2: Run response-validation tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/response-validation.test.mjs`.
  Expected: one module-not-found failure for `response-validation.mjs`.

- [ ] **Step 3: Implement and verify response validation**

  Implement `validatePredictions` with exact keys, code-point counting via
  `Array.from(reason).length`, ranks exactly at array indexes 0–2, and
  `normalizedFullAction` distinctness. Rerun Step 2. Expected: exactly 16 tests
  pass, zero failures/skips.

- [ ] **Step 4: Write 22 failing event-classification tests**

  Use real JSONL-shaped fixtures and assert this order:

  ```text
  actual tool request/invocation > any final
  schema-valid final > recovered disconnect/fallback/nonzero process exit
  refusal/empty/schema-invalid final > retryable infrastructure
  auth/authorization/invalid-model/config with no final > fatal environment
  exhaustive no-final infrastructure code > retry
  ```

  Tool detection must use structural event types/fields, never free-text.
  `transport_artifact_corrupt` applies only when final bytes cannot decode or
  verify. Cover all seven frozen retryable codes and all four fatal environment
  categories.

- [ ] **Step 5: Run event-classifier tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/event-classifier.test.mjs`.
  Expected: one module-not-found failure for `event-classifier.mjs`.

- [ ] **Step 6: Implement and verify frozen precedence**

  Implement `classifyAttemptArtifacts` from structural JSONL event types and
  final bytes. A complete schema-valid final remains authoritative after
  reconnect, fallback, timeout marker, or nonzero exit unless a structural tool
  event exists. Re-derive token usage from `turn.completed.usage`. Rerun Step 5.
  Expected: exactly 22 tests pass, zero failures/skips.

- [ ] **Step 7: Write 18 failing argv and isolation tests**

  The executable and exact ordered argv prefix are:

  ```text
  codex
  -a never
  exec
  --strict-config
  --ephemeral
  --ignore-user-config
  --ignore-rules
  --skip-git-repo-check
  --sandbox read-only
  --model gpt-5.6-sol
  -c model_reasoning_effort="max"
  -c service_tier="priority"
  -c developer_instructions="<JSON-escaped frozen instruction>"
  <ordered frozen disable configs>
  --output-schema <absolute-clean-schema>
  --json
  --output-last-message <absolute-inflight-final>
  --cd <absolute-clean-cwd>
  --image <absolute-neutral-image> ...
  --
  -
  ```

  All disable keys are exact `features.<name>=false` for `shell_tool`,
  `unified_exec`, `code_mode`, `code_mode_host`, `code_mode_only`,
  `multi_agent`, `apps`, `browser_use`, `browser_use_external`,
  `browser_use_full_cdp_access`, `computer_use`, `in_app_browser`,
  `image_generation`, `goals`, `hooks`, `skill_mcp_dependency_install`,
  `tool_suggest`, `tool_call_mcp_elicitation`, `deferred_executor`,
  `request_permissions_tool`, `standalone_web_search`, and `enable_mcp_apps`,
  followed by `web_search="disabled"`. Do not pass
  `tools.view_image=false`: CLI 0.144.6 rejects that unknown field under
  strict config. `--strict-config` makes every unknown remaining key fatal.

  Each attempt's clean cwd/HOME/CODEX_HOME/TMPDIR lives under a fresh
  `mkdtemp("/private/tmp/nap-v5-call-")`, outside every Git repository and
  ancestor `AGENTS.md`. The otherwise-empty model-visible cwd contains only
  regular `0444` copies of the frozen output schema and that slot's neutral
  image attachments under fixed names; prompt text arrives on stdin, and
  `packet.json`, condition, IDs, provenance, and outputs are never staged
  there. Chmod the cwd `0555` before spawn. Writable event/final output lives
  in a separate parent-owned directory outside the cwd. Child environment
  allowlist is host `PATH`, `SHELL`, `LANG`, and `LC_*`; set neutral absolute
  `HOME`, `TMPDIR`, and `CODEX_HOME`; omit all other variables.

  Create a fresh private `0700` `CODEX_HOME`, copy only the authenticated
  source `auth.json` into it as `0600`, and delete the entire attempt home after
  durable classification. This exact mechanism is accepted by
  `codex login status` on CLI 0.144.6; the earlier `/dev/fd/3` symlink proposal
  is forbidden because the pinned CLI returned `EBADF`/EOF. The isolated auth
  copy may be writable only inside this one ephemeral home so token refresh
  cannot mutate the source. Tests prove cleanup on success/error/signal and
  that credential bytes/source paths never enter argv, environment values,
  logs, requests, inventories, hashes, or durable artifacts. Never copy config,
  state, history, plugins, MCP, memories, rules, or sessions.

  Freeze `timeout_ms=1_200_000` and `termination_grace_ms=5_000`: send SIGTERM
  at timeout and SIGKILL only if still alive after the exact grace.

- [ ] **Step 8: Run adapter tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/codex-adapter.test.mjs`.
  Expected: one module-not-found failure for `codex-adapter.mjs`.

- [ ] **Step 9: Implement and verify the isolated adapter**

  Implement `buildCodexArgs`, `createFreshAttemptRuntime`, and
  `executeAttempt` with shell-free spawn, stdin prompt, exact image order,
  streaming raw stdout/stderr, timeout signals, secure single-file auth copy,
  and cleanup only of ephemeral clean/auth staging after durable
  classification. Rerun Step 8. Expected: exactly 18 tests pass, zero
  failures/skips and zero real calls.

- [ ] **Step 10: Freeze the honest no-tools boundary**

  Codex CLI 0.144.6 exposes no dedicated `--no-tools` switch. The fresh home,
  ignored config/rules, otherwise-empty read-only cwd containing only the frozen
  schema/images, and empty plugin/MCP configuration remove user-added tools;
  the predictor instruction forbids all tool calls and any structural tool
  event makes the slot terminal invalid. Preflight must record this exact
  adapter capability rather than claim a nonexistent hard switch. If a newly
  discovered supported config can remove the built-in tool surface without
  changing the model/runtime, test and freeze it before calls.

- [ ] **Step 11: Write 14 failing attempt-store/recovery tests**

  Claim an invocation under `sealed-attempts/inflight/<slot>/` exclusively.
  Stream sanitized `request.json`, raw `events.jsonl`, `stderr.bin`, and
  `final.raw.json` with `0600`, periodic/final fsync, then classify before
  atomic promotion.

  Recovery first validates any existing final bytes and events. A tool event
  still overrides; a complete valid final promotes as authoritative even when
  process/completion metadata is missing. Only no-valid-final incomplete
  journals become retryable `local_io_before_final`. Fatal auth/config/model
  results move unchanged to `environment-stops/<slot>/<opaque-id>/` and do not
  consume or claim `attempt-001..003`. Nonfatal journals promote atomically to
  the next attempt directory. `verifyAttemptRecord` re-derives and compares
  classification/hashes and never writes.

- [ ] **Step 12: Run attempt-store tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/attempt-store.test.mjs`.
  Expected: one module-not-found failure for `attempt-store.mjs`.

- [ ] **Step 13: Implement and verify immutable attempt recovery**

  Implement the exact journal/promotion/recovery contract, then rerun Step 12.
  Expected: exactly 14 tests pass, zero failures/skips.

- [ ] **Step 14: Run all Task 7 tests**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/{response-validation,event-classifier,codex-adapter,attempt-store}.test.mjs
  ```

  Expected: exactly 70 tests pass, zero failures/skips/warnings and zero real
  model calls.

### Task 8: Build three-attempt resume and the sealed overnight runner

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/slot-state.mjs`
- Create: `scripts/computer-use-nap-v5/lib/runner.mjs`
- Create: `scripts/computer-use-nap-v5/test/slot-state.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/runner.test.mjs`
- Modify: `scripts/computer-use-nap-v5/cli.mjs`

- [ ] **Step 1: Write 14 failing pure slot-state tests**

  Cover:

  - at most three attempts per slot;
  - immediate retry of retryable infrastructure before the paired slot;
  - first schema-valid final is authoritative absent tool use;
  - terminal invalid receives no retry;
  - three infrastructure failures yield terminal
    `infrastructure_failure`;
  - fatal environment error stops with the slot unchanged and resumes against
    identical locks after repair;
  - completed slots never overwrite;
  - partial/corrupt attempt artifacts fail closed; and
  - resume starts at the exact unfinished attempt.

- [ ] **Step 2: Run slot-state tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/slot-state.test.mjs`.
  Expected: one module-not-found failure for `slot-state.mjs`.

- [ ] **Step 3: Implement and verify the pure state machine**

  Implement next-attempt/terminal transitions without scoring or product
  interpretation. Rerun Step 2. Expected: exactly 14 tests pass, zero
  failures/skips.

- [ ] **Step 4: Write 24 failing runner/output-seal tests**

  Capture runner stdout/stderr. Assert prediction text, reasons, target IDs,
  condition joins, exact scores, and response bytes never appear. `status`
  exposes only slot/attempt ordinals, terminal state/classification, latency,
  and aggregate completion counts. Assert no scoring/adjudication/reveal file
  exists during execution.

  Before every first run and resume, require a full read-only verification of
  method lock, run lock, catalog, manifest, prepared inventory, every context,
  packet/image/schema/instruction/schedule, V4 donor inventory, and every prior
  attempt/terminal record. Any drift stops before creating an inflight journal.
  `all-slots-terminal.json` appears atomically only after all 30 slot records
  are terminal.

- [ ] **Step 5: Run runner tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/runner.test.mjs`.
  Expected: one module-not-found failure for `runner.mjs`.

- [ ] **Step 6: Implement resume and sealed commands**

  Add exact commands:

  ```text
  run           sequentially resumes until terminal/fatal stop
  status        sealed progress only
  verify-attempts  reclassifies/rehashes attempts without writing or revealing
  ```

  Each slot stores `attempt-001`, `attempt-002`, or `attempt-003` plus an
  immutable terminal slot record. Never delete a failed attempt or clean
  evidence needed for audit.

- [ ] **Step 7: Run runner tests and verify GREEN**

  Run the Step 5 command. Expected: exactly 24 tests pass, zero failures/skips
  using injected fake executors and zero model calls.

- [ ] **Step 8: Run all Task 8 tests**

  Run `node --test
  scripts/computer-use-nap-v5/test/{slot-state,runner}.test.mjs`.
  Expected: exactly 38 tests pass, zero failures/skips.

### Task 9: Generate and freeze the two blind adjudications

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/blind-ids.mjs`
- Create: `scripts/computer-use-nap-v5/lib/blind-worksheets.mjs`
- Create: `scripts/computer-use-nap-v5/lib/adjudication-lock.mjs`
- Create: `scripts/computer-use-nap-v5/test/blind-ids.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/blind-worksheets.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/adjudication-lock.test.mjs`
- Modify: `scripts/computer-use-nap-v5/cli.mjs`

- [ ] **Step 1: Write 14 failing HMAC/deduplication/order tests**

  Canonical HMAC input is length-prefixed UTF-8 fields:

  ```text
  uint32be(byteLength(domain)) || domain ||
  uint32be(byteLength(kind)) || kind ||
  uint32be(byteLength(canonicalIdentityJson)) || canonicalIdentityJson
  ```

  Candidate domain is `nap-v5/candidate/v1`; order domain is
  `nap-v5/order/v1`. `kind` is exactly `semantic` or `usefulness`.
  Full ID is lower-hex HMAC-SHA-256; display ID is the first 16 raw bytes
  encoded as 32 lower-hex characters. Order key HMACs the full 32 raw ID bytes
  with the order domain and kind, then sorts raw bytes lexicographically.
  Reject full-ID or display-ID collisions.

  Semantic identity is current-state SHA + normalized predicted target +
  canonical target revision. Usefulness identity is current-state SHA +
  normalized predicted full action. Prove every non-exact rank from every valid
  slot maps to semantic review, every prediction rank from every valid slot maps
  to usefulness review, and deduplicated join refs retain all slot/rank uses.

- [ ] **Step 2: Run blind-ID tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/blind-ids.test.mjs`.
  Expected: one module-not-found failure for `blind-ids.mjs`.

- [ ] **Step 3: Implement and verify blind IDs**

  Implement domain-separated IDs, deduplication, collision rejection, and
  frozen order. Rerun Step 2. Expected: exactly 14 tests pass, zero
  failures/skips.

- [ ] **Step 4: Write 12 failing worksheet/sealed-join tests**

  Assert `prepare-blind-adjudication` rejects any nonterminal schedule, lock
  drift, attempt drift, or missing completion marker. Before decision freeze it
  may expose only opaque candidate ID, permitted screenshot, canonical vs
  predicted target for semantic review, predicted structured action for
  usefulness review, and allowed decision field. It must hide condition, rank,
  slot, chronology, event/target IDs, observed action type, model reason, exact
  score, outcome, and join material.

  Exact output paths are:

  ```text
  blind/semantic/worksheet.json
  blind/semantic/images/<display-id>.png
  blind/usefulness/worksheet.json
  blind/usefulness/images/<display-id>.png
  evaluator/sealed-join/completed-semantic-worksheet.json
  evaluator/sealed-join/completed-usefulness-worksheet.json
  evaluator/sealed-join/join-map.json
  ```

  Each worksheet has exact `version`, `kind`, `candidates`, and
  `instructions`. Semantic candidate keys are `candidate_id`,
  `current_image`, `observed_target`, `predicted_target`, `decision`.
  Usefulness keys are `candidate_id`, `current_image`, `predicted_action`,
  `decision`. Decision starts null. The two completed worksheet paths do not
  exist until `freeze-adjudication`; it writes them exclusively with every
  validated decision filled and thereafter treats them as immutable. The
  sealed join has key hash plus ordered full/display IDs, order keys, normalized
  identity, `auto_exact` flag, and all evaluator slot/rank refs; it retains full
  IDs and never appears under `blind/`.

- [ ] **Step 5: Run worksheet tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/blind-worksheets.test.mjs`.
  Expected: one module-not-found failure for `blind-worksheets.mjs`.

- [ ] **Step 6: Implement and verify worksheet rendering**

  Implement `prepare-blind-adjudication` and sealed join persistence. Rerun
  Step 5. Expected: exactly 12 tests pass, zero failures/skips.

- [ ] **Step 7: Write 10 failing decision-freeze and reveal-gate tests**

  Semantic decisions are exactly `same_destination`, `different_destination`,
  or `uncertain`; action type is invisible and irrelevant. Usefulness decisions
  are exactly `useful`, `not_useful`, or `uncertain`. Require exactly one
  decision for every opaque ID, reject extras/duplicates, exclusively
  materialize and fsync both completed evaluator-only worksheets, hash them,
  and create an immutable adjudication lock. Reruns verify those exact bytes.
  `reveal-results` must refuse before this lock.

- [ ] **Step 8: Freeze the adjudication-lock schema**

  Exact keys are `version`, `adjudicator`, `semantic_worksheet_sha256`,
  `usefulness_worksheet_sha256`, `sealed_join_sha256`,
  `semantic_decision_counts`, `usefulness_decision_counts`,
  `completed_at_utc`, and `proxy_only`. `adjudicator` is exactly `dylan` or
  `codex_proxy`; `proxy_only` must equal whether the latter is used. A proxy
  lock cannot authorize an official product-band field.

- [ ] **Step 9: Run adjudication-lock tests and verify RED**

  Run `node --test
  scripts/computer-use-nap-v5/test/adjudication-lock.test.mjs`.
  Expected: one module-not-found failure for `adjudication-lock.mjs`.

- [ ] **Step 10: Implement decision freeze and the reveal gate**

  Add only:

  ```text
  prepare-blind-adjudication
  freeze-adjudication
  ```

  Exact semantic matches may be internally excluded from the semantic sheet,
  but no exact-score artifact becomes visible before freeze.
  `verifyAdjudicationGate` returns a verified in-memory join to Task 10 only
  after both durable completed worksheets and the immutable lock pass; it does
  not itself materialize revealed artifacts.

- [ ] **Step 11: Implement truthful adjudicator provenance**

  The frozen spec names Dylan as the authoritative semantic/usefulness judge.
  Dylan's blanket approval authorizes execution decisions, not fabrication of
  his subjective shortcut preferences. Preferred path: present only the blind
  worksheets for his decisions, freeze them, then reveal. If he is unavailable
  and the autonomy instruction remains controlling, use independent blinded
  Codex proxy adjudicators, store `adjudicator=codex_proxy`, and label every
  semantic/usefulness result and product conclusion as nonofficial sensitivity.
  Never write `adjudicator=dylan` without his actual decisions.

- [ ] **Step 12: Run adjudication-lock tests and verify GREEN**

  Run the Step 9 command. Expected: exactly 10 tests pass, zero failures/skips.

- [ ] **Step 13: Run all Task 9 tests**

  Run `node --test
  scripts/computer-use-nap-v5/test/{blind-ids,blind-worksheets,adjudication-lock}.test.mjs`.
  Expected: exactly 36 tests pass, zero failures/skips and no unblinded artifact
  can be generated early.

### Task 10: Implement every frozen scorer and the complete report

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/scoring.mjs`
- Create: `scripts/computer-use-nap-v5/lib/report.mjs`
- Create: `scripts/computer-use-nap-v5/test/scoring.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/report.test.mjs`
- Modify: `scripts/computer-use-nap-v5/cli.mjs`

- [ ] **Step 1: Write 36 failing scoring tests**

  Symmetrically normalize with NFKC, trim, lowercase, and collapsed internal
  whitespace only. Require complete accepted-variant component match and strict
  null shape; never remove punctuation/words/components or permit parent/child
  matches. Test semantic `uncertain` as different primary / same sensitivity,
  and usefulness `uncertain` as not useful primary / useful sensitivity.

  For both conditions, calculate scheduled and model-scorable denominators for:

  - semantic same-destination top-1/top-3;
  - structured normalized-exact target top-1/top-3;
  - action-type top-1/top-3;
  - structured exact-action top-1/top-3; and
  - shortcut-usefulness top-1/top-3.

  Invalid model outputs are incorrect/not useful in both denominators.
  Infrastructure failures remain in `/15 scheduled`, are excluded from
  model-scorable denominators, create no worksheet candidates, and make the
  pair `unscorable_pair`.

  Action-type success ignores target identity. Structured exact-action requires
  structured normalized-exact target plus the observed action type; it never
  substitutes semantic same-destination. Cover top-1/top-3 independently and
  primary paired wins/losses/ties using semantic top-3.

- [ ] **Step 2: Run scoring tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/scoring.test.mjs`.
  Expected: one module-not-found failure for `scoring.mjs`.

- [ ] **Step 3: Implement and verify all scorers**

  Implement `scoreSlot`, `aggregateConditions`, and `pairTargets`, importing the
  only normalizer from `identity.mjs`. Rerun Step 2. Expected: exactly 36 tests
  pass, zero failures/skips.

- [ ] **Step 4: Write 18 failing matrix/report/reveal tests**

  Render semantic top-1/top-3 and structured-exact top-1/top-3 pairs, all 15
  target rows, attempts, tokens, latency, invalid/retry counts, and five-target
  shallow/medium/deep bands marked descriptive/confounded. Require explicit
  disclosure of residual CLI tool-schema exposure and prohibit V3/V4 numerical
  comparison. After adjudication freezes, `reveal-results` may write the
  immutable machine-readable score package and a factual preliminary report;
  it must not require or invent a qualitative interpretation.

  Product interpretation is an explicit exact-key record, not a threshold
  function:

  ```text
  adjudicator, band, would_want_router, rationale
  ```

  `band` is one frozen band. Fewer than 12 scorable pairs forces it null.
  `demo-worthy` additionally requires `adjudicator=dylan` and
  `would_want_router=true`. A proxy record can populate only
  `proxy_sensitivity_interpretation`; official product band remains null. No
  function invents a band from metrics alone. `finalize-report` accepts the
  interpretation only after the immutable score package exists.

- [ ] **Step 5: Run report tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/report.test.mjs`.
  Expected: one module-not-found failure for `report.mjs`.

- [ ] **Step 6: Implement scoring reveal and later report finalization**

  Implement `validateInterpretationRecord`, `renderPreliminaryReport`, and
  `renderFinalReport`. Add:

  ```text
  reveal-results
  finalize-report --interpretation <absolute-json>
  verify-results
  ```

  `reveal-results` first calls Task 9's in-memory gate, joins sealed refs,
  scores, and exclusively writes exact machine-readable JSON plus
  `revealed/PRELIMINARY-REPORT.md`. It does not accept an interpretation.
  `verify-results` independently recomputes and compares every revealed score
  without writing. Only `finalize-report`, after score verification, writes
  `revealed/FINAL-REPORT.md`; proxy provenance produces only nonofficial
  sensitivity fields.

- [ ] **Step 7: Run report tests and verify GREEN**

  Run the Step 5 command. Expected: exactly 18 tests pass, zero failures/skips.

- [ ] **Step 8: Run all Task 10 tests**

  Run `node --test
  scripts/computer-use-nap-v5/test/{scoring,report}.test.mjs`.
  Expected: exactly 54 tests pass, zero failures/skips/warnings.

### Task 11: Prove the complete harness without spending a model call

**Files:**

- Create: `scripts/computer-use-nap-v5/lib/locks.mjs`
- Create: `scripts/computer-use-nap-v5/lib/preflight.mjs`
- Create: `scripts/computer-use-nap-v5/test/locks.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/preflight.test.mjs`
- Create: `scripts/computer-use-nap-v5/test/end-to-end.test.mjs`
- Modify: `scripts/computer-use-nap-v5/cli.mjs`
- Create at runtime: prepared evaluator/predictor trees, method/run locks, and
  all 30 frozen packets
- Update: `30-projects/computer-use-nap-build-log.md`
- Update:
  `30-projects/computer-use-nap-current-handoff-2026-07-28.md`

- [ ] **Step 1: Write 12 failing lock and inventory tests**

  Freeze these exact runtime paths:

  ```text
  evaluator/sealed-join/adjudication-key.bin
  locks/implementation-inventory.json
  locks/method-lock.json
  locks/run-inventory.json
  locks/run-lock.json
  ```

  `adjudication-key.bin` is exactly 32 random bytes, mode `0600`, claimed by
  exclusive create. A rerun verifies and reuses those exact bytes; it never
  regenerates or rewrites them. The lock records only its SHA-256.

  The implementation inventory contains sorted relative regular-file paths,
  byte lengths, and SHA-256 for all V5 source/tests/method files and rejects
  symlinks, special files, missing files, extras, or drift. The method lock has
  exact keys:

  ```text
  version, spec_sha256, implementation_inventory_sha256,
  v4_donor_inventory_sha256, predictor_instruction_sha256,
  prediction_schema_sha256, model, reasoning_effort, service_tier,
  codex_cli_version, codex_exec_help_sha256, bundled_model_catalog_sha256,
  bundled_model_instructions_sha256, debug_prompt_input_help_sha256,
  adapter_capability, timeout_ms, termination_grace_ms,
  preflight_receipt_sha256, created_at_utc
  ```

  The run inventory contains sorted relative paths, lengths, and SHA-256 for
  every frozen evaluator artifact, context, packet, image, prepared inventory,
  schedule, catalog, manifest, and selection. The run lock has exact keys:

  ```text
  version, method_lock_sha256, run_inventory_sha256,
  canonical_dataset_sha256, canonical_dataset_commit,
  recording_sequence_sha256, evidence_inventory_sha256,
  eligibility_ledger_sha256, target_selection_sha256,
  target_catalog_sha256, evaluator_manifest_sha256,
  prepared_inventory_sha256, schedule_sha256, packet_inventory_sha256,
  adjudication_key_sha256, target_count, slot_count, created_at_utc
  ```

  Tests require exclusive writes, byte-idempotent verification, immutable-key
  reuse, drift rejection, no secret bytes in either lock, V4 donor recheck, and
  refusal to freeze before an approved catalog, verified packets, complete
  test receipt, and passing preflight receipt.

- [ ] **Step 2: Run lock tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/locks.test.mjs`.
  Expected: one module-not-found failure for `locks.mjs`.

- [ ] **Step 3: Implement and verify lock creation**

  Implement `buildImplementationInventory`, `buildRunInventory`, `freezeRun`,
  and `verifyFrozenRun`. `freezeRun` accepts verified receipts as inputs; it
  does not itself prepare or mutate earlier artifacts. Rerun Step 2. Expected:
  exactly 12 tests pass, zero failures/skips.

- [ ] **Step 4: Write 14 failing no-model preflight tests**

  `runPreflight({ phase: "before-lock" })` verifies, without invoking a model:

  - canonical ledger bytes/hash/commit and the frozen V4 donor inventory;
  - all 31 explicit monitor-3 recording paths, total 103,005,033 bytes, source
    hashes, stream metadata, explicit predecessor edges, 1,092 rational-PTS
    frames, and no duration-inferred continuity;
  - FFmpeg/ffprobe 8.0, Node 24, Codex CLI 0.144.6, the four frozen CLI
    capability/help hashes, exact argv/config ordering, and strict-config
    acceptance through an actual `codex -a never exec --strict-config ...`
    parse that deliberately uses `/dev/null` as an invalid output schema and
    must stop locally with the pinned schema-parse error before any provider
    request, network access, or model call;
  - auth source readability and the tested fresh-`0700`-home / single-`0600`
    auth-copy construction without printing or hashing credential bytes,
    including guaranteed cleanup;
  - all 30 sanitized packet input renders, images, independent leakage checks,
    pair-identical current images, and zero evaluator/future-label leakage;
  - exact selected-target/schedule counts, sufficient disk/runtime permissions,
    and zero attempt/environment-stop/completion/adjudication/revealed
    artifacts; and
  - fresh internally spawned complete V5 and V4 suites with exact expected
    counts 398 and 119, captured exit status, output hash, and no model calls.

  Any mismatch is a named fatal preflight failure. The receipt contains only
  check names, pass/fail, public versions/hashes/counts, timestamp, and its own
  hash—never auth paths/bytes or prediction data. `phase: "after-lock"` also
  verifies both locks and still performs no model call.

- [ ] **Step 5: Run preflight tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/preflight.test.mjs`.
  Expected: one module-not-found failure for `preflight.mjs`.

- [ ] **Step 6: Implement and verify no-model preflight**

  Implement `runPreflight`, `validatePreflightReceipt`, and CLI command:

  ```text
  preflight --phase before-lock|after-lock
  ```

  Inject all process probes in tests. Rerun Step 5. Expected: exactly 14 tests
  pass, zero failures/skips and zero real model calls.

- [ ] **Step 7: Write 8 failing end-to-end tests**

  From a synthetic ledger/video corpus, execute compile → evidence review →
  target selection → catalog approval → packets → preflight → locks → 30 fake
  slots with valid/invalid/retry/fatal-resume cases → terminal seal → blind
  sheets → proxy decisions → adjudication lock → reveal → report. Mutate each
  trust-zone artifact in turn and prove the next stage fails before writing.
  Assert the final fake report has both scheduled and model-scorable
  denominators, proxy-only semantic/usefulness sensitivity, and no official
  product band.

- [ ] **Step 8: Run end-to-end tests and verify RED**

  Run `node --test scripts/computer-use-nap-v5/test/end-to-end.test.mjs`.
  Expected: failing assertions because the final CLI wiring does not exist.

- [ ] **Step 9: Add only tested integration wiring and verify GREEN**

  Keep `cli.mjs` a dispatcher. Add `freeze-run`, `verify-frozen`, and the
  remaining command wiring needed by the fake pipeline. Any new business rule
  discovered here first receives a focused failing unit test in its owning
  module. Rerun Step 8. Expected: exactly 8 tests pass, zero failures/skips and
  zero real model calls.

- [ ] **Step 10: Run the complete no-model suites**

  Run:

  ```bash
  node --test scripts/computer-use-nap-v5/test/*.test.mjs
  node --test screenpipe-datasets/blog-work-20260727/experiment-v4/test/*.test.mjs
  ```

  Expected: exactly 398 V5 tests and 119 V4 tests pass, with zero failures,
  skips, warnings, or model calls. V4 method-lock hash remains
  `55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa`.

- [ ] **Step 11: Independently review the complete implementation**

  Dispatch a spec-compliance reviewer, fix every blocking mismatch under TDD,
  and obtain approval. Then dispatch a separate code-quality/security reviewer,
  fix every blocking issue under TDD, and obtain approval. Re-run Step 10 after
  the final fix. Do not create real immutable preparation artifacts or locks
  until both reviews and the fresh full suites pass.

- [ ] **Step 12: Compile the real canonical corpus**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs compile-corpus
  ```

  Expected exit `0`; creates only `evaluator/corpus-snapshot.json` with 220
  retained rows, 196 accepted history rows, the frozen source hash/commit, and
  no model call.

- [ ] **Step 13: Recover and visually review all real evidence**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs prepare-evidence
  ```

  Expected exit `0`; creates the 31-file recording inventory, frame index,
  sanitized content-addressed PNGs, an evidence inventory entry for every 196
  accepted history rows, and full-resolution review sheets. Inspect every
  accepted row's before-state image at full resolution. Write one exact-key
  evaluator-only decision per row with `provenance=codex_visual_review`; never
  attribute those decisions to Dylan. Preserve automatic and final
  dispositions plus all applicable ordered reason codes.

  Freeze the completed decisions:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs freeze-evidence --decisions /Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history/evaluator/evidence-review-decisions.json
  ```

  Expected exit `0`; revalidates all 196 decisions, writes the final immutable
  evidence inventory/eligibility inputs, and reports at least 15 target-usable
  rows or stops before selection.

- [ ] **Step 14: Select and approve the real target catalog**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs select-targets
  node scripts/computer-use-nap-v5/cli.mjs approve-catalog --basis blanket_execution_authorization_2026-07-29
  ```

  Expected exit `0` for both; the first freezes final pool size `N`, midpoint
  positions `floor((i+0.5)*N/15)`, 15 chronological target IDs, and all
  eligibility reasons. The second accepts canonical-only target variants and
  records truthful approval basis without claiming Dylan manually reviewed
  aliases.

- [ ] **Step 15: Render and verify the 30 real predictor packets**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs prepare-packets
  node scripts/computer-use-nap-v5/cli.mjs verify-prepared
  ```

  Expected exit `0` for both; writes 15 contexts, 30 adjacent alternating
  slots, all packet/image hashes, and a prepared inventory. Each pair's current
  image is byte-identical. Every history packet contains all earlier accepted
  text rows and exactly ten most recent earlier usable image/history-ordinal
  pairs. No evaluator label or future action appears in predictor-safe bytes.

- [ ] **Step 16: Run the real before-lock preflight**

  Run the suites once visibly, then run the preflight, which independently
  repeats them and records its own receipts:

  ```bash
  node --test scripts/computer-use-nap-v5/test/*.test.mjs
  node --test screenpipe-datasets/blog-work-20260727/experiment-v4/test/*.test.mjs
  node scripts/computer-use-nap-v5/cli.mjs preflight --phase before-lock
  ```

  Expected: 398/398 V5 and 119/119 V4 tests pass, followed by exit `0` and a
  passing immutable preflight receipt. There must still be zero model attempts
  and no method/run/adjudication/result lock.

- [ ] **Step 17: Freeze the method and run exactly once**

  Only after Step 16 passes, run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs freeze-run
  node scripts/computer-use-nap-v5/cli.mjs verify-frozen
  node scripts/computer-use-nap-v5/cli.mjs preflight --phase after-lock
  ```

  Expected exit `0` for all three; exclusive creation of one 32-byte
  adjudication key, implementation/method/run inventories, method lock, and run
  lock, followed by independent byte/hash re-verification. No command invokes a
  model. Any rerun may only verify and reuse byte-identical frozen artifacts.

- [ ] **Step 18: Independently verify the frozen real run**

  Give a fresh reviewer only the authoritative spec, public source, prepared
  inventories, and lock paths—never the key bytes. Require an independent
  recomputation of source/inventory/lock hashes, packet counts, leakage checks,
  target schedule, zero-attempt state, and V4 donor hash. Fixing source or
  prepared bytes after this point is forbidden; a blocking mismatch invalidates
  the unrun V5 freeze and must stop for a new explicitly versioned run.

- [ ] **Step 19: Checkpoint the vault before inference**

  Update the build log/handoff with exact hashes, counts, test receipts,
  adapter/tool-surface limitations, `N`, selected targets, and the sole next
  command. Publish source/method notes if Git metadata writes are available;
  otherwise keep the verified vault files and record the sandbox blocker.

### Task 12: Run the official schedule through the final readout

**Files:**

- Runtime: `sealed-attempts/`, `locks/all-slots-terminal.json`, `blind/`,
  `locks/adjudication-lock.json`, and `revealed/`
- Create: `30-projects/computer-use-nap-v5-expanded-history-results-2026-07-29.md`
- Update: `30-projects/computer-use-nap-build-log.md`
- Update:
  `30-projects/computer-use-nap-current-handoff-2026-07-28.md`

- [ ] **Step 1: Start the sequential resumable run**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs run
  ```

  Expected: sequential execution of the frozen 30-slot schedule, with immediate
  allowed retries and no prediction text on stdout. Poll only:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs status --json
  ```

  at intervals below 60 seconds while supervised. Do not inspect sealed attempt
  payloads. On a fatal environment stop, repair only the external environment
  and rerun the identical `run` command; it must resume against the same locks.
  Never replace a target, packet, attempt, or terminal slot.

- [ ] **Step 2: Verify terminal accounting**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs verify-attempts
  node scripts/computer-use-nap-v5/cli.mjs status --json
  ```

  Expected exit `0`; all 30 slots terminal, every retry/attempt/hash/classifier
  result reconciled, and `locks/all-slots-terminal.json` present. If fewer than
  12 pairs are model-scorable, continue through the operational report while
  forcing the official product-band field null.

- [ ] **Step 3: Prepare the blind worksheets**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs prepare-blind-adjudication
  ```

  Expected exit `0`; creates only the two permitted blind worksheet trees and
  evaluator-sealed join map. It must not create any score, response table, or
  revealed artifact.

- [ ] **Step 4: Complete two independent blinded proxy worksheets**

  Because Dylan delegated autonomous completion but did not personally provide
  blind decisions, dispatch two fresh independent reviewers:

  - semantic reviewer receives only
    `blind/semantic/worksheet.json`, its referenced images, and the frozen
    semantic decision instructions;
  - usefulness reviewer receives only
    `blind/usefulness/worksheet.json`, its referenced images, and the frozen
    shortcut question/instructions.

  Neither reviewer may receive the spec, history condition, slots, ranks,
  results, sealed attempts, join map, catalog, or the other worksheet. Save
  exact ID/decision arrays to
  `/private/tmp/nap-v5-semantic-proxy-decisions.json` and
  `/private/tmp/nap-v5-usefulness-proxy-decisions.json`. Validate completeness
  and allowed values without revealing joins.

- [ ] **Step 5: Freeze truthful proxy adjudication**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs freeze-adjudication --adjudicator codex_proxy --semantic-decisions /private/tmp/nap-v5-semantic-proxy-decisions.json --usefulness-decisions /private/tmp/nap-v5-usefulness-proxy-decisions.json
  ```

  Expected exit `0`; exclusively writes the two immutable completed
  evaluator-only worksheets, hashes those exact bytes and the sealed join,
  writes `locks/adjudication-lock.json` with `proxy_only=true`, and still
  creates no revealed artifact. Never label these decisions as Dylan's.

- [ ] **Step 6: Reveal and verify the frozen score package**

  Run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs reveal-results
  node scripts/computer-use-nap-v5/cli.mjs verify-results
  ```

  Expected exit `0`; the first verifies the adjudication gate, materializes the
  exact machine-readable scores/matrices and
  `revealed/PRELIMINARY-REPORT.md` exclusively, and labels
  semantic/usefulness as proxy sensitivity. The second independently
  recomputes hashes, per-slot scores, both denominator families, paired tables,
  depth bands, retries, invalids, token usage, and latency without rewriting
  outputs. No qualitative band exists yet. Objective
  structured-exact/action/operational metrics are official; human semantic,
  usefulness, and official product-band fields are explicitly unavailable.

- [ ] **Step 7: Freeze the proxy-only interpretation and final report**

  After reading only the verified revealed score package, write
  `/private/tmp/nap-v5-proxy-interpretation.json` with exact keys
  `adjudicator`, `band`, `would_want_router`, and `rationale`.
  `adjudicator` is `codex_proxy`; select a frozen qualitative band only as
  sensitivity if at least 12 pairs are scorable; `would_want_router` is null
  because only Dylan can answer it. Then run:

  ```bash
  node scripts/computer-use-nap-v5/cli.mjs finalize-report --interpretation /private/tmp/nap-v5-proxy-interpretation.json
  node scripts/computer-use-nap-v5/cli.mjs verify-results
  ```

  Expected exit `0`; writes `revealed/FINAL-REPORT.md` with the proxy band only
  under `proxy_sensitivity_interpretation`, while the official product band
  remains null.

- [ ] **Step 8: Write the public result note**

  Lead with the exact result, then the paired matrix, semantic/exact
  differences, usefulness status, operational limitations, and what this says
  about the personalized top-three router. State plainly that proxy judgments
  are nonofficial sensitivity and do not answer whether Dylan would want the
  router. Do not overclaim statistical proof at `n=15` or numerically compare
  V3/V4.

- [ ] **Step 9: Run final verification**

  Use `superpowers:verification-before-completion`. Re-run the full V5 and V4
  test suites, `verify-frozen`, `verify-attempts`, and `verify-results`; run
  `git diff --check`; recompute canonical/method/run/adjudication/result hashes;
  and audit worktree status. Expected: 398/398 V5 and 119/119 V4 tests, all
  verification commands exit `0`, all 30 slots terminal, and no unexplained
  drift. Confirm `.obsidian/community-plugins.json` remains unstaged and
  untouched by this work.

- [ ] **Step 10: Independently review the final result package**

  Give a fresh reviewer the frozen spec, locks, public result note, and revealed
  machine-readable outputs. Require line-by-line metric recomputation and
  provenance/overclaim review. Fix only public reporting errors; never alter a
  frozen input, packet, attempt, decision, or score. Re-run Step 9 after any
  reporting correction.

- [ ] **Step 11: Publish the final checkpoint**

  Publish source, plan, public method/results notes, build log, and handoff when
  Git metadata writes are available. Keep raw media, packets, auth material,
  sealed responses, and private debug artifacts in the ignored canonical
  runtime. Prefer:

  ```bash
  npm run publish -- "experiment: publish V5 expanded-history results"
  ```

  Expected: commit and push succeed while
  `.obsidian/community-plugins.json` remains unstaged. Let GitHub Pages rebuild
  asynchronously without waiting. If Git metadata is still read-only, leave
  the complete verified result package in the vault, record the exact blocker,
  and do not misstate it as published.
