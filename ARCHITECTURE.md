# Architecture

This document explains the current OpenCode-first architecture of gstack.

The repo should be described as an OpenCode adaptation of `https://github.com/garrytan/gstack`, with the active implementation and validation path centered on OpenCode + `GPT-5.4`.

## Core Idea

gstack combines two things:

1. a fast local browser runtime in `browse/`
2. a native OpenCode workflow surface in `.opencode/`

The browser is the reusable core. The OpenCode commands and skills are the active host layer.

## Browser Runtime

The browser runtime is a compiled CLI that talks to a persistent local Chromium daemon over HTTP.

```text
OpenCode or local shell
        |
        v
 browse CLI (compiled binary)
        |
        v
 Bun server in browse/src/server.ts
        |
        v
 Playwright Chromium
```

Why this design:

- first browser call pays the startup cost once
- later commands are fast because state is reused
- cookies, tabs, local storage, and console history persist across commands

## OpenCode Surface

The active user-facing host layer lives in:

- `.opencode/commands/`
- `.opencode/skills/`

Commands are entrypoints. Skills define bounded workflow contracts.

Several workflows are intentionally report-first or report-only in the current v1 surface. That is a product decision, not incomplete wiring.

## Source Of Truth

When you need to change behavior, prefer these edit points:

- `browse/src/commands.ts` for browser command definitions
- `browse/src/snapshot.ts` for snapshot behavior and metadata
- `.opencode/commands/*.md` for user-facing OpenCode entrypoints
- `.opencode/skills/*/SKILL.md` for OpenCode workflow contracts
- `qa/**`, `review/**`, and related shared workflow directories for reusable reference material

## Shared Assets

The repo still keeps shared workflow material outside `.opencode/` where it is genuinely reusable:

- `qa/templates/`
- `qa/references/`
- `review/checklist.md`
- browser test fixtures under `browse/test/fixtures/`

These support OpenCode workflows but are not host-specific.

## Setup Model

The repo now uses an OpenCode-first local setup flow:

```bash
./setup
```

That script:

- installs root dependencies when needed
- installs `.opencode` local dependencies when present
- builds `browse/dist/browse`
- installs Playwright Chromium if required

No active legacy registration or symlink-based host setup remains in the mainline architecture.

## Testing Strategy

There are three active layers:

1. `browse/test/**` for runtime behavior
2. `test/opencode-assets.test.ts` for OpenCode asset validation
3. `test/opencode-*.test.ts` for OpenCode smoke coverage

The smoke layer validates the real shipped OpenCode command/skill surface by running `opencode run --command ...` inside temporary repos.

## What Is No Longer Active

The repo keeps `README.claude.backup.md` only as a historical archive.

Legacy host-specific skill generation, setup flows, and eval harnesses are no longer part of the active architecture.
