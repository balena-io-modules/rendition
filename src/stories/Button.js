import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Button } from '../index';

storiesOf('Button', module)
  .addWithInfo('Default view', () => {
    return <Button>Default Button</Button>;
  })
  .addWithInfo('secondary, info, success, warning', () => {
    return (
      <div>
        <Button type="secondary">secondary</Button>
        <Button type="info">info</Button>
        <Button type="success">success</Button>
        <Button type="warning">warning</Button>
      </div>
    )
  })
  .addWithInfo('Disabled', () => {
    return <Button disabled>You cant click me</Button>;
  })
