import React from 'react';
import { GetText, npgettext } from 'gettext-lib';

export const Comp = ({ value, separator }) =>
  <div>
    <GetText
      message={`Value is: {{ value }}`}
      messagePlural={`Values are: {{ value }}`}
      scope={{ value }}
      comment={`Comment`}
      context={`context`}
    />

    {npgettext(`context`, `One thing`, `Many things`)}
  </div>;
