import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Input, InputProps } from '.';

export default {
	title: 'Core/Input',
	component: Input,
} as Meta;

const Template = createTemplate<InputProps>(Input);

export const Default = createStory<InputProps>(Template, {});
export const WithPlaceholder = createStory<InputProps>(Template, {
	placeholder: 'This is a placeholder',
});

export const Emphasized = createStory<InputProps>(Template, {
	emphasized: true,
});

export const Monospace = createStory<InputProps>(Template, {
	monospace: true,
});
