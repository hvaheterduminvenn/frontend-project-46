import _ from 'lodash';

const plain = (tree, path = '') => {
  Object.entries(tree).forEach(([key, value]) => {
    if (value.value1 === undefined && value.value2 === undefined) {
      plain(value, `${path}${key}.`);
      return;
    }
    if (value.value1 !== undefined && value.value2 !== undefined) {
      if (value.value1 !== value.value2) {
        let fromValue;
        if (_.isObject(value.value1)) {
          fromValue = '[complex value]';
        } else {
          fromValue = typeof value.value1 === 'string' ? `'${value.value1}'` : value.value1;
        }

        let toValue;
        if (_.isObject(value.value2)) {
          toValue = '[complex value]';
        } else {
          toValue = typeof value.value2 === 'string' ? `'${value.value2}'` : value.value2;
        }
        console.log(`Property '${path}${key}' was updated. From ${fromValue} to ${toValue}`);
      }
      return;
    }
    if (value.value1 !== undefined && value.value2 === undefined) {
      console.log(`Property '${path}${key}' was removed`);
      return;
    }
    if (value.value1 === undefined && value.value2 !== undefined) {
      if (_.isObject(value.value2)) {
        console.log(`Property '${path}${key}' was added with value: [complex value]`);
      } else {
        const addedValue = typeof value.value2 === 'string' ? `'${value.value2}'` : value.value2;
        console.log(`Property '${path}${key}' was added with value: ${addedValue}`);
      }
    }
  });
};

export default plain;
