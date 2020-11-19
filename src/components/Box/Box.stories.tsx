import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Box, BoxProps } from '.';
import { Txt } from '../Txt';

export default {
	title: 'Core/Box',
	component: Box,
} as Meta;

const Template = createTemplate<BoxProps>(Box);

export const Default = createStory<BoxProps>(Template, {
	children: <Txt>I'm in a Box!</Txt>,
});
