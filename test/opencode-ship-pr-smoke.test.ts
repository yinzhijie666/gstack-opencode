import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile, runGit } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode ship PR smoke', () => {
  test.if(SHOULD_RUN)('ship creates a PR when explicitly requested and gh is available', () => {
    const tmp = createTempRepo('gstack-opencode-ship-pr-');
    const bare = createTempRepo('gstack-opencode-ship-pr-remote-');

    expect(runGit(bare, ['init', '--bare']).exitCode).toBe(0);

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/ship.md',
      '.opencode/skills/ship/SKILL.md',
    ]);

    writeRepoFile(tmp, 'package.json', JSON.stringify({
      name: 'ship-pr-smoke',
      scripts: { test: 'node -e "process.exit(0)"' },
    }, null, 2) + '\n');
    writeRepoFile(tmp, 'src/feature.js', 'export const feature = true;\n');

    initCommittedRepo(tmp);
    expect(runGit(tmp, ['remote', 'add', 'origin', bare]).exitCode).toBe(0);
    expect(runGit(tmp, ['push', '-u', 'origin', 'main']).exitCode).toBe(0);
    checkoutBranch(tmp, 'feature/ship-pr-smoke');

    writeRepoFile(tmp, 'src/feature.js', 'export const feature = "ready-for-pr";\n');
    writeRepoFile(tmp, '.gstack/review-reports/review-ok.md', 'Pre-Landing Review: No issues found.\n');

    const binDir = path.join(tmp, 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    const ghLog = path.join(tmp, '.gstack', 'ship-reports', 'gh-pr.log');
    writeRepoFile(
      tmp,
      'bin/gh',
      `#!/bin/sh\nmkdir -p ".gstack/ship-reports"\nprintf '%s\\n' "$@" > "${ghLog}"\nif [ "$1" = "pr" ] && [ "$2" = "create" ]; then\n  printf 'https://example.test/pr/123\\n'\n  exit 0\nfi\nexit 1\n`,
    );
    fs.chmodSync(path.join(binDir, 'gh'), 0o755);

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'ship',
      prompt: 'Prepare this branch for shipping, create a local commit with message "ship smoke pr", push the branch to origin, create a PR with title "Ship smoke PR" and body "## Summary\n- smoke" using gh, and write the report to .gstack/ship-reports/opencode-pr-smoke.md. Use the local test command.',
      env: {
        PATH: `${binDir}:${process.env.PATH ?? ''}`,
      },
    });

    expect(smoke.exitCode).toBe(0);
    expect(fs.existsSync(ghLog)).toBe(true);

    const ghArgs = fs.readFileSync(ghLog, 'utf-8');
    expect(ghArgs).toContain('pr');
    expect(ghArgs).toContain('create');
    expect(ghArgs).toContain('--title');
    expect(ghArgs).toContain('Ship smoke PR');
  }, 1800000);
});
