import { constants } from 'node:fs';
import { lstat, open, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { sha256, writeImmutable } from './immutable.mjs';

export const V4_DONOR_ROOT = '/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v4';
export const V4_FILE_COUNT = 21;
export const V4_AGGREGATE_SHA256 = '307f06ad992e20aa51d464a4b04e2145eab6f950f26fcb2edbe289319871d0bc';
export const V4_METHOD_LOCK_SHA256 = '55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa';
export const DEFAULT_INVENTORY_PATH = '/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v5-expanded-history/evaluator/v4-donor-inventory.json';

function posixRelative(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

function assertContained(root, candidate) {
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Donor path escapes root: ${candidate}`);
  }
}

async function walkRegularFiles(root, rootReal, directory = root, files = []) {
  assertContained(rootReal, await realpath(directory));
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    const stat = await lstat(target);
    if (stat.isSymbolicLink()) {
      throw new Error(`Donor tree contains symlink: ${target}`);
    }
    if (stat.isDirectory()) {
      assertContained(rootReal, await realpath(target));
      await walkRegularFiles(root, rootReal, target, files);
    } else if (stat.isFile()) {
      assertContained(rootReal, await realpath(target));
      files.push(target);
    } else {
      throw new Error(`Donor tree contains special non-regular entry: ${target}`);
    }
  }
  return files;
}

export async function listRegularFiles(root) {
  const resolvedRoot = path.resolve(root);
  const rootStat = await lstat(resolvedRoot);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error(`Donor root must be a non-symlink directory: ${root}`);
  }
  const rootReal = await realpath(resolvedRoot);
  const files = await walkRegularFiles(resolvedRoot, rootReal);
  return files.sort((left, right) => {
    const leftPath = posixRelative(resolvedRoot, left);
    const rightPath = posixRelative(resolvedRoot, right);
    return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0;
  });
}

function sameSnapshot(left, right) {
  return left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

async function verifiedLeafBytes(root, rootReal, target) {
  const relativePath = posixRelative(root, target);
  assertContained(root, path.resolve(target));
  assertContained(rootReal, await realpath(path.dirname(target)));
  const handle = await open(target, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat({ bigint: true });
    const pathBefore = await lstat(target, { bigint: true });
    if (!before.isFile() || !pathBefore.isFile() || pathBefore.isSymbolicLink()) {
      throw new Error(`Donor leaf is not a regular file: ${relativePath}`);
    }
    if (before.dev !== pathBefore.dev || before.ino !== pathBefore.ino) {
      throw new Error(`Donor leaf changed before read: ${relativePath}`);
    }
    assertContained(rootReal, await realpath(target));
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    const pathAfter = await lstat(target, { bigint: true });
    if (!sameSnapshot(before, after)
      || !sameSnapshot(pathBefore, pathAfter)
      || pathAfter.isSymbolicLink()
      || after.dev !== pathAfter.dev
      || after.ino !== pathAfter.ino) {
      throw new Error(`Donor leaf changed during read: ${relativePath}`);
    }
    assertContained(rootReal, await realpath(target));
    return bytes;
  } finally {
    await handle.close();
  }
}

export async function buildDonorInventory(root = V4_DONOR_ROOT) {
  const resolvedRoot = path.resolve(root);
  const rootReal = await realpath(resolvedRoot);
  const files = [];
  const initialTargets = await listRegularFiles(root);
  for (const target of initialTargets) {
    const bytes = await verifiedLeafBytes(resolvedRoot, rootReal, target);
    files.push({
      path: posixRelative(resolvedRoot, target),
      byte_length: bytes.length,
      sha256: sha256(bytes),
    });
  }
  const finalPaths = (await listRegularFiles(root)).map((target) => posixRelative(resolvedRoot, target));
  const initialPaths = initialTargets.map((target) => posixRelative(resolvedRoot, target));
  if (finalPaths.length !== initialPaths.length || finalPaths.some((entry, index) => entry !== initialPaths[index])) {
    throw new Error('Donor file set changed during hashing');
  }
  const aggregateInput = files.map((file) => `${file.sha256}  ${file.path}\n`).join('');
  return {
    version: 1,
    root,
    files,
    aggregate_sha256: sha256(aggregateInput),
  };
}

function assertExactKeys(value, expected, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new TypeError(`${label} must be a plain object`);
  }
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) {
    throw new Error(`${label} has invalid keys`);
  }
}

function validateExpectedInventory(root, inventory) {
  assertExactKeys(inventory, ['version', 'root', 'files', 'aggregate_sha256'], 'Donor inventory');
  if (inventory.version !== 1) throw new Error('Donor inventory version must be 1');
  if (inventory.root !== root) throw new Error(`Donor inventory root mismatch: ${String(inventory.root)}`);
  if (!Array.isArray(inventory.files)) throw new TypeError('Donor inventory files must be an array');
  if (typeof inventory.aggregate_sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(inventory.aggregate_sha256)) {
    throw new TypeError('Donor inventory aggregate SHA-256 must be 64 lowercase hex characters');
  }
  const paths = new Set();
  let previousPath = null;
  for (const file of inventory.files) {
    assertExactKeys(file, ['path', 'byte_length', 'sha256'], 'Donor inventory file');
    if (typeof file.path !== 'string'
      || file.path.length === 0
      || file.path.includes('\\')
      || file.path.includes('\0')
      || path.posix.isAbsolute(file.path)
      || path.posix.normalize(file.path) !== file.path
      || file.path === '.'
      || file.path.split('/').includes('..')) {
      throw new Error(`Unsafe donor inventory path: ${String(file.path)}`);
    }
    if (paths.has(file.path)) throw new Error(`Duplicate donor inventory path: ${file.path}`);
    if (previousPath !== null && file.path < previousPath) throw new Error('Donor inventory files must be sorted');
    if (!Number.isSafeInteger(file.byte_length) || file.byte_length < 0) {
      throw new TypeError(`Donor inventory byte_length must be a nonnegative integer: ${file.path}`);
    }
    if (typeof file.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(file.sha256)) {
      throw new TypeError(`Donor inventory SHA-256 must be 64 lowercase hex characters: ${file.path}`);
    }
    paths.add(file.path);
    previousPath = file.path;
  }
}

export async function validateDonorInventory(root, expectedInventory) {
  validateExpectedInventory(root, expectedInventory);
  const actual = await buildDonorInventory(root);
  if (actual.files.length !== expectedInventory.files.length) {
    throw new Error(`Donor file count drift: expected ${expectedInventory.files.length}, got ${actual.files.length}`);
  }
  for (let index = 0; index < actual.files.length; index += 1) {
    const expected = expectedInventory.files[index];
    const observed = actual.files[index];
    if (expected.path !== observed.path) throw new Error(`Donor path drift: ${observed.path}`);
    if (expected.byte_length !== observed.byte_length) throw new Error(`Donor byte length drift: ${observed.path}`);
    if (expected.sha256 !== observed.sha256) throw new Error(`Donor SHA-256 drift: ${observed.path}`);
  }
  if (actual.aggregate_sha256 !== expectedInventory.aggregate_sha256) {
    throw new Error('Donor aggregate SHA-256 drift');
  }
  return actual;
}

function lexicalError(source, index, message) {
  const line = source.slice(0, index).split('\n').length;
  throw new Error(`ESM lexical audit failed at line ${line}: ${message}`);
}

function isIdentifierStart(character) {
  return /[A-Za-z_$]/.test(character ?? '');
}

function isIdentifierPart(character) {
  return /[A-Za-z0-9_$]/.test(character ?? '');
}

function decodeEscape(source, index) {
  const escaped = source[index + 1];
  if (escaped === undefined) lexicalError(source, index, 'unterminated escape');
  if (escaped === '\n') return { value: '', end: index + 2 };
  if (escaped === '\r') return { value: '', end: source[index + 2] === '\n' ? index + 3 : index + 2 };
  const simple = { b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\v', 0: '\0' };
  if (Object.hasOwn(simple, escaped)) {
    if (escaped === '0' && /[0-9]/.test(source[index + 2] ?? '')) lexicalError(source, index, 'legacy octal escape');
    return { value: simple[escaped], end: index + 2 };
  }
  if (escaped === 'x') {
    const digits = source.slice(index + 2, index + 4);
    if (!/^[0-9A-Fa-f]{2}$/.test(digits)) lexicalError(source, index, 'invalid hexadecimal escape');
    return { value: String.fromCodePoint(Number.parseInt(digits, 16)), end: index + 4 };
  }
  if (escaped === 'u') {
    if (source[index + 2] === '{') {
      const close = source.indexOf('}', index + 3);
      const digits = close === -1 ? '' : source.slice(index + 3, close);
      const codePoint = Number.parseInt(digits, 16);
      if (!/^[0-9A-Fa-f]+$/.test(digits) || codePoint > 0x10ffff) lexicalError(source, index, 'invalid Unicode escape');
      return { value: String.fromCodePoint(codePoint), end: close + 1 };
    }
    const digits = source.slice(index + 2, index + 6);
    if (!/^[0-9A-Fa-f]{4}$/.test(digits)) lexicalError(source, index, 'invalid Unicode escape');
    return { value: String.fromCodePoint(Number.parseInt(digits, 16)), end: index + 6 };
  }
  return { value: escaped, end: index + 2 };
}

function readString(source, index) {
  const quote = source[index];
  let value = '';
  let cursor = index + 1;
  while (cursor < source.length) {
    if (source[cursor] === quote) return { value, end: cursor + 1 };
    if (source[cursor] === '\n' || source[cursor] === '\r') lexicalError(source, cursor, 'newline in string literal');
    if (source[cursor] === '\\') {
      const decoded = decodeEscape(source, cursor);
      value += decoded.value;
      cursor = decoded.end;
    } else {
      value += source[cursor];
      cursor += 1;
    }
  }
  lexicalError(source, index, 'unterminated string literal');
}

function skipRegex(source, index) {
  let cursor = index + 1;
  let inClass = false;
  while (cursor < source.length) {
    const character = source[cursor];
    if (character === '\n' || character === '\r') lexicalError(source, cursor, 'unterminated regular expression');
    if (character === '\\') cursor += 2;
    else if (character === '[') { inClass = true; cursor += 1; }
    else if (character === ']' && inClass) { inClass = false; cursor += 1; }
    else if (character === '/' && !inClass) {
      cursor += 1;
      while (isIdentifierPart(source[cursor])) cursor += 1;
      return cursor;
    } else cursor += 1;
  }
  lexicalError(source, index, 'unterminated regular expression');
}

function regexMayStartAfter(token) {
  if (token === undefined) return true;
  if (token.type === 'string' || token.type === 'template' || token.type === 'number') return false;
  if (token.type === 'identifier') {
    return new Set(['await', 'case', 'delete', 'in', 'instanceof', 'new', 'return', 'throw', 'typeof', 'void', 'yield']).has(token.value);
  }
  return ![')', ']', '}', '++', '--', '.'].includes(token.value);
}

function tokenizeEsm(source) {
  const tokens = [];
  const push = (type, value, index) => tokens.push({ type, value, index });

  function scanTemplate(index) {
    let cursor = index + 1;
    let value = '';
    let hasExpression = false;
    while (cursor < source.length) {
      if (source[cursor] === '`') {
        push(hasExpression ? 'template' : 'string', hasExpression ? null : value, index);
        return cursor + 1;
      }
      if (source.startsWith('${', cursor)) {
        hasExpression = true;
        cursor = scanCode(cursor + 2, true);
      } else if (source[cursor] === '\\') {
        const decoded = decodeEscape(source, cursor);
        value += decoded.value;
        cursor = decoded.end;
      } else {
        value += source[cursor];
        cursor += 1;
      }
    }
    lexicalError(source, index, 'unterminated template literal');
  }

  function scanCode(start, stopAtRightBrace = false) {
    let cursor = start;
    let braceDepth = 0;
    while (cursor < source.length) {
      const character = source[cursor];
      if (/\s/.test(character)) { cursor += 1; continue; }
      if (source.startsWith('//', cursor)) {
        const newline = source.indexOf('\n', cursor + 2);
        cursor = newline === -1 ? source.length : newline + 1;
        continue;
      }
      if (source.startsWith('/*', cursor)) {
        const close = source.indexOf('*/', cursor + 2);
        if (close === -1) lexicalError(source, cursor, 'unterminated block comment');
        cursor = close + 2;
        continue;
      }
      if (character === '\'' || character === '"') {
        const literal = readString(source, cursor);
        push('string', literal.value, cursor);
        cursor = literal.end;
        continue;
      }
      if (character === '`') {
        cursor = scanTemplate(cursor);
        continue;
      }
      if (character === '/' && regexMayStartAfter(tokens.at(-1))) {
        const startIndex = cursor;
        cursor = skipRegex(source, cursor);
        push('regex', null, startIndex);
        continue;
      }
      if (isIdentifierStart(character)) {
        const tokenStart = cursor;
        cursor += 1;
        while (isIdentifierPart(source[cursor])) cursor += 1;
        push('identifier', source.slice(tokenStart, cursor), tokenStart);
        continue;
      }
      if (/[0-9]/.test(character)) {
        const tokenStart = cursor;
        cursor += 1;
        while (/[A-Za-z0-9_.]/.test(source[cursor] ?? '')) cursor += 1;
        push('number', source.slice(tokenStart, cursor), tokenStart);
        continue;
      }
      if (character === '{') braceDepth += 1;
      if (character === '}') {
        if (stopAtRightBrace && braceDepth === 0) return cursor + 1;
        braceDepth -= 1;
        if (braceDepth < 0) lexicalError(source, cursor, 'unmatched right brace');
      }
      const pair = source.slice(cursor, cursor + 2);
      if (['=>', '++', '--', '?.', '&&', '||', '??'].includes(pair)) {
        push('punctuator', pair, cursor);
        cursor += 2;
      } else {
        push('punctuator', character, cursor);
        cursor += 1;
      }
    }
    if (stopAtRightBrace) lexicalError(source, start, 'unterminated template expression');
    return cursor;
  }

  scanCode(0);
  return tokens;
}

