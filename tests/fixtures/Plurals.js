/* eslint react/prop-types: 0 */
import React from 'react';
import { GetText, ngettext } from 'gettext-lib';

const ItemCount = ({ numItems }) =>
  <div>
    { ngettext('One item', '{{ count }} items', numItems) }
    <GetText message="Go to item" messagePlural="Go to items" count={numItems} />
  </div>;

export default ItemCount;
