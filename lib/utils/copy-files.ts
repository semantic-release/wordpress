import * as path from 'node:path';
import fs from 'fs-extra';
import SemanticReleaseError from '@semantic-release/error';
import { PluginConfig } from '../classes/plugin-config.class.js';
import { getFileArray } from './get-file-array.js';
import { glob } from 'glob';
import getError from './get-error.js';

const defaultExcludes = [
  '.git*',
  '.vscode',
  '.wordpress-org',
  '.yarn*',
  '.editorconfig',
  '.eslint*',
  '.npm*',
  '.prettier*',
  '.babelrc*',
  '.browserslistrc*',
  '.releaserc*',
  '.stylelint*',
  '*phpcs*',
  'node_modules',
  'composer.json',
  'composer.lock',
  'LICENSE',
  'package.json',
  'package-lock.json',
];

export async function copyFiles(
  config: PluginConfig,
  workDir: string,
): Promise<SemanticReleaseError[]> {
  const errors: SemanticReleaseError[] = [];
  const include = config.include ?? getFileArray(workDir, '.distinclude');
  const ignore = config.exclude ?? getFileArray(workDir, '.distignore');
  const releasePath = path.resolve(config.releasePath, config.slug);

  if (ignore.length === 0) {
    ignore.push(...defaultExcludes);
  }

  if (include.length === 0) {
    include.push(path.join('**/*'));
  }

  const files = await glob(include, {
    cwd: workDir,
    ignore,
  });

  await fs.mkdir(releasePath, { recursive: true });

  for (const file of files) {
    try {
      fs.cpSync(
        path.resolve(path.join(workDir, file)),
        path.resolve(path.join(releasePath, file)),
        {
          preserveTimestamps: true,
          recursive: true,
        },
      );
    } catch (err) {
      errors.push(getError('EFILECOPY', file));
    }
  }

  return errors;
}
