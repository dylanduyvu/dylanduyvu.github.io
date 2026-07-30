import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { lstat, mkdtemp, mkdir, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

import {
  assertV5HasNoV4Imports,
  buildDonorInventory,
  freezeV4DonorInventory,
  validateDonorInventory,
} from '../lib/donor-guard.mjs';

async function fixture() {
  return mkdtemp(path.join(await realpath(tmpdir()), 'donor-guard-'));
}

const execFileAsync = promisify(execFile);
const V4_ROOT = '/Users/dylanvu/notes/screenpipe-datasets/blog-work-20260727/experiment-v4';

test('discovers recursive regular files sorted by relative POSIX path', async () => {
  const root = await fixture();
  await mkdir(path.join(root, 'z'), { recursive: true });
  await mkdir(path.join(root, 'a', 'nested'), { recursive: true });
  await writeFile(path.join(root, 'z', 'last.txt'), 'z');
  await writeFile(path.join(root, 'a', 'nested', 'first.txt'), 'a');

  const inventory = await buildDonorInventory(root);
  assert.deepEqual(inventory.files.map((file) => file.path), [
    'a/nested/first.txt',
    'z/last.txt',
  ]);
});

test('rejects symlinks anywhere in the donor tree', async () => {
  const root = await fixture();
  await writeFile(path.join(root, 'real.txt'), 'real');
  await symlink('real.txt', path.join(root, 'linked.txt'));

  await assert.rejects(buildDonorInventory(root), /symlink/i);
});

test('rejects special entries anywhere in the donor tree', async () => {
  const root = await fixture();
  await execFileAsync('mkfifo', [path.join(root, 'fifo')]);

  await assert.rejects(buildDonorInventory(root), /special|regular file/i);
});

test('rejects byte-length and SHA-256 drift from an inventory', async () => {
  const root = await fixture();
  await writeFile(path.join(root, 'method-lock.md'), 'original');
  const inventory = await buildDonorInventory(root);
  await writeFile(path.join(root, 'method-lock.md'), 'changed');

  await assert.rejects(validateDonorInventory(root, inventory), /byte length|sha-256|sha256/i);

  const valid = await buildDonorInventory(root);
  const invalidInventories = [
    ['extra inventory key', { ...valid, extra: true }],
    ['wrong version', { ...valid, version: 2 }],
    ['wrong root', { ...valid, root: `${root}-other` }],
    ['non-array files', { ...valid, files: {} }],
    ['invalid aggregate', { ...valid, aggregate_sha256: 'nope' }],
    ['unsafe path', { ...valid, files: [{ ...valid.files[0], path: '../method-lock.md' }] }],
    ['duplicate path', { ...valid, files: [valid.files[0], { ...valid.files[0] }] }],
    ['invalid byte length', { ...valid, files: [{ ...valid.files[0], byte_length: '7' }] }],
    ['invalid file hash', { ...valid, files: [{ ...valid.files[0], sha256: 'nope' }] }],
    ['extra file key', { ...valid, files: [{ ...valid.files[0], extra: true }] }],
  ];
  const accepted = [];
  for (const [name, candidate] of invalidInventories) {
    try {
      await validateDonorInventory(root, candidate);
      accepted.push(name);
    } catch {}
  }
  assert.deepEqual(accepted, []);
});

test('matches the frozen 21-file V4 donor baseline', async () => {
  const root = V4_ROOT;
  const inventory = await buildDonorInventory(root);

  assert.equal(inventory.version, 1);
  assert.equal(inventory.root, root);
  assert.equal(inventory.files.length, 21);
  assert.equal(inventory.aggregate_sha256, '307f06ad992e20aa51d464a4b04e2145eab6f950f26fcb2edbe289319871d0bc');
  assert.ok(inventory.files.some((file) => file.sha256 === '55720d02a696ccfbcfa0fdec1b17f34e9b2c69280151623d6e265b29a905a8fa'));

  const outputRoot = await fixture();
  const output = path.join(outputRoot, 'nested', 'inventory.json');
  await freezeV4DonorInventory(output);
  const firstBytes = await readFile(output);
  const firstStat = await lstat(output, { bigint: true });
  await freezeV4DonorInventory(output);
  const secondBytes = await readFile(output);
  const secondStat = await lstat(output, { bigint: true });
  assert.ok(firstBytes.equals(secondBytes));
  assert.equal(firstStat.mode & 0o777n, 0o600n);
  assert.equal(secondStat.mode & 0o777n, 0o600n);
  assert.equal(secondStat.mtimeNs, firstStat.mtimeNs);

  const linkedOutput = path.join(outputRoot, 'linked-inventory.json');
  await symlink(output, linkedOutput);
  await assert.rejects(freezeV4DonorInventory(linkedOutput), /symlink/i);
});

test('rejects static and dynamic V5 imports that reference experiment-v4', async () => {
  const root = await fixture();
  const candidate = path.join(root, 'candidate.mjs');
  const externalRoot = await fixture();
  const externalAlias = path.join(externalRoot, 'donor-alias');
  await symlink(V4_ROOT, externalAlias);
  const relativeV4 = path.relative(root, path.join(V4_ROOT, 'run-v4.mjs')).split(path.sep).join('/');
  const relativeAlias = path.relative(root, path.join(externalAlias, 'run-v4.mjs')).split(path.sep).join('/');
  const absoluteV4Url = pathToFileURL(path.join(V4_ROOT, 'run-v4.mjs')).href;
  const positives = [
    ['static import', "import thing from '../experiment-v4/x.mjs';\n"],
    ['quoted dynamic import', "await import('../experiment-v4/x.mjs');\n"],
    ['template dynamic import', "await import(`../experiment-v4/x.mjs`);\n"],
    ['comment-separated dynamic import', "await import /*comment*/ ('../experiment-v4/x.mjs');\n"],
    ['dynamic import in template expression', "const value = `result: ${await import('../experiment-v4/x.mjs')}`;\n"],
    ['re-export source', "export { x } from '../experiment-v4/x.mjs';\n"],
    ['static import after semicolon comment', "import { x } /* ; */ from '../experiment-v4/x.mjs';\n"],
    ['escaped specifier', "await import('../experiment-v\\x34/x.mjs');\n"],
    ['nonliteral dynamic import', "await import(moduleName);\n"],
    ['concatenated string first argument', "await import('../experiment-' + 'v4/x.mjs');\n"],
    ['string-plus-template first argument', "await import('../experiment-' + `v4/x.mjs`);\n"],
    ['percent-encoded relative hyphen', `await import('${relativeV4.replace('experiment-v4', 'experiment%2Dv4')}');\n`],
    ['percent-encoded relative digit', `await import('${relativeV4.replace('experiment-v4', 'experiment-v%34')}');\n`],
    ['percent-encoded file URL hyphen', `await import('${absoluteV4Url.replace('experiment-v4', 'experiment%2Dv4')}');\n`],
    ['percent-encoded file URL digit', `await import('${absoluteV4Url.replace('experiment-v4', 'experiment-v%34')}');\n`],
    ['external symlink alias into V4', `await import('${relativeAlias}');\n`],
    ['invalid percent escape', "await import('../experiment-v%ZZ/x.mjs');\n"],
    ['invalid file URL', "await import('file://%ZZ/x.mjs');\n"],
  ];
  const missed = [];
  for (const [name, source] of positives) {
    await writeFile(candidate, source);
    try {
      await assertV5HasNoV4Imports(root);
      missed.push(name);
    } catch {}
  }
  assert.deepEqual(missed, []);

  const negatives = [
    "// import('../experiment-v4/x.mjs')\n/* export { x } from '../experiment-v4/x.mjs' */\n",
    "const note = \"import('../experiment-v4/x.mjs')\";\n",
    "const note = `import('../experiment-v4/x.mjs')`;\n",
    "const pattern = /import\\(['\"]?\\.\\.\\/experiment-v4/;\n",
    "await import('../v4/x.mjs', { with: { type: 'json' } });\n",
  ];
  for (const source of negatives) {
    await writeFile(candidate, source);
    await assert.doesNotReject(assertV5HasNoV4Imports(root));
  }
});
