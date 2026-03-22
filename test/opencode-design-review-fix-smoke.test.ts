import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';
import { startStaticServer } from './helpers/static-server';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

function findGeneratedReport(reportDir: string): string {
  const explicit = path.join(reportDir, 'opencode-fix-smoke.md');
  if (fs.existsSync(explicit)) return explicit;

  const entries = fs.existsSync(reportDir)
    ? fs.readdirSync(reportDir).filter((entry) => entry.endsWith('.md')).sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`No design-review fix report found in ${reportDir}`);
  }

  return path.join(reportDir, entries[0]);
}

describe('OpenCode design-review fix smoke', () => {
  test.if(SHOULD_RUN)('design-review fixes explicit local UI issues when asked', () => {
    const tmp = createTempRepo('gstack-opencode-design-review-fix-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/design-review.md',
      '.opencode/skills/design-review/SKILL.md',
      '.opencode/skills/browse/SKILL.md',
    ]);

    fs.mkdirSync(path.join(tmp, 'browse', 'dist'), { recursive: true });
    const browseBinary = path.join(tmp, 'browse', 'dist', 'browse');
    fs.copyFileSync(path.join(ROOT, 'browse', 'dist', 'browse'), browseBinary);
    fs.chmodSync(browseBinary, 0o755);

    const fixture = fs.readFileSync(path.join(ROOT, 'browse', 'test', 'fixtures', 'design-review-eval.html'), 'utf-8');
    writeRepoFile(tmp, 'design-review-eval.html', fixture);

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/design-review-fix-smoke');

    const server = startStaticServer(tmp);
    try {
      const smoke = runOpencodeCommand({
        cwd: tmp,
        commandName: 'design-review',
        prompt: `Audit ${server.baseUrl}/design-review-eval.html, fix exactly these two issues in the local design-review-eval.html source file, and write the report to .gstack/design-reports/opencode-fix-smoke.md: replace the generic Arial font choice and remove the hero min-width that causes mobile overflow. Capture before/after evidence.`,
      });

      expect(smoke.exitCode).toBe(0);

      const reportPath = findGeneratedReport(path.join(tmp, '.gstack', 'design-reports'));
      expect(fs.existsSync(reportPath)).toBe(true);

      const updated = fs.readFileSync(path.join(tmp, 'design-review-eval.html'), 'utf-8');
      expect(updated).not.toContain('font-family: Arial, sans-serif;');
      expect(updated).not.toContain('min-width: 940px;');
    } finally {
      server.stop();
    }
  }, 1800000);
});
