import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
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
    throw new Error(`No gstack-upgrade report found in ${reportDir}`);
  }

  return path.join(reportDir, entries[0]);
}

describe('OpenCode gstack-upgrade smoke', () => {
  test.if(SHOULD_RUN)('gstack-upgrade writes a bounded local readiness report', () => {
    const tmp = createTempRepo('gstack-opencode-gstack-upgrade-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/gstack-upgrade.md',
      '.opencode/skills/gstack-upgrade/SKILL.md',
      'setup',
    ]);

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/gstack-upgrade-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'gstack-upgrade',
      prompt: 'Write the report to .gstack/gstack-upgrade/opencode-smoke.md. Include Inputs Reviewed, Version Check, Setup State, Recommended Action, and Status. Stay local. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = findGeneratedReport(path.join(tmp, '.gstack', 'gstack-upgrade'));
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('Version Check');
    expect(report).toContain('Setup State');
    expect(report).toContain('Recommended Action');
    expect(report).toContain('Status');
  }, 1800000);
});
