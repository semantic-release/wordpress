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
import AdmZip, { IZipEntry } from 'adm-zip';

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

function readZip(dir: string, file: string, pfx: RegExp = /.^/): Set<string> {
  return new Set(
    new AdmZip(path.join(dir, file))
      .getEntries()
      .map(({ entryName }) => entryName.replace(pfx, '').replace(/\/$/, ''))
      .filter((e) => e !== '' && (pfx.source == '.^' || !e.match(/\//))),
  );
}

function readDir(
  root: string,
  dir: string,
  recursive: boolean = false,
): Set<string> {
  return new Set(
    fs.readdirSync(path.join(root, dir), {
      recursive,
    }) as string[],
  );
}

function readFile(root: string, file: string): string {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

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
  it('Should zip a complete plugin properly', async () => {
    await prepare(pluginConfig, contexts.publishContext);
    await publish(pluginConfig, contexts.publishContext);

    expect(readFile(path.join(wDir, 'dist-test'), 'readme.txt')).toMatch(
      /^Stable tag: 1.0.0$/gm,
    );
    expect(readZip(wDir, 'package.zip', /^dist-test\//)).toEqual(
      readDir(wDir, 'dist-test'),
    );
    expect(readZip(wDir, 'assets.zip')).toEqual(readDir(wDir, 'assets', true));
    expect(readFile(wDir, 'VERSION')).toEqual('1.0.0');

    // expect readZip(releasePath, 'assets.zip');
  });

  it('Should should remove folders on success', async () => {
    await success(pluginConfig, contexts.publishContext);

    const files = fs.readdirSync(wDir).join(' ');

    expect(files).toContain('package.zip');
    expect(files).toContain('assets.zip');
    expect(files).toContain('VERSION');
    expect(files).not.toContain('dist-test');
    expect(files).not.toContain('assets ');
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
