
export const isGettextFuncCall = (names, node) => (
  node.callee.object
    ? names.indexOf(node.callee.property.name) !== -1
    : names.indexOf(node.callee.name) !== -1
);

export const isGettextComponent = (names, node) => 
  node && node.name && names.indexOf(node.name.name) !== -1;

export const getFuncName = node =>
  (node.callee.object ? node.callee.property.name : node.callee.name);

export const getStringFromTemplateLiteral = (node) => {
  if (
    node.type === 'TemplateLiteral' &&
    node.quasis !== undefined &&
    node.quasis.length > 0
  ) {
    const textNode = node.quasis[0];
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
export const getGettextStringFromNodeArgument = arg => {
  if (arg.type === 'JSXAttribute') {
    return getGettextStringFromNodeArgument(arg.value);
  }
  if (arg.type === 'JSXExpressionContainer') {
    return getGettextStringFromNodeArgument(arg.expression);
  }
  if (arg.type === 'BinaryExpression') {
    if (arg.operator === '+') {
      const left = getGettextStringFromNodeArgument(arg.left);
      const right = getGettextStringFromNodeArgument(arg.right);
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
