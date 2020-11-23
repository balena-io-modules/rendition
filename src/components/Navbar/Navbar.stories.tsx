import * as React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Img, Link } from '../../';
// @ts-ignore
import logo from '../../stories/assets/balena.png';
import { Navbar, NavbarProps } from '.';

export default {
	title: 'Core/Navbar',
	component: Navbar,
} as Meta;

const Template = createTemplate<NavbarProps>(Navbar);

export const Default = createStory<NavbarProps>(Template, {
	color: 'white',
	brand: (
		<Link color="white" href={'/'}>
			<Img style={{ height: '20px' }} src={logo} />
		</Link>
	),
	children: [
		<Link color="white" href={'/docs/'}>
			Docs
		</Link>,
		<Link color="white" href={'/changelog/'}>
			changelog
		</Link>,
		<Link color="white" href={'/gitter/'}>
			gitter
		</Link>,
	],
});
