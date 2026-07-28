---
type: source
status: frozen
created: 2026-07-28
updated: 2026-07-28
aliases:
  - Computer-use NAP smoke harness V2
projects:
  - personal-ai-context-learning
domains:
  - personalized-ai
  - human-computer-interaction
  - next-action-prediction
tags:
  - computer-use
  - next-action-prediction
  - experiment
  - source-code
---

# Computer-use NAP smoke harness V2

This directory is the exact pre-call source snapshot for
`BLOG-SMOKE-20260728-V2`, frozen on July 28, 2026. It accompanies
[[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|the
experiment plan]] so the implementation can be inspected independently of the
private runtime.

## What is included

- the frozen 20-row manifest, including target fields, timestamps, evidence
  paths, and evidence hashes;
- the predictor instruction and JSON response schema;
- packet rendering, scheduling, Codex invocation, attempt persistence,
  run-lock, orchestration, and scoring source;
- all local Node.js tests; and
- `SHA256SUMS`, covering every published harness file except itself.

The snapshot is purpose-built for this experiment. It contains Dylan's
candidate IDs, workflow labels, player timestamps, and absolute local paths.
Those details are intentionally public as part of the experiment audit, but
the underlying screen contents are not.

## What is deliberately excluded

- Screenpipe recordings;
- all before-state screenshots and other evidence images;
- rendered packets and prompts;
- the generated `target-contract.json`;
- the 40-image Codex debug artifact, which embeds screenshots as base64;
- `run.json`, target contracts, attempts, labels, event logs, final model
  responses, scores, and reports; and
- the private Codex runtime home, caches, installation state, and
  authentication link.

No credential or authentication bytes are present in this snapshot. Do not
copy future run artifacts into this public directory.

## Reproduction boundary

The canonical private harness passed `190/190` tests before the immutable
pre-call freeze. Every copied source, test, manifest, instruction, and schema
file is verified against its SHA-256 in the private immutable `run.json`, not
merely against the current working copy.

The test suite can be rerun on Dylan's machine because the manifest's evidence
paths resolve there:

```bash
node --test test/*.test.mjs
```

The snapshot is not standalone elsewhere because the private evidence images
are intentionally absent. It should be treated as auditable source, not as the
live execution directory.

## Links

- [[computer-use-nap-current-handoff-2026-07-28|Computer-use NAP current handoff]]
- [[computer-use-nap-manual-labeling-workbook-2026-07-28|Computer-use NAP manual labeling workbook]]
- [[computer-use-nap-expanding-history-smoke-execution-plan-2026-07-28|NAP expanding-history smoke execution plan]]
