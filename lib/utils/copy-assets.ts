import * as path from 'node:path';
import fs from 'fs-extra';
import SemanticReleaseError from '@semantic-release/error';
import { PluginConfig } from '../classes/plugin-config.class.js';
import { glob } from 'glob';

export async function copyAssets(
  config: PluginConfig,
  workDir: string,
): Promise<SemanticReleaseError[]> {
  const errors: SemanticReleaseError[] = [];
  const assetPath = path.resolve(path.join(config.releasePath, 'assets'));
  const basePath = path.resolve(path.join(workDir, '.wordpress-org', 'assets'));

  const assets = await glob(
    ['screenshot-*', 'banner-*'].map((g) => `${g}.{jpg,png,gif,jpeg}`),
    {
      cwd: basePath,
    },
  );

  if (assets.length === 0) {
    return errors;
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

  // Copy the theme screenshot.jpg
  if (
    config.type === 'theme' &&
    fs.existsSync(path.join(basePath, 'screenshot.jpg'))
  ) {
    await fs.copy(
      path.resolve(path.join(basePath, 'screenshot.jpg')),
      path.resolve(
        path.join(config.releasePath, config.slug, 'screenshot.jpg'),
      ),
      {
        preserveTimestamps: true,
      },
    );
  }

  return errors;
}
