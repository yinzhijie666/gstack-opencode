import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile, runGit } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode ship push smoke', () => {
  test.if(SHOULD_RUN)('ship pushes to origin when explicitly requested and readiness is green', () => {
    const tmp = createTempRepo('gstack-opencode-ship-push-');
    const bare = createTempRepo('gstack-opencode-ship-remote-');

    expect(runGit(bare, ['init', '--bare']).exitCode).toBe(0);

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/ship.md',
      '.opencode/skills/ship/SKILL.md',
    ]);

    writeRepoFile(tmp, 'package.json', JSON.stringify({
      name: 'ship-push-smoke',
      scripts: { test: 'node -e "process.exit(0)"' },
    }, null, 2) + '\n');
    writeRepoFile(tmp, 'src/feature.js', 'export const feature = true;\n');

    initCommittedRepo(tmp);
    expect(runGit(tmp, ['remote', 'add', 'origin', bare]).exitCode).toBe(0);
    expect(runGit(tmp, ['push', '-u', 'origin', 'main']).exitCode).toBe(0);
    checkoutBranch(tmp, 'feature/ship-push-smoke');

    writeRepoFile(tmp, 'src/feature.js', 'export const feature = "ready";\n');
    writeRepoFile(tmp, '.gstack/review-reports/review-ok.md', 'Pre-Landing Review: No issues found.\n');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'ship',
      prompt: 'Prepare this branch for shipping, create a local commit with message "ship smoke push", push the branch to origin, and write the report to .gstack/ship-reports/opencode-push-smoke.md. Use the local test command.',
    });

    expect(smoke.exitCode).toBe(0);

    const remoteRef = runGit(tmp, ['ls-remote', '--heads', 'origin', 'feature/ship-push-smoke']);
    expect(remoteRef.exitCode).toBe(0);
    expect(remoteRef.stdout.toString()).toContain('feature/ship-push-smoke');

    const reportDir = path.join(tmp, '.gstack', 'ship-reports');
    const entries = fs.readdirSync(reportDir).filter((entry) => entry.endsWith('.md')).sort();
    expect(entries.length).toBeGreaterThan(0);
  }, 1800000);
});
