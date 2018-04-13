
import React from 'react';
import { GetText, npgettext } from 'gettext-lib';

const DuplicatedStrings = () =>
  <div>
    <div>
      <GetText message="I'm occur twice" />
    </div>
    <GetText message="I'm occur twice" />
  </div>;

export default DuplicatedStrings;
