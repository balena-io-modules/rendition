import * as React from 'react';
import { Link, Flex, Button, TextWithCopy } from '../..';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Card, CardProps } from './';

const rows = [
	<div>Lorem Ipsum dolor si amet</div>,
	<Link href="www.balena.io">Link</Link>,
	<TextWithCopy
		showCopyButton="always"
		copy="This value has been copied to your clipboard!"
	>
		Row with Copy component
	</TextWithCopy>,
	<Flex justifyContent="space-between">
		<div>Row with</div>
		<div>Flex</div>
	</Flex>,
	<div>Lorem Ipsum dolor si amet</div>,
];

export default {
	title: 'Core/Card',
	component: Card,
	decorators: [
		(Story) => (
			<div style={{ width: 400, height: 400 }}>
				<Story />
			</div>
		),
	],
} as Meta;

const Template = createTemplate<CardProps>(Card);

export const Default = createStory<CardProps>(Template, {
	children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
  scelerisque euismod risus at gravida. Pellentesque a nunc semper,
  ultrices lacus nec, mattis mauris`,
});

export const Small = createStory<CardProps>(Template, {
	children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
  scelerisque euismod risus at gravida. Pellentesque a nunc semper,
  ultrices lacus nec, mattis mauris`,
	small: true,
});

export const WithHeader = createStory<CardProps>(Template, {
	title: 'Card with Button',
	cta: (
		<Button plain primary onClick={() => window.alert('Action with Button')}>
			Update
		</Button>
	),
	children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
  scelerisque euismod risus at gravida. Pellentesque a nunc semper,
  ultrices lacus nec, mattis mauris`,
});

export const WithRows = createStory<CardProps>(Template, {
	title: 'Card with Button',
	cta: <Link href="https://balena.io">Link</Link>,
	rows,
});
