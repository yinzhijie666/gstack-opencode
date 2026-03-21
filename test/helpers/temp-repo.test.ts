import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { createTempRepo, writeRepoFile, copyFilesFromRoot, initCommittedRepo, checkoutBranch, runGit } from './temp-repo';

const ROOT = process.cwd();

describe('temp repo helpers', () => {
  test('copyFilesFromRoot copies selected files into a temp repo', () => {
    const tmp = createTempRepo('gstack-temp-repo-');
    copyFilesFromRoot(ROOT, tmp, ['.opencode/commands/review.md', 'review/checklist.md']);

    expect(fs.existsSync(path.join(tmp, '.opencode', 'commands', 'review.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'review', 'checklist.md'))).toBe(true);
  });

  test('initCommittedRepo creates a committed main branch', () => {
    const tmp = createTempRepo('gstack-temp-repo-');
    writeRepoFile(tmp, 'README.md', '# temp\n');
    initCommittedRepo(tmp);

    const branch = runGit(tmp, ['branch', '--show-current']);
    const log = runGit(tmp, ['log', '--oneline', '-1']);

    expect(branch.exitCode).toBe(0);
    expect(branch.stdout.toString().trim()).toBe('main');
    expect(log.exitCode).toBe(0);
    expect(log.stdout.toString()).toContain('base');
  });

  test('checkoutBranch creates a feature branch cleanly', () => {
    const tmp = createTempRepo('gstack-temp-repo-');
    writeRepoFile(tmp, 'README.md', '# temp\n');
    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/smoke');

    const branch = runGit(tmp, ['branch', '--show-current']);
    expect(branch.exitCode).toBe(0);
    expect(branch.stdout.toString().trim()).toBe('feature/smoke');
  });
});
