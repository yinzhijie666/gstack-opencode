import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { createTempRepo, writeRepoFile } from './temp-repo';
import { startStaticServer } from './static-server';

describe('static server helper', () => {
  test('serves existing files and returns 404 for missing files', async () => {
    const tmp = createTempRepo('gstack-static-server-');
    writeRepoFile(tmp, 'hello.txt', 'hello');

    const server = startStaticServer(tmp);
    try {
      const ok = await fetch(`${server.baseUrl}/hello.txt`);
      const missing = await fetch(`${server.baseUrl}/missing.txt`);

      expect(ok.status).toBe(200);
      expect(await ok.text()).toBe('hello');
      expect(missing.status).toBe(404);
    } finally {
      server.stop();
      fs.rmdirSync(tmp, { recursive: true });
    }
  });
});
