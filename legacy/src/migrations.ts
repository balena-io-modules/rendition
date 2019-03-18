import { JSONSchema6 } from 'json-schema';
import forEach = require('lodash/forEach');
import isArray = require('lodash/isArray');
import {
	FilterSignature,
	FiltersView,
	MigrateLegacyViewsOutput,
	v3,
	ViewScope,
} from 'rendition';
import {
	createFilter,
	createFullTextSearchFilter,
} from './components/Filters/SchemaSieve';

const convertToBooleanSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature => {
	return {
		field: legacyFilter.name,
		value: legacyFilter.operator === 'is true',
		operator: 'is',
	};
};

const convertToStringSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature => {
	const signature = {
		field: legacyFilter.name,
		value: legacyFilter.value,
		operator: '',
	};

	switch (legacyFilter.operator) {
		case 'does not contain':
			signature.operator = 'not_contains';
			break;
		case 'matches RegEx':
			signature.operator = 'matches_re';
			break;
		case 'does not match RegEx':
			signature.operator = 'not_matches_re';
			break;

		// Includes 'is' and 'contains' operators which have not changed
		default:
			signature.operator = legacyFilter.operator || '';
			break;
	}

	return signature;
};

const convertToDateTimeSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature => {
	const signature = {
		field: legacyFilter.name,
		value: legacyFilter.value,
		operator: '',
	};

	switch (legacyFilter.operator) {
		case 'is after':
			signature.operator = 'is_after';
			break;

		case 'is before':
			signature.operator = 'is_before';
			break;

		// Includes 'is' operator which has not changed
		default:
			signature.operator = legacyFilter.operator || '';
			break;
	}

	return signature;
};

const convertToEnumSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature => {
	const signature = {
		field: legacyFilter.name,
		value: legacyFilter.value,
		operator: '',
	};

	switch (legacyFilter.operator) {
		case 'is not':
			signature.operator = 'is_not';
			break;

		// Includes 'is' operator which has not changed
		default:
			signature.operator = legacyFilter.operator || '';
			break;
	}

	return signature;
};

const convertToNumberSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature => {
	const signature = {
		field: legacyFilter.name,
		value: legacyFilter.value,
		operator: '',
	};

	switch (legacyFilter.operator) {
		case 'equals':
			signature.operator = 'is';
			break;

		case 'more than':
			signature.operator = 'is_more_than';
			break;

		case 'less than':
			signature.operator = 'is_less_than';
			break;

		default:
			signature.operator = legacyFilter.operator || '';
			break;
	}

	return signature;
};

const convertToObjectSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature => {
	const signature = {
		field: legacyFilter.name,
		value: legacyFilter.value,
		operator: '',
	};

	switch (legacyFilter.operator) {
		case 'is':
			signature.operator = 'is';
			break;

		case 'is not':
			signature.operator = 'is_not';
			break;

		case 'key is':
			signature.operator = 'key_is';
			break;

		case 'key contains':
			signature.operator = 'key_contains';
			break;

		case 'key does not contain':
			signature.operator = 'key_not_contains';
			break;

		case 'key matches RegEx':
			signature.operator = 'key_matches_re';
			break;

		case 'key does not match RegEx':
			signature.operator = 'key_not_matches_re';
			break;

		case 'value is':
			signature.operator = 'value_is';
			break;

		case 'value contains':
			signature.operator = 'value_contains';
			break;

		case 'value does not contain':
			signature.operator = 'value_not_contains';
			break;

		case 'value matches RegEx':
			signature.operator = 'value_matches_re';
			break;

		case 'value does not match RegEx':
			signature.operator = 'value_not_matches_re';
			break;

		default:
			signature.operator = legacyFilter.operator || '';
			break;
	}

	return signature;
};

