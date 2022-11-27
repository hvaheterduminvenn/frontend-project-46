#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  // .argument('<filepath1>', 'file #1 path')
  // .argument('<filepath2>', 'file #2 path')
  .version('0.1.0')
  .option('-f, --format <type>', 'output format');

program.parse();
