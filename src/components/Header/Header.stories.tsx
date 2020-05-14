import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Header, HeaderProps } from '.';
// @ts-ignore
import logo from '../../stories/assets/balena.png';

const defaultRoutes = [
	{ title: 'What is balena?', path: 'what-is-balena' },
	{ title: 'balenaCloud', path: 'cloud' },
	{
		title: 'Resources',
		routes: [
			{
				title: 'Docs',
				path: '/docs',
				blank: true,
				needsPrefix: true,
			},
			{ title: 'Forums', blank: true, path: 'https://forums.balena.io' },
			{
				title: 'Blog',
				path: '/blog',
				blank: true,
				needsPrefix: true,
			},
			{ title: 'Support', path: '/support' },
			{
				title: 'Projects',
				blank: true,
				path: 'https://github.com/balenalabs',
			},
			{
				title: 'Base Images',
				blank: true,
				path: 'https://hub.docker.com/u/balena/',
			},
		],
	},
	{ title: 'Pricing', path: '/pricing' },
	{ title: 'Customers', path: '/customers' },
	{
		title: 'About',
		routes: [
			{ title: 'Team', path: '/team' },
			{ title: 'Jobs', blank: true, path: 'https://balena.workable.com/' },
			{ title: 'Press', path: '/press' },
			{ title: 'Contact', path: '/contact' },
		],
	},
];

export default {
	title: 'core/Header',
	component: Header,
} as Meta;

const DefaultTemplate = createTemplate<HeaderProps>(Header);

export const Default = createStory<HeaderProps>(DefaultTemplate, {
	routes: defaultRoutes,
	logo,
	children: 'content',
});
