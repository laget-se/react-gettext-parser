"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gulp = void 0;

var _path = _interopRequireDefault(require("path"));

var _through = _interopRequireDefault(require("through2"));

var _gulpUtil = require("gulp-util");

var _colors = _interopRequireDefault(require("colors"));

var _json2pot = require("./json2pot");

var _parse = require("./parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GULP_OPTS = {
  output: 'messages.pot'
};

var gulp = function gulp() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var allMessages = [];

  var options = _objectSpread({}, GULP_OPTS, opts);

  function read(file, enc, cb) {
    console.log(Object.keys(file));
    console.log(file.history);

    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new _gulpUtil.PluginError('gulp-react-gettext-parser', 'Streams not supported'));
    }

    if (file.isBuffer()) {
      var messages = (0, _parse.extractMessages)(file._contents.toString('utf8'), _objectSpread({}, options, {
        filename: _path.default.relative(process.cwd(), file.history[0])
      }));
      allMessages = allMessages.concat(messages);
      return cb();
    }

    return cb();
  }

  function write(cb) {
    allMessages = (0, _parse.getUniqueBlocks)(allMessages);
    var potFile = new _gulpUtil.File({
      base: process.cwd(),
      path: options.output,
      contents: new Buffer((0, _json2pot.toPot)(allMessages))
    });
    this.push(potFile);
    console.log("Writing .pot file to ".concat(options.output).green);
    cb();
  }

  return _through.default.obj(read, write);
};

exports.gulp = gulp;