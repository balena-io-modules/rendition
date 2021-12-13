import * as React from 'react';
import filter from 'lodash/filter';
import qs from 'qs';
import { JSONSchema } from '../../../components/Renderer/types';
import {
	Filters,
	FilterSignature,
	FiltersProps,
	FiltersView,
} from '../../../components/Filters';
import {
	createFilter,
	createFullTextSearchFilter,
	decodeFilter,
	flattenSchema,
	FULL_TEXT_SLUG,
} from '../../../components/Filters/SchemaSieve';
import { getFromLocalStorage, setToLocalStorage } from '../../../utils';
import type { History } from 'history';

export interface ListQueryStringFilterObject {
	n: FilterSignature['field'];
	o: FilterSignature['operator'];
	v: FilterSignature['value'];
}

const isListQueryStringFilterRule = (
	rule: any,
): rule is ListQueryStringFilterObject =>
	rule != null &&
	typeof rule === 'object' &&
	// it has to have an associated field
	!!rule.n &&
	typeof rule.n === 'string' &&
	// it should at least have an operator
	((!!rule.o && typeof rule.o === 'string') ||
		// or a value
		!!rule.v);

const isQueryStringFilterRuleset = (
	rule: any,
): rule is ListQueryStringFilterObject[] =>
	Array.isArray(rule) &&
	!!rule?.length &&
	rule?.every(isListQueryStringFilterRule);

const listFilterQuery = (schema: JSONSchema, rules: JSONSchema[]) => {
	const queryStringFilters = rules.map((filter) => {
		// TODO: The typings need to be fixed in rendition.
		const flatSchema = flattenSchema(schema);
		const flattenFilter = flattenSchema(filter);
		const signatures = decodeFilter(
			flatSchema,
			flattenFilter,
		) as FilterSignature[];
		return signatures.map<ListQueryStringFilterObject>(
			({ field, operator, value }) => ({
				n: field,
				o: operator,
				v: value,
			}),
		);
	});
	return qs.stringify(queryStringFilters);
};

const loadRulesFromUrl = (
	searchLocation: string,
	schema: JSONSchema,
): JSONSchema[] => {
	if (!searchLocation) {
		return [];
	}
	const parsed = qs.parse(searchLocation, { ignoreQueryPrefix: true }) || {};
	const rules = filter(parsed, isQueryStringFilterRuleset).map(
		// @ts-expect-error
		(rules: ListQueryStringFilterObject[]) => {
			if (!Array.isArray(rules)) {
				rules = [rules];
			}

			const signatures = rules.map(({ n, o, v }: any) => ({
				field: n,
				operator: o,
				value: v,
			}));
			// full_text_search filter has always a single signature
			// since we cannot add multiple search text filters.
			// TODO: createFilter should handle this case as well.
			if (signatures[0].operator === FULL_TEXT_SLUG) {
				// TODO: listFilterQuery serializes the already escaped value and this
				// then re-escapes while de-serializing. Fix that loop, which can keep
				// escaping regex characters (eg \) indefinitely on each call/reload from the url.
				return createFullTextSearchFilter(schema, signatures[0].value);
			}
			return createFilter(schema, signatures);
		},
	);

	return rules;
};

interface PersistentFiltersProps extends FiltersProps {
	viewsRestorationKey: string;
	history: History;
}

export const PersistentFilters = ({
	schema,
	views,
	filters,
	onViewsUpdate,
	onFiltersUpdate,
	viewsRestorationKey,
	history,
	onSearch,
	...otherProps
}: PersistentFiltersProps) => {
	const storedViews = React.useMemo(
		() => getFromLocalStorage<FiltersView[]>(viewsRestorationKey) ?? [],
		[viewsRestorationKey],
	);
	const locationSearch = history?.location?.search ?? '';
	const storedFilters = React.useMemo(() => {
		return loadRulesFromUrl(locationSearch, schema);
	}, [locationSearch, schema]);

	React.useEffect(() => {
		if (!views?.length && storedViews.length && onViewsUpdate) {
			onViewsUpdate(storedViews);
		}
	}, []);

	const updateUrl = (filters: JSONSchema[]) => {
		const { pathname } = window.location;
		history?.replace?.({
			pathname,
			search: listFilterQuery(schema, filters),
		});
	};

	// When the component mounts, filters from the page URL,
	// then communicate them back to the parent component.
	React.useEffect(() => {
		onFiltersUpdate?.(storedFilters);
	}, [storedFilters]);

	const viewsUpdate = (views: FiltersView[]) => {
		setToLocalStorage(viewsRestorationKey, views);

		if (onViewsUpdate) {
			onViewsUpdate(views);
		}
	};

	const filtersUpdate = (filters: JSONSchema[]) => {
		updateUrl(filters);

		if (onFiltersUpdate) {
			onFiltersUpdate(filters);
		}
	};

	return (
		<Filters
			schema={schema}
			filters={filters ?? storedFilters}
			views={views ?? storedViews}
			onFiltersUpdate={filtersUpdate}
			onViewsUpdate={viewsUpdate}
			{...otherProps}
			onSearch={onSearch}
		/>
	);
};
