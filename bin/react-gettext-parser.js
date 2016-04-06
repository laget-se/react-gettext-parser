#!/usr/bin/env node

var fs = require('fs');
var glob = require('glob');

var args = require('yargs')
  .help('h')
  .alias('h', 'help')
  .option('t', {
    alias: 'target',
    description: 'Target filename',
  })
  .argv;

var reactGettextParser = require('../lib/index.js');

var filesGlob = args._[0];
var allCode = '';
var allMessages = [];
var opts = { target: args.target };

var traverser = reactGettextParser.getTraverser(function(messages, state) {
  allMessages = allMessages.concat(messages);

  reactGettextParser.outputPot(
    state.opts.target,
    reactGettextParser.toPot(allMessages)
  );
}, opts);

function parseFiles(files) {
  var file = files.shift();

  if (!file) {
    return;
  }
  else {
    reactGettextParser.parseFile(file, opts, function(messages, state) {
      reactGettextParser.outputPot(state.opts.target, reactGettextParser.toPot(messages), function() {
        parseFiles(files);
      });
    });
  }
}

glob(filesGlob, function(err, files) {
  parseFiles(files);
});
