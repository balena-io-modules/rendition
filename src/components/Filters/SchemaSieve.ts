import Ajv = require('ajv');
import ajvKeywords = require('ajv-keywords');
import metaSchema6 = require('ajv/lib/refs/json-schema-draft-06.json');
import { JSONSchema6 } from 'json-schema';
import cloneDeep = require('lodash/cloneDeep');
import defaults = require('lodash/defaults');
import every = require('lodash/every');
import findIndex = require('lodash/findIndex');
import findKey = require('lodash/findKey');
import isArray = require('lodash/isArray');
import isBoolean = require('lodash/isBoolean');
import map = require('lodash/map');
import pickBy = require('lodash/pickBy');
import reduce = require('lodash/reduce');
import startsWith = require('lodash/startsWith');
import trimStart = require('lodash/trimStart');
import { FilterSignature } from 'rendition';
import * as utils from '../../utils';
import { getDataModel } from '../DataTypes';

const ajv = new Ajv();
ajvKeywords(ajv, ['regexp', 'formatMaximum', 'formatMinimum']);
ajv.addMetaSchema(metaSchema6);

export const FULL_TEXT_SLUG = 'full_text_search';
const DEFAULT_DELIMITER = '___';

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

export const createFullTextSearchFilter = (
	schema: JSONSchema6,
	term: string,
) => {
	const stringKeys = reduce(
		schema.properties,
		(carry, item: JSONSchema6, key) => {
			if (item.type === 'string') {
				carry.push(key);
			}

			return carry;
		},
		[] as string[],
	);

	// A schema that matches applies the pattern to each schema field with a type
	// of 'string'
	const filter = {
		$id: utils.randomString(),
		title: FULL_TEXT_SLUG,
		anyOf: [
			{
				description: `Any field contains ${term}`,
				anyOf: stringKeys.map(key => ({
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

		return (model.createFilter as (
			field: string,
			operator: string,
			value: any,
			subSchema: JSONSchema6,
		) => JSONSchema6)(field, operator, value, subSchema);
	});

	return {
		$id: utils.randomString(),
		anyOf,
	};
};

export const decodeFilter = (schema: JSONSchema6, filter: JSONSchema6) => {
	const signatures = filter.anyOf!.map(f => {
		if (
			!f.properties &&
			(!f.anyOf || !f.anyOf.length || !f.anyOf[0].properties)
		) {
			return null;
		}
		const schemaField = f.anyOf
			? Object.keys(f.anyOf[0].properties!).shift()!
			: Object.keys(f.properties!).shift()!;
		const subSchema = schema.properties![schemaField] as JSONSchema6;
		const model = getDataModel(subSchema);

		if (!model) {
			return {};
		}

		return (model.decodeFilter as (f: JSONSchema6) => FilterSignature)(f);
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

// The inner recursive function used by `flattenSchema`. Mutates the
// `accumulator` argument.
const flattenAccumulator = (
	schema: JSONSchema6,
	delimiter: string,
	parentKey: string = '',
	accumulator?: JSONSchema6,
): JSONSchema6 => {
	if (!accumulator) {
		accumulator = cloneDeep(schema);

		if (schema.properties) {
			accumulator.properties = {};
		}
	}

	if (schema.anyOf && isArray(schema.anyOf)) {
		accumulator.anyOf = schema.anyOf.map(subSchema =>
			flattenAccumulator(subSchema, delimiter, parentKey),
		);
	}

	return reduce(
		schema.properties,
		(result, value, key) => {
			if (isBoolean(value)) {
				return accumulator;
			}

			const newKey = parentKey + delimiter + key;
			// If the value is not an object type or
			// If the value is a key value pair style object, it can be added to the
			// accumulator
			if (
				value.type !== 'object' ||
				(findKey(value.properties, { description: 'key' }) &&
					findKey(value.properties, { description: 'value' }))
			) {
				// If there is a parentKey then this function has been called recursively
				// and we should use the newKey
				if (parentKey) {
					result!.properties![newKey] = defaults(value, { title: key });
					return result;
				}

				// If there is no parentKey then we are at the top level and this field
				// does not need to be flattened/modified
				result!.properties![key] = value;
				return result;
			}

			return flattenAccumulator(value, delimiter, newKey, result);
		},
		accumulator,
	) as JSONSchema6;
};

// Reduces a multi level schema to a single level
export const flattenSchema = (
	schema: JSONSchema6,
	delimiter: string = DEFAULT_DELIMITER,
): JSONSchema6 => {
	return flattenAccumulator(schema, delimiter);
};

// Restores a schema that has been flattened with `flattenSchema()`
export const unflattenSchema = (
	schema: JSONSchema6,
	delimiter: string = DEFAULT_DELIMITER,
) => {
	const base = cloneDeep(schema);

	// Reset the properties object to clean up the flattened fields
	if (schema.properties) {
		base.properties = {};
	}

	const unflattenedSchema = reduce(
		schema.properties,
		(result, value, field) => {
			// Skip fields that don't start with the delimiter, as the property hasn't
			// been flattened
			if (!startsWith(field, delimiter)) {
				result.properties![field] = value;
				return result;
			}

			const keys = trimStart(field, delimiter).split(delimiter);
			const lastKey = keys.pop()!;

			let head = result;

			// Convert keys array into nested object schemas
			for (const key of keys) {
				// Don't overwrite an existing entry
				if (!head.properties![key]) {
					head.properties![key] = {
						type: 'object',
						properties: {},
					};
				}

				// Move the head pointer to the subschema that was just created
				head = head.properties![key] as JSONSchema6;
			}

			// Finally, use the last key to set the actual value of the field
			head.properties![lastKey] = value;

			return result;
		},
		base,
	);

	// If the schema uses `anyOf` then use recursion to populate the array
	if (unflattenedSchema.anyOf) {
		unflattenedSchema.anyOf = unflattenedSchema.anyOf.map(subSchema =>
			unflattenSchema(subSchema, delimiter),
		);
	}

	// Unflatten any required fields
	if (unflattenedSchema.required) {
		const requiredFields = unflattenedSchema.required;

		// Reset the `required` array so it can be repopulated
		unflattenedSchema.required = [];

		requiredFields.forEach(requiredField => {
			const fields = trimStart(requiredField, delimiter).split(delimiter);

			let head = unflattenedSchema;

			for (const field of fields) {
				if (!head.required) {
					head.required = [];
				}

				head.required.push(field);

				head = head.properties![field] as JSONSchema6;
			}
		});
	}

	return unflattenedSchema;
};
