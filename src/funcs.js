import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const getFileData = (filepath = '') => {
  let content;

  try {
    const resolvedPath = path.resolve(filepath);
    const fileExtension = path.extname(resolvedPath);
    switch (fileExtension) {
      case '.json': {
        const jsonData = fs.readFileSync(resolvedPath, { encoding: 'utf8', flag: 'r' });
        content = JSON.parse(jsonData);
        break;
      }
      case '.yml':
      case '.yaml': {
        content = yaml.load(fs.readFileSync(resolvedPath, { encoding: 'utf8', flag: 'r' }));
        break;
      }
      default:
        throw new Error(`Can not parse ${fileExtension} file extension!`);
    }
  } catch (err) {
    console.log(err.message);
    throw err;
    // return err;
  }

  return content;
};

const prefix = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const newValue = {};
  Object.entries(value).forEach(([key, val]) => {
    newValue[`  ${key}`] = prefix(val);
  });
  return newValue;
};

const compare = (file1, file2) => {
  const tree1 = { ...file1 };
  const tree2 = { ...file2 };
  const diff = {};

  Object.entries(tree1).forEach(([key, value]) => {
    if (tree2[key] === undefined) {
      diff[`- ${key}`] = prefix(value);
    } else {
      if (_.isEqual(value, tree2[key])) {
        diff[`  ${key}`] = value;
      } else if (typeof value === 'object' && typeof tree2[key] === 'object') {
        diff[`  ${key}`] = compare(value, tree2[key]);
      } else {
        diff[`- ${key}`] = prefix(value);
        diff[`+ ${key}`] = prefix(tree2[key]);
      }
      delete tree2[key];
    }
  });

  Object.entries(tree2).forEach(([key, value]) => {
    diff[`+ ${key}`] = prefix(value);
  });

  return diff;
};

const sort = (tree) => {
  const sorted = Object.entries(tree).sort(([prefixedKeyA], [prefixedKeyB]) => {
    const keyA = prefixedKeyA.substring(2);
    const keyB = prefixedKeyB.substring(2);

    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  });

  return sorted.map((node) => {
    if (node[1] !== null && typeof node[1] === 'object') {
      return [node[0], sort(node[1])];
    }
    return node;
  });
};

const getDifference = (file1data, file2data) => {
  const difference = compare(file1data, file2data);
  return sort(difference);
};

export { getDifference, getFileData };
