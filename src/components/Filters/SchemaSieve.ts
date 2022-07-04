import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaults';
import every from 'lodash/every';
import findKey from 'lodash/findKey';
import includes from 'lodash/includes';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import startsWith from 'lodash/startsWith';
import trimStart from 'lodash/trimStart';
import without from 'lodash/without';
import { FilterSignature } from '.';
import { randomString } from '../../utils';
import { getDataModel } from '../DataTypes';

const ajv = new Ajv();
ajvKeywords(ajv, ['regexp', 'formatMaximum', 'formatMinimum']);

export const FULL_TEXT_SLUG = 'full_text_search';
const DEFAULT_DELIMITER = '___';
interface FullTextFilterItem {
	key: string;
	schema: JSONSchema;
	operator: string;
	model: any;
	searchKey?: string;
}

export function filter<T>(
	filters: JSONSchema | JSONSchema[],
	collection: T[],
): T[];
export function filter<T>(
	filters: JSONSchema | JSONSchema[],
	collection: Record<string, T>,
): Record<string, T>;
export function filter<T>(
	filters: JSONSchema | JSONSchema[],
	collection: T[] | Record<string, T>,
) {
	// Remove all schemas that may have been compiled already
	ajv.removeSchema(/^.*$/);

	const validators = Array.isArray(filters)
		? filters.map((s) => ajv.compile(s))
		: [ajv.compile(filters)];

	if (Array.isArray(collection)) {
		return collection.filter((m) => every(validators, (v) => v(m)));
	}

	return pickBy(collection, (m) => every(validators, (v) => v(m)));
}

export const createFullTextSearchFilter = (
	schema: JSONSchema,
	term: string,
) => {
	const items = !!schema.properties
		? Object.entries(schema.properties as JSONSchema).reduce(
				(itemsAccumulator, entry) => {
					const [key, item] = entry;
					const model = getDataModel(item);
					const defaultItem = {
						key,
						schema: item,
						model,
					};
					if (item.type?.includes('boolean')) {
						return itemsAccumulator;
					}
					if (!!model && (!item.type || !item.type.includes('object'))) {
						itemsAccumulator.push({
							...defaultItem,
							operator:
								model?.operators && 'contains' in model.operators
									? 'contains'
									: 'is',
						});
					} else if (!!model && item.type?.includes('object')) {
						itemsAccumulator.push({
							...defaultItem,
							operator: 'key_contains',
							searchKey: findKey(item.properties!, { description: 'key' })!,
						});
						itemsAccumulator.push({
							...defaultItem,
							operator: 'value_contains',
							searchKey: findKey(item.properties!, { description: 'value' })!,
						});
					}
					return itemsAccumulator;
				},
				[] as FullTextFilterItem[],
		  )
		: [];
	const filter = generateFullTextSearchAjvFilter(term, items);
	return filter;
};

// A schema that matches applies the pattern to each schema field
const generateFullTextSearchAjvFilter = (
	term: string,
	items: FullTextFilterItem[],
): JSONSchema => {
	return {
		$id: randomString(),
		title: FULL_TEXT_SLUG,
		anyOf: [
			{
				title: FULL_TEXT_SLUG,
				description: `Any field contains ${term}`,
				anyOf: items.map(({ key, schema, operator, model, searchKey }) => {
					const val = searchKey ? { [searchKey]: term } : term;
					return model?.createFilter(key, operator, val, schema);
				}),
			},
		],
	};
};

// Insert a full text search filter into an array of filters
export const insertFullTextSearch = (
	schema: JSONSchema,
	filters: JSONSchema[] = [],
	term: string,
) => {
	const searchFilter = createFullTextSearchFilter(schema, term);
	return filters.concat(searchFilter);
};

// Removes a full text search filter from an array of filters
export const removeFullTextSearch = (filters: JSONSchema[]) =>
	filters.filter((f) => f.title !== FULL_TEXT_SLUG);

export const createFilter = (
	schema: JSONSchema,
	signatures: FilterSignature[],
): JSONSchema => {
	const anyOf = signatures.map(({ field, operator, value }) => {
		const subSchema = schema.properties![field] as JSONSchema;
		const model = getDataModel(subSchema);

		if (!model || !model.operators.hasOwnProperty(operator)) {
			return {};
		}

		return (
			model.createFilter as (
				field: string,
				operator: string,
				value: any,
				subSchema: JSONSchema,
			) => JSONSchema
		)(field, operator, value, subSchema);
	});

	return {
		$id: randomString(),
		anyOf,
	};
};

