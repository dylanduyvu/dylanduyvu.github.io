import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { METHOD } from '../config.mjs';
import { freezeAdjudication } from './adjudication-lock.mjs';
import { prepareBlindAdjudication } from './blind-worksheets.mjs';
import { canonicalJson, sha256 } from './immutable.mjs';
import {
  freezeRun,
  verifyFrozenRun,
} from './locks.mjs';
import {
  runPreflight,
  validatePreflightReceipt,
} from './preflight.mjs';
import {
  blindRuntimeDependencies,
  finalizeReport,
  revealResults,
  verifyResults,
} from './results-runtime.mjs';

export const WORKFLOW_COMMANDS = Object.freeze([
  'preflight',
  'freeze-run',
  'verify-frozen',
  'prepare-blind-adjudication',
  'freeze-adjudication',
  'reveal-results',
  'finalize-report',
  'verify-results',
]);

const TEST_RECEIPT_PATH = 'evaluator/receipts/complete-tests.json';
const PREFLIGHT_RECEIPT_PATH = 'evaluator/receipts/preflight-before-lock.json';
const CATALOG_PATH = 'evaluator/target-catalog.json';
const PREPARED_PATH = 'evaluator/prepared-inventory.json';

function isPlainObject(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function assertExactKeys(value, expected, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length
    || actual.some((key, index) => key !== wanted[index])) {
    throw new Error(`${label} must contain the exact keys`);
  }
}

function relative(root, relativePath) {
  return path.join(root, ...relativePath.split('/'));
}

