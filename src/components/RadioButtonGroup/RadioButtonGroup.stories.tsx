import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { RadioButton } from '../..';
import { RadioButtonGroup, RadioButtonGroupProps } from '.';

export default {
	title: 'Core/RadioButtonGroup',
	component: RadioButtonGroup,
	subcomponents: { RadioButton },
} as Meta;

const Template = createTemplate<RadioButtonGroupProps>(RadioButtonGroup);

export const Default = createStory<RadioButtonGroupProps>(Template, {
	options: ['plain 1', 'plain 2'],
	value: 'plain 1',
});

export const WithExpandedOptions = createStory<RadioButtonGroupProps>(
	Template,
	{
		options: [
			{ disabled: true, value: 'disabled', label: 'disabled' },
			{ disabled: false, value: 'enabled', label: 'enabled' },
			{ disabled: false, value: 'selected', label: 'selected' },
		],
		value: 'selected',
	},
);
