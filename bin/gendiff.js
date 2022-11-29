#!/usr/bin/env node
import fs from 'fs';
import { cwd } from 'process';
import { dirname, resolve } from 'path';
import { Command } from 'commander';
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
    const output = [];

    try {
      const path1 = resolve(filepath1);
      const file1dataStr = fs.readFileSync(path1, {encoding:'utf8', flag:'r'});
      file1data = JSON.parse(file1dataStr);
    } catch (err) {
      console.error(err.message);
    }

    try {
      const path2 = resolve(filepath2);
      const file2dataStr = fs.readFileSync(path2, {encoding:'utf8', flag:'r'});
      file2data = JSON.parse(file2dataStr);
    } catch (err) {
      console.error(err.message);
    }

    for (const [key1, value1] of Object.entries(file1data)) {
      if (Object(file2data).hasOwnProperty(key1)) {
        if (value1 === file2data[key1]) {
          output.push(key1 + ': ' + value1 + ' 3');
        } else {
          output.push(key1 + ': ' + value1 + ' 1');
          output.push(key1 + ': ' + file2data[key1] + ' 2');
        }
        delete file2data[key1];
      } else {
        output.push(key1 + ': ' + value1 + ' 1');
      }
    }

    for (const [key2, value2] of Object.entries(file2data)) {
      output.push(key2 + ': ' + value2 + ' 2');
    }

    output.sort((a, b) => {
      const [keyA, , indexA] = a.split(' ');
      const [keyB, , indexB] = b.split(' ');

      if (keyA > keyB) {
        return 1;
      } else if (keyA < keyB) {
        return -1;
      } else if (indexA > indexB) {
        return 1;
      } else if (indexA < indexB) {
        return -1;
      }
    });

    console.log('{')
    for(const str of output) {
      const outputStrArr = str.split(' ');
      let prefix = '   ';
      if (outputStrArr[2] === '1') {
        prefix = '  -';
      } else if (outputStrArr[2] === '2') {
        prefix = '  +';
      }
      console.log(prefix + ' ' + outputStrArr[0] + ' ' + outputStrArr[1]);
    }
    console.log('}');
  });

program.parse();
