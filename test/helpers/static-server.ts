import * as fs from 'fs';
import * as path from 'path';

export function startStaticServer(rootDir: string) {
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = path.join(rootDir, relativePath || 'index.html');

      if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
        return new Response('File not found', { status: 404 });
      }

      return new Response(Bun.file(target));
    },
  });

  return {
    port: server.port,
    baseUrl: `http://127.0.0.1:${server.port}`,
    stop() {
      server.stop(true);
    },
  };
}
