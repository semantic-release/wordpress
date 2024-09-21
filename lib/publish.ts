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

  try {
    const packageResult = await execa(
      zipCommand,
      ['-qr', path.join(releaseDir, `package.zip`), config.slug],
      {
        cwd: config.releasePath,
        timeout: 30 * 1000,
      },
    );

    const zipResult = config.withAssets
      ? await execa(
          zipCommand,
          ['-qjr', path.join(releaseDir, `assets.zip`), assetDir],
          {
            cwd: assetDir,
            timeout: 30 * 1000,
          },
        )
      : { exitCode: 0, stderr: '' };

    if (packageResult.exitCode !== 0 || zipResult.exitCode !== 0) {
      throw getError('EZIP', packageResult.stderr || zipResult.stderr);
    }
  } catch (err) {
    throw getError(err.code ?? 'EZIP', err.message);
  }

  if (config.withVersionFile) {
    try {
      await fs.writeFile(versionFile, context.nextRelease.version);
    } catch (err) {
      throw getError('EFILECOPY', 'VERSION');
    }
  }
}
