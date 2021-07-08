import * as React from 'react';
import { TableBase, TableBaseProps, TableSortOptions } from './TableBase';
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
	getNewTagTableColumnState,
	TableColumnSelector,
	TableColumnState,
	TableColumnStateStoredProps,
	TagTableColumnState,
} from './TableColumnSelector';
import { TagLabel } from './TagLabel';
import { TagLabelList } from './TagLabelList';
import { CustomColumnHeader } from './CustomColumnHeader';
import { TableBaseColumn, TableRow } from './TableRow';
import { ResourceTagBase } from '../TagManagementModal/models';
import { getResourceTags } from '../TagManagementModal/tag-management-service';
import { getFromLocalStorage, setToLocalStorage } from '../../utils';

const Container = styled(Flex)`
	position: relative;
`;

export const TableColumnSelectorSizer = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	align-items: center;
	height: 40px;
	padding: 0 8px;
	background: ${(props) => props.theme.colors.quartenary.semilight};
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

const StyledTable = styled(TableBase)<{ enableCustomColumns?: boolean }>`
	${(props) =>
		props.enableCustomColumns
			? `
		> [data-display='table-head']
			> [data-display='table-row']
			> [data-display='table-cell']:last-child {
			padding-right: 50px;
		}
	`
			: ''};

	> [data-display='table-head'] > [data-display='table-row'] {
		height: 42px;
	}

	> [data-display='table-body'] > [data-display='table-row'] {
		height: 50px;
	}

	${(props) =>
		!!props.onCheck
			? fixedFirstColumnCss(props.theme.colors.quartenary.semilight)
			: ''};
`;

const TypedTable: new <T>() => React.Component<
	TableBaseProps<T> & { enableCustomColumns?: boolean }
> = StyledTable as any;

const TAGS_COLUMN_KEY = 'Tags';

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
	column.type === 'tag' && column.key !== TAGS_COLUMN_KEY;

const insertTagColumns = (
	columns: TableColumnState[],
	newTagColumns: TableColumnState[],
) => {
	let allTagsColumnIndex = columns.findIndex(
		(column) => column.key === TAGS_COLUMN_KEY,
	);
	if (allTagsColumnIndex < 0) {
		allTagsColumnIndex = columns.length - 1;
	}

	columns.splice(allTagsColumnIndex, 0, ...newTagColumns);
};

const findTagOfTaggedResource = <T extends {}>(
	taggedResource: T,
	tagField: keyof T,
	tagKey: string,
) =>
	getResourceTags(taggedResource, tagField)?.find(
		(tag) => tag.tag_key === tagKey,
	);

export interface TableColumn<T> extends TableBaseColumn<T> {
	title?: string;
	selected?: boolean;
	locked?: boolean;
}

type TableColumnInternal<T> = TableBaseColumn<T> & TableColumnState;

