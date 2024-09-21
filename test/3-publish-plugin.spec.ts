import fs from 'fs-extra';
import * as path from 'node:path';
import { jest } from '@jest/globals';
import { prepare } from '../lib/prepare.js';
import { PluginConfig } from '../lib/classes/plugin-config.class.js';
import * as contexts from './get-context.js';
import { replaceVersions } from '../lib/utils/replace-versions.js';
import { success } from '../lib/success.js';
import SemanticReleaseError from '@semantic-release/error';
import { publish } from '../lib/publish.js';
import { readFile, readDir, readZip } from './utils.js';

const pluginConfig: PluginConfig = {
  type: 'plugin',
  slug: 'dist-test',
  path: './test/fixtures/dist-test',
  withAssets: true,
  withReadme: true,
  include: ['dist-test.php', './*.php', 'vendor'],
  exclude: [],
  withVersionFile: true,
  workDir: 'publish',
};

let wDir: string;
const env = process.env;

beforeAll(async () => {
  wDir = fs.mkdtempSync('/tmp/wp-release-');
  pluginConfig.releasePath = wDir;
});

beforeEach(() => {
  jest.resetModules();
  process.env = { ...env };
});

afterEach(async () => {
  await replaceVersions(
    path.resolve('./test/fixtures/dist-test'),
    ['dist-test.php'],
    '0.0.0',
    '1.0.0',
  );
  await replaceVersions(
    path.resolve('./test/fixtures/dist-test'),
    ['.wordpress-org/readme.txt'],
    '0.0.0',
    '1.0.0',
  );
  await fs.remove('/tmp/workDir-publish-test');
});

afterAll(async () => {
  fs.removeSync(wDir);
});

describe('Publish step', () => {
  it('Should package a complete plugin', async () => {
    await prepare(pluginConfig, contexts.publishContext);
    await publish(pluginConfig, contexts.publishContext);

    expect(readFile(wDir, 'dist-test', 'readme.txt')).toMatch(
      /^Stable tag: 1.0.0$/gm,
    );
    expect(readZip(wDir, 'package.zip', /^dist-test\//)).toEqual(
      readDir(false, wDir, 'dist-test'),
    );
    expect(readZip(wDir, 'assets.zip')).toEqual(readDir(true, wDir, 'assets'));
    expect(readFile(wDir, 'VERSION')).toEqual('1.0.0');
  });

  it('Should should remove folders on success', async () => {
    await success(pluginConfig, contexts.publishContext);

    expect(readDir(false, wDir)).toEqual(
      new Set(['package.zip', 'assets.zip', 'VERSION']),
    );
  });

  it('Should fail when no assets exist', async () => {
    try {
      await prepare(pluginConfig, contexts.publishContext);

      await fs.remove(path.join(wDir, 'assets'));
      await publish(pluginConfig, contexts.publishContext);
    } catch (err) {
      expect((err as SemanticReleaseError).code).toMatch(/(ENOENT|EZIP)/);
    }
  }, 10000);

  it('Should fail on invalid zip command env override', async () => {
    process.env.ZIP_COMMAND = 'zipr';

    try {
      await prepare(pluginConfig, contexts.publishContext);
      await publish(pluginConfig, contexts.publishContext);
    } catch (err) {
      expect((err as SemanticReleaseError).code).toMatch(/(ENOENT|EZIP)/);
    }
  }, 5000);
});
