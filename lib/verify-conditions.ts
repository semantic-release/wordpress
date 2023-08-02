import { PluginConfig } from './classes/plugin-config.class.js';
import verifyConfig from './utils/verify-config.js';
import AggregateError from 'aggregate-error';
import { verifyPlugin } from './utils/verify-plugin.js';
import { VerifyConditionsContext } from 'semantic-release';
import getError from './utils/get-error.js';
import { verifyTheme } from './utils/verify-theme.js';

export async function verifyConditions(
  pluginConfig: PluginConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: VerifyConditionsContext,
): Promise<void> {
  const errors = await verifyConfig(pluginConfig);

  try {
    switch (pluginConfig.type) {
      case 'theme':
        await verifyTheme(pluginConfig);
        break;
      case 'plugin':
        await verifyPlugin(pluginConfig);
        break;
      default:
        errors.push(getError('EINVALIDTYPE', pluginConfig.type));
        break;
    }
  } catch (err) {
    if (err instanceof AggregateError) {
      errors.push(...err.errors);
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}
