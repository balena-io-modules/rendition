import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Box, Tag, Table, Txt } from '../..';
import { Copy, CopyProps } from '.';

const columns: any = [{ field: 'Name' }, { field: 'Value' }];
const data: any = [
	{ Name: 'Type', Value: 'Beginner' },
	{ Name: 'Type', Value: 'Advanced' },
];

export default {
	title: 'Core/Copy',
	component: Copy,
} as Meta;

const Template = createTemplate<CopyProps>(Copy);

export const Default = createStory<CopyProps>(Template, {
	content: 'Plain text',
	children: <Txt>Hover me and click on icon to copy</Txt>,
});

export const WithTag = createStory<CopyProps>(Template, {
	content: 'Beginner',
	children: <Tag name="Type" value="Beginner" />,
});

export const AlwaysShow = createStory<CopyProps>(Template, {
	content: JSON.stringify(data),
	children: <Table columns={columns} data={data} />,
});

export const IconOnly = createStory<CopyProps>(Template, {
	content: 'Hi there',
});

IconOnly.decorators = [
	(Story) => (
		<Box m={3}>
			Only copy icon that can be placed anywhere.
			<Story />
		</Box>
	),
];
