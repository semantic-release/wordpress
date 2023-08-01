import * as path from 'node:path';
import fs from 'fs-extra';
import AggregateError from 'aggregate-error';
import SemanticReleaseError from '@semantic-release/error';
import getError from './get-error.js';
import { PluginConfig } from '../classes/plugin-config.class.js';

export async function verifyPlugin(config: PluginConfig): Promise<void> {
  const pluginPath = config.path
    ? path.resolve(config.path, config.slug)
    : path.resolve('./');
  const errors: SemanticReleaseError[] = [];
  let pluginFileExists = true;

  if (!(await fs.pathExists(path.resolve(pluginPath, `${config.slug}.php`)))) {
    pluginFileExists = false;
    errors.push(getError('EPLUGINFILENOTFOUND', `${config.slug}`));
  }

  if (pluginFileExists) {
    try {
      const pluginFile = await fs.readFile(
        path.resolve(pluginPath, `${config.slug}.php`),
        'utf-8',
      );

      if (!pluginFile.includes('Plugin Name:')) {
        errors.push(getError('EPLUGINFILEINVALID', `${config.slug}`));
      }

      const version = pluginFile.match(/Version:\s*(\d+\.\d+\.\d+)/);

      if (version !== null && version[1] !== '0.0.0') {
        errors.push(getError('EPLUGINFILEVERSION', version[1]));
      }
    } catch (err) {
      if (err instanceof Error) {
        errors.push(
          new SemanticReleaseError(err.message, 'EINVALIDPLUGIN', ''),
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}
