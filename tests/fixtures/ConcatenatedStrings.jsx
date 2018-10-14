import React from 'react';
import { gettext, GetText } from 'gettext-lib';


export default function () {
  // foobar
  const a = gettext('foo' + 'bar');
  // my very long line
  const b = gettext('my ' +
                'very ' +
                'long ' +
                'line');
  // concatenation inside component
  return (
    <div>
      {a}
      {b}
      <GetText>{'concatenation ' + 'inside' + ' component'}</GetText>
      {gettext('test ' + 'string')}
      {gettext('should not be extracted' + 45)}
      {gettext('should not be extracted too' + 352 + 'string')}
      {gettext('concatenation with ' + `template literal`)}
    </div>
  );
}