// Generate a filter signature from a legacy filter
const getLegacyFilterSignature = (
	legacyFilter: v3.BaseFilter,
): FilterSignature | null => {
	switch (legacyFilter.type) {
		case 'Boolean':
			return convertToBooleanSignature(legacyFilter);

		case 'Case Insensitive Text':
		case 'Short Text':
		case 'Text':
			return convertToStringSignature(legacyFilter);

		case 'Date Time':
		case 'Date':
		case 'Time':
			return convertToDateTimeSignature(legacyFilter);

		case 'Enum':
			return convertToEnumSignature(legacyFilter);

		case 'Integer':
		case 'Real':
			return convertToNumberSignature(legacyFilter);

		case 'Key Value Pair':
			return convertToObjectSignature(legacyFilter);

		default:
			return null;
	}
};

// Converts v3 filters to v4 filters
export const migrateLegacyFilter = (
	schema: JSONSchema6,
	legacyFilter: v3.Filter | JSONSchema6,
): JSONSchema6 => {
	// Check if this filter has already been converted, and return immediately if
	// it has
	if (!(legacyFilter as v3.Filter).name) {
		return legacyFilter as JSONSchema6;
	}

	const filter: v3.Filter = legacyFilter as v3.Filter;

	if (filter.name === 'Full text search') {
		return createFullTextSearchFilter(schema, filter.value);
	}

	const signatures: Array<FilterSignature | null> = [];

	signatures.push(getLegacyFilterSignature(filter));

	if (filter.extra) {
		const extraSignatures = filter.extra.or.map(getLegacyFilterSignature);
		Array.prototype.push.apply(signatures, extraSignatures);
	}

	return createFilter(schema, signatures.filter(
		s => s !== null,
	) as FilterSignature[]);
};

// Converts v3 views to v4 views + scopes
// This function can accept previously migrated input and return it unchaged in
// a safe manner
export const migrateLegacyViews = (
	schema: JSONSchema6,
	legacyViews: v3.FilterViewScope[] | MigrateLegacyViewsOutput | FiltersView[],
) => {
	if (
		isArray((legacyViews as MigrateLegacyViewsOutput).views) &&
		isArray((legacyViews as MigrateLegacyViewsOutput).viewScopes)
	) {
		return legacyViews;
	}

	const views: FiltersView[] = [];
	const viewScopes: ViewScope[] = [];

	(legacyViews as v3.FilterViewScope[]).forEach(scope => {
		// Check for the presense of `filters` indeicating that the view has already
		// beeen migrated
		if ((scope as any).filters) {
			views.push((scope as any) as FiltersView);
			return;
		}
		viewScopes.push({
			slug: scope.key,
			name: scope.title || '',
			label: scope.scopeLabel,
		});

		scope.data.forEach(legacyView => {
			views.push({
				id: legacyView.id,
				name: legacyView.name,
				scope: legacyView.scopeKey,
				filters: legacyView.rules.map(rule =>
					migrateLegacyFilter(schema, rule),
				),
			});
		});
	});

	return {
		views,
		viewScopes,
	};
};

// Converts v3 filter schemas to JSON schema
export const migrateLegacySchema = (legacySchema: v3.Schema) => {
	const schema: JSONSchema6 = {
		type: 'object',
		properties: {},
	};

	forEach(legacySchema, (item, key) => {
		switch (item.type) {
			case 'Boolean':
				schema!.properties![key] = {
					type: 'boolean',
				};
				break;

			case 'Case Insensitive Text':
			case 'Short Text':
			case 'Text':
				schema!.properties![key] = {
					type: 'string',
				};
				break;

			case 'Date Time':
			case 'Date':
			case 'Time':
				schema.properties![key] = {
					type: 'string',
					format: 'date-time',
				};
				break;

			case 'Enum':
				schema.properties![key] = {
					enum: item.values,
				};
				break;

			case 'Integer':
			case 'Real':
				schema.properties![key] = {
					type: 'number',
				};
				break;

			case 'Key Value Pair':
				schema.properties![key] = {
					type: 'object',
					properties: {
						[item.key!]: {
							title: item.keyLabel,
							description: 'key',
							type: 'string',
						},
						[item.value!]: {
							title: item.valueLabel,
							description: 'value',
							type: 'string',
						},
					},
				};
				break;

			default:
				return;
		}

		if (item.label) {
			(schema.properties![key] as JSONSchema6).title = item.label;
		}
	});

	return schema;
};
