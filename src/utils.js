
import curry from 'lodash.curry';
import uniq from 'lodash.uniq';

export const mergeObjects = curry((a, b) => ({ ...a, ...b }));

export const concatProp = curry((prop, a, b) => ({
  ...a,
  [prop]: a[prop].concat(b[prop]),
}));

export const uniquePropValue = curry((prop, obj) => ({
  ...obj,
  [prop]: uniq(obj[prop]),
}));

