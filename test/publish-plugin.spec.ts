import fs from 'fs-extra';
import { prepare } from '../lib/prepare.js';
import signale from 'signale';
import { PrepareContext } from 'semantic-release';
import { publish } from '../lib/publish.js';
import { PluginConfig } from '../lib/classes/plugin-config.class.js';

let context: PrepareContext;
beforeEach(() => {
  context = {
    logger: new signale.Signale(),
    commits: [],
    branch: {
      name: 'master',
      channel: '',
      prerelease: false,
      range: '',
    },
    branches: [],
    env: {},
    envCi: {
      isCi: false,
      branch: 'master',
      commit: 'h1',
    },
    releases: [],
    lastRelease: undefined,
    nextRelease: {
      name: 'v1.0.0',
      version: '1.0.0',
      type: 'minor',
      channel: '',
      gitTag: 'v1.0.0',
      gitHead: 'h1',
    },
    stdout: process.stdout,
    stderr: process.stderr,
  };
});

describe('Package a complete plugin', () => {
  const pluginConfig: PluginConfig = {
    type: 'plugin',
    slug: 'dist-test',
    path: './test/fixtures/dist-test',
    copyFiles: true,
    withAssets: true,
    withReadme: true,
    include: ['dist-test.php', './*.php', 'vendor'],
    exclude: [],
    withVersionFile: true,
  };

  afterEach(() => {
    fs.removeSync('/tmp/wp-release');
  });

  it('Should package a complete plugin', async () => {
    await prepare(pluginConfig, context);
    await publish(pluginConfig, context);

    const files = fs.readdirSync('/tmp/wp-release').join(' ');

    expect(files).toContain('package.zip');
    expect(files).toContain('assets.zip');
    expect(files).toContain('VERSION');
  });
});
