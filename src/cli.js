
import path from 'path';
import colors from 'colors';

import { parseGlob } from './parse';

const args = require('yargs')
  .help('h')
  .alias('h', 'help')
  .option('t', {
    alias: 'target',
    description: 'Path to target .pot file',
  })
  .option('c', {
    alias: 'config',
    description: 'Path to a react-gettext-parser config file',
  })
  .argv;

const filesGlob = args._[0];
let opts = { target: args.target };

if (args.config) {
  const configs = require(path.join(process.cwd(), args.config));
  opts = { ...opts, ...configs };
}

parseGlob(filesGlob, opts);
