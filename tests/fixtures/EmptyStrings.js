import React from 'react';
import { GetText, gt } from 'gettext-lib';

const MergeB = () =>
  <div>
    <GetText message="" messagePlural="" />
    <GetText message="" messagePlural="non-empty plural" count={2} context="context" />

    {gt.gettext('')}
    {gt.ngettext('', '', 2)}
    {gt.ngettext('', '', 2)}
    {gt.ngettext('', 'non-empty plural', 2)}
    {gt.pgettext('context', '')}
    {gt.npgettext('context', '', '', 2)}
    {gt.npgettext('context', '', 'non-empty plural', 2)}
    {gt.dgettext('domain', '')}
    {gt.dpgettext('domain', 'context', '')}
    {gt.dnpgettext('domain', 'context', '', '', 2)}
    {gt.dnpgettext('domain', 'context', '', 'non-empty plural', 2)}
  </div>;

export default MergeB;
