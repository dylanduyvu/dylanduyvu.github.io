export const canonicalTarget = (overrides = {}) => ({
  app: 'Safari',
  object: null,
  subtarget: null,
  ...overrides,
});

export const ledgerHeader = '| ID | Recording @ time | Status | Input | Type | Destination | History | Demo | Shortcut | Evidence | Context / cleanup |';

export const provenance = Object.freeze({
  dataset_commit: 'fa3a5c80f3689619da3bf7a3e902041b3b223aea',
  dataset_path: '30-projects/computer-use-nap-v4-canonical-dataset.md',
  sha256: '5df40abf89f0083a0b73965045d75a6ddaa1509f0c04f4bfc2cce027ddae1a48',
});

export const ledgerRow = (values) => `| ${values.join(' | ')} |`;
