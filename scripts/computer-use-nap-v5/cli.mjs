import { pathToFileURL } from 'node:url';

import { RUNTIME_ROOT } from './config.mjs';
import {
  PREPARATION_COMMANDS,
  runPreparationCommand,
} from './lib/prepare.mjs';
import {
  RUNNER_COMMANDS,
  runRunnerCommand,
} from './lib/runner.mjs';
import {
  WORKFLOW_COMMANDS,
  runWorkflowCommand,
} from './lib/workflow.mjs';

const COMMANDS = Object.freeze([
  ...PREPARATION_COMMANDS,
  ...RUNNER_COMMANDS,
  ...WORKFLOW_COMMANDS,
]);

function parseArguments(argv) {
  if (!Array.isArray(argv) || argv.length === 0) {
    throw new Error(`Usage: cli.mjs <${COMMANDS.join('|')}>`);
  }
  const [command, ...rest] = argv;
  if (!COMMANDS.includes(command)) throw new Error(`Unknown command: ${String(command)}`);
  const parsed = {};
  for (let index = 0; index < rest.length; index += 1) {
    const option = rest[index];
    if (option === '--json' && command === 'status' && parsed.json !== true) {
      parsed.json = true;
      continue;
    }
    if (option === '--basis' && command === 'approve-catalog') {
      const value = rest[index + 1];
      if (typeof value !== 'string' || value.startsWith('--')) throw new Error('--basis requires a value');
      parsed.approvalBasis = value;
      index += 1;
      continue;
    }
    if (option === '--decisions' && command === 'freeze-evidence') {
      const value = rest[index + 1];
      if (typeof value !== 'string' || value.startsWith('--')) throw new Error('--decisions requires a path');
      parsed.decisionsPath = value;
      index += 1;
      continue;
    }
    if (option === '--phase' && command === 'preflight') {
      const value = rest[index + 1];
      if (!['before-lock', 'after-lock'].includes(value)) {
        throw new Error('--phase requires before-lock or after-lock');
      }
      parsed.phase = value;
      index += 1;
      continue;
    }
    if (option === '--adjudicator' && command === 'freeze-adjudication') {
      const value = rest[index + 1];
      if (value !== 'codex_proxy') {
        throw new Error('--adjudicator requires codex_proxy');
      }
      parsed.adjudicator = value;
      index += 1;
      continue;
    }
    if (option === '--semantic-decisions' && command === 'freeze-adjudication') {
      const value = rest[index + 1];
      if (typeof value !== 'string' || value.startsWith('--')) {
        throw new Error('--semantic-decisions requires a path');
      }
      parsed.semanticDecisionsPath = value;
      index += 1;
      continue;
    }
    if (option === '--usefulness-decisions' && command === 'freeze-adjudication') {
      const value = rest[index + 1];
      if (typeof value !== 'string' || value.startsWith('--')) {
        throw new Error('--usefulness-decisions requires a path');
      }
      parsed.usefulnessDecisionsPath = value;
      index += 1;
      continue;
    }
    if (option === '--interpretation' && command === 'finalize-report') {
      const value = rest[index + 1];
      if (typeof value !== 'string' || value.startsWith('--')) {
        throw new Error('--interpretation requires a path');
      }
      parsed.interpretationPath = value;
      index += 1;
      continue;
    }
    throw new Error(`Unexpected argument or option for ${command}: ${String(option)}`);
  }
  if (command === 'approve-catalog' && parsed.approvalBasis === undefined) {
    throw new Error('approve-catalog requires --basis');
  }
  if (command === 'freeze-evidence' && parsed.decisionsPath === undefined) {
    throw new Error('freeze-evidence requires --decisions');
  }
  if (command === 'preflight' && parsed.phase === undefined) {
    throw new Error('preflight requires --phase');
  }
  if (command === 'freeze-adjudication'
    && (parsed.adjudicator === undefined
      || parsed.semanticDecisionsPath === undefined
      || parsed.usefulnessDecisionsPath === undefined)) {
    throw new Error(
      'freeze-adjudication requires --adjudicator, --semantic-decisions, and --usefulness-decisions',
    );
  }
  if (command === 'finalize-report' && parsed.interpretationPath === undefined) {
    throw new Error('finalize-report requires --interpretation');
  }
  return { command, parsed };
}

export async function main(argv = process.argv.slice(2), dependencies = {}) {
  const { command, parsed } = parseArguments(argv);
  if (dependencies === null || typeof dependencies !== 'object' || Array.isArray(dependencies)) {
    throw new TypeError('CLI dependencies must be an object');
  }
  const allowed = new Set(['root', 'io']);
  for (const key of Object.keys(dependencies)) {
    if (!allowed.has(key)) throw new Error(`Unknown CLI dependency: ${key}`);
  }
  if (RUNNER_COMMANDS.includes(command)) {
    await runRunnerCommand({
      root: dependencies.root ?? RUNTIME_ROOT,
      command,
      io: dependencies.io ?? {},
    });
    return 0;
  }
  if (WORKFLOW_COMMANDS.includes(command)) {
    await runWorkflowCommand({
      root: dependencies.root ?? RUNTIME_ROOT,
      command,
      io: dependencies.io ?? {},
      ...parsed,
    });
    return 0;
  }
  await runPreparationCommand({
    root: dependencies.root ?? RUNTIME_ROOT,
    command,
    io: dependencies.io ?? {},
    ...parsed,
  });
  return 0;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
