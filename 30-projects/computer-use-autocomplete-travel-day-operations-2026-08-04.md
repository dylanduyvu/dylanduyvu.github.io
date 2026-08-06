---
title: Computer-use autocomplete travel-day operations
date: 2026-08-04
status: active
---

# Computer-use autocomplete travel-day operations

## Current installed state

The installed system is an unsupervised runtime at source/tag `3c8619d`. Its
startup repair and provider-evidence inheritance are installed, but the
supervised forced-kill recovery failed on August 6. Both LaunchAgents are
disabled and removed. At the recovery checkpoint, runtime
`b4163a1b-5852-4be9-9153-f41fd2861c51`, PID `54520`, was `ready=true` with no
blockers and ledger integrity `ok`.

## Check health

Run this single command:

```sh
cd /Users/dylanvu/.config/superpowers/worktrees/computer-use-autocomplete/overnight-week-one-hardening && node src/cli.mjs status && node -e 'const fs=require("node:fs");const h=JSON.parse(fs.readFileSync(process.env.HOME+"/Library/Application Support/ComputerUseAutocompleteV0/state/health.json","utf8"));const age=Number(process.hrtime.bigint()-BigInt(h.updated_mono_ns))/1e9;console.log(JSON.stringify({heartbeat_age_seconds:Math.round(age*100)/100,heartbeat_fresh:age<=1.5}))'
```

Healthy means the first line has `"ready":true` and no blocker codes, while
the second line has `"heartbeat_fresh":true`. A heartbeat age above 1.5
seconds while the Mac is awake is unhealthy.

## Restart if unhealthy

Run this single command:

```sh
cd /Users/dylanvu/.config/superpowers/worktrees/computer-use-autocomplete/overnight-week-one-hardening && node src/cli.mjs stop --wait-ms 5000 && node src/cli.mjs run --background --wait-ready-ms 60000
```

The final output should report `"ready":true`. If it does not, stop there; do
not reinstall Hammerspoon, move the sanity tag, or start the successor
supervisor while traveling.

## Sleep, wake, and reboot

- Lid close pauses useful observation. After wake, wait a few seconds and run
  the health command.
- The installed `3c8619d` runtime may survive sleep/wake, but it has no
  watchdog. If it exits during sleep, wake, or ordinary work, it will not
  restart itself; use the restart command.
- A reboot does not automatically start the installed runtime. Use the restart
  command after login.
- The persistent offline indicator worked during the forced-kill test, but the
  replacement runtime never reached ready. Supervision is disabled and the
  lid-close recovery test remains deferred.

## Trial accounting

Only days with at least four qualifying live hours count. Vacation days below
four hours do not qualify. A dead runtime on such a day costs possible data; it
does not consume or fail a trial day. Overnight hours also do not count.

## Failed supervision checkpoint

`3c8619d` repaired the startup-witness crash, inherited the exact `cc40729`
provider qualification with byte-identical provider inputs, and passed
1,121/1,121 tests. The normal supervised startup reached ready. The physical
forced-kill test then proved the offline indicator but failed to produce a
healthy replacement runtime. The watchdog created the intended
`forced_kill_demo` attempt and later crash/wake attempts, none of which reached
the lock/ack boundary.

Do not run another forced-kill or lid-close test. First diagnose and repair the
replacement startup path under TDD; keep the current direct runtime running in
the meantime.

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
