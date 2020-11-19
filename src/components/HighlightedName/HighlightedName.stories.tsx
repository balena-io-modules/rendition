import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { HighlightedName, HighlightedNameProps } from '.';

export default {
	title: 'Core/HighlightedName',
	component: HighlightedName,
} as Meta;

const Template = createTemplate<HighlightedNameProps>(HighlightedName);

export const Default = createStory<HighlightedNameProps>(Template, {
	children: 'Frontend Service',
});

export const WithCustomColors = createStory<HighlightedNameProps>(Template, {
	children: 'Frontend Service',
	bg: 'maroon',
	color: 'yellow',
});
