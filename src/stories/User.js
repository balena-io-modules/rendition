import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { User } from '../index';

storiesOf('User', module)
  .add('Default view', () => (
    <User.Container>
      <User.Icon id='123456'/>
      <User.Info>
        <h3>Craig Mulligan</h3>
        <p>Last seen today at 1:45pm</p>
      </User.Info>
    </User.Container>
  ))
  .add('Rounded square icon', () => (
    <User.Container>
      <User.Icon id='55555' borderRadius='rounded'/>
      <User.Info>
        <h3>Jack Brown</h3>
        <p>Last seen today at 1:45pm</p>
      </User.Info>
    </User.Container>
  ))
  .add('Small circle icon, with name only', () => (
    <User.Container>
      <User.Icon size={50} id='55555' borderRadius='rounded-circle'/>
      <User.Info>
        <h3>Jack Brown</h3>
      </User.Info>
    </User.Container>
  ))
  .add('Small circle icon, name only, no border', () => (
    <User.Container>
      <User.Icon size={50} id='55555' border={false} borderRadius='rounded-circle'/>
      <User.Info>
        <h5>Jack Brown</h5>
      </User.Info>
    </User.Container>
  ));
