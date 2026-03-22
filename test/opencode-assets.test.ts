/// <reference path="../bun-shim.d.ts" />

import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

function read(file: string): string {
  return fs.readFileSync(path.join(ROOT, file), 'utf-8');
}

describe('OpenCode migration assets', () => {
  test('AGENTS.md exists and encodes the OpenCode-first repo target', () => {
    const content = read('AGENTS.md');
    expect(content).toContain('OpenCode-native version of gstack');
    expect(content).toContain('https://github.com/garrytan/gstack');
    expect(content).toContain('GPT-5.4');
    expect(content).toContain('shared runtime and reusable workflow assets');
    expect(content).toContain('.opencode/commands/');
    expect(content).toContain('.opencode/skills/');
    expect(content).toContain('historical archive only');
  });

  test('README positions the repo as an OpenCode adaptation of upstream gstack', () => {
    const content = read('README.md');
    expect(content).toContain('https://github.com/garrytan/gstack');
    expect(content).toContain('cannot use Claude Code');
    expect(content).toContain('OpenCode + `GPT-5.4`');
    expect(content).toContain('test/opencode-assets.test.ts');
    expect(content).toContain('test/opencode-*.test.ts');
  });

  test('Chinese README mirrors the upstream, model, and validation positioning', () => {
    const content = read('README-zh-CN.md');
    expect(content).toContain('https://github.com/garrytan/gstack');
    expect(content).toContain('无法使用 Claude Code');
    expect(content).toContain('OpenCode + `GPT-5.4`');
    expect(content).toContain('test/opencode-assets.test.ts');
    expect(content).toContain('test/opencode-*.test.ts');
  });

  test('OpenCode browse skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/browse/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: browse');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode browse skill prefers repo-local binary and setup fallback', () => {
    const content = read('.opencode/skills/browse/SKILL.md');
    expect(content).toContain('./browse/dist/browse');
    expect(content).toContain('NEEDS_SETUP');
    expect(content).toContain('bun run build');
    expect(content).toContain('playwright install chromium');
  });

  test('OpenCode browse command exists and delegates through the browse skill', () => {
    const content = read('.opencode/commands/browse.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Use gstack browse');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `browse` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode qa skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/qa/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: qa');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode qa skill supports report-first mode and optional fix loops while referencing shared QA assets', () => {
    const content = read('.opencode/skills/qa/SKILL.md');
    expect(content).toContain('qa/templates/qa-report-template.md');
    expect(content).toContain('qa/references/issue-taxonomy.md');
    expect(content).toContain('.gstack/qa-reports/');
    expect(content).toContain('If the request explicitly asks to fix issues');
    expect(content).toContain('regression coverage');
    expect(content).toContain('Load the `browse` skill first');
  });

  test('OpenCode qa skill does not leak Claude-specific host assumptions', () => {
    const content = read('.opencode/skills/qa/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('Contributor Mode');
    expect(content).not.toContain('gstack_contributor');
  });

  test('OpenCode qa command exists and delegates through browse plus qa skills', () => {
    const content = read('.opencode/commands/qa.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Run browser-first QA');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `browse` and `qa` skills');
    expect(content).toContain('$ARGUMENTS');
    expect(content).toContain('bounded fix loop');
  });

  test('OpenCode qa-only skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/qa-only/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: qa-only');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode qa-only skill is report-only and references shared QA assets', () => {
    const content = read('.opencode/skills/qa-only/SKILL.md');
    expect(content).toContain('Load the `browse` skill first');
    expect(content).toContain('qa/templates/qa-report-template.md');
    expect(content).toContain('qa/references/issue-taxonomy.md');
    expect(content).toContain('.gstack/qa-reports/');
    expect(content).toContain('Do not suggest fixes in the report');
    expect(content).toContain('Use `/qa` when the user wants the test-fix-verify loop');
  });

  test('OpenCode qa-only skill does not leak Claude-specific or fix-loop behavior', () => {
    const content = read('.opencode/skills/qa-only/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('git commit');
    expect(content).not.toContain('Write a regression test');
  });

  test('OpenCode qa-only command exists and delegates through browse plus qa-only skills', () => {
    const content = read('.opencode/commands/qa-only.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Run browser-first QA in report-only mode');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `browse` and `qa-only` skills');
    expect(content).toContain('$ARGUMENTS');
    expect(content).toContain('Do not modify code or suggest fixes');
  });

  test('OpenCode review skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/review/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: review');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode review skill references checklist plus local reports and can optionally fix obvious issues', () => {
    const content = read('.opencode/skills/review/SKILL.md');
    expect(content).toContain('review/checklist.md');
    expect(content).toContain('.gstack/review-reports/');
    expect(content).toContain('must apply bounded local fixes');
    expect(content).toContain('Fixes Applied');
    expect(content).toContain('Enum & Value Completeness');
    expect(content).toContain('origin/main');
  });

  test('OpenCode review skill does not leak Claude-specific host assumptions', () => {
    const content = read('.opencode/skills/review/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('Greptile');
    expect(content).not.toContain('.claude/skills');
  });

  test('OpenCode review command exists and delegates through the review skill', () => {
    const content = read('.opencode/commands/review.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Run a structural pre-landing code review');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `review` skill');
    expect(content).toContain('$ARGUMENTS');
    expect(content).toContain('apply low-risk local fixes for the highest-confidence findings');
  });

  test('OpenCode document-release skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/document-release/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: document-release');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode document-release skill is local-only and writes durable summaries', () => {
    const content = read('.opencode/skills/document-release/SKILL.md');
    expect(content).toContain('.gstack/document-release/');
    expect(content).toContain('README.md');
    expect(content).toContain('README-zh-CN.md');
    expect(content).toContain('AGENTS.md');
    expect(content).toContain('ARCHITECTURE.md');
    expect(content).toContain('CONTRIBUTING.md');
    expect(content).toContain('TODOS.md');
    expect(content).toContain('docs/**/*.md');
    expect(content).toContain('factual updates only');
  });

  test('OpenCode document-release skill does not leak Claude-only or ship-only behavior', () => {
    const content = read('.opencode/skills/document-release/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('CLAUDE.md');
    expect(content).not.toContain('gh ');
    expect(content).not.toContain('git push');
    expect(content).not.toContain('git commit');
  });

  test('OpenCode document-release command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/document-release.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Update project docs from local changes');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `document-release` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode debug skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/debug/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: debug');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode debug skill is report-first and requires local reproduction', () => {
    const content = read('.opencode/skills/debug/SKILL.md');
    expect(content).toContain('.gstack/debug-reports/');
    expect(content).toContain('explicit local reproduction command');
    expect(content).toContain('Iron Law');
    expect(content).toContain('ROOT_CAUSE_FOUND');
  });

  test('OpenCode debug skill does not leak Claude-only or fix-loop behavior', () => {
    const content = read('.opencode/skills/debug/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('git commit');
    expect(content).not.toContain('Write a regression test');
  });

  test('OpenCode debug command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/debug.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Investigate a local bug and write a root-cause report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `debug` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode plan-eng-review skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/plan-eng-review/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: plan-eng-review');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode plan-eng-review skill defines bounded report outputs', () => {
    const content = read('.opencode/skills/plan-eng-review/SKILL.md');
    expect(content).toContain('.gstack/plan-reports/');
    expect(content).toContain('Architecture Summary');
    expect(content).toContain('Data Flow');
    expect(content).toContain('Test Matrix');
    expect(content).toContain('Not In Scope');
  });

  test('OpenCode plan-eng-review skill does not leak Claude-only interactivity', () => {
    const content = read('.opencode/skills/plan-eng-review/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('reviews.jsonl');
    expect(content).not.toContain('STOP.');
  });

  test('OpenCode plan-eng-review command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/plan-eng-review.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Review an engineering plan and write a technical report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `plan-eng-review` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode ship skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/ship/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: ship');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode ship skill writes ship reports and supports explicit shipping actions', () => {
    const content = read('.opencode/skills/ship/SKILL.md');
    expect(content).toContain('.gstack/ship-reports/');
    expect(content).toContain('Review Readiness');
    expect(content).toContain('Verification');
    expect(content).toContain('Release Prep Status');
    expect(content).toContain('Optional Shipping Actions');
  });

  test('OpenCode ship skill keeps shipping actions explicit and bounded', () => {
    const content = read('.opencode/skills/ship/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).toContain('must carry out the requested action');
    expect(content).toContain('push or PR creation');
  });

  test('OpenCode ship command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/ship.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Prepare a local branch for shipping and write a readiness report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `ship` skill');
    expect(content).toContain('$ARGUMENTS');
    expect(content).toContain('perform those actions only after readiness checks pass');
  });

  test('OpenCode plan-ceo-review skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/plan-ceo-review/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: plan-ceo-review');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode plan-ceo-review skill defines bounded report outputs', () => {
    const content = read('.opencode/skills/plan-ceo-review/SKILL.md');
    expect(content).toContain('.gstack/plan-reports/');
    expect(content).toContain('Premise Challenge');
    expect(content).toContain('10x Check');
    expect(content).toContain('Alternative Approaches');
    expect(content).toContain('Scope For This Slice');
  });

  test('OpenCode plan-ceo-review skill does not leak Claude-only interactivity', () => {
    const content = read('.opencode/skills/plan-ceo-review/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('reviews.jsonl');
  });

  test('OpenCode plan-ceo-review command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/plan-ceo-review.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Review a product plan like a CEO/founder and write a strategy report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `plan-ceo-review` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode plan-design-review skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/plan-design-review/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: plan-design-review');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode plan-design-review skill defines bounded report outputs', () => {
    const content = read('.opencode/skills/plan-design-review/SKILL.md');
    expect(content).toContain('.gstack/plan-reports/');
    expect(content).toContain('UI Scope Decision');
    expect(content).toContain('Information Architecture');
    expect(content).toContain('Interaction State Coverage');
    expect(content).toContain('AI Slop Risk');
    expect(content).toContain('Responsive & Accessibility Gaps');
  });

  test('OpenCode plan-design-review skill does not leak Claude-only interactivity', () => {
    const content = read('.opencode/skills/plan-design-review/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('reviews.jsonl');
  });

  test('OpenCode plan-design-review command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/plan-design-review.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Review a product plan from a design perspective and write a report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `plan-design-review` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode design-consultation skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/design-consultation/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: design-consultation');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode design-consultation skill defines bounded report outputs', () => {
    const content = read('.opencode/skills/design-consultation/SKILL.md');
    expect(content).toContain('.gstack/design-reports/');
    expect(content).toContain('Product Mood');
    expect(content).toContain('Safe Choices');
    expect(content).toContain('Creative Risks');
    expect(content).toContain('Design System Direction');
    expect(content).toContain('Validation Strategy');
  });

  test('OpenCode design-consultation skill does not leak Claude-only or preview-generation behavior', () => {
    const content = read('.opencode/skills/design-consultation/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('WebSearch');
    expect(content).not.toContain('open "$PREVIEW_FILE"');
    expect(content).not.toContain('CLAUDE.md');
  });

  test('OpenCode design-consultation command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/design-consultation.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Propose a product design direction and write a bounded report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `design-consultation` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode design-review skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/design-review/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: design-review');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode design-review skill defines a bounded browser-evidence report contract with optional fix mode', () => {
    const content = read('.opencode/skills/design-review/SKILL.md');
    expect(content).toContain('Load the `browse` skill first');
    expect(content).toContain('.gstack/design-reports/');
    expect(content).toContain('Browser Evidence');
    expect(content).toContain('First Impression');
    expect(content).toContain('Inferred Design System');
    expect(content).toContain('High-Confidence Findings');
    expect(content).toContain('AI Slop Signals');
    expect(content).toContain('Responsive & Accessibility Observations');
    expect(content).toContain('Capture at least one screenshot artifact');
    expect(content).toContain('Optional Fix Loop');
    expect(content).toContain('before/after evidence');
  });

  test('OpenCode design-review skill does not leak Claude-only or fix-loop behavior', () => {
    const content = read('.opencode/skills/design-review/SKILL.md');
    expect(content).not.toContain('AskUserQuestion');
    expect(content).not.toContain('.claude/skills');
    expect(content).not.toContain('WebSearch');
    expect(content).not.toContain('git commit');
    expect(content).not.toContain('git revert');
  });

  test('OpenCode design-review command exists and delegates through browse plus the design-review skill', () => {
    const content = read('.opencode/commands/design-review.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Audit a local rendered page from a design perspective and write a bounded report');
    expect(content).toContain('agent: build');
    expect(content).toContain('Load the `browse` and `design-review` skills');
    expect(content).toContain('$ARGUMENTS');
    expect(content).toContain('bounded local UI fixes');
  });

  test('OpenCode office-hours skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/office-hours/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: office-hours');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode office-hours skill defines a bounded local memo', () => {
    const content = read('.opencode/skills/office-hours/SKILL.md');
    expect(content).toContain('.gstack/office-hours/');
    expect(content).toContain('Core Question');
    expect(content).toContain('Demand Reality');
    expect(content).toContain('Narrowest Wedge');
    expect(content).toContain('Do not modify code');
  });

  test('OpenCode office-hours command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/office-hours.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Explore an idea like YC office hours');
    expect(content).toContain('Load the `office-hours` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode retro skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/retro/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: retro');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode retro skill defines a bounded local retrospective', () => {
    const content = read('.opencode/skills/retro/SKILL.md');
    expect(content).toContain('.gstack/retro/');
    expect(content).toContain('Shipping Summary');
    expect(content).toContain('Wins');
    expect(content).toContain('Friction');
    expect(content).toContain('Test Health Signals');
  });

  test('OpenCode retro command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/retro.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Review recent local repo history');
    expect(content).toContain('Load the `retro` skill');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode setup-browser-cookies skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/setup-browser-cookies/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: setup-browser-cookies');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode setup-browser-cookies skill is browse-backed and writes local setup summaries', () => {
    const content = read('.opencode/skills/setup-browser-cookies/SKILL.md');
    expect(content).toContain('Load the `browse` skill first');
    expect(content).toContain('cookie-import-browser');
    expect(content).toContain('.gstack/browser-session/');
    expect(content).toContain('Do not modify code');
  });

  test('OpenCode setup-browser-cookies command exists and delegates through browse plus the skill', () => {
    const content = read('.opencode/commands/setup-browser-cookies.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Prepare authenticated browser sessions');
    expect(content).toContain('Load the `browse` and `setup-browser-cookies` skills');
    expect(content).toContain('$ARGUMENTS');
  });

  test('OpenCode gstack-upgrade skill exists with valid required frontmatter', () => {
    const content = read('.opencode/skills/gstack-upgrade/SKILL.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('name: gstack-upgrade');
    expect(content).toContain('compatibility: opencode');
  });

  test('OpenCode gstack-upgrade skill defines a bounded readiness report', () => {
    const content = read('.opencode/skills/gstack-upgrade/SKILL.md');
    expect(content).toContain('.gstack/gstack-upgrade/');
    expect(content).toContain('Version Check');
    expect(content).toContain('Setup State');
    expect(content).toContain('Recommended Action');
    expect(content).toContain('CURRENT');
    expect(content).toContain('NEEDS_SETUP');
  });

  test('OpenCode gstack-upgrade command exists and delegates through the skill', () => {
    const content = read('.opencode/commands/gstack-upgrade.md');
    expect(content.startsWith('---\n')).toBe(true);
    expect(content).toContain('description: Check local gstack setup health');
    expect(content).toContain('Load the `gstack-upgrade` skill');
    expect(content).toContain('$ARGUMENTS');
  });
});
