import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Button, Box, Txt } from '../../';
import { Spinner, SpinnerProps } from '.';

export default {
	title: 'Core/Spinner',
	component: Spinner,
} as Meta;

const Template = createTemplate<SpinnerProps>(Spinner);

export const Default = createStory<SpinnerProps>(Template, {});

export const Emphasized = createStory<SpinnerProps>(Template, {
	emphasized: true,
});

export const WithLabel = createStory<SpinnerProps>(Template, {
	label: 'Spinning...',
});

export const WithComponentLabel = createStory<SpinnerProps>(Template, {
	label: (
		<Txt color="text.main">
			Building image <Button plain>12345</Button>...
		</Txt>
	),
});

export const WithChildren = createStory<SpinnerProps>(Template, {
	label: 'Spinning...',
	children: (
		<Box p={5} style={{ backgroundColor: '#f8f9fd' }}>
			Spinning, the wrapped children are made opaque
		</Box>
	),
});
