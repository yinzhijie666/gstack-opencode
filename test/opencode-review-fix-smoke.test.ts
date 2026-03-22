import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, checkoutBranch, initCommittedRepo, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

function findGeneratedReport(reportDir: string): string {
  const explicit = path.join(reportDir, 'opencode-smoke.md');
  if (fs.existsSync(explicit)) return explicit;

  const entries = fs.existsSync(reportDir)
    ? fs.readdirSync(reportDir).filter((entry) => entry.endsWith('.md')).sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`No review report found in ${reportDir}`);
  }

  return path.join(reportDir, entries[0]);
}

describe('OpenCode review fix smoke', () => {
  test.if(SHOULD_RUN)('review fixes obvious enum completeness issues when explicitly asked', () => {
    const tmp = createTempRepo('gstack-opencode-review-fix-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/review.md',
      '.opencode/skills/review/SKILL.md',
      'review/checklist.md',
    ]);

    const mainFixture = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'review-eval-enum.rb'), 'utf-8');
    const diffFixture = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'review-eval-enum-diff.rb'), 'utf-8');

    writeRepoFile(tmp, 'order.rb', mainFixture);
    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/review-fix-smoke');

    writeRepoFile(tmp, 'order.rb', diffFixture);

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'review',
      prompt: 'Review this branch, fix the obvious enum completeness issues in order.rb, and write the report to .gstack/review-reports/opencode-smoke.md. Apply low-risk local fixes only.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = findGeneratedReport(path.join(tmp, '.gstack', 'review-reports'));
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toMatch(/Fixes Applied|AUTO-FIXED/);

    const updated = fs.readFileSync(path.join(tmp, 'order.rb'), 'utf-8');
    expect(updated).toContain("when 'returned'");
  }, 1800000);
});
