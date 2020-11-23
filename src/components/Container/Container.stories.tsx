import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Heading } from '../../';
import { Container, ContainerProps } from '.';

export default {
	title: 'Core/Container',
	component: Container,
} as Meta;

const Template = createTemplate<ContainerProps>(Container);

export const Default = createStory<ContainerProps>(Template, {
	children: <Heading>I am in a container</Heading>,
});

export const CenteredContent = createStory<ContainerProps>(Template, {
	children: <Heading>I am in a container</Heading>,
	textAlign: 'center',
});
