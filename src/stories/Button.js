import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Button } from '../index';

const unicorn = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/DomenichinounicornPalFarnese.jpg/1920px-DomenichinounicornPalFarnese.jpg';

storiesOf('Button', module)
.addWithInfo('Standard', () => {
  return (
    <div>
      <Button btnStyle="primary">primary</Button>
      <Button btnStyle="secondary">secondary</Button>
      <Button btnStyle="dark">dark</Button>
      <Button btnStyle="light">light</Button>
      <Button btnStyle="danger">danger</Button>
    </div>
  );
})
.addWithInfo('Emphasized', () => {
  return (
    <div>
      <Button emphasized btnStyle="primary">primary</Button>
      <Button emphasized btnStyle="secondary">secondary</Button>
      <Button emphasized btnStyle="dark">dark</Button>
      <Button emphasized btnStyle="light">light</Button>
      <Button emphasized btnStyle="danger">danger</Button>
    </div>
  );
})
.addWithInfo('Disabled', () => {
  return (
    <div>
      <Button disabled btnStyle="primary">primary</Button>
      <Button disabled btnStyle="secondary">secondary</Button>
      <Button disabled btnStyle="dark">dark</Button>
      <Button disabled btnStyle="light">light</Button>
      <Button disabled btnStyle="danger">danger</Button>
    </div>
  );
})
.addWithInfo('Link', () => {
  return (
    <div>
      <Button target="_blank" href={unicorn} btnStyle="primary">primary</Button>
      <Button target="_blank" href={unicorn} btnStyle="secondary">secondary</Button>
      <Button target="_blank" href={unicorn} btnStyle="dark">dark</Button>
      <Button target="_blank" href={unicorn} btnStyle="light">light</Button>
      <Button target="_blank" href={unicorn} btnStyle="danger">danger</Button>
    </div>
  );
});
