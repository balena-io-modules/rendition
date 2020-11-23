import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { ArcSlider, ArcSliderProps } from '.';

export default {
	title: 'Core/ArcSlider',
	component: ArcSlider,
	argTypes: {
		fillColor: { control: 'color' },
		background: { control: 'color' },
	},
	decorators: [
		(Story) => (
			<div style={{ width: 400, height: 400 }}>
				<Story />
			</div>
		),
	],
} as Meta;

const Template = createTemplate<ArcSliderProps>(ArcSlider);

export const Default = createStory<ArcSliderProps>(Template, {});

export const CustomFill = createStory<ArcSliderProps>(Template, {
	fillColor: '#ff0000',
});

export const CustomBackground = createStory<ArcSliderProps>(Template, {
	background: '#ff0000',
});

export const WithLabel = createStory<ArcSliderProps>(Template, {
	children: <h2>A label</h2>,
});
