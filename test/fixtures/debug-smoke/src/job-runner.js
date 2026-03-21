import { parseRetries } from './config.js';

export function getJobRunnerConfig(env = process.env) {
  return {
    retries: parseRetries(env.RETRY_COUNT),
  };
}
