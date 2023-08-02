import { transformAndValidate } from 'class-transformer-validator';
import { PluginConfig } from '../classes/plugin-config.class.js';
import SemanticReleaseError from '@semantic-release/error';
import { ValidationError } from 'class-validator';
import getError from './get-error.js';

declare type ErrorKeys =
  | 'TYPE'
  | 'WITHASSETS'
  | 'WITHREADME'
  | 'WITHVERSIONFILE'
  | 'PATH'
  | 'COPYFILES'
  | 'RELEASEPATH'
  | 'WORKDIR'
  | 'SLUG'
  | 'VERSIONFILES'
  | 'INCLUDE'
  | 'EXCLUDE';

export default async function verifyConfig(
  pluginConfig: PluginConfig,
): Promise<SemanticReleaseError[]> {
  try {
    await transformAndValidate(PluginConfig, pluginConfig);
    return [];
  } catch (err) {
    if (Array.isArray(err)) {
      return err.map((e: ValidationError) =>
        getError(`EINVALID${e.property.toUpperCase() as ErrorKeys}`, e.value),
      );
    }

    return [
      new SemanticReleaseError(
        (err as Error).message,
        'EINVALIDCONFIG',
        'Unknown Error occured during config validation',
      ),
    ];
  }
}
