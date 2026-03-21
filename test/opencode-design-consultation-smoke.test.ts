import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { copyFilesFromRoot, createTempRepo, initCommittedRepo, checkoutBranch } from './helpers/temp-repo';
import { runOpencodeCommand } from './helpers/opencode-run';

const ROOT = process.cwd();
const SHOULD_RUN = process.env.OPENCODE_SMOKE === '1';

describe('OpenCode design-consultation smoke', () => {
  test.if(SHOULD_RUN)('design-consultation writes a bounded design direction report', () => {
    const tmp = createTempRepo('gstack-opencode-design-consultation-');

    copyFilesFromRoot(ROOT, tmp, [
      '.opencode/commands/design-consultation.md',
      '.opencode/skills/design-consultation/SKILL.md',
      'test/fixtures/design-consultation-smoke/DESIGN_BRIEF.md',
    ]);

    fs.renameSync(path.join(tmp, 'test', 'fixtures', 'design-consultation-smoke', 'DESIGN_BRIEF.md'), path.join(tmp, 'DESIGN_BRIEF.md'));
    fs.rmdirSync(path.join(tmp, 'test', 'fixtures', 'design-consultation-smoke'), { recursive: true });

    initCommittedRepo(tmp);
    checkoutBranch(tmp, 'feature/design-consultation-smoke');

    const smoke = runOpencodeCommand({
      cwd: tmp,
      commandName: 'design-consultation',
      prompt: 'Review DESIGN_BRIEF.md and write the report to .gstack/design-reports/opencode-smoke.md. Use DESIGN_BRIEF.md as sufficient context. Do not ask follow-up questions. Include exactly these sections in order: Inputs Reviewed, Product Mood, Safe Choices, Creative Risks, Design System Direction, Validation Strategy, Scope For This Slice, Deferrals, Not In Scope. Keep each section short. Do not modify code or write DESIGN.md.',
    });

    expect(smoke.exitCode).toBe(0);

    const reportPath = path.join(tmp, '.gstack', 'design-reports', 'opencode-smoke.md');
    expect(fs.existsSync(reportPath)).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'DESIGN.md'))).toBe(false);

    const report = fs.readFileSync(reportPath, 'utf-8');
    expect(report).toContain('Inputs Reviewed');
    expect(report).toContain('Product Mood');
    expect(report).toContain('Safe Choices');
    expect(report).toContain('Creative Risks');
    expect(report).toContain('Design System Direction');
    expect(report).toContain('Validation Strategy');
    expect(report).toContain('Scope For This Slice');
    expect(report).toContain('Deferrals');
    expect(report).toContain('Not In Scope');
  }, 1800000);
});
