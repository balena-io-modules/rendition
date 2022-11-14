import type { JSONSchema7 as JSONSchema } from 'json-schema';
import get from 'lodash/get';
import {
	convertRefSchemeToSchemaPath,
	EditSchema,
	getModelFilter,
	getPropertyScheme,
	Operator,
} from '../Filters/SchemaSieve';
import type { CreateFilter } from './utils';
import { getDataModel } from '.';

export const operators = () => ({
	contains: 'contains',
	not_contains: 'does not contain',
});

export type OperatorSlug = keyof ReturnType<typeof operators>;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
	schema,
	_refScheme,
	isFullTextSearch,
) => {
	const filter = getFilter(field, schema, value, operator, isFullTextSearch);

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
	operator: Operator<OperatorSlug>,
	isFullTextSearch?: boolean,
): JSONSchema => {
	if (
		!!schema?.items &&
		typeof schema.items !== 'boolean' &&
		'properties' in schema.items &&
		!!schema.items.properties
	) {
		const propertyFilters = Object.entries(schema.items.properties).map(
			([propKey, propSchema]: [string, JSONSchema]) => {
				return getModelFilter(
					propSchema,
					propKey,
					operator,
					value,
					isFullTextSearch,
					convertOperator,
				);
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
	const isSchemaItems =
		!!schema?.items &&
		typeof schema.items !== 'boolean' &&
		'type' in schema.items;
	const filterSchema = isSchemaItems ? (schema.items as JSONSchema) : schema;
	const filter = getModelFilter(
		filterSchema,
		field,
		operator,
		value,
		isFullTextSearch,
		convertOperator,
	);
	const recursiveFilter = filter.properties?.[field] as JSONSchema;
	const targetFilter =
		isSchemaItems && recursiveFilter ? recursiveFilter : filter;

	if (typeof targetFilter.not === 'object') {
		// TODO: avj doesn't support { contains: { not: ... } },
		// so we have to convert it
		return {
			not: { contains: targetFilter.not },
		};
	}
	return { contains: targetFilter };
};

const convertOperator = (
	operator: Operator<OperatorSlug>,
	operators: Record<string, string> | undefined,
): Operator<OperatorSlug | 'is' | 'is_not'> => {
	if (operators != null && operator.slug in operators) {
		return operator;
	}
	if (/(?:\b|_)not(?:\b|_)/.test(operator.slug)) {
		return { slug: 'is_not', label: 'is not' };
	}
	return { slug: 'is', label: 'is' };
};

export const editSchema = (
	schema: JSONSchema,
	operator: Operator<OperatorSlug> | undefined,
): JSONSchema => {
	const refScheme = getPropertyScheme(schema);
	const schemaItems = schema.items as JSONSchema | undefined;
	const convertedRefScheme = convertRefSchemeToSchemaPath(refScheme);
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
