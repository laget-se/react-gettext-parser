"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseGlob = exports.parseFile = exports.parse = exports.extractMessagesFromGlob = exports.extractMessagesFromFile = exports.extractMessages = exports.getTraverser = exports.getUniqueBlocks = exports.areBlocksEqual = exports.JAVASCRIPT = exports.TYPESCRIPT = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var parser = _interopRequireWildcard(require("@babel/parser"));

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _lodash = _interopRequireDefault(require("lodash.curry"));

var _lodash2 = _interopRequireDefault(require("lodash.uniq"));

var _globAll = _interopRequireDefault(require("glob-all"));

var _defaults = require("./defaults");

var _io = require("./io");

var _json2pot = require("./json2pot");

var _nodeHelpers = require("./node-helpers");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

var TYPESCRIPT = 'TYPESCRIPT';
exports.TYPESCRIPT = TYPESCRIPT;
var JAVASCRIPT = 'JAVASCRIPT';
exports.JAVASCRIPT = JAVASCRIPT;

var getEmptyBlock = function getEmptyBlock() {
  return {
    msgctxt: '',
    msgid: null,
    msgstr: [''],
    comments: {
      reference: [],
      extracted: []
    }
  };
};

var getBabelParsingOptions = function getBabelParsingOptions(sourceType) {
  if (sourceType === TYPESCRIPT) {
    return _objectSpread({}, _defaults.BABEL_PARSING_OPTS, {
      plugins: ['typescript'].concat(_defaults.BABEL_PARSING_OPTS.plugins)
    });
  }

  return _objectSpread({}, _defaults.BABEL_PARSING_OPTS, {
    plugins: ['flow'].concat(_defaults.BABEL_PARSING_OPTS.plugins)
  });
};
/**
 * Returns a gettext block given a mapping of component props to gettext
 * props and a JSXOpeningElement node
 */


var getGettextBlockFromComponent = function getGettextBlockFromComponent(propsMap, node) {
  var componentPropsLookup = propsMap[node.name.name];
  var gettextPropNames = Object.keys(componentPropsLookup);
  var propValues = node.attributes.filter(function (attr) {
    return gettextPropNames.indexOf(attr.name.name) !== -1;
  }).reduce(function (props, attr) {
    return _objectSpread({}, props, _defineProperty({}, attr.name.name, (0, _nodeHelpers.getGettextStringFromNodeArgument)(attr)));
  }, {});
  var block = Object.keys(propValues).reduce(function (currBlock, propName) {
    var gettextVar = componentPropsLookup[propName];
    var value = propValues[propName];

    if (gettextVar === 'msgid') {
      currBlock.msgid = value;
    } else if (gettextVar === 'msgid_plural') {
      currBlock.msgid_plural = value;
      currBlock.msgstr = ['', ''];
    } else if (gettextVar === 'msgctxt') {
      currBlock.msgctxt = value;
    } else if (gettextVar === 'comment') {
      currBlock.comments.extracted.push(value);
    }

    return currBlock;
  }, getEmptyBlock());
  return block;
};
/**
 * Returns whether two gettext blocks are considered equal
 */


var areBlocksEqual = (0, _lodash.default)(function (a, b) {
  return a.msgid === b.msgid && a.msgctxt === b.msgctxt;
});
/**
 * Returns whether two gettext reference comment are considered equal
 */

exports.areBlocksEqual = areBlocksEqual;
var areReferencesEqual = (0, _lodash.default)(function (a, b) {
  return a.filename === b.filename && a.line === b.line && a.column === b.column;
});

var compareReference = function compareReference(a, b) {
  if (a.filename === b.filename) {
    if (a.line === b.line) {
      return a.column - b.column;
    }

    return a.line - b.line;
  }

  return a.filename.localeCompare(b.filename);
};
/**
 * Returns a file path relative to the current working directory
 */


var getRelativeReferencePath = function getRelativeReferencePath(filepath) {
  if (typeof filepath === 'string') {
    return _path.default.relative(process.cwd(), _path.default.resolve(filepath));
  } // Return filepath as is (could be null och undefined or whatever)


  return filepath;
};
/**
 * Takes a list of blocks and returns a list with unique ones.
 * Translator comments and source code reference comments are
 * concatenated.
 */


var getUniqueBlocks = function getUniqueBlocks(blocks) {
  return blocks.filter(function (x) {
    return x.msgid && x.msgid.trim();
  }).reduce(function (unique, block) {
    var isEqualBlock = areBlocksEqual(block);
    var existingBlock = unique.filter(function (x) {
      return isEqualBlock(x);
    }).shift();

    if (existingBlock) {
      // Concatenate comments to translators
      if (block.comments.extracted.length > 0) {
        existingBlock.comments.extracted = (0, _lodash2.default)(existingBlock.comments.extracted.concat(block.comments.extracted));
      } // Concatenate source references


      if (block.comments.reference.length > 0) {
        existingBlock.comments.reference = (0, _lodash2.default)(existingBlock.comments.reference.concat(block.comments.reference), areReferencesEqual).sort(compareReference);
      } // Add plural id and overwrite msgstr


      if (block.msgid_plural) {
        existingBlock.msgid_plural = block.msgid_plural;
        existingBlock.msgstr = block.msgstr;
      }

      return unique.map(function (x) {
        return isEqualBlock(x) ? existingBlock : x;
      });
    }

    return unique.concat(block);
  }, []);
};
/**
 * Traverser
 *
 * The traverser is wrapped inside a function so that it can be used both
 * by passing options manually and as a babel plugin.
 *
 * Options contain component and function mappings, as well as an optional
 * filename, which is used to add source code reference comments to the
 * pot file.
 *
 * Traversers in Babel plugins retrieves plugin options as a `state` argument
 * to each visitor, hence the `state.opts || opts`.
 */


