import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Alert, UncontrolledAlert } from '../index';

storiesOf('Alert', module)
.addWithInfo('Standard', () => {
  return (
    <div>
      <Alert color="success">
        <strong>Well done!</strong> You successfully read this important alert message.
      </Alert>
      <Alert color="info">
        <strong>Heads up!</strong> This alert needs your attention, but not super important.
      </Alert>
      <Alert color="warning">
        <strong>Warning!</strong> Better check yourself, you are not looking too good.
      </Alert>
      <Alert color="danger">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
      </Alert>
    </div>
  );
})
.addWithInfo('Inverse', () => {
  return (
    <div>
      <Alert inverse color="success">
        <strong>Well done!</strong> You successfully read this important alert message.
      </Alert>
      <Alert inverse color="info">
        <strong>Heads up!</strong> This alert needs your attention, but not super important.
      </Alert>
      <Alert inverse color="warning">
        <strong>Warning!</strong> Better check yourself, you are not looking too good.
      </Alert>
      <Alert inverse color="danger">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
      </Alert>
    </div>
  );
})
.addWithInfo('Dismissable', () => {
  return (
    <div>
      <UncontrolledAlert inverse color="success">
        <strong>Well done!</strong> You successfully read this important alert message.
      </UncontrolledAlert>
      <UncontrolledAlert color="danger">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
      </UncontrolledAlert>
      <UncontrolledAlert inverse color="warning">
        <strong>Warning!</strong> Better check yourself, you are not looking too good.
      </UncontrolledAlert>
      <UncontrolledAlert color="info">
        <strong>Heads up!</strong> This alert needs your attention, but not super important.
      </UncontrolledAlert>
    </div>
  );
})
.addWithInfo('Small', () => {
  return (
    <div>
      <UncontrolledAlert inverse size="sm" color="success">
        <strong>Well done!</strong> You successfully read this important alert message.
      </UncontrolledAlert>
      <UncontrolledAlert size="sm" color="danger">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
      </UncontrolledAlert>
      <UncontrolledAlert inverse size="sm" color="warning">
        <strong>Warning!</strong> Better check yourself, you are not looking too good.
      </UncontrolledAlert>
      <UncontrolledAlert size="sm" color="info">
        <strong>Heads up!</strong> This alert needs your attention, but not super important.
      </UncontrolledAlert>
    </div>
  );
})
.addWithInfo('Large', () => {
  return (
    <div>
      <UncontrolledAlert inverse size="lg" color="success">
        <strong>Well done!</strong> You successfully read this important alert message.
      </UncontrolledAlert>
      <UncontrolledAlert size="lg" color="danger">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
      </UncontrolledAlert>
      <UncontrolledAlert inverse size="lg" color="warning">
        <strong>Warning!</strong> Better check yourself, you are not looking too good.
      </UncontrolledAlert>
      <UncontrolledAlert size="lg" color="info">
        <strong>Heads up!</strong> This alert needs your attention, but not super important.
      </UncontrolledAlert>
    </div>
  );
});
