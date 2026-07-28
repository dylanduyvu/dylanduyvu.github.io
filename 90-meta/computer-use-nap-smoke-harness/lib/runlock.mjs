import { execFile, spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import {
  link,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  unlink,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { isDeepStrictEqual, promisify } from 'node:util';

import { loadAndValidateManifest } from './manifest.mjs';
import { renderPacket } from './packets.mjs';
import { buildSchedule } from './schedule.mjs';

export const FROZEN_RUN_ID = 'BLOG-SMOKE-20260728-V2';

const MODEL = 'gpt-5.6-sol';
const MODEL_REASONING_EFFORT = 'max';
const SERVICE_TIER = 'priority';
const MAXIMUM_EVENT_ID = 'BLOG-CAND-027';
const MAXIMUM_IMAGE_COUNT = 40;
const MINIMUM_CONTEXT_WINDOW = 272_000;
const RUNTIME_HOME_STRATEGY_ID = 'NEUTRAL-CODEX-HOME-TRANSIENT-AUTH-SYMLINK-V1';
const LOCK_VERSION = 1;
const TARGET_CONTRACT_VERSION = 1;
const FROZEN_EVENT_IDS = Object.freeze([
  'BLOG-CAND-003', 'BLOG-CAND-004', 'BLOG-CAND-006', 'BLOG-CAND-007',
  'BLOG-CAND-008', 'BLOG-CAND-009', 'BLOG-CAND-010', 'BLOG-CAND-011',
  'BLOG-CAND-013', 'BLOG-CAND-014', 'BLOG-CAND-016', 'BLOG-CAND-018',
  'BLOG-CAND-019', 'BLOG-CAND-020', 'BLOG-CAND-021', 'BLOG-CAND-022',
  'BLOG-CAND-023', 'BLOG-CAND-024', 'BLOG-CAND-026', 'BLOG-CAND-027',
]);
const execFileAsync = promisify(execFile);

function fail(message, cause) {
  throw new Error(
    `Invalid run lock: ${message}`,
    cause === undefined ? undefined : { cause },
  );
}

function nonemptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${name} must be a nonempty string`);
  }
  return value;
}

function normalizedAbsolutePath(inputPath, name) {
  nonemptyString(inputPath, name);
  if (!path.isAbsolute(inputPath) || path.normalize(inputPath) !== inputPath) {
    fail(`${name} must be a normalized absolute path`);
  }
  return inputPath;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

async function fsyncDirectory(directory) {
  const handle = await open(directory, 'r');
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function pathExists(inputPath) {
  try {
    await lstat(inputPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function validateDirectory(directory, name) {
  normalizedAbsolutePath(directory, name);
  let stat;
  try {
    stat = await lstat(directory);
  } catch (error) {
    fail(`${name} does not exist`, error);
  }
  if (stat.isSymbolicLink()) fail(`${name} must not be a symlink`);
  if (!stat.isDirectory()) fail(`${name} must be a directory`);
  return stat;
}

async function atomicWriteNoOverwrite(destination, bytes, mode = 0o600) {
  normalizedAbsolutePath(destination, 'atomic write destination');
  const directory = path.dirname(destination);
  await validateDirectory(directory, 'atomic write parent');
  const temporary = path.join(
    directory,
    `.${path.basename(destination)}.tmp-${process.pid}-${randomUUID()}`,
  );
  let handle;
  let linked = false;
  try {
    handle = await open(temporary, 'wx', mode);
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = undefined;
    await link(temporary, destination);
    linked = true;
    await unlink(temporary);
    await fsyncDirectory(directory);
  } catch (error) {
    await handle?.close().catch(() => {});
    await unlink(temporary).catch((cleanupError) => {
      if (cleanupError.code !== 'ENOENT') throw cleanupError;
    });
    if (error.code === 'EEXIST') {
      fail(`${destination} already exists`, error);
    }
    throw error;
  }
  if (!linked) fail(`atomic write did not create ${destination}`);
}

export function resolveRunPaths({ experimentRoot, runId } = {}) {
  if (runId !== FROZEN_RUN_ID) {
    fail(`runId must be exactly ${FROZEN_RUN_ID}`);
  }
  normalizedAbsolutePath(experimentRoot, 'experimentRoot');
  const runsRoot = path.join(experimentRoot, 'runs');
  const runRoot = path.join(runsRoot, runId);
  if (path.dirname(runRoot) !== runsRoot || path.basename(runRoot) !== runId) {
    fail('run path escaped the experiment runs directory');
  }
  return {
    experiment_root: experimentRoot,
    runs_root: runsRoot,
    run_root: runRoot,
    run_path: path.join(runRoot, 'run.json'),
  };
}

function validateMaximumPacket(packet) {
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) {
    fail('packet must be an object');
  }
  if (packet.event_id !== MAXIMUM_EVENT_ID) {
    fail(`maximum-depth packet must target ${MAXIMUM_EVENT_ID}`);
  }
  if (packet.row_version !== 2) {
    fail('maximum-depth packet row version must be 2');
  }
  if (packet.condition !== 'state_plus_all_prior') {
    fail('maximum-depth packet must use state_plus_all_prior');
  }
  nonemptyString(packet.prompt_text, 'packet.prompt_text');
  if (!Array.isArray(packet.images) || packet.images.length !== MAXIMUM_IMAGE_COUNT) {
    fail(`maximum-depth packet must contain exactly ${MAXIMUM_IMAGE_COUNT} images`);
  }
  for (const [index, image] of packet.images.entries()) {
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      fail(`packet image ${index + 1} must be an object`);
    }
    if (image.attachment_ordinal !== index + 1) {
      fail('packet image attachment ordinals must be consecutive from 1');
    }
    normalizedAbsolutePath(image.path, `packet image ${index + 1} path`);
  }
}

export function buildDebugPromptInputArgs({
  instruction,
  packet,
  imagePaths,
} = {}) {
  nonemptyString(instruction, 'instruction');
  validateMaximumPacket(packet);
  const orderedImagePaths = imagePaths ?? packet.images.map((image) => image.path);
  if (!Array.isArray(orderedImagePaths) || orderedImagePaths.length !== MAXIMUM_IMAGE_COUNT) {
    fail(`debug imagePaths must contain exactly ${MAXIMUM_IMAGE_COUNT} paths`);
  }
  for (const [index, imagePath] of orderedImagePaths.entries()) {
    normalizedAbsolutePath(imagePath, `debug image ${index + 1} path`);
  }
  return Object.freeze([
    'debug',
    'prompt-input',
    '-c',
    `model=${JSON.stringify(MODEL)}`,
    '-c',
    `model_reasoning_effort=${JSON.stringify(MODEL_REASONING_EFFORT)}`,
    '-c',
    `service_tier=${JSON.stringify(SERVICE_TIER)}`,
    '-c',
    `developer_instructions=${JSON.stringify(instruction)}`,
    ...orderedImagePaths.flatMap((imagePath) => ['--image', imagePath]),
    '--',
    packet.prompt_text,
  ]);
}

function helpRequires(helpText, option, commandName) {
  if (!helpText.includes(option)) {
    fail(`${commandName} help is missing ${option}`);
  }
}

function variadicImageOption(helpText) {
  return /--image\s+<[^>\r\n]+>\.\.\./.test(helpText);
}

function parseBundledModelCatalog(rawCatalog) {
  let catalog;
  try {
    catalog = JSON.parse(rawCatalog);
  } catch (error) {
    fail('Codex bundled model catalog is not valid JSON', error);
  }
  if (!catalog || typeof catalog !== 'object' || !Array.isArray(catalog.models)) {
    fail('Codex bundled model catalog must contain a models array');
  }
  const model = catalog.models.find((entry) => entry?.slug === MODEL);
  if (!model) fail(`bundled model catalog is missing ${MODEL}`);

  const modalities = Array.isArray(model.input_modalities)
    ? [...model.input_modalities]
    : [];
  if (!modalities.includes('image')) fail(`${MODEL} does not support image input`);

  const reasoningEfforts = Array.isArray(model.supported_reasoning_levels)
    ? model.supported_reasoning_levels.map((entry) => (
      typeof entry === 'string' ? entry : entry?.effort
    ))
    : [];
  if (!reasoningEfforts.includes(MODEL_REASONING_EFFORT)) {
    fail(`${MODEL} does not support ${MODEL_REASONING_EFFORT} reasoning`);
  }

  const serviceTiers = Array.isArray(model.service_tiers)
    ? model.service_tiers.map((entry) => (
      typeof entry === 'string' ? entry : entry?.id
    ))
    : [];
  if (!serviceTiers.includes(SERVICE_TIER)) {
    fail(`${MODEL} does not support ${SERVICE_TIER} service`);
  }

  if (!Number.isInteger(model.context_window)
    || model.context_window < MINIMUM_CONTEXT_WINDOW) {
    fail(`${MODEL} context window is insufficient for ${MAXIMUM_IMAGE_COUNT} images`);
  }
  if (typeof model.base_instructions !== 'string'
    || model.base_instructions.length === 0) {
    fail(`${MODEL} bundled base instructions are missing`);
  }

  return {
    model: {
      slug: model.slug,
      input_modalities: modalities,
      supported_reasoning_efforts: reasoningEfforts,
      service_tiers: serviceTiers,
      context_window: model.context_window,
      max_context_window: Number.isInteger(model.max_context_window)
        ? model.max_context_window
        : null,
    },
    baseInstructions: {
      source: `codex debug models --bundled:${MODEL}`,
      byte_length: Buffer.byteLength(model.base_instructions),
      sha256: sha256(model.base_instructions),
    },
  };
}

async function executeForText(execFileImpl, file, args, cwd) {
  let result;
  try {
    result = await execFileImpl(file, args, {
      cwd,
      shell: false,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    fail(`capability command failed: ${file} ${args.join(' ')}`, error);
  }
  if (!result || (typeof result.stdout !== 'string' && !Buffer.isBuffer(result.stdout))) {
    fail(`capability command returned no stdout: ${file} ${args.join(' ')}`);
  }
  return Buffer.isBuffer(result.stdout)
    ? result.stdout.toString('utf8')
    : result.stdout;
}

export async function validateInstalledCapabilities({
  cwd,
  codexCommand = 'codex',
  nodeCommand = process.execPath,
  sipsCommand = '/usr/bin/sips',
  execFileImpl = execFileAsync,
} = {}) {
  normalizedAbsolutePath(cwd, 'cwd');
  nonemptyString(codexCommand, 'codexCommand');
  nonemptyString(nodeCommand, 'nodeCommand');
  normalizedAbsolutePath(sipsCommand, 'sipsCommand');

  const codexVersion = (
    await executeForText(execFileImpl, codexCommand, ['--version'], cwd)
  ).trim();
  const nodeVersion = (
    await executeForText(execFileImpl, nodeCommand, ['--version'], cwd)
  ).trim();
  const sipsVersion = (
    await executeForText(execFileImpl, sipsCommand, ['--version'], cwd)
  ).trim();
  for (const [name, version] of [
    ['Codex CLI', codexVersion],
    ['Node', nodeVersion],
    ['image decoder', sipsVersion],
  ]) {
    if (version === '') fail(`${name} version is empty`);
  }

  const execHelp = await executeForText(
    execFileImpl,
    codexCommand,
    ['exec', '--help'],
    cwd,
  );
  const debugPromptHelp = await executeForText(
    execFileImpl,
    codexCommand,
    ['debug', 'prompt-input', '--help'],
    cwd,
  );
  const debugModelsHelp = await executeForText(
    execFileImpl,
    codexCommand,
    ['debug', 'models', '--help'],
    cwd,
  );

  for (const option of [
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox',
    '--model',
    '--image',
    '--output-schema',
    '--json',
    '--output-last-message',
  ]) {
    helpRequires(execHelp, option, 'Codex exec');
  }
  if (!variadicImageOption(execHelp)) {
    fail('Codex exec --image must be variadic');
  }
  helpRequires(debugPromptHelp, '--image', 'Codex debug prompt-input');
  if (!variadicImageOption(debugPromptHelp)) {
    fail('Codex debug prompt-input --image must be variadic');
  }
  if (!/\[PROMPT\]/.test(debugPromptHelp)) {
    fail('Codex debug prompt-input must accept a positional prompt');
  }
  helpRequires(debugModelsHelp, '--bundled', 'Codex debug models');

  const rawCatalog = await executeForText(
    execFileImpl,
    codexCommand,
    ['debug', 'models', '--bundled'],
    cwd,
  );
  const { model, baseInstructions } = parseBundledModelCatalog(rawCatalog);

  return deepFreeze({
    capability_record_version: 1,
    versions: {
      codex_cli: codexVersion,
      node: nodeVersion,
      image_decoder: sipsVersion,
    },
    cli: {
      exec_help_sha256: sha256(execHelp),
      debug_prompt_input_help_sha256: sha256(debugPromptHelp),
      debug_models_help_sha256: sha256(debugModelsHelp),
      exec_image_option_variadic: true,
      debug_image_option_variadic: true,
      debug_prompt_uses_positional_after_separator: true,
      debug_supports_ignore_user_config: debugPromptHelp.includes('--ignore-user-config'),
    },
    model,
    base_instructions: baseInstructions,
  });
}

function runtimeHomeIsolationRecord(allowedEntries) {
  return {
    strategy_id: RUNTIME_HOME_STRATEGY_ID,
    private_directory_mode: '0700',
    allowed_entries: [...allowedEntries],
    auth_material_strategy: 'transient-symlink-only',
    credential_bytes_read_copied_hashed_or_logged: false,
    debug_and_exec_share_codex_home: true,
    exec_uses_ignore_user_config: true,
  };
}

export async function validateRuntimeCodexHome({ runtimeCodexHome } = {}) {
  const stat = await validateDirectory(runtimeCodexHome, 'runtimeCodexHome');
  if ((stat.mode & 0o777) !== 0o700) {
    fail('runtimeCodexHome mode must be 0700');
  }
  const entries = (await readdir(runtimeCodexHome)).sort();
  const forbiddenEntries = entries.filter((entry) => entry !== 'auth.json');
  if (forbiddenEntries.length > 0) {
    fail(`runtimeCodexHome contains forbidden entries: ${forbiddenEntries.join(', ')}`);
  }
  if (entries.includes('auth.json')) {
    const authStat = await lstat(path.join(runtimeCodexHome, 'auth.json'));
    if (!authStat.isSymbolicLink()) {
      fail('runtimeCodexHome auth.json must be a transient symlink');
    }
  }
  return deepFreeze(runtimeHomeIsolationRecord(entries));
}

export async function withIsolatedCodexHome({
  runtimeCodexHome,
  authSourcePath = '/Users/dylanvu/.codex/auth.json',
  baseEnv = process.env,
  operation,
} = {}) {
  const isolation = await validateRuntimeCodexHome({ runtimeCodexHome });
  if (isolation.allowed_entries.length !== 0) {
    fail('runtimeCodexHome must not already contain auth.json');
  }
  normalizedAbsolutePath(authSourcePath, 'authSourcePath');
  if (typeof operation !== 'function') fail('operation must be a function');

  let authSourceStat;
  try {
    authSourceStat = await lstat(authSourcePath);
  } catch (error) {
    fail('auth source does not exist', error);
  }
  if (!authSourceStat.isFile() && !authSourceStat.isSymbolicLink()) {
    fail('auth source must be a file or symlink');
  }

  const authLinkPath = path.join(runtimeCodexHome, 'auth.json');
  let linked = false;
  try {
    await symlink(authSourcePath, authLinkPath);
    linked = true;
    const env = { ...baseEnv, CODEX_HOME: runtimeCodexHome };
    delete env.CODEX_THREAD_ID;
    delete env.CODEX_INTERNAL_ORIGINATOR_OVERRIDE;
    return await operation({
      env,
      isolation: deepFreeze(runtimeHomeIsolationRecord(['auth.json'])),
    });
  } finally {
    if (linked) {
      await unlink(authLinkPath);
      await fsyncDirectory(runtimeCodexHome);
    }
  }
}

export async function stageNeutralDebugImages({
  packet,
  cleanDirectory,
} = {}) {
  validateMaximumPacket(packet);
  await validateDirectory(cleanDirectory, 'cleanDirectory');
  const existingEntries = await readdir(cleanDirectory);
  if (existingEntries.length > 0) {
    fail(`cleanDirectory must be empty: ${existingEntries.sort().join(', ')}`);
  }

  const validated = [];
  for (const [index, image] of packet.images.entries()) {
    if (!/^[a-f0-9]{64}$/.test(image.sha256 ?? '')) {
      fail(`packet image ${index + 1} SHA-256 must be lowercase hexadecimal`);
    }
    let sourceStat;
    try {
      sourceStat = await lstat(image.path);
    } catch (error) {
      fail(`packet image ${index + 1} does not exist`, error);
    }
    if (sourceStat.isSymbolicLink() || !sourceStat.isFile()) {
      fail(`packet image ${index + 1} must be a regular non-symlink file`);
    }
    const bytes = await readFile(image.path);
    if (sha256(bytes) !== image.sha256) {
      fail(`packet image ${index + 1} SHA-256 mismatch`);
    }
    validated.push({
      attachment_ordinal: index + 1,
      bytes,
      sha256: image.sha256,
      path: path.join(
        cleanDirectory,
        `image-${String(index + 1).padStart(3, '0')}.png`,
      ),
    });
  }

  const createdPaths = [];
  try {
    for (const image of validated) {
      await atomicWriteNoOverwrite(image.path, image.bytes);
      createdPaths.push(image.path);
    }
  } catch (error) {
    for (const createdPath of createdPaths.reverse()) {
      await unlink(createdPath).catch(() => {});
    }
    await fsyncDirectory(cleanDirectory);
    throw error;
  }

  return deepFreeze({
    image_paths_ordered: validated.map((image) => image.path),
    images: validated.map(({ attachment_ordinal, path: imagePath, sha256: imageSha256 }) => ({
      attachment_ordinal,
      path: imagePath,
      sha256: imageSha256,
    })),
  });
}

function countOccurrences(text, needle) {
  if (needle === '') return 0;
  let count = 0;
  let start = 0;
  while (true) {
    const index = text.indexOf(needle, start);
    if (index < 0) return count;
    count += 1;
    start = index + needle.length;
  }
}

function parseDebugJson(debugJson) {
  if (Array.isArray(debugJson)) return debugJson;
  const raw = Buffer.isBuffer(debugJson)
    ? debugJson.toString('utf8')
    : debugJson;
  if (typeof raw !== 'string') fail('debug JSON must be an array, string, or Buffer');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail('debug prompt-input output is not valid JSON', error);
  }
  if (!Array.isArray(parsed)) fail('debug prompt-input JSON must be a role-annotated array');
  return parsed;
}

function decodeImageDataUrl(value, ordinal) {
  if (typeof value !== 'string') {
    fail(`input image ${ordinal} must contain an image_url string`);
  }
  const match = value.match(
    /^data:image\/[a-zA-Z0-9.+-]+;base64,([A-Za-z0-9+/]*={0,2})$/,
  );
  if (!match) fail(`input image ${ordinal} must be an image base64 data URL`);
  const bytes = Buffer.from(match[1], 'base64');
  if (bytes.length === 0) fail(`input image ${ordinal} data URL is empty`);
  const canonical = bytes.toString('base64').replace(/=+$/, '');
  if (canonical !== match[1].replace(/=+$/, '')) {
    fail(`input image ${ordinal} data URL is malformed`);
  }
  return bytes;
}

const DEFAULT_FORBIDDEN_CUSTOM_INSTRUCTION_FRAGMENTS = Object.freeze([
  '# AGENTS.md instructions',
  '# Memory Behavior',
  "This vault is Dylan's local-first",
  'READ ~/agent-scripts/AGENTS.MD',
]);

export function validateDebugPromptInput({
  debugJson,
  packet,
  manifest,
  instruction,
  stagedImagePaths,
  forbiddenTextFragments = [],
} = {}) {
  validateMaximumPacket(packet);
  nonemptyString(instruction, 'instruction');
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.rows)) {
    fail('manifest must contain rows for debug leakage validation');
  }
  if (!Array.isArray(stagedImagePaths)
    || stagedImagePaths.length !== MAXIMUM_IMAGE_COUNT) {
    fail(`stagedImagePaths must contain exactly ${MAXIMUM_IMAGE_COUNT} paths`);
  }
  for (const [index, stagedPath] of stagedImagePaths.entries()) {
    normalizedAbsolutePath(stagedPath, `staged image ${index + 1} path`);
  }

  const messages = parseDebugJson(debugJson);
  if (messages.length === 0) fail('debug prompt-input message list is empty');
  const textBlocks = [];
  const imageBlocks = [];
  for (const [messageIndex, message] of messages.entries()) {
    if (!message || typeof message !== 'object' || Array.isArray(message)
      || message.type !== 'message'
      || !['developer', 'system', 'user'].includes(message.role)
      || !Array.isArray(message.content)) {
      fail(`debug message ${messageIndex + 1} is not role annotated`);
    }
    for (const [contentIndex, content] of message.content.entries()) {
      if (!content || typeof content !== 'object' || Array.isArray(content)) {
        fail(`debug message ${messageIndex + 1} content ${contentIndex + 1} is invalid`);
      }
      if (content.type === 'input_text') {
        if (typeof content.text !== 'string') {
          fail(`debug text block ${messageIndex + 1}:${contentIndex + 1} is invalid`);
        }
        textBlocks.push({
          message_index: messageIndex,
          content_index: contentIndex,
          role: message.role,
          text: content.text,
        });
      } else if (content.type === 'input_image') {
        imageBlocks.push({
          message_index: messageIndex,
          content_index: contentIndex,
          role: message.role,
          value: content.image_url ?? content.imageUrl ?? content.url,
        });
      } else {
        fail(`debug content type is not frozen: ${String(content.type)}`);
      }
    }
  }

  const developerInstructionBlocks = textBlocks.filter(
    (block) => block.role === 'developer' && block.text === instruction,
  );
  const instructionOccurrences = textBlocks.reduce(
    (sum, block) => sum + countOccurrences(block.text, instruction),
    0,
  );
  if (developerInstructionBlocks.length !== 1 || instructionOccurrences !== 1) {
    fail('frozen instruction must occur exactly once in developer content');
  }

  const promptBlocks = textBlocks.filter(
    (block) => block.role === 'user' && block.text === packet.prompt_text,
  );
  const promptOccurrences = textBlocks.reduce(
    (sum, block) => sum + countOccurrences(block.text, packet.prompt_text),
    0,
  );
  if (promptBlocks.length !== 1 || promptOccurrences !== 1) {
    fail('exact prompt must occur once in one user packet');
  }
  const packetMessageIndex = promptBlocks[0].message_index;
  if (imageBlocks.length !== MAXIMUM_IMAGE_COUNT) {
    fail(`debug prompt-input must contain exactly ${MAXIMUM_IMAGE_COUNT} input_image blocks`);
  }
  if (imageBlocks.some(
    (block) => block.role !== 'user' || block.message_index !== packetMessageIndex,
  )) {
    fail('all input_image blocks must occur in the one user packet');
  }

  const imageSha256Ordered = imageBlocks.map((block, index) => {
    const bytes = decodeImageDataUrl(block.value, index + 1);
    const actualHash = sha256(bytes);
    if (actualHash !== packet.images[index].sha256) {
      fail(`input image ${index + 1} SHA-256 does not match packet order`);
    }
    return actualHash;
  });

  const packetText = textBlocks
    .filter((block) => block.message_index === packetMessageIndex)
    .map((block) => block.text)
    .join('\n');
  for (const [index, stagedPath] of stagedImagePaths.entries()) {
    if (countOccurrences(packetText, stagedPath) !== 1) {
      fail(`neutral staged image path ${index + 1} must occur exactly once in the user packet`);
    }
  }

  const allText = textBlocks.map((block) => block.text).join('\n');
  const currentRow = manifest.rows.find((row) => row?.event_id === packet.event_id);
  if (!currentRow) fail('maximum-depth event is absent from manifest');
  if (typeof currentRow.canonical_label === 'string'
    && currentRow.canonical_label !== ''
    && allText.includes(currentRow.canonical_label)) {
    fail('textual debug content leaks current canonical target');
  }

  const auditValues = new Set();
  for (const row of manifest.rows) {
    for (const value of [
      row?.event_id,
      row?.source_recording_ref,
      row?.before_player_time,
      row?.action_player_time,
      ...(Array.isArray(row?.before_state_inputs)
        ? row.before_state_inputs.map((image) => image?.path)
        : []),
    ]) {
      if (typeof value === 'string' && value !== '') auditValues.add(value);
    }
  }
  for (const image of packet.images) auditValues.add(image.path);
  for (const value of auditValues) {
    if (allText.includes(value)) {
      fail(`textual debug content leaks audit value: ${value}`);
    }
  }

  const customInstructionFragments = [
    ...DEFAULT_FORBIDDEN_CUSTOM_INSTRUCTION_FRAGMENTS,
    ...forbiddenTextFragments,
  ];
  for (const fragment of customInstructionFragments) {
    nonemptyString(fragment, 'forbidden custom instruction fragment');
    if (allText.includes(fragment)) {
      fail(`textual debug content contains forbidden custom instructions: ${fragment}`);
    }
  }

  const builtInContext = textBlocks
    .filter((block) => (
      block.text !== instruction
      && block.text !== packet.prompt_text
      && block.text !== '</image>'
      && !block.text.startsWith('<image name=')
    ))
    .map((block) => ({
      message_index: block.message_index,
      content_index: block.content_index,
      role: block.role,
      byte_length: Buffer.byteLength(block.text),
      sha256: sha256(block.text),
    }));

  return deepFreeze({
    debug_validation_version: 1,
    message_count: messages.length,
    developer_instruction_occurrences: 1,
    user_prompt_occurrences: 1,
    input_image_count: MAXIMUM_IMAGE_COUNT,
    image_sha256_ordered: imageSha256Ordered,
    built_in_context: builtInContext,
  });
}

async function collectSpawnedProcess({
  command,
  args,
  cwd,
  env,
  spawnImpl,
}) {
  let child;
  try {
    child = spawnImpl(command, args, {
      cwd,
      env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    fail('debug prompt-input process could not start', error);
  }
  const stdout = [];
  const stderr = [];
  child.stdout?.on('data', (chunk) => stdout.push(Buffer.from(chunk)));
  child.stderr?.on('data', (chunk) => stderr.push(Buffer.from(chunk)));
  const result = await new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };
    child.once('error', (error) => finish(reject, error));
    child.once('close', (exitCode, signal) => {
      finish(resolve, { exitCode, signal });
    });
  }).catch((error) => fail('debug prompt-input process failed', error));
  return {
    stdout: Buffer.concat(stdout),
    stderr: Buffer.concat(stderr),
    exitCode: result.exitCode,
    signal: result.signal,
  };
}

export async function runDebugPromptInput({
  packet,
  manifest,
  instruction,
  cleanDirectory,
  modelImageDirectory,
  runtimeCodexHome,
  authSourcePath,
  debugArtifactPath,
  forbiddenTextFragments = [],
  codexCommand = 'codex',
  baseEnv = process.env,
  spawnImpl = spawn,
} = {}) {
  normalizedAbsolutePath(debugArtifactPath, 'debugArtifactPath');
  if (await pathExists(debugArtifactPath)) {
    fail(`${debugArtifactPath} already exists`);
  }
  await validateDirectory(path.dirname(debugArtifactPath), 'debug artifact directory');
  nonemptyString(codexCommand, 'codexCommand');
  await validateDirectory(cleanDirectory, 'cleanDirectory');
  await validateDirectory(modelImageDirectory, 'modelImageDirectory');
  if (await realpath(cleanDirectory) === await realpath(modelImageDirectory)) {
    fail('cleanDirectory and modelImageDirectory must be distinct');
  }
  const cleanEntries = await readdir(cleanDirectory);
  if (cleanEntries.length > 0) {
    fail(`cleanDirectory must be empty: ${cleanEntries.sort().join(', ')}`);
  }
  const staged = await stageNeutralDebugImages({
    packet,
    cleanDirectory: modelImageDirectory,
  });
  const args = buildDebugPromptInputArgs({
    instruction,
    packet,
    imagePaths: staged.image_paths_ordered,
  });

  const processResult = await withIsolatedCodexHome({
    runtimeCodexHome,
    authSourcePath,
    baseEnv,
    operation: ({ env }) => collectSpawnedProcess({
      command: codexCommand,
      args,
      cwd: cleanDirectory,
      env,
      spawnImpl,
    }),
  });
  if (processResult.exitCode !== 0 || processResult.signal !== null) {
    fail(
      `debug prompt-input exited unsuccessfully: exit=${String(processResult.exitCode)} signal=${String(processResult.signal)}`,
    );
  }
  if (processResult.stderr.length > 0) {
    fail('debug prompt-input wrote to stderr');
  }

  const validation = validateDebugPromptInput({
    debugJson: processResult.stdout,
    packet,
    manifest,
    instruction,
    stagedImagePaths: staged.image_paths_ordered,
    forbiddenTextFragments,
  });
  await atomicWriteNoOverwrite(debugArtifactPath, processResult.stdout);
  return deepFreeze({
    path: debugArtifactPath,
    sha256: sha256(processResult.stdout),
    executable: codexCommand,
    argv: [...args],
    shell: false,
    isolation_strategy_id: RUNTIME_HOME_STRATEGY_ID,
    validation,
  });
}

function deterministicJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function conditionArtifactPaths(runRoot, entry) {
  const conditionDirectory = path.join(
    runRoot,
    'targets',
    `${String(entry.paired_target_ordinal).padStart(2, '0')}-${entry.event_id}`,
    entry.condition,
  );
  return {
    packetPath: path.join(conditionDirectory, 'packet.json'),
    promptPath: path.join(conditionDirectory, 'prompt.txt'),
  };
}

async function readRegularFile(inputPath, name) {
  let stat;
  try {
    stat = await lstat(inputPath);
  } catch (error) {
    if (error.code === 'ENOENT') fail(`${name} does not exist`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    fail(`${name} must be a regular non-symlink file`);
  }
  return readFile(inputPath);
}

function validateFrozenManifestIdentity(manifest) {
  const expected = {
    dataset_snapshot_id: 'BLOG-MINI-20-V2',
    manifest_id: 'MINI-20-20260728-V2',
    protocol_id: 'BLOG-EXPANDING-HISTORY-SMOKE-V2',
    logical_session_id: 'BLOG-WORK-20260727',
  };
  for (const [key, value] of Object.entries(expected)) {
    if (manifest?.[key] !== value) fail(`manifest ${key} must be ${value}`);
  }
  if (!Array.isArray(manifest.rows) || manifest.rows.length !== 20) {
    fail('manifest must contain exactly 20 rows');
  }
  if (!isDeepStrictEqual(
    manifest.rows.map((row) => row?.event_id),
    [...FROZEN_EVENT_IDS],
  )) {
    fail('manifest rows do not use the frozen order');
  }
}

export async function validateCandidateArtifacts({
  experimentRoot,
  runId,
  loadManifestImpl = loadAndValidateManifest,
  buildScheduleImpl = buildSchedule,
  renderPacketImpl = renderPacket,
} = {}) {
  const paths = resolveRunPaths({ experimentRoot, runId });
  await validateDirectory(paths.run_root, 'run root');
  const manifestPath = path.join(experimentRoot, 'manifest.json');
  const manifest = await loadManifestImpl(manifestPath);
  validateFrozenManifestIdentity(manifest);

  const expectedSchedule = buildScheduleImpl(manifest);
  if (!Array.isArray(expectedSchedule) || expectedSchedule.length !== 38) {
    fail('candidate schedule must contain exactly 38 slots');
  }
  const targetIds = new Set(expectedSchedule.map((entry) => entry.event_id));
  if (targetIds.size !== 19 || targetIds.has(FROZEN_EVENT_IDS[0])) {
    fail('candidate schedule must contain exactly 19 non-seed targets');
  }
  const schedulePath = path.join(paths.run_root, 'schedule.json');
  const scheduleBytes = await readRegularFile(schedulePath, 'schedule.json');
  if (scheduleBytes.toString('utf8') !== deterministicJson(expectedSchedule)) {
    fail('schedule.json bytes do not match the exact frozen schedule');
  }

  const evidenceImages = manifest.rows.flatMap((row) => row.before_state_inputs ?? []);
  const evidencePaths = evidenceImages.map((image) => image?.path);
  if (evidenceImages.length !== 40 || new Set(evidencePaths).size !== 40) {
    fail('manifest must reference 40 distinct evidence image paths');
  }
  for (const [index, image] of evidenceImages.entries()) {
    normalizedAbsolutePath(image.path, `evidence image ${index + 1} path`);
    if (!/^[a-f0-9]{64}$/.test(image.sha256 ?? '')) {
      fail(`evidence image ${index + 1} SHA-256 is invalid`);
    }
    const bytes = await readRegularFile(image.path, `evidence image ${index + 1}`);
    if (sha256(bytes) !== image.sha256) {
      fail(`evidence image ${index + 1} SHA-256 mismatch`);
    }
  }

  const packetPaths = [];
  const promptPaths = [];
  let maximumPacket = null;
  for (const entry of expectedSchedule) {
    const expectedPacket = renderPacketImpl(manifest, {
      eventId: entry.event_id,
      condition: entry.condition,
    });
    const { packetPath, promptPath } = conditionArtifactPaths(paths.run_root, entry);
    const packetBytes = await readRegularFile(packetPath, 'rendered packet');
    if (packetBytes.toString('utf8') !== deterministicJson(expectedPacket)) {
      fail(`rendered packet differs from frozen identity: ${packetPath}`);
    }
    const promptBytes = await readRegularFile(promptPath, 'rendered prompt');
    if (promptBytes.toString('utf8') !== expectedPacket.prompt_text) {
      fail(`rendered prompt differs from packet: ${promptPath}`);
    }
    packetPaths.push(packetPath);
    promptPaths.push(promptPath);
    if (entry.event_id === MAXIMUM_EVENT_ID
      && entry.condition === 'state_plus_all_prior') {
      maximumPacket = expectedPacket;
    }
  }
  validateMaximumPacket(maximumPacket);
  if (!Array.isArray(maximumPacket.history_event_ids_ordered)
    || maximumPacket.history_event_ids_ordered.length !== 19
    || !isDeepStrictEqual(
      maximumPacket.history_event_ids_ordered,
      manifest.rows.slice(0, 19).map((row) => row.event_id),
    )) {
    fail('maximum-depth packet history is not the exact 19-row prefix');
  }
  if (maximumPacket.images.slice(0, 38).some((image) => image.provenance_role !== 'history')
    || maximumPacket.images.slice(38).some((image) => image.provenance_role !== 'current')) {
    fail('maximum-depth packet image provenance order is invalid');
  }
  const maximumCurrent = manifest.rows[19];
  if (maximumPacket.prompt_text.includes(maximumCurrent.canonical_label)) {
    fail('maximum-depth packet leaks the current canonical target');
  }

  return deepFreeze({
    manifest,
    schedule: expectedSchedule,
    maximum_packet: maximumPacket,
    manifest_path: manifestPath,
    schedule_path: schedulePath,
    packet_paths: packetPaths,
    prompt_paths: promptPaths,
    evidence_paths: evidencePaths,
    manifest_rows: 20,
    target_pairs: 19,
    condition_slots: 38,
    distinct_evidence_images: 40,
  });
}

export function buildTargetContract(manifest) {
  validateFrozenManifestIdentity(manifest);
  return {
    target_contract_version: TARGET_CONTRACT_VERSION,
    dataset_snapshot_id: manifest.dataset_snapshot_id,
    manifest_id: manifest.manifest_id,
    protocol_id: manifest.protocol_id,
    logical_session_id: manifest.logical_session_id,
    targets_ordered: manifest.rows.map((row) => ({
      event_id: row.event_id,
      row_version: row.row_version,
      canonical_label: row.canonical_label,
      target: {
        app: row.target.app,
        object: row.target.object,
        subtarget: row.target.subtarget,
      },
      accepted_aliases: {
        app: [...row.accepted_aliases.app],
        object: [...row.accepted_aliases.object],
        subtarget: [...row.accepted_aliases.subtarget],
      },
    })),
  };
}

async function ensureTargetContract(runRoot, manifest) {
  const targetContractPath = path.join(runRoot, 'target-contract.json');
  const bytes = Buffer.from(deterministicJson(buildTargetContract(manifest)));
  if (await pathExists(targetContractPath)) {
    const existing = await readRegularFile(targetContractPath, 'target-contract.json');
    if (!existing.equals(bytes)) fail('existing target-contract.json differs from manifest');
  } else {
    await atomicWriteNoOverwrite(targetContractPath, bytes);
  }
  return {
    path: targetContractPath,
    sha256: sha256(bytes),
  };
}

async function discoverTestPaths(experimentRoot) {
  const testDirectory = path.join(experimentRoot, 'test');
  await validateDirectory(testDirectory, 'test directory');
  const names = (await readdir(testDirectory))
    .filter((name) => name.endsWith('.test.mjs'))
    .sort();
  if (names.length === 0) fail('no harness tests found');
  return names.map((name) => path.join(testDirectory, name));
}

function requiredRuntimePaths(experimentRoot) {
  return [
    'manifest.mjs',
    'packets.mjs',
    'schedule.mjs',
    'attempts.mjs',
    'scoring.mjs',
    'runlock.mjs',
  ].map((name) => path.join(experimentRoot, 'lib', name));
}

async function buildInventory(paths) {
  const uniquePaths = [...new Set(paths)].sort();
  if (uniquePaths.length !== paths.length) {
    fail('inventory source paths contain duplicates');
  }
  const inventory = [];
  for (const inputPath of uniquePaths) {
    normalizedAbsolutePath(inputPath, 'inventory path');
    inventory.push({
      path: inputPath,
      sha256: sha256(await readRegularFile(inputPath, `inventory file ${inputPath}`)),
    });
  }
  return inventory;
}

function executionArgumentTemplate(instruction) {
  return {
    executable: 'codex',
    argv_prefix: [
      'exec',
      '--ephemeral',
      '--ignore-user-config',
      '--ignore-rules',
      '--skip-git-repo-check',
      '--sandbox', 'read-only',
      '--model', MODEL,
      '-c', `model_reasoning_effort=${JSON.stringify(MODEL_REASONING_EFFORT)}`,
      '-c', `service_tier=${JSON.stringify(SERVICE_TIER)}`,
      '-c', `developer_instructions=${JSON.stringify(instruction)}`,
      '--output-schema', '{schema_path}',
      '--json',
      '--output-last-message', '{final_path}',
      '--cd', '{clean_call_directory}',
    ],
    repeated_image_argv: ['--image', '{ordered_image_path}'],
    argv_suffix: ['--', '-'],
    prompt_transport: 'stdin',
  };
}

async function defaultTestRunner({ command, args, cwd }) {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      shell: false,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    return { exitCode: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      exitCode: Number.isInteger(error.code) ? error.code : 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? error.message,
    };
  }
}

function validateDebugResult(debugResult, expectedPath, maximumPacket) {
  if (!debugResult || debugResult.path !== expectedPath) {
    fail('debug audit path is not frozen');
  }
  if (debugResult.executable !== 'codex'
    || debugResult.shell !== false
    || debugResult.isolation_strategy_id !== RUNTIME_HOME_STRATEGY_ID) {
    fail('debug audit execution metadata is invalid');
  }
  if (debugResult.validation?.input_image_count !== 40
    || !isDeepStrictEqual(
      debugResult.validation?.image_sha256_ordered,
      maximumPacket.images.map((image) => image.sha256),
    )) {
    fail('debug audit image validation does not match maximum packet');
  }
}

export async function freezeRun({
  experimentRoot,
  runId,
  nowImpl = () => new Date(),
  loadManifestImpl = loadAndValidateManifest,
  buildScheduleImpl = buildSchedule,
  renderPacketImpl = renderPacket,
  validateCapabilitiesImpl = validateInstalledCapabilities,
  capabilityOptions = {},
  testRunner = defaultTestRunner,
  runDebugImpl = runDebugPromptInput,
  debugOptions = {},
  runtimeCodexHome,
  authSourcePath,
} = {}) {
  const paths = resolveRunPaths({ experimentRoot, runId });
  await validateDirectory(paths.run_root, 'run root');
  if (await pathExists(paths.run_path)) fail(`${paths.run_path} already exists`);

  const testPaths = await discoverTestPaths(experimentRoot);
  const testResult = await testRunner({
    command: process.execPath,
    args: ['--test', ...testPaths],
    cwd: experimentRoot,
    shell: false,
  });
  if (!testResult || testResult.exitCode !== 0) fail('harness tests failed');

  const candidate = await validateCandidateArtifacts({
    experimentRoot,
    runId,
    loadManifestImpl,
    buildScheduleImpl,
    renderPacketImpl,
  });
  const targetContract = await ensureTargetContract(paths.run_root, candidate.manifest);
  const capabilities = await validateCapabilitiesImpl({
    cwd: capabilityOptions.cwd ?? experimentRoot,
    ...capabilityOptions,
  });
  const instructionPath = path.join(experimentRoot, 'predictor-instruction.txt');
  const instruction = (await readRegularFile(
    instructionPath,
    'predictor instruction',
  )).toString('utf8');
  nonemptyString(instruction, 'predictor instruction');

  const debugArtifactPath = path.join(paths.run_root, 'debug', 'prompt-input.json');
  if (!(await pathExists(path.dirname(debugArtifactPath)))) {
    await mkdir(path.dirname(debugArtifactPath), { mode: 0o700 });
  }
  let temporaryCleanDirectory;
  let temporaryModelImageDirectory;
  const effectiveDebugOptions = { ...debugOptions };
  if (runDebugImpl === runDebugPromptInput) {
    if (effectiveDebugOptions.runtimeCodexHome === undefined) {
      effectiveDebugOptions.runtimeCodexHome = runtimeCodexHome;
    }
    if (effectiveDebugOptions.authSourcePath === undefined
      && authSourcePath !== undefined) {
      effectiveDebugOptions.authSourcePath = authSourcePath;
    }
    if (effectiveDebugOptions.cleanDirectory === undefined) {
      temporaryCleanDirectory = await mkdtemp(path.join(tmpdir(), 'nap-debug-call-'));
      effectiveDebugOptions.cleanDirectory = temporaryCleanDirectory;
    }
    if (effectiveDebugOptions.modelImageDirectory === undefined) {
      temporaryModelImageDirectory = await mkdtemp(
        path.join(tmpdir(), 'nap-debug-images-'),
      );
      effectiveDebugOptions.modelImageDirectory = temporaryModelImageDirectory;
    }
  }
  let debugResult;
  try {
    debugResult = await runDebugImpl({
      packet: candidate.maximum_packet,
      manifest: candidate.manifest,
      instruction,
      debugArtifactPath,
      ...effectiveDebugOptions,
    });
  } finally {
    if (temporaryCleanDirectory) {
      await rm(temporaryCleanDirectory, { recursive: true, force: true });
    }
    if (temporaryModelImageDirectory) {
      await rm(temporaryModelImageDirectory, { recursive: true, force: true });
    }
  }
  validateDebugResult(debugResult, debugArtifactPath, candidate.maximum_packet);
  const debugBytes = await readRegularFile(debugArtifactPath, 'debug audit');
  if (sha256(debugBytes) !== debugResult.sha256) fail('debug audit SHA-256 mismatch');

  const inventoryPaths = [
    candidate.manifest_path,
    targetContract.path,
    instructionPath,
    path.join(experimentRoot, 'prediction.schema.json'),
    ...requiredRuntimePaths(experimentRoot),
    path.join(experimentRoot, 'run-smoke.mjs'),
    ...testPaths,
    candidate.schedule_path,
    ...candidate.packet_paths,
    ...candidate.prompt_paths,
    ...candidate.evidence_paths,
    debugArtifactPath,
  ];
  const inventory = await buildInventory(inventoryPaths);
  const created = nowImpl();
  const createdAt = created instanceof Date ? created : new Date(created);
  if (Number.isNaN(createdAt.getTime())) fail('clock returned an invalid date');
  const lock = {
    run_lock_version: LOCK_VERSION,
    run_id: runId,
    frozen_at_utc: createdAt.toISOString(),
    identities: {
      dataset_snapshot_id: candidate.manifest.dataset_snapshot_id,
      manifest_id: candidate.manifest.manifest_id,
      protocol_id: candidate.manifest.protocol_id,
      logical_session_id: candidate.manifest.logical_session_id,
    },
    counts: {
      manifest_rows: 20,
      target_pairs: 19,
      condition_slots: 38,
      distinct_evidence_images: 40,
    },
    execution: {
      model: MODEL,
      model_reasoning_effort: MODEL_REASONING_EFFORT,
      service_tier: SERVICE_TIER,
      timeout_ms: 1_200_000,
      runtime_codex_home_strategy_id: RUNTIME_HOME_STRATEGY_ID,
      argument_template: executionArgumentTemplate(instruction),
    },
    capabilities,
    target_contract: targetContract,
    debug_audit: {
      path: debugArtifactPath,
      sha256: debugResult.sha256,
      executable: debugResult.executable,
      argv: [...debugResult.argv],
      shell: false,
      isolation_strategy_id: debugResult.isolation_strategy_id,
      validation: debugResult.validation,
      base_instructions: capabilities.base_instructions,
    },
    inventory,
  };
  await atomicWriteNoOverwrite(paths.run_path, Buffer.from(deterministicJson(lock)));
  return deepFreeze(lock);
}

function exactTopLevelLock(lock) {
  const keys = Object.keys(lock ?? {}).sort();
  const expected = [
    'capabilities',
    'counts',
    'debug_audit',
    'execution',
    'frozen_at_utc',
    'identities',
    'inventory',
    'run_id',
    'run_lock_version',
    'target_contract',
  ].sort();
  if (!isDeepStrictEqual(keys, expected)) fail('run.json top-level structure is invalid');
}

export async function verifyRunLock({
  experimentRoot,
  runId,
  runPath,
  runLock,
  loadManifestImpl = loadAndValidateManifest,
  validateCapabilitiesImpl = validateInstalledCapabilities,
  capabilityOptions = {},
} = {}) {
  const paths = resolveRunPaths({ experimentRoot, runId });
  if (runPath !== undefined && runPath !== paths.run_path) {
    fail('runPath does not match the fixed run path');
  }
  if (!(await pathExists(paths.run_path))) fail(`${paths.run_path} does not exist`);
  let diskLock;
  try {
    diskLock = JSON.parse(await readFile(paths.run_path, 'utf8'));
  } catch (error) {
    fail('run.json is not valid JSON', error);
  }
  if (runLock !== undefined && !isDeepStrictEqual(runLock, diskLock)) {
    fail('provided runLock differs from run.json');
  }
  const lock = diskLock;
  exactTopLevelLock(lock);
  if (lock.run_lock_version !== LOCK_VERSION || lock.run_id !== runId) {
    fail('run.json version or run ID is invalid');
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(lock.frozen_at_utc)) {
    fail('run.json frozen_at_utc is invalid');
  }
  const manifest = await loadManifestImpl(path.join(experimentRoot, 'manifest.json'));
  validateFrozenManifestIdentity(manifest);
  if (!isDeepStrictEqual(lock.identities, {
    dataset_snapshot_id: manifest.dataset_snapshot_id,
    manifest_id: manifest.manifest_id,
    protocol_id: manifest.protocol_id,
    logical_session_id: manifest.logical_session_id,
  })) fail('run.json manifest identities are invalid');
  if (!isDeepStrictEqual(lock.counts, {
    manifest_rows: 20,
    target_pairs: 19,
    condition_slots: 38,
    distinct_evidence_images: 40,
  })) fail('run.json counts are invalid');

  const instruction = (await readRegularFile(
    path.join(experimentRoot, 'predictor-instruction.txt'),
    'predictor instruction',
  )).toString('utf8');
  if (!isDeepStrictEqual(lock.execution, {
    model: MODEL,
    model_reasoning_effort: MODEL_REASONING_EFFORT,
    service_tier: SERVICE_TIER,
    timeout_ms: 1_200_000,
    runtime_codex_home_strategy_id: RUNTIME_HOME_STRATEGY_ID,
    argument_template: executionArgumentTemplate(instruction),
  })) fail('run.json execution settings or argument template are invalid');
  const currentCapabilities = await validateCapabilitiesImpl({
    cwd: capabilityOptions.cwd ?? experimentRoot,
    ...capabilityOptions,
  });
  if (!isDeepStrictEqual(lock.capabilities, currentCapabilities)) {
    fail('installed capability versions or model catalog drifted');
  }
  if (!isDeepStrictEqual(lock.debug_audit.base_instructions, currentCapabilities.base_instructions)
    || lock.debug_audit.path !== path.join(paths.run_root, 'debug', 'prompt-input.json')
    || !/^[a-f0-9]{64}$/.test(lock.debug_audit.sha256 ?? '')) {
    fail('run.json debug audit metadata is invalid');
  }

  const schedulePath = path.join(paths.run_root, 'schedule.json');
  let schedule;
  try {
    schedule = JSON.parse(await readFile(schedulePath, 'utf8'));
  } catch (error) {
    fail('schedule.json is not valid JSON', error);
  }
  if (!Array.isArray(schedule) || schedule.length !== 38) {
    fail('locked schedule must contain 38 slots');
  }
  const testPaths = await discoverTestPaths(experimentRoot);
  const packetPaths = [];
  const promptPaths = [];
  for (const entry of schedule) {
    const artifacts = conditionArtifactPaths(paths.run_root, entry);
    packetPaths.push(artifacts.packetPath);
    promptPaths.push(artifacts.promptPath);
  }
  const expectedInventoryPaths = [
    path.join(experimentRoot, 'manifest.json'),
    path.join(paths.run_root, 'target-contract.json'),
    path.join(experimentRoot, 'predictor-instruction.txt'),
    path.join(experimentRoot, 'prediction.schema.json'),
    ...requiredRuntimePaths(experimentRoot),
    path.join(experimentRoot, 'run-smoke.mjs'),
    ...testPaths,
    schedulePath,
    ...packetPaths,
    ...promptPaths,
    ...manifest.rows.flatMap((row) => row.before_state_inputs.map((image) => image.path)),
    path.join(paths.run_root, 'debug', 'prompt-input.json'),
  ].sort();
  if (!Array.isArray(lock.inventory)) fail('run.json inventory must be an array');
  const inventoryPaths = lock.inventory.map((entry) => entry?.path);
  if (!isDeepStrictEqual(inventoryPaths, [...inventoryPaths].sort())
    || new Set(inventoryPaths).size !== inventoryPaths.length
    || !isDeepStrictEqual(inventoryPaths, expectedInventoryPaths)) {
    fail('run.json inventory is not exact, sorted, and unique');
  }
  for (const entry of lock.inventory) {
    if (!entry || Object.keys(entry).sort().join(',') !== 'path,sha256'
      || !/^[a-f0-9]{64}$/.test(entry.sha256 ?? '')) {
      fail('run.json inventory entry is invalid');
    }
    const actualHash = sha256(await readRegularFile(
      entry.path,
      `inventoried file ${entry.path}`,
    ));
    if (actualHash !== entry.sha256) {
      fail(`inventory hash drift: ${entry.path}`);
    }
  }
  const targetEntry = lock.inventory.find(
    (entry) => entry.path === lock.target_contract.path,
  );
  const debugEntry = lock.inventory.find(
    (entry) => entry.path === lock.debug_audit.path,
  );
  if (targetEntry?.sha256 !== lock.target_contract.sha256
    || debugEntry?.sha256 !== lock.debug_audit.sha256) {
    fail('run.json named artifact hashes do not match inventory');
  }
  return deepFreeze(lock);
}
