import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode office-hours smoke', () => {
  test.if(SHOULD_RUN)('office-hours writes a bounded local memo', () => {
    const tmp = createTempRepo('gstack-opencode-office-hours-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/office-hours.md',
      '.opencode/skills/office-hours/SKILL.md',
      'test/fixtures/office-hours-smoke/IDEA.md',
    ]);

    fs.renameSync(path.join(tmp, 'test', 'fixtures', 'office-hours-smoke', 'IDEA.md'), path.join(tmp, 'IDEA.md'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'office-hours-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/office-hours-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'office-hours',
      prompt: 'Review IDEA.md and write the memo to .gstack/office-hours/opencode-smoke.md. Include Inputs Reviewed, Core Question, Demand Reality, Status Quo, Narrowest Wedge, Recommended Next Step, and Not In Scope. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'office-hours', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('Core Question');
    expect(report).toContain('Demand Reality');
    expect(report).toContain('Status Quo');
    expect(report).toContain('Narrowest Wedge');
    expect(report).toContain('Recommended Next Step');
    expect(report).toContain('Not In Scope');
  }, 1800000);
});
