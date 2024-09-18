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
    ? path.join(includePath.trimEnd(), '/**')
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
  const include = [
    ...new Set(getFileArray(workDir, '.distinclude') ?? files ?? []),
  ];

  return include.length > 0
    ? include
        .filter((p) => p.includes('*') || fs.existsSync(path.join(workDir, p)))
        .map((p) => remapGlobs(workDir, p))
    : ['**'];
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
      ...(getFileArray(workDir, '.distexclude') ??
        getFileArray(workDir, '.distignore') ??
        files ??
        []),
    ]),
  ]
    .filter(
      (ignorePath) =>
        ignorePath.includes('*') ||
        fs.existsSync(path.join(workDir, ignorePath)),
    )
    .map((ignorePath) => remapGlobs(workDir, ignorePath));
}

export async function copyFiles(
  config: PluginConfig,
  workDir: string,
): Promise<SemanticReleaseError[]> {
  const errors: SemanticReleaseError[] = [];
  const releasePath = path.resolve(config.releasePath, config.slug);

  const files = await glob(getInclude(workDir, config.include), {
    cwd: workDir,
    ignore: getIgnore(workDir, config.exclude),
    nodir: true,
    mark: true,
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
