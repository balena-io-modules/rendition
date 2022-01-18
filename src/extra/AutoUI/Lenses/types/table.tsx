import React from 'react';
import { Table } from '../../../../components/Table';
import { LensTemplate } from '..';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';

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
		}) => (
			<Table<any>
				rowKey="id"
				data={filtered}
				checkedItems={selected}
				columns={properties}
				{...(hasUpdateActions && { onCheck: changeSelected })}
				usePager={data && data.length > 5}
				pagerPosition="bottom"
				itemsPerPage={50}
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
