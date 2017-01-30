import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Button } from '../index';

storiesOf('Button', module)
  .add('Default view', () => {
    return <Button>Default Button</Button>;
  })
  .add('secondary, info, success, warning', () => {
    return (
      <div>
        <Button type="secondary">secondary</Button>
        <Button type="info">info</Button>
        <Button type="success">success</Button>
        <Button type="warning">warning</Button>
      </div>
    )
  })
  .add('Disabled', () => {
    return <Button disabled>You cant click me</Button>;
  })
