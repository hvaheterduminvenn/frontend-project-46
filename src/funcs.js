import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';
import { stylish, plain, json } from './formatters/index.js';

const getFilePathAndExtension = (enteredFilPath) => {
  const resolvedPath = path.resolve(enteredFilPath);
  const fileExtension = path.extname(resolvedPath);

  return { path: resolvedPath, extension: fileExtension };
};

const getFileData = ({ path = '', extension }) => {
  let content;

  switch (extension) {
    case '.json': {
      const jsonData = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
      content = JSON.parse(jsonData);
      break;
    }
    case '.yml':
    case '.yaml': {
      content = yaml.load(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }));
      break;
    }
    default:
      throw new Error(`Can not parse ${extension} file extension!`);
  }

  return content;
};

const compare = (file1, file2, nodeName) => {
  const tree1 = { ...file1 };
  const tree2 = { ...file2 };
  const diff = {
    name: nodeName,
    state: 'unchanged',
    children: [],
  };

  Object.entries(tree1).forEach(([key, value]) => {
    if (tree2[key] === undefined) {
      diff.children.push({
        name: key,
        state: 'removed',
        value,
      });
    } else {
      if (_.isEqual(value, tree2[key])) {
        diff.children.push({
          name: key,
          state: 'unchanged',
          value,
        });
      } else if (typeof value === 'object' && typeof tree2[key] === 'object') {
        diff.children.push(compare(value, tree2[key], key));
      } else {
        diff.children.push({
          name: key,
          state: 'updated',
          value: [value, tree2[key]],
        });
      }
      delete tree2[key];
    }
  });

  Object.entries(tree2).forEach(([key, value]) => {
    diff.children.push({
      name: key,
      state: 'created',
      value,
    });
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

const genDiff = (enteredFilePath1, enteredFilePath2, formatName = 'stylish') => {
  const filepath1 = getFilePathAndExtension(enteredFilePath1);
  const filepath2 = getFilePathAndExtension(enteredFilePath2);
  const file1data = getFileData(filepath1);
  const file2data = getFileData(filepath2);
  const difference = getDifference(file1data, file2data);
  let formattedOutput = '';
  switch (formatName) {
    case 'stylish': {
      formattedOutput = stylish(difference);
      break;
    }
    case 'plain': {
      formattedOutput = plain(difference);
      break;
    }
    case 'json': {
      formattedOutput = json(difference);
      break;
    }
    default:
      break;
  }
  return formattedOutput;
};

export {
  getDifference,
  getFileData,
  genDiff,
};
