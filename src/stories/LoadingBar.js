import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { LoadingBar } from '../index';

storiesOf('LoadingBar', module)
  .add('Default view', () => {
    return <LoadingBar />;
  })
  .add('Custom Colors', () => {
    return <LoadingBar colors={[ 'red', 'purple', 'yellow' ]}/>;
  });
