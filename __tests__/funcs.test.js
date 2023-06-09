import {
  getFilePathAndType,
  getUniqueKeys,
  sort,
  getFileData,
  getDifference,
} from '../src/funcs.js';

describe('getFilePathAndType():', () => {
  const filePath1 = '__fixtures__/file2.json';
  const filePath2 = '/home/roman/Documents/02_diff/__fixtures__/file2.yaml';

  test('check normal function output with relative value', () => {
    expect(getFilePathAndType(filePath1)).toEqual({
      filePath: '/home/roman/Documents/02_diff/__fixtures__/file2.json',
      fileType: 'json',
    });
  });

  test('check normal function output with absolute value', () => {
    expect(getFilePathAndType(filePath2)).toEqual({
      filePath: filePath2,
      fileType: 'yaml',
    });
  });
});

describe('getUniqueKeys():', () => {
  const obj1 = { name: 'Bob', age: 100, address: 'RU' };
  const obj2 = { company: 'Megafon', address: 'RU' };
  const keys = getUniqueKeys(obj1, obj2);

  test('check normal function output', () => {
    expect(keys).toEqual(['address', 'age', 'company', 'name']);
  });

  test('check function output for empty objects', () => {
    expect(getUniqueKeys({}, {})).toEqual([]);
  });
});

describe('sort():', () => {
  const cases = [[{
    name: 'root',
    type: 'nested',
    children: [
      {
        name: 'one',
        type: 'created',
        value: 1,
      }, {
        name: 'two',
        type: 'unchanged',
        value: 2,
      }, {
        name: 'three',
        type: 'removed',
        value: 3,
      }, {
        name: 'four',
        type: 'created',
        value: 4,
      },
    ],
  }, {
    name: 'root',
    type: 'nested',
    children: [
      {
        name: 'four',
        type: 'created',
        value: 4,
      }, {
        name: 'one',
        type: 'created',
        value: 1,
      }, {
        name: 'three',
        type: 'removed',
        value: 3,
      }, {
        name: 'two',
        type: 'unchanged',
        value: 2,
      },
    ],
  }], [{
    name: 'someName',
    type: 'nested',
    children: [
      {
        name: 'b',
        type: 'created',
        value: 1,
      }, {
        name: 'a',
        type: 'unchanged',
        value: 2,
      }, {
        name: 'c',
        type: 'created',
        value: 4,
      },
    ],
  }, {
    name: 'someName',
    type: 'nested',
    children: [{
      name: 'a',
      type: 'unchanged',
      value: 2,
    }, {
      name: 'b',
      type: 'created',
      value: 1,
    }, {
      name: 'c',
      type: 'created',
      value: 4,
    }],
  }]];

  test.each(cases)(
    'check normal function output with sorting applied',
    (tree, expectedResult) => {
      expect(sort(tree)).toEqual(expectedResult);
    },
  );

  test('check normal function output with sorting NOT applied to an argument', () => {
    const tree = {
      name: 'someName',
      type: 'nested',
      value: 'abcd',
    };
    expect(sort(tree)).toEqual(tree);
  });
});

describe('getFileData():', () => {
  test('check function output with empty file', () => {
    expect(getFileData('{}', 'json')).toEqual({});
  });

  test('check function output with JSON file type', () => {
    expect(getFileData('{ "abc": 12345 }', 'json')).toEqual({ abc: 12345 });
  });

  test('check function output with YAML file type', () => {
    const content = `common:
  setting1: Value 1
  setting2: 200
group1:
  baz: bas`;

    expect(getFileData(content, 'yaml')).toEqual({
      common: {
        setting1: 'Value 1',
        setting2: 200,
      },
      group1: {
        baz: 'bas',
      },
    });
  });

  test('check function throw with not-supported file type', () => {
    const f = () => { getFileData({ abc: 12345 }, 'mmm'); };
    expect(f).toThrow();
  });

  test('check function throw with not valid data', () => {
    const f = () => { getFileData('a b c', 'json'); };
    expect(f).toThrow();
  });
});

describe('getDifference():', () => {
  test('check empty files comparison', () => {
    expect(getDifference({}, {}, 'root')).toEqual({
      name: 'root',
      type: 'nested',
      children: [],
    });
  });

  const cases = [
    [
      { key1: 'value1' },
      { key1: 'value1' },
      {
        children: [{
          name: 'key1',
          type: 'unchanged',
          value: 'value1',
        }],
        name: 'root',
        type: 'nested',
      },
    ],
    [
      { key1: 'value1' },
      { key1: 'value2' },
      {
        children: [{
          name: 'key1',
          type: 'updated',
          value: ['value1', 'value2'],
        }],
        name: 'root',
        type: 'nested',
      },
    ],
    [
      {},
      { key1: 'value2' },
      {
        children: [{
          name: 'key1',
          type: 'created',
          value: 'value2',
        }],
        name: 'root',
        type: 'nested',
      },
    ],
    [
      { key1: 'value2' },
      {},
      {
        children: [{
          name: 'key1',
          type: 'removed',
          value: 'value2',
        }],
        name: 'root',
        type: 'nested',
      },
    ],
  ];

  test.each(cases)(
    'check non-empty files comparison',
    (file1, file2, expectedResult) => {
      expect(getDifference(file1, file2, 'root')).toEqual(expectedResult);
    },
  );
});
