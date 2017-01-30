import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Avatar } from '../index';

storiesOf('Avatar', module)
  .add('Default view', () => {
    return <Avatar />;
  }).add('Custom size', () => {
    return <Avatar size={30} />;
  }).add('No border', () => {
    return <Avatar border={false} />;
  }).add('Square', () => {
    return <Avatar borderRadius={0} />;
  });
