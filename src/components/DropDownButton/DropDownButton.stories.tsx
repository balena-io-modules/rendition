import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { DropDownButton, DropDownButtonProps } from '.';
import { Button, ButtonProps } from '../Button';
import { Box } from '../Box';
import { Divider } from '../Divider';

const NonZeroOrderedButton = (props: ButtonProps & { i: number }) => {
	if (!props.i) {
		return null;
	}
	return (
		<Button plain>
			{props.children ?? `Non-zero indexed item ${props.i}`}
		</Button>
	);
};

const OddIndexedButton = (props: ButtonProps & { i: number }) => {
	if (props.i % 2 === 0) {
		return null;
	}
	return (
		<NonZeroOrderedButton i={props.i}>
			Odd indexed item {props.i}
		</NonZeroOrderedButton>
	);
};

// This need to be an array, otherwise it would create
// a single DropDown item with all elements.
const sampleChildren = [
	<Button plain>Item</Button>,
	...[0, 1, 2, 3].map((i) => <NonZeroOrderedButton i={i} />),
	<Button plain>Item</Button>,
	<Divider />,
	<Button plain>Item</Button>,
	...[0, 1, 2, 3].map((i) => <OddIndexedButton i={i} />),
	<Button plain>Item</Button>,
];

export default {
	title: 'Core/DropDownButton',
	component: DropDownButton,
} as Meta;

const OpenUpStory = (props: DropDownButtonProps) => {
	return (
		<Box mt="300px">
			<DropDownButton {...props} />
		</Box>
	);
};
const OpenUpTemplate = createTemplate<DropDownButtonProps>(OpenUpStory);

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

export const DropUp = createStory<DropDownButtonProps>(OpenUpTemplate, {
	label: 'Dropdown',
	dropUp: true,
	children: sampleChildren,
});
