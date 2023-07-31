import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPackageSync } from 'read-pkg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = readPackageSync({ cwd: resolve(__dirname, '../../') });
const [homepage] = pkg?.homepage?.split('#') ?? [''];
const linkify = (file: string) => `${homepage}/blob/master/${file}`;

export function EINVALIDSLUG(slug: string) {
  return {
    message: `Invalid slug: ${slug}`,
    details: `The [slug option](${linkify(
      'README.md#slug',
    )}) must be a non-empty string.

Your Configuration is: ${slug}.`,
  };
}

export function EINVALIDTYPE(type: string) {
  return {
    message: `Invalid type: ${type}`,
    details: `The [type option](${linkify(
      'README.md#type',
    )}) must be either \`theme\` or \`plugin\`.

Your Configuration is: ${type}.`,
  };
}

export function EPLUGINFILENOTFOUND(slug: string) {
  return {
    message: `Plugin file not found: ${slug}.php`,
    details: `The [slug option](${linkify(
      'README.md#slug',
    )}) must be a valid plugin slug.

Your Configuration is: ${slug}.`,
  };
}

export function EPLUGINFILEINVALID(slug: string) {
  return {
    message: `Plugin file is invalid: ${slug}.php`,
    details: `The [slug option](${linkify(
      'README.md#slug',
    )}) must be a valid plugin slug.

Your Configuration is: ${slug}.`,
  };
}

export function EPLUGINFILEVERSION(version: string) {
  return {
    message: `Plugin file version is invalid: ${version}`,
    details: `The [version string](${linkify(
      'README.md#versioning',
    )}) must be correct for the replacements to work.

Your Configuration is: ${version}.`,
  };
}

export function EVERSIONNOTUPDATED(file: string) {
  return {
    message: `Plugin file version not updated: ${file}`,
    details: `The [version string](${linkify(
      'README.md#versioning',
    )}) must be correct for the replacements to work.

Invalid version found in: ${file}.`,
  };
}

export function EFILEINVALID(file: string) {
  return {
    message: `File is invalid: ${file}`,
    details: `The file is invalid: ${file}.`,
  };
}

export function EFILECOPY(file: string) {
  return {
    message: `File copy failed: ${file}`,
    details: `The file copy failed for the following file: ${file}.`,
  };
}
