---
type: source
status: verified
created: 2026-08-24
updated: 2026-08-25
domains: [inference, model-serving, market-research, operations]
orgs: [openrouter, amazon-web-services]
tags: [model-demand, dashboard, aws, automation, evidence]
---

# Model demand analytics AWS deployment validation

## Summary

The OpenRouter model-demand collector became an automatic hosted system on 2026-08-24. The collector runs on a private EC2 host, keeps raw evidence and SQLite backups in private S3 storage, records accepted publications in private Aurora PostgreSQL, and publishes validated current exports through private S3 buckets. The public Vercel dashboard and its first model-level supply export went live on 2026-08-25.

## Direct Evidence

- One manual hosted demand run completed and published two new OpenRouter snapshots.
- One full hosted catalog run completed and published 174 source snapshots for model identity, architecture, checkpoint, quantization, and memory facts.
- The daily demand timer and weekly catalog timer were both `enabled` and `active` after installation.
- The next checked schedules were 3:00 PM America/New_York for daily demand and 4:00 PM America/New_York each Sunday for the full catalog.
- The demand refresh retains eight attempts with 15 minutes between attempts for retryable OpenRouter failures.
- The final storage check found 1,442 accepted archived-snapshot records, three successful collection-run records, three published exports, 1,027 snapshots in the current EC2 SQLite manifest, and 1,732 immutable raw objects in S3.
- The SHA-256 hash matched across the EC2 export, the immutable S3 history object, the S3 current pointer, and the Aurora current-publication record.
- The production OpenRouter key is stored in AWS Secrets Manager. It was not written to the repository or the EC2 disk.
- The merged code passed 77 dashboard tests and 877 collector tests. GitHub `main` and local `main` both resolved to commit `4934a6a` after the push.

## V1C Supply Deployment Update — 2026-08-25

- The first successful hosted supply run completed all 74 planned OpenRouter requests. It produced 74 public model records and exact current-route matches for 72 models.
- The public export includes calculated model-level endpoint and provider counts, default-condition prices, recent latency, throughput, one-day uptime, context and output limits, reported quantization, tool support, implicit caching, and Zero Data Retention match counts. Provider names and raw endpoint rows remain private.
- The local export hash matched the immutable S3 history object and the S3 current pointer. The successful run manifest was present in the private raw bucket, and the public export passed its strict safety contract.
- The public [Supply page](https://model-demand-analytics.vercel.app/supply) and [supply API](https://model-demand-analytics.vercel.app/api/supply) both returned HTTP 200. The API returned production mode, 74 models, 72 mapped routes, and generation time `2026-08-25T22:19:36.512253Z`.
- The supply timer is enabled and active at `00:17`, `06:17`, `12:17`, and `18:17` UTC. The demand and catalog timers remained enabled and active.
- Supply history is not ready for any model yet. The first export has one observation day; the dashboard requires at least three UTC observation days across seven calendar days before it shows a seven-day supply series.
- The final code at commit `caa181c3` passed 1,046 collector tests, 156 Python dashboard tests, and 414 frontend tests. Python type checks, Python code checks, frontend lint, and the production frontend build also passed.

## Corrections Found During Live Validation

Three checks prevented incorrect publication:

1. A refreshed export did not retain the older OpenRouter model snapshot that supported reviewed model-name mappings. The export now includes each older evidence snapshot cited by a mapping.
2. macOS transfer metadata files with `._` prefixes created false duplicate matches for catalog evidence. Catalog resolution now ignores those metadata files without weakening the one-real-file rule.
3. A catalog export reused the demand export's creation time. Aurora correctly rejected two different exports with the same unique creation time. Catalog exports now use the catalog completion time while preserving the original demand measurement cutoff.

The V1C supply launch found three more production faults:

4. The collector could write supply objects but could not read a missing first-run pointer because its bucket-list permission did not include the supply prefix. The CloudFormation policy now includes that exact prefix.
5. A staged virtual environment kept a path to its temporary build directory after the directory moved. The package was rebuilt at its final path before the live run.
6. The price validator rejected a negative OpenRouter discount. OpenRouter documents that a negative discount is a markup and still uses `base price × (1 - discount)`. The validator now accepts signed finite discounts and preserves the exact decimal calculation. See [OpenRouter's provider integration documentation](https://openrouter.ai/docs/guides/community/for-providers#discounts-with-discount-to-user).

## Reasonable Inference

The automatic collection spine now builds both demand and model-level supply history. This does not prove that a model is under-served. A persistent measured gap, a named workload profile, quantitative qualification rules, and direct customer or gateway evidence remain separate requirements.

## Open Issues

- Observe the first unattended supply run before treating the new four-times-per-day schedule as proven over time.
- Raw S3 storage contains evidence from failed catalog attempts as well as accepted publications. Aurora is the accepted-publication ledger; immutable failed-attempt evidence remains available for audit.
- Provider supply and quality collection still need the planned seven-calendar-day history window before the radar can test a persistent gap.

## Links

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference-opportunity-radar-v0-live-validation-2026-08-20|Inference opportunity radar V0 live validation]]
- [[inference|Inference]]
- [Model Demand Analytics repository](https://github.com/dylanduyvu/model-demand-analytics)
