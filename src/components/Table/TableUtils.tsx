import {
	PredefinedTableColumnState,
	TableColumnState,
	TagTableColumnState,
} from './TableColumnSelector';
import { TableColumn } from './TableRow';

export const ALL_TAGS_COLUMN_KEY = 'All Tags';
export type TableColumnWithStateProps<T> = TableColumn<T> & TableColumnState;
export type TaggedResource = { id: number };
export interface ResourceTagBase {
	id: number;
	tag_key: string;
	value: string;
}

export const TableColumnStateStoredProps: Array<
	keyof PredefinedTableColumnState | keyof TagTableColumnState
> = ['key', 'selected', 'type', 'tagKey'];

export const getResourceTags = <T extends TaggedResource, P extends keyof T>(
	item: T,
	tagField: P,
) => item?.[tagField] as ResourceTagBase[] | undefined;

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
