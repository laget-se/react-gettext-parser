"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGettextStringFromNodeArgument = exports.getStringFromTemplateLiteral = exports.getFuncName = exports.isGettextComponent = exports.isGettextFuncCall = void 0;

var isGettextFuncCall = function isGettextFuncCall(names, node) {
  return node.callee.object ? names.indexOf(node.callee.property.name) !== -1 : names.indexOf(node.callee.name) !== -1;
};

exports.isGettextFuncCall = isGettextFuncCall;

var isGettextComponent = function isGettextComponent(names, node) {
  // If it's not a JSXOpeningElement, it cannot be a GettextComponent.
  // Without this check, the last return statment can throw an exception.
  if (!node || node.type !== 'JSXOpeningElement') {
    return false;
  }

  return names.indexOf(node.name.name) !== -1;
};

exports.isGettextComponent = isGettextComponent;

var getFuncName = function getFuncName(node) {
  return node.callee.object ? node.callee.property.name : node.callee.name;
};

exports.getFuncName = getFuncName;

var getStringFromTemplateLiteral = function getStringFromTemplateLiteral(node) {
  if (node.type === 'TemplateLiteral' && node.quasis !== undefined && node.quasis.length > 0) {
    var textNode = node.quasis[0];

    if (textNode.type === 'TemplateElement') {
      return textNode.value.raw;
    }
  }

  return null;
};
/**
 * Returns a raw string from some JSX attributes or call
 * expression arguments.
 */


exports.getStringFromTemplateLiteral = getStringFromTemplateLiteral;

var getGettextStringFromNodeArgument = function getGettextStringFromNodeArgument(arg) {
  if (arg.type === 'JSXAttribute') {
    return getGettextStringFromNodeArgument(arg.value);
  }

  if (arg.type === 'JSXExpressionContainer') {
    return getGettextStringFromNodeArgument(arg.expression);
  }

  if (arg.type === 'BinaryExpression') {
    if (arg.operator === '+') {
      var left = getGettextStringFromNodeArgument(arg.left);
      var right = getGettextStringFromNodeArgument(arg.right);
      if (left && right) return left + right;
    }
  }

  if (arg.type === 'TemplateLiteral') {
    return getStringFromTemplateLiteral(arg);
  }

  if (arg.type === 'StringLiteral') {
    return arg.value;
  }

  return null;
};

exports.getGettextStringFromNodeArgument = getGettextStringFromNodeArgument;