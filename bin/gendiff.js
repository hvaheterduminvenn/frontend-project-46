#!/usr/bin/env node
import fs from 'fs';
import { resolve } from 'path';
import { Command } from 'commander';
import getDifference from '../src/funcs.js';

const program = new Command();

program
  .name('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    let file1data;
    let file2data;

    try {
      const path1 = resolve(filepath1);
      const file1dataStr = fs.readFileSync(path1, { encoding: 'utf8', flag: 'r' });
      file1data = JSON.parse(file1dataStr);
    } catch (err) {
      console.error(err.message);
      return;
    }

    try {
      const path2 = resolve(filepath2);
      const file2dataStr = fs.readFileSync(path2, { encoding: 'utf8', flag: 'r' });
      file2data = JSON.parse(file2dataStr);
    } catch (err) {
      console.error(err.message);
      return;
    }

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
