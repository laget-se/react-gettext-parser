import { gettext } from 'gettext-lib';

const someObject = {
  just: {}
};

const OptionalChaining = () => {
  const usage = someObject.just?.to.test.optionalChaining;
  gettext('Optional chaining works');
};

export default OptionalChaining;
