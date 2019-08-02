"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputPot = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _colors = _interopRequireDefault(require("colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var outputPot = function outputPot(filePath, contents) {
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  if (filePath) {
    _fs.default.writeFileSync(filePath, contents);
  } else {
    console.log(contents);
  }

  console.log("Did write .pot contents to ".concat(filePath).green);
  cb();
};

exports.outputPot = outputPot;