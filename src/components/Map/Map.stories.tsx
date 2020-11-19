import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Map, MapProps } from '.';

const API_KEY = 'AIzaSyAvBsYt6MEiFwFTYfat3Doj5ED2OgbB6m0';

export default {
	title: 'Core/Map',
	component: Map,
	decorators: [
		(Story) => (
			<div style={{ height: 600 }}>
				<Story />
			</div>
		),
	],
} as Meta;

const Template = createTemplate<MapProps<any>>(Map);

export const Default = createStory<MapProps<any>>(Template, {
	data: [
		{
			id: 1,
			lat: 51.507,
			lng: 0.127,
			title: 'London',
		},
		{
			id: 2,
			lat: 52.366,
			lng: 4.89,
			title: 'Amsterdam',
		},
	],
	dataMap: {
		lat: (entry: any) => entry.lat,
		lng: 'lng',
		id: 'id',
		title: 'title',
	},
	apiKey: API_KEY,
});
