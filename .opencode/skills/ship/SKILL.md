---
name: ship
description: Prepare a local branch for shipping by checking branch state, local tests, and review readiness, then write a durable report.
compatibility: opencode
metadata:
  host: opencode
  migration_phase: "7"
  mode: report-first
---

## What This Skill Does

This is the first OpenCode-native `/ship` slice for gstack. It prepares a local branch for shipping and writes a bounded readiness report.

In this v1 slice:

- detect a local base branch
- inspect branch state and diff scope
- run an explicit or conservative repo-local test command
- inspect a local review artifact if one exists
- classify readiness and write a durable report

Do not commit, push, create a PR, update versions, or edit changelogs in this v1 workflow.

## Execution Contract

- Stay local; do not load unrelated skills
- Do not use background tasks or todo lists for this v1 flow
- Write the report file before returning the final answer
- If a hard gate fails, still write the report and mark the blocked status clearly

## Base Branch Detection

Prefer local-only refs in this order:

```bash
if git show-ref --verify --quiet refs/remotes/origin/main; then echo origin/main;
elif git show-ref --verify --quiet refs/remotes/origin/master; then echo origin/master;
elif git show-ref --verify --quiet refs/heads/main; then echo main;
elif git show-ref --verify --quiet refs/heads/master; then echo master;
else echo NO_BASE; fi
```

## Test Command Resolution

Use the prompt first.

If the prompt includes an explicit test command, use it.

Otherwise only auto-detect an obvious root package test script. If there is no clear repo-local test command, classify the result as `NEEDS_TEST_COMMAND` rather than guessing.

## Review Readiness

Look for a local review artifact path provided by the user.

If none is provided, search `.gstack/review-reports/` for the newest report.

Classify the local report as:

- `REVIEW_READY`
- `REVIEW_BLOCKED`
- `REVIEW_MISSING`

## Output

Write the report under `.gstack/ship-reports/`.

Default path:

- `.gstack/ship-reports/ship-{slug}.md`

Honor an explicit output path if the request provides one.

## Fixed Report Sections

The report must include:

- `Release Prep Status`
- `Inputs Reviewed`
- `Branch State`
- `Verification`
- `Review Readiness`
- `Ship Decision`
- `Deferred For Later Slice`

## Workflow

### 1. Gather Branch Context

- create `.gstack/ship-reports/` immediately
- decide the report path immediately and start the report file before deeper checks
- detect the base branch
- capture current branch
- capture `git status --short`
- capture `git diff <base> --stat`
- capture `git log <base>..HEAD --oneline`

If there is no usable base branch, or if there is no diff against the base branch, still write a report and stop.

### 2. Run Verification

- run the resolved test command if one exists
- capture pass or fail status and short output summary

If there is no clear test command, report `NEEDS_TEST_COMMAND`.

### 3. Check Review Readiness

- read the chosen local review report if present
- classify the review status based on the report content

### 4. Write Ship Decision

Use one of these statuses in the report:

- `READY_LOCAL`
- `BLOCKED_TESTS`
- `BLOCKED_REVIEW`
- `NEEDS_TEST_COMMAND`
- `NO_BASE_BRANCH`
- `NO_DIFF`

Write the report file even for blocked outcomes. Never exit early without a written report.

## Rules

- Keep the report factual and local-only
- Start the report file before running tests or reading review artifacts
- Do not fetch, merge, commit, push, or open PRs
- Do not modify source code, docs, or changelogs
- Defer versioning, changelog, TODOs, and PR work to a later slice
