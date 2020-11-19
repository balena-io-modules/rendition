import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { DataGrid, DataGridProps } from '.';
import { Card, Txt } from '../..';

export default {
	title: 'Core/DataGrid',
	component: DataGrid,
} as Meta;

const Template = createTemplate<DataGridProps<number>>(DataGrid);

export const Default = createStory<DataGridProps<number>>(Template, {
	items: [1, 2, 3, 4, 5, 6],
	itemMinWidth: '320px',
	itemMaxWidth: '640px',
	getItemKey: (i: number) => i,
	renderItem: (i: number) => (
		<Card>
			<Txt fontSize={4} align="center">
				{i}
			</Txt>
		</Card>
	),
});
