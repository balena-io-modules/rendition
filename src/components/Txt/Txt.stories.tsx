import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Txt, TxtProps } from '.';

export default {
	title: 'Core/Txt',
	component: Txt,
} as Meta;

const Template = createTemplate<TxtProps>(Txt);
const SpanTemplate = createTemplate<TxtProps>(Txt.span);
export const Default = createStory<TxtProps>(Template, {
	children: 'Standard',
});

export const Styled = createStory<TxtProps>(Template, {
	children: 'Styled text',
	bold: true,
	italic: true,
	monospace: true,
});

export const InColor = createStory<TxtProps>(Template, {
	children: 'Colored text',
	color: 'blue',
});

export const SpanComponent = createStory<TxtProps>(SpanTemplate, {
	children: 'Space   is   preserved',
	whitespace: 'pre',
});
