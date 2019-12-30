import { gettext } from 'gettext-lib';

const someObject = {};

const NullishCoalescing = () => {
  const expressionUsingNullishCoalescing = someObject.something ?? 'defaultValue';
  gettext('Nullish coalescing works');
}

export default NullishCoalescing;
