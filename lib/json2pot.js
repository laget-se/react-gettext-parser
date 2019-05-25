"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPot = void 0;

var _gettextParser = require("gettext-parser");

var _lodash = _interopRequireDefault(require("lodash.groupby"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Creates a gettext-parser/node-gettext compatible JSON PO(T)
 * structure from a list of gettext blocks.
 */
var createTranslationsTable = function createTranslationsTable(blocks) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var translations = (0, _lodash.default)(blocks, function (b) {
    return b.msgctx || '';
  }); // Hack
  // TODO: Explain this gettext-parser thingy

  translations[''] = translations[''] || {};
  translations[''][''] = {
    msgid: '',
    msgstr: ['']
  };
  return {
    charset: headers.charset || 'utf-8',
    headers: {
      'content-type': headers['content-type'] || 'text/plain; charset=utf-8',
      'pot-creation-date': " ",
      'content-transfer-encoding': headers['content-transfer-encoding'] || '8bit',
      'plural-forms': headers['plural-forms'] || 'nplurals=2; plural=(n != 1);'
    },
    translations: translations
  };
};

var convertReferenceToString = function convertReferenceToString(reference) {
  return "".concat(reference.filename, ":").concat(reference.line);
};

var convertCommentArraysToStrings = function convertCommentArraysToStrings(blocks) {
  return blocks.map(function (b) {
    return _objectSpread({}, b, {
      comments: {
        reference: b.comments.reference.map(function (ref) {
          return convertReferenceToString(ref);
        }).join('\n'),
        extracted: b.comments.extracted.join('\n')
      }
    });
  });
};

var toPot = function toPot(blocks) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parsedBlocks = convertCommentArraysToStrings(blocks);
  var potJson = createTranslationsTable(parsedBlocks); // Allow the consumer to transform headers

  var transformHeaders = opts.transformHeaders ? opts.transformHeaders : function (x) {
    return x;
  };

  var transformedPotJson = _objectSpread({}, potJson, {
    headers: transformHeaders(potJson.headers)
  });

  var pot = _gettextParser.po.compile(transformedPotJson);

  return pot.toString();
};

exports.toPot = toPot;