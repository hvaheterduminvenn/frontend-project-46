import {
  getFilePathAndExtension,
  readFile,
  getFileData,
  getDifference,
} from './funcs.js';
import { stylish, plain, json } from './formatters/index.js';

const genDiff = (enteredFilePath1, enteredFilePath2, formatName = 'stylish') => {
  const { path: filepath1, extension: extension1 } = getFilePathAndExtension(enteredFilePath1);
  const { path: filepath2, extension: extension2 } = getFilePathAndExtension(enteredFilePath2);

  const file1Content = readFile(filepath1);
  const file2Content = readFile(filepath2);

  const file1data = getFileData(file1Content, extension1);
  const file2data = getFileData(file2Content, extension2);

  const difference = getDifference(file1data, file2data);
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

export default genDiff;
