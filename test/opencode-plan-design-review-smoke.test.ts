import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode plan-design-review smoke', () => {
  test.if(SHOULD_RUN)('plan-design-review writes a bounded design strategy report', () => {
    const tmp = createTempRepo('gstack-opencode-plan-design-review-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/plan-design-review.md',
      '.opencode/skills/plan-design-review/SKILL.md',
      'test/fixtures/plan-design-review-smoke/PLAN.md',
    ]);

    fs.renameSync(path.join(tmp, 'test', 'fixtures', 'plan-design-review-smoke', 'PLAN.md'), path.join(tmp, 'PLAN.md'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'plan-design-review-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/plan-design-review-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'plan-design-review',
      prompt: 'Review PLAN.md and write the report to .gstack/plan-reports/opencode-smoke.md. Include Inputs Reviewed, UI Scope Decision, Information Architecture, Interaction State Coverage, AI Slop Risk, Responsive & Accessibility Gaps, Scope For This Slice, Deferrals, Local Validation, and Not In Scope. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'plan-reports', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('UI Scope Decision');
    expect(report).toContain('Information Architecture');
    expect(report).toContain('Interaction State Coverage');
    expect(report).toContain('AI Slop Risk');
    expect(report).toContain('Responsive & Accessibility Gaps');
    expect(report).toContain('Scope For This Slice');
    expect(report).toContain('Deferrals');
    expect(report).toContain('Local Validation');
    expect(report).toContain('Not In Scope');
  }, 1800000);
});
