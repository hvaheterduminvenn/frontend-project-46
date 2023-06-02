import _ from 'lodash';

const DEFAULT_TAB_SIZE = 2;

const getTabString = (depth) => `${(' ').repeat(DEFAULT_TAB_SIZE * depth)}`;

const outputObject = (data, depth) => {
  const output = [];

  Object.entries(data).forEach(([key, value]) => {
    if (!_.isObject(value)) {
      output.push(`${getTabString(depth)}  ${key}: ${value}\n`);
    } else {
      output.push(`${getTabString(depth)}  ${key}: {\n`);
      output.push(outputObject(value, depth + 2));
      output.push(`${getTabString(depth + 1)}}\n`);
    }
  });

  return output.flat();
};

const handleOutput = (data, sign, depth) => {
  const output = [];

  if (data.children) {
    output.push(`${getTabString(depth)}${sign}${data.name}: {\n`);
    data.children.forEach((node) => {
      output.push(composeOutput(node, depth + 2));
    });
    output.push(`${getTabString(depth + 1)}}\n`);
  } else if (_.isObject(data.value)) {
    output.push(`${getTabString(depth)}${sign}${data.name}: {\n`);
    output.push(outputObject(data.value, depth + 2));
    output.push(`${getTabString(depth + 1)}}\n`);
  } else {
    output.push(`${getTabString(depth)}${sign}${data.name}: ${data.value}\n`);
  }

  return output.flat();
};

const composeOutput = (data, depth) => {
  const output = [];
  switch (data.type) {
    case 'removed': {
      output.push(handleOutput(data, '- ', depth));
      break;
    }
    case 'created': {
      output.push(handleOutput(data, '+ ', depth));
      break;
    }
    case 'unchanged': {
      output.push(handleOutput(data, '  ', depth));
      break;
    }
    case 'updated': {
      data.value.forEach((value, index) => {
        const sign = index === 0 ? '- ' : '+ ';
        if (_.isObject(value)) {
          output.push(`${getTabString(depth)}${sign}${data.name}: {\n`);
          output.push(outputObject(value, depth + 2));
          output.push(`${getTabString(depth + 1)}}\n`);
        } else {
          output.push(`${getTabString(depth)}${sign}${data.name}: ${value}\n`);
        }
      });
      break;
    }
    case 'nested': {
      output.push(handleOutput(data, '  ', depth));
      break;
    }
    default:
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