export const decodeFilter = (schema: JSONSchema, filter: JSONSchema) => {
	const signatures = filter.anyOf!.map((f: JSONSchema) => {
		if (!f) {
			return null;
		}

		if (
			!f.properties &&
			(!f.anyOf || !f.anyOf.length || !(f.anyOf[0] as JSONSchema).properties)
		) {
			return null;
		}
		const schemaField = f.anyOf
			? Object.keys((f.anyOf[0] as JSONSchema).properties!).shift()!
			: Object.keys(f.properties!).shift()!;
		const subSchema = schema.properties![schemaField] as JSONSchema;
		const model = getDataModel(subSchema);

		if (!model) {
			return {};
		}

		return (model.decodeFilter as (f: JSONSchema) => FilterSignature)(f);
	});

	return signatures.filter((s) => s !== null);
};

export const getOperators = (schema: JSONSchema, field: string) => {
	const subSchema = schema.properties![field] as JSONSchema;
	const model = getDataModel(subSchema);

	if (!model) {
		return [];
	}

	return map(model.operators, (value, key) => ({
		slug: key,
		label: (value as any).getLabel(subSchema),
	}));
};

// The inner recursive function used by `flattenSchema`. Mutates the
// `accumulator` argument.
const flattenAccumulator = (
	schema: JSONSchema,
	delimiter: string,
	parentKey: string = '',
	accumulator?: JSONSchema,
): JSONSchema => {
	if (!accumulator) {
		accumulator = cloneDeep(schema);

		if (schema.properties) {
			accumulator.properties = {};
		}
	}

	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		accumulator.anyOf = schema.anyOf.map((subSchema) =>
			flattenAccumulator(subSchema as JSONSchema, delimiter, parentKey),
		);
	}

	return reduce(
		schema.properties,
		(result, value, key) => {
			if (typeof value === 'boolean') {
				return accumulator;
			}

			const newKey = parentKey + delimiter + key;

			// Move any required fields into flattened items in the top-level required array
			value.required?.forEach((requiredKey) => {
				if (!result.required) {
					result.required = [];
				} else {
					// Remove any unnecessary required items pointing at parent fields
					result.required = without(
						result.required,
						key,
						parentKey + delimiter + key,
					);
				}
				result.required.push(newKey + delimiter + requiredKey);
			});

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
	) as JSONSchema;
};

// Reduces a multi level schema to a single level
export const flattenSchema = (
	schema: JSONSchema,
	delimiter: string = DEFAULT_DELIMITER,
): JSONSchema => {
	return flattenAccumulator(schema, delimiter);
};

// Restores a schema that has been flattened with `flattenSchema()`
export const unflattenSchema = (
	schema: JSONSchema,
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
				head = head.properties![key] as JSONSchema;
			}

			// Finally, use the last key to set the actual value of the field
			head.properties![lastKey] = value;

			return result;
		},
		base,
	);

	// If the schema uses `anyOf` then use recursion to populate the array
	if (unflattenedSchema.anyOf) {
		unflattenedSchema.anyOf = unflattenedSchema.anyOf.map((subSchema) =>
			unflattenSchema(subSchema as JSONSchema, delimiter),
		);
	}

	// Unflatten any required fields
	if (unflattenedSchema.required) {
		const requiredFields = unflattenedSchema.required;

		// Reset the `required` array so it can be repopulated
		unflattenedSchema.required = [];

		requiredFields.forEach((requiredField) => {
			const fields = trimStart(requiredField, delimiter).split(delimiter);

			let head = unflattenedSchema;

			for (const field of fields) {
				if (!head.required) {
					head.required = [];
				}

				if (!includes(head.required, field)) {
					head.required.push(field);
				}

				head = head.properties![field] as JSONSchema;
			}
		});
	}

	return unflattenedSchema;
};

export const getCleanEditModel = (
	schema: JSONSchema,
	field?: string | null,
) => {
	if (!field) {
		field = Object.keys(schema.properties!).shift()!;
	}

	const fieldOperators = getOperators(schema, field);
	if (!fieldOperators.length) {
		return {
			field,
			operator: '',
			value: '',
		};
	}

	const operator = fieldOperators.shift()!.slug;

	let value: any = '';
	const subschema = schema.properties![field];
	if (typeof subschema !== 'boolean') {
		if (subschema.enum) {
			value = subschema.enum[0] || '';
		}

		if (subschema.oneOf) {
			value = (subschema.oneOf[0] as JSONSchema).const || '';
		}

		if (subschema.type === 'boolean') {
			value = true;
		}
	}

	return {
		field,
		operator,
		value,
	};
};
