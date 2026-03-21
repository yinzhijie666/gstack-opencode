import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch, writeRepoFile, runGit } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode document-release smoke', () => {
  test.if(SHOULD_RUN)('document-release updates targeted docs from local diff', () => {
    const tmp = createTempRepo('gstack-opencode-doc-release-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/document-release.md',
      '.opencode/skills/document-release/SKILL.md',
    ]);

    writeRepoFile(tmp, 'README.md', '# Demo App\n\n## Features\n- Feature A\n- Feature B\n');
    writeRepoFile(tmp, 'docs/usage.md', '# Usage\n\nRun `bun run old-feature` to start the old flow.\n');
    writeRepoFile(tmp, 'CHANGELOG.md', '# Changelog\n\n## v1.0.0\n- Initial release\n');
    writeRepoFile(tmp, 'package.json', JSON.stringify({ name: 'demo-app', scripts: { start: 'bun run old-feature' } }, null, 2) + '\n');

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/document-release-smoke');

    writeRepoFile(tmp, 'src/feature-c.ts', 'export const featureC = true;\n');
    writeRepoFile(tmp, 'package.json', JSON.stringify({ name: 'demo-app', scripts: { 'feature-c': 'bun run src/feature-c.ts' } }, null, 2) + '\n');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'document-release',
      prompt: 'Update README.md and docs/usage.md from this branch diff. Write the summary to .gstack/document-release/opencode-smoke.md. Do not modify CHANGELOG.md and do not commit.',
    });

    expect(smoke.exitCode).toBe(0);

    const summaryPath = path.join(tmp, '.gstack', 'document-release', 'opencode-smoke.md');
    const readmePath = path.join(tmp, 'README.md');
    const usagePath = path.join(tmp, 'docs', 'usage.md');
    const changelogPath = path.join(tmp, 'CHANGELOG.md');

    expect(fs.existsSync(summaryPath)).toBe(true);

    const summary = fs.readFileSync(summaryPath, 'utf-8');
    const readme = fs.readFileSync(readmePath, 'utf-8');
    const usage = fs.readFileSync(usagePath, 'utf-8');
    const changelog = fs.readFileSync(changelogPath, 'utf-8');

    expect(summary).toContain('README.md');
    expect(summary).toContain('docs/usage.md');
    expect(summary).toMatch(/Docs Updated|Docs Skipped/);
    expect(usage).toContain('bun run feature-c');
    expect(summary).toMatch(/README\.md[\s\S]*(Updated|Skipped)/);
    expect(changelog).not.toContain('Feature C');

    const commitCount = runGit(tmp, ['rev-list', '--count', 'HEAD']);
    const status = runGit(tmp, ['status', '--short']);

    expect(commitCount.stdout.toString().trim()).toBe('1');
    expect(status.stdout.toString()).toContain('docs/usage.md');
  }, 1800000);
});
