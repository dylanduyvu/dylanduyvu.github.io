---
title: Computer-Use Autocomplete Living Spec
type: project-spec
status: superseded
created: 2026-08-11
last-full-verify: 2026-08-11
superseded: 2026-08-12
---

# Computer-Use Autocomplete: Living Spec

> [!warning] Superseded duplicate
> This draft stops before the semantic cutover and is retained only as historical
> evidence. The sole current architecture document is
> [[computer-use-autocomplete-product-spec|Computer-use autocomplete: living
> product spec]]. Do not use the claims below as running-state truth.

This is the one document that answers three questions at all times: what this product is, what is actually running right now, and why every piece of the stack is the way it is.

**How this document was built and verified.** Written 2026-08-11 by Claude (chat agent) from the full project conversation record, the builder agent's dated reports, and these files read directly from disk: the excluded-session gate sheet, the excluded-session runbook, the suppressed-suggestions audit, the Saturday wiring checklist, and the window 1 and window 2 verdict reports. Claims about code internals that were not independently re-read from source are marked **UNVERIFIED against code**. Every section carries a stamp naming what it was verified against.

**Reading guide.** Sections 1 and 2 explain the product in plain terms. Section 3 is current state. Section 4 justifies every component. Section 5 is the dated decision log. Sections 6 to 8 are open questions, glossary, and the maintenance rule.

---

## 1. What This Is

An ambient "action autocomplete" for the Mac. The system watches for a natural pause in Dylan's work. When it believes it knows the next step, it shows a small one-line suggestion bubble (the "pill"), for example: "Open Slack and jump to the unread thread." Pressing Tab makes the computer do that step. Ignoring the pill costs nothing; it just expires. Escape dismisses it or hard-aborts an action in progress. Any consequential step (anything send-, submit-, or delete-shaped) is never executed on the first Tab: the system walks up to it, stops, and requires a deliberate second Tab.

The model for the interaction is [Cotypist](https://cotypist.app), a Mac app that autocompletes your typing anywhere with Tab. This product does the same thing for actions instead of words.

*Stamp: verified against the project's own founding conversation, 2026-08-09 to 2026-08-11.*

## 2. The Loop

```
observer (watches input + windows)
   → trigger (pause detected, or manual hotkey)
      → predictor (one model call: promise + 1 to 5 concrete actions)
         → pill (one-line promise on screen)
            → first Tab (user accepts)
               → executor (fresh screen read before EVERY action, then act)
                  → consequential gate (held boundary)
                     → second Tab (release) or Escape (freeze and stop)
```

Two separate speed budgets matter and should never be conflated:

- **Prediction speed**: how fast a pill appears after a pause. Currently about 6 seconds live (see section 3). Proven not to be the binding constraint for ambient suggestions, because an absent pill is invisible; nobody experiences its lateness, only its arrival.
- **Execution speed**: how fast the step completes after Tab. This is where slowness is felt, and where correctness matters far more than speed.

*Stamp: loop shape verified against the builder's window-ready report and click-only design doc, 2026-08-11.*

## 3. What Runs Today (2026-08-11)

| Layer | State | Identity | Stamp |
| --- | --- | --- | --- |
| Live runtime "V0" | Running, frozen for the baseline trial. Catalog pills only: switch app, focus window, focus Codex task, open web address. No typing, no clicking. | Source `1d189e41ea5203cb0ed96586331fd4dc5a721bd8` | Verified against post-window-2 recovery report |
| Baseline trial | Began Sat 2026-08-08 12:27 PM ET, accounting cutoff Sat 2026-08-15 12:27 PM ET. Two qualifying days so far (Saturday, Monday). | n/a | Verified against telemetry report 2026-08-10 |
| Staged candidate | Semantic click-only predictor + executor + safety gate. Built, heavily tested, fail-closed. Cannot launch without a signed authorization chain that does not exist yet (Task 6). | Spike repo commit `e6654d0643…` (82/82 spike suite); candidate worktree at `9daade62…` era plus hardening commits, 1,400+ tests | UNVERIFIED against code; verified against builder reports only |
| Actuator ("hands") | None working. Bridge hands proven dead in window 2. Replacement head-to-head (macos-use vs axcli) in flight as window 3. | n/a | Verified against window 2 verdict + window 3 kickoff |
| Quarantined | Task 6 cutover controller (failed review, commit `59da61b…`); structured provider path (schema rejections); bridge hands; any control of the ChatGPT app (the bridge forbids driving its own host). | n/a | Verified against builder reports |

**Live telemetry snapshot (Monday 2026-08-10).** 225 opportunities, 61 predictions returned, 162 cancelled because Dylan resumed before they finished (72 percent waste; fix staged, see 4.4), 53 pills shown, 6 accepted, 17 dismissed, 23 expired, 7 withdrawn. Median request-to-return latency 6.18 seconds. 877 suppressions for "unknown focus." Known live bug: manual trigger sometimes produces no pill, or a pill that flashes and vanishes.

*Stamp: verified against the builder's read-only telemetry report, 2026-08-10 9:00 PM.*

## 4. Stack, With Justifications

Each component: the decision, why, what was rejected, and the evidence.

### 4.1 Interaction grammar: pill + Tab-while-visible + free ignore + Escape

**Decision.** A small non-focus-stealing pill; Tab is intercepted only while the pill is visible; ignoring costs nothing; Escape always dismisses or aborts.
**Why.** Copied from what makes Cotypist feel good: the suggestion must never tax the user. An interruption you can ignore for free is a feature; one you must manage is spam.
**Rejected.** Always-intercepting hotkeys (breaks Tab system-wide); chat-style windows (steal focus and attention).
**Evidence.** Cotypist's design; live trial data showing 17 active dismissals in one day,
