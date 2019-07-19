import React from 'react';
import { gettext } from 'gettext-lib';

const FragmentShortComponent = () => (
  <>
    { gettext('Fragment short syntax') }: {'foo'}
  </>
);

export default FragmentShortComponent;
