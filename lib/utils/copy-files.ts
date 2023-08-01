import * as path from 'node:path';
import fs from 'fs-extra';
import SemanticReleaseError from '@semantic-release/error';
import { PluginConfig } from '../classes/plugin-config.class.js';
import { getFileArray } from './get-file-array.js';
import { glob } from 'glob';
import getError from './get-error.js';
import { DEFAULT_EXCLUDES } from '../constants.js';

function remapGlobs(workDir: string, includePath: string): string {
  const fullPath = path.join(workDir, includePath);

  return !includePath.includes('*') && fs.lstatSync(fullPath).isDirectory()
    ? path.join(includePath, '**/*')
    : includePath;
}

/**
 * Get the glob include array
 *
 *
 * @param workDir Working directory
 * @param files   Array of files to include
 * @returns       Array of globs to include
 */
export function getInclude(workDir: string, files?: string[]): string[] {
  const include = [...new Set(files ?? getFileArray(workDir, '.distinclude'))];

  return include.length !== 0
    ? include.map((includePath) => remapGlobs(workDir, includePath))
    : ['**/*'];
}

/**
 * Get the glob ignore array
 *
 * @param workDir Working directory
 * @param files   Array of existing files to ignore
 * @returns       Array of globs to ignore
 */
export function getIgnore(workDir: string, files?: string[]): string[] {
  return [
    ...new Set([
      ...DEFAULT_EXCLUDES,
      ...(files ?? getFileArray(workDir, '.distignore')),
    ]),
  ];
}

export async function copyFiles(
  config: PluginConfig,
  workDir: string,
): Promise<SemanticReleaseError[]> {
  const errors: SemanticReleaseError[] = [];
  const include = getInclude(workDir, config.include);
  const ignore = getIgnore(workDir, config.exclude);
  const releasePath = path.resolve(config.releasePath, config.slug);

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
