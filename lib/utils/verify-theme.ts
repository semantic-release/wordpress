import * as path from 'node:path';
import fs from 'fs-extra';
import SemanticReleaseError from '@semantic-release/error';
import getError from './get-error.js';
import { PluginConfig } from '../classes/plugin-config.class.js';

export async function verifyTheme(config: PluginConfig): Promise<void> {
  const themePath = config.path
    ? path.resolve(config.path, config.slug)
    : path.resolve('./');
  const errors: SemanticReleaseError[] = [];

  if (
    !(await fs.pathExists(path.resolve(themePath, 'style.css'))) ||
    !(await fs.pathExists(path.resolve(themePath, 'functions.php')))
  ) {
    throw new AggregateError([
      getError('ETHEMEFILENOTFOUND', 'style.css, functions.php'),
    ]);
  }

  try {
    const styleSheet = await fs.readFile(
      path.resolve(themePath, 'style.css'),
      'utf-8',
    );

    if (!styleSheet.includes('Theme Name:')) {
      errors.push(getError('ETHEMEFILEINVALID', 'style.css'));
    }

    const version = styleSheet.match(/Version:\s*(\d+\.\d+\.\d+)/);

    if (version !== null && version[1] !== '0.0.0') {
      errors.push(getError('ETHEMEFILEVERSION', version[1]));
    }
  } catch (err) {
    if (err instanceof Error) {
      errors.push(new SemanticReleaseError(err.message, 'EINVALIDTHEME', ''));
    }

    throw new AggregateError(errors);
  }
}
