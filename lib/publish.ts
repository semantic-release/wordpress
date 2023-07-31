import * as path from 'node:path';
import fs from 'fs-extra';
import { PublishContext } from 'semantic-release';
import { PluginConfig } from './classes/plugin-config.class.js';
import { transformAndValidate } from 'class-transformer-validator';
import execa from 'execa';
import getError from './utils/get-error.js';

export async function publish(
  config: PluginConfig,
  context: PublishContext,
): Promise<void> {
  config = await transformAndValidate(PluginConfig, config);

  const releaseDir = path.resolve(config.releasePath);
  const assetDir = path.resolve(releaseDir, 'assets');
  const versionFile = path.resolve(releaseDir, 'VERSION');

  const packageResult = await execa(
    'zip',
    ['-qr', path.join(releaseDir, `package.zip`), config.slug],
    {
      cwd: config.releasePath,
    },
  );

  if (packageResult.exitCode !== 0) {
    throw getError('EZIP', 'Error creating the zip file');
  }

  if (config.withAssets) {
    const zipResult = await execa(
      'zip',
      ['-qjr', path.join(releaseDir, `assets.zip`), assetDir],
      {
        cwd: assetDir,
      },
    );

    if (zipResult.exitCode !== 0) {
      throw getError('EZIP', 'Error creating the zip file');
    }
  }

  if (config.withVersionFile) {
    try {
      await fs.writeFile(versionFile, context.nextRelease.version);
    } catch (err) {
      throw getError('EFILECOPY', 'VERSION');
    }
  }
}