exports.getUniqueBlocks = getUniqueBlocks;

var getTraverser = function getTraverser() {
  var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var blocks = [];
  return {
    Program: {
      enter: function enter(astPath) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        state.opts = _objectSpread({}, state.opts, opts, {
          filename: getRelativeReferencePath(state.file ? state.file.opts.filename : opts.filename)
        });
      },
      exit: function exit(astPath) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        cb(getUniqueBlocks(blocks), {
          opts: state.opts || opts
        });
      }
    },

    /**
     * React gettext components, e.g.:
     *
     *  <GetText message="My string" comment="Some clarifying comment" />
     */
    JSXOpeningElement: {
      enter: function enter(astPath) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var node = astPath.node,
            parent = astPath.parent;
        var envOpts = state.opts || opts;
        var propsMap = envOpts.componentPropsMap || _defaults.GETTEXT_COMPONENT_PROPS_MAP;

        if ((0, _nodeHelpers.isGettextComponent)(Object.keys(propsMap), node) === false) {
          return;
        }

        if (parent.children.length > 0) {
          return;
        }

        var block = getGettextBlockFromComponent(propsMap, node);

        if (envOpts.filename) {
          block.comments.reference = [{
            filename: getRelativeReferencePath(envOpts.filename),
            line: node.loc.start.line,
            column: node.loc.start.column
          }];
        }

        blocks.push(block);
      }
    },

    /**
     * React component inline text, e.g.:
     *
     *  <GetText>My string</GetText>
     */
    JSXText: {
      enter: function enter(astPath) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var node = astPath.node,
            parent = astPath.parent;
        var envOpts = state.opts || opts;
        var propsMap = envOpts.componentPropsMap || _defaults.GETTEXT_COMPONENT_PROPS_MAP;

        if ((0, _nodeHelpers.isGettextComponent)(Object.keys(propsMap), parent.openingElement) === false) {
          return;
        }

        var block = getGettextBlockFromComponent(propsMap, parent.openingElement);
        block.msgid = node.value;

        if (envOpts.filename) {
          block.comments.reference = [{
            filename: getRelativeReferencePath(envOpts.filename),
            line: node.loc.start.line,
            column: node.loc.start.column
          }];
        }

        blocks.push(block);
      }
    },

    /**
     * JSX expressions, a.k.a. strings inside curly braces:
     *
     * <GetText>{'Phrase goes here'}</GetText>
     * <GetText>{`Text inside backticks`}</GetText>
     */
    JSXExpressionContainer: {
      enter: function enter(astPath) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var node = astPath.node,
            parent = astPath.parent;
        var envOpts = state.opts || opts;
        var propsMap = envOpts.componentPropsMap || _defaults.GETTEXT_COMPONENT_PROPS_MAP;

        if ((0, _nodeHelpers.isGettextComponent)(Object.keys(propsMap), parent.openingElement) === false) {
          return;
        }

        var value = (0, _nodeHelpers.getGettextStringFromNodeArgument)(node.expression);

        if (typeof value === 'string' && value.trim() !== '') {
          var block = getEmptyBlock();
          block.msgid = value;

          if (envOpts.filename) {
            block.comments.reference = [{
              filename: getRelativeReferencePath(envOpts.filename),
              line: node.loc.start.line,
              column: node.loc.start.column
            }];
          }

          blocks.push(block);
        }
      }
    },

    /**
     * Gettext function calls, e.g.:
     * ngettext('One item', '{{ count }} items');
     */
    CallExpression: {
      enter: function enter(astPath) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var node = astPath.node,
            parent = astPath.parent;
        var envOpts = state.opts || opts;
        var funcArgsMap = envOpts.funcArgumentsMap || _defaults.GETTEXT_FUNC_ARGS_MAP;
        var funcNames = Object.keys(funcArgsMap);

        if ((0, _nodeHelpers.isGettextFuncCall)(funcNames, node) === false) {
          return;
        }

        var mappedArgs = funcArgsMap[(0, _nodeHelpers.getFuncName)(node)];
        var block = mappedArgs.map(function (arg, i) {
          if (!arg || !node.arguments[i]) {
            return {};
          } // The argument maps directly to a gettext property


          if (typeof arg === 'string') {
            var stringValue = (0, _nodeHelpers.getGettextStringFromNodeArgument)(node.arguments[i]);
            return _defineProperty({}, arg, stringValue);
          } // The argument is an object mapping key names to gettext props


          return Object.keys(arg).reduce(function (acc, prop) {
            var gettextPropName = arg[prop];
            var matchingObjectValue = node.arguments[i].properties.find(function (x) {
              return x.key.name === prop;
            }).value.value;
            return gettextPropName === 'comment' ? _objectSpread({}, acc, {
              comments: {
                extracted: [matchingObjectValue]
              }
            }) : _objectSpread({}, acc, _defineProperty({}, gettextPropName, matchingObjectValue));
          }, {});
        }).reduce(function (a, b) {
          return _objectSpread({}, a, b);
        }, getEmptyBlock());

        if (block.msgid_plural) {
          block.msgstr = ['', ''];
        } // Extract comments for translators


        if (Array.isArray(parent.leadingComments) === true) {
          var translatorCommentRegex = /Translators:.+/;
          var commentNode = parent.leadingComments.find(function (x) {
            return translatorCommentRegex.test(x.value) === true;
          });

          if (commentNode !== undefined) {
            var commentLine = commentNode.value.split(/\n/).find(function (x) {
              return translatorCommentRegex.test(x);
            });

            if (commentLine !== undefined) {
              var comment = commentLine.replace(/^\s*\*/, '').replace(/Translators:/, '').trim();
              block.comments.extracted = [comment];
            }
          }
        }

        if (envOpts.filename) {
          block.comments.reference = [{
            filename: getRelativeReferencePath(envOpts.filename),
            line: node.loc.start.line,
            column: node.loc.start.column
          }];
        }

        blocks.push(block);
      }
    }
  };
};
/**
 * Parses and returns extracted gettext blocks from a js contents
 */


