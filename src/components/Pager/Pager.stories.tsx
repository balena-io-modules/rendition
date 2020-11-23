import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Pager, PagerProps } from '.';

const PagerDemo = (props: PagerProps) => {
	const [page, setPage] = React.useState(props.page);
	return (
		<Pager
			{...props}
			page={page}
			nextPage={() => setPage(page + 1)}
			prevPage={() => setPage(page - 1)}
		/>
	);
};

export default {
	title: 'Core/Pager',
	component: Pager,
} as Meta;

const Template = createTemplate<PagerProps>(PagerDemo);

export const Default = createStory<PagerProps>(Template, {
	totalItems: 436,
	itemsPerPage: 50,
	page: 1,
	nextPage: () => null,
	prevPage: () => null,
});
