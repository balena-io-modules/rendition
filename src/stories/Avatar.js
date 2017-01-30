import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Avatar } from '../index';

storiesOf('Avatar', module)
  .add('Default view', () => {
    return <Avatar id="12345"/>;
  }).add('Custom size', () => {
    return <Avatar id="12345" size={30} />;
  }).add('No border', () => {
    return <Avatar id="12345" border={false} />;
  }).add('Square', () => {
    return <Avatar id="12345" borderRadius={0} />;
  }).add('Image', () => {
    return <Avatar size={50} src="http://openplus.ca/images/photo.jpg" />;
  });