function sourceAfterFrom(tokens, fromIndex, description) {
  const specifier = tokens[fromIndex + 1];
  if (specifier?.type !== 'string') throw new Error(`${description} source must be a literal`);
  return specifier.value;
}

function dynamicImportSpecifier(tokens, importIndex) {
  const specifier = tokens[importIndex + 2];
  if (specifier?.type !== 'string') throw new Error('Nonliteral dynamic import is forbidden');
  let cursor = importIndex + 3;
  if (tokens[cursor]?.value === ')') return specifier.value;
  if (tokens[cursor]?.value !== ',') throw new Error('Dynamic import first argument must be a complete literal');
  cursor += 1;
  if (tokens[cursor] === undefined || tokens[cursor].value === ')') throw new Error('Dynamic import options argument is missing');
  const closers = [];
  const expectedCloser = { '(': ')', '[': ']', '{': '}' };
  for (; cursor < tokens.length; cursor += 1) {
    const value = tokens[cursor].value;
    if (Object.hasOwn(expectedCloser, value)) {
      closers.push(expectedCloser[value]);
    } else if ([')', ']', '}'].includes(value)) {
      if (closers.length === 0) {
        if (value === ')') return specifier.value;
        throw new Error('Unbalanced dynamic import options');
      }
      if (closers.pop() !== value) throw new Error('Unbalanced dynamic import options');
    } else if (closers.length === 0 && (value === ',' || value === ';')) {
      throw new Error('Dynamic import has invalid options syntax');
    }
  }
  throw new Error('Dynamic import is missing a closing parenthesis');
}

