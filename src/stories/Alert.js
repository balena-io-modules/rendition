import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Alert } from '../index';

storiesOf('Alert', module)
.addWithInfo('Standard', () => {
  return (
    <div>
      <p>Static</p>
      <Alert type="success" title="Great!">This is a success</Alert>
      <Alert type="danger" title="Darn!">This is an alert message</Alert>
      <Alert type="warning" title="Warning!">This is an alert message</Alert>
      <Alert type="info" title="Hey!">This is a general resin announcement</Alert>

      <p>Dismissable</p>
      <Alert dismissable type="success" title="Great!">This is a success</Alert>
      <Alert dismissable type="danger" title="Darn!">This is an alert message</Alert>
      <Alert dismissable type="warning" title="Warning!">This is an alert message</Alert>
      <Alert dismissable type="info" title="Hey!">This is a general resin announcement</Alert>
    </div>
  );
})
.addWithInfo('Emphasized', () => {
  return (
    <div>
      <p>Static</p>
      <Alert emphasized type="success">Great! This is a success</Alert>
      <Alert emphasized type="danger">Darn! This is an alert message</Alert>
      <Alert emphasized type="warning">Warning! This is an alert message</Alert>
      <Alert emphasized type="info">Hey! This is a general resin announcement</Alert>

      <p>Dismissable</p>
      <Alert emphasized dismissable type="success">Great! This is a success</Alert>
      <Alert emphasized dismissable type="danger">Darn! This is an alert message</Alert>
      <Alert emphasized dismissable type="warning">Warning! This is an alert message</Alert>
      <Alert emphasized dismissable type="info">Hey! This is a general resin announcement</Alert>
    </div>
  );
});
