---
description: Run a structural pre-landing code review
agent: build
---

Load the `review` skill and execute this review request:

$ARGUMENTS

Rules:

- Review the current branch against a local base branch
- Use `review/checklist.md` as the review source of truth
- Write the report under `.gstack/review-reports/` unless the request provides an explicit output path
- Focus on high-signal structural findings with evidence
- Do not load unrelated helper skills or start background exploration
- Write the report file before returning your final answer
- Do not modify code in this v1 review command
