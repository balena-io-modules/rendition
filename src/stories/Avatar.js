import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Avatar } from '../index';

storiesOf('Avatar', module)
  .addWithInfo('Default view', () => {
    return <Avatar id="12345"/>;
  }).addWithInfo('Custom size', () => {
    return <Avatar id="12345" size={30} />;
  }).addWithInfo('No border', () => {
    return <Avatar id="12345" border={false} />;
  }).addWithInfo('Square', () => {
    return <Avatar id="12345" borderRadius={0} />;
  }).addWithInfo('Image', () => {
    return <Avatar size={50} src="http://openplus.ca/images/photo.jpg" />;
  });
