import React from 'react';
import { Table, TableColumn } from '../../../../components/Table';
import { LensTemplate } from '..';
import { AutoUIContext } from '../../schemaOps';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';

interface TableProps<T> {
	filtered: T[];
	selected: T[];
	properties: Array<TableColumn<T>>;
	hasUpdateActions: boolean;
	changeSelected: (selected: T[]) => void;
	data?: T[];
	autouiContext: AutoUIContext<T>;
	onEntityClick: (
		entity: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => void;
	page?: number;
	onPageChange?: (page: number) => void;
}

export const table: LensTemplate = {
	slug: 'table',
	name: 'Default table lens',
	data: {
		label: 'Table',
		format: 'table',
		renderer: ({
			filtered,
			selected,
			properties,
			hasUpdateActions,
			changeSelected,
			data,
			autouiContext,
			onEntityClick,
			page,
			onPageChange,
		}: TableProps<any>) => (
			<Table<any>
				rowKey="id"
				data={filtered}
				checkedItems={selected}
				columns={properties}
				{...(hasUpdateActions && { onCheck: changeSelected })}
				usePager={data && data.length > 5}
				pagerPosition="bottom"
				itemsPerPage={50}
				page={page}
				onPageChange={onPageChange}
				getRowHref={autouiContext.getBaseUrl}
				onRowClick={onEntityClick}
				columnStateRestorationKey={`${autouiContext.resource}__columns`}
				sortingStateRestorationKey={`${autouiContext.resource}__sort`}
				tagField={autouiContext.tagField}
				enableCustomColumns
			/>
		),
		icon: faTable,
		type: '*',
		filter: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'number',
					},
				},
			},
		},
	},
};
