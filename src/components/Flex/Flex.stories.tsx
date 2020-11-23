import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Flex, FlexProps } from '.';
import { Box } from '../..';

export default {
	title: 'Core/Flex',
	component: Flex,
} as Meta;

const Template = createTemplate<FlexProps>(Flex);

export const Default = createStory<FlexProps>(Template, {
	children: (
		<>
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
		</>
	),
});

export const Justified = createStory<FlexProps>(Template, {
	justifyContent: 'space-between',
	children: (
		<>
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
		</>
	),
});

export const ColumnDirection = createStory<FlexProps>(Template, {
	flexDirection: 'column',
	children: (
		<>
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
		</>
	),
});

export const Wrap = createStory<FlexProps>(Template, {
	flexWrap: 'wrap',
	children: (
		<>
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
		</>
	),
});

export const FlexOnChildren = createStory<FlexProps>(Template, {
	flexWrap: 'wrap',
	children: (
		<>
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="red" />
			<Box style={{ height: 200, width: 200 }} flex="1" bg="red" />
			<Box style={{ height: 200, width: 200 }} bg="blue" />
			<Box style={{ height: 200, width: 200 }} bg="green" />
		</>
	),
});
