import * as os from 'node:os';
import * as path from 'node:path';
import fs from 'fs-extra';
import 'reflect-metadata';
import SemanticReleaseError from '@semantic-release/error';
import { transformAndValidate } from 'class-transformer-validator';
import { PluginConfig } from './classes/plugin-config.class.js';
import { PrepareContext } from 'semantic-release';
import { replaceVersions } from './utils/replace-versions.js';
import { copyFiles } from './utils/copy-files.js';
import { copyAssets } from './utils/copy-assets.js';

function getReadmePath(workDir: string): string | undefined {
  return ['.wordpress-org/readme.txt', 'readme.txt'].reduce(
    (acc, p) => (fs.existsSync(path.join(workDir, p)) ? p : acc),
    undefined,
  );
}

export async function prepare(
  config: PluginConfig,
  context: PrepareContext,
): Promise<void> {
  config = await transformAndValidate(PluginConfig, config);

  const errors: SemanticReleaseError[] = [];
  const files =
    config.type === 'plugin'
      ? [`${config.slug}.php`, ...config.versionFiles]
      : ['style.css', ...config.versionFiles];
  const workDir = config.copyFiles
    ? path.join(
        path.join(os.tmpdir(), `workDir-${config.workDir}`, config.slug),
      )
    : path.resolve(config.path);

  if (config.copyFiles) {
    await fs.mkdir(workDir, { recursive: true });
    await fs.copy(path.resolve(config.path), workDir);
  }

  const readmePath = config.withReadme ? getReadmePath(workDir) : undefined;

  readmePath && files.push(readmePath);

  errors.push(
    ...(await replaceVersions(workDir, files, context.nextRelease.version)),
  );

  if (errors.length) {
    throw new AggregateError(errors);
  }

  errors.push(...(await copyFiles(config, workDir, readmePath)));

  if (errors.length) {
    throw new AggregateError(errors);
  }

  if (!config.withAssets) {
    return;
  }

  await copyAssets(config, workDir);

  if (errors.length) {
    throw new AggregateError(errors);
  }
}
