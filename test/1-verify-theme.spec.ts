import { verifyConditions } from '../lib/verify-conditions.js';
import SemanticReleaseError from '@semantic-release/error';
import { VerifyConditionsContext } from 'semantic-release';

describe('Theme verification', () => {
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

  it('Should throw error on invalid theme', async () => {
    try {
      await verifyConditions(
        {
          type: 'theme',
          slug: 'bad-theme',
          path: './test/fixtures',
        },
        context,
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AggregateError);
      expect(
        ((err as AggregateError).errors[0] as SemanticReleaseError).code,
      ).toBe('ETHEMEFILENOTFOUND');
    }
  });

  it('Should throw error on invalid theme version', async () => {
    try {
      await verifyConditions(
        {
          type: 'theme',
          slug: 'bad-theme-version',
          path: './test/fixtures',
        },
        context,
      );
    } catch (err) {
      expect(
        ((err as AggregateError).errors[0] as SemanticReleaseError).code,
      ).toBe('ETHEMEFILEVERSION');
    }
  });

  it('Should throw error on theme without valid header', async () => {
    try {
      await verifyConditions(
        {
          type: 'theme',
          slug: 'theme-bad-header',
          path: './test/fixtures',
        },
        context,
      );
    } catch (err) {
      expect(
        ((err as AggregateError).errors[0] as SemanticReleaseError).code,
      ).toBe('ETHEMEFILEINVALID');
    }
  });

  it('Should pass validation on valid theme', async () => {
    expect(
      async () =>
        await verifyConditions(
          {
            type: 'theme',
            slug: 'complete-theme',
            path: './test/fixtures',
          },
          context,
        ),
    ).not.toThrow();
  });
});
