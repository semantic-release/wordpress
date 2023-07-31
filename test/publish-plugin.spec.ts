import fs from 'fs-extra';
import { prepare } from '../lib/prepare.js';
import { publish } from '../lib/publish.js';
import { PluginConfig } from '../lib/classes/plugin-config.class.js';
import * as contexts from './get-context.js';

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
  let releasePath: string;

  beforeEach(() => {
    releasePath = fs.mkdtempSync('/tmp/wp-release-');
    pluginConfig.releasePath = releasePath;
  });

  afterEach(() => {
    fs.removeSync(releasePath);
  });

  it('Should package a complete plugin', async () => {
    await prepare(pluginConfig, contexts.publishContext);
    await publish(pluginConfig, contexts.publishContext);

    const files = fs.readdirSync(releasePath).join(' ');

    expect(files).toContain('package.zip');
    expect(files).toContain('assets.zip');
    expect(files).toContain('VERSION');
  });
});
