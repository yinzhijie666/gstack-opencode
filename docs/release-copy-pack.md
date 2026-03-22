# Release Copy Pack

Use this file as the final copy source for the next public OpenCode release.

## English Release Summary

### Short Summary

This release completes the top-level OpenCode workflow surface for the gstack adaptation and adds stronger automated evidence for the highest-risk action paths.

### Medium Summary

This release pushes the OpenCode adaptation much closer to upstream workflow-intent parity.

- all historical top-level workflow names tracked in the parity matrix are now present in the OpenCode surface
- high-risk workflows such as `/review`, `/qa`, `/design-review`, and `/ship` now have explicit fix or action-path smoke evidence
- public docs, parity docs, and release materials now reflect the restored workflow surface and its current validation depth

### Long Summary

This release continues the OpenCode adaptation of `https://github.com/garrytan/gstack` with a stronger focus on workflow-intent parity.

What changed:

- restored missing OpenCode workflow entrypoints for `/office-hours`, `/retro`, `/setup-browser-cookies`, and `/gstack-upgrade`
- deepened `/review`, `/qa`, `/design-review`, and `/ship` beyond report-only behavior
- added smoke evidence for review fixes, QA fixes, QA regression generation, design-review fixes, and ship commit/push/PR flows
- aligned README, parity status, release checklist, and launch materials with the current shipped surface

Safe public claim:

> The top-level workflow surface is restored and locally validated in OpenCode form. Remaining gaps are primarily depth differences in some workflows, not missing workflow entrypoints.

## Chinese Release Summary

### 简短版

这个版本补齐了 OpenCode 改造版的顶层 workflow 能力面，并为最关键的动作路径补上了更强的自动化证据。

### 中等版

这个版本把项目进一步推进到接近 upstream workflow-intent parity 的状态。

- parity 矩阵里跟踪的历史顶层 workflow 名称都已经进入 OpenCode 主线
- `/review`、`/qa`、`/design-review`、`/ship` 这些高风险 workflow 现在已经有 fix 或 action-path 的 smoke 证据
- README、parity 文档、发布清单和 launch 文案也已经和当前恢复状态对齐

### 长版

这个版本继续推进 `https://github.com/garrytan/gstack` 的 OpenCode 改造，并把重点放在 workflow-intent parity 上。

本次更新包括：

- 补回 `/office-hours`、`/retro`、`/setup-browser-cookies`、`/gstack-upgrade` 这些缺失的 OpenCode workflow 入口
- 把 `/review`、`/qa`、`/design-review`、`/ship` 从单纯 report-first 继续推进到更强的动作路径
- 增加 review fix、QA fix、QA regression generation、design-review fix、ship commit/push/PR 的 smoke 证据
- 让 README、parity 状态、发布清单和 launch 文案与当前 shipped surface 对齐

最安全的公开表述：

> 当前 OpenCode 版本已经恢复完整的顶层 workflow 能力面，并提供本地验证。剩余差距主要是少数 workflow 的行为深度差异，而不是缺失功能入口。

## Release Notes Draft

### Title

`v0.3.3 - OpenCode parity wave`

### Body

```md
## OpenCode parity wave

This release pushes the OpenCode adaptation closer to upstream workflow-intent parity.

### Highlights

- restored the missing top-level OpenCode workflows:
  - `/office-hours`
  - `/retro`
  - `/setup-browser-cookies`
  - `/gstack-upgrade`
- deepened high-risk workflow behavior for:
  - `/review`
  - `/qa`
  - `/design-review`
  - `/ship`
- added stronger smoke evidence for fix, regression, commit, push, and PR paths
- aligned README, parity docs, and release materials with the current shipped OpenCode surface

### Validation highlights

- `test/opencode-review-fix-smoke.test.ts`
- `test/opencode-qa-fix-smoke.test.ts`
- `test/opencode-qa-regression-smoke.test.ts`
- `test/opencode-design-review-fix-smoke.test.ts`
- `test/opencode-ship-commit-smoke.test.ts`
- `test/opencode-ship-push-smoke.test.ts`
- `test/opencode-ship-pr-smoke.test.ts`

### Scope note

This release supports a strong claim of restored top-level workflow surface in OpenCode form, backed by local validation. It does not claim exact full host-behavior parity with every historical upstream path.
```

## GitHub Release Intro

Use this as the opening paragraph in the GitHub release editor if you want a stronger public framing:

> This release marks the strongest OpenCode parity wave so far for the gstack adaptation. The top-level workflow surface is now restored in OpenCode form, and the highest-risk paths now have automated evidence for real fixes, regression generation, commits, pushes, and PR creation.

## Maintainer Notes

- Keep this copy aligned with `docs/upstream-parity-status.md`
- If you downgrade or upgrade any `shipped-v1` claim, update this file too
- Do not say "full parity" unless the remaining depth gaps are actually closed

## Recommended Final Copy

If you want one default set to actually publish, use this:

### Recommended Repository Description

OpenCode adaptation of gstack with native workflows, GPT-5.4 alignment, browser automation, and runnable validation.

### Recommended About Text

This repository is an OpenCode adaptation of `https://github.com/garrytan/gstack`, built for developers and teams who want the workflow ideas from gstack but cannot rely on Claude Code in their environment. The active path here is OpenCode + GPT-5.4, with native OpenCode commands, a local browser runtime, and validation for the shipped workflow surface.

### Recommended English Release Summary

This release restores the full top-level OpenCode workflow surface for the gstack adaptation and adds automated evidence for the most important action paths: fixes, regression generation, commits, pushes, and PR creation. The repo now supports a strong claim of restored workflow-intent coverage in OpenCode form, while remaining honest that some workflows still differ from upstream in behavioral depth.

### 推荐中文发布摘要

这个版本补齐了 gstack OpenCode 改造版的完整顶层 workflow 能力面，并为最关键的动作路径补上了自动化证据：修复、回归测试生成、commit、push 和 PR creation。现在这个仓库已经可以有力地宣称自己恢复了 OpenCode 形态下的 workflow-intent 覆盖，但仍然会如实说明：少数 workflow 在行为深度上与 upstream 还存在差异。

### Recommended Release Title

`v0.3.3 - OpenCode parity wave`