const getTagTableColumn = <T extends {}>(
	columnState: TagTableColumnState,
	tagField: keyof T,
) => {
	const column: TableColumnInternal<T> = {
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
	originalColumn: TableColumn<T> & Partial<Pick<TableColumnState, 'type'>>,
	enableCustomColumns?: boolean,
): TableColumnInternal<T> => {
	const column = originalColumn as TableColumnInternal<T>;
	if (isCustomTagColumn(column) && !column.title && column.tagKey) {
		column.title = column.tagKey;
	}

	column.label = column.label || column.title;
	// when custom columns are off, all columns show appear
	// locked columns should always be visible
	column.selected =
		!enableCustomColumns ||
		originalColumn.locked ||
		originalColumn.selected ||
		false;

	return column;
};

const getAllTagsTableColumn = <T extends {}>(
	tagField: keyof T,
	enableCustomColumns?: boolean,
) =>
	normalizeTableColumn(
		{
			title: 'Tags',
			key: TAGS_COLUMN_KEY,
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
		},
		enableCustomColumns,
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

const applyColumnPreferences = <T extends {}>(
	columns: Array<TableColumnInternal<T>>,
	loadedColumns: TableColumnState[] | undefined,
	tagField: keyof T | undefined,
	enableCustomColumns?: boolean,
): Array<TableColumnInternal<T>> => {
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

	columns.forEach((column) =>
		normalizeTableColumn(column, enableCustomColumns),
	);

	return columns;
};

const addCustomColumns = <T extends {}>(props: TableProps<T>) => {
	const { columns, tagField, enableCustomColumns, columnStateRestorationKey } =
		props;
	let allColumns = columns.map((column) =>
		normalizeTableColumn(column, enableCustomColumns),
	);

	if (tagField) {
		allColumns = allColumns.concat(
			getAllTagsTableColumn(tagField, enableCustomColumns),
		);
	}

	const loadedColumns = props.loadColumnPreferences
		? props.loadColumnPreferences()
		: loadColumnPreferences(columnStateRestorationKey);

	allColumns = applyColumnPreferences(
		allColumns,
		loadedColumns,
		tagField,
		enableCustomColumns,
	);
	return allColumns;
};

export interface TableProps<T> extends TableBaseProps<T> {
	/** An array of objects that will be displayed in the table */
	data: T[];
	/** An array of column objects, as described above */
	columns: Array<TableColumn<T>>;
	/** Set a field for tags */
	tagField?: keyof T;
	innerRef?: React.LegacyRef<
		React.Component<
			TableProps<T> & { enableCustomColumns?: boolean | undefined },
			{},
			any
		>
	>;
	/** Key to store columns preferences to show when enableCustomColumns is true */
	columnStateRestorationKey?: string;
	/** Key to store custom sorting */
	sortingStateRestorationKey?: string;
	/** Custom function to store column preferences */
	loadColumnPreferences?: () => TableColumnState[] | undefined;
	/** Custom function to store custom sorting preferences */
	saveColumnPreferences?: (newColumns: TableColumnState[]) => void;
	/** Show a Table with custom columns which gives the possibility to display and hide the selected columns */
	enableCustomColumns?: boolean;
}

interface TableWithCustomColumnsState<T> {
	allColumns: Array<TableColumnInternal<T>>;
	visibleColumns: Array<TableColumnInternal<T>>;
	tagKeys: string[];
	selectedTagColumnKeys: string[];
	newTagColumnKeys: string[];
	sort: TableSortOptions<T> | undefined;
}

/**
 * A component used to generate a styled table.
 *
 * ## Columns
 *
 * The `columns` property defines what columns the table should display, how they
 * are rendered and whether or not the column is sortable.
 *
 * The `columns` property should be an array of objects with the following properties:
 *
 * | Name          | Type      | Required | Description                                          |
 * | ------------- | --------- | -------- | ---------------------------------------------------- |
 * | field         | `keyof T`  | ✓ | The name of the field this column should render, this should correspond to a key on the objects passed to the `data` property of the `Table` component |
 * | key | `string` | - | Custom key for React to use instead of the field name above |
 * | cellAttributes | <code>object &#124; (value: any, row: T) => object</code> | - | Attributes that are passed to each cell in this column. This can also be a function, which will be called with the value of the `field` provided and the row data (`T`) |
 * | label | <code>string &#124; JSX.Element</code> | - | A string or JSX element that will be used to display the name of the column. If this property is not provided, the `field` property will be used instead |
 * | render | <code>(value: any, row: T) => string &#124; number &#124; number &#124; JSX.Element &#124; null</code> | - | Use a custom render function to display the value in each column cell. This function will be called with the value of the `field` provided and the row data (`T`) |
 * | sortable | <code>boolean &#124; (a: T, b: T) => number</code> | - | If true, the column will be sortable using an alphanumeric sort, alternatively a function can be provided allowing finer grained control over sorting |
 * | selected | <code>boolean</code> | - | This boolean allow to choose which columns are visible, when custom columns are activated with `enableCustomColumns`. |
 *
 * ## Custom Columns
 *
 * The `enableCustomColumns` property allows to have visible and hidden columns, which can be managed from a side menu that allow to choose which of these to display.
 * In this mode it is also provided the possibility to save ( `saveColumnPreferences` ) and load ( `loadColumnPreferences` ) the column preferences to always maintain the chosen ones.
 *
 * ## Notes
 *
 * For performance reasons table rows are only re-rendered if the row properties
 * have changed. For this reason, rows **will not** re-render if their properties
 * are mutated: you should clone the item instead, for example:
 *
 * ```js
 * update (index) {
 *   const newData = this.state.data
 *   const element = newData[index]
 *   newData[index] = Object.assign({}, element, { active: !element.active })
 *   this.setState({ data: newData })
 * }
 * ```
 *
 * See the **Updating data in a table** story for an example of how this can be
 * done using a high order component.
 *
 * Additionally, because of this rendering behaviour the `render()` functions in
 * the `Table` component's `columns` property should only use values provided to
 * the render function.
 * When `render()` functions are provided, they must act like pure functions with
 * respect to their props. They should only rely on their arguments to generate
 * their output and not use any context variables. If you are using a context
 * variable in your `render()` function, then changes to that variable will not
 * cause a re-render of the component and will not be reflected on the table.
 *
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Table/Table.stories.tsx)
 */

export class Table<T extends {}> extends React.Component<
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

	protected getTagKeys(columns: Array<TableColumnInternal<T>>, data: T[]) {
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
				} else if (addedFirstTag && c.key === TAGS_COLUMN_KEY && !c.selected) {
					// make the "Tags" column pop when we first add a tag
					c.selected = true;
				}
				return c;
			});
		}

		return { tagKeys, selectedTagColumnKeys, newTagColumnKeys };
	}

	protected getNewStateSlice(
		columns: Array<TableColumnInternal<T>>,
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

	protected setColumns(newColumns: Array<TableColumnInternal<T>>) {
		const newState = this.getNewStateSlice(newColumns.slice(), this.props.data);
		return new Promise<void>((resolve) => this.setState(newState, resolve));
	}

	protected saveColumnPreferences(newColumns: TableColumnState[]) {
		if (this.props.saveColumnPreferences) {
			this.props.saveColumnPreferences(newColumns);
		} else {
			saveColumnPreferences(this.props.columnStateRestorationKey, newColumns);
		}
	}

	protected setColumnsAndSave = async (
		columns: Array<TableColumnInternal<T>>,
	) => {
		await this.setColumns(columns);
		// if nothing breaks, save the column preferences
		this.saveColumnPreferences(columns);
	};

	protected addTagColumn = () => {
		const { tagKeys, newTagColumnKeys, allColumns, selectedTagColumnKeys } =
			this.state;
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

	protected setTagTableColumnHeader(
		state: { tagKeys: string[]; selectedTagColumnKeys: string[] },
		column: TableColumnInternal<T>,
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

	protected configureTagColumn = (
		column: TableColumnInternal<T>,
		tagKey: string,
	) => {
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

	protected onSort = (sort: TableSortOptions<T>) => {
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
			sortingStateRestorationKey,
			columnStateRestorationKey,
			loadColumnPreferences,
			saveColumnPreferences,
			sort: sortProp,
			innerRef,
			onSort,
			onRowClick,
			...props
		} = this.props;

		const sort =
			sortProp || (sortingStateRestorationKey ? this.state.sort : undefined);

		return (
			<Container>
				<Flex flexDirection="column" flex="1" width="100%">
					<TypedTable<T>
						columns={this.state.visibleColumns}
						ref={innerRef}
						sort={sort}
						onSort={this.onSort}
						onRowClick={onRowClick}
						{...props}
					/>
				</Flex>
				{this.props.enableCustomColumns && (
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

export { TableBaseColumn, TableRow, TableSortOptions };
