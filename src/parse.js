
import fs from 'fs';
import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import uniq from 'lodash.uniq';

import { GETTEXT_FUNC_ARGS_MAP, GETTEXT_COMPONENT_PROPS_MAP, BABEL_PARSING_OPTS } from './defaults';
import { toPot } from './json2po';
import { isGettextFuncCall, isGettextComponent } from './node-helpers';
import { outputPot } from './io';

export const getGettextMessageFromFuncCall = (argsMap, node) => {
  const mappedArgs = argsMap[node.callee.name];

  return mappedArgs
    .map((arg, i) => (arg ? { [arg]: node.arguments[i].value } : null))
    .filter(x => x)
    .reduce((values, argValue) => ({ ...values, ...argValue }), {});
};

export const getGettextPropValues = (propsMap, node) => {
  const mappedProps = Object.keys(propsMap[node.name.name]);

  return node.attributes
    .filter(attr => mappedProps.indexOf(attr.name.name) !== -1)
    .reduce((props, attr) => ({ ...props, [attr.name.name]: attr.value.value }), {});
};

export const getGettextMessageFromPropValues = (propsMap, componentName, propValues) =>
  Object.keys(propValues)
    .reduce((message, propName) => ({
      ...message,
      [propsMap[componentName][propName]]: propValues[propName],
    }), {});

export const areMessagesEqual = (a, b) =>
  (a.msgid === b.msgid && a.msgid_plural === b.msgid_plural && a.context === b.context);

export const getMergedMessages = (a, b) => ({
  ...a,
  sources: uniq(a.sources.concat(b.sources)),
});

export const getUniqueMessages = messages =>
  messages.reduce((unique, message) => {
    const existingMessages = unique.filter(x => areMessagesEqual(x, message));

    return existingMessages.length > 0
      ? unique.map(x => (
        areMessagesEqual(x, existingMessages[0])
          ? getMergedMessages(x, existingMessages[0])
          : x
      ))
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

      exit() {
        cb(getUniqueMessages(messages));
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

        const propValues = getGettextPropValues(propsMap, node);
        const message = getGettextMessageFromPropValues(propsMap, node.name.name, propValues);

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

export const getTree = (code, opts = {}) =>
  babylon.parse(code, BABEL_PARSING_OPTS);

export const parse = (code, opts = {}, cb = () => {}) => {
  console.log('COOODE', code);

  const ast = getTree(code.toString('utf8'), opts);
  const traverser = getTraverser((messages) => {
    const potContents = toPot(messages);
    outputPot(opts.target, potContents, cb);
  }, opts);

  traverse(ast, traverser);
};

export const parseFile = (file, opts = {}, cb = () => {}) =>
  fs.readFile(file, 'utf8', (err, contents) => {
    if (err) {
      console.log(err);
      return;
    }

    parse(contents, opts, cb);
  });
