import * as path from 'node:path';

import rif from 'replace-in-file';
import getError from './get-error.js';
import SemanticReleaseError from '@semantic-release/error';

export async function replaceVersions(
  workDir: string,
  files: string[],
  nextVersion: string,
  currentVersion = '0.0.0',
): Promise<SemanticReleaseError[]> {
  const errors: SemanticReleaseError[] = [];
  try {
    const results = await rif.replaceInFile({
      files: files.map((file) => path.join(workDir, file)),
      from: new RegExp(currentVersion, 'g'),
      to: nextVersion,
    });

    results.forEach((result) => {
      if (!result.hasChanged) {
        errors.push(
          getError('EVERSIONNOTUPDATED', path.relative(workDir, result.file)),
        );
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      errors.push(
        getError(
          'EFILEINVALID',
          path.relative(workDir, err.message.split('pattern: ')[1]),
        ),
      );
    }
  }

  return errors;
}
