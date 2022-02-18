import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import PokeDex from '../../stories/assets/pokedex';
import { Table, TableProps } from './';

const prefixNum = (num: number) =>
	num.toString().length === 1 ? `0${num}` : num;
const columns = [
	{
		title: 'Name',
		field: 'Name',
		sortable: true,
		selected: true,
	},
	{
		title: 'National Pokedex Number',
		field: 'pokedex_number',
		sortable: true,
		selected: true,
		render: (value: any) => <code>{value}</code>,
	},
	{
		title: 'Category',
		field: 'Category',
		sortable: true,
		selected: true,
	},
	{
		title: 'First Seen',
		field: 'first_seen',
		sortable: true,
		selected: false,
		render: (value: any) => {
			if (value == null) {
				return null;
			}

			const d = new Date(value);
			return (
				<span>
					{d.getFullYear()}-{prefixNum(d.getMonth() + 1)}-
					{prefixNum(d.getDay() + 1)}
				</span>
			);
		},
	},
];

export default {
	title: 'Core/Table',
	component: Table,
	args: {
		columns,
		data: PokeDex,
		rowKey: 'pokedex_number',
		onCheck: null,
		// onRowClick: null,
	},
} as Meta;

const TableWithCheckboxesTemplate = createTemplate<TableProps<any>>((props) => {
	const [selected, setSelected] = React.useState(props.checkedItems ?? []);
	return (
		<Table
			{...props}
			checkedItems={selected}
			onCheck={(items) => setSelected(items)}
		/>
	);
});

const Template = createTemplate<TableProps<any>>(Table);
export const Default = createStory<TableProps<any>>(Template, {});
export const WithPager = createStory<TableProps<any>>(Template, {
	usePager: true,
	itemsPerPage: 3,
	pagerPosition: 'both',
});

export const WithFuzzyPager = createStory<TableProps<any>>(Template, {
	usePager: true,
	itemsPerPage: 3,
	pagerPosition: 'both',
	fuzzyPager: true,
	data: PokeDex.slice(0, 5),
});

export const Sorted = createStory<TableProps<any>>(Template, {
	sort: { field: 'Name', reverse: true },
});

export const WithCheckboxes = createStory<TableProps<any>>(
	TableWithCheckboxesTemplate,
	{
		checkedItems: PokeDex.slice(0, 3),
	},
);

export const WithRowClick = createStory<TableProps<any>>(Template, {
	onRowClick: () => null,
});

export const WithPrefix = createStory<TableProps<any>>(Template, {
	tbodyPrefix: [
		<tr key={1}>
			<td colSpan={columns.length}>
				<p style={{ textAlign: 'center' }}>Row 1</p>
			</td>
		</tr>,
		<tr key={2}>
			<td colSpan={columns.length}>
				<p style={{ textAlign: 'center' }}>Row 2</p>
			</td>
		</tr>,
	],
});

export const WithAnchorRows = createStory<TableProps<any>>(Template, {
	getRowHref: (row: any) => `https://www.pokemon.com/uk/pokedex/${row.Name}`,
	rowAnchorAttributes: { target: '_blank' },
});

export const WithHighlightedRows = createStory<TableProps<any>>(Template, {
	highlightedRows: [2, 5],
});

export const WithConditionalRowClasses = createStory<TableProps<any>>(
	Template,
	{
		getRowClass: (pokemon: any) => {
			const classNames = ['pokemon'];

			if (pokemon.caught) {
				classNames.push('pokemon--caught');
			}
			if (pokemon.Abilities.length === 1) {
				classNames.push('pokemon--one-dimensional');
			}

			return classNames;
		},
	},
);

export const withCustomColumns = createStory<TableProps<any>>(Template, {
	enableCustomColumns: true,
});
