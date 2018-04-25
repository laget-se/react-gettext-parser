// Default mappings between function arguments and their corresponding
// .pot keys
export const GETTEXT_FUNC_ARGS_MAP = {
  gettext: ['msgid'],
  dgettext: [null, 'msgid'],
  ngettext: ['msgid', 'msgid_plural'],
  dngettext: [null, 'msgid', 'msgid_plural'],
  pgettext: ['msgctxt', 'msgid'],
  dpgettext: [null, 'msgctxt', 'msgid'],
  npgettext: ['msgctxt', 'msgid', 'msgid_plural'],
  dnpgettext: [null, 'msgctxt', 'msgid', 'msgid_plural'],
};

// Default mappings between gettext components' attributes and their
// corresponding .pot keys
export const GETTEXT_COMPONENT_PROPS_MAP = {
  GetText: {
    message: 'msgid',
    messagePlural: 'msgid_plural',
    context: 'msgctxt',
    comment: 'comment',
  },
};

// Default parsing options
export const BABEL_PARSING_OPTS = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'asyncFunctions',
    'classConstructorCall',
    'doExpressions',
    'trailingFunctionCommas',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportExtensions',
    'exponentiationOperator',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
  ],
};
