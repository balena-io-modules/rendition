import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Alert, AlertProps } from '.';
import { Link } from '../../';

export default {
	title: 'Core/Alert',
	component: Alert,
} as Meta;

const Template = createTemplate<AlertProps>(Alert);

export const Default = createStory<AlertProps>(Template, {
	success: true,
	children: 'This is a default alert',
});

export const Emphasized = createStory<AlertProps>(Template, {
	info: true,
	emphasized: true,
	children: 'This is an emphasized alert',
});

export const Plaintext = createStory<AlertProps>(Template, {
	info: true,
	plaintext: true,
	children: 'This is a plaintext alert',
});

export const WithoutPrefix = createStory<AlertProps>(Template, {
	success: true,
	// prefix: null,
	children: 'Without a prefix',
});

export const WithoutDismiss = createStory<AlertProps>(Template, {
	success: true,
	// prefix: null,
	children: 'Without a dismiss button',
	// onDismiss: null,
});

export const WithLink = createStory<AlertProps>(Template, {
	success: true,
	children: (
		<>
			With a <Link href="test">link</Link>
		</>
	),
	// onDismiss: null,
});
