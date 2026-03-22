import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile, runGit } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode ship commit smoke', () => {
  test.if(SHOULD_RUN)('ship creates a local commit when explicitly requested and readiness is green', () => {
    const tmp = createTempRepo('gstack-opencode-ship-commit-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/ship.md',
      '.opencode/skills/ship/SKILL.md',
    ]);

    writeRepoFile(tmp, 'package.json', JSON.stringify({
      name: 'ship-commit-smoke',
      scripts: { test: 'node -e "process.exit(0)"' },
    }, null, 2) + '\n');
    writeRepoFile(tmp, 'src/feature.js', 'export const feature = true;\n');

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/ship-commit-smoke');

    writeRepoFile(tmp, 'src/feature.js', 'export const feature = "ready";\n');
    writeRepoFile(tmp, '.gstack/review-reports/review-ok.md', 'Pre-Landing Review: No issues found.\n');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'ship',
      prompt: 'Prepare this branch for shipping, create a local commit with message "ship smoke ready", and write the report to .gstack/ship-reports/opencode-smoke.md. Use the local test command.',
    });

    expect(smoke.exitCode).toBe(0);

    const log = runGit(tmp, ['log', '--oneline', '-2']);
    expect(log.exitCode).toBe(0);
    expect(log.stdout.toString()).toContain('ship smoke ready');

    const status = runGit(tmp, ['status', '--short', '--untracked-files=no']);
    expect(status.exitCode).toBe(0);
    expect(status.stdout.toString().trim()).toBe('');
  }, 1800000);
});
