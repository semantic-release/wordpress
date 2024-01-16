import fs from 'fs-extra';
import path from 'node:path';

export function getFileArray(
  workDir: string,
  fileToRead: string,
): null | string[] {
  try {
    const filesinFile = fs
      .readFileSync(path.resolve(path.join(workDir, fileToRead)), 'utf8') // Read the file from the workDir
      .split('\n') // Split the file into an array of lines
      .map((file) => file.trim()) // Trim each line
      .filter((file) => file !== '' && !file.startsWith('#')); // Remove empty lines and comments

    return [...new Set([...filesinFile])];
  } catch (err) {
    return null;
  }
}