exports.getTraverser = getTraverser;

var extractMessages = function extractMessages(code) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var blocks = [];
  var ast = parser.parse(code.toString('utf8'), getBabelParsingOptions(opts.sourceType));
  var traverser = getTraverser(function (_blocks) {
    blocks = _blocks;
  }, opts);
  (0, _traverse.default)(ast, traverser); // Remove whitespace according to options

  if (opts.trim) {
    blocks = blocks.map(function (block) {
      return _objectSpread({}, block, {
        msgid: block.msgid.trim()
      });
    });
  }

  if (opts.trimLines) {
    blocks = blocks.map(function (block) {
      return _objectSpread({}, block, {
        msgid: block.msgid.split('\n').map(function (x) {
          return x.trim();
        }).filter(function (x) {
          return x;
        }).join('\n')
      });
    });
  }

  if (opts.trimNewlines) {
    var replaceValue = typeof opts.trimNewlines === 'string' ? opts.trimNewlines : '';
    blocks = blocks.map(function (block) {
      return _objectSpread({}, block, {
        msgid: block.msgid.replace(/\n/g, replaceValue)
      });
    });
  }

  return blocks;
};
/**
 * Parses and returns extracted gettext blocks from a file at a given path
 */


exports.extractMessages = extractMessages;

var extractMessagesFromFile = function extractMessagesFromFile(file) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return extractMessages(_fs.default.readFileSync(file, 'utf8'), _objectSpread({}, opts, {
    filename: file,
    sourceType: file.endsWith('.ts') || file.endsWith('.tsx') ? TYPESCRIPT : JAVASCRIPT
  }));
};
/**
 * Parses and returns extracted gettext blocks from all files matching a glob
 */


exports.extractMessagesFromFile = extractMessagesFromFile;

var extractMessagesFromGlob = function extractMessagesFromGlob(globArr) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var blocks = _globAll.default.sync(globArr).reduce(function (all, file) {
    return all.concat(extractMessagesFromFile(file, opts));
  }, []);

  return getUniqueBlocks(blocks);
};
/**
 * Parses a string for gettext blocks and writes them to a .pot file
 */


exports.extractMessagesFromGlob = extractMessagesFromGlob;

var parse = function parse(code) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var blocks = extractMessages(code, opts);
  (0, _io.outputPot)(opts.output, (0, _json2pot.toPot)(blocks, {
    transformHeaders: opts.transformHeaders
  }), cb);
};
/**
 * Parses a file at a given path for gettext blocks and writes them
 * to a .pot file
 */


exports.parse = parse;

var parseFile = function parseFile(file) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var blocks = extractMessagesFromFile(file, opts);
  (0, _io.outputPot)(opts.output, (0, _json2pot.toPot)(blocks, {
    transformHeaders: opts.transformHeaders
  }), cb);
};
/**
 * Parses all files matching a glob and extract blocks from all of them,
 * then writing them to a .pot file
 */


exports.parseFile = parseFile;

var parseGlob = function parseGlob(globArr) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var blocks = extractMessagesFromGlob(globArr, opts);
  (0, _io.outputPot)(opts.output, (0, _json2pot.toPot)(blocks, {
    transformHeaders: opts.transformHeaders
  }), cb);
};

exports.parseGlob = parseGlob;