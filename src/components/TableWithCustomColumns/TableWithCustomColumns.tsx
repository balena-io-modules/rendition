import * as _ from 'lodash';
import * as React from 'react';
import { Table, TableColumn, TableProps, TableSortOptions } from '../../';
import styled, { css } from 'styled-components';
import { CustomColumnHeader } from './CustomColumnHeader';
import {
	getNewTagTableColumnState,
	TableColumnSelector,
	TableColumnState,
	TableColumnStateStoredProps,
	TagTableColumnState,
} from '../TableColumnSelector';

import { TaggedResource } from '~/scripts/modules/resource-tags/models';
import { getResourceTags } from '~/scripts/modules/resource-tags/tag-management-service';
import {
	TagLabel,
	TagLabelList,
} from '~/scripts/modules/resource-tags/TagLabelList';
import { BalenaSdk } from '~/services/balena-sdk';
import { getFromLocalStorage, setToLocalStorage } from './localstorageHelper';

const Container = styled.div`
	margin-bottom: 16px;
	position: relative;
`;

const TableColumnSelectorSizer = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	align-items: center;
	height: 40px;
	padding: 0 8px;
	background: ${props => props.theme.colors.quartenary.light};
`;

const fixedFirstColumnWidth = '60px';
const fixedFirstColumnCss = (bg: string) => css`
	max-width: calc(100% - ${fixedFirstColumnWidth});
	margin-left: ${fixedFirstColumnWidth};

	white-space: nowrap;
	> [data-display='table-head'] > [data-display='table-row'] {
		height: 42px;
	}

	> [data-display='table-body'] > [data-display='table-row'] {
		height: 50px;
		background-color: #fff;
	}

	> [data-display='table-head']
		> [data-display='table-row']
		> [data-display='table-cell'],
	> [data-display='table-body']
		> [data-display='table-row']
		> [data-display='table-cell'] {
		&:first-child {
			position: absolute;
			left: 0;
			display: flex;
			align-items: center;
			width: ${fixedFirstColumnWidth};
			height: inherit;
			z-index: 3;
			background-color: inherit;
			> input[type='checkbox'] {
				margin: 0;
			}
		}
	}
	> [data-display='table-head']
		> [data-display='table-row']
		> [data-display='table-cell']:first-child {
		background-color: ${bg};
	}
`;

const StyledTable = styled(Table)`
	> [data-display='table-head']
		> [data-display='table-row']
		> [data-display='table-cell'] {
		font-weight: normal;
		white-space: nowrap;

		&:last-child {
			padding-right: 50px;
		}
	}

	> [data-display='table-head']
		> [data-display='table-row']
		> [data-display='table-cell'],
	> [data-display='table-body']
		> [data-display='table-row']
		> [data-display='table-cell'] {
		padding: 5px 20px;
	}

	${props =>
		!!props.onCheck
			? fixedFirstColumnCss(props.theme.colors.quartenary.light)
			: ''};
