# Browser Reference

This document covers the current gstack browser runtime used by OpenCode workflows.

## Command Categories

| Category | Commands | What for |
|----------|----------|----------|
| Navigate | `goto`, `back`, `forward`, `reload`, `url` | Move around pages |
| Read | `text`, `html`, `links`, `forms`, `accessibility` | Extract page content |
| Snapshot | `snapshot [-i] [-c] [-d N] [-s sel] [-D] [-a] [-o] [-C]` | Discover refs, diff state, annotate |
| Interact | `click`, `fill`, `select`, `hover`, `type`, `press`, `scroll`, `wait`, `viewport`, `upload` | Drive the page |
| Inspect | `js`, `eval`, `css`, `attrs`, `is`, `console`, `network`, `dialog`, `cookies`, `storage`, `perf` | Debug and verify |
| Visual | `screenshot`, `pdf`, `responsive` | Capture evidence |
| Compare | `diff <url1> <url2>` | Compare environments |
| Tabs | `tabs`, `tab`, `newtab`, `closetab` | Multi-page workflows |
| Cookies | `cookie-import`, `cookie-import-browser` | Import cookies |
| Multi-step | `chain` | Batch commands |

## How It Works

The browser runtime is a compiled CLI plus a long-lived local server.

```text
browse CLI -> local HTTP server -> Playwright Chromium
```

- the CLI reads state and sends commands
- the server owns the browser session
- Chromium keeps tabs, cookies, and local storage alive between commands

## Runtime Layout

```text
browse/
  src/   - CLI, server, command handlers, cookie import, buffers
  test/  - integration tests and fixtures
  dist/  - compiled binaries
```

## Typical Local Flow

Prepare the repo once:

```bash
./setup
```

Manual alternative:

```bash
bun install
bun run build
npx playwright install chromium
```

Then use:

```bash
./browse/dist/browse goto https://example.com
./browse/dist/browse snapshot -i
./browse/dist/browse console --errors
```

## Notes

- the repo-local binary lives at `browse/dist/browse`
- `browse/src/find-browse.ts` should resolve that local binary first
- browser state is stored per project under `.gstack/`
- screenshots and logs are evidence, not disposable artifacts

## Development

```bash
bun run dev <cmd>
bun run build
bun test browse/test/
```

Use `bun run dev` when iterating on the runtime itself. Use the compiled binary when validating the shipped OpenCode path.
