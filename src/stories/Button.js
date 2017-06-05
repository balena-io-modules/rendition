import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Button } from '../index';

storiesOf('Button', module)
.addWithInfo('Standard', () => {
  return (
    <div className="buttonContainer">
      <Button color="primary">primary</Button>
      <Button color="secondary">secondary</Button>
      <Button color="tertiary">tertiary</Button>
      <Button color="success">success</Button>
      <Button color="info">info</Button>
      <Button color="warning">warning</Button>
      <Button color="danger">danger</Button>
    </div>
  );
})
.addWithInfo('Outline', () => {
  return (
    <div className="buttonContainer">
      <Button outline color="primary">primary</Button>
      <Button outline color="secondary">secondary</Button>
      <Button outline color="tertiary">tertiary</Button>
      <Button outline color="success">success</Button>
      <Button outline color="info">info</Button>
      <Button outline color="warning">warning</Button>
      <Button outline color="danger">danger</Button>
    </div>
  );
})
.addWithInfo('Disabled', () => {
  return (
    <div className="buttonContainer">
      <Button disabled color="primary">primary</Button>
      <Button disabled color="secondary">secondary</Button>
      <Button disabled color="tertiary">tertiary</Button>
      <Button disabled color="success">success</Button>
      <Button disabled color="info">info</Button>
      <Button disabled color="warning">warning</Button>
      <Button disabled color="danger">danger</Button>
    </div>
  );
})
.addWithInfo('Large', () => {
  return (
    <div className="buttonContainer">
      <Button color="primary" size="lg">Large Button</Button>
      <Button color="secondary" size="lg">Large Button</Button>
      <Button color="tertiary" size="lg">Large Button</Button>
    </div>
  );
})
.addWithInfo('Small', () => {
  return (
    <div className="buttonContainer">
      <Button color="primary" size="sm">Small Button</Button>
      <Button color="secondary" size="sm">Small Button</Button>
      <Button color="tertiary" size="sm">Small Button</Button>
    </div>
  );
});
