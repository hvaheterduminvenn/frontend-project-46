#!/usr/bin/env node
import { Command } from 'commander';
import { getDifference, getFileData } from '../src/funcs.js';

const program = new Command();

const output = (data, spaces) => {
  if (data.length === 2) {
    if (typeof data[0] === 'string') {
      if (!Array.isArray(data[1])) {
        console.log(`${' '.repeat(spaces)}${data[0]}: ${data[1]}`);
        return;
      }
      if (Array.isArray(data[1])) {
        console.log(`${' '.repeat(spaces)}${data[0]}: {`);
        output(data[1], spaces + 2);
        console.log(`${' '.repeat(spaces + 2)}}`);
        return;
      }
    }
  }

  data.forEach((el) => {
    if (Array.isArray(el)) {
      output(el, spaces + 2);
    } else {
      console.log(`${' '.repeat(spaces)}${el}: `);
    }
  });
};

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
    output(difference, 0);
    console.log('}');
  });

program.parse();
