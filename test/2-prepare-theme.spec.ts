import fs from 'fs-extra';
import { prepare } from '../lib/prepare.js';
import signale from 'signale';
import { PrepareContext } from 'semantic-release';
import SemanticReleaseError from '@semantic-release/error';

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

afterEach(async () => {
  fs.rmSync('/tmp/workDir', { recursive: true, force: true });
  fs.rmSync('/tmp/wp-release', { recursive: true, force: true });
});

it('Should fail on a badly versioned theme', async () => {
  try {
    await prepare(
      {
        type: 'theme',
        slug: 'theme-bad-version',
        path: './test/fixtures/theme-bad-version',
        copyFiles: true,
        versionFiles: ['functions.php'],
        include: ['style.css', '*.php'],
        exclude: [],
      },
      context,
    );
  } catch (err) {
    expect(err).toBeInstanceOf(AggregateError);
    expect(
      ((err as AggregateError).errors[0] as SemanticReleaseError).code,
    ).toBe('EVERSIONNOTUPDATED');
  }
});

it('Should fail on a non-existant version file', async () => {
  try {
    await prepare(
      {
        type: 'theme',
        slug: 'theme-bad-version',
        path: './test/fixtures/theme-bad-version',
        copyFiles: true,
        versionFiles: ['functions1.php'],
        exclude: [],
      },
      context,
    );
  } catch (err) {
    expect(err).toBeInstanceOf(AggregateError);
    expect(
      ((err as AggregateError).errors[0] as SemanticReleaseError).code,
    ).toBe('EFILEINVALID');
  }
});

it('Should fully prepare a theme for release', async () => {
  await fs.copy(
    './test/fixtures/complete-theme',
    './test/fixtures/complete-theme-copy',
  );

  await prepare(
    {
      type: 'theme',
      slug: 'complete-theme-copy',
      path: './test/fixtures/complete-theme-copy',
      copyFiles: false,
      withVersionFile: true,
      withAssets: true,
      versionFiles: ['functions.php'],
      include: ['style.css', '*.php', 'vendor'],
      exclude: [],
      workDir: '1',
    },
    context,
  );

  const themeDir = fs.readdirSync('/tmp/wp-release/complete-theme-copy');
  const assets = fs.readdirSync('/tmp/wp-release/assets');
  const versions = fs.readFileSync(
    './test/fixtures/complete-theme-copy/functions.php',
    'utf8',
  );

  expect(themeDir).toHaveLength(4);
  expect(themeDir.sort()).toStrictEqual(
    ['screenshot.jpg', 'style.css', 'vendor', 'functions.php'].sort(),
  );
  expect(assets).toHaveLength(5);
  expect(assets.sort()).toStrictEqual(
    [
      'screenshot.jpg',
      'banner-low.jpg',
      'banner-high.jpg',
      'screenshot-1.jpg',
      'screenshot-2.jpg',
    ].sort(),
  );
  expect(versions).toMatch(/1\.0\.0/);
  expect(versions).toMatch(/3\.2\.111/);

  await fs.rm('./test/fixtures/complete-theme-copy', {
    recursive: true,
    force: true,
  });
});
