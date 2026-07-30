import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmod, lstat, mkdtemp, mkdir, readdir, readFile, realpath, symlink, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import * as immutable from '../lib/immutable.mjs';

const { canonicalJson, sha256, verifyInventory, writeImmutable } = immutable;

const fixture = async () => mkdtemp(path.join(await realpath(tmpdir()), 'v5-immutable-'));

test('canonicalJson recursively sorts object keys and preserves array order', () => {
  assert.equal(canonicalJson({ z: [{ b: 2, a: 1 }], a: ['second', 'first'] }), '{\n  "a": [\n    "second",\n    "first"\n  ],\n  "z": [\n    {\n      "a": 1,\n      "b": 2\n    }\n  ]\n}\n');
});

test('canonicalJson has two-space indentation and exactly one final LF', () => {
  assert.equal(canonicalJson({ a: 1 }), '{\n  "a": 1\n}\n');
});

test('canonicalJson rejects unsupported values', () => {
  for (const value of [undefined, () => {}, Symbol('x'), BigInt(1), Number.NaN, Infinity]) assert.throws(() => canonicalJson({ value }), /unsupported|finite/i);
});

test('writeImmutable creates parent directories as mode-0600 exclusive files', async () => {
  const root = await fixture();
  const target = path.join(root, 'nested', 'lock.json');
  await writeImmutable(target, Buffer.from('locked\n'));
  assert.equal((await lstat(target)).mode & 0o777, 0o600);
  assert.equal(await readFile(target, 'utf8'), 'locked\n');

  const failedDirectory = path.join(root, 'failed');
  const failedTarget = path.join(failedDirectory, 'lock.json');
  await assert.rejects(
    writeImmutable(failedTarget, 'never published', {
      beforePublish() { throw new Error('injected pre-publish failure'); },
    }),
    /injected pre-publish failure/,
  );
  await assert.rejects(lstat(failedTarget), { code: 'ENOENT' });
  assert.deepEqual(await readdir(failedDirectory), []);

  const crashParent = path.join(root, 'crash');
  const crashTarget = path.join(crashParent, 'crash-lock');
  const moduleUrl = new URL('../lib/immutable.mjs', import.meta.url).href;
  const child = spawnSync(process.execPath, ['--input-type=module', '--eval', `import { writeImmutable } from ${JSON.stringify(moduleUrl)}; await writeImmutable(${JSON.stringify(crashTarget)}, 'crash-safe', { beforePublish() { process.exit(86); } });`], { encoding: 'utf8' });
  assert.equal(child.status, 86, child.stderr);
  await assert.rejects(lstat(crashTarget), { code: 'ENOENT' });
  const staging = path.join(crashParent, '.nap-v5-immutable-staging');
  const crashLeftovers = await readdir(staging);
  assert.equal(crashLeftovers.length, 1);
  assert.match(crashLeftovers[0], /^immutable-[1-9]\d*-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/);
  await immutable.recoverImmutableStaging(crashParent);
  await assert.rejects(lstat(staging), { code: 'ENOENT' });
  await writeImmutable(crashTarget, 'crash-safe');
  assert.equal(await readFile(crashTarget, 'utf8'), 'crash-safe');

  await mkdir(staging, { mode: 0o700 });
  await writeFile(path.join(staging, 'not-owned'), 'x', { mode: 0o600 });
  await assert.rejects(immutable.recoverImmutableStaging(crashParent), /unrecognized|owned|filename/i);
  await unlink(path.join(staging, 'not-owned'));
  const wrongUuidVersion = 'immutable-123-00000000-0000-3000-8000-000000000000.tmp';
  await writeFile(path.join(staging, wrongUuidVersion), 'x', { mode: 0o600 });
  await assert.rejects(immutable.recoverImmutableStaging(crashParent), /unrecognized|owned|filename/i);
  await unlink(path.join(staging, wrongUuidVersion));
  const ownedName = 'immutable-123-00000000-0000-4000-8000-000000000000.tmp';
  await symlink('../crash-lock', path.join(staging, ownedName));
  await assert.rejects(immutable.recoverImmutableStaging(crashParent), /symlink/i);
  await unlink(path.join(staging, ownedName));
  await immutable.recoverImmutableStaging(crashParent);
  await assert.rejects(lstat(staging), { code: 'ENOENT' });
});

test('writeImmutable is byte-identical idempotent', async () => {
  const root = await fixture();
  const target = path.join(root, 'lock');
  await writeImmutable(target, 'same');
  await writeImmutable(target, Buffer.from('same'));
  assert.equal(await readFile(target, 'utf8'), 'same');
});

test('writeImmutable fails without overwriting different bytes', async () => {
  const root = await fixture();
  const target = path.join(root, 'lock');
  await writeImmutable(target, 'first');
  await assert.rejects(writeImmutable(target, 'second'), /differs|immutable/i);
  assert.equal(await readFile(target, 'utf8'), 'first');

  const linkedTarget = path.join(root, 'linked-lock');
  await symlink('lock', linkedTarget);
  await assert.rejects(writeImmutable(linkedTarget, 'first'), /symlink/i);

  const realParent = path.join(root, 'real-parent');
  const linkedParent = path.join(root, 'linked-parent');
  await mkdir(realParent);
  await symlink('real-parent', linkedParent);
  await assert.rejects(writeImmutable(path.join(linkedParent, 'nested-lock'), 'bytes'), /symlink/i);
  await assert.rejects(lstat(path.join(realParent, 'nested-lock')), { code: 'ENOENT' });
});

test('sha256 and verifyInventory detect symlinks, missing or extra paths, and byte/hash drift', async () => {
  assert.equal(sha256(Buffer.from('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  const root = await fixture();
  await writeFile(path.join(root, 'a'), 'one');
  const inventory = [{ path: 'a', byte_length: 3, sha256: sha256('one') }];
  const staging = path.join(root, '.nap-v5-immutable-staging');
  await mkdir(staging, { mode: 0o700 });
  await writeFile(path.join(staging, 'immutable-321-00000000-0000-4000-8000-000000000000.tmp'), 'orphan', { mode: 0o600 });
  await assert.doesNotReject(verifyInventory(root, inventory));
  await assert.rejects(lstat(staging), { code: 'ENOENT' });
  await assert.rejects(verifyInventory(root, [...inventory, inventory[0]]), /duplicate/i);
  for (const unsafePath of ['/a', '../a', 'a/../a', './a', 'dir\\a']) {
    await assert.rejects(verifyInventory(root, [{ ...inventory[0], path: unsafePath }]), /path|relative|posix|unsafe/i);
  }
  await assert.rejects(verifyInventory(root, [{ ...inventory[0], byte_length: '3' }]), /byte.length|type|integer/i);
  await assert.rejects(verifyInventory(root, [{ ...inventory[0], sha256: 'nope' }]), /sha-?256|hash/i);
  await writeFile(path.join(root, 'extra'), 'x');
  await assert.rejects(verifyInventory(root, inventory), /extra|path/i);
  const withExtra = [...inventory, { path: 'extra', byte_length: 1, sha256: sha256('x') }];
  await writeFile(path.join(root, 'a'), 'two');
  await assert.rejects(verifyInventory(root, withExtra), /length|sha/i);
  await writeFile(path.join(root, 'a'), 'one');
  await symlink('a', path.join(root, 'linked'));
  await assert.rejects(verifyInventory(root, withExtra), /symlink/i);
  await unlink(path.join(root, 'linked'));
  await chmod(path.join(root, 'a'), 0o600);
  await assert.rejects(verifyInventory(root, [{ ...inventory[0], path: 'missing' }, withExtra[1]]), /missing|path/i);
});
