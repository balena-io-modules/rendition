import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Input } from '../index';

storiesOf('Input', module)
.addWithInfo('Default view', () => {
  return <Input />;
})
.addWithInfo('password', () => {
  return <Input type="password" placeholder="Password" />;
});
