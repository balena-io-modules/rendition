import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { TextWithCopy, TextWithCopyProps } from '.';

export default {
	title: 'Core/TextWithCopy',
	component: TextWithCopy,
} as Meta;

const Template = createTemplate<TextWithCopyProps>(TextWithCopy);
export const Default = createStory<TextWithCopyProps>(Template, {
	copy: 'This value has been copied to your clipboard!',
	children: (
		<>
			<i>hover</i> & <b>click</b> the icon
		</>
	),
});

export const AlwaysShow = createStory<TextWithCopyProps>(Template, {
	showCopyButton: 'always',
	children: 'Click the icon',
});

export const Code = createStory<TextWithCopyProps>(Template, {
	code: true,
	copy: 'This value has been copied to your clipboard!',
	children: '3555432',
});
