import _ from 'lodash';

const DEFAULT_TAB_SIZE = 4;
const SIGN_STRING_LENGTH = 2;

const getTabString = (depth, sign) => `${(' ').repeat(DEFAULT_TAB_SIZE * (depth - 1) + DEFAULT_TAB_SIZE - SIGN_STRING_LENGTH)}${sign}`;

const outputObject = (data, depth, sign) => Object.entries(data)
  .map(([key, value]) => {
    if (!_.isObject(value)) {
      return `${getTabString(depth, sign)}${key}: ${value}\n`;
    }
    return `${getTabString(depth, sign)}${key}: {\n${outputObject(value, depth + 1, '  ')}${getTabString(depth, '  ')}}\n`;
  })
  .flat();

const composeOutput = (node, nodeDepth) => {
  const handleOutput = (data, sign, depth) => {
    if (data.children) {
      return [
        `${getTabString(depth, sign)}${data.name}: {\n`,
        data.children.map((childNode) => composeOutput(childNode, depth + 1)).flat(),
        `${getTabString(depth, '  ')}}\n`,
      ].flat();
    }
    if (_.isObject(data.value)) {
      return [
        `${getTabString(depth, sign)}${data.name}: {\n`,
        outputObject(data.value, depth + 1, '  '),
        `${getTabString(depth, '  ')}}\n`,
      ].flat();
    }

    return `${getTabString(depth, sign)}${data.name}: ${data.value}\n`;
  };

  switch (node.type) {
    case 'removed': {
      return handleOutput(node, '- ', nodeDepth);
    }
    case 'created': {
      return handleOutput(node, '+ ', nodeDepth);
    }
    case 'updated': {
      return node.value.map((value, index) => {
        const sign = index === 0 ? '- ' : '+ ';
        if (_.isObject(value)) {
          return [
            `${getTabString(nodeDepth, sign)}${node.name}: {\n`,
            outputObject(value, nodeDepth + 1, '  '),
            `${getTabString(nodeDepth, '  ')}}\n`,
          ];
        }
        return `${getTabString(nodeDepth, sign)}${node.name}: ${value}\n`;
      }).flat();
    }
    default:
      return handleOutput(node, '  ', nodeDepth);
  }
};

const stylish = (data) => {
  if (!data.children) {
    return '{}';
  }

  const output = data.children.map((node) => composeOutput(node, 1)).flat();

  return ['{\n', output, '}'].flat().join('');
};

export default stylish;
