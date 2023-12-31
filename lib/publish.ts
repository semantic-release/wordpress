import * as path from 'node:path';
import fs from 'fs-extra';
import { PublishContext } from 'semantic-release';
import { PluginConfig } from './classes/plugin-config.class.js';
import { transformAndValidate } from 'class-transformer-validator';
import { execa } from 'execa';
import getError from './utils/get-error.js';

export async function publish(
  config: PluginConfig,
  context: PublishContext,
): Promise<void> {
  config = await transformAndValidate(PluginConfig, config);

  const releaseDir = path.resolve(config.releasePath);
  const assetDir = path.resolve(releaseDir, 'assets');
  const versionFile = path.resolve(releaseDir, 'VERSION');
  const zipCommand = process.env.ZIP_COMMAND ?? 'zip';

  const packageResult = await execa(
    zipCommand,
    ['-qr', path.join(releaseDir, `package.zip`), config.slug],
    {
      reject: false,
      cwd: config.releasePath,
      timeout: 30 * 1000,
    },
  );

  if (
    ('exitCode' in packageResult && packageResult.exitCode !== 0) ||
    ('code' in packageResult && packageResult.code !== 0)
  ) {
    throw getError('EZIP', packageResult.stderr);
  }

  if (config.withAssets) {
    const zipResult = await execa(
      zipCommand,
      ['-qjr', path.join(releaseDir, `assets.zip`), assetDir],
      {
        reject: false,
        cwd: assetDir,
        timeout: 30 * 1000,
      },
    );
    if (
      ('exitCode' in zipResult && zipResult.exitCode !== 0) ||
      ('code' in zipResult && zipResult.code !== 0)
    ) {
      throw getError('EZIP', zipResult.stderr);
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
