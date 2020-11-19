import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { RadioButton, RadioButtonProps } from '.';

export default {
	title: 'Core/RadioButton',
	component: RadioButton,
} as Meta;

const Template = createTemplate<RadioButtonProps>(RadioButton);

export const Default = createStory<RadioButtonProps>(Template, {
	label: 'Radio button',
});

export const Checked = createStory<RadioButtonProps>(Template, {
	label: 'Radio button',
	checked: true,
});

export const Disabled = createStory<RadioButtonProps>(Template, {
	label: 'Radio button',
	disabled: true,
});
