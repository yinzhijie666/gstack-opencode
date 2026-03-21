---
description: Run browser-first QA and write a structured report
agent: build
---

Load the `browse` and `qa` skills and execute this QA request:

$ARGUMENTS

Rules:

- If the request does not include a target URL or explicit local page path, ask for one
- Prefer a repo-local or localhost target over an external website when both are available
- If the request gives exact report or baseline output paths, use those exact paths
- In this v1 slice, keep `/qa` report-only; do not enter a fix loop or generate regression tests
- Use browser evidence, screenshots, and console checks
- Write the report under `.gstack/qa-reports/`
- Even if a browser step fails, still write a partial report and baseline when you already have evidence
- Do not modify code in this v1 QA command
