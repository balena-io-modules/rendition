import React from 'react';
import { TableSortOptions } from '.';
import { PredefinedTableColumnState, TableColumnState, TagTableColumnState } from "./TableColumnSelector";
import { TableColumn } from "./TableRow";
import { TagLabel } from './TagLabel';
import { TagLabelList } from './TagLabelList';
import pick from 'lodash/pick';
import size from 'lodash/size';
import keyBy from 'lodash/keyBy';
import without from 'lodash/without';

export const ALL_TAGS_COLUMN_KEY = 'All Tags';
export type TableColumnWithStateProps<T> = TableColumn<T> & TableColumnState;
export type TaggedResource = { id: number };
export interface ResourceTagBase {
  id: number;
  tag_key: string;
  value: string;
}

const tagCellAttributes = {
	href: undefined,
	style: {
		cursor: 'auto',
		paddingTop: '6px',
		paddingBottom: '6px',
	},
};

export const TableColumnStateStoredProps: Array<
	keyof PredefinedTableColumnState | keyof TagTableColumnState
> = ['key', 'selected', 'type', 'tagKey'];

export const getFromLocalStorage = <T extends any>(
	key: string,
): T | undefined => {
	try {
		const val = localStorage.getItem(key);
		if (val != null) {
			return JSON.parse(val);
		}

		return undefined;
	} catch (err) {
		console.error(err);
		return undefined;
	}
};

export const setToLocalStorage = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.error(err);
	}
};

export const removeFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.error(err);
	}
};

export const getResourceTags = <T extends TaggedResource, P extends keyof T>(
	item: T,
	tagField: P,
) => item?.[tagField] as ResourceTagBase[] | undefined;

export const isCustomTagColumn = (
	column: TableColumnState,
): column is TagTableColumnState =>
	column.type === 'tag' && column.key !== ALL_TAGS_COLUMN_KEY;

export const insertTagColumns = (
	columns: TableColumnState[],
	newTagColumns: TableColumnState[],
) => {
	let allTagsColumnIndex = columns.findIndex(column => column.key === ALL_TAGS_COLUMN_KEY);
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
	getResourceTags(taggedResource, tagField)?.find(tag => tag.tag_key === tagKey);

export const getTagTableColumn = <T extends TaggedResource>(
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

export const getAllTagsTableColumn = <T extends TaggedResource>(
	tagField: keyof T,
) =>
	normalizeTableColumn({
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
	} as TableColumnWithStateProps<T>);

	export const loadSortingPreferences = <T extends unknown>(
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
	
	export const saveSortingPreferences = <T extends unknown>(
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
	
	export const saveColumnPreferences = (
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
		columns: Array<TableColumnWithStateProps<T>>,
		loadedColumns: TableColumnState[] | undefined,
		tagField: keyof T | undefined,
	): Array<TableColumnWithStateProps<T>> => {
		if (!size(loadedColumns)) {
			return columns;
		}
	
		const columnsByKey = keyBy(columns, 'key');
		const loadedColumnsByKey = keyBy(loadedColumns, 'key');
	
		const tableColumnStateAssignedProps = without(
			TableColumnStateStoredProps,
			'key',
		);
	
		Object.keys(columnsByKey).forEach((key) => {
			const column = columnsByKey[key];
			const loadedColumn = loadedColumnsByKey[key];
	
			if (!loadedColumn) {
				return;
			}
	
			Object.assign(column, pick(loadedColumn, tableColumnStateAssignedProps));
		});
	
		// we need to populate the rest properties
		// for the restored tag columns
		if (tagField) {
			const loadedTagColumns = loadedColumns?.filter(isCustomTagColumn);
			const tagColumns = loadedTagColumns?.map((c) =>
				getTagTableColumn<T>(c, tagField),
			);
			insertTagColumns(columns, tagColumns || []);
		}
	
		columns.forEach(normalizeTableColumn);
	
		return columns;
	};
	
	export const addCustomColumns = <T extends TaggedResource>(
		// props: TableWithCustomColumnsProps<T>,
		props: any,
	) => {
		let allColumns = props.columns.map(normalizeTableColumn);
	
		if (props.tagField) {
			allColumns = allColumns.concat(getAllTagsTableColumn(props.tagField));
		}
	
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