async function canonicalRuntimeJson(root, relativePath, label) {
  const bytes = await readFile(relative(root, relativePath));
  let value;
  try {
    value = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON`, { cause: error });
  }
  if (bytes.toString('utf8') !== canonicalJson(value)) {
    throw new Error(`${label} is not canonical JSON`);
  }
  return { bytes, value };
}

function checkByName(preflight, name) {
  const matches = preflight.checks.filter((check) => check.name === name);
  if (matches.length !== 1) {
    throw new Error(`Preflight receipt must contain exactly one ${name} check`);
  }
  return matches[0];
}

function methodMetadata(preflight) {
  validatePreflightReceipt(preflight);
  if (preflight.phase !== 'before-lock') {
    throw new Error('Method metadata requires the passing before-lock receipt');
  }
  const versions = checkByName(preflight, 'runtime_versions');
  const capabilities = checkByName(preflight, 'cli_capability_hashes');
  const adapter = checkByName(preflight, 'adapter_argv_config');
  assertExactKeys(versions, [
    'name',
    'passed',
    'ffmpeg_version',
    'ffprobe_version',
    'node_version',
    'codex_cli_version',
  ], 'Runtime versions receipt');
  assertExactKeys(capabilities, [
    'name',
    'passed',
    'codex_exec_help_sha256',
    'bundled_model_catalog_sha256',
    'bundled_model_instructions_sha256',
    'debug_prompt_input_help_sha256',
  ], 'CLI capabilities receipt');
  assertExactKeys(adapter, [
    'name',
    'passed',
    'argv_sha256',
    'config_count',
    'hard_no_tools_switch',
    'structural_tool_events_terminal_invalid',
    'timeout_ms',
    'termination_grace_ms',
  ], 'Adapter receipt');
  return {
    codex_cli_version: versions.codex_cli_version,
    codex_exec_help_sha256: capabilities.codex_exec_help_sha256,
    bundled_model_catalog_sha256: capabilities.bundled_model_catalog_sha256,
    bundled_model_instructions_sha256:
      capabilities.bundled_model_instructions_sha256,
    debug_prompt_input_help_sha256:
      capabilities.debug_prompt_input_help_sha256,
    adapter_capability: {
      hard_no_tools_switch: adapter.hard_no_tools_switch,
      structural_tool_events_terminal_invalid:
        adapter.structural_tool_events_terminal_invalid,
    },
    timeout_ms: adapter.timeout_ms,
    termination_grace_ms: adapter.termination_grace_ms,
  };
}

async function freezeInputs(root) {
  const [tests, preflight, catalog, prepared] = await Promise.all([
    canonicalRuntimeJson(root, TEST_RECEIPT_PATH, 'Complete test receipt'),
    canonicalRuntimeJson(root, PREFLIGHT_RECEIPT_PATH, 'Before-lock receipt'),
    canonicalRuntimeJson(root, CATALOG_PATH, 'Approved target catalog'),
    canonicalRuntimeJson(root, PREPARED_PATH, 'Prepared inventory'),
  ]);
  validatePreflightReceipt(preflight.value);
  const packetCount = prepared.value.files.filter(
    (file) => /^packets\/NAP-V5-SLOT-(?:0[1-9]|1\d|2[0-2])\/packet\.json$/u
      .test(file.path),
  ).length;
  if (packetCount !== METHOD.scheduledSlotCount) {
    throw new Error(
      `Prepared inventory must contain ${METHOD.scheduledSlotCount} predictor packets`,
    );
  }
  return {
    verifiedReceipts: {
      catalog: {
        approved: catalog.value.approval_provenance?.approved_by === 'dylan',
        target_catalog_sha256: sha256(catalog.bytes),
      },
      packets: {
        verified: true,
        prepared_inventory_sha256: sha256(prepared.bytes),
        packet_count: packetCount,
        slot_count: prepared.value.scheduled_slot_count,
      },
      tests: tests.value,
      preflight: preflight.value,
    },
    method: methodMetadata(preflight.value),
  };
}

function nestedIo(io, key) {
  if (io === undefined) return {};
  if (!isPlainObject(io)) throw new TypeError('Workflow I/O must be an object');
  const value = io[key] ?? {};
  if (!isPlainObject(value)) throw new TypeError(`Workflow ${key} I/O must be an object`);
  return value;
}

function output(io, value) {
  const writer = isPlainObject(io) && typeof io.writeOutput === 'function'
    ? io.writeOutput
    : (text) => process.stdout.write(text);
  writer(`${JSON.stringify(value)}\n`);
}

function publicReceipt(command, result) {
  const receipt = {
    ok: true,
    command,
  };
  if (command === 'freeze-adjudication') {
    return {
      ...receipt,
      adjudicator: 'codex_proxy',
      proxy_only: true,
    };
  }
  if (command === 'verify-frozen' || command === 'verify-results') {
    return {
      ...receipt,
      verified: result === true || result?.verified === true,
    };
  }
  return receipt;
}

function validateOptions(options) {
  if (!isPlainObject(options)) throw new TypeError('Workflow options must be an object');
  const allowed = new Set([
    'root',
    'command',
    'phase',
    'adjudicator',
    'semanticDecisionsPath',
    'usefulnessDecisionsPath',
    'interpretationPath',
    'io',
  ]);
  for (const key of Object.keys(options)) {
    if (!allowed.has(key)) throw new Error(`Unknown workflow option: ${key}`);
  }
  if (typeof options.root !== 'string' || !path.isAbsolute(options.root)) {
    throw new TypeError('Workflow root must be absolute');
  }
  if (!WORKFLOW_COMMANDS.includes(options.command)) {
    throw new Error(`Unknown workflow command: ${String(options.command)}`);
  }
}

export async function runWorkflowCommand(options) {
  validateOptions(options);
  const root = path.resolve(options.root);
  const io = options.io ?? {};
  let result;
  if (options.command === 'preflight') {
    const preflightIo = nestedIo(io, 'preflight');
    result = await runPreflight({
      phase: options.phase,
      root,
      ...preflightIo,
    });
  } else if (options.command === 'freeze-run') {
    const inputs = await freezeInputs(root);
    const lockIo = nestedIo(io, 'locks');
    result = await freezeRun({
      root,
      ...inputs,
      ...(lockIo.implementationRoot === undefined
        ? {}
        : { implementationRoot: lockIo.implementationRoot }),
      ...(lockIo.io === undefined ? {} : { io: lockIo.io }),
    });
  } else if (options.command === 'verify-frozen') {
    const lockIo = nestedIo(io, 'locks');
    result = await verifyFrozenRun({
      root,
      ...(lockIo.implementationRoot === undefined
        ? {}
        : { implementationRoot: lockIo.implementationRoot }),
      ...(lockIo.io === undefined ? {} : { io: lockIo.io }),
    });
  } else if (options.command === 'prepare-blind-adjudication') {
    result = await prepareBlindAdjudication(
      { root },
      blindRuntimeDependencies({
        preparedIo: nestedIo(io, 'prepared'),
      }),
    );
  } else if (options.command === 'freeze-adjudication') {
    result = await freezeAdjudication(
      {
        root,
        adjudicator: options.adjudicator,
        semanticDecisionsPath: options.semanticDecisionsPath,
        usefulnessDecisionsPath: options.usefulnessDecisionsPath,
      },
      {
        verifyFrozenRun: async (verifyOptions) => {
          await verifyFrozenRun(verifyOptions);
          return true;
        },
      },
    );
  } else if (options.command === 'reveal-results') {
    result = await revealResults({
      root,
      preparedIo: nestedIo(io, 'prepared'),
    });
  } else if (options.command === 'finalize-report') {
    result = await finalizeReport({
      root,
      interpretationPath: options.interpretationPath,
      preparedIo: nestedIo(io, 'prepared'),
    });
  } else {
    result = await verifyResults({
      root,
      preparedIo: nestedIo(io, 'prepared'),
    });
  }
  const receipt = publicReceipt(options.command, result);
  if (options.command !== 'preflight') {
    output(io, receipt);
  }
  return options.command === 'reveal-results' ? result : receipt;
}
