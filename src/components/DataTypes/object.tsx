// TODO THINK HOW TO CREATE THE RIGHT OBJECT FILTER WHEN WE HAVE A CASE LIKE NESTEDSCHEMA
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import find from 'lodash/find';
import findKey from 'lodash/findKey';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import { regexEscape } from '../../utils';
import { UiSchema } from '@rjsf/core';
import {
	getModelFilter,
	getPropertyScheme,
	Operator,
} from '../Filters/SchemaSieve';
import type { CreateFilter } from './utils';

const getKeyLabel = (schema: JSONSchema) => {
	const s = find(schema.properties!, { description: 'key' })! as JSONSchema;
	return s && s.title ? s.title : 'key';
};

const getValueLabel = (schema: JSONSchema) => {
	const s = find(schema.properties!, { description: 'value' })! as JSONSchema;
	return s && s.title ? s.title : 'value';
};

export const isKeyValueObj = (schema: JSONSchema) =>
	!!find(schema.properties!, { description: 'key' }) ||
	!!find(schema.properties!, { description: 'value' });

export const operators = (s: JSONSchema) => {
	return {
		...(!getPropertyScheme(s)
			? {
					is: 'is',
					is_not: 'is not',
			  }
			: {}),
		...(!isKeyValueObj(s)
			? {
					contains: 'contains',
					not_contains: 'does not contain',
			  }
			: (() => {
					const keyLabel = getKeyLabel(s);
					const valueLabel = getValueLabel(s);
					return {
						key_contains: `${keyLabel} contains`,
						key_not_contains: `${keyLabel} does not contain`,
						key_is: `${keyLabel} is`,
						key_matches_re: `${keyLabel} matches RegEx`,
						key_not_matches_re: `${keyLabel} does not match RegEx`,
						value_is: `${valueLabel} is`,
						value_contains: `${valueLabel} contains`,
						value_not_contains: `${valueLabel} does not contain`,
						value_matches_re: `${valueLabel} matches RegEx`,
						value_not_matches_re: `${valueLabel} does not match RegEx`,
					};
			  })()),
	};
};

export type OperatorSlug = keyof ReturnType<typeof operators>;

const keySpecificOperators = [
	'key_is',
	'key_contains',
	'key_not_contains',
	'key_matches_re',
	'key_not_matches_re',
];

const valueSpecificOperators = [
	'value_is',
	'value_contains',
	'value_not_contains',
	'value_matches_re',
	'value_not_matches_re',
];

function getValueForOperation(
	operator: OperatorSlug,
	schema: JSONSchema,
	value: string | object,
) {
	if (keySpecificOperators.includes(operator)) {
		const schemaKey = findKey(schema.properties!, { description: 'key' })!;
		return typeof value === 'string'
			? { [schemaKey]: value }
			: pick(value, schemaKey);
	}
	if (valueSpecificOperators.includes(operator)) {
		const schemaValue = findKey(schema.properties!, { description: 'value' })!;
		return typeof value === 'string'
			? { [schemaValue]: value }
			: pick(value, schemaValue);
	}
	return value;
}

