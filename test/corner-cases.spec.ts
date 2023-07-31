import { getFileArray } from '../lib/utils/get-file-array.js';

it('Should fail to read non-existant file', () => {
  try {
    const files = getFileArray('/test', 'non-existant-file.txt');
    expect(files).toEqual([]);
  } catch (err) {}
});
