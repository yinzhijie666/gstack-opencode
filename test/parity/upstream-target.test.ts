import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

describe('Upstream parity target', () => {
  test('pins one exact upstream repository and commit', () => {
    const target = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'parity', 'upstream-target.json'), 'utf-8'),
    ) as { upstreamRepo: string; upstreamSha: string; strategy: string };

    expect(target.upstreamRepo).toBe('https://github.com/garrytan/gstack');
    expect(target.upstreamSha).toBe('1f4b6fd7a2a349dfc6f04d158b8b7778b5b74232');
    expect(target.strategy.length).toBeGreaterThan(10);
  });
});
