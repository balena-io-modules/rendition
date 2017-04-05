import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Button } from '../index';

storiesOf('Button', module)
.addWithInfo('Default view', () => {
  return <Button>Default test Button</Button>;
})
.addWithInfo('primary, secondary, dark, light', () => {
  return (
    <div>
      <Button btnStyle="primary">primary</Button>
      <Button btnStyle="secondary">secondary</Button>
      <Button btnStyle="dark">dark</Button>
      <Button btnStyle="light">light</Button>
    </div>
  );
})
.addWithInfo('Disabled', () => {
  return <Button disabled>You cant click me</Button>;
});