export function importSpecifiers(source) {
  const tokens = tokenizeEsm(source);
  const specifiers = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== 'identifier') continue;
    if (token.value === 'import' && tokens[index - 1]?.value !== '.') {
      const next = tokens[index + 1];
      if (next?.value === '.') continue;
      if (next?.value === '(') {
        specifiers.push(dynamicImportSpecifier(tokens, index));
        continue;
      }
      if (next?.type === 'string') {
        specifiers.push(next.value);
        continue;
      }
      let cursor = index + 1;
      while (cursor < tokens.length && tokens[cursor].value !== ';' && tokens[cursor].value !== 'from') cursor += 1;
      if (tokens[cursor]?.value !== 'from') throw new Error('Unrecognized static import declaration');
      specifiers.push(sourceAfterFrom(tokens, cursor, 'Static import'));
    } else if (token.value === 'export' && tokens[index - 1]?.value !== '.') {
      const next = tokens[index + 1];
      if (next?.value === '*') {
        let cursor = index + 2;
        while (cursor < tokens.length && tokens[cursor].value !== ';' && tokens[cursor].value !== 'from') cursor += 1;
        if (tokens[cursor]?.value !== 'from') throw new Error('Re-export must have a literal source');
        specifiers.push(sourceAfterFrom(tokens, cursor, 'Re-export'));
      } else if (next?.value === '{') {
        let depth = 1;
        let cursor = index + 2;
        while (cursor < tokens.length && depth > 0) {
          if (tokens[cursor].value === '{') depth += 1;
          else if (tokens[cursor].value === '}') depth -= 1;
          cursor += 1;
        }
        if (depth !== 0) throw new Error('Unterminated export list');
        if (tokens[cursor]?.value === 'from') specifiers.push(sourceAfterFrom(tokens, cursor, 'Re-export'));
      }
    }
  }
  return specifiers;
}

