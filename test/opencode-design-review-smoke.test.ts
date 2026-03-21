/// <reference path="../bun-shim.d.ts" />

import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';
import { startStaticServer } from './helpers/static-server';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

function findGeneratedReport(reportDir: string): string {
  const explicit = path.join(reportDir, 'opencode-smoke.md');
  if (fs.existsSync(explicit)) return explicit;

  const entries = fs.existsSync(reportDir)
    ? fs.readdirSync(reportDir).filter((entry) => entry.endsWith('.md')).sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`No design-review report found in ${reportDir}`);
  }

  return path.join(reportDir, entries[0]);
}

describe('OpenCode design-review smoke', () => {
  test.if(SHOULD_RUN)('design-review writes a bounded report and screenshot evidence for the local fixture', () => {
    const tmp = createTempRepo('gstack-opencode-design-review-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/design-review.md',
      '.opencode/skills/design-review/SKILL.md',
      '.opencode/skills/browse/SKILL.md',
    ]);

    fs.mkdirSync(path.join(tmp, 'browse', 'dist'), { recursive: true });
    const browseBinary = path.join(tmp, 'browse', 'dist', 'browse');
    fs.copyFileSync(path.join(ROOT, 'browse', 'dist', 'browse'), browseBinary);
    fs.chmodSync(browseBinary, 0o755);

    const server = startStaticServer(path.join(ROOT, 'browse', 'test', 'fixtures'));
    try {
      const smoke = runOpencodeCommand({
        cwd: tmp,
        commandName: 'design-review',
        prompt: `Audit only ${server.baseUrl}/design-review-eval.html and write the report to .gstack/design-reports/opencode-smoke.md. Use exactly the required section order. Record exactly 3 findings labeled FINDING-001, FINDING-002, and FINDING-003. Create screenshot artifacts under .gstack/design-reports/screenshots/. Do not modify code.`,
      });

      expect(smoke.exitCode).toBe(0);

      const reportDir = path.join(tmp, '.gstack', 'design-reports');
      const reportPath = findGeneratedReport(reportDir);
      const screenshotDir = path.join(reportDir, 'screenshots');

      expect(fs.existsSync(reportDir)).toBe(true);
      expect(fs.existsSync(screenshotDir)).toBe(true);

      const screenshots = fs.readdirSync(screenshotDir).filter((entry) => entry.endsWith('.png'));
      expect(screenshots.length).toBeGreaterThanOrEqual(1);

      const report = fs.readFileSync(reportPath, 'utf-8');
      expect(report).toContain('Browser Evidence');
      expect(report).toContain('First Impression');
      expect(report).toContain('Inferred Design System');
      expect(report).toContain('High-Confidence Findings');
      expect(report).toContain('AI Slop Signals');
      expect(report).toContain('Responsive & Accessibility Observations');
      expect(report).toContain('Deferrals');
      expect(report).toContain('Local Validation');
      expect(report).toContain('Not In Scope');
      expect(report).toContain('FINDING-001');
      expect(report).toContain('FINDING-002');
      expect(report).toContain('FINDING-003');
      expect(report).toContain('screenshots/');
      expect(report).toContain('design-review-eval.html');
    } finally {
      server.stop();
    }
  }, 1800000);
});
