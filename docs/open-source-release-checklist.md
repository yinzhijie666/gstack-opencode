# Open Source Release Checklist

Use this checklist before publishing a significant update to the OpenCode version of gstack.

## Positioning

- Confirm `README.md` describes the repo as an OpenCode adaptation of `https://github.com/garrytan/gstack`
- Confirm `README-zh-CN.md` mirrors the same public positioning in Chinese
- Confirm the docs still state that the active maintenance path is OpenCode + `GPT-5.4`
- Confirm no active doc overclaims full parity with every historical upstream host path

## Docs

- Update `README.md` for any newly shipped command or workflow change
- Update `README-zh-CN.md` to match the English README
- Update `AGENTS.md`, `CONTRIBUTING.md`, and `ARCHITECTURE.md` if maintainer guidance or architecture assumptions changed
- Keep `README.claude.backup.md` untouched unless the archival boundary itself needs clarification

## Runtime And Setup

- Run `./setup` from a clean clone and verify it completes
- Run `bun run build` and confirm `browse/dist/browse` is rebuilt
- Verify Playwright Chromium setup still works for browser-backed flows

## Validation

Recommended baseline:

```bash
bun test test/opencode-assets.test.ts
```

Representative smoke coverage for the shipped workflow surface:

```bash
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

When relevant, also run workflow-specific smoke tests such as:

- `test/opencode-document-release-smoke.test.ts`
- `test/opencode-debug-smoke.test.ts`
- `test/opencode-design-review-smoke.test.ts`
- `test/opencode-design-consultation-smoke.test.ts`

## Claim Calibration

- Say "backed by local validation and smoke coverage" instead of implying default full-suite execution
- Say "aligned with original project intent" instead of claiming total historical parity
- Say "maintained around the current OpenCode + GPT-5.4 path" instead of implying the model/runtime is universal or mandatory for every environment

## Open Source Hygiene

- Check that new docs are readable without prior repo context
- Avoid host-specific legacy terminology in active docs unless calling out the archived boundary
- Keep examples local-first and reproducible
- Keep the active command list in README aligned with `.opencode/commands/`

## Final Pass

- Scan active docs for accidental old host-specific wording
- Verify new links resolve
- Make sure changed claims are backed by files or tests in the repo
- Keep the release explanation honest: practical, polished, and specific