`;

const TypedTable: new <T extends TaggedResource>() => Table<
	T
> = StyledTable as any;

export const ALL_TAGS_COLUMN_KEY = 'All Tags';

export const isCustomTagColumn = (
	column: TableColumnState,
): column is TagTableColumnState =>
	column.type === 'tag' && column.key !== ALL_TAGS_COLUMN_KEY;

const insertTagColumns = (
	columns: TableColumnState[],
	newTagColumns: TableColumnState[],
) => {
	let allTagsColumnIndex = _.findIndex(columns, {
		key: ALL_TAGS_COLUMN_KEY,
	});
	if (allTagsColumnIndex < 0) {
		allTagsColumnIndex = columns.length - 1;
	}

	columns.splice(allTagsColumnIndex, 0, ...newTagColumns);
};

type TableColumnWithStateProps<T> = TableColumn<T> & TableColumnState;

const tagCellAttributes = {
	href: undefined,
	style: {
		cursor: 'auto',
		paddingTop: '6px',
		paddingBottom: '6px',
	},
};

const findTagOfTaggedResource = <T extends TaggedResource>(
	taggedResource: T,
	tagField: keyof T,
	tagKey: string,
) =>
	_.find<BalenaSdk.ResourceTagBase>(
		getResourceTags(taggedResource, tagField) || [],
		{
			tag_key: tagKey,
		},
	);

const getTagTableColumn = <T extends TaggedResource>(
	columnState: TagTableColumnState,
	tagField: keyof T,
) => {
	const column: TableColumnWithStateProps<T> = {
		...columnState,
		// this field path doesn't exist
		// but we need to define something unique
		// for the table to work
		field: `${tagField}.${columnState.tagKey}` as keyof T,
		cellAttributes: tagCellAttributes,
	};
	column.sortable = (a: T, b: T) => {
		const tagKey = column.tagKey;
		if (!tagKey) {
			return 0;
		}

		const item1tag = findTagOfTaggedResource(a, tagField, tagKey);
		const item2tag = findTagOfTaggedResource(b, tagField, tagKey);

		// first compare the objects
		// so that we differentiate not having a value
		// with not having the tag at all
		if (!item1tag && !item2tag) {
			return 0;
		}

		if (!item1tag) {
			return 1;
		}

		if (!item2tag) {
			return -1;
		}

		return (item1tag.value || '').localeCompare(item2tag.value || '');
	};
	column.render = (_value: any, data: T) => {
		const tagKey = column.tagKey;
		if (!tagKey) {
			return null;
		}

		const tag = findTagOfTaggedResource(data, tagField, tagKey);
		if (!tag) {
			return null;
		}
		return <TagLabel tag={tag} showTagKey={false} />;
	};
	return column;
};

const normalizeTableColumn = <T extends {}>(
	column: TableColumnWithStateProps<T>,
) => {
	if (isCustomTagColumn(column) && !column.title && column.tagKey) {
		column.title = column.tagKey;
	}

	if (!column.label) {
		column.label = column.title;
	}
	// locked columns should always be visible
	if (column.locked && !column.selected) {
		column.selected = true;
	}
	return column;
};

const getAllTagsTableColumn = <T extends TaggedResource>(tagField: keyof T) =>
	normalizeTableColumn({
		title: 'All Tags',
		key: ALL_TAGS_COLUMN_KEY,
		selected: false,
		type: 'predefined',
		field: tagField,
		cellAttributes: tagCellAttributes,
		render: (tags: BalenaSdk.ResourceTagBase[]) => {
			if (!tags) {
				return null;
			}
			return <TagLabelList tags={tags} nowrap />;
		},
	} as TableColumnWithStateProps<T>);

const loadSortingPreferences = <T extends unknown>(
	sortingStateRestorationKey: string,
): TableSortOptions<T> | undefined => {
	if (!sortingStateRestorationKey) {
		return;
	}

	const sortPreferences = getFromLocalStorage<TableSortOptions<T>>(
		sortingStateRestorationKey,
	);

	if (!sortPreferences || !sortPreferences.field) {
		return;
	}

	return sortPreferences;
};

const saveSortingPreferences = <T extends unknown>(
	sortingStateRestorationKey: string,
	sortPreferences: TableSortOptions<T>,
) => {
	if (!sortingStateRestorationKey) {
		return;
	}

	setToLocalStorage(sortingStateRestorationKey, sortPreferences);
};

const loadColumnPreferences = (columnStateRestorationKey?: string) => {
	if (!columnStateRestorationKey) {
		return [];
	}

	const loadedColumns = getFromLocalStorage<TableColumnState[]>(
		columnStateRestorationKey,
	);

	// storage restored objects do not contain undefined props
	_.forEach(loadedColumns, c => {
		if (c.type === 'tag' && !c.tagKey) {
			c.tagKey = undefined;
		}
	});

	return loadedColumns;
};

const saveColumnPreferences = (
	columnStateRestorationKey: string | undefined,
	newColumns: TableColumnState[],
) => {
	if (!columnStateRestorationKey) {
		return;
	}

	const savePayload = newColumns.map(c =>
		_.pick(c, TableColumnStateStoredProps),
	);

	setToLocalStorage(columnStateRestorationKey, savePayload);
};

const applyColumnPreferences = <T extends TaggedResource>(
	columns: Array<TableColumnWithStateProps<T>>,
	loadedColumns: TableColumnState[] | undefined,
	tagField: keyof T,
): Array<TableColumnWithStateProps<T>> => {
	if (!_.size(loadedColumns)) {
		return columns;
	}

	const columnsByKey = _.keyBy(columns, 'key');
	const loadedColumnsByKey = _.keyBy(loadedColumns, 'key');

	const tableColumnStateAssignedProps = _.without(
		TableColumnStateStoredProps,
		'key',
	);

	_.keys(columnsByKey).forEach(key => {
		const column = columnsByKey[key];
		const loadedColumn = loadedColumnsByKey[key];

		if (!loadedColumn) {
			return;
		}

		_.assign(column, _.pick(loadedColumn, tableColumnStateAssignedProps));
	});

	// we need to populate the rest properties
	// for the restored tag columns
	const loadedTagColumns = _.filter(loadedColumns, isCustomTagColumn);
	const tagColumns = _.map(loadedTagColumns, c =>
		getTagTableColumn<T>(c, tagField),
	);
	insertTagColumns(columns, tagColumns);

	columns.forEach(normalizeTableColumn);

	return columns;
};

const addCustomColumns = <T extends TaggedResource>(
	props: TableWithCustomColumnsProps<T>,
) => {
	let allColumns = props.columns
		.map(normalizeTableColumn)
		.concat(getAllTagsTableColumn(props.tagField));

	const loadedColumns = props.loadColumnPreferences
		? props.loadColumnPreferences()
		: loadColumnPreferences(props.columnStateRestorationKey);

	allColumns = applyColumnPreferences(
		allColumns,
		loadedColumns,
		props.tagField,
	);
	return allColumns;
};

export interface TableWithCustomColumnsProps<T> extends TableProps<T> {
	data: T[];
	columns: Array<TableColumnWithStateProps<T>>;
	tagField: keyof T;
	innerRef?: React.RefObject<Table<T>> | ((instance: Table<T>) => void) | null;
	columnStateRestorationKey?: string;
	loadColumnPreferences?: () => TableColumnState[] | undefined;
	saveColumnPreferences?: (newColumns: TableColumnState[]) => void;
	sortingStateRestorationKey?: string;
}

interface TableWithCustomColumnsState<T> {
	allColumns: Array<TableColumnWithStateProps<T>>;
	visibleColumns: Array<TableColumnWithStateProps<T>>;
	tagKeys: string[];
	selectedTagColumnKeys: string[];
	newTagColumnKeys: string[];
	sort: TableSortOptions<T> | undefined;
}

export class TableWithCustomColumns<
	T extends TaggedResource
> extends React.Component<
	TableWithCustomColumnsProps<T>,
	TableWithCustomColumnsState<T>
> {
	constructor(props: TableWithCustomColumnsProps<T>) {
		super(props);

		const allColumns = addCustomColumns(props);

		this.state = this.getNewStateSlice(allColumns, this.props.data);
	}

	public componentWillReceiveProps(newProps: TableWithCustomColumnsProps<T>) {
		if (
			this.props.data !== newProps.data ||
			this.props.columns !== newProps.columns
		) {
			let { allColumns } = this.state;
			if (this.props.columns !== newProps.columns) {
				allColumns = addCustomColumns(newProps);
			}

			const newStateSlice = this.getNewStateSlice(allColumns, newProps.data);

			const shouldSaveUpdatedColumns = !_.isEqual(
				_.map(this.state.visibleColumns, 'key'),
				_.map(newStateSlice.visibleColumns, 'key'),
			);

			this.setState(newStateSlice, () => {
				if (shouldSaveUpdatedColumns) {
					this.saveColumnPreferences(newStateSlice.allColumns);
				}
			});
		}
	}

	public getNewStateSlice(
		columns: Array<TableColumnWithStateProps<T>>,
		data: T[],
	) {
		const tagKeys = _.uniq(
			_.flatMap(
				data,
				d =>
					(getResourceTags(
						d,
						this.props.tagField,
					) as BalenaSdk.ResourceTagBase[]) || [],
			).map(t => t.tag_key),
		).sort();

		const selectedTagColumnKeys = _.reduce(
			columns,
			(acc, c) => {
				if (c.type === 'tag' && c.tagKey) {
					acc.push(c.tagKey);
				}
				return acc;
			},
			[] as string[],
		);

		const newTagColumnKeys = _.without(tagKeys, ...selectedTagColumnKeys);

		if (
			!this.state ||
			!_.isEqual(this.state.tagKeys, tagKeys) ||
			!_.isEqual(this.state.selectedTagColumnKeys, selectedTagColumnKeys) ||
			!_.isEqual(this.props.columns, columns)
		) {
			const addedFirstTag =
				!!this.state && !_.some(this.state.tagKeys) && _.some(tagKeys);
			columns = columns.map(c => {
				if (isCustomTagColumn(c)) {
					// we need to refresh the headers of all tag columns
					this.setTagTableColumnHeader({ tagKeys, selectedTagColumnKeys }, c);
				} else if (
					addedFirstTag &&
					c.key === ALL_TAGS_COLUMN_KEY &&
					!c.selected
				) {
					// make the "All Tags" column pop when we first add a tag
					c.selected = true;
				}
				return c;
			});
		}

		const visibleColumns = _.filter(columns, 'selected');

		let sort: TableSortOptions<T> | undefined;
		if (this.state) {
			sort = this.state.sort;
		} else if (!this.props.sort && this.props.sortingStateRestorationKey) {
			const loadedSort = loadSortingPreferences(
				this.props.sortingStateRestorationKey,
			);
			if (
				loadedSort &&
				_.some(visibleColumns, c => c.field === loadedSort.field)
			) {
				sort = loadedSort;
			}
		}

		return {
			allColumns: columns,
			visibleColumns,
			tagKeys,
			selectedTagColumnKeys,
			newTagColumnKeys,
			sort,
		};
	}

	public setColumns(newColumns: Array<TableColumnWithStateProps<T>>) {
		const newState = this.getNewStateSlice(newColumns.slice(), this.props.data);
		return new Promise(resolve => this.setState(newState, resolve));
	}

	public saveColumnPreferences(newColumns: TableColumnState[]) {
		if (this.props.saveColumnPreferences) {
			this.props.saveColumnPreferences(newColumns);
		} else {
			saveColumnPreferences(this.props.columnStateRestorationKey, newColumns);
		}
	}

	public setColumnsAndSave = async (
		columns: Array<TableColumnWithStateProps<T>>,
	) => {
		await this.setColumns(columns);
		// if nothing breaks, save the column preferences
		this.saveColumnPreferences(columns);
	};

	public addTagColumn = () => {
		if (
			_.some(this.state.allColumns, {
				type: 'tag',
				tagKey: undefined,
			})
		) {
			// don't add extra unconfigured tag columns
			return;
		}

		// when there is only one unselected tag
		// then auto-select it for the new tag column
		const tagKey =
			this.state.newTagColumnKeys.length === 1
				? this.state.newTagColumnKeys[0]
				: undefined;
		const newColumnState = getNewTagTableColumnState(tagKey);

		const columns = this.state.allColumns.slice();
		const newTagColumn = getTagTableColumn(newColumnState, this.props.tagField);
		this.setTagTableColumnHeader(this.state, newTagColumn);
		insertTagColumns(columns, [newTagColumn]);
		this.setColumnsAndSave(columns);
	};

	public setTagTableColumnHeader(
		state: { tagKeys: string[]; selectedTagColumnKeys: string[] },
		column: TableColumnWithStateProps<T>,
	) {
		column.label = (
			<CustomColumnHeader
				columnInfo={column}
				items={state.tagKeys}
				disabledItems={state.selectedTagColumnKeys}
				label="Tag"
				setColumn={this.configureTagColumn}
			/>
		);
	}

	public configureTagColumn = (
		column: TableColumnWithStateProps<T>,
		tagKey: string,
	) => {
		if (!column || !tagKey) {
			return;
		}

		const indexOfColumn = this.state.allColumns.indexOf(column);
		if (indexOfColumn < 0) {
			return;
		}

		const newColumn = getTagTableColumn(
			getNewTagTableColumnState(tagKey),
			this.props.tagField,
		);
		const columns = this.state.allColumns.slice();
		columns.splice(indexOfColumn, 1, newColumn);
		// trigger a refresh
		this.setColumnsAndSave(columns);
	};

	public onSort = (sort: TableSortOptions<T>) => {
		if (this.props.sortingStateRestorationKey) {
			saveSortingPreferences(this.props.sortingStateRestorationKey, sort);
			this.setState({
				sort,
			});
		}

		if (this.props.onSort) {
			this.props.onSort(sort);
		}
	};

	public render() {
		const {
			columns,
			tagField,
			columnStateRestorationKey,
			loadColumnPreferences,
			saveColumnPreferences,
			sort: sortProp,
			sortingStateRestorationKey,
			innerRef,
			onSort,
			...props
		} = this.props;

		const sort =
			sortProp || (sortingStateRestorationKey ? this.state.sort : undefined);

		return (
			<Container>
				<TypedTable<T>
					columns={this.state.visibleColumns}
					rowKey="id"
					getRowHref={({ id }) => `${window.location.pathname}/${id}`}
					ref={innerRef}
					sort={sort}
					onSort={this.onSort}
					{...props}
				/>
				<TableColumnSelectorSizer>
					<TableColumnSelector
						columns={this.state.allColumns}
						setColumns={this.setColumnsAndSave}
						addTagColumn={this.addTagColumn}
						tagKeys={this.state.tagKeys}
					/>
				</TableColumnSelectorSizer>
			</Container>
		);
	}
}
