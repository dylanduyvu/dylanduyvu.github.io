---
title: Computer-use autocomplete travel-day operations
date: 2026-08-04
status: active
---

# Computer-use autocomplete travel-day operations

## Current installed state

The installed system is the last-known-good unsupervised runtime at source
`ad18c9a`. The resilience/current-focus candidate `cc40729` is qualified but
not installed. Its cutover and forced-kill demonstration are deferred until
after vacation.

## Check health

Run this single command:

```sh
cd /Users/dylanvu/.config/superpowers/worktrees/computer-use-autocomplete/recovery-ad18c9a-20260804 && node src/cli.mjs status && node -e 'const fs=require("node:fs");const h=JSON.parse(fs.readFileSync(process.env.HOME+"/Library/Application Support/ComputerUseAutocompleteV0/state/health.json","utf8"));const age=Number(process.hrtime.bigint()-BigInt(h.updated_mono_ns))/1e9;console.log(JSON.stringify({heartbeat_age_seconds:Math.round(age*100)/100,heartbeat_fresh:age<=1.5}))'
```

Healthy means the first line has `"ready":true` and no blocker codes, while
the second line has `"heartbeat_fresh":true`. A heartbeat age above 1.5
seconds while the Mac is awake is unhealthy.

## Restart if unhealthy

Run this single command:

```sh
cd /Users/dylanvu/.config/superpowers/worktrees/computer-use-autocomplete/recovery-ad18c9a-20260804 && node src/cli.mjs stop --wait-ms 5000 && node src/cli.mjs run --background
```

The final output should report `"ready":true`. If it does not, stop there; do
not reinstall Hammerspoon, move the sanity tag, or start the successor
supervisor while traveling.

## Sleep, wake, and reboot

- Lid close pauses useful observation. After wake, wait a few seconds and run
  the health command.
- The installed `ad18c9a` runtime may survive sleep/wake, but it has no
  watchdog. If it exits during sleep, wake, or ordinary work, it will not
  restart itself; use the restart command.
- A reboot does not automatically start the installed runtime. Use the restart
  command after login.
- The successor's persistent offline indicator and supervised auto-restart are
  implemented but not installed. The lid-close recovery test is therefore
  deferred with its cutover.

## Trial accounting

Only days with at least four qualifying live hours count. Vacation days below
four hours do not qualify. A dead runtime on such a day costs possible data; it
does not consume or fail a trial day. Overnight hours also do not count.

## Deferred successor

`cc40729` passed 1,113/1,113 tests and a fresh 5/5 provider qualification. Its
cutover stopped because the required `observer_started` witness was never
emitted, although another candidate bridge record reached the correct event
file and the same launch context passed Accessibility/eventtap checks. The
remaining failure boundary is not observable from the frozen evidence, so no
guessing fix was made. This candidate is the first post-vacation cutover; do
not respend provider calls merely to repeat the same qualification.

The forced-kill command is already implemented but must not run until the
successor is installed and reaches supervised `ready:true`:

```sh
cd /Users/dylanvu/.config/superpowers/worktrees/computer-use-autocomplete/overnight-week-one-hardening && node src/cli.mjs supervise demo-kill
```

## Links

- [[computer-use-autocomplete-v0-design-2026-07-31|Computer-use autocomplete V0 design]]
- [[computer-use-autocomplete-v1-brainstorm-and-scope|Computer-use autocomplete V1 brainstorm and scope]]
