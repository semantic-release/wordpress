import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import * as path from 'node:path';

export function readZip(
  dir: string,
  file: string,
  pfx: RegExp = /.^/,
): Set<string> {
  return new Set(
    new AdmZip(path.join(dir, file))
      .getEntries()
      .map(({ entryName }) => entryName.replace(pfx, '').replace(/\/$/, ''))
      .filter((e) => e !== '' && (pfx.source == '.^' || !e.match(/\//))),
  );
}

export function readDir(recursive = false, ...dirs: string[]): Set<string> {
  return new Set(
    fs.readdirSync(path.join(...dirs), {
      recursive,
    }) as string[],
  );
}

export function readFile(...paths: string[]): string {
  return fs.readFileSync(path.join(...paths), 'utf8');
}
