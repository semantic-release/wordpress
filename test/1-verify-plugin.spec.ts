import { verifyConditions } from '../lib/verify-conditions.js';
import SemanticReleaseError from '@semantic-release/error';
import { VerifyConditionsContext } from 'semantic-release';

describe('Plugin verification', () => {
  let context: VerifyConditionsContext;

  beforeEach(() => {
    context = {
      env: {},
      envCi: {
        isCi: false,
        branch: 'master',
        commit: 'h1',
      },
      stdout: process.stdout,
      stderr: process.stderr,
    } as unknown as VerifyConditionsContext;
  });

  it('Should throw error on incomplete config', async () => {
    try {
      await verifyConditions(
        {
          type: 'kurcina',
          slug: '',
        },
        context,
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AggregateError);
    }
  });

  it('Should throw error on invalid plugin', async () => {
    try {
      await verifyConditions(
        {
          type: 'plugin',
          slug: 'bad-plugin',
          path: './test/fixtures',
        },
        context,
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AggregateError);
      expect(
        ((err as AggregateError).errors[0] as SemanticReleaseError).code,
      ).toBe('EINVALIDPLUGIN');
    }
  });

  it('Should throw error on invalid plugin version', async () => {
    try {
      await verifyConditions(
        {
          type: 'plugin',
          slug: 'bad-version',
          path: './test/fixtures',
        },
        context,
      );
    } catch (err) {
      expect(
        ((err as AggregateError).errors[0] as SemanticReleaseError).code,
      ).toBe('EPLUGINFILEVERSION');
    }
  });

  it('Should throw error on plugin without valid header', async () => {
    try {
      await verifyConditions(
        {
          type: 'plugin',
          slug: 'other-bad-plugin',
          path: './test/fixtures',
        },
        context,
      );
    } catch (err) {
      expect(
        ((err as AggregateError).errors[0] as SemanticReleaseError).code,
      ).toBe('EPLUGINFILEINVALID');
    }
  });

  it('Should pass validation on valid plugin', async () => {
    expect(
      async () =>
        await verifyConditions(
          {
            type: 'plugin',
            slug: 'plugin1',
            path: './test/fixtures',
          },
          context,
        ),
    ).not.toThrow();
  });
});
