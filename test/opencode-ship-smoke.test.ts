import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

function resolveShipReport(tmp: string): string {
  const reportDir = path.join(tmp, '.gstack', 'ship-reports');
  const explicit = path.join(reportDir, 'opencode-smoke.md');
  if (fs.existsSync(explicit)) return explicit;

  const entries = fs.existsSync(reportDir)
    ? fs.readdirSync(reportDir).filter((entry) => entry.endsWith('.md')).sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`No ship report found in ${reportDir}`);
  }

  return path.join(reportDir, entries[0]);
}

function seedShipRepo(tmp: string, testScript: string, reviewReport: string): void {
  copyFilesFromRoot(ROOT, tmp, [
    '.opencode/commands/ship.md',
    '.opencode/skills/ship/SKILL.md',
  ]);

  writeRepoFile(tmp, 'package.json', JSON.stringify({
    name: 'ship-smoke',
    scripts: { test: testScript },
  }, null, 2) + '\n');
  writeRepoFile(tmp, 'src/feature.js', 'export const feature = true;\n');

  initCommittedRepo(tmp);
  checkoutBranch(tmp, 'feature/ship-smoke');

  writeRepoFile(tmp, 'src/feature.js', 'export const feature = "changed";\n');
  writeRepoFile(tmp, '.gstack/review-reports/review-ok.md', reviewReport);
}

describe('OpenCode ship smoke', () => {
  test.if(SHOULD_RUN)('ship command writes a ready-local report for a healthy branch', () => {
    const tmp = createTempRepo('gstack-opencode-ship-ready-');
    seedShipRepo(tmp, 'node -e "process.exit(0)"', 'Pre-Landing Review: No issues found.\n');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'ship',
      prompt: 'Prepare this branch for shipping and write the report to .gstack/ship-reports/opencode-smoke.md. Use the local test command. Do not commit or push.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = resolveShipReport(tmp);
    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toMatch(/READY_LOCAL|Release Prep Status|Ship Decision/);
    expect(report).toContain('Verification');
    expect(report).toContain('Review Readiness');
    expect(report).toContain('REVIEW_READY');
  }, 1800000);

  test.if(SHOULD_RUN)('ship command writes a blocked report when tests fail', () => {
    const tmp = createTempRepo('gstack-opencode-ship-blocked-');
    seedShipRepo(tmp, 'node -e "process.exit(1)"', 'Pre-Landing Review: 1 issues (1 critical, 0 informational)\n- [CRITICAL] src/feature.js:1 - example\n');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'ship',
      prompt: 'Prepare this branch for shipping and write the report to .gstack/ship-reports/opencode-smoke.md. Use the local test command. Do not commit or push.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = resolveShipReport(tmp);
    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toMatch(/BLOCKED|NOT READY|BLOCKED_TESTS|BLOCKED_REVIEW/);
    expect(report).toContain('Ship Decision');
  }, 1800000);
});
