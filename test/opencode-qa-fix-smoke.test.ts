import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';
import { startStaticServer } from './helpers/static-server';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode QA fix smoke', () => {
  test.if(SHOULD_RUN)('qa fixes explicit local issues when asked to do so', () => {
    const tmp = createTempRepo('gstack-opencode-qa-fix-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/qa.md',
      '.opencode/skills/qa/SKILL.md',
      '.opencode/skills/browse/SKILL.md',
      'qa/templates/qa-report-template.md',
      'qa/references/issue-taxonomy.md',
    ]);

    fs.mkdirSync(path.join(tmp, 'browse', 'dist'), { recursive: true });
    const browseBinary = path.join(tmp, 'browse', 'dist', 'browse');
    fs.copyFileSync(path.join(ROOT, 'browse', 'dist', 'browse'), browseBinary);
    fs.chmodSync(browseBinary, 0o755);

    const fixture = fs.readFileSync(path.join(ROOT, 'browse', 'test', 'fixtures', 'qa-eval.html'), 'utf-8');
    writeRepoFile(tmp, 'qa-eval.html', fixture);

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/qa-fix-smoke');

    const server = startStaticServer(tmp);
    try {
      const smoke = runOpencodeCommand({
        cwd: tmp,
        commandName: 'qa',
        prompt: `Open ${server.baseUrl}/qa-eval.html, fix exactly these two issues in the local qa-eval.html source file: the broken Resources link and the permanently disabled submit button, then write the report to .gstack/qa-reports/opencode-fix-smoke.md and the baseline to .gstack/qa-reports/opencode-fix-smoke-baseline.json. Do not commit or push.`,
      });

      expect(smoke.exitCode).toBe(0);

      const reportPath = path.join(tmp, '.gstack', 'qa-reports', 'opencode-fix-smoke.md');
      expect(fs.existsSync(reportPath)).toBe(true);

      const updated = fs.readFileSync(path.join(tmp, 'qa-eval.html'), 'utf-8');
      expect(updated).not.toContain('/nonexistent-404-page');
      expect(updated).not.toContain('<button type="submit" disabled>');
    } finally {
      server.stop();
    }
  }, 1800000);
});
