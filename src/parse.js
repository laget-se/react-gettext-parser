
import fs from 'fs';
import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import curry from 'lodash.curry';
import glob from 'glob';

import { GETTEXT_FUNC_ARGS_MAP, GETTEXT_COMPONENT_PROPS_MAP, BABEL_PARSING_OPTS } from './defaults';
import { outputPot } from './io';
import { toPot } from './json2pot';
import { isGettextFuncCall, isGettextComponent, getFuncName, getJSXAttributeValue } from './node-helpers';
import { mergeObjects, concatProp, uniquePropValue } from './utils';

const noop = () => {};

/**
 * Returns a gettext message given a mapping of args to gettext props and
 * a CallExpression node
 */
export const getGettextMessageFromFuncCall = (argsMap, node) => {
  const mappedArgs = argsMap[getFuncName(node)];

  return mappedArgs
    .map((arg, i) => (arg ? { [arg]: node.arguments[i].value } : null))
    .filter(x => x)
    .reduce(mergeObjects(), {});
};

/**
 * Returns a gettext message given a mapping of component props to gettext
 * props and a JSXOpeningElement node
 */
export const getGettextMessageFromComponent = (propsMap, node) => {
  const componentPropsLookup = propsMap[node.name.name];
  const gettextPropNames = Object.keys(componentPropsLookup);

  const propValues = node.attributes
    .filter(attr => gettextPropNames.indexOf(attr.name.name) !== -1)
    .reduce((props, attr) => ({ ...props, [attr.name.name]: getJSXAttributeValue(attr) }), {});

  return Object.keys(propValues)
    .reduce((message, propName) => ({
      ...message,
      [componentPropsLookup[propName]]: propValues[propName],
    }), {});
};

/**
 * Returns whether two gettext messages are considered equal
 */
export const areMessagesEqual = curry((a, b) =>
  (a.msgid === b.msgid && a.msgid_plural === b.msgid_plural && a.context === b.context)
);

// Helpers
const concatSources = concatProp('sources');
const uniqueSources = uniquePropValue('sources');

/**
 * Takes a list of messages and returns a list with unique ones with the merged
 * messages concatenated
 */
export const getUniqueMessages = messages =>
  messages.reduce((unique, message) => {
    const isEqualMessage = areMessagesEqual(message);
    const existingMessage = unique.filter(x => isEqualMessage(x)).shift();

    return existingMessage
      ? unique.map(x => (isEqualMessage(x) ? uniqueSources(concatSources(x, message)) : x))
      : unique.concat(message);
  }, []);

/**
 * Traverser
 */
export const getTraverser = (cb = noop, opts = {}) => {
  const messages = [];

  return {
    Program: {
      enter(path, state = {}) {
        state.opts = {
          ...state.opts,
          ...opts,
          filename: state.file ? state.file.opts.filename : opts.filename,
        };
      },

      exit(path, state = {}) {
        cb(getUniqueMessages(messages), { opts: (state.opts || opts) });
      },
    },

    /**
     * React gettext components
     */
    JSXOpeningElement: {
      enter(path, state = {}) {
        const { node } = path;
        const envOpts = state.opts || opts;
        const propsMap = envOpts.componentPropsMap || GETTEXT_COMPONENT_PROPS_MAP;

        if (isGettextComponent(Object.keys(propsMap), node) === false) {
          return;
        }

        const message = getGettextMessageFromComponent(propsMap, node);

        if (envOpts.filename) {
          message.sources = [`${envOpts.filename}:${node.loc.start.line}`];
        }

        messages.push(message);
      },
    },

    /**
     * Gettext function calls
     */
    CallExpression: {
      enter(path, state = {}) {
        const { node } = path;
        const envOpts = state.opts || opts;

        const funcArgsMap = envOpts.funcArgumentsMap || GETTEXT_FUNC_ARGS_MAP;
        const funcNames = Object.keys(funcArgsMap);

        if (isGettextFuncCall(funcNames, node) === false) {
          return;
        }

        const message = getGettextMessageFromFuncCall(funcArgsMap, node);

        if (envOpts.filename) {
          message.sources = [`${envOpts.filename}:${node.loc.start.line}`];
        }

        messages.push(message);
      },
    },
  };
};

/**
 * Parses and returns extracted messages from a js contents
 */
export const extractMessages = (code, opts = {}) => {
  let messages = [];

  const ast = babylon.parse(code.toString('utf8'), BABEL_PARSING_OPTS);
  const traverser = getTraverser(_messages => {
    messages = _messages;
  }, opts);

  traverse(ast, traverser);

  return messages;
};

/**
 * Parses and returns extracted messages from a file at a given path
 */
export const extractMessagesFromFile = (file, opts = {}) =>
  extractMessages(fs.readFileSync(file, 'utf8'), {
    ...opts,
    filename: file,
  });

/**
 * Parses and returns extracted messages from all files matching a glob
 */
export const extractMessagesFromGlob = (globStr, opts = {}) => {
  const messages = glob.sync(globStr)
    .reduce((all, file) => all.concat(extractMessagesFromFile(file, opts)), []);

  return getUniqueMessages(messages);
};

/**
 * Parses a string for gettext messages and writes them to a .pot file
 */
export const parse = (code, opts = {}, cb = noop) => {
  const messages = extractMessages(code);
  outputPot(opts.target, toPot(messages), cb);
};

/**
 * Parses a file at a given path for gettext messages and writes them
 * to a .pot file
 */
export const parseFile = (file, opts = {}, cb = noop) =>
  parse(fs.readFileSync(file, 'utf8'), opts, cb);

/**
 * Parses all files matching a glob and extract messages from all of them,
 * then writing them to a .pot file
 */
export const parseGlob = (globStr, opts = {}, cb = noop) =>
  outputPot(opts.target, toPot(extractMessagesFromGlob(globStr, opts)), cb);
