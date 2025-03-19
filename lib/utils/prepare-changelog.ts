import fs from 'fs-extra';
import { marked } from 'marked';
import SemanticReleaseError from '@semantic-release/error';
import getError from './get-error.js';

function stripLink(text: string): string {
  return text.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');
}
function stripEmoji(text: string): string {
  return text.replace(/:\w+:/g, '').trim();
}

function stripCommitHash(text: string): string {
  return text.replace(/\(.+\)$/, '').trim();
}

export async function prepareChangelog(
  readmePath: string,
  notes: string,
): Promise<any> {
  const errors: SemanticReleaseError[] = [];
  const renderer = new marked.Renderer();

  renderer.link = ({ text }) => text;
  renderer.heading = ({ text, depth }) => {
    if (depth === 2) {
      return `= ${stripLink(text)} =\n\n`;
    }

    if (depth === 3) {
      return `**${stripEmoji(text)}**\n\n`;
    }

    return `\n${text}\n\n`;
  };
  renderer.list = ({ items }) =>
    `${items.map((item) => renderer.listitem(item)).join('')}\n`;
  renderer.listitem = ({ text }) => `* ${stripCommitHash(stripLink(text))}\n`;

  const output = (await marked(notes, { renderer }))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const readmeText = fs
    .readFileSync(readmePath, 'utf-8')
    .replace('== Changelog ==', `== Changelog ==\n\n${output}`);

  try {
    fs.writeFileSync(readmePath, readmeText);
  } catch (err) {
    errors.push(getError('EFILECOPY', readmePath));
  }

  return errors;
}
