# AGENTS.md

## Mission

This repository is the OpenCode-native version of gstack.

For public-facing docs and maintainer guidance, describe it as an OpenCode adaptation of `https://github.com/garrytan/gstack`, maintained around the current OpenCode + `GPT-5.4` path.

The repo no longer treats Claude compatibility as a product goal. Keep the active surface focused on:

- shared runtime and reusable workflow assets
- native OpenCode commands under `.opencode/commands/`
- native OpenCode skills under `.opencode/skills/`
- OpenCode-first validation and smoke coverage

`README.claude.backup.md` is a historical archive only. Do not let it pull active code or docs back toward archived host-specific behavior.

## Architecture Priorities

1. Shared core
   - `browse/` runtime and command metadata
   - reusable QA/review/design reference material
   - local test fixtures and helper utilities

2. OpenCode surface
   - `.opencode/commands/`
   - `.opencode/skills/`
   - OpenCode smoke tests under `test/opencode-*.test.ts`

When choosing between preserving historical behavior and simplifying around OpenCode, prefer the OpenCode path.

## Directory Meanings

- `browse/`
  - host-neutral browser runtime
  - compiled CLI/server implementation
  - command and snapshot metadata

- `.opencode/`
  - OpenCode-native commands and skills
  - the only active host adapter layer in this repo

- `qa/`, `review/`, and similar workflow directories
  - shared workflow assets only
  - templates, checklists, fixtures, and references
  - not host-specific prompt surfaces anymore

- `test/`
  - browse tests
  - OpenCode asset validation
  - OpenCode smoke tests

## Source Of Truth

- Edit `browse/src/commands.ts` for browser command definitions
- Edit `browse/src/snapshot.ts` for snapshot flag metadata
- Edit `.opencode/commands/*.md` and `.opencode/skills/*/SKILL.md` for active OpenCode behavior
- Edit shared QA/review/design assets directly in their own directories

Do not reintroduce generated host-specific skill docs as an active source of truth.

## OpenCode Rules

- Commands are the user-facing OpenCode entrypoints
- Skills hold bounded operating procedures and contracts
- Prefer durable local artifacts over long-session memory
- Keep browser-backed workflows local and evidence-driven
- Keep current v1 slices honest about being report-first or report-only where applicable

## Testing Policy

Use a TDD-oriented workflow for non-trivial changes.

Validation ladder:

1. browse/runtime tests
2. OpenCode asset validation
3. OpenCode smoke tests

At minimum:

- `browse/src/**` changes should run related `browse/test/**`
- `.opencode/**` changes should run `test/opencode-assets.test.ts`
- workflow contract changes should run the related `test/opencode-*-smoke.test.ts`

## Code Style

- prefer Bun + TypeScript patterns already in the repo
- keep interfaces explicit and boring
- keep changes minimal and reversible
- preserve a working repo state after each atomic step
- avoid reintroducing host-specific complexity into shared runtime code

## Documentation Style

- write for maintainers and OpenCode users
- prefer direct language over migration jargon
- describe what is shipped now, not historical aspirations
- treat `README.claude.backup.md` as archive material, not active product documentation

## Commit Policy

Always bisect by logical change boundary.

Preferred split:

1. shared runtime or asset changes
2. OpenCode command/skill updates
3. tests
4. docs

Keep deletions or archive cleanup separate from behavioral changes when practical.
