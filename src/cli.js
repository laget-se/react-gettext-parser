
import path from 'path';
import colors from 'colors';

import { parseGlob } from './parse';

const args = require('yargs')
  .help('h')
  .alias('h', 'help')
  .option('o', {
    alias: 'output',
    description: 'Path to output .pot file',
  })
  .option('c', {
    alias: 'config',
    description: 'Path to a react-gettext-parser config file',
  })
  .argv;

const filesGlob = args._[0];
let opts = { output: args.output };

if (args.config) {
  const configs = require(path.join(process.cwd(), args.config));
  opts = { ...opts, ...configs };
}

parseGlob(filesGlob, opts);
