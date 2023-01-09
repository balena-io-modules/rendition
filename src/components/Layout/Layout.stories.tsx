import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Layout, LayoutProps } from '.';
import { Box } from '../Box';
import { Txt } from '../Txt';

export default {
	title: 'Core/Layout',
	component: Layout,
} as Meta;

const Template = createTemplate<LayoutProps>(Layout);

export const Default = createStory<LayoutProps>(Template, {
	header: {
		leftContent: (
			<Txt color="white" my={1} ml={1} minHeight="10vh">
				This is a header
			</Txt>
		),
	},
	leftSider: {
		menuItems: [
			{ title: 'foo', href: 'roadmap.balena.io' },
			{ title: 'bar', href: 'docs.balena.io' },
		],
		navLink: Txt,
		minHeight: '100vh',
		minWidth: '10vw',
	},
	children: (
		<Box m={1}>
			The Layout component can give your product a sidebar and a header by
			passing respective props for either component, or you can pass your own
			into it. It accepts children (in this case the text you're seeing here),
			as well as components for the Footer, header for the content (children),
			and error boundary (if one is not provided, a native rendition one will be
			used).
		</Box>
	),
});
