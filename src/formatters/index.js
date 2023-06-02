import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const getFormattedOutput = (difference, formatName) => {
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

export default getFormattedOutput;
