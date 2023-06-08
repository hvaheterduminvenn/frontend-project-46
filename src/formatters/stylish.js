import _ from 'lodash';

const DEFAULT_TAB_SIZE = 4;
const SIGN_STRING_LENGTH = 2;

const getTabString = (depth, sign) => `${(' ').repeat(DEFAULT_TAB_SIZE * (depth - 1) + DEFAULT_TAB_SIZE - SIGN_STRING_LENGTH)}${sign}`;

const outputObject = (data, depth, sign) => {
  const output = [];

  Object.entries(data).forEach(([key, value]) => {
    if (!_.isObject(value)) {
      output.push(`${getTabString(depth, sign)}${key}: ${value}\n`);
    } else {
      output.push(`${getTabString(depth, sign)}${key}: {\n`);
      output.push(outputObject(value, depth + 1, '  '));
      output.push(`${getTabString(depth, '  ')}}\n`);
    }
  });

  return output.flat();
};

const composeOutput = (node, nodeDepth) => {
  const handleOutput = (data, sign, depth) => {
    const output = [];

    if (data.children) {
      output.push(`${getTabString(depth, sign)}${data.name}: {\n`);
      data.children.forEach((childNode) => {
        output.push(composeOutput(childNode, depth + 1));
      });
      output.push(`${getTabString(depth, '  ')}}\n`);
    } else if (_.isObject(data.value)) {
      output.push(`${getTabString(depth, sign)}${data.name}: {\n`);
      output.push(outputObject(data.value, depth + 1, '  '));
      output.push(`${getTabString(depth, '  ')}}\n`);
    } else {
      output.push(`${getTabString(depth, sign)}${data.name}: ${data.value}\n`);
    }

    return output.flat();
  };

  const output = [];
  switch (node.type) {
    case 'removed': {
      output.push(handleOutput(node, '- ', nodeDepth));
      break;
    }
    case 'created': {
      output.push(handleOutput(node, '+ ', nodeDepth));
      break;
    }
    case 'updated': {
      node.value.forEach((value, index) => {
        const sign = index === 0 ? '- ' : '+ ';
        if (_.isObject(value)) {
          output.push(`${getTabString(nodeDepth, sign)}${node.name}: {\n`);
          output.push(outputObject(value, nodeDepth + 1, '  '));
          output.push(`${getTabString(nodeDepth, '  ')}}\n`);
        } else {
          output.push(`${getTabString(nodeDepth, sign)}${node.name}: ${value}\n`);
        }
      });
      break;
    }
    default:
      output.push(handleOutput(node, '  ', nodeDepth));
      break;
  }

  return output.flat();
};

const stylish = (data) => {
  if (!data.children) {
    return '{}';
  }

  const output = ['{\n'];
  data.children.forEach((node) => {
    output.push(composeOutput(node, 1));
  });
  output.push('}');

  return output.flat().join('');
};

export default stylish;
