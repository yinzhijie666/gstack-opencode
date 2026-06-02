# Upstream Parity Status

> **Fork Identity**: This is `yinzhijie666/gstack-opencode`, a personal fork of `garrytan/gstack`.
> 
> - **Origin**: `https://github.com/garrytan/gstack` (upstream)
> - **Fork**: `https://github.com/yinzhijie666/gstack-opencode` (this repo)
> - **Previous fork path**: `VanGoghBuilder/gstack-opencode` → `yinzhijie666/gstack-opencode`

This document tracks the current OpenCode adaptation against the upstream project.

## Target

- upstream repo: `https://github.com/garrytan/gstack`
- pinned comparison target: `parity/upstream-target.json`
- local source of truth: `parity/upstream-feature-matrix.json`

## Status Legend

- `shipped`: native OpenCode command/skill exists and has local validation coverage
- `shipped-v1`: shipped in OpenCode form, but still intentionally narrower than the strongest upstream behavior

## Workflow Surface

| Workflow | Local Status | Validation Evidence | Notes |
|---|---|---|---|
| `/browse` | `shipped` | `browse/test/**`, `test/opencode-assets.test.ts` | shared runtime and command surface |
| `/plan-ceo-review` | `shipped` | `test/opencode-plan-ceo-review-smoke.test.ts` | bounded planning report |
| `/plan-eng-review` | `shipped` | `test/opencode-plan-eng-review-smoke.test.ts` | bounded technical planning report |
| `/plan-design-review` | `shipped` | `test/opencode-plan-design-review-smoke.test.ts` | bounded design planning report |
| `/design-consultation` | `shipped` | `test/opencode-design-consultation-smoke.test.ts` | bounded design direction report |
| `/review` | `shipped-v1` | `test/opencode-review-smoke.test.ts`, `test/opencode-review-fix-smoke.test.ts` | report-first by default, supports verified explicit low-risk fix pass |
| `/qa` | `shipped-v1` | `test/opencode-qa-smoke.test.ts`, `test/opencode-qa-fix-smoke.test.ts`, `test/opencode-qa-regression-smoke.test.ts` | report-first by default, supports verified explicit bounded fix loop and regression generation |
| `/qa-only` | `shipped` | `test/opencode-qa-only-smoke.test.ts` | explicit report-only QA path |
| `/design-review` | `shipped-v1` | `test/opencode-design-review-smoke.test.ts`, `test/opencode-design-review-fix-smoke.test.ts` | audit-first by default, supports verified explicit bounded UI fix path |
| `/ship` | `shipped-v1` | `test/opencode-ship-smoke.test.ts`, `test/opencode-ship-commit-smoke.test.ts`, `test/opencode-ship-push-smoke.test.ts`, `test/opencode-ship-pr-smoke.test.ts` | local-first by default, supports verified explicit commit, push, and PR creation paths |
| `/debug` | `shipped` | `test/opencode-debug-smoke.test.ts` | bounded root-cause report |
| `/document-release` | `shipped-v1` | `test/opencode-document-release-smoke.test.ts` | bounded local doc-update workflow |
| `/office-hours` | `shipped` | `test/opencode-office-hours-smoke.test.ts` | bounded strategy memo |
| `/retro` | `shipped` | `test/opencode-retro-smoke.test.ts` | bounded retrospective |
| `/setup-browser-cookies` | `shipped` | `test/opencode-setup-browser-cookies-smoke.test.ts` | local browser-session setup summary |
| `/gstack-upgrade` | `shipped` | `test/opencode-gstack-upgrade-smoke.test.ts` | local readiness/upgrade-health report |

## Current Gap Shape

The largest remaining parity work is no longer "missing commands". It is behavior depth in the commands marked `shipped-v1`.

Highest-value remaining gaps:

- `/review`
  - upstream-style auto-fix breadth is still narrower than the original project
- `/qa`
  - bounded fix-loop behavior and regression generation are verified, but broader autonomous QA depth is still narrower than the strongest upstream path
- `/design-review`
  - fix mode is verified, but broader redesign and richer before/after automation are still narrower than upstream ambition
- `/ship`
  - commit, push, and PR creation paths are verified, but broader shipping automation is still shallower than the strongest upstream path
- `/document-release`
  - bounded local doc updates are implemented, but the workflow remains intentionally conservative

## Validation Baseline

Static contract validation:

```bash
bun test test/opencode-assets.test.ts
bun test test/parity/upstream-target.test.ts test/parity/upstream-feature-matrix.test.ts
```

Representative workflow validation:

```bash
OPENCODE_SMOKE=1 bun test test/opencode-plan-ceo-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-eng-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-design-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-review-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-regression-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-design-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-design-review-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-commit-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-push-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-pr-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-office-hours-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-retro-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-setup-browser-cookies-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-gstack-upgrade-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-document-release-smoke.test.ts
```

## How To Use This File

- update this file when a `shipped-v1` workflow gains a new verified behavior
- keep the status wording aligned with `parity/upstream-feature-matrix.json`
- do not mark a workflow as stronger than its current automated evidence
