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

export function EINVALIDWITHASSETS(withAssets: string) {
  return {
    message: `Invalid withAssets: ${withAssets}`,
    details: `The [withAssets option](${linkify(
      'README.md#withassets',
    )}) must be either \`true\` or \`false\`.

Your Configuration is: ${withAssets}.`,
  };
}

export function EINVALIDWITHREADME(withReadme: string) {
  return {
    message: `Invalid withReadme: ${withReadme}`,
    details: `The [withReadme option](${linkify(
      'README.md#withreadme',
    )}) must be either \`true\` or \`false\`.

Your Configuration is: ${withReadme}.`,
  };
}

export function EINVALIDWITHVERSIONFILE(withVersionFile: string) {
  return {
    message: `Invalid withVersionFile: ${withVersionFile}`,
    details: `The [withVersionFile option](${linkify(
      'README.md#withversionfile',
    )}) must be either \`true\` or \`false\`.

Your Configuration is: ${withVersionFile}.`,
  };
}

export function EINVALIDPATH(path: string) {
  return {
    message: `Invalid path: ${path}`,

    details: `The [path option](${linkify(
      'README.md#path',
    )}) must be a valid path.

Your Configuration is: ${path}.`,
  };
}

export function EINVALIDCOPYFILES(copyFiles: string) {
  return {
    message: `Invalid copyFiles: ${copyFiles}`,

    details: `The [copyFiles option](${linkify(
      'README.md#copyfiles',
    )}) must be either \`true\` or \`false\`.

Your Configuration is: ${copyFiles}.`,
  };
}

export function EINVALIDRELEASEPATH(releasePath: string) {
  return {
    message: `Invalid releasePath: ${releasePath}`,
    details: `The [releasePath option](${linkify(
      'README.md#releasepath',
    )}) must be a valid path.

Your Configuration is: ${releasePath}.`,
  };
}

export function EINVALIDWORKDIR(workDir: string) {
  return {
    message: `Invalid workDir: ${workDir}`,
    details: `The [workDir option](${linkify(
      'README.md#workdir',
    )}) must be a valid path.

Your Configuration is: ${workDir}.`,
  };
}

export function EINVALIDVERSIONFILES(versionFiles: string) {
  return {
    message: `Invalid versionFiles: ${versionFiles}`,

    details: `The [versionFiles option](${linkify(
      'README.md#versionfiles',
    )}) must be an array of strings.

Your Configuration is: ${versionFiles}.`,
  };
}

export function EINVALIDINCLUDE(include: string) {
  return {
    message: `Invalid include: ${include}`,
    details: `The [include option](${linkify(
      'README.md#include',
    )}) must be an array of globs.

Your Configuration is: ${include}.`,
  };
}

export function EINVALIDEXCLUDE(exclude: string) {
  return {
    message: `Invalid exclude: ${exclude}`,
    details: `The [exclude option](${linkify(
      'README.md#exclude',
    )}) must be an array of globs.

Your Configuration is: ${exclude}.`,
  };
}

export function EINVALIDPLUGIN(slug: string) {
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

export function EZIP(zipError: string) {
  return {
    message: `Creating ZIP file failed.`,
    details: `The zip failed with the following error: ${zipError}.`,
  };
}

export function ENOENT(zipError: string) {
  return {
    message: `File not found.`,
    details: `The file was not found: ${zipError}.`,
  };
}

export function ETHEMEFILENOTFOUND(file: string) {
  return {
    message: `Your theme must contain these files: ${file}`,
    details: `Check if the files exist, and if not create them: ${file}.`,
  };
}

export function ETHEMEFILEINVALID(file: string) {
  return {
    message: `Your theme file is invalid: ${file}`,
    details: `The file is invalid: ${file}.`,
  };
}

export function ETHEMEFILEVERSION(version: string) {
  return {
    message: `Theme file version is invalid: ${version}`,
    details: `The [version string](${linkify(
      'README.md#versioning',
    )}) must be correct for the replacements to work.

Your Configuration is: ${version}.`,
  };
}
