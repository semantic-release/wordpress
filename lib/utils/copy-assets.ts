import * as path from 'node:path';
import fs from 'fs-extra';
import { PluginConfig } from '../classes/plugin-config.class.js';
import { glob } from 'glob';

export async function copyAssets(
  config: PluginConfig,
  workDir: string,
): Promise<void> {
  const assetPath = path.resolve(path.join(config.releasePath, 'assets'));
  const basePath = path.resolve(path.join(workDir, '.wordpress-org', 'assets'));

  const assets = await glob(
    ['screenshot*', 'banner-*'].map((g) => `${g}.{jpg,png,gif,jpeg}`),
    {
      cwd: basePath,
    },
  );

  if (assets.length === 0) {
    return;
  }

  await fs.mkdir(assetPath, { recursive: true });

  for (const asset of assets) {
    await fs.copy(
      path.resolve(path.join(basePath, asset)),
      path.resolve(path.join(assetPath, asset)),
      {
        preserveTimestamps: true,
      },
    );
  }

  const screenshots = await glob('screenshot.*', { cwd: basePath });

  if (config.type !== 'theme' || screenshots.length === 0) {
    return;
  }

  await fs.copy(
    path.resolve(path.join(basePath, screenshots[0])),
    path.resolve(path.join(config.releasePath, config.slug, screenshots[0])),
    { preserveTimestamps: true },
  );
}
