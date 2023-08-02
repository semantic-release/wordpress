import { glob } from 'glob';
import { DEFAULT_EXCLUDES } from '../lib/constants.js';
import { getIgnore, getInclude } from '../lib/utils/copy-files.js';
import { getFileArray } from '../lib/utils/get-file-array.js';
import * as path from 'node:path';
import verifyConfig from '../lib/utils/verify-config.js';
import { PluginConfig } from '../lib/classes/plugin-config.class.js';

describe('Corner cases affecting releases', () => {
  it('Should fail to read non-existant file', () => {
    try {
      const files = getFileArray('/test', 'non-existant-file.txt');
      expect(files).toEqual([]);
    } catch (err) {}
  });

  it('Should throw shit-ton of errors on invalid config', async () => {
    const errors = await verifyConfig({
      type: 'kurcina',
      withAssets: '1',
      withReadme: '11',
      withVersionFile: '111',
      path: true,
      copyFiles: 'lalala',
      releasePath: true,
      workDir: 1,
      slug: true,
      versionFiles: 1,
      include: 1,
      exclude: 1,
    } as unknown as PluginConfig);

    expect(errors.length).toBe(12);
  });

  it('Should properly create the ignore file array', () => {
    const files = getIgnore('./test/fixtures/dist-test');

    expect(files.sort()).toEqual(
      [
        '*.log',
        '*.phpc',
        '*.swo',
        '*.swp',
        '*phpcs*',
        '.babelrc',
        '.babelrc*',
        '.browserslistrc',
        '.browserslistrc*',
        '.codeclimate.yml',
        '.distignore',
        '.editorconfig',
        '.env*',
        '.eslint*',
        '.eslintrc.js',
        '.git*',
        '.gitignore',
        '.npm*',
        '.prettier*',
        '.prettierrc',
        '.releaserc',
        '.releaserc*',
        '.stylelint*',
        '.stylelintrc.js',
        '.sublime-*',
        '.wordpress-org/**',
        '.yarn*',
        '.yarnrc.yml',
        'lerna-debug.log*',
        'node_modules/**',
        'npm-debug.log*',
        'package-debug.log*',
        'package-lock.json',
        'package.json',
        'phpcs.xml',
        'pnpm-debug.log*',
        'yarn-debug.log*',
      ].sort(),
    );
  });

  it('Should glob properly', async () => {
    const workDir = path.resolve('./test/fixtures/dist-test');
    const include1 = getInclude(workDir, [
      'dist-test.php',
      'test1.php',
      'vendor',
    ]);
    const ignore1 = DEFAULT_EXCLUDES;
    const include2 = getInclude(workDir);
    const ignore2 = getIgnore(workDir);
    const expected = ['dist-test.php', 'test1.php', 'vendor'].sort();

    expect(include1.sort()).toEqual(['dist-test.php', 'test1.php', 'vendor']);
    expect(
      (
        await glob(include1, { cwd: workDir, ignore: ignore1, maxDepth: 1 })
      ).sort(),
    ).toEqual(expected);
    expect(
      (await glob(include2, { cwd: workDir, ignore: ignore2 })).sort(),
    ).toEqual(['dist-test.php']);
  });
});
