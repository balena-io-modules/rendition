import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Textarea, TextareaProps } from '.';

export default {
	title: 'Core/Textarea',
	component: Textarea,
} as Meta;

const Template = createTemplate<TextareaProps>(Textarea);
export const Default = createStory<TextareaProps>(Template, {});

export const WithPlaceholder = createStory<TextareaProps>(Template, {
	placeholder: 'Type something...',
});
export const Monospace = createStory<TextareaProps>(Template, {
	placeholder: 'Type something...',
	monospace: true,
});
export const Disabled = createStory<TextareaProps>(Template, {
	disabled: true,
});
export const ReadOnly = createStory<TextareaProps>(Template, {
	readOnly: true,
});
export const AutoRows = createStory<TextareaProps>(Template, {
	autoRows: true,
});
export const MinMaxRows = createStory<TextareaProps>(Template, {
	minRows: 4,
	maxRows: 8,
});