function normalizeForDefense(value) {
  return path.normalize(path.resolve(value)).normalize('NFKC').toLowerCase();
}

function isContainedPath(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

async function resolveLongestExistingAncestor(candidate) {
  let current = path.resolve(candidate);
  const suffix = [];
  while (true) {
    try {
      return path.resolve(await realpath(current), ...suffix);
    } catch (error) {
      if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') {
        throw new Error(`Import path resolution failed closed: ${error.message}`, { cause: error });
      }
      const parent = path.dirname(current);
      if (parent === current) return null;
      suffix.unshift(path.basename(current));
      current = parent;
    }
  }
}

async function assertSpecifierOutsideV4(specifier, importer) {
  let decoded;
  try {
    decoded = decodeURIComponent(specifier);
  } catch (error) {
    throw new Error(`Invalid percent encoding in import specifier: ${specifier}`, { cause: error });
  }
  if (decoded.normalize('NFKC').toLowerCase().includes('experiment-v4')) {
    throw new Error(`V5 import references experiment-v4: ${specifier}`);
  }

  const isFileUrl = /^file:/i.test(specifier);
  const isRelative = specifier.startsWith('./') || specifier.startsWith('../');
  const isAbsolute = path.isAbsolute(specifier);
  if (!isFileUrl && !isRelative && !isAbsolute) return;

  let candidate;
  try {
    const url = new URL(specifier, pathToFileURL(importer));
    if (url.protocol !== 'file:') throw new Error(`Unsupported path import URL protocol: ${url.protocol}`);
    candidate = fileURLToPath(url);
  } catch (error) {
    throw new Error(`Invalid file import specifier: ${specifier}`, { cause: error });
  }

  const normalizedRoot = normalizeForDefense(V4_DONOR_ROOT);
  const normalizedCandidate = normalizeForDefense(candidate);
  if (isContainedPath(normalizedRoot, normalizedCandidate)) {
    throw new Error(`V5 import resolves into experiment-v4: ${specifier}`);
  }
  const resolvedCandidate = await resolveLongestExistingAncestor(candidate);
  if (resolvedCandidate !== null && isContainedPath(normalizedRoot, normalizeForDefense(resolvedCandidate))) {
    throw new Error(`V5 import resolves through an alias into experiment-v4: ${specifier}`);
  }
}

