---
type: source
status: verified
created: 2026-08-24
updated: 2026-08-24
domains: [inference, model-serving, market-research, operations]
orgs: [openrouter, amazon-web-services]
tags: [model-demand, dashboard, aws, automation, evidence]
---

# Model demand analytics AWS deployment validation

## Summary

The OpenRouter model-demand collector became an automatic hosted system on 2026-08-24. The collector runs on a private EC2 host, keeps raw evidence and SQLite backups in private S3 storage, records accepted publications in private Aurora PostgreSQL, and publishes a validated current export through a separate private S3 bucket. The browser dashboard is still a separate frontend deployment step.

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

## Corrections Found During Live Validation

Three checks prevented incorrect publication:

1. A refreshed export did not retain the older OpenRouter model snapshot that supported reviewed model-name mappings. The export now includes each older evidence snapshot cited by a mapping.
2. macOS transfer metadata files with `._` prefixes created false duplicate matches for catalog evidence. Catalog resolution now ignores those metadata files without weakening the one-real-file rule.
3. A catalog export reused the demand export's creation time. Aurora correctly rejected two different exports with the same unique creation time. Catalog exports now use the catalog completion time while preserving the original demand measurement cutoff.

## Reasonable Inference

The automatic collection spine is now sufficient to begin building real demand history. This does not yet prove that a model is under-served. Provider-supply history, a named workload profile, and quantitative scarcity rules remain separate requirements.

## Open Issues

- Observe the first unattended daily and weekly runs before treating scheduling as proven over time.
- The browser dashboard is not yet publicly hosted. Vercel remains the intended frontend host.
- Raw S3 storage contains evidence from failed catalog attempts as well as accepted publications. Aurora is the accepted-publication ledger; immutable failed-attempt evidence remains available for audit.
- Provider supply and quality collection still need their planned history window before the radar can test persistent scarcity.

## Links

- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference-opportunity-radar-v0-live-validation-2026-08-20|Inference opportunity radar V0 live validation]]
- [[inference|Inference]]
- [Model Demand Analytics repository](https://github.com/dylanduyvu/model-demand-analytics)
