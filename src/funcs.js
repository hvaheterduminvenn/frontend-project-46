import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const getFilePathAndExtension = (enteredFilePath) => {
  const resolvedPath = path.resolve(enteredFilePath);
  const fileExtension = path.extname(resolvedPath);

  return { path: resolvedPath, extension: fileExtension.slice(1) };
};

const readFile = (filePath) => fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

const getFileData = (fileContent, extension) => {
  let data;

  switch (extension) {
    case 'json': {
      data = JSON.parse(fileContent);
      break;
    }
    case 'yml':
    case 'yaml': {
      data = yaml.load(fileContent);
      break;
    }
    default:
      throw new Error(`Can not parse ${extension} file extension!`);
  }

  return data;
};

const getUniqueKeys = (objectA, objectB) => {
  const uniqueKeys = Object.keys(objectA);
  Object.keys(objectB).forEach((key) => {
    if (!uniqueKeys.includes(key)) {
      uniqueKeys.push(key);
    }
  });

  return uniqueKeys.sort();
};

const compare = (file1, file2, nodeName) => {
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
      diff.children.push({
        name: key,
        type: 'removed',
        value: tree1[key],
      });
    } else if (!Object.keys(tree1).includes(key) && Object.keys(tree2).includes(key)) {
      diff.children.push({
        name: key,
        type: 'created',
        value: tree2[key],
      });
    } else if (_.isEqual(tree1[key], tree2[key])) {
      diff.children.push({
        name: key,
        type: 'unchanged',
        value: tree1[key],
      });
    } else if (!_.isObject(tree1[key]) || !_.isObject(tree2[key])) {
      diff.children.push({
        name: key,
        type: 'updated',
        value: [tree1[key], tree2[key]],
      });
    } else {
      diff.children.push(compare(tree1[key], tree2[key], key));
    }
  });

  return diff;
};

const sort = (tree) => {
  if (tree.children) {
    tree.children.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    tree.children.forEach((child) => { sort(child); });
  }
  return tree;
};

const getDifference = (file1data, file2data) => {
  const difference = compare(file1data, file2data, 'root');
  return sort({ ...difference });
};

export {
  getFilePathAndExtension,
  readFile,
  getFileData,
  getDifference,
};
