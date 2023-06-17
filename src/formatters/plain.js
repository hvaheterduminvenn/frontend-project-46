import _ from 'lodash';

const getFormattedValue = (value) => {
  let formattedValue;
  if (typeof value === 'string') {
    formattedValue = `'${value}'`;
  } else if (_.isObject(value)) {
    formattedValue = '[complex value]';
  } else {
    formattedValue = value;
  }
  return formattedValue;
};

const outputPlain = (tree, path = '') => {
  const output = [];

  switch (tree.type) {
    case 'nested': {
      const newPath = path ? `${path}.` : path;
      tree.children.forEach((node) => {
        output.push(outputPlain(node, `${newPath}${node.name}`));
      });
      break;
    }
    case 'updated': {
      const [valueBefore, valueAfter] = tree.value;
      return [...output, `Property '${path}' was updated. From ${getFormattedValue(valueBefore)} to ${getFormattedValue(valueAfter)}`];
    }
    case 'removed': {
      return [...output, `Property '${path}' was removed`];
    }
    case 'created': {
      const value = getFormattedValue(tree.value);
      return [...output, `Property '${path}' was added with value: ${value}`];
    }
    default: break;
  }

  return output.flat();
};

const plain = (tree, path = '') => outputPlain(tree, path).join('\n');

export default plain;
