import React from 'react';
import { gettext } from 'gettext-lib';
import { loggable } from 'some-decorators';

@loggable
class DecoratoredComponent {
  render() {
    return (
      <div>
        { gettext('Decorate me') }
      </div>
    );
  }
}

export default DecoratoredComponent;
