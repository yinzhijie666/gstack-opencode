import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';
import { startStaticServer } from './helpers/static-server';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode QA regression smoke', () => {
  test.if(SHOULD_RUN)('qa adds regression coverage when a clear local test path exists', () => {
    const tmp = createTempRepo('gstack-opencode-qa-regression-');

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
    writeRepoFile(tmp, 'package.json', JSON.stringify({
      name: 'qa-regression-smoke',
      scripts: { test: 'bun test' },
    }, null, 2) + '\n');
    writeRepoFile(tmp, 'test/existing.test.ts', "import { test, expect } from 'bun:test';\ntest('baseline', () => { expect(1).toBe(1); });\n");

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/qa-regression-smoke');

    const server = startStaticServer(tmp);
    try {
      const smoke = runOpencodeCommand({
        cwd: tmp,
        commandName: 'qa',
        prompt: `Open ${server.baseUrl}/qa-eval.html, fix exactly these two issues in qa-eval.html: the broken Resources link and the permanently disabled submit button. Then write exactly one regression test to test/qa-eval-regression.test.ts that reads qa-eval.html and verifies those two issues stay fixed, run only bun test test/qa-eval-regression.test.ts, and write the QA report to .gstack/qa-reports/opencode-regression-smoke.md and the baseline to .gstack/qa-reports/opencode-regression-smoke-baseline.json. Do not commit or push.`,
      });

      expect(smoke.exitCode).toBe(0);

      const testDir = path.join(tmp, 'test');
      const generatedTests = fs.readdirSync(testDir).filter((entry) => entry.endsWith('.test.ts'));
      expect(generatedTests).toContain('qa-eval-regression.test.ts');

      const testRun = Bun.spawnSync(['bun', 'test', 'test/qa-eval-regression.test.ts'], { cwd: tmp, stdout: 'pipe', stderr: 'pipe' });
      expect(testRun.exitCode).toBe(0);
    } finally {
      server.stop();
    }
  }, 1800000);
});
