import * as React from 'react';
import {
	TableBase,
	TableBaseProps,
	TableSortOptions,
} from './TableBase';
import styled, { css } from 'styled-components';
import keys from 'lodash/keys';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import filter from 'lodash/filter';
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import uniq from 'lodash/uniq';
import reduce from 'lodash/reduce';
import some from 'lodash/some';
import without from 'lodash/without';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import size from 'lodash/size';
import { Flex } from '../Flex';
import {
	getFromLocalStorage,
	getResourceTags,
	ResourceTagBase,
	setToLocalStorage,
	TaggedResource,
} from './TableUtils';
import {
	getNewTagTableColumnState,
	TableColumnSelector,
	TableColumnState,
	TableColumnStateStoredProps,
	TagTableColumnState,
} from './TableColumnSelector';
import { TagLabel } from './TagLabel';
import { TagLabelList } from './TagLabelList';
import { CustomColumnHeader } from './CustomColumnHeader';
import { TableColumn, TableRow } from './TableRow';

const Container = styled(Flex)`
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
	background: ${(props) => props.theme.colors.quartenary.semilight};
`;

// Bottom border fix caused by the overrides over the rendition table. All features here should be in rendition and this component should be removed.
const CustomSideScrollBox = styled(Flex)`
	flex-direction: column;
	flex: 0 0 auto;
	overflow-x: auto;
	> div:first-child {
		border-bottom: 1px solid ${(props) => props.theme.colors.quartenary.main};
		> div:first-child {
			border-bottom: none;
		}
	}
`;

const fixedFirstColumnWidth = '60px';
const fixedFirstColumnCss = (bg: string) => css`
	max-width: calc(100% - ${fixedFirstColumnWidth});
	margin-left: ${fixedFirstColumnWidth};

	white-space: nowrap;

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

const StyledTable = styled(TableBase)`
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

	> [data-display='table-head'] > [data-display='table-row'] {
		height: 42px;
	}

	> [data-display='table-body'] > [data-display='table-row'] {
		height: 50px;
		background-color: #fff;
	}

	${(props) =>
		!!props.onCheck
			? fixedFirstColumnCss(props.theme.colors.quartenary.semilight)
			: ''};
