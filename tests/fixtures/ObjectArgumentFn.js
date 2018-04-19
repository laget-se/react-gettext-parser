
import React from 'react';
import { translate } from 'gettext-lib';

const ObjectArgumentFn = () =>
  <div>
    {translate(null, 123, {
      message: 'Wow',
      messagePlural: 'Wows',
      context: 'amazement',
      comment: 'Be astonished',
    }, 'someArgument')}
  </div>;

export default ObjectArgumentFn;
