# Contributing to gstack

Thanks for helping improve gstack.

This repo is OpenCode-first. The active product surface is the local browser runtime in `browse/` plus the OpenCode commands and skills in `.opencode/`.

When updating public docs, position the repo as an OpenCode adaptation of `https://github.com/garrytan/gstack` for users who cannot rely on Claude Code, and keep model/runtime language aligned with the current OpenCode + `GPT-5.4` path.

## Quick Start

From the repo root:

```bash
./setup
```

That installs dependencies, builds the local `browse` binary, and makes sure Playwright Chromium is available.

## Daily Development Workflow

```bash
bun run build
bun test
```

Useful commands:

```bash
bun run dev <cmd>      # run browse CLI from source
bun run build          # rebuild browse/dist binaries
bun test               # browse tests + OpenCode validation
bun run start          # run the browse server from source
```

## What To Edit

- `browse/src/**` for browser runtime behavior
- `.opencode/commands/*.md` for OpenCode slash entrypoints
- `.opencode/skills/*/SKILL.md` for OpenCode workflow contracts
- `qa/**`, `review/**`, and related directories for shared reference material

## Testing

Default test command:

```bash
bun test
```

This covers:

- `browse/test/**`
- `test/opencode-assets.test.ts`
- OpenCode smoke tests under `test/opencode-*.test.ts` when enabled
- shared helper tests used by the OpenCode smoke harness

For browser-backed smoke tests:

```bash
OPENCODE_SMOKE=1 bun test test/opencode-qa-smoke.test.ts
```

Use the workflow-specific smoke test when changing one OpenCode command or skill rather than running everything blindly.

Practical validation ladder:

- `browse/src/**` changes -> run the related `browse/test/**`
- `.opencode/**` changes -> run `bun test test/opencode-assets.test.ts`
- workflow contract changes -> run the matching `test/opencode-*.test.ts`
- browser-backed workflow changes -> prefer the smallest relevant `OPENCODE_SMOKE=1 bun test ...` command

## OpenCode Smoke Tests

The smoke suite uses temporary repos plus `opencode run --command ...` to validate the shipped `.opencode` assets.

Shared helpers live under `test/helpers/`:

- `opencode-run.ts`
- `temp-repo.ts`
- `static-server.ts`

When updating smoke behavior, prefer tightening command/skill contracts before weakening assertions.

## Browser Runtime Notes

- the repo-local binary lives at `browse/dist/browse`
- `./setup` is the recommended way to prepare local browser dependencies
- `browse/src/find-browse.ts` should prefer repo-local discovery first

## Documentation

Keep active docs OpenCode-first:

- `README.md`
- `README-zh-CN.md`
- `AGENTS.md`
- `docs/README.md`
- `docs/open-source-release-checklist.md`
- this file

`README.claude.backup.md` is historical only.

## Pull Request Expectations

- keep changes logically bisected when practical
- update tests with the behavior change
- keep docs aligned with the actual OpenCode surface
- do not reintroduce legacy host-specific install/setup flows into active docs or code
