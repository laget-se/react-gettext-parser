import { gettext } from 'gettext-lib';

// This is a unique key word in typescript, we use this to test the parser
type T = {
  readonly key: string
}

const SimpleString = () =>
    { return gettext("Translate me") };

export default SimpleString;
