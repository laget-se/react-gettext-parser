import React from 'react';
import { GetText, gettext } from 'gettext-lib';

// This is a unique key word in typescript, we use this to test the parser
type T = {
  readonly key: string
}

const SimpleString = () =>
  <div>
    <GetText message="Translate me" />
  </div>;

export default SimpleString;
