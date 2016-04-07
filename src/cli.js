
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import colors from 'colors';

import { extractMessages, getUniqueMessages } from './parse';
import { toPot } from './json2pot';
import { outputPot } from './io';

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

glob(filesGlob, (err, files) => {
  let allMessages = [];

  if (err) {
    console.log('An error occured while fetching list of files:'.red, err);
    process.exit(1);
  }

  files.forEach(file => {
    const code = fs.readFileSync(file, 'utf8');
    const fileOpts = {
      ...opts,
      filename: file,
    };
    const messages = extractMessages(code, fileOpts);
    allMessages = [...messages];
  });

  const mergedMessages = getUniqueMessages(allMessages);
  const potContents = toPot(mergedMessages);
  outputPot(opts.target, potContents, () => {
    console.log('Done!');
  });
});
