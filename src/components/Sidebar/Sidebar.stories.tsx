import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Sidebar, SidebarProps } from '.';
import { Route, Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { Flex } from '../Flex';
import { Txt } from '../Txt';

const menuItems = [
	{
		title: 'MenuItem 1',
		href: 'menuitem1',
		component: <>Menu item 1</>,
	},
	{
		title: 'MenuItem 2',
		href: 'menuitem2',
		component: <>Menu item 2</>,
	},
	{
		title: 'MenuItem 3',
		href: 'menuitem3',
		component: <>Menu item 3</>,
	},
];

const SidebarDemo = (props: SidebarProps) => {
	const history = createBrowserHistory();
	return (
		<Flex width="90vw" height="90vh">
			<Router history={history}>
				<Sidebar {...props} width={300} height="100%" />
				<Flex>
					{/* THIS IS JUST AN EXAMPLE. ROUTES WILL NOT BE RENDERED BECAUSE OF STORYBOOK */}
					{menuItems.map((item) => (
						<Route path={item.href} component={() => item.component} />
					))}
				</Flex>
			</Router>
		</Flex>
	);
};

export default {
	title: 'Core/Sidebar',
	component: Sidebar,
} as Meta;

const Template = createTemplate<SidebarProps>(SidebarDemo);

export const Default = createStory<SidebarProps>(Template, {
	crumbs: [
		{
			text: 'MenuItem 1',
			href: 'menuitem1',
		},
		{
			text: 'Summary',
		},
	],
	menuItems,
	showBreadcrumbs: true,
});

export const WithAdditionalComponents = createStory<SidebarProps>(Template, {
	crumbs: [
		{
			text: 'MenuItem 1',
			href: 'menuitem1',
		},
		{
			text: 'Summary',
		},
	],
	menuItems,
	showBreadcrumbs: true,
	additionalComponents: <Txt color="white">Another component can go here</Txt>,
});
