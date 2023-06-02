import fs from 'fs';
import {
  getFilePathAndType,
  getFileData,
  getDifference,
} from './funcs.js';
import getFormattedOutput from './formatters/index.js';

const genDiff = (enteredFilePath1, enteredFilePath2, formatName = 'stylish') => {
  const { filePath: filePath1, fileType: fileType1 } = getFilePathAndType(enteredFilePath1);
  const { filePath: filePath2, fileType: fileType2 } = getFilePathAndType(enteredFilePath2);

  const file1Content = fs.readFileSync(filePath1, { encoding: 'utf8', flag: 'r' });
  const file2Content = fs.readFileSync(filePath2, { encoding: 'utf8', flag: 'r' });

  const file1data = getFileData(file1Content, fileType1);
  const file2data = getFileData(file2Content, fileType2);

  const difference = getDifference(file1data, file2data, 'root');
  return getFormattedOutput(difference, formatName);
};

export default genDiff;
