/* eslint react/prop-types: 0 */
import React from 'react';
import { GetText, npgettext } from 'gettext-lib';

export const Comp = ({ value }) =>
  <div>
    <GetText
      message={'Value is: {{ value }}'}
      messagePlural={'Values are: {{ value }}'}
      scope={{ value }}
      comment={'Comment'}
      context={'context'}
    />

  </div>;
