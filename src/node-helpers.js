
import curry from 'lodash.curry';

export const isGettextFuncCall = (names, node) =>
  names.indexOf(node.callee.name) !== -1;

export const isGettextComponent = (names, node) =>
  names.indexOf(node.name.name) !== -1;

