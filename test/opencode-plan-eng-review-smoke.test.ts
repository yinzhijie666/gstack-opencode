import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode plan-eng-review smoke', () => {
  test.if(SHOULD_RUN)('plan-eng-review writes a bounded technical plan report', () => {
    const tmp = createTempRepo('gstack-opencode-plan-eng-review-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/plan-eng-review.md',
      '.opencode/skills/plan-eng-review/SKILL.md',
      'test/fixtures/plan-eng-review-smoke/PLAN.md',
    ]);

    fs.renameSync(path.join(tmp, 'test', 'fixtures', 'plan-eng-review-smoke', 'PLAN.md'), path.join(tmp, 'PLAN.md'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'plan-eng-review-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/plan-eng-review-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'plan-eng-review',
      prompt: 'Review PLAN.md and write the report to .gstack/plan-reports/opencode-smoke.md. Include Inputs Reviewed, Architecture Summary, Data Flow, Risks, Test Matrix, and Not In Scope. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'plan-reports', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('Architecture Summary');
    expect(report).toContain('Data Flow');
    expect(report).toContain('Risks');
    expect(report).toContain('Test Matrix');
    expect(report).toContain('Not In Scope');
  }, 1800000);
});
