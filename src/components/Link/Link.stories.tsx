import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Link, LinkProps } from '.';

export default {
	title: 'Core/Link',
	component: Link,
} as Meta;

const Template = createTemplate<LinkProps>(Link);

export const Default = createStory<LinkProps>(Template, {
	href: '#',
	children: 'Internal link',
});

export const BlankTarget = createStory<LinkProps>(Template, {
	href: 'https://balena.io',
	blank: true,
});

export const Disabled = createStory<LinkProps>(Template, {
	href: 'https://balena.io',
	disabled: true,
});
