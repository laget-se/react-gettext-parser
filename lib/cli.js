"use strict";

var _path = _interopRequireDefault(require("path"));

var _colors = _interopRequireDefault(require("colors"));

var _parse = require("./parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var args = require('yargs').usage('react-gettext-parser <options> glob [, glob, ...]').help('h').alias('h', 'help').option('o', {
  alias: 'output',
  description: 'Path to output .pot file'
}).option('c', {
  alias: 'config',
  description: 'Path to a react-gettext-parser config file'
}).option('trim', {
  type: 'boolean',
  description: 'Trims extracted strings from surrounding whitespace'
}).option('trim-lines', {
  type: 'boolean',
  description: 'Trims each line in extracted strings from surrounding whitespace'
}).option('trim-newlines', {
  type: 'boolean',
  description: 'Trims extracted strings from new-lines'
}).argv;

var filesGlob = args._;
var opts = {
  output: args.output,
  trim: args.trim,
  trimLines: args['trim-lines'],
  trimNewlines: args['trim-newlines']
};

if (args.config) {
  var configs = require(_path.default.join(process.cwd(), args.config));

  opts = _objectSpread({}, opts, configs);
}

(0, _parse.parseGlob)(filesGlob, opts);