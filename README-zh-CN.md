[English](README.md)

# gstack for OpenCode（中文版）

这是一个受 gstack 启发、面向 OpenCode 的原生 workflow stack，服务于想使用先进 AI 工作流、但无法依赖 Claude Code 的团队与开发者。

快速导航：[快速开始](#快速开始) · [验证状态](#验证状态) · [开源说明](#开源说明) · [发布检查清单](docs/open-source-release-checklist.md) · [文档索引](docs/README.md)

这个仓库是对原始 gstack 项目的 OpenCode 原生改造版本：`https://github.com/garrytan/gstack`。

它的目标用户，是那些认可 gstack 工作流理念、希望使用先进 AI 技能，但在自己的环境中无法使用 Claude Code 的开发者。这个仓库希望把原项目中有价值的 workflow 思路，变成在 OpenCode 中可落地、可本地运行、可持续演进的一条主线。

当前这个 OpenCode 改造版本，主线代码、文档、命令、技能和验证工作，都是围绕 OpenCode + `GPT-5.4`（模型标识 `openai/gpt-5.4`）来维护的。原始 upstream 项目仍然是产品理念和 workflow 命名的来源，而这个仓库承载的是 OpenCode 运行时、文档和验证层面的持续演进。

这份文档是 OpenCode 版本的 README。它描述的是当前仓库里 `.opencode/` 下已经实际落地的能力，而不是更早期的 pre-OpenCode 能力面。

## 当前状态

这个仓库现在以 OpenCode-first 作为唯一主线来维护。

- 它基于 `garrytan/gstack` 改造，但明确服务于无法依赖 Claude Code 的 OpenCode 用户。
- OpenCode 已经原生支持核心的规划、评审、QA、设计审查、调试、发布准备和文档更新流程。
- 其中不少 OpenCode workflow 目前还是有意收敛过的 v1 slice：先产出报告和可持久化工件，更深的自动化能力留到后续 OpenCode 阶段。

如果你只想看结论：当前 OpenCode 能力已经真实可用，下面列出的这些 workflow 在仓库里也有本地验证和 smoke coverage，但其中一部分仍然是有意设计成 report-first 或 report-only 的。

这个仓库会继续公开迭代。目标不是机械复制历史宿主行为，而是把 OpenCode 原生路径持续做强。

## 当前已落地能力

当前仓库里已经存在的 OpenCode 原生命令：

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

当前仓库里还没有原生迁移到 OpenCode 的命令：

- 当前历史顶层 workflow 名称都已经进入 OpenCode 主线

## 上游来源与当前范围

- 上游项目：`https://github.com/garrytan/gstack`
- 当前仓库尽量保留原项目的 workflow 命名与目标，再用 OpenCode 重建活跃能力面
- 这里不承诺“原项目所有历史能力都已经迁移完成”
- 这里承诺的是：凡是在本 README 里标记为已 shipped 的 workflow，都有对应的 OpenCode command/skill 合同，并且在仓库里有本地验证覆盖

## 快速开始

环境要求：

- OpenCode
- Bun v1.0+
- Git
- 本地可用的 Playwright Chromium（浏览器类 workflow 需要）

推荐在仓库根目录直接执行一次：

```bash
./setup
```

它会安装本地依赖、构建 `browse` 二进制、在需要时安装 Playwright Chromium，并把仓库准备成可直接在 OpenCode 中使用的状态。

如果你更喜欢手动执行，也仍然可以按下面的分步方式来做。

在仓库根目录执行：

```bash
bun install
bun run build
```

这会构建浏览器类 OpenCode workflow 所依赖的本地 `browse` 二进制。

然后在 OpenCode 中打开这个仓库，从下面这几个命令开始：

1. 对任意功能 brief 或 `PLAN.md` 运行 `/plan-ceo-review`
2. 在一个有本地变更的分支上运行 `/review`
3. 对显式的本地或 staging URL 运行 `/qa http://localhost:3000`
4. 当你想要一个本地发布就绪报告时运行 `/ship`

当前 OpenCode 行为的 source of truth 在 `.opencode/commands/` 和 `.opencode/skills/`。`README.claude.backup.md` 只作为历史归档保留。

## 模型与运行时

- 当前仓库的 OpenCode 改造主线基于 OpenCode + `GPT-5.4`
- 浏览器类 workflow 依赖本地 `browse` runtime 和 Playwright Chromium
- 如果你切换到别的 OpenCode 模型或 provider，行为细节可能会不同；当前文档和验证是按 `GPT-5.4` 路径编写和维护的

## 现在的 OpenCode 可以做什么

### Planning

- `/plan-ceo-review` 会在 `.gstack/plan-reports/` 下生成边界清晰的策略报告
- `/plan-eng-review` 会生成技术规划报告，包含架构摘要、数据流、风险和测试矩阵
- `/plan-design-review` 会生成设计导向的规划报告，包含 IA、交互覆盖、AI slop 风险和响应式/无障碍缺口

这些都是 report-first 的 slice。它们适合在真正开始实现之前，先把方案压测一遍。

### Review

- `/review` 是一个结构化的 pre-landing review
- 它会读取当前分支相对于本地 base branch 的 diff
- 它重点关注高信号问题类别，例如 SQL/数据安全、竞态/并发、信任边界，以及 enum/value 完整性
- 它会在 `.gstack/review-reports/` 下写出本地报告

注意：当你明确要求只做审查时，`/review` 会保持 report-first；但当你明确要求修复 obvious issues 时，它也可以进入受限的低风险 fix pass。

### QA

- `/qa` 会执行 browser-first QA，并在 `.gstack/qa-reports/` 下写出报告和 baseline
- `/qa-only` 使用相同的浏览器方法论，但明确是 report-only
- 两者都会使用本地 `browse` 二进制，并保留截图证据

注意：当你明确要求 report-only 或禁止改代码时，`/qa` 会保持 report-only；但当你明确要求修复问题、且仓库里存在可编辑的本地源码与测试路径时，它可以进入受限 fix loop，并在合适时补回 regression coverage。

### Design

- `/design-consultation` 会输出一个边界明确的设计方向报告
- `/design-review` 会针对一个显式的本地渲染页面做浏览器证据驱动的审查，并在 `.gstack/design-reports/` 下写出设计报告

注意：当你要求只做审查时，`/design-review` 会保持 audit-only；但当你明确要求修复、且本地存在可编辑源码时，它也可以对当前审查页面做受限 UI 修补并附带 before/after 证据。

### Debugging

- `/debug` 要求提供一个显式的本地复现命令
- 它会先调查 root cause，再在 `.gstack/debug-reports/` 下写出可持久化报告

### Release Prep

- `/ship` 会检查本地分支状态、测试状态和 review readiness
- 它会在 `.gstack/ship-reports/` 下写出发布准备报告

注意：`/ship` 默认仍然是 local-first 的。存在显式或明显的 repo-local 测试命令时它会运行；否则会返回 `NEEDS_TEST_COMMAND`。当你明确要求 commit、push 或 PR 准备时，它会在 readiness checks 全绿后再进入这些动作。

### 文档同步

- `/document-release` 会根据本地仓库变更，更新一组范围很窄、只做事实性修改的文档
- 它会在 `.gstack/document-release/` 下写出摘要工件

在当前 v1 slice 里，`README.md`、`README-zh-CN.md`、`AGENTS.md`、`ARCHITECTURE.md`、`CONTRIBUTING.md`、`TODOS.md` 和 `docs/**/*.md` 在作用范围内；`CHANGELOG.md`、`VERSION` 和 `README.claude.backup.md` 明确不在范围内。

## 一个更贴近现实的 OpenCode 使用流

```text
你:       /plan-ceo-review
OpenCode: 把策略报告写到 .gstack/plan-reports/

你:       /plan-eng-review
OpenCode: 输出技术报告，包含数据流、风险和测试

你:       /review
OpenCode: 针对当前分支写出结构化 review 报告

你:       /qa http://localhost:3000 --quick
OpenCode: 打开本地页面，采集截图和 console 证据，
          然后把 QA 报告和 baseline 写到 .gstack/qa-reports/

你:       /ship
OpenCode: 基于分支状态、测试结果和 review 工件，
          写出一份本地发布就绪报告
```

这就是当前 OpenCode 版本的承诺：有边界、可持久化的 workflow 工件，配合原生 OpenCode 命令，以及在适用时的本地验证能力。

## 验证状态

下面这些 OpenCode slice 在当前仓库里同时有静态资产校验和 smoke coverage：

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
- `/office-hours`
- `/retro`
- `/setup-browser-cookies`
- `/gstack-upgrade`

这意味着当前已 shipped 的 OpenCode workflow 不只是“文档里写了”，而是仓库里真的有可运行的验证。

更具体地说：

- `test/opencode-assets.test.ts` 用来校验已发布的 OpenCode command/skill 合同
- `test/opencode-*.test.ts` 为已迁移的 workflow 提供 smoke coverage
- `bun test` 覆盖这个仓库默认的 OpenCode 验证路径，而 smoke 运行会在需要时显式开启

如果你想自己复现当前 OpenCode 能力面的验证，可以运行：

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
OPENCODE_SMOKE=1 bun test test/opencode-design-review-fix-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-office-hours-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-retro-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-setup-browser-cookies-smoke.test.ts
OPENCODE_SMOKE=1 bun test test/opencode-gstack-upgrade-smoke.test.ts
```

这些是具有代表性的已迁移 workflow 验证，不应被解读为“上游历史路径已经全部迁移完成”。

更准确的公开表述应该是：当前仓库已经让“已迁移的 workflow surface”与原项目同名工作流的目标保持一致，并为这些已 shipped 的 OpenCode workflow 提供可运行的本地验证；但它还不能被描述成与原始宿主环境的完整功能 parity。

## 与 Claude 备份版 README 的区别

`README.claude.backup.md` 保留了更宽泛的历史版 gstack 叙事，以及更完整的 Claude 导向系统说明。

这份 README 是有意收窄过的：

- 它只记录真实存在于 `.opencode/commands/` 下的命令
- 它只声称当前 OpenCode skills 里已经实现的行为
- 它把 report-first slice 视作当前迁移阶段的产品特征，而不是“文档没写全”

如果某个 workflow 对你很重要，但它没有出现在这里，那就默认它不属于当前 OpenCode 主线能力；除非你能在 `.opencode/commands/` 下找到对应命令。

## 开源说明

- upstream 理念与历史系统：`garrytan/gstack`
- 当前仓库的活跃改造路径：OpenCode + `GPT-5.4`
- 许可证：MIT
- 仓库代码本身是开源的，但你实际使用 OpenCode 或模型服务时是否收费，取决于你的运行环境，而不是由本仓库承诺“永久免费”

## OpenCode 相关目录结构

关键的 OpenCode 原生资产在这些位置：

- `.opencode/commands/` - OpenCode 的 slash entrypoints
- `.opencode/skills/` - 可复用的 workflow 指令和合同
- `browse/` - 共享浏览器 runtime 和已编译的本地二进制
- `test/opencode-*-smoke.test.ts` - OpenCode smoke test 覆盖

## 故障排查

### `/browse` 或浏览器类 workflow 运行失败

先构建本地二进制，并确认 Chromium 已安装：

```bash
bun install
bun run build
npx playwright install chromium
```

### 浏览器类 workflow 提示 setup 缺失

大多数浏览器类 OpenCode slice 都要求仓库里存在 `./browse/dist/browse`。

### 命令只写报告、不直接改代码

这通常是当前 OpenCode 迁移阶段的有意设计。你可以去 `.opencode/skills/` 里看对应 slice 是否标记为 report-first 或 report-only。

## License

MIT。开源可 fork，可继续改，可继续把 OpenCode 这条路做得更好。
