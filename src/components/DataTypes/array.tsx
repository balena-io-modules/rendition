import type { JSONSchema7 as JSONSchema } from 'json-schema';
import get from 'lodash/get';
import {
	convertRefSchemeToSchemaPath,
	EditSchema,
	FULL_TEXT_SLUG,
	getModelFilter,
	getPropertyScheme,
	Operator,
} from '../Filters/SchemaSieve';
import type { CreateFilter } from './utils';
import { getDataModel, OperatorSlugs } from '.';

export const operators = () => ({
	contains: 'contains',
	not_contains: 'does not contain',
});

export type OperatorSlug =
	| keyof ReturnType<typeof operators>
	| typeof FULL_TEXT_SLUG;

const isSchemaWithPrimitiveItems = (
	schema: JSONSchema,
): schema is JSONSchema & { items: JSONSchema } =>
	!!schema?.items &&
	typeof schema.items !== 'boolean' &&
	'type' in schema.items;

export const createFilter: CreateFilter<OperatorSlugs> = (
	field,
	operator,
	value,
	schema,
	_refScheme,
) => {
	const filter = getFilter(field, schema, value, operator);

	if (!Object.keys(filter).length) {
		return {};
	}

	return {
		properties: {
			[field]: {
				type: 'array',
				...filter,
			},
		},
		required: [field],
	};
};

export const getFilter = (
	field: string,
	schema: JSONSchema,
	value: string,
	operator: Operator<OperatorSlugs>,
): JSONSchema => {
	// RefScheme and array of objects
	if (
		!!schema?.items &&
		typeof schema.items !== 'boolean' &&
		'properties' in schema.items &&
		!!schema.items.properties
	) {
		const propertyFilters = Object.entries(schema.items.properties).map(
			([propKey, propSchema]: [string, JSONSchema]) => {
				return getModelFilter(propSchema, propKey, operator, value);
			},
		);
		return {
			minItems: 1,
			contains:
				propertyFilters.length === 1
					? propertyFilters[0]
					: {
							anyOf: propertyFilters,
					  },
		};
	}

	// Array of primitives
	const hasPrimitiveItems = isSchemaWithPrimitiveItems(schema);
	const filterSchema = hasPrimitiveItems ? schema.items : schema;
	// For strings we can use contains/not_contains, otherwise
	const innerOperator =
		operator.slug === FULL_TEXT_SLUG ||
		(hasPrimitiveItems && schema.items.type === 'string')
			? operator
			: convertOperatorToIs(operator);
	const filter = getModelFilter(filterSchema, field, innerOperator, value);
	// This handles Object description key|value case (eg: tags)
	const recursiveFilter = filter.properties?.[field] as JSONSchema;
	const targetFilter =
		hasPrimitiveItems && recursiveFilter ? recursiveFilter : filter;

	if (!Object.keys(targetFilter).length) {
		return targetFilter;
	}

	if (typeof targetFilter.not === 'object') {
		// TODO: avj doesn't support { contains: { not: ... } },
		// so we have to convert it
		return {
			not: { contains: targetFilter.not },
		};
	}
	return { minItems: 1, contains: targetFilter };
};

const convertOperatorToIs = (
	operator: Operator<OperatorSlugs>,
): Operator<OperatorSlugs | 'is' | 'is_not'> => {
	if (operator.slug === 'not_contains') {
		return { slug: 'is_not', label: 'is not' };
	}
	if (operator.slug === 'contains') {
		return { slug: 'is', label: 'is' };
	}
	return operator;
};

export const editSchema = (
	schema: JSONSchema,
	operator: Operator<OperatorSlugs> | undefined,
): JSONSchema => {
	const refScheme = getPropertyScheme(schema);
	const schemaItems = schema.items as JSONSchema | undefined;
	// TODO: find a way to handle x-foreign-key-scheme on array types
	const convertedRefScheme = convertRefSchemeToSchemaPath(refScheme?.[0]);
	if (!!schemaItems && !!convertedRefScheme) {
		const property = get(
			schemaItems.properties,
			convertedRefScheme,
		) as JSONSchema['properties'];
		return property as JSONSchema;
	}
	const subSchema = schemaItems || schema;
	const model = getDataModel(subSchema);
	return model && 'editSchema' in model
		? (model.editSchema as EditSchema)(subSchema, operator)
		: subSchema;
};
