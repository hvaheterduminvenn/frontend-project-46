import path from 'path';
import { fileURLToPath } from 'url';
import { getDifference, getFileData } from '../src/funcs.js';

const file1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};
const file2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

describe('getDifference', () => {
  test('check files comparison', () => {
    expect(getDifference(file1, file2)).toEqual([
      'follow: false 1',
      'host: hexlet.io 3',
      'proxy: 123.234.53.22 1',
      'timeout: 50 1',
      'timeout: 20 2',
      'verbose: true 2',
    ]);
  });

  test('check empty files comparison', () => {
    expect(getDifference({}, {})).toEqual([]);
  });
});

describe('getFileData', () => {
  test('return file data', () => {
    const fileName = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileName);
    const getFixturePath = (filename) => path.join(dirname, '..', 'src', filename);

    expect(getFileData(getFixturePath('file1.yml'))).toEqual(file1);
  });

  test('throw Error for a wrong file path', () => {
    expect(() => { getFileData(); }).toThrow('Can not parse  file extension!');
  });
});
