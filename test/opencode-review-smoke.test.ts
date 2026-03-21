import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, checkoutBranch, initCommittedRepo, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode review smoke', () => {
  test.if(SHOULD_RUN)('review command finds structural issues in fixture repo', () => {
    const tmp = createTempRepo('gstack-opencode-review-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/review.md',
      '.opencode/skills/review/SKILL.md',
      'review/checklist.md',
    ]);

    const mainFixture = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'review-eval-enum.rb'), 'utf-8');
    const diffFixture = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'review-eval-enum-diff.rb'), 'utf-8');

    writeRepoFile(tmp, 'order.rb', mainFixture);
    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/review-smoke');

    writeRepoFile(tmp, 'order.rb', diffFixture);

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'review',
      prompt: 'Review this branch and write the report to .gstack/review-reports/opencode-smoke.md. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'review-reports', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Pre-Landing Review');
    expect(report).toContain('returned');
    expect(report).toMatch(/display_status|status_label|notify_customer/);
  }, 1800000);
});
