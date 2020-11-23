import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Checkbox, CheckboxProps } from './';

export default {
	title: 'Core/Checkbox',
	component: Checkbox,
} as Meta;

const Template = createTemplate<CheckboxProps>(Checkbox);

export const Default = createStory<CheckboxProps>(Template, {});

export const WithLabel = createStory<CheckboxProps>(Template, {
	label: 'Checkbox',
});

export const ReversedLabel = createStory<CheckboxProps>(Template, {
	label: 'Checkbox',
	reverse: true,
});

export const Disabled = createStory<CheckboxProps>(Template, {
	label: 'Checkbox',
	disabled: true,
});

export const Toggle = createStory<CheckboxProps>(Template, {
	label: 'Toggle',
	toggle: true,
});
