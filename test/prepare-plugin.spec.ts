import fs from 'fs-extra';
import { prepare } from '../lib/prepare.js';
import signale from 'signale';
import { PrepareContext } from 'semantic-release';

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

afterEach(() => {
  fs.rmSync('/tmp/workDir', { recursive: true, force: true });
  fs.rmSync('/tmp/wp-release', { recursive: true, force: true });
});

it('Should change the plugin version', async () => {
  await prepare(
    {
      type: 'plugin',
      slug: 'plugin1',
      path: './test/fixtures/plugin1',
      copyFiles: true,
    },
    context,
  );
});

it('Should fail on invalid plugin version', async () => {
  try {
    await prepare(
      {
        type: 'plugin',
        slug: 'bad-version',
        path: './test/fixtures/bad-version',
        copyFiles: true,
      },
      context,
    );
  } catch (err) {
    expect(err).toBeInstanceOf(AggregateError);
  }
});

it('Should change only the 0.0.0 version', async () => {
  await prepare(
    {
      type: 'plugin',
      slug: 'plugin1',
      path: './test/fixtures/plugin1',
      copyFiles: true,
      versionFiles: ['extra-versions.php'],
    },
    context,
  );

  const versions = fs.readFileSync(
    '/tmp/workDir/plugin1/extra-versions.php',
    'utf8',
  );

  expect(versions).toMatch(/1\.0\.0/);
  expect(versions).toMatch(/2\.2\.2/);
});

it('Should change the readme.txt version', async () => {
  await prepare(
    {
      type: 'plugin',
      slug: 'plugin-with-readme',
      path: './test/fixtures/plugin-with-readme',
      copyFiles: true,
      withReadme: true,
    },
    context,
  );

  const readme = fs.readFileSync(
    '/tmp/workDir/plugin-with-readme/.wordpress-org/readme.txt',
    'utf8',
  );

  expect(readme).toMatch(/Stable tag: 1\.0\.0/);
});

it('Should work with empty assets', async () => {
  await prepare(
    {
      type: 'plugin',
      slug: 'plugin-with-readme',
      path: './test/fixtures/plugin-with-readme',
      copyFiles: true,
      withAssets: true,
      withReadme: true,
    },
    context,
  );
});

it('Should respect the include/exclude files', async () => {
  await prepare(
    {
      type: 'plugin',
      slug: 'dist-test',
      path: './test/fixtures/dist-test',
      copyFiles: true,
      include: ['dist-test.php', './*.php', 'vendor'],
      exclude: [],
      withVersionFile: false,
    },
    context,
  );

  const distFiles = fs.readdirSync('/tmp/wp-release/dist-test');
  const vendorFiles = fs.readdirSync('/tmp/wp-release/dist-test/vendor');
  const versionExists = fs.existsSync('/tmp/wp-release/VERSION');

  expect(distFiles).toHaveLength(3);
  expect(distFiles).toStrictEqual(['dist-test.php', 'test1.php', 'vendor']);
  expect(vendorFiles).toHaveLength(1);
  expect(vendorFiles).toStrictEqual(['composer.php']);
  expect(versionExists).toBe(false);
});

it('Should copy the assets files', async () => {
  await prepare(
    {
      type: 'plugin',
      slug: 'dist-test',
      path: './test/fixtures/dist-test',
      copyFiles: true,
      withVersionFile: true,
      withAssets: true,
      include: ['dist-test.php', './*.php', 'vendor'],
      exclude: [],
    },
    context,
  );

  const assets = fs.readdirSync('/tmp/wp-release/assets');

  expect(assets).toHaveLength(4);
  expect(assets.sort()).toStrictEqual(
    [
      'banner-low.jpg',
      'banner-high.jpg',
      'screenshot-1.jpg',
      'screenshot-2.jpg',
    ].sort(),
  );
});
