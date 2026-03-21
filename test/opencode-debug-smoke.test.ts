import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, runGit } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode debug smoke', () => {
  test.if(SHOULD_RUN)('debug command writes a root-cause report for a local failing test', () => {
    const tmp = createTempRepo('gstack-opencode-debug-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/debug.md',
      '.opencode/skills/debug/SKILL.md',
      'test/fixtures/debug-smoke/package.json',
      'test/fixtures/debug-smoke/src/config.js',
      'test/fixtures/debug-smoke/src/job-runner.js',
      'test/fixtures/debug-smoke/test/retry-count.test.js',
    ]);

    const fixtureRoot = path.join(tmp, 'test', 'fixtures', 'debug-smoke');
    fs.renameSync(path.join(fixtureRoot, 'package.json'), path.join(tmp, 'package.json'));
    fs.mkdirSync(path.join(tmp, 'src'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'test'), { recursive: true });
    fs.renameSync(path.join(fixtureRoot, 'src', 'config.js'), path.join(tmp, 'src', 'config.js'));
    fs.renameSync(path.join(fixtureRoot, 'src', 'job-runner.js'), path.join(tmp, 'src', 'job-runner.js'));
    fs.renameSync(path.join(fixtureRoot, 'test', 'retry-count.test.js'), path.join(tmp, 'test', 'retry-count.test.js'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'debug-smoke', 'src'), { recursive: true });
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'debug-smoke', 'test'), { recursive: true });
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'debug-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/debug-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'debug',
      prompt: 'Investigate why `bun test test/retry-count.test.js` fails. Write the report to .gstack/debug-reports/opencode-smoke.md. Do not modify code.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'debug-reports', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toMatch(/ROOT_CAUSE_FOUND|NEEDS_CONTEXT|BLOCKED/);
    expect(report).toContain('bun test test/retry-count.test.js');
    expect(report).toMatch(/parseRetries|Number\(raw\) \|\| 3|RETRY_COUNT/);

    const status = runGit(tmp, ['status', '--short']);
    expect(status.stdout.toString()).not.toContain('src/config.js');
    expect(status.stdout.toString()).not.toContain('src/job-runner.js');
    expect(status.stdout.toString()).not.toContain('test/retry-count.test.js');
  }, 1800000);
});