const getTitleForOperation = (
	operator: OperatorSlug,
	schema: JSONSchema,
	value: string | object,
) => {
	if (typeof value !== 'object' || !schema.properties) {
		return schema.title;
	}
	const property = schema.properties[Object.keys(value)[0]];
	if (
		[...keySpecificOperators, ...valueSpecificOperators].includes(operator) &&
		typeof property === 'object'
	) {
		return property.title;
	}
	return schema.title;
};

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
	schema,
): ReturnType<CreateFilter<OperatorSlug>> => {
	const operatorSlug = operator.slug;
	value = !!isKeyValueObj(schema)
		? getValueForOperation(operatorSlug, schema, value)
		: value;
	const propertyTitle = getTitleForOperation(operatorSlug, schema, value);

	const isFilter = (v: any) => ({ const: v });

	const containsFilter = (v: any) => ({
		description: v,
		regexp: {
			pattern: regexEscape(v),
			flags: 'i',
		},
	});

	const matchReGexFilter = (v: any) => ({
		pattern: v,
	});

	if (!isKeyValueObj(schema)) {
		return {
			properties: {
				[field]: getFilter(field, schema, value, operator),
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
					contains: {
						title: propertyTitle,
						properties: mapValues(value, (v) => ({ const: v })),
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_not') {
		return {
			properties: {
				[field]: {
					not: {
						contains: {
							title: propertyTitle,
							properties: mapValues(value, (v) => ({ const: v })),
						},
					},
				},
			},
		};
	}

	if (operatorSlug === 'key_is' || operatorSlug === 'value_is') {
		return {
			properties: {
				[field]: {
					contains: {
						title: propertyTitle,
						properties: mapValues(value, isFilter),
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'key_contains' || operatorSlug === 'value_contains') {
		return {
			properties: {
				[field]: {
					contains: {
						title: propertyTitle,
						properties:
							typeof value !== 'object'
								? containsFilter(value)
								: mapValues(value, containsFilter),
					},
				},
			},
			required: [field],
		};
	}

	if (
		operatorSlug === 'key_not_contains' ||
		operatorSlug === 'value_not_contains'
	) {
		return {
			properties: {
				[field]: {
					not: {
						contains: {
							title: propertyTitle,
							properties:
								typeof value !== 'object'
									? containsFilter(value)
									: mapValues(value, containsFilter),
						},
					},
				},
			},
		};
	}

	if (
		operatorSlug === 'key_matches_re' ||
		operatorSlug === 'value_matches_re'
	) {
		return {
			properties: {
				[field]: {
					contains: {
						title: propertyTitle,
						properties:
							typeof value !== 'object'
								? matchReGexFilter(value)
								: mapValues(value, matchReGexFilter),
					},
				},
			},
			required: [field],
		};
	}

	if (
		operatorSlug === 'key_not_matches_re' ||
		operatorSlug === 'value_not_matches_re'
	) {
		return {
			properties: {
				[field]: {
					not: {
						contains: {
							title: propertyTitle,
							properties:
								typeof value !== 'object'
									? matchReGexFilter(value)
									: mapValues(value, matchReGexFilter),
						},
					},
				},
			},
		};
	}

	return {};
};

export const editSchema = (
	schema: JSONSchema,
	operator: Operator<OperatorSlug> | undefined,
) => {
	const schemaKey = findKey(schema.properties!, { description: 'key' });
	const schemaValue = findKey(schema.properties!, { description: 'value' });
	if (
		!!operator &&
		keySpecificOperators.includes(operator.slug) &&
		!!schemaKey
	) {
		return {
			...schema,
			title: '',
			properties: pick(schema.properties, schemaKey),
		};
	}
	if (
		!!operator &&
		valueSpecificOperators.includes(operator.slug) &&
		!!schemaValue
	) {
		return {
			...schema,
			title: '',
			properties: pick(schema.properties, schemaValue),
		};
	}
	return { ...schema, title: '' };
};

export const uiSchema = (schema: JSONSchema) => {
	if (!schema.properties || typeof schema.properties !== 'object') {
		return {};
	}
	return (
		Object.entries(schema.properties)?.reduce(
			(
				acc: { [key: string]: UiSchema },
				[key, value]: [string, JSONSchema],
			) => {
				acc[key] = {
					'ui:options': {
						label: false,
						placeholder: typeof value.title === 'string' ? value.title : '',
					},
				};
				return acc;
			},
			{},
		) ?? {}
	);
};

export const getFilter = (
	field: string,
	schema: JSONSchema,
	value: string,
	operator: Operator<OperatorSlug>,
	refScheme?: string,
): JSONSchema => {
	if (!!schema?.properties && typeof schema.properties !== 'boolean') {
		return {
			anyOf: Object.entries(schema.properties).map(
				([propKey, propValue]: [string, JSONSchema]) => {
					const filter = getModelFilter(
						propValue,
						propKey,
						operator,
						value,
						undefined,
						refScheme ? convertOperator : undefined,
					);
					return filter;
				},
			),
		};
	}
	const fieldFilter = getModelFilter(
		schema,
		field,
		operator,
		value,
		undefined,
		refScheme ? convertOperator : undefined,
	);

	return {
		contains: fieldFilter.properties?.[field] as JSONSchema,
	};
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
