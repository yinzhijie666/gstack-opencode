# GitHub Launch Kit

Use this document when setting up the public GitHub presentation for the OpenCode version of gstack.

## Repository Description

Choose one of these for the GitHub repository description field.

### Option A

OpenCode adaptation of gstack with native OpenCode workflows, GPT-5.4 alignment, and a fast persistent browser runtime.

### Option B

OpenCode-native adaptation of gstack for teams that want advanced AI workflows without Claude Code.

### Option C

OpenCode + GPT-5.4 workflow stack based on gstack, with native commands, local browser automation, and runnable validation.

## About Section

Use this as the longer GitHub About / pinned-project blurb.

> This repository is an OpenCode adaptation of `https://github.com/garrytan/gstack`, built for developers and teams who want the workflow ideas from gstack but cannot rely on Claude Code in their environment. The active path here is OpenCode + GPT-5.4, with native OpenCode commands, a local browser runtime, and validation for the shipped workflow surface.

Shorter version:

> OpenCode adaptation of gstack for teams that want advanced AI workflows, local browser automation, and runnable workflow validation without Claude Code.

## Suggested Topics

Use a focused set of topics rather than a long keyword dump.

Recommended topics:

- `opencode`
- `gpt-5-4`
- `workflow-automation`
- `ai-agents`
- `developer-tools`
- `playwright`
- `browser-automation`
- `bun`
- `typescript`

Optional topics if you want broader discovery:

- `prompt-engineering`
- `software-factory`
- `qa-automation`
- `code-review`
- `release-engineering`

## Pinned Repo Summary

If you need a very short summary for a pinned repository card:

> OpenCode adaptation of gstack with GPT-5.4-aligned workflows, browser automation, and runnable OpenCode validation.

## Release Title Suggestions

For the first OpenCode-focused public release:

- `v0.3.3 - OpenCode-first public release`
- `v0.3.3 - OpenCode adaptation baseline`
- `v0.3.3 - Public OpenCode launch`

## First Release Notes Draft

```md
## OpenCode-first public release

This release establishes the repository as an OpenCode adaptation of the original gstack project.

### What this release is

- an OpenCode-native workflow stack based on the ideas and workflow vocabulary of `https://github.com/garrytan/gstack`
- maintained around the current OpenCode + `GPT-5.4` path
- designed for developers and teams who cannot rely on Claude Code in their environment

### What is shipped now

- native OpenCode commands under `.opencode/commands/`
- native OpenCode skills under `.opencode/skills/`
- local browser runtime under `browse/`
- static asset validation plus OpenCode smoke coverage for the migrated workflow surface

### Included workflow surface

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
- `/office-hours`
- `/retro`
- `/setup-browser-cookies`
- `/gstack-upgrade`

### Validation scope

- static asset validation covers the shipped OpenCode command and skill contracts
- smoke coverage exists for the migrated workflow surface documented in the README
- `/browse` is part of the shipped surface, but should be described separately from the smoke-backed OpenCode workflow slices

### Important scope note

This release does **not** claim that every historical upstream host path is already ported. It claims that the migrated OpenCode workflow surface is implemented, documented, and backed by local validation and smoke coverage in this repository.

### Validation

Representative validation paths:

```bash
bun test test/opencode-assets.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-ceo-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-eng-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-plan-design-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-review-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-review-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-qa-regression-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-commit-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-push-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-ship-pr-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-design-review-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-office-hours-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-retro-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-setup-browser-cookies-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-gstack-upgrade-smoke.test.ts
```

### Notes for users

- use `./setup` for one-shot local preparation
- browser-backed workflows require Playwright Chromium
- `README.md` and `README-zh-CN.md` describe the current active OpenCode surface
- `README.claude.backup.md` remains in the repo only as a historical archive
```

## Maintainer Notes

- Keep this launch kit aligned with `README.md`, `README-zh-CN.md`, and `package.json`
- If the GitHub remote changes, update the repository metadata in `package.json`
- Do not claim full historical parity unless the validation surface truly expands to match it
