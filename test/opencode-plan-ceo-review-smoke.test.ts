import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode plan-ceo-review smoke', () => {
  test.if(SHOULD_RUN)('plan-ceo-review writes a bounded strategy report', () => {
    const tmp = createTempRepo('gstack-opencode-plan-ceo-review-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/plan-ceo-review.md',
      '.opencode/skills/plan-ceo-review/SKILL.md',
      'test/fixtures/plan-ceo-review-smoke/PLAN.md',
    ]);

    fs.renameSync(path.join(tmp, 'test', 'fixtures', 'plan-ceo-review-smoke', 'PLAN.md'), path.join(tmp, 'PLAN.md'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'plan-ceo-review-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/plan-ceo-review-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'plan-ceo-review',
      prompt: 'Review PLAN.md and write the report to .gstack/plan-reports/opencode-smoke.md. Include Inputs Reviewed, Premise Challenge, 10x Check, Alternative Approaches, Recommendation, Scope For This Slice, Deferrals, Local Validation, and Not In Scope. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'plan-reports', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('Premise Challenge');
    expect(report).toContain('10x Check');
    expect(report).toContain('Alternative Approaches');
    expect(report).toContain('Recommendation');
    expect(report).toContain('Scope For This Slice');
    expect(report).toContain('Deferrals');
    expect(report).toContain('Local Validation');
    expect(report).toContain('Not In Scope');
  }, 1800000);
});
