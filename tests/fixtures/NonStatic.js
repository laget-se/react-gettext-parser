import React from 'react';
import { GetText, gt } from 'gettext-lib';

const messageString = 'Translate me';
const messageFunction = () => 'Translate me';
const MessageComponent = () => <div>Translate me</div>;


const NonStatic = () =>
  <div>
    <GetText message={messageString} messagePlural="" />
    <GetText message={messageString} messagePlural="non-empty plural" count={2} context="context" />

    <GetText message={messageFunction()} messagePlural="" />
    <GetText message={messageFunction()} messagePlural="non-empty plural" count={2} context="context" />

    <GetText message={<MessageComponent />} messagePlural="" />
    <GetText message={<MessageComponent />} messagePlural="non-empty plural" count={2} context="context" />

    {gt.gettext(messageString)}
    {gt.ngettext(messageString, messageString, 2)}
    {gt.ngettext(messageString, messageString, 2)}
    {gt.ngettext(messageString, 'non-empty plural', 2)}
    {gt.pgettext('context', messageString)}
    {gt.npgettext('context', messageString, messageString, 2)}
    {gt.npgettext('context', messageString, 'non-empty plural', 2)}
    {gt.dgettext('domain', messageString)}
    {gt.dpgettext('domain', 'context', messageString)}
    {gt.dnpgettext('domain', 'context', messageString, messageString, 2)}
    {gt.dnpgettext('domain', 'context', messageString, 'non-empty plural', 2)}

    {gt.gettext(messageFunction())}
    {gt.ngettext(messageFunction(), messageFunction(), 2)}
    {gt.ngettext(messageFunction(), messageFunction(), 2)}
    {gt.ngettext(messageFunction(), 'non-empty plural', 2)}
    {gt.pgettext('context', messageFunction())}
    {gt.npgettext('context', messageFunction(), messageFunction(), 2)}
    {gt.npgettext('context', messageFunction(), 'non-empty plural', 2)}
    {gt.dgettext('domain', messageFunction())}
    {gt.dpgettext('domain', 'context', messageFunction())}
    {gt.dnpgettext('domain', 'context', messageFunction(), messageFunction(), 2)}
    {gt.dnpgettext('domain', 'context', messageFunction(), 'non-empty plural', 2)}

    {gt.gettext(<MessageComponent />)}
    {gt.ngettext(<MessageComponent />, <MessageComponent />, 2)}
    {gt.ngettext(<MessageComponent />, <MessageComponent />, 2)}
    {gt.ngettext(<MessageComponent />, 'non-empty plural', 2)}
    {gt.pgettext('context', <MessageComponent />)}
    {gt.npgettext('context', <MessageComponent />, <MessageComponent />, 2)}
    {gt.npgettext('context', <MessageComponent />, 'non-empty plural', 2)}
    {gt.dgettext('domain', <MessageComponent />)}
    {gt.dpgettext('domain', 'context', <MessageComponent />)}
    {gt.dnpgettext('domain', 'context', <MessageComponent />, <MessageComponent />, 2)}
    {gt.dnpgettext('domain', 'context', <MessageComponent />, 'non-empty plural', 2)}
  </div>;

export default NonStatic;
