import path from 'path';
import { fileURLToPath } from 'url';
import { getDifference, getFileData } from '../src/funcs.js';

const file = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

describe('getDifference', () => {
  test('check files comparison', () => {
    const fileName = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileName);
    const getFixturePath = (filename) => path.join(dirname, '..', '__fixtures__', filename);
    const file1 = getFileData(getFixturePath('file3.json'));
    const file2 = getFileData(getFixturePath('file4.json'));

    expect(getDifference(file1, file2)).toEqual({
      follow: { value1: false },
      host: { value1: 'hexlet.io', value2: 'hexlet.io' },
      proxy: { value1: '123.234.53.22' },
      timeout: { value1: 50, value2: 20 },
      verbose: { value2: true },
    });
  });

  test('check empty files comparison', () => {
    expect(getDifference({}, {})).toEqual({});
  });
});

describe('getFileData', () => {
  test('return file data', () => {
    const fileName = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileName);
    const getFixturePath = (filename) => path.join(dirname, '..', '__fixtures__', filename);

    expect(getFileData(getFixturePath('file3.yml'))).toEqual(file);
  });

  test('throw Error for a wrong file path', () => {
    expect(() => { getFileData(); }).toThrow('Can not parse  file extension!');
  });
});
