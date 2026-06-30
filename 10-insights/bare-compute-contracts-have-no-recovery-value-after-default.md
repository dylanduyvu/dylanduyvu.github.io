---
type: insight
status: distilled
created: 2026-06-29
updated: 2026-06-30
confidence: high
domains: [gpu-finance, compute-contracts]
projects: [gpu-compute-novation]
sources: [usd-ai-call-harry-page-2026-06-29, gpu-backed-debt-contract-backed-inversion-2026-06-30]
people: [harry-page]
orgs: [usd-ai]
aliases: [contract-only gpu lending has no recovery, bare offtake contracts are not recoverable collateral]
tags: [gpu, lending, collateral, novation]
---

# Bare compute contracts have no recovery value after default

## Claim

A bare GPU compute contract is not recoverable collateral by itself. For USD.AI, the contract can support debt service, but the GPU hardware is the recoverable asset if something goes wrong.

## Why It Matters

This directly weakens any financing model that depends on lending against contract cash flows without hardware, insurance, first-loss protection, or another recoverable asset. A no-hardware novation desk would inherit the exact risk that makes lenders refuse contract-only exposure: if the contract defaults, the cash flow stream disappears.

## Evidence

- 2026-06-29: In the USD.AI call, Harry Page said USD.AI will always be fundamentally backed by GPUs because if there is a default, the lender can resell the GPU.
- 2026-06-29: Harry described the contract as support for repayment, not a recoverable asset. In his framing, if the contract defaults, it becomes a contractual cash flow stream that no longer exists.
- 2026-06-29: USD.AI explicitly prefers long-term committed take-or-pay offtake contracts, but still treats the hardware as primary collateral and the offtake as debt-service support.

## Implications

- Contract assignment, novation, or secondary liquidity products need a recovery story beyond the assigned contract.
- Useful wedges may require GPU collateral, escrowed deposits, insurance, first-loss guarantees, lender step-in rights, or verified operator performance that reduces default probability.
- If the product is still about contracts, it should probably focus on underwriting, verification, or risk transfer rather than pure contract-backed lending.
- The inverse is also true: GPU-backed debt cannot be understood only as asset-backed finance because the contract is still the debt-service engine.

## Counterpoints / Uncertainty

- This is USD.AI's lender perspective and may not cover all possible buyers of contract risk.
- Some contracts with very strong counterparties, enforceable assignment rights, parent guarantees, or liquid replacement demand could be more financeable than the generic "bare contract" case.
- Legal rights after default matter; this note captures the commercial recovery intuition, not a legal conclusion.

## Links

- Sources: [[usd-ai-call-harry-page-2026-06-29|USD.AI call with Harry Page]], [[gpu-backed-debt-contract-backed-inversion-2026-06-30|GPU-backed debt contract-backed inversion]]
- Related Insights: [[gpu-backed-debt-is-contract-backed-with-hardware-recovery-floor|GPU-backed debt is contract-backed with a hardware recovery floor]]
- Projects: [[gpu-compute-novation|GPU Compute Novation]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[harry-page|Harry Page]]
- Orgs: [[usd-ai|USD.AI]]

## Updates

### 2026-06-29

Initial capture from USD.AI call transcript.

### 2026-06-30

Added the broader inversion: GPU-backed debt is often contract-backed debt with GPU collateral as the recovery floor.
