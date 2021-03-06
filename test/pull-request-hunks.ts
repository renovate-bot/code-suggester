// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-disable node/no-unsupported-features/node-builtins */

import * as assert from 'assert';
import {describe, it, before, afterEach} from 'mocha';
import {setup} from './util';
import * as sinon from 'sinon';
import {Octokit} from '@octokit/rest';
import {GetResponseTypeFromEndpointMethod} from '@octokit/types';
import {getPullRequestHunks} from '../src/github/review-pull-request';

const octokit = new Octokit();
type ListFilesResponse = GetResponseTypeFromEndpointMethod<
  typeof octokit.pulls.listFiles
>;

before(() => {
  setup();
});

describe('getPullRequestHunks', () => {
  const upstream = {owner: 'upstream-owner', repo: 'upstream-repo'};
  const pullNumber = 10;
  const pageSize = 80;
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  it('Returns the correct values when octokit and patch text parsing function execute properly', async () => {
    // setup
    const patch = `@@ -1,2 +1,5 @@
 Hello world
-!
+Goodbye World
+gOodBYE world
+
+Goodbye World`;
    const listFilesOfPRResult: ListFilesResponse = {
      headers: {},
      status: 200,
      url: 'http://fake-url.com',
      data: [
        {
          sha: 'a1d470fa4d7b04450715e3e02d240a34517cd988',
          filename: 'Readme.md',
          status: 'modified',
          additions: 4,
          deletions: 1,
          changes: 5,
          blob_url:
            'https://github.com/TomKristie/HelloWorld/blob/eb53f3871f56e8dd6321e44621fe6ac2da1bc120/Readme.md',
          raw_url:
            'https://github.com/TomKristie/HelloWorld/raw/eb53f3871f56e8dd6321e44621fe6ac2da1bc120/Readme.md',
          contents_url:
            'https://api.github.com/repos/TomKristie/HelloWorld/contents/Readme.md?ref=eb53f3871f56e8dd6321e44621fe6ac2da1bc120',
          patch: patch,
        },
      ],
    };
    const stub = sandbox
      .stub(octokit.pulls, 'listFiles')
      .resolves(listFilesOfPRResult);

    // tests
    const pullRequestHunks = await getPullRequestHunks(
      octokit,
      upstream,
      pullNumber,
      pageSize
    );
    sandbox.assert.calledOnceWithExactly(stub, {
      owner: upstream.owner,
      repo: upstream.repo,
      pull_number: pullNumber,
      per_page: pageSize,
    });
    const hunks = pullRequestHunks.get('Readme.md');
    assert.notStrictEqual(hunks, null);
    assert.strictEqual(hunks!.length, 1);
    assert.strictEqual(hunks![0].newStart, 2);
    assert.strictEqual(hunks![0].newEnd, 5);
  });

  it('Passes up the error when a sub-method fails', async () => {
    // setup
    const error = new Error('Test error for list files');
    sandbox.stub(octokit.pulls, 'listFiles').rejects(error);

    // tests
    await assert.rejects(
      getPullRequestHunks(octokit, upstream, pullNumber, pageSize),
      error
    );
  });
});
