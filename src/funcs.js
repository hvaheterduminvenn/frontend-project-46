import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const getFilePathAndType = (enteredFilePath) => {
  const filePath = path.resolve(enteredFilePath);
  const fileType = path.extname(filePath).slice(1);

  return { filePath, fileType };
};

const getFileData = (fileContent, fileType) => {
  switch (fileType) {
    case 'json': {
      return JSON.parse(fileContent);
    }
    case 'yml':
    case 'yaml': {
      return yaml.load(fileContent);
    }
    default:
      throw new Error(`Can not parse ${fileType} file type!`);
  }
};

const getUniqueKeys = (objectA, objectB) => {
  const uniqueKeysA = Object.keys(objectA);
  const uniqueKeysB = Object
    .keys(objectB)
    .reduce((uniqueKeys, key) => {
      if (!uniqueKeysA.includes(key)) {
        return [...uniqueKeys, key];
      }
      return uniqueKeys;
    }, []);

  return [...uniqueKeysA.concat(uniqueKeysB)].sort();
};

const sort = (tree) => {
  if (tree.children) {
    return {
      ...tree,
      children: [...tree.children].sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      }),
    };
  }
  return tree;
};

const getDifference = (file1, file2, nodeName) => {
  const tree1 = { ...file1 };
  const tree2 = { ...file2 };
  // node TYPES: created, removed, updated, unchanged, nested
  const diff = {
    name: nodeName,
    type: 'nested',
    children: [],
  };

  getUniqueKeys(tree1, tree2).forEach((key) => {
    if (Object.keys(tree1).includes(key) && !Object.keys(tree2).includes(key)) {
      diff.children = [
        ...diff.children,
        {
          name: key,
          type: 'removed',
          value: tree1[key],
        },
      ];
    } else if (!Object.keys(tree1).includes(key) && Object.keys(tree2).includes(key)) {
      diff.children = [
        ...diff.children,
        {
          name: key,
          type: 'created',
          value: tree2[key],
        },
      ];
    } else if (_.isEqual(tree1[key], tree2[key])) {
      diff.children = [
        ...diff.children,
        {
          name: key,
          type: 'unchanged',
          value: tree1[key],
        },
      ];
    } else if (!_.isObject(tree1[key]) || !_.isObject(tree2[key])) {
      diff.children = [
        ...diff.children,
        {
          name: key,
          type: 'updated',
          value: [tree1[key], tree2[key]],
        },
      ];
    } else {
      diff.children = [
        ...diff.children,
        getDifference(tree1[key], tree2[key], key),
      ];
    }
  });

  return sort({ ...diff });
};

export {
  getFilePathAndType,
  getFileData,
  getDifference,
  getUniqueKeys,
  sort,
};
