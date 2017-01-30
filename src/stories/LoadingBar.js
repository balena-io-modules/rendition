import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { LoadingBar } from '../index';

storiesOf('LoadingBar', module)
  .addWithInfo('Default view', () => {
    return <LoadingBar />;
  })
  .addWithInfo('Custom Colors', () => {
    return <LoadingBar colors={[ '#A6CFD5', '#7F96FF', '#FFE8E1' ]}/>;
  });
