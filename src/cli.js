
import path from 'path';
import colors from 'colors';

import { parseGlob } from './parse';

const args = require('yargs')
  .usage('react-gettext-parser <options> glob [, glob, ...]')
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
  .option('trim', {
    type: 'boolean',
    description: 'Trims extracted strings from surrounding whitespace',
  })
  .option('trim-lines', {
    type: 'boolean',
    description: 'Trims each line in extracted strings from surrounding whitespace',
  })
  .option('trim-newlines', {
    type: 'boolean',
    description: 'Trims extracted strings from new-lines',
  })
  .argv;

const filesGlob = args._;

let opts = {
  output: args.output,
  trim: args.trim,
  trimLines: args['trim-lines'],
  trimNewlines: args['trim-newlines'],
};

if (args.config) {
  const configs = require(path.join(process.cwd(), args.config));
  opts = { ...opts, ...configs };
}

parseGlob(filesGlob, opts);
