import React, { Fragment } from 'react';
import { gettext } from 'gettext-lib';

const FragmentShortComponent = () => (
  <>
    { gettext('Fragment short syntax') }
    some unrelated text
  </>
);

export default FragmentShortComponent;
