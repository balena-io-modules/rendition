import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { DropDownButton, DropDownButtonProps } from '.';

const sampleChildren = (
	<>
		<div>Item</div>
		<div>Item</div>
		<div>Item</div>
		<div>Item</div>
	</>
);

export default {
	title: 'Core/DropDownButton',
	component: DropDownButton,
} as Meta;

const Template = createTemplate<DropDownButtonProps>(DropDownButton);

export const Default = createStory<DropDownButtonProps>(Template, {
	label: 'Dropdown',
	children: sampleChildren,
});

export const BorderedList = createStory<DropDownButtonProps>(Template, {
	label: 'Dropdown',
	border: true,
	children: sampleChildren,
});

export const Joined = createStory<DropDownButtonProps>(Template, {
	label: 'Dropdown',
	joined: true,
	children: sampleChildren,
});

export const WithPrimaryButton = createStory<DropDownButtonProps>(Template, {
	label: 'Dropdown',
	joined: true,
	primary: true,
	children: sampleChildren,
});

export const IconOnly = createStory<DropDownButtonProps>(Template, {
	joined: true,
	primary: true,
	children: sampleChildren,
});

export const NoListFormatting = createStory<DropDownButtonProps>(Template, {
	noListFormat: true,
	primary: true,
	children: sampleChildren,
});
