import { SuccessContext } from 'semantic-release';
import * as path from 'node:path';
import fs from 'fs-extra';
import { PluginConfig } from './classes/plugin-config.class.js';

export async function success(
  config: PluginConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: SuccessContext,
): Promise<void> {
  await fs.remove(path.join(config.releasePath, config.slug));
  await fs.remove(path.join(config.releasePath, 'assets'));
}
