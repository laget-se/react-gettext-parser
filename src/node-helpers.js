
export const isGettextFuncCall = (names, node) => (
  node.callee.object
    ? names.indexOf(node.callee.property.name) !== -1
    : names.indexOf(node.callee.name) !== -1
);

export const isGettextComponent = (names, node) =>
  names.indexOf(node.name.name) !== -1;

export const getFuncName = node =>
  (node.callee.object ? node.callee.property.name : node.callee.name);

export const getJSXAttributeValue = attr =>
  (attr.value.expression ? attr.value.expression.value : attr.value.value);
