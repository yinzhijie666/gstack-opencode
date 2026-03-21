[简体中文](README-zh-CN.md)

# gstack for OpenCode

OpenCode-native workflow stack inspired by gstack, adapted for teams and developers who want advanced AI workflows without depending on Claude Code.

Quick links: [Quick Start](#quick-start) · [Validation Status](#validation-status) · [Open Source Notes](#open-source-notes) · [Release Checklist](docs/open-source-release-checklist.md) · [Docs Index](docs/README.md)

This repository is an OpenCode-native adaptation of the original gstack project: `https://github.com/garrytan/gstack`.

It exists for developers who want the workflow ideas and AI skills from gstack but cannot use Claude Code in their environment. The goal is to keep the shipped workflow surface practical, local-first, and runnable in OpenCode while continuing to evolve the project in public.

The active OpenCode adaptation in this repository is maintained with OpenCode and `GPT-5.4` (model id `openai/gpt-5.4`). The original upstream project remains the source of the product idea and workflow naming; this repository carries the OpenCode-focused runtime, docs, and validation work.

This document is the OpenCode version of the README. It reflects what is actually shipped in this repository today under `.opencode/`, not the older pre-OpenCode surface.

## Current Status

This repo is now maintained as an OpenCode-first workflow stack.

- It is based on `garrytan/gstack`, but intentionally reshaped for OpenCode users who cannot rely on Claude Code.
- OpenCode already has native commands and skills for the core planning, review, QA, design-audit, debugging, release-prep, and docs-update flows.
- Several OpenCode workflows are intentionally bounded v1 slices: they write reports and durable artifacts first, then leave deeper automation loops to later OpenCode phases.

If you want the short version: the OpenCode surface is real, usable, and backed by local validation plus smoke coverage in this repo for the workflows listed below, but some workflows are still intentionally report-first or report-only.

This repository is open source and will keep evolving. The focus is not on cloning every historical host behavior, but on steadily improving the OpenCode-native path.

## What Ships Today

OpenCode-native commands currently present in this repo:

- `/browse`
- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/design-consultation`
- `/review`
- `/qa`
- `/qa-only`
- `/design-review`
- `/ship`
- `/debug`
- `/document-release`

Not yet ported as native OpenCode commands in this repo:

- `/office-hours`
- `/retro`
- `/setup-browser-cookies`

## Upstream And Scope

- Upstream reference: `https://github.com/garrytan/gstack`
- This repo keeps the same workflow vocabulary where practical, then re-implements the active surface for OpenCode
- The promise here is not "every historical gstack feature is already ported"
- The promise is: every workflow listed as shipped in this README has an active OpenCode command/skill contract, plus local validation coverage in this repository

## Quick Start

Requirements:

- OpenCode
- Bun v1.0+
- Git
- Playwright Chromium available locally for browser-backed flows

Recommended one-shot setup from the repo root:

```bash
./setup
```

That installs local dependencies, builds the `browse` binary, installs Playwright Chromium when needed, and prepares the repo for OpenCode use.

Manual setup remains available if you prefer individual steps.

From the repo root:

```bash
bun install
bun run build
```

That builds the local `browse` binary used by the browser-backed OpenCode workflows.

Then open the repo in OpenCode and start with:

1. `/plan-ceo-review` on any feature brief or `PLAN.md`
2. `/review` on a branch with local changes
3. `/qa http://localhost:3000` or another explicit local/staging URL
4. `/ship` when you want a local release-readiness report

Source of truth for current OpenCode behavior lives in `.opencode/commands/` and `.opencode/skills/`. `README.claude.backup.md` is retained only as a historical archive.

## Model And Runtime

- The active adaptation work in this repository is maintained with OpenCode + `GPT-5.4`
- Browser-backed workflows rely on the local `browse` runtime plus Playwright Chromium
- Behavior may vary with different OpenCode models or providers, so the docs and tests in this repo are written against the current `GPT-5.4` path

## What To Expect From OpenCode Today

### Planning

- `/plan-ceo-review` writes a bounded strategy report under `.gstack/plan-reports/`
- `/plan-eng-review` writes a technical plan with architecture summary, data flow, risks, and test matrix
- `/plan-design-review` writes a design-focused planning report with IA, interaction coverage, AI slop risk, and responsive/accessibility gaps

These are report-first slices. They are good for pressure-testing a plan before implementation.

### Review

- `/review` is a structural pre-landing review
- It reads the branch diff against a local base branch
- It focuses on high-signal categories such as SQL/data safety, race conditions, trust boundaries, and enum/value completeness
- It writes a local report under `.gstack/review-reports/`

Important: the OpenCode `/review` slice does not auto-fix code in this v1 version.

### QA

- `/qa` runs browser-first QA and writes a report plus baseline under `.gstack/qa-reports/`
- `/qa-only` uses the same browser methodology but is explicitly report-only
- Both use the local `browse` binary and preserve screenshot evidence

Important: in this first OpenCode slice, `/qa` is also report-only. It does not yet do the Claude-era test-fix-verify loop or regression-test generation, and it requires an explicit target URL or local page path.

### Design

- `/design-consultation` writes a bounded design direction report
- `/design-review` audits one explicit local rendered page with browser evidence and writes a design report under `.gstack/design-reports/`

Important: the OpenCode `/design-review` slice is report-first in this repo today. It stays on one explicit local page and does not patch UI code automatically.

### Debugging

- `/debug` requires an explicit local reproduction command
- It investigates root cause first and writes a durable report under `.gstack/debug-reports/`

### Release Prep

- `/ship` checks local branch state, test status, and review readiness
- It writes a release-prep report under `.gstack/ship-reports/`

Important: the OpenCode `/ship` slice is local-only in this repo today. It runs an explicit or obvious repo-local test command when one exists, otherwise reports `NEEDS_TEST_COMMAND`. It does not commit, push, or open a PR.

### Docs Sync

- `/document-release` updates a narrow, factual set of docs from local repository changes
- It writes a summary artifact under `.gstack/document-release/`

In this v1 slice, `README.md`, `README-zh-CN.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, and `docs/**/*.md` are in scope. `CHANGELOG.md`, `VERSION`, `TODOS.md`, and `README.claude.backup.md` are explicitly out of scope.

## A Realistic OpenCode Flow

```text
You:    /plan-ceo-review
OpenCode: writes a strategy report to .gstack/plan-reports/

You:    /plan-eng-review
OpenCode: writes a technical report with data flow, risks, and tests

You:    /review
OpenCode: writes a structural review report against the current branch

You:    /qa http://localhost:3000 --quick
OpenCode: opens the local page, captures screenshots and console evidence,
          then writes a QA report and baseline to .gstack/qa-reports/

You:    /ship
OpenCode: writes a local release-readiness report based on branch state,
          tests, and review artifacts
```

That is the current OpenCode promise: bounded, durable workflow artifacts with native OpenCode commands and local verification where applicable.

## Validation Status

The following OpenCode slices are backed by static asset checks and smoke coverage in this repo:

- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/review`
- `/qa`
- `/qa-only`
- `/ship`
- `/design-consultation`
- `/design-review`
- `/debug`
- `/document-release`

This means the currently shipped OpenCode workflows are not just documented: they have runnable validation in this repository.

More specifically:

- `test/opencode-assets.test.ts` validates the shipped OpenCode command and skill contracts
- `test/opencode-*.test.ts` provides workflow smoke coverage for the migrated command surface
- `bun test` covers the default OpenCode validation path used by this repo, while smoke runs are enabled explicitly when needed

If you want to verify the current OpenCode surface yourself:

```bash
bun test test/opencode-assets.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-ceo-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-eng-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-design-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-smoke.test.ts
```

Those are representative migrated workflow checks, not a claim that every historical upstream path is already ported.

The right public claim is: this repo keeps the migrated workflow surface aligned with the original project intent and includes runnable validation for the shipped OpenCode workflows in the current OpenCode environment. It should not be described as full feature parity with the original host environment.

## Differences From The Claude Backup README

`README.claude.backup.md` preserves the broader historical gstack story and the fuller Claude-oriented system description.

This README is intentionally narrower:

- it only documents commands that actually exist under `.opencode/commands/`
- it only claims behavior that is present in the current OpenCode skills
- it treats report-first slices as a feature of the current migration stage, not as missing documentation

If a workflow matters to you and it is not listed here, assume it is not part of the current OpenCode surface unless you can find a native OpenCode command for it in `.opencode/commands/`.

## Open Source Notes

- upstream idea and historical system: `garrytan/gstack`
- active OpenCode adaptation here: OpenCode + `GPT-5.4`
- license: MIT
- model/runtime costs depend on your OpenCode setup; the repository code is open source, but hosted model usage is not implied to be free

## Repository Layout For OpenCode

Key OpenCode-native assets live here:

- `.opencode/commands/` - slash entrypoints for OpenCode
- `.opencode/skills/` - reusable workflow instructions and contracts
- `browse/` - shared browser runtime and compiled local binary
- `test/opencode-*-smoke.test.ts` - OpenCode smoke coverage

## Troubleshooting

### `/browse` or browser-backed workflows fail

Build the local binary and make sure Chromium is installed:

```bash
bun install
bun run build
npx playwright install chromium
```

### A browser workflow says setup is missing

Most browser-backed OpenCode slices expect `./browse/dist/browse` to exist in the repo.

### A command writes a report instead of making edits

That is often intentional in the current OpenCode migration phase. Check whether the slice is marked report-first or report-only in its skill contract under `.opencode/skills/`.

## License

MIT. Open source. Build on it, fork it, and keep improving the OpenCode path.
