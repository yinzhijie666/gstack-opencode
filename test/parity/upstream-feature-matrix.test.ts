import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

type WorkflowEntry = {
  name: string;
  upstreamPath: string;
  localCommand: string;
  classification: string;
  status: string;
};

describe('Upstream feature matrix', () => {
  test('tracks the full upstream workflow inventory against local OpenCode status', () => {
    const matrix = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'parity', 'upstream-feature-matrix.json'), 'utf-8'),
    ) as { workflows: WorkflowEntry[] };

    const names = matrix.workflows.map((entry) => entry.name).sort();

    expect(names).toEqual([
      'browse',
      'debug',
      'design-consultation',
      'design-review',
      'document-release',
      'gstack-upgrade',
      'office-hours',
      'plan-ceo-review',
      'plan-design-review',
      'plan-eng-review',
      'qa',
      'qa-only',
      'retro',
      'review',
      'setup-browser-cookies',
      'ship',
    ]);

    for (const workflow of matrix.workflows) {
      expect(workflow.classification).toBe('adapt-opencode');
      expect(workflow.upstreamPath.endsWith('/')).toBe(true);
      expect(workflow.localCommand.startsWith('.opencode/commands/')).toBe(true);
      expect(['shipped', 'shipped-v1', 'restoring']).toContain(workflow.status);
    }
  });
});