export async function assertV5HasNoV4Imports(v5Root = path.resolve(import.meta.dirname, '..')) {
  const resolvedRoot = path.resolve(v5Root);
  const rootReal = await realpath(resolvedRoot);
  for (const target of await listRegularFiles(resolvedRoot)) {
    if (!target.endsWith('.mjs')) continue;
    const source = (await verifiedLeafBytes(resolvedRoot, rootReal, target)).toString('utf8');
    for (const specifier of importSpecifiers(source)) {
      await assertSpecifierOutsideV4(specifier, target);
    }
  }
}

export async function freezeV4DonorInventory(inventoryPath = DEFAULT_INVENTORY_PATH) {
  await assertV5HasNoV4Imports();
  const inventory = await buildDonorInventory();
  if (inventory.files.length !== V4_FILE_COUNT) throw new Error(`V4 donor count mismatch: ${inventory.files.length}`);
  if (inventory.aggregate_sha256 !== V4_AGGREGATE_SHA256) throw new Error('V4 donor aggregate SHA-256 mismatch');
  const methodLock = inventory.files.find((file) => file.path === 'method-lock.json');
  if (!methodLock || methodLock.sha256 !== V4_METHOD_LOCK_SHA256) throw new Error('V4 method-lock SHA-256 mismatch');

  const bytes = Buffer.from(`${JSON.stringify(inventory, null, 2)}\n`);
  await writeImmutable(inventoryPath, bytes);
  return inventory;
}
