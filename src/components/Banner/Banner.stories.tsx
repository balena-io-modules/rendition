import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Banner, BannerProps } from '.';
// @ts-ignore
import bgImage from '../../stories/assets/bg.png';

export default {
	title: 'Core/Banner',
	component: Banner,
} as Meta;

const Template = createTemplate<BannerProps>(Banner);

export const Primary = createStory<BannerProps>(Template, {
	color: 'white',
	backgroundImage: bgImage,
	children: (
		<>
			<h1>balena</h1>
			<p>
				Balena brings the benefits of Linux containers to the IoT. Develop
				iteratively, deploy safely, and manage at scale.
			</p>
		</>
	),
});
