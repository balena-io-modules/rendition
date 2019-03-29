import { JSONSchema6 } from 'json-schema';

export interface FiltersView {
	id: string;
	name: string;
	scope?: string | null;
	filters: JSONSchema6[];
}

export interface ViewScope {
	slug: string;
	name: string;
	label?: string;
}

// tslint:disable-next-line
export namespace v3 {
	export type PineDataType =
		| 'Boolean'
		| 'Case Insensitive Text'
		| 'Date Time'
		| 'Date'
		| 'Enum'
		| 'Integer'
		| 'Real'
		| 'Short Text'
		| 'Text'
		| 'Time'
		| 'Semver Range'
		| 'Semver'
		| 'Key Value Pair';

	export interface SchemaEntry {
		type: PineDataType;
		values?: string[];
		key?: string;
		value?: string;
		label?: string;
		keyLabel?: string;
		valueLabel?: string;
	}

	export interface Schema {
		[key: string]: SchemaEntry;
	}

	export interface BaseFilter {
		availableOperators: Array<{ label: string; value: string }>;
		label?: string;
		name: string;
		operator: string | null;
		type: PineDataType;
		value: any;
	}

	export interface Filter extends BaseFilter {
		id: string;
		extra?: {
			or: BaseFilter[];
		};
	}

	export interface SingleFilterView {
		id: string;
		name: string;
		scopeKey: string;
		rules: Filter[];
	}

	export interface FilterViewScope {
		key: string;
		scopeLabel?: string;
		title?: string;
		data: SingleFilterView[];
	}
}

export interface MigrateLegacyViewsOutput {
	views: FiltersView[];
	viewScopes: ViewScope[];
}

export interface Migrations {
	migrateLegacyFilter(
		schema: JSONSchema6,
		legacyFilter: v3.Filter,
	): JSONSchema6;
	migrateLegacyViews(
		schema: JSONSchema6,
		legacyViews:
			| v3.FilterViewScope[]
			| MigrateLegacyViewsOutput
			| FiltersView[],
	): MigrateLegacyViewsOutput;
	migrateLegacySchema(legacySchema: v3.Schema): JSONSchema6;
}
