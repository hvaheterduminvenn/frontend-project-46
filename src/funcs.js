import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';
import { stylish, plain, json } from '../formatters/index.js';

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

const compare = (file1, file2) => {
  const tree1 = { ...file1 };
  const tree2 = { ...file2 };
  const diff = {};

  Object.entries(tree1).forEach(([key, value]) => {
    if (tree2[key] === undefined) {
      diff[key] = {
        value1: value,
      };
    } else {
      if (_.isEqual(value, tree2[key])) {
        diff[key] = {
          value1: value,
          value2: value,
        };
      } else if (typeof value === 'object' && typeof tree2[key] === 'object') {
        diff[key] = compare(value, tree2[key]);
      } else {
        diff[key] = {
          value1: value,
          value2: tree2[key],
        };
      }
      delete tree2[key];
    }
  });

  Object.entries(tree2).forEach(([key, value]) => {
    diff[key] = {
      value2: value,
    };
  });

  return diff;
};

const sort = (tree) => {
  const sorted = Object.keys(tree)
    .sort()
    .reduce((accumulator, key) => {
      if (typeof tree[key] === 'object' && tree[key] !== null) {
        accumulator[key] = sort(tree[key]);
      } else {
        accumulator[key] = tree[key];
      }
      return accumulator;
    }, {});
  return sorted;
};

const getDifference = (file1data, file2data) => {
  const difference = compare(file1data, file2data);
  return sort(difference);
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const file1data = getFileData(filepath1);
  const file2data = getFileData(filepath2);
  const difference = getDifference(file1data, file2data);

  switch (formatName) {
    case 'stylish': {
      console.log('{');
      stylish(difference, 2);
      console.log('}');
      break;
    }
    case 'plain': {
      plain(difference);
      break;
    }
    case 'json': {
      json(difference);
      break;
    }
    default:
      break;
  }
};

export { getDifference, getFileData, genDiff };
