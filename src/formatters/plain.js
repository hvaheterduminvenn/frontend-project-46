import isObject from '../utils.js';

const getFormattedValue = (value) => {
  let formattedValue;
  if (typeof value === 'string') {
    formattedValue = `'${value}'`;
  } else if (isObject(value)) {
    formattedValue = '[complex value]';
  } else {
    formattedValue = value;
  }
  return formattedValue;
};

const outputPlain = (tree, path = '') => {
  const output = [];

  if (tree.children) {
    const newPath = path ? `${path}.` : path;
    tree.children.forEach((node) => {
      output.push(outputPlain(node, `${newPath}${node.name}`));
    });

    return output.flat();
  }

  if (Array.isArray(tree.value)) {
    const value1 = getFormattedValue(tree.value[0]);
    const value2 = getFormattedValue(tree.value[1]);
    output.push(`Property '${path}' was updated. From ${value1} to ${value2}\n`);
  } else {
    if (tree.type === 'removed') {
      output.push(`Property '${path}' was removed\n`);
    }
    if (tree.type === 'created') {
      const value = getFormattedValue(tree.value);
      output.push(`Property '${path}' was added with value: ${value}\n`);
    }
  }

  return output.flat();
};

const plain = (tree, path = '') => outputPlain(tree, path).join('');

export default plain;
