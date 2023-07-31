import fs from 'fs-extra';
import path from 'node:path';

export function getFileArray(workDir: string, fileToRead: string): string[] {
  try {
    const filesinFile = fs
      .readFileSync(path.resolve(path.join(workDir, fileToRead)), 'utf8')
      .split('\n')
      .filter((file) => file !== '')
      .map((file) => file.trim());

    return [...new Set([...filesinFile])];
  } catch (err) {
    return [];
  }
}
