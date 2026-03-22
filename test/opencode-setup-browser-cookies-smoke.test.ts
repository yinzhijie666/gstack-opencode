import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode setup-browser-cookies smoke', () => {
  test.if(SHOULD_RUN)('setup-browser-cookies writes a bounded local setup summary', () => {
    const tmp = createTempRepo('gstack-opencode-setup-browser-cookies-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/setup-browser-cookies.md',
      '.opencode/skills/setup-browser-cookies/SKILL.md',
      '.opencode/commands/browse.md',
      '.opencode/skills/browse/SKILL.md',
    ]);

    fs.mkdirSync(path.join(tmp, 'browse', 'dist'), { recursive: true });
    const browseBinary = path.join(tmp, 'browse', 'dist', 'browse');
    fs.copyFileSync(path.join(ROOT, 'browse', 'dist', 'browse'), browseBinary);
    fs.chmodSync(browseBinary, 0o755);

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/setup-browser-cookies-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'setup-browser-cookies',
      prompt: 'Prepare browser cookies for staging.example.com and write the summary to .gstack/browser-session/opencode-smoke.md. If cookie import cannot complete in this environment, still write the report with Requested Browser, Requested Domains, Import Mode, Observed Result, and Next Step. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'browser-session', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Requested Browser');
    expect(report).toContain('Requested Domains');
    expect(report).toContain('Import Mode');
    expect(report).toContain('Observed Result');
    expect(report).toContain('Next Step');
  }, 1800000);
});