`;

const TypedTable: new <
	T extends TaggedResource
>() => TableBase<T> = StyledTable as any;

export const ALL_TAGS_COLUMN_KEY = 'All Tags';

export type TableState<T> = TableColumn<T> & TableColumnState;

const tagCellAttributes = {
	href: undefined,
	style: {
		cursor: 'auto',
		paddingTop: '6px',
		paddingBottom: '6px',
	},
};

const isCustomTagColumn = (
	column: TableColumnState,
): column is TagTableColumnState =>
	column.type === 'tag' && column.key !== ALL_TAGS_COLUMN_KEY;

const insertTagColumns = (
	columns: TableColumnState[],
	newTagColumns: TableColumnState[],
) => {
	let allTagsColumnIndex = columns.findIndex(
		(column) => column.key === ALL_TAGS_COLUMN_KEY,
	);
	if (allTagsColumnIndex < 0) {
		allTagsColumnIndex = columns.length - 1;
	}

	columns.splice(allTagsColumnIndex, 0, ...newTagColumns);
};

const findTagOfTaggedResource = <T extends TaggedResource>(
	taggedResource: T,
	tagField: keyof T,
	tagKey: string,
) =>
	getResourceTags(taggedResource, tagField)?.find(
		(tag) => tag.tag_key === tagKey,
	);

const getTagTableColumn = <T extends TaggedResource>(
	columnState: TagTableColumnState,
	tagField: keyof T,
) => {
	const column: TableState<T> = {
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
	column: TableState<T>,
	withCustomColumns?: boolean,
) => {
	if (isCustomTagColumn(column) && !column.title && column.tagKey) {
		column.title = column.tagKey;
	}

	if (!column.label) {
		column.label = column.title;
	}
	// locked columns should always be visible
	if ((column.locked && !column.selected) || !withCustomColumns) {
		column.selected = true;
	}
	return column;
};

const getAllTagsTableColumn = <T extends TaggedResource>(
	tagField: keyof T,
	withCustomColumns?: boolean,
) =>
	normalizeTableColumn(
		{
			title: 'All Tags',
			key: ALL_TAGS_COLUMN_KEY,
			selected: false,
			type: 'predefined',
			field: tagField,
			cellAttributes: tagCellAttributes,
			render: (tags: ResourceTagBase[]) => {
				if (!tags) {
					return null;
				}
				return <TagLabelList tags={tags} nowrap />;
			},
		} as TableState<T>,
		withCustomColumns,
	);

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
	loadedColumns?.forEach((c) => {
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

	const savePayload = newColumns.map((c) =>
		pick(c, TableColumnStateStoredProps),
	);

	setToLocalStorage(columnStateRestorationKey, savePayload);
};

const applyColumnPreferences = <T extends TaggedResource>(
	columns: Array<TableState<T>>,
	loadedColumns: TableColumnState[] | undefined,
	tagField: keyof T | undefined,
	withCustomColumn?: boolean,
): Array<TableState<T>> => {
	if (!size(loadedColumns)) {
		return columns;
	}

	const columnsByKey = keyBy(columns, 'key');
	const loadedColumnsByKey = keyBy(loadedColumns, 'key');

	const tableColumnStateAssignedProps = without(
		TableColumnStateStoredProps,
		'key',
	);

	keys(columnsByKey).forEach((key) => {
		const column = columnsByKey[key];
		const loadedColumn = loadedColumnsByKey[key];

		if (!loadedColumn) {
			return;
		}

		assign(column, pick(loadedColumn, tableColumnStateAssignedProps));
	});

	// we need to populate the rest properties
	// for the restored tag columns
	if (tagField) {
		const loadedTagColumns = filter(loadedColumns, isCustomTagColumn);
		const tagColumns = map(loadedTagColumns, (c) =>
			getTagTableColumn<T>(c, tagField),
		);
		insertTagColumns(columns, tagColumns);
	}

	columns.forEach((column) => normalizeTableColumn(column, withCustomColumn));

	return columns;
};

const addCustomColumns = <T extends TaggedResource>(props: TableProps<T>) => {
	const {
		columns,
		tagField,
		withCustomColumn,
		columnStateRestorationKey,
	} = props;
	let allColumns = columns.map((column) =>
		normalizeTableColumn(column, withCustomColumn),
	);

	if (tagField) {
		allColumns = allColumns.concat(
			getAllTagsTableColumn(tagField, withCustomColumn),
		);
	}

	const loadedColumns = props.loadColumnPreferences
		? props.loadColumnPreferences()
		: loadColumnPreferences(columnStateRestorationKey);

	allColumns = applyColumnPreferences(
		allColumns,
		loadedColumns,
		tagField,
		withCustomColumn,
	);
	return allColumns;
};

export interface TableProps<T> extends TableBaseProps<T> {
	data: T[];
	columns: Array<TableState<T>>;
	tagField?: keyof T;
	innerRef?:
		| React.RefObject<TableBase<T>>
		| ((instance: TableBase<T>) => void)
		| null;
	columnStateRestorationKey?: string;
	loadColumnPreferences?: () => TableColumnState[] | undefined;
	saveColumnPreferences?: (newColumns: TableColumnState[]) => void;
	sortingStateRestorationKey?: string;
	withCustomColumn?: boolean;
}

interface TableWithCustomColumnsState<T> {
	allColumns: Array<TableState<T>>;
	visibleColumns: Array<TableState<T>>;
	tagKeys: string[];
	selectedTagColumnKeys: string[];
	newTagColumnKeys: string[];
	sort: TableSortOptions<T> | undefined;
}

export class Table<T extends TaggedResource> extends React.Component<
	TableProps<T>,
	TableWithCustomColumnsState<T>
> {
	constructor(props: TableProps<T>) {
		super(props);

		const allColumns = addCustomColumns(props);

		this.state = this.getNewStateSlice(allColumns, this.props.data);
	}

	public componentWillReceiveProps(newProps: TableProps<T>) {
		if (
			this.props.data !== newProps.data ||
			this.props.columns !== newProps.columns
		) {
			let { allColumns } = this.state;
			if (this.props.columns !== newProps.columns) {
				allColumns = addCustomColumns(newProps);
			}

			const newStateSlice = this.getNewStateSlice(allColumns, newProps.data);

			const shouldSaveUpdatedColumns = !isEqual(
				map(this.state.visibleColumns, 'key'),
				map(newStateSlice.visibleColumns, 'key'),
			);

			this.setState(newStateSlice, () => {
				if (shouldSaveUpdatedColumns) {
					this.saveColumnPreferences(newStateSlice.allColumns);
				}
			});
		}
	}

	public getTagKeys(columns: Array<TableState<T>>, data: T[]) {
		if (!this.props.tagField) {
			return {
				tagKeys: [],
				selectedTagColumnKeys: [],
				newTagColumnKeys: [],
			};
		}

		const tagKeys = uniq(
			flatMap(
				data,
				(d) =>
					(getResourceTags(d, this.props.tagField!) as ResourceTagBase[]) || [],
			).map((t) => t.tag_key),
		).sort();

		const selectedTagColumnKeys = reduce(
			columns,
			(acc, c) => {
				if (c.type === 'tag' && c.tagKey) {
					acc.push(c.tagKey);
				}
				return acc;
			},
			[] as string[],
		);

		const newTagColumnKeys = without(tagKeys, ...selectedTagColumnKeys);

		if (
			!this.state ||
			!isEqual(this.state.tagKeys, tagKeys) ||
			!isEqual(this.state.selectedTagColumnKeys, selectedTagColumnKeys) ||
			!isEqual(this.props.columns, columns)
		) {
			const addedFirstTag =
				!!this.state && !some(this.state.tagKeys) && some(tagKeys);
			columns = columns.map((c) => {
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

		return { tagKeys, selectedTagColumnKeys, newTagColumnKeys };
	}

	public getNewStateSlice(
		columns: Array<TableState<T>>,
		data: T[],
	): TableWithCustomColumnsState<T> {
		const visibleColumns = filter(columns, 'selected');

		let sort: TableSortOptions<T> | undefined;
		if (this.state) {
			sort = this.state.sort;
		} else if (!this.props.sort && this.props.sortingStateRestorationKey) {
			const loadedSort = loadSortingPreferences(
				this.props.sortingStateRestorationKey,
			);
			if (
				loadedSort &&
				some(visibleColumns, (c) => c.field === loadedSort.field)
			) {
				sort = loadedSort;
			}
		}

		return {
			allColumns: columns,
			visibleColumns,
			sort,
			...this.getTagKeys(columns, data),
		};
	}

	public setColumns(newColumns: Array<TableState<T>>) {
		const newState = this.getNewStateSlice(newColumns.slice(), this.props.data);
		return new Promise<void>((resolve) => this.setState(newState, resolve));
	}

	public saveColumnPreferences(newColumns: TableColumnState[]) {
		if (this.props.saveColumnPreferences) {
			this.props.saveColumnPreferences(newColumns);
		} else {
			saveColumnPreferences(this.props.columnStateRestorationKey, newColumns);
		}
	}

	public setColumnsAndSave = async (columns: Array<TableState<T>>) => {
		await this.setColumns(columns);
		// if nothing breaks, save the column preferences
		this.saveColumnPreferences(columns);
	};

	public addTagColumn = () => {
		const {
			tagKeys,
			newTagColumnKeys,
			allColumns,
			selectedTagColumnKeys,
		} = this.state;
		if (!this.props.tagField) {
			return;
		}

		if (
			some(allColumns, {
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
			newTagColumnKeys.length === 1 ? newTagColumnKeys[0] : undefined;
		const newColumnState = getNewTagTableColumnState(tagKey);

		const columns = allColumns.slice();
		const newTagColumn = getTagTableColumn(newColumnState, this.props.tagField);
		this.setTagTableColumnHeader(
			{ tagKeys, selectedTagColumnKeys },
			newTagColumn,
		);
		insertTagColumns(columns, [newTagColumn]);
		this.setColumnsAndSave(columns);
	};

	public setTagTableColumnHeader(
		state: { tagKeys: string[]; selectedTagColumnKeys: string[] },
		column: TableState<T>,
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

	public configureTagColumn = (column: TableState<T>, tagKey: string) => {
		if (!column || !tagKey || !this.props.tagField) {
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
			onRowClick,
			...props
		} = this.props;

		const sort =
			sortProp || (sortingStateRestorationKey ? this.state.sort : undefined);

		return (
			<Container>
				<CustomSideScrollBox
					minHeight={60 + 32 * this.state.tagKeys.length + 'px'}
					width="100%"
				>
					<TypedTable<T>
						columns={this.state.visibleColumns}
						rowKey="id"
						getRowHref={({ id }) => `${window.location.pathname}/${id}`}
						ref={innerRef}
						sort={sort}
						onSort={this.onSort}
						onRowClick={onRowClick}
						{...props}
					/>
				</CustomSideScrollBox>
				{false && (
					<TableColumnSelectorSizer>
						<TableColumnSelector
							columns={this.state.allColumns}
							setColumns={this.setColumnsAndSave}
							addTagColumn={this.addTagColumn}
							tagKeys={tagField ? this.state.tagKeys : undefined}
						/>
					</TableColumnSelectorSizer>
				)}
			</Container>
		);
	}
}

export { TableColumn, TableRow, TableSortOptions };