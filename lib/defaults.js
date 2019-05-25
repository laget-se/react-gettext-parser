"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BABEL_PARSING_OPTS = exports.GETTEXT_COMPONENT_PROPS_MAP = exports.GETTEXT_FUNC_ARGS_MAP = void 0;
// Default mappings between function arguments and their corresponding
// .pot keys
var GETTEXT_FUNC_ARGS_MAP = {
  gettext: ['msgid'],
  dgettext: [null, 'msgid'],
  ngettext: ['msgid', 'msgid_plural'],
  dngettext: [null, 'msgid', 'msgid_plural'],
  pgettext: ['msgctxt', 'msgid'],
  dpgettext: [null, 'msgctxt', 'msgid'],
  npgettext: ['msgctxt', 'msgid', 'msgid_plural'],
  dnpgettext: [null, 'msgctxt', 'msgid', 'msgid_plural']
}; // Default mappings between gettext components' attributes and their
// corresponding .pot keys

exports.GETTEXT_FUNC_ARGS_MAP = GETTEXT_FUNC_ARGS_MAP;
var GETTEXT_COMPONENT_PROPS_MAP = {
  GetText: {
    message: 'msgid',
    messagePlural: 'msgid_plural',
    context: 'msgctxt',
    comment: 'comment'
  }
}; // Default parsing options

exports.GETTEXT_COMPONENT_PROPS_MAP = GETTEXT_COMPONENT_PROPS_MAP;
var BABEL_PARSING_OPTS = {
  sourceType: 'module',
  plugins: ['jsx', 'asyncFunctions', 'classConstructorCall', 'doExpressions', 'trailingFunctionCommas', 'objectRestSpread', 'decorators-legacy', 'classProperties', 'exportExtensions', 'exportDefaultFrom', 'exportNamespaceFrom', 'exponentiationOperator', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport']
};
exports.BABEL_PARSING_OPTS = BABEL_PARSING_OPTS;