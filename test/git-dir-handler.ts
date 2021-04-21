/* eslint-disable node/no-unsupported-features/node-builtins */

import * as assert from 'assert';
    assert.strictEqual(gitFileData.path, 'Readme.md');
    assert.strictEqual(gitFileData.fileData.mode, '100644');
    assert.strictEqual(gitFileData.fileData.content, null);
    assert.strictEqual(gitFileDataAdd.fileData.content, 'Text');
    assert.strictEqual(gitFileDataAdd.fileData.mode, '100644');
    assert.strictEqual(gitFileDataAdd.path, 'Readme.md');
    assert.strictEqual(gitFileDataModified.fileData.content, 'new text');
    assert.strictEqual(gitFileDataModified.fileData.mode, '100644');
    assert.strictEqual(gitFileDataModified.path, 'modified/test.txt');
    assert.strictEqual(
      gitFileDataTxtToExecutable.fileData.content,
      '#!/bin/bash'
    );
    assert.strictEqual(gitFileDataTxtToExecutable.fileData.mode, '100755');
    assert.strictEqual(gitFileDataTxtToExecutable.path, 'bin/main/test.exe');
    assert.strictEqual(path.isAbsolute(testingPath), true);
    assert.strictEqual(path.isAbsolute(testingPath), true);
    assert.strictEqual(
      findRepoRoot('home/user/work/subdir'),
      '/home/user/work'
    );
    const error = new Error('Execsync error');
    sandbox.stub(child_process, 'execSync').throws(error);
    assert.throws(() => findRepoRoot('home/user/work/subdir'), error);
    assert.strictEqual(diffs[0], ':000000 100644 0000000 8e6c063 A\tadded.txt');
    assert.strictEqual(
      diffs[1],
      ':100644 000000 8e6c063 0000000 D\tdeleted.txt'
    );
    assert.strictEqual(diffs.length, 2);
    assert.strictEqual(changes.get('added.txt')?.mode, '100644');
    assert.strictEqual(changes.get('added.txt')?.content, 'new text');
    assert.strictEqual(changes.get('deleted.txt')?.mode, '100644');
    assert.strictEqual(changes.get('deleted.txt')?.content, null);
    await assert.rejects(parseChanges(diffs, ''));
    await assert.rejects(parseChanges(diffs, ''));
    const badDiff = [':000000 100644 0000000 8e6c063 Aadded.txt'];
    await assert.rejects(parseChanges(badDiff, ''));