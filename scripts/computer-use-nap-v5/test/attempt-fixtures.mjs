export const attempt = (overrides = {}) => ({ condition: 'state_only', ...overrides });

export const validPredictionResponse = (overrides = {}) => ({
  predictions: [
    { rank: 1, action_type: 'focus', app: 'Arc', object: 'Coda', subtarget: null, reason: 'visible workspace' },
    { rank: 2, action_type: 'activate', app: 'Codex', object: null, subtarget: null, reason: 'recent workflow' },
    { rank: 3, action_type: 'focus', app: 'Slack', object: 'general', subtarget: 'composer', reason: 'likely follow-up' },
  ],
  ...overrides,
});

export const jsonl = (...events) => Buffer.from(`${events.map((event) => JSON.stringify(event)).join('\n')}\n`);

export const completedUsage = (overrides = {}) => ({
  type: 'turn.completed',
  usage: {
    input_tokens: 100,
    cached_input_tokens: 25,
    output_tokens: 30,
    ...overrides,
  },
});

export const structuralError = (code, overrides = {}) => ({
  type: 'error',
  error: { code, ...overrides },
});
