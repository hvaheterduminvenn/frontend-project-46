import _ from 'lodash';

const outputAsProperty = (spaces, sign, key, value) => {
  console.log(`${' '.repeat(spaces)}${sign}${key}: ${value}`);
};

const stylish = (data, spaces) => {
  const outputAsObject = (sign, key, value) => {
    console.log(`${' '.repeat(spaces)}${sign}${key}: {`);
    stylish(value, spaces + 4);
    console.log(`${' '.repeat(spaces)}  }`);
  };

  Object.entries(data).forEach(([key, value]) => {
    if (value.value1 === undefined && value.value2 === undefined) {
      if (_.isObject(value)) {
        outputAsObject('  ', key, value);
      } else {
        outputAsProperty(spaces, '  ', key, value);
      }
      return;
    }

    if (value.value1 !== undefined
      && value.value2 !== undefined
      && _.isEqual(value.value1, value.value2)) {
      if (_.isObject(value.value1)) {
        outputAsObject('  ', key, value);
      } else {
        outputAsProperty(spaces, '  ', key, value.value1);
      }
      return;
    }
    if (value.value1 !== undefined) {
      if (_.isObject(value.value1)) {
        outputAsObject('- ', key, value.value1);
      } else {
        outputAsProperty(spaces, '- ', key, value.value1);
      }
    }
    if (value.value2 !== undefined) {
      if (_.isObject(value.value2)) {
        outputAsObject('+ ', key, value.value2);
      } else {
        outputAsProperty(spaces, '+ ', key, value.value2);
      }
    }
  });
};

export default stylish;
