
export const isGettextFuncCall = (names, node) => (
  node.callee.object
    ? names.indexOf(node.callee.property.name) !== -1
    : names.indexOf(node.callee.name) !== -1
);

export const isGettextComponent = (names, node) =>
  names.indexOf(node.name.name) !== -1;

export const getFuncName = node =>
  (node.callee.object ? node.callee.property.name : node.callee.name);

/**
 * Returns a raw string from som JSX attributes or call
 * expression arguments.
 */
export const getGettextStringFromNodeArgument = arg => {
  if (arg.type === 'JSXAttribute') {
    return getGettextStringFromNodeArgument(arg.value);
  }
  if (arg.type === 'JSXExpressionContainer') {
    return getGettextStringFromNodeArgument(arg.expression);
  }
  if (arg.type === 'TemplateLiteral') {
    return arg.quasis[0].value.raw;
  }
  if (arg.type === 'StringLiteral') {
    return arg.value;
  }

  return null;
};
