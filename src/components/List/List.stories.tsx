import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { List, ListProps } from '.';
import { Link, Txt } from '../..';

const defaultChildren = [
	<Txt>
		You can put <Link href={'#'}>a link</Link>
	</Txt>,
	<Txt>
		And also some <code>code</code>
	</Txt>,
	<Txt>
		Multiline text
		<Txt>that breaks into multiple lines</Txt>
	</Txt>,
];

export default {
	title: 'Core/List',
	component: List,
} as Meta;

const Template = createTemplate<ListProps>(List);

export const Default = createStory<ListProps>(Template, {
	children: defaultChildren,
});

export const Ordered = createStory<ListProps>(Template, {
	ordered: true,
	children: defaultChildren,
});
