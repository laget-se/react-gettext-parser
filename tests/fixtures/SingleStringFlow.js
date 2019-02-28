// @flow
import { gettext } from 'gettext-lib';

const SOME_CONSTANT: number = 123;

const SimpleString = (): string =>
  gettext('Translate me');

export default SimpleString;
