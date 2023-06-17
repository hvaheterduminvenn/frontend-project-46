import stylish from './stylish.js';
import plain from './plain.js';

const getFormattedOutput = (difference, formatName) => {
  switch (formatName) {
    case 'stylish': {
      return stylish(difference);
    }
    case 'plain': {
      return plain(difference);
    }
    case 'json': {
      return JSON.stringify(difference, null, 2);
    }
    default:
      break;
  }

  return undefined;
};

export default getFormattedOutput;
