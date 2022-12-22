import isObject from '../utils.js';

const outputObject = (data, spaces) => {
  const output = [];

  Object.entries(data).forEach(([key, value]) => {
    if (!isObject(value)) {
      output.push(`${(' ').repeat(spaces)}  ${key}: ${value}\n`);
    } else {
      output.push(`${(' ').repeat(spaces)}  ${key}: {\n`);
      output.push(outputObject(value, spaces + 4));
      output.push(`${(' ').repeat(spaces + 2)}}\n`);
    }
  });

  return output.flat();
};

const handleOutput = (data, sign, spaces) => {
  const output = [];

  if (data.children) {
    output.push(`${(' ').repeat(spaces)}${sign}${data.name}: {\n`);
    data.children.forEach((node) => {
      output.push(composeOutput(node, spaces + 4));
    });
    output.push(`${(' ').repeat(spaces + 2)}}\n`);
  } else if (isObject(data.value)) {
    output.push(`${(' ').repeat(spaces)}${sign}${data.name}: {\n`);
    output.push(outputObject(data.value, spaces + 4));
    output.push(`${(' ').repeat(spaces + 2)}}\n`);
  } else {
    output.push(`${(' ').repeat(spaces)}${sign}${data.name}: ${data.value}\n`);
  }

  return output.flat();
};

const composeOutput = (data, spaces) => {
  const output = [];
  switch (data.state) {
    case 'removed': {
      output.push(handleOutput(data, '- ', spaces));
      break;
    }
    case 'created': {
      output.push(handleOutput(data, '+ ', spaces));
      break;
    }
    case 'unchanged': {
      output.push(handleOutput(data, '  ', spaces));
      break;
    }
    case 'updated': {
      data.value.forEach((value, index) => {
        const sign = index === 0 ? '- ' : '+ ';
        if (isObject(value)) {
          output.push(`${(' ').repeat(spaces)}${sign}${data.name}: {\n`);
          output.push(outputObject(value, spaces + 4));
          output.push(`${(' ').repeat(spaces + 2)}}\n`);
        } else {
          output.push(`${(' ').repeat(spaces)}${sign}${data.name}: ${value}\n`);
        }
      });
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
    output.push(composeOutput(node, 2));
  });
  output.push('}');

  return output.flat().join('');
};

export default stylish;
