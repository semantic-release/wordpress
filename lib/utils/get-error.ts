import SemanticReleaseError from '@semantic-release/error';
import * as Errors from './errors.js';

export default function getError(
  code: string,
  value: any,
): SemanticReleaseError {
  const { message, details } = Errors[code as keyof typeof Errors](value);
  return new SemanticReleaseError(message, code, details);
}
