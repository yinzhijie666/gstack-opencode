import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';
import { startStaticServer } from './helpers/static-server';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

function resolveQaArtifact(tmp: string, fileName: string, extension: '.md' | '.json'): string {
  const reportDir = path.join(tmp, '.gstack', 'qa-reports');
  const explicit = path.join(reportDir, fileName);
  if (fs.existsSync(explicit)) return explicit;

  const entries = fs.existsSync(reportDir)
    ? fs.readdirSync(reportDir).filter((entry) => entry.endsWith(extension)).sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`No QA artifact with extension ${extension} found in ${reportDir}`);
  }

  return path.join(reportDir, entries[0]);
}

describe('OpenCode QA smoke', () => {
  test.if(SHOULD_RUN)('qa command writes a report and baseline for the local fixture', () => {
    const tmp = createTempRepo('gstack-opencode-qa-');

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

    const server = startStaticServer(path.join(ROOT, 'browse', 'test', 'fixtures'));
    try {
      const smoke = runOpencodeCommand({
        cwd: tmp,
        commandName: 'qa',
        prompt: `Quick QA ${server.baseUrl}/qa-eval.html --quick. Report only. Do not modify code. Write the final report to .gstack/qa-reports/opencode-smoke.md and write a baseline summary to .gstack/qa-reports/opencode-smoke-baseline.json. Capture at least 2 high-confidence issues with browser evidence.`,
      });

      expect(smoke.exitCode).toBe(0);

      const reportPath = resolveQaArtifact(tmp, 'opencode-smoke.md', '.md');
      const baselinePath = resolveQaArtifact(tmp, 'opencode-smoke-baseline.json', '.json');

      expect(fs.existsSync(reportPath)).toBe(true);
      expect(fs.existsSync(baselinePath)).toBe(true);

      const report = fs.readFileSync(reportPath, 'utf-8');
      const baseline = fs.readFileSync(baselinePath, 'utf-8');

      expect(report).toContain('Health Score');
      expect(report).toContain('ISSUE-001');
      expect(report).toMatch(/TypeError|404|disabled/);
      expect(baseline).toContain('healthScore');
      expect(baseline).toContain('ISSUE-001');
    } finally {
      server.stop();
    }
  }, 1800000);
});
