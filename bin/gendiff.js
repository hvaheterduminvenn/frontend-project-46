#!/usr/bin/env node
import { Command } from 'commander';
import { getDifference, getFileData } from '../src/funcs.js';

const program = new Command();

program
  .name('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    const file1data = getFileData(filepath1);
    const file2data = getFileData(filepath2);

    const difference = getDifference(file1data, file2data);

    console.log('{');
    difference.forEach((str) => {
      const outputStrArr = str.split(' ');
      let prefix = '   ';
      if (outputStrArr[2] === '1') {
        prefix = '  -';
      } else if (outputStrArr[2] === '2') {
        prefix = '  +';
      }
      console.log(`${prefix} ${outputStrArr[0]} ${outputStrArr[1]}`);
    });

    console.log('}');
  });

program.parse();
