import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const GIT_ENV = {
  ...process.env,
  GIT_AUTHOR_NAME: 'OpenCode Test',
  GIT_AUTHOR_EMAIL: 'opencode-test@example.com',
  GIT_COMMITTER_NAME: 'OpenCode Test',
  GIT_COMMITTER_EMAIL: 'opencode-test@example.com',
};

export function createTempRepo(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function writeRepoFile(root: string, relativePath: string, content: string): void {
  const fullPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

export function copyFilesFromRoot(sourceRoot: string, destRoot: string, relativePaths: string[]): void {
  for (const relativePath of relativePaths) {
    writeRepoFile(destRoot, relativePath, fs.readFileSync(path.join(sourceRoot, relativePath), 'utf-8'));
  }
}

export function runGit(root: string, args: string[]) {
  return Bun.spawnSync(['git', ...args], {
    cwd: root,
    stdout: 'pipe',
    stderr: 'pipe',
    env: GIT_ENV,
  });
}

export function initCommittedRepo(root: string, defaultBranch = 'main', commitMessage = 'base'): void {
  const init = runGit(root, ['init', '-b', defaultBranch]);
  if (init.exitCode !== 0) throw new Error(init.stderr.toString() || 'git init failed');

  const add = runGit(root, ['add', '.']);
  if (add.exitCode !== 0) throw new Error(add.stderr.toString() || 'git add failed');

  const commit = runGit(root, ['commit', '-m', commitMessage]);
  if (commit.exitCode !== 0) throw new Error(commit.stderr.toString() || 'git commit failed');
}

export function checkoutBranch(root: string, branch: string): void {
  const checkout = runGit(root, ['checkout', '-b', branch]);
  if (checkout.exitCode !== 0) throw new Error(checkout.stderr.toString() || 'git checkout failed');
}
