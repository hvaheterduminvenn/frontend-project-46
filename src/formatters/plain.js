import _ from 'lodash';

const getFormattedValue = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return value;
};

const outputPlain = (tree, path = '') => {
  switch (tree.type) {
    case 'nested': {
      const newPath = path ? `${path}.` : path;
      return tree.children
        .map((node) => outputPlain(node, `${newPath}${node.name}`))
        .filter((outputString) => outputString !== undefined)
        .flat();
    }
    case 'updated': {
      const [valueBefore, valueAfter] = tree.value;
      return `Property '${path}' was updated. From ${getFormattedValue(valueBefore)} to ${getFormattedValue(valueAfter)}`;
    }
    case 'removed': {
      return `Property '${path}' was removed`;
    }
    case 'created': {
      const value = getFormattedValue(tree.value);
      return `Property '${path}' was added with value: ${value}`;
    }
    default: break;
  }
  return undefined;
};

const plain = (tree, path = '') => outputPlain(tree, path).join('\n');

export default plain;
