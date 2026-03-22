import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, runGit, writeRepoFile } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode retro smoke', () => {
  test.if(SHOULD_RUN)('retro writes a bounded local retrospective', () => {
    const tmp = createTempRepo('gstack-opencode-retro-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/retro.md',
      '.opencode/skills/retro/SKILL.md',
      'test/fixtures/retro-smoke/README.md',
    ]);

    fs.renameSync(path.join(tmp, 'test', 'fixtures', 'retro-smoke', 'README.md'), path.join(tmp, 'README.md'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'retro-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/retro-smoke');

    writeRepoFile(tmp, 'notes.txt', 'draft retrospective input\n');
    expect(runGit(tmp, ['add', '.']).exitCode).toBe(0);
    expect(runGit(tmp, ['commit', '-m', 'add notes']).exitCode).toBe(0);

    writeRepoFile(tmp, 'report.txt', 'ship something small\n');
    expect(runGit(tmp, ['add', '.']).exitCode).toBe(0);
    expect(runGit(tmp, ['commit', '-m', 'ship report']).exitCode).toBe(0);

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'retro',
      prompt: 'Write the retrospective to .gstack/retro/opencode-smoke.md. Include Inputs Reviewed, Shipping Summary, Wins, Friction, Test Health Signals, and Next Focus. Stay local and use recent repo history.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'retro', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('Shipping Summary');
    expect(report).toContain('Wins');
    expect(report).toContain('Friction');
    expect(report).toContain('Test Health Signals');
    expect(report).toContain('Next Focus');
  }, 1800000);
});
