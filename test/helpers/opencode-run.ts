import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readLockMeta(metaPath: string): { pid?: number } | null {
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as { pid?: number };
  } catch {
    return null;
  }
}

function cleanupStaleLock(lockDir: string, staleAfterMs: number): void {
  if (!fs.existsSync(lockDir)) return;

  const metaPath = path.join(lockDir, 'owner.json');
  const stat = fs.statSync(lockDir);
  const lockAgeMs = Date.now() - stat.mtimeMs;

  if (lockAgeMs < staleAfterMs && fs.existsSync(metaPath)) {
    const meta = readLockMeta(metaPath);
    if (typeof meta?.pid === 'number' && isProcessAlive(meta.pid)) {
      return;
    }
  }

  fs.rmdirSync(lockDir, { recursive: true });
}

export interface OpencodeCommandOptions {
  cwd: string;
  commandName: string;
  prompt: string;
  format?: 'json' | 'default';
  env?: Record<string, string>;
}

export function buildOpencodeArgs(options: OpencodeCommandOptions): string[] {
  return [
    'opencode',
    'run',
    '--format',
    options.format ?? 'json',
    '--command',
    options.commandName,
    options.prompt,
  ];
}

export function runOpencodeCommand(options: OpencodeCommandOptions) {
  const browseServerScript = path.join(process.cwd(), 'browse', 'src', 'server.ts');
  const originalHome = process.env.HOME ?? os.homedir();
  const homeDir = path.join(options.cwd, '.opencode-home');
  const xdgConfigHome = path.join(homeDir, '.config');
  const xdgDataHome = path.join(homeDir, '.local', 'share');
  const xdgCacheHome = path.join(homeDir, '.cache');
  const lockDir = path.join(os.tmpdir(), 'gstack-opencode-smoke.lock');
  const lockMetaPath = path.join(lockDir, 'owner.json');
  const playwrightBrowsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH
    ?? path.join(originalHome, 'Library', 'Caches', 'ms-playwright');

  fs.mkdirSync(xdgConfigHome, { recursive: true });
  fs.mkdirSync(xdgDataHome, { recursive: true });
  fs.mkdirSync(xdgCacheHome, { recursive: true });

  const env = {
    ...process.env,
    HOME: homeDir,
    XDG_CONFIG_HOME: xdgConfigHome,
    XDG_DATA_HOME: xdgDataHome,
    XDG_CACHE_HOME: xdgCacheHome,
    PLAYWRIGHT_BROWSERS_PATH: playwrightBrowsersPath,
    ...(fs.existsSync(browseServerScript) && !process.env.BROWSE_SERVER_SCRIPT
      ? { BROWSE_SERVER_SCRIPT: browseServerScript }
      : {}),
    ...(options.env ?? {}),
  };

  const deadline = Date.now() + 30 * 60 * 1000;
  const sleep = (ms: number) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

  while (true) {
    try {
      fs.mkdirSync(lockDir);
      fs.writeFileSync(lockMetaPath, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
      break;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'EEXIST') {
        throw error;
      }

      cleanupStaleLock(lockDir, 10 * 60 * 1000);

      if (!fs.existsSync(lockDir)) {
        continue;
      }

      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for OpenCode smoke lock at ${lockDir}`);
      }

      sleep(200);
    }
  }

  try {
    return Bun.spawnSync(buildOpencodeArgs(options), {
      cwd: options.cwd,
      stdout: 'pipe',
      stderr: 'pipe',
      env,
    });
  } finally {
    if (fs.existsSync(lockDir)) {
      fs.rmdirSync(lockDir, { recursive: true });
    }
  }
}
