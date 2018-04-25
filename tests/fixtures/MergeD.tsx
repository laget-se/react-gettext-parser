import React from 'react';
import { GetText, gettext } from 'gettext-lib';

// This is a unique key word in typescript, we use this to test the parser
type T = {
  readonly key: string
}

const MergeD = ()=>
  <div>
    { gettext("I'm both here and elsewhere") }
  </div>;

export default MergeD;
