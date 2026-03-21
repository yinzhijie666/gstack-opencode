import { describe, test, expect } from 'bun:test';
import { buildOpencodeArgs } from './opencode-run';

describe('opencode run helper', () => {
  test('buildOpencodeArgs builds the expected argv', () => {
    expect(buildOpencodeArgs({
      cwd: '/tmp/example',
      commandName: 'review',
      prompt: 'Review this branch.',
    })).toEqual([
      'opencode',
      'run',
      '--format',
      'json',
      '--command',
      'review',
      'Review this branch.',
    ]);
  });

  test('buildOpencodeArgs respects alternate output format', () => {
    expect(buildOpencodeArgs({
      cwd: '/tmp/example',
      commandName: 'qa',
      prompt: 'Quick QA this page.',
      format: 'raw',
    })).toEqual([
      'opencode',
      'run',
      '--format',
      'raw',
      '--command',
      'qa',
      'Quick QA this page.',
    ]);
  });
});
