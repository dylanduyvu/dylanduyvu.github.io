---
type: project
status: active
created: 2026-07-24
updated: 2026-07-24
aliases:
  - Computer-use NAP walkthrough handoff
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - data-acquisition
  - capture-layer-v2
  - walkthrough
  - handoff
---

# Computer-use NAP walkthrough handoff

> [!summary] Authoritative continuation state
> The diagnostic walkthrough is paused cleanly after **12 of 30 accepted, immutable checkpoints**. The next unaccepted row is **`step-013`, Gmail Settings**. The interrupted segment was preserved as abort `abort-d6193439-e181-4dc7-99ea-aa50764b6d29`; its step-13 ledger attempt never reached a `ready` marker and contains no measured action. ScreenCaptureKit PID `94441` and Hammerspoon PID `97897` were stopped. Never repeat steps 1–12. Never resume the old recorder run. Start a fresh run at step 13 from the checkpoint controller’s literal command.

This note is the operational source of truth for handing the work to another agent. It records what the project is trying to prove, how the capture stack works, what has actually passed, what failed, the exact local artifacts, the current protocol drift, and the safe resumption procedure.

## Immediate handoff checklist

Before asking Dylan to perform another action, the next agent should:

1. Read this note in full.
2. Read the current local runbook at `/Users/dylanvu/Projects/computer-use-nap/spike/WALKTHROUGH.md`, but apply the corrections in [[#Known stale statements]] below.
3. Run the checkpoint-controller status command and require `accepted_count: 12` and `next_step: step-013`.
4. Inspect the repository without resetting or cleaning unrelated work.
5. Resolve the source-inventory drift described in [[#Critical provenance caveat]].
6. Implement and test the remaining browser validators as a batch before bringing Dylan back into the loop. At current HEAD, step 13 is supported, but step 14 is not.
7. Start a fresh Hammerspoon, ScreenCaptureKit, browser-storage, and ledger segment at step 13.
8. Give Dylan one fully disambiguated physical instruction at a time.
9. After each completed action, finish the ledger, export browser evidence when required, seal the checkpoint, and wait for the literal `CHECKPOINT SAVED` before presenting the next instruction.

Dylan has already spent most of a day on recorder setup and action-by-action debugging. His operating boundary is explicit: the remaining walkthrough is worth finishing if it can run cleanly in the next round, but not if it requires another half day of live patching. Batch validator work and synthetic rehearsal belong before Dylan returns.

## What this exercise is

The immediate 30-action walkthrough is a controlled **capture-component diagnostic**.

It asks:

> Across native applications, ordinary webpages, dynamic webpages, and cross-monitor actions, can the stack preserve enough exact, correctly timed evidence to reconstruct what Dylan did?

It is designed to measure:

- exact native Accessibility identity;
- exact browser DOM identity;
- physical click, key, scroll, and focus events;
- application and window consequences;
- a strictly pre-action image from each display;
- cross-source clock alignment;
- browser record completeness and sequencing; and
- failure modes that must be addressed before ordinary work is collected.

## What this exercise is not

This walkthrough does **not** test:

- whether Dylan’s next action is predictable;
- whether personal history improves prediction;
- whether an LLM understands Dylan;
- whether a top-three shortcut product is useful;
- whether fine-tuning beats retrieval;
- whether the product should be live;
- the formal blind `27/30` calibration;
- Niyant’s broader personalization thesis; or
- the enterprise market thesis.

The sequence remains:

1. prove the capture primitives;
2. finish this diagnostic walkthrough;
3. write the measured capture contract and Capture Layer v2 specification;
4. implement and freeze the formal harness;
5. run the later blind, scored 30-action calibration;
6. run a short natural-session segmentation and 50–100-action acquisition audit;
7. only then collect multi-day data and compare next-action predictors.

## Why the project moved to acquisition first

The original plan was to collect work history and compare next-destination predictions with zero, one, two, and three days of history. That prediction test remains the eventual product experiment.

The team identified a more load-bearing prerequisite: a prediction result is uninterpretable if the recorder cannot identify the action being predicted. A miss could mean the behavior was unpredictable, the model was poor, the event boundary was wrong, the semantic target was missing, or a supposedly pre-action image already contained the result.

### Screenpipe result

Screenpipe captured screens, OCR, Arc URLs, physical input, application changes, and window changes. It failed as the authoritative exact-target source:

- in a later natural session, only 78 of an estimated 150 physical clicks had direct role, name, and bounds;
- all 40 secondary-display clicks lacked direct semantic target fields;
- sampled Arc webpage clicks lacked authoritative DOM identities; and
- linked frames were not reliably strictly prior to the action.

Screenpipe remains useful historical context and optional label-side search material. It is not in the current capture gate.

### NAPsack result

NAPsack added click-time screenshots and Accessibility hit-testing, but its input handler and screenshot worker used incompatible monitor coordinate systems. The local installation was patched, and a tiny corrected sample mapped the secondary display correctly. Accessibility still identified only part of the meaningful targets, and NAPsack buffered only the display containing the cursor.

NAPsack is retired from Capture Layer v2. Its patch and old runs remain historical evidence.

### Capture Layer v2 pivot

No turnkey recorder supplied every required primitive. The project therefore assembled a small local stack from:

- Hammerspoon for physical input, application/window events, and Accessibility evidence;
- ScreenCaptureKit for one rolling visual stream per physical display;
- an Arc extension for browser navigation, DOM, and rrweb evidence;
- a passive action ledger; and
- an immutable per-action checkpoint controller.

### Six-action smoke

The clean smoke run `spike-20260724T191643Z-3e7c` passed every real-data checker gate. Its fixture suite independently triggered and detected all `54/54` modeled failure gates. The smoke proved that the components can work together on six named actions. It did not prove representative coverage.

## Current capture architecture

| Component | Authority | Main output | Important guarantees |
|---|---|---|---|
| Hammerspoon | Physical input, marker chords, frontmost app/window observations, Accessibility evidence | `<run-dir>/hs-events.jsonl` | Epoch microseconds and monotonic time; per-event display; run and action IDs; click-time element and actionable ancestors; focus snapshots; eventtap health |
| ScreenCaptureKit recorder | Both-display visual state | `<run-dir>/sck-cadence.jsonl` and freeze PNGs | One stream per physical display; complete frames only; one shared freeze time; frame strictly before freeze; no PTS fallback; decoded PNGs; exact PID and acknowledgment |
| Arc extension | Browser semantics | Downloaded `nap-spike-browser-*.ndjson` | `webNavigation`, DOM click/focus/scroll targets, top-frame document identity, rrweb viability, run ID, worker epoch, contiguous sequence numbers, serialized writes, zero declared write failures |
| `walkthrough_ledger.py` | Step-to-action binding | `<run-dir>/walkthrough-ledger.jsonl` | Passive and append-only; never sends input; snapshots the real action sequence; binds one real subsequent ready/freeze/terminal interval |
| `walkthrough_checkpoint.py` | Semantic acceptance and durable evidence checkpoint | `<session>/checkpoints/step-NNN/` | Validates the declared action; copies fixed evidence prefixes; includes both freeze PNGs and browser export when applicable; hashes every artifact; forms an ordered checkpoint chain |
| Session controller | Cross-run resumption | `<session>/session-events.jsonl` | Accepted steps survive later failures; aborts preserve partial runs; status supplies the authoritative next step and fresh-ledger command |

### Evidence flow for one accepted action

1. The app/page setup is prepared outside the measured interval.
2. Dylan sweeps the cursor across both monitors so both SCK streams have recent complete frames.
3. The assistant appends a ledger `begin` record for the exact manifest step.
4. Dylan presses `Control+Option+7`.
5. Hammerspoon mints the next real `action_id` and opens the measured interval.
6. Dylan presses `Control+Option+0`.
7. Hammerspoon signals the exact SCK PID with `SIGUSR1`.
8. SCK freezes the newest complete frame at or before one shared time from each display, writes verified PNGs, and acknowledges the freeze.
9. Dylan performs exactly one intended action.
10. Dylan waits for the declared result or deadline, then presses `Control+Option+8`.
11. The assistant finishes the ledger with `postcondition: observed` or `not-observed`.
12. For browser rows, the extension export is downloaded immediately.
13. The checkpoint controller validates the physical trigger, semantic target, consequence, freeze, run identity, and evidence integrity.
14. Only after `CHECKPOINT SAVED` may the next action be presented.

## Hardware and sealed preflight

### Display topology

| Logical display | macOS display ID | Global bounds | Role |
|---|---:|---|---|
| Primary | `1` | `x=0, y=0, width=1512, height=982` | MacBook display |
| Secondary | `3` | `x=-557, y=-1440, width=2560, height=1440` | External display where Dylan does most Arc, Codex, and Claude work |

Negative `y` is expected for the secondary display. Do not normalize it away or assume display numbering from another recorder.

### Sealed window identities

| Surface | Identity and sealed state |
|---|---|
| Primary Finder | Title `primary`; bounds `[0, 33, 1512, 444]`; display `1` |
| Secondary Finder | Title `secondary`; bounds `[-557, -1407, 922, 541]`; display `3` |
| Notes | Stable title prefix `Notes`; sealed bounds `[0, 475, 1512, 445]`; display `1` |
| Codex | Bundle `com.openai.codex`; sealed bounds `[723, -1410, 1280, 1410]`; display `3` |
| Arc | Window identifier `bigBrowserWindow-4D644DE7-8669-412F-B610-ABD1116F1E5F`; sealed bounds `[-557, -1410, 1280, 1410]`; display `3`; 100% page zoom |

The exact visual state may change before resumption. Treat these as sealed identities and preflight expectations, not permission to reuse stale coordinates without inspecting the live UI.

### Fixture files

The native Finder fixtures are under:

`/Users/dylanvu/napsack-runs/walkthrough-fixture/walkthrough-20260724T211941Z`

Each display’s fixture folder contains three harmless text files so the Finder window has stable content independent of ordinary user data.

## Canonical local artifacts and hashes

### Code

- Repository: `/Users/dylanvu/Projects/computer-use-nap`
- Branch: `main`
- Current HEAD: `42eb09e` (`test: validate Gmail settings walkthrough click`)
- Current validator:
  - path: `/Users/dylanvu/Projects/computer-use-nap/spike/walkthrough_checkpoint.py`
  - SHA-256: `0e423e0e90cd6e890e3045676311d5e8eb20fc84ad351afd392f2c5bff455732`
- Current validator test:
  - path: `/Users/dylanvu/Projects/computer-use-nap/spike/tests/test_walkthrough_checkpoint.py`
  - SHA-256: `766292af3d9cdf9c07f8afb32e3be27651753fe3e6a22fc80d9e58477c358812`
- Compiled SCK recorder SHA-256: `072562c4b2c4959664f8fa14e6d114b57dbe622cbf0fb0f8a07701ef3ab9ba33`

The project worktree also contains unrelated or pre-existing dirty files. Do not reset, clean, delete, or accidentally commit them:

- modified `docs/superpowers/specs/2026-07-23-hybrid-action-labeler-design.md`;
- untracked `docs/superpowers/plans/2026-07-24-stable-30-action-diagnostic-walkthrough.md`;
- untracked compiled `spike/sck-spike`; and
- generated `__pycache__` directories.

### Frozen walkthrough inputs

- Manifest SHA-256: `1b9a75f09d01b4fc605d7147cf34b59f59d7acf68cec68deef194ccb01fbe494`
- Preflight JSON SHA-256: `87a858e3319b8b49d76c56239056c8ff85ec86ea6eb945900a8352b0cac97792`
- Original source-inventory file SHA-256 recorded by preflight: `8547a26abac72ec641172654afe0fd0655eb718ee7a4d1360a2a45edac882e91`
- Current repository `spike/source-inventory.sha256` file SHA-256: `a17dc698cff07af13aac301905941bedbf058d5a6e36c6fcb9893f893e80bd54`
- Sealed preflight directory: `/Users/dylanvu/napsack-runs/walkthrough-preflight/walkthrough-20260724T235017Z-checkpoint`

### Checkpoint session

- Session directory: `/Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z`
- Session ID: `495ea7c0-5a76-4b3b-aa56-127074783b22`
- Accepted checkpoints: `12/30`
- Session events after the pause abort: `17`
- Next step: `step-013`
- Last accepted checkpoint SHA-256: `1e5aa50146c80af7e9522808ac75624a2dff5f7e7daa0f2316e3a0634dd1295b`
- Latest pause abort: `abort-d6193439-e181-4dc7-99ea-aa50764b6d29`

### Arc extension

- Source: `/Users/dylanvu/Projects/computer-use-nap/spike/arc-extension`
- Loaded extension ID: `lekbjgbaklbkncoijjblkgfhdfkblbpf`
- The extension’s local storage remains bound to an old run after pause. It must be cleared and rebound to the fresh run before resumption.

### Hammerspoon after pause

- `~/.hammerspoon/init.lua` is a symlink to `/Users/dylanvu/Documents/Codex/2026-07-21/https-handsdiff-github-io/.tmp-hammerspoon-init.lua`.
- That target currently contains only `require("hammerspoon-spike")`.
- Current init SHA-256: `17fc5e82c1a49893c8975bb882527d79cc96e9ae28683d8e95d485810ba53863`.
- Hammerspoon PID `97897` was stopped after the pause.
- The pre-run copy `hammerspoon-init-before.lua` has SHA-256 `29cd6164a5d976250cbf1f88994b1f1dde06ad111537a7918d4860a8ccdd0d27`, but it contains the old smoke driver as well as the spike. Do not restore that file for a measured run.

### Recorder after pause

- Last run directory: `/Users/dylanvu/napsack-runs/spike/spike-20260725T013642Z-c867`
- Last SCK PID: `94441`
- That exact process was stopped.
- Hammerspoon’s last marker in the run was `complete` for action sequence `1`, which belongs to accepted step 12.
- The step-13 ledger `begin` was recorded after that completion but before any new ready marker.
- The abort controller preserved fixed prefixes of the ledger, Hammerspoon, and SCK logs.

## Critical provenance caveat

The raw capture components still match the frozen source inventory. The current source-inventory check fails on exactly two files:

- `spike/walkthrough_checkpoint.py`
- `spike/tests/test_walkthrough_checkpoint.py`

Those files changed because the original checkpoint controller could not accept the exact real-world evidence produced by several native controls and browser targets. The fixes were made with regression tests as the walkthrough progressed.

Consequences:

1. The raw Hammerspoon, SCK, and Arc recorder evidence remains preserved and hash-addressed.
2. The 12 checkpoint directories are immutable and form a valid hash chain.
3. The semantic acceptance code did **not** remain one frozen version across all 12 steps.
4. The session’s preflight statement that browser rows fail closed is historically true of the original validator but superseded by validator version 2.
5. This run may support diagnostic component findings.
6. It must not be described as the later formal calibration run under one frozen runtime.

Before resuming, the recommended repair is:

1. implement the remaining browser-step validators in one batch;
2. run the complete Python, JavaScript, and mutation-fixture suites;
3. freeze and record the resulting commit and exact hashes;
4. revalidate the preserved checkpoints against that one validator version where practical;
5. record any acceptance change rather than editing or deleting old checkpoints; and
6. then resume physical collection from step 13.

Do not “fix” provenance by editing the immutable preflight or checkpoint files.

The sealed preflight names `bf11a6b` as its checkpoint-runtime commit and says browser rows fail closed. The live browser checkpoints were accepted only after later validator commits. Merely replacing two lines in the current `source-inventory.sha256` would make the repository check green but would not make the immutable preflight describe the later validator. The later runtime therefore needs its own explicit pin and revalidation record.

## Load-bearing measurement caveats already exposed

### Dual-display freshness is inconsistent

The smoke checker enforced a sub-second cross-display skew gate. The walkthrough checkpoint controller currently requires:

- two unique displays;
- one complete frame from each;
- attachment timestamps;
- each frame under five seconds old;
- no PTS fallback; and
- structurally decodable PNGs.

It does **not** reject a freeze whose two selected frames differ by more than one second. The first 12 accepted freezes measured:

| Step | Cross-display skew | Primary frame age | Secondary frame age |
|---|---:|---:|---:|
| 001 | 0.075 s | 0.021 s | 0.096 s |
| 002 | 1.616 s | 0.940 s | 2.557 s |
| 003 | 0.018 s | 0.020 s | 0.001 s |
| 004 | 0.033 s | 0.068 s | 0.035 s |
| 005 | 0.012 s | 0.753 s | 0.765 s |
| 006 | 0.076 s | 0.045 s | 0.122 s |
| 007 | 1.445 s | 1.093 s | 2.538 s |
| 008 | 3.765 s | 0.267 s | 4.033 s |
| 009 | 1.616 s | 0.252 s | 1.868 s |
| 010 | 1.725 s | 0.458 s | 2.184 s |
| 011 | 0.030 s | 0.054 s | 0.024 s |
| 012 | 3.086 s | 3.203 s | 0.117 s |

The cursor sweep improved some freezes but did not reliably create sub-second visual state on both displays. This does not invalidate the exact action and target evidence. It does mean that the first 12 rows do **not** establish consistently synchronized two-display decision context. The findings note and Spec B must either strengthen the freshness/skew gate or justify a different visual-capture mechanism.

ScreenCaptureKit currently records point-sized frames rather than Retina-native pixel density. That may be sufficient for semantic labeling, but the final Spec B must make the resolution choice explicit.

### Browser clicks are proven more strongly than browser outcomes

For supported browser rows, the current validator proves:

- one physical click in the declared interval;
- the correct display and coordinates;
- the exact actionable DOM target;
- the expected top-frame URL and document lineage;
- a parseable, complete, correctly sequenced export; and
- zero declared storage-write failures.

It does not independently require the declared UI postcondition. `postcondition: observed` is currently an operator record.

Step 11’s export contains a later `Main menu` focus record with `ariaExpanded: false`, and step 12’s export contains a later focus inside the advanced-search form. Those are useful corroboration, but the current semantic validator does not require them. A future formal validator should require a machine-checkable consequence when the action contract includes one.

## Verification state at pause

At current HEAD `42eb09e`, after the pause:

- `102/102` Python unit tests passed;
- `4/4` Arc recorder JavaScript tests passed;
- the base smoke fixture passed;
- all `54/54` single-gate mutation fixtures failed for the intended reason; and
- SCK binary hash verification passed.

The repository source-inventory command fails only on the validator and its test, for the disclosed post-freeze changes.

## Accepted checkpoint chain

All accepted rows recorded `postcondition: observed`. Every checkpoint copied its evidence prefix, two display-freeze PNGs, current-run record, and ledger. Steps 11 and 12 also copied the browser export. The `Previous checkpoint` link makes the sequence tamper-evident.

| Step | Intended and accepted result | Run/action | Accepted at, EDT | Checkpoint SHA-256 |
|---|---|---|---|---|
| 001 | Primary Finder: click Icon View; Icon View selected | `spike-20260725T000646Z-b47d:a1` | 20:12:58 | `bf526f9e6bf46e621e4c8d2e6813b091fd0a0952f0d8efc7200eadbd30a967e6` |
| 002 | Primary Finder: click List View; List View selected | `spike-20260725T000646Z-b47d:a2` | 20:14:03 | `10f76d3630ff6731beade23c4f1009f3848a182cc82b9b78c08e0238bc8849f3` |
| 003 | Secondary Finder: click Column View; Column View selected | `spike-20260725T001553Z-e0ce:a1` | 20:20:03 | `f672174dc62da69224470078a576935b2eaa29056959dba22437db54fc28d84e` |
| 004 | Secondary Finder: click Gallery View; Gallery View selected | `spike-20260725T002139Z-a099:a1` | 20:22:41 | `59684bc294dae8be1ea7073cc06275b4988f622d9dd379f743ad1121dcaf6c59` |
| 005 | Primary Notes: focus the search field | `spike-20260725T002139Z-a099:a2` | 20:30:18 | `4349487e5162b5de45e6602111bd37f388ced2b9247b8d2b0e0155c2fad24ced` |
| 006 | Secondary Codex: focus the prompt composer | `spike-20260725T002139Z-a099:a3` | 20:36:26 | `d53f2ab7f1ee540dba4b36505231fb570a4fe848fd006e90f9e578ad3dee0d14` |
| 007 | Primary: activate the sealed Finder window by its title bar | `spike-20260725T002139Z-a099:a4` | 20:38:05 | `557a8410ba1b9f34b96ea370057dfae32e98b0066bef7205b2de4d837832efce` |
| 008 | Primary: activate the sealed Notes window by its title bar | `spike-20260725T002139Z-a099:a5` | 20:41:02 | `b0a07f35307854934d2aedb214fa1e0285c6d61134486fcec98ab55de42c1cfe` |
| 009 | Primary Finder: press `Command+1`; Icon View selected | `spike-20260725T002139Z-a099:a6` | 20:42:31 | `d5c392d059777bf228d42480fe3e14e23dc8d613f7ef1d4f30a0525bc476b17b` |
| 010 | Primary Finder: press `Command+2`; List View selected | `spike-20260725T002139Z-a099:a7` | 20:43:53 | `5ee9ed7907c1363610353646741968993930d197a6dcbae0c1220f18ef841dc4` |
| 011 | Gmail: click exact `Main menu`; state changed from expanded to collapsed | `spike-20260725T011842Z-eda7:a1` | 21:24:45 | `27f299ad9f3765b35d0218cb85ed8a97631e4f45ff1cd1f78c6f95d474a80699` |
| 012 | Gmail: click exact `Advanced search options`; advanced-search UI opened | `spike-20260725T013642Z-c867:a1` | 21:41:14 | `1e5aa50146c80af7e9522808ac75624a2dff5f7e7daa0f2316e3a0634dd1295b` |

### Browser evidence proven by step 11

The extension preserved one exact top-frame Gmail `dom_click` on:

- `tag: DIV`;
- `role: button`;
- `ariaLabel: Main menu`;
- `ariaExpanded: true` before the click;
- physical screen coordinates `(-526, -1365)` on the secondary display;
- a stable tab, window, frame, document, run, worker-epoch, and sequence identity; and
- a later exact focus record with `ariaExpanded: false`.

The export contained 190 records across two worker epochs and declared `write_failures: 0`.

### Browser evidence proven by step 12

The extension preserved one exact top-frame Gmail `dom_click` on:

- `tag: BUTTON`;
- `role: button`;
- `ariaLabel: Advanced search options`;
- physical screen coordinates `(436, -1367)` on the secondary display;
- a target rectangle for the actual button rather than its nested icon;
- the exact Gmail inbox URL;
- a stable tab, window, frame, document, run, worker-epoch, and sequence identity; and
- a subsequent focus event inside the advanced-search form.

Hammerspoon’s physical click was within one pixel of the browser’s screen coordinate. The export declared `write_failures: 0`.

The export contained 310 records in one worker epoch. Hammerspoon’s immediate element was an `AXImage`, while its nearest actionable ancestor was the expected `AXButton`; the DOM recorder independently identified the exact button.

## Abort and repair history

Aborts are evidence, not discarded mistakes.

| Abort | Run | Reason | Consequence |
|---|---|---|---|
| `abort-d9ab8f1d-7a2b-46ca-a8ca-22c27523ad6e` | `spike-20260724T235548Z-280a` | The ready marker occurred while Notes, not the primary Finder fixture, was active. The declared setup was not proven. | No checkpoint accepted. Start a fresh run at step 1. |
| `abort-c23e9781-7cb9-4bac-805f-207ecf4be8f8` | `spike-20260725T000646Z-b47d` | Dylan omitted the completion chord after the intended step-3 click. Unrelated Codex input then entered the still-open interval. | Steps 1 and 2 remained sealed. The run was preserved and replaced. |
| `abort-f5613b5f-a0d1-49a7-95d3-d8a6511a1a7a` | `spike-20260725T001553Z-e0ce` | A completed step-3 retry was initially rejected for missing authoritative pre-trigger source-window evidence. | The raw run was preserved. The validator was repaired; step 3 later sealed from the preserved evidence. |
| `abort-d6193439-e181-4dc7-99ea-aa50764b6d29` | `spike-20260725T013642Z-c867` | Dylan paused after accepted step 12. A step-13 ledger begin existed, but no ready marker, freeze, click, or completion occurred. | Clean pause. Step 13 remains next. SCK and Hammerspoon were stopped. |

## Why per-action checkpoints were added

The initial live procedure treated the 30 actions as one monolithic run. A missed marker or ambiguous setup could have forced Dylan to repeat every prior action. Dylan explicitly objected after spending substantial time reaching the early rows.

The workflow was changed so every verified action becomes its own immutable checkpoint:

- a later mistake cannot invalidate accepted work;
- a recorder failure closes only the current segment;
- the session status derives the next unaccepted step;
- accepted evidence is copied at a fixed byte prefix;
- each checkpoint links cryptographically to the previous checkpoint; and
- a replacement run starts at the first absent step.

This change is the reason steps 1–12 do not need to be repeated.

## Remaining frozen action manifest

The exact 30-action manifest is frozen. The statement in the older walkthrough note that targets were not yet frozen is obsolete.

| Step | Category | Intended action | Declared result | Current validator readiness |
|---|---|---|---|---|
| 013 | Ordinary Arc | Gmail: click `Settings` | Quick-settings panel visible | Supported and tested at `42eb09e` |
| 014 | Ordinary Arc | Gmail: click `Support` | Support UI visible | **Not yet supported** |
| 015 | Ordinary Arc | Gmail: click `Google apps` | Google apps UI visible | **Not yet supported** |
| 016 | Ordinary Arc | Gmail: focus mail-search input | `input[name=q]` focused | **Browser focus validator not yet supported** |
| 017 | Ordinary Arc | HN login: focus non-creating username input | Exact username input focused | **Browser focus validator not yet supported** |
| 018 | Ordinary Arc | HN login: focus non-creating password input | Exact password input focused | **Browser focus validator not yet supported** |
| 019 | Ordinary Arc | HN: click top-navigation `new` | Final path exactly `/newest` | **Browser navigation validator not yet supported** |
| 020 | Ordinary Arc | HN: click top-navigation `comments` | Final path exactly `/newcomments` | **Browser navigation validator not yet supported** |
| 021 | Dynamic Arc | X: click `More` | More menu visible | **Not yet supported** |
| 022 | Dynamic Arc | X: click navigation-rail `Post` without submitting | Composer visible; no submit | **Not yet supported** |
| 023 | Dynamic Arc | X: click Account menu | Account menu visible | **Not yet supported** |
| 024 | Dynamic Arc | X Explore: focus Search | Declared Search input focused | **Browser focus validator not yet supported** |
| 025 | Dynamic Arc | X: click Explore | SPA path `/explore` | **Browser navigation validator not yet supported** |
| 026 | Cross-monitor | Cursor starts secondary; click primary Finder Icon View | Primary Icon View selected and Finder active | Generic native click path exists; must rehearse |
| 027 | Cross-monitor | Primary Finder active; click secondary Codex composer | Codex composer focused and Codex active | Generic native focus path exists; regression test exists |
| 028 | Cross-monitor | From primary Finder, press one `Command+Tab` | Sealed secondary Arc window active | Command-switch path exists; must rehearse exact MRU state |
| 029 | Cross-monitor | From secondary Arc, click primary Finder title bar | Primary Finder active | Generic app-switch click path exists; regression test exists |
| 030 | Cross-monitor | Arc on secondary, cursor on primary; press `Command+R` | Same HN URL commits a new top-frame document | **Browser key/navigation validator not yet supported** |

Do not prompt an unsupported action and then patch the validator against Dylan’s live attempt. Add synthetic fixtures and regression tests first.

## Exact safe resume procedure

### Phase 1: batch preparation without Dylan

1. Inspect the repository:

   ```bash
   cd /Users/dylanvu/Projects/computer-use-nap
   git status --short --branch
   git log -1 --oneline
   ```

2. Preserve the current dirty worktree. Do not use `git reset --hard`, `git checkout --`, `git clean`, or broad deletion.

3. Add semantic support for the remaining browser actions before physical collection:

   - exact Gmail `Support` and `Google apps` clicks;
   - exact browser focus targets;
   - exact HN committed navigation;
   - dynamic X controls and SPA navigation; and
   - the cross-monitor Arc reload.

4. Test each new action with a failing fixture first, then implement the smallest validator behavior that accepts the intended identity and rejects nearby controls, wrong URLs, subframes, multiple physical triggers, wrong display, write failures, and sequence loss.

5. Run:

   ```bash
   python3 -m unittest discover -s spike/tests -v
   node --test spike/tests/test_arc_extension_recorder.js
   python3 spike/fixtures/make_fixtures.py
   ```

6. Freeze the final validator runtime once. Record the git commit and exact hashes in a new provenance note or session event. Do not rewrite the original immutable preflight.

7. Revalidate the preserved 12 checkpoints with the frozen final validator where practical. Record deltas; do not replace old checkpoint files.

### Phase 2: inspect authoritative session state

Run:

```bash
python3 /Users/dylanvu/Projects/computer-use-nap/spike/walkthrough_checkpoint.py status \
  --session-dir /Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z
```

Expected state:

```json
{
  "accepted_count": 12,
  "complete": false,
  "next_step": "step-013",
  "status": "in-progress",
  "total_steps": 30
}
```

The same output supplies this authoritative ledger command:

```bash
python3 /Users/dylanvu/Projects/computer-use-nap/spike/walkthrough_ledger.py init \
  --manifest /Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z/manifest.json \
  --preflight /Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z/preflight.json \
  --preflight-hash /Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z/preflight.sha256 \
  --run-dir <FRESH_RUN_DIR> \
  --start-step step-013
```

Copy that literal command from live status rather than reconstructing it from memory.

### Phase 3: mint a fresh recorder run

1. Confirm the resolved Hammerspoon init contains only:

   ```lua
   require("hammerspoon-spike")
   ```

2. Launch or reload Hammerspoon once.
3. Read `~/napsack-runs/spike/current-run.json`.
4. Require a new run ID, `action_seq: 0`, `last_marker: "none"`, and a fresh directory containing only startup evidence.
5. Start the verified SCK binary copied into the sealed preflight:

   `/Users/dylanvu/napsack-runs/walkthrough-preflight/walkthrough-20260724T235017Z-checkpoint/sck-spike`

6. Record its exact PID.
7. Require the printed run ID and `<fresh-run-dir>/sck.pid` to match Hammerspoon’s fresh run.
8. Never use `pkill`. Stop only the exact recorded PID.

### Phase 4: bind and prove browser recording

In the nap-spike extension service-worker console:

```js
await chrome.storage.local.clear()
await chrome.storage.local.set({run_id: "PASTE_FRESH_RUN_ID"})
await chrome.storage.local.get(null)
```

Then:

1. Reload the unpacked extension from `/Users/dylanvu/Projects/computer-use-nap/spike/arc-extension`.
2. Reload Gmail and every other measured page **after** binding the new run.
3. Confirm the browser store contains no old `log:` chunks.
4. Confirm the top frame emits `rrweb_started` under the new run ID.
5. Initialize the new ledger from the checkpoint controller’s exact command.

Hard-won rule: reloading or updating the unpacked extension invalidates content scripts already injected into open pages. A page that is not reloaded afterward may look normal while producing no DOM evidence.

### Phase 5: run one action

For each action:

1. Inspect the live UI and prepare every declared precondition outside the measured interval.
2. The instruction must name:
   - the monitor;
   - the app;
   - the exact window or page;
   - the exact control;
   - a spatial landmark; and
   - any similar control Dylan must not click.
3. Run ledger `begin`.
4. Ask Dylan to sweep both monitors, ending over the target surface.
5. Dylan presses and releases `Control+Option+7`.
6. Dylan presses and releases `Control+Option+0`.
7. Confirm one matching `freeze_signal` and `freeze_ack`, both `ok: true`.
8. Dylan performs exactly one intended action.
9. When the declared result appears or its deadline expires, Dylan presses and releases `Control+Option+8`.
10. Run ledger `finish` with `observed` or `not-observed`.
11. If it is a browser row, export immediately from the extension.
12. Run checkpoint `seal`.
13. Inspect the literal result.
14. Continue only after `CHECKPOINT SAVED`.

### Step 13’s exact instruction

After the fresh-run and browser checks pass:

1. Reset Gmail to `https://mail.google.com/mail/u/0/#inbox`.
2. Close Advanced search and Quick settings outside the interval.
3. Verify Gmail’s `Settings` control is visible.
4. Run ledger `begin` for `step-013`.
5. Tell Dylan:

   > Sweep across both monitors, ending over Gmail on the external monitor. Press and release Control + Option + 7. Press and release Control + Option + 0. Wait two seconds. In Gmail’s top-right header, click the Settings gear between the Support question mark and Ask Gemini. Do not click Arc’s settings. Confirm Gmail’s Quick settings panel opens on the right. Press and release Control + Option + 8. Say done.

6. Finish the ledger and export browser evidence.
7. Seal step 13.

## Failure and resumption procedure

On a recorder error, wrong setup, extra action, missed marker, failed freeze, unsupported validator, browser write/sequence failure, wrong target, or other ambiguity:

1. Stop. Do not ask Dylan to continue.
2. Record the current segment abort:

   ```bash
   python3 spike/walkthrough_checkpoint.py record-abort \
     --session-dir /Users/dylanvu/napsack-runs/walkthrough-sessions/walkthrough-20260724T235713Z \
     --ledger <fresh-run-dir>/walkthrough-ledger.jsonl \
     --reason "<specific reason>"
   ```

3. Read `<fresh-run-dir>/sck.pid`.
4. Confirm it is the exact launched recorder PID.
5. Stop that PID only.
6. Preserve the run directory and all evidence.
7. Stop or reload Hammerspoon so the failed segment stops logging.
8. Run checkpoint `status`.
9. Start a fresh segment at the unchanged `next_step`.
10. Never repeat an accepted checkpoint.

If Dylan makes a genuine input mistake after ready but before complete, he should press `Control+Option+9` rather than complete. The ledger can then record a bounded invalidation. Do not use invalidation to hide recorder or validator failures.

## Known stale statements

### Local `spike/WALKTHROUGH.md`

It says browser steps 11–25 cannot seal. That was true before browser-validator work. Current code supports only these exact Gmail click labels:

- `Main menu`;
- `Advanced search options`; and
- `Settings`.

The same runbook is still correct about fresh runs, exact PIDs, marker order, immutable checkpoints, browser export, and abort/resume mechanics.

### Immutable preflight

The preflight also records the original fail-closed browser limitation. Do not edit it. Treat it as a historical description of the frozen starting validator.

### Older vault notes

Older sections describe Screenpipe plus patched NAPsack with conditional browser instrumentation. That was the acquisition plan before the Capture Layer v2 spike. The current diagnostic stack is Hammerspoon plus dual SCK plus mandatory Arc evidence. The older evidence remains useful for explaining the pivot.

## Hard-won implementation gotchas

### Dual-monitor behavior

- The secondary display is above and left of the primary in global coordinates.
- Dylan does most relevant work on the secondary display.
- A recorder that labels only the primary display is unusable for the product target.
- Keyboard actions cannot be assigned to the display containing the cursor; source and destination must come from the actual focused surface and declared action.
- Sweep both displays before ready because a visually static display may not produce a recent SCK frame.

### ScreenCaptureKit

- One process owns one stream per physical display.
- Accept complete frames only.
- Reject PTS fallback.
- Reject duplicate display IDs, stream errors, stale frames, unmatched freeze cardinality, or missing PNGs.
- Decode PNG structure rather than accepting file existence.
- Freeze by exact PID and wait for the acknowledgment file.
- Never use broad `pkill`.

### Hammerspoon and Accessibility

- Marker hotkeys are global and physically pressed by Dylan.
- The ledger and assistant must never synthesize them.
- Clicks need exact element-at-point and actionable-ancestor evidence.
- The correct focus element may appear after mouse-up or after an application activation delay.
- Same-window title changes do not necessarily create a new window lineage.
- Accessibility notification failures must be explicit.
- Tap health is load bearing; disabled taps or missing heartbeats fail the run.

### Arc extension

- Browser storage must be isolated by run ID.
- Storage writes and export flushing must be serialized and awaited.
- Records need worker epoch plus sequence.
- Missing, duplicate, malformed, or unwritten records fail closed.
- Correlate browser evidence by run ID, exact physical action window, screen coordinates, and top-frame document identity.
- The browser does not have a real Hammerspoon `action_id`; do not claim it does.
- Reload every measured page after extension reload or run rebinding.
- Export after each browser action so one later extension failure cannot erase several accepted attempts.

### Human operation

- Setup actions never belong inside ready-to-complete.
- “Click the second Finder button” is ambiguous across two displays. Name the app, monitor, window, control, spatial landmark, and exclusion.
- If the intended postcondition fails, record `not-observed`; do not silently redo the action.
- A correct physical action can still fail the diagnostic if the recorder evidence is incomplete.
- Dylan’s qualitative product judgment is later. This walkthrough is about whether the evidence exists.

## Privacy boundary

The raw action logs, browser exports, screenshots, and freeze PNGs remain outside the public vault under `~/napsack-runs`. They can contain private screens, email text, URLs, and typed material.

This public handoff records only:

- architecture;
- local artifact paths;
- hashes and IDs;
- intended manifest targets;
- pass/fail status;
- operational commands; and
- non-sensitive diagnostic findings.

Do not copy raw browser exports, screenshots, OCR, email rows, credentials, private messages, or session data into this public Git repository.

## What completion of 30 means

Finishing all 30 rows will establish only that the selected components produced inspectable evidence across the declared diagnostic surface. The findings note should then report:

- exact native target coverage;
- exact browser target coverage;
- focus and app-switch consequence coverage;
- page-navigation coverage;
- cross-monitor correctness;
- freeze completeness and age;
- clock skew;
- tap and stream health;
- browser sequence/write integrity;
- component verdicts of `ADOPT`, `ADOPT-WITH-CAVEAT`, or `REJECT`; and
- all runtime/protocol deviations, including the validator drift.

It will not be a product or prediction result.

## What follows after the walkthrough

1. Write the component findings note.
2. Write a tool-agnostic capture contract using measured constants.
3. Draft Capture Layer v2 Spec B.
4. Audit the contract and spec once.
5. Implement and freeze the formal blind-calibration harness.
6. Run the formal 30-action calibration with:
   - all 30 rows retained;
   - at least 27 exact targets overall;
   - at least 9/10 native targets;
   - at least 14/15 web targets;
   - at least 4/5 cross-monitor targets; and
   - zero silent losses.
7. If it passes, run the natural-session acquisition audit.
8. Only then return to the retrospective next-action prediction experiment.

## Related notes

- [[computer-use-nap-30-action-walkthrough-2026-07-24|Computer-use NAP: what the 30-action walkthrough is]]
- [[computer-use-nap-build-log|Computer-use NAP build log]]
- [[computer-use-nap-capture-layer-v2-plan-2026-07-24|Computer-use NAP: capture layer v2 plan]]
- [[computer-use-nap-shadow-experiment|Computer-use NAP shadow experiment]]
- [[personal-ai-context-learning|Personal AI Context Learning]]
- [[computer-use-capture-tool-research-2026-07-24|Computer-use capture-tooling deep survey, July 24, 2026]]
