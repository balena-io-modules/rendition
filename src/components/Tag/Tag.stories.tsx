import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Tag, TagProps } from '.';

export default {
	title: 'Core/Tag',
	component: Tag,
	// args: {
	// 	onClick: null,
	// 	onClose: null,
	// },
} as Meta;

const Template = createTemplate<TagProps>(Tag);
export const Default = createStory<TagProps>(Template, {
	name: 'Tag',
	value: 'Value',
});

export const OnlyValue = createStory<TagProps>(Template, {
	value: 'Value',
});

export const OnlyName = createStory<TagProps>(Template, {
	value: 'Name',
});

export const Empty = createStory<TagProps>(Template, {});

export const MultipleValues = createStory<TagProps>(Template, {
	multiple: [
		{ name: 'Tag1', operator: 'contains', value: 'value1' },
		{
			prefix: 'or',
			name: 'Tag2',
			operator: 'contains',
			value: 'value2',
		},
	],
});

export const Clickable = createStory<TagProps>(Template, {
	name: 'Tag',
	value: 'Value',
	onClick: () => null,
});

export const Closable = createStory<TagProps>(Template, {
	name: 'Tag',
	value: 'Value',
	onClose: () => null,
});
