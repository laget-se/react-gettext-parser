
import fs from 'fs';
import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import curry from 'lodash.curry';

import { GETTEXT_FUNC_ARGS_MAP, GETTEXT_COMPONENT_PROPS_MAP, BABEL_PARSING_OPTS } from './defaults';
import { isGettextFuncCall, isGettextComponent } from './node-helpers';
import { mergeObjects, concatProp, uniquePropValue } from './utils';

/**
 * Returns a gettext message given a mapping of args to gettext props and
 * a CallExpression node
 */
export const getGettextMessageFromFuncCall = (argsMap, node) => {
  const mappedArgs = argsMap[node.callee.name];

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
    .reduce((props, attr) => ({ ...props, [attr.name.name]: attr.value.value }), {});

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
export const getTraverser = (cb = () => {}, opts = {}) => {
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

export const getTree = (code) =>
  babylon.parse(code, BABEL_PARSING_OPTS);

export const parse = (code, opts = {}, cb = () => {}) => {
  const ast = getTree(code.toString('utf8'));
  const traverser = getTraverser(cb, opts);

  traverse(ast, traverser);
};

export const parseFile = (file, opts = {}, cb = () => {}) =>
  parse(fs.readFileSync(file, 'utf8'), opts, cb);
