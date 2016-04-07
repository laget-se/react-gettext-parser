#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var glob = require('glob');

var args = require('yargs')
  .help('h')
  .alias('h', 'help')
  .option('t', {
    alias: 'target',
    description: 'Target filename',
  })
  .option('c', {
    alias: 'config',
    description: 'Path to a react-gettext-parser config file'
  })
  .argv;

var reactGettextParser = require('../lib/index.js');

var filesGlob = args._[0];
var opts = { target: args.target };

if (args.config) {
  var configs = require(path.join(process.cwd(), args.config));
  opts = Object.assign({}, opts, configs);
}

glob(filesGlob, function(err, files) {
  var allMessages = [];

  files.forEach(function(file) {
    var code = fs.readFileSync(file, 'utf8');

    const fileOpts = Object.assign({}, opts, {
      filename: file
    });

    var messages = reactGettextParser.getMessages(code, fileOpts);

    allMessages = allMessages.concat(messages);
  });

  var mergedMessages = reactGettextParser.getUniqueMessages(allMessages);
  var potContents = reactGettextParser.toPot(mergedMessages);
  reactGettextParser.outputPot(opts.target, potContents);
});
