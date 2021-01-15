import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Breadcrumbs, BreadcrumbsProps } from '.';
import { faRecycle } from '@fortawesome/free-solid-svg-icons/faRecycle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex } from '../..';

export default {
	title: 'Core/Breadcrumbs',
	component: Breadcrumbs,
	parameters: {
		backgrounds: {
			default: 'dark',
		},
	},
} as Meta;

const crumbs = [
	{
		text: 'route 1',
		href: '/?path=/story/core-breadcrumbs--default',
		onClick: (event: React.MouseEvent) => {
			event.preventDefault();
			alert('click route 1');
		},
	},
	{
		text: 'route 2',
		href: '/?path=/story/core-breadcrumbs--default',
		onClick: (event: React.MouseEvent) => {
			event.preventDefault();
			alert('click route 2');
		},
	},
	{
		text: 'route 3 with icon',
		href: '/?path=/story/core-breadcrumbs--default',
		icon: <FontAwesomeIcon icon={faRecycle} />,
		onClick: (event: React.MouseEvent) => {
			event.preventDefault();
			alert('click route 3');
		},
	},
];

const Template = createTemplate<BreadcrumbsProps>(Breadcrumbs);

const WrappedBreadcrumb = ({ crumbs }: BreadcrumbsProps) => (
	<Flex maxWidth="70px">
		<Breadcrumbs crumbs={crumbs}></Breadcrumbs>
	</Flex>
);

export const Default = createStory<BreadcrumbsProps>(Template, {
	crumbs,
});

export const Wrapped = createStory<BreadcrumbsProps>(WrappedBreadcrumb, {
	crumbs,
});
