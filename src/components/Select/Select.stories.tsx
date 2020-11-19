import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Badge } from '../../';
import { Select, SelectProps } from '.';

export default {
	title: 'Core/Select',
	component: Select,
} as Meta;

const Template = createTemplate<SelectProps<any>>(Select);

export const Default = createStory<SelectProps<any>>(Template, {
	options: ['Option 1', 'Option 2', 'Option 3'],
});

export const WithPlaceholder = createStory<SelectProps<any>>(Template, {
	options: ['Option 1', 'Option 2', 'Option 3'],
	placeholder: 'Select one...',
});

export const WithCustomOption = createStory<SelectProps<any>>(Template, {
	value: 'Option 1',
	options: ['Option 1', 'Option 2', 'Option 3'],
	children: (option: any) => <Badge m={1}>{option}</Badge>,
});

export const Emphasized = createStory<SelectProps<any>>(Template, {
	value: 'Option 1',
	options: ['Option 1', 'Option 2', 'Option 3'],
	emphasized: true,
});
export const Invalid = createStory<SelectProps<any>>(Template, {
	value: 'Option 1',
	options: ['Option 1', 'Option 2', 'Option 3'],
	invalid: true,
});

export const ObjectOptions = createStory<SelectProps<any>>(Template, {
	options: [
		{ title: 'Object 1', value: '1' },
		{ title: 'Object 2', value: '2' },
		{ title: 'Object 3', value: '3' },
	],
	labelKey: 'title',
	valueKey: 'value',
	value: { title: 'Object 1', value: '1' },
});
