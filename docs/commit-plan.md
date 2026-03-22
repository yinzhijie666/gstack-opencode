# Commit Plan

Use this plan if you want to land the current OpenCode parity and release-readiness work in clean logical commits.

## Recommended Split

### Commit 1: restore missing OpenCode workflow entrypoints

Focus:

- add newly restored commands and skills
- add upstream parity source-of-truth files
- add the first wave of workflow smoke tests

Files:

- `.opencode/commands/gstack-upgrade.md`
- `.opencode/commands/office-hours.md`
- `.opencode/commands/retro.md`
- `.opencode/commands/setup-browser-cookies.md`
- `.opencode/skills/gstack-upgrade/**`
- `.opencode/skills/office-hours/**`
- `.opencode/skills/retro/**`
- `.opencode/skills/setup-browser-cookies/**`
- `parity/upstream-target.json`
- `parity/upstream-feature-matrix.json`
- `test/parity/**`
- `test/fixtures/office-hours-smoke/**`
- `test/fixtures/retro-smoke/**`
- `test/opencode-gstack-upgrade-smoke.test.ts`
- `test/opencode-office-hours-smoke.test.ts`
- `test/opencode-retro-smoke.test.ts`
- `test/opencode-setup-browser-cookies-smoke.test.ts`

Suggested message:

`restore missing OpenCode workflow entrypoints`

### Commit 2: deepen parity for review, qa, design-review, and ship

Focus:

- upgrade high-risk workflow contracts beyond report-only behavior
- add behavior smokes for fix, regression, commit, push, and PR paths
- extend smoke helper env support for local stubbing

Files:

- `.opencode/commands/design-review.md`
- `.opencode/commands/qa.md`
- `.opencode/commands/review.md`
- `.opencode/commands/ship.md`
- `.opencode/skills/design-review/SKILL.md`
- `.opencode/skills/qa/SKILL.md`
- `.opencode/skills/review/SKILL.md`
- `.opencode/skills/ship/SKILL.md`
- `test/helpers/opencode-run.ts`
- `test/opencode-design-review-fix-smoke.test.ts`
- `test/opencode-qa-fix-smoke.test.ts`
- `test/opencode-qa-regression-smoke.test.ts`
- `test/opencode-review-fix-smoke.test.ts`
- `test/opencode-ship-commit-smoke.test.ts`
- `test/opencode-ship-push-smoke.test.ts`
- `test/opencode-ship-pr-smoke.test.ts`

Suggested message:

`deepen OpenCode workflow parity for fix and ship paths`

### Commit 3: align docs, release materials, and parity status

Focus:

- update README and Chinese README
- update release checklist and launch kit
- add parity status doc
- calibrate `document-release` status and scope wording

Files:

- `.opencode/skills/document-release/SKILL.md`
- `README.md`
- `README-zh-CN.md`
- `docs/upstream-parity-status.md`
- `docs/open-source-release-checklist.md`
- `docs/github-launch-kit.md`
- `docs/README.md`

Suggested message:

`update parity docs and release materials`

### Commit 4: refresh package metadata and asset assertions

Focus:

- update package metadata for the current OpenCode release posture
- refresh static assertions to match the restored command and workflow surface

Files:

- `package.json`
- `test/opencode-assets.test.ts`

Suggested message:

`refresh package metadata and OpenCode asset checks`

## Order

Apply the commits in this order:

1. missing workflow restoration
2. high-risk behavior parity
3. docs and parity status alignment
4. package metadata and asset assertions

## Why This Split

- commit 1 restores missing surface area
- commit 2 proves the deeper behavior parity work
- commit 3 updates public and maintainer-facing documentation to match the new reality
- commit 4 keeps repo metadata and static tests aligned with the final state

## Validation Pairing

Recommended checks by commit:

- commit 1:
  - `bun test test/opencode-assets.test.ts test/parity/upstream-target.test.ts test/parity/upstream-feature-matrix.test.ts`
  - relevant restored workflow smokes
- commit 2:
  - relevant high-risk behavior smokes (`review-fix`, `qa-fix`, `qa-regression`, `design-review-fix`, `ship-*`)
- commit 3:
  - `bun test test/opencode-assets.test.ts`
- commit 4:
  - `bun test test/opencode-assets.test.ts`

## Recommended Final Messages

If you want a straightforward final series, use these commit messages as-is.

1. `restore missing OpenCode workflow entrypoints`
2. `deepen OpenCode workflow parity for fix and ship paths`
3. `update parity docs and release materials`
4. `refresh package metadata and OpenCode asset checks`

If you prefer slightly more explicit wording, use this alternative set:

1. `restore office-hours, retro, setup-browser-cookies, and gstack-upgrade`
2. `add verified fix and shipping paths for core OpenCode workflows`
3. `align parity status, README, and release materials`
4. `finalize metadata and OpenCode asset assertions`
