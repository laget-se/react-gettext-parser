
import React from 'react';
import { GetText } from 'gettext-lib';

const JsxValueStrings = () =>
  <div>
    <GetText>{'I\'m inside curly braces'}</GetText>
    <GetText>{`I'm inside backticks inside curly braces`}</GetText>
  </div>;

export default JsxValueStrings;
