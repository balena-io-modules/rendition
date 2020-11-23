import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Divider, DividerProps } from '.';

export default {
	title: 'Core/Divider',
	component: Divider,
} as Meta;

const Template = createTemplate<DividerProps>(Divider);

export const Default = createStory<DividerProps>(Template, {});
export const WithCustomColor = createStory<DividerProps>(Template, {
	color: '#ccc',
});

export const Dashed = createStory<DividerProps>(Template, {
	type: 'dashed',
});

export const WithTextContent = createStory<DividerProps>(Template, {
	type: 'dashed',
	children: 'some text',
});
