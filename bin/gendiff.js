#!/usr/bin/env node
import { Command } from 'commander';
import { genDiff } from '../src/funcs.js';

const program = new Command();

program
  .name('gendiff-util')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2, options) => {
    genDiff(filepath1, filepath2, options.format);
  });

program.parse();
