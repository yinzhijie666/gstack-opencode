import { test, expect } from 'bun:test';
import { getJobRunnerConfig } from '../src/job-runner.js';

test('respects zero retry count', () => {
  expect(getJobRunnerConfig({ RETRY_COUNT: '0' }).retries).toBe(0);
});
