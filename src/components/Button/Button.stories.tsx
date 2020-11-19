import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Button, ButtonProps } from '.';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faRecycle } from '@fortawesome/free-solid-svg-icons/faRecycle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default {
	title: 'Core/Button',
	component: Button,
} as Meta;

const Template = createTemplate<ButtonProps>(Button);

export const Default = createStory<ButtonProps>(Template, {
	children: 'Default',
});

export const Primary = createStory<ButtonProps>(Template, {
	children: 'Primary',
	primary: true,
});

export const Disabled = createStory<ButtonProps>(Template, {
	children: 'Disabled',
	disabled: true,
});

export const Outlined = createStory<ButtonProps>(Template, {
	children: 'Outlined',
	outline: true,
});

export const Underlined = createStory<ButtonProps>(Template, {
	children: 'Underlined',
	underline: true,
});

export const Plain = createStory<ButtonProps>(Template, {
	children: 'Plain',
	plain: true,
});

export const WithIcon = createStory<ButtonProps>(Template, {
	children: 'With icon',
	icon: <FontAwesomeIcon icon={faExpand} />,
	plain: true,
});

export const IconOnly = createStory<ButtonProps>(Template, {
	icon: <FontAwesomeIcon icon={faRecycle} />,
	plain: true,
});

export const Active = createStory<ButtonProps>(Template, {
	children: 'Active',
	active: true,
});

export const Link = createStory<ButtonProps>(Template, {
	children: 'Link',
	href: '#',
});

export const WithConfirmation = createStory<ButtonProps>(Template, {
	children: 'Dangerous',
	danger: true,
	confirmation: {
		placement: 'bottom',
		text: 'Are you sure?',
	},
});
