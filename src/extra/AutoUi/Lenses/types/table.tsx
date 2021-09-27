import React from 'react';
import { Table, TableColumn } from '../../../../components/Table';
import { LensTemplate } from '..';
import { AutoUIContext } from '../../schemaOps';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';

interface TableProps<T> {
	filtered: T[];
	selected: T[];
	columns: Array<TableColumn<T>>;
	hasUpdateActions: boolean;
	changeSelected: (selected: T[]) => void;
	data?: T[];
	autouiContext: AutoUIContext<T>;
	onEntityClick: (
		entity: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => void;
}

export const table: LensTemplate = {
	slug: 'table',
	name: 'Default table lens',
	data: {
		label: 'Table',
		format: 'table',
		renderer: (props: TableProps<any>) => (
			<Table<any>
				rowKey="id"
				data={props.filtered}
				checkedItems={props.selected}
				columns={props.columns}
				{...(props.hasUpdateActions && { onCheck: props.changeSelected })}
				usePager={props.data && props.data.length > 5}
				pagerPosition="bottom"
				itemsPerPage={50}
				getRowHref={props.autouiContext.getBaseUrl}
				onRowClick={props.onEntityClick}
				columnStateRestorationKey={`${props.autouiContext.resource}__columns`}
				sortingStateRestorationKey={`${props.autouiContext.resource}__sort`}
				tagField={props.autouiContext.tagField as keyof any}
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
