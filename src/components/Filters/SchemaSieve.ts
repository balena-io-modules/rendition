import Ajv = require('ajv');
import ajvKeywords = require('ajv-keywords');
import metaSchema6 = require('ajv/lib/refs/json-schema-draft-06.json');
import { JSONSchema6 } from 'json-schema';
import every = require('lodash/every');
import findIndex = require('lodash/findIndex');
import forEach = require('lodash/forEach');
import isArray = require('lodash/isArray');
import map = require('lodash/map');
import pickBy = require('lodash/pickBy');
import { FilterSignature, FiltersView, v3, ViewScope } from 'rendition';
import * as utils from '../../utils';
import DataTypes from '../DataTypes';

const ajv = new Ajv();
ajvKeywords(ajv);
ajv.addMetaSchema(metaSchema6);

const FULL_TEXT_SLUG = 'full_text_search';

export const filter = (
	filters: JSONSchema6 | JSONSchema6[],
	collection: any[],
) => {
	// Remove all schemas that may have been compiled already
	ajv.removeSchema(/^.*$/);

	const validators = isArray(filters)
		? filters.map(s => ajv.compile(s))
		: [ajv.compile(filters)];

	if (isArray(collection)) {
		return collection.filter(m => every(validators, v => v(m)));
	}

	return pickBy(collection, m => every(validators, v => v(m)));
};

export const getDataModel = (schema?: JSONSchema6) => {
	if (!schema) {
		return null;
	}

	const { format, type } = schema;

	if (schema.enum) {
		return DataTypes.enum;
	}
	if (type === 'string') {
		if (format === 'date-time') {
			return DataTypes.date_time;
		}
		return DataTypes.string;
	}
	if (type === 'object') {
		return DataTypes.object;
	}
	if (type === 'boolean') {
		return DataTypes.boolean;
	}
	if (type === 'number') {
		return DataTypes.number;
	}

	return null;
};

export const createFullTextSearchFilter = (
	schema: JSONSchema6,
	term: string,
) => {
	// A schema that matches applies the pattern to each known schema field
	const filter = {
		$id: utils.randomString(),
		title: FULL_TEXT_SLUG,
		anyOf: [
			{
				description: `Full text search is ${term}`,
				anyOf: Object.keys(schema.properties!).map(key => ({
					properties: {
						[key]: {
							type: 'string',
							regexp: {
								pattern: utils.regexEscape(term),
								flags: 'i',
							},
						},
					},
					required: [key],
				})),
			},
		],
	};

	return filter as JSONSchema6;
};

// Update or insert a full text search filter into an array of filters
export const upsertFullTextSearch = (
	schema: JSONSchema6,
	filters: JSONSchema6[] = [],
	term: string,
) => {
	const searchFilter = createFullTextSearchFilter(schema, term);
	const existingSearchIndex = findIndex(filters, { title: FULL_TEXT_SLUG });

	if (existingSearchIndex > -1) {
		filters.splice(existingSearchIndex, 1, searchFilter);
	} else {
		filters.push(searchFilter as JSONSchema6);
	}

	return filters;
};

// Removes a full text search filter from an array of filters
export const removeFullTextSearch = (filters: JSONSchema6[]) =>
	filters.filter(f => f.title !== FULL_TEXT_SLUG);

export const createFilter = (
	schema: JSONSchema6,
	signatures: FilterSignature[],
): JSONSchema6 => {
	const anyOf = signatures.map(({ field, operator, value }) => {
		const subSchema = schema.properties![field] as JSONSchema6;
		const model = getDataModel(subSchema);

		if (!model || !model.operators.hasOwnProperty(operator)) {
			return {};
		}

		return model.createFilter(field, operator as any, value, subSchema);
	});

	return {
		$id: utils.randomString(),
		anyOf,
	};
};

export const decodeFilter = (schema: JSONSchema6, filter: JSONSchema6) => {
	const signatures = filter.anyOf!.map(f => {
		const schemaField = Object.keys(f.properties!).shift()!;
		const subSchema = schema.properties![schemaField] as JSONSchema6;
		const model = getDataModel(subSchema);

		if (!model) {
			return {};
		}

		return model.decodeFilter(f);
	});

	return signatures.filter(s => s !== null);
};

export const getOperators = (schema: JSONSchema6, field: string) => {
	const subSchema = schema.properties![field] as JSONSchema6;
	const model = getDataModel(subSchema);

	if (!model) {
		return [];
	}

	return map(model.operators, (value, key) => ({
		slug: key,
		label: value.getLabel(subSchema),
	}));
};

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
	legacyFilter: v3.Filter,
): JSONSchema6 => {
	if (legacyFilter.name === 'Full text search') {
		return createFullTextSearchFilter(schema, legacyFilter.value);
	}

	const signatures: Array<FilterSignature | null> = [];

	if (legacyFilter.extra) {
		const extraSignatures = legacyFilter.extra.or.map(getLegacyFilterSignature);
		Array.prototype.push.apply(signatures, extraSignatures);
	}

	signatures.push(getLegacyFilterSignature(legacyFilter));

	return createFilter(schema, signatures.filter(
		s => s !== null,
	) as FilterSignature[]);
};

// Converts v3 views to v4 views + scopes
export const migrateLegacyViews = (
	schema: JSONSchema6,
	legacyViews: v3.FilterViewScope[],
) => {
	const views: FiltersView[] = [];
	const viewScopes: ViewScope[] = [];

	legacyViews.forEach(scope => {
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
				filters: legacyView.rules.map(rule => migrateLegacyFilter(schema, rule)),
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
