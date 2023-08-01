import { glob } from 'glob';
import { DEFAULT_EXCLUDES } from '../lib/constants.js';
import { getIgnore, getInclude } from '../lib/utils/copy-files.js';
import { getFileArray } from '../lib/utils/get-file-array.js';
import * as path from 'node:path';

describe('Corner cases affecting releases', () => {
  it('Should fail to read non-existant file', () => {
    try {
      const files = getFileArray('/test', 'non-existant-file.txt');
      expect(files).toEqual([]);
    } catch (err) {}
  });

  it('Should properly create the ignore file array', () => {
    const files = getIgnore('/test/fixtures');

    expect(files.sort()).toEqual(DEFAULT_EXCLUDES.sort());
  });

  it('Should glob properly', async () => {
    const workDir = path.resolve('./test/fixtures/dist-test');
    const include1 = getInclude(workDir, [
      'dist-test.php',
      'test1.php',
      'vendor/**/*',
    ]);
    const ignore1 = DEFAULT_EXCLUDES;
    const include2 = getInclude(workDir);
    const ignore2 = getIgnore(workDir);
    const expected = [
      'dist-test.php',
      'test1.php',
      'vendor/composer.php',
    ].sort();

    expect(
      (await glob(include1, { cwd: workDir, ignore: ignore1 })).sort(),
    ).toEqual(expected);
    expect(
      (await glob(include2, { cwd: workDir, ignore: ignore2 })).sort(),
    ).toEqual(['dist-test.php']);
  });
});
